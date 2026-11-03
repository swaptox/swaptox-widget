/**
 * 兼容标准 Query 参数及 Vue Hash 路由参数的获取函数
 * @param {string} param - 要获取的参数名
 * @returns {string} - 参数值，未找到返回空字符串
 */
export const decodeURIparam = function(param) {
    if (!param) return '';
    
    try {
        // 1. 优先从标准的 window.location.search 中获取
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has(param)) {
            return searchParams.get(param);
        }

        // 2. 兼容 Vue Hash 路由（例如：http://example.com/#/swap?token=ETH 或 http://example.com/#/?token=ETH）
        const hash = window.location.hash;
        if (hash && hash.includes('?')) {
            const queryIndex = hash.indexOf('?');
            const queryString = hash.substring(queryIndex + 1);
            const hashParams = new URLSearchParams(queryString);
            if (hashParams.has(param)) {
                return hashParams.get(param);
            }
        }
    } catch (error) {
        // 容错处理
    }

    // 3. 终极兜底：如果运行在非标准环境（如 SSR 或特殊的内存路由），用正则兜底匹配
    try {
        const fullUrl = window.location.href;
        // 匹配 ?param=value 或 &param=value，自动截断到 &、# 或字符串结尾
        const regex = new RegExp(`[?&]${param}=([^&#]*)`, 'i');
        const match = fullUrl.match(regex);
        if (match && match[1]) {
            return decodeURIComponent(match[1]);
        }
    } catch (e) {}

    return '';
};