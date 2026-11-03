import {
	LitElement,
	html,
	css
} from 'lit';

import './stxapp-transactions-record.js';

export class SwaptoxTransactionsRecordModal extends LitElement {
	static properties = {
		open: {
			type: Boolean,
			reflect: true
		},
	};

	static styles = css`
		:host {
			display: none; /* 默认隐藏，不占位 */
			margin: 0;
			padding: 0;
		}
		:host([open]) {
			display: block;
		}

		dialog {
			border: none;
			padding: 0;
			border-radius: 20px;
			
			position: fixed;
			/* 1. 设置固定宽度 */
			width: 980px;
			max-width: 100vw; /* 响应式：防止在小屏幕上溢出 */
			
			/* 2. 核心居中代码 */
			margin: auto;     /* 配合 showModal 的 fixed 定位实现自动居中 */
			inset: 0;        /* 确保四周距离参考系为 0，让 margin: auto 有效空间 */
			
			/* 3. 这里的布局 */
			box-sizing: border-box;
			outline: none;    /* 移除默认的点击黑边 */
			background-color: var(--stxui-modal-background-color, #fff);
			overflow: hidden;
			/* transition: border-radius 0.2s ease-in-out; */
		}
		
		
		@keyframes bounceIn__modal123 {
			0%{transform:translate3d(0,-20px,0);opacity:0}
			to{transform:translateZ(0);opacity:1}
		}
		dialog[open] {
			animation: bounceIn__modal123 0.25s ease;
		}		
		
		
		@keyframes bounceIn__modal132 {
			0%{transform:translate3d(0,100px,0);opacity:0}
			to{transform:translateZ(0);opacity:1}
		}
		@media (max-width: 520px) {
			dialog {
				width: 100vw;
				max-width: 100vw;
				margin: auto auto 0 auto;
				inset: auto 0 0 0;
				border-bottom-left-radius: 0px;
				border-bottom-right-radius: 0px;
			}
			dialog[open] {
				animation: bounceIn__modal132 0.25s ease;
			}
		}
		@media (max-height: 500px) {
			dialog {
				margin: 0 0 0 0;
				inset: 0 0 0 0;
				border-radius: 0px;
				height: 100vh;
				max-height: 100vh;
			}
		}
		
		
		
		
		
		
		
		@keyframes backdrop-fade-in {
		    from {
		        opacity: 0;
		        backdrop-filter: blur(0px) saturate(0);
		        background-color: transparent;
		    }
		    to {
		        opacity: 1;
		        backdrop-filter: blur(12px) saturate(1.5);
		        background-color: rgba(0, 0, 0, .12);
		    }
		}
		dialog[open]::backdrop {
		    animation: backdrop-fade-in 0.2s ease-out forwards;
		}
		
		
		

		
		
  `;

	constructor() {
		super();
		this.open = false;
		// 静态插入全局 CSS 规则（只需在组件生命周期内确保执行一次）
		this._ensureGlobalStyles();
	}

	/**
	 * 核心：确保全局锁定类存在
	 */
	_ensureGlobalStyles() {
		const styleId = 'app-stx-modal-global-styles-764';
		if (!document.getElementById(styleId)) {
			const style = document.createElement('style');
			style.id = styleId;
			style.textContent = `
				body.stxapp-transactions-record-modal-scroll-locked {
					touch-action: none !important;
					overflow: hidden !important;
					overscroll-behavior: contain !important;
				}
			`;
			document.head.appendChild(style);
		}
	}
	
	
	async closeDialog(dialog) {
	    // 使用原生 animate 方法
	    const animation = dialog.animate([
	        { opacity: 1, transform: 'scale(1)' },
	        { opacity: 0, transform: 'scale(0.85)' }
	    ], {
	        duration: 2200,
	        easing: 'ease-in'
	    });
	
	    // 等待动画完成
	    await animation.finished;
	    
	    dialog.close();
	}
	

	updated(changedProperties) {
		if (changedProperties.has('open')) {
			const dialog = this.shadowRoot.querySelector('dialog');
			if (this.open) {
				dialog.showModal();
				this._lockScroll();
				if(!this._isMonitorClose){
					this._isMonitorClose = true;
					dialog.addEventListener('close', () => {
						this._unlockScroll();
						this._handleMask();
					});
				}
			} else {
				dialog.close();
				//this.closeDialog(dialog);
				this._unlockScroll();
			}
		}
	}

	_lockScroll() {
		document.body.classList.add('stxapp-transactions-record-modal-scroll-locked');
	}

	_unlockScroll() {
		document.body.classList.remove('stxapp-transactions-record-modal-scroll-locked');
	}

	// 组件卸载时的安全守卫
	disconnectedCallback() {
		super.disconnectedCallback();
		this._unlockScroll();
	}

	_handleMask() {
		this.dispatchEvent(new CustomEvent('close-modal'));
	}

	render() {
		return html`
		<dialog @click="${this._handleMask}" tabindex="-1">
			<swaptox-transactions-record
				isModal=${true}
				borderColor="var(--stxui-transactions-record-modal-border, #eee)"
				@close-modal=${this._handleMask}
			></swaptox-transactions-record>
		</dialog>
    `;
	}
}




if (!customElements.get('swaptox-transactions-record-modal')) {
	customElements.define('swaptox-transactions-record-modal', SwaptoxTransactionsRecordModal);
}
