import {
	LitElement,
	html,
	css
} from 'lit';


export class ComTextKeywordFullAddress extends LitElement {
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
			display: flex;
			height: 18px;
			line-height: 18px;
			max-height: 18px;
		}
		.com-text-keyword-full-address {
			font-size: 12px;
			color: var(--stxui-theme-font-color, #111);
			user-select: none;
			font-family: var(--stxui-font-family);
			height: 18px;
			line-height: 18px;
			max-height: 18px;
			white-space:nowrap;
			letter-spacing: -0.02em;
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
		<span class="com-text-keyword-full-address">${_elDiv}</span>
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
if (!customElements.get('com-text-keyword-full-address')) {
	customElements.define('com-text-keyword-full-address', ComTextKeywordFullAddress);
}
