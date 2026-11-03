


import {LitElement, html, css} from 'lit';
import '../../../com/stx-token-logo.js';
import { sdkStore } from '../../../data/store/store.js';
import { StoreMixin } from '../../../data/store/state-mixin.js';

export class StxcomSwapDetailsTokenCard extends StoreMixin(LitElement) {
	static properties = {
		cardtype: {
			type: String
		},
		amount: {
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
		
		chainLogo: {
			type: String
		},
	};
	constructor() {
		super();
		this.cardtype = 'sent';
		this.amount = '';
		this.usdprice = '';
		this.symbol = '';
		this.logourl = '';
		
		this.chainLogo = '';
	}


	static styles = css`
		:host {
			display: block;
		}
		
		.stxcom-swap-details-token-card{
			box-shadow: 0 0 0 1px var(--stxui-card-confirm-card-body-border);
			border-radius: 18px;
			padding: 12px 15px;
			background-color: var(--stxui-card-confirm-card-body-background-color);
			display: flex;flex-direction: row;align-items: center;justify-content: space-between;
		}
		
		
		.font-family{
			user-select: none;
			font-family: var(--stxui-font-family);
		}
		
		
		
		.card-received-sent-text{
			white-space:nowrap;
			font-size: 15px;
			color: var(--stxui-confirm-swap-card-left-zuo-textcolor);
		}
		
		
		
		.com-icon-jiantou-body{
			width: 32px;
			height: 32px;
			min-width: 32px;
			border-radius: 100px;
			display: flex;align-items: center;justify-content: center;
		}
		.token-chain-logo {
			position: absolute;
			top: 16px;
			left: 16px;
			z-index: 1;
			width: 12px;
			height: 12px;
		}
		.token-amount {
			display: block;
			width: 100%;
			min-width: 0;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		
			font-size: 16px;
			line-height: 18px;
			color: var(--stxui-theme-font-color, #111);
		}
		.token-name {
			font-size: 16px;
			color: var(--stxui-theme-font-color, #111);
		}
		
		
		
		.token-usd {
			display: block;
			width: 100%;
			min-width: 0;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		
			font-size: 14px;
			line-height: 16px;
			color: #999;
		}
		
		
		@media (max-width: 450px) {
			.token-amount {
				font-size: 15px;
			}
			.token-name {
				font-size: 15px;
			}
			.token-usd{
				font-size: 13px;
			}
		}
		@media (max-width: 400px) {
			.token-amount {
				font-size: 14px;
			}
			.token-name {
				font-size: 14px;
			}
			.token-usd{
				font-size: 12px;
			}
		}

		
		
	`;
	

	render() {
		const $t = sdkStore.$t;
		return html`
			<div class="stxcom-swap-details-token-card">
				
				
				
				
				
				
				${this.cardtype==='sent'?html`
					<div style="display: flex;flex-direction: row;align-items: center;column-gap: 6px;">
						<div class="com-icon-jiantou-body" style="background-color: var(--stxui-details-sent-icon-background, #ffdddd);">
							<svg t="1792177591634" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6831" width="16" height="16"><path d="M877.248 402.75199999l-320-320c-24.992051-24.992051-65.504051-24.992051-90.496 0l-320 320c-24.992051 24.992051-24.992051 65.504051 0 90.496 24.992051 24.992051 65.504051 24.992051 90.496 0l210.75199999-210.75199999 1e-8 613.504c0 35.36005101 28.640051 64 64 64 35.36005101 0 64-28.640051 64-64l1e-8-613.504 210.75199999 210.75199999c12.512051 12.48 28.864 18.752 45.248 18.75200001s32.768-6.240051 45.248-18.75200001c24.992051-24.992051 24.992051-65.504051 0-90.496z" p-id="6832" fill="#fe4129" data-spm-anchor-id="a313x.manage_type_myprojects.0.i1.266c3a81vw6nPL" class="selected"></path></svg>
						</div>
						<div class="font-family card-received-sent-text">${$t['sent']}</div>
					</div>
				`:html`
					<div style="display: flex;flex-direction: row;align-items: center;column-gap: 6px;">
						<div class="com-icon-jiantou-body" style="background-color: var(--stxui-details-received-icon-background, #e5ffdd);">
							<svg t="1792182918642" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7405" width="16" height="16"><path d="M146.752 621.24800001l320 320c24.992051 24.992051 65.504051 24.992051 90.496 0l320-320c24.992051-24.992051 24.992051-65.504051 0-90.496-24.992051-24.992051-65.504051-24.992051-90.496 0l-210.75199999 210.75199999-1e-8-613.504c0-35.36005101-28.640051-64-64-64-35.36005101 0-64 28.640051-64 64l-1e-8 613.504-210.75199999-210.75199999c-12.512051-12.48-28.864-18.752-45.248-18.75200001s-32.768 6.240051-45.248 18.75200001c-24.992051 24.992051-24.992051 65.504051 0 90.496z" p-id="7406" fill="#40b66b"></path></svg>
						</div>
						<div class="font-family card-received-sent-text">${$t['received']}</div>
					</div>
				`}
				
				
				
				
				
				<div style="display: flex;flex-direction: row;align-items: center;column-gap: 6px;">
					
					
					${this.amount&&this.amount.length>19?html`
						<div style="display: flex;flex-direction: column;">
							<div class="token-amount font-family">
								${this.amount}
							</div>
							<div style="display: flex;flex-direction: row;align-items: center;column-gap: 5px;">
								<div class="token-name font-family">
									${this.symbol}
								</div>
								<div class="token-usd font-family">
									${this.usdprice}
								</div>
							</div>
						</div>
					`:html`
						<div style="display: flex;flex-direction: column;">
							<div class="token-amount font-family">
								${this.amount} ${this.symbol}
							</div>
							<div class="token-usd font-family">
								${this.usdprice}
							</div>
						</div>
					`}
					
					
					
					
					
					
					
					
					<div style="width: 26px;height: 26px;position: relative;">
						<stx-token-logo
							size="26px"
							.symbol="${this.symbol}" 
							.logo="${this.logourl}"
						></stx-token-logo>
						<div class="token-chain-logo">
							<stx-token-logo
								size="12px"
								symbol=""
								.logo="${this.chainLogo}"
							></stx-token-logo>
						</div>
					</div>
				</div>
				
			</div>
		`;
	}
	
	
}

if (!customElements.get('stxcom-swap-details-token-card')) {
	customElements.define('stxcom-swap-details-token-card', StxcomSwapDetailsTokenCard);
}


