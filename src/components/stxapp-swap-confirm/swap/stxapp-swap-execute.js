

import {
	LitElement,
	html,
	css
} from 'lit';

import { $app } from '../../../js_sdk/index.js';
import { sdkStore } from '../../../data/store/store.js';
import { StoreMixin } from '../../../data/store/state-mixin.js';
import { loadingRender } from './icon/icon-loading-logo.js';
import { viemUtils } from '../../../js_sdk/viem/utils.js';
import { approve } from '../../../api/erc20/approve.js';
import { permit } from '../../../api/erc20/permit.js';
import { simulateSwap } from '../../../api/chain/simulateSwap.js';
import { transactionSend } from '../../../api/chain/transactionSend.js';
import { networkData } from '../../../data/network-data.js';

import '../../../icon/com-icon-close.js';
import './com/stxcom-swap-step.js';
import './com/stxcom-swap-success.js';
import './com/stxcom-swap-error.js';
import './com/stxcom-swap-approve.js';

/**
 * Wei 转 Hexadecimal
 * @param {string | bigint} value Wei 数量
 * @returns {string} 0x 开头的十六进制字符串
 */
export function toHexValue(value) {
    const amount = BigInt(value);
    if (amount < 0n) {
        throw new Error('Value cannot be negative');
    }
    return '0x' + amount.toString(16);
}

export class StxappSwapExecute extends StoreMixin(LitElement) {
	static properties = {
		symbol: {
			type: String
		},
		isNeedApprove: {
			type: Boolean
		},
		isETH: {
			type: Boolean
		},
		isApprove: {
			type: Boolean
		},
		amountIn: {
			type: String
		},
		amountMinOut: {
			type: String
		},
		tokenIn: {
			type: String
		},
		tokenOut: {
			type: String
		},
		routeraddress: {
			type: String
		},
		isQueryApprove: {
			type: Boolean
		},
		recipient: {
			type: String
		},
		swapData: {
			type: String
		},
		deadline: {
			type: String
		},
		swapfee: {
			type: Number
		},
		isApproveError: {type: Boolean},
		isSwapError: {type: Boolean},
		openApprove: {type: Boolean},
		simulateError: {type: Boolean},
		txHash: {
			type: String
		},
		isSaveHash: {
			type: Boolean
		},
		permitTypedData: {
			type: Object
		},
		oldPermitData: {
			type: String
		},
	};
	constructor() {
		super();
		this.symbol = '';
		this.isSaveHash = false;
		
		this.amountIn = '';
		this.tokenIn = '';
		this.tokenOut = '';
		this.amountMinOut = '';
		this.recipient = '';
		this.swapData = '';
		this.deadline = '';
		this.swapfee = 0;
		
		this.isNeedApprove = false;//是否需要批准
		this.isApprove = false;//是否已经获得批准
		this.isQueryApprove = false;
		
		this.isETH = false;
		this.isApproveError = false;//授权错误
		this.isSwapError = false;//交易错误
		this.openApprove = false;
		this.simulateError = false;
		
		this.txHash = '';//交易哈希，存在代币交易成功
		
		this.permitTypedData = {};
		this.permitData = '';
		this.oldPermitData = '';
	}


	static styles = css`
		:host {
			display: block;
		}
		.font-family{
			user-select: none;
			font-family: var(--stxui-font-family);
		}
		.request-swap-title{
			font-size: 26px;
			font-weight: 500;
			color: var(--stxui-theme-font-color, #111);
			white-space: nowrap;
		}
		.request-swap-subtitle{
			font-size: 14px;
			color: #999;
			white-space: nowrap;
		}
		
		
		
		.confirm-swap-title{
			box-sizing: border-box;
			font-size: 18px;
			color: var(--stxui-theme-font-color, #111);
		}
		.stxapp-swap-confirm{
			position: relative;
			padding: 20px;
		}
	`;
	
	
	
