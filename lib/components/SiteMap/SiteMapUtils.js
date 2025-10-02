"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseManualLocationFeatureData = exports.mapIsAtFocusLocation = exports.isCoord = exports.hydrateNeonContextData = exports.getZoomedIcons = exports.getZoomedIcon = exports.getPhantomLeafletMap = exports.getMapStateForManualLocationData = exports.getMapStateForFocusLocation = exports.getHref = exports.getDynamicAspectRatio = exports.getDefaultState = exports.findCentroid = exports.deriveFullObservatoryZoomLevel = exports.calculateLocationsInBounds = exports.calculateFeatureAvailability = exports.boundsAreValid = exports.VIEWS = exports.UNSELECTABLE_MARKER_FILTER = exports.SORT_DIRECTIONS = exports.SITE_TERRAINS = exports.SITE_MAP_PROP_TYPES = exports.SITE_MAP_DEFAULT_PROPS = exports.SITE_LOCATION_HIERARCHIES_MIN_ZOOM = exports.SELECTION_STATUS = exports.SELECTION_PORTIONS = exports.PLOT_SAMPLING_MODULES = exports.OVERLAY_GROUPS_BY_TITLE = exports.OVERLAY_GROUPS = exports.OVERLAYS = exports.OBSERVATORY_CENTER = exports.NLCD_CLASSES = exports.MIN_TABLE_MAX_BODY_HEIGHT = exports.MIN_CONTAINER_HEIGHT = exports.MAP_ZOOM_RANGE = exports.MAP_MOUSE_MODES = exports.MANUAL_LOCATION_TYPES = exports.LOCATION_ICON_SVG_SHAPES = exports.LOCATION_BOUNDS_SAMPLING_MAX = exports.KM2_TO_ACRES = exports.HIGHLIGHT_STATUS = exports.GRAPHQL_LOCATIONS_API_CONSTANTS = exports.FETCH_STATUS = exports.FEATURE_TYPES = exports.FEATURE_DATA_SOURCES = exports.FEATURES = exports.BOUNDARY_COLORS = exports.BASE_LAYERS_BY_TITLE = exports.BASE_LAYERS = void 0;
var _propTypes = _interopRequireDefault(require("prop-types"));
var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));
var _leaflet = _interopRequireDefault(require("leaflet"));
var _Theme = require("../Theme/Theme");
var _RouteService = _interopRequireDefault(require("../../service/RouteService"));
var _typeUtil = require("../../util/typeUtil");
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
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
var _iconSiteGradientTerrestrial = _interopRequireDefault(require("./svg/icon-site-gradient-terrestrial.svg"));
var _iconSiteGradientTerrestrialSelected = _interopRequireDefault(require("./svg/icon-site-gradient-terrestrial-selected.svg"));
var _iconSiteGradientAquatic = _interopRequireDefault(require("./svg/icon-site-gradient-aquatic.svg"));
var _iconSiteGradientAquaticSelected = _interopRequireDefault(require("./svg/icon-site-gradient-aquatic-selected.svg"));
var _iconSiteDecommissioned = _interopRequireDefault(require("./svg/icon-site-decommissioned.svg"));
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
var _biorepoDatasets = _interopRequireDefault(require("../../staticJSON/biorepoDatasets.json"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } // SVGs for all map icons
// Static JSON for Boundary features
// Static JSON for Biorepository dataset IDs
const round = x => Number.parseFloat(x.toFixed(4), 10);
const isCoord = c => Array.isArray(c) && c.length === 2 && c.every(x => Number.isFinite(x));
exports.isCoord = isCoord;
const MAP_ZOOM_RANGE = exports.MAP_ZOOM_RANGE = [1, 19];
const OBSERVATORY_CENTER = exports.OBSERVATORY_CENTER = [52.68, -110.75];
const MIN_CONTAINER_HEIGHT = exports.MIN_CONTAINER_HEIGHT = 300;
const MIN_TABLE_MAX_BODY_HEIGHT = exports.MIN_TABLE_MAX_BODY_HEIGHT = 100;
const KM2_TO_ACRES = exports.KM2_TO_ACRES = 247.10538146717;

// Maximum number of points that will be used for determining whether or not
// a location is within the current bounds of the viewport of the map.
// This will control how a large set of coordinates is down sampled.
const LOCATION_BOUNDS_SAMPLING_MAX = exports.LOCATION_BOUNDS_SAMPLING_MAX = 10000;

// Minimum zoom level at which location hierarchy fetches are done on a per-domain basis
// We don't do per-site because hierarchy query performance is a function of number of immediate
// children. Domains top out at 8 or so sites, while sites may have over a hundred children (plots)
// Note that while we FETCH at the domain level we parse down to the site level as that's what's
// most useful for generating subsequent fetches
const SITE_LOCATION_HIERARCHIES_MIN_ZOOM = exports.SITE_LOCATION_HIERARCHIES_MIN_ZOOM = 9;

/**
   Key Sets
   Used to limit the use of "magic strings" that need to be consistent across many files
*/
// For consistency in expressing the sort direction for the table
const SORT_DIRECTIONS = exports.SORT_DIRECTIONS = {
  ASC: 'ASC',
  DESC: 'DESC'
};

// For consistency in expressing site terrain
const SITE_TERRAINS = exports.SITE_TERRAINS = {
  AQUATIC: 'AQUATIC',
  TERRESTRIAL: 'TERRESTRIAL'
};

// For consistency in expressing the types of manual location data fed in through props
const MANUAL_LOCATION_TYPES = exports.MANUAL_LOCATION_TYPES = {
  PROTOTYPE_SITE: 'PROTOTYPE_SITE'
};

// For consistency in differentiating discrete sets of data that can be tabulated together.
// e.g. all LOCATIONS type feature data can coexist in a single table view with a
// single column definition. But LOCATIONS and SITES shouldn't, as each set has
// different common attributes that should map to table columns (yes, sites are locations too,
// but we represent and interact with them differently)
const FEATURE_TYPES = exports.FEATURE_TYPES = {
  SITES: {
    unit: 'site',
    units: 'sites',
    selectable: true,
    viewableInTable: true,
    deriveRegionSelections: true
  },
  SITE_LOCATION_HIERARCHIES: {
    selectable: false
  },
  LOCATIONS: {
    selectable: false,
    viewableInTable: true
  },
  SAMPLING_POINTS: {
    selectable: false
  },
  BOUNDARIES: {
    selectable: false
  },
  DOMAINS: {
    unit: 'domain',
    units: 'domains',
    selectable: true,
    viewableInTable: true
  },
  STATES: {
    unit: 'state',
    units: 'states',
    selectable: true,
    viewableInTable: true
  },
  GROUP: {
    selectable: false
  },
  OTHER: {
    // All features require a type. This catch-all type will not show in the table.
    selectable: false
  }
};
// Replicate keys as attributes to completely eliminate the need to write a feature type key string
Object.keys(FEATURE_TYPES).forEach(key => {
  FEATURE_TYPES[key].KEY = key;
});

// For consistency in differentiating where feature data come from
// (e.g. various fetch APIs, NeonContext)
const FEATURE_DATA_SOURCES = exports.FEATURE_DATA_SOURCES = {
  REST_LOCATIONS_API: 'REST_LOCATIONS_API',
  GRAPHQL_LOCATIONS_API: 'GRAPHQL_LOCATIONS_API',
  ARCGIS_ASSETS_API: 'ARCGIS_ASSETS_API',
  NEON_CONTEXT: 'NEON_CONTEXT',
  MANUAL_LOCATIONS: 'MANUAL_LOCATIONS' // data injected by manualLocationData prop
};
const SELECTED_ICON_OFFSET = 30; // Number of pixels bigger in one dimension for selected icons

// For consistency in denoting whether all or some of a region's selectable children are selected
const SELECTION_PORTIONS = exports.SELECTION_PORTIONS = {
  PARTIAL: 'PARTIAL',
  TOTAL: 'TOTAL'
};

// For consistency in denoting the selection status of any selectable thing
const SELECTION_STATUS = exports.SELECTION_STATUS = {
  SELECTED: 'SELECTED',
  UNSELECTED: 'UNSELECTED'
};

// For consistency in visually fading unselectable marker icons
const UNSELECTABLE_MARKER_FILTER = exports.UNSELECTABLE_MARKER_FILTER = 'sepia(0.8) contrast(0.3) brightness(1.35)';

// For consistency in denoting the highlight status of a marker
const HIGHLIGHT_STATUS = exports.HIGHLIGHT_STATUS = {
  NONE: 'NONE',
  HIGHLIGHT: 'HIGHLIGHT',
  SELECT: 'SELECT'
};

// For consistency in denoting which dinstinct user interfaces are available and which is visible
const VIEWS = exports.VIEWS = {
  MAP: 'MAP',
  TABLE: 'TABLE',
  SPLIT: 'SPLIT'
};

// For consistency in denoting exclusive available mouse behaviors on the map
const MAP_MOUSE_MODES = exports.MAP_MOUSE_MODES = {
  PAN: 'PAN',
  AREA_SELECT: 'AREA_SELECT'
};

// For consistency in tracking the current status of a fetch or import
const FETCH_STATUS = exports.FETCH_STATUS = {
  AWAITING_CALL: 'AWAITING_CALL',
  FETCHING: 'FETCHING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS'
};
const PLOT_SAMPLING_MODULES = exports.PLOT_SAMPLING_MODULES = {
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
};

// Source: https://www.mrlc.gov/data/legends/national-land-cover-database-2001-nlcd2001-legend
const NLCD_CLASSES = exports.NLCD_CLASSES = {
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
const LOCATION_ICON_SVG_SHAPES = exports.LOCATION_ICON_SVG_SHAPES = {
  CIRCLE: {
    KEY: 'CIRCLE',
    iconSize: [80, 80],
    iconAnchor: [40, 40],
    popupAnchor: [0, -40],
    shadow: {
      [HIGHLIGHT_STATUS.NONE]: {
        svg: _iconShapeCircleShadow.default,
        size: [100, 100],
        anchor: [50, 50]
      },
      [HIGHLIGHT_STATUS.HIGHLIGHT]: {
        svg: _iconShapeCircleHighlight.default,
        size: [120, 120],
        anchor: [60, 60]
      },
      [HIGHLIGHT_STATUS.SELECT]: {
        svg: _iconShapeCircleSelect.default,
        size: [120, 120],
        anchor: [60, 60]
      }
    }
  },
  DIAMOND: {
    KEY: 'DIAMOND',
    iconSize: [100, 100],
    iconAnchor: [50, 50],
    popupAnchor: [0, -50],
    shadow: {
      [HIGHLIGHT_STATUS.NONE]: {
        svg: _iconShapeDiamondShadow.default,
        size: [124, 124],
        anchor: [62, 62]
      },
      [HIGHLIGHT_STATUS.HIGHLIGHT]: {
        svg: _iconShapeDiamondHighlight.default,
        size: [144, 144],
        anchor: [72, 72]
      },
      [HIGHLIGHT_STATUS.SELECT]: {
        svg: _iconShapeDiamondSelect.default,
        size: [144, 144],
        anchor: [72, 72]
      }
    }
  },
  HOMEPLATE: {
    KEY: 'HOMEPLATE',
    iconSize: [80, 90],
    iconAnchor: [40, 45],
    popupAnchor: [0, -45],
    shadow: {
      [HIGHLIGHT_STATUS.NONE]: {
        svg: _iconShapeHomeplateShadow.default,
        size: [101, 111],
        anchor: [50.5, 55.5]
      },
      [HIGHLIGHT_STATUS.HIGHLIGHT]: {
        svg: _iconShapeHomeplateHighlight.default,
        size: [121, 131],
        anchor: [60.5, 65.5]
      },
      [HIGHLIGHT_STATUS.SELECT]: {
        svg: _iconShapeHomeplateSelect.default,
        size: [121, 131],
        anchor: [60.5, 65.5]
      }
    }
  },
  SQUARE: {
    KEY: 'SQUARE',
    iconSize: [75, 75],
    iconAnchor: [37.5, 37.5],
    popupAnchor: [0, -37.5],
    shadow: {
      [HIGHLIGHT_STATUS.NONE]: {
        svg: _iconShapeSquareShadow.default,
        size: [94, 94],
        anchor: [47, 47]
      },
      [HIGHLIGHT_STATUS.HIGHLIGHT]: {
        svg: _iconShapeSquareHighlight.default,
        size: [114, 114],
        anchor: [57, 57]
      },
      [HIGHLIGHT_STATUS.SELECT]: {
        svg: _iconShapeSquareSelect.default,
        size: [114, 114],
        anchor: [57, 57]
      }
    }
  }
};

/**
   FEATURES
   A data structure describing all descrete boundaries or sets of icons that can be shown on the map
   Convention: all keys are consistently plural
   Order is draw order on map (so largest boundary features should be first)
*/
const FEATURES = exports.FEATURES = {
  // States and Domains
  STATES: {
    name: 'US States',
    nameSingular: 'US State',
    type: FEATURE_TYPES.STATES.KEY,
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
    type: FEATURE_TYPES.DOMAINS.KEY,
    hideByDefault: true,
    dataSource: FEATURE_DATA_SOURCES.NEON_CONTEXT,
    primaryIdOnly: true,
    featureShape: 'Polygon',
    matchLocationType: 'DOMAIN',
    amplifyHighlighted: true,
    style: {
      color: '#885eba',
      weight: 8
    }
  },
  // Various Boundary Types
  FLIGHT_BOX_BOUNDARIES: {
    name: 'AOP Flight Box Boundaries',
    nameSingular: 'AOP Flight Box Boundary',
    type: FEATURE_TYPES.BOUNDARIES.KEY,
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
    type: FEATURE_TYPES.GROUP.KEY,
    minZoom: 7
  },
  WATERSHED_BOUNDARIES: {
    name: 'Watershed Boundaries',
    nameSingular: 'Watershed Boundary',
    type: FEATURE_TYPES.BOUNDARIES.KEY,
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
    type: FEATURE_TYPES.OTHER.KEY,
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
    type: FEATURE_TYPES.OTHER.KEY,
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
    type: FEATURE_TYPES.BOUNDARIES.KEY,
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
    type: FEATURE_TYPES.BOUNDARIES.KEY,
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
    type: FEATURE_TYPES.BOUNDARIES.KEY,
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
    type: FEATURE_TYPES.GROUP.KEY,
    minZoom: 10,
    fetchingForFeatures: ['TOWER_BASE_PLOTS', 'DISTRIBUTED_BASE_PLOTS']
  },
  TOWERS: {
    name: 'Tower Locations',
    nameSingular: 'Tower Location',
    type: FEATURE_TYPES.LOCATIONS.KEY,
    minZoom: 10,
    // Get from REST because fetching from GraphQL won't return children for a count of levels
    // (you can get children from GraphQL but it hoses performance and only this feature needs them)
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
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.GROUP.KEY,
    minZoom: 13,
    description: 'Tower plots provide a direct link between NEON’s Terrestrial Observation System and Terrestrial Instrument System. Tower Plots are located in and around the NEON tower primary and secondary airsheds.',
    parent: 'TERRESTRIAL_SITE_FEATURES'
  },
  TOWER_PHENOLOGY_PLOTS: {
    name: 'Tower Phenology Plots',
    nameSingular: 'Tower Phenology Plot',
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.GROUP.KEY,
    minZoom: 10,
    description: 'Distributed Plots are located throughout the TOS Sampling boundary in an effort to describe organisms and process with plot, point, and grid sampling. Plots were established according to a stratified-random and spatially balanced design.',
    parent: 'TERRESTRIAL_SITE_FEATURES'
  },
  DISTRIBUTED_BIRD_GRIDS: {
    name: 'Distributed Bird Grids',
    nameSingular: 'Distributed Bird Grid',
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.GROUP.KEY,
    minZoom: 14,
    description: 'Some types of distributed and tower plots may be represented by a boundary polygon in addition their marker icon to denote actual size and location.',
    parent: 'TERRESTRIAL_SITE_FEATURES'
  },
  TOWER_PHENOLOGY_PLOT_BOUNDARIES: {
    name: 'Phenology Plot Boundaries',
    nameSingular: 'Phenology Plot Boundary',
    type: FEATURE_TYPES.SAMPLING_POINTS.KEY,
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
    type: FEATURE_TYPES.SAMPLING_POINTS.KEY,
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
    type: FEATURE_TYPES.SAMPLING_POINTS.KEY,
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
    type: FEATURE_TYPES.SAMPLING_POINTS.KEY,
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
    type: FEATURE_TYPES.SAMPLING_POINTS.KEY,
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
    type: FEATURE_TYPES.GROUP.KEY,
    minZoom: 10
  },
  AQUATIC_BENCHMARKS: {
    name: 'Benchmarks',
    nameSingular: 'Benchmark',
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.GROUP.KEY,
    minZoom: 10,
    parent: 'AQUATIC_SITE_FEATURES'
  },
  AQUATIC_OBSERVATIONAL_SAMPLING: {
    name: 'Observational Sampling',
    type: FEATURE_TYPES.GROUP.KEY,
    minZoom: 11,
    parent: 'AQUATIC_SITE_FEATURES'
  },
  AQUATIC_RIPARIAN_ASSESSMENTS: {
    name: 'Riparian Assessments',
    nameSingular: 'Riparian Assessment',
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.LOCATIONS.KEY,
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
    type: FEATURE_TYPES.GROUP.KEY,
    maxZoom: 9
  },
  TERRESTRIAL_CORE_SITES: {
    name: 'Terrestrial Core Sites',
    nameSingular: 'Terrestrial Core Site',
    type: FEATURE_TYPES.SITES.KEY,
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
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    maxZoom: 9
  },
  TERRESTRIAL_GRADIENT_SITES: {
    name: 'Terrestrial Gradient Sites',
    nameSingular: 'Terrestrial Gradient Site',
    type: FEATURE_TYPES.SITES.KEY,
    description: 'Land-based; gradient location',
    parent: 'SITE_MARKERS',
    attributes: {
      type: 'GRADIENT',
      terrain: 'TERRESTRIAL'
    },
    dataSource: FEATURE_DATA_SOURCES.NEON_CONTEXT,
    primaryIdOnly: true,
    featureShape: 'Marker',
    iconScale: 1,
    iconSvg: _iconSiteGradientTerrestrial.default,
    iconSelectedSvg: _iconSiteGradientTerrestrialSelected.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
    maxZoom: 9
  },
  AQUATIC_CORE_SITES: {
    name: 'Aquatic Core Sites',
    nameSingular: 'Aquatic Core Site',
    type: FEATURE_TYPES.SITES.KEY,
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
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    maxZoom: 9
  },
  AQUATIC_GRADIENT_SITES: {
    name: 'Aquatic Gradient Sites',
    nameSingular: 'Aquatic Gradient Site',
    type: FEATURE_TYPES.SITES.KEY,
    description: 'Water-based; gradient location',
    parent: 'SITE_MARKERS',
    attributes: {
      type: 'GRADIENT',
      terrain: 'AQUATIC'
    },
    dataSource: FEATURE_DATA_SOURCES.NEON_CONTEXT,
    primaryIdOnly: true,
    featureShape: 'Marker',
    iconScale: 1,
    iconSvg: _iconSiteGradientAquatic.default,
    iconSelectedSvg: _iconSiteGradientAquaticSelected.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
    maxZoom: 9
  },
  DECOMMISSIONED_SITES: {
    name: 'Decommissioned Sites',
    nameSingular: 'Decommissioned Site',
    type: FEATURE_TYPES.SITES.KEY,
    description: 'No longer active in observatory',
    parent: 'SITE_MARKERS',
    attributes: {
      type: 'DECOMMISSIONED',
      terrain: 'DECOMMISSIONED'
    },
    dataSource: FEATURE_DATA_SOURCES.MANUAL_LOCATIONS,
    primaryIdOnly: true,
    featureShape: 'Marker',
    iconScale: 1,
    iconSvg: _iconSiteDecommissioned.default,
    iconSelectedSvg: _iconSiteDecommissioned.default,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
    maxZoom: 19
  }
};
// Replicate keys as attributes to completely eliminate the need to write a feature key string
Object.keys(FEATURES).forEach(key => {
  FEATURES[key].KEY = key;
});

/**
   GRAPHQL_LOCATIONS_API Constants
   The Locations API groups fetchable assets by minZoom (i.e. all assets for all locations features
   with the same minZoom are fetched together, for a given field site). Thus we want lookups of
   minZoom by feature key and vice versa. These values never change, so derive them now.
*/
// A mapping of feature key to minZoom for GRAPHQL_LOCATIONS_API dataSource features
const FEATURES_TO_MINZOOM_MAP = {};
Object.keys(FEATURES).filter(featureKey => FEATURES[featureKey].dataSource === FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API).forEach(featureKey => {
  const feature = FEATURES[featureKey];
  const minZoom = feature.minZoom || (FEATURES[feature.parent] || {}).minZoom || 0;
  FEATURES_TO_MINZOOM_MAP[featureKey] = minZoom;
});

// A mapping of minZoom level to feature keys (inversion of FEATURES_MINZOOM_MAP)
const MINZOOM_TO_FEATURES_MAP = {};
Object.keys(FEATURES_TO_MINZOOM_MAP).forEach(featureKey => {
  const minZoom = FEATURES_TO_MINZOOM_MAP[featureKey];
  if (!MINZOOM_TO_FEATURES_MAP[minZoom]) {
    MINZOOM_TO_FEATURES_MAP[minZoom] = [];
  }
  MINZOOM_TO_FEATURES_MAP[minZoom].push(featureKey);
});

// Roll all that up and export it
const GRAPHQL_LOCATIONS_API_CONSTANTS = exports.GRAPHQL_LOCATIONS_API_CONSTANTS = {
  FEATURES_TO_MINZOOM_MAP,
  MINZOOM_TO_FEATURES_MAP
};

// Common colors for selecatble boundary features
const BOUNDARY_COLORS = exports.BOUNDARY_COLORS = {
  partialSelected: _Theme.COLORS.LIGHT_BLUE[300],
  totalSelected: _Theme.COLORS.LIGHT_BLUE[500],
  hover: _Theme.COLORS.LIGHT_BLUE[100]
};
const calculateFeatureAvailability = state => {
  const featureIsAvailable = feature => {
    // Special case: show SITES group at all zoom levels if DECOMMISSIONED_SITES are also shown
    const hasDecomissionedSites = !!(state.manualLocationData || []).filter(manualLocation => manualLocation.manualLocationType === MANUAL_LOCATION_TYPES.PROTOTYPE_SITE && !state.sites[manualLocation.siteCode]).length;
    if (feature.KEY === 'SITE_MARKERS' && hasDecomissionedSites) {
      return true;
    }
    // Parent must be available (if the feature has a parent)
    if (typeof feature.parent === 'string' && !featureIsAvailable(FEATURES[feature.parent])) {
      return false;
    }
    const hasMinZoom = typeof feature.minZoom === 'number';
    const hasMaxZoom = typeof feature.maxZoom === 'number';
    // If zoom is not set then show all features that don't have a min zoom
    // We don't care about a maxZoom here because null zoom effectively means zoomed all the way out
    if (state.map.zoom === null) {
      return !hasMinZoom;
    }
    return (!hasMinZoom || state.map.zoom >= feature.minZoom) && (!hasMaxZoom || state.map.zoom <= feature.maxZoom);
  };
  const newState = _extends({}, state, {
    filters: _extends({}, state.filters, {
      features: _extends({}, state.filters.features, {
        available: Object.fromEntries(Object.entries(FEATURES).map(entry => [entry[0], featureIsAvailable(entry[1])]))
      })
    })
  });
  // Update table focus to reflect availability if need be
  Object.keys(state.table.availableFeatureTypes).forEach(featureType => {
    newState.table.availableFeatureTypes[featureType] = Object.keys(FEATURES).filter(featureKey => FEATURES[featureKey].type === featureType).some(featureKey => newState.filters.features.available[featureKey]);
  });
  if (!newState.table.availableFeatureTypes[newState.table.focus]) {
    const available = Object.keys(newState.table.availableFeatureTypes).filter(k => newState.table.availableFeatureTypes[k]);
    newState.table.focus = available[0] || state.table.focus;
  }
  return newState;
};

/**
   getHref
   Used to construction URLs when linking out to other pages
*/
exports.calculateFeatureAvailability = calculateFeatureAvailability;
const getHref = function (key) {
  var _biorepoDatasetsJSON$;
  let arg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  const EXPLORE_DATA_PRODUCTS_BASE = _RouteService.default.getDataProductExplorePath();
  const BIOREPO_HOST = _NeonEnvironment.default.getBioRepoHost();
  const EXPLORE_SAMPLE_PRODUCTS_BASE = "".concat(BIOREPO_HOST, "/portal/collections/list.php");
  if ((arg || '').length === 0) {
    return '#';
  }
  switch (key) {
    case 'EXPLORE_SAMPLE_PRODUCTS_BY_SITE':
      return "".concat(EXPLORE_SAMPLE_PRODUCTS_BASE, "?datasetid=").concat(((_biorepoDatasetsJSON$ = _biorepoDatasets.default.datasets.find(item => item.name === String(arg))) === null || _biorepoDatasetsJSON$ === void 0 ? void 0 : _biorepoDatasetsJSON$.datasetID) || '');
    case 'EXPLORE_DATA_PRODUCTS_BY_SITE':
      return "".concat(EXPLORE_DATA_PRODUCTS_BASE, "?site=").concat(arg);
    case 'EXPLORE_DATA_PRODUCTS_BY_STATE':
      return "".concat(EXPLORE_DATA_PRODUCTS_BASE, "?state=").concat(arg);
    case 'EXPLORE_DATA_PRODUCTS_BY_DOMAIN':
      return "".concat(EXPLORE_DATA_PRODUCTS_BASE, "?domain=").concat(arg);
    case 'SITE_DETAILS':
      return _RouteService.default.getFieldSiteDetailPath(arg);
    case 'DOMAIN_DETAILS':
      return _RouteService.default.getDomainDetailPath(arg);
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
const BASE_LAYERS = exports.BASE_LAYERS = {
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
const BASE_LAYERS_BY_TITLE = exports.BASE_LAYERS_BY_TITLE = {};
Object.keys(BASE_LAYERS).forEach(key => {
  BASE_LAYERS[key].KEY = key;
  BASE_LAYERS_BY_TITLE[BASE_LAYERS[key].title] = key;
});

/**
 Map Overlays
 Third party services providing tiles for different environmental contexts. These layers are similar
 to base layers in that they cover most or all of the observatory if not the whole planet. They add
 additional context from a third party data source, such as NLCD.
*/
const OVERLAY_GROUPS = exports.OVERLAY_GROUPS = {
  NLCD: {
    title: 'National Land Cover Database',
    description: 'National Land Cover Database (NLCD) from the Multi-Resolution Land Characteristics (MRLC) consortium. Release years: 2001 (Alaska, Hawaii, and Puerto Rico) and 2006 (Continental US).',
    commonProps: {
      format: 'image/png',
      transparent: true
    }
  }
};
const OVERLAY_GROUPS_BY_TITLE = exports.OVERLAY_GROUPS_BY_TITLE = {};
Object.keys(OVERLAY_GROUPS).forEach(key => {
  OVERLAY_GROUPS[key].KEY = key;
  OVERLAY_GROUPS_BY_TITLE[OVERLAY_GROUPS[key].title] = key;
});
const OVERLAYS = exports.OVERLAYS = {
  LAND_COVER: {
    group: OVERLAY_GROUPS.NLCD.KEY,
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
        url: 'https://www.mrlc.gov/geoserver/mrlc_display/NLCD_2006_Land_Cover_L48/wms?',
        layers: 'NLCD_2006_Land_Cover_L48'
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
    group: OVERLAY_GROUPS.NLCD.KEY,
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
        url: 'https://www.mrlc.gov/geoserver/mrlc_display/NLCD_2006_Impervious_L48/wms?',
        layers: 'NLCD_2006_Impervious_L48'
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
Object.keys(OVERLAYS).forEach(key => {
  OVERLAYS[key].KEY = key;
});

/**
   Default State
*/
const featureIsHiddenByDefault = key => {
  let hidden = FEATURES[key].hideByDefault;
  if (FEATURES[key].parent && !hidden) {
    hidden = featureIsHiddenByDefault(FEATURES[key].parent);
  }
  return hidden;
};
const DEFAULT_STATE = {
  view: {
    current: null,
    initialized: {
      [VIEWS.MAP]: false,
      [VIEWS.TABLE]: false
    }
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
    map: {
      zoom: null,
      center: []
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
    focus: FEATURE_TYPES.SITES.KEY,
    availableFeatureTypes: {
      [FEATURE_TYPES.SITES.KEY]: false,
      [FEATURE_TYPES.LOCATIONS.KEY]: false
    },
    fullHeight: false,
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
    // Set to any key in FEATURE_TYPES that is explicitly selectable
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
    onChange: () => {},
    // Function that fires whenever state.selection changes
    derived: {
      // Derived feature-specific mappings of selectable item IDs to SELECTION_PORTIONS
      [FEATURES.STATES.KEY]: {},
      // { stateCode: SELECTION_PORTIONS.KEY }
      [FEATURES.DOMAINS.KEY]: {} // { domainCode: SELECTION_PORTIONS.KEY }
    }
  },
  featureDataFetchesHasAwaiting: false,
  // Boolean: track whether any data fetches are awaiting call
  featureDataFetches: Object.fromEntries(Object.keys(FEATURE_DATA_SOURCES).filter(dataSource =>
  // eslint-disable-next-line max-len
  ![FEATURE_DATA_SOURCES.MANUAL_LOCATIONS, FEATURE_DATA_SOURCES.NEON_CONTEXT].includes(dataSource)).map(dataSource => [dataSource, {}])),
  featureData: Object.fromEntries(Object.keys(FEATURE_TYPES).filter(featureType => featureType !== FEATURE_TYPES.SAMPLING_POINTS.KEY).map(featureType => [featureType, {}])),
  sites: {},
  // Sites data is split into 4 features making it hard to look up, so extra refs here
  filters: {
    search: null,
    legendOpen: false,
    // whether the legend pane is open/visible
    features: {
      available: {},
      visible: Object.fromEntries(
      // key/bool map of which available features are visible
      Object.keys(FEATURES).map(key => [key, !featureIsHiddenByDefault(key)])),
      collapsed: new Set() // Collapsed (not expanded) since the default for features is expanded
    },
    overlays: {
      expanded: new Set() // Expanded since the default for overlay legends is collapsed
    }
  },
  fullscreen: false,
  manualLocationData: null
};

// Initialize featureData and featureDataFetches objects for all features that have a dataSource
Object.keys(FEATURES).filter(featureKey => Object.keys(FEATURE_DATA_SOURCES).includes(FEATURES[featureKey].dataSource)).forEach(featureKey => {
  const {
    type: featureType,
    dataSource
  } = FEATURES[featureKey];
  // Initialize featureData
  // SAMPLING_POINTS are stored as geometry of their parent locations so don't need initialization
  if (featureType !== FEATURE_TYPES.SAMPLING_POINTS.KEY) {
    DEFAULT_STATE.featureData[featureType][featureKey] = {};
  }
  // Initialize featureDataFetches based on dataSource
  // ARCGIS_ASSETS_API and REST_LOCATIONS_API: grouped by feature key
  // GRAPHQL_LOCATIONS_API: grouped by feature minZoom
  if ([FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API, FEATURE_DATA_SOURCES.REST_LOCATIONS_API].includes(dataSource)) {
    DEFAULT_STATE.featureDataFetches[dataSource][featureKey] = {};
  }
  if (dataSource === FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API) {
    const minZoom = GRAPHQL_LOCATIONS_API_CONSTANTS.FEATURES_TO_MINZOOM_MAP[featureKey];
    DEFAULT_STATE.featureDataFetches[dataSource][minZoom] = {};
  }
});
// Location Hierarchies (REST_LOCATIONS_API, not in the FEATURES structure since it doesn't render)
// eslint-disable-next-line max-len
DEFAULT_STATE.featureDataFetches[FEATURE_DATA_SOURCES.REST_LOCATIONS_API][FEATURE_TYPES.SITE_LOCATION_HIERARCHIES.KEY] = {};

// Initialize feature availability
const availabilityState = calculateFeatureAvailability(DEFAULT_STATE);
DEFAULT_STATE.filters.features.available = _extends({}, availabilityState.filters.features.available);

// Populate static JSON featureData
// Note that we end up with some redundancy in our object structure:
// (e.g. state.featureData.STATES.STATES) This is a balanced trade-off... many references to
// feature data that renders (so excpeting site location hiearchies) abstractly expect the structure
// to be organized by feature type and then feature key. States and Domains have dedicated feature
// types to allow for selection. It would be far messier to shorten their featureData structure
// and have to build exceptions for this difference in various places.
// --
// States
if (_statesShapes.default) {
  _statesShapes.default.features.forEach(feature => {
    if (!feature.properties || !feature.properties.stateCode) {
      return;
    }
    const {
      stateCode
    } = feature.properties;
    DEFAULT_STATE.featureData[FEATURE_TYPES.STATES.KEY][FEATURES.STATES.KEY][stateCode] = {
      geometry: feature.geometry,
      sites: new Set()
    };
  });
}
// Domains
if (_domainsShapes.default) {
  _domainsShapes.default.features.forEach(feature => {
    if (!feature.properties || !feature.properties.domainCode) {
      return;
    }
    const {
      domainCode
    } = feature.properties;
    DEFAULT_STATE.featureData[FEATURE_TYPES.DOMAINS.KEY][FEATURES.DOMAINS.KEY][domainCode] = {
      geometry: feature.geometry,
      sites: new Set()
    };
  });
}
const getDefaultState = () => (0, _cloneDeep.default)(DEFAULT_STATE);

/**
   PropTypes and defaultProps
*/
exports.getDefaultState = getDefaultState;
const SelectionLimitPropType = (props, propName) => {
  const {
    [propName]: prop
  } = props;
  if (prop === null || typeof prop === 'undefined') {
    return null;
  }
  if (typeof prop === 'number') {
    if (!Number.isInteger(prop) || prop < 1) {
      return new Error("When setting ".concat(propName, " as a number it must be an integer greater than 0"));
    }
    return null;
  }
  if (Array.isArray(prop)) {
    if (prop.length !== 2 || !prop.every(x => Number.isInteger(x) && x > 0) || prop[0] >= prop[1]) {
      return new Error( // eslint-disable-next-line max-len
      "When setting ".concat(propName, " as an array it must contain exactly two distinct non-zero positive integers in ascending order (e.g. [2, 5])"));
    }
    return null;
  }
  return new Error( // eslint-disable-next-line max-len
  "".concat(propName, " must be null, a positive non-zero integer, or an array of two ascending non-zero positive integers."));
};
const SITE_MAP_PROP_TYPES = exports.SITE_MAP_PROP_TYPES = {
  // Top-level props
  view: _propTypes.default.oneOf(Object.keys(VIEWS).map(k => k.toLowerCase())),
  aspectRatio: _propTypes.default.number,
  fullscreen: _propTypes.default.bool,
  unusableVerticalSpace: _propTypes.default.number,
  mapUniqueId: _propTypes.default.number,
  // Map props
  mapCenter: _propTypes.default.arrayOf(_propTypes.default.number),
  mapZoom: _propTypes.default.number,
  mapBaseLayer: _propTypes.default.oneOf(Object.keys(BASE_LAYERS)),
  // Table props
  tableFullHeight: _propTypes.default.bool,
  // Initial map focus (overrides mapCenter and mapZoom)
  location: _propTypes.default.string,
  // Selection props
  selection: _propTypes.default.oneOf(Object.keys(FEATURE_TYPES).filter(k => FEATURE_TYPES[k].selectable)),
  selectedItems: _propTypes.default.arrayOf(_propTypes.default.string),
  validItems: _propTypes.default.arrayOf(_propTypes.default.string),
  selectionLimit: SelectionLimitPropType,
  onSelectionChange: _propTypes.default.func,
  // Filter props
  search: _propTypes.default.string,
  features: _propTypes.default.arrayOf(_propTypes.default.oneOf(Object.keys(FEATURES))),
  // Manual Location Data
  manualLocationData: _propTypes.default.arrayOf(_propTypes.default.shape({
    manualLocationType: _propTypes.default.oneOf(Object.keys(MANUAL_LOCATION_TYPES)).isRequired
  }))
};
const SITE_MAP_DEFAULT_PROPS = exports.SITE_MAP_DEFAULT_PROPS = {
  // Top-level props
  view: VIEWS.MAP.toLowerCase(),
  aspectRatio: null,
  fullscreen: false,
  unusableVerticalSpace: 0,
  mapUniqueId: 0,
  // Map props
  mapCenter: OBSERVATORY_CENTER,
  mapZoom: null,
  mapBaseLayer: Object.keys(BASE_LAYERS)[0],
  // Table props
  tableFullHeight: false,
  // Initial map focus (overrides mapCenter and mapZoom)
  location: null,
  // Selection props
  selection: null,
  selectedItems: [],
  validItems: null,
  selectionLimit: null,
  onSelectionChange: () => {},
  // Filter props
  search: null,
  features: null,
  // Manual Location Data
  manualLocationData: null
};

/**
   Icon Utility Functions
   These appear here because of how Leaflet handles icons. Each icon must be a L.Icon instance,
   but many of our icons repeat. We also want to scale our icons with the zoom level. As such,
   we generate a stat structure containing only one instance of each distinct icon type scaled
   to the current zoom level and keep that in state. It is regenerated any time the zoom changes.
*/
// Get a single zoomed Leaflet icon instance
const getZoomedIcon = function () {
  let featureKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  let zoom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  let highlight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : HIGHLIGHT_STATUS.NONE;
  let selection = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : SELECTION_STATUS.UNSELECTED;
  const feature = FEATURES[featureKey] || {};
  const featureHasIcon = feature && feature.iconSvg && feature.iconShape && LOCATION_ICON_SVG_SHAPES[feature.iconShape];
  let iconUrl = featureHasIcon ? feature.iconSvg : _iconPlaceholder.default;
  const iconShape = featureHasIcon ? feature.iconShape : LOCATION_ICON_SVG_SHAPES.SQUARE.KEY;
  const iconScale = featureHasIcon ? feature.iconScale || 1 : 1;
  const minZoom = feature.minZoom || (FEATURES[feature.parent] || {}).minZoom || MAP_ZOOM_RANGE[0];
  const maxZoom = feature.maxZoom || (FEATURES[feature.parent] || {}).maxZoom || MAP_ZOOM_RANGE[1];
  // Use a deep clone of the base SVG shape object so that we can modify destructured data
  // for variants like "selected" icons
  const baseSvgShape = (0, _cloneDeep.default)(LOCATION_ICON_SVG_SHAPES[iconShape]);
  const {
    popupAnchor,
    shadow
  } = baseSvgShape;
  let {
    iconSize,
    iconAnchor
  } = baseSvgShape;
  const {
    svg: shadowUrl
  } = shadow[highlight] || {};
  let {
    size: shadowSize,
    anchor: shadowAnchor
  } = shadow[highlight] || {};
  // Adjust icon, size, and anchor if selected (and a different "selected" icon is available)
  if (featureHasIcon && selection === SELECTION_STATUS.SELECTED && feature.iconSelectedSvg) {
    iconUrl = (0, _typeUtil.exists)(feature.iconSelectedSvg) ? feature.iconSelectedSvg : _iconPlaceholder.default;
    iconSize = iconSize.map(d => d + SELECTED_ICON_OFFSET);
    iconAnchor = iconAnchor.map(d => d + SELECTED_ICON_OFFSET / 2);
    shadowSize = shadowUrl ? shadowSize.map(d => d + SELECTED_ICON_OFFSET) : null;
    shadowAnchor = shadowUrl ? shadowAnchor.map(d => d + SELECTED_ICON_OFFSET / 2) : null;
    popupAnchor[1] -= SELECTED_ICON_OFFSET / 2;
  }
  if (!(0, _typeUtil.exists)(iconUrl)) {
    iconUrl = _iconPlaceholder.default;
  }
  // Determine Icon Scale
  // Normalize the scale to a range of at least 0.2 to 0.5 (but as big as 0.2 to 1) based on
  // current zoom and feature zoom bounds, then multiply by any feature icon scale
  const minScale = 0.2;
  const maxScale = Math.max((maxZoom - minZoom) / (MAP_ZOOM_RANGE[1] - MAP_ZOOM_RANGE[0]), 0.5);
  const baseScale = ((zoom || minZoom) - minZoom) / (maxZoom - minZoom);
  const scale = Math.max((minScale + baseScale * (maxScale - minScale)) * iconScale, minScale);
  const iconProps = {
    iconUrl,
    iconRetinaUrl: iconUrl,
    iconSize: iconSize.map(x => round(x * scale)),
    iconAnchor: iconAnchor.map(x => round(x * scale)),
    popupAnchor: popupAnchor.map(x => round(x * scale))
  };
  if (shadowUrl && shadowSize && shadowAnchor) {
    iconProps.shadowUrl = shadowUrl;
    iconProps.shadowSize = shadowSize.map(x => round(x * scale));
    iconProps.shadowAnchor = shadowAnchor.map(x => round(x * scale));
  }
  return new _leaflet.default.Icon(iconProps);
};

// Get a structure containing all zoomed leaflet icon instances. These are stored in
// state and regenerated any time the zoom level changes. We do this so that we're not generating
// a new icon instance for every discrete location in view when several share the same icon.
exports.getZoomedIcon = getZoomedIcon;
const getZoomedIcons = zoom => {
  const featureTypes = [FEATURE_TYPES.LOCATIONS.KEY, FEATURE_TYPES.SITES.KEY, FEATURE_TYPES.OTHER.KEY];
  const icons = {};
  Object.keys(FEATURES).filter(key => featureTypes.includes(FEATURES[key].type) && FEATURES[key].iconSvg && FEATURES[key].iconShape && LOCATION_ICON_SVG_SHAPES[FEATURES[key].iconShape]).forEach(key => {
    icons[key] = {};
    Object.keys(SELECTION_STATUS).forEach(selection => {
      if (selection === SELECTION_STATUS.SELECTED && !FEATURE_TYPES[FEATURES[key].type].selectable) {
        return;
      }
      icons[key][selection] = {};
      Object.keys(HIGHLIGHT_STATUS).forEach(highlight => {
        icons[key][selection][highlight] = getZoomedIcon(key, zoom, highlight, selection);
      });
    });
  });
  return icons;
};

// Creare a temporary non-rendering empty Leaflet map with dimensions, center, and zoom all
// identical to a given state. This is necessary whenever needing to do pixel/latlon projections.
exports.getZoomedIcons = getZoomedIcons;
const getPhantomLeafletMap = state => {
  const {
    aspectRatio: {
      currentValue: aspectRatio,
      widthReference
    },
    map: {
      center,
      zoom
    }
  } = state;
  const x = widthReference || 400;
  const y = widthReference * aspectRatio || 300;
  const PhantomMapClass = _leaflet.default.Map.extend({
    includes: {
      getSize: () => new _leaflet.default.Point(x, y)
    }
  });
  const element = document.createElement('div');
  return new PhantomMapClass(element, {
    center,
    zoom
  });
};
exports.getPhantomLeafletMap = getPhantomLeafletMap;
const mapIsAtFocusLocation = function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return state.map && state.map.zoom && Array.isArray(state.map.center) && state.map.center.length === 2 && state.focusLocation && state.focusLocation.current && state.focusLocation.map.zoom && Array.isArray(state.focusLocation.map.center) && state.focusLocation.map.center.length === 2 && state.map.zoom === state.focusLocation.map.zoom && state.map.center[0] === state.focusLocation.map.center[0] && state.map.center[1] === state.focusLocation.map.center[1] || false;
};
exports.mapIsAtFocusLocation = mapIsAtFocusLocation;
const getMapStateForFocusLocation = function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const {
    focusLocation
  } = state;
  if (!focusLocation || !focusLocation.current) {
    return state.map;
  }
  const {
    current
  } = focusLocation;
  const {
    type = '',
    latitude,
    longitude
  } = focusLocation.data || {};

  // No latitude/longitude: previous map state
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return state.map;
  }
  const newState = _extends({}, state);
  newState.map.bounds = null;
  newState.map.zoom = null;

  // Everything else (valid location with a center)
  newState.map.center = [latitude, longitude];
  newState.map.bounds = null;
  newState.map.zoom = null;
  if (type === 'SITE') {
    newState.map.zoom = (state.sites[current] || {}).zoom || 12;
  } else if (type === 'DOMAIN') {
    const {
      [FEATURES.DOMAINS.KEY]: domainsData
    } = state.featureData[FEATURE_TYPES.DOMAINS.KEY];
    newState.map.zoom = (domainsData[current] || {}).zoom || null;
  } else if (type === 'STATE') {
    const {
      [FEATURES.STATES.KEY]: statesData
    } = state.featureData[FEATURE_TYPES.STATES.KEY];
    newState.map.zoom = (statesData[current] || {}).zoom || null;
  } else {
    const featureKey = Object.keys(FEATURES).filter(key => FEATURES[key].matchLocationType).find(key => new RegExp(FEATURES[key].matchLocationType).test(type));
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
    const phantomMap = getPhantomLeafletMap(newState);
    const newBounds = phantomMap.getBounds() || null;
    newState.map.bounds = !newBounds ? null : {
      /* eslint-disable no-underscore-dangle */
      lat: [round(newBounds._southWest.lat), round(newBounds._northEast.lat)],
      lng: [round(newBounds._southWest.lng), round(newBounds._northEast.lng)]
      /* eslint-enable no-underscore-dangle */
    };
    phantomMap.remove();
  }

  // Done
  return newState.map;
};
exports.getMapStateForFocusLocation = getMapStateForFocusLocation;
const findCentroid = function () {
  let coords = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  if (!Array.isArray(coords) || !coords.length || !coords.every(isCoord)) {
    return null;
  }
  if (coords.length === 1) {
    return [...coords[0]];
  }
  const c = {
    x: 0,
    y: 0,
    z: 0
  };
  coords.forEach(coord => {
    const rLat = coord[0] * (Math.PI / 180);
    const rLng = coord[1] * (Math.PI / 180);
    c.x += Math.cos(rLat) * Math.cos(rLng);
    c.y += Math.cos(rLat) * Math.sin(rLng);
    c.z += Math.sin(rLat);
  });
  c.x /= coords.length;
  c.y /= coords.length;
  c.z /= coords.length;
  const cLng = Math.atan2(c.y, c.x);
  const cHyp = Math.sqrt(c.x ** 2 + c.y ** 2);
  const cLat = Math.atan2(c.z, cHyp);
  return [round(cLat * (180 / Math.PI)), round(cLng * (180 / Math.PI))];
};
exports.findCentroid = findCentroid;
const getMapStateForManualLocationData = state => {
  const {
    map: previousMapState,
    manualLocationData
  } = state;
  if (!Array.isArray(manualLocationData) || !manualLocationData.length) {
    return previousMapState;
  }
  const newState = _extends({}, state);
  newState.map.zoom = null;
  newState.map.bounds = null;
  newState.map.center = SITE_MAP_DEFAULT_PROPS.mapCenter;
  const bounds = [[null, null], [null, null]];
  const locationCenters = manualLocationData.reduce((acc, cur) => {
    if (Number.isFinite(cur.latitude) && Number.isFinite(cur.longitude)) {
      acc.push([cur.latitude, cur.longitude]);
      if (bounds[0][0] === null || cur.latitude < bounds[0][0]) {
        bounds[0][0] = cur.latitude;
      }
      if (bounds[0][1] === null || cur.longitude < bounds[0][1]) {
        bounds[0][1] = cur.longitude;
      }
      if (bounds[1][0] === null || cur.latitude > bounds[1][0]) {
        bounds[1][0] = cur.latitude;
      }
      if (bounds[1][1] === null || cur.longitude > bounds[1][1]) {
        bounds[1][1] = cur.longitude;
      }
    }
    return acc;
  }, []);
  if (!locationCenters.length) {
    return previousMapState;
  }
  if (locationCenters.length === 1) {
    newState.map.center = [...locationCenters[0]];
    newState.map.zoom = 6;
  } else {
    newState.map.center = findCentroid(locationCenters);
    const phantomZoomMap = getPhantomLeafletMap(newState);
    phantomZoomMap.fitBounds(bounds, {
      animate: false,
      padding: [10, 10]
    });
    newState.map.zoom = phantomZoomMap.getZoom();
    phantomZoomMap.remove();
  }

  // Regenerate icons and bounds if we have a valid zoom
  if (newState.map.zoom !== null) {
    // Bound the minimum zoom level to prevent too wide of bounds
    // from not filling the entirety of the map display
    newState.map.zoom = Math.max(newState.map.zoom, 3);
    newState.map.zoomedIcons = getZoomedIcons(newState.map.zoom);
    const phantomMap = getPhantomLeafletMap(newState);
    const newBounds = phantomMap.getBounds() || null;
    newState.map.bounds = !newBounds ? null : {
      /* eslint-disable no-underscore-dangle */
      lat: [round(newBounds._southWest.lat), round(newBounds._northEast.lat)],
      lng: [round(newBounds._southWest.lng), round(newBounds._northEast.lng)]
      /* eslint-enable no-underscore-dangle */
    };
    phantomMap.remove();
  }

  // Done
  return newState.map;
};

// Parse any manualLocationData into the mainfeatureData object so that its entries can be
// rendered consistently with other features
exports.getMapStateForManualLocationData = getMapStateForManualLocationData;
const parseManualLocationFeatureData = state => {
  if (!state.neonContextHydrated || !Array.isArray(state.manualLocationData) || !state.manualLocationData.length) {
    return state;
  }
  const newState = _extends({}, state);
  state.manualLocationData.forEach(manualLocation => {
    const {
      siteCode
    } = manualLocation;
    if (manualLocation.manualLocationType === MANUAL_LOCATION_TYPES.PROTOTYPE_SITE && siteCode && !newState.sites[siteCode]) {
      const featureType = FEATURE_TYPES.SITES.KEY;
      const featureKey = FEATURES.DECOMMISSIONED_SITES.KEY;
      newState.featureData[featureType][featureKey][siteCode] = manualLocation;
      // Harmonize some values
      newState.featureData[featureType][featureKey][siteCode].type = 'Decommissioned';
      newState.featureData[featureType][featureKey][siteCode].stateCode = manualLocation.state;
      newState.featureData[featureType][featureKey][siteCode].domainCode = manualLocation.domain;
      newState.featureData[featureType][featureKey][siteCode].description = manualLocation.siteName;
    }
  });
  newState.map = getMapStateForManualLocationData(newState);
  return newState;
};
exports.parseManualLocationFeatureData = parseManualLocationFeatureData;
const hydrateNeonContextData = (state, neonContextData) => {
  const newState = _extends({}, state, {
    neonContextHydrated: true
  });
  // Sites
  Object.keys(neonContextData.sites).forEach(siteCode => {
    newState.sites[siteCode] = _extends({}, neonContextData.sites[siteCode]);
    const featureKey = Object.keys(FEATURES).filter(key => FEATURES[key].type === FEATURE_TYPES.SITES.KEY).find(key => FEATURES[key].attributes.type === neonContextData.sites[siteCode].type && FEATURES[key].attributes.terrain === neonContextData.sites[siteCode].terrain) || null;
    if (featureKey !== null) {
      // eslint-disable-next-line max-len
      newState.featureData[FEATURE_TYPES.SITES.KEY][featureKey][siteCode] = newState.sites[siteCode];
    }
  });
  // States
  Object.keys(neonContextData.states).forEach(stateCode => {
    newState.featureData[FEATURE_TYPES.STATES.KEY][FEATURES.STATES.KEY][stateCode] = _extends({}, newState.featureData[FEATURE_TYPES.STATES.KEY][FEATURES.STATES.KEY][stateCode] || {}, neonContextData.states[stateCode], {
      sites: neonContextData.stateSites[stateCode]
    });
  });
  // Domains
  Object.keys(neonContextData.domains).forEach(domainCode => {
    newState.featureData[FEATURE_TYPES.DOMAINS.KEY][FEATURES.DOMAINS.KEY][domainCode] = _extends({}, newState.featureData[FEATURE_TYPES.DOMAINS.KEY][FEATURES.DOMAINS.KEY][domainCode] || {}, neonContextData.domains[domainCode], {
      sites: neonContextData.domainSites[domainCode]
    });
  });
  return parseManualLocationFeatureData(newState);
};

/**
   Aspect Ratio
*/
exports.hydrateNeonContextData = hydrateNeonContextData;
const dynamicAspectRatios = ['1:2', '9:16', '2:3', '5:7', '4:5', '1:1', '5:4', '7:5', '3:2', '16:9', '2:1', '2.5:1', '3:1'].map(ratio => {
  const parts = /^([\d.]+):([\d.]+)$/.exec(ratio) || ['', '1', '1'];
  return parseFloat(parts[2]) / parseFloat(parts[1]);
});
const getDynamicAspectRatio = function () {
  let unusableVerticalSpace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  const buffer = 100; // Approximate height of the filters row and a bit of margin
  const usableVericalSpace = window.innerHeight + buffer - unusableVerticalSpace;
  const windowAspectRatio = Math.max(usableVericalSpace, 0) / (window.innerWidth || 1);
  const arIdx = dynamicAspectRatios.findIndex(ar => ar < windowAspectRatio);
  return arIdx === -1 ? dynamicAspectRatios[dynamicAspectRatios.length - 1] : dynamicAspectRatios[arIdx];
};
exports.getDynamicAspectRatio = getDynamicAspectRatio;
const boundsAreValid = bounds => typeof bounds === 'object' && bounds !== null && Object.keys(bounds).every(key => ['lat', 'lng'].includes(key) && Array.isArray(bounds[key]) && bounds[key].length === 2 && bounds[key].every(v => typeof v === 'number') && bounds[key][1] > bounds[key][0]);

// For large sets of coordinates, down sample to compute a general idea
// of the location. A "good enough" approximation of the location's coordinates
// such that a bounds calculation can be performed in a reasonable space and time
// complexity and still yield a relevant result for the view port of the map.
exports.boundsAreValid = boundsAreValid;
const downSample = items => {
  if (items.length < LOCATION_BOUNDS_SAMPLING_MAX) return items;
  const sampled = [];
  const mod = Math.floor(items.length / LOCATION_BOUNDS_SAMPLING_MAX);
  items.forEach((item, index) => {
    if (index % mod === 0) {
      sampled.push(item);
    }
  });
  return sampled;
};

// This function flattens a geometry object to just coordinates so we can check if a boundary
// is in the map. NOTE: extendPoints does not work with boundaries, only solitary points.
const flatten = items => {
  const flat = [];
  items.forEach(item => {
    if (Array.isArray(item) && !isCoord(item)) {
      flat.push(...flatten(downSample(item)));
    } else {
      flat.push(item);
    }
  });
  return flat;
};
const isInBounds = function (loc, extendedBounds) {
  let extendPoints = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if (Number.isFinite(loc.latitude) && Number.isFinite(loc.longitude)) {
    if (extendPoints > 0) {
      const lats = [loc.latitude - extendPoints, loc.latitude + extendPoints];
      const lngs = [loc.longitude - extendPoints, loc.longitude + extendPoints];
      return !(lats[0] > extendedBounds.lat[1] || lats[1] < extendedBounds.lat[0] || lngs[0] > extendedBounds.lng[1] || lngs[1] < extendedBounds.lng[0]);
    }
    return loc.latitude >= extendedBounds.lat[0] && loc.latitude <= extendedBounds.lat[1] && loc.longitude >= extendedBounds.lng[0] && loc.longitude <= extendedBounds.lng[1];
  }
  if (loc.geometry && loc.geometry.coordinates) {
    const flatCoords = flatten(loc.geometry.coordinates);
    return flatCoords.some(coord => coord[0] >= extendedBounds.lat[0] && coord[0] <= extendedBounds.lat[1] && coord[1] >= extendedBounds.lng[0] && coord[1] <= extendedBounds.lng[1]);
  }
  return false;
};
const calculateLocationsInBounds = function (locations) {
  let bounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  let extendMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  let extendPoints = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  if (!locations || typeof locations !== 'object' || !Object.keys(locations).length) {
    return [];
  }
  if (bounds === null) {
    return Object.keys(locations);
  }
  if (!boundsAreValid(bounds)) {
    return [];
  }
  const extendedBounds = !extendMap ? bounds : Object.fromEntries(Object.keys(bounds).map(dir => {
    const buffer = (bounds[dir][1] - bounds[dir][0]) / 2;
    return [dir, [bounds[dir][0] - buffer, bounds[dir][1] + buffer]];
  }));
  return Object.keys(locations).filter(locId => isInBounds(locations[locId], extendedBounds, extendPoints));
};
exports.calculateLocationsInBounds = calculateLocationsInBounds;
const deriveFullObservatoryZoomLevel = mapRef => {
  const FALLBACK_ZOOM = 2;
  if (typeof mapRef !== 'object' || mapRef === null || !mapRef.current) {
    return FALLBACK_ZOOM;
  }
  const container = mapRef.current.container.parentElement;
  if (!container.clientWidth || !container.clientHeight) {
    return FALLBACK_ZOOM;
  }
  const divisor = 23 * 8;
  const minorDim = Math.min(container.clientWidth / divisor, container.clientHeight / divisor);
  const derivedZoom = [1, 2, 4, 6, 11].findIndex(m => m > minorDim);
  return Math.max(derivedZoom, 1);
};
exports.deriveFullObservatoryZoomLevel = deriveFullObservatoryZoomLevel;