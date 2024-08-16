"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _universalCookie = _interopRequireDefault(require("universal-cookie"));
var _styles = require("@mui/styles");
var _Snackbar = _interopRequireDefault(require("@mui/material/Snackbar"));
var _SnackbarContent = _interopRequireDefault(require("@mui/material/SnackbarContent"));
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _Close = _interopRequireDefault(require("@mui/icons-material/Close"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/*
  Browser duck typing and warning
  We know detecting browser on user agent strings for feature gating is bad practice.
  Here, though, we just want a generic warning if we know the browser is IE.
  Nothing else is or should be predicated on the value detected here.
  Don't make this any more complicated!
*/const isBrowserIE = () => navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1;
const useStyles = (0, _styles.makeStyles)(theme => ({
  browserWarning: {
    backgroundColor: theme.palette.error.main
  },
  browserWarningMessage: {
    display: 'flex',
    alignItems: 'center'
  },
  buttonRow: {
    marginTop: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-around'
  }
}));
const cookies = new _universalCookie.default();
const BrowserWarning = () => {
  const classes = useStyles(_Theme.default);
  const browserIsIE = isBrowserIE();
  const [browserWarningOpen, setBrowserWarningOpen] = (0, _react.useState)(browserIsIE);
  if (!browserIsIE) {
    return null;
  }
  if (cookies.get('ignoreIE11Warning')) {
    return null;
  }
  const handleBrowserWarningClose = () => {
    cookies.set('ignoreIE11Warning', true, {
      path: '/',
      maxAge: 86400
    });
    setBrowserWarningOpen(false);
  };
  const buttonProps = {
    color: 'inherit',
    target: '_blank'
  };
  const message = /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    id: "browser-warning",
    className: classes.browserWarningMessage,
    "data-selenium": "neon-page.browser-warning",
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("b", {
        children: "Your browser has limited support on the NEON Data Portal."
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {}), "Some parts of the portal will not work for you.", /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {}), "Please use a modern browser for full support.", /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {}), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: classes.buttonRow,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
          ...buttonProps,
          href: "https://www.mozilla.org/en-US/firefox/new/",
          children: "Firefox"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
          ...buttonProps,
          href: "https://www.google.com/chrome/",
          children: "Chrome"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
          ...buttonProps,
          href: "https://www.apple.com/safari/",
          children: "Safari"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
          ...buttonProps,
          href: "https://www.microsoft.com/en-us/windows/microsoft-edge",
          children: "Edge"
        })]
      })]
    })
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Snackbar.default, {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'right'
    },
    ContentProps: {
      'aria-describedby': 'browser-warning'
    },
    open: browserWarningOpen,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_SnackbarContent.default, {
      className: classes.browserWarning,
      message: message,
      action: /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
        "aria-label": "close",
        color: "inherit",
        onClick: handleBrowserWarningClose,
        size: "large",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Close.default, {})
      }, "close")
    })
  });
};
var _default = exports.default = BrowserWarning;