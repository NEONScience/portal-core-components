"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TimeSeriesViewerAxes;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _lodash = require("lodash");
var _styles = require("@material-ui/core/styles");
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _Slider = _interopRequireDefault(require("@material-ui/core/Slider"));
var _TextField = _interopRequireDefault(require("@material-ui/core/TextField"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _Skeleton = _interopRequireDefault(require("@material-ui/lab/Skeleton"));
var _ToggleButton = _interopRequireDefault(require("@material-ui/lab/ToggleButton"));
var _ToggleButtonGroup = _interopRequireDefault(require("@material-ui/lab/ToggleButtonGroup"));
var _SwapHoriz = _interopRequireDefault(require("@material-ui/icons/SwapHoriz"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _TimeSeriesViewerContext = _interopRequireWildcard(require("./TimeSeriesViewerContext"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const useStyles = (0, _styles.makeStyles)(theme => ({
  optionsContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  smallButton: {
    fontSize: '0.55rem',
    padding: theme.spacing(0.25, 0.75),
    whiteSpace: 'nowrap'
  },
  smallButtonIcon: {
    marginRight: theme.spacing(0.5),
    fontSize: '0.8rem'
  },
  optionButtonGroup: {
    height: theme.spacing(4),
    display: 'block'
  },
  optionButton: {
    height: theme.spacing(4),
    fontWeight: 600,
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    padding: theme.spacing(0, 1.5),
    whiteSpace: 'nowrap'
  },
  // Use !important here to override the Mui-selected class with higher priority
  optionButtonSelected: {
    color: '#fff !important',
    backgroundColor: "".concat(theme.palette.primary.main, " !important")
  },
  optionExtraDescription: {
    display: 'block',
    marginTop: theme.spacing(-1),
    marginBottom: theme.spacing(1),
    color: theme.palette.grey[400]
  },
  yAxesRangesContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  yAxisRangeOuterContainer: {
    width: '100%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(4),
    minWidth: theme.spacing(33) // to accomodate button group
  },
  yAxisRangeInnerContainer: {
    height: theme.spacing(15),
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: theme.spacing(2.5)
  },
  yAxisRangeOptions: {
    display: 'flex',
    alignItems: 'center'
  },
  yAxisRangeTextfieldContainer: {
    marginTop: theme.spacing(-0.5),
    marginRight: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  yAxisRangeTextField: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1.5),
    width: theme.spacing(15)
  },
  autoLabelDescription: {
    marginLeft: theme.spacing(1),
    color: theme.palette.grey[400],
    fontSize: '0.75rem'
  },
  standardDeviation: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(2),
    color: theme.palette.grey[400],
    fontSize: '0.75rem'
  },
  horizSlider: {
    width: "calc(100% - ".concat(theme.spacing(6), "px)"),
    marginLeft: theme.spacing(3),
    marginBottom: '24px !important'
  },
  vertSlider: {
    margin: '4px 56px 32px 16px !important'
  }
}));

/**
   y Axes - Scale Option
*/
const YAxisScaleOption = () => {
  const classes = useStyles(_Theme.default);
  const [state, dispatch] = _TimeSeriesViewerContext.default.useTimeSeriesViewerState();
  const {
    yAxes,
    logscale
  } = state.selection;
  const classNames = {
    selected: "".concat(classes.optionButton, " ").concat(classes.optionButtonSelected),
    deselected: classes.optionButton
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      minWidth: _Theme.default.spacing(21.5)
    }
  }, /*#__PURE__*/_react.default.createElement(_ToggleButtonGroup.default, {
    exclusive: true,
    color: "primary",
    variant: "outlined",
    size: "small",
    className: classes.optionButtonGroup,
    value: logscale ? 'log' : 'lin',
    onChange: (event, value) => {
      dispatch({
        type: 'selectLogScale',
        logscale: value === 'log'
      });
    }
  }, /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
    key: "lin",
    value: "lin",
    size: "small",
    className: classNames[logscale ? 'deselected' : 'selected']
  }, "Linear"), /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
    key: "log",
    value: "log",
    size: "small",
    className: classNames[logscale ? 'selected' : 'deselected']
  }, "Logarithmic")), yAxes.y2.units === null ? null : /*#__PURE__*/_react.default.createElement(_Button.default, {
    color: "primary",
    variant: "outlined",
    onClick: () => {
      dispatch({
        type: 'selectSwapYAxes'
      });
    },
    className: classes.smallButton,
    style: {
      marginTop: _Theme.default.spacing(1)
    }
  }, /*#__PURE__*/_react.default.createElement(_SwapHoriz.default, {
    className: classes.smallButtonIcon
  }), "Swap Y Axes"));
};

