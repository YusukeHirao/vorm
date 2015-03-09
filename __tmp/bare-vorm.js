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
        this.dependence = [];
        var decodeParam = new RegExp(Util.paramVariablePrefix.replace(/\$/g, '\\$') + '[0-9]+', 'ig');
        var methodInfo;
        var methodName;
        var params;
        if (methods && methods[0]) {
            methodInfo = methods[0].match(decodeParam);
            methodName = methods[0].replace(decodeParam, '');
            if (methodInfo && methodInfo[0]) {
                params = methodInfo[0].replace(decodeParam, function (paramVariable) { return Util.paramList[paramVariable]; });
                params = params.slice(1, -1);
            }
        }
        var options = methodName.split('.');
        var option;
        if (options && options.length) {
            methodName = options.shift();
            option = options[0];
        }
        this.method = methodName;
        this.option = option;
        if (params) {
            this.params = params.split(/,/).map(function (param) { return param.trim(); });
        }
    }
    Rule.prototype.toString = function () {
        return this.name + ':' + this.method;
    };
    return Rule;
})();
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Convert = (function (_super) {
    __extends(Convert, _super);
    function Convert(methods) {
        _super.call(this, methods);
        this.name = 'convert';
        this.priority = 10000;
        var cRule = customRules[this.method];
        if (cRule && cRule.convert) {
            this._customConvert = cRule.convert;
        }
        console.log('%c' + this.name, 'color: orange; font-weight: bold', this.method, this.option, this.params);
    }
    Convert.prototype.convert = function (value) {
        var options = {};
        options[this.option] = true;
        if (this._customConvert) {
            return this._customConvert(value, options, this.params);
        }
        else {
            return value;
        }
    };
    return Convert;
})(Rule);
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
            if (_this._is(field.value)) {
                _this.el.classList.remove('invalid');
            }
            else {
                _this.el.classList.add('invalid');
            }
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
    Field.prototype._is = function (value) {
        // 登録された順番にコンバート
        // 遅延評価的なことはしない
        var result = true;
        _.each(this.rules, function (rule) {
            if (rule && rule.name === 'is') {
                console.log(rule.name, rule.method);
                if (!rule.filter(value)) {
                    result = false;
                }
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
    function Group(methods) {
        this.name = 'group';
        this.params = [];
        this.priority = 10000;
        this.dependence = [];
    }
    return Group;
})();
var Is = (function (_super) {
    __extends(Is, _super);
    function Is(methods) {
        _super.call(this, methods);
        this.name = 'is';
        this.priority = 100;
        var cRule = customRules[this.method];
        if (cRule && cRule.is) {
            this._customFilter = cRule.is;
        }
        console.log('%c' + this.name, 'color: green; font-weight: bold', this.method, this.option, this.params);
    }
    Is.prototype.filter = function (value) {
        var options = {};
        options[this.option] = true;
        if (this._customFilter) {
            return this._customFilter(value, options, this.params);
        }
        else {
            return true;
        }
    };
    return Is;
})(Rule);
var Required = (function () {
    function Required() {
        this.name = 'required';
        this.method = 'normal';
        this.params = [];
        this.priority = 1000;
        this.dependence = [];
    }
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
    Util.parseComparison = function (condition, defaultLeft) {
        var operators = condition.match(/(?:<|>)?=?/i);
        var operator;
        var statement;
        var left;
        var right;
        var numericLeft;
        var numericRight;
        if (operators || operators.length) {
            operator = operators[0];
            statement = condition.split(operator);
            left = statement[0] || defaultLeft;
            right = statement[1];
            if (operator === '=') {
                return left === right;
            }
            numericLeft = new jaco.Jaco(left).toNumber();
            numericRight = new jaco.Jaco(right).toNumber();
            switch (operator) {
                case '<': return numericLeft < numericRight;
                case '>': return numericLeft > numericRight;
                case '<=': return numericLeft <= numericRight;
                case '>=': return numericLeft >= numericRight;
            }
        }
        else {
            throw new Error();
        }
        return true;
    };
    Util.zerofill = function (value, digits) {
        return (new Array(digits).join('0') + value).slice(digits * -1);
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
    function Write(methods) {
        this.name = 'write';
        this.params = [];
        this.priority = 10000;
        this.dependence = [];
        // this.method = method;
    }
    return Write;
})();
var customRules;
(function (customRules) {
    customRules.hiragana = {
        convert: function (value, options, params) {
            return jaco.hiraganize(value);
        },
        is: function (value, options, params) {
            return new jaco.Jaco(value).isOnlyHiragana();
        }
    };
})(customRules || (customRules = {}));
var customRules;
(function (customRules) {
    customRules.katakana = {
        convert: function (value, options, params) {
            return jaco.katakanize(value);
        },
        is: function (value, options, params) {
            return new jaco.Jaco(value).isOnlyKatakana();
        }
    };
})(customRules || (customRules = {}));
var customRules;
(function (customRules) {
    customRules.integer = {
        convert: function (value, options, params) {
            if (options.zerofill) {
                return Util.zerofill(new jaco.Jaco(value).toNumeric(false, false).toString(), +params[0]);
            }
            else {
                return new jaco.Jaco(value).toNumeric(options.unsigned, false).toString();
            }
        },
        is: function (value, options, params) {
            return new jaco.Jaco(value).isNumeric(options.unsigned || options.zerofill, false);
        }
    };
})(customRules || (customRules = {}));
var customRules;
(function (customRules) {
    customRules.comparison = {
        is: function (value, options, params) {
            return Util.parseComparison(params[0], value);
        }
    };
})(customRules || (customRules = {}));
var customRules;
(function (customRules) {
    customRules.beautify = {
        convert: function (value, options, params) {
            return new jaco.Jaco(value).toNarrow().toWideKatakana().replaceMap({ '~': '〜', '\\(': '（', '\\)': '）' }).toString();
        }
    };
})(customRules || (customRules = {}));
var customRules;
(function (customRules) {
    var patternMail = /^([0-9a-z\.!\#$%&'*+\-\/=?^_`{|}~\(\)<>\[\]:;@,"\\\u0020]+)@((?:[0-9a-z][0-9a-z-]*\.)+[0-9a-z]{2,6}|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])$/i;
    var patternQuoted = /^".+"$/g;
    var patternQuoteBeforeAndAfter = /^"|"$/g;
    var patternEscapedBadChars = /\\"|\\\\/g;
    var patternBadChars = /"|\\/;
    var patternBadDot = /^\.|\.{2,}|\.$/i;
    var patternlocalNonQuoteds = /^[0-9a-z\.!#$%&'*+\-\/=?^_`{|}~]+$/i;
    customRules.email = {
        is: function (value, options, params) {
            var mailMatch;
            var local;
            var domain;
            var escaped;
            if (value.length > 256) {
                return false;
            }
            mailMatch = value.match(patternMail);
            if (!mailMatch) {
                return false;
            }
            local = mailMatch[1];
            domain = mailMatch[2];
            if (domain.length > 255) {
                return false;
            }
            if (local.length > 64) {
                return false;
            }
            if (patternQuoted.test(local)) {
                local = local.replace(patternQuoteBeforeAndAfter, '');
                escaped = local.replace(patternEscapedBadChars, '');
                if (patternBadChars.test(escaped)) {
                    return false;
                }
                return true;
            }
            if (patternBadDot.test(local)) {
                return false;
            }
            if (!patternlocalNonQuoteds.test(local)) {
                return false;
            }
            return true;
        }
    };
})(customRules || (customRules = {}));
var customRules;
(function (customRules) {
    customRules.length = {
        is: function (value, options, params) {
            return new jaco.Jaco(value).size() === new jaco.Jaco(params[0]).toNumber();
        }
    };
})(customRules || (customRules = {}));
var customRules;
(function (customRules) {
    customRules.maxlength = {
        is: function (value, options, params) {
            return new jaco.Jaco(value).size() <= new jaco.Jaco(params[0]).toNumber();
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
/// <reference path="customRules/katakana.ts" />
/// <reference path="customRules/integer.ts" />
/// <reference path="customRules/comparison.ts" />
/// <reference path="customRules/beautify.ts" />
/// <reference path="customRules/email.ts" />
/// <reference path="customRules/length.ts" />
/// <reference path="customRules/maxlength.ts" />
