import React from 'react';
import renderer from 'react-test-renderer';

import BasicAvailabilityKey from '../BasicAvailabilityKey';

describe('DataProductAvailability - BasicAvailabilityKey', () => {
  test('renders correctly when selection is not enabled (default)', () => {
    const tree = renderer
      .create(<BasicAvailabilityKey />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders correctly when selection is enabled', () => {
    const tree = renderer
      .create(<BasicAvailabilityKey selectionEnabled />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
