import React, { useRef, useCallback, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import Skeleton from '@material-ui/lab/Skeleton';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import SwapIcon from '@material-ui/icons/SwapHoriz';

import Theme from '../Theme/Theme';
import TimeSeriesViewerContext, {
  TIME_STEPS,
  Y_AXIS_RANGE_MODES,
  Y_AXIS_RANGE_MODE_DETAILS,
  summarizeTimeSteps,
} from './TimeSeriesViewerContext';

const useStyles = makeStyles(theme => ({
  smallButton: {
    fontSize: '0.8rem',
    padding: theme.spacing(0.125, 0.75),
    whiteSpace: 'nowrap',
  },
  smallButtonIcon: {
    marginRight: theme.spacing(0.5),
    fontSize: '0.8rem',
  },
  optionButtonGroup: {
    height: theme.spacing(4),
    display: 'block',
  },
  optionButton: {
    height: theme.spacing(4),
    fontWeight: 600,
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    padding: theme.spacing(0, 1.5),
    whiteSpace: 'nowrap',
  },
  // Use !important here to override the Mui-selected class with higher priority
  optionButtonSelected: {
    color: '#fff !important',
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  yAxisRangeOuterContainer: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  yAxisRangeInnerContainer: {
    height: theme.spacing(15),
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: theme.spacing(2.5),
  },
  yAxisRangeOptions: {
    display: 'flex',
    alignItems: 'center',
  },
  yAxisRangeTextfieldContainer: {
    marginTop: theme.spacing(-0.5),
    marginRight: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  yAxisRangeTextField: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1.5),
    width: theme.spacing(12),
  },
  autoLabelDescription: {
    marginLeft: theme.spacing(1),
    color: theme.palette.grey[400],
    fontSize: '0.75rem',
  },
  standardDeviation: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(2),
    color: theme.palette.grey[400],
    fontSize: '0.75rem',
  },
}));

const boxShadow = alpha => `0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,${alpha}),0 0 0 1px rgba(0,0,0,0.02)`;
const NeonSlider = withStyles({
  root: {
    width: `calc(100% - ${Theme.spacing(6)}px)`,
    marginLeft: Theme.spacing(3),
    marginBottom: '24px !important',
  },
  rail: {
    height: 3,
  },
  track: {
    height: 7,
    marginTop: -2,
  },
  mark: {
    height: 12,
    marginTop: -5,
  },
  markActive: {
    height: 12,
    marginTop: -5,
    backgroundColor: Theme.palette.primary.main,
  },
  markLabel: {
    marginTop: Theme.spacing(1),
  },
  thumb: {
    height: Theme.spacing(3.5),
    width: Theme.spacing(1.5),
    backgroundColor: Theme.palette.grey[50],
    boxShadow: boxShadow(0.13),
    border: `2px solid ${Theme.palette.primary.main}`,
    borderRadius: Theme.spacing(0.5),
    marginTop: Theme.spacing(-1.75),
    marginLeft: Theme.spacing(-0.75),
    '&:focus,&:hover,&active': {
      boxShadow: boxShadow(0.3),
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: boxShadow(0.13),
      },
    },
  },
  valueLabel: {
    left: 'initial',
    fontWeight: 600,
    top: -20,
    whiteSpace: 'nowrap',
    '& span': {
      width: 'auto',
      height: 'auto',
      padding: Theme.spacing(0.5, 1),
      borderRadius: Theme.spacing(0.5),
      transform: 'none',
      '& span': {
        transform: 'none',
        padding: 0,
        borderRadius: 0,
      },
    },
  },
})(Slider);

const NeonVerticalSlider = withStyles({
  root: {
    margin: '4px 56px 32px 16px !important',
  },
  disabled: {
    '& .MuiSlider-track': {
      display: 'none',
    },
    '& .MuiSlider-thumb': {
      display: 'none',
    },
    '& .MuiSlider-markLabelActive': {
      color: 'unset',
    },
    '& .MuiSlider-markActive': {
      backgroundColor: 'currentColor',
    },
  },
  rail: {
    width: 3,
  },
  track: {
    width: '7px !important',
    marginLeft: -2,
  },
  mark: {
    width: 12,
    marginLeft: -5,
  },
  markActive: {
    width: 12,
    marginLeft: -5,
    backgroundColor: Theme.palette.primary.main,
  },
  markLabel: {
    marginLeft: Theme.spacing(1),
  },
  thumb: {
    height: Theme.spacing(1.5),
    width: Theme.spacing(3.5),
    backgroundColor: Theme.palette.grey[50],
    boxShadow: boxShadow(0.13),
    border: `2px solid ${Theme.palette.primary.main}`,
    borderRadius: Theme.spacing(0.5),
    marginTop: Theme.spacing(-0.75),
    marginLeft: `${Theme.spacing(-1.75)}px !important`,
    '&:focus,&:hover,&active': {
      boxShadow: boxShadow(0.3),
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: boxShadow(0.13),
      },
    },
  },
  valueLabel: {
    left: 'initial',
    fontWeight: 600,
    top: -20,
    whiteSpace: 'nowrap',
    '& span': {
      width: 'auto',
      height: 'auto',
      padding: Theme.spacing(0.5, 1),
      borderRadius: Theme.spacing(0.5),
      transform: 'none',
      '& span': {
        transform: 'none',
        padding: 0,
        borderRadius: 0,
      },
    },
  },
})(Slider);

