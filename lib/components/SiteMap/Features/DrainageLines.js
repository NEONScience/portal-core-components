"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _tinycolor = _interopRequireDefault(require("tinycolor2"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

require("leaflet/dist/leaflet.css");

var _reactLeaflet = require("react-leaflet");

var _SiteMapContext = _interopRequireDefault(require("../SiteMapContext"));

var _SiteMapUtils = require("../SiteMapUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
   Main Component
*/
var DrainageLines = function DrainageLines(props) {
  var classes = props.classes;
  var _FEATURES$DRAINAGE_LI = _SiteMapUtils.FEATURES.DRAINAGE_LINES,
      featureKey = _FEATURES$DRAINAGE_LI.KEY,
      featureType = _FEATURES$DRAINAGE_LI.type,
      polylineStyle = _FEATURES$DRAINAGE_LI.polylineStyle; // Extract feature data from SiteMapContext State

  var _SiteMapContext$useSi = _SiteMapContext.default.useSiteMapContext(),
      _SiteMapContext$useSi2 = _slicedToArray(_SiteMapContext$useSi, 1),
      state = _SiteMapContext$useSi2[0];

  var neonContextHydrated = state.neonContextHydrated,
      featureData = state.featureData[featureType][featureKey];

  if (!neonContextHydrated || !Object.keys(featureData)) {
    return null;
  }
  /**
     Render Method: Popup
  */


  var renderPopup = function renderPopup(siteCode) {
    if (!featureData[siteCode]) {
      return null;
    }

    return /*#__PURE__*/_react.default.createElement(_reactLeaflet.Popup, {
      className: classes.popup,
      autoPan: true
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
      gutterBottom: true
    }, "".concat(siteCode, " Watershed Drainage Lines")));
  };
  /**
     Main Render
  */


  return /*#__PURE__*/_react.default.createElement(_reactLeaflet.FeatureGroup, null, Object.keys(featureData).map(function (siteCode) {
    var drainageLine = featureData[siteCode];
    var hoverColor = "#".concat((0, _tinycolor.default)(polylineStyle.color).lighten(10).toHex());
    /* eslint-disable no-underscore-dangle */

    var interactionProps = {
      onMouseOver: function onMouseOver(e) {
        e.target._path.setAttribute('stroke', hoverColor);
      },
      onMouseOut: function onMouseOut(e) {
        e.target._path.setAttribute('stroke', polylineStyle.color);
      }
    };
    /* eslint-enable no-underscore-dangle */

    return /*#__PURE__*/_react.default.createElement(_reactLeaflet.Polyline, _extends({
      key: siteCode,
      color: polylineStyle.color,
      positions: drainageLine.geometry.coordinates
    }, interactionProps), renderPopup(siteCode));
  }));
};

DrainageLines.propTypes = {
  classes: _propTypes.default.objectOf(_propTypes.default.string).isRequired
};
var _default = DrainageLines;
exports.default = _default;