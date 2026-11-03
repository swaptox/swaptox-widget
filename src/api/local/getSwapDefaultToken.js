import {$app} from '../../js_sdk/index.js';
import {networkData} from '../../data/network-data.js';


const STORAGE_KEY = 'default-swap-token';


export function setSwapFromToken(chain, data) {
	$app.setStorageSync(`${chain}-from-${STORAGE_KEY}`, data);
}
export function setSwapToToken(chain, data) {
	$app.setStorageSync(`${chain}-to-${STORAGE_KEY}`, data);
}


export function getSwapDefaultToken(chain) {
	const swapToken = networkData[chain].swapDefaultToken;
	try {
		const isFromData = $app.getStorageSync(`${chain}-from-${STORAGE_KEY}`);
		if(isFromData&&isFromData?.address){
			swapToken.from = isFromData;
		}
	} catch (e) {}
	try {
		const isToData = $app.getStorageSync(`${chain}-to-${STORAGE_KEY}`);
		if(isToData&&isToData?.address){
			swapToken.to = isToData;
		}
	} catch (e) {}
	return swapToken;
}