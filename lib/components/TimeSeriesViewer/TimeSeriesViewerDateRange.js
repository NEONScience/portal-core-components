"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styles = require("@material-ui/core/styles");

var _pickers = require("@material-ui/pickers");

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _Slider = _interopRequireDefault(require("@material-ui/core/Slider"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Skeleton = _interopRequireDefault(require("@material-ui/lab/Skeleton"));

var _moment = _interopRequireDefault(require("@date-io/moment"));

var _moment2 = _interopRequireDefault(require("moment"));

var _AvailabilityGrid = require("../DataProductAvailability/AvailabilityGrid");

var _AvailabilityLegend = _interopRequireDefault(require("../DataProductAvailability/AvailabilityLegend"));

var _FullWidthVisualization = _interopRequireDefault(require("../FullWidthVisualization/FullWidthVisualization"));

var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _TimeSeriesViewerContext = _interopRequireDefault(require("./TimeSeriesViewerContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var getYearMonthMoment = function getYearMonthMoment(yearMonth) {
  var day = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;
  return (0, _moment2.default)("".concat(yearMonth, "-").concat(day.toString().padStart(2, '0')));
};

var svgMinWidth = (_AvailabilityGrid.SVG.CELL_WIDTH + _AvailabilityGrid.SVG.CELL_PADDING) * _AvailabilityGrid.SVG.MIN_CELLS + Math.floor(_AvailabilityGrid.SVG.MIN_CELLS / 12) * _AvailabilityGrid.SVG.YEAR_PADDING;

var svgMinHeight = (_AvailabilityGrid.SVG.CELL_HEIGHT + _AvailabilityGrid.SVG.CELL_PADDING) * (_AvailabilityGrid.SVG.MIN_ROWS + 1);
var useStyles = (0, _styles.makeStyles)(function () {
  return {
    svg: {
      minWidth: "".concat(svgMinWidth, "px"),
      minHeight: "".concat(svgMinHeight, "px")
    }
  };
});

var boxShadow = function boxShadow(alpha) {
  return "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,".concat(alpha, "),0 0 0 1px rgba(0,0,0,0.02)");
};

var DateRangeSlider = (0, _styles.withStyles)({
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
var sliderDefault = [];

var TimeSeriesViewerDateRange = function TimeSeriesViewerDateRange(props) {
  var classes = useStyles(_Theme.default);
  var dateRangeSliderRef = props.dateRangeSliderRef;

  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
      neonContextData = _NeonContext$useNeonC2[0].data;

  var allSites = neonContextData.sites;

  var _TimeSeriesViewerCont = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont2 = _slicedToArray(_TimeSeriesViewerCont, 2),
      state = _TimeSeriesViewerCont2[0],
      dispatch = _TimeSeriesViewerCont2[1];

  var currentRange = state.selection.dateRange;
  var selectableRange = state.product.dateRange;
  var displayRange = state.product.continuousDateRange;
  var displayMin = 0;
  var displayMax = displayRange.length - 1;
  var sliderMin = displayRange.indexOf(selectableRange[0]);
  var sliderMax = displayRange.indexOf(selectableRange[1]); // Derive site and availability values for the AvailabilityGrid

  var availabilityDateRange = {
    value: currentRange,
    validValues: selectableRange
  };
  var selectedSites = state.selection.sites.map(function (site) {
    return site.siteCode;
  });
  var availabilitySites = {
    value: selectedSites,
    validValues: selectedSites
  };
  var availabilityData = {
    view: 'sites',
    name: 'Site',
    selectable: true,
    rows: {},
    getLabel: {
      text: function text(key) {
        return key;
      },
      title: function title(key) {
        return allSites[key] ? allSites[key].description : key;
      }
    }
  };
  selectedSites.forEach(function (siteCode) {
    availabilityData.rows[siteCode] = {};
    state.product.sites[siteCode].availableMonths.forEach(function (month) {
      availabilityData.rows[siteCode][month] = 'available';
    });
  });
  var svgHeight = _AvailabilityGrid.SVG.CELL_PADDING + (_AvailabilityGrid.SVG.CELL_HEIGHT + _AvailabilityGrid.SVG.CELL_PADDING) * (selectedSites.length + 1); // Function to apply changes to the slider's DOM as if it was controlled by state.
  // We can't control in state because doing so makes drag experience jerky and frustrating.
  // By not controlling the slider with state we can maintain a fluid experience and need
  // only this bit of logic (with a ref to the slider's DOM node) to keep the slider
  // DOM in sync as if it was controlled directly.

  var applySliderValues = (0, _react.useCallback)(function (values) {
    if (!Array.isArray(values) || values.length !== 2 || !displayRange[values[0]] || !displayRange[values[1]] || values[0] > values[1]) {
      return;
    }

    var limited = [Math.max(values[0], sliderMin), Math.min(values[1], sliderMax)]; // Derive new percentage values for left and width styles of slider DOM elements

    var newLefts = ["".concat(limited[0] / (displayMax + 1) * 100, "%"), "".concat(limited[1] / (displayMax + 1) * 100, "%")]; // Apply values to Slider DOM hidden input

    dateRangeSliderRef.current.querySelector('input[type="hidden"]').value = limited.join(','); // Apply values to slider drag handles

    [0, 1].forEach(function (idx) {
      dateRangeSliderRef.current.querySelector("span[data-index=\"".concat(idx, "\"]")).setAttribute('aria-valuenow', limited[idx].toString());
      dateRangeSliderRef.current.querySelector("span[data-index=\"".concat(idx, "\"]")).style.left = newLefts[idx];
      dateRangeSliderRef.current.querySelector("span[data-index=\"".concat(idx, "\"] > span > span > span")).innerText = displayRange[limited[idx]];
    }); // Apply values to slider track between drag handles

    var newTrackWidth = "".concat((limited[1] - limited[0] + 1) / (displayMax + 1) * 100, "%");
    dateRangeSliderRef.current.querySelector('.MuiSlider-track').style.width = newTrackWidth; // eslint-disable-next-line prefer-destructuring

    dateRangeSliderRef.current.querySelector('.MuiSlider-track').style.left = newLefts[0];
  }, [dateRangeSliderRef, displayRange, displayMax, sliderMin, sliderMax]);
  (0, _react.useEffect)(function () {
    if (!dateRangeSliderRef.current) {
      return;
    }

    var sliderValues = dateRangeSliderRef.current.querySelector('input[type="hidden"]').value;
    var compareValues = [currentRange[0] === null ? sliderMin : displayRange.indexOf(currentRange[0]), currentRange[1] === null ? sliderMax : displayRange.indexOf(currentRange[1])];

    if (sliderValues !== compareValues.join(',')) {
      applySliderValues(compareValues);
    }
  }, [dateRangeSliderRef, currentRange, displayRange, sliderMin, sliderMax, applySliderValues]); // Set up AvailabilityGrid

  var setDateRangeValue = (0, _react.useCallback)(function (dateRange) {
    return dispatch({
      type: 'selectDateRange',
      dateRange: dateRange
    });
  }, [dispatch]);
  var svgRef = (0, _react.useRef)(null);
  var handleSvgRedraw = (0, _react.useCallback)(function () {
    (0, _AvailabilityGrid.AvailabilityGrid)({
      data: availabilityData,
      svgRef: svgRef,
      allSites: allSites,
      sites: availabilitySites,
      dateRange: availabilityDateRange,
      setDateRangeValue: setDateRangeValue
    });
  }, [svgRef, allSites, availabilityData, availabilitySites, availabilityDateRange, setDateRangeValue]);
  (0, _react.useEffect)(function () {
    handleSvgRedraw();
  }); // Render nothing if no selectable range is available or no sites are yet selected

  if (!displayRange.length || !selectedSites.length) {
    return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
      variant: "rect",
      width: "100%",
      height: 56
    }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        marginBottom: _Theme.default.spacing(3)
      }
    }, /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
      variant: "rect",
      width: "100%",
      height: 40
    }), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        width: '40px'
      }
    }), /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
      variant: "rect",
      width: "100%",
      height: 40
    })), /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
      variant: "rect",
      width: 300,
      height: 28
    }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
      variant: "rect",
      width: "100%",
      height: 80
    }));
  }

  var marks = [{
    value: displayMin,
    label: displayRange[displayMin].substring(0, 4)
  }];
  var yearsInSlider = Math.floor(displayRange.length / 12);
  var innerMark = Math.ceil(yearsInSlider / Math.ceil(yearsInSlider % 3 ? 2 : 3));

  for (var y = 1; y < yearsInSlider; y += 1) {
    marks.push({
      value: 12 * y,
      label: y === innerMark || y === innerMark * 2 ? displayRange[12 * y].substring(0, 4) : null
    });
  }

  marks.push({
    value: displayMax,
    label: displayRange[displayMax].substring(0, 4)
  });

  var handleChangeDatePicker = function handleChangeDatePicker(rangeIndex, value) {
    // Confirm arguments are sane
    var formattedValue = value.format('YYYY-MM');
    var newSliderValue = displayRange.indexOf(formattedValue);

    if (!formattedValue || ![0, 1].includes(rangeIndex) || newSliderValue === -1) {
      return;
    } // Generate new selected dateRange bounded by min/max


    var dateRange = [currentRange[0] === null ? displayRange[sliderMin] : currentRange[0], currentRange[1] === null ? displayRange[sliderMax] : currentRange[1]];
    dateRange[rangeIndex] = formattedValue;
    dispatch({
      type: 'selectDateRange',
      dateRange: dateRange
    });
  }; // Only set slider defaults on the initial render


  if (!Object.isFrozen(sliderDefault)) {
    sliderDefault = [displayRange.indexOf(currentRange[0]), displayRange.indexOf(currentRange[1])];
    Object.freeze(sliderDefault);
  }

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginBottom: _Theme.default.spacing(2)
    }
  }, /*#__PURE__*/_react.default.createElement(_pickers.MuiPickersUtilsProvider, {
    utils: _moment.default
  }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
    container: true,
    spacing: 2,
    style: {
      marginBottom: _Theme.default.spacing(1)
    }
  }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    sm: 6,
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/_react.default.createElement(_pickers.DatePicker, {
    "data-selenium": "time-series-viewer.date-range.start-input",
    inputVariant: "outlined",
    margin: "dense",
    value: getYearMonthMoment(currentRange[0] || displayRange[sliderMin]),
    onChange: function onChange(value) {
      return handleChangeDatePicker(0, value);
    },
    views: ['month', 'year'],
    label: "Start",
    openTo: "month",
    minDate: getYearMonthMoment(displayRange[sliderMin], 10),
    maxDate: getYearMonthMoment(currentRange[1] || displayRange[sliderMax], 20)
  })), /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    sm: 6,
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/_react.default.createElement(_pickers.DatePicker, {
    "data-selenium": "time-series-viewer.date-range.end-input",
    inputVariant: "outlined",
    margin: "dense",
    value: getYearMonthMoment(currentRange[1] || displayRange[sliderMax]),
    onChange: function onChange(value) {
      return handleChangeDatePicker(1, value);
    },
    views: ['month', 'year'],
    label: "End",
    openTo: "month",
    minDate: getYearMonthMoment(currentRange[0] || displayRange[sliderMin], 10),
    maxDate: getYearMonthMoment(displayRange[sliderMax], 20)
  })))), /*#__PURE__*/_react.default.createElement(DateRangeSlider, {
    "data-selenium": "time-series-viewer.date-range.slider",
    ref: dateRangeSliderRef,
    defaultValue: _toConsumableArray(sliderDefault),
    valueLabelDisplay: "auto",
    min: displayMin,
    max: displayMax,
    marks: marks,
    valueLabelFormat: function valueLabelFormat(x) {
      return displayRange[x];
    },
    onChange: function onChange(event, values) {
      applySliderValues(values);
    },
    onChangeCommitted: function onChangeCommitted(event, values) {
      dispatch({
        type: 'selectDateRange',
        dateRange: [Math.max(values[0], sliderMin), Math.min(values[1], sliderMax)].map(function (x) {
          return displayRange[x];
        })
      });
    }
  })), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "subtitle1",
    style: {
      fontWeight: 600,
      marginBottom: _Theme.default.spacing(1)
    }
  }, "Select by Data Product Availability"), /*#__PURE__*/_react.default.createElement(_FullWidthVisualization.default, {
    vizRef: svgRef,
    handleRedraw: handleSvgRedraw
  }, /*#__PURE__*/_react.default.createElement("svg", {
    ref: svgRef,
    height: svgHeight,
    className: classes.svg
  })), /*#__PURE__*/_react.default.createElement(_AvailabilityLegend.default, {
    style: {
      flexGrow: 1
    }
  })));
};

var _default = TimeSeriesViewerDateRange;
exports.default = _default;
TimeSeriesViewerDateRange.propTypes = {
  dateRangeSliderRef: _propTypes.default.shape({
    current: _propTypes.default.instanceOf(Element)
  }).isRequired
};