import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useReducer,
  useMemo,
} from 'react';

import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import DateRangeIcon from '@mui/icons-material/DateRange';
import TodayIcon from '@mui/icons-material/Today';

import moment from 'moment';

import SaeDataViewerContext, { SaeDataViewerContextState } from './SaeDataViewerContext';

import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';
import { AnyAction } from '../../types/core';
import { exists } from '../../util/typeUtil';
import { resolveProps } from '../../util/defaultProps';

export enum DateSelectionType {
  RANGE = 'RANGE',
  SINGLE = 'SINGLE',
}

const useStyles = makeStyles()((theme: NeonTheme) => ({
  slider: {
    width: `calc(100% - ${theme.spacing(6)})`,
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(5.5),
  },
  datePickerInput: {
    backgroundColor: '#fff',
    width: '100%',
  },
  toggleButtonGroupContainer: {
    margin: theme.spacing(2, 0, 3, 0),
  },
  dateRangeSubtitle: {
    fontSize: '0.725rem',
    color: theme.palette.grey[400],
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  dateSelectionGroup: {
    width: '100%',
  },
  dateSelectionIcon: {
    marginRight: theme.spacing(1),
  },
  dateSelectionToggleButton: {
    flex: 1,
  },
}));

const useToggleButtonStyles = makeStyles<{ useDefault: boolean }>()((
  theme: NeonTheme,
  { useDefault = true },
) => ({
  root: {
    color: useDefault ? theme.colors.LIGHT_BLUE[500] : theme.colors.GREY[500],
    borderColor: useDefault ? theme.colors.LIGHT_BLUE[500] : theme.colors.GREY[500],
    '&:hover, &:active': {
      color: useDefault ? theme.colors.LIGHT_BLUE[400] : theme.colors.GREY[300],
      borderColor: useDefault ? theme.colors.LIGHT_BLUE[400] : theme.colors.GREY[300],
    },
    '&.MuiToggleButton-root.Mui-selected': {
      color: `${useDefault ? '#fff' : 'rgba(0, 0, 0, 1)'} !important`,
      backgroundColor: `${useDefault ? theme.colors.LIGHT_BLUE[500] : '#bcc0bf'} !important`,
    },
  },
}));

const getContinuousDatesArray = (minDate: Date, maxDate: Date) => {
  const startMoment = moment(minDate);
  const endMoment = moment(maxDate);
  const continuousRange = [];
  let days = 0;
  const MAX_DAYS = 29200; // If we're going more than 80 years then maybe something is wrong?
  while (startMoment.isSameOrBefore(endMoment) && days < MAX_DAYS) {
    continuousRange.push(startMoment.format('YYYY-MM-DD'));
    startMoment.add(1, 'days');
    days += 1;
  }
  return continuousRange;
};

const handleNudgeDateRange = (
  minDate: Date,
  startDate: Date,
  maxDate: Date,
  endDate: Date,
): [Date, Date] => {
  let newStartDate = startDate;
  let newEndDate = endDate;
  if (startDate.getTime() === endDate.getTime()) {
    if (startDate.getTime() === minDate.getTime()) {
      newStartDate = startDate;
      newEndDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + 1,
      );
    } else if (endDate.getTime() === maxDate.getTime()) {
      newStartDate = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate() - 1,
      );
      newEndDate = endDate;
    } else {
      newStartDate = startDate;
      newEndDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + 1,
      );
    }
  }
  return [newStartDate, newEndDate];
};

const formatMomentDate = (date: Date): string => (
  moment(date).format('YYYY-MM-DD')
);

interface DatePickerInternalState {
  activelySelectingDateRange: Array<Date>;
}

const datePickerReducer = (state: DatePickerInternalState, action: AnyAction) => {
  const newState = { ...state };
  switch (action.type) {
    case 'setActivelySelectingDateRange':
      newState.activelySelectingDateRange = action.activelySelectingDateRange as Array<Date>;
      return newState;
    default:
      return state;
  }
};

interface SaeDataViewerDatePickerProps {
  sidebarMode?: boolean;
}

const defaultProps: SaeDataViewerDatePickerProps = {
  sidebarMode: false,
};

