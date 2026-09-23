import React from 'react';
import { render } from '@testing-library/react';

import MockTheme from '../../../../__mocks__/MockTheme';
import StoryMap from '../StoryMap';

describe('StoryMap', () => {
  test('Renders correctly with no title', () => {
    const tree = render(<MockTheme><StoryMap url="https://foo.bar" /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('Renders correctly with a custom title', () => {
    const tree = render(<MockTheme><StoryMap url="https://foo.bar" title="Foo" /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
});
