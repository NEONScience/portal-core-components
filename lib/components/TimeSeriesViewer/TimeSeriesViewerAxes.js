"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    optionsContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexWrap: 'wrap'
    },
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
    borderRadius: 0,
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
      transform: 'none',
      padding: _Theme.default.spacing(0.5, 1),
      borderRadius: 0,
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
    margin: '4px 56px 32px 16px !important'
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
      transform: 'none',
      '& span': {
        transform: 'none',
        padding: 0
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
    onChange: function onChange(event, value) {
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
    onClick: function onClick() {
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


var YAxisRangeOption = function YAxisRangeOption(props) {
  var axis = props.axis;
  var classes = useStyles(_Theme.default);
  var classNames = {
    selected: "".concat(classes.optionButton, " ").concat(classes.optionButtonSelected),
    deselected: classes.optionButton
  };

  var _TimeSeriesViewerCont3 = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont4 = _slicedToArray(_TimeSeriesViewerCont3, 2),
      state = _TimeSeriesViewerCont4[0],
      dispatch = _TimeSeriesViewerCont4[1];

  var _state$selection2 = state.selection,
      logscale = _state$selection2.logscale,
      _state$selection2$yAx = _state$selection2.yAxes[axis],
      units = _state$selection2$yAx.units,
      dataRange = _state$selection2$yAx.dataRange,
      rangeMode = _state$selection2$yAx.rangeMode,
      axisRange = _state$selection2$yAx.axisRange,
      precision = _state$selection2$yAx.precision,
      standardDeviation = _state$selection2$yAx.standardDeviation; // Local state for the range min/max as we change it. This lets us change the range with
  // controlled components without having to send all updates through the main context reducer,
  // which would otherwise result in poor performance in some places and inability to make changes
  // we'd expect to be able to make in others.

  var _useState = (0, _react.useState)(_toConsumableArray(axisRange)),
      _useState2 = _slicedToArray(_useState, 2),
      activeRange = _useState2[0],
      setActiveRange = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isActivelySetting = _useState4[0],
      setIsActivelySetting = _useState4[1];

  (0, _react.useEffect)(function () {
    if ((axisRange[0] !== activeRange[0] || axisRange[1] !== activeRange[1]) && !isActivelySetting) {
      setActiveRange(_toConsumableArray(axisRange));
    }
  }, [axisRange, activeRange, isActivelySetting, setActiveRange]);
  var render = units && dataRange[0] !== null && dataRange[1] !== null;
  var isCustom = rangeMode === _TimeSeriesViewerContext.Y_AXIS_RANGE_MODES.CUSTOM;
  var customPad = Math.max((dataRange[1] - dataRange[0]) * 0.3, standardDeviation * 3);
  var customMin = dataRange[0] >= 0 || logscale ? 0 : parseFloat(Math.min(axisRange[0], (dataRange[0] || 0) - customPad).toFixed(precision), 10);
  var customMax = Math.max(parseFloat(Math.max(axisRange[1], (dataRange[1] || 0) + customPad).toFixed(precision), 10), 0); // Determine slider marks
  // There's probably a slick mathematical way to do this, but essentially the goal here is always
  // 5 marks roughly evenly spaced. If the min is negative then we want a guaranteed mark at zero

  var marks = [];

  if (customMin !== customMax) {
    var spread = customMax - customMin;

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

    marks = marks.map(function (m) {
      return {
        value: m,
        label: m.toFixed(precision)
      };
    });
  }

  var step = Math.pow(10, -1 * precision); // Debounce onchange functions for the text inputs so that we can type incomplete numbers
  // without immediately being corrected by the main context recuder.

  var setMax = function setMax(value) {
    var range = [axisRange[0], Math.min(value, customMax)];
    dispatch({
      type: 'selectYAxisCustomRange',
      axis: axis,
      range: range
    });
  };

  var setMin = function setMin(value) {
    var range = [Math.max(value, customMin), axisRange[1]];
    dispatch({
      type: 'selectYAxisCustomRange',
      axis: axis,
      range: range
    });
  };

  var debounceSetMax = (0, _lodash.debounce)(function (value) {
    setMax(value);
  }, 200);
  var debounceSetMin = (0, _lodash.debounce)(function (value) {
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
    onChange: function onChange(event, value) {
      dispatch({
        type: 'selectYAxisRangeMode',
        axis: axis,
        mode: value
      });
    }
  }, Object.keys(_TimeSeriesViewerContext.Y_AXIS_RANGE_MODES).map(function (key) {
    return /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
      key: key,
      value: key,
      size: "small",
      className: classNames[rangeMode !== key ? 'deselected' : 'selected'],
      title: _TimeSeriesViewerContext.Y_AXIS_RANGE_MODE_DETAILS[key].description
    }, _TimeSeriesViewerContext.Y_AXIS_RANGE_MODE_DETAILS[key].name);
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.yAxisRangeInnerContainer
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.yAxisRangeTextfieldContainer
  }, /*#__PURE__*/_react.default.createElement(_TextField.default, {
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
    disabled: !isCustom,
    value: activeRange[1],
    className: classes.yAxisRangeTextField,
    onFocus: function onFocus() {
      setIsActivelySetting(true);
    },
    onBlur: function onBlur(event) {
      setMax(event.target.value);
      setIsActivelySetting(false);
    },
    onChange: function onChange(event) {
      setActiveRange([activeRange[0], event.target.value]);
      debounceSetMax(event.target.value);
    }
  }), /*#__PURE__*/_react.default.createElement(_TextField.default, {
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
    disabled: !isCustom,
    value: activeRange[0],
    className: classes.yAxisRangeTextField,
    onFocus: function onFocus() {
      setIsActivelySetting(true);
    },
    onBlur: function onBlur(event) {
      setMin(event.target.value);
      setIsActivelySetting(false);
    },
    onChange: function onChange(event) {
      setActiveRange([event.target.value, activeRange[1]]);
      debounceSetMin(event.target.value);
    }
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.standardDeviation,
    title: "Standard Deviation"
  }, /*#__PURE__*/_react.default.createElement("i", null, "".concat(String.fromCharCode(963))), " = ", "".concat(standardDeviation))), /*#__PURE__*/_react.default.createElement(NeonVerticalSlider, {
    disabled: !isCustom,
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
    value: _toConsumableArray(axisRange),
    valueLabelFormat: function valueLabelFormat(x) {
      return x.toFixed(precision);
    },
    onChange: function onChange(event, values) {
      var range = values.map(function (v) {
        return parseFloat(Math.min(Math.max(v, customMin), customMax).toFixed(precision), 10);
      });
      dispatch({
        type: 'selectYAxisCustomRange',
        axis: axis,
        range: range
      });
    }
  })));
};

