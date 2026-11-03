import {
	LitElement,
	html,
	css
} from 'lit';

export class ComInputLoadSkeleton extends LitElement {
	static get properties() {
		return {
			value: { type: String },
			valueusd: { type: String },
			placeholder: { type: String },
		};
	}
	
	constructor() {
		super();
		this.value = '';
		this.valueusd = '';
		this.placeholder = '';
	}
	
	static styles = css`
		:host {
			display: block;
		}
		.com-skeleton-body{
			position: absolute;
			top: 4px;
			left: 13px;
			right: var(--stxui-token-select-icon-width-output, 50px);
			bottom: 0px;
			z-index:2;
			display: flex;
			flex-direction: row;
			align-items: center;
			transition: 
				opacity 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
				right 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
			opacity: var(--stxui-icon-arrow-loading-opacity, 0);
			overflow: hidden;
		}
		.com-skeleton-value{
			transition: width 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
			position: relative;
			padding: 1px 5px;
			min-width: 120px;
			border-radius: 8px;
			overflow: hidden;
		}
		.com-skeleton-bottom{
			transition: width 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
			position: absolute;
			left: 0px;
			bottom: 8px;
			padding: 0px 6px;
			min-width: 80px;
			border-radius: 7px;
			overflow: hidden;
		}
		.skeleton-css{}
		.skeleton-css::after {
			position: absolute;
			top: 0; right: 0; bottom: 0; left: 0;
			background-image: var(--stxui-skeleton-background-load);
			background-size: 500% 500%;
			animation: skeleton 1.8s ease infinite;
			content: '';
		}
		@keyframes skeleton {
			0% {
				background-position: 100% 50%;
			}
			100% {
				background-position: 0 50%;
			}
		}
	`;
	
	
	getTextWidth(text, styles = {}) {
		try {
			// 合并默认样式和自定义样式
			const defaultStyles = {
				position: 'absolute',
				visibility: 'hidden',
				opacity: '0', // 你的原始样式
				letterSpacing: '0.04em', // 你的原始样式
				fontSize: '20px', // 你的原始样式
				maxHeight: '24px',
				lineHeight: '24px',
				whiteSpace: 'nowrap',
				userSelect: 'none',
				padding: '0',
				margin: '0',
				border: 'none',
				display: 'inline-block' // 确保宽度计算准确
			};
		
			const span = document.createElement('span');
			Object.assign(span.style, defaultStyles, styles);
			span.textContent = text || ''; // 处理空值
		
			document.body.appendChild(span);
			const width = span.offsetWidth;
			document.body.removeChild(span);
		
			return width;
		} catch (err) {}
		return 'auto';
	}
	
	

	
	

	render() {
		
		// 使用示例
		const text = this.value || this.placeholder;
		const valueWidth = this.getTextWidth(text);
		//console.log('文本宽度:', width);
		const usdWidth = this.getTextWidth(this.valueusd||'--', {
			position: 'absolute',
			visibility: 'hidden',
			opacity: '0', // 你的原始样式
			letterSpacing: '0.04em', // 你的原始样式
			fontSize: '14px', // 你的原始样式
			maxHeight: '20px',
			lineHeight: '20px',
			whiteSpace: 'nowrap',
			userSelect: 'none',
			padding: '0',
			margin: '0',
			border: 'none',
		});
		
		return html`
		<div class="com-skeleton-body">
			<div class="com-skeleton-value skeleton-css" style="width:${valueWidth}px;">
				<span style="font-size:20px;opacity:0;letter-spacing:0.04em;user-select:none;max-height:24px;line-height:24px;white-space:nowrap;"
				>${this.value||this.placeholder}</span>
			</div>
			<div class="com-skeleton-bottom skeleton-css" style="width:${usdWidth}px;">
				<span style="font-size:14px;opacity:0;letter-spacing:0.04em;user-select:none;max-height:20px;line-height:20px;white-space:nowrap;"
				>${this.valueusd||'--'}</span>
			</div>
		</div>
		<div style="opacity:0;position:absolute;top:0;right:0;bottom:0;left:0;z-index:2;"></div>
    `;
	}
}




if (!customElements.get('com-input-load-skeleton')) {
	customElements.define('com-input-load-skeleton', ComInputLoadSkeleton);
}

