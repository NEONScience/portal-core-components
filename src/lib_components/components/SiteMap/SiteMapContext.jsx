import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import cloneDeep from 'lodash/cloneDeep';

import L from 'leaflet';

import NeonContext from '../NeonContext/NeonContext';

import SiteMapDeferredJson from './SiteMapDeferredJson';
import {
  DEFAULT_STATE,
  SORT_DIRECTIONS,
  TILE_LAYERS,
  VIEWS,
  FEATURES,
  ICON_SVGS,
  FETCH_STATUS,
  FEATURE_TYPES,
  FEATURE_DATA_LOAD_TYPES,
  SELECTABLE_FEATURE_TYPES,
  MAP_ZOOM_RANGE,
  SITE_MAP_PROP_TYPES,
  SITE_MAP_DEFAULT_PROPS,
  hydrateNeonContextData,
} from './SiteMapUtils';

/**
   Map Icon Functions
   These appear here because of how Leaflet handles icons. Each icon must be a L.Icon instance,
   but many of our icons repeat. We also want to scale our icons with the zoom level. As such,
   we generate a stat structure containing only one instance of each distinct icon type scaled
   to the current zoom level and keep that in state. It is regenerated any time the zoom changes.
*/
const getIconClassName = (classes, type, isSelected) => ([
  classes.mapIcon,
  classes[`mapIcon${type}`],
  classes[`mapIcon${isSelected ? 'Selected' : 'Unselected'}`],
].join(' '));
// Site Markers: Get a leaflet icon instance scaled to the current zoom level.
const getZoomedSiteMarkerIcon = (zoom = 3, classes, type, terrain, isSelected = false) => {
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
    className: getIconClassName(classes, type, isSelected),
  });
};
// Get a structure containing all zoomed leaflet icon instances. These are stored in
// state and regenerated any time the zoom level changes. This makes for a maximum of
// eight distinct icon instances in memory instead of one for every site.
const getZoomedIcons = (zoom, classes) => ({
  SITE_MARKERS: {
    CORE: {
      AQUATIC: {
        BASE: getZoomedSiteMarkerIcon(zoom, classes, 'CORE', 'AQUATIC'),
        SELECTED: getZoomedSiteMarkerIcon(zoom, classes, 'CORE', 'AQUATIC', true),
      },
      TERRESTRIAL: {
        BASE: getZoomedSiteMarkerIcon(zoom, classes, 'CORE', 'TERRESTRIAL'),
        SELECTED: getZoomedSiteMarkerIcon(zoom, classes, 'CORE', 'TERRESTRIAL', true),
      },
    },
    RELOCATABLE: {
      AQUATIC: {
        BASE: getZoomedSiteMarkerIcon(zoom, classes, 'RELOCATABLE', 'AQUATIC'),
        SELECTED: getZoomedSiteMarkerIcon(zoom, classes, 'RELOCATABLE', 'AQUATIC', true),
      },
      TERRESTRIAL: {
        BASE: getZoomedSiteMarkerIcon(zoom, classes, 'RELOCATABLE', 'TERRESTRIAL'),
        SELECTED: getZoomedSiteMarkerIcon(zoom, classes, 'RELOCATABLE', 'TERRESTRIAL', true),
      },
    },
  },
});

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
  const newState = { ...state };
  Object.keys(FEATURES)
    .filter(key => FEATURE_DATA_LOAD_TYPES[FEATURES[key].dataLoadType])
    .filter(key => state.filters.features.available[key] && state.filters.features.visible[key])
    .forEach((key) => {
      const { type: featureType } = FEATURES[key];
      sitesInMap.forEach((siteCode) => {
        if (newState.featureDataFetches[featureType][key][siteCode]) { return; }
        newState.featureDataFetches[featureType][key][siteCode] = FETCH_STATUS.AWAITING_CALL;
        newState.featureDataFetchesHasAwaiting = true;
      });
    });
  return newState;
};
const reducer = (state, action) => {
  console.log('REDUCER', action);
  let setMethod = null;
  const newState = { ...state };
  // Returns a boolean describing whether a fetch status was updated
  const setFetchStatusFromAction = (status) => {
    if (!Object.keys(FETCH_STATUS).includes(status) || status === FETCH_STATUS.AWAITING_CALL) {
      return false;
    }
    const { feature: featureKey, siteCode } = action;
    if (!FEATURES[featureKey]) { return false; }
    const { type: featureType } = FEATURES[featureKey];
    if (
      !newState.featureDataFetches[featureType]
        || !newState.featureDataFetches[featureType][featureKey]
        || !newState.featureDataFetches[featureType][featureKey][siteCode]
    ) { return false; }
    newState.featureDataFetches[featureType][featureKey][siteCode] = status;
    // If the status is SUCCESS and the action has data, also commit the data
    if (status === FETCH_STATUS.SUCCESS && action.data) {
      newState.featureData[featureType][featureKey][siteCode] = action.data;
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
      if (action.classes) {
        newState.map.zoomedIcons = getZoomedIcons(newState.map.zoom, action.classes);
      }
      return calculateFeatureDataFetches(
        calculateFeatureAvailability(newState),
      );

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
    case 'awaitingFeatureDataFetchesTriggered':
      return { ...state, featureDataFetchesHasAwaiting: false };

    case 'setFeatureDataFetchStarted':
      setFetchStatusFromAction(FETCH_STATUS.FETCHING);
      return newState;

    case 'setFeatureDataFetchSucceeded':
      setFetchStatusFromAction(FETCH_STATUS.SUCCESS);
      return newState;

    case 'setFeatureDataFetchFailed':
      setFetchStatusFromAction(FETCH_STATUS.ERROR);
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

  /**
     Effect - trigger all data fetches and imports
  */
  useEffect(() => {
    if (!state.featureDataFetchesHasAwaiting) { return; }
    Object.keys(state.featureDataFetches).forEach((type) => {
      Object.keys(state.featureDataFetches[type]).forEach((feature) => {
        const { dataLoadType } = FEATURES[feature];
        Object.keys(state.featureDataFetches[type][feature]).forEach((siteCode) => {
          if (state.featureDataFetches[type][feature][siteCode] !== FETCH_STATUS.AWAITING_CALL) {
            return;
          }
          if (dataLoadType === FEATURE_DATA_LOAD_TYPES.IMPORT) {
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
          if (dataLoadType === FEATURE_DATA_LOAD_TYPES.FETCH) {
            // do a fetch, not yet implemented
          }
        });
      });
    });
    dispatch({ type: 'awaitingFeatureDataFetchesTriggered' });
  }, [state.featureDataFetchesHasAwaiting, state.featureDataFetches]);

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
  getIconClassName,
  SORT_DIRECTIONS,
  VIEWS,
};

export default SiteMapContext;
