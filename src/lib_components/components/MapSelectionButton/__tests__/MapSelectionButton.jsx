import React from 'react';
import { render } from '@testing-library/react';

import MockTheme from '../../../../__mocks__/MockTheme';
import MapSelectionButton from '../MapSelectionButton';

describe('MapSelectionButton', () => {
  test('Renders correctly with only a selection', () => {
    const tree = render(<MockTheme><MapSelectionButton selection="SITES" /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('Renders correctly with numerical selection limit (1)', () => {
    const tree = render(
      <MockTheme>
        <MapSelectionButton
          selection="STATES"
          selectionLimit={1}
          label="foo"
        />
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('Renders correctly with numerical selection limit (>1)', () => {
    const tree = render(
      <MockTheme>
        <MapSelectionButton
          selection="STATES"
          selectionLimit={4}
          siteMapProps={{
            view: 'table',
          }}
        />
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('Renders correctly with array selection limit (min 1)', () => {
    const tree = render(
      <MockTheme>
        <MapSelectionButton
          selection="SITES"
          selectionLimit={[1, 4]}
          dialogTitle="bar"
        />
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('Renders correctly with array selection limit (min >1)', () => {
    const tree = render(
      <MockTheme>
        <MapSelectionButton
          selection="DOMAINS"
          selectionLimit={[2, 5]}
          icon={false}
        />
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
});
