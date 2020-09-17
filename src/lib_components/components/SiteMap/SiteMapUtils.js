import PropTypes from 'prop-types';

import cloneDeep from 'lodash/cloneDeep';

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
export const OBSERVATORY_CENTER = [52.68, -110.75];

export const MIN_CONTAINER_HEIGHT = 300;
export const MIN_TABLE_MAX_BODY_HEIGHT = 100;

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

// For consistency in expressing site terrain
export const SITE_TERRAINS = { AQUATIC: 'AQUATIC', TERRESTRIAL: 'TERRESTRIAL' };

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

// For consistency in differentiating where feature data come from
// (e.g. various fetch APIs, NeonContext)
export const FEATURE_DATA_SOURCES = {
  REST_LOCATIONS_API: 'REST_LOCATIONS_API',
  GRAPHQL_LOCATIONS_API: 'GRAPHQL_LOCATIONS_API',
  ARCGIS_ASSETS_API: 'ARCGIS_ASSETS_API',
  NEON_CONTEXT: 'NEON_CONTEXT',
};

// Subset of FEATURE_TYPES describing all features that are directly selectable
export const SELECTABLE_FEATURE_TYPES = (({ SITES }) => ({ SITES }))(FEATURE_TYPES);

const SELECTED_ICON_OFFSET = 30; // Number of pixels bigger in one dimension for selected icons

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
  mfb: 'MFB', // We don't know what this is but it does appear in some hierarchies...
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
export const LOCATION_ICON_SVG_SHAPES = {
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
    hideByDefault: true,
    dataSource: FEATURE_DATA_SOURCES.NEON_CONTEXT,
    primaryIdOnly: true,
    featureShape: 'Polygon',
    style: { color: '#885eba', weight: 8 },
  },
  STATES: {
    name: 'US States',
    nameSingular: 'US State',
    type: FEATURE_TYPES.BOUNDARIES,
    hideByDefault: true,
    dataSource: FEATURE_DATA_SOURCES.NEON_CONTEXT,
    primaryIdOnly: true,
    featureShape: 'Polygon',
    style: { color: '#53ac7b', weight: 8 },
  },
  // Various Boundary Types
  FLIGHT_BOX_BOUNDARIES: {
    name: 'AOP Flight Box Boundaries',
    nameSingular: 'AOP Flight Box Boundary',
    type: FEATURE_TYPES.BOUNDARIES,
    minZoom: 8,
    dataSource: FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API,
    featureShape: 'Polygon',
    style: { color: '#f0ee75', dashArray: '5, 10' },
  },
  // AQUATIC_WATERSHEDS Group
  AQUATIC_WATERSHEDS: {
    name: 'Watersheds',
    type: FEATURE_TYPES.GROUP,
    minZoom: 7,
  },
  WATERSHED_BOUNDARIES: {
    name: 'Watershed Boundaries',
    nameSingular: 'Watershed Boundary',
    type: FEATURE_TYPES.BOUNDARIES,
    minZoom: 7,
    dataSource: FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API,
    parent: 'AQUATIC_WATERSHEDS',
    featureShape: 'Polygon',
    style: { color: '#669199', dashArray: '5, 10' },
  },
  DRAINAGE_LINES: {
    name: 'Drainage Lines',
    type: FEATURE_TYPES.OTHER,
    minZoom: 7,
    dataSource: FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API,
    parent: 'AQUATIC_WATERSHEDS',
    featureShape: 'Polyline',
    style: { color: '#365d63' },
  },
  POUR_POINTS: {
    name: 'Pour Points',
    nameSingular: 'Pour Point',
    type: FEATURE_TYPES.OTHER,
    minZoom: 10,
    dataSource: FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API,
    parent: 'AQUATIC_WATERSHEDS',
    featureShape: 'Marker',
    iconSvg: iconPourPointSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.HOMEPLATE.KEY,
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
    style: { color: '#e8847d', dashArray: '5, 10, 2.5, 10' },
  },
  AQUATIC_REACHES: {
    name: 'Aquatic Site Reaches',
    nameSingular: 'Aquatic Site Reach',
    type: FEATURE_TYPES.BOUNDARIES,
    minZoom: 9,
    dataSource: FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API,
    parent: 'AQUATIC_SITE_FEATURES',
    featureShape: 'Polygon',
    style: { color: '#ad85a0', dashArray: '5, 10, 2.5, 10' },
  },
  TOWER_AIRSHEDS: {
    name: 'Tower Airshed Boundaries',
    nameSingular: 'Tower Airshed Boundary',
    type: FEATURE_TYPES.BOUNDARIES,
    minZoom: 10,
    dataSource: FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API,
    parent: 'TERRESTRIAL_SITE_FEATURES',
    featureShape: 'Polygon',
    style: { color: '#749966', dashArray: '5, 10, 2.5, 10' },
  },
  // Terrestrial Site Features
  TERRESTRIAL_SITE_FEATURES: {
    name: 'Terrestrial Site Features',
    type: FEATURE_TYPES.GROUP,
    minZoom: 10,
    fetchingForFeatures: ['TOWER_BASE_PLOTS', 'DISTRIBUTED_BASE_PLOTS'],
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
    iconSvg: iconTowerSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.DIAMOND.KEY,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL,
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
    iconSvg: iconHutSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.DIAMOND.KEY,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL,
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
    iconSvg: iconMegapitSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.DIAMOND.KEY,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL,
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
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'OS Plot - phe',
    featureShape: 'Marker',
    minZoom: 13,
    focusZoom: 16,
    iconScale: 1.5,
    iconSvg: iconTowerPhenologyPlotSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL,
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
    iconSvg: iconTowerBasePlotSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL,
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
    iconSvg: iconTowerSoilPlotSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL,
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
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'OS Plot - brd',
    featureShape: 'Marker',
    iconScale: 1.8,
    focusZoom: 16,
    iconSvg: iconDistributedBirdGridSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL,
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
    iconSvg: iconDistributedMammalGridSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL,
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
    iconSvg: iconDistributedBasePlotSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL,
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
    iconSvg: iconDistributedTickPlotSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL,
  },
  DISTRIBUTED_MOSQUITO_POINTS: {
    name: 'Distributed Mosquito Points',
    nameSingular: 'Distributed Mosquito Point',
    type: FEATURE_TYPES.LOCATIONS,
    description: 'At each Mosquito Point, one CO2 trap is established. Due to the frequency of sampling and temporal sampling constraints, Mosquito Points are located within 45m of roads.',
    parent: 'DISTRIBUTED_PLOTS',
    dataSource: FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API,
    matchLocationType: 'OS Plot - mos',
    iconSvg: iconDistributedMosquitoPointSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    featureShape: 'Marker',
    focusZoom: 18,
    siteTerrain: SITE_TERRAINS.TERRESTRIAL,
  },
  // Plot Boundaries
  PLOT_BOUNDARIES: {
    name: 'Plot Boundaries',
    type: FEATURE_TYPES.GROUP,
    minZoom: 14,
    description: 'Some types of distributed and tower plots may be represented by a boundary polygon in addition their marker icon to denote actual size and location.',
    parent: 'TERRESTRIAL_SITE_FEATURES',
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
    style: { color: '#59a14f', dashArray: '1, 12' },
    siteTerrain: SITE_TERRAINS.TERRESTRIAL,
  },
  TOWER_SOIL_PLOT_BOUNDARIES: { // Comes back as data from TOWER_SOIL_PLOTS fetches so no fetch here
    name: 'Tower Soil Plot Boundaries',
    nameSingular: 'Tower Soil Plot Boundary',
    type: FEATURE_TYPES.SAMPLING_POINTS,
    descriptionFromParentDataFeatureKey: true,
    parent: 'PLOT_BOUNDARIES',
    parentDataFeatureKey: 'TOWER_SOIL_PLOTS',
    minZoom: 18,
    featureShape: 'Polygon',
    style: { color: '#bea488', dashArray: '1, 12' },
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
    style: { color: '#f28e2c', dashArray: '1, 12' },
    siteTerrain: SITE_TERRAINS.TERRESTRIAL,
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
    style: { color: '#925214', dashArray: '1, 12' },
    siteTerrain: SITE_TERRAINS.TERRESTRIAL,
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
    style: { color: '#000000', dashArray: '1, 12' },
    siteTerrain: SITE_TERRAINS.TERRESTRIAL,
  },
  // Aquatic Site Features
  AQUATIC_SITE_FEATURES: {
    name: 'Aquatic Site Features',
    type: FEATURE_TYPES.GROUP,
    minZoom: 10,
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
    iconSvg: iconBenchmarkSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.DIAMOND.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC,
  },
  AQUATIC_AUTOMATED_INSTRUMENTS: {
    name: 'Automated Instuments',
    type: FEATURE_TYPES.GROUP,
    minZoom: 10,
    parent: 'AQUATIC_SITE_FEATURES',
  },
  AQUATIC_OBSERVATIONAL_SAMPLING: {
    name: 'Observational Sampling',
    type: FEATURE_TYPES.GROUP,
    minZoom: 11,
    parent: 'AQUATIC_SITE_FEATURES',
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
    iconSvg: iconRiparianAssessmentSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC,
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
    iconSvg: iconWetDepositionPointSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC,
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
    iconSvg: iconGroundwaterWellSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC,
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
    iconSvg: iconMeteorologicalStationSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC,
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
    iconSvg: iconDischargePointSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC,
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
    iconSvg: iconFishPointSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC,
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
    iconSvg: iconPlantTransectSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC,
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
    iconSvg: iconSedimentPointSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.SQUARE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC,
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
    iconSvg: iconStaffGaugeSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC,
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
    iconSvg: iconSensorStationSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC,
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
    iconSvg: iconBuoySVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
    siteTerrain: SITE_TERRAINS.AQUATIC,
  },
  // SITE_MARKERS Group
  SITE_MARKERS: {
    name: 'NEON Site Markers',
    type: FEATURE_TYPES.GROUP,
    maxZoom: 9,
  },
  TERRESTRIAL_CORE_SITES: {
    name: 'Terrestrial Core Sites',
    nameSingular: 'Terrestrial Core Site',
    type: FEATURE_TYPES.SITES,
    description: 'Land-based; fixed location',
    parent: 'SITE_MARKERS',
    attributes: { type: 'CORE', terrain: 'TERRESTRIAL' },
    dataSource: FEATURE_DATA_SOURCES.NEON_CONTEXT,
    primaryIdOnly: true,
    featureShape: 'Marker',
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
    dataSource: FEATURE_DATA_SOURCES.NEON_CONTEXT,
    primaryIdOnly: true,
    featureShape: 'Marker',
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
    dataSource: FEATURE_DATA_SOURCES.NEON_CONTEXT,
    primaryIdOnly: true,
    featureShape: 'Marker',
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
    dataSource: FEATURE_DATA_SOURCES.NEON_CONTEXT,
    primaryIdOnly: true,
    featureShape: 'Marker',
    iconScale: 1,
    iconSvg: iconSiteRelocatableAquaticSVG,
    iconSelectedSvg: iconSiteRelocatableAquaticSelectedSVG,
    iconShape: LOCATION_ICON_SVG_SHAPES.CIRCLE.KEY,
  },
};
// Replicate keys as attributes to completely eliminate the need to write a feature key string
Object.keys(FEATURES).forEach((key) => { FEATURES[key].KEY = key; });