/**
   y Axis - Range Option
*/
const YAxisRangeOption = props => {
  const {
    axis
  } = props;
  const classes = useStyles(_Theme.default);
  const classNames = {
    selected: "".concat(classes.optionButton, " ").concat(classes.optionButtonSelected),
    deselected: classes.optionButton
  };
  const [state, dispatch] = _TimeSeriesViewerContext.default.useTimeSeriesViewerState();
  const {
    selection: {
      logscale,
      yAxes: {
        [axis]: {
          units,
          dataRange,
          rangeMode,
          axisRange,
          precision,
          standardDeviation
        }
      }
    }
  } = state;

  // Local state for the range min/max as we change it. This lets us change the range with
  // controlled components without having to send all updates through the main context reducer,
  // which would otherwise result in poor performance in some places and inability to make changes
  // we'd expect to be able to make in others.
  const [activeRange, setActiveRange] = (0, _react.useState)([...axisRange]);
  const [isActivelySetting, setIsActivelySetting] = (0, _react.useState)(false);
  (0, _react.useEffect)(() => {
    if ((axisRange[0] !== activeRange[0] || axisRange[1] !== activeRange[1]) && !isActivelySetting) {
      setActiveRange([...axisRange]);
    }
  }, [axisRange, activeRange, isActivelySetting, setActiveRange]);
  const render = units && dataRange[0] !== null && dataRange[1] !== null;
  const isCustom = rangeMode === _TimeSeriesViewerContext.Y_AXIS_RANGE_MODES.CUSTOM;
  const customPad = Math.max((dataRange[1] - dataRange[0]) * 0.3, standardDeviation * 3);
  const customMin = dataRange[0] >= 0 || logscale ? 0 : parseFloat(Math.min(axisRange[0], (dataRange[0] || 0) - customPad).toFixed(precision), 10);
  const customMax = Math.max(parseFloat(Math.max(axisRange[1], (dataRange[1] || 0) + customPad).toFixed(precision), 10), 0);

  // Determine slider marks
  // There's probably a slick mathematical way to do this, but essentially the goal here is always
  // 5 marks roughly evenly spaced. If the min is negative then we want a guaranteed mark at zero
  let marks = [];
  if (customMin !== customMax) {
    const spread = customMax - customMin;
    if (customMin >= 0) {
      marks = [customMin, spread * 0.25, spread * 0.5, spread * 0.75, customMax];
    } else if (customMax === 0) {
      marks = [customMin, customMin * 0.75, customMin * 0.5, customMin * 0.25, 0];
    } else if (customMax / spread >= 2 / 3) {
      marks = [customMin, 0, customMax * (1 / 3), customMax * (2 / 3), customMax];
    } else if (customMax / spread >= 1 / 3) {
      marks = [customMin, customMin * 0.5, 0, customMax * 0.5, customMax];
    } else {
      marks = [customMin, customMin * (2 / 3), customMin * (1 / 3), 0, customMax];
    }
    marks = marks.map(m => ({
      value: m,
      label: m.toFixed(precision)
    }));
  }
  const step = 10 ** (-1 * precision);

  // Debounce onchange functions for the text inputs so that we can type incomplete numbers
  // without immediately being corrected by the main context recuder.
  const setMax = value => {
    const range = [axisRange[0], Math.min(value, customMax)];
    dispatch({
      type: 'selectYAxisCustomRange',
      axis,
      range
    });
  };
  const setMin = value => {
    const range = [Math.max(value, customMin), axisRange[1]];
    dispatch({
      type: 'selectYAxisCustomRange',
      axis,
      range
    });
  };
  const debounceSetMax = (0, _lodash.debounce)(value => {
    setMax(value);
  }, 200);
  const debounceSetMin = (0, _lodash.debounce)(value => {
    setMin(value);
  }, 200);
  return !render ? /*#__PURE__*/_react.default.createElement("div", {
    className: classes.yAxisRangeOuterContainer
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.yAxisRangeOptions
  }, /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
    variant: "rect",
    width: 200,
    height: 30,
    style: {
      margin: _Theme.default.spacing(0.5, 0)
    }
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.yAxisRangeInnerContainer
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.yAxisRangeTextfieldContainer
  }, /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
    variant: "rect",
    width: 96,
    height: 36,
    style: {
      margin: _Theme.default.spacing(1, 0)
    }
  }), /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
    variant: "rect",
    width: 96,
    height: 36,
    style: {
      margin: _Theme.default.spacing(1, 0)
    }
  })))) : /*#__PURE__*/_react.default.createElement("div", {
    className: classes.yAxisRangeOuterContainer
  }, !logscale || dataRange[0] >= 0 ? null : /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "caption",
    className: classes.optionExtraDescription
  }, "Negative values are clipped while in logarithmic scale"), /*#__PURE__*/_react.default.createElement(_ToggleButtonGroup.default, {
    exclusive: true,
    color: "primary",
    variant: "outlined",
    size: "small",
    className: classes.optionButtonGroup,
    value: rangeMode,
    onChange: (event, value) => {
      dispatch({
        type: 'selectYAxisRangeMode',
        axis,
        mode: value
      });
    }
  }, Object.keys(_TimeSeriesViewerContext.Y_AXIS_RANGE_MODES).map(key => /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
    key: key,
    value: key,
    size: "small",
    className: classNames[rangeMode !== key ? 'deselected' : 'selected'],
    title: _TimeSeriesViewerContext.Y_AXIS_RANGE_MODE_DETAILS[key].description
  }, _TimeSeriesViewerContext.Y_AXIS_RANGE_MODE_DETAILS[key].name))), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.yAxisRangeInnerContainer
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.yAxisRangeTextfieldContainer
  }, /*#__PURE__*/_react.default.createElement(_TextField.default, {
    label: "Max",
    type: "number",
    margin: "dense",
    inputProps: {
      step
    },
    InputLabelProps: {
      shrink: true
    },
    variant: "outlined",
    disabled: !isCustom,
    value: activeRange[1],
    className: classes.yAxisRangeTextField,
    onFocus: () => {
      setIsActivelySetting(true);
    },
    onBlur: event => {
      setMax(event.target.value);
      setIsActivelySetting(false);
    },
    onChange: event => {
      setActiveRange([activeRange[0], event.target.value]);
      debounceSetMax(event.target.value);
    }
  }), /*#__PURE__*/_react.default.createElement(_TextField.default, {
    label: "Min",
    type: "number",
    margin: "dense",
    inputProps: {
      step
    },
    InputLabelProps: {
      shrink: true
    },
    variant: "outlined",
    disabled: !isCustom,
    value: activeRange[0],
    className: classes.yAxisRangeTextField,
    onFocus: () => {
      setIsActivelySetting(true);
    },
    onBlur: event => {
      setMin(event.target.value);
      setIsActivelySetting(false);
    },
    onChange: event => {
      setActiveRange([event.target.value, activeRange[1]]);
      debounceSetMin(event.target.value);
    }
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.standardDeviation,
    title: "Standard Deviation"
  }, /*#__PURE__*/_react.default.createElement("i", null, "".concat(String.fromCharCode(963))), " = ", "".concat(standardDeviation))), /*#__PURE__*/_react.default.createElement(_Slider.default, {
    disabled: !isCustom,
    className: classes.vertSlider,
    style: {
      display: isCustom ? 'inline-block' : 'none'
    },
    step: step,
    marks: marks,
    orientation: "vertical",
    "data-selenium": "time-series-viewer.options.".concat(axis, "-axis.range-slider"),
    valueLabelDisplay: "auto",
    min: customMin,
    max: customMax,
    value: [...axisRange],
    valueLabelFormat: x => x.toFixed(precision),
    onChange: (event, values) => {
      const range = values.map(v => parseFloat(Math.min(Math.max(v, customMin), customMax).toFixed(precision), 10));
      dispatch({
        type: 'selectYAxisCustomRange',
        axis,
        range
      });
    }
  })));
};
YAxisRangeOption.propTypes = _propTypes.default.oneOf(['y1', 'y2']).isRequired;

