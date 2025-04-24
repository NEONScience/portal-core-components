import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import uniqueId from 'lodash/uniqueId';

import { of, map, catchError } from 'rxjs';

import NeonApi from '../NeonApi/NeonApi';
import NeonContext from '../NeonContext/NeonContext';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import NeonSignInButtonState from '../NeonSignInButton/NeonSignInButtonState';
import makeStateStorage from '../../service/StateStorageService';
import { convertStateForStorage, convertStateFromStorage } from './StateStorageConverter';

import {
  fetchManyLocationsGraphQL,
  fetchSingleLocationREST,
  fetchDomainHierarchy,
} from './FetchLocationUtils';

import {
  SORT_DIRECTIONS,
  BASE_LAYERS,
  OVERLAYS,
  VIEWS,
  FEATURES,
  FETCH_STATUS,
  FEATURE_TYPES,
  FEATURE_DATA_SOURCES,
  SELECTION_PORTIONS,
  SITE_LOCATION_HIERARCHIES_MIN_ZOOM,
  MAP_ZOOM_RANGE,
  MAP_MOUSE_MODES,
  OBSERVATORY_CENTER,
  PLOT_SAMPLING_MODULES,
  SITE_MAP_PROP_TYPES,
  SITE_MAP_DEFAULT_PROPS,
  MIN_TABLE_MAX_BODY_HEIGHT,
  MANUAL_LOCATION_TYPES,
  GRAPHQL_LOCATIONS_API_CONSTANTS,
  getDefaultState,
  getZoomedIcons,
  mapIsAtFocusLocation,
  getMapStateForFocusLocation,
  hydrateNeonContextData,
  calculateFeatureAvailability,
  boundsAreValid,
  calculateLocationsInBounds,
  deriveFullObservatoryZoomLevel,
} from './SiteMapUtils';

import { exists, existsNonEmpty } from '../../util/typeUtil';

