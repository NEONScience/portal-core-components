/* eslint-disable import/no-unresolved, import/extensions, arrow-parens, arrow-body-style, import/prefer-default-export, max-len */

import { Reducer } from 'redux';

import { AsyncActionType } from '../types/actionTypes';
import { AsyncState } from '../types/coreTypes';

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
export const handleAsyncFlowReduction = <OS extends any, A extends AsyncActionType>(
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
