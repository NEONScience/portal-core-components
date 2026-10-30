import moment from 'moment';
import { arc } from 'd3-shape';

import {
  DIRECTION_BIN_LOOKUP,
  DIRECTION_SECTOR_WIDTH,
  VELOCITY_BINS,
  WindRoseAggregate,
  WindRoseDirectionBin,
  WindRosePosition,
} from './windRoseUtil';
import { Nullable } from '../../types/core';

export const DAY_FORMAT = 'YYYY-MM-DD';
export const MONTH_FORMAT = 'YYYY-MM';

/**
 * A velocity bin segment of a wind rose sector
 */
export interface WindRoseSegment {
  velocityBin: string;
  velocityIndex: number;
  count: number;
  // Share of all observations in the wind rose, as a percentage
  percent: number;
  // Cumulative percentages at the inner and outer edges of the segment
  startPercent: number;
  endPercent: number;
}

/**
 * A direction sector of a wind rose, with segments stacked from the slowest velocity bin out
 */
export interface WindRoseSector {
  angle: string;
  degrees: number;
  direction: string;
  total: number;
  // Share of all observations in the wind rose, as a percentage
  percent: number;
  segments: WindRoseSegment[];
}

export interface ArcDatum {
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
}

export interface MiniRosePath {
  velocityBin: string;
  velocityIndex: number;
  d: string;
}

export interface MiniRose {
  // One path per velocity bin with observations, from the slowest bin out
  segments: MiniRosePath[];
  // Outline of every sector with observations
  outline: string;
}

const arcGenerator = arc<ArcDatum>();

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

const hasSamples = (aggregate: Nullable<WindRoseAggregate>): aggregate is WindRoseAggregate => (
  !!aggregate && (aggregate.samples > 0)
);

export const buildSectors = (aggregate: Nullable<WindRoseAggregate>): WindRoseSector[] => {
  if (!hasSamples(aggregate)) {
    return [];
  }
  const { samples } = aggregate;
  return aggregate.bins.map((bin: WindRoseDirectionBin): WindRoseSector => {
    let cumulative = 0;
    const segments = bin.counts.map((count: number, velocityIndex: number): WindRoseSegment => {
      const percent = (count / samples) * 100;
      const segment: WindRoseSegment = {
        velocityBin: VELOCITY_BINS[velocityIndex],
        velocityIndex,
        count,
        percent,
        startPercent: cumulative,
        endPercent: cumulative + percent,
      };
      cumulative += percent;
      return segment;
    });
    return {
      angle: bin.angle,
      degrees: DIRECTION_BIN_LOOKUP[bin.angle].angle,
      direction: DIRECTION_BIN_LOOKUP[bin.angle].direction,
      total: bin.total,
      percent: (bin.total / samples) * 100,
      segments,
    };
  });
};

export const getMaxSectorPercent = (sectors: WindRoseSector[]): number => (
  sectors.reduce((max: number, sector: WindRoseSector): number => Math.max(max, sector.percent), 0)
);

/**
 * Gets a round step (1, 2 or 5 times a power of ten) dividing 0 to max into about count steps
 */
const getTickStep = (max: number, count: number): number => {
  const step = max / count;
  const power = 10 ** Math.floor(Math.log10(step));
  const error = step / power;
  if (error >= Math.sqrt(50)) {
    return 10 * power;
  }
  if (error >= Math.sqrt(10)) {
    return 5 * power;
  }
  if (error >= Math.sqrt(2)) {
    return 2 * power;
  }
  return power;
};

/**
 * Gets round percentage ticks for the rings of a wind rose, the last tick being the outer ring
 * @param maxPercent The largest sector percentage to fit within the outer ring
 * @param count Approximate number of ticks
 */
export const getPercentTicks = (maxPercent: number, count = 4): number[] => {
  let max = (maxPercent > 0) ? maxPercent : 10;
  let step = getTickStep(max, count);
  // Extend the max to a whole step and repeat until the step is stable
  for (let i = 0; i < 10; i += 1) {
    max = Math.ceil(max / step) * step;
    const nextStep = getTickStep(max, count);
    if (nextStep === step) {
      break;
    }
    step = nextStep;
  }
  return Array.from({ length: Math.round(max / step) }, (value: unknown, index: number) => (
    Number(((index + 1) * step).toPrecision(12))
  ));
};

/**
 * Gets the start and end angles (radians clockwise from north) of a direction sector
 * @param degrees The direction the sector is centered on
 * @param padDegrees Gap to leave between adjacent sectors
 */
export const getSectorAngles = (degrees: number, padDegrees: number): [number, number] => [
  toRadians((degrees - (DIRECTION_SECTOR_WIDTH / 2)) + (padDegrees / 2)),
  toRadians((degrees + (DIRECTION_SECTOR_WIDTH / 2)) - (padDegrees / 2)),
];

export const getArcPath = (datum: ArcDatum): string => arcGenerator(datum) || '';

