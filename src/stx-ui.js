'use strict';
import { LitElement, css, html, unsafeCSS } from 'lit';
import swaptoxUI from './assets/css/ui.css?inline';

import { addTransaction } from './api/cloud/addTransaction.js';
import { getTokens } from './api/cloud/getTokens.js';
import { getProtocol } from './api/cloud/getProtocol.js';
import { getTokenList, allTokens } from './api/cloud/getTokenList.js';
import { tokenSinglePrice, tokenPrices } from './api/cloud/tokenSinglePrice.js';
import { networkData, defaultChain } from './data/network-data.js';
import { getSwapDefaultToken, setSwapFromToken, setSwapToToken } from './api/local/getSwapDefaultToken.js';
import { sdkStore } from './data/store/store.js';
import { StoreMixin } from './data/store/state-mixin.js';
import { batchQueryTokenBalance } from './api/chain/batchQueryTokenBalance.js';
import { $app } from './js_sdk/index.js';
import { viemUtils } from './js_sdk/viem/utils.js';
import { quoterRoute } from './api/cloud/quoterRoute.js';

import './com/stx-token-select-icon.js';
import './com/stx-token-input.js';
import './com/stx-token-output.js';
import './icon/com-icon-switch-token.js';
import './icon/com-icon-history.js';
import './icon/com-icon-close.js';
import './icon/com-icon-arrow-loading.js';
import './com/stx-token-selector/stx-token-selector.js';
import './com/stx-token-card/stx-token-card.js';
import './components/stxapp-mini-modal/stxapp-mini-modal.js';
import './components/stxapp-swap-button/stxapp-swap-button';
import './components/stxapp-route-trend/stxapp-route-trend-modal';
import './components/stxapp-route-trend/stxapp-route-trend';
import './components/stxapp-tips/stxapp-tips';
import './components/stxapp-swap-confirm/stxapp-swap-confirm-modal';
import './components/stxapp-swap-confirm/stxapp-swap-success-modal';
import './components/stxapp-swap-confirm/stxapp-swap-confirm';
import './components/stxapp-swap-state/stxapp-swap-state-modal';
import './components/stxapp-transactions-record/stxapp-transactions-record';
import './components/stxapp-transactions-record/stxapp-transactions-record-modal';
import './components/stxapp-transactions-record/details/stxcom-swap-transaction-details.js';
import './components/stxapp-limit-optional-list/stxapp-limit-optional-list';

import './com/stx-slippag-eexpand/stx-slippag-eexpand.js';
import './com/stx-slippag-eexpand/stx-slippag-icon.js';
import './com/stx-best-route/stx-best-route.js';

export class StxWidget extends StoreMixin(LitElement) {
	static get properties() {
		return {
			userAddress: { type: String },
			disabledMiniPriceCard: { type: Boolean },
	  
			chain: { type: String },
			slippaglayout: { type: String },
			swapbutton: { type: Boolean },
			
			amountInNum: { type: String },
			fromAmount: { type: String },
			toAmount: { type: String },
			
			fromTokenObj: { type: Object },
			toTokenObj: { type: Object },
			_slip: { type: String },
			gasFeeUsd: { type: String },
			routerAddress: { type: String },
		
			tokencard: { type: Object },
		
			disabledArrowLoading: { type: Boolean },
			_isRoutesLoading: { type: Boolean },
			showTokenSelector: { type: Boolean },
			openRouteView: { type: Boolean },
			openConfirmSwap: { type: Boolean},
			openTransactionsRecordModal: { type: Boolean},
			openTransactionDetailsModal: { type: Boolean},
			
			openTokenCard: { type: Boolean },
			tokenInfoStyles: { type: String },
			
			amountInUsd: { type: String},
			amountOutUsd: { type: String},
			
			inputTokenSelectLoading: { type: Boolean},
			outputTokenSelectLoading: { type: Boolean},
			
			disabledHistoryIcon: { type: Boolean},
			disabledCustomRecipient: { type: Boolean},
			disabledChooseRoute: { type: Boolean},
			smallScreenCardFull: { type: Boolean},
			//_transactionDetailsData: { type: Object },
		};
	}

