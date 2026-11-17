import React, {
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import moment from 'moment';
import { keyframes } from 'tss-react';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { getWindSpeedSeriesColors, WindRoseColorScheme } from './colorSchemes';
import { formatCount, formatSpeed } from './windRoseChartUtil';
import { getDayKey } from './windRoseUtil';
import { getMonthKey } from './windRosePeriodUtil';
import {
  createTimeSeriesGraph,
  getIntervalCenter,
  getSpeedScale,
  getTimeScale,
  TIME_SERIES_GRAPH_CLASS_NAMES,
  TimeSeriesGraph,
  TimeSeriesGraphFills,
  TimeSeriesGraphFrame,
} from './windRoseTimeSeriesGraph';
import {
  aggregateTimeSeries,
  buildTimeSeriesGrid,
  DAY_MS,
  formatIntervalLength,
  getDayRange,
  getDisplayInterval,
  getMonthRange,
  getPeakPoint,
  getSpeedAxisMax,
  WIND_SPEED_STATISTIC_LABELS,
  WIND_SPEED_STATISTICS,
  WindSpeedStatistic,
  WindSpeedTimeSeries,
  WindSpeedTimeSeriesPoint,
} from './windRoseTimeSeriesUtil';

import { COLORS } from '../Theme/Theme';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';
import { Nullable } from '../../types/core';

const MARGIN = {
  top: 28,
  right: 16,
  bottom: 30,
  left: 44,
};
const PLOT_HEIGHT = 180;
const COMPACT_PLOT_HEIGHT = 140;
// Widest the time series is drawn compact at (px)
const COMPACT_WIDTH = 600;
// Width the time series is drawn at until its container is measured (px)
const DEFAULT_WIDTH = 800;
// Days in a month for paging through a season or year with the keyboard
const MONTH_DAYS = 30;
// Delay before the peak marker appears, so it appears once the series settle
const PEAK_DELAY_MS = 750;
// Distance between the peak marker and its label, and the approximate width of each character (px)
const PEAK_LABEL_OFFSET = 8;
const PEAK_LABEL_CHARACTER_WIDTH = 6.5;
// Distance between the crosshair and the tooltip (px)
const TOOLTIP_OFFSET = 12;

type ToggleableStatistic = 'min' | 'max';

const TOGGLEABLE_STATISTICS: readonly ToggleableStatistic[] = ['min', 'max'];

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const useStyles = makeStyles()((theme: NeonTheme) => ({
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1, 2),
    marginBottom: theme.spacing(1),
  },
  caption: {
    display: 'block',
    color: theme.palette.text.secondary,
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.spacing(1, 2),
  },
  meanKey: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontSize: '0.8125rem',
    fontWeight: 600,
  },
  waterSwatch: {
    display: 'block',
    width: '18px',
    height: '12px',
    borderTop: '2px solid',
    borderRadius: '1px',
  },
  statisticToggle: {
    margin: 0,
    '& .MuiFormControlLabel-label': {
      fontSize: '0.8125rem',
      fontWeight: 600,
      transition: 'color 150ms ease-in-out',
    },
  },
  statisticHidden: {
    '& .MuiFormControlLabel-label': {
      color: theme.palette.text.secondary,
    },
  },
  plot: {
    position: 'relative',
    borderRadius: '4px',
    // Leaves vertical swipes to scroll the page while horizontal swipes read the time series
    touchAction: 'pan-y',
    '&:focus': {
      outline: 'none',
    },
    '&:focus-visible': {
      outline: `2px dashed ${COLORS.GOLD[500]}`,
      outlineOffset: '2px',
    },
  },
  plotSelectable: {
    cursor: 'pointer',
  },
  svg: {
    display: 'block',
    overflow: 'visible',
    fontFamily: theme.typography.fontFamily,
    userSelect: 'none',
    '& text': {
      fontFamily: theme.typography.fontFamily,
    },
    [`& .${TIME_SERIES_GRAPH_CLASS_NAMES.grid}`]: {
      '& .domain, & text': {
        display: 'none',
      },
      '& line': {
        stroke: COLORS.GREY[100],
      },
    },
    [`& .${TIME_SERIES_GRAPH_CLASS_NAMES.timeAxis}`]: {
      '& .domain, & line': {
        stroke: COLORS.GREY[300],
      },
      '& text': {
        fontSize: '11px',
        fill: theme.palette.text.secondary,
      },
    },
    [`& .${TIME_SERIES_GRAPH_CLASS_NAMES.speedAxis}`]: {
      '& .domain': {
        display: 'none',
      },
      '& text': {
        fontSize: '11px',
        fill: theme.palette.text.secondary,
        fontVariantNumeric: 'tabular-nums',
      },
    },
  },
  stop: {
    transition: 'stop-color 400ms ease-in-out',
  },
  unit: {
    fontSize: '11px',
    fontWeight: 600,
    fill: theme.palette.text.secondary,
  },
  selectionBand: {
    fill: COLORS.LIGHT_BLUE[50],
  },
  crosshair: {
    stroke: COLORS.GREY[400],
    strokeWidth: 1,
    pointerEvents: 'none',
  },
  crosshairDot: {
    stroke: '#fff',
    strokeWidth: 2,
    pointerEvents: 'none',
  },
  peak: {
    pointerEvents: 'none',
    animation: `${fadeIn} 300ms ease-out ${PEAK_DELAY_MS}ms both`,
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
  peakDot: {
    stroke: '#fff',
    strokeWidth: 2,
    transition: 'fill 400ms ease-in-out',
  },
  peakLabel: {
    fontSize: '11px',
    fontWeight: 600,
    fill: COLORS.GREY[600],
    stroke: '#fff',
    strokeWidth: 4,
    strokeLinejoin: 'round',
    paintOrder: 'stroke',
  },
  tooltip: {
    position: 'absolute',
    zIndex: 1,
    pointerEvents: 'none',
    padding: theme.spacing(1, 1.5),
    whiteSpace: 'nowrap',
    color: 'rgba(0, 0, 0, 0.9)',
    backgroundColor: COLORS.GREY[50],
    border: `1px solid ${COLORS.GREY[600]}`,
    borderRadius: '2px',
    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, '
      + 'rgba(0, 0, 0, 0.12) 0px 1px 8px 0px',
  },
  tooltipTime: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: theme.palette.text.secondary,
  },
  tooltipTable: {
    borderCollapse: 'collapse',
    margin: theme.spacing(0.5, 0),
    '& td': {
      padding: theme.spacing(0.25, 1, 0.25, 0),
      fontSize: '0.8125rem',
    },
  },
  tooltipKey: {
    display: 'block',
    width: '12px',
    height: '3px',
    borderRadius: '2px',
  },
  tooltipValue: {
    textAlign: 'right',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  },
  tooltipLabel: {
    color: theme.palette.text.secondary,
  },
  tooltipNote: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
  },
  tooltipHint: {
    marginTop: theme.spacing(0.5),
    fontSize: '0.75rem',
    fontWeight: 600,
    color: COLORS.LIGHT_BLUE[600],
  },
  empty: {
    position: 'absolute',
    top: MARGIN.top,
    left: MARGIN.left,
    right: MARGIN.right,
    bottom: MARGIN.bottom,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    pointerEvents: 'none',
    color: theme.palette.text.secondary,
  },
  hint: {
    display: 'block',
    marginTop: theme.spacing(0.5),
    color: theme.palette.text.secondary,
  },
  visuallyHidden: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    margin: '-1px',
    padding: 0,
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
    border: 0,
  },
}));

