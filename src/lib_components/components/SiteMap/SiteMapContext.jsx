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
  SITE_MAP_PROP_TYPES,
  SITE_MAP_DEFAULT_PROPS,
  hydrateNeonContextData,
  parseLocationHierarchy,
  parseLocationData,
  getZoomedIcons,
  getMapStateForFoucusLocation,
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
const boundsAreValid = bounds => (
  typeof bounds === 'object' && bounds !== null
    && Object.keys(bounds).every(key => (
      ['lat', 'lng'].includes(key) && Array.isArray(bounds[key]) && bounds[key].length === 2
        && bounds[key].every(v => typeof v === 'number') && bounds[key][1] > bounds[key][0]
    ))
);
const calculateFeatureAvailability = (state) => {
  const featureIsAvailable = feature => (!(
    (typeof feature.minZoom === 'number' && state.map.zoom < feature.minZoom)
      || (typeof feature.maxZoom === 'number' && state.map.zoom > feature.maxZoom)
      || (typeof feature.parent === 'string' && !featureIsAvailable(FEATURES[feature.parent]))
  ));
  return {
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
};
const calculateSitesInMap = (state) => {
  const { map: { bounds } } = state;
  if (!bounds) { return []; }
  const extendedBounds = Object.fromEntries(
    Object.keys(bounds)
      .map((dir) => {
        const buffer = (bounds[dir][1] - bounds[dir][0]) / 2;
        return [
          dir,
          [bounds[dir][0] - buffer, bounds[dir][1] + buffer],
        ];
      }),
  );
  const siteIsInBounds = site => (
    Number.isFinite(site.latitude) && Number.isFinite(site.longitude)
      && site.latitude >= extendedBounds.lat[0] && site.latitude <= extendedBounds.lat[1]
      && site.longitude >= extendedBounds.lng[0] && site.longitude <= extendedBounds.lng[1]
  );
  return Object.keys(state.featureData[FEATURE_TYPES.SITES])
    .filter(siteCode => siteIsInBounds(state.featureData[FEATURE_TYPES.SITES][siteCode]));
};
const calculateFeatureDataFetches = (state) => {
  const sitesInMap = calculateSitesInMap(state);
  if (!sitesInMap) { return state; }
  const domainsInMap = new Set();
  sitesInMap
    .filter(siteCode => state.featureData.SITES[siteCode])
    .forEach((siteCode) => {
      domainsInMap.add(state.featureData.SITES[siteCode].domainCode);
    });
  const newState = { ...state };
  // Domain-location hierarchy fetches for individual domains
  if (state.map.zoom >= SITE_LOCATION_HIERARCHIES_MIN_ZOOM) {
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
  // Feature fetches - FETCH (Locations API)
  Object.keys(FEATURES)
    // Only look at available+visible features that get fetched and have a location type match
    .filter(featureKey => (
      FEATURES[featureKey].dataLoadType === FEATURE_DATA_LOAD_TYPES.FETCH
        && FEATURES[featureKey].matchLocationType
        && state.filters.features.available[featureKey]
        && state.filters.features.visible[featureKey]
    ))
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
    const { type: featureType } = FEATURES[featureKey];
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
      }
      if (!newState.featureData[dataFeatureType][dataFeatureKey]) {
        newState.featureData[dataFeatureType][dataFeatureKey] = {};
      }
      if (!newState.featureData[dataFeatureType][dataFeatureKey][siteCode]) {
        newState.featureData[dataFeatureType][dataFeatureKey][siteCode] = {};
      }
      newState.featureData[dataFeatureType][dataFeatureKey][siteCode][location] = parsedData;
    }
    return true;
  };
  switch (action.type) {
    case 'setView':
      if (!Object.keys(VIEWS).includes(action.view)) { return state; }
      newState.view = action.view;
      return newState;

    case 'setAspectRatio':
      if (typeof action.aspectRatio !== 'number' || action.aspectRatio <= 0) { return state; }
      newState.aspectRatio.currentValue = action.aspectRatio;
      return newState;

    case 'hydrateNeonContextData':
      if (!action.neonContextData) { return state; }
      return hydrateNeonContextData(newState, action.neonContextData);

    // Map
    case 'setMapZoom':
      if (!zoomIsValid(action.zoom)) { return state; }
      newState.map.zoom = action.zoom;
      if (centerIsValid(action.center)) { newState.map.center = action.center; }
      if (boundsAreValid(action.bounds)) { newState.map.bounds = action.bounds; }
      newState.map.zoomedIcons = getZoomedIcons(newState.map.zoom);
      // NATGEO_WORLD_MAP has no data at zoom 17 or higher so go to WORLD_IMAGERY (satellite)
      if (
        action.zoom <= 17 && state.map.tileLayer !== TILE_LAYERS.NATGEO_WORLD_MAP.KEY
          && state.map.tileLayerAutoChangedAbove17) {
        newState.map.tileLayer = TILE_LAYERS.NATGEO_WORLD_MAP.KEY;
        newState.map.tileLayerAutoChangedAbove17 = false;
      }
      if (action.zoom >= 17 && state.map.tileLayer === TILE_LAYERS.NATGEO_WORLD_MAP.KEY) {
        newState.map.tileLayer = TILE_LAYERS.WORLD_IMAGERY.KEY;
        newState.map.tileLayerAutoChangedAbove17 = true;
      }
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

    // Features
    case 'setFilterFeaturesOpen':
      newState.filters.features.open = !!action.open;
      return newState;

    case 'setFilterFeatureVisibility':
      if (
        !Object.keys(FEATURES).includes(action.feature) || typeof action.visible !== 'boolean'
      ) { return state; }
      newState.filters.features.visible[action.feature] = action.visible;
      // Parents: ensure children are set/unset accordingly
      if (FEATURES[action.feature].type === FEATURE_TYPES.GROUP) {
        Object.keys(FEATURES)
          .filter(f => FEATURES[f].parent === action.feature)
          .forEach((f) => {
            newState.filters.features.visible[f] = action.visible;
          });
      }
      // Children: ensure parent is set/unset accordingly (visible if one child is visible)
      if (FEATURES[action.feature].parent) {
        newState.filters.features.visible[FEATURES[action.feature].parent] = Object.keys(FEATURES)
          .filter(f => FEATURES[f].parent === FEATURES[action.feature].parent) // Of all children...
          .some(f => newState.filters.features.visible[f]); // ...some child is visible
      }
      return newState;

    // Fetch and Import
    case 'setNewFocusLocation':
      newState.focusLocation.fetch = { status: FETCH_STATUS.AWAITING_CALL, error: null };
      newState.focusLocation.current = action.location;
      newState.focusLocation.data = null;
      newState.overallFetch.expected += 1;
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
      }
      if (newState.focusLocation.data.type === 'DOMAIN') {
        newState.filters.features.visible[FEATURES.DOMAINS.KEY] = true;
      }
      completeOverallFetch();
      return calculateFeatureDataFetches(
        calculateFeatureAvailability(getMapStateForFoucusLocation(newState)),
      );

    case 'awaitingFeatureDataFetchesTriggered':
      return { ...state, featureDataFetchesHasAwaiting: false };

    case 'setFeatureDataFetchStarted':
      setFetchStatusFromAction(FETCH_STATUS.FETCHING);
      return newState;

    case 'setFeatureDataFetchSucceeded':
      setFetchStatusFromAction(FETCH_STATUS.SUCCESS);
      completeOverallFetch();
      return newState;

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
  initialState.view = Object.keys(VIEWS).includes(view) ? view : VIEWS.MAP;
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
    const {
      [FEATURE_TYPES.SITES]: sitesData = {},
    } = state.featureData;
    if (Object.keys(sitesData).includes(current)) {
      const { latitude, longitude } = sitesData[current];
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
