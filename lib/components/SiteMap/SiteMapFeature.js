"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
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
var _HelpOutline = _interopRequireDefault(require("@material-ui/icons/HelpOutline"));
var _TouchApp = _interopRequireDefault(require("@material-ui/icons/TouchApp"));
var _Terrain = _interopRequireDefault(require("@material-ui/icons/Terrain"));
var _InsertChartOutlined = _interopRequireDefault(require("@material-ui/icons/InsertChartOutlined"));
var _MyLocation = _interopRequireDefault(require("@material-ui/icons/MyLocation"));
var _Place = _interopRequireDefault(require("@material-ui/icons/Place"));
var _InfoOutlined = _interopRequireDefault(require("@material-ui/icons/InfoOutlined"));
var _NotInterested = _interopRequireDefault(require("@material-ui/icons/NotInterested"));
var _DoneOutline = _interopRequireDefault(require("@material-ui/icons/DoneOutline"));
var _Remove = _interopRequireDefault(require("@material-ui/icons/Remove"));
require("leaflet/dist/leaflet.css");
var _reactLeaflet = require("react-leaflet");
var _SiteMapContext = _interopRequireDefault(require("./SiteMapContext"));
var _SiteMapUtils = require("./SiteMapUtils");
var _Theme = _interopRequireWildcard(require("../Theme/Theme"));
var _typeUtil = require("../../util/typeUtil");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) { ; } } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    selectionSnackbar: {
      width: '100%',
      color: '#000',
      justifyContent: 'center',
      padding: theme.spacing(0, 1),
      boxShadow: 'none'
    },
    unselectableSnackbar: {
      backgroundColor: _Theme.COLORS.GREY[100],
      border: "1px solid ".concat(_Theme.COLORS.GREY[600], "80")
    },
    addToSelectionSnackbar: {
      backgroundColor: _Theme.COLORS.GREEN[100],
      border: "1px solid ".concat(_Theme.COLORS.GREEN[600], "80")
    },
    removeFromSelectionSnackbar: {
      backgroundColor: _Theme.COLORS.BROWN[100],
      border: "1px solid ".concat(_Theme.COLORS.BROWN[600], "80")
    },
    selectedSelectionSnackbar: {
      backgroundColor: _Theme.COLORS.LIGHT_BLUE[100],
      border: "1px solid ".concat(theme.palette.primary.main, "80")
    },
    snackbarIcon: {
      marginRight: theme.spacing(2)
    },
    unselectableSnackbarIcon: {
      color: _Theme.COLORS.GREY[300]
    },
    addToSelectionSnackbarIcon: {
      color: _Theme.COLORS.GREEN[500]
    },
    removeFromSelectionSnackbarIcon: {
      color: _Theme.COLORS.BROWN[500]
    },
    selectedSelectionSnackbarIcon: {
      color: theme.palette.primary.main
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
    popupSiteSelectedIcon: {
      marginRight: theme.spacing(1)
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
    centerFlex: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
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
    },
    unselectable: {
      filter: 'saturate(0.3) brightness(2)'
    },
    nlcdClass: {
      width: '36px',
      height: '12px',
      border: '1px solid black',
      marginLeft: theme.spacing(1.5),
      marginBottom: '-2px',
      display: 'inline-block'
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
  var feature = _SiteMapUtils.FEATURES[featureKey] || {};
  var _SiteMapContext$useSi = _SiteMapContext.default.useSiteMapContext(),
    _SiteMapContext$useSi2 = _slicedToArray(_SiteMapContext$useSi, 2),
    state = _SiteMapContext$useSi2[0],
    dispatch = _SiteMapContext$useSi2[1];
  var name = feature.name,
    nameSingular = feature.nameSingular,
    featureType = feature.type,
    description = feature.description,
    featureStyle = feature.style,
    featureShape = feature.featureShape,
    iconSvg = feature.iconSvg,
    _feature$primaryIdOnl = feature.primaryIdOnly,
    primaryIdOnly = _feature$primaryIdOnl === void 0 ? false : _feature$primaryIdOnl,
    _feature$amplifyHighl = feature.amplifyHighlighted,
    amplifyHighlighted = _feature$amplifyHighl === void 0 ? false : _feature$amplifyHighl,
    parentDataFeatureKey = feature.parentDataFeatureKey;
  var featureName = nameSingular || name || featureKey;
  if (!_SiteMapUtils.FEATURES[featureKey] || !mapRef.current) {
    return null;
  }
  var featureDescription = description;
  var parentFeature = null;
  if (parentDataFeatureKey && _SiteMapUtils.FEATURES[parentDataFeatureKey]) {
    parentFeature = _SiteMapUtils.FEATURES[parentDataFeatureKey];
    if (description === 'PARENT') {
      featureDescription = parentFeature.description;
    }
  }

  // Groups don't render anything ever!
  if (featureType === _SiteMapUtils.FEATURE_TYPES.GROUP.KEY) {
    return null;
  }

  /**
     Extract feature data from SiteMapContext state
  */
  var neonContextHydrated = state.neonContextHydrated,
    manualLocationData = state.manualLocationData,
    mapBounds = state.map.bounds,
    focusLocation = state.focusLocation.current,
    featureData = state.featureData[parentFeature ? parentFeature.type : featureType][parentFeature ? parentFeature.KEY : featureKey];
  if (!neonContextHydrated || !featureData || !Object.keys(featureData)) {
    return null;
  }

  // Whether this feature can affect selection of items in the map
  var _state$selection = state.selection,
    selectableFeatureType = _state$selection.active,
    selectedItems = _state$selection.set,
    validItems = _state$selection.validSet,
    selectionLimit = _state$selection.limit,
    hideUnselectable = _state$selection.hideUnselectable;
  var selectionActive = !!state.selection.active;
  var selectionType = selectionActive ? state.selection.active : null;
  var selectingCurrentFeatureType = selectionType === featureType;

  // Whether interaction on this type means selection of another type (e.g. clicking a state or
  // domain to affect selection of sites in those regions; distinct from selection states or domains
  // directly).
  var selectingActiveTypeByProxy = false;
  if (selectionActive && !selectingCurrentFeatureType) {
    switch (selectionType) {
      case _SiteMapUtils.FEATURE_TYPES.SITES.KEY:
        if ([_SiteMapUtils.FEATURES.DOMAINS.KEY, _SiteMapUtils.FEATURES.STATES.KEY].includes(featureKey)) {
          selectingActiveTypeByProxy = true;
        }
        break;
      default:
        break;
    }
  }

  // Jump-To function to afford map navigation where appropriate
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
    containerNode.style.marginBottom = '0px';
    // Leaflet popups always open above; open below if mouse event is in the top half of the map
    if (containerPoint.y < mapRef.current.container.clientHeight / 2) {
      var contentHeight = containerNode.clientHeight;
      var tipHeight = tipNode.clientHeight;
      var contentBottom = 0 - iconHeight - contentHeight - tipHeight - 1.5 * containerBottom;
      var tipBottom = contentHeight + tipHeight - 1;
      containerNode.style.bottom = "".concat(contentBottom, "px");
      tipNode.style.transform = "rotate(0.5turn) translate(0px, ".concat(tipBottom, "px)");
    } else {
      containerNode.style.bottom = "".concat(-1.5 * containerBottom, "px");
      popup._tipContainer.style.transform = 'translate(0px, -1px)';
    }
    // For left/right we move the popup horizontally as needed while keeping the tip stationary
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
  var markerIcon = /*#__PURE__*/_react.default.createElement(_Place.default, {
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
    } else if (featureStyle && ![_SiteMapUtils.FEATURES.DOMAINS.KEY, _SiteMapUtils.FEATURES.STATES.KEY].includes(featureKey)) {
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
     Optionally ghost (fade) icon if selection is active but it's not selectable. If true and the
     site is not selectable this will also skip rendering altogether when hideUnselectable is true.
  */
  var renderSite = function renderSite(siteCode) {
    var ghostUnselectable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var site = state.sites[siteCode];
    if (!site) {
      return null;
    }
    var siteFeatureKey = "".concat(site.terrain, "_").concat(site.type, "_SITES");
    if (!_SiteMapUtils.FEATURES[siteFeatureKey]) {
      return null;
    }
    var isSelected = selectedItems.has(siteCode);
    var siteIcon = _SiteMapUtils.FEATURES[siteFeatureKey][isSelected ? 'iconSelectedSvg' : 'iconSvg'];
    var selectedIcon = null;
    var markerStyle = {};
    if (selectionActive && selectionType === _SiteMapUtils.FEATURE_TYPES.SITES.KEY) {
      if (validItems && !validItems.has(siteCode)) {
        // eslint-disable-next-line max-len
        selectedIcon = /*#__PURE__*/_react.default.createElement(_NotInterested.default, {
          color: "disabled",
          style: {
            padding: '4px'
          },
          className: classes.popupSiteSelectedIcon
        });
        if (ghostUnselectable) {
          if (hideUnselectable) {
            return null;
          }
          markerStyle.filter = _SiteMapUtils.UNSELECTABLE_MARKER_FILTER;
        }
      } else {
        selectedIcon = isSelected ? /*#__PURE__*/_react.default.createElement(_DoneOutline.default, {
          className: classes.popupSiteSelectedIcon,
          color: "primary"
        }) : /*#__PURE__*/_react.default.createElement(_Remove.default, {
          className: classes.popupSiteSelectedIcon,
          color: "disabled"
        });
      }
    }
    var internal = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, selectedIcon, /*#__PURE__*/_react.default.createElement("img", {
      src: siteIcon,
      alt: siteCode,
      className: classes.popupSiteIcon,
      style: markerStyle
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
    return selectionActive ? /*#__PURE__*/_react.default.createElement("div", containerProps, internal) : /*#__PURE__*/_react.default.createElement(_Link.default, _extends({
      variant: "caption",
      component: "button",
      onClick: function onClick() {
        return jumpTo(site.siteCode);
      },
      "data-selenium": "sitemap-map-popup-siteLink"
    }, containerProps), internal);
  };

  /**
     Render: Latitude / Longitude with Copy to Clipboard
  */
  var renderLatLon = function renderLatLon(latitude, longitude) {
    var right = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var renderSubtitle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var iconButtonProps = {
      size: 'small',
      style: {
        marginRight: _Theme.default.spacing(0.5)
      }
    };
    var coords = Number.isFinite(latitude) && Number.isFinite(longitude) ? /*#__PURE__*/_react.default.createElement("div", {
      className: classes[right ? 'endFlex' : 'startFlex'],
      "data-selenium": "sitemap-map-popup-coordinates"
    }, /*#__PURE__*/_react.default.createElement(_reactCopyToClipboard.CopyToClipboard, {
      text: "".concat(latitude.toFixed(5), " ").concat(longitude.toFixed(5))
    }, selectionActive ? /*#__PURE__*/_react.default.createElement(_IconButton.default, _extends({}, iconButtonProps, {
      "aria-label": "Latitude / Longitude",
      disabled: selectionActive
    }), /*#__PURE__*/_react.default.createElement(_MyLocation.default, null)) : /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      title: "Latitude / Longitude (click to copy)"
    }, /*#__PURE__*/_react.default.createElement(_IconButton.default, _extends({}, iconButtonProps, {
      "aria-label": "Latitude / Longitude (click to copy)",
      disabled: selectionActive
    }), /*#__PURE__*/_react.default.createElement(_MyLocation.default, null)))), /*#__PURE__*/_react.default.createElement(_Typography.default, {
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
    }, "Plot Slope"), renderNumericalValue(loc.slopeAspect, 'Aspect', "\xB0", 2, 'Slope Aspect', right), renderNumericalValue(loc.slopeGradient, 'Gradient', '%', 2, 'Slope Gradient', right));
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
    }, renderNumericalValue(areaKm2, null, "km\xB2", 2, "Area (km\xB2)"), areaAcres === null ? null : /*#__PURE__*/_react.default.createElement("div", {
      style: {
        marginLeft: _Theme.default.spacing(1)
      }
    }, renderNumericalValue(areaAcres, null, ' acres', 2, 'Area (acres)', false, true))));
  };

  /**
     Render Method: Popup Row; Child NEON Sites (e.g. within a domain or state)
  */
  var renderChildSites = function renderChildSites(boundaryKey) {
    var _featureData$boundary = featureData[boundaryKey].sites,
      sites = _featureData$boundary === void 0 ? new Set() : _featureData$boundary;
    var selectable = null;
    if (selectionActive && selectionType === _SiteMapUtils.FEATURE_TYPES.SITES.KEY) {
      var selectableSites = new Set(_toConsumableArray(sites).filter(function (siteCode) {
        return !validItems || validItems.has(siteCode);
      }));
      if (!selectableSites.size) {
        selectable = ', none selectable';
      } else {
        selectable = selectableSites.size === sites.size ? ', all selectable' : " total, ".concat(selectableSites.size, " selectable");
      }
    }
    return /*#__PURE__*/_react.default.createElement(_Grid.default, {
      key: "childSites",
      item: true,
      xs: 12,
      "data-selenium": "sitemap-map-popup-childSites",
      style: {
        marginBottom: _Theme.default.spacing(2)
      }
    }, !sites.size ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2",
      gutterBottom: true
    }, "NEON Sites"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption"
    }, /*#__PURE__*/_react.default.createElement("i", null, "none"))) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2",
      gutterBottom: true
    }, "NEON Sites (".concat(sites.size).concat(selectable || '', "):")), /*#__PURE__*/_react.default.createElement("div", null, _toConsumableArray(sites).map(function (siteCode) {
      return renderSite(siteCode, selectionType === _SiteMapUtils.FEATURE_TYPES.SITES.KEY);
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
     Render: Popup Row; NLCD Classes (nationalLandCoverDatabase2001)
  */
  var renderNlcdClass = function renderNlcdClass(loc) {
    var nlcd = /*#__PURE__*/_react.default.createElement("i", null, "n/a");
    var titleStyle = {};
    if (loc.nlcdClass) {
      nlcd = loc.nlcdClass;
      if (_SiteMapUtils.NLCD_CLASSES[loc.nlcdClass]) {
        titleStyle.marginBottom = '-4px';
        var tooltip = "".concat(_SiteMapUtils.NLCD_CLASSES[loc.nlcdClass].name, " - ").concat(_SiteMapUtils.NLCD_CLASSES[loc.nlcdClass].description);
        nlcd = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, _SiteMapUtils.NLCD_CLASSES[loc.nlcdClass].name, /*#__PURE__*/_react.default.createElement("div", {
          className: classes.nlcdClass,
          title: _SiteMapUtils.NLCD_CLASSES[loc.nlcdClass].name,
          style: {
            backgroundColor: _SiteMapUtils.NLCD_CLASSES[loc.nlcdClass].color
          }
        }), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
          title: tooltip
        }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
          size: "small",
          style: {
            marginLeft: _Theme.default.spacing(0.5),
            marginBottom: '1px'
          },
          "aria-label": "NLCD Class Description"
        }, /*#__PURE__*/_react.default.createElement(_HelpOutline.default, {
          style: {
            fontSize: '1rem'
          }
        }))));
      }
    }
    return /*#__PURE__*/_react.default.createElement(_Grid.default, {
      key: "nlcdClass",
      item: true,
      xs: 12,
      "data-selenium": "sitemap-map-popup-nlcdClass"
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2",
      style: titleStyle
    }, "NLCD Class"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption"
    }, nlcd));
  };

  /**
     Render: Popup Row; Location Site and Domain
  */
  var renderLocationSiteAndDomain = function renderLocationSiteAndDomain(siteCode) {
    var site = state.sites[siteCode];
    if (!site || !state.featureData.DOMAINS.DOMAINS[site.domainCode]) {
      return null;
    }
    var domainName = state.featureData.DOMAINS.DOMAINS[site.domainCode].name;
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
    }), loc.nlcdClass ? renderNlcdClass(loc) : null, renderLocationSiteAndDomain(siteCode)));
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
     Render: Region Selection Action
  */
  var renderRegionSelectionAction = function renderRegionSelectionAction(boundaryFeatureKey, boundaryKey) {
    if (!selectionActive || !state.selection.derived[boundaryFeatureKey] || selectionLimit === 1) {
      return null;
    }
    var _featureData$boundary2 = featureData[boundaryKey].sites,
      boundarySites = _featureData$boundary2 === void 0 ? new Set() : _featureData$boundary2;
    if (!boundarySites.size) {
      return null;
    }
    var selectionPortion = state.selection.derived[boundaryFeatureKey][boundaryKey] || null;
    var selectableSites = !validItems ? boundarySites : new Set(_toConsumableArray(boundarySites).filter(function (siteCode) {
      return validItems.has(siteCode);
    }));
    var selectableCount = selectableSites.size;
    var ActionIcon = selectableCount ? _TouchApp.default : _NotInterested.default;
    var selectable = boundarySites.size === selectableCount ? '' : ' selectable';
    var thisOne = boundarySites.size === selectableCount ? 'this one' : 'the one';
    var action = selectableCount === 1 ? "add ".concat(thisOne).concat(selectable, " site") : "add all ".concat(selectableCount).concat(selectable, " sites");
    var preposition = 'to';
    /* eslint-disable max-len */
    var snackbarClass = classes[selectableCount ? 'addToSelectionSnackbar' : 'unselectableSnackbar'];
    var snackbarIconClass = classes[selectableCount ? 'addToSelectionSnackbarIcon' : 'unselectableSnackbarIcon'];
    /* eslint-enable max-len */
    var actionText = "No sites in this ".concat(_SiteMapUtils.FEATURES[boundaryFeatureKey].nameSingular, " are selectable");
    if (selectableCount) {
      if (selectionPortion === _SiteMapUtils.SELECTION_PORTIONS.PARTIAL) {
        var intersection = new Set(_toConsumableArray(selectableSites).filter(function (x) {
          return selectedItems.has(x);
        }));
        var remaining = selectableCount - intersection.size;
        action = "add remaining ".concat(remaining).concat(selectable, " site").concat(remaining === 1 ? '' : 's');
      }
      if (selectionPortion === _SiteMapUtils.SELECTION_PORTIONS.TOTAL) {
        action = selectableCount === 1 ? "remove ".concat(thisOne).concat(selectable, " site") : "remove all ".concat(selectableCount).concat(selectable, " sites");
        preposition = 'from';
        snackbarClass = classes.removeFromSelectionSnackbar;
        snackbarIconClass = classes.removeFromSelectionSnackbarIcon;
      }
      actionText = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "Click to ", /*#__PURE__*/_react.default.createElement("b", null, action), " ", preposition, " selection");
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      key: boundaryKey,
      className: classes.centerFlex,
      style: {
        padding: _Theme.default.spacing(0.5)
      }
    }, /*#__PURE__*/_react.default.createElement(_SnackbarContent.default, {
      className: "".concat(classes.selectionSnackbar, " ").concat(snackbarClass),
      message: /*#__PURE__*/_react.default.createElement("div", {
        className: classes.startFlex
      }, /*#__PURE__*/_react.default.createElement(ActionIcon, {
        className: "".concat(classes.snackbarIcon, " ").concat(snackbarIconClass)
      }), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body2"
      }, actionText)))
    }));
  };

  /**
     Render: Item Selection Action Snackbar for a Popup
     (Only for selecting the item directly; selection by proxy action snackbars are different)
  */
  var renderItemSelectionActionSnackbar = function renderItemSelectionActionSnackbar(item) {
    if (!selectionActive) {
      return null;
    }
    var unit = _SiteMapUtils.FEATURE_TYPES[selectionType].unit || 'item';
    var isSelectable = !validItems || validItems.has(item);
    var isSelected = selectedItems.has(item);
    var verb = isSelected ? 'remove' : 'add';
    var preposition = isSelected ? 'from' : 'to';
    var ActionIcon = _NotInterested.default;
    var action = "This ".concat(unit, " cannot be selected");
    var snackbarClass = classes.unselectableSnackbar;
    var snackbarIconClass = classes.unselectableSnackbarIcon;
    if (isSelectable) {
      ActionIcon = _TouchApp.default;
      if (selectionLimit === 1) {
        ActionIcon = isSelected ? _DoneOutline.default : _TouchApp.default;
        action = isSelected ? /*#__PURE__*/_react.default.createElement("b", null, "Selected") : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "Click to ", /*#__PURE__*/_react.default.createElement("b", null, "select"));
        snackbarClass = isSelected ? classes.selectedSelectionSnackbar : classes.addToSelectionSnackbar;
        snackbarIconClass = isSelected ? classes.selectedSelectionSnackbarIcon : classes.addToSelectionSnackbarIcon;
      } else {
        action = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "Click to ", /*#__PURE__*/_react.default.createElement("b", null, verb), " ", preposition, " selection");
        snackbarClass = isSelected ? classes.removeFromSelectionSnackbar : classes.addToSelectionSnackbar;
        snackbarIconClass = isSelected ? classes.removeFromSelectionSnackbarIcon : classes.addToSelectionSnackbarIcon;
      }
    }
    return /*#__PURE__*/_react.default.createElement(_SnackbarContent.default, {
      key: "renderItemSelectionActionSnackbar",
      className: "".concat(classes.selectionSnackbar, " ").concat(snackbarClass),
      message: /*#__PURE__*/_react.default.createElement("div", {
        className: classes.startFlex
      }, /*#__PURE__*/_react.default.createElement(ActionIcon, {
        className: "".concat(classes.snackbarIcon, " ").concat(snackbarIconClass)
      }), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body2"
      }, action)))
    });
  };

  /**
     Render: Site Popup
  */
  var renderSitePopup = function renderSitePopup(siteCode) {
    var site = featureData[siteCode] || {};
    var _state$featureData$FE = state.featureData[_SiteMapUtils.FEATURE_TYPES.STATES.KEY][_SiteMapUtils.FEATURES.STATES.KEY][site.stateCode],
      usState = _state$featureData$FE === void 0 ? {} : _state$featureData$FE;
    var _state$featureData$FE2 = state.featureData[_SiteMapUtils.FEATURE_TYPES.DOMAINS.KEY][_SiteMapUtils.FEATURES.DOMAINS.KEY][site.domainCode],
      domain = _state$featureData$FE2 === void 0 ? {} : _state$featureData$FE2;
    var stateFieldTitle = site.stateCode === 'PR' ? 'Territory' : 'State';
    var renderActions = function renderActions() {
      if (selectionActive) {
        return selectingCurrentFeatureType ? renderItemSelectionActionSnackbar(site.siteCode) : null;
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
    return /*#__PURE__*/_react.default.createElement(_reactLeaflet.Popup, popupProps, renderPopupTitle("".concat(site.description, " (").concat(site.siteCode, ")"), false), selectionActive ? null : /*#__PURE__*/_react.default.createElement(_Link.default, {
      variant: "caption",
      component: "button",
      onClick: function onClick() {
        return jumpTo(site.siteCode);
      },
      style: {
        marginLeft: '-2px',
        marginBottom: '8px'
      },
      "data-selenium": "sitemap-map-popup-siteLink"
    }, markerIcon, "Jump to ".concat(site.siteCode, " on the map")), /*#__PURE__*/_react.default.createElement(_Grid.default, {
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
    }, stateFieldTitle), selectionActive ? /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption"
    }, usState.name) : /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
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
    }, "Domain"), selectionActive ? /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption"
    }, "".concat(site.domainCode, " - ").concat(domain.name)) : /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
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
     Render: Decommissioned Site Popup
  */
  var renderDecommissionedSitePopup = function renderDecommissionedSitePopup(siteCode) {
    var site = featureData[siteCode] || {};
    var _state$featureData$FE3 = state.featureData[_SiteMapUtils.FEATURE_TYPES.STATES.KEY][_SiteMapUtils.FEATURES.STATES.KEY][site.state],
      usState = _state$featureData$FE3 === void 0 ? {} : _state$featureData$FE3;
    var _state$featureData$FE4 = state.featureData[_SiteMapUtils.FEATURE_TYPES.DOMAINS.KEY][_SiteMapUtils.FEATURES.DOMAINS.KEY][site.domain],
      domain = _state$featureData$FE4 === void 0 ? {} : _state$featureData$FE4;
    var stateFieldTitle = site.stateCode === 'PR' ? 'Territory' : 'State';
    return /*#__PURE__*/_react.default.createElement(_reactLeaflet.Popup, popupProps, renderPopupTitle("".concat(site.siteName, " (").concat(site.siteCode, ")"), false), /*#__PURE__*/_react.default.createElement(_Link.default, {
      variant: "caption",
      component: "button",
      onClick: function onClick() {
        return jumpTo(site.siteCode);
      },
      style: {
        marginLeft: '-2px',
        marginBottom: '8px'
      },
      "data-selenium": "sitemap-map-popup-siteLink"
    }, markerIcon, "Jump to ".concat(site.siteCode, " on the map")), /*#__PURE__*/_react.default.createElement(_Grid.default, {
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
    }, stateFieldTitle), selectionActive ? /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption"
    }, usState.name) : /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      title: "Jump to ".concat(usState.name, " on the map")
    }, /*#__PURE__*/_react.default.createElement(_Link.default, {
      variant: "caption",
      component: "button",
      style: {
        textAlign: 'right'
      },
      onClick: function onClick() {
        return jumpTo(site.state);
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
    }, "Domain"), selectionActive ? /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption"
    }, "".concat(site.domain, " - ").concat(domain.name)) : /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      title: "Jump to ".concat(site.domain, " on the map")
    }, /*#__PURE__*/_react.default.createElement(_Link.default, {
      variant: "caption",
      component: "button",
      style: {
        textAlign: 'right'
      },
      onClick: function onClick() {
        return jumpTo(site.domain);
      },
      "data-selenium": "sitemap-map-popup-domainLink"
    }, markerIcon, "".concat(site.domain, " - ").concat(domain.name))))));
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
    AQUATIC_GRADIENT_SITES: renderSitePopup,
    AQUATIC_RIPARIAN_ASSESSMENTS: renderLocationPopup,
    AQUATIC_SEDIMENT_POINTS: renderLocationPopup,
    AQUATIC_SENSOR_STATIONS: renderLocationPopup,
    AQUATIC_STAFF_GAUGES: renderLocationPopup,
    AQUATIC_WET_DEPOSITION_POINTS: renderLocationPopup,
    DECOMMISSIONED_SITES: renderDecommissionedSitePopup,
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
      var title = !featureData[domainCode] ? null : /*#__PURE__*/_react.default.createElement("span", null, "NEON Domain ".concat(domainCode.replace('D', ''), " - ").concat(featureData[domainCode].name));
      var jumpLink = selectionActive ? null : /*#__PURE__*/_react.default.createElement(_Link.default, {
        key: "jumpLink",
        variant: "caption",
        component: "button",
        onClick: function onClick() {
          return jumpTo(domainCode);
        },
        style: {
          marginBottom: '8px'
        },
        "data-selenium": "sitemap-map-popup-domainLink"
      }, markerIcon, "Jump to ".concat(domainCode, " on the map"));
      return renderBoundaryPopup(domainCode, title, [jumpLink, renderChildSites, selectingCurrentFeatureType ? renderItemSelectionActionSnackbar(domainCode) : renderRegionSelectionAction(_SiteMapUtils.FEATURES.DOMAINS.KEY, domainCode)]);
    },
    FLIGHT_BOX_BOUNDARIES: renderBoundaryPopup,
    HUTS: renderLocationPopup,
    MEGAPITS: renderLocationPopup,
    // eslint-disable-next-line react/no-unstable-nested-components
    POUR_POINTS: function POUR_POINTS(siteCode) {
      return /*#__PURE__*/_react.default.createElement(_reactLeaflet.Popup, popupProps, renderPopupTitle("".concat(siteCode, " Watershed Pour Point")), /*#__PURE__*/_react.default.createElement(_Grid.default, {
        container: true,
        spacing: 1
      }, renderLocationSiteAndDomain(siteCode)));
    },
    SAMPLING_BOUNDARIES: renderBoundaryPopup,
    STATES: function STATES(stateCode) {
      var jumpLink = selectionActive ? null : /*#__PURE__*/_react.default.createElement(_Link.default, {
        key: "jumpLink",
        variant: "caption",
        component: "button",
        onClick: function onClick() {
          return jumpTo(stateCode);
        },
        style: {
          marginBottom: '8px'
        },
        "data-selenium": "sitemap-map-popup-stateLink"
      }, markerIcon, "Jump to ".concat(stateCode, " on the map"));
      return renderBoundaryPopup(stateCode, featureData[stateCode] ? featureData[stateCode].name : stateCode, [jumpLink, renderChildSites, selectingCurrentFeatureType ? renderItemSelectionActionSnackbar(stateCode) : renderRegionSelectionAction(_SiteMapUtils.FEATURES.DOMAINS.KEY, stateCode)]);
    },
    TERRESTRIAL_CORE_SITES: renderSitePopup,
    TERRESTRIAL_GRADIENT_SITES: renderSitePopup,
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
  var hasPopup = typeof renderPopupFunctions[featureKey] === 'function';
  var renderPopup = function renderPopup(siteCode) {
    var location = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (!hasPopup || !featureData[siteCode] || location !== null && !featureData[siteCode][location]) {
      return null;
    }
    return renderPopupFunctions[featureKey](siteCode, location);
  };

  /**
     Render a single shape (marker, rectangle, or polygon)
  */
  var baseColor = featureStyle ? featureStyle.color : '#666666';
  var hoverColor = "#".concat((0, _tinycolor.default)(baseColor).lighten(10).toHex());
  var ghostedBaseColor = "#".concat((0, _tinycolor.default)(baseColor).lighten(10).desaturate(60).toHex());
  var ghostedHoverColor = "#".concat((0, _tinycolor.default)(hoverColor).lighten(10).desaturate(60).toHex());
  var darkenedBaseColor = "#".concat((0, _tinycolor.default)(baseColor).darken(15).toHex());
  var darkenedMoreBaseColor = "#".concat((0, _tinycolor.default)(darkenedBaseColor).darken(15).toHex());
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
    var isSelectable = null;
    var isSelected = false;
    if (selectionActive) {
      isSelectable = !validItems || (secondaryId ? validItems.has(secondaryId) : validItems.has(primaryId));
      isSelected = secondaryId ? selectedItems.has(secondaryId) : selectedItems.has(primaryId);
      if (featureType === selectableFeatureType && hideUnselectable && !isSelectable) {
        return null;
      }
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
      // Polyline
      if (featureShape === 'Polyline') {
        shapeProps = _extends({}, featureStyle || {}, {
          onMouseOver: function onMouseOver(e) {
            e.target._path.setAttribute('stroke', hoverColor);
          },
          onMouseOut: function onMouseOut(e) {
            e.target._path.setAttribute('stroke', baseColor);
          }
        });
      }
      // Polygon
      if (featureShape === 'Polygon') {
        // If the polygon boundary does not intersect the map bounds then do not render it
        // We see this when the map bounds are entirely contained within a boundary but the
        // feature is still visible, resulting in an always-on popup with no context otherwise
        if (!(0, _SiteMapUtils.calculateLocationsInBounds)({
          X: shapeData
        }, mapBounds).length) {
          return null;
        }
        shapeProps = _extends({}, featureStyle || {}, polygonInteractionProps);
        // ReactLeaflet does not suport the mask prop, so add it as an unused class.
        // The LayoutEffect in SiteMapLeaflet.jsx then applies it as a mask attribute.
        if ([_SiteMapUtils.FEATURES.DOMAINS.KEY, _SiteMapUtils.FEATURES.STATES.KEY].includes(featureKey)) {
          shapeProps.className = "#mask_".concat(featureKey, "_").concat(primaryId);
        }
        if (isHighlighted) {
          shapeProps.color = darkenedBaseColor;
          shapeProps.onMouseOut = function (e) {
            e.target._path.setAttribute('stroke', darkenedBaseColor);
            e.target._path.setAttribute('fill', darkenedBaseColor);
          };
        } else if ((0, _typeUtil.exists)(focusLocation) && amplifyHighlighted) {
          // Determine if the feature type of the focus location
          // is set to amplify highlighted for this feature type (eg, same type)
          var amplifyFeatureKeys = Object.keys(_SiteMapUtils.FEATURES).filter(function (k) {
            return _SiteMapUtils.FEATURES[k].amplifyHighlighted && _SiteMapUtils.FEATURES[k].matchLocationType;
          });
          var isFocusAmplifiable = amplifyFeatureKeys.find(function (amplifyFeatureKey) {
            if ((0, _typeUtil.exists)(state.focusLocation) && (0, _typeUtil.exists)(state.focusLocation.data) && (0, _typeUtil.exists)(state.focusLocation.data.type)) {
              return new RegExp(_SiteMapUtils.FEATURES[amplifyFeatureKey].matchLocationType).test(state.focusLocation.data.type);
            }
            return false;
          });
          if (isFocusAmplifiable) {
            shapeProps.color = ghostedHoverColor;
            shapeProps.onMouseOut = function (e) {
              e.target._path.setAttribute('stroke', ghostedHoverColor);
              e.target._path.setAttribute('fill', ghostedHoverColor);
            };
          }
        }
        if (selectionActive) {
          var returnColor = isHighlighted ? darkenedBaseColor : featureStyle.color;
          var useHoverColor = hoverColor;
          if (selectingCurrentFeatureType) {
            if (state.selection.set.has(primaryId)) {
              returnColor = darkenedMoreBaseColor;
            }
            if (!isSelectable) {
              returnColor = ghostedBaseColor;
              useHoverColor = ghostedHoverColor;
            }
          }
          if (selectingActiveTypeByProxy) {
            var _baseColors;
            var baseColors = (_baseColors = {}, _defineProperty(_baseColors, _SiteMapUtils.SELECTION_PORTIONS.PARTIAL, darkenedBaseColor), _defineProperty(_baseColors, _SiteMapUtils.SELECTION_PORTIONS.TOTAL, darkenedMoreBaseColor), _baseColors);
            if (state.selection.derived[featureKey] && state.selection.derived[featureKey][primaryId]) {
              // eslint-disable-next-line max-len
              returnColor = baseColors[state.selection.derived[featureKey][primaryId]] || featureStyle.color;
            }
          }
          shapeProps.color = returnColor;
          shapeProps.onMouseOver = function (e) {
            e.target._path.setAttribute('stroke', useHoverColor);
            e.target._path.setAttribute('fill', useHoverColor);
            if (hasPopup) {
              e.target.openPopup();
              positionPopup(e.target, e.latlng, true);
            }
          };
          shapeProps.onMouseMove = function (e) {
            if (hasPopup) {
              positionPopup(e.target, e.latlng, true);
            }
          };
          shapeProps.onMouseOut = function (e) {
            e.target._path.setAttribute('stroke', returnColor);
            e.target._path.setAttribute('fill', returnColor);
            if (hasPopup) {
              e.target.closePopup();
            }
          };
          // Onclick to select sites by way of clicking a state or domain to capture sites within
          if (selectingActiveTypeByProxy && selectionLimit !== 1) {
            shapeProps.onClick = function () {
              if (featureKey === _SiteMapUtils.FEATURES.DOMAINS.KEY) {
                dispatch({
                  type: 'toggleSitesSelectedForDomain',
                  domainCode: primaryId
                });
              }
              if (featureKey === _SiteMapUtils.FEATURES.STATES.KEY) {
                dispatch({
                  type: 'toggleSitesSelectedForState',
                  stateCode: primaryId
                });
              }
            };
          }
          // Onclick to select states or domains directly
          if (selectionType === featureType) {
            shapeProps.onClick = function () {
              if (isSelectable) {
                dispatch({
                  type: 'toggleItemSelected',
                  item: primaryId
                });
              }
            };
          }
        }
      }
    }
    // Marker
    if (featureShape === 'Marker' && isPoint(shapeData)) {
      position = ['latitude', 'longitude'].every(function (k) {
        return shapeKeys.includes(k);
      }) ? [shapeData.latitude, shapeData.longitude] : shapeData.geometry.coordinates;
      if (state.map.zoomedIcons[featureKey] !== null) {
        var baseIcon = state.map.zoomedIcons[featureKey];
        var selection = isSelectable && isSelected ? _SiteMapUtils.SELECTION_STATUS.SELECTED : _SiteMapUtils.SELECTION_STATUS.UNSELECTED;
        var initialHighlight = isHighlighted ? _SiteMapUtils.HIGHLIGHT_STATUS.HIGHLIGHT : _SiteMapUtils.HIGHLIGHT_STATUS.NONE;
        if (baseIcon && baseIcon[selection]) {
          icon = baseIcon[selection][initialHighlight];
          interaction = {
            onMouseOver: function onMouseOver(e) {
              var highlight = _SiteMapUtils.HIGHLIGHT_STATUS.HIGHLIGHT;
              if (selectionActive && selectingCurrentFeatureType && isSelectable) {
                highlight = _SiteMapUtils.HIGHLIGHT_STATUS[isSelected ? 'HIGHLIGHT' : 'SELECT'];
              }
              e.target.setIcon(baseIcon[selection][highlight]);
              e.target._bringToFront();
              if (hasPopup && selectionActive) {
                e.target.openPopup();
                positionPopup(e.target, e.latlng, selectionActive);
              }
            },
            onMouseOut: function onMouseOut(e) {
              e.target.setIcon(baseIcon[selection][initialHighlight]);
              if (hasPopup && selectionActive) {
                e.target.closePopup();
              }
            },
            onClick: function onClick(e) {
              if (!selectionActive && hasPopup) {
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
              if (selectionActive && selectingCurrentFeatureType && isSelectable) {
                switch (selectionType) {
                  case _SiteMapUtils.FEATURE_TYPES.SITES.KEY:
                    if (shapeData.siteCode) {
                      dispatch({
                        type: 'toggleItemSelected',
                        item: shapeData.siteCode
                      });
                    }
                    break;
                  default:
                    break;
                }
              }
            }
          };
        }
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
        // Only render polygon popups when not in area selection mode. Otherwise area selection
        // could neither start, move, nor end over feature shapes.
        if (!positionsArrayIsValid(positions, featureType === _SiteMapUtils.FEATURE_TYPES.SAMPLING_POINTS.KEY)) {
          return null;
        }
        return state.map.mouseMode === _SiteMapUtils.MAP_MOUSE_MODES.AREA_SELECT ? /*#__PURE__*/_react.default.createElement(_reactLeaflet.Polygon, _extends({
          key: "".concat(key, "-polygon"),
          positions: positions
        }, shapeProps, {
          onMouseOver: null,
          onMouseMove: null,
          onMouseOut: null
        })) : /*#__PURE__*/_react.default.createElement(_reactLeaflet.Polygon, _extends({
          key: "".concat(key, "-polygon"),
          positions: positions
        }, shapeProps), renderedPopup);
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
  var renderableKeys = Object.keys(featureData);
  if (Array.isArray(manualLocationData) && manualLocationData.length) {
    var hasPrototypeSites = manualLocationData.some(function (ml) {
      return ml.manualLocationType === _SiteMapUtils.MANUAL_LOCATION_TYPES.PROTOTYPE_SITE;
    });
    if (hasPrototypeSites && featureType === _SiteMapUtils.FEATURE_TYPES.SITES.KEY) {
      var allKeys = Object.keys(featureData);
      renderableKeys = manualLocationData.filter(function (ml) {
        return ml.manualLocationType === _SiteMapUtils.MANUAL_LOCATION_TYPES.PROTOTYPE_SITE && allKeys.includes(ml.siteCode);
      }).map(function (ml) {
        return ml.siteCode;
      });
    }
  }
  return /*#__PURE__*/_react.default.createElement(_reactLeaflet.FeatureGroup, null, renderableKeys
  // Valid items should render above unselecatbles
  .sort(function (a) {
    if (!validItems) {
      return 0;
    }
    return validItems.has(a) ? 1 : -1;
  })
  // Focus location should render above all others
  .sort(function (a) {
    return a === state.focusLocation.current ? 1 : -1;
  }).flatMap(function (keyA) {
    if ([_SiteMapUtils.FEATURE_TYPES.LOCATIONS.KEY, _SiteMapUtils.FEATURE_TYPES.SAMPLING_POINTS.KEY].includes(featureType)) {
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