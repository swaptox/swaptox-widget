
export function replaceTemplate(str, params) {
	return str.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
		return params[key] !== undefined ? params[key] : '';
	});
};