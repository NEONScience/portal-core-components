/* eslint-disable no-unused-vars */
import React, { useRef, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import ClickIcon from '@material-ui/icons/TouchApp';
import ExploreDataProductsIcon from '@material-ui/icons/InsertChartOutlined';
import LocationIcon from '@material-ui/icons/MyLocation';
import SiteDetailsIcon from '@material-ui/icons/InfoOutlined';

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
import Theme from '../Theme/Theme';

import SiteMapContext from './SiteMapContext';
import {
  TILE_LAYERS,
  TILE_LAYERS_BY_NAME,
  MAP_ZOOM_RANGE,
  ICON_SVGS,
  FEATURES,
  FEATURE_TYPES,
  SELECTABLE_FEATURE_TYPES,
  BOUNDARY_COLORS,
  SITE_DETAILS_URL_BASE,
  EXPLORE_DATA_PRODUCTS_URL_BASE,
} from './SiteMapUtils';

import SitesFeature from './Features/Sites';
import StatesFeature from './Features/States';
import DomainsFeature from './Features/Domains';
import SamplingBoundariesFeature from './Features/SamplingBoundaries';
import AquaticReachesFeature from './Features/AquaticReaches';
// import FlightBoxBoundariesFeature from './Features/FlightBoxBoundaries';
// import WatershedBoundariesFeature from './Features/WatershedBoundaries';
// import TowerAirshedBoundariesFeature from './Features/TowerAirshedBoundaries';

import statesShapesJSON from '../../staticJSON/statesShapes.json';
import domainsShapesJSON from '../../staticJSON/domainsShapes.json';

const { BaseLayer, Overlay } = LayersControl;

const boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
const useStyles = makeStyles(theme => ({
  map: {
    width: '100%',
    height: '0px', // Necessary to set a fixed aspect ratio from props (using paddingBottom)
    overflow: 'hidden',
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
    border: `2px solid ${BOUNDARY_COLORS[FEATURES.STATES.KEY]}`,
    backgroundColor: `${BOUNDARY_COLORS[FEATURES.STATES.KEY]}88`,
    width: Theme.spacing(3),
    height: Theme.spacing(1),
    margin: Theme.spacing(0, 0.5, 0.25, 0),
  },
  keySwatchDomains: {
    border: `2px solid ${BOUNDARY_COLORS[FEATURES.DOMAINS.KEY]}`,
    backgroundColor: `${BOUNDARY_COLORS[FEATURES.DOMAINS.KEY]}88`,
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
   Main Component
*/
const SiteMapLeaflet = () => {
  const classes = useStyles(Theme);
  const mapRef = useRef(null);

  // Neon Context State
  const [
    { data: neonContextData, isFinal: neonContextIsFinal, hasError: neonContextHasError },
  ] = NeonContext.useNeonContextState();
  const {
    sites: allSites,
    states: allStates,
    domains: allDomains,
    stateSites,
    domainSites,
  } = neonContextData;
  const canRender = neonContextIsFinal && !neonContextHasError;

  // State, Dispatch, and other stuff from SiteMapContext
  const [state, dispatch] = SiteMapContext.useSiteMapContext();
  const { getIconClassName } = SiteMapContext;

  // Effect
  // If zoom was not set as a prop then attempt to set the initial zoom such that
  // all sites are visible. This depends on the client dimensions of the map
  // and whether height or width is the deciding factor depends on the aspect ratio.
  useEffect(() => {
    if (state.map.zoom !== null || !mapRef || !mapRef.current || !mapRef.current.container) {
      return;
    }
    const mapCont = mapRef.current.container;
    const minorDim = Math.min(mapCont.clientWidth / 136, mapCont.clientHeight / 128);
    const derivedZoom = [1, 2, 4, 6, 11].findIndex(m => m > minorDim);
    dispatch({
      type: 'setMapZoom',
      zoom: derivedZoom === -1 ? 5 : derivedZoom,
      classes,
    });
  }, [
    state.map.zoom,
    mapRef,
    classes,
    dispatch,
  ]);

  if (!canRender) { return null; }

  /**
     Util: Position Popup
     Used only when selection is active, or more specifically, only when popups are on mouse
     over only and do not persist.
  */
  const positionPopup = (e) => {
    /* eslint-disable no-underscore-dangle */
    const TIP_HEIGHT = 47;
    e.target._popup.setLatLng(e.latlng);
    // Leaflet popups always open above; open below if mouse event is in the top half of the map
    if (e.containerPoint.y < (mapRef.current.container.clientHeight / 2)) {
      const popupHeight = e.target._popup._contentNode.clientHeight;
      const tipY = popupHeight + TIP_HEIGHT;
      e.target._popup._container.style.bottom = `${(popupHeight + (TIP_HEIGHT * 1.75)) * -1}px`;
      e.target._popup._tipContainer.style.transform = `rotate(0.5turn) translate(0px, ${tipY}px)`;
    } else {
      e.target._popup._container.style.bottom = '0px';
      e.target._popup._tipContainer.style.transform = null;
    }
    e.target._popup._closeButton.style.display = 'none';
    /* eslint-enable no-underscore-dangle */
  };

  /**
     Render Method: List of Sites inside a Popup
  */
  const renderPopupSitesList = (sitesList) => {
    if (!sitesList || !sitesList.size) {
      return (
        <Typography variant="subtitle2" gutterBottom>
          <i>No NEON Sites</i>
        </Typography>
      );
    }
    const { [SELECTABLE_FEATURE_TYPES.SITES]: selectedSites } = state.selection;
    return (
      <React.Fragment>
        <Typography variant="subtitle2" gutterBottom>
          {`NEON Sites (${sitesList.size}):`}
        </Typography>
        <div>
          {[...sitesList].map((siteCode) => {
            const site = allSites[siteCode];
            const alt = `${site.terrain} ${site.type}`;
            const selected = selectedSites.has(siteCode) ? 'SELECTED' : 'BASE';
            const src = ICON_SVGS.SITE_MARKERS[site.type][site.terrain][selected];
            return (
              <div key={siteCode} style={{ display: 'flex' }}>
                <img src={src} alt={alt} className={classes.popupSiteIcon} />
                <div>{`${site.description} (${siteCode})`}</div>
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  };

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
     Render Method: Feature
  */
  const renderFeature = (key) => {
    if (!FEATURES[key]) { return null; }
    const feature = FEATURES[key];
    // Parents are groups only and don't render anything
    if (feature.isParent) { return null; }
    const featureProps = { key, classes, positionPopup };
    switch (feature.type) {
      case FEATURE_TYPES.SITES:
        return <SitesFeature featureKey={key} {...featureProps} />;
      /*
      case FEATURE_TYPES.PLOTS:
        return <PlotsFeature featureKey={key} {...featureProps} />;
      */
      case FEATURE_TYPES.BOUNDARIES:
        switch (key) {
          case FEATURES.DOMAINS.KEY:
            return <DomainsFeature {...featureProps} renderPopupSitesList={renderPopupSitesList} />;
          case FEATURES.STATES.KEY:
            return <StatesFeature {...featureProps} renderPopupSitesList={renderPopupSitesList} />;
          case FEATURES.SAMPLING_BOUNDARIES.KEY:
            return <SamplingBoundariesFeature {...featureProps} />;
          case FEATURES.AQUATIC_REACHES.KEY:
            return <AquaticReachesFeature {...featureProps} />;
          /*
          case FEATURES.WATERSHED_BOUNDARIES.KEY:
            return <WatershedBoundariesFeature {...featureProps} />;
          case FEATURES.FLIGHT_BOX_BOUNDARIES.KEY:
            return <FlightBoxBoundariesFeature {...featureProps} />;
          case FEATURES.TOWER_AIRSHED_BOUNDARIES.KEY:
            return <TowerAirshedBoundariesFeature {...featureProps} />;
          */
          default:
            return null;
        }
      default:
        return null;
    }
  };

  /**
     Interaction Handlers
  */
  const handleMoveEnd = (event) => {
    const center = event.target.getCenter();
    const bounds = event.target.getBounds();
    /* eslint-disable no-underscore-dangle */
    dispatch({
      type: 'setMapCenter',
      center: [center.lat, center.lng],
      bounds: {
        lat: [bounds._southWest.lat, bounds._northEast.lat],
        lng: [bounds._southWest.lng, bounds._northEast.lng],
      },
    });
    /* eslint-enable no-underscore-dangle */
  };
  const handleZoomEnd = (event) => {
    const center = event.target.getCenter();
    const bounds = event.target.getBounds();
    /* eslint-disable no-underscore-dangle */
    dispatch({
      type: 'setMapZoom',
      zoom: event.target.getZoom(),
      center: [center.lat, center.lng],
      bounds: {
        lat: [bounds._southWest.lat, bounds._northEast.lat],
        lng: [bounds._southWest.lng, bounds._northEast.lng],
      },
      classes,
    });
    /* eslint-enable no-underscore-dangle */
  };
  const handleBaseLayerChange = (event) => {
    if (!event.name || !TILE_LAYERS_BY_NAME[event.name]) { return; }
    dispatch({
      type: 'setMapTileLayer',
      tileLayer: TILE_LAYERS_BY_NAME[event.name],
    });
  };

  /**
     Render: Map
  */
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
      {Object.keys(FEATURES)
        .filter(key => state.filters.features.available[key])
        .filter(key => state.filters.features.visible[key])
        .map(renderFeature)}
    </Map>
  );
};

export default SiteMapLeaflet;
