

import { appInfo } from '../app-config.js';
import { networkData } from '../network-data.js';
//import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
//import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@12/dist/mermaid.esm.min.mjs';



/* import mermaid from 'mermaid';
mermaid.initialize({
	startOnLoad: false,//页面启动还要询价才触发，所以不用马上加载
	htmlLabels: true,//用于设置是否使用 HTML
	theme: 'neutral',
	suppressErrorRendering: true,//关闭HTML错误渲染
	
	securityLevel: 'loose',//允许在文本中使用HTML标签，并启用点击功能
	flowchart: { useMaxWidth: true, curve: 'basis'},
	
	themeCSS: `
	    .labelBkg {
	        background-color: transparent !important;
	    }
		.pool-name-css{
			color: var(--stxui-theme-font-color, #111);
		}
	`,
	themeVariables: {
		// 全局
		fontFamily: 'var(--stxui-font-family)',
		fontSize: '16px',
		
		// 箭头文字
		edgeLabelBackground: '#ffffff00',
		textColor: '#64748b00',
		
		// 线路
		lineColor: "#64748b00",
		defaultLinkColor: "#64748b00",
	}
}); */



let mermaidLoadingPromise = null;

async function loadMermaid() {
    // 如果全局已经有了，直接返回
    if (window.mermaid) {
        return window.mermaid;
    }

    // 如果正在加载中，返回之前的 Promise
    if (mermaidLoadingPromise) {
        return mermaidLoadingPromise;
    }

    // 开始动态创建 script 标签引入 CDN
    mermaidLoadingPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        // 使用 UMD 版本的 CDN，加载后会自动挂载到 window.mermaid
        script.src = 'https://cdn.jsdelivr.net/npm/mermaid@12/dist/mermaid.min.js';
        script.async = true;
        
        script.onload = () => {
            resolve(window.mermaid);
        };
        script.onerror = (err) => {
            mermaidLoadingPromise = null; // 失败重置
            reject(err);
        };

        document.head.appendChild(script);
    });

    return mermaidLoadingPromise;
}




loadMermaid();
let _mermaid = null;
async function renderChart() {
	if(_mermaid) return _mermaid;
    const mermaid = await loadMermaid();
	mermaid.initialize({
		startOnLoad: false,//页面启动还要询价才触发，所以不用马上加载
		htmlLabels: true,//用于设置是否使用 HTML
		theme: 'neutral',
		suppressErrorRendering: true,//关闭HTML错误渲染
		
		securityLevel: 'loose',//允许在文本中使用HTML标签，并启用点击功能
		flowchart: { useMaxWidth: true, curve: 'basis'},
		
		themeCSS: `
		    .labelBkg {
		        background-color: transparent !important;
		    }
			.pool-name-css{
				color: var(--stxui-theme-font-color, #111);
			}
		`,
		themeVariables: {
			// 全局
			fontFamily: 'var(--stxui-font-family)',
			fontSize: '16px',
			
			// 箭头文字
			edgeLabelBackground: '#ffffff00',
			textColor: '#64748b00',
			
			// 线路
			lineColor: "#64748b00",
			defaultLinkColor: "#64748b00",
		}
	});
	_mermaid = mermaid;
    return _mermaid;
}









const ___A = '--->';


const _poolLogoSize = '24';
const _buildPoolLogo = function(url = ''){
	return `<img src='${url}' width="${_poolLogoSize}" style='border-radius:100px;height:${_poolLogoSize}px;width:${_poolLogoSize}px;max-width:${_poolLogoSize}px;min-width:${_poolLogoSize}px;overflow:hidden;' />`;
};

const _buildPoolDiv = function(obj){
	return `<div style="display:flex;flex-direction:row;align-items:center;column-gap:5px;">${_buildPoolLogo(obj.poolLogo)}<span class="pool-name-css" style="font-size:18px;padding-right:5px;white-space:nowrap;">${obj.poolName}</span></div><div style="font-size:14px;color:#999;padding-right:5px;white-space:nowrap;">${obj.inName} → ${obj.outName}</div>`;
};

