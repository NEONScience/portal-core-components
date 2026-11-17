import { describe, expect, test } from '@jest/globals';

import {
  accumulateWindSpeed,
  aggregateTimeSeries,
  buildTimeSeriesGrid,
  createTimeSeriesAccumulator,
  DAY_MS,
  finalizeTimeSeries,
  formatIntervalLength,
  getDayRange,
  getDisplayInterval,
  getEmptyTimeSeries,
  getIntervalStart,
  getMonthRange,
  getPeakPoint,
  getSpeedAxisMax,
  getTimeSeriesInterval,
  TIME_SERIES_BASE_INTERVAL_MS,
  WindSpeedTimeSeries,
  WindSpeedTimeSeriesPoint,
} from '../windRoseTimeSeriesUtil';

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const JUNE_1 = Date.UTC(2026, 5, 1);

const point = (
  minutes: number,
  mean: number,
  min: WindSpeedTimeSeriesPoint['min'] = null,
  max: WindSpeedTimeSeriesPoint['max'] = null,
  samples = 1,
): WindSpeedTimeSeriesPoint => ({
  time: JUNE_1 + (minutes * MINUTE_MS),
  samples,
  mean,
  min,
  max,
});

describe('WindRoseViewer - windRoseTimeSeriesUtil', () => {
  describe('getTimeSeriesInterval', () => {
    test('aggregates to 10 minutes, or the averaging period of the observations when longer', () => {
      expect(getTimeSeriesInterval(1)).toBe(TIME_SERIES_BASE_INTERVAL_MS);
      expect(getTimeSeriesInterval(2)).toBe(TIME_SERIES_BASE_INTERVAL_MS);
      expect(getTimeSeriesInterval(30)).toBe(30 * MINUTE_MS);
      expect(getTimeSeriesInterval(Number.NaN)).toBe(TIME_SERIES_BASE_INTERVAL_MS);
    });
  });

  test('getIntervalStart aligns intervals to the hour in UTC', () => {
    expect(getIntervalStart(JUNE_1 + (17 * MINUTE_MS), 10 * MINUTE_MS))
      .toBe(JUNE_1 + (10 * MINUTE_MS));
    expect(getIntervalStart(JUNE_1 + (59 * MINUTE_MS), HOUR_MS)).toBe(JUNE_1);
  });

  describe('accumulateWindSpeed', () => {
    test('averages the observations of each interval with the lowest minimum and highest maximum', () => {
      const accumulator = createTimeSeriesAccumulator(10 * MINUTE_MS);
      // Out of order, as observations from several data files are interleaved
      accumulateWindSpeed(accumulator, {
        time: JUNE_1 + (12 * MINUTE_MS), speed: 5, minimum: 2, maximum: 9,
      });
      accumulateWindSpeed(accumulator, {
        time: JUNE_1, speed: 1, minimum: 0.5, maximum: 3,
      });
      accumulateWindSpeed(accumulator, {
        time: JUNE_1 + (2 * MINUTE_MS), speed: 2, minimum: 0.2, maximum: Number.NaN,
      });
      accumulateWindSpeed(accumulator, {
        time: JUNE_1 + (4 * MINUTE_MS), speed: 3, minimum: Number.NaN, maximum: 4.5,
      });
      expect(finalizeTimeSeries(accumulator)).toEqual({
        interval: 10 * MINUTE_MS,
        points: [point(0, 2, 0.2, 4.5, 3), point(10, 5, 2, 9)],
      });
    });

    test('leaves the minimum and maximum out when no observation reports them', () => {
      const accumulator = createTimeSeriesAccumulator(10 * MINUTE_MS);
      accumulateWindSpeed(accumulator, {
        time: JUNE_1, speed: 1, minimum: Number.NaN, maximum: Number.NaN,
      });
      expect(finalizeTimeSeries(accumulator).points).toEqual([point(0, 1)]);
    });
  });

  describe('aggregateTimeSeries', () => {
    const timeSeries: WindSpeedTimeSeries = {
      interval: 10 * MINUTE_MS,
      points: [
        point(0, 1, 0.5, 3, 5),
        point(10, 4, 1, 8, 1),
        point(50, 2, null, null, 2),
        point(60, 6, 3, 12, 4),
      ],
    };

    test('weights the mean of each interval by its number of observations', () => {
      const hourly = aggregateTimeSeries(timeSeries, HOUR_MS);
      expect(hourly.interval).toBe(HOUR_MS);
      expect(hourly.points).toHaveLength(2);
      const [first, second] = hourly.points;
      expect(first.samples).toBe(8);
      expect(first.mean).toBeCloseTo(((1 * 5) + (4 * 1) + (2 * 2)) / 8);
      expect(first.min).toBe(0.5);
      expect(first.max).toBe(8);
      expect(second).toEqual(point(60, 6, 3, 12, 4));
    });

    test('returns time series that are already as coarse', () => {
      expect(aggregateTimeSeries(timeSeries, 10 * MINUTE_MS)).toBe(timeSeries);
    });
  });

  describe('buildTimeSeriesGrid', () => {
    test('lays out the intervals between two times, with null where there are none', () => {
      const grid = buildTimeSeriesGrid(
        { interval: HOUR_MS, points: [point(0, 1), point(180, 3)] },
        JUNE_1,
        JUNE_1 + (5 * HOUR_MS),
      );
      expect(grid.start).toBe(JUNE_1);
      expect(grid.interval).toBe(HOUR_MS);
      expect(grid.points.map((gridPoint) => (gridPoint ? gridPoint.mean : null)))
        .toEqual([1, null, null, 3, null]);
    });

    test('leaves out intervals outside of the grid', () => {
      const grid = buildTimeSeriesGrid(
        { interval: HOUR_MS, points: [point(-60, 1), point(60, 2), point(300, 3)] },
        JUNE_1,
        JUNE_1 + (2 * HOUR_MS),
      );
      expect(grid.points).toEqual([null, point(60, 2)]);
    });

    test('lays out no intervals for an empty range', () => {
      expect(buildTimeSeriesGrid(getEmptyTimeSeries(), JUNE_1, JUNE_1).points).toEqual([]);
    });
  });

  test('getMonthRange gets the UTC start and end of a month', () => {
    expect(getMonthRange('2026-06')).toEqual([JUNE_1, Date.UTC(2026, 6, 1)]);
    expect(getMonthRange('2026-12')).toEqual([Date.UTC(2026, 11, 1), Date.UTC(2027, 0, 1)]);
  });

  test('getDayRange gets the UTC start and end of a day', () => {
    expect(getDayRange('2026-06-30')).toEqual([Date.UTC(2026, 5, 30), Date.UTC(2026, 6, 1)]);
  });

  describe('getDisplayInterval', () => {
    const month = 30 * DAY_MS;
    test('shows the time series as finely as it fits', () => {
      expect(getDisplayInterval(10 * MINUTE_MS, DAY_MS, 1000)).toBe(10 * MINUTE_MS);
      expect(getDisplayInterval(10 * MINUTE_MS, month, 1000)).toBe(HOUR_MS);
      expect(getDisplayInterval(10 * MINUTE_MS, month, 600)).toBe(2 * HOUR_MS);
      expect(getDisplayInterval(10 * MINUTE_MS, month, 300)).toBe(3 * HOUR_MS);
    });
    test('keeps intervals a multiple of the time series interval', () => {
      expect(getDisplayInterval(30 * MINUTE_MS, DAY_MS, 1000)).toBe(30 * MINUTE_MS);
      expect(getDisplayInterval(30 * MINUTE_MS, month, 1000)).toBe(HOUR_MS);
    });
    test('falls back to the coarsest interval', () => {
      expect(getDisplayInterval(10 * MINUTE_MS, month, 1)).toBe(DAY_MS);
    });
  });

  test('formatIntervalLength describes intervals', () => {
    expect(formatIntervalLength(10 * MINUTE_MS)).toBe('10-minute');
    expect(formatIntervalLength(HOUR_MS)).toBe('Hourly');
    expect(formatIntervalLength(3 * HOUR_MS)).toBe('3-hour');
    expect(formatIntervalLength(DAY_MS)).toBe('Daily');
  });

  describe('getSpeedAxisMax', () => {
    const points = [point(0, 2.1, 0.4, 7.3), null, point(20, 4.4, 1.2, 11.8)];
    test('leaves a little room above the highest value of the statistics shown', () => {
      expect(getSpeedAxisMax(points, ['max', 'mean', 'min'])).toBeCloseTo(12.98);
      expect(getSpeedAxisMax(points, ['mean', 'min'])).toBeCloseTo(4.84);
    });
    test('does not scale calm or missing observations to a tiny axis', () => {
      expect(getSpeedAxisMax([point(0, 0, 0, 0.1)], ['max', 'mean'])).toBe(0.5);
      expect(getSpeedAxisMax([], ['mean'])).toBe(0.5);
    });
  });

  test('getPeakPoint gets the earliest point with the highest value of a statistic', () => {
    const points = [point(0, 2, 1, 5), null, point(20, 4, 1, 9), point(30, 4, 0.5, 9)];
    expect(getPeakPoint(points, 'max')).toBe(points[2]);
    expect(getPeakPoint(points, 'mean')).toBe(points[2]);
    expect(getPeakPoint([point(0, 1)], 'max')).toBeNull();
    expect(getPeakPoint([], 'mean')).toBeNull();
  });
});
