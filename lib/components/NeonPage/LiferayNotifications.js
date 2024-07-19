"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@material-ui/core/styles");
var _Snackbar = _interopRequireDefault(require("@material-ui/core/Snackbar"));
var _SnackbarContent = _interopRequireDefault(require("@material-ui/core/SnackbarContent"));
var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));
var _Close = _interopRequireDefault(require("@material-ui/icons/Close"));
var _Theme = _interopRequireWildcard(require("../Theme/Theme"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const useStyles = (0, _styles.makeStyles)(theme => ({
  notification: {
    color: theme.palette.text.primary,
    backgroundColor: _Theme.COLORS.GOLD[50],
    border: "1px solid ".concat(_Theme.COLORS.GOLD[300]),
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
  const renderNotificationContent = () => /*#__PURE__*/_react.default.createElement("div", {
    id: "neon-data-portal-notifications"
  }, notifications.map(notification => /*#__PURE__*/_react.default.createElement("div", {
    key: notification.id
    // eslint-disable-next-line react/no-danger
    ,
    dangerouslySetInnerHTML: {
      __html: notification.message
    }
  })));
  return /*#__PURE__*/_react.default.createElement(_Snackbar.default, {
    open: true,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'right'
    },
    ContentProps: {
      'aria-describedby': 'neon-data-portal-notifications'
    }
  }, /*#__PURE__*/_react.default.createElement(_SnackbarContent.default, {
    className: classes.notification,
    message: renderNotificationContent(),
    action: typeof onHideNotifications === 'function' ? /*#__PURE__*/_react.default.createElement(_IconButton.default, {
      color: "default",
      size: "small",
      key: "close",
      "aria-label": "close",
      onClick: onHideNotifications
    }, /*#__PURE__*/_react.default.createElement(_Close.default, null)) : null
  }));
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