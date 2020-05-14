import PropTypes from 'prop-types';

import L from 'leaflet';

import { COLORS } from '../Theme/Theme';

// SVGs for all map icons
import iconCoreTerrestrialSVG from './svg/icon-core-terrestrial.svg';
import iconCoreTerrestrialSelectedSVG from './svg/icon-core-terrestrial-selected.svg';
import iconCoreAquaticSVG from './svg/icon-core-aquatic.svg';
import iconCoreAquaticSelectedSVG from './svg/icon-core-aquatic-selected.svg';
import iconCoreShadowSVG from './svg/icon-core-shadow.svg';
import iconCoreShadowSelectedSVG from './svg/icon-core-shadow-selected.svg';
import iconRelocatableTerrestrialSVG from './svg/icon-relocatable-terrestrial.svg';
import iconRelocatableTerrestrialSelectedSVG from './svg/icon-relocatable-terrestrial-selected.svg';
import iconRelocatableAquaticSVG from './svg/icon-relocatable-aquatic.svg';
import iconRelocatableAquaticSelectedSVG from './svg/icon-relocatable-aquatic-selected.svg';
import iconRelocatableShadowSVG from './svg/icon-relocatable-shadow.svg';
import iconRelocatableShadowSelectedSVG from './svg/icon-relocatable-shadow-selected.svg';
import iconPlaceholderSVG from './svg/icon-placeholder.svg';

// Static JSON for Boundary features
import statesShapesJSON from '../../staticJSON/statesShapes.json';
import domainsShapesJSON from '../../staticJSON/domainsShapes.json';

export const MAP_ZOOM_RANGE = [1, 16];

export const KM2_TO_ACRES = 247.10538146717;

// Minimum zoom level at which location hierarchy fetches are done on a per-site basis
export const SITE_LOCATION_HIERARCHIES_MIN_ZOOM = 9;

/**
   Key Sets
   Used to limit the use of "magic strings" that need to be consistent across many files
*/
// For consistency in expressing the sort direction for the table
export const SORT_DIRECTIONS = { ASC: 'ASC', DESC: 'DESC' };

// For consistency in differentiating discrete sets of data that can be tabulated together.
// e.g. all LOCATIONS type feature data can coexist in a single table view with a
// single column definition. But LOCATIONS and SITES shouldn't, as each set has
// different common attributes that should map to table columns (yes, sites are locations too,
// but we represent and interact with them differently... I think? Maybe?)
export const FEATURE_TYPES = {
  SITES: 'SITES',
  SITE_LOCATION_HIERARCHIES: 'SITE_LOCATION_HIERARCHIES',
  LOCATIONS: 'LOCATIONS',
  BOUNDARIES: 'BOUNDARIES',
  GROUP: 'GROUP',
  OTHER: 'OTHER', // All features require a type. This catch-all type will not show in the table.
};

// For consistency in differentiating how feature data are loaded (e.g. by fetch or deferred import)
export const FEATURE_DATA_LOAD_TYPES = {
  FETCH: 'FETCH',
  IMPORT: 'IMPORT',
  NEON_CONTEXT: 'NEON_CONTEXT',
};

// Subset of FEATURE_TYPES describing all features that are directly selectable
export const SELECTABLE_FEATURE_TYPES = (({ SITES }) => ({ SITES }))(FEATURE_TYPES);

// For consistency in denoting whether all or some of a region's selectable children are selected
export const SELECTION_PORTIONS = { PARTIAL: 'PARTIAL', TOTAL: 'TOTAL' };

// For consistency in denoting which dinstinct user interfaces are available and which is visible
export const VIEWS = { MAP: 'MAP', TABLE: 'TABLE' };

// For consistency in tracking the current status of a fetch or import
export const FETCH_STATUS = {
  AWAITING_CALL: 'AWAITING_CALL',
  FETCHING: 'FETCHING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
};

