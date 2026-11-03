import {
	LitElement,
	html,
	css
} from 'lit';

import { networkData } from '../../../data/network-data.js';
import { sdkStore } from '../../../data/store/store.js';
import { StoreMixin } from '../../../data/store/state-mixin.js';
import { allChainsLogo } from './icon.js';

import '../../../icon/com-icon-to.js';
import '../../../com/stx-token-logo.js';
import './stxcom-content-modal.js';

export class SwaptoxChainSelect extends StoreMixin(LitElement) {
	static get properties() {
		return {
			isOpenContent: {
				type: Boolean
			},
			selectedChain: {
				type: String,
			},
			frameWidth: {
				type: String,
			},
			isModal: {type: Boolean},
		};
	}

	constructor() {
		super();
		this.isOpenContent = false;
		this.selectedChain = '';
		this.frameWidth = '0px';
		this.isModal = false;
		this.original = [];
		for (let key in networkData) {
			this.original.push({
				'chainId': networkData[key].chainId,
				'chain': networkData[key].chain,
				'name': networkData[key].name,
				'logo': networkData[key].logo,
			});
		}
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
			padding: 0px 8px;
			padding-right: 10px;
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
			line-height: 22px;
			white-space: nowrap;
			color: var(--stxui-theme-font-color, #111);
			font-family: var(--stxui-font-family);
		}
		
		
		
		
    `;
	}
	
	

	render() {
		const $t = sdkStore.$t;
		const dingwei = window.innerWidth>=520?'right: 0;':`right: ${this.frameWidth};`;
		return html`
			<div style="position: relative;">
				<div @click=${()=>{this.isOpenContent = true;}} 
				class="swaptox-chain-select ${this.isOpenContent?'swaptox-chain-select-true':''} ${this.isModal?'pop-up-window':''}">
					
					
					
					
					
					${this.selectedChain&&networkData[this.selectedChain]?html`
						<stx-token-logo
							size="22px"
							.symbol="${networkData[this.selectedChain].name}" 
							.logo="${networkData[this.selectedChain].logo}"
						></stx-token-logo>
					`:html`${allChainsLogo(this.original)}`}
					
					
					
					
					<span class="chain-name-text"
					>${this.selectedChain&&networkData[this.selectedChain]?networkData[this.selectedChain].name:$t['all-chains']}</span>
					
					<com-icon-to size="12px" direction="${this.isOpenContent?'top':'bottom'}"></com-icon-to>
				</div>
				
				
				<stxcom-chain-select-content-modal 
					styles="${dingwei}top: 38px;transform-origin: top right;"
					placeholder="${$t['search-chains']}"
					noMatchingNetworks="${$t['no-matching-networks']}"
					allChainsText="${$t['all-chains']}"
					.original=${this.original}
					?open=${this.isOpenContent}
					@close=${()=>{this.isOpenContent = false;}}
					@selected-chain=${this._selectedChain}
				></stxcom-chain-select-content-modal>
				
			</div>
		`;
	}
	
	_selectedChain(e){
		this.selectedChain = e.detail;
		this.dispatchEvent(
			new CustomEvent('selected-chain', {
				detail: this.selectedChain,
				bubbles: false,
				composed: false
			})
		);
	}

}
if (!customElements.get('swaptox-chain-select')) {
	customElements.define('swaptox-chain-select', SwaptoxChainSelect);
}
