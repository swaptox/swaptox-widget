import {
	LitElement,
	html,
	css
} from 'lit';

import { sdkStore } from '../../data/store/store.js';
import { StoreMixin } from '../../data/store/state-mixin.js';

import '../../icon/com-icon-to.js';
import './com/stxcom-lang-choose-modal.js';

export class SwaptoxLangChoose extends StoreMixin(LitElement) {
	static get properties() {
		return {
			isOpenChoose: {
				type: Boolean
			},
			frameWidth: {
				type: String,
			},
		};
	}

	constructor() {
		super();
		this.isOpenChoose = false;
		this.frameWidth = '-44px';
	}

	static get styles() {
		return css`
		:host {
			display: block;
		}
		.swaptox-chain-select{
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 0px 10px;
			padding-right: 12px;
			column-gap: 6px;
			border-radius: 120px;
			border: 1px solid var(--stxui-swaptox-chain-select-border, #eee);
			cursor: pointer;
			background-color: var(--stxui-swaptox-chain-select-background, #fff);
			height: 34px;
			transition:
				border 0.2s ease-in-out,
				opacity 0.2s ease-in-out,
				box-shadow 0.2s ease-in-out;
			-webkit-tap-highlight-color: transparent;
		}
		.pop-up-window{
			border: 1px solid var(--stxui-transactions-record-modal-border, #eee);
		}
		
		
		.swaptox-chain-select:active {
		    opacity: 0.8;
		    background-color: var(--stxui-theme-content-background-color, #fbfbfb);
		}
		.swaptox-chain-select:hover {
		    border: 1px solid var(--stxui-theme-focus-color, #02b6a680);
		    background-color: var(--stxui-theme-content-background-color, #fbfbfb);
		    box-shadow: 0 0 0 2px var(--stx-primary-light, var(--stxui-theme-focus-color, #02b6a680));
		}
		.swaptox-chain-select-true {
		    border: 1px solid var(--stxui-theme-focus-color, #02b6a680);
		    background-color: var(--stxui-theme-content-background-color, #fbfbfb);
		    box-shadow: 0 0 0 2px var(--stx-primary-light, var(--stxui-theme-focus-color, #02b6a680));
		}
		
		
		.chain-name-text{
			user-select: none;
			font-size: 15px;
			line-height: 20px;
			white-space: nowrap;
			color: var(--stxui-theme-font-color, #111);
			font-family: var(--stxui-font-family);
		}
		
		
		@media (max-width: 680px) {
			.swaptox-chain-select{
				border-radius: 12px;
				width: 34px;
				min-width: 34px;
				padding: 0;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
			}
			com-icon-to{
				display: none;
			}
			.chain-name-text{
				display: none;
			}
		}
		
    `;
	}
	
	

