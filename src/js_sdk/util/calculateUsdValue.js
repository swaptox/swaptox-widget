import {viemUtils} from '../viem/utils.js';


export const calculateUsdValue = (inputAmount, baseAmount, baseUsdPrice) => {
    if (!baseUsdPrice || baseAmount <= 0n || inputAmount <= 0n) return '0';
    
    try {
        // 1. 将字符串价格转换为 18 位精度的 BigInt
        // 这样无论价格小数位是多少，我们都拥有统一的 10^18 放大系数
        const priceBI = viemUtils.parseUnits(baseUsdPrice, 18);

        // 2. 核心公式: (输入量 * 价格) / 基准量
        // 注意：由于 priceBI 已经放大了 10^18，所以计算结果 scaledValue 也携带了 18 位小数
        const scaledValue = (inputAmount * priceBI) / baseAmount;

        // 3. 将携带 18 位小数的 BigInt 还原为带小数点的字符串
        // formatUnits 会自动处理小数点位置并去掉末尾多余的 0
        const result = viemUtils.formatUnits(scaledValue, 18);

        // 4. 极端情况处理：如果数值极小，formatUnits 可能会返回 "0.0000..."，
        // 根据业务需求，如果结果是 "0" 的变体，直接返回 "0"
        return parseFloat(result) === 0 ? '0' : result;
        
    } catch (error) {
        console.error("Price calculation error:", error);
        return '0';
    }
};