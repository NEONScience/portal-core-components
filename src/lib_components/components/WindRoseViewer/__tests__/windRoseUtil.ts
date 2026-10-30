import { describe, expect, test } from '@jest/globals';

import {
  buildWindRoseData,
  DIRECTION_BINS,
  getDayKey,
  getDirectionBinIndex,
  getVelocityBinIndex,
  isCalm,
  resolveSelectedDay,
  stepDay,
  VELOCITY_BINS,
  WindRoseAggregate,
  WindRoseDataFilesInfo,
} from '../windRoseUtil';

const getDirectionBin = (direction: number): string => (
  DIRECTION_BINS[getDirectionBinIndex(direction)]
);
const getVelocityBin = (speed: number): string => VELOCITY_BINS[getVelocityBinIndex(speed)];

const dataFilesInfo: WindRoseDataFilesInfo = {
  dataFileUrls: ['test'],
  dataFileMatcher: { tmi: '002', fileName: '2min' },
  variablesFileUrl: null,
  positions: [{ horizontal: '000', vertical: '010' }],
  positionOptions: [{
    value: '(000, 010)',
    label: '(horizontal: 000, vertical: 010)',
    position: { horizontal: '000', vertical: '010' },
  }],
};

const row = (
  startDateTime: string,
  windDirMean: string,
  windSpeedMean: string,
): Record<string, unknown> => ({ startDateTime, windDirMean, windSpeedMean });

const getCount = (
  aggregate: WindRoseAggregate,
  directionBin: string,
  velocityBin: string,
): number => (
  aggregate.bins[DIRECTION_BINS.indexOf(directionBin)].counts[VELOCITY_BINS.indexOf(velocityBin)]
);

