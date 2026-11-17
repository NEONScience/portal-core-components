import { Nullable } from '../../types/core';

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;

/**
 * Finest interval (ms) the wind speed time series is aggregated to: the averaging period
 * mean wind speeds are conventionally reported over (WMO)
 */
export const TIME_SERIES_BASE_INTERVAL_MS = 10 * MINUTE_MS;

// Coarser intervals (ms) a time series can be shown in, so that intervals are not drawn too narrow
const DISPLAY_INTERVALS: readonly number[] = [
  30 * MINUTE_MS,
  HOUR_MS,
  2 * HOUR_MS,
  3 * HOUR_MS,
  6 * HOUR_MS,
  12 * HOUR_MS,
  DAY_MS,
];

// Narrowest an interval is drawn (px)
const MIN_INTERVAL_WIDTH = 1.25;

// Room above the highest wind speed on the wind speed axis, as a share of it
const SPEED_AXIS_HEADROOM = 0.1;

// Lowest top of the wind speed axis (m/s), the fastest calm wind, so calm periods are drawn calm
const MIN_SPEED_AXIS_MAX = 0.5;

/**
 * Approximate number of ticks on the wind speed axis
 */
export const SPEED_TICK_COUNT = 3;

/**
 * Wind speed statistics of the time series, ordered from the top of the chart down
 */
export const WIND_SPEED_STATISTICS = ['max', 'mean', 'min'] as const;

export type WindSpeedStatistic = typeof WIND_SPEED_STATISTICS[number];

export const WIND_SPEED_STATISTIC_LABELS: Record<WindSpeedStatistic, string> = {
  max: 'Maximum',
  mean: 'Mean',
  min: 'Minimum',
};

/**
 * Wind speed of a single observation (averaging period) in a data file
 */
export interface WindSpeedObservation {
  // Start of the averaging period (ms since the epoch)
  time: number;
  // Mean wind speed (m/s) over the averaging period
  speed: number;
  // Lowest and highest wind speeds (m/s) measured during the averaging period, NaN if not reported
  minimum: number;
  maximum: number;
}

/**
 * Wind speed statistics of the observations in an interval of a time series
 */
export interface WindSpeedTimeSeriesPoint {
  // Start of the interval (ms since the epoch)
  time: number;
  // Number of observations in the interval
  samples: number;
  // Mean wind speed (m/s) of the observations in the interval
  mean: number;
  // Lowest wind speed (m/s) measured during the interval, null if no observation reports one
  min: Nullable<number>;
  // Highest wind speed (m/s) measured during the interval, null if no observation reports one
  max: Nullable<number>;
}

/**
 * Wind speed time series of the observations in a month
 */
export interface WindSpeedTimeSeries {
  // Length of each interval (ms)
  interval: number;
  // Intervals with observations, sorted ascending
  points: WindSpeedTimeSeriesPoint[];
}

/**
 * Intervals of a time series laid out on a regular grid, so gaps in the observations are kept
 */
export interface WindSpeedTimeSeriesGrid {
  // Start of the first interval (ms since the epoch)
  start: number;
  // Length of each interval (ms)
  interval: number;
  // One entry per interval, null where there are no observations
  points: Nullable<WindSpeedTimeSeriesPoint>[];
}

interface IntervalAccumulator {
  samples: number;
  speedSum: number;
  // Lowest and highest reported wind speeds, infinite until one is reported
  min: number;
  max: number;
}

export interface WindSpeedTimeSeriesAccumulator {
  interval: number;
  // Accumulated observations keyed by the start of their interval
  intervals: Map<number, IntervalAccumulator>;
}

export const getEmptyTimeSeries = (
  interval: number = TIME_SERIES_BASE_INTERVAL_MS,
): WindSpeedTimeSeries => ({ interval, points: [] });

/**
 * Gets the start of the interval containing a time. Intervals are aligned to the epoch, so
 * intervals that divide a day start on the hour in UTC.
 */