	willUpdate(changedProperties) {
	    if (changedProperties.has('isNeedApprove')) {
	        if ([true, false].indexOf(this.isNeedApprove) !== -1) {
				if(this.isNeedApprove){
					if(this.isApprove){
						this._toSwap();
					}else{
						if(this.isQueryApprove){
							this._toApprove();
						}else{
							const intervalID = setInterval(()=>{
								if(this.isQueryApprove){
									if(this.isApprove){
										this._toSwap();
									}else{
										this._toApprove();
									}
									clearInterval(intervalID);
								}
							}, 30);
						}
					}
				}else{
					this._toSwap();
				}
	        }
	    }
	}
	
	
	_toApprove(){
		this.openApprove = true;
		this.isApproveError = false;
	}
	async _approvalToken(e){
		this.openApprove = false;
		const amount = e.detail==='max'?viemUtils.maxUint256.toString():sdkStore.inputAmount;
		this.isApprove = await approve(sdkStore.chain, {
			token: this.tokenIn,
			spender: this.routeraddress,
			amount: amount,
			account: sdkStore.account,
		});
		if(!this.isApprove){
			this.isApproveError = true;
		}else{
			this.isApproveError = false;
			this.dispatchEvent(new CustomEvent('already-approve', {
				bubbles: false,
				composed: false
			}));
			this._toSwap();
		}
	}
	
	
	async _permitToken(e){
		this.openApprove = false;
		const amount = e.detail==='max'?viemUtils.maxUint256.toString():sdkStore.inputAmount;
		this.permitData = await permit(sdkStore.chain, {
			token: this.tokenIn,
			spender: this.routeraddress,
			amount: amount,
			account: sdkStore.account,
			deadline: this.deadline,
		}, this.permitTypedData);
		if(!this.permitData){
			this.isApproveError = true;
		}else{
			this.isApprove = true;
			this.isApproveError = false;
			this.dispatchEvent(new CustomEvent('already-permit', {
				detail: this.permitData,
				bubbles: false,
				composed: false
			}));
			this._toSwap();
		}
	}
	
	
	
	
	
	async _toSwap(){
		const isok = await simulateSwap(sdkStore.chain, {
			data: {
				desc: {
					tokenIn: this.tokenIn,
					tokenOut: this.tokenOut,
					amountIn: sdkStore.inputAmount,
					amountMinOut: this.amountMinOut,
					recipient: this.recipient,
					swapData: this.swapData,
					permitData: this.permitData?this.permitData:this.oldPermitData?this.oldPermitData:''
				},
				deadline: this.deadline,
				referral: sdkStore.referral
			},
			routerAddress: this.routeraddress,
			account: sdkStore.account,
			isETH: this.isETH,
			value: this.isETH?toHexValue(sdkStore.inputAmount):'0x0',
		});
		if(!isok.success){
			this.simulateData = isok;
			this.simulateError = true;
			return;
		}
		this._transactionSend();
	}
	async _transactionSend(){
		this.isSwapError = false;
		this.simulateError = false;
		const sawpData = await transactionSend(sdkStore.chain, {
			data: {
				desc: {
					tokenIn: this.tokenIn,
					tokenOut: this.tokenOut,
					amountIn: sdkStore.inputAmount,
					amountMinOut: this.amountMinOut,
					recipient: this.recipient,
					swapData: this.swapData,
					permitData: this.permitData?this.permitData:this.oldPermitData?this.oldPermitData:''
				},
				deadline: this.deadline,
				referral: sdkStore.referral
			},
			routerAddress: this.routeraddress,
			account: sdkStore.account,
			isETH: this.isETH,
			value: this.isETH?toHexValue(sdkStore.inputAmount):'0x0',
		});
		if(!sawpData.success){
			this.isSwapError = true;
			return;
		}
		this.isSaveHash = false;
		
		const saveData = {
			chainin: sdkStore.chain,
			chainout: sdkStore.chain,
			account: sdkStore.account,
			tokenin: this.tokenIn,
			tokenout: this.tokenOut,
			amountin: sdkStore.inputAmount,
			amountout: sdkStore?.selectedRoute?.amountOut,
			recipient: this.recipient,
			customrecipient: sdkStore.account.toLowerCase()===this.recipient.toLowerCase()?false:true,
			hash: sawpData.txHash,
			deadline: this.deadline,
			type: 'swap',
			initiated: $app.timeFormatDate(Date.now(), 'yyyy-MM-dd hh:mm'),
			swapfee: parseInt(this.swapfee*100),
			amountinusd: sdkStore?.selectedRoute?.amountInUsd||'',
			amountoutusd: sdkStore?.selectedRoute?.amountOutUsd||'',
		};//console.log(saveData, 99999999999);
		//this.txHash = sawpData.txHash;
		/*this.isSaveHash = await */window.$swaptoxWidget.$el._openMiniSwapStateModal(saveData);
		this._swapSuccessClose();
	}
	
	
	

