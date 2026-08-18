import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import cloneDeep from 'lodash/cloneDeep';

import AuthService from '../NeonAuth/AuthService';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import BroadcastChannelService from '../../service/BroadcastChannelService';
import { exists, existsNonEmpty, isStringNonEmpty } from '../../util/typeUtil';
import { resolveProps } from '../../util/defaultProps';
import { useDocumentVisibleStatus, useNetworkOnlineStatus } from '../../hooks/customHooks';

export const FETCH_STATUS = {
  AWAITING_CALL: 'AWAITING_CALL',
  FETCHING: 'FETCHING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
};

const DEFAULT_STATE = {
  fetches: {
    auth: { status: FETCH_STATUS.AWAITING_CALL, error: null },
  },
  auth: {
    useCore: true,
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

/**
   CONTEXT
*/
const Context = createContext(DEFAULT_STATE);

/**
   HOOK
*/
const useNeonAuthContextState = () => {
  const hookResponse = useContext(Context);
  // If called by a component that's not inside a NeonAuthContext the hookResponse will be
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

const deriveNeonAuthContextSessionState = ({ isFinal, isAuthenticated, userData }) => {
  if (NeonEnvironment.sessionDisable) {
    return {
      enabled: false,
      ready: true,
      authenticated: true,
      accountValidated: true,
      accountValidationSteps: [],
      canAccessData: true,
      sessionHeaders: {},
    };
  }
  const appliedIsAuthenticated = (isAuthenticated === true);
  let token = null;
  let canAccessData = false;
  let accountValidated = false;
  let accountValidationSteps = [];
  if (appliedIsAuthenticated && exists(userData) && exists(userData.data)) {
    token = userData.token;
    canAccessData = userData.data.canAccessData === true;
    accountValidated = userData.data.accountValidated === true;
    accountValidationSteps = existsNonEmpty(userData.data.accountValidationSteps)
      ? userData.data.accountValidationSteps
      : [];
  }
  if (!isFinal) {
    return {
      enabled: true,
      ready: false,
      authenticated: appliedIsAuthenticated,
      accountValidated,
      accountValidationSteps,
      canAccessData,
      sessionHeaders: {},
    };
  }
  const appliedToken = appliedIsAuthenticated ? token : null;
  if (isStringNonEmpty(appliedToken)) {
    const sessionHeaderName = NeonEnvironment.getApiSessionTokenHeader();
    if (isStringNonEmpty(sessionHeaderName)) {
      return {
        enabled: true,
        ready: true,
        authenticated: appliedIsAuthenticated,
        accountValidated,
        accountValidationSteps,
        canAccessData,
        sessionHeaders: {
          [sessionHeaderName]: appliedToken,
        },
      };
    }
  }
  return {
    enabled: true,
    ready: true,
    authenticated: appliedIsAuthenticated,
    accountValidated,
    accountValidationSteps,
    canAccessData,
    sessionHeaders: {},
  };
};

const useNeonAuthContextSessionState = () => {
  const [
    {
      isFinal,
      auth: {
        isAuthenticated,
        userData,
      },
    },
  ] = useNeonAuthContextState();
  return deriveNeonAuthContextSessionState({
    isFinal,
    isAuthenticated,
    userData,
  });
};

const determineContextFetchFinal = (state) => {
  const authFinal = !state.auth.useCore
    || ((state.fetches.auth.status === FETCH_STATUS.SUCCESS)
      || (state.fetches.auth.status === FETCH_STATUS.ERROR));
  return authFinal;
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
    case 'setAuthenticated':
      newState.auth.isAuthenticated = !!action.isAuthenticated;
      if (action.clearUserData === true) {
        newState.auth.userData = null;
      }
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
      newState.isFinal = determineContextFetchFinal(newState);
      return newState;
    case 'fetchAuthFailed':
      newState.fetches.auth.status = FETCH_STATUS.ERROR;
      newState.fetches.auth.error = action.error;
      newState.auth.isAuthenticated = false;
      newState.auth.userData = null;
      newState.isFinal = determineContextFetchFinal(newState);
      return newState;
    case 'setPingSessionLogout':
      // Bind this ping action to the session token that it was initialized
      // with and prevent from overwriting another session
      if (action.sessionToken !== state.auth.userData?.token) {
        return newState;
      }
      newState.auth.isAuthenticated = false;
      newState.auth.userData = null;
      return newState;

    case 'whenFinalCalled':
      return { ...newState, whenFinalCalled: true };

    default:
      return state;
  }
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
  const isNetworkOnline = useNetworkOnlineStatus();
  const isDocumentVisible = useDocumentVisibleStatus();

  const {
    isFinal,
    whenFinalCalled,
    auth: {
      isAuthenticated: stateIsAuthenticated,
      isAuthWorking,
      userData,
    },
  } = state;
  const sessionState = deriveNeonAuthContextSessionState({
    isFinal,
    isAuthenticated: stateIsAuthenticated,
    userData,
  });
  const preconditionsSatisfied = sessionState.ready;
  const appliedSessionToken = userData?.token;
  useEffect(() => {
    if (
      NeonEnvironment.sessionDisable
      || NeonEnvironment.sessionDisablePing
      || !preconditionsSatisfied
      || !isNetworkOnline
      || !isDocumentVisible
      || isAuthWorking
      || !stateIsAuthenticated
      || !isStringNonEmpty(appliedSessionToken)
    ) {
      return () => {};
    }
    const pingSubscription$ = AuthService.pingSession(
      dispatch,
      sessionState.sessionHeaders,
      appliedSessionToken,
    );
    return () => {
      pingSubscription$.unsubscribe();
    };
  }, [
    preconditionsSatisfied,
    isNetworkOnline,
    isDocumentVisible,
    stateIsAuthenticated,
    isAuthWorking,
    sessionState,
    appliedSessionToken,
  ]);

  useEffect(() => {
    const authBroadcastChannelMessageHandler = (e) => {
      if (stateIsAuthenticated) {
        if (exists(e) && exists(e.data) && isStringNonEmpty(e.data.event)) {
          if (e.data.event === 'account-data-changed') {
            AuthService.handleLoginMessageFromBroadcastChannel(dispatch);
          }
        }
        return;
      }
      AuthService.handleLoginMessageFromBroadcastChannel(dispatch);
    };
    BroadcastChannelService.addAuthChannelMessageEventListener(authBroadcastChannelMessageHandler);
    return () => {
      BroadcastChannelService.removeAuthChannelMessageEventListener(
        authBroadcastChannelMessageHandler,
      );
    };
  }, [dispatch, stateIsAuthenticated]);

  // Identify any cascading authentication fetches that require
  // the WS to be connected to initiate.
  const cascadeAuthFetches = [];
  const fetchMethods = {
    auth: () => {
      if (NeonEnvironment.auth0DisableApi) {
        dispatch({ type: 'fetchAuthSucceeded', isAuthenticated: false, response: null });
        return;
      }
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
              dispatch({ type: 'fetchAuthSucceeded', isAuthenticated, response });
            }
          } else {
            dispatch({ type: 'fetchAuthSucceeded', isAuthenticated, response });
          }
          // Send login notification when authenticated
          if (isAuthenticated) {
            BroadcastChannelService.sendLoginMessage();
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
  const [{ isActive }] = useNeonAuthContextState();
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
const NeonAuthContext = {
  Provider,
  useNeonAuthContextState,
  useNeonAuthContextSessionState,
  DEFAULT_STATE,
  getWrappedComponent,
  ProviderPropTypes,
};
export default NeonAuthContext;

// Additional items exported for unit testing
export const getTestableItems = () => (
  process.env.NODE_ENV !== 'test' ? {} : {
    reducer,
  }
);