/**
   y Axes - Scale Option
*/
const YAxisScaleOption = () => {
  const classes = useStyles(Theme);
  const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  const { yAxes, logscale } = state.selection;
  const classNames = {
    selected: `${classes.optionButton} ${classes.optionButtonSelected}`,
    deselected: classes.optionButton,
  };
  return (
    <React.Fragment>
      <ToggleButtonGroup
        exclusive
        color="primary"
        variant="outlined"
        size="small"
        className={classes.optionButtonGroup}
        value={logscale ? 'log' : 'lin'}
        onChange={(event, value) => {
          dispatch({ type: 'selectLogScale', logscale: value === 'log' });
        }}
      >
        <ToggleButton
          key="lin"
          value="lin"
          size="small"
          className={classNames[logscale ? 'deselected' : 'selected']}
        >
          Linear
        </ToggleButton>
        <ToggleButton
          key="log"
          value="log"
          size="small"
          className={classNames[logscale ? 'selected' : 'deselected']}
        >
          Logarithmic
        </ToggleButton>
      </ToggleButtonGroup>
      {yAxes.y2.units === null ? null : (
        <Button
          color="primary"
          variant="outlined"
          onClick={() => { dispatch({ type: 'selectSwapYAxes' }); }}
          className={classes.smallButton}
          style={{ marginTop: Theme.spacing(1) }}
        >
          <SwapIcon className={classes.smallButtonIcon} />
          Swap Y Axes
        </Button>
      )}
    </React.Fragment>
  );
};

