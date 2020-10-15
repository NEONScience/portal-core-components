"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deriveFullObservatoryZoomLevel = exports.calculateLocationsInBounds = exports.boundsAreValid = exports.getDynamicAspectRatio = exports.getMapStateForFocusLocation = exports.getZoomedIcons = exports.SITE_MAP_DEFAULT_PROPS = exports.SITE_MAP_PROP_TYPES = exports.hydrateNeonContextData = exports.DEFAULT_STATE = exports.OVERLAYS = exports.OVERLAY_GROUPS_BY_TITLE = exports.OVERLAY_GROUPS = exports.BASE_LAYERS_BY_TITLE = exports.BASE_LAYERS = exports.getHref = exports.calculateFeatureAvailability = exports.BOUNDARY_COLORS = exports.GRAPHQL_LOCATIONS_API_CONSTANTS = exports.FEATURES = exports.LOCATION_ICON_SVG_SHAPES = exports.NLCD_CLASSES = exports.PLOT_SAMPLING_MODULES = exports.FETCH_STATUS = exports.MAP_MOUSE_MODES = exports.VIEWS = exports.HIGHLIGHT_STATUS = exports.UNSELECTABLE_MARKER_FILTER = exports.SELECTION_STATUS = exports.SELECTION_PORTIONS = exports.SELECTABLE_FEATURE_TYPES = exports.FEATURE_DATA_SOURCES = exports.FEATURE_TYPES = exports.SITE_TERRAINS = exports.SORT_DIRECTIONS = exports.SITE_LOCATION_HIERARCHIES_MIN_ZOOM = exports.KM2_TO_ACRES = exports.MIN_TABLE_MAX_BODY_HEIGHT = exports.MIN_CONTAINER_HEIGHT = exports.OBSERVATORY_CENTER = exports.MAP_ZOOM_RANGE = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

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

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MAP_ZOOM_RANGE = [1, 19];
exports.MAP_ZOOM_RANGE = MAP_ZOOM_RANGE;
var OBSERVATORY_CENTER = [52.68, -110.75];
exports.OBSERVATORY_CENTER = OBSERVATORY_CENTER;
var MIN_CONTAINER_HEIGHT = 300;
exports.MIN_CONTAINER_HEIGHT = MIN_CONTAINER_HEIGHT;
var MIN_TABLE_MAX_BODY_HEIGHT = 100;
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
}; // For consistency in expressing site terrain

exports.SORT_DIRECTIONS = SORT_DIRECTIONS;
var SITE_TERRAINS = {
  AQUATIC: 'AQUATIC',
  TERRESTRIAL: 'TERRESTRIAL'
}; // For consistency in differentiating discrete sets of data that can be tabulated together.
// e.g. all LOCATIONS type feature data can coexist in a single table view with a
// single column definition. But LOCATIONS and SITES shouldn't, as each set has
// different common attributes that should map to table columns (yes, sites are locations too,
// but we represent and interact with them differently... I think? Maybe?)

exports.SITE_TERRAINS = SITE_TERRAINS;
var FEATURE_TYPES = {
  SITES: 'SITES',
  SITE_LOCATION_HIERARCHIES: 'SITE_LOCATION_HIERARCHIES',
  LOCATIONS: 'LOCATIONS',
  SAMPLING_POINTS: 'SAMPLING_POINTS',
  BOUNDARIES: 'BOUNDARIES',
  GROUP: 'GROUP',
  OTHER: 'OTHER' // All features require a type. This catch-all type will not show in the table.

}; // For consistency in differentiating where feature data come from
// (e.g. various fetch APIs, NeonContext)

exports.FEATURE_TYPES = FEATURE_TYPES;
var FEATURE_DATA_SOURCES = {
  REST_LOCATIONS_API: 'REST_LOCATIONS_API',
  GRAPHQL_LOCATIONS_API: 'GRAPHQL_LOCATIONS_API',
  ARCGIS_ASSETS_API: 'ARCGIS_ASSETS_API',
  NEON_CONTEXT: 'NEON_CONTEXT'
}; // Subset of FEATURE_TYPES describing all features that are directly selectable

exports.FEATURE_DATA_SOURCES = FEATURE_DATA_SOURCES;

var SELECTABLE_FEATURE_TYPES = function (_ref) {
  var SITES = _ref.SITES;
  return {
    SITES: SITES
  };
}(FEATURE_TYPES);

exports.SELECTABLE_FEATURE_TYPES = SELECTABLE_FEATURE_TYPES;
var SELECTED_ICON_OFFSET = 30; // Number of pixels bigger in one dimension for selected icons
// For consistency in denoting whether all or some of a region's selectable children are selected

var SELECTION_PORTIONS = {
  PARTIAL: 'PARTIAL',
  TOTAL: 'TOTAL'
}; // For consistency in denoting the selection status of any selectable thing

exports.SELECTION_PORTIONS = SELECTION_PORTIONS;
var SELECTION_STATUS = {
  SELECTED: 'SELECTED',
  UNSELECTED: 'UNSELECTED'
}; // For consistency in visually fading unselectable marker icons

exports.SELECTION_STATUS = SELECTION_STATUS;
var UNSELECTABLE_MARKER_FILTER = 'sepia(0.8) contrast(0.3) brightness(1.35)'; // For consistency in denoting the highlight status of a marker

exports.UNSELECTABLE_MARKER_FILTER = UNSELECTABLE_MARKER_FILTER;
var HIGHLIGHT_STATUS = {
  NONE: 'NONE',
  HIGHLIGHT: 'HIGHLIGHT',
  SELECT: 'SELECT'
}; // For consistency in denoting which dinstinct user interfaces are available and which is visible

exports.HIGHLIGHT_STATUS = HIGHLIGHT_STATUS;
var VIEWS = {
  MAP: 'MAP',
  TABLE: 'TABLE'
}; // For consistency in denoting exclusive available mouse behaviors on the map

exports.VIEWS = VIEWS;
var MAP_MOUSE_MODES = {
  PAN: 'PAN',
  AREA_SELECT: 'AREA_SELECT'
}; // For consistency in tracking the current status of a fetch or import

exports.MAP_MOUSE_MODES = MAP_MOUSE_MODES;
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
  // We don't know what this is but it does appear in some hierarchies...
  mos: 'Mosquitos',
  mpt: 'Mosquito Pathogens',
  phe: 'Plant Phenology',
  sme: 'Soil Microbes',
  tck: 'Ticks',
  vst: 'Vegetation Structure'
}; // Source: https://www.mrlc.gov/data/legends/national-land-cover-database-2001-nlcd2001-legend

