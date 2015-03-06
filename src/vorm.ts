class Vorm {

	public form: HTMLFormElement;
	public fields: FieldList;

	constructor (formNameOrFormNode: string | HTMLElement, rulesOption: IRulesOption) {

		if (this instanceof Vorm) {
			this._init(formNameOrFormNode, rulesOption);
		} else {
			return new Vorm(formNameOrFormNode, rulesOption);
		}

	}

	private _init (formNameOrFormNode: string | HTMLElement, rulesOption: IRulesOption): void {

		var formNode: HTMLElement;

		if (typeof formNameOrFormNode === 'string') {
			formNode = <HTMLElement> document.querySelector('[name="' + formNameOrFormNode + '"]');
			if (!formNode) {
				throw new TypeError('A Form element was not found by name: ' + formNameOrFormNode);
			}
		} else {
			formNode = formNameOrFormNode;
			if (!formNode.nodeName) {
				throw new TypeError('Type of a first argument is not HTMLElement');
			}
		}
		if (formNode.nodeName !== 'FORM') {
			throw new TypeError('A got element is not a Form element');
		}

		this.form = <HTMLFormElement> formNode;

		this.fields = new FieldList(this, rulesOption);

	}

}

type HTMLFormItemElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

interface IRulesOption {
	[fieldName: string]: string;
}

class FieldList {

	private _: Field[];
	private __: { [fieldName: string]: number };

	constructor (vorm: Vorm, rulesOption: IRulesOption) {

		var fieldName: string;
		var ruleQuery: string;
		var formElem: HTMLFormItemElement;
		var field: Field;
		for (fieldName in rulesOption) {
			if (rulesOption.hasOwnProperty(fieldName)) {
				ruleQuery = rulesOption[fieldName];
				formElem = <HTMLFormItemElement> vorm.form.querySelector('[name="' + fieldName + '"]');
				if (formElem) {
					field = new Field(formElem, ruleQuery);
				} else {
					throw new Error('Invaid option. Not found element of [name="' + fieldName + '"].');
				}
				// console.log(field);
			}
		}

	}

	public ref (index: number | string): Field {
		if (typeof index === 'string') {
			return this._[this.__[index]];
		} else {
			return this._[index];
		}
	}

}

class Field {

	public el: HTMLFormItemElement;
	public type: string;
	public required: boolean = false;
	public rules: IRule[];

	constructor (el: HTMLFormItemElement, ruleQuery: string) {

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
				// TODO: Error Message
				throw new TypeError('');
			}
		}

		this.rules = Util.queryRuleSet(ruleQuery);

		el.addEventListener('blur', (e: Event) => {

			var field = <HTMLFormItemElement>e.target;
			field.value = this._convert(field.value);

		});

	}

	private _convert (value) {
		var result;
		_.each(this.rules, (rule) => {
			if (rule && rule.name === 'convert') {
				result = rule.convert(value);
			} else {
				result = value;
			}
		});
		return result;
	}

}

interface IFilter {
	(value: string): boolean;
}

interface IConvert {
	(value: string): string;
}

interface IRule {
	name: string;
	method: string;
	option: string;
	params: string[];
	priority: number;
	dependence: string[];
	when: any;
	filter?: IFilter;
	convert?: IConvert;
}

class Required implements IRule {

	public name: string = 'required';
	public method: string = 'normal';
	public option: string;
	public params: string[] = [];
	public priority: number = 1000;
	public dependence: string[] = [];
	public when: any;

	public filter (value: string): boolean {
		return value !== '';
	}

	toString (): string {
		return this.name + ':' + this.method;
	}

}

class Is implements IRule {

	public name: string = 'is';
	public method: string;
	public option: string;
	public params: string[] = [];
	public priority: number = 100;
	public dependence: string[] = [];
	public when: any;

	private _customFilter: IFilter;

	constructor (methods: string[], customFilter?: IFilter) {


		var decodeParam: RegExp = new RegExp(Util.paramVariablePrefix.replace(/\$/g, '\\$') + '[0-9]+', 'ig');

		var methodInfo: string[];
		var methodName: string;
		var param: string;
		if (methods && methods[0]) {
			methodInfo = methods[0].match(decodeParam);
			methodName = methods[0].replace(decodeParam, '');
			if (methodInfo && methodInfo[0]) {
				param = methodInfo[0].replace(decodeParam, (paramVariable: string): string => paramList[paramVariable]);
			}
		}
		var options: string[] = methodName.split('.');
		var option: string;
		if (options && options.length) {
			methodName = options.shift();
			option = options[0];
		}
		// console.log(methodName, option, param);


		this._customFilter = customFilter;
	}

	public filter (value: string): boolean {
		return this._customFilter(value);
	}

