import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import cloneDeep from 'lodash/cloneDeep';

import NeonContext from '../NeonContext/NeonContext';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';

import { AvailabilityPropTypes } from './AvailabilityUtils';
import { parseEnhancedAvailability } from './EnhancedAvailabilityParser';
import { DEFAULT_AVAILABILITY_INHERITANCE_MODE } from './EnhancedAvailabilityInheritance';

import NeonSignInButtonState from '../NeonSignInButton/NeonSignInButtonState';
import makeStateStorage from '../../service/StateStorageService';
import { resolveProps } from '../../util/defaultProps';
import { exists } from '../../util/typeUtil';

const SORT_DIRECTIONS = { ASC: 'ASC', DESC: 'DESC' };
const SITE_BREAKOUTS = ['states', 'domains', 'sites'];
const COMPONENT_BREAKOUTS = ['packages', 'tables'];
const PACKAGE_CODES = { basic: 'basic', expanded: 'expanded' };
const DEFAULT_STATE = {
  productCode: null,
  siteMonths: {},
  componentRows: [],
  tables: {},
  hasComponents: false,
  isComponentLevel: false,
  rows: {},
  rowTitles: {},
  rowLabels: [],
  breakouts: [],
  validBreakouts: [...SITE_BREAKOUTS],
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
   Parse enhanced availability data into state with the inheritance mode, one of
   AvailabilityInheritanceMode. Package and table breakouts are only valid when the data includes
   component (table) detail.
*/
const applyAvailability = (state, availability, inheritanceMode) => {
  const parsed = parseEnhancedAvailability(availability, inheritanceMode);
  const validBreakouts = parsed.hasComponents
    ? [...SITE_BREAKOUTS, ...COMPONENT_BREAKOUTS]
    : [...SITE_BREAKOUTS];
  return {
    ...state,
    ...parsed,
    validBreakouts,
    breakouts: state.breakouts.filter((breakout) => validBreakouts.includes(breakout)),
  };
};

const capitalize = (value) => `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

/**
   Get the [label code, title] pair a breakout contributes to a row for a given source
   (a site or a site / package / table component)
*/
const getLabelPart = (breakout, source, state) => {
  const { siteCode, packageType, tableName } = source;
  const { reference, tables } = state;
  const { stateCode, domainCode, description } = reference.sites[siteCode];
  switch (breakout) {
    case 'states':
      return [stateCode, reference.states[stateCode]?.name || stateCode];
    case 'domains':
      return [domainCode, reference.domains[domainCode]?.name || domainCode];
    case 'sites':
      return [siteCode, description || siteCode];
    case 'packages':
      return [
        PACKAGE_CODES[packageType] || packageType.slice(0, 3).toUpperCase(),
        `${capitalize(packageType)} package`,
      ];
    case 'tables':
      return [tables[tableName].tableCode, tableName];
    default:
      return null;
  }
};

/**
  Calculate Rows
  Take a state object and spit out a new state containing rows for use in the SVG grid.
  Rows are built from site-month statuses unless a package or table breakout is selected,
  in which case they are built from component (table) statuses.
*/
const calculateRows = (state) => {
  if (!state.neonContextHydrated) { return state; }
  const {
    siteMonths,
    componentRows,
    breakouts,
    reference,
    sortDirection,
  } = state;
  const isComponentLevel = breakouts.some((breakout) => COMPONENT_BREAKOUTS.includes(breakout));
  const newState = {
    ...state,
    isComponentLevel,
    rows: {},
    rowLabels: [],
    rowTitles: {},
  };
  if (!breakouts.length) {
    newState.rowLabels = ['ALL'];
    newState.rows.ALL = {};
    newState.rowTitles.ALL = 'Summary of all sites';
  }
  const sources = isComponentLevel
    ? componentRows
    : Object.keys(siteMonths).map((siteCode) => ({ siteCode, months: siteMonths[siteCode] }));
  sources.forEach((source) => {
    if (!reference.sites[source.siteCode]) { return; }
    const parts = breakouts
      .map((breakout) => getLabelPart(breakout, source, state))
      .filter((part) => part !== null);
    const label = parts.length ? parts.map(([code]) => code).join('-') : 'ALL';
    if (!newState.rows[label]) {
      newState.rows[label] = {};
      newState.rowLabels.push(label);
      newState.rowTitles[label] = parts.map(([, title]) => title).join(' - ');
    }
    Object.keys(source.months).forEach((month) => {
      if (!newState.rows[label][month]) {
        newState.rows[label][month] = [source.months[month]];
      } else {
        newState.rows[label][month].push(source.months[month]);
      }
    });
  });
  // Rows are drawn bottom-up so this produces ascending order from top to bottom
  const sortReturns = [
    sortDirection === SORT_DIRECTIONS.ASC ? 1 : -1,
    sortDirection === SORT_DIRECTIONS.ASC ? -1 : 1,
  ];
  newState.rowLabels.sort((a, b) => (a < b ? sortReturns[0] : sortReturns[1]));
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

    case 'setAvailability':
      return calculateRows(
        applyAvailability(newState, action.availability, action.inheritanceMode),
      );

    case 'setBreakouts':
      if (!action.breakouts) { return state; }
      if (!action.breakouts.every((b) => state.validBreakouts.includes(b))) { return state; }
      newState.breakouts = [...action.breakouts];
      // If new breakouts contains the old leading breakout (the sort method) then keep it in front
      if (state.breakouts.length && newState.breakouts.includes(state.breakouts[0])) {
        newState.breakouts = newState.breakouts.filter((b) => b !== state.breakouts[0]);
        newState.breakouts.unshift(state.breakouts[0]);
      }
      return calculateRows(newState);

    case 'setSortMethod':
      // Sort method is not a top-level value; rather the first breakout in the list.
      if (!state.validBreakouts.includes(action.method)) { return state; }
      newState.breakouts = state.breakouts.filter((b) => b !== action.method);
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

const defaultProps = {
  dataAvailabilityUniqueId: 0,
  enhancedAvailability: null,
  inheritanceMode: DEFAULT_AVAILABILITY_INHERITANCE_MODE,
};

/**
   Context Provider
*/
const Provider = (inProps) => {
  const props = resolveProps(defaultProps, inProps);
  const {
    enhancedAvailability,
    inheritanceMode,
    dataAvailabilityUniqueId,
    children,
  } = props;

  const [
    { data: neonContextData, isFinal: neonContextIsFinal, hasError: neonContextHasError },
  ] = NeonContext.useNeonContextState();

  // Initialize the storage state and restore state
  const key = `availabilityContextState-${dataAvailabilityUniqueId}`;
  const stateStorage = useMemo(() => makeStateStorage(key), [key]);
  // Determine initial state from session storage once
  const [initState] = useState(() => {
    const savedState = stateStorage.readState();
    const hasSavedState = exists(savedState);
    let initialState = null;
    let restoredStateFromStorage = false;
    if (hasSavedState) {
      initialState = savedState;
      restoredStateFromStorage = true;
    }
    return {
      restoredStateFromStorage,
      initialState,
    };
  });
  // Determine initialized state from stored state or props once
  const [state, dispatch] = useReducer(reducer, null, () => {
    if (initState.restoredStateFromStorage) {
      return calculateRows({ ...cloneDeep(DEFAULT_STATE), ...initState.initialState });
    }
    let initialState = applyAvailability(
      cloneDeep(DEFAULT_STATE),
      enhancedAvailability,
      inheritanceMode,
    );
    if (neonContextIsFinal && !neonContextHasError) {
      initialState = hydrateNeonContextData(initialState, neonContextData);
    }
    return calculateRows(initialState);
  });
  // Clean up session state
  useEffect(() => {
    if (initState.restoredStateFromStorage) {
      stateStorage.removeState();
    }
  }, [stateStorage, initState]);

  /**
     Effect - Apply availability data provided after the initial render (e.g. once fetched), and
     apply it again when the inheritance mode changes
  */
  const appliedAvailabilityRef = useRef({ enhancedAvailability, inheritanceMode });
  useEffect(() => {
    const applied = appliedAvailabilityRef.current;
    if (
      (applied.enhancedAvailability === enhancedAvailability)
      && (applied.inheritanceMode === inheritanceMode)
    ) { return; }
    appliedAvailabilityRef.current = { enhancedAvailability, inheritanceMode };
    dispatch({ type: 'setAvailability', availability: enhancedAvailability, inheritanceMode });
  }, [enhancedAvailability, inheritanceMode]);

  // The current sign in process uses a separate domain. This function
  // persists the current state in storage when the button is clicked
  // so the state may be reloaded when the page is reloaded after sign
  // in.
  useEffect(() => {
    const subscription = NeonSignInButtonState.getObservable().subscribe({
      next: () => {
        if (!NeonEnvironment.enableGlobalSignInState()) return;
        stateStorage.saveState(state);
      },
    });
    return () => { subscription.unsubscribe(); };
  }, [state, stateStorage, key]);

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
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  );
};

Provider.propTypes = {
  dataAvailabilityUniqueId: PropTypes.number,
  enhancedAvailability: AvailabilityPropTypes.enhancedAvailability,
  inheritanceMode: AvailabilityPropTypes.inheritanceMode,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string,
    ])),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
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

// Additional items exported for unit testing
export const getTestableItems = () => (
  process.env.NODE_ENV !== 'test' ? {} : {
    DEFAULT_STATE,
    applyAvailability,
    calculateRows,
    hydrateNeonContextData,
    reducer,
  }
);
