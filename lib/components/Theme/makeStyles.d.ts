import { NeonTheme } from './types';
export declare const makeStyles: <Params = void, RuleNameSubsetReferencableInNestedSelectors extends string = never>(params?: {
    name?: string | Record<string, unknown> | undefined;
    uniqId?: string | undefined;
} | undefined) => <RuleName extends string>(cssObjectByRuleNameOrGetCssObjectByRuleName: Record<RuleName, import("tss-react").CSSObject> | ((theme: NeonTheme, params: Params, classes: Record<RuleNameSubsetReferencableInNestedSelectors, string>) => Record<RuleNameSubsetReferencableInNestedSelectors | RuleName, import("tss-react").CSSObject>)) => (params: Params, muiStyleOverridesParams?: {
    props: Record<string, unknown>;
    ownerState?: Record<string, unknown>;
} | undefined) => {
    classes: Record<RuleName, string>;
    theme: NeonTheme;
    css: import("tss-react").Css;
    cx: import("tss-react").Cx;
};
