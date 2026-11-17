import {
  afterAll,
  beforeAll,
  describe,
  expect,
  test,
} from '@jest/globals';

import { WIND_SPEED_SERIES_PALETTES } from '../colorSchemes';
import {
  createTimeSeriesGraph,
  formatTimeTick,
  getIntervalCenter,
  getTimeTickFormat,
  getTimeTicks,
  TimeSeriesGraphFrame,
} from '../windRoseTimeSeriesGraph';
import {
  aggregateTimeSeries,
  buildTimeSeriesGrid,
  DAY_MS,
  getDayRange,
  getMonthRange,
  WindSpeedTimeSeries,
} from '../windRoseTimeSeriesUtil';
import { Nullable } from '../../../types/core';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const HOUR_MS = 60 * 60 * 1000;
// Longer than any transition
const TRANSITION_WAIT_MS = 1200;

const JUNE = getMonthRange('2026-06');
const JULY = getMonthRange('2026-07');

const FILLS = {
  water: 'url(#water)',
  deep: 'url(#deep)',
  gust: 'url(#gust)',
  clipPath: 'url(#clip)',
};

// Two days of hourly observations from the start of a month
const buildTimeSeries = (monthStart: number, offset = 0): WindSpeedTimeSeries => ({
  interval: HOUR_MS,
  points: Array.from({ length: 48 }, (value: unknown, index: number) => ({
    time: monthStart + (index * HOUR_MS),
    samples: 30,
    mean: 2 + Math.sin(index / 4) + offset,
    min: 0.5 + offset,
    max: 6 + Math.cos(index / 3) + offset,
  })),
});

const buildFrame = (overrides: Partial<TimeSeriesGraphFrame> = {}): TimeSeriesGraphFrame => ({
  grid: buildTimeSeriesGrid(buildTimeSeries(JUNE[0]), JUNE[0], JUNE[1]),
  domain: JUNE,
  speedMax: 10,
  visible: { max: true, mean: true, min: true },
  colors: WIND_SPEED_SERIES_PALETTES.neon,
  width: 720,
  height: 180,
  ...overrides,
});

const createRoot = (): SVGGElement => {
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
  const root = document.createElementNS(SVG_NAMESPACE, 'g');
  svg.appendChild(root);
  document.body.appendChild(svg);
  return root;
};

const getPaths = (root: SVGGElement, key: string): SVGPathElement[] => (
  Array.from(root.querySelectorAll<SVGPathElement>(`path[data-path="${key}"]`))
);

const getPathData = (root: SVGGElement, key: string): Nullable<string> => {
  const paths = getPaths(root, key);
  return (paths.length === 1) ? paths[0].getAttribute('d') : `${paths.length} paths`;
};

const getTickLabels = (root: SVGGElement): string[] => (
  Array.from(root.querySelectorAll('.windRoseTimeSeriesTimeAxis .tick text'))
    .map((text: Element): string => text.textContent || '')
);

const wait = (ms: number): Promise<void> => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

// Draws a frame immediately, to compare transitions with
const drawImmediately = (frame: TimeSeriesGraphFrame): SVGGElement => {
  const root = createRoot();
  createTimeSeriesGraph(root, FILLS).update(frame, false);
  return root;
};

const TRANSLATE_PATTERN = /translate\(\s*([-\d.e]+)[\s,]*([-\d.e]*)\s*\)/;

