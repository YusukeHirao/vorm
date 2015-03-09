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

			if (this._is(field.value)) {
				this.el.classList.remove('invalid');
			} else {
				this.el.classList.add('invalid');
			}

		});

	}

	private _convert (value: string): string {
		// 登録された順番にコンバート
		// 遅延評価的なことはしない
		var result: string = value;
		_.each<IRule>(this.rules, (rule: IRule) => {
			if (rule && rule.name === 'convert') {
				result = rule.convert(result);
			}
		});
		return result;
	}

	private _is (value: string): boolean {
		// 登録された順番にコンバート
		// 遅延評価的なことはしない
		var result: boolean = true;
		_.each<IRule>(this.rules, (rule: IRule) => {
			if (rule && rule.name === 'is') {
				console.log(rule.name, rule.method);
				if (!rule.filter(value)) {
					result = false;
				}
			}
		});
		return result;
	}

}
