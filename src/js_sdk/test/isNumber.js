

export function isNumber(val) {
	if (!val) return false;
	const num = Number(val);
	if (isNaN(num) || !isFinite(num) || num <= 0) {
	    return false;
	}
	return true;
}