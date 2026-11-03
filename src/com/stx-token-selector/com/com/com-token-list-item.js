import {
	LitElement,
	html,
	css
} from 'lit';

import '../../../stx-token-logo.js';
import '../../../../icon/com-icon-token-info.js';
import './balance/com-token-list-balance.js';
import './keyword/com-text-keyword-symbol.js';
import './keyword/com-text-keyword-name.js';
import './keyword/com-text-keyword-address.js';
import './keyword/com-text-keyword-full-address.js';
import {viemUtils} from '../../../../js_sdk/viem/utils.js';

import {$app} from '../../../../js_sdk/index.js';
import { StoreMixin } from '../../../../data/store/state-mixin.js';
import { sdkStore } from '../../../../data/store/store.js'; // 引入是为了读取数据

export class ComTokenListItem extends StoreMixin(LitElement) {
	static get properties() {
		return {
			disabledMiniPriceCard: {
				type: Boolean
			},
			options: {
				type: Object
			},
			keyword: {
				type: String
			},
			isTouchDevice: {
				type: Boolean
			},
			iscollect: {
				type: Boolean
			},
			collectaddresses: {
				type: Array
			},
			wallet: {
				type: String
			},
		};
	}

	constructor() {
		super();
		this.disabledMiniPriceCard = false;
		this.options = {};
		this.dungeon = {};
		this.keyword = '';
		this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		this.iscollect = true;
		this.wallet = '';
	}

	static get styles() {
		return css`
		:host {
			display: block;
		}
		.com-token-list-item{
			position: relative;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			padding: 10px 15px;
			column-gap:8px;
			
		}
		.com-token-list-item:hover {
			background-color: var(--stxui-list-item-bg-hover, #f7f8f9);
		}
		
		.on-collect-css{
			position: absolute;
			z-index: 1;
			top: -2px;
			left: 3px;
			right: -3px;
			bottom: -2px;
			border-radius: 100px;
		}
		
		
		.v1-collect-css{
			padding-left:5px;height:21px;position:relative;top:1px;
		}
		@media (max-height: 500px) {
			.v1-collect-css {
				display: none;
			}
		}
		
		
		
		.address-text-body{
			padding: 0 4px;
			border-radius: 60px;
			border: 1px dashed transparent;
			position: relative;
			transition: border 0.3s;
		}
		.address-text-body:hover {
			border: 1px dashed transparent;
		}
		@keyframes bounce_modalopacity {
			0%{opacity:0}
			to{opacity:1}
		}
		.full-address-body{
			position: absolute;
			z-index: 1;
			top: -19px;
			left: -2px;
			display: none;
		}
		.address-text-body:hover + .full-address-body {
			display: flex;
			animation: bounce_modalopacity 0.5s ease;
		}
		.full-address-text{
			position: absolute;
			z-index: 1;
			top: 0;
			left: 100%;
			transform: translate(6px, -2px);
			
			background-color: var(--stxui-dark-theme-tag-background-color, #fff);
			
			box-shadow: 0 0 3px 0 rgba(0,0,0,.04), 0 4px 14px 0 rgba(0,0,0,.07);
			
			border-radius: 26px;
			height: 18px;
			line-height: 18px;
			max-height: 18px;
			padding: 0 7px;
		}
		.symbol-placeholder-text{
			font-size: 15px;
			user-select: none;
			font-family: var(--stxui-font-family);
			max-width: 240px;
			word-break: break-all;
			overflow: hidden;
			text-overflow: ellipsis !important;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1 !important;
			opacity: 0;
			visibility: hidden;
		}
		
		
		@media (max-width: 520px) {
			.full-address-body{
				display: none;
			}
			.address-text-body:hover + .full-address-body {
				display: none;
			}
			.address-text-body:hover {
				border: 1px dashed transparent;
			}
			.v1-collect-css {
				display: none;
			}
		}
    `;
	}

