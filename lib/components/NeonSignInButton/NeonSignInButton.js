"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = NeonSignInButton;

var _react = _interopRequireDefault(require("react"));

var _styles = require("@material-ui/core/styles");

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));

var _NeonSignInButtonState = _interopRequireDefault(require("./NeonSignInButtonState"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    signInButton: {
      margin: theme.spacing(2)
    }
  };
});

var handleButtonClick = function handleButtonClick() {
  // Notify observers the sign in button has been clicked.
  _NeonSignInButtonState.default.sendNotification();

  document.location.href = _NeonEnvironment.default.getFullAuthPath('login');
};

function NeonSignInButton() {
  var classes = useStyles();
  return /*#__PURE__*/_react.default.createElement(_Button.default, {
    variant: "contained",
    className: classes.signInButton,
    color: "primary",
    onClick: handleButtonClick
  }, "Sign In");
}