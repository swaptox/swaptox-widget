



import { LitElement, html, css } from 'lit';
import { $app } from '../../../js_sdk/index.js';




export class StxuiRecipientCacheList extends LitElement {
	static properties = {
		account: {
			type: String
		},
		recipients: {
			type: Array
		},
	};
	constructor() {
		super();
		this.cacheKey = 'recipient-cache-list';
		this.account = '';
		const arr = $app.getStorageSync(this.cacheKey);
		this.recipients = Array.isArray(arr)?arr:[];
		this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
	}


	static styles = css`
		:host {
			display: block;
		}
		.cache-list-display-flex{
			display: flex;
			flex-direction: row;
			align-items: center;
		}
		.font-family{
			user-select: none;
			font-family: var(--stxui-font-family);
		}
		.addr-csss{
			color: var(--stxui-theme-font-color);
			font-size: 14px;
			line-height: 24px;
			min-height: 24px;
			height: 24px;
		}
		
		.text-aacc-ellipsis{
			overflow: hidden;
			text-overflow: ellipsis !important;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1 !important;
			word-break:break-all;
		}
		.tag-body-my-in{
			cursor: pointer;
			border-bottom: 1px dotted #6a6a6a;
		}
		.tag-body-my-in:hover{
			opacity: 0.8;
			background-color: var(--stxui-recipient-cache-list-delete-bg);
		}
		
		.shanchu-anniao{
			width: 30px;
			min-width: 30px;
			height: 30px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.shanchu-bodys{
			position: relative;
			width: 25px;
			min-width: 25px;
			height: 25px;
			border-radius: 8px;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: var(--stxui-recipient-cache-list-delete-bg);
			fill: #999;
		}
		.shanchu-bodys:hover{
			fill: var(--stxui-recipient-cache-list-delete-text-hover, #111);
		}
		.on-click-cssss1{
			position: absolute;
			top: 0px;
			left: 0px;
			right: 0px;
			bottom: 0px;
			z-index: 1;
			border-radius: 8px;
		}
		.is-touch-shouji{
			top: -6px;
			left: -6px;
			right: -6px;
			bottom: -6px;
		}
	`;
	
	
	render() {
		return html`
		
		
			<div class="cache-list-display-flex" style="padding-top:10px;column-gap:2px;">
				<div @click=${()=>{this._click(this.account)}} class="tag-body-my-in cache-list-display-flex" style="column-gap:2px;">
					<svg t="1791667612458" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2759" width="15" height="15"><path d="M725.333333 64a170.666667 170.666667 0 0 1 170.666667 170.666667v554.666666a170.666667 170.666667 0 0 1-170.666667 170.666667H277.333333a170.666667 170.666667 0 0 1-170.666666-170.666667V234.666667a170.666667 170.666667 0 0 1 170.666666-170.666667h448z m0 74.666667H277.333333a96 96 0 0 0-95.893333 91.477333L181.333333 234.666667v554.666666a96 96 0 0 0 91.477334 95.893334L277.333333 885.333333h448a96 96 0 0 0 95.893334-91.477333L821.333333 789.333333V234.666667a96 96 0 0 0-91.477333-95.893334L725.333333 138.666667z" fill="#999999" p-id="2760"></path><path d="M896 384v256H682.666667a128 128 0 1 1 0-256h213.333333z m-74.666667 181.333333v-106.666666H682.666667a53.333333 53.333333 0 0 0-53.226667 49.834666L629.333333 512a53.333333 53.333333 0 0 0 49.834667 53.226667L682.666667 565.333333h138.666666z" fill="var(--stxui-theme-font-color)" p-id="2761"></path></svg>
					<div class="cache-list-display-flex" style="flex: 1;">
						<span class="text-aacc-ellipsis font-family addr-csss">${this.account.slice(0, -4)}</span>
						<span class="font-family addr-csss">${this.account.slice(-4)}</span>
					</div>
				</div>
				<div class="shanchu-anniao"></div>
			</div>
		
		
			${this.recipients.map(addr => html`
				<div class="cache-list-display-flex" style="padding-top:10px;column-gap:2px;">
					<div @click=${()=>{this._click(addr)}} class="tag-body-my-in cache-list-display-flex" style="column-gap:2px;">
						${this.account&&addr.toLowerCase()===this.account.toLowerCase()?html`
							<svg t="1791667612458" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2759" width="15" height="15"><path d="M725.333333 64a170.666667 170.666667 0 0 1 170.666667 170.666667v554.666666a170.666667 170.666667 0 0 1-170.666667 170.666667H277.333333a170.666667 170.666667 0 0 1-170.666666-170.666667V234.666667a170.666667 170.666667 0 0 1 170.666666-170.666667h448z m0 74.666667H277.333333a96 96 0 0 0-95.893333 91.477333L181.333333 234.666667v554.666666a96 96 0 0 0 91.477334 95.893334L277.333333 885.333333h448a96 96 0 0 0 95.893334-91.477333L821.333333 789.333333V234.666667a96 96 0 0 0-91.477333-95.893334L725.333333 138.666667z" fill="#999999" p-id="2760"></path><path d="M896 384v256H682.666667a128 128 0 1 1 0-256h213.333333z m-74.666667 181.333333v-106.666666H682.666667a53.333333 53.333333 0 0 0-53.226667 49.834666L629.333333 512a53.333333 53.333333 0 0 0 49.834667 53.226667L682.666667 565.333333h138.666666z" fill="var(--stxui-theme-font-color)" p-id="2761"></path></svg>
						`:html`
							<svg t="1791667563496" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2372" width="15" height="15"><path d="M830.762667 896.533333a37.333333 37.333333 0 0 1 3.050666 74.56l-3.050666 0.106667H201.258667a37.333333 37.333333 0 0 1-3.050667-74.538667l3.050667-0.128h629.504zM610.176 114.112L199.765333 524.522667a88.533333 88.533333 0 0 0-24.213333 45.226666l-35.946667 179.733334a71.466667 71.466667 0 0 0 84.096 84.096l179.733334-35.946667a88.533333 88.533333 0 0 0 45.226666-24.213333L859.093333 363.008a88.533333 88.533333 0 0 0 0-125.205333L735.36 114.133333a88.533333 88.533333 0 0 0-125.205333 0zM252.586667 577.322667L662.976 166.912a13.866667 13.866667 0 0 1 19.626667 0l123.690666 123.690667a13.866667 13.866667 0 0 1 0 19.626666L395.882667 720.597333l-1.557334 1.344a13.866667 13.866667 0 0 1-5.546666 2.453334l-175.018667 35.008 35.008-175.018667a13.866667 13.866667 0 0 1 3.797333-7.082667z" fill="#ff9c08" p-id="2373"></path></svg>
						`}
						<div class="cache-list-display-flex" style="flex: 1;">
							<span class="text-aacc-ellipsis font-family addr-csss">${addr.slice(0, -4)}</span>
							<span class="font-family addr-csss">${addr.slice(-4)}</span>
						</div>
					</div>
					<div class="shanchu-anniao">
						<div class="shanchu-bodys">
							<svg t="1791672797956" class="icon" viewBox="0 0 1035 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15202" width="12" height="12"><path d="M868.248009 806.105382c17.398599 17.398599 17.398599 45.612844 0 63.011443-8.699299 8.699299-20.105295 13.054519-31.500152 13.054519s-22.800853-4.355219-31.500152-13.054519L517.491363 581.360484 229.735022 869.116825c-8.699299 8.699299-20.105295 13.054519-31.500153 13.054519s-22.800853-4.355219-31.500152-13.054519c-17.398599-17.398599-17.398599-45.612844 0-63.011443l287.745203-287.756341-287.756342-287.756342c-17.398599-17.398599-17.398599-45.612844 0-63.011443s45.612844-17.398599 63.011444 0l287.756341 287.756341 287.745203-287.745203c17.398599-17.398599 45.612844-17.398599 63.011443 0s17.398599 45.612844 0 63.011444L580.491668 518.360179l287.756341 287.756342z" p-id="15203" fill="inherit"></path></svg>
							
							<div @click=${()=>{this._onDelete(addr)}}
							class="on-click-cssss1 ${this.isTouchDevice?'is-touch-shouji':''}"></div>
						
						</div>
					</div>
				</div>
			`)}
		`;
	}
	
	_click(addr) {
		this.dispatchEvent(new CustomEvent('select-recipient', {
			detail: { value: addr },
			bubbles: true,
			composed: true
		}));
	}
	_onDelete(addr) {
		const lists = [];
		for(let i = 0; i < this.recipients.length; i++){
			if(this.recipients[i].toLowerCase()===addr.toLowerCase()){
				continue;
			}
			lists.push(this.recipients[i]);
		}
		$app.setStorageSync(this.cacheKey, lists);
		this.recipients = [...lists];
	}
	
	addCache(addr) {
		if(this.account.toLowerCase()===addr.toLowerCase()){
			return;
		}
		const lists = [];
		for(let i = 0; i < this.recipients.length; i++){
			if(this.recipients[i].toLowerCase()===addr.toLowerCase()){
				continue;
			}
			lists.push(this.recipients[i]);
		}
		lists.unshift(addr);
		$app.setStorageSync(this.cacheKey, lists.slice(0, 4));
	}
	
	
}

if (!customElements.get('stxui-recipient-cache-list')) {
	customElements.define('stxui-recipient-cache-list', StxuiRecipientCacheList);
}