exports.PLOT_SAMPLING_MODULES = PLOT_SAMPLING_MODULES;
var NLCD_CLASSES = {
  openWater: {
    name: 'Open Water',
    value: 11,
    description: 'Areas of open water, generally with less than 25% cover of vegetation or soil.',
    color: '#5475a8',
    category: 'Water'
  },
  perennialIceSnow: {
    name: 'Perennial Ice/Snow',
    vaule: 12,
    description: 'Areas characterized by a perennial cover of ice and/or snow, generally greater than 25% of total cover.',
    color: '#ffffff',
    category: 'Water'
  },
  developedOpenSpace: {
    name: 'Developed, Open Space',
    value: 21,
    description: 'Areas with a mixture of some constructed materials, but mostly vegetation in the form of lawn grasses. Impervious surfaces account for less than 20% of total cover. These areas most commonly include large-lot single-family housing units, parks, golf courses, and vegetation planted in developed settings for recreation, erosion control, or aesthetic purposes.',
    color: '#e8d1d1',
    category: 'Developed'
  },
  developedLowIntensity: {
    name: 'Developed, Low Intensity',
    value: 22,
    description: 'Areas with a mixture of constructed materials and vegetation. Impervious surfaces account for 20% to 49% percent of total cover. These areas most commonly include single-family housing units.',
    color: '#e29e8c',
    category: 'Developed'
  },
  developedMediumIntensity: {
    name: 'Developed, Medium Intensity',
    value: 23,
    description: 'Areas with a mixture of constructed materials and vegetation. Impervious surfaces account for 50% to 79% of the total cover. These areas most commonly include single-family housing units.',
    color: '#ff0000',
    category: 'Developed'
  },
  developedHighIntensity: {
    name: 'Developed, High Intensity',
    value: 24,
    description: 'Highly developed areas where people reside or work in high numbers. Examples include apartment complexes, row houses and commercial/industrial. Impervious surfaces account for 80% to 100% of the total cover.',
    color: '#b50000',
    category: 'Developed'
  },
  barrenLand: {
    name: 'Barren Land (Rock/Sand/Clay)',
    value: 31,
    description: 'Areas of bedrock, desert pavement, scarps, talus, slides, volcanic material, glacial debris, sand dunes, strip mines, gravel pits and other accumulations of earthen material. Generally, vegetation accounts for less than 15% of total cover.',
    color: '#d2cdc0',
    category: 'Barren'
  },
  deciduousForest: {
    name: 'Deciduous Forest',
    value: 41,
    description: 'Areas dominated by trees generally greater than 5 meters tall, and greater than 20% of total vegetation cover. More than 75% of the tree species shed foliage simultaneously in response to seasonal change.',
    color: '#85c77e',
    category: 'Forest'
  },
  evergreenForest: {
    name: 'Evergreen Forest',
    value: 42,
    description: 'Areas dominated by trees generally greater than 5 meters tall, and greater than 20% of total vegetation cover. More than 75% of the tree species maintain their leaves all year. Canopy is never without green foliage.',
    color: '#38814e',
    category: 'Forest'
  },
  mixedForest: {
    name: 'Mixed Forest',
    value: 43,
    description: 'Areas dominated by trees generally greater than 5 meters tall, and greater than 20% of total vegetation cover. Neither deciduous nor evergreen species are greater than 75% of total tree cover.',
    color: '#d4e7b0',
    category: 'Forest'
  },
  dwarfScrub: {
    name: 'Dwarf Scrub',
    value: 51,
    description: 'Alaska only areas dominated by shrubs less than 20 centimeters tall with shrub canopy typically greater than 20% of total vegetation. This type is often co-associated with grasses, sedges, herbs, and non-vascular vegetation.',
    color: '#af963c',
    category: 'Shrubland'
  },
  shrubScrub: {
    name: 'Shrub/Scrub',
    value: 52,
    description: 'Areas dominated by shrubs; less than 5 meters tall with shrub canopy typically greater than 20% of total vegetation. This class includes true shrubs, young trees in an early successional stage or trees stunted from environmental conditions.',
    color: '#dcca8f',
    category: 'Shrubland'
  },
  grasslandHerbaceous: {
    name: 'Grassland/Herbaceous',
    value: 71,
    description: 'Areas dominated by gramanoid or herbaceous vegetation, generally greater than 80% of total vegetation. These areas are not subject to intensive management such as tilling, but can be utilized for grazing.',
    color: '#fde9aa',
    category: 'Herbaceous'
  },
  sedgeHerbaceous: {
    name: 'Sedge/Herbaceous',
    value: 72,
    description: 'Alaska only areas dominated by sedges and forbs, generally greater than 80% of total vegetation. This type can occur with significant other grasses or other grass like plants, and includes sedge tundra, and sedge tussock tundra.',
    color: '#d1d182',
    category: 'Herbaceous'
  },
  lichens: {
    name: 'Lichens',
    value: 73,
    description: 'Alaska only areas dominated by fruticose or foliose lichens generally greater than 80% of total vegetation.',
    color: '#a3cc51',
    category: 'Herbaceous'
  },
  moss: {
    name: 'Moss',
    value: 74,
    description: 'Alaska only areas dominated by mosses, generally greater than 80% of total vegetation.',
    color: '#82ba9e',
    category: 'Herbaceous'
  },
  pastureHay: {
    name: 'Pasture/Hay',
    value: 81,
    description: 'Areas of grasses, legumes, or grass-legume mixtures planted for livestock grazing or the production of seed or hay crops, typically on a perennial cycle. Pasture/hay vegetation accounts for greater than 20% of total vegetation.',
    color: '#fbf65d',
    category: 'Planted/Cultivated'
  },
  cultivatedCrops: {
    name: 'Cultivated Crops',
    value: 82,
    description: 'Areas used for the production of annual crops, such as corn, soybeans, vegetables, tobacco, and cotton, and also perennial woody crops such as orchards and vineyards. Crop vegetation accounts for greater than 20% of total vegetation. This class also includes all land being actively tilled.',
    color: '#ca9146',
    category: 'Planted/Cultivated'
  },
  woodyWetlands: {
    name: 'Woody Wetlands',
    value: 90,
    description: 'Areas where forest or shrubland vegetation accounts for greater than 20% of vegetative cover and the soil or substrate is periodically saturated with or covered with water.',
    color: '#c8e6f8',
    category: 'Wetlands'
  },
  emergentHerbaceousWetlands: {
    name: 'Emergent Herbaceous Wetlands',
    value: 95,
    description: 'Areas where perennial herbaceous vegetation accounts for greater than 80% of vegetative cover and the soil or substrate is periodically saturated with or covered with water.',
    color: '#64b3d5',
    category: 'Wetlands'
  }
};
/**
   Icon SVGs
   An importable data structure containing all imported SVGs for map and legend icons
*/

exports.NLCD_CLASSES = NLCD_CLASSES;
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

