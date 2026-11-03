
import {
	LitElement,
	html,
	css
} from 'lit';

export class StxAppTips extends LitElement {

	static properties = {
		type: {
			type: String
		},
		duration: {
			type: Number
		},
		message: {
			type: String
		},
		visible: {
			type: Boolean,
			state: true
		},
		leaving: {
			type: Boolean,
			state: true
		}
	};

	constructor() {
		super();

		this.type = 'success';
		this.duration = 2500;
		this.message = '';

		this.visible = false;
		this.leaving = false;

		this._timer = null;
		this._leaveTimer = null;
		this._raf1 = null;
		this._raf2 = null;
		this._version = 0;
	}

	static styles = css`
		:host {
			position: absolute;
			top: 0;
			left: 50%;
			transform: translateX(-50%);

			z-index: 999;

			display: block;
			width: max-content;
			max-width: calc(100% - 32px);

			pointer-events: none;
		}

		.tips {
			box-sizing: border-box;

			max-width: 100%;
			padding: 8px 20px;

			display: flex;
			align-items: center;
			justify-content: center;

			border-radius: 120px;

			font-family: var(--stxui-font-family, sans-serif);
			font-size: 14px;
			line-height: 1.5;
			text-align: center;
			overflow-wrap: anywhere;

			background: var(--stxui-theme-color, #02b6a6);
			color: #fff;

			opacity: 0;
			transform: translate3d(0, -12px, 0);
			transform-origin: top center;

			pointer-events: none;
			user-select: none;
		}

		/* 进入动画 */
		.tips.visible {
			pointer-events: auto;
			animation: bounceIn__modal12377 250ms ease both;
		}

		/* 退出动画 */
		.tips.leaving {
			pointer-events: none;
			animation: bounceOut__modal12377 300ms ease both;
		}

		@keyframes bounceIn__modal12377 {
			0% {
				transform: translate3d(0, -12px, 0);
				opacity: 0;
			}

			to {
				transform: translate3d(0, 7px, 0);
				opacity: 1;
			}
		}

		@keyframes bounceOut__modal12377 {
			from {
				transform: translate3d(0, 7px, 0);
				opacity: 1;
			}

			90% {
				transform: translate3d(0, 0, 0);
				opacity: 0;
			}

			to {
				transform: translate3d(0, -12px, 0);
				opacity: 0;
			}
		}

		.tips.type-success {
			background: var(--stxui-tips-success-bg, #02b6a6);
			color: var(--stxui-tips-success-color, #fff);
		}

		.tips.type-error {
			background: var(--stxui-tips-error-bg, #f04438);
			color: var(--stxui-tips-error-color, #fff);
		}

		.tips.type-warning {
			background: var(--stxui-tips-warning-bg, #ffebce);
			color: var(--stxui-tips-warning-color, #292929);
			box-shadow: 0 0 0 1px var(--stxui-tips-warning-border, #ffdeb3);
		}

		.tips.type-info {
			background: var(--stxui-tips-info-bg, #353535);
			color: var(--stxui-tips-info-color, #fff);
		}

		@media (prefers-reduced-motion: reduce) {
			.tips.visible,
			.tips.leaving {
				animation: none;
			}

			.tips.visible {
				transform: translate3d(0, 7px, 0);
				opacity: 1;
			}

			.tips.leaving {
				transform: translate3d(0, -12px, 0);
				opacity: 0;
			}
		}
	`;

	render() {
		const type = [
			'success',
			'error',
			'warning',
			'info'
		].includes(this.type)
			? this.type
			: 'success';

		return html`
			<div
				class="tips type-${type} ${this.visible ? 'visible' : ''} ${this.leaving ? 'leaving' : ''}"
				@click="${this.hide}"
			>
				<slot>${this.message}</slot>
			</div>
		`;
	}

	/**
	 * 显示提醒。
	 *
	 * 再次调用时，立即取消旧提醒，
	 * 不播放旧提醒的退出动画，
	 * 并重新播放新提醒的进入动画。
	 *
	 * @param {string} message 提示内容
	 * @param {{ type?: string, duration?: number }} options 配置
	 */
	async show(message, options = {}) {
		this._clearTimers();

		const version = ++this._version;

		if (typeof message === 'string') {
			this.message = message;
		}

		if (options.type !== undefined) {
			this.type = options.type;
		}

		const requestedDuration = Number(
			options.duration ?? this.duration
		);

		const duration = Number.isFinite(requestedDuration)
			? Math.max(0, requestedDuration)
			: 2500;

		// 立即重置旧提醒，不播放退出动画
		this.visible = false;
		this.leaving = false;

		// 等待 Lit 将新内容和初始状态更新到 DOM
		await this.updateComplete;

		if (version !== this._version || !this.isConnected) {
			return;
		}

		// 双 RAF 确保浏览器能够识别动画初始状态
		this._raf1 = requestAnimationFrame(() => {
			if (version !== this._version) return;

			this._raf2 = requestAnimationFrame(() => {
				if (version !== this._version) return;

				this.visible = true;

				this._timer = setTimeout(() => {
					if (version === this._version) {
						this.hide();
					}
				}, duration);
			});
		});
	}

	/**
	 * 隐藏提醒，播放退出动画。
	 */
	hide() {
		if (!this.visible || this.leaving) {
			return;
		}

		this._clearTimers();

		const version = ++this._version;

		this.visible = false;
		this.leaving = true;

		// 与 CSS 的退出动画时长保持一致
		this._leaveTimer = setTimeout(() => {
			if (version !== this._version) return;

			this.leaving = false;
			this._leaveTimer = null;

			this.dispatchEvent(new CustomEvent('tips-hidden', {
				bubbles: true,
				composed: true
			}));
		}, 300);
	}

	/**
	 * 清除定时器和待执行的动画帧。
	 */
	_clearTimers() {
		clearTimeout(this._timer);
		clearTimeout(this._leaveTimer);

		if (this._raf1 !== null) {
			cancelAnimationFrame(this._raf1);
		}

		if (this._raf2 !== null) {
			cancelAnimationFrame(this._raf2);
		}

		this._timer = null;
		this._leaveTimer = null;
		this._raf1 = null;
		this._raf2 = null;
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		this._clearTimers();
		this._version++;
	}
}

if (!customElements.get('stxapp-tips')) {
	customElements.define('stxapp-tips', StxAppTips);
}

