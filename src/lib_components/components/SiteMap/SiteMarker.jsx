import React from 'react';
import PropTypes from 'prop-types';

import { Marker, Popup } from 'react-leaflet';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SiteDetailsIcon from '@material-ui/icons/InfoOutlined';
import ExploreDataProductsIcon from '@material-ui/icons/InsertChartOutlined';

import Theme from '../Theme/Theme';

import statesJSON from '../../static/states/states.json';
import domainsJSON from '../../static/domains/domains.json';

import SiteIcon, { getSiteLeafletIcon } from './SiteIcon';

const SITE_DETAILS_URL_BASE = 'https://www.neonscience.org/field-sites/field-sites-map/';
const EXPLORE_DATA_PRODUCTS_URL_BASE = 'https://data.neonscience.org/data-products/explore?site=';

const useStyles = makeStyles(theme => ({
  popup: {
    minWidth: '320px',
    '& a': {
      color: theme.palette.secondary.main,
    },
    '& p': {
      margin: 'unset',
    },
    '& a.leaflet-popup-close-button': {
      top: theme.spacing(0.5),
      right: theme.spacing(0.5),
    },
  },
  popupButton: {
    width: '100%',
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
    color: `${Theme.palette.primary.main} !important`,
    borderColor: Theme.palette.primary.main,
    '& span': {
      pointerEvents: 'none',
    },
  },
  popupSiteIcon: {
    width: '20px',
    height: '20px',
    margin: '0px 4px 4px 0px',
  },
  startFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
}));

const SiteMarker = (props) => {
  const classes = useStyles(Theme);
  const {
    zoom,
    site,
    isSelected,
    popupHrefNew,
    popupExploreDataProductsButton,
  } = props;

  const {
    siteCode,
    type,
    terrain,
    description,
    latitude,
    longitude,
    stateCode,
    domainCode,
  } = site;

  const renderPopup = () => {
    let typeTitle = 'Core';
    let typeSubtitle = 'fixed location';
    if (type === 'RELOCATABLE') {
      typeTitle = 'Relocatable';
      typeSubtitle = 'location may change';
    }
    let terrainTitle = 'Terrestrial';
    let terrainSubtitle = 'land-based';
    if (terrain === 'AQUATIC') {
      terrainTitle = 'Aquatic';
      terrainSubtitle = 'water-based';
    }
    const terrainTypeTitle = `${terrainTitle} ${typeTitle}`;
    const terrainTypeSubtitle = `(${terrainSubtitle}, ${typeSubtitle})`;
    const terrainIcon = (
      <SiteIcon
        siteCode={siteCode}
        type={type}
        terrain={terrain}
        width={Theme.spacing(5)}
        height={Theme.spacing(5)}
        style={{ marginRight: Theme.spacing(1) }}
      />
    );
    const target = popupHrefNew ? { target: '_blank' } : {};
    const siteDetailsButton = (
      <Button
        className={classes.popupButton}
        variant="outlined"
        color="primary"
        endIcon={<SiteDetailsIcon />}
        href={`${SITE_DETAILS_URL_BASE}${siteCode}`}
        {...target}
      >
        Site Details
      </Button>
    );
    const exploreDataProductsButton = popupExploreDataProductsButton ? (
      <Button
        className={classes.popupButton}
        variant="outlined"
        color="primary"
        endIcon={<ExploreDataProductsIcon />}
        href={`${EXPLORE_DATA_PRODUCTS_URL_BASE}${siteCode}`}
        {...target}
      >
        Explore Data Products
      </Button>
    ) : null;
    const renderField = (title, value) => (
      <div>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="body2">{value}</Typography>
      </div>
    );
    const stateFieldTitle = (stateCode === 'PR' ? 'Territory' : 'State');
    return (
      <Popup className={classes.popup}>
        <Typography variant="h5" gutterBottom>
          {`${description} (${siteCode})`}
        </Typography>
        <div className={classes.startFlex} style={{ marginBottom: Theme.spacing(1.5) }}>
          {terrainIcon}
          {renderField(terrainTypeTitle, terrainTypeSubtitle)}
        </div>
        <Grid container spacing={2} style={{ marginBottom: Theme.spacing(1) }}>
          <Grid item xs={4}>
            {renderField(stateFieldTitle, statesJSON[stateCode].name)}
          </Grid>
          <Grid item xs={4}>
            {renderField('Domain', `${domainCode} - ${domainsJSON[domainCode].name}`)}
          </Grid>
          <Grid item xs={4}>
            {renderField('Lat./Lon.', `${latitude}, ${longitude}`)}
          </Grid>
        </Grid>
        {siteDetailsButton}
        <br />
        {exploreDataProductsButton}
      </Popup>
    );
  };

  const siteLeafletIcon = getSiteLeafletIcon({
    zoom,
    type,
    terrain,
    isSelected,
  });

  return siteLeafletIcon ? (
    <Marker
      key={siteCode}
      position={[latitude, longitude]}
      icon={siteLeafletIcon}
    >
      {renderPopup(site)}
    </Marker>
  ) : null;
};

SiteMarker.propTypes = {
  zoom: PropTypes.number,
  isSelected: PropTypes.bool,
  popupHrefNew: PropTypes.bool,
  popupExploreDataProductsButton: PropTypes.bool,
  site: PropTypes.shape({
    siteCode: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['CORE', 'RELOCATABLE']).isRequired,
    terrain: PropTypes.oneOf(['TERRESTRIAL', 'AQUATIC']).isRequired,
    domainCode: PropTypes.string.isRequired,
    stateCode: PropTypes.string.isRequired,
  }).isRequired,
};

SiteMarker.defaultProps = {
  zoom: null,
  isSelected: false,
  popupHrefNew: true,
  popupExploreDataProductsButton: true,
};

export default SiteMarker;
