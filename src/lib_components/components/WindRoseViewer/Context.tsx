import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useMemo,
  Dispatch,
} from 'react';
import {
  of,
  forkJoin,
  concat,
  Subject,
  Observable,
  MonoTypeOperatorFunction,
  ObservableInput,
  Subscription,
} from 'rxjs';
import {
  filter,
  mergeMap,
  map,
  switchMap,
  catchError,
  takeUntil,
} from 'rxjs/operators';
import { ajax, AjaxResponse } from 'rxjs/ajax';

import cloneDeep from 'lodash/cloneDeep';

import { parse } from 'papaparse';

import NeonContext from '../NeonContext/NeonContext';
import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';

import { buildWindRoseData, parseWindRoseDataFiles } from './windRoseUtil';
import {
  AnyAction,
  Undef,
  Nullable,
  UnknownRecord,
} from '../../types/core';
import { AsyncStateType } from '../../types/asyncFlow';
import {
  getApiDataQueryParams,
  getDataApiRequest,
  getMonthOptions,
  getSiteOptions,
} from './dataUtil';
import { resolveProps } from '../../util/defaultProps';
import { NeonApiResponse } from '../../types/neonApi';
import { isStringNonEmpty, exists } from '../../util/typeUtil';

interface Position {
  horizontal: string;
  vertical: string;
}

interface WindRoseViewerQueryState {
  changeType: Nullable<string>;
  sites: Array<string>;
  months: Array<string>;
  // Horizontal and vertical spatial index coordinates
  positions: Array<Position>;
}

interface WindRoseViewerDataState {
  dailyBins: Record<number, unknown>;
  current: Nullable<[]>;
}

interface SelectionOption {
  value: string;
  label: string;
}

interface PositionDisplayOption extends SelectionOption {
  position: Position;
}

export interface FetchStatusState {
  status: AsyncStateType,
  error?: Nullable<UnknownRecord|string>,
}

interface WindRoseViewerFetchState {
  product: Nullable<FetchStatusState>;
  data: Nullable<FetchStatusState>;
}

export interface WindRoseViewerState {
  productCode: Nullable<string>;
  release: Undef<string>;
  product: Nullable<Record<string, unknown>>;
  fetchState: WindRoseViewerFetchState;
  dataStateMessage: Nullable<string>;
  siteOptions: Array<SelectionOption>;
  monthOptions: Array<SelectionOption>;
  positionOptions: Array<PositionDisplayOption>;
  query: WindRoseViewerQueryState;
  data: WindRoseViewerDataState;
  neonContextState: UnknownRecord;
}

const DEFAULT_STATE: WindRoseViewerState = {
  productCode: null,
  release: undefined,
  product: null,
  fetchState: {
    product: {
      status: AsyncStateType.IDLE,
      error: null,
    },
    data: null,
  },
  dataStateMessage: null,
  siteOptions: [],
  monthOptions: [],
  positionOptions: [],
  query: {
    changeType: null,
    sites: [],
    months: [],
    positions: [],
  },
  data: {
    dailyBins: {},
    current: null,
  },
  neonContextState: cloneDeep(NeonContext.DEFAULT_STATE),
};

const getDefaultState = () => cloneDeep(DEFAULT_STATE);
const getDefaultFetchProducState = () => cloneDeep(DEFAULT_STATE.fetchState.product);

const StateContext = createContext<WindRoseViewerState>(getDefaultState());
const DispatchContext = createContext<Undef<Dispatch<AnyAction>>>(undefined);

export const useStateContext = (): WindRoseViewerState => ((
  useContext(StateContext)
));

export const useDispatchContext = (): Dispatch<AnyAction> => {
  const dispatchContext = useContext(DispatchContext);
  if (!dispatchContext) {
    throw new Error('Failed to initialize dispatch context');
  }
  return dispatchContext;
};

const buildProductQuery = (productCode: string, release?: string): string => {
  const hasRelease = isStringNonEmpty(release);
  const releaseArgument = !hasRelease ? '' : `, release: "${release as string}"`;
  return `query Product {
    product(productCode: "${productCode}"${releaseArgument}) {
      productCode
      productName
      productDescription
      siteCodes {
        siteCode
        availableMonths
        availableReleases {
          release
          availableMonths
        }
      }
    }
  }`;
};

