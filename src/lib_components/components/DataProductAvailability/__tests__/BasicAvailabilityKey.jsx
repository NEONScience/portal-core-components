import React from 'react';
import renderer from 'react-test-renderer';

import BasicAvailabilityKey from '../BasicAvailabilityKey';

import MockTheme from '../../../../__mocks__/MockTheme';

describe('DataProductAvailability - BasicAvailabilityKey', () => {
  test('renders correctly when selection is not enabled (default)', () => {
    const tree = renderer
      .create(<MockTheme><BasicAvailabilityKey /></MockTheme>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders correctly when selection is enabled', () => {
    const tree = renderer
      .create(<MockTheme><BasicAvailabilityKey selectionEnabled /></MockTheme>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
