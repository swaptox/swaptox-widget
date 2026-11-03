import {
	LitElement,
	html,
	css
} from 'lit';

import { sdkStore } from '../../data/store/store.js';
import { StoreMixin } from '../../data/store/state-mixin.js';


export class SwaptoxThemeChoose extends StoreMixin(LitElement) {

	static get styles() {
		return css`
			:host {
				display: block;
			}
			.swaptox-theme-choose{
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				border-radius: 12px;
				border: 1px solid var(--stxui-swaptox-chain-select-border, #eee);
				cursor: pointer;
				background-color: var(--stxui-swaptox-chain-select-background, #fff);
				height: 34px;
				width: 34px;
				min-width: 34px;
				transition:
					border 0.2s ease-in-out,
					opacity 0.2s ease-in-out,
					box-shadow 0.2s ease-in-out;
				-webkit-tap-highlight-color: transparent;
			}
			
			.swaptox-theme-choose:active {
				opacity: 0.8;
				background-color: var(--stxui-theme-content-background-color, #fbfbfb);
			}
			.swaptox-theme-choose:hover {
				border: 1px solid var(--stxui-theme-focus-color, #02b6a680);
				background-color: var(--stxui-theme-content-background-color, #fbfbfb);
				box-shadow: 0 0 0 2px var(--stx-primary-light, var(--stxui-theme-focus-color, #02b6a680));
			}
		`;
	}
	
	

	render() {
		const currentTheme = sdkStore.theme;
		return html`
			<div @click=${this._selectedtHeme} class="swaptox-theme-choose">
				
				${currentTheme==='dark'?html`
					<svg t="1793258791941" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20022" width="20" height="20"><path d="M526.677333 938.666667c-121.770667 0-225.706667-43.093333-311.978666-129.450667C128.426667 722.944 85.333333 618.922667 85.333333 497.066667c0-87.552 24.746667-168.704 74.154667-243.626667a446.72 446.72 0 0 1 194.048-165.632c5.12-3.84 10.24-3.157333 15.189333 1.877333 6.314667 3.84 8.277333 9.386667 5.717334 17.066667a376.32 376.32 0 0 0-30.378667 146.688c0 112.981333 40.277333 209.664 120.832 290.304 80.554667 80.554667 177.237333 120.832 290.133333 120.832 62.122667 0 116.053333-9.386667 161.706667-28.501333 5.12-3.925333 10.069333-3.242667 15.104 1.792 6.314667 3.84 8.277333 9.472 5.717333 17.152a432.64 432.64 0 0 1-160.768 206.506666 428.8 428.8 0 0 1-250.026666 77.141334z" p-id="20023" fill="#999"></path></svg>
				`:html`
					<svg t="1793258570984" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11584" width="22" height="22"><path d="M512.64 526.421333m-211.712 0a211.712 211.712 0 1 0 423.424 0 211.712 211.712 0 1 0-423.424 0Z" fill="#5B6274" opacity=".3" p-id="11585"></path><path d="M502.4 77.354667a32 32 0 0 1 32 32v128a32 32 0 0 1-64 0v-128a32 32 0 0 1 32-32zM502.4 760.064a32 32 0 0 1 32 32v128a32 32 0 0 1-64 0v-128a32 32 0 0 1 32-32zM205.952 207.488a32 32 0 0 1 45.226667 0l91.306666 91.306667a32 32 0 0 1-45.226666 45.226666l-91.306667-91.306666a32 32 0 0 1 0-45.226667zM695.04 696.661333a32 32 0 0 1 45.226667 0l91.306666 91.306667a32 32 0 1 1-45.226666 45.226667l-91.306667-91.306667a32 32 0 0 1 0-45.226667zM824.874667 200.917333c12.757333 12.202667 13.226667 32.469333 0.981333 45.226667l-89.301333 93.226667a32 32 0 0 1-46.208-44.288l89.258666-93.184a32 32 0 0 1 45.226667-0.981334zM346.368 700.416c12.757333 12.202667 13.226667 32.469333 0.981333 45.226667l-89.301333 93.226666a32 32 0 0 1-46.208-44.288l89.258667-93.184a32 32 0 0 1 45.226666-0.981333zM961.066667 519.424a32 32 0 0 1-31.914667 32.085333l-129.109333 0.256a32 32 0 1 1-0.128-64l129.066666-0.298666a32 32 0 0 1 32.085334 31.957333zM269.482667 520.96a32 32 0 0 1-31.914667 32.042667l-129.109333 0.298666a32 32 0 0 1-0.128-64l129.066666-0.298666a32 32 0 0 1 32.085334 31.914666z" fill="#5B6274" p-id="11586"></path></svg>
				`}
				
				
			</div>
		`;
	}
	
	_selectedtHeme(){
		const theme = sdkStore.theme==='dark'?'light':'dark';
		this.dispatchEvent(
			new CustomEvent('choose-theme', {
				detail: theme,
				bubbles: false,
				composed: false
			})
		);
		window?.$swaptoxWidget?.setTheme(theme);
		window?.$swaptoxConnect?.setTheme(theme);
	}

}
if (!customElements.get('swaptox-theme-choose')) {
	customElements.define('swaptox-theme-choose', SwaptoxThemeChoose);
}