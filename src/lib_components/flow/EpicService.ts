import {
  of,
  concat,
  merge,
  forkJoin,
  Observable,
  MonoTypeOperatorFunction,
} from 'rxjs';
import {
  AjaxCreationMethod,
  AjaxResponse,
  AjaxRequest,
} from 'rxjs/internal/observable/dom/AjaxObservable';
import {
  switchMap,
  mergeMap,
  catchError,
  takeUntil,
} from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType, Epic } from 'redux-observable';
import {
  EpicDependencies,
  WorkingAction,
  SuccessAction,
  ErrorAction,
  AjaxBodyCreator,
  EpicCreator,
  AjaxRequestInjector,
  EpicCreationProps,
} from '../types/epic';
import { exists } from '../util/typeUtil';
import { AnyObject } from '../types/core';

export interface IEpicService {
  /**
   * Creator to decorate an EpicCreator function that creates the Epic
   * @param ofTypeFilter
   * @param ajaxRequest
   * @param workingAction
   * @param successAction
   * @param errorAction
   * @param takeUntilTypeFilter
   * @param ajaxBodyCreator
   * @param ajaxRequestInjector
   * @param useForkJoin
   * @type A The type of action
   * @type S The type of state
   */
  createEpic: <A extends AnyAction, S extends AnyObject>(
    ofTypeFilter: string | string[],
    ajaxRequest: AjaxRequest | AjaxRequest[],
    workingAction: WorkingAction,
    successAction: SuccessAction<A>,
    errorAction: ErrorAction<A>,
    takeUntilTypeFilter?: string,
    ajaxBodyCreator?: AjaxBodyCreator<A>,
    ajaxRequestInjector?: AjaxRequestInjector<A>,
    useForkJoin?: boolean,
  ) => EpicCreator<A, S>;
  /**
   * Creator to decorate an EpicCreator function that creates the Epic
   * @param ofTypeFilter
   * @param ajaxRequest
   * @param workingAction
   * @param successAction
   * @param errorAction
   * @param takeUntilTypeFilter
   * @param ajaxBodyCreator
   * @param ajaxRequestInjector
   * @param useForkJoin
   * @type A The type of action
   * @type S The type of state
   */
  createMergeEpic: <A extends AnyAction, S extends AnyObject>(
    ofTypeFilter: string | string[],
    ajaxRequest: AjaxRequest | AjaxRequest[],
    workingAction: WorkingAction,
    successAction: SuccessAction<A>,
    errorAction: ErrorAction<A>,
    takeUntilTypeFilter?: string,
    ajaxBodyCreator?: AjaxBodyCreator<A>,
    ajaxRequestInjector?: AjaxRequestInjector<A>,
    useForkJoin?: boolean,
  ) => EpicCreator<A, S>;
  /**
   * Creator to decorate an EpicCreator function that creates the Epic
   * @param props
   * @type A The type of action
   * @type S The type of state
   */
  createEpicFromProps: <A extends AnyAction, S extends AnyObject>(
    props: EpicCreationProps<A>,
  ) => EpicCreator<A, S>;
  /**
   * Creator to decorate an EpicCreator function that creates the Epic
   * @param props
   * @type A The type of action
   * @type S The type of state
   */
  createMergeEpicFromProps: <A extends AnyAction, S extends AnyObject>(
    props: EpicCreationProps<A>,
  ) => EpicCreator<A, S>;
  /**
   * Creator to decorate an AJAX observable
   * @param ajax
   * @param ajaxRequest
   * @param successAction
   * @param errorAction
   * @param action
   * @param takeUntilOperator
   * @param ajaxBodyCreator
   * @param ajaxHeaderInjector
   * @param useForkJoin
   * @type A The type of action
   */
  createAjaxObservable: <A extends AnyAction>(
    ajax: AjaxCreationMethod,
    ajaxRequest: AjaxRequest | AjaxRequest[],
    successAction: SuccessAction<A>,
    errorAction: ErrorAction<A>,
    action?: A,
    takeUntilOperator?: MonoTypeOperatorFunction<any>,
    ajaxBodyCreator?: AjaxBodyCreator<A>,
    ajaxRequestInjector?: AjaxRequestInjector<A>,
    useForkJoin?: boolean,
  ) => Observable<A>
}

