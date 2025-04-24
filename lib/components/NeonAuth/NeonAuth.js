"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.NeonAuthType = exports.NeonAuthDisplayType = void 0;
var _react = _interopRequireWildcard(require("react"));
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _ButtonGroup = _interopRequireDefault(require("@material-ui/core/ButtonGroup"));
var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));
var _styles = require("@material-ui/core/styles");
var _AuthService = _interopRequireWildcard(require("./AuthService"));
var _NeonContext = _interopRequireWildcard(require("../NeonContext/NeonContext"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _NeonSignInButtonState = _interopRequireDefault(require("../NeonSignInButton/NeonSignInButtonState"));
var _typeUtil = require("../../util/typeUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/* eslint-disable react/no-unused-prop-types */
let NeonAuthType = exports.NeonAuthType = /*#__PURE__*/function (NeonAuthType) {
  NeonAuthType["REDIRECT"] = "REDIRECT";
  NeonAuthType["SILENT"] = "SILENT";
  return NeonAuthType;
}({});
let NeonAuthDisplayType = exports.NeonAuthDisplayType = /*#__PURE__*/function (NeonAuthDisplayType) {
  NeonAuthDisplayType["MENU"] = "MENU";
  return NeonAuthDisplayType;
}({});
const useStyles = (0, _styles.makeStyles)(theme => ({
  button: {
    whiteSpace: 'nowrap',
    // The following styles are !important overrides to styles applied by the drupal header.css
    // when NeonAuth is injected into the drupal header.
    color: "".concat(theme.palette.primary.main, " !important"),
    textTransform: 'uppercase !important',
    fontSize: '0.55rem !important',
    fontWeight: '600 !important',
    fontFamily: '"Inter",Helvetica,Arial,sans-serif !important',
    lineHeight: '1.75 !important'
  }
}));
const UX_TIMEOUT_MS = 300;
const triggerAuth = (path, login, dispatch, redirectUriPath) => {
  if (!path) return;
  // Give the browser time to render to allow for immediate feedback
  // by way of a spinner.
  dispatch({
    type: 'setAuthWorking',
    isAuthWorking: true
  });
  setTimeout(() => {
    if (login) {
      _AuthService.default.login(path, redirectUriPath);
    } else {
      _AuthService.default.logout(path, redirectUriPath);
    }
  }, UX_TIMEOUT_MS);
};
const renderAuth = (props, classes, isAuthenticated, showAuthWorking, isAuthWsConnected, dispatch) => {
  const {
    loginType,
    logoutType,
    displayType,
    loginPath,
    logoutPath,
    accountPath
  } = props;
  const handleLogin = () => {
    if (_NeonEnvironment.default.enableGlobalSignInState) {
      // Notify observers the sign in button has been clicked.
      _NeonSignInButtonState.default.sendNotification();
    }
    let appliedLoginType = loginType;
    // Default to redirect if WS isn't connected
    if (!isAuthWsConnected) {
      appliedLoginType = NeonAuthType.REDIRECT;
    }
    const redirectUriPath = _AuthService.default.getLoginRedirectUri();
    switch (appliedLoginType) {
      case NeonAuthType.SILENT:
        _AuthService.default.loginSilently(dispatch, false, loginPath, redirectUriPath);
        break;
      case NeonAuthType.REDIRECT:
      default:
        triggerAuth(loginPath, true, dispatch, redirectUriPath);
        break;
    }
  };
  const handleLogout = () => {
    let appliedLogoutType = logoutType;
    let redirectUriPath;
    // Default to redirect if WS isn't connected
    if (!isAuthWsConnected) {
      appliedLogoutType = NeonAuthType.REDIRECT;
    }
    const appHomePath = _NeonEnvironment.default.getRouterBaseHomePath();
    if (_AuthService.LOGOUT_REDIRECT_PATHS.indexOf(appHomePath) >= 0) {
      appliedLogoutType = NeonAuthType.REDIRECT;
      redirectUriPath = _NeonEnvironment.default.route.home();
    } else {
      // If not a auto redirect path, redirect back to the current path
      const currentPath = window.location.pathname;
      const hasPath = (0, _typeUtil.isStringNonEmpty)(currentPath) && currentPath.includes(appHomePath);
      redirectUriPath = hasPath ? currentPath : appHomePath;
    }
    switch (appliedLogoutType) {
      case NeonAuthType.SILENT:
        _AuthService.default.logoutSilently(dispatch, logoutPath, redirectUriPath);
        break;
      case NeonAuthType.REDIRECT:
      default:
        triggerAuth(logoutPath, false, dispatch, redirectUriPath);
        break;
    }
  };
  // eslint-disable-next-line react/jsx-no-useless-fragment
  let authContent = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
  switch (displayType) {
    case NeonAuthDisplayType.MENU:
    default:
      authContent = /*#__PURE__*/_react.default.createElement(_Button.default, {
        size: "small",
        variant: "outlined",
        className: classes.button,
        "data-selenium": "neon-menu.sign-in-button",
        onClick: () => handleLogin()
      }, "Sign In");
      if (showAuthWorking) {
        authContent = /*#__PURE__*/_react.default.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'center',
            margin: _Theme.default.spacing(0.5)
          }
        }, /*#__PURE__*/_react.default.createElement("span", {
          style: {
            fontStyle: 'italic',
            marginRight: _Theme.default.spacing(1),
            color: _Theme.default.palette.grey[400]
          }
        }, isAuthenticated ? 'Signing out...' : 'Signing in...'), /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
          size: 20
        }));
      } else if (isAuthenticated) {
        authContent = /*#__PURE__*/_react.default.createElement(_ButtonGroup.default, {
          size: "small",
          "aria-label": "Authentication"
        }, /*#__PURE__*/_react.default.createElement(_Button.default, {
          className: classes.button,
          "data-selenium": "neon-menu.sign-out-button",
          onClick: () => handleLogout()
        }, "Sign Out"), /*#__PURE__*/_react.default.createElement(_Button.default, {
          href: accountPath,
          className: classes.button,
          "data-selenium": "neon-menu.my-account-button"
        }, "My Account"));
      }
      break;
  }
  return authContent;
};
const NeonAuth = props => {
  const [{
    auth: {
      isAuthenticated,
      isAuthWorking,
      isAuthWsConnected
    },
    fetches: {
      auth: {
        status
      }
    }
  }, dispatch] = _NeonContext.default.useNeonContextState();
  const classes = useStyles(_Theme.default);
  const isFetchingAuthentication = status === _NeonContext.FETCH_STATUS.FETCHING;
  const isAuthFetched = [_NeonContext.FETCH_STATUS.SUCCESS, _NeonContext.FETCH_STATUS.ERROR].indexOf(status) >= 0;
  const showAuthWorking = isAuthWorking || isFetchingAuthentication;
  const authFetchCb = (0, _react.useCallback)(() => {
    _AuthService.default.fetchUserInfoWithDispatch(dispatch);
  }, [dispatch]);
  if (!isFetchingAuthentication && !isAuthFetched) {
    authFetchCb();
  }
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderAuth(props, classes, isAuthenticated, showAuthWorking, isAuthWsConnected, dispatch));
};
const WrappedNeonAuth = _Theme.default.getWrappedComponent(_NeonContext.default.getWrappedComponent(NeonAuth));
var _default = exports.default = WrappedNeonAuth;