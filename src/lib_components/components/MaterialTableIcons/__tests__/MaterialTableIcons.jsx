import React from 'react';
import renderer from 'react-test-renderer';

import MaterialTableIcons from '../MaterialTableIcons';

describe('MaterialTableIcons', () => {
  Object.keys(MaterialTableIcons).forEach((icon) => {
    test(`renders ${icon} icon correctly`, () => {
      const Icon = MaterialTableIcons[icon];
      const tree = renderer.create(<Icon />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