describe('WindRoseViewer - windRoseUtil', () => {
  describe('getDirectionBinIndex', () => {
    test('bins directions into the sector centered on the closest compass point', () => {
      expect(getDirectionBin(0)).toBe('0');
      expect(getDirectionBin(5)).toBe('0');
      expect(getDirectionBin(11.24)).toBe('0');
      expect(getDirectionBin(11.25)).toBe('22.5');
      expect(getDirectionBin(30)).toBe('22.5');
      expect(getDirectionBin(247.5)).toBe('247.5');
      expect(getDirectionBin(348.74)).toBe('337.5');
      expect(getDirectionBin(348.75)).toBe('0');
      expect(getDirectionBin(355)).toBe('0');
    });
    test('normalizes directions outside of 0 to 360 degrees', () => {
      expect(getDirectionBin(360)).toBe('0');
      expect(getDirectionBin(450)).toBe('90');
      expect(getDirectionBin(-10)).toBe('0');
      expect(getDirectionBin(-90)).toBe('270');
    });
    test('returns -1 for directions that are not finite numbers', () => {
      expect(getDirectionBinIndex(Number.NaN)).toBe(-1);
      expect(getDirectionBinIndex(Number.POSITIVE_INFINITY)).toBe(-1);
    });
  });

  describe('getVelocityBinIndex', () => {
    test('bins speeds by the exclusive upper bound of each bin', () => {
      expect(getVelocityBin(0.01)).toBe('0-.25');
      expect(getVelocityBin(0.24)).toBe('0-.25');
      expect(getVelocityBin(0.25)).toBe('.25-.5');
      expect(getVelocityBin(1)).toBe('1-1.5');
      expect(getVelocityBin(7.99)).toBe('5-8');
      expect(getVelocityBin(8)).toBe('>8');
      expect(getVelocityBin(42)).toBe('>8');
    });
    test('does not bin calm (0), negative or non-numeric speeds', () => {
      expect(getVelocityBinIndex(0)).toBe(-1);
      expect(getVelocityBinIndex(-0.1)).toBe(-1);
      expect(getVelocityBinIndex(Number.NaN)).toBe(-1);
    });
  });

  test('isCalm is true only for a wind speed of 0', () => {
    expect(isCalm(0)).toBe(true);
    expect(isCalm(0.01)).toBe(false);
    expect(isCalm(Number.NaN)).toBe(false);
  });

  describe('getDayKey', () => {
    test('gets the zero padded UTC day', () => {
      expect(getDayKey(new Date('2026-06-05T23:58:00Z'))).toBe('2026-06-05');
      expect(getDayKey(new Date('2026-12-31T00:00:00Z'))).toBe('2026-12-31');
    });
  });

  describe('buildWindRoseData', () => {
    const data = [
      {
        data: [
          row('2026-06-01T00:00:00Z', '5', '0.1'),
          row('2026-06-01T00:02:00Z', '355', '3.2'),
          row('2026-06-01T00:04:00Z', '90', '9.5'),
          row('2026-06-02T00:00:00Z', '200', '1.2'),
          // Missing direction or speed is not binned
          row('2026-06-02T00:02:00Z', '', '1.2'),
          row('2026-06-03T00:00:00Z', '200', ''),
        ],
      },
      {
        // Observations from every data file (position) are combined
        data: [row('2026-06-02T00:04:00Z', '247.5', '2.5')],
      },
    ];
    const built = buildWindRoseData(data, dataFilesInfo);

    test('builds a daily wind rose for each day with observations', () => {
      expect(built.days).toEqual(['2026-06-01', '2026-06-02']);
      expect(Object.keys(built.daily).sort()).toEqual(built.days);
      const firstDay = built.daily['2026-06-01'];
      expect(firstDay.samples).toBe(3);
      expect(getCount(firstDay, '0', '0-.25')).toBe(1);
      expect(getCount(firstDay, '0', '3-5')).toBe(1);
      expect(getCount(firstDay, '90', '>8')).toBe(1);
      expect(firstDay.meanSpeed).toBeCloseTo((0.1 + 3.2 + 9.5) / 3);
      const secondDay = built.daily['2026-06-02'];
      expect(secondDay.samples).toBe(2);
      expect(getCount(secondDay, '202.5', '1-1.5')).toBe(1);
      expect(getCount(secondDay, '247.5', '2-3')).toBe(1);
    });

    test('builds a monthly wind rose of every observation', () => {
      const { monthly } = built;
      expect(monthly).not.toBeNull();
      const monthlyAggregate = monthly as WindRoseAggregate;
      expect(monthlyAggregate.samples).toBe(5);
      expect(monthlyAggregate.calm).toBe(0);
      expect(monthlyAggregate.meanSpeed).toBeCloseTo((0.1 + 3.2 + 9.5 + 1.2 + 2.5) / 5);
      monthlyAggregate.bins.forEach((bin, directionIndex) => {
        bin.counts.forEach((count, velocityIndex) => {
          const dailyCount = built.days.reduce((sum, day) => (
            sum + built.daily[day].bins[directionIndex].counts[velocityIndex]
          ), 0);
          expect(count).toBe(dailyCount);
        });
      });
    });

    test('totals each direction bin, ordered clockwise from north', () => {
      const monthlyAggregate = built.monthly as WindRoseAggregate;
      expect(monthlyAggregate.bins.map((bin) => bin.angle)).toEqual(DIRECTION_BINS);
      monthlyAggregate.bins.forEach((bin) => {
        expect(bin.counts).toHaveLength(VELOCITY_BINS.length);
        expect(bin.total).toBe(bin.counts.reduce((sum, count) => sum + count, 0));
      });
      expect(monthlyAggregate.bins[0].total).toBe(2);
    });

    test('passes through the positions of the data files', () => {
      expect(built.positions).toEqual(dataFilesInfo.positions);
      expect(built.positionOptions).toEqual(dataFilesInfo.positionOptions);
      expect(built.dataStateMessage).toBeNull();
    });

    test('flags rows without a time and builds no wind rose without observations', () => {
      const result = buildWindRoseData(
        [{ data: [row('', '10', '1'), row('2026-06-01T00:00:00Z', 'NA', '1')] }],
        dataFilesInfo,
      );
      expect(result.dataStateMessage).toBe('Time variable could not be determined from data.');
      expect(result.monthly).toBeNull();
      expect(result.daily).toEqual({});
      expect(result.days).toEqual([]);
    });
  });

  describe('buildWindRoseData calm observations', () => {
    const built = buildWindRoseData(
      [{
        data: [
          row('2026-06-01T00:00:00Z', '90', '0'),
          // Calm observations need no direction
          row('2026-06-01T00:02:00Z', '', '0.00'),
          row('2026-06-01T00:04:00Z', '90', '0.1'),
          row('2026-06-01T00:06:00Z', '270', '3.9'),
          // A day of only calm observations still has data
          row('2026-06-02T00:00:00Z', '180', '0'),
        ],
      }],
      dataFilesInfo,
    );

    test('counts calm observations separately from the wind speed bins', () => {
      const firstDay = built.daily['2026-06-01'];
      expect(firstDay.calm).toBe(2);
      expect(firstDay.samples).toBe(4);
      expect(getCount(firstDay, '90', '0-.25')).toBe(1);
      expect(getCount(firstDay, '270', '3-5')).toBe(1);
      const binned = firstDay.bins.reduce((sum, bin) => sum + bin.total, 0);
      expect(binned + firstDay.calm).toBe(firstDay.samples);
      expect(firstDay.meanSpeed).toBeCloseTo((0 + 0 + 0.1 + 3.9) / 4);
    });

    test('includes days and months of only calm observations', () => {
      expect(built.days).toEqual(['2026-06-01', '2026-06-02']);
      const secondDay = built.daily['2026-06-02'];
      expect(secondDay.samples).toBe(1);
      expect(secondDay.calm).toBe(1);
      expect(secondDay.bins.every((bin) => bin.total === 0)).toBe(true);
      expect(secondDay.meanSpeed).toBe(0);
      expect(built.monthly?.calm).toBe(3);
      expect(built.monthly?.samples).toBe(5);
    });
  });

  describe('resolveSelectedDay', () => {
    const days = ['2026-06-01', '2026-06-02', '2026-06-15', '2026-06-30'];
    test('returns null when there are no days with data', () => {
      expect(resolveSelectedDay('2026-06-01', [])).toBeNull();
    });
    test('defaults to the first day with data', () => {
      expect(resolveSelectedDay(null, days)).toBe('2026-06-01');
      expect(resolveSelectedDay('not a day', days)).toBe('2026-06-01');
    });
    test('keeps a day with data', () => {
      expect(resolveSelectedDay('2026-06-15', days)).toBe('2026-06-15');
    });
    test('falls back to the closest day of the month', () => {
      expect(resolveSelectedDay('2026-05-16', days)).toBe('2026-06-15');
      expect(resolveSelectedDay('2026-07-31', days)).toBe('2026-06-30');
      expect(resolveSelectedDay('2026-06-08', days)).toBe('2026-06-02');
    });
  });

  describe('stepDay', () => {
    const days = ['2026-06-01', '2026-06-02', '2026-06-04'];
    test('steps through the days with data', () => {
      expect(stepDay(days, '2026-06-02', 1, false)).toBe('2026-06-04');
      expect(stepDay(days, '2026-06-02', -1, false)).toBe('2026-06-01');
    });
    test('stops at either end unless wrapping', () => {
      expect(stepDay(days, '2026-06-04', 1, false)).toBe('2026-06-04');
      expect(stepDay(days, '2026-06-01', -1, false)).toBe('2026-06-01');
      expect(stepDay(days, '2026-06-04', 1, true)).toBe('2026-06-01');
      expect(stepDay(days, '2026-06-01', -1, true)).toBe('2026-06-04');
    });
    test('starts from the first day when the day has no data', () => {
      expect(stepDay(days, '2026-05-31', 1, false)).toBe('2026-06-01');
      expect(stepDay(days, null, 1, true)).toBe('2026-06-01');
      expect(stepDay([], '2026-06-01', 1, true)).toBeNull();
    });
  });
});
