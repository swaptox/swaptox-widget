import {
	LitElement,
	html,
	css
} from 'lit';

import { sdkStore } from '../../../data/store/store.js';
import { StoreMixin } from '../../../data/store/state-mixin.js';

import '../../../com/stx-token-logo.js';
import '../../../components/stxapp-button/stxapp-button.js';

export class StxcomTransactionsItem extends StoreMixin(LitElement) {
	static properties = {
		loading: {
			type: Boolean,
			reflect: true
		},
		isModal: {type: Boolean},
		item: {type: Object},
	};
	constructor() {
		super();
		this.loading = false;
		this.isModal = false;
	}

	static get styles() {
		return css`
			:host {
				display: block;
				width: 100%;
				min-width: 0;
				box-sizing: border-box;
				font-family: var(--stxui-font-family);
			}

			* {
				box-sizing: border-box;
			}
			
			.font-family {
				user-select: none;
				font-family: var(--stxui-font-family);
			}

			.stxcom-transactions-item {
				width: 100%;
				min-width: 0;
				padding: 12px;
				border: 1px solid var(--stxui-theme-border-color, #eee);
				border-radius: 17px;
				background-color: var(
					--stxui-theme-content-background-color,
					#fbfbfb
				);

				display: grid;
				grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
				align-items: center;
				column-gap: 16px;
				row-gap: 12px;
			}
			.popup-window{
				border: 1px solid var(--stxui-transactions-record-modal-border, #eee);
				background-color: var(
					--stxui-transactions-record-modal-background,
					#fbfbfb
				);
			}
			

			/* 输入代币 → 输出代币 */
			.swap-assets {
				display: grid;
				grid-template-columns: minmax(0, 1fr) 24px minmax(0, 1fr);
				align-items: center;
				min-width: 0;
				gap: 4px;
			}

			/* 单个代币区域 */
			.token-item {
				display: flex;
				align-items: center;
				column-gap: 8px;
				min-width: 0;
				overflow: hidden;
			}

			/* Logo 固定尺寸，不参与压缩 */
			.token-logo {
				position: relative;
				width: 26px;
				height: 26px;
				flex: 0 0 26px;
			}

			.token-chain-logo {
				position: absolute;
				top: 16px;
				left: 16px;
				z-index: 1;
				width: 12px;
				height: 12px;
			}

			/* 数量、代币名称和美元价值 */
			.token-info {
				display: flex;
				flex-direction: column;
				justify-content: center;
				row-gap: 3px;
				flex: 1 1 0;
				min-width: 0;
				overflow: hidden;
			}

			.token-amount {
				display: block;
				width: 100%;
				min-width: 0;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;

				font-size: 15px;
				line-height: 18px;
				/*font-weight: 500;*/
				color: var(--stxui-theme-font-color, #111);
			}

			.token-usd {
				display: block;
				width: 100%;
				min-width: 0;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;

				font-size: 13px;
				line-height: 16px;
				color: #999;
			}

			/* 中间的兑换箭头 */
			.swap-arrow {
				display: flex;
				align-items: center;
				justify-content: center;
				min-width: 0;
				font-size: 18px;
				line-height: 1;
				color: var(--stxui-theme-font-color, #111);
			}

			/* 日期、时间和状态 */
			.transaction-meta {
				display: grid;
				grid-template-columns: minmax(0, 1fr) auto;
				align-items: center;
				column-gap: 10px;
				min-width: 0;
			}

			.transaction-time {
				display: flex;
				flex-direction: column;
				row-gap: 3px;
				min-width: 0;
			}

			.transaction-date,
			.transaction-clock {
				display: block;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				font-size: 14px;
				line-height: 18px;
				color: var(--stxui-theme-font-color, #111);
				font-variant-numeric: tabular-nums;
			}

			.transaction-clock {
				color: #999;
			}

			.transaction-status {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				min-width: 0;
				padding-right: 2px;
			}

			/* 中等宽度：适当缩小列间距 */
			/*@media (max-width: 700px) {
				.stxcom-transactions-item {
					column-gap: 10px;
					padding: 10px;
				}

				.token-item {
					column-gap: 6px;
				}

				.swap-assets {
					grid-template-columns: minmax(0, 1fr) 20px minmax(0, 1fr);
					gap: 2px;
				}

				.transaction-meta {
					column-gap: 6px;
				}

				.token-amount {
					font-size: 13px;
				}

				.transaction-date,
				.transaction-clock {
					font-size: 12px;
				}
			}*/

			/* 窄屏：交易信息一行，时间和状态放到下一行 */
			@media (max-width: 520px) {
				.stxcom-transactions-item {
					grid-template-columns: minmax(0, 1fr);
					row-gap: 10px;
				}

				.swap-assets {
					grid-template-columns: minmax(0, 1fr) 28px minmax(0, 1fr);
					gap: 6px;
				}

				.transaction-meta {
					grid-template-columns: minmax(0, 1fr) auto;
					padding-top: 9px;
					border-top: 1px solid var(
						--stxui-theme-border-color,
						#eee
					);
				}
				
				.transaction-meta-window{
					border-top: 1px solid var(--stxui-transactions-record-modal-border, #eee);
				}
				

				.transaction-time {
					flex-direction: row;
					align-items: center;
					column-gap: 10px;
				}

				.transaction-date,
				.transaction-clock {
					width: auto;
					/*font-size: 12px;*/
				}
			}

			/* 极窄屏：保留 Logo，压缩文本而不是压缩布局 */
			@media (max-width: 350px) {
				.stxcom-transactions-item {
					padding: 8px;
				}

				.swap-assets {
					grid-template-columns: minmax(0, 1fr) 18px minmax(0, 1fr);
					gap: 2px;
				}

				.token-item {
					column-gap: 4px;
				}

				.token-logo {
					width: 22px;
					height: 22px;
					flex-basis: 22px;
				}

				.token-logo stx-token-logo {
					--stx-token-logo-size: 22px;
				}

				.token-chain-logo {
					top: 13px;
					left: 13px;
					transform: scale(0.9);
					transform-origin: top left;
				}

				.token-amount {
					font-size: 12px;
				}

				.transaction-time {
					column-gap: 6px;
				}
			}
			
			
			
			.item-load-skeleton{
				position:relative;
			}
			.item-load-skeleton::after {
				position: absolute;
				z-index: 10;
				top: 0; right: 0; bottom: 0; left: 0;
				background-image: var(--stxui-skeleton-background-load);
				background-size: 500% 500%;
				animation: skeleton 1.8s ease infinite;
				content: '';
				border-radius: 17px;
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
	}

	render() {
		const $t = sdkStore.$t;
		
		const shuruText = `${this.item._amountIn} ${this.item.symbolIn}`;
		const shuchuText = `${this.item._amountOut} ${this.item.symbolOut}`;
		
		
		let status = this.item.status;
		if(status==='pending'){
			const swapHashObj = sdkStore.swapHash?.[this.item.chainin];
			if(swapHashObj&&swapHashObj[this.item.hash]){
				status = swapHashObj[this.item.hash];
			}			
		}


		return html`
			<div
				class="stxcom-transactions-item ${this.loading?'item-load-skeleton':''}  ${this.isModal?'popup-window':''}"
				@click=${this._selectToken}
			>
				<!-- 输入代币、箭头、输出代币 -->
				<div class="swap-assets">
					${this._renderToken(
						shuruText,
						this.item._inUsd,
						this.item.logoIn,
						this.item.symbolIn,
						this.item.chaininLogo
					)}

					<div class="swap-arrow">
						<svg t="1792115324676" class="icon" viewBox="0 0 1365 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26600" width="16" height="16"><path d="M1171.013179 568.839589L812.985541 926.867227a56.883959 56.883959 0 1 0 80.547686 80.433918l455.071672-455.071672a56.883959 56.883959 0 0 0 0-80.433918l-455.071672-455.071671a56.770191 56.770191 0 0 0-80.547686 0 56.883959 56.883959 0 0 0 0 80.32015L1171.013179 455.071672H56.883959a56.883959 56.883959 0 1 0 0 113.767917h1114.12922z" fill="#999999" p-id="26601"></path></svg>
					</div>

					${this._renderToken(
						shuchuText,
						this.item._outUsd,
						this.item.logoOut,
						this.item.symbolOut,
						this.item.chainoutLogo
					)}
				</div>

				<!-- 时间和交易状态 -->
				<div class="transaction-meta ${this.isModal?'transaction-meta-window':''}">
					<div class="transaction-time">
						<div class="font-family transaction-date">${this.item.initiatedArr[0]}</div>
						<div class="font-family transaction-clock">${this.item.initiatedArr[1]}</div>
					</div>

					<div
						class="transaction-status"
						@click=${(e) => e.stopPropagation()}
					>
						
						
						
						
						${status==='pending'?html`
							<stxapp-button
								type="default" 
								size="center"
								styles="width: 100px;"
								loading="${true}"
								plain="${true}"
								@_click=${this._confirm}
							>Pending</stxapp-button>
						`:null}
						
						${status==='success'?html`
							<stxapp-button
								plain="${true}"
								type="primary"
								size="center"
								styles="width: 100px;"
								@_click=${this._confirm}
							>Success</stxapp-button>
						`:null}
						
						${status==='failed'?html`
							<stxapp-button
								plain="${true}"
								type="warn"
								size="center"
								styles="width: 100px;"
								@_click=${this._confirm}
							>Failed</stxapp-button>
						`:null}
						
						
						
						
						
						
					</div>
				</div>
			</div>
		`;
	}

	_renderToken(amount, usd, logo, symbol, chainLogo) {
		return html`
			<div class="token-item">
				<div class="token-logo">
					<stx-token-logo
						size="26px"
						.symbol=${symbol}
						.logo=${logo}
					></stx-token-logo>

					<div class="token-chain-logo">
						<stx-token-logo
							size="12px"
							symbol=""
							logo="${chainLogo}"
						></stx-token-logo>
					</div>
				</div>

				<div class="token-info">
					<div class="token-amount font-family">
						${amount}
					</div>
					<div class="token-usd font-family">
						${usd}
					</div>
				</div>
			</div>
		`;
	}

	_confirm() {
		this.dispatchEvent(
			new CustomEvent('open-details', {
				bubbles: true,
				composed: true
			})
		);
	}

	_selectToken() {
		this.dispatchEvent(
			new CustomEvent('change', {
				bubbles: true,
				composed: true
			})
		);
	}
}

if (!customElements.get('stxcom-transactions-item')) {
	customElements.define(
		'stxcom-transactions-item',
		StxcomTransactionsItem
	);
}