import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';

import Theme from '../Theme/Theme';
import NeonContext from '../NeonContext/NeonContext';
import ExternalHost from '../ExternalHost/ExternalHost';

const useStyles = makeStyles((theme) => ({
  siteLinksContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing(3),
  },
  siteLinksLoadingContainer: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  ulLinkList: {
    paddingLeft: theme.spacing(2),
    margin: theme.spacing(0.5, 0),
    fontSize: '0.85rem',
    '& > li': {
      marginBottom: theme.spacing(0.5),
    },
  },
}));

export default function ExternalHostProductSpecificLinks(props) {
  const classes = useStyles(Theme);

  const { productCode, siteCodes } = props;

  const [{
    data: neonContextData,
    isFinal: neonContextIsFinal,
  }] = NeonContext.useNeonContextState();
  const { sites: allSites, states: allStates } = neonContextData;

  const belowSm = useMediaQuery(Theme.breakpoints.only('xs'));
  const belowMd = useMediaQuery(Theme.breakpoints.down('sm'));
  const belowLg = useMediaQuery(Theme.breakpoints.down('md'));

  const externalHost = ExternalHost.getByProductCode(productCode);
  if (!externalHost || !Object.keys(ExternalHost.LINK_TYPES).includes(externalHost.linkType)) {
    return null;
  }

  let columnBasis = '25%';
  if (belowLg) { columnBasis = '33.33%'; }
  if (belowMd) { columnBasis = '50%'; }
  if (belowSm) { columnBasis = '100%'; }
  const listDivStyle = { flex: `1 0 ${columnBasis}`, padding: Theme.spacing(0, 2, 2, 0) };

  const renderLinksByProduct = () => {
    if (typeof externalHost.getProductLinks !== 'function') { return null; }
    return (
      <ul style={{ marginTop: Theme.spacing(3), marginBottom: Theme.spacing(0.75) }}>
        {(externalHost.getProductLinks(productCode) || []).map((link) => (
          <li key={link.key}>
            {link.node}
          </li>
        ))}
      </ul>
    );
  };

  const renderLinksBySite = () => {
    if (typeof externalHost.getSiteLink !== 'function') { return null; }
    // What sites are available? If a list was not provided then show them all.
    // eslint-disable-next-line react/prop-types
    const filterByAvailability = Array.isArray(siteCodes) && siteCodes.length;
    let availableSites = allSites;
    if (filterByAvailability) {
      availableSites = Object.fromEntries(
        // eslint-disable-next-line react/prop-types
        siteCodes.map((siteCode) => [siteCode, allSites[siteCode]]),
      );
    }
    // Sites still loading; render loading message
    if (!neonContextIsFinal) {
      return (
        <div className={classes.siteLinksLoadingContainer}>
          <CircularProgress size={36} style={{ margin: Theme.spacing(4, 0) }} />
          <Typography variant="body1" style={{ marginBottom: Theme.spacing(4) }}>
            Loading sites...
          </Typography>
        </div>
      );
    }
    // Sites failed to load; render failure
    if (!Object.keys(allSites).length) {
      return (
        <div className={classes.siteLinksLoadingContainer}>
          <WarningIcon
            fontSize="large"
            style={{ margin: Theme.spacing(4, 0), color: Theme.palette.error.main }}
          />
          <Typography variant="body1" style={{ marginBottom: Theme.spacing(4) }}>
            Sites failed to load.
          </Typography>
        </div>
      );
    }
    // Sites loaded; build a structure of available sites grouped by state and render links as such
    const sitesByStateName = {};
    Object.keys(availableSites).sort().forEach((siteCode) => {
      const stateName = allStates[allSites[siteCode].stateCode].name;
      if (!sitesByStateName[stateName]) { sitesByStateName[stateName] = []; }
      sitesByStateName[stateName].push(siteCode);
    });
    return (
      <div className={classes.siteLinksContainer}>
        {Object.keys(sitesByStateName)
          .sort()
          .map((stateName) => {
            const links = sitesByStateName[stateName]
              // eslint-disable-next-line react/prop-types
              .filter((siteCode) => !filterByAvailability || siteCodes.includes(siteCode))
              .map((siteCode) => (
                { siteCode, link: externalHost.getSiteLink(allSites, siteCode, productCode) }
              ))
              .filter((entry) => entry.link !== null);
            if (!links.length) { return null; }
            return (
              <div key={stateName} style={listDivStyle}>
                <Typography variant="subtitle2" key={stateName}>
                  {stateName}
                </Typography>
                <ul className={classes.ulLinkList}>
                  {links.map((entry) => <li key={entry.siteCode}>{entry.link}</li>)}
                </ul>
              </div>
            );
          })}
      </div>
    );
  };

  switch (externalHost.linkType) {
    case ExternalHost.LINK_TYPES.BY_PRODUCT:
      return renderLinksByProduct();
    case ExternalHost.LINK_TYPES.BY_SITE:
      return renderLinksBySite();
    default:
      return null;
  }
}

ExternalHostProductSpecificLinks.propTypes = {
  productCode: PropTypes.string,
  siteCodes: PropTypes.arrayOf(PropTypes.string),
};

ExternalHostProductSpecificLinks.defaultProps = {
  productCode: null,
  siteCodes: null,
};
