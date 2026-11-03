

import {$app} from '../../js_sdk/index.js';
import {apiV2} from '../../data/api-config.js';



const tokenRequests = new Map();

export async function getTokens(chain, refresh = false) {

	// 1. 缓存
	if (!refresh) {
		const cached = window.swaptox?.tokens?.[chain];

		if (Array.isArray(cached)) {
			return [...cached];
		}
	}

	// 2. 已有请求，直接等待
	if (tokenRequests.has(chain)) {
		const result = await tokenRequests.get(chain);

		// 请求结束后重新读取缓存
		const cached = window.swaptox?.tokens?.[chain];

		return Array.isArray(cached)
			? [...cached]
			: result;
	}

	// 3. 创建请求
	const request = (async () => {
		try {
			const apiurl = apiV2.tokens.replace('{{chain}}', chain);

			const tokenList = await $app.request({
				url: apiurl
			});

			if (!Array.isArray(tokenList)) {
				return null;
			}

			$app.safeSet(
				window,
				`swaptox.tokens.${chain}`,
				tokenList
			);

			return tokenList;

		} catch (error) {
			console.error(`getTokens(${chain}) error:`, error);
			return null;
		}
	})();

	tokenRequests.set(chain, request);

	try {
		return await request;
	} finally {
		tokenRequests.delete(chain);
	}
}



