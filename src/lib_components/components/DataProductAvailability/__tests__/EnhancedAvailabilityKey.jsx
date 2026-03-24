import React from 'react';
import { render } from '@testing-library/react';

import MockTheme from '../../../../__mocks__/MockTheme';
import EnhancedAvailabilityKey from '../EnhancedAvailabilityKey';

describe('DataProductAvailability - EnhancedAvailabilityKey', () => {
  test('renders correctly when selection is not enabled (default)', () => {
    const tree = render(<MockTheme><EnhancedAvailabilityKey /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('renders correctly when selection is enabled', () => {
    const tree = render(<MockTheme><EnhancedAvailabilityKey selectionEnabled /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
});
