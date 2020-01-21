'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styles = require('@material-ui/core/styles');

var _Divider = require('@material-ui/core/Divider');

var _Divider2 = _interopRequireDefault(_Divider);

var _NeonUtilityBar = require('../NeonUtilityBar/NeonUtilityBar');

var _NeonUtilityBar2 = _interopRequireDefault(_NeonUtilityBar);

var _NeonMenu = require('../NeonMenu/NeonMenu');

var _NeonMenu2 = _interopRequireDefault(_NeonMenu);

var _routes = require('../../routing/routes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    notifications: notifications, onShowNotifications: onShowNotifications
  } : {};

  return _react2.default.createElement(
    'div',
    { className: classes.root, 'data-selenium': 'neon-header' },
    _react2.default.createElement(_NeonUtilityBar2.default, null),
    _react2.default.createElement(_NeonMenu2.default, _extends({
      loginPath: (0, _routes.getFullRoute)(_routes.ROUTES.LOGIN),
      logoutPath: (0, _routes.getFullRoute)(_routes.ROUTES.LOGOUT),
      accountPath: (0, _routes.buildAccountRoute)()
    }, notificationsProps)),
    _react2.default.createElement(_Divider2.default, null)
  );
};

NeonHeader.propTypes = {
  notifications: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    id: _propTypes2.default.string.isRequired,
    message: _propTypes2.default.string.isRequired,
    dismissed: _propTypes2.default.bool.isRequired
  })),
  onShowNotifications: _propTypes2.default.func
};

NeonHeader.defaultProps = {
  notifications: [],
  onShowNotifications: null
};

exports.default = NeonHeader;