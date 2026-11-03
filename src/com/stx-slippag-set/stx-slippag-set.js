import {
	LitElement,
	html,
	css
} from 'lit';

//拖动滑块
//import './com/com-slippag-slider.js';
/* <div style="padding-top:10px;padding-right:2px;">
					<com-slippag-slider
						.value="${this.selectedId==='custom'?parseFloat(this.customValue)*100:this.value*100}"
						@slider-change="${this._sliderShange}"
					></com-slippag-slider>
				</div> 
_sliderShange(e){
		this.customValue = e.detail.value/100;
		this.selectedId = 'custom';
		//console.log('customValue', e.detail.value/100);
	}
*/

import { sdkStore } from '../../data/store/store.js';
import { StoreMixin } from '../../data/store/state-mixin.js';

import './com/com-slippag-input.js';
import './com/com-slippag-tips.js';
import '../../components/stxapp-button/stxapp-button.js';
import {$app} from '../../js_sdk/index.js';


export class StxSlippagSet extends StoreMixin(LitElement) {
	static get properties() {
		return {
			selectedId: {
				type: String
			},
			value: {
				type: Number
			},
			customValue: {
				type: String
			},
			refid: {
				type: String
			},
			tipsposition: {
				type: String
			},
			styles: {
				type: String
			},
			open: {
				type: Boolean
			},
		};
	}
	
	constructor() {
		super();
		this.open = false;
		this.selectedId = '05';
		this.value = 0.5;
		this.customValue = '0.5';
		this.refid = '';
		this.tipsposition = 'top';
		this.styles = '';
		this._autoCloseRef = this._handleGlobalAction.bind(this);
	}
	
	
	_handleGlobalAction(event) {
		//console.log('_handleGlobalAction:', event);
	    const dialog = this.shadowRoot.querySelector('#stx-slippag-set');
	    if (event && (event.type === 'click'||event.type === 'touchstart'||event.type==='mousedown') && event.composedPath().includes(dialog)) {
	        return;
	    }
	    this.open = false;
	    /* this.dispatchEvent(new CustomEvent('close', {
	        bubbles: false,
	        composed: false,
	        detail: { source: event ? event.type : 'manual' }
	    })); */
		this._onClose();
	}
	
