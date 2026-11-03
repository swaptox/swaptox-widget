
import {
	LitElement,
	html,
	css
} from 'lit';

import { getTokens } from '../../api/cloud/getTokens.js';
import { getProtocol } from '../../api/cloud/getProtocol.js';
import { $app } from '../../js_sdk/index.js';
import { sdkStore } from '../../data/store/store.js';
import { StoreMixin } from '../../data/store/state-mixin.js';
import { getRouteTrend } from '../../data/routeTrend/getRouteTrend.js';
import { viemUtils } from '../../js_sdk/viem/utils.js';
import { networkData } from '../../data/network-data.js';
import { gasIcon } from '../../icon/flickr-ball-circle-round';

import '../../icon/com-icon-close.js';

export class StxappRouteTrend extends StoreMixin(LitElement) {
	static get properties() {
		return {
			optionalRoute: {
				type: Boolean,
			},
		};
	}
	
	
	constructor() {
		super();
		this.optionalRoute = true;
	}

	static styles = css`
		:host {
			display: block;
		}
		.best-route-text{
			font-size: 16px;
			user-select: none;
			font-family: var(--stxui-font-family);
			color: var(--stxui-theme-font-color, #999);
			white-space:nowrap;
			line-height: 28px;
			height: 28px;
		}
		.stxapp-route-trend-bdoy{
			overflow: auto;
			position:relative;
			max-height: 58vh;
			border: none;
			outline: none;
			/* 1. 针对 Chrome, Safari, Edge (WebKit 内核) */
			&::-webkit-scrollbar {
			    display: none;
			}
			/* 2. 针对 Firefox */
			scrollbar-width: none;
			/* 3. 针对 IE/Edge (旧版) */
			-ms-overflow-style: none;
		}
		.no-get-route-text{
			user-select:none;
			font-family: var(--stxui-font-family);
			line-height: 48px;
			font-size: 14px;
			color: var(--stxui-dark-theme-subcolor, #999);
		}
		.route-trend-modal-load{
			display: var(--stxui-route-is-loading);
			position: absolute;top: 0;left: 20px;right: 20px;bottom: 0px;border-radius: 18px;overflow: hidden;
		}
		.route-trend-modal-load::after {
			position: absolute;
			top: 0; right: 0; bottom: 0; left: 0;
			border-radius: 18px;
			/*background-image: var(--stxui-skeleton-background-load);*/
			background-image: var(--stxui-skeleton-background-body-load);
			border: 1px solid var(--stxui-theme-border-color, #eee);
			background-size: 500% 500%;
			animation: trend-skeleton 1.8s ease infinite;
			content: '';
		}
		@keyframes trend-skeleton {
			0% {
				background-position: 100% 50%;
			}
			100% {
				background-position: 0 50%;
			}
		}
		
		
		
		.routes-choose-bg-border{
			position: relative;
			border: 1px solid var(--stxui-theme-border-color, #eee);
			border-radius: 18px;
			background-color: var(
				--stxui-theme-content-background-color,
				#fbfbfb
			);
			display: flex;flex-direction: row;align-items: center;justify-content: space-between;
		}
		.routes-choose-bg-border:hover{
			border: 1px solid var(--stxui-swaptox-routes-choose-border, #02b6a680);
			box-shadow: 0 0 0 2px var(--stxui-swaptox-routes-choose-border, #02b6a680);
			background-color: var(--stxui-swaptox-routes-choose-background);
		}
		.selected-route{
			border: 1px solid var(--stxui-swaptox-routes-choose-border, #02b6a680);
			box-shadow: 0 0 0 2px var(--stxui-swaptox-routes-choose-border, #02b6a680);
			background-color: var(--stxui-swaptox-routes-choose-background);
		}
		.routes-choose-title {
			font-size: 17px;
			color: var(--stxui-theme-font-color, #111);
			line-height: 32px;
			user-select: none;
			font-family: var(--stxui-font-family);
		}
		.font-family {
			user-select: none;
			font-family: var(--stxui-font-family);
		}
		.xuanzhong-bg-div{
			position: absolute;top:-2px;right:-2px;
			width:28px;
			height:20px;
			background-color: var(--stxui-swaptox-routes-choose-border, #02b6a680);
			border-bottom-left-radius: 100px;
			border-bottom-right-radius: 0px;
			border-top-left-radius: 0px;
			border-top-right-radius: 100px;
			display: flex;align-items: center;justify-content: center;
		}
		
		.xiao-anniaos{
			height: 15px;
			line-height: 15px;
			border-radius: 5px;
			-webkit-user-select: none;
			user-select: none;
			white-space: nowrap;
			padding: 0px 8px;
			font-size: 11px;
		}
		
		.dubu-ximxi{
			display: flex;flex-direction: row;column-gap: 15px;justify-content: space-between;align-items: center;
			padding-left: 15px;padding-right: 15px;
			padding-bottom: 15px;
		}
		.output-text-load-skeleton-item{
			display: var(--stxui-icon-switch-token-load);
			position: absolute;
			z-index: 5;
			top: 0; right: 0; bottom: 0; left: 0;
		}
		.output-text-load-skeleton-item::after {
			position: absolute;
			z-index: 10;
			top: 0; right: 0; bottom: 0; left: 0;
			background-image: var(--stxui-skeleton-background-body-load);
			border: 1px solid var(--stxui-theme-border-color, #eee);
			background-size: 500% 500%;
			animation: skeleton 1.8s ease infinite;
			content: '';
			border-radius: 18px;
		}
		
		
		.stxapp-route-trend-x-bdoy{
			overflow-x: auto;
			position: relative;
			border: none;
			outline: none;
			/* 1. 针对 Chrome, Safari, Edge (WebKit 内核) */
			&::-webkit-scrollbar {
			    display: none;
			}
			/* 2. 针对 Firefox */
			scrollbar-width: none;
			/* 3. 针对 IE/Edge (旧版) */
			-ms-overflow-style: none;
		}
	`;
	
	

