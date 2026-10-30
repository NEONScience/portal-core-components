import React, { useEffect, useMemo, useState } from 'react';

import moment, { Moment } from 'moment';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import {
  ActionCreator,
  FetchStatusState,
  SelectionOption,
  useDispatchContext,
  useFetchWindRose,
  useStateContext,
  WindRoseViewerState,
} from './Context';
import { WIND_ROSE_CHANGE_TYPE } from './windRoseUtil';
import { DAY_FORMAT, MONTH_FORMAT } from './windRoseChartUtil';

import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';
import { AsyncStateType } from '../../types/asyncFlow';
import { Nullable } from '../../types/core';

// How long each day is shown for while playing through the days of the month
export const PLAYBACK_INTERVAL_MS = 1250;

const useStyles = makeStyles()((theme: NeonTheme) => ({
  navigator: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
  },
  stepper: {
    flex: '0 1 320px',
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  dayPicker: {
    flex: '1 1 auto',
    minWidth: 0,
  },
  playButton: {
    minWidth: '96px',
  },
}));

const WindRoseDayNavigator: React.FC = (): React.JSX.Element => {
  const { classes } = useStyles();
  const state: WindRoseViewerState = useStateContext();
  const dispatch = useDispatchContext();
  const fetchWindRose = useFetchWindRose();
  const [open, setOpen] = useState<boolean>(false);
  const {
    selectedDay,
    isPlaying,
    monthOptions,
    query,
    fetchState,
    data: { days },
  }: WindRoseViewerState = state;
  const month = query.months[0] || null;
  const isLoading = (fetchState.data as Nullable<FetchStatusState>)?.status
    === AsyncStateType.WORKING;
  const availableMonths = useMemo(() => (
    monthOptions.map((option: SelectionOption): string => option.value).sort()
  ), [monthOptions]);
  const availableMonthSet = useMemo(() => new Set(availableMonths), [availableMonths]);
  const daySet = useMemo(() => new Set(days), [days]);
  const monthIndex = month ? availableMonths.indexOf(month) : -1;
  const previousMonth = (monthIndex > 0) ? availableMonths[monthIndex - 1] : null;
  const nextMonth = ((monthIndex >= 0) && (monthIndex < (availableMonths.length - 1)))
    ? availableMonths[monthIndex + 1]
    : null;
  const dayIndex = selectedDay ? days.indexOf(selectedDay) : -1;
  const hasPreviousDay = dayIndex > 0;
  const hasNextDay = (dayIndex >= 0) && (dayIndex < (days.length - 1));
  const canPlay = !isLoading && (days.length > 1);

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }
    const intervalId = window.setInterval(() => {
      dispatch(ActionCreator.stepDay(1, true, true));
    }, PLAYBACK_INTERVAL_MS);
    return () => {
      window.clearInterval(intervalId);
    };
  }, [dispatch, isPlaying]);

  const showDayInMonth = (targetMonth: string, day: string): void => {
    dispatch(ActionCreator.selectDay(day));
    fetchWindRose(WIND_ROSE_CHANGE_TYPE.MONTH, { months: [targetMonth] });
  };
  const handlePrevious = (): void => {
    if (hasPreviousDay) {
      dispatch(ActionCreator.stepDay(-1));
    } else if (previousMonth) {
      const lastDay = moment(previousMonth, MONTH_FORMAT).endOf('month').format(DAY_FORMAT);
      showDayInMonth(previousMonth, lastDay);
    }
  };
  const handleNext = (): void => {
    if (hasNextDay) {
      dispatch(ActionCreator.stepDay(1));
    } else if (nextMonth) {
      showDayInMonth(nextMonth, moment(nextMonth, MONTH_FORMAT).format(DAY_FORMAT));
    }
  };
  const handleAccept = (value: Nullable<Moment>): void => {
    if (!value || !value.isValid()) {
      return;
    }
    const day = value.format(DAY_FORMAT);
    const dayMonth = value.format(MONTH_FORMAT);
    if (dayMonth === month) {
      dispatch(ActionCreator.selectDay(day));
    } else if (availableMonthSet.has(dayMonth)) {
      showDayInMonth(dayMonth, day);
    }
  };
  const hasMonths = availableMonths.length > 0;
  const playLabel = isPlaying ? 'Pause' : 'Play through the days of the month';
  return (
    <div className={classes.navigator} data-windrose-download-exclude="true">
      <div className={classes.stepper}>
        <Tooltip title="Previous day">
          <span>
            <IconButton
              aria-label="Previous day"
              disabled={isLoading || (!hasPreviousDay && !previousMonth)}
              onClick={handlePrevious}
            >
              <ChevronLeftIcon />
            </IconButton>
          </span>
        </Tooltip>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <div className={classes.dayPicker}>
            <DatePicker
              label="Day"
              views={['day']}
              format="ddd, MMM D, YYYY"
              disableHighlightToday
              disabled={!hasMonths}
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              value={selectedDay ? moment(selectedDay, DAY_FORMAT) : null}
              minDate={hasMonths ? moment(availableMonths[0], MONTH_FORMAT) : undefined}
              maxDate={hasMonths
                ? moment(availableMonths[availableMonths.length - 1], MONTH_FORMAT).endOf('month')
                : undefined}
              shouldDisableDate={(value: Moment): boolean => {
                const dayMonth = value.format(MONTH_FORMAT);
                if (!availableMonthSet.has(dayMonth)) {
                  return true;
                }
                // Days of other months are not known to have data until that month is loaded
                return (dayMonth === month) && !daySet.has(value.format(DAY_FORMAT));
              }}
              onAccept={handleAccept}
              slotProps={{
                field: { shouldRespectLeadingZeros: true },
                textField: {
                  size: 'small',
                  fullWidth: true,
                  readOnly: true,
                  onClick: () => { if (hasMonths) setOpen(true); },
                },
              }}
            />
          </div>
        </LocalizationProvider>
        <Tooltip title="Next day">
          <span>
            <IconButton
              aria-label="Next day"
              disabled={isLoading || (!hasNextDay && !nextMonth)}
              onClick={handleNext}
            >
              <ChevronRightIcon />
            </IconButton>
          </span>
        </Tooltip>
      </div>
      <Tooltip title={playLabel}>
        <span>
          <Button
            variant="outlined"
            className={classes.playButton}
            aria-label={playLabel}
            aria-pressed={isPlaying}
            disabled={!canPlay}
            startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={() => dispatch(ActionCreator.setPlaying(!isPlaying))}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
        </span>
      </Tooltip>
    </div>
  );
};

export default WindRoseDayNavigator;
