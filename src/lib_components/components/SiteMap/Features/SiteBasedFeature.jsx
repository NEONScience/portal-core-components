/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';

import tinycolor from 'tinycolor2';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
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
  FeatureGroup,
  Marker,
  Polygon,
  Popup,
  Rectangle,
} from 'react-leaflet';

import Theme from '../../Theme/Theme';

import SiteMapContext from '../SiteMapContext';
import {
  FEATURES,
  FEATURE_TYPES,
  KM2_TO_ACRES,
  SELECTION_STATUS,
  HIGHLIGHT_STATUS,
  SITE_DETAILS_URL_BASE,
  // SELECTABLE_FEATURE_TYPES,
  EXPLORE_DATA_PRODUCTS_URL_BASE,
} from '../SiteMapUtils';

// Convert latitude, longitude, and plotSize (in square meters) to an array of two points
// representing diagonally opposite corners of a rectangle. Use a fixed earth radius in meters
// because our centers are all far enough from the poles and our distances small enough that
// the error is negligible (max plot size used for this is 500m x 500m)
const EARTH_RADIUS = 6378000;
const getBounds = (lat = null, lon = null, area = null) => {
  if (Number.isNaN(lat) || Number.isNaN(lon) || Number.isNaN(area)) { return null; }
  const offsetMeters = (area ** 0.5) / 2;
  const dLat = (offsetMeters / EARTH_RADIUS) * (180 / Math.PI);
  const dLon = (offsetMeters / EARTH_RADIUS) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
  return [
    [lat - dLat, lon - dLon],
    [lat + dLat, lon + dLon],
  ];
};