	render() {
		const $t = sdkStore.$t;
		const selectedRoute = sdkStore.selectedRoute;
		if(selectedRoute&&selectedRoute.result){
			this._getRouteSvg(selectedRoute.result);
		}
		
		
		
		
		
		if(!this.optionalRoute){
			return html`
				<div style="padding:18px;padding-bottom:14px;display:flex;justify-content:space-between;">
					<span class="best-route-text"
					>${selectedRoute&&selectedRoute?.bestRoute?$t['best-route']:$t['swap-route']}</span>
					<com-icon-close @change=${this._closeClick} size="default"></com-icon-close>
				</div>
				
				<div class="stxapp-route-trend-bdoy" style="min-height: 350px;">
					${selectedRoute?html`
						<div
							style="min-height: 350px;min-width:680px;user-select:none;padding: 0px 20px;display:var(--stxui-icon-switch-token-open, flex);justify-content:center;align-items:center;" 
							id="route-trend-svg"
						></div>
					`:html`
						<div style="position: absolute;top: 0;left: 20px;right: 20px;bottom: 0;display: flex;flex-direction: column;align-items: center;justify-content: center;">
							<svg t="1791398691687" class="icon" viewBox="0 0 1254 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9301" width="60" height="60"><path d="M715.292563 180.704879h128.005968c15.053908 0 30.114638-12.550608 30.114638-30.121459 0-15.057319-12.550608-30.114638-30.114638-30.114637h-128.005968c-15.060729 0-30.114638 12.547197-30.114638 30.114637 0 17.574261 12.550608 30.121459 30.114638 30.121459zM1104.313659 0c-82.82378 0-150.586831 67.763051-150.586831 153.096953 0 82.82378 67.763051 153.100363 150.586831 153.100363s150.586831-67.763051 150.586831-153.100363C1254.9039 67.763051 1187.137439 0 1104.313659 0z m0 245.961219c-50.199021 0-92.864266-42.665246-92.864267-92.864266 0-50.19561 40.151714-92.864266 92.864267-92.864267 50.199021 0 92.864266 42.668656 92.864266 92.864267 0 50.199021-42.665246 92.864266-92.864266 92.864266z m-376.470488 240.944386h-188.231834c-7.530365 0-160.630728-22.594505-160.630728-163.140849 0-135.526102 140.549755-140.546345 155.610485-140.546345h47.682078c15.060729 0 27.604516-15.060729 27.604517-30.121458 0-15.057319-12.543787-27.607927-27.604517-30.118049h-47.682078c-72.790115 0-213.33646 42.672067-213.33646 200.785852 0 155.603664 138.039634 213.33646 213.33646 223.373535h188.228423c7.533775 0 160.634138 22.587684 160.634138 163.134029 0 135.532923-140.549755 140.549755-155.610484 140.549755H298.666951c-10.037076-75.296826-72.783294-130.512679-148.08012-130.512679C67.766461 720.312806 0 788.075857 0 873.409759c0 82.82378 67.766461 150.586831 150.586831 150.586831 70.276583 0 130.512679-50.199021 145.569998-115.451951h431.686342c75.296826 0 213.33646-42.665246 213.336459-200.785851-0.00341-155.600253-138.039634-213.322818-213.336459-220.853183zM150.586831 966.274025c-50.19561 0-92.864266-42.665246-92.864266-92.864266 0-52.702321 42.668656-95.374388 92.864266-95.374388 50.199021 0 92.864266 42.672067 92.864266 92.867676-2.510122 52.705732-42.665246 95.370978-92.864266 95.370978z m0 0" p-id="9302" fill="#999999"></path></svg>
							<span class="no-get-route-text"
							>${$t['route-not-found']}</span>
						</div>
					`}
					<div class="route-trend-modal-load"></div>
				</div>
				
				<div style="height:20px;"></div>
			`;
		}
		
		
		
		
		
		
		
		const symbol = sdkStore?.tokenOutData?.symbol;
		const logourl = sdkStore?.tokenOutData?.logourl;
		const routes = sdkStore?.routes||[];
		
		return html`
			<div style="padding:18px;padding-bottom:14px;display:flex;justify-content:space-between;">
				<span class="best-route-text"
				>${selectedRoute&&selectedRoute?.bestRoute?$t['best-route']:$t['swap-route']}</span>
				<com-icon-close @change=${this._closeClick} size="default"></com-icon-close>
			</div>
			
			
			
			<div class="stxapp-route-trend-x-bdoy" style="position:relative;">
				${selectedRoute?html`
					<div
						style="opacity:var(--stxui-icon-arrow-loading-hide);min-width:680px;user-select:none;padding: 0px 20px;display:flex;justify-content:center;align-items:center;" 
						id="route-trend-svg"
					></div>
				`:html`
					<div style="height:200px;"></div>
					<div style="position: absolute;top: 0;left: 20px;right: 20px;bottom: 0;display: flex;flex-direction: column;align-items: center;justify-content: center;">
						<svg t="1791398691687" class="icon" viewBox="0 0 1254 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9301" width="60" height="60"><path d="M715.292563 180.704879h128.005968c15.053908 0 30.114638-12.550608 30.114638-30.121459 0-15.057319-12.550608-30.114638-30.114638-30.114637h-128.005968c-15.060729 0-30.114638 12.547197-30.114638 30.114637 0 17.574261 12.550608 30.121459 30.114638 30.121459zM1104.313659 0c-82.82378 0-150.586831 67.763051-150.586831 153.096953 0 82.82378 67.763051 153.100363 150.586831 153.100363s150.586831-67.763051 150.586831-153.100363C1254.9039 67.763051 1187.137439 0 1104.313659 0z m0 245.961219c-50.199021 0-92.864266-42.665246-92.864267-92.864266 0-50.19561 40.151714-92.864266 92.864267-92.864267 50.199021 0 92.864266 42.668656 92.864266 92.864267 0 50.199021-42.665246 92.864266-92.864266 92.864266z m-376.470488 240.944386h-188.231834c-7.530365 0-160.630728-22.594505-160.630728-163.140849 0-135.526102 140.549755-140.546345 155.610485-140.546345h47.682078c15.060729 0 27.604516-15.060729 27.604517-30.121458 0-15.057319-12.543787-27.607927-27.604517-30.118049h-47.682078c-72.790115 0-213.33646 42.672067-213.33646 200.785852 0 155.603664 138.039634 213.33646 213.33646 223.373535h188.228423c7.533775 0 160.634138 22.587684 160.634138 163.134029 0 135.532923-140.549755 140.549755-155.610484 140.549755H298.666951c-10.037076-75.296826-72.783294-130.512679-148.08012-130.512679C67.766461 720.312806 0 788.075857 0 873.409759c0 82.82378 67.766461 150.586831 150.586831 150.586831 70.276583 0 130.512679-50.199021 145.569998-115.451951h431.686342c75.296826 0 213.33646-42.665246 213.336459-200.785851-0.00341-155.600253-138.039634-213.322818-213.336459-220.853183zM150.586831 966.274025c-50.19561 0-92.864266-42.665246-92.864266-92.864266 0-52.702321 42.668656-95.374388 92.864266-95.374388 50.199021 0 92.864266 42.672067 92.864266 92.867676-2.510122 52.705732-42.665246 95.370978-92.864266 95.370978z m0 0" p-id="9302" fill="#999999"></path></svg>
						<span class="no-get-route-text"
						>${$t['route-not-found']}</span>
					</div>
				`}
				<div class="output-text-load-skeleton-item" style="margin: 0 20px;"></div>
			</div>
			
			
			
			<div style="display: flex;flex-direction: column;row-gap: 15px;padding: 15px 20px;${routes.length>0?'':'padding-top: 0px;'}">
				${routes.map(
					(item) => html`
					<div style="position:relative;height:56px;flex:1;">
					
						<div @click=${()=>{this._selectedRoute(item)}} 
						style="padding: 12px 15px;padding-top: 15px;padding-bottom: 15px;opacity:var(--stxui-icon-arrow-loading-hide);"
						class="routes-choose-bg-border ${item.selected?'selected-route':''}">
							
							<div style="display: flex;flex-direction: row;align-items: center;column-gap:6px;">
								<stx-token-logo
									size="24px"
									.symbol="${symbol}" 
									.logo="${logourl}"
								></stx-token-logo>
								<span class="routes-choose-title" style="line-height:20px;"
								>${this._getAmountOut(item.amountOut)} ${symbol}</span>
							</div>
							
							
							<div style="display: flex;flex-direction: row;align-items: center;column-gap:4px;">
								<span class="routes-choose-title" 
								style="font-size:15px;color:#999;line-height:24px;"
								>${this._getGasFee(item.gasFeeUsd)}</span>
								${gasIcon()}
							</div>
							
							
							
							<div style="position:absolute;top:0px;left:15px;z-index: 1;display: flex;flex-direction: row;align-items: center;column-gap:6px;">
								
								${item.maxOutput?html`
									<div class="xiao-anniaos font-family"
									style="color: #40b66b;background-color: color-mix(in srgb, #58ff95 20%, transparent);"
									>MAX</div>
								`:null}
								
								${item.bestRoute?html`
									<div class="xiao-anniaos font-family"
									style="color: var(--stxui-best-route-tag-text);background-color: var(--stxui-best-route-tag-bg);"
									>Best</div>
								`:null}
								
							</div>
							
							
							
							${item.selected?html`
								<div class="xuanzhong-bg-div">
									<div style="--xuanzhong-icon-se: #ffffff;position:relative;top:0px;right:0px;">
										<svg t="1792540670635" class="icon" viewBox="0 0 1380 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="47875" width="12" height="12"><path d="M295.646374 885.684611L0 590.038237l200.024774-194.309781 293.137353 293.137352L1184.118786 0 1379.961858 195.843072 688.726418 884.70888l1.115121 0.975731-2.927192 2.787802a282.264926 282.264926 0 0 1-18.678271 16.72681l-78.337229 78.058449a139.390087 139.390087 0 0 1-196.958193-0.139391l-97.43367-97.43367z" p-id="47876" fill="var(--xuanzhong-icon-se)"></path></svg>
									</div>
								</div>
							`:null}
							
						</div>
						
						<div class="output-text-load-skeleton-item"></div>
						
					</div>`
				)}
			</div>
			
			
			<div style="height:5px;"></div>
		`;
	}
	
