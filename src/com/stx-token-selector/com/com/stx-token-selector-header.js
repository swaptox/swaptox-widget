import {
	LitElement,
	html,
	css
} from 'lit';

import '../../../../icon/com-icon-close.js';
import './com-search-icon-clear.js';

export class StxTokenSelectorHeader extends LitElement {
	static properties = {
		placeholder: {
			type: String,
		},
		clearinput: {
			type: String,
		},
		searchInput: {
			type: String,
		},
		isFocus: {
			type: Boolean,
		},
	};
	
	constructor() {
		super();
		this.searchInput = '';
		this.placeholder = '';
		this.clearinput = '';
		this.isFocus = false;
	}
	

	static styles = css`
		:host {
			display: block;
		}
		.stx-token-selector-header{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
		
		.flex-center-center{
			display: flex;
			justify-content: center;
			align-items: center;
		}
		
		
		input {
			border: none;
			width: 100%;
			height: 58px;
			padding-left: 45px;
			padding-right: 10px;
			font-size: 15px;
			position: relative;
			z-index: 1;
			
			color: var(--stx-input-text-color, #111827);
			transition: all 0.2s ease-in-out;
			outline: none;
			box-sizing: border-box;
			color: var(--stxui-theme-font-color, #000);
			
			background-color: transparent;
			font-family: var(--stxui-font-family);
			
			caret-color: var(--stxui-input-caret-color, #000000);
			caret-width: 2px;
			margin: 0;
		}
		
		input::placeholder {
			user-select: none;
			font-family: var(--stxui-font-family);
			color: var(--stxui-input-placeholder-color, #999);
			opacity: 1;
		}
		
		/* 针对不同内核的兼容性补充（可选，现代 Lit 通常只需要上面的写法） */
		input::-webkit-input-placeholder {
			color: var(--stxui-input-placeholder-color, #999);
			font-family: var(--stxui-font-family);
		}
		input::-moz-placeholder {
			color: var(--stxui-input-placeholder-color, #999);
			font-family: var(--stxui-font-family);
		}
		input:-ms-input-placeholder {
			color: var(--stxui-input-placeholder-color, #999);
			font-family: var(--stxui-font-family);
		}
		
		
		
		.div-input-body{
			flex:1;
			height:58px;
			position:relative;
		}
		
		.close-autofocus{
			position: absolute;
			height: 0px;
			height: 0px;
			max-width: 0px;
			max-height: 0px;
			opacity: 0;
		}
	`;

	
	

	render() {
		return html`
		<div class="stx-token-selector-header">
			<button class="close-autofocus" autofocus></button>
			<div class="div-input-body">
				<div class="flex-center-center" style="position:absolute;top:0;left:0;bottom:0;width:48px;">
					<svg t="1770556609829" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14522" width="18" height="18"><path d="M1004.416 912.064l-209.088-209.088 1.28-1.6a436.416 436.416 0 0 0 85.504-260.672A441.152 441.152 0 0 0 441.472 0 441.152 441.152 0 0 0 0.832 440.704a441.152 441.152 0 0 0 440.64 440.64c94.4 0 184.704-29.44 260.736-85.568l1.6-1.28 1.28 1.28 207.808 207.872c12.352 12.352 28.48 19.008 45.888 19.008 17.472 0 33.6-6.656 45.952-19.008a64.896 64.896 0 0 0-0.32-91.52z m-562.944-135.296a336.192 336.192 0 0 1-335.808-335.744 336.192 336.192 0 0 1 335.808-335.808 336.192 336.192 0 0 1 335.808 335.808 336.384 336.384 0 0 1-335.808 335.744z" 
					fill="${this.isFocus?'var(--stxui-theme-color, #02b6a6)':'var(--stxui-dark-theme-focus-subcolor, #999)'}" p-id="14523"></path></svg>
				</div>
				
				<input 
					maxlength="42"
					.value="${this.searchInput}"
					type="text" 
					autocomplete="off"
					enterkeyhint="search"
					placeholder="${this.placeholder}"
					@input="${this._handleInput}"
					@change="${this._handleChange}"
					@blur="${this._onBlur}"
					@focus="${this._onFocus}"
					@keydown=${this.handleKeydown}
				/>
				
			</div>
			<div style="padding: 15px 15px;padding-left:0px;display: flex;flex-direction: row;align-items: center;column-gap: 10px;">
				${this.searchInput?html`
					<com-search-icon-clear @change="${this._onClear}"
					>${this.clearinput}</com-search-icon-clear>
				`:``}
				<com-icon-close @change="${this._onClose}" size="default"></com-icon-close>
			</div>
		</div>
    `;
	}
	
	handleKeydown(e) {
	    if (e.key === 'Enter') {
			e.preventDefault(); // 防止表单默认提交行为（如果在form中）
			const input = this.renderRoot.querySelector('input');
			input?.blur();
	    }
	}
	
	
	_onClose() {
		this.dispatchEvent(new CustomEvent('close', {
			detail: { value: this.searchInput },
			bubbles: true,
			composed: true
		}));
	}
	
	
	_onClear() {
		this.searchInput = '';
		this._changeInput();
	}
	
	// 当用户输入时实时触发
	_handleInput(e) {
		this.searchInput = e.target.value;
		this._changeInput();
	}
	
	
	_changeInput() {
		this.dispatchEvent(new CustomEvent('search-input', {
			detail: { value: this.searchInput },
			bubbles: true,
			composed: true
		}));
	}
	
	
	// 当输入框失去焦点且内容改变后触发
	_handleChange(e) {
		//console.log('_handleChange', e.target.value);
	}
	
	_onBlur(e) {
		this.isFocus = false;
		//console.log('_onBlur', e.target.value);
	}
	_onFocus(e) {
		this.isFocus = true;
		//console.log('_onFocus', e.target.value);
	}
}

if (!customElements.get('stx-token-selector-header')) {
	customElements.define('stx-token-selector-header', StxTokenSelectorHeader);
}