	constructor() {
		super();
		this.userAddress = '';
		this.disabledMiniPriceCard = false;//禁用迷你价格卡片
		
		const currentlyChain = $app.getStorageSync('currently-selected-chain');
		this.chain = currentlyChain?currentlyChain:defaultChain;
		this.slippaglayout = 'top';//bottom // top
		this.swapbutton = true;
		
		this.getSwapDefaultToken();
		this.tokencard = {};
    
		this.disabledArrowLoading = true;
		this._isRoutesLoading = false;
		this.openTokenCard = false;
		this.showTokenSelector = false;
		this.openRouteView = false;
		this.openConfirmSwap = false;
		this.tokenInfoStyles = '';
		this.disabledCustomRecipient = false;
		this.disabledChooseRoute = false;
		
		this._updateNewTokenList(true);
		
		this.selectedRoute = undefined;//选中路由
		
		this._feeBP = 0;
		this.amountOutUsd = '';
		this.amountInUsd = '';
		this.amountInNum = '';
		this.openTransactionsRecordModal = false;
		this.openTransactionDetailsModal = false;
		
		this.inputTokenSelectLoading = false;
		this.outputTokenSelectLoading = false;
		
		this.disabledHistoryIcon = false;
		this.smallScreenCardFull = false;
		//this._transactionDetailsData = {};
		this.detectPermitMethods();
	}
  
	disconnectedCallback() {
		this._unregisterBack?.();
		this._unregisterBack = null;
		super.disconnectedCallback();
	}

	willUpdate(changedProperties) {
	    if (changedProperties.has('userAddress')) {
	        const oldUserAddress = changedProperties.get('userAddress');
	        if (this.userAddress&&this.userAddress !== oldUserAddress) {
	            this._updateNewTokenList(false);
				this._postRoutes();
				if(this.openConfirmSwap){
					this.shadowRoot.querySelector('#swapConfirm')._closeClick();
					const tips = this.shadowRoot.querySelector('#swapTips');
					tips.show(sdkStore.$t['wallet-switched'], {//已切换钱包
						type: 'warning',
						duration: 3500
					});
				}
	        }else{
				if(this.openConfirmSwap){
					this.shadowRoot.querySelector('#swapConfirm')._closeClick();
					const tips = this.shadowRoot.querySelector('#swapTips');
					tips.show(sdkStore.$t['wallet-disconnected'], {//已退出钱包
						type: 'warning',
						duration: 3500
					});
				}
			}
	    }
		if (changedProperties.has('chain')) {
		    const oldChain = changedProperties.get('chain');
		    if (this.chain !== oldChain) {
		        this.getSwapDefaultToken();
				this._updateNewTokenList(false);
		    }
		}
	}
	
	
	
	
	getSwapDefaultToken(){
		this.fromAmount = '';
		this.toAmount = '';
		this.gasFeeUsd = '';
		this.routerAddress = '';
		
		this._isRoutesLoading = false;
		this.disabledArrowLoading = true;
		this._lastRequest = undefined;
		
		this.selectedRoute = undefined;//选中路由
		this._inputAmount = '';
		
		this._chooseRoute(undefined);
		
		sdkStore.setInputAmount('');
		
		this.amountOutUsd = '';
		this.amountInUsd = '';
		
		const swapToken = getSwapDefaultToken(this.chain);
		const defaultTokenIn = this._getDefaultTokenIn();
		const defaultTokenOut = this._getDefaultTokenOut();
		if(defaultTokenIn){
			this._customTokenIn(defaultTokenIn, Object.assign({}, swapToken.from, {chain: this.chain}));
		}else{
			this.fromTokenObj = Object.assign({}, swapToken.from, {chain: this.chain});
		}
		if(defaultTokenOut){
			this._customTokenOut(defaultTokenOut, Object.assign({}, swapToken.to, {chain: this.chain}));
		}else{
			this.toTokenObj = Object.assign({}, swapToken.to, {chain: this.chain});
		}
	}
	
	
	_getDefaultTokenIn(){
		try {
			const defaultTokenIn = sdkStore?.limitOptionalToken?.[this.chain]?.defaultTokenIn?.toLowerCase();
			if(defaultTokenIn&&viemUtils.isAddress(defaultTokenIn)){
				return defaultTokenIn;
			}
		} catch (error) {}
		const urlTokenIn = $app.decodeURIparam('tokenIn')?.toLowerCase();
		if(urlTokenIn&&viemUtils.isAddress(urlTokenIn)){
			return urlTokenIn;
		}
		return null;
	}
	_getDefaultTokenOut(){
		try {
			const defaultTokenOut = sdkStore?.limitOptionalToken?.[this.chain]?.defaultTokenOut?.toLowerCase();
			if(defaultTokenOut&&viemUtils.isAddress(defaultTokenOut)){
				return defaultTokenOut;
			}
		} catch (error) {}
		const urlTokenOut = $app.decodeURIparam('tokenOut')?.toLowerCase();
		if(urlTokenOut&&viemUtils.isAddress(urlTokenOut)){
			return urlTokenOut;
		}
		return null;
	}
	
	
	async _customTokenIn(tokenAddr, originalData){
		this.inputTokenSelectLoading = true;
		const cached = await allTokens(this.chain);
		if (cached&&Array.isArray(cached)) {
			for(let i = 0; i < cached.length; i++){
				if(cached[i].address===tokenAddr){
					this.fromTokenObj = Object.assign({}, cached[i], {chain: this.chain});
					this.inputTokenSelectLoading = false;
					return;
				}
			}
		}
		this.fromTokenObj = Object.assign({}, originalData, {chain: this.chain});
		this.inputTokenSelectLoading = false;
	}
	async _customTokenOut(tokenAddr, originalData){
		this.outputTokenSelectLoading = true;
		const cached = await allTokens(this.chain);
		if (cached&&Array.isArray(cached)) {
			for(let i = 0; i < cached.length; i++){
				if(cached[i].address===tokenAddr){
					this.toTokenObj = Object.assign({}, cached[i], {chain: this.chain});
					this.outputTokenSelectLoading = false;
					return;
				}
			}
		}
		this.toTokenObj = Object.assign({}, originalData, {chain: this.chain});
		this.outputTokenSelectLoading = false;
	}
	
	
	
	
	
