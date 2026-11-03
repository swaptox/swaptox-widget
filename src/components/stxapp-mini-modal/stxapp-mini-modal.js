import { LitElement, html, css } from 'lit';

export class StxAppMiniModal extends LitElement {
    static properties = {
        open: { type: Boolean, reflect: true },
        // 改名为 styles 更有通用感
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
            /* 
			border-radius: 16px;
			box-shadow: 0 4px 20px rgba(0,0,0,0.15); 
			box-shadow: 0 0 3px 0 rgba(0,0,0,.05), 0 4px 14px 0 rgba(0,0,0,.05);
            background: white;
			*/
			background: transparent;
            padding: 0;
            margin: 0; 
            outline: none;
            /* 增加最大宽高保护，防止溢出屏幕 */
            max-width: calc(100vw - 30px);
            max-height: calc(100vh - 30px);
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
		    0% { }
			52% { clip-path: inset(100%);visibility: hidden;display: none;}
		    100% { clip-path: inset(100%);visibility: hidden;display: none;}
		}
		
		
        dialog:not([open]) {
            display: none;
			/*transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
			transition-duration: 0.15s;
			transition-property: transform, opacity;
			pointer-events: none;
			opacity: 0;  transform: scale(0.85);
			animation: modal-none 0.34s linear 1 forwards;
			animation-fill-mode: forwards;*/
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
        const dialog = this.shadowRoot.querySelector('#stxapp-mini-modal');
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
        // 建议增加 resize 监听，屏幕变小时自动关闭，防止弹窗“飘”出屏幕
        window.removeEventListener('resize', this._autoCloseRef, true);
		window.removeEventListener('touchstart', this._autoCloseRef, true);
		window.removeEventListener('mousedown', this._autoCloseRef, true);
    }
	
	
	
	closeDialog(dialog) {
		/* console.log('this.open:', this.open);
		
	    // 1. 添加关闭动画类
	    dialog.classList.add('dialog-hide');
	    
		// 2. 监听动画结束
		const onAnimationEnd = () => {
			dialog.classList.remove('dialog-hide'); // 清理类名
			dialog.close(); // 真正关闭
			// 移除监听器，防止内存泄漏
			dialog.removeEventListener('animationend', onAnimationEnd);
		};
	
		dialog.addEventListener('animationend', onAnimationEnd); */
	}
	
	

    updated(changedProperties) {
        if (changedProperties.has('open')) {
            const dialog = this.shadowRoot.querySelector('#stxapp-mini-modal');
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
				//this.closeDialog(dialog);
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
            <dialog style="${this.styles}" id="stxapp-mini-modal" @click="${this._stop}">
                <slot></slot>
            </dialog>
        `;
    }
	
	_stop(e) {
		if (e.stopPropagation) {e.stopPropagation();}
		if (e.preventDefault) {e.preventDefault();}
	}
	
}
if (!customElements.get('stxapp-mini-modal')) {
	customElements.define('stxapp-mini-modal', StxAppMiniModal);
}
