import { Dispatch } from 'react';

import { Subscription, Subject, of } from 'rxjs';
import {
  map,
  catchError,
  delay,
  tap,
} from 'rxjs/operators';

import SockJS from 'sockjs-client';
import { Message, StompHeaders } from '@stomp/stompjs';
import { RxStomp, RxStompConfig, RxStompState } from '@stomp/rx-stomp';

import NeonApi from '../NeonApi';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';

import { getJson } from '../../util/rxUtil';
import { exists } from '../../util/typeUtil';
import { AnyVoidFunc } from '../../types/core';

const REDIRECT_URI: string = 'redirectUri';

interface AuthMessage {
  login: boolean;
  logout: boolean;
  success: boolean;
  message: string | undefined;
}

interface IAuthServiceState {
  silentIFrame: HTMLIFrameElement;
  rxStompClient: RxStomp | undefined;
  watchSubscription$: Subscription | undefined;
  cancellationSubject$: Subject<any>;
  loginCancellationSubject$: Subject<any>;
  logoutCancellationSubject$: Subject<any>;
  workingResolverSubscription$: Subscription | undefined;
}

export interface IAuthService {
  /**
   * Returns the current auth service state
   * @return {IAuthServiceState} The current state of the service
   */
  getState: () => IAuthServiceState;
  /**
   * Initializes a login flow
   * @param {string} path - Optionally path to set for the root login URL
   */
  login: (path?: string) => void;
  /**
   * Performs a silent login flow
   * @param {Dispatch} dispatch - The NeonContext dispatch function
   */
  loginSilently: (dispatch: Dispatch<any>) => void;
  /**
   * Initializes a logout flow
   * @param {string} path - Optionally path to set for the root logout URL
   */
  logout: (path?: string) => void;
  /**
   * Performs a silent logout flow
   * @param {Dispatch} dispatch - The NeonContext dispatch function
   */
  logoutSilently: (dispatch: Dispatch<any>) => void;
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
   * @return {boolean} True if the user is authenticated
   */
  isAuthenticated: (response: any) => boolean;
  /**
   * Determines if the user info response designates an SSO Login
   * @return {boolean} True if the user needs
   */
  isSsoLogin: (response: any) => boolean;

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
    reconnectDelay: 200,
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
   * Will resolve itself after 30 seconds if not already unsubscribed.
   * @param {AuthService} - The AuthService to perform on
   * @param {IAuthServiceState} - The state of the auth service
   * @param {Dispatch} dispatch - The NeonContext dispatch function
   * @return The RxJS Subscription
   */
  createWorkingResolverSubscription: (
    service: IAuthService,
    state: IAuthServiceState,
    dispatch: Dispatch<any>,
  ): Subscription => (
    of(true)
      .pipe(
        delay(30000),
        tap(() => {
          dispatch({ type: 'setAuthWorking', isAuthWorking: false });
          // Clean up iframe
          try {
            if (state.silentIFrame.src !== '') {
              document.body.removeChild(state.silentIFrame);
              state.silentIFrame.src = ''; // eslint-disable-line no-param-reassign
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
  silentIFrame: factory.createSilentIFrame(),
  rxStompClient: undefined,
  watchSubscription$: undefined,
  cancellationSubject$: new Subject(),
  loginCancellationSubject$: new Subject(),
  logoutCancellationSubject$: new Subject(),
  workingResolverSubscription$: undefined,
};

const AuthService: IAuthService = {
  getState: (): IAuthServiceState => state,
  login: (path?: string): void => {
    const env: any = NeonEnvironment;
    const rootPath: string = exists(path)
      ? path
      : env.getFullAuthPath('login');
    window.location.href = `${rootPath}
      ?${REDIRECT_URI}=${env.route.getFullRoute(env.getRouterBaseHomePath())}`;
  },
  loginSilently: (dispatch: Dispatch<any>): void => {
    dispatch({ type: 'setAuthWorking', isAuthWorking: true });
    state.workingResolverSubscription$ = factory.createWorkingResolverSubscription(
      AuthService,
      state,
      dispatch,
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
    );
  },
  logout: (path?: string): void => {
    const env: any = NeonEnvironment;
    const rootPath: string = exists(path)
      ? path
      : env.getFullAuthPath('logout');
    window.location.href = `${rootPath}
      ?${REDIRECT_URI}=${env.getHost()}${env.route.getFullRoute(env.getRouterBaseHomePath())}`;
  },
  logoutSilently: (dispatch: Dispatch<any>): void => {
    dispatch({ type: 'setAuthWorking', isAuthWorking: true });
    state.workingResolverSubscription$ = factory.createWorkingResolverSubscription(
      AuthService,
      state,
      dispatch,
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
    );
  },
  cancellationEmitter: (): void => {
    state.cancellationSubject$.next(true);
    state.cancellationSubject$.unsubscribe();
  },
  fetchUserInfo: (cb: AnyVoidFunc, errorCb: AnyVoidFunc): Subscription => (
    getJson(NeonEnvironment.getFullAuthPath('userInfo'), cb, errorCb, state.cancellationSubject$)
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

  watchAuth0: (dispatch: Dispatch<any>, onConnectCbs?: [AnyVoidFunc]): Subscription => {
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
          const authMessage: AuthMessage = JSON.parse(message.body);
          if (authMessage && authMessage.success) {
            if (authMessage.logout) {
              dispatch({ type: 'setAuthenticated', isAuthenticated: false });
            }
          }
          // Clean up iframe
          if (state.silentIFrame.src !== '') {
            document.body.removeChild(state.silentIFrame);
            state.silentIFrame.src = '';
          }
          // Re-fetching the user info will resolve any necessary auth state
          AuthService.fetchUserInfoWithDispatch(dispatch, true);
          dispatch({ type: 'setAuthWorking', isAuthWorking: false });
          AuthService.cancelWorkingResolver();
          return authMessage;
        }),
        // @ts-ignore
        catchError((error: any) => {
          console.error(error); // eslint-disable-line no-console
          try {
            // Clean up iframe
            if (state.silentIFrame.src !== '') {
              document.body.removeChild(state.silentIFrame);
              state.silentIFrame.src = '';
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
