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
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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
const LiferayNotifications = props => {
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
LiferayNotifications.defaultProps = {
  notifications: [],
  onHideNotifications: null
};
var _default = exports.default = LiferayNotifications;