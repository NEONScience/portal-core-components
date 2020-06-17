"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateLocationsInMap = exports.boundsAreValid = exports.getMapStateForFocusLocation = exports.getZoomedIcons = exports.parseLocationHierarchy = exports.parseLocationData = exports.getDynamicAspectRatio = exports.SITE_MAP_DEFAULT_PROPS = exports.SITE_MAP_PROP_TYPES = exports.hydrateNeonContextData = exports.DEFAULT_STATE = exports.TILE_LAYERS_BY_NAME = exports.TILE_LAYERS = exports.EXPLORE_DATA_PRODUCTS_URL_BASE = exports.SITE_DETAILS_URL_BASE = exports.calculateFeatureAvailability = exports.BOUNDARY_COLORS = exports.FEATURES = exports.PLOT_SAMPLING_MODULES = exports.FETCH_STATUS = exports.VIEWS = exports.HIGHLIGHT_STATUS = exports.SELECTION_STATUS = exports.SELECTION_PORTIONS = exports.SELECTABLE_FEATURE_TYPES = exports.FEATURE_DATA_LOAD_TYPES = exports.FEATURE_TYPES = exports.SORT_DIRECTIONS = exports.SITE_LOCATION_HIERARCHIES_MIN_ZOOM = exports.KM2_TO_ACRES = exports.MIN_TABLE_MAX_BODY_HEIGHT = exports.MAP_ZOOM_RANGE = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _leaflet = _interopRequireDefault(require("leaflet"));

var _Theme = require("../Theme/Theme");

var _iconPlaceholder = _interopRequireDefault(require("./svg/icon-placeholder.svg"));

var _iconShapeCircleShadow = _interopRequireDefault(require("./svg/icon-shape-circle-shadow.svg"));

var _iconShapeCircleSelect = _interopRequireDefault(require("./svg/icon-shape-circle-select.svg"));

var _iconShapeCircleHighlight = _interopRequireDefault(require("./svg/icon-shape-circle-highlight.svg"));

var _iconShapeDiamondShadow = _interopRequireDefault(require("./svg/icon-shape-diamond-shadow.svg"));

var _iconShapeDiamondSelect = _interopRequireDefault(require("./svg/icon-shape-diamond-select.svg"));

var _iconShapeDiamondHighlight = _interopRequireDefault(require("./svg/icon-shape-diamond-highlight.svg"));

var _iconShapeHomeplateShadow = _interopRequireDefault(require("./svg/icon-shape-homeplate-shadow.svg"));

var _iconShapeHomeplateSelect = _interopRequireDefault(require("./svg/icon-shape-homeplate-select.svg"));

var _iconShapeHomeplateHighlight = _interopRequireDefault(require("./svg/icon-shape-homeplate-highlight.svg"));

var _iconShapeSquareShadow = _interopRequireDefault(require("./svg/icon-shape-square-shadow.svg"));

var _iconShapeSquareSelect = _interopRequireDefault(require("./svg/icon-shape-square-select.svg"));

var _iconShapeSquareHighlight = _interopRequireDefault(require("./svg/icon-shape-square-highlight.svg"));

var _iconSiteCoreTerrestrial = _interopRequireDefault(require("./svg/icon-site-core-terrestrial.svg"));

var _iconSiteCoreTerrestrialSelected = _interopRequireDefault(require("./svg/icon-site-core-terrestrial-selected.svg"));

var _iconSiteCoreAquatic = _interopRequireDefault(require("./svg/icon-site-core-aquatic.svg"));

var _iconSiteCoreAquaticSelected = _interopRequireDefault(require("./svg/icon-site-core-aquatic-selected.svg"));

var _iconSiteRelocatableTerrestrial = _interopRequireDefault(require("./svg/icon-site-relocatable-terrestrial.svg"));

var _iconSiteRelocatableTerrestrialSelected = _interopRequireDefault(require("./svg/icon-site-relocatable-terrestrial-selected.svg"));

var _iconSiteRelocatableAquatic = _interopRequireDefault(require("./svg/icon-site-relocatable-aquatic.svg"));

var _iconSiteRelocatableAquaticSelected = _interopRequireDefault(require("./svg/icon-site-relocatable-aquatic-selected.svg"));

var _iconBenchmark = _interopRequireDefault(require("./svg/icon-benchmark.svg"));

var _iconBuoy = _interopRequireDefault(require("./svg/icon-buoy.svg"));

var _iconDischargePoint = _interopRequireDefault(require("./svg/icon-discharge-point.svg"));

var _iconDistributedBasePlot = _interopRequireDefault(require("./svg/icon-distributed-base-plot.svg"));

var _iconDistributedBirdGrid = _interopRequireDefault(require("./svg/icon-distributed-bird-grid.svg"));

var _iconDistributedMammalGrid = _interopRequireDefault(require("./svg/icon-distributed-mammal-grid.svg"));

var _iconDistributedMosquitoPoint = _interopRequireDefault(require("./svg/icon-distributed-mosquito-point.svg"));

var _iconDistributedTickPlot = _interopRequireDefault(require("./svg/icon-distributed-tick-plot.svg"));

var _iconFishPoint = _interopRequireDefault(require("./svg/icon-fish-point.svg"));

var _iconGroundwaterWell = _interopRequireDefault(require("./svg/icon-groundwater-well.svg"));

var _iconHut = _interopRequireDefault(require("./svg/icon-hut.svg"));

var _iconPourPoint = _interopRequireDefault(require("./svg/icon-pour-point.svg"));

var _iconMegapit = _interopRequireDefault(require("./svg/icon-megapit.svg"));

var _iconMeteorologicalStation = _interopRequireDefault(require("./svg/icon-meteorological-station.svg"));

var _iconPlantTransect = _interopRequireDefault(require("./svg/icon-plant-transect.svg"));

var _iconRiparianAssessment = _interopRequireDefault(require("./svg/icon-riparian-assessment.svg"));

var _iconSedimentPoint = _interopRequireDefault(require("./svg/icon-sediment-point.svg"));

var _iconSensorStation = _interopRequireDefault(require("./svg/icon-sensor-station.svg"));

var _iconStaffGauge = _interopRequireDefault(require("./svg/icon-staff-gauge.svg"));

var _iconTower = _interopRequireDefault(require("./svg/icon-tower.svg"));

var _iconTowerBasePlot = _interopRequireDefault(require("./svg/icon-tower-base-plot.svg"));

var _iconTowerPhenologyPlot = _interopRequireDefault(require("./svg/icon-tower-phenology-plot.svg"));

var _iconTowerSoilPlot = _interopRequireDefault(require("./svg/icon-tower-soil-plot.svg"));

var _iconWetDepositionPoint = _interopRequireDefault(require("./svg/icon-wet-deposition-point.svg"));

var _statesShapes = _interopRequireDefault(require("../../staticJSON/statesShapes.json"));

var _domainsShapes = _interopRequireDefault(require("../../staticJSON/domainsShapes.json"));

var _shadow, _shadow2, _shadow3, _shadow4, _availableFeatureType, _derived;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MAP_ZOOM_RANGE = [1, 19];
exports.MAP_ZOOM_RANGE = MAP_ZOOM_RANGE;
var MIN_TABLE_MAX_BODY_HEIGHT = 100; // export const MINIMUM_MAP_DIMENSIONS = { width: 300, height: 200 };

exports.MIN_TABLE_MAX_BODY_HEIGHT = MIN_TABLE_MAX_BODY_HEIGHT;
var KM2_TO_ACRES = 247.10538146717; // Minimum zoom level at which location hierarchy fetches are done on a per-domain basis
// We don't do per-site because hierarchy query performance is a function of number of immediate
// children. Domains top out at 8 or so sites, while sites may have over a hundred children (plots)
// Note that while we FETCH at the domain level we parse down to the site level as that's what's
// most useful for generating subsequent fetches

exports.KM2_TO_ACRES = KM2_TO_ACRES;
var SITE_LOCATION_HIERARCHIES_MIN_ZOOM = 9;
/**
   Key Sets
   Used to limit the use of "magic strings" that need to be consistent across many files
*/
// For consistency in expressing the sort direction for the table

exports.SITE_LOCATION_HIERARCHIES_MIN_ZOOM = SITE_LOCATION_HIERARCHIES_MIN_ZOOM;
var SORT_DIRECTIONS = {
  ASC: 'ASC',
  DESC: 'DESC'
}; // For consistency in differentiating discrete sets of data that can be tabulated together.
// e.g. all LOCATIONS type feature data can coexist in a single table view with a
// single column definition. But LOCATIONS and SITES shouldn't, as each set has
// different common attributes that should map to table columns (yes, sites are locations too,
// but we represent and interact with them differently... I think? Maybe?)

