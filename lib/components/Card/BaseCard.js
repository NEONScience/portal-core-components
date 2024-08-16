"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CardType = void 0;
var _react = _interopRequireDefault(require("react"));
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _Card = _interopRequireDefault(require("@mui/material/Card"));
var _CardContent = _interopRequireDefault(require("@mui/material/CardContent"));
var _Divider = _interopRequireDefault(require("@mui/material/Divider"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _styles = require("@mui/styles");
var _Info = _interopRequireDefault(require("@mui/icons-material/Info"));
var _Warning = _interopRequireDefault(require("@mui/icons-material/Warning"));
var _Error = _interopRequireDefault(require("@mui/icons-material/Error"));
var _Autorenew = _interopRequireDefault(require("@mui/icons-material/Autorenew"));
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
  divider: {
    margin: muiTheme.spacing(0, 3, 0, 3)
  },
  messageContainer: {
    padding: muiTheme.spacing(3, 3, 3, 3)
  }
}));
let CardType = exports.CardType = /*#__PURE__*/function (CardType) {
  CardType["INFO"] = "INFO";
  CardType["WARN"] = "WARN";
  CardType["ERROR"] = "ERROR";
  return CardType;
}({});
const BaseCard = props => {
  const classes = useStyles(_Theme.default);
  const {
    type,
    title,
    calloutClasses,
    message,
    titleContent,
    actionLabel,
    onActionClick
  } = props;
  let iconContent = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Info.default, {
    fontSize: "large",
    className: calloutClasses.calloutIcon
  });
  switch (type) {
    case CardType.WARN:
      iconContent = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Warning.default, {
        fontSize: "large",
        className: calloutClasses.calloutIcon
      });
      break;
    case CardType.ERROR:
      iconContent = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Error.default, {
        fontSize: "large",
        className: calloutClasses.calloutIcon
      });
      break;
    case CardType.INFO:
    default:
      break;
  }
  const renderTitle = () => {
    let titleTextContent = null;
    if ((0, _typeUtil.isStringNonEmpty)(title)) {
      titleTextContent = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "subtitle2",
        style: {
          flexGrow: 1
        },
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
    let action;
    const appliedLabel = (0, _typeUtil.isStringNonEmpty)(actionLabel) ? actionLabel : 'Reset';
    if ((0, _typeUtil.exists)(onActionClick)) {
      action = /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
          variant: "outlined",
          onClick: onActionClick,
          startIcon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Autorenew.default, {}),
          children: appliedLabel
        })
      });
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: [iconContent, titleTextContent, appliedTitleContent, action]
    });
  };
  const content = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_CardContent.default, {
      className: classes.startFlex,
      children: renderTitle()
    }), (0, _typeUtil.isStringNonEmpty)(message) ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Divider.default, {
        className: classes.divider
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: classes.messageContainer,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "body2",
          children: message
        })
      })]
    }) : null]
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Card.default, {
      className: calloutClasses.callout,
      children: content
    })
  });
};
var _default = exports.default = BaseCard;