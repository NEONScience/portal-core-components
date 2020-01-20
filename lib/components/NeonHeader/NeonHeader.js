"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = NeonHeader;

var _react = _interopRequireDefault(require("react"));

var _styles = require("@material-ui/core/styles");

var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));

var _NeonUtilityBar = _interopRequireDefault(require("../NeonUtilityBar/NeonUtilityBar"));

var _NeonMenu = _interopRequireDefault(require("../NeonMenu/NeonMenu"));

var _routes = require("../../routing/routes");

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
  return _react.default.createElement("div", {
    className: classes.root,
    "data-selenium": "neon-header"
  }, _react.default.createElement(_NeonUtilityBar.default, null), _react.default.createElement(_NeonMenu.default, {
    loginPath: (0, _routes.getFullRoute)(_routes.ROUTES.LOGIN),
    logoutPath: (0, _routes.getFullRoute)(_routes.ROUTES.LOGOUT),
    accountPath: (0, _routes.buildAccountRoute)()
  }), _react.default.createElement(_Divider.default, null));
}