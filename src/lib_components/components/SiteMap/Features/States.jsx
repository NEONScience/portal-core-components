import React from 'react';
import PropTypes from 'prop-types';

import SnackbarContent from '@material-ui/core/SnackbarContent';
import Typography from '@material-ui/core/Typography';

import ClickIcon from '@material-ui/icons/TouchApp';

import 'leaflet/dist/leaflet.css';
import { FeatureGroup, Polygon, Popup } from 'react-leaflet';

import NeonContext from '../../NeonContext/NeonContext';
import Theme from '../../Theme/Theme';

import statesShapesJSON from '../../../staticJSON/statesShapes.json';

import SiteMapContext from '../SiteMapContext';
import { ROOT_FEATURE_COLORS } from '../SiteMapUtils';

/**
   Main Component
*/
const States = (props) => {
  const { classes, renderPopupSitesList, positionPopup } = props;

  // Neon Context State
  const [
    { data: neonContextData, isFinal: neonContextIsFinal, hasError: neonContextHasError },
  ] = NeonContext.useNeonContextState();
  const { states: allStates, stateSites } = neonContextData;
  const canRender = neonContextIsFinal && !neonContextHasError;

  // State and Dispatch from SiteMapContext
  const [state, dispatch] = SiteMapContext.useSiteMapContext();

  // Don't render if not all loaded
  if (!canRender) { return null; }

  // Extract selection data
  const { active: selectionActive } = state.selection;
  const selection = selectionActive ? state.selection[selectionActive] : {};

  /**
     Render Method: Popup
  */
  const renderPopup = (stateCode) => {
    if (!allStates[stateCode]) { return null; }
    const renderActions = () => {
      const count = stateSites[stateCode].size;
      if (!selectionActive || !count) { return null; }
      const isTotalSelected = selection.states[stateCode] === 'total';
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
          {`${allStates[stateCode].name} (${stateCode})`}
        </Typography>
        {renderPopupSitesList(stateSites[stateCode])}
        {renderActions()}
      </Popup>
    );
  };

  /**
     Main Render
  */
  return (
    <FeatureGroup>
      {statesShapesJSON.features.map((usState) => {
        const { stateCode } = usState.properties;
        const overlayColor = selectionActive && selection.states[stateCode]
          ? `${selection.states[stateCode]}Selected`
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
            if (state.stateSites[stateCode].size) {
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
            key={usState.properties.stateCode}
            color={ROOT_FEATURE_COLORS[overlayColor]}
            positions={usState.geometry.coordinates}
            {...interactionProps}
          >
            {renderPopup(usState.properties.stateCode)}
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
