import {
  AjaxCreationMethod,
  AjaxRequest,
  AjaxResponse,
} from 'rxjs/internal/observable/dom/AjaxObservable';
import { AnyAction } from 'redux';
import { Epic } from 'redux-observable';
import {
  MonoTypeOperatorFunction,
  Observable,
} from 'rxjs';
import { AnyObject } from './core';

export interface EpicDependencies {
  ajax: AjaxCreationMethod;
}

export type EpicCreator<A extends AnyAction, S extends AnyObject> = (
  action$: A,
  state$: S,
  { ajax }: EpicDependencies
) => Epic<A, A, S, EpicDependencies>;

export type AjaxObservableCreator<A extends AnyAction> = (
  ajax: AjaxCreationMethod,
  ajaxRequest: AjaxRequest | AjaxRequest[],
  successAction: SuccessAction<A>,
  errorAction: ErrorAction<A>,
  action?: A,
  takeUntilOperator?: MonoTypeOperatorFunction<any>,
  ajaxBodyCreator?: AjaxBodyCreator<A>,
  useForkJoin?: boolean
) => Observable<AnyAction>;

export type WorkingAction = (data?: any) => any;
export type SuccessAction<A extends AnyAction> = (
  response: AjaxResponse | AjaxResponse[],
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
  request: AjaxRequest | AjaxRequest[];
  workingAction: WorkingAction;
  successAction: SuccessAction<A>;
  errorAction: ErrorAction<A>;
  takeUntilTypeFilter?: string;
  bodyCreator?: AjaxBodyCreator<A>;
  requestInjector?: AjaxRequestInjector<A>;
  useForkJoin?: boolean;
}
