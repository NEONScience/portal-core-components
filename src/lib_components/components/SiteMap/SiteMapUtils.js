import PropTypes from 'prop-types';

import { COLORS } from '../Theme/Theme';

import iconCoreTerrestrialSVG from './icon-core-terrestrial.svg';
import iconCoreTerrestrialSelectedSVG from './icon-core-terrestrial-selected.svg';
import iconCoreAquaticSVG from './icon-core-aquatic.svg';
import iconCoreAquaticSelectedSVG from './icon-core-aquatic-selected.svg';
import iconCoreShadowSVG from './icon-core-shadow.svg';
import iconCoreShadowSelectedSVG from './icon-core-shadow-selected.svg';
import iconRelocatableTerrestrialSVG from './icon-relocatable-terrestrial.svg';
import iconRelocatableTerrestrialSelectedSVG from './icon-relocatable-terrestrial-selected.svg';
import iconRelocatableAquaticSVG from './icon-relocatable-aquatic.svg';
import iconRelocatableAquaticSelectedSVG from './icon-relocatable-aquatic-selected.svg';
import iconRelocatableShadowSVG from './icon-relocatable-shadow.svg';
import iconRelocatableShadowSelectedSVG from './icon-relocatable-shadow-selected.svg';

import statesShapesJSON from '../../staticJSON/statesShapes.json';
import domainsShapesJSON from '../../staticJSON/domainsShapes.json';
import siteSamplingBoundariesJSON from '../../staticJSON/siteSamplingBoundaries.json';

export const MAP_ZOOM_RANGE = [1, 16];

/**
   Key Sets
   Used to limit the use of "magic strings" that need to be consistent across many files
*/
// For consistency in expressing the sort direction for the table
export const SORT_DIRECTIONS = { ASC: 'ASC', DESC: 'DESC' };

// For consistency in differentiating discrete sets of data.
export const FEATURE_TYPES = {
  SITES: 'SITES',
  PLOTS: 'PLOTS',
  BOUNDARIES: 'BOUNDARIES',
};

// Subset of FEATURE_TYPES describing all features that are directly selectable
export const SELECTABLE_FEATURE_TYPES = (({ SITES }) => ({ SITES }))(FEATURE_TYPES);

// For consistency in denoting whether all or some of a region's selectable children are selected
export const SELECTION_PORTIONS = { PARTIAL: 'PARTIAL', TOTAL: 'TOTAL' };

// For consistency in denoting which dinstinct user interfaces are available and which is visible
export const VIEWS = { MAP: 'MAP', TABLE: 'TABLE' };

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
};

