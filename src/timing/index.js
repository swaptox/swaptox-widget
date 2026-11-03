


import { networkData } from '../data/network-data.js';
import { getTokens } from '../api/cloud/getTokens.js';
import { postProtocol } from '../api/cloud/getProtocol.js';





//自动刷新代币列表
for (const network of Object.keys(networkData)) {
	setInterval(async () => {
		try {
			await getTokens(network, false);
		} catch (err) {}
	}, networkData[network].refreshTokenDelaytime);
}








postProtocol();
setInterval(async () => {
	try {
		await postProtocol();
	} catch (err) {}
}, 60000*30);



