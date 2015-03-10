/// <reference path="../typings/bundle.d.ts" />
/// <reference path="../bower_components/jaco/lib/jaco.d.ts" />
declare type HTMLFormItemElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
interface IConvert {
    (value: string, options: {
        [optionName: string]: boolean;
    }, params: string[]): string;
}
interface IFilter {
    (value: string, options: {
        [optionName: string]: boolean;
    }, params: string[]): boolean;
}
interface IRule {
    name: string;
    method: string;
    option: string;
    params: string[];
    priority: number;
    dependence: string[];
    when: any;
    filter?: {
        (value: string): boolean;
    };
    convert?: {
        (value: string): string;
    };
}
interface IRulesOption {
    [fieldName: string]: string;
}
declare class Vorm {
    form: HTMLFormElement;
    fields: FieldList;
    private _isReadied;
    private _readyHandler;
    constructor(formNameOrFormNode: string | HTMLElement, rulesOption: IRulesOption);
    onReady(readyHandler: {
        (): any;
    }): void;
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
    priority: number;
    private _customConvert;
    constructor(methods: string[]);
    convert(value: string): string;
}
declare class Field {
    name: string;
    el: HTMLFormItemElement;
    type: string;
    required: boolean;
    rules: IRule[];
    constructor(el: HTMLFormItemElement, ruleQuery: string);
    update(): void;
    bindEvent(): void;
    private _convert(value);
    private _is(value);
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
    constructor(methods: string[]);
}
declare class Is extends Rule {
    name: string;
    priority: number;
    private _customFilter;
    constructor(methods: string[]);
    filter(value: string): boolean;
}
declare class Required implements IRule {
    name: string;
    method: string;
    option: string;
    params: string[];
    priority: number;
    dependence: string[];
    when: any;
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
    static parseComparison(condition: string, defaultLeft: string): boolean;
    static zerofill(value: string, digits: number): string;
}
declare class Write implements IRule {
    name: string;
    method: string;
    option: string;
    params: string[];
    priority: number;
    dependence: string[];
    when: any;
    constructor(methods: string[]);
}
declare module customRules {
    interface ICustomRule {
        convert?: {
            (value: string, options: {
                [optionName: string]: boolean;
            }, params: string[]): string;
        };
        is?: {
            (value: string, options: {
                [optionName: string]: boolean;
            }, params: string[]): boolean;
        };
    }
}
declare module customRules {
    var hiragana: ICustomRule;
}
declare module customRules {
    var katakana: ICustomRule;
}
declare module customRules {
    var integer: ICustomRule;
}
declare module customRules {
    var comparison: ICustomRule;
}
declare module customRules {
    var beautify: ICustomRule;
}
declare module customRules {
    var email: ICustomRule;
}
declare module customRules {
    var length: ICustomRule;
}
declare module customRules {
    var maxlength: ICustomRule;
}
