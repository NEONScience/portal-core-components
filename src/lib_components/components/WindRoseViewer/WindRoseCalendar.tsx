import React, { useId, useMemo } from 'react';

import moment from 'moment';

import ButtonBase from '@mui/material/ButtonBase';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import {
  ActionCreator,
  useDispatchContext,
  useStateContext,
  WindRoseAggregation,
  WindRoseViewerState,
} from './Context';
import { getWindRosePalette, WindRoseColorScheme } from './colorSchemes';
import { stepDay, WindRoseAggregate } from './windRoseUtil';
import {
  buildMiniRose,
  buildSectors,
  DAY_FORMAT,
  formatCount,
  formatDay,
  formatMonth,
  formatSpeed,
  getPrevailingSector,
  MiniRosePath,
  MONTH_FORMAT,
} from './windRoseChartUtil';

import { COLORS } from '../Theme/Theme';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';
import { Nullable } from '../../types/core';

const MINI_ROSE_RADIUS = 19;
const MINI_ROSE_INNER_RADIUS = 1.5;
const MINI_ROSE_PAD_DEGREES = 3;

const useStyles = makeStyles()((theme: NeonTheme) => ({
  header: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  weekdays: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    gap: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  weekday: {
    textAlign: 'center',
    fontSize: '0.6875rem',
    fontWeight: 600,
    color: theme.palette.text.secondary,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    gap: theme.spacing(0.5),
  },
  day: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 0,
    padding: '2px 2px 4px 2px',
    border: `1px solid ${COLORS.GREY[100]}`,
    borderRadius: '4px',
    backgroundColor: '#fff',
  },
  dayButton: {
    fontSize: 'inherit',
    letterSpacing: 'normal',
    transition: 'background-color 150ms ease-in-out, border-color 150ms ease-in-out',
    '&:hover': {
      borderColor: COLORS.LIGHT_BLUE[300],
      backgroundColor: COLORS.LIGHT_BLUE[50],
    },
    '&.Mui-focusVisible': {
      outline: `2px dashed ${COLORS.GOLD[500]}`,
      outlineOffset: '1px',
    },
  },
  daySelected: {
    borderColor: COLORS.LIGHT_BLUE[500],
    boxShadow: `inset 0 0 0 1px ${COLORS.LIGHT_BLUE[500]}`,
    backgroundColor: COLORS.LIGHT_BLUE[50],
  },
  dayEmpty: {
    backgroundColor: COLORS.GREY[50],
    borderStyle: 'dashed',
  },
  dayNumber: {
    alignSelf: 'flex-start',
    paddingLeft: '2px',
    fontSize: '0.6875rem',
    fontWeight: 600,
    lineHeight: 1.3,
    color: theme.palette.text.secondary,
  },
  dayNumberSelected: {
    color: COLORS.LIGHT_BLUE[600],
  },
  dayNumberEmpty: {
    color: COLORS.GREY[300],
  },
  miniRose: {
    display: 'block',
    width: '100%',
    maxWidth: '44px',
    height: 'auto',
    aspectRatio: '1 / 1',
  },
  miniRoseRing: {
    fill: 'none',
    stroke: COLORS.GREY[200],
    strokeWidth: 0.75,
  },
  miniRoseOutline: {
    fill: 'none',
    stroke: COLORS.GREY[300],
    strokeWidth: 0.5,
    strokeLinejoin: 'round',
  },
  hint: {
    display: 'block',
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
}));

interface MiniWindRoseProps {
  aggregate: WindRoseAggregate;
  palette: readonly string[];
}

const MiniWindRoseBase: React.FC<MiniWindRoseProps> = (
  props: MiniWindRoseProps,
): React.JSX.Element => {
  const { classes } = useStyles();
  const { aggregate, palette }: MiniWindRoseProps = props;
  const miniRose = useMemo(() => buildMiniRose(
    aggregate,
    MINI_ROSE_INNER_RADIUS,
    MINI_ROSE_RADIUS,
    MINI_ROSE_PAD_DEGREES,
  ), [aggregate]);
  const viewBoxSize = (MINI_ROSE_RADIUS + 1) * 2;
  return (
    <svg
      className={classes.miniRose}
      viewBox={`${-viewBoxSize / 2} ${-viewBoxSize / 2} ${viewBoxSize} ${viewBoxSize}`}
      aria-hidden="true"
      focusable="false"
    >
      <circle className={classes.miniRoseRing} r={MINI_ROSE_RADIUS} />
      {miniRose.segments.map((path: MiniRosePath): React.JSX.Element => (
        <path key={path.velocityBin} d={path.d} fill={palette[path.velocityIndex]} />
      ))}
      <path className={classes.miniRoseOutline} d={miniRose.outline} />
    </svg>
  );
};

const MiniWindRose = React.memo(MiniWindRoseBase);

interface CalendarDay {
  day: string;
  dayOfMonth: number;
}

interface DaySummary {
  description: string;
  tooltip: string;
}

const buildCalendarDays = (month: string): CalendarDay[] => {
  const start = moment(month, MONTH_FORMAT).startOf('month');
  return Array.from({ length: start.daysInMonth() }, (value: unknown, index: number) => ({
    day: start.clone().add(index, 'days').format(DAY_FORMAT),
    dayOfMonth: index + 1,
  }));
};

