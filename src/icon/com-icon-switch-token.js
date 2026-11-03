import {
	LitElement,
	html,
	css
} from 'lit';



export class ComIconSwitchToken extends LitElement {
	static get properties() {
		return {
			loading: { type: Boolean },
			disabled: { type: Boolean },
		};
	}
	
	constructor() {
		super();
		this.loading = false;
		this.disabled = false;
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			.center-switch-token-body{
				display: flex;
				align-items: center;
				justify-content: center;
				height: 30px;
			}
			
			.center-switch-token-item{
				width: 30px;
				height: 30px;
				display: flex;
				align-items: center;
				justify-content: center;
			}		
			
			
			.center-switch-token-icon{
				fill: #666;
				transition: transform .1s;
				transform-style: preserve-3d;
			}
			.switch-tap{}
			.switch-tap:hover > .center-switch-token-icon{
				fill: var(--stxui-theme-font-color, #111);
				transform: rotateX(180deg);
			}
			.switch-tap:active > .center-switch-token-icon{
				opacity: 0.6;
				fill: #999;
			}
		`;
	}

	render() {
		
		
		if(this.disabled){
			return html`
				<div class="center-switch-token-body">
					<svg t="1792808656416" style="opacity: 0.3;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1553" width="16" height="16"><path d="M146.752 621.24800001l320 320c24.992051 24.992051 65.504051 24.992051 90.496 0l320-320c24.992051-24.992051 24.992051-65.504051 0-90.496-24.992051-24.992051-65.504051-24.992051-90.496 0l-210.75199999 210.75199999-1e-8-613.504c0-35.36005101-28.640051-64-64-64-35.36005101 0-64 28.640051-64 64l-1e-8 613.504-210.75199999-210.75199999c-12.512051-12.48-28.864-18.752-45.248-18.75200001s-32.768 6.240051-45.248 18.75200001c-24.992051 24.992051-24.992051 65.504051 0 90.496z" p-id="1554" fill="#999"></path></svg>
				</div>
			`;
		}
		
		
		
		
		return html`
			<div class="center-switch-token-body">
			
			
				${this.loading?html`
					<div class="center-switch-token-item" style="opacity: 0.5;">
						<svg t="1770348588587"  
						style="cursor: progress;opacity: 0.6;fill: #999;"
						viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1395" width="20" height="20"><path d="M332.256 840.23466665a31.87 31.87 0 0 1-34.88-6.944l-192-192c-12.512-12.512-12.512-32.736 0-45.248s32.736-12.512 45.248 0L288 733.41866665V202.66666665c0-17.696 14.336-32 32-32s32 14.304 32 32v608c0 12.928-7.808 24.608-19.744 29.568z m586.368-454.944c-12.512 12.512-32.736 12.512-45.248 0L768 279.91466665V810.66666665c0 17.664-14.304 32-32 32s-32-14.336-32-32V202.66666665c0-12.928 7.776-24.64 19.744-29.568C727.712 171.43466665 731.872 170.66666665 736 170.66666665a32.01 32.01 0 0 1 22.624 9.376l160 160c12.512 12.512 12.512 32.736 0 45.248z" p-id="1396"></path></svg>
					</div>
				`:html`
					<div class="center-switch-token-item" style="display: var(--stxui-icon-switch-token-load);">
						<svg t="1770348588587"  
						style="cursor: progress;opacity: 0.6;fill: #999;"
						viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1395" width="20" height="20"><path d="M332.256 840.23466665a31.87 31.87 0 0 1-34.88-6.944l-192-192c-12.512-12.512-12.512-32.736 0-45.248s32.736-12.512 45.248 0L288 733.41866665V202.66666665c0-17.696 14.336-32 32-32s32 14.304 32 32v608c0 12.928-7.808 24.608-19.744 29.568z m586.368-454.944c-12.512 12.512-32.736 12.512-45.248 0L768 279.91466665V810.66666665c0 17.664-14.304 32-32 32s-32-14.336-32-32V202.66666665c0-12.928 7.776-24.64 19.744-29.568C727.712 171.43466665 731.872 170.66666665 736 170.66666665a32.01 32.01 0 0 1 22.624 9.376l160 160c12.512 12.512 12.512 32.736 0 45.248z" p-id="1396"></path></svg>
					</div>
					
					<div @click=${this._tapSwitchToken} class="center-switch-token-item switch-tap" 
					style="cursor: pointer;display: var(--stxui-icon-switch-token-open);">
						<svg t="1770348588587"
						class="center-switch-token-icon" 
						viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1395" width="20" height="20"><path d="M332.256 840.23466665a31.87 31.87 0 0 1-34.88-6.944l-192-192c-12.512-12.512-12.512-32.736 0-45.248s32.736-12.512 45.248 0L288 733.41866665V202.66666665c0-17.696 14.336-32 32-32s32 14.304 32 32v608c0 12.928-7.808 24.608-19.744 29.568z m586.368-454.944c-12.512 12.512-32.736 12.512-45.248 0L768 279.91466665V810.66666665c0 17.664-14.304 32-32 32s-32-14.336-32-32V202.66666665c0-12.928 7.776-24.64 19.744-29.568C727.712 171.43466665 731.872 170.66666665 736 170.66666665a32.01 32.01 0 0 1 22.624 9.376l160 160c12.512 12.512 12.512 32.736 0 45.248z" p-id="1396"></path></svg>
					</div>
				`}
				
			
			</div>
		`;
	}
	
	_tapSwitchToken() {
		this.dispatchEvent(new CustomEvent('change', {
			detail: {},
			bubbles: false,
			composed: false
		}));
	}
	
}
if (!customElements.get('com-icon-switch-token')) {
	customElements.define('com-icon-switch-token', ComIconSwitchToken);
}
