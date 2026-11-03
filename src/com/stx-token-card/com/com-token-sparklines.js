import { LitElement, html, css, svg } from 'lit';

// 纯逻辑函数：价格映射
const scaleYs = (value, min, max, height) => {
    if (max === min) return height / 2;
    // 留出上下 5px 的安全边距，防止线条贴边被切断
    const padding = 5;
    return (height - padding) - ((value - min) / (max - min)) * (height - padding * 2);
};

// 逻辑函数：波动高度适配
/* const calcAdaptiveHeight1 = (min, max, baseHeight = 100) => {
    const diff = max - min;
    const avg = (min + max) / 2;
    const percent = avg === 0 ? 0 : diff / avg;
	
	console.log(`percent`, percent, min, max);
	
	if (percent < 0.001) return baseHeight * 0.2; // <0.1% 的波动，非常平
	if (percent < 0.002) return baseHeight * 0.3; // <0.1% 的波动，非常平
	if (percent < 0.005) return baseHeight * 0.5; // <0.5%
	if (percent < 0.02) return baseHeight * 0.7; // <2%
    return baseHeight;
};
 */

/* const calcAdaptiveHeight1 = (min, max, baseHeight = 100) => {
	if (min === 0 && max === 0) return 0;
	const diff = max > min?max - min:min - max;
	//console.log(`baseHeight`, diff);
	if (diff < 0.002) return 15;
	if (diff < 0.05) return 20;
	if (diff < 0.08) return 25;
	if (diff < 0.12) return 30;
	if (diff < 0.3) return 40;
	if (diff < 0.8) return 60;
    return 91;
}; */
const calcAdaptiveHeight = (min, max, baseHeight = 100) => {
	if (min === 0 && max === 0) return 0;

	const diff = Math.abs(max - min);
	const avg = (min + max) / 2;

	// ⭐ 引入相对因子（关键）
	const relative = avg > 0 ? diff / avg : 0;

	// 混合权重（核心优化）
	const score = diff * 0.7 + relative * 0.3;

	// 分段（用 score 而不是 diff）
	if (score < 0.002) return 15;
	if (score < 0.01) return 20;
	if (score < 0.03) return 25;
	if (score < 0.08) return 30;
	if (score < 0.2) return 40;
	if (score < 0.5) return 60;

	return 91;
};

export class ComTokenSparklines extends LitElement {
    static properties = {
        prices: { type: Array },
        width: { type: Number },
        height: { type: Number }
    };

    static styles = css`
        :host {
            display: inline-block;
            vertical-align: middle;
        }
        svg {
            display: block;
        }
        .line-fill {
            fill-opacity: 0.4;
            stroke: none;
        }
        .line-stroke {
            fill: none;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
    `;

    constructor() {
        super();
        this.prices = [];
        this.width = 222;
        this.height = 138;
        // 随机 ID 防止多个组件 ID 冲突
        this._uid = Math.random().toString(36).substring(2, 8);
    }

    // 计算路径的核心逻辑
    _generatePaths() {
        if (!this.prices || this.prices.length < 2) return { line: '', area: '', color: '#e7e7eb' };

        const max = Math.max(...this.prices);
        const min = Math.min(...this.prices);
        const stepX = this.width / (this.prices.length - 1);
        const adaptiveHeight = calcAdaptiveHeight(min, max, parseInt(this.height * 0.66));
		//console.log(`adaptiveHeight`, adaptiveHeight);

        // 颜色逻辑
        let color = '#3ebe6a'; // 默认绿
        if (this.prices[this.prices.length - 1] < this.prices[0]) {
            color = '#ff000e'; // 跌红
        } else if (max === min) {
            //color = '#e7e7eb'; // 平盘灰
        }

        const points = this.prices.map((price, i) => ({
            x: i * stepX,
            y: scaleYs(price, min, max, adaptiveHeight)
        }));

        // 构建二次贝塞尔曲线
        let pathData = `M${points[0].x},${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const cx = (p0.x + p1.x) / 2;
            const cy = (p0.y + p1.y) / 2;
            pathData += ` Q${p0.x},${p0.y} ${cx},${cy}`;
        }
        pathData += ` T${points[points.length - 1].x},${points[points.length - 1].y}`;

        // 填充路径：从最后一点连线下到底部，再回到起点底部，最后闭合
        const areaData = `${pathData} L${this.width},${this.height} L0,${this.height} Z`;

        return { strokePath: pathData, fillPath: areaData, color };
    }

    render() {
        const { strokePath, fillPath, color } = this._generatePaths();
        const gradientId = `grad-${this._uid}`;
        const clipId = `clip-${this._uid}`;

        return html`
            <div style="width:${this.width}px; height:${this.height}px; position:relative;">
                <svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}">
                    <defs>
                        <clipPath id="${clipId}">
                            <rect width="${this.width}" height="${this.height}" x="0" y="0"></rect>
                        </clipPath>
                        <linearGradient id="${gradientId}" x1="0%" x2="0%" y1="0%" y2="100%">
                            <stop offset="0%" stop-color="${color}" stop-opacity="0.6"></stop>
                            <stop offset="66%" stop-color="${color}" stop-opacity="0.2"></stop>
                            <stop offset="100%" stop-color="${color}" stop-opacity="0.05"></stop>
                        </linearGradient>
                    </defs>
                    
                    <g clip-path="url(#${clipId})">
                        <path class="line-fill" d="${fillPath}" fill="url(#${gradientId})"></path>
                        <path class="line-stroke" d="${strokePath}" stroke="${color}"></path>
                    </g>
                </svg>
            </div>
        `;
    }
}
if (!customElements.get('com-token-sparklines')) {
	customElements.define('com-token-sparklines', ComTokenSparklines);
}
