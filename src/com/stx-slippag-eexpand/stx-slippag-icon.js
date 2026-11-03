import {
	LitElement,
	html,
	css
} from 'lit';

import '../stx-slippag-set/stx-slippag-set.js';

export class StxSlippagIcon extends LitElement {
	static get properties() {
		return {
			openSetSlippag: {
				type: Boolean
			},
			slippagObj: {
				type: Object
			},
		};
	}
	
	constructor() {
		super();
		this.openSetSlippag = false;
		this.slippagObj = {};
	}
	
	
	static styles = css`
		:host {
			display: block;
		}
		.stx-slippag-icon{
			background-color: var(--stxui-slippag-icon-background-color, #fbfbfb);
			padding: 0px 12px;
			padding-left: 10px;
			border-radius: 100px;
			height: 28px;
			border: 1px solid var(--stxui-slippag-icon-border-color, #eee);
			display: flex;flex-direction: row;align-items: center;justify-content: space-between;
			transition: 
				border 0.2s ease-in-out,
				box-shadow 0.2s ease-in-out;
			cursor: pointer;
			display: flex;flex-direction: row;align-items: center;column-gap:2px;
		}
		.stx-slippag-icon:hover {
			border: 1px solid var(--stxui-theme-focus-color, #02b6a680);
			box-shadow: 0 0 0 2px var(--stxui-theme-focus-color, #02b6a680);
		}
		.slippagselected{
			border: 1px solid var(--stxui-theme-focus-color, #02b6a680);
			box-shadow: 0 0 0 2px var(--stxui-theme-focus-color, #02b6a680);
		}
		
		.slippagetolerance-text{
			font-size: 13px;
			user-select: none;
			font-family: var(--stxui-font-family);
			color: var(--stx-input-placeholder-color, #999); 
		}
		.theme-color{
			color: var(--stxui-theme-font-color, #111);
		}
		
		
  `;

	render() {
		
		let valueSlippag = '--';
		try {
			valueSlippag = this.slippagObj&&this.slippagObj?.value?this.slippagObj?.value+'%':'--';
		} catch (err) {}
		let valueStyle = '';
		try {
			if(this.slippagObj&&this.slippagObj?.value){
				if(this.slippagObj?.value<0.1){
					valueStyle = 'color:#ff6363;';
				}else if(this.slippagObj?.value>1){
					valueStyle = 'color:#fd8e00;';
				}
			}
		} catch (e) {}
		
		
		/* <!--<span class="slippagetolerance-text theme-color" style="color:#999;"
		>Slippag</span>
		
		
		<svg style="transform:scale(0.98);transform-origin: center center;" t="1772429747274" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3477" width="16" height="16"><path d="M896 896H128v-85.333333h768v85.333333zM294.272 271.488a38.442667 38.442667 0 0 1 54.357333 0L499.498667 422.4l-54.314667 54.314667-85.333333-85.248V763.733333h-76.8V391.424l-85.248 85.248-54.357334-54.314667 150.826667-150.869333z m446.634667 361.088l85.248-85.248 54.357333 54.357333-150.826667 150.826667a38.442667 38.442667 0 0 1-54.357333 0l-150.869333-150.826667 54.314666-54.357333 85.333334 85.248V260.266667h76.8v372.309333zM896 213.333333H128V128h768v85.333333z" p-id="3478" 
		fill="#999999"></path></svg>
		--> */
		
		return html`
		
			<stx-slippag-set
				.open="${this.openSetSlippag}"
				styles="right: 0;top: 34px;transform-origin: center top;"
				refid="set-swap-slippag"
				tipsposition="bottom"
				@change="${this._changeSlippag}"
				@close="${()=>{this.openSetSlippag = false;}}"
			></stx-slippag-set>
		
		
		
		
			<div @click="${this._onOpenSetSlippag}" class="stx-slippag-icon ${this.openSetSlippag?'slippagselected':''}">
				
				
				<svg style="transform:scaleX(0.9);transform-origin: right center;" t="1772438756024" class="icon" viewBox="0 0 1229 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4486" width="18" height="18"><path d="M651.73522953 660.44308571a42.1488078 42.1488078 0 0 1 58.33394988-1.18016647l1.26446403 1.18016647L892.23632464 841.43006529l180.90268123-180.90268203a42.1488078 42.1488078 0 0 1 58.33394988-1.26446402l1.34876157 1.26446402a42.1488078 42.1488078 0 0 1 1.18016647 58.24965234l-1.18016647 1.34876157-210.74403653 210.74403735a42.1488078 42.1488078 0 0 1-58.3339499 1.18016648l-1.26446401-1.26446402-210.74403735-210.74403736a42.1488078 42.1488078 0 0 1 0-59.59841391z" fill="#999999" p-id="4487"></path><path d="M892.23632464 353.09398275a42.1488078 42.1488078 0 0 1 42.14880781 40.54715277V901.02847837a42.1488078 42.1488078 0 0 1-84.29761478 1.5173575V395.24278972A42.1488078 42.1488078 0 0 1 892.23632464 353.09398275zM555.04586554 437.39159752a42.1488078 42.1488078 0 0 1 1.60165503 84.29761478H175.70659946a42.1488078 42.1488078 0 0 1-1.51735748-84.29761478H555.04586554z m337.1904591-337.19045911a42.1488078 42.1488078 0 0 1 1.60165503 84.29761479H175.70659946a42.1488078 42.1488078 0 0 1-1.51735748-84.29761478H892.23632464zM470.74825077 774.58205662a42.1488078 42.1488078 0 0 1 1.68595257 84.29761479H175.70659946a42.1488078 42.1488078 0 0 1-1.51735748-84.29761479H470.74825077z" 
				fill="#999999" p-id="4488"></path></svg>
				
				<span class="slippagetolerance-text theme-color" style="font-size: 14px;${valueStyle}"
				>${valueSlippag}</span>
			</div>
		`;
	}
	
	_changeSlippag(e){
		//console.log('changeSlippag:', e.detail);
		this.slippagObj = e.detail;
		this.dispatchEvent(new CustomEvent('change-slippag', {
		    detail: {value: this.slippagObj.value},
		    bubbles: false,
		    composed: false
		}));
	}
	_onOpenSetSlippag(){
		this.openSetSlippag = true;
	}
	
	
}
if (!customElements.get('stx-slippag-icon')) {
	customElements.define('stx-slippag-icon', StxSlippagIcon);
}