/**
   Icon SVGs
   An importable data structure containing all imported SVGs for map and legend icons
*/
export const ICON_SVGS = {
  SITE_MARKERS: {
    CORE: {
      AQUATIC: {
        BASE: iconCoreAquaticSVG,
        SELECTED: iconCoreAquaticSelectedSVG,
      },
      TERRESTRIAL: {
        BASE: iconCoreTerrestrialSVG,
        SELECTED: iconCoreTerrestrialSelectedSVG,
      },
      SHADOW: {
        BASE: iconCoreShadowSVG,
        SELECTED: iconCoreShadowSelectedSVG,
      },
    },
    RELOCATABLE: {
      AQUATIC: {
        BASE: iconRelocatableAquaticSVG,
        SELECTED: iconRelocatableAquaticSelectedSVG,
      },
      TERRESTRIAL: {
        BASE: iconRelocatableTerrestrialSVG,
        SELECTED: iconRelocatableTerrestrialSelectedSVG,
      },
      SHADOW: {
        BASE: iconRelocatableShadowSVG,
        SELECTED: iconRelocatableShadowSelectedSVG,
      },
    },
  },
  PLACEHOLDER: iconPlaceholderSVG,
};

/**
   FEATURES
   A data structure describing all descrete boundaries or sets of icons that can be shown on the map
   Convention: all keys are consistently plural
   Order is draw order on map (so largest boundary features should be first)
*/
const PLACEHOLDER_RECT_STYLE = { color: '#666666' };
export const FEATURES = {
  // States and Domains
  DOMAINS: {
    name: 'NEON Domains',
    type: FEATURE_TYPES.BOUNDARIES,
    description: '',
    hideByDefault: true,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.NEON_CONTEXT,
    polygonStyle: { color: '#9252e0' },
  },
  STATES: {
    name: 'US States',
    type: FEATURE_TYPES.BOUNDARIES,
    description: '',
    hideByDefault: true,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.NEON_CONTEXT,
    polygonStyle: { color: '#3cdd84' },
  },
  // AQUATIC_WATERSHEDS Group
  AQUATIC_WATERSHEDS: {
    name: 'Aquatic Watersheds',
    type: FEATURE_TYPES.GROUP,
    minZoom: 6,
    description: '',
  },
  WATERSHED_BOUNDARIES: {
    name: 'Watershed Boundaries',
    type: FEATURE_TYPES.BOUNDARIES,
    minZoom: 6,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.IMPORT,
    description: '',
    parent: 'AQUATIC_WATERSHEDS',
    polygonStyle: { color: '#669199', dashArray: '5, 10' },
  },
  DRAINAGE_LINES: {
    name: 'Drainage Lines',
    type: FEATURE_TYPES.OTHER,
    minZoom: 7,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.IMPORT,
    description: '',
    parent: 'AQUATIC_WATERSHEDS',
    polylineStyle: { color: '#365d63' },
  },
  POUR_POINTS: {
    name: 'Pour Points',
    type: FEATURE_TYPES.OTHER,
    minZoom: 7,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.IMPORT,
    description: '',
    parent: 'AQUATIC_WATERSHEDS',
    iconSvg: ICON_SVGS.PLACEHOLDER,
  },
  // Ungrouped Boundary Types
  FLIGHT_BOX_BOUNDARIES: {
    name: 'Site AOP Flight Box Boundaries',
    type: FEATURE_TYPES.BOUNDARIES,
    minZoom: 8,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.IMPORT,
    description: '',
    polygonStyle: { color: '#f0ee75', dashArray: '5, 10' },
  },
  SAMPLING_BOUNDARIES: {
    name: 'Site Sampling Boundaries',
    type: FEATURE_TYPES.BOUNDARIES,
    minZoom: 8,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.IMPORT,
    description: 'Terrestrial and Colocated Aquatic Sites',
    polygonStyle: { color: '#e8847d', dashArray: '5, 10, 2.5, 10' },
  },
  AQUATIC_REACHES: {
    name: 'Aquatic Site Reach',
    type: FEATURE_TYPES.BOUNDARIES,
    minZoom: 9,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.IMPORT,
    description: '',
    polygonStyle: { color: '#ad85a0', dashArray: '5, 10, 2.5, 10' },
  },
  TOWER_AIRSHEDS: {
    name: 'Tower Airshed Boundaries',
    type: FEATURE_TYPES.BOUNDARIES,
    minZoom: 10,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.IMPORT,
    description: '',
    polygonStyle: { color: '#749966', dashArray: '5, 10, 2.5, 10' },
  },
  // Terrestrial Site Features
  TERRESTRIAL_SITE_FEATURES: {
    name: 'Terrestrial Site Features',
    type: FEATURE_TYPES.GROUP,
    minZoom: 10,
    description: '',
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'OS Plot - all',
  },
  TOWERS: {
    name: 'Tower Locations',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 10,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'TOWER',
    description: '',
    parent: 'TERRESTRIAL_SITE_FEATURES',
    iconSvg: ICON_SVGS.PLACEHOLDER,
  },
  HUTS: {
    name: 'Huts',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 10,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'HUT',
    description: '',
    parent: 'TERRESTRIAL_SITE_FEATURES',
    iconSvg: ICON_SVGS.PLACEHOLDER,
  },
  MEGAPITS: {
    name: 'Megapits',
    type: FEATURE_TYPES.LOCATIONS,
    minZoom: 10,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'MEGAPIT',
    description: '',
    parent: 'TERRESTRIAL_SITE_FEATURES',
    iconSvg: ICON_SVGS.PLACEHOLDER,
  },
  // TOWER_PLOTS Group
  TOWER_PLOTS: {
    name: 'Tower Plots',
    type: FEATURE_TYPES.GROUP,
    minZoom: 13,
    description: 'Tower plots provide a direct link between NEON’s Terrestrial Observation System and Terrestrial Instrument System. Tower Plots are located in and around the NEON tower primary and secondary airsheds.',
    parent: 'TERRESTRIAL_SITE_FEATURES',
  },
  TOWER_BASE_PLOTS: {
    name: 'Tower Base Plot',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'Tower plots support a variety of plant productivity, plant diversity, soil, biogeochemistry and microbe sampling. The number and size of Tower Base Plots is determined by the vegetation of the tower airshed. In forested sites, twenty 40m x 40m plots are established. In herbaceous sites, thirty 20m x 20m plots are established.  Of these thirty tower plots, four have additional space to support soil sampling.',
    parent: 'TOWER_PLOTS',
    matchLocationType: 'OS Plot - all', // Fethed by parent since distributed base plots share type
    matchLocationPlotType: 'tower',
    attributes: { type: 'base', location: 'tower' },
    rectStyle: PLACEHOLDER_RECT_STYLE,
  },
  TOWER_PHENOLOGY_PLOTS: {
    name: 'Tower Phenology Plot',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'Plant phenology observations are made along a transect loop or plot in or around the primary airshed. When possible, one plot is established north of the tower to calibrate phenology camera images captured from sensors on the tower. If there is insufficient space north of the tower for a 200m x 200m plot or if the vegetation does not match the primary airshed an additional plot is established.',
    parent: 'TOWER_PLOTS',
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'OS Plot - phe',
    attributes: { type: 'phenology', location: 'tower' },
    rectStyle: PLACEHOLDER_RECT_STYLE,
  },
  // DISTRIBUTED_PLOTS Group
  DISTRIBUTED_PLOTS: {
    name: 'Distributed Plots',
    type: FEATURE_TYPES.GROUP,
    minZoom: 10,
    description: 'Distributed Plots are located throughout the TOS Sampling boundary in an effort to describe organisms and process with plot, point, and grid sampling. Plots were established according to a stratified-random and spatially balanced design.',
    parent: 'TERRESTRIAL_SITE_FEATURES',
  },
  DISTRIBUTED_BASE_PLOTS: {
    name: 'Distributed Base Plots',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'Distributed Base Plots support a variety of plant productivity, plant diversity, soil, biogeochemistry, microbe and beetle sampling. Distributed Base Plots are 40m x 40m.',
    parent: 'DISTRIBUTED_PLOTS',
    matchLocationType: 'OS Plot - all', // Fethed by parent since tower base plots share type
    matchLocationPlotType: 'distributed',
    attributes: { type: 'base', location: 'distributed' },
    rectStyle: PLACEHOLDER_RECT_STYLE,
  },
  DISTRIBUTED_BIRD_GRIDS: {
    name: 'Distributed Bird Grids',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'Bird Grids consist of 9 sampling points within a 500m x 500m square. Each point is 250m apart. Where possible, Bird Grids are colocated with Distributed Base Plots by placing the Bird Grid center (B2) in close proximity to the center of the Base Plot. At smaller sites, a single point count is done at the south-west corner (point 21) of the Distributed Base Plot.',
    parent: 'DISTRIBUTED_PLOTS',
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'OS Plot - brd',
    attributes: { type: 'bird', location: 'distributed' },
    rectStyle: PLACEHOLDER_RECT_STYLE,
  },
  DISTRIBUTED_MAMMAL_GRIDS: {
    name: 'Distributed Mammal Grids',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'Mammal Grids are 90m x 90m and include 100 trapping locations at 10m spacing. Where possible, these grids are colocated with Distributed Base Plots by placing them a specified distance (150m +/- 50m) and random direction from the center of the Base Plot.',
    parent: 'DISTRIBUTED_PLOTS',
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'OS Plot - mam',
    attributes: { type: 'mammal', location: 'distributed' },
    rectStyle: PLACEHOLDER_RECT_STYLE,
  },
  DISTRIBUTED_MOSQUITO_POINTS: {
    name: 'Distributed Mosquito Plots',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'At each Mosquito Point, one CO2 trap is established. Due to the frequency of sampling and temporal sampling constraints, Mosquito Points are located within 45m of roads.',
    parent: 'DISTRIBUTED_PLOTS',
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'OS Plot - mos',
    attributes: { type: 'mosquito', location: 'distributed' },
    iconSvg: ICON_SVGS.PLACEHOLDER,
  },
  DISTRIBUTED_TICK_PLOTS: {
    name: 'Distributed Tick Plots',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'Tick Plots are sampled by conducting cloth dragging or flagging around the perimeter of a 40m x 40m plot. Tick plots are colocated with Distributed Base Plots by placing them a specified distance (150m +/- 15m) and random direction from the center of the Base Plot.',
    parent: 'DISTRIBUTED_PLOTS',
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'OS Plot - tck',
    attributes: { type: 'tick', location: 'distributed' },
    rectStyle: PLACEHOLDER_RECT_STYLE,
  },
  // SITE_MARKERS Group
  SITE_MARKERS: {
    name: 'NEON Site Markers',
    type: FEATURE_TYPES.GROUP,
    description: '',
  },
  TERRESTRIAL_CORE_SITES: {
    name: 'Terrestrial Core Sites',
    type: FEATURE_TYPES.SITES,
    description: 'Land-based; fixed location',
    iconSvg: ICON_SVGS.SITE_MARKERS.CORE.TERRESTRIAL.BASE,
    parent: 'SITE_MARKERS',
    attributes: { type: 'CORE', terrain: 'TERRESTRIAL' },
    dataLoadType: FEATURE_DATA_LOAD_TYPES.NEON_CONTEXT,
  },
  TERRESTRIAL_RELOCATABLE_SITES: {
    name: 'Terrestrial Relocatable Sites',
    type: FEATURE_TYPES.SITES,
    description: 'Land-based; location may change',
    iconSvg: ICON_SVGS.SITE_MARKERS.RELOCATABLE.TERRESTRIAL.BASE,
    parent: 'SITE_MARKERS',
    attributes: { type: 'RELOCATABLE', terrain: 'TERRESTRIAL' },
    dataLoadType: FEATURE_DATA_LOAD_TYPES.NEON_CONTEXT,
  },
  AQUATIC_CORE_SITES: {
    name: 'Aquatic Core Sites',
    type: FEATURE_TYPES.SITES,
    description: 'Water-based; fixed location',
    iconSvg: ICON_SVGS.SITE_MARKERS.CORE.AQUATIC.BASE,
    parent: 'SITE_MARKERS',
    attributes: { type: 'CORE', terrain: 'AQUATIC' },
    dataLoadType: FEATURE_DATA_LOAD_TYPES.NEON_CONTEXT,
  },
  AQUATIC_RELOCATABLE_SITES: {
    name: 'Aquatic Relocatable Sites',
    type: FEATURE_TYPES.SITES,
    description: 'Water-based; location may change',
    iconSvg: ICON_SVGS.SITE_MARKERS.RELOCATABLE.AQUATIC.BASE,
    parent: 'SITE_MARKERS',
    attributes: { type: 'RELOCATABLE', terrain: 'AQUATIC' },
    dataLoadType: FEATURE_DATA_LOAD_TYPES.NEON_CONTEXT,
  },
};
// Replicate keys as attributes to completely eliminate the need to write a feature key string
Object.keys(FEATURES).forEach((key) => { FEATURES[key].KEY = key; });

