interface IFilter {
	(
		value: string,
		options: { [optionName: string]: boolean },
		params: string[]
	): boolean;
}