/**
   GRAPHQL_LOCATIONS_API Constants
   The Locations API groups fetchable assets by minZoom (i.e. all assets for all locations features
   with the same minZoom are fetched together, for a given field site). Thus we want lookups of
   minZoom by feature key and vice versa. These values never change, so derive them now.
*/
// A mapping of feature key to minZoom for GRAPHQL_LOCATIONS_API dataSource features
const FEATURES_TO_MINZOOM_MAP = {};
Object.keys(FEATURES)
  .filter(featureKey => (
    FEATURES[featureKey].dataSource === FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API
  ))
  .forEach((featureKey) => {
    const feature = FEATURES[featureKey];
    const minZoom = feature.minZoom || (FEATURES[feature.parent] || {}).minZoom || 0;
    FEATURES_TO_MINZOOM_MAP[featureKey] = minZoom;
  });

// A mapping of minZoom level to feature keys (inversion of FEATURES_MINZOOM_MAP)
const MINZOOM_TO_FEATURES_MAP = {};
Object.keys(FEATURES_TO_MINZOOM_MAP).forEach((featureKey) => {
  const minZoom = FEATURES_TO_MINZOOM_MAP[featureKey];
  if (!MINZOOM_TO_FEATURES_MAP[minZoom]) { MINZOOM_TO_FEATURES_MAP[minZoom] = []; }
  MINZOOM_TO_FEATURES_MAP[minZoom].push(featureKey);
});