exports.SORT_DIRECTIONS = SORT_DIRECTIONS;
var FEATURE_TYPES = {
  SITES: 'SITES',
  SITE_LOCATION_HIERARCHIES: 'SITE_LOCATION_HIERARCHIES',
  LOCATIONS: 'LOCATIONS',
  SAMPLING_POINTS: 'SAMPLING_POINTS',
  BOUNDARIES: 'BOUNDARIES',
  GROUP: 'GROUP',
  OTHER: 'OTHER' // All features require a type. This catch-all type will not show in the table.

}; // For consistency in differentiating how feature data are loaded (e.g. by fetch or deferred import)

exports.FEATURE_TYPES = FEATURE_TYPES;
var FEATURE_DATA_LOAD_TYPES = {
  FETCH: 'FETCH',
  IMPORT: 'IMPORT',
  NEON_CONTEXT: 'NEON_CONTEXT'
}; // Subset of FEATURE_TYPES describing all features that are directly selectable

exports.FEATURE_DATA_LOAD_TYPES = FEATURE_DATA_LOAD_TYPES;

var SELECTABLE_FEATURE_TYPES = function (_ref) {
  var SITES = _ref.SITES;
  return {
    SITES: SITES
  };
}(FEATURE_TYPES); // For consistency in denoting whether all or some of a region's selectable children are selected


exports.SELECTABLE_FEATURE_TYPES = SELECTABLE_FEATURE_TYPES;
var SELECTION_PORTIONS = {
  PARTIAL: 'PARTIAL',
  TOTAL: 'TOTAL'
}; // For consistency in denoting the selection status of any selectable thing

exports.SELECTION_PORTIONS = SELECTION_PORTIONS;
var SELECTION_STATUS = {
  SELECTED: 'SELECTED',
  UNSELECTED: 'UNSELECTED'
}; // For consistency in denoting the highlight status of a marker

exports.SELECTION_STATUS = SELECTION_STATUS;
var HIGHLIGHT_STATUS = {
  NONE: 'NONE',
  HIGHLIGHT: 'HIGHLIGHT',
  SELECT: 'SELECT'
}; // For consistency in denoting which dinstinct user interfaces are available and which is visible

exports.HIGHLIGHT_STATUS = HIGHLIGHT_STATUS;
var VIEWS = {
  MAP: 'MAP',
  TABLE: 'TABLE'
}; // For consistency in tracking the current status of a fetch or import

exports.VIEWS = VIEWS;
var FETCH_STATUS = {
  AWAITING_CALL: 'AWAITING_CALL',
  FETCHING: 'FETCHING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS'
};
exports.FETCH_STATUS = FETCH_STATUS;
var PLOT_SAMPLING_MODULES = {
  bbc: 'Below Ground Biomass Coring',
  bet: 'Beetles',
  bgc: 'Biogeochemistry',
  brd: 'Birds',
  cdw: 'Coarse Downed Wood',
  cfc: 'Canopy Foliage Chemistry',
  dhp: 'Digital Hemispherical Photos for Leaf Area Index',
  div: 'Plant Diversity',
  hbp: 'Herbaceous Productivity',
  ltr: 'Litter and Fine Woody Debris',
  mam: 'Mammal Abundance and Diversity',
  mfb: 'MFB',
  // We don't know what this is...
  mos: 'Mosquitos',
  mpt: 'Mosquito Pathogens',
  phe: 'Plant Phenology',
  sme: 'Soil Microbes',
  tck: 'Ticks',
  vst: 'Vegetation Structure'
};
/**
   Icon SVGs
   An importable data structure containing all imported SVGs for map and legend icons
*/

exports.PLOT_SAMPLING_MODULES = PLOT_SAMPLING_MODULES;
var SELECTED_ICON_OFFSET = 30; // Number of pixels bigger in one dimension for selected icons

var LOCATION_ICON_SVG_SHAPES = {
  CIRCLE: {
    KEY: 'CIRCLE',
    iconSize: [80, 80],
    iconAnchor: [40, 40],
    popupAnchor: [0, -40],
    shadow: (_shadow = {}, _defineProperty(_shadow, HIGHLIGHT_STATUS.NONE, {
      svg: _iconShapeCircleShadow.default,
      size: [100, 100],
      anchor: [50, 50]
    }), _defineProperty(_shadow, HIGHLIGHT_STATUS.HIGHLIGHT, {
      svg: _iconShapeCircleHighlight.default,
      size: [120, 120],
      anchor: [60, 60]
    }), _defineProperty(_shadow, HIGHLIGHT_STATUS.SELECT, {
      svg: _iconShapeCircleSelect.default,
      size: [120, 120],
      anchor: [60, 60]
    }), _shadow)
  },
  DIAMOND: {
    KEY: 'DIAMOND',
    iconSize: [100, 100],
    iconAnchor: [50, 50],
    popupAnchor: [0, -50],
    shadow: (_shadow2 = {}, _defineProperty(_shadow2, HIGHLIGHT_STATUS.NONE, {
      svg: _iconShapeDiamondShadow.default,
      size: [124, 124],
      anchor: [62, 62]
    }), _defineProperty(_shadow2, HIGHLIGHT_STATUS.HIGHLIGHT, {
      svg: _iconShapeDiamondHighlight.default,
      size: [144, 144],
      anchor: [72, 72]
    }), _defineProperty(_shadow2, HIGHLIGHT_STATUS.SELECT, {
      svg: _iconShapeDiamondSelect.default,
      size: [144, 144],
      anchor: [72, 72]
    }), _shadow2)
  },
  HOMEPLATE: {
    KEY: 'HOMEPLATE',
    iconSize: [80, 90],
    iconAnchor: [40, 45],
    popupAnchor: [0, -45],
    shadow: (_shadow3 = {}, _defineProperty(_shadow3, HIGHLIGHT_STATUS.NONE, {
      svg: _iconShapeHomeplateShadow.default,
      size: [101, 111],
      anchor: [50.5, 55.5]
    }), _defineProperty(_shadow3, HIGHLIGHT_STATUS.HIGHLIGHT, {
      svg: _iconShapeHomeplateHighlight.default,
      size: [121, 131],
      anchor: [60.5, 65.5]
    }), _defineProperty(_shadow3, HIGHLIGHT_STATUS.SELECT, {
      svg: _iconShapeHomeplateSelect.default,
      size: [121, 131],
      anchor: [60.5, 65.5]
    }), _shadow3)
  },
  SQUARE: {
    KEY: 'SQUARE',
    iconSize: [75, 75],
    iconAnchor: [37.5, 37.5],
    popupAnchor: [0, -37.5],
    shadow: (_shadow4 = {}, _defineProperty(_shadow4, HIGHLIGHT_STATUS.NONE, {
      svg: _iconShapeSquareShadow.default,
      size: [94, 94],
      anchor: [47, 47]
    }), _defineProperty(_shadow4, HIGHLIGHT_STATUS.HIGHLIGHT, {
      svg: _iconShapeSquareHighlight.default,
      size: [114, 114],
      anchor: [57, 57]
    }), _defineProperty(_shadow4, HIGHLIGHT_STATUS.SELECT, {
      svg: _iconShapeSquareSelect.default,
      size: [114, 114],
      anchor: [57, 57]
    }), _shadow4)
  }
};
/**
   FEATURES
   A data structure describing all descrete boundaries or sets of icons that can be shown on the map
   Convention: all keys are consistently plural
   Order is draw order on map (so largest boundary features should be first)
*/

