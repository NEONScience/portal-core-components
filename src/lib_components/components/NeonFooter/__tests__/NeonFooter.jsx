import React from 'react';
import renderer from 'react-test-renderer';

import '../../../../__mocks__/NeonContext';
import NeonContext, { FETCH_STATUS } from '../../NeonContext/NeonContext';

import NeonFooter from '../NeonFooter';

import REMOTE_ASSETS from '../../../remoteAssetsMap/remoteAssetsMap';

jest.mock('../../../remoteAssets/drupal-footer.html', () => (
  '<div>MOCK-FALLBACK-DRUPAL-FOOTER-HTML</div>'
));
const DRUPAL_FOOTER_HTML = REMOTE_ASSETS.DRUPAL_FOOTER_HTML.KEY;

describe('NeonFooter', () => {
  beforeEach(() => {
    NeonContext.useNeonContextState.mockReset();
  });
  test('renders with no props and inactive NeonContext state', () => {
    NeonContext.useNeonContextState.mockReturnValue([{
      isActive: false,
      fetches: { [DRUPAL_FOOTER_HTML]: { status: null } },
      html: { [DRUPAL_FOOTER_HTML]: null },
    }]);
    const tree = renderer
      .create(<NeonFooter />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with no props and active/fetching NeonContext state', () => {
    NeonContext.useNeonContextState.mockReturnValue([{
      isActive: true,
      fetches: { [DRUPAL_FOOTER_HTML]: { status: FETCH_STATUS.FETCHING } },
      html: { [DRUPAL_FOOTER_HTML]: null },
    }]);
    const tree = renderer
      .create(<NeonFooter />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with no props and error NeonContext state', () => {
    NeonContext.useNeonContextState.mockReturnValue([{
      isActive: true,
      fetches: { [DRUPAL_FOOTER_HTML]: { status: FETCH_STATUS.ERROR } },
      html: { [DRUPAL_FOOTER_HTML]: null },
    }]);
    const tree = renderer
      .create(<NeonFooter />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with no props and success NeonContext state', () => {
    NeonContext.useNeonContextState.mockReturnValue([{
      isActive: true,
      fetches: { [DRUPAL_FOOTER_HTML]: { status: FETCH_STATUS.SUCCESS } },
      html: { [DRUPAL_FOOTER_HTML]: '<div>test drupal html</div>' },
    }]);
    const tree = renderer
      .create(<NeonFooter />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders fallback with drupalCSSLoaded prop and error NeonContext state', () => {
    NeonContext.useNeonContextState.mockReturnValue([{
      isActive: true,
      fetches: { [DRUPAL_FOOTER_HTML]: { status: FETCH_STATUS.ERROR } },
      html: { [DRUPAL_FOOTER_HTML]: null },
    }]);
    const tree = renderer
      .create(<NeonFooter drupalCssLoaded />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with drupalCssLoaded prop and success NeonContext state', () => {
    NeonContext.useNeonContextState.mockReturnValue([{
      isActive: true,
      fetches: { [DRUPAL_FOOTER_HTML]: { status: FETCH_STATUS.SUCCESS } },
      html: { [DRUPAL_FOOTER_HTML]: '<div>test drupal html</div>' },
    }]);
    const tree = renderer
      .create(<NeonFooter drupalCssLoaded />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
