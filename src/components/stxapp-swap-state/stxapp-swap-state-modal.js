
import { LitElement, html, css } from 'lit';

import { sdkStore } from '../../data/store/store.js';
import { StoreMixin } from '../../data/store/state-mixin.js';

import './stxapp-swap-state.js';

const MODAL_WIDTH = 160;
const MODAL_HEIGHT = 45;
const EDGE_GAP = 0;
const INITIAL_TOP = 70;

export class StxappSwapStateModal extends StoreMixin(LitElement) {
    static properties = {
        styles: { type: String },
        isTopBoxShadow: { type: Boolean }
    };

    static styles = css`
        :host {
            display: contents;
        }

        dialog {
            position: fixed;
            z-index: 2147483647;
            overflow: hidden;
            border: none;
            background-color: var(--stxui-swap-mini-state-modal-bg, #fff);
            border-radius: 18px;
            box-shadow: var(--stxui-swap-mini-state-modal-border, 0px 15px 50px -12px rgba(0, 0, 0, 0.35));
            width: 160px;
            padding: 0;
            margin: 0;
            outline: none;
            max-width: 160px;
            max-height: 206px;
            top: 70px;
            left: 0;
        }

        dialog::backdrop {
            background: transparent;
        }

        @keyframes modal-show {
            0% {
                opacity: 0;
                transform: scale(0.85);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes modal-special {
            0% {
                opacity: 0;
                transform: scale(0.85) translateY(-50%);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(-50%);
            }
        }

        dialog[open] {
            display: block;
            animation: modal-show 0.15s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            animation-fill-mode: forwards;
        }

        @keyframes modal-none {
            0% {}
            52% {
                clip-path: inset(100%);
                visibility: hidden;
                display: none;
            }
            100% {
                clip-path: inset(100%);
                visibility: hidden;
                display: none;
            }
        }

        dialog:not([open]) {
            display: none;
        }

        @keyframes modal-hide {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(0.85);
            }
        }

        .dialog-hide {
            animation: modal-hide 0.15s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            animation-fill-mode: forwards;
        }

        .font-family {
            user-select: none;
            font-family: var(--stxui-font-family);
        }

        .swap-state-title {
            box-sizing: border-box;
            font-size: 14px;
            color: var(--stxui-theme-font-color, #111);
            line-height: 24px;
        }
    `;

    constructor() {
        super();

        this.styles = '';
        this.isTopBoxShadow = false;

        this._isOpen = false;

        this._dragging = false;
        this._dragPointerId = null;

        this._startX = 0;
        this._startY = 0;
        this._startLeft = 0;
        this._startTop = 0;

        this._positionInitialized = false;

        this._startDrag = this._startDrag.bind(this);
        this._drag = this._drag.bind(this);
        this._endDrag = this._endDrag.bind(this);
        this._handleResize = this._handleResize.bind(this);
    }

    firstUpdated() {
        window.addEventListener('resize', this._handleResize);
    }

    _getDialog() {
        return this.renderRoot.querySelector(
            '#swaptox-mini-swap-state'
        );
    }

    /**
     * 获取窗口实际尺寸和允许移动的边界。
     */
    _getBounds() {
        //const dialog = this._getDialog();

        //const rect = dialog?.getBoundingClientRect();

        const width = 160;//rect?.width || 160;
        const height = 45;//rect?.height || 45;

        return {
            maxLeft: Math.max(
                EDGE_GAP,
                window.innerWidth - width - EDGE_GAP
            ),
            maxTop: Math.max(
                EDGE_GAP,
                window.innerHeight - height - EDGE_GAP
            )
        };
    }

    /**
     * 更新窗口位置。
     * 只修改 left 和 top，不触发 Lit 更新。
     */
    _setPosition(left, top) {
        const dialog = this._getDialog();

        if (!dialog) return;

        const { maxLeft, maxTop } = this._getBounds();

        const nextLeft = Math.min(
            maxLeft,
            Math.max(EDGE_GAP, left)
        );

        const nextTop = Math.min(
            maxTop,
            Math.max(EDGE_GAP, top)
        );

        dialog.style.left = `${nextLeft}px`;
        dialog.style.top = `${nextTop}px`;
    }

    /**
     * 初始化窗口位置。
     */
    _initPosition() {
        const dialog = this._getDialog();

        if (!dialog) return;

        if (!this._positionInitialized) {
            const bodyWidth = document.body.getBoundingClientRect().width;
            const pageTotalWidth = document.documentElement.scrollWidth;
            const pagePadding = (pageTotalWidth - bodyWidth) / 2;

            let left;
 
            if (pagePadding > 0) {
                left = window.innerWidth - MODAL_WIDTH - pagePadding;
            } else {
                left = window.innerWidth - MODAL_WIDTH - 15;
            }

            this._setPosition(left, INITIAL_TOP);

            this._positionInitialized = true;

            return;
        }

        this._clampPosition();
    }

    /**
     * 确保窗口不会超出屏幕。
     */
    _clampPosition() {
        const dialog = this._getDialog();

        if (!dialog) return;

        const left = parseFloat(dialog.style.left) || 0;
        const top = parseFloat(dialog.style.top) || 0;

        this._setPosition(left, top);
    }

