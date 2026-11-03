



import {$app} from '../../js_sdk/index.js';
import {publicApi} from '../../data/api-config.js';



async function _checkTransaction(data) {
	const apiurl = publicApi.checkTransaction;
	try {
		const result = await $app.request({
			'url': apiurl, 
			'data': data,
		});
		return true;
	} catch (error) {
		console.error('checkTransaction', error);
	}
	return false;
}


export async function checkTransaction(data) {
	let result = await _checkTransaction(data);
	if(!result){
		await $app.sleep(2100);
		result = await _checkTransaction(data);
	}
	if(!result){
		await $app.sleep(2100);
		result = await _checkTransaction(data);
	}
	return result;
}

export async function getTransaction(data) {
	const apiurl = publicApi.checkTransaction;
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



