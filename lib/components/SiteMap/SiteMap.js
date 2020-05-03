"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TILE_LAYERS = exports.SITE_MAP_MODES = void 0;

var _react = _interopRequireWildcard(require("react"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactCopyToClipboard = require("react-copy-to-clipboard");

var _styles = require("@material-ui/core/styles");

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));

var _SnackbarContent = _interopRequireDefault(require("@material-ui/core/SnackbarContent"));

var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _TouchApp = _interopRequireDefault(require("@material-ui/icons/TouchApp"));

var _Warning = _interopRequireDefault(require("@material-ui/icons/Warning"));

var _InsertChartOutlined = _interopRequireDefault(require("@material-ui/icons/InsertChartOutlined"));

var _MyLocation = _interopRequireDefault(require("@material-ui/icons/MyLocation"));

var _InfoOutlined = _interopRequireDefault(require("@material-ui/icons/InfoOutlined"));

var _leaflet = _interopRequireDefault(require("leaflet"));

require("leaflet/dist/leaflet.css");

var _reactLeaflet = require("react-leaflet");

var _Theme = _interopRequireWildcard(require("../Theme/Theme"));

var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));

var _statesShapes = _interopRequireDefault(require("../../staticJSON/statesShapes.json"));

var _domainsShapes = _interopRequireDefault(require("../../staticJSON/domainsShapes.json"));

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

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

var BaseLayer = _reactLeaflet.LayersControl.BaseLayer,
    Overlay = _reactLeaflet.LayersControl.Overlay;
var SITE_MAP_MODES = {
  EXPLORE: 'EXPLORE',
  SELECT: 'SELECT'
};
exports.SITE_MAP_MODES = SITE_MAP_MODES;
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
};
var SITE_DETAILS_URL_BASE = 'https://www.neonscience.org/field-sites/field-sites-map/';
var EXPLORE_DATA_PRODUCTS_URL_BASE = 'https://data.neonscience.org/data-products/explore?site=';
var TILE_LAYERS = {
  NatGeo_World_Map: {
    name: 'National Geographic',
    shortAttribution: '© Natl. Geographic et al.',
    fullAttribution: '© National Geographic, Esri, Garmin, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}'
  },
  World_Imagery: {
    name: 'Satellite Imagery',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  },
  World_Street_Map: {
    name: 'Streets',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, OSM contributors, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
  },
  World_Topo_Map: {
    name: 'Topographic',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, HERE, Garmin, Intermap, iPC, GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), OSM contributors, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
  }
};
exports.TILE_LAYERS = TILE_LAYERS;
var TILE_LAYERS_BY_NAME = {};
Object.keys(TILE_LAYERS).forEach(function (key) {
  TILE_LAYERS_BY_NAME[TILE_LAYERS[key].name] = key;
});
var boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
var rootOverlayColors = {
  states: '#3cdd85',
  // COLORS.RED[300],
  domains: '#a36ce5',
  // COLORS.GREY[300],
  partialSelected: _Theme.COLORS.SECONDARY_BLUE[300],
  totalSelected: _Theme.COLORS.SECONDARY_BLUE[500],
  hover: _Theme.COLORS.SECONDARY_BLUE[100]
};
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
    mapIcon: {
      boxSizing: 'content-box'
    },
    mapIconCORE: {
      borderRadius: '20%'
    },
    mapIconRELOCATABLE: {
      borderRadius: '50%'
    },
    mapIconUnselected: {
      boxShadow: 'none',
      '&:hover, &:focus': {
        boxShadow: "0px 0px 5px 5px ".concat(_Theme.default.palette.secondary.main)
      },
      '&:active': {
        boxShadow: "0px 0px 8px 8px ".concat(_Theme.default.palette.secondary.main)
      }
    },
    mapIconSelected: {
      boxShadow: 'none',
      '&:hover, &:focus': {
        boxShadow: '0px 0px 3px 3px #ffffff'
      },
      '&:active': {
        boxShadow: '0px 0px 6px 6px #ffffff'
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
    popupSiteIcon: {
      width: '20px',
      height: '20px',
      margin: '0px 4px 4px 0px'
    },
    startFlex: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    startFlexInline: {
      display: 'inline-flex',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    keySwatchStates: {
      border: "2px solid ".concat(rootOverlayColors.states),
      backgroundColor: "".concat(rootOverlayColors.states, "88"),
      width: _Theme.default.spacing(3),
      height: _Theme.default.spacing(1),
      margin: _Theme.default.spacing(0, 0.5, 0.25, 0)
    },
    keySwatchDomains: {
      border: "2px solid ".concat(rootOverlayColors.domains),
      backgroundColor: "".concat(rootOverlayColors.domains, "88"),
      width: _Theme.default.spacing(3),
      height: _Theme.default.spacing(1),
      margin: _Theme.default.spacing(0, 0.5, 0.25, 0)
    },
    keySiteIcon: {
      width: '20px',
      height: '20px',
      marginRight: '4px'
    },
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
    }
  };
});

