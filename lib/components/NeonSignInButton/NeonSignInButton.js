"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = NeonSignInButton;
var _react = _interopRequireDefault(require("react"));
var _styles = require("@material-ui/core/styles");
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _AuthService = _interopRequireDefault(require("../NeonAuth/AuthService"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _NeonSignInButtonState = _interopRequireDefault(require("./NeonSignInButtonState"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const useStyles = (0, _styles.makeStyles)(theme => ({
  signInButton: {
    margin: theme.spacing(2)
  }
}));
const handleButtonClick = () => {
  // Notify observers the sign in button has been clicked.
  _NeonSignInButtonState.default.sendNotification();
  _AuthService.default.login(_NeonEnvironment.default.getFullAuthPath('login'), _AuthService.default.getLoginRedirectUri());
};
function NeonSignInButton() {
  const classes = useStyles();
  return /*#__PURE__*/_react.default.createElement(_Button.default, {
    variant: "contained",
    className: classes.signInButton,
    color: "primary",
    onClick: handleButtonClick
  }, "Sign In");
}