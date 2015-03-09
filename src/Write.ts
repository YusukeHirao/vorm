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