// Roll all that up and export it
export const GRAPHQL_LOCATIONS_API_CONSTANTS = {
  FEATURES_TO_MINZOOM_MAP,
  MINZOOM_TO_FEATURES_MAP,
};

// Common colors for selecatble boundary features
export const BOUNDARY_COLORS = {
  partialSelected: COLORS.LIGHT_BLUE[300],
  totalSelected: COLORS.LIGHT_BLUE[500],
  hover: COLORS.LIGHT_BLUE[100],
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
   getHref
   Used to construction URLs when linking out to other pages
*/
export const getHref = (key, arg = null) => {
  const EXPLORE_DATA_PRODUCTS_BASE = 'https://data.neonscience.org/data-products/explore';
  switch (key) {
    case 'EXPLORE_DATA_PRODUCTS_BY_SITE':
      return `${EXPLORE_DATA_PRODUCTS_BASE}?site=${arg}`;
    case 'EXPLORE_DATA_PRODUCTS_BY_STATE':
      return `${EXPLORE_DATA_PRODUCTS_BASE}?state=${arg}`;
    case 'EXPLORE_DATA_PRODUCTS_BY_DOMAIN':
      return `${EXPLORE_DATA_PRODUCTS_BASE}?domain=${arg}`;
    case 'SITE_DETAILS':
      return `https://www.neonscience.org/field-sites/field-sites-map/${arg}`;
    case 'DOMAIN_DETAILS':
      return `https://www.neonscience.org/domains/${arg}`;
    default:
      return '#';
  }
};

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
    limit: null, // null (unlimited), a non-zero positive integer, or an integer range
    valid: false, // Whether the current selection is non-emtpy and valid per the limit
    set: new Set(), // set of selected values
    changed: false, // whether selection has changed warranting an onChange event
    onChange: () => {}, // Function that fires whenever state.selection changes
    derived: { // Derived feature-specific mappings of selectable item IDs to SELECTION_PORTIONS
      [FEATURES.STATES.KEY]: {}, // { stateCode: SELECTION_PORTIONS.KEY }
      [FEATURES.DOMAINS.KEY]: {}, // { domainCode: SELECTION_PORTIONS.KEY }
    },
  },
  featureDataFetchesHasAwaiting: false, // Boolean: track whether any data fetches are awaiting call
  featureDataFetches: Object.fromEntries(
    Object.keys(FEATURE_DATA_SOURCES)
      .filter(dataSource => dataSource !== FEATURE_DATA_SOURCES.NEON_CONTEXT)
      .map(dataSource => [dataSource, {}]),
  ),
  featureData: Object.fromEntries(
    Object.keys(FEATURE_TYPES)
      .filter(featureType => featureType !== FEATURE_TYPES.SAMPLING_POINTS)
      .map(featureType => [featureType, {}]),
  ),
  sites: {}, // Sites data is split into 4 features making it hard to look up, so extra refs here
  filters: {
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
  fullscreen: false,
};

