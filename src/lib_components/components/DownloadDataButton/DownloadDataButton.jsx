import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DownloadIcon from '@material-ui/icons/CloudDownload';

import DownloadDataDialog from '../DownloadDataDialog/DownloadDataDialog';

import DownloadDataContext from '../DownloadDataContext/DownloadDataContext';
import Theme from '../Theme/Theme';

const useStyles = makeStyles(() => ({
  gtmCaptureButton: {
    '& span': {
      pointerEvents: 'none',
    },
  },
}));

const DownloadDataButton = (props) => {
  const {
    label,
    ...other
  } = props;

  const classes = useStyles();

  const [{ productData }, dispatch] = DownloadDataContext.useDownloadDataState();

  function handleOpenDialog() {
    dispatch({ type: 'setDialogOpen', open: true });
  }

  const gtmProps = {};
  if (productData.productCode) {
    gtmProps.className = classes.gtmCaptureButton;
    gtmProps['data-gtm-product-code'] = productData.productCode;
  }

  return (
    <React.Fragment>
      <Button
        color="primary"
        variant="contained"
        onClick={handleOpenDialog}
        data-selenium="download-data-button"
        {...gtmProps}
        {...other}
      >
        {label}
        <DownloadIcon style={{ marginLeft: Theme.spacing(1) }} />
      </Button>
      <DownloadDataDialog />
    </React.Fragment>
  );
};

DownloadDataButton.propTypes = {
  label: PropTypes.string,
};

DownloadDataButton.defaultProps = {
  label: 'Download Data',
};

const WrappedDownloadDataButton = Theme.getWrappedComponent(DownloadDataButton);

export default WrappedDownloadDataButton;
