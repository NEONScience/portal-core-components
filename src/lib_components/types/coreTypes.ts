/* eslint-disable import/no-unresolved, import/extensions */

import { AsyncStateType } from './actionTypes';

export type Nullable<T> = T | null | undefined;
export type AnyObject = {[key: string]: any};
export type Undef<T> = T | undefined;

export interface AsyncState<T extends any> {
  asyncState: AsyncStateType;
  data: T;
  error: Nullable<ErrorState>;
}

export interface ErrorState {
  error: any;
  message: Nullable<string>;
}
