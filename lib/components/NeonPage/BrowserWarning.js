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

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/*
  Browser duck typing and warning
  We know detecting browser on user agent strings for feature gating is bad practice.
  Here, though, we just want a generic warning if we know the browser is IE.
  Nothing else is or should be predicated on the value detected here.
  Don't make this any more complicated!
*/
var isBrowserIE = function isBrowserIE() {
  return navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1;
};

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
  var browserIsIE = isBrowserIE();

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

  var message = /*#__PURE__*/_react.default.createElement("span", {
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

var _default = BrowserWarning;
exports.default = _default;