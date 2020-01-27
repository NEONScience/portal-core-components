import { AsyncAction, AsyncCompletedAction, AsyncErrorAction, AsyncParamAction } from '../flow/asyncFlow';
export declare enum AsyncStateType {
    IDLE = 0,
    WORKING = 1,
    FULLFILLED = 2,
    FAILED = 3
}
export declare type AsyncActionType = AsyncAction | AsyncParamAction | AsyncCompletedAction | AsyncErrorAction;
