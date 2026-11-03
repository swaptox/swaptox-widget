


import {LitElement, html, css} from 'lit';
import '../../../com/stx-token-logo.js';


export class StxcomTokenCard extends LitElement {
	static properties = {
		subtitle: {
			type: String
		},
		value: {
			type: String
		},
		usdprice: {
			type: String
		},
		symbol: {
			type: String
		},
		logourl: {
			type: String
		},
	};
	constructor() {
		super();
		this.subtitle = '';
		this.value = '';
		this.usdprice = '';
		this.symbol = '';
		this.logourl = '';
	}


	static styles = css`
		:host {
			display: block;
		}
		
		.app-confirm-card-body{
			box-shadow: 0 0 0 1px var(--stxui-card-confirm-card-body-border);
			border-radius: 18px;
			padding: 10px 15px;
			background-color: var(--stxui-card-confirm-card-body-background-color);
		}
		
		.confirm-card-flex-space-between{
			display: flex;flex-direction: row;align-items: center;justify-content: space-between;
		}
		.font-family{
			user-select: none;
			font-family: var(--stxui-font-family);
		}
		.token-c-logo-name{
			display: flex;
			flex-direction: row;
			align-items: center;
			column-gap: 8px;
		}
		.token-c-name-text{
			font-size: 18px;
			line-height: 22px;
			color: var(--stxui-theme-font-color, #111);
			white-space:nowrap;
		}
		.token-c-amount-text{
			flex: 1;
			font-size: 20px;
			line-height: 22px;
			height: 22px;
			text-align: right;
			color: var(--stxui-theme-font-color, #111);
			overflow: hidden;
			text-overflow: ellipsis !important;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1 !important;
		}
		@media (max-width: 450px) {
			.token-c-amount-text {
				font-size: 18px;
			}
		}
		@media (max-width: 400px) {
			.token-c-amount-text {
				font-size: 16px;
			}
		}
		@media (max-width: 350px) {
			.token-c-amount-text {
				font-size: 14px;
			}
		}
		
		
		
		
		
		.card-left-zuo-text{
			white-space:nowrap;
			font-size: 13px;
			color: var(--stxui-confirm-swap-card-left-zuo-textcolor);
		}
	`;
	

	render() {
		return html`
			<div class="app-confirm-card-body">
				
				<div class="confirm-card-flex-space-between">
					<div class="font-family card-left-zuo-text">${this.subtitle}</div>
					<div class="font-family card-left-zuo-text">${this.usdprice}</div>
				</div>
				
				<div class="confirm-card-flex-space-between" style="padding-top:7px;column-gap:30px;">
					<div class="token-c-logo-name">
						<stx-token-logo
							size="22px"
							.symbol="${this.symbol}" 
							.logo="${this.logourl}"
						></stx-token-logo>
						<span class="font-family token-c-name-text">${this.symbol}</span>
					</div>
					<span class="font-family token-c-amount-text">${this.value}</span>
				</div>
				
			</div>
		`;
	}
	
	
}

if (!customElements.get('stxcom-token-card')) {
	customElements.define('stxcom-token-card', StxcomTokenCard);
}


