
import {$app} from '../../js_sdk/index.js';
import {apiV2} from '../../data/api-config.js';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function postProtocol() {
	const apiurl = apiV2.protocol;
	try {
		const protocol = await $app.request({'url': apiurl});
		const proObj = {};
		for(let i = 0; i < protocol.length; i++){
			const keyId = `${protocol[i].dapp_id}-${protocol[i].version}`;
			proObj[keyId] = protocol[i];
		}
		const myProtocol = {
			obj: proObj,
			arr: protocol
		};
		$app.safeSet(
			window,
			`swaptox.protocol`,
			myProtocol
		);
		return myProtocol;
	} catch (error) {}
	return null;
}

export async function getProtocol() {
	
	try {
		const cached = window?.swaptox?.protocol?.arr;
		if (Array.isArray(cached)) {
			return {...window.swaptox.protocol};
		}
	} catch (error) {}
	
	let protocol = await postProtocol();
	if(!protocol){
		await sleep(1010);
		protocol = await postProtocol();
	}
	if(!protocol){
		await sleep(1010);
		protocol = await postProtocol();
	}
	
	return protocol;
}







