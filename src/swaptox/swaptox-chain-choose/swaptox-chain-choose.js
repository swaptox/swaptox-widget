import {
	LitElement,
	html,
	css
} from 'lit';

import { sdkStore } from '../../data/store/store.js';
import { StoreMixin } from '../../data/store/state-mixin.js';
import { networkData } from '../../data/network-data.js';

import '../../icon/com-icon-to.js';
import '../../com/stx-token-logo.js';
import './com/stxcom-chain-choose-modal.js';

export class SwaptoxChainChoose extends StoreMixin(LitElement) {
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
		this.frameWidth = '-88px';
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
		
		
		
		.is-suoxiao{}
		.is-yinchang{}
		
		@media (max-width: 680px) {
			.is-suoxiao{
				border-radius: 12px;
				width: 34px;
				min-width: 34px;
				padding: 0;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
			}
			.is-yinchang{
				display: none;
			}
		}
    `;
	}
	
	

	render() {
		const $t = sdkStore.$t;
		const account = sdkStore.account;
		const currentChain = sdkStore.chain;
		const dingwei = window.innerWidth>=680?'right: 0;':`right: ${this.frameWidth};`;
		return html`
			<div style="position: relative;">
				<div @click=${()=>{this.isOpenChoose = true;}} 
				class="swaptox-chain-select ${this.isOpenChoose?'swaptox-chain-select-true':''} ${account?'is-suoxiao':''}">
					
					
					<stx-token-logo
						size="20px"
						.symbol="${networkData?.[currentChain]?.name}" 
						.logo="${networkData?.[currentChain]?.logo}"
					></stx-token-logo>
					
					
					<span class="chain-name-text ${account?'is-yinchang':''}"
					>${networkData?.[currentChain]?.name}</span>
					
					<com-icon-to class="${account?'is-yinchang':''}" size="12px" direction="${this.isOpenChoose?'top':'bottom'}"></com-icon-to>
				</div>
				
				
				<stxcom-chain-choose-modal 
					.currentChain=${currentChain}
					styles="${dingwei}top:42px;transform-origin: top right;"
					placeholder="${$t['search-chains']}"
					noMatchingNetworks="${$t['no-matching-networks']}"
					.original=${this.original}
					?open=${this.isOpenChoose}
					@close=${()=>{this.isOpenChoose = false;}}
					@selected-chain=${this._selectedChain}
				></stxcom-chain-choose-modal>
				
			</div>
		`;
	}
	
	_selectedChain(e){
		this.dispatchEvent(
			new CustomEvent('choose-chain', {
				detail: e.detail,
				bubbles: false,
				composed: false
			})
		);
		window?.$swaptoxWidget?.setChain(e.detail);
		window?.$swaptoxConnect?.updateConfig({ currentChain: e.detail });
	}

}
if (!customElements.get('swaptox-chain-choose')) {
	customElements.define('swaptox-chain-choose', SwaptoxChainChoose);
}