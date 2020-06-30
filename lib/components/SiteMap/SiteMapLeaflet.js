"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _styles = require("@material-ui/core/styles");

var _Box = _interopRequireDefault(require("@material-ui/core/Box"));

var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

require("leaflet/dist/leaflet.css");

require("./SiteMap.css");

var _reactLeaflet = require("react-leaflet");

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _SiteMapContext = _interopRequireDefault(require("./SiteMapContext"));

var _SiteMapFeature = _interopRequireDefault(require("./SiteMapFeature"));

var _SiteMapUtils = require("./SiteMapUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var BaseLayer = _reactLeaflet.LayersControl.BaseLayer;
var boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    map: {
      width: '100%',
      height: '0px',
      // Necessary to set a fixed aspect ratio from props (using paddingBottom)
      overflow: 'hidden',
      boxShadow: boxShadow,
      '& div.leaflet-control-attribution': {
        borderTopLeftRadius: theme.spacing(0.5)
      },
      '& div.leaflet-control-attribution a': {
        color: theme.palette.secondary.main
      },
      '& input[type="radio"]': {
        cursor: 'pointer'
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
      top: theme.spacing(1.5),
      right: theme.spacing(7)
    }
  };
});
/**
   Main Component
*/

var SiteMapLeaflet = function SiteMapLeaflet() {
  var classes = useStyles(_Theme.default);
  var mapRef = (0, _react.useRef)(null); // State, Dispatch, and other stuff from SiteMapContext

  var _SiteMapContext$useSi = _SiteMapContext.default.useSiteMapContext(),
      _SiteMapContext$useSi2 = _slicedToArray(_SiteMapContext$useSi, 2),
      state = _SiteMapContext$useSi2[0],
      dispatch = _SiteMapContext$useSi2[1];

  var canRender = state.neonContextHydrated;

  if (state.focusLocation.current && state.focusLocation.fetch.status !== _SiteMapUtils.FETCH_STATUS.SUCCESS) {
    canRender = false;
  }
  /**
     Effect
     If zoom was not set as a prop then attempt to set the initial zoom such that
     all sites are visible. This depends on the client dimensions of the map
     and whether height or width is the deciding factor depends on the aspect ratio.
  */


  (0, _react.useEffect)(function () {
    if (!canRender || state.map.zoom !== null || !mapRef || !mapRef.current || !mapRef.current.container) {
      return;
    }

    var container = mapRef.current.container.parentElement;
    var minorDim = Math.min(container.clientWidth / 136, container.clientHeight / 128);
    var derivedZoom = [1, 2, 4, 6, 11].findIndex(function (m) {
      return m > minorDim;
    });
    dispatch({
      type: 'setMapZoom',
      zoom: derivedZoom === -1 ? 5 : derivedZoom
    });
  }, [canRender, state.map.zoom, mapRef, dispatch]);
  /**
    Effect
    If map bounds are null (as they will be when setting a focus location) then fill them in
    We have to do it this way as only the Leaflet Map instance can give us bounds
  */

  (0, _react.useEffect)(function () {
    if (state.map.bounds !== null || mapRef.current === null) {
      return;
    }

    var bounds = mapRef.current.leafletElement.getBounds();
    dispatch({
      type: 'setMapBounds',
      bounds: {
        lat: [bounds._southWest.lat, bounds._northEast.lat],
        lng: [bounds._southWest.lng, bounds._northEast.lng]
      }
    });
  }, [state.map.bounds, dispatch]);
  /**
    Effect
    Force a redraw when switching to the map for the first time from another view
  */

  (0, _react.useEffect)(function () {
    if (!mapRef || !mapRef.current || !mapRef.current.leafletElement || state.view.current !== _SiteMapUtils.VIEWS.MAP || state.view.initialized[_SiteMapUtils.VIEWS.MAP]) {
      return;
    }

    mapRef.current.leafletElement.invalidateSize();
    dispatch({
      type: 'setViewInitialized'
    });
  }, [mapRef, state.view, dispatch]);

  if (!canRender) {
    return null;
  }
  /**
     Render: Tile Layers
  */


  var renderTileLayer = function renderTileLayer(key) {
    var tileLayer = _SiteMapUtils.TILE_LAYERS[key];

    var attributionNode = /*#__PURE__*/_react.default.createElement("div", {
      title: tileLayer.fullAttribution,
      className: classes.attribution
    }, tileLayer.shortAttribution);

    var attributionString = _server.default.renderToStaticMarkup(attributionNode);

    return /*#__PURE__*/_react.default.createElement(BaseLayer, {
      key: key,
      name: tileLayer.name,
      checked: key === state.map.tileLayer
    }, /*#__PURE__*/_react.default.createElement(_reactLeaflet.TileLayer, {
      key: key,
      url: tileLayer.url,
      attribution: attributionString
    }));
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

  var handleBaseLayerChange = function handleBaseLayerChange(event) {
    if (!event.name || !_SiteMapUtils.TILE_LAYERS_BY_NAME[event.name]) {
      return;
    }

    dispatch({
      type: 'setMapTileLayer',
      tileLayer: _SiteMapUtils.TILE_LAYERS_BY_NAME[event.name]
    });
  };
  /**
     Render: Loading / Progress
  */


  var renderProgress = function renderProgress() {
    if (state.overallFetch.expected === state.overallFetch.completed) {
      return null;
    }

    if (state.overallFetch.pendingHierarchy !== 0) {
      return /*#__PURE__*/_react.default.createElement(_Box.default, {
        className: classes.progress
      }, /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
        size: 32
      }));
    }

    var progress = state.overallFetch.expected === 0 ? 0 : Math.floor(state.overallFetch.completed / state.overallFetch.expected * 10) * 10;
    var progressProps = progress < 60 ? {
      size: 32
    } : {
      size: 32,
      variant: 'static',
      value: progress
    };
    return /*#__PURE__*/_react.default.createElement(_Box.default, {
      className: classes.progress
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


  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactLeaflet.Map, {
    ref: mapRef,
    className: classes.map,
    style: {
      paddingBottom: "".concat((state.aspectRatio.currentValue || 0.75) * 100, "%")
    },
    center: state.map.center,
    zoom: state.map.zoom,
    minZoom: _SiteMapUtils.MAP_ZOOM_RANGE[0],
    maxZoom: _SiteMapUtils.MAP_ZOOM_RANGE[1],
    onMoveEnd: handleMoveEnd,
    onZoomEnd: handleZoomEnd,
    onBaseLayerChange: handleBaseLayerChange,
    worldCopyJump: true,
    "data-component": "SiteMap",
    "data-selenium": "sitemap-content-map"
  }, /*#__PURE__*/_react.default.createElement(_reactLeaflet.ScaleControl, {
    imperial: true,
    metric: true,
    updateWhenIdle: true
  }), /*#__PURE__*/_react.default.createElement(_reactLeaflet.LayersControl, {
    position: "topright"
  }, Object.keys(_SiteMapUtils.TILE_LAYERS).map(renderTileLayer)), Object.keys(_SiteMapUtils.FEATURES).filter(function (key) {
    return state.filters.features.available[key];
  }).filter(function (key) {
    return state.filters.features.visible[key];
  }).map(function (key) {
    return /*#__PURE__*/_react.default.createElement(_SiteMapFeature.default, {
      key: key,
      featureKey: key,
      mapRef: mapRef
    });
  })), renderProgress());
};

var _default = SiteMapLeaflet;
exports.default = _default;