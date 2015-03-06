/// <reference path="../typings/bundle.d.ts" />
/// <reference path="../bower_components/jaco/lib/jaco.d.ts" />
declare class Vorm {
    form: HTMLFormElement;
    fields: FieldList;
    constructor(formNameOrFormNode: string | HTMLElement, rulesOption: IRulesOption);
    private _init(formNameOrFormNode, rulesOption);
}
declare type HTMLFormItemElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
interface IRulesOption {
    [fieldName: string]: string;
}
declare class FieldList {
    private _;
    private __;
    constructor(vorm: Vorm, rulesOption: IRulesOption);
    ref(index: number | string): Field;
}
declare class Field {
    el: HTMLFormItemElement;
    type: string;
    required: boolean;
    rules: IRule[];
    constructor(el: HTMLFormItemElement, ruleQuery: string);
    private _convert(value);
}
interface IFilter {
    (value: string): boolean;
}
interface IConvert {
    (value: string): string;
}
interface IRule {
    name: string;
    method: string;
    option: string;
    params: string[];
    priority: number;
    dependence: string[];
    when: any;
    filter?: IFilter;
    convert?: IConvert;
}
declare class Required implements IRule {
    name: string;
    method: string;
    option: string;
    params: string[];
    priority: number;
    dependence: string[];
    when: any;
    filter(value: string): boolean;
    toString(): string;
}
declare class Is implements IRule {
    name: string;
    method: string;
    option: string;
    params: string[];
    priority: number;
    dependence: string[];
    when: any;
    private _customFilter;
    constructor(methods: string[], customFilter?: IFilter);
    filter(value: string): boolean;
    toString(): string;
}
declare class Convert implements IRule {
    name: string;
    method: string;
    option: string;
    params: string[];
    priority: number;
    dependence: string[];
    when: any;
    private _customConvert;
    constructor(methods: string[]);
    convert(value: string): string;
    toString(): string;
}
declare class Write implements IRule {
    name: string;
    method: string;
    option: string;
    params: string[];
    priority: number;
    dependence: string[];
    when: any;
    private _customConvert;
    constructor(methods: string[], customConvert?: IConvert);
    convert(value: string): string;
    toString(): string;
}
declare class Group implements IRule {
    name: string;
    method: string;
    option: string;
    params: string[];
    priority: number;
    dependence: string[];
    when: any;
    private _customConvert;
    constructor(methods: string[], customConvert?: IConvert);
    convert(value: string): string;
    toString(): string;
}
declare var customRules: {
    hiragana: {
        convert: (value: any) => string;
        is: (value: any) => boolean;
    };
};
declare var quotedStringList: {
    [variable: string]: string;
};
declare var quotedStringVariableCounter: number;
declare var paramList: {
    [variable: string]: string;
};
declare var paramVariableCounter: number;
declare class Util {
    static quotedStringVariablePrefix: string;
    static paramVariablePrefix: string;
    static queryRuleSet(ruleQuery: string): IRule[];
    static nodeStringify(node: Node): string;
    static getFormName(): string;
}
