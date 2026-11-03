import {
	LitElement,
	html,
	css
} from 'lit';

import '../../icon/com-icon-to.js';

export class StxappPagination extends LitElement {
	static get properties() {
		return {
			total: {
				type: Number
			},
			pageSize: {
				type: Number,
				attribute: 'page-size'
			},
			currentPage: {
				type: Number,
				attribute: 'current-page'
			},
			maxVisible: {
				type: Number,
				attribute: 'max-visible'
			},
			showTotal: {
				type: Boolean,
				attribute: 'show-total'
			},
			disabled: {
				type: Boolean,
				reflect: true
			},
			isModal: {
				type: Boolean
			},
		};
	}

	constructor() {
		super();

		this.total = 0;
		this.pageSize = 10;
		this.currentPage = 1;
		this.maxVisible = 7;
		this.showTotal = true;
		this.disabled = false;
		this.isModal = false;
	}

	static get styles() {
		return css`
			:host {
				display: block;
				width: 100%;
				min-width: 0;
				box-sizing: border-box;

				--stxapp-pagination-color:
					var(--stxui-theme-font-color, #222);
				--stxapp-pagination-muted-color: #999;
				--stxapp-pagination-border-color:
					var(--stxui-theme-border-color, #e5e5e5);
				--stxapp-pagination-background:
					var(--stxui-theme-content-background-color, #fff);
					
				
				--stxapp-pagination-hover-background:
					var(--stxui-pagination-hover-background, #f5f5f5);
				
				
				--stxapp-pagination-active-background: var(--stxui-button-disabled-primary, #55bfb5);
				--stxapp-pagination-active-color: var(--stxui-theme-button-primary-text-color, #fff);
				
				
				--stxapp-pagination-radius: 10px;

				color: var(--stxapp-pagination-color);
				font-family: var(--stxui-font-family, inherit);
				font-size: 13px;
				
				-webkit-tap-highlight-color: transparent;
			}

			* {
				box-sizing: border-box;
			}
			
			.font-family {
				user-select: none;
				font-family: var(--stxui-font-family);
			}

			.pagination {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 12px;
				width: 100%;
				min-width: 0;
			}

			.pagination-info {
				flex: 0 0 auto;
				color: var(--stxapp-pagination-muted-color);
				white-space: nowrap;
				font-size: 15px;
			}

			.pagination-controls {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				gap: 5px;
				min-width: 0;
			}

			.page-button {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				flex: 0 0 auto;

				min-width: 34px;
				height: 34px;
				padding: 0 8px;

				border: 1px solid var(
					--stxapp-pagination-border-color
				);
				border-radius: var(--stxapp-pagination-radius);
				background: var(--stxapp-pagination-background);
				color: var(--stxapp-pagination-color);

				font: inherit;
				font-size: 13px;
				line-height: 1;
				font-variant-numeric: tabular-nums;

				cursor: pointer;
				user-select: none;
				transition:
					background-color 0.15s ease,
					border-color 0.15s ease,
					color 0.15s ease,
					opacity 0.15s ease;
			}
			.popup-window{
				border: 1px solid var(--stxui-transactions-record-modal-border, #eee);
				/*background-color: var(
					--stxui-transactions-record-modal-background,
					#fbfbfb
				);*/
			}
			
			
			

			.page-button:hover:not(:disabled):not(.active) {
				background: var(
					--stxapp-pagination-hover-background
				);
			}
			.page-button:hover:not(:disabled):not(.active):active {
				opacity: 0.75;
			}
			
			
			.popup-window:hover:not(:disabled):not(.active) {
				background: var(
					--stxui-transactions-record-modal-hover
				);
			}
			
			
			

			.page-button:focus-visible {
				outline: 2px solid var(
					--stxapp-pagination-active-background
				);
				outline-offset: 2px;
			}

			.page-button.active {
				border-color: var(
					--stxapp-pagination-active-background
				);
				background: var(
					--stxapp-pagination-active-background
				);
				color: var(--stxapp-pagination-active-color);
				font-weight: 600;
				cursor: default;
			}

			.page-button:disabled {
				opacity: 0.8;
				cursor: default;
				/*cursor: not-allowed;*/
			}

			.page-button.arrow {
				font-size: 17px;
			}

			.page-ellipsis {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				flex: 0 0 auto;
				width: 20px;
				height: 34px;
				color: var(--stxapp-pagination-muted-color);
				user-select: none;
			}

			.pagination-empty {
				color: var(--stxapp-pagination-muted-color);
				font-size: 15px;
				line-height: 34px;
				height: 34px;
			}

			/* 手机端：只显示上一页、当前页、下一页 */
			@media (max-width: 580px) {
				.pagination {
					justify-content: center;
					gap: 12px;
				}

				.pagination-info {
					display: none;
				}

				.pagination-controls {
					justify-content: center;
					gap: 8px;
				}

				/* 隐藏所有普通页码 */
				.page-button:not(.arrow) {
					display: none;
				}

				/* 仅恢复当前页按钮 */
				.page-button.active {
					display: inline-flex;
					min-width: 42px;
					height: 36px;
					padding: 0 10px;
				}

				/* 隐藏省略号 */
				.page-ellipsis {
					display: none;
				}

				/* 保留上一页和下一页 */
				.page-button.arrow {
					display: inline-flex;
					width: 36px;
					min-width: 36px;
					height: 36px;
					padding: 0;
					font-size: 18px;
				}
			}

			@media (prefers-reduced-motion: reduce) {
				.page-button {
					transition: none;
				}
			}
		`;
	}

