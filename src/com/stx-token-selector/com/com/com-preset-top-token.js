import {
	LitElement,
	html,
	css
} from 'lit';

import '../../../stx-token-logo.js';
import { getPresetTokenList } from '../../../../api/local/getPresetTokenList.js';
import { $app } from '../../../../js_sdk/index.js';
import { sdkStore } from '../../../../data/store/store.js';
import { StoreMixin } from '../../../../data/store/state-mixin.js';
import { getTokenList } from '../../../../api/cloud/getTokenList.js';

export class ComPresetTopToken extends StoreMixin(LitElement) {
	static get properties() {
		return {
			chain: { type: String },
			tokens: {
				type: Array,
			},
			isTouchDevice: {
				type: Boolean
			},
			setcollect: {
				type: Object
			},
		};
	}

	constructor() {
		super();
		this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		this.chain = '';
		this.tokens = [];
		this.setcollect = {};
	}
	
	willUpdate(changedProperties) {
	    if (changedProperties.has('chain')) {
	        const oldChain = changedProperties.get('chain');
	        if (this.chain && this.chain !== oldChain) {
				this._initialize();
	        }
	    }
	}
	
	
	_initialize(){
		this._presetId = this.chain+'-preset-tokens';
		const toList = getPresetTokenList(this.chain, this._presetId);
		this.tokens = this._setDataChain(this.chain, toList);
		this._changeCollectAddress();
		this._updateNewTokenList();
	}
	


	// 当 DOM 渲染完成后启动监听
	firstUpdated() {
		this._initObserver();
	}

    updated(changedProperties) {
        if (changedProperties.has('tokens')) {
            // tokens 改变后，DOM 可能变动，IntersectionObserver 会自动处理
        }
		if (changedProperties.has('setcollect')) {
		    if(this.setcollect?.data){
				if(this.setcollect.collect){
					this._addToken(this.setcollect.data);
				}else{
					this._deleteToken(this.setcollect.data.address);
				}
			}
		}
    }

