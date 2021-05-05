import React from 'react';

import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import ErrorIcon from '@material-ui/icons/Warning';

import NeonContext from '../NeonContext/NeonContext';

export default function AvailabilityPending(props) {
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

AvailabilityPending.defaultProps = {
  message: 'Loading Sites...',
};