exports.LOCATION_ICON_SVG_SHAPES = LOCATION_ICON_SVG_SHAPES;
var FEATURES = {
  // States and Domains
  STATES: {
    name: 'US States',
    nameSingular: 'US State',
    type: FEATURE_TYPES.BOUNDARIES,
    hideByDefault: true,
    dataSource: FEATURE_DATA_SOURCES.NEON_CONTEXT,
    primaryIdOnly: true,
    featureShape: 'Polygon',
    style: {
      color: '#53ac7b',
      weight: 8
    },
    generalLegendGroup: true
  },
  DOMAINS: {
    name: 'NEON Domains',
    nameSingular: 'NEON Domain',
    type: FEATURE_TYPES.BOUNDARIES,
    hideByDefault: true,
    dataSource: FEATURE_DATA_SOURCES.NEON_CONTEXT,
    primaryIdOnly: true,
    featureShape: 'Polygon',
    style: {
      color: '#885eba',
      weight: 8
    }
  },
  // Various Boundary Types
  FLIGHT_BOX_BOUNDARIES: {
    name: 'AOP Flight Box Boundaries',
    nameSingular: 'AOP Flight Box Boundary',
    type: FEATURE_TYPES.BOUNDARIES,
    minZoom: 8,
    dataSource: FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API,
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
    minZoom: 7
  },
  WATERSHED_BOUNDARIES: {
    name: 'Watershed Boundaries',
    nameSingular: 'Watershed Boundary',
    type: FEATURE_TYPES.BOUNDARIES,
    minZoom: 7,
    dataSource: FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API,
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
    minZoom: 7,
    dataSource: FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API,
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
    minZoom: 10,
    dataSource: FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API,
    parent: 'AQUATIC_WATERSHEDS',
    featureShape: 'Marker',
    iconSvg: _iconPourPoint.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.HOMEPLATE.KEY
  },
  SAMPLING_BOUNDARIES: {
    name: 'Site Sampling Boundaries',
    nameSingular: 'Site Sampling Boundary',
    type: FEATURE_TYPES.BOUNDARIES,
    minZoom: 9,
    dataSource: FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API,
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
    dataSource: FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API,
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
    dataSource: FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API,
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
    fetchingForFeatures: ['TOWER_BASE_PLOTS', 'DISTRIBUTED_BASE_PLOTS']
  },
  TOWERS: {
    name: 'Tower Locations',
    nameSingular: 'Tower Location',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 10,
    // Get from REST because fetching from GraphQL won't return children for a count of levels
    // (you can get this from GraphQL but it hoses performance and only this feature needs children)
    dataSource: FEATURE_DATA_SOURCES.REST_LOCATIONS_API,
    matchLocationType: 'TOWER',
    parent: 'TERRESTRIAL_SITE_FEATURES',
    featureShape: 'Marker',
    iconScale: 1.8,
    iconSvg: _iconTower.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.DIAMOND.KEY,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL
  },
  HUTS: {
    name: 'Huts',
    nameSingular: 'Hut',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 10,
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'HUT',
    parent: 'TERRESTRIAL_SITE_FEATURES',
    featureShape: 'Marker',
    iconScale: 1.4,
    iconSvg: _iconHut.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.DIAMOND.KEY,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL
  },
  MEGAPITS: {
    name: 'Megapits',
    nameSingular: 'Megapit',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 10,
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'MEGAPIT',
    parent: 'TERRESTRIAL_SITE_FEATURES',
    featureShape: 'Marker',
    iconScale: 1.8,
    iconSvg: _iconMegapit.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.DIAMOND.KEY,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL
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
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'OS Plot - phe',
    featureShape: 'Marker',
    minZoom: 13,
    focusZoom: 16,
    iconScale: 1.5,
    iconSvg: _iconTowerPhenologyPlot.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL
  },
  TOWER_BASE_PLOTS: {
    name: 'Tower Base Plots',
    nameSingular: 'Tower Base Plot',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'Tower plots support a variety of plant productivity, plant diversity, soil, biogeochemistry and microbe sampling. The number and size of Tower Base Plots is determined by the vegetation of the tower airshed. In forested sites, twenty 40m x 40m plots are established. In herbaceous sites, thirty 20m x 20m plots are established. Of these thirty tower plots, four have additional space to support soil sampling.',
    parent: 'TOWER_PLOTS',
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'OS Plot - all',
    featureShape: 'Marker',
    minZoom: 14,
    focusZoom: 18,
    iconSvg: _iconTowerBasePlot.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL
  },
  TOWER_SOIL_PLOTS: {
    name: 'Tower Soil Plots',
    nameSingular: 'Tower Soil Plot',
    type: FEATURE_TYPES.LOCATIONS,
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'SOIL_PLOT',
    description: 'Soil plots are located within the flux tower\'s footprint and in the locally dominant (~1 km² scale) soil type of each terrestrial field site, while being constrained to no more than 40m²',
    parent: 'TOWER_PLOTS',
    featureShape: 'Marker',
    minZoom: 14,
    focusZoom: 18,
    iconScale: 0.7,
    iconSvg: _iconTowerSoilPlot.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL
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
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'OS Plot - brd',
    featureShape: 'Marker',
    iconScale: 1.8,
    focusZoom: 16,
    iconSvg: _iconDistributedBirdGrid.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL
  },
  DISTRIBUTED_MAMMAL_GRIDS: {
    name: 'Distributed Mammal Grids',
    nameSingular: 'Distributed Mammal Grid',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'Mammal Grids are 90m x 90m and include 100 trapping locations at 10m spacing. Where possible, these grids are colocated with Distributed Base Plots by placing them a specified distance (150m +/- 50m) and random direction from the center of the Base Plot.',
    parent: 'DISTRIBUTED_PLOTS',
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'OS Plot - mam',
    featureShape: 'Marker',
    iconScale: 1.4,
    focusZoom: 17,
    iconSvg: _iconDistributedMammalGrid.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL
  },
  DISTRIBUTED_BASE_PLOTS: {
    name: 'Distributed Base Plots',
    nameSingular: 'Distributed Base Plot',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'Distributed Base Plots support a variety of plant productivity, plant diversity, soil, biogeochemistry, microbe and beetle sampling. Distributed Base Plots are 40m x 40m.',
    parent: 'DISTRIBUTED_PLOTS',
    featureShape: 'Marker',
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'OS Plot - all',
    iconScale: 1.2,
    focusZoom: 17,
    iconSvg: _iconDistributedBasePlot.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL
  },
  DISTRIBUTED_TICK_PLOTS: {
    name: 'Distributed Tick Plots',
    nameSingular: 'Distributed Tick Plot',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'Tick Plots are sampled by conducting cloth dragging or flagging around the perimeter of a 40m x 40m plot. Tick plots are colocated with Distributed Base Plots by placing them a specified distance (150m +/- 15m) and random direction from the center of the Base Plot.',
    parent: 'DISTRIBUTED_PLOTS',
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'OS Plot - tck',
    featureShape: 'Marker',
    iconScale: 1.2,
    focusZoom: 17,
    iconSvg: _iconDistributedTickPlot.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL
  },
  DISTRIBUTED_MOSQUITO_POINTS: {
    name: 'Distributed Mosquito Points',
    nameSingular: 'Distributed Mosquito Point',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'At each Mosquito Point, one CO2 trap is established. Due to the frequency of sampling and temporal sampling constraints, Mosquito Points are located within 45m of roads.',
    parent: 'DISTRIBUTED_PLOTS',
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'OS Plot - mos',
    iconSvg: _iconDistributedMosquitoPoint.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    featureShape: 'Marker',
    focusZoom: 18,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL
  },
  // Plot Boundaries
  PLOT_BOUNDARIES: {
    name: 'Plot Boundaries',
    type: FEATURE_TYPES.GROUP,
    minZoom: 14,
    description: 'Some types of distributed and tower plots may be represented by a boundary polygon in addition their marker icon to denote actual size and location.',
    parent: 'TERRESTRIAL_SITE_FEATURES'
  },
  TOWER_PHENOLOGY_PLOT_BOUNDARIES: {
    name: 'Phenology Plot Boundaries',
    nameSingular: 'Phenology Plot Boundary',
    type: FEATURE_TYPES.SAMPLING_POINTS,
    descriptionFromParentDataFeatureKey: true,
    parent: 'PLOT_BOUNDARIES',
    parentDataFeatureKey: 'TOWER_PHENOLOGY_PLOTS',
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationName: /\.phe\.(NW|NE|SE|SW)$/,
    matchLocationCoordinateMap: ['NW', 'NE', 'SE', 'SW'],
    minZoom: 15,
    featureShape: 'Polygon',
    style: {
      color: '#59a14f',
      dashArray: '1, 12'
    },
    siteTerrain: SITE_TERRAINS.TERRESTRIAL
  },
  TOWER_SOIL_PLOT_BOUNDARIES: {
    // Comes back as data from TOWER_SOIL_PLOTS fetches so no fetch here
    name: 'Tower Soil Plot Boundaries',
    nameSingular: 'Tower Soil Plot Boundary',
    type: FEATURE_TYPES.SAMPLING_POINTS,
    descriptionFromParentDataFeatureKey: true,
    parent: 'PLOT_BOUNDARIES',
    parentDataFeatureKey: 'TOWER_SOIL_PLOTS',
    minZoom: 18,
    featureShape: 'Polygon',
    style: {
      color: '#bea488',
      dashArray: '1, 12'
    }
  },
  DISTRIBUTED_BIRD_GRID_BOUNDARIES: {
    name: 'Bird Grid Boundaries',
    nameSingular: 'Bird Grid Boundary',
    type: FEATURE_TYPES.SAMPLING_POINTS,
    descriptionFromParentDataFeatureKey: true,
    parent: 'PLOT_BOUNDARIES',
    parentDataFeatureKey: 'DISTRIBUTED_BIRD_GRIDS',
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationName: /\.brd\.(A1|A3|C3|C1)$/,
    matchLocationCoordinateMap: ['A1', 'A3', 'C3', 'C1'],
    minZoom: 14,
    featureShape: 'Polygon',
    style: {
      color: '#f28e2c',
      dashArray: '1, 12'
    },
    siteTerrain: SITE_TERRAINS.TERRESTRIAL
  },
  DISTRIBUTED_MAMMAL_GRID_BOUNDARIES: {
    name: 'Mammal Grid Boundaries',
    nameSingular: 'Mammal Grid Boundary',
    type: FEATURE_TYPES.SAMPLING_POINTS,
    descriptionFromParentDataFeatureKey: true,
    parent: 'PLOT_BOUNDARIES',
    parentDataFeatureKey: 'DISTRIBUTED_MAMMAL_GRIDS',
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationName: /\.mam\.(A1|A10|J10|J1)$/,
    matchLocationCoordinateMap: ['A1', 'A10', 'J10', 'J1'],
    minZoom: 16,
    featureShape: 'Polygon',
    style: {
      color: '#925214',
      dashArray: '1, 12'
    },
    siteTerrain: SITE_TERRAINS.TERRESTRIAL
  },
  DISTRIBUTED_TICK_PLOT_BOUNDARIES: {
    name: 'Tick Plot Boundaries',
    nameSingular: 'Tick Plot Boundary',
    type: FEATURE_TYPES.SAMPLING_POINTS,
    descriptionFromParentDataFeatureKey: true,
    parent: 'PLOT_BOUNDARIES',
    parentDataFeatureKey: 'DISTRIBUTED_TICK_PLOTS',
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationName: /\.tck\.(57|61|25|21)$/,
    matchLocationCoordinateMap: ['57', '61', '25', '21'],
    minZoom: 17,
    featureShape: 'Polygon',
    style: {
      color: '#000000',
      dashArray: '1, 12'
    },
    siteTerrain: SITE_TERRAINS.TERRESTRIAL
  },
  // Aquatic Site Features
  AQUATIC_SITE_FEATURES: {
    name: 'Aquatic Site Features',
    type: FEATURE_TYPES.GROUP,
    minZoom: 10
  },
  AQUATIC_BENCHMARKS: {
    name: 'Benchmarks',
    nameSingular: 'Benchmark',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 10,
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'AOS benchmark named location type',
    parent: 'AQUATIC_SITE_FEATURES',
    featureShape: 'Marker',
    iconScale: 1.3,
    iconSvg: _iconBenchmark.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.DIAMOND.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC
  },
  AQUATIC_AUTOMATED_INSTRUMENTS: {
    name: 'Automated Instuments',
    type: FEATURE_TYPES.GROUP,
    minZoom: 10,
    parent: 'AQUATIC_SITE_FEATURES'
  },
  AQUATIC_OBSERVATIONAL_SAMPLING: {
    name: 'Observational Sampling',
    type: FEATURE_TYPES.GROUP,
    minZoom: 11,
    parent: 'AQUATIC_SITE_FEATURES'
  },
  AQUATIC_RIPARIAN_ASSESSMENTS: {
    name: 'Riparian Assessments',
    nameSingular: 'Riparian Assessment',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 11,
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'AOS riparian named location type',
    description: 'Number of locations for assessment of riparian vegetation composition and physical structure vary by site type. Lakes and non-wadeable rivers have ten locations. Wadeable streams have 20 locations and also include assessment of riparian vegetation percent cover in wadeable streams.',
    parent: 'AQUATIC_OBSERVATIONAL_SAMPLING',
    featureShape: 'Marker',
    iconSvg: _iconRiparianAssessment.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC
  },
  AQUATIC_WET_DEPOSITION_POINTS: {
    name: 'Wet Deposition Points',
    nameSingular: 'Wet Deposition Point',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 11,
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'AOS wet deposition named location type',
    parent: 'AQUATIC_OBSERVATIONAL_SAMPLING',
    featureShape: 'Marker',
    iconScale: 1.2,
    iconSvg: _iconWetDepositionPoint.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC
  },
  AQUATIC_GROUNDWATER_WELLS: {
    name: 'Groundwater Wells',
    nameSingular: 'Groundwater Well',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 11,
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'GROUNDWATER_WELL',
    description: 'Each site has up to eight groundwater wells outfitted with sensors that measure high temporal resolution groundwater elevation (pressure transducer-based), temperature, and specific conductance.',
    parent: 'AQUATIC_AUTOMATED_INSTRUMENTS',
    featureShape: 'Marker',
    iconScale: 1.2,
    iconSvg: _iconGroundwaterWell.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC
  },
  AQUATIC_METEOROLOGICAL_STATIONS: {
    name: 'Meteorological Stations',
    nameSingular: 'Meteorological Station',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 10,
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'MET_STATION',
    description: 'A meteorological station is located on the shore of most aquatic sites and collects data comparable with flux tower measurements at terrestrial sites. Lake and wadeable rivers also have an above water met. station on buoy. These data are unique with different sensors and data frequencies due to power and data storage constraints.',
    parent: 'AQUATIC_AUTOMATED_INSTRUMENTS',
    featureShape: 'Marker',
    iconScale: 1.5,
    iconSvg: _iconMeteorologicalStation.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC
  },
  AQUATIC_DISCHARGE_POINTS: {
    name: 'Discharge Points',
    nameSingular: 'Discharge Point',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 11,
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'AOS discharge named location type',
    parent: 'AQUATIC_OBSERVATIONAL_SAMPLING',
    featureShape: 'Marker',
    iconSvg: _iconDischargePoint.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC
  },
  AQUATIC_FISH_POINTS: {
    name: 'Fish Points',
    nameSingular: 'Fish Point',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 11,
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'AOS fish named location type',
    parent: 'AQUATIC_OBSERVATIONAL_SAMPLING',
    featureShape: 'Marker',
    iconSvg: _iconFishPoint.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC
  },
  AQUATIC_PLANT_TRANSECTS: {
    name: 'Plant Transects',
    nameSingular: 'Plant Transect',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 11,
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'AOS plant named location type',
    parent: 'AQUATIC_OBSERVATIONAL_SAMPLING',
    featureShape: 'Marker',
    iconScale: 1.3,
    iconSvg: _iconPlantTransect.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC
  },
  AQUATIC_SEDIMENT_POINTS: {
    name: 'Sediment Points',
    nameSingular: 'Sediment Point',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 11,
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'AOS sediment named location type',
    parent: 'AQUATIC_OBSERVATIONAL_SAMPLING',
    featureShape: 'Marker',
    iconSvg: _iconSedimentPoint.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC
  },
  AQUATIC_STAFF_GAUGES: {
    name: 'Staff Gauges',
    nameSingular: 'Staff Gauge',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 11,
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'STAFF_GAUGE',
    description: 'The staff gauge measures gauge height, in meters, measured at lakes, wadeable rivers and non-wadeable streams. A phenocam is installed near most gauges. It collects RGB and IR images of the lake, river, or stream vegetation, stream surface, and stream gauge every 15 minutes.',
    parent: 'AQUATIC_AUTOMATED_INSTRUMENTS',
    featureShape: 'Marker',
    iconSvg: _iconStaffGauge.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC
  },
  AQUATIC_SENSOR_STATIONS: {
    name: 'Sensor Stations',
    nameSingular: 'Sensor Station',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 10,
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: /^(S1|S2|INLET|OUTLET)_LOC$/,
    description: 'Wadeable streams have a sensor station near the top of the reach and the bottom of the reach; non-wadeable rivers have a sensor station on a buoy and one near the bank; Lakes have an inlet sensor station, an outlet sensor station and a sensor station on a buoy. Data collection varies by type of sensor station.',
    parent: 'AQUATIC_AUTOMATED_INSTRUMENTS',
    featureShape: 'Marker',
    iconScale: 1.1,
    iconSvg: _iconSensorStation.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC
  },
  AQUATIC_BUOYS: {
    name: 'Buoys',
    nameSingular: 'Buoy',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 10,
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'BUOY',
    parent: 'AQUATIC_AUTOMATED_INSTRUMENTS',
    featureShape: 'Marker',
    iconScale: 1.2,
    iconSvg: _iconBuoy.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC
  },
  // SITE_MARKERS Group
  SITE_MARKERS: {
    name: 'NEON Site Markers',
    type: FEATURE_TYPES.GROUP,
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
    dataSource: FEATURE_DATA_SOURCES.NEON_CONTEXT,
    primaryIdOnly: true,
    featureShape: 'Marker',
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
    dataSource: FEATURE_DATA_SOURCES.NEON_CONTEXT,
    primaryIdOnly: true,
    featureShape: 'Marker',
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
    dataSource: FEATURE_DATA_SOURCES.NEON_CONTEXT,
    primaryIdOnly: true,
    featureShape: 'Marker',
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
    dataSource: FEATURE_DATA_SOURCES.NEON_CONTEXT,
    primaryIdOnly: true,
    featureShape: 'Marker',
    iconScale: 1,
    iconSvg: _iconSiteRelocatableAquatic.default,
    iconSelectedSvg: _iconSiteRelocatableAquaticSelected.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY
  }
}; // Replicate keys as attributes to completely eliminate the need to write a feature key string

