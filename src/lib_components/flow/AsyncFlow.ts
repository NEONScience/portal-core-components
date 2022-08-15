/* eslint-disable class-methods-use-this */
/* eslint-disable arrow-parens */

import { Reducer } from 'redux';

import NeonEnvironment from '../components/NeonEnvironment/NeonEnvironment';

import { exists } from '../util/typeUtil';

import {
  Nullable,
  AnyObject,
} from '../types/core';
import {
  AsyncState,
  AsyncStateType,
  AsyncActionType,
  AsyncCompletedAction,
  AsyncFlowActionTypes,
  ParserFunction,
  AsyncFlowHandler,
  CoreAsyncFlowActionTypes,
  CoreAsyncFlowHandler,
  AsyncActionFunction,
  AsyncErrorAction,
} from '../types/asyncFlow';

export interface IAsyncFlowProvider {
  create: <S extends AnyObject, A extends AsyncActionType, T extends any>(
      actionTypes: AsyncFlowActionTypes,
      parserFunction: ParserFunction<T>,
      ignoreWhenDevEnv?: boolean,
    ) => AsyncFlowHandler<S, A, T>;
  reduce: <OS extends AnyObject, A extends AsyncActionType>(
      reducer: Reducer<AsyncState<any>, A>,
      state: OS,
      action: A,
      fetchStateProp: string,
      completedActionType: string,
      stateResultProp: string
    ) => OS;
}

class AsyncFlowProvider implements IAsyncFlowProvider {
  /**
   * Core async flow reducer.
   * @param actionTypes The actions types to apply reduction for
   * @param parserFunction The parse function for parsing the completed action's response
   * @param state The redux state to update
   * @param action The current action to apply reduction for
   * @return The updated state
   */
  protected createCoreReducer = <S extends AnyObject, A extends AsyncActionType, T extends any>(
    actionTypes: CoreAsyncFlowActionTypes,
    parserFunction: ParserFunction<T>,
    state: S | undefined,
    action: A,
  ): S => {
    let update: S;
    if (exists(state)) {
      update = (state as S);
    } else {
      update = ({} as S);
    }
    switch (action.type) {
      case actionTypes.working:
        update = ({
          ...update,
          asyncState: AsyncStateType.WORKING,
          error: null,
        } as S);
        break;
      case actionTypes.completed:
        update = ({
          ...update,
          asyncState: AsyncStateType.FULLFILLED,
          data: parserFunction((action as AsyncCompletedAction).data),
          error: null,
        } as S);
        break;
      case actionTypes.error:
        console.error((action as AsyncErrorAction).error); // eslint-disable-line no-console
        update = ({
          ...update,
          asyncState: AsyncStateType.FAILED,
          error: {
            ...update.error,
            error: (action as AsyncErrorAction).error,
            message: (action as AsyncErrorAction).message,
          },
        } as S);
        break;
      case actionTypes.reset:
        update = ({
          ...update,
          asyncState: AsyncStateType.IDLE,
          data: null,
          error: null,
        } as S);
        break;
      default:
        break;
    }
    return update;
  };

  /**
   * Creates the reducer for handling all async actions within the flow
   * @param actionTypes The action types for the flow
   * @param parserFunction The parser function for the flow
   * @return The decorated core flow reducer
   */
  protected createAsyncFlowReducer = <S extends object, A extends AsyncActionType, T extends any>(
    actionTypes: AsyncFlowActionTypes,
    parserFunction: ParserFunction<T>,
  ): Reducer<S, A> => ((
    state: S | undefined,
    action: A,
  ): S => {
    let update: S = this.createCoreReducer<S, A, T>(actionTypes, parserFunction, state, action);
    switch (action.type) {
      case actionTypes.fetch:
        update = ({
          ...update,
          error: null,
        } as S);
        break;
      default:
        break;
    }
    return update;
  });

  /**
   * Creates the set of async flow action creators to dispatch
   * @param actionTypes The action types to create for
   * @param parserFunction The parser function to apply
   * @return The set of action creators
   */
  protected createCoreAsyncFlowActions = <T extends any>(
    actionTypes: CoreAsyncFlowActionTypes,
    parserFunction: ParserFunction<T>,
  ): CoreAsyncFlowHandler<T> => {
    let resetAction: Nullable<AsyncActionFunction> = null;
    if (exists(actionTypes.reset)) {
      resetAction = () => ({
        type: (actionTypes.reset as string),
      });
    }
    return {
      asyncWorkingAction: (param?: any) => ({
        type: actionTypes.working,
        param,
      }),
      asyncCompletedAction: (data: T) => ({
        type: actionTypes.completed,
        data,
      }),
      asyncErrorAction: (error: any, message: Nullable<string>, data?: any) => ({
        type: actionTypes.error,
        error,
        message,
        data,
      }),
      asyncResetAction: resetAction,
      parserFunction,
    };
  };

  /**
   * Creates an async flow handler for unifying asynchronous flows within redux
   * state manipulation and reducing boilerplate for doing so
   * @param actionTypes The action types for the flow
   * @param parserFunction The parser function for the flow
   * @param ignoreWhenDevEnv Optionally execute the flow
   * @returns The decorated async flow handler
   */
  public create = <S extends object, A extends AsyncActionType, T extends any>(
    actionTypes: AsyncFlowActionTypes,
    parserFunction: ParserFunction<T>,
    ignoreWhenDevEnv?: boolean,
  ): AsyncFlowHandler<S, A, T> => {
    const reducer = this.createAsyncFlowReducer<S, A, T>(actionTypes, parserFunction);
    return {
      asyncAction: (param?: any) => {
        if (NeonEnvironment.isDevEnv && ignoreWhenDevEnv) {
          return {
            type: '__DEV_NEON_CORE_ASYNCFLOW_IGNORE_ACTION',
          };
        }
        return {
          type: actionTypes.fetch,
          param,
        };
      },
      reducer,
      ...this.createCoreAsyncFlowActions<T>(actionTypes, parserFunction),
    };
  };

  /**
   * Handles the reduction of an asynchronous flow by propagating the
   * result data object from the async state object to the owning state
   * upon completion
   * @param reducer The async flow reducer to handle async state reduction
   * @param state The owning state to reduce
   * @param action The current action
   * @param fetchStateProp The async state property on the owning state
   * @param completedActionType The completed action type to responsd to
   * @param stateResultProp The result property on the owning state to set
   * @return The resulting owning state
   */
  public reduce = <OS extends AnyObject, A extends AsyncActionType>(
    reducer: Reducer<AsyncState<any>, A>,
    state: OS,
    action: A,
    fetchStateProp: string,
    completedActionType: string,
    stateResultProp: string,
  ): OS => {
    const update: OS = {
      ...state,
      [fetchStateProp]: reducer(state[fetchStateProp], action),
    };
    switch (action.type) {
      case completedActionType:
        return {
          ...state,
          [fetchStateProp]: {
            ...update[fetchStateProp],
            data: null,
          },
          [stateResultProp]: update[fetchStateProp].data,
        };
      default:
        return update;
    }
  };
}

const AsyncFlow: IAsyncFlowProvider = new AsyncFlowProvider();

export default AsyncFlow;