    /**
     * 开始拖拽。
     */
    _startDrag(e) {
        if (!this._isOpen || !e.isPrimary) return;

        if (e.pointerType === 'mouse' && e.button !== 0) {
            return;
        }

        // 点击关闭按钮不启动拖拽。
        if (
            e.composedPath().some(
                node => node?.tagName === 'COM-ICON-CLOSE'
            )
        ) {
            return;
        }

        const dialog = this._getDialog();

        if (!dialog) return;

        const rect = dialog.getBoundingClientRect();

        this._startX = e.clientX;
        this._startY = e.clientY;

        this._startLeft = rect.left;
        this._startTop = rect.top;

        this._dragging = true;
        this._dragPointerId = e.pointerId;

        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch {}

        if (e.cancelable) {
            e.preventDefault();
        }
    }

    /**
     * 拖拽移动。
     */
    _drag(e) {
        if (!this._dragging) return;

        if (e.pointerId !== this._dragPointerId) {
            return;
        }

        const left = this._startLeft + e.clientX - this._startX;
        const top = this._startTop + e.clientY - this._startY;

        this._setPosition(left, top);

        if (e.cancelable) {
            e.preventDefault();
        }
    }

    /**
     * 结束拖拽。
     */
    _endDrag(e) {
        if (!this._dragging) return;

        if (
            e.pointerId !== undefined &&
            e.pointerId !== this._dragPointerId
        ) {
            return;
        }

        this._dragging = false;
        this._dragPointerId = null;
    }

    /**
     * 浏览器窗口大小变化。
     */
    _handleResize() {
        if (!this._positionInitialized) return;

        this._clampPosition();
    }

    /**
     * 外部调用：打开窗口。
     */
    async open() {
        await this.updateComplete;

        const dialog = this._getDialog();

        if (!dialog) return;

        if (this._isOpen) {
            this._clampPosition();
            return;
        }

        this._isOpen = true;

        if (!dialog.open) {
            dialog.show();
        }

        // 等待浏览器完成布局，获取准确尺寸。
        await new Promise(resolve => {
            requestAnimationFrame(resolve);
        });

        this._initPosition();
    }

    /**
     * 外部或内部调用：关闭窗口。
     */
    close() {
        const dialog = this._getDialog();

        this._isOpen = false;

        this._dragging = false;
        this._dragPointerId = null;

        if (dialog?.open) {
            dialog.close();
        }
    }

    /**
     * 当前窗口是否打开。
     */
    get isOpen() {
        return this._isOpen;
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        window.removeEventListener(
            'resize',
            this._handleResize
        );

        this._dragging = false;
        this._dragPointerId = null;
    }

    render() {
        return html`
            <dialog
                style="${this.styles}"
                id="swaptox-mini-swap-state"
                @click="${this._stop}"
            >
                <div
                    id="stateTopNav"
                    @pointerdown="${this._startDrag}"
                    @pointermove="${this._drag}"
                    @pointerup="${this._endDrag}"
                    @pointercancel="${this._endDrag}"
                    @lostpointercapture="${this._endDrag}"
                    style="
                        position: relative;
                        z-index: 5;
                        padding: 12px;
                        padding-bottom: 10px;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        cursor: move;
                        touch-action: none;
                        user-select: none;
                        ${this.isTopBoxShadow
                            ? 'box-shadow: var(--stxui-swap-mini-state-nav-border);'
                            : ''}
                    "
                >
                    <div class="font-family swap-state-title">
                        ${sdkStore.$t['swap-status']}
                    </div>

                    <com-icon-close
                        @change="${this._closeSwapState}"
                        size="mini"
                    ></com-icon-close>
                </div>

                <stxapp-swap-state
                    id="swapStateList"
                    .chain="${sdkStore.chain}"
                    @hide-nav-top-true="${() => {
                        this.isTopBoxShadow = false;
                    }}"
                    @hide-nav-top-false="${() => {
                        this.isTopBoxShadow = true;
                    }}"
                ></stxapp-swap-state>
            </dialog>
        `;
    }

    _stop(e) {
        e.stopPropagation();
    }

    /**
     * 内部关闭按钮：直接关闭，不向外部派发事件。
     */
    _closeSwapState(e) {
        e?.stopPropagation();
        this.close();
    }

    /**
     * 添加交易记录。
     */
    push(e) {
        const listData = this.renderRoot.querySelector(
            '#swapStateList'
        );

        listData?._push(e);
    }
}

if (!customElements.get('swaptox-mini-swap-state')) {
    customElements.define(
        'swaptox-mini-swap-state',
        StxappSwapStateModal
    );
}

/**
 * 全局唯一实例。
 * 即使该模块被多个业务模块引用，也不会重复挂载。
 */
function mountSwapStateModal() {
    if (!document.body) return;

    let instance = document.querySelector(
        'swaptox-mini-swap-state'
    );

    if (!instance) {
        instance = document.createElement(
            'swaptox-mini-swap-state'
        );
    }

    // 确保唯一实例位于 body 最外层。
    if (instance.parentElement !== document.body) {
        document.body.appendChild(instance);
    }

    return instance;
}

// 页面加载时自动挂载。
if (document.body) {
    mountSwapStateModal();
} else {
    document.addEventListener(
        'DOMContentLoaded',
        mountSwapStateModal,
        { once: true }
    );
}
