class Convert extends Rule {

	public name: string = 'convert';
	public method: string;
	public option: string;
	public params: string[] = [];
	public priority: number = 10000;
	public dependence: string[] = [];
	public when: any;

	private _customConvert: IConvert;

	constructor (methods: string[]) {

		super(methods);

		var cRule = customRules[this.method];

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

}