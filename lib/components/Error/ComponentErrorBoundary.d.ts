import React from 'react';
interface ErrorInfo {
    componentStack: string;
}
interface ComponentErrorBoundaryProps {
    children: React.ReactNode | React.ReactNodeArray;
    onReset?: (...args: Array<unknown>) => void;
    onError?: (error: Error, info: ErrorInfo) => void;
}
declare const ComponentErrorBoundary: React.FC<ComponentErrorBoundaryProps>;
export default ComponentErrorBoundary;
