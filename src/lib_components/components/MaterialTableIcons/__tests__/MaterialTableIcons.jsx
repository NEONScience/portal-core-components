import React from 'react';
import { render } from '@testing-library/react';

import MockTheme from '../../../../__mocks__/MockTheme';
import MaterialTableIcons from '../MaterialTableIcons';

describe('MaterialTableIcons', () => {
  Object.keys(MaterialTableIcons).forEach((icon) => {
    test(`renders ${icon} icon correctly`, () => {
      const Icon = MaterialTableIcons[icon];
      const tree = render(<MockTheme><Icon /></MockTheme>);
      expect(tree).toMatchSnapshot();
    });
  });
});
