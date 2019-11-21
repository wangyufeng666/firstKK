function StringBuffer() {
	this._strs = new Array;
}

StringBuffer.prototype.append = function(str) {
	this._strs.push(str);
};

StringBuffer.prototype.toString = function() {
	this._strs.join(" ");
};
