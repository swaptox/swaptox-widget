import {
	LitElement,
	html,
	css
} from 'lit';

import { sdkStore } from '../data/store/store.js';
import { StoreMixin } from '../data/store/state-mixin.js';

import { donutPieRingRotate } from './flickr-ball-circle-round.js';

export class comIconHistory extends StoreMixin(LitElement) {
	static properties = {
		/* loading: {
			type: String,
		}, */
	};

	constructor() {
		super();
		//this.loading = true;
	}

	static get styles() {
		return css`
		:host {
			display: block;
			width: 32px;
			height: 32px;
			overflow: hidden;
			border-radius:8px;
		}
		
		
		.com-icon-tap{
			position: relative;
			width: 30px;
			height: 30px;
			overflow: hidden;
			border-radius:8px;
			transition: all 0.3s;
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;
		}
		.com-icon-tap:hover {
		    background-color: var(--stxui-icon-history-color-bg, rgba(108, 134, 173, 0.15));
		}
		.arrow-svg-icon {
			fill: var(--stxui-icon-arrow-loading-false-color, #bac7da);/*--stxui-icon-history-color*/
		}
		
		.com-icon-tap:hover > .arrow-svg-icon {
		    fill: var(--stxui-theme-icon-color, #00a99a);
		}
		
		
		.icon-small-loads1 {
			position: absolute;z-index: 1;top: 0px;right: 0px;
			width: 30px;
			height: 30px;
			min-width: 30px;
			min-height: 30px;
			max-width: 30px;
			max-height: 30px;
			border-radius: 100px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
    `;
	}

	render() {
		
		let isLoading = false;
		const swapHashObj = sdkStore.swapHash?.[sdkStore.chain];
		if(swapHashObj){
			for (let key in swapHashObj) {
				if(swapHashObj[key]==='pending'){
					isLoading = true;
					break;
				}
			}
		}
		
		
		return html`
		<div class="com-icon-tap" @click="${this._tapIcon}">
			
			
			${isLoading?html`
				<svg class="arrow-svg-icon" t="1770527188597" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
					p-id="4110" width="21" height="21">
					<path
						d="M720.55146667 464.1088h-407.88266667c-23.712-0.69333333-42.37866667-20.48-41.68533333-44.192 0.66133333-22.74133333 18.944-41.024 41.68533333-41.68533333h407.88266667c23.712 0.69333333 42.37866667 20.48 41.68533333 44.192-0.66133333 22.74133333-18.944 41.024-41.68533333 41.68533333zM720.55146667 645.44213333h-407.88266667c-23.712-0.69333333-42.37866667-20.48-41.68533333-44.192 0.66133333-22.74133333 18.944-41.024 41.68533333-41.68533333h407.88266667c23.712 0.69333333 42.37866667 20.48 41.68533333 44.192-0.66133333 22.74133333-18.944 41.024-41.68533333 41.68533333z"
						p-id="4113" data-spm-anchor-id="a313x.manage_type_myprojects.0.i0.266c3a81cXBaFg"
						class=""></path>
				</svg>
			`:html`
				<svg class="arrow-svg-icon" t="1770527188597" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
					p-id="4110" width="21" height="21">
					<path
							d="M508.256 990.44266667c-263.392 0-477.696-214.304-477.696-477.696S244.864 35.04 508.256 35.04 985.96266667 249.35466667 985.96266667 512.74666667 771.648 990.44266667 508.256 990.44266667z m0-845.16266667C305.65333333 145.28 140.8 310.144 140.8 512.74666667s164.85333333 367.46666667 367.46666667 367.46666666S875.73333333 715.36 875.73333333 512.74666667 710.85866667 145.28 508.256 145.28z"
							p-id="4112" data-spm-anchor-id="a313x.manage_type_myprojects.0.i4.266c3a81cXBaFg"
							class="selected"></path>
					<path
						d="M720.55146667 464.1088h-407.88266667c-23.712-0.69333333-42.37866667-20.48-41.68533333-44.192 0.66133333-22.74133333 18.944-41.024 41.68533333-41.68533333h407.88266667c23.712 0.69333333 42.37866667 20.48 41.68533333 44.192-0.66133333 22.74133333-18.944 41.024-41.68533333 41.68533333zM720.55146667 645.44213333h-407.88266667c-23.712-0.69333333-42.37866667-20.48-41.68533333-44.192 0.66133333-22.74133333 18.944-41.024 41.68533333-41.68533333h407.88266667c23.712 0.69333333 42.37866667 20.48 41.68533333 44.192-0.66133333 22.74133333-18.944 41.024-41.68533333 41.68533333z"
						p-id="4113" data-spm-anchor-id="a313x.manage_type_myprojects.0.i0.266c3a81cXBaFg"
						class=""></path>
				</svg>
			`}
			
			
			
			${isLoading?html`
				<div class="icon-small-loads1">
					${donutPieRingRotate()}
				</div>
			`:null}
			
		</div>
    `;
	}
	
	_tapIcon() {
		this.dispatchEvent(new CustomEvent('change'));
	}
	
}
if (!customElements.get('com-icon-history')) {
	customElements.define('com-icon-history', comIconHistory);
}
