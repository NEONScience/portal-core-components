"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useStateContext = exports.useDispatchContext = exports.default = exports.ActionTypes = exports.ActionCreator = void 0;
var _react = _interopRequireWildcard(require("react"));
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var _ajax = require("rxjs/ajax");
var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));
var _papaparse = require("papaparse");
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _NeonGraphQL = _interopRequireDefault(require("../NeonGraphQL/NeonGraphQL"));
var _windRoseUtil = require("./windRoseUtil");
var _asyncFlow = require("../../types/asyncFlow");
var _dataUtil = require("./dataUtil");
var _defaultProps = require("../../util/defaultProps");
var _typeUtil = require("../../util/typeUtil");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const DEFAULT_STATE = {
  productCode: null,
  release: undefined,
  product: null,
  fetchState: {
    product: {
      status: _asyncFlow.AsyncStateType.IDLE,
      error: null
    },
    data: null
  },
  dataStateMessage: null,
  siteOptions: [],
  monthOptions: [],
  positionOptions: [],
  query: {
    changeType: null,
    sites: [],
    months: [],
    positions: []
  },
  data: {
    dailyBins: {},
    current: null
  },
  neonContextState: (0, _cloneDeep.default)(_NeonContext.default.DEFAULT_STATE)
};
const getDefaultState = () => (0, _cloneDeep.default)(DEFAULT_STATE);
const getDefaultFetchProducState = () => (0, _cloneDeep.default)(DEFAULT_STATE.fetchState.product);
const StateContext = /*#__PURE__*/(0, _react.createContext)(getDefaultState());
const DispatchContext = /*#__PURE__*/(0, _react.createContext)(undefined);
const useStateContext = () => (0, _react.useContext)(StateContext);
exports.useStateContext = useStateContext;
const useDispatchContext = () => {
  const dispatchContext = (0, _react.useContext)(DispatchContext);
  if (!dispatchContext) {
    throw new Error('Failed to initialize dispatch context');
  }
  return dispatchContext;
};
exports.useDispatchContext = useDispatchContext;
const buildProductQuery = (productCode, release) => {
  const hasRelease = (0, _typeUtil.isStringNonEmpty)(release);
  const releaseArgument = !hasRelease ? '' : `, release: "${release}"`;
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
const verifyProductResponse = response => (0, _typeUtil.exists)(response) && (0, _typeUtil.exists)(response.response) && (0, _typeUtil.exists)(response.response.data) && (0, _typeUtil.exists)(response.response.data.product);
let ActionTypes = exports.ActionTypes = /*#__PURE__*/function (ActionTypes) {
  ActionTypes["STORE_FINALIZED_NEON_CONTEXT_STATE"] = "STORE_FINALIZED_NEON_CONTEXT_STATE";
  ActionTypes["FETCH_PRODUCT"] = "FETCH_PRODUCT";
  ActionTypes["FETCH_PRODUCT_STARTED"] = "FETCH_PRODUCT_STARTED";
  ActionTypes["FETCH_PRODUCT_FAILED"] = "FETCH_PRODUCT_FAILED";
  ActionTypes["FETCH_PRODUCT_SUCCEEDED"] = "FETCH_PRODUCT_SUCCEEDED";
  ActionTypes["RESET_FETCH_PRODUCT"] = "RESET_FETCH_PRODUCT";
  ActionTypes["FETCH_WIND_ROSE"] = "FETCH_WIND_ROSE";
  ActionTypes["FETCH_WIND_ROSE_WORKING"] = "FETCH_WIND_ROSE_WORKING";
  ActionTypes["FETCH_WIND_ROSE_FULLFILLED"] = "FETCH_WIND_ROSE_FULLFILLED";
  ActionTypes["FETCH_WIND_ROSE_FAILED"] = "FETCH_WIND_ROSE_FAILED";
  ActionTypes["RESET_WIND_ROSE"] = "RESET_WIND_ROSE";
  ActionTypes["REINITIALIZE"] = "REINITIALIZE";
  return ActionTypes;
}({});
const ActionCreator = exports.ActionCreator = {
  storeFinalizedNeonContextState: neonContextState => ({
    type: ActionTypes.STORE_FINALIZED_NEON_CONTEXT_STATE,
    neonContextState
  }),
  fetchProduct: (productCode, release) => ({
    type: ActionTypes.FETCH_PRODUCT,
    productCode,
    release
  }),
  fetchProductStarted: () => ({
    type: ActionTypes.FETCH_PRODUCT_STARTED
  }),
  fetchProductFailed: error => ({
    type: ActionTypes.FETCH_PRODUCT_FAILED,
    error
  }),
  fetchProductSucceeded: data => ({
    type: ActionTypes.FETCH_PRODUCT_SUCCEEDED,
    data
  }),
  resetFetchProduct: () => ({
    type: ActionTypes.RESET_FETCH_PRODUCT
  }),
  fetchWindRose: (product, release, query) => ({
    type: ActionTypes.FETCH_WIND_ROSE,
    product,
    release,
    query
  }),
  fetchWindRoseWorking: () => ({
    type: ActionTypes.FETCH_WIND_ROSE_WORKING
  }),
  fetchWindRoseFullfilled: (response, query) => ({
    type: ActionTypes.FETCH_WIND_ROSE_FULLFILLED,
    response,
    query
  }),
  fetchWindRoseFailed: (error, response, initAction) => ({
    type: ActionTypes.FETCH_WIND_ROSE_FAILED,
    error,
    response,
    initAction
  }),
  resetWindRose: () => ({
    type: ActionTypes.RESET_WIND_ROSE
  }),
  reinitialize: (productCode, release) => ({
    type: ActionTypes.REINITIALIZE,
    productCode,
    release
  })
};
const reducer = (state, action) => {
  console.log(action);
  const newState = {
    ...state
  };
  let wrfAction;
  let wrFailedAction;
  switch (action.type) {
    case ActionTypes.STORE_FINALIZED_NEON_CONTEXT_STATE:
      newState.neonContextState = action.neonContextState;
      return newState;
    case ActionTypes.FETCH_PRODUCT:
      return newState;
    case ActionTypes.FETCH_PRODUCT_STARTED:
      newState.fetchState.product.status = _asyncFlow.AsyncStateType.WORKING;
      return newState;
    case ActionTypes.FETCH_PRODUCT_FAILED:
      newState.fetchState.product.status = _asyncFlow.AsyncStateType.FAILED;
      newState.fetchState.product.error = action.error;
      return newState;
    case ActionTypes.FETCH_PRODUCT_SUCCEEDED:
      newState.fetchState.product.status = _asyncFlow.AsyncStateType.FULLFILLED;
      newState.product = action.data;
      return newState;
    case ActionTypes.RESET_FETCH_PRODUCT:
      return {
        ...newState,
        product: null,
        fetchState: {
          ...newState.fetchState,
          product: getDefaultFetchProducState()
        }
      };
    case ActionTypes.FETCH_WIND_ROSE:
      return newState;
    case ActionTypes.FETCH_WIND_ROSE_WORKING:
      newState.fetchState.data = {
        ...newState.fetchState.data,
        status: _asyncFlow.AsyncStateType.WORKING,
        error: null
      };
      return newState;
    case ActionTypes.FETCH_WIND_ROSE_FULLFILLED:
      wrfAction = action;
      newState.fetchState.data = {
        ...newState.fetchState.data,
        status: _asyncFlow.AsyncStateType.FULLFILLED,
        error: null
      };
      newState.dataStateMessage = wrfAction.response.dataStateMessage;
      newState.siteOptions = (0, _dataUtil.getSiteOptions)(newState.product, (newState.neonContextState?.data).sites);
      newState.monthOptions = (0, _dataUtil.getMonthOptions)(newState.product, wrfAction.query.sites);
      newState.positionOptions = wrfAction.response.positionOptions;
      newState.data = {
        ...newState.data,
        dailyBins: wrfAction.response.windRoseDailyBins,
        current: wrfAction.response.currentWindRose
      };
      newState.query = {
        ...newState.query,
        sites: wrfAction.query.sites.map(value => value),
        months: wrfAction.query.months.map(value => value),
        positions: wrfAction.response.positions.map(value => value)
      };
      return newState;
    case ActionTypes.FETCH_WIND_ROSE_FAILED:
      wrFailedAction = action;
      newState.fetchState.data = {
        ...newState.fetchState.data,
        status: _asyncFlow.AsyncStateType.FAILED,
        error: wrFailedAction.error
      };
      newState.dataStateMessage = null;
      newState.siteOptions = (0, _dataUtil.getSiteOptions)(newState.product, (newState.neonContextState?.data).sites);
      newState.monthOptions = (0, _dataUtil.getMonthOptions)(newState.product, wrFailedAction.initAction.query.sites);
      newState.data = {
        ...newState.data,
        dailyBins: {},
        current: null
      };
      newState.query = {
        ...newState.query,
        ...wrFailedAction.initAction.query
      };
      return newState;
    case ActionTypes.RESET_WIND_ROSE:
      return getDefaultState();
    case ActionTypes.REINITIALIZE:
      return {
        ...getDefaultState(),
        productCode: action.productCode,
        release: action.release
      };
    default:
      break;
  }
  return newState;
};
// Subject for action side effects / middleware event stream
const actionStream$ = new _rxjs.Subject();
// Cancellation subjects
const cancelProduct$ = new _rxjs.Subject();
const cancelWindRose$ = new _rxjs.Subject();

/**
 * Gets the data endpoint AJAX observable to subscribe to
 * @param {*} action
 * @param {*} takeUntilOperator
 */
const buildFetchProductObservable = (action, takeUntilOperator) => {
  const fetchProductAction = action;
  const productObs = _NeonGraphQL.default.getGraphqlQuery(buildProductQuery(fetchProductAction.productCode, fetchProductAction.release));
  return productObs.pipe((0, _operators.mergeMap)(response => {
    if (!verifyProductResponse(response)) {
      return (0, _rxjs.of)(ActionCreator.fetchProductFailed('Failed to fetch product'));
    }
    return (0, _rxjs.of)(ActionCreator.fetchProductSucceeded(response.response.data.product));
  }), (0, _operators.catchError)(error => (0, _rxjs.of)(ActionCreator.fetchProductFailed(error))), takeUntilOperator);
};

/**
 * Builds the files AJAX observable to obtain wind rose raw data
 * and variables
 * @param {*} action
 * @param {*} response
 * @param {*} takeUntilOperator
 */
const buildFilesAjaxObservable = (action, response, takeUntilOperator) => {
  const dataFilesInfo = (0, _windRoseUtil.parseWindRoseDataFiles)(response.response.data, action.query);
  if (!dataFilesInfo || dataFilesInfo.dataFileUrls === null || dataFilesInfo.dataFileUrls.length <= 0) {
    throw new Error('API data endpoint failed');
  }
  // Build parallel XHR requests for data and variables
  const ajaxObservables = [];
  const dataFilesAjax = dataFilesInfo.dataFileUrls.map(dataFileUrl => (0, _ajax.ajax)({
    method: 'GET',
    crossDomain: true,
    url: dataFileUrl,
    responseType: 'text'
  }));
  ajaxObservables.push((0, _rxjs.forkJoin)(dataFilesAjax).pipe((0, _operators.map)(responses => responses), (0, _operators.catchError)(() => (0, _rxjs.of)([]))));
  if (dataFilesInfo.variablesFileUrl) {
    ajaxObservables.push((0, _ajax.ajax)({
      method: 'GET',
      crossDomain: true,
      url: dataFilesInfo.variablesFileUrl,
      responseType: 'text'
    }));
  }
  return (0, _rxjs.forkJoin)(ajaxObservables).pipe((0, _operators.mergeMap)(responses => {
    // Parse each data file response
    let dataFilesResponseData = [];
    const dataResponses = responses[0];
    if (dataResponses !== null && dataResponses.length > 0) {
      dataFilesResponseData = dataResponses.map(dataResponse => {
        const csvData = dataResponse.response;
        return (0, _papaparse.parse)(csvData, {
          header: true,
          skipEmptyLines: 'greedy'
        });
      });
    }
    // Build wind rose data, return the fullfilled action to be dispatched
    const windRoseData = (0, _windRoseUtil.buildWindRoseData)(dataFilesResponseData, dataFilesInfo);
    return (0, _rxjs.of)(ActionCreator.fetchWindRoseFullfilled(windRoseData, action.query));
  }), (0, _operators.catchError)(error => {
    const message = error.xhr ? error.xhr.response : null;
    return (0, _rxjs.of)(ActionCreator.fetchWindRoseFailed(error, message, action));
  }), takeUntilOperator);
};

/**
 * Gets the data endpoint AJAX observable to subscribe to
 * @param {*} action
 * @param {*} takeUntilOperator
 */
const buildDataApiObservable = (action, takeUntilOperator) => {
  // Get query params to send with request
  const queryParams = (0, _dataUtil.getApiDataQueryParams)(action);
  // XHR for API data endpoint to retrieve available files
  return (0, _ajax.ajax)({
    method: 'GET',
    crossDomain: true,
    responseType: 'json',
    url: (0, _dataUtil.getDataApiRequest)(queryParams.productCode, queryParams.release, queryParams.site, queryParams.month)
  }).pipe((0, _operators.mergeMap)(response => buildFilesAjaxObservable(action, response, takeUntilOperator)), (0, _operators.catchError)(error => {
    const response = error && error.xhr ? error.xhr.response : null;
    return (0, _rxjs.of)(ActionCreator.fetchWindRoseFailed(error, response, action));
  }), takeUntilOperator);
};

/**
 * Epic for fetching wind rose data
 * @param {*} action$ Action stream
 */
const fetchProductEpic = action$ => action$.pipe((0, _operators.filter)(action => action.type === ActionTypes.FETCH_PRODUCT), (0, _operators.switchMap)(action => (0, _rxjs.concat)((0, _rxjs.of)(ActionCreator.fetchProductStarted()), buildFetchProductObservable(action, (0, _operators.takeUntil)(cancelProduct$)))));

/**
 * Epic for fetching wind rose data
 * @param {*} action$ Action stream
 */
const fetchWindRoseDataEpic = action$ => action$.pipe((0, _operators.filter)(action => action.type === ActionTypes.FETCH_WIND_ROSE), (0, _operators.switchMap)(action => (0, _rxjs.concat)((0, _rxjs.of)(ActionCreator.fetchWindRoseWorking()), buildDataApiObservable(action, (0, _operators.takeUntil)(cancelWindRose$)))));
const providerDefaultProps = {
  productCode: null,
  release: undefined,
  children: undefined
};
const Provider = inProps => {
  const props = (0, _defaultProps.resolveProps)(providerDefaultProps, inProps);
  const {
    productCode: propsProductCode,
    release: propsRelease,
    children
  } = props;
  const [neonContextState] = _NeonContext.default.useNeonContextState();
  const {
    isFinal: neonContextIsFinal,
    hasError: neonContextHasError
  } = neonContextState;
  const initialState = {
    ...getDefaultState(),
    productCode: propsProductCode,
    release: propsRelease
  };
  if (neonContextIsFinal || neonContextHasError) {
    initialState.neonContextState = {
      ...neonContextState
    };
  }
  const [state, dispatch] = (0, _react.useReducer)(reducer, initialState);
  console.log(JSON.parse(JSON.stringify(state)));
  const {
    productCode,
    release,
    product,
    fetchState: {
      product: productFetchState,
      data: dataFetchState
    },
    query
  } = state;
  // Dispatch function enhanced to handle both reducer and action streams
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const enhancedDispatch = (0, _react.useMemo)(() => action => {
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
  (0, _react.useEffect)(() => {
    const subscriptions = [fetchProductEpic(actionStream$).subscribe(enhancedDispatch), fetchWindRoseDataEpic(actionStream$).subscribe(enhancedDispatch)];
    // Cleanup subscription when component unmounts
    return () => {
      subscriptions.forEach(s => s.unsubscribe());
      // Ensure any ongoing operations are canceled
      cancelProduct$.next();
      cancelWindRose$.next();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  (0, _react.useEffect)(() => {
    if (neonContextIsFinal || neonContextHasError) {
      enhancedDispatch(ActionCreator.storeFinalizedNeonContextState(neonContextState));
    }
  }, [enhancedDispatch, neonContextState, neonContextIsFinal, neonContextHasError]);
  const productStringified = JSON.stringify(product);
  (0, _react.useEffect)(() => {
    if (!neonContextIsFinal) {
      return;
    }
    if ((0, _typeUtil.exists)(product)) {
      return;
    }
    if (productFetchState.status !== _asyncFlow.AsyncStateType.IDLE) {
      return;
    }
    const queryProductCode = propsProductCode;
    enhancedDispatch(ActionCreator.fetchProduct(queryProductCode, propsRelease));
  }, [enhancedDispatch, neonContextIsFinal, productFetchState, propsProductCode, propsRelease, product, productStringified]);
  (0, _react.useEffect)(() => {
    if (!neonContextIsFinal) {
      return;
    }
    if (!(0, _typeUtil.exists)(product)) {
      return;
    }
    if (!(0, _typeUtil.exists)(dataFetchState) || dataFetchState.status === _asyncFlow.AsyncStateType.IDLE) {
      enhancedDispatch(ActionCreator.fetchWindRose(product, release, query));
    }
  }, [enhancedDispatch, neonContextIsFinal, product, productStringified, release, query, dataFetchState]);
  (0, _react.useEffect)(() => {
    if (!neonContextIsFinal) {
      return;
    }
    const productChanged = productCode !== propsProductCode;
    const releaseChanged = release !== propsRelease;
    if (productChanged || releaseChanged) {
      enhancedDispatch(ActionCreator.reinitialize(propsProductCode, propsRelease));
    }
  }, [enhancedDispatch, neonContextIsFinal, productCode, release, propsProductCode, propsRelease]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(StateContext.Provider, {
    value: state,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(DispatchContext.Provider, {
      value: enhancedDispatch,
      children: children
    })
  });
};
var _default = exports.default = Provider;