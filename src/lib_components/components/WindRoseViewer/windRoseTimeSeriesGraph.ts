import { axisBottom, axisLeft } from 'd3-axis';
import { NumberValue, scaleLinear, scaleUtc } from 'd3-scale';
import { BaseType, select, Selection } from 'd3-selection';
import { area, curveMonotoneX, line } from 'd3-shape';
// Adds transition and interrupt to selections. Imported for its side effects as compilers that
// elide imports only used as types (such as SWC) would otherwise leave it out.
import 'd3-transition';
import type { Transition } from 'd3-transition';
import moment from 'moment';

import { WindSpeedSeriesColors } from './colorSchemes';
import {
  DAY_MS,
  SPEED_TICK_COUNT,
  WindSpeedStatistic,
  WindSpeedTimeSeriesGrid,
} from './windRoseTimeSeriesUtil';
import { Nullable } from '../../types/core';

/**
 * Class names of the axes drawn by the graph, for styling
 */
export const TIME_SERIES_GRAPH_CLASS_NAMES = {
  grid: 'windRoseTimeSeriesGrid',
  timeAxis: 'windRoseTimeSeriesTimeAxis',
  speedAxis: 'windRoseTimeSeriesSpeedAxis',
};

const TRANSITION_NAME = 'windRoseTimeSeries';
const COLOR_TRANSITION_NAME = 'windRoseTimeSeriesColor';
const TRANSITION_DURATION_MS = 750;
const RISE_DURATION_MS = 900;
const COLOR_TRANSITION_DURATION_MS = 400;
// How much faster than the transition a replaced series fades out, so the two do not mingle
const REPLACED_FADE_RATE = 2.5;
// Approximate spacing between time axis ticks (px)
const TIME_TICK_SPACING = 110;
// Days between the ticks of a month, starting from the first of the month
const DAY_TICK_STEPS: readonly number[] = [1, 2, 3, 5, 7, 14];
// Approximate spacing between time axis ticks labeling months, which are short (px)
const MONTH_TICK_SPACING = 64;
// Months between the ticks of a season or year, starting from its first month
const MONTH_TICK_STEPS: readonly number[] = [1, 2, 3, 6];

/**
 * Everything the graph shows at rest
 */
export interface TimeSeriesGraphFrame {
  // Intervals to draw, which may extend beyond the time shown
  grid: WindSpeedTimeSeriesGrid;
  // Time shown (ms since the epoch), end exclusive
  domain: [number, number];
  // Top of the wind speed axis (m/s)
  speedMax: number;
  visible: Record<WindSpeedStatistic, boolean>;
  colors: WindSpeedSeriesColors;
  // Size of the plot area (px)
  width: number;
  height: number;
}

/**
 * Paint servers and clip path defined alongside the graph, as url(#id) references
 */
export interface TimeSeriesGraphFills {
  water: string;
  deep: string;
  gust: string;
  clipPath: string;
}

export interface TimeSeriesGraph {
  // Shows a frame, transitioning from what is shown when animated
  update: (frame: TimeSeriesGraphFrame, animate: boolean) => void;
  destroy: () => void;
}

export const getTimeScale = (domain: [number, number], width: number) => (
  scaleUtc().domain(domain).range([0, width])
);

export const getSpeedScale = (speedMax: number, height: number) => (
  scaleLinear().domain([0, speedMax]).range([height, 0])
);

/**
 * Gets the time an interval of a grid is drawn at: its middle
 */
export const getIntervalCenter = (grid: WindSpeedTimeSeriesGrid, index: number): number => (
  grid.start + ((index + 0.5) * grid.interval)
);

export const formatTimeTick = (value: Date | NumberValue): string => {
  const time = moment.utc(value.valueOf());
  return ((time.hours() === 0) && (time.minutes() === 0))
    ? time.format('MMM D')
    : time.format('HH:mm');
};

// Longest time (days) whose ticks label days or hours rather than months
const MAX_DAY_TICK_DAYS = 31;

const getDays = (domain: [number, number]): number => Math.round((domain[1] - domain[0]) / DAY_MS);

/**
 * Gets the format of the labels of the time axis: months when showing a season or year, labeled
 * with the year at the start and in January, otherwise days and hours
 * @param domain Time shown (ms since the epoch), end exclusive
 */