type DataProductResponse = { 'product': Record<string, unknown> };

const verifyProductResponse = (
  response: AjaxResponse<NeonApiResponse<DataProductResponse>>,
): boolean => (
  exists(response)
  && exists(response.response)
  && exists(response.response.data)
  && exists(response.response.data.product)
);

export enum ActionTypes {
  STORE_FINALIZED_NEON_CONTEXT_STATE = 'STORE_FINALIZED_NEON_CONTEXT_STATE',
  FETCH_PRODUCT = 'FETCH_PRODUCT',
  FETCH_PRODUCT_STARTED = 'FETCH_PRODUCT_STARTED',
  FETCH_PRODUCT_FAILED = 'FETCH_PRODUCT_FAILED',
  FETCH_PRODUCT_SUCCEEDED = 'FETCH_PRODUCT_SUCCEEDED',
  RESET_FETCH_PRODUCT = 'RESET_FETCH_PRODUCT',
  FETCH_WIND_ROSE = 'FETCH_WIND_ROSE',
  FETCH_WIND_ROSE_WORKING = 'FETCH_WIND_ROSE_WORKING',
  FETCH_WIND_ROSE_FULLFILLED = 'FETCH_WIND_ROSE_FULLFILLED',
  FETCH_WIND_ROSE_FAILED = 'FETCH_WIND_ROSE_FAILED',
  RESET_WIND_ROSE = 'RESET_WIND_ROSE',
  REINITIALIZE = 'REINITIALIZE',
}

export interface StoreFinalizedNeonContextStateAction extends AnyAction {
  type: typeof ActionTypes.STORE_FINALIZED_NEON_CONTEXT_STATE;
  neonContextState: UnknownRecord;
}
export interface FetchProductAction extends AnyAction {
  type: typeof ActionTypes.FETCH_PRODUCT;
  productCode: string;
  release: Undef<string>;
}
export interface FetchProductStartedAction extends AnyAction {
  type: typeof ActionTypes.FETCH_PRODUCT_STARTED;
}
export interface FetchProductFailedAction extends AnyAction {
  type: typeof ActionTypes.FETCH_PRODUCT_FAILED;
  error: Nullable<AjaxResponse<unknown>|string>;
}
export interface FetchProductSucceededAction extends AnyAction {
  type: typeof ActionTypes.FETCH_PRODUCT_SUCCEEDED;
  data: UnknownRecord;
}
interface ResetFetchProductAction extends AnyAction {
  type: typeof ActionTypes.RESET_FETCH_PRODUCT;
}
interface FetchWindRoseAction extends AnyAction {
  type: typeof ActionTypes.FETCH_WIND_ROSE;
  product: UnknownRecord;
  release: Undef<string>;
  query: WindRoseViewerQueryState;
}
interface FetchWindRoseWorkingAction extends AnyAction {
  type: typeof ActionTypes.FETCH_WIND_ROSE_WORKING;
}
interface FetchWindRoseFullfilledAction extends AnyAction {
  type: typeof ActionTypes.FETCH_WIND_ROSE_FULLFILLED;
  response: unknown;
  query: WindRoseViewerQueryState;
}
interface FetchWindRoseFailedAction extends AnyAction {
  type: typeof ActionTypes.FETCH_WIND_ROSE_FAILED;
  error: unknown;
  response: unknown;
  initAction: FetchWindRoseAction;
}
interface ResetWindRoseAction extends AnyAction {
  type: typeof ActionTypes.RESET_WIND_ROSE;
}
interface ReinitializeAction extends AnyAction {
  type: typeof ActionTypes.REINITIALIZE;
  productCode: string;
  release: Undef<string>;
}

type WindRoseViewerActionTypes = (
  StoreFinalizedNeonContextStateAction
  | FetchProductAction
  | FetchProductStartedAction
  | FetchProductFailedAction
  | FetchProductSucceededAction
  | ResetFetchProductAction
  | FetchWindRoseAction
  | FetchWindRoseWorkingAction
  | FetchWindRoseFullfilledAction
  | FetchWindRoseFailedAction
  | ResetWindRoseAction
  | ReinitializeAction
  | AnyAction
);

