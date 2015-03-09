class Convert extends Rule {

	public name: string = 'convert';
	public priority: number = 10000;

	private _customConvert: IConvert;

	constructor (methods: string[]) {

		super(methods);

		var cRule = customRules[this.method];
		if (cRule && cRule.convert) {
			this._customConvert = cRule.convert;
		}

		console.log('%c' + this.name, 'color: orange; font-weight: bold', this.method, this.option, this.params);
	}

	public convert (value: string): string {
		var options: { [optionName: string]: boolean } = {};
		options[this.option] = true;
		if (this._customConvert) {
			return this._customConvert(value, options, this.params);
		} else {
			return value;
		}
	}

}