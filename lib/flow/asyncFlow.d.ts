import { Reducer } from 'redux';
import { AsyncActionType } from '../types/actionTypes';
import { Nullable } from '../types/coreTypes';
/**
 * Default async action definition
 */
export interface AsyncAction {
    type: string;
}
export interface AsyncParamAction extends AsyncAction {
    param?: any;
}
/**
 * Completed async action for propagating the result data
 */
export interface AsyncCompletedAction extends AsyncAction {
    data: any;
}
/**
 * Error async action for propagating error and optional message
 */
export interface AsyncErrorAction extends AsyncAction {
    error: any;
    message: Nullable<string>;
}
/**
 * Default action function declaration for async flow
 */
export declare type AsyncActionFunction = (param?: any) => AsyncParamAction;
/**
 * Completed action function declaration for async flow
 */
export declare type AsyncActionCompletedFunction = (data: any) => AsyncCompletedAction;
/**
 * Error action function declaration for async flow
 */
export declare type AsyncActionErrorFunction = (error: any, message: Nullable<string>) => AsyncErrorAction;
/**
 * Parser function declaration for parsing the raw response to types result data
 */
export declare type ParserFunction<T extends any> = (data: any) => T;
/**
 * Core set of flow actions
 */
export interface CoreAsyncFlowActionTypes {
    working: string;
    completed: string;
    error: string;
    reset: Nullable<string>;
}
/**
 * Async flow action type wrappe
 */
export interface AsyncFlowActionTypes extends CoreAsyncFlowActionTypes {
    fetch: string;
}
/**
 * Async flow handler declaration
 */
export interface CoreAsyncFlowHandler<T extends any> {
    asyncWorkingAction: AsyncActionFunction;
    asyncCompletedAction: AsyncActionCompletedFunction;
    asyncErrorAction: AsyncActionErrorFunction;
    asyncResetAction: Nullable<AsyncActionFunction>;
    parserFunction: ParserFunction<T>;
}
/**
 * Async flow handler declaration
 */
export interface AsyncFlowHandler<S, A extends AsyncActionType, T extends any> extends CoreAsyncFlowHandler<T> {
    asyncAction: AsyncActionFunction;
    reducer: Reducer<S, A>;
}
/**
 * Creates an async flow handler for unifying asynchronous flows within redux
 * state manipulation and reducing boilerplate for doing so
 * @param actionTypes The action types for the flow
 * @param parserFunction The parser function for the flow
 */
export declare const createAsyncFlow: <S extends any, A extends AsyncActionType, T extends any>(actionTypes: AsyncFlowActionTypes, parserFunction: ParserFunction<T>) => AsyncFlowHandler<S, A, T>;