// Derive the selected status of a given region (US state or NEON domain). This should run every
// time the list of selected items changes depending on the selecatble feature type. It regenerates
// selectedStates and selectedDomains in state to each contain a key/value lookup where the key is
// the region id (state code or domain code) and the value is either 'total' (all sites selected)
// or 'partial' (some sites selected). If no sites are selected for the boundary it is omitted from
// the map.
const deriveRegionSelections = (state) => {
  const derive = (featureKey) => {
    const featureType = FEATURES[featureKey].type;
    if (!state.neonContextHydrated || !state.featureData[featureType][featureKey]) {
      return {};
    }
    const { validSet } = state.selection;
    const selectedBoundaries = {};
    Object.keys(state.featureData[featureType][featureKey]).forEach((boundaryCode) => {
      const boundarySitesSet = (
        state.featureData[featureType][featureKey][boundaryCode].sites || new Set()
      );
      const selectableSites = !validSet
        ? boundarySitesSet
        : new Set([...boundarySitesSet].filter((siteCode) => validSet.has(siteCode)));
      const intersection = [...selectableSites]
        .filter((x) => state.selection.set.has(x));
      if (!intersection.length) { return; }
      selectedBoundaries[boundaryCode] = (
        intersection.length === selectableSites.size
          ? SELECTION_PORTIONS.TOTAL
          : SELECTION_PORTIONS.PARTIAL
      );
    });
    return selectedBoundaries;
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

// Returns a boolean indicating whether an item is selectable
const isSelectable = (item, validSet = null) => {
  if (!item && item !== 0) { return false; }
  return validSet instanceof Set ? validSet.has(item) : true;
};

// Filters a set down to only selectable items
const getSelectableSet = (setArg, validSet = null) => {
  if (!(setArg instanceof Set) && !Array.isArray(setArg)) { return new Set(); }
  const set = setArg instanceof Set ? setArg : new Set(setArg);
  return validSet instanceof Set
    ? new Set([...set].filter((item) => isSelectable(item, validSet)))
    : set;
};

// Set the valid flag for selection based on current limits. Empty selections are always invalid.
const validateSelection = (state) => {
  let valid = false;
  const { limit, set, validSet } = state.selection;
  if (set.size > 0 && (!validSet || [...set].every((item) => validSet.has(item)))) {
    valid = true;
    if (
      (Number.isFinite(limit) && set.size !== limit)
      || (Array.isArray(limit) && (set.size < limit[0] || set.size > limit[1]))
    ) { valid = false; }
  }
  return {
    ...state,
    selection: {
      ...state.selection,
      valid,
    },
  };
};

// NOTE: DISTRIBUTED_BASE_PLOTS and TOWER_BASE_PLOTS have the same locationType. We must fetch
// them all for a given site in order to differentiate them. This impacts how we structure fetches
// for base plot features as well as how we turn those fetch results into feater data. This func
// is used to consistently inform when to trigger that behavior for a given feature.
const basePlots = [FEATURES.DISTRIBUTED_BASE_PLOTS.KEY, FEATURES.TOWER_BASE_PLOTS.KEY];
const isBasePlot = (featureKey) => basePlots.includes(featureKey);

/**
   Reducer Helpers (functions used exclusively by the reducer)
*/
const zoomIsValid = (zoom) => (
  Number.isInteger(zoom) && zoom >= MAP_ZOOM_RANGE[0] && zoom <= MAP_ZOOM_RANGE[1]
);
const centerIsValid = (center) => (
  Array.isArray(center)
  && center.length === 2
  && center.every((v) => (typeof v === 'number' && !Number.isNaN(v)))
);

const calculateSitesInBounds = (state) => {
  const sites = [];
  const stateLocations = state.featureData[FEATURE_TYPES.LOCATIONS.KEY];
  if (!exists(stateLocations)) {
    return sites;
  }
  const featureKeys = Object.keys(stateLocations);
  if (!existsNonEmpty(featureKeys)) {
    return sites;
  }
  featureKeys.forEach((featureKey) => {
    if (!exists(stateLocations[featureKey])) {
      return;
    }
    const siteCodeKeys = Object.keys(stateLocations[featureKey]);
    if (!existsNonEmpty(featureKeys)) {
      return;
    }
    siteCodeKeys.forEach((siteCode) => {
      const siteLocations = stateLocations[featureKey][siteCode];
      if (!exists(siteLocations) || !existsNonEmpty(Object.keys(siteLocations))) {
        return;
      }
      const locations = calculateLocationsInBounds(siteLocations, state.map.bounds);
      if ((locations.length > 0) && !sites.includes(siteCode)) {
        sites.push(siteCode);
      }
    });
  });
  return sites;
};

// Creates fetch objects with an AWAITING_CALL status based on current state.
// New fetches are created for all fetchable feature data found to be active (the feature is
// available and visible), within the current bounds of the map, and not already fetched.
// Optionally include required sites to consider "in bounds" (useful for when a focus location
// is a site feature like a plot far from the site center so the site itself may not be seen as
// "in bounds").
const calculateFeatureDataFetches = (state, requiredSites = []) => {
  // Determine which sites are in the map from the set of all current sites unless
  // manualLocationData is non-empty and contains prototpye sites
  const fetchablePrototypeSites = (state.manualLocationData || []).filter((manualLocation) => (
    manualLocation.manualLocationType === MANUAL_LOCATION_TYPES.PROTOTYPE_SITE
    && state.sites[manualLocation.siteCode]
  ));
  let sitesToConsider = state.sites;
  if (state.manualLocationData && fetchablePrototypeSites.length) {
    sitesToConsider = {};
    fetchablePrototypeSites.forEach((manualLocation) => {
      sitesToConsider[manualLocation.siteCode] = state.sites[manualLocation.siteCode];
    });
  }
  const sitesInMap = calculateLocationsInBounds(sitesToConsider, state.map.bounds, true, 0.06);
  const locationSitesInMap = calculateSitesInBounds(state);
  if (Array.isArray(locationSitesInMap) && (locationSitesInMap.length > 0)) {
    locationSitesInMap.forEach((siteCode) => {
      if (!sitesInMap.includes(siteCode)) { sitesInMap.push(siteCode); }
    });
  }
  let requiredSitesArray = [];
  if (requiredSites && requiredSites.length) {
    requiredSitesArray = (
      Array.isArray(requiredSites) ? requiredSites : [requiredSites]
    ).filter((siteCode) => Object.keys(state.sites).includes(siteCode));
  }
  requiredSitesArray.forEach((siteCode) => {
    if (!sitesInMap.includes(siteCode)) { sitesInMap.push(siteCode); }
  });
  if (!sitesInMap.length) { return state; }
  const domainsInMap = new Set();
  sitesInMap
    .filter((siteCode) => state.sites[siteCode])
    .forEach((siteCode) => {
      domainsInMap.add(state.sites[siteCode].domainCode);
    });
  const newState = { ...state };

  // Domain-location hierarchy fetches for individual domains
  // Only fetch if bounds are not null as that way we can trust sitesInMap is not all the sites
  if (state.map.zoom >= SITE_LOCATION_HIERARCHIES_MIN_ZOOM && state.map.bounds) {
    const hierarchiesSource = FEATURE_DATA_SOURCES.REST_LOCATIONS_API;
    const hierarchiesType = FEATURE_TYPES.SITE_LOCATION_HIERARCHIES.KEY;
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
    .filter((featureKey) => (
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

  // Feature fetches - REST_LOCATIONS_API
  Object.keys(FEATURES)
    // Only look at available+visible features that get fetched and have a location type match
    .filter((featureKey) => (
      FEATURES[featureKey].dataSource === FEATURE_DATA_SOURCES.REST_LOCATIONS_API
      && FEATURES[featureKey].matchLocationType
      && state.filters.features.available[featureKey]
      && state.filters.features.visible[featureKey]
    ))
    .forEach((featureKey) => {
      const { dataSource, matchLocationType } = FEATURES[featureKey];
      // For each feature that warrants fetching; loop through the sites in the map
      sitesInMap
        // Domain hierarchy must be completed in order to generate subsequent fetches
        // (only true if site location hierarchy feature data is there)
        .filter((siteCode) => state.featureData.SITE_LOCATION_HIERARCHIES[siteCode])
        .forEach((siteCode) => {
          if (!newState.featureDataFetches[dataSource][featureKey][siteCode]) {
            newState.featureDataFetches[dataSource][featureKey][siteCode] = {};
          }
          // Extract matching location IDs from the hierarchy and set them as fetches awaiting call
          const hierarchy = state.featureData.SITE_LOCATION_HIERARCHIES[siteCode];
          const locationIsMatch = matchLocationType instanceof RegExp
            ? ((locationKey) => matchLocationType.test(hierarchy[locationKey].type))
            : ((locationKey) => hierarchy[locationKey].type === matchLocationType);
          Object.keys(hierarchy)
            .filter(locationIsMatch)
            .forEach((locationKey) => {
              if (newState.featureDataFetches[dataSource][featureKey][siteCode][locationKey]) {
                return;
              }
              newState.featureDataFetches[dataSource][featureKey][siteCode][locationKey] = FETCH_STATUS.AWAITING_CALL; // eslint-disable-line max-len
              newState.overallFetch.expected += 1;
              newState.featureDataFetchesHasAwaiting = true;
            });
        });
    });

  // Feature fetches - GRAPHQL_LOCATIONS_API
  /* eslint-disable max-len */
  // Start by looping through all minZoom levels associated with any GraphQL Locations API features
  // Our goal is to build a single fetch containing a flat list of all locations for this site
  // that are now visible, clustered by minZoom level.
  Object.keys(GRAPHQL_LOCATIONS_API_CONSTANTS.MINZOOM_TO_FEATURES_MAP)
    .filter((minZoom) => state.map.zoom >= minZoom)
    .forEach((minZoom) => {
      // Loop through all available and visible features at this minZoom level
      GRAPHQL_LOCATIONS_API_CONSTANTS.MINZOOM_TO_FEATURES_MAP[minZoom].forEach((featureKey) => {
        if (!state.filters.features.available[featureKey] || !state.filters.features.visible[featureKey]) { return; }
        const { dataSource, matchLocationType, matchLocationName } = FEATURES[featureKey];
        const companionFeatureKey = (
          !isBasePlot(featureKey) ? null : basePlots.find((key) => key !== featureKey)
        );
        const companionMinZoom = companionFeatureKey
          ? GRAPHQL_LOCATIONS_API_CONSTANTS.FEATURES_TO_MINZOOM_MAP[companionFeatureKey]
          : null;
        if (!newState.featureDataFetches[dataSource][minZoom]) {
          newState.featureDataFetches[dataSource][minZoom] = {};
        }
        // We've narrowed to minZoom and feature, now narrow to only the sites in the map
        sitesInMap
          // Domain hierarchy must be completely loaded in order to generate subsequent fetches
          .filter((siteCode) => state.featureData.SITE_LOCATION_HIERARCHIES[siteCode])
          // Site must have meaningful features to fetch at this minZoom level
          .filter((siteCode) => state.sites[siteCode].terrain === FEATURES[featureKey].siteTerrain)
          .forEach((siteCode) => {
            const getInitialSiteCodeFetchObject = (fetchMinZoom) => ({
              features: Object.fromEntries(
                GRAPHQL_LOCATIONS_API_CONSTANTS.MINZOOM_TO_FEATURES_MAP[fetchMinZoom]
                  .filter((fKey) => state.sites[siteCode].terrain === FEATURES[fKey].siteTerrain)
                  .map((fKey) => [fKey, { fetchId: null, locations: [] }]),
              ),
              fetches: {},
            });
            // Initialize the fetch structure for the dataSource / minZoom / siteCode
            if (!newState.featureDataFetches[dataSource][minZoom][siteCode]) {
              newState.featureDataFetches[dataSource][minZoom][siteCode] = getInitialSiteCodeFetchObject(minZoom);
            }
            // If this is a base plot feature then look to see if already handled
            if (isBasePlot(featureKey) && companionFeatureKey && companionMinZoom) {
              if (!newState.featureDataFetches[dataSource][companionMinZoom][siteCode]) {
                newState.featureDataFetches[dataSource][companionMinZoom][siteCode] = getInitialSiteCodeFetchObject(companionMinZoom);
              } else {
                const companionFeatureObject = newState.featureDataFetches[dataSource][companionMinZoom][siteCode].features[companionFeatureKey];
                newState.featureDataFetches[dataSource][minZoom][siteCode].features[featureKey] = { ...companionFeatureObject };
              }
            }
            const { features, fetches } = newState.featureDataFetches[dataSource][minZoom][siteCode];
            // Stop if this feature already has a fetchID
            if (features[featureKey].fetchId !== null) { return; }
            // Find or create a fetch that's awaiting call with a unique ID
            let awaitingFetchKey = Object.keys(fetches)
              .find((fetchKey) => fetches[fetchKey].status === FETCH_STATUS.AWAITING_CALL);
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
            if (
              companionMinZoom && companionFeatureKey
              && !newState.featureDataFetches[dataSource][companionMinZoom][siteCode].features[companionFeatureKey].fetchId
            ) {
              newState.featureDataFetches[dataSource][companionMinZoom][siteCode].features[companionFeatureKey].fetchId = awaitingFetchKey;
            }
            // Harvest locations from the hierarchy for this feature/site; append to awaiting fetch
            // Matching function varies depending on how the feature is set up.
            const hierarchy = state.featureData.SITE_LOCATION_HIERARCHIES[siteCode];
            let locationIsMatch = () => false;
            if (matchLocationType instanceof RegExp) {
              locationIsMatch = (locationKey) => matchLocationType.test(hierarchy[locationKey].type);
            } else if (typeof matchLocationType === 'string') {
              locationIsMatch = (locationKey) => hierarchy[locationKey].type === matchLocationType;
            } else if (matchLocationName instanceof RegExp) {
              locationIsMatch = (locationKey) => matchLocationName.test(locationKey);
            }
            Object.keys(hierarchy)
              .filter(locationIsMatch)
              .forEach((locationKey) => {
                newState.featureDataFetches[dataSource][minZoom][siteCode].fetches[awaitingFetchKey].locations.push(locationKey);
                newState.featureDataFetches[dataSource][minZoom][siteCode].features[featureKey].locations.push(locationKey);
                if (isBasePlot(featureKey) && companionMinZoom && companionFeatureKey) {
                  newState.featureDataFetches[dataSource][companionMinZoom][siteCode].features[companionFeatureKey].locations.push(locationKey);
                }
              });
          });
      });
    });
  /* eslint-enable max-len */
  return newState;
};

// NATGEO_WORLD_MAP has no data at zoom 17 or higher so go to WORLD_IMAGERY (satellite)
const updateMapTileWithZoom = (state) => {
  const newState = { ...state };
  if (
    newState.map.zoom <= 17 && state.map.baseLayer !== BASE_LAYERS.NATGEO_WORLD_MAP.KEY
    && state.map.baseLayerAutoChangedAbove17) {
    newState.map.baseLayer = BASE_LAYERS.NATGEO_WORLD_MAP.KEY;
    newState.map.baseLayerAutoChangedAbove17 = false;
  } else if (newState.map.zoom >= 17 && state.map.baseLayer === BASE_LAYERS.NATGEO_WORLD_MAP.KEY) {
    newState.map.baseLayer = BASE_LAYERS.WORLD_IMAGERY.KEY;
    newState.map.baseLayerAutoChangedAbove17 = true;
  }
  return newState;
};

/**
 * Calculates the zoom state from the specified zoom
 * @param {number} zoom
 * @param {Object} newState
 * @param {boolean} init
 * @return The updated map state
 */
const calculateZoomState = (zoom, newState, init = false) => {
  let appliedState = newState;
  appliedState.map.zoomedIcons = getZoomedIcons(zoom);
  appliedState = updateMapTileWithZoom(appliedState);
  if (!init) {
    appliedState = calculateFeatureAvailability(appliedState);
    appliedState = calculateFeatureDataFetches(appliedState);
  }
  return appliedState;
};

// Increment the completed count for overall fetch and, if completed and expected are now equal,
// reset both (so that subsequent batches of fetches can give an accurate progress metric).
const completeOverallFetch = (state) => {
  const newState = { ...state };
  newState.overallFetch.completed += 1;
  if (newState.overallFetch.expected === newState.overallFetch.completed) {
    newState.overallFetch.expected = 0;
    newState.overallFetch.completed = 0;
    newState.overallFetch.pendingHierarchy = 0;
  }
  return newState;
};

// Recursively applies a feature visibility change to children down the tree
const applyFeatureVisibilityToChildren = (state, feature, visible) => {
  if (state.filters.features.visible[feature] === visible) { return state; }
  let newState = { ...state };
  newState.filters.features.visible[feature] = visible;
  if (FEATURES[feature].type === FEATURE_TYPES.GROUP.KEY) {
    Object.keys(FEATURES)
      .filter((f) => FEATURES[f].parent === feature)
      .forEach((f) => {
        newState = applyFeatureVisibilityToChildren(newState, f, visible);
      });
  }
  return newState;
};

// Recursively applies a feature visibility change to parents up the tree
const applyFeatureVisibilityToParents = (state, feature) => {
  let newState = { ...state };
  if (FEATURES[feature].parent) {
    const parentVisible = Object.keys(FEATURES)
      .filter((f) => FEATURES[f].parent === FEATURES[feature].parent) // Of all children...
      .some((f) => newState.filters.features.visible[f]); // ...some child is visible
    newState.filters.features.visible[FEATURES[feature].parent] = parentVisible;
    newState = applyFeatureVisibilityToParents(newState, FEATURES[feature].parent);
  }
  return newState;
};

// Returns a boolean describing whether a fetch status was updated
const setFetchStatusFromAction = (state, action, status) => {
  if (!Object.keys(FETCH_STATUS).includes(status) || status === FETCH_STATUS.AWAITING_CALL) {
    return state;
  }
  const { dataSource } = action;
  if (!FEATURE_DATA_SOURCES[dataSource]) { return state; }

  const newState = { ...state };

  // ARCGIS_ASSETS_API
  if (dataSource === FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API) {
    const { featureKey, siteCode, data } = action;
    if (!FEATURES[featureKey]) { return newState; }
    if (
      !newState.featureDataFetches[dataSource]
      || !newState.featureDataFetches[dataSource][featureKey]
      || !newState.featureDataFetches[dataSource][featureKey][siteCode]
    ) { return newState; }
    newState.featureDataFetches[dataSource][featureKey][siteCode] = status;
    // If the status is SUCCESS and the action has data, also commit the data
    if (status === FETCH_STATUS.SUCCESS && data) {
      const { type: featureType } = FEATURES[featureKey];
      newState.featureData[featureType][featureKey][siteCode] = data;
    }
    return newState;
  }

  // REST_LOCATIONS_API
  if (dataSource === FEATURE_DATA_SOURCES.REST_LOCATIONS_API) {
    const {
      featureKey,
      siteCode,
      location,
      data,
    } = action;
    if (!FEATURES[featureKey]) { return newState; }
    const { type: featureType } = FEATURES[featureKey];
    if (
      !newState.featureDataFetches[dataSource]
      || !newState.featureDataFetches[dataSource][featureKey]
      || !newState.featureDataFetches[dataSource][featureKey][siteCode]
      || !newState.featureDataFetches[dataSource][featureKey][siteCode][location]
    ) {
      return newState;
    }
    newState.featureDataFetches[dataSource][featureKey][siteCode][location] = status;
    // If the status is SUCCESS and the action has data, also commit the data
    if (status === FETCH_STATUS.SUCCESS && data) {
      if (!newState.featureData[featureType][featureKey][siteCode]) {
        newState.featureData[featureType][featureKey][siteCode] = {};
      }
      newState.featureData[featureType][featureKey][siteCode][location] = {
        ...data,
        siteCode,
        featureKey,
        name: location,
        domainCode: state.sites[siteCode].domainCode,
        stateCode: state.sites[siteCode].stateCode,
      };
    }
    return newState;
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
    ) { return newState; }
    newState.featureDataFetches[dataSource][minZoom][siteCode].fetches[fetchId].status = status;
    // If the status is SUCCESS and the action has data, also commit the data
    if (status === FETCH_STATUS.SUCCESS && data) {
      // Make a map of location names to feature keys for this fetchId
      const { features } = newState.featureDataFetches[dataSource][minZoom][siteCode];
      const locNamesToFeatures = {};
      Object.keys(features)
        .filter((featureKey) => features[featureKey].fetchId === fetchId)
        .forEach((featureKey) => {
          features[featureKey].locations.forEach((locName) => {
            // For *_BASE_PLOT features, which both have the same API locationType, determine
            // which locations go to which feature by looking at the plotType in the data
            if (isBasePlot(featureKey)) {
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
      const checkSamplingPointGeo = {};
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
          const coordIdx = matchLocationCoordinateMap.findIndex(
            (match) => locName.endsWith(match),
          );
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
          // Check for valid location data
          if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            return;
          }
          // Initialize the geometry.coordinates with as many empty points as expressed by the map
          if (!parentSiteData[parentLocName].geometry) {
            parentSiteData[parentLocName].geometry = { coordinates: [] };
            for (let c = 0; c < matchLocationCoordinateMap.length; c += 1) {
              parentSiteData[parentLocName].geometry.coordinates.push([]);
            }
          }
          parentSiteData[parentLocName].geometry.coordinates[coordIdx] = [latitude, longitude];
          const k = `${parentDataFeatureType}::${parentDataFeatureKey}::${siteCode}::${parentLocName}`;
          checkSamplingPointGeo[k] = {
            parentDataFeatureType,
            parentDataFeatureKey,
            siteCode,
            parentLocName,
            data: parentSiteData[parentLocName],
          };
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
        // Base plot features: also pull sampling module data from the hierarchy
        if (isBasePlot(featureKey)) {
          const hierarchy = newState.featureData[FEATURE_TYPES.SITE_LOCATION_HIERARCHIES.KEY][siteCode]; // eslint-disable-line max-len
          const basePlot = locName.replace('all', '').replace('.', '\\.');
          const basePlotRegex = new RegExp(`^${basePlot}([a-z]{3})$`);
          newState.featureData[featureType][featureKey][siteCode][locName].samplingModules = (
            Object.keys(hierarchy).reduce((acc, cur) => {
              const match = cur.match(basePlotRegex);
              if (match) { acc.push(match[1]); }
              return acc;
            }, [])
              .filter((k) => k !== 'all' && k !== 'mfb' && PLOT_SAMPLING_MODULES[k])
              .sort((a, b) => (
                (PLOT_SAMPLING_MODULES[a] > PLOT_SAMPLING_MODULES[b]) ? 1 : -1
              ))
          );
        }
      });
      // If we could not identify a full set of valid points for
      // defining the sample point boundary polygon, do not plot, reset coords
      Object.keys(checkSamplingPointGeo).forEach((k) => {
        const s = checkSamplingPointGeo[k];
        let resetCoords = false;
        let hasIncompleteValidSamplingPoints = false;
        if (!s.data.geometry) {
          resetCoords = true;
        } else {
          resetCoords = !s.data.geometry.coordinates.every((c) => (
            Array.isArray(c) && (c.length === 2)
          ));
          hasIncompleteValidSamplingPoints = resetCoords;
        }
        if (resetCoords) {
          // eslint-disable-next-line max-len
          const v = newState.featureData[s.parentDataFeatureType][s.parentDataFeatureKey][s.siteCode][s.parentLocName];
          v.geometry = { coordinates: [] };
          if (hasIncompleteValidSamplingPoints) {
            v.hasIncompleteValidSamplingPoints = true;
          }
        }
      });
    }
    return newState;
  }

  return newState;
};

/**
   Reducer
*/
const reducer = (state, action) => {
  let setMethod = null;
  let newState = { ...state };
  const { validSet } = state.selection;

  // Shortcuts for dealing with hierarchies
  const hierarchiesSource = FEATURE_DATA_SOURCES.REST_LOCATIONS_API;
  const hierarchiesType = FEATURE_TYPES.SITE_LOCATION_HIERARCHIES.KEY;
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
      newState = calculateZoomState(action.zoom, newState);
      return newState;

    case 'setMapBounds':
      if (!boundsAreValid(action.bounds)) { return state; }
      newState.map.bounds = action.bounds;
      return calculateFeatureDataFetches(newState);

    case 'setMapCenter':
      if (!centerIsValid(action.center)) { return state; }
      if (boundsAreValid(action.bounds)) { newState.map.bounds = action.bounds; }
      newState.map.center = [...action.center];
      return calculateFeatureDataFetches(newState);

    case 'setMapBaseLayer':
      if (action.baseLayer !== null && !Object.keys(BASE_LAYERS).includes(action.baseLayer)) {
        return state;
      }
      newState.map.baseLayer = action.baseLayer;
      return newState;

    case 'setMapOverlayVisibility':
      if (!OVERLAYS[action.overlay]) { return state; }
      if (action.visible) {
        newState.map.overlays.add(action.overlay);
        newState.filters.overlays.expanded.add(action.overlay);
      } else {
        newState.map.overlays.delete(action.overlay);
        newState.filters.overlays.expanded.delete(action.overlay);
      }
      return newState;

    case 'setMapOverlays':
      if (!Array.isArray(action.overlays) || !action.overlays.every((o) => OVERLAYS[o])) {
        return state;
      }
      newState.map.overlays = new Set(action.overlays);
      newState.filters.overlays.expanded = new Set(action.overlays);
      return newState;

    case 'setMapRepositionOpenPopupFunc':
      newState.map.repositionOpenPopupFunc = typeof action.func === 'function' ? action.func : null;
      return newState;

    case 'showFullObservatory':
      newState.map.center = OBSERVATORY_CENTER;
      newState.map.zoom = deriveFullObservatoryZoomLevel(action.mapRef);
      return newState;

    case 'setMapMouseMode':
      if (!Object.keys(MAP_MOUSE_MODES).includes(action.mouseMode)) { return state; }
      newState.map.mouseMode = action.mouseMode;
      return newState;

    // Legend
    case 'setLegendOpen':
      newState.filters.legendOpen = !!action.open;
      return newState;

    case 'setLegendFeatureOptionVisibility':
      if (
        !Object.keys(FEATURES).includes(action.feature) || typeof action.visible !== 'boolean'
      ) { return state; }
      newState = applyFeatureVisibilityToChildren(newState, action.feature, action.visible);
      newState = applyFeatureVisibilityToParents(newState, action.feature);
      newState = calculateFeatureDataFetches(newState);
      return newState;

    case 'setLegendFeatureOptionCollapsed':
      if (!Object.keys(FEATURES).includes(action.feature)) { return state; }
      newState.filters.features.collapsed.add(action.feature);
      return newState;

    case 'setLegendFeatureOptionExpanded':
      if (!Object.keys(FEATURES).includes(action.feature)) { return state; }
      newState.filters.features.collapsed.delete(action.feature);
      return newState;

    case 'setLegendOverlayOptionCollapsed':
      if (!Object.keys(OVERLAYS).includes(action.overlay)) { return state; }
      newState.filters.overlays.expanded.delete(action.overlay);
      return newState;

    case 'setLegendOverlayOptionExpanded':
      if (!Object.keys(OVERLAYS).includes(action.overlay)) { return state; }
      newState.filters.overlays.expanded.add(action.overlay);
      return newState;

    // Focus Location
    case 'setNewFocusLocation':
      newState.focusLocation.fetch = { status: FETCH_STATUS.AWAITING_CALL, error: null };
      newState.focusLocation.current = action.location;
      newState.focusLocation.data = null;
      newState.overallFetch.expected += 1;
      // Switch view to MAP if we're on TABLE (and not on SPLIT)
      if (newState.view.current === VIEWS.TABLE) { newState.view.current = VIEWS.MAP; }
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
      newState = completeOverallFetch(newState);
      return newState;

    case 'setFocusLocationFetchSucceeded':
      newState.focusLocation.fetch = { status: FETCH_STATUS.SUCCESS, error: null };
      newState.focusLocation.data = action.data;
      // For STATE and DOMAIN types: ensure corresponding feature is visible
      if (newState.focusLocation.data.type === 'STATE') {
        newState.filters.features.visible[FEATURES.STATES.KEY] = true;
        newState.filters.features.visible[FEATURES.DOMAINS.KEY] = false;
      }
      if (newState.focusLocation.data.type === 'DOMAIN') {
        newState.filters.features.visible[FEATURES.DOMAINS.KEY] = true;
        newState.filters.features.visible[FEATURES.STATES.KEY] = false;
      }
      newState = completeOverallFetch(newState);
      newState.map = getMapStateForFocusLocation(newState);
      newState.focusLocation.map.zoom = newState.map.zoom;
      newState.focusLocation.map.center = [...newState.map.center];
      newState = updateMapTileWithZoom(newState);
      newState = calculateFeatureAvailability(newState);
      newState = calculateFeatureDataFetches(
        newState, (
          newState.focusLocation.data && newState.focusLocation.data.siteCode
            ? [newState.focusLocation.data.siteCode] : []
        ),
      );
      return newState;

    case 'returnToFocusLocation':
      if (!state.focusLocation.current || !state.focusLocation.data) { return state; }
      // For STATE and DOMAIN types: ensure corresponding feature is visible
      if (newState.focusLocation.data.type === 'STATE') {
        newState.filters.features.visible[FEATURES.STATES.KEY] = true;
        newState.filters.features.visible[FEATURES.DOMAINS.KEY] = false;
      }
      if (newState.focusLocation.data.type === 'DOMAIN') {
        newState.filters.features.visible[FEATURES.DOMAINS.KEY] = true;
        newState.filters.features.visible[FEATURES.STATES.KEY] = false;
      }
      newState.map = getMapStateForFocusLocation(state);
      newState = updateMapTileWithZoom(newState);
      newState = calculateFeatureAvailability(newState);
      newState = calculateFeatureDataFetches(
        newState, (
          newState.focusLocation.data && newState.focusLocation.data.siteCode
            ? [newState.focusLocation.data.siteCode] : []
        ),
      );
      return newState;

    // Fetch and Import
    case 'awaitingFeatureDataFetchesTriggered':
      return { ...state, featureDataFetchesHasAwaiting: false };

    case 'setFeatureDataFetchStarted':
      return setFetchStatusFromAction(newState, action, FETCH_STATUS.FETCHING);

    case 'setFeatureDataFetchSucceeded':
      newState = setFetchStatusFromAction(newState, action, FETCH_STATUS.SUCCESS);
      newState = completeOverallFetch(newState);
      if (newState.overallFetch.expected === 0) {
        newState = calculateFeatureDataFetches(newState);
      }
      return newState;

    case 'setFeatureDataFetchFailed':
      newState = setFetchStatusFromAction(newState, action, FETCH_STATUS.ERROR);
      newState = completeOverallFetch(newState);
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
        || !action.data
      ) { return state; }
      /* eslint-disable max-len */
      newState.featureDataFetches[hierarchiesSource][hierarchiesType][action.domainCode] = FETCH_STATUS.SUCCESS;
      Object.keys(action.data).forEach((siteCode) => {
        newState.featureData.SITE_LOCATION_HIERARCHIES[siteCode] = action.data[siteCode];
      });
      /* eslint-enable max-len */
      newState.overallFetch.pendingHierarchy -= 1;
      newState = completeOverallFetch(newState);
      newState = calculateFeatureDataFetches(
        newState, (
          mapIsAtFocusLocation(state)
            && newState.focusLocation.data
            && newState.focusLocation.data.siteCode
            ? [newState.focusLocation.data.siteCode] : []
        ),
      );
      return newState;

    case 'setDomainLocationHierarchyFetchFailed':
      /* eslint-disable max-len */
      if (!newState.featureDataFetches[hierarchiesSource][hierarchiesType][action.domainCode]) { return state; }
      newState.featureDataFetches[hierarchiesSource][hierarchiesType][action.domainCode] = FETCH_STATUS.ERROR;
      /* eslint-enable max-len */
      newState.overallFetch.pendingHierarchy -= 1;
      newState = completeOverallFetch(newState);
      return newState;

    // Selection
    case 'setHideUnselectable':
      newState.selection.hideUnselectable = !!action.hideUnselectable;
      return newState;

    case 'toggleSelectionSummary':
      newState.selection.showSummary = !!action.showSummary;
      return newState;

    case 'selectionOnChangeTriggered':
      newState.selection.changed = false;
      return newState;

    case 'updateSelectionSet':
      if (
        !action.selection || !action.selection.constructor
        || action.selection.constructor.name !== 'Set'
      ) { return state; }
      newState.selection.set = getSelectableSet(action.selection, validSet);
      newState.selection.changed = true;
      newState = validateSelection(newState);
      if (FEATURE_TYPES[newState.selection.active].deriveRegionSelections) {
        newState = deriveRegionSelections(newState);
      }
      return newState;

    case 'toggleItemSelected':
      // Special case: when the selectionLimit is 1 always maintain a selection size of 1
      if (newState.selection.limit === 1 && isSelectable(action.item, validSet)) {
        if (newState.selection.set.has(action.item)) {
          newState.selection.set.delete(action.item);
          newState.selection.changed = true;
        } else {
          newState.selection.set = new Set([action.item]);
          newState.selection.changed = true;
        }
      } else if (newState.selection.set.has(action.item)) {
        newState.selection.set.delete(action.item);
        newState.selection.changed = true;
      } else if (isSelectable(action.item, validSet)) {
        newState.selection.set.add(action.item);
        newState.selection.changed = true;
      }
      newState = validateSelection(newState);
      if (FEATURE_TYPES[newState.selection.active].deriveRegionSelections) {
        newState = deriveRegionSelections(newState);
      }
      return newState;

    case 'toggleSitesSelectedForState':
      if (!action.stateCode) { return state; }
      setMethod = (
        state.selection.derived[FEATURES.STATES.KEY][action.stateCode] === SELECTION_PORTIONS.TOTAL
          ? 'delete' : 'add'
      );
      getSelectableSet(
        newState.featureData[FEATURE_TYPES.STATES.KEY][FEATURES.STATES.KEY][action.stateCode].sites,
        validSet,
      ).forEach((siteCode) => {
        newState.selection.set[setMethod](siteCode);
      });
      newState.selection.changed = true;
      newState = validateSelection(newState);
      newState = deriveRegionSelections(newState);
      return newState;

    case 'toggleSitesSelectedForDomain':
      if (!action.domainCode) { return state; }
      /* eslint-disable max-len */
      setMethod = (
        state.selection.derived[FEATURES.DOMAINS.KEY][action.domainCode] === SELECTION_PORTIONS.TOTAL
          ? 'delete' : 'add'
      );
      getSelectableSet(
        newState.featureData[FEATURE_TYPES.DOMAINS.KEY][FEATURES.DOMAINS.KEY][action.domainCode].sites,
        validSet,
      ).forEach((siteCode) => {
        newState.selection.set[setMethod](siteCode);
      });
      /* eslint-enable max-len */
      newState.selection.changed = true;
      newState = validateSelection(newState);
      newState = deriveRegionSelections(newState);
      return newState;

    // Default
    default:
      return state;
  }
};

/** Context and Hook */
const Context = createContext(getDefaultState());
const useSiteMapContext = () => {
  const hookResponse = useContext(Context);
  if (hookResponse.length !== 2) {
    return [getDefaultState(), () => { }];
  }
  return hookResponse;
};

/**
 * Defines a lookup of state key to a boolean
 * designating whether or not that instance of the context
 * should pull the state from the session storage and restore.
 * Keeping this lookup outside of the context provider function
 * as to not incur lifecycle interference by storing with useState.
 */
const restoreStateLookup = {};

/** Context Provider */
const Provider = (props) => {
  const {
    view,
    aspectRatio,
    fullscreen,
    mapUniqueId,
    mapZoom,
    mapCenter,
    mapBaseLayer,
    location: locationProp,
    selection,
    validItems,
    selectedItems,
    selectionLimit,
    onSelectionChange,
    tableFullHeight,
    manualLocationData,
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
  let initialState = getDefaultState();
  initialState.view.current = (
    Object.keys(VIEWS).includes(view.toUpperCase()) ? view.toUpperCase() : VIEWS.MAP
  );
  initialState.fullscreen = fullscreen;
  initialState.map = {
    ...initialState.map,
    zoom: initialMapZoom,
    center: mapCenter,
    baseLayer: mapBaseLayer,
  };
  if (tableFullHeight) {
    initialState.table.fullHeight = true;
  }
  if (typeof locationProp === 'string') {
    initialState.focusLocation.current = locationProp;
    initialState.focusLocation.fetch.status = FETCH_STATUS.AWAITING_CALL;
    initialState.overallFetch.expected += 1;
  }
  if (typeof aspectRatio === 'number' && aspectRatio > 0) {
    initialState.aspectRatio.isDynamic = false;
    initialState.aspectRatio.currentValue = aspectRatio;
  }
  if (Object.keys(FEATURE_TYPES).filter((k) => FEATURE_TYPES[k].selectable).includes(selection)) {
    initialState.selection.active = selection;
    initialState.selection.limit = selectionLimit;
    initialState.selection.onChange = onSelectionChange;
    initialState.selection.set = new Set(selectedItems);
    if (Array.isArray(validItems)) {
      initialState.selection.validSet = new Set(validItems);
    }
    initialState.selection.changed = true;
    initialState = validateSelection(initialState);
    // Automatically set feature visibility, table view, etc. based on selection type
    switch (selection) {
      case FEATURE_TYPES.STATES.KEY:
        initialState.filters.features.visible[FEATURES.STATES.KEY] = true;
        initialState.filters.features.visible[FEATURES.DOMAINS.KEY] = false;
        break;
      case FEATURE_TYPES.DOMAINS.KEY:
        initialState.filters.features.visible[FEATURES.DOMAINS.KEY] = true;
        initialState.filters.features.visible[FEATURES.STATES.KEY] = false;
        break;
      default:
        break;
    }
  }
  if (Array.isArray(manualLocationData) && manualLocationData.length > 0) {
    initialState.manualLocationData = manualLocationData;
  }

  // get the initial state from storage if present
  const stateKey = `siteMapContextState-${mapUniqueId}`;
  if (typeof restoreStateLookup[stateKey] === 'undefined') {
    restoreStateLookup[stateKey] = true;
  }
  const shouldRestoreState = restoreStateLookup[stateKey];
  const stateStorage = makeStateStorage(stateKey);
  const savedState = stateStorage.readState();

  if (neonContextIsFinal && !neonContextHasError && !savedState) {
    initialState = hydrateNeonContextData(initialState, neonContextData);
  }
  const hasInitialZoom = (typeof mapZoom === 'number') && zoomIsValid(mapZoom);
  if (hasInitialZoom && !savedState) {
    initialState = calculateZoomState(initialMapZoom, initialState, true);
  }

  if (savedState && shouldRestoreState) {
    restoreStateLookup[stateKey] = false;
    const restoredState = convertStateFromStorage(savedState, initialState);
    stateStorage.removeState();
    initialState = calculateZoomState(restoredState.map.zoom, restoredState, true);
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  // The current sign in process uses a separate domain. This function
  // persists the current state in storage when the button is clicked
  // so the state may be reloaded when the page is reloaded after sign
  // in.
  useEffect(() => {
    const subscription = NeonSignInButtonState.getObservable().subscribe({
      next: () => {
        if (!NeonEnvironment.enableGlobalSignInState) return;
        restoreStateLookup[stateKey] = false;
        stateStorage.saveState(convertStateForStorage(state));
      },
    });
    return () => { subscription.unsubscribe(); };
  }, [state, stateStorage, stateKey]);

  const canFetchFeatureData = (
    state.neonContextHydrated
    && !(state.focusLocation.current && state.focusLocation.fetch.status !== FETCH_STATUS.SUCCESS)
  );

  /**
     Effect - trigger focusLocation fetch or short circuit if found in NeonContext or manual data
  */
  useEffect(() => {
    const noop = () => { };
    const { current, fetch: { status: currentStatus } } = state.focusLocation;
    if (!current || currentStatus !== FETCH_STATUS.AWAITING_CALL || !state.neonContextHydrated) {
      return noop;
    }
    // If the location is a known Domain, State, or Site then pull from NeonContext
    const {
      [FEATURES.STATES.KEY]: statesData = {},
    } = state.featureData[FEATURE_TYPES.STATES.KEY];
    const {
      [FEATURES.DOMAINS.KEY]: domainsData = {},
    } = state.featureData[FEATURE_TYPES.DOMAINS.KEY];
    if (Object.keys(statesData).includes(current)) {
      const { 0: latitude, 1: longitude } = statesData[current].center;
      const timeout = window.setTimeout(() => {
        dispatch({
          type: 'setFocusLocationFetchSucceeded',
          data: { type: 'STATE', latitude, longitude },
        });
      }, 0);
      return () => window.clearTimeout(timeout);
    }
    if (Object.keys(domainsData).includes(current)) {
      const { 0: latitude, 1: longitude } = domainsData[current].center;
      const timeout = window.setTimeout(() => {
        dispatch({
          type: 'setFocusLocationFetchSucceeded',
          data: { type: 'DOMAIN', latitude, longitude },
        });
      }, 0);
      return () => window.clearTimeout(timeout);
    }
    if (Object.keys(state.sites).includes(current)) {
      const { latitude, longitude } = state.sites[current];
      const timeout = window.setTimeout(() => {
        dispatch({
          type: 'setFocusLocationFetchSucceeded',
          data: { type: 'SITE', latitude, longitude },
        });
      }, 0);
      return () => window.clearTimeout(timeout);
    }
    // If the location is found in manualLocationData then pull from there
    if (state.manualLocationData) {
      const manualSite = state.manualLocationData.find((ml) => ml.siteCode === current);
      if (manualSite) {
        const { latitude, longitude } = manualSite;
        const timeout = window.setTimeout(() => {
          dispatch({
            type: 'setFocusLocationFetchSucceeded',
            data: { type: 'SITE', latitude, longitude },
          });
        }, 0);
        return () => window.clearTimeout(timeout);
      }
    }
    // Trigger focus location fetch
    dispatch({ type: 'setFocusLocationFetchStarted' });
    fetchManyLocationsGraphQL([current])
      .then((response) => {
        dispatch({ type: 'setFocusLocationFetchSucceeded', data: response[current] });
      })
      .catch((error) => {
        dispatch({ type: 'setFocusLocationFetchFailed', error });
      });
    return noop;
  }, [
    state.sites,
    state.focusLocation,
    state.focusLocation.fetch.status,
    state.neonContextHydrated,
    state.manualLocationData,
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
    const hierarchiesType = FEATURE_TYPES.SITE_LOCATION_HIERARCHIES.KEY;
    Object.keys(state.featureDataFetches[hierarchiesSource][hierarchiesType])
      .forEach((domainCode) => {
        if (state.featureDataFetches[hierarchiesSource][hierarchiesType][domainCode] !== FETCH_STATUS.AWAITING_CALL) { return; } // eslint-disable-line max-len
        dispatch({ type: 'setDomainLocationHierarchyFetchStarted', domainCode });
        fetchDomainHierarchy(domainCode)
          .then((response) => {
            dispatch({
              type: 'setDomainLocationHierarchyFetchSucceeded',
              data: response,
              domainCode,
            });
          })
          .catch((error) => {
            dispatch({
              type: 'setDomainLocationHierarchyFetchFailed',
              error,
              domainCode,
            });
          });
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

    // REST_LOCATIONS_API Fetches
    const restLocSource = FEATURE_DATA_SOURCES.REST_LOCATIONS_API;
    const restLocFetches = state.featureDataFetches[restLocSource];
    Object.keys(restLocFetches)
      .filter((featureKey) => featureKey !== FEATURE_TYPES.SITE_LOCATION_HIERARCHIES.KEY)
      .forEach((featureKey) => {
        Object.keys(state.featureDataFetches[restLocSource][featureKey]).forEach((siteCode) => {
          const featureSite = state.featureDataFetches[restLocSource][featureKey][siteCode];
          Object.keys(featureSite).forEach((location) => {
            if (featureSite[location] !== FETCH_STATUS.AWAITING_CALL) { return; }
            dispatch({
              type: 'setFeatureDataFetchStarted',
              dataSource: restLocSource,
              featureKey,
              siteCode,
              location,
            });
            fetchSingleLocationREST(location)
              .then((data) => {
                dispatch({
                  type: 'setFeatureDataFetchSucceeded',
                  dataSource: restLocSource,
                  data,
                  featureKey,
                  siteCode,
                  location,
                });
              })
              .catch((error) => {
                dispatch({
                  type: 'setFeatureDataFetchFailed',
                  dataSource: restLocSource,
                  error: error.message,
                  featureKey,
                  siteCode,
                  location,
                });
              });
          });
        });
      });

    // GRAPHQL_LOCATIONS_API Fetches
    const gqlLocSource = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
    const gqlLocFetches = state.featureDataFetches[gqlLocSource];
    Object.keys(gqlLocFetches).forEach((minZoom) => {
      Object.keys(gqlLocFetches[minZoom]).forEach((siteCode) => {
        Object.keys(gqlLocFetches[minZoom][siteCode].fetches)
          .filter((fetchId) => (
            gqlLocFetches[minZoom][siteCode].fetches[fetchId].status === FETCH_STATUS.AWAITING_CALL
          ))
          .forEach((fetchId) => {
            dispatch({
              type: 'setFeatureDataFetchStarted',
              dataSource: gqlLocSource,
              minZoom,
              siteCode,
              fetchId,
            });
            fetchManyLocationsGraphQL(gqlLocFetches[minZoom][siteCode].fetches[fetchId].locations)
              .then((response) => {
                dispatch({
                  type: 'setFeatureDataFetchSucceeded',
                  dataSource: gqlLocSource,
                  minZoom,
                  siteCode,
                  fetchId,
                  data: response,
                });
              })
              .catch((error) => {
                dispatch({
                  type: 'setFeatureDataFetchFailed',
                  dataSource: gqlLocSource,
                  minZoom,
                  siteCode,
                  fetchId,
                  error,
                });
              });
          });
      });
    });

    dispatch({ type: 'awaitingFeatureDataFetchesTriggered' });
  }, [canFetchFeatureData, state.featureDataFetchesHasAwaiting, state.featureDataFetches]);

  /**
     Effect - trigger onChange for selection whenever selection has changed
  */
  useEffect(() => {
    if (state.selection.changed) {
      state.selection.onChange(state.selection);
    }
    dispatch({ type: 'selectionOnChangeTriggered' });
  }, [state.selection, state.selection.changed]);

  /**
     Render
  */
  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
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

// Additional items exported for unit testing
export const getTestableItems = () => (
  process.env.NODE_ENV !== 'test' ? {} : {
    deriveRegionSelections,
    isSelectable,
    getSelectableSet,
    validateSelection,
    isBasePlot,
    zoomIsValid,
    centerIsValid,
    calculateFeatureDataFetches,
    updateMapTileWithZoom,
    completeOverallFetch,
    applyFeatureVisibilityToChildren,
    applyFeatureVisibilityToParents,
    setFetchStatusFromAction,
    reducer,
  }
);
