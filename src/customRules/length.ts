module customRules {

	interface ILengthOption {
	}

	export var length: ICustomRule = {

		is: function (value: string, options: ILengthOption, params: string[]): boolean {
			return new jaco.Jaco(value).size() === new jaco.Jaco(params[0]).toNumber();
		}

	}

}