import {
	LitElement,
	html,
	css
} from 'lit';

export class ComSlippagSlider extends LitElement {
	static get properties() {
		return {
			value: {
				type: Number,
				reflect: true
			},
			min: {
				type: Number
			},
			max: {
				type: Number
			},
			step: {
				type: Number
			}
		};
	}

	constructor() {
		super();
		this.value = 1;
		this.min = 1;
		this.max = 1000;
		this.step = 1;
	}

	// 内部事件处理：更新内部状态并向父组件派发事件
	_handleInput(e) {
		const input = e.target;
		this.value = Number(input.value);

		// 触发自定义事件，方便父组件监听 @slider-change
		this.dispatchEvent(new CustomEvent('slider-change', {
			detail: {
				value: this.value
			},
			bubbles: false,
			composed: false
		}));
	}

	static styles = css`
    :host {
      display: block;
      width: 100%;
      --thumb-size: 18px;
      --track-height: 6px;
      --primary-color: #02b6a6;
      --active-color: #009285;
      --track-color: #dddddd;
    }

    input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 30px; /* 增加点击热区 */
      background: transparent;
      outline: none;
      margin: 0;
      cursor: pointer;
    }

    /* --- Webkit (Chrome, Safari, Edge) 轨道 --- */
    input[type="range"]::-webkit-slider-runnable-track {
      background: var(--track-color);
      height: var(--track-height);
      border-radius: var(--track-height);
      transition: background 0.3s;
    }

    /* --- Webkit 滑块 --- */
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      /* 居中计算公式: (track_height / 2) - (thumb_height / 2) */
      margin-top: calc((var(--track-height) / 2) - (var(--thumb-size) / 2));
      background-color: var(--primary-color);
      height: var(--thumb-size);
      width: var(--thumb-size);
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      transition: transform 0.2s ease, background-color 0.2s;
    }

    /* --- Firefox 轨道 --- */
    input[type="range"]::-moz-range-track {
      background: var(--track-color);
      height: var(--track-height);
      border-radius: var(--track-height);
    }

    /* --- Firefox 滑块 --- */
    input[type="range"]::-moz-range-thumb {
      background-color: var(--primary-color);
      height: var(--thumb-size);
      width: var(--thumb-size);
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      transition: transform 0.2s ease;
      box-sizing: border-box;
    }

    /* 交互状态 */
    input[type="range"]:active::-webkit-slider-thumb {
		transform-origin: center center;
      transform: scale(1.15);
      background-color: var(--active-color);
    }
    
    input[type="range"]:active::-moz-range-thumb {
		transform-origin: center center;
      transform: scale(1.15);
      background-color: var(--active-color);
    }

    /* 聚焦状态（提高无障碍体验） */
    input[type="range"]:focus-visible::-webkit-slider-thumb {
      box-shadow: 0 0 0 3px rgba(2, 182, 166, 0.3);
    }
  `;

	render() {
		return html`
      <input
        .value="${this.value}" 
        min="${this.min}"
        max="${this.max}"
        step="${this.step}"
        type="range"
        @input="${this._handleInput}"
      />
    `;
	}
}
if (!customElements.get('com-slippag-slider')) {
	customElements.define('com-slippag-slider', ComSlippagSlider);
}
