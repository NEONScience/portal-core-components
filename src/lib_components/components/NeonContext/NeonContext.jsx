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

import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';
import sitesJSON from '../../staticJSON/sites.json';
import statesJSON from '../../staticJSON/states.json';
import domainsJSON from '../../staticJSON/domains.json';
import bundlesJSON from '../../staticJSON/bundles.json';

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
  },
  fetches: {
    sites: { status: FETCH_STATUS.AWAITING_CALL, error: null },
  },
  isActive: false,
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
  useEffect(() => {
    if (state.fetches.sites.status === FETCH_STATUS.AWAITING_CALL) {
      dispatch({ type: 'fetchSitesCalled' });
      fetchAllSites$.subscribe();
    }
  });

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
   Export
*/
const NeonContext = { Provider, useNeonContextState, DEFAULT_STATE };
export default NeonContext;
