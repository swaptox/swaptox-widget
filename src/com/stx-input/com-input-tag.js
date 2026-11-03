import {
	LitElement,
	html,
	css
} from 'lit';


export class comInputTag extends LitElement {
	static get properties() {
		return {
			text: {
				type: String
			},
			disabled: {
				type: Boolean
			},
			isTouchDevice: {
				type: Boolean
			},
		};
	}

	constructor() {
		super();
		this.text = '';
		this.disabled = true;
		
		this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		if (this.isTouchDevice) {
		    //console.log("这是一个支持触摸的设备");
		}
	}

	static get styles() {
		return css`
		:host {
			display: block;
		}
		.com-input-tag{
			position: relative;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			border-radius: 100px;
			transition: 
				border 0.2s ease-in-out,
				box-shadow 0.2s ease-in-out,
				opacity 0.2s ease-in-out;
			border: 1px solid var(--stxui-theme-border-color, #eee);
			background-color: var(--stxui-token-select-input-tag-bg, #fff);
			height: 20px;
			width: 44px;
		}
		

		
		
		.disabled-tag-false{
			cursor: pointer;
		}
		.disabled-tag-false:hover{
			border: 1px solid var(--stxui-theme-focus-color, #02b6a680);
			background-color: var(--stxui-token-select-input-tag-bg-hover, #eee);
			box-shadow: 0 0 0 1px var(--stxui-theme-focus-color, #02b6a680);
		}
		.disabled-tag-false:active{
			opacity: 0.8;
			background-color: var(--stxui-token-select-input-tag-bg-hover, #eee);
		}		
		
		
		
		.disabled-tag-true{
			opacity: 0.8;
			cursor: auto;
		}
		
		
		.input-tag-text{
			user-select: none;
			font-size: 13px;
			white-space: nowrap;
			color: var(--stxui-token-select-input-tag-text, #111);
			font-family: var(--stxui-font-family);
		}
		
		
		.on-click-css{
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 1;
		}
		.is-touch-device{
			top: -8px;
			left: -4px;
			right: -4px;
			bottom: -8px;
		}
    `;
	}

	render() {
		return html`
		<div class="com-input-tag ${this.disabled?'disabled-tag-true':'disabled-tag-false'}">
			
			<span class="input-tag-text" style="opacity: ${this.disabled?'0.7':'1'};">${this.text}</span>
			
			<div @click=${this._onClick} class="on-click-css ${this.isTouchDevice?'is-touch-device':''}"></div>
			
		</div>
    `;
	}

	_onClick() {
		if(this.disabled){
			return;
		}
		this.dispatchEvent(new CustomEvent('change'));
	}

}



if (!customElements.get('com-input-tag')) {
	customElements.define('com-input-tag', comInputTag);
}


