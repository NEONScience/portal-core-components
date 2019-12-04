'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Avatar = require('@material-ui/core/Avatar');

var _Avatar2 = _interopRequireDefault(_Avatar);

var _Theme = require('../Theme/Theme');

var _Theme2 = _interopRequireDefault(_Theme);

var _atmosphere = require('./svg_optimized/atmosphere.svg');

var _atmosphere2 = _interopRequireDefault(_atmosphere);

var _biogeochemistry = require('./svg_optimized/biogeochemistry.svg');

var _biogeochemistry2 = _interopRequireDefault(_biogeochemistry);

var _ecohydrology = require('./svg_optimized/ecohydrology.svg');

var _ecohydrology2 = _interopRequireDefault(_ecohydrology);

var _landcover = require('./svg_optimized/landcover.svg');

var _landcover2 = _interopRequireDefault(_landcover);

var _organisms = require('./svg_optimized/organisms.svg');

var _organisms2 = _interopRequireDefault(_organisms);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var dataThemes = {
  atmosphere: {
    title: 'Atmosphere',
    aliases: ['atmos'],
    src: _atmosphere2.default
  },
  biogeochemistry: {
    title: 'Biogeochemistry',
    aliases: ['bigeo'],
    src: _biogeochemistry2.default
  },
  ecohydrology: {
    title: 'Ecohydrology',
    aliases: ['ecohydro'],
    src: _ecohydrology2.default
  },
  landcover: {
    title: 'Land Cover & Processes',
    aliases: ['landuse', 'Land Use, Land Cover, and Land Processes'],
    src: _landcover2.default
  },
  organisms: {
    title: 'Organisms, Populations, and Communities',
    aliases: [],
    src: _organisms2.default
  }
};

var DataThemeIcon = function DataThemeIcon(props) {
  var theme = props.theme,
      size = props.size,
      avatar = props.avatar,
      className = props.className,
      other = _objectWithoutProperties(props, ['theme', 'size', 'avatar', 'className']);

  var dataTheme = dataThemes[theme] || Object.values(dataThemes).find(function (entry) {
    return theme === entry.title || entry.aliases.includes(theme);
  });
  var elementProps = {
    src: dataTheme.src,
    alt: dataTheme.title,
    title: dataTheme.title,
    className: className,
    'data-selenium': 'data-theme-icon.' + theme
  };

  if (avatar) {
    return _react2.default.createElement(_Avatar2.default, _extends({
      style: { width: _Theme2.default.spacing(size), height: _Theme2.default.spacing(size) }
    }, elementProps));
  }
  return _react2.default.createElement('img', _extends({ // eslint-disable-line jsx-a11y/alt-text
    width: _Theme2.default.spacing(size),
    height: _Theme2.default.spacing(size)
  }, elementProps, other));
};

// Data Themes do not have IDs. In order to support identifying a theme
// by its full title, abbreviated name, or other known aliases we build
// a full list of all supported aliases here to feed PropTypes.
var dataThemeAliases = [].concat(_toConsumableArray(Object.keys(dataThemes)), _toConsumableArray(Object.values(dataThemes).map(function (theme) {
  return theme.aliases.concat(theme.title);
}).flat()));

DataThemeIcon.propTypes = {
  theme: _propTypes2.default.oneOf(dataThemeAliases).isRequired,
  size: _propTypes2.default.number,
  avatar: _propTypes2.default.bool,
  className: _propTypes2.default.string
};

DataThemeIcon.defaultProps = {
  size: 5,
  avatar: false,
  className: null
};

exports.default = DataThemeIcon;