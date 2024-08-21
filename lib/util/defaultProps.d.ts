import React from 'react';
type AnyRecord = Record<string, any>;
/**
 * Utility function for resolving default component props to specified props
 * @param defaultProps The default props to apply
 * @param props The current set of props
 * @returns The resolved set of props
 */
export declare const resolveProps: (defaultProps: AnyRecord, props: AnyRecord) => AnyRecord;
/**
 * Higher order component wrapper function to apply default props
 * to a component
 * @param WrappedComponent The component to apply default props to
 * @param defaultProps The set of default props to apply
 * @returns The component with default props applied
 */
export declare const withDefaultProps: <T extends AnyRecord>(WrappedComponent: React.ComponentType<T>, defaultProps: Omit<T, keyof T>) => React.ComponentType<T>;
declare const _default: {
    resolveProps: (defaultProps: AnyRecord, props: AnyRecord) => AnyRecord;
    withDefaultProps: <T extends AnyRecord>(WrappedComponent: React.ComponentType<T>, defaultProps: Omit<T, keyof T>) => React.ComponentType<T>;
};
export default _default;
