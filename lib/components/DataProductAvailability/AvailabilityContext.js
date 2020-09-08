"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));

var _AvailabilityUtils = require("./AvailabilityUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var SORT_DIRECTIONS = {
  ASC: 'ASC',
  DESC: 'DESC'
};
var DEFAULT_STATE = {
  sites: [],
  tables: {},
  rows: {},
  rowTitles: {},
  rowLabels: [],
  breakouts: [],
  validBreakouts: ['states', 'domains', 'sites', 'tables'],
  sortDirection: SORT_DIRECTIONS.ASC,
  neonContextHydrated: false,
  // Whether NeonContext data has been one-time hydrated into state
  reference: {
    sites: {},
    states: {},
    domains: {}
  }
};
/**
   Function to copy necessary NeonContext data into local state when ready
*/

var hydrateNeonContextData = function hydrateNeonContextData(state, neonContextData) {
  var newState = _extends({}, state, {
    neonContextHydrated: true
  });

  newState.reference.sites = neonContextData.sites || {};
  newState.reference.states = neonContextData.states || {};
  newState.reference.domains = neonContextData.domains || {};
  newState.neonContextHydrated = true;
  return newState;
};
/**
   Extract Tables
*/


var extractTables = function extractTables(state) {
  var tables = {};
  state.sites.forEach(function (site) {
    var siteCode = site.siteCode;
    site.tables.forEach(function (table) {
      var name = table.name,
          description = table.description,
          waitInterval = table.waitInterval;

      if (!tables[name]) {
        tables[name] = {
          name: name,
          description: description,
          waitInterval: waitInterval,
          sites: [siteCode]
        };
      } else if (!tables[name].sites.includes(siteCode)) {
        tables[name].sites.push(siteCode);
      }
    });
  });
  var digits = Math.floor(Math.log10(Object.keys(tables).length) + 1);
  Object.keys(tables).forEach(function (table, idx) {
    tables[table].tableCode = "T".concat((idx + 1).toString().padStart(digits, '0'));
  });
  return tables;
};
/**
  Calculate Rows
  Take a state object and spit out a new state containing rows for use in the SVG grid
*/


var calculateRows = function calculateRows(state) {
  if (!state.neonContextHydrated) {
    return state;
  }

  var newState = _extends({}, state, {
    rows: {},
    rowLabels: [],
    rowTitles: {}
  });

  var sites = state.sites,
      breakouts = state.breakouts,
      reference = state.reference,
      sortDirection = state.sortDirection,
      knownTables = state.tables;

  if (!breakouts.length) {
    newState.rowLabels = ['ALL'];
    newState.rows.ALL = {};
  } // Generate unsorted row labels and row data respecting breakouts


  sites.forEach(function (site) {
    var siteCode = site.siteCode,
        tables = site.tables;

    if (!reference.sites[siteCode]) {
      return;
    }

    var _reference$sites$site = reference.sites[siteCode],
        stateCode = _reference$sites$site.stateCode,
        domainCode = _reference$sites$site.domainCode;
    tables.forEach(function (table) {
      var tableName = table.name,
          months = table.months;

      if (!knownTables[tableName]) {
        return;
      }

      var tableCode = knownTables[tableName].tableCode; // turn siteCode / stateCode / domainCode / tableCode into a label
      // then populate that label's row

      var title = !breakouts.length ? 'Summary of all sites and tables' : '';
      var label = !breakouts.length ? 'ALL' : breakouts.reduce(function (acc, cur) {
        switch (cur) {
          case 'states':
            title = "".concat(title).concat(title.length ? ' - ' : '').concat(reference.states[stateCode].name);
            return "".concat(acc).concat(acc.length ? '-' : '').concat(stateCode);

          case 'domains':
            title = "".concat(title).concat(title.length ? ' - ' : '').concat(reference.domains[domainCode].name);
            return "".concat(acc).concat(acc.length ? '-' : '').concat(domainCode);

          case 'sites':
            title = "".concat(title).concat(title.length ? ' - ' : '').concat(reference.sites[siteCode].description);
            return "".concat(acc).concat(acc.length ? '-' : '').concat(siteCode);

          case 'tables':
            title = "".concat(title).concat(title.length ? ' - ' : '').concat(tableName);
            return "".concat(acc).concat(acc.length ? '-' : '').concat(tableCode);

          default:
            return acc;
        }
      }, '');

      if (!newState.rowLabels.includes(label)) {
        newState.rowLabels.push(label);
        newState.rows[label] = {};
      }

      newState.rowTitles[label] = title;
      Object.keys(months).forEach(function (month) {
        newState.rows[label][month] = [].concat(_toConsumableArray(newState.rows[label][month] || []), [months[month]]);
      });
    }); // Sort row labels

    var sortReturns = [sortDirection === SORT_DIRECTIONS.ASC ? 1 : -1, sortDirection === SORT_DIRECTIONS.ASC ? -1 : 1];
    newState.rowLabels.sort(function (a, b) {
      return a < b ? sortReturns[0] : sortReturns[1];
    });
  });
  return newState;
};
/**
   Reducer
*/


