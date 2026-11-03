import { LitElement, html, css } from 'lit';
import {$app} from '../../../js_sdk/index.js';
import { networkData } from '../../../data/network-data.js';
export class StxcomHomeTokensBg extends LitElement {
	static get properties() {
		return {
			theme: { type: String, reflect: true },
			mini: { type: Boolean, reflect: true },
			tokenList: { type: Array },
		};
	}

	constructor() {
		super();
		this.theme = 'light';
		this.mini = false;

		// 布局配置
		this.layoutConfigs = [
			{ x: '6%',  y: '18%', size: 52, rotate: -12, duration: '5.2s', delay: '0s' },
			{ x: '22%', y: '40%', size: 48, rotate: 15,  duration: '6.5s', delay: '0.8s' },
			{ x: '8%',  y: '68%', size: 62, rotate: -8,  duration: '4.8s', delay: '1.5s' },
			//{ x: '22%', y: '15%', size: 38, rotate: 10,  duration: '5.8s', delay: '0.4s' },
			{ x: '78%', y: '14%', size: 44, rotate: -14, duration: '6.2s', delay: '0.2s' },
			//{ x: '86%', y: '22%', size: 56, rotate: 8,   duration: '5.0s', delay: '1.2s' },
			{ x: '66%', y: '64%', size: 56, rotate: -6,  duration: '5.5s', delay: '0.6s' },
			{ x: '82%', y: '60%', size: 42, rotate: 12,  duration: '4.5s', delay: '0.4s' }
		];
		
		
		/* this.layoutConfigs = [
			{ x: '4%',  y: '14%', size: 60, rotate: -12, duration: '5.2s', delay: '0s' },
			{ x: '15%', y: '40%', size: 48, rotate: 15,  duration: '6.5s', delay: '0.8s' },
			{ x: '6%',  y: '74%', size: 62, rotate: -8,  duration: '4.8s', delay: '1.5s' },
			//{ x: '22%', y: '15%', size: 38, rotate: 10,  duration: '5.8s', delay: '0.4s' },
			{ x: '80%', y: '14%', size: 44, rotate: -14, duration: '6.2s', delay: '0.2s' },
			//{ x: '86%', y: '22%', size: 56, rotate: 8,   duration: '5.0s', delay: '1.2s' },
			{ x: '89%', y: '74%', size: 56, rotate: -6,  duration: '5.5s', delay: '0.6s' },
			{ x: '82%', y: '50%', size: 42, rotate: 12,  duration: '4.5s', delay: '0.4s' }
		]; */
		
		
		
		// 原始代币列表（增加 change 涨幅参数）
		this.tokenList = [];		
		this._getTokenList(0);
		
	}
	
	async _getTokenList(num){
		if(780>window.innerWidth){
			return;
		}
		if(num>3){
			return;
		}
		const apiurl = 'https://api-v2.swaptox.com/rootstock/tokensTrending';
		try {
			const tokensTrending = await $app.request({'url': apiurl});
			this.tokenList = tokensTrending;
		} catch (error) {
			setTimeout(()=>{
				this._getTokenList(num+1);
			}, 1500);
		}
	}
	

