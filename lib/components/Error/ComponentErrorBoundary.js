import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ComponentFallback from './ComponentFallback';
import { resolveProps } from '../../util/defaultProps';
const defaultProps = {
    onReset: (...args)=>{},
    onError: (error, info)=>{},
    fallbackComponent: undefined
};
const ComponentErrorBoundary = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    const { children, onReset, onError, fallbackComponent } = props;
    return /*#__PURE__*/ _jsx(ErrorBoundary, {
        FallbackComponent: fallbackComponent || ComponentFallback,
        onReset: onReset,
        onError: onError,
        children: children
    });
};
export default ComponentErrorBoundary;
