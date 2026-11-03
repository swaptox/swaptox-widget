const PREFIX = 'STX_MINI_SDK_';
function convertBigIntToNumber(obj) {
	if (typeof obj === 'bigint') {
		return obj.toString();
	}
	if (Array.isArray(obj)) {
		return obj.map(item => convertBigIntToNumber(item));
	}
	if (typeof obj === 'object' && obj !== null) {
		const result = {};
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				result[key] = convertBigIntToNumber(obj[key]);
			}
		}
		return result;
	}
	return obj;
}
/**
 * setStorageSync
 * @param {string} key 
 * @param {any} data 
 */
export const setStorageSync = (key, data) => {
    try {
        // 将数据包装，以便统一处理
        const stringData = JSON.stringify(convertBigIntToNumber(data));
        localStorage.setItem(PREFIX+key, stringData);
    } catch (e) {
        console.error(`[Storage Error] set ${key} failed:`, e);
    }
};

/**
 * getStorageSync
 * @param {string} key 
 * @returns {any}
 */
export const getStorageSync = (key) => {
    try {
        const data = localStorage.getItem(PREFIX+key);
        if (data === null || data === undefined) {
            return ''; // 找不到返回空字符串
        }
        // JSON.parse 会自动还原数字、布尔、对象和数组
        return JSON.parse(data);
    } catch (e) {
        // 如果 parse 失败，说明存储的可能不是标准的 JSON 格式，直接返回原始值
        const rawData = localStorage.getItem(PREFIX+key);
        return rawData;
    }
};