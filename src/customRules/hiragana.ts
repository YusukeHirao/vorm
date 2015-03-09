module customRules {

	export var hiragana: ICustomRule = {

		convert: function (value: string, options: { [optionName: string]: boolean }, params: string[]): string {
			return jaco.hiraganize(value);
		},
		is: function (value: string, options: { [optionName: string]: boolean }, params: string[]): boolean {
			return new jaco.Jaco(value).isOnlyHiragana();
		}

	}

}