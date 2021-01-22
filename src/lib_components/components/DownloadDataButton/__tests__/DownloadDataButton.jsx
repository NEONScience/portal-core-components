import React from 'react';
import renderer from 'react-test-renderer';

jest.mock('../../DownloadDataContext/DownloadDataContext', () => ({
  ...(jest.requireActual('../../DownloadDataContext/DownloadDataContext').default),
  useDownloadDataState: jest.fn(),
}));
import { useDownloadDataState, DEFAULT_STATE } from '../../DownloadDataContext/DownloadDataContext';

import DownloadDataButton from '../DownloadDataButton';

describe('DownloadDataButton', () => {
  beforeEach(() => {
    useDownloadDataState.mockReset();
    useDownloadDataState.mockReturnValue([{
      ...DEFAULT_STATE,
    }]);
  });
  test('Renders correctly with only a label', () => {
    const tree = renderer
      .create(<DownloadDataButton label="foo" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Preserves MUI button props', () => {
    const tree = renderer
      .create((
        <DownloadDataButton
          label="foo"
          size="large"
          color="primary"
          variant="outlined"
          data-selenium="download"
        />
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders with the dialog open from context state', () => {
    useDownloadDataState.mockReset();
    useDownloadDataState.mockReturnValue([{
      ...DEFAULT_STATE,
      dialogOpen: true,
    }]);
    const tree = renderer
      .create(<DownloadDataButton label="foo" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Automatically includes data-gtm props from product in context state', () => {
    useDownloadDataState.mockReset();
    useDownloadDataState.mockReturnValue([{
      ...DEFAULT_STATE,
      productData: {
        productCode: 'DPX.XXXXX.XXX',
      },
    }]);
    const tree = renderer
      .create(<DownloadDataButton label="foo" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
