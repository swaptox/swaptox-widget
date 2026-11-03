import {
	LitElement,
	html,
	css
} from 'lit';

import '../icon/com-icon-to.js';
import './stx-token-logo.js';
import { $app } from '../js_sdk/index.js';
import { cardInfo } from '../components/stxapp-limit-optional-list/stxapp-limit-optional-list-config.js';

export class StxTokenSelectIcon extends LitElement {
	static get properties() {
		return {
			logo: {
				type: String
			},
			symbol: {
				type: String
			},
			disabled: {
				type: Boolean
			},
			refid: {
				type: String
			},
			loading: {
				type: Boolean,
			},
			miniSelectNum: {
				type: Number,
			},
		};
	}

	constructor() {
		super();
		this.logo = '';
		this.symbol = '';
		this.disabled = false;
		this.loading = false;
		this.refid = '';
		this.miniSelectNum = 0;
	}

	static get styles() {
		return css`
		:host {
			display: block;
		}
		.token-card-select{
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 0px 7px;
			padding-right: 10px;
			column-gap: 6px;
			border-radius: 100px;
			border: 1px solid var(--stxui-theme-border-color, #eee);
			cursor: pointer;
			background-color: var(--stxui-theme-background-color, #fff);
			height: 34px;
			transition:
				border 0.2s ease-in-out,
				opacity 0.2s ease-in-out,
				box-shadow 0.2s ease-in-out;
		}
		
		
		
		.token-card-select[disabled=false]:hover {
		    border: 1px solid var(--stxui-theme-focus-color, #02b6a680);
		    background-color: var(--stxui-theme-content-background-color, #fbfbfb);
		    box-shadow: 0 0 0 2px var(--stx-primary-light, var(--stxui-theme-focus-color, #02b6a680));
		}
		.token-card-select[disabled=false]:active {
		    opacity: 0.8;
		    background-color: var(--stxui-theme-content-background-color, #fbfbfb);
		}
		
		.token-card-select[disabled=true]:hover {
		    cursor: auto;
		}
		
		.token-name-text{
			user-select: none;
			font-size: 17px;
			white-space: nowrap;
			color: var(--stxui-theme-font-color, #111);
			font-family: var(--stxui-font-family);
		}
		
		
		
		.token-card-get-load{ position: relative;cursor: auto;pointer-events: none;}
		.token-card-get-load::after {
			position: absolute;border-radius: 100px;
			z-index: 12;
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
		
		
    `;
	}
	
	
	updated() {
	    this._getTokenSelectRect();
		setTimeout(()=>{
			this._getTokenSelectRect();
		}, 20);
		setTimeout(()=>{
			this._getTokenSelectRect();
		}, 80);
	}
	_getTokenSelectRect(){
		try {
	    	const { width } = this.getBoundingClientRect();//console.log('token-select', width);
			$app.htmlProperty({
				[`--stxui-token-select-icon-width-${this.refid}`]: `${width+13}px`
			});
	    } catch (e) {}
	}

	render() {
		return html`
		<div @click="${this._selectToken}" class="token-card-select ${this.loading?'token-card-get-load':''}" 
		disabled="${this.disabled}" style="${this.disabled?'background-color: var(--stxui-token-select-icon-disabled-bg);opacity:0.9;':''}">
			
			<stx-token-logo 
				size="24px"
				.symbol="${this.symbol}" 
				.logo="${this.logo}"
			></stx-token-logo>
			
			<span class="token-name-text">${this.symbol}</span>
			
			${this.disabled?``:html`<com-icon-to size="12px" direction="bottom"></com-icon-to>`}
			
		</div>
    `;
	}

	_selectToken(e) {
		if(this.disabled){return;}
		if(this.miniSelectNum>0){
			this._onClick(e);
			return;
		}
		this.dispatchEvent(new CustomEvent('change'));
	}
	
	
	
	_onClick(e) {
	    const width = cardInfo.width;
	    let height = this.miniSelectNum*40;
	    
		if(height>=cardInfo.height){
			height = cardInfo.height;
		}else if(height<=cardInfo.minHeight){
			height = cardInfo.minHeight;
		}
		
		const rect = e.currentTarget.getBoundingClientRect();
		
	    // 获取视口宽高
	    // const vw = window.innerWidth;
	    const vh = window.innerHeight;
		
		let top = rect.top + rect.height + 2;
		if((top+height)>vh){
			top = vh - height;
		}
		
	    this.dispatchEvent(new CustomEvent('mini-change', {
	        detail: { 
	            top: top, 
	            left: (rect.left + rect.width) - width,
				refid: this.refid
	        },
	        bubbles: false,
	        composed: false
	    }));
	}
	
	
	

}
if (!customElements.get('stx-token-select-icon')) {
	customElements.define('stx-token-select-icon', StxTokenSelectIcon);
}
