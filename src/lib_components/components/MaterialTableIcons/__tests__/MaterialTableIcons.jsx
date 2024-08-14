import React from 'react';
import renderer from 'react-test-renderer';

import MockTheme from '../../../../__mocks__/MockTheme';
import MaterialTableIcons from '../MaterialTableIcons';

describe('MaterialTableIcons', () => {
  Object.keys(MaterialTableIcons).forEach((icon) => {
    test(`renders ${icon} icon correctly`, () => {
      const Icon = MaterialTableIcons[icon];
      const tree = renderer.create(<MockTheme><Icon /></MockTheme>).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
