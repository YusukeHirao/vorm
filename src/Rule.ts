class Rule implements IRule {

	public name: string = null;
	public method: string;
	public option: string;
	public params: string[] = [];
	public priority: number;
	public dependence: string[] = [];
	public when: any;

	constructor (methods: string[]) {
		var decodeParam: RegExp = new RegExp(Util.paramVariablePrefix.replace(/\$/g, '\\$') + '[0-9]+', 'ig');

		var methodInfo: string[];
		var methodName: string;
		var params: string;
		if (methods && methods[0]) {
			methodInfo = methods[0].match(decodeParam);
			methodName = methods[0].replace(decodeParam, '');
			if (methodInfo && methodInfo[0]) {
				params = methodInfo[0].replace(decodeParam, (paramVariable: string): string => Util.paramList[paramVariable]);
				params = params.slice(1, -1);
			}
		}
		var options: string[] = methodName.split('.');
		var option: string;
		if (options && options.length) {
			methodName = options.shift();
			option = options[0];
		}

		this.method = methodName;
		this.option = option;
		if (params) {
			this.params = params.split(/,/).map( (param: string): string => param.trim() );
		}

	}

	toString (): string {
		return this.name + ':' + this.method;
	}

}