exports.FEATURES = FEATURES;
Object.keys(FEATURES).forEach(function (key) {
  FEATURES[key].KEY = key;
});
/**
   GRAPHQL_LOCATIONS_API Constants
   The Locations API groups fetchable assets by minZoom (i.e. all assets for all locations features
   with the same minZoom are fetched together, for a given field site). Thus we want lookups of
   minZoom by feature key and vice versa. These values never change, so derive them now.
*/
// A mapping of feature key to minZoom for GRAPHQL_LOCATIONS_API dataSource features

var FEATURES_TO_MINZOOM_MAP = {};
Object.keys(FEATURES).filter(function (featureKey) {
  return FEATURES[featureKey].dataSource === FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
}).forEach(function (featureKey) {
  var feature = FEATURES[featureKey];
  var minZoom = feature.minZoom || (FEATURES[feature.parent] || {}).minZoom || 0;
  FEATURES_TO_MINZOOM_MAP[featureKey] = minZoom;
}); // A mapping of minZoom level to feature keys (inversion of FEATURES_MINZOOM_MAP)

var MINZOOM_TO_FEATURES_MAP = {};
Object.keys(FEATURES_TO_MINZOOM_MAP).forEach(function (featureKey) {
  var minZoom = FEATURES_TO_MINZOOM_MAP[featureKey];

  if (!MINZOOM_TO_FEATURES_MAP[minZoom]) {
    MINZOOM_TO_FEATURES_MAP[minZoom] = [];
  }

  MINZOOM_TO_FEATURES_MAP[minZoom].push(featureKey);
}); // Roll all that up and export it

