/* eslint-disable import/no-unresolved, import/extensions */

import {
  AsyncAction,
  AsyncCompletedAction,
  AsyncErrorAction,
  AsyncParamAction,
} from '../flow/asyncFlow';

export enum AsyncStateType {
  IDLE,
  WORKING,
  FULLFILLED,
  FAILED
}

export type AsyncActionType =
  AsyncAction
  | AsyncParamAction
  | AsyncCompletedAction
  | AsyncErrorAction;
