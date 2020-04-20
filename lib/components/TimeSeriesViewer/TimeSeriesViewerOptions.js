"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TimeSeriesViewerOptions;

var _react = _interopRequireWildcard(require("react"));

var _styles = require("@material-ui/core/styles");

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _Slider = _interopRequireDefault(require("@material-ui/core/Slider"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Skeleton = _interopRequireDefault(require("@material-ui/lab/Skeleton"));

var _ToggleButton = _interopRequireDefault(require("@material-ui/lab/ToggleButton"));

var _ToggleButtonGroup = _interopRequireDefault(require("@material-ui/lab/ToggleButtonGroup"));

var _SwapHoriz = _interopRequireDefault(require("@material-ui/icons/SwapHoriz"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _TimeSeriesViewerContext = _interopRequireWildcard(require("./TimeSeriesViewerContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    smallButton: {
      fontSize: '0.8rem',
      padding: theme.spacing(0.125, 0.75),
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
    }
  };
});

var boxShadow = function boxShadow(alpha) {
  return "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,".concat(alpha, "),0 0 0 1px rgba(0,0,0,0.02)");
};

var RollPeriodSlider = (0, _styles.withStyles)({
  root: {
    width: "calc(100% - ".concat(_Theme.default.spacing(6), "px)"),
    marginLeft: _Theme.default.spacing(3),
    marginBottom: _Theme.default.spacing(4)
  },
  rail: {
    height: 3
  },
  track: {
    height: 7,
    marginTop: -2
  },
  mark: {
    height: 12,
    marginTop: -5
  },
  markActive: {
    height: 12,
    marginTop: -5,
    backgroundColor: _Theme.default.palette.primary.main
  },
  markLabel: {
    marginTop: _Theme.default.spacing(1)
  },
  thumb: {
    height: _Theme.default.spacing(3.5),
    width: _Theme.default.spacing(1.5),
    backgroundColor: _Theme.default.palette.grey[50],
    boxShadow: boxShadow(0.13),
    border: "2px solid ".concat(_Theme.default.palette.primary.main),
    borderRadius: _Theme.default.spacing(0.5),
    marginTop: _Theme.default.spacing(-1.75),
    marginLeft: _Theme.default.spacing(-0.75),
    '&:focus,&:hover,&active': {
      boxShadow: boxShadow(0.3),
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: boxShadow(0.13)
      }
    }
  },
  valueLabel: {
    left: 'initial',
    fontWeight: 600,
    top: -20,
    whiteSpace: 'nowrap',
    '& span': {
      width: 'auto',
      height: 'auto',
      padding: _Theme.default.spacing(0.5, 1),
      borderRadius: _Theme.default.spacing(0.5),
      transform: 'none',
      '& span': {
        transform: 'none',
        padding: 0,
        borderRadius: 0
      }
    }
  }
})(_Slider.default);
/**
   Roll Period Option
*/

var sliderDefault = {
  value: 1
};

var RollPeriodOption = function RollPeriodOption() {
  var _TimeSeriesViewerCont = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont2 = _slicedToArray(_TimeSeriesViewerCont, 2),
      state = _TimeSeriesViewerCont2[0],
      dispatch = _TimeSeriesViewerCont2[1];

  var rollPeriodSliderRef = (0, _react.useRef)(null);
  var selection = state.selection;
  var currentRollPeriod = selection.rollPeriod,
      selectedTimeStep = selection.timeStep,
      autoTimeStep = selection.autoTimeStep;
  var currentTimeStep = selectedTimeStep === 'auto' ? autoTimeStep : selectedTimeStep;
  var dateRangeMonths = selection.continuousDateRange.length;
  var timeStepSeconds = currentTimeStep ? _TimeSeriesViewerContext.TIME_STEPS[currentTimeStep].seconds : 1800;
  var rollStepsPerMonth = 30 * 24 * 60 * 60 / timeStepSeconds;
  var rollMin = 1;
  var rollMax = Math.floor(Math.max(dateRangeMonths * rollStepsPerMonth, currentRollPeriod) / 4); // Determine slider marks

  var interimMarks = 3;
  var markValues = [1];

  for (var m = 1; m <= interimMarks; m += 1) {
    markValues.push(Math.floor(rollMax * (m / (interimMarks + 1))));
  }

  markValues.push(rollMax);
  var marks = markValues.map(function (m) {
    return {
      value: m,
      label: (0, _TimeSeriesViewerContext.summarizeTimeSteps)(m, currentTimeStep)
    };
  }); // Function to apply changes to the slider's DOM as if it was controlled by state.
  // We can't control in state because doing so makes drag experience jerky and frustrating.
  // By not controlling the slider with state we can maintain a fluid experience and need
  // only this bit of logic (with a ref to the slider's DOM node) to keep the slider
  // DOM in sync as if it was controlled directly.

  var applySliderValue = (0, _react.useCallback)(function (value) {
    if (!parseInt(value, 10)) {
      return;
    }

    var currentValue = Math.min(Math.max(value, rollMin), rollMax); // Apply value to Slider DOM hidden input

    rollPeriodSliderRef.current.querySelector('input[type="hidden"]').value = currentValue; // Apply value to slider drag handle

    rollPeriodSliderRef.current.querySelector('span[role="slider"]').setAttribute('aria-valuenow', currentValue.toString()); // Apply value to slider track up to drag handle

    var newTrackWidth = "".concat((currentValue - 1) / (rollMax - 1) * 100, "%");
    rollPeriodSliderRef.current.querySelector('.MuiSlider-track').style.width = newTrackWidth;
  }, [rollPeriodSliderRef, rollMin, rollMax]);
  (0, _react.useEffect)(function () {
    if (!rollPeriodSliderRef.current) {
      return;
    }

    var sliderValue = rollPeriodSliderRef.current.querySelector('input[type="hidden"]').value;

    if (sliderValue !== currentRollPeriod) {
      applySliderValue(currentRollPeriod);
    }
  }, [rollPeriodSliderRef, currentRollPeriod, rollMin, rollMax, applySliderValue]);

  if (!Object.isFrozen(sliderDefault)) {
    sliderDefault = {
      value: currentRollPeriod
    };
    Object.freeze(sliderDefault);
  }

  return !currentTimeStep ? _react.default.createElement(_Skeleton.default, {
    variant: "rect",
    width: "100%",
    height: 56
  }) : _react.default.createElement("div", {
    style: {
      width: '100%'
    }
  }, _react.default.createElement(RollPeriodSlider, {
    marks: marks,
    "data-selenium": "time-series-viewer.options.roll-period-slider",
    ref: rollPeriodSliderRef,
    defaultValue: sliderDefault.value,
    valueLabelDisplay: "auto",
    valueLabelFormat: function valueLabelFormat(x) {
      return (0, _TimeSeriesViewerContext.summarizeTimeSteps)(x, currentTimeStep);
    },
    min: rollMin,
    max: rollMax,
    onChange: function onChange(event, value) {
      applySliderValue(value);
    },
    onChangeCommitted: function onChangeCommitted(event, value) {
      dispatch({
        type: 'setRollPeriod',
        rollPeriod: Math.min(Math.max(value, rollMin), rollMax)
      });
    }
  }));
};
/**
   Y-Axis Scale Option
*/


var YAxesOption = function YAxesOption() {
  var classes = useStyles(_Theme.default);

  var _TimeSeriesViewerCont3 = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont4 = _slicedToArray(_TimeSeriesViewerCont3, 2),
      state = _TimeSeriesViewerCont4[0],
      dispatch = _TimeSeriesViewerCont4[1];

  var _state$selection = state.selection,
      yAxes = _state$selection.yAxes,
      logscale = _state$selection.logscale;
  var classNames = {
    selected: "".concat(classes.optionButton, " ").concat(classes.optionButtonSelected),
    deselected: classes.optionButton
  };
  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_ToggleButtonGroup.default, {
    exclusive: true,
    color: "primary",
    variant: "outlined",
    size: "small",
    className: classes.optionButtonGroup,
    value: logscale ? 'log' : 'lin',
    onChange: function onChange(event, value) {
      dispatch({
        type: 'selectLogScale',
        logscale: value === 'log'
      });
    }
  }, _react.default.createElement(_ToggleButton.default, {
    key: "lin",
    value: "lin",
    size: "small",
    className: classNames[logscale ? 'deselected' : 'selected']
  }, "Linear"), _react.default.createElement(_ToggleButton.default, {
    key: "log",
    value: "log",
    size: "small",
    className: classNames[logscale ? 'selected' : 'deselected']
  }, "Logarithmic")), yAxes.y2.units === null ? null : _react.default.createElement(_Button.default, {
    color: "primary",
    variant: "outlined",
    onClick: function onClick() {
      dispatch({
        type: 'selectSwapYAxes'
      });
    },
    className: classes.smallButton,
    style: {
      marginTop: _Theme.default.spacing(1)
    }
  }, _react.default.createElement(_SwapHoriz.default, {
    className: classes.smallButtonIcon
  }), "Swap Y Axes"));
};
/**
   Time Step Option
*/


