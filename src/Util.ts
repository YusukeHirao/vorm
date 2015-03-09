class Util {

	static quotedStringVariablePrefix: string = '$______';
	static paramVariablePrefix: string = '$$______'
	static quotedStringList: { [variable: string]: string } = {};
	static quotedStringVariableCounter: number = 0;
	static paramList: { [variable: string]: string } = {};
	static paramVariableCounter: number = 0;

	static queryRuleSet (ruleQuery: string): IRule[] {

		//return ruleQuery.match(/[a-z][a-z0-9]*(?:(?::|\.)[a-z][a-z0-9]*(?:\.[a-z][a-z0-9]*)?(?:\((?:.+(?:,\s*.+)*)?\))?)?/ig) || [];

		var result: string[] = [];


		var quoteEscapedRuleQuery: string = ruleQuery.replace(/(?:"[^"]*")|('[^']*')/g, (quotedString: string): string => {
			var quotedStringVariable: string = Util.quotedStringVariablePrefix + Util.quotedStringVariableCounter;
			Util.quotedStringList[quotedStringVariable] = quotedString;
			Util.quotedStringVariableCounter++;
			return quotedStringVariable;
		});


		var paramEscapedRuleQuery: string = ruleQuery.replace(/\([^\(]*\)/g, (param: string): string => {
			var paramVariable: string = Util.paramVariablePrefix + Util.paramVariableCounter;
			Util.paramList[paramVariable] = param;
			Util.paramVariableCounter++;
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

	static parseComparison (condition: string, defaultLeft: string): boolean {
		var operators: string[] = condition.match(/(?:<|>)?=?/i);
		var operator: string;
		var statement: string[]
		var left: string;
		var right: string;
		var numericLeft: number;
		var numericRight: number;

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
				case '<':  return numericLeft < numericRight;
				case '>':  return numericLeft > numericRight;
				case '<=': return numericLeft <= numericRight;
				case '>=': return numericLeft >= numericRight;
			}

		} else {
			// TODO: Error Message
			throw new Error();
		}

		return true;
	}

	static zerofill (value: string, digits: number): string {
		return (new Array(digits).join('0') + value).slice(digits * -1);
	}

}