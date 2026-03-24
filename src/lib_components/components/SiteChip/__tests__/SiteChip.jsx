import React from 'react';
import { render } from '@testing-library/react';

import MockTheme from '../../../../__mocks__/MockTheme';
import SiteChip from '../SiteChip';

describe('SiteChip', () => {
  test('Renders correctly with only a label', () => {
    const tree = render(<MockTheme><SiteChip label="foo" /></MockTheme>);
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
    const tree = render(<MockTheme>{chip}</MockTheme>);
    expect(tree).toMatchSnapshot();
  });
});