var FEATURES = {
  // States and Domains
  DOMAINS: {
    name: 'NEON Domains',
    nameSingular: 'NEON Domain',
    type: FEATURE_TYPES.BOUNDARIES,
    description: '',
    hideByDefault: true,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.NEON_CONTEXT,
    primaryIdOnly: true,
    featureShape: 'Polygon',
    style: {
      color: '#a067e4'
    }
  },
  STATES: {
    name: 'US States',
    nameSingular: 'US State',
    type: FEATURE_TYPES.BOUNDARIES,
    description: '',
    hideByDefault: true,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.NEON_CONTEXT,
    primaryIdOnly: true,
    featureShape: 'Polygon',
    style: {
      color: '#3cdd84'
    }
  },
  // Various Boundary Types
  FLIGHT_BOX_BOUNDARIES: {
    name: 'AOP Flight Box Boundaries',
    nameSingular: 'AOP Flight Box Boundary',
    type: FEATURE_TYPES.BOUNDARIES,
    minZoom: 8,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.IMPORT,
    description: '',
    featureShape: 'Polygon',
    style: {
      color: '#f0ee75',
      dashArray: '5, 10'
    }
  },
  // AQUATIC_WATERSHEDS Group
  AQUATIC_WATERSHEDS: {
    name: 'Watersheds',
    type: FEATURE_TYPES.GROUP,
    minZoom: 6,
    description: ''
  },
  WATERSHED_BOUNDARIES: {
    name: 'Watershed Boundaries',
    nameSingular: 'Watershed Boundary',
    type: FEATURE_TYPES.BOUNDARIES,
    minZoom: 10,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.IMPORT,
    description: '',
    parent: 'AQUATIC_WATERSHEDS',
    featureShape: 'Polygon',
    style: {
      color: '#669199',
      dashArray: '5, 10'
    }
  },
  DRAINAGE_LINES: {
    name: 'Drainage Lines',
    type: FEATURE_TYPES.OTHER,
    minZoom: 8,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.IMPORT,
    description: '',
    parent: 'AQUATIC_WATERSHEDS',
    featureShape: 'Polyline',
    style: {
      color: '#365d63'
    }
  },
  POUR_POINTS: {
    name: 'Pour Points',
    nameSingular: 'Pour Point',
    type: FEATURE_TYPES.OTHER,
    minZoom: 7,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.IMPORT,
    description: '',
    parent: 'AQUATIC_WATERSHEDS',
    iconSvg: _iconPourPoint.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.HOMEPLATE.KEY
  },
  SAMPLING_BOUNDARIES: {
    name: 'Site Sampling Boundaries',
    nameSingular: 'Site Sampling Boundary',
    type: FEATURE_TYPES.BOUNDARIES,
    minZoom: 8,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.IMPORT,
    description: 'Terrestrial and Colocated Aquatic Sites',
    parent: 'TERRESTRIAL_SITE_FEATURES',
    featureShape: 'Polygon',
    style: {
      color: '#e8847d',
      dashArray: '5, 10, 2.5, 10'
    }
  },
  AQUATIC_REACHES: {
    name: 'Aquatic Site Reaches',
    nameSingular: 'Aquatic Site Reach',
    type: FEATURE_TYPES.BOUNDARIES,
    minZoom: 9,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.IMPORT,
    description: '',
    parent: 'AQUATIC_SITE_FEATURES',
    featureShape: 'Polygon',
    style: {
      color: '#ad85a0',
      dashArray: '5, 10, 2.5, 10'
    }
  },
  TOWER_AIRSHEDS: {
    name: 'Tower Airshed Boundaries',
    nameSingular: 'Tower Airshed Boundary',
    type: FEATURE_TYPES.BOUNDARIES,
    minZoom: 10,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.IMPORT,
    description: '',
    parent: 'TERRESTRIAL_SITE_FEATURES',
    featureShape: 'Polygon',
    style: {
      color: '#749966',
      dashArray: '5, 10, 2.5, 10'
    }
  },
  // Terrestrial Site Features
  TERRESTRIAL_SITE_FEATURES: {
    name: 'Terrestrial Site Features',
    type: FEATURE_TYPES.GROUP,
    minZoom: 10,
    description: '',
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'OS Plot - all',
    // Fetches for TOWER_BASE_PLOTS and DISTRIBUTED_BASE_PLOTS
    fetchingForFeatures: ['TOWER_BASE_PLOTS', 'DISTRIBUTED_BASE_PLOTS']
  },
  TOWERS: {
    name: 'Tower Locations',
    nameSingular: 'Tower Location',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 10,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'TOWER',
    description: '',
    parent: 'TERRESTRIAL_SITE_FEATURES',
    iconScale: 1.8,
    iconSvg: _iconTower.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.DIAMOND.KEY
  },
  HUTS: {
    name: 'Huts',
    nameSingular: 'Hut',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 10,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'HUT',
    description: '',
    parent: 'TERRESTRIAL_SITE_FEATURES',
    iconScale: 1.4,
    iconSvg: _iconHut.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.DIAMOND.KEY
  },
  MEGAPITS: {
    name: 'Megapits',
    nameSingular: 'Megapit',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 10,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'MEGAPIT',
    description: '',
    parent: 'TERRESTRIAL_SITE_FEATURES',
    iconScale: 1.8,
    iconSvg: _iconMegapit.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.DIAMOND.KEY
  },
  // TOWER_PLOTS Group
  TOWER_PLOTS: {
    name: 'Tower Plots',
    type: FEATURE_TYPES.GROUP,
    minZoom: 13,
    description: 'Tower plots provide a direct link between NEON’s Terrestrial Observation System and Terrestrial Instrument System. Tower Plots are located in and around the NEON tower primary and secondary airsheds.',
    parent: 'TERRESTRIAL_SITE_FEATURES'
  },
  TOWER_PHENOLOGY_PLOTS: {
    name: 'Tower Phenology Plots',
    nameSingular: 'Tower Phenology Plot',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'Plant phenology observations are made along a transect loop or plot in or around the primary airshed. When possible, one plot is established north of the tower to calibrate phenology camera images captured from sensors on the tower. If there is insufficient space north of the tower for a 200m x 200m plot or if the vegetation does not match the primary airshed an additional plot is established.',
    parent: 'TOWER_PLOTS',
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'OS Plot - phe',
    focusZoom: 16,
    iconScale: 1.5,
    iconSvg: _iconTowerPhenologyPlot.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY
  },
  TOWER_BASE_PLOTS: {
    // Fetched by parent since tower base plots share type
    name: 'Tower Base Plots',
    nameSingular: 'Tower Base Plot',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'Tower plots support a variety of plant productivity, plant diversity, soil, biogeochemistry and microbe sampling. The number and size of Tower Base Plots is determined by the vegetation of the tower airshed. In forested sites, twenty 40m x 40m plots are established. In herbaceous sites, thirty 20m x 20m plots are established. Of these thirty tower plots, four have additional space to support soil sampling.',
    parent: 'TOWER_PLOTS',
    focusZoom: 18,
    iconSvg: _iconTowerBasePlot.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY
  },
  TOWER_SOIL_PLOTS: {
    name: 'Tower Soil Plots',
    nameSingular: 'Tower Soil Plot',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 10,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'SOIL_PLOT',
    description: '',
    parent: 'TOWER_PLOTS',
    focusZoom: 18,
    iconSvg: _iconTowerSoilPlot.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY
  },
  // DISTRIBUTED_PLOTS Group
  DISTRIBUTED_PLOTS: {
    name: 'Distributed Plots',
    type: FEATURE_TYPES.GROUP,
    minZoom: 10,
    description: 'Distributed Plots are located throughout the TOS Sampling boundary in an effort to describe organisms and process with plot, point, and grid sampling. Plots were established according to a stratified-random and spatially balanced design.',
    parent: 'TERRESTRIAL_SITE_FEATURES'
  },
  DISTRIBUTED_BIRD_GRIDS: {
    name: 'Distributed Bird Grids',
    nameSingular: 'Distributed Bird Grid',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'Bird Grids consist of 9 sampling points within a 500m x 500m square. Each point is 250m apart. Where possible, Bird Grids are colocated with Distributed Base Plots by placing the Bird Grid center (B2) in close proximity to the center of the Base Plot. At smaller sites, a single point count is done at the south-west corner (point 21) of the Distributed Base Plot.',
    parent: 'DISTRIBUTED_PLOTS',
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'OS Plot - brd',
    iconScale: 1.8,
    focusZoom: 16,
    iconSvg: _iconDistributedBirdGrid.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY
  },
  DISTRIBUTED_MAMMAL_GRIDS: {
    name: 'Distributed Mammal Grids',
    nameSingular: 'Distributed Mammal Grid',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'Mammal Grids are 90m x 90m and include 100 trapping locations at 10m spacing. Where possible, these grids are colocated with Distributed Base Plots by placing them a specified distance (150m +/- 50m) and random direction from the center of the Base Plot.',
    parent: 'DISTRIBUTED_PLOTS',
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'OS Plot - mam',
    iconScale: 1.4,
    focusZoom: 17,
    iconSvg: _iconDistributedMammalGrid.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY
  },
  DISTRIBUTED_BASE_PLOTS: {
    // Fetched by parent since tower base plots share type
    name: 'Distributed Base Plots',
    nameSingular: 'Distributed Base Plot',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'Distributed Base Plots support a variety of plant productivity, plant diversity, soil, biogeochemistry, microbe and beetle sampling. Distributed Base Plots are 40m x 40m.',
    parent: 'DISTRIBUTED_PLOTS',
    iconScale: 1.2,
    focusZoom: 17,
    iconSvg: _iconDistributedBasePlot.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY
  },
  DISTRIBUTED_TICK_PLOTS: {
    name: 'Distributed Tick Plots',
    nameSingular: 'Distributed Tick Plot',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'Tick Plots are sampled by conducting cloth dragging or flagging around the perimeter of a 40m x 40m plot. Tick plots are colocated with Distributed Base Plots by placing them a specified distance (150m +/- 15m) and random direction from the center of the Base Plot.',
    parent: 'DISTRIBUTED_PLOTS',
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'OS Plot - tck',
    iconScale: 1.2,
    focusZoom: 17,
    iconSvg: _iconDistributedTickPlot.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY
  },
  DISTRIBUTED_MOSQUITO_POINTS: {
    name: 'Distributed Mosquito Points',
    nameSingular: 'Distributed Mosquito Point',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'At each Mosquito Point, one CO2 trap is established. Due to the frequency of sampling and temporal sampling constraints, Mosquito Points are located within 45m of roads.',
    parent: 'DISTRIBUTED_PLOTS',
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'OS Plot - mos',
    iconSvg: _iconDistributedMosquitoPoint.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    focusZoom: 18
  },
  // Plots Sampling Points Group
  PLOT_DETAIL_POINTS: {
    name: 'Plot Detail Points',
    type: FEATURE_TYPES.GROUP,
    minZoom: 14,
    description: 'Both distributed and tower plots may be composed of discrete sampling or transect loop points. When available, these points may appear on the map in addition to the plot marker icon.',
    parent: 'TERRESTRIAL_SITE_FEATURES'
  },
  TOWER_PHENOLOGY_PLOT_POINTS: {
    name: 'Phenology Plot Transect Points',
    nameSingular: 'Phenology Plot Transect Point',
    type: FEATURE_TYPES.SAMPLING_POINTS,
    description: 'Plant phenology observations are made along a transect loop or plot in or around the primary airshed. When possible, one plot is established north of the tower to calibrate phenology camera images captured from sensors on the tower. If there is insufficient space north of the tower for a 200m x 200m plot or if the vegetation does not match the primary airshed an additional plot is established.',
    parent: 'PLOT_DETAIL_POINTS',
    parentDataFeatureKey: 'TOWER_PHENOLOGY_PLOTS',
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    minZoom: 15,
    featureShape: 'Circle',
    style: {
      color: '#59a14f'
    }
  },
  DISTRIBUTED_BIRD_GRID_POINTS: {
    name: 'Bird Grid Sampling Points',
    nameSingular: 'Bird Grid Sampling Point',
    type: FEATURE_TYPES.SAMPLING_POINTS,
    description: 'Bird Grids consist of 9 sampling points within a 500m x 500m square. Each point is 250m apart. Where possible, Bird Grids are colocated with Distributed Base Plots by placing the Bird Grid center (B2) in close proximity to the center of the Base Plot. At smaller sites, a single point count is done at the south-west corner (point 21) of the Distributed Base Plot.',
    parent: 'PLOT_DETAIL_POINTS',
    parentDataFeatureKey: 'DISTRIBUTED_BIRD_GRIDS',
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    minZoom: 14,
    featureShape: 'Circle',
    style: {
      color: '#f28e2c'
    }
  },
  DISTRIBUTED_MAMMAL_GRID_POINTS: {
    name: 'Mammal Grid Sampling Points',
    nameSingular: 'Mammal Grid Sampling Point',
    type: FEATURE_TYPES.SAMPLING_POINTS,
    description: 'Mammal Grids are 90m x 90m and include 100 trapping locations at 10m spacing. Where possible, these grids are colocated with Distributed Base Plots by placing them a specified distance (150m +/- 50m) and random direction from the center of the Base Plot.',
    parent: 'PLOT_DETAIL_POINTS',
    parentDataFeatureKey: 'DISTRIBUTED_MAMMAL_GRIDS',
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    minZoom: 16,
    featureShape: 'Circle',
    style: {
      color: '#925214'
    }
  },
  DISTRIBUTED_TICK_PLOT_POINTS: {
    name: 'Tick Plot Sampling Points',
    nameSingular: 'Tick Plot Sampling Point',
    type: FEATURE_TYPES.SAMPLING_POINTS,
    description: 'Tick Plots are sampled by conducting cloth dragging or flagging around the perimeter of a 40m x 40m plot. Tick plots are colocated with Distributed Base Plots by placing them a specified distance (150m +/- 15m) and random direction from the center of the Base Plot.',
    parent: 'PLOT_DETAIL_POINTS',
    parentDataFeatureKey: 'DISTRIBUTED_TICK_PLOTS',
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    minZoom: 17,
    featureShape: 'Circle',
    style: {
      color: '#6b191a'
    }
  },
  // Aquatic Site Features
  AQUATIC_SITE_FEATURES: {
    name: 'Aquatic Site Features',
    type: FEATURE_TYPES.GROUP,
    minZoom: 14,
    description: ''
  },
  AQUATIC_BENCHMARKS: {
    name: 'Benchmarks',
    nameSingular: 'Benchmark',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 10,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'AOS benchmark named location type',
    description: '',
    parent: 'AQUATIC_SITE_FEATURES',
    iconScale: 1.3,
    iconSvg: _iconBenchmark.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.DIAMOND.KEY
  },
  AQUATIC_AUTOMATED_INSTRUMENTS: {
    name: 'Automated Instuments',
    type: FEATURE_TYPES.GROUP,
    minZoom: 10,
    description: '',
    parent: 'AQUATIC_SITE_FEATURES'
  },
  AQUATIC_OBSERVATIONAL_SAMPLING: {
    name: 'Observational Sampling',
    type: FEATURE_TYPES.GROUP,
    minZoom: 11,
    description: '',
    parent: 'AQUATIC_SITE_FEATURES'
  },
  AQUATIC_RIPARIAN_ASSESSMENTS: {
    name: 'Riparian Assessments',
    nameSingular: 'Riparian Assessment',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 11,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'AOS riparian named location type',
    description: 'Number of locations for assessment of riparian vegetation composition and physical structure vary by site type. Lakes and non-wadeable rivers have ten locations. Wadeable streams have 20 locations and also include assessment of riparian vegetation percent cover in wadeable streams.',
    parent: 'AQUATIC_OBSERVATIONAL_SAMPLING',
    iconSvg: _iconRiparianAssessment.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY
  },
  AQUATIC_WET_DEPOSITION_POINTS: {
    name: 'Wet Deposition Points',
    nameSingular: 'Wet Deposition Point',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 11,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'AOS wet deposition named location type',
    description: '',
    parent: 'AQUATIC_OBSERVATIONAL_SAMPLING',
    iconScale: 1.2,
    iconSvg: _iconWetDepositionPoint.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY
  },
  AQUATIC_GROUNDWATER_WELLS: {
    name: 'Groundwater Wells',
    nameSingular: 'Groundwater Well',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 11,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'GROUNDWATER_WELL',
    description: 'Each site has up to eight groundwater wells outfitted with sensors that measure high temporal resolution groundwater elevation (pressure transducer-based), temperature, and specific conductance.',
    parent: 'AQUATIC_AUTOMATED_INSTRUMENTS',
    iconScale: 1.2,
    iconSvg: _iconGroundwaterWell.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY
  },
  AQUATIC_METEOROLOGICAL_STATIONS: {
    name: 'Meteorological Stations',
    nameSingular: 'Meteorological Station',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 10,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'MET_STATION',
    description: 'A meteorological station is located on the shore of most aquatic sites and collects data comparable with flux tower measurements at terrestrial sites. Lake and wadeable rivers also have an above water met. station on buoy. These data are unique with different sensors and data frequencies due to power and data storage constraints.',
    parent: 'AQUATIC_AUTOMATED_INSTRUMENTS',
    iconScale: 1.5,
    iconSvg: _iconMeteorologicalStation.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY
  },
  AQUATIC_DISCHARGE_POINTS: {
    name: 'Discharge Points',
    nameSingular: 'Discharge Point',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 11,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'AOS discharge named location type',
    description: '',
    parent: 'AQUATIC_OBSERVATIONAL_SAMPLING',
    iconSvg: _iconDischargePoint.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY
  },
  AQUATIC_FISH_POINTS: {
    name: 'Fish Points',
    nameSingular: 'Fish Point',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 11,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'AOS fish named location type',
    description: '',
    parent: 'AQUATIC_OBSERVATIONAL_SAMPLING',
    iconSvg: _iconFishPoint.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY
  },
  AQUATIC_PLANT_TRANSECTS: {
    name: 'Plant Transects',
    nameSingular: 'Plant Transect',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 11,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'AOS plant named location type',
    description: '',
    parent: 'AQUATIC_OBSERVATIONAL_SAMPLING',
    iconScale: 1.3,
    iconSvg: _iconPlantTransect.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY
  },
  AQUATIC_SEDIMENT_POINTS: {
    name: 'Sediment Points',
    nameSingular: 'Sediment Point',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 11,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'AOS sediment named location type',
    description: '',
    parent: 'AQUATIC_OBSERVATIONAL_SAMPLING',
    iconSvg: _iconSedimentPoint.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY
  },
  AQUATIC_STAFF_GAUGES: {
    name: 'Staff Gauges',
    nameSingular: 'Staff Gauge',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 11,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'STAFF_GAUGE',
    description: 'The staff gauge measures gauge height, in meters, measured at lakes, wadeable rivers and non-wadeable streams. A phenocam is installed near most gauges. It collects RGB and IR images of the lake, river, or stream vegetation, stream surface, and stream gauge every 15 minutes.',
    parent: 'AQUATIC_AUTOMATED_INSTRUMENTS',
    iconSvg: _iconStaffGauge.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY
  },
  AQUATIC_SENSOR_STATIONS: {
    name: 'Sensor Stations',
    nameSingular: 'Sensor Station',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 10,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: /^(S1|S2|INLET|OUTLET)_LOC$/,
    description: 'Wadeable streams have a sensor station near the top of the reach and the bottom of the reach; non-wadeable rivers have a sensor station on a buoy and one near the bank; Lakes have an inlet sensor station, an outlet sensor station and a sensor station on a buoy. Data collection varies by type of sensor station.',
    parent: 'AQUATIC_AUTOMATED_INSTRUMENTS',
    iconScale: 1.1,
    iconSvg: _iconSensorStation.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY
  },
  AQUATIC_BUOYS: {
    name: 'Buoys',
    nameSingular: 'Buoy',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 10,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'BUOY',
    description: '',
    parent: 'AQUATIC_AUTOMATED_INSTRUMENTS',
    iconScale: 1.2,
    iconSvg: _iconBuoy.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY
  },
  // SITE_MARKERS Group
  SITE_MARKERS: {
    name: 'NEON Site Markers',
    type: FEATURE_TYPES.GROUP,
    description: '',
    maxZoom: 9
  },
  TERRESTRIAL_CORE_SITES: {
    name: 'Terrestrial Core Sites',
    nameSingular: 'Terrestrial Core Site',
    type: FEATURE_TYPES.SITES,
    description: 'Land-based; fixed location',
    parent: 'SITE_MARKERS',
    attributes: {
      type: 'CORE',
      terrain: 'TERRESTRIAL'
    },
    dataLoadType: FEATURE_DATA_LOAD_TYPES.NEON_CONTEXT,
    primaryIdOnly: true,
    iconScale: 1,
    iconSvg: _iconSiteCoreTerrestrial.default,
    iconSelectedSvg: _iconSiteCoreTerrestrialSelected.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY
  },
  TERRESTRIAL_RELOCATABLE_SITES: {
    name: 'Terrestrial Relocatable Sites',
    nameSingular: 'Terrestrial Relocatable Site',
    type: FEATURE_TYPES.SITES,
    description: 'Land-based; location may change',
    parent: 'SITE_MARKERS',
    attributes: {
      type: 'RELOCATABLE',
      terrain: 'TERRESTRIAL'
    },
    dataLoadType: FEATURE_DATA_LOAD_TYPES.NEON_CONTEXT,
    primaryIdOnly: true,
    iconScale: 1,
    iconSvg: _iconSiteRelocatableTerrestrial.default,
    iconSelectedSvg: _iconSiteRelocatableTerrestrialSelected.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY
  },
  AQUATIC_CORE_SITES: {
    name: 'Aquatic Core Sites',
    nameSingular: 'Aquatic Core Site',
    type: FEATURE_TYPES.SITES,
    description: 'Water-based; fixed location',
    parent: 'SITE_MARKERS',
    attributes: {
      type: 'CORE',
      terrain: 'AQUATIC'
    },
    dataLoadType: FEATURE_DATA_LOAD_TYPES.NEON_CONTEXT,
    primaryIdOnly: true,
    iconScale: 1,
    iconSvg: _iconSiteCoreAquatic.default,
    iconSelectedSvg: _iconSiteCoreAquaticSelected.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY
  },
  AQUATIC_RELOCATABLE_SITES: {
    name: 'Aquatic Relocatable Sites',
    nameSingular: 'Aquatic Relocatable Site',
    type: FEATURE_TYPES.SITES,
    description: 'Water-based; location may change',
    parent: 'SITE_MARKERS',
    attributes: {
      type: 'RELOCATABLE',
      terrain: 'AQUATIC'
    },
    dataLoadType: FEATURE_DATA_LOAD_TYPES.NEON_CONTEXT,
    primaryIdOnly: true,
    iconScale: 1,
    iconSvg: _iconSiteRelocatableAquatic.default,
    iconSelectedSvg: _iconSiteRelocatableAquaticSelected.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY
  }
}; // Replicate keys as attributes to completely eliminate the need to write a feature key string

