import React from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import ComponentFallback from './ComponentFallback';

interface ErrorInfo {
  componentStack: string;
}

interface ComponentErrorBoundaryProps {
  children: React.ReactNode | React.ReactNodeArray;
  onReset?: (...args: Array<unknown>) => void;
  onError?: (error: Error, info: ErrorInfo) => void;
}

const ComponentErrorBoundary: React.FC<ComponentErrorBoundaryProps> = (
  props: ComponentErrorBoundaryProps,
): JSX.Element => {
  const {
    children,
    onReset,
    onError,
  }: ComponentErrorBoundaryProps = props;
  return (
    <ErrorBoundary
      FallbackComponent={ComponentFallback}
      onReset={onReset}
      onError={onError}
    >
      {children}
    </ErrorBoundary>
  );
};

ComponentErrorBoundary.defaultProps = {
  onReset: (...args: Array<unknown>): void => {},
  onError: (error: Error, info: ErrorInfo): void => {},
};

export default ComponentErrorBoundary;
