

import {appInfo} from '../../data/app-config.js';


const _getSwapPool = function(poolData){
	return `${poolData.protocol_id}-${poolData.version}`;
};
const _getRouteBytes = function(routes){
	const _routePools = [];
	for(let i = 0; i < routes.length; i++){
		_routePools.push(_getSwapPool(routes[i]));
	}
	return _routePools;
};
const _buildSingleSwapBytes = function(routeObj){
	const swapPools = [];
	
	const pools = _getRouteBytes(routeObj.routes);
	for(let i2 = 0; i2 < pools.length; i2++){
		swapPools.push(pools[i2]);
	}
	
	const subRoutes = routeObj.subRoutes;
	for(let i = 0; i < subRoutes.length; i++){
		const _rootData = _buildSingleSwapBytes(subRoutes[i]);
		for(let i2 = 0; i2 < _rootData.length; i2++){
			swapPools.push(_rootData[i2]);
		}
	}
	
	return swapPools;
};





export function buildPoolsLogo(routes, protocol){
	
	if(!routes||routes.length===0){
		return [];
	}
	
	if(!protocol||!protocol.obj){
		return [];
	}
	
	
	protocol.obj['0-0'] = appInfo;
	
	
	const logoPools = [];
	
	for(let i = 0; i < routes.length; i++){
		const _rootData = _buildSingleSwapBytes(routes[i]);
		for(let i = 0; i < _rootData.length; i++){
			logoPools.push(_rootData[i]);
		}
	}
	
	const iscunzai = {};
	const logos = [];
	for(let i = 0; i < logoPools.length; i++){
		const kid = logoPools[i];
		if(!iscunzai[kid]){
			iscunzai[kid] = true;
			logos.push(protocol.obj[kid].logo);
		}
	}
	
	return logos;
}