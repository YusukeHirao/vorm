class Rule implements IRule {

	public name: string = null;
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
				param = methodInfo[0].replace(decodeParam, (paramVariable: string): string => Util.paramList[paramVariable]);
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

	}

	toString (): string {
		return this.name + ':' + this.method;
	}

}