var reducer = function reducer(state, action) {
  var newState = _extends({}, state);

  switch (action.type) {
    case 'hydrateNeonContextData':
      if (!action.neonContextData) {
        return state;
      }

      return calculateRows(hydrateNeonContextData(newState, action.neonContextData));

    case 'setBreakouts':
      if (!action.breakouts.every(function (b) {
        return state.validBreakouts.includes(b);
      })) {
        return state;
      }

      newState.breakouts = _toConsumableArray(action.breakouts); // If new breakouts contains the old leading breakout (the sort method) then keep it in front

      if (state.breakouts.length && newState.breakouts.includes(state.breakouts[0])) {
        newState.breakouts = newState.breakouts.filter(function (b) {
          return b !== state.breakouts[0];
        });
        newState.breakouts.unshift(state.breakouts[0]);
      }

      return calculateRows(newState);

    case 'setSortMethod':
      // Sort method is not a top-level value; rather the first breakout in the list.
      if (!state.validBreakouts.includes(action.method)) {
        return state;
      }

      newState.breakouts = state.breakouts.filter(function (b) {
        return b !== action.method;
      });
      newState.breakouts.unshift(action.method);
      return calculateRows(newState);

    case 'setSortDirection':
      if (!Object.keys(SORT_DIRECTIONS).includes(action.direction)) {
        return state;
      }

      newState.sortDirection = action.direction;
      return calculateRows(newState);
    // Default

    default:
      return state;
  }
};
/**
   Context and Hook
*/


var Context = /*#__PURE__*/(0, _react.createContext)(DEFAULT_STATE);

var useAvailabilityState = function useAvailabilityState() {
  var hookResponse = (0, _react.useContext)(Context);

  if (hookResponse.length !== 2) {
    return [(0, _cloneDeep.default)(DEFAULT_STATE), function () {}];
  }

  return hookResponse;
};
/**
   Context Provider
*/


var Provider = function Provider(props) {
  var sites = props.sites,
      children = props.children;

  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
      _NeonContext$useNeonC3 = _NeonContext$useNeonC2[0],
      neonContextData = _NeonContext$useNeonC3.data,
      neonContextIsFinal = _NeonContext$useNeonC3.isFinal,
      neonContextHasError = _NeonContext$useNeonC3.hasError;
  /**
     Initial State and Reducer Setup
  */


  var initialState = _extends({}, (0, _cloneDeep.default)(DEFAULT_STATE), {
    sites: sites
  });

  initialState.tables = extractTables(initialState);

  if (neonContextIsFinal && !neonContextHasError) {
    initialState = hydrateNeonContextData(initialState, neonContextData);
  }

  var _useReducer = (0, _react.useReducer)(reducer, calculateRows(initialState)),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];
  /**
     Effect - Watch for changes to NeonContext data and push into local state
  */


  (0, _react.useEffect)(function () {
    if (!state.neonContextHydrated && neonContextIsFinal && !neonContextHasError) {
      dispatch({
        type: 'hydrateNeonContextData',
        neonContextData: neonContextData
      });
    }
  }, [neonContextData, neonContextIsFinal, neonContextHasError, state.neonContextHydrated, dispatch]);
  /**
     Render
  */

  return /*#__PURE__*/_react.default.createElement(Context.Provider, {
    value: [state, dispatch]
  }, children);
};

Provider.propTypes = {
  sites: _AvailabilityUtils.AvailabilityPropTypes.enhancedSites,
  children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string])), _propTypes.default.node, _propTypes.default.string]).isRequired
};
Provider.defaultProps = {
  sites: []
};
/**
   Export
*/

var AvailabilityContext = {
  Provider: Provider,
  useAvailabilityState: useAvailabilityState,
  SORT_DIRECTIONS: SORT_DIRECTIONS
};
var _default = AvailabilityContext;
exports.default = _default;