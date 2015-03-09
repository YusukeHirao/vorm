interface IRule {
	name: string;
	method: string;
	option: string;
	params: string[];
	priority: number;
	dependence: string[];
	when: any;
	filter?: { (value: string): boolean };
	convert?: { (value: string): string };
}