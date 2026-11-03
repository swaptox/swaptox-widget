
import {
    LitElement,
    html,
    css
} from 'lit';

//import { sdkStore } from '../../data/store/store.js';
//import { StoreMixin } from '../../data/store/state-mixin.js';

import '../../icon/com-icon-close.js';
import './stxcom-wallet-content.js'

export class SwaptoxWallet extends LitElement/*StoreMixin()*/ {
    static properties = {
        
    };
	

	
	static styles = css`
	    :host {
	        display: contents;
	    }
	
	    dialog {
	        border: none;
	        padding: 0;
	        border-radius: 24px;
	        position: fixed;
	        width: 400px;
	        max-width: 100vw;
	        height: calc(100vh - 40px);
	        max-height: 100vh;
	        margin: 0;
	        inset: 0 0 0 auto;
			top: 20px;
			right: 20px;
	        box-sizing: border-box;
	        outline: none;
	        background-color: var(--stxui-modal-background-color, #fff);
	        overflow: hidden;
	    }
	
	    /* 从右向左滑入 */
	    @keyframes wallet-slide-in {
	        from {
	            transform: translateX(100%);
	            opacity: 0;
	        }
	        to {
	            transform: translateX(0);
	            opacity: 1;
	        }
	    }
	
	    dialog[open] {
	        animation: wallet-slide-in 0.28s cubic-bezier(0.22, 1, 0.36, 1);
	    }
	
	    /* 背景遮罩 */
	    @keyframes wallet-backdrop-fade-in {
	        from {
	            opacity: 0;
	            backdrop-filter: blur(0) saturate(0);
	            background-color: transparent;
	        }
	        to {
	            opacity: 1;
	            backdrop-filter: blur(12px) saturate(1.5);
	            background-color: rgba(0, 0, 0, 0.12);
	        }
	    }
	
	    dialog[open]::backdrop {
	        animation: wallet-backdrop-fade-in 0.2s ease-out forwards;
	    }
	
	    @keyframes bounceIn__modal132 {
	        0% {
	            transform: translate3d(0, 100px, 0);
	            opacity: 0;
	        }
	        to {
	            transform: translateZ(0);
	            opacity: 1;
	        }
	    }
	    	
	    @media (max-width: 520px) {
	        dialog {
	            width: 100vw;
	            margin: auto auto 0 auto;
	            inset: 0 0 auto 0;
				top: 100px;
	            border-bottom-left-radius: 0;
	            border-bottom-right-radius: 0;
				height: calc(100vh - 100px);
				max-height: calc(100vh - 100px);
	        }
	    	
	        dialog[open] {
	            animation: bounceIn__modal132 .25s ease;
	        }
	    }
	    	
	    @media (max-height: 500px) {
	        dialog {
	            margin: 0;
	            inset: 0;
	            border-radius: 0;
	            height: 100vh;
	            max-height: 100vh;
	        }
	    }
	
	    @media (prefers-reduced-motion: reduce) {
	        dialog[open],
	        dialog[open]::backdrop {
	            animation: none;
	        }
	    }

		
	`;
	

    

    constructor() {
        super();
        this._closeHandled = false;
        this._dialog = null;
        this._ensureGlobalStyles();
    }

    _ensureGlobalStyles() {
        const styleId = 'app-stx-modal-global-styles';

        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                body.app-stx-scroll-locked {
                    touch-action: none !important;
                    overflow: hidden !important;
                    overscroll-behavior: contain !important;
                }
            `;

            document.head.appendChild(style);
        }
    }

    firstUpdated() {
        this._dialog = this.renderRoot.querySelector('dialog');
        this._dialog.addEventListener('close', this._onDialogClose);
    }

    disconnectedCallback() {
        this._unlockScroll();
        if (this._dialog) {
            this._dialog.removeEventListener(
                'close',
                this._onDialogClose
            );
        }
        this._dialog = null;
        super.disconnectedCallback();
    }

    /**
     * 通过 JS 打开弹窗
     */
    async open() {
        await this.updateComplete;
        const dialog = this._dialog || this.renderRoot.querySelector('dialog');
        if (!dialog || dialog.open) return;
        this._closeHandled = false;
        dialog.showModal();
        this._lockScroll();
        this.dispatchEvent(new CustomEvent('open', {
            bubbles: true,
            composed: true
        }));
		const walletContent = this.shadowRoot.querySelector('#walletContent');
		walletContent._updateWalletBalance();
    }

    /**
     * 通过 JS 主动关闭弹窗
     */
    close() {
        const dialog = this._dialog;

        if (!dialog?.open) {
            this._finishClose();
            return;
        }

        dialog.close();
        // 实际清理统一交给 close 事件处理
    }

    /**
     * 原生 Dialog 关闭后触发：
     * 包括手机返回键、Escape、dialog.close() 等
     */
    _onDialogClose = () => {
        this._finishClose();
    };

    _finishClose() {
        if (this._closeHandled) return;

        this._closeHandled = true;
        this._unlockScroll();

        this.dispatchEvent(new CustomEvent('close', {
            bubbles: true,
            composed: true
        }));
    }

    _lockScroll() {
        document.body.classList.add('app-stx-scroll-locked');
    }

    _unlockScroll() {
        // 如果页面还有其他原生模态 Dialog 打开，则保留锁
        const anotherDialogOpen = Array.from(
            document.querySelectorAll('dialog[open]')
        ).some(dialog => dialog !== this._dialog);

        if (!anotherDialogOpen) {
            document.body.classList.remove('app-stx-scroll-locked');
        }
    }

    _handleMask(event) {
        // 只有点击 Dialog 本身的背景区域才算点击遮罩
        if (event.target !== event.currentTarget) return;
        this.close();
    }

    render() {
		//const $t = sdkStore.$t;
        return html`
            <dialog
                tabindex="-1"
                @click=${this._handleMask}
            >
                <stxcom-wallet-content id="walletContent"
					@close=${this.close}
				></stxcom-wallet-content>
            </dialog>
        `;
    }
}

if (!customElements.get('swaptox-wallet')) {
    customElements.define('swaptox-wallet', SwaptoxWallet);
}
