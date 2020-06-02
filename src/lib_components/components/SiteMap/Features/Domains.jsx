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
const Domains = (props) => {
  const { classes, renderPopupSitesList, positionPopup } = props;

  // State and Dispatch from SiteMapContext
  const [state, dispatch] = SiteMapContext.useSiteMapContext();
  const { neonContextHydrated } = state;

  // Don't render if not all loaded
  if (!neonContextHydrated) { return null; }

  // Extract featrure and selection data
  const { [FEATURES.DOMAINS.KEY]: featureData } = state.featureData[FEATURE_TYPES.BOUNDARIES];
  const {
    derived: { [FEATURES.DOMAINS.KEY]: selectedDomains },
    active: selectionActive,
  } = state.selection;

  /**
     Render Method: Popup
  */
  const renderPopup = (domainCode) => {
    if (!featureData[domainCode]) { return null; }
    const domain = featureData[domainCode];
    const renderActions = () => {
      const count = domain.sites.size;
      if (!selectionActive || !count) { return null; }
      const isTotalSelected = selectedDomains[domainCode] === 'total';
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
          {`${domain.name} (${domainCode})`}
        </Typography>
        {renderPopupSitesList(domain.sites)}
        {renderActions()}
      </Popup>
    );
  };

  /**
     Main Render
  */
  // If a domain is the current focus location put it at the end of the domains list so
  // that it renders last. This makes it so no other domain lines will overlap on top of it
  // and the focus highlight will be complete.
  const sortedDomains = Object.keys(featureData).sort(
    a => (a === state.focusLocation.current ? 1 : -1),
  );
  return (
    <FeatureGroup>
      {sortedDomains.map((domainCode) => {
        const domain = featureData[domainCode];
        const baseColor = state.focusLocation.current === domainCode
          ? `#${tinycolor(FEATURES.DOMAINS.style.color).darken(20).toHex()}`
          : FEATURES.DOMAINS.style.color;
        const overlayColor = selectionActive && selectedDomains[domainCode]
          ? BOUNDARY_COLORS[`${selectedDomains[domainCode]}Selected`]
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
            dispatch({ type: 'toggleDomainSelected', domainCode });
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
            key={domainCode}
            color={overlayColor}
            positions={domain.geometry.coordinates}
            {...interactionProps}
          >
            {renderPopup(domainCode)}
          </Polygon>
        );
      })}
    </FeatureGroup>
  );
};

Domains.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  positionPopup: PropTypes.func.isRequired,
  renderPopupSitesList: PropTypes.func.isRequired,
};

export default Domains;
