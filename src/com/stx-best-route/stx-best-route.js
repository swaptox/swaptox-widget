import {
	LitElement,
	html,
	css
} from 'lit';

import { buildPoolsLogo } from '../../js_sdk/js/buildPoolsLogo.js';
import { getProtocol } from '../../api/cloud/getProtocol.js';

import { sdkStore } from '../../data/store/store.js';
import { StoreMixin } from '../../data/store/state-mixin.js';

import '../../icon/com-icon-to.js';
import './com/com-dapp-route.js';
//import './route/stx-route-view.js';
//import '../../components/stxapp-route-trend/stxapp-route-trend-modal';


export class StxBestRoute extends StoreMixin(LitElement) {
	static get properties() {
		return {
			openRouteView: {
				type: Boolean
			},
			swapfee: {
				type: Number
			},
		};
	}
	
	constructor() {
		super();
		this.openRouteView = false;
		this.swapfee = 0;
		//协议列表
		const intervalID = setInterval(()=>{
			if(this._protocol&&this._protocol.obj){
				clearInterval(intervalID);
			}else{
				this._getProtocol();
			}
		}, 1500);
	}
	
	async _getProtocol(){
		if(!this._protocol||!this._protocol.obj){
			this._protocol = await getProtocol();
		}
	}
	
	static styles = css`
		:host {
			display: block;
			height: 39px;
		}
		.stx-best-route{
			position: relative;
			background-color: var(--stxui-theme-content-background-color, #fbfbfb);
			padding: 0px 6px;
			border-radius: 15px;
			height: 39px;
			display: flex;flex-direction: row;align-items: center;justify-content: space-between;
			cursor: pointer;
			border: 1px solid var(--stxui-theme-border-color, #eee);
			
			transition: 
			    border 0.2s ease-in-out,
			    box-shadow 0.2s ease-in-out;
		}
		.stx-best-route:hover {
			border: 1px solid var(--stxui-theme-focus-color, #02b6a680);
			box-shadow: 0 0 0 2px var(--stxui-theme-focus-color, #02b6a680);
		}
		.route-selected{
			border: 1px solid var(--stxui-theme-focus-color, #02b6a680);
			box-shadow: 0 0 0 2px var(--stxui-theme-focus-color, #02b6a680);
		}
		
		
		.best-route-text{
			font-size: 14px;
			user-select: none;
			font-family: var(--stxui-font-family);
			color: var(--stxui-theme-font-subcolor, #999);
			white-space:nowrap;
			line-height: 16px;
			height: 16px;
		}

		.content-flex-layout{
			display: flex;flex-direction: row;align-items: center;column-gap:8px;
		}
		
		.fee-body{
			position: absolute;
			top: 0px;
			right: 6px;
			bottom: 0px;
		}
		
		
		.jiazai-body1{
			position: absolute;
			top: 0px;
			left: 0px;
			right: 0px;
			bottom: 0px;
			z-index: 1;
			border-radius: 10px;
			overflow: hidden;
			display: var(--stxui-route-is-loading);
		}
		.skeleton-css{}
		.skeleton-css::after {
			position: absolute;
			top: 0; right: 0; bottom: 0; left: 0;
			background-image: var(--stxui-skeleton-background-load);
			background-size: 500% 500%;
			animation: skeleton 1.8s ease infinite;
			content: '';
		}
		@keyframes skeleton {
			0% {
				background-position: 100% 50%;
			}
			100% {
				background-position: 0 50%;
			}
		}
		
		.theme-color{
			color: var(--stxui-theme-font-color, #111);
		}
		.theme-free{
			color: var(--stxui-theme-color, #02b6a6);
		}
		.theme-subtitle{
			color: var(--stxui-theme-font-subcolor, #999);
		}
  `;

	render() {
		const $t = sdkStore.$t;
		const selectedRoute = sdkStore.selectedRoute;
		
		//渲染币对小logo
		try {
			const xieyiLogo = buildPoolsLogo(selectedRoute&&selectedRoute.result?selectedRoute.result:undefined, this._protocol);
			this.poolLogos = xieyiLogo;
		} catch (error) {
			this.poolLogos = [];
		}
		
		
		const Free = $t['free'];
		const Fee = $t['fee'];
		let feeTips = Free;
		let themeCss = 'theme-free';
		if(this.swapfee>0){
			feeTips = Fee;
			themeCss = 'theme-color';
		}
		
		if(this.poolLogos.length===0){
			feeTips = Fee;
			themeCss = 'theme-subtitle';
		}
		
		/* <!--<stxapp-route-trend-modal @mask=${()=>{this.openRouteView = false;}} ?open=${this.openRouteView}>
				
				11222
			</stxapp-route-trend-modal>
		--> */
		
		
		return html`
		
		
			
		
		
			<div @click="${this._onOpenBestRoute}" class="stx-best-route ${this.openRouteView?'route-selected':''}">
				
				
				<com-dapp-route style="position: relative;z-index: 2;"
					.logos="${this.poolLogos}"
					.bestroutetext="${selectedRoute&&selectedRoute?.bestRoute?$t['best-route']:$t['swap-route']}"
				></com-dapp-route>
				
				
				<div class="fee-body content-flex-layout">
					<div class="content-flex-layout" style="padding-right: 9px;height: 28px;position: relative;padding-left: 9px;">
						<span class="best-route-text ${themeCss}" 
						>${feeTips}</span>
						<com-icon-to size="12px" direction="${this.openRouteView?'top':'bottom'}"></com-icon-to>
						<span class="best-route-text ${themeCss}" 
						>${this.swapfee}%</span>
						
						<div class="jiazai-body1 skeleton-css"></div>
						
					</div>
				</div>
				
				
			</div>
		`;
	}
	
	
	_onOpenBestRoute(){
		//this.openRouteView = true;
		this.dispatchEvent(new CustomEvent('change'));
	}
	
	
}


if (!customElements.get('stx-best-route')) {
	customElements.define('stx-best-route', StxBestRoute);
}