export const getIntervalStart = (time: number, interval: number): number => (
  Math.floor(time / interval) * interval
);

/**
 * Gets the interval (ms) to aggregate observations to: the base interval, or the averaging period
 * of the observations when longer
 * @param averagingPeriod Averaging period of the observations in minutes, e.g. 2 or 30
 */
export const getTimeSeriesInterval = (averagingPeriod: number): number => {
  const averagingPeriodMs = averagingPeriod * MINUTE_MS;
  return (Number.isFinite(averagingPeriodMs) && (averagingPeriodMs > TIME_SERIES_BASE_INTERVAL_MS))
    ? averagingPeriodMs
    : TIME_SERIES_BASE_INTERVAL_MS;
};

export const createTimeSeriesAccumulator = (interval: number): WindSpeedTimeSeriesAccumulator => ({
  interval,
  intervals: new Map(),
});

const addToInterval = (
  accumulator: WindSpeedTimeSeriesAccumulator,
  time: number,
  samples: number,
  speedSum: number,
  min: number,
  max: number,
): void => {
  const start = getIntervalStart(time, accumulator.interval);
  let interval = accumulator.intervals.get(start);
  if (!interval) {
    interval = {
      samples: 0,
      speedSum: 0,
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY,
    };
    accumulator.intervals.set(start, interval);
  }
  interval.samples += samples;
  interval.speedSum += speedSum;
  // Comparisons with NaN are false, so an unreported value never replaces a reported one
  if (min < interval.min) {
    interval.min = min;
  }
  if (max > interval.max) {
    interval.max = max;
  }
};

export const accumulateWindSpeed = (
  accumulator: WindSpeedTimeSeriesAccumulator,
  observation: WindSpeedObservation,
): void => {
  addToInterval(
    accumulator,
    observation.time,
    1,
    observation.speed,
    observation.minimum,
    observation.maximum,
  );
};

export const finalizeTimeSeries = (
  accumulator: WindSpeedTimeSeriesAccumulator,
): WindSpeedTimeSeries => ({
  interval: accumulator.interval,
  points: Array.from(accumulator.intervals.entries())
    .sort(([a], [b]) => a - b)
    .map(([time, interval]): WindSpeedTimeSeriesPoint => ({
      time,
      samples: interval.samples,
      mean: interval.speedSum / interval.samples,
      min: Number.isFinite(interval.min) ? interval.min : null,
      max: Number.isFinite(interval.max) ? interval.max : null,
    })),
});

/**
 * Aggregates a time series to longer intervals, weighting the mean of each interval by its
 * number of observations
 * @param timeSeries The time series to aggregate
 * @param interval Length of the longer intervals (ms), a multiple of the time series interval
 */
export const aggregateTimeSeries = (
  timeSeries: WindSpeedTimeSeries,
  interval: number,
): WindSpeedTimeSeries => {
  if (interval <= timeSeries.interval) {
    return timeSeries;
  }
  const accumulator = createTimeSeriesAccumulator(interval);
  timeSeries.points.forEach((point: WindSpeedTimeSeriesPoint): void => {
    addToInterval(
      accumulator,
      point.time,
      point.samples,
      point.mean * point.samples,
      point.min ?? Number.NaN,
      point.max ?? Number.NaN,
    );
  });
  return finalizeTimeSeries(accumulator);
};

/**
 * Lays out the intervals of a time series between two times on a regular grid
 * @param timeSeries The time series
 * @param start Start of the grid (ms since the epoch)
 * @param end End of the grid (ms since the epoch), exclusive
 */
