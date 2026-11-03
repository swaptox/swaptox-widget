
import {batchQueryTokenBalanceABI} from '../../data/abi/batchQueryTokenBalance.js';
import {viemUtils} from '../../js_sdk/viem/utils.js';
import {networkData} from '../../data/network-data.js';
import {$app} from '../../js_sdk/index.js';

export async function batchQueryTokenBalance(chain, data) {
	
	
	const functionName = 'batchQueryTokenBalance';
	const _data = viemUtils.encodeFunctionData({
		'abi': batchQueryTokenBalanceABI,
		'functionName': functionName,
		'args': data,
	});
	const postData = {
		"jsonrpc": "2.0",
		"id": 1,
		"method": "eth_call",
		"params": [
			{
				"data": _data,
				"to": networkData[chain].utilAddress
			},
			"latest"
		]
	};
	
	
	const rpcUrls = $app.shuffleArray(networkData[chain].rpcUrls);
	
	
	for(let i = 0; i < rpcUrls.length; i++){
		try {
			const postResult =  await $app.post({
				'url': rpcUrls[i],
				'data': postData
			});
			return viemUtils.decodeFunctionResult({
				'abi': batchQueryTokenBalanceABI,
				'functionName': functionName,
				'data': postResult.result
			});
		} catch (error) {
			//throw error;
			console.error(functionName, error, chain, data);
		}
	}
	
	return false;

}