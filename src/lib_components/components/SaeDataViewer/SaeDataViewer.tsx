import React from 'react';

import { FallbackProps } from 'react-error-boundary';

import Grid from '@mui/material/Grid';

import SaeDataViewerContext, { SaeDataViewerProps } from './SaeDataViewerContext';
import SaeDataViewerContainer from './SaeDataViewerContainer';

import ComponentErrorBoundary from '../Error/ComponentErrorBoundary';
import CustomComponentFallback from '../Error/CustomComponentFallback';
import ErrorCard from '../Card/ErrorCard';
import NeonContext from '../NeonContext/NeonContext';
import { resolveProps } from '../../util/defaultProps';

const SaeDataViewerFallbackComponent: React.FC<FallbackProps> = (
  inProps: FallbackProps,
): React.JSX.Element => {
  const { resetErrorBoundary } = inProps;
  return (
    <CustomComponentFallback
      {...inProps}
      // eslint-disable-next-line react/no-unstable-nested-components
      FallbackComponent={() => (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <ErrorCard
              title="Component Error"
              message="SAE Data Viewer encountered a problem"
              actionLabel="Reset"
              onActionClick={resetErrorBoundary}
            />
          </Grid>
        </Grid>
      )}
    />
  );
};

const defaultProps: SaeDataViewerProps = {
  productCode: undefined,
};

const SaeDataViewer: React.FC<SaeDataViewerProps> = (
  inProps: SaeDataViewerProps,
): React.JSX.Element => {
  const props = resolveProps(defaultProps, inProps) as SaeDataViewerProps;
  return (
    <ComponentErrorBoundary
      fallbackComponent={SaeDataViewerFallbackComponent}
      onReset={() => { /* noop for boundary reset */ }}
    >
      <SaeDataViewerContext.Provider productCode={props.productCode}>
        <SaeDataViewerContainer />
      </SaeDataViewerContext.Provider>
    </ComponentErrorBoundary>
  );
};

const WrappedSaeDataViewer = NeonContext.getWrappedComponent(SaeDataViewer);

export default WrappedSaeDataViewer;
