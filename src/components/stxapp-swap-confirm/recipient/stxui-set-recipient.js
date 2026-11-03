




import { LitElement, html, css } from 'lit';
import { $app } from '../../../js_sdk/index.js';
import { viemUtils } from '../../../js_sdk/viem/utils.js';
import { sdkStore } from '../../../data/store/store.js';
import { StoreMixin } from '../../../data/store/state-mixin.js';
import { networkData } from '../../../data/network-data.js';

import './stxui-recipient-cache-list.js';
import './stxui-set-recipient-input.js';

export class StxuiSetRecipient extends StoreMixin(LitElement) {
	static properties = {
		InputRecipient: {
			type: String
		},
		currentrecipient: {
			type: String
		},
	};
	constructor() {
		super();
		this.InputRecipient = '';
		this.currentrecipient = '';
	}


	static styles = css`
		:host {
			display: block;
		}
		.stxui-set-recipient{
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 1;
			border-radius: 20px;
			padding: 20px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			background-color: var(--stxui-modal-background-color, #fff);
		}
		.font-family{
			user-select: none;
			font-family: var(--stxui-font-family);
		}
		.card-left-zuo-text{
			white-space:nowrap;
			font-size: 13px;
			color: var(--stxui-confirm-swap-card-left-zuo-textcolor);
		}
		.qianbao-skdz{
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 10px;
			box-shadow: 0 0 0 1px var(--stxui-com-tag-wallet-box-shadow);
			padding: 0px 6px;
			height: 17px;
		}
		.qoanbao-zh-text{
			color: var(--stxui-theme-font-color);
			font-size: 10px;
			white-space:nowrap;
		}
		.com-tag-custom{
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 10px;
			box-shadow: 0 0 0 1px var(--stxui-custom-recipient-warn-border-color);
			padding: 0px 6px;
			height: 17px;
		}
		.qoanbao-custom-text{
			color: var(--stxui-custom-recipient-warn-text-color);
			font-size: 10px;
			white-space:nowrap;
		}
		
		
		.text-aabb-ellipsis{
			flex: 1;
			color: var(--stxui-theme-font-color);
			font-size: 14px;
			word-break: break-all;
			user-select: text;
			font-family: var(--stxui-font-family);
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
		
		.card-right-you-text{
			white-space: nowrap;
			font-size: 13px;
			color: var(--stxui-theme-font-color);
		}
		
		
		
		
		.tap-body-confirm{
			cursor:pointer;
		}
		.tap-body-confirm:hover{
			background-color: var(--stxui-card-confirm-card-body-background-hover);
		}
		
		
		.a1-dianjis{
			cursor: pointer;
		}
		@media (max-width: 560px) {
			.a1-dianjis{
				pointer-events: none;
			}
		}
		.a1-dianjis:hover{
			color: #25b786;
			text-decoration: underline;
		}
		
		

		
	`;
	
	
	render() {
		const $t = sdkStore.$t;
		let isWallet = true;
		if(this.InputRecipient){
			if(this.InputRecipient.toLowerCase()===sdkStore.account.toLowerCase()){
				isWallet = true;
			}else{
				isWallet = false;
			}
		}else if(this.currentrecipient){
			if(this.currentrecipient.toLowerCase()===sdkStore.account.toLowerCase()){
				isWallet = true;
			}else{
				isWallet = false;
			}
		}
		return html`
			<div class="stxui-set-recipient">
				
				<div>
					<div class="font-family card-left-zuo-text" style="padding-bottom:10px;"
					>${$t['set-recipient-address']}</div>				
					<stxui-set-recipient-input id="recipientInput"
						.placeholder="${$t['please-enter-recipient-address']}"
						@recipient-input=${this._recipientInput}
					></stxui-set-recipient-input>
					
					<stxui-recipient-cache-list id="recipientCache"
						.account="${sdkStore.account}"
						@select-recipient=${(e)=>{this.shadowRoot.querySelector('#recipientInput').setValue(e.detail.value);}}
					></stxui-recipient-cache-list>
				</div>

				
				
				<div>
				
					<div style="padding-bottom:4px;display: flex;flex-direction: row;align-items: center;column-gap: 5px;">
						<div class="font-family card-left-zuo-text">${$t['confirm-recipient-address']}</div>
						${isWallet?html`
							<div class="qianbao-skdz">
								<span class="font-family qoanbao-zh-text">${$t['wallet']}</span>
							</div>
						`:html`
							<div class="com-tag-custom">
								<span class="font-family qoanbao-custom-text">${$t['custom']}</span>
							</div>
						`}
					</div>
					<div style="display: flex;flex-direction: row;align-items: center;column-gap:2px;">
						${isWallet?html`
							<svg t="1791667612458" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2759" width="15" height="15"><path d="M725.333333 64a170.666667 170.666667 0 0 1 170.666667 170.666667v554.666666a170.666667 170.666667 0 0 1-170.666667 170.666667H277.333333a170.666667 170.666667 0 0 1-170.666666-170.666667V234.666667a170.666667 170.666667 0 0 1 170.666666-170.666667h448z m0 74.666667H277.333333a96 96 0 0 0-95.893333 91.477333L181.333333 234.666667v554.666666a96 96 0 0 0 91.477334 95.893334L277.333333 885.333333h448a96 96 0 0 0 95.893334-91.477333L821.333333 789.333333V234.666667a96 96 0 0 0-91.477333-95.893334L725.333333 138.666667z" fill="#999999" p-id="2760"></path><path d="M896 384v256H682.666667a128 128 0 1 1 0-256h213.333333z m-74.666667 181.333333v-106.666666H682.666667a53.333333 53.333333 0 0 0-53.226667 49.834666L629.333333 512a53.333333 53.333333 0 0 0 49.834667 53.226667L682.666667 565.333333h138.666666z" fill="var(--stxui-theme-font-color)" p-id="2761"></path></svg>
							<text class="text-aabb-ellipsis">${sdkStore.account}</text>
						`:html`
							<svg t="1791667563496" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2372" width="15" height="15"><path d="M830.762667 896.533333a37.333333 37.333333 0 0 1 3.050666 74.56l-3.050666 0.106667H201.258667a37.333333 37.333333 0 0 1-3.050667-74.538667l3.050667-0.128h629.504zM610.176 114.112L199.765333 524.522667a88.533333 88.533333 0 0 0-24.213333 45.226666l-35.946667 179.733334a71.466667 71.466667 0 0 0 84.096 84.096l179.733334-35.946667a88.533333 88.533333 0 0 0 45.226666-24.213333L859.093333 363.008a88.533333 88.533333 0 0 0 0-125.205333L735.36 114.133333a88.533333 88.533333 0 0 0-125.205333 0zM252.586667 577.322667L662.976 166.912a13.866667 13.866667 0 0 1 19.626667 0l123.690666 123.690667a13.866667 13.866667 0 0 1 0 19.626666L395.882667 720.597333l-1.557334 1.344a13.866667 13.866667 0 0 1-5.546666 2.453334l-175.018667 35.008 35.008-175.018667a13.866667 13.866667 0 0 1 3.797333-7.082667z" fill="#ff9c08" p-id="2373"></path></svg>
							<text class="text-aabb-ellipsis"
							>${this.InputRecipient?this.InputRecipient:this.currentrecipient}</text>
						`}
					</div>
					
					
					<div style="height:15px;"></div>
				
					${this.InputRecipient&&!viemUtils.isAddress(this.InputRecipient)?html`
						<stxapp-button
							type="warn" 
							.disabled="${true}"
						>${$t['please-enter-a-valid-address']}</stxapp-button>
					`:html`
						<stxapp-button
							type="primary" 
							.disabled="${this.InputRecipient&&viemUtils.isAddress(this.InputRecipient)?false:true}"
							@_click=${this._onConfirm}
						>${$t['confirm-recipient-address']}</stxapp-button>					
					`}
					
					<div style="height:15px;"></div>
					<stxapp-button
						type="default" 
						@_click=${this._onCancel}
					>${$t['cancel']}</stxapp-button>
					
				</div>
				
			</div>
		`;
	}
	
	
	_recipientInput(e) {
		this.InputRecipient = e.detail.value;
	}
	_onCancel() {
		this.dispatchEvent(new CustomEvent('cancel'));
	}
	_onConfirm(){
		this.shadowRoot.querySelector('#recipientCache').addCache(this.InputRecipient);
		this.dispatchEvent(new CustomEvent('confirm', {
			detail: { value: this.InputRecipient },
			bubbles: true,
			composed: true
		}));
	}
}

if (!customElements.get('stxui-set-recipient')) {
	customElements.define('stxui-set-recipient', StxuiSetRecipient);
}

