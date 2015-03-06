
	Vorm.util = Util;

	if (isNode) {
		module.exports = Vorm;
	} else {
		global.vorm = Vorm;
	}

}).call((this || 0).self || global);