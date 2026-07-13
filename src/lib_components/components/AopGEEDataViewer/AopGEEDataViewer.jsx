import React from 'react';

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import AopDataViewerIcon from '@mui/icons-material/SatelliteOutlined';
import PropTypes from 'prop-types';

import { UAParser } from 'ua-parser-js';

import Theme from '../Theme/Theme';
import NeonContext from '../NeonContext/NeonContext';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import { makeStyles } from '../Theme/makeStyles';
import { resolveProps } from '../../util/defaultProps';

/**
   Setup: CSS classes
*/
const useStyles = makeStyles()((theme) => ({
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
  // Handle device case where type is blank
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

const defaultProps = {
  isFullWidth: true,
};

/**
   Main Function
*/
const AopGEEDataViewer = (inProps) => {
  const props = resolveProps(defaultProps, inProps);
  const {
    isFullWidth,
  } = props;
  const { classes } = useStyles();
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

const WrappedAopGEEDataViewer = Theme.getWrappedComponent(
  NeonContext.getWrappedComponent(AopGEEDataViewer),
);

export default WrappedAopGEEDataViewer;
