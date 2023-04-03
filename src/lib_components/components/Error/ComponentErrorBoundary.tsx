import React from 'react';

import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

import ComponentFallback from './ComponentFallback';

interface ErrorInfo {
  componentStack: string;
}

interface ComponentErrorBoundaryProps {
  children: React.ReactNode | React.ReactNode[];
  onReset?: (...args: Array<unknown>) => void;
  onError?: (error: Error, info: ErrorInfo) => void;
  fallbackComponent?: React.ComponentType<FallbackProps>;
}

const ComponentErrorBoundary: React.FC<ComponentErrorBoundaryProps> = (
  props: ComponentErrorBoundaryProps,
): JSX.Element => {
  const {
    children,
    onReset,
    onError,
    fallbackComponent,
  }: ComponentErrorBoundaryProps = props;
  return (
    <ErrorBoundary
      FallbackComponent={fallbackComponent || ComponentFallback}
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
  fallbackComponent: undefined,
};

export default ComponentErrorBoundary;
