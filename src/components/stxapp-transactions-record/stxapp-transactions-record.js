

import {LitElement, html, css} from 'lit';

import { sdkStore } from '../../data/store/store.js';
import { StoreMixin } from '../../data/store/state-mixin.js';
import { getTransaction } from '../../api/cloud/getTransactionsList.js';
//import { allTokens } from '../../api/cloud/getTokenList.js';
//import { networkData } from '../../data/network-data.js';
//import { $app } from '../../js_sdk/index.js';
//import { viemUtils } from '../../js_sdk/viem/utils.js';
import { _initTransactionData } from './details/_initTransactionData.js';

import './com/stxcom-chain-select.js';
import './com/stxcom-transactions-item.js';
import '../stxapp-pagination/stxapp-pagination.js';
import '../stxapp-button/stxapp-button.js';

export class StxappTransactionsRecord extends StoreMixin(LitElement) {
	static properties = {
		loading: {
			type: Boolean,
			reflect: true
		},
		isError: {
			type: Boolean,
			reflect: true
		},
		isModal: {type: Boolean},
		transactionsList: {type: Array},
	};
	
	
	connectedCallback() {
	    super.connectedCallback();
	    sdkStore.addEventListener('sdk-state-changed', this._handleStateChange);
	}
	
	disconnectedCallback() {
	    sdkStore.removeEventListener('sdk-state-changed', this._handleStateChange);
	    super.disconnectedCallback();
	}
	
	
	constructor() {
		super();
		this.loading = false;
		this.isModal = false;
		this.isError = false;
		
		this._currentPage = 1;
		this._pageSize = 5;
		this._total = 0;
		this._chain = '';
		this._tokenObj = {};
		
		this._hashNum = 0;
		
		this._handleStateChange = (e) => {
			const store = e.target;
			if(store.account!==this._account){
				this._account = store.account;
				this._resetList();
			}
			if(store?.swapHash&&store.swapHash?.[store.chain]){
				const hashObj = store.swapHash[store.chain]
				if(Object.keys(hashObj).length!==this._hashNum){
					this._hashNum = Object.keys(hashObj).length;
					this._checkUpdates();
				}
			}
		};
	}
	
	firstUpdated() {
		if(sdkStore.account){
			this._account = sdkStore.account;
		}else{
			let jishu = 0;
			const intervalID = setInterval(()=>{
				jishu++;
				if(this.transactionsList&&this.transactionsList.length>0){
					clearInterval(intervalID);
					return;
				}
				if(sdkStore.account){
					clearInterval(intervalID);
					this._resetList();
					return;
				}
				if(jishu>=100){
					clearInterval(intervalID);
					return;
				}
			}, 100);
		}
	    this._resetList();
	}
	
	_checkUpdates(){
		let num = 0;
		let _me = this;
		const intervalID = setInterval(async ()=>{
			num++;
			const result = await getTransaction({
				page: 1,
				size: _me._pageSize,
				account: _me._account,
				chain: _me._chain,
			});
			if(result&&result.total&&result.total!==_me._total){
				clearInterval(intervalID);
				_me._total = result.total;
				_me.transactionsList = await _me._initTokenData(result.list);
			}
			if(num>=6){
				clearInterval(intervalID);
			}
		}, 1200);
	}
	
	
	
	
	_resetList(){
		this._currentPage = 1;
		this._getTransactionsList();
	}
	
	async _getTransactionsList() {
		if(!sdkStore.account){
			this.loading = false;
			this.isError = false;
			this._total = 0;
			this.transactionsList = [];
			return;
		}
		this.loading = true;
		this.isError = false;
		const result = await getTransaction({
			page: this._currentPage,
			size: this._pageSize,
			account: sdkStore.account,
			chain: this._chain,
		});
		if(result&&result.list){
			this._total = result.total;
			this.transactionsList = await this._initTokenData(result.list);
		}else{
			this.isError = true;
		}
		this.loading = false;
	}
	
	
	async _initTokenData(list){
		const xinArr = [];
		for(let i = 0; i < list.length; i++){
			const data = list[i];
			try {
				const newObj = await _initTransactionData(data, sdkStore.priceBehalf);
				xinArr.push(newObj);
			} catch (e) {}
			if(data.status==='pending'){
				try {
					const stateModal = document.querySelector('swaptox-mini-swap-state');
					stateModal.push({...newObj, hide: true});
				} catch (e) {}
			}
			
		}
		//console.log(xinArr);
		return xinArr;
	}
	
	
	
	