exports.FEATURES = FEATURES;
Object.keys(FEATURES).forEach(function (key) {
  FEATURES[key].KEY = key;
}); // Common colors for selecatble boundary features

var BOUNDARY_COLORS = {
  partialSelected: _Theme.COLORS.SECONDARY_BLUE[300],
  totalSelected: _Theme.COLORS.SECONDARY_BLUE[500],
  hover: _Theme.COLORS.SECONDARY_BLUE[100]
};
exports.BOUNDARY_COLORS = BOUNDARY_COLORS;

var calculateFeatureAvailability = function calculateFeatureAvailability(state) {
  var featureIsAvailable = function featureIsAvailable(feature) {
    // Parent must be available (if the feature has a parent)
    if (typeof feature.parent === 'string' && !featureIsAvailable(FEATURES[feature.parent])) {
      return false;
    }

    var hasMinZoom = typeof feature.minZoom === 'number';
    var hasMaxZoom = typeof feature.maxZoom === 'number'; // If zoom is not set then show all features that don't have a min zoom
    // We don't care about a maxZoom here because null zoom effectively means zoomed all the way out

    if (state.map.zoom === null) {
      return !hasMinZoom;
    }

    return (!hasMinZoom || state.map.zoom >= feature.minZoom) && (!hasMaxZoom || state.map.zoom <= feature.maxZoom);
  };

  var newState = _extends(_extends({}, state), {}, {
    filters: _extends(_extends({}, state.filters), {}, {
      features: _extends(_extends({}, state.filters.features), {}, {
        available: Object.fromEntries(Object.entries(FEATURES).map(function (entry) {
          return [entry[0], featureIsAvailable(entry[1])];
        }))
      })
    })
  }); // Update table focus to reflect availability if need be


  Object.keys(state.table.availableFeatureTypes).forEach(function (featureType) {
    newState.table.availableFeatureTypes[featureType] = Object.keys(FEATURES).filter(function (featureKey) {
      return FEATURES[featureKey].type === featureType;
    }).some(function (featureKey) {
      return newState.filters.features.available[featureKey];
    });
  });

  if (!newState.table.availableFeatureTypes[newState.table.focus]) {
    var available = Object.keys(newState.table.availableFeatureTypes).filter(function (k) {
      return newState.table.availableFeatureTypes[k];
    });
    newState.table.focus = available[0] || state.table.focus;
  }

  return newState;
};
/**
   URL Bases
   Used in construction of URLs when linking out to other pages
*/


