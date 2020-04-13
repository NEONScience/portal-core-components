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
import Theme, { COLORS } from '../Theme/Theme';

import SiteMapContext from './SiteMapContext';
import {
  TILE_LAYERS,
  TILE_LAYERS_BY_NAME,
  MAP_ZOOM_RANGE,
  ICON_SVGS,
  FEATURES,
  SITE_DETAILS_URL_BASE,
  EXPLORE_DATA_PRODUCTS_URL_BASE,
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
     Used only in SELECT mode, or more specifically, only when popups are on mouse over only and
     do not persist.
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
     Render Method: Sites Popup
  */
  const renderSitePopup = (site) => {
    const selectionEnabled = state.selection.sites.enabled;
    let typeTitle = 'Core';
    let typeSubtitle = 'fixed location';
    if (site.type === 'RELOCATABLE') {
      typeTitle = 'Relocatable';
      typeSubtitle = 'location may change';
    }
    let terrainTitle = 'Terrestrial';
    let terrainSubtitle = 'land-based';
    if (site.terrain === 'AQUATIC') {
      terrainTitle = 'Aquatic';
      terrainSubtitle = 'water-based';
    }
    const terrainTypeTitle = `${terrainTitle} ${typeTitle}`;
    const terrainTypeSubtitle = `${terrainSubtitle}; ${typeSubtitle}`;
    const terrainIcon = (
      <img
        src={ICON_SVGS.SITE_MARKERS[site.type][site.terrain].BASE}
        alt={site.terrain}
        title={`${terrainTitle} ${terrainSubtitle}`}
        width={Theme.spacing(5)}
        height={Theme.spacing(5)}
        style={{ marginRight: Theme.spacing(1) }}
      />
    );
    const stateFieldTitle = (site.stateCode === 'PR' ? 'Territory' : 'State');
    const renderActions = () => {
      if (selectionEnabled) {
        const isSelected = state.selection.sites.siteCodes.has(site.siteCode);
        const verb = isSelected ? 'remove' : 'add';
        const preposition = isSelected ? 'from' : 'to';
        return (
          <SnackbarContent
            className={classes.infoSnackbar}
            message={(
              <div className={classes.startFlex}>
                <ClickIcon className={classes.infoSnackbarIcon} />
                <div>
                  <Typography variant="body2">
                    {/* eslint-disable react/jsx-one-expression-per-line */}
                    Click to <b>{verb}</b> {preposition} selection
                    {/* eslint-enable react/jsx-one-expression-per-line */}
                  </Typography>
                </div>
              </div>
            )}
          />
        );
      }
      const actionButtonProps = {
        className: classes.popupButton,
        variant: 'outlined',
        color: 'primary',
        target: '_blank',
      };
      return (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              endIcon={<SiteDetailsIcon />}
              href={`${SITE_DETAILS_URL_BASE}${site.siteCode}`}
              {...actionButtonProps}
            >
              Site Details
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              endIcon={<ExploreDataProductsIcon />}
              href={`${EXPLORE_DATA_PRODUCTS_URL_BASE}${site.siteCode}`}
              {...actionButtonProps}
            >
              Explore Data
            </Button>
          </Grid>
        </Grid>
      );
    };
    return (
      <Popup className={classes.popup} autoPan={selectionEnabled}>
        <div className={classes.startFlex} style={{ marginBottom: Theme.spacing(1.5) }}>
          {terrainIcon}
          <Typography variant="h6" style={{ lineHeight: '1.4rem' }}>
            {`${site.description} (${site.siteCode})`}
          </Typography>
        </div>
        <Grid container spacing={1} style={{ marginBottom: Theme.spacing(1) }}>
          {/* Terrain and Type */}
          <Grid item xs={8}>
            <Typography variant="subtitle2">{terrainTypeTitle}</Typography>
            <Typography variant="caption"><i>{terrainTypeSubtitle}</i></Typography>
          </Grid>
          {/* State/Territory */}
          <Grid item xs={4} style={{ textAlign: 'right' }}>
            <Typography variant="subtitle2">{stateFieldTitle}</Typography>
            <Typography variant="body2">{allStates[site.stateCode].name}</Typography>
          </Grid>
          {/* Latitude/Longitude */}
          <Grid item xs={5} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <div className={classes.startFlex}>
              <CopyToClipboard text={`${site.latitude} ${site.longitude}`}>
                <Tooltip title="Latitude / Longitude (click to copy)">
                  <IconButton
                    size="small"
                    style={{ marginRight: Theme.spacing(0.5) }}
                    aria-label="Latitude / Longitude (click to copy)"
                  >
                    <LocationIcon />
                  </IconButton>
                </Tooltip>
              </CopyToClipboard>
              <Typography
                variant="caption"
                aria-label="Latitude / Longitude"
                style={{ fontFamily: 'monospace', textAlign: 'right' }}
              >
                {site.latitude}
                <br />
                {site.longitude}
              </Typography>
            </div>
          </Grid>
          {/* Domain */}
          <Grid item xs={7} style={{ textAlign: 'right' }}>
            <Typography variant="subtitle2">Domain</Typography>
            <Typography variant="body2">
              {`${site.domainCode} - ${allDomains[site.domainCode].name}`}
            </Typography>
          </Grid>
        </Grid>
        {renderActions()}
      </Popup>
    );
  };

  /**
     Render Method: Sites Feature
  */
  const renderSitesFeature = (key) => {
    if (!FEATURES[key]) { return null; }
    const feature = FEATURES[key];
    const siteCodes = Object.keys(allSites).filter(siteCode => (
      allSites[siteCode].type === feature.attributes.type
        && allSites[siteCode].terrain === feature.attributes.terrain
    ));
    const getInteractionProps = (site, isSelected) => (
      state.selection.sites.enabled ? {
        onMouseOver: (e) => { e.target.openPopup(); positionPopup(e); },
        onMouseOut: (e) => { e.target.closePopup(); },
        onClick: (e) => {
          /* eslint-disable no-underscore-dangle */
          e.target._icon.className = getIconClassName(classes, site.type, !isSelected);
          e.target._icon.blur();
          dispatch({ type: 'toggleSiteSelected', site: site.siteCode });
          /* eslint-enable no-underscore-dangle */
        },
      } : {}
    );
    return (
      <FeatureGroup key={key}>
        {siteCodes.map((siteCode) => {
          const site = allSites[siteCode];
          const isSelected = state.selection.sites.siteCodes.has(siteCode);
          if (
            !state.map.zoomedIcons.SITE_MARKERS[site.type]
              || !state.map.zoomedIcons.SITE_MARKERS[site.type][site.terrain]
              || !site.latitude || !site.longitude
          ) { return null; }
          const rootIcon = state.map.zoomedIcons.SITE_MARKERS[site.type][site.terrain];
          return (
            <Marker
              key={siteCode}
              position={[site.latitude, site.longitude]}
              icon={rootIcon[isSelected ? 'SELECTED' : 'BASE']}
              {...getInteractionProps(site, isSelected)}
            >
              {renderSitePopup(site)}
            </Marker>
          );
        })}
      </FeatureGroup>
    );
  };

  /**
     Render Method: Plots Feature
  */
  const renderPlotsFeature = () => null;

  /**
     Render Method: NEON Domains
  */
  const renderNeonDomainsFeature = () => null;

  /**
     Render Method: US States
  */
  const renderUsStatesFeature = () => null;

  /**
     Render Method: All Features
  */
  const renderFeature = (key) => {
    if (!FEATURES[key]) { return null; }
    const feature = FEATURES[key];
    // Parents are groups only and don't render anything
    if (feature.isParent) { return null; }
    // SITE and PLOT attributed features have common render functions
    if (feature.hasAttributes === 'SITE') { return renderSitesFeature(key); }
    if (feature.hasAttributes === 'PLOT') { return renderPlotsFeature(key); }
    switch (key) {
      case 'NEON_DOMAINS':
        return renderNeonDomainsFeature();
      case 'US_STATES':
        return renderUsStatesFeature();
      default:
        return null;
    }
  };

  /**
     Interaction Handlers
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
      classes,
    });
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