	static styles = css`
		:host {
			display: block;
		}
		.font-family {
			user-select: none;
			font-family: var(--stxui-font-family);
		}
		.swaptox-transactions-record {
			position: relative;
			border-radius: var(--stxui-swap-card-border-radius, 18px);
			background: var(--stxui-theme-background-color, #fff);
			
			border-right-style: solid;
			border-right-width: var(--stxui-card-border-width, 1px);
			border-right-color: var(--stxui-card-border-color, #fff);
			border-left-style: solid;
			border-left-width: var(--stxui-card-border-width, 1px);
			border-left-color: var(--stxui-card-border-color, #fff);
			border-bottom-style: solid;
			border-bottom-width: var(--stxui-card-border-bottom-width, 1px);
			border-bottom-color: var(--stxui-card-border-color, #fff);
			border-top-style: solid;
			border-top-width: var(--stxui-card-border-width, 1px);
			border-top-color: var(--stxui-card-border-color, #fff);
		}
		.swaptox-transactions-record-modal {
			position: relative;
		}
		
		
		
		.transactions-card-title {
			font-size: 17px;
			color: var(--stxui-theme-font-color, #111);
			line-height: 32px;
			user-select: none;
			font-family: var(--stxui-font-family);white-space:nowrap;
		}
		.card-header {
			position: relative;
			z-index: 20;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		
		
		.transactions-list {
			display: flex;
			flex-direction: column;
			gap: 10px;
			width: 100%;
			min-width: 0;
		}
		
		.transactions-list stxcom-transactions-item {
			display: block;
			width: 100%;
			min-width: 0;
		}
		
		.gongdong-div{
			overflow-y: auto;
			max-height: calc(100vh - 300px);
			/* 1. 针对 Chrome, Safari, Edge (WebKit 内核) */
			&::-webkit-scrollbar {
			    display: none;
			}
			/* 2. 针对 Firefox */
			scrollbar-width: none;
			/* 3. 针对 IE/Edge (旧版) */
			-ms-overflow-style: none;
		}
		
		
		.transaction-fenge-window{
			border-top: 1px solid var(--stxui-card-line-color, #eee);
		}
		
		.swaptox-full{}
		@media (max-width: 520px) {
			.gongdong-div {
				max-height: calc(100vh - 211px);
			}
			.swaptox-full{
				border-radius: 0px;
				border-right-width:0px;
				border-left-width:0px;
				border-top-width:0px;
				/*width: 100%;
				min-width: 100%;*/
			}
		}
		@media (max-height: 500px) {
			.gongdong-div {
				max-height: calc(100vh - 128px);
			}
		}
		
		@media (max-width: 300px) {
			swaptox-chain-select {
				display: none;
			}
		}
		
		
		.null-data-body{
			display: flex;flex-direction: row;align-items: center;border-radius: 20px;height: 300px;
			max-height: calc(100vh - 211px);
			flex-direction: column;justify-content: center;
		}
		.null-get-data-text{
			user-select:none;
			font-family: var(--stxui-font-family);
			font-size: 14px;
			color: var(--stxui-dark-theme-subcolor, #999);
		}
		
		.data-get-modal-load{position: relative;}
		.data-get-modal-load::after {
			position: absolute;border-radius: 20px;
			top: 0; right: 0; bottom: 0; left: 0;
			background-image: var(--stxui-skeleton-background-load);
			background-size: 500% 500%;
			animation: trend-skeleton 1.8s ease infinite;
			content: '';
		}
		@keyframes trend-skeleton {
			0% {
				background-position: 100% 50%;
			}
			100% {
				background-position: 0 50%;
			}
		}
		
		.svg-filter-invert{
			filter: var(--stxui-no-swap-history-icon-filter-invert, 0%);
		}
		
		
		.error-css{
			position: absolute;
			top: 54px; right: 15px; bottom: 15px; left: 15px;
			z-index: 10;
			backdrop-filter: blur(12px) saturate(1.5);
			background-color: rgba(0, 0, 0, .12);
			display: flex;flex-direction: column;justify-content: center;align-items: center;
			border-radius: 10px;
			row-gap: 6px;
		}
		.com-load-text-ll22 {
			line-height: 28px;
			font-size: 14px;
			color: #e61a00;
		}
		
	`;
	
	

