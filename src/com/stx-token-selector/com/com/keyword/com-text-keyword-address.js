import {
	LitElement,
	html,
	css
} from 'lit';


export class ComTextKeywordAddress extends LitElement {
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
			height: 16px;
			line-height: 16px;
			max-height: 16px;
			display: flex;
		}
		.com-text-keyword-address {
			font-size: 12px;
			color: var(--stxui-dark-theme-focus-subcolor, #999);
			user-select: none;
			font-family: var(--stxui-font-family);
			height: 16px;
			line-height: 16px;
			max-height: 16px;
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
		
		if(this.keyword){
			
			if(this.keyword.toLowerCase()===this.text.toLowerCase()){
				return html`
					<span class="com-text-keyword-address" style="color:#f73131;"
					>${this.text.substring(0, 6)}...${this.text.slice(-4)}</span>
				`;
			}else{
				
				let strs = this._highlightKeyword(this.text, this.keyword);
				
				let leftHTML = [];
				for(let i = 0; i < 6; i++){
					leftHTML.push(this._geti(i, this.text, strs));
				}
				
				let rightHTML = [
					this._geti(this.text.length-4, this.text, strs),
					this._geti(this.text.length-3, this.text, strs),
					this._geti(this.text.length-2, this.text, strs),
					this._geti(this.text.length-1, this.text, strs)
				];
				
				if(this._removeCharsIS(strs)){
					return html`
						<span class="com-text-keyword-address">${leftHTML}<em>...</em>${rightHTML}</span>
					`;
				}else{
					return html`
						<span class="com-text-keyword-address">${leftHTML}...${rightHTML}</span>
					`;
				}
			}
		}
		
		
		return html`
		<span class="com-text-keyword-address">${this.text.substring(0, 6)}...${this.text.slice(-4)}</span>
    `;
	}
	
	_highlightKeyword(text, keyword) {
		try {
			if (!text || !keyword) return text;
			const regex = new RegExp(keyword, 'gi');
			return text.replace(regex, (match) => {
				let srt = '';
				for(let i = 0; i < match.length; i++){
					srt += '-';
				}
				return srt;
			});			
		} catch (err) {}
		return text;
	}
	_removeCharsIS(str) {
		let qian = str.substring(6);
		let hous = qian.substring(0, qian.length - 4);
		return hous.indexOf('-') != -1;
	}
	_geti(index, address, strs){
		if(strs[index]==='-'){
			return html`<em>${address[index]}</em>`;
		}
		return address[index];
	}
	
}
if (!customElements.get('com-text-keyword-address')) {
	customElements.define('com-text-keyword-address', ComTextKeywordAddress);
}
