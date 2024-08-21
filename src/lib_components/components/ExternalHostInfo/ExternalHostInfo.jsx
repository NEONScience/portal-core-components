import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@mui/styles';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import InfoMessageCard from '../Card/InfoMessageCard';
import ExternalHost from '../ExternalHost/ExternalHost';
import ExternalHostProductSpecificLinks from '../ExternalHostProductSpecificLinks/ExternalHostProductSpecificLinks';
import Theme from '../Theme/Theme';
import { existsNonEmpty } from '../../util/typeUtil';
import { resolveProps } from '../../util/defaultProps';

const useStyles = makeStyles((theme) => ({
  startFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cardDivider: {
    margin: theme.spacing(0, 0, 2, 0),
  },
}));

const defaultProps = {
  expandable: false,
  siteCodes: null,
};

const ExternalHostInfo = (inProps) => {
  const props = resolveProps(defaultProps, inProps);
  const classes = useStyles(Theme);
  const {
    productCode,
    expandable,
    siteCodes,
    ...otherProps
  } = props;

  const [expanded, setExpanded] = useState(!expandable);

  const externalHost = ExternalHost.getByProductCode(productCode);
  const externalHostProduct = ExternalHost.getProductSpecificInfo(productCode);
  if (!externalHost) { return null; }

  // Not only _should_ the info have specific links (links in addition to the top-level
  // one for the host), but _does_ it?
  const hasSpecificLinks = (
    externalHost.linkType === ExternalHost.LINK_TYPES.BY_PRODUCT
      && externalHost.getProductLinks(productCode).length
  ) || externalHost.linkType === ExternalHost.LINK_TYPES.BY_SITE;

  const allowNoLinks = hasSpecificLinks
    && (externalHostProduct.allowNoAvailability === true)
    && !existsNonEmpty(siteCodes);

  // Remaining setup
  const externalGeneralLink = externalHost.renderLink(productCode);
  const expandTitle = `${expanded ? 'Hide' : 'Show'} links to externally hosted data`;
  const rootProps = {};
  Object.keys(otherProps)
    .filter((key) => ['data-selenium', 'style', 'className'].includes(key))
    .forEach((key) => { rootProps[key] = otherProps[key]; });

  let blurb = null;
  let dataVariety = externalHost.hostDataVariety || 'Data';
  if (externalHost.hostType === ExternalHost.HOST_TYPES.REFORMATTED_DATA) {
    blurb = (
      <>
        {`${dataVariety} for this product are available in other formats from`}
        &nbsp;
        {externalGeneralLink}
      </>
    );
  }
  if ((externalHost.hostType === ExternalHost.HOST_TYPES.EXCLUSIVE_DATA)
      || allowNoLinks) {
    blurb = (
      <>
        {`${dataVariety} for this product are only available from`}
        &nbsp;
        {externalGeneralLink}
      </>
    );
  }
  // Default: ExternalHost.HOST_TYPES.ADDITIONAL_DATA:
  if (!blurb) {
    dataVariety = externalHost.hostDataVariety || 'Additional data';
    const are = hasSpecificLinks ? 'are' : 'may be';
    blurb = (
      <>
        {`${dataVariety} associated with this product ${are} available from`}
        &nbsp;
        {externalGeneralLink}
      </>
    );
  }

  return (
    <div {...rootProps}>
      <InfoMessageCard
        title="External Host"
        messageContent={(
          <>
            <Divider className={classes.cardDivider} />
            <div className={classes.startFlex}>
              <Typography variant="subtitle2" style={{ flexGrow: 1 }}>
                {blurb}
              </Typography>
              {hasSpecificLinks && expandable && !allowNoLinks ? (
                <Tooltip title={expandTitle}>
                  <IconButton
                    aria-label={expandTitle}
                    onClick={() => setExpanded(!expanded)}
                    style={{ marginLeft: Theme.spacing(2) }}
                    size="large"
                  >
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Tooltip>
              ) : null}
            </div>
            <div
              style={{ display: hasSpecificLinks && expanded && !allowNoLinks ? 'block' : 'none' }}
            >
              <ExternalHostProductSpecificLinks productCode={productCode} siteCodes={siteCodes} />
            </div>
          </>
        )}
      />
    </div>
  );
};

ExternalHostInfo.propTypes = {
  productCode: PropTypes.string.isRequired,
  expandable: PropTypes.bool,
  siteCodes: PropTypes.arrayOf(PropTypes.string),
};

const WrappedExternalHostInfo = Theme.getWrappedComponent(ExternalHostInfo);

export default WrappedExternalHostInfo;
