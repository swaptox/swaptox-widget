
import {
	LitElement,
	html,
	css
} from 'lit';

import { $app } from '../../../js_sdk/index.js';
import { swaptoxLogo } from './swaptoxLogo';

export class StxcomHomeShowcase extends LitElement {
	static properties = {
		size: {
			type: String
		},
		theme: {
			type: String,
			reflect: true
		},
		protocol: {
			type: Array
		},
	};

	constructor() {
		super();
		this.size = '240px';
		this.theme = '';
		this.protocol = [];
	}

	static get styles() {
		return css`
			:host {
				display: block;
				width: 100%;
			}
			.stxcom-home-showcase {
				--showcase-size: 260px;
				--showcase-line: #64cfc7;
				--showcase-line-secondary: #8aaeff;
				--showcase-orbit: #b8e5e3;
				--showcase-center-bg: #ffffff;
				--showcase-node-bg: #ffffff;
				--showcase-border: rgba(68, 160, 180, .16);
				--showcase-shadow:
					0 3px 12px rgba(34, 93, 125, .10),
					0 0 2px rgba(34, 93, 125, .08);
				--pulse-color: 43, 183, 184;
				--orbit-duration: 50s;

				position: relative;
				isolation: isolate;
				width: var(--showcase-size);
				max-width: 100%;
				aspect-ratio: 1 / 1;
				margin-inline: auto;
				box-sizing: border-box;
			}
			
			.font-family {
				user-select: none;
				font-family: var(--stxui-font-family);
			}

			/* 外围旋转层：轨道、连线和协议节点同步旋转 */
			.orbit-layer {
				position: absolute;
				z-index: 5;
				inset: 0;
				overflow: visible;
				width: 100%;
				height: 100%;
				transform-origin: 50% 50%;
				animation:
					stxcom-orbit-spin
					var(--orbit-duration)
					linear infinite;
			}

			.network-svg {
				position: absolute;
				inset: 0;
				display: block;
				width: 100%;
				height: 100%;
				overflow: visible;
				pointer-events: none;
			}

			.orbit {
				fill: none;
				stroke: var(--showcase-orbit);
				stroke-width: 1.4;
				opacity: 1;
			}

			.orbit-outer {
				stroke-dasharray: 2 5;
				opacity: .95;
			}

			.connector {
				fill: none;
				stroke: url(#stxcom-showcase-line-gradient);
				stroke-width: 1.6;
				stroke-linecap: round;
				opacity: .9;
			}

			.connector-dot {
				fill: var(--showcase-line);
				opacity: .8;
			}

			/* 外围协议节点 */
			.protocol-node {
				position: absolute;
				z-index: 2;
				width: 48px;
				height: 48px;
				box-sizing: border-box;
				transform: translate(-50%, -50%);
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				border: 1px solid var(--showcase-border);
				background: var(--showcase-node-bg);
				box-shadow: var(--showcase-shadow);
				transition:
					box-shadow .25s ease,
					border-color .25s ease;
			}

			.protocol-node::before {
				content: '';
				position: absolute;
				inset: 3px;
				border: 1px solid rgba(91, 184, 185, .08);
				border-radius: inherit;
				pointer-events: none;
			}

			/* Logo 反向旋转，抵消轨道旋转 */
			.protocol-node div {
				display: block;
				width: 34px;
				height: 34px;
				max-width: 100%;
				max-height: 100%;
				object-fit: contain;
				border-radius: 50%;
				transform-origin: center;
				animation:
					stxcom-logo-counter-spin
					var(--orbit-duration)
					linear infinite;
				user-select: none;
				-webkit-user-drag: none;
			}

			.protocol-node:hover {
				z-index: 4;
				border-color: rgba(39, 182, 174, .45);
				box-shadow:
					0 0 0 4px rgba(39, 182, 174, .07),
					0 5px 15px rgba(34, 93, 125, .14);
			}

			.protocol-node div img {
				transition:
					transform .25s ease;
			}
			.protocol-node:hover > div > img {
				/*zoom: 1.08;*/
				transform:scale(1.08);
				transform-origin: center center;
			}

			/*
			 * 协议名称：
			 * 每个节点使用独立关键帧动态改变 left/top。
			 * 不旋转文字本身，避免文字倒置。
			 */
			.protocol-node div .protocol-name {
				position: absolute;
				z-index: 20;
				left: 50%;
				top: 50%;
				width: max-content;
				max-width: 120px;
				padding: 4px 7px;
				box-sizing: border-box;
				border: 1px solid var(--showcase-border);
				border-radius: 10px;
				background: var(--showcase-node-bg);
				box-shadow: var(--showcase-shadow);
				color: var(--showcase-text, #111);
				font-size: 12px;
				line-height: 16px;
				white-space: nowrap;
				transform: translate(-50%, -50%);
				visibility: hidden;
				opacity: 0;/**/
				pointer-events: none;
				/*animation: none;*/
				
				transition:
					opacity .2s ease,
					visibility .2s ease;
			}

			.protocol-node:hover > div > .protocol-name {
				visibility: visible;
				opacity: 1;
			}

			:host([theme="dark"]) .protocol-node div .protocol-name {
				--showcase-text: #f3f6ff;
			}

			/* 名称动画与轨道使用相同周期 */
			.protocol-node .protocol-name {
				animation-duration: var(--orbit-duration);
				animation-timing-function: linear;
				animation-iteration-count: infinite;
				animation-fill-mode: both;
			}

			/* 悬停时轨道、Logo、名称动画全部暂停 */
			.orbit-layer:has(.protocol-node:hover),
			.orbit-layer:has(.protocol-node:hover) .protocol-node div,
			.orbit-layer:has(.protocol-node:hover) .protocol-node div .protocol-name {
				animation-play-state: paused;
			}

			/* 中心品牌节点 */
			.applogo-bg-body {
				position: absolute;
				z-index: 3;
				left: 50%;
				top: 50%;
				width: 74px;
				height: 74px;
				box-sizing: border-box;
				transform: translate(-50%, -50%);
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				border: 1px solid var(--showcase-border);
				background:
					radial-gradient(
						circle at 35% 25%,
						#ffffff 0%,
						var(--showcase-center-bg) 75%
					);
				box-shadow:
					0 0 0 6px rgba(var(--pulse-color), .055),
					0 0 0 12px rgba(var(--pulse-color), .025),
					0 5px 18px rgba(36, 100, 125, .13);
			}

			.applogo-bg-body > * {
				width: 48px;
				height: 48px;
				max-width: 80%;
				max-height: 80%;
			}

			/* 中心脉冲波 */
			.applogo-bg-body::before,
			.applogo-bg-body::after {
				content: '';
				position: absolute;
				inset: -4px;
				border: 4px solid rgba(var(--pulse-color), 0);
				border-radius: 50%;
				pointer-events: none;
				z-index: -1;
				animation:
					stxcom-pulse-expand
					3.6s
					ease-out
					infinite;
			}

			.applogo-bg-body::after {
				animation-delay: 1.8s;
			}

			/* 深色主题 */
			:host([theme="dark"]) .stxcom-home-showcase {
				--showcase-line: #39d8ee;
				--showcase-line-secondary: #7185ff;
				--showcase-orbit: #285486;
				--showcase-center-bg: #101b35;
				--showcase-node-bg: #111d35;
				--showcase-border: rgba(92, 164, 255, .24);
				--showcase-shadow:
					0 3px 12px rgba(0, 0, 0, .22),
					0 0 12px rgba(32, 133, 255, .08);
				--pulse-color: 57, 216, 238;
			}

			:host([theme="dark"]) .applogo-bg-body {
				background:
					radial-gradient(
						circle at 35% 25%,
						#1a2b49 0%,
						#101b35 75%
					);
				box-shadow:
					0 0 0 6px rgba(var(--pulse-color), .08),
					0 0 0 12px rgba(var(--pulse-color), .035),
					0 5px 20px rgba(0, 0, 0, .3);
			}

			@keyframes stxcom-orbit-spin {
				from {
					transform: rotate(0deg);
				}
				to {
					transform: rotate(360deg);
				}
			}

			@keyframes stxcom-logo-counter-spin {
				from {
					transform: rotate(0deg);
				}
				to {
					transform: rotate(-360deg);
				}
			}

			@keyframes stxcom-pulse-expand {
				0% {
					transform: scale(.9);
					opacity: 0;
					border-width: 0;
					border-color: rgba(var(--pulse-color), .5);
				}
				28% {
					transform: scale(1);
					opacity: .65;
					border-width: 4px;
					border-color: rgba(var(--pulse-color), .5);
				}
				100% {
					transform: scale(1.8);
					opacity: 0;
					border-width: 1px;
					border-color: rgba(var(--pulse-color), .5);
				}
			}

			@media (prefers-reduced-motion: reduce) {
				.orbit-layer,
				.protocol-node div,
				.applogo-bg-body::before,
				.applogo-bg-body::after {
					animation: none !important;
				}

				.protocol-node div .protocol-name {
					animation: none !important;
					transition: none !important;
				}
			}
		`;
	}

