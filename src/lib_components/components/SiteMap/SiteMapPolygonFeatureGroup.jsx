import React from 'react';
import PropTypes from 'prop-types';

import tinycolor from 'tinycolor2';

import 'leaflet/dist/leaflet.css';
import { FeatureGroup, Polygon } from 'react-leaflet';

import SiteMapContext from './SiteMapContext';
import { FEATURES } from './SiteMapUtils';

const SiteMapPolygonFeatureGroup = (props) => {
  const {
    featureKey,
    renderPopup,
  } = props;

  const {
    type: featureType,
    polygonStyle = {},
  } = FEATURES[featureKey];
  const hoverColor = `#${tinycolor(polygonStyle.color).lighten(10).toHex()}`;

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
     Main Render
  */
  return (
    <FeatureGroup>
      {Object.keys(featureData).map((siteCode) => {
        const siteFeatureData = featureData[siteCode];
        /* eslint-disable no-underscore-dangle */
        const interactionProps = {
          onMouseOver: (e) => {
            e.target._path.setAttribute('stroke', hoverColor);
            e.target._path.setAttribute('fill', hoverColor);
          },
          onMouseOut: (e) => {
            e.target._path.setAttribute('stroke', polygonStyle.color);
            e.target._path.setAttribute('fill', polygonStyle.color);
          },
        };
        /* eslint-enable no-underscore-dangle */
        return (
          <Polygon
            key={siteCode}
            positions={siteFeatureData.geometry.coordinates}
            {...polygonStyle}
            {...interactionProps}
          >
            {renderPopup(siteCode)}
          </Polygon>
        );
      })}
    </FeatureGroup>
  );
};

SiteMapPolygonFeatureGroup.propTypes = {
  featureKey: PropTypes.oneOf(Object.keys(FEATURES)).isRequired,
  renderPopup: PropTypes.func.isRequired,
};

export default SiteMapPolygonFeatureGroup;