// Common colors for selecatble boundary features
export const BOUNDARY_COLORS = {
  partialSelected: COLORS.SECONDARY_BLUE[300],
  totalSelected: COLORS.SECONDARY_BLUE[500],
  hover: COLORS.SECONDARY_BLUE[100],
};

/**
   URL Bases
   Used in construction of URLs when linking out to other pages
*/
export const SITE_DETAILS_URL_BASE = 'https://www.neonscience.org/field-sites/field-sites-map/';
export const EXPLORE_DATA_PRODUCTS_URL_BASE = 'https://data.neonscience.org/data-products/explore?site=';

/**
 Tile Layers
 Third party services providing tiles for different earth views (topographic, satellite, etc.)
 with attributions
*/
export const TILE_LAYERS = {
  NATGEO_WORLD_MAP: {
    name: 'National Geographic',
    shortAttribution: '© Natl. Geographic et al.',
    fullAttribution: '© National Geographic, Esri, Garmin, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
  },
  WORLD_IMAGERY: {
    name: 'Satellite Imagery',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  },
  WORLD_STREET_MAP: {
    name: 'Streets',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, OSM contributors, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
  },
  WORLD_TOPO_MAP: {
    name: 'Topographic',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, HERE, Garmin, Intermap, iPC, GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), OSM contributors, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
  },
};
export const TILE_LAYERS_BY_NAME = {};
Object.keys(TILE_LAYERS).forEach((key) => {
  TILE_LAYERS_BY_NAME[TILE_LAYERS[key].name] = key;
});