	render() {
		const tokenCollect = this.collectaddresses.indexOf(this.options.address.toLowerCase()) === -1;
		const bal = sdkStore.allBalance?.[this.options.chain]?.[this.options.address];
		let balance_up = '0';
		let loadBalance = this.options.load_balance;
		if(bal||bal===0n){
			const balNum = viemUtils.formatUnits(bal, this.options.decimals);
			balance_up = $app.formatBalance(balNum);//'0.0₄305907'//
			loadBalance = false;
			this.dungeon = Object.assign({}, this.options, {
				balance: bal,
				balance_format: balNum,
				balance_up: balance_up,
				load_balance: false,
			});
		}else{
			this.dungeon = Object.assign({}, this.options);
		}
		//console.log('balNum', 1111);
		return html`
		<div @click="${this._selectToken}" class="com-token-list-item">
			
			<div style="flex:1;display:flex;flex-direction:row;align-items:center;column-gap:10px;justify-content:space-between;/*flex-wrap:wrap;*/">
				
				<div style="display:flex;flex-direction:row;align-items:center;column-gap:10px;">
					<stx-token-logo
						size="36px"
						symbol="${this.options.symbol}" 
						logo="${this.options.logourl}"
					></stx-token-logo>
					
					<div style="display:flex;flex-direction:column;">
						
						<com-text-keyword-symbol
							text="${this.options.symbol}"
							keyword="${this.keyword}"
						></com-text-keyword-symbol>
						
						<div style="height:2px;"></div>
						
						<div style="position:relative;display:flex;flex-direction:row;align-items:center;column-gap:4px;">
							<com-text-keyword-name
								text="${this.options.name}"
								keyword="${this.keyword}"
							></com-text-keyword-name>
							
							
							<div class="address-text-body" style="${this.isTouchDevice?'border: 1px dashed transparent;':''}">
								<com-text-keyword-address
									text="${this.options.address}"
									keyword="${this.keyword}"
								></com-text-keyword-address>
							</div>
							
							${this.isTouchDevice?``:html`
								<div class="full-address-body">
									<span class="symbol-placeholder-text"
									>${this.options.symbol}</span>
									<div class="full-address-text">
										<com-text-keyword-full-address
											text="${this.options.address}"
											keyword="${this.keyword}"
										></com-text-keyword-full-address>
									</div>
								</div>
							`}
							
						</div>
					</div>
				</div>
				
				
				<com-token-list-balance
					.load="${loadBalance}"
					.balance="${this.wallet?balance_up:''}"
				></com-token-list-balance>
				
				
			</div>
			
			
			
			
			
			<div style="display:flex;flex-direction:row;align-items:center;column-gap:10px;">
				
				${this.isTouchDevice?``:html`
					<div class="v1-collect-css" style="${this.iscollect||!tokenCollect?'':'cursor:not-allowed;'}">
						<svg style="display:${tokenCollect?'none':'block'};" xmlns="http://www.w3.org/2000/svg" id="pin_filled" width="21" height="21" viewBox="0 0 16 16"
							fill="none">
							<path
								d="M14.4658 6.24187L9.75171 1.52783C9.49244 1.26856 9.06818 1.26856 8.8089 1.52783C8.54963 1.7871 8.54963 2.21136 8.8089 2.47064L9.28031 2.94204L6.92329 5.29906C6.25341 5.96894 5.23119 6.06538 4.45986 5.58838C4.24066 5.45282 3.94712 5.4468 3.76488 5.62905L3.62345 5.77047C3.36311 6.03082 3.36311 6.45293 3.62345 6.71328L5.96634 9.05616L2.6665 12.356V13.2988H3.60931L6.90914 9.99897L9.28031 12.3701C9.54066 12.6305 9.96277 12.6305 10.2231 12.3701L10.3645 12.2287C10.5468 12.0465 10.5408 11.7529 10.4052 11.5337C9.92821 10.7624 10.0246 9.74017 10.6945 9.0703L13.0515 6.71328L13.5229 7.18468C13.7822 7.44395 14.2065 7.44395 14.4658 7.18468C14.725 6.92541 14.725 6.50115 14.4658 6.24187Z"
								fill="var(--stxui-theme-color, #02b6a6)" />
						</svg>
						<svg style="display:${tokenCollect?'block':'none'};${this.iscollect?'':'opacity:0.4;'}" xmlns="http://www.w3.org/2000/svg" id="pin" width="21" height="21" viewBox="0 0 16 16" fill="none">
							<path
								d="M12.1087 5.77047L9.75171 8.12749C9.22374 8.65546 8.9079 9.32014 8.8089 10.0131L5.98048 7.18468C6.6923 7.08569 7.34755 6.76042 7.8661 6.24187L10.2231 3.88485L12.1087 5.77047ZM14.4658 6.24187L9.75171 1.52783C9.49244 1.26856 9.06818 1.26856 8.8089 1.52783C8.54963 1.7871 8.54963 2.21136 8.8089 2.47064L9.28031 2.94204L6.92329 5.29906C6.25341 5.96894 5.23119 6.06538 4.45986 5.58838C4.24066 5.45282 3.94712 5.4468 3.76488 5.62905L3.62345 5.77047C3.36311 6.03082 3.36311 6.45293 3.62345 6.71328L5.96634 9.05616L2.6665 12.356V13.2988H3.60931L6.90914 9.99897L9.28031 12.3701C9.54066 12.6305 9.96277 12.6305 10.2231 12.3701L10.3645 12.2287C10.5468 12.0465 10.5408 11.7529 10.4052 11.5337C9.92821 10.7624 10.0246 9.74017 10.6945 9.0703L13.0515 6.71328L13.5229 7.18468C13.7822 7.44395 14.2065 7.44395 14.4658 7.18468C14.725 6.92541 14.725 6.50115 14.4658 6.24187Z"
								fill="#999999" />
						</svg>
						<div @click="${(e)=>{if(e.stopPropagation){e.stopPropagation();}if(e.preventDefault){e.preventDefault();}this._onCollect(tokenCollect)}}" class="on-collect-css"></div>
					</div>
				`}
				
				
				${!this.disabledMiniPriceCard?html`
					<com-icon-token-info clicktype="list" @change="${this._openTokenInfo}" @click="${(e)=>{if(e.stopPropagation){e.stopPropagation();}if(e.preventDefault){e.preventDefault();}}}"></com-icon-token-info>
				`:null}
			
			
			</div>
			
			
			
			
		</div>
    `;
	}
	
