import {
  DIRECTION_BINS,
  VELOCITY_BINS,
  WindRoseAggregate,
  WindRoseData,
  WindRoseDirectionBin,
  WindRosePosition,
  WindRoseQualityFilter,
} from './windRoseUtil';
import {
  aggregateTimeSeries,
  getEmptyTimeSeries,
  WindSpeedTimeSeries,
  WindSpeedTimeSeriesPoint,
} from './windRoseTimeSeriesUtil';
import { Nullable } from '../../types/core';

/**
 * Periods of more than a month a wind rose can be built for
 */
export enum WindRosePeriodType {
  // A meteorological season: winter (December to February), spring, summer or fall
  SEASON = 'SEASON',
  // A calendar year
  YEAR = 'YEAR',
}

const MONTHS_PER_PERIOD: Record<WindRosePeriodType, number> = {
  [WindRosePeriodType.SEASON]: 3,
  [WindRosePeriodType.YEAR]: 12,
};

// Meteorological seasons, ordered by the month (0 is January) each starts in
const SEASONS: readonly { startMonth: number; label: string }[] = [
  { startMonth: 2, label: 'Spring' },
  { startMonth: 5, label: 'Summer' },
  { startMonth: 8, label: 'Fall' },
  { startMonth: 11, label: 'Winter' },
];

const MONTH_NAMES: readonly string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const padTwo = (value: number): string => value.toString().padStart(2, '0');

const parseMonth = (month: string): { year: number; monthIndex: number } => {
  const [year, monthOfYear] = month.split('-').map((part: string) => Number.parseInt(part, 10));
  return { year, monthIndex: monthOfYear - 1 };
};

const formatMonthKey = (year: number, monthIndex: number): string => {
  const date = new Date(Date.UTC(year, monthIndex, 1));
  return `${date.getUTCFullYear()}-${padTwo(date.getUTCMonth() + 1)}`;
};

/**
 * Gets the month (YYYY-MM) a number of months from a month
 */
export const addMonths = (month: string, count: number): string => {
  const { year, monthIndex } = parseMonth(month);
  return formatMonthKey(year, monthIndex + count);
};

/**
 * Gets the number of months from one month (YYYY-MM) to another, negative when earlier
 */
export const getMonthsBetween = (from: string, to: string): number => {
  const start = parseMonth(from);
  const end = parseMonth(to);
  return ((end.year - start.year) * 12) + (end.monthIndex - start.monthIndex);
};

/**
 * Gets the UTC month (YYYY-MM) of a time
 * @param time Milliseconds since the epoch
 */
export const getMonthKey = (time: number): string => {
  const date = new Date(time);
  return formatMonthKey(date.getUTCFullYear(), date.getUTCMonth());
};

/**
 * Gets the first month (YYYY-MM) of the season or year containing a month
 */
export const getPeriodStartMonth = (periodType: WindRosePeriodType, month: string): string => {
  const { year, monthIndex } = parseMonth(month);
  if (periodType === WindRosePeriodType.YEAR) {
    return formatMonthKey(year, 0);
  }
  // Seasons start in March, June, September and December
  return addMonths(month, -((monthIndex + 1) % 3));
};

/**
 * Gets the months (YYYY-MM) of the season or year containing a month, in order
 */
export const getPeriodMonths = (periodType: WindRosePeriodType, month: string): string[] => {
  const start = getPeriodStartMonth(periodType, month);
  return Array.from({ length: MONTHS_PER_PERIOD[periodType] }, (value: unknown, index: number) => (
    addMonths(start, index)
  ));
};

/**
 * Gets the start and end (ms since the epoch, end exclusive) of the season or year containing a
 * month, in UTC
 */
export const getPeriodRange = (periodType: WindRosePeriodType, month: string): [number, number] => {
  const { year, monthIndex } = parseMonth(getPeriodStartMonth(periodType, month));
  return [
    Date.UTC(year, monthIndex, 1),
    Date.UTC(year, monthIndex + MONTHS_PER_PERIOD[periodType], 1),
  ];
};

/**
 * Names the season or year containing a month, e.g. Summer 2026, Winter 2025-26 or 2026
 */
