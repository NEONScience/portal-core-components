"use strict";

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
var _DataProductCitation = _interopRequireDefault(require("../Citation/DataProductCitation"));
var _TimeSeriesViewerContext = _interopRequireDefault(require("./TimeSeriesViewerContext"));
var _Theme = _interopRequireWildcard(require("../Theme/Theme"));
var _constants = require("./constants");
var _typeUtil = require("../../util/typeUtil");
var _NSFNEONLogo = _interopRequireDefault(require("../../images/NSF-NEON-logo.png"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } /* eslint-disable no-underscore-dangle */
// Load Dygraph plugins. These are not built as modules and require a global Dygraph instance. =(
if (!window.Dygraph) {
  window.Dygraph = _dygraphs.default;
}
// eslint-disable-next-line import/extensions
require('dygraphs/src/extras/shapes.js');
// eslint-disable-next-line import/extensions
require('dygraphs/src/extras/crosshair.js');
const SERIES_COLORS = ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'];
const QUALITY_COLORS = ['#8dd3c7', '#f9f986', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'];
const BASE_GRAPH_OPTIONS = {
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
    drawHighlightPointCallback: (g, name, ctx, cx, cy, color) => {
      ctx.lineWidth = 2;
      return _dygraphs.default.Circles.SQUARE(g, name, ctx, cx, cy, color, 6);
    }
  },
  plugins: [new _dygraphs.default.Plugins.Crosshair({
    direction: 'vertical'
  })]
};
const useStyles = (0, _styles.makeStyles)(theme => ({
  graphOuterContainer: {
    backgroundColor: '#ffffff',
    padding: theme.spacing(2)
  },
  graphInnerContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap'
    }
  },
  graphDiv: {
    minHeight: '320px',
    flexGrow: 1,
    width: '50%',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  buttonsOuterContainer: {
    margin: theme.spacing(0, -0.5, 0, -0.5),
    borderTop: "1.5px solid ".concat(_Theme.COLORS.GREY[200]),
    backgroundColor: theme.palette.grey[50],
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(1.5)
    }
  },
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
  legendDiv: {
    flexShrink: 0,
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginTop: theme.spacing(2)
    }
  },
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
}));
const INITIAL_GRAPH_STATE = {
  hiddenSeries: new Set(),
  hiddenQualityFlags: new Set(),
  pngDimensions: [0, 0]
};
const graphReducer = (state, action) => {
  const newState = _extends({}, state);
  let key = null;
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
      Array.from(state.hiddenSeries).forEach(label => {
        if (!action.seriesLabels.includes(label)) {
          newState.hiddenSeries.delete(label);
        }
      });
      Array.from(state.hiddenQualityFlags).forEach(label => {
        if (!action.qualityLabels.includes(label)) {
          newState.hiddenQualityFlags.delete(label);
        }
      });
      return newState;
    case 'setPngDimensions':
      if (!(Array.isArray(action.dimensions) && action.dimensions.length === 2 && action.dimensions.every(v => typeof v === 'number' && v >= 0))) {
        return state;
      }
      newState.pngDimensions = action.dimensions;
      return newState;
    default:
      return state;
  }
};
function TimeSeriesViewerGraph() {
  const classes = useStyles(_Theme.default);
  const [state, dispatch] = _TimeSeriesViewerContext.default.useTimeSeriesViewerState();
  const [graphState, graphDispatch] = (0, _react.useReducer)(graphReducer, (0, _cloneDeep.default)(INITIAL_GRAPH_STATE));
  const downloadRef = (0, _react.useRef)(null);
  const dygraphRef = (0, _react.useRef)(null);
  const dygraphDomRef = (0, _react.useRef)(null);
  const graphInnerContainerRef = (0, _react.useRef)(null);
  const legendRef = (0, _react.useRef)(null);
  const axisCountRef = (0, _react.useRef)(1);
  const axisCountChangedRef = (0, _react.useRef)(false);
  const belowSm = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('sm'));
  const {
    selectionDigest,
    logscale,
    qualityFlags,
    rollPeriod,
    yAxes
  } = state.selection;

  // let data = cloneDeep(NULL_DATA);
  let graphOptions = (0, _cloneDeep.default)(BASE_GRAPH_OPTIONS);

  // Build the axes option
  const buildAxesOption = function () {
    let axes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    const axesOption = {
      x: {
        valueFormatter: _dygraphs.default.dateString_,
        ticker: _dygraphs.default.dateTicker,
        axisLabelFormatter: _dygraphs.default.dateAxisLabelFormatter,
        axisLineWidth: 1.5
      }
    };
    axes.forEach(axis => {
      const stateAxis = axis.axis === 'y' ? 'y1' : 'y2';
      const {
        axisRange,
        precision
      } = state.selection.yAxes[stateAxis];
      const axisLabelWidth = precision > 3 ? 75 : 50;
      const nonZeroFloor = parseFloat((10 ** (-1 * (precision + 1))).toFixed(precision + 1), 10);
      const valueRange = state.selection.logscale ? [axisRange[0] <= 0 ? nonZeroFloor : axisRange[0], axisRange[1]] : [...axisRange];
      axesOption[axis.axis] = {
        independentTicks: true,
        axisLineWidth: 1.5,
        axisLabelWidth,
        valueRange
      };
    });
    return axesOption;
  };

  // Build the series option
  const buildSeriesOption = function () {
    let axes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    const {
      series
    } = state.graphData;
    const seriesOption = {};
    series.forEach(s => {
      const axis = axes.find(a => a.units === s.units);
      if (!axis) {
        return;
      }
      seriesOption[s.label] = {
        axis: axis.axis
      };
    });
    return seriesOption;
  };
  const calcLegendHeight = () => {
    // In order to support hover over coordinate value display for wrapped / small
    // viewports, we need to give the legend a set height with enough padding to render the
    // hover over value that causes the height of the element to expand. If we don't
    // set the height explicitly here, it will cause a re-render of the chart container
    // and cause flickering as it will constantly re-render and never show
    // the hover value. Determine height based on number of legend items.
    if (belowSm) {
      const {
        series,
        qualityLabels
      } = state.graphData;
      let appliedQualityLabels = [];
      if (qualityFlags.length) {
        appliedQualityLabels = qualityLabels.slice(2);
      }
      // Account for single legend item containing multiple labels
      const hasQualityLabels = appliedQualityLabels.length > 0;
      const qualityLabelsHeightPadding = hasQualityLabels && qualityFlags.length > 1 ? (qualityFlags.length - 1) * 16 : 0;
      const numLegendItems = series ? series.length : 0;
      const qualityLabelHeight = (hasQualityLabels ? 50 : 0) + qualityLabelsHeightPadding;
      if (numLegendItems > 0) {
        const appliedHeight = numLegendItems * 50 + numLegendItems * 10 + qualityLabelHeight + 15;
        // Sanity check
        if (appliedHeight <= 0) {
          return 'auto';
        }
        return "".concat(appliedHeight, "px");
      }
    }
    return 'auto';
  };
  const legendFormatter = graphData => {
    const {
      series,
      qualityData,
      timestampMap,
      qualityLabels
    } = state.graphData;
    // Series
    const seriesLegend = graphData.series.map((s, idx) => {
      const isHidden = graphState.hiddenSeries.has(s.label);
      const {
        units
      } = series[idx];
      let yUnits = units;
      if (typeof s.y === 'number' && !Number.isNaN(s.y)) {
        let yStr = s.y.toString();
        if (yStr.indexOf('.') !== -1 && yStr.length - yStr.indexOf('.') > 3) {
          yStr = s.y.toFixed(2).toString();
        }
        const yUnitsStr = "".concat(yStr, " ").concat(units);
        yUnits = s.isHighlighted ? /*#__PURE__*/_react.default.createElement("b", null, yUnitsStr) : yUnitsStr;
      }
      const className = s.isHighlighted ? "".concat(classes.legendSeries, " ").concat(classes.legendSeriesActive) : classes.legendSeries;
      const seriesStyle = {};
      if (isHidden) {
        seriesStyle.opacity = 0.5;
      }
      const colorStyle = {
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
    });
    // Quality Flags
    let qualityFlagsLegend = null;
    if (qualityFlags.length) {
      const qfOffset = timestampMap[graphData.x];
      const qfData = qualityData[qfOffset] ? qualityData[qfOffset].slice(2) : null;
      qualityFlagsLegend = qualityLabels.slice(2).map((qualityLabel, qlIdx) => {
        const isHidden = graphState.hiddenQualityFlags.has(qualityLabel);
        const isHighlighted = graphData.series.some(s => s.isHighlighted && s.label.includes(qualityLabel));
        const qualityStyle = isHighlighted ? {
          backgroundColor: _Theme.default.palette.grey[100]
        } : {};
        if (isHidden) {
          qualityStyle.opacity = 0.5;
        }
        const colorStyle = {
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
        }, "".concat(qualityLabel, " - Quality Flags"), /*#__PURE__*/_react.default.createElement("br", null), qualityFlags.map((qf, qfIdx) => qfData === null || !qfData[qlIdx] ? /*#__PURE__*/_react.default.createElement("div", {
          key: qf
        }, qf) : /*#__PURE__*/_react.default.createElement("div", {
          key: qf,
          style: isHighlighted ? {
            fontWeight: 600
          } : {}
        }, "".concat(qfData[qlIdx][qfIdx], " - ").concat(qf)))));
      });
    }
    // Date
    let dateLegend = null;
    if (graphData.x && !belowSm) {
      dateLegend = /*#__PURE__*/_react.default.createElement(_Card.default, {
        variant: "outlined",
        className: classes.legendSeriesX
      }, _moment.default.utc(graphData.x).format('YYYY-MM-DD HH:mm:ss'));
    }
    // Render
    return _server.default.renderToString( /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, seriesLegend, qualityFlagsLegend, dateLegend));
  };

  // Function to draw quality flags on the graph
  const renderQualityFlags = (canvas, area, g) => {
    const {
      qualityData,
      qualityLabels
    } = state.graphData;
    const qualitySeriesCount = qualityLabels.length - 2 - graphState.hiddenQualityFlags.size;
    if (qualitySeriesCount < 1) {
      return;
    }
    qualityData.forEach(row => {
      const startX = g.toDomXCoord(row[0]);
      const endX = g.toDomXCoord(row[1]);
      let {
        y,
        h
      } = area;
      h /= qualitySeriesCount;
      for (let c = 2; c < row.length; c += 1) {
        if (!graphState.hiddenQualityFlags.has(qualityLabels[c])) {
          if (row[c] && row[c].some(v => v !== 0 && v !== null)) {
            canvas.fillStyle = QUALITY_COLORS[(c - 2) % 12]; // eslint-disable-line no-param-reassign, max-len
            canvas.fillRect(startX, y, endX - startX, h);
          }
          y += h;
        }
      }
    });
  };
  const getUnderlayCallback = () => (canvas, area, g) => {
    renderQualityFlags(canvas, area, g);
  };

  // Effect - Generate all series data for the graph only when necessary, store in TSV global state
  (0, _react.useEffect)(() => {
    if (state.status !== _constants.TIME_SERIES_VIEWER_STATUS.READY_FOR_SERIES) {
      return;
    }
    (0, _generateTimeSeriesGraphData.default)(state).then(graphData => {
      // With new series and qualityLabels purge any hidden labels that are no longer present
      const {
        series: newSeries,
        qualityLabels: newQualityLabels
      } = graphData;
      const seriesLabels = newSeries.map(s => s.label);
      if (Array.from(graphState.hiddenQualityFlags).some(label => !newQualityLabels.includes(label)) || Array.from(graphState.hiddenSeries).some(label => !seriesLabels.includes(label))) {
        graphDispatch({
          type: 'purgeRemovedHiddenLabels',
          qualityLabels: newQualityLabels.slice(2),
          seriesLabels
        });
      }
      // Store newly generate graphData in primary context state
      dispatch({
        type: 'regenerateGraphData',
        graphData
      });
    });
  });
  if (state.status === _constants.TIME_SERIES_VIEWER_STATUS.READY) {
    // Determine the set of axes and their units
    const previousAxisCount = axisCountRef.current;
    const axes = Object.keys(yAxes).map(axis => ({
      axis: axis === 'y1' ? 'y' : 'y2',
      units: yAxes[axis].units
      // logscale: yAxes[axis].logscale,
    })).slice(0, yAxes.y2.units === null ? 1 : 2);
    axisCountChangedRef.current = axes.length !== previousAxisCount;
    axisCountRef.current = axes.length;

    // Build graphOptions
    const {
      series,
      labels
    } = state.graphData;
    graphOptions = _extends({}, (0, _cloneDeep.default)(BASE_GRAPH_OPTIONS), {
      labels,
      axes: buildAxesOption(axes),
      series: buildSeriesOption(axes),
      rollPeriod,
      logscale,
      labelsDiv: legendRef.current,
      legend: 'always',
      legendFormatter,
      underlayCallback: getUnderlayCallback(),
      visibility: series.map(s => !graphState.hiddenSeries.has(s.label))
    });

    // Apply axis labels to graphOptions
    axes.forEach(axis => {
      graphOptions["".concat(axis.axis, "label")] = axis.units;
    });
  }

  // Callback to refresh graph dimensions for current DOM
  const handleResize = (0, _react.useCallback)(() => {
    if (state.status !== _constants.TIME_SERIES_VIEWER_STATUS.READY) {
      return;
    }
    if (!dygraphRef.current || !legendRef.current || !graphInnerContainerRef.current) {
      return;
    }
    // Resize the graph relative to the legend width now that the legend is properly rendered
    const MIN_GRAPH_HEIGHT = 320;
    const MAX_GRAPH_HEIGHT = 560;
    const legendHeight = legendRef.current ? legendRef.current.clientHeight + 40 : 0;
    const graphHeight = Math.min(Math.max(legendHeight, MIN_GRAPH_HEIGHT), MAX_GRAPH_HEIGHT);
    const legendWidth = legendRef.current.clientWidth + 8;
    const graphInnerContainerWidth = graphInnerContainerRef.current.clientWidth;
    const graphWidth = graphInnerContainerWidth - legendWidth;
    dygraphRef.current.graphDiv.style.width = "".concat(graphWidth, "px");
    dygraphRef.current.graphDiv.style.height = "".concat(graphHeight, "px");
    dygraphRef.current.resizeHandler_();
    dygraphRef.current.canvas_.style.cursor = 'crosshair';
    // Store the updated download PNG dimensions in state so we can display them for the user
    if (downloadRef.current !== null) {
      const dimensions = [Math.ceil(downloadRef.current.clientWidth || 0), Math.ceil(downloadRef.current.clientHeight || 0)];
      if (!(dimensions[0] === graphState.pngDimensions[0] && dimensions[1] === graphState.pngDimensions[1])) {
        graphDispatch({
          type: 'setPngDimensions',
          dimensions
        });
      }
    }
  }, [state.status, dygraphRef, legendRef, graphInnerContainerRef, downloadRef, graphState.pngDimensions, graphDispatch]);

  // Layout effect to keep the graph dimensions in-line with resize events
  (0, _react.useLayoutEffect)(() => {
    if (graphInnerContainerRef.current === null) {
      return () => {};
    }
    // Ensure resize observer is in place
    if (typeof ResizeObserver !== 'function') {
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
    let resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(graphInnerContainerRef.current);
    return () => {
      if (!resizeObserver) {
        return;
      }
      resizeObserver.disconnect();
      resizeObserver = null;
    };
  }, [graphInnerContainerRef, handleResize]);

  // Effect to apply latest options/data to the graph and force a resize
  (0, _react.useEffect)(() => {
    if (state.status !== _constants.TIME_SERIES_VIEWER_STATUS.READY) {
      return;
    }
    if (dygraphRef.current === null) {
      dygraphRef.current = new _dygraphs.default(dygraphDomRef.current, state.graphData.data, graphOptions);
    } else {
      dygraphRef.current.updateOptions(_extends({
        file: state.graphData.data
      }, graphOptions));
      // Detecting an out of bounds date window requires the data
      // to have been updated prior to getting the current axes
      // xAxisRange is the current date window selected by the range selector
      // xAxisExtremes is the date window bounds of the current data
      // If the range selector window no long applies to the viewable data,
      // reset the range selector bounds to the current data
      const xAxisRange = dygraphRef.current.xAxisRange();
      const xAxisExtremes = dygraphRef.current.xAxisExtremes();
      const isLeftBoundValid = xAxisRange[0] >= xAxisExtremes[0] && xAxisRange[0] <= xAxisExtremes[1];
      const isRightBoundValid = xAxisRange[1] >= xAxisExtremes[0] && xAxisRange[1] <= xAxisExtremes[1];
      if (!isLeftBoundValid || !isRightBoundValid) {
        let updatedDateWindow;
        if (!isLeftBoundValid && !isRightBoundValid) {
          updatedDateWindow = [...xAxisExtremes];
        } else if (!isLeftBoundValid) {
          updatedDateWindow = [xAxisExtremes[0], xAxisRange[1]];
        } else if (!isRightBoundValid) {
          updatedDateWindow = [xAxisRange[0], xAxisExtremes[1]];
        }
        dygraphRef.current.updateOptions({
          dateWindow: updatedDateWindow
        });
      }
      // Dygraphs has a bug where the canvas isn't cleared properly when dynamically changing
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
  }, [selectionDigest, state.status, state.graphData.data, graphOptions, dygraphRef, handleResize, axisCountChangedRef]);

  // Effect to register a click handler to the legend for series visibility toggling
  (0, _react.useEffect)(() => {
    if (!legendRef.current) {
      return () => {};
    }
    const legendClickHandler = _ref => {
      let {
        target
      } = _ref;
      const container = legendRef.current;
      if (!container.contains(target)) {
        return;
      }
      const label = target.getAttribute('data-label');
      const kind = target.getAttribute('data-kind');
      if (!label || !kind) {
        return;
      }
      graphDispatch({
        type: 'toggleLegendVisibility',
        label,
        kind
      });
    };
    document.addEventListener('click', legendClickHandler);
    return () => {
      document.removeEventListener('click', legendClickHandler);
    };
  }, [legendRef, graphDispatch]);
  const buildGraphTitle = () => {
    const releaseTitle = (0, _typeUtil.isStringNonEmpty)(state.release) ? ", ".concat(state.release, " ") : '';
    return state.product.productName ? "".concat(state.product.productName, " (").concat(state.product.productCode, ")").concat(releaseTitle) : "".concat(state.product.productCode).concat(releaseTitle);
  };
  const renderCitation = () => {
    if (!state.product || !state.product.productCode) {
      return null;
    }
    return /*#__PURE__*/_react.default.createElement(_DataProductCitation.default, {
      productCode: state.product.productCode,
      release: state.release,
      textOnly: {
        variant: 'caption',
        cssClass: classes.citation
      },
      showTextOnly: true,
      disableConditional: true
    });
  };

  // Download Image Button
  const exportGraphImage = () => {
    if (downloadRef.current === null) {
      return;
    }
    _domToImage.default.toBlob(downloadRef.current).then(blob => {
      const siteCodes = state.selection.sites.map(site => site.siteCode).join(' ');
      const fileName = "NEON Time Series - ".concat(state.product.productCode, " - ").concat(state.product.productName, " - ").concat(siteCodes, ".png");
      (0, _fileSaver.saveAs)(blob, fileName);
    }).catch(error => {
      console.error('Unable to export graph image', error); // eslint-disable-line no-console
    });
  };
  const getPngDimensions = () => "".concat(graphState.pngDimensions[0] || '?', "px x ").concat(graphState.pngDimensions[1] || '?', "px");
  const downloadImageButton = /*#__PURE__*/_react.default.createElement(_Button.default, {
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
  }, "Download Image (png)");

  // Toggle Series Visibility Button
  const {
    series
  } = state.graphData;
  const toggleSeriesVisibility = () => {
    const allSeries = series.map(s => s.label);
    graphDispatch({
      type: 'toggleSeriesVisibility',
      series: allSeries
    });
  };
  const toggleSeriesVisibilityButton = /*#__PURE__*/_react.default.createElement(_Button.default, {
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
  }, graphState.hiddenSeries.size ? "".concat(belowSm ? '' : 'Show All', " Series") : "".concat(belowSm ? '' : 'Hide All', " Series"));

  // Toggle Quality Flag Visibility Button
  const {
    qualityLabels
  } = state.graphData;
  const toggleQualityFlagsVisibility = () => {
    graphDispatch({
      type: 'toggleQualityFlagsVisibility',
      qualityFlags: qualityLabels.slice(2)
    });
  };
  const toggleQualityFlagsVisibilityButton = /*#__PURE__*/_react.default.createElement(_Button.default, {
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
  }, buildGraphTitle()), /*#__PURE__*/_react.default.createElement("div", {
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
  }), renderCitation())), /*#__PURE__*/_react.default.createElement("div", {
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