export const batchQueryTokenBalanceABI = [
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "tokens",
				"type": "address[]"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "batchQueryTokenBalance",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];