	static get styles() {
		return css`
			:host {
				display: block;
				width: 100%;
				height: 100%;
				position: absolute;
				inset: 0;
				pointer-events: none;
			}
			
			.font-family {
				user-select: none;
				font-family: var(--stxui-font-family);
			}

			/* 浏览器宽度小于 780px 时隐藏整个 div */
			@media (max-width: 780px) {
				:host {
					display: none !important;
				}
			}

			@keyframes bounceIn__modal123 {
				0%{transform:translate3d(0,-20px,0);opacity:0}
				to{transform:translateZ(0);opacity:1}
			}
			@keyframes modal-zoomIn {
				0% {
					animation-timing-function: cubic-bezier(0.42,0,0.58,1);
					opacity: 0.4;
					transform: scale(0.9);
				}
				100% {
					opacity: 1;
					transform: scale(1);
				}
			}

			.stxcom-home-tokens-bg {
				position: absolute;
				inset: 0;
				z-index: 1;
				width: 100%;
				height: 100%;

				--token-border-outer: rgba(2, 182, 166, 0.25);
				--token-border-inner: rgba(2, 182, 166, 0.5);
				--card-text: #1a202c;
				--color-success: #10b981;
				--color-danger: #ef4444;
				
				--card--price-text: #666;
				animation: modal-zoomIn 0.3s ease;
			}

			:host([theme="dark"]) .stxcom-home-tokens-bg {
				--token-border-outer: #00b3bc33;
				--token-border-inner: #009ca499;
				--card-text: #f8fafc;
				
				--card--price-text: #999;
				--color-danger: #ff4444;
				--color-success: #00ffab;
			}

			/* 悬浮代币节点项（专职负责平滑放大，不与位移动画冲突） */
			.token-item {
				position: absolute;
				pointer-events: auto;
				z-index: 2;
				filter: blur(5px) opacity(0.4);
				transition: filter 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), z-index 0.1s;
				transform: scale(1);
			}
			
			.is-mini{
				opacity: 0.4;
			}
			

			.token-item:hover {
				filter: blur(0px) opacity(1);
				transform: scale(1.18);
				z-index: 10;
				opacity: 1;
			}

			/* 浮动与微旋转动效 wrapper */
			.float-wrapper {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 100%;
				animation: token-float var(--float-dur) ease-in-out infinite alternate;
				animation-delay: var(--float-delay);
			}

			/* 代币 Icon 容器 */
			.icon-container {
				position: relative;
				width: 100%;
				height: 100%;
				border-radius: 50%;
				box-sizing: border-box;
				background-color: var(--stxui-theme-background-subcolor, #fff);
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
			}

			.icon-container img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				border-radius: 50%;
				user-select: none;
				-webkit-user-drag: none;
			}

			/* 双重高光边框 */
			.icon-container::before,
			.icon-container::after {
				content: '';
				position: absolute;
				border-radius: 50%;
				pointer-events: none;
				opacity: 0;
				transition: all 0.3s ease;
			}

			.icon-container::before {
				inset: -4px;
				border: 1.5px solid var(--token-border-inner);
			}

			.icon-container::after {
				inset: -9px;
				border: 1px solid var(--token-border-outer);
			}

			.token-item:hover .icon-container::before,
			.token-item:hover .icon-container::after {
				opacity: 1;
			}

			/* 代币信息文字卡片：无背景、无边框，显示在右侧并轻微倾斜 */
			.token-card {
				position: absolute;
				left: calc(100% + 10px);
				top: 50%;
				transform: translateY(-50%) rotate(8deg);
				transform-origin: left center;
				white-space: nowrap;
				pointer-events: none;
				opacity: 0;
				visibility: hidden;
				display: none;
				transition: opacity 0.25s ease, transform 0.25s ease;
				/*display: flex;*/
				flex-direction: column;
				gap: 1px;
			}

			.token-item:hover .token-card {
				display: flex;
				opacity: 1;
				visibility: visible;
				transform: translateY(-50%) rotate(8deg) scale(1.05);
			}

			.card-symbol-row {
				font-size: 12px;
				color: var(--card-text);
				line-height: 1.2;
			}

			.card-price-row {
				display: flex;
				/*flex-direction: column;*/
				align-items: center;
				gap: 4px;
				font-size: 10px;
				line-height: 1.2;
			}

			.card-price {
				color: var(--card--price-text);
			}

			.card-change-positive {
				color: var(--color-success);
			}

			.card-change-negative {
				color: var(--color-danger);
			}

			/* 上下飘浮 + 微旋转关键帧 */
			@keyframes token-float {
				0% {
					transform: translateY(0px) rotate(var(--init-rotate));
				}
				50% {
					transform: translateY(-8px) rotate(calc(var(--init-rotate) + 3deg));
				}
				100% {
					transform: translateY(6px) rotate(calc(var(--init-rotate) - 3deg));
				}
			}

			@media (prefers-reduced-motion: reduce) {
				.float-wrapper {
					animation: none !important;
				}
			}
		`;
	}

	// 格式化价格显示
	_formatPrice(priceStr) {
		/* const num = parseFloat(priceStr);
		if (isNaN(num)) return '$0.00';
		if (num >= 1000) return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		if (num < 0.01) return '$' + num.toFixed(4);
		return '$' + num.toFixed(2); */
		return `$${$app.formatBalance(priceStr)}`;
	}

	// 判断涨跌并返回对应样式类
	_isPositiveChange(changeStr) {
		if (!changeStr) return true;
		return !changeStr.includes('-');
	}

	render() {
		if(this.tokenList.length===0){
			return null;
		}
		return html`
			<div class="stxcom-home-tokens-bg">
				${this.tokenList.map((token, index) => {
					const cfg = this.layoutConfigs[index % this.layoutConfigs.length];
					const isPositive = this._isPositiveChange(token.change);
					return html`
						<div
							class="token-item ${this.mini?'is-mini':''}"
							style="
								left: ${cfg.x};
								top: ${cfg.y};
								width: ${cfg.size}px;
								height: ${cfg.size}px;
							"
						>
							<div
								class="float-wrapper"
								style="
									--float-dur: ${cfg.duration};
									--float-delay: ${cfg.delay};
									--init-rotate: ${cfg.rotate}deg;
								"
							>
								<!-- 图标容器（含双重边框） -->
								<div class="icon-container">
									<img
										src="${token.logourl}"
										loading="lazy"
										decoding="async"
									/>
									
									${token.chain ? html`
										<div style="position: absolute;bottom:-2px;right:-2px;z-index: 1;">
											<img style="width:18px;height:18px;border-radius: 100px;"
												src="${networkData[token.chain].logo}"
												loading="lazy"
												decoding="async"
											/>
										</div>
									` : ''}
									
								</div>

								<!-- 悬浮价格与涨幅卡片（无背景边框、右侧倾斜） -->
								<div class="token-card">
									<div class="card-symbol-row">
										<span class="font-family">${token.symbol}</span>
									</div>
									<div class="card-price-row">
										<span class="card-price font-family">${this._formatPrice(token.usd_sell)}</span>
										${token.change ? html`
											<span class="font-family ${isPositive ? 'card-change-positive' : 'card-change-negative'}">
												(${token.change})
											</span>
										` : ''}
									</div>
								</div>
							</div>
						</div>
					`;
				})}
			</div>
		`;
	}
}

if (!customElements.get('stxcom-home-tokens-bg')) {
	customElements.define('stxcom-home-tokens-bg', StxcomHomeTokensBg);
}