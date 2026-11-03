
import {
    LitElement,
    html,
    css
} from 'lit';

import { sdkStore } from '../../data/store/store.js';
import { StoreMixin } from '../../data/store/state-mixin.js';
import { networkData } from '../../data/network-data.js';
import { $app } from '../../js_sdk/index.js';
import { allTokens } from '../../api/cloud/getTokenList.js';
import { batchQueryTokenBalance } from '../../api/chain/batchQueryTokenBalance.js';
import { viemUtils } from '../../js_sdk/viem/utils.js';

import '../../icon/com-icon-close.js';
import '../../com/stx-token-logo.js';

export class StxcomWalletContent extends StoreMixin(LitElement) {
    static properties = {
        isCopied: { type: Boolean }, 
		tokenList: { type: Array },
		loadingState: { type: String },
		totalUsd: { type: String },
    };
	

	
	static styles = css`
	    :host {
	        width:100%;height:100%;display:flex;flex-direction:column;
	    }
		
		.font-family{
			user-select: none;
			font-family: var(--stxui-font-family);
		}
		.my-wallet-title{
			box-sizing: border-box;
			font-size: 17px;
			color: var(--stxui-theme-font-color, #111);
		}
		
		.wallet-usd-card{
			background-color: #111;
			background-image: url('https://cdn.swaptox.com/assets/png/my_token_bg.png');
			background-size: 100% 100%;
			background-position: center;
			background-repeat: no-repeat;
			height: 80px;
			padding: 15px;
			padding-top: 10px;
			padding-right: 10px;
			border-radius: 18px;
		}
		.duankai-lianj{
			cursor: pointer;
			height: 28px;
			/*width: 30px;*/
			display: flex;align-items: center;justify-content: center;column-gap:2px;
			border-radius: 80px;
			background-color: rgba(255, 255, 255, 0.1);
			padding: 0 10px;
			border: 1px solid #5e5e5e;
		}
		.duankai-lianj:hover {
			opacity: 0.8;
			background-color: rgba(255, 255, 255, 0.1);
		}
		
		

		
		
		.address-text{
			fill: #fff;
			color: #fff;
			height: 24px;
			border-bottom-style: solid;
			border-bottom-width: 1px;
			border-bottom-color: rgba(0, 0, 0, 0);
		}
		.icon-to{
			fill: inherit;
		}		
		.account-text{
			color: inherit;
		}
		
		
		
		.a-text-decoration{
			cursor: pointer;
		}
		.a-text-decoration:hover {
			fill: #00ffa9;
			color: #00ffa9;
			border-bottom-style: solid;
			border-bottom-width: 1px;
			border-bottom-color: #00ffa9;
		}
		
		
		.com-span-text23 {
			font-size: 14px;
			white-space: nowrap;
			line-height: 24px;
		}
		
		.duankai-anns{
			cursor: pointer;
			fill: #fff;
			height: 22px;
			display: flex;
			align-items: center;
			position: relative;
			top: -0.01rem;
		}
		.duankai-anns:hover {
			fill: #00ffa9;
		}
		.text-font-family{
			user-select: none;
			font-family: var(--stxui-font-family);
		}

		.text-price-span{
			height: 28px;
			line-height: 28px;
			font-size:15px;
		}
		
		
		
		
		
		.token-list-border-top{
			border-bottom-style:solid;
			border-bottom-width:1px; 
			border-bottom-color:var(--stxui-card-line-color, #ececec);
		}
		.tokenlist-content-body {
			overflow-x: hidden;
			overflow-y: auto;
		
			position: relative;
			border: none;
			outline: none;
		
			overscroll-behavior-y: contain;
			-webkit-overflow-scrolling: touch;
			touch-action: pan-y;
			scrollbar-width: none;
			-ms-overflow-style: none;
		}
		.tokenlist-content-body::-webkit-scrollbar {
			display: none;
		}
		
		
		
		
		
		
		
		
		.com-token-item {
			padding: 10px 15px;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
		.com-token-item:hover {
			background-color: var(--stxui-list-item-bg-hover, #f7f8f9);
		}
		
		
		.token-item-name {
			font-size: 16px;
			line-height: 18px;
			color: var(--stxui-theme-font-color, #111);
		}
		.token-item-subtitle {
			white-space: nowrap;
			line-height: 16px;
			font-size: 14px;
			color: #999;
		}
		.token-name-ellipsis {
			word-break: break-all;
			overflow: hidden;
			text-overflow: ellipsis !important;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1 !important;
		}
		.balance-token-text {
			white-space: nowrap;
			font-size: 18px;
			line-height: 20px;
			color: var(--stxui-theme-font-color, #111);
			text-align: right;
		}
		
		.balance-token-subtitle {
			font-size: 14px;
			line-height: 20px;
			color: #999;
			white-space: nowrap;
			text-align: right;
		}
		
		
		.app-load-state-body{
			padding: 10px 0;
		}
		
	`;
	