	/**
	 * 总页数
	 */
	get totalPages() {
		const total = this._normalizeInteger(this.total, 0);
		const pageSize = this._normalizeInteger(this.pageSize, 10);

		if (total <= 0 || pageSize <= 0) {
			return 0;
		}

		return Math.ceil(total / pageSize);
	}

	/**
	 * 当前有效页码
	 */
	get activePage() {
		const pages = this.totalPages;

		if (pages <= 0) {
			return 1;
		}

		return Math.min(
			Math.max(1, this._normalizeInteger(this.currentPage, 1)),
			pages
		);
	}

	/**
	 * 计算需要显示的页码和省略号
	 */
	get pageItems() {
		const totalPages = this.totalPages;
		const currentPage = this.activePage;

		if (totalPages <= 0) {
			return [];
		}

		const maxVisible = Math.max(
			5,
			this._normalizeInteger(this.maxVisible, 7)
		);

		// 页数较少时，直接显示全部页码
		if (totalPages <= maxVisible) {
			return Array.from(
				{ length: totalPages },
				(_, i) => i + 1
			);
		}

		// 始终显示第一页、最后一页和当前页附近的页码
		const siblingCount = Math.floor((maxVisible - 3) / 2);

		const leftSibling = Math.max(
			currentPage - siblingCount,
			2
		);

		const rightSibling = Math.min(
			currentPage + siblingCount,
			totalPages - 1
		);

		const showLeftEllipsis = leftSibling > 2;
		const showRightEllipsis = rightSibling < totalPages - 1;

		if (!showLeftEllipsis && showRightEllipsis) {
			const leftCount = maxVisible - 2;

			return [
				...Array.from(
					{ length: leftCount },
					(_, i) => i + 1
				),
				'ellipsis-right',
				totalPages
			];
		}

		if (showLeftEllipsis && !showRightEllipsis) {
			const rightCount = maxVisible - 2;
			const startPage = totalPages - rightCount + 1;

			return [
				1,
				'ellipsis-left',
				...Array.from(
					{ length: rightCount },
					(_, i) => startPage + i
				)
			];
		}

		return [
			1,
			'ellipsis-left',
			...Array.from(
				{ length: rightSibling - leftSibling + 1 },
				(_, i) => leftSibling + i
			),
			'ellipsis-right',
			totalPages
		];
	}

	/**
	 * 校正页码
	 */
	willUpdate(changedProperties) {
		if (
			changedProperties.has('total') ||
			changedProperties.has('pageSize') ||
			changedProperties.has('currentPage')
		) {
			const pages = this.totalPages;
			const current = this._normalizeInteger(
				this.currentPage,
				1
			);

			const corrected = pages <= 0
				? 1
				: Math.min(Math.max(1, current), pages);

			if (this.currentPage !== corrected) {
				this.currentPage = corrected;
			}
		}
	}

	/**
	 * 转换为有效整数
	 */
	_normalizeInteger(value, fallback) {
		const number = Number(value);

		if (!Number.isFinite(number)) {
			return fallback;
		}

		return Math.trunc(number);
	}

