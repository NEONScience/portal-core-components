import { parseDataFiles } from './dataUtil';
import { Nullable } from '../../types/core';

/**
 * Determines which files are valid for wind rose display
 * Order matters, look for higher resolution first
 *
 * Maps temporal spatial index definitions to file name designations
 */
const FILE_RESOLUTION_MATCHERS = [
  { tmi: '001', fileName: '1min' },
  { tmi: '001', fileName: '1_min' },
  { tmi: '002', fileName: '2min' },
  { tmi: '002', fileName: '2_min' },
  { tmi: '005', fileName: '5min' },
  { tmi: '005', fileName: '5_min' },
  { tmi: '030', fileName: '30min' },
  { tmi: '030', fileName: '30_min' },
];

const START_DATE_TIME_VAR = 'startDateTime';
const WIND_DIRECTION_VAR = 'windDirMean';
const WIND_SPEED_VAR = 'windSpeedMean';

/**
 * Wind speed bins (m/s), ordered from the slowest to the fastest. Calm observations (a wind
 * speed of 0) are counted separately as they have no direction, so the slowest bin excludes 0.
 */
export const VELOCITY_BINS: readonly string[] = [
  '0-.25',
  '.25-.5',
  '.5-.75',
  '.75-1',
  '1-1.5',
  '1.5-2',
  '2-3',
  '3-5',
  '5-8',
  '>8',
];

export const VELOCITY_BIN_LABELS: Record<string, string> = {
  '0-.25': '0-0.25',
  '.25-.5': '0.25-0.5',
  '.5-.75': '0.5-0.75',
  '.75-1': '0.75-1',
  '1-1.5': '1-1.5',
  '1.5-2': '1.5-2',
  '2-3': '2-3',
  '3-5': '3-5',
  '5-8': '5-8',
  '>8': '> 8',
};

// Exclusive upper bound (m/s) of each velocity bin, except the last which is unbounded
const VELOCITY_BIN_UPPER_BOUNDS: readonly number[] = [
  0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 5.0, 8.0,
];

export interface DirectionDefinition {
  angle: number;
  direction: string;
}

export const DIRECTION_BIN_LOOKUP: Record<string, DirectionDefinition> = {
  0: { angle: 0, direction: 'N' },
  22.5: { angle: 22.5, direction: 'NNE' },
  45: { angle: 45, direction: 'NE' },
  67.5: { angle: 67.5, direction: 'ENE' },
  90: { angle: 90, direction: 'E' },
  112.5: { angle: 112.5, direction: 'ESE' },
  135: { angle: 135, direction: 'SE' },
  157.5: { angle: 157.5, direction: 'SSE' },
  180: { angle: 180, direction: 'S' },
  202.5: { angle: 202.5, direction: 'SSW' },
  225: { angle: 225, direction: 'SW' },
  247.5: { angle: 247.5, direction: 'WSW' },
  270: { angle: 270, direction: 'W' },
  292.5: { angle: 292.5, direction: 'WNW' },
  315: { angle: 315, direction: 'NW' },
  337.5: { angle: 337.5, direction: 'NNW' },
};

/**
 * Direction bins (degrees clockwise from north), each centered on its compass point
 */
export const DIRECTION_BINS: readonly string[] = Object.keys(DIRECTION_BIN_LOOKUP)
  .sort((a: string, b: string): number => Number(a) - Number(b));

export const DIRECTION_SECTOR_WIDTH: number = 360 / DIRECTION_BINS.length;

/**
 * Wind Rose changed type
 */
export const WIND_ROSE_CHANGE_TYPE = {
  SITE: 'SITE_CHANGED',
  MONTH: 'MONTH_CHANGED',
  POSITIONS: 'POSITIONS_CHANGED',
};

export interface WindRosePosition {
  horizontal: string;
  vertical: string;
}

export interface WindRosePositionOption {
  value: string;
  label: string;
  position: WindRosePosition;
}

export interface WindRoseDataFilesInfo {
  dataFileUrls: string[];
  dataFileMatcher: Nullable<{ tmi: string; fileName: string }>;
  variablesFileUrl: Nullable<string>;
  positions: WindRosePosition[];
  positionOptions: WindRosePositionOption[];
}

/**
 * Wind rose counts for a single direction bin
 */
export interface WindRoseDirectionBin {
  // Direction bin key, see DIRECTION_BINS
  angle: string;
  // Number of observations per velocity bin, in VELOCITY_BINS order
  counts: number[];
  // Number of observations across all velocity bins
  total: number;
}

/**
 * Wind rose for a single aggregation period (a month or a day)
 */
