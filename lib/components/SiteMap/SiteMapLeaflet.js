"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _server = _interopRequireDefault(require("react-dom/server"));
var _reactIdGenerator = require("react-id-generator");
var _leaflet = _interopRequireDefault(require("leaflet"));
var _styles = require("@material-ui/core/styles");
var _Box = _interopRequireDefault(require("@material-ui/core/Box"));
var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));
var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));
var _ToggleButton = _interopRequireDefault(require("@material-ui/lab/ToggleButton"));
var _ToggleButtonGroup = _interopRequireDefault(require("@material-ui/lab/ToggleButtonGroup"));
var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _PanTool = _interopRequireDefault(require("@material-ui/icons/PanTool"));
var _CropFree = _interopRequireDefault(require("@material-ui/icons/CropFree"));
var _Public = _interopRequireDefault(require("@material-ui/icons/Public"));
var _Place = _interopRequireDefault(require("@material-ui/icons/Place"));
require("leaflet/dist/leaflet.css");
require("./SiteMap.css");
var _reactLeaflet = require("react-leaflet");
var _reactLeafletGroupedLayerControl = require("react-leaflet-grouped-layer-control");
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _SiteMapContext = _interopRequireDefault(require("./SiteMapContext"));
var _SiteMapFeature = _interopRequireDefault(require("./SiteMapFeature"));
var _SiteMapUtils = require("./SiteMapUtils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } /* eslint-disable no-underscore-dangle */
const useStyles = (0, _styles.makeStyles)(theme => ({
  map: {
    width: '100%',
    height: '0px',
    // Necessary to set a fixed aspect ratio from props (using paddingBottom)
    overflow: 'hidden',
    background: theme.palette.grey[50],
    '& div.rlglc-wrap': {
      boxShadow: 'unset',
      margin: '0px',
      left: '8px',
      top: '8px',
      '& .rlglc': {
        border: "1px solid ".concat(_Theme.default.colors.LIGHT_BLUE[500]),
        borderRadius: '2px'
      },
      '& .rlglc-active': {
        border: "1px solid ".concat(_Theme.default.palette.grey[300])
      },
      '& .rlglc:not(.rlglc-active) .rlglc-a': {
        width: '36px',
        height: '36px !important'
      },
      '& .rlglc.rlglc-active .rlglc-a': {
        width: 'auto !important',
        height: 'auto !important',
        padding: '12px'
      },
      '& .rlglc-open': {
        '& .rlglc-input': {
          width: '14px',
          height: '14px',
          margin: '3px 0px 0px 0px',
          cursor: 'pointer'
        },
        '& .rlglc-title': {
          fontFamily: '"Inter",Helvetica,Arial,sans-serif'
        },
        '& .rlglc-groupTitle': {
          fontFamily: '"Inter",Helvetica,Arial,sans-serif',
          fontSize: '13px'
        }
      }
    },
    '& div.leaflet-control-zoom': {
      border: 'none'
    },
    '& div.leaflet-top.leaflet-right': {
      right: 'unset !important',
      left: '0px'
    },
    '& div.leaflet-bar': {
      top: '54px',
      left: '8px',
      margin: '0px',
      borderRadius: '2px',
      boxShadow: 'unset',
      '& a': {
        color: _Theme.default.colors.LIGHT_BLUE[500],
        border: "1px solid ".concat(_Theme.default.colors.LIGHT_BLUE[500]),
        width: '26px',
        height: '26px',
        lineHeight: '26px',
        fontSize: '18px',
        '&:hover, &:active': {
          color: _Theme.default.colors.LIGHT_BLUE[400],
          borderColor: _Theme.default.colors.LIGHT_BLUE[400]
        },
        '&:first-child': {
          borderTopLeftRadius: '2px',
          borderTopRightRadius: '2px'
        },
        '&:last-child': {
          borderTop: 'none',
          borderBottomLeftRadius: '2px',
          borderBottomRightRadius: '2px'
        }
      }
    },
    '& div.leaflet-control-attribution': {
      borderTopLeftRadius: '2px',
      marginRight: '26px',
      height: '26px',
      padding: '4px 8px'
    },
    '& div.leaflet-control-attribution a': {
      color: theme.palette.primary.main
    },
    '& .leaflet-container a': {
      color: theme.palette.primary.main
    },
    '& input[type="radio"]': {
      cursor: 'pointer'
    }
  },
  mapNoMarkerPointerEvents: {
    '& div.leaflet-marker-pane *': {
      pointerEvents: 'none'
    }
  },
  mapFullscreen: {
    '& div.leaflet-control-attribution': {
      marginRight: '0px'
    }
  },
  attribution: {
    color: theme.palette.secondary.main,
    fontSize: '11.5px',
    cursor: 'help',
    display: 'inline'
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
  progress: {
    zIndex: 900,
    position: 'absolute',
    top: '12px',
    left: '56px'
  },
  mapNavButtonContainer: {
    position: 'absolute',
    zIndex: 999,
    margin: '0px',
    left: '8px'
  },
  mapNavButton: {
    backgroundColor: '#fff !important',
    width: '26px',
    height: '26px',
    padding: 'unset',
    borderRadius: '2px 0px 2px 0px',
    border: "1px solid ".concat(_Theme.default.colors.LIGHT_BLUE[500]),
    '&:hover, &:active': {
      color: _Theme.default.colors.LIGHT_BLUE[400],
      borderColor: _Theme.default.colors.LIGHT_BLUE[400],
      backgroundColor: theme.palette.grey[50]
    },
    '& svg': {
      fontSize: '1.15rem !important'
    }
  },
  observatoryButton: {
    top: '114px'
  },
  focusLocationButton: {
    top: '148px'
  },
  mouseModeToggleButtonGroup: {
    borderRadius: '2px',
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 999,
    margin: '0px',
    top: '8px',
    left: '56px',
    '& button': {
      width: '26px',
      height: '26px',
      padding: 'unset !important',
      '& svg': {
        fontSize: '0.9rem'
      }
    }
  },
  areaSelection: {
    position: 'absolute',
    pointerEvents: 'none',
    border: "3px dotted ".concat(_Theme.default.colors.LIGHT_BLUE[500]),
    backgroundColor: _Theme.default.colors.LIGHT_BLUE[100],
    opacity: 0.6,
    zIndex: 999
  }
}));

/**
   Main Component
*/
const SiteMapLeaflet = () => {
  const classes = useStyles(_Theme.default);
  const mapRef = (0, _react.useRef)(null);
  const [mapInstanceId] = (0, _reactIdGenerator.useId)();
  const mapRefExists = () => mapRef && mapRef.current && mapRef.current.container && mapRef.current.leafletElement && mapRef.current.leafletElement._panes && mapRef.current.leafletElement._layers;

  // State, Dispatch, and other stuff from SiteMapContext
  const [state, dispatch] = _SiteMapContext.default.useSiteMapContext();
  let canRender = state.neonContextHydrated;
  if (state.focusLocation.current && state.focusLocation.fetch.status !== _SiteMapUtils.FETCH_STATUS.SUCCESS) {
    canRender = false;
  }
  const [mapRefReady, setMapRefReady] = (0, _react.useState)(false);

  /**
     Effect
     If zoom was not set as a prop then attempt to set the initial zoom such that
     all sites are visible. This depends on the client dimensions of the map
     and whether height or width is the deciding factor depends on the aspect ratio.
  */
  (0, _react.useEffect)(() => {
    if (!canRender || state.map.zoom !== null || !mapRefExists()) {
      return;
    }
    dispatch({
      type: 'setMapZoom',
      zoom: (0, _SiteMapUtils.deriveFullObservatoryZoomLevel)(mapRef)
    });
  }, [canRender, state.map.zoom, mapRef, dispatch]);

  /**
    Effect
    If map bounds are null (as they will be when setting a focus location) then fill them in
    We have to do it this way as only the Leaflet Map instance can give us bounds
     Effect for setting the initial zoom so that we can include the bounds
    of the map in the initial zoom setting to allow proper feature detection.
  */
  const mapRefExistsProp = mapRefExists();
  (0, _react.useEffect)(() => {
    if (state.map.bounds !== null || !mapRefExistsProp) {
      return;
    }
    const bounds = mapRef.current.leafletElement.getBounds();
    if (state.map.zoom === null) {
      dispatch({
        type: 'setMapBounds',
        bounds: {
          lat: [bounds._southWest.lat, bounds._northEast.lat],
          lng: [bounds._southWest.lng, bounds._northEast.lng]
        }
      });
    } else {
      dispatch({
        type: 'setMapZoom',
        zoom: state.map.zoom,
        bounds: {
          lat: [bounds._southWest.lat, bounds._northEast.lat],
          lng: [bounds._southWest.lng, bounds._northEast.lng]
        }
      });
    }
  }, [mapRefExistsProp, state.map.bounds, state.map.zoom, dispatch]);

  /**
    Effect
    Visually distinguish unselectable markers in the marker pane while also changing the draw order
    of marker icons to put unselectable ones behind selectable ones. Use a 0-length setTimeout to
    allow the map to complete one render cycle first. We must do this here, instead of in
    SiteMapFeature.jsx where we render the markers, because React-Leaflet does not currently support
    setting arbitrary styles on markers. =(
  */
  (0, _react.useLayoutEffect)(() => {
    const timeout = window.setTimeout(() => {
      if (!mapRefExists() || state.view.current !== _SiteMapUtils.VIEWS.MAP || !state.selection.active || !state.selection.validSet || state.selection.active !== _SiteMapUtils.FEATURE_TYPES.SITES.KEY) {
        return;
      }
      const {
        markerPane
      } = mapRef.current.leafletElement._panes;
      if (markerPane && markerPane.children && markerPane.children.length) {
        // Unselectables: apply CSS filters to appear ghosted
        [...markerPane.children].filter(marker => !state.selection.validSet.has(marker.title)).forEach(marker => {
          // eslint-disable-next-line no-param-reassign
          marker.style.filter = _SiteMapUtils.UNSELECTABLE_MARKER_FILTER;
        });
        // Selecatbles: Uniformly bump the zIndexOffset to put them all on top
        state.selection.validSet.forEach(item => {
          const layerIdx = Object.keys(mapRef.current.leafletElement._layers).find(k => mapRef.current.leafletElement._layers[k].options && mapRef.current.leafletElement._layers[k].options.title === item);
          if (layerIdx !== -1 && mapRef.current.leafletElement._layers[layerIdx]) {
            const zIndex = (mapRef.current.leafletElement._layers[layerIdx] || {})._zIndex || 0;
            mapRef.current.leafletElement._layers[layerIdx].setZIndexOffset(zIndex + 1000);
          }
        });
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [state.selection.active, state.selection.validSet, state.selection.hideUnselectable, state.map.bounds, state.view]);

  /**
     Callback
     Call map.invalidateSize to fix any tiling errors. We call this when the map is first ready
     to get around race conditions with leaflet initialization and loading the sitemap in dynamic
     containers like dialogs.
  */
  const invalidateSize = (0, _react.useCallback)(() => {
    if (!mapRefExists()) {
      return;
    }
    // setTimeout of 0 to fire after map render cycle completes
    window.setTimeout(() => {
      if (!mapRefExists()) {
        return;
      }
      mapRef.current.leafletElement.invalidateSize();
    }, 0);
  }, []);

  /**
    Effect
    Force a redraw when switching to the map for the first time from another view or when component
    dimensions (e.g. aspectRatio or widthReference) has changed
  */
  (0, _react.useEffect)(() => {
    if (!mapRefExists() || state.view.current !== _SiteMapUtils.VIEWS.MAP) {
      return;
    }
    mapRef.current.leafletElement.invalidateSize();
    if (!state.view.initialized[_SiteMapUtils.VIEWS.MAP]) {
      dispatch({
        type: 'setViewInitialized'
      });
    }
  }, [dispatch, state.view, state.aspectRatio.currentValue, state.aspectRatio.widthReference]);

  /**
     Area Selection - Local State & Reducer
     NOTE: this is not kept in primary state because it's used only when actively selecting and
     updated frequently during mouse drag. The cycle through the main reducer is too laggy.
  */
  const areaSelectionDefaultState = {
    isDragging: false,
    shiftPressed: false,
    center: {
      x: null,
      y: null
    },
    reach: {
      x: null,
      y: null
    }
  };
  const areaSelectionReducer = (areaSelectionState, action) => {
    const {
      isDragging
    } = areaSelectionState;
    const newState = _extends({}, areaSelectionState);
    switch (action.type) {
      case 'start':
        if (isDragging || !Number.isInteger(action.x) || !Number.isInteger(action.y)) {
          return areaSelectionState;
        }
        newState.isDragging = true;
        newState.center = {
          x: action.x,
          y: action.y
        };
        newState.reach = {
          x: action.x,
          y: action.y
        };
        return newState;
      case 'move':
        if (!isDragging || !Number.isInteger(action.x) || !Number.isInteger(action.y)) {
          return areaSelectionState;
        }
        newState.reach = {
          x: action.x,
          y: action.y
        };
        return newState;
      case 'end':
        if (!isDragging || !Number.isInteger(action.x) || !Number.isInteger(action.y)) {
          return areaSelectionState;
        }
        newState.isDragging = false;
        newState.center = {
          x: null,
          y: null
        };
        newState.reach = {
          x: null,
          y: null
        };
        return newState;
      case 'shift':
        newState.shiftPressed = !!action.pressed;
        return newState;
      default:
        return areaSelectionState;
    }
  };
  const [areaSelection, areaSelectionDispatch] = (0, _react.useReducer)(areaSelectionReducer, areaSelectionDefaultState);

  /**
     Local State / Effect - Whether GroupedLayerControl has been rendered
     <ReactLeafletGroupedLayerControl> is a child of <Map>, but it also must take the ref to the map
     as a prop. Thus we must track whether it has rendered with local state. We want to basically
     re-render the map immediately and only once when the mepRef is set through the first render.
  */
  (0, _react.useEffect)(() => {
    // eslint-disable-line react-hooks/exhaustive-deps
    if (mapRefExists() && !mapRefReady) {
      setMapRefReady(true);
      mapRef.current.leafletElement.invalidateSize();
    }
  });

  /**
     Effect
     Area Selection - event listeners to handle area selection mouse events
  */
  (0, _react.useEffect)(() => {
    if (!mapRef || !mapRef.current || !mapRef.current.container || !mapRef.current.leafletElement || state.map.mouseMode !== _SiteMapUtils.MAP_MOUSE_MODES.AREA_SELECT) {
      return () => {};
    }
    const {
      leafletElement
    } = mapRef.current;
    const {
      isDragging,
      center,
      shiftPressed
    } = areaSelection;
    mapRef.current.container.onmousedown = event => {
      if (isDragging) {
        return;
      }
      areaSelectionDispatch({
        type: 'start',
        x: event.offsetX,
        y: event.offsetY
      });
    };
    mapRef.current.container.onmousemove = event => {
      if (!isDragging) {
        return;
      }
      areaSelectionDispatch({
        type: 'move',
        x: event.offsetX,
        y: event.offsetY
      });
    };
    mapRef.current.container.onmouseup = event => {
      if (!isDragging) {
        return;
      }
      const reach = {
        x: event.offsetX,
        y: event.offsetY
      };
      const centerLatLng = leafletElement.containerPointToLatLng(_leaflet.default.point(center.x, center.y));
      const reachLatLng = leafletElement.containerPointToLatLng(_leaflet.default.point(reach.x, reach.y));
      const selectionBounds = {
        lat: [Math.min(centerLatLng.lat, reachLatLng.lat), Math.max(centerLatLng.lat, reachLatLng.lat)],
        lng: [Math.min(centerLatLng.lng, reachLatLng.lng), Math.max(centerLatLng.lng, reachLatLng.lng)]
      };
      let selectableData = {};
      if (state.selection.active === _SiteMapUtils.FEATURE_TYPES.SITES.KEY) {
        selectableData = state.sites;
      }
      if ([_SiteMapUtils.FEATURE_TYPES.STATES.KEY, _SiteMapUtils.FEATURE_TYPES.DOMAINS.KEY].includes(state.selection.active)) {
        const selectableFeatureKey = Object.keys(_SiteMapUtils.FEATURES).find(k => _SiteMapUtils.FEATURES[k].type === state.selection.active);
        if (selectableFeatureKey) {
          selectableData = state.featureData[state.selection.active][selectableFeatureKey];
        }
      }
      const newSelectionSet = (0, _SiteMapUtils.calculateLocationsInBounds)(selectableData, selectionBounds);
      const finalSelectionSet = new Set([...newSelectionSet, ...(shiftPressed ? Array.from(state.selection.set) : [])]);
      areaSelectionDispatch({
        type: 'end',
        x: event.offsetX,
        y: event.offsetY
      });
      dispatch({
        type: 'updateSelectionSet',
        selection: finalSelectionSet
      });
    };
    const handleKeyDown = event => {
      if (event.key === 'Shift') {
        areaSelectionDispatch({
          type: 'shift',
          pressed: true
        });
      }
    };
    const handleKeyUp = event => {
      if (event.key === 'Shift') {
        areaSelectionDispatch({
          type: 'shift',
          pressed: false
        });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  });

  /**
    Effect
    Create masks for DOMAINS and/or STATES.
    These features intentionally have extra-wide strokes. When combined with a mask it creates
    the effect of stroke "only on the inside" so that strokes of adjacent domains/states never
    overlap along shared borders. This is especially useful for visual differentiation of different
    selection statuses for adjacent states/domains.
  */
  (0, _react.useLayoutEffect)(() => {
    // setTimeout of 0 to fire after map render cycle completes
    window.setTimeout(() => {
      // Only continue if the map is in a ready / fully rendered state.
      if (!mapRef || !mapRef.current || !mapRef.current.leafletElement || !mapRef.current._ready || mapRef.current._updating || !mapRef.current.leafletElement._panes || !mapRef.current.leafletElement._panes.overlayPane || !mapRef.current.leafletElement._panes.overlayPane.children.length || mapRef.current.leafletElement._panes.overlayPane.children[0].nodeName !== 'svg') {
        return;
      }
      // Only continue if DOMAINS and/or STATES are showing
      if (!state.filters.features.visible[_SiteMapUtils.FEATURES.DOMAINS.KEY] && !state.filters.features.visible[_SiteMapUtils.FEATURES.STATES.KEY]) {
        return;
      }
      // Only continue if the overlay pane has child nodes (rendered feature data)
      const svg = mapRef.current.leafletElement._panes.overlayPane.children[0];
      if (!svg.children.length) {
        return;
      }
      // Remove any existing <defs> node (it's only created by this effect, never by Leaflet)
      if (svg.children[0].nodeName.toLowerCase() === 'defs') {
        svg.removeChild(svg.children[0]);
      }
      // Only continue if there is one child node and it's a non-empty <g>
      if (svg.children.length !== 1 || svg.children[0].nodeName.toLowerCase() !== 'g' || !svg.children[0].children.length) {
        return;
      }
      const paths = [...svg.children[0].children];
      const svgNS = 'http://www.w3.org/2000/svg';
      const defs = document.createElementNS(svgNS, 'defs');
      let defCount = 0;
      paths.filter(path => path.attributes.class && path.attributes.class.value.includes('#mask')).forEach(path => {
        defCount += 1;
        const baseId = path.attributes.class.value.split(' ')[0];
        const defMaskId = baseId.replace('#', '');
        // Create a new <mask> element
        const defMask = document.createElementNS(svgNS, 'mask');
        defMask.setAttributeNS(null, 'id', defMaskId);
        // Create a new <path> element with the same coordinates and append it to the mask
        const defPath = document.createElementNS(svgNS, 'path');
        defPath.setAttributeNS(null, 'd', path.attributes.d.value);
        defPath.setAttributeNS(null, 'fill', 'white');
        defPath.setAttributeNS(null, 'stroke', 'rgba(255, 255, 255, 0.5)');
        defPath.setAttributeNS(null, 'stroke-width', '1.5');
        defMask.appendChild(defPath);
        // Append the <mask> to <defs>
        defs.appendChild(defMask);
        // Set the mask-path attribute on the <path> in the overlay pane
        path.setAttributeNS(null, 'mask', "url(".concat(baseId, ")"));
        // React Leaflet Polygon doesn't afford arbitrary styling and we use the className for
        // masking as we can't set arbitrary attributes or id either. But when showing masked
        // polygons AND doing area selection we need to apply some extra styles to the polygons
        // so that they are not fighting area selection for mouse control.
        path.setAttributeNS(null, 'style', state.map.mouseMode === _SiteMapUtils.MAP_MOUSE_MODES.AREA_SELECT ? 'cursor: crosshair; pointer-events: none' : '');
      });
      if (defCount === 0) {
        return;
      }
      svg.prepend(defs);
    }, 0);
  });
  if (!canRender) {
    return null;
  }

  /**
     Render - Zoom to Observatory Button
  */
  const renderShowFullObservatoryButton = () => /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    placement: "right",
    title: "Show the full NEON Observatory"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "".concat(classes.mapNavButtonContainer, " ").concat(classes.observatoryButton)
  }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    type: "button",
    className: classes.mapNavButton,
    onClick: () => {
      if (mapRefExists()) {
        mapRef.current.leafletElement.invalidateSize();
      }
      dispatch({
        type: 'showFullObservatory',
        mapRef
      });
    }
  }, /*#__PURE__*/_react.default.createElement(_Public.default, {
    fontSize: "small"
  }))));

  /**
     Render - Zoom to Observatory Button
  */
  const renderReturnToFocusLocationButton = () => !state.focusLocation.current ? null : /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    placement: "right",
    title: "Return to previous focus location: ".concat(state.focusLocation.current)
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "".concat(classes.mapNavButtonContainer, " ").concat(classes.focusLocationButton)
  }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    type: "button",
    className: classes.mapNavButton,
    onClick: () => {
      dispatch({
        type: 'returnToFocusLocation'
      });
    },
    disabled: (0, _SiteMapUtils.mapIsAtFocusLocation)(state)
  }, /*#__PURE__*/_react.default.createElement(_Place.default, {
    fontSize: "small"
  }))));

  /**
     Render - Mouse Mode Buttoms (Pan / Select)
   */
  const renderMouseModeToggleButtonGroup = () => {
    if (!state.selection.active) {
      return null;
    }
    const units = _SiteMapUtils.FEATURE_TYPES[state.selection.active].units || '';
    const mouseModeTooltips = {
      [_SiteMapUtils.MAP_MOUSE_MODES.PAN]: 'Click and drag on map to move the map center; shift+drag to zoom to an area',
      [_SiteMapUtils.MAP_MOUSE_MODES.AREA_SELECT]: "Click and drag on map to select ".concat(units, " in an area; shift+drag to add onto selection")
    };
    const mouseModeIcons = {
      [_SiteMapUtils.MAP_MOUSE_MODES.PAN]: _PanTool.default,
      [_SiteMapUtils.MAP_MOUSE_MODES.AREA_SELECT]: _CropFree.default
    };
    return /*#__PURE__*/_react.default.createElement(_ToggleButtonGroup.default, {
      exclusive: true,
      color: "primary",
      variant: "outlined",
      value: state.map.mouseMode,
      onChange: (event, newMouseMode) => {
        dispatch({
          type: 'setMapMouseMode',
          mouseMode: newMouseMode
        });
      },
      className: classes.mouseModeToggleButtonGroup
    }, Object.keys(_SiteMapUtils.MAP_MOUSE_MODES).map(key => {
      const Icon = mouseModeIcons[key];
      return /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        key: key,
        title: mouseModeTooltips[key],
        enterDelay: 500,
        enterNextDelay: 200,
        placement: "bottom-start"
      }, /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
        value: key,
        selected: state.map.mouseMode === key,
        "data-selenium": "sitemap-mouseMode-".concat(key),
        "area-label": mouseModeTooltips[key]
      }, /*#__PURE__*/_react.default.createElement(Icon, null)));
    }));
  };

  /**
     Render: Base Layer
     NOTE: Leaflet has breaking display issues when a tile layer is "reused". We use the unique map
     instance id here with the data-id attribute to attempt to force no tile layer reuse between
     instances of SiteMap components.
  */
  const renderBaseLayer = () => {
    const id = "tile-layer-".concat(mapInstanceId);
    if (!state.map.baseLayer) {
      return /*#__PURE__*/_react.default.createElement(_reactLeaflet.TileLayer, {
        url: "",
        attribution: "",
        "data-id": id
      });
    }
    const baseLayer = _SiteMapUtils.BASE_LAYERS[state.map.baseLayer];
    const attributionNode = /*#__PURE__*/_react.default.createElement("div", {
      title: baseLayer.fullAttribution,
      className: classes.attribution
    }, baseLayer.shortAttribution);
    const attributionString = _server.default.renderToStaticMarkup(attributionNode);
    return /*#__PURE__*/_react.default.createElement(_reactLeaflet.TileLayer, {
      url: baseLayer.url,
      attribution: attributionString,
      "data-id": id
    });
  };

  /**
     Render: Overlay
  */
  const renderOverlay = key => {
    const overlay = _SiteMapUtils.OVERLAYS[key];
    const group = _SiteMapUtils.OVERLAY_GROUPS[overlay.group] || {};
    const commonProps = _extends({}, group.commonProps || {}, overlay.commonProps || {});
    return /*#__PURE__*/_react.default.createElement(_reactLeaflet.LayerGroup, {
      key: key
    }, overlay.components.map(node => {
      let Component = null;
      if (node.type === 'WMSTileLayer') {
        Component = _reactLeaflet.WMSTileLayer;
      }
      if (!Component) {
        return null;
      }
      return /*#__PURE__*/_react.default.createElement(Component, _extends({
        key: node.key
      }, _extends({}, commonProps, node.props)));
    }));
  };

  /**
     Render: AreaSelection
  */
  const renderAreaSelection = () => {
    const {
      isDragging,
      center,
      reach
    } = areaSelection;
    if (!isDragging || !Number.isInteger(center.x) || !Number.isInteger(center.y) || !Number.isInteger(reach.x) || !Number.isInteger(reach.y)) {
      return null;
    }
    const style = {
      width: Math.abs(reach.x - center.x),
      height: Math.abs(reach.y - center.y),
      left: Math.min(center.x, reach.x),
      top: Math.min(center.y, reach.y)
    };
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.areaSelection,
      style: style
    });
  };

  /**
     Interaction Handlers
  */
  const handleMoveEnd = event => {
    const center = event.target.getCenter();
    const bounds = event.target.getBounds();
    dispatch({
      type: 'setMapCenter',
      center: [center.lat, center.lng],
      bounds: {
        lat: [bounds._southWest.lat, bounds._northEast.lat],
        lng: [bounds._southWest.lng, bounds._northEast.lng]
      }
    });
    if (typeof state.map.repositionOpenPopupFunc === 'function') {
      state.map.repositionOpenPopupFunc();
    }
  };
  const handleZoomEnd = event => {
    const center = event.target.getCenter();
    const bounds = event.target.getBounds();
    dispatch({
      type: 'setMapZoom',
      zoom: event.target.getZoom(),
      center: [center.lat, center.lng],
      bounds: {
        lat: [bounds._southWest.lat, bounds._northEast.lat],
        lng: [bounds._southWest.lng, bounds._northEast.lng]
      }
    });
    if (typeof state.map.repositionOpenPopupFunc === 'function') {
      state.map.repositionOpenPopupFunc();
    }
  };
  const handleBaseLayerChange = key => {
    if (key !== null && !_SiteMapUtils.BASE_LAYERS[key]) {
      return;
    }
    dispatch({
      type: 'setMapBaseLayer',
      baseLayer: key
    });
  };
  const handleOverlayChange = overlays => {
    dispatch({
      type: 'setMapOverlays',
      overlays: overlays.filter(o => o.checked).map(o => o.name)
    });
  };

  /**
     Render: Loading / Progress
  */
  const renderProgress = () => {
    if (state.overallFetch.expected === state.overallFetch.completed) {
      return null;
    }
    const style = state.selection.active ? {
      left: '48px',
      top: '48px'
    } : null;
    if (state.overallFetch.pendingHierarchy !== 0) {
      return /*#__PURE__*/_react.default.createElement(_Box.default, {
        className: classes.progress,
        style: style
      }, /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
        size: 32
      }));
    }
    const progress = state.overallFetch.expected === 0 ? 0 : Math.floor(state.overallFetch.completed / state.overallFetch.expected * 10) * 10;
    const progressProps = progress < 60 ? {
      size: 32
    } : {
      size: 32,
      variant: 'determinate',
      value: progress
    };
    return /*#__PURE__*/_react.default.createElement(_Box.default, {
      className: classes.progress,
      style: style
    }, /*#__PURE__*/_react.default.createElement(_CircularProgress.default, progressProps), /*#__PURE__*/_react.default.createElement(_Box.default, {
      top: 0,
      left: 0,
      bottom: 8,
      right: 0,
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption",
      component: "div"
    }, "".concat(Math.round(progress), "%"))));
  };

  /**
     Render: Map
  */
  const groupedLayerControlBaseLayers = Object.keys(_SiteMapUtils.BASE_LAYERS).map(key => ({
    name: key,
    title: _SiteMapUtils.BASE_LAYERS[key].title
  })).concat([{
    name: null,
    title: /*#__PURE__*/_react.default.createElement("span", {
      style: {
        color: _Theme.default.palette.grey[300],
        fontStyle: 'italic'
      }
    }, "none")
  }]);
  const groupedLayerControlOverlays = Object.keys(_SiteMapUtils.OVERLAYS).map(key => {
    const {
      KEY: name,
      title,
      group
    } = _SiteMapUtils.OVERLAYS[key];
    const checked = state.map.overlays.has(key);
    let groupTitle = null;
    if (group && _SiteMapUtils.OVERLAY_GROUPS[group]) {
      groupTitle = _SiteMapUtils.OVERLAY_GROUPS[group].title;
    }
    return {
      name,
      title,
      groupTitle,
      checked
    }; // eslint-disable-line object-curly-newline
  });
  const canRenderGroupedLayerControl = mapRef && mapRef.current && mapRef.current.leafletElement;
  const mouseModeCursors = {
    [_SiteMapUtils.MAP_MOUSE_MODES.PAN]: 'grab',
    [_SiteMapUtils.MAP_MOUSE_MODES.AREA_SELECT]: 'crosshair'
  };
  const mouseModeProps = state.map.mouseMode === _SiteMapUtils.MAP_MOUSE_MODES.PAN ? {
    boxZoom: true,
    dragging: true
  } : {
    boxZoom: false,
    dragging: false,
    touchZoom: false
  };
  let className = classes.map;
  if (state.fullscreen) {
    className = "".concat(className, " ").concat(classes.mapFullscreen);
  }
  if (areaSelection.isDragging) {
    className = "".concat(className, " ").concat(classes.mapNoMarkerPointerEvents);
  }
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactLeaflet.Map, _extends({
    id: "sitemap-".concat(mapInstanceId),
    ref: mapRef,
    className: className,
    style: {
      paddingBottom: "".concat((state.aspectRatio.currentValue || 0.75) * 100, "%"),
      cursor: mouseModeCursors[state.map.mouseMode]
    },
    center: state.map.center,
    zoom: state.map.zoom,
    minZoom: _SiteMapUtils.MAP_ZOOM_RANGE[0],
    maxZoom: _SiteMapUtils.MAP_ZOOM_RANGE[1],
    onMoveEnd: handleMoveEnd,
    onZoomEnd: handleZoomEnd,
    whenReady: invalidateSize,
    onBaseLayerChange: handleBaseLayerChange,
    worldCopyJump: true,
    "data-component": "SiteMap",
    "data-selenium": "sitemap-content-map",
    tap: false
  }, mouseModeProps), /*#__PURE__*/_react.default.createElement(_reactLeaflet.ScaleControl, {
    imperial: true,
    metric: true,
    updateWhenIdle: true
  }), renderBaseLayer(), Array.from(state.map.overlays).map(renderOverlay), !canRenderGroupedLayerControl ? null : /*#__PURE__*/_react.default.createElement(_reactLeafletGroupedLayerControl.ReactLeafletGroupedLayerControl, {
    position: "topright",
    baseLayers: groupedLayerControlBaseLayers,
    checkedBaseLayer: state.map.baseLayer,
    exclusiveGroups: [],
    overlays: groupedLayerControlOverlays,
    onBaseLayerChange: handleBaseLayerChange,
    onOverlayChange: handleOverlayChange,
    leaflet: {
      map: mapRef.current.leafletElement
    }
  }), Object.keys(_SiteMapUtils.FEATURES).filter(key => state.filters.features.available[key]).filter(key => state.filters.features.visible[key]).map(key => /*#__PURE__*/_react.default.createElement(_SiteMapFeature.default, {
    key: key,
    featureKey: key,
    mapRef: mapRef
  }))), renderAreaSelection(), renderShowFullObservatoryButton(), renderReturnToFocusLocationButton(), renderMouseModeToggleButtonGroup(), renderProgress());
};
var _default = exports.default = SiteMapLeaflet;