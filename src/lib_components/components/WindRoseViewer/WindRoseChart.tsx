import React, { useId, useMemo, useState } from 'react';

import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { getWindRosePalette, WindRoseColorScheme } from './colorSchemes';
import {
  DIRECTION_BIN_LOOKUP,
  DIRECTION_BINS,
  VELOCITY_BIN_LABELS,
  WindRoseAggregate,
} from './windRoseUtil';
import {
  buildSectors,
  formatCount,
  formatPercent,
  formatTickPercent,
  getArcPath,
  getMaxSectorPercent,
  getPercentTicks,
  getPolarPoint,
  getSectorAngles,
  WindRoseSector,
  WindRoseSegment,
} from './windRoseChartUtil';

import { COLORS } from '../Theme/Theme';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';
import { Nullable } from '../../types/core';

const VIEW_BOX_SIZE = 600;
const CENTER = VIEW_BOX_SIZE / 2;
const OUTER_RADIUS = 248;
const INNER_RADIUS = 14;
const DIRECTION_LABEL_RADIUS = OUTER_RADIUS + 26;
const SECTOR_PAD_DEGREES = 1.5;
// Ring labels are drawn along the boundary between the ENE and E sectors
const RING_LABEL_DEGREES = 78.75;
const MAX_LABELED_RINGS = 4;
const CARDINAL_DIRECTIONS = new Set(['N', 'E', 'S', 'W']);

const useStyles = makeStyles()((theme: NeonTheme) => ({
  svg: {
    display: 'block',
    width: '100%',
    height: 'auto',
    maxWidth: `${VIEW_BOX_SIZE}px`,
    margin: '0 auto',
    overflow: 'visible',
    fontFamily: theme.typography.fontFamily,
  },
  spoke: {
    stroke: COLORS.GREY[100],
    strokeWidth: 1,
  },
  ring: {
    fill: 'none',
    stroke: COLORS.GREY[200],
    strokeWidth: 1,
    strokeDasharray: '3 4',
  },
  outerRing: {
    fill: 'none',
    stroke: COLORS.GREY[300],
    strokeWidth: 1,
  },
  innerCircle: {
    fill: '#fff',
    stroke: COLORS.GREY[300],
    strokeWidth: 1,
  },
  sector: {
    transition: 'opacity 150ms ease-in-out',
  },
  sectorDimmed: {
    opacity: 0.3,
  },
  segment: {
    stroke: '#fff',
    strokeWidth: 0.75,
    strokeLinejoin: 'round',
  },
  // Outlines each sector so the palest wind speed bins stand out from the background
  sectorOutline: {
    fill: 'none',
    stroke: COLORS.GREY[300],
    strokeWidth: 0.75,
    strokeLinejoin: 'round',
    pointerEvents: 'none',
  },
  ringLabel: {
    fontSize: '13px',
    fontWeight: 600,
    fill: COLORS.GREY[500],
    stroke: '#fff',
    strokeWidth: 4,
    strokeLinejoin: 'round',
    paintOrder: 'stroke',
  },
  directionLabel: {
    fontSize: '14px',
    fill: COLORS.GREY[400],
  },
  cardinalLabel: {
    fontSize: '18px',
    fontWeight: 700,
    fill: COLORS.NEON_BLUE[700],
  },
  tooltipTitle: {
    fontWeight: 600,
  },
  tooltipTable: {
    borderCollapse: 'collapse',
    marginTop: theme.spacing(1),
    '& td': {
      padding: theme.spacing(0.25, 1, 0.25, 0),
      fontSize: '0.8125rem',
      whiteSpace: 'nowrap',
    },
  },
  tooltipSwatch: {
    display: 'block',
    width: '12px',
    height: '12px',
    borderRadius: '2px',
  },
  tooltipValue: {
    textAlign: 'right',
    fontVariantNumeric: 'tabular-nums',
  },
}));

interface SectorTooltipContentProps {
  sector: WindRoseSector;
  palette: readonly string[];
}

