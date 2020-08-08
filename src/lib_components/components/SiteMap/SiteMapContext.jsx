import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import cloneDeep from 'lodash/cloneDeep';
import uniqueId from 'lodash/uniqueId';

import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import NeonApi from '../NeonApi/NeonApi';
import NeonContext from '../NeonContext/NeonContext';

import FetchLocationsWorker from './FetchLocations.worker';
import {
  DEFAULT_STATE,
  SORT_DIRECTIONS,
  TILE_LAYERS,
  VIEWS,
  FEATURES,
  FETCH_STATUS,
  FEATURE_TYPES,
  FEATURE_DATA_SOURCES,
  SELECTABLE_FEATURE_TYPES,
  SITE_LOCATION_HIERARCHIES_MIN_ZOOM,
  MAP_ZOOM_RANGE,
  OBSERVATORY_CENTER,
  // PLOT_SAMPLING_MODULES,
  SITE_MAP_PROP_TYPES,
  SITE_MAP_DEFAULT_PROPS,
  MIN_TABLE_MAX_BODY_HEIGHT,
  GRAPHQL_LOCATIONS_API_CONSTANTS,
  hydrateNeonContextData,
  parseLocationHierarchy,
  getZoomedIcons,
  getMapStateForFocusLocation,
  calculateFeatureAvailability,
  boundsAreValid,
  calculateLocationsInMap,
  deriveFullObservatoryZoomLevel,
} from './SiteMapUtils';

const parseLocationData = () => {};

// Derive the selected status of a given boundary (US state or NEON domain). This should run
// every time the list of selected sites changes. It regenerates selectedStates and
// selectedDomains in state to each contain a key/value lookup where the key is the boundary code
// (state code or domain code) and the value is either 'total' (all sites selected) or 'partial'
// (some sites selected). If no sites are selected for the boundary it is omitted from the map.
const deriveBoundarySelections = (state) => {
  const derive = (featureKey) => {
    if (!state.neonContextHydrated || !state.featureData[FEATURE_TYPES.BOUNDARIES][featureKey]) {
      return {};
    }
    const selectedBoundarys = {};
    Object.keys(state.featureData[FEATURE_TYPES.BOUNDARIES][featureKey]).forEach((boundaryCode) => {
      const boundarySitesSet = (
        state.featureData[FEATURE_TYPES.BOUNDARIES][featureKey][boundaryCode].sites || new Set()
      );
      const intersection = [...boundarySitesSet]
        .filter(x => state.selection[SELECTABLE_FEATURE_TYPES.SITES].has(x));
      if (!intersection.length) { return; }
      selectedBoundarys[boundaryCode] = (
        intersection.length === boundarySitesSet.size ? 'total' : 'partial'
      );
    });
    return selectedBoundarys;
  };
  return {
    ...state,
    selection: {
      ...state.selection,
      derived: {
        [FEATURES.STATES.KEY]: derive(FEATURES.STATES.KEY),
        [FEATURES.DOMAINS.KEY]: derive(FEATURES.DOMAINS.KEY),
      },
    },
  };
};

/**
   Reducer
*/
const zoomIsValid = zoom => (
  Number.isInteger(zoom) && zoom >= MAP_ZOOM_RANGE[0] && zoom <= MAP_ZOOM_RANGE[1]
);
const centerIsValid = center => (
  Array.isArray(center) && center.length === 2 && center.every(v => typeof v === 'number')
);

