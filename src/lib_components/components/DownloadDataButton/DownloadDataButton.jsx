import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/SaveAlt';

import DownloadDataContext from '../DownloadDataContext/DownloadDataContext';
import DownloadProgress from '../DownloadProgress/DownloadProgress';
import DownloadProgressContext from '../DownloadProgress/DownloadProgressContext';
import { makeStyles } from '../Theme/makeStyles';
import { resolveProps } from '../../util/defaultProps';

const DownloadDataDialog = React.lazy(() => import('../DownloadDataDialog/DownloadDataDialog'));

const useStyles = makeStyles()(() => ({
  gtmCaptureButton: {
    '& span': {
      pointerEvents: 'none',
    },
  },
}));

const defaultProps = {
  label: 'Download Data',
};

const DownloadDataButton = (inProps) => {
  const props = resolveProps(defaultProps, inProps);
  const {
    label,
    ...other
  } = props;

  const { classes } = useStyles();

  const [{ dialogOpen, productData }, dispatch] = DownloadDataContext.useDownloadDataState();

  function handleOpenDialog() {
    dispatch({ type: 'setDialogOpen', open: true });
  }

  const gtmProps = {};
  if ((productData || {}).productCode) {
    gtmProps.className = classes.gtmCaptureButton;
    gtmProps['data-gtm-product-code'] = productData.productCode;
  }

  return (
    // Tracks the progress of downloads started from the dialog, outliving the dialog
    <DownloadProgressContext.Provider>
      <Button
        color="primary"
        variant="contained"
        onClick={() => handleOpenDialog()}
        data-selenium="download-data-button"
        endIcon={<DownloadIcon />}
        {...gtmProps}
        {...other}
      >
        {label}
      </Button>
      {!dialogOpen ? null : (
        <Suspense fallback={null}>
          <DownloadDataDialog />
        </Suspense>
      )}
      <DownloadProgress />
    </DownloadProgressContext.Provider>
  );
};

DownloadDataButton.propTypes = {
  label: PropTypes.string,
};

export default DownloadDataButton;
