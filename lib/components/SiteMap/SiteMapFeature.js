"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _tinycolor = _interopRequireDefault(require("tinycolor2"));
var _reactCopyToClipboard = require("react-copy-to-clipboard");
var _styles = require("@mui/styles");
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _Grid = _interopRequireDefault(require("@mui/material/Grid"));
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _Link = _interopRequireDefault(require("@mui/material/Link"));
var _SnackbarContent = _interopRequireDefault(require("@mui/material/SnackbarContent"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _HelpOutline = _interopRequireDefault(require("@mui/icons-material/HelpOutline"));
var _TouchApp = _interopRequireDefault(require("@mui/icons-material/TouchApp"));
var _Terrain = _interopRequireDefault(require("@mui/icons-material/Terrain"));
var _InsertChartOutlined = _interopRequireDefault(require("@mui/icons-material/InsertChartOutlined"));
var _MyLocation = _interopRequireDefault(require("@mui/icons-material/MyLocation"));
var _Place = _interopRequireDefault(require("@mui/icons-material/Place"));
var _InfoOutlined = _interopRequireDefault(require("@mui/icons-material/InfoOutlined"));
var _NotInterested = _interopRequireDefault(require("@mui/icons-material/NotInterested"));
var _DoneOutline = _interopRequireDefault(require("@mui/icons-material/DoneOutline"));
var _Remove = _interopRequireDefault(require("@mui/icons-material/Remove"));
require("leaflet/dist/leaflet.css");
var _reactLeaflet = require("react-leaflet");
var _SiteMapContext = _interopRequireDefault(require("./SiteMapContext"));
var _SiteMapUtils = require("./SiteMapUtils");
var _Theme = _interopRequireWildcard(require("../Theme/Theme"));
var _typeUtil = require("../../util/typeUtil");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/* eslint-disable no-underscore-dangle, jsx-a11y/anchor-is-valid */

const useStyles = (0, _styles.makeStyles)(theme => ({
  selectionSnackbar: {
    width: '100%',
    color: '#000',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    boxShadow: 'none'
  },
  unselectableSnackbar: {
    backgroundColor: _Theme.COLORS.GREY[100],
    border: `1px solid ${_Theme.COLORS.GREY[600]}80`
  },
  addToSelectionSnackbar: {
    backgroundColor: _Theme.COLORS.GREEN[100],
    border: `1px solid ${_Theme.COLORS.GREEN[600]}80`
  },
  removeFromSelectionSnackbar: {
    backgroundColor: _Theme.COLORS.BROWN[100],
    border: `1px solid ${_Theme.COLORS.BROWN[600]}80`
  },
  selectedSelectionSnackbar: {
    backgroundColor: _Theme.COLORS.LIGHT_BLUE[100],
    border: `1px solid ${theme.palette.primary.main}80`
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
}));
const checkValidPositions = (positions, checkAllCoords = false) => {
  if (!Array.isArray(positions) || positions.length === 0) {
    return false;
  }
  if (!checkAllCoords) {
    return true;
  }
  // Identify case where we have a coordinate, and therefore cannot
  // have something in the positions array that is not an array
  const hasMultiplePositions = Array.isArray(positions[0]);
  if (hasMultiplePositions) {
    return positions.every(p => {
      if (!Array.isArray(p)) {
        return false;
      }
      return checkValidPositions(p, true);
    });
  }
  // Identified a non array element, ensure it is a valid coordinate
  return (0, _SiteMapUtils.isCoord)(positions);
};

/**
  Util: Position Popup
  Leaflet's AutoPan for popups does a "transition" of map center to ensure a new popup renders
  in view. This poses a problem when in selection mode and we want the mouseover evenr to trigger
  the popup instead of click. We get around this by solving the same root problem (want
  popups to render in view) in a different way... specifically by positioning them around their
  parent element dynamcally based on which direction has the most room to render.
*/
const positionPopup = (map, target = null, latlng = null, hideCloseButton = false, isOpening = false, isOverlay = false) => {
  if (!target || !latlng || !map) {
    return;
  }
  const {
    _popup: popup,
    _icon: icon
  } = target;
  if (!popup) {
    return;
  }
  // Render the changes in an animation frame to prevent jumping around
  window.requestAnimationFrame(() => {
    if (isOpening) {
      target.openPopup();
      if (popup._container) {
        popup._container.classList.add('leaflet-popup-selection-visually-hidden');
      }
    }
  });
  // Wrap rendering updates in a timeout to allow leaflet to finish
  // making changes to the popup elements and push to the UI
  // so they do not override or conflict with our positioning updates.
  window.setTimeout(() => {
    window.requestAnimationFrame(() => {
      if (!popup || !popup.isOpen()) {
        return;
      }
      const {
        _container: containerNode,
        _containerLeft: containerLeft,
        _containerBottom: containerBottom,
        _tipContainer: tipNode
      } = popup;
      popup.setLatLng(latlng);
      const containerPoint = map.latLngToContainerPoint(latlng);
      const iconHeight = icon ? icon.height : 0;
      containerNode.style.marginBottom = '0px';
      // Leaflet popups always open above; open below if mouse event is in the top half of the map
      if (containerPoint.y < map._container.clientHeight / 2) {
        const contentHeight = containerNode.clientHeight;
        const tipHeight = tipNode.clientHeight;
        const contentBottom = 0 - iconHeight - contentHeight - tipHeight - 1.5 * containerBottom;
        const tipBottom = contentHeight + tipHeight - 1;
        const nudgeBottom = isOverlay ? 10 : 0;
        containerNode.style.bottom = `${contentBottom - nudgeBottom}px`;
        tipNode.style.transform = `rotate(0.5turn) translate(0px, ${tipBottom}px)`;
      } else {
        const nudgeBottom = isOverlay ? 10 : 0;
        containerNode.style.bottom = `${-1.5 * containerBottom + nudgeBottom}px`;
        popup._tipContainer.style.transform = 'translate(0px, -1px)';
      }
      // For left/right we move the popup horizontally as needed while keeping the tip stationary
      const contentWidth = containerNode.clientWidth;
      const mapWidth = map._container.parentNode.clientWidth || 0;
      const nudgeBuffer = 40;
      const nudgeLimit = contentWidth / 2 - nudgeBuffer / 2;
      let overlap = 0;
      if (mapWidth > contentWidth + nudgeBuffer * 3) {
        let nudge = 0;
        if (containerPoint.x - contentWidth / 2 < 0) {
          overlap = containerPoint.x - contentWidth / 2;
          nudge = Math.min(0 - overlap + nudgeBuffer, nudgeLimit);
        } else if (containerPoint.x + contentWidth / 2 > mapWidth) {
          overlap = mapWidth - containerPoint.x - contentWidth / 2;
          nudge = Math.min(overlap - nudgeBuffer, nudgeLimit);
        }
        if (nudge !== 0) {
          containerNode.style.left = `${containerLeft + nudge}px`;
        }
        tipNode.style.left = `${0 - containerLeft - nudge}px`;
      }
      if (hideCloseButton) {
        popup._closeButton.style.display = 'none';
      }
      containerNode.classList.remove('leaflet-popup-selection-visually-hidden');
    });
  }, 200);
};
const SiteMapFeature = props => {
  const classes = useStyles(_Theme.default);
  const {
    featureKey
  } = props;
  const map = (0, _reactLeaflet.useMap)();
  const feature = _SiteMapUtils.FEATURES[featureKey] || {};
  const [state, dispatch] = _SiteMapContext.default.useSiteMapContext();
  const {
    name,
    nameSingular,
    type: featureType,
    description,
    style: featureStyle,
    featureShape,
    iconSvg,
    primaryIdOnly = false,
    amplifyHighlighted = false,
    parentDataFeatureKey
  } = feature;
  const featureName = nameSingular || name || featureKey;
  if (!_SiteMapUtils.FEATURES[featureKey]) {
    return null;
  }
  let featureDescription = description;
  let parentFeature = null;
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
  const {
    neonContextHydrated,
    manualLocationData,
    map: {
      bounds: mapBounds
    },
    focusLocation: {
      current: focusLocation
    },
    featureData: {
      [parentFeature ? parentFeature.type : featureType]: {
        [parentFeature ? parentFeature.KEY : featureKey]: featureData
      }
    }
  } = state;
  if (!neonContextHydrated || !featureData || !Object.keys(featureData)) {
    return null;
  }

  // Whether this feature can affect selection of items in the map
  const {
    active: selectableFeatureType,
    set: selectedItems,
    validSet: validItems,
    limit: selectionLimit,
    hideUnselectable
  } = state.selection;
  const selectionActive = !!state.selection.active;
  const selectionType = selectionActive ? state.selection.active : null;
  const selectingCurrentFeatureType = selectionType === featureType;

  // Whether interaction on this type means selection of another type (e.g. clicking a state or
  // domain to affect selection of sites in those regions; distinct from selection states or domains
  // directly).
  let selectingActiveTypeByProxy = false;
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
  const jumpTo = (locationCode = '') => {
    dispatch({
      type: 'setNewFocusLocation',
      location: locationCode
    });
  };
  const markerIcon = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Place.default, {
    className: classes.markerIcon
  });

  /**
     Render: Popup Title with Feature Icon
  */
  const renderPopupTitle = (title, withFeatureName = true) => {
    const renderedTitle = withFeatureName ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
      children: [featureName, /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {}), title]
    }) : title;
    let icon = null;
    if (iconSvg) {
      icon = /*#__PURE__*/(0, _jsxRuntime.jsx)("img", {
        alt: feature.name,
        src: feature.iconSvg,
        className: classes.popupFeatureIcon
      });
    } else if (featureShape === 'Circle') {
      const circleProps = {
        cx: 12,
        cy: 12,
        r: 8,
        style: {
          fill: featureStyle.color ? `${featureStyle.color}88` : 'none',
          stroke: featureStyle.color || null,
          strokeWidth: 3
        }
      };
      icon = /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
        width: "24",
        height: "24",
        className: classes.popupFeaturePolygon,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("circle", {
          ...circleProps
        })
      });
    } else if (featureStyle && ![_SiteMapUtils.FEATURES.DOMAINS.KEY, _SiteMapUtils.FEATURES.STATES.KEY].includes(featureKey)) {
      // We don't show the rect for states and domains since those cover the whole map when showing.
      const rectProps = {
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
      icon = /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
        width: "36",
        height: "36",
        className: classes.popupFeaturePolygon,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("rect", {
          ...rectProps
        })
      });
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.popupTitleContainer,
      "data-selenium": "sitemap-map-popup-title",
      children: [icon, /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "h6",
        style: {
          lineHeight: '1.4rem'
        },
        children: renderedTitle
      })]
    });
  };

  /**
     Render: a numerical value with units and optional label
  */
  const renderNumericalValue = (value, label = null, unit = '', precision = 0, aria = null, right = false, parens = false) => {
    // eslint-disable-line max-len
    let numberString = Number.isFinite(value) ? `${value.toFixed(precision)}${unit}` : '--';
    if (parens) {
      numberString = `(${numberString})`;
    }
    const visibleValue = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "caption",
      "aria-label": aria || label,
      style: {
        fontFamily: 'monospace'
      },
      children: numberString
    });
    return !label ? visibleValue : /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes[right ? 'endFlex' : 'startFlex'],
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "caption",
        style: {
          marginRight: _Theme.default.spacing(1)
        },
        children: label
      }), visibleValue]
    });
  };

  /**
     Render: Site with Icon
     Optionally ghost (fade) icon if selection is active but it's not selectable. If true and the
     site is not selectable this will also skip rendering altogether when hideUnselectable is true.
  */
  const renderSite = (siteCode, ghostUnselectable = false) => {
    const site = state.sites[siteCode];
    if (!site) {
      return null;
    }
    const siteFeatureKey = `${site.terrain}_${site.type}_SITES`;
    if (!_SiteMapUtils.FEATURES[siteFeatureKey]) {
      return null;
    }
    const isSelected = selectedItems.has(siteCode);
    const siteIcon = _SiteMapUtils.FEATURES[siteFeatureKey][isSelected ? 'iconSelectedSvg' : 'iconSvg'];
    let selectedIcon = null;
    const markerStyle = {};
    if (selectionActive && selectionType === _SiteMapUtils.FEATURE_TYPES.SITES.KEY) {
      if (validItems && !validItems.has(siteCode)) {
        // eslint-disable-next-line max-len
        selectedIcon = /*#__PURE__*/(0, _jsxRuntime.jsx)(_NotInterested.default, {
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
        selectedIcon = isSelected ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_DoneOutline.default, {
          className: classes.popupSiteSelectedIcon,
          color: "primary"
        }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Remove.default, {
          className: classes.popupSiteSelectedIcon,
          color: "disabled"
        });
      }
    }
    const internal = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: [selectedIcon, /*#__PURE__*/(0, _jsxRuntime.jsx)("img", {
        src: siteIcon,
        alt: siteCode,
        className: classes.popupSiteIcon,
        style: markerStyle
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "caption",
        style: {
          textAlign: 'left'
        },
        children: `${site.description} (${site.siteCode})`
      })]
    });
    const containerProps = {
      className: classes.popupSiteContainer,
      style: {
        marginTop: _Theme.default.spacing(0.5)
      }
    };
    return selectionActive ? /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      ...containerProps,
      children: internal
    }, siteCode) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Link.default, {
      variant: "caption",
      component: "button",
      onClick: () => jumpTo(site.siteCode),
      "data-selenium": "sitemap-map-popup-siteLink",
      ...containerProps,
      children: internal
    }, siteCode);
  };

  /**
     Render: Latitude / Longitude with Copy to Clipboard
  */
  const renderLatLon = (latitude, longitude, right = false, renderSubtitle = false) => {
    const iconButtonProps = {
      size: 'small',
      style: {
        marginRight: _Theme.default.spacing(0.5)
      }
    };
    const coords = Number.isFinite(latitude) && Number.isFinite(longitude) ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes[right ? 'endFlex' : 'startFlex'],
      "data-selenium": "sitemap-map-popup-coordinates",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactCopyToClipboard.CopyToClipboard, {
        text: `${latitude.toFixed(5)} ${longitude.toFixed(5)}`,
        children: selectionActive ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
          ...iconButtonProps,
          "aria-label": "Latitude / Longitude",
          disabled: selectionActive,
          size: "large",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_MyLocation.default, {})
        }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
          title: "Latitude / Longitude (click to copy)",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
            ...iconButtonProps,
            "aria-label": "Latitude / Longitude (click to copy)",
            disabled: selectionActive,
            size: "large",
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_MyLocation.default, {})
          })
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Typography.default, {
        variant: "caption",
        "aria-label": "Latitude / Longitude",
        style: {
          fontFamily: 'monospace',
          textAlign: 'right'
        },
        children: [latitude.toFixed(5), /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {}), longitude.toFixed(5)]
      })]
    }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "subtitle2",
        children: "Lat./Lon."
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "caption",
        "aria-label": "Latitude / Longitude",
        style: {
          fontFamily: 'monospace',
          textAlign: 'right'
        },
        children: "--"
      })]
    });
    return !renderSubtitle ? coords : /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      style: {
        textAlign: right ? 'right' : 'left'
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "subtitle2",
        children: "Coordinates"
      }), coords]
    });
  };

  /**
     Render: Elevation
  */
  const renderElevation = (loc = {}, right = false) => {
    const {
      elevation,
      minimumElevation,
      maximumElevation
    } = loc;
    const hasMinMax = Number.isFinite(minimumElevation) || Number.isFinite(maximumElevation);
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      style: {
        textAlign: right ? 'right' : 'left'
      },
      "data-selenium": "sitemap-map-popup-elevation",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "subtitle2",
        children: "Elevation"
      }), hasMinMax ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        children: [renderNumericalValue(elevation, 'Average', 'm', 2, 'Average Elevation', right), renderNumericalValue(minimumElevation, 'Minimum', 'm', 2, 'Minimum Elevation', right), renderNumericalValue(maximumElevation, 'Maximum', 'm', 2, 'Maximum Elevation', right)]
      }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: classes[right ? 'endFlex' : 'startFlex'],
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Terrain.default, {
          fontSize: "small",
          style: {
            marginRight: _Theme.default.spacing(1)
          }
        }), renderNumericalValue(elevation, null, 'm', 2, 'Elevation')]
      })]
    });
  };

  /**
     Render: Plot Size
  */
  const renderPlotSize = (loc = {}) => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    "data-selenium": "sitemap-map-popup-plotSize",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "subtitle2",
      children: "Plot Size"
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Typography.default, {
      variant: "caption",
      children: [loc.plotDimensions, !Number.isFinite(loc.plotSize) ? null : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("br", {}), `(${loc.plotSize.toFixed(0)}m\u00b2)`]
      })]
    })]
  });

  /**
     Render: Plot Slope
  */
  const renderPlotSlope = (loc = {}, right = false) => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    style: {
      textAlign: right ? 'right' : 'left'
    },
    "data-selenium": "sitemap-map-popup-plotSlope",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "subtitle2",
      children: "Plot Slope"
    }), renderNumericalValue(loc.slopeAspect, 'Aspect', '\u00b0', 2, 'Slope Aspect', right), renderNumericalValue(loc.slopeGradient, 'Gradient', '%', 2, 'Slope Gradient', right)]
  });

  /**
     Render: Plot Sampling Modules
  */
  const renderPlotSamplingModules = (loc = {}) => {
    const count = loc.samplingModules.length ? ` (${loc.samplingModules.length})` : '';
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
      item: true,
      xs: 12,
      "data-selenium": "sitemap-map-popup-samplingModules",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "subtitle2",
        children: `Potential Sampling Modules${count}`
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "caption",
        children: !loc.samplingModules.length ? /*#__PURE__*/(0, _jsxRuntime.jsx)("i", {
          children: "none"
        }) : loc.samplingModules.map(m => _SiteMapUtils.PLOT_SAMPLING_MODULES[m]).join(', ')
      })]
    }, "plotSamplingModules");
  };

  /**
     Render: Popup Row; Boundary Area
  */
  const renderBoundaryArea = (bound = {}) => {
    const {
      areaKm2
    } = bound.properties || {};
    const areaAcres = Number.isFinite(areaKm2) ? _SiteMapUtils.KM2_TO_ACRES * areaKm2 : null;
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
      item: true,
      xs: 12,
      "data-selenium": "sitemap-map-popup-area",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "subtitle2",
        children: "Area"
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: classes.startFlex,
        children: [renderNumericalValue(areaKm2, null, 'km\u00b2', 2, 'Area (km\u00b2)'), areaAcres === null ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          style: {
            marginLeft: _Theme.default.spacing(1)
          },
          children: renderNumericalValue(areaAcres, null, ' acres', 2, 'Area (acres)', false, true)
        })]
      })]
    });
  };

  /**
     Render Method: Popup Row; Child NEON Sites (e.g. within a domain or state)
  */
  const renderChildSites = boundaryKey => {
    const {
      sites = new Set()
    } = featureData[boundaryKey];
    let selectable = null;
    if (selectionActive && selectionType === _SiteMapUtils.FEATURE_TYPES.SITES.KEY) {
      const selectableSites = new Set([...sites].filter(siteCode => !validItems || validItems.has(siteCode)));
      if (!selectableSites.size) {
        selectable = ', none selectable';
      } else {
        selectable = selectableSites.size === sites.size ? ', all selectable' : ` total, ${selectableSites.size} selectable`;
      }
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
      item: true,
      xs: 12,
      "data-selenium": "sitemap-map-popup-childSites",
      style: {
        marginBottom: _Theme.default.spacing(2)
      },
      children: !sites.size ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "subtitle2",
          gutterBottom: true,
          children: "NEON Sites"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "caption",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("i", {
            children: "none"
          })
        })]
      }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "subtitle2",
          gutterBottom: true,
          children: `NEON Sites (${sites.size}${selectable || ''}):`
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          children: [...sites].map(siteCode => renderSite(siteCode, selectionType === _SiteMapUtils.FEATURE_TYPES.SITES.KEY))
        })]
      })
    }, "childSites");
  };

  /**
     Render: Popup Row; Coordinates and Elevation
  */
  const renderCoordsAndElevation = loc => {
    const renderCoordsSubtitle = Number.isFinite(loc.minimumElevation) || Number.isFinite(loc.maximumElevation);
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_react.default.Fragment, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
        item: true,
        xs: 6,
        children: renderElevation(loc)
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
        item: true,
        xs: 6,
        children: renderLatLon(loc.latitude, loc.longitude, true, renderCoordsSubtitle)
      })]
    }, "coordsAndElevation");
  };

  /**
     Render: Popup Row; Plot Size and Slope
  */
  const renderPlotSizeAndSlope = loc => /*#__PURE__*/(0, _jsxRuntime.jsxs)(_react.default.Fragment, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
      item: true,
      xs: 6,
      children: renderPlotSize(loc)
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
      item: true,
      xs: 6,
      children: renderPlotSlope(loc, true)
    })]
  }, "plotSizeAndSlope");

  /**
     Render: Popup Row; Tower Details
  */
  const renderTowerDetails = loc => /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
    item: true,
    xs: 12,
    "data-selenium": "sitemap-map-popup-towerDetails",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "subtitle2",
      children: "Levels"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "caption",
      children: (loc.children || []).length
    })]
  }, "towerDetails");

  /**
     Render: Popup Row; NLCD Classes (nationalLandCoverDatabase2001)
  */
  const renderNlcdClass = loc => {
    let nlcd = /*#__PURE__*/(0, _jsxRuntime.jsx)("i", {
      children: "n/a"
    });
    const titleStyle = {};
    if (loc.nlcdClass) {
      nlcd = loc.nlcdClass;
      if (_SiteMapUtils.NLCD_CLASSES[loc.nlcdClass]) {
        titleStyle.marginBottom = '-4px';
        const tooltip = `${_SiteMapUtils.NLCD_CLASSES[loc.nlcdClass].name} - ${_SiteMapUtils.NLCD_CLASSES[loc.nlcdClass].description}`;
        nlcd = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
          children: [_SiteMapUtils.NLCD_CLASSES[loc.nlcdClass].name, /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            className: classes.nlcdClass,
            title: _SiteMapUtils.NLCD_CLASSES[loc.nlcdClass].name,
            style: {
              backgroundColor: _SiteMapUtils.NLCD_CLASSES[loc.nlcdClass].color
            }
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
            title: tooltip,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
              size: "small",
              style: {
                marginLeft: _Theme.default.spacing(0.5),
                marginBottom: '1px'
              },
              "aria-label": "NLCD Class Description",
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_HelpOutline.default, {
                style: {
                  fontSize: '1rem'
                }
              })
            })
          })]
        });
      }
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
      item: true,
      xs: 12,
      "data-selenium": "sitemap-map-popup-nlcdClass",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "subtitle2",
        style: titleStyle,
        children: "NLCD Class"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "caption",
        children: nlcd
      })]
    }, "nlcdClass");
  };

  /**
     Render: Popup Row; Location Site and Domain
  */
  const renderLocationSiteAndDomain = siteCode => {
    const site = state.sites[siteCode];
    if (!site || !state.featureData.DOMAINS.DOMAINS[site.domainCode]) {
      return null;
    }
    const {
      name: domainName
    } = state.featureData.DOMAINS.DOMAINS[site.domainCode];
    const domainTitle = `${site.domainCode} - ${domainName}`;
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_react.default.Fragment, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
        item: true,
        xs: 7,
        "data-selenium": "sitemap-map-popup-site",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "subtitle2",
          children: "NEON Site"
        }), renderSite(siteCode)]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
        item: true,
        xs: 5,
        style: {
          textAlign: 'right'
        },
        "data-selenium": "sitemap-map-popup-domain",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "subtitle2",
          children: "Domain"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
          title: `Jump to ${site.domainCode} on the map`,
          children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Link.default, {
            variant: "caption",
            component: "button",
            style: {
              textAlign: 'right'
            },
            onClick: () => jumpTo(site.domainCode),
            "data-selenium": "sitemap-map-popup-domainLink",
            children: [markerIcon, domainTitle]
          })
        })]
      })]
    }, "locationSiteAndDomain");
  };
  const popupProps = {
    className: !selectionActive ? classes.popup : `${classes.popup} leaflet-popup-selection-visually-hidden`,
    autoPan: !selectionActive,
    id: 'sitemap-map-popup'
  };

  /**
     Render: Location popup
     Standard title with icon, row with coordinates and elevation, row with parent site and domain
     Optional additional rows will appear between coordinates/elevation and site/domain
  */
  const renderLocationPopup = (siteCode, location, additionalRows = []) => {
    const loc = (featureData[siteCode] || {})[location] || {};
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactLeaflet.Popup, {
      ...popupProps,
      children: [renderPopupTitle(location), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
        container: true,
        spacing: 1,
        children: [renderCoordsAndElevation(loc), additionalRows.map(row => typeof row === 'function' ? row(loc) : row), loc.nlcdClass ? renderNlcdClass(loc) : null, renderLocationSiteAndDomain(siteCode)]
      })]
    });
  };

  /**
     Render: Boundary popup
     Standard title with bound outline. Show area if present.
  */
  const renderBoundaryPopup = (key, title = null, additionalRows = []) => {
    const {
      properties = {}
    } = featureData[key] || {};
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactLeaflet.Popup, {
      ...popupProps,
      children: [renderPopupTitle(title || key, !title), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
        container: true,
        spacing: 1,
        children: [properties.areaKm2 ? renderBoundaryArea(featureData[key]) : null, Array.isArray(additionalRows) ? additionalRows.map(row => typeof row === 'function' ? row(key) : row) : null, renderLocationSiteAndDomain(key)]
      })]
    });
  };

  /**
     Render: Region Selection Action
  */
  const renderRegionSelectionAction = (boundaryFeatureKey, boundaryKey) => {
    if (!selectionActive || !state.selection.derived[boundaryFeatureKey] || selectionLimit === 1) {
      return null;
    }
    const isAreaSelect = state.map.mouseMode === _SiteMapUtils.MAP_MOUSE_MODES.AREA_SELECT;
    if (isAreaSelect) {
      return null;
    }
    const {
      sites: boundarySites = new Set()
    } = featureData[boundaryKey];
    if (!boundarySites.size) {
      return null;
    }
    const selectionPortion = state.selection.derived[boundaryFeatureKey][boundaryKey] || null;
    const selectableSites = !validItems ? boundarySites : new Set([...boundarySites].filter(siteCode => validItems.has(siteCode)));
    const selectableCount = selectableSites.size;
    const ActionIcon = selectableCount ? _TouchApp.default : _NotInterested.default;
    const selectable = boundarySites.size === selectableCount ? '' : ' selectable';
    const thisOne = boundarySites.size === selectableCount ? 'this one' : 'the one';
    let action = selectableCount === 1 ? `add ${thisOne}${selectable} site` : `add all ${selectableCount}${selectable} sites`;
    let preposition = 'to';
    /* eslint-disable max-len */
    let snackbarClass = classes[selectableCount ? 'addToSelectionSnackbar' : 'unselectableSnackbar'];
    let snackbarIconClass = classes[selectableCount ? 'addToSelectionSnackbarIcon' : 'unselectableSnackbarIcon'];
    /* eslint-enable max-len */
    let actionText = `No sites in this ${_SiteMapUtils.FEATURES[boundaryFeatureKey].nameSingular} are selectable`;
    if (selectableCount) {
      if (selectionPortion === _SiteMapUtils.SELECTION_PORTIONS.PARTIAL) {
        const intersection = new Set([...selectableSites].filter(x => selectedItems.has(x)));
        const remaining = selectableCount - intersection.size;
        action = `add remaining ${remaining}${selectable} site${remaining === 1 ? '' : 's'}`;
      }
      if (selectionPortion === _SiteMapUtils.SELECTION_PORTIONS.TOTAL) {
        action = selectableCount === 1 ? `remove ${thisOne}${selectable} site` : `remove all ${selectableCount}${selectable} sites`;
        preposition = 'from';
        snackbarClass = classes.removeFromSelectionSnackbar;
        snackbarIconClass = classes.removeFromSelectionSnackbarIcon;
      }
      actionText = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
        children: ["Click to ", /*#__PURE__*/(0, _jsxRuntime.jsx)("b", {
          children: action
        }), " ", preposition, " selection"]
      });
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.centerFlex,
      style: {
        padding: _Theme.default.spacing(0.5)
      },
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_SnackbarContent.default, {
        className: `${classes.selectionSnackbar} ${snackbarClass}`,
        message: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: classes.startFlex,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(ActionIcon, {
            className: `${classes.snackbarIcon} ${snackbarIconClass}`
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
              variant: "body2",
              children: actionText
            })
          })]
        })
      })
    }, boundaryKey);
  };

  /**
     Render: Item Selection Action Snackbar for a Popup
     (Only for selecting the item directly; selection by proxy action snackbars are different)
  */
  const renderItemSelectionActionSnackbar = item => {
    const isAreaSelect = state.map.mouseMode === _SiteMapUtils.MAP_MOUSE_MODES.AREA_SELECT;
    if (!selectionActive || isAreaSelect) {
      return null;
    }
    const unit = _SiteMapUtils.FEATURE_TYPES[selectionType].unit || 'item';
    const isSelectable = !validItems || validItems.has(item);
    const isSelected = selectedItems.has(item);
    const verb = isSelected ? 'remove' : 'add';
    const preposition = isSelected ? 'from' : 'to';
    let ActionIcon = _NotInterested.default;
    let action = `This ${unit} cannot be selected`;
    let snackbarClass = classes.unselectableSnackbar;
    let snackbarIconClass = classes.unselectableSnackbarIcon;
    if (isSelectable) {
      ActionIcon = _TouchApp.default;
      if (selectionLimit === 1) {
        ActionIcon = isSelected ? _DoneOutline.default : _TouchApp.default;
        action = isSelected ? /*#__PURE__*/(0, _jsxRuntime.jsx)("b", {
          children: "Selected"
        }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
          children: ["Click to ", /*#__PURE__*/(0, _jsxRuntime.jsx)("b", {
            children: "select"
          })]
        });
        snackbarClass = isSelected ? classes.selectedSelectionSnackbar : classes.addToSelectionSnackbar;
        snackbarIconClass = isSelected ? classes.selectedSelectionSnackbarIcon : classes.addToSelectionSnackbarIcon;
      } else {
        action = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
          children: ["Click to ", /*#__PURE__*/(0, _jsxRuntime.jsx)("b", {
            children: verb
          }), " ", preposition, " selection"]
        });
        snackbarClass = isSelected ? classes.removeFromSelectionSnackbar : classes.addToSelectionSnackbar;
        snackbarIconClass = isSelected ? classes.removeFromSelectionSnackbarIcon : classes.addToSelectionSnackbarIcon;
      }
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_SnackbarContent.default, {
      className: `${classes.selectionSnackbar} ${snackbarClass}`,
      message: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: classes.startFlex,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(ActionIcon, {
          className: `${classes.snackbarIcon} ${snackbarIconClass}`
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            variant: "body2",
            children: action
          })
        })]
      })
    }, "renderItemSelectionActionSnackbar");
  };

  /**
     Render: Site Popup
  */
  const renderSitePopup = siteCode => {
    const site = featureData[siteCode] || {};
    const {
      [site.stateCode]: usState = {}
    } = state.featureData[_SiteMapUtils.FEATURE_TYPES.STATES.KEY][_SiteMapUtils.FEATURES.STATES.KEY];
    const {
      [site.domainCode]: domain = {}
    } = state.featureData[_SiteMapUtils.FEATURE_TYPES.DOMAINS.KEY][_SiteMapUtils.FEATURES.DOMAINS.KEY];
    const stateFieldTitle = site.stateCode === 'PR' ? 'Territory' : 'State';
    const renderActions = () => {
      if (selectionActive) {
        return selectingCurrentFeatureType ? renderItemSelectionActionSnackbar(site.siteCode) : null;
      }
      const actionButtonProps = {
        className: classes.popupButton,
        variant: 'outlined',
        color: 'primary',
        target: '_blank',
        size: 'small'
      };
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: classes.popupButtonRow,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
          endIcon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_InfoOutlined.default, {}),
          href: (0, _SiteMapUtils.getHref)('SITE_DETAILS', site.siteCode),
          ...actionButtonProps,
          children: "Site Details"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
          endIcon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_InsertChartOutlined.default, {}),
          href: (0, _SiteMapUtils.getHref)('EXPLORE_DATA_PRODUCTS_BY_SITE', site.siteCode),
          ...actionButtonProps,
          children: "Explore Data"
        })]
      });
    };
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactLeaflet.Popup, {
      ...popupProps,
      children: [renderPopupTitle(`${site.description} (${site.siteCode})`, false), selectionActive ? null : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Link.default, {
        variant: "caption",
        component: "button",
        onClick: () => jumpTo(site.siteCode),
        style: {
          marginLeft: '-2px',
          marginBottom: '8px'
        },
        "data-selenium": "sitemap-map-popup-siteLink",
        children: [markerIcon, `Jump to ${site.siteCode} on the map`]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
        container: true,
        spacing: 1,
        style: {
          marginBottom: _Theme.default.spacing(1)
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
          item: true,
          xs: 8,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            variant: "subtitle2",
            children: feature.nameSingular
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            variant: "caption",
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)("i", {
              children: featureDescription
            })
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
          item: true,
          xs: 4,
          style: {
            textAlign: 'right'
          },
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            variant: "subtitle2",
            children: stateFieldTitle
          }), selectionActive ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            variant: "caption",
            children: usState.name
          }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
            title: `Jump to ${usState.name} on the map`,
            children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Link.default, {
              variant: "caption",
              component: "button",
              style: {
                textAlign: 'right'
              },
              onClick: () => jumpTo(site.stateCode),
              "data-selenium": "sitemap-map-popup-stateLink",
              children: [markerIcon, usState.name]
            })
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
          item: true,
          xs: 5,
          style: {
            display: 'flex',
            alignItems: 'flex-end'
          },
          children: renderLatLon(site.latitude, site.longitude)
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
          item: true,
          xs: 7,
          style: {
            textAlign: 'right'
          },
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            variant: "subtitle2",
            children: "Domain"
          }), selectionActive ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            variant: "caption",
            children: `${site.domainCode} - ${domain.name}`
          }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
            title: `Jump to ${site.domainCode} on the map`,
            children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Link.default, {
              variant: "caption",
              component: "button",
              style: {
                textAlign: 'right'
              },
              onClick: () => jumpTo(site.domainCode),
              "data-selenium": "sitemap-map-popup-domainLink",
              children: [markerIcon, `${site.domainCode} - ${domain.name}`]
            })
          })]
        })]
      }), renderActions()]
    });
  };

  /**
     Render: Decommissioned Site Popup
  */
  const renderDecommissionedSitePopup = siteCode => {
    const site = featureData[siteCode] || {};
    const {
      [site.state]: usState = {}
    } = state.featureData[_SiteMapUtils.FEATURE_TYPES.STATES.KEY][_SiteMapUtils.FEATURES.STATES.KEY];
    const {
      [site.domain]: domain = {}
    } = state.featureData[_SiteMapUtils.FEATURE_TYPES.DOMAINS.KEY][_SiteMapUtils.FEATURES.DOMAINS.KEY];
    const stateFieldTitle = site.stateCode === 'PR' ? 'Territory' : 'State';
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactLeaflet.Popup, {
      ...popupProps,
      children: [renderPopupTitle(`${site.siteName} (${site.siteCode})`, false), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Link.default, {
        variant: "caption",
        component: "button",
        onClick: () => jumpTo(site.siteCode),
        style: {
          marginLeft: '-2px',
          marginBottom: '8px'
        },
        "data-selenium": "sitemap-map-popup-siteLink",
        children: [markerIcon, `Jump to ${site.siteCode} on the map`]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
        container: true,
        spacing: 1,
        style: {
          marginBottom: _Theme.default.spacing(1)
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
          item: true,
          xs: 8,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            variant: "subtitle2",
            children: feature.nameSingular
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            variant: "caption",
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)("i", {
              children: featureDescription
            })
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
          item: true,
          xs: 4,
          style: {
            textAlign: 'right'
          },
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            variant: "subtitle2",
            children: stateFieldTitle
          }), selectionActive ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            variant: "caption",
            children: usState.name
          }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
            title: `Jump to ${usState.name} on the map`,
            children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Link.default, {
              variant: "caption",
              component: "button",
              style: {
                textAlign: 'right'
              },
              onClick: () => jumpTo(site.state),
              "data-selenium": "sitemap-map-popup-stateLink",
              children: [markerIcon, usState.name]
            })
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
          item: true,
          xs: 5,
          style: {
            display: 'flex',
            alignItems: 'flex-end'
          },
          children: renderLatLon(site.latitude, site.longitude)
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
          item: true,
          xs: 7,
          style: {
            textAlign: 'right'
          },
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            variant: "subtitle2",
            children: "Domain"
          }), selectionActive ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            variant: "caption",
            children: `${site.domain} - ${domain.name}`
          }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
            title: `Jump to ${site.domain} on the map`,
            children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Link.default, {
              variant: "caption",
              component: "button",
              style: {
                textAlign: 'right'
              },
              onClick: () => jumpTo(site.domain),
              "data-selenium": "sitemap-map-popup-domainLink",
              children: [markerIcon, `${site.domain} - ${domain.name}`]
            })
          })]
        })]
      })]
    });
  };

  /**
     Render - All the Rest of the Popups
     Convention is alphabetical listing of keys since order here doesn't matter
  */
  const renderLocationPopupWithPlotSizeAndSlope = (siteCode, location) => renderLocationPopup(siteCode, location, [renderPlotSizeAndSlope]);
  const renderPopupFunctions = {
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
    DISTRIBUTED_BASE_PLOTS: (siteCode, location) => renderLocationPopup(siteCode, location, [renderPlotSizeAndSlope, renderPlotSamplingModules]),
    DISTRIBUTED_BIRD_GRID_BOUNDARIES: renderLocationPopupWithPlotSizeAndSlope,
    DISTRIBUTED_BIRD_GRIDS: renderLocationPopupWithPlotSizeAndSlope,
    DISTRIBUTED_MAMMAL_GRID_BOUNDARIES: renderLocationPopupWithPlotSizeAndSlope,
    DISTRIBUTED_MAMMAL_GRIDS: renderLocationPopupWithPlotSizeAndSlope,
    DISTRIBUTED_MOSQUITO_POINTS: renderLocationPopupWithPlotSizeAndSlope,
    DISTRIBUTED_TICK_PLOT_BOUNDARIES: renderLocationPopupWithPlotSizeAndSlope,
    DISTRIBUTED_TICK_PLOTS: renderLocationPopupWithPlotSizeAndSlope,
    DOMAINS: domainCode => {
      const title = !featureData[domainCode] ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        children: `NEON Domain ${domainCode.replace('D', '')} - ${featureData[domainCode].name}`
      });
      const jumpLink = selectionActive ? null : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Link.default, {
        variant: "caption",
        component: "button",
        onClick: () => jumpTo(domainCode),
        style: {
          marginBottom: '8px'
        },
        "data-selenium": "sitemap-map-popup-domainLink",
        children: [markerIcon, `Jump to ${domainCode} on the map`]
      }, "jumpLink");
      return renderBoundaryPopup(domainCode, title, [jumpLink, renderChildSites, selectingCurrentFeatureType ? renderItemSelectionActionSnackbar(domainCode) : renderRegionSelectionAction(_SiteMapUtils.FEATURES.DOMAINS.KEY, domainCode)]);
    },
    FLIGHT_BOX_BOUNDARIES: renderBoundaryPopup,
    HUTS: renderLocationPopup,
    MEGAPITS: renderLocationPopup,
    // eslint-disable-next-line react/no-unstable-nested-components
    POUR_POINTS: siteCode => /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactLeaflet.Popup, {
      ...popupProps,
      children: [renderPopupTitle(`${siteCode} Watershed Pour Point`), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
        container: true,
        spacing: 1,
        children: renderLocationSiteAndDomain(siteCode)
      })]
    }),
    SAMPLING_BOUNDARIES: renderBoundaryPopup,
    STATES: stateCode => {
      const jumpLink = selectionActive ? null : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Link.default, {
        variant: "caption",
        component: "button",
        onClick: () => jumpTo(stateCode),
        style: {
          marginBottom: '8px'
        },
        "data-selenium": "sitemap-map-popup-stateLink",
        children: [markerIcon, `Jump to ${stateCode} on the map`]
      }, "jumpLink");
      return renderBoundaryPopup(stateCode, featureData[stateCode] ? featureData[stateCode].name : stateCode, [jumpLink, renderChildSites, selectingCurrentFeatureType ? renderItemSelectionActionSnackbar(stateCode) : renderRegionSelectionAction(_SiteMapUtils.FEATURES.DOMAINS.KEY, stateCode)]);
    },
    TERRESTRIAL_CORE_SITES: renderSitePopup,
    TERRESTRIAL_GRADIENT_SITES: renderSitePopup,
    TOWER_AIRSHEDS: renderBoundaryPopup,
    TOWER_BASE_PLOTS: (siteCode, location) => renderLocationPopup(siteCode, location, [renderPlotSizeAndSlope, renderPlotSamplingModules]),
    TOWER_PHENOLOGY_PLOT_BOUNDARIES: renderLocationPopupWithPlotSizeAndSlope,
    TOWER_PHENOLOGY_PLOTS: renderLocationPopupWithPlotSizeAndSlope,
    TOWER_SOIL_PLOTS: renderLocationPopup,
    TOWERS: (siteCode, location) => renderLocationPopup(siteCode, location, [renderTowerDetails]),
    WATERSHED_BOUNDARIES: renderBoundaryPopup
  };
  const hasPopup = typeof renderPopupFunctions[featureKey] === 'function';
  const renderPopup = (siteCode, location = null) => {
    if (!hasPopup || !featureData[siteCode] || location !== null && !featureData[siteCode][location]) {
      return null;
    }
    return renderPopupFunctions[featureKey](siteCode, location);
  };

  /**
     Render a single shape (marker, rectangle, or polygon)
  */
  const baseColor = featureStyle ? featureStyle.color : '#666666';
  const hoverColor = `#${(0, _tinycolor.default)(baseColor).lighten(10).toHex()}`;
  const ghostedBaseColor = `#${(0, _tinycolor.default)(baseColor).lighten(10).desaturate(60).toHex()}`;
  const ghostedHoverColor = `#${(0, _tinycolor.default)(hoverColor).lighten(10).desaturate(60).toHex()}`;
  const darkenedBaseColor = `#${(0, _tinycolor.default)(baseColor).darken(15).toHex()}`;
  const darkenedMoreBaseColor = `#${(0, _tinycolor.default)(darkenedBaseColor).darken(15).toHex()}`;
  const isPoint = shapeData => {
    const shapeKeys = Object.keys(shapeData);
    return shapeKeys.includes('geometry') && Object.keys(shapeData.geometry).includes('coordinates') && Array.isArray(shapeData.geometry.coordinates) && shapeData.geometry.coordinates.length === 2 && shapeData.geometry.coordinates.every(x => Number.isFinite(x)) || shapeKeys.includes('latitude') && shapeKeys.includes('longitude');
  };
  const renderShape = (primaryId, secondaryId = null) => {
    const polygonInteractionProps = {
      eventHandlers: {
        mouseover: e => {
          e.target._path.setAttribute('stroke', hoverColor);
          e.target._path.setAttribute('fill', hoverColor);
        },
        mouseout: e => {
          e.target._path.setAttribute('stroke', featureStyle.color);
          e.target._path.setAttribute('fill', featureStyle.color);
        }
      }
    };
    const shapeData = secondaryId && featureData[primaryId][secondaryId] ? featureData[primaryId][secondaryId] : featureData[primaryId];
    let isSelectable = null;
    let isSelected = false;
    if (selectionActive) {
      isSelectable = !validItems || (secondaryId ? validItems.has(secondaryId) : validItems.has(primaryId));
      isSelected = secondaryId ? selectedItems.has(secondaryId) : selectedItems.has(primaryId);
      if (featureType === selectableFeatureType && hideUnselectable && !isSelectable) {
        return null;
      }
    }
    const isHighlighted = primaryIdOnly && !secondaryId && primaryId === focusLocation || !primaryIdOnly && secondaryId && secondaryId === focusLocation;
    const key = secondaryId ? `${primaryId} - ${secondaryId}` : primaryId;
    const renderedPopup = renderPopup(primaryId, secondaryId);
    const shapeKeys = Object.keys(shapeData);
    let position = [];
    let positions = [];
    let icon = null;
    let marker = null;
    let interaction = {};
    let shapeProps = {};
    if (shapeData.geometry && shapeData.geometry.coordinates) {
      if (checkValidPositions(shapeData.geometry.coordinates, true)) {
        positions = shapeData.geometry.coordinates;
      }
      // Polyline
      if (featureShape === 'Polyline') {
        shapeProps = {
          ...(featureStyle || {}),
          eventHandlers: {
            mouseover: e => {
              e.target._path.setAttribute('stroke', hoverColor);
            },
            mouseout: e => {
              e.target._path.setAttribute('stroke', baseColor);
            }
          }
        };
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
        shapeProps = {
          ...(featureStyle || {}),
          eventHandlers: {
            ...polygonInteractionProps.eventHandlers
          }
        };
        // ReactLeaflet does not suport the mask prop, so add it as an unused class.
        // The LayoutEffect in SiteMapLeaflet.jsx then applies it as a mask attribute.
        if ([_SiteMapUtils.FEATURES.DOMAINS.KEY, _SiteMapUtils.FEATURES.STATES.KEY].includes(featureKey)) {
          shapeProps.className = `#mask_${featureKey}_${primaryId}`;
        }
        if (isHighlighted) {
          shapeProps.color = darkenedBaseColor;
          shapeProps.eventHandlers.mouseout = e => {
            e.target._path.setAttribute('stroke', darkenedBaseColor);
            e.target._path.setAttribute('fill', darkenedBaseColor);
          };
        } else if ((0, _typeUtil.exists)(focusLocation) && amplifyHighlighted) {
          // Determine if the feature type of the focus location
          // is set to amplify highlighted for this feature type (eg, same type)
          const amplifyFeatureKeys = Object.keys(_SiteMapUtils.FEATURES).filter(k => _SiteMapUtils.FEATURES[k].amplifyHighlighted && _SiteMapUtils.FEATURES[k].matchLocationType);
          const isFocusAmplifiable = amplifyFeatureKeys.find(amplifyFeatureKey => {
            if ((0, _typeUtil.exists)(state.focusLocation) && (0, _typeUtil.exists)(state.focusLocation.data) && (0, _typeUtil.exists)(state.focusLocation.data.type)) {
              return new RegExp(_SiteMapUtils.FEATURES[amplifyFeatureKey].matchLocationType).test(state.focusLocation.data.type);
            }
            return false;
          });
          if (isFocusAmplifiable) {
            shapeProps.color = ghostedHoverColor;
            shapeProps.eventHandlers.mouseout = e => {
              e.target._path.setAttribute('stroke', ghostedHoverColor);
              e.target._path.setAttribute('fill', ghostedHoverColor);
            };
          }
        }
        if (selectionActive) {
          const isAreaSelect = state.map.mouseMode === _SiteMapUtils.MAP_MOUSE_MODES.AREA_SELECT;
          let returnColor = isHighlighted ? darkenedBaseColor : featureStyle.color;
          let useHoverColor = hoverColor;
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
            const baseColors = {
              [_SiteMapUtils.SELECTION_PORTIONS.PARTIAL]: darkenedBaseColor,
              [_SiteMapUtils.SELECTION_PORTIONS.TOTAL]: darkenedMoreBaseColor
            };
            if (state.selection.derived[featureKey] && state.selection.derived[featureKey][primaryId]) {
              // eslint-disable-next-line max-len
              returnColor = baseColors[state.selection.derived[featureKey][primaryId]] || featureStyle.color;
            }
          }
          shapeProps.color = returnColor;
          shapeProps.eventHandlers.mouseover = e => {
            e.target._path.setAttribute('stroke', useHoverColor);
            e.target._path.setAttribute('fill', useHoverColor);
            if (hasPopup) {
              positionPopup(map, e.target, e.latlng, true, true, true);
            }
          };
          shapeProps.eventHandlers.mousemove = e => {
            if (hasPopup) {
              positionPopup(map, e.target, e.latlng, true, false, true);
            }
          };
          shapeProps.eventHandlers.mouseout = e => {
            e.target._path.setAttribute('stroke', returnColor);
            e.target._path.setAttribute('fill', returnColor);
            if (hasPopup) {
              e.target.closePopup();
            }
          };
          // Onclick to select sites by way of clicking a state or domain to capture sites within
          if (!isAreaSelect && selectingActiveTypeByProxy && selectionLimit !== 1) {
            shapeProps.eventHandlers.click = () => {
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
          if (!isAreaSelect && selectionType === featureType) {
            shapeProps.eventHandlers.click = () => {
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
      position = ['latitude', 'longitude'].every(k => shapeKeys.includes(k)) ? [shapeData.latitude, shapeData.longitude] : shapeData.geometry.coordinates;
      if (!checkValidPositions(position, true)) {
        position = [];
      }
      if (state.map.zoomedIcons[featureKey] !== null) {
        const baseIcon = state.map.zoomedIcons[featureKey];
        const selection = isSelectable && isSelected && (0, _typeUtil.exists)(baseIcon) && (0, _typeUtil.exists)(baseIcon[_SiteMapUtils.SELECTION_STATUS.SELECTED]) ? _SiteMapUtils.SELECTION_STATUS.SELECTED : _SiteMapUtils.SELECTION_STATUS.UNSELECTED;
        const initialHighlight = isHighlighted ? _SiteMapUtils.HIGHLIGHT_STATUS.HIGHLIGHT : _SiteMapUtils.HIGHLIGHT_STATUS.NONE;
        const isAreaSelect = state.map.mouseMode === _SiteMapUtils.MAP_MOUSE_MODES.AREA_SELECT;
        if (baseIcon && baseIcon[selection]) {
          icon = baseIcon[selection][initialHighlight];
          interaction = {
            eventHandlers: {
              mouseover: e => {
                let highlight = _SiteMapUtils.HIGHLIGHT_STATUS.HIGHLIGHT;
                if (selectionActive && selectingCurrentFeatureType && isSelectable) {
                  highlight = _SiteMapUtils.HIGHLIGHT_STATUS[isSelected ? 'HIGHLIGHT' : 'SELECT'];
                }
                e.target.setIcon(baseIcon[selection][highlight]);
                e.target._bringToFront();
                if (hasPopup && selectionActive) {
                  positionPopup(map, e.target, e.latlng, selectionActive, true);
                }
              },
              mouseout: e => {
                e.target.setIcon(baseIcon[selection][initialHighlight]);
                if (hasPopup && selectionActive) {
                  e.target.closePopup();
                }
              },
              click: e => {
                if (!isAreaSelect) {
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
              }
            }
          };
        }
      }
      if ((0, _typeUtil.exists)(icon)) {
        marker = /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactLeaflet.Marker, {
          position: position,
          title: key,
          icon: icon,
          ...interaction,
          children: renderedPopup
        }, `${key}-marker`);
      }
    }
    switch (featureShape) {
      case 'Marker':
        return marker;
      case 'Circle':
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactLeaflet.CircleMarker, {
          title: key,
          center: position,
          radius: Math.max(state.map.zoom - 10, 3),
          ...featureStyle,
          ...polygonInteractionProps,
          children: renderedPopup
        }, `${key}-circlemarker`);
      case 'Polygon':
        // Only render polygon popups when not in area selection mode. Otherwise area selection
        // could neither start, move, nor end over feature shapes.
        if (!checkValidPositions(positions, featureType === _SiteMapUtils.FEATURE_TYPES.SAMPLING_POINTS.KEY)) {
          return null;
        }
        return state.map.mouseMode === _SiteMapUtils.MAP_MOUSE_MODES.AREA_SELECT ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactLeaflet.Polygon, {
          positions: positions,
          ...shapeProps
        }, `${key}-polygon`) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactLeaflet.Polygon, {
          positions: positions,
          ...shapeProps,
          children: renderedPopup
        }, `${key}-polygon`);
      case 'Polyline':
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactLeaflet.Polyline, {
          positions: positions,
          ...shapeProps,
          children: renderedPopup
        }, `${key}-polyline`);
      default:
        return null;
    }
  };

  /**
     Main Render
  */
  let renderableKeys = Object.keys(featureData);
  if (Array.isArray(manualLocationData) && manualLocationData.length) {
    const hasPrototypeSites = manualLocationData.some(ml => ml.manualLocationType === _SiteMapUtils.MANUAL_LOCATION_TYPES.PROTOTYPE_SITE);
    if (hasPrototypeSites && featureType === _SiteMapUtils.FEATURE_TYPES.SITES.KEY) {
      const allKeys = Object.keys(featureData);
      renderableKeys = manualLocationData.filter(ml => ml.manualLocationType === _SiteMapUtils.MANUAL_LOCATION_TYPES.PROTOTYPE_SITE && allKeys.includes(ml.siteCode)).map(ml => ml.siteCode);
    }
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactLeaflet.FeatureGroup, {
    children: renderableKeys
    // Valid items should render above unselecatbles
    .sort(a => {
      if (!validItems) {
        return 0;
      }
      return validItems.has(a) ? 1 : -1;
    })
    // Focus location should render above all others
    .sort(a => a === state.focusLocation.current ? 1 : -1).flatMap(keyA => {
      if ([_SiteMapUtils.FEATURE_TYPES.LOCATIONS.KEY, _SiteMapUtils.FEATURE_TYPES.SAMPLING_POINTS.KEY].includes(featureType)) {
        return Object.keys(featureData[keyA]).map(keyB => renderShape(keyA, keyB));
      }
      return renderShape(keyA);
    })
  });
};
SiteMapFeature.propTypes = {
  featureKey: _propTypes.default.oneOf(Object.keys(_SiteMapUtils.FEATURES)).isRequired
};
var _default = exports.default = SiteMapFeature;