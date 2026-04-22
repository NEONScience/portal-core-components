import React from 'react';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SaeDataViewerIcon from '@material-ui/icons/TimelineOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';

import Theme from '../Theme/Theme';
import NeonContext from '../NeonContext/NeonContext';
// import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import RouteService from '../../service/RouteService';

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

/**
   Main Function
*/
const SaeDataViewer = (props) => {
  const {
    isFullWidth,
    site,
    product,
    startDate,
    endDate,
  } = props;
  const classes = useStyles(Theme);
  const saeButtonName = 'SAE Data Viewer';
  const tooltip = 'Launch the SAE data visuialization tool.';

  const url = RouteService.getSaeViewerUrlPath(product, site, startDate, endDate);
  // const url = new URL(NeonEnvironment.getSaeViewerUrl());
  // if (site) {
  //   url.searchParams.set('site', site);
  // }
  // if (product) {
  //   url.searchParams.set('product', product);
  // }
  // if (startDate) {
  //   url.searchParams.set('start_date', startDate);
  // }
  // if (endDate) {
  //   url.searchParams.set('end_date', endDate);
  // }
  return (
    <Tooltip placement="right" title={tooltip}>
      <Button
        href={url.toString()}
        target="_blank"
        rel="noopener noreferrer"
        variant="outlined"
        data-gtm="sae-data-viewer-button"
        className={classes.productPaperButton}
        fullWidth={isFullWidth}
        color="primary"
        endIcon={<SaeDataViewerIcon />}
      >
        {saeButtonName}
      </Button>
    </Tooltip>
  );
};

SaeDataViewer.propTypes = {
  isFullWidth: PropTypes.bool,
  site: PropTypes.string,
  product: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

SaeDataViewer.defaultProps = {
  isFullWidth: true,
  site: '',
  product: '',
  startDate: '',
  endDate: '',
};

const WrappedSaeDataViewer = Theme.getWrappedComponent(
  NeonContext.getWrappedComponent(SaeDataViewer),
);

export default WrappedSaeDataViewer;
