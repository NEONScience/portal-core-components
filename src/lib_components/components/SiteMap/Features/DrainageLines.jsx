import React from 'react';
import PropTypes from 'prop-types';

import tinycolor from 'tinycolor2';

import Typography from '@material-ui/core/Typography';

import 'leaflet/dist/leaflet.css';
import { FeatureGroup, Polyline, Popup } from 'react-leaflet';

import SiteMapContext from '../SiteMapContext';
import {
  FEATURES,
  BOUNDARY_COLORS,
} from '../SiteMapUtils';

/**
   Main Component
*/
const DrainageLines = (props) => {
  const { classes } = props;

  const { KEY: featureKey, type: featureType } = FEATURES.DRAINAGE_LINES;

  // Extract feature data from SiteMapContext State
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
     Render Method: Popup
  */
  const renderPopup = (siteCode) => {
    if (!featureData[siteCode]) { return null; }
    return (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Watershed Drainage Lines`}
        </Typography>
      </Popup>
    );
  };

  /**
     Main Render
  */
  return (
    <FeatureGroup>
      {Object.keys(featureData).map((siteCode) => {
        const drainageLine = featureData[siteCode];
        const featureColor = BOUNDARY_COLORS[featureKey];
        const hoverColor = `#${tinycolor(featureColor).lighten(10).toHex()}`;
        /* eslint-disable no-underscore-dangle */
        const interactionProps = {
          onMouseOver: (e) => {
            e.target._path.setAttribute('stroke', hoverColor);
          },
          onMouseOut: (e) => {
            e.target._path.setAttribute('stroke', featureColor);
          },
        };
        /* eslint-enable no-underscore-dangle */
        return (
          <Polyline
            key={siteCode}
            color={featureColor}
            positions={drainageLine.geometry.coordinates}
            {...interactionProps}
          >
            {renderPopup(siteCode)}
          </Polyline>
        );
      })}
    </FeatureGroup>
  );
};

DrainageLines.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default DrainageLines;
