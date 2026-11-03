import {$app} from '../../js_sdk/index.js';
import {publicApi} from '../../data/api-config.js';






export async function getTransaction(data) {
	const apiurl = publicApi.getTransaction;
	try {
		const result = await $app.request({
			'url': apiurl,
			'data': data,
		});
		return result;
	} catch (error) {
		console.error('getTransaction', error);
	}
	return false;
}