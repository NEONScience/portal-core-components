"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTestableItems = exports.default = exports.FETCH_STATUS = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _ajax = require("rxjs/ajax");

var _remoteAssetsMap = _interopRequireDefault(require("../../remoteAssetsMap/remoteAssetsMap"));

var _AuthService = _interopRequireDefault(require("../NeonAuth/AuthService"));

var _NeonGraphQL = _interopRequireDefault(require("../NeonGraphQL/NeonGraphQL"));

var _sites = _interopRequireDefault(require("../../staticJSON/sites.json"));

var _states = _interopRequireDefault(require("../../staticJSON/states.json"));

var _domains = _interopRequireDefault(require("../../staticJSON/domains.json"));

var _bundles = _interopRequireDefault(require("../../staticJSON/bundles.json"));

var _timeSeriesDataProducts = _interopRequireDefault(require("../../staticJSON/timeSeriesDataProducts.json"));

var _html, _fetches;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DRUPAL_HEADER_HTML = _remoteAssetsMap.default.DRUPAL_HEADER_HTML.KEY;
var DRUPAL_FOOTER_HTML = _remoteAssetsMap.default.DRUPAL_FOOTER_HTML.KEY;
var FETCH_STATUS = {
  AWAITING_CALL: 'AWAITING_CALL',
  FETCHING: 'FETCHING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS'
};
exports.FETCH_STATUS = FETCH_STATUS;
var DEFAULT_STATE = {
  data: {
    sites: {},
    states: _states.default,
    domains: _domains.default,
    bundles: _bundles.default,
    timeSeriesDataProducts: _timeSeriesDataProducts.default,
    stateSites: {},
    // derived when sites is fetched
    domainSites: {} // derived when sites is fetched

  },
  html: (_html = {}, _defineProperty(_html, DRUPAL_HEADER_HTML, null), _defineProperty(_html, DRUPAL_FOOTER_HTML, null), _html),
  fetches: (_fetches = {
    sites: {
      status: FETCH_STATUS.AWAITING_CALL,
      error: null
    },
    auth: {
      status: null,
      error: null
    }
  }, _defineProperty(_fetches, DRUPAL_HEADER_HTML, {
    status: null,
    error: null
  }), _defineProperty(_fetches, DRUPAL_FOOTER_HTML, {
    status: null,
    error: null
  }), _fetches),
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
}; // Derive values for stateSites and domainSites in state. This is a one-time mapping we
// generate when sites are loaded into state containing lists of site codes for each
// state code / domain code.

var deriveRegionSites = function deriveRegionSites(state) {
  var stateSites = {};
  var domainSites = {};
  Object.keys(state.data.sites).forEach(function (siteCode) {
    var _state$data$sites$sit = state.data.sites[siteCode],
        stateCode = _state$data$sites$sit.stateCode,
        domainCode = _state$data$sites$sit.domainCode;

    if (!stateSites[stateCode]) {
      stateSites[stateCode] = new Set();
    }

    if (!domainSites[domainCode]) {
      domainSites[domainCode] = new Set();
    }

    stateSites[stateCode].add(siteCode);
    domainSites[domainCode].add(siteCode);
  }); // Fill in empty sets for any states that had no NEON sites

  Object.keys(state.data.states).filter(function (stateCode) {
    return !stateSites[stateCode];
  }).forEach(function (stateCode) {
    stateSites[stateCode] = new Set();
  });
  return _extends({}, state, {
    data: _extends({}, state.data, {
      stateSites: stateSites,
      domainSites: domainSites
    })
  });
};
/**
   CONTEXT
*/


var Context = /*#__PURE__*/(0, _react.createContext)(DEFAULT_STATE);
/**
   HOOK
*/

var useNeonContextState = function useNeonContextState() {
  var hookResponse = (0, _react.useContext)(Context); // If called by a component that's not inside a NeonContext the hookResponse will be
  // DEFAULT_STATE. Otherwise it will return an array of length one containing the current state.
  // Thus we double-check here that we got an active state before returning it.

  if (!Array.isArray(hookResponse) || !hookResponse[0].isActive) {
    return [_extends({}, DEFAULT_STATE), function () {}];
  }

  return hookResponse;
};
/**
   Reducer
*/


