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

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

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
    },
    optionsContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexWrap: 'wrap'
    },
    optionContainer: {
      marginRight: _Theme.default.spacing(5),
      flexGrow: 1,
      flexBasis: 0.5
    },
    slider: {
      minWidth: _Theme.default.spacing(40),
      width: "calc(100% - ".concat(_Theme.default.spacing(6), "px)"),
      marginLeft: _Theme.default.spacing(3),
      marginBottom: _Theme.default.spacing(4)
    }
  };
});

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
  var sliderMax = displayRange.indexOf(selectableRange[1]);

  var _useState = (0, _react.useState)(_toConsumableArray(currentRange)),
      _useState2 = _slicedToArray(_useState, 2),
      activelySelectingDateRange = _useState2[0],
      setActivelySelectingDateRange = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      activelySelecting = _useState4[0],
      setActivelySelecting = _useState4[1];

  var sliderValue = activelySelectingDateRange.map(function (v, i) {
    return displayRange.indexOf(activelySelectingDateRange[i] || currentRange[i]);
  });
  (0, _react.useEffect)(function () {
    if ((currentRange[0] !== activelySelectingDateRange[0] || currentRange[1] !== activelySelectingDateRange[1]) && !activelySelecting) {
      setActivelySelectingDateRange(_toConsumableArray(currentRange));
    }
  }, [activelySelecting, activelySelectingDateRange, setActivelySelectingDateRange, currentRange]); // Derive site and availability values for the AvailabilityGrid

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
  var svgHeight = _AvailabilityGrid.SVG.CELL_PADDING + (_AvailabilityGrid.SVG.CELL_HEIGHT + _AvailabilityGrid.SVG.CELL_PADDING) * (selectedSites.length + 1); // Set up AvailabilityGrid

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
  }; // style={{ display: 'flex', justifyContent: 'center' }}


  return /*#__PURE__*/_react.default.createElement("div", {
    className: classes.optionsContainer
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.optionContainer
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6",
    gutterBottom: true
  }, "Select by Date"), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginBottom: _Theme.default.spacing(2)
    }
  }, /*#__PURE__*/_react.default.createElement(_pickers.MuiPickersUtilsProvider, {
    utils: _moment.default
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.optionsContainer,
    style: {
      marginBottom: _Theme.default.spacing(3)
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginRight: _Theme.default.spacing(3)
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
  })), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_pickers.DatePicker, {
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
  })))), /*#__PURE__*/_react.default.createElement(_Slider.default, {
    "data-selenium": "time-series-viewer.date-range.slider",
    className: classes.slider,
    ref: dateRangeSliderRef,
    value: sliderValue,
    valueLabelDisplay: "auto",
    min: displayMin,
    max: displayMax,
    marks: marks,
    valueLabelFormat: function valueLabelFormat(x) {
      return displayRange[x];
    },
    onMouseDown: function onMouseDown() {
      setActivelySelecting(true);
    },
    onChange: function onChange(event, values) {
      setActivelySelectingDateRange([Math.max(values[0], sliderMin), Math.min(values[1], sliderMax)].map(function (x) {
        return displayRange[x];
      }));
    },
    onChangeCommitted: function onChangeCommitted(event, values) {
      setActivelySelecting(false);
      dispatch({
        type: 'selectDateRange',
        dateRange: [Math.max(values[0], sliderMin), Math.min(values[1], sliderMax)].map(function (x) {
          return displayRange[x];
        })
      });
    }
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.optionContainer,
    style: {
      minWidth: _Theme.default.spacing(50)
    }
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6",
    gutterBottom: true
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