exports.calculateFeatureAvailability = calculateFeatureAvailability;
var SITE_DETAILS_URL_BASE = 'https://www.neonscience.org/field-sites/field-sites-map/';
exports.SITE_DETAILS_URL_BASE = SITE_DETAILS_URL_BASE;
var EXPLORE_DATA_PRODUCTS_URL_BASE = 'https://data.neonscience.org/data-products/explore?site=';
/**
 Tile Layers
 Third party services providing tiles for different earth views (topographic, satellite, etc.)
 with attributions
*/

exports.EXPLORE_DATA_PRODUCTS_URL_BASE = EXPLORE_DATA_PRODUCTS_URL_BASE;
var TILE_LAYERS = {
  NATGEO_WORLD_MAP: {
    KEY: 'NATGEO_WORLD_MAP',
    name: 'National Geographic',
    shortAttribution: '© Natl. Geographic et al.',
    fullAttribution: '© National Geographic, Esri, Garmin, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}'
  },
  WORLD_IMAGERY: {
    KEY: 'WORLD_IMAGERY',
    name: 'Satellite Imagery',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  },
  WORLD_STREET_MAP: {
    KEY: 'WORLD_STREET_MAP',
    name: 'Streets',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, OSM contributors, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
  },
  WORLD_TOPO_MAP: {
    KEY: 'WORLD_TOPO_MAP',
    name: 'Topographic',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, HERE, Garmin, Intermap, iPC, GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), OSM contributors, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
  }
};
exports.TILE_LAYERS = TILE_LAYERS;
var TILE_LAYERS_BY_NAME = {};
exports.TILE_LAYERS_BY_NAME = TILE_LAYERS_BY_NAME;
Object.keys(TILE_LAYERS).forEach(function (key) {
  TILE_LAYERS_BY_NAME[TILE_LAYERS[key].name] = key;
});
/**
   Filters
*/

