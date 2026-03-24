import React from 'react';
import { render } from '@testing-library/react';
import DownloadDataContext from '../../DownloadDataContext/DownloadDataContext';

import MockTheme from '../../../../__mocks__/MockTheme';
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
    const tree = render(<MockTheme><DownloadDataButton label="foo" /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('Preserves MUI button props', () => {
    const tree = render(
      <MockTheme>
        <DownloadDataButton
          label="foo"
          size="large"
          color="primary"
          variant="outlined"
          data-selenium="download"
        />
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('Renders with the dialog open from context state', () => {
    useDownloadDataState.mockReset();
    useDownloadDataState.mockReturnValue([{
      ...DEFAULT_STATE,
      dialogOpen: true,
    }]);
    const tree = render(<MockTheme><DownloadDataButton label="foo" /></MockTheme>);
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
    const tree = render(<MockTheme><DownloadDataButton label="foo" /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
});