/**
   x Axis - Roll Period Option
*/
const RollPeriodOption = () => {
  const [state, dispatch] = _TimeSeriesViewerContext.default.useTimeSeriesViewerState();
  const classes = useStyles(_Theme.default);
  const {
    selection
  } = state;
  const {
    rollPeriod: currentRollPeriod,
    timeStep: selectedTimeStep,
    autoTimeStep
  } = selection;
  const currentTimeStep = selectedTimeStep === 'auto' ? autoTimeStep : selectedTimeStep;
  const dateRangeMonths = selection.continuousDateRange.length;
  const timeStepSeconds = currentTimeStep ? _TimeSeriesViewerContext.TIME_STEPS[currentTimeStep].seconds : 1800;
  const rollStepsPerMonth = 30 * 24 * 60 * 60 / timeStepSeconds;
  const rollMin = 1;
  const rollMax = Math.floor(Math.max(dateRangeMonths * rollStepsPerMonth, currentRollPeriod) / 4);

  // Local state for the slider value as we change it. This lets us change the value with a
  // controlled slider component without having to send all updates through the main context reducer
  const [activeRollPeriod, setActiveRollPeriod] = (0, _react.useState)(currentRollPeriod);
  const [isActivelySetting, setIsActivelySetting] = (0, _react.useState)(false);
  (0, _react.useEffect)(() => {
    if (activeRollPeriod !== currentRollPeriod && !isActivelySetting) {
      setActiveRollPeriod(currentRollPeriod);
    }
  }, [activeRollPeriod, currentRollPeriod, isActivelySetting, setActiveRollPeriod]);

  // Determine slider marks
  const interimMarks = rollMax - rollMin < 8 ? 2 : 3;
  const markValues = [1];
  for (let m = 1; m <= interimMarks; m += 1) {
    markValues.push(Math.floor(rollMax * (m / (interimMarks + 1))));
  }
  markValues.push(rollMax);
  const marks = markValues.map(m => ({
    value: m,
    label: (0, _TimeSeriesViewerContext.summarizeTimeSteps)(m, currentTimeStep)
  }));
  return !currentTimeStep ? /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
    variant: "rect",
    width: "100%",
    height: 56
  }) : /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: '100%',
      minWidth: _Theme.default.spacing(40)
    }
  }, /*#__PURE__*/_react.default.createElement(_Slider.default, {
    className: classes.horizSlider,
    marks: marks,
    "data-selenium": "time-series-viewer.options.roll-period-slider",
    value: activeRollPeriod,
    valueLabelDisplay: "auto",
    valueLabelFormat: x => (0, _TimeSeriesViewerContext.summarizeTimeSteps)(x, currentTimeStep),
    min: rollMin,
    max: rollMax,
    onMouseDown: () => {
      setIsActivelySetting(true);
    },
    onChange: (event, value) => {
      setActiveRollPeriod(Math.min(Math.max(value, rollMin), rollMax));
    },
    onChangeCommitted: (event, value) => {
      setIsActivelySetting(false);
      dispatch({
        type: 'setRollPeriod',
        rollPeriod: Math.min(Math.max(value, rollMin), rollMax)
      });
    }
  }));
};