const SectorTooltipContent: React.FC<SectorTooltipContentProps> = (
  props: SectorTooltipContentProps,
): React.JSX.Element => {
  const { classes } = useStyles();
  const { sector, palette }: SectorTooltipContentProps = props;
  const segments = sector.segments.filter((segment: WindRoseSegment): boolean => (
    segment.count > 0
  ));
  return (
    <div>
      <Typography variant="subtitle2" component="div" className={classes.tooltipTitle}>
        {`${sector.direction} (${sector.degrees}°)`}
      </Typography>
      <Typography variant="body2" component="div">
        {`${formatPercent(sector.percent)} of observations (${formatCount(sector.total)})`}
      </Typography>
      {(segments.length <= 0) ? null : (
        <table className={classes.tooltipTable}>
          <tbody>
            {segments.map((segment: WindRoseSegment): React.JSX.Element => (
              <tr key={segment.velocityBin}>
                <td>
                  <span
                    className={classes.tooltipSwatch}
                    style={{ backgroundColor: palette[segment.velocityIndex] }}
                  />
                </td>
                <td>{`${VELOCITY_BIN_LABELS[segment.velocityBin]} m/s`}</td>
                <td className={classes.tooltipValue}>{formatPercent(segment.percent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export interface WindRoseChartProps {
  aggregate: Nullable<WindRoseAggregate>;
  colorScheme: WindRoseColorScheme;
  // Accessible title describing what the wind rose shows
  title: string;
}

const WindRoseChart: React.FC<WindRoseChartProps> = (
  props: WindRoseChartProps,
): React.JSX.Element => {
  const { classes, cx } = useStyles();
  const { aggregate, colorScheme, title }: WindRoseChartProps = props;
  const titleId = useId();
  const [activeAngle, setActiveAngle] = useState<Nullable<string>>(null);
  const palette = getWindRosePalette(colorScheme);
  const sectors = useMemo(() => buildSectors(aggregate), [aggregate]);
  const maxSectorPercent = getMaxSectorPercent(sectors);
  // Calm observations are not drawn, so a wind rose of only calm observations is empty
  const hasData = maxSectorPercent > 0;
  const ticks = getPercentTicks(maxSectorPercent);
  const maxTick = ticks[ticks.length - 1];
  const getRadius = (percent: number): number => (
    INNER_RADIUS + ((OUTER_RADIUS - INNER_RADIUS) * (percent / maxTick))
  );

  const renderSegment = (
    segment: WindRoseSegment,
    startAngle: number,
    endAngle: number,
  ): Nullable<React.JSX.Element> => {
    if (segment.count <= 0) {
      return null;
    }
    return (
      <path
        key={segment.velocityBin}
        className={classes.segment}
        fill={palette[segment.velocityIndex]}
        d={getArcPath({
          innerRadius: getRadius(segment.startPercent),
          outerRadius: getRadius(segment.endPercent),
          startAngle,
          endAngle,
        })}
      />
    );
  };

  const renderSector = (sector: WindRoseSector): Nullable<React.JSX.Element> => {
    if (sector.total <= 0) {
      return null;
    }
    const [startAngle, endAngle] = getSectorAngles(sector.degrees, SECTOR_PAD_DEGREES);
    const isDimmed = (activeAngle !== null) && (activeAngle !== sector.angle);
    return (
      <Tooltip
        key={sector.angle}
        followCursor
        disableInteractive
        title={<SectorTooltipContent sector={sector} palette={palette} />}
      >
        <g
          className={cx(classes.sector, isDimmed && classes.sectorDimmed)}
          onMouseEnter={() => setActiveAngle(sector.angle)}
          onMouseLeave={() => setActiveAngle(null)}
        >
          {sector.segments.map((segment: WindRoseSegment) => (
            renderSegment(segment, startAngle, endAngle)
          ))}
          <path
            className={classes.sectorOutline}
            d={getArcPath({
              innerRadius: INNER_RADIUS,
              outerRadius: getRadius(sector.percent),
              startAngle,
              endAngle,
            })}
          />
        </g>
      </Tooltip>
    );
  };

  const [ringLabelX, ringLabelY] = getPolarPoint(1, RING_LABEL_DEGREES);
  return (
    <svg
      className={classes.svg}
      viewBox={`0 0 ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`}
      role="img"
      aria-labelledby={titleId}
    >
      <title id={titleId}>{title}</title>
      <g transform={`translate(${CENTER}, ${CENTER})`}>
        {DIRECTION_BINS.map((angle: string): React.JSX.Element => {
          const [x1, y1] = getPolarPoint(INNER_RADIUS, DIRECTION_BIN_LOOKUP[angle].angle);
          const [x2, y2] = getPolarPoint(OUTER_RADIUS, DIRECTION_BIN_LOOKUP[angle].angle);
          return (
            <line key={angle} className={classes.spoke} x1={x1} y1={y1} x2={x2} y2={y2} />
          );
        })}
        {ticks.map((tick: number): React.JSX.Element => (
          <circle
            key={tick}
            className={(tick === maxTick) ? classes.outerRing : classes.ring}
            r={getRadius(tick)}
          />
        ))}
        {sectors.map(renderSector)}
        <circle className={classes.innerCircle} r={INNER_RADIUS} />
        {!hasData ? null : ticks.map((tick: number, index: number): Nullable<React.JSX.Element> => {
          // Label every other ring, counting in from the outer ring, when there are many rings
          if ((ticks.length > MAX_LABELED_RINGS) && (((ticks.length - 1 - index) % 2) !== 0)) {
            return null;
          }
          return (
            <text
              key={tick}
              className={classes.ringLabel}
              x={ringLabelX * getRadius(tick)}
              y={ringLabelY * getRadius(tick)}
              dx={4}
              dy={-4}
            >
              {formatTickPercent(tick)}
            </text>
          );
        })}
        {DIRECTION_BINS.map((angle: string): React.JSX.Element => {
          const { direction, angle: degrees } = DIRECTION_BIN_LOOKUP[angle];
          const [x, y] = getPolarPoint(DIRECTION_LABEL_RADIUS, degrees);
          const isCardinal = CARDINAL_DIRECTIONS.has(direction);
          return (
            <text
              key={angle}
              className={cx(classes.directionLabel, isCardinal && classes.cardinalLabel)}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {direction}
            </text>
          );
        })}
      </g>
    </svg>
  );
};

export default WindRoseChart;
