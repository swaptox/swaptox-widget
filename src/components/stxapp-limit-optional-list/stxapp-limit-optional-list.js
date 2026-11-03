import {
	LitElement,
	html,
	css
} from 'lit';

import { sdkStore } from '../../data/store/store.js';
import { StoreMixin } from '../../data/store/state-mixin.js';
import { cardInfo } from './stxapp-limit-optional-list-config.js';
import { networkData } from '../../data/network-data.js';
import { batchQueryTokenBalance } from '../../api/chain/batchQueryTokenBalance.js';
import { viemUtils } from '../../js_sdk/viem/utils.js';
import { $app } from '../../js_sdk/index.js';

import './stxapp-limit-optional-list-modal';
import '../../com/stx-token-logo.js';
import '../../com/stx-token-selector/com/com/balance/com-token-list-balance.js';

const paginateAddresses = (array, pageSize = 10) => {
    const uniqueList = [...new Set(array.map(addr => addr.toLowerCase()))];
    const result = [];
    for (let i = 0; i < uniqueList.length; i += pageSize) {
        result.push(uniqueList.slice(i, i + pageSize));
    }
    return result;
};

export class StxappLimitOptionalList extends StoreMixin(LitElement) {
	static properties = {
		openModal: {
			type: Boolean
		},
		tokenList: {
			type: Array
		},
		wallet: { type: String },
	};

	constructor() {
		super();
		this.openModal = false;

		this._styles = '';
		this.wallet = '';
		this.tokenList = [];
		this._handleModalClose = this._handleModalClose.bind(this);
		this._loadBalance = -1;
		//循环更新余额
		this.intervalID = setInterval(()=>{
			this._updateWalletBalance();
		}, 10000);
	}
	
	
	
	async _updateWalletBalance(){
		if (!this.wallet||!this.openModal) return;
		let address1 = this.tokenList.map(t => t.address.toLowerCase());
		if (address1.length === 0) return;
		let newAdd = paginateAddresses(address1, networkData[sdkStore?.chain].batchQueryTokenBalanceNum||300);
		for(let i = 0; i < newAdd.length; i++){
			await this._getWalletBalance(newAdd[i], true);
		}
	}
	
	
	async _getWalletBalance(data, isStr=false) {
	    if (!this.wallet || !data || data.length === 0) return;
		if(this._loadBalance===-1){
			this._loadBalance = 1;
		}
		const addresses = isStr?data:data.map(t => t.address.toLowerCase());
		const balances = await batchQueryTokenBalance(sdkStore?.chain, [addresses, this.wallet]);
		const updatePayload = {};
		if (!balances || balances.length === 0){
			for (let i = 0; i < addresses.length; i++) {
				updatePayload[addresses[i]] = 0n;
			}
		}else{
			for (let i = 0; i < addresses.length; i++) {
				updatePayload[addresses[i]] = balances[i];
			}
		}
		this._loadBalance = 0;
		sdkStore.updateChainBalances(sdkStore?.chain, updatePayload);
	}
	
	
	willUpdate(changedProperties) {
		if (changedProperties.has('wallet')) {
			if(!this.wallet){
				this._loadBalance = -1;
			}
			this._updateWalletBalance();
		}
	}

	static styles = css`
		:host {
			display: block;
		}

		.font-family {
			user-select: none;
			font-family: var(--stxui-font-family);
		}

		.token-name-text {
			font-size: 16px;
			color: var(--stxui-theme-font-color, #111);
		}

		.com2-token-list-item {
			position: relative;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			padding: 8px 15px 8px 12px;
			column-gap: 8px;
			min-width: 0;
		}

		.com2-token-list-item:hover {
			background-color: var(--stxui-list-item-bg-hover, #f7f8f9);
		}

		/*
		 * 列表自身滚动：
		 * 1. 允许纵向滚动
		 * 2. 阻止滚动链传递到外部页面
		 * 3. 隐藏滚动条
		 */
		.list-webkit-scrollbar-body {
			position: relative;
			overflow-x: hidden;
			overflow-y: auto;
			border: none;
			outline: none;
			min-width: 0;

			overscroll-behavior-y: contain;
			-webkit-overflow-scrolling: touch;
			touch-action: pan-y;
			scrollbar-width: none;
			-ms-overflow-style: none;
		}

		.list-webkit-scrollbar-body::-webkit-scrollbar {
			display: none;
		}

		/*
		 * 手机端遮罩。
		 * 遮罩位于弹窗下方，避免拦截弹窗内的交互。
		 */
		.shouji-mask-background {
			position: fixed;
			inset: 0;
			z-index: 9998;

			background-color: #326bfb20;

			pointer-events: auto;
			touch-action: none;
			user-select: none;
			-webkit-user-select: none;
		}
	`;