	async _getProtocol(){
		if(!this._protocol||!this._protocol?.obj){
			this._protocol = await getProtocol();
		}
		return this._protocol&&this._protocol?.obj?this._protocol.obj:{};
	}
	async _preloadTokenList(){
		if(this._tokenObj){
			return this._tokenObj;
		}
		try {
			const _tokenList = await getTokens(sdkStore.chain, false);
			if(_tokenList){
				this._tokenObj = {};
				for(let i = 0; i < _tokenList.length; i++){
					this._tokenObj[_tokenList[i].address] = _tokenList[i];
				}
			}
			return this._tokenObj;
		} catch (error) {
			return {};
		}
	}
	
	
	
	async _getRouteSvg(result){
		try {
			const protocol = await this._getProtocol();
			const tokenList = await this._preloadTokenList();
			const newSvg = await getRouteTrend(
				sdkStore.chain, 
				sdkStore.tokenInData.address.toLowerCase(), 
				sdkStore.tokenOutData.address.toLowerCase(),
				result,
				protocol,
				tokenList
			);
			const targetContainer = this.shadowRoot.querySelector('#route-trend-svg');
			if(targetContainer){
				targetContainer.innerHTML = newSvg;
			}
		} catch (error) {
			console.error('getRouteTrend:', error);
		}
	}
	
	
	
