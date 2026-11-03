
import {$app} from '../../js_sdk/index.js';
import {networkData} from '../../data/network-data.js';


export function getPresetTokenList(chain, key) {
	let isdata = $app.getStorageSync(key);
	if(isdata){
		return isdata;
	}
	return networkData[chain].presetTokenList;
}