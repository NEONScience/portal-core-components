"use strict";

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
var _AvailabilitySvgComponents = require("../DataProductAvailability/AvailabilitySvgComponents");
var _AvailabilityUtils = require("../DataProductAvailability/AvailabilityUtils");
var _BasicAvailabilityGrid = _interopRequireDefault(require("../DataProductAvailability/BasicAvailabilityGrid"));
var _BasicAvailabilityKey = _interopRequireDefault(require("../DataProductAvailability/BasicAvailabilityKey"));
var _FullWidthVisualization = _interopRequireDefault(require("../FullWidthVisualization/FullWidthVisualization"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _ReleaseService = _interopRequireDefault(require("../../service/ReleaseService"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _TimeSeriesViewerContext = _interopRequireWildcard(require("./TimeSeriesViewerContext"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const getYearMonthMoment = function (yearMonth) {
  let day = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;
  return (0, _moment2.default)("".concat(yearMonth, "-").concat(day.toString().padStart(2, '0')));
};
const svgMinWidth = (_AvailabilityUtils.SVG.CELL_WIDTH + _AvailabilityUtils.SVG.CELL_PADDING) * _AvailabilityUtils.SVG.MIN_CELLS + Math.floor(_AvailabilityUtils.SVG.MIN_CELLS / 12) * _AvailabilityUtils.SVG.YEAR_PADDING;
const svgMinHeight = (_AvailabilityUtils.SVG.CELL_HEIGHT + _AvailabilityUtils.SVG.CELL_PADDING) * (_AvailabilityUtils.SVG.MIN_ROWS + 1);
const useStyles = (0, _styles.makeStyles)(() => ({
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
}));
const TimeSeriesViewerDateRange = props => {
  const classes = useStyles(_Theme.default);
  const {
    dateRangeSliderRef
  } = props;
  const [{
    data: neonContextData
  }] = _NeonContext.default.useNeonContextState();
  const {
    sites: allSites
  } = neonContextData;
  const [state, dispatch] = _TimeSeriesViewerContext.default.useTimeSeriesViewerState();
  const {
    dateRange: currentRange
  } = state.selection;
  let selectableRange = state.product.dateRange;
  const displayRange = state.product.continuousDateRange;
  const displayMin = 0;
  const displayMax = displayRange.length - 1;
  let sliderMin = displayRange.indexOf(selectableRange[0]);
  let sliderMax = displayRange.indexOf(selectableRange[1]);
  const [activelySelectingDateRange, setActivelySelectingDateRange] = (0, _react.useState)([...currentRange]);
  const [activelySelecting, setActivelySelecting] = (0, _react.useState)(false);
  const sliderValue = activelySelectingDateRange.map((v, i) => displayRange.indexOf(activelySelectingDateRange[i] || currentRange[i]));
  (0, _react.useEffect)(() => {
    if ((currentRange[0] !== activelySelectingDateRange[0] || currentRange[1] !== activelySelectingDateRange[1]) && !activelySelecting) {
      setActivelySelectingDateRange([...currentRange]);
    }
  }, [activelySelecting, activelySelectingDateRange, setActivelySelectingDateRange, currentRange]);

  // check currentRange to make sure values don't exceed points allowed
  const pointsAvailable = _TimeSeriesViewerContext.POINTS_PERFORMANCE_LIMIT - _TimeSeriesViewerContext.default.calcPredictedPointsByDateRange(state, currentRange[0], currentRange[1]);
  const pointsPerMonth = _TimeSeriesViewerContext.default.calcPredictedPointsByDateRange(state, '2024-01', '2024-01');
  const monthsAvailable = Math.floor(pointsAvailable / pointsPerMonth);
  if (monthsAvailable < displayRange.length) {
    sliderMin = Math.max(displayRange.indexOf(selectableRange[0]), displayRange.indexOf(currentRange[0]) - monthsAvailable);
    sliderMax = Math.min(displayRange.indexOf(selectableRange[1]), displayRange.indexOf(currentRange[1]) + monthsAvailable);
    selectableRange = [displayRange[sliderMin], displayRange[sliderMax]];
  }

  // Derive site and availability values for the AvailabilityGrid
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const availabilityDateRange = {
    value: currentRange,
    validValues: selectableRange
  };
  const selectedSites = state.selection.sites.map(site => site.siteCode);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const availabilitySites = {
    value: selectedSites,
    validValues: selectedSites
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const availabilityData = {
    view: 'sites',
    name: 'Site',
    selectable: true,
    rows: {},
    getLabel: {
      text: key => key,
      title: key => allSites[key] ? allSites[key].description : key
    }
  };
  selectedSites.forEach(siteCode => {
    let provAvailableMonths = [];
    const avaReleases = state.product.sites[siteCode].availableReleases;
    if (Array.isArray(avaReleases)) {
      const provRelease = avaReleases.find(value => value.release === 'PROVISIONAL');
      if (provRelease) {
        provAvailableMonths = provRelease.availableMonths;
      }
    }
    availabilityData.rows[siteCode] = {};
    state.product.sites[siteCode].availableMonths.forEach(month => {
      let status = 'available';
      if (provAvailableMonths && provAvailableMonths.length > 0) {
        if (provAvailableMonths.includes(month)) {
          status = 'available-provisional';
        }
      }
      if (!availabilityData.rows[siteCode][month]) {
        availabilityData.rows[siteCode][month] = new Set();
      }
      availabilityData.rows[siteCode][month].add(status);
    });
  });
  const svgHeight = _AvailabilityUtils.SVG.CELL_PADDING + (_AvailabilityUtils.SVG.CELL_HEIGHT + _AvailabilityUtils.SVG.CELL_PADDING) * (selectedSites.length + 1);

  // Set up AvailabilityGrid
  const setDateRangeValue = (0, _react.useCallback)(dateRange => dispatch({
    type: 'selectDateRange',
    dateRange
  }), [dispatch]);
  const svgRef = (0, _react.useRef)(null);
  const handleSvgRedraw = (0, _react.useCallback)(() => {
    (0, _BasicAvailabilityGrid.default)({
      data: availabilityData,
      svgRef,
      allSites,
      sites: availabilitySites,
      dateRange: availabilityDateRange,
      setDateRangeValue
    });
  }, [svgRef, allSites, availabilityData, availabilitySites, availabilityDateRange, setDateRangeValue]);
  (0, _react.useEffect)(() => {
    handleSvgRedraw();
  });

  // Render nothing if no selectable range is available or no sites are yet selected
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
  const marks = [{
    value: displayMin,
    label: displayRange[displayMin].substring(0, 4)
  }];
  const yearsInSlider = Math.floor(displayRange.length / 12);
  const innerMark = Math.ceil(yearsInSlider / Math.ceil(yearsInSlider % 3 ? 2 : 3));
  for (let y = 1; y < yearsInSlider; y += 1) {
    marks.push({
      value: 12 * y,
      label: y === innerMark || y === innerMark * 2 ? displayRange[12 * y].substring(0, 4) : null
    });
  }
  marks.push({
    value: displayMax,
    label: displayRange[displayMax].substring(0, 4)
  });
  const handleChangeDatePicker = (rangeIndex, value) => {
    // Confirm arguments are sane
    const formattedValue = value.format('YYYY-MM');
    const newSliderValue = displayRange.indexOf(formattedValue);
    if (!formattedValue || ![0, 1].includes(rangeIndex) || newSliderValue === -1) {
      return;
    }
    // Generate new selected dateRange bounded by min/max
    const dateRange = [currentRange[0] === null ? displayRange[sliderMin] : currentRange[0], currentRange[1] === null ? displayRange[sliderMax] : currentRange[1]];
    dateRange[rangeIndex] = formattedValue;
    dispatch({
      type: 'selectDateRange',
      dateRange
    });
  };
  const uniqueSliderMarks = new Set((marks || []).map(m => m.value)).size;
  const renderedSlider = uniqueSliderMarks <= 1 ? null : /*#__PURE__*/_react.default.createElement(_Slider.default, {
    "data-selenium": "time-series-viewer.date-range.slider",
    className: classes.slider,
    ref: dateRangeSliderRef,
    value: sliderValue,
    valueLabelDisplay: "auto",
    min: displayMin,
    max: displayMax,
    marks: marks,
    valueLabelFormat: x => displayRange[x],
    onMouseDown: () => {
      setActivelySelecting(true);
    },
    onChange: (event, values) => {
      setActivelySelectingDateRange([Math.max(values[0], sliderMin), Math.min(values[1], sliderMax)].map(x => displayRange[x]));
    },
    onChangeCommitted: (event, values) => {
      setActivelySelecting(false);
      dispatch({
        type: 'selectDateRange',
        dateRange: [Math.max(values[0], sliderMin), Math.min(values[1], sliderMax)].map(x => displayRange[x])
      });
    }
  });
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
    orientation: "portrait",
    value: getYearMonthMoment(currentRange[0] || displayRange[sliderMin]),
    onChange: value => handleChangeDatePicker(0, value),
    views: ['month', 'year'],
    label: "Start",
    openTo: "month",
    minDate: getYearMonthMoment(displayRange[sliderMin], 10),
    maxDate: getYearMonthMoment(currentRange[1] || displayRange[sliderMax], 20)
  })), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_pickers.DatePicker, {
    "data-selenium": "time-series-viewer.date-range.end-input",
    inputVariant: "outlined",
    margin: "dense",
    orientation: "portrait",
    value: getYearMonthMoment(currentRange[1] || displayRange[sliderMax]),
    onChange: value => handleChangeDatePicker(1, value),
    views: ['month', 'year'],
    label: "End",
    openTo: "month",
    minDate: getYearMonthMoment(currentRange[0] || displayRange[sliderMin], 10),
    maxDate: getYearMonthMoment(displayRange[sliderMax], 20)
  })))), renderedSlider)), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.optionContainer,
    style: {
      minWidth: _Theme.default.spacing(50)
    }
  }, /*#__PURE__*/_react.default.createElement(_AvailabilitySvgComponents.SvgDefs, null), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6",
    gutterBottom: true
  }, "Select by Data Product Availability"), /*#__PURE__*/_react.default.createElement(_FullWidthVisualization.default, {
    vizRef: svgRef,
    handleRedraw: handleSvgRedraw
  }, /*#__PURE__*/_react.default.createElement("svg", {
    ref: svgRef,
    height: svgHeight,
    className: classes.svg
  })), /*#__PURE__*/_react.default.createElement(_BasicAvailabilityKey.default, {
    style: {
      flexGrow: 1
    },
    delineateRelease: _ReleaseService.default.determineDelineateAvaRelease(state.release)
  })));
};
var _default = exports.default = TimeSeriesViewerDateRange;
TimeSeriesViewerDateRange.propTypes = {
  dateRangeSliderRef: _propTypes.default.shape({
    current: _propTypes.default.instanceOf(Element)
  }).isRequired
};