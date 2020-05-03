import React, { useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import Skeleton from '@material-ui/lab/Skeleton';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import SwapIcon from '@material-ui/icons/SwapHoriz';
import CenterIcon from '@material-ui/icons/VerticalAlignCenter';

import Theme from '../Theme/Theme';
import TimeSeriesViewerContext, { TIME_STEPS, summarizeTimeSteps } from './TimeSeriesViewerContext';

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
    marginTop: theme.spacing(-1),
  },
  yAxisRangeInnerContainer: {
    height: theme.spacing(22),
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: theme.spacing(2),
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
  centerButtonDescription: {
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
    margin: '0px 56px 32px 16px !important',
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
const yAxisRangeSliderDefaults = {
  y1: { value: [0, 0.01] },
  y2: { value: [0, 0.01] },
};
const YAxisRangeOption = (props) => {
  const { axis } = props;
  const classes = useStyles(Theme);
  const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  const yAxisRangeSliderRef = useRef(null);

  const { selection } = state;
  const { yAxes } = selection;
  const { dataRange, selectedRange: rawSelectedRange, standardDeviation } = yAxes[axis];
  const isAuto = rawSelectedRange === 'auto';
  const selectedRange = isAuto ? [null, null] : rawSelectedRange;

  const render = yAxes[axis].units && dataRange[0] !== null && dataRange[1] !== null;

  const rangeMin = 0;
  let rangeMax = dataRange[1] ? dataRange[1] * 1.20 : 0.01;
  const precision = Math.abs(Math.floor(Math.min(Math.log10(rangeMax), 0)))
    + (Math.log10(rangeMax) >= 2 ? 0 : 1);
  rangeMax = parseFloat(rangeMax.toFixed(precision), 10);
  const fixedStandardDeviation = parseFloat(standardDeviation.toFixed(precision), 10);

  // Determine slider marks
  const marks = [
    rangeMin,
    (rangeMax - rangeMin) * 0.25,
    (rangeMax - rangeMin) * 0.5,
    (rangeMax - rangeMin) * 0.75,
    rangeMax,
  ].map(m => ({ value: m, label: m.toFixed(precision) }));
  const step = 10 ** (-1 * precision);

  // Function to apply changes to the slider's DOM as if it was controlled by state.
  // We can't control in state because doing so makes drag experience jerky and frustrating.
  // By not controlling the slider with state we can maintain a fluid experience and need
  // only this bit of logic (with a ref to the slider's DOM node) to keep the slider
  // DOM in sync as if it was controlled directly.
  const applySliderValues = useCallback((values) => {
    if (!Array.isArray(values) || values.length !== 2 || values[0] > values[1]) { return; }
    const limited = [Math.max(values[0], rangeMin), Math.min(values[1], rangeMax)];

    // Derive new percentage values for bottom and height styles of slider DOM elements
    const newBottoms = [
      `${(limited[0] / (rangeMax - rangeMin)) * 100}%`,
      `${(limited[1] / (rangeMax - rangeMin)) * 100}%`,
    ];

    // Apply values to Slider DOM hidden input
    yAxisRangeSliderRef.current
      .querySelector('input[type="hidden"]').value = limited.join(',');

    // Apply values to slider drag handles
    [0, 1].forEach((idx) => {
      yAxisRangeSliderRef.current
        .querySelector(`span[role="slider"][data-index="${idx}"]`)
        .setAttribute('aria-valuenow', limited[idx].toString());
      yAxisRangeSliderRef.current
        .querySelector(`span[role="slider"][data-index="${idx}"]`)
        .style.bottom = newBottoms[idx];
      yAxisRangeSliderRef.current
        .querySelector(`span[role="slider"][data-index="${idx}"] > span > span > span`)
        .innerText = limited[idx];
    });

    // Apply values to slider track between drag handles
    const newTrackHeight = `${((limited[1] - limited[0]) / (rangeMax - rangeMin)) * 100}%`;
    yAxisRangeSliderRef.current.querySelector('.MuiSlider-track').style.height = newTrackHeight;
    // eslint-disable-next-line prefer-destructuring
    yAxisRangeSliderRef.current.querySelector('.MuiSlider-track').style.bottom = newBottoms[0];
  }, [yAxisRangeSliderRef, rangeMin, rangeMax]);

  useEffect(() => {
    if (!yAxisRangeSliderRef.current || !render || isAuto) { return; }
    const sliderValues = yAxisRangeSliderRef.current.querySelector('input[type="hidden"]').value;
    if (sliderValues !== selectedRange.join(',')) {
      applySliderValues(selectedRange);
    }
  }, [yAxisRangeSliderRef, selectedRange, applySliderValues, render, isAuto]);

  if (!Object.isFrozen(yAxisRangeSliderDefaults[axis])) {
    yAxisRangeSliderDefaults[axis] = {
      value: [
        selectedRange[0] === null ? rangeMin : selectedRange[0],
        selectedRange[1] === null ? rangeMax : selectedRange[1],
      ],
    };
    Object.freeze(yAxisRangeSliderDefaults[axis]);
  }
  const handleToggleCheckbox = () => {
    dispatch({
      type: 'selectYAxisRange',
      axis,
      range: isAuto ? [rangeMin, rangeMax] : 'auto',
    });
  };
  const autoLabelStyles = {
    [true]: { fontWeight: 600 },
    [false]: { color: Theme.palette.grey[400] },
  };
  return !render ? (
    <div className={classes.yAxisRangeOuterContainer}>
      <div className={classes.yAxisRangeOptions}>
        <Skeleton variant="rect" width={200} height={26} style={{ margin: Theme.spacing(1, 0) }} />
      </div>
      <div className={classes.yAxisRangeInnerContainer}>
        <div className={classes.yAxisRangeTextfieldContainer}>
          <Skeleton variant="rect" width={96} height={40} style={{ margin: Theme.spacing(1, 0) }} />
          <Skeleton variant="rect" width={96} height={40} style={{ margin: Theme.spacing(1, 0) }} />
          <Skeleton variant="rect" width={76} height={26} style={{ margin: Theme.spacing(1, 0) }} />
        </div>
        <Skeleton variant="rect" width={56} height={Theme.spacing(20)} />
      </div>
    </div>
  ) : (
    <div className={classes.yAxisRangeOuterContainer}>
      <div className={classes.yAxisRangeOptions}>
        <FormControlLabel
          label={(
            <div>
              <span style={autoLabelStyles[isAuto]}>Auto</span>
              <span className={classes.autoLabelDescription}>(fit to data; start at zero)</span>
            </div>
          )}
          control={
            <Checkbox checked={isAuto} onChange={handleToggleCheckbox} color="primary" />
          }
        />
      </div>
      <div className={classes.yAxisRangeInnerContainer}>
        <div className={classes.yAxisRangeTextfieldContainer}>
          <TextField
            label="Max"
            type="number"
            margin="dense"
            inputProps={{ step }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            disabled={isAuto}
            value={isAuto ? '' : selectedRange[1]}
            className={classes.yAxisRangeTextField}
            onChange={(event) => {
              const range = [selectedRange[0], Math.min(event.target.value, rangeMax)];
              dispatch({ type: 'selectYAxisRange', axis, range });
            }}
          />
          <TextField
            label="Min"
            type="number"
            margin="dense"
            inputProps={{ step }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            disabled={isAuto}
            value={isAuto ? '' : selectedRange[0]}
            className={classes.yAxisRangeTextField}
            onChange={(event) => {
              const range = [Math.max(event.target.value, rangeMin), selectedRange[1]];
              dispatch({ type: 'selectYAxisRange', axis, range });
            }}
          />
          <Button
            color="primary"
            variant="outlined"
            className={classes.smallButton}
            style={{ marginTop: Theme.spacing(1.5) }}
            onClick={() => {
              const range = [
                Math.max(dataRange[0] - fixedStandardDeviation, 0),
                dataRange[1] + fixedStandardDeviation,
              ];
              dispatch({ type: 'selectYAxisRange', axis, range });
            }}
          >
            <CenterIcon className={classes.smallButtonIcon} />
            Center
          </Button>
          <div className={classes.centerButtonDescription}>
            Fit around data by one standard deviation
          </div>
        </div>
        <NeonVerticalSlider
          disabled={isAuto}
          step={step}
          marks={marks}
          orientation="vertical"
          data-selenium="time-series-viewer.options.roll-period-slider"
          ref={yAxisRangeSliderRef}
          defaultValue={[...yAxisRangeSliderDefaults[axis].value]}
          valueLabelDisplay="auto"
          min={rangeMin}
          max={rangeMax}
          onChange={(event, values) => {
            applySliderValues(values);
          }}
          onChangeCommitted={(event, values) => {
            dispatch({
              type: 'selectYAxisRange',
              axis,
              range: [
                Math.min(Math.max(values[0], rangeMin), rangeMax),
                Math.min(Math.max(values[1], rangeMin), rangeMax),
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
    rollPeriodSliderRef.current.querySelector('input[type="hidden"]').value = currentValue;
    // Apply value to slider drag handle
    rollPeriodSliderRef.current.querySelector('span[role="slider"]')
      .setAttribute('aria-valuenow', currentValue.toString());
    // Apply value to slider track up to drag handle
    const newTrackWidth = `${(currentValue - 1) / (rollMax - 1) * 100}%`;
    rollPeriodSliderRef.current.querySelector('.MuiSlider-track').style.width = newTrackWidth;
  }, [rollPeriodSliderRef, rollMin, rollMax]);

  useEffect(() => {
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
