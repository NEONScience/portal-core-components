"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TimeSeriesViewerOptions;

var _react = _interopRequireWildcard(require("react"));

var _styles = require("@material-ui/core/styles");

var _Slider = _interopRequireDefault(require("@material-ui/core/Slider"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _TimeSeriesViewerContext = _interopRequireWildcard(require("./TimeSeriesViewerContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
  var _selection$options = selection.options,
      currentRollPeriod = _selection$options.rollPeriod,
      currentTimeStep = _selection$options.timeStep;
  var dateRangeMonths = selection.continuousDateRange.length;
  var timeStepSeconds = currentTimeStep ? _TimeSeriesViewerContext.TIME_STEPS[currentTimeStep].seconds : 1800;
  var rollStepsPerMonth = 30 * 24 * 60 * 60 / timeStepSeconds;
  var rollMin = 1;
  var rollMax = Math.max(dateRangeMonths * rollStepsPerMonth, currentRollPeriod); // Determine slider marks

  var getMarkLabel = function getMarkLabel(val) {
    if (val === 1) {
      return 'none';
    }

    var seconds = val * timeStepSeconds;
    var breaks = [3600, 86400, 2592000, 31536000];
    var intervals = ['hour', 'day', 'month', 'year'];
    var breakIdx = breaks.reduce(function (acc, cur, idx) {
      return seconds > cur ? idx : acc;
    }, 0);
    var value = (seconds / breaks[breakIdx]).toFixed(1);

    if (value.slice(value.length - 1) === '0') {
      value = value.slice(0, value.length - 2);
    }

    return "".concat(value, " ").concat(intervals[breakIdx]).concat(value === '1' ? '' : 's');
  };

  var interimMarks = 3;
  var markValues = [1];

  for (var m = 1; m <= interimMarks; m += 1) {
    markValues.push(Math.floor(rollMax * (m / (interimMarks + 1))));
  }

  markValues.push(rollMax);
  var marks = markValues.map(function (m) {
    return {
      value: m,
      label: getMarkLabel(m)
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

  return !currentTimeStep ? null : _react.default.createElement("div", {
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
      return getMarkLabel(x);
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
   Option Titles and Descriptions
*/


var OPTIONS = {
  Y_AXIS_SCALE: {
    title: 'Y-Axis Scale',
    description: 'foo bar qux',
    Component: function Component() {
      return null;
    }
  },
  ROLL_PERIOD: {
    title: 'Roll Period',
    description: 'foo bar qux',
    Component: RollPeriodOption
  },
  QUALITY_FLAGS: {
    title: 'Quality Flags',
    description: 'foo bar qux',
    Component: function Component() {
      return null;
    }
  },
  TIME_STEP: {
    title: 'Time Step',
    description: 'foo bar qux',
    Component: function Component() {
      return null;
    }
  }
};
/**
   Main Component
*/

function TimeSeriesViewerOptions() {
  return _react.default.createElement("div", {
    style: {
      width: '100%'
    }
  }, Object.keys(OPTIONS).map(function (optionKey) {
    var _OPTIONS$optionKey = OPTIONS[optionKey],
        title = _OPTIONS$optionKey.title,
        description = _OPTIONS$optionKey.description,
        Component = _OPTIONS$optionKey.Component;
    return _react.default.createElement("div", {
      key: optionKey,
      style: {
        width: '100%',
        marginBottom: _Theme.default.spacing(2)
      }
    }, _react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, title), _react.default.createElement(_Typography.default, {
      variant: "caption",
      style: {
        color: _Theme.default.palette.grey[400]
      }
    }, description), _react.default.createElement(Component, null));
  }));
}