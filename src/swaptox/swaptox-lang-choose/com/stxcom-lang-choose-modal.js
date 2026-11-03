import {
	LitElement,
	html,
	css
} from 'lit';

import { selectIcon } from '../../../components/stxapp-transactions-record/com/icon.js';

export class StxcomLangChooseModal extends LitElement {
	static get properties() {
		return {
			currentLang: {
				type: String
			},
			open: {
				type: Boolean
			},
			original: {
				type: Array
			},
			styles: {
				type: String
			},
		};
	}

	static styles = css`
		:host {
			display: block;
			min-width: 0;
		}

		.stxcom-content-modal76 {
			position: absolute;
			z-index: 9999;
			width: 260px;
			min-width: 260px;
			max-width: calc(100vw - 16px);
			box-sizing: border-box;

			border-radius: 26px;
			box-shadow: 0 15px 50px -12px rgba(0, 0, 0, 0.35);
			background-color: var(--stxui-modal-background-color, #fff);

			user-select: none;
			-webkit-user-select: none;

			/*
			 * 阻止内部滚动到达边界时继续滚动外部页面。
			 * 不使用 overflow:hidden，避免破坏内部列表滚动。
			 */
			overscroll-behavior: contain;
			-webkit-tap-highlight-color: transparent;

			transition:
				transform 0.15s cubic-bezier(0.4, 0, 0.2, 1),
				opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);

			transform-origin: top left;
			overflow: hidden;
		}

		@keyframes modal-none {
		    0% { }
			52% { clip-path: inset(100%);visibility: hidden;left: -9999px;}
		    100% { clip-path: inset(100%);visibility: hidden;left: -9999px;}
		}
		.modal-close76 {
			pointer-events: none;
			opacity: 0;  
			transform: scale(0.85);
			animation: modal-none 0.34s linear 1 forwards;
			animation-fill-mode: forwards;
		}

		.modal-open76 {
			opacity: 1;
			transform: scale(1);
			visibility: visible;
		}

		.modal-search {
			padding: 12px;
		}

		.waicheng {
			position: sticky;
			top: 0;
			z-index: 4;
			border-bottom: 1px solid var(--stxui-card-line-color, #ececec);
			background-color: var(--stxui-modal-background-color, #fff);
			border-top-left-radius: 26px;
			border-top-right-radius: 26px;
		}

		.stxcom-content-body8 {
			max-height: 454px;
			overflow-x: hidden;
			overflow-y: auto;

			position: relative;
			border: none;
			outline: none;

			overscroll-behavior-y: contain;
			-webkit-overflow-scrolling: touch;
			touch-action: pan-y;
			scrollbar-width: none;
			-ms-overflow-style: none;
			
			display: flex;
			flex-direction: column;
			row-gap: 6px;
		}
		
		@media (max-height: 500px) {
			.stxcom-content-body8 {
				max-height: calc(100vh - 60px);
			}
		}
		
		

		.stxcom-content-body8::-webkit-scrollbar {
			display: none;
		}

		.content-list-body {
			position: relative;
			padding: 0 10px;
			min-width: 0;
		}

		.flex-r-c-cm {
			display: flex;
			flex-direction: row;
			align-items: center;
			min-width: 0;
		}

		.lang-name-text {
			user-select: none;
			font-size: 15px;
			line-height: 20px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			color: var(--stxui-theme-font-color, #111);
			font-family: var(--stxui-font-family);
		}

		.content-list-item {
			position: relative;
			padding: 8px 10px;
			border: 1px solid transparent;
			border-radius: 100px;
			cursor: pointer;
			min-width: 0;
		}
		
		.list-select{
			border-color: var(
				--stxui-chain-select-content-hover-border,
				#02b6a680
			);
			
			border-color: var(
				--stxui-theme-focus-color,
				#02b6a680
			);
			
			
			background-color: var(
				--stxui-chain-select-content-hover-background,
				#f5f5f5
			);
		}
		

		.content-list-item:hover {
			border-color: var(
				--stxui-chain-select-content-hover-border,
				#02b6a680
			);
			
			border-color: var(
				--stxui-theme-focus-color,
				#02b6a680
			);
			
			
			background-color: var(
				--stxui-chain-select-content-hover-background,
				#f5f5f5
			);
		}

		.content-list-item:focus-visible {
			outline: 2px solid var(
				--stxui-chain-select-content-hover-border,
				#02b6a680
			);
			outline: 2px solid var(
				--stxui-theme-focus-color,
				#02b6a680
			);
			
			outline-offset: 1px;
		}

		.chain-name {
			flex: 1;
			min-width: 0;
			overflow: hidden;
		}

		.selected-icon {
			position: absolute;
			top: 0;
			bottom: 0;
			right: 0;
			z-index: 2;
			width: 60px;
			display: flex;
			align-items: center;
			justify-content: center;
			pointer-events: none;
		}


		.bottom-space {
			height: 10px;
		}

		@media (prefers-reduced-motion: reduce) {
			.stxcom-content-modal76 {
				transition: none;
			}
		}
	`;

