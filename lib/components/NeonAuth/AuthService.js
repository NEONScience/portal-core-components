import { Subject, of, map, catchError, delay, tap } from 'rxjs';
import SockJS from 'sockjs-client';
import { RxStomp } from '@stomp/rx-stomp';
import NeonApi from '../NeonApi';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import BrowserService from '../../util/browserUtil';
import { getJson } from '../../util/rxUtil';
import { exists, isStringNonEmpty } from '../../util/typeUtil';
import { AuthSilentType } from '../../types/core';
const REDIRECT_URI = 'redirectUri';
/**
 * Set of white listed paths that should redirect upon logout
 */ export const LOGOUT_REDIRECT_PATHS = [
    NeonEnvironment.route.account()
];
var AuthActionType = /*#__PURE__*/ function(AuthActionType) {
    AuthActionType["LOGIN"] = "LOGIN";
    AuthActionType["LOGOUT"] = "LOGOUT";
    return AuthActionType;
}(AuthActionType || {});
const factory = {
    createSilentIFrame: ()=>{
        const silentIFrame = document.createElement('iframe');
        silentIFrame.style.display = 'none';
        return silentIFrame;
    },
    createRxStompConfig: ()=>({
            webSocketFactory: ()=>new SockJS(NeonEnvironment.getFullAuthApiPath('ws', false)),
            reconnectDelay: 1000,
            connectHeaders: NeonApi.getApiTokenHeader(),
            disconnectHeaders: NeonApi.getApiTokenHeader()
        }),
    createRxStompClient: (config, dispatch, onConnectCbs)=>{
        const client = new RxStomp();
        client.configure(config);
        client.connected$.subscribe((state)=>{
            dispatch({
                type: 'setAuthWsConnected',
                isAuthWsConnected: true
            });
            if (onConnectCbs) {
                onConnectCbs.forEach((cb)=>{
                    if (typeof cb === 'function') cb();
                });
            }
        });
        client.stompClient.onDisconnect = ()=>{
            dispatch({
                type: 'setAuthWsConnected',
                isAuthWsConnected: false
            });
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
   */ createWorkingResolverSubscription: (service, state, dispatch, actionType, shouldRedirect)=>of(true).pipe(delay(15000), tap(()=>{
            if (shouldRedirect) {
                switch(actionType){
                    case "LOGIN":
                        service.login();
                        break;
                    case "LOGOUT":
                        service.logout();
                        break;
                    default:
                        break;
                }
                return;
            }
            dispatch({
                type: 'setAuthWorking',
                isAuthWorking: false
            });
            // Clean up iframe
            try {
                if (exists(state.silentIFrame)) {
                    document.body.removeChild(state.silentIFrame);
                    state.silentIFrame = undefined; // eslint-disable-line no-param-reassign
                }
            } catch (e) {
                console.error(e); // eslint-disable-line no-console
            }
            service.fetchUserInfoWithDispatch(dispatch, true);
        })).subscribe()
};
const state = {
    silentIFrame: undefined,
    rxStompClient: undefined,
    watchSubscription$: undefined,
    cancellationSubject$: new Subject(),
    loginCancellationSubject$: new Subject(),
    logoutCancellationSubject$: new Subject(),
    workingResolverSubscription$: undefined
};
const AuthService = {
    getState: ()=>state,
    allowSilentAuth: ()=>{
        if (NeonEnvironment.authDisableWs) {
            return false;
        }
        switch(NeonEnvironment.getAuthSilentType()){
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
    isAuthOnlyApp: ()=>[
            NeonEnvironment.route.account()
        ].indexOf(NeonEnvironment.getRouterBaseHomePath() || '') >= 0,
    getLoginRedirectUri: ()=>{
        const appHomePath = NeonEnvironment.getRouterBaseHomePath();
        const currentPath = window.location.pathname;
        const hasPath = isStringNonEmpty(currentPath) && currentPath.includes(appHomePath);
        return hasPath ? currentPath : undefined;
    },
    login: (path, redirectUriPath)=>{
        const env = NeonEnvironment;
        const rootPath = exists(path) ? path : env.getFullAuthPath('login');
        const appliedRedirectUri = exists(redirectUriPath) ? redirectUriPath : env.route.getFullRoute(env.getRouterBaseHomePath());
        const redirectUrl = `${window.location.protocol}//${window.location.host}${appliedRedirectUri}`;
        const href = `${rootPath}?${REDIRECT_URI}=${encodeURIComponent(redirectUrl)}`;
        window.location.href = href;
    },
    loginSilently: (dispatch, isSsoCheck, path, redirectUriPath)=>{
        // Until custom domains are implemented,
        // Safari does not support silent auth flow
        const allowSilent = AuthService.allowSilentAuth();
        if (isSsoCheck && !allowSilent) {
            return;
        }
        if (!allowSilent) {
            AuthService.login(path, redirectUriPath);
            return;
        }
        dispatch({
            type: 'setAuthWorking',
            isAuthWorking: true
        });
        state.workingResolverSubscription$ = factory.createWorkingResolverSubscription(AuthService, state, dispatch, "LOGIN", !isSsoCheck);
        getJson(NeonEnvironment.getFullAuthPath('silentLogin'), (response)=>{
            if (response && response.url) {
                state.silentIFrame = factory.createSilentIFrame();
                state.silentIFrame.src = response.url;
                document.body.appendChild(state.silentIFrame);
            } else {
                dispatch({
                    type: 'setAuthWorking',
                    isAuthWorking: false
                });
                AuthService.cancelWorkingResolver();
            }
        }, (error)=>{
            console.error(error); // eslint-disable-line no-console
            dispatch({
                type: 'setAuthWorking',
                isAuthWorking: false
            });
            AuthService.cancelWorkingResolver();
        }, state.loginCancellationSubject$, undefined, true);
    },
    logout: (path, redirectUriPath)=>{
        const env = NeonEnvironment;
        const rootPath = exists(path) ? path : env.getFullAuthPath('logout');
        const appliedRedirectUri = exists(redirectUriPath) ? redirectUriPath : env.route.getFullRoute(env.getRouterBaseHomePath());
        const redirectUrl = `${window.location.protocol}//${window.location.host}${appliedRedirectUri}`;
        const href = `${rootPath}?${REDIRECT_URI}=${encodeURIComponent(redirectUrl)}`;
        window.location.href = href;
    },
    logoutSilently: (dispatch, path, redirectUriPath)=>{
        // Until custom domains are implemented,
        // Safari does not support silent auth flow
        const allowSilent = AuthService.allowSilentAuth();
        if (!allowSilent) {
            AuthService.logout(path, redirectUriPath);
            return;
        }
        dispatch({
            type: 'setAuthWorking',
            isAuthWorking: true
        });
        state.workingResolverSubscription$ = factory.createWorkingResolverSubscription(AuthService, state, dispatch, "LOGOUT", true);
        getJson(NeonEnvironment.getFullAuthPath('silentLogout'), (response)=>{
            if (response && response.url) {
                state.silentIFrame = factory.createSilentIFrame();
                state.silentIFrame.src = response.url;
                document.body.appendChild(state.silentIFrame);
            } else {
                dispatch({
                    type: 'setAuthWorking',
                    isAuthWorking: false
                });
                AuthService.cancelWorkingResolver();
            }
        }, (error)=>{
            console.error(error); // eslint-disable-line no-console
            dispatch({
                type: 'setAuthWorking',
                isAuthWorking: false
            });
            AuthService.cancelWorkingResolver();
        }, state.logoutCancellationSubject$, undefined, true);
    },
    cancellationEmitter: ()=>{
        state.cancellationSubject$.next(true);
        state.cancellationSubject$.unsubscribe();
    },
    fetchUserInfo: (cb, errorCb)=>getJson(NeonEnvironment.getFullAuthPath('userInfo'), cb, errorCb, state.cancellationSubject$, undefined, true),
    fetchUserInfoWithDispatch: (dispatch, refreshSubscription)=>AuthService.fetchUserInfo((response)=>{
            dispatch({
                type: 'fetchAuthSucceeded',
                isAuthenticated: AuthService.isAuthenticated(response),
                response
            });
            if (refreshSubscription) {
                AuthService.refreshWatchAuth0Subscription(dispatch, true);
            }
        }, (error)=>{
            console.error(error); // eslint-disable-line no-console
            dispatch({
                type: 'fetchAuthFailed',
                error
            });
        }),
    isAuthenticated: (response)=>exists(response) && exists(response.data) && exists(response.data.user) && typeof response.data.user.user_id === 'string' && response.data.user.user_id.length > 0 && typeof response.data.user.email === 'string' && response.data.user.email.length > 0,
    isSsoLogin: (response)=>exists(response) && exists(response.data) && response.data.ssoLogin === true,
    parseUserData: (response)=>{
        if (!exists(response)) {
            return null;
        }
        return response;
    },
    watchAuth0: (dispatch, onConnectCbs)=>{
        // If the WS subscription is disabled, do not attempt to connect
        if (NeonEnvironment.authDisableWs || NeonEnvironment.getAuthSilentType() === AuthSilentType.DISABLED) {
            return state.watchSubscription$;
        }
        if (state.rxStompClient && state.watchSubscription$) {
            return state.watchSubscription$;
        }
        // Clean up any existing client
        if (state.rxStompClient) {
            AuthService.teardown();
        }
        const client = factory.createRxStompClient(factory.createRxStompConfig(), dispatch, onConnectCbs);
        const watchSubscription$ = client.watch(NeonEnvironment.authTopics.getAuth0()).pipe(map((message)=>{
            try {
                const authMessage = JSON.parse(message.body);
                if (authMessage && authMessage.success) {
                    if (authMessage.logout) {
                        // If successful logout and auth only app, redirect
                        if (AuthService.isAuthOnlyApp()) {
                            window.location.href = NeonEnvironment.route.buildHomeRoute();
                            return authMessage;
                        }
                        dispatch({
                            type: 'setAuthenticated',
                            isAuthenticated: false
                        });
                    }
                }
                // Clean up iframe
                if (exists(state.silentIFrame)) {
                    document.body.removeChild(state.silentIFrame);
                    state.silentIFrame = undefined;
                }
                // Re-fetching the user info will resolve any necessary auth state
                AuthService.fetchUserInfoWithDispatch(dispatch, true);
                dispatch({
                    type: 'setAuthWorking',
                    isAuthWorking: false
                });
                AuthService.cancelWorkingResolver();
                return authMessage;
            } catch (e) {
                console.error(e); // eslint-disable-line no-console
                return {
                    error: 'Failed to process WS message'
                };
            }
        }), catchError((error)=>{
            console.error(error); // eslint-disable-line no-console
            try {
                // Clean up iframe
                if (exists(state.silentIFrame)) {
                    document.body.removeChild(state.silentIFrame);
                    state.silentIFrame = undefined;
                }
                // In case of error state, always resubscribe to the WS
                AuthService.fetchUserInfoWithDispatch(dispatch, true);
                dispatch({
                    type: 'setAuthWorking',
                    isAuthWorking: false
                });
                AuthService.cancelWorkingResolver();
            } catch (e) {
                console.error(e); // eslint-disable-line no-console
            }
            return of(error);
        })).subscribe();
        state.rxStompClient = client;
        state.watchSubscription$ = watchSubscription$;
        return state.watchSubscription$;
    },
    teardown: ()=>{
        if (state.watchSubscription$) {
            state.watchSubscription$.unsubscribe();
            state.watchSubscription$ = undefined;
        }
        if (state.rxStompClient) {
            state.rxStompClient.deactivate();
            state.rxStompClient = undefined;
        }
    },
    refreshWatchAuth0Subscription: (dispatch, delayed)=>{
        const delayMs = delayed === true ? 300 : 0;
        of(true).pipe(delay(delayMs), tap(()=>{
            AuthService.teardown();
            AuthService.watchAuth0(dispatch);
        })).subscribe();
    },
    cancelWorkingResolver: ()=>{
        // If we've resolved the working state, cancel resolver
        if (typeof state.workingResolverSubscription$ !== 'undefined') {
            state.workingResolverSubscription$.unsubscribe();
            state.workingResolverSubscription$ = undefined;
        }
    }
};
Object.freeze(AuthService);
export default AuthService;
