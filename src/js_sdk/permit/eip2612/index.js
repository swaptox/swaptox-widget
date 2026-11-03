import { viemUtils } from '../../../js_sdk/viem/utils.js';
import { TypedData } from '../../../js_sdk/viem/typedData.js';
//import { TypedData } from 'https://esm.sh/viem@next/utils'


//循环确定最终的version与name
function findPermitDomain({names, versions, chainId, tokenAddress, domainSeparator}) {
	//console.log(names, versions, chainId, tokenAddress, domainSeparator);
    for (const name of names) {
        for (const version of versions) {
            const calculated = TypedData.hashDomain({
                domain: {
					name,
					version,
					chainId,
					verifyingContract: tokenAddress,
				}
            });
            if (calculated.toLowerCase()===domainSeparator.toLowerCase()) {
                return {name, version};
            }
        }
    }
    return null;
}

export function buildEip2612Data(params) {
	const result = findPermitDomain({
	    names: params.names,
	    versions: Array.from(
	        { length: 10 },
	        (_, i) => String(i + 1)
	    ),
	    chainId: Number(params.chainId),
	    tokenAddress: params.tokenAddress,
	    domainSeparator: params.domainSeparator,
	});
	if(!result){
		return null;//不使用eip2612
	}
    const typedData = {
        domain: {
            name: result.name,
            version: result.version,
            chainId: Number(params.chainId),
            verifyingContract: params.tokenAddress
        },
		types: {
		    EIP712Domain: [
		        { name: 'name', type: 'string' },
		        { name: 'version', type: 'string' },
		        { name: 'chainId', type: 'uint256' },
		        { name: 'verifyingContract', type: 'address' }
		    ],
		    Permit: [
		        { name: 'owner', type: 'address' },
		        { name: 'spender', type: 'address' },
		        { name: 'value', type: 'uint256' },
		        { name: 'nonce', type: 'uint256' },
		        { name: 'deadline', type: 'uint256' }
		    ]
		},
        primaryType: 'Permit',
        message: {
            owner: params.account,
            spender: params.routerAddress,
            value: params.amountIn.toString(),
            nonce: params.nonce.toString(),
            deadline: params.deadline.toString()
        }
    };
    return {
        method: 'eth_signTypedData_v4',
        params: [
            params.account,
            JSON.stringify(typedData)
        ]
    };
}



export function encodeEip2612Permit({
    owner,
    spender,
    value,
    deadline,
    signature
}) {
    const hex = signature.slice(2);

    if (hex.length !== 130) {
        throw new Error('Invalid signature length');
    }

    const r = `0x${hex.slice(0, 64)}`;
    const s = `0x${hex.slice(64, 128)}`;

    let v = parseInt(hex.slice(128, 130), 16);

    if (v < 27) {
        v += 27;
    }

    if (v !== 27 && v !== 28) {
        throw new Error('Invalid signature v');
    }

    return viemUtils.encodeFunctionData({
        abi: [{
            type: 'function',
            name: 'permit',
            stateMutability: 'nonpayable',
            inputs: [
                { name: 'owner', type: 'address' },
                { name: 'spender', type: 'address' },
                { name: 'value', type: 'uint256' },
                { name: 'deadline', type: 'uint256' },
                { name: 'v', type: 'uint8' },
                { name: 'r', type: 'bytes32' },
                { name: 's', type: 'bytes32' }
            ],
            outputs: []
        }],
        functionName: 'permit',
        args: [
            owner,
            spender,
            BigInt(value),
            BigInt(deadline),
            v,
            r,
            s
        ]
    });
}
