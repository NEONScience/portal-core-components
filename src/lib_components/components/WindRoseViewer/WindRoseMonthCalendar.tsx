import React, { useId, useMemo } from 'react';

import ButtonBase from '@mui/material/ButtonBase';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { MiniWindRose } from './WindRoseCalendar';
import { getWindRosePalette, WindRoseColorScheme } from './colorSchemes';
import { WindRoseAggregate } from './windRoseUtil';
import {
  buildSectors,
  formatCount,
  formatMonth,
  formatSpeed,
  getPrevailingSector,
} from './windRoseChartUtil';
import {
  getPeriodMonths,
  WindRosePeriodDataState,
  WindRosePeriodType,
} from './windRosePeriodUtil';

import { COLORS } from '../Theme/Theme';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  header: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: theme.spacing(0.75),
  },
  seasonGrid: {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  },
  month: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 0,
    padding: theme.spacing(0.5, 0.5, 0.75, 0.5),
    border: `1px solid ${COLORS.GREY[100]}`,
    borderRadius: '4px',
    backgroundColor: '#fff',
  },
  monthButton: {
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
  monthEmpty: {
    backgroundColor: COLORS.GREY[50],
    borderStyle: 'dashed',
  },
  monthLabel: {
    alignSelf: 'flex-start',
    paddingLeft: '2px',
    fontSize: '0.75rem',
    fontWeight: 600,
    lineHeight: 1.3,
    color: theme.palette.text.secondary,
  },
  monthLabelEmpty: {
    color: COLORS.GREY[300],
  },
  miniRose: {
    maxWidth: '64px',
  },
  roseSpace: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '64px',
    aspectRatio: '1 / 1',
  },
  hint: {
    display: 'block',
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
}));

const summarizeMonth = (month: string, aggregate: WindRoseAggregate): string => {
  const prevailing = getPrevailingSector(buildSectors(aggregate));
  const details = [`${formatCount(aggregate.samples)} observations`];
  if (prevailing) {
    details.push(`prevailing wind from ${prevailing.direction}`);
  }
  details.push(`mean speed ${formatSpeed(aggregate.meanSpeed)}`);
  return `${formatMonth(month)}: ${details.join(', ')}`;
};

export interface WindRoseMonthCalendarProps {
  periodType: WindRosePeriodType;
  // A month (YYYY-MM) of the season or year
  month: string;
  // Name of the season or year, e.g. Summer 2026
  periodLabel: string;
  // Wind roses of the months of the season or year, of the observations selected
  dataSet: WindRosePeriodDataState;
  // Months of the season or year still being fetched
  pendingMonths: readonly string[];
  colorScheme: WindRoseColorScheme;
  onSelectMonth: (month: string) => void;
}

/**
 * Season or year at a glance: a thumbnail wind rose for each month with data. Selecting a month
 * shows the monthly wind rose for it.
 */
const WindRoseMonthCalendar: React.FC<WindRoseMonthCalendarProps> = (
  props: WindRoseMonthCalendarProps,
): React.JSX.Element => {
  const { classes, cx } = useStyles();
  const {
    periodType,
    month,
    periodLabel,
    dataSet,
    pendingMonths,
    colorScheme,
    onSelectMonth,
  }: WindRoseMonthCalendarProps = props;
  const titleId = useId();
  const isSeason = periodType === WindRosePeriodType.SEASON;
  const palette = getWindRosePalette(colorScheme);
  const months = useMemo(() => getPeriodMonths(periodType, month), [periodType, month]);
  const monthsWithData = months.filter((periodMonth: string): boolean => (
    !!dataSet.monthly[periodMonth]
  ));

  const renderMonth = (periodMonth: string): React.JSX.Element => {
    const aggregate: WindRoseAggregate = dataSet.monthly[periodMonth];
    const label = formatMonth(periodMonth, 'MMM');
    if (!aggregate) {
      const isPending = pendingMonths.includes(periodMonth);
      return (
        <div
          key={periodMonth}
          className={cx(classes.month, !isPending && classes.monthEmpty)}
          aria-hidden
        >
          <span className={cx(classes.monthLabel, !isPending && classes.monthLabelEmpty)}>
            {label}
          </span>
          <span className={classes.roseSpace}>
            {!isPending ? null : <CircularProgress size={16} thickness={5} />}
          </span>
        </div>
      );
    }
    const summary = summarizeMonth(periodMonth, aggregate);
    return (
      <Tooltip
        key={periodMonth}
        title={summary}
        enterDelay={300}
        disableInteractive
        placement="top"
      >
        <ButtonBase
          aria-label={`${summary}. View the monthly wind rose.`}
          className={cx(classes.month, classes.monthButton)}
          onClick={() => onSelectMonth(periodMonth)}
        >
          <span className={classes.monthLabel}>{label}</span>
          <MiniWindRose aggregate={aggregate} palette={palette} className={classes.miniRose} />
        </ButtonBase>
      </Tooltip>
    );
  };

  return (
    <section aria-labelledby={titleId}>
      <div className={classes.header}>
        <Typography id={titleId} variant="subtitle2" component="h4">
          {`Months in ${periodLabel}`}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {(pendingMonths.length > 0)
            ? `Loading ${pendingMonths.length} of ${months.length}`
            : `${monthsWithData.length} with data`}
        </Typography>
      </div>
      <div className={cx(classes.grid, isSeason && classes.seasonGrid)}>
        {months.map(renderMonth)}
      </div>
      {(monthsWithData.length <= 0) ? null : (
        <Typography variant="caption" className={classes.hint}>
          Select a month to view its wind rose.
        </Typography>
      )}
    </section>
  );
};

export default WindRoseMonthCalendar;