/**
   Filters
*/

/**
   Default State
*/
export const DEFAULT_STATE = {
  view: null,
  neonContextHydrated: false, // Whether NeonContext data has been one-time hydrated into state
  focusLocation: {
    current: null,
    data: null,
    fetch: { status: null, error: null },
  },
  aspectRatio: {
    currentValue: 0.75, // Aspect ratio of the Site Map component content area (table and/or map)
    isDynamic: true, // Whether currentValue should set itself dynamically from viewport size
  },
  table: { // Settings that ONLY apply to the table
    focus: SELECTABLE_FEATURE_TYPES.SITES,
    sortColumn: 'siteName',
    sortDirection: SORT_DIRECTIONS.ASC,
  },
  map: { // Settings that ONLY apply to the map
    zoom: null,
    center: [],
    bounds: null,
    tileLayer: null,
    zoomedIcons: {},
  },
  selection: {
    active: null, // Set to any key in SELECTABLE_FEATURE_TYPES
    maxSelectable: 0, // 0 is interpreted as unlimited, all other values are discrete limits
    derived: { // Derived feature-specific mappings of selectable item IDs to SELECTION_PORTIONS
      [FEATURES.STATES.KEY]: {}, // { stateCode: SELECTION_PORTIONS.KEY }
      [FEATURES.DOMAINS.KEY]: {}, // { domainCode: SELECTION_PORTIONS.KEY }
    },
  },
  featureDataFetchesHasAwaiting: false, // Boolean: track whether any data fetches are awaiting call
  featureDataFetches: Object.fromEntries(
    Object.keys(FEATURE_TYPES).map(featureType => [featureType, {}]),
  ),
  featureData: Object.fromEntries(
    Object.keys(FEATURE_TYPES).map(featureType => [featureType, {}]),
  ),
  filters: {
    search: null,
    features: {
      open: false, // whether the features pane is open/visible
      available: Object.fromEntries( // key/bool map of which features are available per the zoom
        Object.entries(FEATURES).map(entry => [
          entry[0],
          !entry[1].minZoom && !entry[1].maxZoom && (
            !entry[1].parent || (
              !FEATURES[entry[1].parent].minZoom && !FEATURES[entry[1].parent].maxZoom
            )
          ),
        ]),
      ),
      visible: Object.fromEntries( // key/bool map of which available features are visible
        Object.entries(FEATURES).map(entry => [entry[0], !entry[1].hideByDefault]),
      ),
    },
  },
};
// Initialize featureData and featureDataFetches objects for all features that have a dataLoadType
Object.keys(FEATURES)
  .filter(featureKey => (
    FEATURES[featureKey].type !== FEATURE_TYPES.SITES
      && Object.keys(FEATURE_DATA_LOAD_TYPES).includes(FEATURES[featureKey].dataLoadType)
  ))
  .forEach((featureKey) => {
    const { type: featureType } = FEATURES[featureKey];
    DEFAULT_STATE.featureData[featureType][featureKey] = {};
    DEFAULT_STATE.featureDataFetches[featureType][featureKey] = {};
  });
