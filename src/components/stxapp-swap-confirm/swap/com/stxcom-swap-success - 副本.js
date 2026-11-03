


import {
	LitElement,
	html,
	css
} from 'lit';


import { sdkStore } from '../../../../data/store/store.js';
import { StoreMixin } from '../../../../data/store/state-mixin.js';
import '../../../../components/stxapp-button/stxapp-button.js';

export class StxappSwapSuccess extends StoreMixin(LitElement) {
	static properties = {
		txhash: {
			type: String,
		},
		url: {
			type: String,
		},
		isSaveHash: {
			type: Boolean,
		},
	};
	constructor() {
		super();
		this.txhash = '';
		this.url = '';
		this.isSaveHash = false;
		this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
	}


	static styles = css`
		:host {
			display: block;
		}
		.font-family{
			user-select: none;
			font-family: var(--stxui-font-family);
		}
		.request-swap-title{
			font-size: 26px;
			font-weight: 500;
			color: var(--stxui-theme-font-color, #111);
			white-space: nowrap;
		}
		.request-swap-subtitle{
			font-size: 14px;
			color: #999;
			white-space: nowrap;
		}
		
		.swap-success{
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			z-index: 3;
			display: flex;
			flex-direction: column;
			justify-content: center;
			background-color: var(--stxui-modal-background-color, #fff);
			border-radius: 20px;
		}
		
		.view-transactions-txplorer{
			display: flex;
			flex-direction: row;
			align-items: center;
			text-decoration: none;
			line-height: 28px;
		}
		.view-transactions-txplorer:hover {
			color: #25b786;
			text-decoration: underline;
		}
		
		
		.disable-url{
			visibility: hidden;
			opacity: 0;
			pointer-events:none;
		}
		
		
	`;
	

	render() {
		const $t = sdkStore.$t;
		const txhashURL = this.url?this.url.replace('{{tx}}', this.txhash):'';
		return html`
			<div class="swap-success">
				
				<div style="display: flex;justify-content: center;">
					<div style="width: 120px;height: 120px;">
						<svg t="1753411836924" class="icon" viewBox="0 0 1127 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3372" width="120" height="120"><path d="M53.819168 511.999975a509.762608 508.875425 90 1 0 1017.750849 0 509.762608 508.875425 90 1 0-1017.750849 0Z" fill="#2BCE6C" opacity=".1" p-id="3373"></path><path d="M155.590331 511.999975a407.810086 407.104261 90 1 0 814.208523 0 407.810086 407.104261 90 1 0-814.208523 0Z" fill="#2BCE6C" opacity=".2" p-id="3374"></path><path d="M288.682486 511.999975a274.487558 274.012106 90 1 0 548.024213 0 274.487558 274.012106 90 1 0-548.024213 0Z" fill="#2BCE6C" p-id="3375"></path><path d="M425.931167 521.484501l33.212994-33.212995 99.820342 99.820342-33.217897 33.212994z" fill="#FFFFFF" p-id="3376"></path><path d="M525.746606 621.304842l-33.271813-33.271813 185.450657-185.450656 33.271813 33.271813z" fill="#FFFFFF" p-id="3377"></path><path d="M103.751395 237.512417a27.448756 27.39974 90 1 0 54.799481 0 27.448756 27.39974 90 1 0-54.799481 0Z" fill="#F9C72C" p-id="3378"></path><path d="M934.566415 464.944966a27.448756 27.39974 90 1 0 54.79948 0 27.448756 27.39974 90 1 0-54.79948 0Z" fill="#2BCE6C" p-id="3379"></path><path d="M1040.258829 517.881852a41.173134 41.09961 90 1 0 82.199221 0 41.173134 41.09961 90 1 0-82.199221 0Z" fill="#F9C72C" p-id="3380"></path><path d="M883.678382 888.440055a31.370007 31.316089 90 1 0 62.632179 0 31.370007 31.316089 90 1 0-62.632179 0Z" fill="#F9C72C" p-id="3381"></path><path d="M958.054707 202.22116a15.685003 15.655594 90 1 0 31.311188 0 15.685003 15.655594 90 1 0-31.311188 0Z" fill="#3FB8FD" p-id="3382"></path><path d="M0 857.070048a39.212508 39.143886 90 1 0 78.287773 0 39.212508 39.143886 90 1 0-78.287773 0Z" fill="#2BCE6C" p-id="3383"></path></svg>
					</div>
				</div>
				
				
				
				
				<div style="display: flex;justify-content: center;padding-top: 20px;">
					<span class="font-family request-swap-title">${$t['transaction-sent']}</span>
				</div>
				
				
				<!--必须已经推送到后端才能点击-->
				<div style="display: flex;justify-content: center;padding-top:18px;" 
				class="${this.isTouchDevice&&!this.isSaveHash?'disable-url':''}">
					<a 
						class="view-transactions-txplorer" 
						target="_blank" 
						href="${txhashURL}"
					>
						<span class="font-family request-swap-subtitle" style="color:#25b786;"
						>${$t['view-transaction-explorer']}</span>
					</a>
				</div>
				
				
				
				
				
				
				<div style="padding-top:24px;padding-left:20px;padding-right:20px;">
					<stxapp-button
						type="default" 
						@_click=${this._onClose}
					>${$t['close']}</stxapp-button>
				</div>
				
				
				
				
			</div>
		`;
	}
	
	
	_onClose() {
		this.dispatchEvent(new CustomEvent('swap-success-close'));
	}
	
	
}

if (!customElements.get('stxcom-swap-success')) {
	customElements.define('stxcom-swap-success', StxappSwapSuccess);
}