

import { networkData } from '../../data/network-data.js';
import { isTransactionSuccess } from '../chain/isTransactionSuccess';
import { viemUtils } from '../../js_sdk/viem/utils.js';
import erc20Abi from './erc20abi.json';




export async function approve(chain, obj) {
	
	//let lldld = '0xeaec58b04b74906077750053edefb4bc8179d26a805d3be78d669686b9624db5'
	//return await isTransactionSuccess(chain, lldld, 60000);
	
	
	
	const approveTimeoutDuration = networkData?.[chain]?.approveTimeoutDuration || 60000;
	
	const functionName = 'approve';
	const calldata = viemUtils.encodeFunctionData({
		'abi': erc20Abi,
		'functionName': functionName,
		'args': [obj.spender, obj.amount],
	});
	
	
	if(window.$swaptoxConnect){
		const { provider } = await window.$swaptoxConnect.checkConnect();
		try {
			const txHash = await provider.request({
				method: 'eth_sendTransaction',
				params: [{
					from: obj.account,
					to: obj.token,
					data: calldata,
					value: '0x0'
				}]
			});
			//console.log('Transaction hash:', txHash);
			return await isTransactionSuccess(chain, txHash, approveTimeoutDuration);
		} catch (error) {
			console.error("Approve:", error);
			return false;
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
		window.$swaptoxWidget.emitApprove({
			chain,
			calldata,
			data: obj,
			// 对方执行成功，获取交易 Hash
			success: async function(hash) {
				try {
					if(!hash){
						finish(false);
						return;
					}
					// 这里替换成你自己的交易上链监听函数
					const result = await isTransactionSuccess(chain, hash, approveTimeoutDuration);
					finish(result);
				} catch (error) {
					finish(false);
				}
			},
			// 对方执行失败
			fail: function() {
				finish(false);
			}
		});
	});
};