export const getTimeTickFormat = (
  domain: [number, number],
): (value: Date | NumberValue) => string => {
  if (getDays(domain) <= MAX_DAY_TICK_DAYS) {
    return formatTimeTick;
  }
  return (value: Date | NumberValue): string => {
    const time = moment.utc(value.valueOf());
    return ((time.month() === 0) || (value.valueOf() <= domain[0]))
      ? time.format('MMM YYYY')
      : time.format('MMM');
  };
};

/**
 * Gets the times to label on the time axis: the first of each month (or every few months) when
 * showing a season or year, days from the first of the month when showing a month, otherwise round
 * hours
 * @param domain Time shown (ms since the epoch), end exclusive
 * @param width Width the time is shown across (px)
 */
export const getTimeTicks = (domain: [number, number], width: number): Date[] => {
  const days = getDays(domain);
  if (days > MAX_DAY_TICK_DAYS) {
    const start = new Date(domain[0]);
    const monthStarts: Date[] = [];
    for (let month = 0; ; month += 1) {
      const monthStart = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + month, 1));
      if (monthStart.getTime() >= domain[1]) {
        break;
      }
      monthStarts.push(monthStart);
    }
    const monthCount = Math.max(Math.floor(width / MONTH_TICK_SPACING), 2);
    const monthStep = MONTH_TICK_STEPS.find((monthsPerTick: number): boolean => (
      Math.ceil(monthStarts.length / monthsPerTick) <= monthCount
    )) || MONTH_TICK_STEPS[MONTH_TICK_STEPS.length - 1];
    return monthStarts.filter((monthStart: Date, index: number) => (index % monthStep) === 0);
  }
  const count = Math.max(Math.floor(width / TIME_TICK_SPACING), 2);
  if (days <= 1) {
    // The end of the day is the start of the next, so is not labeled
    return getTimeScale(domain, width).ticks(count)
      .filter((tick: Date): boolean => tick.getTime() < domain[1]);
  }
  const step = DAY_TICK_STEPS.find((daysPerTick: number): boolean => (
    Math.ceil(days / daysPerTick) <= count
  )) || DAY_TICK_STEPS[DAY_TICK_STEPS.length - 1];
  return Array.from({ length: Math.ceil(days / step) }, (value: unknown, index: number) => (
    new Date(domain[0] + (index * step * DAY_MS))
  ));
};

type PathKey = 'gust' | 'water' | 'deep' | 'glow' | 'maxLine' | 'minHalo' | 'minLine' | 'meanLine';

interface PathSpec {
  key: PathKey;
  // Statistic the path is shown and hidden with
  statistic: WindSpeedStatistic;
  // Opacity of the path when shown
  opacity: number;
}

// Paths of a series layer, from the back to the front
const PATHS: readonly PathSpec[] = [
  // Gust envelope between the mean and the maximum
  { key: 'gust', statistic: 'max', opacity: 1 },
  // Water below the mean
  { key: 'water', statistic: 'mean', opacity: 1 },
  // Deeper water below the minimum
  { key: 'deep', statistic: 'min', opacity: 1 },
  // Soft glow along the surface of the water
  { key: 'glow', statistic: 'mean', opacity: 0.16 },
  { key: 'maxLine', statistic: 'max', opacity: 1 },
  // Lifts the minimum off the water it is drawn within
  { key: 'minHalo', statistic: 'min', opacity: 0.8 },
  { key: 'minLine', statistic: 'min', opacity: 1 },
  { key: 'meanLine', statistic: 'mean', opacity: 1 },
];

type PathSelection = Selection<SVGPathElement, unknown, null, undefined>;

// A transition other selections can follow the timing of
type TimingTransition = Transition<BaseType, unknown, null, undefined>;

// Wind speeds of a grid with NaN where there are none, so they can be interpolated
interface LayerValues {
  start: number;
  interval: number;
  length: number;
  values: Record<WindSpeedStatistic, Float64Array>;
}

// A drawing of a grid of wind speeds, transitioning from one set of values and opacities to another
interface Layer {
  group: Selection<SVGGElement, unknown, null, undefined>;
  paths: Record<PathKey, PathSelection>;
  from: LayerValues;
  to: LayerValues;
  opacity: [number, number];
  fadeRate: number;
  statisticOpacity: Record<WindSpeedStatistic, [number, number]>;
}

// Maps a value to px as scale * value + offset. Interpolating the coefficients moves every
// position linearly, as d3-axis transitions ticks, so the series and axes move together.
interface Affine {
  scale: number;
  offset: number;
}

type TransitionMode = 'none' | 'morph' | 'zoom' | 'rise';

