import {
	LitElement,
	html,
	css
} from 'lit';

import { tokenPrices } from '../../api/cloud/tokenSinglePrice.js';
import { networkData } from '../../data/network-data.js';
import { $app } from '../../js_sdk/index.js';
import { cardInfo } from './stx-token-card-config.js';
import { sdkStore } from '../../data/store/store.js';
import { StoreMixin } from '../../data/store/state-mixin.js';
import '../stx-token-logo.js';
import '../../icon/com-icon-close.js';
import './com/com-load-sparklines.js';
import './com/com-token-sparklines.js';
import './com/com-empty-sparklines.js';

function calcDiffPercent(oldValue, newValue, decimals = 2) {
	if (oldValue === 0) return 0; 
	const diff = Math.abs((newValue - oldValue) / oldValue * 100);
	return Number(diff.toFixed(decimals));
}

export class StxTokenCard extends StoreMixin(LitElement) {
	static properties = {
		isCopied: { type: Boolean }, 
		showclose: { type: Boolean }, 
		tokeninfo: { type: Object }, 
		isTouchDevice: {
			type: Boolean
		},
		loadingState: { type: Boolean },
		calcPercent: { type: String },
		tokensTokencolor: { type: String },
		isRise: { type: Boolean },
		isEmpty: { type: Boolean },
		prices: { type: Array },
	};
	
	constructor() {
		super();
		this.tokeninfo = {};
		this.isCopied = false;
		this.loadingState = true;
		this.calcPercent = '-';
		this.tokensTokencolor = '#b2b2b2';
		this.isRise = false;
		this.isEmpty = false;
		this.prices = [];
		this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		this.showclose = false;
	}
	
	
	
	
	willUpdate(changedProperties) {
	    if (changedProperties.has('tokeninfo')) {
			if(this.tokeninfo&&this.tokeninfo?.address){
				//console.log(`tokeninfo`, this.tokeninfo);
				this.getTokenPrices(this.tokeninfo.chain, this.tokeninfo.address, 0);
			}
	    }
	}
	
	
	async getTokenPrices(network, tokenAddr, index) {
		if (!network||!tokenAddr||index>=2) return;
		const now = new Date(); // 获取当前时间
		const minutes = now.getMinutes();
		const postId = `${network}${tokenAddr}${minutes}`;
		//console.log(`postId`, postId);
		if(this._post_id===postId) return;
		const currentRequestSymbol = Symbol('request');
		this._lastRequest = currentRequestSymbol;
		this.loadingState = true;
		this.calcPercent = '-';
		this.tokensTokencolor = '#b2b2b2';
		this.isRise = false;
		this.isEmpty = false;
		this.prices = [];
		try {
			const data = await tokenPrices(network, tokenAddr);
			if(!data){
				this.loadingState = false;
				this.analyzeData(network, {
					token: null,
					price: []
				});
				return;
			}
			if (this._lastRequest !== currentRequestSymbol) return;
			this._post_id = postId;
			this.analyzeData(network, data);
			this.loadingState = false;
		} catch (error) {
			if(error.status===429){
				this.getTokenPrices(network, tokenAddr, index);
				return;
			}else{
				this.loadingState = false;
				this.analyzeData(network, {
					token: null,
					price: []
				});
				console.error('tokenPrices:', error);
			}
			/* if (this._lastRequest === currentRequestSymbol) {
				this.getTokenPrices(network, tokenAddr, index+1);
			} */
		}
	}
	
	
	