export const getPeriodLabel = (periodType: WindRosePeriodType, month: string): string => {
  const start = parseMonth(getPeriodStartMonth(periodType, month));
  if (periodType === WindRosePeriodType.YEAR) {
    return `${start.year}`;
  }
  const season = SEASONS.find((candidate) => candidate.startMonth === start.monthIndex);
  const label = season ? season.label : '';
  // Winter spans the end of one year and the start of the next
  const end = parseMonth(addMonths(getPeriodStartMonth(periodType, month), 2));
  return (end.year === start.year)
    ? `${label} ${start.year}`
    : `${label} ${start.year}-${padTwo(end.year % 100)}`;
};

/**
 * Describes the months of the season or year containing a month, e.g. June to August 2026
 */
export const getPeriodRangeLabel = (periodType: WindRosePeriodType, month: string): string => {
  const months = getPeriodMonths(periodType, month);
  const start = parseMonth(months[0]);
  const end = parseMonth(months[months.length - 1]);
  const startLabel = MONTH_NAMES[start.monthIndex];
  const endLabel = `${MONTH_NAMES[end.monthIndex]} ${end.year}`;
  return (start.year === end.year)
    ? `${startLabel} to ${endLabel}`
    : `${startLabel} ${start.year} to ${endLabel}`;
};

/**
 * Gets the months of the season or year containing a month that have data, in order
 * @param availableMonths Months (YYYY-MM) with data
 */
export const getAvailablePeriodMonths = (
  periodType: WindRosePeriodType,
  month: string,
  availableMonths: readonly string[],
): string[] => {
  const available = new Set(availableMonths);
  return getPeriodMonths(periodType, month).filter((periodMonth: string) => (
    available.has(periodMonth)
  ));
};

/**
 * Gets the first month of each season or year with data, latest first
 * @param availableMonths Months (YYYY-MM) with data
 */
export const getAvailablePeriodStarts = (
  periodType: WindRosePeriodType,
  availableMonths: readonly string[],
): string[] => (
  Array.from(new Set(availableMonths.map((month: string) => (
    getPeriodStartMonth(periodType, month)
  )))).sort().reverse()
);

/**
 * Gets the month to view a season or year by: its month in the same position within it as a
 * month of another season or year where it has data, otherwise its closest month that does
 * @param periodMonth A month (YYYY-MM) of the season or year to view
 * @param positionMonth A month (YYYY-MM) whose position within its season or year to keep
 * @param availableMonths Months (YYYY-MM) with data
 * @return A month of the season or year, or null when none of its months have data
 */
export const getPeriodAnchorMonth = (
  periodType: WindRosePeriodType,
  periodMonth: string,
  positionMonth: Nullable<string>,
  availableMonths: readonly string[],
): Nullable<string> => {
  const start = getPeriodStartMonth(periodType, periodMonth);
  const periodMonths = getAvailablePeriodMonths(periodType, start, availableMonths);
  if (periodMonths.length <= 0) {
    return null;
  }
  const offset = positionMonth
    ? getMonthsBetween(getPeriodStartMonth(periodType, positionMonth), positionMonth)
    : 0;
  const preferred = addMonths(start, offset);
  return periodMonths.reduce((closest: string, month: string) => (
    (Math.abs(getMonthsBetween(preferred, month)) < Math.abs(getMonthsBetween(preferred, closest)))
      ? month
      : closest
  ), periodMonths[0]);
};

/**
 * Steps to the previous or next season or year with data, keeping to the same month of the
 * period where it has data, otherwise the closest month of the period that does
 * @param availableMonths Months (YYYY-MM) with data
 * @param step 1 for the next period with data, -1 for the previous
 * @return A month of the period, or null when there is no period with data in that direction
 */
export const stepPeriod = (
  periodType: WindRosePeriodType,
  month: string,
  availableMonths: readonly string[],
  step: 1 | -1,
): Nullable<string> => {
  if (availableMonths.length <= 0) {
    return null;
  }
  const sorted = [...availableMonths].sort();
  const firstAvailable = sorted[0];
  const lastAvailable = sorted[sorted.length - 1];
  const size = MONTHS_PER_PERIOD[periodType];
  let start = getPeriodStartMonth(periodType, month);
  let period = null;
  let foundPeriod = false;
  while (!foundPeriod) {
    start = addMonths(start, step * size);
    if ((step > 0) ? (start > lastAvailable) : (addMonths(start, size - 1) < firstAvailable)) {
      period = null;
      foundPeriod = true;
    }
    if (!foundPeriod) {
      const anchor = getPeriodAnchorMonth(periodType, start, month, sorted);
      if (anchor) {
        foundPeriod = true;
        period = anchor;
      }
    }
  }
  return period;
};

