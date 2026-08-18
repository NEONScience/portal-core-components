import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import cloneDeep from 'lodash/cloneDeep';

import { of, map, catchError } from 'rxjs';

import NeonApi from '../NeonApi/NeonApi';
import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';
import BundleParser from '../../parser/BundleParser';
import { existsNonEmpty } from '../../util/typeUtil';
import { resolveProps } from '../../util/defaultProps';

import sitesJSON from '../../staticJSON/sites.json';
import statesJSON from '../../staticJSON/states.json';
import domainsJSON from '../../staticJSON/domains.json';
import timeSeriesDataProductsJSON from '../../staticJSON/timeSeriesDataProducts.json';
import aopDataProductsJSON from '../../staticJSON/aopDataProducts.json';
import saeDataProductsJSON from '../../staticJSON/saeDataProducts.json';

export const FETCH_STATUS = {
  AWAITING_CALL: 'AWAITING_CALL',
  FETCHING: 'FETCHING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
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
      apiResponse: [],
    },
    states: statesJSON,
    domains: domainsJSON,
    timeSeriesDataProducts: timeSeriesDataProductsJSON,
    aopDataProducts: aopDataProductsJSON,
    saeDataProducts: saeDataProductsJSON,
    stateSites: {}, // derived when sites is fetched
    domainSites: {}, // derived when sites is fetched
  },
  fetches: {
    sites: { status: FETCH_STATUS.AWAITING_CALL, error: null },
    bundles: { status: FETCH_STATUS.AWAITING_CALL, error: null },
  },
  isActive: false,
  isFinal: false,
  hasError: false,
  whenFinalCalled: false,
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
  Object.keys(state.data.states)
    .filter((stateCode) => !stateSites[stateCode])
    .forEach((stateCode) => { stateSites[stateCode] = new Set(); });
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

const determineContextFetchFinal = (state) => {
  const sitesFinal = (state.fetches.sites.status === FETCH_STATUS.SUCCESS)
    || (state.fetches.sites.status === FETCH_STATUS.ERROR);
  const bundlesFinal = (state.fetches.bundles.status === FETCH_STATUS.SUCCESS)
    || (state.fetches.bundles.status === FETCH_STATUS.ERROR);
  return sitesFinal && bundlesFinal;
};

/**
   Reducer
*/
const reducer = (state, action) => {
  // Always deep clone fetches as that's the main thing we care about
  // changing to trigger re-renders in the consumer.
  const newState = { ...state, fetches: cloneDeep(state.fetches) };
  switch (action.type) {
    case 'fetchCalled':
      if (!action.key || !state.fetches[action.key]) { return state; }
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

    case 'whenFinalCalled':
      return { ...newState, whenFinalCalled: true };

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
    const siteCode = site.siteCode || site.code || null;
    if (!siteCode) { return; }
    const localReference = sitesJSON[siteCode] || {};
    sitesObj[site.siteCode] = {
      siteCode,
      description: site.siteDescription || site.description || null,
      type: site.siteType || site.type || null,
      stateCode: site.stateCode || null,
      domainCode: site.domainCode || null,
      latitude: site.siteLatitude || site.latitude || null,
      longitude: site.siteLongitude || site.longitude || null,
      terrain: site.terrain || localReference.terrain || null,
      zoom: site.zoom || localReference.zoom || null,
    };
  });
  return sitesObj;
};

const defaultProps = {
  children: null,
  whenFinal: () => {},
};

/**
   Context Provider
*/
const Provider = (inProps) => {
  const props = resolveProps(defaultProps, inProps);
  const {
    children,
    whenFinal,
  } = props;

  const initialState = cloneDeep(DEFAULT_STATE);
  initialState.isActive = true;
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    isFinal,
    whenFinalCalled,
  } = state;

  // Subject and effect to perform and manage the sites GraphQL fetch
  const fetchMethods = {
    sites: () => {
      NeonGraphQL.getAllSites().pipe(
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
      ).subscribe();
    },
    bundles: () => {
      NeonApi.getProductBundlesObservable().pipe(
        map((response) => {
          const bundles = BundleParser.parseBundlesResponse(response);
          if (!existsNonEmpty(bundles)) {
            dispatch({ type: 'fetchBundlesFailed', error: 'malformed response' });
            return of(false);
          }
          const context = BundleParser.parseContext(bundles);
          dispatch({ type: 'fetchBundlesSucceeded', bundles: context });
          return of(true);
        }),
        catchError((error) => {
          dispatch({ type: 'fetchBundlesFailed', error: error.message });
          return of(false);
        }),
      ).subscribe();
    },
  };

  // Effect: Trigger all fetches that are awaiting call
  useEffect(() => {
    Object.keys(state.fetches).forEach((key) => {
      if (
        state.fetches[key].status !== FETCH_STATUS.AWAITING_CALL
          || typeof fetchMethods[key] !== 'function'
      ) { return; }
      dispatch({ type: 'fetchCalled', key });
      fetchMethods[key]();
    });
  });

  // Effect: call the whenFinal function prop exactly once when first finalized
  useEffect(() => {
    if (!isFinal || whenFinalCalled) { return; }
    whenFinal(cloneDeep({ ...state, whenFinalCalled: true }));
    dispatch({ type: 'whenFinalCalled' });
  }, [isFinal, whenFinalCalled, whenFinal, state]);

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

const ProviderPropTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string,
    ])),
    PropTypes.node,
    PropTypes.string,
  ]),
  whenFinal: PropTypes.func,
};
Provider.propTypes = ProviderPropTypes;

/**
   getWrappedComponent
*/
const getWrappedComponent = (Component) => (props) => {
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
  ProviderPropTypes,
};
export default NeonContext;

// Additional items exported for unit testing
export const getTestableItems = () => (
  process.env.NODE_ENV !== 'test' ? {} : {
    deriveRegionSites,
    parseSitesFetchResponse,
    reducer,
  }
);