    connectedCallback() {
        super.connectedCallback();
        sdkStore.addEventListener('sdk-state-changed', this._handleStateChange);
    }
    
    disconnectedCallback() {
        sdkStore.removeEventListener('sdk-state-changed', this._handleStateChange);
        super.disconnectedCallback();
    }

    constructor() {
        super();
		this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		this.isCopied = false;
		this.loadingState = '';
		this.totalUsd = '--';
		this.tokenList = [];
		
		this._handleStateChange = (e) => {
			const store = e.target;
			if(store.chain!==this._chain){
				this._chain = store.chain;
				this._getTokenList();
			}
			if(store.account!==this._account){
				this._account = store.account;
				this._getTokenList();
			}
		};
		
    }
	
	
	//获取代币，不展示也不获取余额
	async _getTokenList() {
		this._original = [];
		this.tokenList = [];
		this.totalUsd = '--';
		
		if(!this._account){
			this.loadingState = 'empty';
			return;
		}
		
	    this.loadingState = 'load';
		this._original = await allTokens(this._chain);
		if (!Array.isArray(this._original)) {
			this.loadingState = 'error';
			return;
		}
		
		this._updateWalletBalance();
	}
	
	
	
	async _getWalletBalance(addresse, isNotify) {
		const balances = await batchQueryTokenBalance(this._chain, [addresse, this._account]);
		const updatePayload = {};
		if (!balances || balances.length === 0){
			for (let i = 0; i < addresse.length; i++) {
				updatePayload[addresse[i]] = 0n;
			}
		}else{
			for (let i = 0; i < addresse.length; i++) {
				updatePayload[addresse[i]] = balances[i];
			}
		}
		sdkStore.updateChainBalances(this._chain, updatePayload, isNotify);
	}
	
	
	async _updateWalletBalance(){
		if(!this._account){return;}
		if(this._original.length===0){return;}
		const addresss = this._original.map(t => t.address.toLowerCase());
		if (addresss.length === 0) return;
		let newAdd = $app.paginate(addresss, networkData[this._chain].batchQueryTokenBalanceNum||300);
		for(let i = 0; i < newAdd.length; i++){
			await this._getWalletBalance(newAdd[i], i===(newAdd.length-1)?true:false);
		}
		this.tokenList = [...this._formatDataList(this._original)];
		this.loadingState = 'success';
		//console.log(this.tokenList);
	}
	
	
	
	
	_getTokenPrice(data){
		const usdPrice = sdkStore.tokenPrice?.[this._chain]?.[data.address];
		if(usdPrice){
			return usdPrice;
		}
		return data.usd_sell||'';
	}
	
	
	_formatDataList(data){
		const tkList = [];
		let allUSD = 0;
		for(let i = 0; i < data.length; i++){
			try {
				const bal = sdkStore.allBalance?.[this._chain]?.[data[i].address];
				if(bal>0n){
					const balNum = viemUtils.formatUnits(bal, data[i].decimals);
					const balanceUp = $app.formatBalance(balNum);
					
					const tokenPrice = this._getTokenPrice(data[i]);
					const priceUp = tokenPrice?`${$app.formatPriceBehalf(tokenPrice, sdkStore.priceBehalf)}`:'--';
					
					const valUSD = $app.calculateUsdValue(bal, viemUtils.parseUnits('1', data[i].decimals), tokenPrice);
					const usd_up = valUSD==='0'?'--':$app.formatPriceBehalf(valUSD, sdkStore.priceBehalf);
					
					tkList.push({...data[i],
						balance: bal,
						balance_format: balNum,
						balance_up: balanceUp,
						usd_sell: tokenPrice,
						price_up: priceUp,
						usd_up: usd_up,
						$usd: Number(valUSD)
					});
					allUSD += Number(valUSD);
				}
			} catch (err) {}
		}
		this.totalUsd = allUSD>0?$app.formatPriceBehalf(allUSD.toString(), sdkStore.priceBehalf):'$0.00';
		return tkList.sort((a, b) => Number(b.$usd) - Number(a.$usd));
	}
	
	
	
	
	
	
	
	
	
