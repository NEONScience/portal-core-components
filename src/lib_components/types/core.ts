/**
 * General convenience type definitions
 */
export type Nullable<T> = T | null | undefined;
export type AnyObject = {[key: string]: any};
export type Undef<T> = T | undefined;
export type AnyVoidFunc = (p?: any) => void;
