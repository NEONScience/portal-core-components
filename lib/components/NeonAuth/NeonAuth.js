"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.NeonAuthDisplayType = exports.NeonAuthType = void 0;

var _react = _interopRequireWildcard(require("react"));

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _ButtonGroup = _interopRequireDefault(require("@material-ui/core/ButtonGroup"));

var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));

var _styles = require("@material-ui/core/styles");

var _AuthService = _interopRequireWildcard(require("./AuthService"));

var _NeonContext = _interopRequireWildcard(require("../NeonContext/NeonContext"));

var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _typeUtil = require("../../util/typeUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var NeonAuthType;
exports.NeonAuthType = NeonAuthType;

(function (NeonAuthType) {
  NeonAuthType["REDIRECT"] = "REDIRECT";
  NeonAuthType["SILENT"] = "SILENT";
})(NeonAuthType || (exports.NeonAuthType = NeonAuthType = {}));

var NeonAuthDisplayType;
exports.NeonAuthDisplayType = NeonAuthDisplayType;

(function (NeonAuthDisplayType) {
  NeonAuthDisplayType["MENU"] = "MENU";
})(NeonAuthDisplayType || (exports.NeonAuthDisplayType = NeonAuthDisplayType = {}));

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
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
  };
});
var UX_TIMEOUT_MS = 300;

var triggerAuth = function triggerAuth(path, login, dispatch, redirectUriPath) {
  if (!path) return; // Give the browser time to render to allow for immediate feedback
  // by way of a spinner.

  dispatch({
    type: 'setAuthWorking',
    isAuthWorking: true
  });
  setTimeout(function () {
    if (login) {
      _AuthService.default.login(path);
    } else {
      _AuthService.default.logout(path, redirectUriPath);
    }
  }, UX_TIMEOUT_MS);
};

var renderAuth = function renderAuth(props, classes, isAuthenticated, showAuthWorking, isAuthWsConnected, dispatch) {
  var loginType = props.loginType,
      logoutType = props.logoutType,
      displayType = props.displayType,
      loginPath = props.loginPath,
      logoutPath = props.logoutPath,
      accountPath = props.accountPath;

  var handleLogin = function handleLogin() {
    var appliedLoginType = loginType; // Default to redirect if WS isn't connected

    if (!isAuthWsConnected) {
      appliedLoginType = NeonAuthType.REDIRECT;
    }

    switch (appliedLoginType) {
      case NeonAuthType.SILENT:
        _AuthService.default.loginSilently(dispatch, false);

        break;

      case NeonAuthType.REDIRECT:
      default:
        triggerAuth(loginPath, true, dispatch);
        break;
    }
  };

  var handleLogout = function handleLogout() {
    var appliedLogoutType = logoutType;
    var redirectUriPath; // Default to redirect if WS isn't connected

    if (!isAuthWsConnected) {
      appliedLogoutType = NeonAuthType.REDIRECT;
    }

    var appHomePath = _NeonEnvironment.default.getRouterBaseHomePath();

    if (_AuthService.LOGOUT_REDIRECT_PATHS.indexOf(appHomePath) >= 0) {
      appliedLogoutType = NeonAuthType.REDIRECT;
      redirectUriPath = _NeonEnvironment.default.route.home();
    } else {
      // If not a auto redirect path, redirect back to the current path
      var currentPath = window.location.pathname;
      var hasPath = (0, _typeUtil.isStringNonEmpty)(currentPath) && currentPath.includes(appHomePath);
      redirectUriPath = hasPath ? currentPath : appHomePath;
    }

    switch (appliedLogoutType) {
      case NeonAuthType.SILENT:
        _AuthService.default.logoutSilently(dispatch);

        break;

      case NeonAuthType.REDIRECT:
      default:
        triggerAuth(logoutPath, false, dispatch, redirectUriPath);
        break;
    }
  };

  var authContent = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);

  switch (displayType) {
    case NeonAuthDisplayType.MENU:
    default:
      authContent = /*#__PURE__*/_react.default.createElement(_Button.default, {
        size: "small",
        variant: "outlined",
        className: classes.button,
        "data-selenium": "neon-menu.sign-in-button",
        onClick: function onClick() {
          return handleLogin();
        }
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
          onClick: function onClick() {
            return handleLogout();
          }
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

var NeonAuth = function NeonAuth(props) {
  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 2),
      _NeonContext$useNeonC3 = _NeonContext$useNeonC2[0],
      _NeonContext$useNeonC4 = _NeonContext$useNeonC3.auth,
      isAuthenticated = _NeonContext$useNeonC4.isAuthenticated,
      isAuthWorking = _NeonContext$useNeonC4.isAuthWorking,
      isAuthWsConnected = _NeonContext$useNeonC4.isAuthWsConnected,
      status = _NeonContext$useNeonC3.fetches.auth.status,
      dispatch = _NeonContext$useNeonC2[1];

  var classes = useStyles(_Theme.default);
  var isFetchingAuthentication = status === _NeonContext.FETCH_STATUS.FETCHING;
  var isAuthFetched = [_NeonContext.FETCH_STATUS.SUCCESS, _NeonContext.FETCH_STATUS.ERROR].indexOf(status) >= 0;
  var showAuthWorking = isAuthWorking || isFetchingAuthentication;
  var authFetchCb = (0, _react.useCallback)(function () {
    _AuthService.default.fetchUserInfoWithDispatch(dispatch);
  }, [dispatch]);

  if (!isFetchingAuthentication && !isAuthFetched) {
    authFetchCb();
  }

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderAuth(props, classes, isAuthenticated, showAuthWorking, isAuthWsConnected, dispatch));
};

var WrappedNeonAuth = _Theme.default.getWrappedComponent(_NeonContext.default.getWrappedComponent(NeonAuth));

var _default = WrappedNeonAuth;
exports.default = _default;