// Initialize featureData and featureDataFetches objects for all features that have a dataSource
Object.keys(FEATURES)
  .filter(featureKey => (
    Object.keys(FEATURE_DATA_SOURCES).includes(FEATURES[featureKey].dataSource)
  ))
  .forEach((featureKey) => {
    const { type: featureType, dataSource } = FEATURES[featureKey];
    // Initialize featureData
    // SAMPLING_POINTS are stored as geometry of their parent locations so don't need initialization
    if (featureType !== FEATURE_TYPES.SAMPLING_POINTS) {
      DEFAULT_STATE.featureData[featureType][featureKey] = {};
    }
    // Initialize featureDataFetches based on dataSource
    // ARCGIS_ASSETS_API and REST_LOCATIONS_API: grouped by feature key
    // GRAPHQL_LOCATIONS_API: grouped by feature minZoom
    if ([
      FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API,
      FEATURE_DATA_SOURCES.REST_LOCATIONS_API,
    ].includes(dataSource)) {
      DEFAULT_STATE.featureDataFetches[dataSource][featureKey] = {};
    }
    if (dataSource === FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API) {
      const minZoom = GRAPHQL_LOCATIONS_API_CONSTANTS.FEATURES_TO_MINZOOM_MAP[featureKey];
      DEFAULT_STATE.featureDataFetches[dataSource][minZoom] = {};
    }
  });
