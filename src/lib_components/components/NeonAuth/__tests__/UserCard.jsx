import React from 'react';
import renderer from 'react-test-renderer';

import UserCard from '../UserCard';

describe('NeonAuth - UserCard', () => {
  test('Renders without a lastLogin prop', () => {
    const tree = renderer.create(
      <UserCard
        fullName="Guy Incognito"
        email="joeyjojojr@shabadu"
        providers="momar"
        pictureUrl="carhole"
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders with a lastLogin prop', () => {
    const tree = renderer.create(
      <UserCard
        fullName="Slappy White"
        email="separate@knob"
        providers="monks"
        pictureUrl="label/baby/jr"
        lastLogin="2018-05-05T00:00:00Z"
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
