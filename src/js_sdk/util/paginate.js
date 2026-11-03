/**
 * 数组分页函数
 * @param {Array} array 原始地址数组
 * @param {number} pageSize 每页显示的数量
 */
export const paginate = (array, pageSize = 10) => {
    const uniqueList = [...new Set(array.map(addr => addr.toLowerCase()))];
    const result = [];
    for (let i = 0; i < uniqueList.length; i += pageSize) {
        result.push(uniqueList.slice(i, i + pageSize));
    }
    return result;
};