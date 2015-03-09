class Is extends Rule {

	public name: string = 'is';
	public priority: number = 100;

	private _customFilter: IFilter;

	constructor (methods: string[]) {

		super(methods);

		var cRule = customRules[this.method];
		if (cRule && cRule.is) {
			this._customFilter = cRule.is;
		}

		console.log('%c' + this.name, 'color: green; font-weight: bold', this.method, this.option, this.params);
	}

	public filter (value: string): boolean {
		var options: { [optionName: string]: boolean } = {};
		options[this.option] = true;
		if (this._customFilter) {
			return this._customFilter(value, options, this.params);
		} else {
			return true;
		}
	}

}