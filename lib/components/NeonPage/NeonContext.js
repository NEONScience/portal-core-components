"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _NeonGraphQL = _interopRequireDefault(require("../NeonGraphQL/NeonGraphQL"));

var _sites = _interopRequireDefault(require("../../staticJSON/sites.json"));

var _states = _interopRequireDefault(require("../../staticJSON/states.json"));

var _domains = _interopRequireDefault(require("../../staticJSON/domains.json"));

var _bundles = _interopRequireDefault(require("../../staticJSON/bundles.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var FETCH_STATUS = {
  AWAITING_CALL: 'AWAITING_CALL',
  FETCHING: 'FETCHING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS'
};
var DEFAULT_STATE = {
  data: {
    sites: {},
    states: _states.default,
    domains: _domains.default,
    bundles: _bundles.default
  },
  fetches: {
    sites: {
      status: FETCH_STATUS.AWAITING_CALL,
      error: null
    }
  }
};
/**
   CONTEXT
*/

var Context = (0, _react.createContext)(DEFAULT_STATE);
/**
   HOOK
*/

var useNeonContextState = function useNeonContextState() {
  var hookResponse = (0, _react.useContext)(Context);

  if (hookResponse.length !== 2) {
    return [_extends({}, DEFAULT_STATE), function () {}];
  }

  return hookResponse;
};
/**
   Reducer
*/


var reducer = function reducer(state, action) {
  var newState = _extends({}, state);

  switch (action.type) {
    case 'fetchSitesCalled':
      newState.fetches.sites.status = FETCH_STATUS.FETCHING;
      return newState;

    case 'fetchSitesSucceeded':
      newState.fetches.sites.status = FETCH_STATUS.SUCCESS;
      newState.data.sites = action.sites;
      return newState;

    case 'fetchSitesFailed':
      newState.fetches.sites.status = FETCH_STATUS.ERROR;
      newState.fetches.sites.error = action.error;
      return newState;

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
    sitesObj[site.siteCode] = {
      siteCode: site.siteCode || site.code,
      description: site.siteDescription || site.description,
      type: site.siteType || site.type,
      stateCode: site.stateCode,
      domainCode: site.domainCode,
      latitude: site.siteLatitude || site.latitude,
      longitude: site.siteLongitude || site.longitude,
      terrain: site.terrain || _sites.default[site.siteCode].terrain
    };
  });
  return sitesObj;
};
/**
   Context Provider
*/


var Provider = function Provider(props) {
  var children = props.children;

  var _useReducer = (0, _react.useReducer)(reducer, _extends({}, DEFAULT_STATE)),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1]; // Subject and effect to perform and manage the sites GraphQL fetch


  var fetchAllSites$ = _NeonGraphQL.default.getAllSites().pipe((0, _operators.map)(function (response) {
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
  }));

  (0, _react.useEffect)(function () {
    if (state.fetches.sites.status === FETCH_STATUS.AWAITING_CALL) {
      dispatch({
        type: 'fetchSitesCalled'
      });
      fetchAllSites$.subscribe();
    }
  });
  /**
     Render
  */

  return _react.default.createElement(Context.Provider, {
    value: [state]
  }, children);
};

Provider.propTypes = {
  children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string])), _propTypes.default.node, _propTypes.default.string]).isRequired
};
/**
   Export
*/

var NeonContext = {
  Provider: Provider,
  useNeonContextState: useNeonContextState
};
var _default = NeonContext;
exports.default = _default;