import React from 'react';
import renderer from 'react-test-renderer';

import cloneDeep from 'lodash/cloneDeep';

import DownloadDataContext from '../../DownloadDataContext/DownloadDataContext';
import DownloadStepForm from '../DownloadStepForm';

// Mock the DownloadDataContext state
jest.mock('../../DownloadDataContext/DownloadDataContext', () => ({
  ...(jest.requireActual('../../DownloadDataContext/DownloadDataContext').default),
  useDownloadDataState: jest.fn(),
}));

const {
  DEFAULT_STATE,
  ALL_STEPS,
  useDownloadDataState,
} = DownloadDataContext;

const mockDispatch = jest.fn();
useDownloadDataState.mockReturnValue([{
  ...cloneDeep(DEFAULT_STATE),
}, mockDispatch]);

// console.log('RUN', ALL_STEPS, DEFAULT_STATE, useDownloadDataState);

describe('DownloadStepForm', () => {
  Object.keys(ALL_STEPS)
    .forEach((stepKey) => {
      test(`Step ${stepKey} renders correctly`, () => {
        const tree = renderer
          .create(<DownloadStepForm stepKey={stepKey} />)
          .toJSON();
        expect(tree).toMatchSnapshot();
      });
    });
});
