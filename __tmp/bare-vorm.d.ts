/// <reference path="../typings/bundle.d.ts" />
/// <reference path="../bower_components/jaco/lib/jaco.d.ts" />
declare type HTMLFormItemElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
interface IConvert {
    (value: string): string;
}
interface IFilter {
    (value: string): boolean;
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
interface IRulesOption {
    [fieldName: string]: string;
}
declare class Vorm {
    form: HTMLFormElement;
    fields: FieldList;
    constructor(formNameOrFormNode: string | HTMLElement, rulesOption: IRulesOption);
    private _init(formNameOrFormNode, rulesOption);
    private _createVormObject(formNameOrFormNode, rulesOption);
}
declare class Rule implements IRule {
    name: string;
    method: string;
    option: string;
    params: string[];
    priority: number;
    dependence: string[];
    when: any;
    constructor(methods: string[]);
    toString(): string;
}
declare class Convert extends Rule {
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
}
declare class Field {
    el: HTMLFormItemElement;
    type: string;
    required: boolean;
    rules: IRule[];
    constructor(el: HTMLFormItemElement, ruleQuery: string);
    bindEvent(): void;
    private _convert(value);
}
declare class FieldList {
    private _;
    private __;
    constructor(vorm: Vorm, rulesOption: IRulesOption);
    ref(index: number | string): Field;
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
declare class Util {
    static quotedStringVariablePrefix: string;
    static paramVariablePrefix: string;
    static quotedStringList: {
        [variable: string]: string;
    };
    static quotedStringVariableCounter: number;
    static paramList: {
        [variable: string]: string;
    };
    static paramVariableCounter: number;
    static queryRuleSet(ruleQuery: string): IRule[];
    static nodeStringify(node: Node): string;
    static getFormName(): string;
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
declare module customRules {
    interface ICustomRule {
        convert: {
            (value: string): string;
        };
    }
}
declare module customRules {
    var hiragana: ICustomRule;
}