const _poolRadius = '18';
const _buildSvgRoutes = function(index, name, routeData, protocol, tokenObj){
	const mianRoute = routeData.routes;
	
	
	let itemStroke = '#99999900';
	let itemFill = '#ffffff01';
	
	
	
	let graphDefinition = ``;
	
	if(mianRoute.length===1){
		const rData_1 = mianRoute[0];
		
		const rId_1 = `${rData_1.protocol_id}-${rData_1.version}`;
		const tData_1 = {
			poolName: protocol?.[rId_1]?.name||'',
			poolLogo: protocol?.[rId_1]?.logo||'',
			inName: tokenObj?.[rData_1.tokenIn.toLowerCase()]?.symbol||'',
			outName: tokenObj?.[rData_1.tokenOut.toLowerCase()]?.symbol||'',
		};
		
		
		//click Split-${index}-0 "https://www.github.com" _blank
		
		graphDefinition += `
			Split-${index}-0(${_buildPoolDiv(tData_1)})
			${name} ${___A}|${rData_1.percent}%| Split-${index}-0
			
			style Split-${index}-0 fill:${itemFill},stroke:${itemStroke},rx:${_poolRadius},ry:${_poolRadius},filter:none
		
			
		
		`;
	}else if(mianRoute.length===2){
		const rData_1 = mianRoute[0];
		
		const rId_1 = `${rData_1.protocol_id}-${rData_1.version}`;
		const tData_1 = {
			poolName: protocol?.[rId_1]?.name||'',
			poolLogo: protocol?.[rId_1]?.logo||'',
			inName: tokenObj?.[rData_1.tokenIn.toLowerCase()]?.symbol||'',
			outName: tokenObj?.[rData_1.tokenOut.toLowerCase()]?.symbol||'',
		};
		
		const rData_2 = mianRoute[1];
		
		const rId_2 = `${rData_2.protocol_id}-${rData_2.version}`;
		const tData_2 = {
			poolName: protocol?.[rId_2]?.name||'',
			poolLogo: protocol?.[rId_2]?.logo||'',
			inName: tokenObj?.[rData_2.tokenIn.toLowerCase()]?.symbol||'',
			outName: tokenObj?.[rData_2.tokenOut.toLowerCase()]?.symbol||'',
		};
		
		
		graphDefinition += `
			Split-${index}-0(${_buildPoolDiv(tData_1)})
			${name} ${___A}|${rData_1.percent}%| Split-${index}-0
			
			Split-${index}-1(${_buildPoolDiv(tData_2)})
			Split-${index}-0 ${___A}|${rData_2.percent}%| Split-${index}-1
			
			style Split-${index}-0 fill:${itemFill},stroke:${itemStroke},rx:${_poolRadius},ry:${_poolRadius},filter:none
			style Split-${index}-1 fill:${itemFill},stroke:${itemStroke},rx:${_poolRadius},ry:${_poolRadius},filter:none
		`;
	}else if(mianRoute.length===3){
		const rData_1 = mianRoute[0];
		
		const rId_1 = `${rData_1.protocol_id}-${rData_1.version}`;
		const tData_1 = {
			poolName: protocol?.[rId_1]?.name||'',
			poolLogo: protocol?.[rId_1]?.logo||'',
			inName: tokenObj?.[rData_1.tokenIn.toLowerCase()]?.symbol||'',
			outName: tokenObj?.[rData_1.tokenOut.toLowerCase()]?.symbol||'',
		};
		
		
		const rData_2 = mianRoute[1];
		
		const rId_2 = `${rData_2.protocol_id}-${rData_2.version}`;
		const tData_2 = {
			poolName: protocol?.[rId_2]?.name||'',
			poolLogo: protocol?.[rId_2]?.logo||'',
			inName: tokenObj?.[rData_2.tokenIn.toLowerCase()]?.symbol||'',
			outName: tokenObj?.[rData_2.tokenOut.toLowerCase()]?.symbol||'',
		};
		
		
		const rData_3 = mianRoute[2];
		
		const rId_3 = `${rData_3.protocol_id}-${rData_3.version}`;
		const tData_3 = {
			poolName: protocol?.[rId_3]?.name||'',
			poolLogo: protocol?.[rId_3]?.logo||'',
			inName: tokenObj?.[rData_3.tokenIn.toLowerCase()]?.symbol||'',
			outName: tokenObj?.[rData_3.tokenOut.toLowerCase()]?.symbol||'',
		};
		
		
		graphDefinition += `
			Split-${index}-0(${_buildPoolDiv(tData_1)})
			${name} ${___A}|${rData_1.percent}%| Split-${index}-0
			
			Split-${index}-1(${_buildPoolDiv(tData_2)})
			Split-${index}-0 ${___A}|${rData_2.percent}%| Split-${index}-1
			
			Split-${index}-2(${_buildPoolDiv(tData_3)})
			Split-${index}-1 ${___A}|${rData_3.percent}%| Split-${index}-2
			
			style Split-${index}-0 fill:${itemFill},stroke:${itemStroke},rx:${_poolRadius},ry:${_poolRadius},filter:none
			style Split-${index}-1 fill:${itemFill},stroke:${itemStroke},rx:${_poolRadius},ry:${_poolRadius},filter:none
			style Split-${index}-2 fill:${itemFill},stroke:${itemStroke},rx:${_poolRadius},ry:${_poolRadius},filter:none
		`;
	}
	
	
	
	
	const subRoutes = routeData.subRoutes;
	if(subRoutes.length===0){
		graphDefinition += `
			Split-${index}-${mianRoute.length-1} ${___A}|100%| Output
		`;
		return graphDefinition;
	}
	
	
	for(let i = 0; i < subRoutes.length; i++){
		graphDefinition += _buildSvgRoutes(`${index}-${i}`, `Split-${index}-${mianRoute.length-1}`, subRoutes[i], protocol, tokenObj);
	}
	
	
	return graphDefinition;
};