	constructor() {
		super();

		this.open = false;
		this.styles = '';

		this.currentLang = '';
		this.original = [];

		this.isTouchDevice =
			'ontouchstart' in window ||
			navigator.maxTouchPoints > 0;

		this._listenersActive = false;

		this._autoCloseRef = this._handleGlobalAction.bind(this);
	}


	/**
	 * 根据弹窗打开状态管理全局监听器。
	 */
	updated(changedProperties) {
		if (changedProperties.has('open')) {
			if (this.open) {
				this._addListeners();
			} else {
				this._removeListeners();
			}
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._removeListeners();
	}

	/**
	 * 注册全局监听。
	 */
	_addListeners() {
		if (this._listenersActive) {
			return;
		}

		this._removeListeners();

		window.addEventListener(
			'click',
			this._autoCloseRef,
			true
		);

		window.addEventListener(
			'scroll',
			this._autoCloseRef,
			true
		);

		if (!this.isTouchDevice) {
			window.addEventListener(
				'resize',
				this._autoCloseRef,
				true
			);
		}

		window.addEventListener(
			'touchstart',
			this._autoCloseRef,
			true
		);

		window.addEventListener(
			'mousedown',
			this._autoCloseRef,
			true
		);

		this._listenersActive = true;
	}

	/**
	 * 移除全局监听。
	 */
	_removeListeners() {
		window.removeEventListener(
			'click',
			this._autoCloseRef,
			true
		);

		window.removeEventListener(
			'scroll',
			this._autoCloseRef,
			true
		);

		window.removeEventListener(
			'resize',
			this._autoCloseRef,
			true
		);

		window.removeEventListener(
			'touchstart',
			this._autoCloseRef,
			true
		);

		window.removeEventListener(
			'mousedown',
			this._autoCloseRef,
			true
		);

		this._listenersActive = false;
	}

	/**
	 * 阻止事件继续向外传播。
	 *
	 * 不调用 preventDefault，避免影响输入框和列表滚动。
	 */
	_stopPropagation(event) {
		event.stopPropagation();
	}

	/**
	 * 全局关闭判断。
	 */
	_handleGlobalAction(event) {
		if (!this.open) {
			return;
		}

		const dialog = this.renderRoot.querySelector(
			'#stxcom-content-modal'
		);

		if (!dialog) {
			return;
		}

		/*
		 * 关键修复：
		 * 不只判断 click/touchstart/mousedown。
		 *
		 * window 的 scroll 监听使用捕获阶段，
		 * 因此即使内部列表滚动，window 也可能收到
		 * 捕获阶段的 scroll 事件。
		 *
		 * 只要事件路径包含弹窗，就不关闭。
		 */
		if (event.composedPath().includes(dialog)) {
			return;
		}

		/*
		 * 只有弹窗外部事件才关闭弹窗。
		 */
		this.open = false;
		this._onClose();
	}

	/**
	 * 点击网络。
	 */
	_onClickLang(lang) {
		this.currentLang = lang;

		this.dispatchEvent(
			new CustomEvent('selected-lang', {
				detail: this.currentLang,
				bubbles: false,
				composed: false
			})
		);

		this.open = false;
		this._onClose();
	}


	/**
	 * 渲染网络列表项。
	 */
	_renderLang(item) {
		const selected = this.currentLang === item.id;

		return html`
			<div class="content-list-body">
				<div
					class="flex-r-c-cm content-list-item ${selected?'list-select':''}"
					style="column-gap: 6px;"
					role="button"
					tabindex="0"
					aria-pressed=${selected ? 'true' : 'false'}
					@click=${() => this._onClickLang(item.id)}
					@keydown=${(event) => {
						if (
							event.key === 'Enter' ||
							event.key === ' '
						) {
							event.preventDefault();
							this._onClickLang(item.id);
						}
					}}
				>
					
					<span class="lang-name-text">${item.name}</span>
					<span class="lang-name-text" style="color: #999;">${item.symbol}</span>
					
				</div>

				${selected ? html`
					<div class="selected-icon">
						${selectIcon()}
					</div>
				` : ''}
			</div>
		`;
	}

	render() {
		return html`
			<div
				id="stxcom-content-modal"
				class="stxcom-content-modal76 ${this.open
					? 'modal-open76'
					: 'modal-close76'}"
				style=${this.styles ?? ''}

				@wheel=${this._stopPropagation}
				@touchmove=${this._stopPropagation}
				@scroll=${this._stopPropagation}
				@click=${this._stopPropagation}
				@mousedown=${this._stopPropagation}
				@touchstart=${this._stopPropagation}
			>
				<div class="stxcom-content-body8" style="padding: 12px 0;">
					${this.original.map((item) => this._renderLang(item))}
				</div>
			</div>
		`;
	}

	_onClose() {
		this.dispatchEvent(
			new CustomEvent('close', {
				detail: {},
				bubbles: false,
				composed: false
			})
		);
	}
}

if (!customElements.get('stxcom-lang-choose-modal')) {
	customElements.define(
		'stxcom-lang-choose-modal',
		StxcomLangChooseModal
	);
}