import { AsyncStateType } from './actionTypes';
export declare type Nullable<T> = T | null | undefined;
export declare type AnyObject = {
    [key: string]: any;
};
export declare type Undef<T> = T | undefined;
export interface AsyncState<T extends any> {
    asyncState: AsyncStateType;
    data: T;
    error: Nullable<ErrorState>;
}
export interface ErrorState {
    error: any;
    message: Nullable<string>;
}
