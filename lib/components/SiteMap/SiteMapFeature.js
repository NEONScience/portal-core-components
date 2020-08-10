"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _tinycolor = _interopRequireDefault(require("tinycolor2"));

var _reactCopyToClipboard = require("react-copy-to-clipboard");

var _styles = require("@material-ui/core/styles");

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _Link = _interopRequireDefault(require("@material-ui/core/Link"));

var _SnackbarContent = _interopRequireDefault(require("@material-ui/core/SnackbarContent"));

var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _TouchApp = _interopRequireDefault(require("@material-ui/icons/TouchApp"));

var _Terrain = _interopRequireDefault(require("@material-ui/icons/Terrain"));

var _InsertChartOutlined = _interopRequireDefault(require("@material-ui/icons/InsertChartOutlined"));

var _MyLocation = _interopRequireDefault(require("@material-ui/icons/MyLocation"));

var _LocationOn = _interopRequireDefault(require("@material-ui/icons/LocationOn"));

var _InfoOutlined = _interopRequireDefault(require("@material-ui/icons/InfoOutlined"));

require("leaflet/dist/leaflet.css");

var _reactLeaflet = require("react-leaflet");

var _SiteMapContext = _interopRequireDefault(require("./SiteMapContext"));

var _SiteMapUtils = require("./SiteMapUtils");

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    infoSnackbar: {
      backgroundColor: theme.palette.grey[50],
      color: '#000',
      border: "1px solid ".concat(theme.palette.primary.main, "80"),
      justifyContent: 'center',
      padding: theme.spacing(0, 1)
    },
    infoSnackbarIcon: {
      color: theme.palette.grey[300],
      marginRight: theme.spacing(2)
    },
    popup: {
      minWidth: '320px',
      '& a': {
        color: theme.palette.primary.main
      },
      '& p': {
        margin: 'unset'
      },
      '& div.leaflet-popup-content-wrapper': {
        borderRadius: '2px !important'
      },
      '& a.leaflet-popup-close-button': {
        top: theme.spacing(0.5),
        right: theme.spacing(0.5)
      }
    },
    popupButtonRow: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: theme.spacing(2),
      '& > :not(:last-child)': {
        marginRight: theme.spacing(1)
      }
    },
    popupButton: {
      whiteSpace: 'nowrap',
      marginBottom: theme.spacing(1),
      '& span': {
        pointerEvents: 'none'
      }
    },
    popupSiteIcon: {
      width: theme.spacing(2.5),
      height: theme.spacing(2.5),
      marginRight: theme.spacing(1),
      filter: 'drop-shadow(0px 0px 1.5px #000000bb)'
    },
    popupSiteContainer: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginBottom: theme.spacing(1)
    },
    popupFeatureIcon: {
      width: theme.spacing(4.5),
      height: theme.spacing(4.5),
      marginRight: theme.spacing(1.5),
      filter: 'drop-shadow(0px 0px 1.5px #000000bb)'
    },
    popupFeaturePolygon: {
      marginRight: theme.spacing(1.5)
    },
    popupTitleContainer: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginBottom: theme.spacing(1.5)
    },
    startFlex: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    endFlex: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    markerIcon: {
      marginRight: '2px',
      marginBottom: '-3px',
      fontSize: '0.95rem'
    }
  };
});

var positionsArrayIsValid = function positionsArrayIsValid(positions) {
  var checkAllCoords = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!Array.isArray(positions) || positions.length === 0) {
    return false;
  }

  if (!checkAllCoords) {
    return true;
  }

  return positions.every(function (p) {
    return Array.isArray(p) && (p.length === 2 && p.every(function (c) {
      return Number.isFinite(c);
    }) || positionsArrayIsValid(p));
  });
};

