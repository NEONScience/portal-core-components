import React from 'react';
import PropTypes from 'prop-types';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import ClickIcon from '@material-ui/icons/TouchApp';
import ExploreDataProductsIcon from '@material-ui/icons/InsertChartOutlined';
import LocationIcon from '@material-ui/icons/MyLocation';
import SiteDetailsIcon from '@material-ui/icons/InfoOutlined';

import 'leaflet/dist/leaflet.css';
import { FeatureGroup, Marker, Popup } from 'react-leaflet';

import Theme from '../../Theme/Theme';

import SiteMapContext from '../SiteMapContext';
import {
  FEATURES,
  FEATURE_TYPES,
  SELECTABLE_FEATURE_TYPES,
  SITE_DETAILS_URL_BASE,
  EXPLORE_DATA_PRODUCTS_URL_BASE,
} from '../SiteMapUtils';

/**
   Main Component
*/
const Sites = (props) => {
  const { featureKey, classes, positionPopup } = props;

  // State, Dispatch, et al. from SiteMapContext
  const [state, dispatch] = SiteMapContext.useSiteMapContext();
  const { neonContextHydrated } = state;
  const { getIconClassName } = SiteMapContext;

  // Don't render if not all loaded
  if (!neonContextHydrated) { return null; }

  // Extract selection data
  const selectionActive = state.selection.active === SELECTABLE_FEATURE_TYPES.SITES;
  const { [SELECTABLE_FEATURE_TYPES.SITES]: selectedSites } = state.selection;

  // Generate the list of siteCodes based on the feature
  const feature = FEATURES[featureKey];
  const sitesData = state.featureData[FEATURE_TYPES.SITES];
  const siteCodes = Object.keys(sitesData).filter(siteCode => (
    sitesData[siteCode].type === feature.attributes.type
      && sitesData[siteCode].terrain === feature.attributes.terrain
  ));

  // Filters?
  if (!siteCodes.length) { return null; }

  const getInteractionProps = (site, isSelected) => (
    selectionActive ? {
      onMouseOver: (e) => { e.target.openPopup(); positionPopup(e); },
      onMouseOut: (e) => { e.target.closePopup(); },
      onClick: (e) => {
        /* eslint-disable no-underscore-dangle */
        e.target._icon.className = getIconClassName(classes, site.type, !isSelected);
        e.target._icon.blur();
        dispatch({ type: 'toggleSiteSelected', site: site.siteCode });
        /* eslint-enable no-underscore-dangle */
      },
    } : {}
  );

  /**
     Render Method: Popup
  */
  const renderPopup = (site) => {
    const { [site.stateCode]: usState = {} } = state
      .featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.STATES.KEY];
    const { [site.domainCode]: domain = {} } = state
      .featureData[FEATURE_TYPES.BOUNDARIES][FEATURES.DOMAINS.KEY];
    let typeTitle = 'Core';
    let typeSubtitle = 'fixed location';
    if (site.type === 'RELOCATABLE') {
      typeTitle = 'Relocatable';
      typeSubtitle = 'location may change';
    }
    let terrainTitle = 'Terrestrial';
    let terrainSubtitle = 'land-based';
    if (site.terrain === 'AQUATIC') {
      terrainTitle = 'Aquatic';
      terrainSubtitle = 'water-based';
    }
    const terrainTypeTitle = `${terrainTitle} ${typeTitle}`;
    const terrainTypeSubtitle = `${terrainSubtitle}; ${typeSubtitle}`;
    const terrainIcon = (
      <img
        src={feature.iconSvg}
        alt={site.terrain}
        title={`${terrainTitle} ${terrainSubtitle}`}
        width={Theme.spacing(5)}
        height={Theme.spacing(5)}
        style={{ marginRight: Theme.spacing(1) }}
      />
    );
    const stateFieldTitle = (site.stateCode === 'PR' ? 'Territory' : 'State');
    const renderActions = () => {
      if (selectionActive) {
        const isSelected = selectedSites.has(site.siteCode);
        const verb = isSelected ? 'remove' : 'add';
        const preposition = isSelected ? 'from' : 'to';
        return (
          <SnackbarContent
            className={classes.infoSnackbar}
            message={(
              <div className={classes.startFlex}>
                <ClickIcon className={classes.infoSnackbarIcon} />
                <div>
                  <Typography variant="body2">
                    {/* eslint-disable react/jsx-one-expression-per-line */}
                    Click to <b>{verb}</b> {preposition} selection
                    {/* eslint-enable react/jsx-one-expression-per-line */}
                  </Typography>
                </div>
              </div>
            )}
          />
        );
      }
      const actionButtonProps = {
        className: classes.popupButton,
        variant: 'outlined',
        color: 'primary',
        target: '_blank',
      };
      return (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              endIcon={<SiteDetailsIcon />}
              href={`${SITE_DETAILS_URL_BASE}${site.siteCode}`}
              {...actionButtonProps}
            >
              Site Details
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              endIcon={<ExploreDataProductsIcon />}
              href={`${EXPLORE_DATA_PRODUCTS_URL_BASE}${site.siteCode}`}
              {...actionButtonProps}
            >
              Explore Data
            </Button>
          </Grid>
        </Grid>
      );
    };
    return (
      <Popup className={classes.popup} autoPan={!selectionActive}>
        <div className={classes.startFlex} style={{ marginBottom: Theme.spacing(1.5) }}>
          {terrainIcon}
          <Typography variant="h6" style={{ lineHeight: '1.4rem' }}>
            {`${site.description} (${site.siteCode})`}
          </Typography>
        </div>
        <Grid container spacing={1} style={{ marginBottom: Theme.spacing(1) }}>
          {/* Terrain and Type */}
          <Grid item xs={8}>
            <Typography variant="subtitle2">{terrainTypeTitle}</Typography>
            <Typography variant="caption"><i>{terrainTypeSubtitle}</i></Typography>
          </Grid>
          {/* State/Territory */}
          <Grid item xs={4} style={{ textAlign: 'right' }}>
            <Typography variant="subtitle2">{stateFieldTitle}</Typography>
            <Typography variant="body2">{usState.name}</Typography>
          </Grid>
          {/* Latitude/Longitude */}
          <Grid item xs={5} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <div className={classes.startFlex}>
              <CopyToClipboard text={`${site.latitude} ${site.longitude}`}>
                <Tooltip title="Latitude / Longitude (click to copy)">
                  <IconButton
                    size="small"
                    style={{ marginRight: Theme.spacing(0.5) }}
                    aria-label="Latitude / Longitude (click to copy)"
                  >
                    <LocationIcon />
                  </IconButton>
                </Tooltip>
              </CopyToClipboard>
              <Typography
                variant="caption"
                aria-label="Latitude / Longitude"
                style={{ fontFamily: 'monospace', textAlign: 'right' }}
              >
                {site.latitude}
                <br />
                {site.longitude}
              </Typography>
            </div>
          </Grid>
          {/* Domain */}
          <Grid item xs={7} style={{ textAlign: 'right' }}>
            <Typography variant="subtitle2">Domain</Typography>
            <Typography variant="body2">
              {`${site.domainCode} - ${domain.name}`}
            </Typography>
          </Grid>
        </Grid>
        {renderActions()}
      </Popup>
    );
  };

  /**
     Main Render
  */
  return (
    <FeatureGroup>
      {siteCodes.map((siteCode) => {
        const site = sitesData[siteCode];
        const isSelected = selectionActive && selectedSites.has(siteCode);
        if (!state.map.zoomedIcons[featureKey] || !site.latitude || !site.longitude) {
          return null;
        }
        const icon = state.map.zoomedIcons[featureKey][isSelected ? 'SELECTED' : 'UNSELECTED'];
        return (
          <Marker
            key={siteCode}
            position={[site.latitude, site.longitude]}
            icon={icon}
            {...getInteractionProps(site, isSelected)}
          >
            {renderPopup(site)}
          </Marker>
        );
      })}
    </FeatureGroup>
  );
};

Sites.propTypes = {
  featureKey: PropTypes.oneOf(Object.keys(FEATURES)).isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  positionPopup: PropTypes.func.isRequired,
};

export default Sites;
