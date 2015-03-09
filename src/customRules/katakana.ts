module customRules {

	export var katakana: ICustomRule = {

		convert: function (value: string, options: { [optionName: string]: boolean }, params: string[]): string {
			return jaco.katakanize(value);
		},
		is: function (value: string, options: { [optionName: string]: boolean }, params: string[]): boolean {
			return new jaco.Jaco(value).isOnlyKatakana();
		}

	}

}