/**
   x Axis - Time Step Option
*/
const TimeStepOption = () => {
  const classes = useStyles(_Theme.default);
  const [state, dispatch] = _TimeSeriesViewerContext.default.useTimeSeriesViewerState();
  const {
    availableTimeSteps
  } = state.timeStep;
  const {
    timeStep: selectedTimeStep
  } = state.selection;
  const handleChangeTimeStep = (event, timeStep) => {
    dispatch({
      type: 'selectTimeStep',
      timeStep
    });
  };
  return /*#__PURE__*/_react.default.createElement(_ToggleButtonGroup.default, {
    exclusive: true,
    color: "primary",
    variant: "outlined",
    size: "small",
    className: classes.optionButtonGroup,
    value: selectedTimeStep,
    onChange: handleChangeTimeStep,
    style: {
      marginBottom: _Theme.default.spacing(3)
    }
  }, Array.from(availableTimeSteps).map(timeStep => {
    const className = timeStep === selectedTimeStep ? "".concat(classes.optionButton, " ").concat(classes.optionButtonSelected) : classes.optionButton;
    const isDisabled = _TimeSeriesViewerContext.default.calcPredictedPointsByTimeStep(state, timeStep) > _TimeSeriesViewerContext.POINTS_PERFORMANCE_LIMIT;
    return /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
      key: timeStep,
      value: timeStep,
      size: "small",
      className: className,
      disabled: isDisabled
    }, timeStep);
  }));
};

