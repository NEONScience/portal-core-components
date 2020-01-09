import React, { useRef, useReducer, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';

import { map, catchError } from 'rxjs/operators';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import SiteDetailsIcon from '@material-ui/icons/InfoOutlined';
import ErrorIcon from '@material-ui/icons/Warning';
import ExploreDataProductsIcon from '@material-ui/icons/InsertChartOutlined';

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

import Theme, { COLORS } from '../Theme/Theme';
import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';

import sitesJSON from '../../static/sites/sites.json';
import statesJSON from '../../static/states/states.json';
import statesShapesJSON from '../../static/statesShapes/statesShapes.json';
import domainsJSON from '../../static/domains/domains.json';
import domainsShapesJSON from '../../static/domainsShapes/domainsShapes.json';

import iconShadowSVG from './icon-shadow.svg';
import iconAquaticSVG from './icon-aquatic.svg';
import iconTerrestrialSVG from './icon-terrestrial.svg';

const { BaseLayer, Overlay } = LayersControl;

const ICON_SVGS = {
  AQUATIC: iconAquaticSVG,
  TERRESTRIAL: iconTerrestrialSVG,
  SHADOW: iconShadowSVG,
};

const SITE_DETAILS_URL_BASE = 'https://www.neonscience.org/field-sites/field-sites-map/';
const EXPLORE_DATA_PRODUCTS_URL_BASE = 'https://data.neonscience.org/data-products/explore?site=';

export const TILE_LAYERS = {
  NatGeo_World_Map: {
    name: 'National Geographic',
    shortAttribution: '© Natl. Geographic et al.',
    fullAttribution: '© National Geographic, Esri, Garmin, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
    overlayColor: Theme.palette.primary.main,
  },
  World_Imagery: {
    name: 'Satellite Imagery',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    overlayColor: COLORS.ORANGE[500],
  },
  World_Street_Map: {
    name: 'Streets',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, OSM contributors, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    overlayColor: Theme.palette.primary.main,
  },
  World_Topo_Map: {
    name: 'Topographic',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, HERE, Garmin, Intermap, iPC, GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), OSM contributors, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    overlayColor: Theme.palette.primary.main,
  },
};
const TILE_LAYERS_BY_NAME = {};
Object.keys(TILE_LAYERS).forEach((key) => {
  TILE_LAYERS_BY_NAME[TILE_LAYERS[key].name] = key;
});

