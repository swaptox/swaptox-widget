'use strict';
function htmlProperty(e) {
	if (!e || typeof e !== 'object') return;
	const t = document.documentElement.style;
	Object.keys(e).forEach((n => {
		t.setProperty(n, e[n])
	}))
};
export {htmlProperty};