// Initialize all selectable features in selection state
Object.keys(SELECTABLE_FEATURE_TYPES).forEach((selection) => {
  DEFAULT_STATE.selection[selection] = new Set();
});

// Populate static JSON featureData
// States
if (statesShapesJSON) {
  statesShapesJSON.features.forEach((feature) => {
    if (!feature.properties || !feature.properties.stateCode) { return; }
    const { stateCode } = feature.properties;
    DEFAULT_STATE.featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.STATES.KEY][stateCode] = {
      geometry: feature.geometry,
      sites: new Set(),
    };
  });
}
// Domains
if (domainsShapesJSON) {
  domainsShapesJSON.features.forEach((feature) => {
    if (!feature.properties || !feature.properties.domainCode) { return; }
    const { domainCode } = feature.properties;
    DEFAULT_STATE.featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.DOMAINS.KEY][domainCode] = {
      geometry: feature.geometry,
      sites: new Set(),
    };
  });
}

export const hydrateNeonContextData = (state, neonContextData) => {
  const newState = { ...state, neonContextHydrated: true };
  // Sites
  Object.keys(neonContextData.sites).forEach((siteCode) => {
    newState.featureData[FEATURE_TYPES.SITES][siteCode] = { ...neonContextData.sites[siteCode] };
  });
  // States
  Object.keys(neonContextData.states).forEach((stateCode) => {
    newState.featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.STATES.KEY][stateCode] = {
      ...newState.featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.STATES.KEY][stateCode],
      ...neonContextData.states[stateCode],
      sites: neonContextData.stateSites[stateCode],
    };
  });
  // Domains
  Object.keys(neonContextData.domains).forEach((domainCode) => {
    newState.featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.DOMAINS.KEY][domainCode] = {
      ...newState.featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.DOMAINS.KEY][domainCode],
      ...neonContextData.domains[domainCode],
      sites: neonContextData.domainSites[domainCode],
    };
  });
  return newState;
};

