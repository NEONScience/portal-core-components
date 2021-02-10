import React from 'react';
import renderer from 'react-test-renderer';

import EnhancedAvailabilityKey from '../EnhancedAvailabilityKey';

describe('DataProductAvailability - EnhancedAvailabilityKey', () => {
  test('renders correctly when selection is not enabled (default)', () => {
    const tree = renderer
      .create(<EnhancedAvailabilityKey />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders correctly when selection is enabled', () => {
    const tree = renderer
      .create(<EnhancedAvailabilityKey selectionEnabled />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
