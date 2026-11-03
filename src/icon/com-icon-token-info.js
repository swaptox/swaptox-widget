import {
	LitElement,
	html,
	css
} from 'lit';

import {cardInfo} from '../com/stx-token-card/stx-token-card-config.js';

export class comIconTokenInfo extends LitElement {
	static get properties() {
		return {
			isTouchDevice: {
				type: Boolean
			},
			clicktype: {
				type: String
			},
		};
	}

	constructor() {
		super();
		this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		this.clicktype = 'swap';
	}

	static get styles() {
		return css`
		:host {
			display: block;
		}
		.com-icon-token-info{
			position: relative;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			border-radius: 100px;
			border: 1px solid var(--stxui-icon-token-info-swap-border, #eee);
			background-color: var(--stxui-icon-token-info-swap-bg, #fff);
			height: 18px;
			width: 18px;
			transition: 
				border 0.2s ease-in-out,
				box-shadow 0.2s ease-in-out,
				opacity 0.2s ease-in-out;
		}
		.token-info-list{
			border: 1px solid var(--stxui-icon-token-info-list-border, #eee);
			background-color: var(--stxui-icon-token-info-list-bg, #fff);
		}

		
		
		.disabled-tag-false{
			cursor: pointer;
		}
		.disabled-tag-false:hover{
			border: 1px solid var(--stxui-theme-focus-color, #02b6a680);
			background-color: var(--stxui-list-item-bg-hover, #fbfbfb);
			box-shadow: 0 0 0 1px var(--stxui-theme-focus-color, #02b6a680);
		}
		.disabled-tag-false:active{
			opacity: 0.8;
			background-color: var(--stxui-list-item-bg-hover, #fbfbfb);
		}		
		
		
		
		.disabled-tag-true{
			opacity: 0.8;
			cursor: auto;
		}
		
		
		
		.on-click-css{
			position: absolute;
			top: -1px;
			left: -1px;
			right: -1px;
			bottom: -1px;
			z-index: 1;
		}
		.is-touch-swap{
			top: -6px;
			left: -8px;
			right: -10px;
			bottom: -8px;
		}
		
		.is-touch-list{
			top: -15px;
			left: -15px;
			right: -15px;
			bottom: -15px;
			border-radius: 100px;
		}
		
    `;
	}

	render() {
		return html`
		<div 
class="com-icon-token-info ${this.disabled?'disabled-tag-true':'disabled-tag-false'} ${'token-info-'+this.clicktype}">
			
			<svg t="1770455006029" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1595" 
			width="15" height="15"><path d="M552.96 643.072H471.04c-9.728 0-17.92-7.68-17.92-17.408L429.056 148.48c-0.512-10.24 7.68-18.944 17.92-18.944h129.024c10.24 0 18.944 8.704 17.92 18.944l-23.552 477.696c0 9.216-7.68 16.896-17.408 16.896z" 
			fill="var(--stxui-dark-theme-subcolor, #999)" p-id="1596"></path><path d="M512 817.664m-105.472 0a105.472 105.472 0 1 0 210.944 0 105.472 105.472 0 1 0-210.944 0Z" 
			fill="var(--stxui-dark-theme-subcolor, #999)" p-id="1597"></path></svg>
			
			<div @click=${this._onClick} 
			class="on-click-css ${this.isTouchDevice?'is-touch-'+this.clicktype:''}"></div>
			
		</div>
    `;
	}

	
	
	_onClick(e) {
	    const boundary = 20;
	    const width = cardInfo.width;
	    const height = cardInfo.height;
	    
	    // 获取视口宽高
	    const vw = window.innerWidth;
	    const vh = window.innerHeight;
	
	    const clientX = e.clientX || e.x;
	    const clientY = e.clientY || e.y;
	
	    let top = 0;
	    let left = 0;
	    let origins = [];
	
	    // --- 水平定位逻辑 ---
	    // 检查右侧空间是否足够
	    if (clientX + width + boundary <= vw) {
	        left = clientX + boundary;
	        origins.push('left');
	    } else {
	        // 空间不足，显示在左侧，并确保不超出屏幕左边界
	        left = Math.max(boundary, clientX - width - boundary);
	        origins.push('right');
	    }
	
	    // --- 垂直定位逻辑 ---
	    // 检查下方空间是否足够
	    if (clientY + height + boundary <= vh) {
	        top = clientY - (boundary/2);
	        origins.push('top'); // 修正：居下说明起源于上方
	    } else {
	        // 空间不足，显示在上方，确保不超出屏幕顶部
	        top = Math.max(boundary, clientY - height) + (boundary/2);
	        origins.push('bottom');
	    }
	
	    this.dispatchEvent(new CustomEvent('change', {
	        detail: { 
	            top: top, 
	            left: left, 
	            origin: origins.join(' ') // 转换为 CSS 可用的字符串
	        },
	        bubbles: false,
	        composed: false
	    }));
	}
	
}
if (!customElements.get('com-icon-token-info')) {
	customElements.define('com-icon-token-info', comIconTokenInfo);
}