// Exact at either end, so a finished transition shows exactly what it transitioned to
const lerp = (from: number, to: number, t: number): number => (
  (t >= 1) ? to : (from + ((to - from) * t))
);

const lerpAffine = (from: Affine, to: Affine, t: number): Affine => ({
  scale: lerp(from.scale, to.scale, t),
  offset: lerp(from.offset, to.offset, t),
});

const getTimeAffine = (domain: [number, number], width: number): Affine => {
  const scale = width / (domain[1] - domain[0]);
  return { scale, offset: -scale * domain[0] };
};

const getSpeedAffine = (speedMax: number, height: number): Affine => ({
  scale: -height / speedMax,
  offset: height,
});

// Intervals without observations rise from, and fall to, the baseline
const interpolateValue = (from: number, to: number, t: number): number => {
  if (Number.isNaN(to)) {
    return Number.isNaN(from) ? Number.NaN : lerp(from, 0, t);
  }
  return lerp(Number.isNaN(from) ? 0 : from, to, t);
};

const mapStatistics = (
  getValues: (statistic: WindSpeedStatistic) => Float64Array,
): Record<WindSpeedStatistic, Float64Array> => ({
  max: getValues('max'),
  mean: getValues('mean'),
  min: getValues('min'),
});

const toLayerValues = (grid: WindSpeedTimeSeriesGrid): LayerValues => {
  const { length } = grid.points;
  return {
    start: grid.start,
    interval: grid.interval,
    length,
    values: mapStatistics((statistic: WindSpeedStatistic): Float64Array => (
      Float64Array.from(grid.points, (point): number => {
        const value = point ? point[statistic] : null;
        return (typeof value === 'number') ? value : Number.NaN;
      })
    )),
  };
};

const getEmptyLayerValues = (shape: LayerValues): LayerValues => ({
  ...shape,
  values: mapStatistics(() => new Float64Array(shape.length).fill(Number.NaN)),
});

const isSameShape = (a: LayerValues, b: LayerValues): boolean => (
  (a.start === b.start) && (a.interval === b.interval) && (a.length === b.length)
);

const overlaps = (a: [number, number], b: [number, number]): boolean => (
  (a[0] < b[1]) && (b[0] < a[1])
);

const getLayerOpacity = (layer: Layer, t: number): number => (
  lerp(layer.opacity[0], layer.opacity[1], Math.min(t * layer.fadeRate, 1))
);

const getStatisticOpacities = (
  layer: Layer,
  t: number,
): Record<WindSpeedStatistic, number> => ({
  max: lerp(layer.statisticOpacity.max[0], layer.statisticOpacity.max[1], t),
  mean: lerp(layer.statisticOpacity.mean[0], layer.statisticOpacity.mean[1], t),
  min: lerp(layer.statisticOpacity.min[0], layer.statisticOpacity.min[1], t),
});

const getVisibleOpacities = (
  visible: Record<WindSpeedStatistic, boolean>,
): Record<WindSpeedStatistic, number> => ({
  max: visible.max ? 1 : 0,
  mean: visible.mean ? 1 : 0,
  min: visible.min ? 1 : 0,
});

/**
 * Draws a wind speed time series as water: the mean fills the chart below it, the maximum is
 * drawn above with a gust envelope reaching down to the mean, and the minimum is drawn within the
 * water with deeper water below it. Changes to what is shown transition smoothly: moving through
 * time pans and zooms, changes to the observations morph in place, and new months rise from the
 * baseline.
 * @param rootElement Group to draw the plot area into, offset to the plot area origin
 * @param fills Paint servers and clip path to draw with
 */
