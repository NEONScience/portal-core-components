import React from 'react';
import renderer from 'react-test-renderer';

import '../../../../__mocks__/NeonContext';
import NeonContext from '../../NeonContext/NeonContext';

import AvailabilityPending from '../AvailabilityPending';

describe('DataProductAvailability - AvailabilityPending', () => {
  beforeEach(() => {
    NeonContext.useNeonContextState.mockReset();
  });
  test('renders correctly for NeonContext that is neither error nor final', () => {
    NeonContext.useNeonContextState.mockReturnValue([{ isFinal: false, hasError: false }]);
    const tree = renderer
      .create(<AvailabilityPending />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders correctly for NeonContext that is final with error', () => {
    NeonContext.useNeonContextState.mockReturnValue([{ isFinal: true, hasError: true }]);
    const tree = renderer
      .create(<AvailabilityPending />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders correctly for NeonContext that is final without error', () => {
    NeonContext.useNeonContextState.mockReturnValue([{ isFinal: true, hasError: false }]);
    const tree = renderer
      .create(<AvailabilityPending />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
