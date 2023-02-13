var util = (function(){
	function _pad(value, width, fill) {
		if (fill === undefined) {
			fill = ' ';
		}
		var strValue = "" + value;
		while (strValue.length < width) {
			strValue = fill + strValue;
		}
		return strValue;
	}
	function _getOffset(obj, offset) {
		if (!obj)
			return;
		offset.x += obj.offsetLeft;
		offset.y += obj.offsetTop;

		_getOffset(obj.offsetParent, offset);
	}
	return {
		pad: _pad,
		getOffset: _getOffset,
	};
})();
