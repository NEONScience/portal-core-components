"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styles = require("@material-ui/core/styles");

var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));

var _NeonUtilityBar = _interopRequireDefault(require("../NeonUtilityBar/NeonUtilityBar"));

var _NeonMenu = _interopRequireDefault(require("../NeonMenu/NeonMenu"));

var _routes = require("../../routing/routes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var useStyles = (0, _styles.makeStyles)(function () {
  return {
    root: {
      flexGrow: 1
    }
  };
});

var NeonHeader = function NeonHeader(props) {
  var classes = useStyles();
  var notifications = props.notifications,
      onShowNotifications = props.onShowNotifications;
  var notificationsProps = typeof onShowNotifications === 'function' ? {
    notifications: notifications,
    onShowNotifications: onShowNotifications
  } : {};
  return _react.default.createElement("div", {
    className: classes.root,
    "data-selenium": "neon-header"
  }, _react.default.createElement(_NeonUtilityBar.default, null), _react.default.createElement(_NeonMenu.default, _extends({
    loginPath: (0, _routes.getFullRoute)(_routes.ROUTES.LOGIN),
    logoutPath: (0, _routes.getFullRoute)(_routes.ROUTES.LOGOUT),
    accountPath: (0, _routes.buildAccountRoute)()
  }, notificationsProps)), _react.default.createElement(_Divider.default, null));
};

NeonHeader.propTypes = {
  notifications: _propTypes.default.arrayOf(_propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    message: _propTypes.default.string.isRequired,
    dismissed: _propTypes.default.bool.isRequired
  })),
  onShowNotifications: _propTypes.default.func
};
NeonHeader.defaultProps = {
  notifications: [],
  onShowNotifications: null
};
var _default = NeonHeader;
exports.default = _default;