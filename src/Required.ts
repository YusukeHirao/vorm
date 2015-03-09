class Required implements IRule {

	public name: string = 'required';
	public method: string = 'normal';
	public option: string;
	public params: string[] = [];
	public priority: number = 1000;
	public dependence: string[] = [];
	public when: any;

}