

import { LitElement, html, css } from 'lit';
import { $app } from '../../../js_sdk/index.js';
import { sdkStore } from '../../../data/store/store.js';
import { StoreMixin } from '../../../data/store/state-mixin.js';
import { networkData } from '../../../data/network-data.js';
import '../../../icon/com-icon-to.js';

export class StxuiViewRecipient extends StoreMixin(LitElement) {
	static properties = {
		recipient: {
			type: String
		},
		disabledCustomRecipient: {
			type: Boolean
		},
	};
	constructor() {
		super();
		this.recipient = '';
		this.disabledCustomRecipient = false;
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
			cursor:pointer;
			/*transition: background-color 0.2s ease-in-out;*/
		}
		.app-confirm-card-body:hover{
			background-color: var(--stxui-card-confirm-card-body-background-hover);
		}
		
		.custom-recipient{
			cursor:pointer;
			border-radius: 18px;
			padding: 10px 15px;
			box-shadow: 0 0 0 1px var(--stxui-custom-recipient-warn-border-color);
			background-color: var(--stxui-custom-recipient-warn-background-color);
			transition: opacity 0.2s ease-in-out;
		}
		.custom-recipient:hover{
			opacity: 0.8;
		}
		
		
		
		
		.confirm-card-flex-space-between{
			display: flex;flex-direction: row;align-items: center;justify-content: space-between;
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
		.card-right-you-text{
			white-space: nowrap;
			font-size: 13px;
			color: var(--stxui-theme-font-color);
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
		
		
		.disabled-custom-recipient{
			box-shadow: 0 0 0 1px var(--stxui-card-confirm-card-body-border);
			border-radius: 18px;
			padding: 10px 15px;
			background-color: var(--stxui-card-confirm-card-body-background-color);
		}
		

		
		
	`;
	
	
	render() {
		const $t = sdkStore.$t;
		const isWallet = (sdkStore.account.toLowerCase()===this.recipient.toLowerCase());
		return html`
			<div @click=${this._click} 
			class="${this.disabledCustomRecipient?'disabled-custom-recipient':isWallet?'app-confirm-card-body':'custom-recipient'}">
				<div class="confirm-card-flex-space-between">
					<span class="font-family card-left-zuo-text">${$t['recipient']}</span>
					<div style="display:flex;flex-direction:row;align-items:center;column-gap:6px;">
						
						
						${isWallet?html`
							<div class="qianbao-skdz">
								<span class="font-family qoanbao-zh-text">${$t['wallet']}</span>
							</div>
						`:html`
							<div class="com-tag-custom">
								<span class="font-family qoanbao-custom-text">${$t['custom']}</span>
							</div>
						`}
						
						
						${!this.disabledCustomRecipient?html`
							<com-icon-to size="12px" direction="bottom"></com-icon-to>
						`:null}
						
						
						
						${this.recipient?html`
							<span @click=${this._onToAddress} class="font-family card-right-you-text a1-dianjis"
							>${this.recipient.slice(0, 6)}...${this.recipient.slice(-4)}</span>
						`:null}
						
						
					</div>
				</div>
			</div>
		`;
	}
	
	
	_onToAddress(e){
		e.preventDefault();
		e.stopPropagation();
		const url = networkData[sdkStore.chain].blockExplorer.contract.replace('{{address}}', this.recipient);
		$app.openUrl(url);
	}
	_click() {
		if(this.disabledCustomRecipient){
			return;
		}
		this.dispatchEvent(new CustomEvent('setrecipient'));
	}
	
	
}

if (!customElements.get('stxui-view-recipient')) {
	customElements.define('stxui-view-recipient', StxuiViewRecipient);
}