	_getProtocols() {
		if(this._rendered){
			return this._rendered;
		}
		if(this.protocol.length>0){
			this._rendered = $app.shuffleArray(this.protocol).slice(0, 10);
			return this._rendered;
		}
		return [
			{
				name: 'Aerodrome',
				logo: 'https://cdn.swaptox.com/logo/pool/aerodrome.jpeg'
			},
			{
				name: 'Balancer',
				logo: 'https://cdn.swaptox.com/logo/pool/balancer-v2.png'
			},
			{
				name: 'Elk Finance',
				logo: 'https://cdn.swaptox.com/logo/pool/elk-finance.jpg'
			},
			{
				name: 'PancakeSwap',
				logo: 'https://cdn.swaptox.com/logo/pool/pancakev2.jpeg'
			},
			{
				name: 'Sovryn',
				logo: 'https://cdn.swaptox.com/logo/pool/sovryn_logo_orange.png'
			},
			{
				name: 'Uniswap V2',
				logo: 'https://cdn.swaptox.com/logo/pool/uniswapv2.jpeg'
			},
			{
				name: 'Uniswap V3',
				logo: 'https://cdn.swaptox.com/logo/pool/uniswapv3.jpeg'
			},
			{
				name: 'Protocol 8',
				logo: 'https://cdn.swaptox.com/logo/pool/vj5DIMhP_400x400.jpeg'
			},
			{
				name: 'WoodSwap',
				logo: 'https://cdn.swaptox.com/logo/pool/wood-swap.png'
			},
			{
				name: 'Protocol 10',
				logo: 'https://cdn.swaptox.com/logo/pool/2048x2048_Logo.png'
			}
		];
	}

