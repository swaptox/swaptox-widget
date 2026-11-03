

import {
	LitElement,
	html,
	css
} from 'lit';

import { _initTransactionData } from './_initTransactionData.js';
import { sdkStore } from '../../../data/store/store.js';
import { StoreMixin } from '../../../data/store/state-mixin.js';
import { $app } from '../../../js_sdk/index.js';
import { getTransaction } from '../../../api/cloud/checkTransaction';

import './stxcom-swap-details-token-card.js';
import './stxcom-swap-transaction-details-list.js';

export class StxcomSwapTransactionDetails extends StoreMixin(LitElement) {
	static properties = {
		item: {type: Object},
		itemData: {type: Object},
		status: {type: String},
	};
	constructor() {
		super();
		this.item = {};
		this.itemData = {};
		this.status = '';
	}


	static styles = css`
		:host {
			display: block;
		}
		.font-family{
			user-select: none;
			font-family: var(--stxui-font-family);
		}
		.swap-details-title{
			box-sizing: border-box;
			font-size: 18px;
			color: var(--stxui-theme-font-color, #111);
		}
		.stxcom-swap-transaction-details{
			position: relative;
			padding: 20px;
		}
	`;
	
	
	
	
	willUpdate(changedProperties) {
	    if (changedProperties.has('item')) {
	        if(this.item&&$app.test.object(this.item)){
				this._initTransactionData();
			}
	    }
	}
	
	
	async _initTransactionData(){
		this.status = '';
		this.itemData = await _initTransactionData(this.item, sdkStore.priceBehalf);
		if(this.itemData.status==='pending'){
			this._checkUpdates();
		}
		//console.log('[[[[[[]]]]]]', this.itemData);
	}
	
	
	_checkUpdates(){
		let num = 0;
		let _me = this;
		const intervalID = setInterval(async ()=>{
			num++;
			const swapHashObj = sdkStore.swapHash?.[_me.itemData.chainin];
			if(swapHashObj&&swapHashObj[_me.itemData.hash]){
				if(swapHashObj[_me.itemData.hash]!=='pending'){
					_me.status = swapHashObj[_me.itemData.hash];
					clearInterval(intervalID);					
				}
			}else{
				const itemData = await checkTransaction(_me.itemData.id?{id:_me.itemData.id}:{
					hash: _me.itemData.hash,
					chain: _me.itemData.chainin,
				});
				if(itemData&&itemData.id&&itemData.status!=='pending'){
					_me.status = itemData.status;
					clearInterval(intervalID);
				}
			}
			if(num>=30){
				clearInterval(intervalID);
			}
		}, 1500);
	}
	
	
	

	render() {
		
		const $t = sdkStore.$t;
		
		return html`
			<div @click=${(e)=>e.stopPropagation()} class="stxcom-swap-transaction-details">
				<div style="display:flex;flex-direction:row;align-items:center;justify-content:space-between;padding-bottom: 20px;">
					<div class="font-family swap-details-title">${$t['transaction-details']}</div>
					<com-icon-close @change=${this._closeClick} size="default"></com-icon-close>
				</div>
				
				
				<stxcom-swap-details-token-card
					cardtype="sent"
					.amount="${this.itemData._amountIn}"
					.usdprice="${this.itemData._inUsd}"
					.symbol="${this.itemData.symbolIn}"
					.logourl="${this.itemData.logoIn}"
					.chainLogo="${this.itemData.chaininLogo}"
				></stxcom-swap-details-token-card>
				<div style="height:15px;"></div>
				<stxcom-swap-details-token-card
					cardtype="received"
					.amount="${this.itemData._amountOut}"
					.usdprice="${this.itemData._outUsd}"
					.symbol="${this.itemData.symbolOut}"
					.logourl="${this.itemData.logoOut}"
					.chainLogo="${this.itemData.chainoutLogo}"
				></stxcom-swap-details-token-card>
				
				<div style="height:15px;"></div>
				<stxcom-swap-transaction-details-list
					.actualReceived="${this.itemData._actualreceived}"
					.outname="${this.itemData.symbolOut}"
					.initiated="${this.itemData.initiated}"
					.swapfee="${this.itemData._swapfee}"
					.status="${this.status?this.status:this.itemData.status}"
					?customrecipient=${this.itemData.customrecipient}
					.recipient="${this.itemData.recipient}"
					.transaction="${this.itemData.hash}"
				></stxcom-swap-transaction-details-list>
				
				
			</div>
		`;
	}
	_closeClick(){
		this.dispatchEvent(
			new CustomEvent('close', {
				bubbles: false,
				composed: false
			})
		);
	}
	
}

if (!customElements.get('stxcom-swap-transaction-details')) {
	customElements.define('stxcom-swap-transaction-details', StxcomSwapTransactionDetails);
}
