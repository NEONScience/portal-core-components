import React from 'react';

import { describe, expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react';

import mockReactComponent from '../../../../__mocks__/mockReactComponent';

import DataProductAvailability from '../DataProductAvailability';
import { AvailabilityDataLevel } from '../EnhancedAvailabilitySchema';
import { AvailabilityInheritanceMode } from '../EnhancedAvailabilityInheritance';

jest.mock('../../NeonContext/NeonContext', () => ({
  __esModule: true,
  default: { getWrappedComponent: (Component: unknown) => Component },
}));
jest.mock('../BasicAvailabilityInterface', () => (
  mockReactComponent('BasicAvailabilityInterface')
));
jest.mock('../EnhancedAvailabilityContainer', () => (
  mockReactComponent('EnhancedAvailabilityContainer')
));

const siteCodes = [{ siteCode: 'ABBY', availableMonths: ['2020-01', '2020-02'] }];
const enhancedAvailability = { productCode: 'DP1.00000.001', siteCodes: [] };

const getRendered = (container: HTMLElement, path: string): Element | null => (
  container.querySelector(`[data-component-path="${path}"]`)
);

const getPropNames = (element: Element | null): string[] => (element
  ? element.getAttributeNames().filter((name: string) => name.startsWith('data-prop-')).sort()
  : []
);

describe('DataProductAvailability', () => {
  test('presents basic availability with the same props as before enhanced fetching', () => {
    const { container } = render(<DataProductAvailability siteCodes={siteCodes} view="sites" />);
    const basic = getRendered(container, 'BasicAvailabilityInterface');
    expect(getRendered(container, 'EnhancedAvailabilityContainer')).toBeNull();
    expect(getPropNames(basic)).toEqual([
      'data-prop-availabilitystatustype',
      'data-prop-colorscheme',
      'data-prop-dataproducts',
      'data-prop-delineaterelease',
      'data-prop-disableselection',
      'data-prop-sitecodes',
      'data-prop-sortdirection',
      'data-prop-sortmethod',
      'data-prop-view',
    ]);
    expect(basic?.getAttribute('data-prop-sitecodes')).toBe(JSON.stringify(siteCodes));
    expect(basic?.getAttribute('data-prop-view')).toBe('sites');
    expect(basic?.getAttribute('data-prop-colorscheme')).toBe('neonBlue');
  });

  test('presents basic availability without a product code to fetch for', () => {
    const { container, rerender } = render(
      <DataProductAvailability
        siteCodes={siteCodes}
        release="RELEASE-2026"
        dataLevel={AvailabilityDataLevel.COMPONENT}
      />,
    );
    expect(getRendered(container, 'BasicAvailabilityInterface')).not.toBeNull();
    expect(getRendered(container, 'EnhancedAvailabilityContainer')).toBeNull();
    rerender(<DataProductAvailability siteCodes={siteCodes} productCode="" />);
    expect(getRendered(container, 'BasicAvailabilityInterface')).not.toBeNull();
    expect(getRendered(container, 'EnhancedAvailabilityContainer')).toBeNull();
  });

  test('presents provided enhanced availability', () => {
    const { container } = render(
      <DataProductAvailability
        enhancedAvailability={enhancedAvailability}
        dataLevel={AvailabilityDataLevel.MONTHLY}
        siteCodes={siteCodes}
        rowLabelWidth={100}
        inheritanceMode={AvailabilityInheritanceMode.NONE}
      />,
    );
    const enhanced = getRendered(container, 'EnhancedAvailabilityContainer');
    expect(getRendered(container, 'BasicAvailabilityInterface')).toBeNull();
    expect(enhanced?.getAttribute('data-prop-enhancedavailability'))
      .toBe(JSON.stringify(enhancedAvailability));
    expect(enhanced?.getAttribute('data-prop-datalevel')).toBe('MONTHLY');
    expect(enhanced?.getAttribute('data-prop-rowlabelwidth')).toBe('100');
    expect(enhanced?.getAttribute('data-prop-inheritancemode')).toBe('NONE');
    expect(enhanced?.hasAttribute('data-prop-sitecodes')).toBe(false);
  });

  test('presents enhanced availability fetched for a product code', () => {
    const { container } = render(
      <DataProductAvailability
        productCode="DP1.10033.001"
        release="RELEASE-2026"
        dataLevel={AvailabilityDataLevel.COMPONENT}
      />,
    );
    const enhanced = getRendered(container, 'EnhancedAvailabilityContainer');
    expect(getRendered(container, 'BasicAvailabilityInterface')).toBeNull();
    expect(enhanced?.getAttribute('data-prop-productcode')).toBe('DP1.10033.001');
    expect(enhanced?.getAttribute('data-prop-release')).toBe('RELEASE-2026');
    expect(enhanced?.getAttribute('data-prop-datalevel')).toBe('COMPONENT');
    expect(enhanced?.getAttribute('data-prop-enhancedavailability')).toBe('null');
    expect(enhanced?.getAttribute('data-prop-inheritancemode')).toBe('TECHNICAL_AVAILABILITY');
  });
});
