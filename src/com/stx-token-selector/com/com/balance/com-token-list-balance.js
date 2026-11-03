import {
	LitElement,
	html,
	css
} from 'lit';

import {$app} from '../../../../../js_sdk/index.js';

export class comTokenListBalance extends LitElement {
	static get properties() {
		return {
			load: { type: Boolean },
			balance: { type: String },
		};
	}

	constructor() {
		super();
		this.load = false;
		this.balance = '';
	}
	
	
	static styles = css`
		:host {
			display: block;
		}
		.com-token-list-balance{
			font-size: 16px;
			color: var(--stxui-theme-font-color, #111);
			user-select: none;
			white-space:nowrap;
			
			/* 使用等宽数字，防止数字颤抖 */
			/*
			font-feature-settings: "tnum"; 
			font-variant-numeric: tabular-nums;
			*/
		   
			display: inline-flex;
			align-items: baseline;
			font-family: var(--stxui-font-family);
			
			-webkit-font-smoothing: antialiased;
			letter-spacing: 0.01em;
		}
		
		
		/* 骨架屏动画 */
		.skeleton {
			position: absolute;
			z-index: 1;
			overflow: hidden;
			border-radius: 8px;
			top: -1px; bottom: -1px; right: -1px; left: -30px;
		}
		.skeleton::after {
			position: absolute;
			top: 0; right: 0; bottom: 0; left: 0;
			background-image: var(--stxui-skeleton-background-mini-load);
			background-size: 500% 500%;
			animation: skeleton 1.8s ease infinite;
			content: '';
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

	render() {
		//const balance_up = $app.formatBalance(this.balance);//HTML
		return html`
		<div style="position:relative;">
			${this.load?html`<div class="skeleton"></div>`:``}
			<span class="com-token-list-balance">${this.balance}</span>
		</div>
    `;
	}

}
if (!customElements.get('com-token-list-balance')) {
	customElements.define('com-token-list-balance', comTokenListBalance);
}
