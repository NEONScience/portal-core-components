"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@material-ui/core/styles");
var _Chip = _interopRequireDefault(require("@material-ui/core/Chip"));
var _Avatar = _interopRequireDefault(require("@material-ui/core/Avatar"));
var _Place = _interopRequireDefault(require("@material-ui/icons/Place"));
var _Cancel = _interopRequireDefault(require("@material-ui/icons/Cancel"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
const _excluded = ["label"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
const useStyles = (0, _styles.makeStyles)(theme => ({
  avatarLarge: {
    '& svg': {
      height: theme.spacing(3)
    }
  }
}));
const useChipStyles = (0, _styles.makeStyles)(theme => ({
  outlined: {
    color: theme.palette.grey.A200
  },
  outlinedPrimary: {
    color: theme.palette.primary.main
  },
  outlinedSecondary: {
    color: theme.palette.secondary.main
  }
}));
const SiteChip = props => {
  const classes = useStyles(_Theme.default);
  const chipClasses = useChipStyles(_Theme.default);
  const {
      label
    } = props,
    otherProps = _objectWithoutPropertiesLoose(props, _excluded);

  // Default optional props
  if (!otherProps.color) {
    otherProps.color = 'secondary';
  }
  if (!otherProps.variant) {
    otherProps.variant = 'outlined';
  }
  if (!otherProps.size) {
    otherProps.size = 'small';
  }
  if (!otherProps['data-selenium']) {
    otherProps['data-selenium'] = 'site-chip';
  }

  /*
    Avatar style overrides
    Material UI has a bug where Avatars in chips do not inherit styles correctly
    in production due to CSS class definition order and strict specificity. See here:
    https://github.com/mui-org/material-ui/issues/16374
    Should that get fixed upstream then all inline styles on <Avatar> can be removed.
    There is also no 'large' size despite having a small and medium, and we have
    use cases for large (see DataProductAvailability).
  */
  const avatarStyle = {
    width: '32px',
    height: '32px',
    marginLeft: '0px'
  };
  if (['primary', 'secondary'].includes(otherProps.color)) {
    avatarStyle.backgroundColor = _Theme.default.palette[otherProps.color].main;
  }
  if (otherProps.size === 'small') {
    avatarStyle.width = '24px';
    avatarStyle.height = '24px';
  }

  /*
    General style overrides
    There is also 'large' size despite having a small and medium, and we have
    use cases for large (see DataProductAvailability).
  */
  const chipStyle = {};
  const deleteIconStyle = {};
  let avatarClass = null;
  if (otherProps.size === 'large') {
    otherProps.size = null; // to prevent a PropTypes error in Mui/Chip
    avatarClass = classes.avatarLarge;
    chipStyle.fontSize = '1rem';
    chipStyle.borderRadius = '20px';
    chipStyle.height = '40px';
    avatarStyle.width = '40px';
    avatarStyle.height = '40px';
    deleteIconStyle.width = '32px';
    deleteIconStyle.height = '32px';
    deleteIconStyle.margin = '0 6px 0 0';
  }
  return /*#__PURE__*/_react.default.createElement(_Chip.default, _extends({}, otherProps, {
    label: label,
    style: chipStyle,
    avatar: /*#__PURE__*/_react.default.createElement(_Avatar.default, {
      className: avatarClass,
      style: avatarStyle
    }, /*#__PURE__*/_react.default.createElement(_Place.default, null)),
    deleteIcon: /*#__PURE__*/_react.default.createElement(_Cancel.default, {
      style: deleteIconStyle
    }),
    classes: chipClasses
  }));
};
SiteChip.propTypes = {
  label: _propTypes.default.string.isRequired
};
const WrappedSiteChip = _Theme.default.getWrappedComponent(SiteChip);
var _default = exports.default = WrappedSiteChip;