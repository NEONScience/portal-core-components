/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import tinycolor from 'tinycolor2';

import 'leaflet/dist/leaflet.css';
import {
  FeatureGroup,
  Marker,
  Polygon,
  Popup,
  Rectangle,
} from 'react-leaflet';

import SiteMapContext from '../SiteMapContext';
import { FEATURES, FEATURE_TYPES, KM2_TO_ACRES } from '../SiteMapUtils';

// Convert latitude, longitude, and plotSize (in square meters) to an array of two points
// representing diagonally opposite corners of a rectangle. Use a fixed earth radius in meters
// because our centers are all far enough from the poles and our distances small enough that
// the error is negligible (max plot size used for this is 500m x 500m)
const EARTH_RADIUS = 6378000;
const getBounds = (lat, lon, area) => {
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
  } = props;

  const {
    type: featureType,
    style: featureStyle = {},
    iconSvg,
    minPolygonZoom,
  } = FEATURES[featureKey];

  /**
     Extract feature data from SiteMapContext state
  */
  const [state] = SiteMapContext.useSiteMapContext();
  const {
    neonContextHydrated,
    map: { zoom },
    featureData: {
      [featureType]: {
        [featureKey]: featureData,
      },
    },
  } = state;
  if (!neonContextHydrated || !featureData || !Object.keys(featureData)) { return null; }

  /**
     Render - Popups
     Convention is alphabetical listing of keys since order here doesn't matter
  */
  const renderPopupFunctions = {
    AQUATIC_BENCHMARKS: (siteCode, location) => (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Aquatic Benchmark ${location}`}
        </Typography>
      </Popup>
    ),
    AQUATIC_GROUNDWATER_WELLS: (siteCode, location) => (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Groundwater Well ${location}`}
        </Typography>
      </Popup>
    ),
    AQUATIC_DISCHARGE_POINTS: (siteCode, location) => (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Discharge Point ${location}`}
        </Typography>
      </Popup>
    ),
    AQUATIC_FISH_POINTS: (siteCode, location) => (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Fish Point ${location}`}
        </Typography>
      </Popup>
    ),
    AQUATIC_METEOROLOGICAL_STATIONS: (siteCode, location) => (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Meteorological Station ${location}`}
        </Typography>
      </Popup>
    ),
    AQUATIC_PLANT_TRANSECTS: (siteCode, location) => (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Plant Transect ${location}`}
        </Typography>
      </Popup>
    ),
    AQUATIC_REACHES: (siteCode) => {
      const { areaKm2 } = featureData[siteCode].properties;
      const areaAcres = KM2_TO_ACRES * areaKm2;
      return (
        <Popup className={classes.popup} autoPan>
          <Typography variant="h6" gutterBottom>
            {`${siteCode} Aquatic Reach`}
          </Typography>
          <Typography variant="body1">
            {`Area: ${areaKm2.toFixed(2)} km2 (${areaAcres.toFixed(2)} acres)`}
          </Typography>
        </Popup>
      );
    },
    AQUATIC_RIPARIAN_ASSESSMENTS: (siteCode, location) => (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Riparian Assessment ${location}`}
        </Typography>
      </Popup>
    ),
    AQUATIC_SEDIMENT_POINTS: (siteCode, location) => (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Sediment Point ${location}`}
        </Typography>
      </Popup>
    ),
    AQUATIC_SENSOR_STATIONS: (siteCode, location) => (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Sensor Station ${location}`}
        </Typography>
      </Popup>
    ),
    AQUATIC_STAFF_GAUGES: (siteCode, location) => (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Staff Gauge ${location}`}
        </Typography>
      </Popup>
    ),
    AQUATIC_WET_DEPOSITION_POINTS: (siteCode, location) => (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Wet Deposition Point ${location}`}
        </Typography>
      </Popup>
    ),
    DISTRIBUTED_BASE_PLOTS: (siteCode, location) => (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Distributed Base Plot ${location}`}
        </Typography>
      </Popup>
    ),
    DISTRIBUTED_BIRD_GRIDS: (siteCode, location) => (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Distributed Bird Grid ${location}`}
        </Typography>
      </Popup>
    ),
    DISTRIBUTED_MAMMAL_GRIDS: (siteCode, location) => (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Distributed Mammal Grid ${location}`}
        </Typography>
      </Popup>
    ),
    DISTRIBUTED_TICK_PLOTS: (siteCode, location) => (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Distributed Tick Plot ${location}`}
        </Typography>
      </Popup>
    ),
    FLIGHT_BOX_BOUNDARIES: siteCode => (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} AOP Flight Box`}
        </Typography>
      </Popup>
    ),
    POUR_POINTS: siteCode => (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Aquatic Watershed Pour Point`}
        </Typography>
      </Popup>
    ),
    SAMPLING_BOUNDARIES: (siteCode) => {
      const { areaKm2 } = featureData[siteCode].properties;
      const areaAcres = KM2_TO_ACRES * areaKm2;
      return (
        <Popup className={classes.popup} autoPan>
          <Typography variant="h6" gutterBottom>
            {`${siteCode} Sampling Boundary`}
          </Typography>
          <Typography variant="body1">
            {`Area: ${areaKm2.toFixed(2)} km2 (${areaAcres.toFixed(2)} acres)`}
          </Typography>
        </Popup>
      );
    },
    TOWER_AIRSHEDS: siteCode => (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Tower Airshed Boundary`}
        </Typography>
      </Popup>
    ),
    TOWER_BASE_PLOTS: (siteCode, location) => (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Tower Base Plot ${location}`}
        </Typography>
      </Popup>
    ),
    TOWER_PHENOLOGY_PLOTS: (siteCode, location) => (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Tower Phenology Plot ${location}`}
        </Typography>
      </Popup>
    ),
    TOWERS: siteCode => (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Tower`}
        </Typography>
      </Popup>
    ),
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
        <Popup className={classes.popup} autoPan>
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
    const key = location ? `${siteCode} - ${location}` : siteCode;
    const renderedPopup = location ? renderPopup(siteCode, location) : renderPopup(siteCode);
    const shapeKeys = Object.keys(shapeData);
    let shape = null;
    let position = [];
    let positions = [];
    let bounds = null;
    let icon = null;
    if (shapeData.geometry && shapeData.geometry.coordinates) {
      shape = 'Polygon';
      positions = shapeData.geometry.coordinates;
    }
    if (isPoint(shapeData)) {
      shape = 'Marker';
      position = ['latitude', 'longitude'].every(k => shapeKeys.includes(k))
        ? [shapeData.latitude, shapeData.longitude]
        : shapeData.geometry.coordinates;
      icon = state.map.zoomedIcons.PLACEHOLDER;
      // Some features prefer to render as a marker icon until a high enough zoom level
      if (shapeKeys.includes('plotSize') && iconSvg && minPolygonZoom && minPolygonZoom >= zoom) {
        shape = 'Rectangle';
        bounds = getBounds(shapeData.latitude, shapeData.longitude, shapeData.plotSize);
      }
    }
    switch (shape) {
      case 'Marker':
        return (
          <Marker key={key} position={position} icon={icon}>
            {renderedPopup}
          </Marker>
        );
      case 'Rectangle':
        return (
          <Rectangle key={key} bounds={bounds} {...polygonProps}>
            {renderedPopup}
          </Rectangle>
        );
      case 'Polygon':
        return (
          <Polygon key={key} positions={positions} {...polygonProps}>
            {renderedPopup}
          </Polygon>
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
};

export default SiteBasedFeature;
