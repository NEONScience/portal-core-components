import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import cloneDeep from 'lodash/cloneDeep';

import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import Authenticate from '../../auth/authenticate';
import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';
import sitesJSON from '../../staticJSON/sites.json';
import statesJSON from '../../staticJSON/states.json';
import domainsJSON from '../../staticJSON/domains.json';
import bundlesJSON from '../../staticJSON/bundles.json';
import timeSeriesDataProductsJSON from '../../staticJSON/timeSeriesDataProducts.json';

const FETCH_STATUS = {
  AWAITING_CALL: 'AWAITING_CALL',
  FETCHING: 'FETCHING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
};

const DEFAULT_STATE = {
  data: {
    sites: {},
    states: statesJSON,
    domains: domainsJSON,
    bundles: bundlesJSON,
    timeSeriesDataProducts: timeSeriesDataProductsJSON,
    stateSites: {}, // derived when sites is fetched
    domainSites: {}, // derived when sites is fetched
  },
  fetches: {
    sites: { status: FETCH_STATUS.AWAITING_CALL, error: null },
  },
  auth: {
    isAuthenticated: false,
    fetchStatus: FETCH_STATUS.AWAITING_CALL,
  },
  isActive: false,
  isFinal: false,
  hasError: false,
};

// Derive values for stateSites and domainSites in state. This is a one-time mapping we
// generate when sites are loaded into state containing lists of site codes for each
// state code / domain code.
const deriveRegionSites = (state) => {
  const stateSites = {};
  const domainSites = {};
  Object.keys(state.data.sites).forEach((siteCode) => {
    const { stateCode, domainCode } = state.data.sites[siteCode];
    if (!stateSites[stateCode]) { stateSites[stateCode] = new Set(); }
    if (!domainSites[domainCode]) { domainSites[domainCode] = new Set(); }
    stateSites[stateCode].add(siteCode);
    domainSites[domainCode].add(siteCode);
  });
  // Fill in empty sets for any states that had no NEON sites
  Object.keys(state.data.states).forEach((stateCode) => {
    if (!stateSites[stateCode]) { stateSites[stateCode] = new Set(); }
  });
  return {
    ...state,
    data: { ...state.data, stateSites, domainSites },
  };
};

/**
   CONTEXT
*/
const Context = createContext(DEFAULT_STATE);

/**
   HOOK
*/
const useNeonContextState = () => {
  const hookResponse = useContext(Context);
  // If called by a component that's not inside a NeonContext the hookResponse will be
  // DEFAULT_STATE. Otherwise it will return an array of length one containing the current state.
  // Thus we double-check here that we got an active state before returning it.
  if (!Array.isArray(hookResponse) || !hookResponse[0].isActive) {
    return [
      { ...DEFAULT_STATE },
      () => {},
    ];
  }
  return hookResponse;
};

/**
   Reducer
*/
const reducer = (state, action) => {
  // Always deep clone fetches as that's the main thing we care about
  // changing to trigger re-renders in the consumer.
  const newState = { ...state, fetches: cloneDeep(state.fetches) };
  switch (action.type) {
    // Actions for handling sites fetch
    case 'fetchSitesCalled':
      newState.fetches.sites.status = FETCH_STATUS.FETCHING;
      return newState;
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
    case 'setIsAuthenticated':
      newState.auth.isAuthenticated = !!action.isAuthenticated;
      newState.auth.fetchStatus = FETCH_STATUS.SUCCESS;
      return newState;
    case 'setAuthFetching':
      newState.auth.fetchStatus = FETCH_STATUS.FETCHING;
      return newState;

    default:
      return state;
  }
};

/**
   Function to convert sites fetch response to the shape we expect
*/
const parseSitesFetchResponse = (sitesArray = []) => {
  if (!Array.isArray(sitesArray)) { return {}; }
  const sitesObj = {};
  sitesArray.forEach((site) => {
    sitesObj[site.siteCode] = {
      siteCode: site.siteCode || site.code,
      description: site.siteDescription || site.description,
      type: site.siteType || site.type,
      stateCode: site.stateCode,
      domainCode: site.domainCode,
      latitude: site.siteLatitude || site.latitude,
      longitude: site.siteLongitude || site.longitude,
      terrain: site.terrain || sitesJSON[site.siteCode].terrain,
    };
  });
  return sitesObj;
};

/**
   Context Provider
*/
const Provider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, { ...DEFAULT_STATE, isActive: true });

  // Subject and effect to perform and manage the sites GraphQL fetch
  const fetchAllSites$ = NeonGraphQL.getAllSites().pipe(
    map((response) => {
      if (response.response && response.response.data && response.response.data.sites) {
        const sites = parseSitesFetchResponse(response.response.data.sites);
        dispatch({ type: 'fetchSitesSucceeded', sites });
        return of(true);
      }
      dispatch({ type: 'fetchSitesFailed', error: 'malformed response' });
      return of(false);
    }),
    catchError((error) => {
      dispatch({ type: 'fetchSitesFailed', error: error.message });
      return of(false);
    }),
  );

  // Effect: fetch sites data
  useEffect(() => {
    if (state.fetches.sites.status === FETCH_STATUS.AWAITING_CALL) {
      dispatch({ type: 'fetchSitesCalled' });
      fetchAllSites$.subscribe();
    }
  });

  // Effect: set the authentication status
  useEffect(() => {
    if (state.auth.fetchStatus !== FETCH_STATUS.AWAITING_CALL) { return; }
    dispatch({ type: 'setAuthFetching' });
    const auth = new Authenticate();
    auth.isAuthenticated(
      (response) => {
        dispatch({ type: 'setIsAuthenticated', isAuthenticated: auth.checkAuthResponse(response) });
      },
      () => {
        dispatch({ type: 'setIsAuthenticated', isAuthenticated: false });
      },
    );
  }, [state.auth.fetchStatus]);

  /**
     Render
  */
  return (
    <Context.Provider value={[state]}>
      {children}
    </Context.Provider>
  );
};

Provider.propTypes = {
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
   getWrappedComponent
*/
const getWrappedComponent = Component => (props) => {
  const [{ isActive }] = useNeonContextState();
  if (!isActive) {
    return (
      <Provider>
        <Component {...props} />
      </Provider>
    );
  }
  return <Component {...props} />;
};

/**
   Export
*/
const NeonContext = {
  Provider,
  useNeonContextState,
  DEFAULT_STATE,
  getWrappedComponent,
};
export default NeonContext;
