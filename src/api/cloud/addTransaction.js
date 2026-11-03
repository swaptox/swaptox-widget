
import {$app} from '../../js_sdk/index.js';
import {publicApi} from '../../data/api-config.js';






export async function addTransaction(data) {
	const apiurl = publicApi.addTransaction;
	try {
		const result = await $app.request({
			'url': apiurl, 
			'method': 'POST', 
			'data': data,
		});
		if(result.id){
			return true;
		}
		return true;
	} catch (error) {
		console.error('addTransaction', error);
	}
	return false;
}

