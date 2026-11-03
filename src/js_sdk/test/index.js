'use strict';



import {isNumber} from './isNumber.js';

function object(value) {
	return Object.prototype.toString.call(value) === '[object Object]';
}
function array(value) {
	if (typeof Array.isArray === "function") {
		return Array.isArray(value);
	} else {
		return Object.prototype.toString.call(value) === "[object Array]";
	}
}

function isBoolean(value) {
  return typeof value === 'boolean';
}





export const test = {
	'isNumber': isNumber,
	'object': object,
	'array': array,
	'boolean': isBoolean,
};

