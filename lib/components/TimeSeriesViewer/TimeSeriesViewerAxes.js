"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TimeSeriesViewerAxes;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styles = require("@material-ui/core/styles");

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _Checkbox = _interopRequireDefault(require("@material-ui/core/Checkbox"));

var _FormControlLabel = _interopRequireDefault(require("@material-ui/core/FormControlLabel"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _Slider = _interopRequireDefault(require("@material-ui/core/Slider"));

var _TextField = _interopRequireDefault(require("@material-ui/core/TextField"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Skeleton = _interopRequireDefault(require("@material-ui/lab/Skeleton"));

var _ToggleButton = _interopRequireDefault(require("@material-ui/lab/ToggleButton"));

var _ToggleButtonGroup = _interopRequireDefault(require("@material-ui/lab/ToggleButtonGroup"));

var _SwapHoriz = _interopRequireDefault(require("@material-ui/icons/SwapHoriz"));

var _VerticalAlignCenter = _interopRequireDefault(require("@material-ui/icons/VerticalAlignCenter"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _TimeSeriesViewerContext = _interopRequireWildcard(require("./TimeSeriesViewerContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    },
    yAxisRangeOuterContainer: {
      width: '100%',
      marginTop: theme.spacing(-1)
    },
    yAxisRangeInnerContainer: {
      height: theme.spacing(22),
      display: 'flex',
      alignItems: 'flex-start',
      marginTop: theme.spacing(2)
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
      width: theme.spacing(12)
    },
    autoLabelDescription: {
      marginLeft: theme.spacing(1),
      color: theme.palette.grey[400],
      fontSize: '0.75rem'
    },
    centerButtonDescription: {
      marginTop: theme.spacing(0.5),
      marginBottom: theme.spacing(2),
      color: theme.palette.grey[400],
      fontSize: '0.75rem'
    }
  };
});

var boxShadow = function boxShadow(alpha) {
  return "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,".concat(alpha, "),0 0 0 1px rgba(0,0,0,0.02)");
};

var NeonSlider = (0, _styles.withStyles)({
  root: {
    width: "calc(100% - ".concat(_Theme.default.spacing(6), "px)"),
    marginLeft: _Theme.default.spacing(3),
    marginBottom: '24px !important'
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
var NeonVerticalSlider = (0, _styles.withStyles)({
  root: {
    margin: '0px 56px 32px 16px !important'
  },
  disabled: {
    '& .MuiSlider-track': {
      display: 'none'
    },
    '& .MuiSlider-thumb': {
      display: 'none'
    },
    '& .MuiSlider-markLabelActive': {
      color: 'unset'
    },
    '& .MuiSlider-markActive': {
      backgroundColor: 'currentColor'
    }
  },
  rail: {
    width: 3
  },
  track: {
    width: '7px !important',
    marginLeft: -2
  },
  mark: {
    width: 12,
    marginLeft: -5
  },
  markActive: {
    width: 12,
    marginLeft: -5,
    backgroundColor: _Theme.default.palette.primary.main
  },
  markLabel: {
    marginLeft: _Theme.default.spacing(1)
  },
  thumb: {
    height: _Theme.default.spacing(1.5),
    width: _Theme.default.spacing(3.5),
    backgroundColor: _Theme.default.palette.grey[50],
    boxShadow: boxShadow(0.13),
    border: "2px solid ".concat(_Theme.default.palette.primary.main),
    borderRadius: _Theme.default.spacing(0.5),
    marginTop: _Theme.default.spacing(-0.75),
    marginLeft: "".concat(_Theme.default.spacing(-1.75), "px !important"),
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
   y Axes - Scale Option
*/

var YAxisScaleOption = function YAxisScaleOption() {
  var classes = useStyles(_Theme.default);

  var _TimeSeriesViewerCont = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont2 = _slicedToArray(_TimeSeriesViewerCont, 2),
      state = _TimeSeriesViewerCont2[0],
      dispatch = _TimeSeriesViewerCont2[1];

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
   y Axis - Range Option
*/


var yAxisRangeSliderDefaults = {
  y1: {
    value: [0, 0.01]
  },
  y2: {
    value: [0, 0.01]
  }
};

var YAxisRangeOption = function YAxisRangeOption(props) {
  var _autoLabelStyles;

  var axis = props.axis;
  var classes = useStyles(_Theme.default);

  var _TimeSeriesViewerCont3 = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont4 = _slicedToArray(_TimeSeriesViewerCont3, 2),
      state = _TimeSeriesViewerCont4[0],
      dispatch = _TimeSeriesViewerCont4[1];

  var yAxisRangeSliderRef = (0, _react.useRef)(null);
  var selection = state.selection;
  var yAxes = selection.yAxes;
  var _yAxes$axis = yAxes[axis],
      dataRange = _yAxes$axis.dataRange,
      rawSelectedRange = _yAxes$axis.selectedRange,
      standardDeviation = _yAxes$axis.standardDeviation;
  var isAuto = rawSelectedRange === 'auto';
  var selectedRange = isAuto ? [null, null] : rawSelectedRange;
  var render = yAxes[axis].units && dataRange[0] !== null && dataRange[1] !== null;
  var rangeMin = 0;
  var rangeMax = dataRange[1] ? dataRange[1] * 1.20 : 0.01;
  var precision = Math.abs(Math.floor(Math.min(Math.log10(rangeMax), 0))) + (Math.log10(rangeMax) >= 2 ? 0 : 1);
  rangeMax = parseFloat(rangeMax.toFixed(precision), 10);
  var fixedStandardDeviation = parseFloat(standardDeviation.toFixed(precision), 10); // Determine slider marks

  var marks = [rangeMin, (rangeMax - rangeMin) * 0.25, (rangeMax - rangeMin) * 0.5, (rangeMax - rangeMin) * 0.75, rangeMax].map(function (m) {
    return {
      value: m,
      label: m.toFixed(precision)
    };
  });
  var step = Math.pow(10, -1 * precision); // Function to apply changes to the slider's DOM as if it was controlled by state.
  // We can't control in state because doing so makes drag experience jerky and frustrating.
  // By not controlling the slider with state we can maintain a fluid experience and need
  // only this bit of logic (with a ref to the slider's DOM node) to keep the slider
  // DOM in sync as if it was controlled directly.

  var applySliderValues = (0, _react.useCallback)(function (values) {
    if (!Array.isArray(values) || values.length !== 2 || values[0] > values[1]) {
      return;
    }

    var limited = [Math.max(values[0], rangeMin), Math.min(values[1], rangeMax)]; // Derive new percentage values for bottom and height styles of slider DOM elements

    var newBottoms = ["".concat(limited[0] / (rangeMax - rangeMin) * 100, "%"), "".concat(limited[1] / (rangeMax - rangeMin) * 100, "%")]; // Apply values to Slider DOM hidden input

    yAxisRangeSliderRef.current.querySelector('input[type="hidden"]').value = limited.join(','); // Apply values to slider drag handles

    [0, 1].forEach(function (idx) {
      yAxisRangeSliderRef.current.querySelector("span[data-index=\"".concat(idx, "\"]")).setAttribute('aria-valuenow', limited[idx].toString());
      yAxisRangeSliderRef.current.querySelector("span[data-index=\"".concat(idx, "\"]")).style.bottom = newBottoms[idx];
      yAxisRangeSliderRef.current.querySelector("span[data-index=\"".concat(idx, "\"] > span > span > span")).innerText = limited[idx];
    }); // Apply values to slider track between drag handles

    var newTrackHeight = "".concat((limited[1] - limited[0]) / (rangeMax - rangeMin) * 100, "%");
    yAxisRangeSliderRef.current.querySelector('.MuiSlider-track').style.height = newTrackHeight; // eslint-disable-next-line prefer-destructuring

    yAxisRangeSliderRef.current.querySelector('.MuiSlider-track').style.bottom = newBottoms[0];
  }, [yAxisRangeSliderRef, rangeMin, rangeMax]);
  (0, _react.useEffect)(function () {
    if (!yAxisRangeSliderRef.current || !render || isAuto) {
      return;
    }

    var sliderValues = yAxisRangeSliderRef.current.querySelector('input[type="hidden"]').value;

    if (sliderValues !== selectedRange.join(',')) {
      applySliderValues(selectedRange);
    }
  }, [yAxisRangeSliderRef, selectedRange, applySliderValues, render, isAuto]);

  if (!Object.isFrozen(yAxisRangeSliderDefaults[axis])) {
    yAxisRangeSliderDefaults[axis] = {
      value: [selectedRange[0] === null ? rangeMin : selectedRange[0], selectedRange[1] === null ? rangeMax : selectedRange[1]]
    };
    Object.freeze(yAxisRangeSliderDefaults[axis]);
  }

  var handleToggleCheckbox = function handleToggleCheckbox() {
    dispatch({
      type: 'selectYAxisRange',
      axis: axis,
      range: isAuto ? [rangeMin, rangeMax] : 'auto'
    });
  };

  var autoLabelStyles = (_autoLabelStyles = {}, _defineProperty(_autoLabelStyles, true, {
    fontWeight: 600
  }), _defineProperty(_autoLabelStyles, false, {
    color: _Theme.default.palette.grey[400]
  }), _autoLabelStyles);
  return !render ? _react.default.createElement("div", {
    className: classes.yAxisRangeOuterContainer
  }, _react.default.createElement("div", {
    className: classes.yAxisRangeOptions
  }, _react.default.createElement(_Skeleton.default, {
    variant: "rect",
    width: 200,
    height: 26,
    style: {
      margin: _Theme.default.spacing(1, 0)
    }
  })), _react.default.createElement("div", {
    className: classes.yAxisRangeInnerContainer
  }, _react.default.createElement("div", {
    className: classes.yAxisRangeTextfieldContainer
  }, _react.default.createElement(_Skeleton.default, {
    variant: "rect",
    width: 96,
    height: 40,
    style: {
      margin: _Theme.default.spacing(1, 0)
    }
  }), _react.default.createElement(_Skeleton.default, {
    variant: "rect",
    width: 96,
    height: 40,
    style: {
      margin: _Theme.default.spacing(1, 0)
    }
  }), _react.default.createElement(_Skeleton.default, {
    variant: "rect",
    width: 76,
    height: 26,
    style: {
      margin: _Theme.default.spacing(1, 0)
    }
  })), _react.default.createElement(_Skeleton.default, {
    variant: "rect",
    width: 56,
    height: _Theme.default.spacing(20)
  }))) : _react.default.createElement("div", {
    className: classes.yAxisRangeOuterContainer
  }, _react.default.createElement("div", {
    className: classes.yAxisRangeOptions
  }, _react.default.createElement(_FormControlLabel.default, {
    label: _react.default.createElement("div", null, _react.default.createElement("span", {
      style: autoLabelStyles[isAuto]
    }, "Auto"), _react.default.createElement("span", {
      className: classes.autoLabelDescription
    }, "(fit to data; start at zero)")),
    control: _react.default.createElement(_Checkbox.default, {
      checked: isAuto,
      onChange: handleToggleCheckbox,
      color: "primary"
    })
  })), _react.default.createElement("div", {
    className: classes.yAxisRangeInnerContainer
  }, _react.default.createElement("div", {
    className: classes.yAxisRangeTextfieldContainer
  }, _react.default.createElement(_TextField.default, {
    label: "Max",
    type: "number",
    margin: "dense",
    inputProps: {
      step: step
    },
    InputLabelProps: {
      shrink: true
    },
    variant: "outlined",
    disabled: isAuto,
    value: isAuto ? '' : selectedRange[1],
    className: classes.yAxisRangeTextField,
    onChange: function onChange(event) {
      var range = [selectedRange[0], Math.min(event.target.value, rangeMax)];
      dispatch({
        type: 'selectYAxisRange',
        axis: axis,
        range: range
      });
    }
  }), _react.default.createElement(_TextField.default, {
    label: "Min",
    type: "number",
    margin: "dense",
    inputProps: {
      step: step
    },
    InputLabelProps: {
      shrink: true
    },
    variant: "outlined",
    disabled: isAuto,
    value: isAuto ? '' : selectedRange[0],
    className: classes.yAxisRangeTextField,
    onChange: function onChange(event) {
      var range = [Math.max(event.target.value, rangeMin), selectedRange[1]];
      dispatch({
        type: 'selectYAxisRange',
        axis: axis,
        range: range
      });
    }
  }), _react.default.createElement(_Button.default, {
    color: "primary",
    variant: "outlined",
    className: classes.smallButton,
    style: {
      marginTop: _Theme.default.spacing(1.5)
    },
    onClick: function onClick() {
      var range = [Math.max(dataRange[0] - fixedStandardDeviation, 0), dataRange[1] + fixedStandardDeviation];
      dispatch({
        type: 'selectYAxisRange',
        axis: axis,
        range: range
      });
    }
  }, _react.default.createElement(_VerticalAlignCenter.default, {
    className: classes.smallButtonIcon
  }), "Center"), _react.default.createElement("div", {
    className: classes.centerButtonDescription
  }, "Fit around data by one standard deviation")), _react.default.createElement(NeonVerticalSlider, {
    disabled: isAuto,
    step: step,
    marks: marks,
    orientation: "vertical",
    "data-selenium": "time-series-viewer.options.roll-period-slider",
    ref: yAxisRangeSliderRef,
    defaultValue: _toConsumableArray(yAxisRangeSliderDefaults[axis].value),
    valueLabelDisplay: "auto",
    min: rangeMin,
    max: rangeMax,
    onChange: function onChange(event, values) {
      applySliderValues(values);
    },
    onChangeCommitted: function onChangeCommitted(event, values) {
      dispatch({
        type: 'selectYAxisRange',
        axis: axis,
        range: [Math.min(Math.max(values[0], rangeMin), rangeMax), Math.min(Math.max(values[1], rangeMin), rangeMax)]
      });
    }
  })));
};

YAxisRangeOption.propTypes = _propTypes.default.oneOf(['y1', 'y2']).isRequired;
/**
   x Axis - Roll Period Option
*/

var rollPeriodSliderDefault = {
  value: 1
};

var RollPeriodOption = function RollPeriodOption() {
  var _TimeSeriesViewerCont5 = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont6 = _slicedToArray(_TimeSeriesViewerCont5, 2),
      state = _TimeSeriesViewerCont6[0],
      dispatch = _TimeSeriesViewerCont6[1];

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

  if (!Object.isFrozen(rollPeriodSliderDefault)) {
    rollPeriodSliderDefault = {
      value: currentRollPeriod
    };
    Object.freeze(rollPeriodSliderDefault);
  }

  return !currentTimeStep ? _react.default.createElement(_Skeleton.default, {
    variant: "rect",
    width: "100%",
    height: 56
  }) : _react.default.createElement("div", {
    style: {
      width: '100%'
    }
  }, _react.default.createElement(NeonSlider, {
    marks: marks,
    "data-selenium": "time-series-viewer.options.roll-period-slider",
    ref: rollPeriodSliderRef,
    defaultValue: rollPeriodSliderDefault.value,
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
   x Axis - Time Step Option
*/


var TimeStepOption = function TimeStepOption() {
  var classes = useStyles(_Theme.default);

  var _TimeSeriesViewerCont7 = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont8 = _slicedToArray(_TimeSeriesViewerCont7, 2),
      state = _TimeSeriesViewerCont8[0],
      dispatch = _TimeSeriesViewerCont8[1];

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
    title: 'Scale',
    description: 'Toggle between linear and logarithmic scales on all y axes.',
    Component: YAxisScaleOption
  },
  Y1_AXIS_RANGE: {
    title: 'y1 Range',
    description: 'Set min and max range for y1 axis ({units})',
    Component: function Component() {
      return _react.default.createElement(YAxisRangeOption, {
        axis: "y1"
      });
    },
    axis: 'y1'
  },
  Y2_AXIS_RANGE: {
    title: 'y2 Range',
    description: 'Set min and max range for y2 axis ({units})',
    Component: function Component() {
      return _react.default.createElement(YAxisRangeOption, {
        axis: "y2"
      });
    },
    axis: 'y2'
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

function TimeSeriesViewerAxes() {
  var _TimeSeriesViewerCont9 = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont10 = _slicedToArray(_TimeSeriesViewerCont9, 1),
      state = _TimeSeriesViewerCont10[0];

  var selection = state.selection;

  var renderOption = function renderOption(key) {
    var _OPTIONS$key = OPTIONS[key],
        title = _OPTIONS$key.title,
        rawDescription = _OPTIONS$key.description,
        Component = _OPTIONS$key.Component,
        axis = _OPTIONS$key.axis;
    var description = rawDescription;

    if (description.indexOf('{units}') && axis) {
      description = rawDescription.replace('{units}', selection.yAxes[axis].units);
    }

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

  var hasY2Axis = selection.yAxes.y2.units !== null;
  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_Typography.default, {
    variant: "h6",
    gutterBottom: true
  }, "y Axes"), _react.default.createElement(_Grid.default, {
    container: true,
    spacing: 2,
    style: {
      marginBottom: _Theme.default.spacing(3)
    }
  }, _react.default.createElement(_Grid.default, {
    item: true,
    xs: 12
  }, renderOption('Y_AXIS_SCALE')), _react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    md: hasY2Axis ? 6 : 12
  }, renderOption('Y1_AXIS_RANGE')), !hasY2Axis ? null : _react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    md: 6
  }, renderOption('Y2_AXIS_RANGE'))), _react.default.createElement(_Typography.default, {
    variant: "h6",
    gutterBottom: true
  }, "x Axis (Time)"), _react.default.createElement(_Grid.default, {
    container: true,
    spacing: 2
  }, _react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    lg: 4,
    xl: 3
  }, renderOption('TIME_STEP')), _react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    lg: 8,
    xl: 9
  }, renderOption('ROLL_PERIOD'))));
}