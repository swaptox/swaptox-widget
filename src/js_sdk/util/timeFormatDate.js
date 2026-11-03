export const timeFormatDate = function(date, format = 'yyyy-MM-dd hh:mm:ss') {
	if (!(date instanceof Date)) date = new Date(date);
	var dateInfo = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds(),
		'S+': date.getMilliseconds()
	};
	if (/(y+)/i.test(format)) {
		format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (var k in dateInfo) {
		if (new RegExp('(' + k + ')').test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? dateInfo[k] : ('00' + dateInfo[k]).substr((
				'' + dateInfo[k]).length));
		}
	}
	return format;
};