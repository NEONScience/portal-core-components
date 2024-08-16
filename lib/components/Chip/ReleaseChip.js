"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _Chip = _interopRequireDefault(require("@mui/material/Chip"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _styles = require("@mui/styles");
var _reactFontawesome = require("@fortawesome/react-fontawesome");
var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/* eslint-disable react/require-default-props */

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
    border: `1px solid ${theme.colors.LIGHT_BLUE[600]}`,
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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
    ...tooltipProps,
    // eslint-disable-next-line react/jsx-no-useless-fragment
    title: /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
      children: tooltipTitle
    }),
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Chip.default, {
      size: "small",
      className: injectedChipClass || classes.releaseChip,
      style: chipStyle,
      label: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactFontawesome.FontAwesomeIcon, {
          icon: _freeSolidSvgIcons.faTag,
          size: "1x",
          className: injectedChipIconClass || classes.releaseIcon
        }), chipLabel]
      })
    })
  });
};
var _default = exports.default = ReleaseChip;