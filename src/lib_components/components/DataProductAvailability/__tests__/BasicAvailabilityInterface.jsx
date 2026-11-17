import React from 'react';
import { render } from '@testing-library/react';

import cloneDeep from 'lodash/cloneDeep';

import MockTheme from '../../../../__mocks__/MockTheme';
import '../../../../__mocks__/NeonContext';
import mockReactComponent from '../../../../__mocks__/mockReactComponent';

import DownloadDataContext from '../../DownloadDataContext/DownloadDataContext';
import BasicAvailabilityInterface from '../BasicAvailabilityInterface';
import { NEON_GREEN_PALETTE } from '../AvailabilitySvgComponents';
import { AVAILABILITY_COLOR_SCHEMES } from '../AvailabilityUtils';
import { COLORS } from '../../Theme/Theme';

jest.mock('@mui/material/Select', () => mockReactComponent('@mui/material/Select'));
jest.mock('@mui/material/MenuItem', () => mockReactComponent('@mui/material/MenuItem'));

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
    const tree = render(<MockTheme><BasicAvailabilityInterface /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('renders with siteCodes and view', () => {
    const tree = render(<MockTheme><BasicAvailabilityInterface siteCodes={siteCodes} view="sites" /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('renders with explicit sort method', () => {
    const tree = render(
      <MockTheme>
        <BasicAvailabilityInterface siteCodes={siteCodes} view="sites" sortMethod="sites" />
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('renders with ungrouped view', () => {
    const tree = render(
      <MockTheme>
        <BasicAvailabilityInterface siteCodes={siteCodes} view="ungrouped" />
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('renders with selection disabled', () => {
    const tree = render(
      <MockTheme>
        <BasicAvailabilityInterface siteCodes={siteCodes} view="sites" disableSelection />
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('renders patterns and key in the given color scheme', () => {
    const { container } = render(
      <MockTheme>
        <BasicAvailabilityInterface
          siteCodes={siteCodes}
          view="sites"
          delineateRelease
          colorScheme={AVAILABILITY_COLOR_SCHEMES.NEON_GREEN}
        />
      </MockTheme>
    );
    expect(container.querySelector('#neonGreenMixedAvailableProvisionalPattern')).not.toBeNull();
    expect(container.querySelector('#mixedAvailableProvisionalPattern')).toBeNull();
    const keyFills = Array.from(container.querySelectorAll('rect'))
      .map((rect) => rect.getAttribute('fill'));
    expect(keyFills).toEqual(expect.arrayContaining([
      NEON_GREEN_PALETTE.AVAILABLE,
      NEON_GREEN_PALETTE.PROVISIONAL_BACKGROUND,
      'url(#neonGreenMixedAvailableProvisionalPattern)',
    ]));
    expect(keyFills).not.toContain(COLORS.NEON_BLUE[700]);
  });
});
