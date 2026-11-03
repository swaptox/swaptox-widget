import { TypedData } from '../../../js_sdk/viem/typedData.js';
import { viemUtils } from '../../../js_sdk/viem/utils.js';

function findDaiPermitDomain({
    names,
    versions,
    chainId,
    tokenAddress,
    domainSeparator,
    salt
}) {
    const domainTypes = [
        [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' }
        ],
        [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
            { name: 'salt', type: 'bytes32' }
        ]
    ];

    for (const name of names) {
        for (const version of versions) {
            for (const fields of domainTypes) {

                const domain = {
                    name,
                    version,
                    chainId: BigInt(chainId),
                    verifyingContract: tokenAddress
                };

                if (fields.some(item => item.name === 'salt')) {
                    domain.salt = salt;
                }

                const calculated = TypedData.hashDomain({
                    domain,
                    types: {
                        EIP712Domain: fields
                    }
                });

                if (
                    calculated.toLowerCase() ===
                    domainSeparator.toLowerCase()
                ) {
                    domain.chainId = Number(domain.chainId);
					return {
                        domain,
                        EIP712Domain: fields
                    };
                }
            }
        }
    }

    return null;
}








export function buildDaiPermitData(params) {

    const result = findDaiPermitDomain({
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
                { name: 'holder', type: 'address' },
                { name: 'spender', type: 'address' },
                { name: 'nonce', type: 'uint256' },
                { name: 'expiry', type: 'uint256' },
                { name: 'allowed', type: 'bool' }
            ]
        },

        primaryType: 'Permit',

        message: {
            holder: params.account,
            spender: params.routerAddress,
            nonce: params.nonce.toString(),
            expiry: params.expiry.toString(),
            allowed: true
        }
    };

    // 再次验证最终 Typed Data 的 Domain。
    const calculatedDomain = TypedData.hashDomain({
        domain: typedData.domain,
        types: {
            EIP712Domain: typedData.types.EIP712Domain
        }
    });

    if (
        calculatedDomain.toLowerCase() !==
        params.domainSeparator.toLowerCase()
    ) {
        //throw new Error('SwaptoX: INVALID_DOMAIN');
		return null;
    }
	//console.log(typedData);
    return {
        method: 'eth_signTypedData_v4',
        params: [
            params.account,
            JSON.stringify(typedData)
        ],
        //typedData
    };
}




/* const permitData = encodeDaiPermit({
    holder: account,
    spender: routerAddress,
    nonce,
    expiry,
    allowed: true,
    signature
}); */

export function encodeDaiPermit({
    holder,
    spender,
    nonce,
    expiry,
    allowed,
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
                { name: 'holder', type: 'address' },
                { name: 'spender', type: 'address' },
                { name: 'nonce', type: 'uint256' },
                { name: 'expiry', type: 'uint256' },
                { name: 'allowed', type: 'bool' },
                { name: 'v', type: 'uint8' },
                { name: 'r', type: 'bytes32' },
                { name: 's', type: 'bytes32' }
            ],
            outputs: []
        }],
        functionName: 'permit',
        args: [
            holder,
            spender,
            BigInt(nonce),
            BigInt(expiry),
            allowed,
            v,
            r,
            s
        ]
    });
}