	_priceAnalysis(upPrice, centerPrice, sellUsd, buyUsd){
		if(upPrice===0){
			if(centerPrice>0){
				return centerPrice;
			}else if(sellUsd>0){
				return sellUsd;
			}else if(buyUsd>0){
				return buyUsd;
			}
		}else{
			const cjCen = calcDiffPercent(upPrice, centerPrice);
			const cjSell = calcDiffPercent(upPrice, sellUsd);
			const cjBuy = calcDiffPercent(upPrice, buyUsd);
			if(0.4>cjCen){
				return centerPrice;
			}else if(0.4>cjSell){
				return sellUsd;
			}else if(0.4>cjBuy){
				return buyUsd;
			}
			const cjObj = [
				{y: centerPrice, c: cjCen},
				{y: sellUsd, c: cjSell},
				{y: buyUsd, c: cjBuy},
			];
			const newArr = cjObj.sort((a, b) => Number(a.c) - Number(b.c));
			return newArr[0].y;
		}
		return 0;
	}
	analyzeData(network, data){
		this.priceUsd = '';
		try {
			if(data?.token?.usd_sell){
				this.priceUsd = data.token.usd_sell;
				sdkStore.updateChainTokenPrice(network, {
					[data.data.address.toLowerCase()]: this.priceUsd
				});
			}//console.log(`priceUsd`, data?.data?usd_sell);
		} catch (e) {}
		
		const prices = data.price.map(t => parseFloat(t));
		if(prices.length>24){
			const newArr = [];
			const page = prices.length/24;
			for(let i = 0; i < prices.length; i=i+page){
				const iid = Math.round(i);
				if(iid < prices.length){
					const priceGet = this._priceAnalysis(
						newArr.length>0?newArr[newArr.length-1]:0,
						prices[iid]?prices[iid]:0,
						prices[iid]?prices[iid]:0,
						prices[iid]?prices[iid]:0
					);
					newArr.push(priceGet);
				}else{
					/* if(iid!==(prices.length-1)){
						newArr.push(prices[prices.length-1]);
					} */
				}
			}
			this.prices = newArr;
			//console.log(`priceUsd`, prices, newArr);
		}else{
			this.prices = prices;
		}
		if(prices.length>0){
			try {
				this.calcPercent = calcDiffPercent(this.prices[0], this.prices[this.prices.length-1]);
				//this.calcPercent = calcDiffPercent(sell_usd[0], sell_usd[sell_usd.length-1]);
			} catch (err) {}
		}
		try {
			if(this.prices.length===0){
				this.tokensTokencolor = '#b2b2b2';
				this.isRise = false;
			}else if(this.prices[this.prices.length - 1]>=this.prices[0]&&this.prices.length>2){
				this.tokensTokencolor = '#3ebe6a';
				this.isRise = true;
			}else{
				this.tokensTokencolor = '#ff000e';
				this.isRise = false;
			}
		} catch (e) {}
		let isTrend = false;
		for(let i = 0; i < this.prices.length; i++){
			if(this.prices[i]>0){
				isTrend = true;
				break;
			}
		}
		this.isEmpty = !isTrend;
		if(this.isEmpty){
			this.tokensTokencolor = '#b2b2b2';
			this.isRise = false;
		}
		//console.log(`data`, this.prices);
	}
	
	
	
	static styles = css`
		:host {
			display: block;
		}
		.stx-token-card{
			background-color: var(--stxui-modal-background-color, #fff);
		}
		
		.card-logoname-body{
			padding: 10px;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}
		.card-logo-name{
			display: flex;
			flex-direction: row;
			align-items: center;
			column-gap: 10px;
		}
		
		.com-text-symbol {
			font-size: 15px;
			line-height: 18px;
			color: var(--stxui-theme-font-color, #111);
			user-select: none;
			font-family: var(--stxui-font-family);
			max-width: 240px;
		}
		.com-text-ellipsis {
			word-break: break-all;
			overflow: hidden;
			text-overflow: ellipsis !important;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1 !important;
		}
		.com-text-name {
			font-size: 12px;
			color: var(--stxui-dark-theme-focus-subcolor, #999);
			max-width: 140px;
			height: 16px;
			line-height: 16px;
			max-height: 16px;
		}
		
		
		.address-text{
			height: 22px;
			border-bottom-style: solid;
			border-bottom-width: 1px;
			border-bottom-color: rgba(0, 0, 0, 0);
		}
		.a-text-decoration{
			cursor: pointer;
		}
		.a-text-decoration:hover {
			border-bottom-style: solid;
			border-bottom-width: 1px;
			border-bottom-color: var(--stxui-dark-theme-focus-subcolor, #999);
		}
		.duankai-anns{
			cursor: pointer;
			height: 22px;
			display: flex;
			align-items: center;
			position: relative;
			top: -0.01rem;
		}
		.duankai-anns:hover {
			opacity: 0.8;
		}
		.text-font-family{
			user-select: none;
			font-family: var(--stxui-font-family);
		}
		.com-span-text {
			font-size: 14px;
			color: var(--stxui-dark-theme-focus-subcolor, #999);
			white-space: nowrap;
		}
		.text-price-span{
			height: 28px;
			line-height: 28px;
			font-size:15px;
		}
		.text-price-div{
			flex: 1;user-select: none;
			height: 28px;
			display: flex;flex-direction: row;align-items: center;justify-content: flex-end;
		}
  `;




