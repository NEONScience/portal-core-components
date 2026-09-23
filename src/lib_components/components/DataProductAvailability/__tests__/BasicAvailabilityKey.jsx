import React from 'react';
import { render } from '@testing-library/react';

import BasicAvailabilityKey from '../BasicAvailabilityKey';

import MockTheme from '../../../../__mocks__/MockTheme';

describe('DataProductAvailability - BasicAvailabilityKey', () => {
  test('renders correctly when selection is not enabled (default)', () => {
    const tree = render(<MockTheme><BasicAvailabilityKey /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('renders correctly when selection is enabled', () => {
    const tree = render(<MockTheme><BasicAvailabilityKey selectionEnabled /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
});