function replaceSvgColorVariables(svg, colorMap) {
	
	if (
		typeof svg !== "string" ||
		!svg ||
		!colorMap ||
		typeof colorMap !== "object"
	) {
		return svg;
	}

	return svg.replace(
		/#[0-9a-fA-F]{8}(?![0-9a-fA-F])/g,
		match => {

			return typeof colorMap[match] === "string"
				? colorMap[match]
				: match;
		}
	);
}


function ensureXlinkNamespace(svgString) {

	const XLINK_NS =
		"http://www.w3.org/1999/xlink";


	/*
	 * 已经存在 xmlns:xlink：
	 * 不需要处理。
	 */
	if (
		/\bxmlns:xlink\s*=/.test(
			svgString
		)
	) {
		return svgString;
	}


	/*
	 * 给最外层 <svg> 添加 namespace。
	 */
	return svgString.replace(
		/^(\s*<svg\b)/i,
		`$1 xmlns:xlink="${XLINK_NS}"`
	);
}
function ensureSvgNamespaces(svgString) {

	const svgTagMatch =
		svgString.match(
			/<svg\b[^>]*>/i
		);

	if (!svgTagMatch) {
		return svgString;
	}


	const svgTag =
		svgTagMatch[0];


	/*
	 * 已经存在：
	 *
	 * xmlns:xlink="..."
	 *
	 * 不修改。
	 */
	if (
		/\bxmlns:xlink\s*=/.test(
			svgTag
		)
	) {
		return svgString;
	}


	/*
	 * 没有 xmlns:xlink：
	 *
	 * 加到 <svg> 标签中。
	 */
	const newSvgTag =
		svgTag.replace(
			/^<svg\b/i,
			'<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
		);


	return svgString.replace(
		svgTag,
		newSvgTag
	);
}




