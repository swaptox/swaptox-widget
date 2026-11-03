import {
	LitElement,
	html,
	css
} from 'lit';

export class StxInput extends LitElement {
	static get properties() {
		return {
			disabledMiniPriceCard: { type: Boolean },
			value: {
				type: String
			},
			placeholder: {
				type: String
			},
			disabled: {
				type: Boolean
			},
			decimals: {
				type: Number
			},
			paytitle: {
				type: String
			},
			isinput: {
				type: String
			},
			tokenname: {
				type: String
			},
			balance: {
				type: String
			},
			valueusd: {
				type: String
			},
			styles: {
				type: String
			},
		};
	}

	constructor() {
		super();
		this.disabledMiniPriceCard = false;
		this.value = '';
		this.placeholder = '';
		this.disabled = false;
		this.isinput = '';
		this.decimals = 36; //默认不限制
		this.paytitle = '';
		this.tokenname = '';
		this.balance = '0';
		this.valueusd = '';
		this.styles = '';
		
		// 内部状态
		this._isComposing = false; 
		this._handleInput = this._handleInput.bind(this);
	}

	static get styles() {
		return css`
			:host {
				display: block;
				width: 100%;
				height: 104px;
			}
			
			.com-flex-space-between{
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				column-gap:6px;
			}
			.input-wrapper {
				position: relative;
				background-color: var(--stxui-theme-content-background-color, #fbfbfb);
				border-radius: 17px;
			}
			.stx-input-header{
				position: absolute;
				left: 15px;
				right: 15px;
				top: 10px;
			}
			.isinput-true{
				right: 122px;
			}
			
			.stx-input-footer{
				position: absolute;
				left: 15px;
				right: 36px;
				bottom: 8px;
			}
			.token-card-top-text{
				line-height: 18px;
				font-size: 14px;
				color: var(--stxui-theme-font-subcolor, #999);
				user-select: none;
				white-space: nowrap;
				font-family: var(--stxui-font-family);
			}
			
			.token-card-bottom-text{
				line-height: 16px;
				font-size: 14px;
				color: var(--stxui-theme-font-subcolor, #999);
				user-select: none;
				font-family: var(--stxui-font-family);
			}
			
			


			/* 针对 Chrome, Safari, Edge, Opera */
			input::-webkit-outer-spin-button,
			input::-webkit-inner-spin-button {
				-webkit-appearance: none;
				margin: 0;
			}
			
			input {
				position: relative;
				z-index: 1;
				width: 100%;
				height: 104px;
				padding: 0 15px;
				padding-right: 150px;
				padding-top: 4px;
				
				font-size: 20px;
				
				border-radius: 17px;
				border: 1px solid var(--stxui-theme-border-color, #eee);
				
				
				
				
				outline: none;
				box-sizing: border-box;
				color: var(--stxui-theme-font-color, #000);
				
				background-color: rgba(0, 0, 0, 0);
				font-family: var(--stxui-font-family);
				
				caret-color: var(--stxui-input-caret-color, #000000);
				caret-width: 2px;
				margin: 0;
				
				text-overflow: ellipsis;
				appearance: textfield;
				
				transition-timing-function: ease-in-out;
				transition-duration: 0.2s;
				/*transition-property: box-shadow, border, background-color;*/
				transition-property: box-shadow, border;
			}
			
			
			
			/* 设置 Placeholder 样式 */
			input::placeholder {
				font-size: 18px;
				user-select: none;
				font-family: var(--stxui-font-family);
				color: var(--stxui-input-placeholder-color, #999); /* 默认灰色 */
				opacity: 1; /* Firefox 默认有透明度，设为 1 保证颜色纯正 */
			}
			
			/* 针对不同内核的兼容性补充（可选，现代 Lit 通常只需要上面的写法） */
			input::-webkit-input-placeholder {
				font-size: 18px;
				color: var(--stxui-input-placeholder-color, #999);
				font-family: var(--stxui-font-family);
			}
			input::-moz-placeholder {
				font-size: 18px;
				color: var(--stxui-input-placeholder-color, #999);
				font-family: var(--stxui-font-family);
			}
			input:-ms-input-placeholder {
				font-size: 18px;
				color: var(--stxui-input-placeholder-color, #999);
				font-family: var(--stxui-font-family);
			}
			
			/* 聚焦状态 */
			input:focus {
				
				border: 1px solid var(--stxui-theme-focus-color, #02b6a680);
				box-shadow: 0 0 0 2px var(--stxui-theme-focus-color, #02b6a680);
			}
			
			input:not([disabled]):hover {
				
				border: 1px solid var(--stxui-theme-focus-color, #02b6a680);
				box-shadow: 0 0 0 2px var(--stxui-theme-focus-color, #02b6a680);
			}
			
			/* 禁用状态 */
			input:disabled {
				
			}
		`;
	}

/* <input style="${this.styles}"
				type="text" 
				pattern="^[0-9]*[.,]?[0-9]*$"
				inputmode="decimal"
				autocomplete="off"
				.value="${this.value}"
				placeholder="${this.placeholder}"
				?disabled="${this.disabled}"
				@input="${this._handleInput}"
				@change="${this._handleChange}"
				@blur="${this._handleBlur}"
				@keypress="${this._onKeyPress}"
			/> */


