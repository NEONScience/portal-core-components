import React from 'react';
import renderer from 'react-test-renderer';

import cloneDeep from 'lodash/cloneDeep';

import MockTheme from '../../../../__mocks__/MockTheme';
import '../../../../__mocks__/NeonContext';
import mockReactComponent from '../../../../__mocks__/mockReactComponent';

import DownloadDataContext from '../../DownloadDataContext/DownloadDataContext';
import EnhancedAvailabilityInterface from '../EnhancedAvailabilityInterface';

jest.mock('@mui/material/Select', () => mockReactComponent('@mui/material/Select'));

// Mock the DownloadDataContext state
jest.mock('../../DownloadDataContext/DownloadDataContext', () => ({
  ...(jest.requireActual('../../DownloadDataContext/DownloadDataContext').default),
  useDownloadDataState: jest.fn(),
}));

const { DEFAULT_STATE, useDownloadDataState } = DownloadDataContext;

const mockDispatch = jest.fn();
useDownloadDataState.mockReturnValue([{
  ...cloneDeep(DEFAULT_STATE),
  requiredSteps: [
    { key: 'sitesAndDateRange', isComplete: true },
    { key: 'summary', isComplete: null },
  ],
  sites: {
    value: ['JERC', 'BONA'],
    validValues: ['JERC', 'BONA'],
    isValid: true,
  },
  dateRange: {
    value: ['2020-02', '2020-05'],
    validValues: ['2020-01', '2020-06'],
    isValid: true,
  },
}, mockDispatch]);

const siteCodes = [
  {
    siteCode: 'JERC',
    tables: [
      {
        name: 't1',
        description: 't1_desc',
        waitInteval: '0',
        months: {
          '2020-01': 'expected',
          '2020-02': 'available',
          '2020-03': 'not available',
          '2020-04': 'available',
          '2020-05': 'delayed',
          '2020-06': 'available',
        },
      },
      {
        name: 't2',
        description: 't2_desc',
        waitInteval: '0',
        months: {
          '2020-01': 'available',
          '2020-02': 'expected',
          '2020-03': 'available',
          '2020-04': 'not available',
          '2020-05': 'available',
          '2020-06': 'delayed',
        },
      },
    ],
  },
  {
    siteCode: 'BONA',
    tables: [
      {
        name: 't1',
        description: 't1_desc',
        waitInteval: '0',
        months: {
          '2020-01': 'available',
          '2020-02': 'expected',
          '2020-03': 'available',
          '2020-04': 'not available',
          '2020-05': 'available',
          '2020-06': 'delayed',
        },
      },
      {
        name: 't2',
        description: 't2_desc',
        waitInteval: '0',
        months: {
          '2020-01': 'expected',
          '2020-02': 'available',
          '2020-03': 'not available',
          '2020-04': 'available',
          '2020-05': 'delayed',
          '2020-06': 'available',
        },
      },
    ],
  },
];

describe('DataProductAvailability - EnhancedAvailabilityInterface', () => {
  test('renders with no props', () => {
    const tree = renderer
      .create(<MockTheme><EnhancedAvailabilityInterface /></MockTheme>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with siteCodes and view', () => {
    const tree = renderer
      .create(
        <MockTheme>
          <EnhancedAvailabilityInterface siteCodes={siteCodes} view="sites" />
        </MockTheme>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with explicit sort method', () => {
    const tree = renderer
      .create(
        <MockTheme>
          <EnhancedAvailabilityInterface siteCodes={siteCodes} view="sites" sortMethod="sites" />
        </MockTheme>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with ungrouped view', () => {
    const tree = renderer
      .create(
        <MockTheme>
          <EnhancedAvailabilityInterface siteCodes={siteCodes} view="ungrouped" />
        </MockTheme>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with selection disabled', () => {
    const tree = renderer
      .create(
        <MockTheme>
          <EnhancedAvailabilityInterface siteCodes={siteCodes} view="sites" disableSelection />
        </MockTheme>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
