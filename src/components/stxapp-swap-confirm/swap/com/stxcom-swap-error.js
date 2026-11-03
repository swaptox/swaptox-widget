


import {
	LitElement,
	html,
	css
} from 'lit';


import { sdkStore } from '../../../../data/store/store.js';
import { StoreMixin } from '../../../../data/store/state-mixin.js';
import '../../../../components/stxapp-button/stxapp-button.js';


export class StxappSwapError extends StoreMixin(LitElement) {
	static properties = {
		errorMag: {
			type: String,
		},
		errorType: {
			type: String,
		},
	};
	constructor() {
		super();
		this.errorMag = '';
		this.errorType = '';
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
		
		.swap-error-body{
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			z-index: 2;
			display: flex;
			flex-direction: column;
			justify-content: center;
			background-color: var(--stxui-modal-background-color, #fff);
			border-radius: 20px;
		}
		
		.view-fubiaoti-errormag{
			display: flex;
			flex-direction: row;
			align-items: center;
			text-decoration: none;
			line-height: 28px;
			color: #999;
		}
	`;
	

	render() {
		const $t = sdkStore.$t;
		
		
		if(this.errorType==='quote-expired'){
			return html`
				<div class="swap-error-body">
					
					<div style="display: flex;justify-content: center;">
						<div style="width: 120px;height: 120px;">
							<svg t="1753471998059" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3634" width="120" height="120"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#FFAA00" opacity=".1" p-id="3635"></path><path d="M512 512m-384 0a384 384 0 1 0 768 0 384 384 0 1 0-768 0Z" fill="#FFAA00" opacity=".2" p-id="3636"></path><path d="M512 512m-256 0a256 256 0 1 0 512 0 256 256 0 1 0-512 0Z" fill="#FFAA00" p-id="3637"></path><path d="M512 659.2c-19.2 0-38.4-19.2-38.4-38.4V512c0-19.2 19.2-38.4 38.4-38.4s38.4 19.2 38.4 38.4v115.2c0 19.2-19.2 32-38.4 32m0-224c-19.2 0-38.4-19.2-38.4-38.4s19.2-38.4 38.4-38.4 38.4 19.2 38.4 38.4c0 25.6-19.2 38.4-38.4 38.4" fill="#FFFFFF" p-id="3638"></path></svg>
						</div>
					</div>
					
					<div style="display: flex;justify-content: center;padding-top: 20px;">
						<span class="font-family request-swap-title">${$t['quote-expired']}</span>
					</div>
					
					<div style="display: flex;justify-content: center;padding-top:18px;">
						<div style="max-width: 320px;display: flex;justify-content: center;">
							<span class="font-family request-swap-subtitle" style="white-space: wrap;color:#999;"
							>${$t['please-get-a-new-quote']}</span>
						</div>
					</div>
					
					<div style="padding-top:24px;padding-left:20px;padding-right:20px;">
						<stxapp-button
							type="default" 
							@_click=${this._onRefreshQuote}
						>${$t['refresh-quote']}</stxapp-button>
					</div>
					
				</div>
			`;
		}

		
		
		return html`
			<div class="swap-error-body">
				
				<div style="display: flex;justify-content: center;">
					<div style="width: 120px;height: 120px;">
						<svg t="1791759812857" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18764" width="120" height="120"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#FF9784" opacity=".15" p-id="18765"></path><path d="M512 814.545455a302.545455 302.545455 0 0 1-213.934545-516.48 302.545455 302.545455 0 1 1 427.86909 427.86909A300.555636 300.555636 0 0 1 512 814.545455z m0-186.379637a49.850182 49.850182 0 1 0 49.838545 49.838546 49.896727 49.896727 0 0 0-49.838545-49.838546z m-19.362909-281.530182a46.289455 46.289455 0 0 0-45.975273 51.549091l19.374546 169.157818a46.277818 46.277818 0 0 0 91.927272 0l19.362909-169.169454a46.277818 46.277818 0 0 0-45.975272-51.549091z" fill="#FC7D5D" p-id="18766"></path></svg>
					</div>
				</div>
				
				<div style="display: flex;justify-content: center;padding-top:8px;">
					<span class="font-family request-swap-title" style="font-size: 20px;"
					>${$t['transaction-may-fail']}</span>
				</div>
				
				<div style="display: flex;justify-content: center;padding-top:10px;">
					<div style="max-width: 320px;display: flex;justify-content: center;">
						<span class="font-family request-swap-subtitle" style="
						color: var(--stxui-transaction-may-fail-text, #999);
						background-color: var(--stxui-transaction-may-fail-bg, #444);
		padding: 5px 10px;
		border-radius: 6px;white-space: wrap;"
						>${this.errorMag}</span>
					</div>
				</div>
				
				<div style="padding-top:15px;padding-left:20px;padding-right:20px;">
					<stxapp-button
						type="warn" 
						@_click=${this._onForceSend}
					>${$t['force-send']}</stxapp-button>
				</div>
				
				
				<div style="padding-top:12px;padding-left:20px;padding-right:20px;">
					<stxapp-button
						type="default" 
						@_click=${this._onClose}
					>${$t['close']}</stxapp-button>
				</div>
				
			</div>
		`;
		
		
		
		
	}
	
	
	_onClose() {
		this.dispatchEvent(new CustomEvent('swap-error-close'));
	}
	_onRefreshQuote() {
		this.dispatchEvent(new CustomEvent('refresh-quote', {
			bubbles: false,
			composed: false
		}));
	}
	_onForceSend() {
		this.dispatchEvent(new CustomEvent('swap-force-send'));
	}
	
}

if (!customElements.get('stxcom-swap-error')) {
	customElements.define('stxcom-swap-error', StxappSwapError);
}