/**
   Option Titles and Descriptions
*/
const OPTIONS = {
  Y_AXIS_SCALE: {
    title: 'Scale',
    description: 'Toggle between linear and logarithmic scales on all y axes',
    Component: YAxisScaleOption
  },
  Y1_AXIS_RANGE: {
    title: 'y1 Range',
    description: 'Set min and max range for y1 axis ({units})',
    Component: () => /*#__PURE__*/_react.default.createElement(YAxisRangeOption, {
      axis: "y1"
    }),
    axis: 'y1'
  },
  Y2_AXIS_RANGE: {
    title: 'y2 Range',
    description: 'Set min and max range for y2 axis ({units})',
    Component: () => /*#__PURE__*/_react.default.createElement(YAxisRangeOption, {
      axis: "y2"
    }),
    axis: 'y2'
  },
  ROLL_PERIOD: {
    title: 'Roll Period',
    description: 'Set a rolling window to smooth out noisy data',
    Component: RollPeriodOption
  },
  TIME_STEP: {
    title: 'Time Step',
    description: 'Set a smaller time step to see NEON data aggregated with finer granularity',
    Component: TimeStepOption
  }
};

/**
   Main Component
*/
function TimeSeriesViewerAxes() {
  const classes = useStyles(_Theme.default);
  const [state] = _TimeSeriesViewerContext.default.useTimeSeriesViewerState();
  const {
    selection
  } = state;
  const renderOption = key => {
    const {
      title,
      description: rawDescription,
      Component,
      axis
    } = OPTIONS[key];
    let description = rawDescription;
    if (description.indexOf('{units}') && axis) {
      description = rawDescription.replace('{units}', selection.yAxes[axis].units);
    }
    return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, title), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption",
      style: {
        color: _Theme.default.palette.grey[400]
      }
    }, description), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        width: '100%',
        marginTop: _Theme.default.spacing(1)
      }
    }, /*#__PURE__*/_react.default.createElement(Component, null)));
  };
  const hasY2Axis = selection.yAxes.y2.units !== null;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: classes.optionsContainer
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginRight: _Theme.default.spacing(5)
    }
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6",
    style: {
      marginBottom: _Theme.default.spacing(2)
    }
  }, "y Axes"), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.optionsContainer
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginBottom: _Theme.default.spacing(3),
      marginRight: _Theme.default.spacing(4)
    }
  }, renderOption('Y_AXIS_SCALE')), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.yAxesRangesContainer
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: !hasY2Axis ? null : {
      marginRight: _Theme.default.spacing(4)
    }
  }, renderOption('Y1_AXIS_RANGE')), !hasY2Axis ? null : renderOption('Y2_AXIS_RANGE')))), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6",
    style: {
      marginBottom: _Theme.default.spacing(2)
    }
  }, "x Axis (Time)"), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.optionsContainer
  }, state.timeStep.availableTimeSteps.size < 3 ? null : /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginRight: _Theme.default.spacing(4)
    }
  }, renderOption('TIME_STEP')), renderOption('ROLL_PERIOD'))));
}