	async detectPermitMethods() {
		/* const cached = await allTokens(this.chain);
		if (cached&&Array.isArray(cached)) {
			for(let i = 38; i < cached.length; i++){
				
				const result = await $app.permit.detectPermitMethods(sdkStore?.chain, {
					token: cached[i].address,
					owner: '0xd4cE05008e849EF096e02D806d0333A0B7e8350f',
					spender: '0x7B791963E4FeC2aabA2F0e7551Fa66b80060D259',
				});
				console.log(i, result, cached[i].address, result.dai.eip2612);
				if(result.dai.supported){
					console.log(i, result, '------------------', cached[i].address);
					return;
				}
				await $app.sleep(1000);
			}
		}
		console.log('没有'); */
	}
	
	
	
	
	

  
  
  
	//轮询代币价格与用户余额
	async _updateNewTokenList(isloop) {
		let addresses = [];
		try {
			addresses = [
				this.fromTokenObj.address.toLowerCase(), 
				this.toTokenObj.address.toLowerCase()
			];
		} catch (error) {}
		try {
			this._getWalletBalance(addresses);
		} catch (error) {}
		try {
			const data = await getTokenList(this.chain, {
				'address': addresses.join(',')
			});
			if(data.length===0){return;}
			const dataObj = {};
			for(let i = 0; i < data.length; i++){
				dataObj[data[i].address.toLowerCase()] = data[i];
			}//console.log('dataObj:', dataObj);
			this._updateChainTokenPrice(data);
		} catch (error) {}
		if(isloop){
			let delaytime = 10;
			try {delaytime = networkData[this.chain]?.refreshRoutesDelaytime||10;} catch (error) {delaytime = 10;}
			setTimeout(()=>{
				this._updateNewTokenList(true);
			}, delaytime*1000);
		}
	}
	

	
	
	async _updateChainTokenPrice(data){
		if(data.length===0){return;}
		if(data.length>=1){await this._updateChainTokenPrice2(this.chain, data[0].address);}
		if(data.length>=2){await this._updateChainTokenPrice3(this.chain, data[1].address);}
	}
	async _updateChainTokenPrice2(network, address) {
		try {
			const data = await tokenSinglePrice(network, address);
			if(data&&data.usd_sell){
				sdkStore.updateChainTokenPrice(network, {
					[address.toLowerCase()]: data.usd_sell
				});//console.log('最新价格', data);
			}
		} catch (error) {}
	}
	async _updateChainTokenPrice3(network, address) {
		try {
			const data = await tokenPrices(network, address);
			if(data&&data?.token?.usd_sell){
				sdkStore.updateChainTokenPrice(network, {
					[address.toLowerCase()]: data?.token?.usd_sell
				});//console.log('最新价格', data?.token?.usd_sell);
			}
		} catch (error) {}
	}
	
	
	
	
	
	
	
	
	
	async _getWalletBalance(addresses) {
	    if (!this.userAddress) return;
		const balances = await batchQueryTokenBalance(this.chain, [addresses, this.userAddress]);
		const updatePayload = {};
		if (balances && balances.length > 0){
			for (let i = 0; i < addresses.length; i++) {
				updatePayload[addresses[i]] = balances[i];
			}
		}
		sdkStore.updateChainBalances(this.chain, updatePayload);
	}
	
	
  