describe('WindRoseViewer - windRoseTimeSeriesGraph', () => {
  // jsdom does not implement the SVG transform lists d3 reads to transition the axis ticks
  beforeAll(() => {
    Object.defineProperty(SVGElement.prototype, 'transform', {
      configurable: true,
      get(this: SVGElement) {
        const match = TRANSLATE_PATTERN.exec(this.getAttribute('transform') || '');
        return {
          baseVal: {
            consolidate: () => (!match ? null : {
              matrix: {
                a: 1,
                b: 0,
                c: 0,
                d: 1,
                e: Number(match[1]),
                f: Number(match[2] || 0),
              },
            }),
          },
        };
      },
    });
  });

  afterAll(() => {
    delete (SVGElement.prototype as unknown as Record<string, unknown>).transform;
  });

  describe('getTimeTicks', () => {
    test('labels days from the first of the month', () => {
      expect(getTimeTicks(JUNE, 1040).map((tick: Date): number => tick.getUTCDate()))
        .toEqual([1, 6, 11, 16, 21, 26]);
      expect(getTimeTicks(JUNE, 220).map((tick: Date): number => tick.getUTCDate()))
        .toEqual([1, 15, 29]);
    });
    test('labels round hours through a day, leaving out the start of the next', () => {
      expect(getTimeTicks(getDayRange('2026-06-15'), 1040).map(formatTimeTick)).toEqual([
        'Jun 15', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00',
      ]);
    });
    test('labels months through a season or year, with the year at the start and in January', () => {
      const winter: [number, number] = [Date.UTC(2025, 11, 1), Date.UTC(2026, 2, 1)];
      expect(getTimeTicks(winter, 1040).map(getTimeTickFormat(winter)))
        .toEqual(['Dec 2025', 'Jan 2026', 'Feb']);
      const year: [number, number] = [Date.UTC(2026, 0, 1), Date.UTC(2027, 0, 1)];
      const yearTicks = getTimeTicks(year, 1040).map(getTimeTickFormat(year));
      expect(yearTicks).toHaveLength(12);
      expect(yearTicks.slice(0, 3)).toEqual(['Jan 2026', 'Feb', 'Mar']);
      // Every few months when narrow
      expect(getTimeTicks(year, 300).map(getTimeTickFormat(year)))
        .toEqual(['Jan 2026', 'Apr', 'Jul', 'Oct']);
    });
    test('formats days and hours within a month', () => {
      expect(getTimeTickFormat(JUNE)(Date.UTC(2026, 5, 6))).toBe('Jun 6');
    });
  });

  test('getIntervalCenter gets the middle of an interval', () => {
    const grid = buildTimeSeriesGrid({ interval: HOUR_MS, points: [] }, JUNE[0], JUNE[1]);
    expect(getIntervalCenter(grid, 2)).toBe(JUNE[0] + (2.5 * HOUR_MS));
  });

  test('draws the water, minimum and maximum with axes', () => {
    const root = drawImmediately(buildFrame());
    ['gust', 'water', 'deep', 'glow', 'maxLine', 'minHalo', 'minLine', 'meanLine']
      .forEach((key: string) => {
        const [path] = getPaths(root, key);
        expect(path.getAttribute('display')).toBeNull();
        expect(path.getAttribute('d')).toMatch(/^M/);
      });
    expect(getPaths(root, 'water')[0].getAttribute('fill')).toBe(FILLS.water);
    expect(getTickLabels(root)).toEqual(['Jun 1', 'Jun 6', 'Jun 11', 'Jun 16', 'Jun 21', 'Jun 26']);
    expect(Array.from(root.querySelectorAll('.windRoseTimeSeriesSpeedAxis .tick text'))
      .map((text: Element) => text.textContent)).toEqual(['0', '5', '10']);
  });

  test('hides statistics that are not shown', () => {
    const root = drawImmediately(buildFrame({ visible: { max: false, mean: true, min: true } }));
    ['gust', 'maxLine'].forEach((key: string) => {
      const [path] = getPaths(root, key);
      expect(path.getAttribute('display')).toBe('none');
      expect(path.getAttribute('d')).toBeNull();
    });
    expect(getPaths(root, 'meanLine')[0].getAttribute('display')).toBeNull();
  });

  test('breaks the series where there are no observations', () => {
    const timeSeries = buildTimeSeries(JUNE[0]);
    const withGap = {
      ...timeSeries,
      points: timeSeries.points.filter((point, index: number) => (index < 10) || (index > 20)),
    };
    const root = drawImmediately(buildFrame({
      grid: buildTimeSeriesGrid(withGap, JUNE[0], JUNE[1]),
    }));
    expect((getPathData(root, 'meanLine') || '').match(/M/g)).toHaveLength(2);
  });

  test('rises to the time series shown', async () => {
    const frame = buildFrame();
    const root = createRoot();
    createTimeSeriesGraph(root, FILLS).update(frame, true);
    await wait(TRANSITION_WAIT_MS);
    const expected = drawImmediately(frame);
    expect(getPathData(root, 'meanLine')).toBe(getPathData(expected, 'meanLine'));
    expect(getPathData(root, 'gust')).toBe(getPathData(expected, 'gust'));
  });

  test('settles on the latest frame when interrupted', async () => {
    const root = createRoot();
    const graph = createTimeSeriesGraph(root, FILLS);
    graph.update(buildFrame(), false);
    graph.update(buildFrame({
      grid: buildTimeSeriesGrid(buildTimeSeries(JUNE[0], 1), JUNE[0], JUNE[1]),
      speedMax: 12,
    }), true);
    await wait(300);
    // Zooms into a day of other observations part way through
    const latest = buildFrame({
      grid: buildTimeSeriesGrid(buildTimeSeries(JUNE[0], 2), JUNE[0], JUNE[1]),
      domain: getDayRange('2026-06-02'),
      visible: { max: false, mean: true, min: true },
    });
    graph.update(latest, true);
    await wait(TRANSITION_WAIT_MS);
    const expected = drawImmediately(latest);
    ['water', 'meanLine', 'deep', 'minLine'].forEach((key: string) => {
      expect(getPathData(root, key)).toBe(getPathData(expected, key));
    });
    expect(getPaths(root, 'maxLine')[0].getAttribute('display')).toBe('none');
    expect(getTickLabels(root)).toEqual(getTickLabels(expected));
  });

  test('crossfades between time series of different intervals', async () => {
    const root = createRoot();
    const graph = createTimeSeriesGraph(root, FILLS);
    graph.update(buildFrame(), false);
    const daily = buildFrame({
      grid: buildTimeSeriesGrid(
        aggregateTimeSeries(buildTimeSeries(JUNE[0]), DAY_MS),
        JUNE[0],
        JUNE[1],
      ),
    });
    graph.update(daily, true);
    await wait(100);
    // Both are drawn part way through
    expect(getPaths(root, 'meanLine')).toHaveLength(2);
    await wait(TRANSITION_WAIT_MS);
    expect(getPathData(root, 'meanLine')).toBe(getPathData(drawImmediately(daily), 'meanLine'));
  });

  test('replaces the time series of another month', async () => {
    const root = createRoot();
    const graph = createTimeSeriesGraph(root, FILLS);
    graph.update(buildFrame(), false);
    const july = buildFrame({
      grid: buildTimeSeriesGrid(buildTimeSeries(JULY[0]), JULY[0], JULY[1]),
      domain: JULY,
    });
    graph.update(july, true);
    // The time axis changes to the new month immediately
    expect(getTickLabels(root)[0]).toBe('Jul 1');
    await wait(TRANSITION_WAIT_MS);
    expect(getPathData(root, 'meanLine')).toBe(getPathData(drawImmediately(july), 'meanLine'));
  });

  test('removes what it drew when destroyed', () => {
    const root = createRoot();
    const graph = createTimeSeriesGraph(root, FILLS);
    graph.update(buildFrame(), true);
    graph.destroy();
    expect(root.childNodes).toHaveLength(0);
  });
});
