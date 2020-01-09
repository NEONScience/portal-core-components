import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Typography from '@material-ui/core/Typography';

import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoIcon from '@material-ui/icons/Info';

import Theme from '../Theme/Theme';
import ExternalHost from '../ExternalHost/ExternalHost';
import ExternalHostProductSepcificLinks from '../ExternalHostProductSpecificLinks/ExternalHostProductSpecificLinks';

const useStyles = makeStyles(theme => ({
  startFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  infoSnackbar: {
    backgroundColor: theme.palette.grey[50],
    color: '#000',
    border: `1px solid ${theme.palette.primary.main}80`,
    margin: Theme.spacing(0.5, 0, 3, 0),
    padding: Theme.spacing(0, 2),
    '& div': {
      width: '100%',
    },
  },
  infoSnackbarIcon: {
    color: theme.palette.grey[300],
    marginRight: theme.spacing(2),
  },
}));

const ExternalHostInfo = (props) => {
  const classes = useStyles(Theme);
  const {
    productCode,
    expandable,
    ...otherProps
  } = props;

  const [expanded, setExpanded] = useState(!expandable);

  const externalHost = ExternalHost.getByProductCode(productCode);
  if (!externalHost) { return null; }

  // Not only _should_ the info have specific links (links in addition to the top-level
  // one for the host), but _does_ it?
  const hasSpecificLinks = (
    externalHost.linkType === ExternalHost.LINK_TYPES.BY_PRODUCT
      && externalHost.getProductLinks(productCode).length
  ) || externalHost.linkType === ExternalHost.LINK_TYPES.BY_SITE;

  // Remaining setup
  const externalGeneralLink = externalHost.renderLink();
  const expandTitle = `${expanded ? 'hide' : 'show'} external host links to data`;
  const rootProps = {};
  Object.keys(otherProps)
    .filter(key => ['data-selenium', 'style', 'className'].includes(key))
    .forEach((key) => { rootProps[key] = otherProps[key]; });

  let blurb = null;
  let dataVariety = externalHost.hostDataVariety || 'Data';
  if (externalHost.hostType === ExternalHost.HOST_TYPES.REFORMATTED_DATA) {
    blurb = (
      <React.Fragment>
        {`${dataVariety} for this product are available in other formats from`}
        &nbsp;
        {externalGeneralLink}
      </React.Fragment>
    );
  }
  if (externalHost.hostType === ExternalHost.HOST_TYPES.EXCLUSIVE_DATA) {
    blurb = (
      <React.Fragment>
        {`${dataVariety} for this product are only available from`}
        &nbsp;
        {externalGeneralLink}
      </React.Fragment>
    );
  }
  // Default: ExternalHost.HOST_TYPES.ADDITIONAL_DATA:
  if (!blurb) {
    dataVariety = externalHost.hostDataVariety || 'Additional data';
    const are = hasSpecificLinks ? 'are' : 'may be';
    blurb = (
      <React.Fragment>
        {`${dataVariety} associated with this product ${are} available from`}
        &nbsp;
        {externalGeneralLink}
      </React.Fragment>
    );
  }

  const content = (
    <React.Fragment>
      <div className={classes.startFlex} style={{ width: '100%' }}>
        <InfoIcon fontSize="large" className={classes.infoSnackbarIcon} />
        <Typography variant="subtitle2" style={{ flexGrow: 1 }}>
          {blurb}
        </Typography>
        {hasSpecificLinks && expandable ? (
          <IconButton
            title={expandTitle}
            aria-label={expandTitle}
            onClick={() => setExpanded(!expanded)}
            style={{ marginLeft: Theme.spacing(2) }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        ) : null}
      </div>
      <div style={{ width: '100%', display: hasSpecificLinks && expanded ? 'block' : 'none' }}>
        <Divider style={{ margin: Theme.spacing(1.5, 0) }} />
        <ExternalHostProductSepcificLinks productCode={productCode} />
      </div>
    </React.Fragment>
  );

  return (
    <div {...rootProps}>
      <SnackbarContent
        className={classes.infoSnackbar}
        message={content}
      />
    </div>
  );
};

ExternalHostInfo.propTypes = {
  productCode: PropTypes.string.isRequired,
  expandable: PropTypes.bool,
};

ExternalHostInfo.defaultProps = {
  expandable: false,
};

export default ExternalHostInfo;
