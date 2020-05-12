import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import 'leaflet/dist/leaflet.css';
import { FeatureGroup, Marker, Popup } from 'react-leaflet';

import SiteMapContext from '../SiteMapContext';
import {
  FEATURES,
} from '../SiteMapUtils';

/**
   Main Component
*/
const PourPoints = (props) => {
  const { classes } = props;

  const { KEY: featureKey, type: featureType } = FEATURES.POUR_POINTS;

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
          {`${siteCode} Aquatic Watershed Pour Point`}
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
        const pourPoint = featureData[siteCode];
        return (
          <Marker
            key={siteCode}
            position={pourPoint.geometry.coordinates}
            icon={state.map.zoomedIcons.PLACEHOLDER}
          >
            {renderPopup(siteCode)}
          </Marker>
        );
      })}
    </FeatureGroup>
  );
};

PourPoints.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default PourPoints;
