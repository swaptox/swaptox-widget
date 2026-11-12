

import {LitElement, html, css} from 'lit';

import { $app } from '../../js_sdk/index.js';
import { sdkStore } from '../../data/store/store.js';
import { StoreMixin } from '../../data/store/state-mixin.js';
import { getProtocol } from '../../api/cloud/getProtocol.js';
import { buildPoolsLogo } from '../../js_sdk/js/buildPoolsLogo.js';
import { viemUtils } from '../../js_sdk/viem/utils.js';
import { networkData } from '../../data/network-data.js';
import { gasIcon } from '../../icon/flickr-ball-circle-round';

import '../../com/stx-token-logo.js';
import '../../com/stx-best-route/com/com-dapp-route.js';
import './com/stxcom-home-showcase.js';
import './com/stxcom-home-tokens-bg.js';

export class SwaptoxRoutesChoose extends StoreMixin(LitElement) {
	static properties = {
		/* loading: {
			type: Boolean,
			reflect: true
		}, */
	};
	constructor() {
		super();
		//this.loading = false;
		//协议列表
		setTimeout(()=>{
			this._getProtocol();
			const intervalID = setInterval(()=>{
				if(this._protocol&&this._protocol.obj){
					clearInterval(intervalID);
				}else{
					this._getProtocol();
				}
			}, 1200);
		}, 1100);
	}
	
	
	
	
	async _getProtocol(){
		if(!this._protocol||!this._protocol.obj){
			this._protocol = await getProtocol();
		}
	}
	
	firstUpdated() {
		sdkStore.setRoutes(undefined, false);
		sdkStore.setErrRoute(undefined, false);
	}
	
	
	


	static styles = css`
		:host {
			display: block;position: relative;
		}
		.font-family {
			user-select: none;
			font-family: var(--stxui-font-family);
		}
		
		
		.gonggongcss-ss{
			border-radius: var(--stxui-swap-card-border-radius, 18px);
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
		
		.swaptox-routes-choose {
			position: relative;
			padding: 10px 0px 15px;padding-bottom: 7px;
		}
		.swaptox-routes-header {
			position: relative;
			z-index: 20;
			display: flex;
			justify-content: space-between;
			margin-bottom: 10px;
		}
		.routes-choose-title {
			font-size: 17px;
			color: var(--stxui-theme-font-color, #111);
			line-height: 32px;
			user-select: none;
			font-family: var(--stxui-font-family);
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

		
		.xiao-anniaos{
			height: 24px;
			line-height: 24px;
			border-radius: 100px;
			-webkit-user-select: none;
			user-select: none;
			white-space: nowrap;
			padding: 0px 12px;
			font-size: 14px;
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
		
		.dubu-ximxi{
			display: flex;flex-direction: row;column-gap: 15px;justify-content: space-between;align-items: center;
			padding-left: 15px;padding-right: 15px;
			padding-bottom: 15px;
		}
		
		
		
		
		
		
		.null-not-item-body{
			position: relative;
			border: 1px solid var(--stxui-theme-border-color, #eee);
			border-radius: 18px;
			background-color: var(
				--stxui-theme-content-background-color,
				#fbfbfb
			);
			height:343px;
		}
		.not-data-or-err{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		.no-get-route-text{
			user-select:none;
			font-family: var(--stxui-font-family);
			font-size: 14px;
			color: #999;
		}
		.get-route-zhuti{
			user-select:none;
			font-family: var(--stxui-font-family);
			font-size: 17px;
			color: var(--stxui-theme-font-color, #111);
		}
		
		
		.xuanfu-nav-dibu{
			display: none;
			position: sticky;
			    z-index: 21;
			    bottom: 0;
			background: var(--stxui-theme-background-color, #fff);
			padding: 15px;
		}
		
		
		
		@media (max-width: 980px) {
			.null-not-item-body{
				height:180px;
			}
		}
		
		.swaptox-full{}
		@media (max-width: 520px) {
			.dubu-ximxi{
				display: none;
				align-items: stretch;
				flex-direction: column;
				row-gap: 10px;
			}
			.gonggongcss-ss{
				border-radius: 0px;
			}
			.xuanfu-nav-dibu{
				display: block;
			}
			.swaptox-full{
				border-radius: 0px;
				border-right-width:0px;
				border-left-width:0px;
				border-top-width:0px;
				/*width: 100%;
				min-width: 100%;*/
			}
		}
		
		
		
		
		
		
		.output-text-load-skeleton-item{
			display: var(--stxui-icon-switch-token-load, none);
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
		
		
		
		.output-text-load-skeleton{
			display: var(--stxui-icon-switch-token-load, none);
			position: absolute;
			z-index: 5;
			top: 0; right: 0; bottom: 0; left: 0;
		}
		.output-text-load-skeleton::after {
			position: absolute;
			z-index: 10;
			top: 0; right: 0; bottom: 0; left: 0;
			background-image: var(--stxui-skeleton-background-body-load);
			border: 1px solid var(--stxui-theme-border-color, #eee);
			background-size: 500% 500%;
			animation: skeleton 1.8s ease infinite;
			content: '';
			border-radius: 100px;
		}
		.output-text-load-skeleton-sj{
			display: var(--stxui-icon-switch-token-load, none);
			position: absolute;
			z-index: 5;
			top: 0; right: 0; bottom: 0; left: 0;
		}
		.output-text-load-skeleton-sj::after {
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
		@keyframes skeleton {
			0% {
				background-position: 100% 50%;
			}
			100% {
				background-position: 0 50%;
			}
		}
		
		
		
	`;
	
	
	
	

