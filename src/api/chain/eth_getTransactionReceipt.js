



import {networkData} from '../../data/network-data.js';
import {$app} from '../../js_sdk/index.js';

export async function eth_getTransactionReceipt(chain, hash) {
	
	
	const postData = {
	    "jsonrpc": "2.0",
	    "id": 1,
	    "method": "eth_getTransactionReceipt",
	    "params": [
	        hash
	    ]
	};
	
	
	const rpcUrls = $app.shuffleArray(networkData[chain].rpcUrls);
	for(let i = 0; i < rpcUrls.length; i++){
		try {
			const result = await $app.post({
				'method': 'POST',
				'url': rpcUrls[i],
				'data': postData
			});
			if($app.test.object(result.result)){
				return result.result;
			}
		} catch (error) {
			//throw error;
			console.error('eth_getTransactionReceipt', error);
		}
	}
	
	
	return null;
}





