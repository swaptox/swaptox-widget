import {
	LitElement,
	html,
	css
} from 'lit';

import './stx-input.js';
import './stx-input/com-input-tag.js';
import '../icon/com-icon-token-info.js';
import { sdkStore } from '../data/store/store.js';
import { StoreMixin } from '../data/store/state-mixin.js';
import { viemUtils } from '../js_sdk/viem/utils.js';
import { $app } from '../js_sdk/index.js';

export class StxTokenInput extends StoreMixin(LitElement) {
	static get properties() {
		return {
			disabledMiniPriceCard: { type: Boolean },
			value: { type: String },
			valueusd: { type: String },
			chain: { type: String },
			address: { type: String },
			paytitle: { type: String },
			tokenname: { type: String },
			decimals: { type: Number },
			wallet: { type: String },
			loading: {
				type: Boolean,
			},
		};
	}

	constructor() {
		super();
		this.disabledMiniPriceCard = false;
		this.chain = '';
		this.value = '';
		this.valueusd = '';
		this.address = '';
		this.paytitle = '';
		this.tokenname = '';
		this.decimals = 0;//用于设置小数点后可以输入多少位数，0则不限
		this.wallet = '';
		this.balance = 0n;
		this.loading = false;
	}

	static get styles() {
		return css`
		:host {
			display: block;
			position: relative;
		}
		.stx-token-input {
			position: relative;
			user-select:none;
		}
		.com-flex-token-select{
			position: absolute;
			right: 13px;
			top: 36px;
			z-index: 2;
		}
		.com-flex-tag-body{
			position: absolute;
			right: 14px;
			top: 8px;
			z-index: 2;
			display: flex;
			flex-direction: row;
			align-items: center;
			column-gap: 8px;
		}
		.dapp--price-card-in{
			position:absolute;right:10px;bottom:7px;z-index:2;
		}
		
		.disabled-stx-token-input{
			position: absolute;
			inset: -2px;
			z-index: 10;
			background-color: transparent;
			cursor: progress;
			border-radius: 17px;
		}
    `;
	}

	render() {
		
		let balanceUp = '0';
		try {
			if(this.wallet&&this.decimals){
				this.balance = sdkStore?.allBalance?.[this.chain]?.[this.address.toLowerCase()];
				balanceUp = viemUtils.formatUnits(this.balance, this.decimals);
				balanceUp = $app.formatSwapBalance(balanceUp);
			}//console.log('balanceUp', balanceUp);
		} catch (e) {}
		
		let valueUSD = '';
		try {
			if($app.test.isNumber(this.value)){
				const priceStr = sdkStore?.tokenPrice?.[this.chain]?.[this.address.toLowerCase()];
				if(!priceStr||priceStr==='0'){
					valueUSD = '--';
				}else{
					const valUSD = $app.calculateUsdValue(viemUtils.parseUnits(this.value, this.decimals), viemUtils.parseUnits('1', this.decimals), priceStr);
					//console.log('valUSD', valUSD);
					valueUSD = $app.formatPriceBehalf(valUSD, sdkStore.priceBehalf);
				}
			}else if(this.value==='0'){
				//valueUSD = '--';
			}
		} catch (e) {}
		
		try {
			if(valueUSD==='--'&&this.valueusd){
				valueUSD = $app.formatPriceBehalf(this.valueusd, sdkStore.priceBehalf);
			}
		} catch (e) {}
		
		
		const $t = sdkStore.$t;
		return html`

			<div class="stx-token-input" style="${this.loading?'opacity: 0.5;':''}">
				<stx-input 
					?disabledMiniPriceCard=${this.disabledMiniPriceCard}
					.balance="${this.loading?'':balanceUp}"
					.valueusd="${this.loading?'':valueUSD}"
					styles="padding-right: var(--stxui-token-select-icon-width-input, 50px);"
					isinput="true"
					paytitle="${this.paytitle}"
					placeholder="${$t['input-amount']}"
					.value="${this.value}"
					.decimals="${this.decimals}"
					.tokenname="${this.loading?'':this.tokenname}"
					@input-amount="${this._onInputChange}"
				></stx-input>
				<div class="com-flex-tag-body">
					<com-input-tag .disabled="${this.wallet&&this.balance>=2n?false:true}" text="50%" @change="${this._onInput50}"></com-input-tag>
					<com-input-tag .disabled="${this.wallet&&this.balance>=1n?false:true}" text="MAX" @change="${this._onInputMAX}"></com-input-tag>
				</div>
				<div class="com-flex-token-select">
					<slot></slot>
				</div>
				${!this.disabledMiniPriceCard&&!this.loading?html`
					<div class="dapp--price-card-in">
						<com-icon-token-info clicktype="swap" @change="${this._openTokenInfo}"></com-icon-token-info>
					</div>
				`:null}
				
				${this.loading?html`
					<div class="disabled-stx-token-input"></div>
				`:null}
				
			</div>
			
		`;
	}
	
	
	_onInput50() {
		if(this.balance){
			this.value = viemUtils.formatUnits(this.balance/2n, this.decimals);
			this._onInputChange({target: {value: this.value}});
		}//console.log('输入50%');
	}
	_onInputMAX() {
		if(this.balance){
			this.value = viemUtils.formatUnits(this.balance, this.decimals);
			this._onInputChange({target: {value: this.value}});
		}//console.log('输入MAX');
	}
	
	
	_openTokenInfo(e){
		this.dispatchEvent(new CustomEvent('open-token-info', {
			detail: e.detail,
			bubbles: false,
			composed: false
		}));
	}
	


	_onInputChange(event) {
		const newValue = event.target.value;
		//console.log('newValue', newValue);
		//if(this.value===newValue){return;}
		this.value = newValue;
		this.dispatchEvent(new CustomEvent('stx-input-change', {
			detail: {
				value: this.value,
				address: this.address
			},
			bubbles: false,
			composed: false
		}));
	}
}

if (!customElements.get('stx-token-input')) {
	customElements.define('stx-token-input', StxTokenInput);
}
