module customRules {

	export var katakana: ICustomRule = {

		convert: function (value) {
			return jaco.katakanize(value);
		},
		is: function (value) {
			return new jaco.Jaco(value).isOnlyKatakana();
		}

	}

}