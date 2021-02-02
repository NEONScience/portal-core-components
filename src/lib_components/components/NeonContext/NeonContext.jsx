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
import { ajax } from 'rxjs/ajax';

import REMOTE_ASSETS from '../../remoteAssetsMap/remoteAssetsMap';
import AuthService from '../NeonAuth/AuthService';
import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';
import sitesJSON from '../../staticJSON/sites.json';
import statesJSON from '../../staticJSON/states.json';
import domainsJSON from '../../staticJSON/domains.json';
import bundlesJSON from '../../staticJSON/bundles.json';
import timeSeriesDataProductsJSON from '../../staticJSON/timeSeriesDataProducts.json';

const DRUPAL_HEADER_HTML = REMOTE_ASSETS.DRUPAL_HEADER_HTML.KEY;
const DRUPAL_FOOTER_HTML = REMOTE_ASSETS.DRUPAL_FOOTER_HTML.KEY;

export const FETCH_STATUS = {
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
  html: {
    [DRUPAL_HEADER_HTML]: null,
    [DRUPAL_FOOTER_HTML]: null,
  },
  fetches: {
    sites: { status: FETCH_STATUS.AWAITING_CALL, error: null },
    auth: { status: null, error: null },
    [DRUPAL_HEADER_HTML]: { status: null, error: null },
    [DRUPAL_FOOTER_HTML]: { status: null, error: null },
  },
  auth: {
    useCore: false,
    isAuthenticated: false,
    isAuthWorking: false,
    isAuthWsConnected: false,
    userData: null,
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
    .filter(stateCode => !stateSites[stateCode])
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

/**
   Reducer
*/
const reducer = (state, action) => {
  // Always deep clone fetches as that's the main thing we care about
  // changing to trigger re-renders in the consumer.
  const newState = { ...state, fetches: cloneDeep(state.fetches) };
  const hasValidRemoteAsset = action.asset && Object.keys(REMOTE_ASSETS).includes(action.asset);
  switch (action.type) {
    case 'fetchCalled':
      if (!action.key || !state.fetches[action.key]) { return state; }
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
      newState.auth.userData = AuthService.parseUserData(action.response);
      return newState;
    case 'fetchAuthFailed':
      newState.fetches.auth.status = FETCH_STATUS.ERROR;
      newState.fetches.auth.error = action.error;
      newState.auth.isAuthenticated = false;
      newState.auth.userData = null;
      return newState;

    // Actions for handling remote assets
    case 'fetchHtmlSucceeded':
      if (!hasValidRemoteAsset) { return state; }
      newState.fetches[action.asset].status = FETCH_STATUS.SUCCESS;
      newState.html[action.asset] = action.html;
      return newState;
    case 'fetchHtmlFailed':
      if (!hasValidRemoteAsset) { return state; }
      newState.fetches[action.asset].status = FETCH_STATUS.ERROR;
      newState.fetches[action.asset].error = action.error;
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

/**
   Context Provider
*/
const Provider = (props) => {
  const {
    children,
    useCoreAuth,
    useCoreHeader,
    whenFinal,
  } = props;

  const initialState = cloneDeep(DEFAULT_STATE);
  initialState.isActive = true;
  if (useCoreAuth) {
    initialState.auth.useCore = true;
    initialState.fetches.auth.status = FETCH_STATUS.AWAITING_CALL;
  }
  if (!useCoreHeader) {
    initialState.fetches[DRUPAL_HEADER_HTML].status = FETCH_STATUS.AWAITING_CALL;
    initialState.fetches[DRUPAL_FOOTER_HTML].status = FETCH_STATUS.AWAITING_CALL;
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isFinal, whenFinalCalled } = state;

  // Method to sanitize partial HTML. As delivered presently there are some markup issues that
  // throw warnings when parsed with HTMLReactParser.
  const sanitizePartialHTML = (html) => html.replace(/ value=""/g, ' initialValue=""');

  // Method to fetch header and/or footer partials
  const fetchPartialHTML = (key) => {
    if (!Object.keys(REMOTE_ASSETS).includes(key)) { return; }
    const { url } = REMOTE_ASSETS[key];
    ajax({
      url,
      method: 'GET',
      responseType: 'text',
    }).pipe(
      map((response) => {
        dispatch({
          type: 'fetchHtmlSucceeded',
          asset: key,
          html: sanitizePartialHTML(response.response),
        });
        return of(true);
      }),
      catchError((error) => {
        dispatch({ type: 'fetchHtmlFailed', asset: key, error });
        return of(false);
      }),
    ).subscribe();
  };

  // Identify any cascading authentication fetches that require
  // the WS to be connected to initiate.
  const cascadeAuthFetches = [];

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
    auth: () => {
      AuthService.fetchUserInfo(
        (response) => {
          const isAuthenticated = AuthService.isAuthenticated(response);
          if (!isAuthenticated && AuthService.isSsoLogin(response)) {
            // If we're not authenticated and have identified another SSO
            // application that's authenticated, trigger a silent authentication
            // check flow.
            if (AuthService.allowSilentAuth()) {
              if (!state.auth.isAuthWsConnected) {
                cascadeAuthFetches.push(() => AuthService.loginSilently(dispatch, true));
              } else {
                AuthService.loginSilently(dispatch, true);
              }
            } else {
              AuthService.login();
            }
          } else {
            dispatch({ type: 'fetchAuthSucceeded', isAuthenticated, response });
          }
          // Initialize a subscription to the auth WS
          AuthService.watchAuth0(dispatch, cascadeAuthFetches);
        },
        (error) => {
          dispatch({ type: 'fetchAuthFailed', error });
          // Initialize a subscription to the auth WS
          AuthService.watchAuth0(dispatch, cascadeAuthFetches);
        },
      );
    },
    [DRUPAL_HEADER_HTML]: () => fetchPartialHTML(DRUPAL_HEADER_HTML),
    [DRUPAL_FOOTER_HTML]: () => fetchPartialHTML(DRUPAL_FOOTER_HTML),
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
  useCoreAuth: PropTypes.bool,
  useCoreHeader: PropTypes.bool,
  whenFinal: PropTypes.func,
};
Provider.propTypes = ProviderPropTypes;

Provider.defaultProps = {
  children: null,
  useCoreAuth: false,
  useCoreHeader: false,
  whenFinal: () => {},
};

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
    DRUPAL_HEADER_HTML,
    DRUPAL_FOOTER_HTML,
  }
);
