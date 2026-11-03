
import { LitElement, html, css } from 'lit';


export class StxcomIconSmallLoad extends LitElement {
	static properties = {
		state: {
			type: String
		},
	};
	constructor() {
		super();
		this.state = '';//load error success
	}


	static styles = css`
		:host {
			display: block;
		}
		.icon-small-load {
			position: relative;
			width: 16px;
			height: 16px;
			min-width: 16px;
			min-height: 16px;
			max-width: 16px;
			max-height: 16px;
			border-radius: 100px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.small-load-success-ok{
			width: 16px;
			height: 16px;
			border-radius: 100px;
			background-color: #02b6a6;
			display: flex;align-items: center;justify-content: center;
		}
		.small-load-error{
			width: 16px;
			height: 16px;
			border-radius: 100px;
			background-color: #e64340;
			display: flex;align-items: center;justify-content: center;
		}
		
		.small-load-hidden_div {
			opacity: 0;
			width: 0px;
			height: 0px;
			max-width: 0px;
			max-height: 0px;
			min-width: 0px;
			min-height: 0px;
			overflow: hidden;
		}
	`;

	render() {
		return html`
			<div class="icon-small-load">
				
				<div class="${this.state==='load'?'icon-small-load':'small-load-hidden_div'}">
					<svg viewBox="0 0 100 100" enable-background="new 0 0 100 100">
						<circle fill="none" stroke="var(--stxui-small-load-yuan-bg)" stroke-width="8.7" cx="50" cy="50"
							r="45.5" stroke-linecap="round" class="circle"></circle>
						<path fill="#02b6a6" d="M31.6,3.5C5.9,13.6-6.6,42.7,3.5,68.4c10.1,25.7,39.2,38.3,64.9,28.1l-3.1-7.9c-21.3,8.4-45.4-2-53.8-23.3
																	  c-8.4-21.3,2-45.4,23.3-53.8L31.6,3.5z">
							<animateTransform attributeName="transform" attributeType="XML" type="rotate"
								dur="1s" from="0 50 50" to="360 50 50" repeatCount="indefinite"></animateTransform>
						</path>
					</svg>
				</div>
				
				<div class="${this.state==='success'?'small-load-success-ok':'small-load-hidden_div'}">
					<svg t="1753396458498" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2549" width="14" height="14"><path d="M469.333333 640l0.384 0.384L469.333333 640z m-106.282666 0l-0.384 0.384 0.384-0.384z m48.512 106.666667a87.466667 87.466667 0 0 1-61.653334-24.874667l-179.52-173.632a67.797333 67.797333 0 0 1 0-98.24c28.032-27.157333 73.493333-27.157333 101.589334 0l139.584 134.997333 319.168-308.544c28.032-27.157333 73.493333-27.157333 101.589333 0a67.925333 67.925333 0 0 1 0 98.24L472.981333 722.069333A87.530667 87.530667 0 0 1 411.562667 746.666667z" fill="#ffffff" p-id="2550"></path></svg>
				</div>
				
				
				<div class="${this.state==='error'?'small-load-error':'small-load-hidden_div'}">
					<svg t="1791741546759" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="28399" width="8" height="8"><path d="M648.564483 510.804239L995.911365 163.457357A95.775795 95.775795 0 0 0 860.548242 28.094233L513.201359 375.441116 165.854477 28.094233A95.775795 95.775795 0 0 0 30.491353 163.457357L377.838236 510.804239 30.491353 858.151122a95.775795 95.775795 0 1 0 135.363124 135.363123L513.201359 646.167363l347.346883 347.346882a95.775795 95.775795 0 0 0 135.363123-135.363123z" fill="#ffffff" p-id="28400"></path></svg>
				</div>
				
			
			</div>
		`;
	}
	
}

if (!customElements.get('stxcom-icon-small-load')) {
	customElements.define('stxcom-icon-small-load', StxcomIconSmallLoad);
}