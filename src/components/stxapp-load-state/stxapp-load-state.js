import {
	LitElement,
	html,
	css
} from 'lit';


import { sdkStore } from '../../data/store/store.js';
import { StoreMixin } from '../../data/store/state-mixin.js';
import '../stxapp-button/stxapp-button.js';


export class StxAppLoadState extends StoreMixin(LitElement) {
	static properties = {
		state: {
			type: String
		},
	};
	constructor() {
		super();
		this.state = 'empty';
	}


	static styles = css`
    :host {
		display: block;
    }
	.font-family{
		user-select: none;
		font-family: var(--stxui-font-family);
	}
    .dapp-load-state{
    	position: relative;
    	height: 26px;
    	display: flex;
    	justify-content: center;
    	align-items: center;
    }
	.nolog-text{
		font-size: 14px;
		color: var(--stxui-dark-theme-subcolor, #999);
		white-space: nowrap;
	}
	
	
	@keyframes rotateAnimation {
		from {
			transform: rotate(0deg);
		}
	
		to {
			transform: rotate(360deg);
		}
	}
	.com-load {
		border-radius: 6px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		column-gap: 6px;
	}
	.rotating-element-load {
		animation: rotateAnimation 1s linear infinite;
		animation: rotateAnimation 0.6s ease-out infinite;
	}
	.com-load-text-ll{
		line-height: 28px;
		font-size: 14px;
		color: var(--stxui-dark-theme-subcolor, #999);
	}
	
	
	
	.com-error {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: 6px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		column-gap: 6px;
	}
	.com-load-text-ll22 {
		line-height: 28px;
		font-size: 14px;
		color: #e61a00;
	}

	
  `;	
	

	render() {
		const $t = sdkStore.$t;
		return html`
		<div class="dapp-load-state">
			
			
			${this.state==='empty'? html`
					<span class="nolog-text font-family">╮(︶︿︶)╭ ${$t['no-data-found']} ～</span>
				`: ``
			}
			
			${this.state==='load'? html`
					<div class="com-load">
						<div class="rotating-element-load" style="width: 20px;height: 20px;">
							<svg t="1753206849625" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
								p-id="10549" width="20" height="20">
								<path
									d="M753.365333 270.634667a46.08 46.08 0 0 1-61.226666 3.498666 220.970667 220.970667 0 0 0-14.293334-10.581333 298.752 298.752 0 0 0-441.770666 362.666667 298.666667 298.666667 0 0 0 571.904-74.282667A45.696 45.696 0 0 1 853.333333 512h3.328a37.333333 37.333333 0 0 1 37.12 41.301333 384 384 0 1 1-151.936-348.970666c2.56 1.92 5.418667 4.181333 8.618667 6.826666a40.192 40.192 0 0 1 2.901333 59.477334z"
									fill="var(--stxui-dark-theme-subcolor, #999)" p-id="10550"></path>
							</svg>
						</div>
						<span class="com-load-text-ll font-family">${$t['loading']}...</span>
					</div>
				`: ``
			}
			
			
			${this.state==='success'? html`
					<span class="nolog-text font-family">${$t['no-more-data-available']} ～</span>
				`: ``
			}
			
			
			${this.state==='error'? html`
					<div class="com-error">
					
						<div style="width:20px;height:20px;">
							<svg t="1753209663482" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="33954" width="20" height="20"><path d="M510 961a448.47 448.47 0 1 1 316.78-131.22A446.69 446.69 0 0 1 510 961z m0-836a388 388 0 1 0 274.36 662.36A388 388 0 0 0 510 125z" fill="#d81e06" p-id="33955"></path><path d="M370.7 682.3a30 30 0 0 1-21.21-51.21l278.6-278.6a30 30 0 0 1 42.42 42.42l-278.6 278.6a29.88 29.88 0 0 1-21.21 8.79z" fill="#d81e06" p-id="33956"></path><path d="M649.3 682.3a29.88 29.88 0 0 1-21.21-8.79l-278.6-278.6a30 30 0 0 1 42.42-42.42l278.6 278.6a30 30 0 0 1-21.21 51.21z" fill="#d81e06" p-id="33957"></path></svg>
						</div>
					
						<span class="com-load-text-ll22 font-family">${$t['loading-failed']}</span>
					
						<div style="height: 24px;max-height: 24px;">
							<stxapp-button @_click="${this._onRetry}" class="font-family" 
							size="mini" type="warn">${$t['retry']}</stxapp-button>
						</div>
					
					</div>
				`: ``
			}
			
			
			
			${this.state==='tap'? html`
					<div class="com-error">
						<span class="com-load-text-ll font-family">${$t['click-load-more']}</span>
						<div style="height: 24px;max-height: 24px;">
							<stxapp-button @_click="${this._onLoad}" 
							size="mini" plain="true" type="default">${$t['click-load']}</stxapp-button>
						</div>
					</div>
				`: ``
			}
			
			
			
			${this.state===''? html`
					<span class="nolog-text font-family">${$t['load-more']}</span>
				`: ``
			}
			
			
		</div>
    `;
	}
	
	_onLoad() {
		//console.log('load');
		this.dispatchEvent(new CustomEvent('load'));
	}
	
	_onRetry(e) {
		//console.log('retry');
		this.dispatchEvent(new CustomEvent('retry'));
	}
	
}

if (!customElements.get('stxapp-load-state')) {
	customElements.define('stxapp-load-state', StxAppLoadState);
}
