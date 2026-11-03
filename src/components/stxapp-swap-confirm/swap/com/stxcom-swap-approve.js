


import {
	LitElement,
	html,
	css
} from 'lit';

import { $app } from '../../../../js_sdk/index.js';
import { sdkStore } from '../../../../data/store/store.js';
import { StoreMixin } from '../../../../data/store/state-mixin.js';
import '../../../../components/stxapp-button/stxapp-button.js';
import '../../../../icon/com-icon-close.js';

export class StxappSwapApprove extends StoreMixin(LitElement) {
	static properties = {
		symbol: {
			type: String,
		},
		amountIn: {
			type: String,
		},
		isPermit: {
			type: Boolean,
		},
	};
	constructor() {
		super();
		this.symbol = '';
		this.amountIn = '';
		this.isPermit = false;
	}


	static styles = css`
		:host {
			display: block;
		}
		.font-family{
			user-select: none;
			font-family: var(--stxui-font-family);
		}
		.stxcom-swap-approve{
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			z-index: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			background-color: var(--stxui-modal-background-color, #fff);
			border-radius: 20px;
		}
		.app-confirm-card-body12{
			box-shadow: 0 0 0 1px var(--stxui-card-confirm-card-body-border);
			border-radius: 18px;
			padding: 10px 15px;
			background-color: var(--stxui-card-confirm-card-body-background-color);
		}
		.pprove-amount-title{
			font-size: 16px;
			color: var(--stxui-theme-font-color);
		}
		.pprove-amount-futitle{
			font-size: 13px;
			color: #999;
		}
		.tips-top11-level{
			display: flex;
			flex-direction: row;
			align-items: center;
			border-radius: 12px;
			padding: 2px 8px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 7px;
		}
		.approve-swap-title{
			box-sizing: border-box;
			font-size: 18px;
			color: var(--stxui-theme-font-color, #111);
			line-height: 28px;
		}
	`;
	

	render() {
		const $t = sdkStore.$t;
		const amount = $app.formatBalance(this.amountIn);
		return html`
			<div class="stxcom-swap-approve" style="position:absolute;">
				
				
				<div style="position: absolute;top: 20px;left: 20px;z-index: 1;">
					<div class="font-family approve-swap-title">${$t['pending-approve']}</div>
				</div>
				<div style="position: absolute;top: 20px;right: 20px;z-index: 2;">
					<com-icon-close @change=${this._closeClick} size="default"></com-icon-close>
				</div>
				
				
				
				<div style="padding: 35px 20px 0px 20px;">
					<div class="app-confirm-card-body12">
						<div class="font-family pprove-amount-title"
						>${$t['approve-amount']}: ${amount} ${this.symbol}</div>
						
						<div style="height:4px;"></div>
						<div class="font-family pprove-amount-futitle">${$t['approve-swap-amount']}</div>
						
						<div style="height:10px;"></div>
						
						
						
						${!this.isPermit?html`
							<stxapp-button
								type="primary" 
								@_click=${()=>{this._onApproval('')}}
							>${$t['one-time-approval']}</stxapp-button>
						`:html`
							<div style="display: flex;flex-direction: row;align-items: center;column-gap: 15px;">
								<div style="flex: 1;">
									<stxapp-button styles="height:40px;"
										type="primary" 
										size="center"
										@_click=${()=>{this._onApproval('')}}
									>${$t['one-time-approval']}</stxapp-button>
								</div>
								<div style="flex: 1;position: relative;">
									<stxapp-button styles="height:40px;background-color:#0078c8;"
										type="primary" 
										size="center"
										@_click=${()=>{this._onPermit('')}}
									>${$t['one-time-permit']}</stxapp-button>
									
									<div style="position: absolute;z-index: 1;top: -10px;right: 0;">
										<div class="tips-top11-level" style="background-color: #94ff0b;">
											<span class="font-family" style="font-size:11px;color:#00799a;"
											>${$t['gasless']}</span>
										</div>
									</div>
									
								</div>
							</div>
						`}
						
						
					</div>
					
					<div style="height:20px;"></div>
					
					
					<div class="app-confirm-card-body12">
						
						<div style="display: flex;flex-direction: row;align-items: center;column-gap: 5px;">
							<div class="font-family pprove-amount-title"
							>${$t['approve-amount']}: "${$t['unlimited']}" ${this.symbol}</div>
							
							<div class="tips-top11-level" style="background-color: var(--stxui-tips-top-level-text-bg);">
								<span class="font-family" style="font-size:11px;color:var(--stxui-tips-top-level-text-max);"
								>${$t['recommend']}</span>
							</div>
						</div>	
						
						<div style="height:4px;"></div>
						<div class="font-family pprove-amount-futitle"
						>${$app.replaceTemplate($t['need-approve-again-swaps'], {
							'symbol': this.symbol,
						})}</div>
						
						<div style="height:10px;"></div>
						
						
						${!this.isPermit?html`
							<stxapp-button
								type="primary" 
								@_click=${()=>{this._onApproval('max')}}
							>${$t['unlimited-approval']}</stxapp-button>
						`:html`
							<div style="display: flex;flex-direction: row;align-items: center;column-gap: 15px;">
								<div style="flex: 1;">
									<stxapp-button styles="height:40px;"
										type="primary" 
										size="center"
										@_click=${()=>{this._onApproval('max')}}
									>${$t['unlimited-approval']}</stxapp-button>
								</div>
								<div style="flex: 1;position: relative;">
									<stxapp-button styles="height:40px;background-color:#0078c8;"
										type="primary" 
										size="center"
										@_click=${()=>{this._onPermit('max')}}
									>${$t['unlimited-permit']}</stxapp-button>
									
									<div style="position: absolute;z-index: 1;top: -10px;right: 0;">
										<div class="tips-top11-level" style="background-color: #94ff0b;">
											<span class="font-family" style="font-size:11px;color:#00799a;"
											>${$t['gasless']}</span>
										</div>
									</div>
									
								</div>
							</div>
						`}
						
						
					</div>
				</div>
			</div>
		`;
	}
	
	
	_onApproval(e) {
		this.dispatchEvent(new CustomEvent('approval-token', {
			detail: e,
			bubbles: false,
			composed: false
		}));
	}
	_onPermit(e) {
		this.dispatchEvent(new CustomEvent('permit-token', {
			detail: e,
			bubbles: false,
			composed: false
		}));
	}
	
	
	
	_closeClick() {
		this.dispatchEvent(new CustomEvent('close-approve'));
	}
	
}

if (!customElements.get('stxcom-swap-approve')) {
	customElements.define('stxcom-swap-approve', StxappSwapApprove);
}