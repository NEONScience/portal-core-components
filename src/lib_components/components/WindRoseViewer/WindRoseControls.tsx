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
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DateRangeIcon from '@mui/icons-material/DateRange';
import TodayIcon from '@mui/icons-material/Today';

import {
  ActionCreator,
  getAggregationPeriodType,
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
import {
  getAvailablePeriodStarts,
  getPeriodAnchorMonth,
  getPeriodLabel,
  getPeriodStartMonth,
  stepPeriod,
  WindRosePeriodType,
} from './windRosePeriodUtil';

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

interface WindRosePeriodStepperProps {
  // Name of the period stepped through, e.g. month, season or year
  periodName: string;
  // Month (YYYY-MM) of the previous and next periods with data, if any
  previousMonth: Nullable<string>;
  nextMonth: Nullable<string>;
  onChange: (month: string) => void;
  children: React.ReactNode;
}

/**
 * Picker of a month, season or year between buttons stepping to the previous and next with data
 */
const WindRosePeriodStepper: React.FC<WindRosePeriodStepperProps> = (
  props: WindRosePeriodStepperProps,
): React.JSX.Element => {
  const { classes } = useStyles();
  const {
    periodName,
    previousMonth,
    nextMonth,
    onChange,
    children,
  }: WindRosePeriodStepperProps = props;
  return (
    <div className={classes.monthControl}>
      <Tooltip title={`Previous ${periodName} with data`}>
        <span>
          <IconButton
            size="small"
            aria-label={`Previous ${periodName} with data`}
            disabled={!previousMonth}
            onClick={() => { if (previousMonth) { onChange(previousMonth); } }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </span>
      </Tooltip>
      <div className={classes.monthPicker}>
        {children}
      </div>
      <Tooltip title={`Next ${periodName} with data`}>
        <span>
          <IconButton
            size="small"
            aria-label={`Next ${periodName} with data`}
            disabled={!nextMonth}
            onClick={() => { if (nextMonth) { onChange(nextMonth); } }}
          >
            <ChevronRightIcon />
          </IconButton>
        </span>
      </Tooltip>
    </div>
  );
};

interface WindRosePickerProps {
  month: Nullable<string>;
  // Months with data (YYYY-MM), sorted ascending
  availableMonths: readonly string[];
  onChange: (month: string) => void;
}

const WindRoseMonthPicker: React.FC<WindRosePickerProps> = (
  props: WindRosePickerProps,
): React.JSX.Element => {
  const { month, availableMonths, onChange }: WindRosePickerProps = props;
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
    <WindRosePeriodStepper
      periodName="month"
      previousMonth={previousMonth}
      nextMonth={nextMonth}
      onChange={onChange}
    >
      <LocalizationProvider dateAdapter={AdapterMoment}>
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
      </LocalizationProvider>
    </WindRosePeriodStepper>
  );
};

const WindRoseYearPicker: React.FC<WindRosePickerProps> = (
  props: WindRosePickerProps,
): React.JSX.Element => {
  const { month, availableMonths, onChange }: WindRosePickerProps = props;
  const [open, setOpen] = useState<boolean>(false);
  const availableYearSet = useMemo(() => (
    new Set(availableMonths.map((availableMonth: string): string => availableMonth.slice(0, 4)))
  ), [availableMonths]);
  const hasMonths = availableMonths.length > 0;
  const handleAccept = (value: Nullable<Moment>): void => {
    if (!value || !value.isValid()) {
      return;
    }
    // Views the year by the same month of the year as viewed now, where it has data
    const acceptedMonth = getPeriodAnchorMonth(
      WindRosePeriodType.YEAR,
      value.format(MONTH_FORMAT),
      month,
      availableMonths,
    );
    if (acceptedMonth && (acceptedMonth !== month)) {
      onChange(acceptedMonth);
    }
  };
  return (
    <WindRosePeriodStepper
      periodName="year"
      previousMonth={month ? stepPeriod(WindRosePeriodType.YEAR, month, availableMonths, -1) : null}
      nextMonth={month ? stepPeriod(WindRosePeriodType.YEAR, month, availableMonths, 1) : null}
      onChange={onChange}
    >
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          label="Year"
          views={['year']}
          openTo="year"
          format="YYYY"
          disabled={!hasMonths}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          value={month ? moment(month, MONTH_FORMAT) : null}
          minDate={hasMonths ? moment(availableMonths[0], MONTH_FORMAT) : undefined}
          maxDate={hasMonths
            ? moment(availableMonths[availableMonths.length - 1], MONTH_FORMAT).endOf('month')
            : undefined}
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
      </LocalizationProvider>
    </WindRosePeriodStepper>
  );
};

const WindRoseSeasonPicker: React.FC<WindRosePickerProps> = (
  props: WindRosePickerProps,
): React.JSX.Element => {
  const { month, availableMonths, onChange }: WindRosePickerProps = props;
  const labelId = useId();
  const seasons = useMemo(() => (
    getAvailablePeriodStarts(WindRosePeriodType.SEASON, availableMonths)
  ), [availableMonths]);
  const season = month ? getPeriodStartMonth(WindRosePeriodType.SEASON, month) : '';
  const step = (direction: 1 | -1): Nullable<string> => (
    month ? stepPeriod(WindRosePeriodType.SEASON, month, availableMonths, direction) : null
  );
  return (
    <WindRosePeriodStepper
      periodName="season"
      previousMonth={step(-1)}
      nextMonth={step(1)}
      onChange={onChange}
    >
      <FormControl size="small" fullWidth disabled={seasons.length <= 0}>
        <InputLabel id={labelId}>Season</InputLabel>
        <Select
          labelId={labelId}
          label="Season"
          value={seasons.includes(season) ? season : ''}
          onChange={(event: SelectChangeEvent<string>) => {
            // Views the season by the same month of the season as viewed now, where it has data
            const selectedMonth = getPeriodAnchorMonth(
              WindRosePeriodType.SEASON,
              event.target.value,
              month,
              availableMonths,
            );
            if (selectedMonth && (selectedMonth !== month)) {
              onChange(selectedMonth);
            }
          }}
          MenuProps={{ slotProps: { paper: { style: { maxHeight: '420px' } } } }}
        >
          {seasons.map((seasonStart: string): React.JSX.Element => (
            <MenuItem key={seasonStart} value={seasonStart}>
              {getPeriodLabel(WindRosePeriodType.SEASON, seasonStart)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </WindRosePeriodStepper>
  );
};

export interface WindRosePeriodPickerProps extends WindRosePickerProps {
  aggregation: WindRoseAggregation;
}

/**
 * Picks the year, season or month to view by a month (YYYY-MM) of it, following the aggregation.
 * Days are picked by the month they are in.
 */
export const WindRosePeriodPicker: React.FC<WindRosePeriodPickerProps> = (
  props: WindRosePeriodPickerProps,
): React.JSX.Element => {
  const {
    aggregation,
    month,
    availableMonths,
    onChange,
  }: WindRosePeriodPickerProps = props;
  switch (getAggregationPeriodType(aggregation)) {
    case WindRosePeriodType.YEAR:
      return (
        <WindRoseYearPicker month={month} availableMonths={availableMonths} onChange={onChange} />
      );
    case WindRosePeriodType.SEASON:
      return (
        <WindRoseSeasonPicker month={month} availableMonths={availableMonths} onChange={onChange} />
      );
    default:
      return (
        <WindRoseMonthPicker month={month} availableMonths={availableMonths} onChange={onChange} />
      );
  }
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
    aggregation,
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
      <WindRosePeriodPicker
        aggregation={aggregation}
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
 * Toggles between the annual, seasonal, monthly and daily wind rose aggregations
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
        if (Object.values(WindRoseAggregation).includes(value as WindRoseAggregation)) {
          dispatch(ActionCreator.setAggregation(value as WindRoseAggregation));
        }
      }}
    >
      <ToggleButton value={WindRoseAggregation.ANNUAL}>
        <CalendarViewMonthIcon className={classes.toggleIcon} />
        Annual
      </ToggleButton>
      <ToggleButton value={WindRoseAggregation.SEASONAL}>
        <DateRangeIcon className={classes.toggleIcon} />
        Seasonal
      </ToggleButton>
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
