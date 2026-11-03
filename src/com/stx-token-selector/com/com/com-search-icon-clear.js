import {
	LitElement,
	html,
	css
} from 'lit';


export class comSearchIconClear extends LitElement {
	static get properties() {
		return {
			
		};
	}

	constructor() {
		super();
	}

	static get styles() {
		return css`
		:host {
			display: block;
		}
		.com-search-icon-clear{
			cursor: pointer;
			position: relative;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			border-radius: 100px;
			box-shadow: 0 0 0 1px var(--stxui-card-line-color, #ececec);
			background-color: var(--stxui-modal-background-color, #fff);
			height: 28px;
			max-height: 28px;
			padding-left: 12px;
			padding-right: 12px;
			transition:
				opacity 0.2s ease-in-out,
				box-shadow 0.2s ease-in-out,
				background-color 0.2s ease-in-out;
		}
		.com-search-icon-clear:hover{
			background-color: var(--stxui-list-item-bg-hover, #fbfbfb);
			box-shadow: 0 0 0 2px var(--stxui-theme-focus-color, #02b6a680);
		}
		.com-search-icon-clear:active{
			opacity: 0.8;
			background-color: var(--stxui-list-item-bg-hover, #fbfbfb);
		}
		
		
		
		.clear-tag-text{
			font-size: 14px;
			color: var(--stxui-theme-font-color, #111);
			user-select: none;
			line-height: 28px;
			font-family: var(--stxui-font-family);
		}
		
    `;
	}

	render() {
		return html`
		<div @click=${this._onClick} class="com-search-icon-clear">
			<span class="clear-tag-text"><slot></slot></span>
		</div>
    `;
	}

	_onClick() {
		this.dispatchEvent(new CustomEvent('change', {
			detail: {},
			bubbles: true,
			composed: true
		}));
	}

}
if (!customElements.get('com-search-icon-clear')) {
	customElements.define('com-search-icon-clear', comSearchIconClear);
}