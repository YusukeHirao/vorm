class Group implements IRule {

	public name: string = 'group';
	public method: string;
	public option: string;
	public params: string[] = [];
	public priority: number = 10000;
	public dependence: string[] = [];
	public when: any;


	constructor (methods: string[]) {
	}


}