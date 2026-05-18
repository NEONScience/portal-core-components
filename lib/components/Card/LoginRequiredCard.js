"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));
var _Link = _interopRequireDefault(require("@material-ui/core/Link"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _styles = require("@material-ui/core/styles");
var _AccountValidationStepper = _interopRequireDefault(require("../Accounts/AccountValidationStepper"));
var _InfoMessageCard = _interopRequireDefault(require("./InfoMessageCard"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _RouteService = _interopRequireDefault(require("../../service/RouteService"));
var _typeUtil = require("../../util/typeUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const useStyles = (0, _styles.makeStyles)(theme =>
// eslint-disable-next-line implicit-arrow-linebreak
(0, _styles.createStyles)({
  loginContentsDivider: {
    margin: theme.spacing(2, 0, 2, 0)
  },
  card: {
    margin: theme.spacing(0.5, 0, 3, 0),
    backgroundColor: theme.colors.GOLD[50],
    borderColor: theme.colors.GOLD[300]
  },
  cardSecondaryIcon: {
    color: theme.colors.GOLD[300],
    marginLeft: theme.spacing(2)
  }
}));
const LoginRequiredCard = props => {
  const {
    isAuthenticated,
    details,
    showValidation,
    accountValidated,
    accountValidationSteps
  } = props;
  const classes = useStyles(_Theme.default);
  const myAccountLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
    target: "_self",
    href: _NeonEnvironment.default.route.buildAccountRoute()
  }, "My Account");
  const accountInfoLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
    target: "_blank",
    href: _RouteService.default.getUserAccountsPath()
  }, "Learn");
  const renderValidation = () => {
    if (showValidation !== true) {
      return null;
    }
    if ((0, _typeUtil.exists)(accountValidated) && accountValidated === true) {
      return null;
    }
    if (!(0, _typeUtil.existsNonEmpty)(accountValidationSteps)) {
      return null;
    }
    return /*#__PURE__*/_react.default.createElement(_AccountValidationStepper.default, {
      isAuthenticated: isAuthenticated,
      accountValidated: accountValidated,
      accountValidationSteps: accountValidationSteps
    });
  };
  const renderContents = () => {
    const appliedDetails = (0, _typeUtil.isStringNonEmpty)(details) ? details : undefined;
    let message;
    if ((0, _typeUtil.isStringNonEmpty)(appliedDetails)) {
      message = /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body2"
      }, appliedDetails, ' ', " Navigate to ", myAccountLink, " to sign in or create an account.", ' ', " ", accountInfoLink, " about the benefits of having an account.");
    } else {
      message = /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body2"
      }, "You must sign in or create and validate an account before proceeding.", ' ', " Navigate to ", myAccountLink, " to sign in or create an account.", ' ', " ", accountInfoLink, " about the benefits of having an account.");
    }
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Divider.default, {
      className: classes.loginContentsDivider
    }), /*#__PURE__*/_react.default.createElement("div", null, message, renderValidation()));
  };
  return /*#__PURE__*/_react.default.createElement(_InfoMessageCard.default, _extends({}, props, {
    title: "Login Required",
    classes: {
      card: classes.card,
      secondaryIcon: classes.cardSecondaryIcon
    },
    messageContent: renderContents()
  }));
};
LoginRequiredCard.defaultProps = {
  isAuthenticated: false,
  details: undefined,
  showValidation: true,
  accountValidated: undefined,
  accountValidationSteps: undefined
};
var _default = exports.default = LoginRequiredCard;