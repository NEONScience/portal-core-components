import React from 'react';

type AnyRecord = Record<string, any>;

/**
 * Utility function for resolving default component props to specified props
 * @param defaultProps The default props to apply
 * @param props The current set of props
 * @returns The resolved set of props
 */
export const resolveProps = (
  defaultProps: AnyRecord,
  props: AnyRecord,
): AnyRecord => {
  const resolved = { ...props };
  // eslint-disable-next-line no-restricted-syntax
  for (const key in defaultProps) {
    if (Object.prototype.hasOwnProperty.call(defaultProps, key)) {
      const propName = key as string;
      if (resolved[propName] === undefined) {
        resolved[propName] = defaultProps[propName];
      }
    }
  }
  return resolved;
};

/**
 * Higher order component wrapper function to apply default props
 * to a component
 * @param WrappedComponent The component to apply default props to
 * @param defaultProps The set of default props to apply
 * @returns The component with default props applied
 */
export const withDefaultProps = <T extends AnyRecord>(
  WrappedComponent: React.ComponentType<T>,
  defaultProps: Omit<T, keyof T>,
): React.ComponentType<T> => (
    (props: T): React.JSX.Element => {
      const resolvedProps = resolveProps(defaultProps, props);
      return (<WrappedComponent {...(resolvedProps as T)} />);
    }
  );

export default {
  resolveProps,
  withDefaultProps,
};
