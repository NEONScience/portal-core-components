import React from 'react';
import { render } from '@testing-library/react';

import MockTheme from '../../../../__mocks__/MockTheme';
import '../../../../__mocks__/NeonContext';
import mockReactComponent from '../../../../__mocks__/mockReactComponent';

import AvailabilityContext from '../AvailabilityContext';
import EnhancedAvailabilityInterface from '../EnhancedAvailabilityInterface';
import { NEON_GREEN_PALETTE } from '../AvailabilitySvgComponents';
import { AVAILABILITY_COLOR_SCHEMES } from '../AvailabilityUtils';
import { COLORS } from '../../Theme/Theme';

jest.mock('@mui/material/Select', () => mockReactComponent('@mui/material/Select'));
jest.mock('@mui/material/MenuItem', () => mockReactComponent('@mui/material/MenuItem'));

const siteMonthAvailability = {
  productCode: 'DP1.00000.001',
  siteCodes: [
    {
      siteCode: 'JERC',
      availableReleases: [
        {
          release: 'PROVISIONAL',
          months: [
            { month: '2020-01', available: false, status: 'Expected' },
            { month: '2020-02', available: true, status: null },
            { month: '2020-03', available: false, status: 'Partial' },
          ],
        },
        {
          release: 'RELEASE-2026',
          months: [
            { month: '2019-12', available: true, status: null },
          ],
        },
      ],
    },
    {
      siteCode: 'BONA',
      availableReleases: [
        {
          release: 'PROVISIONAL',
          months: [
            { month: '2020-01', available: false, status: 'Not Collected' },
            { month: '2020-02', available: false, status: 'Potential' },
          ],
        },
      ],
    },
  ],
};

const componentAvailability = {
  productCode: 'DP1.00000.002',
  siteCodes: [
    {
      siteCode: 'JERC',
      availableReleases: [
        {
          release: 'PROVISIONAL',
          months: [
            {
              month: '2020-03',
              available: false,
              status: null,
              packages: [
                {
                  packageType: 'basic',
                  components: [
                    { name: 't1', type: 'tablename', status: 'Partial' },
                    { name: 't2', type: 'tablename', status: 'Not Collected' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const renderWithAvailability = (enhancedAvailability) => render(
  <MockTheme>
    <AvailabilityContext.Provider enhancedAvailability={enhancedAvailability}>
      <EnhancedAvailabilityInterface />
    </AvailabilityContext.Provider>
  </MockTheme>,
);

describe('DataProductAvailability - EnhancedAvailabilityInterface', () => {
  test('renders with no props', () => {
    const tree = render(<MockTheme><EnhancedAvailabilityInterface /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('renders site breakouts only with site-month availability', () => {
    const tree = renderWithAvailability(siteMonthAvailability);
    expect(tree.getByText('sites')).toBeTruthy();
    expect(tree.queryByText('packages')).toBeNull();
    expect(tree.queryByText('tables')).toBeNull();
    expect(tree).toMatchSnapshot();
  });
  test('renders package and table breakouts with component level availability', () => {
    const tree = renderWithAvailability(componentAvailability);
    expect(tree.getByText('sites')).toBeTruthy();
    expect(tree.getByText('packages')).toBeTruthy();
    expect(tree.getByText('tables')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });
  test('renders patterns and key in the given color scheme', () => {
    const { container } = render(
      <MockTheme>
        <AvailabilityContext.Provider enhancedAvailability={siteMonthAvailability}>
          <EnhancedAvailabilityInterface colorScheme={AVAILABILITY_COLOR_SCHEMES.NEON_GREEN} />
        </AvailabilityContext.Provider>
      </MockTheme>,
    );
    expect(container.querySelector('#neonGreenMixedSomeAvailabilityPattern')).not.toBeNull();
    expect(container.querySelector('#mixedSomeAvailabilityPattern')).toBeNull();
    const keyFills = Array.from(container.querySelectorAll('rect'))
      .map((rect) => rect.getAttribute('fill'));
    expect(keyFills).toEqual(expect.arrayContaining([
      NEON_GREEN_PALETTE.AVAILABLE,
      NEON_GREEN_PALETTE.EXPECTED,
      NEON_GREEN_PALETTE.PARTIAL,
      NEON_GREEN_PALETTE.POTENTIAL,
      NEON_GREEN_PALETTE.NOT_COLLECTED,
      NEON_GREEN_PALETTE.NOT_PLANNED,
    ]));
    expect(keyFills).not.toContain(COLORS.NEON_BLUE[700]);
    expect(keyFills).not.toContain(COLORS.GOLD[400]);
  });
});