/**
   Default State
*/

var featureIsHiddenByDefault = function featureIsHiddenByDefault(key) {
  var hidden = FEATURES[key].hideByDefault;

  if (FEATURES[key].parent && !hidden) {
    hidden = featureIsHiddenByDefault(FEATURES[key].parent);
  }

  return hidden;
};

var DEFAULT_STATE = {
  view: {
    current: null,
    initialized: Object.fromEntries(Object.keys(VIEWS).map(function (view) {
      return [view, false];
    }))
  },
  neonContextHydrated: false,
  // Whether NeonContext data has been one-time hydrated into state
  overallFetch: {
    // Aggregation of all current fetch statuses for the SiteMap component
    expected: 0,
    completed: 0,
    pendingHierarchy: 0 // In-progress hierarchy fetches (ones that will spawn more fetches)

  },
  focusLocation: {
    current: null,
    isCenteredOn: false,
    // Whether the map is still centered on and zoomed into focus location
    data: null,
    fetch: {
      status: null,
      error: null
    }
  },
  aspectRatio: {
    currentValue: null,
    // Aspect ratio of the Site Map component content area (table and/or map)
    isDynamic: true,
    // Whether currentValue should set itself dynamically from viewport size
    resizeEventListenerInitialized: false,
    widthReference: 0 // Width of content area we can combine with currentValue to get dimensions

  },
  table: {
    // Settings that ONLY apply to the table
    focus: FEATURE_TYPES.SITES,
    availableFeatureTypes: (_availableFeatureType = {}, _defineProperty(_availableFeatureType, FEATURE_TYPES.SITES, false), _defineProperty(_availableFeatureType, FEATURE_TYPES.LOCATIONS, false), _availableFeatureType),
    maxBodyHeight: null,
    // A way for the SiteMapContainer resizeHandler to inform the SiteMapTable to recalc body height
    maxBodyHeightUpdateFromAspectRatio: false
  },
  map: {
    // Settings that ONLY apply to the map
    zoom: null,
    center: [],
    bounds: null,
    tileLayer: null,
    tileLayerAutoChangedAbove17: false,
    zoomedIcons: {},
    repositionOpenPopupFunc: null
  },
  selection: {
    active: null,
    // Set to any key in SELECTABLE_FEATURE_TYPES
    maxSelectable: 0,
    // 0 is interpreted as unlimited, all other values are discrete limits
    derived: (_derived = {}, _defineProperty(_derived, FEATURES.STATES.KEY, {}), _defineProperty(_derived, FEATURES.DOMAINS.KEY, {}), _derived)
  },
  featureDataFetchesHasAwaiting: false,
  // Boolean: track whether any data fetches are awaiting call
  featureDataFetches: Object.fromEntries(Object.keys(FEATURE_TYPES).map(function (featureType) {
    return [featureType, {}];
  })),
  featureData: Object.fromEntries(Object.keys(FEATURE_TYPES).map(function (featureType) {
    return [featureType, {}];
  })),
  sites: {},
  // Sites data is split into 4 features making it hard to look up, so extra refs here
  filters: {
    position: null,
    search: null,
    features: {
      open: false,
      // whether the features pane is open/visible
      available: {},
      visible: Object.fromEntries( // key/bool map of which available features are visible
      Object.keys(FEATURES).map(function (key) {
        return [key, !featureIsHiddenByDefault(key)];
      })),
      collapsed: new Set()
    }
  }
}; // Initialize featureData and featureDataFetches objects for all features that have a dataLoadType

exports.DEFAULT_STATE = DEFAULT_STATE;
Object.keys(FEATURES).filter(function (featureKey) {
  return Object.keys(FEATURE_DATA_LOAD_TYPES).includes(FEATURES[featureKey].dataLoadType);
}).forEach(function (featureKey) {
  var _FEATURES$featureKey = FEATURES[featureKey],
      featureType = _FEATURES$featureKey.type,
      dataLoadType = _FEATURES$featureKey.dataLoadType;
  DEFAULT_STATE.featureData[featureType][featureKey] = {};

  if (dataLoadType !== FEATURE_DATA_LOAD_TYPES.NEON_CONTEXT) {
    DEFAULT_STATE.featureDataFetches[featureType][featureKey] = {};
  }
}); // Initialize all selectable features in selection state

Object.keys(SELECTABLE_FEATURE_TYPES).forEach(function (selection) {
  DEFAULT_STATE.selection[selection] = new Set();
}); // Initialize feature availability

var availabilityState = calculateFeatureAvailability(DEFAULT_STATE);
DEFAULT_STATE.filters.features.available = _extends({}, availabilityState.filters.features.available); // Populate static JSON featureData
// States

if (_statesShapes.default) {
  _statesShapes.default.features.forEach(function (feature) {
    if (!feature.properties || !feature.properties.stateCode) {
      return;
    }

    var stateCode = feature.properties.stateCode;
    DEFAULT_STATE.featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.STATES.KEY][stateCode] = {
      geometry: feature.geometry,
      sites: new Set()
    };
  });
} // Domains


if (_domainsShapes.default) {
  _domainsShapes.default.features.forEach(function (feature) {
    if (!feature.properties || !feature.properties.domainCode) {
      return;
    }

    var domainCode = feature.properties.domainCode;
    DEFAULT_STATE.featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.DOMAINS.KEY][domainCode] = {
      geometry: feature.geometry,
      sites: new Set()
    };
  });
}

var hydrateNeonContextData = function hydrateNeonContextData(state, neonContextData) {
  var newState = _extends(_extends({}, state), {}, {
    neonContextHydrated: true
  }); // Sites


  Object.keys(neonContextData.sites).forEach(function (siteCode) {
    newState.sites[siteCode] = _extends({}, neonContextData.sites[siteCode]);
    var featureKey = Object.keys(FEATURES).filter(function (key) {
      return FEATURES[key].type === FEATURE_TYPES.SITES;
    }).find(function (key) {
      return FEATURES[key].attributes.type === neonContextData.sites[siteCode].type && FEATURES[key].attributes.terrain === neonContextData.sites[siteCode].terrain;
    }) || null;

    if (featureKey !== null) {
      newState.featureData[FEATURE_TYPES.SITES][featureKey][siteCode] = newState.sites[siteCode];
    }
  }); // States

  Object.keys(neonContextData.states).forEach(function (stateCode) {
    newState.featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.STATES.KEY][stateCode] = _extends(_extends(_extends({}, newState.featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.STATES.KEY][stateCode]), neonContextData.states[stateCode]), {}, {
      sites: neonContextData.stateSites[stateCode]
    });
  }); // Domains

  Object.keys(neonContextData.domains).forEach(function (domainCode) {
    newState.featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.DOMAINS.KEY][domainCode] = _extends(_extends(_extends({}, newState.featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.DOMAINS.KEY][domainCode]), neonContextData.domains[domainCode]), {}, {
      sites: neonContextData.domainSites[domainCode]
    });
  });
  return newState;
};
/**
   PropTypes and defaultProps
*/


exports.hydrateNeonContextData = hydrateNeonContextData;
var SITE_MAP_PROP_TYPES = {
  // Top-level Props
  view: _propTypes.default.oneOf(Object.keys(VIEWS).map(function (k) {
    return k.toLowerCase();
  })),
  aspectRatio: _propTypes.default.number,
  filterPosition: _propTypes.default.oneOf(['top', 'bottom']),
  unusableVerticalSpace: _propTypes.default.number,
  // Map Props
  mapCenter: _propTypes.default.arrayOf(_propTypes.default.number),
  mapZoom: _propTypes.default.number,
  mapTileLayer: _propTypes.default.oneOf(Object.keys(TILE_LAYERS)),
  // Initial map focus (overrides mapCenter and mapZoom)
  location: _propTypes.default.string,
  // Selection Props
  selection: _propTypes.default.oneOf(Object.keys(SELECTABLE_FEATURE_TYPES)),
  maxSelectable: _propTypes.default.number,
  // Filter Props
  search: _propTypes.default.string,
  features: _propTypes.default.arrayOf(_propTypes.default.oneOf(Object.keys(FEATURES)))
};
exports.SITE_MAP_PROP_TYPES = SITE_MAP_PROP_TYPES;
var SITE_MAP_DEFAULT_PROPS = {
  // Top-level Props
  view: VIEWS.MAP.toLowerCase(),
  aspectRatio: null,
  filterPosition: 'bottom',
  unusableVerticalSpace: 0,
  // Map Props
  mapCenter: [52.68, -110.75],
  mapZoom: null,
  mapTileLayer: Object.keys(TILE_LAYERS)[0],
  // Initial map focus (overrides mapCenter and mapZoom)
  location: null,
  // Selection Props
  selection: null,
  maxSelectable: null,
  // Filter Props
  search: null,
  features: null
};
/**
   Aspect Ratio
*/

