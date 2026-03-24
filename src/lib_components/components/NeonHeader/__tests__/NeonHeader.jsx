import React, { act } from 'react';
import { render } from '@testing-library/react';

import '../../../../__mocks__/ajax';
import '../../../../__mocks__/NeonContext';
import MockTheme from '../../../../__mocks__/MockTheme';
import NeonContext, { FETCH_STATUS } from '../../NeonContext/NeonContext';

import NeonHeader from '../NeonHeader';

import REMOTE_ASSETS from '../../../remoteAssetsMap/remoteAssetsMap';

jest.mock('../../../remoteAssets/drupal-header.html', () => (
  '<div>MOCK-FALLBACK-DRUPAL-HEADER-HTML</div>'
));
const DRUPAL_HEADER_HTML = REMOTE_ASSETS.DRUPAL_HEADER_HTML.KEY;

const defaultAuth = {
  useCore: false,
  isAuthenticated: false,
  isAuthWorking: false,
  isAuthWsConnected: false,
  userData: null,
};

describe('NeonHeader', () => {
  beforeEach(() => {
    NeonContext.useNeonContextState.mockReset();
  });
  test('renders with no props and inactive NeonContext state', () => {
    NeonContext.useNeonContextState.mockReturnValue([{
      isActive: false,
      fetches: { [DRUPAL_HEADER_HTML]: { status: null } },
      html: { [DRUPAL_HEADER_HTML]: null },
      auth: defaultAuth,
    }]);
    const tree = render(<MockTheme><NeonHeader /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('renders with no props and active/fetching NeonContext state', () => {
    NeonContext.useNeonContextState.mockReturnValue([{
      isActive: true,
      fetches: { [DRUPAL_HEADER_HTML]: { status: FETCH_STATUS.FETCHING } },
      html: { [DRUPAL_HEADER_HTML]: null },
      auth: defaultAuth,
    }]);
    const tree = render(<MockTheme><NeonHeader /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('renders with no props and error NeonContext state', () => {
    NeonContext.useNeonContextState.mockReturnValue([{
      isActive: true,
      fetches: { [DRUPAL_HEADER_HTML]: { status: FETCH_STATUS.ERROR } },
      html: { [DRUPAL_HEADER_HTML]: null },
      auth: defaultAuth,
    }]);
    const tree = render(<MockTheme><NeonHeader /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('renders with no props and success NeonContext state', () => {
    NeonContext.useNeonContextState.mockReturnValue([{
      isActive: true,
      fetches: { [DRUPAL_HEADER_HTML]: { status: FETCH_STATUS.SUCCESS } },
      html: { [DRUPAL_HEADER_HTML]: '<div>test drupal html</div>' },
      auth: defaultAuth,
    }]);
    const tree = render(<MockTheme><NeonHeader /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('renders fallback with drupalCSSLoaded prop and error NeonContext state', () => {
    NeonContext.useNeonContextState.mockReturnValue([{
      isActive: true,
      fetches: { [DRUPAL_HEADER_HTML]: { status: FETCH_STATUS.ERROR } },
      html: { [DRUPAL_HEADER_HTML]: null },
      auth: defaultAuth,
    }]);
    const tree = render(<MockTheme><NeonHeader drupalCssLoaded /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('renders with drupalCssLoaded prop and success NeonContext state', () => {
    NeonContext.useNeonContextState.mockReturnValue([{
      isActive: true,
      fetches: { [DRUPAL_HEADER_HTML]: { status: FETCH_STATUS.SUCCESS } },
      html: { [DRUPAL_HEADER_HTML]: '<div>test drupal html</div>' },
      auth: defaultAuth,
    }]);
    const tree = render(<MockTheme><NeonHeader drupalCssLoaded unstickyDrupalHeader /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('renders with drupalCssLoaded prop, success NeonContext state, and core auth', async () => {
    NeonContext.useNeonContextState.mockReturnValue([{
      isActive: true,
      fetches: { [DRUPAL_HEADER_HTML]: { status: FETCH_STATUS.SUCCESS } },
      html: { [DRUPAL_HEADER_HTML]: '<div>test drupal html</div>' },
      auth: { ...defaultAuth, useCore: true },
    }]);
    let tree;
    await act(async () => {
      tree = render(<MockTheme><NeonHeader drupalCssLoaded /></MockTheme>);
    });
    expect(tree).toMatchSnapshot();
  });
});
