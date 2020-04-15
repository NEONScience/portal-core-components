import React from 'react';
import PropTypes from 'prop-types';

import SnackbarContent from '@material-ui/core/SnackbarContent';
import Typography from '@material-ui/core/Typography';

import ClickIcon from '@material-ui/icons/TouchApp';

import 'leaflet/dist/leaflet.css';
import { FeatureGroup, Polygon, Popup } from 'react-leaflet';

import Theme from '../../Theme/Theme';

import SiteMapContext from '../SiteMapContext';
import { FEATURE_TYPES, ROOT_FEATURE_COLORS } from '../SiteMapUtils';

/**
   Main Component
*/
const States = (props) => {
  const { classes, renderPopupSitesList, positionPopup } = props;

  // State and Dispatch from SiteMapContext
  const [state, dispatch] = SiteMapContext.useSiteMapContext();
  const { neonContextHydrated } = state;

  // Don't render if not all loaded
  if (!neonContextHydrated) { return null; }

  // Extract featrure and selection data
  const { [FEATURE_TYPES.STATES]: featureData } = state.featureData;
  const { derived: { states: selectedStates }, active: selectionActive } = state.selection;

  /**
     Render Method: Popup
  */
  const renderPopup = (stateCode) => {
    if (!featureData[stateCode]) { return null; }
    const usState = featureData[stateCode];
    const renderActions = () => {
      const count = usState.sites.size;
      if (!selectionActive || !count) { return null; }
      const isTotalSelected = selectedStates[stateCode] === 'total';
      const verb = isTotalSelected ? 'remove' : 'add';
      const preposition = isTotalSelected ? 'from' : 'to';
      const all = count === 1 ? '' : 'all ';
      const plural = count === 1 ? '' : 's';
      return (
        <SnackbarContent
          className={classes.infoSnackbar}
          style={{ marginTop: Theme.spacing(1) }}
          message={(
            <div className={classes.startFlex}>
              <ClickIcon className={classes.infoSnackbarIcon} />
              <div>
                <Typography variant="body2">
                  {/* eslint-disable react/jsx-one-expression-per-line */}
                  Click to <b>{verb} {all}{count} site{plural}</b> {preposition} selection
                  {/* eslint-enable react/jsx-one-expression-per-line */}
                </Typography>
              </div>
            </div>
          )}
        />
      );
    };
    return (
      <Popup className={classes.popup} autoPan={!selectionActive}>
        <Typography variant="h6" gutterBottom>
          {`${usState.name} (${stateCode})`}
        </Typography>
        {renderPopupSitesList(usState.sites)}
        {renderActions()}
      </Popup>
    );
  };

  /**
     Main Render
  */
  return (
    <FeatureGroup>
      {Object.keys(featureData).map((stateCode) => {
        const usState = featureData[stateCode];
        const overlayColor = selectionActive && selectedStates[stateCode]
          ? `${selectedStates[stateCode]}Selected`
          : 'states';
        /* eslint-disable no-underscore-dangle */
        const interactionProps = selectionActive ? {
          onMouseOver: (e) => {
            e.target._path.setAttribute('stroke', ROOT_FEATURE_COLORS.hover);
            e.target._path.setAttribute('fill', ROOT_FEATURE_COLORS.hover);
            e.target.openPopup();
            positionPopup(e);
          },
          onMouseMove: (e) => { positionPopup(e); },
          onMouseOut: (e) => {
            e.target._path.setAttribute('stroke', ROOT_FEATURE_COLORS[overlayColor]);
            e.target._path.setAttribute('fill', ROOT_FEATURE_COLORS[overlayColor]);
            e.target.closePopup();
          },
          onClick: () => {
            if (usState.sites.size) { // Not all states has NEON sites
              dispatch({ type: 'toggleStateSelected', stateCode });
            }
          },
        } : {
          onMouseOver: (e) => {
            e.target._path.setAttribute('stroke', ROOT_FEATURE_COLORS.hover);
            e.target._path.setAttribute('fill', ROOT_FEATURE_COLORS.hover);
          },
          onMouseOut: (e) => {
            e.target._path.setAttribute('stroke', ROOT_FEATURE_COLORS[overlayColor]);
            e.target._path.setAttribute('fill', ROOT_FEATURE_COLORS[overlayColor]);
          },
        };
        /* eslint-enable no-underscore-dangle */
        return (
          <Polygon
            key={stateCode}
            color={ROOT_FEATURE_COLORS[overlayColor]}
            positions={usState.feature.geometry.coordinates}
            {...interactionProps}
          >
            {renderPopup(stateCode)}
          </Polygon>
        );
      })}
    </FeatureGroup>
  );
};

States.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  positionPopup: PropTypes.func.isRequired,
  renderPopupSitesList: PropTypes.func.isRequired,
};

export default States;
