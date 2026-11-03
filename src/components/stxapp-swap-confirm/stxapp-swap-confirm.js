

import {
	LitElement,
	html,
	css
} from 'lit';

import { viemUtils } from '../../js_sdk/viem/utils.js';
import { $app } from '../../js_sdk/index.js';
import { sdkStore } from '../../data/store/store.js';
import { StoreMixin } from '../../data/store/state-mixin.js';
import { isApprove } from '../../api/erc20/isApprove.js';
import { getPermitInfo } from '../../api/chain/getPermitInfo.js';
import { networkData } from '../../data/network-data.js';
import '../../icon/com-icon-close.js';
import './com/stxcom-token-card.js';
import './com/stxcom-details-list.js';
import './recipient/stxui-view-recipient.js';
import './recipient/stxui-set-recipient.js';
import '../stxapp-button/stxapp-button.js';
import './swap/stxapp-swap-execute.js';



export class StxappSwapConfirm extends StoreMixin(LitElement) {
	static properties = {
		isOpen: {type: Boolean},
		nativeToken: {
			type: String
		},
		tokenin: {
			type: Object
		},
		tokenout: {
			type: Object
		},
		amountin: {
			type: String
		},
		amountout: {
			type: String
		},
		usdin: {
			type: String
		},
		usdout: {
			type: String
		},
		slippage: {
			type: String
		},
		swapfee: {
			type: Number
		},
		gasusd: {
			type: String
		},
		routeraddress: {
			type: String
		},
		customRecipient: {
			type: String
		},
		swapData: {
			type: String
		},
		deadline: {
			type: String
		},
		isOpenSetrecipient: {type: Boolean},
		disabledCustomRecipient: {type: Boolean},
		isExecute: {type: Boolean},
		isQueryApprove: {type: Boolean},
		
		_permitTypedData: {
			type: Object
		},
	};
	constructor() {
		super();
		this.deadline = '';
		this.swapData = '';
		this.tokenin = {};
		this.tokenout = {};
		this.amountin = '';
		this.amountout = '';
		this.usdin = '';
		this.usdout = '';
		this.slippage = '';
		this.swapfee = 0;
		this.gasusd = '';
		this.routeraddress = '';
		//自定义Recipient
		this.customRecipient = '';
		
		this.isOpenSetrecipient = false;
		this.disabledCustomRecipient = false;
		this.isExecute = false;
		this.isQueryApprove = false;
		
		this._permitTypedData = {};
	}


	static styles = css`
		:host {
			display: block;
		}
		.font-family{
			user-select: none;
			font-family: var(--stxui-font-family);
		}
		.confirm-swap-title{
			box-sizing: border-box;
			font-size: 18px;
			color: var(--stxui-theme-font-color, #111);
		}
		.stxapp-swap-confirm{
			position: relative;
			padding: 20px;
		}
	`;
	
	
	
	updated(changedProperties) {
		if (changedProperties.has('isOpen')) {
			if(this.isOpen){
				this.isExecute = false;
				//this._isApprove();询价后直接调用
			}
		}
	}
	
	//外部直接调用
	async _isApprove(route){
		this.permitData = '';
		this._permitTypedData = {};
		const tokenIn = route.tokenIn?route.tokenIn.toLowerCase():this.tokenin.address.toLowerCase();
		if(tokenIn===this.nativeToken){
			return;
		}
		if(!sdkStore.account){
			return;
		}
		const routerAddress = route.swapAddress?route.swapAddress:this.routeraddress;
		this.isQueryApprove = false;
		const toIsApprove = await isApprove(sdkStore.chain, {
			token: tokenIn,
			owner: sdkStore.account,
			spender: routerAddress,
			amount: sdkStore.inputAmount
		});//console.log('this.isApprove', toIsApprove, route);
		this.isQueryApprove = true;
		this.isApprove = toIsApprove;
		
		if(!this.isApprove){
			this._isPermit(route);
		}
	}
	
	//内部回调已经授权
	_alreadyApprove(){
		this.isQueryApprove = true;
		this.isApprove = true;
	}
	//内部回调已经Permit
	_alreadyPermit(e){
		if(e.detail){
			this.permitData = e.detail;
			this.isQueryApprove = true;
			this.isApprove = true;			
		}
	}
	
	
	
