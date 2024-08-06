import React from 'react';

/**
 * General convenience type definitions
 */
export type Nullable<T> = T | null | undefined;
export type AnyObject = {[key: string]: any};
export type Undef<T> = T | undefined;
export type AnyVoidFunc = (p?: any) => void;
export type UnknownRecord = Record<string, unknown>;
export type NullableRecord = UnknownRecord | null | undefined;
export type StylesHook = (...props: unknown[]) => Record<string, string>;
export type StringPropsObject = {[key: string]: string};
export type HocFuncType<T extends React.JSX.IntrinsicAttributes> = ((props: T) => React.JSX.Element);

export interface Action<T = string> {
  type: T;
}
export interface AnyAction extends Action {
  [props: string]: unknown;
}

/**
 * Type to encapsulate silent authentication allowance
 */
export enum AuthSilentType {
  DISABLED = 'DISABLED',
  PREVENT_ALL = 'PREVENT_ALL',
  PREVENT_BROWSER = 'PREVENT_BROWSER',
  ALLOW_ALL = 'ALLOW_ALL',
}
