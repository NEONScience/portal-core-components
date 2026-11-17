import React, {
  createContext,
  useCallback,
  useReducer,
  useContext,
  useEffect,
  useMemo,
  Dispatch,
} from 'react';
import {
  of,
  from,
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

import NeonApi from '../NeonApi/NeonApi';
import NeonAuthContext from '../NeonContext/NeonAuthContext';
import NeonContext from '../NeonContext/NeonContext';
import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';

import {
  buildWindRoseData,
  parseWindRoseDataFiles,
  resolveSelectedDay,
  stepDay,
  WindRoseAggregate,
  WindRoseData,
  WindRosePosition,
  WindRosePositionOption,
  WindRoseQualityFilter,
} from './windRoseUtil';
import { getEmptyTimeSeries, WindSpeedTimeSeries } from './windRoseTimeSeriesUtil';
import {
  buildPeriodDataSets,
  getAvailablePeriodMonths,
  getMonthCacheKey,
  getPeriodMonths,
  WindRosePeriodDataState,
  WindRosePeriodType,
} from './windRosePeriodUtil';
import {
  cacheMonth,
  getEmptyMonthCache,
  markMonthFailed,
  touchMonths,
  WindRoseMonthCache,
} from './windRoseMonthCache';
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
import { exists, isStringNonEmpty } from '../../util/typeUtil';
import { getUserAgentHeader } from '../../util/requestUtil';

/**
 * Temporal aggregations a wind rose can be viewed at
 */
export enum WindRoseAggregation {
  MONTHLY = 'MONTHLY',
  DAILY = 'DAILY',
  // The meteorological season containing the selected month, e.g. June to August
  SEASONAL = 'SEASONAL',
  // The calendar year containing the selected month
  ANNUAL = 'ANNUAL',
}

/**
 * Gets the period of more than a month an aggregation spans, if any
 */
export const getAggregationPeriodType = (
  aggregation: WindRoseAggregation,
): Nullable<WindRosePeriodType> => {
  switch (aggregation) {
    case WindRoseAggregation.SEASONAL:
      return WindRosePeriodType.SEASON;
    case WindRoseAggregation.ANNUAL:
      return WindRosePeriodType.YEAR;
    default:
      return null;
  }
};

export interface WindRoseViewerQueryState {
  changeType: Nullable<string>;
  sites: Array<string>;
  months: Array<string>;
  // Horizontal and vertical spatial index coordinates
  positions: Array<WindRosePosition>;
}

export interface WindRoseViewerDataState {
  // Wind rose of every observation in the month
  monthly: Nullable<WindRoseAggregate>;
  // Wind rose of each day in the month, keyed by YYYY-MM-DD
  daily: Record<string, WindRoseAggregate>;
  // Days with observations, sorted ascending
  days: string[];
  // Wind speed over time of every observation in the month
  timeSeries: WindSpeedTimeSeries;
}

export interface SelectionOption {
  value: string;
  label: string;
}

export type PositionDisplayOption = WindRosePositionOption;

export interface FetchStatusState {
  status: AsyncStateType;
  error?: Nullable<UnknownRecord|string>;
}

interface WindRoseViewerFetchState {
  product: Nullable<FetchStatusState>;
  data: Nullable<FetchStatusState>;
}

interface WindRosePeriodFetchState {
  // Cache key of the site and positions the months are being fetched for
  key: Nullable<string>;
  // Months still being fetched
  pending: string[];
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
  aggregation: WindRoseAggregation;
  qualityFilter: WindRoseQualityFilter;
  // Day (YYYY-MM-DD) shown in the daily aggregation
  selectedDay: Nullable<string>;
  // Whether the daily aggregation is automatically stepping through the days
  isPlaying: boolean;
  // Wind roses of the observations selected by the quality filter
  data: WindRoseViewerDataState;
  // Wind roses of each quality filter, so switching filters needs no refetch
  dataSets: Record<WindRoseQualityFilter, WindRoseViewerDataState>;
  // Months fetched for the site and positions, so each is only fetched once
  monthCache: WindRoseMonthCache;
  // Months being fetched for the seasonal and annual aggregations
  periodFetch: WindRosePeriodFetchState;
  // Whether the product (and so data) were fetched in limited mode, null until fetched
  isViewerLimitedMode: Nullable<boolean>;
  neonContextState: UnknownRecord;
}

const getEmptyDataSets = (): Record<WindRoseQualityFilter, WindRoseViewerDataState> => ({
  [WindRoseQualityFilter.VALIDATED]: {
    monthly: null,
    daily: {},
    days: [],
    timeSeries: getEmptyTimeSeries(),
  },
  [WindRoseQualityFilter.ALL]: {
    monthly: null,
    daily: {},
    days: [],
    timeSeries: getEmptyTimeSeries(),
  },
});

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
  aggregation: WindRoseAggregation.MONTHLY,
  qualityFilter: WindRoseQualityFilter.ALL,
  selectedDay: null,
  isPlaying: false,
  data: {
    monthly: null,
    daily: {},
    days: [],
    timeSeries: getEmptyTimeSeries(),
  },
  dataSets: getEmptyDataSets(),
  monthCache: getEmptyMonthCache(),
  periodFetch: {
    key: null,
    pending: [],
  },
  isViewerLimitedMode: null,
  neonContextState: cloneDeep(NeonContext.DEFAULT_STATE),
};

