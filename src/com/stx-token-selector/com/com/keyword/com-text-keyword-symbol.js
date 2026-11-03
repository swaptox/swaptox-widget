import {
	LitElement,
	html,
	css
} from 'lit';


export class ComTextKeywordSymbol extends LitElement {
	static get properties() {
		return {
			text: {
				type: String,
			},
			keyword: {
				type: String,
			},
		};
	}

	constructor() {
		super();
		this.text = '';
		this.keyword = '';
	}

	static get styles() {
		return css`
		:host {
			display: block;
			flex: 1;
		}
		.com-text-keyword-symbol {
			font-size: 15px;
			line-height: 18px;
			color: var(--stxui-theme-font-color, #111);
			user-select: none;
			font-family: var(--stxui-font-family);
			max-width: 240px;
		}
		.com-symbol-ellipsis {
			word-break: break-all;
			overflow: hidden;
			text-overflow: ellipsis !important;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1 !important;
		}
		em {
		    color: #f73131;
		    text-decoration: none;
			font-style: normal;
			font-family: var(--stxui-font-family);
			user-select: none;
		}
    `;
	}

	render() {
		let _elDiv = this._highlightKeyword(this.text, this.keyword);
		return html`
		<span class="com-text-keyword-symbol com-symbol-ellipsis">${_elDiv}</span>
    `;
	}
	
	_highlightKeyword(text, keyword) {
	    if (!text || !keyword) return text;
	    const regex = new RegExp(`(${keyword})`, 'gi');
	    const parts = text.split(regex); // 按照关键词切开成数组
	    return parts.map(part => {
	        if (part.toLowerCase() === keyword.toLowerCase()) {
	            // 关键词部分，返回一个模板对象，而不是字符串
	            return html`<em>${part}</em>`;
	        }
	        // 普通文本部分
	        return part;
	    });
	}

}
if (!customElements.get('com-text-keyword-symbol')) {
	customElements.define('com-text-keyword-symbol', ComTextKeywordSymbol);
}
