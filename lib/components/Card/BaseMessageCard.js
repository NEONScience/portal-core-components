"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MessageCardType = void 0;
var _react = _interopRequireDefault(require("react"));
var _Card = _interopRequireDefault(require("@mui/material/Card"));
var _CardContent = _interopRequireDefault(require("@mui/material/CardContent"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _styles = require("@mui/styles");
var _InfoOutlined = _interopRequireDefault(require("@mui/icons-material/InfoOutlined"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _typeUtil = require("../../util/typeUtil");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/* eslint-disable react/require-default-props */

const useStyles = (0, _styles.makeStyles)(muiTheme =>
// eslint-disable-next-line implicit-arrow-linebreak
(0, _styles.createStyles)({
  startFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  titleContentContainer: {
    padding: muiTheme.spacing(2, 2.5, 1.5, 2.5)
  },
  textTitleContent: {
    flexGrow: 1,
    textTransform: 'uppercase',
    fontSize: '0.775rem'
  },
  messageContainer: {
    padding: muiTheme.spacing(0, 3, 3, 3)
  }
}));
let MessageCardType = exports.MessageCardType = /*#__PURE__*/function (MessageCardType) {
  MessageCardType["INFO"] = "INFO";
  return MessageCardType;
}({});
const BaseMessageCard = props => {
  const classes = useStyles(_Theme.default);
  const {
    type,
    messageCardClasses,
    icon,
    title,
    titleContent,
    message,
    messageContent
  } = props;
  let appliedTitleContentContainer = classes.titleContentContainer;
  if (messageCardClasses && messageCardClasses.cardTitleContentContainer) {
    appliedTitleContentContainer = messageCardClasses.cardTitleContentContainer;
  }
  let iconContent = /*#__PURE__*/(0, _jsxRuntime.jsx)(_InfoOutlined.default, {
    fontSize: "small",
    className: messageCardClasses.primaryIcon
  });
  let secondaryIconContent = null;
  switch (type) {
    case MessageCardType.INFO:
      if ((0, _typeUtil.exists)(icon)) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        iconContent = /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
          children: icon
        });
      }
      secondaryIconContent = /*#__PURE__*/(0, _jsxRuntime.jsx)(_InfoOutlined.default, {
        fontSize: "large",
        className: messageCardClasses.secondaryIcon
      });
      break;
    default:
      break;
  }
  const renderTitle = () => {
    let titleTextContent = null;
    if ((0, _typeUtil.isStringNonEmpty)(title)) {
      titleTextContent = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "subtitle2",
        className: classes.textTitleContent,
        children: title
      });
    }
    let appliedTitleContent = null;
    if ((0, _typeUtil.exists)(titleContent)) {
      appliedTitleContent = /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        style: {
          flexGrow: 1
        },
        children: titleContent
      });
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: [iconContent, titleTextContent, appliedTitleContent, secondaryIconContent]
    });
  };
  const renderMessage = () => {
    const hasCustomClass = messageCardClasses && messageCardClasses.messageContentContainer;
    const injectedMessageContainerClass = hasCustomClass ? messageCardClasses.messageContentContainer : classes.messageContainer;
    if ((0, _typeUtil.exists)(messageContent)) {
      return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: injectedMessageContainerClass,
        children: messageContent
      });
    }
    if ((0, _typeUtil.isStringNonEmpty)(message)) {
      return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: injectedMessageContainerClass,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "body2",
          children: message
        })
      });
    }
    return null;
  };
  const content = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_CardContent.default, {
      className: `${classes.startFlex} ${appliedTitleContentContainer}`,
      children: renderTitle()
    }), renderMessage()]
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Card.default, {
      className: messageCardClasses.card,
      children: content
    })
  });
};
var _default = exports.default = BaseMessageCard;