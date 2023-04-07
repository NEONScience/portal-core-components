"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MessageCardType = void 0;
var _react = _interopRequireDefault(require("react"));
var _Card = _interopRequireDefault(require("@material-ui/core/Card"));
var _CardContent = _interopRequireDefault(require("@material-ui/core/CardContent"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _styles = require("@material-ui/core/styles");
var _InfoOutlined = _interopRequireDefault(require("@material-ui/icons/InfoOutlined"));
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
      titleContentContainer: {
        padding: muiTheme.spacing(2, 2.75, 1.5, 2.5)
      },
      textTitleContent: {
        flexGrow: 1,
        textTransform: 'uppercase',
        fontSize: '0.775rem'
      },
      messageContainer: {
        padding: muiTheme.spacing(0, 3, 3, 3)
      }
    })
  );
});
var MessageCardType = /*#__PURE__*/function (MessageCardType) {
  MessageCardType["INFO"] = "INFO";
  return MessageCardType;
}({});
exports.MessageCardType = MessageCardType;
var BaseMessageCard = function BaseMessageCard(props) {
  var classes = useStyles(_Theme.default);
  var type = props.type,
    messageCardClasses = props.messageCardClasses,
    icon = props.icon,
    title = props.title,
    titleContent = props.titleContent,
    message = props.message,
    messageContent = props.messageContent;
  var appliedTitleContentContainer = classes.titleContentContainer;
  if (messageCardClasses && messageCardClasses.cardTitleContentContainer) {
    appliedTitleContentContainer = messageCardClasses.cardTitleContentContainer;
  }
  var iconContent = /*#__PURE__*/_react.default.createElement(_InfoOutlined.default, {
    fontSize: "small",
    className: messageCardClasses.primaryIcon
  });
  var secondaryIconContent = null;
  switch (type) {
    case MessageCardType.INFO:
      if ((0, _typeUtil.exists)(icon)) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        iconContent = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, icon);
      }
      secondaryIconContent = /*#__PURE__*/_react.default.createElement(_InfoOutlined.default, {
        fontSize: "large",
        className: messageCardClasses.secondaryIcon
      });
      break;
    default:
      break;
  }
  var renderTitle = function renderTitle() {
    var titleTextContent = null;
    if ((0, _typeUtil.isStringNonEmpty)(title)) {
      titleTextContent = /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle2",
        className: classes.textTitleContent
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
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, iconContent, titleTextContent, appliedTitleContent, secondaryIconContent);
  };
  var renderMessage = function renderMessage() {
    var hasCustomClass = messageCardClasses && messageCardClasses.messageContentContainer;
    var injectedMessageContainerClass = hasCustomClass ? messageCardClasses.messageContentContainer : classes.messageContainer;
    if ((0, _typeUtil.exists)(messageContent)) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: injectedMessageContainerClass
      }, messageContent);
    }
    if ((0, _typeUtil.isStringNonEmpty)(message)) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: injectedMessageContainerClass
      }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body2"
      }, message));
    }
    return null;
  };
  var content = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_CardContent.default, {
    className: "".concat(classes.startFlex, " ").concat(appliedTitleContentContainer)
  }, renderTitle()), renderMessage());
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Card.default, {
    className: messageCardClasses.card
  }, content));
};
var _default = BaseMessageCard;
exports.default = _default;