exports.SITE_MAP_DEFAULT_PROPS = SITE_MAP_DEFAULT_PROPS;
var dynamicAspectRatios = ['1:2', '9:16', '2:3', '5:7', '4:5', '1:1', '5:4', '7:5', '3:2', '16:9', '2:1', '2.5:1', '3:1'].map(function (ratio) {
  var parts = /^([\d.]+):([\d.]+)$/.exec(ratio) || ['', '1', '1'];
  return parseFloat(parts[2]) / parseFloat(parts[1]);
});

var getDynamicAspectRatio = function getDynamicAspectRatio() {
  var unusableVerticalSpace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var buffer = 100; // Approximate height of the filters row and a bit of margin

  var usableVericalSpace = window.innerHeight + buffer - unusableVerticalSpace;
  var windowAspectRatio = Math.max(usableVericalSpace, 0) / (window.innerWidth || 1);
  var arIdx = dynamicAspectRatios.findIndex(function (ar) {
    return ar < windowAspectRatio;
  });
  return arIdx === -1 ? dynamicAspectRatios[dynamicAspectRatios.length - 1] : dynamicAspectRatios[arIdx];
};
/**
 Function to parse a locationProperties value from a locations API response into an object with
 only white-listed keys present. For example:
   locationProperties": [
     {
       "locationPropertyName": "Value for Foo Bar",
       "locationPropertyValue": 123
     }
   ]
  becomes:
   { fooBar: 123 }
*/


exports.getDynamicAspectRatio = getDynamicAspectRatio;

var parseLocationProperties = function parseLocationProperties() {
  var inProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var whiteList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var outProps = {};

  var cleanPropKey = function cleanPropKey() {
    var inKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var words = inKey.substr(10).replace(/[^A-Za-z0-9_ -]/g, '').replace(/[_-]/g, ' ').toLowerCase().split(' ');
    return words.map(function (word, idx) {
      return idx === 0 ? word : "".concat(word.substr(0, 1).toUpperCase()).concat(word.substr(1));
    }).join('');
  };

  if (!Array.isArray(inProps) || !inProps.length) {
    return outProps;
  }

  inProps.forEach(function (prop) {
    var inPropKeys = Object.keys(prop);

    if (inPropKeys.length !== 2 || !inPropKeys.includes('locationPropertyName') || !inPropKeys.includes('locationPropertyValue') || !(typeof prop.locationPropertyName === 'string')) {
      return;
    }

    var propKey = cleanPropKey(prop.locationPropertyName);

    if (propKey.length && (!whiteList.length || whiteList.includes(propKey))) {
      outProps[propKey] = prop.locationPropertyValue;
    }
  });
  return outProps;
};

var DEFAULT_LOCATION_PROPERTIES_WHITELIST = ['maximumElevation', 'minimumElevation', 'nationalLandCoverDatabase2001', 'plotDimensions', 'plotId', 'plotSize', 'plotSubtype', 'plotType', 'slopeAspect', 'slopeGradient', 'soilTypeOrder,'];

var parseLocationData = function parseLocationData() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _data$siteCode = data.siteCode,
      siteCode = _data$siteCode === void 0 ? null : _data$siteCode,
      _data$locationType = data.locationType,
      type = _data$locationType === void 0 ? null : _data$locationType,
      _data$locationDescrip = data.locationDescription,
      description = _data$locationDescrip === void 0 ? null : _data$locationDescrip,
      _data$locationDecimal = data.locationDecimalLatitude,
      latitude = _data$locationDecimal === void 0 ? null : _data$locationDecimal,
      _data$locationDecimal2 = data.locationDecimalLongitude,
      longitude = _data$locationDecimal2 === void 0 ? null : _data$locationDecimal2,
      _data$locationElevati = data.locationElevation,
      elevation = _data$locationElevati === void 0 ? null : _data$locationElevati,
      _data$locationPolygon = data.locationPolygon,
      polygon = _data$locationPolygon === void 0 ? null : _data$locationPolygon,
      _data$locationPropert = data.locationProperties,
      locationProperties = _data$locationPropert === void 0 ? {} : _data$locationPropert,
      _data$locationChildre = data.locationChildren,
      children = _data$locationChildre === void 0 ? [] : _data$locationChildre;

  var parsed = _extends({
    type: type,
    description: description,
    siteCode: siteCode,
    children: children
  }, parseLocationProperties(locationProperties, DEFAULT_LOCATION_PROPERTIES_WHITELIST));

  if (elevation !== null) {
    parsed.elevation = elevation;
  }

  if (latitude !== null && longitude !== null) {
    parsed.latitude = latitude;
    parsed.longitude = longitude;
  }

  if (polygon !== null) {
    parsed.geometry = {
      coordinates: polygon.coordinates.map(function (c) {
        return [c.latitude, c.longitude];
      })
    };
  } // Have geometry but no lat/lon - calculate a basic lat/lon center for icon positioning


  if (!['latitude', 'longitude'].every(function (k) {
    return Object.keys(parsed).includes(k);
  }) && parsed.geometry && parsed.geometry.coordinates) {
    var _parsed$geometry$coor = parsed.geometry.coordinates.reduce(function (acc, cur) {
      return [acc[0] + cur[0], acc[1] + cur[1]];
    }, [0, 0]).map(function (c) {
      return c / parsed.geometry.coordinates.length;
    });

    var _parsed$geometry$coor2 = _slicedToArray(_parsed$geometry$coor, 2);

    parsed.latitude = _parsed$geometry$coor2[0];
    parsed.longitude = _parsed$geometry$coor2[1];
  } // Special case: set plotType TOWER_SOIL_PLOTS (not present in locations API)


  if (parsed.type === FEATURES.TOWER_SOIL_PLOTS.matchLocationType) {
    parsed.plotType = 'tower';
  }

  return parsed;
};

exports.parseLocationData = parseLocationData;

var parseLocationHierarchy = function parseLocationHierarchy(inHierarchy) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var outHierarchy = {};
  var name = inHierarchy.locationParentHierarchy ? null : inHierarchy.locationName;
  var description = inHierarchy.locationDescription || null;
  var type = inHierarchy.locationType || null;

  if (description.includes('Not Used')) {
    return outHierarchy;
  }

  if (name !== null) {
    outHierarchy[name] = {
      type: type,
      description: description,
      parent: parent
    };
  }

  inHierarchy.locationChildHierarchy.forEach(function (subLocation) {
    outHierarchy = _extends(_extends({}, outHierarchy), parseLocationHierarchy(subLocation, name));
  });
  return outHierarchy;
};
/**
   Map Icon Functions
   These appear here because of how Leaflet handles icons. Each icon must be a L.Icon instance,
   but many of our icons repeat. We also want to scale our icons with the zoom level. As such,
   we generate a stat structure containing only one instance of each distinct icon type scaled
   to the current zoom level and keep that in state. It is regenerated any time the zoom changes.
*/


exports.parseLocationHierarchy = parseLocationHierarchy;

