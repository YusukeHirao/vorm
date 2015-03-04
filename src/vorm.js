(function () {
	'use strict';

	var document = this.document;

	var vorm = function (formNameOrNode, vormOptions) {
		var formNode;
		if (typeof formNameOrNode === 'string') {
			formNode = document.querySelector('[name="' + formNameOrNode + '"]');
			if (!formNode) {
				throw new TypeError('A Form element was not found by name: ' + formNameOrNode);
			}
		} else {
			formNode = formNameOrNode || {}; // if {} then throw Error
		}
		if (formNode.nodeName !== 'FORM') {
			throw new TypeError('A got element is not a Form element');
		}
		return new vorm.FormElement(formNode);
	};

	vorm.FormElement = function (el) {
		this.el = el;
	};

	this.vorm = vorm;

}).call(this);
