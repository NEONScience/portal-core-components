import React from 'react';
import renderer from 'react-test-renderer';

import MapSelectionButton from '../MapSelectionButton';

describe('MapSelectionButton', () => {
  test('Renders correctly with only a selection', () => {
    const tree = renderer
      .create(<MapSelectionButton selection="SITES" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders correctly with numerical selection limit (1)', () => {
    const tree = renderer
      .create((
        <MapSelectionButton
          selection="STATES"
          selectionLimit={1}
          label="foo"
        />
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders correctly with numerical selection limit (>1)', () => {
    const tree = renderer
      .create((
        <MapSelectionButton
          selection="STATES"
          selectionLimit={4}
          siteMapProps={{
            view: 'table',
          }}
        />
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders correctly with array selection limit (min 1)', () => {
    const tree = renderer
      .create((
        <MapSelectionButton
          selection="SITES"
          selectionLimit={[1, 4]}
          dialogTitle="bar"
        />
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders correctly with array selection limit (min >1)', () => {
    const tree = renderer
      .create((
        <MapSelectionButton
          selection="DOMAINS"
          selectionLimit={[2, 5]}
          icon={false}
        />
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
