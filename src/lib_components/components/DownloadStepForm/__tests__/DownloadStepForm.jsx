import React from 'react';
import renderer from 'react-test-renderer';

import cloneDeep from 'lodash/cloneDeep';

import mockReactComponent from '../../../../__mocks__/mockReactComponent';

import DownloadDataContext from '../../DownloadDataContext/DownloadDataContext';
import DownloadStepForm from '../DownloadStepForm';

jest.mock('material-table', () => mockReactComponent('material-table'));

// Mock the DownloadDataContext state
jest.mock('../../DownloadDataContext/DownloadDataContext', () => ({
  ...(jest.requireActual('../../DownloadDataContext/DownloadDataContext').default),
  useDownloadDataState: jest.fn(),
}));

// Force moment into a fixed point in time
jest.mock('moment', () => () => jest.requireActual('moment')('2020-01-01T00:00:00.000Z'));

const {
  DEFAULT_STATE,
  ALL_STEPS,
  useDownloadDataState,
} = DownloadDataContext;

const mockDispatch = jest.fn();
useDownloadDataState.mockReturnValue([{
  ...cloneDeep(DEFAULT_STATE),
  requiredSteps: [
    { key: 'sitesAndDateRange', isComplete: true },
    { key: 'documentation', isComplete: true },
    { key: 'packageType', isComplete: true },
    { key: 's3Files', isComplete: true },
    { key: 'policies', isComplete: false },
    { key: 'summary', isComplete: null },
  ],
  sites: {
    value: ['JERC', 'BONA', 'FLNT'],
    validValues: ['JERC', 'BONA', 'FLNT'],
    isValid: true,
  },
  dateRange: {
    value: ['2018-04', '2019-07'],
    isValid: true,
    validValues: ['2018-01', '2019-12'],
  },
  s3Files: {
    ...cloneDeep(DEFAULT_STATE.s3Files),
    value: ['f1', 'f2', 'f3'],
    validValues: [
      { url: 'f1', tableData: 'f1' },
      { url: 'f2', tableData: 'f2' },
      { url: 'f3', tableData: 'f3' },
    ],
    isValid: true,
    totalSize: 12345,
  },
  packageType: {
    value: 'expanded',
    validValues: ['basic', 'expanded'],
    isValid: true,
  },
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
