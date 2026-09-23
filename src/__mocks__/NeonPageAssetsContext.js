import NeonPageAssetsContext from '../lib_components/components/NeonContext/NeonPageAssetsContext';

jest.mock('../lib_components/components/NeonContext/NeonPageAssetsContext', () => (
  {
    ...(jest.requireActual('../lib_components/components/NeonContext/NeonPageAssetsContext').default),
    useNeonPageAssetsContextState: jest.fn(),
    FETCH_STATUS: {
      AWAITING_CALL: 'AWAITING_CALL',
      FETCHING: 'FETCHING',
      ERROR: 'ERROR',
      SUCCESS: 'SUCCESS',
    },
  }
));

const mockDispatch = jest.fn();
NeonPageAssetsContext.useNeonPageAssetsContextState.mockReturnValue([
  {
    ...NeonPageAssetsContext.DEFAULT_STATE,
    isFinal: true,
  },
  mockDispatch,
]);
