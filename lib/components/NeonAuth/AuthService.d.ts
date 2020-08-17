import { Dispatch } from 'react';
import { Subscription, Subject } from 'rxjs';
import { RxStomp } from '@stomp/rx-stomp';
import { AnyVoidFunc, Undef } from '../../types/core';
/**
 * Set of white listed paths that should redirect upon logout
 */
export declare const LOGOUT_REDIRECT_PATHS: string[];
interface IAuthServiceState {
    silentIFrame: Undef<HTMLIFrameElement>;
    rxStompClient: Undef<RxStomp>;
    watchSubscription$: Undef<Subscription>;
    cancellationSubject$: Subject<any>;
    loginCancellationSubject$: Subject<any>;
    logoutCancellationSubject$: Subject<any>;
    workingResolverSubscription$: Undef<Subscription>;
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
     * Initializes a login flow
     * @param {string} path - Optionally path to set for the root login URL
     */
    login: (path?: string) => void;
    /**
     * Performs a silent login flow
     * @param {Dispatch} dispatch - The NeonContext dispatch function
     * @param {boolean} isSsoCheck - Whether or not performaing an SSO check
     */
    loginSilently: (dispatch: Dispatch<any>, isSsoCheck: boolean) => void;
    /**
     * Initializes a logout flow
     * @param {string} path - Optionally path to set for the root logout URL
     */
    logout: (path?: string) => void;
    /**
     * Performs a silent logout flow
     * @param {Dispatch} dispatch - The NeonContext dispatch function
     *  upon logout
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
    fetchUserInfoWithDispatch: (dispatch: Dispatch<any>, refreshSubscription?: boolean) => Subscription;
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
declare const AuthService: IAuthService;
export default AuthService;