function replaceTokenImageShape(svgString, tokenImages) {

	/*
	 * Mermaid 的 foreignObject 里面可能存在 HTML 风格的 <img>
	 *
	 * HTML:
	 *   <img src="xxx">
	 *
	 * XML:
	 *   <img src="xxx" />
	 *
	 * image/svg+xml parser 要求 XML 格式，
	 * 所以先把没有自闭合的 img 修正。
	 */
	svgString = svgString.replace(
		/<img\b([^>]*?)(?<!\/)>/gi,
		"<img$1 />"
	);

	////ensureXlinkNamespace
	svgString = ensureSvgNamespaces(
		svgString
	);


	const parser = new DOMParser();

	const doc = parser.parseFromString(
		svgString,
		"image/svg+xml"
	);


	const parserError =
		doc.querySelector("parsererror");

	if (parserError) {

		console.error(
			"SVG parse error:",
			parserError.textContent
		);

		throw new Error(
			"Invalid SVG XML"
		);
	}


	const NS =
		"http://www.w3.org/2000/svg";


	/*
	 * Mermaid 生成的 image node：
	 *
	 * swaptox-route-flowchart-A888-7
	 *
	 * 最终得到：
	 *
	 * A888
	 */
	const nodes =
		doc.querySelectorAll(
			"g.image-shape[id]"
		);


	nodes.forEach(node => {

		const fullId =
			node.getAttribute("id");

		if (!fullId) {
			return;
		}


		const prefix =
			"swaptox-route-flowchart-";


		if (!fullId.startsWith(prefix)) {
			return;
		}


		const tempId =
			fullId.slice(
				prefix.length
			);


		/*
		 * A888-7
		 * A9-3
		 * Output-6
		 *
		 * ->
		 *
		 * A888
		 * A9
		 * Output
		 */
		const match =
			tempId.match(
				/^(.+)-\d+$/
			);


		if (!match) {
			return;
		}


		const nodeId =
			match[1];


		/*
		 * 不在 tokenImages 中：
		 *
		 * 直接跳过。
		 *
		 * 因此其他 image-shape 完全不会被修改。
		 */
		if (
			!Object.prototype.hasOwnProperty.call(
				tokenImages,
				nodeId
			)
		) {
			return;
		}


		const imageUrl =
			tokenImages[nodeId];


		/*
		 * 没有 URL 也不处理。
		 */
		if (
			typeof imageUrl !== "string" ||
			!imageUrl
		) {
			return;
		}


		const image =
			node.querySelector("image");


		if (!image) {
			return;
		}


		/*
		 * Mermaid 当前图片尺寸。
		 *
		 * 例如：
		 *
		 * width="68"
		 * height="68"
		 *
		 * radius = 34
		 *
		 * 不再写死 30。
		 */
		const width =
			Number(
				image.getAttribute("width")
			) || 60;


		const height =
			Number(
				image.getAttribute("height")
			) || width;


		const radius =
			Math.min(
				width,
				height
			) / 2;


		/*
		 * =========================
		 * 1. 替换真实 Token Logo
		 * =========================
		 *
		 * Mermaid 原来使用的是：
		 *
		 * data:image/png;base64,...
		 *
		 * 现在才替换成真实 URL。
		 *
		 * 这样远程 Logo 加载失败不会影响
		 * Mermaid 前面的布局阶段。
		 */
		image.setAttribute(
			"href",
			imageUrl
		);


		/*
		 * 某些 SVG 环境仍然使用 xlink:href，
		 * 如果存在的话一起更新。
		 */
		if (
			image.hasAttribute(
				"xlink:href"
			)
		) {
			image.setAttributeNS(
				"http://www.w3.org/1999/xlink",
				"xlink:href",
				imageUrl
			);
		}


		/*
		 * =========================
		 * 2. 创建圆形 clipPath
		 * =========================
		 */
		let defs =
			node.querySelector(
				":scope > defs"
			);


		if (!defs) {

			defs =
				doc.createElementNS(
					NS,
					"defs"
				);

			node.insertBefore(
				defs,
				node.firstChild
			);
		}


		const clipId =
			`swaptox-token-clip-${nodeId}`;


		/*
		 * 防止函数重复执行。
		 */
		const oldClip =
			doc.getElementById(
				clipId
			);


		if (oldClip) {
			oldClip.remove();
		}


		const clipPath =
			doc.createElementNS(
				NS,
				"clipPath"
			);


		clipPath.setAttribute(
			"id",
			clipId
		);


		/*
		 * 非常重要：
		 *
		 * objectBoundingBox
		 *
		 * 这样 circle 的：
		 *
		 * 0.5 / 0.5 / 0.5
		 *
		 * 是相对于 image 自己的 bounding box，
		 * 不会受到：
		 *
		 * transform="translate(-34,-34)"
		 *
		 * 影响。
		 */
		clipPath.setAttribute(
			"clipPathUnits",
			"objectBoundingBox"
		);


		const circle =
			doc.createElementNS(
				NS,
				"circle"
			);


		circle.setAttribute(
			"cx",
			"0.5"
		);

		circle.setAttribute(
			"cy",
			"0.5"
		);

		circle.setAttribute(
			"r",
			"0.5"
		);


		clipPath.appendChild(
			circle
		);

		defs.appendChild(
			clipPath
		);


		/*
		 * =========================
		 * 3. 应用圆形裁剪
		 * =========================
		 */
		image.setAttribute(
			"clip-path",
			`url(#${clipId})`
		);


		image.setAttribute(
			"preserveAspectRatio",
			"xMidYMid slice"
		);


		/*
		 * =========================
		 * 4. 隐藏原来的方形背景
		 * =========================
		 *
		 * Mermaid image-shape 默认会生成：
		 *
		 * <path d="M-34 -34 ...">
		 *
		 * 这个方形背景需要去掉。
		 */
		const paths =
			node.querySelectorAll(
				":scope > g > path"
			);


		if (paths.length >= 1) {

			paths[0].setAttribute(
				"fill",
				"none"
			);

			paths[0].setAttribute(
				"stroke",
				"none"
			);
		}


		/*
		 * =========================
		 * 5. 把方形边框改成圆形
		 * =========================
		 */
		if (paths.length >= 2) {

			const borderPath =
				paths[1];


			borderPath.setAttribute(
				"d",
				[
					`M 0 ${-radius}`,
					`A ${radius} ${radius} 0 1 1 0 ${radius}`,
					`A ${radius} ${radius} 0 1 1 0 ${-radius}`,
					"Z"
				].join(" ")
			);


			borderPath.setAttribute(
				"fill",
				"none"
			);


			borderPath.setAttribute(
				"stroke",
				"#99999900"
			);


			borderPath.setAttribute(
				"stroke-width",
				"1.3"
			);
		}

	});


	return new XMLSerializer()
		.serializeToString(doc);
}








