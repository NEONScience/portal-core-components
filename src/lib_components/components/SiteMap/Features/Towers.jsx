import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import 'leaflet/dist/leaflet.css';
import { FeatureGroup, Marker, Popup } from 'react-leaflet';

import SiteMapContext from '../SiteMapContext';
import { FEATURES } from '../SiteMapUtils';

/**
   Main Component
*/
const Towers = (props) => {
  const { classes } = props;

  const { KEY: featureKey, type: featureType } = FEATURES.TOWERS;

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
          {`${siteCode} Tower`}
        </Typography>
      </Popup>
    );
  };

  /**
     Main Render
  */
  return (
    <FeatureGroup>
      {Object.keys(featureData).flatMap(siteCode => (
        Object.keys(featureData[siteCode]).map((location) => {
          const tower = featureData[siteCode][location];
          return (
            <Marker
              key={siteCode}
              position={[tower.latitude, tower.longitude]}
              icon={state.map.zoomedIcons.PLACEHOLDER}
            >
              {renderPopup(siteCode)}
            </Marker>
          );
        })
      ))}
    </FeatureGroup>
  );
};

Towers.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default Towers;