var GRAPHQL_LOCATIONS_API_CONSTANTS = {
  FEATURES_TO_MINZOOM_MAP: FEATURES_TO_MINZOOM_MAP,
  MINZOOM_TO_FEATURES_MAP: MINZOOM_TO_FEATURES_MAP
}; // Common colors for selecatble boundary features

exports.GRAPHQL_LOCATIONS_API_CONSTANTS = GRAPHQL_LOCATIONS_API_CONSTANTS;
var BOUNDARY_COLORS = {
  partialSelected: _Theme.COLORS.LIGHT_BLUE[300],
  totalSelected: _Theme.COLORS.LIGHT_BLUE[500],
  hover: _Theme.COLORS.LIGHT_BLUE[100]
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

  var newState = _extends({}, state, {
    filters: _extends({}, state.filters, {
      features: _extends({}, state.filters.features, {
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
   getHref
   Used to construction URLs when linking out to other pages
*/


exports.calculateFeatureAvailability = calculateFeatureAvailability;

var getHref = function getHref(key) {
  var arg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var EXPLORE_DATA_PRODUCTS_BASE = 'https://data.neonscience.org/data-products/explore';

  switch (key) {
    case 'EXPLORE_DATA_PRODUCTS_BY_SITE':
      return "".concat(EXPLORE_DATA_PRODUCTS_BASE, "?site=").concat(arg);

    case 'EXPLORE_DATA_PRODUCTS_BY_STATE':
      return "".concat(EXPLORE_DATA_PRODUCTS_BASE, "?state=").concat(arg);

    case 'EXPLORE_DATA_PRODUCTS_BY_DOMAIN':
      return "".concat(EXPLORE_DATA_PRODUCTS_BASE, "?domain=").concat(arg);

    case 'SITE_DETAILS':
      return "https://www.neonscience.org/field-sites/field-sites-map/".concat(arg);

    case 'DOMAIN_DETAILS':
      return "https://www.neonscience.org/domains/".concat(arg);

    default:
      return '#';
  }
};
/**
 Map Base Layers
 Third party services providing tiles for different earth views (topographic, satellite, etc.)
 with attributions. Only one base layer can be shown at a time.
*/


exports.getHref = getHref;
var BASE_LAYERS = {
  NATGEO_WORLD_MAP: {
    title: 'National Geographic',
    shortAttribution: '© Natl. Geographic et al.',
    fullAttribution: '© National Geographic, Esri, Garmin, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}'
  },
  WORLD_IMAGERY: {
    title: 'Satellite Imagery',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  },
  WORLD_STREET_MAP: {
    title: 'Streets',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, OSM contributors, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
  },
  WORLD_TOPO_MAP: {
    title: 'Topographic',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, HERE, Garmin, Intermap, iPC, GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), OSM contributors, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
  }
};
exports.BASE_LAYERS = BASE_LAYERS;
var BASE_LAYERS_BY_TITLE = {};
exports.BASE_LAYERS_BY_TITLE = BASE_LAYERS_BY_TITLE;
Object.keys(BASE_LAYERS).forEach(function (key) {
  BASE_LAYERS[key].KEY = key;
  BASE_LAYERS_BY_TITLE[BASE_LAYERS[key].title] = key;
});
/**
 Map Overlays
 Third party services providing tiles for different environmental contexts. These layers are similar
 to base layers in that they cover most or all of the observatory if not the whole planet. They add
 additional context from a third party data source, such as NLCD.
*/

var OVERLAY_GROUPS = {
  NLCD_2001: {
    title: 'National Land Cover Database (NLCD) 2001',
    description: 'National Land Cover Database (NLCD) 2001 release data from the Multi-Resolution Land Characteristics (MRLC) consortium',
    commonProps: {
      format: 'image/png',
      transparent: true
    }
  }
};
exports.OVERLAY_GROUPS = OVERLAY_GROUPS;
var OVERLAY_GROUPS_BY_TITLE = {};
exports.OVERLAY_GROUPS_BY_TITLE = OVERLAY_GROUPS_BY_TITLE;
Object.keys(OVERLAY_GROUPS).forEach(function (key) {
  OVERLAY_GROUPS[key].KEY = key;
  OVERLAY_GROUPS_BY_TITLE[OVERLAY_GROUPS[key].title] = key;
});
var OVERLAYS = {
  LAND_COVER: {
    group: OVERLAY_GROUPS.NLCD_2001.KEY,
    title: 'Land Cover',
    description: 'Nationwide data on land cover at a 30m resolution with a 16-class legend based on a modified Anderson Level II classification system',
    commonProps: {
      attribution: '© MRLC / USGS'
    },
    legend: NLCD_CLASSES,
    components: [{
      type: 'WMSTileLayer',
      key: 'L48',
      props: {
        url: 'https://www.mrlc.gov/geoserver/mrlc_display/NLCD_2001_Land_Cover_L48/wms?',
        layers: 'NLCD_2001_Land_Cover_L48'
      }
    }, {
      type: 'WMSTileLayer',
      key: 'AK',
      props: {
        url: 'https://www.mrlc.gov/geoserver/mrlc_display/NLCD_2001_Land_Cover_AK/wms?',
        layers: 'NLCD_2001_Land_Cover_AK'
      }
    }, {
      type: 'WMSTileLayer',
      key: 'HI',
      props: {
        url: 'https://www.mrlc.gov/geoserver/mrlc_display/NLCD_2001_Land_Cover_HI/wms?',
        layers: 'NLCD_2001_Land_Cover_HI'
      }
    }, {
      type: 'WMSTileLayer',
      key: 'PR',
      props: {
        url: 'https://www.mrlc.gov/geoserver/mrlc_display/NLCD_2001_Land_Cover_PR/wms?',
        layers: 'NLCD_2001_Land_Cover_PR'
      }
    }]
  },
  IMPERVIOUS: {
    group: OVERLAY_GROUPS.NLCD_2001.KEY,
    title: 'Urban Impervious Surfaces',
    description: 'Urban impervious surfaces as a percentage of developed surface over every 30-meter pixel in the United States',
    commonProps: {
      attribution: '© MRLC / USGS'
    },
    legend: {
      10: {
        name: '10%',
        description: '10% of the surface of a given 30-meter pixel is impervious',
        color: '#d6bcbc'
      },
      20: {
        name: '20%',
        description: '20% of the surface of a given 30-meter pixel is impervious',
        color: '#dba8a8'
      },
      30: {
        name: '30%',
        description: '30% of the surface of a given 30-meter pixel is impervious',
        color: '#dd9393'
      },
      40: {
        name: '40%',
        description: '40% of the surface of a given 30-meter pixel is impervious',
        color: '#e27c7c'
      },
      50: {
        name: '50%',
        description: '50% of the surface of a given 30-meter pixel is impervious',
        color: '#e86868'
      },
      60: {
        name: '60%',
        description: '60% of the surface of a given 30-meter pixel is impervious',
        color: '#ea5151'
      },
      70: {
        name: '70%',
        description: '70% of the surface of a given 30-meter pixel is impervious',
        color: '#f23d3d'
      },
      80: {
        name: '80%',
        description: '80% of the surface of a given 30-meter pixel is impervious',
        color: '#ed82ed'
      },
      90: {
        name: '90%',
        description: '90% of the surface of a given 30-meter pixel is impervious',
        color: '#c64fed'
      },
      100: {
        name: '100%',
        description: '100% of the surface of a given 30-meter pixel is impervious',
        color: '#9e21ed'
      }
    },
    components: [{
      type: 'WMSTileLayer',
      key: 'L48',
      props: {
        url: 'https://www.mrlc.gov/geoserver/mrlc_display/NLCD_2001_Impervious_L48/wms?',
        layers: 'NLCD_2001_Impervious_L48'
      }
    }, {
      type: 'WMSTileLayer',
      key: 'AK',
      props: {
        url: 'https://www.mrlc.gov/geoserver/mrlc_display/NLCD_2001_Impervious_AK/wms?',
        layers: 'NLCD_2001_Impervious_AK'
      }
    }, {
      type: 'WMSTileLayer',
      key: 'HI',
      props: {
        url: 'https://www.mrlc.gov/geoserver/mrlc_display/NLCD_2001_Impervious_HI/wms?',
        layers: 'NLCD_2001_Impervious_HI'
      }
    }, {
      type: 'WMSTileLayer',
      key: 'PR',
      props: {
        url: 'https://www.mrlc.gov/geoserver/mrlc_display/NLCD_2001_Impervious_PR/wms?',
        layers: 'NLCD_2001_Impervious_PR'
      }
    }]
  }
};
exports.OVERLAYS = OVERLAYS;
Object.keys(OVERLAYS).forEach(function (key) {
  OVERLAYS[key].KEY = key;
});
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
    data: null,
    fetch: {
      status: null,
      error: null
    },
    isAtCenter: false // Boolean to track when the map moves off of a focus location by the user

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
    baseLayer: null,
    baseLayerAutoChangedAbove17: false,
    overlays: new Set(),
    mouseMode: MAP_MOUSE_MODES.PAN,
    zoomedIcons: {},
    repositionOpenPopupFunc: null,
    isDraggingAreaSelection: false
  },
  selection: {
    active: null,
    // Set to any key in SELECTABLE_FEATURE_TYPES
    limit: null,
    // null (unlimited), a non-zero positive integer, or an integer range
    valid: false,
    // whether the current selection is non-emtpy and valid per the limit
    set: new Set(),
    // set of selected values
    validSet: null,
    // optional subset of all values in the selectable feature to be selectable
    hideUnselectable: false,
    // whether any unselectable elements in the set are rendered
    showSummary: false,
    // whether to show the selection summary element
    changed: false,
    // whether selection has changed warranting an onChange event
    onChange: function onChange() {},
    // Function that fires whenever state.selection changes
    derived: (_derived = {}, _defineProperty(_derived, FEATURES.STATES.KEY, {}), _defineProperty(_derived, FEATURES.DOMAINS.KEY, {}), _derived)
  },
  featureDataFetchesHasAwaiting: false,
  // Boolean: track whether any data fetches are awaiting call
  featureDataFetches: Object.fromEntries(Object.keys(FEATURE_DATA_SOURCES).filter(function (dataSource) {
    return dataSource !== FEATURE_DATA_SOURCES.NEON_CONTEXT;
  }).map(function (dataSource) {
    return [dataSource, {}];
  })),
  featureData: Object.fromEntries(Object.keys(FEATURE_TYPES).filter(function (featureType) {
    return featureType !== FEATURE_TYPES.SAMPLING_POINTS;
  }).map(function (featureType) {
    return [featureType, {}];
  })),
  sites: {},
  // Sites data is split into 4 features making it hard to look up, so extra refs here
  filters: {
    search: null,
    legendOpen: false,
    // whether the legend pane is open/visible
    features: {
      available: {},
      visible: Object.fromEntries( // key/bool map of which available features are visible
      Object.keys(FEATURES).map(function (key) {
        return [key, !featureIsHiddenByDefault(key)];
      })),
      collapsed: new Set() // Collapsed (not expanded) since the default for features is expanded

    },
    overlays: {
      expanded: new Set() // Expanded since the default for overlay legends is collapsed

    }
  },
  fullscreen: false
}; // Initialize featureData and featureDataFetches objects for all features that have a dataSource

exports.DEFAULT_STATE = DEFAULT_STATE;
Object.keys(FEATURES).filter(function (featureKey) {
  return Object.keys(FEATURE_DATA_SOURCES).includes(FEATURES[featureKey].dataSource);
}).forEach(function (featureKey) {
  var _FEATURES$featureKey = FEATURES[featureKey],
      featureType = _FEATURES$featureKey.type,
      dataSource = _FEATURES$featureKey.dataSource; // Initialize featureData
  // SAMPLING_POINTS are stored as geometry of their parent locations so don't need initialization

  if (featureType !== FEATURE_TYPES.SAMPLING_POINTS) {
    DEFAULT_STATE.featureData[featureType][featureKey] = {};
  } // Initialize featureDataFetches based on dataSource
  // ARCGIS_ASSETS_API and REST_LOCATIONS_API: grouped by feature key
  // GRAPHQL_LOCATIONS_API: grouped by feature minZoom


  if ([FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API, FEATURE_DATA_SOURCES.REST_LOCATIONS_API].includes(dataSource)) {
    DEFAULT_STATE.featureDataFetches[dataSource][featureKey] = {};
  }

  if (dataSource === FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API) {
    var minZoom = GRAPHQL_LOCATIONS_API_CONSTANTS.FEATURES_TO_MINZOOM_MAP[featureKey];
    DEFAULT_STATE.featureDataFetches[dataSource][minZoom] = {};
  }
}); // Location Hierarchies (REST_LOCATIONS_API, not in the FEATURES structure since it doesn't render)
// eslint-disable-next-line max-len

DEFAULT_STATE.featureDataFetches[FEATURE_DATA_SOURCES.REST_LOCATIONS_API][FEATURE_TYPES.SITE_LOCATION_HIERARCHIES] = {}; // Initialize feature availability

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
  var newState = _extends({}, state, {
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
    newState.featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.STATES.KEY][stateCode] = _extends({}, newState.featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.STATES.KEY][stateCode], neonContextData.states[stateCode], {
      sites: neonContextData.stateSites[stateCode]
    });
  }); // Domains

  Object.keys(neonContextData.domains).forEach(function (domainCode) {
    newState.featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.DOMAINS.KEY][domainCode] = _extends({}, newState.featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.DOMAINS.KEY][domainCode], neonContextData.domains[domainCode], {
      sites: neonContextData.domainSites[domainCode]
    });
  });
  return newState;
};
/**
   PropTypes and defaultProps
*/


