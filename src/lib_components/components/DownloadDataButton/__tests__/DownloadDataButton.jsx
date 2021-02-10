import React from 'react';
import renderer from 'react-test-renderer';
import DownloadDataContext from '../../DownloadDataContext/DownloadDataContext';

import DownloadDataButton from '../DownloadDataButton';

jest.mock('../../DownloadDataContext/DownloadDataContext', () => ({
  ...(jest.requireActual('../../DownloadDataContext/DownloadDataContext').default),
  useDownloadDataState: jest.fn(),
}));

const { useDownloadDataState, DEFAULT_STATE } = DownloadDataContext;

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
