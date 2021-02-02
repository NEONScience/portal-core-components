import React from 'react';
import renderer from 'react-test-renderer';

import StoryMap from '../StoryMap';

describe('StoryMap', () => {
  test('Renders correctly with no title', () => {
    const tree = renderer
      .create(<StoryMap url="https://foo.bar" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders correctly with a custom title', () => {
    const tree = renderer
      .create(<StoryMap url="https://foo.bar" title="Foo" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
