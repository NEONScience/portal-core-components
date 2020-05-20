import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import 'leaflet/dist/leaflet.css';
import { Popup } from 'react-leaflet';

import SiteMapContext from '../SiteMapContext';
import CommonFeatureGroup from './CommonFeatureGroup';
import { FEATURES } from '../SiteMapUtils';

/**
   Main Component
*/
const DistributesTickPlots = (props) => {
  const { classes } = props;

  const { KEY: featureKey, type: featureType } = FEATURES.DISTRIBUTED_TICK_PLOTS;

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
  const renderPopup = (siteCode, location) => {
    if (!featureData[siteCode] || !featureData[siteCode][location]) { return null; }
    return (
      <Popup className={classes.popup} autoPan>
        <Typography variant="h6" gutterBottom>
          {`${siteCode} Distributed Tick Plot ${location}`}
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

DistributesTickPlots.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default DistributesTickPlots;