const prefersReducedMotion = (): boolean => (
  (typeof window === 'undefined')
  || (typeof window.matchMedia !== 'function')
  || window.matchMedia('(prefers-reduced-motion: reduce)').matches
);

/**
 * Formats an interval of a time series, e.g. Sun, Jun 14, 13:00-14:00 UTC
 * @param start Start of the interval (ms since the epoch)
 * @param interval Length of the interval (ms)
 * @param includeYear Whether to include the year, as when the time series spans months
 */
const formatInterval = (start: number, interval: number, includeYear: boolean): string => {
  const from = moment.utc(start);
  if (interval >= DAY_MS) {
    return from.format('ddd, MMM D, YYYY');
  }
  const to = moment.utc(start + interval);
  const end = ((to.hours() === 0) && (to.minutes() === 0)) ? '24:00' : to.format('HH:mm');
  return `${from.format(includeYear ? 'ddd, MMM D, YYYY, HH:mm' : 'ddd, MMM D, HH:mm')}-${end} UTC`;
};

const describePoint = (
  time: string,
  point: Nullable<WindSpeedTimeSeriesPoint>,
  statistics: readonly WindSpeedStatistic[],
): string => {
  if (!point) {
    return `${time}: no observations`;
  }
  const values = statistics.map((statistic: WindSpeedStatistic): string => (
    `${WIND_SPEED_STATISTIC_LABELS[statistic].toLowerCase()} ${formatSpeed(point[statistic])}`
  ));
  return `${time}: ${values.join(', ')}`;
};

