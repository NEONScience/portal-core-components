import React from 'react';

import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import ErrorIcon from '@mui/icons-material/Warning';

import NeonContext from '../NeonContext/NeonContext';
import { resolveProps } from '../../util/defaultProps';

const defaultProps = {
  message: 'Loading Sites...',
};

export default function AvailabilityPending(inProps) {
  const props = resolveProps(defaultProps, inProps);
  const [
    { isFinal: neonContextIsFinal, hasError: neonContextHasError },
  ] = NeonContext.useNeonContextState();
  const { message } = props;

  if (neonContextIsFinal && !neonContextHasError) {
    return null;
  }

  const status = (neonContextIsFinal && neonContextHasError) ? 'error' : 'loading';

  return (
    <Card style={{ width: '100%' }}>
      <CardContent
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          flexDirection: 'column',
        }}
      >
        {status === 'loading' ? (
          <>
            <Typography variant="subtitle2" component="h6" gutterBottom>
              {message}
            </Typography>
            <CircularProgress />
          </>
        ) : (
          <>
            <ErrorIcon fontSize="large" color="error" />
            <Typography variant="subtitle2" component="h6" style={{ marginTop: '8px' }}>
              Error - Unable to Load Sites
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}

AvailabilityPending.propTypes = {
  message: PropTypes.string,
};