export const ActionCreator = {
  storeFinalizedNeonContextState: (
    neonContextState: UnknownRecord,
  ): StoreFinalizedNeonContextStateAction => ({
    type: ActionTypes.STORE_FINALIZED_NEON_CONTEXT_STATE,
    neonContextState,
  }),
  fetchProduct: (productCode: string, release?: string): FetchProductAction => ({
    type: ActionTypes.FETCH_PRODUCT,
    productCode,
    release,
  }),
  fetchProductStarted: (): FetchProductStartedAction => ({
    type: ActionTypes.FETCH_PRODUCT_STARTED,
  }),
  fetchProductFailed: (
    error: Nullable<AjaxResponse<unknown>|string>,
  ): FetchProductFailedAction => ({
    type: ActionTypes.FETCH_PRODUCT_FAILED,
    error,
  }),
  fetchProductSucceeded: (data: UnknownRecord): FetchProductSucceededAction => ({
    type: ActionTypes.FETCH_PRODUCT_SUCCEEDED,
    data,
  }),
  resetFetchProduct: (): ResetFetchProductAction => ({
    type: ActionTypes.RESET_FETCH_PRODUCT,
  }),
  fetchWindRose: (
    product: UnknownRecord,
    release: Undef<string>,
    query: WindRoseViewerQueryState,
  ): FetchWindRoseAction => ({
    type: ActionTypes.FETCH_WIND_ROSE,
    product,
    release,
    query,
  }),
  fetchWindRoseWorking: (): FetchWindRoseWorkingAction => ({
    type: ActionTypes.FETCH_WIND_ROSE_WORKING,
  }),
  fetchWindRoseFullfilled: (
    response: unknown,
    query: WindRoseViewerQueryState,
  ): FetchWindRoseFullfilledAction => ({
    type: ActionTypes.FETCH_WIND_ROSE_FULLFILLED,
    response,
    query,
  }),
  fetchWindRoseFailed: (
    error: unknown,
    response: unknown,
    initAction: FetchWindRoseAction,
  ): FetchWindRoseFailedAction => ({
    type: ActionTypes.FETCH_WIND_ROSE_FAILED,
    error,
    response,
    initAction,
  }),
  resetWindRose: (): ResetWindRoseAction => ({
    type: ActionTypes.RESET_WIND_ROSE,
  }),
  reinitialize: (productCode: string, release?: string): ReinitializeAction => ({
    type: ActionTypes.REINITIALIZE,
    productCode,
    release,
  }),
};

