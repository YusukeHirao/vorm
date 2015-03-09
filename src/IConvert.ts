interface IConvert {
	(
		value: string,
		options: { [optionName: string]: boolean },
		params: string[]
	): string;
}