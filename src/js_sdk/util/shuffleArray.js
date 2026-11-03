export function shuffleArray(array) {
	// 复制一份，不修改原数组（符合 SDK 开发的不可变原则）
	const res = [...array];
	for (let i = res.length - 1; i > 0; i--) {
		// 随机产生一个 0 到 i 之间的索引
		const j = Math.floor(Math.random() * (i + 1));
		// 交换位置
		[res[i], res[j]] = [res[j], res[i]];
	}
	return res;
}