export const buildTimeSeriesGrid = (
  timeSeries: WindSpeedTimeSeries,
  start: number,
  end: number,
): WindSpeedTimeSeriesGrid => {
  const { interval } = timeSeries;
  const gridStart = getIntervalStart(start, interval);
  const length = Math.max(Math.ceil((end - gridStart) / interval), 0);
  const points: Nullable<WindSpeedTimeSeriesPoint>[] = Array.from({ length }, () => null);
  timeSeries.points.forEach((point: WindSpeedTimeSeriesPoint): void => {
    const index = Math.round((point.time - gridStart) / interval);
    if ((index >= 0) && (index < length)) {
      points[index] = point;
    }
  });
  return { start: gridStart, interval, points };
};

const parseDateParts = (date: string): number[] => (
  date.split('-').map((part: string): number => Number.parseInt(part, 10))
);

/**
 * Gets the start and end (ms since the epoch, end exclusive) of a month in UTC
 * @param month The month (YYYY-MM)
 */
export const getMonthRange = (month: string): [number, number] => {
  const [year, monthOfYear] = parseDateParts(month);
  return [Date.UTC(year, monthOfYear - 1, 1), Date.UTC(year, monthOfYear, 1)];
};

/**
 * Gets the start and end (ms since the epoch, end exclusive) of a day in UTC
 * @param day The day (YYYY-MM-DD)
 */
export const getDayRange = (day: string): [number, number] => {
  const [year, monthOfYear, dayOfMonth] = parseDateParts(day);
  const start = Date.UTC(year, monthOfYear - 1, dayOfMonth);
  return [start, start + DAY_MS];
};

/**
 * Gets the finest interval to show a time series in without drawing intervals too narrow
 * @param baseInterval Interval of the time series (ms)
 * @param span Length of time shown (ms)
 * @param width Width the time shown is drawn across (px)
 */
export const getDisplayInterval = (baseInterval: number, span: number, width: number): number => {
  const minInterval = (span * MIN_INTERVAL_WIDTH) / Math.max(width, 1);
  if (baseInterval >= minInterval) {
    return baseInterval;
  }
  const intervals = DISPLAY_INTERVALS.filter((interval: number): boolean => (
    (interval > baseInterval) && ((interval % baseInterval) === 0)
  ));
  return intervals.find((interval: number): boolean => interval >= minInterval)
    || intervals[intervals.length - 1]
    || baseInterval;
};

/**
 * Describes the length of an interval as an adjective, e.g. Hourly or 10-minute
 */
export const formatIntervalLength = (interval: number): string => {
  if (interval === HOUR_MS) {
    return 'Hourly';
  }
  if (interval === DAY_MS) {
    return 'Daily';
  }
  if ((interval % HOUR_MS) === 0) {
    return `${interval / HOUR_MS}-hour`;
  }
  return `${Math.round(interval / MINUTE_MS)}-minute`;
};

/**
 * Gets the top of the wind speed axis: the highest value of any of the statistics, with a little
 * room above it
 */
export const getSpeedAxisMax = (
  points: readonly Nullable<WindSpeedTimeSeriesPoint>[],
  statistics: readonly WindSpeedStatistic[],
): number => {
  const highest = points.reduce((max: number, point: Nullable<WindSpeedTimeSeriesPoint>) => (
    !point ? max : statistics.reduce((statisticMax: number, statistic: WindSpeedStatistic) => {
      const value = point[statistic];
      return ((typeof value === 'number') && (value > statisticMax)) ? value : statisticMax;
    }, max)
  ), 0);
  return Math.max(highest * (1 + SPEED_AXIS_HEADROOM), MIN_SPEED_AXIS_MAX);
};

/**
 * Gets the point with the highest value of a statistic, the earliest when tied
 */
export const getPeakPoint = (
  points: readonly Nullable<WindSpeedTimeSeriesPoint>[],
  statistic: WindSpeedStatistic,
): Nullable<WindSpeedTimeSeriesPoint> => (
  points.reduce((peak: Nullable<WindSpeedTimeSeriesPoint>, point) => {
    const value = point ? point[statistic] : null;
    if ((typeof value !== 'number') || (peak && ((peak[statistic] as number) >= value))) {
      return peak;
    }
    return point;
  }, null)
);
