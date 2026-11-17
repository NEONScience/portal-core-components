import { describe, expect, test } from '@jest/globals';

import {
  addMonths,
  buildPeriodDataSets,
  getAvailablePeriodMonths,
  getMonthCacheKey,
  getMonthKey,
  getMonthsBetween,
  getPeriodLabel,
  getPeriodMonths,
  getPeriodRange,
  getPeriodRangeLabel,
  getPeriodStartMonth,
  mergeAggregates,
  mergeTimeSeries,
  stepPeriod,
  WindRosePeriodType,
} from '../windRosePeriodUtil';
import {
  buildWindRoseData,
  DIRECTION_BINS,
  VELOCITY_BINS,
  WindRoseAggregate,
  WindRoseData,
  WindRoseQualityFilter,
} from '../windRoseUtil';
import { TIME_SERIES_BASE_INTERVAL_MS } from '../windRoseTimeSeriesUtil';

const { SEASON, YEAR } = WindRosePeriodType;

const HOUR_MS = 60 * 60 * 1000;

// A wind rose of observations from the north at the slowest speed and from the east at the fastest
const buildAggregate = (north: number, east: number, calm: number): WindRoseAggregate => {
  const bins = DIRECTION_BINS.map((angle: string) => {
    const counts = VELOCITY_BINS.map(() => 0);
    if (angle === '0') {
      counts[0] = north;
    }
    if (angle === '90') {
      counts[VELOCITY_BINS.length - 1] = east;
    }
    return { angle, counts, total: counts.reduce((sum, count) => sum + count, 0) };
  });
  const samples = north + east + calm;
  return {
    bins,
    samples,
    calm,
    meanSpeed: (samples > 0) ? (((north * 0.1) + (east * 10)) / samples) : null,
  };
};

// Wind rose data of one observation each day of a month, the first of which fails a quality flag
const buildMonthData = (month: string, days: number, speed: number): WindRoseData => (
  buildWindRoseData(
    [{
      data: Array.from({ length: days }, (value: unknown, index: number) => ({
        startDateTime: `${month}-${`${index + 1}`.padStart(2, '0')}T12:00:00Z`,
        windDirMean: '270',
        windSpeedMean: `${speed}`,
        windSpeedMinimum: `${speed / 2}`,
        windSpeedMaximum: `${speed * 2}`,
        windSpeedFinalQF: (index === 0) ? '1' : '0',
        windDirFinalQF: '0',
      })),
    }],
    {
      dataFileUrls: [],
      dataFileMatcher: { tmi: '002', fileName: '2min' },
      variablesFileUrl: null,
      positions: [{ horizontal: '000', vertical: '010' }],
      positionOptions: [],
    },
  )
);