// Order the statistics are described in, e.g. mean, minimum and maximum
const DESCRIPTION_ORDER: readonly WindSpeedStatistic[] = ['mean', 'min', 'max'];

const describeStatistics = (visible: Record<WindSpeedStatistic, boolean>): string => {
  const labels = DESCRIPTION_ORDER
    .filter((statistic: WindSpeedStatistic): boolean => visible[statistic])
    .map((statistic: WindSpeedStatistic): string => (
      WIND_SPEED_STATISTIC_LABELS[statistic].toLowerCase()
    ));
  return (labels.length > 1)
    ? `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`
    : labels.join('');
};

/**
 * Unit of time selected by selecting a time in the time series
 */
export type WindRoseTimeSeriesSelectionUnit = 'day' | 'month';

const getSelectionKey = (time: number, unit: WindRoseTimeSeriesSelectionUnit): string => (
  (unit === 'month') ? getMonthKey(time) : getDayKey(new Date(time))
);

const getSelectionRange = (
  key: string,
  unit: WindRoseTimeSeriesSelectionUnit,
): [number, number] => ((unit === 'month') ? getMonthRange(key) : getDayRange(key));

export interface WindRoseTimeSeriesProps {
  // Wind speed time series of the observations selected by the quality filter
  timeSeries: WindSpeedTimeSeries;
  // Start and end (ms since the epoch, end exclusive) of the time the time series is of: a month,
  // season or year
  rangeStart: number;
  rangeEnd: number;
  // Name of the time the time series is of in messages, e.g. month, season or year
  rangeName: string;
  // Day (YYYY-MM-DD) within the range to show, or null to show the whole range
  day: Nullable<string>;
  // What selecting a time in the whole range selects: the day or the month of the time
  selectionUnit: WindRoseTimeSeriesSelectionUnit;
  colorScheme: WindRoseColorScheme;
  // Accessible name describing what the time series shows
  title: string;
  // Whether observations are being fetched, while which the time series shown is kept
  isLoading: boolean;
  // Called with the day (YYYY-MM-DD) or month (YYYY-MM) selected from the whole range
  onSelect: (selection: string) => void;
}

/**
 * Mean, minimum and maximum wind speed over the time the wind rose shows. The mean is drawn as
 * water filling the chart, with the minimum and maximum optionally drawn within and above it.
 * Selecting a time in a month shows the wind rose of that day, and a time in a season or year the
 * wind rose of that month.
 */
