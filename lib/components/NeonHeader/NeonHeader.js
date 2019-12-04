'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = NeonHeader;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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

function NeonHeader() {
  var classes = useStyles();

  return _react2.default.createElement(
    'div',
    { className: classes.root, 'data-selenium': 'neon-header' },
    _react2.default.createElement(_NeonUtilityBar2.default, null),
    _react2.default.createElement(_NeonMenu2.default, {
      loginPath: (0, _routes.getFullRoute)(_routes.ROUTES.LOGIN),
      logoutPath: (0, _routes.getFullRoute)(_routes.ROUTES.LOGOUT),
      accountPath: (0, _routes.buildAccountRoute)()
    }),
    _react2.default.createElement(_Divider2.default, null)
  );
}