export interface WindRoseAggregate {
  // One entry per direction bin, in DIRECTION_BINS order. Excludes calm observations.
  bins: WindRoseDirectionBin[];
  // Number of observations: those with a valid speed and direction, and calm observations
  samples: number;
  // Number of calm observations (a wind speed of 0), which have no direction
  calm: number;
  // Mean wind speed (m/s) of every observation, including calm observations
  meanSpeed: Nullable<number>;
}

export interface WindRoseData {
  positions: WindRosePosition[];
  positionOptions: WindRosePositionOption[];
  dataStateMessage: Nullable<string>;
  // Every observation in the fetched month
  monthly: Nullable<WindRoseAggregate>;
  // Observations per UTC day, keyed by YYYY-MM-DD
  daily: Record<string, WindRoseAggregate>;
  // Days (YYYY-MM-DD) with at least one observation, sorted ascending
  days: string[];
}

interface ParsedDataFile {
  data: Record<string, unknown>[];
}

/**
 * Parses the file names and determines which should be utilized for
 * time series data and variables, as well as generating sets of
 * available horizontal and vertical spatial index selection options
 * @param data
 * @param query
 */
export const parseWindRoseDataFiles = (data: unknown, query: unknown): WindRoseDataFilesInfo => (
  parseDataFiles(data, query, FILE_RESOLUTION_MATCHERS) as WindRoseDataFilesInfo
);

/**
 * Gets the index of the direction bin whose sector contains the direction, where each sector
 * spans half a sector width either side of its compass point (e.g. N spans 348.75 to 11.25)
 * @param direction Wind direction in degrees clockwise from north
 * @return The index into DIRECTION_BINS or -1 when the direction is not a number
 */
export const getDirectionBinIndex = (direction: number): number => {
  if (!Number.isFinite(direction)) {
    return -1;
  }
  const normalized = ((direction % 360) + 360) % 360;
  const index = Math.floor((normalized + (DIRECTION_SECTOR_WIDTH / 2)) / DIRECTION_SECTOR_WIDTH);
  return index % DIRECTION_BINS.length;
};

/**
 * Whether a wind speed is calm (exactly 0), for which there is no meaningful direction
 * @param speed Wind speed in m/s
 */
export const isCalm = (speed: number): boolean => speed === 0;

/**
 * @param speed Wind speed in m/s
 * @return The index into VELOCITY_BINS or -1 when the speed is not a positive number,
 * as calm (0) and invalid speeds are not binned
 */
export const getVelocityBinIndex = (speed: number): number => {
  if (!Number.isFinite(speed) || (speed <= 0)) {
    return -1;
  }
  const index = VELOCITY_BIN_UPPER_BOUNDS.findIndex((upperBound: number): boolean => (
    speed < upperBound
  ));
  return (index < 0) ? (VELOCITY_BINS.length - 1) : index;
};

const padTwo = (value: number): string => value.toString().padStart(2, '0');

/**
 * Gets the UTC day of a time as YYYY-MM-DD
 */
export const getDayKey = (time: Date): string => (
  `${time.getUTCFullYear()}-${padTwo(time.getUTCMonth() + 1)}-${padTwo(time.getUTCDate())}`
);

const parseNumber = (value: unknown): number => {
  if (typeof value === 'number') {
    return value;
  }
  if ((typeof value === 'string') && (value.trim().length > 0)) {
    return Number.parseFloat(value);
  }
  return Number.NaN;
};

const parseTime = (value: unknown): Nullable<Date> => {
  if ((typeof value !== 'string') || (value.trim().length <= 0)) {
    return null;
  }
  const time = new Date(value);
  return Number.isNaN(time.getTime()) ? null : time;
};

interface AggregateAccumulator {
  counts: number[][];
  samples: number;
  calm: number;
  speedSum: number;
}

const createAccumulator = (): AggregateAccumulator => ({
  counts: DIRECTION_BINS.map((): number[] => VELOCITY_BINS.map((): number => 0)),
  samples: 0,
  calm: 0,
  speedSum: 0,
});

const accumulate = (
  accumulator: AggregateAccumulator,
  directionIndex: number,
  velocityIndex: number,
  speed: number,
): void => {
  accumulator.counts[directionIndex][velocityIndex] += 1;
  accumulator.samples += 1;
  accumulator.speedSum += speed;
};

const accumulateCalm = (accumulator: AggregateAccumulator): void => {
  accumulator.calm += 1;
  accumulator.samples += 1;
};

