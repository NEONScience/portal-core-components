import { Reducer } from 'redux';
import { AnyObject } from '../types/core';
import { AsyncState, AsyncActionType, AsyncFlowActionTypes, ParserFunction, AsyncFlowHandler } from '../types/asyncFlow';
export interface IAsyncFlowProvider {
    create: <S extends AnyObject, A extends AsyncActionType, T extends any>(actionTypes: AsyncFlowActionTypes, parserFunction: ParserFunction<T>, ignoreWhenDevEnv?: boolean) => AsyncFlowHandler<S, A, T>;
    reduce: <OS extends AnyObject, A extends AsyncActionType>(reducer: Reducer<AsyncState<any>, A>, state: OS, action: A, fetchStateProp: string, completedActionType: string, stateResultProp: string) => OS;
}
declare const AsyncFlow: IAsyncFlowProvider;
export default AsyncFlow;
