import {
  AjaxConfig,
  AjaxResponse,
  ajax as AjaxCreationMethod,
} from 'rxjs/ajax';
import { AnyAction } from 'redux';
import { Epic } from 'redux-observable';
import {
  MonoTypeOperatorFunction,
  Observable,
} from 'rxjs';
import { AnyObject } from './core';

export interface EpicDependencies {
  ajax: typeof AjaxCreationMethod;
}

export type EpicCreator<A extends AnyAction, S extends AnyObject> = (
  action$: A,
  state$: S,
  { ajax }: EpicDependencies
) => Epic<A, A, S, EpicDependencies>;

export type AjaxObservableCreator<A extends AnyAction> = (
  ajax: typeof AjaxCreationMethod,
  ajaxRequest: AjaxConfig | AjaxConfig[],
  successAction: SuccessAction<A>,
  errorAction: ErrorAction<A>,
  action?: A,
  takeUntilOperator?: MonoTypeOperatorFunction<any>,
  ajaxBodyCreator?: AjaxBodyCreator<A>,
  useForkJoin?: boolean
) => Observable<AnyAction>;

export type WorkingAction = (data?: any) => any;
export type SuccessAction<A extends AnyAction> = (
  response: AjaxResponse<unknown> | AjaxResponse<unknown>[],
  action?: A,
) => any;
export type ErrorAction<A extends AnyAction> = (error: any, action?: A) => any;

export type AjaxBodyCreator<A extends AnyAction> = (action: A, index?: number) => any;
export type AjaxRequestInjector<A extends AnyAction> = (
  request: any,
  action: A,
  index?: number,
) => any;

export interface EpicCreationProps<A extends AnyAction> {
  ofTypeFilter: string | string[];
  request: AjaxConfig | AjaxConfig[];
  workingAction: WorkingAction;
  successAction: SuccessAction<A>;
  errorAction: ErrorAction<A>;
  takeUntilTypeFilter?: string;
  bodyCreator?: AjaxBodyCreator<A>;
  requestInjector?: AjaxRequestInjector<A>;
  useForkJoin?: boolean;
}
