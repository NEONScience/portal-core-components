import React from 'react';
import { render } from '@testing-library/react';

import MockTheme from '../../../../__mocks__/MockTheme';
import DataThemeIcon from '../DataThemeIcon';

describe('DataThemeIcon', () => {
  test('renders with only a theme prop', () => {
    const tree = render(
      <MockTheme>
        <DataThemeIcon theme="atmosphere" />
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('renders with only a theme prop alias', () => {
    const tree = render(
      <MockTheme>
        <DataThemeIcon theme="biogeo" />
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('renders with custom size', () => {
    const tree = render(
      <MockTheme>
        <DataThemeIcon theme="ecohydrology" size={4} />
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('renders in avatar mode', () => {
    const tree = render(
      <MockTheme>
        <DataThemeIcon theme="landuse" avatar />
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('renders with a custom className', () => {
    const tree = render(
      <MockTheme>
        <DataThemeIcon theme="organisms" className="foo" />
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
});
