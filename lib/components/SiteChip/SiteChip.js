'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styles = require('@material-ui/core/styles');

var _Chip = require('@material-ui/core/Chip');

var _Chip2 = _interopRequireDefault(_Chip);

var _Avatar = require('@material-ui/core/Avatar');

var _Avatar2 = _interopRequireDefault(_Avatar);

var _Place = require('@material-ui/icons/Place');

var _Place2 = _interopRequireDefault(_Place);

var _Cancel = require('@material-ui/icons/Cancel');

var _Cancel2 = _interopRequireDefault(_Cancel);

var _Theme = require('../Theme/Theme');

var _Theme2 = _interopRequireDefault(_Theme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

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
  var classes = useStyles(_Theme2.default);
  var chipClasses = useChipStyles(_Theme2.default);

  var label = props.label,
      otherProps = _objectWithoutProperties(props, ['label']);

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
  var avatarStyle = {
    width: '32px',
    height: '32px',
    marginLeft: '0px'
  };
  if (['primary', 'secondary'].includes(otherProps.color)) {
    avatarStyle.backgroundColor = _Theme2.default.palette[otherProps.color].main;
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

  return _react2.default.createElement(_Chip2.default, _extends({}, otherProps, {
    label: label,
    style: chipStyle,
    avatar: _react2.default.createElement(
      _Avatar2.default,
      { className: avatarClass, style: avatarStyle },
      _react2.default.createElement(_Place2.default, null)
    ),
    deleteIcon: _react2.default.createElement(_Cancel2.default, { style: deleteIconStyle }),
    classes: chipClasses
  }));
};

SiteChip.propTypes = {
  label: _propTypes2.default.string.isRequired
};

exports.default = SiteChip;