exports.hydrateNeonContextData = hydrateNeonContextData;

var SelectionLimitPropType = function SelectionLimitPropType(props, propName) {
  var prop = props[propName];

  if (typeof prop === 'number') {
    if (!Number.isInteger(prop) || prop < 1) {
      return new Error("When setting ".concat(propName, " as a number it must be an integer greater than 0"));
    }

    return null;
  }

  if (Array.isArray(prop)) {
    if (prop.length !== 2 || !prop.every(function (x) {
      return Number.isInteger(x) && x > 0;
    }) || prop[0] >= prop[1]) {
      return new Error( // eslint-disable-next-line max-len
      "When setting ".concat(propName, " as an array it must contain exactly two distinct non-zero positive integers in ascending order (e.g. [2, 5])"));
    }

    return null;
  }

  if (prop !== null && typeof prop !== 'undefined') {
    return new Error( // eslint-disable-next-line max-len
    "".concat(propName, " must be null, a positive non-zero integer, or an array of two ascending non-zero positive integers."));
  }

  return null;
};

var SITE_MAP_PROP_TYPES = {
  // Top-level Props
  view: _propTypes.default.oneOf(Object.keys(VIEWS).map(function (k) {
    return k.toLowerCase();
  })),
  aspectRatio: _propTypes.default.number,
  fullscreen: _propTypes.default.bool,
  unusableVerticalSpace: _propTypes.default.number,
  // Map Props
  mapCenter: _propTypes.default.arrayOf(_propTypes.default.number),
  mapZoom: _propTypes.default.number,
  mapBaseLayer: _propTypes.default.oneOf(Object.keys(BASE_LAYERS)),
  // mapOverlays: PropTypes.arrayOf(Object.keys(OVERLAYS)),
  // Initial map focus (overrides mapCenter and mapZoom)
  location: _propTypes.default.string,
  // Selection Props
  selection: _propTypes.default.oneOf(Object.keys(SELECTABLE_FEATURE_TYPES)),
  selectedItems: _propTypes.default.arrayOf(_propTypes.default.string),
  validItems: _propTypes.default.arrayOf(_propTypes.default.string),
  selectionLimit: SelectionLimitPropType,
  onSelectionChange: _propTypes.default.func,
  // Filter Props
  search: _propTypes.default.string,
  features: _propTypes.default.arrayOf(_propTypes.default.oneOf(Object.keys(FEATURES)))
};
exports.SITE_MAP_PROP_TYPES = SITE_MAP_PROP_TYPES;
var SITE_MAP_DEFAULT_PROPS = {
  // Top-level Props
  view: VIEWS.MAP.toLowerCase(),
  aspectRatio: null,
  fullscreen: false,
  unusableVerticalSpace: 0,
  // Map Props
  mapCenter: OBSERVATORY_CENTER,
  mapZoom: null,
  mapBaseLayer: Object.keys(BASE_LAYERS)[0],
  // mapOverlays: null,
  // Initial map focus (overrides mapCenter and mapZoom)
  location: null,
  // Selection Props
  selection: null,
  selectedItems: [],
  validItems: null,
  selectionLimit: null,
  onSelectionChange: function onSelectionChange() {},
  // Filter Props
  search: null,
  features: null
};
/**
   Icon Utility Functions
   These appear here because of how Leaflet handles icons. Each icon must be a L.Icon instance,
   but many of our icons repeat. We also want to scale our icons with the zoom level. As such,
   we generate a stat structure containing only one instance of each distinct icon type scaled
   to the current zoom level and keep that in state. It is regenerated any time the zoom changes.
*/
// Get a single zoomed Leaflet icon instance

