import React, { useReducer, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';

import { map, catchError } from 'rxjs/operators';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SiteDetailsIcon from '@material-ui/icons/InfoOutlined';
import ExploreDataProductsIcon from '@material-ui/icons/InsertChartOutlined';

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

import {
  Map,
  TileLayer,
  ScaleControl,
  LayersControl,
  Marker,
  Popup,
} from 'react-leaflet';

import Theme from '../Theme/Theme';
import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';

import sitesJSON from '../../static/sites/sites.json';
import statesJSON from '../../static/states/states.json';
import domainsJSON from '../../static/domains/domains.json';

import iconShadowSVG from './icon-shadow.svg';
import iconAquaticSVG from './icon-aquatic.svg';
import iconTerrestrialSVG from './icon-terrestrial.svg';

const ICON_SVGS = {
  AQUATIC: iconAquaticSVG,
  TERRESTRIAL: iconTerrestrialSVG,
  SHADOW: iconShadowSVG,
};

const SITE_DETAILS_URL_BASE = 'https://www.neonscience.org/field-sites/field-sites-map/';
const EXPLORE_DATA_PRODUCTS_URL_BASE = 'https://data.neonscience.org/data-products/explore?site=';

const TILE_LAYERS = {
  NatGeo_World_Map: {
    name: 'National Geographic',
    shortAttribution: '© Natl. Geographic et al.',
    fullAttribution: '© National Geographic, Esri, Garmin, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
  },
  World_Imagery: {
    name: 'Satellite Imagery',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  },
  World_Street_Map: {
    name: 'Streets',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, OSM contributors, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
  },
  World_Topo_Map: {
    name: 'Topographic',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, HERE, Garmin, Intermap, iPC, GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), OSM contributors, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
  },
};

const useStyles = makeStyles(theme => ({
  map: {
    width: '100%',
    height: '0px', // Necessary to set a fixed aspect ratio from props (using paddingBottom)
    overflow: 'hidden',
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
    zoom: initialZoom,
    sites: sitesProp,
    popupHrefNew,
    popupExploreDataProductsButton,
  } = props;
  const classes = useStyles(Theme);

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
      case 'setZoom':
        return { ...state, zoom: action.zoom };
      default:
        return state;
    }
  };

  const initialState = {
    zoom: initialZoom,
    tileLayer: tileLayerProp,
    sites,
    fetchSitesStatus,
    fetchSitesError: null,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

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
    return (
      <div>
        {state.fetchSitesStatus}
      </div>
    );
  }

  const renderLayersControl = () => {
    const { BaseLayer } = LayersControl;
    return (
      <LayersControl position="topright">
        {Object.keys(TILE_LAYERS).map((key) => {
          const tileLayer = TILE_LAYERS[key];
          const attributionNode = (
            <div title={tileLayer.fullAttribution} className={classes.attribution}>
              {tileLayer.shortAttribution}
            </div>
          );
          const attributionString = ReactDOMServer.renderToStaticMarkup(attributionNode);
          return (
            <BaseLayer key={key} checked={key === state.tileLayer} name={tileLayer.name}>
              <TileLayer url={tileLayer.url} attribution={attributionString} />
            </BaseLayer>
          );
        })}
      </LayersControl>
    );
  };

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

  const renderSiteMarkers = () => {
    const zoomedIcons = {
      AQUATIC: getZoomedIcon('AQUATIC'),
      TERRESTRIAL: getZoomedIcon('TERRESTRIAL'),
    };
    return Object.keys(state.sites).map((siteCode) => {
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
    });
  };

  return (
    <Map
      className={classes.map}
      style={{ paddingBottom: `${aspectRatio * 100}%` }}
      center={center}
      zoom={state.zoom}
      maxZoom={17}
      minZoom={2}
      onZoomEnd={(event) => { dispatch({ type: 'setZoom', zoom: event.target.getZoom() }); }}
    >
      {renderLayersControl()}
      {renderSiteMarkers()}
      <ScaleControl imperial metric updateWhenIdle />
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
  center: [44.967, -103.767],
  tileLayer: 'NatGeo_World_Map',
  zoom: 3,
  popupHrefNew: true,
  popupExploreDataProductsButton: true,
  sites: null,
};

export default SiteMap;
