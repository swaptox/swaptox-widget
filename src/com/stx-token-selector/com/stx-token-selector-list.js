import {
	LitElement,
	html,
	css
} from 'lit';

import './com/stx-token-selector-header.js';
import './com/com-preset-top-token.js';
import './com/com-token-list-item.js';
import '../../../components/stxapp-load-state/stxapp-load-state.js';

import { getTokenList } from '../../../api/cloud/getTokenList.js';
import { tokenSinglePrice } from '../../../api/cloud/tokenSinglePrice.js';
import { batchQueryTokenBalance } from '../../../api/chain/batchQueryTokenBalance.js';
import { networkData } from '../../../data/network-data.js';

import { sdkStore } from '../../../data/store/store.js'; // 引入是为了读取数据
import { StoreMixin } from '../../../data/store/state-mixin.js';

/**
 * 数组分页函数
 * @param {Array} array 原始地址数组
 * @param {number} pageSize 每页显示的数量
 */
const paginateAddresses = (array, pageSize = 10) => {
    const uniqueList = [...new Set(array.map(addr => addr.toLowerCase()))];
    const result = [];
    for (let i = 0; i < uniqueList.length; i += pageSize) {
        result.push(uniqueList.slice(i, i + pageSize));
    }
    return result;
};

export class StxTokenSelectorList extends StoreMixin(LitElement) {
	static properties = {
		disabledMiniPriceCard: {
			type: Boolean
		},
		chain: { type: String },
		tokenList: { type: Array },
		keywordTokenList: { type: Array },
		collectAddresses: { type: Array },
		loadingState: { type: String },
		keywordLoadingState: { type: String },
		isCollect: { type: Boolean },
		setCollect: { type: Object },
		keyword: { type: String },
		wallet: { type: String },
		isopen: { type: Boolean },
	};

	constructor() {
		super();
		this.disabledMiniPriceCard = false;
		this.chain = '';
		this.page_id = 1;
		this.keywordPage_id = 1;
		this.page_size = 300;
		this.tokenList = [];
		this.keywordTokenList = [];
		this.loadingState = '';
		this.keywordLoadingState = '';
		this.isCollect = true;
		this.setCollect = {};
		this.keyword = '';
		this.wallet = '';
		//循环更新余额
		this.intervalID = setInterval(()=>{
			this._updateWalletBalance();
		}, 10000);
	}
	
	willUpdate(changedProperties) {
	    if (changedProperties.has('chain')) {
	        const oldChain = changedProperties.get('chain');
	        if (this.chain && this.chain !== oldChain) {
				//console.log(`chain:`, this.chain);
	            this.page_id = 1;
				this.tokenList = [];
				this.loadingState = '';
				//搜索
				this.keywordPage_id = 1;
				this.keywordLoadingState = '';
				this.keywordTokenList = [];
				this.getTokenList(this.chain);
	        }
	    }
		if (changedProperties.has('isopen')) {
			if(this.isopen===true){
				this._updateWalletBalance();
			}
		}
		if (changedProperties.has('wallet')) {
			//console.log(`wallet----`, this.wallet);
			this._updateWalletBalance();
		}
	}
	
	async getTokenList(network) {
		if (!network) return;
		if (this.keyword) return;
		if (['load', 'success', 'empty'].indexOf(this.loadingState) !== -1) {
			return;
		}
		const currentRequestSymbol = Symbol('request');
		this._lastRequest = currentRequestSymbol;
		this.loadingState = 'load';
		try {
			const pageSize = networkData[network].getTokenPageSize||this.page_size;
			const data = await getTokenList(network, {
				page: this.page_id,
				size: pageSize,
				onlyVerified: false,
				//keyword: '',
			});
			if (this._lastRequest !== currentRequestSymbol) return;
			let newData = this._walletBalance(network, data);
			this.tokenList = [...this.tokenList, ...newData];
			if (this.page_id === 1 && data.length === 0) {
				this.loadingState = 'empty';
			} else if (pageSize > data.length) {
				this.loadingState = 'success'; //console.log('全部币对', this.tokenList);
			} else {
				this.page_id++;
				this.loadingState = ''; //准备好加载下一页
			}
			this._updateChainTokenPrice(newData);
			this._getWalletBalance(newData, false);
		} catch (error) {
			if (this._lastRequest === currentRequestSymbol) {
				this.loadingState = 'error';
			}
		}
	}


