import React, { ErrorInfo } from 'react';
import { FallbackProps } from 'react-error-boundary';
interface ComponentErrorBoundaryProps {
    children: React.ReactNode | React.ReactNode[];
    onReset?: (...args: Array<unknown>) => void;
    onError?: (error: Error, info: ErrorInfo) => void;
    fallbackComponent?: React.ComponentType<FallbackProps>;
}
declare const ComponentErrorBoundary: React.FC<ComponentErrorBoundaryProps>;
export default ComponentErrorBoundary;
