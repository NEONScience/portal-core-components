"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/*
  Browser duck typing and warning
  We know detecting browser on user agent strings for feature gating is bad practice.
  Here, though, we just want a generic wanring if we know the browser is IE.
  Nothing else is or should be predicated on the value detected here.
  Don't make this any more complicated!
*/
var browserIsIE = navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1;
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
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
  };
});
var cookies = new _universalCookie.default();

var BrowserWarning = function BrowserWarning() {
  var classes = useStyles(_Theme.default);

  var _useState = (0, _react.useState)(browserIsIE),
      _useState2 = _slicedToArray(_useState, 2),
      browserWarningOpen = _useState2[0],
      setBrowserWarningOpen = _useState2[1];

  if (!browserIsIE) {
    return null;
  }

  if (cookies.get('ignoreIE11Warning')) {
    return null;
  }

  var handleBrowserWarningClose = function handleBrowserWarningClose() {
    cookies.set('ignoreIE11Warning', true, {
      path: '/',
      maxAge: 86400
    });
    setBrowserWarningOpen(false);
  };

  var buttonProps = {
    color: 'inherit',
    target: '_blank'
  };

  var message = _react.default.createElement("span", {
    id: "browser-warning",
    className: classes.browserWarningMessage,
    "data-selenium": "neon-page.browser-warning"
  }, _react.default.createElement("div", null, _react.default.createElement("b", null, "Your browser has limited support on the NEON Data Portal."), _react.default.createElement("br", null), "Some parts of the portal will not work for you.", _react.default.createElement("br", null), "Please use a modern browser for full support.", _react.default.createElement("br", null), _react.default.createElement("div", {
    className: classes.buttonRow
  }, _react.default.createElement(_Button.default, _extends({}, buttonProps, {
    href: "https://www.mozilla.org/en-US/firefox/new/"
  }), "Firefox"), _react.default.createElement(_Button.default, _extends({}, buttonProps, {
    href: "https://www.google.com/chrome/"
  }), "Chrome"), _react.default.createElement(_Button.default, _extends({}, buttonProps, {
    href: "https://www.apple.com/safari/"
  }), "Safari"), _react.default.createElement(_Button.default, _extends({}, buttonProps, {
    href: "https://www.microsoft.com/en-us/windows/microsoft-edge"
  }), "Edge"))));

  return _react.default.createElement(_Snackbar.default, {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'right'
    },
    ContentProps: {
      'aria-describedby': 'browser-warning'
    },
    open: browserWarningOpen
  }, _react.default.createElement(_SnackbarContent.default, {
    className: classes.browserWarning,
    message: message,
    action: _react.default.createElement(_IconButton.default, {
      key: "close",
      "aria-label": "close",
      color: "inherit",
      onClick: handleBrowserWarningClose
    }, _react.default.createElement(_Close.default, null))
  }));
};

var _default = BrowserWarning;
exports.default = _default;