class FieldList {

	private _: Field[] = [];
	private __: { [fieldName: string]: number } = {};

	constructor (vorm: Vorm, rulesOption: IRulesOption) {

		var fieldName: string;
		var ruleQuery: string;
		var formElem: HTMLFormItemElement;
		var index: number;
		var field: Field;
		for (fieldName in rulesOption) {
			if (rulesOption.hasOwnProperty(fieldName)) {
				ruleQuery = rulesOption[fieldName];
				formElem = <HTMLFormItemElement> vorm.form.querySelector('[name="' + fieldName + '"]');
				if (formElem) {
					field = new Field(formElem, ruleQuery);
				} else {
					throw new Error('Invaid option. Not found element of [name="' + fieldName + '"].');
				}
				// console.log(field);
				index = this._.length;
				this._[index] = field;
				this.__[fieldName] = index;
			}
		}

	}

	public ref (index: number | string): Field {
		if (typeof index === 'string') {
			return this._[this.__[index]];
		} else {
			return this._[index];
		}
	}

}