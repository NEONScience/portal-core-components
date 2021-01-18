import React from 'react';
import renderer from 'react-test-renderer';

import SiteChip from '../SiteChip';

describe('SiteChip', () => {
  test('Renders correctly with only a label', () => {
    const tree = renderer
      .create(<SiteChip label="foo" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Preserves MUI chip props', () => {
    const chip = (
      <SiteChip
        label="foo"
        size="large"
        color="primary"
        variant="default"
        data-selenium="chip"
      />
    );
    const tree = renderer
      .create(chip)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
