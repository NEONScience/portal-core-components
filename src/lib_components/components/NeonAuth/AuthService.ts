import { Dispatch } from 'react';

import {
  Subscription,
  Subject,
  of,
  map,
  catchError,
  delay,
  tap,
} from 'rxjs';

import SockJS from 'sockjs-client';
import { Message, StompHeaders } from '@stomp/stompjs';
import { RxStomp, RxStompConfig, RxStompState } from '@stomp/rx-stomp';

import NeonApi from '../NeonApi';
import NeonEnvironment, { INeonEnvironment } from '../NeonEnvironment/NeonEnvironment';

import BrowserService from '../../util/browserUtil';
import { getJson } from '../../util/rxUtil';
import { exists, isStringNonEmpty } from '../../util/typeUtil';
import { AnyVoidFunc, Undef, AuthSilentType } from '../../types/core';

const REDIRECT_URI: string = 'redirectUri';

/**
 * Set of white listed paths that should redirect upon logout
 */
export const LOGOUT_REDIRECT_PATHS: string[] = [
  NeonEnvironment.route.account() as string,
];

interface AuthMessage {
  login: boolean;
  logout: boolean;
  success: boolean;
  message: Undef<string>;
}

interface IAuthServiceState {
  silentIFrame: Undef<HTMLIFrameElement>;
  rxStompClient: Undef<RxStomp>;
  watchSubscription$: Undef<Subscription>;
  cancellationSubject$: Subject<any>;
  loginCancellationSubject$: Subject<any>;
  logoutCancellationSubject$: Subject<any>;
  workingResolverSubscription$: Undef<Subscription>;
}

enum AuthActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export interface IAuthService {
  /**
   * Returns the current auth service state
   * @return {IAuthServiceState} The current state of the service
   */
  getState: () => IAuthServiceState;
  /**
   * Determines if the slient auth flow is supported
   * @return {boolean} True if the silent auth flow is supported
   */
  allowSilentAuth: () => boolean;
  /**
   * Determines if the current application requires authentication for access.
   * @return {boolean}
   */
  isAuthOnlyApp: () => boolean;
  /**
   * Gets the redirect URI to send to the login endpoint.
   * @return {Undef<string>}
   */
  getLoginRedirectUri: () => Undef<string>;
  /**
   * Initializes a login flow
   * @param {string} path - Optionally path to set for the root login URL
   * @param {string} redirectUriPath - Optionally set the redirect path
   */
  login: (path?: string, redirectUriPath?: string) => void;
  /**
   * Performs a silent login flow
   * @param {Dispatch} dispatch - The NeonContext dispatch function
   * @param {boolean} isSsoCheck - Whether or not performaing an SSO check
   * @param {string} path - Fallback to optionally path to set for the
   *  root logout URL when defaulting to normal login flow.
   * @param {string} redirectUriPath - Fallback to optionally set the
   *  redirect path when defaulting to normal login flow.
   */
  loginSilently: (
    dispatch: Dispatch<any>,
    isSsoCheck: boolean,
    path?: string,
    redirectUriPath?: string,
  ) => void;
  /**
   * Initializes a logout flow
   * @param {string} path - Optionally path to set for the root logout URL
   * @param {string} redirectUriPath - Optionally set the redirect path
   */
  logout: (path?: string, redirectUriPath?: string) => void;
  /**
   * Performs a silent logout flow
   * @param {Dispatch} dispatch - The NeonContext dispatch function
   *  upon logout
   * @param {string} path - Fallback to optionally path to set for the
   *  root logout URL when defaulting to normal login flow.
   * @param {string} redirectUriPath - Fallback to optionally set the
   *  redirect path when defaulting to normal login flow.
   */
  logoutSilently: (
    dispatch: Dispatch<any>,
    path?: string,
    redirectUriPath?: string,
  ) => void;
  /**
   * Cancels the user info request
   */
  cancellationEmitter: () => void;
  /**
   * Fetches user info if authenticated from the auth API
   * @param {AnyVoidFunc} cb - The success callback
   * @param {AnyVoidFunc} errorCb = The error callback
   * @return {Subscription} The RxJS subscription for the request
   */
  fetchUserInfo: (cb: AnyVoidFunc, errorCb: AnyVoidFunc) => Subscription;
  /**
   * Fetches user info if authenticated from the auth API
   * and dispatches the appropriate NeonContext actions when completed
   * @param {Dispatch} dispatch - The NeonContext dispatch function
   * @param {boolean} refreshSubscription = Optionally refresh the WS subscription
   * @return {Subscription} The RxJS subscription for the request
   */
  fetchUserInfoWithDispatch: (
    dispatch: Dispatch<any>,
    refreshSubscription?: boolean
  ) => Subscription;
  /**
   * Parses the user info API response and determines the authenticated state
   * @param {any} response - The API response
   * @return {boolean} True if the user is authenticated
   */
  isAuthenticated: (response: any) => boolean;
  /**
   * Determines if the user info response designates an SSO Login
   * @param {any} response - The API response
   * @return {boolean} True if the user needs
   */
  isSsoLogin: (response: any) => boolean;
  /**
   * Parses user data from the API response
   * @param {any} response - The API response
   * @return {boolean} The resulting user data shape to store in state
   */
  parseUserData: (response: any) => any;