const transformRequest = <A extends AnyAction>(
  ajax: AjaxCreationMethod,
  request: AjaxRequest,
  action?: A,
  ajaxBodyCreator?: AjaxBodyCreator<A>,
  ajaxRequestInjector?: AjaxRequestInjector<A>,
  index?: number,
): Observable<AjaxResponse> => {
  let transformed: AjaxRequest = request;
  if (exists(action)) {
    if (exists(ajaxRequestInjector)) {
      transformed = (ajaxRequestInjector as AjaxRequestInjector<A>)(
        request,
        (action as A),
        index,
      );
    }
    if (exists(ajaxBodyCreator)) {
      transformed.body = (ajaxBodyCreator as AjaxBodyCreator<A>)(action as A, index);
    }
  }
  return ajax(transformed);
};

const transformRequests = <A extends AnyAction>(
  ajax: AjaxCreationMethod,
  requests: AjaxRequest[],
  action?: A,
  ajaxBodyCreator?: AjaxBodyCreator<A>,
  ajaxRequestInjector?: AjaxRequestInjector<A>,
): Observable<AjaxResponse>[] => (
    requests.map((request: AjaxRequest, index: number): Observable<AjaxResponse> => (
      transformRequest(ajax, request, action, ajaxBodyCreator, ajaxRequestInjector, index)
    ))
  );

const createSingleAjaxObservable = <A extends AnyAction>(
  ajax: AjaxCreationMethod,
  ajaxRequest: AjaxRequest,
  operators: any,
  action?: A,
  ajaxBodyCreator?: AjaxBodyCreator<A>,
  ajaxRequestInjector?: AjaxRequestInjector<A>,
): Observable<A> => {
  const observable: Observable<AjaxResponse> = transformRequest(
    ajax,
    ajaxRequest,
    action,
    ajaxBodyCreator,
    ajaxRequestInjector,
  );
  if (exists(operators.takeUntilOp)) {
    return observable.pipe(
      operators.successOp,
      operators.errorOp,
      operators.takeUntilOp,
    );
  }
  return observable.pipe(
    operators.successOp,
    operators.errorOp,
  );
};

const createMultiAjaxObservable = <A extends AnyAction>(
  ajax: AjaxCreationMethod,
  ajaxRequests: AjaxRequest[],
  operators: any,
  action?: A,
  ajaxBodyCreator?: AjaxBodyCreator<A>,
  ajaxRequestInjector?: AjaxRequestInjector<A>,
): Observable<A> => {
  const observables: Observable<AjaxResponse>[] = transformRequests(
    ajax,
    ajaxRequests,
    action,
    ajaxBodyCreator,
    ajaxRequestInjector,
  );
  if (exists(operators.takeUntilOp)) {
    return merge(...observables).pipe(
      operators.successOp,
      operators.errorOp,
      operators.takeUntilOp,
    );
  }
  return merge(...observables).pipe(
    operators.successOp,
    operators.errorOp,
  );
};

const createForkJoinAjaxObservable = <A extends AnyAction>(
  ajax: AjaxCreationMethod,
  ajaxRequests: AjaxRequest[],
  operators: any,
  action?: A,
  ajaxBodyCreator?: AjaxBodyCreator<A>,
  ajaxRequestInjector?: AjaxRequestInjector<A>,
): Observable<A> => {
  const observables: Observable<AjaxResponse>[] = transformRequests(
    ajax,
    ajaxRequests,
    action,
    ajaxBodyCreator,
    ajaxRequestInjector,
  );
  if (exists(operators.takeUntilOp)) {
    return forkJoin(observables).pipe(
      operators.successOp,
      operators.errorOp,
      operators.takeUntilOp,
    );
  }
  return forkJoin(observables).pipe(
    operators.successOp,
    operators.errorOp,
  );
};

