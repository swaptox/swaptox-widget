import {
	LitElement,
	html,
	css
} from 'lit';



export class StxcomChainSelectHeaderSearch extends LitElement {
	static properties = {
		placeholder: {
			type: String,
		},
		inputValue: {
			type: String,
		},
	};
	
	constructor() {
		super();
		this.inputValue = '';
		this.placeholder = '';
	}
	

	static styles = css`
		:host {
			display: block;
		}
		.stx-token-selector-header{
			position: relative;
		}
		
		
		input {
			width: 100%;
			height: 40px;
			padding-left: 15px;
			padding-right: 40px;
			font-size: 14px;
			position: relative;
			z-index: 1;
			
			border-radius: 100px;
			border: 1px solid var(--stxui-app-input-border-color, #eee);
			
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
			background-color: var(--stxui-app-input-background-color);
		}
		
		/* 设置 Placeholder 样式 */
		input::placeholder {
			font-size: 15px;
			user-select: none;
			font-family: var(--stxui-font-family);
			color: var(--stxui-input-placeholder-color, #999); /* 默认灰色 */
			opacity: 1; /* Firefox 默认有透明度，设为 1 保证颜色纯正 */
		}
		
		/* 针对不同内核的兼容性补充（可选，现代 Lit 通常只需要上面的写法） */
		input::-webkit-input-placeholder {
			font-size: 14px;
			color: var(--stxui-input-placeholder-color, #999);
			font-family: var(--stxui-font-family);
		}
		input::-moz-placeholder {
			font-size: 14px;
			color: var(--stxui-input-placeholder-color, #999);
			font-family: var(--stxui-font-family);
		}
		input:-ms-input-placeholder {
			font-size: 14px;
			color: var(--stxui-input-placeholder-color, #999);
			font-family: var(--stxui-font-family);
		}
		
		/* 聚焦状态 */
		input:focus {
			border: 1px solid var(--stxui-theme-focus-color, #02b6a680);
			box-shadow: 0 0 0 2px var(--stxui-theme-focus-color, #02b6a680);
			background-color: var(--stxui-app-input-background-color-hover);
		}
		
		input:not([disabled]):hover {
			border: 1px solid var(--stxui-theme-focus-color, #02b6a680);
			box-shadow: 0 0 0 2px var(--stxui-theme-focus-color, #02b6a680);
			background-color: var(--stxui-app-input-background-color-hover);
		}
		
		
		
		.ui-icon-close-body22{
			width: 28px;
			min-width: 28px;
			height: 28px;
			border-radius: 9px;
			transition:
				box-shadow .3s cubic-bezier(.4, 0, .2, 1),
				border-color .3s cubic-bezier(.4, 0, .2, 1);
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--stxui-theme-font-color, #111);
			fill: var(--stxui-theme-font-color, #111);
		}
		.ui-icon-close-body22:hover {
			background-color: #02b6a60d;
			color: var(--stxui-theme-icon-color, #00a99a);
			fill: var(--stxui-theme-icon-color, #00a99a);
		}
		.ui-icon-close-icon22{
			fill: inherit;
			width: 11px;
			height: 11px;
		}
		.ui-icon-close-icon22[size=default]{
			width: 11px;
			height: 11px;
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
				<input 
					maxlength="12"
					enterkeyhint="done"
					.value="${this.inputValue}"
					name="swaptox_chain_search_input"
					type="text" 
					autocomplete="off"
					.placeholder="${this.placeholder}"
					@input="${this._handleInput}"
					@keydown=${this.handleKeydown}
					@blur="${this._onBlur}"
					@focus="${this._onFocus}"
				/>
				
				
				${this.inputValue?html`
					<div style="position: absolute;top: 0;bottom: 0;right: 0;z-index: 2;width: 45px;display: flex;align-items: center;justify-content: center;">
						<div class="ui-icon-close-body22" @click="${this._onClear}">
							<svg t="1770553993795" class="ui-icon-close-icon22" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12734"><path d="M605.23433 512.448271L1002.955803 114.355709c25.606159-25.725766 25.606159-67.144608 0-92.869353-25.612293-25.7319-67.144608-25.7319-92.755879 0L512.478451 419.572785 114.881696 21.486356c-25.612293-25.7319-67.144608-25.7319-92.756902 0-25.607182 25.725766-25.607182 67.143586 0 92.869353l397.602889 397.966821L22.124794 910.417138c-25.607182 25.7319-25.607182 67.144608 0 92.876508 12.742765 12.863394 29.530706 19.234266 46.437232 19.234266 16.787941 0 33.57486-6.370871 46.439277-19.234266l397.476125-397.967844L910.079295 1003.292624c12.743787 12.863394 29.650313 19.234266 46.438254 19.234265 16.781807 0 33.569748-6.370871 46.313536-19.234265 25.606159-25.7319 25.606159-67.144608 0-92.876509l-397.596755-397.967844z m0 0" p-id="12735"></path></svg>
						</div>
					</div>
				`:null}
				
				
			</div>
		`;
	}
	
	
	_onBlur() {
		this.dispatchEvent(new CustomEvent('blur', {
			bubbles: false,
			composed: false
		}));
	}
	_onFocus() {
		this.dispatchEvent(new CustomEvent('focus', {
			bubbles: false,
			composed: false
		}));
	}
	
	
	handleKeydown(e) {
	    if (e.key === 'Enter') {
			e.preventDefault(); // 防止表单默认提交行为（如果在form中）
			this._changeInput();
			const input = this.renderRoot.querySelector('input');
			input?.blur();
	    }
	}
	
	setValue(e) {
		this.inputValue = e;
		this._changeInput();
	}
	
	
	_onClear() {
		this.inputValue = '';
		this._changeInput();
	}
	
	// 当用户输入时实时触发
	_handleInput(e) {
		this.inputValue = e.target.value;
		this._changeInput();
	}
	
	
	_changeInput() {
		this.dispatchEvent(new CustomEvent('search-input', {
			detail: { value: this.inputValue },
			bubbles: true,
			composed: true
		}));
	}
}


if (!customElements.get('stxcom-chain-select-header-search')) {
	customElements.define('stxcom-chain-select-header-search', StxcomChainSelectHeaderSearch);
}
