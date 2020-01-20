/* eslint-disable import/no-unresolved, import/extensions, arrow-parens, arrow-body-style */

import { Reducer } from 'redux';
import { AsyncStateType, AsyncActionType } from '../types/actionTypes';
import { Nullable } from '../types/coreTypes';
import { exists } from '../util/typeUtil';

/**
 * Default async action definition
 */
export interface AsyncAction {
  type: string;
}
export interface AsyncParamAction extends AsyncAction {
  param?: any
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
export type AsyncActionFunction = (param?: any) => AsyncParamAction;
/**
 * Completed action function declaration for async flow
 */
export type AsyncActionCompletedFunction = (data: any) => AsyncCompletedAction;
/**
 * Error action function declaration for async flow
 */
export type AsyncActionErrorFunction = (error: any, message: Nullable<string>) => AsyncErrorAction;
/**
 * Parser function declaration for parsing the raw response to types result data
 */
export type ParserFunction<T extends any> = (data: any) => T;

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
 * Async flow action type wrapper
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
export interface AsyncFlowHandler<S, A extends AsyncActionType, T extends any>
    extends CoreAsyncFlowHandler<T> {
  asyncAction: AsyncActionFunction;
  reducer: Reducer<S, A>;
}

const coreFlowReduction = <S extends any, A extends AsyncActionType, T extends any>(
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
      /* eslint-disable no-console */
      console.error((action as AsyncErrorAction).error);
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
 */
const createAsyncFlowReducer = <S extends any, A extends AsyncActionType, T extends any>(
  actionTypes: AsyncFlowActionTypes,
  parserFunction: ParserFunction<T>,
): Reducer<S, A> => {
  return (
    state: S | undefined,
    action: A,
  ): S => {
    let update: S = coreFlowReduction<S, A, T>(actionTypes, parserFunction, state, action);
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
  };
};

const createCoreAsyncFlowActions = <T extends any>(
  actionTypes: CoreAsyncFlowActionTypes,
  parserFunction: ParserFunction<T>,
): CoreAsyncFlowHandler<T> => {
  let resetAction: Nullable<AsyncActionFunction> = null;
  if (exists(actionTypes.reset)) {
    resetAction = () => {
      return {
        type: (actionTypes.reset as string),
      };
    };
  }
  return {
    asyncWorkingAction: () => {
      return {
        type: actionTypes.working,
      };
    },
    asyncCompletedAction: (data: T) => {
      return {
        type: actionTypes.completed,
        data,
      };
    },
    asyncErrorAction: (error: any, message: Nullable<string>) => {
      return {
        type: actionTypes.error,
        error,
        message,
      };
    },
    asyncResetAction: resetAction,
    parserFunction,
  };
};

/**
 * Creates an async flow handler for unifying asynchronous flows within redux
 * state manipulation and reducing boilerplate for doing so
 * @param actionTypes The action types for the flow
 * @param parserFunction The parser function for the flow
 */
export const createAsyncFlow = <S extends any, A extends AsyncActionType, T extends any>(
  actionTypes: AsyncFlowActionTypes,
  parserFunction: ParserFunction<T>,
): AsyncFlowHandler<S, A, T> => {
  const reducer = createAsyncFlowReducer<S, A, T>(actionTypes, parserFunction);
  return {
    asyncAction: (param?: any) => {
      return {
        type: actionTypes.fetch,
        param,
      };
    },
    reducer,
    ...createCoreAsyncFlowActions<T>(actionTypes, parserFunction),
  };
};