describe('WindRoseViewer - windRosePeriodUtil', () => {
  test('addMonths and getMonthsBetween count across years', () => {
    expect(addMonths('2026-11', 3)).toBe('2027-02');
    expect(addMonths('2026-01', -1)).toBe('2025-12');
    expect(getMonthsBetween('2025-12', '2026-02')).toBe(2);
    expect(getMonthsBetween('2026-06', '2025-06')).toBe(-12);
  });

  test('getMonthKey gets the UTC month of a time', () => {
    expect(getMonthKey(Date.UTC(2026, 11, 31, 23, 59))).toBe('2026-12');
  });

  describe('seasons', () => {
    test('are meteorological seasons, with winter spanning December to February', () => {
      expect(getPeriodMonths(SEASON, '2026-01')).toEqual(['2025-12', '2026-01', '2026-02']);
      expect(getPeriodMonths(SEASON, '2025-12')).toEqual(['2025-12', '2026-01', '2026-02']);
      expect(getPeriodMonths(SEASON, '2026-03')).toEqual(['2026-03', '2026-04', '2026-05']);
      expect(getPeriodMonths(SEASON, '2026-07')).toEqual(['2026-06', '2026-07', '2026-08']);
      expect(getPeriodMonths(SEASON, '2026-11')).toEqual(['2026-09', '2026-10', '2026-11']);
    });
    test('are named by their year, or years for winter', () => {
      expect(getPeriodLabel(SEASON, '2026-04')).toBe('Spring 2026');
      expect(getPeriodLabel(SEASON, '2026-08')).toBe('Summer 2026');
      expect(getPeriodLabel(SEASON, '2026-09')).toBe('Fall 2026');
      expect(getPeriodLabel(SEASON, '2026-02')).toBe('Winter 2025-26');
      expect(getPeriodLabel(SEASON, '1999-12')).toBe('Winter 1999-00');
    });
    test('describe their months', () => {
      expect(getPeriodRangeLabel(SEASON, '2026-07')).toBe('June to August 2026');
      expect(getPeriodRangeLabel(SEASON, '2026-01')).toBe('December 2025 to February 2026');
    });
    test('span their months in UTC', () => {
      expect(getPeriodRange(SEASON, '2026-01')).toEqual([
        Date.UTC(2025, 11, 1),
        Date.UTC(2026, 2, 1),
      ]);
    });
  });

  describe('years', () => {
    test('are calendar years', () => {
      expect(getPeriodStartMonth(YEAR, '2026-07')).toBe('2026-01');
      expect(getPeriodMonths(YEAR, '2026-07')).toHaveLength(12);
      expect(getPeriodMonths(YEAR, '2026-07')[11]).toBe('2026-12');
      expect(getPeriodLabel(YEAR, '2026-07')).toBe('2026');
      expect(getPeriodRangeLabel(YEAR, '2026-07')).toBe('January to December 2026');
      expect(getPeriodRange(YEAR, '2026-07')).toEqual([
        Date.UTC(2026, 0, 1),
        Date.UTC(2027, 0, 1),
      ]);
    });
  });

  test('getAvailablePeriodMonths gets the months of the period with data', () => {
    expect(getAvailablePeriodMonths(SEASON, '2026-07', ['2026-05', '2026-08', '2026-06']))
      .toEqual(['2026-06', '2026-08']);
  });

  describe('stepPeriod', () => {
    const available = ['2024-06', '2025-01', '2025-02', '2025-07', '2026-06', '2026-07'];
    test('keeps to the same month of the adjacent period', () => {
      expect(stepPeriod(YEAR, '2026-07', available, -1)).toBe('2025-07');
      expect(stepPeriod(SEASON, '2025-02', available, -1)).toBe('2024-06');
    });
    test('falls back to the closest month of the period with data', () => {
      expect(stepPeriod(YEAR, '2025-07', available, 1)).toBe('2026-07');
      expect(stepPeriod(YEAR, '2026-06', available, -1)).toBe('2025-07');
      expect(stepPeriod(YEAR, '2024-06', available, 1)).toBe('2025-07');
      // Winter 2024-25 has January and February
      expect(stepPeriod(SEASON, '2024-06', available, 1)).toBe('2025-01');
    });
    test('skips periods without data', () => {
      expect(stepPeriod(SEASON, '2025-07', available, 1)).toBe('2026-07');
      expect(stepPeriod(YEAR, '2023-03', ['2023-03', '2026-04'], 1)).toBe('2026-04');
      expect(stepPeriod(YEAR, '2026-04', ['2023-03', '2026-04'], -1)).toBe('2023-03');
    });
    test('stops at either end of the data', () => {
      expect(stepPeriod(YEAR, '2024-06', available, -1)).toBeNull();
      expect(stepPeriod(SEASON, '2026-07', available, 1)).toBeNull();
      expect(stepPeriod(YEAR, '2026-07', [], 1)).toBeNull();
    });
  });

  describe('mergeAggregates', () => {
    test('adds the observations of each period together', () => {
      const merged = mergeAggregates([buildAggregate(4, 1, 5), buildAggregate(2, 3, 0)]);
      expect(merged).not.toBeNull();
      const { bins, samples, calm, meanSpeed } = merged as WindRoseAggregate;
      expect(samples).toBe(15);
      expect(calm).toBe(5);
      expect(bins[0].counts[0]).toBe(6);
      expect(bins[DIRECTION_BINS.indexOf('90')].total).toBe(4);
      // Weighted by the observations of each period, including calm observations
      expect(meanSpeed).toBeCloseTo(((6 * 0.1) + (4 * 10)) / 15);
    });
    test('returns null without periods', () => {
      expect(mergeAggregates([])).toBeNull();
    });
  });

  test('mergeTimeSeries combines time series in the longest interval', () => {
    const merged = mergeTimeSeries([
      {
        interval: HOUR_MS,
        points: [{
          time: Date.UTC(2026, 6, 1),
          samples: 1,
          mean: 2,
          min: 1,
          max: 3,
        }],
      },
      {
        interval: TIME_SERIES_BASE_INTERVAL_MS,
        points: [0, 1].map((index: number) => ({
          time: Date.UTC(2026, 5, 30) + (index * TIME_SERIES_BASE_INTERVAL_MS),
          samples: 1,
          mean: 4 + index,
          min: 1,
          max: 9,
        })),
      },
    ]);
    expect(merged.interval).toBe(HOUR_MS);
    expect(merged.points.map((point) => point.time)).toEqual([
      Date.UTC(2026, 5, 30),
      Date.UTC(2026, 6, 1),
    ]);
    expect(merged.points[0].mean).toBe(4.5);
    expect(mergeTimeSeries([]).points).toEqual([]);
  });

  describe('buildPeriodDataSets', () => {
    const monthData = {
      '2026-06': buildMonthData('2026-06', 30, 2),
      '2026-08': buildMonthData('2026-08', 31, 4),
      // Outside of the period
      '2026-09': buildMonthData('2026-09', 30, 8),
    };
    const dataSets = buildPeriodDataSets(monthData, getPeriodMonths(SEASON, '2026-07'));

    test('builds the wind rose of the months of the period fetched', () => {
      const all = dataSets[WindRoseQualityFilter.ALL];
      expect(all.months).toEqual(['2026-06', '2026-08']);
      expect(Object.keys(all.monthly)).toEqual(['2026-06', '2026-08']);
      expect(all.aggregate?.samples).toBe(61);
      expect(all.aggregate?.meanSpeed).toBeCloseTo(((30 * 2) + (31 * 4)) / 61);
      expect(all.timeSeries.points).toHaveLength(61);
      expect(all.timeSeries.points[0].time).toBe(Date.UTC(2026, 5, 1, 12));
    });

    test('builds the wind rose of the Quality Flag validated observations', () => {
      const validated = dataSets[WindRoseQualityFilter.VALIDATED];
      expect(validated.aggregate?.samples).toBe(59);
      expect(validated.timeSeries.points).toHaveLength(59);
    });

    test('builds no wind rose without months', () => {
      const empty = buildPeriodDataSets(monthData, getPeriodMonths(YEAR, '2025-01'));
      expect(empty[WindRoseQualityFilter.ALL]).toEqual({
        aggregate: null,
        monthly: {},
        months: [],
        timeSeries: { interval: TIME_SERIES_BASE_INTERVAL_MS, points: [] },
      });
    });
  });

  test('getMonthCacheKey identifies the site and positions regardless of their order', () => {
    const positions = [
      { horizontal: '000', vertical: '020' },
      { horizontal: '000', vertical: '010' },
    ];
    expect(getMonthCacheKey('CPER', positions)).toBe('CPER|000.010|000.020');
    expect(getMonthCacheKey('CPER', [...positions].reverse()))
      .toBe(getMonthCacheKey('CPER', positions));
    expect(getMonthCacheKey('CPER', [])).toBe('CPER');
  });
});