  /**
   * Watches the Auth0 topic via STOMP / WebSocket
   * @param {Dispatch} dispatch - The NeonContext dispatch function
   * @param {Array<AnyVoidFunc>} onConnectCbs - Set of callbacks to call when connected
   * @return {Subscription} The RxJS subscription for the RxStomp client
   */
  watchAuth0: (dispatch: Dispatch<any>, onConnectCbs?: [AnyVoidFunc]) => Subscription;
  /**
   * Teardown the STOMP / WebSocket connection and subscription
   */
  teardown: () => void;
  /**
   * Handles refreshing the watch Auth0 subscription.
   * @param {Dispatch} dispatch - The NeonContext dispatch function
   * @param {boolean} delayed - Optionally delay the refresh
   */
  refreshWatchAuth0Subscription: (dispatch: Dispatch<any>, delayed?: boolean) => void;
  /**
   * Cancels the working resolver subscription if active.
   */
  cancelWorkingResolver: () => void;
}

const factory = {
  createSilentIFrame: (): HTMLIFrameElement => {
    const silentIFrame = document.createElement('iframe');
    silentIFrame.style.display = 'none';
    return silentIFrame;
  },
  createRxStompConfig: (): RxStompConfig => ({
    webSocketFactory: (): any => new SockJS(NeonEnvironment.getFullAuthApiPath('ws', false)),
    reconnectDelay: 1000,
    connectHeaders: (NeonApi.getApiTokenHeader() as StompHeaders),
    disconnectHeaders: (NeonApi.getApiTokenHeader() as StompHeaders),
  }),
  createRxStompClient: (
    config: RxStompConfig,
    dispatch: Dispatch<any>,
    onConnectCbs?: [AnyVoidFunc],
  ): RxStomp => {
    const client: RxStomp = new RxStomp();
    client.configure(config);
    // eslint-disable-next-line no-unused-vars
    client.connected$.subscribe((state: RxStompState) => {
      dispatch({ type: 'setAuthWsConnected', isAuthWsConnected: true });
      if (onConnectCbs) {
        onConnectCbs.forEach((cb: AnyVoidFunc) => {
          if (typeof cb === 'function') cb();
        });
      }
    });
    client.stompClient.onDisconnect = () => {
      dispatch({ type: 'setAuthWsConnected', isAuthWsConnected: false });
    };
    client.activate();
    return client;
  },
  /**
   * Creates a subscription that will resolve any outstanding authentication
   * working state in case of error state that will not resolve appropriately.
   * Will resolve itself after 15 seconds if not already unsubscribed.
   * @param {AuthService} service - The AuthService to perform on
   * @param {IAuthServiceState} state - The state of the auth service
   * @param {Dispatch} dispatch - The NeonContext dispatch function
   * @param {AuthActionType} actionType - The type of action being performed
   * @param {boolean} shouldRedirect - Option to redirect when resolving
   * @return The RxJS Subscription
   */
  createWorkingResolverSubscription: (
    service: IAuthService,
    state: IAuthServiceState,
    dispatch: Dispatch<any>,
    actionType: AuthActionType,
    shouldRedirect: boolean,
  ): Subscription => (
    of(true)
      .pipe(
        delay(15000),
        tap(() => {
          if (shouldRedirect) {
            switch (actionType) {
              case AuthActionType.LOGIN:
                service.login();
                break;
              case AuthActionType.LOGOUT:
                service.logout();
                break;
              default:
                break;
            }
            return;
          }
          dispatch({ type: 'setAuthWorking', isAuthWorking: false });
          // Clean up iframe
          try {
            if (exists(state.silentIFrame)) {
              document.body.removeChild(state.silentIFrame as HTMLIFrameElement);
              state.silentIFrame = undefined; // eslint-disable-line no-param-reassign
            }
          } catch (e) {
            console.error(e); // eslint-disable-line no-console
          }
          service.fetchUserInfoWithDispatch(dispatch, true);
        }),
      )
      .subscribe()
  ),
};

