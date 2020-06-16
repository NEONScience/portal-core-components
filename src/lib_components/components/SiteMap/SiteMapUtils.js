import PropTypes from 'prop-types';

import L from 'leaflet';

import { COLORS } from '../Theme/Theme';

// SVGs for all map icons
import iconPlaceholderSVG from './svg/icon-placeholder.svg';

import iconShapeCircleShadowSVG from './svg/icon-shape-circle-shadow.svg';
import iconShapeCircleSelectSVG from './svg/icon-shape-circle-select.svg';
import iconShapeCircleHighlightSVG from './svg/icon-shape-circle-highlight.svg';
import iconShapeDiamondShadowSVG from './svg/icon-shape-diamond-shadow.svg';
import iconShapeDiamondSelectSVG from './svg/icon-shape-diamond-select.svg';
import iconShapeDiamondHighlightSVG from './svg/icon-shape-diamond-highlight.svg';
import iconShapeHomeplateShadowSVG from './svg/icon-shape-homeplate-shadow.svg';
import iconShapeHomeplateSelectSVG from './svg/icon-shape-homeplate-select.svg';
import iconShapeHomeplateHighlightSVG from './svg/icon-shape-homeplate-highlight.svg';
import iconShapeSquareShadowSVG from './svg/icon-shape-square-shadow.svg';
import iconShapeSquareSelectSVG from './svg/icon-shape-square-select.svg';
import iconShapeSquareHighlightSVG from './svg/icon-shape-square-highlight.svg';

import iconSiteCoreTerrestrialSVG from './svg/icon-site-core-terrestrial.svg';
import iconSiteCoreTerrestrialSelectedSVG from './svg/icon-site-core-terrestrial-selected.svg';
import iconSiteCoreAquaticSVG from './svg/icon-site-core-aquatic.svg';
import iconSiteCoreAquaticSelectedSVG from './svg/icon-site-core-aquatic-selected.svg';
import iconSiteRelocatableTerrestrialSVG from './svg/icon-site-relocatable-terrestrial.svg';
import iconSiteRelocatableTerrestrialSelectedSVG from './svg/icon-site-relocatable-terrestrial-selected.svg';
import iconSiteRelocatableAquaticSVG from './svg/icon-site-relocatable-aquatic.svg';
import iconSiteRelocatableAquaticSelectedSVG from './svg/icon-site-relocatable-aquatic-selected.svg';

import iconBenchmarkSVG from './svg/icon-benchmark.svg';
import iconBuoySVG from './svg/icon-buoy.svg';
import iconDischargePointSVG from './svg/icon-discharge-point.svg';
import iconDistributedBasePlotSVG from './svg/icon-distributed-base-plot.svg';
import iconDistributedBirdGridSVG from './svg/icon-distributed-bird-grid.svg';
import iconDistributedMammalGridSVG from './svg/icon-distributed-mammal-grid.svg';
import iconDistributedMosquitoPointSVG from './svg/icon-distributed-mosquito-point.svg';
import iconDistributedTickPlotSVG from './svg/icon-distributed-tick-plot.svg';
import iconFishPointSVG from './svg/icon-fish-point.svg';
import iconGroundwaterWellSVG from './svg/icon-groundwater-well.svg';
import iconHutSVG from './svg/icon-hut.svg';
import iconPourPointSVG from './svg/icon-pour-point.svg';
import iconMegapitSVG from './svg/icon-megapit.svg';
import iconMeteorologicalStationSVG from './svg/icon-meteorological-station.svg';
import iconPlantTransectSVG from './svg/icon-plant-transect.svg';
import iconRiparianAssessmentSVG from './svg/icon-riparian-assessment.svg';
import iconSedimentPointSVG from './svg/icon-sediment-point.svg';
import iconSensorStationSVG from './svg/icon-sensor-station.svg';
import iconStaffGaugeSVG from './svg/icon-staff-gauge.svg';
import iconTowerSVG from './svg/icon-tower.svg';
import iconTowerBasePlotSVG from './svg/icon-tower-base-plot.svg';
import iconTowerPhenologyPlotSVG from './svg/icon-tower-phenology-plot.svg';
import iconTowerSoilPlotSVG from './svg/icon-tower-soil-plot.svg';
import iconWetDepositionPointSVG from './svg/icon-wet-deposition-point.svg';

// Static JSON for Boundary features
import statesShapesJSON from '../../staticJSON/statesShapes.json';
import domainsShapesJSON from '../../staticJSON/domainsShapes.json';

export const MAP_ZOOM_RANGE = [1, 19];

export const MIN_TABLE_MAX_BODY_HEIGHT = 100;

// export const MINIMUM_MAP_DIMENSIONS = { width: 300, height: 200 };

export const KM2_TO_ACRES = 247.10538146717;

