import {
	LitElement,
	html,
	css
} from 'lit';

import './com/stx-token-selector-modal.js';
import './com/stx-token-selector-list.js';
import '../stx-token-card/stx-token-card.js';
import {cardInfo} from '../stx-token-card/stx-token-card-config.js';

export class StxTokenSelector extends LitElement {
	static properties = {
		disabledMiniPriceCard: {
			type: Boolean
		},
		open: {
			type: Boolean,
			reflect: true
		},
		showclose: {
			type: Boolean
		},
		chain: {
			type: String
		},
		tokenInfoStyles: {
			type: String
		},
		openTokenCard: {
			type: Boolean,
			reflect: true
		},
		tokeninfo: {
			type: Object
		},
		wallet: {
			type: String
		},
	};

	static styles = css`
		:host {
			display: none;
		}
		:host([open]) {
			display: block;
		}
	`;

	constructor() {
		super();
		this.disabledMiniPriceCard = false;
		this.open = false;
		this.tokenInfoStyles = '';
		this.openTokenCard = false;
		this.showclose = false;
		this.wallet = '';
	}





	_handleClose(e) {
		this.dispatchEvent(new CustomEvent('close'));
	}
	
	
	
	
	
	render() {
		return html`
		<stx-token-selector-modal @mask="${this._handleClose}" @close=${this._handleClose} .open="${this.open}">
		
			${!this.disabledMiniPriceCard?html`
				<stxapp-mini-modal styles="${this.tokenInfoStyles}"
					.open="${this.openTokenCard}"
					@close="${()=>{this.openTokenCard=false;}}"
				>
					<stx-token-card 
						.showclose="${this.showclose}"
						.tokeninfo="${this.tokeninfo}" 
						@close="${()=>{this.openTokenCard=false;}}"
					></stx-token-card>
				</stxapp-mini-modal>
			`:null}
			
		
			<stx-token-selector-list 
				?disabledMiniPriceCard=${this.disabledMiniPriceCard}
				.wallet="${this.wallet}"
				.chain="${this.chain}" 
				.isopen="${this.open}"
				@close="${this._handleClose}"
				@open-token-info="${this._openTokenInfo}"
				@select-token="${this._selectToken}"
			>
			</stx-token-selector-list>
		</stx-token-selector-modal>
    `;
	}
	
	_selectToken(e) {
		this.dispatchEvent(new CustomEvent('select-token', {
			detail: e.detail,
			bubbles: false,
			composed: false
		}));//console.log('选择代币', e.detail);
	}
	
	
	_openTokenInfo(e){
		let infos = e.detail;
		this.tokeninfo = Object.assign({}, infos, {
			chain: this.chain,
			//date: Date.now()
		});
		//console.log('打开代币信息:', this.tokeninfo);
		if(window.innerWidth>=(520+((cardInfo.width+12+12)*2))){
			const modal = this.shadowRoot.querySelector('stx-token-selector-list');
			const rect = modal.getBoundingClientRect();
			const left = rect.left + rect.width + 12;
			this.showclose = false;
			this.tokenInfoStyles = `transform-origin: center center;top:50%;left:${left}px;border-radius: 16px;animation: modal-special 0.15s cubic-bezier(0.4, 0, 0.2, 1) forwards;box-shadow: 0px 15px 50px -12px rgba(0, 0, 0, 0.35);`;//0 0 3px 0 rgba(0,0,0,.2), 0 4px 14px 0 rgba(0,0,0,.05)
			this.openTokenCard = true;
			return;			
		}
		this.showclose = true;
		this.tokenInfoStyles = `transform-origin: ${infos.origin};top:${infos.top}px;left:${infos.left}px;border-radius: 16px;box-shadow: 0px 15px 50px -12px rgba(0, 0, 0, 0.25);`;//0 0 3px 0 rgba(0,0,0,.2), 0 4px 14px 0 rgba(0,0,0,.05)
		this.openTokenCard = true;
	}
	
}

if (!customElements.get('stx-token-selector')) {
	customElements.define('stx-token-selector', StxTokenSelector);
}