const state: IAuthServiceState = {
  silentIFrame: undefined,
  rxStompClient: undefined,
  watchSubscription$: undefined,
  cancellationSubject$: new Subject(),
  loginCancellationSubject$: new Subject(),
  logoutCancellationSubject$: new Subject(),
  workingResolverSubscription$: undefined,
};

const AuthService: IAuthService = {
  getState: (): IAuthServiceState => state,
  allowSilentAuth: (): boolean => {
    if (NeonEnvironment.authDisableWs) {
      return false;
    }
    switch (NeonEnvironment.getAuthSilentType()) {
      case AuthSilentType.PREVENT_BROWSER:
        return !BrowserService.getIsSafari();
      case AuthSilentType.ALLOW_ALL:
        return true;
      case AuthSilentType.DISABLED:
      case AuthSilentType.PREVENT_ALL:
      default:
        return false;
    }
  },
  isAuthOnlyApp: (): boolean => (
    [
      NeonEnvironment.route.account(),
    ].indexOf(NeonEnvironment.getRouterBaseHomePath() || '') >= 0
  ),
  getLoginRedirectUri: (): Undef<string> => {
    const appHomePath: string = NeonEnvironment.getRouterBaseHomePath();
    const currentPath: string = window.location.pathname;
    const hasPath: boolean = isStringNonEmpty(currentPath) && currentPath.includes(appHomePath);
    return hasPath ? currentPath : undefined;
  },
  login: (path?: string, redirectUriPath?: string): void => {
    const env: INeonEnvironment = NeonEnvironment;
    const rootPath: string = exists(path)
      ? (path as string)
      : env.getFullAuthPath('login');
    const appliedRedirectUri = exists(redirectUriPath)
      ? redirectUriPath
      : env.route.getFullRoute(env.getRouterBaseHomePath());
    const redirectUrl = `${window.location.protocol}//${window.location.host}${appliedRedirectUri}`;
    const href = `${rootPath}?${REDIRECT_URI}=${encodeURIComponent(redirectUrl)}`;
    window.location.href = href;
  },
  loginSilently: (
    dispatch: Dispatch<any>,
    isSsoCheck: boolean,
    path?: string,
    redirectUriPath?: string,
  ): void => {
    // Until custom domains are implemented,
    // Safari does not support silent auth flow
    const allowSilent: boolean = AuthService.allowSilentAuth();
    if (isSsoCheck && !allowSilent) {
      return;
    }
    if (!allowSilent) {
      AuthService.login(path, redirectUriPath);
      return;
    }
    dispatch({ type: 'setAuthWorking', isAuthWorking: true });
    state.workingResolverSubscription$ = factory.createWorkingResolverSubscription(
      AuthService,
      state,
      dispatch,
      AuthActionType.LOGIN,
      !isSsoCheck,
    );
    getJson(
      NeonEnvironment.getFullAuthPath('silentLogin'),
      (response: any): void => {
        if (response && response.url) {
          state.silentIFrame = factory.createSilentIFrame();
          state.silentIFrame.src = response.url;
          document.body.appendChild(state.silentIFrame);
        } else {
          dispatch({ type: 'setAuthWorking', isAuthWorking: false });
          AuthService.cancelWorkingResolver();
        }
      },
      (error: any): void => {
        console.error(error); // eslint-disable-line no-console
        dispatch({ type: 'setAuthWorking', isAuthWorking: false });
        AuthService.cancelWorkingResolver();
      },
      state.loginCancellationSubject$,
      undefined,
      true,
    );
  },
  logout: (path?: string, redirectUriPath?: string): void => {
    const env: INeonEnvironment = NeonEnvironment;
    const rootPath: string = exists(path)
      ? (path as string)
      : env.getFullAuthPath('logout');
    const appliedRedirectUri = exists(redirectUriPath)
      ? redirectUriPath
      : env.route.getFullRoute(env.getRouterBaseHomePath());
    const redirectUrl = `${window.location.protocol}//${window.location.host}${appliedRedirectUri}`;
    const href = `${rootPath}?${REDIRECT_URI}=${encodeURIComponent(redirectUrl)}`;
    window.location.href = href;
  },
  logoutSilently: (
    dispatch: Dispatch<any>,
    path?: string,
    redirectUriPath?: string,
  ): void => {
    // Until custom domains are implemented,
    // Safari does not support silent auth flow
    const allowSilent: boolean = AuthService.allowSilentAuth();
    if (!allowSilent) {
      AuthService.logout(path, redirectUriPath);
      return;
    }
    dispatch({ type: 'setAuthWorking', isAuthWorking: true });
    state.workingResolverSubscription$ = factory.createWorkingResolverSubscription(
      AuthService,
      state,
      dispatch,
      AuthActionType.LOGOUT,
      true,
    );
    getJson(
      NeonEnvironment.getFullAuthPath('silentLogout'),
      (response: any): void => {
        if (response && response.url) {
          state.silentIFrame = factory.createSilentIFrame();
          state.silentIFrame.src = response.url;
          document.body.appendChild(state.silentIFrame);
        } else {
          dispatch({ type: 'setAuthWorking', isAuthWorking: false });
          AuthService.cancelWorkingResolver();
        }
      },
      (error: any): void => {
        console.error(error); // eslint-disable-line no-console
        dispatch({ type: 'setAuthWorking', isAuthWorking: false });
        AuthService.cancelWorkingResolver();
      },
      state.logoutCancellationSubject$,
      undefined,
      true,
    );
  },
  cancellationEmitter: (): void => {
    state.cancellationSubject$.next(true);
    state.cancellationSubject$.unsubscribe();
  },
  fetchUserInfo: (cb: AnyVoidFunc, errorCb: AnyVoidFunc): Subscription => (
    getJson(
      NeonEnvironment.getFullAuthPath('userInfo'),
      cb,
      errorCb,
      state.cancellationSubject$,
      undefined,
      true,
    )
  ),
  fetchUserInfoWithDispatch: (
    dispatch: Dispatch<any>,
    refreshSubscription?: boolean,
  ): Subscription => (
    AuthService.fetchUserInfo(
      (response: any): void => {
        dispatch({
          type: 'fetchAuthSucceeded',
          isAuthenticated: AuthService.isAuthenticated(response),
          response,
        });
        if (refreshSubscription) {
          AuthService.refreshWatchAuth0Subscription(dispatch, true);
        }
      },
      (error: any): void => {
        console.error(error); // eslint-disable-line no-console
        dispatch({ type: 'fetchAuthFailed', error });
      },
    )
  ),
  isAuthenticated: (response: any): boolean => (
    exists(response)
      && exists(response.data)
      && exists(response.data.user)
      && (typeof response.data.user.user_id === 'string')
      && (response.data.user.user_id.length > 0)
      && (typeof response.data.user.email === 'string')
      && (response.data.user.email.length > 0)
  ),
  isSsoLogin: (response: any): boolean => (
    exists(response)
      && exists(response.data)
      && (response.data.ssoLogin === true)
  ),
  parseUserData: (response: any): any => {
    if (!exists(response)) {
      return null;
    }
    return response;
  },

  watchAuth0: (dispatch: Dispatch<any>, onConnectCbs?: [AnyVoidFunc]): Subscription => {
    // If the WS subscription is disabled, do not attempt to connect
    if (NeonEnvironment.authDisableWs
        || (NeonEnvironment.getAuthSilentType() === AuthSilentType.DISABLED)) {
      return (state.watchSubscription$ as Subscription);
    }
    if (state.rxStompClient && state.watchSubscription$) {
      return (state.watchSubscription$ as Subscription);
    }
    // Clean up any existing client
    if (state.rxStompClient) {
      AuthService.teardown();
    }
    const client: RxStomp = factory.createRxStompClient(
      factory.createRxStompConfig(),
      dispatch,
      onConnectCbs,
    );
    const watchSubscription$: Subscription = client
      .watch(NeonEnvironment.authTopics.getAuth0() as string)
      .pipe(
        map((message: Message) => {
          try {
            const authMessage: AuthMessage = JSON.parse(message.body);
            if (authMessage && authMessage.success) {
              if (authMessage.logout) {
                // If successful logout and auth only app, redirect
                if (AuthService.isAuthOnlyApp()) {
                  window.location.href = NeonEnvironment.route.buildHomeRoute();
                  return authMessage;
                }
                dispatch({ type: 'setAuthenticated', isAuthenticated: false });
              }
            }
            // Clean up iframe
            if (exists(state.silentIFrame)) {
              document.body.removeChild(state.silentIFrame as HTMLIFrameElement);
              state.silentIFrame = undefined;
            }
            // Re-fetching the user info will resolve any necessary auth state
            AuthService.fetchUserInfoWithDispatch(dispatch, true);
            dispatch({ type: 'setAuthWorking', isAuthWorking: false });
            AuthService.cancelWorkingResolver();
            return authMessage;
          } catch (e) {
            console.error(e); // eslint-disable-line no-console
            return {
              error: 'Failed to process WS message',
            };
          }
        }),
        // @ts-ignore
        catchError((error: any) => {
          console.error(error); // eslint-disable-line no-console
          try {
            // Clean up iframe
            if (exists(state.silentIFrame)) {
              document.body.removeChild(state.silentIFrame as HTMLIFrameElement);
              state.silentIFrame = undefined;
            }
            // In case of error state, always resubscribe to the WS
            AuthService.fetchUserInfoWithDispatch(dispatch, true);
            dispatch({ type: 'setAuthWorking', isAuthWorking: false });
            AuthService.cancelWorkingResolver();
          } catch (e) {
            console.error(e); // eslint-disable-line no-console
          }
        }),
      )
      .subscribe();
    state.rxStompClient = client;
    state.watchSubscription$ = watchSubscription$;
    return state.watchSubscription$;
  },
  teardown: (): void => {
    if (state.watchSubscription$) {
      state.watchSubscription$.unsubscribe();
      state.watchSubscription$ = undefined;
    }
    if (state.rxStompClient) {
      state.rxStompClient.deactivate();
      state.rxStompClient = undefined;
    }
  },
  refreshWatchAuth0Subscription: (dispatch: Dispatch<any>, delayed?: boolean): void => {
    const delayMs: number = (delayed === true)
      ? 300
      : 0;
    of(true)
      .pipe(
        delay(delayMs),
        tap(() => {
          AuthService.teardown();
          AuthService.watchAuth0(dispatch);
        }),
      )
      .subscribe();
  },
  cancelWorkingResolver: (): void => {
    // If we've resolved the working state, cancel resolver
    if (typeof state.workingResolverSubscription$ !== 'undefined') {
      state.workingResolverSubscription$.unsubscribe();
      state.workingResolverSubscription$ = undefined;
    }
  },
};

Object.freeze(AuthService);

export default AuthService;