const WindRoseTimeSeries: React.FC<WindRoseTimeSeriesProps> = (
  props: WindRoseTimeSeriesProps,
): React.JSX.Element => {
  const { classes, cx } = useStyles();
  const {
    timeSeries,
    rangeStart,
    rangeEnd,
    rangeName,
    day,
    selectionUnit,
    colorScheme,
    title,
    isLoading,
    onSelect,
  }: WindRoseTimeSeriesProps = props;
  const reactId = useId();
  const titleId = `${reactId}-title`;
  const descriptionId = `${reactId}-description`;
  // Paint server references cannot contain the characters React generates ids with
  const fillId = `windRoseTimeSeries-${reactId.replace(/[^\w-]/g, '')}`;
  const rootRef = useRef<SVGGElement>(null);
  const graphRef = useRef<Nullable<TimeSeriesGraph>>(null);
  const [measuredWidth, setMeasuredWidth] = useState<number>(0);
  const [shownStatistics, setShownStatistics] = useState<ToggleableStatistic[]>([
    ...TOGGLEABLE_STATISTICS,
  ]);
  const [activeTime, setActiveTime] = useState<number | null>(null);

  const plotRef = useCallback((element: Nullable<HTMLDivElement>) => {
    if (!element) {
      return undefined;
    }
    const measure = (): void => {
      setMeasuredWidth(Math.floor(element.getBoundingClientRect().width));
    };
    measure();
    if (typeof ResizeObserver !== 'function') {
      window.addEventListener('resize', measure);
      return () => {
        window.removeEventListener('resize', measure);
      };
    }
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(element);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const width = measuredWidth || DEFAULT_WIDTH;
  const plotWidth = Math.max(width - MARGIN.left - MARGIN.right, 1);
  const plotHeight = (width < COMPACT_WIDTH) ? COMPACT_PLOT_HEIGHT : PLOT_HEIGHT;
  const colors = getWindSpeedSeriesColors(colorScheme);
  const visible = useMemo((): Record<WindSpeedStatistic, boolean> => ({
    max: shownStatistics.includes('max'),
    mean: true,
    min: shownStatistics.includes('min'),
  }), [shownStatistics]);
  const visibleStatistics = useMemo(() => (
    WIND_SPEED_STATISTICS.filter((statistic: WindSpeedStatistic): boolean => visible[statistic])
  ), [visible]);
  const range = useMemo((): [number, number] => [rangeStart, rangeEnd], [rangeStart, rangeEnd]);
  const domain = useMemo((): [number, number] => (
    day ? getDayRange(day) : range
  ), [day, range]);
  const interval = getDisplayInterval(timeSeries.interval, domain[1] - domain[0], plotWidth);
  // The whole range is laid out when showing a day, so moving between days pans through it
  const grid = useMemo(() => buildTimeSeriesGrid(
    aggregateTimeSeries(timeSeries, interval),
    range[0],
    range[1],
  ), [timeSeries, interval, range]);
  // Intervals in the time shown
  const firstIndex = Math.max(Math.ceil((domain[0] - grid.start) / grid.interval), 0);
  const lastIndex = Math.min(
    Math.ceil((domain[1] - grid.start) / grid.interval),
    grid.points.length,
  ) - 1;
  const hasIntervals = lastIndex >= firstIndex;
  const shownPoints = useMemo(() => (
    hasIntervals ? grid.points.slice(firstIndex, lastIndex + 1) : []
  ), [grid, firstIndex, lastIndex, hasIntervals]);
  // Fit to the wind speeds shown, so they fill the chart
  const speedMax = useMemo(() => (
    getSpeedAxisMax(shownPoints, visibleStatistics)
  ), [shownPoints, visibleStatistics]);
  const frame = useMemo((): TimeSeriesGraphFrame => ({
    grid,
    domain,
    speedMax,
    visible,
    colors,
    width: plotWidth,
    height: plotHeight,
  }), [grid, domain, speedMax, visible, colors, plotWidth, plotHeight]);
  const fills = useMemo((): TimeSeriesGraphFills => ({
    water: `url(#${fillId}-water)`,
    deep: `url(#${fillId}-deep)`,
    gust: `url(#${fillId}-gust)`,
    clipPath: `url(#${fillId}-clip)`,
  }), [fillId]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return undefined;
    }
    const graph = createTimeSeriesGraph(root, fills);
    graphRef.current = graph;
    return () => {
      graph.destroy();
      graphRef.current = null;
    };
  }, [fills]);

  useLayoutEffect(() => {
    // Keeps showing the previous observations until the next are fetched
    if (isLoading || !graphRef.current) {
      return;
    }
    graphRef.current.update(frame, !prefersReducedMotion());
  }, [fills, frame, isLoading]);

  const timeScale = getTimeScale(domain, plotWidth);
  const speedScale = getSpeedScale(speedMax, plotHeight);
  const hasObservations = shownPoints.some((point) => !!point);
  // Days or months with observations can be selected from the whole range
  const selectionsWithObservations = useMemo(() => new Set(
    grid.points
      .filter((point): point is WindSpeedTimeSeriesPoint => !!point)
      .map((point: WindSpeedTimeSeriesPoint): string => getSelectionKey(point.time, selectionUnit)),
  ), [grid, selectionUnit]);
  const peakStatistic: WindSpeedStatistic = visible.max ? 'max' : 'mean';
  const peak = useMemo(() => (
    getPeakPoint(shownPoints, peakStatistic)
  ), [shownPoints, peakStatistic]);
  const peakValue = peak ? peak[peakStatistic] : null;

  const getIndexAt = (time: number): number | null => {
    if (!hasIntervals) {
      return null;
    }
    const index = Math.floor((time - grid.start) / grid.interval);
    return Math.min(Math.max(index, firstIndex), lastIndex);
  };
  const getSelectable = (index: number | null): Nullable<string> => {
    if (day || (index === null)) {
      return null;
    }
    const selection = getSelectionKey(getIntervalCenter(grid, index), selectionUnit);
    return selectionsWithObservations.has(selection) ? selection : null;
  };
  const activeIndex = (activeTime === null) ? null : getIndexAt(activeTime);
  const activePoint = (activeIndex === null) ? null : grid.points[activeIndex];
  const activeX = (activeIndex === null)
    ? null
    : timeScale(getIntervalCenter(grid, activeIndex));
  const activeSelection = getSelectable(activeIndex);
  const activeTimeLabel = (activeIndex === null) ? null : formatInterval(
    grid.start + (activeIndex * grid.interval),
    grid.interval,
    // Seasons and years span months, and winter spans years
    (range[1] - range[0]) > (MONTH_DAYS * 2 * DAY_MS),
  );
  const activeDescription = (activeTimeLabel === null)
    ? null
    : describePoint(activeTimeLabel, activePoint, visibleStatistics);

  const getTimeAt = (clientX: number, element: HTMLElement): number => {
    const { left } = element.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - left - MARGIN.left, 0), plotWidth);
    return timeScale.invert(x).getTime();
  };
  const selectAt = (index: number | null): void => {
    const selection = getSelectable(index);
    if (selection) {
      onSelect(selection);
    }
  };
  const toggleStatistic = (statistic: ToggleableStatistic, isShown: boolean): void => {
    setShownStatistics((shown: ToggleableStatistic[]) => (
      TOGGLEABLE_STATISTICS.filter((toggleable: ToggleableStatistic): boolean => (
        (toggleable === statistic) ? isShown : shown.includes(toggleable)
      ))
    ));
  };
  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    const time = getTimeAt(event.clientX, event.currentTarget);
    setActiveTime(time);
    selectAt(getIndexAt(time));
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (!hasIntervals) {
      return;
    }
    // A page is three hours of a day, a day of a month, or a month of a season or year
    const span = domain[1] - domain[0];
    let pageTime = DAY_MS / 8;
    if (span > DAY_MS) {
      pageTime = (span > (MONTH_DAYS * DAY_MS)) ? (MONTH_DAYS * DAY_MS) : DAY_MS;
    }
    const pageSize = Math.max(Math.round(pageTime / grid.interval), 1);
    let index: number;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        index = (activeIndex === null) ? firstIndex : (activeIndex + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        index = (activeIndex === null) ? lastIndex : (activeIndex - 1);
        break;
      case 'PageUp':
        index = (activeIndex === null) ? firstIndex : (activeIndex + pageSize);
        break;
      case 'PageDown':
        index = (activeIndex === null) ? lastIndex : (activeIndex - pageSize);
        break;
      case 'Home':
        index = firstIndex;
        break;
      case 'End':
        index = lastIndex;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        selectAt(activeIndex);
        return;
      case 'Escape':
        setActiveTime(null);
        return;
      default:
        return;
    }
    event.preventDefault();
    setActiveTime(getIntervalCenter(grid, Math.min(Math.max(index, firstIndex), lastIndex)));
  };

  const peakDescription = (peak && (typeof peakValue === 'number'))
    ? `${visible.max ? 'Peak' : 'Highest mean'} ${formatSpeed(peakValue)} `
      + `on ${moment.utc(peak.time).format('MMM D, YYYY [at] HH:mm')} UTC.`
    : 'No wind speed observations.';
  const instructions = day
    ? 'Use the arrow keys to read the wind speed through the day.'
    : `Use the arrow keys to read the wind speed through the ${rangeName}, `
      + `and Enter to view the wind rose of a ${selectionUnit}.`;

  const renderPeak = (): Nullable<React.JSX.Element> => {
    if (!peak || (typeof peakValue !== 'number')) {
      return null;
    }
    const peakIndex = Math.round((peak.time - grid.start) / grid.interval);
    const x = timeScale(getIntervalCenter(grid, peakIndex));
    const label = `${visible.max ? 'Peak' : 'Highest mean'} ${formatSpeed(peakValue)}`;
    // Keeps the label within the plot, estimating its width from its length
    const isFlipped = (x + PEAK_LABEL_OFFSET + (label.length * PEAK_LABEL_CHARACTER_WIDTH))
      > plotWidth;
    return (
      <g
        // Remounting restarts the fade in, so the marker appears once the series settle
        key={[grid.start, grid.interval, domain[0], speedMax, peakStatistic, peak.time, peakValue]
          .join(':')}
        className={classes.peak}
        transform={`translate(${x},${speedScale(peakValue)})`}
      >
        <circle className={classes.peakDot} r={4} style={{ fill: colors[peakStatistic] }} />
        <text
          className={classes.peakLabel}
          x={isFlipped ? -PEAK_LABEL_OFFSET : PEAK_LABEL_OFFSET}
          y={-6}
          textAnchor={isFlipped ? 'end' : 'start'}
        >
          {label}
        </text>
      </g>
    );
  };

  const renderSelectionBand = (): Nullable<React.JSX.Element> => {
    if (!activeSelection) {
      return null;
    }
    const [selectionStart, selectionEnd] = getSelectionRange(activeSelection, selectionUnit);
    const x = Math.max(timeScale(selectionStart), 0);
    return (
      <rect
        className={classes.selectionBand}
        x={x}
        y={0}
        width={Math.max(Math.min(timeScale(selectionEnd), plotWidth) - x, 0)}
        height={plotHeight}
      />
    );
  };

  const renderCrosshair = (): Nullable<React.JSX.Element> => {
    if (activeX === null) {
      return null;
    }
    return (
      <g transform={`translate(${activeX},0)`}>
        <line className={classes.crosshair} y1={0} y2={plotHeight} />
        {!activePoint ? null : visibleStatistics.map((statistic: WindSpeedStatistic) => {
          const value = activePoint[statistic];
          if (typeof value !== 'number') {
            return null;
          }
          return (
            <circle
              key={statistic}
              className={classes.crosshairDot}
              cy={speedScale(value)}
              r={4}
              style={{ fill: colors[statistic] }}
            />
          );
        })}
      </g>
    );
  };

  const renderTooltip = (): Nullable<React.JSX.Element> => {
    if ((activeIndex === null) || (activeX === null)) {
      return null;
    }
    const isFlipped = activeX > (plotWidth / 2);
    return (
      <div
        className={classes.tooltip}
        aria-hidden="true"
        style={{
          left: MARGIN.left + activeX + (isFlipped ? -TOOLTIP_OFFSET : TOOLTIP_OFFSET),
          top: MARGIN.top,
          transform: isFlipped ? 'translateX(-100%)' : undefined,
        }}
      >
        <div className={classes.tooltipTime}>
          {activeTimeLabel}
        </div>
        {!activePoint ? (
          <div className={classes.tooltipNote}>No observations</div>
        ) : (
          <>
            <table className={classes.tooltipTable}>
              <tbody>
                {visibleStatistics.map((statistic: WindSpeedStatistic) => (
                  <tr key={statistic}>
                    <td>
                      <span
                        className={classes.tooltipKey}
                        style={{ backgroundColor: colors[statistic] }}
                      />
                    </td>
                    <td className={classes.tooltipValue}>{formatSpeed(activePoint[statistic])}</td>
                    <td className={classes.tooltipLabel}>
                      {WIND_SPEED_STATISTIC_LABELS[statistic]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={classes.tooltipNote}>
              {`${formatCount(activePoint.samples)} observations`}
            </div>
          </>
        )}
        {!activeSelection ? null : (
          <div className={classes.tooltipHint}>
            {`Select to view this ${selectionUnit}'s wind rose`}
          </div>
        )}
      </div>
    );
  };

  return (
    <section aria-labelledby={titleId}>
      <div className={classes.header}>
        <div>
          <Typography id={titleId} variant="subtitle2" component="h4">
            Wind speed over time
          </Typography>
          <Typography variant="caption" className={classes.caption}>
            {`${formatIntervalLength(grid.interval)} ${describeStatistics(visible)} `
              + 'wind speed (m/s), UTC'}
          </Typography>
        </div>
        <div className={classes.legend}>
          <span className={classes.meanKey}>
            <span
              className={classes.waterSwatch}
              style={{
                borderColor: colors.mean,
                background: `linear-gradient(${alpha(colors.mean, 0.4)}, `
                  + `${alpha(colors.mean, 0.08)})`,
              }}
            />
            {WIND_SPEED_STATISTIC_LABELS.mean}
          </span>
          <div role="group" aria-label="Wind speed statistics shown" className={classes.legend}>
            {TOGGLEABLE_STATISTICS.map((statistic: ToggleableStatistic) => {
              const isShown = visible[statistic];
              const color = colors[statistic];
              return (
                <FormControlLabel
                  key={statistic}
                  className={cx(classes.statisticToggle, !isShown && classes.statisticHidden)}
                  // Hidden statistics are left out of the legend of downloaded images
                  data-windrose-download-exclude={isShown ? undefined : 'true'}
                  label={WIND_SPEED_STATISTIC_LABELS[statistic]}
                  control={(
                    <Checkbox
                      checked={isShown}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                        toggleStatistic(statistic, checked);
                      }}
                      sx={{
                        color,
                        '&.Mui-checked': { color },
                        '&:hover': { backgroundColor: alpha(color, 0.08) },
                      }}
                    />
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div
        ref={plotRef}
        role="slider"
        tabIndex={0}
        aria-label={title}
        aria-describedby={descriptionId}
        aria-valuemin={firstIndex}
        aria-valuemax={Math.max(lastIndex, firstIndex)}
        aria-valuenow={activeIndex ?? firstIndex}
        aria-valuetext={activeDescription || 'No time selected'}
        className={cx(classes.plot, !!activeSelection && classes.plotSelectable)}
        onPointerMove={(event: React.PointerEvent<HTMLDivElement>) => {
          setActiveTime(getTimeAt(event.clientX, event.currentTarget));
        }}
        onPointerLeave={() => setActiveTime(null)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onBlur={() => setActiveTime(null)}
      >
        <svg
          className={classes.svg}
          width={width}
          height={plotHeight + MARGIN.top + MARGIN.bottom}
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient
              id={`${fillId}-water`}
              gradientUnits="userSpaceOnUse"
              x1={0}
              y1={0}
              x2={0}
              y2={plotHeight}
            >
              <stop
                className={classes.stop}
                offset={0}
                style={{ stopColor: colors.mean, stopOpacity: 0.5 }}
              />
              <stop
                className={classes.stop}
                offset={0.6}
                style={{ stopColor: colors.mean, stopOpacity: 0.26 }}
              />
              <stop
                className={classes.stop}
                offset={1}
                style={{ stopColor: colors.mean, stopOpacity: 0.1 }}
              />
            </linearGradient>
            <linearGradient
              id={`${fillId}-deep`}
              gradientUnits="userSpaceOnUse"
              x1={0}
              y1={0}
              x2={0}
              y2={plotHeight}
            >
              <stop
                className={classes.stop}
                offset={0}
                style={{ stopColor: colors.mean, stopOpacity: 0.3 }}
              />
              <stop
                className={classes.stop}
                offset={1}
                style={{ stopColor: colors.mean, stopOpacity: 0.14 }}
              />
            </linearGradient>
            <linearGradient
              id={`${fillId}-gust`}
              gradientUnits="userSpaceOnUse"
              x1={0}
              y1={0}
              x2={0}
              y2={plotHeight}
            >
              <stop
                className={classes.stop}
                offset={0}
                style={{ stopColor: colors.max, stopOpacity: 0.18 }}
              />
              <stop
                className={classes.stop}
                offset={1}
                style={{ stopColor: colors.max, stopOpacity: 0.03 }}
              />
            </linearGradient>
            <clipPath id={`${fillId}-clip`}>
              <rect x={0} y={-MARGIN.top} width={plotWidth} height={plotHeight + MARGIN.top + 2} />
            </clipPath>
          </defs>
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {renderSelectionBand()}
            <g ref={rootRef} />
            <text className={classes.unit} x={-8} y={-14} textAnchor="end">m/s</text>
            {renderPeak()}
            {renderCrosshair()}
          </g>
        </svg>
        {renderTooltip()}
        {(hasObservations || isLoading) ? null : (
          <Typography variant="body2" className={classes.empty}>
            {`No wind speed observations to show for this ${day ? 'day' : rangeName}.`}
          </Typography>
        )}
      </div>
      <span id={descriptionId} className={classes.visuallyHidden}>
        {`${peakDescription} ${instructions}`}
      </span>
      {(day || !hasObservations) ? null : (
        <Typography variant="caption" className={classes.hint}>
          {`Select a time to view the wind rose of that ${selectionUnit}.`}
        </Typography>
      )}
    </section>
  );
};

export default WindRoseTimeSeries;
