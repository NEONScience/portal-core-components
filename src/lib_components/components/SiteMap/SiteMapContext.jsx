import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

import cloneDeep from 'lodash/cloneDeep';

// import NeonContext from '../NeonContext/NeonContext';

import {
  DEFAULT_STATE,
  SORT_DIRECTIONS,
  TILE_LAYERS,
  VIEWS,
  MAP_ZOOM_RANGE,
  SITE_MAP_PROP_TYPES,
  SITE_MAP_DEFAULT_PROPS,
} from './SiteMapUtils';

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

    case 'setMapZoom':
      if (!zoomIsValid(action.zoom)) { return state; }
      newState.map.zoom = action.zoom;
      if (centerIsValid(action.center)) { newState.map.center = action.center; }
      return newState;

    case 'setMapCenter':
      if (!centerIsValid(action.center)) { return state; }
      newState.map.center = [...action.center];
      return newState;

    case 'setMapTileLayer':
      if (!Object.keys(TILE_LAYERS).includes(action.tileLayer)) { return state; }
      newState.map.tileLayer = action.tileLayer;
      return newState;

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

  /**
     Initial State and Reducer Setup
  */
  const initialMapZoom = mapZoom === null ? null
    : Math.max(Math.min(mapZoom, MAP_ZOOM_RANGE[1]), MAP_ZOOM_RANGE[0]);
  const initialState = cloneDeep(DEFAULT_STATE);
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
  if (selection) {
    initialState.selection[selection] = {
      enabled: true,
      maxSelectable,
      ...initialState.selection[selection],
    };
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
  SORT_DIRECTIONS,
  VIEWS,
};

export default SiteMapContext;
