'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styles = require('@material-ui/core/styles');

var _Snackbar = require('@material-ui/core/Snackbar');

var _Snackbar2 = _interopRequireDefault(_Snackbar);

var _SnackbarContent = require('@material-ui/core/SnackbarContent');

var _SnackbarContent2 = _interopRequireDefault(_SnackbarContent);

var _IconButton = require('@material-ui/core/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _Close = require('@material-ui/icons/Close');

var _Close2 = _interopRequireDefault(_Close);

var _Theme = require('../Theme/Theme');

var _Theme2 = _interopRequireDefault(_Theme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    notificationRoot: {
      zIndex: 11000
    },
    notification: {
      backgroundColor: _Theme.COLORS.YELLOW[700],
      '& a': {
        color: theme.palette.secondary.light + ' !important'
      }
    }
  };
});

var LiferayNotifications = function LiferayNotifications(props) {
  var classes = useStyles(_Theme2.default);
  var notifications = props.notifications,
      onHideNotifications = props.onHideNotifications;


  if (!notifications.length || notifications.every(function (n) {
    return n.dismissed;
  })) {
    return null;
  }

  var renderNotificationContent = function renderNotificationContent() {
    return _react2.default.createElement(
      'div',
      { id: 'neon-data-portal-notifications' },
      notifications.map(function (notification) {
        return _react2.default.createElement('div', {
          key: notification.id
          // eslint-disable-next-line react/no-danger
          , dangerouslySetInnerHTML: { __html: notification.message }
        });
      })
    );
  };

  return _react2.default.createElement(
    _Snackbar2.default,
    {
      open: true,
      className: classes.notificationRoot,
      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      ContentProps: { 'aria-describedby': 'neon-data-portal-notifications' }
    },
    _react2.default.createElement(_SnackbarContent2.default, {
      className: classes.notification,
      message: renderNotificationContent(),
      action: typeof onHideNotifications === 'function' ? _react2.default.createElement(
        _IconButton2.default,
        {
          key: 'close',
          'aria-label': 'close',
          color: 'inherit',
          onClick: onHideNotifications
        },
        _react2.default.createElement(_Close2.default, null)
      ) : null
    })
  );
};

LiferayNotifications.propTypes = {
  notifications: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    id: _propTypes2.default.string.isRequired,
    message: _propTypes2.default.string.isRequired,
    dismissed: _propTypes2.default.bool.isRequired
  })),
  onHideNotifications: _propTypes2.default.func
};

LiferayNotifications.defaultProps = {
  notifications: [],
  onHideNotifications: null
};

exports.default = LiferayNotifications;