const SaeDataViewerDatePicker: React.FC<SaeDataViewerDatePickerProps> = (
  inProps: SaeDataViewerDatePickerProps,
): React.JSX.Element => {
  const props = resolveProps(defaultProps, inProps) as SaeDataViewerDatePickerProps;
  const { sidebarMode } = props;
  const { classes, theme } = useStyles();
  const { classes: toggleButtonClasses } = useToggleButtonStyles({ useDefault: true });
  const dateRangeSliderRef = useRef(null);
  const state = SaeDataViewerContext.useSaeDataViewerContextState();
  const dispatch = SaeDataViewerContext.useSaeDataViewerContextDispatch();
  const {
    startDate,
    endDate,
    controlsState: {
      minDate,
      maxDate,
    },
  }: SaeDataViewerContextState = state;
  const appliedSidebarMode = (sidebarMode === true);
  const sliderDateValues = useMemo(() => (
    getContinuousDatesArray(minDate, maxDate)
  ), [minDate, maxDate]);
  const sliderMin = 0;
  const sliderMax = sliderDateValues.length - 1;

  const initialState: DatePickerInternalState = {
    activelySelectingDateRange: [startDate, endDate],
  };
  const [datePickerState, datePickerDispatch] = useReducer(datePickerReducer, initialState);
  const [activelySelecting, setActivelySelecting] = useState<boolean>(false);
  const [dateSelectionType, setDateSelectionType] = useState<DateSelectionType>(
    DateSelectionType.RANGE,
  );
  const sliderValue = datePickerState.activelySelectingDateRange.map(
    (activeSelectingDate: Date, i: number) => {
      if (activeSelectingDate) {
        return sliderDateValues.indexOf(formatMomentDate(activeSelectingDate));
      }
      const selectedDate = i === 0 ? startDate : endDate;
      return sliderDateValues.indexOf(formatMomentDate(selectedDate));
    },
  );
  useEffect(() => {
    if ((
      startDate !== datePickerState.activelySelectingDateRange[0]
        || endDate !== datePickerState.activelySelectingDateRange[1]
    ) && !activelySelecting) {
      const action = {
        type: 'setActivelySelectingDateRange',
        activelySelectingDateRange: [startDate, endDate],
      };
      datePickerDispatch(action);
    }
  }, [
    activelySelecting,
    datePickerState,
    datePickerDispatch,
    startDate,
    endDate,
  ]);

  const marks = [{
    value: sliderMin,
    label: sliderDateValues[sliderMin].substring(0, 4),
  }];
  const yearsInSlider = Math.floor(sliderDateValues.length / 365);
  if (yearsInSlider <= 3) {
    const numInnerMarks = 4;
    const sliderMarkModulo = Math.ceil(sliderDateValues.length / numInnerMarks);
    for (let y = 1; y <= numInnerMarks; y += 1) {
      marks.push({
        value: y * sliderMarkModulo,
        label: '',
      });
    }
  } else {
    const innerMark = Math.ceil(yearsInSlider / Math.ceil(yearsInSlider % 3 ? 2 : 3));
    for (let y = 1; y < yearsInSlider; y += 1) {
      marks.push({
        value: 365 * y,
        label: (y === innerMark || y === innerMark * 2)
          ? sliderDateValues[365 * y].substring(0, 4)
          : '',
      });
    }
  }
  marks.push({
    value: sliderMax,
    label: sliderDateValues[sliderMax].substring(0, 4),
  });

  const handleDateSelectionTypeChange = useCallback(
    (
      cbDateSelectionType: DateSelectionType,
      cbMinDate: Date,
      cbStartDate: Date,
      cbMaxDate: Date,
      cbEndDate: Date,
    ): void => {
      if (cbDateSelectionType === DateSelectionType.RANGE) {
        const [newStartDate, newEndDate] = handleNudgeDateRange(
          cbMinDate,
          cbStartDate,
          cbMaxDate,
          cbEndDate,
        );
        const hasChanges = (cbStartDate.getTime() !== newStartDate.getTime())
          || (cbEndDate.getTime() !== newEndDate.getTime());
        if (hasChanges && dispatch) {
          dispatch({ type: 'setSelectedDateRange', startDate: newStartDate, endDate: newEndDate });
        }
      }
      setDateSelectionType(cbDateSelectionType);
    },
    [dispatch, setDateSelectionType],
  );
  const handleDateRangeChange = useCallback((cbStartDate: Date, cbEndDate: Date) => {
    if (dispatch) {
      dispatch({ type: 'setSelectedDateRange', startDate: cbStartDate, endDate: cbEndDate });
    }
  }, [dispatch]);

  const renderSlider = (): React.JSX.Element => {
    if (dateSelectionType !== DateSelectionType.RANGE) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }
    return (
      <Slider
        data-selenium="sae-data-viewer.date-range.slider"
        className={classes.slider}
        ref={dateRangeSliderRef}
        value={sliderValue}
        valueLabelDisplay="auto"
        min={sliderMin}
        max={sliderMax}
        marks={marks}
        valueLabelFormat={(x) => sliderDateValues[x]}
        onPointerDown={() => { setActivelySelecting(true); }}
        onChange={(event, values) => {
          const sliderRange = [
            Math.max((values as number[])[0], sliderMin),
            Math.min((values as number[])[1], sliderMax),
          ];
          const mappedDisplayRange = sliderRange.map((x) => moment(sliderDateValues[x]).toDate());
          const action = {
            type: 'setActivelySelectingDateRange',
            activelySelectingDateRange: mappedDisplayRange,
          };
          datePickerDispatch(action);
        }}
        onChangeCommitted={(event, values) => {
          setActivelySelecting(false);
          if (dispatch) {
            const dateRange = [
              Math.max((values as number[])[0], sliderMin),
              Math.min((values as number[])[1], sliderMax),
            ].map((x) => moment(sliderDateValues[x]).toDate());
            const [newStartDate, newEndDate] = handleNudgeDateRange(
              minDate,
              dateRange[0],
              maxDate,
              dateRange[1],
            );
            handleDateRangeChange(newStartDate, newEndDate);
          }
        }}
      />
    );
  };
  const renderDatePickers = (): React.JSX.Element => {
    const mainPickerMaxDate = (dateSelectionType === DateSelectionType.RANGE)
      ? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 1)
      : maxDate;
    // eslint-disable-next-line react/jsx-no-useless-fragment
    let secondaryPicker = <></>;
    const isRange = (dateSelectionType === DateSelectionType.RANGE);
    if (isRange) {
      const secondaryMinDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + 1,
      );
      secondaryPicker = (
        <Grid size={{ xs: 12, md: appliedSidebarMode ? 12 : 6 }}>
          <DatePicker
            data-selenium="sae-data-viewer.date-range.end-input"
            orientation="portrait"
            format="MMM D, YYYY"
            value={moment(endDate)}
            onChange={(value) => {
              handleDateRangeChange(startDate, moment(value).toDate());
            }}
            views={['day']}
            label="End"
            openTo="day"
            minDate={moment(secondaryMinDate)}
            maxDate={moment(maxDate)}
            slotProps={{
              textField: {
                className: classes.datePickerInput,
                readOnly: true,
                variant: 'outlined',
                margin: 'dense',
                size: 'small',
              },
            }}
          />
        </Grid>
      );
    }
    return (
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: appliedSidebarMode || !isRange ? 12 : 6 }}>
            <DatePicker
              data-selenium="sae-data-viewer.date-range.start-input"
              orientation="portrait"
              format="MMM D, YYYY"
              value={moment(startDate)}
              onChange={(value) => {
                if (dateSelectionType === DateSelectionType.SINGLE) {
                  handleDateRangeChange(moment(value).toDate(), moment(value).toDate());
                } else {
                  handleDateRangeChange(moment(value).toDate(), endDate);
                }
              }}
              views={['day']}
              label={dateSelectionType === DateSelectionType.RANGE ? 'Start' : 'Date'}
              openTo="day"
              minDate={moment(minDate)}
              maxDate={moment(mainPickerMaxDate)}
              slotProps={{
                textField: {
                  className: classes.datePickerInput,
                  readOnly: true,
                  variant: 'outlined',
                  margin: 'dense',
                  size: 'small',
                },
              }}
            />
          </Grid>
          {secondaryPicker}
        </Grid>
      </LocalizationProvider>
    );
  };

  return (
    <div>
      <Typography variant="caption" className={classes.dateRangeSubtitle} gutterBottom>
        Toggle between selecting by date range or by a single date
      </Typography>
      <div className={classes.toggleButtonGroupContainer}>
        <ToggleButtonGroup
          exclusive
          size="small"
          className={classes.dateSelectionGroup}
          value={dateSelectionType}
          onChange={
            (event: React.MouseEvent<HTMLElement, MouseEvent>, value: DateSelectionType) => {
              if (!exists(value)) {
                return;
              }
              handleDateSelectionTypeChange(
                value,
                minDate,
                startDate,
                maxDate,
                endDate,
              );
            }
          }
        >
          <ToggleButton
            value={DateSelectionType.RANGE}
            className={classes.dateSelectionToggleButton}
            classes={toggleButtonClasses}
          >
            <DateRangeIcon className={classes.dateSelectionIcon} />
            Date Range
          </ToggleButton>
          <ToggleButton
            value={DateSelectionType.SINGLE}
            className={classes.dateSelectionToggleButton}
            classes={toggleButtonClasses}
          >
            <TodayIcon className={classes.dateSelectionIcon} />
            Single Date
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div style={{ marginBottom: theme.spacing(2) }}>
        {renderSlider()}
        {renderDatePickers()}
      </div>
    </div>
  );
};

export default SaeDataViewerDatePicker;