export const createTimeSeriesGraph = (
  rootElement: SVGGElement,
  fills: TimeSeriesGraphFills,
): TimeSeriesGraph => {
  const root = select(rootElement);
  const gridGroup = root.append('g').attr('class', TIME_SERIES_GRAPH_CLASS_NAMES.grid);
  const layersGroup = root.append('g').attr('clip-path', fills.clipPath);
  const timeAxisGroup = root.append('g').attr('class', TIME_SERIES_GRAPH_CLASS_NAMES.timeAxis);
  const speedAxisGroup = root.append('g').attr('class', TIME_SERIES_GRAPH_CLASS_NAMES.speedAxis);

  let frame: Nullable<TimeSeriesGraphFrame> = null;
  let layers: Layer[] = [];
  let time: [Affine, Affine] = [{ scale: 1, offset: 0 }, { scale: 1, offset: 0 }];
  let speed: [Affine, Affine] = [{ scale: -1, offset: 0 }, { scale: -1, offset: 0 }];
  // Eased progress of the current transition, 1 when at rest
  let progress = 1;

  const applyColors = (layer: Layer, colors: WindSpeedSeriesColors, animate: boolean): void => {
    const strokes: [PathKey, string][] = [
      ['glow', colors.mean],
      ['maxLine', colors.max],
      ['minLine', colors.min],
      ['meanLine', colors.mean],
    ];
    strokes.forEach(([key, color]: [PathKey, string]): void => {
      if (animate) {
        layer.paths[key].transition(COLOR_TRANSITION_NAME)
          .duration(COLOR_TRANSITION_DURATION_MS)
          .attr('stroke', color);
      } else {
        layer.paths[key].attr('stroke', color);
      }
    });
  };

  const createLayer = (
    from: LayerValues,
    to: LayerValues,
    opacity: [number, number],
    fadeRate: number,
    statisticOpacity: Record<WindSpeedStatistic, [number, number]>,
    colors: WindSpeedSeriesColors,
  ): Layer => {
    const group = layersGroup.append('g');
    const paths = {} as Record<PathKey, PathSelection>;
    PATHS.forEach(({ key }: PathSpec): void => {
      paths[key] = group.append('path').attr('data-path', key);
    });
    paths.gust.attr('fill', fills.gust);
    paths.water.attr('fill', fills.water);
    paths.deep.attr('fill', fills.deep);
    const strokeWidths: [PathKey, number][] = [
      ['glow', 6],
      // Thinner than the mean, so the gusts do not overwhelm the water
      ['maxLine', 1.25],
      ['minHalo', 4],
      ['minLine', 1.5],
      ['meanLine', 2],
    ];
    strokeWidths.forEach(([key, strokeWidth]: [PathKey, number]): void => {
      paths[key]
        .attr('fill', 'none')
        .attr('stroke-width', strokeWidth)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round');
    });
    paths.minHalo.attr('stroke', '#fff');
    const layer: Layer = {
      group,
      paths,
      from,
      to,
      opacity,
      fadeRate,
      statisticOpacity,
    };
    applyColors(layer, colors, false);
    return layer;
  };

  const drawLayer = (layer: Layer, width: number, t: number): void => {
    const layerOpacity = getLayerOpacity(layer, t);
    layer.group
      .attr('opacity', layerOpacity)
      .attr('display', (layerOpacity > 0) ? null : 'none');
    if (layerOpacity <= 0) {
      return;
    }
    const timeAffine = lerpAffine(time[0], time[1], t);
    const speedAffine = lerpAffine(speed[0], speed[1], t);
    const { start, interval, length } = layer.to;
    // Draw the intervals in view, and two either side so curves enter and leave it smoothly
    const viewStart = -timeAffine.offset / timeAffine.scale;
    const viewEnd = (width - timeAffine.offset) / timeAffine.scale;
    const first = Math.max(Math.floor((viewStart - start) / interval) - 2, 0);
    const last = Math.min(Math.ceil((viewEnd - start) / interval) + 2, length - 1);
    const count = Math.max(last - first + 1, 0);
    const positions = Array.from({ length: count }, (value: unknown, i: number): number => i);
    const xs = positions.map((i: number): number => (
      (timeAffine.scale * (start + ((first + i + 0.5) * interval))) + timeAffine.offset
    ));
    const current = mapStatistics((statistic: WindSpeedStatistic): Float64Array => {
      const from = layer.from.values[statistic];
      const to = layer.to.values[statistic];
      return Float64Array.from(positions, (i: number): number => (
        (t >= 1) ? to[first + i] : interpolateValue(from[first + i], to[first + i], t)
      ));
    });
    const toY = (value: number): number => (speedAffine.scale * value) + speedAffine.offset;
    const baseline = speedAffine.offset;
    const getX = (i: number): number => xs[i];
    const hasMean = (i: number): boolean => !Number.isNaN(current.mean[i]);
    const hasMin = (i: number): boolean => !Number.isNaN(current.min[i]);
    const hasMax = (i: number): boolean => !Number.isNaN(current.max[i]);
    const drawArea = (
      statistic: WindSpeedStatistic,
      getBottom: (i: number) => number,
      isDefined: (i: number) => boolean,
    ): string | null => (
      area<number>()
        .curve(curveMonotoneX)
        .defined(isDefined)
        .x(getX)
        .y0(getBottom)
        .y1((i: number): number => toY(current[statistic][i]))(positions)
    );
    const lines: Partial<Record<WindSpeedStatistic, string | null>> = {};
    const getLine = (statistic: WindSpeedStatistic): string | null => {
      if (!(statistic in lines)) {
        lines[statistic] = line<number>()
          .curve(curveMonotoneX)
          .defined((i: number): boolean => !Number.isNaN(current[statistic][i]))
          .x(getX)
          .y((i: number): number => toY(current[statistic][i]))(positions);
      }
      return lines[statistic] ?? null;
    };
    const getPath = (key: PathKey): string | null => {
      switch (key) {
        case 'gust':
          return drawArea(
            'max',
            (i: number): number => toY(current.mean[i]),
            (i: number): boolean => hasMean(i) && hasMax(i),
          );
        case 'water':
          return drawArea('mean', () => baseline, hasMean);
        case 'deep':
          return drawArea('min', () => baseline, hasMin);
        case 'glow':
        case 'meanLine':
          return getLine('mean');
        case 'minHalo':
        case 'minLine':
          return getLine('min');
        case 'maxLine':
          return getLine('max');
        default:
          return null;
      }
    };
    const statisticOpacities = getStatisticOpacities(layer, t);
    PATHS.forEach(({ key, statistic, opacity }: PathSpec): void => {
      const pathOpacity = opacity * statisticOpacities[statistic];
      const path = layer.paths[key];
      if (pathOpacity <= 0) {
        path.attr('display', 'none').attr('d', null);
        return;
      }
      path
        .attr('display', null)
        .attr('opacity', pathOpacity)
        .attr('d', getPath(key));
    });
  };

  const draw = (t: number): void => {
    progress = t;
    if (!frame) {
      return;
    }
    const { width } = frame;
    layers.forEach((layer: Layer): void => drawLayer(layer, width, t));
  };

  const removeLayer = (layer: Layer): void => {
    layer.group.selectAll('path').interrupt(COLOR_TRANSITION_NAME);
    layer.group.remove();
  };

  // Makes what is shown now, part way through a transition or not, the start of the next
  const settle = (): void => {
    const t = progress;
    const timeNow = lerpAffine(time[0], time[1], t);
    const speedNow = lerpAffine(speed[0], speed[1], t);
    time = [timeNow, timeNow];
    speed = [speedNow, speedNow];
    layers = layers.filter((layer: Layer): boolean => {
      const opacityNow = getLayerOpacity(layer, t);
      if (opacityNow <= 0) {
        removeLayer(layer);
        return false;
      }
      const statisticOpacities = getStatisticOpacities(layer, t);
      const values: LayerValues = (t >= 1) ? layer.to : {
        ...layer.to,
        values: mapStatistics((statistic: WindSpeedStatistic): Float64Array => (
          layer.to.values[statistic].map((to: number, index: number): number => (
            interpolateValue(layer.from.values[statistic][index], to, t)
          ))
        )),
      };
      /* eslint-disable no-param-reassign */
      layer.from = values;
      layer.to = values;
      layer.opacity = [opacityNow, opacityNow];
      layer.fadeRate = 1;
      layer.statisticOpacity = {
        max: [statisticOpacities.max, statisticOpacities.max],
        mean: [statisticOpacities.mean, statisticOpacities.mean],
        min: [statisticOpacities.min, statisticOpacities.min],
      };
      /* eslint-enable no-param-reassign */
      return true;
    });
    progress = 1;
  };

  const renderAxes = (transition: Nullable<TimingTransition>, animateTime: boolean): void => {
    if (!frame) {
      return;
    }
    const {
      domain,
      speedMax,
      width,
      height,
    } = frame;
    const timeScale = getTimeScale(domain, width);
    const speedScale = getSpeedScale(speedMax, height);
    const timeAxis = axisBottom(timeScale)
      .tickValues(getTimeTicks(domain, width))
      .tickFormat(getTimeTickFormat(domain))
      .tickSizeInner(4)
      .tickSizeOuter(0)
      .tickPadding(6);
    const speedAxis = axisLeft(speedScale)
      .ticks(SPEED_TICK_COUNT)
      .tickSize(0)
      .tickPadding(8);
    const gridAxis = axisLeft(speedScale)
      .ticks(SPEED_TICK_COUNT)
      .tickSize(-width)
      .tickFormat(() => '');
    timeAxisGroup.attr('transform', `translate(0,${height})`);
    if (transition && animateTime) {
      timeAxisGroup.transition(transition).call(timeAxis);
    } else {
      timeAxisGroup.call(timeAxis);
    }
    if (transition) {
      speedAxisGroup.transition(transition).call(speedAxis);
      gridGroup.transition(transition).call(gridAxis);
    } else {
      speedAxisGroup.call(speedAxis);
      gridGroup.call(gridAxis);
    }
  };

  const interruptAll = (): void => {
    root.interrupt(TRANSITION_NAME);
    root.selectAll('*').interrupt(TRANSITION_NAME);
  };

  const update = (nextFrame: TimeSeriesGraphFrame, animate: boolean): void => {
    const previousFrame = frame;
    interruptAll();
    settle();
    frame = nextFrame;
    const target = toLayerValues(nextFrame.grid);
    const timeTarget = getTimeAffine(nextFrame.domain, nextFrame.width);
    const speedTarget = getSpeedAffine(nextFrame.speedMax, nextFrame.height);
    const visibleOpacities = getVisibleOpacities(nextFrame.visible);
    const isResized = !!previousFrame && ((previousFrame.width !== nextFrame.width)
      || (previousFrame.height !== nextFrame.height));
    const primary = (layers.length > 0) ? layers[layers.length - 1] : null;
    let mode: TransitionMode = 'rise';
    if (!animate || isResized) {
      mode = 'none';
    } else if (previousFrame && primary && isSameShape(primary.to, target)) {
      mode = 'morph';
    } else if (previousFrame && primary && overlaps(previousFrame.domain, nextFrame.domain)) {
      mode = 'zoom';
    }
    if (previousFrame && (previousFrame.colors !== nextFrame.colors)) {
      layers.forEach((layer: Layer): void => applyColors(layer, nextFrame.colors, animate));
    }
    const getStatisticOpacity = (
      layer: Nullable<Layer>,
    ): Record<WindSpeedStatistic, [number, number]> => ({
      max: [layer ? layer.statisticOpacity.max[0] : visibleOpacities.max, visibleOpacities.max],
      mean: [layer ? layer.statisticOpacity.mean[0] : visibleOpacities.mean, visibleOpacities.mean],
      min: [layer ? layer.statisticOpacity.min[0] : visibleOpacities.min, visibleOpacities.min],
    });
    const fadeOut = (fadeRate: number): void => {
      layers.forEach((layer: Layer): void => {
        /* eslint-disable no-param-reassign */
        layer.opacity = [layer.opacity[0], 0];
        layer.fadeRate = fadeRate;
        layer.statisticOpacity = getStatisticOpacity(layer);
        /* eslint-enable no-param-reassign */
      });
    };
    if (mode === 'none') {
      layers.forEach(removeLayer);
      layers = [
        createLayer(target, target, [1, 1], 1, getStatisticOpacity(null), nextFrame.colors),
      ];
      time = [timeTarget, timeTarget];
      speed = [speedTarget, speedTarget];
      draw(1);
      renderAxes(null, false);
      return;
    }
    if (mode === 'morph' && primary) {
      fadeOut(1);
      primary.to = target;
      primary.opacity = [primary.opacity[0], 1];
    } else if (mode === 'zoom') {
      fadeOut(1);
      layers.push(createLayer(
        target,
        target,
        [0, 1],
        1,
        getStatisticOpacity(null),
        nextFrame.colors,
      ));
    } else {
      fadeOut(REPLACED_FADE_RATE);
      layers.push(createLayer(
        getEmptyLayerValues(target),
        target,
        [1, 1],
        1,
        getStatisticOpacity(null),
        nextFrame.colors,
      ));
    }
    // A new month replaces what was shown rather than moving from it
    time = [(previousFrame && (mode !== 'rise')) ? time[0] : timeTarget, timeTarget];
    speed = [previousFrame ? speed[0] : speedTarget, speedTarget];
    progress = 0;
    const transition = root.transition(TRANSITION_NAME)
      .duration((mode === 'rise') ? RISE_DURATION_MS : TRANSITION_DURATION_MS);
    transition
      .tween('draw', () => draw)
      .on('end', () => {
        settle();
      });
    renderAxes(transition as unknown as TimingTransition, mode !== 'rise');
  };

  const destroy = (): void => {
    interruptAll();
    layers.forEach(removeLayer);
    layers = [];
    root.selectAll('*').remove();
    frame = null;
  };

  return { update, destroy };
};