const reducer = (
  state: WindRoseViewerState,
  action: WindRoseViewerActionTypes,
): WindRoseViewerState => {
  console.log(action);
  const newState: WindRoseViewerState = { ...state };
  let wrfAction: FetchWindRoseFullfilledAction;
  let wrFailedAction: FetchWindRoseFailedAction;
  switch (action.type) {
    case ActionTypes.STORE_FINALIZED_NEON_CONTEXT_STATE:
      newState.neonContextState = (action as StoreFinalizedNeonContextStateAction).neonContextState;
      return newState;
    case ActionTypes.FETCH_PRODUCT:
      return newState;
    case ActionTypes.FETCH_PRODUCT_STARTED:
      (newState.fetchState.product as FetchStatusState).status = AsyncStateType.WORKING;
      return newState;
    case ActionTypes.FETCH_PRODUCT_FAILED:
      (newState.fetchState.product as FetchStatusState).status = AsyncStateType.FAILED;
      (newState.fetchState.product as FetchStatusState).error = (action as FetchProductFailedAction).error as any;
      return newState;
    case ActionTypes.FETCH_PRODUCT_SUCCEEDED:
      (newState.fetchState.product as FetchStatusState).status = AsyncStateType.FULLFILLED;
      newState.product = (action as FetchProductSucceededAction).data;
      return newState;
    case ActionTypes.RESET_FETCH_PRODUCT:
      return {
        ...newState,
        product: null,
        fetchState: {
          ...newState.fetchState,
          product: getDefaultFetchProducState(),
        },
      };
    case ActionTypes.FETCH_WIND_ROSE:
      return newState;
    case ActionTypes.FETCH_WIND_ROSE_WORKING:
      newState.fetchState.data = {
        ...newState.fetchState.data,
        status: AsyncStateType.WORKING,
        error: null,
      };
      return newState;
    case ActionTypes.FETCH_WIND_ROSE_FULLFILLED:
      wrfAction = action as FetchWindRoseFullfilledAction;
      newState.fetchState.data = {
        ...newState.fetchState.data,
        status: AsyncStateType.FULLFILLED,
        error: null,
      };
      newState.dataStateMessage = (wrfAction.response as UnknownRecord).dataStateMessage as string;
      newState.siteOptions = getSiteOptions(
        newState.product,
        (newState.neonContextState?.data as any).sites,
      );
      newState.monthOptions = getMonthOptions(newState.product, wrfAction.query.sites);
      newState.positionOptions = (wrfAction.response as UnknownRecord).positionOptions as PositionDisplayOption[];
      newState.data = {
        ...newState.data,
        dailyBins: (wrfAction.response as UnknownRecord).windRoseDailyBins as Record<number, unknown>,
        current: (wrfAction.response as UnknownRecord).currentWindRose as [],
      };
      newState.query = {
        ...newState.query,
        sites: wrfAction.query.sites.map((value) => value),
        months: wrfAction.query.months.map((value) => value),
        positions: ((wrfAction.response as UnknownRecord).positions as [])
          .map((value) => value),
      };
      return newState;
    case ActionTypes.FETCH_WIND_ROSE_FAILED:
      wrFailedAction = action as FetchWindRoseFailedAction;
      newState.fetchState.data = {
        ...newState.fetchState.data,
        status: AsyncStateType.FAILED,
        error: wrFailedAction.error as Nullable<string | UnknownRecord>,
      };
      newState.dataStateMessage = null;
      newState.siteOptions = getSiteOptions(newState.product, (newState.neonContextState?.data as any).sites);
      newState.monthOptions = getMonthOptions(newState.product, wrFailedAction.initAction.query.sites);
      newState.data = {
        ...newState.data,
        dailyBins: {},
        current: null,
      };
      newState.query = {
        ...newState.query,
        ...wrFailedAction.initAction.query,
      };
      return newState;
    case ActionTypes.RESET_WIND_ROSE:
      return getDefaultState();
    case ActionTypes.REINITIALIZE:
      return {
        ...getDefaultState(),
        productCode: (action as ReinitializeAction).productCode,
        release: (action as ReinitializeAction).release,
      };
    default:
      break;
  }
  return newState;
};

type Epic = (action$: Observable<AnyAction>) => Observable<unknown>;
type EpicSubscribeFunc = (value: unknown) => void;

// Subject for action side effects / middleware event stream
const actionStream$ = new Subject<AnyAction>();
// Cancellation subjects
const cancelProduct$ = new Subject<void>();
const cancelWindRose$ = new Subject<void>();

/**
 * Gets the data endpoint AJAX observable to subscribe to
 * @param {*} action
 * @param {*} takeUntilOperator
 */
const buildFetchProductObservable = (
  action: AnyAction,
  takeUntilOperator: MonoTypeOperatorFunction<unknown>,
): Observable<unknown> => {
  const fetchProductAction: FetchProductAction = action as FetchProductAction;
  const productObs = NeonGraphQL.getGraphqlQuery(
    buildProductQuery(fetchProductAction.productCode, fetchProductAction.release),
  ) as Observable<AjaxResponse<NeonApiResponse<DataProductResponse>>>;
  return productObs.pipe(
    mergeMap((response: AjaxResponse<NeonApiResponse<DataProductResponse>>): Observable<unknown> => {
      if (!verifyProductResponse(response)) {
        return of(ActionCreator.fetchProductFailed('Failed to fetch product'));
      }
      return of(ActionCreator.fetchProductSucceeded(response.response.data.product));
    }),
    catchError((error: AjaxResponse<unknown>): ObservableInput<any> => (
      of(ActionCreator.fetchProductFailed(error))
    )),
    takeUntilOperator,
  );
};

/**
 * Builds the files AJAX observable to obtain wind rose raw data
 * and variables
 * @param {*} action
 * @param {*} response
 * @param {*} takeUntilOperator
 */
