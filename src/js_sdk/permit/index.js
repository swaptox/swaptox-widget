


import {buildEip2612Data, encodeEip2612Permit} from './eip2612/index.js';
import {buildEip2612BytesData, encodeEip2612BytesPermit} from './eip2612_bytes/index.js';

//import {buildDaiPermitData, encodeDaiPermit} from './dai/index.js';


/*
eip2612
0xd505accf

eip2612_bytes
0x9fd5a6cf

dai
0x8fcbaf0c

*/


import {detectPermitMethods} from './detectPermitMethods.js';


export const permit = {
	'buildEip2612Data': buildEip2612Data,
	'encodeEip2612Permit': encodeEip2612Permit,
	
	'buildEip2612BytesData': buildEip2612BytesData,
	'encodeEip2612BytesPermit': encodeEip2612BytesPermit,
	
	//'buildDaiPermitData': buildDaiPermitData,
	//'encodeDaiPermit': encodeDaiPermit,
	
	
	detectPermitMethods,
	
};