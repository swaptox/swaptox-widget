import { LitElement, html, css } from 'lit';

export class ComSlippagInput extends LitElement {
    static get properties() {
        return {
            value: { type: String, reflect: true },
            selected: { type: Boolean },
			defaultvalue: { type: String },
			customtext: { type: String },
        };
    }

    constructor() {
        super();
        this.value = '';
        this.selected = false;
		this.defaultvalue = '0.5';
        this._isComposing = false;
        this._handleInput = this._handleInput.bind(this);
		this.customtext = '';
    }

    static styles = css`
        :host {
            display: block;
			position: relative;
			width: 100%;
			height: 30px;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        input {
            width: 100%;
            height: 30px;
            padding: 0 15px;
            font-size: 15px;
            border: 0px solid transparent;
            border-radius: 100px;
			box-shadow: 0 0 0 1px var(--stxui-modal-border-color, #ddd);
            color: var(--stxui-theme-font-color, #000);
            outline: none;
            box-sizing: border-box;
            
			background-color: var(--stxui-modal-content-background-color, #fbfbfb);
            font-family: var(--stxui-font-family);
            caret-color: var(--stxui-input-caret-color, #000000);
            margin: 0;
            text-overflow: ellipsis;
            appearance: textfield;
            transition: all 0.2s ease;
			text-align: center;
			letter-spacing: 0.03em;
        }
        input:focus, input:hover {
            box-shadow: 0 0 0 1px var(--stxui-theme-color, #02b6a6);
            background-color: #02b6a60d;
        }
		
		
		/* 设置 Placeholder 样式 */
		input::placeholder {
			font-size: 15px;
			user-select: none;
			font-family: var(--stxui-font-family);
			color: var(--stxui-input-placeholder-color, #b2b2b2); /* 默认灰色 */
			opacity: 1; /* Firefox 默认有透明度，设为 1 保证颜色纯正 */
		}
		
		/* 针对不同内核的兼容性补充（可选，现代 Lit 通常只需要上面的写法） */
		input::-webkit-input-placeholder {
			font-size: 15px;
			color: var(--stxui-input-placeholder-color, #b2b2b2);
			font-family: var(--stxui-font-family);
		}
		input::-moz-placeholder {
			font-size: 15px;
			color: var(--stxui-input-placeholder-color, #b2b2b2);
			font-family: var(--stxui-font-family);
		}
		input:-ms-input-placeholder {
			font-size: 15px;
			color: var(--stxui-input-placeholder-color, #b2b2b2);
			font-family: var(--stxui-font-family);
		}
		
		
		.zhenwei-fuhao{
			position: absolute;
			top: 0px;bottom: 0px;left: 15px;right: 15px;z-index: 1;
			pointer-events: none;
			display: flex;flex-direction: row;align-items: center;justify-content: space-between;
		}
		.zhenwei-value{
			font-size: 15px;
			color: var(--stxui-theme-font-subcolor, #999);
			user-select: none;
			font-family: var(--stxui-font-family);
		}
		
		.slippag-low{}
		.slippag-low:hover {
			box-shadow: 0 0 0 1px #ff8585;
			background-color: #ff000012;
		}
    `;

