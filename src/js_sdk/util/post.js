/**
 * 封装基础请求函数
 * @param {string} url - 请求地址
 * @param {object} data - 数据
 * @param {object} headers - 自定义请求头
 */
export async function post({ url, data = {}, headers = {'Content-Type': 'application/json'} }) {

    const options = {
        method: 'POST',
        headers: headers,
		body: JSON.stringify(data)
    };
	
	try {
	    const response = await fetch(url, options);
	    const result = await response.json();
	    if (!response.ok) throw result;
	    return result;
	} catch (error) {
	    throw error;
	}
}