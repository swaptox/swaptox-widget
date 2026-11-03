


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
		
	};
	constructor() {
		super();
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
			cursor: pointer;
			display: flex;
			flex-direction: row;
			align-items: center;
			column-gap: 2px;
			text-decoration: none;
			line-height: 22px;
			border-top: 1px solid #25b78600;
			border-bottom: 1px solid #25b78600;
		}
		.view-transactions-txplorer:hover {
			color: #25b786;
			border-bottom: 1px solid #25b786;
		}
		
	`;
	

	render() {
		const $t = sdkStore.$t;
		const tiaozhuanIcon = html`<svg t="1792193690242" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7683" width="13" height="13"><path d="M640 64h256l5 0.2 7.7 1.1 7.3 1.9 7.1 2.8 6.2 3.3 5.9 4.1 6 5.3c2.3 2.3 4.3 4.7 6.2 7.2L952 97l3.4 7.2 2.3 6.7 1.5 7.2 0.7 7.7v258.1c0 35.3-28.7 64-64 64s-64-28.7-64-64V282.5L493.3 621.3c-25 25-65.5 25-90.5 0-23.1-23.1-24.8-59.4-5.3-84.5l5.3-6L741.4 192H640c-35.3 0-64-28.7-64-64s28.7-64 64-64z m-256 0c35.3 0 64 28.7 64 64 0 32.8-24.7 59.9-56.5 63.6l-7.5 0.4H281.6c-46.6 0-84.8 35.5-89.2 81l-0.4 8.6v460.8c0 46.6 35.5 84.8 81 89.2l8.6 0.4h460.8c46.6 0 84.8-35.5 89.2-81l0.4-8.6V640c0-35.3 28.7-64 64-64 32.8 0 59.9 24.7 63.6 56.5l0.4 7.5v102.4c0 116.2-91 211.1-205.7 217.3l-11.9 0.3H281.6c-116.2 0-211.1-91-217.3-205.7l-0.3-11.9V281.6c0-116.2 91-211.1 205.7-217.3l11.9-0.3H384z" p-id="7684" fill="#25b786"></path></svg>`;
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
				
				
				
				<div style="display: flex;justify-content: center;padding-top:18px;">
					<div @click=${this._onLink}
						class="view-transactions-txplorer" 
					>
						<span class="font-family request-swap-subtitle" style="color:#25b786;"
						>${$t['view-transaction-explorer']}</span>
						${tiaozhuanIcon}
					</div>
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
	_onLink() {
		this.dispatchEvent(new CustomEvent('change-link'));
	}
	
}

if (!customElements.get('stxcom-swap-success')) {
	customElements.define('stxcom-swap-success', StxappSwapSuccess);
}