exports.SITE_MAP_DEFAULT_PROPS = SITE_MAP_DEFAULT_PROPS;

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
  var maxZoom = feature.maxZoom || (FEATURES[feature.parent] || {}).maxZoom || MAP_ZOOM_RANGE[1]; // Use a deep clone of the base SVG shape object so that we can modify destructured data
  // for variants like "selected" icons

  var baseSvgShape = (0, _cloneDeep.default)(LOCATION_ICON_SVG_SHAPES[iconShape]);
  var popupAnchor = baseSvgShape.popupAnchor,
      shadow = baseSvgShape.shadow;
  var iconSize = baseSvgShape.iconSize,
      iconAnchor = baseSvgShape.iconAnchor;

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
    iconAnchor = iconAnchor.map(function (d) {
      return d + SELECTED_ICON_OFFSET / 2;
    });
    shadowSize = shadowUrl ? shadowSize.map(function (d) {
      return d + SELECTED_ICON_OFFSET;
    }) : null;
    shadowAnchor = shadowUrl ? shadowAnchor.map(function (d) {
      return d + SELECTED_ICON_OFFSET / 2;
    }) : null;
    popupAnchor[1] -= SELECTED_ICON_OFFSET / 2;
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
      if (selection === SELECTION_STATUS.SELECTED && !Object.keys(SELECTABLE_FEATURE_TYPES).includes(FEATURES[key].type)) {
        return;
      }

      icons[key][selection] = {};
      Object.keys(HIGHLIGHT_STATUS).forEach(function (highlight) {
        icons[key][selection][highlight] = getZoomedIcon(key, zoom, highlight, selection);
      });
    });
  });
  return icons;
}; // Creare a temporary non-rendering empty Leaflet map with dimensions, center, and zoom all
// identical to a given state. This is necessary whenever needing to do pixel/latlon projections.


