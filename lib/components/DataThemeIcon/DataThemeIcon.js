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
const _excluded = ["theme", "size", "avatar", "className"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
const dataThemes = {
  atmosphere: {
    title: 'Atmosphere',
    aliases: ['atmos'],
    src: _atmosphere.default
  },
  biogeochemistry: {
    title: 'Biogeochemistry',
    aliases: ['biogeo'],
    src: _biogeochemistry.default
  },
  ecohydrology: {
    title: 'Ecohydrology',
    aliases: ['ecohydro'],
    src: _ecohydrology.default
  },
  landcover: {
    title: 'Land Cover & Processes',
    aliases: ['landuse', 'Land Cover and Processes', 'Land Use, Land Cover, and Land Processes'],
    src: _landcover.default
  },
  organisms: {
    title: 'Organisms, Populations, and Communities',
    aliases: [],
    src: _organisms.default
  }
};
const DataThemeIcon = props => {
  const {
      theme,
      size,
      avatar,
      className
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const dataTheme = dataThemes[theme] || Object.values(dataThemes).find(entry => theme === entry.title || entry.aliases.includes(theme));
  if (!dataTheme) {
    return null;
  }
  const elementProps = {
    src: dataTheme.src,
    alt: dataTheme.title,
    title: dataTheme.title,
    className,
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
};

// Data Themes do not have IDs. In order to support identifying a theme
// by its full title, abbreviated name, or other known aliases we build
// a full list of all supported aliases here to feed PropTypes.
const dataThemeAliases = [...Object.keys(dataThemes), ...Object.values(dataThemes).map(theme => theme.aliases.concat(theme.title)).flat()];
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
const WrappedDataThemeIcon = _Theme.default.getWrappedComponent(DataThemeIcon);
var _default = exports.default = WrappedDataThemeIcon;