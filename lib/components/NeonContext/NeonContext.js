"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTestableItems = exports.default = exports.FETCH_STATUS = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));
var _rxjs = require("rxjs");
var _ajax = require("rxjs/ajax");
var _remoteAssetsMap = _interopRequireDefault(require("../../remoteAssetsMap/remoteAssetsMap"));
var _AuthService = _interopRequireDefault(require("../NeonAuth/AuthService"));
var _NeonApi = _interopRequireDefault(require("../NeonApi/NeonApi"));
var _NeonGraphQL = _interopRequireDefault(require("../NeonGraphQL/NeonGraphQL"));
var _sites = _interopRequireDefault(require("../../staticJSON/sites.json"));
var _states = _interopRequireDefault(require("../../staticJSON/states.json"));
var _domains = _interopRequireDefault(require("../../staticJSON/domains.json"));
var _timeSeriesDataProducts = _interopRequireDefault(require("../../staticJSON/timeSeriesDataProducts.json"));
var _BundleParser = _interopRequireDefault(require("../../parser/BundleParser"));
var _typeUtil = require("../../util/typeUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const DRUPAL_HEADER_HTML = _remoteAssetsMap.default.DRUPAL_HEADER_HTML.KEY;
const DRUPAL_FOOTER_HTML = _remoteAssetsMap.default.DRUPAL_FOOTER_HTML.KEY;
const FETCH_STATUS = exports.FETCH_STATUS = {
  AWAITING_CALL: 'AWAITING_CALL',
  FETCHING: 'FETCHING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS'
};
const DEFAULT_STATE = {
  data: {
    sites: {},
    // See for details: interface BundleContext
    bundles: {
      bundleProducts: {},
      bundleProductsForwardAvailability: {},
      bundleDoiLookup: {},
      splitProducts: {},
      allBundleProducts: {},
      apiResponse: []
    },
    states: _states.default,
    domains: _domains.default,
    timeSeriesDataProducts: _timeSeriesDataProducts.default,
    stateSites: {},
    // derived when sites is fetched
    domainSites: {} // derived when sites is fetched
  },
  html: {
    [DRUPAL_HEADER_HTML]: null,
    [DRUPAL_FOOTER_HTML]: null
  },
  fetches: {
    sites: {
      status: FETCH_STATUS.AWAITING_CALL,
      error: null
    },
    bundles: {
      status: FETCH_STATUS.AWAITING_CALL,
      error: null
    },
    auth: {
      status: null,
      error: null
    },
    [DRUPAL_HEADER_HTML]: {
      status: null,
      error: null
    },
    [DRUPAL_FOOTER_HTML]: {
      status: null,
      error: null
    }
  },
  auth: {
    useCore: false,
    isAuthenticated: false,
    isAuthWorking: false,
    isAuthWsConnected: false,
    userData: null
  },
  isActive: false,
  isFinal: false,
  hasError: false,
  whenFinalCalled: false
};

// Derive values for stateSites and domainSites in state. This is a one-time mapping we
// generate when sites are loaded into state containing lists of site codes for each
// state code / domain code.
const deriveRegionSites = state => {
  const stateSites = {};
  const domainSites = {};
  Object.keys(state.data.sites).forEach(siteCode => {
    const {
      stateCode,
      domainCode
    } = state.data.sites[siteCode];
    if (!stateSites[stateCode]) {
      stateSites[stateCode] = new Set();
    }
    if (!domainSites[domainCode]) {
      domainSites[domainCode] = new Set();
    }
    stateSites[stateCode].add(siteCode);
    domainSites[domainCode].add(siteCode);
  });
  // Fill in empty sets for any states that had no NEON sites
  Object.keys(state.data.states).filter(stateCode => !stateSites[stateCode]).forEach(stateCode => {
    stateSites[stateCode] = new Set();
  });
  return _extends({}, state, {
    data: _extends({}, state.data, {
      stateSites,
      domainSites
    })
  });
};

/**
   CONTEXT
*/
const Context = /*#__PURE__*/(0, _react.createContext)(DEFAULT_STATE);

/**
   HOOK
*/
const useNeonContextState = () => {
  const hookResponse = (0, _react.useContext)(Context);
  // If called by a component that's not inside a NeonContext the hookResponse will be
  // DEFAULT_STATE. Otherwise it will return an array of length one containing the current state.
  // Thus we double-check here that we got an active state before returning it.
  if (!Array.isArray(hookResponse) || !hookResponse[0].isActive) {
    return [_extends({}, DEFAULT_STATE), () => {}];
  }
  return hookResponse;
};
const determineContextFetchFinal = state => {
  const authFinal = !state.auth.useCore || state.fetches.auth.status === FETCH_STATUS.SUCCESS || state.fetches.auth.status === FETCH_STATUS.ERROR;
  const sitesFinal = state.fetches.sites.status === FETCH_STATUS.SUCCESS || state.fetches.sites.status === FETCH_STATUS.ERROR;
  const bundlesFinal = state.fetches.bundles.status === FETCH_STATUS.SUCCESS || state.fetches.bundles.status === FETCH_STATUS.ERROR;
  return authFinal && sitesFinal && bundlesFinal;
};

/**
   Reducer
*/
const reducer = (state, action) => {
  // Always deep clone fetches as that's the main thing we care about
  // changing to trigger re-renders in the consumer.
  const newState = _extends({}, state, {
    fetches: (0, _cloneDeep.default)(state.fetches)
  });
  const hasValidRemoteAsset = action.asset && Object.keys(_remoteAssetsMap.default).includes(action.asset);
  switch (action.type) {
    case 'fetchCalled':
      if (!action.key || !state.fetches[action.key]) {
        return state;
      }
      newState.fetches[action.key].status = FETCH_STATUS.FETCHING;
      return newState;

    // Actions for handling sites fetch
    case 'fetchSitesSucceeded':
      newState.fetches.sites.status = FETCH_STATUS.SUCCESS;
      newState.data.sites = action.sites;
      newState.isFinal = determineContextFetchFinal(newState);
      return deriveRegionSites(newState);
    case 'fetchSitesFailed':
      newState.fetches.sites.status = FETCH_STATUS.ERROR;
      newState.fetches.sites.error = action.error;
      newState.isFinal = determineContextFetchFinal(newState);
      newState.hasError = true;
      return newState;

    // Actions for handling bundles fetch
    case 'fetchBundlesSucceeded':
      newState.fetches.bundles.status = FETCH_STATUS.SUCCESS;
      newState.data.bundles = action.bundles;
      newState.isFinal = determineContextFetchFinal(newState);
      return deriveRegionSites(newState);
    case 'fetchBundlesFailed':
      newState.fetches.bundles.status = FETCH_STATUS.ERROR;
      newState.fetches.bundles.error = action.error;
      newState.isFinal = determineContextFetchFinal(newState);
      newState.hasError = true;
      return newState;

    // Actions for handling auth fetch
    case 'setAuthenticated':
      newState.auth.isAuthenticated = !!action.isAuthenticated;
      return newState;
    case 'setAuthWorking':
      newState.auth.isAuthWorking = !!action.isAuthWorking;
      return newState;
    case 'setAuthWsConnected':
      newState.auth.isAuthWsConnected = !!action.isAuthWsConnected;
      return newState;
    case 'fetchAuthSucceeded':
      newState.fetches.auth.status = FETCH_STATUS.SUCCESS;
      newState.auth.isAuthenticated = !!action.isAuthenticated;
      newState.auth.userData = _AuthService.default.parseUserData(action.response);
      newState.isFinal = determineContextFetchFinal(newState);
      return newState;
    case 'fetchAuthFailed':
      newState.fetches.auth.status = FETCH_STATUS.ERROR;
      newState.fetches.auth.error = action.error;
      newState.auth.isAuthenticated = false;
      newState.auth.userData = null;
      newState.isFinal = determineContextFetchFinal(newState);
      return newState;

    // Actions for handling remote assets
    case 'fetchHtmlSucceeded':
      if (!hasValidRemoteAsset) {
        return state;
      }
      newState.fetches[action.asset].status = FETCH_STATUS.SUCCESS;
      newState.html[action.asset] = action.html;
      return newState;
    case 'fetchHtmlFailed':
      if (!hasValidRemoteAsset) {
        return state;
      }
      newState.fetches[action.asset].status = FETCH_STATUS.ERROR;
      newState.fetches[action.asset].error = action.error;
      return newState;
    case 'whenFinalCalled':
      return _extends({}, newState, {
        whenFinalCalled: true
      });
    default:
      return state;
  }
};

/**
   Function to convert sites fetch response to the shape we expect
*/
const parseSitesFetchResponse = function () {
  let sitesArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  if (!Array.isArray(sitesArray)) {
    return {};
  }
  const sitesObj = {};
  sitesArray.forEach(site => {
    const siteCode = site.siteCode || site.code || null;
    if (!siteCode) {
      return;
    }
    const localReference = _sites.default[siteCode] || {};
    sitesObj[site.siteCode] = {
      siteCode,
      description: site.siteDescription || site.description || null,
      type: site.siteType || site.type || null,
      stateCode: site.stateCode || null,
      domainCode: site.domainCode || null,
      latitude: site.siteLatitude || site.latitude || null,
      longitude: site.siteLongitude || site.longitude || null,
      terrain: site.terrain || localReference.terrain || null,
      zoom: site.zoom || localReference.zoom || null
    };
  });
  return sitesObj;
};

/**
   Context Provider
*/
const Provider = props => {
  const {
    children,
    fetchPartials,
    useCoreAuth,
    whenFinal
  } = props;
  const initialState = (0, _cloneDeep.default)(DEFAULT_STATE);
  initialState.isActive = true;
  if (useCoreAuth) {
    initialState.auth.useCore = true;
    initialState.fetches.auth.status = FETCH_STATUS.AWAITING_CALL;
  }
  if (fetchPartials) {
    initialState.fetches[DRUPAL_HEADER_HTML].status = FETCH_STATUS.AWAITING_CALL;
    initialState.fetches[DRUPAL_FOOTER_HTML].status = FETCH_STATUS.AWAITING_CALL;
  }
  const [state, dispatch] = (0, _react.useReducer)(reducer, initialState);
  const {
    isFinal,
    whenFinalCalled
  } = state;

  // Method to sanitize partial HTML. As delivered presently there are some markup issues that
  // throw warnings when parsed with HTMLReactParser.
  const sanitizePartialHTML = html => html.replace(/ value=""/g, ' initialValue=""');

  // Method to fetch header and/or footer partials
  const fetchPartialHTML = key => {
    if (!Object.keys(_remoteAssetsMap.default).includes(key)) {
      return;
    }
    const {
      url
    } = _remoteAssetsMap.default[key];
    (0, _ajax.ajax)({
      url,
      method: 'GET',
      responseType: 'text'
    }).pipe((0, _rxjs.map)(response => {
      dispatch({
        type: 'fetchHtmlSucceeded',
        asset: key,
        html: sanitizePartialHTML(response.response)
      });
      return (0, _rxjs.of)(true);
    }), (0, _rxjs.catchError)(error => {
      dispatch({
        type: 'fetchHtmlFailed',
        asset: key,
        error
      });
      return (0, _rxjs.of)(false);
    })).subscribe();
  };

  // Identify any cascading authentication fetches that require
  // the WS to be connected to initiate.
  const cascadeAuthFetches = [];

  // Subject and effect to perform and manage the sites GraphQL fetch
  const fetchMethods = {
    sites: () => {
      _NeonGraphQL.default.getAllSites().pipe((0, _rxjs.map)(response => {
        if (response.response && response.response.data && response.response.data.sites) {
          const sites = parseSitesFetchResponse(response.response.data.sites);
          dispatch({
            type: 'fetchSitesSucceeded',
            sites
          });
          return (0, _rxjs.of)(true);
        }
        dispatch({
          type: 'fetchSitesFailed',
          error: 'malformed response'
        });
        return (0, _rxjs.of)(false);
      }), (0, _rxjs.catchError)(error => {
        dispatch({
          type: 'fetchSitesFailed',
          error: error.message
        });
        return (0, _rxjs.of)(false);
      })).subscribe();
    },
    bundles: () => {
      _NeonApi.default.getProductBundlesObservable().pipe((0, _rxjs.map)(response => {
        const bundles = _BundleParser.default.parseBundlesResponse(response);
        if (!(0, _typeUtil.existsNonEmpty)(bundles)) {
          dispatch({
            type: 'fetchBundlesFailed',
            error: 'malformed response'
          });
          return (0, _rxjs.of)(false);
        }
        const context = _BundleParser.default.parseContext(bundles);
        dispatch({
          type: 'fetchBundlesSucceeded',
          bundles: context
        });
        return (0, _rxjs.of)(true);
      }), (0, _rxjs.catchError)(error => {
        dispatch({
          type: 'fetchBundlesFailed',
          error: error.message
        });
        return (0, _rxjs.of)(false);
      })).subscribe();
    },
    auth: () => {
      _AuthService.default.fetchUserInfo(response => {
        const isAuthenticated = _AuthService.default.isAuthenticated(response);
        if (!isAuthenticated && _AuthService.default.isSsoLogin(response)) {
          // If we're not authenticated and have identified another SSO
          // application that's authenticated, trigger a silent authentication
          // check flow.
          if (_AuthService.default.allowSilentAuth()) {
            if (!state.auth.isAuthWsConnected) {
              cascadeAuthFetches.push(() => _AuthService.default.loginSilently(dispatch, true));
            } else {
              _AuthService.default.loginSilently(dispatch, true);
            }
          } else {
            dispatch({
              type: 'fetchAuthSucceeded',
              isAuthenticated,
              response
            });
          }
        } else {
          dispatch({
            type: 'fetchAuthSucceeded',
            isAuthenticated,
            response
          });
        }
        // Initialize a subscription to the auth WS
        _AuthService.default.watchAuth0(dispatch, cascadeAuthFetches);
      }, error => {
        dispatch({
          type: 'fetchAuthFailed',
          error
        });
        // Initialize a subscription to the auth WS
        _AuthService.default.watchAuth0(dispatch, cascadeAuthFetches);
      });
    },
    [DRUPAL_HEADER_HTML]: () => fetchPartialHTML(DRUPAL_HEADER_HTML),
    [DRUPAL_FOOTER_HTML]: () => fetchPartialHTML(DRUPAL_FOOTER_HTML)
  };

  // Effect: Trigger all fetches that are awaiting call
  (0, _react.useEffect)(() => {
    Object.keys(state.fetches).forEach(key => {
      if (state.fetches[key].status !== FETCH_STATUS.AWAITING_CALL || typeof fetchMethods[key] !== 'function') {
        return;
      }
      dispatch({
        type: 'fetchCalled',
        key
      });
      fetchMethods[key]();
    });
  });

  // Effect: call the whenFinal function prop exactly once when first finalized
  (0, _react.useEffect)(() => {
    if (!isFinal || whenFinalCalled) {
      return;
    }
    whenFinal((0, _cloneDeep.default)(_extends({}, state, {
      whenFinalCalled: true
    })));
    dispatch({
      type: 'whenFinalCalled'
    });
  }, [isFinal, whenFinalCalled, whenFinal, state]);

  /**
     Render
  */
  return (
    /*#__PURE__*/
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    _react.default.createElement(Context.Provider, {
      value: [state, dispatch]
    }, children)
  );
};
const ProviderPropTypes = {
  children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string])), _propTypes.default.node, _propTypes.default.string]),
  fetchPartials: _propTypes.default.bool,
  useCoreAuth: _propTypes.default.bool,
  whenFinal: _propTypes.default.func
};
Provider.propTypes = ProviderPropTypes;
Provider.defaultProps = {
  children: null,
  fetchPartials: false,
  useCoreAuth: false,
  whenFinal: () => {}
};

/**
   getWrappedComponent
*/
const getWrappedComponent = Component => props => {
  const [{
    isActive
  }] = useNeonContextState();
  if (!isActive) {
    return /*#__PURE__*/_react.default.createElement(Provider, null, /*#__PURE__*/_react.default.createElement(Component, props));
  }
  return /*#__PURE__*/_react.default.createElement(Component, props);
};

/**
   Export
*/
const NeonContext = {
  Provider,
  useNeonContextState,
  DEFAULT_STATE,
  getWrappedComponent,
  ProviderPropTypes
};
var _default = exports.default = NeonContext; // Additional items exported for unit testing
const getTestableItems = () => process.env.NODE_ENV !== 'test' ? {} : {
  deriveRegionSites,
  parseSitesFetchResponse,
  reducer,
  DRUPAL_HEADER_HTML,
  DRUPAL_FOOTER_HTML
};
exports.getTestableItems = getTestableItems;