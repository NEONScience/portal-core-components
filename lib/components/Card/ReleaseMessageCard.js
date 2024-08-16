"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _styles = require("@mui/styles");
var _reactFontawesome = require("@fortawesome/react-fontawesome");
var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");
var _InfoMessageCard = _interopRequireDefault(require("./InfoMessageCard"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/* eslint-disable react/require-default-props */

const useStyles = (0, _styles.makeStyles)(theme =>
// eslint-disable-next-line implicit-arrow-linebreak
(0, _styles.createStyles)({
  customIcon: {
    color: 'rgba(0, 0, 0, 0.9)',
    padding: '5px',
    fontSize: '1.5em',
    marginRight: theme.spacing(2)
  }
}));
const ReleaseMessageCard = props => {
  const classes = useStyles(_Theme.default);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_InfoMessageCard.default, {
    ...props,
    title: "Data Product Release",
    icon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactFontawesome.FontAwesomeIcon, {
      icon: _freeSolidSvgIcons.faTag,
      size: "1x",
      className: classes.customIcon
    })
  });
};
var _default = exports.default = ReleaseMessageCard;