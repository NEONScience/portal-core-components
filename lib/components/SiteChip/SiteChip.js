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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    avatarLarge: {
      '& svg': {
        height: theme.spacing(3)
      }
    }
  };
});
var useChipStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    outlined: {
      color: theme.palette.grey.A200
    },
    outlinedPrimary: {
      color: theme.palette.primary.main
    },
    outlinedSecondary: {
      color: theme.palette.secondary.main
    }
  };
});

var SiteChip = function SiteChip(props) {
  var classes = useStyles(_Theme.default);
  var chipClasses = useChipStyles(_Theme.default);

  var label = props.label,
      otherProps = _objectWithoutProperties(props, ["label"]); // Default optional props


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


  var avatarStyle = {
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


  var chipStyle = {};
  var deleteIconStyle = {};
  var avatarClass = null;

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

var WrappedSiteChip = _Theme.default.getWrappedComponent(SiteChip);

var _default = WrappedSiteChip;
exports.default = _default;