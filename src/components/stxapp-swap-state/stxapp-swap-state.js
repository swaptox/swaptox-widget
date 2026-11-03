

import {
	LitElement,
	html,
	css
} from 'lit';

import { sdkStore } from '../../data/store/store.js';
import { StoreMixin } from '../../data/store/state-mixin.js';

import { allTokens } from '../../api/cloud/getTokenList.js';
import './stxapp-swap-state-item.js';

export class StxappSwapState extends StoreMixin(LitElement) {
	static properties = {
		chain: {type: String},
		itemArr: {type: Array},
		isShowChainLogo: {type: Boolean},
	};
	constructor() {
		super();
		this.itemArr = [];
		this.chain = '';
		
		this._tokenObj = {};
	}
	
	
	willUpdate(changedProperties) {
	    if (changedProperties.has('chain')) {
	        const oldChain = changedProperties.get('chain');
	        if (this.chain && this.chain !== oldChain) {
				this._IsShowChainLogo(this.itemArr);
	        }
	    }
	}
	
	


	static styles = css`
		:host {
			display: block;
		}
		.huadong-bdoy{
			overflow-y: auto;
			scroll-behavior: smooth;
			position: relative;
			border: none;
			outline: none;
			/* 1. 针对 Chrome, Safari, Edge (WebKit 内核) */
			&::-webkit-scrollbar {
			    display: none;
			}
			/* 2. 针对 Firefox */
			scrollbar-width: none;
			/* 3. 针对 IE/Edge (旧版) */
			-ms-overflow-style: none;
		}
	`;
	
	
	firstUpdated() {
	    const scrollContainer = this.shadowRoot.querySelector('.huadong-bdoy');
	    const trigger = this.shadowRoot.querySelector('#swap-state-scroll-trigger');
	    if (!trigger || !scrollContainer) return;
	    const options = {
	        root: scrollContainer,
	        rootMargin: '1px 0px 0px 0px',
	        threshold: 0
	    };
	    this._observer = new IntersectionObserver((entries) => {
			//return;
	        if (entries[0].isIntersecting) {
				this.dispatchEvent(new CustomEvent('hide-nav-top-true'));
	        }else{
				this.dispatchEvent(new CustomEvent('hide-nav-top-false'));
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
	}
	

	render() {
		return html`
			<div class="huadong-bdoy" style="padding: 0 12px;max-height: 160px;">
				<div id="swap-state-scroll-trigger" style="height:1px;"></div>
				
				<div style="display: flex;flex-direction: column-reverse;">
					${this.itemArr.map(obj => html`
						<stxapp-swap-state-item
							.itemData=${obj}
							?isShowChainLogo=${this.isShowChainLogo}
							@state-change=${(e)=>this._stateChange(obj, e.detail)}
						></stxapp-swap-state-item>
					`)}
				</div>
				
				<div style="height:${this.itemArr.length===0?'0px':'6px'};"></div>
			</div>
		`;
	}
	
	
	
	_IsShowChainLogo(itemArr){
		if(this.isShowChainLogo) return;
		if(itemArr.length===0) return;
		const lNum = {};
		const lArr = [];
		for(let i = 0; i < itemArr.length; i++){
			if(!lNum[itemArr[i].chain]){
				lNum[itemArr[i].chain] = true;
				lArr.push(itemArr[i].chain);
			}
		}
		if(lArr.length>=2){
			this.isShowChainLogo = true;
		}else if(lArr[0].toLowerCase() !== this.chain.toLowerCase()){
			this.isShowChainLogo = true;
		}else{
			this.isShowChainLogo = false;
		}
	}
	
	
	
	async _getTokenObj(chain){
		if(this._tokenObj[chain]){
			return this._tokenObj[chain];
		}
		const cached = await allTokens(chain);
		if (cached&&Array.isArray(cached)) {
			const tObj = {};
			for(let i = 0; i < cached.length; i++){
				tObj[cached[i].address.toLowerCase()] = cached[i];
			}
			this._tokenObj[chain] = tObj;
			return this._tokenObj[chain];
		}else{
			return {};
		}
	}
	
	
	async _push(e){
		const tokenInObj = await this._getTokenObj(e.chainin);
		const tokenOutObj = await this._getTokenObj(e.chainout);
		
		const newObj = {
			...e,
			chain: e.type==='bridge'?e.chainout:e.chainin,
			symbolIn: tokenInObj?.[e.tokenin]?.symbol,
			logoIn: tokenInObj?.[e.tokenin]?.logourl,
			symbolOut: tokenOutObj?.[e.tokenout]?.symbol,
			logoOut: tokenOutObj?.[e.tokenout]?.logourl,
		};
		
		const itemArr = [...this.itemArr, ...[newObj]];
		this._IsShowChainLogo(itemArr);
		this.itemArr = itemArr;
		setTimeout(()=>{//滚动到顶部
			const element = this.renderRoot.querySelector('.huadong-bdoy');
			element.scrollTop = 0;
		}, 30);
		
		sdkStore.updateSwapHash(e.chainin, e.hash, 'pending');
	}
	
	_stateChange(e, state){
		sdkStore.updateSwapHash(e.chainin, e.hash, state);
	}
	
}

if (!customElements.get('stxapp-swap-state')) {
	customElements.define('stxapp-swap-state', StxappSwapState);
}