/**
   PropTypes and defaultProps
*/
export const SITE_MAP_PROP_TYPES = {
  // Top-level Props
  view: PropTypes.oneOf(Object.keys(VIEWS)),
  aspectRatio: PropTypes.number,
  // Map Props
  mapCenter: PropTypes.arrayOf(PropTypes.number),
  mapZoom: PropTypes.number,
  mapTileLayer: PropTypes.oneOf(Object.keys(TILE_LAYERS)),
  // Initial map focus (overrides mapCenter and mapZoom)
  location: PropTypes.string,
  // Selection Props
  selection: PropTypes.oneOf(Object.keys(SELECTABLE_FEATURE_TYPES)),
  maxSelectable: PropTypes.number,
  // Filter Props
  search: PropTypes.string,
  features: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(FEATURES))),
};

export const SITE_MAP_DEFAULT_PROPS = {
  // Top-level Props
  view: VIEWS.MAP,
  aspectRatio: null,
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
  features: null,
};

/**
   Aspect Ratio
*/
const dynamicAspectRatios = [
  '1:2', '9:16', '2:3', '5:7', '4:5', '1:1', '5:4', '7:5', '3:2', '16:9', '2:1', '2.5:1', '3:1',
].map((ratio) => {
  const parts = /^([\d.]+):([\d.]+)$/.exec(ratio) || ['', '1', '1'];
  return parseFloat(parts[2]) / parseFloat(parts[1]);
});

