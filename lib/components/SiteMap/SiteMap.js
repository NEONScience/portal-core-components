"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TILE_LAYERS = void 0;

var _react = _interopRequireWildcard(require("react"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _styles = require("@material-ui/core/styles");

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _InfoOutlined = _interopRequireDefault(require("@material-ui/icons/InfoOutlined"));

var _Warning = _interopRequireDefault(require("@material-ui/icons/Warning"));

var _InsertChartOutlined = _interopRequireDefault(require("@material-ui/icons/InsertChartOutlined"));

var _leaflet = _interopRequireDefault(require("leaflet"));

require("leaflet/dist/leaflet.css");

var _reactLeaflet = require("react-leaflet");

var _Theme = _interopRequireWildcard(require("../Theme/Theme"));

var _NeonGraphQL = _interopRequireDefault(require("../NeonGraphQL/NeonGraphQL"));

var _sites = _interopRequireDefault(require("../../static/sites/sites.json"));

var _states = _interopRequireDefault(require("../../static/states/states.json"));

var _statesShapes = _interopRequireDefault(require("../../static/statesShapes/statesShapes.json"));

var _domains = _interopRequireDefault(require("../../static/domains/domains.json"));

var _domainsShapes = _interopRequireDefault(require("../../static/domainsShapes/domainsShapes.json"));

var _iconCoreTerrestrial = _interopRequireDefault(require("./icon-core-terrestrial.svg"));

var _iconCoreAquatic = _interopRequireDefault(require("./icon-core-aquatic.svg"));

var _iconCoreShadow = _interopRequireDefault(require("./icon-core-shadow.svg"));

var _iconRelocatableTerrestrial = _interopRequireDefault(require("./icon-relocatable-terrestrial.svg"));

var _iconRelocatableAquatic = _interopRequireDefault(require("./icon-relocatable-aquatic.svg"));

var _iconRelocatableShadow = _interopRequireDefault(require("./icon-relocatable-shadow.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var BaseLayer = _reactLeaflet.LayersControl.BaseLayer,
    Overlay = _reactLeaflet.LayersControl.Overlay;
var ICON_SVGS = {
  CORE: {
    AQUATIC: _iconCoreAquatic.default,
    TERRESTRIAL: _iconCoreTerrestrial.default,
    SHADOW: _iconCoreShadow.default
  },
  RELOCATABLE: {
    AQUATIC: _iconRelocatableAquatic.default,
    TERRESTRIAL: _iconRelocatableTerrestrial.default,
    SHADOW: _iconRelocatableShadow.default
  }
};
var SITE_DETAILS_URL_BASE = 'https://www.neonscience.org/field-sites/field-sites-map/';
var EXPLORE_DATA_PRODUCTS_URL_BASE = 'https://data.neonscience.org/data-products/explore?site=';
var TILE_LAYERS = {
  NatGeo_World_Map: {
    name: 'National Geographic',
    shortAttribution: '© Natl. Geographic et al.',
    fullAttribution: '© National Geographic, Esri, Garmin, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
    overlayColor: _Theme.default.palette.primary.main
  },
  World_Imagery: {
    name: 'Satellite Imagery',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    overlayColor: _Theme.COLORS.ORANGE[500]
  },
  World_Street_Map: {
    name: 'Streets',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, OSM contributors, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    overlayColor: _Theme.default.palette.primary.main
  },
  World_Topo_Map: {
    name: 'Topographic',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, HERE, Garmin, Intermap, iPC, GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), OSM contributors, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    overlayColor: _Theme.default.palette.primary.main
  }
};
exports.TILE_LAYERS = TILE_LAYERS;
var TILE_LAYERS_BY_NAME = {};
Object.keys(TILE_LAYERS).forEach(function (key) {
  TILE_LAYERS_BY_NAME[TILE_LAYERS[key].name] = key;
});
var boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    notFetchedContainer: {
      width: '100%',
      height: '0px',
      // Necessary to set a fixed aspect ratio from props (using paddingBottom)
      position: 'relative',
      backgroundColor: _Theme.COLORS.BLUE[200],
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      borderRadius: theme.spacing(1),
      boxShadow: boxShadow
    },
    notFetchedPaper: {
      position: 'absolute',
      width: '70%',
      top: '50%',
      transform: 'translate(0%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(3)
    },
    map: {
      width: '100%',
      height: '0px',
      // Necessary to set a fixed aspect ratio from props (using paddingBottom)
      overflow: 'hidden',
      borderRadius: theme.spacing(1),
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
    popup: {
      minWidth: '320px',
      '& a': {
        color: theme.palette.secondary.main
      },
      '& p': {
        margin: 'unset'
      },
      '& a.leaflet-popup-close-button': {
        top: theme.spacing(0.5),
        right: theme.spacing(0.5)
      }
    },
    popupButton: {
      width: '100%',
      whiteSpace: 'nowrap',
      marginBottom: theme.spacing(1),
      color: "".concat(_Theme.default.palette.primary.main, " !important"),
      borderColor: _Theme.default.palette.primary.main,
      '& span': {
        pointerEvents: 'none'
      }
    },
    startFlex: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center'
    }
  };
});

