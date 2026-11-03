



import { getTokens } from './getTokens.js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));




export async function allTokens(chain) {

	// 封装一个获取缓存的函数
	const getCached = () => window.swaptox?.tokens?.[chain];
	let cached = getCached();

	// 如果还没有缓存，开始异步“循环等待”
	if (!cached || !Array.isArray(cached)) {
		await new Promise((resolve) => {
			const timer = setInterval(() => {
				cached = getCached();
				// 一旦检测到数据就清除定时器并继续
				if (cached && Array.isArray(cached)) {
					clearInterval(timer);
					resolve();
				}
			}, 100); // 每 100ms 检查一次
			
			// 💡 建议加个超时保护（比如 60 秒没拿到就自动停止，防止死循环）
			setTimeout(() => {
				clearInterval(timer);
				resolve();
			}, 60000);
		});
	}

	// 重新检查最终结果
	cached = getCached();
	if (cached && Array.isArray(cached)) {
		return [...cached];
	}
	
	return await getTokens(chain, true);
}
















export async function getTokenList(chain, data = {}) {
	let tokenList = await getTokens(chain, false);

	if (!Array.isArray(tokenList)) {
		await sleep(1010);
		tokenList = await getTokens(chain, false);
	}

	if (!Array.isArray(tokenList)) {
		throw tokenList;
	}

	// 参数
	const {
		address,
		keyword,
		onlyVerified = false,
		page = 1,
		size = 100
	} = data;

	let result = tokenList;

	// --------------------------------------------------
	// 1. address 精确筛选
	// address:
	// "0xaaa,0xbbb"
	// --------------------------------------------------
	if (address) {
		const addressSet = new Set(
			String(address)
				.split(',')
				.map(addr => addr.trim().toLowerCase())
				.filter(Boolean)
		);

		result = result.filter(token =>
			addressSet.has(token.address?.toLowerCase())
		);
		
		// address 筛选和其他搜索条件没有必要继续处理
		return result;
	}


	// --------------------------------------------------
	// 4. 排序
	// sorting DESC
	// id ASC
	// --------------------------------------------------
	result = [...result].sort((a, b) => {
		const sortingA = Number(a.sorting ?? 0);
		const sortingB = Number(b.sorting ?? 0);
		
		

		if (sortingA !== sortingB) {
			return sortingB - sortingA;
		}

		return Number(a.id ?? 0) - Number(b.id ?? 0);
	});


	// --------------------------------------------------
	// 2. keyword 搜索
	// 搜索 name / symbol / address
	// 与原 Supabase API 保持一致
	// --------------------------------------------------
	if (keyword) {
		const search = String(keyword).trim().toLowerCase();

		if (search) {
			result = result.filter(token => {
				return (
					token.name?.toLowerCase().includes(search) ||
					token.symbol?.toLowerCase().includes(search) ||
					token.address?.toLowerCase().includes(search)
				);
			});
		}
	}

	// --------------------------------------------------
	// 3. onlyVerified
	// --------------------------------------------------
	if (onlyVerified === true || onlyVerified === 'true') {
		result = result.filter(token => token.is_verified === true);
	}



	// --------------------------------------------------
	// 5. 分页
	// --------------------------------------------------
	const currentPage = Math.max(1, parseInt(page, 10) || 1);
	const pageSize = Math.max(1, parseInt(size, 10) || 100);

	const from = (currentPage - 1) * pageSize;
	const to = from + pageSize;
	
	//console.log('tokenlist', result.slice(from, to));

	return result.slice(from, to);
}




















/* 
import {$app} from '../../js_sdk/index.js';
import {apiInfo, apiV2} from '../../data/api-config.js';


import {getTokens} from './getTokens.js';




export async function getTokenList(chain, data) {
	
	const tokenList = await getTokens(chain);
	
	
	
	
	
	console.log('0000000', chain, data);
	
	
	let apiurl = apiInfo.getToken.replace('{{chain}}', chain);
	try {
	    return await $app.request({
	    	'url': apiurl,
	    	'data': data
	    });
	} catch (error) {
	    throw error;
	}
} */