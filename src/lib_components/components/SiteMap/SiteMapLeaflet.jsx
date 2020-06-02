/* eslint-disable no-unused-vars, no-underscore-dangle */
import React, { useRef, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import './SiteMap.css';

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
  VIEWS,
  TILE_LAYERS,
  TILE_LAYERS_BY_NAME,
  MAP_ZOOM_RANGE,
  FEATURES,
  FETCH_STATUS,
  FEATURE_TYPES,
  SELECTABLE_FEATURE_TYPES,
  BOUNDARY_COLORS,
  SITE_DETAILS_URL_BASE,
  EXPLORE_DATA_PRODUCTS_URL_BASE,
} from './SiteMapUtils';

import SitesFeature from './Features/Sites';
import StatesFeature from './Features/States';
import DomainsFeature from './Features/Domains';
import DrainageLinesFeature from './Features/DrainageLines';
import SiteBasedFeature from './Features/SiteBasedFeature';

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
  progress: {
    zIndex: 900,
    position: 'absolute',
    top: theme.spacing(1.5),
    right: theme.spacing(7),
  },
}));

/**
   Main Component
*/
const SiteMapLeaflet = () => {
  const classes = useStyles(Theme);
  const mapRef = useRef(null);

  // Neon Context State
  const [{ data: neonContextData }] = NeonContext.useNeonContextState();
  const {
    sites: allSites,
    states: allStates,
    domains: allDomains,
    stateSites,
    domainSites,
  } = neonContextData;

  // State, Dispatch, and other stuff from SiteMapContext
  const [state, dispatch] = SiteMapContext.useSiteMapContext();
  let canRender = state.neonContextHydrated;
  if (
    state.focusLocation.current
      && state.focusLocation.fetch.status !== FETCH_STATUS.SUCCESS
  ) { canRender = false; }

  // Effect
  // If zoom was not set as a prop then attempt to set the initial zoom such that
  // all sites are visible. This depends on the client dimensions of the map
  // and whether height or width is the deciding factor depends on the aspect ratio.
  useEffect(() => {
    if (
      !canRender || state.map.zoom !== null
        || !mapRef || !mapRef.current || !mapRef.current.container
    ) { return; }
    const mapCont = mapRef.current.container;
    const minorDim = Math.min(mapCont.clientWidth / 136, mapCont.clientHeight / 128);
    const derivedZoom = [1, 2, 4, 6, 11].findIndex(m => m > minorDim);
    dispatch({
      type: 'setMapZoom',
      zoom: derivedZoom === -1 ? 5 : derivedZoom,
    });
  }, [
    canRender,
    state.map.zoom,
    mapRef,
    dispatch,
  ]);

  // Effect
  // If map bounds are null (as they will be when setting a focus location) then fill them in
  // We have to do it this way as only the Leaflet Map instance can give us bounds
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

  if (!canRender) { return null; }

  /**
     Util: Position Popup
     Leaflet's AutoPan for popups does a "transition" of map center to ensure a new popup renders
     in view. This poses a problem when the center is in the main context state - every micro-step
     of the AutoPan transition is a state update. The transition appears to run recursively as it
     causes a max update depth crash. We get around this by solving the same root problem (want
     popups to render in view) in a different way... specifically by positioning them around their
     parent element dynamcally based on which direction has the most room to render.
  */
  const positionPopup = (target = null, latlng = null, hideCloseButton = false) => {
    if (!target || !latlng) { return; }
    const { map: { bounds } } = state;
    const { _popup: popup, _icon: icon } = target;
    popup.setLatLng(latlng);
    const containerPoint = mapRef.current.leafletElement.latLngToContainerPoint(latlng);
    const iconHeight = icon ? icon.height : 0;
    const {
      _container: containerNode,
      _containerLeft: containerLeft,
      _containerBottom: containerBottom,
      _tipContainer: tipNode,
    } = popup;
    containerNode.style.marginBottom = '0px';
    // Leaflet popups always open above; open below if mouse event is in the top half of the map
    if (containerPoint.y < (mapRef.current.container.clientHeight / 2)) {
      const contentHeight = containerNode.clientHeight;
      const tipHeight = tipNode.clientHeight;
      const contentBottom = 0 - iconHeight - contentHeight - tipHeight - (1.5 * containerBottom);
      const tipBottom = contentHeight + tipHeight;
      containerNode.style.bottom = `${contentBottom}px`;
      tipNode.style.transform = `rotate(0.5turn) translate(0px, ${tipBottom}px)`;
    } else {
      containerNode.style.bottom = `${-1.5 * containerBottom}px`;
      popup._tipContainer.style.transform = null;
    }
    // For left/right we move the popup horizontally as needed while keeping the tip stationary
    const contentWidth = containerNode.clientWidth;
    const mapWidth = mapRef.current.container.parentNode.clientWidth || 0;
    const nudgeBuffer = 40;
    const nudgeLimit = (contentWidth / 2) - (nudgeBuffer / 2);
    let overlap = 0;
    if (mapWidth > (contentWidth + (nudgeBuffer * 3))) {
      let nudge = 0;
      if (containerPoint.x - (contentWidth / 2) < 0) {
        overlap = containerPoint.x - (contentWidth / 2);
        nudge = Math.min((0 - overlap) + nudgeBuffer, nudgeLimit);
      } else if (containerPoint.x + (contentWidth / 2) > mapWidth) {
        overlap = mapWidth - containerPoint.x - (contentWidth / 2);
        nudge = Math.min(overlap - nudgeBuffer, nudgeLimit);
      }
      if (nudge !== 0) {
        containerNode.style.left = `${containerLeft + nudge}px`;
      }
      tipNode.style.left = `${(0 - containerLeft) - nudge}px`;
    }
    if (hideCloseButton) {
      popup._closeButton.style.display = 'none';
    }
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
            const featureKey = `${site.terrain.toUpperCase}_${site.type_toUpperCase}_SITES`;
            if (!FEATURES[featureKey]) { return null; }
            const src = selectedSites.has(siteCode)
              ? FEATURES[featureKey].iconSelectedSvg
              : FEATURES[featureKey].iconSvg;
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
    // Groups don't directly render anything
    if (feature.type === FEATURE_TYPES.GROUP) { return null; }
    const featureProps = {
      key,
      featureKey: key,
      classes,
      positionPopup,
    };
    switch (feature.type) {
      case FEATURE_TYPES.SITES:
      case FEATURE_TYPES.LOCATIONS:
        return <SiteBasedFeature {...featureProps} />;

      case FEATURE_TYPES.BOUNDARIES:
        switch (key) {
          case FEATURES.DOMAINS.KEY:
            return <DomainsFeature {...featureProps} renderPopupSitesList={renderPopupSitesList} />;
          case FEATURES.STATES.KEY:
            return <StatesFeature {...featureProps} renderPopupSitesList={renderPopupSitesList} />;
          case FEATURES.SAMPLING_BOUNDARIES.KEY:
          case FEATURES.AQUATIC_REACHES.KEY:
          case FEATURES.FLIGHT_BOX_BOUNDARIES.KEY:
          case FEATURES.WATERSHED_BOUNDARIES.KEY:
          case FEATURES.TOWER_AIRSHEDS.KEY:
            return <SiteBasedFeature {...featureProps} />;
          default:
            return null;
        }
      case FEATURE_TYPES.OTHER:
        switch (key) {
          case FEATURES.DRAINAGE_LINES.KEY:
            return <DrainageLinesFeature {...featureProps} />;
          case FEATURES.POUR_POINTS.KEY:
            return <SiteBasedFeature {...featureProps} />;
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
    const hasProgress = state.overallFetch.pendingHierarchy === 0;
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
  const display = state.view === VIEWS.MAP ? null : 'none';
  return (
    <React.Fragment>
      <Map
        ref={mapRef}
        className={classes.map}
        style={{ display, paddingBottom: `${(state.aspectRatio.currentValue || 0.75) * 100}%` }}
        center={state.map.center}
        zoom={state.map.zoom}
        minZoom={MAP_ZOOM_RANGE[0]}
        maxZoom={MAP_ZOOM_RANGE[1]}
        onMoveEnd={handleMoveEnd}
        onZoomEnd={handleZoomEnd}
        onBaseLayerChange={handleBaseLayerChange}
        worldCopyJump
        data-component="SiteMap"
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
      {renderProgress()}
    </React.Fragment>
  );
};

export default SiteMapLeaflet;
