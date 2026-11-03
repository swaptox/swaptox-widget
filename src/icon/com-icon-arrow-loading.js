import {
	LitElement,
	html,
	css
} from 'lit';

import { OperationMonitor } from './OperationMonitor.js';
import { $app } from '../js_sdk/index.js';

export class ComIconArrowLoading extends LitElement {
	static get properties() {
		return {
			disabled: {
				type: Boolean,
				reflect: true
			},
			loading: {
				type: Boolean,
				reflect: false
			},
			delaytime: {
				type: Number,
				reflect: 10
			},
			_isload: {
				type: Boolean,
				reflect: false
			},
		};
	}

	constructor() {
		super();
		$app.htmlProperty({
			//'--stxui-icon-arrow-loading-display': 'none',
			'--stxui-icon-arrow-loading-opacity': '0',
			'--stxui-icon-arrow-loading-hide': '1',
		});
		
		this.loading = false;
		this.disabled = true;
		
		this._intervalId = null;
		
		this._anim = null; // 存储动画对象
		
		window.$comIconArrowLoadingThis = this;
		window.$comIconArrowLoadingOn = false;
		
		// 初始化监控器，设置 15 分钟闲置
		this._ImmediateCallback = false;
        this.monitor = new OperationMonitor(15 * 60 * 1000);
        this.isOperational = true;
	}

	//监听活动
	connectedCallback() {
        super.connectedCallback();
        // 绑定事件监听
        this._onStatusChange = (e) => {
            this.isOperational = e.detail.isOperational;
			if(this._ImmediateCallback){
				this._ImmediateCallback = false;
				this.tapReturn();
			}
            //console.log(`收到状态更新: ${e.detail.reason}`);
        };
        this.monitor.addEventListener('status-change', this._onStatusChange);
        // 启动
        this.monitor.start();
    }
    _disConnectedCallback() {
        super.disconnectedCallback();
        // 销毁并移除监听
        this.monitor.stop();
        this.monitor.removeEventListener('status-change', this._onStatusChange);
    }







	static get styles() {
		return css`
		:host {
			display: block;
			position: relative;
			width: 32px;
			height: 32px;
			border-radius: 8px;
			background-color: transparent;
			transition: background-color 0.2s;
			overflow: hidden;
		}
		.is-arrow-disabled-true{
			color: var(--stxui-icon-arrow-loading-false-color, #bac7da);
		}
		.is-arrow-disabled-false{
			transition: all 0.3s;
			width: 32px;
			height: 32px;
			border-radius: 8px;
	  		cursor: pointer;
			color: var(--stxui-icon-arrow-loading-true-color, #222222);
		}
		.is-arrow-disabled-false:hover {
			background-color: rgba(108, 134, 173, 0.15);
		}
		
		.arrow-loading {
			color: inherit;
			display: block;
			position: relative;
			top: -4px;
			left: -4px;
		}
		
		.customload-path-false {
			fill: var(--stxui-icon-arrow-loading-false-color, #bac7da);
		}		
		.rotating-elements-true{
			color: var(--stxui-icon-arrow-loading-false-color, #bac7da);
		}
		
		.arrow_body{
			position: absolute;
			top: 0px;
			left: 0px;
			right: 0px;
			bottom: 0px;
			transition: opacity 0.3s;
		}
		
		.arrow-disabled {
			position: absolute;
			top: -1px;
			left: -1px;
			right: -1px;
			bottom: -1px;
			z-index: 2;
			cursor: auto;
		}
		.inloading{
			cursor: progress;
		}
    `;
	}
	
	
	
	
	
	
	hideAndShow(isShow) {
	    const el1 = this.renderRoot.querySelector('.rotating-elements-true');
		const el2 = this.renderRoot.querySelector('.rotating-elements-false');
		//const el3 = this.renderRoot.querySelector('#div-disabled');
		if (!el1 || !el2) return;
		if (isShow) {
			//el3.style.display = 'block';
			el1.style.opacity = '1';
			el2.style.opacity = '0';
		} else {
			el1.style.opacity = '0';
			el2.style.opacity = '1';
			setTimeout(()=>{
				//el3.style.display = 'none';
				this._isload = false;
			}, 300);//350
		}
	}
	
	
	
