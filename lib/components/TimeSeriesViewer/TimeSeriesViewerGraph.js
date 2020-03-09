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

var _moment = _interopRequireDefault(require("moment"));

var _styles = require("@material-ui/core/styles");

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _TimeSeriesViewerContext = _interopRequireWildcard(require("./TimeSeriesViewerContext"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _NSFNEONLogo = _interopRequireDefault(require("../../images/NSF-NEON-logo.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var SERIES_COLORS = ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'];
var QUALITY_COLORS = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'];
var BASE_GRAPH_OPTIONS = {
  includeZero: true,
  labelsUTC: true,
  labelsKMB: false,
  showRangeSelector: true,
  interactionModel: _dygraphs.default.defaultInteractionModel,
  connectSeparatedPoints: false,
  rangeSelectorPlotFillColor: _Theme.default.palette.primary.light,
  animatedZooms: true,
  colors: SERIES_COLORS,
  highlightSeriesOpts: {
    strokeWidth: 1.5
  }
};
var boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    graphOuterContainer: {
      padding: theme.spacing(2)
    },
    graphInnerContainer: {
      display: 'flex',
      alignItems: 'flex-start'
    },
    graphDiv: {
      minHeight: '320px',
      flexGrow: 1
    },
    citationContainer: {
      marginTop: _Theme.default.spacing(2),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    citation: {
      color: _Theme.default.palette.grey[400]
    },
    title: {
      textAlign: 'center',
      marginBottom: theme.spacing(1.5)
    },
    neonLogo: {
      maxHeight: theme.spacing(5),
      marginRight: theme.spacing(2)
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
}); // Get the next year/month string after a given year/month string
// Example: getNextMonth('2012-12') => '2013-01'

var getNextMonth = function getNextMonth(month) {
  return _moment.default.utc("".concat(month, "-15T00:00:00Z")).add(1, 'month').format('YYYY-MM');
};

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
      dateRange = _state$selection.dateRange,
      continuousDateRange = _state$selection.continuousDateRange,
      variables = _state$selection.variables,
      sites = _state$selection.sites,
      selectedTimeStep = _state$selection.timeStep,
      autoTimeStep = _state$selection.autoTimeStep,
      rollPeriod = _state$selection.rollPeriod,
      logscale = _state$selection.logscale,
      yAxes = _state$selection.yAxes,
      qualityFlags = _state$selection.qualityFlags;
  var timeStep = selectedTimeStep === 'auto' ? autoTimeStep : selectedTimeStep;
  var data = [];
  var labels = ['x'];
  var qualityData = [];
  var qualityLabels = ['start', 'end'];
  var monthOffsets = {};
  var timestampMap = {};
  var series = [];
  var graphOptions = BASE_GRAPH_OPTIONS; // Initialize data set with timestep-based times and monthOffsets for registering actual data

  var buildTimeData = function buildTimeData() {
    var seconds = _TimeSeriesViewerContext.TIME_STEPS[timeStep].seconds;
    var startMonth = dateRange[0];

    var ticker = _moment.default.utc("".concat(startMonth, "-01T00:00:00Z"));

    var endMonth = getNextMonth(dateRange[1]);
    var currentMonth = ticker.format('YYYY-MM');
    var previousMonth = null;
    var offset = null;
    var endStep = null;

    while (currentMonth < endMonth) {
      data.push([ticker.toDate()]);
      endStep = _moment.default.utc(ticker).add(seconds, 'seconds');
      qualityData.push([ticker.toDate(), endStep.toDate()]);
      offset = data.length - 1;
      timestampMap[ticker.valueOf()] = offset;

      if (currentMonth !== previousMonth) {
        monthOffsets[currentMonth] = offset;
        previousMonth = currentMonth;
      }

      ticker.add(seconds, 'seconds');
      currentMonth = ticker.format('YYYY-MM');
    }
  }; // Build the rest of the data structure and labels using selection values


  var buildSeriesData = function buildSeriesData() {
    // Loop through each site...
    sites.forEach(function (site) {
      var siteCode = site.siteCode,
          positions = site.positions; // Loop through each site position...

      positions.forEach(function (position) {
        // Generate quality flag label and add to the list of quality labels
        var qualityLabel = "".concat(siteCode, " - ").concat(position);

        if (!qualityLabels.includes(qualityLabel)) {
          qualityLabels.push(qualityLabel);
        } // For each site position loop through every month in the continuous date range (no gaps)


        continuousDateRange.forEach(function (month) {
          // Use monthOffsets to determine where in the entire data set this month belongs
          if (!Object.keys(monthOffsets).includes(month)) {
            return;
          }

          var monthIdx = monthOffsets[month]; // For each site/position/month loop through all selected variables...

          variables.forEach(function (variable) {
            // Generate series label and add to the list of labels if this is the first we see it
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

            if (!columnIdx) {
              return;
            } // 0 is x, so this should always be 1 or greater


            var downloadPkg = state.variables[variable].downloadPkg;
            var positionData = state.product.sites[siteCode].positions[position].data; // If this site/position/month/variable has no series data then fill with nulls

            if (!positionData[month] || !positionData[month][downloadPkg] || !positionData[month][downloadPkg][timeStep]) {
              var nextMonth = getNextMonth(month);
              var monthStepCount = Object.keys(monthOffsets).includes(nextMonth) ? monthOffsets[nextMonth] - monthIdx : data.length - monthIdx;

              for (var d = monthIdx; d < monthStepCount; d += 1) {
                data[d][columnIdx] = null;
              }

              return;
            } // This site/position/month/variable series exists, so add it into the data set


            positionData[month][downloadPkg][timeStep].series[variable].forEach(function (d, datumIdx) {
              data[datumIdx + monthIdx][columnIdx] = d;
            });
          }); // Also for each site/position/month loop through all selected quality flags...

          qualityFlags.forEach(function (qf, qfIdx) {
            var columnIdx = qualityLabels.indexOf(qualityLabel);

            if (columnIdx < 2) {
              return;
            } // 0 is start and 1 is end


            var downloadPkg = state.variables[qf].downloadPkg;
            var positionData = state.product.sites[siteCode].positions[position].data; // If this site/position/month/variable has no series data then fill with nulls

            if (!positionData[month] || !positionData[month][downloadPkg] || !positionData[month][downloadPkg][timeStep]) {
              var nextMonth = getNextMonth(month);
              var monthStepCount = Object.keys(monthOffsets).includes(nextMonth) ? monthOffsets[nextMonth] - monthIdx : qualityData.length - monthIdx;

              for (var d = monthIdx; d < monthStepCount; d += 1) {
                qualityData[d][columnIdx] = null;
              }

              return;
            } // This site/position/month/qf series exists, so add it into the quality data set


            positionData[month][downloadPkg][timeStep].series[qf].forEach(function (d, datumIdx) {
              if (!qfIdx) {
                qualityData[datumIdx + monthIdx][columnIdx] = [d];
              } else {
                qualityData[datumIdx + monthIdx][columnIdx].push(d);
              }
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
    // Series
    var seriesLegend = graphData.series.map(function (s, idx) {
      var units = series[idx].units;
      var yUnits = units;

      if (typeof s.y === 'number' && !Number.isNaN(s.y)) {
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
    }); // Quality Flags

    var qualityFlagsLegend = null;

    if (qualityFlags.length) {
      var qfOffset = timestampMap[graphData.x];
      var qfData = qualityData[qfOffset] ? qualityData[qfOffset].slice(2) : null;
      qualityFlagsLegend = _react.default.createElement("div", {
        className: classes.legendSeries
      }, JSON.stringify(qfData));
    } // Date


    var dateLegend = null;

    if (graphData.x) {
      dateLegend = _react.default.createElement("div", {
        className: classes.legendSeriesX
      }, _moment.default.utc(graphData.x).format('YYYY-MM-DD HH:mm:ss'));
    } // Render


    return _server.default.renderToString(_react.default.createElement(_react.default.Fragment, null, seriesLegend, qualityFlagsLegend, dateLegend));
  };

  var getQualityFlagsRenderFunction = function getQualityFlagsRenderFunction() {
    if (!qualityFlags.length) {
      return function () {};
    }

    console.log('RENDER QUALITY FLAGS', qualityData);
    var qualitySeriesCount = qualityLabels.length - 2;
    return function (canvas, area, g) {
      qualityData.forEach(function (row) {
        var startX = g.toDomXCoord(row[0]);
        var endX = g.toDomXCoord(row[1]);
        var y = area.y,
            h = area.h;
        h /= qualitySeriesCount;

        for (var c = 2; c < row.length; c += 1) {
          if (row[c] && row[c].some(function (v) {
            return v !== 0;
          })) {
            canvas.fillStyle = QUALITY_COLORS[(c - 2) % 12]; // eslint-disable-line no-param-reassign, max-len

            canvas.fillRect(startX, y, endX - startX, h);
          }

          y += h;
        }
      });
    };
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
      legendFormatter: legendFormatter,
      underlayCallback: getQualityFlagsRenderFunction()
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
    } // Refresh graph dimensions


    var LEGEND_SERIES_HEIGHT = 56;
    var LEGEND_DATE_HEIGHT = 40;
    var MIN_GRAPH_HEIGHT = 320;
    var MAX_GRAPH_HEIGHT = 560;
    var graphHeight = Math.min(Math.max(Object.keys(graphOptions.series).length * LEGEND_SERIES_HEIGHT + LEGEND_DATE_HEIGHT, MIN_GRAPH_HEIGHT), MAX_GRAPH_HEIGHT);
    dygraphRef.current.graphDiv.style.width = null;
    dygraphRef.current.graphDiv.style.height = "".concat(graphHeight, "px");
    dygraphRef.current.resizeHandler_();
  }, [selectionDigest, state.status, data, graphOptions, dygraphRef, axisCountChangedRef]);
  /**
     RENDER
  */

  return _react.default.createElement("div", {
    className: classes.graphOuterContainer
  }, _react.default.createElement(_Typography.default, {
    variant: "h6",
    className: classes.title
  }, state.product.productName ? "".concat(state.product.productName, " (").concat(state.product.productCode, ")") : state.product.productCode), _react.default.createElement("div", {
    className: classes.graphInnerContainer
  }, _react.default.createElement("div", {
    ref: dygraphDomRef,
    className: classes.graphDiv,
    style: {
      width: '50% !important'
    }
  }), _react.default.createElement("div", {
    ref: legendRef,
    className: classes.legendDiv
  })), _react.default.createElement("div", {
    className: classes.citationContainer
  }, _react.default.createElement("img", {
    title: "NEON",
    alt: "NEON Logo",
    className: classes.neonLogo,
    src: _NSFNEONLogo.default
  }), _react.default.createElement(_Typography.default, {
    variant: "caption",
    className: classes.citation
  }, "National Ecological Observatory Network. ", new Date().getFullYear(), ". Data Product: ", state.product.productCode, ", ", state.product.productName, ". Battelle, Boulder, CO, USA NEON.")));
}