	render() {
		const currentLang = sdkStore.currentLang;
		const originalObj = {};
		for(let i = 0; i < sdkStore.langOptionsList.length; i++){
			originalObj[sdkStore.langOptionsList[i].id] = sdkStore.langOptionsList[i];
		}
		const dingwei = window.innerWidth>=680?'right: 0;':`right: ${this.frameWidth};`;
		return html`
			<div style="position: relative;">
				<div @click=${()=>{this.isOpenChoose = true;}} 
				class="swaptox-chain-select ${this.isOpenChoose?'swaptox-chain-select-true':''}">
					
					<svg t="1793244835935" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7226" width="22" height="22"><path d="M1058.13333333-34.13333333H-34.13333333v1092.26666666h1092.26666666V-34.13333333z" fill="#999999" fill-opacity=".01" p-id="7227"></path><path d="M102.4 375.46666667a45.51146667 45.51146667 0 0 1 45.51146667-45.51146667h728.17706666a45.51146667 45.51146667 0 1 1 0 91.02293333H147.91146667A45.51146667 45.51146667 0 0 1 102.4 375.46666667z m0 273.06666666a45.51146667 45.51146667 0 0 1 45.51146667-45.51146666h728.17706666a45.51146667 45.51146667 0 1 1 0 91.02293333H147.91146667A45.51146667 45.51146667 0 0 1 102.4 648.53333333z" p-id="7228" fill="#999999"></path><path d="M441.776 238.86506667C415.47093333 306.51733333 398.22186667 403.0688 398.22186667 512s17.24906667 205.48266667 43.55413333 273.13493333c13.19893333 33.97333333 27.8304 58.368 41.7344 73.47733334 13.85813333 15.06453333 23.52853333 17.47626667 28.4896 17.47626666 4.96 0 14.63146667-2.41173333 28.49066667-17.47626666 13.90293333-15.10933333 28.512-39.50293333 41.73333333-73.47733334C608.52906667 717.48266667 625.77813333 620.9312 625.77813333 512s-17.24906667-205.48266667-43.55413333-273.13493333c-13.19893333-33.97333333-27.8304-58.368-41.7344-73.47733334-13.85813333-15.06453333-23.52853333-17.47626667-28.4896-17.47626666-4.96 0-14.63146667 2.41173333-28.49066667 17.47626666-13.90293333 15.10933333-28.512 39.50293333-41.73333333 73.47733334z m-25.28106667-135.07733334c24.25706667-26.4192 56.48-46.8992 95.50506667-46.8992 39.02613333 0 71.248 20.52586667 95.50506667 46.8768 24.21226667 26.35093333 43.91786667 61.96266667 59.552 102.10453334C698.368 286.4928 716.8 394.71786667 716.8 512s-18.4096 225.53066667-49.744 306.13013333c-15.6096 40.1408-35.33866667 75.7536-59.55093333 102.08213334-24.25706667 26.4192-56.48 46.8992-95.50506667 46.8992-39.02613333 0-71.248-20.52586667-95.50506667-46.8768-24.21226667-26.35093333-43.91786667-61.96266667-59.552-102.10453334C325.632 737.5072 307.2 629.28213333 307.2 512s18.4096-225.53066667 49.744-306.13013333c15.6096-40.1408 35.33866667-75.7536 59.55093333-102.08213334z" fill="#999999" p-id="7229"></path><path d="M56.88853333 512C56.88853333 260.64213333 260.64213333 56.88853333 512 56.88853333S967.11146667 260.64213333 967.11146667 512 763.35786667 967.11146667 512 967.11146667 56.88853333 763.35786667 56.88853333 512zM512 147.91146667c-201.0912 0-364.08853333 162.99733333-364.08853333 364.08853333S310.9088 876.08853333 512 876.08853333 876.08853333 713.0912 876.08853333 512 713.0912 147.91146667 512 147.91146667z" p-id="7230" fill="#999999"></path></svg>
					
					<span class="chain-name-text"
					>${originalObj?.[currentLang]?.name}</span>
					
					<com-icon-to size="12px" direction="${this.isOpenChoose?'top':'bottom'}"></com-icon-to>
				</div>
				
				
				
				<stxcom-lang-choose-modal
					.currentLang=${currentLang}
					styles="${dingwei}top:42px;transform-origin: top right;"
					.original=${sdkStore.langOptionsList}
					?open=${this.isOpenChoose}
					@close=${()=>{this.isOpenChoose = false;}}
					@selected-lang=${this._selectedLang}
				></stxcom-lang-choose-modal>
				
				
			</div>
		`;
	}
	
	_selectedLang(e){
		this.dispatchEvent(
			new CustomEvent('choose-lang', {
				detail: e.detail,
				bubbles: false,
				composed: false
			})
		);
		window?.$swaptoxWidget?.setLang(e.detail);
		window?.$swaptoxConnect?.setLang(e.detail);
	}

}
if (!customElements.get('swaptox-lang-choose')) {
	customElements.define('swaptox-lang-choose', SwaptoxLangChoose);
}