var SiteMap = function SiteMap(props) {
  var aspectRatio = props.aspectRatio,
      center = props.center,
      tileLayerProp = props.tileLayer,
      zoomProp = props.zoom,
      sitesProp = props.sites,
      popupHrefNew = props.popupHrefNew,
      popupExploreDataProductsButton = props.popupExploreDataProductsButton;
  var classes = useStyles(_Theme.default);
  var mapRef = (0, _react.useRef)(null);

  var sitesArrayToKeyedObject = function sitesArrayToKeyedObject() {
    var sitesArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    if (!Array.isArray(sitesArray)) {
      return {};
    }

    var sites = {};
    sitesArray.forEach(function (site) {
      sites[site.siteCode] = {
        siteCode: site.siteCode || site.code,
        description: site.siteDescription || site.description,
        type: site.siteType || site.type,
        stateCode: site.stateCode,
        domainCode: site.domainCode,
        latitude: site.siteLatitude || site.latitude,
        longitude: site.siteLongitude || site.longitude,
        terrain: site.terrain || _sites.default[site.siteCode].terrain
      };
    });
    return sites;
  };
  /**
     Prepare sites object. Our preferred shape looks like this:
     {
       ABBY: {
         description: 'Abby Road',
         type: 'RELOCATABLE',
         stateCode: 'WA',
         domainCode: 'D16',
         terrain: 'TERRESTRIAL',
         latitude: 45.762439,
         longitude: -122.330317,
       },
       ...
     }
     We may be passed something from props that is either this or the API response
     shape, so massage whatever we have into something we can use.
  */


  var sites = {};
  var fetchSitesStatus = 'awaitingFetchCall';

  if (sitesProp) {
    if (Array.isArray(sitesProp)) {
      sites = sitesArrayToKeyedObject(sitesProp);
      fetchSitesStatus = 'fetched';
    } else if (_typeof(sitesProp) === 'object' && Object.keys(sitesProp).length > 0) {
      sites = _extends({}, sitesProp);
      Object.keys(sites).forEach(function (siteCode) {
        if (!sites[siteCode].siteCode) {
          sites[siteCode].siteCode = siteCode;
        }

        if (!sites[siteCode].terrain) {
          sites[siteCode].terrain = _sites.default[siteCode].terrain;
        }
      });
      fetchSitesStatus = 'fetched';
    }
  }

  var reducer = function reducer(state, action) {
    switch (action.type) {
      case 'fetchSitesCalled':
        return _extends({}, state, {
          fetchSitesStatus: 'fetching'
        });

      case 'fetchSitesSucceeded':
        return _extends({}, state, {
          fetchSitesStatus: 'fetched',
          sites: action.sites
        });

      case 'fetchSitesFailed':
        return _extends({}, state, {
          fetchSitesStatus: 'error',
          fetchSitesError: action.error
        });

      case 'setTileLayer':
        if (!TILE_LAYERS[action.tileLayer]) {
          return state;
        }

        return _extends({}, state, {
          tileLayer: action.tileLayer
        });

      /*
      case 'setSitesOverlay':
        return { ...state, sitesOverlay: action.visible };
      case 'setExclusiveOverlay':
        return {
          ...state,
          statesOverlay: (action.eventName === 'US States' && action.eventType === 'overlayadd'),
        };
      */

      case 'setZoom':
        return _extends({}, state, {
          zoom: action.zoom
        });

      default:
        return state;
    }
  };

  var initialState = {
    zoom: zoomProp,
    tileLayer: tileLayerProp,
    sites: sites,
    fetchSitesStatus: fetchSitesStatus,
    fetchSitesError: null,
    sitesOverlay: true,
    statesOverlay: false,
    domainsOverlay: false
  };

  var _useReducer = (0, _react.useReducer)(reducer, initialState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1]; // If zoom was not set as a prop then attemp to set the initial zoom such that
  // all sites are visible. This depends on the client dimenaions of the map itself,
  // and whether height or width is the deciding factor depends on the aspect ratio.


  (0, _react.useEffect)(function () {
    if (state.zoom === null && mapRef && mapRef.current && mapRef.current.container) {
      var mapCont = mapRef.current.container;
      var minorDim = Math.min(mapCont.clientWidth / 136, mapCont.clientHeight / 128);
      var derivedZoom = [1, 2, 4, 6, 11].findIndex(function (m) {
        return m > minorDim;
      });
      dispatch({
        type: 'setZoom',
        zoom: derivedZoom === -1 ? 5 : derivedZoom
      });
    }
  });

  var fetchAllSites$ = _NeonGraphQL.default.getAllSites().pipe((0, _operators.map)(function (response) {
    if (response.response && response.response.data && response.response.data.sites) {
      var sitesResponse = sitesArrayToKeyedObject(response.response.data.sites);
      dispatch({
        type: 'fetchSitesSucceeded',
        sites: sitesResponse
      });
      return (0, _rxjs.of)(true);
    }

    dispatch({
      type: 'fetchSitesFailed',
      error: 'malformed response'
    });
    return (0, _rxjs.of)(false);
  }), (0, _operators.catchError)(function (error) {
    dispatch({
      type: 'fetchSitesFailed',
      error: error.message
    });
    return (0, _rxjs.of)(false);
  }));

  (0, _react.useEffect)(function () {
    if (state.fetchSitesStatus === 'awaitingFetchCall') {
      dispatch({
        type: 'fetchSitesCalled'
      });
      fetchAllSites$.subscribe();
    }
  });

  if (state.fetchSitesStatus !== 'fetched') {
    var notFetchedContents = _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_Typography.default, {
      variant: "h6",
      component: "h3",
      gutterBottom: true
    }, "Loading Sites..."), _react.default.createElement(_CircularProgress.default, null));

    if (state.fetchSitesStatus === 'error') {
      notFetchedContents = _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_Warning.default, {
        fontSize: "large",
        color: "error"
      }), _react.default.createElement(_Typography.default, {
        variant: "h6",
        component: "h3",
        style: {
          marginTop: _Theme.default.spacing(1)
        }
      }, "Unable to load sites: ".concat(state.fetchSitesError)));
    }

    return _react.default.createElement("div", {
      className: classes.notFetchedContainer,
      style: {
        paddingBottom: "".concat(aspectRatio * 100, "%")
      }
    }, _react.default.createElement(_Paper.default, {
      className: classes.notFetchedPaper
    }, notFetchedContents));
  }

  var getZoomedIcon = function getZoomedIcon(type, terrain) {
    if (!ICON_SVGS[type] || !ICON_SVGS[type][terrain] || !ICON_SVGS[type].SHADOW) {
      return null;
    }

    var iconScale = 0.2 + Math.floor((state.zoom - 2) / 3) / 10;
    return new _leaflet.default.Icon({
      iconUrl: ICON_SVGS[type][terrain],
      iconRetinaUrl: ICON_SVGS[type][terrain],
      iconSize: [100, 100].map(function (x) {
        return x * iconScale;
      }),
      iconAnchor: [50, 100].map(function (x) {
        return x * iconScale;
      }),
      shadowUrl: ICON_SVGS[type].SHADOW,
      shadowSize: [156, 93].map(function (x) {
        return x * iconScale;
      }),
      shadowAnchor: [50, 95].map(function (x) {
        return x * iconScale;
      }),
      popupAnchor: [0, -100].map(function (x) {
        return x * iconScale;
      })
    });
  };

  var renderSitePopup = function renderSitePopup(site) {
    var typeTitle = 'Core';
    var typeSubtitle = 'fixed location';

    if (site.type === 'RELOCATABLE') {
      typeTitle = 'Relocatable';
      typeSubtitle = 'location changes';
    }

    var terrainTitle = 'Terrestrial';
    var terrainSubtitle = 'land-based';

    if (site.terrain === 'AQUATIC') {
      terrainTitle = 'Aquatic';
      terrainSubtitle = 'water-based';
    }

    var terrainTypeTitle = "".concat(terrainTitle, " ").concat(typeTitle);
    var terrainTypeSubtitle = "(".concat(terrainSubtitle, ", ").concat(typeSubtitle, ")");

    var terrainIcon = _react.default.createElement("img", {
      src: ICON_SVGS[site.type][site.terrain],
      alt: site.terrain,
      title: "".concat(terrainTitle, " ").concat(terrainSubtitle),
      width: _Theme.default.spacing(5),
      height: _Theme.default.spacing(5),
      style: {
        marginRight: _Theme.default.spacing(1)
      }
    });

    var target = popupHrefNew ? {
      target: '_blank'
    } : {};

    var siteDetailsButton = _react.default.createElement(_Button.default, _extends({
      className: classes.popupButton,
      variant: "outlined",
      color: "primary",
      endIcon: _react.default.createElement(_InfoOutlined.default, null),
      href: "".concat(SITE_DETAILS_URL_BASE).concat(site.siteCode)
    }, target), "Site Details");

    var exploreDataProductsButton = popupExploreDataProductsButton ? _react.default.createElement(_Button.default, _extends({
      className: classes.popupButton,
      variant: "outlined",
      color: "primary",
      endIcon: _react.default.createElement(_InsertChartOutlined.default, null),
      href: "".concat(EXPLORE_DATA_PRODUCTS_URL_BASE).concat(site.siteCode)
    }, target), "Explore Data Products") : null;

    var renderField = function renderField(title, value) {
      return _react.default.createElement("div", null, _react.default.createElement(_Typography.default, {
        variant: "subtitle2"
      }, title), _react.default.createElement(_Typography.default, {
        variant: "body2"
      }, value));
    };

    var stateFieldTitle = site.stateCode === 'PR' ? 'Territory' : 'State';
    return _react.default.createElement(_reactLeaflet.Popup, {
      className: classes.popup
    }, _react.default.createElement(_Typography.default, {
      variant: "h5",
      gutterBottom: true
    }, "".concat(site.description, " (").concat(site.siteCode, ")")), _react.default.createElement("div", {
      className: classes.startFlex,
      style: {
        marginBottom: _Theme.default.spacing(1.5)
      }
    }, terrainIcon, renderField(terrainTypeTitle, terrainTypeSubtitle)), _react.default.createElement(_Grid.default, {
      container: true,
      spacing: 2,
      style: {
        marginBottom: _Theme.default.spacing(1)
      }
    }, _react.default.createElement(_Grid.default, {
      item: true,
      xs: 4
    }, renderField(stateFieldTitle, _states.default[site.stateCode].name)), _react.default.createElement(_Grid.default, {
      item: true,
      xs: 4
    }, renderField('Domain', "".concat(site.domainCode, " - ").concat(_domains.default[site.domainCode].name))), _react.default.createElement(_Grid.default, {
      item: true,
      xs: 4
    }, renderField('Lat./Lon.', "".concat(site.latitude, ", ").concat(site.longitude)))), siteDetailsButton, _react.default.createElement("br", null), exploreDataProductsButton);
  };

  var renderSitesOverlay = function renderSitesOverlay() {
    // Get new icons scaled to the current zoom level every render
    var zoomedIcons = {
      CORE: {
        AQUATIC: getZoomedIcon('CORE', 'AQUATIC'),
        TERRESTRIAL: getZoomedIcon('CORE', 'TERRESTRIAL')
      },
      RELOCATABLE: {
        AQUATIC: getZoomedIcon('RELOCATABLE', 'AQUATIC'),
        TERRESTRIAL: getZoomedIcon('RELOCATABLE', 'TERRESTRIAL')
      }
    };
    return _react.default.createElement(Overlay, {
      name: "NEON Sites",
      checked: state.sitesOverlay
    }, _react.default.createElement(_reactLeaflet.FeatureGroup, null, Object.keys(state.sites).map(function (siteCode) {
      var site = state.sites[siteCode];

      if (!zoomedIcons[site.type] || !zoomedIcons[site.type][site.terrain] || !site.latitude || !site.longitude) {
        return null;
      }

      return _react.default.createElement(_reactLeaflet.Marker, {
        key: siteCode,
        position: [site.latitude, site.longitude],
        icon: zoomedIcons[site.type][site.terrain]
      }, renderSitePopup(site));
    })));
  };

  var renderStatePopup = function renderStatePopup(stateCode) {
    if (!_states.default[stateCode]) {
      return null;
    }

    var stateName = _states.default[stateCode].name;
    return _react.default.createElement(_reactLeaflet.Popup, {
      className: classes.popup
    }, _react.default.createElement(_Typography.default, {
      variant: "h6",
      gutterBottom: true
    }, "".concat(stateName, " (").concat(stateCode, ")")));
  };

  var renderStatesOverlay = function renderStatesOverlay() {
    return _react.default.createElement(Overlay, {
      name: "US States",
      checked: state.statesOverlay
    }, _react.default.createElement(_reactLeaflet.FeatureGroup, null, _statesShapes.default.features.map(function (usState) {
      return _react.default.createElement(_reactLeaflet.Polygon, {
        key: usState.properties.stateCode,
        color: TILE_LAYERS[state.tileLayer].overlayColor,
        positions: usState.geometry.coordinates
      }, renderStatePopup(usState.properties.stateCode));
    })));
  };

  var renderDomainPopup = function renderDomainPopup(domainCode) {
    if (!_domains.default[domainCode]) {
      return null;
    }

    var domainName = _domains.default[domainCode].name;
    return _react.default.createElement(_reactLeaflet.Popup, {
      className: classes.popup
    }, _react.default.createElement(_Typography.default, {
      variant: "h6",
      gutterBottom: true
    }, "".concat(domainName, " (").concat(domainCode, ")")));
  };

  var renderDomainsOverlay = function renderDomainsOverlay() {
    return _react.default.createElement(Overlay, {
      name: "NEON Domains",
      checked: state.domainsOverlay
    }, _react.default.createElement(_reactLeaflet.FeatureGroup, null, _domainsShapes.default.features.map(function (domain) {
      return _react.default.createElement(_reactLeaflet.Polygon, {
        key: domain.properties.domainCode,
        color: TILE_LAYERS[state.tileLayer].overlayColor,
        positions: domain.geometry.coordinates
      }, renderDomainPopup(domain.properties.domainCode));
    })));
  };

  var renderTileLayer = function renderTileLayer(key) {
    var tileLayer = TILE_LAYERS[key];

    var attributionNode = _react.default.createElement("div", {
      title: tileLayer.fullAttribution,
      className: classes.attribution
    }, tileLayer.shortAttribution);

    var attributionString = _server.default.renderToStaticMarkup(attributionNode);

    return _react.default.createElement(BaseLayer, {
      key: key,
      name: tileLayer.name,
      checked: key === state.tileLayer
    }, _react.default.createElement(_reactLeaflet.TileLayer, {
      key: key,
      url: tileLayer.url,
      attribution: attributionString
    }));
  };
  /**
     Map event handlers
  */


  var handleZoomEnd = function handleZoomEnd(event) {
    dispatch({
      type: 'setZoom',
      zoom: event.target.getZoom()
    });
  };

  var handleBaseLayerChange = function handleBaseLayerChange(event) {
    if (!event.name || !TILE_LAYERS_BY_NAME[event.name]) {
      return;
    }

    dispatch({
      type: 'setTileLayer',
      tileLayer: TILE_LAYERS_BY_NAME[event.name]
    });
  };
  /**
     Render the Map
  */


  return _react.default.createElement(_reactLeaflet.Map, {
    ref: mapRef,
    className: classes.map,
    style: {
      paddingBottom: "".concat(aspectRatio * 100, "%")
    },
    center: center,
    zoom: state.zoom,
    maxZoom: 16,
    minZoom: 1,
    onZoomEnd: handleZoomEnd,
    onBaseLayerChange: handleBaseLayerChange
  }, _react.default.createElement(_reactLeaflet.ScaleControl, {
    imperial: true,
    metric: true,
    updateWhenIdle: true
  }), _react.default.createElement(_reactLeaflet.LayersControl, {
    position: "topright"
  }, Object.keys(TILE_LAYERS).map(renderTileLayer), renderDomainsOverlay(), renderStatesOverlay(), renderSitesOverlay()));
};

