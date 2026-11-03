import { LitElement, html, css } from 'lit';

export class StxappLimitOptionalListModal extends LitElement {
    static properties = {
        open: { type: Boolean, reflect: true },
        styles: { type: String }, 
    };

    static styles = css`
        :host {
            display: contents; /* 让宿主不参与布局，直接由内部 dialog 定位 */
        }
        dialog {
            position: fixed;
            z-index: 2147483647;
            overflow: hidden;
            border: none;
			background: transparent;
            padding: 0;
            margin: 0; 
            outline: none;
            /* 增加最大宽高保护，防止溢出屏幕 */
            max-width: calc(100vw - 30px);
            max-height: calc(100vh - 30px);
			
			background-color: var(--stxui-modal-background-color, #fff);
        }
        
        /* 这里的伪元素选择器修正 */
        dialog::backdrop {
            background: transparent;
        }

        /* 动画逻辑优化：使用 transform-origin 让缩放更自然 */
        @keyframes modal-show {
            0% { opacity: 0; transform: scale(0.85); }
            100% { opacity: 1; transform: scale(1); }
        }
		@keyframes modal-special {
		    0% { opacity: 0; transform: scale(0.85) translateY(-50%); }
		    100% { opacity: 1; transform: scale(1) translateY(-50%); }
		}

        dialog[open] {
            display: block; /* 覆盖原生可能的 display 冲突 */
            animation: modal-show 0.15s cubic-bezier(0.4, 0, 0.2, 1) forwards;
			animation-fill-mode: forwards;
        }
        
		
		@keyframes modal-none {
		    0% {}
			52% { clip-path: inset(100%);visibility: hidden;display: none;}
		    100% { clip-path: inset(100%);visibility: hidden;display: none;}
		}
		
		
        dialog:not([open]) {
            display: none;
        }
		
		@keyframes modal-hide {
		    0% { opacity: 1; transform: scale(1); }
		    100% { opacity: 0; transform: scale(0.85); }
		}
		.dialog-hide {
		    animation: modal-hide 0.15s cubic-bezier(0.4, 0, 0.2, 1) forwards;
			animation-fill-mode: forwards;
		}
    `;

    constructor() {
        super();
        this.open = false;
        this.styles = '';
        this._autoCloseRef = this._handleGlobalAction.bind(this);
    }

    _handleGlobalAction(event) {
		//console.log('_handleGlobalAction:', event);
        const dialog = this.shadowRoot.querySelector('#stxapp-limit-optional-list-modal');
        if (event && (event.type === 'click'||event.type === 'touchstart'||event.type === 'mousedown') && event.composedPath().includes(dialog)) {
            return;
        }
        this.open = false;
        this.dispatchEvent(new CustomEvent('close', {
            bubbles: false,
            composed: false,
            detail: { source: event ? event.type : 'manual' }
        }));
    }

    _removeListeners() {
        window.removeEventListener('click', this._autoCloseRef, true);
        window.removeEventListener('scroll', this._autoCloseRef, true);
        window.removeEventListener('resize', this._autoCloseRef, true);
		window.removeEventListener('touchstart', this._autoCloseRef, true);
		window.removeEventListener('mousedown', this._autoCloseRef, true);
    }
	
	
	
	

    updated(changedProperties) {
        if (changedProperties.has('open')) {
            const dialog = this.shadowRoot.querySelector('#stxapp-limit-optional-list-modal');
            if (this.open) {
                this._removeListeners();
                // 延迟添加监听，确保不触发本次点击
				dialog.show(); 
                setTimeout(() => {
					// 弹出动作
                    window.addEventListener('click', this._autoCloseRef, true);
                    window.addEventListener('scroll', this._autoCloseRef, true);
                    window.addEventListener('resize', this._autoCloseRef, true);
					window.addEventListener('touchstart', this._autoCloseRef, true);
					window.addEventListener('mousedown', this._autoCloseRef, true);
                }, 8); // 10ms 足够跳过当前事件循环
            } else {
                dialog.close();
                this._removeListeners();
            }
        }
    }

    disconnectedCallback() {
        this._removeListeners();
        super.disconnectedCallback();
    }

    render() {
        return html`
            <dialog style="${this.styles}" id="stxapp-limit-optional-list-modal" @click="${this._stop}">
                <slot></slot>
            </dialog>
        `;
    }
	
	_stop(e) {
		if (e.stopPropagation) {e.stopPropagation();}
		if (e.preventDefault) {e.preventDefault();}
	}
	
}
if (!customElements.get('stxapp-limit-optional-list-modal')) {
	customElements.define('stxapp-limit-optional-list-modal', StxappLimitOptionalListModal);
}
