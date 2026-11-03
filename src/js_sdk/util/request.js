/**
 * 封装基础请求函数
 * @param {string} url - 请求地址
 * @param {string} method - 方法
 * @param {object} data - 数据（GET则转为QueryString，POST则转为JSON）
 * @param {object} headers - 自定义请求头
 */
import {sdkInfo} from '../../data/sdk-config.js';
export async function request({ url, method = 'GET', data = {}, headers = {} }) {
    const urlObj = new URL(url, window.location.origin);

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'X-STX-SDK-VERSION': sdkInfo.version,
			'X-STX-SDK-NAME': sdkInfo.name,
            'X-STX-HOST-DOMAIN': window.location.hostname,
            ...headers
        }
    };

    if (method.toUpperCase() === 'GET') {
        Object.entries(data).forEach(([k, v]) => urlObj.searchParams.set(k, v));
    } else {
        options.body = JSON.stringify(data);
    }
	
	try {
	    const response = await fetch(urlObj.toString(), options);
	    const result = await response.json();
	    if (!response.ok) throw {...result, status: response.status};
		if (!result.success) throw {...result, status: response.status};
	    return result.data;
	} catch (error) {//console.error('请求错误', error);
	    throw error;
	}
}