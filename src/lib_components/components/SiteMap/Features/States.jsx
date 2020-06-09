/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';

import tinycolor from 'tinycolor2';

import SnackbarContent from '@material-ui/core/SnackbarContent';
import Typography from '@material-ui/core/Typography';

import ClickIcon from '@material-ui/icons/TouchApp';

import 'leaflet/dist/leaflet.css';
import { FeatureGroup, Polygon, Popup } from 'react-leaflet';

import Theme from '../../Theme/Theme';

import SiteMapContext from '../SiteMapContext';
import { FEATURES, FEATURE_TYPES, BOUNDARY_COLORS } from '../SiteMapUtils';

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
  const { [FEATURES.STATES.KEY]: featureData } = state.featureData[FEATURE_TYPES.BOUNDARIES];
  const {
    derived: { [FEATURES.STATES.KEY]: selectedStates },
    active: selectionActive,
  } = state.selection;

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
      <Popup className={classes.popup} autoPan={false}>
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
  // If a state is the current focus location put it at the end of the states list so
  // that it renders last. This makes it so no other state lines will overlap on top of it
  // and the focus highlight will be complete.
  const sortedStates = Object.keys(featureData).sort(
    a => (a === state.focusLocation.current ? 1 : -1),
  );
  return (
    <FeatureGroup>
      {sortedStates.map((stateCode) => {
        const usState = featureData[stateCode];
        const baseColor = state.focusLocation.current === stateCode
          ? `#${tinycolor(FEATURES.STATES.style.color).darken(20).toHex()}`
          : FEATURES.STATES.style.color;
        const overlayColor = selectionActive && selectedStates[stateCode]
          ? BOUNDARY_COLORS[`${selectedStates[stateCode]}Selected`]
          : baseColor;
        const interactionProps = selectionActive ? {
          onMouseOver: (e) => {
            e.target._path.setAttribute('stroke', BOUNDARY_COLORS.hover);
            e.target._path.setAttribute('fill', BOUNDARY_COLORS.hover);
            e.target.openPopup();
            positionPopup(e);
          },
          onMouseMove: (e) => { positionPopup(e); },
          onMouseOut: (e) => {
            e.target._path.setAttribute('stroke', overlayColor);
            e.target._path.setAttribute('fill', overlayColor);
            e.target.closePopup();
          },
          onClick: () => {
            if (usState.sites.size) { // Not all states has NEON sites
              dispatch({ type: 'toggleStateSelected', stateCode });
            }
          },
        } : {
          onMouseOver: (e) => {
            e.target._path.setAttribute('stroke', BOUNDARY_COLORS.hover);
            e.target._path.setAttribute('fill', BOUNDARY_COLORS.hover);
          },
          onMouseOut: (e) => {
            e.target._path.setAttribute('stroke', overlayColor);
            e.target._path.setAttribute('fill', overlayColor);
          },
        };
        return (
          <Polygon
            key={stateCode}
            color={overlayColor}
            positions={usState.geometry.coordinates}
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
