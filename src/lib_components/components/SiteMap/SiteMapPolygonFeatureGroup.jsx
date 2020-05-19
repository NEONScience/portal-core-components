/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';

import tinycolor from 'tinycolor2';

import 'leaflet/dist/leaflet.css';
import { FeatureGroup, Polygon, Rectangle } from 'react-leaflet';

import SiteMapContext from './SiteMapContext';
import { FEATURES, FEATURE_TYPES } from './SiteMapUtils';

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

const SiteMapPolygonFeatureGroup = (props) => {
  const {
    featureKey,
    renderPopup,
  } = props;

  const {
    type: featureType,
    polygonStyle,
    rectStyle,
  } = FEATURES[featureKey];

  /**
     Extract feature data from SiteMapContext state
  */
  const [state] = SiteMapContext.useSiteMapContext();
  const {
    neonContextHydrated,
    featureData: {
      [featureType]: {
        [featureKey]: featureData,
      },
    },
  } = state;
  if (!neonContextHydrated || !Object.keys(featureData)) { return null; }

  /**
     Set up common shape props
  */
  const featureStyle = polygonStyle || rectStyle || { color: '#666666' };
  const hoverColor = `#${tinycolor(featureStyle.color).lighten(10).toHex()}`;
  const interactionProps = {
    onMouseOver: (e) => {
      e.target._path.setAttribute('stroke', hoverColor);
      e.target._path.setAttribute('fill', hoverColor);
    },
    onMouseOut: (e) => {
      e.target._path.setAttribute('stroke', featureStyle.color);
      e.target._path.setAttribute('fill', featureStyle.color);
    },
  };

  /**
     Render a single shape
  */
  const renderShape = (siteCode, location = null) => {
    const shapeData = location && featureData[siteCode][location]
      ? featureData[siteCode][location]
      : featureData[siteCode];
    const key = location ? `${siteCode} - ${location}` : siteCode;
    const renderedPopup = location ? renderPopup(siteCode, location) : renderPopup(siteCode);
    return ['latitude', 'longitude', 'plotSize'].every(k => Object.keys(shapeData).includes(k))
      ? (
        <Rectangle
          key={key}
          bounds={getBounds(shapeData.latitude, shapeData.longitude, shapeData.plotSize)}
          {...featureStyle}
          {...interactionProps}
        >
          {renderedPopup}
        </Rectangle>
      ) : (
        <Polygon
          key={key}
          positions={shapeData.geometry.coordinates || []}
          {...featureStyle}
          {...interactionProps}
        >
          {renderedPopup}
        </Polygon>
      );
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

SiteMapPolygonFeatureGroup.propTypes = {
  featureKey: PropTypes.oneOf(Object.keys(FEATURES)).isRequired,
  renderPopup: PropTypes.func.isRequired,
};

export default SiteMapPolygonFeatureGroup;
