/* eslint react/no-unescaped-entities: 0 */
import React from 'react';
import renderer from 'react-test-renderer';

import mockReactComponent from '../../__mocks__/mockReactComponent';

import CodeBlock from '../CodeBlock';

jest.mock('react-highlight.js', () => mockReactComponent('react-highlight.js'));

describe('CodeBlock', () => {
  test('renders with a string', () => {
    const tree = renderer
      .create(
        <CodeBlock>
          var code = 'block';
        </CodeBlock>,
      ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with a string and a specified language', () => {
    const tree = renderer
      .create(
        <CodeBlock language="php">
          $code = "block";
        </CodeBlock>,
      ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
