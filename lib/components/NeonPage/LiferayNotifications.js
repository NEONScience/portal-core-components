"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/styles");
var _Snackbar = _interopRequireDefault(require("@mui/material/Snackbar"));
var _SnackbarContent = _interopRequireDefault(require("@mui/material/SnackbarContent"));
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _Close = _interopRequireDefault(require("@mui/icons-material/Close"));
var _Theme = _interopRequireWildcard(require("../Theme/Theme"));
var _defaultProps = require("../../util/defaultProps");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const useStyles = (0, _styles.makeStyles)(theme => ({
  notification: {
    color: theme.palette.text.primary,
    backgroundColor: _Theme.COLORS.GOLD[50],
    border: `1px solid ${_Theme.COLORS.GOLD[300]}`,
    borderRadius: '4px',
    marginLeft: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      maxWidth: '75%'
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '50%'
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: '33%'
    }
  }
}));
const defaultProps = {
  notifications: [],
  onHideNotifications: null
};
const LiferayNotifications = inProps => {
  const props = (0, _defaultProps.resolveProps)(defaultProps, inProps);
  const classes = useStyles(_Theme.default);
  const {
    notifications,
    onHideNotifications
  } = props;
  if (!notifications.length || notifications.every(n => n.dismissed)) {
    return null;
  }
  const renderNotificationContent = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    id: "neon-data-portal-notifications",
    children: notifications.map(notification => /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML: {
        __html: notification.message
      }
    }, notification.id))
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Snackbar.default, {
    open: true,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'right'
    },
    ContentProps: {
      'aria-describedby': 'neon-data-portal-notifications'
    },
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_SnackbarContent.default, {
      className: classes.notification,
      message: renderNotificationContent(),
      action: typeof onHideNotifications === 'function' ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
        color: "default",
        size: "small",
        "aria-label": "close",
        onClick: onHideNotifications,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Close.default, {})
      }, "close") : null
    })
  });
};
LiferayNotifications.propTypes = {
  notifications: _propTypes.default.arrayOf(_propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    message: _propTypes.default.string.isRequired,
    dismissed: _propTypes.default.bool.isRequired
  })),
  onHideNotifications: _propTypes.default.func
};
var _default = exports.default = LiferayNotifications;