"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _ListItemIcon = _interopRequireDefault(require("@material-ui/core/ListItemIcon"));
var _styles = require("@material-ui/core/styles");
var _reactFontawesome = require("@fortawesome/react-fontawesome");
var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const useStyles = (0, _styles.makeStyles)(theme => ({
  bundleIcon: {
    padding: '5px',
    marginRight: theme.spacing(2)
  }
}));
const BundleListItemIcon = props => {
  const classes = useStyles(_Theme.default);
  const {
    isSplit
  } = props;
  return /*#__PURE__*/_react.default.createElement(_ListItemIcon.default, null, /*#__PURE__*/_react.default.createElement(_reactFontawesome.FontAwesomeIcon, {
    icon: isSplit ? _freeSolidSvgIcons.faBoxesStacked : _freeSolidSvgIcons.faBox,
    size: "2x",
    className: classes.bundleIcon
  }));
};
BundleListItemIcon.defaultProps = {
  isSplit: false
};
var _default = exports.default = BundleListItemIcon;