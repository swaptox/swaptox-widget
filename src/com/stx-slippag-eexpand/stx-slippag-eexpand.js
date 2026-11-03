import {
	LitElement,
	html,
	css
} from 'lit';

import '../../icon/com-icon-to.js';
import '../stx-slippag-set/stx-slippag-set.js';

import { sdkStore } from '../../data/store/store.js';
import { StoreMixin } from '../../data/store/state-mixin.js';

export class StxSlippagEexpand extends StoreMixin(LitElement) {
	static get properties() {
		return {
			openSetSlippag: {
				type: Boolean
			},
			slippagObj: {
				type: Object
			},
		};
	}
	
	constructor() {
		super();
		this.openSetSlippag = false;
		this.slippagObj = {};
	}
	
	
	static styles = css`
		:host {
			display: block;
			height: 39px;
		}
		.stx-slippag-eexpand{
			background-color: var(--stxui-theme-content-background-color, #fbfbfb);
			padding: 0px 15px;
			border-radius: 15px;
			height: 39px;
			border: 1px solid var(--stxui-theme-border-color, #eee);
			display: flex;flex-direction: row;align-items: center;justify-content: space-between;
			transition: 
			    border 0.2s ease-in-out,
			    box-shadow 0.2s ease-in-out;
			cursor: pointer;
		}
		.stx-slippag-eexpand:hover {
			border: 1px solid var(--stxui-theme-focus-color, #02b6a680);
			box-shadow: 0 0 0 2px var(--stxui-theme-focus-color, #02b6a680);
		}
		.slippag-selected{
			border: 1px solid var(--stxui-theme-focus-color, #02b6a680);
			box-shadow: 0 0 0 2px var(--stxui-theme-focus-color, #02b6a680);
		}
		
		.slippage-tolerance-text{
			font-size: 14px;
			user-select: none;
			font-family: var(--stxui-font-family);
			color: var(--stxui-dark-theme-subcolor, #999); 
		}
		.theme-color{
			color: var(--stxui-theme-font-color, #111);
		}
		
		
  `;

	render() {
		const $t = sdkStore.$t;
		
		let isCustom = '';
		try {
			isCustom = this.slippagObj&&this.slippagObj?.id==='custom'?$t['custom']:'';
		} catch (err) {}
		let valueSlippag = '--';
		try {
			valueSlippag = this.slippagObj&&this.slippagObj?.value?this.slippagObj?.value+'%':'--';
		} catch (err) {}
		let valueStyle = '';
		try {
			if(this.slippagObj&&this.slippagObj?.value){
				if(this.slippagObj?.value<0.1){
					valueStyle = 'color:#ff6363;';
				}else if(this.slippagObj?.value>1){
					valueStyle = 'color:#fd8e00;';
				}
			}
		} catch (e) {}
		
		return html`
		
			<stx-slippag-set
				.open="${this.openSetSlippag}"
				styles="right: 0;bottom: 43px;transform-origin: center bottom;"
				refid="set-swap-slippag"
				@change="${this._changeSlippag}"
				@close="${()=>{this.openSetSlippag = false;}}"
			></stx-slippag-set>
		
		
		
		
			<div @click="${this._onOpenSetSlippag}" class="stx-slippag-eexpand ${this.openSetSlippag?'slippag-selected':''}">
				
				<span class="slippage-tolerance-text">${$t['slippage-tolerance']}</span>
				
				<div style="display: flex;flex-direction: row;align-items: center;column-gap:8px;">
					<span class="slippage-tolerance-text theme-color" style="${valueStyle}"
					>${isCustom}</span>
					<com-icon-to size="12px" direction="${this.openSetSlippag?'top':'bottom'}"></com-icon-to>
					<span class="slippage-tolerance-text theme-color" style="${valueStyle}"
					>${valueSlippag}</span>
				</div>
				
			</div>
		`;
	}
	
	_changeSlippag(e){
		//console.log('changeSlippag:', e.detail);
		this.slippagObj = e.detail;
		this.dispatchEvent(new CustomEvent('change-slippag', {
		    detail: {value: this.slippagObj.value},
		    bubbles: false,
		    composed: false
		}));
	}
	_onOpenSetSlippag(){
		this.openSetSlippag = true;
	}
	
	
}


if (!customElements.get('stx-slippag-eexpand')) {
	customElements.define('stx-slippag-eexpand', StxSlippagEexpand);
}


