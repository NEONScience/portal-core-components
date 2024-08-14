import React from 'react';
import renderer from 'react-test-renderer';

import MockTheme from '../../../../__mocks__/MockTheme';
import MapSelectionButton from '../MapSelectionButton';

describe('MapSelectionButton', () => {
  test('Renders correctly with only a selection', () => {
    const tree = renderer
      .create(<MockTheme><MapSelectionButton selection="SITES" /></MockTheme>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders correctly with numerical selection limit (1)', () => {
    const tree = renderer
      .create(
        <MockTheme>
          <MapSelectionButton
            selection="STATES"
            selectionLimit={1}
            label="foo"
          />
        </MockTheme>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders correctly with numerical selection limit (>1)', () => {
    const tree = renderer
      .create(
        <MockTheme>
          <MapSelectionButton
            selection="STATES"
            selectionLimit={4}
            siteMapProps={{
              view: 'table',
            }}
          />
        </MockTheme>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders correctly with array selection limit (min 1)', () => {
    const tree = renderer
      .create(
        <MockTheme>
          <MapSelectionButton
            selection="SITES"
            selectionLimit={[1, 4]}
            dialogTitle="bar"
          />
        </MockTheme>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders correctly with array selection limit (min >1)', () => {
    const tree = renderer
      .create(
        <MockTheme>
          <MapSelectionButton
            selection="DOMAINS"
            selectionLimit={[2, 5]}
            icon={false}
          />
        </MockTheme>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
