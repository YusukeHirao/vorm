module customRules {

	interface IIntergerOption {
		unsigned?: boolean;
		zerofill?: boolean;
	}

	export var integer: ICustomRule = {

		convert: function (value: string, options: IIntergerOption, params: string[]): string {
			if (options.zerofill) {
				return Util.zerofill(new jaco.Jaco(value).toNumeric(false, false).toString(), +params[0]);
			} else {
				return new jaco.Jaco(value).toNumeric(options.unsigned, false).toString();
			}
		},
		is: function (value: string, options: IIntergerOption, params: string[]): boolean {
			return new jaco.Jaco(value).isNumeric(options.unsigned || options.zerofill, false);
		}

	}

}