var getZoomedIcon = function getZoomedIcon() {
  var featureKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var zoom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  var highlight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : HIGHLIGHT_STATUS.NONE;
  var selection = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : SELECTION_STATUS.UNSELECTED;
  var feature = FEATURES[featureKey] || {};
  var featureHasIcon = feature && feature.iconSvg && feature.iconShape && LOCATION_ICON_SVG_SHAPES[feature.iconShape];
  var iconUrl = featureHasIcon ? feature.iconSvg : _iconPlaceholder.default;
  var iconShape = featureHasIcon ? feature.iconShape : LOCATION_ICON_SVG_SHAPES.SQUARE.KEY;
  var iconScale = featureHasIcon ? feature.iconScale || 1 : 1;
  var minZoom = feature.minZoom || (FEATURES[feature.parent] || {}).minZoom || MAP_ZOOM_RANGE[0];
  var maxZoom = feature.maxZoom || (FEATURES[feature.parent] || {}).maxZoom || MAP_ZOOM_RANGE[1];
  var _LOCATION_ICON_SVG_SH = LOCATION_ICON_SVG_SHAPES[iconShape],
      popupAnchor = _LOCATION_ICON_SVG_SH.popupAnchor,
      shadow = _LOCATION_ICON_SVG_SH.shadow;
  var _LOCATION_ICON_SVG_SH2 = LOCATION_ICON_SVG_SHAPES[iconShape],
      iconSize = _LOCATION_ICON_SVG_SH2.iconSize,
      iconAnchor = _LOCATION_ICON_SVG_SH2.iconAnchor;

  var _ref2 = shadow[highlight] || {},
      shadowUrl = _ref2.svg;

  var _ref3 = shadow[highlight] || {},
      shadowSize = _ref3.size,
      shadowAnchor = _ref3.anchor; // Adjust icon, size, and anchor if selected (and a different "selected" icon is available)


  if (featureHasIcon && selection === SELECTION_STATUS.SELECTED && feature.iconSelectedSvg) {
    iconUrl = feature.iconSelectedSvg;
    iconSize = iconSize.map(function (d) {
      return d + SELECTED_ICON_OFFSET;
    });
    iconAnchor = iconSize.map(function (d) {
      return d + SELECTED_ICON_OFFSET / 2;
    });
    shadowSize = shadowUrl ? shadowSize.map(function (d) {
      return d + SELECTED_ICON_OFFSET;
    }) : null;
    shadowAnchor = shadowUrl ? shadowSize.map(function (d) {
      return d + SELECTED_ICON_OFFSET / 2;
    }) : null;
    popupAnchor[1] += SELECTED_ICON_OFFSET / 2;
  } // Determine Icon Scale
  // Normalize the scale to a range of at least 0.2 to 0.5 (but as big as 0.2 to 1) based on
  // current zoom and feature zoom bounds, then multiply by any feature icon scale


  var minScale = 0.2;
  var maxScale = Math.max((maxZoom - minZoom) / (MAP_ZOOM_RANGE[1] - MAP_ZOOM_RANGE[0]), 0.5);
  var baseScale = ((zoom || minZoom) - minZoom) / (maxZoom - minZoom);
  var scale = (minScale + baseScale * (maxScale - minScale)) * iconScale;
  var iconProps = {
    iconUrl: iconUrl,
    iconRetinaUrl: iconUrl,
    iconSize: iconSize.map(function (x) {
      return x * scale;
    }),
    iconAnchor: iconAnchor.map(function (x) {
      return x * scale;
    }),
    popupAnchor: popupAnchor.map(function (x) {
      return x * scale;
    })
  };

  if (shadowUrl && shadowSize && shadowAnchor) {
    iconProps.shadowUrl = shadowUrl;
    iconProps.shadowSize = shadowSize.map(function (x) {
      return x * scale;
    });
    iconProps.shadowAnchor = shadowAnchor.map(function (x) {
      return x * scale;
    });
  }

  return new _leaflet.default.Icon(iconProps);
}; // Get a structure containing all zoomed leaflet icon instances. These are stored in
// state and regenerated any time the zoom level changes. We do this so that we're not generating
// a new icon instance for every discrete location in view when several share the same icon.


var getZoomedIcons = function getZoomedIcons(zoom) {
  var featureTypes = [FEATURE_TYPES.LOCATIONS, FEATURE_TYPES.SITES, FEATURE_TYPES.OTHER];
  var icons = {};
  Object.keys(FEATURES).filter(function (key) {
    return featureTypes.includes(FEATURES[key].type) && FEATURES[key].iconSvg && FEATURES[key].iconShape && LOCATION_ICON_SVG_SHAPES[FEATURES[key].iconShape];
  }).forEach(function (key) {
    icons[key] = {};
    Object.keys(SELECTION_STATUS).forEach(function (selection) {
      if (selection === SELECTION_STATUS.SELECTED && !Object.keys(SELECTABLE_FEATURE_TYPES).includes(key)) {
        return;
      }

      icons[key][selection] = {};
      Object.keys(HIGHLIGHT_STATUS).forEach(function (highlight) {
        icons[key][selection][highlight] = getZoomedIcon(key, zoom, highlight, selection);
      });
    });
  });
  return icons;
};

exports.getZoomedIcons = getZoomedIcons;

var getMapStateForFocusLocation = function getMapStateForFocusLocation() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var focusLocation = state.focusLocation,
      _state$aspectRatio = state.aspectRatio,
      aspectRatio = _state$aspectRatio.currentValue,
      widthReference = _state$aspectRatio.widthReference;

  if (!focusLocation || !focusLocation.current) {
    return state;
  }

  var current = focusLocation.current;

  var _ref4 = focusLocation.data || {},
      _ref4$type = _ref4.type,
      type = _ref4$type === void 0 ? '' : _ref4$type,
      latitude = _ref4.latitude,
      longitude = _ref4.longitude;

  var newState = _extends({}, state);

  newState.map.bounds = null;
  newState.map.zoom = null; // No latitude/longitude: return all defaults

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    newState.map.center = SITE_MAP_DEFAULT_PROPS.mapCenter;
    return newState;
  } // Everything else (valid location with a center)


  newState.map.center = [latitude, longitude];
  newState.map.bounds = null;
  newState.map.zoom = null;

  if (type === 'SITE') {
    newState.map.zoom = (state.sites[current] || {}).zoom || 12;
  } else if (type === 'DOMAIN') {
    var domainsData = state.featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.DOMAINS.KEY];
    newState.map.zoom = (domainsData[current] || {}).zoom || null;
  } else if (type === 'STATE') {
    var statesData = state.featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.STATES.KEY];
    newState.map.zoom = (statesData[current] || {}).zoom || null;
  } else {
    var featureKey = Object.keys(FEATURES).filter(function (key) {
      return FEATURES[key].matchLocationType;
    }).find(function (key) {
      return new RegExp(FEATURES[key].matchLocationType).test(type);
    });

    if (featureKey) {
      if (FEATURES[featureKey].focusZoom) {
        newState.map.zoom = FEATURES[featureKey].focusZoom;
      } else {
        newState.map.zoom = FEATURES[featureKey].iconScale && FEATURES[featureKey].iconScale > 1.4 ? 17 : 18;
      }
    }
  }

  if (newState.map.zoom !== null) {
    // Regenerate icons
    newState.map.zoomedIcons = getZoomedIcons(newState.map.zoom); // Derive map bounds. Must be done by Leaflet but to do this without a full re-render we can
    // create a non-rendering empty Leaflet map with mocked dimensions that we promptly destroy.

    _leaflet.default.Map.include({
      getSize: function getSize() {
        return new _leaflet.default.Point(widthReference, widthReference * aspectRatio);
      }
    });

    var element = document.createElement('div');
    var map = new _leaflet.default.Map(element, {
      center: newState.map.center,
      zoom: newState.map.zoom
    });
    var newBounds = map.getBounds() || null;
    newState.map.bounds = !newBounds ? null : {
      /* eslint-disable no-underscore-dangle */
      lat: [newBounds._southWest.lat, newBounds._northEast.lat],
      lng: [newBounds._southWest.lng, newBounds._northEast.lng]
      /* eslint-enable no-underscore-dangle */

    };
  }

  return newState.map;
};

exports.getMapStateForFocusLocation = getMapStateForFocusLocation;

var boundsAreValid = function boundsAreValid(bounds) {
  return _typeof(bounds) === 'object' && bounds !== null && Object.keys(bounds).every(function (key) {
    return ['lat', 'lng'].includes(key) && Array.isArray(bounds[key]) && bounds[key].length === 2 && bounds[key].every(function (v) {
      return typeof v === 'number';
    }) && bounds[key][1] > bounds[key][0];
  });
};

exports.boundsAreValid = boundsAreValid;

var calculateLocationsInMap = function calculateLocationsInMap(locations) {
  var bounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var buffer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (!locations || _typeof(locations) !== 'object' || !Object.keys(locations).length) {
    return [];
  }

  if (bounds === null) {
    return Object.keys(locations);
  }

  if (!boundsAreValid(bounds)) {
    return [];
  }

  var extendedBounds = !buffer ? bounds : Object.fromEntries(Object.keys(bounds).map(function (dir) {
    var bufferValue = (bounds[dir][1] - bounds[dir][0]) / 2;
    return [dir, [bounds[dir][0] - bufferValue, bounds[dir][1] + bufferValue]];
  }));

  var isInBounds = function isInBounds(loc) {
    return Number.isFinite(loc.latitude) && Number.isFinite(loc.longitude) && loc.latitude >= extendedBounds.lat[0] && loc.latitude <= extendedBounds.lat[1] && loc.longitude >= extendedBounds.lng[0] && loc.longitude <= extendedBounds.lng[1];
  };

  return Object.keys(locations).filter(function (locId) {
    return isInBounds(locations[locId]);
  });
};

exports.calculateLocationsInMap = calculateLocationsInMap;