	static get styles() {
		return [
			css`${unsafeCSS(swaptoxUI)}`,
			css`
				:host { display: block; width: 100%; }
				* {
					-webkit-tap-highlight-color: transparent;
					-ms-touch-action: manipulation;
					touch-action: manipulation;
				}
				
				.stx-container {
					position: relative;
					border-radius: var(--stxui-swap-card-border-radius, 18px);
					padding: 12px 15px;
					padding-top: 10px;
					padding-bottom: 15px;
					min-width: 260px;
					
					background: var(--stxui-theme-background-color, #fff);
					
					border-right-style: solid;
					border-right-width: var(--stxui-card-border-width, 1px);
					border-right-color: var(--stxui-card-border-color, #fff);
					border-left-style: solid;
					border-left-width: var(--stxui-card-border-width, 1px);
					border-left-color: var(--stxui-card-border-color, #fff);
					border-bottom-style: solid;
					border-bottom-width: var(--stxui-card-border-bottom-width, 1px);
					border-bottom-color: var(--stxui-card-border-color, #fff);
					border-top-style: solid;
					border-top-width: var(--stxui-card-border-width, 1px);
					border-top-color: var(--stxui-card-border-color, #fff);
				}
				.stx-container-full{}
				@media (max-width: 520px) {
					.stx-container-full {
						border-radius: 0px;
						border-right-width:0px;
						border-left-width:0px;
						border-top-width:0px;
						/*width: 100%;
						min-width: 100%;*/
					}
				}
				
				
				.stx-card-title {
					font-size: 18px;
					color: var(--stxui-theme-font-color, #111);
					line-height: 32px;
					user-select: none;
					font-family: var(--stxui-font-family);
				}
				
				.com-flex-row-center{
					display: flex;
					flex-direction: row;
					align-items: center;
					column-gap: 4px;
				}
				.header {
					position: relative;
					z-index: 20;
					display: flex;
					justify-content: space-between;
					margin-bottom: 10px;
				}
				.footer{
					padding-top: 15px;
					position: relative;
					top: 0px;
				}
			`
		];
	}
	
	
	_openMiniTokenSelectModal(e){
		let infos = e.detail;
		this.tokenSelectType = infos.refid;
		const mModal = this.shadowRoot.querySelector('#limitOptionalList');
		mModal.open(infos);
	}