	render() {
		const $t = sdkStore.$t;
		
		const symbol = sdkStore?.tokenOutData?.symbol;
		const logourl = sdkStore?.tokenOutData?.logourl;
		const routes = sdkStore?.routes;
		const errRoute = sdkStore?.errRoute;
		
		if(!routes){
			return html`
				<div class="swaptox-routes-choose gonggongcss-ss ${sdkStore.smallScreenCardFull?'swaptox-full':''}" style="overflow-x: clip;padding-left: 15px;padding-right: 15px;${this.styles}">
					<div class="swaptox-routes-header" style="">
						<span class="routes-choose-title" style="font-size:17px;">${$t['route']}</span>
					</div>
					<div style="position: relative;">
						<div style="opacity:var(--stxui-icon-arrow-loading-hide, 1);height:343px;" class="null-not-item-body not-data-or-err">
						
							<div style="height:250px;"></div>
							<div class="get-route-zhuti">${$t['get-better-swap-output']}</div>
							<div style="height:5px;"></div>
							<div class="no-get-route-text">${$t['find-better-routes-get-more-tokens']}</div>
							
						</div>
						
						
						<div style="opacity:var(--stxui-icon-arrow-loading-hide, 1);position:absolute;inset:0px;z-index:1;top:20px;">
							<stxcom-home-showcase
							.protocol=${this._protocol&&this._protocol.arr?this._protocol.arr:[]} 
							.theme="${sdkStore?.theme==='dark'?'dark':''}"></stxcom-home-showcase>
						</div>
						
						
						<div class="output-text-load-skeleton-item"></div>
					</div>
					<div style="height:15px;"></div>
				</div>
				
				<div style="opacity:var(--stxui-icon-arrow-loading-hide, 1);position:absolute;inset:0px;z-index:2;top:45px;pointer-events:none;">
					<stxcom-home-tokens-bg .theme="${sdkStore?.theme==='dark'?'dark':''}"></stxcom-home-tokens-bg>
				</div>
				
				
			`;
		}
		
		
		
		
		
		
		if(routes&&routes.length===0){
			return html`
				<div class="swaptox-routes-choose gonggongcss-ss ${sdkStore.smallScreenCardFull?'swaptox-full':''}" style="padding-left: 15px;padding-right: 15px;${this.styles}">
					<div class="swaptox-routes-header">
						<span class="routes-choose-title" style="font-size:17px;">${$t['route']}</span>
					</div>
					<div style="position: relative;">
						<div style="opacity:var(--stxui-icon-arrow-loading-hide, 1);" class="null-not-item-body not-data-or-err">
						
							${errRoute&&errRoute?.code==='NO_ROUTE'?html`
								<svg t="1792610134355" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4663" width="60" height="60"><path d="M747.008 579.925333l169.258667-169.301333c73.045333-73.045333 62.208-199.808-20.906667-282.88-83.029333-83.072-209.792-93.909333-282.88-20.864l-169.258667 169.301333c-15.573333 15.573333-13.866667 42.538667 3.84 60.202667 17.664 17.664 44.629333 19.370667 60.16 3.84l169.344-169.301333c40.490667-40.533333 113.066667-36.096 162.432 13.226666 49.322667 49.322667 53.76 121.984 13.226667 162.474667l-169.258667 169.258667c-15.573333 15.573333-13.866667 42.538667 3.84 60.245333 17.621333 17.664 44.586667 19.370667 60.16 3.797333z m1.877333-305.664a42.666667 42.666667 0 0 1 0 60.373334l-90.496 90.453333a42.666667 42.666667 0 0 1-60.373333-60.288l90.538667-90.538667a42.666667 42.666667 0 0 1 60.330666 0z m-324.181333 324.181334a42.666667 42.666667 0 0 1 0 60.373333l-90.538667 90.453333a42.666667 42.666667 0 0 1-60.330666-60.288l90.538666-90.538666a42.666667 42.666667 0 0 1 60.330667 0z m151.381333 89.173333c17.664 17.664 19.370667 44.629333 3.84 60.202667l-169.301333 169.301333c-73.088 73.045333-199.850667 62.165333-282.88-20.906667-83.072-83.029333-93.952-209.792-20.906667-282.88l169.301334-169.258666c15.573333-15.573333 42.538667-13.866667 60.245333 3.84 17.664 17.664 19.370667 44.629333 3.797333 60.16l-169.301333 169.301333c-40.490667 40.533333-36.053333 113.152 13.226667 162.474667 49.365333 49.322667 121.984 53.76 162.474666 13.226666l169.301334-169.301333c15.573333-15.530667 42.538667-13.866667 60.202666 3.84zM156.074667 216.874667l60.330666-60.330667 650.666667 650.581333-60.373333 60.373334L156.074667 216.832z" p-id="4664" fill="#999999"></path></svg>
								<div style="height:10px;"></div>
								<div class="no-get-route-text">${$t['NO_ROUTE']}</div>
							`:html`
								<svg t="1753471998059" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3634" width="60" height="60"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#FFAA00" opacity=".1" p-id="3635"></path><path d="M512 512m-384 0a384 384 0 1 0 768 0 384 384 0 1 0-768 0Z" fill="#FFAA00" opacity=".2" p-id="3636"></path><path d="M512 512m-256 0a256 256 0 1 0 512 0 256 256 0 1 0-512 0Z" fill="#FFAA00" p-id="3637"></path><path d="M512 659.2c-19.2 0-38.4-19.2-38.4-38.4V512c0-19.2 19.2-38.4 38.4-38.4s38.4 19.2 38.4 38.4v115.2c0 19.2-19.2 32-38.4 32m0-224c-19.2 0-38.4-19.2-38.4-38.4s19.2-38.4 38.4-38.4 38.4 19.2 38.4 38.4c0 25.6-19.2 38.4-38.4 38.4" fill="#FFFFFF" p-id="3638"></path></svg>
								<div style="height:10px;"></div>
								<div class="no-get-route-text">${errRoute&&errRoute?.code&&$t[errRoute.code]?$t[errRoute.code]:errRoute?.message}</div>
								<div style="padding-top: 15px;min-width: 100px;">
									<stxapp-button styles="height:34px;"
										type="warn" 
										size="center"
										@_click=${()=>{window.swaptox.widget.$el.swap._postRoutes()}}
									>${$t['retry']}</stxapp-button>
								</div>
							`}
						
						</div>
						<div class="output-text-load-skeleton-item"></div>
					</div>
					<div style="height:15px;"></div>
				</div>
			`;
		}
		
		
		
		
		
		
		
		
		
		
		
		
		
		return html`
			<div class="swaptox-routes-choose gonggongcss-ss ${sdkStore.smallScreenCardFull?'swaptox-full':''}" style="${this.styles}">
				
				<div class="swaptox-routes-header" style="padding-left: 15px;padding-right: 15px;">
					<span class="routes-choose-title" style="font-size:17px;">${$t['route']}</span>
				</div>
				
				
				<div style="display: flex;flex-direction: column;row-gap: 15px;padding-left: 15px;padding-right: 15px;">
					
					${routes.map(
						(item) => html`
						<div style="position:relative;height:84px;flex:1;">
						
							<div @click=${()=>{this._selectedRoute(item)}} 
							style="padding: 12px 15px;padding-top: 15px;padding-bottom: 10px;opacity:var(--stxui-icon-arrow-loading-hide, 1);"
							class="routes-choose-bg-border ${item.selected?'selected-route':''}">
								
								
								<div style="flex:1;">
									<div style="display: flex;flex-direction: row;align-items: center;column-gap:6px;">
										<stx-token-logo
											size="24px"
											.symbol="${symbol}" 
											.logo="${logourl}"
										></stx-token-logo>
										<span class="routes-choose-title" style="line-height:20px;"
										>${this._getAmountOut(item.amountOut)} ${symbol}</span>
									</div>
									
									<div style="height:2px;"></div>
									<div style="display: flex;flex-direction: row;align-items: center;column-gap:6px;">
										<span class="routes-choose-title" style="color:#999;font-size:14px;">${$t['route']}</span>
										<div style="display: inline-block;">
											<com-dapp-route
												?onlyLodo=${true}
												.logos=${this._buildPoolsLogo(item.result)}
											></com-dapp-route>
										</div>
									</div>
									
								</div>
								
								
								<div style="display: flex;align-items: flex-end;flex-direction: column;row-gap:6px;">
									
									<div style="display: flex;flex-direction: row;align-items: center;column-gap:4px;">
										<span class="routes-choose-title" 
										style="font-size:15px;color:#999;line-height:24px;"
										>${this._getGasFee(item.gasFeeUsd)}</span>
										${gasIcon()}
									</div>
									<div style="height: 24px;display: flex;flex-direction: row;align-items: center;column-gap:6px;">
										
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
			
				
				
				
				<div style="height:15px;"></div>
				<div class="dubu-ximxi">
					<div style="flex:1;position:relative;">
						<div class="routes-choose-title" style="opacity:var(--stxui-icon-arrow-loading-hide, 1);font-size:15px;line-height:22px;"
						>${$t['expected-output']}: 
							<span style="white-space:nowrap;color:var(--stxui-swaptox-routes-choose-minimum-received-text);">${this._getAmountOut(sdkStore?.selectedRoute?.amountOut)}</span>
							<span style="white-space:nowrap;color:#999;">${symbol}</span>
						</div>
						<div class="routes-choose-title" style="opacity:var(--stxui-icon-arrow-loading-hide, 1);font-size:15px;line-height:22px;"
						>${$t['minimum-received']}: 
							<span style="white-space:nowrap;color:var(--stxui-swaptox-routes-choose-minimum-received-text);">${this._getAmountMinOut(sdkStore?.selectedRoute?.amountOut)}</span>
							<span style="white-space:nowrap;color:#999;">${symbol}</span>
						</div>
						
						<div class="output-text-load-skeleton" style="bottom:-1px;top:-1px;"></div>
						
					</div>
					<div style="flex: 1;">
						<swaptox-swap-button></swaptox-swap-button>
					</div>
					
				</div>
					
			</div>
			
			
			
			
			
			
			
			<div class="xuanfu-nav-dibu gonggongcss-ss">
				<div style="position:relative;">
					<div class="routes-choose-title" style="opacity:var(--stxui-icon-arrow-loading-hide, 1);font-size:15px;line-height:22px;"
					>${$t['expected-output']}: 
						<span style="white-space:nowrap;color:var(--stxui-swaptox-routes-choose-minimum-received-text);">${this._getAmountOut(sdkStore?.selectedRoute?.amountOut)}</span>
						<span style="white-space:nowrap;color:#999;">${symbol}</span>
					</div>
					<div class="routes-choose-title" style="opacity:var(--stxui-icon-arrow-loading-hide, 1);font-size:15px;line-height:22px;"
					>${$t['minimum-received']}: 
						<span style="white-space:nowrap;color:var(--stxui-swaptox-routes-choose-minimum-received-text);">${this._getAmountMinOut(sdkStore?.selectedRoute?.amountOut)}</span>
						<span style="white-space:nowrap;color:#999;">${symbol}</span>
					</div>
					
					<div class="output-text-load-skeleton-sj" style="bottom:-1px;top:-1px;"></div>
				</div>
				<div style="padding-top: 10px;">
					<swaptox-swap-button></swaptox-swap-button>
				</div>
			</div>
			
			
			
			
			
		`;
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
	_buildPoolsLogo(result){
		try {
			return buildPoolsLogo(result, this._protocol);
		} catch (e) {}
		return [];
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
	
	
	_selectedRoute(e){
		const luyouArr = [...sdkStore?.routes];
		for(let i = 0; i < luyouArr.length; i++){
			luyouArr[i].selected = false;
		}
		luyouArr[e.id].selected = true;
		sdkStore.setRoutes(luyouArr, false);
		window.swaptox.widget.$el.swap._setSelectedRoute(e);
	}
	
	
}

if (!customElements.get('swaptox-routes-choose')) {
	customElements.define('swaptox-routes-choose', SwaptoxRoutesChoose);
}