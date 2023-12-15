"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _Chip = _interopRequireDefault(require("@material-ui/core/Chip"));
var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));
var _styles = require("@material-ui/core/styles");
var _reactFontawesome = require("@fortawesome/react-fontawesome");
var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /* eslint-disable react/require-default-props */
const useStyles = (0, _styles.makeStyles)(theme =>
// eslint-disable-next-line implicit-arrow-linebreak
(0, _styles.createStyles)({
  releaseIcon: {
    color: theme.colors.LIGHT_BLUE[600],
    fontSize: '1em',
    marginRight: theme.spacing(0.75)
  },
  releaseChip: {
    color: theme.colors.LIGHT_BLUE[600],
    border: "1px solid ".concat(theme.colors.LIGHT_BLUE[600]),
    backgroundColor: theme.colors.LIGHT_BLUE[50],
    fontWeight: 600,
    cursor: 'help'
  }
}));
const ReleaseChip = props => {
  const classes = useStyles(_Theme.default);
  const {
    tooltipTitle,
    chipLabel,
    classes: customClasses,
    chipStyle,
    tooltipProps
  } = props;
  const injectedChipClass = customClasses ? customClasses.chip : undefined;
  const injectedChipIconClass = customClasses ? customClasses.icon : undefined;
  return /*#__PURE__*/_react.default.createElement(_Tooltip.default, _extends({}, tooltipProps, {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    title: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, tooltipTitle)
  }), /*#__PURE__*/_react.default.createElement(_Chip.default, {
    size: "small",
    className: injectedChipClass || classes.releaseChip,
    style: chipStyle,
    label: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactFontawesome.FontAwesomeIcon, {
      icon: _freeSolidSvgIcons.faTag,
      size: "1x",
      className: injectedChipIconClass || classes.releaseIcon
    }), chipLabel)
  }));
};
var _default = exports.default = ReleaseChip;