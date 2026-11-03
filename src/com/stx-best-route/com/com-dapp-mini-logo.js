import {
	LitElement,
	html,
	css
} from 'lit';



export class ComDappMiniLogo extends LitElement {
	static get properties() {
		return {
			size: {
				type: String
			},
			url: {
				type: String
			},
			showpng: {
				type: Boolean
			},
		};
	}

	constructor() {
		super();
		this.size = '18px';
		this.url = '';
		this.showpng = false;
	}
	

	static get styles() {
		return css`
		:host {
			display: block;
		}
		
		.com-dapp-mini-logo{
			position: relative;
			user-select: none;
			border-radius: 32%;
			overflow: hidden;
			background-color: var(--stxui-route-mini-logo-border-bg, #e6e6e6);
			
			
			box-shadow: 0 0 0 2px var(--stxui-route-mini-logo-border, #dcdcdc);
		}
		
		.dapp-logo-png{
			user-select: none;
			position: relative;
			z-index: 2;
			border-radius: 32%;
		}
		.hidden-opacity { opacity: 0; }
		
		.bg-logo{
			position: absolute;
			top: 0px;
			left: 0px;
			right: 0px;
			bottom: 0px;
			border-radius: 32%;
			z-index: 1;
		}
    `;
	}

	render() {
		return html`
		<div class="com-dapp-mini-logo" style="width: ${this.size};height: ${this.size};max-width: ${this.size};max-height: ${this.size};min-width: ${this.size};">
			
			<div class="bg-logo" style="background-image:url('${this.url}');background-size:cover;background-position:center;"></div>
			
			<img 
				loading="lazy"
				draggable="false"
				class="dapp-logo-png ${this.showpng===true?'':'hidden-opacity'}" 
				width="${this.size}" 
				height="${this.size}" 
				style="max-width: ${this.size};max-height: ${this.size};" 
				src="${this.url}" 
				@load="${this._onload}" 
				@error="${this._onerror}"
			>
			
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
	    if (currentUrl.searchParams.has('t')) {
			console.log(`dappLogo: GET ${this.url} 404 (Not Found)`);
	        return;
	    }
	    setTimeout(() => {
	        currentUrl.searchParams.set('t', 'retry');
	        img.src = currentUrl.toString();
	    }, this.getRandomInt(100, 1000));
	}
	getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
}



if (!customElements.get('com-dapp-mini-logo')) {
	customElements.define('com-dapp-mini-logo', ComDappMiniLogo);
}

