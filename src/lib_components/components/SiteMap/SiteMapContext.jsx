import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

import cloneDeep from 'lodash/cloneDeep';

import L from 'leaflet';

import NeonContext from '../NeonContext/NeonContext';

import {
  DEFAULT_STATE,
  SORT_DIRECTIONS,
  TILE_LAYERS,
  VIEWS,
  FEATURES,
  ICON_SVGS,
  FEATURE_TYPES,
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

// Derive the selected status of a given region (US state or NEON domain). This should run
// every time the list of selected sites changes. It regenerates selectedStates and
// selectedDomains in state to each contain a key/value lookup where the key is the region code
// (state code or domain code) and the value is either 'total' (all sites selected) or 'partial'
// (some sites selected). If no sites are selected for the region it is omitted from the map.
const deriveRegionSelections = (state) => {
  const derive = (featureType) => {
    if (!state.neonContextHydrated || !state.featureData[featureType]) { return {}; }
    const selectedRegions = {};
    Object.keys(state.featureData[featureType]).forEach((regionCode) => {
      const regionSitesSet = state.featureData[featureType][regionCode].sites || new Set();
      const intersection = [...regionSitesSet]
        .filter(x => state.selection[SELECTABLE_FEATURE_TYPES.SITES].has(x));
      if (!intersection.length) { return; }
      selectedRegions[regionCode] = (
        intersection.length === regionSitesSet.size ? 'total' : 'partial'
      );
    });
    return selectedRegions;
  };
  return {
    ...state,
    selection: {
      ...state.selection,
      derived: {
        states: derive(FEATURE_TYPES.STATES),
        domains: derive(FEATURE_TYPES.DOMAINS),
      },
    },
  };
};

/**
   Reducer
*/
const reducer = (state, action) => {
  console.log('REDUCER', action);
  const zoomIsValid = zoom => (
    Number.isInteger(zoom) && zoom >= MAP_ZOOM_RANGE[0] && zoom <= MAP_ZOOM_RANGE[1]
  );
  const centerIsValid = center => (
    Array.isArray(center) && center.length === 2 && center.every(v => typeof v === 'number')
  );
  const calculateFeatureAvailability = (newState) => {
    const featureIsAvailable = feature => (!(
      (typeof feature.minZoom === 'number' && newState.map.zoom < feature.minZoom)
        || (typeof feature.maxZoom === 'number' && newState.map.zoom > feature.maxZoom)
        || (typeof feature.parent === 'string' && !featureIsAvailable(FEATURES[feature.parent]))
    ));
    return {
      ...newState,
      filters: {
        ...newState.filters,
        features: {
          ...newState.filters.features,
          available: Object.fromEntries(
            Object.entries(FEATURES).map(entry => [entry[0], featureIsAvailable(entry[1])]),
          ),
        },
      },
    };
  };
  let setMethod = null;
  const newState = { ...state };
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
      if (action.classes) {
        newState.map.zoomedIcons = getZoomedIcons(newState.map.zoom, action.classes);
      }
      return calculateFeatureAvailability(newState);

    case 'setMapCenter':
      if (!centerIsValid(action.center)) { return state; }
      newState.map.center = [...action.center];
      return newState;

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
      if (FEATURES[action.feature].isParent) {
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

    // Selection
    case 'toggleSiteSelected':
      if (newState.selection[SELECTABLE_FEATURE_TYPES.SITES].has(action.site)) {
        newState.selection[SELECTABLE_FEATURE_TYPES.SITES].delete(action.site);
      } else {
        newState.selection[SELECTABLE_FEATURE_TYPES.SITES].add(action.site);
      }
      return deriveRegionSelections(newState);

    case 'toggleStateSelected':
      if (!action.stateCode) { return state; }
      setMethod = state.selection.derived.states[action.stateCode] === 'total' ? 'delete' : 'add';
      newState.regionSites.stateSites[action.stateCode].forEach((siteCode) => {
        newState.selection[SELECTABLE_FEATURE_TYPES.SITES][setMethod](siteCode);
      });
      return deriveRegionSelections(newState);

    case 'toggleDomainSelected':
      if (!action.domainCode) { return state; }
      setMethod = state.selection.derived.domains[action.domainCode] === 'total' ? 'delete' : 'add';
      newState.regionSites.domainSites[action.domainCode].forEach((siteCode) => {
        newState.selection[SELECTABLE_FEATURE_TYPES.SITES][setMethod](siteCode);
      });
      return deriveRegionSelections(newState);

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