// Minimum zoom level at which location hierarchy fetches are done on a per-domain basis
// We don't do per-site because hierarchy query performance is a function of number of immediate
// children. Domains top out at 8 or so sites, while sites may have over a hundred children (plots)
// Note that while we FETCH at the domain level we parse down to the site level as that's what's
// most useful for generating subsequent fetches
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
  SAMPLING_POINTS: 'SAMPLING_POINTS',
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

// For consistency in denoting the selection status of any selectable thing
export const SELECTION_STATUS = { SELECTED: 'SELECTED', UNSELECTED: 'UNSELECTED' };

// For consistency in denoting the highlight status of a marker
export const HIGHLIGHT_STATUS = { NONE: 'NONE', HIGHLIGHT: 'HIGHLIGHT', SELECT: 'SELECT' };

// For consistency in denoting which dinstinct user interfaces are available and which is visible
export const VIEWS = { MAP: 'MAP', TABLE: 'TABLE' };

// For consistency in tracking the current status of a fetch or import
export const FETCH_STATUS = {
  AWAITING_CALL: 'AWAITING_CALL',
  FETCHING: 'FETCHING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
};

export const PLOT_SAMPLING_MODULES = {
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
  mfb: 'MFB', // We don't know what this is...
  mos: 'Mosquitos',
  mpt: 'Mosquito Pathogens',
  phe: 'Plant Phenology',
  sme: 'Soil Microbes',
  tck: 'Ticks',
  vst: 'Vegetation Structure',
};

/**
   Icon SVGs
   An importable data structure containing all imported SVGs for map and legend icons
*/
const SELECTED_ICON_OFFSET = 30; // Number of pixels bigger in one dimension for selected icons
const LOCATION_ICON_SVG_SHAPES = {
  CIRCLE: {
    KEY: 'CIRCLE',
    iconSize: [80, 80],
    iconAnchor: [40, 40],
    popupAnchor: [0, -40],
    shadow: {
      [HIGHLIGHT_STATUS.NONE]: {
        svg: iconShapeCircleShadowSVG,
        size: [100, 100],
        anchor: [50, 50],
      },
      [HIGHLIGHT_STATUS.HIGHLIGHT]: {
        svg: iconShapeCircleHighlightSVG,
        size: [120, 120],
        anchor: [60, 60],
      },
      [HIGHLIGHT_STATUS.SELECT]: {
        svg: iconShapeCircleSelectSVG,
        size: [120, 120],
        anchor: [60, 60],
      },
    },
  },
  DIAMOND: {
    KEY: 'DIAMOND',
    iconSize: [100, 100],
    iconAnchor: [50, 50],
    popupAnchor: [0, -50],
    shadow: {
      [HIGHLIGHT_STATUS.NONE]: {
        svg: iconShapeDiamondShadowSVG,
        size: [124, 124],
        anchor: [62, 62],
      },
      [HIGHLIGHT_STATUS.HIGHLIGHT]: {
        svg: iconShapeDiamondHighlightSVG,
        size: [144, 144],
        anchor: [72, 72],
      },
      [HIGHLIGHT_STATUS.SELECT]: {
        svg: iconShapeDiamondSelectSVG,
        size: [144, 144],
        anchor: [72, 72],
      },
    },
  },
  HOMEPLATE: {
    KEY: 'HOMEPLATE',
    iconSize: [80, 90],
    iconAnchor: [40, 45],
    popupAnchor: [0, -45],
    shadow: {
      [HIGHLIGHT_STATUS.NONE]: {
        svg: iconShapeHomeplateShadowSVG,
        size: [101, 111],
        anchor: [50.5, 55.5],
      },
      [HIGHLIGHT_STATUS.HIGHLIGHT]: {
        svg: iconShapeHomeplateHighlightSVG,
        size: [121, 131],
        anchor: [60.5, 65.5],
      },
      [HIGHLIGHT_STATUS.SELECT]: {
        svg: iconShapeHomeplateSelectSVG,
        size: [121, 131],
        anchor: [60.5, 65.5],
      },
    },
  },
  SQUARE: {
    KEY: 'SQUARE',
    iconSize: [75, 75],
    iconAnchor: [37.5, 37.5],
    popupAnchor: [0, -37.5],
    shadow: {
      [HIGHLIGHT_STATUS.NONE]: {
        svg: iconShapeSquareShadowSVG,
        size: [94, 94],
        anchor: [47, 47],
      },
      [HIGHLIGHT_STATUS.HIGHLIGHT]: {
        svg: iconShapeSquareHighlightSVG,
        size: [114, 114],
        anchor: [57, 57],
      },
      [HIGHLIGHT_STATUS.SELECT]: {
        svg: iconShapeSquareSelectSVG,
        size: [114, 114],
        anchor: [57, 57],
      },
    },
  },
};

