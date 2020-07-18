import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';

import Theme from '../Theme/Theme';
import NeonContext from '../NeonContext/NeonContext';
import ExternalHost from '../ExternalHost/ExternalHost';

const useStyles = makeStyles(theme => ({
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

  const { productCode } = props;

  const [{ data: neonContextData }] = NeonContext.useNeonContextState();
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
        {(externalHost.getProductLinks(productCode) || []).map(link => (
          <li key={link.key}>
            {link.node}
          </li>
        ))}
      </ul>
    );
  };

  const renderLinksBySite = () => {
    if (typeof externalHost.getSiteLink !== 'function') { return null; }
    const sitesByStateName = {};
    Object.keys(allSites).sort().forEach((siteCode) => {
      const stateName = allStates[allSites[siteCode].stateCode].name;
      if (!sitesByStateName[stateName]) { sitesByStateName[stateName] = []; }
      sitesByStateName[stateName].push(siteCode);
    });
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: Theme.spacing(3) }}>
        {Object.keys(sitesByStateName)
          .sort()
          .map((stateName) => {
            const links = sitesByStateName[stateName]
              .map(siteCode => (
                { siteCode, link: externalHost.getSiteLink(allSites, siteCode, productCode) }
              ))
              .filter(entry => entry.link !== null);
            if (!links.length) { return null; }
            return (
              <div key={stateName} style={listDivStyle}>
                <Typography variant="subtitle2" key={stateName}>
                  {stateName}
                </Typography>
                <ul className={classes.ulLinkList}>
                  {links.map(entry => <li key={entry.siteCode}>{entry.link}</li>)}
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
};

ExternalHostProductSpecificLinks.defaultProps = {
  productCode: null,
};
