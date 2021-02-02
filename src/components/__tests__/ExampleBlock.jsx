import React from 'react';
import renderer from 'react-test-renderer';

import ExampleBlock from '../ExampleBlock';

describe('ExampleBlock', () => {
  test('renders with a single child', () => {
    const tree = renderer
      .create(
        <ExampleBlock>
          <div>1</div>
        </ExampleBlock>
      ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with many children (row)', () => {
    const tree = renderer
      .create(
        <ExampleBlock>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </ExampleBlock>
      ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with many children (column)', () => {
    const tree = renderer
      .create(
        <ExampleBlock column>
          <div>4</div>
          <div>5</div>
          <div>6</div>
        </ExampleBlock>
      ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