	_initObserver() {
		const container = this.shadowRoot.querySelector('.com-preset-top-token');
		const sentinel = this.shadowRoot.getElementById('surveillance-hiding');
		if (!container || !sentinel) return;
		const options = {
			root: container, 	// 关键：以这个限高的容器作为视口
			threshold: 1   		// 只要有 100% 露出来就认为是可见的
		};
		this._observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				this.dispatchEvent(new CustomEvent('collect-change', {
					detail: { visible: entry.isIntersecting },
					bubbles: true,
					composed: true
				}));
			});
		}, options);
		this._observer.observe(sentinel);
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._observer) this._observer.disconnect();
	}









	static get styles() {
		return css`
		:host {
			display: block;
		}
		.com-preset-top-token{
			position: relative;
			top: -10px;
			z-index: 1;
			display: flex;
			flex-direction: row;
			align-items: center;
			flex-wrap: wrap;
			column-gap: 9px;
			row-gap: 9px;
			height: 82px;
			overflow: hidden;
			padding-left: 15px;
			padding-right: 6px;
			padding-top: 10px;
		}
		
		
		@media (max-height: 500px) {
			.com-preset-top-token {
				display: none;
			}
		}
		
		
		
		
		.token-card-select{
			position: relative;
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 0px 7px;
			padding-right: 10px;
			column-gap: 5px;
			border-radius: 100px;
			border: 1px solid var(--stxui-card-line-color, #ececec);
			background-color: var(--stxui-modal-background-color, #fff);
			height: 32px;
			transition:
				border 0.2s ease-in-out,
				opacity 0.2s ease-in-out,
				box-shadow 0.2s ease-in-out,
				background-color 0.2s ease-in-out;
		}
		.token-card-select:hover {
		    border: 1px solid var(--stxui-theme-focus-color, #02b6a680);
		    background-color: var(--stxui-list-item-bg-hover, #fbfbfb);
		    box-shadow: 0 0 0 1px var(--stxui-theme-focus-color, #02b6a680);
		}
		.token-card-select:active {
		    opacity: 0.8;
		    background-color: var(--stxui-list-item-bg-hover, #fbfbfb);
		}
		
		
		
		
		.token-name-text{
			user-select: none;
			font-size: 15px;
			white-space: nowrap;
			color: var(--stxui-theme-font-color, #111);
			font-family: var(--stxui-font-family);
		}
		
		
		
		
		.delete-token-ion{
			position: absolute;
			z-index: 1;
			top: -6px;
			right: -7px;
			display: none;
			width: 16px;
			height: 16px;
			background-color: var(--stxui-modal-background-color, #fff);
			border: 1px solid var(--stxui-delete-tag-border-color, #ffadad);
			border-radius: 20px;
			align-items: center;justify-content: center;
			cursor: pointer;
			transition:
				border 0.2s ease-in-out,
				opacity 0.2s ease-in-out,
				background-color 0.2s ease-in-out;
		}
		.delete-token-ion:hover{
			background-color: var(--stxui-delete-tag-hover, #ffe6e63a);
			border: 1px solid var(--stxui-delete-tag-border-color-hover, #ff000e);
		}
		.delete-token-ion:active {
		    opacity: 0.8;
		}
		
		
		
		
		
		.token-card-body{
			position: relative;
			border-radius: 100px;
		}
		.token-card-body:hover > .delete-token-ion{
			display: flex;
		}
		
		
		
		@media (max-width: 520px) {
			.delete-token-ion{
				display: none;
			}
			.token-card-body:hover > .delete-token-ion{
				display: none;
			}
		}
		
		.empty-data-placeholder{
			position: absolute;
			z-index: 1;
			top: 10px;
			left: 15px;
			right: 15px;
			bottom: 5px;
			display: flex;align-items: center;justify-content: center;
			column-gap: 2px;
			border-radius: 16px;
			border: 2px dashed var(--stxui-card-dashed-border-color, #e5e5e5);
			background-color: var(--stxui-card-dashed-background-color, #fbfbfb);
		}
    `;
	}

	render() {
		const $t = sdkStore.$t;
		return html`
		<div class="com-preset-top-token">
		
			
			${this.tokens.map(item => html`
				<div class="token-card-body">
					<div @click="${() => this._selectToken(item)}" class="token-card-select">
						
						<stx-token-logo 
							size="22px"
							symbol="${item.symbol}" 
							logo="${item.logourl}"
						></stx-token-logo>
						
						<span class="token-name-text"
						>${item.symbol.length<=item.name.length?item.symbol:item.name}</span>
						
					</div>
					
					${this.isTouchDevice?``:html`
						<div @click="${() => this._deleteToken(item.address)}" 
						class="delete-token-ion">
							<svg t="1770604220648" class="icon" viewBox="0 0 1064 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16033" width="8" height="8"><path d="M102.874584 14.806783m28.963094 28.963094l868.892813 868.892813q28.963094 28.963094 0 57.926187l0 0q-28.963094 28.963094-57.926188 0l-868.892812-868.892812q-28.963094-28.963094 0-57.926188l0 0q28.963094-28.963094 57.926187 0Z" 
							fill="#ff000e" p-id="16034"></path>
							<path d="M33.363159 953.211021m28.963094-28.963094l868.892813-868.892812q28.963094-28.963094 57.926187 0l0 0q28.963094 28.963094 0 57.926187l-868.892812 868.892813q-28.963094 28.963094-57.926188 0l0 0q-28.963094-28.963094 0-57.926188Z" 
							fill="#ff000e" p-id="16035"></path></svg>
						</div>
					`}
					
				</div>
			`)}
			
			
			${this.tokens.length>0?``:html`
				<div class="empty-data-placeholder">
				<!--
					<span class="token-name-text" 
					style="font-size:16px;color: var(--dapp-theme-font-color, #999);"
					>点击</span>
					<svg xmlns="http://www.w3.org/2000/svg" id="pin" width="22" height="22" viewBox="0 0 16 16" fill="none">
						<path
							d="M12.1087 5.77047L9.75171 8.12749C9.22374 8.65546 8.9079 9.32014 8.8089 10.0131L5.98048 7.18468C6.6923 7.08569 7.34755 6.76042 7.8661 6.24187L10.2231 3.88485L12.1087 5.77047ZM14.4658 6.24187L9.75171 1.52783C9.49244 1.26856 9.06818 1.26856 8.8089 1.52783C8.54963 1.7871 8.54963 2.21136 8.8089 2.47064L9.28031 2.94204L6.92329 5.29906C6.25341 5.96894 5.23119 6.06538 4.45986 5.58838C4.24066 5.45282 3.94712 5.4468 3.76488 5.62905L3.62345 5.77047C3.36311 6.03082 3.36311 6.45293 3.62345 6.71328L5.96634 9.05616L2.6665 12.356V13.2988H3.60931L6.90914 9.99897L9.28031 12.3701C9.54066 12.6305 9.96277 12.6305 10.2231 12.3701L10.3645 12.2287C10.5468 12.0465 10.5408 11.7529 10.4052 11.5337C9.92821 10.7624 10.0246 9.74017 10.6945 9.0703L13.0515 6.71328L13.5229 7.18468C13.7822 7.44395 14.2065 7.44395 14.4658 7.18468C14.725 6.92541 14.725 6.50115 14.4658 6.24187Z"
							fill="#999999" />
					</svg>
					<span class="token-name-text" 
					style="font-size:16px;color: var(--dapp-theme-font-color, #999);"
					>置顶代币</span>
				-->
					
					<span class="token-name-text"
					style="font-size:16px;color: var(--dapp-theme-font-color, #999);"
					>${$t['click-fix-token']}</span>
					
				</div>
			`}
			
			
			
			<div id="surveillance-hiding" 
			style="width:100px;height:32px;border: 1px solid transparent;"></div>
			<div style="width:480px;height:32px;border: 1px solid transparent;"></div>
			<div style="width:480px;height:32px;border: 1px solid transparent;"></div>
			
			
		</div>
    `;
	}
	
	_deleteToken(address) {
	    if (!address) return;
	    this.tokens = this.tokens.filter(t => t.address.toLowerCase() !== address.toLowerCase());
	    $app.setStorageSync(this._presetId, this.tokens);
		this._changeCollectAddress();
	}
	_addToken(newToken) {
	    this.tokens = [...this.tokens, newToken];
	    $app.setStorageSync(this._presetId, this.tokens);
		this._changeCollectAddress();
	}
	
	
	_changeCollectAddress() {
		const addresses = this.tokens.map(t => t.address.toLowerCase());
		this.dispatchEvent(new CustomEvent('collect-addresses', {
			detail: { 'addresses': addresses },
			bubbles: true,
			composed: true
		}));
	}
	
	async _updateNewTokenList() {
		try {
			const addresses = this.tokens.map(t => t.address.toLowerCase());
			if(addresses.length===0){return;}
			const data = await getTokenList(this.chain, {
				'address': addresses.join(',')
			});
			if(data.length===0){return;}
			const dataObj = {};
			for(let i = 0; i < data.length; i++){
				dataObj[data[i].address.toLowerCase()] = data[i];
			}
			const dataArr = [];
			for(let i = 0; i < addresses.length; i++){
				let refAdds = addresses[i].toLowerCase();
				if(dataObj[refAdds]){
					dataArr.push(dataObj[refAdds]);
				}
			}
			$app.setStorageSync(this._presetId, this._setDataChain(this.chain, dataArr));
			this._updateChainTokenPrice(data);
		} catch (error) {}
	}
	_updateChainTokenPrice(data){
		const priceObj = {};
		for(let i = 0; i < data.length; i++){
			priceObj[data[i].address.toLowerCase()] = data[i].usd_sell;
		}
		sdkStore.updateChainTokenPrice(this.chain, priceObj);
	}
	_setDataChain(network, data) {
	    return data.map(obj => {
	        return {...obj, chain: network};
	    });
	}
	
	

	_selectToken(e) {
		//console.log('选择', e);
		this.dispatchEvent(new CustomEvent('select-token', {
			detail: e,
			bubbles: false,
			composed: false
		}));
	}

}
if (!customElements.get('com-preset-top-token')) {
	customElements.define('com-preset-top-token', ComPresetTopToken);
}
