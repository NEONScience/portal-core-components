import React from 'react';
import renderer from 'react-test-renderer';

import MockTheme from '../../__mocks__/MockTheme';
import PropsTable from '../PropsTable';

describe('PropsTable', () => {
  test('renders a minimal single row', () => {
    const props = [
      {
        name: 'foo',
        type: 'string',
      },
    ];
    const tree = renderer.create(<MockTheme><PropsTable props={props} /></MockTheme>).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders a multiple rows with optional strings', () => {
    const props = [
      {
        name: 'foo',
        type: 'string',
        default: 'abc',
      },
      {
        name: 'bar',
        type: 'string',
        description: 'lorem ipsum',
        examples: '"abc", "def"',
        required: true,
      },
    ];
    const tree = renderer.create(<MockTheme><PropsTable props={props} /></MockTheme>).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders a multiple rows with optional nodes', () => {
    const props = [
      {
        name: 'foo',
        type: 'string',
        examples: <div>example node</div>,
      },
      {
        name: 'bar',
        type: <div>type node</div>,
        description: <div>description node</div>,
      },
    ];
    const tree = renderer.create(<MockTheme><PropsTable props={props} /></MockTheme>).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders at full height', () => {
    const props = [
      {
        name: 'foo',
        type: 'string',
        description: 'lorem ipsum',
        examples: '"abc", "def"',
        required: true,
      },
      {
        name: 'bar',
        type: <div>type node</div>,
        description: <div>description node</div>,
      },
    ];
    const tree = renderer.create(<MockTheme><PropsTable props={props} fullHeight /></MockTheme>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
