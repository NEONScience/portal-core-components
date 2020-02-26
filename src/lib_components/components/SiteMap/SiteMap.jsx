import React, { useRef, useReducer, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import ClickIcon from '@material-ui/icons/TouchApp';
import ErrorIcon from '@material-ui/icons/Warning';
import ExploreDataProductsIcon from '@material-ui/icons/InsertChartOutlined';
import LocationIcon from '@material-ui/icons/MyLocation';
import SiteDetailsIcon from '@material-ui/icons/InfoOutlined';

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
import NeonPage from '../NeonPage/NeonPage';

import statesShapesJSON from '../../staticJSON/statesShapes.json';
import domainsShapesJSON from '../../staticJSON/domainsShapes.json';

import iconCoreTerrestrialSVG from './icon-core-terrestrial.svg';
import iconCoreTerrestrialSelectedSVG from './icon-core-terrestrial-selected.svg';
import iconCoreAquaticSVG from './icon-core-aquatic.svg';
import iconCoreAquaticSelectedSVG from './icon-core-aquatic-selected.svg';
import iconCoreShadowSVG from './icon-core-shadow.svg';
import iconCoreShadowSelectedSVG from './icon-core-shadow-selected.svg';
import iconRelocatableTerrestrialSVG from './icon-relocatable-terrestrial.svg';
import iconRelocatableTerrestrialSelectedSVG from './icon-relocatable-terrestrial-selected.svg';
import iconRelocatableAquaticSVG from './icon-relocatable-aquatic.svg';
import iconRelocatableAquaticSelectedSVG from './icon-relocatable-aquatic-selected.svg';
import iconRelocatableShadowSVG from './icon-relocatable-shadow.svg';
import iconRelocatableShadowSelectedSVG from './icon-relocatable-shadow-selected.svg';

const { BaseLayer, Overlay } = LayersControl;

export const SITE_MAP_MODES = {
  EXPLORE: 'EXPLORE',
  SELECT: 'SELECT',
};

const ICON_SVGS = {
  CORE: {
    AQUATIC: {
      BASE: iconCoreAquaticSVG,
      SELECTED: iconCoreAquaticSelectedSVG,
    },
    TERRESTRIAL: {
      BASE: iconCoreTerrestrialSVG,
      SELECTED: iconCoreTerrestrialSelectedSVG,
    },
    SHADOW: {
      BASE: iconCoreShadowSVG,
      SELECTED: iconCoreShadowSelectedSVG,
    },
  },
  RELOCATABLE: {
    AQUATIC: {
      BASE: iconRelocatableAquaticSVG,
      SELECTED: iconRelocatableAquaticSelectedSVG,
    },
    TERRESTRIAL: {
      BASE: iconRelocatableTerrestrialSVG,
      SELECTED: iconRelocatableTerrestrialSelectedSVG,
    },
    SHADOW: {
      BASE: iconRelocatableShadowSVG,
      SELECTED: iconRelocatableShadowSelectedSVG,
    },
  },
};

const SITE_DETAILS_URL_BASE = 'https://www.neonscience.org/field-sites/field-sites-map/';
const EXPLORE_DATA_PRODUCTS_URL_BASE = 'https://data.neonscience.org/data-products/explore?site=';

export const TILE_LAYERS = {
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
const TILE_LAYERS_BY_NAME = {};
Object.keys(TILE_LAYERS).forEach((key) => {
  TILE_LAYERS_BY_NAME[TILE_LAYERS[key].name] = key;
});

const boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
const rootOverlayColors = {
  states: '#3cdd85', // COLORS.RED[300],
  domains: '#a36ce5', // COLORS.GREY[300],
  partialSelected: COLORS.SECONDARY_BLUE[300],
  totalSelected: COLORS.SECONDARY_BLUE[500],
  hover: COLORS.SECONDARY_BLUE[100],
};
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
    boxShadow,
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

const SiteMap = (props) => {
  const {
    aspectRatio,
    center,
    mode,
    tileLayer: tileLayerProp,
    zoom: zoomProp,
  } = props;
  const classes = useStyles(Theme);
  const mapRef = useRef(null);

  const [{ data: neonContextData, fetches: neonContextFetches }] = NeonPage.useNeonContextState();
  const { sites: allSites, states: allStates, domains: allDomains } = neonContextData;

  /**
     Icon Setup
  */
  const getIconClassName = (type, isSelected) => ([
    classes.mapIcon,
    classes[`mapIcon${type}`],
    classes[`mapIcon${isSelected ? 'Selected' : 'Unselected'}`],
  ].join(' '));
  // Get a leaflet icon instance scaled to the current zoom level.
  const getZoomedIcon = (zoom = 3, type, terrain, isSelected = false) => {
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
      className: getIconClassName(type, isSelected),
    });
  };
  // Get a structure containing all zoomed leaflet icon instances. These are stored in
  // state and regenerated any time the zoom level changes. This makes for a maximum of
  // eight distinct icon instances in memory instead of one for every site.
  const getZoomedIcons = zoom => ({
    CORE: {
      AQUATIC: {
        BASE: getZoomedIcon(zoom, 'CORE', 'AQUATIC'),
        SELECTED: getZoomedIcon(zoom, 'CORE', 'AQUATIC', true),
      },
      TERRESTRIAL: {
        BASE: getZoomedIcon(zoom, 'CORE', 'TERRESTRIAL'),
        SELECTED: getZoomedIcon(zoom, 'CORE', 'TERRESTRIAL', true),
      },
    },
    RELOCATABLE: {
      AQUATIC: {
        BASE: getZoomedIcon(zoom, 'RELOCATABLE', 'AQUATIC'),
        SELECTED: getZoomedIcon(zoom, 'RELOCATABLE', 'AQUATIC', true),
      },
      TERRESTRIAL: {
        BASE: getZoomedIcon(zoom, 'RELOCATABLE', 'TERRESTRIAL'),
        SELECTED: getZoomedIcon(zoom, 'RELOCATABLE', 'TERRESTRIAL', true),
      },
    },
  });

  /**
     State and Reducer Setup
  */

  // Derive values for stateSites and domainSites in state. This is a one-time mapping we
  // generate when sites are loaded into state containing lists of site codes for each
  // state code / domain code.
  const deriveRegionSites = (state) => {
    const stateSites = {};
    const domainSites = {};
    Object.keys(allSites).forEach((siteCode) => {
      const { stateCode, domainCode } = allSites[siteCode];
      if (!stateSites[stateCode]) { stateSites[stateCode] = new Set(); }
      if (!domainSites[domainCode]) { domainSites[domainCode] = new Set(); }
      stateSites[stateCode].add(siteCode);
      domainSites[domainCode].add(siteCode);
    });
    // Fill in empty sets for any states that had no NEON sites
    Object.keys(allStates).forEach((stateCode) => {
      if (!stateSites[stateCode]) { stateSites[stateCode] = new Set(); }
    });
    return { ...state, stateSites, domainSites };
  };

  // Derive the selected status of a given region (US state or NEON domain). This should run
  // every time the list of selected sites changes. It regenerates selectedStates and
  // selectedDomains in state to each contain a key/value lookup where the key is the region code
  // (state code or domain code) and the value is either 'total' (all sites selected) or 'partial'
  // (some sites selected). If no sites are selected for the region it is omitted from the map.
  const deriveRegionSelections = (state) => {
    const derive = (regionType) => {
      const regionKey = regionType === 'states' ? 'stateSites' : 'domainSites';
      const selectedRegions = {};
      Object.keys(state[regionKey]).forEach((regionCode) => {
        const regionSitesSet = new Set(state[regionKey][regionCode]);
        const intersection = [...regionSitesSet].filter(x => state.selectedSites.has(x));
        if (!intersection.length) { return; }
        selectedRegions[regionCode] = (
          intersection.length === regionSitesSet.size ? 'total' : 'partial'
        );
      });
      return selectedRegions;
    };
    return { ...state, selectedStates: derive('states'), selectedDomains: derive('domains') };
  };

  const reducer = (state, action) => {
    const selectedSites = new Set(state.selectedSites);
    let setMethod = null;
    switch (action.type) {
      case 'setDerivedRegionSites':
        return deriveRegionSites({ ...state, regionSitesDerived: true });
      case 'setTileLayer':
        if (!TILE_LAYERS[action.tileLayer]) { return state; }
        return { ...state, tileLayer: action.tileLayer };
      case 'setZoom':
        return { ...state, zoom: action.zoom, zoomedIcons: getZoomedIcons(action.zoom) };
      case 'toggleSiteSelected':
        if (selectedSites.has(action.site)) {
          selectedSites.delete(action.site);
        } else {
          selectedSites.add(action.site);
        }
        return deriveRegionSelections({ ...state, selectedSites });
      case 'toggleStateSelected':
        setMethod = state.selectedStates[action.stateCode] === 'total' ? 'delete' : 'add';
        state.stateSites[action.stateCode].forEach((siteCode) => {
          selectedSites[setMethod](siteCode);
        });
        return deriveRegionSelections({ ...state, selectedSites });
      case 'toggleDomainSelected':
        setMethod = state.selectedDomains[action.domainCode] === 'total' ? 'delete' : 'add';
        state.domainSites[action.domainCode].forEach((siteCode) => {
          selectedSites[setMethod](siteCode);
        });
        return deriveRegionSelections({ ...state, selectedSites });
      default:
        return state;
    }
  };

  let initialState = {
    zoom: zoomProp,
    tileLayer: tileLayerProp,
    regionSitesDerived: false,
    stateSites: {}, // derived once from sites
    domainSites: {}, // derived once from sites
    sitesOverlay: true,
    statesOverlay: false,
    domainsOverlay: false,
    selectedSites: new Set(),
    selectedStates: {}, // derived from selectedSites when changed
    selectedDomains: {}, // derived from selectedSites when changed
  };
  initialState.zoomedIcons = getZoomedIcons(zoomProp);
  if (neonContextFetches.sites.status === 'SUCCESS') {
    initialState = deriveRegionSites({ ...initialState, regionSitesDerived: true });
  }
  const [state, dispatch] = useReducer(reducer, initialState);

  /**
     Effects
  */
  // Derive region/site lists in local state if the NeonContext state has finished loading
  useEffect(() => {
    if (state.regionSitesDerived || neonContextFetches.sites.status !== 'SUCCESS') { return; }
    dispatch({ type: 'setDerivedRegionSites' });
  }, [state.regionSitesDerived, neonContextFetches.sites.status]);

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

  /**
     Utils
  */
  // Used only in SELECT mode, or more specifically, only when popups are on mouse over only and
  // do not persist.
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
     Secondary Render - Loading and Error states
  */
  if (neonContextFetches.sites.status !== 'SUCCESS') {
    let notFetchedContents = (
      <React.Fragment>
        <Typography variant="h6" component="h3" gutterBottom>
          Loading Sites...
        </Typography>
        <CircularProgress />
      </React.Fragment>
    );
    if (neonContextFetches.sites.status === 'ERROR') {
      notFetchedContents = (
        <React.Fragment>
          <ErrorIcon fontSize="large" color="error" />
          <Typography variant="h6" component="h3" style={{ marginTop: Theme.spacing(1) }}>
            {`Unable to load sites: ${neonContextFetches.sites.error}`}
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

  /**
     Render Sites
  */
  const renderSitePopup = (site) => {
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
        src={ICON_SVGS[site.type][site.terrain].BASE}
        alt={site.terrain}
        title={`${terrainTitle} ${terrainSubtitle}`}
        width={Theme.spacing(5)}
        height={Theme.spacing(5)}
        style={{ marginRight: Theme.spacing(1) }}
      />
    );
    const stateFieldTitle = (site.stateCode === 'PR' ? 'Territory' : 'State');
    const renderActions = () => {
      if (mode === 'SELECT') {
        const isSelected = state.selectedSites.has(site.siteCode);
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
      <Popup className={classes.popup} autoPan={mode !== 'SELECT'}>
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

  const renderSitesOverlay = () => {
    const overlayName = ReactDOMServer.renderToStaticMarkup(
      <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
        <div>NEON Sites</div>
        <div className={classes.startFlex}>
          <img
            alt="Terrestrial Core"
            src={ICON_SVGS.CORE.TERRESTRIAL.BASE}
            className={classes.keySiteIcon}
          />
          <div>Terrestrial Core</div>
        </div>
        <div className={classes.startFlex}>
          <img
            alt="Terrestrial Relocatable"
            src={ICON_SVGS.RELOCATABLE.TERRESTRIAL.BASE}
            className={classes.keySiteIcon}
          />
          <div>Terrestrial Relocatable</div>
        </div>
        <div className={classes.startFlex}>
          <img
            alt="Aquatic Core"
            src={ICON_SVGS.CORE.AQUATIC.BASE}
            className={classes.keySiteIcon}
          />
          <div>Aquatic Core</div>
        </div>
        <div className={classes.startFlex}>
          <img
            alt="Aquatic Relocatable"
            src={ICON_SVGS.RELOCATABLE.AQUATIC.BASE}
            className={classes.keySiteIcon}
          />
          <div>Aquatic Relocatable</div>
        </div>
      </div>,
    );
    return (
      <Overlay name={overlayName} checked={state.sitesOverlay}>
        <FeatureGroup>
          {Object.keys(allSites).map((siteCode) => {
            const site = allSites[siteCode];
            const isSelected = state.selectedSites.has(siteCode);
            if (!state.zoomedIcons[site.type] || !state.zoomedIcons[site.type][site.terrain]
                || !site.latitude || !site.longitude) {
              return null;
            }
            const interactionProps = (mode === 'SELECT') ? {
              onMouseOver: (e) => { e.target.openPopup(); positionPopup(e); },
              onMouseOut: (e) => { e.target.closePopup(); },
              onClick: (e) => {
                /* eslint-disable no-underscore-dangle */
                e.target._icon.className = getIconClassName(site.type, !isSelected);
                e.target._icon.blur();
                dispatch({ type: 'toggleSiteSelected', site: siteCode });
                /* eslint-enable no-underscore-dangle */
              },
            } : {};
            return (
              <Marker
                key={siteCode}
                position={[site.latitude, site.longitude]}
                icon={state.zoomedIcons[site.type][site.terrain][isSelected ? 'SELECTED' : 'BASE']}
                {...interactionProps}
              >
                {renderSitePopup(site)}
              </Marker>
            );
          })}
        </FeatureGroup>
      </Overlay>
    );
  };

  const renderPopupSitesList = (sitesList) => {
    if (!sitesList || !sitesList.size) {
      return (
        <Typography variant="subtitle2" gutterBottom>
          <i>No NEON Sites</i>
        </Typography>
      );
    }
    return (
      <React.Fragment>
        <Typography variant="subtitle2" gutterBottom>
          {`NEON Sites (${sitesList.size}):`}
        </Typography>
        <div>
          {[...sitesList].map((siteCode) => {
            const site = allSites[siteCode];
            const alt = `${site.terrain} ${site.type}`;
            const selected = state.selectedSites.has(siteCode) ? 'SELECTED' : 'BASE';
            const src = ICON_SVGS[site.type][site.terrain][selected];
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
     Render US States
  */
  const renderStatePopup = (stateCode) => {
    if (!allStates[stateCode] || !state.regionSitesDerived) { return null; }
    const renderActions = () => {
      const count = state.stateSites[stateCode].size;
      if (mode !== 'SELECT' || !count) { return null; }
      const isTotalSelected = state.selectedStates[stateCode] === 'total';
      const verb = isTotalSelected ? 'remove' : 'add';
      const preposition = isTotalSelected ? 'from' : 'to';
      const all = count === 1 ? '' : 'all ';
      const plural = count === 1 ? '' : 's';
      return (
        <SnackbarContent
          className={classes.infoSnackbar}
          style={{ marginTop: Theme.spacing(1) }}
          message={(
            <div className={classes.startFlex}>
              <ClickIcon className={classes.infoSnackbarIcon} />
              <div>
                <Typography variant="body2">
                  {/* eslint-disable react/jsx-one-expression-per-line */}
                  Click to <b>{verb} {all}{count} site{plural}</b> {preposition} selection
                  {/* eslint-enable react/jsx-one-expression-per-line */}
                </Typography>
              </div>
            </div>
          )}
        />
      );
    };
    return (
      <Popup className={classes.popup} autoPan={mode !== 'SELECT'}>
        <Typography variant="h6" gutterBottom>
          {`${allStates[stateCode].name} (${stateCode})`}
        </Typography>
        {renderPopupSitesList(state.stateSites[stateCode])}
        {renderActions()}
      </Popup>
    );
  };

  const renderStatesOverlay = () => {
    const overlayName = ReactDOMServer.renderToStaticMarkup(
      <div className={classes.startFlexInline}>
        <div className={classes.keySwatchStates} />
        <div>US States</div>
      </div>,
    );
    return (
      <Overlay name={overlayName} checked={state.statesOverlay}>
        <FeatureGroup>
          {statesShapesJSON.features.map((usState) => {
            const { stateCode } = usState.properties;
            const overlayColor = state.selectedStates[stateCode]
              ? `${state.selectedStates[stateCode]}Selected`
              : 'states';
            /* eslint-disable no-underscore-dangle */
            const interactionProps = (mode === 'SELECT') ? {
              onMouseOver: (e) => {
                e.target._path.setAttribute('stroke', rootOverlayColors.hover);
                e.target._path.setAttribute('fill', rootOverlayColors.hover);
                e.target.openPopup();
                positionPopup(e);
              },
              onMouseMove: (e) => { positionPopup(e); },
              onMouseOut: (e) => {
                e.target._path.setAttribute('stroke', rootOverlayColors[overlayColor]);
                e.target._path.setAttribute('fill', rootOverlayColors[overlayColor]);
                e.target.closePopup();
              },
              onClick: () => {
                if (state.stateSites[stateCode].size) {
                  dispatch({ type: 'toggleStateSelected', stateCode });
                }
              },
            } : {
              onMouseOver: (e) => {
                e.target._path.setAttribute('stroke', rootOverlayColors.hover);
                e.target._path.setAttribute('fill', rootOverlayColors.hover);
              },
              onMouseOut: (e) => {
                e.target._path.setAttribute('stroke', rootOverlayColors[overlayColor]);
                e.target._path.setAttribute('fill', rootOverlayColors[overlayColor]);
              },
            };
            /* eslint-enable no-underscore-dangle */
            return (
              <Polygon
                key={usState.properties.stateCode}
                color={rootOverlayColors[overlayColor]}
                positions={usState.geometry.coordinates}
                {...interactionProps}
              >
                {renderStatePopup(usState.properties.stateCode)}
              </Polygon>
            );
          })}
        </FeatureGroup>
      </Overlay>
    );
  };

  /**
     Render Domains
  */
  const renderDomainPopup = (domainCode) => {
    if (!allDomains[domainCode] || !state.regionSitesDerived) { return null; }
    const renderActions = () => {
      const count = state.domainSites[domainCode].size;
      if (mode !== 'SELECT' || !count) { return null; }
      const isTotalSelected = state.selectedDomains[domainCode] === 'total';
      const verb = isTotalSelected ? 'remove' : 'add';
      const preposition = isTotalSelected ? 'from' : 'to';
      const all = count === 1 ? '' : 'all ';
      const plural = count === 1 ? '' : 's';
      return (
        <SnackbarContent
          className={classes.infoSnackbar}
          style={{ marginTop: Theme.spacing(1) }}
          message={(
            <div className={classes.startFlex}>
              <ClickIcon className={classes.infoSnackbarIcon} />
              <div>
                <Typography variant="body2">
                  {/* eslint-disable react/jsx-one-expression-per-line */}
                  Click to <b>{verb} {all}{count} site{plural}</b> {preposition} selection
                  {/* eslint-enable react/jsx-one-expression-per-line */}
                </Typography>
              </div>
            </div>
          )}
        />
      );
    };
    return (
      <Popup className={classes.popup} autoPan={mode !== 'SELECT'}>
        <Typography variant="h6" gutterBottom>
          {`${allDomains[domainCode].name} (${domainCode})`}
        </Typography>
        {renderPopupSitesList(state.domainSites[domainCode])}
        {renderActions()}
      </Popup>
    );
  };

  const renderDomainsOverlay = () => {
    const overlayName = ReactDOMServer.renderToStaticMarkup(
      <div className={classes.startFlexInline}>
        <div className={classes.keySwatchDomains} />
        <div>NEON Domains</div>
      </div>,
    );
    return (
      <Overlay name={overlayName} checked={state.domainsOverlay}>
        <FeatureGroup>
          {domainsShapesJSON.features.map((domain) => {
            const { domainCode } = domain.properties;
            const overlayColor = state.selectedDomains[domainCode]
              ? `${state.selectedDomains[domainCode]}Selected`
              : 'domains';
            /* eslint-disable no-underscore-dangle */
            const interactionProps = (mode === 'SELECT') ? {
              onMouseOver: (e) => {
                e.target._path.setAttribute('stroke', rootOverlayColors.hover);
                e.target._path.setAttribute('fill', rootOverlayColors.hover);
                e.target.openPopup();
                positionPopup(e);
              },
              onMouseMove: (e) => { positionPopup(e); },
              onMouseOut: (e) => {
                e.target._path.setAttribute('stroke', rootOverlayColors[overlayColor]);
                e.target._path.setAttribute('fill', rootOverlayColors[overlayColor]);
                e.target.closePopup();
              },
              onClick: () => {
                dispatch({ type: 'toggleDomainSelected', domainCode });
              },
            } : {
              onMouseOver: (e) => {
                e.target._path.setAttribute('stroke', rootOverlayColors.hover);
                e.target._path.setAttribute('fill', rootOverlayColors.hover);
              },
              onMouseOut: (e) => {
                e.target._path.setAttribute('stroke', rootOverlayColors[overlayColor]);
                e.target._path.setAttribute('fill', rootOverlayColors[overlayColor]);
              },
            };
            /* eslint-enable no-underscore-dangle */
            return (
              <Polygon
                key={domain.properties.domainCode}
                color={rootOverlayColors[overlayColor]}
                positions={domain.geometry.coordinates}
                {...interactionProps}
              >
                {renderDomainPopup(domain.properties.domainCode)}
              </Polygon>
            );
          })}
        </FeatureGroup>
      </Overlay>
    );
  };

  /**
     Render Tile Layers
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
        checked={key === state.tileLayer}
      >
        <TileLayer key={key} url={tileLayer.url} attribution={attributionString} />
      </BaseLayer>
    );
  };

  /**
     Render the Map
  */
  const handleZoomEnd = (event) => {
    dispatch({ type: 'setZoom', zoom: event.target.getZoom() });
  };
  const handleBaseLayerChange = (event) => {
    if (!event.name || !TILE_LAYERS_BY_NAME[event.name]) { return; }
    dispatch({ type: 'setTileLayer', tileLayer: TILE_LAYERS_BY_NAME[event.name] });
  };

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
      worldCopyJump
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
  mode: PropTypes.oneOf(Object.keys(SITE_MAP_MODES)),
  zoom: PropTypes.number,
  tileLayer: PropTypes.oneOf(Object.keys(TILE_LAYERS)),
};

SiteMap.defaultProps = {
  aspectRatio: 0.75,
  center: [52.68, -110.75],
  mode: 'EXPLORE',
  tileLayer: 'NatGeo_World_Map',
  zoom: null,
};

export default SiteMap;