/**
   FEATURES
   A data structure describing all descrete boundaries or sets of icons that can be shown on the map
   Convention: all keys are consistently plural
*/
export const FEATURES = {
  TOWER_LOCATIONS: {
    name: 'Tower Location',
    type: FEATURE_TYPES.PLOTS,
    minZoom: 10,
    description: '',
  },
  TOWER_AIRSHED_BOUNDARIES: {
    name: 'Tower Airshed Boundary',
    type: FEATURE_TYPES.BOUNDARIES,
    minZoom: 13,
    description: '',
  },
  TOWER_PLOTS: {
    name: 'Tower Plots',
    isParent: true,
    minZoom: 13,
    description: 'Tower plots provide a direct link between NEON’s Terrestrial Observation System and Terrestrial Instrument System. Tower Plots are located in and around the NEON tower primary and secondary airsheds.',
  },
  TOWER_BASE_PLOTS: {
    name: 'Tower Base Plot',
    type: FEATURE_TYPES.PLOTS,
    description: 'Tower plots support a variety of plant productivity, plant diversity, soil, biogeochemistry and microbe sampling. The number and size of Tower Base Plots is determined by the vegetation of the tower airshed. In forested sites, twenty 40m x 40m plots are established. In herbaceous sites, thirty 20m x 20m plots are established.  Of these thirty tower plots, four have additional space to support soil sampling.',
    parent: 'TOWER_PLOTS',
    attributes: { type: 'base', location: 'tower' },
  },
  TOWER_PHENOLOGY_PLOTS: {
    name: 'Tower Phenology Plot',
    type: FEATURE_TYPES.PLOTS,
    description: 'Plant phenology observations are made along a transect loop or plot in or around the primary airshed. When possible, one plot is established north of the tower to calibrate phenology camera images captured from sensors on the tower. If there is insufficient space north of the tower for a 200m x 200m plot or if the vegetation does not match the primary airshed an additional plot is established.',
    parent: 'TOWER_PLOTS',
    attributes: { type: 'phenology', location: 'tower' },
  },
  DISTRIBUTED_PLOTS: {
    name: 'Distributed Plots',
    isParent: true,
    minZoom: 10,
    description: 'Distributed Plots are located throughout the TOS Sampling boundary in an effort to describe organisms and process with plot, point, and grid sampling. Plots were established according to a stratified-random and spatially balanced design.',
  },
  DISTRIBUTED_BASE_PLOTS: {
    name: 'Distributed Base Plots',
    type: FEATURE_TYPES.PLOTS,
    description: 'Distributed Base Plots support a variety of plant productivity, plant diversity, soil, biogeochemistry, microbe and beetle sampling. Distributed Base Plots are 40m x 40m.',
    parent: 'DISTRIBUTED_PLOTS',
    attributes: { type: 'base', location: 'distributed' },
  },
  DISTRIBUTED_BIRD_GRIDS: {
    name: 'Distributed Bird Grids',
    type: FEATURE_TYPES.PLOTS,
    description: 'Bird Grids consist of 9 sampling points within a 500m x 500m square. Each point is 250m apart. Where possible, Bird Grids are colocated with Distributed Base Plots by placing the Bird Grid center (B2) in close proximity to the center of the Base Plot. At smaller sites, a single point count is done at the south-west corner (point 21) of the Distributed Base Plot.',
    parent: 'DISTRIBUTED_PLOTS',
    attributes: { type: 'bird', location: 'distributed' },
  },
  DISTRIBUTED_MAMMAL_GRIDS: {
    name: 'Distributed Mammal Grids',
    type: FEATURE_TYPES.PLOTS,
    description: 'Mammal Grids are 90m x 90m and include 100 trapping locations at 10m spacing. Where possible, these grids are colocated with Distributed Base Plots by placing them a specified distance (150m +/- 50m) and random direction from the center of the Base Plot.',
    parent: 'DISTRIBUTED_PLOTS',
    attributes: { type: 'mammal', location: 'distributed' },
  },
  DISTRIBUTED_MOSQUITO_PLOTS: {
    name: 'Distributed Mosquito Plots',
    type: FEATURE_TYPES.PLOTS,
    description: 'At each Mosquito Point, one CO2 trap is established. Due to the frequency of sampling and temporal sampling constraints, Mosquito Points are located within 45m of roads.',
    parent: 'DISTRIBUTED_PLOTS',
    attributes: { type: 'mosquito', location: 'distributed' },
  },
  DISTRIBUTED_TICK_PLOTS: {
    name: 'Distributed Tick Plots',
    type: FEATURE_TYPES.PLOTS,
    description: 'Tick Plots are sampled by conducting cloth dragging or flagging around the perimeter of a 40m x 40m plot. Tick plots are colocated with Distributed Base Plots by placing them a specified distance (150m +/- 15m) and random direction from the center of the Base Plot.',
    parent: 'DISTRIBUTED_PLOTS',
    attributes: { type: 'tick', location: 'distributed' },
  },
  SAMPLING_BOUNDARIES: {
    name: 'Site Sampling Boundary / Reach',
    type: FEATURE_TYPES.BOUNDARIES,
    minZoom: 7,
    description: '',
  },
  WATERSHED_BOUNDARIES: {
    name: 'Site Watershed Boundary',
    type: FEATURE_TYPES.BOUNDARIES,
    minZoom: 6,
    description: '',
  },
  FLIGHT_BOX_BOUNDARIES: {
    name: 'Site AOP Flight Box Boundary',
    type: FEATURE_TYPES.BOUNDARIES,
    minZoom: 6,
    description: '',
  },
  SITE_MARKERS: {
    name: 'NEON Site Markers',
    isParent: true,
    description: '',
  },
  TERRESTRIAL_CORE_SITES: {
    name: 'Terrestrial Core Sites',
    type: FEATURE_TYPES.SITES,
    description: 'Land-based; fixed location',
    iconSvg: ICON_SVGS.SITE_MARKERS.CORE.TERRESTRIAL.BASE,
    parent: 'SITE_MARKERS',
    attributes: { type: 'CORE', terrain: 'TERRESTRIAL' },
  },
  TERRESTRIAL_RELOCATABLE_SITES: {
    name: 'Terrestrial Relocatable Sites',
    type: FEATURE_TYPES.SITES,
    description: 'Land-based; location may change',
    iconSvg: ICON_SVGS.SITE_MARKERS.RELOCATABLE.TERRESTRIAL.BASE,
    parent: 'SITE_MARKERS',
    attributes: { type: 'RELOCATABLE', terrain: 'TERRESTRIAL' },
  },
  AQUATIC_CORE_SITES: {
    name: 'Aquatic Core Sites',
    type: FEATURE_TYPES.SITES,
    description: 'Water-based; fixed location',
    iconSvg: ICON_SVGS.SITE_MARKERS.CORE.AQUATIC.BASE,
    parent: 'SITE_MARKERS',
    attributes: { type: 'CORE', terrain: 'AQUATIC' },
  },
  AQUATIC_RELOCATABLE_SITES: {
    name: 'Aquatic Relocatable Sites',
    type: FEATURE_TYPES.SITES,
    description: 'Water-based; location may change',
    iconSvg: ICON_SVGS.SITE_MARKERS.RELOCATABLE.AQUATIC.BASE,
    parent: 'SITE_MARKERS',
    attributes: { type: 'RELOCATABLE', terrain: 'AQUATIC' },
  },
  DOMAINS: {
    name: 'NEON Domains',
    type: FEATURE_TYPES.BOUNDARIES,
    description: '',
    hideByDefault: true,
  },
  STATES: {
    name: 'US States',
    type: FEATURE_TYPES.BOUNDARIES,
    description: '',
    hideByDefault: true,
  },
};
// Replicate keys as attributes to completely eliminate the need to write a feature key string
Object.keys(FEATURES).forEach((key) => { FEATURES[key].KEY = key; });

export const BOUNDARY_COLORS = {
  [FEATURES.STATES.KEY]: '#3cdd85',
  [FEATURES.DOMAINS.KEY]: '#a36ce5',
  [FEATURES.SAMPLING_BOUNDARIES.KEY]: '#ff0000',
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
  featureData: Object.fromEntries(Object.keys(FEATURE_TYPES).map(featureType => [featureType, {}])),
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
// Initialize all boundary-type features in featureData state
Object.keys(FEATURES)
  .filter(featureKey => FEATURES[featureKey].type === FEATURE_TYPES.BOUNDARIES)
  .forEach((featureKey) => {
    DEFAULT_STATE.featureData[FEATURE_TYPES.BOUNDARIES][featureKey] = {};
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
// Sampling Boundaries
if (siteSamplingBoundariesJSON) {
  siteSamplingBoundariesJSON.features.forEach((feature) => {
    if (!feature.properties || !feature.properties.siteCode) { return; }
    const { siteCode } = feature.properties;
    DEFAULT_STATE
      .featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.SAMPLING_BOUNDARIES.KEY][siteCode] = {
        geometry: feature.geometry,
        ...feature.properties,
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