const EpicService: IEpicService = {
  createEpic: <A extends AnyAction, S extends AnyObject>(
    ofTypeFilter: string | string[],
    ajaxRequest: AjaxRequest | AjaxRequest[],
    workingAction: WorkingAction,
    successAction: SuccessAction<A>,
    errorAction: ErrorAction<A>,
    takeUntilTypeFilter?: string,
    ajaxBodyCreator?: AjaxBodyCreator<A>,
    ajaxRequestInjector?: AjaxRequestInjector<A>,
    useForkJoin?: boolean,
  ): EpicCreator<A, S> => ((
    action$: A,
    state$: S,
    { ajax }: EpicDependencies,
  ): Epic<A, A, S, EpicDependencies> => {
    const ofTypeFilters: string[] = !Array.isArray(ofTypeFilter)
      ? [ofTypeFilter]
      : (ofTypeFilter as string[]);
    let takeUntilOperator: MonoTypeOperatorFunction<any>;
    if (exists(takeUntilTypeFilter)) {
      takeUntilOperator = takeUntil(action$.ofType(takeUntilTypeFilter));
    }
    return action$.pipe(
      ofType.apply(ofType, ofTypeFilters),
      switchMap((action: A) => concat(
        of(workingAction({ action })),
        EpicService.createAjaxObservable(
          ajax,
          ajaxRequest,
          successAction,
          errorAction,
          action,
          takeUntilOperator,
          ajaxBodyCreator,
          ajaxRequestInjector,
          useForkJoin,
        ),
      )),
    );
  }),
  createMergeEpic: <A extends AnyAction, S extends AnyObject>(
    ofTypeFilter: string | string[],
    ajaxRequest: AjaxRequest | AjaxRequest[],
    workingAction: WorkingAction,
    successAction: SuccessAction<A>,
    errorAction: ErrorAction<A>,
    takeUntilTypeFilter?: string,
    ajaxBodyCreator?: AjaxBodyCreator<A>,
    ajaxRequestInjector?: AjaxRequestInjector<A>,
    useForkJoin?: boolean,
  ): EpicCreator<A, S> => ((
    action$: A,
    state$: S,
    { ajax }: EpicDependencies,
  ): Epic<A, A, S, EpicDependencies> => {
    const ofTypeFilters: string[] = !Array.isArray(ofTypeFilter)
      ? [ofTypeFilter]
      : (ofTypeFilter as string[]);
    let takeUntilOperator: MonoTypeOperatorFunction<any>;
    if (exists(takeUntilTypeFilter)) {
      takeUntilOperator = takeUntil(action$.ofType(takeUntilTypeFilter));
    }
    return action$.pipe(
      ofType.apply(ofType, ofTypeFilters),
      mergeMap((action: A) => concat(
        of(workingAction({ action })),
        EpicService.createAjaxObservable(
          ajax,
          ajaxRequest,
          successAction,
          errorAction,
          action,
          takeUntilOperator,
          ajaxBodyCreator,
          ajaxRequestInjector,
          useForkJoin,
        ),
      )),
    );
  }),
  createEpicFromProps: <A extends AnyAction, S extends AnyObject>(
    props: EpicCreationProps<A>,
  ): EpicCreator<A, S> => EpicService.createEpic(
    props.ofTypeFilter,
    props.request,
    props.workingAction,
    props.successAction,
    props.errorAction,
    props.takeUntilTypeFilter,
    props.bodyCreator,
    props.requestInjector,
    props.useForkJoin,
  ),
  createMergeEpicFromProps: <A extends AnyAction, S extends AnyObject>(
    props: EpicCreationProps<A>,
  ): EpicCreator<A, S> => EpicService.createMergeEpic(
    props.ofTypeFilter,
    props.request,
    props.workingAction,
    props.successAction,
    props.errorAction,
    props.takeUntilTypeFilter,
    props.bodyCreator,
    props.requestInjector,
    props.useForkJoin,
  ),
  createAjaxObservable: <A extends AnyAction>(
    ajax: AjaxCreationMethod,
    ajaxRequest: AjaxRequest | AjaxRequest[],
    successAction: SuccessAction<A>,
    errorAction: ErrorAction<A>,
    action?: A,
    takeUntilOperator?: MonoTypeOperatorFunction<any>,
    ajaxBodyCreator?: AjaxBodyCreator<A>,
    ajaxRequestInjector?: AjaxRequestInjector<A>,
    useForkJoin?: boolean,
  ): Observable<A> => {
    const operators: any = {
      successOp: mergeMap((response: AjaxResponse | AjaxResponse[]) => (
        successAction(response, action)
      )),
      errorOp: catchError((error: any) => {
        const parsedError: string | null = exists(error)
          ? error
          : null;
        return errorAction(parsedError, action);
      }),
      takeUntilOp: takeUntilOperator,
    };
    const isArrayRequest: boolean = Array.isArray(ajaxRequest);
    if (isArrayRequest && useForkJoin) {
      return createForkJoinAjaxObservable(
        ajax,
        ajaxRequest as AjaxRequest[],
        operators,
        action,
        ajaxBodyCreator,
        ajaxRequestInjector,
      );
    }
    if (isArrayRequest) {
      return createMultiAjaxObservable(
        ajax,
        ajaxRequest as AjaxRequest[],
        operators,
        action,
        ajaxBodyCreator,
        ajaxRequestInjector,
      );
    }
    return createSingleAjaxObservable(
      ajax,
      ajaxRequest as AjaxRequest,
      operators,
      action,
      ajaxBodyCreator,
      ajaxRequestInjector,
    );
  },
};

export default EpicService;