var TimeStepOption = function TimeStepOption() {
  var classes = useStyles(_Theme.default);

  var _TimeSeriesViewerCont5 = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont6 = _slicedToArray(_TimeSeriesViewerCont5, 2),
      state = _TimeSeriesViewerCont6[0],
      dispatch = _TimeSeriesViewerCont6[1];

  var availableTimeSteps = state.availableTimeSteps;
  var selectedTimeStep = state.selection.timeStep;

  var handleChangeTimeStep = function handleChangeTimeStep(event, timeStep) {
    dispatch({
      type: 'selectTimeStep',
      timeStep: timeStep
    });
  };

  return _react.default.createElement(_ToggleButtonGroup.default, {
    exclusive: true,
    color: "primary",
    variant: "outlined",
    size: "small",
    className: classes.optionButtonGroup,
    value: selectedTimeStep,
    onChange: handleChangeTimeStep
  }, Array.from(availableTimeSteps).map(function (timeStep) {
    var className = timeStep === selectedTimeStep ? "".concat(classes.optionButton, " ").concat(classes.optionButtonSelected) : classes.optionButton;
    return _react.default.createElement(_ToggleButton.default, {
      key: timeStep,
      value: timeStep,
      size: "small",
      className: className
    }, timeStep);
  }));
};
/**
   Option Titles and Descriptions
*/


