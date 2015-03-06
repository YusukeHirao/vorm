/**
 * vorm - v0.1.0
 * update: 2015-03-07
 * Author: YusukeHirao []
 * Github: https://github.com/YusukeHirao/vorm.git
 * License: Licensed under the MIT License
 */

(function () {
	"use strict";

	var global = this;

	var isBrowser = 'document' in global;
	var isWebWorkers = 'WorkerLocation' in global;
	var isNode = 'process' in global;

var Vorm = (function () {
    function Vorm(formNameOrFormNode, rulesOption) {
        if (this instanceof Vorm) {
            this._init(formNameOrFormNode, rulesOption);
        }
        else {
            return new Vorm(formNameOrFormNode, rulesOption);
        }
    }
    Vorm.prototype._init = function (formNameOrFormNode, rulesOption) {
        var formNode;
        if (typeof formNameOrFormNode === 'string') {
            formNode = document.querySelector('[name="' + formNameOrFormNode + '"]');
            if (!formNode) {
                throw new TypeError('A Form element was not found by name: ' + formNameOrFormNode);
            }
        }
        else {
            formNode = formNameOrFormNode;
            if (!formNode.nodeName) {
                throw new TypeError('Type of a first argument is not HTMLElement');
            }
        }
        if (formNode.nodeName !== 'FORM') {
            throw new TypeError('A got element is not a Form element');
        }
        this.form = formNode;
        this.fields = new FieldList(this, rulesOption);
    };
    return Vorm;
})();
var FieldList = (function () {
    function FieldList(vorm, rulesOption) {
        var fieldName;
        var ruleQuery;
        var formElem;
        var field;
        for (fieldName in rulesOption) {
            if (rulesOption.hasOwnProperty(fieldName)) {
                ruleQuery = rulesOption[fieldName];
                formElem = vorm.form.querySelector('[name="' + fieldName + '"]');
                if (formElem) {
                    field = new Field(formElem, ruleQuery);
                }
                else {
                    throw new Error('Invaid option. Not found element of [name="' + fieldName + '"].');
                }
            }
        }
    }
    FieldList.prototype.ref = function (index) {
        if (typeof index === 'string') {
            return this._[this.__[index]];
        }
        else {
            return this._[index];
        }
    };
    return FieldList;
})();
var Field = (function () {
    function Field(el, ruleQuery) {
        var _this = this;
        this.required = false;
        this.el = el;
        switch (el.nodeName) {
            case 'INPUT': {
                this.type = el.type;
                break;
            }
            case 'SELECT': {
                this.type = 'select';
                break;
            }
            case 'TEXTAREA': {
                this.type = 'textarea';
                break;
            }
            default: {
                throw new TypeError('');
            }
        }
        this.rules = Util.queryRuleSet(ruleQuery);
        el.addEventListener('blur', function (e) {
            var field = e.target;
            field.value = _this._convert(field.value);
        });
    }
    Field.prototype._convert = function (value) {
        var result;
        _.each(this.rules, function (rule) {
            if (rule && rule.name === 'convert') {
                result = rule.convert(value);
            }
            else {
                result = value;
            }
        });
        return result;
    };
    return Field;
})();
var Required = (function () {
    function Required() {
        this.name = 'required';
        this.method = 'normal';
        this.params = [];
        this.priority = 1000;
        this.dependence = [];
    }
    Required.prototype.filter = function (value) {
        return value !== '';
    };
    Required.prototype.toString = function () {
        return this.name + ':' + this.method;
    };
    return Required;
})();
var Is = (function () {
    function Is(methods, customFilter) {
        this.name = 'is';
        this.params = [];
        this.priority = 100;
        this.dependence = [];
        var decodeParam = new RegExp(Util.paramVariablePrefix.replace(/\$/g, '\\$') + '[0-9]+', 'ig');
        var methodInfo;
        var methodName;
        var param;
        if (methods && methods[0]) {
            methodInfo = methods[0].match(decodeParam);
            methodName = methods[0].replace(decodeParam, '');
            if (methodInfo && methodInfo[0]) {
                param = methodInfo[0].replace(decodeParam, function (paramVariable) { return paramList[paramVariable]; });
            }
        }
        var options = methodName.split('.');
        var option;
        if (options && options.length) {
            methodName = options.shift();
            option = options[0];
        }
        // console.log(methodName, option, param);
        this._customFilter = customFilter;
    }
    Is.prototype.filter = function (value) {
        return this._customFilter(value);
    };
    Is.prototype.toString = function () {
        return this.name + ':' + this.method;
    };
    return Is;
})();
var Convert = (function () {
    function Convert(methods) {
        this.name = 'convert';
        this.params = [];
        this.priority = 10000;
        this.dependence = [];
        // this.method = method;
        var decodeParam = new RegExp(Util.paramVariablePrefix.replace(/\$/g, '\\$') + '[0-9]+', 'ig');
        var methodInfo;
        var methodName;
        var param;
        if (methods && methods[0]) {
            methodInfo = methods[0].match(decodeParam);
            methodName = methods[0].replace(decodeParam, '');
            if (methodInfo && methodInfo[0]) {
                param = methodInfo[0].replace(decodeParam, function (paramVariable) { return paramList[paramVariable]; });
            }
        }
        var options = methodName.split('.');
        var option;
        if (options && options.length) {
            methodName = options.shift();
            option = options[0];
        }
        // console.log(methodName, option, param);
        this.method = methodName;
        this.option = option;
        this.params = [param];
        var cRule = customRules[methodName];
        if (cRule && cRule.convert) {
            this._customConvert = cRule.convert;
        }
    }
    Convert.prototype.convert = function (value) {
        if (this._customConvert) {
            return this._customConvert(value);
        }
        else {
            return value;
        }
    };
    Convert.prototype.toString = function () {
        return this.name + ':' + this.method;
    };
    return Convert;
})();
var Write = (function () {
    function Write(methods, customConvert) {
        this.name = 'write';
        this.params = [];
        this.priority = 10000;
        this.dependence = [];
        // this.method = method;
        this._customConvert = customConvert;
    }
    Write.prototype.convert = function (value) {
        return this._customConvert(value);
    };
    Write.prototype.toString = function () {
        return this.name + ':' + this.method;
    };
    return Write;
})();
var Group = (function () {
    function Group(methods, customConvert) {
        this.name = 'group';
        this.params = [];
        this.priority = 10000;
        this.dependence = [];
        // this.method = method;
        this._customConvert = customConvert;
    }
    Group.prototype.convert = function (value) {
        return this._customConvert(value);
    };
    Group.prototype.toString = function () {
        return this.name + ':' + this.method;
    };
    return Group;
})();
var customRules = {
    hiragana: {
        convert: function (value) {
            return jaco.katakanize(value);
        },
        is: function (value) {
            return new jaco.Jaco(value).isOnlyKatakana();
        }
    }
};
var quotedStringList = {};
var quotedStringVariableCounter = 0;
var paramList = {};
var paramVariableCounter = 0;
var Util = (function () {
    function Util() {
    }
    Util.queryRuleSet = function (ruleQuery) {
        //return ruleQuery.match(/[a-z][a-z0-9]*(?:(?::|\.)[a-z][a-z0-9]*(?:\.[a-z][a-z0-9]*)?(?:\((?:.+(?:,\s*.+)*)?\))?)?/ig) || [];
        var result = [];
        var quoteEscapedRuleQuery = ruleQuery.replace(/(?:"[^"]*")|('[^']*')/g, function (quotedString) {
            var quotedStringVariable = Util.quotedStringVariablePrefix + quotedStringVariableCounter;
            quotedStringList[quotedStringVariable] = quotedString;
            quotedStringVariableCounter++;
            return quotedStringVariable;
        });
        var paramEscapedRuleQuery = ruleQuery.replace(/\([^\(]*\)/g, function (param) {
            var paramVariable = Util.paramVariablePrefix + paramVariableCounter;
            paramList[paramVariable] = param;
            paramVariableCounter++;
            return paramVariable;
        });
        var ruleQueries = paramEscapedRuleQuery.split(/\s+/g);
        var rules = _.map(ruleQueries, function (qString, i) {
            var q = qString.split(':');
            var ruleName = q.shift();
            var methods = q;
            var rule;
            switch (ruleName.toLowerCase()) {
                case 'required':
                case 'require':
                    rule = new Required();
                    break;
                case 'is':
                    rule = new Is(methods);
                    break;
                case 'convert':
                    rule = new Convert(methods);
                    break;
                case 'write':
                    rule = new Write(methods);
                    break;
                default:
                    if (/^@/.test(ruleName)) {
                        rule = new Group(methods);
                    }
                    else {
                        return;
                    }
            }
            return rule;
        });
        return rules;
    };
    Util.nodeStringify = function (node) {
        var nodeName = node['nodeName'] || 'UnknownNode';
        var id = node['id'] || '';
        var classes = node['className'].split(/\s+/g) || [];
        var type = node['type'] || '';
        var result = nodeName;
        if (type) {
            result += ':' + type;
        }
        if (id) {
            result += '#' + id;
        }
        if (classes.length) {
            result += '.' + classes.join('.');
        }
        return result;
    };
    Util.getFormName = function () {
        var result = [];
        var nodes = document.querySelectorAll('form [name]');
        var node;
        var i;
        var l = nodes.length;
        for (i = 0; i < l; i++) {
            node = nodes[i];
            if (node['name']) {
                result.push(node['name']);
            }
            else {
                result.push('[name is empty]: ' + Util.nodeStringify(node));
            }
        }
        return result.join('\n');
    };
    Util.quotedStringVariablePrefix = '$______';
    Util.paramVariablePrefix = '$$______';
    return Util;
})();
/// <reference path="../typings/bundle.d.ts" />
/// <reference path="../bower_components/jaco/lib/jaco.d.ts" />
/// <reference path="vorm.ts" />
/// <reference path="vorm.Form.ts" />


	Vorm.util = Util;

	if (isNode) {
		module.exports = Vorm;
	} else {
		global.vorm = Vorm;
	}

}).call((this || 0).self || global);