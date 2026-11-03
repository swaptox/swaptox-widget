

import {
	LitElement,
	html,
	css
} from 'lit';


import { sdkStore } from '../../../../data/store/store.js';
import { StoreMixin } from '../../../../data/store/state-mixin.js';

import '../../../../components/stxapp-button/stxapp-button.js';
import '../icon/stxcom-icon-small-load.js';


export class StxappSwapStep extends StoreMixin(LitElement) {
	static properties = {
		approveState: {
			type: String
		},
		swapState: {
			type: String
		},
		isNeedApprove: {
			type: Boolean
		},
	};
	constructor() {
		super();
		this.approveState = '';//load error success
		this.swapState = '';
		this.isNeedApprove = false;//是否需要批准
	}


	static styles = css`
		:host {
			display: block;
		}
		.font-family{
			user-select: none;
			font-family: var(--stxui-font-family);
		}
		
		.swap-step{
			display: flex;
			flex-direction: row;
			align-items: center;
			padding-top: 10px;
			padding-bottom: 80px;
		}
		.dian-buzhou-body{
			position: relative;
			z-index: 1;
			width: 16px;
			height: 16px;
			border-radius: 100px;
			background-color: var(--stxui-small-load-yuan-bg);
		}
		.zhongjian-xxx{
			position: absolute;
			left: -4px;
			right: -4px;
			top: 0px;
			bottom: 0px;
			background-color: var(--stxui-small-load-yuan-bg);
			transition-timing-function: ease;
			transition-duration: 0.15s;
			transition-property: background-color;
		}
		
		.kuoda-body-sl{
			position: absolute;
			left: -70px;
			top: 0px;
			right: -70px;
			bottom: -96px;
			display: flex;
			flex-direction: column;
			align-items: center;justify-content: center;
		}
		.shouquan-wenzi-text{
			font-size: 15px;
			color: var(--stxui-theme-font-color, #111);
		}
	`;
	

	render() {
		const $t = sdkStore.$t;
		return html`
			<div class="swap-step">
				
				${this.isNeedApprove?html`
					<div class="dian-buzhou-body">
						<stxcom-icon-small-load .state="${this.approveState}"></stxcom-icon-small-load>
						<div class="kuoda-body-sl">
							<text class="font-family shouquan-wenzi-text">Approve</text>
							<div style="padding-top:10px;height:38px;min-height:38px;">
								${this.approveState==='error'?html`
									<stxapp-button
										type="primary" 
										size="center"
										@_click=${this._onApprove}
									>${$t['approve']}</stxapp-button>
								`:null}
							</div>
						</div>
					</div>
					<div style="position: relative;height: 4px;width: 200px;">
						<div class="zhongjian-xxx" style="${this.approveState==='success'?'background-color: #02b6a6;':''}"></div>
					</div>
				`:null}
				
				
				
				<div class="dian-buzhou-body">
					<stxcom-icon-small-load .state="${this.swapState}"></stxcom-icon-small-load>
					<div class="kuoda-body-sl">
						<text class="font-family shouquan-wenzi-text">Swap</text>
						<div style="padding-top:10px;height:38px;min-height:38px;">
							${this.swapState==='error'?html`
								<stxapp-button
									type="primary" 
									size="center"
									@_click=${this._onSwap}
								>${$t['sign-transaction']}</stxapp-button>
							`:null}
						</div>
					</div>
				</div>
				
			</div>
		`;
	}
	
	
	_onApprove(){
		this.dispatchEvent(new CustomEvent('to-approve'));
	}
	
	
	_onSwap() {
		this.dispatchEvent(new CustomEvent('to-swap'));
	}
	
	
}

if (!customElements.get('stxcom-swap-step')) {
	customElements.define('stxcom-swap-step', StxappSwapStep);
}