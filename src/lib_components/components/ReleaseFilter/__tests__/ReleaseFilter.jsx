import React from 'react';
import renderer from 'react-test-renderer';

import ReleaseFilter from '../ReleaseFilter';

describe('ReleaseFilter', () => {
  test('Renders with no props', () => {
    const tree = renderer
      .create(<ReleaseFilter />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
