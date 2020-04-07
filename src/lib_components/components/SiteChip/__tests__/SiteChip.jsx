import React from 'react';
import renderer from 'react-test-renderer';

import SiteChip from '../SiteChip';

describe('SiteChip', () => {
  test('Renders correctly', () => {
    const tree = renderer
      .create(<SiteChip label="foo" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
