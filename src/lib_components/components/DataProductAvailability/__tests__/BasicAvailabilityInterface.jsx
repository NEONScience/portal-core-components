import React from 'react';
import renderer from 'react-test-renderer';

import cloneDeep from 'lodash/cloneDeep';

import MockTheme from '../../../../__mocks__/MockTheme';
import '../../../../__mocks__/NeonContext';
import mockReactComponent from '../../../../__mocks__/mockReactComponent';

import DownloadDataContext from '../../DownloadDataContext/DownloadDataContext';
import BasicAvailabilityInterface from '../BasicAvailabilityInterface';

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
    value: ['JERC', 'BONA', 'FLNT'],
    validValues: ['JERC', 'BONA', 'FLNT'],
    isValid: true,
  },
  dateRange: {
    value: ['2020-02', '2020-05'],
    validValues: ['2020-01', '2020-06'],
    isValid: true,
  },
}, mockDispatch]);

const siteCodes = [
  { siteCode: 'JERC', availableMonths: ['2020-01', '2020-02', '2020-04', '2020-05'] },
  { siteCode: 'BONA', availableMonths: ['2020-02', '2020-03', '2020-04', '2020-06'] },
  { siteCode: 'FLNT', availableMonths: ['2020-01', '2020-03', '2020-05', '2020-06'] },
];

describe('DataProductAvailability - BasicAvailabilityInterface', () => {
  test('renders with no props', () => {
    const tree = renderer
      .create(<MockTheme><BasicAvailabilityInterface /></MockTheme>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with siteCodes and view', () => {
    const tree = renderer
      .create(<MockTheme><BasicAvailabilityInterface siteCodes={siteCodes} view="sites" /></MockTheme>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with explicit sort method', () => {
    const tree = renderer
      .create(
        <MockTheme>
          <BasicAvailabilityInterface siteCodes={siteCodes} view="sites" sortMethod="sites" />
        </MockTheme>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with ungrouped view', () => {
    const tree = renderer
      .create(
        <MockTheme>
          <BasicAvailabilityInterface siteCodes={siteCodes} view="ungrouped" />
        </MockTheme>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with selection disabled', () => {
    const tree = renderer
      .create(
        <MockTheme>
          <BasicAvailabilityInterface siteCodes={siteCodes} view="sites" disableSelection />
        </MockTheme>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
