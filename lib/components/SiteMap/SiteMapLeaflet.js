"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) { ; } } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
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
  };
});

/**
   Main Component
*/
var SiteMapLeaflet = function SiteMapLeaflet() {
  var _mouseModeCursors;
  var classes = useStyles(_Theme.default);
  var mapRef = (0, _react.useRef)(null);
  var _useId = (0, _reactIdGenerator.useId)(),
    _useId2 = _slicedToArray(_useId, 1),
    mapInstanceId = _useId2[0];
  var mapRefExists = function mapRefExists() {
    return mapRef && mapRef.current && mapRef.current.container && mapRef.current.leafletElement && mapRef.current.leafletElement._panes && mapRef.current.leafletElement._layers;
  };

  // State, Dispatch, and other stuff from SiteMapContext
  var _SiteMapContext$useSi = _SiteMapContext.default.useSiteMapContext(),
    _SiteMapContext$useSi2 = _slicedToArray(_SiteMapContext$useSi, 2),
    state = _SiteMapContext$useSi2[0],
    dispatch = _SiteMapContext$useSi2[1];
  var canRender = state.neonContextHydrated;
  if (state.focusLocation.current && state.focusLocation.fetch.status !== _SiteMapUtils.FETCH_STATUS.SUCCESS) {
    canRender = false;
  }
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    mapRefReady = _useState2[0],
    setMapRefReady = _useState2[1];

  /**
     Effect
     If zoom was not set as a prop then attempt to set the initial zoom such that
     all sites are visible. This depends on the client dimensions of the map
     and whether height or width is the deciding factor depends on the aspect ratio.
  */
  (0, _react.useEffect)(function () {
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
  var mapRefExistsProp = mapRefExists();
  (0, _react.useEffect)(function () {
    if (state.map.bounds !== null || !mapRefExistsProp) {
      return;
    }
    var bounds = mapRef.current.leafletElement.getBounds();
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
  (0, _react.useLayoutEffect)(function () {
    var timeout = window.setTimeout(function () {
      if (!mapRefExists() || state.view.current !== _SiteMapUtils.VIEWS.MAP || !state.selection.active || !state.selection.validSet || state.selection.active !== _SiteMapUtils.FEATURE_TYPES.SITES.KEY) {
        return;
      }
      var markerPane = mapRef.current.leafletElement._panes.markerPane;
      if (markerPane && markerPane.children && markerPane.children.length) {
        // Unselectables: apply CSS filters to appear ghosted
        _toConsumableArray(markerPane.children).filter(function (marker) {
          return !state.selection.validSet.has(marker.title);
        }).forEach(function (marker) {
          // eslint-disable-next-line no-param-reassign
          marker.style.filter = _SiteMapUtils.UNSELECTABLE_MARKER_FILTER;
        });
        // Selecatbles: Uniformly bump the zIndexOffset to put them all on top
        state.selection.validSet.forEach(function (item) {
          var layerIdx = Object.keys(mapRef.current.leafletElement._layers).find(function (k) {
            return mapRef.current.leafletElement._layers[k].options && mapRef.current.leafletElement._layers[k].options.title === item;
          });
          if (layerIdx !== -1 && mapRef.current.leafletElement._layers[layerIdx]) {
            var zIndex = (mapRef.current.leafletElement._layers[layerIdx] || {})._zIndex || 0;
            mapRef.current.leafletElement._layers[layerIdx].setZIndexOffset(zIndex + 1000);
          }
        });
      }
    }, 0);
    return function () {
      return window.clearTimeout(timeout);
    };
  }, [state.selection.active, state.selection.validSet, state.selection.hideUnselectable, state.map.bounds, state.view]);

  /**
     Callback
     Call map.invalidateSize to fix any tiling errors. We call this when the map is first ready
     to get around race conditions with leaflet initialization and loading the sitemap in dynamic
     containers like dialogs.
  */
  var invalidateSize = (0, _react.useCallback)(function () {
    if (!mapRefExists()) {
      return;
    }
    // setTimeout of 0 to fire after map render cycle completes
    window.setTimeout(function () {
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
  (0, _react.useEffect)(function () {
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
  var areaSelectionDefaultState = {
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
  var areaSelectionReducer = function areaSelectionReducer(areaSelectionState, action) {
    var isDragging = areaSelectionState.isDragging;
    var newState = _extends({}, areaSelectionState);
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
  var _useReducer = (0, _react.useReducer)(areaSelectionReducer, areaSelectionDefaultState),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    areaSelection = _useReducer2[0],
    areaSelectionDispatch = _useReducer2[1];

  /**
     Local State / Effect - Whether GroupedLayerControl has been rendered
     <ReactLeafletGroupedLayerControl> is a child of <Map>, but it also must take the ref to the map
     as a prop. Thus we must track whether it has rendered with local state. We want to basically
     re-render the map immediately and only once when the mepRef is set through the first render.
  */
  (0, _react.useEffect)(function () {
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
  (0, _react.useEffect)(function () {
    if (!mapRef || !mapRef.current || !mapRef.current.container || !mapRef.current.leafletElement || state.map.mouseMode !== _SiteMapUtils.MAP_MOUSE_MODES.AREA_SELECT) {
      return function () {};
    }
    var leafletElement = mapRef.current.leafletElement;
    var isDragging = areaSelection.isDragging,
      center = areaSelection.center,
      shiftPressed = areaSelection.shiftPressed;
    mapRef.current.container.onmousedown = function (event) {
      if (isDragging) {
        return;
      }
      areaSelectionDispatch({
        type: 'start',
        x: event.offsetX,
        y: event.offsetY
      });
    };
    mapRef.current.container.onmousemove = function (event) {
      if (!isDragging) {
        return;
      }
      areaSelectionDispatch({
        type: 'move',
        x: event.offsetX,
        y: event.offsetY
      });
    };
    mapRef.current.container.onmouseup = function (event) {
      if (!isDragging) {
        return;
      }
      var reach = {
        x: event.offsetX,
        y: event.offsetY
      };
      var centerLatLng = leafletElement.containerPointToLatLng(_leaflet.default.point(center.x, center.y));
      var reachLatLng = leafletElement.containerPointToLatLng(_leaflet.default.point(reach.x, reach.y));
      var selectionBounds = {
        lat: [Math.min(centerLatLng.lat, reachLatLng.lat), Math.max(centerLatLng.lat, reachLatLng.lat)],
        lng: [Math.min(centerLatLng.lng, reachLatLng.lng), Math.max(centerLatLng.lng, reachLatLng.lng)]
      };
      var selectableData = {};
      if (state.selection.active === _SiteMapUtils.FEATURE_TYPES.SITES.KEY) {
        selectableData = state.sites;
      }
      if ([_SiteMapUtils.FEATURE_TYPES.STATES.KEY, _SiteMapUtils.FEATURE_TYPES.DOMAINS.KEY].includes(state.selection.active)) {
        var selectableFeatureKey = Object.keys(_SiteMapUtils.FEATURES).find(function (k) {
          return _SiteMapUtils.FEATURES[k].type === state.selection.active;
        });
        if (selectableFeatureKey) {
          selectableData = state.featureData[state.selection.active][selectableFeatureKey];
        }
      }
      var newSelectionSet = (0, _SiteMapUtils.calculateLocationsInBounds)(selectableData, selectionBounds);
      var finalSelectionSet = new Set([].concat(_toConsumableArray(newSelectionSet), _toConsumableArray(shiftPressed ? Array.from(state.selection.set) : [])));
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
    var handleKeyDown = function handleKeyDown(event) {
      if (event.key === 'Shift') {
        areaSelectionDispatch({
          type: 'shift',
          pressed: true
        });
      }
    };
    var handleKeyUp = function handleKeyUp(event) {
      if (event.key === 'Shift') {
        areaSelectionDispatch({
          type: 'shift',
          pressed: false
        });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return function () {
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
  (0, _react.useLayoutEffect)(function () {
    // setTimeout of 0 to fire after map render cycle completes
    window.setTimeout(function () {
      // Only continue if the map is in a ready / fully rendered state.
      if (!mapRef || !mapRef.current || !mapRef.current.leafletElement || !mapRef.current._ready || mapRef.current._updating || !mapRef.current.leafletElement._panes || !mapRef.current.leafletElement._panes.overlayPane || !mapRef.current.leafletElement._panes.overlayPane.children.length || mapRef.current.leafletElement._panes.overlayPane.children[0].nodeName !== 'svg') {
        return;
      }
      // Only continue if DOMAINS and/or STATES are showing
      if (!state.filters.features.visible[_SiteMapUtils.FEATURES.DOMAINS.KEY] && !state.filters.features.visible[_SiteMapUtils.FEATURES.STATES.KEY]) {
        return;
      }
      // Only continue if the overlay pane has child nodes (rendered feature data)
      var svg = mapRef.current.leafletElement._panes.overlayPane.children[0];
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
      var paths = _toConsumableArray(svg.children[0].children);
      var svgNS = 'http://www.w3.org/2000/svg';
      var defs = document.createElementNS(svgNS, 'defs');
      var defCount = 0;
      paths.filter(function (path) {
        return path.attributes.class && path.attributes.class.value.includes('#mask');
      }).forEach(function (path) {
        defCount += 1;
        var baseId = path.attributes.class.value.split(' ')[0];
        var defMaskId = baseId.replace('#', '');
        // Create a new <mask> element
        var defMask = document.createElementNS(svgNS, 'mask');
        defMask.setAttributeNS(null, 'id', defMaskId);
        // Create a new <path> element with the same coordinates and append it to the mask
        var defPath = document.createElementNS(svgNS, 'path');
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
  var renderShowFullObservatoryButton = function renderShowFullObservatoryButton() {
    return /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      placement: "right",
      title: "Show the full NEON Observatory"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "".concat(classes.mapNavButtonContainer, " ").concat(classes.observatoryButton)
    }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
      type: "button",
      className: classes.mapNavButton,
      onClick: function onClick() {
        if (mapRefExists()) {
          mapRef.current.leafletElement.invalidateSize();
        }
        dispatch({
          type: 'showFullObservatory',
          mapRef: mapRef
        });
      }
    }, /*#__PURE__*/_react.default.createElement(_Public.default, {
      fontSize: "small"
    }))));
  };

  /**
     Render - Zoom to Observatory Button
  */
  var renderReturnToFocusLocationButton = function renderReturnToFocusLocationButton() {
    return !state.focusLocation.current ? null : /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      placement: "right",
      title: "Return to previous focus location: ".concat(state.focusLocation.current)
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "".concat(classes.mapNavButtonContainer, " ").concat(classes.focusLocationButton)
    }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
      type: "button",
      className: classes.mapNavButton,
      onClick: function onClick() {
        dispatch({
          type: 'returnToFocusLocation'
        });
      },
      disabled: (0, _SiteMapUtils.mapIsAtFocusLocation)(state)
    }, /*#__PURE__*/_react.default.createElement(_Place.default, {
      fontSize: "small"
    }))));
  };

  /**
     Render - Mouse Mode Buttoms (Pan / Select)
   */
  var renderMouseModeToggleButtonGroup = function renderMouseModeToggleButtonGroup() {
    var _mouseModeTooltips, _mouseModeIcons;
    if (!state.selection.active) {
      return null;
    }
    var units = _SiteMapUtils.FEATURE_TYPES[state.selection.active].units || '';
    var mouseModeTooltips = (_mouseModeTooltips = {}, _defineProperty(_mouseModeTooltips, _SiteMapUtils.MAP_MOUSE_MODES.PAN, 'Click and drag on map to move the map center; shift+drag to zoom to an area'), _defineProperty(_mouseModeTooltips, _SiteMapUtils.MAP_MOUSE_MODES.AREA_SELECT, "Click and drag on map to select ".concat(units, " in an area; shift+drag to add onto selection")), _mouseModeTooltips);
    var mouseModeIcons = (_mouseModeIcons = {}, _defineProperty(_mouseModeIcons, _SiteMapUtils.MAP_MOUSE_MODES.PAN, _PanTool.default), _defineProperty(_mouseModeIcons, _SiteMapUtils.MAP_MOUSE_MODES.AREA_SELECT, _CropFree.default), _mouseModeIcons);
    return /*#__PURE__*/_react.default.createElement(_ToggleButtonGroup.default, {
      exclusive: true,
      color: "primary",
      variant: "outlined",
      value: state.map.mouseMode,
      onChange: function onChange(event, newMouseMode) {
        dispatch({
          type: 'setMapMouseMode',
          mouseMode: newMouseMode
        });
      },
      className: classes.mouseModeToggleButtonGroup
    }, Object.keys(_SiteMapUtils.MAP_MOUSE_MODES).map(function (key) {
      var Icon = mouseModeIcons[key];
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
  var renderBaseLayer = function renderBaseLayer() {
    var id = "tile-layer-".concat(mapInstanceId);
    if (!state.map.baseLayer) {
      return /*#__PURE__*/_react.default.createElement(_reactLeaflet.TileLayer, {
        url: "",
        attribution: "",
        "data-id": id
      });
    }
    var baseLayer = _SiteMapUtils.BASE_LAYERS[state.map.baseLayer];
    var attributionNode = /*#__PURE__*/_react.default.createElement("div", {
      title: baseLayer.fullAttribution,
      className: classes.attribution
    }, baseLayer.shortAttribution);
    var attributionString = _server.default.renderToStaticMarkup(attributionNode);
    return /*#__PURE__*/_react.default.createElement(_reactLeaflet.TileLayer, {
      url: baseLayer.url,
      attribution: attributionString,
      "data-id": id
    });
  };

  /**
     Render: Overlay
  */
  var renderOverlay = function renderOverlay(key) {
    var overlay = _SiteMapUtils.OVERLAYS[key];
    var group = _SiteMapUtils.OVERLAY_GROUPS[overlay.group] || {};
    var commonProps = _extends({}, group.commonProps || {}, overlay.commonProps || {});
    return /*#__PURE__*/_react.default.createElement(_reactLeaflet.LayerGroup, {
      key: key
    }, overlay.components.map(function (node) {
      var Component = null;
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
  var renderAreaSelection = function renderAreaSelection() {
    var isDragging = areaSelection.isDragging,
      center = areaSelection.center,
      reach = areaSelection.reach;
    if (!isDragging || !Number.isInteger(center.x) || !Number.isInteger(center.y) || !Number.isInteger(reach.x) || !Number.isInteger(reach.y)) {
      return null;
    }
    var style = {
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
  var handleMoveEnd = function handleMoveEnd(event) {
    var center = event.target.getCenter();
    var bounds = event.target.getBounds();
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
  var handleZoomEnd = function handleZoomEnd(event) {
    var center = event.target.getCenter();
    var bounds = event.target.getBounds();
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
  var handleBaseLayerChange = function handleBaseLayerChange(key) {
    if (key !== null && !_SiteMapUtils.BASE_LAYERS[key]) {
      return;
    }
    dispatch({
      type: 'setMapBaseLayer',
      baseLayer: key
    });
  };
  var handleOverlayChange = function handleOverlayChange(overlays) {
    dispatch({
      type: 'setMapOverlays',
      overlays: overlays.filter(function (o) {
        return o.checked;
      }).map(function (o) {
        return o.name;
      })
    });
  };

  /**
     Render: Loading / Progress
  */
  var renderProgress = function renderProgress() {
    if (state.overallFetch.expected === state.overallFetch.completed) {
      return null;
    }
    var style = state.selection.active ? {
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
    var progress = state.overallFetch.expected === 0 ? 0 : Math.floor(state.overallFetch.completed / state.overallFetch.expected * 10) * 10;
    var progressProps = progress < 60 ? {
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
  var groupedLayerControlBaseLayers = Object.keys(_SiteMapUtils.BASE_LAYERS).map(function (key) {
    return {
      name: key,
      title: _SiteMapUtils.BASE_LAYERS[key].title
    };
  }).concat([{
    name: null,
    title: /*#__PURE__*/_react.default.createElement("span", {
      style: {
        color: _Theme.default.palette.grey[300],
        fontStyle: 'italic'
      }
    }, "none")
  }]);
  var groupedLayerControlOverlays = Object.keys(_SiteMapUtils.OVERLAYS).map(function (key) {
    var _OVERLAYS$key = _SiteMapUtils.OVERLAYS[key],
      name = _OVERLAYS$key.KEY,
      title = _OVERLAYS$key.title,
      group = _OVERLAYS$key.group;
    var checked = state.map.overlays.has(key);
    var groupTitle = null;
    if (group && _SiteMapUtils.OVERLAY_GROUPS[group]) {
      groupTitle = _SiteMapUtils.OVERLAY_GROUPS[group].title;
    }
    return {
      name: name,
      title: title,
      groupTitle: groupTitle,
      checked: checked
    }; // eslint-disable-line object-curly-newline
  });

  var canRenderGroupedLayerControl = mapRef && mapRef.current && mapRef.current.leafletElement;
  var mouseModeCursors = (_mouseModeCursors = {}, _defineProperty(_mouseModeCursors, _SiteMapUtils.MAP_MOUSE_MODES.PAN, 'grab'), _defineProperty(_mouseModeCursors, _SiteMapUtils.MAP_MOUSE_MODES.AREA_SELECT, 'crosshair'), _mouseModeCursors);
  var mouseModeProps = state.map.mouseMode === _SiteMapUtils.MAP_MOUSE_MODES.PAN ? {
    boxZoom: true,
    dragging: true
  } : {
    boxZoom: false,
    dragging: false,
    touchZoom: false
  };
  var className = classes.map;
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
  }), Object.keys(_SiteMapUtils.FEATURES).filter(function (key) {
    return state.filters.features.available[key];
  }).filter(function (key) {
    return state.filters.features.visible[key];
  }).map(function (key) {
    return /*#__PURE__*/_react.default.createElement(_SiteMapFeature.default, {
      key: key,
      featureKey: key,
      mapRef: mapRef
    });
  })), renderAreaSelection(), renderShowFullObservatoryButton(), renderReturnToFocusLocationButton(), renderMouseModeToggleButtonGroup(), renderProgress());
};
var _default = SiteMapLeaflet;
exports.default = _default;