function ensureMermaidRenderStyle(renderId) {

    const styleId = 'swaptox-mermaid-render-style';

    let style = document.getElementById(styleId);

    if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        document.head.appendChild(style);
    }

    style.textContent = `
        #d${CSS.escape(renderId)} {
            position: absolute !important;
            height: 0 !important;
			min-width: 700px !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }
    `;
}


const isTouchDevice = false//'ontouchstart' in window || navigator.maxTouchPoints > 0;


let imgPlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAALSURBVBhXY2BABwAAEgABp3qZbgAAAABJRU5ErkJggg==';
export async function getRouteTrend(chain, tokenIn, tokenOut, routeData, protocol, tokenObj){
	const nativeToken = networkData[chain].nativeToken.native;
	const wrappedToken = networkData[chain].nativeToken.wrapped;
	
	
	protocol['0-0'] = appInfo;
	
	const shengming = isTouchDevice?'TB':'LR';
	
	let tokenLOGOS = {
		Input: tokenObj?.[tokenIn.toLowerCase()]?.logourl||imgPlaceholder,
		Output: tokenObj?.[tokenOut.toLowerCase()]?.logourl||imgPlaceholder,
	};
	let graphDefinition = '';
	if((tokenIn===nativeToken||tokenIn===wrappedToken)&&(tokenOut===nativeToken||tokenOut===wrappedToken)){
		graphDefinition = `
			graph ${shengming}
				Input@{img: "${imgPlaceholder}", pos: "b", w: 68, h: 68, constraint: "on"}
				Output@{img: "${imgPlaceholder}", pos: "b", w: 68, h: 68, constraint: "on"}
		`;
	}else if(tokenIn===nativeToken){
		graphDefinition = `
			graph ${shengming}
				NativeInput@{img: "${imgPlaceholder}", pos: "b", w: 68, h: 68, constraint: "on"}
				NativeInput ${___A}|100%| Input
				Input@{img: "${imgPlaceholder}", pos: "b", w: 68, h: 68, constraint: "on"}
				Output@{img: "${imgPlaceholder}", pos: "b", w: 68, h: 68, constraint: "on"}
		`;
		tokenLOGOS = {
			NativeInput: tokenObj?.[nativeToken.toLowerCase()]?.logourl||imgPlaceholder,
			Input: tokenObj?.[wrappedToken.toLowerCase()]?.logourl||imgPlaceholder,
			Output: tokenObj?.[tokenOut.toLowerCase()]?.logourl||imgPlaceholder,
		};
	}else if(tokenOut===nativeToken){
		graphDefinition = `
			graph ${shengming}
				Input@{img: "${imgPlaceholder}", pos: "b", w: 68, h: 68, constraint: "on"}
				Output@{img: "${imgPlaceholder}", pos: "b", w: 68, h: 68, constraint: "on"}
				NativeOutput@{img: "${imgPlaceholder}", pos: "b", w: 68, h: 68, constraint: "on"}
				Output ${___A}|100%| NativeOutput
		`;
		tokenLOGOS = {
			NativeOutput: tokenObj?.[nativeToken.toLowerCase()]?.logourl||imgPlaceholder,
			Input: tokenObj?.[tokenIn.toLowerCase()]?.logourl||imgPlaceholder,
			Output: tokenObj?.[wrappedToken.toLowerCase()]?.logourl||imgPlaceholder,
		};
	}else{
		graphDefinition = `
			graph ${shengming}
				Input@{img: "${imgPlaceholder}", pos: "b", w: 68, h: 68, constraint: "on"}
				Output@{img: "${imgPlaceholder}", pos: "b", w: 68, h: 68, constraint: "on"}
		`;
	}
	
	
	for(let i = 0; i < routeData.length; i++){
		graphDefinition += _buildSvgRoutes(`${i}`, 'Input', routeData[i], protocol, tokenObj);
	}
	

	const renderId = 'swaptox-route';
	ensureMermaidRenderStyle(renderId);

	const mermaid = await renderChart();
	const { svg } = await mermaid.render(renderId, graphDefinition);
	
	const newSvg = replaceTokenImageShape(svg, tokenLOGOS);
	//console.log('newSvg', newSvg);
	
	return replaceSvgColorVariables(newSvg, {
		'#ffffff00': 'var(--stxui-modal-background-color, #fff)',
		'#ffffff01': 'var(--stxui-route-trend-background-color, #fff)',
		//'#00000010': 'var(--stxui-theme-font-color, #111)',
		'#99999900': 'var(--stxui-route-trend-border-color, #bbb)',
		'#64748b00': 'var(--stxui-route-trend-line-color, #64748b)'
	});
}