	// 开始动画
	startLoading() {
	    const target = this.renderRoot.querySelector('.v-donghua-id');
	    if (!target) return;
	    if (this._anim) this._anim.cancel();
		this._anim = target.animate([
			{ transform: 'rotate(0deg)' },
			{ transform: 'rotate(360deg)' }
		], {
			duration: 600,           	// 稍微慢一点，更有质感
			easing: 'ease-out',       	// 循环过程中必须是匀速，否则接缝会跳动
			iterations: Infinity,
			fill: 'forwards'         	// 关键：动画结束后停在最后一帧，不要跳回
		});
	}
	
	// 精准停止：跑完当前这一圈
	stopLoading() {
		if (!this._anim) return;

		const target = this.renderRoot.querySelector('.v-donghua-id');
		const style = window.getComputedStyle(target);
		const matrix = new DOMMatrix(style.transform);
		
		// 1. 获取当前实时角度 (0 ~ 360)
		let currentAngle = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
		if (currentAngle < 0) currentAngle += 360;

		// 2. 停止原动画
		this._anim.cancel();

		// 3. 计算剩余角度和动态时长
		const remainingAngle = 360 - currentAngle;
		
		// 基础参数：保持角速度与无限循环时一致
		// 如果你之前的无限循环 dur 是 600ms，这里就用 600
		const baseDuration = 600; 
		const dynamicDuration = (remainingAngle / 360) * baseDuration;

		// 4. 启动刹车动画
		// 注意：如果剩余角度极小（比如 < 10度），可以直接不播动画或者设定一个最小阈值
		if (remainingAngle > 1) {
			target.animate([
				{ transform: `rotate(${currentAngle}deg)` },
				{ transform: `rotate(360deg)` }
			], {
				duration: dynamicDuration,
				easing: 'ease-out', // 依然保留 ease-out 产生自然的阻尼感
				fill: 'forwards'
			});
		}
		
		
		setTimeout(()=>{
			this.resetAnimations();
			this.hideAndShow(false);
		}, dynamicDuration);
		
		this._anim = null;
	}
	

	// 模拟 Vue 的 watch
	updated(changedProperties) {
		if (changedProperties.has('loading')) {
			if (this.loading) {
				this.removeEndEvent();
				this.hideAndShow(true);
				this.startLoading();
			} else {
				this.stopLoading();
			}
			return;
		}
		if (changedProperties.has('disabled')) {
			if (this.disabled) {
				this._ImmediateCallback = false;
				this.removeEndEvent();
			} else {
				this.resetAnimations();
			}
		}
	}

	firstUpdated() {
		setTimeout(() => {
			if (this.supportsSvgAnimateRepeatEvent()) {
				this.resetAnimations();
			}else{
				this.startCycle();//定时询价
			}
		}, 100);
	}

	disconnectedCallback() {
		this._disConnectedCallback();
		super.disconnectedCallback();
		if (this._intervalId) clearInterval(this._intervalId);
	}

	supportsSvgAnimateRepeatEvent() {
		const anim = document.createElementNS("http://www.w3.org/2000/svg", "animate");
		return "onrepeat" in anim;
	}

	handleTap() {
		if(this.loading){
			return;
		}
		if (this.disabled) {
			return;
		}
		this.tapReturn();
	}

	tapReturn() {
		if (!this.isOperational) {
			this._ImmediateCallback = true;
			return;
		}
		this._isload = true;
		this.dispatchEvent(new CustomEvent('change'));
		if (this.timer) clearTimeout(this.timer);
	}

	startCycle() {
		if (this.timer) clearTimeout(this.timer);
		let delaytime = (this.delaytime*1000)+700;
		this.timer = setTimeout(() => {
			this.handleTap();
			this.timer = null; // 任务完成后重置
		}, delaytime);
	}


	_onEndEvent(e) {
		var _me = window.$comIconArrowLoadingThis;
		if(!window.$comIconArrowLoadingOn){
			return;
		}
		_me.handleTap();
	}


	resetAnimations() {
		const svg = this.renderRoot.querySelector('#arrow_loading');
		if (!svg) return;
		const clone = svg.cloneNode(true);
		svg.parentNode.replaceChild(clone, svg);
		const animate = clone.querySelector('animate[attributeName="stroke-dashoffset"]');
		if (!this.disabled && animate) {
		    animate.removeEventListener("endEvent", this._onEndEvent);
			window.$comIconArrowLoadingOn = true;
		    animate.addEventListener("endEvent", this._onEndEvent);
		}
	}
	