const buildFilesAjaxObservable = (
  action: AnyAction,
  response: any,
  takeUntilOperator: MonoTypeOperatorFunction<unknown>,
): Observable<unknown> => {
  const dataFilesInfo = parseWindRoseDataFiles(response.response.data, action.query);
  if (!dataFilesInfo
      || (dataFilesInfo.dataFileUrls === null)
      || (dataFilesInfo.dataFileUrls.length <= 0)) {
    throw new Error('API data endpoint failed');
  }
  // Build parallel XHR requests for data and variables
  const ajaxObservables = [];
  const dataFilesAjax = dataFilesInfo.dataFileUrls.map((dataFileUrl) => (
    ajax({
      method: 'GET',
      crossDomain: true,
      url: dataFileUrl,
      responseType: 'text',
    })
  ));
  ajaxObservables.push(
    forkJoin(dataFilesAjax).pipe(
      map((responses) => responses),
      catchError(() => of([])),
    ),
  );
  if (dataFilesInfo.variablesFileUrl) {
    ajaxObservables.push(
      ajax({
        method: 'GET',
        crossDomain: true,
        url: dataFilesInfo.variablesFileUrl,
        responseType: 'text',
      }),
    );
  }
  return forkJoin(ajaxObservables).pipe(
    mergeMap((responses) => {
      // Parse each data file response
      let dataFilesResponseData: any[] = [];
      const dataResponses: any[] = responses[0] as any[];
      if ((dataResponses !== null) && (dataResponses.length > 0)) {
        dataFilesResponseData = dataResponses.map((dataResponse: any) => {
          const csvData = dataResponse.response;
          return parse(csvData, {
            header: true,
            skipEmptyLines: 'greedy',
          });
        });
      }
      // Build wind rose data, return the fullfilled action to be dispatched
      const windRoseData = buildWindRoseData(
        dataFilesResponseData,
        dataFilesInfo,
      );
      return of(ActionCreator.fetchWindRoseFullfilled(windRoseData, (action as FetchWindRoseAction).query));
    }),
    catchError((error) => {
      const message = error.xhr ? error.xhr.response : null;
      return of(ActionCreator.fetchWindRoseFailed(error, message, (action as FetchWindRoseAction)));
    }),
    takeUntilOperator,
  );
};

/**
 * Gets the data endpoint AJAX observable to subscribe to
 * @param {*} action
 * @param {*} takeUntilOperator
 */
const buildDataApiObservable = (
  action: AnyAction,
  takeUntilOperator: MonoTypeOperatorFunction<unknown>,
): Observable<unknown> => {
  // Get query params to send with request
  const queryParams = getApiDataQueryParams(action);
  // XHR for API data endpoint to retrieve available files
  return ajax({
    method: 'GET',
    crossDomain: true,
    responseType: 'json',
    url: getDataApiRequest(
      queryParams.productCode,
      queryParams.release,
      queryParams.site,
      queryParams.month,
    ),
  }).pipe(
    mergeMap((response: AjaxResponse<unknown>): Observable<unknown> => (
      buildFilesAjaxObservable(action, response, takeUntilOperator)
    )),
    catchError((error: Record<string, unknown>): ObservableInput<any> => {
      const response = error && error.xhr ? (error.xhr as XMLHttpRequest).response : null;
      return of(ActionCreator.fetchWindRoseFailed(error, response, (action as FetchWindRoseAction)));
    }),
    takeUntilOperator,
  );
};

/**
 * Epic for fetching wind rose data
 * @param {*} action$ Action stream
 */
const fetchProductEpic: Epic = (action$: Observable<AnyAction>): Observable<unknown> => ((
  action$.pipe(
    filter((action: AnyAction) => action.type === ActionTypes.FETCH_PRODUCT),
    switchMap((action: AnyAction) => concat(
      of(ActionCreator.fetchProductStarted()),
      buildFetchProductObservable(action, takeUntil(cancelProduct$)),
    )),
  )
));

/**
 * Epic for fetching wind rose data
 * @param {*} action$ Action stream
 */
const fetchWindRoseDataEpic: Epic = (action$: Observable<AnyAction>): Observable<unknown> => ((
  action$.pipe(
    filter((action: AnyAction) => action.type === ActionTypes.FETCH_WIND_ROSE),
    switchMap((action: AnyAction) => concat(
      of(ActionCreator.fetchWindRoseWorking()),
      buildDataApiObservable(action, takeUntil(cancelWindRose$)),
    )),
  )
));

