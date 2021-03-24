import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DownloadIcon from '@material-ui/icons/SaveAlt';

import DownloadDataContext from '../DownloadDataContext/DownloadDataContext';
import Theme from '../Theme/Theme';

const DownloadDataDialog = React.lazy(() => import('../DownloadDataDialog/DownloadDataDialog'));

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
    <>
      <Button
        color="primary"
        variant="contained"
        onClick={handleOpenDialog}
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
    </>
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
