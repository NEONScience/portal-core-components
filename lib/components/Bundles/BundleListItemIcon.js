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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    bundleIcon: {
      padding: '5px',
      marginRight: theme.spacing(2)
    }
  };
});
var BundleListItemIcon = function BundleListItemIcon(props) {
  var classes = useStyles(_Theme.default);
  var isSplit = props.isSplit;
  return /*#__PURE__*/_react.default.createElement(_ListItemIcon.default, null, /*#__PURE__*/_react.default.createElement(_reactFontawesome.FontAwesomeIcon, {
    icon: isSplit ? _freeSolidSvgIcons.faBoxesStacked : _freeSolidSvgIcons.faBox,
    size: "2x",
    className: classes.bundleIcon
  }));
};
BundleListItemIcon.defaultProps = {
  isSplit: false
};
var _default = BundleListItemIcon;
exports.default = _default;