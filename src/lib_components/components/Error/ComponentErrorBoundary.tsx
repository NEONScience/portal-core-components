import React, { ErrorInfo } from 'react';

import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

import ComponentFallback from './ComponentFallback';

import { resolveProps } from '../../util/defaultProps';

interface ComponentErrorBoundaryProps {
  children: React.ReactNode | React.ReactNode[];
  onReset?: (...args: Array<unknown>) => void;
  onError?: (error: Error, info: ErrorInfo) => void;
  fallbackComponent?: React.ComponentType<FallbackProps>;
}

const defaultProps = {
  onReset: (...args: Array<unknown>): void => {},
  onError: (error: Error, info: ErrorInfo): void => {},
  fallbackComponent: undefined,
};

const ComponentErrorBoundary: React.FC<ComponentErrorBoundaryProps> = (
  inProps: ComponentErrorBoundaryProps,
): React.JSX.Element => {
  const props = resolveProps(defaultProps, inProps) as ComponentErrorBoundaryProps;
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

export default ComponentErrorBoundary;