/**
 * Gets a point on a circle centered on the origin
 * @param radius Radius of the circle
 * @param degrees Compass direction, clockwise from north
 */
export const getPolarPoint = (radius: number, degrees: number): [number, number] => [
  radius * Math.sin(toRadians(degrees)),
  -1 * radius * Math.cos(toRadians(degrees)),
];

/**
 * Builds the paths of a thumbnail wind rose, one path per velocity bin, scaled so the
 * largest sector reaches the outer radius
 */
export const buildMiniRose = (
  aggregate: Nullable<WindRoseAggregate>,
  innerRadius: number,
  outerRadius: number,
  padDegrees: number,
): MiniRose => {
  const sectors = buildSectors(aggregate);
  const maxPercent = getMaxSectorPercent(sectors);
  if (maxPercent <= 0) {
    return { segments: [], outline: '' };
  }
  const getRadius = (percent: number): number => (
    innerRadius + ((outerRadius - innerRadius) * (percent / maxPercent))
  );
  const paths: string[] = VELOCITY_BINS.map((): string => '');
  let outline = '';
  sectors.forEach((sector: WindRoseSector): void => {
    if (sector.total <= 0) {
      return;
    }
    const [startAngle, endAngle] = getSectorAngles(sector.degrees, padDegrees);
    sector.segments.forEach((segment: WindRoseSegment): void => {
      if (segment.count <= 0) {
        return;
      }
      paths[segment.velocityIndex] += getArcPath({
        innerRadius: getRadius(segment.startPercent),
        outerRadius: getRadius(segment.endPercent),
        startAngle,
        endAngle,
      });
    });
    outline += getArcPath({
      innerRadius,
      outerRadius: getRadius(sector.percent),
      startAngle,
      endAngle,
    });
  });
  return {
    segments: paths
      .map((d: string, velocityIndex: number): MiniRosePath => ({
        velocityBin: VELOCITY_BINS[velocityIndex],
        velocityIndex,
        d,
      }))
      .filter((path: MiniRosePath): boolean => path.d.length > 0),
    outline,
  };
};

/**
 * Gets the sector the wind most frequently blew from, if any
 */
export const getPrevailingSector = (sectors: WindRoseSector[]): Nullable<WindRoseSector> => (
  sectors.reduce(
    (prevailing: Nullable<WindRoseSector>, sector: WindRoseSector): Nullable<WindRoseSector> => (
      ((sector.total > 0) && (!prevailing || (sector.total > prevailing.total)))
        ? sector
        : prevailing
    ),
    null,
  )
);

/**
 * Gets the share of calm observations, as a percentage of every observation
 */
export const getCalmPercent = (aggregate: Nullable<WindRoseAggregate>): number => (
  hasSamples(aggregate) ? ((aggregate.calm / aggregate.samples) * 100) : 0
);

/**
 * Gets the share of observations in each velocity bin, as percentages of every observation
 * (including calm observations) in VELOCITY_BINS order
 */
export const getVelocityBinPercents = (aggregate: Nullable<WindRoseAggregate>): number[] => (
  VELOCITY_BINS.map((velocityBin: string, velocityIndex: number): number => {
    if (!hasSamples(aggregate)) {
      return 0;
    }
    const count = aggregate.bins.reduce(
      (sum: number, bin: WindRoseDirectionBin): number => sum + bin.counts[velocityIndex],
      0,
    );
    return (count / aggregate.samples) * 100;
  })
);

const COUNT_FORMAT = new Intl.NumberFormat('en-US');

export const formatCount = (count: number): string => COUNT_FORMAT.format(count);

export const formatPercent = (percent: number): string => {
  if (percent <= 0) {
    return '0%';
  }
  if (percent < 0.1) {
    return '<0.1%';
  }
  return `${percent.toFixed(1)}%`;
};

/**
 * Formats a count as a percentage of a total, only rounding to 100% when the count is the total
 */
export const formatShare = (count: number, total: number): string => {
  if (total <= 0) {
    return '-';
  }
  if (count >= total) {
    return '100%';
  }
  return formatPercent(Math.min((count / total) * 100, 99.9));
};

export const formatTickPercent = (tick: number): string => `${Number(tick.toFixed(2))}%`;

export const formatSpeed = (speed: Nullable<number>): string => (
  ((speed === null) || (speed === undefined)) ? '-' : `${speed.toFixed(1)} m/s`
);

export const formatDay = (day: string, format = 'MMM D, YYYY'): string => (
  moment(day, DAY_FORMAT).format(format)
);

export const formatMonth = (month: string, format = 'MMMM YYYY'): string => (
  moment(month, MONTH_FORMAT).format(format)
);

/**
 * Formats a sensor position in NEON HOR.VER notation, e.g. 000.010
 */
export const formatPosition = (position: WindRosePosition): string => (
  `${position.horizontal}.${position.vertical}`
);
