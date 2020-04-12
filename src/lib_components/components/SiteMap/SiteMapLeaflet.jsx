/* eslint-disable no-unused-vars */
import React, { useRef, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';

import { makeStyles } from '@material-ui/core/styles';

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

import {
  FeatureGroup,
  LayersControl,
  Map,
  Marker,
  Polygon,
  Popup,
  ScaleControl,
  TileLayer,
} from 'react-leaflet';

import NeonContext from '../NeonContext/NeonContext';
import Theme, { COLORS } from '../Theme/Theme';

import SiteMapContext from './SiteMapContext';
import {
  TILE_LAYERS,
  TILE_LAYERS_BY_NAME,
  MAP_ZOOM_RANGE,
  ICON_SVGS,
} from './SiteMapUtils';

import statesShapesJSON from '../../staticJSON/statesShapes.json';
import domainsShapesJSON from '../../staticJSON/domainsShapes.json';

const { BaseLayer, Overlay } = LayersControl;

const boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
const rootOverlayColors = {
  states: '#3cdd85', // COLORS.RED[300],
  domains: '#a36ce5', // COLORS.GREY[300],
  partialSelected: COLORS.SECONDARY_BLUE[300],
  totalSelected: COLORS.SECONDARY_BLUE[500],
  hover: COLORS.SECONDARY_BLUE[100],
};

const useStyles = makeStyles(theme => ({
  map: {
    width: '100%',
    height: '0px', // Necessary to set a fixed aspect ratio from props (using paddingBottom)
    overflow: 'hidden',
    borderRadius: theme.spacing(1),
    boxShadow,
    '& div.leaflet-control-attribution': {
      borderTopLeftRadius: theme.spacing(0.5),
    },
    '& div.leaflet-control-attribution a': {
      color: theme.palette.secondary.main,
    },
    '& input[type="radio"]': {
      cursor: 'pointer',
    },
  },
  mapIcon: {
    boxSizing: 'content-box',
  },
  mapIconCORE: {
    borderRadius: '20%',
  },
  mapIconRELOCATABLE: {
    borderRadius: '50%',
  },
  mapIconUnselected: {
    boxShadow: 'none',
    '&:hover, &:focus': {
      boxShadow: `0px 0px 5px 5px ${Theme.palette.secondary.main}`,
    },
    '&:active': {
      boxShadow: `0px 0px 8px 8px ${Theme.palette.secondary.main}`,
    },
  },
  mapIconSelected: {
    boxShadow: 'none',
    '&:hover, &:focus': {
      boxShadow: '0px 0px 3px 3px #ffffff',
    },
    '&:active': {
      boxShadow: '0px 0px 6px 6px #ffffff',
    },
  },
  attribution: {
    color: theme.palette.secondary.main,
    fontSize: '11.5px',
    cursor: 'help',
    display: 'inline',
  },
  popup: {
    minWidth: '320px',
    '& a': {
      color: theme.palette.secondary.main,
    },
    '& p': {
      margin: 'unset',
    },
    '& a.leaflet-popup-close-button': {
      top: theme.spacing(0.5),
      right: theme.spacing(0.5),
    },
  },
  popupButton: {
    width: '100%',
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
    color: `${Theme.palette.primary.main} !important`,
    borderColor: Theme.palette.primary.main,
    '& span': {
      pointerEvents: 'none',
    },
  },
  popupSiteIcon: {
    width: '20px',
    height: '20px',
    margin: '0px 4px 4px 0px',
  },
  startFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  startFlexInline: {
    display: 'inline-flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  keySwatchStates: {
    border: `2px solid ${rootOverlayColors.states}`,
    backgroundColor: `${rootOverlayColors.states}88`,
    width: Theme.spacing(3),
    height: Theme.spacing(1),
    margin: Theme.spacing(0, 0.5, 0.25, 0),
  },
  keySwatchDomains: {
    border: `2px solid ${rootOverlayColors.domains}`,
    backgroundColor: `${rootOverlayColors.domains}88`,
    width: Theme.spacing(3),
    height: Theme.spacing(1),
    margin: Theme.spacing(0, 0.5, 0.25, 0),
  },
  keySiteIcon: {
    width: '20px',
    height: '20px',
    marginRight: '4px',
  },
  infoSnackbar: {
    backgroundColor: theme.palette.grey[50],
    color: '#000',
    border: `1px solid ${theme.palette.primary.main}80`,
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
  },
  infoSnackbarIcon: {
    color: theme.palette.grey[300],
    marginRight: theme.spacing(2),
  },
}));

/**
   Icon Functions
*/
/*
const getIconClassName = (classes, type, isSelected) => ([
  classes.mapIcon,
  classes[`mapIcon${type}`],
  classes[`mapIcon${isSelected ? 'Selected' : 'Unselected'}`],
].join(' '));
// Get a leaflet icon instance scaled to the current zoom level.
const getZoomedIcon = (zoom = 3, classes, type, terrain, isSelected = false) => {
  if (!ICON_SVGS[type] || !ICON_SVGS[type][terrain] || !ICON_SVGS[type].SHADOW) {
    return null;
  }
  const selected = isSelected ? 'SELECTED' : 'BASE';
  const iconScale = 0.2 + (Math.floor(((zoom || 2) - 2) / 3) / 10);
  const iconSize = isSelected ? [150, 150] : [100, 100];
  const iconAnchor = isSelected ? [75, 125] : [50, 100];
  const shadowSize = isSelected ? [234, 160] : [156, 93];
  const shadowAnchor = isSelected ? [80, 120] : [50, 83];
  return new L.Icon({
    iconUrl: ICON_SVGS[type][terrain][selected],
    iconRetinaUrl: ICON_SVGS[type][terrain][selected],
    iconSize: iconSize.map(x => x * iconScale),
    iconAnchor: iconAnchor.map(x => x * iconScale),
    shadowUrl: ICON_SVGS[type].SHADOW[selected],
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
  CORE: {
    AQUATIC: {
      BASE: getZoomedIcon(zoom, classes, 'CORE', 'AQUATIC'),
      SELECTED: getZoomedIcon(zoom, classes, 'CORE', 'AQUATIC', true),
    },
    TERRESTRIAL: {
      BASE: getZoomedIcon(zoom, classes, 'CORE', 'TERRESTRIAL'),
      SELECTED: getZoomedIcon(zoom, classes, 'CORE', 'TERRESTRIAL', true),
    },
  },
  RELOCATABLE: {
    AQUATIC: {
      BASE: getZoomedIcon(zoom, classes, 'RELOCATABLE', 'AQUATIC'),
      SELECTED: getZoomedIcon(zoom, classes, 'RELOCATABLE', 'AQUATIC', true),
    },
    TERRESTRIAL: {
      BASE: getZoomedIcon(zoom, classes, 'RELOCATABLE', 'TERRESTRIAL'),
      SELECTED: getZoomedIcon(zoom, classes, 'RELOCATABLE', 'TERRESTRIAL', true),
    },
  },
});
*/

/**
   Main Component
*/
const SiteMapLeaflet = () => {
  const classes = useStyles(Theme);
  const mapRef = useRef(null);

  // Neon Context State
  const [
    { data: neonContextData, isFinal: neonContextIsFinal, hasError: neonContextHasError },
  ] = NeonContext.useNeonContextState();
  const { sites: allSites, states: allStates, domains: allDomains } = neonContextData;
  const canRender = neonContextIsFinal && !neonContextHasError;

  // SiteMap State and Dispatch
  const [state, dispatch] = SiteMapContext.useSiteMapContext();

  // Effect
  // If zoom was not set as a prop then attempt to set the initial zoom such that
  // all sites are visible. This depends on the client dimensions of the map
  // and whether height or width is the deciding factor depends on the aspect ratio.
  useEffect(() => {
    if (state.map.zoom === null && mapRef && mapRef.current && mapRef.current.container) {
      const mapCont = mapRef.current.container;
      const minorDim = Math.min(mapCont.clientWidth / 136, mapCont.clientHeight / 128);
      const derivedZoom = [1, 2, 4, 6, 11].findIndex(m => m > minorDim);
      dispatch({ type: 'setMapZoom', zoom: derivedZoom === -1 ? 5 : derivedZoom });
    }
  });

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
     Render: Map
  */
  const handleMoveEnd = (event) => {
    const center = event.target.getCenter();
    dispatch({
      type: 'setMapCenter',
      center: [center.lat, center.lng],
    });
  };
  const handleZoomEnd = (event) => {
    const center = event.target.getCenter();
    dispatch({
      type: 'setMapZoom',
      zoom: event.target.getZoom(),
      center: [center.lat, center.lng],
    });
  };
  const handleBaseLayerChange = (event) => {
    if (!event.name || !TILE_LAYERS_BY_NAME[event.name]) { return; }
    dispatch({
      type: 'setMapTileLayer',
      tileLayer: TILE_LAYERS_BY_NAME[event.name],
    });
  };

  return (
    <Map
      ref={mapRef}
      className={classes.map}
      style={{ paddingBottom: `${state.aspectRatio.currentValue * 100}%` }}
      center={state.map.center}
      zoom={state.map.zoom}
      minZoom={MAP_ZOOM_RANGE[0]}
      maxZoom={MAP_ZOOM_RANGE[1]}
      onMoveEnd={handleMoveEnd}
      onZoomEnd={handleZoomEnd}
      onBaseLayerChange={handleBaseLayerChange}
      worldCopyJump
    >
      <ScaleControl imperial metric updateWhenIdle />
      <LayersControl position="topright">
        {Object.keys(TILE_LAYERS).map(renderTileLayer)}
      </LayersControl>
    </Map>
  );
};

export default SiteMapLeaflet;