const useStyles = makeStyles(theme => ({
  notFetchedContainer: {
    width: '100%',
    height: '0px', // Necessary to set a fixed aspect ratio from props (using paddingBottom)
    position: 'relative',
    backgroundColor: COLORS.BLUE[200],
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: theme.spacing(1),
  },
  notFetchedPaper: {
    position: 'absolute',
    width: '70%',
    top: '50%',
    transform: 'translate(0%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
  },
  map: {
    width: '100%',
    height: '0px', // Necessary to set a fixed aspect ratio from props (using paddingBottom)
    overflow: 'hidden',
    borderRadius: theme.spacing(1),
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
  startFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
}));

const SiteMap = (props) => {
  const {
    aspectRatio,
    center,
    tileLayer: tileLayerProp,
    zoom: zoomProp,
    sites: sitesProp,
    popupHrefNew,
    popupExploreDataProductsButton,
  } = props;
  const classes = useStyles(Theme);
  const mapRef = useRef(null);

  const sitesArrayToKeyedObject = (sitesArray = []) => {
    if (!Array.isArray(sitesArray)) { return {}; }
    const sites = {};
    sitesArray.forEach((site) => {
      sites[site.siteCode] = {
        siteCode: site.siteCode || site.code,
        description: site.siteDescription || site.description,
        type: site.siteType || site.type,
        stateCode: site.stateCode,
        domainCode: site.domainCode,
        latitude: site.siteLatitude || site.latitude,
        longitude: site.siteLongitude || site.longitude,
        terrain: site.terrain || sitesJSON[site.siteCode].terrain,
      };
    });
    return sites;
  };

  /**
     Prepare sites object. Our preferred shape looks like this:
     {
       ABBY: {
         description: 'Abby Road',
         type: 'RELOCATABLE',
         stateCode: 'WA',
         domainCode: 'D16',
         terrain: 'TERRESTRIAL',
         latitude: 45.762439,
         longitude: -122.330317,
       },
       ...
     }
     We may be passed something from props that is either this or the API response
     shape, so massage whatever we have into something we can use.
  */
  let sites = {};
  let fetchSitesStatus = 'awaitingFetchCall';
  if (sitesProp) {
    if (Array.isArray(sitesProp)) {
      sites = sitesArrayToKeyedObject(sitesProp);
      fetchSitesStatus = 'fetched';
    } else if (typeof sitesProp === 'object' && Object.keys(sitesProp).length > 0) {
      sites = { ...sitesProp };
      Object.keys(sites).forEach((siteCode) => {
        if (!sites[siteCode].terrain) {
          sites[siteCode].terrain = sitesJSON[siteCode].terrain;
        }
      });
      fetchSitesStatus = 'fetched';
    }
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'fetchSitesCalled':
        return { ...state, fetchSitesStatus: 'fetching' };
      case 'fetchSitesSucceeded':
        return { ...state, fetchSitesStatus: 'fetched', sites: action.sites };
      case 'fetchSitesFailed':
        return { ...state, fetchSitesStatus: 'error', fetchSitesError: action.error };
      case 'setTileLayer':
        if (!TILE_LAYERS[action.tileLayer]) { return state; }
        return { ...state, tileLayer: action.tileLayer };
      /*
      case 'setSitesOverlay':
        return { ...state, sitesOverlay: action.visible };
      case 'setExclusiveOverlay':
        return {
          ...state,
          statesOverlay: (action.eventName === 'US States' && action.eventType === 'overlayadd'),
        };
      */
      case 'setZoom':
        return { ...state, zoom: action.zoom };
      default:
        return state;
    }
  };

  const initialState = {
    zoom: zoomProp,
    tileLayer: tileLayerProp,
    sites,
    fetchSitesStatus,
    fetchSitesError: null,
    sitesOverlay: true,
    statesOverlay: false,
    domainsOverlay: false,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // If zoom was not set as a prop then attemp to set the initial zoom such that
  // all sites are visible. This depends on the client dimenaions of the map itself,
  // and whether height or width is the deciding factor depends on the aspect ratio.
  useEffect(() => {
    if (state.zoom === null && mapRef && mapRef.current && mapRef.current.container) {
      const mapCont = mapRef.current.container;
      const minorDim = Math.min(mapCont.clientWidth / 136, mapCont.clientHeight / 128);
      const derivedZoom = [1, 2, 4, 6, 11].findIndex(m => m > minorDim);
      dispatch({ type: 'setZoom', zoom: derivedZoom === -1 ? 5 : derivedZoom });
    }
  });

  const fetchAllSites$ = NeonGraphQL.getAllSites().pipe(
    map((response) => {
      if (response.response && response.response.data && response.response.data.sites) {
        const sitesResponse = sitesArrayToKeyedObject(response.response.data.sites);
        dispatch({ type: 'fetchSitesSucceeded', sites: sitesResponse });
      } else {
        dispatch({ type: 'fetchSitesFailed', error: 'malformed response' });
      }
    }),
    catchError((error) => {
      dispatch({ type: 'fetchSitesFailed', error });
    }),
  );

  useEffect(() => {
    if (state.fetchSitesStatus === 'awaitingFetchCall') {
      dispatch({ type: 'fetchSitesCalled' });
      fetchAllSites$.subscribe();
    }
  });

  if (state.fetchSitesStatus !== 'fetched') {
    let notFetchedContents = (
      <React.Fragment>
        <Typography variant="h6" component="h3" gutterBottom>
          Loading Sites...
        </Typography>
        <CircularProgress />
      </React.Fragment>
    );
    if (state.fetchSitesStatus === 'error') {
      notFetchedContents = (
        <React.Fragment>
          <ErrorIcon fontSize="large" color="error" />
          <Typography variant="h6" component="h3" style={{ marginTop: Theme.spacing(1) }}>
            {`Unable to load sites: ${state.fetchSitesError}`}
          </Typography>
        </React.Fragment>
      );
    }
    return (
      <div
        className={classes.notFetchedContainer}
        style={{ paddingBottom: `${aspectRatio * 100}%` }}
      >
        <Paper className={classes.notFetchedPaper}>
          {notFetchedContents}
        </Paper>
      </div>
    );
  }

  const getZoomedIcon = (terrain = 'TERRESTRIAL') => {
    if (!ICON_SVGS[terrain] || !ICON_SVGS.SHADOW) { return null; }
    const iconScale = 0.2 + (Math.floor((state.zoom - 2) / 3) / 10);
    return new L.Icon({
      iconUrl: ICON_SVGS[terrain],
      iconRetinaUrl: ICON_SVGS[terrain],
      iconSize: [100, 100].map(x => x * iconScale),
      iconAnchor: [50, 100].map(x => x * iconScale),
      shadowUrl: ICON_SVGS.SHADOW,
      shadowSize: [156, 93].map(x => x * iconScale),
      shadowAnchor: [50, 95].map(x => x * iconScale),
      popupAnchor: [0, -100].map(x => x * iconScale),
    });
  };

  const renderSitePopup = (site) => {
    let terrainTitle = 'Terrestrial';
    let terrainSubtitle = '(land-based)';
    if (site.terrain === 'AQUATIC') {
      terrainTitle = 'Aquatic';
      terrainSubtitle = '(water-based)';
    }
    const terrainIcon = (
      <img
        src={ICON_SVGS[site.terrain]}
        alt={site.terrain}
        title={`${terrainTitle} ${terrainSubtitle}`}
        width={Theme.spacing(5)}
        height={Theme.spacing(5)}
        style={{ marginRight: Theme.spacing(1) }}
      />
    );
    const target = popupHrefNew ? { target: '_blank' } : {};
    const siteDetailsButton = (
      <Button
        className={classes.popupButton}
        variant="outlined"
        color="primary"
        endIcon={<SiteDetailsIcon />}
        href={`${SITE_DETAILS_URL_BASE}${site.siteCode}`}
        {...target}
      >
        Site Details
      </Button>
    );
    const exploreDataProductsButton = popupExploreDataProductsButton ? (
      <Button
        className={classes.popupButton}
        variant="outlined"
        color="primary"
        endIcon={<ExploreDataProductsIcon />}
        href={`${EXPLORE_DATA_PRODUCTS_URL_BASE}${site.siteCode}`}
        {...target}
      >
        Explore Data Products
      </Button>
    ) : null;
    const renderField = (title, value, marginBottom = 2) => (
      <div style={{ marginBottom: Theme.spacing(marginBottom) }}>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="body2">{value}</Typography>
      </div>
    );
    const stateFieldTitle = (site.stateCode === 'PR' ? 'Territory' : 'State');
    return (
      <Popup className={classes.popup}>
        <Typography variant="h5" gutterBottom>
          {`${site.description} (${site.siteCode})`}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div className={classes.startFlex} style={{ marginBottom: Theme.spacing(2) }}>
              {terrainIcon}
              {renderField(terrainTitle, terrainSubtitle, 0)}
            </div>
            {renderField('Latitude/Longitude', `${site.latitude}, ${site.longitude}`)}
          </Grid>
          <Grid item xs={6}>
            {renderField(stateFieldTitle, statesJSON[site.stateCode].name)}
            {renderField('Domain', `${site.domainCode} - ${domainsJSON[site.domainCode].name}`)}
          </Grid>
        </Grid>
        {siteDetailsButton}
        <br />
        {exploreDataProductsButton}
      </Popup>
    );
  };

  const renderSitesOverlay = () => {
    // Get new icons scaled to the current zoom level every render
    const zoomedIcons = {
      AQUATIC: getZoomedIcon('AQUATIC'),
      TERRESTRIAL: getZoomedIcon('TERRESTRIAL'),
    };
    return (
      <Overlay name="NEON Sites" checked={state.sitesOverlay}>
        <FeatureGroup>
          {Object.keys(state.sites).map((siteCode) => {
            const site = state.sites[siteCode];
            if (!site.latitude || !site.longitude || !zoomedIcons[site.terrain]) { return null; }
            return (
              <Marker
                key={siteCode}
                position={[site.latitude, site.longitude]}
                icon={zoomedIcons[site.terrain]}
              >
                {renderSitePopup(site)}
              </Marker>
            );
          })}
        </FeatureGroup>
      </Overlay>
    );
  };

  const renderStatePopup = (stateCode) => {
    if (!statesJSON[stateCode]) { return null; }
    const stateName = statesJSON[stateCode].name;
    return (
      <Popup className={classes.popup}>
        <Typography variant="h6" gutterBottom>
          {`${stateName} (${stateCode})`}
        </Typography>
      </Popup>
    );
  };

  const renderStatesOverlay = () => (
    <Overlay name="US States" checked={state.statesOverlay}>
      <FeatureGroup>
        {statesShapesJSON.features.map(usState => (
          <Polygon
            key={usState.properties.stateCode}
            color={TILE_LAYERS[state.tileLayer].overlayColor}
            positions={usState.geometry.coordinates}
          >
            {renderStatePopup(usState.properties.stateCode)}
          </Polygon>
        ))}
      </FeatureGroup>
    </Overlay>
  );

  const renderDomainPopup = (domainCode) => {
    if (!domainsJSON[domainCode]) { return null; }
    const domainName = domainsJSON[domainCode].name;
    return (
      <Popup className={classes.popup}>
        <Typography variant="h6" gutterBottom>
          {`${domainName} (${domainCode})`}
        </Typography>
      </Popup>
    );
  };

  const renderDomainsOverlay = () => (
    <Overlay name="NEON Domains" checked={state.domainsOverlay}>
      <FeatureGroup>
        {domainsShapesJSON.features.map(domain => (
          <Polygon
            key={domain.properties.domainCode}
            color={TILE_LAYERS[state.tileLayer].overlayColor}
            positions={domain.geometry.coordinates}
          >
            {renderDomainPopup(domain.properties.domainCode)}
          </Polygon>
        ))}
      </FeatureGroup>
    </Overlay>
  );

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
        checked={key === state.tileLayer}
      >
        <TileLayer key={key} url={tileLayer.url} attribution={attributionString} />
      </BaseLayer>
    );
  };

  /**
     Map event handlers
  */
  const handleZoomEnd = (event) => {
    dispatch({ type: 'setZoom', zoom: event.target.getZoom() });
  };
  const handleBaseLayerChange = (event) => {
    if (!event.name || !TILE_LAYERS_BY_NAME[event.name]) { return; }
    dispatch({ type: 'setTileLayer', tileLayer: TILE_LAYERS_BY_NAME[event.name] });
  };

  /**
     Render the Map
  */
  return (
    <Map
      ref={mapRef}
      className={classes.map}
      style={{ paddingBottom: `${aspectRatio * 100}%` }}
      center={center}
      zoom={state.zoom}
      maxZoom={16}
      minZoom={1}
      onZoomEnd={handleZoomEnd}
      onBaseLayerChange={handleBaseLayerChange}
    >
      <ScaleControl imperial metric updateWhenIdle />
      <LayersControl position="topright">
        {Object.keys(TILE_LAYERS).map(renderTileLayer)}
        {renderDomainsOverlay()}
        {renderStatesOverlay()}
        {renderSitesOverlay()}
      </LayersControl>
    </Map>
  );
};

SiteMap.propTypes = {
  aspectRatio: PropTypes.number,
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  tileLayer: PropTypes.oneOf(Object.keys(TILE_LAYERS)),
  popupHrefNew: PropTypes.bool,
  popupExploreDataProductsButton: PropTypes.bool,
  sites: PropTypes.oneOf([
    PropTypes.arrayOf(
      PropTypes.shape({
        siteCode: PropTypes.string.isRequired,
        siteDescription: PropTypes.string.isRequired,
        siteLatitude: PropTypes.number.isRequired,
        siteLongitude: PropTypes.number.isRequired,
        siteType: PropTypes.string,
        domainCode: PropTypes.string,
        stateCode: PropTypes.string,
        terrain: PropTypes.string,
      }),
    ),
    PropTypes.objectOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        terrain: PropTypes.string.isRequired,
        domainCode: PropTypes.string.isRequired,
        stateCode: PropTypes.string.isRequired,
      }),
    ),
  ]),
};

SiteMap.defaultProps = {
  aspectRatio: 0.75,
  center: [52.68, -110.75],
  tileLayer: 'NatGeo_World_Map',
  zoom: null,
  popupHrefNew: true,
  popupExploreDataProductsButton: true,
  sites: null,
};

export default SiteMap;