	render() {
		const $t = sdkStore.$t;
		
		let delaytime = 0;
		let swapusdin = '';
		let swapusdout = '';
		try {
			delaytime = networkData[this.chain]?.refreshRoutesDelaytime;
			swapusdin = this._getUsdprice(this.fromTokenObj?.address, this.fromTokenObj?.decimals, this.amountInNum, this.amountInUsd);
			swapusdout = this._getUsdprice(this.toTokenObj?.address, this.toTokenObj?.decimals, this.toAmount, this.amountOutUsd);
		} catch (e) {}
		
		let inputTokenSelectDisabled = false;
		let outputTokenSelectDisabled = false;
		let disabledIconSwitchToken = false;
		let limitOptionalList = [];
		let miniSelectNum = 0;
		try {
			inputTokenSelectDisabled = sdkStore?.limitOptionalToken?.[this.chain]?.disabledTokenIn;
			outputTokenSelectDisabled = sdkStore?.limitOptionalToken?.[this.chain]?.disabledTokenOut;
			disabledIconSwitchToken = (inputTokenSelectDisabled||outputTokenSelectDisabled);
			limitOptionalList = sdkStore?.limitOptionalToken?.[this.chain]?.limitOptionalList;
			miniSelectNum = limitOptionalList&&$app.test.array(limitOptionalList)&&limitOptionalList.length>0?limitOptionalList.length:0;
		} catch (e) {}
		
		
		return html`
			
			${miniSelectNum>0?html`
				<stxapp-limit-optional-list id="limitOptionalList"
					.wallet="${this.userAddress}"
					@select-token=${this._selectToken}
				></stxapp-limit-optional-list>
			`:html`
				<stx-token-selector 
					?disabledMiniPriceCard=${this.disabledMiniPriceCard}
					.wallet="${this.userAddress}"
					.chain="${this.chain}"
					.open="${this.showTokenSelector}" 
					@close="${() => {this.showTokenSelector = false;}}"
					@select-token="${this._selectToken}"
				></stx-token-selector>				
			`}
		
		
		
			<stxapp-route-trend-modal 
				@close=${()=>{this.openRouteView = false;}}
				@mask=${()=>{this.openRouteView = false;}} 
				?open=${this.openRouteView}
			>
				<stxapp-route-trend 
					.optionalRoute=${!this.disabledChooseRoute}
					@close=${()=>{this.openRouteView = false;}}
				></stxapp-route-trend>
			</stxapp-route-trend-modal>
			
			
			<stxapp-swap-confirm-modal @close=${()=>{this.openConfirmSwap = false;}} ?open=${this.openConfirmSwap}>
				<stxapp-swap-confirm id="swapConfirm"
					@close=${()=>{this.openConfirmSwap = false;}}
					?disabledCustomRecipient=${this.disabledCustomRecipient}
					?isOpen=${this.openConfirmSwap}
					.nativeToken="${networkData[this.chain].nativeToken.native}"
					.tokenin=${this.fromTokenObj}
					.tokenout=${this.toTokenObj}
					.amountin="${this.amountInNum}" 
					.amountout="${this.toAmount}" 
					.swapData=${this.swapData}
					.deadline=${this.deadline}
					.usdin="${swapusdin}"
					.usdout="${swapusdout}"
					.slippage="${this._slip}"
					.gasusd="${this.gasFeeUsd}"
					.routeraddress="${this.routerAddress}"
					.swapfee=${this._feeBP}
					@refresh-router=${this._postRoutes}
					@transaction-send=${this._transactionSend}
				></stxapp-swap-confirm>
			</stxapp-swap-confirm-modal>
			
		
			${!this.disabledMiniPriceCard?html`
				<stxapp-mini-modal styles="${this.tokenInfoStyles}"
					.open="${this.openTokenCard}"
					@close="${()=>{this.openTokenCard=false;}}"
				>
					<stx-token-card
						.tokeninfo="${this.tokencard}" 
					></stx-token-card>
				</stxapp-mini-modal>
			`:null}
			
		
		
		
		
			<div class="stx-container ${this.smallScreenCardFull?'stx-container-full':''}">
				<stxapp-tips id="swapTips"></stxapp-tips>
		  
				<div class="header">
					<span class="stx-card-title" style="font-size:17px;">${$t['swap']}</span>
					<div class="com-flex-row-center">
						${this.slippaglayout==='top'?html`
							<stx-slippag-icon @change-slippag="${this._changeSlippag}"></stx-slippag-icon>
							<div style="width:2px;"></div>
						`:null}
						
						${!this.disabledHistoryIcon?html`
							<com-icon-history @change=${()=>{this.openTransactionsRecordModal=true}}></com-icon-history>
						`:null}
						
						<com-icon-arrow-loading id="arrowLoading"
							.delaytime="${delaytime}"
							.disabled="${this.openConfirmSwap||this.disabledArrowLoading||this._isRoutesLoading||this.showTokenSelector}" 
							.loading="${this._isRoutesLoading}" 
							@change="${this._postRoutes}"
							@is-loading="${this._arrowIsLoading}"
						></com-icon-arrow-loading>
					</div>
				</div>



				<stx-token-input
					?loading=${this.inputTokenSelectLoading}
					?disabledMiniPriceCard=${this.disabledMiniPriceCard}
					.valueusd="${this.amountInUsd}"
					.wallet="${this.userAddress}" 
					.chain="${this.chain}"
					.paytitle="${$t['you-pay']}"
					.value="${this.fromAmount}" 
					.address="${this.fromTokenObj?.address}" 
					.tokenname="${this.fromTokenObj?.name}" 
					.decimals="${this.fromTokenObj?.decimals||0}" 
					@stx-input-change="${this._handleFromInputChange}"
					@open-token-info="${(e)=>{this._openTokenInfo(e, 'input')}}"
				>
					<stx-token-select-icon 
						refid="input"
						.miniSelectNum=${miniSelectNum}
						?loading=${this.inputTokenSelectLoading}
						?disabled=${inputTokenSelectDisabled}
						.symbol="${this.fromTokenObj?.symbol}"
						.logo="${this.fromTokenObj?.logourl}"
						@change="${()=>{this._tokenSelect('input')}}"
						@mini-change=${this._openMiniTokenSelectModal}
					></stx-token-select-icon>
				</stx-token-input>
				
				
				
				
				<com-icon-switch-token 
					?loading=${this.inputTokenSelectLoading||this.outputTokenSelectLoading}
					?disabled=${disabledIconSwitchToken}
					@change="${this._tapSwitchToken}" 
				></com-icon-switch-token>
				
				
				
				
				<stx-token-output 
					?loading=${this.outputTokenSelectLoading}
					?disabledMiniPriceCard=${this.disabledMiniPriceCard}
					.valueusd="${this.amountOutUsd}"
					.wallet="${this.userAddress}"
					.chain="${this.chain}"
					.paytitle="${$t['you-receive']}"
					.value="${this.toAmount}" 
					.address="${this.toTokenObj?.address}" 
					.tokenname="${this.toTokenObj?.name}" 
					.decimals="${this.toTokenObj?.decimals||0}"
					@stx-output-change="${this._handleToInputChange}"
					@open-token-info="${(e)=>{this._openTokenInfo(e, 'output')}}"
				>
					<stx-token-select-icon 
						refid="output"
						.miniSelectNum=${miniSelectNum}
						?loading=${this.outputTokenSelectLoading}
						?disabled=${outputTokenSelectDisabled}
						.symbol="${this.toTokenObj?.symbol}"
						.logo="${this.toTokenObj?.logourl}"
						@change="${()=>{this._tokenSelect('output')}}" 
						@mini-change=${this._openMiniTokenSelectModal}
					></stx-token-select-icon>
				</stx-token-output>
				
				
				<div style="padding-top: 15px;position: relative;z-index: 20;">
					<stx-best-route
						.swapfee=${this._feeBP}
						@change=${()=>{this.openRouteView = true;}}
					></stx-best-route>
				</div>
				
				${this.slippaglayout==='bottom'?html`
					<div style="padding-top: 15px;position: relative;z-index: 20;">
						<stx-slippag-eexpand @change-slippag="${this._changeSlippag}"></stx-slippag-eexpand>
					</div>
				`:``}			
				



				${this.swapbutton?html`
					<div class="footer">
						<swaptox-swap-button></swaptox-swap-button>
					</div>
				`:null}


				<div style="height:7px;"></div>
				
			</div>
			
			
			${!this.disabledHistoryIcon?html`
				<swaptox-transactions-record-modal
					?open=${this.openTransactionsRecordModal}
					@close-modal=${()=>{this.openTransactionsRecordModal=false}}
				></swaptox-transactions-record-modal>
			`:null}
			
			
			
			<!--交易详情-->
			<stxapp-swap-confirm-modal @click=${(e)=>e.stopPropagation()} 
				?open=${this.openTransactionDetailsModal} 
				@mask=${()=>{this.openTransactionDetailsModal = false;}}
				@close=${()=>{this.openTransactionDetailsModal = false;}}
			>
				<stxcom-swap-transaction-details
					.item=${this._transactionDetailsData}
					@close=${()=>{this.openTransactionDetailsModal = false;}}
				></stxcom-swap-transaction-details>
			</stxapp-swap-confirm-modal>
			
			
			
		`;
	}
	//<swaptox-wallet id="swaptox-wallet-modal"></swaptox-wallet>
	
	
	//打开交易详情
	openTransactionDetails(data){
		this._transactionDetailsData = data;
		this.openTransactionDetailsModal = true;
	}
	
	
	
