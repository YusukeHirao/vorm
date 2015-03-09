module customRules {

	interface IComparison {
	}

	export var comparison: ICustomRule = {

		is: function (value: string, options: IComparison, params: string[]): boolean {
			return Util.parseComparison(params[0], value);
		}

	}

}