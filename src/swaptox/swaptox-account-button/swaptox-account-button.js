import {
	LitElement,
	html,
	css
} from 'lit';


import { sdkStore } from '../../data/store/store.js';
import { StoreMixin } from '../../data/store/state-mixin.js';
import { $app } from '../../js_sdk/index.js';


export class StxappAccountButton extends StoreMixin(LitElement) {
	static properties = {
		
	};
	constructor() {
		super();
	}


	static styles = css`
		:host {
			display: block;
		}
		.font-family {
			user-select: none;
			font-family: var(--stxui-font-family);
		}
		
		.flex-row-center{
			display: flex;
			flex-direction: row;
			align-items: center;
		}
		
		
		.swaptox-account-button{
			height: 34px;
			column-gap: 4px;
			border-radius: 100px;
			border: 1px solid var(--stxui-swaptox-chain-select-border, #eee);
			cursor: pointer;
			background-color: var(--stxui-swaptox-chain-select-background, #fff);
			padding: 0px 10px;padding-right: 12px;
			transition:
				border 0.2s ease-in-out,
				opacity 0.2s ease-in-out,
				box-shadow 0.2s ease-in-out;
			-webkit-tap-highlight-color: transparent;
		}
		.swaptox-account-button:hover {
		    border: 1px solid var(--stxui-theme-focus-color, #02b6a680);
		    background-color: var(--stxui-theme-content-background-color, #fbfbfb);
		    box-shadow: 0 0 0 2px var(--stx-primary-light, var(--stxui-theme-focus-color, #02b6a680));
		}
		
		.account-text{
			font-size: 15px;
			color: var(--stxui-theme-font-color, #111);
			white-space:nowrap;
		}
		
		.stx-account-before-hide-id1090{}
		@media (max-width: 680px) {
			.stx-account-before-hide-id1090{
				/*display: none;*/
			}
			.account-text{
				font-size: 13px;
			}
		}
		

		
		
	`;
	
	
	render() {
		const account = sdkStore.account;
		const walletLogo = sdkStore.walletLogo;
		const accountBefore = account?account.slice(0, 6):'';
		const accountAfter = account?account.slice(-4):'';
		return account?html`
			<div class="flex-row-center swaptox-account-button" @click=${this._openWallet}>
				
				${walletLogo?html`
					<img style="min-width:20px;width:20px;height:20px;user-select:none;"
						src="${walletLogo}"
						loading="lazy"
						decoding="async"
					/>
				`:html`
					<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1755967636703" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24457" width="20" height="20" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M512 0c282.752 0 512 229.248 512 512S794.752 1024 512 1024 0 794.752 0 512 229.248 0 512 0z" fill="#02b6a6" p-id="24458" data-spm-anchor-id="a313x.manage_type_myprojects.0.i8.5c043a81qCRQpU" class=""></path><path d="M341.8112 342.912h345.088c14.208 0 28.288 2.432 41.728 7.04-0.512-0.896-0.896-1.792-1.408-2.688l-64.768-112.128a86.3616 86.3616 0 0 0-117.888-31.616L332.8512 325.76c-9.6 5.504-18.048 12.928-24.832 21.632 11.136-2.944 22.4-4.48 33.792-4.48" fill="#FDEACA" opacity=".7" p-id="24459"></path><path d="M301.056 355.968h421.76a93.056 93.056 0 0 1 93.056 93.056v245.76a93.056 93.056 0 0 1-93.056 93.056H301.056a93.056 93.056 0 0 1-93.056-93.056v-245.76c0-51.328 41.728-93.056 93.056-93.056z" fill="var(--stxui-theme-white)" p-id="24460" data-spm-anchor-id="a313x.manage_type_myprojects.0.i7.5c043a81qCRQpU" class=""></path><path d="M648.064 499.968H800v144H648.064c-39.808 0-71.936-32.256-72.064-71.936a72.064 72.064 0 0 1 72.064-72.064z" fill="#02b6a6" p-id="24461" data-spm-anchor-id="a313x.manage_type_myprojects.0.i11.5c043a81qCRQpU" class=""></path><path d="M608 572.032a48 40.064 0 1 0 96 0 48 40.064 0 1 0-96 0Z" fill="var(--stxui-theme-white)" p-id="24462"></path></svg>
				`}
				
				
				
				<div class="flex-row-center">
					<span class="font-family account-text stx-account-before-hide-id1090"
					>${accountBefore}</span>
					<span class="font-family account-text"
					>...${accountAfter}</span>
				</div>
				
				
			</div>
		`:null;
	}
	
	
	_openWallet() {
		this.dispatchEvent(new CustomEvent('open-wallet', {
			bubbles: false,
			composed: false
		}));
		window.$swaptoxWidget.$el.openWallet();
	}
	
}


if (!customElements.get('swaptox-account-button')) {
	customElements.define('swaptox-account-button', StxappAccountButton);
}
