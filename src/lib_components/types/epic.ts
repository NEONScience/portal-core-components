import {
  AjaxConfig,
  AjaxResponse,
  ajax as AjaxCreationMethod,
} from 'rxjs/ajax';
import { UnknownAction } from 'redux';
import { Epic } from 'redux-observable';
import {
  MonoTypeOperatorFunction,
  Observable,
} from 'rxjs';
import { AnyObject } from './core';

export interface EpicDependencies {
  ajax: typeof AjaxCreationMethod;
}

export type EpicCreator<A extends UnknownAction, S extends AnyObject> = (
  action$: A,
  state$: S,
  { ajax }: EpicDependencies,
) => Epic<A, A, S, EpicDependencies>;

export type AjaxObservableCreator<A extends UnknownAction> = (
  ajax: typeof AjaxCreationMethod,
  ajaxRequest: AjaxConfig | AjaxConfig[],
  successAction: SuccessAction<A>,
  errorAction: ErrorAction<A>,
  action?: A,
  takeUntilOperator?: MonoTypeOperatorFunction<any>,
  ajaxBodyCreator?: AjaxBodyCreator<A>,
  useForkJoin?: boolean,
) => Observable<A>;

export type WorkingAction = (data?: any) => any;
export type SuccessAction<A extends UnknownAction> = (
  response: AjaxResponse<unknown> | AjaxResponse<unknown>[],
  action?: A,
) => any;
export type ErrorAction<A extends UnknownAction> = (error: any, action?: A) => any;

export type AjaxBodyCreator<A extends UnknownAction> = (action: A, index?: number) => any;
export type AjaxRequestInjector<A extends UnknownAction> = (
  request: any,
  action: A,
  index?: number,
) => any;

export interface EpicCreationProps<A extends UnknownAction> {
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
