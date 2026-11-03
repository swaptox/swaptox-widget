


export const defaultChain = 'base';


export const networkData = {
    'rootstock': {
		'zeroAddress': '0x0000000000000000000000000000000000000000',
    	'getTokenPageSize': 500,
    	'batchQueryTokenBalanceNum': 500,
    	'refreshTokenDelaytime': 60000 * 30,//单位毫秒
    	
		'approveTimeoutDuration': 90000,//approve超时时间
		
		'chain': 'rootstock',
    	'name': 'Rootstock',
    	'logo': 'https://cdn.swaptox.com/logo/chain/rsk.png',
    	'chainId': 30,
    	//chainIdHex: '0x1e',
		
    	'refreshRoutesDelaytime': 25,//单位秒，自动刷新路线价格延迟时间，根据区块执行速度合理设置
    	'utilAddress': '0xB230eb97775f75D6AD3ba98A26195635f0207E6D',//'0x7B791963E4FeC2aabA2F0e7551Fa66b80060D259',
    	'rpcUrls': [
    		'https://public-node.rsk.co/',
    		'https://rsk-live.sovryn.app/rpc',
    		'https://api-v2.swaptox.com/rootstock/rpc',
    	],//https://mainnet.sovryn.app/rpc
    	
    	'blockExplorer': {
    		'token': 'https://explorer.rootstock.io/token/{{address}}',
    		'contract': 'https://explorer.rootstock.io/address/{{address}}',
    		'tx': 'https://explorer.rootstock.io/tx/{{tx}}',
    	},
    	
    	'nativeToken': {
    		'native': '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    		'wrapped': '0x542fda317318ebf1d3deaf76e0b632741a7e677d',
    		'decimals': 18,
    	},
    	
    	
    	'presetTokenList': [
    		{
    			"decimals": 18,
    			"name": "Rootstock Bitcoin",
    			"symbol": "RBTC",
    			"address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    			"logourl": "https://cdn.swaptox.com/rootstock/token/rbtc-v2.svg",
    		},
    		{
    			"decimals": 18,
    			"name": "Wrapped BTC",
    			"symbol": "WRBTC",
    			"address": "0x542fda317318ebf1d3deaf76e0b632741a7e677d",
    			"logourl": "https://cdn.swaptox.com/rootstock/token/uubvca-v1773735814006.png",
    		},
    		{
    			"decimals": 18,
    			"name": "Rootstock Bridged rUSDT",
    			"symbol": "rUSDT",
    			"address": "0xef213441a85df4d7acbdae0cf78004e1e486bb96",
    			"logourl": "https://cdn.swaptox.com/rootstock/token/fuplwd-v1773736463854.png",
    		},
    		{
    			"decimals": 6,
    			"name": "USD₮0",
    			"symbol": "USD₮0",
    			"address": "0x779ded0c9e1022225f8e0630b35a9b54be713736",
    			"logourl": "https://cdn.swaptox.com/rootstock/token/kxar9x-v1773735905941.png",
    		},
    		{
    			"decimals": 18,
    			"name": "RIF US Dollar",
    			"symbol": "USDRIF",
    			"address": "0x3a15461d8ae0f0fb5fa2629e9da7d66a794a6e37",
    			"logourl": "https://cdn.swaptox.com/rootstock/token/l4doyy-v1773737532875.png",
    		},
    		{
    			"decimals": 18,
    			"name": "RIF",
    			"symbol": "RIF",
    			"address": "0x2acc95758f8b5f583470ba265eb685a8f45fc9d5",
    			"logourl": "https://cdn.swaptox.com/rootstock/token/x98ejn-v1773735867319.png",
    		},			
    	],
    	
    	
    	//展示默认选择代币框，代币选择框的代币不能为空
    	"swapDefaultToken": {
    		"from": {
    			"decimals": 18,
    			"name": "Rootstock Bitcoin",
    			"symbol": "RBTC",
    			"address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    			"logourl": "https://cdn.swaptox.com/rootstock/token/rbtc-v2.svg",
    		},
    		"to": {
    			"decimals": 18,
    			"name": "Rootstock Bridged rUSDT",
    			"symbol": "rUSDT",
    			"address": "0xef213441a85df4d7acbdae0cf78004e1e486bb96",
    			"logourl": "https://cdn.swaptox.com/rootstock/token/fuplwd-v1773736463854.png",
    		}
    	},
    	
    },
	
	
	
	
	'base': {
		'zeroAddress': '0x0000000000000000000000000000000000000000',
		'getTokenPageSize': 1000,
		'batchQueryTokenBalanceNum': 500,
		'refreshTokenDelaytime': 60000 * 30,//单位毫秒
		
		'approveTimeoutDuration': 60000,//approve超时时间
		
		'chain': 'base',
		'name': 'Base',
		'logo': 'https://cdn.swaptox.com/logo/chain/base.svg',
		'chainId': 8453,
		//chainIdHex: '0x2105',
		
		'refreshRoutesDelaytime': 15,//单位秒，自动刷新路线价格延迟时间，根据区块执行速度合理设置
		'utilAddress': '0xb03Db6cf2Ac3CB6Fe6673e85cB775410C4Bd9bC6',//'0x1DCf1dB5940D56Fd361Ceca863048B6FA0815bEF',
		'rpcUrls': [
			//'https://base.publicnode.com',
			'https://base-rpc.publicnode.com',
			'https://mainnet.base.org',
			'https://api-v2.swaptox.com/base/rpc',
		],
		
		
		'blockExplorer': {
			'token': 'https://basescan.org/token/{{address}}',
			'contract': 'https://basescan.org/address/{{address}}',
			'tx': 'https://basescan.org/tx/{{tx}}',
		},
		
		'nativeToken': {
			'native': '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
			'wrapped': '0x4200000000000000000000000000000000000006',
			'decimals': 18,
		},
		
		'presetTokenList': [
			{
			    "decimals": 18,
			    "name": "Native Ether",
			    "symbol": "ETH",
			    "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
			    "logourl": "https://cdn.swaptox.com/base/token/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png",
			},
			{
			    "decimals": 18,
			    "name": "Wrapped Ether",
			    "symbol": "WETH",
			    "address": "0x4200000000000000000000000000000000000006",
			    "logourl": "https://cdn.swaptox.com/base/token/weth.png",
			},
			{
			    "decimals": 6,
			    "name": "USD Coin",
			    "symbol": "USDC",
			    "address": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
			    "logourl": "https://cdn.swaptox.com/base/token/0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.png",
			},
			{
			    "decimals": 6,
			    "name": "Tether USD",
			    "symbol": "USDT",
			    "address": "0xfde4c96c8593536e31f229ea8f37b2ada2699bb2",
			    "logourl": "https://cdn.swaptox.com/base/token/1753779195401.png",
			},
			{
			    "decimals": 8,
			    "name": "Coinbase Wrapped BTC",
			    "symbol": "cbBTC",
			    "address": "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf",
			    "logourl": "https://cdn.swaptox.com/base/token/1753779188367.png",
			},
			{
			    "decimals": 18,
			    "name": "Coinbase Wrapped Staked ETH",
			    "symbol": "cbETH",
			    "address": "0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22",
			    "logourl": "https://cdn.swaptox.com/base/token/1753779088216.png",
			},
			{
			    "decimals": 18,
			    "name": "Dai Stablecoin",
			    "symbol": "DAI",
			    "address": "0x50c5725949a6f0c72e6c4a641f24049a917db0cb",
			    "logourl": "https://cdn.swaptox.com/base/token/1753779351543.png",
			}
		],
		
		
		//展示默认选择代币框，代币选择框的代币不能为空
		"swapDefaultToken": {
			"from": {
				"decimals": 18,
				"name": "Native Ether",
				"symbol": "ETH",
				"address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
				"logourl": "https://cdn.swaptox.com/base/token/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png",
			},
			"to": {
				"decimals": 6,
				"name": "Tether USD",
				"symbol": "USDT",
				"address": "0xfde4c96c8593536e31f229ea8f37b2ada2699bb2",
				"logourl": "https://cdn.swaptox.com/base/token/1753779195401.png",
			}
		},
		
	},
	
	
	

	
	
};