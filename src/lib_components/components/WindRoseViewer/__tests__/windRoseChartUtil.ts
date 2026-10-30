import { describe, expect, test } from '@jest/globals';

import {
  buildMiniRose,
  buildSectors,
  formatCount,
  formatDay,
  formatMonth,
  formatPercent,
  formatPosition,
  formatShare,
  formatSpeed,
  formatTickPercent,
  getCalmPercent,
  getMaxSectorPercent,
  getPercentTicks,
  getPolarPoint,
  getPrevailingSector,
  getSectorAngles,
  getVelocityBinPercents,
} from '../windRoseChartUtil';
import {
  DIRECTION_BINS,
  VELOCITY_BINS,
  WindRoseAggregate,
} from '../windRoseUtil';

// 10 non-calm observations: 6 from N (4 slowest, 2 fastest) and 4 from E (2-3 m/s)
const buildAggregate = (calm = 0): WindRoseAggregate => ({
  bins: DIRECTION_BINS.map((angle: string) => {
    const counts = VELOCITY_BINS.map(() => 0);
    if (angle === '0') {
      counts[0] = 4;
      counts[VELOCITY_BINS.length - 1] = 2;
    }
    if (angle === '90') {
      counts[VELOCITY_BINS.indexOf('2-3')] = 4;
    }
    return { angle, counts, total: counts.reduce((sum, count) => sum + count, 0) };
  }),
  samples: 10 + calm,
  calm,
  meanSpeed: 3.25,
});

describe('WindRoseViewer - windRoseChartUtil', () => {
  describe('buildSectors', () => {
    test('stacks velocity bin percentages within each direction sector', () => {
      const sectors = buildSectors(buildAggregate());
      expect(sectors).toHaveLength(DIRECTION_BINS.length);
      const [north] = sectors;
      expect(north.direction).toBe('N');
      expect(north.degrees).toBe(0);
      expect(north.percent).toBeCloseTo(60);
      expect(north.segments[0]).toMatchObject({ startPercent: 0, endPercent: 40, count: 4 });
      const fastest = north.segments[VELOCITY_BINS.length - 1];
      expect(fastest.startPercent).toBeCloseTo(40);
      expect(fastest.endPercent).toBeCloseTo(60);
      expect(sectors[4].direction).toBe('E');
      expect(sectors[4].percent).toBeCloseTo(40);
    });
    test('returns no sectors without observations', () => {
      expect(buildSectors(null)).toEqual([]);
      expect(buildSectors({ ...buildAggregate(), samples: 0 })).toEqual([]);
    });
  });

  test('gets the largest sector percentage and the prevailing sector', () => {
    const sectors = buildSectors(buildAggregate());
    expect(getMaxSectorPercent(sectors)).toBeCloseTo(60);
    expect(getPrevailingSector(sectors)?.direction).toBe('N');
    expect(getPrevailingSector([])).toBeNull();
  });

  test('has no prevailing sector when every observation is calm', () => {
    const allCalm: WindRoseAggregate = {
      bins: DIRECTION_BINS.map((angle: string) => ({
        angle,
        counts: VELOCITY_BINS.map(() => 0),
        total: 0,
      })),
      samples: 5,
      calm: 5,
      meanSpeed: 0,
    };
    const sectors = buildSectors(allCalm);
    expect(getMaxSectorPercent(sectors)).toBe(0);
    expect(getPrevailingSector(sectors)).toBeNull();
    expect(getCalmPercent(allCalm)).toBe(100);
  });

  test('reports percentages of every observation, including calm observations', () => {
    // 10 calm observations double the total, halving every other share
    const aggregate = buildAggregate(10);
    expect(getCalmPercent(aggregate)).toBeCloseTo(50);
    const [north] = buildSectors(aggregate);
    expect(north.percent).toBeCloseTo(30);
    const percents = getVelocityBinPercents(aggregate);
    expect(percents[0]).toBeCloseTo(20);
    const total = percents.reduce((sum: number, percent: number) => sum + percent, 0);
    expect(total + getCalmPercent(aggregate)).toBeCloseTo(100);
    expect(getCalmPercent(null)).toBe(0);
  });

  test('gets round percentage ticks ending at or beyond the largest sector', () => {
    expect(getPercentTicks(12.7)).toEqual([5, 10, 15]);
    expect(getPercentTicks(60)).toEqual([20, 40, 60]);
    const ticks = getPercentTicks(7.3);
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(7.3);
    expect(ticks.every((tick: number) => tick > 0)).toBe(true);
    expect(getPercentTicks(0).length).toBeGreaterThan(0);
  });

  test('gets the share of observations in each velocity bin', () => {
    const percents = getVelocityBinPercents(buildAggregate());
    expect(percents).toHaveLength(VELOCITY_BINS.length);
    expect(percents[0]).toBeCloseTo(40);
    expect(percents[VELOCITY_BINS.indexOf('2-3')]).toBeCloseTo(40);
    expect(percents[VELOCITY_BINS.length - 1]).toBeCloseTo(20);
    expect(percents.reduce((sum: number, percent: number) => sum + percent, 0)).toBeCloseTo(100);
    expect(getVelocityBinPercents(null).every((percent: number) => percent === 0)).toBe(true);
  });

  test('gets sector angles centered on the compass direction', () => {
    const [start, end] = getSectorAngles(90, 2);
    expect(start).toBeCloseTo((79.75 * Math.PI) / 180);
    expect(end).toBeCloseTo((100.25 * Math.PI) / 180);
    const [x, y] = getPolarPoint(10, 90);
    expect(x).toBeCloseTo(10);
    expect(y).toBeCloseTo(0);
    const [northX, northY] = getPolarPoint(10, 0);
    expect(northX).toBeCloseTo(0);
    expect(northY).toBeCloseTo(-10);
  });

  test('builds thumbnail wind rose paths for velocity bins with observations', () => {
    const miniRose = buildMiniRose(buildAggregate(), 1, 19, 3);
    expect(miniRose.segments.map((segment) => segment.velocityBin)).toEqual(['0-.25', '2-3', '>8']);
    miniRose.segments.forEach((segment) => {
      expect(segment.d.startsWith('M')).toBe(true);
    });
    expect(miniRose.outline.length).toBeGreaterThan(0);
    expect(buildMiniRose(null, 1, 19, 3)).toEqual({ segments: [], outline: '' });
  });

  test('formats values for display', () => {
    expect(formatCount(21563)).toBe('21,563');
    expect(formatPercent(0)).toBe('0%');
    expect(formatPercent(0.04)).toBe('<0.1%');
    expect(formatPercent(12.345)).toBe('12.3%');
    expect(formatShare(175, 720)).toBe('24.3%');
    expect(formatShare(720, 720)).toBe('100%');
    // Only the whole is 100%
    expect(formatShare(7199, 7200)).toBe('99.9%');
    expect(formatShare(1, 100000)).toBe('<0.1%');
    expect(formatShare(0, 720)).toBe('0%');
    expect(formatShare(0, 0)).toBe('-');
    expect(formatTickPercent(5)).toBe('5%');
    expect(formatTickPercent(0.5)).toBe('0.5%');
    expect(formatSpeed(3.25)).toBe('3.3 m/s');
    expect(formatSpeed(null)).toBe('-');
    expect(formatDay('2026-06-05')).toBe('Jun 5, 2026');
    expect(formatDay('2026-06-05', 'dddd, MMMM D, YYYY')).toBe('Friday, June 5, 2026');
    expect(formatMonth('2026-06')).toBe('June 2026');
    expect(formatPosition({ horizontal: '000', vertical: '010' })).toBe('000.010');
  });
});
