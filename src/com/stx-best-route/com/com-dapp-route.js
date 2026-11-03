import {
	LitElement,
	html,
	css
} from 'lit';

import './com-dapp-mini-logo.js';

export class ComDappRoute extends LitElement {
	static get properties() {
		return {
			logos: {
				type: Array
			},
			bestroutetext: {
				type: String
			},
			onlyLodo: {
				type: Boolean
			},
		};
	}
	
	constructor() {
		super();
		this.logos = [];
		this.bestroutetext = '';
		this.onlyLodo = false;
	}
	
	
	static styles = css`
		:host {
			display: block;
			position: relative;
			z-index: 1;
		}
		
		.best-route-text{
			position: relative;
			z-index: 1;
			font-size: 14px;
			user-select: none;
			font-family: var(--stxui-font-family);
			color: var(--stxui-dark-theme-subcolor, #999);
			white-space:nowrap;
			line-height: 16px;
			height: 16px;
		}
		
		.content-flex-layout{
			display: flex;
			flex-direction: row;align-items: center;column-gap:8px;
		}
		
		.ly-dh{
			transition-timing-function: ease-in-out;
			transition-duration: 0.15s;
			transition-property: left, right, background-color;
		}
		
		.dapp-mini-logo{
			width: 18px;height: 18px;
			position: relative;
		}
		.logo1{z-index: 1;left: 0px;}
		.logo2{z-index: 2;left: -8px;}
		.logo3{z-index: 3;left: -16px;}
		.logo4{z-index: 4;left: -24px;}
		.logo5{z-index: 5;left: -32px;}
		.logo6{z-index: 6;left: -40px;}
		.logo7{z-index: 7;left: -48px;}
		.logo8{z-index: 8;left: -56px;}
		.logo9{z-index: 9;left: -64px;}
		.logo10{z-index: 10;left: -72px;}
		.logoid{position: relative;}
		

		
		.text-syuanshu{
			position: absolute;
			z-index: 1;
			left: 24px;
			top: 1px;
		}
		
		
		.com-dapp-route{
			height: 30px;
			padding-left: 9px;
			position: relative;
		}
		
		.jiazai-bg{
			position: absolute;
			top: 0px;
			left: 0px;
			right: 0px;
			bottom: 0px;
			background-color: rgba(149, 157, 165, 0);
			border-radius: 10px;
			border: 1px solid rgba(0, 0, 0, 0);
		}
		.bg1{right: 0px;}
		.bg2{right: 8px;}
		.bg3{right: 16px;}
		.bg4{right: 24px;}
		.bg5{right: 32px;}
		.bg6{right: 40px;}
		.bg7{right: 48px;}
		.bg8{right: 56px;}
		.bg9{right: 64px;}
		.bg10{right: 72px;}
		.bgid{
			display: var(--stxui-route-is-loading);
		}
		
		
		
		.com-dapp-route:hover > .content-flex-layout > .logoid{
			left: 0px;
		}		
		.com-dapp-route:hover > .bgid{
			right: 0px;
			background-color: #fff;
			border: 1px solid #eee;
		}
		
		
		.jiazai-body{
			display: var(--stxui-route-is-loading);
			position: absolute;
			top: 1px;
			left: 0px;
			right: -8px;
			bottom: 1px;
			z-index: 15;
			/*background-color: var(--stxui-skeleton-background-color, #f1f1f1);*/
			border-radius: 10px;
			overflow: hidden;
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
  `;

	render() {
		
		const textRoute = this.bestroutetext;//最佳路由文字
		const imgArr = [];
		for(let i = 0; i < this.logos.length; i++){
			if(i<10){
				imgArr.push({
					index: i+1,
					url: this.logos[i]
				});
			}else{
				break;
			}
		}
		
		return html`
			<div class="content-flex-layout com-dapp-route" style="${this.onlyLodo?'padding-left:0px;':''}">
				
				${0===imgArr.length?html`
					<span class="best-route-text">${textRoute}</span>
				`:html`
					<div class="ly-dh jiazai-bg bg${imgArr.length} bgid"></div>
				`}
				
				<div class="content-flex-layout" style="column-gap:2px;display: var(--stxui-icon-switch-token-open);">
				
					${imgArr.map(obj => html`
						<div class="ly-dh dapp-mini-logo logo${obj.index} logoid">
							<com-dapp-mini-logo
								url="${obj.url}"
							></com-dapp-mini-logo>
							
							${obj.index===imgArr.length&&!this.onlyLodo?html`
								<span class="best-route-text text-syuanshu">${textRoute}</span>
							`:``}
							
						</div>
					`)}
					
					${imgArr.length>0&&!this.onlyLodo?html`
						<span class="best-route-text"
						style="padding-right:12px;pointer-events: none;opacity: 0;transform:scale(0);"
						>${textRoute}</span>
					`:``}
					
				</div>
				<div style="display:var(--stxui-icon-switch-token-load);width:100px;"></div>
				
				
				<div class="jiazai-body skeleton-css"></div>
				
				
			</div>
		`;
	}
	
	
}


if (!customElements.get('com-dapp-route')) {
	customElements.define('com-dapp-route', ComDappRoute);
}

