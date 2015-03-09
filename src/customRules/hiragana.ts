module customRules {

	export var hiragana: ICustomRule = {

		convert: function (value) {
			return jaco.hiraganize(value);
		},
		is: function (value) {
			return new jaco.Jaco(value).isOnlyHiragana();
		}

	}

}