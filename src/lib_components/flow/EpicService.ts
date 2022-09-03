import {
  of,
  concat,
  merge,
  forkJoin,
  switchMap,
  mergeMap,
  catchError,
  takeUntil,
  Observable,
  MonoTypeOperatorFunction,
} from 'rxjs';
import {
  AjaxConfig,
  AjaxResponse,
  ajax as AjaxCreationMethod,
} from 'rxjs/ajax';
import { AnyAction } from 'redux';
import { ofType, Epic, StateObservable } from 'redux-observable';
import {
  EpicDependencies,
  WorkingAction,
  SuccessAction,
  ErrorAction,
  AjaxBodyCreator,
  AjaxRequestInjector,
  EpicCreationProps,
} from '../types/epic';
import { exists } from '../util/typeUtil';
import { AnyObject } from '../types/core';

export interface IEpicService {
  /**
   * Creator to decorate an EpicCreator function that creates the Epic
   * @param ofTypeFilter
   * @param ajaxConfig
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
    ajaxConfig: AjaxConfig | AjaxConfig[],
    workingAction: WorkingAction,
    successAction: SuccessAction<A>,
    errorAction: ErrorAction<A>,
    takeUntilTypeFilter?: string,
    ajaxBodyCreator?: AjaxBodyCreator<A>,
    ajaxRequestInjector?: AjaxRequestInjector<A>,
    useForkJoin?: boolean,
  ) => Epic<A, A, S, EpicDependencies>;
  /**
   * Creator to decorate an EpicCreator function that creates the Epic
   * @param ofTypeFilter
   * @param ajaxConfig
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
    ajaxConfig: AjaxConfig | AjaxConfig[],
    workingAction: WorkingAction,
    successAction: SuccessAction<A>,
    errorAction: ErrorAction<A>,
    takeUntilTypeFilter?: string,
    ajaxBodyCreator?: AjaxBodyCreator<A>,
    ajaxRequestInjector?: AjaxRequestInjector<A>,
    useForkJoin?: boolean,
  ) => Epic<A, A, S, EpicDependencies>;
  /**
   * Creator to decorate an EpicCreator function that creates the Epic
   * @param props
   * @type A The type of action
   * @type S The type of state
   */
  createEpicFromProps: <A extends AnyAction, S extends AnyObject>(
    props: EpicCreationProps<A>,
  ) => Epic<A, A, S, EpicDependencies>;
  /**
   * Creator to decorate an EpicCreator function that creates the Epic
   * @param props
   * @type A The type of action
   * @type S The type of state
   */
  createMergeEpicFromProps: <A extends AnyAction, S extends AnyObject>(
    props: EpicCreationProps<A>,
  ) => Epic<A, A, S, EpicDependencies>;
  /**
   * Creator to decorate an AJAX observable
   * @param ajax
   * @param ajaxConfig
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
    ajax: typeof AjaxCreationMethod,
    ajaxConfig: AjaxConfig | AjaxConfig[],
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
  ajax: typeof AjaxCreationMethod,
  request: AjaxConfig,
  action?: A,
  ajaxBodyCreator?: AjaxBodyCreator<A>,
  ajaxRequestInjector?: AjaxRequestInjector<A>,
  index?: number,
): Observable<AjaxResponse<unknown>> => {
  let transformed: AjaxConfig = request;
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
  ajax: typeof AjaxCreationMethod,
  requests: AjaxConfig[],
  action?: A,
  ajaxBodyCreator?: AjaxBodyCreator<A>,
  ajaxRequestInjector?: AjaxRequestInjector<A>,
): Observable<AjaxResponse<unknown>>[] => (
    requests.map((request: AjaxConfig, index: number): Observable<AjaxResponse<unknown>> => (
      transformRequest(ajax, request, action, ajaxBodyCreator, ajaxRequestInjector, index)
    ))
  );

const createSingleAjaxObservable = <A extends AnyAction>(
  ajax: typeof AjaxCreationMethod,
  ajaxConfig: AjaxConfig,
  operators: any,
  action?: A,
  ajaxBodyCreator?: AjaxBodyCreator<A>,
  ajaxRequestInjector?: AjaxRequestInjector<A>,
): Observable<A> => {
  const observable: Observable<AjaxResponse<unknown>> = transformRequest(
    ajax,
    ajaxConfig,
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
  ajax: typeof AjaxCreationMethod,
  ajaxConfigs: AjaxConfig[],
  operators: any,
  action?: A,
  ajaxBodyCreator?: AjaxBodyCreator<A>,
  ajaxRequestInjector?: AjaxRequestInjector<A>,
): Observable<A> => {
  const observables: Observable<AjaxResponse<unknown>>[] = transformRequests(
    ajax,
    ajaxConfigs,
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
  ajax: typeof AjaxCreationMethod,
  ajaxConfigs: AjaxConfig[],
  operators: any,
  action?: A,
  ajaxBodyCreator?: AjaxBodyCreator<A>,
  ajaxRequestInjector?: AjaxRequestInjector<A>,
): Observable<A> => {
  const observables: Observable<AjaxResponse<unknown>>[] = transformRequests(
    ajax,
    ajaxConfigs,
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
    ajaxConfig: AjaxConfig | AjaxConfig[],
    workingAction: WorkingAction,
    successAction: SuccessAction<A>,
    errorAction: ErrorAction<A>,
    takeUntilTypeFilter?: string,
    ajaxBodyCreator?: AjaxBodyCreator<A>,
    ajaxRequestInjector?: AjaxRequestInjector<A>,
    useForkJoin?: boolean,
  ): Epic<A, A, S, EpicDependencies> => ((
    action$: Observable<A>,
    state$: StateObservable<S>,
    { ajax }: EpicDependencies,
  ) => {
    const ofTypeFilters: string[] = !Array.isArray(ofTypeFilter)
      ? [ofTypeFilter]
      : (ofTypeFilter as string[]);
    let takeUntilOperator: MonoTypeOperatorFunction<any>;
    if (exists(takeUntilTypeFilter)) {
      takeUntilOperator = takeUntil(action$.pipe(ofType(takeUntilTypeFilter)));
    }
    return action$.pipe(
      // @ts-ignore
      ofType.apply(ofType, ofTypeFilters),
      switchMap((action: A) => concat(
        of(workingAction({ action })),
        EpicService.createAjaxObservable(
          ajax,
          ajaxConfig,
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
    ajaxConfig: AjaxConfig | AjaxConfig[],
    workingAction: WorkingAction,
    successAction: SuccessAction<A>,
    errorAction: ErrorAction<A>,
    takeUntilTypeFilter?: string,
    ajaxBodyCreator?: AjaxBodyCreator<A>,
    ajaxRequestInjector?: AjaxRequestInjector<A>,
    useForkJoin?: boolean,
  ): Epic<A, A, S, EpicDependencies> => ((
    action$: Observable<A>,
    state$: StateObservable<S>,
    { ajax }: EpicDependencies,
  ) => {
    const ofTypeFilters: string[] = !Array.isArray(ofTypeFilter)
      ? [ofTypeFilter]
      : (ofTypeFilter as string[]);
    let takeUntilOperator: MonoTypeOperatorFunction<any>;
    if (exists(takeUntilTypeFilter)) {
      takeUntilOperator = takeUntil(action$.pipe(ofType(takeUntilTypeFilter)));
    }
    return action$.pipe(
      // @ts-ignore
      ofType.apply(ofType, ofTypeFilters),
      mergeMap((action: A) => concat(
        of(workingAction({ action })),
        EpicService.createAjaxObservable(
          ajax,
          ajaxConfig,
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
  ): Epic<A, A, S, EpicDependencies> => EpicService.createEpic(
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
  ): Epic<A, A, S, EpicDependencies> => EpicService.createMergeEpic(
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
    ajax: typeof AjaxCreationMethod,
    ajaxConfig: AjaxConfig | AjaxConfig[],
    successAction: SuccessAction<A>,
    errorAction: ErrorAction<A>,
    action?: A,
    takeUntilOperator?: MonoTypeOperatorFunction<any>,
    ajaxBodyCreator?: AjaxBodyCreator<A>,
    ajaxRequestInjector?: AjaxRequestInjector<A>,
    useForkJoin?: boolean,
  ): Observable<A> => {
    const operators: any = {
      successOp: mergeMap((response: AjaxResponse<unknown> | AjaxResponse<unknown>[]) => (
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
    const isArrayRequest: boolean = Array.isArray(ajaxConfig);
    if (isArrayRequest && useForkJoin) {
      return createForkJoinAjaxObservable(
        ajax,
        ajaxConfig as AjaxConfig[],
        operators,
        action,
        ajaxBodyCreator,
        ajaxRequestInjector,
      );
    }
    if (isArrayRequest) {
      return createMultiAjaxObservable(
        ajax,
        ajaxConfig as AjaxConfig[],
        operators,
        action,
        ajaxBodyCreator,
        ajaxRequestInjector,
      );
    }
    return createSingleAjaxObservable(
      ajax,
      ajaxConfig as AjaxConfig,
      operators,
      action,
      ajaxBodyCreator,
      ajaxRequestInjector,
    );
  },
};

export default EpicService;