YAxisRangeOption.propTypes = _propTypes.default.oneOf(['y1', 'y2']).isRequired;
/**
   x Axis - Roll Period Option
*/

var RollPeriodOption = function RollPeriodOption() {
  var _TimeSeriesViewerCont5 = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont6 = _slicedToArray(_TimeSeriesViewerCont5, 2),
      state = _TimeSeriesViewerCont6[0],
      dispatch = _TimeSeriesViewerCont6[1];

  var selection = state.selection;
  var currentRollPeriod = selection.rollPeriod,
      selectedTimeStep = selection.timeStep,
      autoTimeStep = selection.autoTimeStep;
  var currentTimeStep = selectedTimeStep === 'auto' ? autoTimeStep : selectedTimeStep;
  var dateRangeMonths = selection.continuousDateRange.length;
  var timeStepSeconds = currentTimeStep ? _TimeSeriesViewerContext.TIME_STEPS[currentTimeStep].seconds : 1800;
  var rollStepsPerMonth = 30 * 24 * 60 * 60 / timeStepSeconds;
  var rollMin = 1;
  var rollMax = Math.floor(Math.max(dateRangeMonths * rollStepsPerMonth, currentRollPeriod) / 4); // Local state for the slider value as we change it. This lets us change the value with a
  // controlled slider component without having to send all updates through the main context reducer

  var _useState5 = (0, _react.useState)(currentRollPeriod),
      _useState6 = _slicedToArray(_useState5, 2),
      activeRollPeriod = _useState6[0],
      setActiveRollPeriod = _useState6[1];

  var _useState7 = (0, _react.useState)(false),
      _useState8 = _slicedToArray(_useState7, 2),
      isActivelySetting = _useState8[0],
      setIsActivelySetting = _useState8[1];

  (0, _react.useEffect)(function () {
    if (activeRollPeriod !== currentRollPeriod && !isActivelySetting) {
      setActiveRollPeriod(currentRollPeriod);
    }
  }, [activeRollPeriod, currentRollPeriod, isActivelySetting, setActiveRollPeriod]); // Determine slider marks

  var interimMarks = rollMax - rollMin < 8 ? 2 : 3;
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
  });
  return !currentTimeStep ? /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
    variant: "rect",
    width: "100%",
    height: 56
  }) : /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: '100%',
      minWidth: _Theme.default.spacing(40)
    }
  }, /*#__PURE__*/_react.default.createElement(NeonSlider, {
    marks: marks,
    "data-selenium": "time-series-viewer.options.roll-period-slider",
    value: activeRollPeriod,
    valueLabelDisplay: "auto",
    valueLabelFormat: function valueLabelFormat(x) {
      return (0, _TimeSeriesViewerContext.summarizeTimeSteps)(x, currentTimeStep);
    },
    min: rollMin,
    max: rollMax,
    onMouseDown: function onMouseDown() {
      setIsActivelySetting(true);
    },
    onChange: function onChange(event, value) {
      setActiveRollPeriod(Math.min(Math.max(value, rollMin), rollMax));
    },
    onChangeCommitted: function onChangeCommitted(event, value) {
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
  }, Array.from(availableTimeSteps).map(function (timeStep) {
    var className = timeStep === selectedTimeStep ? "".concat(classes.optionButton, " ").concat(classes.optionButtonSelected) : classes.optionButton;
    return /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
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
    description: 'Toggle between linear and logarithmic scales on all y axes',
    Component: YAxisScaleOption
  },
  Y1_AXIS_RANGE: {
    title: 'y1 Range',
    description: 'Set min and max range for y1 axis ({units})',
    Component: function Component() {
      return /*#__PURE__*/_react.default.createElement(YAxisRangeOption, {
        axis: "y1"
      });
    },
    axis: 'y1'
  },
  Y2_AXIS_RANGE: {
    title: 'y2 Range',
    description: 'Set min and max range for y2 axis ({units})',
    Component: function Component() {
      return /*#__PURE__*/_react.default.createElement(YAxisRangeOption, {
        axis: "y2"
      });
    },
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
  var classes = useStyles(_Theme.default);

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

  var hasY2Axis = selection.yAxes.y2.units !== null;
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
      marginRight: _Theme.default.spacing(3)
    }
  }, renderOption('Y_AXIS_SCALE')), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.yAxesRangesContainer
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: !hasY2Axis ? null : {
      marginRight: _Theme.default.spacing(3)
    }
  }, renderOption('Y1_AXIS_RANGE')), !hasY2Axis ? null : renderOption('Y2_AXIS_RANGE')))), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6",
    style: {
      marginBottom: _Theme.default.spacing(2)
    }
  }, "x Axis (Time)"), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.optionsContainer
  }, state.availableTimeSteps.size < 3 ? null : /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginRight: _Theme.default.spacing(3)
    }
  }, renderOption('TIME_STEP')), renderOption('ROLL_PERIOD'))));
}