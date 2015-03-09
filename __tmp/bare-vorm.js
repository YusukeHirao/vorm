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
        window.addEventListener('DOMContentLoaded', this._createVormObject.bind(this, formNameOrFormNode, rulesOption), false);
    };
    Vorm.prototype._createVormObject = function (formNameOrFormNode, rulesOption) {
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
var Rule = (function () {
    function Rule(methods) {
        this.name = null;
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
                param = methodInfo[0].replace(decodeParam, function (paramVariable) { return Util.paramList[paramVariable]; });
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
    }
    Rule.prototype.toString = function () {
        return this.name + ':' + this.method;
    };
    return Rule;
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
                param = methodInfo[0].replace(decodeParam, function (paramVariable) { return Util.paramList[paramVariable]; });
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
var Field = (function () {
    function Field(el, ruleQuery) {
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
        this.bindEvent();
    }
    Field.prototype.bindEvent = function () {
        var _this = this;
        this.el.addEventListener('blur', function (e) {
            var field = e.target;
            field.value = _this._convert(field.value);
        });
    };
    Field.prototype._convert = function (value) {
        // 登録された順番にコンバート
        // 遅延評価的なことはしない
        var result = value;
        _.each(this.rules, function (rule) {
            if (rule && rule.name === 'convert') {
                result = rule.convert(result);
            }
        });
        return result;
    };
    return Field;
})();
var FieldList = (function () {
    function FieldList(vorm, rulesOption) {
        this._ = [];
        this.__ = {};
        var fieldName;
        var ruleQuery;
        var formElem;
        var index;
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
                // console.log(field);
                index = this._.length;
                this._[index] = field;
                this.__[fieldName] = index;
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
                param = methodInfo[0].replace(decodeParam, function (paramVariable) { return Util.paramList[paramVariable]; });
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
var Util = (function () {
    function Util() {
    }
    Util.queryRuleSet = function (ruleQuery) {
        //return ruleQuery.match(/[a-z][a-z0-9]*(?:(?::|\.)[a-z][a-z0-9]*(?:\.[a-z][a-z0-9]*)?(?:\((?:.+(?:,\s*.+)*)?\))?)?/ig) || [];
        var result = [];
        var quoteEscapedRuleQuery = ruleQuery.replace(/(?:"[^"]*")|('[^']*')/g, function (quotedString) {
            var quotedStringVariable = Util.quotedStringVariablePrefix + Util.quotedStringVariableCounter;
            Util.quotedStringList[quotedStringVariable] = quotedString;
            Util.quotedStringVariableCounter++;
            return quotedStringVariable;
        });
        var paramEscapedRuleQuery = ruleQuery.replace(/\([^\(]*\)/g, function (param) {
            var paramVariable = Util.paramVariablePrefix + Util.paramVariableCounter;
            Util.paramList[paramVariable] = param;
            Util.paramVariableCounter++;
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
    Util.quotedStringList = {};
    Util.quotedStringVariableCounter = 0;
    Util.paramList = {};
    Util.paramVariableCounter = 0;
    return Util;
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
var customRules;
(function (customRules) {
    customRules.hiragana = {
        convert: function (value) {
            return jaco.hiraganize(value);
        },
        is: function (value) {
            return new jaco.Jaco(value).isOnlyHiragana();
        }
    };
})(customRules || (customRules = {}));
/// <reference path="../typings/bundle.d.ts" />
/// <reference path="../bower_components/jaco/lib/jaco.d.ts" />
/// <reference path="types.ts" />
/// <reference path="IConvert.ts" />
/// <reference path="IFilter.ts" />
/// <reference path="IRule.ts" />
/// <reference path="IRulesOption.ts" />
/// <reference path="vorm.ts" />
/// <reference path="Rule.ts" />
/// <reference path="Convert.ts" />
/// <reference path="Field.ts" />
/// <reference path="FieldList.ts" />
/// <reference path="Group.ts" />
/// <reference path="Is.ts" />
/// <reference path="Required.ts" />
/// <reference path="Util.ts" />
/// <reference path="Write.ts" />
/// <reference path="customRules/ICustomRule.ts" />
/// <reference path="customRules/hiragana.ts" />