var SiteMap = function SiteMap(props) {
  var aspectRatio = props.aspectRatio,
      center = props.center,
      mode = props.mode,
      tileLayerProp = props.tileLayer,
      zoomProp = props.zoom;
  var classes = useStyles(_Theme.default);
  var mapRef = (0, _react.useRef)(null);

  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
      _NeonContext$useNeonC3 = _NeonContext$useNeonC2[0],
      neonContextData = _NeonContext$useNeonC3.data,
      neonContextFetches = _NeonContext$useNeonC3.fetches;

  var allSites = neonContextData.sites,
      allStates = neonContextData.states,
      allDomains = neonContextData.domains;
  /**
     Icon Setup
  */

  var getIconClassName = function getIconClassName(type, isSelected) {
    return [classes.mapIcon, classes["mapIcon".concat(type)], classes["mapIcon".concat(isSelected ? 'Selected' : 'Unselected')]].join(' ');
  }; // Get a leaflet icon instance scaled to the current zoom level.


  var getZoomedIcon = function getZoomedIcon() {
    var zoom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
    var type = arguments.length > 1 ? arguments[1] : undefined;
    var terrain = arguments.length > 2 ? arguments[2] : undefined;
    var isSelected = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (!ICON_SVGS[type] || !ICON_SVGS[type][terrain] || !ICON_SVGS[type].SHADOW) {
      return null;
    }

    var selected = isSelected ? 'SELECTED' : 'BASE';
    var iconScale = 0.2 + Math.floor(((zoom || 2) - 2) / 3) / 10;
    var iconSize = isSelected ? [150, 150] : [100, 100];
    var iconAnchor = isSelected ? [75, 125] : [50, 100];
    var shadowSize = isSelected ? [234, 160] : [156, 93];
    var shadowAnchor = isSelected ? [80, 120] : [50, 83];
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
      }),
      className: getIconClassName(type, isSelected)
    });
  }; // Get a structure containing all zoomed leaflet icon instances. These are stored in
  // state and regenerated any time the zoom level changes. This makes for a maximum of
  // eight distinct icon instances in memory instead of one for every site.


  var getZoomedIcons = function getZoomedIcons(zoom) {
    return {
      CORE: {
        AQUATIC: {
          BASE: getZoomedIcon(zoom, 'CORE', 'AQUATIC'),
          SELECTED: getZoomedIcon(zoom, 'CORE', 'AQUATIC', true)
        },
        TERRESTRIAL: {
          BASE: getZoomedIcon(zoom, 'CORE', 'TERRESTRIAL'),
          SELECTED: getZoomedIcon(zoom, 'CORE', 'TERRESTRIAL', true)
        }
      },
      RELOCATABLE: {
        AQUATIC: {
          BASE: getZoomedIcon(zoom, 'RELOCATABLE', 'AQUATIC'),
          SELECTED: getZoomedIcon(zoom, 'RELOCATABLE', 'AQUATIC', true)
        },
        TERRESTRIAL: {
          BASE: getZoomedIcon(zoom, 'RELOCATABLE', 'TERRESTRIAL'),
          SELECTED: getZoomedIcon(zoom, 'RELOCATABLE', 'TERRESTRIAL', true)
        }
      }
    };
  };
  /**
     State and Reducer Setup
  */
  // Derive values for stateSites and domainSites in state. This is a one-time mapping we
  // generate when sites are loaded into state containing lists of site codes for each
  // state code / domain code.


  var deriveRegionSites = function deriveRegionSites(state) {
    var stateSites = {};
    var domainSites = {};
    Object.keys(allSites).forEach(function (siteCode) {
      var _allSites$siteCode = allSites[siteCode],
          stateCode = _allSites$siteCode.stateCode,
          domainCode = _allSites$siteCode.domainCode;

      if (!stateSites[stateCode]) {
        stateSites[stateCode] = new Set();
      }

      if (!domainSites[domainCode]) {
        domainSites[domainCode] = new Set();
      }

      stateSites[stateCode].add(siteCode);
      domainSites[domainCode].add(siteCode);
    }); // Fill in empty sets for any states that had no NEON sites

    Object.keys(allStates).forEach(function (stateCode) {
      if (!stateSites[stateCode]) {
        stateSites[stateCode] = new Set();
      }
    });
    return _extends(_extends({}, state), {}, {
      stateSites: stateSites,
      domainSites: domainSites
    });
  }; // Derive the selected status of a given region (US state or NEON domain). This should run
  // every time the list of selected sites changes. It regenerates selectedStates and
  // selectedDomains in state to each contain a key/value lookup where the key is the region code
  // (state code or domain code) and the value is either 'total' (all sites selected) or 'partial'
  // (some sites selected). If no sites are selected for the region it is omitted from the map.


  var deriveRegionSelections = function deriveRegionSelections(state) {
    var derive = function derive(regionType) {
      var regionKey = regionType === 'states' ? 'stateSites' : 'domainSites';
      var selectedRegions = {};
      Object.keys(state[regionKey]).forEach(function (regionCode) {
        var regionSitesSet = new Set(state[regionKey][regionCode]);

        var intersection = _toConsumableArray(regionSitesSet).filter(function (x) {
          return state.selectedSites.has(x);
        });

        if (!intersection.length) {
          return;
        }

        selectedRegions[regionCode] = intersection.length === regionSitesSet.size ? 'total' : 'partial';
      });
      return selectedRegions;
    };

    return _extends(_extends({}, state), {}, {
      selectedStates: derive('states'),
      selectedDomains: derive('domains')
    });
  };

  var reducer = function reducer(state, action) {
    var selectedSites = new Set(state.selectedSites);
    var setMethod = null;

    switch (action.type) {
      case 'setDerivedRegionSites':
        return deriveRegionSites(_extends(_extends({}, state), {}, {
          regionSitesDerived: true
        }));

      case 'setTileLayer':
        if (!TILE_LAYERS[action.tileLayer]) {
          return state;
        }

        return _extends(_extends({}, state), {}, {
          tileLayer: action.tileLayer
        });

      case 'setZoom':
        return _extends(_extends({}, state), {}, {
          zoom: action.zoom,
          zoomedIcons: getZoomedIcons(action.zoom)
        });

      case 'toggleSiteSelected':
        if (selectedSites.has(action.site)) {
          selectedSites.delete(action.site);
        } else {
          selectedSites.add(action.site);
        }

        return deriveRegionSelections(_extends(_extends({}, state), {}, {
          selectedSites: selectedSites
        }));

      case 'toggleStateSelected':
        setMethod = state.selectedStates[action.stateCode] === 'total' ? 'delete' : 'add';
        state.stateSites[action.stateCode].forEach(function (siteCode) {
          selectedSites[setMethod](siteCode);
        });
        return deriveRegionSelections(_extends(_extends({}, state), {}, {
          selectedSites: selectedSites
        }));

      case 'toggleDomainSelected':
        setMethod = state.selectedDomains[action.domainCode] === 'total' ? 'delete' : 'add';
        state.domainSites[action.domainCode].forEach(function (siteCode) {
          selectedSites[setMethod](siteCode);
        });
        return deriveRegionSelections(_extends(_extends({}, state), {}, {
          selectedSites: selectedSites
        }));

      default:
        return state;
    }
  };

  var initialState = {
    zoom: zoomProp,
    tileLayer: tileLayerProp,
    regionSitesDerived: false,
    stateSites: {},
    // derived once from sites
    domainSites: {},
    // derived once from sites
    sitesOverlay: true,
    statesOverlay: false,
    domainsOverlay: false,
    selectedSites: new Set(),
    selectedStates: {},
    // derived from selectedSites when changed
    selectedDomains: {} // derived from selectedSites when changed

  };
  initialState.zoomedIcons = getZoomedIcons(zoomProp);

  if (neonContextFetches.sites.status === 'SUCCESS') {
    initialState = deriveRegionSites(_extends(_extends({}, initialState), {}, {
      regionSitesDerived: true
    }));
  }

  var _useReducer = (0, _react.useReducer)(reducer, initialState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];
  /**
     Effects
  */
  // Derive region/site lists in local state if the NeonContext state has finished loading


  (0, _react.useEffect)(function () {
    if (state.regionSitesDerived || neonContextFetches.sites.status !== 'SUCCESS') {
      return;
    }

    dispatch({
      type: 'setDerivedRegionSites'
    });
  }, [state.regionSitesDerived, neonContextFetches.sites.status]); // If zoom was not set as a prop then attemp to set the initial zoom such that
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
  /**
     Utils
  */
  // Used only in SELECT mode, or more specifically, only when popups are on mouse over only and
  // do not persist.

  var positionPopup = function positionPopup(e) {
    /* eslint-disable no-underscore-dangle */
    var TIP_HEIGHT = 47;

    e.target._popup.setLatLng(e.latlng); // Leaflet popups always open above; open below if mouse event is in the top half of the map


    if (e.containerPoint.y < mapRef.current.container.clientHeight / 2) {
      var popupHeight = e.target._popup._contentNode.clientHeight;
      var tipY = popupHeight + TIP_HEIGHT;
      e.target._popup._container.style.bottom = "".concat((popupHeight + TIP_HEIGHT * 1.75) * -1, "px");
      e.target._popup._tipContainer.style.transform = "rotate(0.5turn) translate(0px, ".concat(tipY, "px)");
    } else {
      e.target._popup._container.style.bottom = '0px';
      e.target._popup._tipContainer.style.transform = null;
    }

    e.target._popup._closeButton.style.display = 'none';
    /* eslint-enable no-underscore-dangle */
  };
  /**
     Secondary Render - Loading and Error states
  */


  if (neonContextFetches.sites.status !== 'SUCCESS') {
    /*
    if (mode === 'SELECT') {
      debugger; // eslint-disable-line no-debugger
    }
    */
    var notFetchedContents = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
      component: "h3",
      gutterBottom: true
    }, "Loading Sites..."), /*#__PURE__*/_react.default.createElement(_CircularProgress.default, null));

    if (neonContextFetches.sites.status === 'ERROR') {
      notFetchedContents = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Warning.default, {
        fontSize: "large",
        color: "error"
      }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "h6",
        component: "h3",
        style: {
          marginTop: _Theme.default.spacing(1)
        }
      }, "Unable to load sites: ".concat(neonContextFetches.sites.error)));
    }

    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.notFetchedContainer,
      style: {
        paddingBottom: "".concat(aspectRatio * 100, "%")
      }
    }, /*#__PURE__*/_react.default.createElement(_Paper.default, {
      className: classes.notFetchedPaper
    }, notFetchedContents));
  }
  /**
     Render Sites
  */


  var renderSitePopup = function renderSitePopup(site) {
    var typeTitle = 'Core';
    var typeSubtitle = 'fixed location';

    if (site.type === 'RELOCATABLE') {
      typeTitle = 'Relocatable';
      typeSubtitle = 'location may change';
    }

    var terrainTitle = 'Terrestrial';
    var terrainSubtitle = 'land-based';

    if (site.terrain === 'AQUATIC') {
      terrainTitle = 'Aquatic';
      terrainSubtitle = 'water-based';
    }

    var terrainTypeTitle = "".concat(terrainTitle, " ").concat(typeTitle);
    var terrainTypeSubtitle = "".concat(terrainSubtitle, "; ").concat(typeSubtitle);

    var terrainIcon = /*#__PURE__*/_react.default.createElement("img", {
      src: ICON_SVGS[site.type][site.terrain].BASE,
      alt: site.terrain,
      title: "".concat(terrainTitle, " ").concat(terrainSubtitle),
      width: _Theme.default.spacing(5),
      height: _Theme.default.spacing(5),
      style: {
        marginRight: _Theme.default.spacing(1)
      }
    });

    var stateFieldTitle = site.stateCode === 'PR' ? 'Territory' : 'State';

    var renderActions = function renderActions() {
      if (mode === 'SELECT') {
        var isSelected = state.selectedSites.has(site.siteCode);
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
        target: '_blank'
      };
      return /*#__PURE__*/_react.default.createElement(_Grid.default, {
        container: true,
        spacing: 2
      }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
        item: true,
        xs: 6
      }, /*#__PURE__*/_react.default.createElement(_Button.default, _extends({
        endIcon: /*#__PURE__*/_react.default.createElement(_InfoOutlined.default, null),
        href: "".concat(SITE_DETAILS_URL_BASE).concat(site.siteCode)
      }, actionButtonProps), "Site Details")), /*#__PURE__*/_react.default.createElement(_Grid.default, {
        item: true,
        xs: 6
      }, /*#__PURE__*/_react.default.createElement(_Button.default, _extends({
        endIcon: /*#__PURE__*/_react.default.createElement(_InsertChartOutlined.default, null),
        href: "".concat(EXPLORE_DATA_PRODUCTS_URL_BASE).concat(site.siteCode)
      }, actionButtonProps), "Explore Data")));
    };

    return /*#__PURE__*/_react.default.createElement(_reactLeaflet.Popup, {
      className: classes.popup,
      autoPan: mode !== 'SELECT'
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.startFlex,
      style: {
        marginBottom: _Theme.default.spacing(1.5)
      }
    }, terrainIcon, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
      style: {
        lineHeight: '1.4rem'
      }
    }, "".concat(site.description, " (").concat(site.siteCode, ")"))), /*#__PURE__*/_react.default.createElement(_Grid.default, {
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
    }, terrainTypeTitle), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption"
    }, /*#__PURE__*/_react.default.createElement("i", null, terrainTypeSubtitle))), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 4,
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, stateFieldTitle), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2"
    }, allStates[site.stateCode].name)), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 5,
      style: {
        display: 'flex',
        alignItems: 'flex-end'
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.startFlex
    }, /*#__PURE__*/_react.default.createElement(_reactCopyToClipboard.CopyToClipboard, {
      text: "".concat(site.latitude, " ").concat(site.longitude)
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
    }, site.latitude, /*#__PURE__*/_react.default.createElement("br", null), site.longitude))), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 7,
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, "Domain"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2"
    }, "".concat(site.domainCode, " - ").concat(allDomains[site.domainCode].name)))), renderActions());
  };

  var renderSitesOverlay = function renderSitesOverlay() {
    var overlayName = _server.default.renderToStaticMarkup( /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'inline-flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/_react.default.createElement("div", null, "NEON Sites"), /*#__PURE__*/_react.default.createElement("div", {
      className: classes.startFlex
    }, /*#__PURE__*/_react.default.createElement("img", {
      alt: "Terrestrial Core",
      src: ICON_SVGS.CORE.TERRESTRIAL.BASE,
      className: classes.keySiteIcon
    }), /*#__PURE__*/_react.default.createElement("div", null, "Terrestrial Core")), /*#__PURE__*/_react.default.createElement("div", {
      className: classes.startFlex
    }, /*#__PURE__*/_react.default.createElement("img", {
      alt: "Terrestrial Relocatable",
      src: ICON_SVGS.RELOCATABLE.TERRESTRIAL.BASE,
      className: classes.keySiteIcon
    }), /*#__PURE__*/_react.default.createElement("div", null, "Terrestrial Relocatable")), /*#__PURE__*/_react.default.createElement("div", {
      className: classes.startFlex
    }, /*#__PURE__*/_react.default.createElement("img", {
      alt: "Aquatic Core",
      src: ICON_SVGS.CORE.AQUATIC.BASE,
      className: classes.keySiteIcon
    }), /*#__PURE__*/_react.default.createElement("div", null, "Aquatic Core")), /*#__PURE__*/_react.default.createElement("div", {
      className: classes.startFlex
    }, /*#__PURE__*/_react.default.createElement("img", {
      alt: "Aquatic Relocatable",
      src: ICON_SVGS.RELOCATABLE.AQUATIC.BASE,
      className: classes.keySiteIcon
    }), /*#__PURE__*/_react.default.createElement("div", null, "Aquatic Relocatable"))));

    return /*#__PURE__*/_react.default.createElement(Overlay, {
      name: overlayName,
      checked: state.sitesOverlay
    }, /*#__PURE__*/_react.default.createElement(_reactLeaflet.FeatureGroup, null, Object.keys(allSites).map(function (siteCode) {
      var site = allSites[siteCode];
      var isSelected = state.selectedSites.has(siteCode);

      if (!state.zoomedIcons[site.type] || !state.zoomedIcons[site.type][site.terrain] || !site.latitude || !site.longitude) {
        return null;
      }

      var interactionProps = mode === 'SELECT' ? {
        onMouseOver: function onMouseOver(e) {
          e.target.openPopup();
          positionPopup(e);
        },
        onMouseOut: function onMouseOut(e) {
          e.target.closePopup();
        },
        onClick: function onClick(e) {
          /* eslint-disable no-underscore-dangle */
          e.target._icon.className = getIconClassName(site.type, !isSelected);

          e.target._icon.blur();

          dispatch({
            type: 'toggleSiteSelected',
            site: siteCode
          });
          /* eslint-enable no-underscore-dangle */
        }
      } : {};
      return /*#__PURE__*/_react.default.createElement(_reactLeaflet.Marker, _extends({
        key: siteCode,
        position: [site.latitude, site.longitude],
        icon: state.zoomedIcons[site.type][site.terrain][isSelected ? 'SELECTED' : 'BASE']
      }, interactionProps), renderSitePopup(site));
    })));
  };

  var renderPopupSitesList = function renderPopupSitesList(sitesList) {
    if (!sitesList || !sitesList.size) {
      return /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle2",
        gutterBottom: true
      }, /*#__PURE__*/_react.default.createElement("i", null, "No NEON Sites"));
    }

    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2",
      gutterBottom: true
    }, "NEON Sites (".concat(sitesList.size, "):")), /*#__PURE__*/_react.default.createElement("div", null, _toConsumableArray(sitesList).map(function (siteCode) {
      var site = allSites[siteCode];
      var alt = "".concat(site.terrain, " ").concat(site.type);
      var selected = state.selectedSites.has(siteCode) ? 'SELECTED' : 'BASE';
      var src = ICON_SVGS[site.type][site.terrain][selected];
      return /*#__PURE__*/_react.default.createElement("div", {
        key: siteCode,
        style: {
          display: 'flex'
        }
      }, /*#__PURE__*/_react.default.createElement("img", {
        src: src,
        alt: alt,
        className: classes.popupSiteIcon
      }), /*#__PURE__*/_react.default.createElement("div", null, "".concat(site.description, " (").concat(siteCode, ")")));
    })));
  };
  /**
     Render US States
  */


  var renderStatePopup = function renderStatePopup(stateCode) {
    if (!allStates[stateCode] || !state.regionSitesDerived) {
      return null;
    }

    var renderActions = function renderActions() {
      var count = state.stateSites[stateCode].size;

      if (mode !== 'SELECT' || !count) {
        return null;
      }

      var isTotalSelected = state.selectedStates[stateCode] === 'total';
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
      autoPan: mode !== 'SELECT'
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
      gutterBottom: true
    }, "".concat(allStates[stateCode].name, " (").concat(stateCode, ")")), renderPopupSitesList(state.stateSites[stateCode]), renderActions());
  };

  var renderStatesOverlay = function renderStatesOverlay() {
    var overlayName = _server.default.renderToStaticMarkup( /*#__PURE__*/_react.default.createElement("div", {
      className: classes.startFlexInline
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.keySwatchStates
    }), /*#__PURE__*/_react.default.createElement("div", null, "US States")));

    return /*#__PURE__*/_react.default.createElement(Overlay, {
      name: overlayName,
      checked: state.statesOverlay
    }, /*#__PURE__*/_react.default.createElement(_reactLeaflet.FeatureGroup, null, _statesShapes.default.features.map(function (usState) {
      var stateCode = usState.properties.stateCode;
      var overlayColor = state.selectedStates[stateCode] ? "".concat(state.selectedStates[stateCode], "Selected") : 'states';
      /* eslint-disable no-underscore-dangle */

      var interactionProps = mode === 'SELECT' ? {
        onMouseOver: function onMouseOver(e) {
          e.target._path.setAttribute('stroke', rootOverlayColors.hover);

          e.target._path.setAttribute('fill', rootOverlayColors.hover);

          e.target.openPopup();
          positionPopup(e);
        },
        onMouseMove: function onMouseMove(e) {
          positionPopup(e);
        },
        onMouseOut: function onMouseOut(e) {
          e.target._path.setAttribute('stroke', rootOverlayColors[overlayColor]);

          e.target._path.setAttribute('fill', rootOverlayColors[overlayColor]);

          e.target.closePopup();
        },
        onClick: function onClick() {
          if (state.stateSites[stateCode].size) {
            dispatch({
              type: 'toggleStateSelected',
              stateCode: stateCode
            });
          }
        }
      } : {
        onMouseOver: function onMouseOver(e) {
          e.target._path.setAttribute('stroke', rootOverlayColors.hover);

          e.target._path.setAttribute('fill', rootOverlayColors.hover);
        },
        onMouseOut: function onMouseOut(e) {
          e.target._path.setAttribute('stroke', rootOverlayColors[overlayColor]);

          e.target._path.setAttribute('fill', rootOverlayColors[overlayColor]);
        }
      };
      /* eslint-enable no-underscore-dangle */

      return /*#__PURE__*/_react.default.createElement(_reactLeaflet.Polygon, _extends({
        key: usState.properties.stateCode,
        color: rootOverlayColors[overlayColor],
        positions: usState.geometry.coordinates
      }, interactionProps), renderStatePopup(usState.properties.stateCode));
    })));
  };
  /**
     Render Domains
  */


  var renderDomainPopup = function renderDomainPopup(domainCode) {
    if (!allDomains[domainCode] || !state.regionSitesDerived) {
      return null;
    }

    var renderActions = function renderActions() {
      var count = state.domainSites[domainCode].size;

      if (mode !== 'SELECT' || !count) {
        return null;
      }

      var isTotalSelected = state.selectedDomains[domainCode] === 'total';
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
      autoPan: mode !== 'SELECT'
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
      gutterBottom: true
    }, "".concat(allDomains[domainCode].name, " (").concat(domainCode, ")")), renderPopupSitesList(state.domainSites[domainCode]), renderActions());
  };

  var renderDomainsOverlay = function renderDomainsOverlay() {
    var overlayName = _server.default.renderToStaticMarkup( /*#__PURE__*/_react.default.createElement("div", {
      className: classes.startFlexInline
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.keySwatchDomains
    }), /*#__PURE__*/_react.default.createElement("div", null, "NEON Domains")));

    return /*#__PURE__*/_react.default.createElement(Overlay, {
      name: overlayName,
      checked: state.domainsOverlay
    }, /*#__PURE__*/_react.default.createElement(_reactLeaflet.FeatureGroup, null, _domainsShapes.default.features.map(function (domain) {
      var domainCode = domain.properties.domainCode;
      var overlayColor = state.selectedDomains[domainCode] ? "".concat(state.selectedDomains[domainCode], "Selected") : 'domains';
      /* eslint-disable no-underscore-dangle */

      var interactionProps = mode === 'SELECT' ? {
        onMouseOver: function onMouseOver(e) {
          e.target._path.setAttribute('stroke', rootOverlayColors.hover);

          e.target._path.setAttribute('fill', rootOverlayColors.hover);

          e.target.openPopup();
          positionPopup(e);
        },
        onMouseMove: function onMouseMove(e) {
          positionPopup(e);
        },
        onMouseOut: function onMouseOut(e) {
          e.target._path.setAttribute('stroke', rootOverlayColors[overlayColor]);

          e.target._path.setAttribute('fill', rootOverlayColors[overlayColor]);

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
          e.target._path.setAttribute('stroke', rootOverlayColors.hover);

          e.target._path.setAttribute('fill', rootOverlayColors.hover);
        },
        onMouseOut: function onMouseOut(e) {
          e.target._path.setAttribute('stroke', rootOverlayColors[overlayColor]);

          e.target._path.setAttribute('fill', rootOverlayColors[overlayColor]);
        }
      };
      /* eslint-enable no-underscore-dangle */

      return /*#__PURE__*/_react.default.createElement(_reactLeaflet.Polygon, _extends({
        key: domain.properties.domainCode,
        color: rootOverlayColors[overlayColor],
        positions: domain.geometry.coordinates
      }, interactionProps), renderDomainPopup(domain.properties.domainCode));
    })));
  };
  /**
     Render Tile Layers
  */


  var renderTileLayer = function renderTileLayer(key) {
    var tileLayer = TILE_LAYERS[key];

    var attributionNode = /*#__PURE__*/_react.default.createElement("div", {
      title: tileLayer.fullAttribution,
      className: classes.attribution
    }, tileLayer.shortAttribution);

    var attributionString = _server.default.renderToStaticMarkup(attributionNode);

    return /*#__PURE__*/_react.default.createElement(BaseLayer, {
      key: key,
      name: tileLayer.name,
      checked: key === state.tileLayer
    }, /*#__PURE__*/_react.default.createElement(_reactLeaflet.TileLayer, {
      key: key,
      url: tileLayer.url,
      attribution: attributionString
    }));
  };
  /**
     Render the Map
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

  return /*#__PURE__*/_react.default.createElement(_reactLeaflet.Map, {
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
    onBaseLayerChange: handleBaseLayerChange,
    worldCopyJump: true
  }, /*#__PURE__*/_react.default.createElement(_reactLeaflet.ScaleControl, {
    imperial: true,
    metric: true,
    updateWhenIdle: true
  }), /*#__PURE__*/_react.default.createElement(_reactLeaflet.LayersControl, {
    position: "topright"
  }, Object.keys(TILE_LAYERS).map(renderTileLayer), renderDomainsOverlay(), renderStatesOverlay(), renderSitesOverlay()));
};

SiteMap.propTypes = {
  aspectRatio: _propTypes.default.number,
  center: _propTypes.default.arrayOf(_propTypes.default.number),
  mode: _propTypes.default.oneOf(Object.keys(SITE_MAP_MODES)),
  zoom: _propTypes.default.number,
  tileLayer: _propTypes.default.oneOf(Object.keys(TILE_LAYERS))
};
SiteMap.defaultProps = {
  aspectRatio: 0.75,
  center: [52.68, -110.75],
  mode: 'EXPLORE',
  tileLayer: 'NatGeo_World_Map',
  zoom: null
};

var WrappedSiteMap = _Theme.default.getWrappedComponent(_NeonContext.default.getWrappedComponent(SiteMap));

var _default = WrappedSiteMap;
exports.default = _default;