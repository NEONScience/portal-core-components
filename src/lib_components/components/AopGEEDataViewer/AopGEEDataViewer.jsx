import React from 'react';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AopDataViewerIcon from '@material-ui/icons/SatelliteOutlined';
import Tooltip from '@material-ui/core/Tooltip';

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

const getMobileOrDesktopUrl = () => {
  if (isMobileDevice()) {
    return NeonEnvironment.getAopGEEMobileUrl();
  }
  return NeonEnvironment.getAopGEEDesktopUrl();
};

/**
   Main Function
*/
const AopGEEDataViewer = (props) => {
  const classes = useStyles(Theme);
  const aopButtonName = 'AOP GEE Data Viewer';
  const tooltip = 'Launch the AOP Google Earth Engine data visuialization tool.';
  const url = getMobileOrDesktopUrl();
  return (
    <Tooltip placement="right" title={tooltip}>
      <Button
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        variant="outlined"
        data-gtm="explore-data-products.aop-gee-data-viewer-button"
        className={classes.productPaperButton}
        color="primary"
        endIcon={<AopDataViewerIcon />}
      >
        {aopButtonName}
      </Button>
    </Tooltip>
  );
};

const WrappedAopGEEDataViewer = Theme.getWrappedComponent(
  NeonContext.getWrappedComponent(AopGEEDataViewer),
);

export default WrappedAopGEEDataViewer;