var OPTIONS = {
  Y_AXIS_SCALE: {
    title: 'Y-Axes',
    description: 'Toggle between linear and logarithmic scales on all y axes.',
    Component: YAxesOption
  },
  ROLL_PERIOD: {
    title: 'Roll Period',
    description: 'Set a rolling window to smooth out noisy data.',
    Component: RollPeriodOption
  },
  TIME_STEP: {
    title: 'Time Step',
    description: 'Set a smaller time step to see NEON data aggregated with finer granularity.',
    Component: TimeStepOption
  }
};
/**
   Main Component
*/

function TimeSeriesViewerOptions() {
  var renderOption = function renderOption(key) {
    var _OPTIONS$key = OPTIONS[key],
        title = _OPTIONS$key.title,
        description = _OPTIONS$key.description,
        Component = _OPTIONS$key.Component;
    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, title), _react.default.createElement(_Typography.default, {
      variant: "caption",
      style: {
        color: _Theme.default.palette.grey[400]
      }
    }, description), _react.default.createElement("div", {
      style: {
        width: '100%',
        marginTop: _Theme.default.spacing(1)
      }
    }, _react.default.createElement(Component, null)));
  };

  return _react.default.createElement(_Grid.default, {
    container: true,
    spacing: 2
  }, _react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    sm: 6
  }, renderOption('Y_AXIS_SCALE')), _react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    sm: 6
  }, renderOption('TIME_STEP')), _react.default.createElement(_Grid.default, {
    item: true,
    xs: 12
  }, renderOption('ROLL_PERIOD')));
}