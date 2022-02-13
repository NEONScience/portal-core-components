import React from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import ComponentFallback from './ComponentFallback';

interface ComponentErrorBoundaryProps {
  children: React.ReactNode | React.ReactNodeArray;
}

const ComponentErrorBoundary: React.FC<ComponentErrorBoundaryProps> = (
  props: ComponentErrorBoundaryProps,
): JSX.Element => {
  const { children }: ComponentErrorBoundaryProps = props;
  return (
    <ErrorBoundary FallbackComponent={ComponentFallback}>
      {children}
    </ErrorBoundary>
  );
};

export default ComponentErrorBoundary;