	_openTokenInfo(e){
		this.dispatchEvent(new CustomEvent('open-token-info', {
			detail: Object.assign({}, e.detail, this.dungeon),
			bubbles: false,
			composed: false
		}));
	}


	/* async _selectToken() {
		const result = await $app.permit.detectPermitMethods(sdkStore?.chain, {
			token: this.dungeon.address,
			owner: '0xd4cE05008e849EF096e02D806d0333A0B7e8350f',
			spender: '0x7B791963E4FeC2aabA2F0e7551Fa66b80060D259',
		});
		console.log(result);
	} */
	
	
	_selectToken() {
		this.dispatchEvent(new CustomEvent('select-token', {
			detail: this.dungeon,
			bubbles: false,
			composed: false
		}));
	}
	
	
	_onCollect(e) {
		if(e){
			if(this.iscollect){//this.iscollect为真说明收藏位置满了
				//console.log('收藏');
				this.dispatchEvent(new CustomEvent('set-collect', {
					detail: {
						collect: true,
						data: this.dungeon
					},
					bubbles: true,
					composed: true
				}));
			}
		}else{
			//console.log('取消收藏');
			this.dispatchEvent(new CustomEvent('set-collect', {
				detail: {
					collect: false,
					data: this.dungeon
				},
				bubbles: true,
				composed: true
			}));
		}
	}
	
	
	
	

}
if (!customElements.get('com-token-list-item')) {
	customElements.define('com-token-list-item', ComTokenListItem);
}
