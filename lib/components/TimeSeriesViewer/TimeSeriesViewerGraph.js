"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TimeSeriesViewerGraph;

var _react = _interopRequireWildcard(require("react"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _dygraphs = _interopRequireDefault(require("dygraphs"));

require("dygraphs/dist/dygraph.min.css");

var _styles = require("@material-ui/core/styles");

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

var COLORS = ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'];
var BASE_GRAPH_OPTIONS = {
  includeZero: true,
  labelsUTC: true,
  labelsKMB: false,
  showRangeSelector: true,
  interactionModel: _dygraphs.default.defaultInteractionModel,
  connectSeparatedPoints: false,
  rangeSelectorPlotFillColor: _Theme.default.palette.primary.light,
  animatedZooms: true,
  colors: COLORS,
  highlightSeriesOpts: {
    strokeWidth: 1.5
  }
};
var boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    graphContainer: {
      padding: theme.spacing(2),
      display: 'flex',
      alignItems: 'flex-start'
    },
    graphDiv: {
      height: '320px',
      flexGrow: 1
    },
    legendDiv: {
      flexShrink: 0,
      marginLeft: theme.spacing(1)
    },
    legendSeries: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexWrap: 'nowrap',
      padding: theme.spacing(1),
      borderRadius: theme.spacing(1),
      marginBottom: theme.spacing(1),
      backgroundColor: theme.palette.grey[50],
      boxShadow: boxShadow
    },
    legendSeriesX: {
      whiteSpace: 'nowrap',
      padding: theme.spacing(1),
      borderRadius: theme.spacing(1),
      backgroundColor: theme.palette.grey[100],
      textAlign: 'center',
      fontWeight: 600,
      boxShadow: boxShadow
    },
    legendSeriesColor: {
      width: theme.spacing(3),
      height: '4px',
      borderRadius: '2px'
    },
    legendSeriesLabel: {
      whiteSpace: 'nowrap',
      lineHeight: '1rem',
      fontSize: '0.8rem',
      marginLeft: theme.spacing(1)
    }
  };
});

