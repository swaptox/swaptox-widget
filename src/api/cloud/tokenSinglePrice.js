


import {$app} from '../../js_sdk/index.js';
import {apiV2} from '../../data/api-config.js';



export async function tokenSinglePrice(chain, tokenAddr) {
	const apiurl = apiV2.tokenSinglePrice.replace('{{chain}}', chain);
	try {
		return await $app.request({'url': apiurl, 'data': {token: tokenAddr}});
	} catch (error) {
		throw error;
	}
}





export async function tokenPrices(chain, tokenAddr) {
	const apiurl = apiV2.tokenPrices.replace('{{chain}}', chain);
	try {
		return await $app.request({'url': apiurl, 'data': {token: tokenAddr}});
	} catch (error) {
		throw error;
	}
}



