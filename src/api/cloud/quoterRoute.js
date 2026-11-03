


import {$app} from '../../js_sdk/index.js';
import {apiInfo, apiV2} from '../../data/api-config.js';



export async function quoterRoute(chain, data) {
	let apiurl = apiV2.routes.replace('{{chain}}', chain);
	try {
	    return await $app.request({
	    	'url': apiurl,
	    	'data': {
				'amountIn': data.amountIn,
				//'slippage': data.slippage,
				'tokenIn': data.tokenIn,
				'tokenOut': data.tokenOut,
				'account': data.account||'',
				//'deadline': '',
				//'referral': ''
			}
	    });
	} catch (error) {
	    throw error;
	}
}





/* export async function quoterRoute(chain, data) {
	let apiurl = apiInfo.quoter.replace('{{chain}}', chain);
	try {
	    return await $app.request({
	    	'url': apiurl,
	    	'data': data
	    });
	} catch (error) {
	    throw error;
	}
} */
