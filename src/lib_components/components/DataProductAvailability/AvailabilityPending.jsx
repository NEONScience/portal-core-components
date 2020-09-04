import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import ErrorIcon from '@material-ui/icons/Warning';

import NeonContext from '../NeonContext/NeonContext';

export default function AvailabilityPending() {
  const [
    { isFinal: neonContextIsFinal, hasError: neonContextHasError },
  ] = NeonContext.useNeonContextState();

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
          <React.Fragment>
            <Typography variant="subtitle2" component="h6" gutterBottom>
              Loading Sites...
            </Typography>
            <CircularProgress />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <ErrorIcon fontSize="large" color="error" />
            <Typography variant="subtitle2" component="h6" style={{ marginTop: '8px' }}>
              Error - Unable to Load Sites
            </Typography>
          </React.Fragment>
        )}
      </CardContent>
    </Card>
  );
}