var SiteMapFeature = function SiteMapFeature(props) {
  var classes = useStyles(_Theme.default);
  var mapRef = props.mapRef,
      featureKey = props.featureKey;

  if (!_SiteMapUtils.FEATURES[featureKey] || !mapRef.current) {
    return null;
  }

  var feature = _SiteMapUtils.FEATURES[featureKey] || {};
  var name = feature.name,
      nameSingular = feature.nameSingular,
      featureType = feature.type,
      description = feature.description,
      featureStyle = feature.style,
      featureShape = feature.featureShape,
      iconSvg = feature.iconSvg,
      _feature$primaryIdOnl = feature.primaryIdOnly,
      primaryIdOnly = _feature$primaryIdOnl === void 0 ? false : _feature$primaryIdOnl,
      parentDataFeatureKey = feature.parentDataFeatureKey;
  var featureName = nameSingular || name || featureKey;
  var featureDescription = description;
  var parentFeature = null;

  if (parentDataFeatureKey && _SiteMapUtils.FEATURES[parentDataFeatureKey]) {
    parentFeature = _SiteMapUtils.FEATURES[parentDataFeatureKey];

    if (description === 'PARENT') {
      featureDescription = parentFeature.description;
    }
  } // Groups don't render anything ever!


  if (featureType === _SiteMapUtils.FEATURE_TYPES.GROUP) {
    return null;
  }
  /**
     Extract feature data from SiteMapContext state
  */


  var _SiteMapContext$useSi = _SiteMapContext.default.useSiteMapContext(),
      _SiteMapContext$useSi2 = _slicedToArray(_SiteMapContext$useSi, 2),
      state = _SiteMapContext$useSi2[0],
      dispatch = _SiteMapContext$useSi2[1];

  var neonContextHydrated = state.neonContextHydrated,
      focusLocation = state.focusLocation.current,
      featureData = state.featureData[parentFeature ? parentFeature.type : featureType][parentFeature ? parentFeature.KEY : featureKey];

  if (!neonContextHydrated || !featureData || !Object.keys(featureData)) {
    return null;
  }

  var selectionActive = state.selection.active === featureType;
  var selectedItems = selectionActive ? state.selection[featureType] : new Set(); // Jump-To function to afford map navigation where appropriate

  var jumpTo = function jumpTo() {
    var locationCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    dispatch({
      type: 'setNewFocusLocation',
      location: locationCode
    });
  };
  /**
     Util: Position Popup
     Leaflet's AutoPan for popups does a "transition" of map center to ensure a new popup renders
     in view. This poses a problem when the center is in the main context state - every micro-step
     of the AutoPan transition is a state update. The transition appears to run recursively as it
     causes a max update depth crash. We get around this by solving the same root problem (want
     popups to render in view) in a different way... specifically by positioning them around their
     parent element dynamcally based on which direction has the most room to render.
  */


  var positionPopup = function positionPopup() {
    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var latlng = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var hideCloseButton = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (!target || !latlng || !mapRef.current || !mapRef.current.leafletElement) {
      return;
    }

    var popup = target._popup,
        icon = target._icon;
    popup.setLatLng(latlng);
    var containerPoint = mapRef.current.leafletElement.latLngToContainerPoint(latlng);
    var iconHeight = icon ? icon.height : 0;
    var containerNode = popup._container,
        containerLeft = popup._containerLeft,
        containerBottom = popup._containerBottom,
        tipNode = popup._tipContainer;
    containerNode.style.marginBottom = '0px'; // Leaflet popups always open above; open below if mouse event is in the top half of the map

    if (containerPoint.y < mapRef.current.container.clientHeight / 2) {
      var contentHeight = containerNode.clientHeight;
      var tipHeight = tipNode.clientHeight;
      var contentBottom = 0 - iconHeight - contentHeight - tipHeight - 1.5 * containerBottom;
      var tipBottom = contentHeight + tipHeight;
      containerNode.style.bottom = "".concat(contentBottom, "px");
      tipNode.style.transform = "rotate(0.5turn) translate(0px, ".concat(tipBottom, "px)");
    } else {
      containerNode.style.bottom = "".concat(-1.5 * containerBottom, "px");
      popup._tipContainer.style.transform = null;
    } // For left/right we move the popup horizontally as needed while keeping the tip stationary


    var contentWidth = containerNode.clientWidth;
    var mapWidth = mapRef.current.container.parentNode.clientWidth || 0;
    var nudgeBuffer = 40;
    var nudgeLimit = contentWidth / 2 - nudgeBuffer / 2;
    var overlap = 0;

    if (mapWidth > contentWidth + nudgeBuffer * 3) {
      var nudge = 0;

      if (containerPoint.x - contentWidth / 2 < 0) {
        overlap = containerPoint.x - contentWidth / 2;
        nudge = Math.min(0 - overlap + nudgeBuffer, nudgeLimit);
      } else if (containerPoint.x + contentWidth / 2 > mapWidth) {
        overlap = mapWidth - containerPoint.x - contentWidth / 2;
        nudge = Math.min(overlap - nudgeBuffer, nudgeLimit);
      }

      if (nudge !== 0) {
        containerNode.style.left = "".concat(containerLeft + nudge, "px");
      }

      tipNode.style.left = "".concat(0 - containerLeft - nudge, "px");
    }

    if (hideCloseButton) {
      popup._closeButton.style.display = 'none';
    }
  };

  var markerIcon = /*#__PURE__*/_react.default.createElement(_LocationOn.default, {
    className: classes.markerIcon
  });
  /**
     Render: Popup Title with Feature Icon
  */


  var renderPopupTitle = function renderPopupTitle(title) {
    var withFeatureName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var renderedTitle = withFeatureName ? /*#__PURE__*/_react.default.createElement("span", null, featureName, /*#__PURE__*/_react.default.createElement("br", null), title) : title;
    var icon = null;

    if (iconSvg) {
      icon = /*#__PURE__*/_react.default.createElement("img", {
        alt: feature.name,
        src: feature.iconSvg,
        className: classes.popupFeatureIcon
      });
    } else if (featureShape === 'Circle') {
      var circleProps = {
        cx: 12,
        cy: 12,
        r: 8,
        style: {
          fill: featureStyle.color ? "".concat(featureStyle.color, "88") : 'none',
          stroke: featureStyle.color || null,
          strokeWidth: 3
        }
      };
      icon = /*#__PURE__*/_react.default.createElement("svg", {
        width: "24",
        height: "24",
        className: classes.popupFeaturePolygon
      }, /*#__PURE__*/_react.default.createElement("circle", circleProps));
    } else if (featureStyle && !['STATES', 'DOMAINS'].includes(featureKey)) {
      // We don't show the rect for states and domains since those cover the whole map when showing.
      var rectProps = {
        width: 33,
        height: 23,
        x: 1.5,
        y: 6.5,
        rx: 3,
        style: {
          fill: feature.style.color || null,
          stroke: feature.style.color || null,
          strokeWidth: 2.5,
          fillOpacity: 0.2,
          strokeOpacity: 0.85,
          strokeLinecap: 'round',
          strokeDasharray: feature.style.dashArray || null
        }
      };
      icon = /*#__PURE__*/_react.default.createElement("svg", {
        width: "36",
        height: "36",
        className: classes.popupFeaturePolygon
      }, /*#__PURE__*/_react.default.createElement("rect", rectProps));
    }

    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.popupTitleContainer,
      "data-selenium": "sitemap-map-popup-title"
    }, icon, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
      style: {
        lineHeight: '1.4rem'
      }
    }, renderedTitle));
  };
  /**
     Render: a numerical value with units and optional label
  */


  var renderNumericalValue = function renderNumericalValue(value) {
    var label = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var unit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var precision = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var aria = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var right = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    var parens = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
    // eslint-disable-line max-len
    var numberString = Number.isFinite(value) ? "".concat(value.toFixed(precision)).concat(unit) : '--';

    if (parens) {
      numberString = "(".concat(numberString, ")");
    }

    var visibleValue = /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption",
      "aria-label": aria || label,
      style: {
        fontFamily: 'monospace'
      }
    }, numberString);

    return !label ? visibleValue : /*#__PURE__*/_react.default.createElement("div", {
      className: classes[right ? 'endFlex' : 'startFlex']
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption",
      style: {
        marginRight: _Theme.default.spacing(1)
      }
    }, label), visibleValue);
  };
  /**
     Render: Site with Icon
  */


  var renderSite = function renderSite(siteCode) {
    var link = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var site = state.sites[siteCode];

    if (!site) {
      return null;
    }

    var siteFeatureKey = "".concat(site.terrain, "_").concat(site.type, "_SITES");

    if (!_SiteMapUtils.FEATURES[siteFeatureKey]) {
      return null;
    }

    var siteIcon = _SiteMapUtils.FEATURES[siteFeatureKey].iconSvg;

    var internal = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("img", {
      src: siteIcon,
      alt: siteCode,
      className: classes.popupSiteIcon
    }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption",
      style: {
        textAlign: 'left'
      }
    }, "".concat(site.description, " (").concat(site.siteCode, ")")));

    var containerProps = {
      key: siteCode,
      className: classes.popupSiteContainer,
      style: {
        marginTop: _Theme.default.spacing(0.5)
      }
    };
    return link ? /*#__PURE__*/_react.default.createElement(_Link.default, _extends({
      variant: "caption",
      component: "button",
      onClick: function onClick() {
        return jumpTo(site.siteCode);
      },
      "data-selenium": "sitemap-map-popup-siteLink"
    }, containerProps), internal) : /*#__PURE__*/_react.default.createElement("div", containerProps, internal);
  };
  /**
     Render: Latitude / Longitude with Copy to Clipboard
  */


  var renderLatLon = function renderLatLon(latitude, longitude) {
    var right = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var renderSubtitle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var coords = Number.isFinite(latitude) && Number.isFinite(longitude) ? /*#__PURE__*/_react.default.createElement("div", {
      className: classes[right ? 'endFlex' : 'startFlex'],
      "data-selenium": "sitemap-map-popup-coordinates"
    }, /*#__PURE__*/_react.default.createElement(_reactCopyToClipboard.CopyToClipboard, {
      text: "".concat(latitude.toFixed(5), " ").concat(longitude.toFixed(5))
    }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      title: "Latitude / Longitude (click to copy)"
    }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
      size: "small",
      style: {
        marginRight: _Theme.default.spacing(0.5)
      },
      "aria-label": "Latitude / Longitude (click to copy)"
    }, /*#__PURE__*/_react.default.createElement(_MyLocation.default, null)))), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption",
      "aria-label": "Latitude / Longitude",
      style: {
        fontFamily: 'monospace',
        textAlign: 'right'
      }
    }, latitude.toFixed(5), /*#__PURE__*/_react.default.createElement("br", null), longitude.toFixed(5))) : /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, "Lat./Lon."), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption",
      "aria-label": "Latitude / Longitude",
      style: {
        fontFamily: 'monospace',
        textAlign: 'right'
      }
    }, "--"));
    return !renderSubtitle ? coords : /*#__PURE__*/_react.default.createElement("div", {
      style: {
        textAlign: right ? 'right' : 'left'
      }
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, "Coordinates"), coords);
  };
  /**
     Render: Elevation
  */


  var renderElevation = function renderElevation() {
    var loc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var right = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var elevation = loc.elevation,
        minimumElevation = loc.minimumElevation,
        maximumElevation = loc.maximumElevation;
    var hasMinMax = Number.isFinite(minimumElevation) || Number.isFinite(maximumElevation);
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        textAlign: right ? 'right' : 'left'
      },
      "data-selenium": "sitemap-map-popup-elevation"
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, "Elevation"), hasMinMax ? /*#__PURE__*/_react.default.createElement("div", null, renderNumericalValue(elevation, 'Average', 'm', 2, 'Average Elevation', right), renderNumericalValue(minimumElevation, 'Minimum', 'm', 2, 'Minimum Elevation', right), renderNumericalValue(maximumElevation, 'Maximum', 'm', 2, 'Maximum Elevation', right)) : /*#__PURE__*/_react.default.createElement("div", {
      className: classes[right ? 'endFlex' : 'startFlex']
    }, /*#__PURE__*/_react.default.createElement(_Terrain.default, {
      fontSize: "small",
      style: {
        marginRight: _Theme.default.spacing(1)
      }
    }), renderNumericalValue(elevation, null, 'm', 2, 'Elevation')));
  };
  /**
     Render: Plot Size
  */


  var renderPlotSize = function renderPlotSize() {
    var loc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-selenium": "sitemap-map-popup-plotSize"
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, "Plot Size"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption"
    }, loc.plotDimensions, !Number.isFinite(loc.plotSize) ? null : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("br", null), "(".concat(loc.plotSize.toFixed(0), "m\xB2)"))));
  };
  /**
     Render: Plot Slope
  */


  var renderPlotSlope = function renderPlotSlope() {
    var loc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var right = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        textAlign: right ? 'right' : 'left'
      },
      "data-selenium": "sitemap-map-popup-plotSlope"
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, "Plot Slope"), renderNumericalValue(loc.slopeAspect, 'Aspect', '°', 2, 'Slope Aspect', right), renderNumericalValue(loc.slopeGradient, 'Gradient', '%', 2, 'Slope Gradient', right));
  };
  /**
     Render: Plot Sampling Modules
  */


  var renderPlotSamplingModules = function renderPlotSamplingModules() {
    var loc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var count = loc.samplingModules.length ? " (".concat(loc.samplingModules.length, ")") : '';
    return /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 12,
      key: "plotSamplingModules",
      "data-selenium": "sitemap-map-popup-samplingModules"
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, "Potential Sampling Modules".concat(count)), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption"
    }, !loc.samplingModules.length ? /*#__PURE__*/_react.default.createElement("i", null, "none") : loc.samplingModules.map(function (m) {
      return _SiteMapUtils.PLOT_SAMPLING_MODULES[m];
    }).join(', ')));
  };
  /**
     Render: Popup Row; Boundary Area
  */


  var renderBoundaryArea = function renderBoundaryArea() {
    var bound = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _ref = bound.properties || {},
        areaKm2 = _ref.areaKm2;

    var areaAcres = Number.isFinite(areaKm2) ? _SiteMapUtils.KM2_TO_ACRES * areaKm2 : null;
    return /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 12,
      "data-selenium": "sitemap-map-popup-area"
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, "Area"), /*#__PURE__*/_react.default.createElement("div", {
      className: classes.startFlex
    }, renderNumericalValue(areaKm2, null, 'km²', 2, 'Area (km²)'), areaAcres === null ? null : /*#__PURE__*/_react.default.createElement("div", {
      style: {
        marginLeft: _Theme.default.spacing(1)
      }
    }, renderNumericalValue(areaAcres, null, ' acres', 2, 'Area (acres)', false, true))));
  };
  /**
     Render Method: Popup Row; Child NEON Sites (e.g. within a domain or state)
  */


  var renderChildSites = function renderChildSites(boundaryKey) {
    // const { [SELECTABLE_FEATURE_TYPES.SITES]: selectedSites } = state.selection;
    var _featureData$boundary = featureData[boundaryKey].sites,
        sites = _featureData$boundary === void 0 ? new Set() : _featureData$boundary;
    return /*#__PURE__*/_react.default.createElement(_Grid.default, {
      key: "childSites",
      item: true,
      xs: 12,
      "data-selenium": "sitemap-map-popup-childSites"
    }, !sites.size ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, "NEON Sites"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption"
    }, /*#__PURE__*/_react.default.createElement("i", null, "none"))) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, "NEON Sites (".concat(sites.size, "):")), /*#__PURE__*/_react.default.createElement("div", null, _toConsumableArray(sites).map(function (siteCode) {
      return renderSite(siteCode, true);
    }))));
  };
  /**
     Render: Popup Row; Coordinates and Elevation
  */


  var renderCoordsAndElevation = function renderCoordsAndElevation(loc) {
    var renderCoordsSubtitle = Number.isFinite(loc.minimumElevation) || Number.isFinite(loc.maximumElevation);
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, {
      key: "coordsAndElevation"
    }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 6
    }, renderElevation(loc)), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 6
    }, renderLatLon(loc.latitude, loc.longitude, true, renderCoordsSubtitle)));
  };
  /**
     Render: Popup Row; Plot Size and Slope
  */


  var renderPlotSizeAndSlope = function renderPlotSizeAndSlope(loc) {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, {
      key: "plotSizeAndSlope"
    }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 6
    }, renderPlotSize(loc)), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 6
    }, renderPlotSlope(loc, true)));
  };
  /**
     Render: Popup Row; Tower Details
  */


  var renderTowerDetails = function renderTowerDetails(loc) {
    return /*#__PURE__*/_react.default.createElement(_Grid.default, {
      key: "towerDetails",
      item: true,
      xs: 12,
      "data-selenium": "sitemap-map-popup-towerDetails"
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, "Levels"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption"
    }, (loc.children || []).length));
  };
  /**
     Render: Popup Row; Location Site and Domain
  */


  var renderLocationSiteAndDomain = function renderLocationSiteAndDomain(siteCode) {
    var site = state.sites[siteCode];

    if (!site || !state.featureData.BOUNDARIES.DOMAINS[site.domainCode]) {
      return null;
    }

    var domainName = state.featureData.BOUNDARIES.DOMAINS[site.domainCode].name;
    var domainTitle = "".concat(site.domainCode, " - ").concat(domainName);
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, {
      key: "locationSiteAndDomain"
    }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 7,
      "data-selenium": "sitemap-map-popup-site"
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, "NEON Site"), renderSite(siteCode)), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 5,
      style: {
        textAlign: 'right'
      },
      "data-selenium": "sitemap-map-popup-domain"
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, "Domain"), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      title: "Jump to ".concat(site.domainCode, " on the map")
    }, /*#__PURE__*/_react.default.createElement(_Link.default, {
      variant: "caption",
      component: "button",
      style: {
        textAlign: 'right'
      },
      onClick: function onClick() {
        return jumpTo(site.domainCode);
      },
      "data-selenium": "sitemap-map-popup-domainLink"
    }, markerIcon, domainTitle))));
  };

  var popupProps = {
    className: classes.popup,
    autoPan: false,
    id: 'sitemap-map-popup'
  };
  /**
     Render: Location popup
     Standard title with icon, row with coordinates and elevation, row with parent site and domain
     Optional additional rows will appear between coordinates/elevation and site/domain
  */

  var renderLocationPopup = function renderLocationPopup(siteCode, location) {
    var additionalRows = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var loc = (featureData[siteCode] || {})[location] || {};
    return /*#__PURE__*/_react.default.createElement(_reactLeaflet.Popup, popupProps, renderPopupTitle(location), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      container: true,
      spacing: 1
    }, renderCoordsAndElevation(loc), additionalRows.map(function (row) {
      return typeof row === 'function' ? row(loc) : row;
    }), renderLocationSiteAndDomain(siteCode)));
  };
  /**
     Render: Boundary popup
     Standard title with bound outline. Show area if present.
  */


  var renderBoundaryPopup = function renderBoundaryPopup(key) {
    var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var additionalRows = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    var _ref2 = featureData[key] || {},
        _ref2$properties = _ref2.properties,
        properties = _ref2$properties === void 0 ? {} : _ref2$properties;

    return /*#__PURE__*/_react.default.createElement(_reactLeaflet.Popup, popupProps, renderPopupTitle(title || key, !title), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      container: true,
      spacing: 1
    }, properties.areaKm2 ? renderBoundaryArea(featureData[key]) : null, Array.isArray(additionalRows) ? additionalRows.map(function (row) {
      return typeof row === 'function' ? row(key) : row;
    }) : null, renderLocationSiteAndDomain(key)));
  };
  /**
     Render: Site Popup
  */


  var renderSitePopup = function renderSitePopup(siteCode) {
    var site = featureData[siteCode] || {};
    var _state$featureData$FE = state.featureData[_SiteMapUtils.FEATURE_TYPES.BOUNDARIES][_SiteMapUtils.FEATURES.STATES.KEY][site.stateCode],
        usState = _state$featureData$FE === void 0 ? {} : _state$featureData$FE;
    var _state$featureData$FE2 = state.featureData[_SiteMapUtils.FEATURE_TYPES.BOUNDARIES][_SiteMapUtils.FEATURES.DOMAINS.KEY][site.domainCode],
        domain = _state$featureData$FE2 === void 0 ? {} : _state$featureData$FE2;
    var stateFieldTitle = site.stateCode === 'PR' ? 'Territory' : 'State';

    var renderActions = function renderActions() {
      if (selectionActive) {
        var isSelected = selectedItems.has(site.siteCode);
        var verb = isSelected ? 'remove' : 'add';
        var preposition = isSelected ? 'from' : 'to';
        return /*#__PURE__*/_react.default.createElement(_SnackbarContent.default, {
          className: classes.infoSnackbar,
          message: /*#__PURE__*/_react.default.createElement("div", {
            className: classes.startFlex
          }, /*#__PURE__*/_react.default.createElement(_TouchApp.default, {
            className: classes.infoSnackbarIcon
          }), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
            variant: "body2"
          }, "Click to ", /*#__PURE__*/_react.default.createElement("b", null, verb), " ", preposition, " selection")))
        });
      }

      var actionButtonProps = {
        className: classes.popupButton,
        variant: 'outlined',
        color: 'primary',
        target: '_blank',
        size: 'small'
      };
      return /*#__PURE__*/_react.default.createElement("div", {
        className: classes.popupButtonRow
      }, /*#__PURE__*/_react.default.createElement(_Button.default, _extends({
        endIcon: /*#__PURE__*/_react.default.createElement(_InfoOutlined.default, null),
        href: (0, _SiteMapUtils.getHref)('SITE_DETAILS', site.siteCode)
      }, actionButtonProps), "Site Details"), /*#__PURE__*/_react.default.createElement(_Button.default, _extends({
        endIcon: /*#__PURE__*/_react.default.createElement(_InsertChartOutlined.default, null),
        href: (0, _SiteMapUtils.getHref)('EXPLORE_DATA_PRODUCTS_BY_SITE', site.siteCode)
      }, actionButtonProps), "Explore Data"));
    };

    return /*#__PURE__*/_react.default.createElement(_reactLeaflet.Popup, popupProps, renderPopupTitle("".concat(site.description, " (").concat(site.siteCode, ")"), false), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      container: true,
      spacing: 1,
      style: {
        marginBottom: _Theme.default.spacing(1)
      }
    }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 8
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, feature.nameSingular), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption"
    }, /*#__PURE__*/_react.default.createElement("i", null, featureDescription))), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 4,
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, stateFieldTitle), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      title: "Jump to ".concat(usState.name, " on the map")
    }, /*#__PURE__*/_react.default.createElement(_Link.default, {
      variant: "caption",
      component: "button",
      style: {
        textAlign: 'right'
      },
      onClick: function onClick() {
        return jumpTo(site.stateCode);
      },
      "data-selenium": "sitemap-map-popup-stateLink"
    }, markerIcon, usState.name))), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 5,
      style: {
        display: 'flex',
        alignItems: 'flex-end'
      }
    }, renderLatLon(site.latitude, site.longitude)), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 7,
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, "Domain"), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      title: "Jump to ".concat(site.domainCode, " on the map")
    }, /*#__PURE__*/_react.default.createElement(_Link.default, {
      variant: "caption",
      component: "button",
      style: {
        textAlign: 'right'
      },
      onClick: function onClick() {
        return jumpTo(site.domainCode);
      },
      "data-selenium": "sitemap-map-popup-domainLink"
    }, markerIcon, "".concat(site.domainCode, " - ").concat(domain.name))))), renderActions());
  };
  /**
     Render - All the Rest of the Popups
     Convention is alphabetical listing of keys since order here doesn't matter
  */


  var renderLocationPopupWithPlotSizeAndSlope = function renderLocationPopupWithPlotSizeAndSlope(siteCode, location) {
    return renderLocationPopup(siteCode, location, [renderPlotSizeAndSlope]);
  };

  var renderPopupFunctions = {
    AQUATIC_BENCHMARKS: renderLocationPopup,
    AQUATIC_BUOYS: renderLocationPopup,
    AQUATIC_CORE_SITES: renderSitePopup,
    AQUATIC_GROUNDWATER_WELLS: renderLocationPopup,
    AQUATIC_DISCHARGE_POINTS: renderLocationPopup,
    AQUATIC_FISH_POINTS: renderLocationPopup,
    AQUATIC_METEOROLOGICAL_STATIONS: renderLocationPopup,
    AQUATIC_PLANT_TRANSECTS: renderLocationPopup,
    AQUATIC_REACHES: renderBoundaryPopup,
    AQUATIC_RELOCATABLE_SITES: renderSitePopup,
    AQUATIC_RIPARIAN_ASSESSMENTS: renderLocationPopup,
    AQUATIC_SEDIMENT_POINTS: renderLocationPopup,
    AQUATIC_SENSOR_STATIONS: renderLocationPopup,
    AQUATIC_STAFF_GAUGES: renderLocationPopup,
    AQUATIC_WET_DEPOSITION_POINTS: renderLocationPopup,
    DISTRIBUTED_BASE_PLOTS: function DISTRIBUTED_BASE_PLOTS(siteCode, location) {
      return renderLocationPopup(siteCode, location, [renderPlotSizeAndSlope, renderPlotSamplingModules]);
    },
    DISTRIBUTED_BIRD_GRID_BOUNDARIES: renderLocationPopupWithPlotSizeAndSlope,
    DISTRIBUTED_BIRD_GRIDS: renderLocationPopupWithPlotSizeAndSlope,
    DISTRIBUTED_MAMMAL_GRID_BOUNDARIES: renderLocationPopupWithPlotSizeAndSlope,
    DISTRIBUTED_MAMMAL_GRIDS: renderLocationPopupWithPlotSizeAndSlope,
    DISTRIBUTED_MOSQUITO_POINTS: renderLocationPopupWithPlotSizeAndSlope,
    DISTRIBUTED_TICK_PLOT_BOUNDARIES: renderLocationPopupWithPlotSizeAndSlope,
    DISTRIBUTED_TICK_PLOTS: renderLocationPopupWithPlotSizeAndSlope,
    DOMAINS: function DOMAINS(domainCode) {
      var title = !featureData[domainCode] ? null : /*#__PURE__*/_react.default.createElement("span", null, "NEON Domain ".concat(domainCode.replace('D', '')), /*#__PURE__*/_react.default.createElement("br", null), featureData[domainCode].name);
      return renderBoundaryPopup(domainCode, title, [renderChildSites]);
    },
    FLIGHT_BOX_BOUNDARIES: renderBoundaryPopup,
    HUTS: renderLocationPopup,
    MEGAPITS: renderLocationPopup,
    POUR_POINTS: function POUR_POINTS(siteCode) {
      return /*#__PURE__*/_react.default.createElement(_reactLeaflet.Popup, popupProps, renderPopupTitle("".concat(siteCode, " Watershed Pour Point")), /*#__PURE__*/_react.default.createElement(_Grid.default, {
        container: true,
        spacing: 1
      }, renderLocationSiteAndDomain(siteCode)));
    },
    SAMPLING_BOUNDARIES: renderBoundaryPopup,
    STATES: function STATES(stateCode) {
      return renderBoundaryPopup(stateCode, featureData[stateCode] ? featureData[stateCode].name : stateCode, [renderChildSites]);
    },
    TERRESTRIAL_CORE_SITES: renderSitePopup,
    TERRESTRIAL_RELOCATABLE_SITES: renderSitePopup,
    TOWER_AIRSHEDS: renderBoundaryPopup,
    TOWER_BASE_PLOTS: function TOWER_BASE_PLOTS(siteCode, location) {
      return renderLocationPopup(siteCode, location, [renderPlotSizeAndSlope, renderPlotSamplingModules]);
    },
    TOWER_PHENOLOGY_PLOT_BOUNDARIES: renderLocationPopupWithPlotSizeAndSlope,
    TOWER_PHENOLOGY_PLOTS: renderLocationPopupWithPlotSizeAndSlope,
    TOWER_SOIL_PLOTS: renderLocationPopup,
    TOWERS: function TOWERS(siteCode, location) {
      return renderLocationPopup(siteCode, location, [renderTowerDetails]);
    },
    WATERSHED_BOUNDARIES: renderBoundaryPopup
  };

  var renderPopup = function renderPopup(siteCode) {
    var location = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (typeof renderPopupFunctions[featureKey] !== 'function' || !featureData[siteCode] || location !== null && !featureData[siteCode][location]) {
      return null;
    }

    return renderPopupFunctions[featureKey](siteCode, location);
  };
  /**
     Render a single shape (marker, rectangle, or polygon)
  */


  var baseColor = featureStyle ? featureStyle.color : '#666666';
  var hoverColor = "#".concat((0, _tinycolor.default)(baseColor).lighten(10).toHex());
  var darkenedBaseColor = "#".concat((0, _tinycolor.default)(baseColor).darken(20).toHex());

  var isPoint = function isPoint(shapeData) {
    var shapeKeys = Object.keys(shapeData);
    return shapeKeys.includes('geometry') && Object.keys(shapeData.geometry).includes('coordinates') && Array.isArray(shapeData.geometry.coordinates) && shapeData.geometry.coordinates.length === 2 && shapeData.geometry.coordinates.every(function (x) {
      return Number.isFinite(x);
    }) || shapeKeys.includes('latitude') && shapeKeys.includes('longitude');
  };

  var renderShape = function renderShape(primaryId) {
    var secondaryId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var polygonInteractionProps = {
      onMouseOver: function onMouseOver(e) {
        e.target._path.setAttribute('stroke', hoverColor);

        e.target._path.setAttribute('fill', hoverColor);
      },
      onMouseOut: function onMouseOut(e) {
        e.target._path.setAttribute('stroke', featureStyle.color);

        e.target._path.setAttribute('fill', featureStyle.color);
      }
    };
    var shapeData = secondaryId && featureData[primaryId][secondaryId] ? featureData[primaryId][secondaryId] : featureData[primaryId];
    var isSelected = false;

    if (selectionActive) {
      isSelected = secondaryId ? selectedItems.has(secondaryId) : selectedItems.has(primaryId);
    }

    var isHighlighted = primaryIdOnly && !secondaryId && primaryId === focusLocation || !primaryIdOnly && secondaryId && secondaryId === focusLocation;
    var key = secondaryId ? "".concat(primaryId, " - ").concat(secondaryId) : primaryId;
    var renderedPopup = renderPopup(primaryId, secondaryId);
    var shapeKeys = Object.keys(shapeData);
    var position = [];
    var positions = [];
    var icon = null;
    var marker = null;
    var interaction = {};
    var shapeProps = {};

    if (shapeData.geometry && shapeData.geometry.coordinates) {
      positions = shapeData.geometry.coordinates;

      if (featureShape === 'Polyline') {
        shapeProps = _extends(_extends({}, featureStyle || {}), {}, {
          onMouseOver: function onMouseOver(e) {
            e.target._path.setAttribute('stroke', hoverColor);
          },
          onMouseOut: function onMouseOut(e) {
            e.target._path.setAttribute('stroke', baseColor);
          }
        });
      }

      if (featureShape === 'Polygon') {
        shapeProps = _extends(_extends({}, featureStyle || {}), polygonInteractionProps);

        if (isHighlighted) {
          shapeProps.color = darkenedBaseColor;

          shapeProps.onMouseOut = function (e) {
            e.target._path.setAttribute('stroke', darkenedBaseColor);

            e.target._path.setAttribute('fill', darkenedBaseColor);
          };
        }
      }
    }

    if (featureShape === 'Marker' && isPoint(shapeData)) {
      position = ['latitude', 'longitude'].every(function (k) {
        return shapeKeys.includes(k);
      }) ? [shapeData.latitude, shapeData.longitude] : shapeData.geometry.coordinates;

      if (state.map.zoomedIcons[featureKey] !== null) {
        var baseIcon = state.map.zoomedIcons[featureKey];
        var selection = isSelected ? _SiteMapUtils.SELECTION_STATUS.SELECTED : _SiteMapUtils.SELECTION_STATUS.UNSELECTED;
        var initialHighlight = isHighlighted ? _SiteMapUtils.HIGHLIGHT_STATUS.HIGHLIGHT : _SiteMapUtils.HIGHLIGHT_STATUS.NONE;
        icon = baseIcon[selection][initialHighlight];
        var hasPopup = typeof renderPopupFunctions[featureKey] === 'function';
        interaction = selectionActive ? {
          onMouseOver: function onMouseOver(e) {
            var highlight = _SiteMapUtils.HIGHLIGHT_STATUS[isSelected ? 'HIGHLIGHT' : 'SELECT'];
            e.target.setIcon(baseIcon[selection][highlight]);

            e.target._bringToFront();

            if (hasPopup) {
              e.target.openPopup();
              positionPopup(e.target, e.latlng, selectionActive);
            }
          },
          onMouseOut: function onMouseOut(e) {
            var highlight = _SiteMapUtils.HIGHLIGHT_STATUS[isSelected ? initialHighlight : 'SELECT'];
            e.target.setIcon(baseIcon[selection][highlight]);

            if (hasPopup) {
              e.target.closePopup();
            }
          }
          /*
          onClick: (e) => {
            console.log('SELECT', e.target);
          },
          */

        } : {
          onMouseOver: function onMouseOver(e) {
            e.target.setIcon(baseIcon[selection][_SiteMapUtils.HIGHLIGHT_STATUS.HIGHLIGHT]);

            e.target._bringToFront();
          },
          onMouseOut: function onMouseOut(e) {
            e.target.setIcon(baseIcon[selection][initialHighlight]);
          },
          onClick: function onClick(e) {
            if (hasPopup) {
              var popupOpen = e.target._popup.isOpen();

              var func = function func() {
                return positionPopup(e.target, e.latlng, selectionActive);
              };

              dispatch({
                type: 'setMapRepositionOpenPopupFunc',
                func: func
              });

              if (popupOpen) {
                func();
              }
            }
          }
        };
      }

      marker = /*#__PURE__*/_react.default.createElement(_reactLeaflet.Marker, _extends({
        key: "".concat(key, "-marker"),
        position: position,
        title: key,
        icon: icon
      }, interaction), renderedPopup);
    }

    switch (featureShape) {
      case 'Marker':
        return marker;

      case 'Circle':
        return /*#__PURE__*/_react.default.createElement(_reactLeaflet.CircleMarker, _extends({
          key: "".concat(key, "-circlemarker"),
          title: key,
          center: position,
          radius: Math.max(state.map.zoom - 10, 3)
        }, featureStyle, polygonInteractionProps), renderedPopup);

      case 'Polygon':
        return positionsArrayIsValid(positions, featureType === _SiteMapUtils.FEATURE_TYPES.SAMPLING_POINTS) ? /*#__PURE__*/_react.default.createElement(_reactLeaflet.Polygon, _extends({
          key: "".concat(key, "-polygon"),
          positions: positions
        }, shapeProps), renderedPopup) : null;

      case 'Polyline':
        return /*#__PURE__*/_react.default.createElement(_reactLeaflet.Polyline, _extends({
          key: "".concat(key, "-polyline"),
          positions: positions
        }, shapeProps), renderedPopup);

      default:
        return null;
    }
  };
  /**
     Main Render
  */


  return /*#__PURE__*/_react.default.createElement(_reactLeaflet.FeatureGroup, null, Object.keys(featureData).sort(function (a) {
    return a === state.focusLocation.current ? 1 : -1;
  }).flatMap(function (keyA) {
    if ([_SiteMapUtils.FEATURE_TYPES.LOCATIONS, _SiteMapUtils.FEATURE_TYPES.SAMPLING_POINTS].includes(featureType)) {
      return Object.keys(featureData[keyA]).map(function (keyB) {
        return renderShape(keyA, keyB);
      });
    }

    return renderShape(keyA);
  }));
};

SiteMapFeature.propTypes = {
  mapRef: _propTypes.default.shape({
    current: _propTypes.default.instanceOf(_reactLeaflet.Map)
  }).isRequired,
  featureKey: _propTypes.default.oneOf(Object.keys(_SiteMapUtils.FEATURES)).isRequired
};
var _default = SiteMapFeature;
exports.default = _default;