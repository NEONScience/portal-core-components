import { WindRoseData } from './windRoseUtil';
import { Nullable } from '../../types/core';

/**
 * Most memory (bytes, estimated) the data of the months fetched may take, so viewing many seasons
 * and years cannot exhaust the memory of the browser. A month takes up to about 1 MB, so this
 * keeps around 30 months, well over the 12 months of the year viewed, which are never evicted.
 */
export const MAX_CACHED_BYTES = 32 * 1024 * 1024;

// Estimated memory taken by each point of a wind speed time series, and each wind rose (bytes)
const TIME_SERIES_POINT_BYTES = 100;
const AGGREGATE_BYTES = 2048;

/**
 * Wind rose data of the months fetched for a site and sensor positions, which the seasonal and
 * annual aggregations are built from. The least recently used months are evicted first when the
 * data would take more than the most memory allowed, other than the months being viewed.
 */
export interface WindRoseMonthCache {
  // Site and sensor positions the months were fetched for, see getMonthCacheKey
  key: Nullable<string>;
  // Wind rose data of each month fetched, keyed by month (YYYY-MM)
  months: Record<string, WindRoseData>;
  // Estimated memory (bytes) taken by the data of each month
  sizes: Record<string, number>;
  // Use at which each month was last used, so the least recently used can be evicted first
  lastUsed: Record<string, number>;
  // Number of uses so far
  uses: number;
  // Months that could not be fetched, which are not fetched again
  failed: string[];
  // Most memory (bytes, estimated) the data of the months may take
  maxBytes: number;
}

export const getEmptyMonthCache = (maxBytes: number = MAX_CACHED_BYTES): WindRoseMonthCache => ({
  key: null,
  months: {},
  sizes: {},
  lastUsed: {},
  uses: 0,
  failed: [],
  maxBytes,
});

/**
 * Estimates the memory (bytes) taken by the wind rose data of a month
 */
export const estimateWindRoseDataSize = (data: WindRoseData): number => (
  Object.values(data.dataSets).reduce((size: number, dataSet): number => (
    size
    + (dataSet.timeSeries.points.length * TIME_SERIES_POINT_BYTES)
    + ((Object.keys(dataSet.daily).length + (dataSet.monthly ? 1 : 0)) * AGGREGATE_BYTES)
  ), 0)
);

/**
 * Gets the memory (bytes, estimated) taken by the data of every month cached
 */
export const getCachedBytes = (cache: WindRoseMonthCache): number => (
  Object.values(cache.sizes).reduce((total: number, size: number): number => total + size, 0)
);

/**
 * Marks the months that are cached as used now, so they are the last to be evicted
 */
export const touchMonths = (
  cache: WindRoseMonthCache,
  months: readonly string[],
): WindRoseMonthCache => {
  const cachedMonths = months.filter((month: string): boolean => !!cache.months[month]);
  if (cachedMonths.length <= 0) {
    return cache;
  }
  const uses = cache.uses + 1;
  const lastUsed = { ...cache.lastUsed };
  cachedMonths.forEach((month: string): void => {
    lastUsed[month] = uses;
  });
  return { ...cache, uses, lastUsed };
};

// A function declaration, as a generic arrow function would be parsed as JSX
function withoutMonths<T>(record: Record<string, T>, months: Set<string>): Record<string, T> {
  return Object.fromEntries(Object.entries(record).filter(([month]) => !months.has(month)));
}

/**
 * Evicts the least recently used months, other than those in use, until the data of the months
 * takes no more than the most memory allowed
 * @param cache The cache to evict months from
 * @param monthsInUse Months being viewed, which are never evicted
 */
export const evictMonths = (
  cache: WindRoseMonthCache,
  monthsInUse: readonly string[],
): WindRoseMonthCache => {
  let total = getCachedBytes(cache);
  if (total <= cache.maxBytes) {
    return cache;
  }
  const inUse = new Set(monthsInUse);
  const evicted = new Set<string>();
  Object.keys(cache.months)
    .filter((month: string): boolean => !inUse.has(month))
    .sort((a: string, b: string): number => (cache.lastUsed[a] ?? 0) - (cache.lastUsed[b] ?? 0))
    .every((month: string): boolean => {
      if (total <= cache.maxBytes) {
        return false;
      }
      evicted.add(month);
      total -= cache.sizes[month] ?? 0;
      return true;
    });
  if (evicted.size <= 0) {
    return cache;
  }
  return {
    ...cache,
    months: withoutMonths(cache.months, evicted),
    sizes: withoutMonths(cache.sizes, evicted),
    lastUsed: withoutMonths(cache.lastUsed, evicted),
  };
};

/**
 * Adds a month of wind rose data, replacing the cache when it is for another site or positions,
 * then evicts the least recently used months not in use when over the most memory allowed
 * @param cache The cache to add to
 * @param key Cache key of the site and positions the month was fetched for
 * @param month The month (YYYY-MM)
 * @param data Wind rose data of the month
 * @param monthsInUse Months being viewed, which are never evicted
 */
export const cacheMonth = (
  cache: WindRoseMonthCache,
  key: string,
  month: string,
  data: WindRoseData,
  monthsInUse: readonly string[],
): WindRoseMonthCache => {
  const base = (cache.key === key) ? cache : getEmptyMonthCache(cache.maxBytes);
  const added: WindRoseMonthCache = {
    ...base,
    key,
    months: { ...base.months, [month]: data },
    sizes: { ...base.sizes, [month]: estimateWindRoseDataSize(data) },
    failed: base.failed.filter((failedMonth: string): boolean => failedMonth !== month),
  };
  return evictMonths(touchMonths(added, [month]), [...monthsInUse, month]);
};

/**
 * Notes a month that could not be fetched for the site and positions of the cache
 */
export const markMonthFailed = (
  cache: WindRoseMonthCache,
  key: string,
  month: string,
): WindRoseMonthCache => (
  ((cache.key !== key) || cache.failed.includes(month))
    ? cache
    : { ...cache, failed: [...cache.failed, month] }
);