    render() {
		
		let isLows = '';
		let styles = '';
		try {
			if(this.selected){
				styles = 'background-color: #02b6a60d;color:var(--stxui-theme-color, #02b6a6);box-shadow: 0 0 0 1px var(--stxui-theme-color, #02b6a6);';
				if(!this.value||parseFloat(this.value)<0.1){
					styles = 'background-color: #ff000012;color:#fd0000;box-shadow: 0 0 0 1px #ff8585;';
				}else if(parseFloat(this.value)>1){
					styles = 'background-color: #ffa7000d;color:#fd8e00;box-shadow: 0 0 0 1px #ffae46;';
				}
			}
			if(!this.value||parseFloat(this.value)<0.1){
				isLows = 'slippag-low';
			}			
		} catch (e) {}
		
        return html`
            <input class="${isLows}" style="user-select:none;${styles}"
                type="text" 
                inputmode="decimal"
                autocomplete="off"
                placeholder="${this.defaultvalue}"
                .value="${this.value}"
                @input="${this._handleInput}"
                @keypress="${this._onKeyPress}"
                @blur="${this._handleBlur}"
                @focus="${this._handleFocus}"
                @compositionstart="${() => this._isComposing = true}"
                @compositionend="${(e) => { 
                    this._isComposing = false; 
                    this._handleInput(e); 
                }}"
            />
			
			<div class="zhenwei-fuhao">
				<span class="zhenwei-value" style="font-size:14px;">${this.customtext}</span>
				<span class="zhenwei-value">%</span>
			</div>
        `;
    }
	
	
	/**
	 * 核心过滤逻辑：增加滑点范围校验
	 */
	_processValue(rawVal) {
	    // 1. 全域归一化
	    let val = rawVal.replace(/[。，,]/g, '.');
	
	    // 2. 自动补零
	    if (val === '.') return '0.';
	
	    // 3. 基本正则检查
	    const reg = /^\d*\.?\d*$/;
	    if (!reg.test(val)) return this.value;
	
	    // 4. 数值上限检查：不能超过 10
	    // 我们先转成数字探测一下，如果超过 10，直接回退或强制设为 10
	    const numCheck = parseFloat(val);
	    if (!isNaN(numCheck) && numCheck > 10) {
	        return '10'; // 高端做法是直接锁死在 10
	    }
	
	    // 5. 精度控制 (滑点强制 2 位)
	    const decimals = 2;
	    if (val.includes('.')) {
	        const [integer, fraction] = val.split('.');
	        if (fraction.length > decimals) {
	            val = `${integer}.${fraction.substring(0, decimals)}`;
	        }
	    }
	
	    // 6. 防止 0 连写 (05 -> 5)
	    if (val.length > 1 && val.startsWith('0') && val[1] !== '.') {
	        val = val.replace(/^0+/, '') || '0';
	    }
	
	    return val;
	}
	
	_handleInput(e) {
	    if (this._isComposing) return;
	
	    const input = e.target;
	    const oldCursor = input.selectionStart;
	    const oldLength = input.value.length;
	
	    const processedVal = this._processValue(input.value);
	    this.value = processedVal;
	    
	    input.value = this.value; 
	
	    // 光标修正
	    const lengthDiff = oldLength - this.value.length;
	    let newCursor = oldCursor;
	    if (lengthDiff > 0) {
	        newCursor = Math.max(0, oldCursor - lengthDiff);
	    } else if (lengthDiff < 0) {
	        newCursor = oldCursor + Math.abs(lengthDiff);
	    }
	
	    if (document.activeElement === input) {
	        input.setSelectionRange(newCursor, newCursor);
	    }
	
	    this.dispatchEvent(new CustomEvent('input-slippag', {
	        detail: { value: this.value },
	        bubbles: false,
	        composed: false
	    }));
	}
	
	_onKeyPress(e) {
	    if (['-', '+', 'e', 'E'].includes(e.key)) {
	        e.preventDefault();
	    }
	}
	
	/**
	 * 失去焦点：处理最小值 0.01 和末尾小数点
	 */
	_handleBlur(e) {
	    let finalVal = this.value;
	
	    // 1. 清理末尾小数点
	    if (finalVal.endsWith('.')) {
	        finalVal = finalVal.slice(0, -1);
	    }
	
	    // 2. 最小值边界校验：如果用户输入了太小的值或为空
	    const num = parseFloat(finalVal);
	    if (finalVal !== '' && !isNaN(num)) {
	        if (num < 0.01) {
	            finalVal = this.defaultvalue; // 修正为最小值
	        }
	    }
		
		if(!finalVal){
			finalVal = this.defaultvalue; // 修正为最小值
		}
	
	    this.value = finalVal;
	    e.target.value = this.value;
	
	    this.dispatchEvent(new CustomEvent('input-slippag', {
	        detail: { value: this.value },
			bubbles: false,
			composed: false
	    }));
	}
	
	_handleFocus(){
		this.dispatchEvent(new CustomEvent('input-slippag', {
		    detail: { value: this.value },
		    bubbles: false,
		    composed: false
		}));
	}
	
	
}
if (!customElements.get('com-slippag-input')) {
	customElements.define('com-slippag-input', ComSlippagInput);
}