	render() {
		const $t = sdkStore.$t;
		
		//const transactions = Array.isArray(this.transactionsList)?[...this.transactionsList]:[];
		
		//const transactions = [...this.transactionsList];
		
		if(!this.transactionsList||this.transactionsList.length===0){
			if(!this.isModal){
				return null;
			}
		}
		
		
		
		
		const showPagination = this._total>this._pageSize?true:false;
		
		
		return html`
		
		
			<div @click=${(e)=>e.stopPropagation()} class="${this.isModal?'swaptox-transactions-record-modal':sdkStore.smallScreenCardFull?'swaptox-transactions-record swaptox-full':'swaptox-transactions-record'}" 
			style="padding: 12px 0px;padding-bottom: 15px;
			${this.isModal?'padding-top: 12px;':'padding-top: 10px;'}${this.styles}">
				
				
				<div class="card-header" style="padding: 0px 15px;">
					<span class="font-family transactions-card-title" style="font-size:17px;">${$t['swap-history']}</span>
					<div style="display: flex;align-items: center;justify-content: space-between;column-gap: 15px;">
						<swaptox-chain-select 
							frameWidth="${this.isModal?'-43px':'-15px'}"
							?isModal=${this.isModal}
							@selected-chain=${this._selectedChain}
						></swaptox-chain-select>
						
						${this.isModal?html`
							<com-icon-close @change="${this._onClose}" size="default"></com-icon-close>
						`:null}
						
					</div>
				</div>
				
				
				
				
				${this.transactionsList?.length>0?html`
					
					<div style="${this.isModal?'height:12px;':'height:10px;'}"></div>
					
					${this.isModal?html`
						<div class="transaction-fenge-window"></div>
					`:null}
					
					
					<div style="padding: 0px 15px;">
						<div class="transactions-list ${this.isModal?'gongdong-div':''}">
						
							${this.isModal?html`
								<div style="height:0px;"></div>
							`:null}
							
						
							${this.transactionsList.map(
								(item) => html`
									<stxcom-transactions-item
										.item=${item}
										?loading=${this.loading}
										?isModal=${this.isModal}
										@open-details=${()=>this._openDetails(item)}
									></stxcom-transactions-item>
								`
							)}
							
							${this.isModal?html`
								<div style="height:0px;"></div>
							`:null}
							
							
						</div>
					</div>
						
						
						
					${this.isModal?html`
						<div class="transaction-fenge-window"></div>
					`:null}
					
				
				
				
					${showPagination?html`
						<div style="padding: 0px 15px;padding-top: 15px;">
							<stxapp-pagination
								id="transactions-pagination"
								.total="${this._total}"
								.pageSize="${this._pageSize}"
								.currentPage="${this._currentPage}"
								max-visible="7"
								?isModal=${this.isModal}
								@change=${this.changePagination}
							></stxapp-pagination>
						</div>
					`:html`
						<div style="height:7px;"></div>
					`}
				
				`:html`
					<div style="padding: 15px;">
						<div class="null-data-body ${this.loading?'data-get-modal-load':''}">
							<svg t="1792467071093" class="svg-filter-invert" viewBox="0 0 1647 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="98631" width="100" height="100"><path d="M0 845.913043c0 98.348522 368.751304 178.086957 823.652174 178.086957s823.652174-79.738435 823.652174-178.086957-368.751304-178.086957-823.652174-178.086956-823.652174 79.738435-823.652174 178.086956z" fill="#F5F5F5" p-id="98632"></path><path d="M1402.434783 322.782609L1142.205217 31.833043C1129.71687 11.998609 1111.485217 0 1092.274087 0H532.769391c-19.21113 0-37.442783 11.998609-49.93113 31.788522L222.608696 322.80487V556.521739h1179.826087V322.782609z" fill="#FFFFFF" p-id="98633"></path><path d="M1092.274087 0c17.853217 0 34.816 10.351304 47.193043 27.692522l2.738087 4.140521L1402.434783 322.782609V556.521739H222.608696V322.80487L482.838261 31.788522c11.575652-18.387478 28.16-30.052174 45.83513-31.610435L532.769391 0h559.504696z m0 25.288348H532.769391c-8.43687 0-17.808696 5.476174-25.6 16.116869l-2.56 3.739826-2.537739 3.383653-253.818435 283.781565v198.92313h1128.537044V332.354783L1122.971826 48.573217l-2.56-3.383652c-7.43513-11.820522-16.695652-18.476522-25.288348-19.700869l-2.849391-0.200348z" fill="#DDDDDD" p-id="98634"></path><path d="M1059.08313 408.041739c0-40.581565 25.488696-74.106435 57.121392-74.128696H1402.434783v458.796522c0 53.715478-33.836522 97.725217-75.664696 97.725218H298.295652C256.445217 890.434783 222.608696 846.402783 222.608696 792.709565V333.913043h286.230261c31.610435 0 57.121391 33.458087 57.121391 74.061914v0.556521c0 40.603826 25.778087 73.394087 57.388522 73.394087h378.345739c31.610435 0 57.388522-33.079652 57.388521-73.683478v-0.178087z" fill="#FAFAFA" p-id="98635"></path><path d="M508.838957 333.913043c30.430609 0 55.140174 30.942609 57.032347 69.409392l0.089044 5.209043c0 40.603826 25.778087 73.394087 57.388522 73.394087h378.345739c30.408348 0 55.429565-30.608696 57.277217-69.053217l0.111304-4.808348c0-40.603826 25.488696-74.128696 57.121392-74.150957H1402.434783v458.796522c0 53.715478-33.836522 97.725217-75.664696 97.725218H298.295652C256.445217 890.434783 222.608696 846.402783 222.608696 792.709565V333.913043h286.230261zM248.253217 792.709565c0 39.468522 22.327652 69.89913 46.948174 72.281044l3.072 0.155826H1326.747826c24.776348 0 48.083478-28.872348 49.90887-67.539478l0.111304-4.897392V359.201391H1116.204522c-14.692174 0-29.696 18.543304-31.321044 44.254609l-0.155826 4.608c0 51.778783-33.28 96.189217-78.491826 98.994087l-4.541217 0.155826H623.34887c-45.946435 0-80.717913-42.496-82.92174-93.540174l-0.111304-5.698782c0-26.490435-14.180174-46.436174-28.872348-48.573218l-2.604521-0.200348H248.253217V792.709565z" fill="#bfbfbf" p-id="98636"></path></svg>
							<div class="null-get-data-text">
								${$t['no-swap-history']}
							</div>
						</div>
					</div>
				`}
				
				
				
				
				${this.isError?html`
					<div class="error-css">
						<div style="width:20px;height:20px;">
							<svg t="1753209663482" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="33954" width="20" height="20"><path d="M510 961a448.47 448.47 0 1 1 316.78-131.22A446.69 446.69 0 0 1 510 961z m0-836a388 388 0 1 0 274.36 662.36A388 388 0 0 0 510 125z" fill="#d81e06" p-id="33955"></path><path d="M370.7 682.3a30 30 0 0 1-21.21-51.21l278.6-278.6a30 30 0 0 1 42.42 42.42l-278.6 278.6a29.88 29.88 0 0 1-21.21 8.79z" fill="#d81e06" p-id="33956"></path><path d="M649.3 682.3a29.88 29.88 0 0 1-21.21-8.79l-278.6-278.6a30 30 0 0 1 42.42-42.42l278.6 278.6a30 30 0 0 1-21.21 51.21z" fill="#d81e06" p-id="33957"></path></svg>
						</div>
											
						<span class="com-load-text-ll22 font-family">${$t['loading-failed']}</span>
											
						<div style="height: 24px;max-height: 24px;">
							<stxapp-button @_click="${this._getTransactionsList}" class="font-family" 
							size="mini" type="warn">${$t['retry']}</stxapp-button>
						</div>
					</div>
				`:null}
				
				
			</div>
		`;
	}
	_selectedChain(e){
		this._chain = e.detail||'';
		this._resetList();
	}
	changePagination(e){
		this._currentPage = e.detail.page;
		this._getTransactionsList();
	}
	
	_openDetails(e){
		window.swaptox.widget.$el.swap.openTransactionDetails(e);
	}
	
	_onClose(){
		this.dispatchEvent(new CustomEvent('close-modal'));
	}
	
}

if (!customElements.get('swaptox-transactions-record')) {
	customElements.define('swaptox-transactions-record', StxappTransactionsRecord);
}