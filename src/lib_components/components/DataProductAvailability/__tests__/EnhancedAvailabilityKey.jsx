import React from 'react';
import renderer from 'react-test-renderer';

import MockTheme from '../../../../__mocks__/MockTheme';
import EnhancedAvailabilityKey from '../EnhancedAvailabilityKey';

describe('DataProductAvailability - EnhancedAvailabilityKey', () => {
  test('renders correctly when selection is not enabled (default)', () => {
    const tree = renderer
      .create(<MockTheme><EnhancedAvailabilityKey /></MockTheme>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders correctly when selection is enabled', () => {
    const tree = renderer
      .create(<MockTheme><EnhancedAvailabilityKey selectionEnabled /></MockTheme>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
