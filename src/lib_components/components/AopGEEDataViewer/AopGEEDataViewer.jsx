import React from 'react';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AopDataViewerIcon from '@material-ui/icons/SatelliteOutlined';

import UAParser from 'ua-parser-js';

import Theme from '../Theme/Theme';
import NeonContext from '../NeonContext/NeonContext';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';

const MIN_IFRAME_WIDTH = 240;

/**
   Setup: CSS classes
*/
const useStyles = makeStyles((theme) => ({
  selectionForm: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  iframe: {
    minWidth: `${MIN_IFRAME_WIDTH}px`,
    minHeight: `${MIN_IFRAME_WIDTH}px`,
    border: `1px solid ${theme.palette.grey[700]}`,
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  label: {
    color: theme.palette.grey[500],
    fontSize: '0.9rem',
    marginBottom: theme.spacing(0.5),
  },
  optgroup: {
    fontWeight: Theme.typography.fontWeightMedium,
  },
  tooltipIconButton: {
    marginTop: theme.spacing(-0.5),
    marginLeft: theme.spacing(0.5),
  },
  openInNewLink: {
    display: 'block',
    width: '100%',
    textAlign: 'right',
    marginTop: theme.spacing(0.5),
    fontSize: '0.8rem',
  },
  openInNewIcon: {
    fontSize: '0.95rem',
    margin: theme.spacing(0, 0.5, -0.25, 0),
  },
}));

const isMobileDevice = () => {
  const uaParser = new UAParser();
  const device = uaParser.getDevice();
  let isMobile = false;
  // On my ARM64 Mac device.type is blank
  if (device.type === 'mobile') {
    isMobile = true;
  }
  return isMobile;
};

const handleLaunchMobileOrDesktopWindow = () => {
  // const GEE_DESKTOP_VIEWER_URL = 'https://neon-prod-earthengine.projects.earthengine.app/'
  //   + 'view/neon-aop-gee-data-viewer---desktop';
  // const GEE_MOBILE_VIEWER_URL = 'https://neon-prod-earthengine.projects.earthengine.app/'
  //   + 'view/aop-gee-data-viewer---mobile';
  if (isMobileDevice()) {
    window.open(NeonEnvironment.getAopGEEMobileUrl(), '_blank', 'noopener,noreferrer');
  } else {
    window.open(NeonEnvironment.getAopGEEDesktopUrl(), '_blank', 'noopener,noreferrer');
  }
};

/**
   Main Function
*/
const AopGEEDataViewer = (props) => {
  const classes = useStyles(Theme);
  const AOP_BUTTON_NAME = 'AOP GEE Data Viewer';
  return (
    <Button
      data-gtm="explore-data-products.aop-data-viewer-button"
      // data-gtm-product-code={productCode}
      // data-selenium={`browse-data-products-page.products.${productCode}.aop-data-viewer-button`}
      className={classes.productPaperButton}
      variant="outlined"
      color="primary"
      endIcon={<AopDataViewerIcon />}
      onClick={() => handleLaunchMobileOrDesktopWindow()}
    >
      {AOP_BUTTON_NAME}
    </Button>
  );
};

const WrappedAopGEEDataViewer = Theme.getWrappedComponent(
  NeonContext.getWrappedComponent(AopGEEDataViewer),
);

export default WrappedAopGEEDataViewer;