	//必须坚持余额大于输入余额在执行
	
	
	async _isPermit(route){
		if(!sdkStore?.tokenInData?.permit_type){return;}
		const permit_type = sdkStore?.tokenInData?.permit_type;
		const tokenIn = route.tokenIn?route.tokenIn.toLowerCase():this.tokenin.address.toLowerCase();
		const routerAddress = route.swapAddress?route.swapAddress:this.routeraddress;
		const permitInfo = await getPermitInfo(sdkStore.chain, [tokenIn, sdkStore.account]);
		//console.log('permitInfo', permitInfo);
		
		if(permit_type==='eip2612'){
			const typedData = $app.permit.buildEip2612Data({
				names: [permitInfo.domainName, sdkStore?.tokenInData?.name],
				chainId: permitInfo.chainId||networkData[sdkStore?.chain].chainId,
				tokenAddress: tokenIn,
				domainSeparator: permitInfo.domainSeparator,
				account: sdkStore.account,
				routerAddress: routerAddress,
				amountIn: sdkStore.inputAmount,
				nonce: permitInfo.nonce,
				deadline: this.deadline,
			});
			this._permitTypedData = typedData?{permit_type, typedData}:{};
		}else if(permit_type==='eip2612_bytes'){
			const typedData = $app.permit.buildEip2612BytesData({
				names: [permitInfo.domainName, sdkStore?.tokenInData?.name],
				chainId: permitInfo.chainId||networkData[sdkStore?.chain].chainId,
				tokenAddress: tokenIn,
				domainSeparator: permitInfo.domainSeparator,
				account: sdkStore.account,
				routerAddress: routerAddress,
				amountIn: sdkStore.inputAmount,
				nonce: permitInfo.nonce,
				deadline: this.deadline,
				salt: permitInfo.salt,
			});
			this._permitTypedData = typedData?{permit_type, typedData}:{};
		}else if(permit_type==='dai'){
			/* const typedData = $app.permit.buildDaiPermitData({
				names: [permitInfo.domainName, sdkStore?.tokenInData?.name],
				chainId: permitInfo.chainId||networkData[sdkStore?.chain].chainId,
				tokenAddress: tokenIn,
				domainSeparator: permitInfo.domainSeparator,
				account: sdkStore.account,
				routerAddress: routerAddress,
				amountIn: sdkStore.inputAmount,
				nonce: permitInfo.nonce,
				deadline: this.deadline,
				salt: permitInfo.salt,
				expiry: BigInt(Math.floor(Date.now() / 1000) + 3600),
			});
			this._permitTypedData = typedData?{permit_type, typedData}:{}; */
		}
		//console.log('this._permitTypedData', this._permitTypedData);
	}
	
	
	
	
	
	

