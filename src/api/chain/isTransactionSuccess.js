


import { eth_getTransactionReceipt } from './eth_getTransactionReceipt.js';
import {$app} from '../../js_sdk/index.js';



export async function isTransactionSuccess(chain, hash, timeout = 300000) {
	const startTime = Date.now();
	let numberCycles = 0;
	while (Date.now() - startTime < timeout) {
		numberCycles++;
		const result = await eth_getTransactionReceipt(chain, hash);
		if(result&&$app.test.object(result)){
			return (result.status === '0x1');
		}
		await $app.sleep(numberCycles*20);
	}
	return false;
}