/**
   FEATURES
   A data structure describing all descrete boundaries or sets of icons that can be shown on the map
   Convention: all keys are consistently plural
   Order is draw order on map (so largest boundary features should be first)
*/
export const FEATURES = {
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
    style: { color: '#a067e4' },
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
    style: { color: '#3cdd84' },
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
    style: { color: '#f0ee75', dashArray: '5, 10' },
  },
  // AQUATIC_WATERSHEDS Group
  AQUATIC_WATERSHEDS: {
    name: 'Watersheds',
    type: FEATURE_TYPES.GROUP,
    minZoom: 6,
    description: '',
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
    style: { color: '#669199', dashArray: '5, 10' },
  },
  DRAINAGE_LINES: {
    name: 'Drainage Lines',
    type: FEATURE_TYPES.OTHER,
    minZoom: 8,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.IMPORT,
    description: '',
    parent: 'AQUATIC_WATERSHEDS',
    featureShape: 'Polyline',
    style: { color: '#365d63' },
  },
  POUR_POINTS: {
    name: 'Pour Points',
    nameSingular: 'Pour Point',
    type: FEATURE_TYPES.OTHER,
    minZoom: 7,
    dataLoadType: FEATURE_DATA_LOAD_TYPES.IMPORT,
    description: '',
    parent: 'AQUATIC_WATERSHEDS',
    iconSvg: iconPourPointSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.HOMEPLATE.KEY,
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
    style: { color: '#e8847d', dashArray: '5, 10, 2.5, 10' },
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
    style: { color: '#ad85a0', dashArray: '5, 10, 2.5, 10' },
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
    style: { color: '#749966', dashArray: '5, 10, 2.5, 10' },
  },
  // Terrestrial Site Features
  TERRESTRIAL_SITE_FEATURES: {
    name: 'Terrestrial Site Features',
    type: FEATURE_TYPES.GROUP,
    minZoom: 10,
    description: '',
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'OS Plot - all', // Fetches for TOWER_BASE_PLOTS and DISTRIBUTED_BASE_PLOTS
    fetchingForFeatures: ['TOWER_BASE_PLOTS', 'DISTRIBUTED_BASE_PLOTS'],
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
    iconSvg: iconTowerSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.DIAMOND.KEY,
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
    iconSvg: iconHutSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.DIAMOND.KEY,
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
    iconSvg: iconMegapitSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.DIAMOND.KEY,
  },
  // TOWER_PLOTS Group
  TOWER_PLOTS: {
    name: 'Tower Plots',
    type: FEATURE_TYPES.GROUP,
    minZoom: 13,
    description: 'Tower plots provide a direct link between NEON’s Terrestrial Observation System and Terrestrial Instrument System. Tower Plots are located in and around the NEON tower primary and secondary airsheds.',
    parent: 'TERRESTRIAL_SITE_FEATURES',
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
    iconSvg: iconTowerPhenologyPlotSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
  },
  TOWER_BASE_PLOTS: { // Fetched by parent since tower base plots share type
    name: 'Tower Base Plots',
    nameSingular: 'Tower Base Plot',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'Tower plots support a variety of plant productivity, plant diversity, soil, biogeochemistry and microbe sampling. The number and size of Tower Base Plots is determined by the vegetation of the tower airshed. In forested sites, twenty 40m x 40m plots are established. In herbaceous sites, thirty 20m x 20m plots are established. Of these thirty tower plots, four have additional space to support soil sampling.',
    parent: 'TOWER_PLOTS',
    focusZoom: 18,
    iconSvg: iconTowerBasePlotSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
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
    iconSvg: iconTowerSoilPlotSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
  },
  // DISTRIBUTED_PLOTS Group
  DISTRIBUTED_PLOTS: {
    name: 'Distributed Plots',
    type: FEATURE_TYPES.GROUP,
    minZoom: 10,
    description: 'Distributed Plots are located throughout the TOS Sampling boundary in an effort to describe organisms and process with plot, point, and grid sampling. Plots were established according to a stratified-random and spatially balanced design.',
    parent: 'TERRESTRIAL_SITE_FEATURES',
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
    iconSvg: iconDistributedBirdGridSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
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
    iconSvg: iconDistributedMammalGridSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
  },
  DISTRIBUTED_BASE_PLOTS: { // Fetched by parent since tower base plots share type
    name: 'Distributed Base Plots',
    nameSingular: 'Distributed Base Plot',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'Distributed Base Plots support a variety of plant productivity, plant diversity, soil, biogeochemistry, microbe and beetle sampling. Distributed Base Plots are 40m x 40m.',
    parent: 'DISTRIBUTED_PLOTS',
    iconScale: 1.2,
    focusZoom: 17,
    iconSvg: iconDistributedBasePlotSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
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
    iconSvg: iconDistributedTickPlotSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
  },
  DISTRIBUTED_MOSQUITO_POINTS: {
    name: 'Distributed Mosquito Points',
    nameSingular: 'Distributed Mosquito Point',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'At each Mosquito Point, one CO2 trap is established. Due to the frequency of sampling and temporal sampling constraints, Mosquito Points are located within 45m of roads.',
    parent: 'DISTRIBUTED_PLOTS',
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    matchLocationType: 'OS Plot - mos',
    iconSvg: iconDistributedMosquitoPointSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    focusZoom: 18,
  },
  // Distributed Plots Sampling Points Group
  DISTRIBUTED_PLOTS_SAMPLING_POINTS: {
    name: 'Distributed Plot Sampling Points',
    type: FEATURE_TYPES.GROUP,
    minZoom: 14,
    description: 'Distributed Plots are located throughout the TOS Sampling boundary in an effort to describe organisms and process with plot, point, and grid sampling. Plots were established according to a stratified-random and spatially balanced design.',
    parent: 'TERRESTRIAL_SITE_FEATURES',
  },
  DISTRIBUTED_BIRD_GRID_POINTS: {
    name: 'Bird Grid Sampling Points',
    nameSingular: 'Bird Grid Sampling Point',
    type: FEATURE_TYPES.SAMPLING_POINTS,
    description: 'Bird Grids consist of 9 sampling points within a 500m x 500m square. Each point is 250m apart. Where possible, Bird Grids are colocated with Distributed Base Plots by placing the Bird Grid center (B2) in close proximity to the center of the Base Plot. At smaller sites, a single point count is done at the south-west corner (point 21) of the Distributed Base Plot.',
    parent: 'DISTRIBUTED_PLOTS_SAMPLING_POINTS',
    parentDataFeatureKey: 'DISTRIBUTED_BIRD_GRIDS',
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    minZoom: 14,
    featureShape: 'Circle',
    style: { color: '#f28e2c' },
  },
  DISTRIBUTED_MAMMAL_GRID_POINTS: {
    name: 'Mammal Grid Sampling Points',
    nameSingular: 'Mammal Grid Sampling Point',
    type: FEATURE_TYPES.SAMPLING_POINTS,
    description: 'Mammal Grids are 90m x 90m and include 100 trapping locations at 10m spacing. Where possible, these grids are colocated with Distributed Base Plots by placing them a specified distance (150m +/- 50m) and random direction from the center of the Base Plot.',
    parent: 'DISTRIBUTED_PLOTS_SAMPLING_POINTS',
    parentDataFeatureKey: 'DISTRIBUTED_MAMMAL_GRIDS',
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    minZoom: 16,
    featureShape: 'Circle',
    style: { color: '#925214' },
  },
  DISTRIBUTED_TICK_PLOT_POINTS: {
    name: 'Tick Plot Sampling Points',
    nameSingular: 'Tick Plot Sampling Point',
    type: FEATURE_TYPES.SAMPLING_POINTS,
    description: 'Tick Plots are sampled by conducting cloth dragging or flagging around the perimeter of a 40m x 40m plot. Tick plots are colocated with Distributed Base Plots by placing them a specified distance (150m +/- 15m) and random direction from the center of the Base Plot.',
    parent: 'DISTRIBUTED_PLOTS_SAMPLING_POINTS',
    parentDataFeatureKey: 'DISTRIBUTED_TICK_PLOTS',
    dataLoadType: FEATURE_DATA_LOAD_TYPES.FETCH,
    minZoom: 17,
    featureShape: 'Circle',
    style: { color: '#6b191a' },
  },
  // Aquatic Site Features
  AQUATIC_SITE_FEATURES: {
    name: 'Aquatic Site Features',
    type: FEATURE_TYPES.GROUP,
    minZoom: 14,
    description: '',
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
    iconSvg: iconBenchmarkSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.DIAMOND.KEY,
  },
  AQUATIC_AUTOMATED_INSTRUMENTS: {
    name: 'Automated Instuments',
    type: FEATURE_TYPES.GROUP,
    minZoom: 10,
    description: '',
    parent: 'AQUATIC_SITE_FEATURES',
  },
  AQUATIC_OBSERVATIONAL_SAMPLING: {
    name: 'Observational Sampling',
    type: FEATURE_TYPES.GROUP,
    minZoom: 11,
    description: '',
    parent: 'AQUATIC_SITE_FEATURES',
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
    iconSvg: iconRiparianAssessmentSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
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
    iconSvg: iconWetDepositionPointSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
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
    iconSvg: iconGroundwaterWellSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
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
    iconSvg: iconMeteorologicalStationSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
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
    iconSvg: iconDischargePointSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
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
    iconSvg: iconFishPointSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
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
    iconSvg: iconPlantTransectSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
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
    iconSvg: iconSedimentPointSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
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
    iconSvg: iconStaffGaugeSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
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
    iconSvg: iconSensorStationSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
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
    iconSvg: iconBuoySVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
  },
  // SITE_MARKERS Group
  SITE_MARKERS: {
    name: 'NEON Site Markers',
    type: FEATURE_TYPES.GROUP,
    description: '',
    maxZoom: 9,
  },
  TERRESTRIAL_CORE_SITES: {
    name: 'Terrestrial Core Sites',
    nameSingular: 'Terrestrial Core Site',
    type: FEATURE_TYPES.SITES,
    description: 'Land-based; fixed location',
    parent: 'SITE_MARKERS',
    attributes: { type: 'CORE', terrain: 'TERRESTRIAL' },
    dataLoadType: FEATURE_DATA_LOAD_TYPES.NEON_CONTEXT,
    primaryIdOnly: true,
    iconScale: 1,
    iconSvg: iconSiteCoreTerrestrialSVG,
    iconSelectedSvg: iconSiteCoreTerrestrialSelectedSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
  },
  TERRESTRIAL_RELOCATABLE_SITES: {
    name: 'Terrestrial Relocatable Sites',
    nameSingular: 'Terrestrial Relocatable Site',
    type: FEATURE_TYPES.SITES,
    description: 'Land-based; location may change',
    parent: 'SITE_MARKERS',
    attributes: { type: 'RELOCATABLE', terrain: 'TERRESTRIAL' },
    dataLoadType: FEATURE_DATA_LOAD_TYPES.NEON_CONTEXT,
    primaryIdOnly: true,
    iconScale: 1,
    iconSvg: iconSiteRelocatableTerrestrialSVG,
    iconSelectedSvg: iconSiteRelocatableTerrestrialSelectedSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
  },
  AQUATIC_CORE_SITES: {
    name: 'Aquatic Core Sites',
    nameSingular: 'Aquatic Core Site',
    type: FEATURE_TYPES.SITES,
    description: 'Water-based; fixed location',
    parent: 'SITE_MARKERS',
    attributes: { type: 'CORE', terrain: 'AQUATIC' },
    dataLoadType: FEATURE_DATA_LOAD_TYPES.NEON_CONTEXT,
    primaryIdOnly: true,
    iconScale: 1,
    iconSvg: iconSiteCoreAquaticSVG,
    iconSelectedSvg: iconSiteCoreAquaticSelectedSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
  },
  AQUATIC_RELOCATABLE_SITES: {
    name: 'Aquatic Relocatable Sites',
    nameSingular: 'Aquatic Relocatable Site',
    type: FEATURE_TYPES.SITES,
    description: 'Water-based; location may change',
    parent: 'SITE_MARKERS',
    attributes: { type: 'RELOCATABLE', terrain: 'AQUATIC' },
    dataLoadType: FEATURE_DATA_LOAD_TYPES.NEON_CONTEXT,
    primaryIdOnly: true,
    iconScale: 1,
    iconSvg: iconSiteRelocatableAquaticSVG,
    iconSelectedSvg: iconSiteRelocatableAquaticSelectedSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
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

export const calculateFeatureAvailability = (state) => {
  const featureIsAvailable = (feature) => {
    // Parent must be available (if the feature has a parent)
    if (typeof feature.parent === 'string' && !featureIsAvailable(FEATURES[feature.parent])) {
      return false;
    }
    const hasMinZoom = typeof feature.minZoom === 'number';
    const hasMaxZoom = typeof feature.maxZoom === 'number';
    // If zoom is not set then show all features that don't have a min zoom
    // We don't care about a maxZoom here because null zoom effectively means zoomed all the way out
    if (state.map.zoom === null) { return !hasMinZoom; }
    return (
      (!hasMinZoom || state.map.zoom >= feature.minZoom)
        && (!hasMaxZoom || state.map.zoom <= feature.maxZoom)
    );
  };
  const newState = {
    ...state,
    filters: {
      ...state.filters,
      features: {
        ...state.filters.features,
        available: Object.fromEntries(
          Object.entries(FEATURES).map(entry => [entry[0], featureIsAvailable(entry[1])]),
        ),
      },
    },
  };
  // Update table focus to reflect availability if need be
  Object.keys(state.table.availableFeatureTypes).forEach((featureType) => {
    newState.table.availableFeatureTypes[featureType] = Object.keys(FEATURES)
      .filter(featureKey => FEATURES[featureKey].type === featureType)
      .some(featureKey => newState.filters.features.available[featureKey]);
  });
  if (!newState.table.availableFeatureTypes[newState.table.focus]) {
    const available = Object.keys(newState.table.availableFeatureTypes)
      .filter(k => newState.table.availableFeatureTypes[k]);
    newState.table.focus = available[0] || state.table.focus;
  }
  return newState;
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
    KEY: 'NATGEO_WORLD_MAP',
    name: 'National Geographic',
    shortAttribution: '© Natl. Geographic et al.',
    fullAttribution: '© National Geographic, Esri, Garmin, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
  },
  WORLD_IMAGERY: {
    KEY: 'WORLD_IMAGERY',
    name: 'Satellite Imagery',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  },
  WORLD_STREET_MAP: {
    KEY: 'WORLD_STREET_MAP',
    name: 'Streets',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, OSM contributors, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
  },
  WORLD_TOPO_MAP: {
    KEY: 'WORLD_TOPO_MAP',
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
const featureIsHiddenByDefault = (key) => {
  let hidden = FEATURES[key].hideByDefault;
  if (FEATURES[key].parent && !hidden) { hidden = featureIsHiddenByDefault(FEATURES[key].parent); }
  return hidden;
};
export const DEFAULT_STATE = {
  view: {
    current: null,
    initialized: Object.fromEntries(
      Object.keys(VIEWS).map(view => [view, false]),
    ),
  },
  neonContextHydrated: false, // Whether NeonContext data has been one-time hydrated into state
  overallFetch: { // Aggregation of all current fetch statuses for the SiteMap component
    expected: 0,
    completed: 0,
    pendingHierarchy: 0, // In-progress hierarchy fetches (ones that will spawn more fetches)
  },
  focusLocation: {
    current: null,
    isCenteredOn: false, // Whether the map is still centered on and zoomed into focus location
    data: null,
    fetch: { status: null, error: null },
  },
  aspectRatio: {
    currentValue: null, // Aspect ratio of the Site Map component content area (table and/or map)
    isDynamic: true, // Whether currentValue should set itself dynamically from viewport size
    resizeEventListenerInitialized: false,
    widthReference: 0, // Width of content area we can combine with currentValue to get dimensions
  },
  table: { // Settings that ONLY apply to the table
    focus: FEATURE_TYPES.SITES,
    availableFeatureTypes: {
      [FEATURE_TYPES.SITES]: false,
      [FEATURE_TYPES.LOCATIONS]: false,
    },
    maxBodyHeight: null,
    // A way for the SiteMapContainer resizeHandler to inform the SiteMapTable to recalc body height
    maxBodyHeightUpdateFromAspectRatio: false,
  },
  map: { // Settings that ONLY apply to the map
    zoom: null,
    center: [],
    bounds: null,
    tileLayer: null,
    tileLayerAutoChangedAbove17: false,
    zoomedIcons: {},
    repositionOpenPopupFunc: null,
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
  sites: {}, // Sites data is split into 4 features making it hard to look up, so extra refs here
  filters: {
    position: null,
    search: null,
    features: {
      open: false, // whether the features pane is open/visible
      available: {},
      visible: Object.fromEntries( // key/bool map of which available features are visible
        Object.keys(FEATURES).map(key => [key, !featureIsHiddenByDefault(key)]),
      ),
      collapsed: new Set(),
    },
  },
};
// Initialize featureData and featureDataFetches objects for all features that have a dataLoadType
Object.keys(FEATURES)
  .filter(featureKey => (
    Object.keys(FEATURE_DATA_LOAD_TYPES).includes(FEATURES[featureKey].dataLoadType)
  ))
  .forEach((featureKey) => {
    const { type: featureType, dataLoadType } = FEATURES[featureKey];
    DEFAULT_STATE.featureData[featureType][featureKey] = {};
    if (dataLoadType !== FEATURE_DATA_LOAD_TYPES.NEON_CONTEXT) {
      DEFAULT_STATE.featureDataFetches[featureType][featureKey] = {};
    }
  });
// Initialize all selectable features in selection state
Object.keys(SELECTABLE_FEATURE_TYPES).forEach((selection) => {
  DEFAULT_STATE.selection[selection] = new Set();
});
// Initialize feature availability
const availabilityState = calculateFeatureAvailability(DEFAULT_STATE);
DEFAULT_STATE.filters.features.available = { ...availabilityState.filters.features.available };

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
    newState.sites[siteCode] = { ...neonContextData.sites[siteCode] };
    const featureKey = Object.keys(FEATURES)
      .filter(key => FEATURES[key].type === FEATURE_TYPES.SITES)
      .find(key => (
        FEATURES[key].attributes.type === neonContextData.sites[siteCode].type
          && FEATURES[key].attributes.terrain === neonContextData.sites[siteCode].terrain
      )) || null;
    if (featureKey !== null) {
      newState.featureData[FEATURE_TYPES.SITES][featureKey][siteCode] = newState.sites[siteCode];
    }
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
  view: PropTypes.oneOf(Object.keys(VIEWS).map(k => k.toLowerCase())),
  aspectRatio: PropTypes.number,
  filterPosition: PropTypes.oneOf(['top', 'bottom']),
  unusableVerticalSpace: PropTypes.number,
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

export const getDynamicAspectRatio = (unusableVerticalSpace = 0) => {
  const buffer = 100; // Approximate height of the filters row and a bit of margin
  const usableVericalSpace = window.innerHeight + buffer - unusableVerticalSpace;
  const windowAspectRatio = Math.max(usableVericalSpace, 0) / (window.innerWidth || 1);
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
    siteCode = null,
    locationType: type = null,
    locationDescription: description = null,
    locationDecimalLatitude: latitude = null,
    locationDecimalLongitude: longitude = null,
    locationElevation: elevation = null,
    locationPolygon: polygon = null,
    locationProperties = {},
    locationChildren: children = [],
  } = data;
  const parsed = {
    type,
    description,
    siteCode,
    children,
    ...parseLocationProperties(locationProperties, DEFAULT_LOCATION_PROPERTIES_WHITELIST),
  };
  if (elevation !== null) { parsed.elevation = elevation; }
  if (latitude !== null && longitude !== null) {
    parsed.latitude = latitude;
    parsed.longitude = longitude;
  }
  if (polygon !== null) {
    parsed.geometry = {
      coordinates: polygon.coordinates.map(c => [c.latitude, c.longitude]),
    };
  }
  // Have geometry but no lat/lon - calculate a basic lat/lon center for icon positioning
  if (
    !['latitude', 'longitude'].every(k => Object.keys(parsed).includes(k))
      && parsed.geometry && parsed.geometry.coordinates
  ) {
    [parsed.latitude, parsed.longitude] = parsed.geometry.coordinates
      .reduce((acc, cur) => [acc[0] + cur[0], acc[1] + cur[1]], [0, 0])
      .map(c => c / parsed.geometry.coordinates.length);
  }
  // Special case: set plotType TOWER_SOIL_PLOTS (not present in locations API)
  if (parsed.type === FEATURES.TOWER_SOIL_PLOTS.matchLocationType) {
    parsed.plotType = 'tower';
  }
  return parsed;
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
const getZoomedIcon = (
  featureKey = null,
  zoom = 3,
  highlight = HIGHLIGHT_STATUS.NONE,
  selection = SELECTION_STATUS.UNSELECTED,
) => {
  const feature = FEATURES[featureKey] || {};
  const featureHasIcon = (
    feature && feature.iconSvg
      && feature.iconShape && LOCATION_ICON_SVG_SHAPES[feature.iconShape]
  );
  let iconUrl = featureHasIcon ? feature.iconSvg : iconPlaceholderSVG;
  const iconShape = featureHasIcon ? feature.iconShape : LOCATION_ICON_SVG_SHAPES.SQUARE.KEY;
  const iconScale = featureHasIcon ? feature.iconScale || 1 : 1;
  const minZoom = feature.minZoom || (FEATURES[feature.parent] || {}).minZoom || MAP_ZOOM_RANGE[0];
  const maxZoom = feature.maxZoom || (FEATURES[feature.parent] || {}).maxZoom || MAP_ZOOM_RANGE[1];
  const { popupAnchor, shadow } = LOCATION_ICON_SVG_SHAPES[iconShape];
  let { iconSize, iconAnchor } = LOCATION_ICON_SVG_SHAPES[iconShape];
  const { svg: shadowUrl } = shadow[highlight] || {};
  let { size: shadowSize, anchor: shadowAnchor } = shadow[highlight] || {};
  // Adjust icon, size, and anchor if selected (and a different "selected" icon is available)
  if (featureHasIcon && selection === SELECTION_STATUS.SELECTED && feature.iconSelectedSvg) {
    iconUrl = feature.iconSelectedSvg;
    iconSize = iconSize.map(d => d + SELECTED_ICON_OFFSET);
    iconAnchor = iconSize.map(d => d + (SELECTED_ICON_OFFSET / 2));
    shadowSize = shadowUrl ? shadowSize.map(d => d + SELECTED_ICON_OFFSET) : null;
    shadowAnchor = shadowUrl ? shadowSize.map(d => d + (SELECTED_ICON_OFFSET / 2)) : null;
    popupAnchor[1] += (SELECTED_ICON_OFFSET / 2);
  }
  // Determine Icon Scale
  // Normalize the scale to a range of at least 0.2 to 0.5 (but as big as 0.2 to 1) based on
  // current zoom and feature zoom bounds, then multiply by any feature icon scale
  const minScale = 0.2;
  const maxScale = Math.max((maxZoom - minZoom) / (MAP_ZOOM_RANGE[1] - MAP_ZOOM_RANGE[0]), 0.5);
  const baseScale = ((zoom || minZoom) - minZoom) / (maxZoom - minZoom);
  const scale = (minScale + (baseScale * (maxScale - minScale))) * iconScale;
  const iconProps = {
    iconUrl,
    iconRetinaUrl: iconUrl,
    iconSize: iconSize.map(x => x * scale),
    iconAnchor: iconAnchor.map(x => x * scale),
    popupAnchor: popupAnchor.map(x => x * scale),
  };
  if (shadowUrl && shadowSize && shadowAnchor) {
    iconProps.shadowUrl = shadowUrl;
    iconProps.shadowSize = shadowSize.map(x => x * scale);
    iconProps.shadowAnchor = shadowAnchor.map(x => x * scale);
  }
  return new L.Icon(iconProps);
};

// Get a structure containing all zoomed leaflet icon instances. These are stored in
// state and regenerated any time the zoom level changes. We do this so that we're not generating
// a new icon instance for every discrete location in view when several share the same icon.
export const getZoomedIcons = (zoom) => {
  const featureTypes = [FEATURE_TYPES.LOCATIONS, FEATURE_TYPES.SITES, FEATURE_TYPES.OTHER];
  const icons = {};
  Object.keys(FEATURES)
    .filter(key => (
      featureTypes.includes(FEATURES[key].type) && FEATURES[key].iconSvg
        && FEATURES[key].iconShape && LOCATION_ICON_SVG_SHAPES[FEATURES[key].iconShape]
    ))
    .forEach((key) => {
      icons[key] = {};
      Object.keys(SELECTION_STATUS).forEach((selection) => {
        if (
          selection === SELECTION_STATUS.SELECTED
            && !Object.keys(SELECTABLE_FEATURE_TYPES).includes(key)
        ) { return; }
        icons[key][selection] = {};
        Object.keys(HIGHLIGHT_STATUS).forEach((highlight) => {
          icons[key][selection][highlight] = getZoomedIcon(key, zoom, highlight, selection);
        });
      });
    });
  return icons;
};

export const getMapStateForFocusLocation = (state = {}) => {
  const {
    focusLocation,
    aspectRatio: { currentValue: aspectRatio, widthReference },
  } = state;
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

  if (type === 'SITE') {
    newState.map.zoom = (state.sites[current] || {}).zoom || 12;
  } else if (type === 'DOMAIN') {
    const { [FEATURES.DOMAINS.KEY]: domainsData } = state.featureData[FEATURE_TYPES.BOUNDARIES];
    newState.map.zoom = (domainsData[current] || {}).zoom || null;
  } else if (type === 'STATE') {
    const { [FEATURES.STATES.KEY]: statesData } = state.featureData[FEATURE_TYPES.BOUNDARIES];
    newState.map.zoom = (statesData[current] || {}).zoom || null;
  } else {
    const featureKey = Object.keys(FEATURES)
      .filter(key => FEATURES[key].matchLocationType)
      .find(key => (new RegExp(FEATURES[key].matchLocationType)).test(type));
    if (featureKey) {
      if (FEATURES[featureKey].focusZoom) {
        newState.map.zoom = FEATURES[featureKey].focusZoom;
      } else {
        newState.map.zoom = FEATURES[featureKey].iconScale && FEATURES[featureKey].iconScale > 1.4
          ? 17 : 18;
      }
    }
  }

  if (newState.map.zoom !== null) {
    // Regenerate icons
    newState.map.zoomedIcons = getZoomedIcons(newState.map.zoom);
    // Derive map bounds. Must be done by Leaflet but to do this without a full re-render we can
    // create a non-rendering empty Leaflet map with mocked dimensions that we promptly destroy.
    L.Map.include({
      getSize: () => new L.Point(widthReference, widthReference * aspectRatio),
    });
    const element = document.createElement('div');
    const map = new L.Map(element, {
      center: newState.map.center,
      zoom: newState.map.zoom,
    });
    const newBounds = map.getBounds() || null;
    newState.map.bounds = !newBounds ? null : {
      /* eslint-disable no-underscore-dangle */
      lat: [newBounds._southWest.lat, newBounds._northEast.lat],
      lng: [newBounds._southWest.lng, newBounds._northEast.lng],
      /* eslint-enable no-underscore-dangle */
    };
  }
  return newState.map;
};

export const boundsAreValid = bounds => (
  typeof bounds === 'object' && bounds !== null
    && Object.keys(bounds).every(key => (
      ['lat', 'lng'].includes(key) && Array.isArray(bounds[key]) && bounds[key].length === 2
        && bounds[key].every(v => typeof v === 'number') && bounds[key][1] > bounds[key][0]
    ))
);

export const calculateLocationsInMap = (locations, bounds = null, buffer = false) => {
  if (!locations || typeof locations !== 'object' || !Object.keys(locations).length) { return []; }
  if (bounds === null) { return Object.keys(locations); }
  if (!boundsAreValid(bounds)) { return []; }
  const extendedBounds = !buffer ? bounds
    : Object.fromEntries(
      Object.keys(bounds)
        .map((dir) => {
          const bufferValue = (bounds[dir][1] - bounds[dir][0]) / 2;
          return [dir, [bounds[dir][0] - bufferValue, bounds[dir][1] + bufferValue]];
        }),
    );
  const isInBounds = loc => (
    Number.isFinite(loc.latitude) && Number.isFinite(loc.longitude)
      && loc.latitude >= extendedBounds.lat[0] && loc.latitude <= extendedBounds.lat[1]
      && loc.longitude >= extendedBounds.lng[0] && loc.longitude <= extendedBounds.lng[1]
  );
  return Object.keys(locations).filter(locId => isInBounds(locations[locId]));
};
