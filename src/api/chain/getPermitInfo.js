


import {SwaptoXPermitReaderABI} from '../../data/abi/SwaptoXPermitReaderABI.js';
import {viemUtils} from '../../js_sdk/viem/utils.js';
import {networkData} from '../../data/network-data.js';
import {$app} from '../../js_sdk/index.js';

export async function getPermitInfo(chain, args) {
	
	
	const functionName = 'getPermitInfo';
	const calldata = viemUtils.encodeFunctionData({
		'abi': SwaptoXPermitReaderABI,
		'functionName': functionName,
		'args': args,
	});
	const postData = {
		"jsonrpc": "2.0",
		"id": 1,
		"method": "eth_call",
		"params": [
			{
				"data": calldata,
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
				'abi': SwaptoXPermitReaderABI,
				'functionName': functionName,
				'data': postResult.result
			});
		} catch (error) {
			//throw error;
			console.error(functionName, error, chain, args);
		}
	}
	
	return false;

}


