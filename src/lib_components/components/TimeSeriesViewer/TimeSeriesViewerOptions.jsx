import React, { useRef, useCallback, useEffect } from 'react';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

import Skeleton from '@material-ui/lab/Skeleton';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import NoneIcon from '@material-ui/icons/NotInterested';
import SelectAllIcon from '@material-ui/icons/DoneAll';
import SelectNoneIcon from '@material-ui/icons/Clear';
import SwapIcon from '@material-ui/icons/SwapHoriz';

import Theme from '../Theme/Theme';
import TimeSeriesViewerContext, { TIME_STEPS, summarizeTimeSteps } from './TimeSeriesViewerContext';

const useStyles = makeStyles(theme => ({
  noneContainer: {
    color: theme.palette.grey[400],
    display: 'flex',
    alignItems: 'flex-start',
  },
  noneIcon: {
    color: theme.palette.grey[400],
    margin: theme.spacing(0.375, 0.5, 0, 0),
    fontSize: '1rem',
  },
  noneLabel: {
    fontSize: '0.95rem',
  },
  qualityFlagsButtons: {
    flexGrow: 0,
    marginRight: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
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
}));

const boxShadow = alpha => `0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,${alpha}),0 0 0 1px rgba(0,0,0,0.02)`;
const RollPeriodSlider = withStyles({
  root: {
    width: `calc(100% - ${Theme.spacing(6)}px)`,
    marginLeft: Theme.spacing(3),
    marginBottom: Theme.spacing(4),
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

/**
   Roll Period Option
*/
let sliderDefault = { value: 1 };
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
  const rollMax = Math.max(dateRangeMonths * rollStepsPerMonth, currentRollPeriod);

  // Determine slider marks
  const interimMarks = 3;
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

  if (!Object.isFrozen(sliderDefault)) {
    sliderDefault = { value: currentRollPeriod };
    Object.freeze(sliderDefault);
  }
  return !currentTimeStep ? (
    <Skeleton variant="rect" width="100%" height={56} />
  ) : (
    <div style={{ width: '100%' }}>
      <RollPeriodSlider
        marks={marks}
        data-selenium="time-series-viewer.options.roll-period-slider"
        ref={rollPeriodSliderRef}
        defaultValue={sliderDefault.value}
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
   Y-Axis Scale Option
*/
const YAxesOption = () => {
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
   Quality Flags Option
*/
const QualityFlagsOption = () => {
  const classes = useStyles(Theme);
  const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  const { availableQualityFlags } = state;
  const { qualityFlags: selectedQualityFlags } = state.selection;
  const toggleFlag = qualityFlag => (event) => {
    dispatch({ type: 'selectToggleQualityFlag', qualityFlag, selected: event.target.checked });
  };
  return !availableQualityFlags.size ? (
    <div className={classes.noneContainer}>
      <NoneIcon className={classes.noneIcon} />
      <Typography variant="body1" className={classes.noneLabel}>
        No Quality Flags Available
      </Typography>
    </div>
  ) : (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      {availableQualityFlags.size > 1 ? (
        <div className={classes.qualityFlagsButtons}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => { dispatch({ type: 'selectAllQualityFlags' }); }}
            className={classes.smallButton}
            style={{ marginBottom: Theme.spacing(1) }}
          >
            <SelectAllIcon className={classes.smallButtonIcon} />
            {`Select All (${availableQualityFlags.size})`}
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => { dispatch({ type: 'selectNoneQualityFlags' }); }}
            className={classes.smallButton}
          >
            <SelectNoneIcon className={classes.smallButtonIcon} />
            Select None
          </Button>
        </div>
      ) : null}
      <div style={{ flexGrow: 1, marginTop: Theme.spacing(-0.5) }}>
        <FormGroup>
          {Array.from(availableQualityFlags).map((qf) => {
            const checked = selectedQualityFlags.includes(qf);
            const captionStyle = { display: 'block', color: Theme.palette.grey[400] };
            return (
              <FormControlLabel
                key={qf}
                style={{ alignItems: 'flex-start', marginBottom: Theme.spacing(1) }}
                control={(
                  <Checkbox
                    value={qf}
                    color="primary"
                    checked={checked}
                    onChange={toggleFlag(qf)}
                  />
                )}
                label={(
                  <div style={{ paddingTop: Theme.spacing(0.5) }}>
                    <Typography variant="body2">
                      {qf}
                      <Typography variant="caption" style={captionStyle}>
                        {state.variables[qf].description}
                      </Typography>
                    </Typography>
                  </div>
                )}
              />
            );
          })}
        </FormGroup>
      </div>
    </div>
  );
};

/**
   Time Step Option
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
    title: 'Y-Axes',
    description: 'Toggle between linear and logarithmic scales on all y axes.',
    Component: YAxesOption,
  },

  ROLL_PERIOD: {
    title: 'Roll Period',
    description: 'Set a rolling window to smooth out noisy data.',
    Component: RollPeriodOption,
  },

  QUALITY_FLAGS: {
    title: 'Quality Flags',
    description: 'Enabling one or more quality flags will highlight regions on the chart to illiustrate the results of data quality tests.',
    Component: QualityFlagsOption,
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
export default function TimeSeriesViewerOptions() {
  const renderOption = (key) => {
    const { title, description, Component } = OPTIONS[key];
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
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>{renderOption('Y_AXIS_SCALE')}</Grid>
      <Grid item xs={12} sm={6}>{renderOption('TIME_STEP')}</Grid>
      <Grid item xs={12}>{renderOption('ROLL_PERIOD')}</Grid>
      <Grid item xs={12}>{renderOption('QUALITY_FLAGS')}</Grid>
    </Grid>
  );
}
