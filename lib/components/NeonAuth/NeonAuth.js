"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.NeonAuthType = exports.NeonAuthDisplayType = void 0;
var _react = _interopRequireWildcard(require("react"));
var _Avatar = _interopRequireDefault(require("@mui/material/Avatar"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _ButtonGroup = _interopRequireDefault(require("@mui/material/ButtonGroup"));
var _CircularProgress = _interopRequireDefault(require("@mui/material/CircularProgress"));
var _Menu = _interopRequireDefault(require("@mui/material/Menu"));
var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));
var _ListItemIcon = _interopRequireDefault(require("@mui/material/ListItemIcon"));
var _Divider = _interopRequireDefault(require("@mui/material/Divider"));
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _useMediaQuery = _interopRequireDefault(require("@mui/material/useMediaQuery"));
var _styles = require("@mui/styles");
var _Logout = _interopRequireDefault(require("@mui/icons-material/Logout"));
var _AuthService = _interopRequireWildcard(require("./AuthService"));
var _NeonContext = _interopRequireWildcard(require("../NeonContext/NeonContext"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _NeonSignInButtonState = _interopRequireDefault(require("../NeonSignInButton/NeonSignInButtonState"));
var _typeUtil = require("../../util/typeUtil");
var _jsxRuntime = require("react/jsx-runtime");
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
  NeonAuthDisplayType["MENU_CUSTOM"] = "MENU_CUSTOM";
  return NeonAuthDisplayType;
}({});
const useStyles = (0, _styles.makeStyles)(theme => ({
  button: {
    whiteSpace: 'nowrap',
    // The following styles are !important overrides to styles applied by the drupal header.css
    // when NeonAuth is injected into the drupal header.
    color: `${theme.palette.primary.main} !important`,
    textTransform: 'uppercase !important',
    fontSize: '0.55rem !important',
    fontWeight: '600 !important',
    fontFamily: '"Inter",Helvetica,Arial,sans-serif !important',
    lineHeight: '1.75 !important'
  },
  loadingContainer: {
    display: 'flex',
    width: '64px',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(0.5)
  },
  loadingContainerSpan: {
    marginRight: theme.spacing(1),
    color: theme.palette.grey[400]
  },
  accountMenuContainer: {
    '& :focus': {
      outline: 'none !important'
    }
  }
}));
const UX_TIMEOUT_MS = 300;
const AccountMenu = props => {
  const {
    accountPath,
    handleLogout
  } = props;
  const classes = useStyles(_Theme.default);
  const [{
    auth: {
      userData
    }
  }] = _NeonContext.default.useNeonContextState();
  const user = userData?.data?.user;
  const containerRef = _react.default.useRef(null);
  const belowLg = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('lg'));
  const [anchorEl, setAnchorEl] = _react.default.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleMyAccountNav = () => {
    window.location.href = accountPath;
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // eslint-disable-next-line no-undef-init
  let avatarAlt = undefined;
  if ((0, _typeUtil.exists)(user)) {
    if ((0, _typeUtil.isStringNonEmpty)(user.name)) {
      avatarAlt = user.name;
    } else if ((0, _typeUtil.isStringNonEmpty)(user.email)) {
      avatarAlt = user.email;
    }
  }
  const avatarContainerSx = {
    display: 'block',
    width: '64px',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: '-4px'
  };
  if (belowLg) {
    avatarContainerSx.marginTop = '-3px';
    avatarContainerSx.textAlign = 'right';
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Box.default, {
      sx: avatarContainerSx,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
        title: "My Account",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
          onClick: handleClick,
          size: "small",
          autoFocus: false,
          sx: {
            padding: 0
          },
          "aria-controls": open ? 'account-menu' : undefined,
          "aria-haspopup": "true",
          "aria-expanded": open ? 'true' : undefined,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Avatar.default, {
            alt: avatarAlt,
            src: user?.picture,
            sx: {
              width: 32,
              height: 32
            },
            children: avatarAlt?.charAt(0)?.toUpperCase()
          })
        })
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      ref: containerRef,
      className: classes.accountMenuContainer,
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Menu.default, {
        container: containerRef.current,
        anchorEl: anchorEl,
        id: "account-menu",
        open: open,
        variant: "menu",
        autoFocus: false,
        disableAutoFocusItem: true,
        onClose: handleClose,
        onClick: handleClose,
        slotProps: {
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0
              }
            }
          }
        },
        transformOrigin: {
          horizontal: 'right',
          vertical: 'top'
        },
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_MenuItem.default, {
          onClick: handleMyAccountNav,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Avatar.default, {
            style: {
              width: '24px',
              height: '24px'
            },
            sx: {
              width: 24,
              height: 24
            }
          }), ' My Account']
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Divider.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_MenuItem.default, {
          onClick: () => handleLogout(),
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_ListItemIcon.default, {
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Logout.default, {
              fontSize: "small"
            })
          }), "Logout"]
        })]
      })
    })]
  });
};
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
  let authContent = /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {});
  const isCustom = NeonAuthDisplayType.MENU_CUSTOM;
  switch (displayType) {
    case NeonAuthDisplayType.MENU_CUSTOM:
    case NeonAuthDisplayType.MENU:
    default:
      authContent = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
        size: "small",
        variant: "outlined",
        className: classes.button,
        "data-selenium": "neon-menu.sign-in-button",
        onClick: () => handleLogin(),
        children: "Sign In"
      });
      if (showAuthWorking) {
        authContent = /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: classes.loadingContainer,
          children: [isCustom ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: classes.loadingContainerSpan,
            children: isAuthenticated ? 'Signing out...' : 'Signing in...'
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_CircularProgress.default, {
            size: 20
          })]
        });
      } else if (isAuthenticated) {
        authContent = isCustom ? /*#__PURE__*/(0, _jsxRuntime.jsx)(AccountMenu, {
          accountPath: accountPath,
          handleLogout: handleLogout
        }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_ButtonGroup.default, {
          size: "small",
          "aria-label": "Authentication",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
            className: classes.button,
            "data-selenium": "neon-menu.sign-out-button",
            onClick: () => handleLogout(),
            children: "Sign Out"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
            href: accountPath,
            className: classes.button,
            "data-selenium": "neon-menu.my-account-button",
            children: "My Account"
          })]
        });
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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
    children: renderAuth(props, classes, isAuthenticated, showAuthWorking, isAuthWsConnected, dispatch)
  });
};
const WrappedNeonAuth = _Theme.default.getWrappedComponent(_NeonContext.default.getWrappedComponent(NeonAuth));
var _default = exports.default = WrappedNeonAuth;