/**
   y Axis - Range Option
*/
const YAxisRangeOption = (props) => {
  const { axis } = props;
  const classes = useStyles(Theme);
  const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  const classNames = {
    selected: `${classes.optionButton} ${classes.optionButtonSelected}`,
    deselected: classes.optionButton,
  };

  const {
    selection: {
      yAxes: {
        [axis]: {
          units, dataRange, rangeMode, axisRange, precision, standardDeviation,
        },
      },
    },
  } = state;

  const render = units && dataRange[0] !== null && dataRange[1] !== null;

  const isCustom = rangeMode === Y_AXIS_RANGE_MODES.CUSTOM;
  const customPad = Math.max((dataRange[1] || 0) * 0.25, standardDeviation * 2);
  const customMin = 0;
  const customMax = parseFloat(
    Math.max(axisRange[1], (dataRange[1] || 0) + customPad).toFixed(precision),
    10,
  );

  // Determine slider marks
  const marks = [
    customMin,
    (customMax - customMin) * 0.25,
    (customMax - customMin) * 0.5,
    (customMax - customMin) * 0.75,
    customMax,
  ].map(m => ({ value: m, label: m.toFixed(precision) }));
  const step = 10 ** (-1 * precision);

  return !render ? (
    <div className={classes.yAxisRangeOuterContainer}>
      <div className={classes.yAxisRangeOptions}>
        <Skeleton variant="rect" width={200} height={30} style={{ margin: Theme.spacing(0.5, 0) }} />
      </div>
      <div className={classes.yAxisRangeInnerContainer}>
        <div className={classes.yAxisRangeTextfieldContainer}>
          <Skeleton variant="rect" width={96} height={36} style={{ margin: Theme.spacing(1, 0) }} />
          <Skeleton variant="rect" width={96} height={36} style={{ margin: Theme.spacing(1, 0) }} />
        </div>
      </div>
    </div>
  ) : (
    <div className={classes.yAxisRangeOuterContainer}>
      <ToggleButtonGroup
        exclusive
        color="primary"
        variant="outlined"
        size="small"
        className={classes.optionButtonGroup}
        value={rangeMode}
        onChange={(event, value) => {
          dispatch({ type: 'selectYAxisRangeMode', axis, mode: value });
        }}
      >
        {Object.keys(Y_AXIS_RANGE_MODES).map(key => (
          <ToggleButton
            key={key}
            value={key}
            size="small"
            className={classNames[rangeMode !== key ? 'deselected' : 'selected']}
            title={Y_AXIS_RANGE_MODE_DETAILS[key].name}
          >
            {Y_AXIS_RANGE_MODE_DETAILS[key].name}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <div className={classes.yAxisRangeInnerContainer}>
        <div className={classes.yAxisRangeTextfieldContainer}>
          <TextField
            label="Max"
            type="number"
            margin="dense"
            inputProps={{ step }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            disabled={!isCustom}
            value={axisRange[1]}
            className={classes.yAxisRangeTextField}
            onChange={(event) => {
              const range = [axisRange[0], Math.min(event.target.value, customMax)];
              dispatch({ type: 'selectYAxisCustomRange', axis, range });
            }}
          />
          <TextField
            label="Min"
            type="number"
            margin="dense"
            inputProps={{ step }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            disabled={!isCustom}
            value={axisRange[0]}
            className={classes.yAxisRangeTextField}
            onChange={(event) => {
              const range = [Math.max(event.target.value, customMin), axisRange[1]];
              dispatch({ type: 'selectYAxisCustomRange', axis, range });
            }}
          />
          {/* eslint-disable react/jsx-one-expression-per-line */}
          <div className={classes.standardDeviation} title="Standard Deviation">
            <i>{`${String.fromCharCode(963)}`}</i> = {`${standardDeviation}`}
          </div>
          {/* eslint-enable react/jsx-one-expression-per-line */}
        </div>
        <NeonVerticalSlider
          disabled={!isCustom}
          style={{ display: isCustom ? 'inline-block' : 'none' }}
          step={step}
          marks={marks}
          orientation="vertical"
          data-selenium={`time-series-viewer.options.${axis}-axis.range-slider`}
          valueLabelDisplay="auto"
          min={customMin}
          max={customMax}
          value={[...axisRange]}
          onChange={(event, values) => {
            dispatch({
              type: 'selectYAxisCustomRange',
              axis,
              range: [
                Math.min(Math.max(values[0], customMin), customMax),
                Math.min(Math.max(values[1], customMin), customMax),
              ],
            });
          }}
        />
      </div>
    </div>
  );
};
YAxisRangeOption.propTypes = PropTypes.oneOf(['y1', 'y2']).isRequired;

/**
   x Axis - Roll Period Option
*/
let rollPeriodSliderDefault = { value: 1 };
const RollPeriodOption = () => {
  const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  const rollPeriodSliderRef = useRef(null);

  const { selection } = state;
  const {
    rollPeriod: currentRollPeriod,
    timeStep: selectedTimeStep,
    autoTimeStep,
  } = selection;
  const currentTimeStep = selectedTimeStep === 'auto' ? autoTimeStep : selectedTimeStep;

  const dateRangeMonths = selection.continuousDateRange.length;
  const timeStepSeconds = currentTimeStep ? TIME_STEPS[currentTimeStep].seconds : 1800;
  const rollStepsPerMonth = (30 * 24 * 60 * 60) / timeStepSeconds;
  const rollMin = 1;
  const rollMax = Math.floor(Math.max(dateRangeMonths * rollStepsPerMonth, currentRollPeriod) / 4);

  // Determine slider marks
  const interimMarks = (rollMax - rollMin) < 8 ? 2 : 3;
  const markValues = [1];
  for (let m = 1; m <= interimMarks; m += 1) {
    markValues.push(Math.floor(rollMax * (m / (interimMarks + 1))));
  }
  markValues.push(rollMax);
  const marks = markValues.map(m => ({ value: m, label: summarizeTimeSteps(m, currentTimeStep) }));

  // Function to apply changes to the slider's DOM as if it was controlled by state.
  // We can't control in state because doing so makes drag experience jerky and frustrating.
  // By not controlling the slider with state we can maintain a fluid experience and need
  // only this bit of logic (with a ref to the slider's DOM node) to keep the slider
  // DOM in sync as if it was controlled directly.
  const applySliderValue = useCallback((value) => {
    if (!parseInt(value, 10)) { return; }
    const currentValue = Math.min(Math.max(value, rollMin), rollMax);
    // Apply value to Slider DOM hidden input
    rollPeriodSliderRef.current
      .querySelector('input[type="hidden"]').setAttribute('value', currentValue);
    // Apply value to slider drag handle
    rollPeriodSliderRef.current.querySelector('span[role="slider"]')
      .setAttribute('aria-valuenow', currentValue.toString());
    // Apply value to slider track up to drag handle
    const newTrackWidth = `${(currentValue - 1) / (rollMax - 1) * 100}%`;
    rollPeriodSliderRef.current.querySelector('.MuiSlider-track').style.width = newTrackWidth;
  }, [rollPeriodSliderRef, rollMin, rollMax]);

  useLayoutEffect(() => {
    if (!rollPeriodSliderRef.current) { return; }
    const sliderValue = rollPeriodSliderRef.current.querySelector('input[type="hidden"]').value;
    if (sliderValue !== currentRollPeriod) { applySliderValue(currentRollPeriod); }
  }, [rollPeriodSliderRef, currentRollPeriod, rollMin, rollMax, applySliderValue]);

  if (!Object.isFrozen(rollPeriodSliderDefault)) {
    rollPeriodSliderDefault = { value: currentRollPeriod };
    Object.freeze(rollPeriodSliderDefault);
  }
  return !currentTimeStep ? (
    <Skeleton variant="rect" width="100%" height={56} />
  ) : (
    <div style={{ width: '100%' }}>
      <NeonSlider
        marks={marks}
        data-selenium="time-series-viewer.options.roll-period-slider"
        ref={rollPeriodSliderRef}
        defaultValue={rollPeriodSliderDefault.value}
        valueLabelDisplay="auto"
        valueLabelFormat={x => summarizeTimeSteps(x, currentTimeStep)}
        min={rollMin}
        max={rollMax}
        onChange={(event, value) => {
          applySliderValue(value);
        }}
        onChangeCommitted={(event, value) => {
          dispatch({
            type: 'setRollPeriod',
            rollPeriod: Math.min(Math.max(value, rollMin), rollMax),
          });
        }}
      />
    </div>
  );
};

/**
   x Axis - Time Step Option
*/
const TimeStepOption = () => {
  const classes = useStyles(Theme);
  const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  const { availableTimeSteps } = state;
  const { timeStep: selectedTimeStep } = state.selection;
  const handleChangeTimeStep = (event, timeStep) => {
    dispatch({ type: 'selectTimeStep', timeStep });
  };
  return (
    <ToggleButtonGroup
      exclusive
      color="primary"
      variant="outlined"
      size="small"
      className={classes.optionButtonGroup}
      value={selectedTimeStep}
      onChange={handleChangeTimeStep}
    >
      {Array.from(availableTimeSteps).map((timeStep) => {
        const className = timeStep === selectedTimeStep
          ? `${classes.optionButton} ${classes.optionButtonSelected}`
          : classes.optionButton;
        return (
          <ToggleButton key={timeStep} value={timeStep} size="small" className={className}>
            {timeStep}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
};

/**
   Option Titles and Descriptions
*/
const OPTIONS = {
  Y_AXIS_SCALE: {
    title: 'Scale',
    description: 'Toggle between linear and logarithmic scales on all y axes.',
    Component: YAxisScaleOption,
  },
  Y1_AXIS_RANGE: {
    title: 'y1 Range',
    description: 'Set min and max range for y1 axis ({units})',
    Component: () => <YAxisRangeOption axis="y1" />,
    axis: 'y1',
  },
  Y2_AXIS_RANGE: {
    title: 'y2 Range',
    description: 'Set min and max range for y2 axis ({units})',
    Component: () => <YAxisRangeOption axis="y2" />,
    axis: 'y2',
  },
  ROLL_PERIOD: {
    title: 'Roll Period',
    description: 'Set a rolling window to smooth out noisy data.',
    Component: RollPeriodOption,
  },
  TIME_STEP: {
    title: 'Time Step',
    description: 'Set a smaller time step to see NEON data aggregated with finer granularity.',
    Component: TimeStepOption,
  },
};

/**
   Main Component
*/
export default function TimeSeriesViewerAxes() {
  const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  const { selection } = state;
  const renderOption = (key) => {
    const {
      title,
      description: rawDescription,
      Component,
      axis,
    } = OPTIONS[key];
    let description = rawDescription;
    if (description.indexOf('{units}') && axis) {
      description = rawDescription.replace('{units}', selection.yAxes[axis].units);
    }
    return (
      <React.Fragment>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="caption" style={{ color: Theme.palette.grey[400] }}>
          {description}
        </Typography>
        <div style={{ width: '100%', marginTop: Theme.spacing(1) }}>
          <Component />
        </div>
      </React.Fragment>
    );
  };
  const hasY2Axis = selection.yAxes.y2.units !== null;
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>y Axes</Typography>
      <Grid container spacing={2} style={{ marginBottom: Theme.spacing(3) }}>
        <Grid item xs={12}>{renderOption('Y_AXIS_SCALE')}</Grid>
        <Grid item xs={12} md={hasY2Axis ? 6 : 12}>{renderOption('Y1_AXIS_RANGE')}</Grid>
        {!hasY2Axis ? null : (
          <Grid item xs={12} md={6}>{renderOption('Y2_AXIS_RANGE')}</Grid>
        )}
      </Grid>
      <Typography variant="h6" gutterBottom>x Axis (Time)</Typography>
      <Grid container spacing={2}>
        {!state.availableTimeSteps.size < 3 ? null : (
          <Grid item xs={12} lg={4} xl={3}>{renderOption('TIME_STEP')}</Grid>
        )}
        <Grid item xs={12} lg={8} xl={9}>{renderOption('ROLL_PERIOD')}</Grid>
      </Grid>
    </React.Fragment>
  );
}
