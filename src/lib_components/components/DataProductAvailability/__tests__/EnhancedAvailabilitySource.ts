import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { act, renderHook } from '@testing-library/react';
import {
  Observable,
  Subject,
  of,
  throwError,
} from 'rxjs';
import { ajax, AjaxConfig } from 'rxjs/ajax';

import siteMonthSample from '../../../../sampleData/DataProductAvailability/enhanced-availability-site-month.json';
import componentSample from '../../../../sampleData/DataProductAvailability/enhanced-availability-components.json';

import { AsyncStateType } from '../../../types/asyncFlow';
import { AvailabilityDataLevel } from '../EnhancedAvailabilitySchema';
import {
  DEFAULT_FETCH_DATA_LEVEL,
  EnhancedAvailabilitySource,
  EnhancedAvailabilitySourceProps,
  getFetchErrorMessage,
  useEnhancedAvailabilitySource,
} from '../EnhancedAvailabilitySource';

jest.mock('rxjs/ajax', () => ({ ajax: jest.fn() }));

const mockAjax = ajax as unknown as jest.Mock<(request: AjaxConfig) => Observable<unknown>>;

const { MONTHLY, COMPONENT } = AvailabilityDataLevel;
const PRODUCT_CODE = 'DP1.10033.001';
const API_TOKEN_HEADER = 'some-header';
const API_TOKEN = 'mock-api-token';
const NOT_FOUND_ERROR = {
  status: 404,
  response: {
    error: { status: 404, detail: 'No handler found for the requested path' },
    data: null,
  },
};

type ServerDataWindow = Window & { NEON_SERVER_DATA?: Record<string, string> };

// Responses are wrapped as an AjaxResponse, which NeonApi maps to the response body
const respondWith = (response$: Subject<unknown>, body: unknown): void => {
  act(() => {
    response$.next({ response: body });
    response$.complete();
  });
};

const renderSource = (props: EnhancedAvailabilitySourceProps) => renderHook(
  (hookProps: EnhancedAvailabilitySourceProps): EnhancedAvailabilitySource => (
    useEnhancedAvailabilitySource(hookProps)
  ),
  { initialProps: props },
);

