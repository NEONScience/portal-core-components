"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styles = require("@material-ui/core/styles");

var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));

var _NeonUtilityBar = _interopRequireDefault(require("../NeonUtilityBar/NeonUtilityBar"));

var _NeonMenu = _interopRequireDefault(require("../NeonMenu/NeonMenu"));

var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var useStyles = (0, _styles.makeStyles)(function () {
  return {
    root: {
      flexGrow: 1,
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25), 0px 1px 1px rgba(0, 0, 0, 0.25)',
      zIndex: 2000
    }
  };
});
var NeonHeader = /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
  var classes = useStyles();
  var notifications = props.notifications,
      onShowNotifications = props.onShowNotifications;
  var notificationsProps = typeof onShowNotifications === 'function' ? {
    notifications: notifications,
    onShowNotifications: onShowNotifications
  } : {};
  return /*#__PURE__*/_react.default.createElement("div", {
    ref: ref,
    className: classes.root,
    "data-selenium": "neon-header"
  }, /*#__PURE__*/_react.default.createElement(_NeonUtilityBar.default, null), /*#__PURE__*/_react.default.createElement(_NeonMenu.default, _extends({
    loginPath: _NeonEnvironment.default.getFullAuthPath('login'),
    logoutPath: _NeonEnvironment.default.getFullAuthPath('logout'),
    accountPath: _NeonEnvironment.default.route.buildAccountRoute()
  }, notificationsProps)), /*#__PURE__*/_react.default.createElement(_Divider.default, null));
});
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