	_getLayout(protocols) {
		const center = 130;
		const orbitRadius = 103;
		const centerRadius = 41;
		const nodeRadius = 24;

		return protocols.map((protocol, index) => {
			const angleDeg =
				-90 + index * 360 / protocols.length;
			const angle = angleDeg * Math.PI / 180;

			const ux = Math.cos(angle);
			const uy = Math.sin(angle);

			const x = center + orbitRadius * ux;
			const y = center + orbitRadius * uy;

			const x1 = center + centerRadius * ux;
			const y1 = center + centerRadius * uy;

			const x2 = x - nodeRadius * ux;
			const y2 = y - nodeRadius * uy;

			return {
				...protocol,
				x,
				y,
				angle,
				angleDeg,
				path: `M ${x1} ${y1} L ${x2} ${y2}`,
				dotX: center + (x1 - center + x2 - x1) * .48,
				dotY: center + (y1 - center + y2 - y1) * .48,
				index
			};
		});
	}

	/*
	 * 为每个协议名称生成独立的定位关键帧。
	 * 通过 left/top 改变位置，不旋转文字本身。
	 */
	_getLabelAnimationStyles(protocols) {
		const durationSamples = 72;
		const center = 17;
		const nodeRadius = 24;
		const gap = 2;//名称与logo的边距
		const styles = [];

		for (const item of protocols) {
			const textWidth = Math.min(
				120,
				Math.max(36, item.name.length * 7 + 16)
			);

			const sideDistance = nodeRadius + gap + textWidth / 2;
			const verticalDistance = nodeRadius + gap + 12;
			const frames = [];

			for (let step = 0; step <= durationSamples; step++) {
				const progress = step / durationSamples;
				const orbitAngle = progress * Math.PI * 2;
				const angle = item.angle + orbitAngle;

				const cos = Math.cos(angle);
				const sin = Math.sin(angle);

				/*
				 * 水平方向占比。
				 * 靠近左右两侧时，文字放在节点侧面；
				 * 靠近顶部/底部时，文字移动到节点上下方。
				 */
				const blend = Math.max(
					0,
					Math.min(1, (Math.abs(cos) - .18) / .42)
				);

				const horizontalX =
					Math.sign(cos || 1) * sideDistance;
				const horizontalY = sin * 13;

				const verticalX = cos * 13;
				const verticalY =
					Math.sign(sin || 1) * verticalDistance;

				const x =
					horizontalX * blend +
					verticalX * (1 - blend);

				const y =
					horizontalY * blend +
					verticalY * (1 - blend);

				const percent = (progress * 100)
					.toFixed(3)
					.replace(/\.?0+$/, '');

				frames.push(
					`${percent}% { left: ${center + x}px; top: ${center + y}px; }`
				);
			}

			styles.push(
				`@keyframes stxcom-label-position-${item.index} { ${frames.join(' ')} }`
			);
		}
		return styles.join('\n');
	}