describe('DataProductAvailability - EnhancedAvailabilitySource', () => {
  beforeEach(() => {
    mockAjax.mockReset();
    mockAjax.mockReturnValue(of({ response: siteMonthSample }));
    (window as ServerDataWindow).NEON_SERVER_DATA = {
      NeonPublicAPITokenHeader: API_TOKEN_HEADER,
      NeonPublicAPIToken: API_TOKEN,
    };
  });
  afterEach(() => {
    delete (window as ServerDataWindow).NEON_SERVER_DATA;
  });

  describe('getFetchErrorMessage()', () => {
    test('includes the product, release, status, and API error detail when present', () => {
      expect(getFetchErrorMessage(NOT_FOUND_ERROR, PRODUCT_CODE, 'RELEASE-2026')).toBe(
        'Unable to load data availability for DP1.10033.001 (RELEASE-2026) [404]: '
          + 'No handler found for the requested path',
      );
      expect(getFetchErrorMessage({ status: 500 }, PRODUCT_CODE)).toBe(
        'Unable to load data availability for DP1.10033.001 [500]',
      );
      expect(getFetchErrorMessage({ status: 0 }, PRODUCT_CODE, '')).toBe(
        'Unable to load data availability for DP1.10033.001',
      );
      expect(getFetchErrorMessage(new Error('network'), PRODUCT_CODE, null)).toBe(
        'Unable to load data availability for DP1.10033.001',
      );
      expect(getFetchErrorMessage(null, PRODUCT_CODE)).toBe(
        'Unable to load data availability for DP1.10033.001',
      );
    });
  });

  describe('useEnhancedAvailabilitySource()', () => {
    test('is idle without availability or a product', () => {
      const { result } = renderSource({ release: 'RELEASE-2026', dataLevel: COMPONENT });
      expect(result.current).toEqual({
        availability: null,
        dataLevel: COMPONENT,
        error: null,
        status: AsyncStateType.IDLE,
      });
      expect(mockAjax).not.toHaveBeenCalled();
    });
    test('presents provided availability at its detected data level without fetching', () => {
      const { result } = renderSource({
        enhancedAvailability: componentSample.data,
        productCode: PRODUCT_CODE,
      });
      expect(result.current).toEqual({
        availability: componentSample.data,
        dataLevel: COMPONENT,
        error: null,
        status: AsyncStateType.FULLFILLED,
      });
      expect(mockAjax).not.toHaveBeenCalled();
    });
    test('fails provided availability that does not agree with the data level', () => {
      const { result, rerender } = renderSource({
        enhancedAvailability: componentSample.data,
        dataLevel: MONTHLY,
      });
      expect(result.current).toEqual({
        availability: null,
        dataLevel: MONTHLY,
        error: 'Expected MONTHLY level availability data but found COMPONENT level data',
        status: AsyncStateType.FAILED,
      });
      rerender({ enhancedAvailability: componentSample.data, dataLevel: COMPONENT });
      expect(result.current.status).toBe(AsyncStateType.FULLFILLED);
      expect(result.current.dataLevel).toBe(COMPONENT);
    });
    test('keeps validated provided availability while its props are unchanged', () => {
      const { result, rerender } = renderSource({ enhancedAvailability: siteMonthSample.data });
      const { availability } = result.current;
      rerender({ enhancedAvailability: siteMonthSample.data });
      expect(result.current.availability).toBe(availability);
    });
    test('fetches availability for a product at the default data level', () => {
      const response$ = new Subject<unknown>();
      mockAjax.mockReturnValue(response$);
      const { result } = renderSource({ productCode: PRODUCT_CODE });
      expect(result.current).toEqual({
        availability: null,
        dataLevel: DEFAULT_FETCH_DATA_LEVEL,
        error: null,
        status: AsyncStateType.WORKING,
      });
      expect(mockAjax).toHaveBeenCalledTimes(1);
      expect(mockAjax.mock.calls[0][0].url).toMatch(/\/products\/DP1\.10033\.001\?dataLevel=MONTHLY$/);
      respondWith(response$, siteMonthSample);
      expect(result.current).toEqual({
        availability: siteMonthSample.data,
        dataLevel: MONTHLY,
        error: null,
        status: AsyncStateType.FULLFILLED,
      });
    });
    test('fetches again when the product, release, or data level change', () => {
      const { result, rerender } = renderSource({ productCode: PRODUCT_CODE });
      expect(result.current.status).toBe(AsyncStateType.FULLFILLED);
      const fetchedAvailability = result.current.availability;

      // The previously fetched availability is kept while fetching again
      const release$ = new Subject<unknown>();
      mockAjax.mockReturnValue(release$);
      rerender({ productCode: PRODUCT_CODE, release: 'RELEASE-2026' });
      expect(result.current.status).toBe(AsyncStateType.WORKING);
      expect(result.current.availability).toBe(fetchedAvailability);
      expect(mockAjax.mock.calls[1][0].url).toMatch(/\/DP1\.10033\.001\/RELEASE-2026\?dataLevel=MONTHLY$/);
      respondWith(release$, siteMonthSample);
      expect(result.current.status).toBe(AsyncStateType.FULLFILLED);

      const component$ = new Subject<unknown>();
      mockAjax.mockReturnValue(component$);
      rerender({ productCode: PRODUCT_CODE, release: 'RELEASE-2026', dataLevel: COMPONENT });
      expect(result.current.status).toBe(AsyncStateType.WORKING);
      expect(result.current.dataLevel).toBe(COMPONENT);
      expect(mockAjax.mock.calls[2][0].url).toMatch(/\/RELEASE-2026\?dataLevel=COMPONENT$/);
      respondWith(component$, componentSample);
      expect(result.current).toEqual({
        availability: componentSample.data,
        dataLevel: COMPONENT,
        error: null,
        status: AsyncStateType.FULLFILLED,
      });

      const product$ = new Subject<unknown>();
      mockAjax.mockReturnValue(product$);
      rerender({ productCode: 'DP1.10003.001', release: 'RELEASE-2026', dataLevel: COMPONENT });
      expect(result.current.status).toBe(AsyncStateType.WORKING);
      expect(mockAjax).toHaveBeenCalledTimes(4);
    });
    test('does not fetch again when rerendered with the same request', () => {
      const { rerender } = renderSource({ productCode: PRODUCT_CODE, release: '' });
      rerender({ productCode: PRODUCT_CODE, release: null });
      rerender({ productCode: PRODUCT_CODE, dataLevel: MONTHLY });
      expect(mockAjax).toHaveBeenCalledTimes(1);
    });
    test('fails when fetching fails or the fetched availability is not valid', () => {
      mockAjax.mockReturnValue(throwError(() => NOT_FOUND_ERROR));
      const { result, rerender } = renderSource({ productCode: PRODUCT_CODE });
      expect(result.current).toEqual({
        availability: null,
        dataLevel: MONTHLY,
        error: 'Unable to load data availability for DP1.10033.001 [404]: '
          + 'No handler found for the requested path',
        status: AsyncStateType.FAILED,
      });
      mockAjax.mockReturnValue(of({ response: componentSample }));
      rerender({ productCode: PRODUCT_CODE, release: 'RELEASE-2026' });
      expect(result.current).toEqual({
        availability: null,
        dataLevel: MONTHLY,
        error: 'Expected MONTHLY level availability data but found COMPONENT level data',
        status: AsyncStateType.FAILED,
      });
    });
    test('cancels a pending request when the request changes or on unmount', () => {
      const first$ = new Subject<unknown>();
      mockAjax.mockReturnValue(first$);
      const { result, rerender, unmount } = renderSource({ productCode: PRODUCT_CODE });
      expect(first$.observed).toBe(true);
      const second$ = new Subject<unknown>();
      mockAjax.mockReturnValue(second$);
      rerender({ productCode: 'DP1.10003.001' });
      expect(first$.observed).toBe(false);
      expect(second$.observed).toBe(true);
      expect(result.current.status).toBe(AsyncStateType.WORKING);
      unmount();
      expect(second$.observed).toBe(false);
    });
    test('stops fetching once availability is provided', () => {
      const response$ = new Subject<unknown>();
      mockAjax.mockReturnValue(response$);
      const { result, rerender } = renderSource({ productCode: PRODUCT_CODE });
      rerender({ productCode: PRODUCT_CODE, enhancedAvailability: siteMonthSample.data });
      expect(response$.observed).toBe(false);
      expect(result.current.status).toBe(AsyncStateType.FULLFILLED);
      expect(result.current.availability).toEqual(siteMonthSample.data);
    });
  });
});
