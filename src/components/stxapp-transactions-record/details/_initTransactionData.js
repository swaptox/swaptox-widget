

import { viemUtils } from '../../../js_sdk/viem/utils.js';
import { networkData } from '../../../data/network-data.js';
import { allTokens } from '../../../api/cloud/getTokenList.js';
import { $app } from '../../../js_sdk/index.js';


let $_tokenObj = {};
const _getTokenObj = async function(chain){
	if($_tokenObj[chain]){
		return $_tokenObj[chain];
	}
	const cached = await allTokens(chain);
	if (cached&&Array.isArray(cached)) {
		const tObj = {};
		for(let i = 0; i < cached.length; i++){
			tObj[cached[i].address.toLowerCase()] = cached[i];
		}
		$_tokenObj[chain] = tObj;
		return $_tokenObj[chain];
	}else{
		return {};
	}
};



const _formatBalance = (bal, decimals)=>{
	const balNum = viemUtils.formatUnits(bal, decimals);
	return $app.formatBalance(balNum);
};
const _initiatedArr = (initiated)=>{
	if(!initiated){return ['--', '--'];}
	if(initiated.indexOf(' ') != -1){
		return initiated?.split(' ');
	}
	return [initiated, '--'];
};






export const _initTransactionData = async (data, priceBehalf) => {
    const tokenInObj = await _getTokenObj(data.chainin);
    const tokenOutObj = await _getTokenObj(data.chainout);
    const newObj = {
    	...data,
    	chain: data.type==='bridge'?data.chainout:data.chainin,
    	symbolIn: tokenInObj?.[data.tokenin]?.symbol,
    	logoIn: tokenInObj?.[data.tokenin]?.logourl,
    	symbolOut: tokenOutObj?.[data.tokenout]?.symbol,
    	logoOut: tokenOutObj?.[data.tokenout]?.logourl,
    	
    	chaininLogo: networkData[data.chainin].logo,
    	chainoutLogo: networkData[data.chainout].logo,
    	
    	_amountIn: _formatBalance(data.amountin, tokenInObj?.[data.tokenin]?.decimals),
    	_amountOut: _formatBalance(data.amountout, tokenOutObj?.[data.tokenout]?.decimals),
    	
    	_inUsd: data.amountinusd?$app.formatPriceBehalf(data.amountinusd, priceBehalf):'--',
    	_outUsd: data.amountoutusd?$app.formatPriceBehalf(data.amountoutusd, priceBehalf):'--',
    	
    	initiatedArr: _initiatedArr(data?.initiated),
		
		_actualreceived: '',//实际输出
		_swapfee: data.swapfee/100,
    };
	return newObj;
};



