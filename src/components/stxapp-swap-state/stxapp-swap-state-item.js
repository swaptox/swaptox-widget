

import {
	LitElement,
	html,
	css
} from 'lit';

import { networkData } from '../../data/network-data.js';
import { $app } from '../../js_sdk/index.js';
import { isTransactionSuccess } from '../../api/chain/isTransactionSuccess';
import { checkTransaction } from '../../api/cloud/checkTransaction';
import '../../com/stx-token-logo.js';
import { loadingScheduleRender } from './loadingScheduleRender.js';

export class StxappSwapStateItem extends LitElement {
	static properties = {
		itemData: {type: Object},
		swapState: {type: String},
		isShowChainLogo: {type: Boolean},
	};
	constructor() {
		super();
		this.itemData = {};
		this.swapState = 'pending';//pending failed success
		this.isShowChainLogo = false;
	}


	static styles = css`
		:host {
			display: block;
		}
		.font-family{
			user-select: none;
			font-family: var(--stxui-font-family);
		}
		
		.zhongjian-zhuangtai{
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		
		.xiao-anniao{
			height: 16px;
			line-height: 16px;
			border-radius: 100px;
			-webkit-user-select: none;
			user-select: none;
			white-space: nowrap;
			padding: 1px 6px;
			font-size: 10px;
			color: #fff;
		}
		@media (max-width: 560px) {
			.xiao-anniao{
				pointer-events: none;
			}
		}
	`;
	
	
	
	willUpdate(changedProperties) {
	    if (changedProperties.has('itemData')) {
	        if (this.itemData && this.itemData?.hash && (this.itemData?.chainin||this.itemData?.chainout)) {
				this.isTransactionSuccess();
	        }
	    }
	}
	

	
	async isTransactionSuccess(){
		const _deadline = (parseInt(this.itemData.deadline)*1000+30000) - Date.now();
		const chain = this.itemData.type==='bridge'?this.itemData.chainout:this.itemData.chainin;
		const result = await isTransactionSuccess(chain, this.itemData.hash, _deadline);
		this.swapState = result?'success':'failed';
		this.dispatchEvent(
			new CustomEvent('state-change', {
				detail: this.swapState,
				bubbles: false,
				composed: false
			})
		);
		//更新数据库的交易状态
		checkTransaction({
			chain: chain,
			hash: this.itemData.hash
		});
	}
	
	
	

	render() {
		if(this.itemData.hide){
			return null;
		}
		const itemHeight = '26px';
		const symbolIn = this.itemData.symbolIn;
		const logoIn = this.itemData.logoIn;
		const symbolOut = this.itemData.symbolOut;
		const logoOut = this.itemData.logoOut;
		return html`
			<div style="position: relative;height: ${itemHeight};padding-bottom: 6px;">
				<div style="position: relative;z-index: 2;display: flex;flex-direction: row;align-items: center;justify-content: space-between;">
					<stx-token-logo
						size="${itemHeight}"
						.symbol="${symbolIn}" 
						.logo="${logoIn}"
					></stx-token-logo>
					<stx-token-logo
						size="${itemHeight}"
						.symbol="${symbolOut}" 
						.logo="${logoOut}"
					></stx-token-logo>
					
					
					<div style="${this.isShowChainLogo?'':'display:none;'}position:absolute;top:16px;left:16px;z-index:1;">
						<stx-token-logo
							size="12px"
							.symbol="${networkData[this.itemData.chainin].name}" 
							.logo="${networkData[this.itemData.chainin].logo}"
						></stx-token-logo>
					</div>
					
					<div style="${this.isShowChainLogo?'':'display:none;'}position:absolute;top:16px;right:-2px;z-index:1;">
						<stx-token-logo
							size="12px"
							.symbol="${networkData[this.itemData.chainout].name}" 
							.logo="${networkData[this.itemData.chainout].logo}"
						></stx-token-logo>
					</div>
					
				</div>
				
				
				
				
				${this.swapState==='pending'?html`
					<div class="zhongjian-zhuangtai" style="height: ${itemHeight};">
						<div style="position: relative;width:92px;height: 4px;left: -10px;">
							<div style="position: absolute;top:-24px;right:-6px;">
								<svg t="1791924098688" class="icon" viewBox="0 0 4608 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6352" width="52" height="52"><path d="M3840 0l768 512-768 512V640H0V384h3840z" 
								fill="var(--stxui-theme-color, #02b6a6)" p-id="6353"></path></svg>
							</div>
							<div style="position: relative;z-index: 1;left: -11px;">
								${loadingScheduleRender()}
							</div>
						</div>
					</div>
					
					<div class="zhongjian-zhuangtai" style="right:6px;height: ${itemHeight};z-index: 2;">
						<div @click=${this._toTxhash} class="xiao-anniao font-family" 
						style="background-color:#eaeaea;color:#353535;cursor:pointer;">Pending</div>
					</div>
					
				`:null}
				
				
				
				
				${this.swapState==='success'?html`
					<div class="zhongjian-zhuangtai" style="height: ${itemHeight};">
						<div style="position: relative;width:92px;height: 4px;left: -10px;
							background-color: var(--stxui-theme-color, #02b6a6);">
							<div style="position: absolute;top:-24px;right:-6px;">
								<svg t="1791924098688" class="icon" viewBox="0 0 4608 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6352" width="52" height="52"><path d="M3840 0l768 512-768 512V640H0V384h3840z" 
								fill="var(--stxui-theme-color, #02b6a6)" p-id="6353"></path></svg>
							</div>
						</div>
					</div>
					<div class="zhongjian-zhuangtai" style="right:6px;height: ${itemHeight};z-index:3;">
						<div @click=${this._toTxhash} class="xiao-anniao font-family" 
						style="background-color: var(--stxui-theme-color, #02b6a6);cursor:pointer;">Success</div>
					</div>
				`:null}
				
				
				
				
				${this.swapState==='failed'?html`
					<div class="zhongjian-zhuangtai" style="height: ${itemHeight};">
						<div style="position: relative;width:92px;height: 4px;left: -10px;
							background-color: #e64340;">
							<div style="position: absolute;top:-24px;right:-6px;">
								<svg t="1791924098688" class="icon" viewBox="0 0 4608 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6352" width="52" height="52"><path d="M3840 0l768 512-768 512V640H0V384h3840z" 
								fill="#e64340" p-id="6353"></path></svg>
							</div>
						</div>
					</div>
					<div class="zhongjian-zhuangtai" style="right:6px;height: ${itemHeight};z-index: 2;">
						<div @click=${this._toTxhash} class="xiao-anniao font-family" 
						style="background-color: #e64340;cursor:pointer;">Failed</div>
					</div>
				`:null}
				
				
				
			</div>
		`;
	}
	
	
	_toTxhash(){
		window.swaptox.widget.$el.swap.openTransactionDetails({...this.itemData, status: this.swapState});
	}
	
	
}

if (!customElements.get('stxapp-swap-state-item')) {
	customElements.define('stxapp-swap-state-item', StxappSwapStateItem);
}