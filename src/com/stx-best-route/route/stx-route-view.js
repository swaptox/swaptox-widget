import {
	LitElement,
	html,
	css
} from 'lit';


import { sdkStore } from '../../../data/store/store.js';
import { StoreMixin } from '../../../data/store/state-mixin.js';


export class StxRouteView extends StoreMixin(LitElement) {
	static get properties() {
		return {
			feetext: {
				type: String
			},
			swapfee: {
				type: String
			},
			bestroutetext: {
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
		this.feetext = '';
		this.swapfee = '';
		this.bestroutetext = '';
		
		this.styles = '';
		this._autoCloseRef = this._handleGlobalAction.bind(this);
	}
	
	
	_handleGlobalAction(event) {
	    const dialog = this.shadowRoot.querySelector('#stx-route-view');
	    if (event && (event.type === 'click'||event.type === 'touchstart'||event.type==='mousedown') && event.composedPath().includes(dialog)) {
	        return;
	    }
	    this.open = false;
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
			52% { clip-path: inset(100%);visibility: hidden;top: -9999px;}
		    100% { clip-path: inset(100%);visibility: hidden;top: -9999px;}
		}
		.stx-route-view{
			position: absolute;
			z-index: 20;
			border-radius: 16px;box-shadow: 0px 15px 50px -12px rgba(0, 0, 0, 0.35);
			background-color: var(--stxui-modal-background-color, #fff);
			padding: 15px;
			padding-top: 10px;
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
		
		
		
		.best-route-text{
			font-size: 14px;
			user-select: none;
			font-family: var(--stxui-font-family);
			color: var(--stxui-theme-font-color, #999);
			white-space:nowrap;
			line-height: 22px;
			height: 22px;
		}
		
		
		.flex-layout{
			display: flex;flex-direction: row;align-items: center;
		}
		.route-view-body{
			height: 120px;
			border: 1px solid var(--stxui-modal-border-color, #eee);
			border-radius: 17px;
			background-color: var(--stxui-modal-content-background-color, #fbfbfb);
		}
		
		
		
		.powered-by-swaptox{
			font-size: 13px;
			user-select: none;
			font-family: var(--stxui-font-family);
			color: var(--stxui-theme-font-subcolor, #999);
			white-space:nowrap;
			opacity: 0.6;
		}
		
		
		
		.jiazai-route-body{
			display: var(--stxui-route-is-loading, none);
			position: absolute;
			top: -1px;
			left: -1px;
			right: -1px;
			bottom: -1px;
			z-index: 15;
			/*background-color: var(--stxui-skeleton-background-color, #f1f1f1);*/
			border-radius: 17px;
			overflow: hidden;
		}
		
		
		.skeleton-css{}
		.skeleton-css::after {
			position: absolute;
			top: 0; right: 0; bottom: 0; left: 0;
			background-image: var(--stxui-skeleton-background-load);
			background-size: 500% 500%;
			animation: skeleton 1.8s ease infinite;
			content: '';
		}
		@keyframes skeleton {
			0% {
				background-position: 100% 50%;
			}
			100% {
				background-position: 0 50%;
			}
		}
  `;




	render() {
		const $t = sdkStore.$t;
		return html`
			<div id="stx-route-view" class="stx-route-view ${this.open?'modal-open':'modal-close'}" style="${this.styles}">
				
				<div class="flex-layout" style="justify-content: space-between;padding-bottom: 10px;">
					<div style="height: 22px;position: relative;">
						<span class="best-route-text"
						>${this.bestroutetext}</span>
						
						<div class="jiazai-route-body skeleton-css" 
						style="top: 0px;left: -1px;right: -30px;bottom: -1px;border-radius: 8px;"></div>
						
					</div>
					<div class="flex-layout" style="height: 22px;column-gap: 6px;position: relative;">
						<span class="best-route-text"
						>${this.feetext}</span>
						<span class="best-route-text"
						>${this.swapfee}%</span>
						
						<div class="jiazai-route-body skeleton-css" 
						style="top: 0px;left: -30px;right: -1px;bottom: -1px;border-radius: 8px;"></div>
						
					</div>
				</div>
				
				
				<div class="route-view-body" style="position: relative;">
					
					
					<div style="position:absolute;left:15px;bottom:6px;z-index:5;">
						<span class="powered-by-swaptox">Powered by SwaptoX</span>
					</div>
					<div class="jiazai-route-body skeleton-css"></div>
				</div>
				
				
				
				<div style="padding-top:15px;padding-bottom: 5px;">
					<stxapp-button
						type="primary" 
						size="center"
						@_click=${this._confirm}
					>${$t['confirm']}</stxapp-button>
				</div>
				
			</div>
		`;
	}
	
	_onClose() {
		this.dispatchEvent(new CustomEvent('close', {
			detail: {},
			bubbles: false,
			composed: false
		}));
	}
	_confirm(){
		this._onClose();
	}
}


if (!customElements.get('stx-route-view')) {
	customElements.define('stx-route-view', StxRouteView);
}

