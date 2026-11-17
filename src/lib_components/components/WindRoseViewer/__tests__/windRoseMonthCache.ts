import { describe, expect, test } from '@jest/globals';

import {
  cacheMonth,
  estimateWindRoseDataSize,
  evictMonths,
  getCachedBytes,
  getEmptyMonthCache,
  markMonthFailed,
  MAX_CACHED_BYTES,
  touchMonths,
  WindRoseMonthCache,
} from '../windRoseMonthCache';
import { buildWindRoseData, WindRoseData } from '../windRoseUtil';

// Wind rose data of a month with an observation each day
const buildMonthData = (month: string, days: number): WindRoseData => buildWindRoseData(
  [{
    data: Array.from({ length: days }, (value: unknown, index: number) => ({
      startDateTime: `${month}-${`${index + 1}`.padStart(2, '0')}T12:00:00Z`,
      windDirMean: '90',
      windSpeedMean: '2',
      windSpeedMinimum: '1',
      windSpeedMaximum: '3',
      windSpeedFinalQF: '0',
      windDirFinalQF: '0',
    })),
  }],
  {
    dataFileUrls: [],
    dataFileMatcher: { tmi: '002', fileName: '2min' },
    variablesFileUrl: null,
    positions: [],
    positionOptions: [],
  },
);

const DATA = buildMonthData('2026-06', 10);
const MONTH_BYTES = estimateWindRoseDataSize(DATA);

const getMonths = (cache: WindRoseMonthCache): string[] => Object.keys(cache.months).sort();

// Caches each month in turn with no months in use
const cacheMonths = (cache: WindRoseMonthCache, months: string[]): WindRoseMonthCache => (
  months.reduce((current: WindRoseMonthCache, month: string) => (
    cacheMonth(current, 'CPER', month, DATA, [])
  ), cache)
);

describe('WindRoseViewer - windRoseMonthCache', () => {
  test('estimates the memory taken by the data of a month', () => {
    // A wind rose and time series point a day, and a wind rose of the month, for each filter
    expect(MONTH_BYTES).toBe(2 * ((10 * 100) + (11 * 2048)));
    expect(estimateWindRoseDataSize(buildMonthData('2026-06', 0))).toBe(0);
  });

  test('starts empty with the most memory allowed', () => {
    expect(getEmptyMonthCache()).toEqual({
      key: null,
      months: {},
      sizes: {},
      lastUsed: {},
      uses: 0,
      failed: [],
      maxBytes: MAX_CACHED_BYTES,
    });
  });

  test('caches months for one site and positions at a time', () => {
    const cache = cacheMonths(getEmptyMonthCache(), ['2026-06', '2026-07']);
    expect(cache.key).toBe('CPER');
    expect(getMonths(cache)).toEqual(['2026-06', '2026-07']);
    expect(getCachedBytes(cache)).toBe(MONTH_BYTES * 2);
    const otherSite = cacheMonth(cache, 'ONAQ', '2026-07', DATA, []);
    expect(otherSite.key).toBe('ONAQ');
    expect(getMonths(otherSite)).toEqual(['2026-07']);
    expect(otherSite.maxBytes).toBe(MAX_CACHED_BYTES);
  });

  test('evicts the least recently used months when over the most memory allowed', () => {
    const cache = cacheMonths(
      getEmptyMonthCache(MONTH_BYTES * 3),
      ['2026-01', '2026-02', '2026-03'],
    );
    // Using January leaves February the least recently used
    const used = touchMonths(cache, ['2026-01']);
    expect(getMonths(cacheMonth(used, 'CPER', '2026-04', DATA, [])))
      .toEqual(['2026-01', '2026-03', '2026-04']);
  });

  test('never evicts the months in use', () => {
    // Room for one month
    const cache: WindRoseMonthCache = {
      ...cacheMonths(getEmptyMonthCache(), ['2026-01', '2026-02']),
      maxBytes: MONTH_BYTES,
    };
    expect(getMonths(cacheMonth(cache, 'CPER', '2026-03', DATA, ['2026-01', '2026-03'])))
      .toEqual(['2026-01', '2026-03']);
    // Even when the months in use take more than the most memory allowed
    expect(getMonths(evictMonths(cache, ['2026-01', '2026-02'])))
      .toEqual(['2026-01', '2026-02']);
    expect(getMonths(evictMonths(cache, ['2026-02']))).toEqual(['2026-02']);
  });

  test('marks months used without changing the months cached', () => {
    const cache = cacheMonths(getEmptyMonthCache(), ['2026-01', '2026-02']);
    const used = touchMonths(cache, ['2026-01', '2026-05']);
    expect(used.months).toBe(cache.months);
    expect(used.lastUsed['2026-01']).toBeGreaterThan(used.lastUsed['2026-02']);
    expect(used.lastUsed['2026-05']).toBeUndefined();
    // Months not cached are not used
    expect(touchMonths(cache, ['2026-05'])).toBe(cache);
    expect(evictMonths(cache, [])).toBe(cache);
  });

  test('notes months that could not be fetched until they are', () => {
    const cache = cacheMonths(getEmptyMonthCache(), ['2026-01']);
    const failed = markMonthFailed(cache, 'CPER', '2026-02');
    expect(failed.failed).toEqual(['2026-02']);
    expect(markMonthFailed(failed, 'CPER', '2026-02')).toBe(failed);
    // Failures of another site or positions are ignored
    expect(markMonthFailed(cache, 'ONAQ', '2026-02')).toBe(cache);
    expect(cacheMonth(failed, 'CPER', '2026-02', DATA, []).failed).toEqual([]);
  });
});