	render() {
		const protocols = this._getLayout(
			this._getProtocols()
		);

		return html`
			<style>
				${this._getLabelAnimationStyles(protocols)}
			</style>

			<div
				class="stxcom-home-showcase"
				style="--showcase-size: ${this.size || '260px'};"
				role="img"
				aria-label="SwaptoX liquidity network"
			>
				<div class="orbit-layer">
					<svg
						class="network-svg"
						viewBox="0 0 260 260"
						preserveAspectRatio="xMidYMid meet"
						aria-hidden="true"
					>
						<defs>
							<linearGradient
								id="stxcom-showcase-line-gradient"
								x1="0"
								y1="0"
								x2="1"
								y2="1"
							>
								<stop
									offset="0%"
									stop-color="var(--showcase-line)"
								/>
								<stop
									offset="100%"
									stop-color="var(--showcase-line-secondary)"
								/>
							</linearGradient>
						</defs>

						<circle
							class="orbit"
							cx="130"
							cy="130"
							r="87"
						/>

						<circle
							class="orbit orbit-outer"
							cx="130"
							cy="130"
							r="103"
						/>

						<g>
							${protocols.map(item => html`
								<path
									class="connector"
									d="${item.path}"
								/>
							`)}
						</g>

						<g>
							${protocols.map(item => html`
								<circle
									class="connector-dot"
									cx="${item.dotX}"
									cy="${item.dotY}"
									r="1.6"
								/>
							`)}
						</g>
					</svg>

					<!-- 外围协议 Logo -->
					${protocols.map(item => html`
						<div
							class="protocol-node"
							style="
								left: ${item.x / 260 * 100}%;
								top: ${item.y / 260 * 100}%;
							"
						>
							<div
								style="
									position: relative;
									width: 34px;
									height: 34px;
								"
							>
								<img
									style="border-radius: 50%;"
									src="${item.logo}"
									width="34"
									height="34"
									loading="eager"
									decoding="async"
									draggable="false"
								/>

								<span
									class="font-family protocol-name pool${item.index}"
									style="
										animation-name:
											stxcom-label-position-${item.index};
									"
								>
									${item.name}
								</span>
							</div>
						</div>
					`)}
				</div>

				<!-- 中心品牌固定，不跟随外围旋转 -->
				<div class="applogo-bg-body">
					${swaptoxLogo()}
				</div>
			</div>
		`;
	}
}

if (!customElements.get('stxcom-home-showcase')) {
	customElements.define(
		'stxcom-home-showcase',
		StxcomHomeShowcase
	);
}