	render() {
		const $t = sdkStore.$t;
		const approveState = this.isApproveError?'error':this.isApprove?'success':'load';
		const swapState = this.isApprove||!this.isNeedApprove?this.isSwapError?'error':'load':'';
		return html`
			<div style="position:relative;padding:20px;">
				
				<div style="position: absolute;top: 20px;right: 20px;z-index: 1;">
					<com-icon-close @change=${this._closeClick} size="default"></com-icon-close>
				</div>
				
				${loadingRender()}
				
				
				
				${this.isNeedApprove===true&&this.isApprove===false?html`
					<div style="display:flex;flex-direction:column;justify-content:center;align-items:center;row-gap:20px;">
						<span class="font-family request-swap-title">${$t['pending-approve']}</span>
						<span class="font-family request-swap-subtitle">${
							$app.replaceTemplate($t['approve-token-wallet'], {
								'symbol': this.symbol,
							})
						}</span>
					</div>
				`:html`
					<div style="display:flex;flex-direction:column;justify-content:center;align-items:center;row-gap:20px;">
						<span class="font-family request-swap-title">${$t['sign-transaction']}</span>
						<span class="font-family request-swap-subtitle">${$t['sign-transaction-wallet']}</span>
					</div>
				`}
				
				
				
				<div style="display:flex;justify-content:center;padding-top:20px;">
					<stxcom-swap-step
						?isNeedApprove=${this.isNeedApprove}
						.approveState="${approveState}"
						.swapState="${swapState}"
						@to-approve=${this._toApprove}
						@to-swap=${this._transactionSend}
					></stxcom-swap-step>
				</div>
				
				
				
				
				
				
				
				${this.openApprove?html`
					<stxcom-swap-approve
						.amountIn="${this.amountIn}"
						.symbol="${this.symbol}"
						?isPermit=${this.permitTypedData?.permit_type?true:false}
						@close-approve=${this._closeClick}
						@approval-token=${this._approvalToken}
						@permit-token=${this._permitToken}
					></stxcom-swap-approve>
				`:null}
				
				
				${this.simulateError?html`
					<stxcom-swap-error
						.errorMag="${this.simulateData.message}"
						.errorType="${this.simulateData.code}"
						@refresh-quote=${this._onRefreshQuote}
						@swap-error-close=${this._onRefreshQuote}
						@swap-force-send=${this._transactionSend}
					></stxcom-swap-error>
				`:null}
				
				
				
				${this.txHash?html`
					<stxcom-swap-success
						.txhash=${this.txHash}
						?isSaveHash=${this.isSaveHash}
						.url=${networkData?.[sdkStore.chain]?.blockExplorer?.tx}
						@swap-success-close=${this._swapSuccessClose}
					></stxcom-swap-success>
				`:null}
				
				
				
				
			</div>
		`;
	}
	
	_onRefreshQuote() {
		this.dispatchEvent(new CustomEvent('refresh-swap', {
			bubbles: false,
			composed: false
		}));
		this._closeClick();
	}
	
	
	_closeClick() {
		this.permitTypedData = {};
		this.dispatchEvent(new CustomEvent('close-execute'));
	}
	_swapSuccessClose(){
		this.dispatchEvent(new CustomEvent('transaction-send-close'));
	}
	
}

if (!customElements.get('stxapp-swap-execute')) {
	customElements.define('stxapp-swap-execute', StxappSwapExecute);
}