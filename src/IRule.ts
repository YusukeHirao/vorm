interface IRule {
	name: string;
	method: string;
	option: string;
	params: string[];
	priority: number;
	dependence: string[];
	when: any;
	filter?: IFilter;
	convert?: IConvert;
}