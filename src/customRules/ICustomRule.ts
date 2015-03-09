module customRules {
	export interface ICustomRule {
		convert: { (value: string): string };
	}
}