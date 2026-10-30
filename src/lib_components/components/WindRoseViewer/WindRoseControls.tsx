import React, { useId, useMemo, useState } from 'react';

import moment, { Moment } from 'moment';

import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';

import {
  ActionCreator,
  PositionDisplayOption,
  SelectionOption,
  useDispatchContext,
  useFetchWindRose,
  useStateContext,
  WindRoseAggregation,
  WindRoseViewerState,
} from './Context';
import { WIND_ROSE_CHANGE_TYPE, WindRosePosition, WindRoseQualityFilter } from './windRoseUtil';
import { formatPosition, MONTH_FORMAT } from './windRoseChartUtil';

import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';
import { Nullable } from '../../types/core';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.spacing(2, 3),
  },
  siteControl: {
    flex: '2 1 260px',
    minWidth: 0,
  },
  monthControl: {
    flex: '1 1 250px',
    maxWidth: '320px',
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  monthPicker: {
    flex: '1 1 auto',
    minWidth: 0,
  },
  positionsControl: {
    flex: '1 1 200px',
    minWidth: 0,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
  },
  qualityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  qualityLabel: {
    color: theme.palette.text.secondary,
  },
  toggleIcon: {
    fontSize: '1.15rem',
    marginRight: theme.spacing(0.75),
  },
}));

const getPositionValue = (position: WindRosePosition): string => (
  `(${position.horizontal}, ${position.vertical})`
);

interface WindRoseMonthPickerProps {
  month: Nullable<string>;
  // Months with data (YYYY-MM), sorted ascending
  availableMonths: readonly string[];
  onChange: (month: string) => void;
}

