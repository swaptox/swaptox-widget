import {
	LitElement,
	html,
	css
} from 'lit';


import { sdkStore } from '../../data/store/store.js';
import { StoreMixin } from '../../data/store/state-mixin.js';
import '../stxapp-button/stxapp-button.js';
import { $app } from '../../js_sdk/index.js';

export class StxappSwapButton extends StoreMixin(LitElement) {
	static properties = {
		
	};
	constructor() {
		super();
	}


	static styles = css`
		:host {
			display: block;
			height: 46px;
		}
	`;
	
	
	render() {
		const $t = sdkStore.$t;
		const chain = sdkStore.chain;
		const account = sdkStore.account;
		const route = sdkStore.selectedRoute;
		const tokenInData = sdkStore.tokenInData;
		const inputAmount = sdkStore.inputAmount;
		
		let isInsufficientBalance = false;
		if(inputAmount&&route&&account&&tokenInData){
			const amountIn = BigInt(tokenInData.amountIn);
			const userBalance = BigInt(sdkStore.allBalance?.[chain]?.[tokenInData.address.toLowerCase()]||'0');
			isInsufficientBalance = amountIn>userBalance?true:false;
		}
		let insufficientBalanceText = '';
		if(isInsufficientBalance){
			insufficientBalanceText = $app.replaceTemplate($t['insufficient-balance'], {
				'symbol': tokenInData.symbol,
			});
		}
		
		let insufficientLiquidity = false;
		if(route&&BigInt(route?.amountOut)===0n){
			insufficientLiquidity = true;
		}
		
		let isNO_ROUTE = false;
		const allRoutes = sdkStore.routes;
		if(!route&&$app.test.array(allRoutes)&&allRoutes.length===0){
			isNO_ROUTE = true;
		}
		
		
		
		return html`${account
			? html`
			
			
			<stxapp-button styles="display:var(--stxui-icon-switch-token-load, none);"
				.disabled="${true}"
				type="primary" 
			>${$t['loading']}</stxapp-button>
			
			
			${isInsufficientBalance?html`
				<stxapp-button styles="display:var(--stxui-icon-switch-token-open, flex);"
					.disabled="${true}"
					type="primary" 
				>${insufficientBalanceText}</stxapp-button>
			`:html`
				<stxapp-button styles="display:var(--stxui-icon-switch-token-open, flex);"
					.disabled="${inputAmount&&route&&insufficientLiquidity===false&&isNO_ROUTE===false?false:true}"
					type="primary" 
					@_click=${this._swap}
				>${insufficientLiquidity?$t['insufficient-liquidity']:isNO_ROUTE?$t['NO_ROUTE']:$t['swap']}</stxapp-button>
			`}
			
			
			
			
					
			`: html`<stxapp-button 
						type="primary" 
						@_click=${this._connectWallet}
			>${$t['connect-wallet']}</stxapp-button>`
		}`;
	}
	
	_swap() {
		window.swaptox.widget.$el.swap.openConfirmSwap = true;
		//console.log('swap');
		//this.dispatchEvent(new CustomEvent('swap'));
	}
	
	_connectWallet() {
		this.dispatchEvent(new CustomEvent('connect-wallet', {
			bubbles: false,
			composed: false
		}));
		window.$swaptoxWidget.$el._connectWallet();
		
		//this.dispatchEvent(new CustomEvent('connectWallet'));
		//console.log('-------------23');
		//window.swaptox.widget.$el.openStateModal = true;
		//const hash = '0xa2d1b5e41dd537004078e4c0e7b6a91c7da1126f01825f6c6335bcfac20b5588';
		//window.swaptox.widget.$el.swap._openMiniSwapStateModal(hash);
	}
	
}


if (!customElements.get('swaptox-swap-button')) {
	customElements.define('swaptox-swap-button', StxappSwapButton);
}
