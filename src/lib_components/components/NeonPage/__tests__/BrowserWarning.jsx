import React from 'react';
import renderer from 'react-test-renderer';

import Cookies from 'universal-cookie'; // eslint-disable-line no-unused-vars

import mockReactComponent from '../../../../__mocks__/mockReactComponent';

jest.mock('@material-ui/core/Snackbar', () => mockReactComponent('@material-ui/core/Snackbar'));

// eslint-disable-next-line import/first
import BrowserWarning from '../BrowserWarning';

let mockCookieGet;
jest.mock('universal-cookie', () => {
  mockCookieGet = jest.fn();
  return jest.fn().mockImplementation(() => ({
    get: mockCookieGet,
    set: jest.fn(),
  }));
});

// Make key attributes of the Navigator object mockable to simulate different IE iterations
['userAgent', 'appVersion'].forEach((attrib) => {
  Object.defineProperty(window.navigator, attrib, ((value) => ({
    get() { return value; },
    set(v) { value = v; }, // eslint-disable-line no-param-reassign
  }))(window.navigator[attrib]));
});

describe('NeonPage - BrowserWarning', () => {
  beforeEach(() => {
    mockCookieGet.mockReset();
    global.navigator.userAgent = 'foo';
    global.navigator.appVersion = 'bar';
  });
  test('renders nothing if browser is not IE', () => {
    const tree = renderer.create(
      <BrowserWarning />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders nothing if browser is found to be IE but ignore cookie is present', () => {
    global.navigator.userAgent = 'foo MSIE qux';
    mockCookieGet.mockReturnValue(true);
    const tree = renderer.create(
      <BrowserWarning />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders warning if browser is found to be IE and ignore cookie is not set', () => {
    global.navigator.appVersion = 'bar Trident/qux';
    mockCookieGet.mockReturnValue(false);
    const tree = renderer.create(
      <BrowserWarning />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
