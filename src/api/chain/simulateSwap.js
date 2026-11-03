
import swaptoxABI from '../../data/abi/swaptoxABI.json';
import {viemUtils} from '../../js_sdk/viem/utils.js';
import {networkData} from '../../data/network-data.js';
import {$app} from '../../js_sdk/index.js';



export async function simulateSwap(chain, obj) {
	
	const functionName = 'swap';
	const _data = viemUtils.encodeFunctionData({
		'abi': swaptoxABI,
		'functionName': functionName,
		'args': [
			{
			    tokenIn: obj.data.desc.tokenIn,
			    tokenOut: obj.data.desc.tokenOut,
			    amountIn: obj.data.desc.amountIn,
			    amountMinOut: obj.data.desc.amountMinOut,
			    recipient: obj.data.desc.recipient,
			    swapData: obj.data.desc.swapData,
			    permitData: obj.data.desc.permitData,
			},
			obj.data.deadline,
			obj.data.referral
		],
	});
	
	
	const param = {
		"data": _data,
		"to": obj.routerAddress.toLowerCase(),
		'from': obj.account,
		'value': obj.value,
	};
	
	const postData = {
		"jsonrpc": "2.0",
		"id": 1,
		"method": "eth_call",
		"params": [
			param,
			"latest"
		]
	};
	
	const rpcUrls = networkData[chain].rpcUrls.length>=2?
	$app.shuffleArray(networkData[chain].rpcUrls):
	[...networkData[chain].rpcUrls, ...networkData[chain].rpcUrls];
	
	
	let errMessage = '';
	
	for(let i = 0; i < rpcUrls.length; i++){
		try {
			const result =  await $app.post({
				'url': rpcUrls[i],
				'data': postData
			});
			if(!result.result&&result.error){
				if(result.error?.message){
					errMessage = result.error.message;
				}
				break;
			}
			const swapResult = viemUtils.decodeFunctionResult({
				'abi': swaptoxABI,
				'functionName': functionName,
				'data': result.result
			});
			//console.log("swapResult:", swapResult);
			return {
				success: true, 
			};
		} catch (error) {
			console.error(functionName, error);
		}
		await $app.sleep(1000);
	}
	
	
	if(errMessage.indexOf('SwaptoX: STF') != -1){
		return {
			success: true, 
		};
	}
	
	
	
	
	let code = '';
	if(errMessage.indexOf('insufficient output received') != -1){
		code = 'quote-expired';
	}
	
	return {
		success: false, 
		code: code, 
		message: errMessage,
	};
};