SiteMap.propTypes = {
  aspectRatio: _propTypes.default.number,
  center: _propTypes.default.arrayOf(_propTypes.default.number),
  zoom: _propTypes.default.number,
  tileLayer: _propTypes.default.oneOf(Object.keys(TILE_LAYERS)),
  popupHrefNew: _propTypes.default.bool,
  popupExploreDataProductsButton: _propTypes.default.bool,
  sites: _propTypes.default.oneOf([_propTypes.default.arrayOf(_propTypes.default.shape({
    siteCode: _propTypes.default.string.isRequired,
    siteDescription: _propTypes.default.string.isRequired,
    siteLatitude: _propTypes.default.number.isRequired,
    siteLongitude: _propTypes.default.number.isRequired,
    siteType: _propTypes.default.string,
    domainCode: _propTypes.default.string,
    stateCode: _propTypes.default.string,
    terrain: _propTypes.default.string
  })), _propTypes.default.objectOf(_propTypes.default.shape({
    description: _propTypes.default.string.isRequired,
    latitude: _propTypes.default.number.isRequired,
    longitude: _propTypes.default.number.isRequired,
    type: _propTypes.default.string.isRequired,
    terrain: _propTypes.default.string.isRequired,
    domainCode: _propTypes.default.string.isRequired,
    stateCode: _propTypes.default.string.isRequired
  }))])
};
SiteMap.defaultProps = {
  aspectRatio: 0.75,
  center: [52.68, -110.75],
  tileLayer: 'NatGeo_World_Map',
  zoom: null,
  popupHrefNew: true,
  popupExploreDataProductsButton: true,
  sites: null
};
var _default = SiteMap;
exports.default = _default;