	async _openMiniSwapStateModal(data){
		const stateModal = document.querySelector('swaptox-mini-swap-state');
		stateModal.push(data);
		if(!stateModal?.isOpen){
			stateModal.open();
		}
		this.openConfirmSwap = false;
		document.querySelector('stxapp-swap-success-modal')
		?.open(networkData?.[data.chainin]?.blockExplorer?.tx?.replace('{{tx}}', data.hash));
		//放这里是避免swap确认窗口被关闭中断保存
		return await addTransaction(data);
	}
	
  
	_transactionSend(){
		this._handleFromInputChange({detail: {value: ''}});
	}
  
  
	_getUsdprice(token, decimals, value, usdValue){
		let valueUSD = '';
		try {
			if($app.test.isNumber(value)){
				const priceStr = sdkStore?.tokenPrice?.[this.chain]?.[token.toLowerCase()];
				if(!priceStr||priceStr==='0'){
					valueUSD = '--';
				}else{
					const valUSD = $app.calculateUsdValue(viemUtils.parseUnits(value, decimals), viemUtils.parseUnits('1', decimals), priceStr);
					valueUSD = $app.formatPriceBehalf(valUSD, sdkStore.priceBehalf);
				}
			}
		} catch (e) {}
		try {
			if(valueUSD==='--'&&usdValue){
				valueUSD = $app.formatPriceBehalf(usdValue, sdkStore.priceBehalf);
			}
		} catch (e) {}
		return valueUSD;
	}
  
  
  
	_openTokenInfo(e, lxs){
		if(lxs==='input'){
			this.tokencard = Object.assign({vDate: Date.now()}, this.fromTokenObj);
		}else{
			this.tokencard = Object.assign({vDate: Date.now()}, this.toTokenObj);
		}
		let infos = e.detail;//console.log('打开代币信息:', infos);
		this.tokenInfoStyles = `transform-origin: ${infos.origin};top:${infos.top}px;left:${infos.left}px;border-radius: 16px;box-shadow: 0px 15px 50px -12px rgba(0, 0, 0, 0.35);`;//0 0 3px 0 rgba(0,0,0,.2), 0 4px 14px 0 rgba(0,0,0,.05)
		this.openTokenCard = true;
	}
	
	
	
	
	
