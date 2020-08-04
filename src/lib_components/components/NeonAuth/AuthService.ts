import { Dispatch } from 'react';

import { Subscription, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import SockJS from 'sockjs-client';
import { Message } from '@stomp/stompjs';
import { RxStomp, RxStompConfig, RxStompState } from '@stomp/rx-stomp';

import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';

import { getJson } from '../../util/rxUtil';
import { exists } from '../../util/typeUtil'; /* eslint-disable-line */

const REDIRECT_URI: string = 'redirectUri';

type AnyVoidFunc = (p?: any) => void;

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
   * @return {Subscription} The RxJS subscription for the request
   */
  fetchUserInfoWithDispatch: (dispatch: Dispatch<any>) => Subscription;
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
  }),
  createRxStompClient: (
    config: RxStompConfig,
    dispatch: Dispatch<any>,
    onConnectCbs?: [AnyVoidFunc],
  ): RxStomp => {
    const client: RxStomp = new RxStomp();
    client.configure(config);
    /* eslint-disable-next-line no-unused-vars */
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
};

const state: IAuthServiceState = {
  silentIFrame: factory.createSilentIFrame(),
  rxStompClient: undefined,
  watchSubscription$: undefined,
  cancellationSubject$: new Subject(),
  loginCancellationSubject$: new Subject(),
  logoutCancellationSubject$: new Subject(),
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
    getJson(
      NeonEnvironment.getFullAuthPath('silentLogin'),
      (response: any): void => {
        if (response && response.url) {
          state.silentIFrame.src = response.url;
          document.body.appendChild(state.silentIFrame);
        } else {
          dispatch({ type: 'setAuthWorking', isAuthWorking: false });
        }
      },
      (error: any): void => {
        console.error(error); // eslint-disable-line no-console
        dispatch({ type: 'setAuthWorking', isAuthWorking: false });
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
    getJson(
      NeonEnvironment.getFullAuthPath('silentLogout'),
      (response: any): void => {
        if (response && response.url) {
          state.silentIFrame.src = response.url;
          document.body.appendChild(state.silentIFrame);
        }
      },
      (error: any): void => {
        console.error(error); // eslint-disable-line no-console
        dispatch({ type: 'setAuthWorking', isAuthWorking: false });
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
  fetchUserInfoWithDispatch: (dispatch: Dispatch<any>): Subscription => (
    AuthService.fetchUserInfo(
      (response: any): void => {
        dispatch({
          type: 'fetchAuthSucceeded',
          isAuthenticated: AuthService.isAuthenticated(response),
        });
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
      return state.watchSubscription$ as Subscription;
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
          AuthService.fetchUserInfoWithDispatch(dispatch);
          dispatch({ type: 'setAuthWorking', isAuthWorking: false });
          return authMessage;
        }),
        // @ts-ignore
        catchError((error: any) => {
          console.error(error); // eslint-disable-line no-console
          // Clean up iframe
          if (state.silentIFrame.src !== '') {
            document.body.removeChild(state.silentIFrame);
            state.silentIFrame.src = '';
          }
          dispatch({ type: 'setAuthWorking', isAuthWorking: false });
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
};

Object.freeze(AuthService);

export default AuthService;
