"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _universalCookie = _interopRequireDefault(require("universal-cookie"));
var _styles = require("@material-ui/core/styles");
var _Snackbar = _interopRequireDefault(require("@material-ui/core/Snackbar"));
var _SnackbarContent = _interopRequireDefault(require("@material-ui/core/SnackbarContent"));
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));
var _Close = _interopRequireDefault(require("@material-ui/icons/Close"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
  Browser duck typing and warning
  We know detecting browser on user agent strings for feature gating is bad practice.
  Here, though, we just want a generic warning if we know the browser is IE.
  Nothing else is or should be predicated on the value detected here.
  Don't make this any more complicated!
*/
const isBrowserIE = () => navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1;
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
  const message = /*#__PURE__*/_react.default.createElement("span", {
    id: "browser-warning",
    className: classes.browserWarningMessage,
    "data-selenium": "neon-page.browser-warning"
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("b", null, "Your browser has limited support on the NEON Data Portal."), /*#__PURE__*/_react.default.createElement("br", null), "Some parts of the portal will not work for you.", /*#__PURE__*/_react.default.createElement("br", null), "Please use a modern browser for full support.", /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.buttonRow
  }, /*#__PURE__*/_react.default.createElement(_Button.default, _extends({}, buttonProps, {
    href: "https://www.mozilla.org/en-US/firefox/new/"
  }), "Firefox"), /*#__PURE__*/_react.default.createElement(_Button.default, _extends({}, buttonProps, {
    href: "https://www.google.com/chrome/"
  }), "Chrome"), /*#__PURE__*/_react.default.createElement(_Button.default, _extends({}, buttonProps, {
    href: "https://www.apple.com/safari/"
  }), "Safari"), /*#__PURE__*/_react.default.createElement(_Button.default, _extends({}, buttonProps, {
    href: "https://www.microsoft.com/en-us/windows/microsoft-edge"
  }), "Edge"))));
  return /*#__PURE__*/_react.default.createElement(_Snackbar.default, {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'right'
    },
    ContentProps: {
      'aria-describedby': 'browser-warning'
    },
    open: browserWarningOpen
  }, /*#__PURE__*/_react.default.createElement(_SnackbarContent.default, {
    className: classes.browserWarning,
    message: message,
    action: /*#__PURE__*/_react.default.createElement(_IconButton.default, {
      key: "close",
      "aria-label": "close",
      color: "inherit",
      onClick: handleBrowserWarningClose
    }, /*#__PURE__*/_react.default.createElement(_Close.default, null))
  }));
};
var _default = exports.default = BrowserWarning;