const finalizeAggregate = (accumulator: AggregateAccumulator): WindRoseAggregate => ({
  bins: DIRECTION_BINS.map((angle: string, directionIndex: number): WindRoseDirectionBin => {
    const counts = accumulator.counts[directionIndex];
    return {
      angle,
      counts,
      total: counts.reduce((sum: number, count: number): number => sum + count, 0),
    };
  }),
  samples: accumulator.samples,
  calm: accumulator.calm,
  meanSpeed: (accumulator.samples > 0) ? (accumulator.speedSum / accumulator.samples) : null,
});

/**
 * Builds the monthly and daily wind roses for display from the parsed data files
 * of a single site and month, along with the selectable position options
 * @param data Parsed CSV data files
 * @param dataFilesInfo The data files info the data was fetched from
 */
export const buildWindRoseData = (
  data: ParsedDataFile[],
  dataFilesInfo: WindRoseDataFilesInfo,
): WindRoseData => {
  const builtData: WindRoseData = {
    positions: dataFilesInfo.positions,
    positionOptions: dataFilesInfo.positionOptions,
    dataStateMessage: null,
    monthly: null,
    daily: {},
    days: [],
  };
  const monthlyAccumulator = createAccumulator();
  const dailyAccumulators: Record<string, AggregateAccumulator> = {};
  data.forEach((fileData: ParsedDataFile): void => {
    fileData.data.forEach((row: Record<string, unknown>): void => {
      // The row is invalid if not associated with a time variable
      const time = parseTime(row[START_DATE_TIME_VAR]);
      if (!time) {
        builtData.dataStateMessage = 'Time variable could not be determined from data.';
        return;
      }
      const speed = parseNumber(row[WIND_SPEED_VAR]);
      const dayKey = getDayKey(time);
      if (isCalm(speed)) {
        if (!dailyAccumulators[dayKey]) {
          dailyAccumulators[dayKey] = createAccumulator();
        }
        accumulateCalm(dailyAccumulators[dayKey]);
        accumulateCalm(monthlyAccumulator);
        return;
      }
      const directionIndex = getDirectionBinIndex(parseNumber(row[WIND_DIRECTION_VAR]));
      const velocityIndex = getVelocityBinIndex(speed);
      if ((directionIndex < 0) || (velocityIndex < 0)) {
        return;
      }
      if (!dailyAccumulators[dayKey]) {
        dailyAccumulators[dayKey] = createAccumulator();
      }
      accumulate(dailyAccumulators[dayKey], directionIndex, velocityIndex, speed);
      accumulate(monthlyAccumulator, directionIndex, velocityIndex, speed);
    });
  });
  builtData.days = Object.keys(dailyAccumulators).sort();
  builtData.days.forEach((dayKey: string): void => {
    builtData.daily[dayKey] = finalizeAggregate(dailyAccumulators[dayKey]);
  });
  if (monthlyAccumulator.samples > 0) {
    builtData.monthly = finalizeAggregate(monthlyAccumulator);
  }
  return builtData;
};

const getDayOfMonth = (day: string): number => Number.parseInt(day.slice(8, 10), 10);

/**
 * Resolves the day to display from the days with data. Keeps the requested day when it has
 * data, otherwise falls back to the closest day of the month (e.g. when switching months).
 * @param selectedDay The requested day (YYYY-MM-DD)
 * @param days Days with data, sorted ascending
 */
export const resolveSelectedDay = (
  selectedDay: Nullable<string>,
  days: readonly string[],
): Nullable<string> => {
  if (days.length <= 0) {
    return null;
  }
  if (!selectedDay) {
    return days[0];
  }
  if (days.includes(selectedDay)) {
    return selectedDay;
  }
  const target = getDayOfMonth(selectedDay);
  if (Number.isNaN(target)) {
    return days[0];
  }
  return days.reduce((closest: string, day: string): string => (
    (Math.abs(getDayOfMonth(day) - target) < Math.abs(getDayOfMonth(closest) - target))
      ? day
      : closest
  ), days[0]);
};

/**
 * Steps through the days with data from a day
 * @param days Days with data, sorted ascending
 * @param day The day to step from
 * @param step Number of days with data to step, negative to step backwards
 * @param wrap Whether to wrap around at either end rather than stop
 */
export const stepDay = (
  days: readonly string[],
  day: Nullable<string>,
  step: number,
  wrap: boolean,
): Nullable<string> => {
  if (days.length <= 0) {
    return null;
  }
  const index = day ? days.indexOf(day) : -1;
  if (index < 0) {
    return days[0];
  }
  const next = index + step;
  if (wrap) {
    return days[((next % days.length) + days.length) % days.length];
  }
  return days[Math.min(Math.max(next, 0), days.length - 1)];
};
