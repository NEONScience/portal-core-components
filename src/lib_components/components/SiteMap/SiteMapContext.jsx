import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import cloneDeep from 'lodash/cloneDeep';

import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import NeonApi from '../NeonApi/NeonApi';
import NeonContext from '../NeonContext/NeonContext';

import SiteMapDeferredJson from './SiteMapDeferredJson';
import {
  DEFAULT_STATE,
  SORT_DIRECTIONS,
  TILE_LAYERS,
  VIEWS,
  FEATURES,
  FETCH_STATUS,
  FEATURE_TYPES,
  FEATURE_DATA_LOAD_TYPES,
  SELECTABLE_FEATURE_TYPES,
  SITE_LOCATION_HIERARCHIES_MIN_ZOOM,
  MAP_ZOOM_RANGE,
  OBSERVATORY_CENTER,
  PLOT_SAMPLING_MODULES,
  SITE_MAP_PROP_TYPES,
  SITE_MAP_DEFAULT_PROPS,
  MIN_TABLE_MAX_BODY_HEIGHT,
  hydrateNeonContextData,
  parseLocationHierarchy,
  parseLocationData,
  getZoomedIcons,
  getMapStateForFocusLocation,
  calculateFeatureAvailability,
  boundsAreValid,
  calculateLocationsInMap,
  deriveFullObservatoryZoomLevel,
} from './SiteMapUtils';

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
    Array.from(domainsInMap).forEach((domainCode) => {
      if (newState.featureDataFetches.SITE_LOCATION_HIERARCHIES[domainCode]) { return; }
      newState.featureDataFetches.SITE_LOCATION_HIERARCHIES[domainCode] = FETCH_STATUS.AWAITING_CALL; // eslint-disable-line max-len
      newState.overallFetch.expected += 1;
      newState.overallFetch.pendingHierarchy += 1;
      newState.featureDataFetchesHasAwaiting = true;
    });
  }
  // Feature fetches - IMPORT (deferredJson)
  Object.keys(FEATURES)
    .filter(featureKey => (
      FEATURES[featureKey].dataLoadType === FEATURE_DATA_LOAD_TYPES.IMPORT
        && state.filters.features.available[featureKey]
        && state.filters.features.visible[featureKey]
    ))
    .forEach((featureKey) => {
      const { type: featureType } = FEATURES[featureKey];
      sitesInMap.forEach((siteCode) => {
        if (newState.featureDataFetches[featureType][featureKey][siteCode]) { return; }
        newState.featureDataFetches[featureType][featureKey][siteCode] = FETCH_STATUS.AWAITING_CALL;
        newState.overallFetch.expected += 1;
        newState.featureDataFetchesHasAwaiting = true;
      });
    });
  // Feature fetches - FETCH (Locations API, primary locations)
  Object.keys(FEATURES)
    // Only look at available+visible features that get fetched and have a location type match
    // If fetching for other child features then at least one of them must be available+visible
    .filter((featureKey) => {
      let doFetch = FEATURES[featureKey].dataLoadType === FEATURE_DATA_LOAD_TYPES.FETCH
        && FEATURES[featureKey].matchLocationType
        && state.filters.features.available[featureKey]
        && state.filters.features.visible[featureKey];
      if (doFetch && FEATURES[featureKey].fetchingForFeatures) {
        doFetch = FEATURES[featureKey].fetchingForFeatures.some(fetchingForKey => (
          state.filters.features.available[fetchingForKey]
            && state.filters.features.visible[fetchingForKey]
        ));
      }
      return doFetch;
    })
    .forEach((featureKey) => {
      const { type: featureType, matchLocationType } = FEATURES[featureKey];
      // For each feature that warrants fetching; loop through the sites in the map
      sitesInMap
        // Domain hierarchy must be completed in order to generate subsequent fetches
        // (only true if site location hierarchy feature data is there)
        .filter(siteCode => state.featureData.SITE_LOCATION_HIERARCHIES[siteCode])
        .forEach((siteCode) => {
          if (!newState.featureDataFetches[featureType][featureKey][siteCode]) {
            newState.featureDataFetches[featureType][featureKey][siteCode] = {};
          }
          // Extract matching location IDs from the hierarchy and set them as fetches awaiting call
          const hierarchy = state.featureData.SITE_LOCATION_HIERARCHIES[siteCode];
          const locationIsMatch = matchLocationType instanceof RegExp
            ? (locationKey => matchLocationType.test(hierarchy[locationKey].type))
            : (locationKey => hierarchy[locationKey].type === matchLocationType);
          Object.keys(hierarchy)
            .filter(locationIsMatch)
            .forEach((locationKey) => {
              if (newState.featureDataFetches[featureType][featureKey][siteCode][locationKey]) {
                return;
              }
              newState.featureDataFetches[featureType][featureKey][siteCode][locationKey] = FETCH_STATUS.AWAITING_CALL; // eslint-disable-line max-len
              newState.overallFetch.expected += 1;
              newState.featureDataFetchesHasAwaiting = true;
            });
        });
    });
  // Feature fetches - FETCH (Locations API, sampling points)
  Object.keys(FEATURES)
    // Only look at available+visible features that get fetched and have a parentDataFeature
    .filter(featureKey => (
      FEATURES[featureKey].type === FEATURE_TYPES.SAMPLING_POINTS
        && FEATURES[featureKey].dataLoadType === FEATURE_DATA_LOAD_TYPES.FETCH
        && FEATURES[featureKey].parentDataFeatureKey
        && state.filters.features.available[featureKey]
        && state.filters.features.visible[featureKey]
    ))
    .forEach((featureKey) => {
      const {
        type: featureType,
        parentDataFeatureKey,
        matchLocationPattern,
      } = FEATURES[featureKey];
      const { type: parentDataFeatureType } = FEATURES[parentDataFeatureKey];
      const parentLocations = {};
      Object.keys(state.featureData[parentDataFeatureType][parentDataFeatureKey])
        .forEach((siteCode) => {
          Object.keys(state.featureData[parentDataFeatureType][parentDataFeatureKey][siteCode])
            .forEach((locationCode) => {
              parentLocations[locationCode] = state.featureData[parentDataFeatureType][parentDataFeatureKey][siteCode][locationCode]; // eslint-disable-line max-len
            });
        });
      const locationsInMap = calculateLocationsInMap(parentLocations, state.map.bounds, true);
      if (!locationsInMap) { return; }
      locationsInMap.forEach((locationCode) => {
        if (!parentLocations[locationCode].children) { return; }
        const { siteCode = null } = parentLocations[locationCode];
        if (!newState.featureDataFetches[featureType][featureKey][siteCode]) {
          newState.featureDataFetches[featureType][featureKey][siteCode] = {};
        }
        parentLocations[locationCode].children
          .filter(childLocation => (
            !newState.featureDataFetches[featureType][featureKey][siteCode][childLocation]
              && (!matchLocationPattern || matchLocationPattern.test(childLocation))
          ))
          .forEach((childLocation) => {
            newState.featureDataFetches[featureType][featureKey][siteCode][childLocation] = FETCH_STATUS.AWAITING_CALL; // eslint-disable-line max-len
            newState.overallFetch.expected += 1;
            newState.featureDataFetchesHasAwaiting = true;
          });
      });
    });
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
    const {
      data,
      feature: featureKey,
      siteCode,
      location = null,
    } = action;
    if (!FEATURES[featureKey]) { return false; }
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
      if (!newState.featureDataFetches.SITE_LOCATION_HIERARCHIES[action.domainCode]) { return state; }
      newState.featureDataFetches.SITE_LOCATION_HIERARCHIES[action.domainCode] = FETCH_STATUS.FETCHING;
      /* eslint-enable max-len */
      return newState;

    case 'setDomainLocationHierarchyFetchSucceeded':
      if (
        !newState.featureDataFetches.SITE_LOCATION_HIERARCHIES[action.domainCode]
          || !Array.isArray(action.data.locationChildHierarchy)
      ) { return state; }
      /* eslint-disable max-len */
      newState.featureDataFetches.SITE_LOCATION_HIERARCHIES[action.domainCode] = FETCH_STATUS.SUCCESS;
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
      if (!newState.featureDataFetches.SITE_LOCATION_HIERARCHIES[action.domainCode]) { return state; }
      newState.featureDataFetches.SITE_LOCATION_HIERARCHIES[action.domainCode] = FETCH_STATUS.ERROR;
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
    // Special case: fetch site-location hierarchies. These are not features themselves
    // but constitute critical data in order to generate feature fetches within sites
    Object.keys(state.featureDataFetches.SITE_LOCATION_HIERARCHIES).forEach((domainCode) => {
      if (state.featureDataFetches.SITE_LOCATION_HIERARCHIES[domainCode] !== FETCH_STATUS.AWAITING_CALL) { return; } // eslint-disable-line max-len
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
    // All other feature-based fetches
    Object.keys(state.featureDataFetches)
      .filter(type => type !== FEATURE_TYPES.SITE_LOCATION_HIERARCHIES)
      .forEach((type) => {
        Object.keys(state.featureDataFetches[type]).forEach((feature) => {
          const { dataLoadType } = FEATURES[feature];
          Object.keys(state.featureDataFetches[type][feature]).forEach((siteCode) => {
            const featureSite = state.featureDataFetches[type][feature][siteCode];
            // IMPORT - Fetch via SiteMapDeferredJson
            if (dataLoadType === FEATURE_DATA_LOAD_TYPES.IMPORT) {
              if (featureSite !== FETCH_STATUS.AWAITING_CALL) { return; }
              dispatch({ type: 'setFeatureDataFetchStarted', feature, siteCode });
              const onSuccess = data => dispatch({
                type: 'setFeatureDataFetchSucceeded',
                feature,
                siteCode,
                data,
              });
              const onError = error => dispatch({
                type: 'setFeatureDataFetchFailed',
                feature,
                siteCode,
                error,
              });
              SiteMapDeferredJson(feature, siteCode, onSuccess, onError);
            }
            // FETCH - Fetch via the Locations API
            if (dataLoadType === FEATURE_DATA_LOAD_TYPES.FETCH) {
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
