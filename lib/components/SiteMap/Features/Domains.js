"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _tinycolor = _interopRequireDefault(require("tinycolor2"));

var _SnackbarContent = _interopRequireDefault(require("@material-ui/core/SnackbarContent"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _TouchApp = _interopRequireDefault(require("@material-ui/icons/TouchApp"));

require("leaflet/dist/leaflet.css");

var _reactLeaflet = require("react-leaflet");

var _Theme = _interopRequireDefault(require("../../Theme/Theme"));

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
var Domains = function Domains(props) {
  var classes = props.classes,
      renderPopupSitesList = props.renderPopupSitesList,
      positionPopup = props.positionPopup; // State and Dispatch from SiteMapContext

  var _SiteMapContext$useSi = _SiteMapContext.default.useSiteMapContext(),
      _SiteMapContext$useSi2 = _slicedToArray(_SiteMapContext$useSi, 2),
      state = _SiteMapContext$useSi2[0],
      dispatch = _SiteMapContext$useSi2[1];

  var neonContextHydrated = state.neonContextHydrated; // Don't render if not all loaded

  if (!neonContextHydrated) {
    return null;
  } // Extract featrure and selection data


  var featureData = state.featureData[_SiteMapUtils.FEATURE_TYPES.BOUNDARIES][_SiteMapUtils.FEATURES.DOMAINS.KEY];
  var _state$selection = state.selection,
      selectedDomains = _state$selection.derived[_SiteMapUtils.FEATURES.DOMAINS.KEY],
      selectionActive = _state$selection.active;
  /**
     Render Method: Popup
  */

  var renderPopup = function renderPopup(domainCode) {
    if (!featureData[domainCode]) {
      return null;
    }

    var domain = featureData[domainCode];

    var renderActions = function renderActions() {
      var count = domain.sites.size;

      if (!selectionActive || !count) {
        return null;
      }

      var isTotalSelected = selectedDomains[domainCode] === 'total';
      var verb = isTotalSelected ? 'remove' : 'add';
      var preposition = isTotalSelected ? 'from' : 'to';
      var all = count === 1 ? '' : 'all ';
      var plural = count === 1 ? '' : 's';
      return /*#__PURE__*/_react.default.createElement(_SnackbarContent.default, {
        className: classes.infoSnackbar,
        style: {
          marginTop: _Theme.default.spacing(1)
        },
        message: /*#__PURE__*/_react.default.createElement("div", {
          className: classes.startFlex
        }, /*#__PURE__*/_react.default.createElement(_TouchApp.default, {
          className: classes.infoSnackbarIcon
        }), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
          variant: "body2"
        }, "Click to ", /*#__PURE__*/_react.default.createElement("b", null, verb, " ", all, count, " site", plural), " ", preposition, " selection")))
      });
    };

    return /*#__PURE__*/_react.default.createElement(_reactLeaflet.Popup, {
      className: classes.popup,
      autoPan: false
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
      gutterBottom: true
    }, "".concat(domain.name, " (").concat(domainCode, ")")), renderPopupSitesList(domain.sites), renderActions());
  };
  /**
     Main Render
  */
  // If a domain is the current focus location put it at the end of the domains list so
  // that it renders last. This makes it so no other domain lines will overlap on top of it
  // and the focus highlight will be complete.


  var sortedDomains = Object.keys(featureData).sort(function (a) {
    return a === state.focusLocation.current ? 1 : -1;
  });
  return /*#__PURE__*/_react.default.createElement(_reactLeaflet.FeatureGroup, null, sortedDomains.map(function (domainCode) {
    var domain = featureData[domainCode];
    var baseColor = state.focusLocation.current === domainCode ? "#".concat((0, _tinycolor.default)(_SiteMapUtils.FEATURES.DOMAINS.style.color).darken(20).toHex()) : _SiteMapUtils.FEATURES.DOMAINS.style.color;
    var overlayColor = selectionActive && selectedDomains[domainCode] ? _SiteMapUtils.BOUNDARY_COLORS["".concat(selectedDomains[domainCode], "Selected")] : baseColor;
    var interactionProps = selectionActive ? {
      onMouseOver: function onMouseOver(e) {
        e.target._path.setAttribute('stroke', _SiteMapUtils.BOUNDARY_COLORS.hover);

        e.target._path.setAttribute('fill', _SiteMapUtils.BOUNDARY_COLORS.hover);

        e.target.openPopup();
        positionPopup(e);
      },
      onMouseMove: function onMouseMove(e) {
        positionPopup(e);
      },
      onMouseOut: function onMouseOut(e) {
        e.target._path.setAttribute('stroke', overlayColor);

        e.target._path.setAttribute('fill', overlayColor);

        e.target.closePopup();
      },
      onClick: function onClick() {
        dispatch({
          type: 'toggleDomainSelected',
          domainCode: domainCode
        });
      }
    } : {
      onMouseOver: function onMouseOver(e) {
        e.target._path.setAttribute('stroke', _SiteMapUtils.BOUNDARY_COLORS.hover);

        e.target._path.setAttribute('fill', _SiteMapUtils.BOUNDARY_COLORS.hover);
      },
      onMouseOut: function onMouseOut(e) {
        e.target._path.setAttribute('stroke', overlayColor);

        e.target._path.setAttribute('fill', overlayColor);
      }
    };
    return /*#__PURE__*/_react.default.createElement(_reactLeaflet.Polygon, _extends({
      key: domainCode,
      color: overlayColor,
      positions: domain.geometry.coordinates
    }, interactionProps), renderPopup(domainCode));
  }));
};

Domains.propTypes = {
  classes: _propTypes.default.objectOf(_propTypes.default.string).isRequired,
  positionPopup: _propTypes.default.func.isRequired,
  renderPopupSitesList: _propTypes.default.func.isRequired
};
var _default = Domains;
exports.default = _default;