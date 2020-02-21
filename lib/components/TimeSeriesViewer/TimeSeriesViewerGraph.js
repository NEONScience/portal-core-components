"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TimeSeriesViewerGraph;

var _react = _interopRequireWildcard(require("react"));

var _dygraphs = _interopRequireDefault(require("dygraphs"));

require("dygraphs/dist/dygraph.min.css");

var _TimeSeriesViewerContext = _interopRequireWildcard(require("./TimeSeriesViewerContext"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/*
const preStyle = {
  whiteSpace: 'pre-wrap',
  border: '1px solid black',
  padding: '2px',
  overflowY: 'scroll',
};
*/
var BASE_GRAPH_OPTIONS = {
  includeZero: true,
  labelsUTC: true,
  labelsKMB: false,
  showRangeSelector: true,
  interactionModel: _dygraphs.default.defaultInteractionModel,
  connectSeparatedPoints: false,
  rangeSelectorPlotFillColor: _Theme.default.palette.primary.light,
  animatedZooms: true
  /*
    highlightSeriesOpts: {
    strokeWidth: 2,
    },
  */

  /*
    logscale: this.props.timeSeries.graph.isLogScaled,
    labelsDiv: this.legend,
    legend: "always",
    legendFormatter: this.renderLegend,
  */

};

function TimeSeriesViewerGraph() {
  var _TimeSeriesViewerCont = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont2 = _slicedToArray(_TimeSeriesViewerCont, 1),
      state = _TimeSeriesViewerCont2[0];

  var dygraphRef = (0, _react.useRef)(null);
  var dygraphDomRef = (0, _react.useRef)(null);
  var axisCountRef = (0, _react.useRef)(1);
  var axisCountChangedRef = (0, _react.useRef)(false);
  var _state$selection = state.selection,
      selectionDigest = _state$selection.selectionDigest,
      continuousDateRange = _state$selection.continuousDateRange,
      variables = _state$selection.variables,
      sites = _state$selection.sites,
      options = _state$selection.options;
  var timeStep = options.timeStep,
      rollPeriod = options.rollPeriod;
  var data = [];
  var monthOffsets = [];
  var labels = ['x'];
  var series = [];
  var graphOptions = BASE_GRAPH_OPTIONS; // Build the first column (dateTime) and keep track of where the month breaks are

  var buildTimeData = function buildTimeData() {
    continuousDateRange.forEach(function (month, idx) {
      monthOffsets[idx] = data.length;
      state.product.sites[sites[0].siteCode].positions[sites[0].positions[0]].data[month].basic[timeStep].series.startDateTime.forEach(function (d) {
        data.push([d]);
      });
    });
  }; // Build the rest of the data structure and labels using selection values


  var buildSeriesData = function buildSeriesData() {
    sites.forEach(function (site) {
      var siteCode = site.siteCode,
          positions = site.positions;
      positions.forEach(function (position) {
        continuousDateRange.forEach(function (month, monthIdx) {
          variables.forEach(function (variable) {
            var label = "".concat(siteCode, " ").concat(position, " - ").concat(variable);

            if (!labels.includes(label)) {
              labels.push(label);
              series.push({
                siteCode: siteCode,
                position: position,
                variable: variable,
                label: label,
                units: state.variables[variable].units
              });
            }

            var columnIdx = labels.indexOf(label);
            var downloadPkg = state.variables[variable].downloadPkg;
            state.product.sites[siteCode].positions[position].data[month][downloadPkg][timeStep].series[variable].forEach(function (d, datumIdx) {
              data[datumIdx + monthOffsets[monthIdx]][columnIdx] = d;
            });
          });
        });
      });
    });
  }; // Build the axes option


  var buildAxesOption = function buildAxesOption() {
    var axes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var axesOption = {
      x: {
        valueFormatter: _dygraphs.default.dateString_,
        // eslint-disable-line no-underscore-dangle
        ticker: _dygraphs.default.dateTicker,
        axisLabelFormatter: _dygraphs.default.dateAxisLabelFormatter
      }
    };
    axes.forEach(function (axis) {
      axesOption[axis.axis] = {
        independentTicks: true
      };
    });
    return axesOption;
  }; // Build the series option


  var buildSeriesOption = function buildSeriesOption() {
    var axes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var seriesOption = {};
    series.forEach(function (serie) {
      var axis = axes.find(function (a) {
        return a.units === serie.units;
      });

      if (!axis) {
        return;
      }

      seriesOption[serie.label] = {
        axis: axis.axis
      };
    });
    return seriesOption;
  };

  if (state.status === _TimeSeriesViewerContext.TIME_SERIES_VIEWER_STATUS.READY) {
    buildTimeData();
    buildSeriesData(); // Determine the set of axes and their units

    var previousAxisCount = axisCountRef.current;
    var axes = [{
      axis: 'y',
      units: state.variables[variables[0]].units
    }];

    if (variables.length > 1) {
      var otherUnitVariable = variables.find(function (variable) {
        return state.variables[variable].units !== axes[0].units;
      });

      if (otherUnitVariable) {
        axes.push({
          axis: 'y2',
          units: state.variables[otherUnitVariable].units
        });
      }
    }

    axisCountChangedRef.current = axes.length !== previousAxisCount;
    axisCountRef.current = axes.length; // Build graphOptions

    graphOptions = _extends({}, BASE_GRAPH_OPTIONS, {
      labels: labels,
      axes: buildAxesOption(axes),
      series: buildSeriesOption(axes),
      rollPeriod: rollPeriod
    }); // Apply axis labels to graphOptions

    axes.forEach(function (axis) {
      graphOptions["".concat(axis.axis, "label")] = axis.units;
    });
  }

  (0, _react.useEffect)(function () {
    if (state.status !== _TimeSeriesViewerContext.TIME_SERIES_VIEWER_STATUS.READY) {
      return;
    }

    if (dygraphRef.current === null) {
      dygraphRef.current = new _dygraphs.default(dygraphDomRef.current, data, graphOptions);
    } else {
      dygraphRef.current.updateOptions(_extends({
        file: data
      }, graphOptions)); // Dygraphs has a bug where the canvas isn't cleared properly when dynamically changing
      // the y-axis count. We can force a canvas refresh by cycling the range selector. This
      // is not clean, but it is at least minimally invasive.

      if (axisCountChangedRef.current) {
        dygraphRef.current.updateOptions({
          showRangeSelector: false
        });
        dygraphRef.current.updateOptions({
          showRangeSelector: true
        });
      }
    }
  }, [selectionDigest, state.status, data, graphOptions, dygraphRef, axisCountChangedRef]);
  /**
     RENDER
  */

  /*
  const renderPre = () => (state.status === TIME_SERIES_VIEWER_STATUS.READY ? (
    <pre style={{ ...preStyle, height: '45vh' }}>
      {JSON.stringify({ graphOptions, data }, null, 2)}
    </pre>
  ) : null);
  */

  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("div", {
    ref: dygraphDomRef,
    style: {
      width: '100%'
    }
  }));
}