export const getDynamicAspectRatio = () => {
  const windowAspectRatio = Math.max(window.innerHeight - 40, 0) / window.innerWidth;
  const arIdx = dynamicAspectRatios.findIndex(ar => ar < windowAspectRatio);
  return arIdx === -1
    ? dynamicAspectRatios[dynamicAspectRatios.length - 1]
    : dynamicAspectRatios[arIdx];
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
const parseLocationProperties = (inProps = [], whiteList = []) => {
  const outProps = {};
  const cleanPropKey = (inKey = '') => {
    const words = inKey.substr(10)
      .replace(/[^A-Za-z0-9_ -]/g, '')
      .replace(/[_-]/g, ' ')
      .toLowerCase()
      .split(' ');
    return words.map((word, idx) => (
      idx === 0 ? word : `${word.substr(0, 1).toUpperCase()}${word.substr(1)}`
    )).join('');
  };
  if (!Array.isArray(inProps) || !inProps.length) { return outProps; }
  inProps.forEach((prop) => {
    const inPropKeys = Object.keys(prop);
    if (
      inPropKeys.length !== 2
        || !inPropKeys.includes('locationPropertyName')
        || !inPropKeys.includes('locationPropertyValue')
        || !(typeof prop.locationPropertyName === 'string')
    ) { return; }
    const propKey = cleanPropKey(prop.locationPropertyName);
    if (propKey.length && (!whiteList.length || whiteList.includes(propKey))) {
      outProps[propKey] = prop.locationPropertyValue;
    }
  });
  return outProps;
};

const DEFAULT_LOCATION_PROPERTIES_WHITELIST = [
  'maximumElevation',
  'minimumElevation',
  'nationalLandCoverDatabase2001',
  'plotDimensions',
  'plotId',
  'plotSize',
  'plotSubtype',
  'plotType',
  'slopeAspect',
  'slopeGradient',
  'soilTypeOrder,',
];

export const parseLocationData = (data = {}) => {
  const {
    locationType: type = null,
    locationDescription: description = null,
    locationDecimalLatitude: latitude = null,
    locationDecimalLongitude: longitude = null,
    locationElevation: elevation = null,
    locationProperties = {},
  } = data;
  return {
    type,
    description,
    latitude,
    longitude,
    elevation,
    ...parseLocationProperties(locationProperties, DEFAULT_LOCATION_PROPERTIES_WHITELIST),
  };
};

export const parseLocationHierarchy = (inHierarchy, parent = null) => {
  let outHierarchy = {};
  const name = inHierarchy.locationParentHierarchy ? null : inHierarchy.locationName;
  const description = inHierarchy.locationDescription || null;
  const type = inHierarchy.locationType || null;
  if (description.includes('Not Used')) { return outHierarchy; }
  if (name !== null) { outHierarchy[name] = { type, description, parent }; }
  inHierarchy.locationChildHierarchy.forEach((subLocation) => {
    outHierarchy = {
      ...outHierarchy,
      ...parseLocationHierarchy(subLocation, name),
    };
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
export const getIconClassName = (type = 'TYPE', isSelected = false) => ([
  'mapIcon', `mapIcon${type}`, `mapIcon${isSelected ? 'Selected' : 'Unselected'}`,
].join(' '));

// Site Markers: Get a leaflet icon instance scaled to the current zoom level.
const getZoomedSiteMarkerIcon = (zoom = 3, type, terrain, isSelected = false) => {
  const svgs = ICON_SVGS.SITE_MARKERS;
  if (!svgs[type] || !svgs[type][terrain] || !svgs[type].SHADOW) { return null; }
  const selected = isSelected ? 'SELECTED' : 'BASE';
  const iconScale = 0.2 + (Math.floor(((zoom || 2) - 2) / 3) / 10);
  const iconSize = isSelected ? [150, 150] : [100, 100];
  const iconAnchor = isSelected ? [75, 125] : [50, 100];
  const shadowSize = isSelected ? [234, 160] : [156, 93];
  const shadowAnchor = isSelected ? [80, 120] : [50, 83];
  return new L.Icon({
    iconUrl: svgs[type][terrain][selected],
    iconRetinaUrl: svgs[type][terrain][selected],
    iconSize: iconSize.map(x => x * iconScale),
    iconAnchor: iconAnchor.map(x => x * iconScale),
    shadowUrl: svgs[type].SHADOW[selected],
    shadowSize: shadowSize.map(x => x * iconScale),
    shadowAnchor: shadowAnchor.map(x => x * iconScale),
    popupAnchor: [0, -100].map(x => x * iconScale),
    className: getIconClassName(type, isSelected),
  });
};
const getZoomedLocationIcon = (zoom = 3) => {
  const iconScale = 0.2 + (Math.floor(((zoom || 2) - 2) / 3) / 10);
  const iconSize = [50, 50];
  const iconAnchor = [25, 50];
  const shadowSize = [78, 46.5];
  const shadowAnchor = [25, 41.5];
  return new L.Icon({
    iconUrl: ICON_SVGS.PLACEHOLDER,
    iconRetinaUrl: ICON_SVGS.PLACEHOLDER,
    iconSize: iconSize.map(x => x * iconScale),
    iconAnchor: iconAnchor.map(x => x * iconScale),
    shadowUrl: ICON_SVGS.SITE_MARKERS.CORE.SHADOW.BASE,
    shadowSize: shadowSize.map(x => x * iconScale),
    shadowAnchor: shadowAnchor.map(x => x * iconScale),
    popupAnchor: [0, -50].map(x => x * iconScale),
    className: getIconClassName('PLACEHOLDER'),
  });
};
// Get a structure containing all zoomed leaflet icon instances. These are stored in
// state and regenerated any time the zoom level changes. This makes for a maximum of
// eight distinct icon instances in memory instead of one for every site.
export const getZoomedIcons = zoom => ({
  SITE_MARKERS: {
    CORE: {
      AQUATIC: {
        BASE: getZoomedSiteMarkerIcon(zoom, 'CORE', 'AQUATIC'),
        SELECTED: getZoomedSiteMarkerIcon(zoom, 'CORE', 'AQUATIC', true),
      },
      TERRESTRIAL: {
        BASE: getZoomedSiteMarkerIcon(zoom, 'CORE', 'TERRESTRIAL'),
        SELECTED: getZoomedSiteMarkerIcon(zoom, 'CORE', 'TERRESTRIAL', true),
      },
    },
    RELOCATABLE: {
      AQUATIC: {
        BASE: getZoomedSiteMarkerIcon(zoom, 'RELOCATABLE', 'AQUATIC'),
        SELECTED: getZoomedSiteMarkerIcon(zoom, 'RELOCATABLE', 'AQUATIC', true),
      },
      TERRESTRIAL: {
        BASE: getZoomedSiteMarkerIcon(zoom, 'RELOCATABLE', 'TERRESTRIAL'),
        SELECTED: getZoomedSiteMarkerIcon(zoom, 'RELOCATABLE', 'TERRESTRIAL', true),
      },
    },
  },
  PLACEHOLDER: getZoomedLocationIcon(zoom),
});

export const getMapStateForFoucusLocation = (state = {}) => {
  const { focusLocation } = state;
  if (!focusLocation || !focusLocation.current) { return state; }
  const { current } = focusLocation;
  const { type = '', latitude, longitude } = focusLocation.data || {};

  const newState = { ...state };
  newState.map.bounds = null;
  newState.map.zoom = null;

  // No latitude/longitude: return all defaults
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    newState.map.center = SITE_MAP_DEFAULT_PROPS.mapCenter;
    return newState;
  }

  // Everything else (valid location with a center)
  newState.map.center = [latitude, longitude];
  newState.map.bounds = null;
  newState.map.zoom = null;
  const pointTypes = [
    'TOWER', 'HUT', 'MEGAPIT', 'GROUNDWATER_WELL', 'MET_STATION', 'STAFF_GAUGE', 'S1_LOC', 'S2_LOC',
  ];
  if (pointTypes.includes(type) || type.includes('OS Plot') || type.includes('AOS')) {
    newState.map.zoom = 16;
  }
  if (type === 'SITE') { newState.map.zoom = 12; }
  if (type === 'DOMAIN') {
    const { [FEATURES.DOMAINS.KEY]: domainsData } = state.featureData[FEATURE_TYPES.BOUNDARIES];
    newState.map.zoom = (domainsData[current] || {}).zoom || null;
  }
  if (type === 'STATE') {
    const { [FEATURES.STATES.KEY]: statesData } = state.featureData[FEATURE_TYPES.BOUNDARIES];
    newState.map.zoom = (statesData[current] || {}).zoom || null;
  }
  if (newState.map.zoom !== null) {
    newState.map.zoomedIcons = getZoomedIcons(newState.map.zoom);
  }
  return newState;
};
