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

	public toString (): string {
		return this.name + ':' + this.method;
	}

}