const WindRoseMonthPicker: React.FC<WindRoseMonthPickerProps> = (
  props: WindRoseMonthPickerProps,
): React.JSX.Element => {
  const { classes } = useStyles();
  const { month, availableMonths, onChange }: WindRoseMonthPickerProps = props;
  const [open, setOpen] = useState<boolean>(false);
  const availableMonthSet = useMemo(() => new Set(availableMonths), [availableMonths]);
  const availableYearSet = useMemo(() => (
    new Set(availableMonths.map((availableMonth: string): string => availableMonth.slice(0, 4)))
  ), [availableMonths]);
  const monthIndex = month ? availableMonths.indexOf(month) : -1;
  const previousMonth = (monthIndex > 0) ? availableMonths[monthIndex - 1] : null;
  const nextMonth = ((monthIndex >= 0) && (monthIndex < (availableMonths.length - 1)))
    ? availableMonths[monthIndex + 1]
    : null;
  const hasMonths = availableMonths.length > 0;
  const handleAccept = (value: Nullable<Moment>): void => {
    if (!value || !value.isValid()) {
      return;
    }
    const acceptedMonth = value.format(MONTH_FORMAT);
    if (availableMonthSet.has(acceptedMonth) && (acceptedMonth !== month)) {
      onChange(acceptedMonth);
    }
  };
  return (
    <div className={classes.monthControl}>
      <Tooltip title="Previous month with data">
        <span>
          <IconButton
            size="small"
            aria-label="Previous month with data"
            disabled={!previousMonth}
            onClick={() => { if (previousMonth) { onChange(previousMonth); } }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </span>
      </Tooltip>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <div className={classes.monthPicker}>
          <DatePicker
            label="Month"
            views={['year', 'month']}
            openTo="month"
            format="MMMM YYYY"
            disabled={!hasMonths}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            value={month ? moment(month, MONTH_FORMAT) : null}
            minDate={hasMonths ? moment(availableMonths[0], MONTH_FORMAT) : undefined}
            maxDate={hasMonths
              ? moment(availableMonths[availableMonths.length - 1], MONTH_FORMAT).endOf('month')
              : undefined}
            shouldDisableMonth={(value: Moment): boolean => (
              !availableMonthSet.has(value.format(MONTH_FORMAT))
            )}
            shouldDisableYear={(value: Moment): boolean => (
              !availableYearSet.has(value.format('YYYY'))
            )}
            onAccept={handleAccept}
            slotProps={{
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
      <Tooltip title="Next month with data">
        <span>
          <IconButton
            size="small"
            aria-label="Next month with data"
            disabled={!nextMonth}
            onClick={() => { if (nextMonth) onChange(nextMonth); }}
          >
            <ChevronRightIcon />
          </IconButton>
        </span>
      </Tooltip>
    </div>
  );
};

const WindRoseControls: React.FC = (): React.JSX.Element => {
  const { classes } = useStyles();
  const state: WindRoseViewerState = useStateContext();
  const dispatch = useDispatchContext();
  const fetchWindRose = useFetchWindRose();
  const siteLabelId = useId();
  const positionsLabelId = useId();
  const qualityLabelId = useId();
  const {
    siteOptions,
    monthOptions,
    positionOptions,
    query,
    qualityFilter,
  }: WindRoseViewerState = state;
  const site = query.sites[0] || '';
  const month = query.months[0] || null;
  const availableMonths = useMemo(() => (
    monthOptions.map((option: SelectionOption): string => option.value).sort()
  ), [monthOptions]);
  const selectedPositions = query.positions.map(getPositionValue);
  const hasSite = siteOptions.some((option: SelectionOption): boolean => option.value === site);
  const hasPositionOptions = positionOptions.length > 0;
  return (
    <div className={classes.controls}>
      <FormControl size="small" className={classes.siteControl} disabled={siteOptions.length <= 0}>
        <InputLabel id={siteLabelId}>Site</InputLabel>
        <Select
          labelId={siteLabelId}
          label="Site"
          value={hasSite ? site : ''}
          onChange={(event: SelectChangeEvent<string>) => {
            fetchWindRose(WIND_ROSE_CHANGE_TYPE.SITE, { sites: [event.target.value] });
          }}
          MenuProps={{ slotProps: { paper: { style: { maxHeight: '420px' } } } }}
        >
          {siteOptions.map((option: SelectionOption): React.JSX.Element => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <WindRoseMonthPicker
        month={month}
        availableMonths={availableMonths}
        onChange={(nextMonth: string) => {
          fetchWindRose(WIND_ROSE_CHANGE_TYPE.MONTH, { months: [nextMonth] });
        }}
      />
      <FormControl
        size="small"
        className={classes.positionsControl}
        disabled={!hasPositionOptions}
      >
        <InputLabel id={positionsLabelId}>Sensor positions</InputLabel>
        <Select
          multiple
          labelId={positionsLabelId}
          label="Sensor positions"
          value={hasPositionOptions ? selectedPositions : []}
          onChange={(event: SelectChangeEvent<string[]>) => {
            const { value } = event.target;
            const values = (typeof value === 'string') ? value.split(',') : value;
            // At least one position must remain selected
            if (values.length <= 0) {
              return;
            }
            const positions = positionOptions
              .filter((option: PositionDisplayOption): boolean => values.includes(option.value))
              .map((option: PositionDisplayOption): WindRosePosition => option.position);
            fetchWindRose(WIND_ROSE_CHANGE_TYPE.POSITIONS, { positions });
          }}
          renderValue={(selected: string[]): React.ReactNode => (
            <div className={classes.chips}>
              {positionOptions
                .filter((option: PositionDisplayOption): boolean => selected.includes(option.value))
                .map((option: PositionDisplayOption): React.JSX.Element => (
                  <Chip key={option.value} size="small" label={formatPosition(option.position)} />
                ))}
            </div>
          )}
        >
          {positionOptions.map((option: PositionDisplayOption): React.JSX.Element => (
            <MenuItem key={option.value} value={option.value} dense>
              <Checkbox checked={selectedPositions.includes(option.value)} />
              <ListItemText
                primary={formatPosition(option.position)}
                secondary={
                  `Horizontal ${option.position.horizontal}, vertical ${option.position.vertical}`
                }
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className={classes.qualityControl}>
        <Typography id={qualityLabelId} variant="caption" className={classes.qualityLabel}>
          Observations
        </Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          color="primary"
          value={qualityFilter}
          aria-labelledby={qualityLabelId}
          onChange={(event: React.MouseEvent<HTMLElement>, value: unknown) => {
            // Clicking the selected button would otherwise leave no quality filter selected
            if ((value === WindRoseQualityFilter.VALIDATED)
                || (value === WindRoseQualityFilter.ALL)) {
              dispatch(ActionCreator.setQualityFilter(value));
            }
          }}
        >
          <Tooltip
            describeChild
            title="Every observation, including those where either flag is 1 (fail)"
          >
            <ToggleButton value={WindRoseQualityFilter.ALL}>All</ToggleButton>
          </Tooltip>
          <Tooltip
            describeChild
            title="Observations where windSpeedFinalQF and windDirFinalQF are both 0 (pass)"
          >
            <ToggleButton value={WindRoseQualityFilter.VALIDATED}>
              Quality Flag Validated
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </div>
    </div>
  );
};

/**
 * Toggles between the monthly and daily wind rose aggregations
 */
export const WindRoseAggregationToggle: React.FC = (): React.JSX.Element => {
  const { classes } = useStyles();
  const { aggregation }: WindRoseViewerState = useStateContext();
  const dispatch = useDispatchContext();
  return (
    <ToggleButtonGroup
      exclusive
      color="primary"
      value={aggregation}
      aria-label="Wind rose aggregation"
      onChange={(event: React.MouseEvent<HTMLElement>, value: unknown) => {
        // Clicking the selected button would otherwise leave no aggregation selected
        if ((value === WindRoseAggregation.MONTHLY) || (value === WindRoseAggregation.DAILY)) {
          dispatch(ActionCreator.setAggregation(value));
        }
      }}
    >
      <ToggleButton value={WindRoseAggregation.MONTHLY}>
        <CalendarMonthIcon className={classes.toggleIcon} />
        Monthly
      </ToggleButton>
      <ToggleButton value={WindRoseAggregation.DAILY}>
        <TodayIcon className={classes.toggleIcon} />
        Daily
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default WindRoseControls;
