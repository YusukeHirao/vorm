class Write implements IRule {

	public name: string = 'write';
	public method: string;
	public option: string;
	public params: string[] = [];
	public priority: number = 10000;
	public dependence: string[] = [];
	public when: any;

	constructor (methods: string[]) {
		// this.method = method;
	}

}