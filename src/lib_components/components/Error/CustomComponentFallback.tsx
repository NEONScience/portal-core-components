import React from 'react';

import { FallbackProps } from 'react-error-boundary';

interface CustomComponentFallbackProps extends FallbackProps {
  FallbackComponent: React.ComponentType<Record<string, unknown>>;
}

const CustomComponentFallback: React.FC<CustomComponentFallbackProps> = (
  props: CustomComponentFallbackProps,
): JSX.Element => {
  const { FallbackComponent }: CustomComponentFallbackProps = props;
  return (
    <FallbackComponent {...props} />
  );
};

export default CustomComponentFallback;