const summarizeDay = (day: string, aggregate: WindRoseAggregate): DaySummary => {
  const prevailing = getPrevailingSector(buildSectors(aggregate));
  const details = [`${formatCount(aggregate.samples)} observations`];
  if (prevailing) {
    details.push(`prevailing wind from ${prevailing.direction}`);
  }
  details.push(`mean speed ${formatSpeed(aggregate.meanSpeed)}`);
  return {
    description: `${formatDay(day, 'dddd, MMMM D, YYYY')}: ${details.join(', ')}`,
    tooltip: `${formatDay(day, 'ddd, MMM D')}: ${details.join(' · ')}`,
  };
};

export interface WindRoseCalendarProps {
  colorScheme: WindRoseColorScheme;
}

/**
 * Month at a glance: a calendar of the month with a thumbnail wind rose for each day with data.
 * Selecting a day shows the daily wind rose for it.
 */
const WindRoseCalendar: React.FC<WindRoseCalendarProps> = (
  props: WindRoseCalendarProps,
): Nullable<React.JSX.Element> => {
  const { classes, cx } = useStyles();
  const { colorScheme }: WindRoseCalendarProps = props;
  const titleId = useId();
  const state: WindRoseViewerState = useStateContext();
  const dispatch = useDispatchContext();
  const {
    aggregation,
    selectedDay,
    query,
    data: { daily, days },
  }: WindRoseViewerState = state;
  const month = query.months[0] || null;
  const palette = getWindRosePalette(colorScheme);
  const calendarDays = useMemo(() => (month ? buildCalendarDays(month) : []), [month]);
  const daySummaries = useMemo(() => {
    const summaries: Record<string, DaySummary> = {};
    days.forEach((day: string): void => {
      summaries[day] = summarizeDay(day, daily[day]);
    });
    return summaries;
  }, [daily, days]);
  if (!month) {
    return null;
  }
  const isDaily = aggregation === WindRoseAggregation.DAILY;
  const firstWeekday = moment(month, MONTH_FORMAT).startOf('month').weekday();
  const weekdays = moment.weekdaysMin(true);
  const focusDay = (selectedDay && daily[selectedDay]) ? selectedDay : (days[0] || null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>, day: string): void => {
    let target: Nullable<string> = null;
    switch (event.key) {
      case 'ArrowRight':
        target = stepDay(days, day, 1, false);
        break;
      case 'ArrowLeft':
        target = stepDay(days, day, -1, false);
        break;
      case 'ArrowDown': {
        const weekLater = moment(day, DAY_FORMAT).add(7, 'days').format(DAY_FORMAT);
        target = days.find((dayWithData: string): boolean => dayWithData >= weekLater) || null;
        break;
      }
      case 'ArrowUp': {
        const weekEarlier = moment(day, DAY_FORMAT).subtract(7, 'days').format(DAY_FORMAT);
        target = [...days].reverse()
          .find((dayWithData: string): boolean => dayWithData <= weekEarlier) || null;
        break;
      }
      case 'Home':
        target = days[0] || null;
        break;
      case 'End':
        target = days[days.length - 1] || null;
        break;
      default:
        return;
    }
    event.preventDefault();
    if (!target || (target === day)) {
      return;
    }
    dispatch(ActionCreator.selectDay(target));
    const grid = event.currentTarget.closest('[role="radiogroup"]');
    const targetButton = grid ? grid.querySelector<HTMLElement>(`[data-day="${target}"]`) : null;
    if (targetButton) {
      targetButton.focus();
    }
  };

  const renderDay = (calendarDay: CalendarDay, index: number): React.JSX.Element => {
    const { day, dayOfMonth } = calendarDay;
    const aggregate: Nullable<WindRoseAggregate> = daily[day];
    // Offset the first day of the month to its day of the week
    const style = (index === 0) ? { gridColumnStart: firstWeekday + 1 } : undefined;
    if (!aggregate) {
      return (
        <div key={day} className={cx(classes.day, classes.dayEmpty)} style={style} aria-hidden>
          <span className={cx(classes.dayNumber, classes.dayNumberEmpty)}>{dayOfMonth}</span>
          <span className={classes.miniRose} />
        </div>
      );
    }
    const isSelected = isDaily && (day === selectedDay);
    const { description, tooltip } = daySummaries[day];
    return (
      <Tooltip key={day} title={tooltip} enterDelay={300} disableInteractive placement="top">
        <ButtonBase
          role="radio"
          aria-checked={isSelected}
          aria-label={description}
          data-day={day}
          tabIndex={(day === focusDay) ? 0 : -1}
          className={cx(classes.day, classes.dayButton, isSelected && classes.daySelected)}
          style={style}
          onClick={() => dispatch(ActionCreator.selectDay(day))}
          onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => handleKeyDown(event, day)}
        >
          <span className={cx(classes.dayNumber, isSelected && classes.dayNumberSelected)}>
            {dayOfMonth}
          </span>
          <MiniWindRose aggregate={aggregate} palette={palette} />
        </ButtonBase>
      </Tooltip>
    );
  };

  return (
    <section aria-labelledby={titleId}>
      <div className={classes.header}>
        <Typography id={titleId} variant="subtitle2" component="h4">
          {`Days in ${formatMonth(month)}`}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {`${days.length} with data`}
        </Typography>
      </div>
      <div className={classes.weekdays} aria-hidden>
        {weekdays.map((weekday: string): React.JSX.Element => (
          <span key={weekday} className={classes.weekday}>{weekday}</span>
        ))}
      </div>
      <div role="radiogroup" aria-labelledby={titleId} className={classes.grid}>
        {calendarDays.map(renderDay)}
      </div>
      {(isDaily || (days.length <= 0)) ? null : (
        <Typography variant="caption" className={classes.hint}>
          Select a day to view its wind rose.
        </Typography>
      )}
    </section>
  );
};

export default WindRoseCalendar;