	render() {
		let newPriceUsd = '--';
		try {
			newPriceUsd = $app.formatPriceBehalf(this.priceUsd, sdkStore.priceBehalf);
		} catch (err) {}
		const $t = sdkStore.$t;
		return html`
		<div class="stx-token-card" style="width:${cardInfo.width}px;">
			<div class="card-logoname-body">
				<div class="card-logo-name">
					<stx-token-logo
						size="36px"
						symbol="${this.tokeninfo?.symbol}" 
						logo="${this.tokeninfo?.logourl}"
					></stx-token-logo>
					<div style="flex: 1;display: flex;flex-direction: column;row-gap: 3px;">
						<span class="com-text-ellipsis com-text-symbol" style="flex: 1;">
							${this.tokeninfo?.symbol}
						</span>
						<span class="com-text-ellipsis com-text-name text-font-family" style="flex: 1;">
							${this.tokeninfo?.name}
						</span>
					</div>
				</div>
				
				${this.isTouchDevice||this.showclose?html`
					<div style="padding: 2px;">
						<com-icon-close @change="${this._onClose}" size="default"></com-icon-close>
					</div>
				`:``}
				
			</div>
			
			
			<div style="padding-left:12px;display: flex;flex-direction: row;align-items: center;column-gap: 4px;">
				
				<div @click="${this._onToAddress}" 
				class="address-text ${this.isTouchDevice?'':'a-text-decoration'}" style="height:21px;display: flex;flex-direction:row;align-items: center;column-gap:2px;">
					<span class="com-span-text text-font-family"
					>${this.tokeninfo?.address?.substring(0, 6)}...${this.tokeninfo?.address?.slice(-4)}</span>
					
					${this.isTouchDevice?``:html`
						<svg t="1752526436259" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23992" width="17" height="17"><path d="M855.467 501.333c-17.067 0-32 14.934-32 32v198.4c0 70.4-59.734 130.134-130.134 130.134H356.267c-83.2 0-151.467-66.134-151.467-149.334V358.4c0-64 53.333-117.333 117.333-117.333h168.534c17.066 0 32-14.934 32-32s-14.934-32-32-32H322.133c-100.266 0-181.333 81.066-181.333 181.333v352c0 117.333 96 213.333 215.467 213.333h337.066c106.667 0 194.134-87.466 194.134-194.133V533.333c0-17.066-14.934-32-32-32zM680.533 256H761.6L458.667 569.6A30.933 30.933 0 0 0 480 622.933c8.533 0 17.067-4.266 23.467-10.666l305.066-313.6v89.6c0 17.066 14.934 32 32 32s32-14.934 32-32v-147.2c0-27.734-23.466-51.2-51.2-51.2h-140.8c-17.066 0-32 14.933-32 32s14.934 34.133 32 34.133z" p-id="23993" fill="var(--stxui-dark-theme-focus-subcolor, #999)"></path></svg>
					`}
					
				</div>
				
				${this.isCopied?html`
					<span class="com-span-text text-font-family" style="line-height: 22px;"
					>${$t['copied']}!</span>
				`:html`
					<div @click="${this._onCopy}" class="duankai-anns">
						<svg t="1755861462010" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15574" data-spm-anchor-id="a313x.search_index.0.i30.391b3a81hP8E1y" width="17" height="17"><path d="M640 311.04H256a72.96 72.96 0 0 0-72.512 65.024L183.04 384v384a72.96 72.96 0 0 0 65.024 72.512L256 840.96h384a72.96 72.96 0 0 0 72.512-65.024L712.96 768V384a72.96 72.96 0 0 0-65.024-72.512L640 311.04z m128 401.92a72.96 72.96 0 0 0 72.512-65.024L840.96 640V256a72.96 72.96 0 0 0-65.024-72.512L768 183.04H384a72.96 72.96 0 0 0-72.512 65.024L311.04 256H640a128 128 0 0 1 128 128v328.96zM640 896H256a128 128 0 0 1-128-128V384a128 128 0 0 1 128-128 128 128 0 0 1 128-128h384a128 128 0 0 1 128 128v384a128 128 0 0 1-128 128 128 128 0 0 1-128 128z" fill="var(--stxui-dark-theme-focus-subcolor, #999)" p-id="15575"></path></svg>
					</div>
				`}
				
			</div>
			
			
			
			
			<div style="height:20px;"></div>
			
			
			<div style="position:relative;width:${cardInfo.width}px;height:138px;">
				${this.loadingState?html`
					<com-load-sparklines></com-load-sparklines>
				`:this.isEmpty?html`<com-empty-sparklines></com-empty-sparklines>`:html`
				
					<com-token-sparklines
						.prices="${this.prices}"
					></com-token-sparklines>
					
				`}
				
				${this.loadingState?``:html`
					<div style="position:absolute;z-index:1;bottom:0;right:0;left:0;display:flex;flex-direction:row;align-items:center;padding: 15px;column-gap:2px;justify-content: space-between;">
						<span class="text-price-span text-font-family" style="flex:1;color:var(--stxui-theme-font-color, #111);"
						>${newPriceUsd}</span>
						<div class="text-price-div">
							<span class="text-font-family" style="color: ${this.tokensTokencolor};font-size:15px;line-height:28px;"
							>${this.isRise?'+':'-'}${this.calcPercent}%</span>
							<span class="text-font-family" style="font-size:13px;line-height:28px;color:var(--stxui-dark-theme-focus-subcolor, #999);"
							>(24h)</span>
						</div>
					</div>
				`}
				
			</div>
			
			
		</div>
    `;
	}
	
	
	
	_onClose() {
		this.dispatchEvent(new CustomEvent('close', {
			detail: {},
			bubbles: true,
			composed: false
		}));
	}
	async _onCopy() {
	    const success = await $app.copyToClipboard(this.tokeninfo?.address);
	    if (success) {
	        this.isCopied = true;
	        setTimeout(() => this.isCopied = false, 2000);
	        //console.log('复制成功！');Copied!
	    }
	}
	_onToAddress(){
		if(this.isTouchDevice){return;}
		const url = networkData[this.tokeninfo?.chain].blockExplorer.token.replace('{{address}}', this.tokeninfo?.address);
		$app.openUrl(url);
	}
}

if (!customElements.get('stx-token-card')) {
	customElements.define('stx-token-card', StxTokenCard);
}
