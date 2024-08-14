import React from 'react';
import renderer from 'react-test-renderer';

import MockTheme from '../../../../__mocks__/MockTheme';
import StoryMap from '../StoryMap';

describe('StoryMap', () => {
  test('Renders correctly with no title', () => {
    const tree = renderer
      .create(<MockTheme><StoryMap url="https://foo.bar" /></MockTheme>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders correctly with a custom title', () => {
    const tree = renderer
      .create(<MockTheme><StoryMap url="https://foo.bar" title="Foo" /></MockTheme>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
