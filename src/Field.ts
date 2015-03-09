class Field {

	public el: HTMLFormItemElement;
	public type: string;
	public required: boolean = false;
	public rules: IRule[];

	constructor (el: HTMLFormItemElement, ruleQuery: string) {

		this.el = el;

		switch (el.nodeName) {
			case 'INPUT': {
				this.type = el.type;
				break;
			}
			case 'SELECT': {
				this.type = 'select';
				break;
			}
			case 'TEXTAREA': {
				this.type = 'textarea';
				break;
			}
			default: {
				// TODO: Error Message
				throw new TypeError('');
			}
		}

		this.rules = Util.queryRuleSet(ruleQuery);

		this.bindEvent();

	}

	public bindEvent (): void {

		this.el.addEventListener('blur', (e: Event) => {

			var field = <HTMLFormItemElement>e.target;
			field.value = this._convert(field.value);

		});

	}

	private _convert (value) {
		// 登録された順番にコンバート
		// 遅延評価的なことはしない
		var result = value;
		_.each(this.rules, (rule) => {
			if (rule && rule.name === 'convert') {
				result = rule.convert(result);
			}
		});
		return result;
	}

}