// Location Hierarchies (REST_LOCATIONS_API, not in the FEATURES structure since it doesn't render)
// eslint-disable-next-line max-len
DEFAULT_STATE.featureDataFetches[FEATURE_DATA_SOURCES.REST_LOCATIONS_API][FEATURE_TYPES.SITE_LOCATION_HIERARCHIES] = {};

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
export const SelectionLimitPropType = (props, propName) => {
  const { [propName]: prop } = props;
  if (typeof prop === 'number') {
    if (!Number.isInteger(prop) || prop < 1) {
      return new Error(
        `When setting ${propName} as a number it must be an integer greater than 0`,
      );
    }
    return null;
  }
  if (Array.isArray(prop)) {
    if (prop.length !== 2 || !prop.every(x => Number.isInteger(x) && x > 0) || prop[0] >= prop[1]) {
      return new Error(
        // eslint-disable-next-line max-len
        `When setting ${propName} as an array it must contain exactly two distinct non-zero positive integers in ascending order (e.g. [2, 5])`,
      );
    }
    return null;
  }
  if (prop !== null) {
    return new Error(
      // eslint-disable-next-line max-len
      `${propName} must be null, a positive non-zero integer, or an array of two ascending non-zero positive integers.`,
    );
  }
  return null;
};

export const SITE_MAP_PROP_TYPES = {
  // Top-level Props
  view: PropTypes.oneOf(Object.keys(VIEWS).map(k => k.toLowerCase())),
  aspectRatio: PropTypes.number,
  fullscreen: PropTypes.bool,
  unusableVerticalSpace: PropTypes.number,
  // Map Props
  mapCenter: PropTypes.arrayOf(PropTypes.number),
  mapZoom: PropTypes.number,
  mapTileLayer: PropTypes.oneOf(Object.keys(TILE_LAYERS)),
  // Initial map focus (overrides mapCenter and mapZoom)
  location: PropTypes.string,
  // Selection Props
  selection: PropTypes.oneOf(Object.keys(SELECTABLE_FEATURE_TYPES)),
  selectedItems: PropTypes.arrayOf(PropTypes.string),
  selectionLimit: SelectionLimitPropType,
  onSelectionChange: PropTypes.func,
  // Filter Props
  search: PropTypes.string,
  features: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(FEATURES))),
};

export const SITE_MAP_DEFAULT_PROPS = {
  // Top-level Props
  view: VIEWS.MAP.toLowerCase(),
  aspectRatio: null,
  fullscreen: false,
  unusableVerticalSpace: 0,
  // Map Props
  mapCenter: OBSERVATORY_CENTER,
  mapZoom: null,
  mapTileLayer: Object.keys(TILE_LAYERS)[0],
  // Initial map focus (overrides mapCenter and mapZoom)
  location: null,
  // Selection Props
  selection: null,
  selectedItems: [],
  selectionLimit: null,
  onSelectionChange: () => {},
  // Filter Props
  search: null,
  features: null,
};

