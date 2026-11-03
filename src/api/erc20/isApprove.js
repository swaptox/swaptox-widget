

import erc20Abi from './erc20abi.json';
import {viemUtils} from '../../js_sdk/viem/utils.js';
import {networkData} from '../../data/network-data.js';
import {$app} from '../../js_sdk/index.js';


export async function isApprove(chain, args) {
	const functionName = 'allowance';
	const _data = viemUtils.encodeFunctionData({
		'abi': erc20Abi,
		'functionName': functionName,
		'args': [args.owner.toLowerCase(), args.spender.toLowerCase()],
	});
	const postData = {
		"jsonrpc": "2.0",
		"id": 1,
		"method": "eth_call",
		"params": [
			{
				"data": _data,
				"to": args.token.toLowerCase()
			},
			"latest"
		]
	};
	
	const required = BigInt(args.amount);
	const rpcUrls = $app.shuffleArray(networkData[chain].rpcUrls);
	
	
	for(let i = 0; i < rpcUrls.length; i++){
		try {
			const result =  await $app.post({
				'url': rpcUrls[i],
				'data': postData
			});
			const allowance = viemUtils.decodeFunctionResult({
				'abi': erc20Abi,
				'functionName': functionName,
				'data': result.result
			});
			//console.log("当前allowance:", allowance, required, result);
			if (allowance >= required) {
			    return true; //授权足够
			} else {
			    return false; //授权不足，需要approve
			}
		} catch (error) {
			console.error(functionName, error);
		}
	}
	
	return false;
};