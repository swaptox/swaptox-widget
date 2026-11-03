import {
	LitElement,
	html,
	css
} from 'lit';

export class ComSlippagTips extends LitElement {
    static get properties() {
        return {
			tipstype: { type: String },
			mintips: { type: String },
			maxtips: { type: String },
        };
    }

    constructor() {
        super();
        this.tipstype = '';
		this.mintips = '';
		this.maxtips = '';
    }
	
	static styles = css`
		:host {
			display: block;
		}
		.com-slippag-tips{
			background: #ffebce;
			border-radius: 12px;
			padding: 6px 10px;
			padding-top: 4px;
			box-shadow: 0 0 0 1px #ffdeb3;
		}
		.tips-error{
			background: #fff2f2d1;
			box-shadow: 0 0 0 1px #ffcfcf;
		}
		
		.tips-value{
			font-size: 12px;
			color: var(--dapp-card-theme-font-subcolor, #555);
			user-select: none;
			font-family: var(--stxui-font-family);
			white-space: wrap;
			line-height: 16px;
		}
	`;
	
	render() {
		let tipsText = this.maxtips;
		let tipsCss = '';
		let fill = '#fd8e00';
		if(this.tipstype==='error'){
			tipsText = this.mintips;
			tipsCss = 'tips-error';
			fill = '#ff6363';
		}
		
		
		/* <!--
			<svg style="position: relative;top: 4px;" t="1772370087980" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1589" width="18" height="18"><path d="M465.493333 118.698667a96 96 0 0 1 126.933334 31.573333l3.541333 5.888 331.050667 597.717333a96 96 0 0 1-77.397334 142.250667l-6.570666 0.256H181.034667a96 96 0 0 1-87.082667-136.405333l3.072-6.101334L427.989333 156.16a96 96 0 0 1 37.461334-37.461333z m405.546667 666.154666l-331.093333-597.674666a32 32 0 0 0-53.504-3.754667l-2.432 3.754667-330.965334 597.674666a32 32 0 0 0 23.936 47.274667l4.053334 0.256h662.016a32 32 0 0 0 29.696-43.861333l-1.706667-3.669334-331.093333-597.674666 331.093333 597.674666zM512 682.752a42.624 42.624 0 1 1 0 85.205333 42.624 42.624 0 0 1 0-85.205333zM511.786667 362.666667a32 32 0 0 1 31.744 27.605333l0.298666 4.352 0.170667 192.085333a32 32 0 0 1-63.744 4.394667l-0.256-4.352-0.170667-192.085333a32 32 0 0 1 32-32z" p-id="1590" data-spm-anchor-id="a313x.search_index.0.i0.51753a81d1Fksg" class="" 
			fill="var(--svg-fill-color)"></path></svg>
		--> */
		
		return html`
			<div class="com-slippag-tips ${tipsCss}" style="--svg-fill-color: ${fill};">
			
				<svg style="position: relative;top: 0.2em;" t="1772437296659" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3746" width="17" height="17"><path d="M511.867 87c47.178 0 90.321 24.895 114.925 65.945l342.794 571.238c25.539 42.56 26.884 95.979 3.569 139.784-23.567 44.422-68.98 72.27-118.495 72.27H169.073c-49.516 0-94.928-27.848-118.469-72.221-23.341-43.854-21.995-97.273 3.543-139.833L396.93 152.964C421.545 111.894 464.689 87 511.867 87z m0 81.92c-18.139 0-34.731 9.574-44.683 26.177L124.391 766.334c-10.737 17.892-11.311 40.706-1.446 59.24 9.483 17.875 27.205 28.743 46.128 28.743H854.66c18.923 0 36.645-10.868 46.154-28.79 9.84-18.487 9.265-41.3-1.471-59.192L556.538 195.079c-9.94-16.585-26.532-26.159-44.671-26.159z m0 484.948c30.169 0 54.625 25.473 54.625 56.896 0 31.422-24.456 56.896-54.625 56.896s-54.625-25.474-54.625-56.896c0-31.423 24.456-56.896 54.625-56.896z m0-289.545c22.618 0 40.969 19.113 40.969 42.672v161.519c0 23.559-18.35 42.672-40.97 42.672-22.618 0-40.968-19.113-40.968-42.671v-161.52c0-23.559 18.35-42.672 40.969-42.672z" p-id="3747" 
				fill="var(--svg-fill-color)"></path></svg>
				
				<span class="tips-value">${tipsText}</span>
			</div>
		`;
	}
}
if (!customElements.get('com-slippag-tips')) {
	customElements.define('com-slippag-tips', ComSlippagTips);
}
