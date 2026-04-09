import React from 'react';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AopDataViewerIcon from '@material-ui/icons/SatelliteOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';

import UAParser from 'ua-parser-js';

import Theme from '../Theme/Theme';
import NeonContext from '../NeonContext/NeonContext';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';

/**
   Setup: CSS classes
*/
const useStyles = makeStyles((theme) => ({
  productPaperButton: {
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1.5),
    borderColor: theme.palette.primary.main,
    '& span': {
      pointerEvents: 'none',
    },
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
  const {
    isFullWidth,
  } = props;
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
        fullWidth={isFullWidth}
        color="primary"
        endIcon={<AopDataViewerIcon />}
      >
        {aopButtonName}
      </Button>
    </Tooltip>
  );
};

AopGEEDataViewer.propTypes = {
  isFullWidth: PropTypes.bool,
};

AopGEEDataViewer.defaultProps = {
  isFullWidth: true,
};

const WrappedAopGEEDataViewer = Theme.getWrappedComponent(
  NeonContext.getWrappedComponent(AopGEEDataViewer),
);

export default WrappedAopGEEDataViewer;
