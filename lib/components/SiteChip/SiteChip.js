"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/styles");
var _Chip = _interopRequireDefault(require("@mui/material/Chip"));
var _Avatar = _interopRequireDefault(require("@mui/material/Avatar"));
var _Place = _interopRequireDefault(require("@mui/icons-material/Place"));
var _Cancel = _interopRequireDefault(require("@mui/icons-material/Cancel"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
    label,
    ...otherProps
  } = props;

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

  // Backwards compatible with MUI v4
  if (otherProps.variant === 'default') {
    otherProps.variant = 'filled';
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
  if (otherProps.variant === 'outlined') {
    chipStyle.backgroundColor = 'transparent';
  } else if (otherProps.variant === 'filled' && otherProps.color === 'secondary') {
    chipStyle.backgroundColor = _Theme.default.palette.secondary.main;
  } else if (otherProps.variant === 'filled' && otherProps.color === 'primary') {
    chipStyle.backgroundColor = _Theme.default.palette.primary.main;
  }
  const deleteIconStyle = {};
  let avatarClass = null;
  if (otherProps.size === 'large') {
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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Chip.default, {
    ...otherProps,
    label: label,
    style: chipStyle,
    avatar: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Avatar.default, {
      className: avatarClass,
      style: avatarStyle,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Place.default, {})
    }),
    deleteIcon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Cancel.default, {
      style: deleteIconStyle
    }),
    classes: chipClasses
  });
};
SiteChip.propTypes = {
  label: _propTypes.default.string.isRequired
};
const WrappedSiteChip = _Theme.default.getWrappedComponent(SiteChip);
var _default = exports.default = WrappedSiteChip;