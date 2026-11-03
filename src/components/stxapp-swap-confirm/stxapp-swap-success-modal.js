
import {
	LitElement,
	html,
	css
} from 'lit';

import { $app } from '../../js_sdk/index.js';
import './swap/com/stxcom-swap-success.js';

export class StxappSwapSuccessModal extends LitElement {

	static properties = {
		isOpen: {
			type: Boolean,
			state: true
		},
	};

	static styles = css`
		:host {
			position: fixed;
			inset: 0;
			z-index: 2147483646;
			display: block;
			pointer-events: none;
			visibility: hidden;
		}

		:host([opened]) {
			visibility: visible;
			pointer-events: auto;
		}

		.modal-mask {
			position: absolute;
			inset: 0;
			
			backdrop-filter: blur(12px) saturate(1.5);
			background-color: rgba(0, 0, 0, .12);
			
			opacity: 0;
			visibility: hidden;
			pointer-events: none;
		}

		:host([opened]) .modal-mask {
			opacity: 1;
			visibility: visible;
			pointer-events: auto;
		}

		.modal-container {
			position: absolute;
			inset: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
			pointer-events: none;
		}

		.modal-content {
			position: relative;
			box-sizing: border-box;
			width: 50vw;
			max-width: 460px;
			border-radius: 20px;
			
			height: 364px;
			max-height: 364px;

			display: flex;
			flex-direction: column;

			background-color: var(--stxui-modal-background-color, #fff);

			overflow: hidden;
			pointer-events: auto;

			visibility: hidden;
		}
		@media (max-width: 992px) {
			.modal-content {
				width: 65vw;
			}
		}
		@media (max-width: 768px) {
			.modal-content {
				width: 94vw;
			}
		}

		:host([opened]) .modal-content {
			visibility: visible;
		}
	`;

	constructor() {
		super();
		this.isOpen = false;
	}

	connectedCallback() {
		super.connectedCallback();
		this.toggleAttribute('opened', this.isOpen);
	}

	/**
	 * 打开弹窗
	 * 不等待 Lit 更新，直接显示
	 */
	open(url) {
		this._url = url||'';
		// 立即显示
		this.isOpen = true;
		this.setAttribute('opened', '');
	}

	/**
	 * 关闭弹窗
	 */
	close() {
		this.isOpen = false;
		this.removeAttribute('opened');
	}


	_close(e) {
		e?.stopPropagation();
		this.close();
	}

	render() {
		return html`
			<div class="modal-mask"></div>
			<div class="modal-container">
				<div class="modal-content">

					<stxcom-swap-success
						@swap-success-close=${this._close}
						@change-link=${this._changeLink}
					></stxcom-swap-success>

				</div>
			</div>
		`;
	}
	
	_changeLink(){
		if(this._url){
			$app.openUrl(this._url);
		}
	}
	
}


// 注册组件
if (!customElements.get('stxapp-swap-success-modal')) {
	customElements.define(
		'stxapp-swap-success-modal',
		StxappSwapSuccessModal
	);
}


// 自动挂载，确保全局只有一个实例
function mountSwapSuccessModal() {

	if (!document.body) return;

	const elements = document.querySelectorAll(
		'stxapp-swap-success-modal'
	);

	let instance = elements[0];

	// 清理重复实例
	for (let i = 1; i < elements.length; i++) {
		elements[i].remove();
	}

	if (!instance) {
		instance = document.createElement(
			'stxapp-swap-success-modal'
		);
	}

	if (instance.parentElement !== document.body) {
		document.body.appendChild(instance);
	}

	return instance;
}


if (document.body) {
	mountSwapSuccessModal();
} else {
	document.addEventListener(
		'DOMContentLoaded',
		mountSwapSuccessModal,
		{ once: true }
	);
}
