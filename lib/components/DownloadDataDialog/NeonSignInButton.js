"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = NeonSignInButton;

var _react = _interopRequireDefault(require("react"));

var _styles = require("@material-ui/core/styles");

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));

var _signInButtonState = require("./signInButtonState");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    signInButton: {
      margin: theme.spacing(2)
    }
  };
});
var buttonSubject = (0, _signInButtonState.getSignInButtonSubject)();

var handleButtonClick = function handleButtonClick() {
  // push to the subject to notify subscribers
  buttonSubject.next('clicked');
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