	removeEndEvent() {
		window.$comIconArrowLoadingOn = false;
		const anim = this.renderRoot.querySelector('#arrow_loading');
		anim.querySelector('animate[attributeName="stroke-dashoffset"]')
		.removeEventListener('endEvent', this._onEndEvent);
	}
	
	
	isLoading(e){
		if(e){
			this._isZhengZaiLoad = true;
			$app.htmlProperty({
				'--stxui-icon-switch-token-load': 'flex',
				'--stxui-icon-switch-token-open': 'none',
				
				'--stxui-icon-arrow-loading-opacity': '1',
				'--stxui-icon-arrow-loading-hide': '0',
				'--stxui-route-is-loading': 'inline',
			});
			this.dispatchEvent(new CustomEvent('is-loading', {
				detail: true,
				bubbles: false,
				composed: false
			}));
		}else{
			$app.htmlProperty({
				'--stxui-icon-switch-token-load': 'none',
				'--stxui-icon-switch-token-open': 'flex',
				
				'--stxui-icon-arrow-loading-opacity': '0',
				'--stxui-icon-arrow-loading-hide': '1',
				'--stxui-route-is-loading': 'none',
			});
			if(this._isZhengZaiLoad){
				this._isZhengZaiLoad = false;
				this.dispatchEvent(new CustomEvent('is-loading', {
					detail: false,
					bubbles: false,
					composed: false
				}));
			}
		}
	}
	
	
	render() {
		
		try {
			if(this.loading||this._isload){
				this.isLoading(true);
			}else{
				this.isLoading(false);
			}
		} catch (e) {}
		
		return html`
		<div class="is-arrow-disabled-${this.disabled||this.loading||this._isload?'true':'false'}">
			
			<div @click="${this.handleTap}" class="arrow_body v-donghua-id">
			
				<div class="rotating-elements-false arrow_body" style="opacity:1;">
					<svg id="arrow_loading"
						xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 36 36" 
						class="arrow-loading" 
						width="40" height="40">
						<path stroke="none" fill="none"
							d="M16.2751 7.78995C13.932 5.44681 10.133 5.44681 7.78986 7.78995C7.02853 8.55128 6.51457 9.4663 6.24798 10.4351C6.24473 10.4499 6.24114 10.4646 6.23719 10.4793C6.17635 10.7064 6.12938 10.9339 6.09577 11.161C5.83159 12.9457 6.39255 14.7026 7.52624 15.9944C7.61054 16.0901 7.69842 16.1838 7.78986 16.2752C8.08307 16.5685 8.39909 16.825 8.7322 17.0448C9.25533 17.3892 9.84172 17.6568 10.4798 17.8278C10.7386 17.8971 10.9979 17.9484 11.2565 17.9825C12.9537 18.2061 14.6187 17.6866 15.8747 16.6415C16.0123 16.5265 16.1459 16.4044 16.2751 16.2752C16.2848 16.2655 16.2947 16.2561 16.3047 16.2469C17.0123 15.531 17.5491 14.627 17.8283 13.5851C17.9712 13.0517 18.5196 12.7351 19.053 12.878C19.5865 13.021 19.9031 13.5693 19.7602 14.1028C19.3141 15.7676 18.3745 17.1684 17.1409 18.1899C16.1883 18.9822 15.0949 19.5189 13.9515 19.8002C11.8607 20.3147 9.6028 19.9749 7.7328 18.7809C7.06855 18.3579 6.47841 17.8432 5.97519 17.2589C5.12341 16.2738 4.55173 15.1302 4.26015 13.9324C4.01698 12.9416 3.96104 11.8931 4.12168 10.8379C4.36697 9.20484 5.1183 7.63309 6.37564 6.37574C9.49984 3.25154 14.5652 3.25154 17.6894 6.37574L18.2332 6.91959L18.2337 5.49951C18.2338 5.05769 18.5921 4.69964 19.034 4.69979C19.4758 4.69995 19.8338 5.05825 19.8337 5.50007L19.8325 9.03277L19.8322 9.8325L19.0325 9.83249L18.9401 9.83249C18.8146 9.85665 18.6854 9.85665 18.5599 9.83248L15.5005 9.83245C15.0587 9.83245 14.7005 9.47427 14.7005 9.03244C14.7005 8.59062 15.0587 8.23245 15.5005 8.23245L16.7176 8.23246L16.2751 7.78995Z"
							class="customload-path-false"></path>
						<defs>
							<path id="arrow" stroke="none" fill="none"
								d="M16.2751 7.78995C13.932 5.44681 10.133 5.44681 7.78986 7.78995C7.02853 8.55128 6.51457 9.4663 6.24798 10.4351C6.24473 10.4499 6.24114 10.4646 6.23719 10.4793C6.17635 10.7064 6.12938 10.9339 6.09577 11.161C5.83159 12.9457 6.39255 14.7026 7.52624 15.9944C7.61054 16.0901 7.69842 16.1838 7.78986 16.2752C8.08307 16.5685 8.39909 16.825 8.7322 17.0448C9.25533 17.3892 9.84172 17.6568 10.4798 17.8278C10.7386 17.8971 10.9979 17.9484 11.2565 17.9825C12.9537 18.2061 14.6187 17.6866 15.8747 16.6415C16.0123 16.5265 16.1459 16.4044 16.2751 16.2752C16.2848 16.2655 16.2947 16.2561 16.3047 16.2469C17.0123 15.531 17.5491 14.627 17.8283 13.5851C17.9712 13.0517 18.5196 12.7351 19.053 12.878C19.5865 13.021 19.9031 13.5693 19.7602 14.1028C19.3141 15.7676 18.3745 17.1684 17.1409 18.1899C16.1883 18.9822 15.0949 19.5189 13.9515 19.8002C11.8607 20.3147 9.6028 19.9749 7.7328 18.7809C7.06855 18.3579 6.47841 17.8432 5.97519 17.2589C5.12341 16.2738 4.55173 15.1302 4.26015 13.9324C4.01698 12.9416 3.96104 11.8931 4.12168 10.8379C4.36697 9.20484 5.1183 7.63309 6.37564 6.37574C9.49984 3.25154 14.5652 3.25154 17.6894 6.37574L18.2332 6.91959L18.2337 5.49951C18.2338 5.05769 18.5921 4.69964 19.034 4.69979C19.4758 4.69995 19.8338 5.05825 19.8337 5.50007L19.8325 9.03277L19.8322 9.8325L19.0325 9.83249L18.9401 9.83249C18.8146 9.85665 18.6854 9.85665 18.5599 9.83248L15.5005 9.83245C15.0587 9.83245 14.7005 9.47427 14.7005 9.03244C14.7005 8.59062 15.0587 8.23245 15.5005 8.23245L16.7176 8.23246L16.2751 7.78995Z">
							</path>
							<clipPath id="arrow-clip">
								<use xlink:href="#arrow"></use>
							</clipPath>
						</defs>
						<g clip-path="url(#arrow-clip)">
							<circle cx="12" cy="12" r="5" transform="rotate(365,12,12)" fill="none"
								stroke="currentColor" stroke-width="16" stroke-dasharray="30" stroke-dashoffset="0">
								
								<animate
									attributeName="stroke-dashoffset" 
									values="0;-30"
									begin="arrow_loading.click; 0.7s" 
									repeatCount="1" 
									fill="freeze"
									restart="never"
									dur="${this.delaytime}.3s"
								></animate>
								
								
							</circle>
						</g>
						<use xlink:href="#arrow"></use>
						
					</svg>
				</div>
				
				
				
				<div class="rotating-elements-true arrow_body" style="opacity:0;z-index:1;">
					<svg 
						xmlns="http://www.w3.org/2000/svg" 
						viewBox="-6 -6 36 36" 
						class="arrow-loading is-arrow-disabled-true" 
						width="40" 
						height="40"
						style="pointer-events: none;"> <path stroke="none" fill="none"
							d="M16.2751 7.78995C13.932 5.44681 10.133 5.44681 7.78986 7.78995C7.02853 8.55128 6.51457 9.4663 6.24798 10.4351C6.24473 10.4499 6.24114 10.4646 6.23719 10.4793C6.17635 10.7064 6.12938 10.9339 6.09577 11.161C5.83159 12.9457 6.39255 14.7026 7.52624 15.9944C7.61054 16.0901 7.69842 16.1838 7.78986 16.2752C8.08307 16.5685 8.39909 16.825 8.7322 17.0448C9.25533 17.3892 9.84172 17.6568 10.4798 17.8278C10.7386 17.8971 10.9979 17.9484 11.2565 17.9825C12.9537 18.2061 14.6187 17.6866 15.8747 16.6415C16.0123 16.5265 16.1459 16.4044 16.2751 16.2752C16.2848 16.2655 16.2947 16.2561 16.3047 16.2469C17.0123 15.531 17.5491 14.627 17.8283 13.5851C17.9712 13.0517 18.5196 12.7351 19.053 12.878C19.5865 13.021 19.9031 13.5693 19.7602 14.1028C19.3141 15.7676 18.3745 17.1684 17.1409 18.1899C16.1883 18.9822 15.0949 19.5189 13.9515 19.8002C11.8607 20.3147 9.6028 19.9749 7.7328 18.7809C7.06855 18.3579 6.47841 17.8432 5.97519 17.2589C5.12341 16.2738 4.55173 15.1302 4.26015 13.9324C4.01698 12.9416 3.96104 11.8931 4.12168 10.8379C4.36697 9.20484 5.1183 7.63309 6.37564 6.37574C9.49984 3.25154 14.5652 3.25154 17.6894 6.37574L18.2332 6.91959L18.2337 5.49951C18.2338 5.05769 18.5921 4.69964 19.034 4.69979C19.4758 4.69995 19.8338 5.05825 19.8337 5.50007L19.8325 9.03277L19.8322 9.8325L19.0325 9.83249L18.9401 9.83249C18.8146 9.85665 18.6854 9.85665 18.5599 9.83248L15.5005 9.83245C15.0587 9.83245 14.7005 9.47427 14.7005 9.03244C14.7005 8.59062 15.0587 8.23245 15.5005 8.23245L16.7176 8.23246L16.2751 7.78995Z">
						</path>
					
						<defs>
							<path id="arrow" stroke="none" fill="none"
								d="M16.2751 7.78995C13.932 5.44681 10.133 5.44681 7.78986 7.78995C7.02853 8.55128 6.51457 9.4663 6.24798 10.4351C6.24473 10.4499 6.24114 10.4646 6.23719 10.4793C6.17635 10.7064 6.12938 10.9339 6.09577 11.161C5.83159 12.9457 6.39255 14.7026 7.52624 15.9944C7.61054 16.0901 7.69842 16.1838 7.78986 16.2752C8.08307 16.5685 8.39909 16.825 8.7322 17.0448C9.25533 17.3892 9.84172 17.6568 10.4798 17.8278C10.7386 17.8971 10.9979 17.9484 11.2565 17.9825C12.9537 18.2061 14.6187 17.6866 15.8747 16.6415C16.0123 16.5265 16.1459 16.4044 16.2751 16.2752C16.2848 16.2655 16.2947 16.2561 16.3047 16.2469C17.0123 15.531 17.5491 14.627 17.8283 13.5851C17.9712 13.0517 18.5196 12.7351 19.053 12.878C19.5865 13.021 19.9031 13.5693 19.7602 14.1028C19.3141 15.7676 18.3745 17.1684 17.1409 18.1899C16.1883 18.9822 15.0949 19.5189 13.9515 19.8002C11.8607 20.3147 9.6028 19.9749 7.7328 18.7809C7.06855 18.3579 6.47841 17.8432 5.97519 17.2589C5.12341 16.2738 4.55173 15.1302 4.26015 13.9324C4.01698 12.9416 3.96104 11.8931 4.12168 10.8379C4.36697 9.20484 5.1183 7.63309 6.37564 6.37574C9.49984 3.25154 14.5652 3.25154 17.6894 6.37574L18.2332 6.91959L18.2337 5.49951C18.2338 5.05769 18.5921 4.69964 19.034 4.69979C19.4758 4.69995 19.8338 5.05825 19.8337 5.50007L19.8325 9.03277L19.8322 9.8325L19.0325 9.83249L18.9401 9.83249C18.8146 9.85665 18.6854 9.85665 18.5599 9.83248L15.5005 9.83245C15.0587 9.83245 14.7005 9.47427 14.7005 9.03244C14.7005 8.59062 15.0587 8.23245 15.5005 8.23245L16.7176 8.23246L16.2751 7.78995Z">
							</path>
							<clipPath id="arrow-clip">
								<use xlink:href="#arrow"></use>
							</clipPath>
						</defs>
					
						<g clip-path="url(#arrow-clip)">
							<circle cx="12" cy="12" r="5" transform="rotate(365,12,12)" fill="none"
								stroke="currentColor" stroke-width="16" stroke-dasharray="30" stroke-dashoffset="0">
							</circle>
						</g>
					
						<use xlink:href="#arrow"></use>
					</svg>
				</div>
			
			</div>
			
			${this.disabled||this.loading||this._isload ? html`<div class="arrow-disabled ${this.loading||this._isload?'inloading':''}"></div>` : ''}
			
		</div>
    `;
	}
}
if (!customElements.get('com-icon-arrow-loading')) {
	customElements.define('com-icon-arrow-loading', ComIconArrowLoading);
}