	_closeClick() {
		this.dispatchEvent(new CustomEvent('close'));
	}
	
	
	
	
	
	_selectedRoute(e){
		const luyouArr = [...sdkStore?.routes];
		for(let i = 0; i < luyouArr.length; i++){
			luyouArr[i].selected = false;
		}
		luyouArr[e.id].selected = true;
		sdkStore.setRoutes(luyouArr, false);
		window.swaptox.widget.$el.swap._setSelectedRoute(e);
	}
	_getAmountOut(out){
		if(!out) return '--';
		try {
			const toAmount = viemUtils.formatUnits(BigInt(out), sdkStore?.tokenOutData?.decimals);
			return `+${$app.formatBalance(toAmount)}`;
		} catch (e) {}
		return '--';
	}
	_getAmountMinOut(out){
		if(!out) return '--';
		
		const nativeToken = networkData?.[sdkStore?.chain]?.nativeToken?.native?.toLowerCase();
		const wrappedToken = networkData?.[sdkStore?.chain]?.nativeToken?.wrapped?.toLowerCase();
		const tokenIn = sdkStore?.tokenInData?.address?.toLowerCase();
		const tokenOut = sdkStore?.tokenOutData?.address?.toLowerCase();
		
		let minOut = out;
		if(tokenIn===nativeToken&&tokenOut===wrappedToken){
		}else if(tokenIn===wrappedToken&&tokenOut===nativeToken){
		}else{
			minOut = $app.computeAmountMinOut(out, BigInt(sdkStore?.slippag*100));
		}
		
		return this._getAmountOut(minOut);
	}
	_getGasFee(e){
		try {
			let gasusd = '$0';
			if(e){
				if(0.01>Number(e)){
					gasusd = '<$0.01';
				}else{
					gasusd = `$${$app.formatBalance(e)}`;
				}
			}
			return gasusd;
		} catch (e) {}
		return '$--';
	}
	
	
	
	
	
	
}