	_itemRender(item) {
		const bal = sdkStore.allBalance?.[sdkStore?.chain]?.[item.address];
		let balance_up = '0';
		let dungeon;
		if(bal||bal===0n){
			const balNum = viemUtils.formatUnits(bal, item.decimals);
			balance_up = $app.formatBalance(balNum);
			dungeon = Object.assign({}, item, {
				balance: bal,
				balance_format: balNum,
				balance_up: balance_up,
				load_balance: false,
			});
		}else{
			dungeon = Object.assign({}, item);
		}
		return html`
			<div class="com2-token-list-item" @click=${()=>{this._selectToken(dungeon)}} >
				<div style="display:flex;flex-direction:row;align-items:center;column-gap:5px;">
					<stx-token-logo
						size="24px"
						.symbol="${item.symbol}"
						.logo="${item.logourl}"
					></stx-token-logo>
					<div class="font-family token-name-text">${item.symbol}</div>
				</div>

				<com-token-list-balance
					?load="${this._loadBalance===1&&!bal?true:false}"
					.balance="${this.wallet ? balance_up : ''}"
				></com-token-list-balance>
			</div>
		`;
	}
	
	
	_getTokenList(){
		const addrs = sdkStore?.limitOptionalToken?.[sdkStore?.chain]?.limitOptionalList ?? [];
		const addrObj = {};
		for(let i = 0; i < addrs.length; i++){
			addrObj[addrs[i].toLowerCase()] = true;
		}
		const tokenList = [];
		const cached = window.swaptox?.tokens?.[sdkStore?.chain];
		if (cached&&Array.isArray(cached)) {
			for(let i = 0; i < cached.length; i++){
				if(addrObj[cached[i].address]){
					tokenList.push(cached[i]);
				}
			}
		}
		this.tokenList = [...tokenList];
	}
	
	
	
	

	render() {
		if(this.tokenList.length===0){
			this._getTokenList();
		}
		return html`
			<stxapp-limit-optional-list-modal
				.styles="transform-origin: right top;${this._styles}border-radius:16px;box-shadow:0px 15px 50px -12px rgba(0, 0, 0, 0.35);"
				?open=${this.openModal}
				@close=${this._handleModalClose}
			>
				<div
					class="list-webkit-scrollbar-body"
					style="width:${cardInfo.width}px;max-height:${cardInfo.height}px;min-height:${cardInfo.minHeight}px;"
					@wheel=${this._stopPropagation}
					@touchmove=${this._stopPropagation}
					@scroll=${this._stopPropagation}
					@pointerdown=${this._stopPropagation}
					@mousedown=${this._stopPropagation}
					@touchstart=${this._stopPropagation}
				>
					${this.tokenList.map((item) => this._itemRender(item))}
				</div>
			</stxapp-limit-optional-list-modal>
		`;
	}


	/**
	 * 子弹窗主动关闭时，同步父组件状态。
	 */
	_handleModalClose(event) {
		if(event.stopPropagation){event.stopPropagation();}
		this._closeModal();
	}

	_closeModal() {
		if (!this.openModal) return;
		this.openModal = false;
	}

	_stopPropagation(event) {
		event.stopPropagation();
	}

	open(infos = {}) {
		this._styles = `top:${infos.top ?? 0}px;left:${infos.left ?? 0}px;`;
		this.openModal = true;
		this._updateWalletBalance();
	}
	
	_selectToken(e) {
		this._closeModal();
		this.dispatchEvent(new CustomEvent('select-token', {
			detail: e,
			bubbles: false,
			composed: false
		}));
	}
}

if (!customElements.get('stxapp-limit-optional-list')) {
	customElements.define(
		'stxapp-limit-optional-list',
		StxappLimitOptionalList
	);
}