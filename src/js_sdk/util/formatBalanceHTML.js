import {html} from 'lit';

// 获取小数位开头的连续零的个数
const getZeroQuantity = (str) => {
    if (!str) return 0;
    const match = str.match(/^0+/);
    return match ? match[0].length : 0;
};

//₀ ₁ ₂ ₃ ₄ ₅ ₆ ₇ ₈ ₉

const SpecialNum = {
	'0': '₀',
	'1': '₁',
	'2': '₂',
	'3': '₃',
	'4': '₄',
	'5': '₅',
	'6': '₆',
	'7': '₇',
	'8': '₈',
	'9': '₉',
};

/**
 * Web3 余额格式化工具
 * @param {string|number} balance 已经 formatUnits 过的字符串
 */

export const formatBalanceHTML = (balance) => {
    if (!balance || balance === '0' || balance === '0.0') return '0';
    balance = balance.toString().trim();

    // 拆分整数和小数
    const [integerPart, decimalPart = ''] = balance.split('.');

    // 1. 处理超大数值 (>= 1,000,000)
    if (integerPart.length >= 7) {
        return new Intl.NumberFormat('en-US', {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 2
        }).format(balance);
    }

    // 2. 处理普通数值 (>= 0.0001)
    // 整数部分加千分位
    const formattedInteger = new Intl.NumberFormat('en-US').format(integerPart);

    const zeroCount = getZeroQuantity(decimalPart);

    // 如果 0 的个数小于 4，正常显示
    if (zeroCount < 4) {
        // 截取前 6 位，并去掉末尾无意义的 0
        let subDecimals = decimalPart.slice(0, zeroCount + fractionDigits).replace(/0+$/, '');
        return subDecimals ? `${formattedInteger}.${subDecimals}` : formattedInteger;
    }

    // 3. 处理极小数值 (0.0000123 -> 0.0{4}123)
    let significantPart = decimalPart.slice(zeroCount, zeroCount + 4); // 取有效位 4 位
    significantPart = significantPart.replace(/0+$/, ''); // 去掉有效位末尾的 0
    
	// 转换下标
	const xiaoStr = zeroCount.toString().split('').map(char => SpecialNum[char] || '').join('');
	
	const xiaoHTML = html`${formattedInteger}.0<code style="position:relative;top:1px;font-weight:500;">${xiaoStr}</code>${significantPart}`;
    return xiaoHTML;
};