const getDefaultState = () => cloneDeep(DEFAULT_STATE);
const getDefaultFetchProducState = () => cloneDeep(DEFAULT_STATE.fetchState.product);

/**
 * Gets the months being viewed: the month viewed, and the months of the season or year viewed
 */
const getMonthsInUse = (state: WindRoseViewerState): string[] => {
  const month = state.query.months[0];
  if (!month) {
    return [];
  }
  const periodType = getAggregationPeriodType(state.aggregation);
  return periodType ? getPeriodMonths(periodType, month) : [month];
};

const removePendingMonth = (
  periodFetch: WindRosePeriodFetchState,
  key: string,
  month: string,
): WindRosePeriodFetchState => (
  (periodFetch.key !== key) ? periodFetch : {
    ...periodFetch,
    pending: periodFetch.pending.filter((pendingMonth: string) => pendingMonth !== month),
  }
);

export const LOGIN_REQUIRED_MESSAGE = 'Login required to view release data';

/**
 * Whether viewing the release requires signing in, as release data are not available in limited
 * mode (when the user cannot access data), in the same way as the time series viewer
 * @param isViewerLimited Whether the viewer is limited to the demo dataset
 * @param release The release to view, if any
 */
export const isReleaseLoginRequired = (
  isViewerLimited: boolean,
  release: Nullable<string>,
): boolean => isViewerLimited && isStringNonEmpty(release);

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

export interface WindRoseViewerAccess {
  // Whether the user's session state has been determined
  ready: boolean;
  // Whether the viewer is limited to the demo dataset as the user cannot access data
  isViewerLimited: boolean;
  // Whether signing in is required to view the selected release
  isLoginRequired: boolean;
}

/**
 * Gets which data the user can view, based on the same session state the viewer fetches with
 */
export const useWindRoseViewerAccess = (): WindRoseViewerAccess => {
  const { release }: WindRoseViewerState = useStateContext();
  const neonAuthContextSessionState = NeonAuthContext.useNeonAuthContextSessionState();
  const ready = neonAuthContextSessionState.ready === true;
  const isViewerLimited = !neonAuthContextSessionState.canAccessData;
  return {
    ready,
    isViewerLimited,
    isLoginRequired: ready && isReleaseLoginRequired(isViewerLimited, release),
  };
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
  SET_AGGREGATION = 'SET_AGGREGATION',
  SET_QUALITY_FILTER = 'SET_QUALITY_FILTER',
  SELECT_DAY = 'SELECT_DAY',
  STEP_DAY = 'STEP_DAY',
  SET_PLAYING = 'SET_PLAYING',
  FETCH_PERIOD = 'FETCH_PERIOD',
  FETCH_PERIOD_MONTH_FULFILLED = 'FETCH_PERIOD_MONTH_FULFILLED',
  FETCH_PERIOD_MONTH_FAILED = 'FETCH_PERIOD_MONTH_FAILED',
}

