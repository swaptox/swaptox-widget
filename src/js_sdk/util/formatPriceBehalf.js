import {viemUtils} from '../viem/utils.js';
import {formatPrice} from './formatPrice.js';

// 建议将倍率基数定义为常量
// const EXCHANGE_BASE = 10000n;

/**
 * 安全的汇率计算：先乘后除，保留 BigInt 精度
 */
const formatExchange = (num, exchange, EXCHANGE_BASE) => {
    // 全程使用 BigInt，先扩大倍数再除以基数
    // 这样即便 num 很小，乘完之后再除也能保留更多有效位
    return (num * BigInt(exchange)) / EXCHANGE_BASE;
};

export const formatPriceBehalf = (price, behalf) => {
    if (price==='0'||price===0) return `${behalf.symbol}0`;
    if (!price) return '';
    
	
	if(behalf.exchange===behalf.EXCHANGE_BASE){
		return `${behalf.symbol}${formatPrice(price, 2)}`;
	}
	
	
	
    const exchange = BigInt(behalf.exchange);
    
    // 1. 统一转换为标准高精度（假设使用 18 位，或者使用该代币实际的 decimals）
    // 不要使用 decimalPart.length，因为这会导致精度不统一
    const WORKING_DECIMALS = 18; 
    
    try {
        // 使用 viem 的 parseUnits 将字符串转为大数
        let bigPrice = viemUtils.parseUnits(price.toString(), WORKING_DECIMALS);
        
        // 2. 计算汇率
        let convertedPrice = formatExchange(bigPrice, exchange, BigInt(behalf.EXCHANGE_BASE));
        
        // 3. 转回字符串
        let strPrice = viemUtils.formatUnits(convertedPrice, WORKING_DECIMALS);
        
        // 4. 后处理：去掉末尾多余的 0，并格式化美化
        // 如果 strPrice 是 "7.500000000000000000"，处理成 "7.5"
        strPrice = strPrice.replace(/\.?0+$/, '');
        if (strPrice === '') strPrice = '0';
		
		//console.log(`formatPriceBehalf:`, price, strPrice);

        return `${behalf.symbol}${formatPrice(strPrice, 2)}`;
    } catch (e) {
        console.error("Price formatting error:", e);
        return `${behalf.symbol}0`;
    }
};