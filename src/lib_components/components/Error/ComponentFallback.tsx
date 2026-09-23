import React from 'react';

import { FallbackProps } from 'react-error-boundary';

import Grid from '@mui/material/Grid';

import ErrorCard from '../Card/ErrorCard';

const ComponentFallback: React.FC<FallbackProps> = (
  props: FallbackProps,
): React.JSX.Element => {
  const { error, resetErrorBoundary }: FallbackProps = props;
  // eslint-disable-next-line no-console
  console.error(error);
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <ErrorCard
          title="Something broke"
          message={(error as any)?.message}
          actionLabel="Reset"
          onActionClick={resetErrorBoundary}
        />
      </Grid>
    </Grid>
  );
};

export default ComponentFallback;
