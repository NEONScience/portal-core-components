import React from 'react';
import { render } from '@testing-library/react';

import MockTheme from '../../../../__mocks__/MockTheme';
import UserCard from '../UserCard';

describe('NeonAuth - UserCard', () => {
  test('Renders without a lastLogin prop', () => {
    const tree = render(
      <MockTheme>
        <UserCard
          fullName="Guy Incognito"
          email="joeyjojojr@shabadu"
          providers="momar"
          pictureUrl="carhole"
        />
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('Renders with a lastLogin prop', () => {
    const tree = render(
      <MockTheme>
        <UserCard
          fullName="Slappy White"
          email="separate@knob"
          providers="monks"
          pictureUrl="label/baby/jr"
          lastLogin="2018-05-05T00:00:00Z"
        />
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
});