	_changeSlippag(e){//滑点回调
		if(e.detail.value&&$app.test.isNumber(e.detail.value)&&e.detail.value!==this._slip) {
			this._slip = e.detail.value;
			sdkStore.setSlippag(this._slip);
		}
	}
	
	
	_selectToken(e) {
		const _data = e.detail;
		if(this.tokenSelectType==='input'){
			if(_data.address.toLowerCase()===this.toTokenObj.address.toLowerCase()){
				this._switchTokenObj();
			}else{
				this._setFromTokenObj(_data);
				this.fromAmount = '';
				this.toAmount = '';
			}
		}else{
			if(_data.address.toLowerCase()===this.fromTokenObj.address.toLowerCase()){
				this._switchTokenObj();
			}else{
				this._setToTokenObj(_data);
			}
		}
		this.showTokenSelector = false;
		this._inputAmount = '';
		this._handleFromInputChange({detail: {value: this.fromAmount}});
	}
	
	_setFromTokenObj(data) {
		this.fromTokenObj = data;
		setSwapFromToken(this.chain, data);
	}
	_setToTokenObj(data) {
		this.toTokenObj = data;
		setSwapToToken(this.chain, data);
	}
	_switchTokenObj(){
		const input = Object.assign({}, this.fromTokenObj);
		const output = Object.assign({}, this.toTokenObj);
		this._setFromTokenObj(output);
		this._setToTokenObj(input);
		const inAmount = this.fromAmount;
		const outAmount = this.toAmount;
		this.fromAmount = outAmount;
		this.toAmount = inAmount;
	}
	_tapSwitchToken(){
		if(this._isRoutesLoading){
			return;
		}
		this._switchTokenObj();
		this._inputAmount = '';
		this._handleFromInputChange({detail: {value: this.fromAmount}});
	}
	
  

