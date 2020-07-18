/* eslint-disable no-underscore-dangle */
import React, { useRef, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ObservatoryIcon from '@material-ui/icons/Public';

import 'leaflet/dist/leaflet.css';
import './SiteMap.css';

import {
  LayersControl,
  Map,
  ScaleControl,
  TileLayer,
} from 'react-leaflet';

import Theme from '../Theme/Theme';

import SiteMapContext from './SiteMapContext';
import SiteMapFeature from './SiteMapFeature';
import {
  VIEWS,
  TILE_LAYERS,
  TILE_LAYERS_BY_NAME,
  MAP_ZOOM_RANGE,
  FEATURES,
  FETCH_STATUS,
  deriveFullObservatoryZoomLevel,
} from './SiteMapUtils';

const { BaseLayer } = LayersControl;

const useStyles = makeStyles(theme => ({
  map: {
    width: '100%',
    height: '0px', // Necessary to set a fixed aspect ratio from props (using paddingBottom)
    overflow: 'hidden',
    '& div.leaflet-control-layers': {
      borderRadius: '2px',
      boxShadow: 'unset',
      border: `1px solid ${Theme.colors.LIGHT_BLUE[500]}`,
      '&:hover, &:active': {
        borderColor: Theme.colors.LIGHT_BLUE[400],
      },
    },
    '& div.leaflet-bar': {
      borderRadius: '2px',
      boxShadow: 'unset',
      '& a': {
        color: Theme.colors.LIGHT_BLUE[500],
        border: `1px solid ${Theme.colors.LIGHT_BLUE[500]}`,
        '&:hover, &:active': {
          color: Theme.colors.LIGHT_BLUE[400],
          borderColor: Theme.colors.LIGHT_BLUE[400],
        },
        '&:first-child': {
          borderTopLeftRadius: '2px',
          borderTopRightRadius: '2px',
        },
        '&:last-child': {
          borderTop: 'none',
          borderBottomLeftRadius: '2px',
          borderBottomRightRadius: '2px',
        },
      },
    },
    '& div.leaflet-control-attribution': {
      borderTopLeftRadius: '2px',
      marginRight: '26px',
      height: '26px',
      padding: '4px 8px',
    },
    '& div.leaflet-control-attribution a': {
      color: theme.palette.primary.main,
    },
    '& .leaflet-container a': {
      color: theme.palette.primary.main,
    },
    '& input[type="radio"]': {
      cursor: 'pointer',
    },
  },
  attribution: {
    color: theme.palette.secondary.main,
    fontSize: '11.5px',
    cursor: 'help',
    display: 'inline',
  },
  startFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  endFlex: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  progress: {
    zIndex: 900,
    position: 'absolute',
    top: theme.spacing(1.5),
    right: theme.spacing(7),
  },
  observatoryButton: {
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex: 999,
    top: '72px',
    left: '10px',
    width: '26px',
    height: '26px',
    padding: 'unset',
    borderRadius: '2px 0px 2px 0px',
    border: `1px solid ${theme.colors.LIGHT_BLUE[500]}`,
    '&:hover, &:active': {
      color: theme.colors.LIGHT_BLUE[400],
      borderColor: theme.colors.LIGHT_BLUE[400],
      backgroundColor: theme.palette.grey[50],
    },
    '& svg': {
      fontSize: '1.15rem !important',
    },
  },
}));

/**
   Main Component
*/
const SiteMapLeaflet = () => {
  const classes = useStyles(Theme);
  const mapRef = useRef(null);

  // State, Dispatch, and other stuff from SiteMapContext
  const [state, dispatch] = SiteMapContext.useSiteMapContext();
  let canRender = state.neonContextHydrated;
  if (
    state.focusLocation.current
      && state.focusLocation.fetch.status !== FETCH_STATUS.SUCCESS
  ) { canRender = false; }

  /**
     Effect
     If zoom was not set as a prop then attempt to set the initial zoom such that
     all sites are visible. This depends on the client dimensions of the map
     and whether height or width is the deciding factor depends on the aspect ratio.
  */
  useEffect(() => {
    if (
      !canRender || state.map.zoom !== null
        || !mapRef || !mapRef.current || !mapRef.current.container
    ) { return; }
    dispatch({
      type: 'setMapZoom',
      zoom: deriveFullObservatoryZoomLevel(mapRef),
    });
  }, [
    canRender,
    state.map.zoom,
    mapRef,
    dispatch,
  ]);

  /**
    Effect
    If map bounds are null (as they will be when setting a focus location) then fill them in
    We have to do it this way as only the Leaflet Map instance can give us bounds
  */
  useEffect(() => {
    if (state.map.bounds !== null || mapRef.current === null) { return; }
    const bounds = mapRef.current.leafletElement.getBounds();
    dispatch({
      type: 'setMapBounds',
      bounds: {
        lat: [bounds._southWest.lat, bounds._northEast.lat],
        lng: [bounds._southWest.lng, bounds._northEast.lng],
      },
    });
  }, [state.map.bounds, dispatch]);

  /**
     Render - Zoom to Observatory Button
  */
  const renderShowFullObservatoryButton = () => (
    <Tooltip placement="right" title="Show the full NEON Observatory">
      <IconButton
        type="button"
        className={classes.observatoryButton}
        onClick={() => { dispatch({ type: 'showFullObservatory', mapRef }); }}
      >
        <ObservatoryIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  /**
    Effect
    Force a redraw when switching to the map for the first time from another view
  */
  useEffect(() => {
    if (
      !mapRef || !mapRef.current || !mapRef.current.leafletElement
        || state.view.current !== VIEWS.MAP || state.view.initialized[VIEWS.MAP]
    ) { return; }
    mapRef.current.leafletElement.invalidateSize();
    dispatch({ type: 'setViewInitialized' });
  }, [mapRef, state.view, dispatch]);

  if (!canRender) { return null; }

  /**
     Render: Tile Layers
  */
  const renderTileLayer = (key) => {
    const tileLayer = TILE_LAYERS[key];
    const attributionNode = (
      <div title={tileLayer.fullAttribution} className={classes.attribution}>
        {tileLayer.shortAttribution}
      </div>
    );
    const attributionString = ReactDOMServer.renderToStaticMarkup(attributionNode);
    return (
      <BaseLayer
        key={key}
        name={tileLayer.name}
        checked={key === state.map.tileLayer}
      >
        <TileLayer key={key} url={tileLayer.url} attribution={attributionString} />
      </BaseLayer>
    );
  };

  /**
     Interaction Handlers
  */
  const handleMoveEnd = (event) => {
    const center = event.target.getCenter();
    const bounds = event.target.getBounds();
    dispatch({
      type: 'setMapCenter',
      center: [center.lat, center.lng],
      bounds: {
        lat: [bounds._southWest.lat, bounds._northEast.lat],
        lng: [bounds._southWest.lng, bounds._northEast.lng],
      },
    });
    if (typeof state.map.repositionOpenPopupFunc === 'function') {
      state.map.repositionOpenPopupFunc();
    }
  };
  const handleZoomEnd = (event) => {
    const center = event.target.getCenter();
    const bounds = event.target.getBounds();
    dispatch({
      type: 'setMapZoom',
      zoom: event.target.getZoom(),
      center: [center.lat, center.lng],
      bounds: {
        lat: [bounds._southWest.lat, bounds._northEast.lat],
        lng: [bounds._southWest.lng, bounds._northEast.lng],
      },
    });
    if (typeof state.map.repositionOpenPopupFunc === 'function') {
      state.map.repositionOpenPopupFunc();
    }
  };
  const handleBaseLayerChange = (event) => {
    if (!event.name || !TILE_LAYERS_BY_NAME[event.name]) { return; }
    dispatch({
      type: 'setMapTileLayer',
      tileLayer: TILE_LAYERS_BY_NAME[event.name],
    });
  };

  /**
     Render: Loading / Progress
  */
  const renderProgress = () => {
    if (state.overallFetch.expected === state.overallFetch.completed) { return null; }
    if (state.overallFetch.pendingHierarchy !== 0) {
      return (
        <Box className={classes.progress}>
          <CircularProgress size={32} />
        </Box>
      );
    }
    const progress = state.overallFetch.expected === 0 ? 0
      : Math.floor((state.overallFetch.completed / state.overallFetch.expected) * 10) * 10;
    const progressProps = progress < 60 ? {
      size: 32,
    } : {
      size: 32,
      variant: 'static',
      value: progress,
    };
    return (
      <Box className={classes.progress}>
        <CircularProgress {...progressProps} />
        <Box
          top={0}
          left={0}
          bottom={8}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="caption" component="div">
            {`${Math.round(progress)}%`}
          </Typography>
        </Box>
      </Box>
    );
  };

  /**
     Render: Map
  */
  return (
    <React.Fragment>
      <Map
        ref={mapRef}
        className={classes.map}
        style={{ paddingBottom: `${(state.aspectRatio.currentValue || 0.75) * 100}%` }}
        center={state.map.center}
        zoom={state.map.zoom}
        minZoom={MAP_ZOOM_RANGE[0]}
        maxZoom={MAP_ZOOM_RANGE[1]}
        onMoveEnd={handleMoveEnd}
        onZoomEnd={handleZoomEnd}
        onBaseLayerChange={handleBaseLayerChange}
        worldCopyJump
        data-component="SiteMap"
        data-selenium="sitemap-content-map"
      >
        <ScaleControl imperial metric updateWhenIdle />
        <LayersControl position="topright">
          {Object.keys(TILE_LAYERS).map(renderTileLayer)}
        </LayersControl>
        {Object.keys(FEATURES)
          .filter(key => state.filters.features.available[key])
          .filter(key => state.filters.features.visible[key])
          .map(key => <SiteMapFeature key={key} featureKey={key} mapRef={mapRef} />)}
      </Map>
      {renderShowFullObservatoryButton()}
      {renderProgress()}
    </React.Fragment>
  );
};

export default SiteMapLeaflet;
