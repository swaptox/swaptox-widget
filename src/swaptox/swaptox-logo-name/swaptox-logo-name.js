import {
	LitElement,
	html,
	css
} from 'lit';


export class swaptoxLogoName extends LitElement {
	
	static styles = css`
		:host {
			display: block;
			height: 40px;
		}
		.stx-logo-name {
			height: 40px;
			max-height: 40px;
			overflow: hidden;
			min-width: 40px;
			display: flex;
			flex-direction: row;
			align-items: center;
			flex-wrap: wrap;
			column-gap: 6px;
			/*cursor: pointer;*/
		}
		.app-name-bodys{
			transition-timing-function: cubic-bezier(.65, 0, .35, 1);
			transition-duration: 0.4s;
			transition-property: transform;
			transform-origin: center center;
			padding-right: 10px;
			height: 40px;
			max-height: 40px;
		}
		.stx-logo-name:hover > .app-name-bodys{
			transform:scale(1.1);
		}
		
		
		
		.hide-view-id898612{}
		@media (max-width: 560px) {
			.hide-view-id898612{
				display: none;
			}
		}
		
		
		.app-name-body-text{
			font-size: 20px;
			white-space: nowrap;
			line-height: 40px;
			color: var(--color-theme, #02bfae);
			font-weight: 500;
			font-family: var(--stxui-font-family);
			user-select: none;
		}
		
		.name-text-x{
			font-size: 22px;
			white-space: nowrap;
			line-height: 40px;
			color: var(--color-theme, #02bfae);
			font-weight: 500;
			font-family: var(--stxui-font-family);
			user-select: none;
		}
		
		
		
		
		
		
		
		
		
		
		
		.stx-logo-container {
		    width: 40px;
		    height: 40px;
		    min-width: 40px;
		    display: flex;
		    align-items: center;
		    justify-content: center;
		    overflow: hidden;
			box-sizing: content-box;
		}
		
		.stx-logo-icon {
		    transform: scale(0.125);
		    transform-origin: center center;
		    width: 320px;
		    height: 320px;
		}
		
		/* Section 1: Top */
		.stx-logo-top {
		    position: relative;
		    width: 320px;
		    height: 100px;
		}
		
		.stx-round-head {
		    width: 45px;
		    height: 45px;
		    background-color: var(--color-theme, #02bfae);
		    border-radius: 100px;
		    position: absolute;
		    left: 0;
		    top: 0;
		    z-index: 1;
		}
		
		.stx-antenna {
		    width: 45px;
		    height: 45px;
		    background-color: var(--color-theme, #02bfae);
		    border-radius: 100px;
		}
		
		.stx-wire {
		    width: 15px;
		    height: 100px;
		    background-color: #71d6cdcc;
		    position: absolute;
		    top: 15px;
		}
		
		.stx-wire-left {
		    left: 55px;
		    transform: rotate(-45deg);
		    transition: all 0.4s cubic-bezier(.65, 0, .35, 1);
		}
		
		.stx-wire-right {
		    right: 55px;
		    transform: rotate(45deg);
		}
		
		.stx-antenna-left {
		    position: absolute;
		    left: 45px;
		    top: 20px;
		    transition: all 0.4s cubic-bezier(.65, 0, .35, 1);
		}
		
		.stx-antenna-right {
		    position: absolute;
		    right: 45px;
		    top: 20px;
		}
		
		/* Section 2: Middle */
		.stx-logo-middle {
		    width: 320px;
		    height: 140px;
		    position: relative;
		    z-index: 1;
		    display: flex;
		    justify-content: center;
			box-sizing: content-box;
		}
		
		.stx-body-center {
		    position: absolute;
		    width: 200px;
		    height: 80px;
		    border: 30px solid var(--color-theme, #02bfae);
		    border-radius: 142px;
		    display: flex;
		    justify-content: center;
		    align-items: center;
		    background-color: var(--stxui-color-logo-bg, #fff);
			box-sizing: content-box;
		}
		
		.stx-eye {
		    width: 30px;
		    height: 45px;
		    position: absolute;
		    top: 18px;
		    transition: all 0.4s cubic-bezier(.65, 0, .35, 1);
		    display: flex;
		    align-items: center;
		    justify-content: center;
			box-sizing: content-box;
		}
		
		.stx-eye-left { left: 50px; }
		.stx-eye-right { left: 120px; }
		
		.stx-eye-pupil {
		    background-color: var(--stxui-color-logo-eye);
		    width: 30px;
		    height: 45px;
		    border-radius: 100px;
		}
		
		/* Blink Logic */
		.stx-eye-pupil[data-blink="true"] {
		    height: 15px;
		    transition: all 0.4s cubic-bezier(.65, 0, .35, 1);
		}
		
		/* Move Logic */
		.stx-wire-left[data-move="true"] {
		    left: 17px;
		    transform: rotate(0deg);
		}
		
		.stx-antenna-left[data-move="true"] {
		    left: 105px;
		    top: 0px;
		}
		
		.stx-eye-left[data-move="true"] { left: 70px; }
		.stx-eye-right[data-move="true"] { left: 140px; }
		
		/* Section 3: Bottom */
		.stx-logo-bottom {
		    width: 320px;
		    height: 80px;
		    display: flex;
		    align-items: center;
		    justify-content: center;
		}
		
		.stx-bottom-bar {
		    width: 230px;
		    height: 30px;
		    background-color: var(--color-theme, #02bfae);
		    border-radius: 100px;
		    transition: width 0.4s cubic-bezier(.65, 0, .35, 1);
		}
		
		@keyframes stxLogoAnimation {
		    from { height: 45px; }
		    40% { height: 15px; }
		    to { height: 45px; }
		}
		
		.stx-logo-name:hover > .stx-logo-container > .stx-logo-icon > .stx-logo-top > .stx-antenna-left {
			left: 105px;
			top: 0px;
		}
		.stx-logo-name:hover > .stx-logo-container > .stx-logo-icon > .stx-logo-top > .stx-antenna-left > .stx-wire-left {
			left: 17px;
			transform: rotate(0deg);
		}
		.stx-logo-name:hover > .stx-logo-container > .stx-logo-icon > .stx-logo-middle > .stx-body-center > .stx-eye-left {
			left: 70px;
		}
		.stx-logo-name:hover > .stx-logo-container > .stx-logo-icon > .stx-logo-middle > .stx-body-center > .stx-eye-right {
			left: 140px;
		}
		.stx-logo-name:hover > .stx-logo-container > .stx-logo-icon > .stx-logo-bottom > .stx-bottom-bar {
			width: 190px;
		}
		
		.stx-logo-name:hover > .stx-logo-container > .stx-logo-icon > .stx-logo-middle > .stx-body-center > .stx-eye > .stx-eye-pupil {
			animation: stxLogoAnimation 0.6s ease-in-out 1 normal forwards;
		}
		
		
	`;
	
	
	render() {
		return html`
			<div class="stx-logo-name">
			
				
				
				<div class="stx-logo-container">
				  <div class="stx-logo-icon">
				    
				    
				    <div class="stx-logo-top">
				      <div 
				        class="stx-antenna stx-antenna-left" 
				        data-move="false"
				      >
				        <div class="stx-wire stx-wire-left" data-move="false"></div>
				        <div class="stx-round-head"></div>
				      </div>
				      
				      <div class="stx-antenna stx-antenna-right">
				        <div class="stx-wire stx-wire-right"></div>
				        <div class="stx-round-head"></div>
				      </div>
				    </div>
				
				    
				    <div class="stx-logo-middle">
				      <div class="stx-body-center">
				        <div class="stx-eye stx-eye-left" data-move="false">
				          <div class="stx-eye-pupil" data-blink="false"></div>
				        </div>
				        <div class="stx-eye stx-eye-right" data-move="false">
				          <div class="stx-eye-pupil" data-blink="false"></div>
				        </div>
				      </div>
				    </div>
				
				    
				    <div class="stx-logo-bottom">
				      <div class="stx-bottom-bar"></div>
				    </div>
				
				  </div>
				</div>
				
				
				
			
				<div class="app-name-bodys hide-view-id898612">
					<div class="app-name-body-text"
					>Swapto<span class="name-text-x">X</span></div>
				</div>
				
			</div>
		`;
	}
}


if (!customElements.get('swaptox-logo-name')) {
	customElements.define('swaptox-logo-name', swaptoxLogoName);
}