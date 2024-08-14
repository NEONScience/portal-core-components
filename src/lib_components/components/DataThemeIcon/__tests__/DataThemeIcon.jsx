import React from 'react';
import renderer from 'react-test-renderer';

import MockTheme from '../../../../__mocks__/MockTheme';
import DataThemeIcon from '../DataThemeIcon';

describe('DataThemeIcon', () => {
  test('renders with only a theme prop', () => {
    const tree = renderer.create(
      <MockTheme>
        <DataThemeIcon theme="atmosphere" />
      </MockTheme>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with only a theme prop alias', () => {
    const tree = renderer.create(
      <MockTheme>
        <DataThemeIcon theme="biogeo" />
      </MockTheme>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with custom size', () => {
    const tree = renderer.create(
      <MockTheme>
        <DataThemeIcon theme="ecohydrology" size={4} />
      </MockTheme>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders in avatar mode', () => {
    const tree = renderer.create(
      <MockTheme>
        <DataThemeIcon theme="landuse" avatar />
      </MockTheme>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with a custom className', () => {
    const tree = renderer.create(
      <MockTheme>
        <DataThemeIcon theme="organisms" className="foo" />
      </MockTheme>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
