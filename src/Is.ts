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


		this._customFilter = customFilter;
	}

	public filter (value: string): boolean {
		return this._customFilter(value);
	}

	toString (): string {
		return this.name + ':' + this.method;
	}

}