	render() {
		return html`
		<div class="input-wrapper">
			<div class="com-flex-space-between stx-input-header isinput-${this.isinput}">
				<span class="token-card-top-text">${this.paytitle}</span>
				
				
				<div style="display:flex;flex-direction:row;align-items:center;column-gap:2px;">
					<div style="height:17px;position:relative;top:-2px;">
						<svg t="1772029950151" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
							p-id="16402" width="17" height="17">
							<path fill="var(--stxui-theme-font-subcolor, #999)"
								d="M832 256h-40.209l-73.238-126.851c-35.2-60.968-113.883-82.051-174.851-46.851L242.841 256H192c-70.4 0-128 57.6-128 128v448c0 70.4 57.6 128 128 128h640c70.4 0 128-57.6 128-128V384c0-70.4-57.6-128-128-128zM575.703 137.723c30.484-17.6 69.826-7.058 87.426 23.426L717.891 256h-347.05l204.862-118.277zM896 704H672c-52.8 0-96-43.2-96-96s43.2-96 96-96h224v192zM672 448c-88 0-160 72-160 160s72 160 160 160h224v64c0 35.2-28.8 64-64 64H192c-35.2 0-64-28.8-64-64V384c0-35.2 28.8-64 64-64h640c35.2 0 64 28.8 64 64v64H672z"
								p-id="16403"></path>
						</svg>
					</div>
					<span class="token-card-top-text" style="font-size:14px;">${this.balance||0}</span>
				</div>
				
			</div>
			<div class="com-flex-space-between stx-input-footer" 
			style="${this.disabledMiniPriceCard?'right: 16px;':''}">
				<span class="token-card-bottom-text">${this.valueusd}</span>
				<span class="token-card-bottom-text">${this.tokenname}</span>
			</div>
			
			
			
			<input style="${this.styles}"
				type="text" 
				inputmode="decimal"
				enterkeyhint="done"
				autocomplete="off"
				pattern="[0-9]*([\.,][0-9]*)?"
				placeholder="${this.placeholder}"
				.value="${this.value}"
				?disabled="${this.disabled}"
				@input="${this._handleInput}"
				@keypress="${this._onKeyPress}"
				@blur="${this._handleBlur}"
				@compositionstart="${() => this._isComposing = true}"
				@compositionend="${(e) => { 
					this._isComposing = false; 
					this._handleInput(e); 
				}}"
				@keydown=${this.handleKeydown}
			/>
			
			
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
	
	/**
	     * 核心过滤逻辑
	     */
	    _processValue(rawVal) {
	        // 1. 全域归一化：处理中文句号、全角逗号等
	        let val = rawVal.replace(/[。，,]/g, '.');
	
	        // 2. 自动补零：把 "." 变成 "0."
	        if (val === '.') return '0.';
	
	        // 3. 正则初步检查：只允许数字和一个点
	        const reg = /^\d*\.?\d*$/;
	        if (!reg.test(val)) return this.value; // 非法字符直接回退
	
	        // 4. 精度控制
	        let decimals = parseInt(this.decimals) || 0;
				decimals = decimals===0?36:decimals;
	        if (decimals > 0 && val.includes('.')) {
	            const [integer, fraction] = val.split('.');
	            if (fraction.length > decimals) {
	                val = `${integer}.${fraction.substring(0, decimals)}`;
	            }
	        }
	
	        // 5. 防止 0 连写 (如 005 -> 5)，但保留 "0."
			if (val.length > 1 && val.startsWith('0') && val[1] !== '.') {
	            val = val.replace(/^0+/, '') || '0';
	        }
			
	
	        return val;
	    }
	
	    _handleInput(e) {
	        // 如果正在使用中文输入法组合字符，暂时不处理，防止打断输入
	        if (this._isComposing) return;
	
	        const input = e.target;
	        const oldCursor = input.selectionStart;
	        const oldLength = input.value.length;
	
	        // 获取处理后的值
	        const processedVal = this._processValue(input.value);
	        
			
	        // 更新内部状态
	        this.value = processedVal;
	        
	        // --- 核心：光标同步与修正 ---
	        input.value = this.value; 
	
	        // 计算光标偏移：如果处理后的长度变短了（比如截断或去0），修正光标
	        const lengthDiff = oldLength - this.value.length;
	        let newCursor = oldCursor;
	
	        if (lengthDiff > 0) {
	            // 字符变少了，光标向左修正
	            newCursor = Math.max(0, oldCursor - lengthDiff);
				//console.log('-------------', newCursor);
	        } else if (lengthDiff < 0) {
	            // 字符变多了（比如 . 变成 0.），光标向右修正
	            newCursor = oldCursor + Math.abs(lengthDiff);
				//console.log('-------------11', newCursor);
	        }
	
	        // 只有当 input 处于焦点时才重置光标
	        if (document.activeElement === input) {
	            input.setSelectionRange(newCursor, newCursor);
	        }
	
			
	
	        // 派发事件
	        this.dispatchEvent(new CustomEvent('input-amount', {
	            detail: { value: this.value },
	            bubbles: false,
	            composed: false
	        }));
	    }
	
	    /**
	     * 拦截科学计数法常用的符号
	     */
	    _onKeyPress(e) {
	        if (['-', '+', 'e', 'E'].includes(e.key)) {
	            e.preventDefault();
	        }
	    }
	
	    /**
	     * 失去焦点时：清理末尾多余的点 (例如把 "1." 变成 "1")
	     */
	    _handleBlur(e) {
	        if (this.value.endsWith('.')) {
	            this.value = this.value.slice(0, -1);
	            e.target.value = this.value;
	        }
	    }
	
	
	
	

	/* // 拦截某些特殊按键（如负号 -）
	_onKeyPress(e) {
		if (e.key === '-' || e.key === '+') {
			e.preventDefault();
		}
	}


	_handleInput(e) {
	    const input = e.target;
	    let val = input.value;
	
	    // --- 【新增：全域归一化】 ---
	    // 将中文句号(。)、中文逗号(，)、英文逗号(,) 统一转为 英文点(.)
	    val = val.replace(/[。，,]/g, '.');
	
	    // 1. 自动补零逻辑
	    if (val === '.') {
	        val = '0.';
	    }
	
	    // 2. 正则检查：允许数字和一个点
	    const reg = /^\d*\.?\d*$/;
	    const decimals = parseInt(this.decimals) || 0;
	
	    if (reg.test(val)) {
	        // 3. 精度控制逻辑
	        if (decimals > 0 && val.includes('.')) {
	            const [integer, fraction] = val.split('.');
	            if (fraction.length > decimals) {
	                val = `${integer}.${fraction.substring(0, decimals)}`;
	            }
	        }
	        
	        // 4. 防止 0 连写 (05 -> 5)，但保留 0.
	        if (val.length > 1 && val.startsWith('0') && val[1] !== '.') {
	            val = val.replace(/^0+/, '') || '0';
	        }
	
	        this.value = val;
	    } else {
	        // 如果输入了非法字符（如字母），或者第二个小数点
	        // 这里不需要做任何事，保持 this.value 不变，下方会强制同步 DOM
	    }
	
	    // 5. 强行同步：这一步非常关键，它会让非法输入瞬间消失
	    input.value = this.value;
	
	    this.dispatchEvent(new CustomEvent('input-amount', {
	        detail: { value: this.value },
	        bubbles: false,
	        composed: false
	    }));
	}

	
	_handleChange(e) {
		
	}

	_handleBlur(e) {
		
	} */
}
if (!customElements.get('stx-input')) {
	customElements.define('stx-input', StxInput);
}
