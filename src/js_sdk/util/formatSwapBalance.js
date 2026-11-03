
const getZeroQuantity = (str) => {
    if (!str) return 0;
    const match = str.match(/^0+/);
    return match ? match[0].length : 0;
};


export const formatSwapBalance = (balance, fractionDigits = 6) => {
    if (!balance || balance === '0' || balance === 0) return '0';
    
    const strBalance = balance.toString().trim();
    const [integerPart, decimalPart = ''] = strBalance.split('.');

    // 1. 处理超大数值 (>= 100,000,000)
    if (integerPart.length >= 9) {
        return new Intl.NumberFormat('en-US', {
            notation: 'standard',
            compactDisplay: 'short',
			minimumFractionDigits‌: 0,
            maximumFractionDigits: 0
        }).format(strBalance); // 传入完整数字，让 Intl 自行处理进位
    }

    // 2. 格式化整数部分（千分位）
    const formattedInteger = new Intl.NumberFormat('en-US').format(integerPart);

    // 3. 处理小数部分
    if (!decimalPart) return formattedInteger;

    const zeroCount = getZeroQuantity(decimalPart);
	// 截取并去除末尾无效的 0
    let processedDecimal = decimalPart.slice(0, zeroCount+fractionDigits).replace(/0+$/, '');

    // 如果截取后小数部分全是 0 (比如 1.000001 截取 4 位变 1.0000)
    // 则直接返回整数部分
    if (!processedDecimal) return formattedInteger;

    return `${formattedInteger}.${processedDecimal}`;
};
