"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CardType = void 0;
var _react = _interopRequireDefault(require("react"));
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _Card = _interopRequireDefault(require("@material-ui/core/Card"));
var _CardContent = _interopRequireDefault(require("@material-ui/core/CardContent"));
var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _styles = require("@material-ui/core/styles");
var _Info = _interopRequireDefault(require("@material-ui/icons/Info"));
var _Warning = _interopRequireDefault(require("@material-ui/icons/Warning"));
var _Error = _interopRequireDefault(require("@material-ui/icons/Error"));
var _Autorenew = _interopRequireDefault(require("@material-ui/icons/Autorenew"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _typeUtil = require("../../util/typeUtil");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable react/require-default-props */

var useStyles = (0, _styles.makeStyles)(function (muiTheme) {
  return (
    // eslint-disable-next-line implicit-arrow-linebreak
    (0, _styles.createStyles)({
      startFlex: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center'
      },
      divider: {
        margin: muiTheme.spacing(0, 3, 0, 3)
      },
      messageContainer: {
        padding: muiTheme.spacing(3, 3, 3, 3)
      }
    })
  );
});
var CardType;
exports.CardType = CardType;
(function (CardType) {
  CardType["INFO"] = "INFO";
  CardType["WARN"] = "WARN";
  CardType["ERROR"] = "ERROR";
})(CardType || (exports.CardType = CardType = {}));
var BaseCard = function BaseCard(props) {
  var classes = useStyles(_Theme.default);
  var type = props.type,
    title = props.title,
    calloutClasses = props.calloutClasses,
    message = props.message,
    titleContent = props.titleContent,
    actionLabel = props.actionLabel,
    onActionClick = props.onActionClick;
  var iconContent = /*#__PURE__*/_react.default.createElement(_Info.default, {
    fontSize: "large",
    className: calloutClasses.calloutIcon
  });
  switch (type) {
    case CardType.WARN:
      iconContent = /*#__PURE__*/_react.default.createElement(_Warning.default, {
        fontSize: "large",
        className: calloutClasses.calloutIcon
      });
      break;
    case CardType.ERROR:
      iconContent = /*#__PURE__*/_react.default.createElement(_Error.default, {
        fontSize: "large",
        className: calloutClasses.calloutIcon
      });
      break;
    case CardType.INFO:
    default:
      break;
  }
  var renderTitle = function renderTitle() {
    var titleTextContent = null;
    if ((0, _typeUtil.isStringNonEmpty)(title)) {
      titleTextContent = /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle2",
        style: {
          flexGrow: 1
        }
      }, title);
    }
    var appliedTitleContent = null;
    if ((0, _typeUtil.exists)(titleContent)) {
      appliedTitleContent = /*#__PURE__*/_react.default.createElement("div", {
        style: {
          flexGrow: 1
        }
      }, titleContent);
    }
    var action;
    var appliedLabel = (0, _typeUtil.isStringNonEmpty)(actionLabel) ? actionLabel : 'Reset';
    if ((0, _typeUtil.exists)(onActionClick)) {
      action = /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Button.default, {
        variant: "outlined",
        onClick: onActionClick,
        startIcon: /*#__PURE__*/_react.default.createElement(_Autorenew.default, null)
      }, appliedLabel));
    }
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, iconContent, titleTextContent, appliedTitleContent, action);
  };
  var content = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_CardContent.default, {
    className: classes.startFlex
  }, renderTitle()), (0, _typeUtil.isStringNonEmpty)(message) ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Divider.default, {
    className: classes.divider
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.messageContainer
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2"
  }, message))) : null);
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Card.default, {
    className: calloutClasses.callout
  }, content));
};
var _default = BaseCard;
exports.default = _default;