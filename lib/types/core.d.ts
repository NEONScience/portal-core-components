/// <reference types="react" />
/**
 * General convenience type definitions
 */
export declare type Nullable<T> = T | null | undefined;
export declare type AnyObject = {
    [key: string]: any;
};
export declare type Undef<T> = T | undefined;
export declare type AnyVoidFunc = (p?: any) => void;
export declare type UnknownRecord = Record<string, unknown>;
export declare type NullableRecord = UnknownRecord | null | undefined;
export declare type StylesHook = (...props: unknown[]) => Record<string, string>;
export declare type StringPropsObject = {
    [key: string]: string;
};
export declare type HocFuncType<T extends JSX.IntrinsicAttributes> = ((props: T) => JSX.Element);
export interface Action<T = string> {
    type: T;
}
export interface AnyAction extends Action {
    [props: string]: unknown;
}
/**
 * Type to encapsulate silent authentication allowance
 */
export declare enum AuthSilentType {
    DISABLED = "DISABLED",
    PREVENT_ALL = "PREVENT_ALL",
    PREVENT_BROWSER = "PREVENT_BROWSER",
    ALLOW_ALL = "ALLOW_ALL"
}
