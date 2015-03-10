class Vorm {

	public form: HTMLFormElement;
	public fields: FieldList;
	private _isReadied: boolean;
	private _readyHandler: { (): any };

	constructor (formNameOrFormNode: string | HTMLElement, rulesOption: IRulesOption) {

		if (this instanceof Vorm) {
			this._init(formNameOrFormNode, rulesOption);
		} else {
			return new Vorm(formNameOrFormNode, rulesOption);
		}

	}

	public onReady (readyHandler: { (): any }): void {
		this._readyHandler = readyHandler;
		if (this._isReadied) {
			this._readyHandler.call(this);
		}
	}

	private _init (formNameOrFormNode: string | HTMLElement, rulesOption: IRulesOption): void {
		this._isReadied = window.document.readyState === 'complete';

		if (this._isReadied) {
			this._createVormObject(formNameOrFormNode, rulesOption);
		} else {
			window.addEventListener('DOMContentLoaded', this._createVormObject.bind(this, formNameOrFormNode, rulesOption), false);
		}
	}

	private _createVormObject (formNameOrFormNode: string | HTMLElement, rulesOption: IRulesOption): void {

		this._isReadied = true;

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

		if (this._readyHandler) {
			this._readyHandler.call(this);
		}

	}

}
























