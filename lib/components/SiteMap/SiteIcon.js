"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getSiteLeafletIcon = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _leaflet = _interopRequireDefault(require("leaflet"));

var _iconCoreTerrestrial = _interopRequireDefault(require("./icon-core-terrestrial.svg"));

var _iconCoreTerrestrialSelected = _interopRequireDefault(require("./icon-core-terrestrial-selected.svg"));

var _iconCoreAquatic = _interopRequireDefault(require("./icon-core-aquatic.svg"));

var _iconCoreAquaticSelected = _interopRequireDefault(require("./icon-core-aquatic-selected.svg"));

var _iconCoreShadow = _interopRequireDefault(require("./icon-core-shadow.svg"));

var _iconCoreShadowSelected = _interopRequireDefault(require("./icon-core-shadow-selected.svg"));

var _iconRelocatableTerrestrial = _interopRequireDefault(require("./icon-relocatable-terrestrial.svg"));

var _iconRelocatableTerrestrialSelected = _interopRequireDefault(require("./icon-relocatable-terrestrial-selected.svg"));

var _iconRelocatableAquatic = _interopRequireDefault(require("./icon-relocatable-aquatic.svg"));

var _iconRelocatableAquaticSelected = _interopRequireDefault(require("./icon-relocatable-aquatic-selected.svg"));

var _iconRelocatableShadow = _interopRequireDefault(require("./icon-relocatable-shadow.svg"));

var _iconRelocatableShadowSelected = _interopRequireDefault(require("./icon-relocatable-shadow-selected.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var ICON_SVGS = {
  CORE: {
    AQUATIC: {
      BASE: _iconCoreAquatic.default,
      SELECTED: _iconCoreAquaticSelected.default
    },
    TERRESTRIAL: {
      BASE: _iconCoreTerrestrial.default,
      SELECTED: _iconCoreTerrestrialSelected.default
    },
    SHADOW: {
      BASE: _iconCoreShadow.default,
      SELECTED: _iconCoreShadowSelected.default
    }
  },
  RELOCATABLE: {
    AQUATIC: {
      BASE: _iconRelocatableAquatic.default,
      SELECTED: _iconRelocatableAquaticSelected.default
    },
    TERRESTRIAL: {
      BASE: _iconRelocatableTerrestrial.default,
      SELECTED: _iconRelocatableTerrestrialSelected.default
    },
    SHADOW: {
      BASE: _iconRelocatableShadow.default,
      SELECTED: _iconRelocatableShadowSelected.default
    }
  }
}; // Function to take a single all-caps word and make it lowercase but capitalized
// (e.g. capWord('AQUATIC') === 'Aquatic')

var capWord = function capWord(word) {
  return "".concat(word.slice(0, 1)).concat(word.slice(1).toLowerCase());
};

var SiteIcon = function SiteIcon(props) {
  var siteCode = props.siteCode,
      type = props.type,
      terrain = props.terrain,
      isSelected = props.isSelected,
      zoom = props.zoom,
      other = _objectWithoutProperties(props, ["siteCode", "type", "terrain", "isSelected", "zoom"]);

  var selected = isSelected ? 'SELECTED' : 'BASE';
  var alt = '';

  if (siteCode) {
    alt = siteCode;
  }

  if (terrain) {
    var capTerrain = capWord(terrain);
    alt = alt.length ? "".concat(alt, " - ").concat(capTerrain) : capTerrain;
  }

  if (type) {
    var capType = capWord(type);
    alt = alt.length ? "".concat(alt, " - ").concat(capType) : capType;
  }

  return _react.default.createElement("img", _extends({}, other, {
    src: ICON_SVGS[type][terrain][selected],
    alt: alt,
    title: alt
  }));
};

var getSiteLeafletIcon = function getSiteLeafletIcon(config) {
  var type = config.type,
      terrain = config.terrain,
      isSelected = config.isSelected,
      zoom = config.zoom;

  if (!['CORE', 'RELOCATABLE'].includes(type) || !['TERRESTRIAL', 'AQUATIC'].includes(terrain)) {
    console.error('getSiteLeafletIcon invalid configuration'); // eslint-disable-line no-console

    return null;
  }

  var selected = isSelected ? 'SELECTED' : 'BASE';
  var iconScale = 0.2 + Math.floor(((zoom || 2) - 2) / 3) / 10;
  var iconSize = isSelected ? [150, 150] : [100, 100];
  var iconAnchor = isSelected ? [75, 150] : [50, 100];
  var shadowSize = isSelected ? [234, 160] : [156, 93];
  var shadowAnchor = isSelected ? [80, 145] : [50, 83];
  return new _leaflet.default.Icon({
    iconUrl: ICON_SVGS[type][terrain][selected],
    iconRetinaUrl: ICON_SVGS[type][terrain][selected],
    iconSize: iconSize.map(function (x) {
      return x * iconScale;
    }),
    iconAnchor: iconAnchor.map(function (x) {
      return x * iconScale;
    }),
    shadowUrl: ICON_SVGS[type].SHADOW[selected],
    shadowSize: shadowSize.map(function (x) {
      return x * iconScale;
    }),
    shadowAnchor: shadowAnchor.map(function (x) {
      return x * iconScale;
    }),
    popupAnchor: [0, -100].map(function (x) {
      return x * iconScale;
    })
  });
};

exports.getSiteLeafletIcon = getSiteLeafletIcon;
SiteIcon.propTypes = {
  zoom: _propTypes.default.number,
  siteCode: _propTypes.default.string,
  type: _propTypes.default.string.isRequired,
  terrain: _propTypes.default.string.isRequired,
  isSelected: _propTypes.default.bool
};
SiteIcon.defaultProps = {
  zoom: null,
  siteCode: null,
  isSelected: false
};
var _default = SiteIcon;
exports.default = _default;