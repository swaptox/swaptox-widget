


import { LitElement, html, css } from 'lit';
import { $app } from '../../../js_sdk/index.js';
import { sdkStore } from '../../../data/store/store.js';
import { StoreMixin } from '../../../data/store/state-mixin.js';
import { networkData } from '../../../data/network-data.js';

export class StxcomDetailsList extends StoreMixin(LitElement) {
	static properties = {
		outname: {
			type: String
		},
		amountminout: {
			type: String
		},
		slippage: {
			type: String
		},
		swapfee: {
			type: Number
		},
		gasusd: {
			type: String
		},
		routeraddress: {
			type: String
		},
	};
	constructor() {
		super();
		this.outname = '';
		this.amountminout = '';
		this.slippage = '';
		this.swapfee = 0;
		this.gasusd = '';
		
		this.routeraddress = '';
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
			padding-top: 7px;
		}
		.a-dianjis{
			cursor: pointer;
		}
		@media (max-width: 560px) {
			.a-dianjis{
				pointer-events: none;
			}
		}
		.a-dianjis:hover{
			color: #25b786;
			text-decoration: underline;
		}
	`;
	

	render() {
		const $t = sdkStore.$t;
		const routeraddress = this.routeraddress?`${this.routeraddress.slice(0, 6)}...${this.routeraddress.slice(-4)}`:'';
		return html`
			<div class="app-confirm-card-body">
				
				<div class="confirm-card-flex-space-between">
					<span class="font-family card-left-zuo-text">${$t['minimum-received']}</span>
					<span class="font-family card-right-you-text"
					>${this.amountminout} ${this.outname}</span>
				</div>
				
				
				<div class="confirm-card-flex-space-between zy-top-daxiao">
					<span class="font-family card-left-zuo-text">${$t['slippage-tolerance']}</span>
					<span class="font-family card-right-you-text">${this.slippage}%</span>
				</div>
				
				
				<div class="confirm-card-flex-space-between zy-top-daxiao">
					<span class="font-family card-left-zuo-text">${$t['swap-fee']}</span>
					<span class="font-family card-right-you-text">${this.swapfee}%</span>
				</div>
				
				<div class="confirm-card-flex-space-between zy-top-daxiao">
					<span class="font-family card-left-zuo-text">${$t['network-cost']}</span>
					<span class="font-family card-right-you-text">${this.gasusd}</span>
				</div>
				
				<div class="confirm-card-flex-space-between zy-top-daxiao">
					<span class="font-family card-left-zuo-text">${$t['contract-address']}</span>
					<span @click=${this._onToAddress} class="font-family card-right-you-text a-dianjis"
					>${routeraddress}</span>
				</div>
				
				
				
			</div>
		`;
	}
	
	
	_onToAddress(){
		const url = networkData[sdkStore.chain].blockExplorer.contract.replace('{{address}}', this.routeraddress);
		$app.openUrl(url);
	}
	
	
	
}

if (!customElements.get('stxcom-details-list')) {
	customElements.define('stxcom-details-list', StxcomDetailsList);
}