const calculateFeatureDataFetches = (state) => {
  const sitesInMap = calculateLocationsInMap(state.sites, state.map.bounds, true, 0.06);
  if (!sitesInMap.length) { return state; }
  const domainsInMap = new Set();
  sitesInMap
    .filter(siteCode => state.sites[siteCode])
    .forEach((siteCode) => {
      domainsInMap.add(state.sites[siteCode].domainCode);
    });
  const newState = { ...state };

  // Domain-location hierarchy fetches for individual domains
  // Only fetch if bounds are not null as that way we can trust sitesInMap is not all the sites
  if (state.map.zoom >= SITE_LOCATION_HIERARCHIES_MIN_ZOOM && state.map.bounds) {
    const hierarchiesSource = FEATURE_DATA_SOURCES.REST_LOCATIONS_API;
    const hierarchiesType = FEATURE_TYPES.SITE_LOCATION_HIERARCHIES;
    Array.from(domainsInMap).forEach((domainCode) => {
      if (newState.featureDataFetches[hierarchiesSource][hierarchiesType][domainCode]) { return; }
      newState.featureDataFetches[hierarchiesSource][hierarchiesType][domainCode] = FETCH_STATUS.AWAITING_CALL; // eslint-disable-line max-len
      newState.overallFetch.expected += 1;
      newState.overallFetch.pendingHierarchy += 1;
      newState.featureDataFetchesHasAwaiting = true;
    });
  }

  // Feature fetches - ARCGIS_ASSET_API
  Object.keys(FEATURES)
    .filter(featureKey => (
      FEATURES[featureKey].dataSource === FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API
        && state.filters.features.available[featureKey]
        && state.filters.features.visible[featureKey]
    ))
    .forEach((featureKey) => {
      const { dataSource } = FEATURES[featureKey];
      sitesInMap.forEach((siteCode) => {
        if (newState.featureDataFetches[dataSource][featureKey][siteCode]) { return; }
        newState.featureDataFetches[dataSource][featureKey][siteCode] = FETCH_STATUS.AWAITING_CALL;
        newState.overallFetch.expected += 1;
        newState.featureDataFetchesHasAwaiting = true;
      });
    });

  // Feature fetches - GRAPHQL_LOCATIONS_API
  /* eslint-disable max-len */
  // NOTE: DISTRIBUTED_BASE_PLOTS and TOWER_BASE_PLOTS have the same locationType. We must fetch
  // them all in order to differentiate them. Thus if we're looking at either one here,
  // automatically initialize the other one.
  const basePlots = [FEATURES.DISTRIBUTED_BASE_PLOTS.KEY, FEATURES.TOWER_BASE_PLOTS.KEY];
  // Start by looping through all minZoom levels associated with any GraphQL Locations API features
  // Our goal is to build a single fetch containing a flat list of all locations for this site
  // that are now visible, clustered by minZoom level.
  Object.keys(GRAPHQL_LOCATIONS_API_CONSTANTS.MINZOOM_TO_FEATURES_MAP)
    .filter(minZoom => state.map.zoom >= minZoom)
    .forEach((minZoom) => {
      // Loop through all available and visible features at this minZoom level
      GRAPHQL_LOCATIONS_API_CONSTANTS.MINZOOM_TO_FEATURES_MAP[minZoom].forEach((featureKey) => {
        if (!state.filters.features.available[featureKey] || !state.filters.features.visible[featureKey]) { return; }
        const { dataSource, matchLocationType, matchLocationName } = FEATURES[featureKey];
        const isBasePlot = basePlots.includes(featureKey);
        const companionFeatureKey = (
          !isBasePlot ? null : basePlots.find(key => key !== featureKey)
        );
        if (!newState.featureDataFetches[dataSource][minZoom]) {
          newState.featureDataFetches[dataSource][minZoom] = {};
        }
        // We've narrowed to minZoom and feature, now narrow to only the sites in the map
        sitesInMap
          // Domain hierarchy must be completely loaded in order to generate subsequent fetches
          .filter(siteCode => state.featureData.SITE_LOCATION_HIERARCHIES[siteCode])
          // Site must have meaningful features to fetch at this minZoom level
          .filter(siteCode => state.sites[siteCode].terrain === FEATURES[featureKey].siteTerrain)
          .forEach((siteCode) => {
            // Initialize the fetch structure for the dataSource / minZoom / siteCode
            if (!newState.featureDataFetches[dataSource][minZoom][siteCode]) {
              newState.featureDataFetches[dataSource][minZoom][siteCode] = {
                features: Object.fromEntries(
                  GRAPHQL_LOCATIONS_API_CONSTANTS.MINZOOM_TO_FEATURES_MAP[minZoom]
                    .filter(fKey => state.sites[siteCode].terrain === FEATURES[fKey].siteTerrain)
                    .map(fKey => [fKey, { fetchId: null, locations: [] }]),
                ),
                fetches: {},
              };
              // If this is a base plot feature then look to see if already handled
              if (isBasePlot && companionFeatureKey) {
                const companionMinZoom = GRAPHQL_LOCATIONS_API_CONSTANTS.FEATURES_TO_MINZOOM_MAP[companionFeatureKey];
                if (companionMinZoom && newState.featureDataFetches[dataSource][companionMinZoom][siteCode]) {
                  const companionFetchId = newState.featureDataFetches[dataSource][companionMinZoom][siteCode].features[companionFeatureKey];
                  newState.featureDataFetches[dataSource][minZoom][siteCode].features[featureKey] = companionFetchId;
                }
              }
            }
            const { features, fetches } = newState.featureDataFetches[dataSource][minZoom][siteCode];
            // Stop if this feature already has a fetchID
            if (features[featureKey].fetchId !== null) { return; }
            // Find or create a fetch that's awaiting call with a unique ID
            let awaitingFetchKey = Object.keys(fetches)
              .find(fetchKey => fetches[fetchKey].status === FETCH_STATUS.AWAITING_CALL);
            if (!awaitingFetchKey) {
              awaitingFetchKey = uniqueId('f');
              newState.featureDataFetches[dataSource][minZoom][siteCode].fetches[awaitingFetchKey] = {
                status: FETCH_STATUS.AWAITING_CALL, locations: [],
              };
              newState.overallFetch.expected += 1;
              newState.featureDataFetchesHasAwaiting = true;
            }
            // Map this feature / site / zoom level / feature type to the unique fetch key
            newState.featureDataFetches[dataSource][minZoom][siteCode].features[featureKey].fetchId = awaitingFetchKey;
            if (isBasePlot && companionFeatureKey) {
              if (!newState.featureDataFetches[dataSource][minZoom][siteCode].features[companionFeatureKey]) {
                newState.featureDataFetches[dataSource][minZoom][siteCode].features[companionFeatureKey] = {
                  fetchId: null, locations: [],
                };
              }
              newState.featureDataFetches[dataSource][minZoom][siteCode].features[companionFeatureKey].fetchId = awaitingFetchKey;
            }
            // Harvest locations from the hierarchy for this feature/site; append to awaiting fetch
            // Matching function varies depending on how the feature is set up.
            const hierarchy = state.featureData.SITE_LOCATION_HIERARCHIES[siteCode];
            let locationIsMatch = () => false;
            if (matchLocationType instanceof RegExp) {
              locationIsMatch = locationKey => matchLocationType.test(hierarchy[locationKey].type);
            }
            if (typeof matchLocationType === 'string') {
              locationIsMatch = locationKey => hierarchy[locationKey].type === matchLocationType;
            }
            if (matchLocationName instanceof RegExp) {
              locationIsMatch = locationKey => matchLocationName.test(locationKey);
            }
            Object.keys(hierarchy)
              .filter(locationIsMatch)
              .forEach((locationKey) => {
                newState.featureDataFetches[dataSource][minZoom][siteCode].fetches[awaitingFetchKey].locations.push(locationKey);
                newState.featureDataFetches[dataSource][minZoom][siteCode].features[featureKey].locations.push(locationKey);
                if (isBasePlot && companionFeatureKey) {
                  newState.featureDataFetches[dataSource][minZoom][siteCode].features[companionFeatureKey].locations.push(locationKey);
                }
              });
          });
      });
    });
  /* eslint-enable max-len */
  return newState;
};
const reducer = (state, action) => {
  let setMethod = null;
  const newState = { ...state };
  // Increment the completed count for overall fetch and, if completed and expected are now equal,
  // reset both (so that subsequent batches of fetches can give an accurate progress metric).
  const completeOverallFetch = () => {
    newState.overallFetch.completed += 1;
    if (newState.overallFetch.expected === newState.overallFetch.completed) {
      newState.overallFetch.expected = 0;
      newState.overallFetch.completed = 0;
      newState.overallFetch.pendingHierarchy = 0;
    }
  };
  // Returns a boolean describing whether a fetch status was updated
  const setFetchStatusFromAction = (status) => {
    if (!Object.keys(FETCH_STATUS).includes(status) || status === FETCH_STATUS.AWAITING_CALL) {
      return false;
    }
    const { dataSource } = action;
    if (!FEATURE_DATA_SOURCES[dataSource]) { return false; }

    // ARCGIS_ASSETS_API
    if (dataSource === FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API) {
      const { featureKey, siteCode, data } = action;
      if (
        !newState.featureDataFetches[dataSource]
          || !newState.featureDataFetches[dataSource][featureKey]
          || !newState.featureDataFetches[dataSource][featureKey][siteCode]
      ) { return false; }
      newState.featureDataFetches[dataSource][featureKey][siteCode] = status;
      // If the status is SUCCESS and the action has data, also commit the data
      if (status === FETCH_STATUS.SUCCESS && data) {
        const { type: featureType } = FEATURES[featureKey];
        newState.featureData[featureType][featureKey][siteCode] = data;
      }
      return true;
    }

    // GRAPHQL_LOCATIONS_API
    if (dataSource === FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API) {
      const {
        minZoom,
        siteCode,
        fetchId,
        data,
      } = action;
      if (
        !newState.featureDataFetches[dataSource]
          || !newState.featureDataFetches[dataSource][minZoom]
          || !newState.featureDataFetches[dataSource][minZoom][siteCode]
          || !newState.featureDataFetches[dataSource][minZoom][siteCode].fetches[fetchId]
      ) { return false; }
      newState.featureDataFetches[dataSource][minZoom][siteCode].fetches[fetchId].status = status;
      // If the status is SUCCESS and the action has data, also commit the data
      if (status === FETCH_STATUS.SUCCESS && data) {
        const basePlots = [FEATURES.DISTRIBUTED_BASE_PLOTS.KEY, FEATURES.TOWER_BASE_PLOTS.KEY];
        // Make a map of location names to feature keys for this fetchId
        const { features } = newState.featureDataFetches[dataSource][minZoom][siteCode];
        const locNamesToFeatures = {};
        Object.keys(features)
          .filter(featureKey => features[featureKey].fetchId === fetchId)
          .forEach((featureKey) => {
            features[featureKey].locations.forEach((locName) => {
              // For *_BASE_PLOT features, which both have the same API locationType, determine
              // which locations go to which feature by looking at the plotType in the data
              if (basePlots.includes(featureKey)) {
                const { plotType } = data[locName];
                if (plotType === 'tower') {
                  locNamesToFeatures[locName] = FEATURES.TOWER_BASE_PLOTS.KEY;
                } else if (plotType === 'distributed') {
                  locNamesToFeatures[locName] = FEATURES.DISTRIBUTED_BASE_PLOTS.KEY;
                }
                return;
              }
              // All other features get a simple mapping
              locNamesToFeatures[locName] = featureKey;
            });
          });
        Object.keys(data).forEach((locName) => {
          const featureKey = locNamesToFeatures[locName];
          if (!FEATURES[featureKey]) { return; }
          const {
            type: featureType,
            parentDataFeatureKey,
            matchLocationCoordinateMap,
          } = FEATURES[featureKey];
          // This location is supplemental data to another location, so pipe it to the parent record
          if (parentDataFeatureKey) {
            const coordIdx = matchLocationCoordinateMap.findIndex(match => locName.endsWith(match));
            if (coordIdx === -1) { return; }
            const { type: parentDataFeatureType } = FEATURES[parentDataFeatureKey];
            if (!newState.featureData[parentDataFeatureType][parentDataFeatureKey][siteCode]) {
              newState.featureData[parentDataFeatureType][parentDataFeatureKey][siteCode] = {};
            }
            const { parent: parentLocName, latitude, longitude } = data[locName];
            if (!parentLocName) { return; }
            const parentSiteData = newState.featureData[parentDataFeatureType][parentDataFeatureKey][siteCode]; // eslint-disable-line max-len
            if (!parentSiteData[parentLocName]) {
              parentSiteData[parentLocName] = {};
            }
            // Initialize the geometry.coordinates with as many empty points as expressed by the map
            if (!parentSiteData[parentLocName].geometry) {
              parentSiteData[parentLocName].geometry = { coordinates: [] };
              for (let c = 0; c < matchLocationCoordinateMap.length; c += 1) {
                parentSiteData[parentLocName].geometry.coordinates.push([]);
              }
            }
            parentSiteData[parentLocName].geometry.coordinates[coordIdx] = [latitude, longitude];
            return;
          }
          // This is a "normal" location that is not part of another point-based location
          if (!newState.featureData[featureType][featureKey][siteCode]) {
            newState.featureData[featureType][featureKey][siteCode] = {};
          }
          // Geometry may be loaded by another sub-location so look for that and don't blow it away!
          const geometry = (
            !newState.featureData[featureType][featureKey][siteCode][locName]
              || !newState.featureData[featureType][featureKey][siteCode][locName].geometry
          ) ? null : { ...newState.featureData[featureType][featureKey][siteCode][locName].geometry }; // eslint-disable-line max-len
          newState.featureData[featureType][featureKey][siteCode][locName] = {
            ...data[locName],
            featureKey,
            domainCode: state.sites[siteCode].domainCode,
            stateCode: state.sites[siteCode].stateCode,
          };
          if (geometry) {
            newState.featureData[featureType][featureKey][siteCode][locName].geometry = geometry;
          }
          newState.featureData[featureType][featureKey][siteCode][locName].samplingModules = [];
        });
      }
    }

    /*
    const {
      type: featureType,
      parentDataFeatureKey,
      matchLocationCoordinateMap = [],
    } = FEATURES[featureKey];
    if (
      !newState.featureDataFetches[featureType]
        || !newState.featureDataFetches[featureType][featureKey]
        || !newState.featureDataFetches[featureType][featureKey][siteCode]
    ) { return false; }
    // No location present in action: just siteCode deep
    if (
      !location
        && typeof newState.featureDataFetches[featureType][featureKey][siteCode] === 'string'
    ) {
      newState.featureDataFetches[featureType][featureKey][siteCode] = status;
      // If the status is SUCCESS and the action has data, also commit the data
      if (status === FETCH_STATUS.SUCCESS && data) {
        newState.featureData[featureType][featureKey][siteCode] = data;
      }
      return true;
    }
    // Location present: go one level deeper
    if (!newState.featureDataFetches[featureType][featureKey][siteCode][location]) { return false; }
    newState.featureDataFetches[featureType][featureKey][siteCode][location] = status;
    // If the status is SUCCESS and the action has data, also commit the data
    if (status === FETCH_STATUS.SUCCESS && data) {
      const parsedData = parseLocationData(data);
      let dataFeatureKey = featureKey;
      let dataFeatureType = featureType;
      // Tower and Distributed base plots share a type so both fetched as TERRESTRIAL_SITE_FEATURES
      if (featureKey === FEATURES.TERRESTRIAL_SITE_FEATURES.KEY) {
        dataFeatureKey = parsedData.plotType === 'tower'
          ? FEATURES.TOWER_BASE_PLOTS.KEY
          : FEATURES.DISTRIBUTED_BASE_PLOTS.KEY;
        dataFeatureType = FEATURES[dataFeatureKey].type;
        // We also want to pull sampling module data from the hierarchy just for these features
        const hierarchy = newState.featureData[FEATURE_TYPES.SITE_LOCATION_HIERARCHIES][siteCode];
        const basePlot = location.replace('all', '').replace('.', '\\.');
        const basePlotRegex = new RegExp(`^${basePlot}([a-z]{3})$`);
        parsedData.samplingModules = Object.keys(hierarchy).reduce((acc, cur) => {
          const match = cur.match(basePlotRegex);
          if (match) { acc.push(match[1]); }
          return acc;
        }, [])
          .filter(k => k !== 'all' && k !== 'mfb')
          .sort((a, b) => (
            (PLOT_SAMPLING_MODULES[a] || null) > (PLOT_SAMPLING_MODULES[b] || null) ? 1 : -1
          ));
      }
      // Sampling points with parents all feed back into their parents as geometry coordinates
      if (featureType === FEATURE_TYPES.SAMPLING_POINTS && parentDataFeatureKey) {
        const { type: parentDataFeatureType } = FEATURES[parentDataFeatureKey];
        const { locationParent } = data;
        const parentData = newState.featureData[parentDataFeatureType][parentDataFeatureKey];
        const coordIdx = matchLocationCoordinateMap.findIndex(match => location.endsWith(match));
        if (coordIdx === -1) { return false; }
        if (!parentData[siteCode]) { parentData[siteCode] = {}; }
        if (!parentData[siteCode][locationParent]) { parentData[siteCode][locationParent] = {}; }
        // Initialize the geometry.coordinates with as many empty points as expressed by the map
        if (!parentData[siteCode][locationParent].geometry) {
          parentData[siteCode][locationParent].geometry = { coordinates: [] };
          for (let c = 0; c < matchLocationCoordinateMap.length; c += 1) {
            parentData[siteCode][locationParent].geometry.coordinates.push([]);
          }
        }
        parentData[siteCode][locationParent].geometry.coordinates[coordIdx] = [
          parsedData.latitude,
          parsedData.longitude,
        ];
        return true;
      }
      // Everything else: fill in feature data
      if (!newState.featureData[dataFeatureType][dataFeatureKey]) {
        newState.featureData[dataFeatureType][dataFeatureKey] = {};
      }
      if (!newState.featureData[dataFeatureType][dataFeatureKey][siteCode]) {
        newState.featureData[dataFeatureType][dataFeatureKey][siteCode] = {};
      }
      newState.featureData[dataFeatureType][dataFeatureKey][siteCode][location] = {
        ...parsedData,
        siteCode,
        name: location,
        featureKey: dataFeatureKey,
        domainCode: state.sites[siteCode].domainCode,
        stateCode: state.sites[siteCode].stateCode,
      };
    }
    */
    return true;
  };
  // Recursively applies a feature visibility change to parents and chilren up/down the tree
  const applyFeatureVisibilityToChildren = (feature, visible) => {
    if (newState.filters.features.visible[feature] === visible) { return; }
    newState.filters.features.visible[feature] = visible;
    if (FEATURES[feature].type === FEATURE_TYPES.GROUP) {
      Object.keys(FEATURES)
        .filter(f => FEATURES[f].parent === feature)
        .forEach((f) => { applyFeatureVisibilityToChildren(f, visible); });
    }
  };
  const applyFeatureVisibilityToParents = (feature) => {
    if (FEATURES[feature].parent) {
      const parentVisible = Object.keys(FEATURES)
        .filter(f => FEATURES[f].parent === FEATURES[feature].parent) // Of all children...
        .some(f => newState.filters.features.visible[f]); // ...some child is visible
      newState.filters.features.visible[FEATURES[feature].parent] = parentVisible;
      applyFeatureVisibilityToParents(FEATURES[feature].parent, parentVisible);
    }
  };
  // NATGEO_WORLD_MAP has no data at zoom 17 or higher so go to WORLD_IMAGERY (satellite)
  const updateMapTileWithZoom = () => {
    if (
      newState.map.zoom <= 17 && state.map.tileLayer !== TILE_LAYERS.NATGEO_WORLD_MAP.KEY
        && state.map.tileLayerAutoChangedAbove17) {
      newState.map.tileLayer = TILE_LAYERS.NATGEO_WORLD_MAP.KEY;
      newState.map.tileLayerAutoChangedAbove17 = false;
    }
    if (newState.map.zoom >= 17 && state.map.tileLayer === TILE_LAYERS.NATGEO_WORLD_MAP.KEY) {
      newState.map.tileLayer = TILE_LAYERS.WORLD_IMAGERY.KEY;
      newState.map.tileLayerAutoChangedAbove17 = true;
    }
  };
  // Shortcuts for deailing with hierarchies
  const hierarchiesSource = FEATURE_DATA_SOURCES.REST_LOCATIONS_API;
  const hierarchiesType = FEATURE_TYPES.SITE_LOCATION_HIERARCHIES;
  switch (action.type) {
    case 'setView':
      if (!Object.keys(VIEWS).includes(action.view)) { return state; }
      newState.view.current = action.view;
      return newState;

    case 'setViewInitialized':
      if (!Object.keys(VIEWS).includes(state.view.current)) { return state; }
      newState.view.initialized[state.view.current] = true;
      return newState;

    case 'setAspectRatio':
      if (typeof action.aspectRatio !== 'number' || action.aspectRatio <= 0) { return state; }
      newState.aspectRatio.currentValue = action.aspectRatio;
      newState.aspectRatio.widthReference = action.widthReference || 0;
      newState.table.maxBodyHeightUpdateFromAspectRatio = true;
      return newState;

    case 'setAspectRatioResizeEventListenerInitialized':
      newState.aspectRatio.resizeEventListenerInitialized = true;
      return newState;

    case 'hydrateNeonContextData':
      if (!action.neonContextData) { return state; }
      return hydrateNeonContextData(newState, action.neonContextData);

    // Table
    case 'setTableFocus':
      newState.table.focus = action.focus;
      return newState;

    case 'setTableMaxBodyHeight':
      newState.table.maxBodyHeight = Math.max(action.height || 0, MIN_TABLE_MAX_BODY_HEIGHT);
      newState.table.maxBodyHeightUpdateFromAspectRatio = false;
      return newState;

    // Map
    case 'setMapZoom':
      if (!zoomIsValid(action.zoom)) { return state; }
      newState.map.zoom = action.zoom;
      if (centerIsValid(action.center)) { newState.map.center = action.center; }
      if (boundsAreValid(action.bounds)) { newState.map.bounds = action.bounds; }
      newState.map.zoomedIcons = getZoomedIcons(newState.map.zoom);
      updateMapTileWithZoom();
      return calculateFeatureDataFetches(
        calculateFeatureAvailability(newState),
      );

    case 'setMapBounds':
      if (boundsAreValid(action.bounds)) { newState.map.bounds = action.bounds; }
      return calculateFeatureDataFetches(newState);

    case 'setMapCenter':
      if (!centerIsValid(action.center)) { return state; }
      if (boundsAreValid(action.bounds)) { newState.map.bounds = action.bounds; }
      newState.map.center = [...action.center];
      return calculateFeatureDataFetches(newState);

    case 'setMapTileLayer':
      if (!Object.keys(TILE_LAYERS).includes(action.tileLayer)) { return state; }
      newState.map.tileLayer = action.tileLayer;
      return newState;

    case 'setMapRepositionOpenPopupFunc':
      newState.map.repositionOpenPopupFunc = typeof action.func === 'function' ? action.func : null;
      return newState;

    case 'showFullObservatory':
      newState.map.center = OBSERVATORY_CENTER;
      newState.map.zoom = deriveFullObservatoryZoomLevel(action.mapRef);
      return newState;

    // Features
    case 'setFilterFeaturesOpen':
      newState.filters.features.open = !!action.open;
      return newState;

    case 'setFilterFeatureVisibility':
      if (
        !Object.keys(FEATURES).includes(action.feature) || typeof action.visible !== 'boolean'
      ) { return state; }
      applyFeatureVisibilityToChildren(action.feature, action.visible);
      applyFeatureVisibilityToParents(action.feature);
      return calculateFeatureDataFetches(newState);

    case 'setFilterFeatureCollapsed':
      if (!Object.keys(FEATURES).includes(action.feature)) { return state; }
      newState.filters.features.collapsed.add(action.feature);
      return newState;

    case 'setFilterFeatureExpanded':
      if (!Object.keys(FEATURES).includes(action.feature)) { return state; }
      newState.filters.features.collapsed.delete(action.feature);
      return newState;

    // Focus Location
    case 'setNewFocusLocation':
      newState.focusLocation.fetch = { status: FETCH_STATUS.AWAITING_CALL, error: null };
      newState.focusLocation.current = action.location;
      newState.focusLocation.data = null;
      newState.overallFetch.expected += 1;
      if (newState.view.current !== VIEWS.MAP) { newState.view.current = VIEWS.MAP; }
      return newState;

    case 'setFocusLocationFetchStarted':
      newState.focusLocation.fetch = { status: FETCH_STATUS.FETCHING, error: null };
      newState.focusLocation.data = null;
      return newState;

    case 'setFocusLocationFetchFailed':
      newState.focusLocation.fetch = {
        status: FETCH_STATUS.ERROR,
        error: `Invalid location: ${state.focusLocation.current.toString()}`,
      };
      newState.focusLocation.current = null;
      newState.focusLocation.data = null;
      completeOverallFetch();
      return newState;

    case 'setFocusLocationFetchSucceeded':
      newState.focusLocation.fetch = { status: FETCH_STATUS.SUCCESS, error: null };
      newState.focusLocation.data = action.skipParse ? action.data : parseLocationData(action.data);
      // For STATE and DOMAIN types: ensure corresponding feature is visible
      if (newState.focusLocation.data.type === 'STATE') {
        newState.filters.features.visible[FEATURES.STATES.KEY] = true;
        newState.filters.features.visible[FEATURES.DOMAINS.KEY] = false;
      }
      if (newState.focusLocation.data.type === 'DOMAIN') {
        newState.filters.features.visible[FEATURES.DOMAINS.KEY] = true;
        newState.filters.features.visible[FEATURES.STATES.KEY] = false;
      }
      completeOverallFetch();
      newState.map = getMapStateForFocusLocation(newState);
      updateMapTileWithZoom();
      return calculateFeatureDataFetches(
        calculateFeatureAvailability(newState),
      );

    // Fetch and Import
    case 'awaitingFeatureDataFetchesTriggered':
      return { ...state, featureDataFetchesHasAwaiting: false };

    case 'setFeatureDataFetchStarted':
      setFetchStatusFromAction(FETCH_STATUS.FETCHING);
      return newState;

    case 'setFeatureDataFetchSucceeded':
      setFetchStatusFromAction(FETCH_STATUS.SUCCESS);
      completeOverallFetch();
      return newState.overallFetch.expected === 0
        ? calculateFeatureDataFetches(newState)
        : newState;

    case 'setFeatureDataFetchFailed':
      setFetchStatusFromAction(FETCH_STATUS.ERROR);
      completeOverallFetch();
      return newState;

    case 'setDomainLocationHierarchyFetchStarted':
      /* eslint-disable max-len */
      if (!newState.featureDataFetches[hierarchiesSource][hierarchiesType][action.domainCode]) { return state; }
      newState.featureDataFetches[hierarchiesSource][hierarchiesType][action.domainCode] = FETCH_STATUS.FETCHING;
      /* eslint-enable max-len */
      return newState;

    case 'setDomainLocationHierarchyFetchSucceeded':
      if (
        !newState.featureDataFetches[hierarchiesSource][hierarchiesType][action.domainCode]
          || !Array.isArray(action.data.locationChildHierarchy)
      ) { return state; }
      /* eslint-disable max-len */
      newState.featureDataFetches[hierarchiesSource][hierarchiesType][action.domainCode] = FETCH_STATUS.SUCCESS;
      action.data.locationChildHierarchy.forEach((child) => {
        if (child.locationType !== 'SITE' || child.locationName === 'HQTW') { return; }
        newState.featureData.SITE_LOCATION_HIERARCHIES[child.locationName] = parseLocationHierarchy(child);
      });
      /* eslint-enable max-len */
      newState.overallFetch.pendingHierarchy -= 1;
      completeOverallFetch();
      return calculateFeatureDataFetches(newState);

    case 'setDomainLocationHierarchyFetchFailed':
      /* eslint-disable max-len */
      if (!newState.featureDataFetches[hierarchiesSource][hierarchiesType][action.domainCode]) { return state; }
      newState.featureDataFetches[hierarchiesSource][hierarchiesType][action.domainCode] = FETCH_STATUS.ERROR;
      /* eslint-enable max-len */
      newState.overallFetch.pendingHierarchy -= 1;
      completeOverallFetch();
      return newState;

    // Selection
    case 'toggleSiteSelected':
      if (newState.selection[SELECTABLE_FEATURE_TYPES.SITES].has(action.site)) {
        newState.selection[SELECTABLE_FEATURE_TYPES.SITES].delete(action.site);
      } else {
        newState.selection[SELECTABLE_FEATURE_TYPES.SITES].add(action.site);
      }
      return deriveBoundarySelections(newState);

    case 'toggleStateSelected':
      if (!action.stateCode) { return state; }
      setMethod = (
        state.selection.derived[FEATURES.STATES.KEY][action.stateCode] === 'total'
          ? 'delete' : 'add'
      );
      newState.featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.STATES.KEY][action.stateCode].sites
        .forEach((siteCode) => {
          newState.selection[SELECTABLE_FEATURE_TYPES.SITES][setMethod](siteCode);
        });
      return deriveBoundarySelections(newState);

    case 'toggleDomainSelected':
      if (!action.domainCode) { return state; }
      setMethod = (
        state.selection.derived[FEATURES.DOMAINS.KEY][action.domainCode] === 'total'
          ? 'delete' : 'add'
      );
      newState.featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.DOMAINS.KEY][action.domainCode].sites
        .forEach((siteCode) => {
          newState.selection[SELECTABLE_FEATURE_TYPES.SITES][setMethod](siteCode);
        });
      return deriveBoundarySelections(newState);

    // Default
    default:
      return state;
  }
};