interface ProviderProps {
  productCode: Nullable<string>;
  release: Undef<string>;
  // eslint-disable-next-line react/require-default-props
  children?: React.ReactNode | React.ReactNode[];
}
const providerDefaultProps: ProviderProps = {
  productCode: null,
  release: undefined,
  children: undefined,
};

const Provider: React.FC<ProviderProps> = (inProps: ProviderProps): React.JSX.Element => {
  const props = resolveProps(providerDefaultProps, inProps);
  const {
    productCode: propsProductCode,
    release: propsRelease,
    children,
  } = props;
  const [neonContextState] = NeonContext.useNeonContextState();
  const {
    isFinal: neonContextIsFinal,
    hasError: neonContextHasError,
  } = neonContextState;
  const initialState = {
    ...getDefaultState(),
    productCode: propsProductCode,
    release: propsRelease,
  };
  if (neonContextIsFinal || neonContextHasError) {
    initialState.neonContextState = { ...neonContextState };
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(JSON.parse(JSON.stringify(state)));
  const {
    productCode,
    release,
    product,
    fetchState: {
      product: productFetchState,
      data: dataFetchState,
    },
    query,
  } = state;
  // Dispatch function enhanced to handle both reducer and action streams
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const enhancedDispatch: Dispatch<AnyAction> = useMemo(() => (
    action: AnyAction,
  ): void => {
    // Send action to reducer
    dispatch(action);
    // Send action to stream
    actionStream$.next(action);
    switch (action.type) {
      case ActionTypes.RESET_FETCH_PRODUCT:
        cancelProduct$.next();
        break;
      case ActionTypes.RESET_WIND_ROSE:
      case ActionTypes.REINITIALIZE:
        cancelProduct$.next();
        cancelWindRose$.next();
        break;
      default:
        break;
    }
  }, []);
  useEffect(() => {
    const subscriptions: Subscription[] = [
      fetchProductEpic(actionStream$).subscribe(enhancedDispatch as EpicSubscribeFunc),
      fetchWindRoseDataEpic(actionStream$).subscribe(enhancedDispatch as EpicSubscribeFunc),
    ];
    // Cleanup subscription when component unmounts
    return () => {
      subscriptions.forEach((s: Subscription): void => s.unsubscribe());
      // Ensure any ongoing operations are canceled
      cancelProduct$.next();
      cancelWindRose$.next();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (neonContextIsFinal || neonContextHasError) {
      enhancedDispatch(ActionCreator.storeFinalizedNeonContextState(neonContextState));
    }
  }, [
    enhancedDispatch,
    neonContextState,
    neonContextIsFinal,
    neonContextHasError,
  ]);
  const productStringified: string = JSON.stringify(product);
  useEffect(() => {
    if (!neonContextIsFinal) { return; }
    if (exists(product)) { return; }
    if ((productFetchState as FetchStatusState).status !== AsyncStateType.IDLE) {
      return;
    }
    const queryProductCode: string = propsProductCode as string;
    enhancedDispatch(ActionCreator.fetchProduct(queryProductCode, propsRelease));
  }, [
    enhancedDispatch,
    neonContextIsFinal,
    productFetchState,
    propsProductCode,
    propsRelease,
    product,
    productStringified,
  ]);
  useEffect(() => {
    if (!neonContextIsFinal) { return; }
    if (!exists(product)) { return; }
    if (!exists(dataFetchState)
        || ((dataFetchState as FetchStatusState).status === AsyncStateType.IDLE)) {
      enhancedDispatch(ActionCreator.fetchWindRose(product as UnknownRecord, release, query));
    }
  }, [
    enhancedDispatch,
    neonContextIsFinal,
    product,
    productStringified,
    release,
    query,
    dataFetchState,
  ]);
  useEffect(() => {
    if (!neonContextIsFinal) { return; }
    const productChanged = productCode !== propsProductCode;
    const releaseChanged = release !== propsRelease;
    if (productChanged || releaseChanged) {
      enhancedDispatch(ActionCreator.reinitialize(propsProductCode, propsRelease));
    }
  }, [
    enhancedDispatch,
    neonContextIsFinal,
    productCode,
    release,
    propsProductCode,
    propsRelease,
  ]);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={enhancedDispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export default Provider;