var reducer = function reducer(state, action) {
  // Always deep clone fetches as that's the main thing we care about
  // changing to trigger re-renders in the consumer.
  var newState = _extends({}, state, {
    fetches: (0, _cloneDeep.default)(state.fetches)
  });

  var hasValidRemoteAsset = action.asset && Object.keys(_remoteAssetsMap.default).includes(action.asset);

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
      newState.isFinal = true;
      return deriveRegionSites(newState);

    case 'fetchSitesFailed':
      newState.fetches.sites.status = FETCH_STATUS.ERROR;
      newState.fetches.sites.error = action.error;
      newState.isFinal = true;
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
      return newState;

    case 'fetchAuthFailed':
      newState.fetches.auth.status = FETCH_STATUS.ERROR;
      newState.fetches.auth.error = action.error;
      newState.auth.isAuthenticated = false;
      newState.auth.userData = null;
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


var parseSitesFetchResponse = function parseSitesFetchResponse() {
  var sitesArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  if (!Array.isArray(sitesArray)) {
    return {};
  }

  var sitesObj = {};
  sitesArray.forEach(function (site) {
    var siteCode = site.siteCode || site.code || null;

    if (!siteCode) {
      return;
    }

    var localReference = _sites.default[siteCode] || {};
    sitesObj[site.siteCode] = {
      siteCode: siteCode,
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


var Provider = function Provider(props) {
  var _fetchMethods;

  var children = props.children,
      fetchPartials = props.fetchPartials,
      useCoreAuth = props.useCoreAuth,
      whenFinal = props.whenFinal;
  var initialState = (0, _cloneDeep.default)(DEFAULT_STATE);
  initialState.isActive = true;

  if (useCoreAuth) {
    initialState.auth.useCore = true;
    initialState.fetches.auth.status = FETCH_STATUS.AWAITING_CALL;
  }

  if (fetchPartials) {
    initialState.fetches[DRUPAL_HEADER_HTML].status = FETCH_STATUS.AWAITING_CALL;
    initialState.fetches[DRUPAL_FOOTER_HTML].status = FETCH_STATUS.AWAITING_CALL;
  }

  var _useReducer = (0, _react.useReducer)(reducer, initialState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var isFinal = state.isFinal,
      whenFinalCalled = state.whenFinalCalled; // Method to sanitize partial HTML. As delivered presently there are some markup issues that
  // throw warnings when parsed with HTMLReactParser.

  var sanitizePartialHTML = function sanitizePartialHTML(html) {
    return html.replace(/ value=""/g, ' initialValue=""');
  }; // Method to fetch header and/or footer partials


  var fetchPartialHTML = function fetchPartialHTML(key) {
    if (!Object.keys(_remoteAssetsMap.default).includes(key)) {
      return;
    }

    var url = _remoteAssetsMap.default[key].url;
    (0, _ajax.ajax)({
      url: url,
      method: 'GET',
      responseType: 'text'
    }).pipe((0, _operators.map)(function (response) {
      dispatch({
        type: 'fetchHtmlSucceeded',
        asset: key,
        html: sanitizePartialHTML(response.response)
      });
      return (0, _rxjs.of)(true);
    }), (0, _operators.catchError)(function (error) {
      dispatch({
        type: 'fetchHtmlFailed',
        asset: key,
        error: error
      });
      return (0, _rxjs.of)(false);
    })).subscribe();
  }; // Identify any cascading authentication fetches that require
  // the WS to be connected to initiate.


  var cascadeAuthFetches = []; // Subject and effect to perform and manage the sites GraphQL fetch

  var fetchMethods = (_fetchMethods = {
    sites: function sites() {
      _NeonGraphQL.default.getAllSites().pipe((0, _operators.map)(function (response) {
        if (response.response && response.response.data && response.response.data.sites) {
          var sites = parseSitesFetchResponse(response.response.data.sites);
          dispatch({
            type: 'fetchSitesSucceeded',
            sites: sites
          });
          return (0, _rxjs.of)(true);
        }

        dispatch({
          type: 'fetchSitesFailed',
          error: 'malformed response'
        });
        return (0, _rxjs.of)(false);
      }), (0, _operators.catchError)(function (error) {
        dispatch({
          type: 'fetchSitesFailed',
          error: error.message
        });
        return (0, _rxjs.of)(false);
      })).subscribe();
    },
    auth: function auth() {
      _AuthService.default.fetchUserInfo(function (response) {
        var isAuthenticated = _AuthService.default.isAuthenticated(response);

        if (!isAuthenticated && _AuthService.default.isSsoLogin(response)) {
          // If we're not authenticated and have identified another SSO
          // application that's authenticated, trigger a silent authentication
          // check flow.
          if (_AuthService.default.allowSilentAuth()) {
            if (!state.auth.isAuthWsConnected) {
              cascadeAuthFetches.push(function () {
                return _AuthService.default.loginSilently(dispatch, true);
              });
            } else {
              _AuthService.default.loginSilently(dispatch, true);
            }
          } else {
            _AuthService.default.login();
          }
        } else {
          dispatch({
            type: 'fetchAuthSucceeded',
            isAuthenticated: isAuthenticated,
            response: response
          });
        } // Initialize a subscription to the auth WS


        _AuthService.default.watchAuth0(dispatch, cascadeAuthFetches);
      }, function (error) {
        dispatch({
          type: 'fetchAuthFailed',
          error: error
        }); // Initialize a subscription to the auth WS

        _AuthService.default.watchAuth0(dispatch, cascadeAuthFetches);
      });
    }
  }, _defineProperty(_fetchMethods, DRUPAL_HEADER_HTML, function () {
    return fetchPartialHTML(DRUPAL_HEADER_HTML);
  }), _defineProperty(_fetchMethods, DRUPAL_FOOTER_HTML, function () {
    return fetchPartialHTML(DRUPAL_FOOTER_HTML);
  }), _fetchMethods); // Effect: Trigger all fetches that are awaiting call

  (0, _react.useEffect)(function () {
    Object.keys(state.fetches).forEach(function (key) {
      if (state.fetches[key].status !== FETCH_STATUS.AWAITING_CALL || typeof fetchMethods[key] !== 'function') {
        return;
      }

      dispatch({
        type: 'fetchCalled',
        key: key
      });
      fetchMethods[key]();
    });
  }); // Effect: call the whenFinal function prop exactly once when first finalized

  (0, _react.useEffect)(function () {
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

  return /*#__PURE__*/_react.default.createElement(Context.Provider, {
    value: [state, dispatch]
  }, children);
};

var ProviderPropTypes = {
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
  whenFinal: function whenFinal() {}
};
/**
   getWrappedComponent
*/

var getWrappedComponent = function getWrappedComponent(Component) {
  return function (props) {
    var _useNeonContextState = useNeonContextState(),
        _useNeonContextState2 = _slicedToArray(_useNeonContextState, 1),
        isActive = _useNeonContextState2[0].isActive;

    if (!isActive) {
      return /*#__PURE__*/_react.default.createElement(Provider, null, /*#__PURE__*/_react.default.createElement(Component, props));
    }

    return /*#__PURE__*/_react.default.createElement(Component, props);
  };
};
/**
   Export
*/


var NeonContext = {
  Provider: Provider,
  useNeonContextState: useNeonContextState,
  DEFAULT_STATE: DEFAULT_STATE,
  getWrappedComponent: getWrappedComponent,
  ProviderPropTypes: ProviderPropTypes
};
var _default = NeonContext; // Additional items exported for unit testing

exports.default = _default;

var getTestableItems = function getTestableItems() {
  return process.env.NODE_ENV !== 'test' ? {} : {
    deriveRegionSites: deriveRegionSites,
    parseSitesFetchResponse: parseSitesFetchResponse,
    reducer: reducer,
    DRUPAL_HEADER_HTML: DRUPAL_HEADER_HTML,
    DRUPAL_FOOTER_HTML: DRUPAL_FOOTER_HTML
  };
};

exports.getTestableItems = getTestableItems;