"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _styles = require("@material-ui/core/styles");
var _reactFontawesome = require("@fortawesome/react-fontawesome");
var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");
var _InfoMessageCard = _interopRequireDefault(require("./InfoMessageCard"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /* eslint-disable react/require-default-props */
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return (
    // eslint-disable-next-line implicit-arrow-linebreak
    (0, _styles.createStyles)({
      cardSecondaryIcon: {
        color: 'rgba(138, 191, 236, 0.9)',
        // theme.colors.LIGHT_BLUE[200] with 'a' value applied
        marginLeft: theme.spacing(2),
        fontSize: '1.875rem !important'
      },
      customIcon: {
        color: 'rgba(0, 0, 0, 0.9)',
        padding: '5px',
        fontSize: '1.5em',
        marginRight: theme.spacing(2)
      }
    })
  );
});
var InfoCard = function InfoCard(props) {
  var classes = useStyles(_Theme.default);
  return /*#__PURE__*/_react.default.createElement(_InfoMessageCard.default, _extends({}, props, {
    title: "Data Product Release",
    classes: {
      secondaryIcon: classes.secondaryIcon
    },
    icon: /*#__PURE__*/_react.default.createElement(_reactFontawesome.FontAwesomeIcon, {
      icon: _freeSolidSvgIcons.faTag,
      size: "1x",
      className: classes.customIcon
    })
  }));
};
var _default = InfoCard;
exports.default = _default;