function TimeSeriesViewerGraph() {
  var classes = useStyles(_Theme.default);

  var _TimeSeriesViewerCont = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont2 = _slicedToArray(_TimeSeriesViewerCont, 1),
      state = _TimeSeriesViewerCont2[0];

  var dygraphRef = (0, _react.useRef)(null);
  var dygraphDomRef = (0, _react.useRef)(null);
  var legendRef = (0, _react.useRef)(null);
  var axisCountRef = (0, _react.useRef)(1);
  var axisCountChangedRef = (0, _react.useRef)(false);
  var _state$selection = state.selection,
      selectionDigest = _state$selection.selectionDigest,
      continuousDateRange = _state$selection.continuousDateRange,
      variables = _state$selection.variables,
      sites = _state$selection.sites,
      selectedTimeStep = _state$selection.timeStep,
      autoTimeStep = _state$selection.autoTimeStep,
      rollPeriod = _state$selection.rollPeriod,
      logscale = _state$selection.logscale,
      yAxes = _state$selection.yAxes;
  var timeStep = selectedTimeStep === 'auto' ? autoTimeStep : selectedTimeStep;
  var data = [];
  var monthOffsets = [];
  var labels = ['x'];
  var series = [];
  var graphOptions = BASE_GRAPH_OPTIONS; // Build the first column (dateTime) and keep track of where the month breaks are

  var buildTimeData = function buildTimeData() {
    var downloadPkg = 'basic';
    var source = state.product.sites[sites[0].siteCode].positions[sites[0].positions[0]];
    continuousDateRange.forEach(function (month, idx) {
      monthOffsets[idx] = data.length;

      if (!source.data[month] || !source.data[month][downloadPkg] || !source.data[month][downloadPkg][timeStep]) {
        return;
      }

      source.data[month][downloadPkg][timeStep].series.startDateTime.forEach(function (d) {
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
            var label = "".concat(siteCode, " - ").concat(position, " - ").concat(variable);

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
            var source = state.product.sites[siteCode].positions[position];

            if (!source.data[month] || !source.data[month][downloadPkg] || !source.data[month][downloadPkg][timeStep]) {
              return;
            }

            source.data[month][downloadPkg][timeStep].series[variable].forEach(function (d, datumIdx) {
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
    series.forEach(function (s) {
      var axis = axes.find(function (a) {
        return a.units === s.units;
      });

      if (!axis) {
        return;
      }

      seriesOption[s.label] = {
        axis: axis.axis
      };
    });
    return seriesOption;
  };

  var legendFormatter = function legendFormatter(graphData) {
    return _server.default.renderToString(_react.default.createElement(_react.default.Fragment, null, graphData.series.map(function (s, idx) {
      var units = series[idx].units;
      var yUnits = units;

      if (typeof s.y !== 'undefined') {
        var yStr = s.y.toString();

        if (yStr.indexOf('.') !== -1 && yStr.length - yStr.indexOf('.') > 3) {
          yStr = s.y.toFixed(2).toString();
        }

        var yUnitsStr = "".concat(yStr, " ").concat(units);
        yUnits = s.isHighlighted ? _react.default.createElement("b", null, yUnitsStr) : yUnitsStr;
      }

      var seriesStyle = s.isHighlighted ? {
        backgroundColor: _Theme.default.palette.grey[100]
      } : {};
      var colorStyle = {
        backgroundColor: s.color
      };

      if (s.isHighlighted) {
        colorStyle.height = '6px';
      }

      return _react.default.createElement("div", {
        key: s.label,
        className: classes.legendSeries,
        style: seriesStyle
      }, _react.default.createElement("div", {
        className: classes.legendSeriesColor,
        style: colorStyle
      }), _react.default.createElement("div", {
        className: classes.legendSeriesLabel
      }, s.label, _react.default.createElement("br", null), yUnits));
    }), graphData.x ? _react.default.createElement("div", {
      className: classes.legendSeriesX
    }, graphData.xHTML) : null));
  };

  if (state.status === _TimeSeriesViewerContext.TIME_SERIES_VIEWER_STATUS.READY) {
    buildTimeData();
    buildSeriesData(); // Determine the set of axes and their units

    var previousAxisCount = axisCountRef.current;
    var axes = Object.keys(yAxes).map(function (axis) {
      return {
        axis: axis === 'y1' ? 'y' : 'y2',
        units: yAxes[axis].units // logscale: yAxes[axis].logscale,

      };
    }).slice(0, yAxes.y2.units === null ? 1 : 2);
    axisCountChangedRef.current = axes.length !== previousAxisCount;
    axisCountRef.current = axes.length; // Build graphOptions

    graphOptions = _extends({}, BASE_GRAPH_OPTIONS, {
      labels: labels,
      axes: buildAxesOption(axes),
      series: buildSeriesOption(axes),
      rollPeriod: rollPeriod,
      logscale: logscale,
      labelsDiv: legendRef.current,
      legend: 'always',
      legendFormatter: legendFormatter
    }); // Apply axis labels to graphOptions

    axes.forEach(function (axis) {
      graphOptions["".concat(axis.axis, "label")] = axis.units;
    });
  }

  (0, _react.useEffect)(function () {
    if (state.status !== _TimeSeriesViewerContext.TIME_SERIES_VIEWER_STATUS.READY) {
      return;
    }

    var redrawWidth = function redrawWidth() {
      dygraphRef.current.graphDiv.style.width = null;
      dygraphRef.current.resizeHandler_();
    };

    if (dygraphRef.current === null) {
      dygraphRef.current = new _dygraphs.default(dygraphDomRef.current, data, graphOptions);
      redrawWidth();
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

      redrawWidth();
    }
  }, [selectionDigest, state.status, data, graphOptions, dygraphRef, axisCountChangedRef]);
  /**
     RENDER
  */

  return _react.default.createElement("div", {
    className: classes.graphContainer
  }, _react.default.createElement("div", {
    ref: dygraphDomRef,
    className: classes.graphDiv,
    style: {
      width: '50% !important'
    }
  }), _react.default.createElement("div", {
    ref: legendRef,
    className: classes.legendDiv
  }));
}