	listItemRender(item){
		return html`
			<div @click=${()=>this._tapToken(item)} class="com-token-item">
			
			
				<div style="flex:3;display:flex;flex-direction:row;align-items:center;column-gap:10px;">
					
					<stx-token-logo
						size="36px"
						.symbol="${item?.symbol}" 
						.logo="${item?.logourl}"
					></stx-token-logo>
					
					
					<div style="display:flex;flex-direction:column;">
			
						<div style="flex:1;" class="font-family token-item-name token-name-ellipsis"
						>${item?.symbol}</div>
			
						<div style="height:2px;"></div>
						
						<div style="height:16px;display:flex;flex-direction:row;align-items:center;column-gap:6px;">
							<div class="font-family token-item-subtitle">${item?.price_up}</div>
							<!--
							<div class="font-family token-item-subtitle">+0.2%</div>
							-->
						</div>
					</div>
				</div>
			
				<div style="display: flex;flex-direction: column;">
					<div class="font-family balance-token-text" style="padding-left:8px;"
					>${item?.balance_up}</div>
					<div class="font-family balance-token-subtitle">${item?.usd_up}</div>
				</div>
			
			</div>
			
		`;
	}
	
	
	
	
	


    render() {
		const $t = sdkStore.$t;
		const account = sdkStore.account;
		const walletLogo = sdkStore.walletLogo;
		const accountBefore = account?account.slice(0, 6):'';
		const accountAfter = account?account.slice(-4):'';
		const currentChain = sdkStore.chain;
		
        return html`
            <div style="flex: 1;width:100%;height:100%;display:flex;flex-direction:column;">
            
            	<div style="padding: 15px;display: flex;flex-direction: row;align-items: center;justify-content: space-between;">
            		<div class="font-family my-wallet-title">${$t['my-wallet']}</div>
            		<com-icon-close @change=${this._close} size="default"></com-icon-close>
            	</div>
            	
            	<div class="token-list-border-top" style="padding: 15px;padding-top: 0;">
            		<div class="wallet-usd-card">
            			
            			
            			<div style="display: flex;flex-direction: row;align-items: center;justify-content: space-between;">
            				
            				<div style="display: flex;flex-direction: row;align-items: center;column-gap: 4px;">
            					
								<img style="width:20px;height:20px;user-select: none;"
									src="${networkData?.[currentChain]?.logo}"
									loading="lazy"
									decoding="async"
								/>
								
								
            					<div @click="${this._onToAddress}" 
            					class="address-text ${this.isTouchDevice?'':'a-text-decoration'}" style="height:24px;display: flex;flex-direction:row;align-items: center;column-gap:2px;">
            						<span class="com-span-text23 font-family account-text"
            						>${accountBefore}...${accountAfter}</span>
            						
            						${this.isTouchDevice?``:html`
            							<svg t="1752526436259" class="icon-to" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23992" width="17" height="17"><path d="M855.467 501.333c-17.067 0-32 14.934-32 32v198.4c0 70.4-59.734 130.134-130.134 130.134H356.267c-83.2 0-151.467-66.134-151.467-149.334V358.4c0-64 53.333-117.333 117.333-117.333h168.534c17.066 0 32-14.934 32-32s-14.934-32-32-32H322.133c-100.266 0-181.333 81.066-181.333 181.333v352c0 117.333 96 213.333 215.467 213.333h337.066c106.667 0 194.134-87.466 194.134-194.133V533.333c0-17.066-14.934-32-32-32zM680.533 256H761.6L458.667 569.6A30.933 30.933 0 0 0 480 622.933c8.533 0 17.067-4.266 23.467-10.666l305.066-313.6v89.6c0 17.066 14.934 32 32 32s32-14.934 32-32v-147.2c0-27.734-23.466-51.2-51.2-51.2h-140.8c-17.066 0-32 14.933-32 32s14.934 34.133 32 34.133z" p-id="23993"></path></svg>
            						`}
            						
            					</div>
            					
            					${this.isCopied?html`
            						<span class="com-span-text23 font-family" style="color: #999;line-height: 24px;"
            						>${$t['copied']}!</span>
            					`:html`
            						<div @click="${this._onCopy}" class="duankai-anns">
            							<svg t="1755861462010" class="icon-to" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15574" data-spm-anchor-id="a313x.search_index.0.i30.391b3a81hP8E1y" width="17" height="17"><path d="M640 311.04H256a72.96 72.96 0 0 0-72.512 65.024L183.04 384v384a72.96 72.96 0 0 0 65.024 72.512L256 840.96h384a72.96 72.96 0 0 0 72.512-65.024L712.96 768V384a72.96 72.96 0 0 0-65.024-72.512L640 311.04z m128 401.92a72.96 72.96 0 0 0 72.512-65.024L840.96 640V256a72.96 72.96 0 0 0-65.024-72.512L768 183.04H384a72.96 72.96 0 0 0-72.512 65.024L311.04 256H640a128 128 0 0 1 128 128v328.96zM640 896H256a128 128 0 0 1-128-128V384a128 128 0 0 1 128-128 128 128 0 0 1 128-128h384a128 128 0 0 1 128 128v384a128 128 0 0 1-128 128 128 128 0 0 1-128 128z" p-id="15575"></path></svg>
            						</div>
            					`}
            					
            				</div>
            				
            				
            				
            				<div @click="${this._disconnect}" class="duankai-lianj">
            					<svg t="1752886882905" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13720" width="14" height="14"><path d="M511.771963 1023.291077c-63.724308 0-125.558154-12.445538-183.768615-37.100308a469.464615 469.464615 0 0 1-150.134154-101.139692 471.118769 471.118769 0 0 1 59.392-717.351385 37.021538 37.021538 0 0 1 43.008 59.864616 403.692308 403.692308 0 0 0-121.304616 139.027692A391.798154 391.798154 0 0 0 113.435963 551.227077c0 106.338462 41.432615 206.375385 116.657231 281.6a395.736615 395.736615 0 0 0 281.678769 116.736c106.338462 0 206.454154-41.432615 281.757539-116.736a395.421538 395.421538 0 0 0 116.65723-281.6 391.483077 391.483077 0 0 0-45.528615-184.635077 403.298462 403.298462 0 0 0-121.304615-138.870154 36.864 36.864 0 0 1 43.008-59.943384 471.04 471.04 0 0 1 59.392 717.430153 471.04 471.04 0 0 1-333.981539 138.161231z m11.106462-512.236308a36.864 36.864 0 0 1-36.94277-36.864V37.021538a37.021538 37.021538 0 0 1 73.964308 0v437.169231c0 20.48-16.541538 36.864-37.021538 36.864z" fill="#ffffff" p-id="13721"></path></svg>
								<span class="com-span-text23 font-family" style="color:#fff;line-height:20px;font-size:12px;"
								>${$t['disconnect']}</span>
							</div>
            				
            			</div>
            			
						
						
						<div class="font-family" style="font-size:30px;color:#fff;padding-top:5px;font-weight:400;"
						>${this.totalUsd}</div>
            		
            		
            		</div>
            	</div>
            	
            	
            	
            	
            	<div class="tokenlist-content-body" style="flex:1;">
				
					${this.loadingState==='success'?null:html`
						<div class="app-load-state-body">
							<stxapp-load-state .state="${this.loadingState}" 
							@retry="${()=>{this._getTokenList()}}"></stxapp-load-state>
						</div>
					`}
					
					${this.tokenList.map((item) => this.listItemRender(item))}
				</div>
            	
            
            
            </div>
        `;
    }
	_close(){
		this.dispatchEvent(new CustomEvent('close'));
	}
	
	_disconnect(){
		this._close();
		window?.$swaptoxConnect?.disconnect();
	}
	_tapToken(item){
		//console.log(item);
	}
	
	
	
	_onToAddress(){
		if(this.isTouchDevice){return;}
		const url = networkData[sdkStore.chain].blockExplorer.contract.replace('{{address}}', sdkStore.account);
		$app.openUrl(url);
	}
	async _onCopy() {
	    const success = await $app.copyToClipboard(sdkStore.account);
	    if (success) {
	        this.isCopied = true;
	        setTimeout(() => this.isCopied = false, 2000);
	    }
	}
}

if (!customElements.get('stxcom-wallet-content')) {
    customElements.define('stxcom-wallet-content', StxcomWalletContent);
}
