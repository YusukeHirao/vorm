class Vorm {

	public form: HTMLFormElement;
	public fields: FieldList;

	constructor (formNameOrFormNode: string | HTMLElement, rulesOption: IRulesOption) {

		if (this instanceof Vorm) {
			this._init(formNameOrFormNode, rulesOption);
		} else {
			return new Vorm(formNameOrFormNode, rulesOption);
		}

	}

	private _init (formNameOrFormNode: string | HTMLElement, rulesOption: IRulesOption): void {

		window.addEventListener('DOMContentLoaded', this._createVormObject.bind(this, formNameOrFormNode, rulesOption), false);

	}

	private _createVormObject (formNameOrFormNode: string | HTMLElement, rulesOption: IRulesOption): void {

		var formNode: HTMLElement;

		if (typeof formNameOrFormNode === 'string') {
			formNode = <HTMLElement> document.querySelector('[name="' + formNameOrFormNode + '"]');
			if (!formNode) {
				throw new TypeError('A Form element was not found by name: ' + formNameOrFormNode);
			}
		} else {
			formNode = formNameOrFormNode;
			if (!formNode.nodeName) {
				throw new TypeError('Type of a first argument is not HTMLElement');
			}
		}
		if (formNode.nodeName !== 'FORM') {
			throw new TypeError('A got element is not a Form element');
		}

		this.form = <HTMLFormElement> formNode;

		this.fields = new FieldList(this, rulesOption);

	}

}
