/**
   Context and Hook
*/
const Context = createContext(DEFAULT_STATE);
const useSiteMapContext = () => {
  const hookResponse = useContext(Context);
  if (hookResponse.length !== 2) {
    return [cloneDeep(DEFAULT_STATE), () => {}];
  }
  return hookResponse;
};

/**
   Context Provider
*/
const Provider = (props) => {
  const {
    view,
    aspectRatio,
    filterPosition,
    mapZoom,
    mapCenter,
    mapTileLayer,
    location: locationProp,
    selection,
    maxSelectable,
    children,
  } = props;

  // Neon Context State
  const [
    { data: neonContextData, isFinal: neonContextIsFinal, hasError: neonContextHasError },
  ] = NeonContext.useNeonContextState();

  /**
     Initial State and Reducer Setup
  */
  const initialMapZoom = mapZoom === null ? null
    : Math.max(Math.min(mapZoom, MAP_ZOOM_RANGE[1]), MAP_ZOOM_RANGE[0]);
  let initialState = cloneDeep(DEFAULT_STATE);
  initialState.view.current = (
    Object.keys(VIEWS).includes(view.toUpperCase()) ? view.toUpperCase() : VIEWS.MAP
  );
  initialState.filters.position = filterPosition;
  initialState.map = {
    ...initialState.map,
    zoom: initialMapZoom,
    center: mapCenter,
    tileLayer: mapTileLayer,
  };
  if (typeof locationProp === 'string') {
    initialState.focusLocation.current = locationProp;
    initialState.focusLocation.fetch.status = FETCH_STATUS.AWAITING_CALL;
    initialState.overallFetch.expected += 1;
  }
  if (typeof aspectRatio === 'number' && aspectRatio > 0) {
    initialState.aspectRatio.isDynamic = false;
    initialState.aspectRatio.currentValue = aspectRatio;
  }
  if (Object.keys(SELECTABLE_FEATURE_TYPES).includes(selection)) {
    initialState.selection.active = selection;
    initialState.selection.maxSelectable = maxSelectable;
  }
  if (neonContextIsFinal && !neonContextHasError) {
    initialState = hydrateNeonContextData(initialState, neonContextData);
  }
  const [state, dispatch] = useReducer(reducer, initialState);

  const canFetchFeatureData = (
    state.neonContextHydrated
      && !(state.focusLocation.current && state.focusLocation.fetch.status !== FETCH_STATUS.SUCCESS)
  );

  /**
     Effect - trigger focusLocation fetch or short circuit if found in NeonContext data
  */
  useEffect(() => {
    const { current, fetch: { status } } = state.focusLocation;
    if (!current || status !== FETCH_STATUS.AWAITING_CALL || !state.neonContextHydrated) { return; }
    // If the location is a known Domain or State then pull from NeonContext
    const {
      [FEATURES.STATES.KEY]: statesData = {},
      [FEATURES.DOMAINS.KEY]: domainsData = {},
    } = state.featureData[FEATURE_TYPES.BOUNDARIES];
    if (Object.keys(statesData).includes(current)) {
      const { 0: latitude, 1: longitude } = statesData[current].center;
      dispatch({
        type: 'setFocusLocationFetchSucceeded',
        data: { type: 'STATE', latitude, longitude },
        skipParse: true,
      });
      return;
    }
    if (Object.keys(domainsData).includes(current)) {
      const { 0: latitude, 1: longitude } = domainsData[current].center;
      dispatch({
        type: 'setFocusLocationFetchSucceeded',
        data: { type: 'DOMAIN', latitude, longitude },
        skipParse: true,
      });
      return;
    }
    if (Object.keys(state.sites).includes(current)) {
      const { latitude, longitude } = state.sites[current];
      dispatch({
        type: 'setFocusLocationFetchSucceeded',
        data: { type: 'SITE', latitude, longitude },
        skipParse: true,
      });
      return;
    }
    // Trigger focus location fetch
    dispatch({ type: 'setFocusLocationFetchStarted' });
    NeonApi.getLocationObservable(current).pipe(
      map((response) => {
        if (response && response.data && response.data) {
          dispatch({ type: 'setFocusLocationFetchSucceeded', data: response.data });
          return of(true);
        }
        dispatch({ type: 'setFocusLocationFetchFailed', error: 'malformed response' });
        return of(false);
      }),
      catchError((error) => {
        dispatch({ type: 'setFocusLocationFetchFailed', error: error.message });
        return of(false);
      }),
    ).subscribe();
  }, [
    state.sites,
    state.focusLocation,
    state.focusLocation.fetch.status,
    state.neonContextHydrated,
    state.featureData,
  ]);

  /**
     Effect - trigger all data fetches and imports
  */
  useEffect(() => {
    if (!canFetchFeatureData || !state.featureDataFetchesHasAwaiting) { return; }

    // SITE_LOCATION_HIERARCHIES Fetches (REST_LOCATIONS_API)
    // These are not features themselves but constitute critical data in order to generate feature
    // fetches for anything from the locations API family
    const hierarchiesSource = FEATURE_DATA_SOURCES.REST_LOCATIONS_API;
    const hierarchiesType = FEATURE_TYPES.SITE_LOCATION_HIERARCHIES;
    Object.keys(state.featureDataFetches[hierarchiesSource][hierarchiesType])
      .forEach((domainCode) => {
        if (state.featureDataFetches[hierarchiesSource][hierarchiesType][domainCode] !== FETCH_STATUS.AWAITING_CALL) { return; } // eslint-disable-line max-len
        dispatch({ type: 'setDomainLocationHierarchyFetchStarted', domainCode });
        NeonApi.getSiteLocationHierarchyObservable(domainCode).pipe(
          map((response) => {
            if (response && response.data && response.data) {
              dispatch({
                type: 'setDomainLocationHierarchyFetchSucceeded',
                data: response.data,
                domainCode,
              });
              return of(true);
            }
            dispatch({
              type: 'setDomainLocationHierarchyFetchFailed',
              error: 'malformed response',
              domainCode,
            });
            return of(false);
          }),
          catchError((error) => {
            dispatch({
              type: 'setDomainLocationHierarchyFetchFailed',
              error: error.message,
              domainCode,
            });
            return of(false);
          }),
        ).subscribe();
      });

    // ARCGIS_ASSETS_API Fetches
    const arcgisSource = FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API;
    Object.keys(state.featureDataFetches[arcgisSource]).forEach((featureKey) => {
      Object.keys(state.featureDataFetches[arcgisSource][featureKey]).forEach((siteCode) => {
        const status = state.featureDataFetches[arcgisSource][featureKey][siteCode] || null;
        if (status !== FETCH_STATUS.AWAITING_CALL) { return; }
        dispatch({
          type: 'setFeatureDataFetchStarted',
          dataSource: arcgisSource,
          featureKey,
          siteCode,
        });
        NeonApi.getArcgisAssetObservable(featureKey, siteCode).pipe(
          map((response) => {
            if (response) {
              dispatch({
                type: 'setFeatureDataFetchSucceeded',
                dataSource: arcgisSource,
                data: response,
                featureKey,
                siteCode,
              });
              return of(true);
            }
            dispatch({
              type: 'setFeatureDataFetchFailed',
              dataSource: arcgisSource,
              error: 'malformed response',
              featureKey,
              siteCode,
            });
            return of(false);
          }),
          catchError((error) => {
            dispatch({
              type: 'setFeatureDataFetchFailed',
              dataSource: arcgisSource,
              error: error.message,
              featureKey,
              siteCode,
            });
            return of(false);
          }),
        ).subscribe();
      });
    });

    // GRAPHQL_LOCATIONS_API Fetches
    const locationsSource = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
    const locFetches = state.featureDataFetches[locationsSource];
    Object.keys(locFetches).forEach((minZoom) => {
      Object.keys(locFetches[minZoom]).forEach((siteCode) => {
        Object.keys(locFetches[minZoom][siteCode].fetches)
          .filter(fetchId => (
            locFetches[minZoom][siteCode].fetches[fetchId].status === FETCH_STATUS.AWAITING_CALL
          ))
          .forEach((fetchId) => {
            dispatch({
              type: 'setFeatureDataFetchStarted',
              dataSource: locationsSource,
              minZoom,
              siteCode,
              fetchId,
            });
            const worker = new FetchLocationsWorker();
            worker.addEventListener('message', (message) => {
              const { status, data, error } = message.data;
              if (status === 'success') {
                dispatch({
                  type: 'setFeatureDataFetchSucceeded',
                  dataSource: locationsSource,
                  minZoom,
                  siteCode,
                  fetchId,
                  data,
                });
              } else {
                dispatch({
                  type: 'setFeatureDataFetchFailed',
                  dataSource: locationsSource,
                  minZoom,
                  siteCode,
                  fetchId,
                  error,
                });
              }
              worker.terminate();
            });
            worker.postMessage(locFetches[minZoom][siteCode].fetches[fetchId].locations);
          });
      });
    });

    /*
    // All other feature-based fetches
    Object.keys(state.featureDataFetches)
      .filter(type => type !== FEATURE_TYPES.SITE_LOCATION_HIERARCHIES)
      .forEach((type) => {
        Object.keys(state.featureDataFetches[type]).forEach((feature) => {
          const { dataSource } = FEATURES[feature];
          Object.keys(state.featureDataFetches[type][feature]).forEach((siteCode) => {
            const featureSite = state.featureDataFetches[type][feature][siteCode];
            // LOCATIONS_API
            if (dataSource === FEATURE_DATA_SOURCES.LOCATIONS_API) {
              if (typeof featureSite !== 'object') { return; }
              Object.keys(featureSite).forEach((location) => {
                if (featureSite[location] !== FETCH_STATUS.AWAITING_CALL) { return; }
                dispatch({
                  type: 'setFeatureDataFetchStarted',
                  feature,
                  siteCode,
                  location,
                });
                NeonApi.getLocationObservable(location).pipe(
                  map((response) => {
                    if (response && response.data && response.data) {
                      dispatch({
                        type: 'setFeatureDataFetchSucceeded',
                        data: response.data,
                        feature,
                        siteCode,
                        location,
                      });
                      return of(true);
                    }
                    dispatch({
                      type: 'setFeatureDataFetchFailed',
                      error: 'malformed response',
                      feature,
                      siteCode,
                      location,
                    });
                    return of(false);
                  }),
                  catchError((error) => {
                    dispatch({
                      type: 'setFeatureDataFetchFailed',
                      error: error.message,
                      feature,
                      siteCode,
                      location,
                    });
                    return of(false);
                  }),
                ).subscribe();
              });
            }
          });
        });
      });
    */
    dispatch({ type: 'awaitingFeatureDataFetchesTriggered' });
  }, [canFetchFeatureData, state.featureDataFetchesHasAwaiting, state.featureDataFetches]);

  /**
     Render
  */
  return (
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  );
};

Provider.propTypes = {
  ...SITE_MAP_PROP_TYPES,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string,
    ])),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
};
Provider.defaultProps = SITE_MAP_DEFAULT_PROPS;

/**
   Export
*/
const SiteMapContext = {
  Provider,
  useSiteMapContext,
  SORT_DIRECTIONS,
  VIEWS,
};

export default SiteMapContext;
