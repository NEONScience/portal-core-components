"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.LOGOUT_REDIRECT_PATHS = void 0;
var _rxjs = require("rxjs");
var _sockjsClient = _interopRequireDefault(require("sockjs-client"));
var _rxStomp = require("@stomp/rx-stomp");
var _NeonApi = _interopRequireDefault(require("../NeonApi"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _browserUtil = _interopRequireDefault(require("../../util/browserUtil"));
var _rxUtil = require("../../util/rxUtil");
var _typeUtil = require("../../util/typeUtil");
var _core = require("../../types/core");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var REDIRECT_URI = 'redirectUri';

/**
 * Set of white listed paths that should redirect upon logout
 */
var LOGOUT_REDIRECT_PATHS = [_NeonEnvironment.default.route.account()];
exports.LOGOUT_REDIRECT_PATHS = LOGOUT_REDIRECT_PATHS;
var AuthActionType;
(function (AuthActionType) {
  AuthActionType["LOGIN"] = "LOGIN";
  AuthActionType["LOGOUT"] = "LOGOUT";
})(AuthActionType || (AuthActionType = {}));
var factory = {
  createSilentIFrame: function createSilentIFrame() {
    var silentIFrame = document.createElement('iframe');
    silentIFrame.style.display = 'none';
    return silentIFrame;
  },
  createRxStompConfig: function createRxStompConfig() {
    return {
      webSocketFactory: function webSocketFactory() {
        return new _sockjsClient.default(_NeonEnvironment.default.getFullAuthApiPath('ws', false));
      },
      reconnectDelay: 1000,
      connectHeaders: _NeonApi.default.getApiTokenHeader(),
      disconnectHeaders: _NeonApi.default.getApiTokenHeader()
    };
  },
  createRxStompClient: function createRxStompClient(config, dispatch, onConnectCbs) {
    var client = new _rxStomp.RxStomp();
    client.configure(config);
    // eslint-disable-next-line no-unused-vars
    client.connected$.subscribe(function (state) {
      dispatch({
        type: 'setAuthWsConnected',
        isAuthWsConnected: true
      });
      if (onConnectCbs) {
        onConnectCbs.forEach(function (cb) {
          if (typeof cb === 'function') cb();
        });
      }
    });
    client.stompClient.onDisconnect = function () {
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
   */
  createWorkingResolverSubscription: function createWorkingResolverSubscription(service, state, dispatch, actionType, shouldRedirect) {
    return (0, _rxjs.of)(true).pipe((0, _rxjs.delay)(15000), (0, _rxjs.tap)(function () {
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
      dispatch({
        type: 'setAuthWorking',
        isAuthWorking: false
      });
      // Clean up iframe
      try {
        if ((0, _typeUtil.exists)(state.silentIFrame)) {
          document.body.removeChild(state.silentIFrame);
          state.silentIFrame = undefined; // eslint-disable-line no-param-reassign
        }
      } catch (e) {
        console.error(e); // eslint-disable-line no-console
      }

      service.fetchUserInfoWithDispatch(dispatch, true);
    })).subscribe();
  }
};
var state = {
  silentIFrame: undefined,
  rxStompClient: undefined,
  watchSubscription$: undefined,
  cancellationSubject$: new _rxjs.Subject(),
  loginCancellationSubject$: new _rxjs.Subject(),
  logoutCancellationSubject$: new _rxjs.Subject(),
  workingResolverSubscription$: undefined
};
var AuthService = {
  getState: function getState() {
    return state;
  },
  allowSilentAuth: function allowSilentAuth() {
    if (_NeonEnvironment.default.authDisableWs) {
      return false;
    }
    switch (_NeonEnvironment.default.getAuthSilentType()) {
      case _core.AuthSilentType.PREVENT_BROWSER:
        return !_browserUtil.default.getIsSafari();
      case _core.AuthSilentType.ALLOW_ALL:
        return true;
      case _core.AuthSilentType.DISABLED:
      case _core.AuthSilentType.PREVENT_ALL:
      default:
        return false;
    }
  },
  isAuthOnlyApp: function isAuthOnlyApp() {
    return [_NeonEnvironment.default.route.account()].indexOf(_NeonEnvironment.default.getRouterBaseHomePath() || '') >= 0;
  },
  getLoginRedirectUri: function getLoginRedirectUri() {
    var appHomePath = _NeonEnvironment.default.getRouterBaseHomePath();
    var currentPath = window.location.pathname;
    var hasPath = (0, _typeUtil.isStringNonEmpty)(currentPath) && currentPath.includes(appHomePath);
    return hasPath ? currentPath : undefined;
  },
  login: function login(path, redirectUriPath) {
    var env = _NeonEnvironment.default;
    var rootPath = (0, _typeUtil.exists)(path) ? path : env.getFullAuthPath('login');
    var appliedRedirectUri = (0, _typeUtil.exists)(redirectUriPath) ? redirectUriPath : env.route.getFullRoute(env.getRouterBaseHomePath());
    var redirectUrl = "".concat(window.location.protocol, "//").concat(window.location.host).concat(appliedRedirectUri);
    var href = "".concat(rootPath, "?").concat(REDIRECT_URI, "=").concat(encodeURIComponent(redirectUrl));
    window.location.href = href;
  },
  loginSilently: function loginSilently(dispatch, isSsoCheck, path, redirectUriPath) {
    // Until custom domains are implemented,
    // Safari does not support silent auth flow
    var allowSilent = AuthService.allowSilentAuth();
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
    state.workingResolverSubscription$ = factory.createWorkingResolverSubscription(AuthService, state, dispatch, AuthActionType.LOGIN, !isSsoCheck);
    (0, _rxUtil.getJson)(_NeonEnvironment.default.getFullAuthPath('silentLogin'), function (response) {
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
    }, function (error) {
      console.error(error); // eslint-disable-line no-console
      dispatch({
        type: 'setAuthWorking',
        isAuthWorking: false
      });
      AuthService.cancelWorkingResolver();
    }, state.loginCancellationSubject$, undefined, true);
  },
  logout: function logout(path, redirectUriPath) {
    var env = _NeonEnvironment.default;
    var rootPath = (0, _typeUtil.exists)(path) ? path : env.getFullAuthPath('logout');
    var appliedRedirectUri = (0, _typeUtil.exists)(redirectUriPath) ? redirectUriPath : env.route.getFullRoute(env.getRouterBaseHomePath());
    var redirectUrl = "".concat(window.location.protocol, "//").concat(window.location.host).concat(appliedRedirectUri);
    var href = "".concat(rootPath, "?").concat(REDIRECT_URI, "=").concat(encodeURIComponent(redirectUrl));
    window.location.href = href;
  },
  logoutSilently: function logoutSilently(dispatch, path, redirectUriPath) {
    // Until custom domains are implemented,
    // Safari does not support silent auth flow
    var allowSilent = AuthService.allowSilentAuth();
    if (!allowSilent) {
      AuthService.logout(path, redirectUriPath);
      return;
    }
    dispatch({
      type: 'setAuthWorking',
      isAuthWorking: true
    });
    state.workingResolverSubscription$ = factory.createWorkingResolverSubscription(AuthService, state, dispatch, AuthActionType.LOGOUT, true);
    (0, _rxUtil.getJson)(_NeonEnvironment.default.getFullAuthPath('silentLogout'), function (response) {
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
    }, function (error) {
      console.error(error); // eslint-disable-line no-console
      dispatch({
        type: 'setAuthWorking',
        isAuthWorking: false
      });
      AuthService.cancelWorkingResolver();
    }, state.logoutCancellationSubject$, undefined, true);
  },
  cancellationEmitter: function cancellationEmitter() {
    state.cancellationSubject$.next(true);
    state.cancellationSubject$.unsubscribe();
  },
  fetchUserInfo: function fetchUserInfo(cb, errorCb) {
    return (0, _rxUtil.getJson)(_NeonEnvironment.default.getFullAuthPath('userInfo'), cb, errorCb, state.cancellationSubject$, undefined, true);
  },
  fetchUserInfoWithDispatch: function fetchUserInfoWithDispatch(dispatch, refreshSubscription) {
    return AuthService.fetchUserInfo(function (response) {
      dispatch({
        type: 'fetchAuthSucceeded',
        isAuthenticated: AuthService.isAuthenticated(response),
        response: response
      });
      if (refreshSubscription) {
        AuthService.refreshWatchAuth0Subscription(dispatch, true);
      }
    }, function (error) {
      console.error(error); // eslint-disable-line no-console
      dispatch({
        type: 'fetchAuthFailed',
        error: error
      });
    });
  },
  isAuthenticated: function isAuthenticated(response) {
    return (0, _typeUtil.exists)(response) && (0, _typeUtil.exists)(response.data) && (0, _typeUtil.exists)(response.data.user) && typeof response.data.user.user_id === 'string' && response.data.user.user_id.length > 0 && typeof response.data.user.email === 'string' && response.data.user.email.length > 0;
  },
  isSsoLogin: function isSsoLogin(response) {
    return (0, _typeUtil.exists)(response) && (0, _typeUtil.exists)(response.data) && response.data.ssoLogin === true;
  },
  parseUserData: function parseUserData(response) {
    if (!(0, _typeUtil.exists)(response)) {
      return null;
    }
    return response;
  },
  watchAuth0: function watchAuth0(dispatch, onConnectCbs) {
    // If the WS subscription is disabled, do not attempt to connect
    if (_NeonEnvironment.default.authDisableWs || _NeonEnvironment.default.getAuthSilentType() === _core.AuthSilentType.DISABLED) {
      return state.watchSubscription$;
    }
    if (state.rxStompClient && state.watchSubscription$) {
      return state.watchSubscription$;
    }
    // Clean up any existing client
    if (state.rxStompClient) {
      AuthService.teardown();
    }
    var client = factory.createRxStompClient(factory.createRxStompConfig(), dispatch, onConnectCbs);
    var watchSubscription$ = client.watch(_NeonEnvironment.default.authTopics.getAuth0()).pipe((0, _rxjs.map)(function (message) {
      try {
        var authMessage = JSON.parse(message.body);
        if (authMessage && authMessage.success) {
          if (authMessage.logout) {
            // If successful logout and auth only app, redirect
            if (AuthService.isAuthOnlyApp()) {
              window.location.href = _NeonEnvironment.default.route.buildHomeRoute();
              return authMessage;
            }
            dispatch({
              type: 'setAuthenticated',
              isAuthenticated: false
            });
          }
        }
        // Clean up iframe
        if ((0, _typeUtil.exists)(state.silentIFrame)) {
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
    }),
    // @ts-ignore
    (0, _rxjs.catchError)(function (error) {
      console.error(error); // eslint-disable-line no-console
      try {
        // Clean up iframe
        if ((0, _typeUtil.exists)(state.silentIFrame)) {
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
    })).subscribe();
    state.rxStompClient = client;
    state.watchSubscription$ = watchSubscription$;
    return state.watchSubscription$;
  },
  teardown: function teardown() {
    if (state.watchSubscription$) {
      state.watchSubscription$.unsubscribe();
      state.watchSubscription$ = undefined;
    }
    if (state.rxStompClient) {
      state.rxStompClient.deactivate();
      state.rxStompClient = undefined;
    }
  },
  refreshWatchAuth0Subscription: function refreshWatchAuth0Subscription(dispatch, delayed) {
    var delayMs = delayed === true ? 300 : 0;
    (0, _rxjs.of)(true).pipe((0, _rxjs.delay)(delayMs), (0, _rxjs.tap)(function () {
      AuthService.teardown();
      AuthService.watchAuth0(dispatch);
    })).subscribe();
  },
  cancelWorkingResolver: function cancelWorkingResolver() {
    // If we've resolved the working state, cancel resolver
    if (typeof state.workingResolverSubscription$ !== 'undefined') {
      state.workingResolverSubscription$.unsubscribe();
      state.workingResolverSubscription$ = undefined;
    }
  }
};
Object.freeze(AuthService);
var _default = AuthService;
exports.default = _default;