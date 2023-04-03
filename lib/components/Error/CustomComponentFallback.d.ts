import React from 'react';
import { FallbackProps } from 'react-error-boundary';
interface CustomComponentFallbackProps extends FallbackProps {
    FallbackComponent: React.ComponentType<Record<string, unknown>>;
}
declare const CustomComponentFallback: React.FC<CustomComponentFallbackProps>;
export default CustomComponentFallback;