	render() {
		
		let minOut = sdkStore?.selectedRoute?.amountOut||'0';
		try {
			const nativeToken = networkData?.[sdkStore?.chain]?.nativeToken?.native?.toLowerCase();
			const wrappedToken = networkData?.[sdkStore?.chain]?.nativeToken?.wrapped?.toLowerCase();
			const tokenIn = sdkStore?.tokenInData?.address?.toLowerCase();
			const tokenOut = sdkStore?.tokenOutData?.address?.toLowerCase();
			if(tokenIn===nativeToken&&tokenOut===wrappedToken){
			}else if(tokenIn===wrappedToken&&tokenOut===nativeToken){
			}else{
				minOut = $app.computeAmountMinOut(sdkStore?.selectedRoute?.amountOut, BigInt(sdkStore?.slippag*100));
			}			
		} catch (e) {}
		const toMinOut = viemUtils.formatUnits(BigInt(minOut), sdkStore?.tokenOutData?.decimals);
		const amountminout = $app.formatBalance(toMinOut);
		
		
		
		
		if(this.isExecute){
			return html`
				<stxapp-swap-execute 
					.oldPermitData=${this.permitData}
					?isQueryApprove=${this.isQueryApprove}
					.tokenIn=${this.tokenin.address}
					.tokenOut=${this.tokenout.address}
					.amountIn=${this.amountin}
					.amountMinOut=${minOut}
					.recipient="${this.customRecipient?this.customRecipient:sdkStore.account}"
					.swapData=${this.swapData}
					.deadline=${this.deadline}
					.swapfee="${this.swapfee}"
					?isApprove=${this.isApprove}
					.permitTypedData=${this._permitTypedData}
					?isETH=${this.tokenin.address.toLowerCase()===this.nativeToken?true:false}
					?isNeedApprove=${this.tokenin.address.toLowerCase()===this.nativeToken?false:true}
					.symbol="${this.tokenin.symbol}"
					.routeraddress=${this.routeraddress?this.routeraddress:sdkStore?.selectedRoute?.swapAddress}
					@close-execute=${this._closeClick}
					@refresh-swap=${this._refreshSwap}
					@transaction-send-close=${this._transactionSend}
					@already-approve=${this._alreadyApprove}
					@already-permit=${this._alreadyPermit}
				></stxapp-swap-execute>
			`;
		}
		
		const $t = sdkStore.$t;
		
		
		
		
		
		
		let gasusd = '$0';
		if(this.gasusd){
			if(0.01>Number(this.gasusd)){
				gasusd = '<$0.01';
			}else{
				gasusd = `$${$app.formatBalance(this.gasusd)}`;
			}
		}
		
		
		return html`
			<div class="stxapp-swap-confirm">
				<div style="display:flex;flex-direction:row;align-items:center;justify-content:space-between;padding-bottom: 20px;">
					<div class="font-family confirm-swap-title">${$t['confirm-swap-details']}</div>
					<com-icon-close @change=${this._closeClick} size="default"></com-icon-close>
				</div>
				
				<stxcom-token-card
					subtitle="${$t['input-amount']}"
					.symbol="${this.tokenin.symbol}"
					.logourl="${this.tokenin.logourl}"
					.value="${this.amountin}"
					.usdprice="${this.usdin}"
				></stxcom-token-card>
				<div style="height:15px;"></div>
				
				<stxcom-token-card
					subtitle="${$t['output-amount']}"
					.symbol="${this.tokenout.symbol}"
					.logourl="${this.tokenout.logourl}"
					.value="${this.amountout}"
					.usdprice="${this.usdout}"
				></stxcom-token-card>
				<div style="height:15px;"></div>
				
				
				<stxcom-details-list
					.outname="${this.tokenout.symbol}"
					.amountminout="${amountminout}"
					.slippage="${this.slippage}"
					.swapfee="${this.swapfee}"
					.gasusd="${gasusd}"
					.routeraddress="${this.routeraddress}"
				></stxcom-details-list>
				<div style="height:15px;"></div>
				
				
				<stxui-view-recipient 
					?disabledCustomRecipient=${this.disabledCustomRecipient}
					.recipient="${this.customRecipient?this.customRecipient:sdkStore.account}"
					@setrecipient=${()=>{this.isOpenSetrecipient=true;}}
				></stxui-view-recipient>
				<div style="height:15px;"></div>
				
				
				
				<stxapp-button 
					.disabled="${false}"
					type="primary" 
					@_click=${this._confirmSwap}
				>${$t['confirm-swap']}</stxapp-button>
				
				
				
				${this.isOpenSetrecipient?html`
					<stxui-set-recipient
						.currentrecipient="${this.customRecipient?this.customRecipient:sdkStore.account}"
						@cancel=${()=>{this.isOpenSetrecipient=false;}}
						@confirm=${(e)=>{
							this.isOpenSetrecipient=false;
							this.customRecipient=e.detail.value;
						}}
					></stxui-set-recipient>
				`:null}
				
				
			</div>
		`;
	}
	
	
	

	
	_confirmSwap(){
		this.isExecute = true;
	}
	
	
	_closeClick() {
		this.isExecute = false;
		this.customRecipient = '';
		this.dispatchEvent(new CustomEvent('close'));
	}
	_refreshSwap(){
		this._closeClick();
		this.dispatchEvent(new CustomEvent('refresh-router', {
			bubbles: false,
			composed: false
		}));
	}
	_transactionSend(){
		this.dispatchEvent(new CustomEvent('transaction-send', {
			bubbles: false,
			composed: false
		}));
		this._closeClick();
	}
}

if (!customElements.get('stxapp-swap-confirm')) {
	customElements.define('stxapp-swap-confirm', StxappSwapConfirm);
}
