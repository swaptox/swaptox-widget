



import { $app } from '../../js_sdk/index.js';








export async function permit(chain, obj, {permit_type, typedData}) {
	
	let encodePermit;
	if(permit_type==='eip2612'){
		encodePermit = $app.permit.encodeEip2612Permit;
	}else if(permit_type==='eip2612_bytes'){
		encodePermit = $app.permit.encodeEip2612BytesPermit;
	}else if(permit_type==='dai'){
		//encodePermit = $app.permit.encodeDaiPermit;
	}
	
	
	
	if(window.$swaptoxConnect){
		const { provider } = await window.$swaptoxConnect.checkConnect(chain);
		try {
			const signature = await provider.request(typedData);
			const permitData = encodePermit({
			    owner: obj.account,
			    spender: obj.spender,
			    value: obj.amount,
			    deadline: obj.deadline,
			    signature: signature
			});
			return permitData;
		} catch (error) {
			console.error("signature:", error);
			return null;
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
		window.$swaptoxWidget.emitPermit({
			chain,
			data: typedData,
			// 对方执行成功，获取交易 Hash
			success: async function(signature) {
				try {
					if(!signature){
						finish(null);
						return;
					}
					const permitData = encodePermit({
					    owner: obj.account,
					    spender: obj.spender,
					    value: obj.amount,
					    deadline: obj.deadline,
					    signature: signature
					});
					finish(permitData);
				} catch (error) {
					console.error('Permit(encodePermit):', error);
					finish(null);
				}
			},
			// 对方执行失败
			fail: function() {
				finish(null);
			}
		});
	});
};








