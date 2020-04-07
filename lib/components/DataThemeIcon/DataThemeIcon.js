"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Avatar = _interopRequireDefault(require("@material-ui/core/Avatar"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _atmosphere = _interopRequireDefault(require("./svg_optimized/atmosphere.svg"));

var _biogeochemistry = _interopRequireDefault(require("./svg_optimized/biogeochemistry.svg"));

var _ecohydrology = _interopRequireDefault(require("./svg_optimized/ecohydrology.svg"));

var _landcover = _interopRequireDefault(require("./svg_optimized/landcover.svg"));

var _organisms = _interopRequireDefault(require("./svg_optimized/organisms.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var dataThemes = {
  atmosphere: {
    title: 'Atmosphere',
    aliases: ['atmos'],
    src: _atmosphere.default
  },
  biogeochemistry: {
    title: 'Biogeochemistry',
    aliases: ['bigeo'],
    src: _biogeochemistry.default
  },
  ecohydrology: {
    title: 'Ecohydrology',
    aliases: ['ecohydro'],
    src: _ecohydrology.default
  },
  landcover: {
    title: 'Land Cover & Processes',
    aliases: ['landuse', 'Land Use, Land Cover, and Land Processes'],
    src: _landcover.default
  },
  organisms: {
    title: 'Organisms, Populations, and Communities',
    aliases: [],
    src: _organisms.default
  }
};

var DataThemeIcon = function DataThemeIcon(props) {
  var theme = props.theme,
      size = props.size,
      avatar = props.avatar,
      className = props.className,
      other = _objectWithoutProperties(props, ["theme", "size", "avatar", "className"]);

  var dataTheme = dataThemes[theme] || Object.values(dataThemes).find(function (entry) {
    return theme === entry.title || entry.aliases.includes(theme);
  });
  var elementProps = {
    src: dataTheme.src,
    alt: dataTheme.title,
    title: dataTheme.title,
    className: className,
    'data-selenium': "data-theme-icon.".concat(theme)
  };

  if (avatar) {
    return /*#__PURE__*/_react.default.createElement(_Avatar.default, _extends({
      style: {
        width: _Theme.default.spacing(size),
        height: _Theme.default.spacing(size)
      }
    }, elementProps));
  }

  return /*#__PURE__*/_react.default.createElement("img", _extends({
    // eslint-disable-line jsx-a11y/alt-text
    width: _Theme.default.spacing(size),
    height: _Theme.default.spacing(size)
  }, elementProps, other));
}; // Data Themes do not have IDs. In order to support identifying a theme
// by its full title, abbreviated name, or other known aliases we build
// a full list of all supported aliases here to feed PropTypes.


var dataThemeAliases = [].concat(_toConsumableArray(Object.keys(dataThemes)), _toConsumableArray(Object.values(dataThemes).map(function (theme) {
  return theme.aliases.concat(theme.title);
}).flat()));
DataThemeIcon.propTypes = {
  theme: _propTypes.default.oneOf(dataThemeAliases).isRequired,
  size: _propTypes.default.number,
  avatar: _propTypes.default.bool,
  className: _propTypes.default.string
};
DataThemeIcon.defaultProps = {
  size: 5,
  avatar: false,
  className: null
};

var WrappedDataThemeIcon = _Theme.default.getWrappedComponent(DataThemeIcon);

var _default = WrappedDataThemeIcon;
exports.default = _default;