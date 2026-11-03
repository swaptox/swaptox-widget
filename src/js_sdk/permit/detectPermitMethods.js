const PERMIT_ABIS = {
	eip2612: [{
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

	eip2612_bytes: [{
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

	dai: [{
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
	}]
};


import {viemUtils} from '../../js_sdk/viem/utils.js';
import {networkData} from '../../data/network-data.js';
import {$app} from '../../js_sdk/index.js';



/**
 * 判断 Permit 接口模拟调用结果
 */
function classifyPermitError(error) {
	const message = [
		error?.shortMessage,
		error?.message,
		error?.details,
		error?.data?.message,
		typeof error === 'string' ? error : ''
	].filter(Boolean).join(' ').toLowerCase();

	// 明确提示 Selector 或函数不存在
	if (
		message.includes('function selector was not recognized') ||
		message.includes('unknown selector') ||
		message.includes('unknown function') ||
		message.includes('function not found') ||
		message.includes('method not found') ||
		message.includes('no fallback function')
	) {
		return 'LIKELY_UNSUPPORTED';
	}

	// 错误特征表明很可能已经进入 Permit 函数内部
	if (
		message.includes('invalid signature') ||
		message.includes('invalid signer') ||
		message.includes('invalid nonce') ||
		message.includes('nonce too low') ||
		message.includes('expired') ||
		message.includes('deadline') ||
		message.includes('invalid v') ||
		message.includes('invalid s') ||
		message.includes('invalid r')
	) {
		return 'LIKELY_SUPPORTED';
	}

	// 普通 revert、空错误、无法识别的错误
	return 'UNKNOWN';
}


/**
 * 检测 Token 是否支持三种 Permit 接口
 *
 * args:
 * {
 *     token: Token 地址,
 *     owner: 测试用户地址,
 *     spender: Router 地址,
 *     nonce: DAI Permit nonce（可选）
 * }
 */
export async function detectPermitMethods(chain, args) {
	const token = args.token.toLowerCase();
	const owner = args.owner.toLowerCase();
	const spender = args.spender.toLowerCase();

	const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);

	const zeroBytes32 = `0x${'0'.repeat(64)}`;
	const zeroSignature = `0x${'0'.repeat(130)}`;

	const tests = {
		eip2612: [
			owner,
			spender,
			1n,
			deadline,
			27,
			zeroBytes32,
			zeroBytes32
		],

		eip2612_bytes: [
			owner,
			spender,
			1n,
			deadline,
			zeroSignature
		],

		dai: [
			owner,
			spender,
			BigInt(args.nonce ?? 0),
			deadline,
			true,
			27,
			zeroBytes32,
			zeroBytes32
		]
	};

	const rpcUrls = $app.shuffleArray(networkData[chain].rpcUrls);

	const results = {};

	for (const [name, abi] of Object.entries(PERMIT_ABIS)) {
		const data = viemUtils.encodeFunctionData({
			abi,
			functionName: 'permit',
			args: tests[name]
		});

		const errors = [];
		let detected = false;

		for (let i = 0; i < rpcUrls.length; i++) {
			try {
				const response = await $app.post({
					url: rpcUrls[i],
					data: {
						jsonrpc: '2.0',
						id: 1,
						method: 'eth_call',
						params: [
							{
								from: owner,
								to: token,
								data
							},
							'latest'
						]
					}
				});

				// 部分 RPC 不会通过 HTTP 异常返回 JSON-RPC error
				if (response?.error) {
					throw response.error;
				}

				// eth_call 成功，即使返回 0x，也表示调用没有 Revert
				results[name] = {
					status: 'SUCCESS',
					supported: true,
					error: null
				};

				detected = true;
				break;

			} catch (error) {
				const status = classifyPermitError(error);

				errors.push({
					status,
					message: error?.shortMessage ||
						error?.message ||
						String(error)
				});

				// 已经有比较明确的内部错误特征，不必继续请求其他 RPC
				if (status === 'LIKELY_SUPPORTED') {
					results[name] = {
						status,
						supported: true,
						error: errors[errors.length - 1].message
					};

					detected = true;
					break;
				}
			}
		}

		if (!detected) {
			const supportedError = errors.find(
				item => item.status === 'LIKELY_SUPPORTED'
			);

			const unsupportedError = errors.find(
				item => item.status === 'LIKELY_UNSUPPORTED'
			);

			if (supportedError) {
				results[name] = {
					status: 'LIKELY_SUPPORTED',
					supported: true,
					error: supportedError.message
				};
			} else if (unsupportedError) {
				results[name] = {
					status: 'LIKELY_UNSUPPORTED',
					supported: false,
					error: unsupportedError.message
				};
			} else {
				results[name] = {
					status: 'UNKNOWN',
					supported: null,
					error: errors
				};
			}
		}
	}

	return results;
}