exports.getZoomedIcons = getZoomedIcons;

var getPhantomLeafletMap = function getPhantomLeafletMap(state) {
  var _state$aspectRatio = state.aspectRatio,
      aspectRatio = _state$aspectRatio.currentValue,
      widthReference = _state$aspectRatio.widthReference;

  _leaflet.default.Map.include({
    getSize: function getSize() {
      return new _leaflet.default.Point(widthReference, widthReference * aspectRatio);
    }
  });

  var element = document.createElement('div');
  var map = new _leaflet.default.Map(element, {
    center: state.map.center,
    zoom: state.map.zoom
  });
  return map;
};

var getMapStateForFocusLocation = function getMapStateForFocusLocation() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var focusLocation = state.focusLocation;

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
    newState.map.zoomedIcons = getZoomedIcons(newState.map.zoom);
    var phantomMap = getPhantomLeafletMap(newState);
    var newBounds = phantomMap.getBounds() || null;
    newState.map.bounds = !newBounds ? null : {
      /* eslint-disable no-underscore-dangle */
      lat: [newBounds._southWest.lat, newBounds._northEast.lat],
      lng: [newBounds._southWest.lng, newBounds._northEast.lng]
      /* eslint-enable no-underscore-dangle */

    };
  } // Register the focusLocation as being at the map center


  newState.focusLocation.isAtCenter = true; // Done

  return newState.map;
};
/**
   Aspect Ratio
*/


exports.getMapStateForFocusLocation = getMapStateForFocusLocation;
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

exports.getDynamicAspectRatio = getDynamicAspectRatio;

var boundsAreValid = function boundsAreValid(bounds) {
  return _typeof(bounds) === 'object' && bounds !== null && Object.keys(bounds).every(function (key) {
    return ['lat', 'lng'].includes(key) && Array.isArray(bounds[key]) && bounds[key].length === 2 && bounds[key].every(function (v) {
      return typeof v === 'number';
    }) && bounds[key][1] > bounds[key][0];
  });
};

exports.boundsAreValid = boundsAreValid;

var calculateLocationsInBounds = function calculateLocationsInBounds(locations) // Number, a margin to add/subtract to lat/lon for a point's hit box
{
  var bounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var extendMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var extendPoints = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  if (!locations || _typeof(locations) !== 'object' || !Object.keys(locations).length) {
    return [];
  }

  if (bounds === null) {
    return Object.keys(locations);
  }

  if (!boundsAreValid(bounds)) {
    return [];
  }

  var extendedBounds = !extendMap ? bounds : Object.fromEntries(Object.keys(bounds).map(function (dir) {
    var buffer = (bounds[dir][1] - bounds[dir][0]) / 2;
    return [dir, [bounds[dir][0] - buffer, bounds[dir][1] + buffer]];
  })); // This function flattens a geometry object to just coordinates so we can check if a boundary
  // is in the map. NOTE: extendPoints does not work with boundaries, only solitary points.

  var flatten = function flatten(items) {
    var isCoord = function isCoord(c) {
      return Array.isArray(c) && c.length === 2 && c.every(function (x) {
        return Number.isFinite(x);
      });
    };

    var flat = [];
    items.forEach(function (item) {
      if (Array.isArray(item) && !isCoord(item)) {
        flat.push.apply(flat, _toConsumableArray(flatten(item)));
      } else {
        flat.push(item);
      }
    });
    return flat;
  };

  var isInBounds = function isInBounds(loc) {
    if (Number.isFinite(loc.latitude) && Number.isFinite(loc.longitude)) {
      if (extendPoints > 0) {
        var lats = [loc.latitude - extendPoints, loc.latitude + extendPoints];
        var lngs = [loc.longitude - extendPoints, loc.longitude + extendPoints];
        return !(lats[0] > extendedBounds.lat[1] || lats[1] < extendedBounds.lat[0] || lngs[0] > extendedBounds.lng[1] || lngs[1] < extendedBounds.lng[0]);
      }

      return loc.latitude >= extendedBounds.lat[0] && loc.latitude <= extendedBounds.lat[1] && loc.longitude >= extendedBounds.lng[0] && loc.longitude <= extendedBounds.lng[1];
    }

    if (loc.geometry && loc.geometry.coordinates) {
      var flatCoords = flatten(loc.geometry.coordinates);
      return flatCoords.some(function (coord) {
        return coord.latitude >= extendedBounds.lat[0] && coord.latitude <= extendedBounds.lat[1] && coord.longitude >= extendedBounds.lng[0] && coord.longitude <= extendedBounds.lng[1];
      });
    }

    return false;
  };

  return Object.keys(locations).filter(function (locId) {
    return isInBounds(locations[locId]);
  });
};

exports.calculateLocationsInBounds = calculateLocationsInBounds;

var deriveFullObservatoryZoomLevel = function deriveFullObservatoryZoomLevel(mapRef) {
  var FALLBACK_ZOOM = 2;

  if (!mapRef.current) {
    return FALLBACK_ZOOM;
  }

  var container = mapRef.current.container.parentElement;
  var divisor = 23 * 8;
  var minorDim = Math.min(container.clientWidth / divisor, container.clientHeight / divisor);
  var derivedZoom = [1, 2, 4, 6, 11].findIndex(function (m) {
    return m > minorDim;
  });
  return derivedZoom === -1 ? FALLBACK_ZOOM : derivedZoom;
};

exports.deriveFullObservatoryZoomLevel = deriveFullObservatoryZoomLevel;