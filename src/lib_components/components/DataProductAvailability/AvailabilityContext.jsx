import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';

import cloneDeep from 'lodash/cloneDeep';

import NeonContext from '../NeonContext/NeonContext';

import { AvailabilityPropTypes } from './AvailabilityUtils';

const SORT_DIRECTIONS = { ASC: 'ASC', DESC: 'DESC' };
const DEFAULT_STATE = {
  sites: [],
  tables: {},
  rows: {},
  rowTitles: {},
  rowLabels: [],
  breakouts: [],
  validBreakouts: ['states', 'domains', 'sites', 'tables'],
  sortDirection: SORT_DIRECTIONS.ASC,
  neonContextHydrated: false, // Whether NeonContext data has been one-time hydrated into state
  reference: {
    sites: {},
    states: {},
    domains: {},
  },
};

/**
   Function to copy necessary NeonContext data into local state when ready
*/
const hydrateNeonContextData = (state, neonContextData) => {
  const newState = { ...state, neonContextHydrated: true };
  newState.reference.sites = neonContextData.sites || {};
  newState.reference.states = neonContextData.states || {};
  newState.reference.domains = neonContextData.domains || {};
  newState.neonContextHydrated = true;
  return newState;
};

/**
   Extract Tables
*/
const extractTables = (state) => {
  const tables = {};
  state.sites.forEach((site) => {
    const { siteCode } = site;
    site.tables.forEach((table) => {
      const { name, description, waitInterval } = table;
      if (!tables[name]) {
        tables[name] = {
          name,
          description,
          waitInterval,
          sites: [siteCode],
        };
      } else if (!tables[name].sites.includes(siteCode)) {
        tables[name].sites.push(siteCode);
      }
    });
  });
  const digits = Math.floor(Math.log10(Object.keys(tables).length) + 1);
  Object.keys(tables).forEach((table, idx) => {
    tables[table].tableCode = `T${(idx + 1).toString().padStart(digits, '0')}`;
  });
  return tables;
};

/**
  Calculate Rows
  Take a state object and spit out a new state containing rows for use in the SVG grid
*/
const calculateRows = (state) => {
  if (!state.neonContextHydrated) { return state; }
  const newState = {
    ...state,
    rows: {},
    rowLabels: [],
    rowTitles: {},
  };
  const {
    sites,
    breakouts,
    reference,
    sortDirection,
    tables: knownTables,
  } = state;
  if (!breakouts.length) {
    newState.rowLabels = ['ALL'];
    newState.rows.ALL = {};
  }
  // Generate unsorted row labels and row data respecting breakouts
  sites.forEach((site) => {
    const { siteCode, tables } = site;
    if (!reference.sites[siteCode]) { return; }
    const { stateCode, domainCode } = reference.sites[siteCode];
    tables.forEach((table) => {
      const { name: tableName, months } = table;
      if (!knownTables[tableName]) { return; }
      const { tableCode } = knownTables[tableName];
      // turn siteCode / stateCode / domainCode / tableCode into a label
      // then populate that label's row
      let title = !breakouts.length ? 'Summary of all sites and tables' : '';
      const label = !breakouts.length ? 'ALL' : (
        breakouts.reduce((acc, cur) => {
          switch (cur) {
            case 'states':
              title = `${title}${title.length ? ' - ' : ''}${reference.states[stateCode].name}`;
              return `${acc}${acc.length ? '-' : ''}${stateCode}`;
            case 'domains':
              title = `${title}${title.length ? ' - ' : ''}${reference.domains[domainCode].name}`;
              return `${acc}${acc.length ? '-' : ''}${domainCode}`;
            case 'sites':
              title = `${title}${title.length ? ' - ' : ''}${reference.sites[siteCode].description}`;
              return `${acc}${acc.length ? '-' : ''}${siteCode}`;
            case 'tables':
              title = `${title}${title.length ? ' - ' : ''}${tableName}`;
              return `${acc}${acc.length ? '-' : ''}${tableCode}`;
            default:
              return acc;
          }
        }, '')
      );
      if (!newState.rowLabels.includes(label)) {
        newState.rowLabels.push(label);
        newState.rows[label] = {};
      }
      newState.rowTitles[label] = title;
      Object.keys(months).forEach((month) => {
        newState.rows[label][month] = [...(newState.rows[label][month] || []), months[month]];
      });
    });
    // Sort row labels
    const sortReturns = [
      sortDirection === SORT_DIRECTIONS.ASC ? 1 : -1,
      sortDirection === SORT_DIRECTIONS.ASC ? -1 : 1,
    ];
    newState.rowLabels.sort((a, b) => (a < b ? sortReturns[0] : sortReturns[1]));
  });
  return newState;
};

/**
   Reducer
*/
const reducer = (state, action) => {
  const newState = { ...state };
  switch (action.type) {
    case 'hydrateNeonContextData':
      if (!action.neonContextData) { return state; }
      return calculateRows(hydrateNeonContextData(newState, action.neonContextData));

    case 'setBreakouts':
      if (!action.breakouts.every(b => state.validBreakouts.includes(b))) { return state; }
      newState.breakouts = [...action.breakouts];
      // If new breakouts contains the old leading breakout (the sort method) then keep it in front
      if (state.breakouts.length && newState.breakouts.includes(state.breakouts[0])) {
        newState.breakouts = newState.breakouts.filter(b => b !== state.breakouts[0]);
        newState.breakouts.unshift(state.breakouts[0]);
      }
      return calculateRows(newState);

    case 'setSortMethod':
      // Sort method is not a top-level value; rather the first breakout in the list.
      if (!state.validBreakouts.includes(action.method)) { return state; }
      newState.breakouts = state.breakouts.filter(b => b !== action.method);
      newState.breakouts.unshift(action.method);
      return calculateRows(newState);

    case 'setSortDirection':
      if (!Object.keys(SORT_DIRECTIONS).includes(action.direction)) { return state; }
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
const Context = createContext(DEFAULT_STATE);
const useAvailabilityState = () => {
  const hookResponse = useContext(Context);
  if (hookResponse.length !== 2) {
    return [cloneDeep(DEFAULT_STATE), () => {}];
  }
  return hookResponse;
};

/**
   Context Provider
*/
const Provider = (props) => {
  const { sites, children } = props;

  const [
    { data: neonContextData, isFinal: neonContextIsFinal, hasError: neonContextHasError },
  ] = NeonContext.useNeonContextState();

  /**
     Initial State and Reducer Setup
  */
  let initialState = { ...cloneDeep(DEFAULT_STATE), sites };
  initialState.tables = extractTables(initialState);
  if (neonContextIsFinal && !neonContextHasError) {
    initialState = hydrateNeonContextData(initialState, neonContextData);
  }
  const [state, dispatch] = useReducer(reducer, calculateRows(initialState));

  /**
     Effect - Watch for changes to NeonContext data and push into local state
  */
  useEffect(() => {
    if (!state.neonContextHydrated && neonContextIsFinal && !neonContextHasError) {
      dispatch({ type: 'hydrateNeonContextData', neonContextData });
    }
  }, [
    neonContextData,
    neonContextIsFinal,
    neonContextHasError,
    state.neonContextHydrated,
    dispatch,
  ]);

  /**
     Render
  */
  return (
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  );
};

Provider.propTypes = {
  sites: AvailabilityPropTypes.enhancedSites,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string,
    ])),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
};

Provider.defaultProps = {
  sites: [],
};


/**
   Export
*/
const AvailabilityContext = {
  Provider,
  useAvailabilityState,
  SORT_DIRECTIONS,
};

export default AvailabilityContext;
