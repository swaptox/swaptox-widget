'use strict';

import {htmlProperty} from './util/htmlProperty.js';
import {request} from './util/request.js';
import {post} from './util/post.js';
import {shuffleArray} from './util/shuffleArray.js';
import {setStorageSync,getStorageSync} from './util/storageSync.js';

import {formatBalance} from './util/formatBalance.js';
//import {formatBalanceHTML} from './util/formatBalanceHTML.js';
import {formatSwapBalance} from './util/formatSwapBalance.js';
import {formatPrice} from './util/formatPrice.js';
import {formatPriceBehalf} from './util/formatPriceBehalf.js';
import {calculateUsdValue} from './util/calculateUsdValue.js';


import {copyToClipboard} from './util/copyToClipboard.js';
import {openUrl} from './util/openUrl.js';
import {safeSet} from './util/safeSet.js';
import {decodeURIparam} from './util/decodeURIparam.js';
import {timeFormatDate} from './util/timeFormatDate.js';



import {deepClone} from './util/deepClone.js';
import {deepMerge} from './util/deepMerge.js';

import {paginate} from './util/paginate.js';
import {replaceTemplate} from './util/replaceTemplate.js';
import {updateDocumentLang} from './util/updateDocumentLang.js';


import {test} from './test/index.js';
import {permit} from './permit/index.js';

const computeAmountMinOut = function (amountOut, slippage) {
	if(!amountOut||BigInt(amountOut)===0n) return '0';
	return (BigInt(amountOut) * (10000n - slippage) / 10000n).toString();
};



export const $app = {
    'htmlProperty': htmlProperty,
	'updateDocumentLang': updateDocumentLang,
	'decodeURIparam': decodeURIparam,
	'request': request,
	'post': post,
	'shuffleArray': shuffleArray,
	'setStorageSync': setStorageSync,
	'getStorageSync': getStorageSync,
	'formatBalance': formatBalance,
	'formatPrice': formatPrice,
	'formatSwapBalance': formatSwapBalance,
	'formatPriceBehalf': formatPriceBehalf,
	'calculateUsdValue': calculateUsdValue,
	//'formatBalanceHTML': formatBalanceHTML,
	'copyToClipboard': copyToClipboard,
	'openUrl': openUrl,
	'test': test,
	'permit': permit,
	'safeSet': safeSet,
	'deepClone': deepClone,
	'deepMerge': deepMerge,
	'replaceTemplate': replaceTemplate,
	'paginate': paginate,
	'sleep': (ms) => new Promise(resolve => setTimeout(resolve, ms)),
	'computeAmountMinOut': computeAmountMinOut,
	'timeFormatDate': timeFormatDate
};