/**
 * Combines the wind roses of separate periods (e.g. the months of a year) into one
 */
export const mergeAggregates = (
  aggregates: readonly WindRoseAggregate[],
): Nullable<WindRoseAggregate> => {
  if (aggregates.length <= 0) {
    return null;
  }
  const samples = aggregates.reduce((sum: number, aggregate) => sum + aggregate.samples, 0);
  const speedSum = aggregates.reduce((sum: number, aggregate) => (
    sum + ((aggregate.meanSpeed ?? 0) * aggregate.samples)
  ), 0);
  return {
    bins: DIRECTION_BINS.map((angle: string, directionIndex: number): WindRoseDirectionBin => {
      const counts = VELOCITY_BINS.map((velocityBin: string, velocityIndex: number): number => (
        aggregates.reduce((sum: number, aggregate) => (
          sum + aggregate.bins[directionIndex].counts[velocityIndex]
        ), 0)
      ));
      return {
        angle,
        counts,
        total: counts.reduce((sum: number, count: number): number => sum + count, 0),
      };
    }),
    samples,
    calm: aggregates.reduce((sum: number, aggregate) => sum + aggregate.calm, 0),
    meanSpeed: (samples > 0) ? (speedSum / samples) : null,
  };
};

/**
 * Combines the wind speed time series of separate periods (e.g. the months of a year) into one,
 * in the longest interval of any of them
 */
export const mergeTimeSeries = (
  timeSeries: readonly WindSpeedTimeSeries[],
): WindSpeedTimeSeries => {
  if (timeSeries.length <= 0) {
    return getEmptyTimeSeries();
  }
  const interval = Math.max(...timeSeries.map((series: WindSpeedTimeSeries) => series.interval));
  return {
    interval,
    points: timeSeries
      .flatMap((series: WindSpeedTimeSeries) => aggregateTimeSeries(series, interval).points)
      .sort((a: WindSpeedTimeSeriesPoint, b: WindSpeedTimeSeriesPoint) => a.time - b.time),
  };
};

/**
 * Wind roses of a season or year, built from the wind roses of its months
 */
export interface WindRosePeriodDataState {
  // Wind rose of every observation in the period
  aggregate: Nullable<WindRoseAggregate>;
  // Wind rose of each month of the period with observations, keyed by month (YYYY-MM)
  monthly: Record<string, WindRoseAggregate>;
  // Months of the period with observations, sorted ascending
  months: string[];
  // Wind speed over time of every observation in the period
  timeSeries: WindSpeedTimeSeries;
}

/**
 * Builds the wind roses of a season or year for each quality filter from the months fetched
 * @param monthData Wind rose data fetched for each month, keyed by month (YYYY-MM)
 * @param months Months of the period
 */
export const buildPeriodDataSets = (
  monthData: Record<string, WindRoseData>,
  months: readonly string[],
): Record<WindRoseQualityFilter, WindRosePeriodDataState> => {
  const build = (qualityFilter: WindRoseQualityFilter): WindRosePeriodDataState => {
    const monthly: Record<string, WindRoseAggregate> = {};
    const timeSeries: WindSpeedTimeSeries[] = [];
    months.forEach((month: string): void => {
      const data = monthData[month];
      if (!data) {
        return;
      }
      const dataSet = data.dataSets[qualityFilter];
      if (dataSet.monthly) {
        monthly[month] = dataSet.monthly;
      }
      timeSeries.push(dataSet.timeSeries);
    });
    const monthsWithData = Object.keys(monthly).sort();
    return {
      aggregate: mergeAggregates(monthsWithData.map((month: string) => monthly[month])),
      monthly,
      months: monthsWithData,
      timeSeries: mergeTimeSeries(timeSeries),
    };
  };
  return {
    [WindRoseQualityFilter.VALIDATED]: build(WindRoseQualityFilter.VALIDATED),
    [WindRoseQualityFilter.ALL]: build(WindRoseQualityFilter.ALL),
  };
};

/**
 * Identifies the site and sensor positions months of wind rose data are fetched for
 */
export const getMonthCacheKey = (site: string, positions: readonly WindRosePosition[]): string => (
  [
    site,
    ...positions
      .map((position: WindRosePosition): string => `${position.horizontal}.${position.vertical}`)
      .sort(),
  ].join('|')
);
