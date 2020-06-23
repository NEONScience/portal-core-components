/* eslint-disable no-underscore-dangle, jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';

import tinycolor from 'tinycolor2';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import ClickIcon from '@material-ui/icons/TouchApp';
import ElevationIcon from '@material-ui/icons/Terrain';
import ExploreDataProductsIcon from '@material-ui/icons/InsertChartOutlined';
import LocationIcon from '@material-ui/icons/MyLocation';
import SiteDetailsIcon from '@material-ui/icons/InfoOutlined';

import 'leaflet/dist/leaflet.css';
import {
  CircleMarker,
  Map,
  FeatureGroup,
  Marker,
  Polygon,
  Polyline,
  Popup,
} from 'react-leaflet';

import SiteMapContext from './SiteMapContext';
import {
  getHref,
  FEATURES,
  FEATURE_TYPES,
  KM2_TO_ACRES,
  HIGHLIGHT_STATUS,
  SELECTION_STATUS,
  PLOT_SAMPLING_MODULES,
} from './SiteMapUtils';

import Theme from '../Theme/Theme';

const useStyles = makeStyles(theme => ({
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
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
    marginRight: theme.spacing(1),
    filter: 'drop-shadow(0px 0px 1.5px #000000bb)',
  },
  popupSiteContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  popupFeatureIcon: {
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    marginRight: theme.spacing(1.5),
    filter: 'drop-shadow(0px 0px 1.5px #000000bb)',
  },
  popupFeaturePolygon: {
    marginRight: theme.spacing(1.5),
  },
  popupTitleContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: theme.spacing(1.5),
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
}));

const SiteMapFeature = (props) => {
  const classes = useStyles(Theme);
  const { mapRef, featureKey } = props;

  if (!FEATURES[featureKey] || !mapRef.current) { return null; }

  const feature = FEATURES[featureKey] || {};

  const {
    name,
    nameSingular,
    type: featureType,
    style: featureStyle,
    featureShape,
    iconSvg,
    primaryIdOnly = false,
  } = feature;
  const featureName = nameSingular || name || featureKey;

  // Groups don't render anything ever!
  if (featureType === FEATURE_TYPES.GROUP) { return null; }

  /**
     Extract feature data from SiteMapContext state
  */
  const [state, dispatch] = SiteMapContext.useSiteMapContext();
  const {
    neonContextHydrated,
    focusLocation: { current: focusLocation },
    featureData: {
      [featureType]: {
        [featureKey]: featureData,
      },
    },
  } = state;
  if (!neonContextHydrated || !featureData || !Object.keys(featureData)) { return null; }

  const selectionActive = state.selection.active === featureType;
  const selectedItems = selectionActive ? state.selection[featureType] : new Set();

  // Jump-To function to afford map navigation where appropriate
  const jumpTo = (locationCode = '') => {
    dispatch({ type: 'setNewFocusLocation', location: locationCode });
  };

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
    if (!target || !latlng || !mapRef.current || !mapRef.current.leafletElement) { return; }
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
     Render: Popup Title with Feature Icon
  */
  const renderPopupTitle = (title, withFeatureName = true) => {
    const renderedTitle = withFeatureName ? (
      <span>
        {featureName}
        <br />
        {title}
      </span>
    ) : title;
    let icon = null;
    if (iconSvg) {
      icon = <img alt={feature.name} src={feature.iconSvg} className={classes.popupFeatureIcon} />;
    } else if (featureShape === 'Circle') {
      const circleProps = {
        cx: 12,
        cy: 12,
        r: 8,
        style: {
          fill: featureStyle.color ? `${featureStyle.color}88` : 'none',
          stroke: featureStyle.color || null,
          strokeWidth: 3,
        },
      };
      icon = (
        <svg width="24" height="24" className={classes.popupFeaturePolygon}>
          <circle {...circleProps} />
        </svg>
      );
    } else if (featureStyle && !['STATES', 'DOMAINS'].includes(featureKey)) {
      // We don't show the rect for states and domains since those cover the whole map when showing.
      const rectProps = {
        width: 33,
        height: 23,
        x: 1.5,
        y: 6.5,
        rx: 3,
        style: {
          fill: feature.style.color || null,
          stroke: feature.style.color || null,
          strokeWidth: 2.5,
          fillOpacity: 0.2,
          strokeOpacity: 0.85,
          strokeLinecap: 'round',
          strokeDasharray: feature.style.dashArray || null,
        },
      };
      icon = (
        <svg width="36" height="36" className={classes.popupFeaturePolygon}>
          <rect {...rectProps} />
        </svg>
      );
    }
    return (
      <div className={classes.popupTitleContainer} data-selenium="sitemap-map-popup-title">
        {icon}
        <Typography variant="h6" style={{ lineHeight: '1.4rem' }}>
          {renderedTitle}
        </Typography>
      </div>
    );
  };

  /**
     Render: a numerical value with units and optional label
  */
  const renderNumericalValue = (value, label = null, unit = '', precision = 0, aria = null, right = false, parens = false) => { // eslint-disable-line max-len
    let numberString = Number.isFinite(value) ? `${value.toFixed(precision)}${unit}` : '--';
    if (parens) { numberString = `(${numberString})`; }
    const visibleValue = (
      <Typography variant="caption" aria-label={aria || label} style={{ fontFamily: 'monospace' }}>
        {numberString}
      </Typography>
    );
    return !label ? visibleValue : (
      <div className={classes[right ? 'endFlex' : 'startFlex']}>
        <Typography variant="caption" style={{ marginRight: Theme.spacing(1) }}>
          {label}
        </Typography>
        {visibleValue}
      </div>
    );
  };

  /**
     Render: Site with Icon
  */
  const renderSite = (siteCode, link = false) => {
    const site = state.sites[siteCode];
    if (!site) { return null; }
    const siteFeatureKey = `${site.terrain}_${site.type}_SITES`;
    if (!FEATURES[siteFeatureKey]) { return null; }
    const { iconSvg: siteIcon } = FEATURES[siteFeatureKey];
    const internal = (
      <React.Fragment>
        <img src={siteIcon} alt={siteCode} className={classes.popupSiteIcon} />
        <Typography variant="caption" style={{ textAlign: 'left' }}>
          {`${site.description} (${site.siteCode})`}
        </Typography>
      </React.Fragment>
    );
    const containerProps = {
      key: siteCode,
      className: classes.popupSiteContainer,
      style: { marginTop: Theme.spacing(0.5) },
    };
    return link ? (
      <Link
        variant="caption"
        component="button"
        onClick={() => jumpTo(site.siteCode)}
        data-selenium="sitemap-map-popup-siteLink"
        {...containerProps}
      >
        {internal}
      </Link>
    ) : (
      <div {...containerProps}>{internal}</div>
    );
  };

  /**
     Render: Latitude / Longitude with Copy to Clipboard
  */
  const renderLatLon = (latitude, longitude, right = false, renderSubtitle = false) => {
    const coords = Number.isFinite(latitude) && Number.isFinite(longitude) ? (
      <div
        className={classes[right ? 'endFlex' : 'startFlex']}
        data-selenium="sitemap-map-popup-coordinates"
      >
        <CopyToClipboard text={`${latitude.toFixed(5)} ${longitude.toFixed(5)}`}>
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
          {latitude.toFixed(5)}
          <br />
          {longitude.toFixed(5)}
        </Typography>
      </div>
    ) : (
      <div>
        <Typography variant="subtitle2">Lat./Lon.</Typography>
        <Typography
          variant="caption"
          aria-label="Latitude / Longitude"
          style={{ fontFamily: 'monospace', textAlign: 'right' }}
        >
          --
        </Typography>
      </div>
    );
    return !renderSubtitle ? coords : (
      <div style={{ textAlign: right ? 'right' : 'left' }}>
        <Typography variant="subtitle2">Coordinates</Typography>
        {coords}
      </div>
    );
  };

  /**
     Render: Elevation
  */
  const renderElevation = (loc = {}, right = false) => {
    const { elevation, minimumElevation, maximumElevation } = loc;
    const hasMinMax = Number.isFinite(minimumElevation) || Number.isFinite(maximumElevation);
    return (
      <div
        style={{ textAlign: right ? 'right' : 'left' }}
        data-selenium="sitemap-map-popup-elevation"
      >
        <Typography variant="subtitle2">Elevation</Typography>
        {hasMinMax ? (
          <div>
            {renderNumericalValue(elevation, 'Average', 'm', 2, 'Average Elevation', right)}
            {renderNumericalValue(minimumElevation, 'Minimum', 'm', 2, 'Minimum Elevation', right)}
            {renderNumericalValue(maximumElevation, 'Maximum', 'm', 2, 'Maximum Elevation', right)}
          </div>
        ) : (
          <div className={classes[right ? 'endFlex' : 'startFlex']}>
            <ElevationIcon fontSize="small" style={{ marginRight: Theme.spacing(1) }} />
            {renderNumericalValue(elevation, null, 'm', 2, 'Elevation')}
          </div>
        )}
      </div>
    );
  };

  /**
     Render: Plot Size
  */
  const renderPlotSize = (loc = {}) => (
    <div data-selenium="sitemap-map-popup-plotSize">
      <Typography variant="subtitle2">Plot Size</Typography>
      <Typography variant="caption">
        {loc.plotDimensions}
        {!Number.isFinite(loc.plotSize) ? null : (
          <React.Fragment>
            <br />
            {`(${loc.plotSize.toFixed(0)}m²)`}
          </React.Fragment>
        )}
      </Typography>
    </div>
  );

  /**
     Render: Plot Slope
  */
  const renderPlotSlope = (loc = {}, right = false) => (
    <div
      style={{ textAlign: right ? 'right' : 'left' }}
      data-selenium="sitemap-map-popup-plotSlope"
    >
      <Typography variant="subtitle2">Plot Slope</Typography>
      {renderNumericalValue(loc.slopeAspect, 'Aspect', '°', 2, 'Slope Aspect', right)}
      {renderNumericalValue(loc.slopeGradient, 'Gradient', '%', 2, 'Slope Gradient', right)}
    </div>
  );

  /**
     Render: Plot Sampling Modules
  */
  const renderPlotSamplingModules = (loc = {}) => {
    const count = loc.samplingModules.length ? ` (${loc.samplingModules.length})` : '';
    return (
      <Grid
        item
        xs={12}
        key="plotSamplingModules"
        data-selenium="sitemap-map-popup-samplingModules"
      >
        <Typography variant="subtitle2">
          {`Potential Sampling Modules${count}`}
        </Typography>
        <Typography variant="caption">
          {!loc.samplingModules.length ? (
            <i>none</i>
          ) : (
            loc.samplingModules.map(m => PLOT_SAMPLING_MODULES[m]).join(', ')
          )}
        </Typography>
      </Grid>
    );
  };

  /**
     Render: Popup Row; Boundary Area
  */
  const renderBoundaryArea = (bound = {}) => {
    const { areaKm2 } = bound.properties || {};
    const areaAcres = Number.isFinite(areaKm2) ? KM2_TO_ACRES * areaKm2 : null;
    return (
      <Grid item xs={12} data-selenium="sitemap-map-popup-area">
        <Typography variant="subtitle2">Area</Typography>
        <div className={classes.startFlex}>
          {renderNumericalValue(areaKm2, null, 'km²', 2, 'Area (km²)')}
          {areaAcres === null ? null : (
            <div style={{ marginLeft: Theme.spacing(1) }}>
              {renderNumericalValue(areaAcres, null, ' acres', 2, 'Area (acres)', false, true)}
            </div>
          )}
        </div>
      </Grid>
    );
  };

  /**
     Render Method: Popup Row; Child NEON Sites (e.g. within a domain or state)
  */
  const renderChildSites = (boundaryKey) => {
    // const { [SELECTABLE_FEATURE_TYPES.SITES]: selectedSites } = state.selection;
    const { sites = new Set() } = featureData[boundaryKey];
    return (
      <Grid key="childSites" item xs={12} data-selenium="sitemap-map-popup-childSites">
        {!sites.size ? (
          <React.Fragment>
            <Typography variant="subtitle2">NEON Sites</Typography>
            <Typography variant="caption">
              <i>none</i>
            </Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography variant="subtitle2">{`NEON Sites (${sites.size}):`}</Typography>
            <div>
              {[...sites].map(siteCode => renderSite(siteCode, true))}
            </div>
          </React.Fragment>
        )}
      </Grid>
    );
  };

  /**
     Render: Popup Row; Coordinates and Elevation
  */
  const renderCoordsAndElevation = (loc) => {
    const renderCoordsSubtitle = (
      Number.isFinite(loc.minimumElevation) || Number.isFinite(loc.maximumElevation)
    );
    return (
      <React.Fragment key="coordsAndElevation">
        <Grid item xs={6}>
          {renderElevation(loc)}
        </Grid>
        <Grid item xs={6}>
          {renderLatLon(loc.latitude, loc.longitude, true, renderCoordsSubtitle)}
        </Grid>
      </React.Fragment>
    );
  };

  /**
     Render: Popup Row; Plot Size and Slope
  */
  const renderPlotSizeAndSlope = loc => (
    <React.Fragment key="plotSizeAndSlope">
      <Grid item xs={6}>
        {renderPlotSize(loc)}
      </Grid>
      <Grid item xs={6}>
        {renderPlotSlope(loc, true)}
      </Grid>
    </React.Fragment>
  );

  /**
     Render: Popup Row; Tower Details
  */
  const renderTowerDetails = loc => (
    <Grid key="towerDetails" item xs={12} data-selenium="sitemap-map-popup-towerDetails">
      <Typography variant="subtitle2">Levels</Typography>
      <Typography variant="caption">{(loc.children || []).length}</Typography>
    </Grid>
  );

  /**
     Render: Popup Row; Location Site and Domain
  */
  const renderLocationSiteAndDomain = (siteCode) => {
    const site = state.sites[siteCode];
    if (!site || !state.featureData.BOUNDARIES.DOMAINS[site.domainCode]) { return null; }
    const { name: domainName } = state.featureData.BOUNDARIES.DOMAINS[site.domainCode];
    const domainTitle = `${site.domainCode} - ${domainName}`;
    return (
      <React.Fragment key="locationSiteAndDomain">
        <Grid item xs={7} data-selenium="sitemap-map-popup-site">
          <Typography variant="subtitle2">NEON Site</Typography>
          {renderSite(siteCode)}
        </Grid>
        <Grid item xs={5} style={{ textAlign: 'right' }} data-selenium="sitemap-map-popup-domain">
          <Typography variant="subtitle2">Domain</Typography>
          <Link
            variant="caption"
            component="button"
            onClick={() => jumpTo(site.domainCode)}
            data-selenium="sitemap-map-popup-domainLink"
          >
            {domainTitle}
          </Link>
        </Grid>
      </React.Fragment>
    );
  };

  const popupProps = {
    className: classes.popup,
    autoPan: false,
    id: 'sitemap-map-popup',
  };

  /**
     Render: Location popup
     Standard title with icon, row with coordinates and elevation, row with parent site and domain
     Optional additional rows will appear between coordinates/elevation and site/domain
  */
  const renderLocationPopup = (siteCode, location, additionalRows = []) => {
    const loc = (featureData[siteCode] || {})[location] || {};
    return (
      <Popup {...popupProps}>
        {renderPopupTitle(location)}
        <Grid container spacing={1}>
          {renderCoordsAndElevation(loc)}
          {additionalRows.map(row => (typeof row === 'function' ? row(loc) : row))}
          {renderLocationSiteAndDomain(siteCode)}
        </Grid>
      </Popup>
    );
  };

  /**
     Render: Boundary popup
     Standard title with bound outline. Show area if present.
  */
  const renderBoundaryPopup = (key, title = null, additionalRows = []) => {
    const { properties = {} } = (featureData[key] || {});
    return (
      <Popup {...popupProps}>
        {renderPopupTitle(title || key, !title)}
        <Grid container spacing={1}>
          {properties.areaKm2 ? renderBoundaryArea(featureData[key]) : null}
          {(
            Array.isArray(additionalRows)
              ? additionalRows.map(row => (typeof row === 'function' ? row(key) : row))
              : null
          )}
          {renderLocationSiteAndDomain(key)}
        </Grid>
      </Popup>
    );
  };

  /**
     Render: Site Popup
  */
  const renderSitePopup = (siteCode) => {
    const site = featureData[siteCode] || {};
    const { [site.stateCode]: usState = {} } = state
      .featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.STATES.KEY];
    const { [site.domainCode]: domain = {} } = state
      .featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.DOMAINS.KEY];
    const stateFieldTitle = (site.stateCode === 'PR' ? 'Territory' : 'State');
    const renderActions = () => {
      if (selectionActive) {
        const isSelected = selectedItems.has(site.siteCode);
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
              href={getHref('SITE_DETAILS', site.siteCode)}
              {...actionButtonProps}
            >
              Site Details
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              endIcon={<ExploreDataProductsIcon />}
              href={getHref('EXPLORE_DATA_PRODUCTS_BY_SITE', site.siteCode)}
              {...actionButtonProps}
            >
              Explore Data
            </Button>
          </Grid>
        </Grid>
      );
    };
    return (
      <Popup {...popupProps}>
        {renderPopupTitle(`${site.description} (${site.siteCode})`, false)}
        <Grid container spacing={1} style={{ marginBottom: Theme.spacing(1) }}>
          {/* Terrain and Type */}
          <Grid item xs={8}>
            <Typography variant="subtitle2">{feature.nameSingular}</Typography>
            <Typography variant="caption"><i>{feature.description}</i></Typography>
          </Grid>
          {/* State/Territory */}
          <Grid item xs={4} style={{ textAlign: 'right' }}>
            <Typography variant="subtitle2">{stateFieldTitle}</Typography>
            <Link
              variant="caption"
              component="button"
              onClick={() => jumpTo(site.stateCode)}
              data-selenium="sitemap-map-popup-stateLink"
            >
              {usState.name}
            </Link>
          </Grid>
          {/* Latitude/Longitude */}
          <Grid item xs={5} style={{ display: 'flex', alignItems: 'flex-end' }}>
            {renderLatLon(site.latitude, site.longitude)}
          </Grid>
          {/* Domain */}
          <Grid item xs={7} style={{ textAlign: 'right' }}>
            <Typography variant="subtitle2">Domain</Typography>
            <Link
              variant="caption"
              component="button"
              onClick={() => jumpTo(site.domainCode)}
              data-selenium="sitemap-map-popup-domainLink"
            >
              {`${site.domainCode} - ${domain.name}`}
            </Link>
          </Grid>
        </Grid>
        {renderActions()}
      </Popup>
    );
  };

  /**
     Render - All the Rest of the Popups
     Convention is alphabetical listing of keys since order here doesn't matter
  */
  const renderPopupFunctions = {
    AQUATIC_BENCHMARKS: renderLocationPopup,
    AQUATIC_BUOYS: renderLocationPopup,
    AQUATIC_CORE_SITES: renderSitePopup,
    AQUATIC_GROUNDWATER_WELLS: renderLocationPopup,
    AQUATIC_DISCHARGE_POINTS: renderLocationPopup,
    AQUATIC_FISH_POINTS: renderLocationPopup,
    AQUATIC_METEOROLOGICAL_STATIONS: renderLocationPopup,
    AQUATIC_PLANT_TRANSECTS: renderLocationPopup,
    AQUATIC_REACHES: renderBoundaryPopup,
    AQUATIC_RELOCATABLE_SITES: renderSitePopup,
    AQUATIC_RIPARIAN_ASSESSMENTS: renderLocationPopup,
    AQUATIC_SEDIMENT_POINTS: renderLocationPopup,
    AQUATIC_SENSOR_STATIONS: renderLocationPopup,
    AQUATIC_STAFF_GAUGES: renderLocationPopup,
    AQUATIC_WET_DEPOSITION_POINTS: renderLocationPopup,
    DISTRIBUTED_BASE_PLOTS: (siteCode, location) => renderLocationPopup(siteCode, location, [
      renderPlotSizeAndSlope,
      renderPlotSamplingModules,
    ]),
    DISTRIBUTED_BIRD_GRID_POINTS: renderLocationPopup,
    DISTRIBUTED_BIRD_GRIDS: (siteCode, location) => renderLocationPopup(siteCode, location, [
      renderPlotSizeAndSlope,
    ]),
    DISTRIBUTED_MAMMAL_GRID_POINTS: renderLocationPopup,
    DISTRIBUTED_MAMMAL_GRIDS: (siteCode, location) => renderLocationPopup(siteCode, location, [
      renderPlotSizeAndSlope,
    ]),
    DISTRIBUTED_MOSQUITO_POINTS: (siteCode, location) => renderLocationPopup(siteCode, location, [
      renderPlotSizeAndSlope,
    ]),
    DISTRIBUTED_TICK_PLOT_POINTS: renderLocationPopup,
    DISTRIBUTED_TICK_PLOTS: (siteCode, location) => renderLocationPopup(siteCode, location, [
      renderPlotSizeAndSlope,
    ]),
    DOMAINS: (domainCode) => {
      const title = !featureData[domainCode] ? null : (
        <span>
          {`NEON Domain ${domainCode.replace('D', '')}`}
          <br />
          {featureData[domainCode].name}
        </span>
      );
      return renderBoundaryPopup(domainCode, title, [renderChildSites]);
    },
    FLIGHT_BOX_BOUNDARIES: renderBoundaryPopup,
    HUTS: renderLocationPopup,
    MEGAPITS: renderLocationPopup,
    POUR_POINTS: siteCode => (
      <Popup {...popupProps}>
        {renderPopupTitle(`${siteCode} Watershed Pour Point`)}
        <Grid container spacing={1}>
          {renderLocationSiteAndDomain(siteCode)}
        </Grid>
      </Popup>
    ),
    SAMPLING_BOUNDARIES: renderBoundaryPopup,
    STATES: stateCode => renderBoundaryPopup(
      stateCode,
      featureData[stateCode] ? featureData[stateCode].name : stateCode,
      [renderChildSites],
    ),
    TERRESTRIAL_CORE_SITES: renderSitePopup,
    TERRESTRIAL_RELOCATABLE_SITES: renderSitePopup,
    TOWER_AIRSHEDS: renderBoundaryPopup,
    TOWER_BASE_PLOTS: (siteCode, location) => renderLocationPopup(siteCode, location, [
      renderPlotSizeAndSlope,
      renderPlotSamplingModules,
    ]),
    TOWER_PHENOLOGY_PLOT_POINTS: renderLocationPopup,
    TOWER_PHENOLOGY_PLOTS: (siteCode, location) => renderLocationPopup(siteCode, location, [
      renderPlotSizeAndSlope,
    ]),
    TOWER_SOIL_PLOTS: renderLocationPopup,
    TOWERS: (siteCode, location) => renderLocationPopup(siteCode, location, [
      renderTowerDetails,
    ]),
    WATERSHED_BOUNDARIES: renderBoundaryPopup,
  };
  const renderPopup = (siteCode, location = null) => {
    if (
      typeof renderPopupFunctions[featureKey] !== 'function'
        || !featureData[siteCode]
        || (location !== null && !featureData[siteCode][location])
    ) { return null; }
    return renderPopupFunctions[featureKey](siteCode, location);
  };

  /**
     Render a single shape (marker, rectangle, or polygon)
  */
  const baseColor = featureStyle ? featureStyle.color : '#666666';
  const hoverColor = `#${tinycolor(baseColor).lighten(10).toHex()}`;
  const darkenedBaseColor = `#${tinycolor(baseColor).darken(20).toHex()}`;
  const isPoint = (shapeData) => {
    const shapeKeys = Object.keys(shapeData);
    return (
      (
        shapeKeys.includes('geometry') && Object.keys(shapeData.geometry).includes('coordinates')
          && Array.isArray(shapeData.geometry.coordinates)
          && shapeData.geometry.coordinates.length === 2
          && shapeData.geometry.coordinates.every(x => Number.isFinite(x))
      ) || (
        shapeKeys.includes('latitude') && shapeKeys.includes('longitude')
      )
    );
  };
  const renderShape = (primaryId, secondaryId = null) => {
    const polygonInteractionProps = {
      onMouseOver: (e) => {
        e.target._path.setAttribute('stroke', hoverColor);
        e.target._path.setAttribute('fill', hoverColor);
      },
      onMouseOut: (e) => {
        e.target._path.setAttribute('stroke', featureStyle.color);
        e.target._path.setAttribute('fill', featureStyle.color);
      },
    };
    const shapeData = secondaryId && featureData[primaryId][secondaryId]
      ? featureData[primaryId][secondaryId]
      : featureData[primaryId];
    let isSelected = false;
    if (selectionActive) {
      isSelected = secondaryId ? selectedItems.has(secondaryId) : selectedItems.has(primaryId);
    }
    const isHighlighted = (
      (primaryIdOnly && !secondaryId && primaryId === focusLocation)
        || (!primaryIdOnly && secondaryId && secondaryId === focusLocation)
    );
    const key = secondaryId ? `${primaryId} - ${secondaryId}` : primaryId;
    const renderedPopup = renderPopup(primaryId, secondaryId);
    const shapeKeys = Object.keys(shapeData);
    let shape = null;
    let position = [];
    let positions = [];
    let icon = null;
    let marker = null;
    let interaction = {};
    let shapeProps = {};
    if (shapeData.geometry && shapeData.geometry.coordinates) {
      positions = shapeData.geometry.coordinates;
      shape = featureShape;
      if (shape === 'Polyline') {
        shapeProps = {
          ...featureStyle || {},
          onMouseOver: (e) => {
            e.target._path.setAttribute('stroke', hoverColor);
          },
          onMouseOut: (e) => {
            e.target._path.setAttribute('stroke', baseColor);
          },
        };
      }
      if (shape === 'Polygon') {
        shapeProps = {
          ...featureStyle || {},
          ...polygonInteractionProps,
        };
        if (isHighlighted) {
          shapeProps.color = darkenedBaseColor;
          shapeProps.onMouseOut = (e) => {
            e.target._path.setAttribute('stroke', darkenedBaseColor);
            e.target._path.setAttribute('fill', darkenedBaseColor);
          };
        }
      }
    }
    if (isPoint(shapeData)) {
      shape = featureShape || 'Marker';
      position = ['latitude', 'longitude'].every(k => shapeKeys.includes(k))
        ? [shapeData.latitude, shapeData.longitude]
        : shapeData.geometry.coordinates;
      if (shape === 'Marker' && state.map.zoomedIcons[featureKey] !== null) {
        const baseIcon = state.map.zoomedIcons[featureKey];
        const selection = isSelected ? SELECTION_STATUS.SELECTED : SELECTION_STATUS.UNSELECTED;
        const initialHighlight = isHighlighted ? HIGHLIGHT_STATUS.HIGHLIGHT : HIGHLIGHT_STATUS.NONE;
        icon = baseIcon[selection][initialHighlight];
        const hasPopup = typeof renderPopupFunctions[featureKey] === 'function';
        interaction = selectionActive ? {
          onMouseOver: (e) => {
            const highlight = HIGHLIGHT_STATUS[isSelected ? 'HIGHLIGHT' : 'SELECT'];
            e.target.setIcon(baseIcon[selection][highlight]);
            e.target._bringToFront();
            if (hasPopup) {
              e.target.openPopup();
              positionPopup(e.target, e.latlng, selectionActive);
            }
          },
          onMouseOut: (e) => {
            const highlight = HIGHLIGHT_STATUS[isSelected ? initialHighlight : 'SELECT'];
            e.target.setIcon(baseIcon[selection][highlight]);
            if (hasPopup) {
              e.target.closePopup();
            }
          },
          /*
          onClick: (e) => {
            console.log('SELECT', e.target);
          },
          */
        } : {
          onMouseOver: (e) => {
            e.target.setIcon(baseIcon[selection][HIGHLIGHT_STATUS.HIGHLIGHT]);
            e.target._bringToFront();
          },
          onMouseOut: (e) => {
            e.target.setIcon(baseIcon[selection][initialHighlight]);
          },
          onClick: (e) => {
            if (hasPopup) {
              const popupOpen = e.target._popup.isOpen();
              const func = () => positionPopup(e.target, e.latlng, selectionActive);
              dispatch({ type: 'setMapRepositionOpenPopupFunc', func });
              if (popupOpen) { func(); }
            }
          },
        };
      }
      marker = (
        <Marker key={`${key}-marker`} position={position} title={key} icon={icon} {...interaction}>
          {renderedPopup}
        </Marker>
      );
    }
    switch (shape) {
      case 'Marker':
        return marker;
      case 'Circle':
        return (
          <CircleMarker
            key={`${key}-circlemarker`}
            title={key}
            center={position}
            radius={Math.max(state.map.zoom - 10, 3)}
            {...featureStyle}
            {...polygonInteractionProps}
          >
            {renderedPopup}
          </CircleMarker>
        );
      case 'Polygon':
        return (
          <React.Fragment key={key}>
            <Polygon key={`${key}-polygon`} positions={positions} {...shapeProps}>
              {renderedPopup}
            </Polygon>
            {marker}
          </React.Fragment>
        );
      case 'Polyline':
        return (
          <Polyline key={`${key}-polyline`} positions={positions} {...shapeProps}>
            {renderedPopup}
          </Polyline>
        );
      default:
        return null;
    }
  };

  /**
     Main Render
  */
  return (
    <FeatureGroup>
      {Object.keys(featureData)
        .sort(a => (a === state.focusLocation.current ? 1 : -1))
        .flatMap((keyA) => {
          if ([FEATURE_TYPES.LOCATIONS, FEATURE_TYPES.SAMPLING_POINTS].includes(featureType)) {
            return Object.keys(featureData[keyA]).map(keyB => renderShape(keyA, keyB));
          }
          return renderShape(keyA);
        })}
    </FeatureGroup>
  );
};

SiteMapFeature.propTypes = {
  mapRef: PropTypes.shape({
    current: PropTypes.instanceOf(Map),
  }).isRequired,
  featureKey: PropTypes.oneOf(Object.keys(FEATURES)).isRequired,
};

export default SiteMapFeature;
