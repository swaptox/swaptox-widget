



import swaptoxABI from '../../data/abi/swaptoxABI.json';
import {viemUtils} from '../../js_sdk/viem/utils.js';
import {networkData} from '../../data/network-data.js';
import {$app} from '../../js_sdk/index.js';






export async function transactionSend(chain, obj) {
	
	const functionName = 'swap';
	const calldata = viemUtils.encodeFunctionData({
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
	
	
	
	
	
	
	
	if(window.$swaptoxConnect){
		const { provider } = await window.$swaptoxConnect.checkConnect(chain);
		try {
			const txHash = await provider.request({
				method: 'eth_sendTransaction',
				params: [{
					from: obj.account,
					to: obj.routerAddress.toLowerCase(),
					data: calldata,
					value: obj.value
				}]
			});
			console.log('Transaction hash:', txHash);
			return await {success: true, txHash: txHash};
		} catch (error) {
			console.error("Swap:", error);
			return {success: false};
		}
	}
	
	
	
	
	
	
	
	return new Promise((resolve) => {
		let finished = false;
		// 防止重复返回
		const finish = (result) => {
			if(finished) return;
			finished = true;
			resolve(result);
		};
		window.$swaptoxWidget.emitSwap({
			chain,
			calldata,
			data: obj,
			// 对方执行成功，获取交易 Hash
			success: async function(hash) {
				try {
					if(!hash){
						finish({success: false});
						return;
					}
					finish({success: true, txHash: hash});
				} catch (error) {
					finish({success: false});
				}
			},
			// 对方执行失败
			fail: function() {
				finish({success: false});
			}
		});
	});
};


