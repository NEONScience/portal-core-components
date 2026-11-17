import React from 'react';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { act, render, screen } from '@testing-library/react';
import {
  Observable,
  Subject,
  of,
  throwError,
} from 'rxjs';
import { ajax, AjaxConfig } from 'rxjs/ajax';

import MockTheme from '../../../../__mocks__/MockTheme';
import '../../../../__mocks__/NeonContext';
import mockReactComponent from '../../../../__mocks__/mockReactComponent';

import siteMonthSample from '../../../../sampleData/DataProductAvailability/enhanced-availability-site-month.json';
import componentSample from '../../../../sampleData/DataProductAvailability/enhanced-availability-components.json';

import EnhancedAvailabilityContainer, {
  EnhancedAvailabilityContainerProps,
} from '../EnhancedAvailabilityContainer';
import AvailabilityContext from '../AvailabilityContext';
import { AvailabilityDataLevel } from '../EnhancedAvailabilitySchema';
import { AvailabilityInheritanceMode } from '../EnhancedAvailabilityInheritance';

jest.mock('rxjs/ajax', () => ({ ajax: jest.fn() }));
jest.mock('@mui/material/Select', () => mockReactComponent('@mui/material/Select'));
jest.mock('@mui/material/MenuItem', () => mockReactComponent('@mui/material/MenuItem'));

const mockAjax = ajax as unknown as jest.Mock<(request: AjaxConfig) => Observable<unknown>>;

const { MONTHLY, COMPONENT } = AvailabilityDataLevel;
const PRODUCT_CODE = 'DP1.10033.001';
const LOADING_TEXT = 'Loading Data Availability...';

const renderContainer = (props: EnhancedAvailabilityContainerProps) => render(
  <MockTheme>
    <EnhancedAvailabilityContainer {...props} />
  </MockTheme>,
);

const rerenderContainer = (
  rerender: (ui: React.ReactNode) => void,
  props: EnhancedAvailabilityContainerProps,
): void => {
  rerender(
    <MockTheme>
      <EnhancedAvailabilityContainer {...props} />
    </MockTheme>,
  );
};

// Responses are wrapped as an AjaxResponse, which NeonApi maps to the response body
const respondWith = (response$: Subject<unknown>, body: unknown): void => {
  act(() => {
    response$.next({ response: body });
    response$.complete();
  });
};

describe('DataProductAvailability - EnhancedAvailabilityContainer', () => {
  beforeEach(() => {
    mockAjax.mockReset();
    mockAjax.mockReturnValue(of({ response: siteMonthSample }));
  });
  afterEach(() => {
    sessionStorage.clear();
  });

  test('presents provided availability with the breakouts of its data level', () => {
    renderContainer({ enhancedAvailability: componentSample.data });
    expect(screen.getByText('sites')).toBeTruthy();
    expect(screen.getByText('packages')).toBeTruthy();
    expect(screen.getByText('tables')).toBeTruthy();
    expect(screen.queryByText(LOADING_TEXT)).toBeNull();
    expect(mockAjax).not.toHaveBeenCalled();
  });

  test('applies the inheritance mode to the presented availability', () => {
    const providerSpy = jest.spyOn(AvailabilityContext, 'Provider');
    renderContainer({
      enhancedAvailability: componentSample.data,
      inheritanceMode: AvailabilityInheritanceMode.NONE,
    });
    expect(providerSpy.mock.lastCall?.[0]).toMatchObject({
      enhancedAvailability: componentSample.data,
      inheritanceMode: AvailabilityInheritanceMode.NONE,
    });
    expect(screen.getByText('tables')).toBeTruthy();
    providerSpy.mockRestore();
  });

  test('presents an error for provided availability that does not agree with the data level', () => {
    const { container } = renderContainer({
      enhancedAvailability: componentSample.data,
      dataLevel: MONTHLY,
    });
    expect(screen.getByText(
      'Expected MONTHLY level availability data but found COMPONENT level data',
    )).toBeTruthy();
    expect(container.querySelector('[data-selenium="data-product-availability.error"]'))
      .not.toBeNull();
    expect(screen.queryByText('sites')).toBeNull();
  });

  test('fetches availability for a product, keeping it presented while fetching again', () => {
    const monthly$ = new Subject<unknown>();
    mockAjax.mockReturnValue(monthly$);
    const { container, rerender } = renderContainer({
      productCode: PRODUCT_CODE,
      rowLabelWidth: 100,
    });
    expect(screen.getByText(LOADING_TEXT)).toBeTruthy();
    expect(screen.queryByText('sites')).toBeNull();

    respondWith(monthly$, siteMonthSample);
    expect(screen.queryByText(LOADING_TEXT)).toBeNull();
    expect(screen.getByText('sites')).toBeTruthy();
    expect(screen.queryByText('packages')).toBeNull();
    expect(screen.queryByRole('progressbar')).toBeNull();
    expect(container.querySelector('svg[id^="dpa-"]')).not.toBeNull();

    const component$ = new Subject<unknown>();
    mockAjax.mockReturnValue(component$);
    rerenderContainer(rerender, {
      productCode: PRODUCT_CODE,
      dataLevel: COMPONENT,
      rowLabelWidth: 100,
    });
    expect(screen.getByRole('progressbar', { name: 'Loading data availability' })).toBeTruthy();
    expect(screen.getByText('sites')).toBeTruthy();
    expect(screen.queryByText(LOADING_TEXT)).toBeNull();

    respondWith(component$, componentSample);
    expect(screen.queryByRole('progressbar')).toBeNull();
    expect(screen.getByText('packages')).toBeTruthy();
    expect(screen.getByText('tables')).toBeTruthy();
  });

  test('presents an error when fetching availability fails', () => {
    mockAjax.mockReturnValue(throwError(() => ({
      status: 400,
      response: { error: { status: 400, detail: 'Product code not found' }, data: null },
    })));
    renderContainer({ productCode: 'DP1.99999.001', release: 'RELEASE-2026' });
    expect(screen.getByText(
      'Unable to load data availability for DP1.99999.001 (RELEASE-2026) [400]: '
        + 'Product code not found',
    )).toBeTruthy();
    expect(screen.getByText('Data Product Availability')).toBeTruthy();
    expect(screen.queryByText('sites')).toBeNull();
  });
});
