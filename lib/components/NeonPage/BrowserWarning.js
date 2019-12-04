'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _universalCookie = require('universal-cookie');

var _universalCookie2 = _interopRequireDefault(_universalCookie);

var _styles = require('@material-ui/core/styles');

var _Snackbar = require('@material-ui/core/Snackbar');

var _Snackbar2 = _interopRequireDefault(_Snackbar);

var _SnackbarContent = require('@material-ui/core/SnackbarContent');

var _SnackbarContent2 = _interopRequireDefault(_SnackbarContent);

var _Button = require('@material-ui/core/Button');

var _Button2 = _interopRequireDefault(_Button);

var _IconButton = require('@material-ui/core/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _Close = require('@material-ui/icons/Close');

var _Close2 = _interopRequireDefault(_Close);

var _Theme = require('../Theme/Theme');

var _Theme2 = _interopRequireDefault(_Theme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var cookies = new _universalCookie2.default();

var BrowserWarning = function BrowserWarning() {
  var classes = useStyles(_Theme2.default);

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
    cookies.set('ignoreIE11Warning', true, { path: '/', maxAge: 86400 });
    setBrowserWarningOpen(false);
  };

  var buttonProps = {
    color: 'inherit',
    target: '_blank'
  };
  var message = _react2.default.createElement(
    'span',
    {
      id: 'browser-warning',
      className: classes.browserWarningMessage,
      'data-selenium': 'neon-page.browser-warning'
    },
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'b',
        null,
        'Your browser has limited support on the NEON Data Portal.'
      ),
      _react2.default.createElement('br', null),
      'Some parts of the portal will not work for you.',
      _react2.default.createElement('br', null),
      'Please use a modern browser for full support.',
      _react2.default.createElement('br', null),
      _react2.default.createElement(
        'div',
        { className: classes.buttonRow },
        _react2.default.createElement(
          _Button2.default,
          _extends({}, buttonProps, { href: 'https://www.mozilla.org/en-US/firefox/new/' }),
          'Firefox'
        ),
        _react2.default.createElement(
          _Button2.default,
          _extends({}, buttonProps, { href: 'https://www.google.com/chrome/' }),
          'Chrome'
        ),
        _react2.default.createElement(
          _Button2.default,
          _extends({}, buttonProps, { href: 'https://www.apple.com/safari/' }),
          'Safari'
        ),
        _react2.default.createElement(
          _Button2.default,
          _extends({}, buttonProps, { href: 'https://www.microsoft.com/en-us/windows/microsoft-edge' }),
          'Edge'
        )
      )
    )
  );

  return _react2.default.createElement(
    _Snackbar2.default,
    {
      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      ContentProps: { 'aria-describedby': 'browser-warning' },
      open: browserWarningOpen
    },
    _react2.default.createElement(_SnackbarContent2.default, {
      className: classes.browserWarning,
      message: message,
      action: _react2.default.createElement(
        _IconButton2.default,
        {
          key: 'close',
          'aria-label': 'close',
          color: 'inherit',
          onClick: handleBrowserWarningClose
        },
        _react2.default.createElement(_Close2.default, null)
      )
    })
  );
};

exports.default = BrowserWarning;