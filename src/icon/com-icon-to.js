import {
	LitElement,
	html,
	css
} from 'lit';



export class comIconTo extends LitElement {
	static get properties() {
		return {
			size: {
				type: String
			},
			direction: {
				type: String
			},
			fill: {
				type: String
			},
			disabled: {
				type: Boolean
			},
		};
	}

	constructor() {
		super();
		this.size = '14px';
		this.direction = 'right';
		this.fill = 'var(--stxui-theme-font-subcolor, #999)';
		this.disabled = false;
	}

	static get styles() {
		return css`
		:host {
			display: block;
		}
		.icon-right{}
		.icon-left{
			transform:rotate(180deg);
		}
		.icon-top{
			transform:rotate(-90deg);
		}
		.icon-bottom{
			transform:rotate(90deg);
		}
    `;
	}

	render() {
		return html`
		<div class="icon-${this.direction}">
			<svg t="1770334855074" class="icon" style="${this.disabled?'opacity: 0.5;':'opacity: 1;'}" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="61320" width="${this.size}" height="${this.size}"><path d="M286.53070205 1011.2c-12.96947242 0-26.936598-4.98825893-36.91311487-14.96477678-20.9506869-20.9506869-20.9506869-53.87319503 0-74.82388192l409.03722209-409.0372221-409.0372221-409.0372221c-20.9506869-20.9506869-20.9506869-53.87319503 1e-8-74.82388192 20.9506869-20.9506869 53.87319503-20.9506869 74.82388192 0l445.95033697 445.95033697c20.9506869 20.9506869 20.9506869 53.87319503 0 74.8238829L323.44381693 996.23522323c-9.97651785 9.97651785-23.94364245 14.96477678-36.91311488 14.96477677z" 
			fill="${this.fill}" p-id="61321"></path></svg>
		</div>
    `;
	}



}
if (!customElements.get('com-icon-to')) {
	customElements.define('com-icon-to', comIconTo);
}
