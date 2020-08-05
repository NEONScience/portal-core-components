/**
 * General convenience type definitions
 */
export declare type Nullable<T> = T | null | undefined;
export declare type AnyObject = {
    [key: string]: any;
};
export declare type Undef<T> = T | undefined;
export declare type AnyVoidFunc = (p?: any) => void;