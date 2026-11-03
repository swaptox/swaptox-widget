


import { LitElement, html, css } from 'lit';
import { $app } from '../../../js_sdk/index.js';
import { sdkStore } from '../../../data/store/store.js';
import { StoreMixin } from '../../../data/store/state-mixin.js';
import { networkData } from '../../../data/network-data.js';
import { loadGifUrl } from '../../../icon/flickr-ball-circle-round.js';

export class StxcomSwapTransactionDetailsList extends StoreMixin(LitElement) {
	static properties = {
		outname: {
			type: String
		},
		actualReceived: {
			type: String
		},
		initiated: {
			type: String
		},
		swapfee: {
			type: String
		},
		status: {
			type: String
		},
		recipient: {
			type: String
		},
		transaction: {
			type: String
		},
		customrecipient: {
			type: Boolean
		},
	};
	constructor() {
		super();
		this.outname = '';
		this.actualReceived = '';
		this.initiated = '';
		this.swapfee = '';
		this.status = '';
		
		this.recipient = '';
		this.transaction = '';
		
		this.customrecipient = false;
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
		
		.zy-top-daxiao{
			height: 26px;
		}
		.a-dianjis889{
			cursor: pointer;
			line-height: 20px;
			border-top: 1px solid #25b78600;
			border-bottom: 1px solid #25b78600;
		}
		.a-dianjis889:hover{
			border-bottom: 1px solid #25b786;
		}
	`;
	

	render() {
		const $t = sdkStore.$t;
		const recipient = this.recipient?`${this.recipient.slice(0, 6)}...${this.recipient.slice(-4)}`:'';
		const transaction = this.transaction?`${this.transaction.slice(0, 6)}...${this.transaction.slice(-4)}`:'';
		const statusCode = this.status?.toLowerCase();
		const tiaozhuanIcon = html`<svg t="1792193690242" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7683" width="12" height="12"><path d="M640 64h256l5 0.2 7.7 1.1 7.3 1.9 7.1 2.8 6.2 3.3 5.9 4.1 6 5.3c2.3 2.3 4.3 4.7 6.2 7.2L952 97l3.4 7.2 2.3 6.7 1.5 7.2 0.7 7.7v258.1c0 35.3-28.7 64-64 64s-64-28.7-64-64V282.5L493.3 621.3c-25 25-65.5 25-90.5 0-23.1-23.1-24.8-59.4-5.3-84.5l5.3-6L741.4 192H640c-35.3 0-64-28.7-64-64s28.7-64 64-64z m-256 0c35.3 0 64 28.7 64 64 0 32.8-24.7 59.9-56.5 63.6l-7.5 0.4H281.6c-46.6 0-84.8 35.5-89.2 81l-0.4 8.6v460.8c0 46.6 35.5 84.8 81 89.2l8.6 0.4h460.8c46.6 0 84.8-35.5 89.2-81l0.4-8.6V640c0-35.3 28.7-64 64-64 32.8 0 59.9 24.7 63.6 56.5l0.4 7.5v102.4c0 116.2-91 211.1-205.7 217.3l-11.9 0.3H281.6c-116.2 0-211.1-91-217.3-205.7l-0.3-11.9V281.6c0-116.2 91-211.1 205.7-217.3l11.9-0.3H384z" p-id="7684" fill="#25b786"></path></svg>`;
		return html`
			<div class="app-confirm-card-body">
				
				
				${this.actualReceived?html`
					<div class="confirm-card-flex-space-between zy-top-daxiao">
						<span class="font-family card-left-zuo-text">${$t['actual-received']}</span>
						<span class="font-family card-right-you-text"
						>${this.actualReceived} ${this.outname}</span>
					</div>
				`:null}
				
				
				
				
				
				
				<div class="confirm-card-flex-space-between zy-top-daxiao">
					<span class="font-family card-left-zuo-text">${$t['swap-fee']}</span>
					<span class="font-family card-right-you-text">${this.swapfee}%</span>
				</div>
				
				<div class="confirm-card-flex-space-between zy-top-daxiao">
					<span class="font-family card-left-zuo-text">${$t['initiated']}</span>
					<span class="font-family card-right-you-text">${this.initiated}</span>
				</div>				
				
				<div class="confirm-card-flex-space-between zy-top-daxiao">
					<span class="font-family card-left-zuo-text">${$t['recipient']}</span>
					<div style="display: flex;flex-direction: row;align-items: center;column-gap:8px;">
						
						${this.customrecipient?html`
							<div class="com-tag-custom">
								<span class="font-family qoanbao-custom-text">${$t['custom']}</span>
							</div>
						`:null}
						
						<div class="a-dianjis889" style="display: flex;flex-direction: row;align-items: center;column-gap:2px;">
							<span @click=${this._onToAddress} style="color:#25b786;" class="font-family card-right-you-text"
							>${recipient}</span>
							${tiaozhuanIcon}
						</div>
					</div>
				</div>
				
				
				<div class="confirm-card-flex-space-between zy-top-daxiao">
					<span class="font-family card-left-zuo-text">${$t['transaction']}</span>
					<div class="a-dianjis889" style="display: flex;flex-direction: row;align-items: center;column-gap:2px;">
						<span @click=${this._onToHash} style="color:#25b786;" class="font-family card-right-you-text"
						>${transaction}</span>
						${tiaozhuanIcon}
					</div>
				</div>
				
				
				

				
				<div class="confirm-card-flex-space-between zy-top-daxiao">
					<span class="font-family card-left-zuo-text">${$t['status']}</span>
					${statusCode==='pending'?html`
						<div style="display: flex;flex-direction: row;align-items: center;column-gap:0px;">
							<img
								loading="lazy"
								draggable="false"
								width="15px" 
								height="15px" 
								style="margin-right:3px;max-width:15px;max-height:15px;" 
								src="${loadGifUrl}" 
							>
							<span class="font-family card-right-you-text">Pending</span>
						</div>
					`:null}
					${statusCode==='success'?html`
						<span class="font-family card-right-you-text" style="color: #25b786;">Success</span>
					`:null}
					${statusCode==='failed'?html`
						<span class="font-family card-right-you-text" style="color: #ff3d00;">Failed</span>
					`:null}
				</div>
				
				
			</div>
		`;
	}
	
	
	_onToAddress(){
		const url = networkData[sdkStore.chain].blockExplorer.contract.replace('{{address}}', this.recipient);
		$app.openUrl(url);
	}
	_onToHash(){
		const url = networkData[sdkStore.chain].blockExplorer.tx.replace('{{tx}}', this.transaction);
		$app.openUrl(url);
	}
	
	
}

if (!customElements.get('stxcom-swap-transaction-details-list')) {
	customElements.define('stxcom-swap-transaction-details-list', StxcomSwapTransactionDetailsList);
}