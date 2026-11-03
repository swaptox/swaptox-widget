import {
	LitElement,
	html,
	css
} from 'lit';

import { selectIcon, allChainsLogo } from './icon.js';
import './stxcom-chain-select-header-search.js';

// 搜索关键字高亮组件
import '../../../com/stx-token-selector/com/com/keyword/com-text-keyword-symbol.js';

export class StxcomContentModal extends LitElement {
	static get properties() {
		return {
			styles: {
				type: String
			},
			placeholder: {
				type: String
			},
			allChainsText: {
				type: String
			},
			searchValue: {
				type: String
			},
			selectedChain: {
				type: String
			},
			open: {
				type: Boolean
			},
			original: {
				type: Array
			},
			noMatchingNetworks: {
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

		.stxcom-content-body {
			max-height: 206px;
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
		}

		.stxcom-content-body::-webkit-scrollbar {
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

		.chain-name-text {
			user-select: none;
			font-size: 15px;
			line-height: 22px;
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

		.empty-result {
			padding: 22px 12px;
			text-align: center;
			font-size: 13px;
			line-height: 20px;
			color: var(--stxui-theme-font-color, #999);
			opacity: 0.65;
			padding-bottom: 16px;
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
		this.placeholder = '';
		this.allChainsText = '';
		this.searchValue = '';
		this.selectedChain = '';
		this.original = [];
		this.noMatchingNetworks = '';

		this.isTouchDevice =
			'ontouchstart' in window ||
			navigator.maxTouchPoints > 0;

		this._initialized = false;
		this._listenersActive = false;

		this._autoCloseRef = this._handleGlobalAction.bind(this);
	}

	/**
	 * 首次渲染完成后再发送初始选择事件。
	 *
	 * 这里只通知父组件当前默认选择，不关闭弹窗。
	 */
	firstUpdated() {
		if (this._initialized) {
			return;
		}

		this._initialized = true;

		this.dispatchEvent(
			new CustomEvent('selected-chain', {
				detail: this.selectedChain,
				bubbles: false,
				composed: false
			})
		);
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
	 * 搜索结果。
	 *
	 * 不修改 original，始终保留原始网络列表。
	 */
	get filteredChains() {
		const chains = Array.isArray(this.original)
			? this.original
			: [];

		const keyword = String(this.searchValue ?? '')
			.trim()
			.toLocaleLowerCase();

		if (!keyword) {
			return chains;
		}

		return chains.filter((item) => {
			const fields = [
				item.name,
				item.chain,
				item.chainId,
				item.chainID,
				item.id,
				item.symbol,
				item.network,
				item.networkName
			];

			return fields.some((value) => {
				if (value === null || value === undefined) {
					return false;
				}

				return String(value)
					.toLocaleLowerCase()
					.includes(keyword);
			});
		});
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
		if(this._isFocus){
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
	_onClickChain(chain) {
		this.selectedChain = chain ?? '';

		// 选择网络后清空搜索，方便下次打开。
		//this.searchValue = '';

		this.dispatchEvent(
			new CustomEvent('selected-chain', {
				detail: this.selectedChain,
				bubbles: false,
				composed: false
			})
		);

		this.open = false;
		this._onClose();
	}

	/**
	 * 搜索输入。
	 */
	_searchInput(event) {
		this.searchValue = String(
			event.detail?.value ?? ''
		);

		// Lit 会自动重新渲染 filteredChains。
	}

	/**
	 * 渲染网络列表项。
	 */
	_renderChain(item) {
		const selected = this.selectedChain === item.chain;

		return html`
			<div class="content-list-body">
				<div
					class="flex-r-c-cm content-list-item"
					style="column-gap: 6px;"
					role="button"
					tabindex="0"
					aria-pressed=${selected ? 'true' : 'false'}
					@click=${() => this._onClickChain(item.chain)}
					@keydown=${(event) => {
						if (
							event.key === 'Enter' ||
							event.key === ' '
						) {
							event.preventDefault();
							this._onClickChain(item.chain);
						}
					}}
				>
					<stx-token-logo
						size="22px"
						.symbol=${item.name ?? ''}
						.logo=${item.logo ?? ''}
					></stx-token-logo>

					<div class="chain-name">
						<com-text-keyword-symbol
							text=${item.name ?? ''}
							keyword=${this.searchValue ?? ''}
						></com-text-keyword-symbol>
					</div>
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
		const chains = this.filteredChains;
		const searching = String(this.searchValue ?? '').trim() !== '';

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
				<div class="stxcom-content-body">
				
					<div class="waicheng">
						<div class="modal-search">
							<stxcom-chain-select-header-search
								.inputValue=${this.searchValue}
								.placeholder=${this.placeholder}
								@search-input=${this._searchInput}
								@blur="${()=>this._isFocus=false}"
								@focus="${()=>this._isFocus=true}"
							></stxcom-chain-select-header-search>
						</div>
					</div>
				
				
				
					<!-- 搜索为空时显示全部网络选项 -->
					${!searching ? html`
						<div class="content-list-body">
							<div
								class="flex-r-c-cm content-list-item"
								style="column-gap: 6px;"
								role="button"
								tabindex="0"
								aria-pressed=${!this.selectedChain
									? 'true'
									: 'false'}
								@click=${() => this._onClickChain('')}
								@keydown=${(event) => {
									if (
										event.key === 'Enter' ||
										event.key === ' '
									) {
										event.preventDefault();
										this._onClickChain('');
									}
								}}
							>
								${allChainsLogo(this.original)}

								<span class="chain-name-text">
									${this.allChainsText}
								</span>
							</div>

							${!this.selectedChain ? html`
								<div class="selected-icon">
									${selectIcon()}
								</div>
							` : ''}
						</div>
					` : ''}

					<!-- 搜索过滤后的网络列表 -->
					${chains.map((item) => this._renderChain(item))}

					<!-- 无匹配结果 -->
					${searching && chains.length === 0 ? html`
						<div class="empty-result">
							${this.noMatchingNetworks}
						</div>
					` : ''}

					<div class="bottom-space"></div>
					
				</div>
			</div>
		`;
	}

	_onClose() {
		//this.searchValue = '';
		this.dispatchEvent(
			new CustomEvent('close', {
				detail: {},
				bubbles: false,
				composed: false
			})
		);
		setTimeout(()=>{
			this.searchValue = '';
		}, 250);
	}
}

if (!customElements.get('stxcom-chain-select-content-modal')) {
	customElements.define(
		'stxcom-chain-select-content-modal',
		StxcomContentModal
	);
}