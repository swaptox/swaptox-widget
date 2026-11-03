import {
	LitElement,
	html,
	css
} from 'lit';



export class StxTokenLogo extends LitElement {
	static get properties() {
		return {
			size: {
				type: String
			},
			logo: {
				type: String
			},
			symbol: {
				type: String
			},
			showpng: {
				type: Boolean
			},
			abbreviation: {
				type: String
			},
		};
	}

	constructor() {
		super();
		this.size = '100%';
		this.symbol = '';
		this.logo = '';
		this.showpng = false;
		this.abbreviation = '';
	}
	
	willUpdate(changedProperties) {
	    if (changedProperties.has('symbol')) {
	        if (this.symbol) {
	            this.abbreviation = this.symbol.length?this.symbol[0].toUpperCase():'';
	        }
	    }
	}
	

	static get styles() {
		return css`
		:host {
			display: block;
		}
		
		.app-token-logo{
			user-select: none;
			position: relative;
			z-index: 1;
			border-radius: 200px;
			overflow: hidden;
			background-color: var(--stxui-theme-background-subcolor, #fff);
		}
		
		.token-logo-png{
			display: block;
			user-select: none;
			position: relative;
			z-index: 2;
			border-radius: 200px;
		}
		.default-placeholder-token-logo{
			position: absolute;
			inset: 0px;/*var(--stxui-dark-theme-logo-inset-diversity, 0px)*/
			border-radius: 200px;
			border: 1px dashed var(--dapp-token-logo-defaultborder-color, #d5d5d5);
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: var(--stxui-theme-background-subcolor, #fff);
		}
		.default-placeholder-token-name{
			user-select: none;
			color: #999;
			font-family: var(--stxui-font-family);
			transform:scale(0.9);transform-origin: center center;
		}
		.hidden-opacity { opacity: 0; }
		
		.bg-logo{
			position: absolute;
			inset: 0px;
			border-radius: 200px;
			z-index: 1;
		}
    `;
	}

	render() {
		return html`
		<div class="app-token-logo" style="width: ${this.size};height: ${this.size};max-width: ${this.size};max-height: ${this.size};min-width: ${this.size};">
			
			<div style="display:${this.showpng===true?'none':'flex'};" class="default-placeholder-token-logo">
				<span class="default-placeholder-token-name" style="font-size: calc(${this.size} / 2);"
				>${this.abbreviation}</span>
			</div>
			
			<div class="bg-logo" style="background-image:url('${this.logo}');background-size:cover;background-position:center;"></div>
			
			${this.logo?html`
				<img 
					loading="lazy"
					draggable="false"
					class="token-logo-png ${this.showpng===true?'':'hidden-opacity'}" 
					alt="${this.symbol}"
					width="${this.size}" 
					height="${this.size}" 
					style="max-width: ${this.size};max-height: ${this.size};" 
					src="${this.logo}" 
					@load="${this._onload}" 
					@error="${this._onerror}"
				>
			`:``}
			
		</div>
    `;
	}

	_onload(e) {
		//console.log('图片加载成功')
		this.showpng = true;
	}
	

	_onerror(e) {
	    const img = e.target;
	    const currentUrl = new URL(img.src);
	    // 1. 检查是否已经重试过
	    if (currentUrl.searchParams.has('t')) {
			console.log(`tokenLogo: GET ${this.logo} 404 (Not Found)`);
	        // 如果已经带了 t=retry 还是进到这里，说明图片是真的 404 或者地址彻底无效
	        // 此时建议切换到一个通用的本地默认占位图，防止页面显示“碎裂图标”
	        //img.src = 'https://cdn.swaptox.com/assets/default-token.png'; 
	        return;
	    }
	    // 2. 执行重试逻辑
	    // 延迟 500ms 是为了避开瞬时的并发网络挤塞
	    setTimeout(() => {
	        // 设置一个唯一的标记，既能破除缓存，又能作为“已重试”的判断依据
	        currentUrl.searchParams.set('t', 'retry');
	        img.src = currentUrl.toString();
	    }, this.getRandomInt(100, 1000));
	}
	getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
}
if (!customElements.get('stx-token-logo')) {
	customElements.define('stx-token-logo', StxTokenLogo);
}
