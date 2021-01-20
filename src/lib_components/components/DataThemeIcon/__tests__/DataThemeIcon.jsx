import React from 'react';
import renderer from 'react-test-renderer';

import DataThemeIcon from '../DataThemeIcon';

describe('DataThemeIcon', () => {
  test('renders with only a theme prop', () => {
    const tree = renderer.create(
      <DataThemeIcon theme="atmosphere" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with only a theme prop alias', () => {
    const tree = renderer.create(
      <DataThemeIcon theme="biogeo" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with custom size', () => {
    const tree = renderer.create(
      <DataThemeIcon theme="ecohydrology" size={4} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders in avatar mode', () => {
    const tree = renderer.create(
      <DataThemeIcon theme="landuse" avatar />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with a custom className', () => {
    const tree = renderer.create(
      <DataThemeIcon theme="organisms" className="foo" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
