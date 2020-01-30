"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    notificationRoot: {
      zIndex: 11000
    },
    notification: {
      backgroundColor: _Theme.COLORS.YELLOW[700],
      '& a': {
        color: "".concat(theme.palette.secondary.light, " !important")
      }
    }
  };
});

var LiferayNotifications = function LiferayNotifications(props) {
  var classes = useStyles(_Theme.default);
  var notifications = props.notifications,
      onHideNotifications = props.onHideNotifications;

  if (!notifications.length || notifications.every(function (n) {
    return n.dismissed;
  })) {
    return null;
  }

  var renderNotificationContent = function renderNotificationContent() {
    return _react.default.createElement("div", {
      id: "neon-data-portal-notifications"
    }, notifications.map(function (notification) {
      return _react.default.createElement("div", {
        key: notification.id // eslint-disable-next-line react/no-danger
        ,
        dangerouslySetInnerHTML: {
          __html: notification.message
        }
      });
    }));
  };

  return _react.default.createElement(_Snackbar.default, {
    open: true,
    className: classes.notificationRoot,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'right'
    },
    ContentProps: {
      'aria-describedby': 'neon-data-portal-notifications'
    }
  }, _react.default.createElement(_SnackbarContent.default, {
    className: classes.notification,
    message: renderNotificationContent(),
    action: typeof onHideNotifications === 'function' ? _react.default.createElement(_IconButton.default, {
      key: "close",
      "aria-label": "close",
      color: "inherit",
      onClick: onHideNotifications
    }, _react.default.createElement(_Close.default, null)) : null
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
var _default = LiferayNotifications;
exports.default = _default;