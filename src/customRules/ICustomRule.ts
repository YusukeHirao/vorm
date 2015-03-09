module customRules {
	export interface ICustomRule {
		convert?: { (
			value: string,
			options: { [optionName: string]: boolean },
			params: string[]
		): string };
		is?: { (
			value: string,
			options: { [optionName: string]: boolean },
			params: string[]
		): boolean };
	}
}