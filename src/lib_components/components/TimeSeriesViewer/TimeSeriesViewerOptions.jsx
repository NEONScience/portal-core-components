import React, { useRef, useCallback, useEffect } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

import Theme from '../Theme/Theme';
import TimeSeriesViewerContext, { TIME_STEPS } from './TimeSeriesViewerContext';

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
  const { rollPeriod: currentRollPeriod, timeStep: currentTimeStep } = selection.options;

  const dateRangeMonths = selection.continuousDateRange.length;
  const timeStepSeconds = currentTimeStep ? TIME_STEPS[currentTimeStep].seconds : 1800;
  const rollStepsPerMonth = (30 * 24 * 60 * 60) / timeStepSeconds;
  const rollMin = 1;
  const rollMax = Math.max(dateRangeMonths * rollStepsPerMonth, currentRollPeriod);

  // Determine slider marks
  const getMarkLabel = (val) => {
    if (val === 1) { return 'none'; }
    const seconds = val * timeStepSeconds;
    const breaks = [3600, 86400, 2592000, 31536000];
    const intervals = ['hour', 'day', 'month', 'year'];
    const breakIdx = breaks.reduce((acc, cur, idx) => ((seconds > cur) ? idx : acc), 0);
    let value = (seconds / breaks[breakIdx]).toFixed(1);
    if (value.slice(value.length - 1) === '0') { value = value.slice(0, value.length - 2); }
    return `${value} ${intervals[breakIdx]}${value === '1' ? '' : 's'}`;
  };
  const interimMarks = 3;
  const markValues = [1];
  for (let m = 1; m <= interimMarks; m += 1) {
    markValues.push(Math.floor(rollMax * (m / (interimMarks + 1))));
  }
  markValues.push(rollMax);
  const marks = markValues.map(m => ({ value: m, label: getMarkLabel(m) }));

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
  return !currentTimeStep ? null : (
    <div style={{ width: '100%' }}>
      <RollPeriodSlider
        marks={marks}
        data-selenium="time-series-viewer.options.roll-period-slider"
        ref={rollPeriodSliderRef}
        defaultValue={sliderDefault.value}
        valueLabelDisplay="auto"
        valueLabelFormat={x => getMarkLabel(x)}
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
   Option Titles and Descriptions
*/
const OPTIONS = {
  Y_AXIS_SCALE: {
    title: 'Y-Axis Scale',
    description: 'foo bar qux',
    Component: () => null,
  },

  ROLL_PERIOD: {
    title: 'Roll Period',
    description: 'foo bar qux',
    Component: RollPeriodOption,
  },

  QUALITY_FLAGS: {
    title: 'Quality Flags',
    description: 'foo bar qux',
    Component: () => null,
  },

  TIME_STEP: {
    title: 'Time Step',
    description: 'foo bar qux',
    Component: () => null,
  },
};

/**
   Main Component
*/
export default function TimeSeriesViewerOptions() {
  return (
    <div style={{ width: '100%' }}>
      {Object.keys(OPTIONS).map((optionKey) => {
        const { title, description, Component } = OPTIONS[optionKey];
        return (
          <div key={optionKey} style={{ width: '100%', marginBottom: Theme.spacing(2) }}>
            <Typography variant="subtitle2">{title}</Typography>
            <Typography variant="caption" style={{ color: Theme.palette.grey[400] }}>
              {description}
            </Typography>
            <Component />
          </div>
        );
      })}
    </div>
  );
}