	_removeListeners() {
	    window.removeEventListener('click', this._autoCloseRef, true);
	    window.removeEventListener('scroll', this._autoCloseRef, true);
	    window.removeEventListener('resize', this._autoCloseRef, true);
		window.removeEventListener('touchstart', this._autoCloseRef, true);
		window.removeEventListener('mousedown', this._autoCloseRef, true);
	}
	
	
	willUpdate(changedProperties) {
	    if (changedProperties.has('refid')) {
	        if (this.refid) {
				const huancun = $app.getStorageSync(this.refid);
				if(huancun&&huancun?.id){
					this.selectedId = huancun?.id;
					this.value = huancun?.value;
					this.customValue = huancun?.custom;
				}
				this._change();
	        }
	    }
		if (changedProperties.has('open')) {
		    if (this.open) {
		        this._removeListeners();
		        setTimeout(() => {
		            window.addEventListener('click', this._autoCloseRef, true);
		            window.addEventListener('scroll', this._autoCloseRef, true);
		            window.addEventListener('resize', this._autoCloseRef, true);
		    		window.addEventListener('touchstart', this._autoCloseRef, true);
					window.addEventListener('mousedown', this._autoCloseRef, true);
		        }, 10); // 10ms 足够跳过当前事件循环
		    } else {
		        this._removeListeners();
		    }
		}
	}
	
	
	
	
	static styles = css`
		:host {
			display: block;
		}
		@keyframes modal-none {
		    0% { }
			52% { clip-path: inset(100%);visibility: hidden;left: -9999px;}
		    100% { clip-path: inset(100%);visibility: hidden;left: -9999px;}
		}
		.stx-slippag-set{
			position: absolute;
			z-index: 20;
			width: 280px;
			min-width: 280px;
			border-radius: 16px;box-shadow: 0px 15px 50px -12px rgba(0, 0, 0, 0.35);
			background-color: var(--stxui-modal-background-color, #fff);
			padding: 15px 0;
			padding-bottom: 10px;
			user-select:none;
			
			transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
			transition-duration: 0.15s;
			transition-property: transform, opacity;
		}
		.modal-close{
			pointer-events: none;
			opacity: 0;  transform: scale(0.85);
			animation: modal-none 0.34s linear 1 forwards;
			animation-fill-mode: forwards;
		}
		.modal-open{
			opacity: 1;  transform: scale(1);
		}
		
		
		
		
		
		.set-slippag-title{
			font-size: 14px;
			user-select: none;
			font-family: var(--stxui-font-family);
			color: var(--stxui-theme-font-color, #999);
			padding: 0 15px;
			padding-bottom: 10px;
		}
		
		
		
		
		
		
		
		
		
		.com-selection{
			position: relative;z-index: 1;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			column-gap: 8px;
			padding: 0 15px;
			padding-bottom: 10px;
			padding-top: 5px;
		}
		.huadian-body{
			box-shadow: 0 0 0 1px var(--stxui-modal-border-color, #ddd);
			background-color: var(--stxui-modal-content-background-color, #fbfbfb);
			height: 30px;
			border-radius: 100px;
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			transition:
				background-color 0.2s ease,
				box-shadow 0.2s ease;
		}
		
		.huadian-body:hover {
			box-shadow: 0 0 0 1px var(--stxui-theme-color, #02b6a6);
			background-color: #02b6a60d;
		}
		
		.slippag-low{}
		.slippag-low:hover {
			box-shadow: 0 0 0 1px #ff8585;
			background-color: #ff000012;
		}
		
		
		
		.slippag-value{
			font-size: 15px;
			color: var(--stxui-dark-theme-subcolor, #999);
			user-select: none;
			font-family: var(--stxui-font-family);
		}
		.huadsd-color{
			color:var(--stxui-theme-color, #02b6a6);
		}
		
		.selected-div{
			cursor: auto;
			box-shadow: 0 0 0 1px var(--stxui-theme-color, #02b6a6);
			background-color: #02b6a60d;
		}
		.selected-text{
			color:var(--stxui-theme-color, #02b6a6);
		}
		
		.selected-div-low{
			cursor: auto;
			box-shadow: 0 0 0 1px #ff8585;
			background-color: #ff000012;
		}
		.selected-error{
			color:#fd0000;
		}
		
		
		
		
		.tips-element {
		    opacity: 0;
		    max-height: 0px;
		    overflow: hidden;
		    /* 初始状态：被裁剪成一条线 */
		    clip-path: inset(0 0 100% 0); 
		    transition: 
		        max-height 0.3s ease,
		        clip-path 0.3s ease,
		        opacity 0.2s ease;
		}
		.tips-show {
		    opacity: 1;
		    max-height: 82px;
		    /* 展开状态：裁剪区域全开 */
		    clip-path: inset(0 0 0% 0);
		}
		
		
		.div-none{
			display: none;
		}
  `;




