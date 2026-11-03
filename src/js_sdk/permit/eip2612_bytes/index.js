
import { TypedData } from '../../../js_sdk/viem/typedData.js';
import { viemUtils } from '../../../js_sdk/viem/utils.js';



function findPermitDomain({names, versions, chainId, tokenAddress, domainSeparator, salt}) {
    const domainTypes = [
        {
            fields: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' }
            ],
            hasSalt: false
        },
        {
            fields: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
                { name: 'salt', type: 'bytes32' }
            ],
            hasSalt: true
        }
    ];

    for (const name of names) {
        for (const version of versions) {
            for (const item of domainTypes) {

                const domain = {
                    name,
                    version,
                    chainId: BigInt(chainId),
                    verifyingContract: tokenAddress
                };

                if (item.hasSalt) {
                    domain.salt = salt;
                }

                const calculated = TypedData.hashDomain({
                    domain,
                    types: {
                        EIP712Domain: item.fields
                    }
                });

                if (
                    calculated.toLowerCase() ===
                    domainSeparator.toLowerCase()
                ) {
                    domain.chainId = Number(domain.chainId);
					return {
                        name,
                        version,
                        domain,
                        EIP712Domain: item.fields,
                        hasSalt: item.hasSalt
                    };
                }
            }
        }
    }
    return null;
}



export function buildEip2612BytesData(params) {
    const result = findPermitDomain({
        names: params.names,
        versions: Array.from(
            { length: 10 },
            (_, i) => String(i + 1)
        ),
        chainId: params.chainId,
        tokenAddress: params.tokenAddress,
        domainSeparator: params.domainSeparator,
        salt: params.salt
    });
    if (!result) {
        return null;
    }
    const typedData = {
        domain: result.domain,
        types: {
            EIP712Domain: result.EIP712Domain,
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
    };//console.log(typedData);
    return {
        method: 'eth_signTypedData_v4',
        params: [
            params.account,
            JSON.stringify(typedData)
        ]
    };
}



export function encodeEip2612BytesPermit({
    owner,
    spender,
    value,
    deadline,
    signature
}) {
    if (
        typeof signature !== 'string' ||
        !/^0x([0-9a-fA-F]{2})+$/.test(signature)
    ) {
        throw new Error('Invalid signature');
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
                { name: 'signature', type: 'bytes' }
            ],
            outputs: []
        }],
        functionName: 'permit',
        args: [
            owner,
            spender,
            BigInt(value),
            BigInt(deadline),
            signature
        ]
    });
}

