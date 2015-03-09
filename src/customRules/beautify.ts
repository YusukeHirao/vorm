module customRules {

	interface IBeautifyOption {
	}

	export var beautify: ICustomRule = {

		convert: function (value: string, options: IBeautifyOption, params: string[]): string {
			return new jaco.Jaco(value).toNarrow().toWideKatakana().replaceMap({ '~': '〜', '\\(': '（', '\\)': '）' }).toString();
		}

	}

}