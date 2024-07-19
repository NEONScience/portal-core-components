"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTestableItems = exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _AvailabilityUtils = require("./AvailabilityUtils");
var _NeonSignInButtonState = _interopRequireDefault(require("../NeonSignInButton/NeonSignInButtonState"));
var _StateStorageService = _interopRequireDefault(require("../../service/StateStorageService"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SORT_DIRECTIONS = {
  ASC: 'ASC',
  DESC: 'DESC'
};
const DEFAULT_STATE = {
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
const hydrateNeonContextData = (state, neonContextData) => {
  const newState = _extends({}, state, {
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
const extractTables = state => {
  const tables = {};
  state.sites.forEach(site => {
    const {
      siteCode
    } = site;
    site.tables.forEach(table => {
      const {
        name,
        description,
        waitInterval
      } = table;
      if (!tables[name]) {
        tables[name] = {
          name,
          description,
          waitInterval,
          sites: [siteCode]
        };
      } else if (!tables[name].sites.includes(siteCode)) {
        tables[name].sites.push(siteCode);
      }
    });
  });
  const digits = Math.floor(Math.log10(Object.keys(tables).length) + 1);
  Object.keys(tables).forEach((table, idx) => {
    tables[table].tableCode = "T".concat((idx + 1).toString().padStart(digits, '0'));
  });
  return tables;
};

/**
  Calculate Rows
  Take a state object and spit out a new state containing rows for use in the SVG grid
*/
const calculateRows = state => {
  if (!state.neonContextHydrated) {
    return state;
  }
  const newState = _extends({}, state, {
    rows: {},
    rowLabels: [],
    rowTitles: {}
  });
  const {
    sites,
    breakouts,
    reference,
    sortDirection,
    tables: knownTables
  } = state;
  if (!breakouts.length) {
    newState.rowLabels = ['ALL'];
    newState.rows.ALL = {};
  }
  // Generate unsorted row labels and row data respecting breakouts
  sites.forEach(site => {
    const {
      siteCode,
      tables
    } = site;
    if (!reference.sites[siteCode]) {
      return;
    }
    const {
      stateCode,
      domainCode
    } = reference.sites[siteCode];
    tables.forEach(table => {
      const {
        name: tableName,
        months
      } = table;
      if (!knownTables[tableName]) {
        return;
      }
      const {
        tableCode
      } = knownTables[tableName];
      // turn siteCode / stateCode / domainCode / tableCode into a label
      // then populate that label's row
      let title = !breakouts.length ? 'Summary of all sites and tables' : '';
      const label = !breakouts.length ? 'ALL' : breakouts.reduce((acc, cur) => {
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
      Object.keys(months).forEach(month => {
        newState.rows[label][month] = [...(newState.rows[label][month] || []), months[month]];
      });
    });
    // Sort row labels
    const sortReturns = [sortDirection === SORT_DIRECTIONS.ASC ? 1 : -1, sortDirection === SORT_DIRECTIONS.ASC ? -1 : 1];
    newState.rowLabels.sort((a, b) => a < b ? sortReturns[0] : sortReturns[1]);
  });
  return newState;
};

/**
   Reducer
*/
const reducer = (state, action) => {
  const newState = _extends({}, state);
  switch (action.type) {
    case 'hydrateNeonContextData':
      if (!action.neonContextData) {
        return state;
      }
      return calculateRows(hydrateNeonContextData(newState, action.neonContextData));
    case 'setBreakouts':
      if (!action.breakouts) {
        return state;
      }
      if (!action.breakouts.every(b => state.validBreakouts.includes(b))) {
        return state;
      }
      newState.breakouts = [...action.breakouts];
      // If new breakouts contains the old leading breakout (the sort method) then keep it in front
      if (state.breakouts.length && newState.breakouts.includes(state.breakouts[0])) {
        newState.breakouts = newState.breakouts.filter(b => b !== state.breakouts[0]);
        newState.breakouts.unshift(state.breakouts[0]);
      }
      return calculateRows(newState);
    case 'setSortMethod':
      // Sort method is not a top-level value; rather the first breakout in the list.
      if (!state.validBreakouts.includes(action.method)) {
        return state;
      }
      newState.breakouts = state.breakouts.filter(b => b !== action.method);
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
const Context = /*#__PURE__*/(0, _react.createContext)(DEFAULT_STATE);
const useAvailabilityState = () => {
  const hookResponse = (0, _react.useContext)(Context);
  if (hookResponse.length !== 2) {
    return [(0, _cloneDeep.default)(DEFAULT_STATE), () => {}];
  }
  return hookResponse;
};

/**
 * Defines a lookup of state key to a boolean
 * designating whether or not that instance of the context
 * should pull the state from the session storage and restore.
 * Keeping this lookup outside of the context provider function
 * as to not incur lifecycle interference by storing with useState.
 */
const restoreStateLookup = {};

/**
   Context Provider
*/
const Provider = props => {
  const {
    sites,
    dataAvailabilityUniqueId,
    children
  } = props;
  const [{
    data: neonContextData,
    isFinal: neonContextIsFinal,
    hasError: neonContextHasError
  }] = _NeonContext.default.useNeonContextState();
  const key = "availabilityContextState-".concat(dataAvailabilityUniqueId);
  if (typeof restoreStateLookup[key] === 'undefined') {
    restoreStateLookup[key] = true;
  }
  const shouldRestoreState = restoreStateLookup[key];
  const stateStorage = (0, _StateStorageService.default)(key);
  const savedState = stateStorage.readState();

  /**
     Initial State and Reducer Setup
  */
  let initialState = _extends({}, (0, _cloneDeep.default)(DEFAULT_STATE), {
    sites
  });
  initialState.tables = extractTables(initialState);
  if (neonContextIsFinal && !neonContextHasError && !savedState) {
    initialState = hydrateNeonContextData(initialState, neonContextData);
  }
  if (savedState && shouldRestoreState) {
    restoreStateLookup[key] = false;
    stateStorage.removeState();
    initialState = savedState;
  }
  const [state, dispatch] = (0, _react.useReducer)(reducer, calculateRows(initialState));

  // The current sign in process uses a separate domain. This function
  // persists the current state in storage when the button is clicked
  // so the state may be reloaded when the page is reloaded after sign
  // in.
  (0, _react.useEffect)(() => {
    const subscription = _NeonSignInButtonState.default.getObservable().subscribe({
      next: () => {
        if (!_NeonEnvironment.default.enableGlobalSignInState) return;
        restoreStateLookup[key] = false;
        stateStorage.saveState(state);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [state, stateStorage, key]);

  /**
     Effect - Watch for changes to NeonContext data and push into local state
  */
  (0, _react.useEffect)(() => {
    if (!state.neonContextHydrated && neonContextIsFinal && !neonContextHasError) {
      dispatch({
        type: 'hydrateNeonContextData',
        neonContextData
      });
    }
  }, [neonContextData, neonContextIsFinal, neonContextHasError, state.neonContextHydrated, dispatch]);

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
Provider.propTypes = {
  dataAvailabilityUniqueId: _propTypes.default.number,
  sites: _AvailabilityUtils.AvailabilityPropTypes.enhancedSites,
  children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string])), _propTypes.default.node, _propTypes.default.string]).isRequired
};
Provider.defaultProps = {
  dataAvailabilityUniqueId: 0,
  sites: []
};

/**
   Export
*/
const AvailabilityContext = {
  Provider,
  useAvailabilityState,
  SORT_DIRECTIONS
};
var _default = exports.default = AvailabilityContext; // Additional items exported for unit testing
const getTestableItems = () => process.env.NODE_ENV !== 'test' ? {} : {
  DEFAULT_STATE,
  calculateRows,
  extractTables,
  hydrateNeonContextData,
  reducer
};
exports.getTestableItems = getTestableItems;