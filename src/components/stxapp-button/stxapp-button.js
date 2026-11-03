
import {
	LitElement,
	html,
	css
} from 'lit';
import { loadGifUrl } from '../../icon/flickr-ball-circle-round.js';

export class StxAppButton extends LitElement {

	static get properties() {
		return {
			/**
			 * Button visual type
			 * primary | warn | ...
			 */
			type: {
				type: String,
				reflect: true
			},

			/**
			 * Button size
			 * default | mini | center
			 */
			size: {
				type: String,
				reflect: true
			},

			/**
			 * Plain / outline button
			 */
			plain: {
				type: Boolean,
				reflect: true
			},

			/**
			 * Disabled state
			 */
			disabled: {
				type: Boolean,
				reflect: true
			},
			
			loading: {
				type: Boolean,
				reflect: true
			},
			
			
			styles: {
				type: String
			},
		};
	}


	constructor() {
		super();

		this.type = 'primary';
		this.size = 'default';
		this.plain = false;
		this.disabled = false;
	}


	static get styles() {
		return css`

			:host {
				display: block;

				/*
				 * 可以通过组件外部覆盖
				 *
				 * --stxui-button-height
				 * --stxui-button-radius
				 * --stxui-button-font-size
				 */
			}


			/* =========================
			 * Base
			 * ========================= */

			.app-button {
				box-sizing: border-box;

				width: 100%;
				height: var(--stxui-button-height, 46px);

				padding: 0 16px;

				display: flex;
				align-items: center;
				justify-content: center;

				border: 1px solid transparent;
				border-radius: var(--stxui-button-radius, 100px);

				outline: none;

				font-family: var(--stxui-font-family);
				font-size: var(--stxui-button-font-size, 16px);
				font-weight: 500;
				line-height: 1;

				user-select: none;
				/*white-space:nowrap;*/
				cursor: pointer;
					
				transition: 
					border 0.2s ease-in-out, 
					opacity 0.2s ease-in-out, 
					color 0.2s ease-in-out, 
					background-color 0.2s ease-in-out;

				-webkit-tap-highlight-color: transparent;
			}


			/* =========================
			 * Primary
			 * ========================= */

			.app-button.btn-primary {
				background-color: var(
					--stxui-theme-color,
					#02b6a6
				);

				color: var(
					--stxui-theme-button-primary-text-color,
					#fff
				);
			}


			/* =========================
			 * Warn
			 * ========================= */

			.app-button.btn-warn {
				background-color: var(
					--stxui-button-warn-background,
					#ff5722
				);

				color: var(
					--stxui-button-warn-text-color,
					#fff
				);
			}


			/* =========================
			 * Default / fallback type
			 * ========================= */

			.app-button.btn-default {
				background-color: var(
					--stxui-button-default-background,
					#f5f5f5
				);

				color: var(
					--stxui-button-default-text-color,
					#353535
				);
			}
			
			
			.app-button.plain.btn-default {
				color: var(
					--stxui-button-plain-default-color,
					var(--stxui-theme-color, #f5f5f5)
				);
				background-color: var(
					--stxui-button-plain-default-background,
					#f5f5f5
				);
			
				border-color: var(
					--stxui-button-plain-default-border-color,
					var(--stxui-theme-color, #353535)
				);
			}
			
			


			/* =========================
			 * Hover
			 * ========================= */

			@media (hover: hover) {

				.app-button:not(:disabled):hover {
					opacity: 0.9;
				}

			}


			/* =========================
			 * Active
			 * ========================= */

			.app-button:not(:disabled):active {
				opacity: 0.75;
			}


			/* =========================
			 * Focus
			 * ========================= */

			.app-button:focus-visible {
				box-shadow:
					0 0 0 2px var(
						--stxui-button-focus-ring,
						rgba(2, 182, 166, 0.25)
					);
			}


			/* =========================
			 * Size
			 * ========================= */

			.app-button.size-mini {
				height: 24px;
				padding: 0 12px;

				font-size: 13px;
			}


			.app-button.size-center {
				height: 34px;
				padding: 0 12px;

				font-size: 14px;
			}


			.app-button.size-default {
				height: 46px;
				font-size: 16px;
			}


			/* =========================
			 * Plain
			 * ========================= */

			.app-button.plain {
				background-color: transparent;

				color: var(
					--stxui-button-plain-true-color,
					#353535
				);

				border-color: var(
					--stxui-button-plain-true-border-color,
					#353535
				);
			}


			.app-button.plain.btn-primary {
				color: var(
					--stxui-button-plain-primary-color,
					var(--stxui-theme-color, #02b6a6)
				);

				border-color: var(
					--stxui-button-plain-primary-border-color,
					var(--stxui-theme-color, #02b6a6)
				);
			}


			.app-button.plain.btn-warn {
				color: var(
					--stxui-button-plain-warn-color,
					#ff5722
				);

				border-color: var(
					--stxui-button-plain-warn-border-color,
					#ff5722
				);
			}


			/* =========================
			 * Disabled
			 * ========================= */

			.app-button:disabled {
				cursor: not-allowed;
				opacity: 0.8;
			}


			.app-button:disabled:not(.plain) {
				background-color: var(
					--stxui-button-disabled-primary,
					#55bfb5
				);
			}
			
			
			.app-button.btn-warn:disabled:not(.plain) {
				background-color: var(
					--stxui-button-disabled-warn,
					#ff9a7a
				);
				color: var(
					--stxui-theme-button-primary-text-color,
					#fff
				);
				opacity: 0.64;
			}
			
			
			
			


			.app-button:disabled.plain {
				background-color: transparent;

				color: var(
					--stxui-button-disabled-plain-color,
					#999
				);

				border-color: var(
					--stxui-button-disabled-plain-border-color,
					#ccc
				);
			}


			/* =========================
			 * Slot
			 * ========================= */

			::slotted(*) {
				max-width: 100%;
			}

		`;
	}


	render() {
		return html`
			<button
				class="
					app-button
					btn-${this.type}
					size-${this.size}
					${this.plain ? 'plain' : ''}
				"
				type="button"
				?disabled="${this.disabled}"
				@click="${this._onClick}"
				style="${this.styles}"
			>
				
				
				${this.loading&&this.size==='center'?html`
					<img
						loading="lazy"
						draggable="false"
						width="15px" 
						height="15px" 
						style="margin-right:3px;max-width:15px;max-height:15px;" 
						src="${loadGifUrl}" 
					>
				`:null}
				
				
				
				<slot></slot>
			</button>
		`;

	}


	_onClick(event) {

		if (this.disabled) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}


		this.dispatchEvent(
			new CustomEvent('_click', {
				detail: event,
				bubbles: false,
				composed: false
			})
		);

	}

}


if (!customElements.get('stxapp-button')) {
	customElements.define(
		'stxapp-button',
		StxAppButton
	);
}