	firstUpdated() {
	    const scrollContainer = this.shadowRoot.querySelector('.scroll-view-id1');
	    const trigger = this.shadowRoot.querySelector('#infinite-scroll-trigger1');
	    if (!trigger || !scrollContainer) return;
	    const options = {
	        root: scrollContainer,
	        rootMargin: '0px 0px 500px 0px',
	        threshold: 0
	    };
	    this._observer = new IntersectionObserver((entries) => {
	        if (entries[0].isIntersecting) {
				//console.log('加载');
	            this.getTokenList(this.chain);
	        }
	    }, options);
	    this._observer.observe(trigger);
	}
	
	// 别忘了在组件销毁时停止观察
	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._observer) {
			this._observer.disconnect();
		}
		if (this._keywordObserver) {
			this._keywordObserver.disconnect();
		}
		if (this.intervalID) {
			clearInterval(this.intervalID);
		}
	}

	
	
	_walletBalance(network, data) {
	    if (!this.wallet) {
	        return data.map(obj => ({ ...obj, load_balance: false, chain: network }));
	    }
	    const chainBalances = sdkStore.allBalance?.[network] || {};
	    return data.map(obj => {
	        const addr = obj.address.toLowerCase();
	        const isLoaded = addr in chainBalances;
	        return {
	            ...obj,
				chain: network,
	            load_balance: !isLoaded //如果没加载完，则为 true
	        };
	    });
	}
	
	
	async _getWalletBalance(data, isStr=false) {
	    if (!this.wallet || !data || data.length === 0) return;
		const addresses = isStr?data:data.map(t => t.address.toLowerCase());
		const balances = await batchQueryTokenBalance(this.chain, [addresses, this.wallet]);
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
		sdkStore.updateChainBalances(this.chain, updatePayload);
		//console.log(`[Balance Update] ${this.chain} updated:`, sdkStore.allBalance[this.chain]);
	}
	
	
	async _updateWalletBalance(){
		if (!this.wallet||!this.isopen) return;
		let address1 = this.tokenList.map(t => t.address.toLowerCase());
		let address2 = this.keywordTokenList.map(t => t.address.toLowerCase());
		if(address2.length){
			address1 = address1.concat(address2);
		}
		if (address1.length === 0) return;
		let newAdd = paginateAddresses(address1, networkData[this.chain].batchQueryTokenBalanceNum||300);
		//console.log(`allAddress`, newAdd);
		for(let i = 0; i < newAdd.length; i++){
			await this._getWalletBalance(newAdd[i], true);
		}
	}
	
	

	
	
	
	createKeywordObserver() {
	    const scrollContainer = this.shadowRoot.querySelector('.scroll-view-id2');
	    const trigger = this.shadowRoot.querySelector('#infinite-scroll-trigger2');
	    if (!trigger || !scrollContainer) return;
	    const options = {
	        root: scrollContainer,
	        rootMargin: '0px 0px 500px 0px',
	        threshold: 0
	    };
	    this._keywordObserver = new IntersectionObserver((entries) => {
	        if (entries[0].isIntersecting) {
				//console.log('加载');
	            this.getKeywordTokenList(this.chain);
	        }
	    }, options);
	    this._keywordObserver.observe(trigger);
	}
	
	_changeSearchInput(e){
		this.keyword = e.detail.value;
		this.keywordPage_id = 1;
		this.keywordLoadingState = '';
		this.keywordTokenList = [];
		this.getKeywordTokenList(this.chain);
		//console.log('搜索', this.keyword);
	}
	
	async getKeywordTokenList(network) {
		if (!network) return;
		if (!this.keyword) return;
		if (['load', 'success', 'empty'].indexOf(this.keywordLoadingState) !== -1) {
			return;
		}
		const currentRequestSymbol = Symbol('request');
		this._keywordLastRequest = currentRequestSymbol;
		this.keywordLoadingState = 'load';
		try {
			const pageSize = networkData[network].getTokenPageSize||this.page_size;
			const data = await getTokenList(network, {
				page: this.keywordPage_id,
				size: pageSize,
				onlyVerified: false,
				keyword: this.keyword,
			});
			if (this._keywordLastRequest !== currentRequestSymbol) return;
			
			if(!this._keywordObserver){//创建观察者
				this._keywordObserver = true;
				this.createKeywordObserver();
			}
			let newData = this._walletBalance(network, data);
			this.keywordTokenList = [...this.keywordTokenList, ...newData];
			if (this.keywordPage_id === 1 && data.length === 0) {
				this.keywordLoadingState = 'empty';
			} else if (pageSize > data.length) {
				this.keywordLoadingState = 'success';
			} else {
				this.keywordPage_id++;
				this.keywordLoadingState = '';
			}
			this._updateChainTokenPrice(newData);
			this._getWalletBalance(newData, false);
		} catch (error) {
			if (this._keywordLastRequest === currentRequestSymbol) {
				this.keywordLoadingState = 'error';
			}
		}
	}
	
	
	
	
	_updateChainTokenPrice(data){
		const priceObj = {};
		for(let i = 0; i < data.length; i++){
			if(!data[i].usd_sell) continue;
			priceObj[data[i].address.toLowerCase()] = data[i].usd_sell;
		}//console.log('_updateChainTokenPrice', priceObj);
		sdkStore.updateChainTokenPrice(this.chain, priceObj);
	}
	
	
	
	
	
	static styles = css`
		:host {
			display: block;
		}
		
		.token-list-border-top{
			border-top-style:solid;
			border-top-width:1px; 
			border-top-color:var(--stxui-card-line-color, #ececec);
		}
		.token-list-body-height{
			height: 58vh;
			overflow-y: auto;
			max-height: calc(100vh - 211px);
			/* 1. 针对 Chrome, Safari, Edge (WebKit 内核) */
			&::-webkit-scrollbar {
			    display: none;
			}
			/* 2. 针对 Firefox */
			scrollbar-width: none;
			/* 3. 针对 IE/Edge (旧版) */
			-ms-overflow-style: none;
		}
		@media (max-width: 520px) {
			.token-list-body-height {
				height: calc(100vh - 211px);
				max-height: 520px;
			}
		}		
		@media (max-height: 700px) {
			.token-list-body-height {
				height: calc(100vh - 211px);
				max-height: calc(100vh - 211px);
			}
		}
		@media (max-height: 500px) {
			.token-list-body-height {
				height: calc(100vh - 58px);
				max-height: calc(100vh - 58px);
			}
		}

		
		
		
		.app-load-state-body{
			padding: 10px 0;
		}
		.scroll-view-id1{}
		.scroll-view-id2{position: relative;}
		.sousuo-body {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 1;
		}
	`;
	

	render() {
		const $t = sdkStore.$t;
		return html`
		<div @click="${this._stop}">
			<stx-token-selector-header 
				placeholder="${$t['search-name-or-address']}"
				clearinput="${$t['clear-input']}"
				@close="${this._handleClose}"
				@search-input="${this._changeSearchInput}"
			></stx-token-selector-header>
			<com-preset-top-token 
				.chain="${this.chain}"
				.setcollect="${this.setCollect}"
				@collect-change="${(e)=>{this.isCollect = e.detail.visible;}}"
				@collect-addresses="${(e)=>{this.collectAddresses = e.detail.addresses;}}"
				@select-token="${this._selectToken}"
			></com-preset-top-token>
			<div class="token-list-border-top">
				
				
				
				<div class="token-list-body-height scroll-view-id1" 
				style="display:${this.keyword?'none':'block'};">
					${this.tokenList.map(token => html`
						<com-token-list-item 
							?disabledMiniPriceCard=${this.disabledMiniPriceCard}
							.wallet="${this.wallet}"
							.options="${token}"
							.iscollect="${this.isCollect}"
							.collectaddresses="${this.collectAddresses}"
							@set-collect="${(e)=>{this.setCollect = e.detail;}}"
							@select-token="${this._selectToken}"
							@open-token-info="${this._openTokenInfo}"
						></com-token-list-item>
					`)}
					<div id="infinite-scroll-trigger1" style="height:1px;"></div>
					<div class="app-load-state-body">
						<stxapp-load-state .state="${this.loadingState}" 
						@retry="${()=>{this.getTokenList(this.chain)}}"></stxapp-load-state>
					</div>
				</div>
				
				
				
				
				<div class="token-list-body-height scroll-view-id2"
				style="display:${this.keyword?'block':'none'};">
					
					${this.keywordTokenList.map(token => html`
						<com-token-list-item 
							?disabledMiniPriceCard=${this.disabledMiniPriceCard}
							.wallet="${this.wallet}"
							.keyword="${this.keyword}"
							.options="${token}"
							.iscollect="${this.isCollect}"
							.collectaddresses="${this.collectAddresses}"
							@set-collect="${(e)=>{this.setCollect = e.detail;}}"
							@select-token="${this._selectToken}"
							@open-token-info="${this._openTokenInfo}"
						></com-token-list-item>
					`)}
					
					<div id="infinite-scroll-trigger2" style="height:1px;"></div>
					<div style="opacity:${this.keywordTokenList.length===0&&this.keywordLoadingState==='load'?'0':'1'};" class="app-load-state-body">
						<stxapp-load-state .state="${this.keywordLoadingState}" 
						@retry="${()=>{this.getKeywordTokenList(this.chain)}}"></stxapp-load-state>
					</div>
					
					
					
					${this.keywordTokenList.length===0&&this.keywordLoadingState==='load'?html`
						<div class="sousuo-body">
							<div style="width: 80px;height: 80px;">
								<svg width="80px" height="80px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
									preserveAspectRatio="xMidYMid" class="lds-magnify">
									<g transform="translate(50,50)">
										<g ng-attr-transform="scale(40)" transform="scale(0.82)">
											<g transform="translate(-50,-50)">
												<g transform="translate(16.3636 -20)">
													<animateTransform attributeName="transform" type="translate" calcMode="linear"
														values="-20 -20;20 -20;0 20;-20 -20" keyTimes="0;0.33;0.66;1" dur="1s"
														begin="0s" repeatCount="indefinite"></animateTransform>
													<path 
														d="M44.19,26.158c-4.817,0-9.345,1.876-12.751,5.282c-3.406,3.406-5.282,7.934-5.282,12.751 c0,4.817,1.876,9.345,5.282,12.751c3.406,3.406,7.934,5.282,12.751,5.282s9.345-1.876,12.751-5.282 c3.406-3.406,5.282-7.934,5.282-12.751c0-4.817-1.876-9.345-5.282-12.751C53.536,28.033,49.007,26.158,44.19,26.158z"
														fill="#c0efff"></path>
													<path 
														d="M78.712,72.492L67.593,61.373l-3.475-3.475c1.621-2.352,2.779-4.926,3.475-7.596c1.044-4.008,1.044-8.23,0-12.238 c-1.048-4.022-3.146-7.827-6.297-10.979C56.572,22.362,50.381,20,44.19,20C38,20,31.809,22.362,27.085,27.085 c-9.447,9.447-9.447,24.763,0,34.21C31.809,66.019,38,68.381,44.19,68.381c4.798,0,9.593-1.425,13.708-4.262l9.695,9.695 l4.899,4.899C73.351,79.571,74.476,80,75.602,80s2.251-0.429,3.11-1.288C80.429,76.994,80.429,74.209,78.712,72.492z M56.942,56.942 c-3.406,3.406-7.934,5.282-12.751,5.282s-9.345-1.876-12.751-5.282c-3.406-3.406-5.282-7.934-5.282-12.751 c0-4.817,1.876-9.345,5.282-12.751c3.406-3.406,7.934-5.282,12.751-5.282c4.817,0,9.345,1.876,12.751,5.282 c3.406,3.406,5.282,7.934,5.282,12.751C62.223,49.007,60.347,53.536,56.942,56.942z"
														fill="#02b6a6"></path>
												</g>
											</g>
										</g>
									</g>
								</svg>
							</div>
						</div>
					`:``}
					
					
					
				</div>
				
				
				
			</div>
		</div>
    `;
	}
	
	_openTokenInfo(e){
		this.dispatchEvent(new CustomEvent('open-token-info', {
			detail: e.detail,
			bubbles: false,
			composed: false
		}));
	}
	
	_selectToken(e) {
		this.dispatchEvent(new CustomEvent('select-token', {
			detail: e.detail,
			bubbles: false,
			composed: false
		}));
		//console.log('选择代币', e.detail);
		this.addressToTokenList(e.detail.chain, e.detail.address);
	}
	async addressToTokenList(network, address) {
		try {
			const data = await tokenSinglePrice(network, address);
			if(data&&data.usd_sell){
				sdkStore.updateChainTokenPrice(network, {
					[address.toLowerCase()]: data.usd_sell
				});//console.log('最新价格', data);
			}
		} catch (error) {}
	}
	
	
	
	_handleClose(e) {
		this.dispatchEvent(new CustomEvent('close'));
	}
	
	_stop(e) {
		if (e.stopPropagation) {e.stopPropagation();}
		if (e.preventDefault) {e.preventDefault();}
	}
	
	
}

if (!customElements.get('stx-token-selector-list')) {
	customElements.define('stx-token-selector-list', StxTokenSelectorList);
}