	_handleFromInputChange(event) {
		this.fromAmount = event.detail.value;
		this.amountOutUsd = '';
		this.amountInUsd = '';
		//console.log('fromAmount:', this.fromAmount);return;
		if(!$app.test.isNumber(this.fromAmount)){
			this.disabledArrowLoading = true;
			this._isRoutesLoading = false;
			this._inputAmount = '';
			this.toAmount = '';
			//this.fromAmount = '';//会全部清空输入框
			this._feeBP = 0;
			sdkStore.setRoutes(undefined, false);
			this._chooseRoute(undefined);
			sdkStore.setInputAmount('');
			const currentRequestSymbol = Symbol('quoter');
			this._lastRequest = currentRequestSymbol;
			const arrowLoading = this.shadowRoot.querySelector('#arrowLoading');
			arrowLoading._isload = false;
			arrowLoading.isLoading(false);
			return;
		}
		const _inputAmount = viemUtils.parseUnits(this.fromAmount, this.fromTokenObj?.decimals).toString();
		if(this._inputAmount===_inputAmount){
			return;
		}
		this._inputAmount = _inputAmount;
		sdkStore.setInputAmount(_inputAmount);
		this._isToRoutes();
	}
	_isToRoutes(){
		if(!this._inputAmount) return;
		if(this._isRoutesLoading){
			if (this.timer) clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.timer = null;
				this._postRoutes();
			}, 300);
		}else{
			this._postRoutes();
		}
	}
	async _postRoutes(){
		if(!this._inputAmount) return;
		this.disabledArrowLoading = false;
		sdkStore.setSelectedTokenData({...this.fromTokenObj, 'amountIn': this._inputAmount}, this.toTokenObj, false);
		const postObj = {
			'amountIn': this._inputAmount,
			'tokenIn': this.fromTokenObj.address.toLowerCase(),
			'tokenOut': this.toTokenObj.address.toLowerCase(),
		};
		if(this.userAddress){
			postObj.account = this.userAddress;
		}
		const currentRequestSymbol = Symbol('quoter');
		this._lastRequest = currentRequestSymbol;
		this._isRoutesLoading = true;
		this._quoterLoading({
			loading: true,
			'chain': this.chain,
			data: postObj,
			token: {
				'from': this.fromTokenObj,
				'to': this.toTokenObj,
			}
		});
		try {
		    const data = await quoterRoute(this.chain, postObj);
			if (this._lastRequest !== currentRequestSymbol) return;
		    this._setRoutesData({...data, success: true});
		} catch (error) {
			if (this._lastRequest !== currentRequestSymbol) return;
			if(error.status===429){
				this._postRoutes();
				//this._isRoutesLoading = false;//这里开启一直加载
				return;
			}else{
				console.error('error:', error);
				this._setRoutesData({...error, routes: []});
				const tips = this.shadowRoot.querySelector('#swapTips');
				tips.show(error.code&&sdkStore.$t[error.code]?sdkStore.$t[error.code]:error.message, {
					type: 'warning',
					duration: 2500
				});
				if(error.code==='NO_ROUTE'){
					this.disabledArrowLoading = true;
				}
			}
		}
		this._isRoutesLoading = false;
	}
	
	
	
	async _setSelectedRoute(data, isNotify=true){
		//console.log('bestRoute:', data);
		
		//data.swapAddress = '0xDbeFa5D1161aC1DDcD97B73cfC6054eD4380FA4e';
		
		this.selectedRoute = data;
		this._chooseRoute(data, isNotify);
		this.toAmount = viemUtils.formatUnits(BigInt(data.amountOut), this.toTokenObj?.decimals);
		//this.fromAmount = viemUtils.formatUnits(BigInt(data.amountIn), this.fromTokenObj?.decimals);
		this.amountInNum = viemUtils.formatUnits(BigInt(data.amountIn), this.fromTokenObj?.decimals);
		
		this.swapData = data.swapData;
		this.gasFeeUsd = data.gasFeeUsd;
		this.routerAddress = data.swapAddress;
		
		this.amountOutUsd = data.amountOutUsd?data.amountOutUsd:'';
		this.amountInUsd = data.amountInUsd?data.amountInUsd:'';
		
		
		if(this._balanceOK){
			const swapConfirm = this.shadowRoot.querySelector('#swapConfirm');
			swapConfirm._isApprove(data);			
		}
	}
	_setRoutesData(data){
		const routes = data.routes;
		
		
		this._balanceOK = true;
		if(data.accountInfo&&data.accountInfo.account.toLowerCase()===this.userAddress.toLowerCase()){
			const balances = data.accountInfo.balance;
			const updatePayload = {};
			for (var key in balances) {
				updatePayload[key.toLowerCase()] = BigInt(balances[key]);
				if(key.toLowerCase()===this.fromTokenObj.address.toLowerCase()){
					if(BigInt(this._inputAmount)>BigInt(balances[key])){
						this._balanceOK = false;
					}
				}
			}//console.log(updatePayload);
			sdkStore.updateChainBalances(this.chain, updatePayload, false);
			this._feeBP = Number(data.accountInfo.feeBP)/100;
		}else{
			this._feeBP = 0;
		}
		//console.log('this._balanceOK', this._balanceOK);
		
		
		if(routes.length===0){
			this._chooseRoute(undefined);
			this.toAmount = '';
			this.selectedRoute = undefined;
			sdkStore.setRoutes([], false);
			try {
				const targetContainer = this.shadowRoot.querySelector('#route-trend-svg');
				targetContainer?.innerHTML?targetContainer.innerHTML = '':null;				
			} catch (e) {}
		}else{
			this.deadline = data.deadline;
			for(let i = 0; i < routes.length; i++){
				routes[i].id = i;
				if(routes[i].bestRoute){
					routes[i].selected = true;
					this._setSelectedRoute(routes[i], false);
				}else{
					routes[i].selected = false;
				}
			}
			sdkStore.setRoutes(routes, false);
		}
		
		
		
		
		if(data.success){
			sdkStore.setErrRoute(undefined, false);
		}else{
			sdkStore.setErrRoute(data, false);
		}
		sdkStore._notify();
		this.dispatchEvent(new CustomEvent('routes', {
			detail: data,
			bubbles: false,
			composed: false
		}));
	}
	

	_handleToInputChange(event) {
		this.toAmount = event.detail.value;
	}
	_tokenSelect(sid){
		this.tokenSelectType = sid;
		this.showTokenSelector = true;
	}
	_arrowIsLoading(e){
		if(!e.detail){
			if(this._lastRequest===this._callbackRequest) return;
			this._callbackRequest = this._lastRequest;
			this._quoterLoading({loading: false});
		}
	}
	_quoterLoading(data) {
		this.dispatchEvent(new CustomEvent('loading', {
			detail: data,
			bubbles: false,
			composed: false
		}));
	}
	_connectWallet() {
		this.dispatchEvent(new CustomEvent('connect-wallet', {
			bubbles: false,
			composed: false
		}));
		window?.$swaptoxConnect?.open();
	}
	/* openWallet(){
		//this.shadowRoot.querySelector('#swaptox-wallet-modal').open();
	} */
	
	
	_chooseRoute(data, isNotify=true){
		sdkStore.setSelectedRoute(data, isNotify);
		this.dispatchEvent(new CustomEvent('choose-route', {
			detail: data,
			bubbles: false,
			composed: false
		}));
	}
	


	//弹出交易记录
	_openHistoryLog() {
		//this.disabledArrowLoading = !this.disabledArrowLoading//这是测试
	}
}




if (!customElements.get('swaptox-widget')) {
	customElements.define('swaptox-widget', StxWidget);
}







/*



npm run build
npm pack --dry-run
npm publish --access public





git add .
git commit -m "Update Widget SDK"
git push




*/