const SiteBasedFeature = (props) => {
  const {
    classes,
    featureKey,
    positionPopup,
  } = props;
  const feature = FEATURES[featureKey] || {};

  const {
    type: featureType,
    style: featureStyle = {},
    iconSvg,
    minPolygonZoom,
  } = feature;

  /**
     Extract feature data from SiteMapContext state
  */
  const [state, dispatch] = SiteMapContext.useSiteMapContext();
  const {
    neonContextHydrated,
    map: { zoom },
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

  /**
     Render: Popup Title with Feature Icon
  */
  const renderPopupTitle = (title, withFeatureName = true) => {
    const featureName = feature.nameSingular || feature.name || featureKey;
    const renderedTitle = withFeatureName ? (
      <span>
        {feature.nameSingular}
        <br />
        {title}
      </span>
    ) : title;
    return (
      <div className={classes.popupTitleContainer}>
        <img
          src={feature.iconSvg}
          alt={featureName}
          title={featureName}
          className={classes.popupFeatureIcon}
        />
        <Typography variant="h6" style={{ lineHeight: '1.4rem' }}>
          {renderedTitle}
        </Typography>
      </div>
    );
  };

  /**
     Render: a numerical value with units and optional label
  */
  const renderNumericalValue = (value, label = null, unit = '', precision = 0, aria = null, right = false) => { // eslint-disable-line max-len
    const visibleValue = (
      <Typography variant="caption" aria-label={aria || label} style={{ fontFamily: 'monospace' }}>
        {Number.isFinite(value) ? `${value.toFixed(precision)}${unit}` : '--'}
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
     Render: Latitude / Longitude with Copy to Clipboard
  */
  const renderLatLon = (latitude, longitude, right = false, renderSubtitle = false) => {
    const coords = Number.isFinite(latitude) && Number.isFinite(longitude) ? (
      <div className={classes[right ? 'endFlex' : 'startFlex']}>
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
      <div style={{ textAlign: right ? 'right' : 'left' }}>
        <Typography variant="subtitle2">Elevation</Typography>
        {hasMinMax ? (
          <div>
            {renderNumericalValue(elevation, 'Average', 'm', 2, 'Average Elevation', right)}
            {renderNumericalValue(minimumElevation, 'Minimum', 'm', 2, 'Minimum Elevation', right)}
            {renderNumericalValue(minimumElevation, 'Maximum', 'm', 2, 'Maximum Elevation', right)}
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
    <div>
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
    <div style={{ textAlign: right ? 'right' : 'left' }}>
      <Typography variant="subtitle2">Plot Slope</Typography>
      {renderNumericalValue(loc.slopeAspect, 'Aspect', '°', 2, 'Slope Aspect', right)}
      {renderNumericalValue(loc.slopeGradient, 'Gradient', '%', 2, 'Slope Gradient', right)}
    </div>
  );

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
     Render: Popup Row; Location Site and Domain
  */
  const renderLocationSiteAndDomain = (siteCode) => {
    const site = state.sites[siteCode];
    if (!site) { return null; }
    const siteFeatureKey = `${site.terrain}_${site.type}_SITES`;
    if (!FEATURES[siteFeatureKey]) { return null; }
    const { iconSvg: siteIcon, name, nameSingular } = FEATURES[siteFeatureKey];
    const siteType = name || nameSingular || siteFeatureKey;
    return (
      <React.Fragment key="locationSiteAndDomain">
        <Grid item xs={9}>
          <Typography variant="subtitle2">NEON Site</Typography>
          <div className={classes.startFlex} style={{ marginTop: Theme.spacing(0.5) }}>
            <img src={siteIcon} alt={siteType} className={classes.popupLocationSiteIcon} />
            <Typography variant="body2">{`${site.description} (${site.siteCode})`}</Typography>
          </div>
        </Grid>
        <Grid item xs={3} style={{ textAlign: 'right' }}>
          <Typography variant="subtitle2">Domain</Typography>
          <Typography variant="body2">{site.domainCode}</Typography>
        </Grid>
      </React.Fragment>
    );
  };

  const popupProps = { className: classes.popup, autoPan: false };

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
            <Typography variant="body2">{usState.name}</Typography>
          </Grid>
          {/* Latitude/Longitude */}
          <Grid item xs={5} style={{ display: 'flex', alignItems: 'flex-end' }}>
            {renderLatLon(site.latitude, site.longitude)}
          </Grid>
          {/* Domain */}
          <Grid item xs={7} style={{ textAlign: 'right' }}>
            <Typography variant="subtitle2">Domain</Typography>
            <Typography variant="body2">
              {`${site.domainCode} - ${domain.name}`}
            </Typography>
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
    AQUATIC_REACHES: (siteCode) => {
      const { areaKm2 } = featureData[siteCode].properties;
      const areaAcres = KM2_TO_ACRES * areaKm2;
      return (
        <Popup {...popupProps}>
          <Typography variant="h6" gutterBottom>
            {`${siteCode} Aquatic Reach`}
          </Typography>
          <Typography variant="body1">
            {`Area: ${areaKm2.toFixed(2)} km2 (${areaAcres.toFixed(2)} acres)`}
          </Typography>
        </Popup>
      );
    },
    AQUATIC_RELOCATABLE_SITES: renderSitePopup,
    AQUATIC_RIPARIAN_ASSESSMENTS: renderLocationPopup,
    AQUATIC_SEDIMENT_POINTS: renderLocationPopup,
    AQUATIC_SENSOR_STATIONS: renderLocationPopup,
    AQUATIC_STAFF_GAUGES: renderLocationPopup,
    AQUATIC_WET_DEPOSITION_POINTS: renderLocationPopup,
    DISTRIBUTED_BASE_PLOTS: (siteCode, location) => renderLocationPopup(siteCode, location, [
      renderPlotSizeAndSlope,
    ]),
    DISTRIBUTED_BIRD_GRIDS: (siteCode, location) => renderLocationPopup(siteCode, location, [
      renderPlotSizeAndSlope,
    ]),
    DISTRIBUTED_MAMMAL_GRIDS: (siteCode, location) => renderLocationPopup(siteCode, location, [
      renderPlotSizeAndSlope,
    ]),
    DISTRIBUTED_MOSQUITO_POINTS: (siteCode, location) => renderLocationPopup(siteCode, location, [
      renderPlotSizeAndSlope,
    ]),
    DISTRIBUTED_TICK_PLOTS: (siteCode, location) => renderLocationPopup(siteCode, location, [
      renderPlotSizeAndSlope,
    ]),
    FLIGHT_BOX_BOUNDARIES: siteCode => (
      <Popup {...popupProps}>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} AOP Flight Box`}
        </Typography>
      </Popup>
    ),
    HUTS: renderLocationPopup,
    MEGAPITS: renderLocationPopup,
    POUR_POINTS: siteCode => (
      <Popup {...popupProps}>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Aquatic Watershed Pour Point`}
        </Typography>
      </Popup>
    ),
    SAMPLING_BOUNDARIES: (siteCode) => {
      const { areaKm2 } = featureData[siteCode].properties;
      const areaAcres = KM2_TO_ACRES * areaKm2;
      return (
        <Popup {...popupProps}>
          <Typography variant="h6" gutterBottom>
            {`${siteCode} Sampling Boundary`}
          </Typography>
          <Typography variant="body1">
            {`Area: ${areaKm2.toFixed(2)} km2 (${areaAcres.toFixed(2)} acres)`}
          </Typography>
        </Popup>
      );
    },
    TERRESTRIAL_CORE_SITES: renderSitePopup,
    TERRESTRIAL_RELOCATABLE_SITES: renderSitePopup,
    TOWER_AIRSHEDS: siteCode => (
      <Popup {...popupProps}>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Tower Airshed Boundary`}
        </Typography>
      </Popup>
    ),
    TOWER_BASE_PLOTS: (siteCode, location) => renderLocationPopup(siteCode, location, [
      renderPlotSizeAndSlope,
    ]),
    TOWER_PHENOLOGY_PLOTS: (siteCode, location) => renderLocationPopup(siteCode, location, [
      renderPlotSizeAndSlope,
    ]),
    TOWER_SOIL_PLOTS: renderLocationPopup,
    TOWERS: renderLocationPopup,
    WATERSHED_BOUNDARIES: (siteCode) => {
      const { areaKm2 } = featureData[siteCode].properties;
      let area = null;
      if (areaKm2) {
        const areaAcres = KM2_TO_ACRES * areaKm2;
        area = (
          <Typography variant="body1">
            {`Area: ${areaKm2.toFixed(2)} km2 (${areaAcres.toFixed(2)} acres)`}
          </Typography>
        );
      }
      return (
        <Popup {...popupProps}>
          <Typography variant="h6" gutterBottom>
            {`${siteCode} Watershed Boundary`}
          </Typography>
          {area}
        </Popup>
      );
    },
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
  const hoverColor = `#${tinycolor(featureStyle.color || '#666666').lighten(10).toHex()}`;
  const polygonProps = {
    ...featureStyle,
    onMouseOver: (e) => {
      e.target._path.setAttribute('stroke', hoverColor);
      e.target._path.setAttribute('fill', hoverColor);
    },
    onMouseOut: (e) => {
      e.target._path.setAttribute('stroke', featureStyle.color);
      e.target._path.setAttribute('fill', featureStyle.color);
    },
  };
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
  const renderShape = (siteCode, location = null) => {
    const shapeData = location && featureData[siteCode][location]
      ? featureData[siteCode][location]
      : featureData[siteCode];
    let isSelected = false;
    if (selectionActive) {
      isSelected = location ? selectedItems.has(location) : selectedItems.has(siteCode);
    }
    const key = location ? `${siteCode} - ${location}` : siteCode;
    const renderedPopup = location ? renderPopup(siteCode, location) : renderPopup(siteCode);
    const shapeKeys = Object.keys(shapeData);
    let shape = null;
    let position = [];
    let positions = [];
    let bounds = null;
    let icon = null;
    let marker = null;
    let interaction = {};
    if (shapeData.geometry && shapeData.geometry.coordinates) {
      shape = 'Polygon';
      positions = shapeData.geometry.coordinates;
    }
    if (isPoint(shapeData)) {
      shape = 'Marker';
      position = ['latitude', 'longitude'].every(k => shapeKeys.includes(k))
        ? [shapeData.latitude, shapeData.longitude]
        : shapeData.geometry.coordinates;
      if (state.map.zoomedIcons[featureKey] !== null) {
        const baseIcon = state.map.zoomedIcons[featureKey];
        const selection = isSelected ? SELECTION_STATUS.SELECTED : SELECTION_STATUS.UNSELECTED;
        const initialHighlight = (
          (location || siteCode) === focusLocation && featureKey !== FEATURES.POUR_POINTS.KEY
            ? HIGHLIGHT_STATUS.HIGHLIGHT
            : HIGHLIGHT_STATUS.NONE
        );
        icon = baseIcon[selection][initialHighlight];
        const hasPopup = typeof renderPopupFunctions[featureKey] === 'function';
        interaction = selectionActive ? {
          onMouseOver: (e) => {
            const highlight = HIGHLIGHT_STATUS[isSelected ? 'HIGHLIGHT' : 'SELECT'];
            e.target.setIcon(baseIcon[selection][highlight]);
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
          onClick: (e) => {
            console.log('SELECT', e.target);
          },
        } : {
          onMouseOver: (e) => {
            e.target.setIcon(baseIcon[selection][HIGHLIGHT_STATUS.HIGHLIGHT]);
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
        <Marker
          key={`${key}-marker`}
          position={position}
          title={key}
          icon={icon}
          riseOnHover
          {...interaction}
        >
          {renderedPopup}
        </Marker>
      );
      // Some features prefer to render as a marker icon until a high enough zoom level
      if (shapeKeys.includes('plotSize') && iconSvg && minPolygonZoom && minPolygonZoom <= zoom) {
        /* DISABLED UNTIL WE HAVE RELIABLE LOCATION DATA FOR THESE POINTS
        shape = 'Rectangle';
        const latitude = shapeKeys.includes('latitude')
          ? shapeData.latitude : shapeData.geometry.coordinates[0];
        const longitude = shapeKeys.includes('longitude')
          ? shapeData.longitude : shapeData.geometry.coordinates[1];
        bounds = getBounds(latitude, longitude, shapeData.plotSize);
        */
        bounds = getBounds(); // null
      }
    }
    switch (shape) {
      case 'Marker':
        return marker;
      case 'Rectangle':
        return (
          <React.Fragment key={key}>
            <Rectangle key={`${key}-rectangle`} bounds={bounds} {...polygonProps}>
              {renderedPopup}
            </Rectangle>
            {marker}
          </React.Fragment>
        );
      case 'Polygon':
        return (
          <React.Fragment key={key}>
            <Polygon key={`${key}-polygon`} positions={positions} {...polygonProps}>
              {renderedPopup}
            </Polygon>
            {marker}
          </React.Fragment>
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
      {Object.keys(featureData).flatMap((siteCode) => {
        if (featureType === FEATURE_TYPES.LOCATIONS) {
          return Object.keys(featureData[siteCode]).map(loc => renderShape(siteCode, loc));
        }
        return renderShape(siteCode);
      })}
    </FeatureGroup>
  );
};

SiteBasedFeature.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  featureKey: PropTypes.oneOf(Object.keys(FEATURES)).isRequired,
  positionPopup: PropTypes.func.isRequired,
};

export default SiteBasedFeature;
