import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import 'leaflet/dist/leaflet.css';
import { Popup } from 'react-leaflet';

import SiteMapContext from '../SiteMapContext';
import CommonFeatureGroup from './CommonFeatureGroup';
import { FEATURES, KM2_TO_ACRES } from '../SiteMapUtils';

/**
   Main Component
*/
const SamplingBoundaries = (props) => {
  const { classes } = props;

  const { KEY: featureKey, type: featureType } = FEATURES.SAMPLING_BOUNDARIES;

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
  };

  /**
     Main Render
  */
  return (
    <CommonFeatureGroup
      featureKey={featureKey}
      renderPopup={renderPopup}
    />
  );
};

SamplingBoundaries.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default SamplingBoundaries;