	/**
	 * 切换页码
	 */
	_goToPage(page) {
		if (this.disabled) {
			return;
		}

		const totalPages = this.totalPages;

		if (totalPages <= 0) {
			return;
		}

		const nextPage = Math.min(
			Math.max(1, this._normalizeInteger(page, 1)),
			totalPages
		);

		if (nextPage === this.activePage) {
			return;
		}

		const previousPage = this.activePage;

		this.currentPage = nextPage;

		/**
		 * change 事件：
		 * detail.page       当前页码
		 * detail.pageSize   每页数量
		 * detail.total      总数量
		 * detail.totalPages 总页数
		 * detail.previousPage 上一个页码
		 */
		this.dispatchEvent(
			new CustomEvent('change', {
				detail: {
					page: nextPage,
					pageSize: this._normalizeInteger(
						this.pageSize,
						10
					),
					total: this._normalizeInteger(
						this.total,
						0
					),
					totalPages,
					previousPage
				},
				bubbles: true,
				composed: true
			})
		);
	}

	_onPageClick(page) {
		this._goToPage(page);
	}

	_onPrevious() {
		this._goToPage(this.activePage - 1);
	}

	_onNext() {
		this._goToPage(this.activePage + 1);
	}

	/**
	 * 页码按钮
	 */
	_renderPageButton(page) {
		const active = page === this.activePage;

		return html`
			<button
				type="button"
				class="page-button ${active ? 'active' : ''} ${this.isModal?'popup-window':''}"
				?disabled=${this.disabled || active}
				aria-label=${`Page ${page}`}
				aria-current=${active ? 'page' : 'false'}
				@click=${() => this._onPageClick(page)}
			>${page}</button>
		`;
	}

	/**
	 * 省略号
	 */
	_renderEllipsis(key) {
		return html`
			<span
				class="page-ellipsis"
				aria-hidden="true"
				key=${key}
			>
				<svg t="1792343391117" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10728" width="14" height="14"><path d="M157.696 426.496c-47.104 22.016-67.584 76.288-45.568 123.904C152.576 639.488 286.72 609.792 286.72 512c0-29.184-12.288-53.76-37.376-73.728-15.36-12.288-24.576-15.36-48.64-16.896-15.872-0.512-35.328 1.536-43.008 5.12zM475.136 426.496C443.392 441.344 419.84 477.696 419.84 512c0 22.016 14.848 55.296 31.232 69.632 58.88 51.2 153.088 8.704 153.088-69.632 0-29.184-12.288-53.76-37.376-73.728-15.36-12.288-24.576-15.36-48.64-16.896-15.872-0.512-35.328 1.536-43.008 5.12zM791.04 428.544c-23.552 12.288-33.792 23.04-44.032 45.056-12.288 26.112-12.288 50.688 0 76.8 17.408 38.4 50.176 56.832 93.184 52.736 74.24-7.168 108.544-99.328 56.832-154.624-26.624-28.16-73.728-37.376-105.984-19.968z" p-id="10729" fill="var(--stxapp-pagination-muted-color)"></path></svg>
			</span>
		`;
	}

	render() {
		const total = Math.max(
			0,
			this._normalizeInteger(this.total, 0)
		);

		const pageSize = this._normalizeInteger(
			this.pageSize,
			10
		);

		const totalPages = this.totalPages;
		const currentPage = this.activePage;

		if (total <= 0 || totalPages <= 0 || pageSize <= 0) {
			return html`
				<div class="pagination">
					<div class="pagination-empty font-family">
						No data
					</div>
				</div>
			`;
		}

		const start = (currentPage - 1) * pageSize + 1;
		const end = Math.min(currentPage * pageSize, total);

		return html`
			<nav
				class="pagination"
				aria-label="Pagination"
			>
				${this.showTotal ? html`
					<div class="pagination-info font-family">
						${start}-${end} of ${total}
					</div>
				` : ''}

				<div class="pagination-controls">
					<button
						type="button"
						class="page-button arrow ${this.isModal?'popup-window':''}"
						aria-label="Previous page"
						?disabled=${this.disabled || currentPage <= 1}
						@click=${this._onPrevious}
					><com-icon-to ?disabled=${this.disabled || currentPage <= 1} fill="var(--stxui-theme-font-color)" direction="left" size="12px"><com-icon-to></button>

					${this.pageItems.map((item) => {
						if (typeof item === 'number') {
							return this._renderPageButton(item);
						}

						return this._renderEllipsis(item);
					})}

					<button
						type="button"
						class="page-button arrow ${this.isModal?'popup-window':''}"
						aria-label="Next page"
						?disabled=${this.disabled || currentPage >= totalPages}
						@click=${this._onNext}
					><com-icon-to ?disabled=${this.disabled || currentPage >= totalPages} fill="var(--stxui-theme-font-color)" direction="right" size="12px"><com-icon-to></button>
				</div>
			</nav>
		`;
	}
}

if (!customElements.get('stxapp-pagination')) {
	customElements.define(
		'stxapp-pagination',
		StxappPagination
	);
}