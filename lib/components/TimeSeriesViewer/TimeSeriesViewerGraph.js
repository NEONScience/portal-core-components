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

require("./dygraphs-overrides.css");

var _moment = _interopRequireDefault(require("moment"));

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _domToImage = _interopRequireDefault(require("dom-to-image"));

var _fileSaver = require("file-saver");

var _styles = require("@material-ui/core/styles");

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _Card = _interopRequireDefault(require("@material-ui/core/Card"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Image = _interopRequireDefault(require("@material-ui/icons/Image"));

var _Visibility = _interopRequireDefault(require("@material-ui/icons/Visibility"));

var _VisibilityOff = _interopRequireDefault(require("@material-ui/icons/VisibilityOff"));

var _generateTimeSeriesGraphData = _interopRequireDefault(require("../../workers/generateTimeSeriesGraphData"));

var _TimeSeriesViewerContext = _interopRequireWildcard(require("./TimeSeriesViewerContext"));

var _Theme = _interopRequireWildcard(require("../Theme/Theme"));

var _NSFNEONLogo = _interopRequireDefault(require("../../images/NSF-NEON-logo.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Load Dygraph plugins. These are not built as modules and require a global Dygraph instance. =(
if (!window.Dygraph) {
  window.Dygraph = _dygraphs.default;
}

require('dygraphs/src/extras/shapes.js');

require('dygraphs/src/extras/crosshair.js');

var SERIES_COLORS = ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'];
var QUALITY_COLORS = ['#8dd3c7', '#f9f986', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'];
var BASE_GRAPH_OPTIONS = {
  includeZero: true,
  labelsUTC: true,
  labelsKMB: false,
  showRangeSelector: true,
  interactionModel: _dygraphs.default.defaultInteractionModel,
  connectSeparatedPoints: false,
  rangeSelectorPlotFillColor: _Theme.default.palette.secondary.light,
  animatedZooms: false,
  colors: SERIES_COLORS,
  highlightCircleSize: 3,
  highlightSeriesBackgroundAlpha: 1,
  highlightSeriesOpts: {
    strokeWidth: 1.5,
    drawHighlightPointCallback: function drawHighlightPointCallback(g, name, ctx, cx, cy, color) {
      ctx.lineWidth = 2;
      return _dygraphs.default.Circles.SQUARE(g, name, ctx, cx, cy, color, 6);
    }
  },
  plugins: [new _dygraphs.default.Plugins.Crosshair({
    direction: 'vertical'
  })]
};
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    graphOuterContainer: {
      backgroundColor: '#ffffff',
      padding: theme.spacing(2)
    },
    graphInnerContainer: _defineProperty({
      display: 'flex',
      alignItems: 'flex-start'
    }, theme.breakpoints.down('sm'), {
      flexWrap: 'wrap'
    }),
    graphDiv: _defineProperty({
      minHeight: '320px',
      flexGrow: 1,
      width: '50%'
    }, theme.breakpoints.down('sm'), {
      width: '100%'
    }),
    buttonsOuterContainer: _defineProperty({
      margin: theme.spacing(0, -0.5, 0, -0.5),
      borderTop: "1.5px solid ".concat(_Theme.COLORS.GREY[200]),
      backgroundColor: theme.palette.grey[50],
      padding: theme.spacing(2)
    }, theme.breakpoints.up('md'), {
      padding: theme.spacing(1.5)
    }),
    buttonsInnerContainer: {
      display: 'flex',
      marginTop: theme.spacing(-1.5),
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap'
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
    legendDiv: _defineProperty({
      flexShrink: 0,
      marginLeft: theme.spacing(1)
    }, theme.breakpoints.down('sm'), {
      width: '100%',
      marginTop: theme.spacing(2)
    }),
    legendSeries: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexWrap: 'nowrap',
      padding: theme.spacing(1),
      marginBottom: theme.spacing(1),
      backgroundColor: theme.palette.grey[50],
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#fff',
        borderColor: theme.palette.primary.main
      }
    },
    legendSeriesActive: {
      backgroundColor: '#fff',
      borderColor: theme.palette.primary.main
    },
    legendSeriesX: {
      whiteSpace: 'nowrap',
      textAlign: 'center',
      fontWeight: 600,
      padding: theme.spacing(1),
      backgroundColor: '#fff',
      borderColor: theme.palette.primary.main
    },
    legendSeriesColor: {
      width: theme.spacing(3),
      height: '4px',
      pointerEvents: 'none'
    },
    legendSeriesLabel: {
      whiteSpace: 'nowrap',
      lineHeight: '1rem',
      fontSize: '0.7rem',
      marginLeft: theme.spacing(1),
      pointerEvents: 'none'
    },
    legendQualityColor: {
      width: '4px',
      height: theme.spacing(3),
      margin: theme.spacing(0, 1.25, 0, 1.25),
      pointerEvents: 'none'
    }
  };
});
var INITIAL_GRAPH_STATE = {
  hiddenSeries: new Set(),
  hiddenQualityFlags: new Set(),
  pngDimensions: [0, 0]
};

var graphReducer = function graphReducer(state, action) {
  var newState = _extends({}, state);

  var key = null;

  switch (action.type) {
    case 'reinitialize':
      return (0, _cloneDeep.default)(INITIAL_GRAPH_STATE);

    case 'toggleLegendVisibility':
      if (!['series', 'qualityFlag'].includes(action.kind)) {
        return state;
      }

      key = action.kind === 'series' ? 'hiddenSeries' : 'hiddenQualityFlags';

      if (newState[key].has(action.label)) {
        newState[key].delete(action.label);
      } else {
        newState[key].add(action.label);
      }

      return newState;

    case 'toggleSeriesVisibility':
      if (newState.hiddenSeries.size) {
        newState.hiddenSeries = new Set();
      } else {
        newState.hiddenSeries = new Set(action.series);
      }

      return newState;

    case 'toggleQualityFlagsVisibility':
      if (newState.hiddenQualityFlags.size) {
        newState.hiddenQualityFlags = new Set();
      } else {
        newState.hiddenQualityFlags = new Set(action.qualityFlags);
      }

      return newState;

    case 'purgeRemovedHiddenLabels':
      Array.from(state.hiddenSeries).forEach(function (label) {
        if (!action.seriesLabels.includes(label)) {
          newState.hiddenSeries.delete(label);
        }
      });
      Array.from(state.hiddenQualityFlags).forEach(function (label) {
        if (!action.qualityLabels.includes(label)) {
          newState.hiddenQualityFlags.delete(label);
        }
      });
      return newState;

    case 'setPngDimensions':
      if (!(Array.isArray(action.dimensions) && action.dimensions.length === 2 && action.dimensions.every(function (v) {
        return typeof v === 'number' && v >= 0;
      }))) {
        return state;
      }

      newState.pngDimensions = action.dimensions;
      return newState;

    default:
      return state;
  }
};

function TimeSeriesViewerGraph() {
  var classes = useStyles(_Theme.default);

  var _TimeSeriesViewerCont = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont2 = _slicedToArray(_TimeSeriesViewerCont, 2),
      state = _TimeSeriesViewerCont2[0],
      dispatch = _TimeSeriesViewerCont2[1];

  var _useReducer = (0, _react.useReducer)(graphReducer, (0, _cloneDeep.default)(INITIAL_GRAPH_STATE)),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      graphState = _useReducer2[0],
      graphDispatch = _useReducer2[1];

  var downloadRef = (0, _react.useRef)(null);
  var dygraphRef = (0, _react.useRef)(null);
  var dygraphDomRef = (0, _react.useRef)(null);
  var graphInnerContainerRef = (0, _react.useRef)(null);
  var legendRef = (0, _react.useRef)(null);
  var axisCountRef = (0, _react.useRef)(1);
  var axisCountChangedRef = (0, _react.useRef)(false);
  var belowSm = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('sm'));
  var _state$selection = state.selection,
      selectionDigest = _state$selection.selectionDigest,
      logscale = _state$selection.logscale,
      qualityFlags = _state$selection.qualityFlags,
      rollPeriod = _state$selection.rollPeriod,
      yAxes = _state$selection.yAxes; // let data = cloneDeep(NULL_DATA);

  var graphOptions = (0, _cloneDeep.default)(BASE_GRAPH_OPTIONS); // Build the axes option

  var buildAxesOption = function buildAxesOption() {
    var axes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var axesOption = {
      x: {
        valueFormatter: _dygraphs.default.dateString_,
        ticker: _dygraphs.default.dateTicker,
        axisLabelFormatter: _dygraphs.default.dateAxisLabelFormatter,
        axisLineWidth: 1.5
      }
    };
    axes.forEach(function (axis) {
      var stateAxis = axis.axis === 'y' ? 'y1' : 'y2';
      var _state$selection$yAxe = state.selection.yAxes[stateAxis],
          axisRange = _state$selection$yAxe.axisRange,
          precision = _state$selection$yAxe.precision;
      var axisLabelWidth = precision > 3 ? 75 : 50;
      var nonZeroFloor = parseFloat(Math.pow(10, -1 * (precision + 1)).toFixed(precision + 1), 10);
      var valueRange = state.selection.logscale ? [axisRange[0] <= 0 ? nonZeroFloor : axisRange[0], axisRange[1]] : _toConsumableArray(axisRange);
      axesOption[axis.axis] = {
        independentTicks: true,
        axisLineWidth: 1.5,
        axisLabelWidth: axisLabelWidth,
        valueRange: valueRange
      };
    });
    return axesOption;
  }; // Build the series option


  var buildSeriesOption = function buildSeriesOption() {
    var axes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var series = state.graphData.series;
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

  var calcLegendHeight = function calcLegendHeight() {
    // In order to support hover over coordinate value display for wrapped / small
    // viewports, we need to give the legend a set height with enough padding to render the
    // hover over value that causes the height of the element to expand. If we don't
    // set the height explicitly here, it will cause a re-render of the chart container
    // and cause flickering as it will constantly re-render and never show
    // the hover value. Determine height based on number of legend items.
    if (belowSm) {
      var _state$graphData = state.graphData,
          _series = _state$graphData.series,
          _qualityLabels = _state$graphData.qualityLabels;
      var appliedQualityLabels = [];

      if (qualityFlags.length) {
        appliedQualityLabels = _qualityLabels.slice(2);
      } // Account for single legend item containing multiple labels


      var hasQualityLabels = appliedQualityLabels.length > 0;
      var qualityLabelsHeightPadding = hasQualityLabels && qualityFlags.length > 1 ? (qualityFlags.length - 1) * 16 : 0;
      var numLegendItems = _series ? _series.length : 0;
      var qualityLabelHeight = (hasQualityLabels ? 50 : 0) + qualityLabelsHeightPadding;

      if (numLegendItems > 0) {
        var appliedHeight = numLegendItems * 50 + numLegendItems * 10 + qualityLabelHeight + 15; // Sanity check

        if (appliedHeight <= 0) {
          return 'auto';
        }

        return "".concat(appliedHeight, "px");
      }
    }

    return 'auto';
  };

  var legendFormatter = function legendFormatter(graphData) {
    var _state$graphData2 = state.graphData,
        series = _state$graphData2.series,
        qualityData = _state$graphData2.qualityData,
        timestampMap = _state$graphData2.timestampMap,
        qualityLabels = _state$graphData2.qualityLabels; // Series

    var seriesLegend = graphData.series.map(function (s, idx) {
      var isHidden = graphState.hiddenSeries.has(s.label);
      var units = series[idx].units;
      var yUnits = units;

      if (typeof s.y === 'number' && !Number.isNaN(s.y)) {
        var yStr = s.y.toString();

        if (yStr.indexOf('.') !== -1 && yStr.length - yStr.indexOf('.') > 3) {
          yStr = s.y.toFixed(2).toString();
        }

        var yUnitsStr = "".concat(yStr, " ").concat(units);
        yUnits = s.isHighlighted ? /*#__PURE__*/_react.default.createElement("b", null, yUnitsStr) : yUnitsStr;
      }

      var className = s.isHighlighted ? "".concat(classes.legendSeries, " ").concat(classes.legendSeriesActive) : classes.legendSeries;
      var seriesStyle = {};

      if (isHidden) {
        seriesStyle.opacity = 0.5;
      }

      var colorStyle = {
        backgroundColor: s.color || _Theme.default.palette.grey[200]
      };

      if (s.isHighlighted) {
        colorStyle.height = '6px';
      }

      return /*#__PURE__*/_react.default.createElement(_Card.default, {
        variant: "outlined",
        className: className,
        key: s.label,
        style: seriesStyle,
        "data-label": s.label,
        "data-kind": "series",
        title: "Click to ".concat(isHidden ? 'show' : 'hide', " this series")
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: classes.legendSeriesColor,
        style: colorStyle
      }), /*#__PURE__*/_react.default.createElement("div", {
        className: classes.legendSeriesLabel
      }, s.label, /*#__PURE__*/_react.default.createElement("br", null), yUnits, !belowSm || !s.isHighlighted ? null : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("br", null), _moment.default.utc(graphData.x).format('YYYY-MM-DD HH:mm:ss'))));
    }); // Quality Flags

    var qualityFlagsLegend = null;

    if (qualityFlags.length) {
      var qfOffset = timestampMap[graphData.x];
      var qfData = qualityData[qfOffset] ? qualityData[qfOffset].slice(2) : null;
      qualityFlagsLegend = qualityLabels.slice(2).map(function (qualityLabel, qlIdx) {
        var isHidden = graphState.hiddenQualityFlags.has(qualityLabel);
        var isHighlighted = graphData.series.some(function (s) {
          return s.isHighlighted && s.label.includes(qualityLabel);
        });
        var qualityStyle = isHighlighted ? {
          backgroundColor: _Theme.default.palette.grey[100]
        } : {};

        if (isHidden) {
          qualityStyle.opacity = 0.5;
        }

        var colorStyle = {
          backgroundColor: QUALITY_COLORS[qlIdx % 12]
        };
        return /*#__PURE__*/_react.default.createElement("div", {
          key: qualityLabel,
          className: classes.legendSeries,
          style: qualityStyle,
          "data-label": qualityLabel,
          "data-kind": "qualityFlag",
          title: "Click to ".concat(isHidden ? 'show' : 'hide', " this quality flag series")
        }, /*#__PURE__*/_react.default.createElement("div", {
          className: classes.legendQualityColor,
          style: colorStyle
        }), /*#__PURE__*/_react.default.createElement("div", {
          className: classes.legendSeriesLabel
        }, "".concat(qualityLabel, " - Quality Flags"), /*#__PURE__*/_react.default.createElement("br", null), qualityFlags.map(function (qf, qfIdx) {
          return qfData === null || !qfData[qlIdx] ? /*#__PURE__*/_react.default.createElement("div", {
            key: qf
          }, qf) : /*#__PURE__*/_react.default.createElement("div", {
            key: qf,
            style: isHighlighted ? {
              fontWeight: 600
            } : {}
          }, "".concat(qfData[qlIdx][qfIdx], " - ").concat(qf));
        })));
      });
    } // Date


    var dateLegend = null;

    if (graphData.x && !belowSm) {
      dateLegend = /*#__PURE__*/_react.default.createElement(_Card.default, {
        variant: "outlined",
        className: classes.legendSeriesX
      }, _moment.default.utc(graphData.x).format('YYYY-MM-DD HH:mm:ss'));
    } // Render


    return _server.default.renderToString( /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, seriesLegend, qualityFlagsLegend, dateLegend));
  }; // Function to draw quality flags on the graph


  var renderQualityFlags = function renderQualityFlags(canvas, area, g) {
    var _state$graphData3 = state.graphData,
        qualityData = _state$graphData3.qualityData,
        qualityLabels = _state$graphData3.qualityLabels;
    var qualitySeriesCount = qualityLabels.length - 2 - graphState.hiddenQualityFlags.size;

    if (qualitySeriesCount < 1) {
      return;
    }

    qualityData.forEach(function (row) {
      var startX = g.toDomXCoord(row[0]);
      var endX = g.toDomXCoord(row[1]);
      var y = area.y,
          h = area.h;
      h /= qualitySeriesCount;

      for (var c = 2; c < row.length; c += 1) {
        if (!graphState.hiddenQualityFlags.has(qualityLabels[c])) {
          if (row[c] && row[c].some(function (v) {
            return v !== 0;
          })) {
            canvas.fillStyle = QUALITY_COLORS[(c - 2) % 12]; // eslint-disable-line no-param-reassign, max-len

            canvas.fillRect(startX, y, endX - startX, h);
          }

          y += h;
        }
      }
    });
  };

  var getUnderlayCallback = function getUnderlayCallback() {
    return function (canvas, area, g) {
      renderQualityFlags(canvas, area, g);
    };
  }; // Effect - Generate all series data for the graph only when necessary, store in TSV global state


  (0, _react.useEffect)(function () {
    if (state.status !== _TimeSeriesViewerContext.TIME_SERIES_VIEWER_STATUS.READY_FOR_SERIES) {
      return;
    }

    (0, _generateTimeSeriesGraphData.default)(state).then(function (graphData) {
      // With new series and qualityLabels purge any hidden labels that are no longer present
      var newSeries = graphData.series,
          newQualityLabels = graphData.qualityLabels;
      var seriesLabels = newSeries.map(function (s) {
        return s.label;
      });

      if (Array.from(graphState.hiddenQualityFlags).some(function (label) {
        return !newQualityLabels.includes(label);
      }) || Array.from(graphState.hiddenSeries).some(function (label) {
        return !seriesLabels.includes(label);
      })) {
        graphDispatch({
          type: 'purgeRemovedHiddenLabels',
          qualityLabels: newQualityLabels.slice(2),
          seriesLabels: seriesLabels
        });
      } // Store newly generate graphData in primary context state


      dispatch({
        type: 'regenerateGraphData',
        graphData: graphData
      });
    });
  });

  if (state.status === _TimeSeriesViewerContext.TIME_SERIES_VIEWER_STATUS.READY) {
    // Determine the set of axes and their units
    var previousAxisCount = axisCountRef.current;
    var axes = Object.keys(yAxes).map(function (axis) {
      return {
        axis: axis === 'y1' ? 'y' : 'y2',
        units: yAxes[axis].units // logscale: yAxes[axis].logscale,

      };
    }).slice(0, yAxes.y2.units === null ? 1 : 2);
    axisCountChangedRef.current = axes.length !== previousAxisCount;
    axisCountRef.current = axes.length; // Build graphOptions

    var _state$graphData4 = state.graphData,
        _series2 = _state$graphData4.series,
        labels = _state$graphData4.labels;
    graphOptions = _extends({}, (0, _cloneDeep.default)(BASE_GRAPH_OPTIONS), {
      labels: labels,
      axes: buildAxesOption(axes),
      series: buildSeriesOption(axes),
      rollPeriod: rollPeriod,
      logscale: logscale,
      labelsDiv: legendRef.current,
      legend: 'always',
      legendFormatter: legendFormatter,
      underlayCallback: getUnderlayCallback(),
      visibility: _series2.map(function (s) {
        return !graphState.hiddenSeries.has(s.label);
      })
    }); // Apply axis labels to graphOptions

    axes.forEach(function (axis) {
      graphOptions["".concat(axis.axis, "label")] = axis.units;
    });
  } // Callback to refresh graph dimensions for current DOM


  var handleResize = (0, _react.useCallback)(function () {
    if (!dygraphRef.current || !legendRef.current || !graphInnerContainerRef.current) {
      return;
    } // Resize the graph relative to the legend width now that the legend is properly rendered


    var MIN_GRAPH_HEIGHT = 320;
    var MAX_GRAPH_HEIGHT = 560;
    var legendHeight = legendRef.current ? legendRef.current.clientHeight + 40 : 0;
    var graphHeight = Math.min(Math.max(legendHeight, MIN_GRAPH_HEIGHT), MAX_GRAPH_HEIGHT);
    var legendWidth = legendRef.current.clientWidth + 8;
    var graphInnerContainerWidth = graphInnerContainerRef.current.clientWidth;
    var graphWidth = graphInnerContainerWidth - legendWidth;
    dygraphRef.current.graphDiv.style.width = "".concat(graphWidth, "px");
    dygraphRef.current.graphDiv.style.height = "".concat(graphHeight, "px");
    dygraphRef.current.resizeHandler_();
    dygraphRef.current.canvas_.style.cursor = 'crosshair'; // Store the updated download PNG dimensions in state so we can display them for the user

    if (downloadRef.current !== null) {
      var dimensions = [Math.ceil(downloadRef.current.clientWidth || 0), Math.ceil(downloadRef.current.clientHeight || 0)];

      if (!(dimensions[0] === graphState.pngDimensions[0] && dimensions[1] === graphState.pngDimensions[1])) {
        graphDispatch({
          type: 'setPngDimensions',
          dimensions: dimensions
        });
      }
    }
  }, [dygraphRef, legendRef, graphInnerContainerRef, downloadRef, graphState.pngDimensions, graphDispatch]); // Layout effect to keep the graph dimensions in-line with resize events

  (0, _react.useLayoutEffect)(function () {
    if (graphInnerContainerRef.current === null) {
      return function () {};
    } // Ensure resize observer is in place


    if (typeof ResizeObserver !== 'function') {
      window.addEventListener('resize', handleResize);
      return function () {
        window.removeEventListener('resize', handleResize);
      };
    }

    var resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(graphInnerContainerRef.current);
    return function () {
      if (!resizeObserver) {
        return;
      }

      resizeObserver.disconnect();
      resizeObserver = null;
    };
  }, [graphInnerContainerRef, handleResize]); // Effect to apply latest options/data to the graph and force a resize

  (0, _react.useEffect)(function () {
    if (state.status !== _TimeSeriesViewerContext.TIME_SERIES_VIEWER_STATUS.READY) {
      return;
    }

    if (dygraphRef.current === null) {
      dygraphRef.current = new _dygraphs.default(dygraphDomRef.current, state.graphData.data, graphOptions);
    } else {
      dygraphRef.current.updateOptions(_extends({
        file: state.graphData.data
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

    handleResize();
  }, [selectionDigest, state.status, state.graphData.data, graphOptions, dygraphRef, handleResize, axisCountChangedRef]); // Effect to register a click handler to the legend for sereis visibility toggling

  (0, _react.useEffect)(function () {
    if (!legendRef.current) {
      return function () {};
    }

    var legendClickHandler = function legendClickHandler(_ref) {
      var target = _ref.target;
      var container = legendRef.current;

      if (!container.contains(target)) {
        return;
      }

      var label = target.getAttribute('data-label');
      var kind = target.getAttribute('data-kind');

      if (!label || !kind) {
        return;
      }

      graphDispatch({
        type: 'toggleLegendVisibility',
        label: label,
        kind: kind
      });
    };

    document.addEventListener('click', legendClickHandler);
    return function () {
      document.removeEventListener('click', legendClickHandler);
    };
  }, [legendRef, graphDispatch]); // Download Image Button

  var exportGraphImage = function exportGraphImage() {
    if (downloadRef.current === null) {
      return;
    }

    _domToImage.default.toBlob(downloadRef.current).then(function (blob) {
      var siteCodes = state.selection.sites.map(function (site) {
        return site.siteCode;
      }).join(' ');
      var fileName = "NEON Time Series - ".concat(state.product.productCode, " - ").concat(state.product.productName, " - ").concat(siteCodes, ".png");
      (0, _fileSaver.saveAs)(blob, fileName);
    }).catch(function (error) {
      console.error('Unable to export graph image', error); // eslint-disable-line no-console
    });
  };

  var getPngDimensions = function getPngDimensions() {
    return "".concat(graphState.pngDimensions[0] || '?', "px x ").concat(graphState.pngDimensions[1] || '?', "px");
  };

  var downloadImageButton = /*#__PURE__*/_react.default.createElement(_Button.default, {
    size: "small",
    color: "primary",
    variant: "outlined",
    onClick: exportGraphImage,
    disabled: downloadRef.current === null,
    title: "Download current graph as a PNG (".concat(getPngDimensions(), ")"),
    style: {
      whiteSpace: 'nowrap',
      marginRight: _Theme.default.spacing(1.5)
    },
    startIcon: /*#__PURE__*/_react.default.createElement(_Image.default, null)
  }, "Download Image (png)"); // Toggle Series Visibility Button


  var series = state.graphData.series;

  var toggleSeriesVisibility = function toggleSeriesVisibility() {
    var allSeries = series.map(function (s) {
      return s.label;
    });
    graphDispatch({
      type: 'toggleSeriesVisibility',
      series: allSeries
    });
  };

  var toggleSeriesVisibilityButton = /*#__PURE__*/_react.default.createElement(_Button.default, {
    size: "small",
    color: "primary",
    variant: "outlined",
    title: "Toggle Visibility for All Series",
    onClick: toggleSeriesVisibility,
    disabled: series.length === 0,
    style: {
      whiteSpace: 'nowrap',
      marginLeft: _Theme.default.spacing(1.5)
    },
    startIcon: graphState.hiddenSeries.size ? /*#__PURE__*/_react.default.createElement(_Visibility.default, null) : /*#__PURE__*/_react.default.createElement(_VisibilityOff.default, null)
  }, graphState.hiddenSeries.size ? "".concat(belowSm ? '' : 'Show All', " Series") : "".concat(belowSm ? '' : 'Hide All', " Series")); // Toggle Quality Flag Visibility Button


  var qualityLabels = state.graphData.qualityLabels;

  var toggleQualityFlagsVisibility = function toggleQualityFlagsVisibility() {
    graphDispatch({
      type: 'toggleQualityFlagsVisibility',
      qualityFlags: qualityLabels.slice(2)
    });
  };

  var toggleQualityFlagsVisibilityButton = /*#__PURE__*/_react.default.createElement(_Button.default, {
    size: "small",
    color: "primary",
    variant: "outlined",
    title: "Toggle Visibility for All Quality Flags",
    onClick: toggleQualityFlagsVisibility,
    disabled: qualityFlags.length === 0,
    style: {
      whiteSpace: 'nowrap'
    },
    startIcon: graphState.hiddenQualityFlags.size ? /*#__PURE__*/_react.default.createElement(_Visibility.default, null) : /*#__PURE__*/_react.default.createElement(_VisibilityOff.default, null)
  }, graphState.hiddenQualityFlags.size ? "".concat(belowSm ? '' : 'Show All', " Quality Flags") : "".concat(belowSm ? '' : 'Hide All', " Quality Flags"));
  /**
     RENDER
  */


  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    ref: downloadRef,
    className: classes.graphOuterContainer
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6",
    className: classes.title
  }, state.product.productName ? "".concat(state.product.productName, " (").concat(state.product.productCode, ")") : state.product.productCode), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.graphInnerContainer,
    ref: graphInnerContainerRef
  }, /*#__PURE__*/_react.default.createElement("div", {
    ref: dygraphDomRef,
    className: classes.graphDiv
  }), /*#__PURE__*/_react.default.createElement("div", {
    ref: legendRef,
    className: classes.legendDiv,
    style: {
      height: calcLegendHeight()
    }
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.citationContainer
  }, /*#__PURE__*/_react.default.createElement("img", {
    title: "NEON",
    alt: "NEON Logo",
    className: classes.neonLogo,
    src: _NSFNEONLogo.default
  }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "caption",
    className: classes.citation
  }, "National Ecological Observatory Network. ", new Date().getFullYear(), ". Data Product: ", state.product.productCode, ", ", state.product.productName, ". Battelle, Boulder, CO, USA NEON."))), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.buttonsOuterContainer
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.buttonsInnerContainer
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginTop: _Theme.default.spacing(1.5)
    }
  }, downloadImageButton), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginTop: _Theme.default.spacing(1.5),
      textAlign: 'right'
    }
  }, toggleQualityFlagsVisibilityButton, toggleSeriesVisibilityButton))));
}