export interface StoreFinalizedNeonContextStateAction extends AnyAction {
  type: typeof ActionTypes.STORE_FINALIZED_NEON_CONTEXT_STATE;
  neonContextState: UnknownRecord;
}
export interface FetchProductAction extends AnyAction {
  type: typeof ActionTypes.FETCH_PRODUCT;
  productCode: string;
  release: Undef<string>;
  // Whether the product is fetched in limited mode
  isViewerLimited: boolean;
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
  // Wind rose data already fetched for the query, which is used rather than fetching it again
  cached: Nullable<WindRoseData>;
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
interface SetAggregationAction extends AnyAction {
  type: typeof ActionTypes.SET_AGGREGATION;
  aggregation: WindRoseAggregation;
}
interface SetQualityFilterAction extends AnyAction {
  type: typeof ActionTypes.SET_QUALITY_FILTER;
  qualityFilter: WindRoseQualityFilter;
}
interface SelectDayAction extends AnyAction {
  type: typeof ActionTypes.SELECT_DAY;
  day: string;
}
interface StepDayAction extends AnyAction {
  type: typeof ActionTypes.STEP_DAY;
  step: number;
  // Whether to wrap around the days of the month rather than stop at either end
  wrap: boolean;
  // Whether the step is from playback rather than the user, which stops playback
  fromPlayback: boolean;
}
interface SetPlayingAction extends AnyAction {
  type: typeof ActionTypes.SET_PLAYING;
  isPlaying: boolean;
}
interface FetchPeriodAction extends AnyAction {
  type: typeof ActionTypes.FETCH_PERIOD;
  productCode: string;
  release: Undef<string>;
  site: string;
  positions: WindRosePosition[];
  // Cache key of the site and positions, see getMonthCacheKey
  key: string;
  // Months (YYYY-MM) of the season or year to fetch
  months: string[];
}
interface FetchPeriodMonthFulfilledAction extends AnyAction {
  type: typeof ActionTypes.FETCH_PERIOD_MONTH_FULFILLED;
  key: string;
  month: string;
  data: WindRoseData;
}
interface FetchPeriodMonthFailedAction extends AnyAction {
  type: typeof ActionTypes.FETCH_PERIOD_MONTH_FAILED;
  key: string;
  month: string;
  error: unknown;
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
  | SetAggregationAction
  | SetQualityFilterAction
  | SelectDayAction
  | StepDayAction
  | SetPlayingAction
  | FetchPeriodAction
  | FetchPeriodMonthFulfilledAction
  | FetchPeriodMonthFailedAction
  | AnyAction
);

export const ActionCreator = {
  storeFinalizedNeonContextState: (
    neonContextState: UnknownRecord,
  ): StoreFinalizedNeonContextStateAction => ({
    type: ActionTypes.STORE_FINALIZED_NEON_CONTEXT_STATE,
    neonContextState,
  }),
  fetchProduct: (
    productCode: string,
    release?: string,
    isViewerLimited = false,
  ): FetchProductAction => ({
    type: ActionTypes.FETCH_PRODUCT,
    productCode,
    release,
    isViewerLimited,
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
    cached: Nullable<WindRoseData> = null,
  ): FetchWindRoseAction => ({
    type: ActionTypes.FETCH_WIND_ROSE,
    product,
    release,
    query,
    cached,
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
  setAggregation: (aggregation: WindRoseAggregation): SetAggregationAction => ({
    type: ActionTypes.SET_AGGREGATION,
    aggregation,
  }),
  setQualityFilter: (qualityFilter: WindRoseQualityFilter): SetQualityFilterAction => ({
    type: ActionTypes.SET_QUALITY_FILTER,
    qualityFilter,
  }),
  // Selecting a day shows its wind rose, switching to the daily aggregation if necessary.
  // The day may be in a month that has not been fetched yet, see resolveSelectedDay.
  selectDay: (day: string): SelectDayAction => ({
    type: ActionTypes.SELECT_DAY,
    day,
  }),
  stepDay: (step: number, wrap = false, fromPlayback = false): StepDayAction => ({
    type: ActionTypes.STEP_DAY,
    step,
    wrap,
    fromPlayback,
  }),
  setPlaying: (isPlaying: boolean): SetPlayingAction => ({
    type: ActionTypes.SET_PLAYING,
    isPlaying,
  }),
  // Fetches the months of a season or year that are not cached, one action per month fulfilled
  fetchPeriod: (
    productCode: string,
    release: Undef<string>,
    site: string,
    positions: WindRosePosition[],
    key: string,
    months: string[],
  ): FetchPeriodAction => ({
    type: ActionTypes.FETCH_PERIOD,
    productCode,
    release,
    site,
    positions,
    key,
    months,
  }),
  fetchPeriodMonthFulfilled: (
    key: string,
    month: string,
    data: WindRoseData,
  ): FetchPeriodMonthFulfilledAction => ({
    type: ActionTypes.FETCH_PERIOD_MONTH_FULFILLED,
    key,
    month,
    data,
  }),
  fetchPeriodMonthFailed: (
    key: string,
    month: string,
    error: unknown,
  ): FetchPeriodMonthFailedAction => ({
    type: ActionTypes.FETCH_PERIOD_MONTH_FAILED,
    key,
    month,
    error,
  }),
};

export type FetchWindRoseFunc = (
  changeType: string,
  queryChanges: Partial<WindRoseViewerQueryState>,
) => void;

/**
 * Gets a function to fetch the wind rose for the current query with the specified changes
 */
export const useFetchWindRose = (): FetchWindRoseFunc => {
  const {
    product,
    release,
    query,
    monthCache,
  }: WindRoseViewerState = useStateContext();
  const dispatch: Dispatch<AnyAction> = useDispatchContext();
  return useCallback((
    changeType: string,
    queryChanges: Partial<WindRoseViewerQueryState>,
  ): void => {
    if (!exists(product)) {
      return;
    }
    // Copy the query arrays as building the request may default values into them
    const nextQuery: WindRoseViewerQueryState = {
      changeType,
      sites: [...(queryChanges.sites || query.sites)],
      months: [...(queryChanges.months || query.months)],
      positions: [...(queryChanges.positions || query.positions)],
    };
    const site = nextQuery.sites[0];
    const month = nextQuery.months[0];
    // Months of a season or year that were fetched are not fetched again
    const isCached = !!site && !!month
      && (monthCache.key === getMonthCacheKey(site, nextQuery.positions));
    const cached = isCached ? (monthCache.months[month] || null) : null;
    dispatch(ActionCreator.fetchWindRose(product as UnknownRecord, release, nextQuery, cached));
  }, [dispatch, product, release, query, monthCache]);
};

/**
 * The season or year being viewed
 */
export interface WindRoseViewerPeriodState {
  type: WindRosePeriodType;
  // Months of the period with data, sorted ascending
  months: string[];
  // Months of the period still being fetched
  pendingMonths: string[];
  // Wind roses of the period built from the months fetched so far, for each quality filter
  dataSets: Record<WindRoseQualityFilter, WindRosePeriodDataState>;
}

// No cached months, which keeps its identity between renders
const NO_CACHED_MONTHS: Record<string, WindRoseData> = {};

/**
 * Gets the season or year being viewed, when viewing the seasonal or annual aggregation
 */
export const useWindRoseViewerPeriod = (): Nullable<WindRoseViewerPeriodState> => {
  const {
    aggregation,
    query,
    monthOptions,
    monthCache,
  }: WindRoseViewerState = useStateContext();
  const type = getAggregationPeriodType(aggregation);
  const site = query.sites[0] || null;
  const month = query.months[0] || null;
  // The cache may still be of the previous site or positions, e.g. when fetching them failed
  const isCacheOfQuery = !!site && (monthCache.key === getMonthCacheKey(site, query.positions));
  const cachedMonths = isCacheOfQuery ? monthCache.months : NO_CACHED_MONTHS;
  const months = useMemo(() => ((type && month)
    ? getAvailablePeriodMonths(
      type,
      month,
      monthOptions.map((option: SelectionOption): string => option.value),
    )
    : []), [type, month, monthOptions]);
  const dataSets = useMemo(() => (
    buildPeriodDataSets(cachedMonths, months)
  ), [cachedMonths, months]);
  if (!type) {
    return null;
  }
  return {
    type,
    months,
    pendingMonths: months.filter((periodMonth: string): boolean => (
      !cachedMonths[periodMonth]
      && !(isCacheOfQuery && monthCache.failed.includes(periodMonth))
    )),
    dataSets,
  };
};

const reducer = (
  state: WindRoseViewerState,
  action: WindRoseViewerActionTypes,
): WindRoseViewerState => {
  const newState: WindRoseViewerState = { ...state };
  let wrfAction: FetchWindRoseFullfilledAction;
  let wrfData: WindRoseData;
  let wrFailedAction: FetchWindRoseFailedAction;
  let stepDayAction: StepDayAction;
  let periodMonthFulfilledAction: FetchPeriodMonthFulfilledAction;
  let periodMonthFailedAction: FetchPeriodMonthFailedAction;
  switch (action.type) {
    case ActionTypes.STORE_FINALIZED_NEON_CONTEXT_STATE:
      newState.neonContextState = (action as StoreFinalizedNeonContextStateAction).neonContextState;
      return newState;
    case ActionTypes.FETCH_PRODUCT:
      newState.isViewerLimitedMode = (action as FetchProductAction).isViewerLimited;
      return newState;
    case ActionTypes.FETCH_PRODUCT_STARTED:
      (newState.fetchState.product as FetchStatusState).status = AsyncStateType.WORKING;
      return newState;
    case ActionTypes.FETCH_PRODUCT_FAILED:
      (newState.fetchState.product as FetchStatusState).status = AsyncStateType.FAILED;
      // eslint-disable-next-line max-len, @stylistic/max-len
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
      newState.isPlaying = false;
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
      wrfData = wrfAction.response as WindRoseData;
      newState.fetchState.data = {
        ...newState.fetchState.data,
        status: AsyncStateType.FULLFILLED,
        error: null,
      };
      newState.dataStateMessage = wrfData.dataStateMessage;
      newState.siteOptions = getSiteOptions(
        newState.product,
        (newState.neonContextState?.data as any).sites,
      );
      newState.monthOptions = getMonthOptions(newState.product, wrfAction.query.sites);
      newState.positionOptions = wrfData.positionOptions;
      newState.dataSets = wrfData.dataSets;
      newState.data = wrfData.dataSets[newState.qualityFilter];
      newState.selectedDay = resolveSelectedDay(newState.selectedDay, newState.data.days);
      newState.query = {
        ...newState.query,
        sites: wrfAction.query.sites.map((value) => value),
        months: wrfAction.query.months.map((value) => value),
        positions: wrfData.positions.map((value) => value),
      };
      if (newState.query.sites[0] && newState.query.months[0]) {
        // The months of the season or year viewed are in use along with the month viewed
        newState.monthCache = touchMonths(
          cacheMonth(
            newState.monthCache,
            getMonthCacheKey(newState.query.sites[0], newState.query.positions),
            newState.query.months[0],
            wrfData,
            getMonthsInUse(newState),
          ),
          getMonthsInUse(newState),
        );
      }
      return newState;
    case ActionTypes.FETCH_WIND_ROSE_FAILED:
      wrFailedAction = action as FetchWindRoseFailedAction;
      newState.fetchState.data = {
        ...newState.fetchState.data,
        status: AsyncStateType.FAILED,
        error: wrFailedAction.error as Nullable<string | UnknownRecord>,
      };
      newState.dataStateMessage = null;
      newState.siteOptions = getSiteOptions(
        newState.product,
        (newState.neonContextState?.data as any).sites,
      );
      newState.monthOptions = getMonthOptions(
        newState.product,
        wrFailedAction.initAction.query.sites,
      );
      newState.dataSets = getEmptyDataSets();
      newState.data = newState.dataSets[newState.qualityFilter];
      newState.isPlaying = false;
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
        // The finalized NEON context (e.g. the site descriptions used in the site options)
        // does not depend on the product or release, and is only stored when it changes
        neonContextState: newState.neonContextState,
      };
    case ActionTypes.SET_AGGREGATION:
      newState.aggregation = (action as SetAggregationAction).aggregation;
      newState.isPlaying = false;
      if (newState.aggregation === WindRoseAggregation.DAILY) {
        newState.selectedDay = resolveSelectedDay(newState.selectedDay, newState.data.days);
      }
      newState.monthCache = touchMonths(newState.monthCache, getMonthsInUse(newState));
      return newState;
    case ActionTypes.SET_QUALITY_FILTER:
      newState.qualityFilter = (action as SetQualityFilterAction).qualityFilter;
      newState.data = newState.dataSets[newState.qualityFilter];
      newState.selectedDay = resolveSelectedDay(newState.selectedDay, newState.data.days);
      newState.isPlaying = newState.isPlaying && (newState.data.days.length > 1);
      return newState;
    case ActionTypes.SELECT_DAY:
      newState.aggregation = WindRoseAggregation.DAILY;
      newState.selectedDay = (action as SelectDayAction).day;
      newState.isPlaying = false;
      return newState;
    case ActionTypes.STEP_DAY:
      stepDayAction = action as StepDayAction;
      newState.aggregation = WindRoseAggregation.DAILY;
      newState.selectedDay = stepDay(
        newState.data.days,
        newState.selectedDay,
        stepDayAction.step,
        stepDayAction.wrap,
      );
      if (!stepDayAction.fromPlayback) {
        newState.isPlaying = false;
      }
      return newState;
    case ActionTypes.SET_PLAYING:
      newState.isPlaying = (action as SetPlayingAction).isPlaying
        && (newState.data.days.length > 1);
      if (newState.isPlaying) {
        newState.aggregation = WindRoseAggregation.DAILY;
        newState.selectedDay = resolveSelectedDay(newState.selectedDay, newState.data.days);
      }
      return newState;
    case ActionTypes.FETCH_PERIOD:
      newState.periodFetch = {
        key: (action as FetchPeriodAction).key,
        pending: [...(action as FetchPeriodAction).months],
      };
      return newState;
    case ActionTypes.FETCH_PERIOD_MONTH_FULFILLED:
      periodMonthFulfilledAction = action as FetchPeriodMonthFulfilledAction;
      // Months fetched for a previous site or positions are of no use
      if (periodMonthFulfilledAction.key === newState.monthCache.key) {
        newState.monthCache = cacheMonth(
          newState.monthCache,
          periodMonthFulfilledAction.key,
          periodMonthFulfilledAction.month,
          periodMonthFulfilledAction.data,
          getMonthsInUse(newState),
        );
      }
      newState.periodFetch = removePendingMonth(
        newState.periodFetch,
        periodMonthFulfilledAction.key,
        periodMonthFulfilledAction.month,
      );
      return newState;
    case ActionTypes.FETCH_PERIOD_MONTH_FAILED:
      periodMonthFailedAction = action as FetchPeriodMonthFailedAction;
      newState.monthCache = markMonthFailed(
        newState.monthCache,
        periodMonthFailedAction.key,
        periodMonthFailedAction.month,
      );
      newState.periodFetch = removePendingMonth(
        newState.periodFetch,
        periodMonthFailedAction.key,
        periodMonthFailedAction.month,
      );
      return newState;
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
const cancelPeriod$ = new Subject<void>();

/**
 * Gets the data endpoint AJAX observable to subscribe to
 * @param {*} action
 * @param {*} takeUntilOperator
 * @param {*} limited
 */
const buildFetchProductObservable = (
  action: AnyAction,
  takeUntilOperator: MonoTypeOperatorFunction<unknown>,
  limited: boolean,
): Observable<unknown> => {
  const fetchProductAction: FetchProductAction = action as FetchProductAction;
  let productObs;
  if (limited) {
    productObs = NeonGraphQL.getDemoDataProductByCode(
      fetchProductAction.productCode,
      true,
    ) as Observable<AjaxResponse<NeonApiResponse<DataProductResponse>>>;
  } else {
    productObs = NeonGraphQL.getDataProductByCode(
      fetchProductAction.productCode,
      fetchProductAction.release,
      true,
    ) as Observable<AjaxResponse<NeonApiResponse<DataProductResponse>>>;
  }
  return productObs.pipe(
    mergeMap(
      (response: AjaxResponse<NeonApiResponse<DataProductResponse>>): Observable<unknown> => {
        if (!verifyProductResponse(response)) {
          return of(ActionCreator.fetchProductFailed('Failed to fetch product'));
        }
        return of(ActionCreator.fetchProductSucceeded(response.response.data.product));
      },
    ),
    catchError((error: AjaxResponse<unknown>): ObservableInput<any> => (
      of(ActionCreator.fetchProductFailed(error))
    )),
    takeUntilOperator,
  );
};

/**
 * Builds the files AJAX observable to obtain the wind rose data of a month from the data files
 * listed by the data endpoint
 * @param response The data endpoint response
 * @param query The query of the month, whose positions select the data files
 * @param takeUntilOperator
 * @param includeVariables Whether to also fetch the variables file
 */
const buildWindRoseDataObservable = (
  response: any,
  query: WindRoseViewerQueryState,
  takeUntilOperator: MonoTypeOperatorFunction<unknown>,
  includeVariables = true,
): Observable<WindRoseData> => {
  const dataFilesInfo = parseWindRoseDataFiles(response.response.data, query);
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
      url: dataFileUrl,
      responseType: 'text',
      headers: {
        'User-Agent': getUserAgentHeader('Wind Rose Viewer'),
      },
    })
  ));
  ajaxObservables.push(
    forkJoin(dataFilesAjax).pipe(
      map((responses) => responses),
      catchError(() => of([])),
    ),
  );
  if (includeVariables && dataFilesInfo.variablesFileUrl) {
    ajaxObservables.push(
      ajax({
        method: 'GET',
        url: dataFilesInfo.variablesFileUrl,
        responseType: 'text',
        headers: {
          'User-Agent': getUserAgentHeader('Wind Rose Viewer'),
        },
      }),
    );
  }
  return forkJoin(ajaxObservables).pipe(
    map((responses): WindRoseData => {
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
      return buildWindRoseData(dataFilesResponseData, dataFilesInfo);
    }),
    takeUntilOperator,
  ) as Observable<WindRoseData>;
};

/**
 * Gets the data endpoint AJAX observable to subscribe to
 * @param {*} action
 * @param {*} takeUntilOperator
 * @param {*} sessionHeaders
 */
const buildDataApiObservable = (
  action: AnyAction,
  takeUntilOperator: MonoTypeOperatorFunction<unknown>,
  limited: boolean,
  sessionHeaders: Record<string, string>,
): Observable<unknown> => {
  // Viewing release data requires authentication, the demo data endpoint is never queried
  if (isReleaseLoginRequired(limited, (action as FetchWindRoseAction).release)) {
    return of(ActionCreator.fetchWindRoseFailed(
      LOGIN_REQUIRED_MESSAGE,
      null,
      (action as FetchWindRoseAction),
    ));
  }
  // Get query params to send with request
  const queryParams = getApiDataQueryParams(action);
  const url = getDataApiRequest(
    queryParams.productCode,
    queryParams.release,
    queryParams.site,
    queryParams.month,
    limited,
  );
  // XHR for API data endpoint to retrieve available files
  const headers = {
    ...sessionHeaders,
  };
  return (NeonApi.getJsonAjaxObservable(url, headers) as Observable<AjaxResponse<unknown>>).pipe(
    mergeMap((response: AjaxResponse<unknown>): Observable<WindRoseData> => (
      buildWindRoseDataObservable(
        response,
        (action as FetchWindRoseAction).query,
        takeUntilOperator,
      )
    )),
    // Return the fullfilled action to be dispatched
    map((windRoseData: WindRoseData) => ActionCreator.fetchWindRoseFullfilled(
      windRoseData,
      (action as FetchWindRoseAction).query,
    )),
    catchError((error: Record<string, unknown>): ObservableInput<any> => {
      const response = error && error.xhr ? (error.xhr as XMLHttpRequest).response : null;
      return of(ActionCreator.fetchWindRoseFailed(
        error,
        response,
        (action as FetchWindRoseAction),
      ));
    }),
    takeUntilOperator,
  );
};

// Most months of a season or year fetched at once
const PERIOD_FETCH_CONCURRENCY = 3;

/**
 * Gets the observable fetching a month of a season or year for the positions of the month viewed
 * @param action The fetch period action
 * @param month The month (YYYY-MM)
 * @param takeUntilOperator
 * @param limited
 * @param sessionHeaders
 */
const buildPeriodMonthObservable = (
  action: FetchPeriodAction,
  month: string,
  takeUntilOperator: MonoTypeOperatorFunction<unknown>,
  limited: boolean,
  sessionHeaders: Record<string, string>,
): Observable<unknown> => {
  // Selecting the data files may default the positions, so each month gets its own query
  const query: WindRoseViewerQueryState = {
    changeType: null,
    sites: [action.site],
    months: [month],
    positions: action.positions.map((position: WindRosePosition) => ({ ...position })),
  };
  const url = getDataApiRequest(action.productCode, action.release, action.site, month, limited);
  return (NeonApi.getJsonAjaxObservable(url, { ...sessionHeaders }) as Observable<
    AjaxResponse<unknown>
  >).pipe(
    mergeMap((response: AjaxResponse<unknown>): Observable<WindRoseData> => (
      buildWindRoseDataObservable(response, query, takeUntilOperator, false)
    )),
    map((windRoseData: WindRoseData) => (
      ActionCreator.fetchPeriodMonthFulfilled(action.key, month, windRoseData)
    )),
    catchError((error: unknown): ObservableInput<any> => (
      of(ActionCreator.fetchPeriodMonthFailed(action.key, month, error))
    )),
    takeUntilOperator,
  );
};

type LimitedEpicCreator = (limited: boolean) => Epic;
type SessionHeadersEpicCreator = (limited: boolean, sessionHeaders: Record<string, string>) => Epic;

/**
 * Epic for fetching wind rose data
 * @param {*} limited Viewer limited setting
 */
const createFetchProductEpic: LimitedEpicCreator = (
  limited: boolean,
): Epic => (
  (action$: Observable<AnyAction>): Observable<unknown> => ((
    action$.pipe(
      filter((action: AnyAction) => action.type === ActionTypes.FETCH_PRODUCT),
      switchMap((action: AnyAction) => concat(
        of(ActionCreator.fetchProductStarted()),
        buildFetchProductObservable(action, takeUntil(cancelProduct$), limited),
      )),
    )
  ))
);

/**
 * Epic for fetching wind rose data
 * @param {*} sessionHeaders Action stream
 */
const createFetchWindRoseDataEpic: SessionHeadersEpicCreator = (
  limited: boolean,
  sessionHeaders: Record<string, string>,
): Epic => (
  (action$: Observable<AnyAction>): Observable<unknown> => ((
    action$.pipe(
      filter((action: AnyAction) => action.type === ActionTypes.FETCH_WIND_ROSE),
      switchMap((action: AnyAction) => {
        const { cached, query } = action as FetchWindRoseAction;
        if (cached) {
          return of(
            ActionCreator.fetchWindRoseWorking(),
            ActionCreator.fetchWindRoseFullfilled(cached, query),
          );
        }
        return concat(
          of(ActionCreator.fetchWindRoseWorking()),
          buildDataApiObservable(action, takeUntil(cancelWindRose$), limited, sessionHeaders),
        );
      }),
    )
  ))
);

/**
 * Epic for fetching the months of a season or year
 * @param {*} limited Viewer limited setting
 * @param {*} sessionHeaders Session headers to fetch with
 */
const createFetchPeriodEpic: SessionHeadersEpicCreator = (
  limited: boolean,
  sessionHeaders: Record<string, string>,
): Epic => (
  (action$: Observable<AnyAction>): Observable<unknown> => ((
    action$.pipe(
      filter((action: AnyAction) => action.type === ActionTypes.FETCH_PERIOD),
      switchMap((action: AnyAction) => {
        const fetchPeriodAction = action as FetchPeriodAction;
        // Viewing release data requires authentication, the demo data endpoint is never queried
        if (isReleaseLoginRequired(limited, fetchPeriodAction.release)) {
          return of(...fetchPeriodAction.months.map((month: string) => (
            ActionCreator.fetchPeriodMonthFailed(
              fetchPeriodAction.key,
              month,
              LOGIN_REQUIRED_MESSAGE,
            )
          )));
        }
        return from(fetchPeriodAction.months).pipe(
          mergeMap((month: string) => buildPeriodMonthObservable(
            fetchPeriodAction,
            month,
            takeUntil(cancelPeriod$),
            limited,
            sessionHeaders,
          ), PERIOD_FETCH_CONCURRENCY),
        );
      }),
    )
  ))
);

interface ProviderProps {
  productCode: Nullable<string>;
  release: Undef<string>;
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
  const neonAuthContextSessionState = NeonAuthContext.useNeonAuthContextSessionState();
  const { sessionHeaders } = neonAuthContextSessionState;
  const {
    isFinal: neonContextIsFinal,
    hasError: neonContextHasError,
  } = neonContextState;
  // Check preconditions for initial status
  const preconditionsSatisfied = neonAuthContextSessionState.ready;
  const isViewerLimited = !neonAuthContextSessionState.canAccessData;
  const initialState = {
    ...getDefaultState(),
    productCode: propsProductCode,
    release: propsRelease,
  };
  if (neonContextIsFinal || neonContextHasError) {
    initialState.neonContextState = { ...neonContextState };
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    productCode,
    release,
    product,
    fetchState: {
      product: productFetchState,
      data: dataFetchState,
    },
    query,
    aggregation,
    monthOptions,
    monthCache,
    periodFetch,
    isViewerLimitedMode,
  } = state;
  // Dispatch function enhanced to handle both reducer and action streams
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
        cancelPeriod$.next();
        break;
      default:
        break;
    }
  }, []);
  const sessionHeadersStringified: string = JSON.stringify(sessionHeaders);
  useEffect(() => {
    if (!preconditionsSatisfied) { return () => {}; }
    const appliedSessionHeaders = JSON.parse(sessionHeadersStringified);
    const subscriptions: Subscription[] = [
      createFetchProductEpic(isViewerLimited)(actionStream$)
        .subscribe(enhancedDispatch as EpicSubscribeFunc),
      createFetchWindRoseDataEpic(isViewerLimited, appliedSessionHeaders)(actionStream$)
        .subscribe(enhancedDispatch as EpicSubscribeFunc),
      createFetchPeriodEpic(isViewerLimited, appliedSessionHeaders)(actionStream$)
        .subscribe(enhancedDispatch as EpicSubscribeFunc),
    ];
    // Cleanup subscription when component unmounts
    return () => {
      subscriptions.forEach((s: Subscription): void => s.unsubscribe());
      // Ensure any ongoing operations are canceled
      cancelProduct$.next();
      cancelWindRose$.next();
      cancelPeriod$.next();
    };
  }, [
    enhancedDispatch,
    preconditionsSatisfied,
    isViewerLimited,
    sessionHeadersStringified,
  ]);
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
    if (!preconditionsSatisfied) { return; }
    if (exists(product)) { return; }
    if ((productFetchState as FetchStatusState).status !== AsyncStateType.IDLE) {
      return;
    }
    // Viewing release data requires authentication, so nothing is fetched until signed in
    if (isReleaseLoginRequired(isViewerLimited, propsRelease)) { return; }
    const queryProductCode: string = propsProductCode as string;
    enhancedDispatch(ActionCreator.fetchProduct(queryProductCode, propsRelease, isViewerLimited));
  }, [
    enhancedDispatch,
    neonContextIsFinal,
    productFetchState,
    propsProductCode,
    propsRelease,
    product,
    productStringified,
    preconditionsSatisfied,
    isViewerLimited,
  ]);
  useEffect(() => {
    if (!neonContextIsFinal) { return; }
    if (!preconditionsSatisfied) { return; }
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
    preconditionsSatisfied,
  ]);
  // Months of the season or year being viewed that have not been fetched
  const periodType = getAggregationPeriodType(aggregation);
  const periodMonth = query.months[0] || null;
  const missingPeriodMonths = useMemo(() => {
    if (!periodType || !periodMonth) {
      return [];
    }
    return getAvailablePeriodMonths(
      periodType,
      periodMonth,
      monthOptions.map((option: SelectionOption): string => option.value),
    ).filter((month: string): boolean => (
      !monthCache.months[month] && !monthCache.failed.includes(month)
    ));
  }, [periodType, periodMonth, monthOptions, monthCache]);
  useEffect(() => {
    if (!neonContextIsFinal) { return; }
    if (!preconditionsSatisfied) { return; }
    if (!exists(product) || (missingPeriodMonths.length <= 0)) { return; }
    // The month viewed is fetched first, which settles the positions the other months are fetched
    // for, and so the key they are cached by
    const site = query.sites[0];
    if (!site || !monthCache.key
        || ((dataFetchState as Nullable<FetchStatusState>)?.status !== AsyncStateType.FULLFILLED)
        || (monthCache.key !== getMonthCacheKey(site, query.positions))) {
      return;
    }
    const isFetching = (periodFetch.key === monthCache.key)
      && missingPeriodMonths.every((month: string): boolean => periodFetch.pending.includes(month));
    if (isFetching) { return; }
    enhancedDispatch(ActionCreator.fetchPeriod(
      (product as UnknownRecord).productCode as string,
      release,
      site,
      query.positions,
      monthCache.key,
      missingPeriodMonths,
    ));
  }, [
    enhancedDispatch,
    neonContextIsFinal,
    preconditionsSatisfied,
    product,
    release,
    query,
    dataFetchState,
    monthCache.key,
    missingPeriodMonths,
    periodFetch,
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
  // Refetch for the new limited mode when it changes after fetching
  useEffect(() => {
    if (!neonContextIsFinal) { return; }
    if (!preconditionsSatisfied) { return; }
    if (!exists(isViewerLimitedMode) || (isViewerLimitedMode === isViewerLimited)) { return; }
    enhancedDispatch(ActionCreator.reinitialize(productCode as string, release));
  }, [
    enhancedDispatch,
    neonContextIsFinal,
    preconditionsSatisfied,
    isViewerLimited,
    isViewerLimitedMode,
    productCode,
    release,
  ]);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={enhancedDispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

/**
 * Exposes internals for unit testing
 */
export const getTestableItems = () => ({
  getDefaultState,
  reducer,
});

export default Provider;
