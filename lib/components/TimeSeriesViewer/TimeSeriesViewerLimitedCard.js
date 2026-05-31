"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _Link = _interopRequireDefault(require("@material-ui/core/Link"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _styles = require("@material-ui/core/styles");
var _LoginRequiredCard = _interopRequireDefault(require("../Card/LoginRequiredCard"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _NeonSignInButton = _interopRequireDefault(require("../NeonSignInButton/NeonSignInButton"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _RouteService = _interopRequireDefault(require("../../service/RouteService"));
var _typeUtil = require("../../util/typeUtil");
var _TimeSeriesViewerContext = _interopRequireDefault(require("./TimeSeriesViewerContext"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const useStyles = (0, _styles.makeStyles)(theme => (0, _styles.createStyles)({
  messageContent: {
    margin: theme.spacing(0, 0, 2, 0)
  },
  messageContentNoMargin: {
    margin: theme.spacing(0, 0, 0, 0)
  }
}));
const TimeSeriesViewerLimitedCard = props => {
  const {
    showInfoOnly
  } = props;
  // @ts-ignore
  const [state] = _TimeSeriesViewerContext.default.useTimeSeriesViewerState();
  const neonContextSessionState = _NeonContext.default.useNeonContextSessionState();
  const classes = useStyles(_Theme.default);
  if (!state.isViewerLimitedMode) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
  }
  const myAccountLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
    target: "_blank",
    href: _NeonEnvironment.default.route.buildAccountRoute()
  }, "My Account");
  const accountInfoLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
    target: "_blank",
    href: _RouteService.default.getUserAccountsPath()
  }, "Learn");
  const renderTitle = () => {
    if ((0, _typeUtil.isStringNonEmpty)(state.release)) {
      return 'Login Required';
    }
    return 'Viewing Limited Time Series Data - Login Required';
  };
  const renderContents = () => {
    let details = "The time series viewer is displaying a limited dataset that does not\n      reflect the actual data availability for this data product. You must sign in or create\n      and validate an account before viewing the full dataset for this data product.\n      ";
    if ((0, _typeUtil.isStringNonEmpty)(state.release)) {
      details = 'You must sign in or create and validate an account before viewing release data.';
    }
    const appliedMessageContentClass = showInfoOnly === true ? classes.messageContentNoMargin : classes.messageContent;
    return /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2",
      className: appliedMessageContentClass
    }, details, ' ', " Navigate to ", myAccountLink, " to sign in or create an account.", ' ', " ", accountInfoLink, " about the benefits of having an account.");
  };
  const renderSignInButton = () => {
    if (showInfoOnly === true) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
    }
    if (neonContextSessionState.authenticated === true) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
    }
    return /*#__PURE__*/_react.default.createElement(_NeonSignInButton.default, {
      disableMargin: true
    });
  };
  return /*#__PURE__*/_react.default.createElement(_LoginRequiredCard.default, {
    showValidation: showInfoOnly !== true,
    customTitle: renderTitle(),
    customContent: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderContents(), renderSignInButton()),
    isAuthenticated: neonContextSessionState.authenticated,
    accountValidated: neonContextSessionState.accountValidated,
    accountValidationSteps: neonContextSessionState.accountValidationSteps
  });
};
TimeSeriesViewerLimitedCard.defaultProps = {
  showInfoOnly: undefined
};
var _default = exports.default = TimeSeriesViewerLimitedCard;