	render() {
		
		let tipsType = '';
		try {
			if(this.value){
				if(this.value<0.1){
					tipsType = 'error';
				}else if(this.value>1){
					tipsType = 'warn';
				}
			}
		} catch (e) {}
		
		const $t = sdkStore.$t;
		return html`
			<div id="stx-slippag-set" class="stx-slippag-set ${this.open?'modal-open':'modal-close'}" style="${this.styles}">
				<div class="set-slippag-title">${$t['slippage-set']}</div>
				
				
				${this.tipsposition==='top'?html`
					<div class="tips-element ${tipsType==='error'?'tips-show':tipsType==='warn'?'div-none':'0'}">
						<div style="padding: 0 15px;padding-bottom: 10px;padding-top:5px;">
							<com-slippag-tips
								.maxtips="${$t['slippage-tolerance-max-tips']}"
								.mintips="${$t['slippage-tolerance-min-tips']}"
								tipstype="error"
							></com-slippag-tips>
						</div>
					</div>
					<div class="tips-element ${tipsType==='warn'?'tips-show':tipsType==='error'?'div-none':'0'}">
						<div style="padding: 0 15px;padding-bottom: 10px;padding-top:5px;">
							<com-slippag-tips
								.maxtips="${$t['slippage-tolerance-max-tips']}"
								.mintips="${$t['slippage-tolerance-min-tips']}"
								tipstype="warn"
							></com-slippag-tips>
						</div>
					</div>
				`:``}

				
				
				
				<div class="com-selection">
					<div @click="${()=>{this._select('005', 0.05)}}" class="huadian-body slippag-low ${this.selectedId==='005'?'selected-div-low':''}">
						<span class="slippag-value ${this.selectedId==='005'?'selected-error':''}">0.05%</span>
					</div>
					<div @click="${()=>{this._select('01', 0.1)}}" class="huadian-body ${this.selectedId==='01'?'selected-div':''}">
						<span class="slippag-value ${this.selectedId==='01'?'selected-text':''}">0.1%</span>
					</div>
					<div @click="${()=>{this._select('05', 0.5)}}" class="huadian-body ${this.selectedId==='05'?'selected-div':''}">
						<span class="slippag-value ${this.selectedId==='05'?'selected-text':''}">0.5%</span>
					</div>
					<div @click="${()=>{this._select('1', 1)}}" class="huadian-body ${this.selectedId==='1'?'selected-div':''}">
						<span class="slippag-value ${this.selectedId==='1'?'selected-text':''}">1%</span>
					</div>
				</div>
				
				
				<div style="padding: 0 15px;">
					<com-slippag-input 
						.customtext="${$t['custom']}"
						.selected="${this.selectedId==='custom'?true:false}"
						.value="${this.customValue}"
						@input-slippag="${this._inputSlippag}"
					></com-slippag-input>
				</div>
				
				
				
				<div style="padding: 0 15px;padding-top:15px;padding-bottom: 5px;">
					<stxapp-button
						type="primary" 
						size="center"
						@_click=${this._confirm}
					>${$t['confirm']}</stxapp-button>
				</div>
				
				
				
				${this.tipsposition==='top'?``:html`
					<div class="tips-element ${tipsType==='error'?'tips-show':tipsType==='warn'?'div-none':'0'}">
						<div style="padding: 0 15px;padding-bottom: 5px;padding-top:10px;">
							<com-slippag-tips
								.maxtips="${$t['slippage-tolerance-max-tips']}"
								.mintips="${$t['slippage-tolerance-min-tips']}"
								tipstype="error"
							></com-slippag-tips>
						</div>
					</div>
					<div class="tips-element ${tipsType==='warn'?'tips-show':tipsType==='error'?'div-none':'0'}">
						<div style="padding: 0 15px;padding-bottom: 5px;padding-top:10px;">
							<com-slippag-tips
								.maxtips="${$t['slippage-tolerance-max-tips']}"
								.mintips="${$t['slippage-tolerance-min-tips']}"
								tipstype="warn"
							></com-slippag-tips>
						</div>
					</div>					
				`}

				
				
				
				
			</div>
		`;
	}
	
	_select(id, value) {
		this.selectedId = id;
		this.value = value;
		this.customValue = `${value}`;
		this._cache();
		this._change();
	}
	_inputSlippag(e){
		this.customValue = e.detail.value;
		this.value = parseFloat(this.customValue);
		this.selectedId = 'custom';
		this._cache();
		this._change();
	}
	_cache(){
		$app.setStorageSync(this.refid, {
			'id': this.selectedId,
			'value': this.value,
			'custom': this.customValue,
		});
	}
	
	
	_change(){
		this.dispatchEvent(new CustomEvent('change', {
		    detail: {
				'id': this.selectedId,
				'value': this.value,
				'custom': this.customValue,
			},
		    bubbles: false,
		    composed: false
		}));
	}
	_onClose() {
		this.dispatchEvent(new CustomEvent('close', {
			detail: {},
			bubbles: false,
			composed: false
		}));
	}
	_confirm(){
		this._change();
		this._onClose();
		//console.log('customValue', this.customValue);
	}
	
}
if (!customElements.get('stx-slippag-set')) {
	customElements.define('stx-slippag-set', StxSlippagSet);
}