/**
   Icon Utility Functions
   These appear here because of how Leaflet handles icons. Each icon must be a L.Icon instance,
   but many of our icons repeat. We also want to scale our icons with the zoom level. As such,
   we generate a stat structure containing only one instance of each distinct icon type scaled
   to the current zoom level and keep that in state. It is regenerated any time the zoom changes.
*/
// Get a single zoomed Leaflet icon instance
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
  // Use a deep clone of the base SVG shape object so that we can modify destructured data
  // for variants like "selected" icons
  const baseSvgShape = cloneDeep(LOCATION_ICON_SVG_SHAPES[iconShape]);
  const { popupAnchor, shadow } = baseSvgShape;
  let { iconSize, iconAnchor } = baseSvgShape;
  const { svg: shadowUrl } = shadow[highlight] || {};
  let { size: shadowSize, anchor: shadowAnchor } = shadow[highlight] || {};
  // Adjust icon, size, and anchor if selected (and a different "selected" icon is available)
  if (featureHasIcon && selection === SELECTION_STATUS.SELECTED && feature.iconSelectedSvg) {
    iconUrl = feature.iconSelectedSvg;
    iconSize = iconSize.map(d => d + SELECTED_ICON_OFFSET);
    iconAnchor = iconAnchor.map(d => d + (SELECTED_ICON_OFFSET / 2));
    shadowSize = shadowUrl ? shadowSize.map(d => d + SELECTED_ICON_OFFSET) : null;
    shadowAnchor = shadowUrl ? shadowAnchor.map(d => d + (SELECTED_ICON_OFFSET / 2)) : null;
    popupAnchor[1] -= (SELECTED_ICON_OFFSET / 2);
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
            && !Object.keys(SELECTABLE_FEATURE_TYPES).includes(FEATURES[key].type)
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

export const boundsAreValid = bounds => (
  typeof bounds === 'object' && bounds !== null
    && Object.keys(bounds).every(key => (
      ['lat', 'lng'].includes(key) && Array.isArray(bounds[key]) && bounds[key].length === 2
        && bounds[key].every(v => typeof v === 'number') && bounds[key][1] > bounds[key][0]
    ))
);

export const calculateLocationsInMap = (
  locations,
  bounds = null,
  extendMap = false, // Boolean, whether or not to extend the map bounds by 50% on each dimension
  extendPoints = 0, // Number, a margin to add/subtract to lat/lon for a point's hit box
) => {
  if (!locations || typeof locations !== 'object' || !Object.keys(locations).length) { return []; }
  if (bounds === null) { return Object.keys(locations); }
  if (!boundsAreValid(bounds)) { return []; }
  const extendedBounds = !extendMap ? bounds
    : Object.fromEntries(
      Object.keys(bounds)
        .map((dir) => {
          const buffer = (bounds[dir][1] - bounds[dir][0]) / 2;
          return [dir, [bounds[dir][0] - buffer, bounds[dir][1] + buffer]];
        }),
    );
  // This function flattens a geometry object to just coordinates so we can check if a boundary
  // is in the map. NOTE: extendPoints does not work with boundaries, only solitary points.
  const flatten = (items) => {
    const isCoord = c => Array.isArray(c) && c.length === 2 && c.every(x => Number.isFinite(x));
    const flat = [];
    items.forEach((item) => {
      if (Array.isArray(item) && !isCoord(item)) {
        flat.push(...flatten(item));
      } else {
        flat.push(item);
      }
    });
    return flat;
  };
  const isInBounds = (loc) => {
    if (Number.isFinite(loc.latitude) && Number.isFinite(loc.longitude)) {
      if (extendPoints > 0) {
        const lats = [loc.latitude - extendPoints, loc.latitude + extendPoints];
        const lngs = [loc.longitude - extendPoints, loc.longitude + extendPoints];
        return (!(
          lats[0] > extendedBounds.lat[1] || lats[1] < extendedBounds.lat[0]
            || lngs[0] > extendedBounds.lng[1] || lngs[1] < extendedBounds.lng[0]
        ));
      }
      return (
        loc.latitude >= extendedBounds.lat[0] && loc.latitude <= extendedBounds.lat[1]
          && loc.longitude >= extendedBounds.lng[0] && loc.longitude <= extendedBounds.lng[1]
      );
    }
    if (loc.geometry && loc.geometry.coordinates) {
      const flatCoords = flatten(loc.geometry.coordinates);
      return flatCoords.some(coord => (
        coord.latitude >= extendedBounds.lat[0] && coord.latitude <= extendedBounds.lat[1]
          && coord.longitude >= extendedBounds.lng[0] && coord.longitude <= extendedBounds.lng[1]
      ));
    }
    return false;
  };
  return Object.keys(locations).filter(locId => isInBounds(locations[locId]));
};

export const deriveFullObservatoryZoomLevel = (mapRef) => {
  const FALLBACK_ZOOM = 2;
  if (!mapRef.current) { return FALLBACK_ZOOM; }
  const container = mapRef.current.container.parentElement;
  const minorDim = Math.min(container.clientWidth / (22 * 8), container.clientHeight / (21 * 8));
  const derivedZoom = [1, 2, 4, 6, 11].findIndex(m => m > minorDim);
  return derivedZoom === -1 ? FALLBACK_ZOOM : derivedZoom;
};