if (!customElements.get('stxapp-route-trend')) {
	customElements.define('stxapp-route-trend', StxappRouteTrend);
}





/* <div style="padding:18px;padding-bottom:14px;display:flex;justify-content:space-between;">
					<span class="best-route-text"
					>${this._isbestroute?$t['best-route']:$t['swap-route']}</span>
					<com-icon-close @change=${()=>{this.openRouteView = false;}} size="default"></com-icon-close>
				</div>
				<div class="stxapp-route-trend-bdoy">
					<!--<div 
						style="position:absolute;inset:0px;min-width:680px;min-height:350px;user-select:none;padding: 0px 20px;display:var(--stxui-icon-switch-token-open, flex);justify-content:center;align-items:center;" 
						id="route-trend-svg"
					></div>-->
					
					
					${this.poolLogos.length===0&&!this.toAmount?html`
						<div style="position: absolute;top: 0;left: 20px;right: 20px;bottom: 0;display: flex;flex-direction: column;align-items: center;justify-content: center;">
							<svg t="1791398691687" class="icon" viewBox="0 0 1254 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9301" width="60" height="60"><path d="M715.292563 180.704879h128.005968c15.053908 0 30.114638-12.550608 30.114638-30.121459 0-15.057319-12.550608-30.114638-30.114638-30.114637h-128.005968c-15.060729 0-30.114638 12.547197-30.114638 30.114637 0 17.574261 12.550608 30.121459 30.114638 30.121459zM1104.313659 0c-82.82378 0-150.586831 67.763051-150.586831 153.096953 0 82.82378 67.763051 153.100363 150.586831 153.100363s150.586831-67.763051 150.586831-153.100363C1254.9039 67.763051 1187.137439 0 1104.313659 0z m0 245.961219c-50.199021 0-92.864266-42.665246-92.864267-92.864266 0-50.19561 40.151714-92.864266 92.864267-92.864267 50.199021 0 92.864266 42.668656 92.864266 92.864267 0 50.199021-42.665246 92.864266-92.864266 92.864266z m-376.470488 240.944386h-188.231834c-7.530365 0-160.630728-22.594505-160.630728-163.140849 0-135.526102 140.549755-140.546345 155.610485-140.546345h47.682078c15.060729 0 27.604516-15.060729 27.604517-30.121458 0-15.057319-12.543787-27.607927-27.604517-30.118049h-47.682078c-72.790115 0-213.33646 42.672067-213.33646 200.785852 0 155.603664 138.039634 213.33646 213.33646 223.373535h188.228423c7.533775 0 160.634138 22.587684 160.634138 163.134029 0 135.532923-140.549755 140.549755-155.610484 140.549755H298.666951c-10.037076-75.296826-72.783294-130.512679-148.08012-130.512679C67.766461 720.312806 0 788.075857 0 873.409759c0 82.82378 67.766461 150.586831 150.586831 150.586831 70.276583 0 130.512679-50.199021 145.569998-115.451951h431.686342c75.296826 0 213.33646-42.665246 213.336459-200.785851-0.00341-155.600253-138.039634-213.322818-213.336459-220.853183zM150.586831 966.274025c-50.19561 0-92.864266-42.665246-92.864266-92.864266 0-52.702321 42.668656-95.374388 92.864266-95.374388 50.199021 0 92.864266 42.672067 92.864266 92.867676-2.510122 52.705732-42.665246 95.370978-92.864266 95.370978z m0 0" p-id="9302" fill="#999999"></path></svg>
							<span class="no-get-route-text"
							>${$t['route-not-found']}</span>
						</div>
					`:html`
						<div
							style="min-width:680px;min-height:350px;user-select:none;padding: 0px 20px;display:var(--stxui-icon-switch-token-open, flex);justify-content:center;align-items:center;" 
							id="route-trend-svg"
						></div>
					`}
					
					<div class="route-trend-modal-load"></div>
					
				</div>
				<div style="height:20px;"></div> */


