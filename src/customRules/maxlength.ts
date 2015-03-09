module customRules {

	interface IMaxLengthOption {
	}

	export var maxlength: ICustomRule = {

		is: function (value: string, options: IMaxLengthOption, params: string[]): boolean {
			return new jaco.Jaco(value).size() <= new jaco.Jaco(params[0]).toNumber();
		}

	}

}