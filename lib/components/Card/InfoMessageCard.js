"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _styles = require("@material-ui/core/styles");
var _BaseMessageCard = _interopRequireWildcard(require("./BaseMessageCard"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /* eslint-disable react/require-default-props */
var useStyles = (0, _styles.makeStyles)(function (muiTheme) {
  return (
    // eslint-disable-next-line implicit-arrow-linebreak
    (0, _styles.createStyles)({
      card: {
        margin: muiTheme.spacing(0.5, 0, 3, 0),
        backgroundColor: 'rgba(230, 241, 251, 0.5)',
        // theme.colors.LIGHT_BLUE[50] with 'a' value applied
        borderColor: 'rgba(138, 191, 236, 0.5)' // theme.colors.LIGHT_BLUE[200] with 'a' value applied
      },

      primaryIcon: {
        marginRight: muiTheme.spacing(2)
      },
      secondaryIcon: {
        color: 'rgba(138, 191, 236, 0.9)',
        // theme.colors.LIGHT_BLUE[200] with 'a' value applied
        marginLeft: muiTheme.spacing(2)
      }
    })
  );
});
var InfoCard = function InfoCard(props) {
  var classes = useStyles(_Theme.default);
  var messageCardClasses = props.classes;
  var injectedCard = messageCardClasses ? messageCardClasses.card : undefined;
  var injectedPrimaryIcon = messageCardClasses ? messageCardClasses.primaryIcon : undefined;
  var injectedSecondaryIcon = messageCardClasses ? messageCardClasses.secondaryIcon : undefined;
  return /*#__PURE__*/_react.default.createElement(_BaseMessageCard.default, _extends({}, props, {
    type: _BaseMessageCard.MessageCardType.INFO,
    messageCardClasses: {
      card: injectedCard || classes.card,
      primaryIcon: injectedPrimaryIcon || classes.primaryIcon,
      secondaryIcon: injectedSecondaryIcon || classes.secondaryIcon,
      cardTitleContentContainer: messageCardClasses === null || messageCardClasses === void 0 ? void 0 : messageCardClasses.cardTitleContentContainer,
      messageContentContainer: messageCardClasses === null || messageCardClasses === void 0 ? void 0 : messageCardClasses.messageContentContainer
    }
  }));
};
var _default = InfoCard;
exports.default = _default;