	toString (): string {
		return this.name + ':' + this.method;
	}

}

class Convert implements IRule {

	public name: string = 'convert';
	public method: string;
	public option: string;
	public params: string[] = [];
	public priority: number = 10000;
	public dependence: string[] = [];
	public when: any;

	private _customConvert: IConvert;

	constructor (methods: string[]) {
		// this.method = method;
		var decodeParam: RegExp = new RegExp(Util.paramVariablePrefix.replace(/\$/g, '\\$') + '[0-9]+', 'ig');

		var methodInfo: string[];
		var methodName: string;
		var param: string;
		if (methods && methods[0]) {
			methodInfo = methods[0].match(decodeParam);
			methodName = methods[0].replace(decodeParam, '');
			if (methodInfo && methodInfo[0]) {
				param = methodInfo[0].replace(decodeParam, (paramVariable: string): string => paramList[paramVariable]);
			}
		}
		var options: string[] = methodName.split('.');
		var option: string;
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

	public convert (value: string): string {
		if (this._customConvert) {
			return this._customConvert(value);
		} else {
			return value;
		}
	}

	toString (): string {
		return this.name + ':' + this.method;
	}

}

class Write implements IRule {

	public name: string = 'write';
	public method: string;
	public option: string;
	public params: string[] = [];
	public priority: number = 10000;
	public dependence: string[] = [];
	public when: any;

	private _customConvert: IConvert;

	constructor (methods: string[], customConvert?: IConvert) {
		// this.method = method;
		this._customConvert = customConvert;
	}

	public convert (value: string): string {
		return this._customConvert(value);
	}

	toString (): string {
		return this.name + ':' + this.method;
	}

}

class Group implements IRule {

	public name: string = 'group';
	public method: string;
	public option: string;
	public params: string[] = [];
	public priority: number = 10000;
	public dependence: string[] = [];
	public when: any;

	private _customConvert: IConvert;

	constructor (methods: string[], customConvert?: IConvert) {
		// this.method = method;
		this._customConvert = customConvert;
	}

	public convert (value: string): string {
		return this._customConvert(value);
	}

	toString (): string {
		return this.name + ':' + this.method;
	}

}

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


var quotedStringList: { [variable: string]: string } = {};
var quotedStringVariableCounter: number = 0;
var paramList: { [variable: string]: string } = {};
var paramVariableCounter: number = 0;

class Util {

	static quotedStringVariablePrefix: string = '$______';
	static paramVariablePrefix: string = '$$______'

	static queryRuleSet (ruleQuery: string): IRule[] {

		//return ruleQuery.match(/[a-z][a-z0-9]*(?:(?::|\.)[a-z][a-z0-9]*(?:\.[a-z][a-z0-9]*)?(?:\((?:.+(?:,\s*.+)*)?\))?)?/ig) || [];

		var result: string[] = [];


		var quoteEscapedRuleQuery: string = ruleQuery.replace(/(?:"[^"]*")|('[^']*')/g, (quotedString: string): string => {
			var quotedStringVariable: string = Util.quotedStringVariablePrefix + quotedStringVariableCounter;
			quotedStringList[quotedStringVariable] = quotedString;
			quotedStringVariableCounter++;
			return quotedStringVariable;
		});


		var paramEscapedRuleQuery: string = ruleQuery.replace(/\([^\(]*\)/g, (param: string): string => {
			var paramVariable: string = Util.paramVariablePrefix + paramVariableCounter;
			paramList[paramVariable] = param;
			paramVariableCounter++;
			return paramVariable;
		});

		var ruleQueries: string[] = paramEscapedRuleQuery.split(/\s+/g);


		var rules: IRule[] = _.map<string, IRule>(ruleQueries, (qString: string, i: number): IRule => {
			var q: string[] = qString.split(':');
			var ruleName: string = q.shift();
			var methods: string[] = q;
			var rule: IRule;

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
					} else {
						return;
					}
			}
			return rule;
		});


		return rules;

	}

	static nodeStringify (node: Node): string {
		var nodeName: string = node['nodeName'] || 'UnknownNode';
		var id: string = node['id'] || '';
		var classes: string[] = node['className'].split(/\s+/g) || [];
		var type: string = node['type'] || '';
		var result: string = nodeName;
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
	}

	static getFormName (): string {
		var result: string[] = [];
		var nodes: NodeList = document.querySelectorAll('form [name]');
		var node: Node;
		var i: number;
		var l: number = nodes.length;
		for (i = 0; i < l; i++) {
			node = nodes[i];
			if (node['name']) {
				result.push(node['name']);
			} else {
				result.push('[name is empty]: ' + Util.nodeStringify(node));
			}
		}
		return result.join('\n');
	}

}
