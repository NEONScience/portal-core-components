/* eslint-disable no-underscore-dangle */
import React, {
  useRef,
  useEffect,
  useReducer,
  useCallback,
  useLayoutEffect,
} from 'react';
import ReactDOMServer from 'react-dom/server';
import Dygraph from 'dygraphs';
import 'dygraphs/dist/dygraph.min.css';

import moment from 'moment';

import cloneDeep from 'lodash/cloneDeep';

import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import ImageIcon from '@material-ui/icons/Image';
import ShowIcon from '@material-ui/icons/Visibility';
import HideIcon from '@material-ui/icons/VisibilityOff';

import TimeSeriesViewerContext, {
  TIME_SERIES_VIEWER_STATUS,
  TIME_STEPS,
} from './TimeSeriesViewerContext';
import Theme from '../Theme/Theme';

import NeonLogo from '../../images/NSF-NEON-logo.png';

// Load Dygraph plugins. These are not built as modules and require a global Dyrgaph instance. =(
if (!window.Dygraph) { window.Dygraph = Dygraph; }
require('./../../../../node_modules/dygraphs/src/extras/shapes.js');
require('./../../../../node_modules/dygraphs/src/extras/crosshair.js');

const SERIES_COLORS = [
  '#4e79a7',
  '#f28e2c',
  '#e15759',
  '#76b7b2',
  '#59a14f',
  '#edc949',
  '#af7aa1',
  '#ff9da7',
  '#9c755f',
  '#bab0ab',
];

const QUALITY_COLORS = [
  '#8dd3c7',
  '#f9f986',
  '#bebada',
  '#fb8072',
  '#80b1d3',
  '#fdb462',
  '#b3de69',
  '#fccde5',
  '#d9d9d9',
  '#bc80bd',
  '#ccebc5',
  '#ffed6f',
];

const BASE_GRAPH_OPTIONS = {
  includeZero: true,
  labelsUTC: true,
  labelsKMB: false,
  showRangeSelector: true,
  interactionModel: Dygraph.defaultInteractionModel,
  connectSeparatedPoints: false,
  rangeSelectorPlotFillColor: Theme.palette.primary.light,
  animatedZooms: false,
  colors: SERIES_COLORS,
  highlightCircleSize: 3,
  highlightSeriesBackgroundAlpha: 1,
  highlightSeriesOpts: {
    strokeWidth: 1.5,
    drawHighlightPointCallback: (g, name, ctx, cx, cy, color) => {
      ctx.lineWidth = 2;
      return Dygraph.Circles.SQUARE(g, name, ctx, cx, cy, color, 6);
    },
  },
  plugins: [
    new Dygraph.Plugins.Crosshair({ direction: 'vertical' }),
  ],
};

const NULL_DATA = [[0, 0]];

const boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
const boxShadowHeavy = '0px 4px 2px -2px rgba(0,0,0,0.4), 0px 2px 2px 0px rgba(0,0,0,0.28), 0px 2px 6px 0px rgba(0,0,0,0.24)';
const useStyles = makeStyles(theme => ({
  graphOuterContainer: {
    backgroundColor: '#ffffff',
    padding: theme.spacing(2),
  },
  graphInnerContainer: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  graphDiv: {
    minHeight: '320px',
    flexGrow: 1,
  },
  buttonsContainer: {
    margin: theme.spacing(0, 2, 1, 2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  citationContainer: {
    marginTop: Theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  citation: {
    color: Theme.palette.grey[400],
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing(1.5),
  },
  neonLogo: {
    maxHeight: theme.spacing(5),
    marginRight: theme.spacing(2),
  },
  legendDiv: {
    flexShrink: 0,
    marginLeft: theme.spacing(1),
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
    cursor: 'pointer',
    boxShadow,
    '&:hover': {
      boxShadow: boxShadowHeavy,
    },
  },
  legendSeriesX: {
    whiteSpace: 'nowrap',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.grey[100],
    textAlign: 'center',
    fontWeight: 600,
    boxShadow,
  },
  legendSeriesColor: {
    width: theme.spacing(3),
    height: '4px',
    borderRadius: '2px',
    pointerEvents: 'none',
  },
  legendSeriesLabel: {
    whiteSpace: 'nowrap',
    lineHeight: '1rem',
    fontSize: '0.8rem',
    marginLeft: theme.spacing(1),
    pointerEvents: 'none',
  },
  legendQualityColor: {
    width: '4px',
    height: theme.spacing(3),
    margin: theme.spacing(0, 1.25, 0, 1.25),
    pointerEvents: 'none',
  },
  buttonIcon: {
    fontSize: '1.2rem',
    marginRight: Theme.spacing(0.5),
  },
}));

// Get the next year/month string after a given year/month string
// Example: getNextMonth('2012-12') => '2013-01'
const getNextMonth = month => moment.utc(`${month}-15T00:00:00Z`).add(1, 'month').format('YYYY-MM');

const INITIAL_GRAPH_STATE = {
  hiddenSeries: new Set(),
  hiddenQualityFlags: new Set(),
};
const graphReducer = (state, action) => {
  const newState = { ...state };
  let key = null;
  switch (action.type) {
    case 'reinitialize':
      return cloneDeep(INITIAL_GRAPH_STATE);
    case 'toggleLegendVisibility':
      if (!['series', 'qualityFlag'].includes(action.kind)) { return state; }
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
      Array.from(state.hiddenSeries).forEach((label) => {
        if (!action.seriesLabels.includes(label)) { newState.hiddenSeries.delete(label); }
      });
      Array.from(state.hiddenQualityFlags).forEach((label) => {
        if (!action.qualityLabels.includes(label)) { newState.hiddenQualityFlags.delete(label); }
      });
      return newState;
    default:
      return state;
  }
};

export default function TimeSeriesViewerGraph() {
  const classes = useStyles(Theme);
  const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  const [graphState, graphDispatch] = useReducer(graphReducer, cloneDeep(INITIAL_GRAPH_STATE));
  const downloadRef = useRef(null);
  const dygraphRef = useRef(null);
  const dygraphDomRef = useRef(null);
  const graphInnerContainerRef = useRef(null);
  const legendRef = useRef(null);
  const axisCountRef = useRef(1);
  const axisCountChangedRef = useRef(false);
  const {
    selectionDigest,
    dateRange,
    continuousDateRange,
    variables,
    dateTimeVariable,
    sites,
    timeStep: selectedTimeStep,
    autoTimeStep,
    rollPeriod,
    logscale,
    yAxes,
    qualityFlags,
  } = state.selection;
  const timeStep = selectedTimeStep === 'auto' ? autoTimeStep : selectedTimeStep;

  let data = cloneDeep(NULL_DATA);
  let qualityData = [];
  let labels = ['x'];
  let qualityLabels = ['start', 'end'];
  let series = [];
  let monthOffsets = {};
  let timestampMap = {};
  const qfNullFill = qualityFlags.map(() => null);
  let graphOptions = cloneDeep(BASE_GRAPH_OPTIONS);

  // Initialize data set with timestep-based times and monthOffsets for registering actual data
  const buildTimeData = () => {
    // Reinitialize
    data = [];
    qualityData = [];
    monthOffsets = {};
    timestampMap = {};
    // Sanity check: must have a valid time step
    if (!TIME_STEPS[timeStep]) { data = cloneDeep(NULL_DATA); return; }
    // Tick through date range one time step at a time building data, qualityData, and timeStampMap
    const { seconds } = TIME_STEPS[timeStep];
    const startMonth = dateRange[0];
    const ticker = moment.utc(`${startMonth}-01T00:00:00Z`);
    const endMonth = getNextMonth(dateRange[1]);
    let currentMonth = ticker.format('YYYY-MM');
    let previousMonth = null;
    let offset = null;
    let endStep = null;
    while (currentMonth < endMonth) {
      data.push([ticker.toDate()]);
      endStep = moment.utc(ticker).add(seconds, 'seconds');
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
    // everything is hidden  everything render the minimum, which is NOT an empty array
    if (data.length === 0) { data = cloneDeep(NULL_DATA); }
  };

  // Build the rest of the data structure and labels using selection values
  const buildSeriesData = () => {
    // Reinitialize
    series = [];
    labels = ['x'];
    qualityLabels = ['start', 'end'];
    // Sanity check: must have a valid dateTimeVariable
    if (!dateTimeVariable) { return; }
    // Loop through each site...
    sites.forEach((site) => {
      const { siteCode, positions } = site;
      // Loop through each site position...
      positions.forEach((position) => {
        // Generate quality flag label and add to the list of quality labels
        const qualityLabel = `${siteCode} - ${position}`;
        if (qualityFlags.length && !qualityLabels.includes(qualityLabel)) {
          qualityLabels.push(qualityLabel);
        }

        // For each site position loop through every month in the continuous date range (no gaps)
        continuousDateRange.forEach((month) => {
          // Use monthOffsets to determine where in the entire data set this month belongs
          if (!Object.keys(monthOffsets).includes(month)) { return; }
          const monthIdx = monthOffsets[month];
          const nextMonth = getNextMonth(month);
          const monthStepCount = Object.keys(monthOffsets).includes(nextMonth)
            ? monthOffsets[nextMonth] - monthIdx
            : data.length - monthIdx;

          // For each site/position/month loop through all selected variables...
          variables.forEach((variable) => {
            // Generate series label and add to the list of labels if this is the first we see it
            const label = `${siteCode} - ${position} - ${variable}`;
            if (!labels.includes(label)) {
              labels.push(label);
              series.push({
                siteCode,
                position,
                variable,
                label,
                units: state.variables[variable].units,
              });
            }
            const columnIdx = labels.indexOf(label);
            if (!columnIdx) { return; } // 0 is x, so this should always be 1 or greater
            const { downloadPkg: pkg } = state.variables[variable];
            const posData = state.product.sites[siteCode].positions[position].data;
            // Null-fill if this site/position/month/variable has no series data or no dateTime data
            if (
              !posData[month]
                || !posData[month][pkg]
                || !posData[month][pkg][timeStep]
                || !posData[month][pkg][timeStep].series[variable]
                || !posData[month][pkg][timeStep].series[dateTimeVariable]
            ) {
              for (let t = monthIdx; t < monthStepCount; t += 1) {
                data[t][columnIdx] = null;
              }
              return;
            }
            // This site/position/month/variable series exists, so add it into the data set
            const seriesStepCount = posData[month][pkg][timeStep].series[variable].length;
            if (seriesStepCount !== monthStepCount) {
              // The series data length does not match the expected month length so
              // loop through by month steps pulling in series values through timestamp matching
              const setSeriesValueByTimestamp = (t) => {
                const isodate = moment.utc(qualityData[t][0]).format('YYYY-MM-DD[T]HH:mm:ss[Z]');
                const dataIdx = posData[month][pkg][timeStep].series[dateTimeVariable]
                  .findIndex(dateTimeVal => dateTimeVal === isodate);
                data[t][columnIdx] = dataIdx !== -1
                  ? posData[month][pkg][timeStep].series[variable][dataIdx]
                  : null;
              };
              for (let t = monthIdx; t < monthStepCount; t += 1) {
                setSeriesValueByTimestamp(t);
              }
              return;
            }
            // Series and month data lengths are identical as expected so we can stream
            // values directly in without matching timestamps
            posData[month][pkg][timeStep].series[variable].forEach((d, datumIdx) => {
              data[datumIdx + monthIdx][columnIdx] = d;
            });
          });

          // Also for each site/position/month loop through all selected quality flags...
          qualityFlags.forEach((qf, qfIdx) => {
            const columnIdx = qualityLabels.indexOf(qualityLabel);
            if (columnIdx < 2) { return; } // 0 is start and 1 is end
            const { downloadPkg: pkg } = state.variables[qf];
            const posData = state.product.sites[siteCode].positions[position].data;
            // If this site/position/month/variable has no series data then fill with nulls
            if (
              !posData[month]
                || !posData[month][pkg]
                || !posData[month][pkg][timeStep]
                || !posData[month][pkg][timeStep].series[qf]
            ) {
              for (let t = monthIdx; t < monthStepCount; t += 1) {
                qualityData[t][columnIdx] = [...qfNullFill];
              }
              return;
            }
            // This site/position/month/qf series exists, so add it into the quality data set
            const seriesStepCount = posData[month][pkg][timeStep].series[qf].length;
            if (seriesStepCount !== monthStepCount) {
              // The series data length does not match the expected month length so
              // loop through by month steps pulling in series values through timestamp matching
              const setQualityValueByTimestamp = (t) => {
                const isodate = moment.utc(qualityData[t][0]).format('YYYY-MM-DD[T]HH:mm:ss[Z]');
                const dataIdx = posData[month][pkg][timeStep].series[dateTimeVariable]
                  .findIndex(dateTimeVal => dateTimeVal === isodate);
                if (dataIdx === -1) {
                  qualityData[t][columnIdx] = [...qfNullFill];
                  return;
                }
                const d = posData[month][pkg][timeStep].series[qf][dataIdx];
                qualityData[t][columnIdx] = qfIdx ? [...qualityData[t][columnIdx], d] : [d];
              };
              for (let t = monthIdx; t < monthStepCount; t += 1) {
                setQualityValueByTimestamp(t);
              }
              return;
            }
            // Series and month data lengths are identical as expected so we can stream
            // values directly in without matching timestamps
            posData[month][pkg][timeStep].series[qf].forEach((d, datumIdx) => {
              const t = datumIdx + monthIdx;
              qualityData[t][columnIdx] = qfIdx ? [...qualityData[t][columnIdx], d] : [d];
            });
          });
        });
      });
    });
    // With series and qualityLabels built out purge any hidden labels that are no longer present
    const seriesLabels = series.map(s => s.label);
    if (
      Array.from(graphState.hiddenQualityFlags).some(label => !qualityLabels.includes(label))
        || Array.from(graphState.hiddenSeries).some(label => !seriesLabels.includes(label))
    ) {
      graphDispatch({
        type: 'purgeRemovedHiddenLabels',
        qualityLabels: qualityLabels.slice(2),
        seriesLabels,
      });
    }
  };

  // Build the axes option
  const buildAxesOption = (axes = []) => {
    const axesOption = {
      x: {
        valueFormatter: Dygraph.dateString_,
        ticker: Dygraph.dateTicker,
        axisLabelFormatter: Dygraph.dateAxisLabelFormatter,
      },
    };
    axes.forEach((axis) => {
      axesOption[axis.axis] = {
        independentTicks: true,
      };
    });
    return axesOption;
  };

  // Build the series option
  const buildSeriesOption = (axes = []) => {
    const seriesOption = {};
    series.forEach((s) => {
      const axis = axes.find(a => a.units === s.units);
      if (!axis) { return; }
      seriesOption[s.label] = {
        axis: axis.axis,
      };
    });
    return seriesOption;
  };

  const legendFormatter = (graphData) => {
    // Series
    const seriesLegend = graphData.series.map((s, idx) => {
      const isHidden = graphState.hiddenSeries.has(s.label);
      const { units } = series[idx];
      let yUnits = units;
      if (typeof s.y === 'number' && !Number.isNaN(s.y)) {
        let yStr = s.y.toString();
        if (yStr.indexOf('.') !== -1 && yStr.length - yStr.indexOf('.') > 3) {
          yStr = s.y.toFixed(2).toString();
        }
        const yUnitsStr = `${yStr} ${units}`;
        yUnits = s.isHighlighted ? <b>{yUnitsStr}</b> : yUnitsStr;
      }
      const seriesStyle = s.isHighlighted ? { backgroundColor: Theme.palette.grey[100] } : {};
      if (isHidden) { seriesStyle.opacity = 0.5; }
      const colorStyle = { backgroundColor: s.color || Theme.palette.grey[200] };
      if (s.isHighlighted) { colorStyle.height = '6px'; }
      return (
        <div
          key={s.label}
          className={classes.legendSeries}
          style={seriesStyle}
          data-label={s.label}
          data-kind="series"
        >
          <div className={classes.legendSeriesColor} style={colorStyle} />
          <div className={classes.legendSeriesLabel}>
            {s.label}
            <br />
            {yUnits}
          </div>
        </div>
      );
    });
    // Quality Flags
    let qualityFlagsLegend = null;
    if (qualityFlags.length) {
      const qfOffset = timestampMap[graphData.x];
      const qfData = qualityData[qfOffset] ? qualityData[qfOffset].slice(2) : null;
      qualityFlagsLegend = qualityLabels.slice(2).map((qualityLabel, qlIdx) => {
        const isHidden = graphState.hiddenQualityFlags.has(qualityLabel);
        const isHighlighted = graphData.series.some(s => (
          s.isHighlighted && s.label.includes(qualityLabel)
        ));
        const qualityStyle = isHighlighted ? { backgroundColor: Theme.palette.grey[100] } : {};
        if (isHidden) { qualityStyle.opacity = 0.5; }
        const colorStyle = { backgroundColor: QUALITY_COLORS[qlIdx % 12] };
        return (
          <div
            key={qualityLabel}
            className={classes.legendSeries}
            style={qualityStyle}
            data-label={qualityLabel}
            data-kind="qualityFlag"
          >
            <div className={classes.legendQualityColor} style={colorStyle} />
            <div className={classes.legendSeriesLabel}>
              {`${qualityLabel} - Quality Flags`}
              <br />
              {qualityFlags.map((qf, qfIdx) => (
                qfData === null || !qfData[qlIdx] ? (
                  <div key={qf}>
                    {qf}
                  </div>
                ) : (
                  <div key={qf} style={isHighlighted ? { fontWeight: 600 } : {}}>
                    {`${qfData[qlIdx][qfIdx]} - ${qf}`}
                  </div>
                )
              ))}
            </div>
          </div>
        );
      });
    }
    // Date
    let dateLegend = null;
    if (graphData.x) {
      dateLegend = (
        <div className={classes.legendSeriesX}>
          {moment.utc(graphData.x).format('YYYY-MM-DD HH:mm:ss')}
        </div>
      );
    }
    // Render
    return ReactDOMServer.renderToString(
      <React.Fragment>
        {seriesLegend}
        {qualityFlagsLegend}
        {dateLegend}
      </React.Fragment>,
    );
  };

  // Function to draw quality flags on the graph
  const renderQualityFlags = (canvas, area, g) => {
    const qualitySeriesCount = qualityLabels.length - 2 - graphState.hiddenQualityFlags.size;
    if (qualitySeriesCount < 1) { return; }
    qualityData.forEach((row) => {
      const startX = g.toDomXCoord(row[0]);
      const endX = g.toDomXCoord(row[1]);
      let { y, h } = area;
      h /= qualitySeriesCount;
      for (let c = 2; c < row.length; c += 1) {
        if (!graphState.hiddenQualityFlags.has(qualityLabels[c])) {
          if (row[c] && row[c].some(v => v !== 0)) {
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

  if (state.status === TIME_SERIES_VIEWER_STATUS.READY) {
    buildTimeData();
    buildSeriesData();
    // Determine the set of axes and their units
    const previousAxisCount = axisCountRef.current;
    const axes = Object.keys(yAxes).map(axis => ({
      axis: axis === 'y1' ? 'y' : 'y2',
      units: yAxes[axis].units,
      // logscale: yAxes[axis].logscale,
    })).slice(0, yAxes.y2.units === null ? 1 : 2);
    axisCountChangedRef.current = axes.length !== previousAxisCount;
    axisCountRef.current = axes.length;

    // Build graphOptions
    graphOptions = {
      ...cloneDeep(BASE_GRAPH_OPTIONS),
      labels,
      axes: buildAxesOption(axes),
      series: buildSeriesOption(axes),
      rollPeriod,
      logscale,
      labelsDiv: legendRef.current,
      legend: 'always',
      legendFormatter,
      underlayCallback: getUnderlayCallback(),
      visibility: series.map(s => !graphState.hiddenSeries.has(s.label)),
    };
    // Apply axis labels to graphOptions
    axes.forEach((axis) => {
      graphOptions[`${axis.axis}label`] = axis.units;
    });
  }

  // Callback to refresh graph dimensions for current DOM
  const handleResize = useCallback(() => {
    if (!dygraphRef.current || !legendRef.current || !graphInnerContainerRef.current) { return; }
    // Resize the graph relative to the legend width now that the legend is properly rendered
    const MIN_GRAPH_HEIGHT = 320;
    const MAX_GRAPH_HEIGHT = 560;
    const legendHeight = legendRef.current ? legendRef.current.clientHeight + 40 : 0;
    const graphHeight = Math.min(Math.max(legendHeight, MIN_GRAPH_HEIGHT), MAX_GRAPH_HEIGHT);
    const legendWidth = legendRef.current.clientWidth + 8;
    const graphInnerContainerWidth = graphInnerContainerRef.current.clientWidth;
    const graphWidth = graphInnerContainerWidth - legendWidth;
    dygraphRef.current.graphDiv.style.width = `${graphWidth}px`;
    dygraphRef.current.graphDiv.style.height = `${graphHeight}px`;
    dygraphRef.current.resizeHandler_();
    dygraphRef.current.canvas_.style.cursor = 'crosshair';
  }, [dygraphRef, legendRef, graphInnerContainerRef]);

  // Layout effect to keep the graph dimensions in-line with resize events
  useLayoutEffect(() => {
    if (graphInnerContainerRef.current === null) { return () => {}; }
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
      if (!resizeObserver) { return; }
      resizeObserver.disconnect();
      resizeObserver = null;
    };
  }, [graphInnerContainerRef, handleResize]);

  // Effect to apply latest options/data to the graph and force a resize
  useEffect(() => {
    if (state.status !== TIME_SERIES_VIEWER_STATUS.READY) { return; }
    if (dygraphRef.current === null) {
      dygraphRef.current = new Dygraph(dygraphDomRef.current, data, graphOptions);
    } else {
      dygraphRef.current.updateOptions({ file: data, ...graphOptions });
      // Dygraphs has a bug where the canvas isn't cleared properly when dynamically changing
      // the y-axis count. We can force a canvas refresh by cycling the range selector. This
      // is not clean, but it is at least minimally invasive.
      if (axisCountChangedRef.current) {
        dygraphRef.current.updateOptions({ showRangeSelector: false });
        dygraphRef.current.updateOptions({ showRangeSelector: true });
      }
    }
    handleResize();
  }, [
    selectionDigest,
    state.status,
    data,
    graphOptions,
    dygraphRef,
    handleResize,
    axisCountChangedRef,
  ]);

  // Effect to register a click handler to the legend for sereis visibility toggling
  useEffect(() => {
    if (!legendRef.current) { return () => {}; }
    const legendClickHandler = ({ target }) => {
      const container = legendRef.current;
      if (!container.contains(target)) { return; }
      const label = target.getAttribute('data-label');
      const kind = target.getAttribute('data-kind');
      if (!label || !kind) { return; }
      graphDispatch({ type: 'toggleLegendVisibility', label, kind });
    };
    document.addEventListener('click', legendClickHandler);
    return () => { document.removeEventListener('click', legendClickHandler); };
  }, [legendRef, graphDispatch]);

  // Download Image Button
  const exportGraphImage = () => {
    if (downloadRef.current === null) { return; }
    domtoimage.toBlob(downloadRef.current)
      .then((blob) => {
        const siteCodes = state.selection.sites.map(site => site.siteCode).join(' ');
        const fileName = `NEON Time Series - ${state.product.productCode} - ${state.product.productName} - ${siteCodes}.png`;
        saveAs(blob, fileName);
      })
      .catch((error) => {
        console.error('Unable to export graph image', error); // eslint-disable-line no-console
      });
  };
  const downloadImageButton = (
    <Button
      size="small"
      color="primary"
      variant="outlined"
      onClick={exportGraphImage}
      disabled={downloadRef.current === null}
      style={{ whiteSpace: 'nowrap' }}
    >
      <ImageIcon className={classes.buttonIcon} />
      Download Image (png)
    </Button>
  );

  // Toggle Series Visibility Button
  const toggleSeriesVisibility = () => {
    const allSeries = series.map(s => s.label);
    graphDispatch({ type: 'toggleSeriesVisibility', series: allSeries });
  };
  const toggleSeriesVisibilityButton = (
    <Button
      size="small"
      color="primary"
      variant="outlined"
      onClick={toggleSeriesVisibility}
      disabled={series.length === 0}
      style={{ whiteSpace: 'nowrap', marginLeft: Theme.spacing(1) }}
    >
      {graphState.hiddenSeries.size ? (
        <React.Fragment>
          <ShowIcon className={classes.buttonIcon} />
          Show All Series
        </React.Fragment>
      ) : (
        <React.Fragment>
          <HideIcon className={classes.buttonIcon} />
          Hide All Series
        </React.Fragment>
      )}
    </Button>
  );

  // Toggle Quality Flag Visibility Button
  const toggleQualityFlagsVisibility = () => {
    graphDispatch({ type: 'toggleQualityFlagsVisibility', qualityFlags: qualityLabels.slice(2) });
  };
  const toggleQualityFlagsVisibilityButton = (
    <Button
      size="small"
      color="primary"
      variant="outlined"
      onClick={toggleQualityFlagsVisibility}
      disabled={qualityFlags.length === 0}
      style={{ whiteSpace: 'nowrap' }}
    >
      {graphState.hiddenQualityFlags.size ? (
        <React.Fragment>
          <ShowIcon className={classes.buttonIcon} />
          Show All Quality Flags
        </React.Fragment>
      ) : (
        <React.Fragment>
          <HideIcon className={classes.buttonIcon} />
          Hide All Quality Flags
        </React.Fragment>
      )}
    </Button>
  );

  /**
     RENDER
  */
  return (
    <React.Fragment>
      <div ref={downloadRef} className={classes.graphOuterContainer}>
        <Typography variant="h6" className={classes.title}>
          {state.product.productName
            ? `${state.product.productName} (${state.product.productCode})`
            : state.product.productCode}
        </Typography>
        <div className={classes.graphInnerContainer} ref={graphInnerContainerRef}>
          <div ref={dygraphDomRef} className={classes.graphDiv} style={{ width: '50% !important' }} />
          <div ref={legendRef} className={classes.legendDiv} />
        </div>
        <div className={classes.citationContainer}>
          <img
            title="NEON"
            alt="NEON Logo"
            className={classes.neonLogo}
            src={NeonLogo}
          />
          <Typography variant="caption" className={classes.citation}>
            {/* eslint-disable react/jsx-one-expression-per-line */}
            National Ecological Observatory Network. {(new Date()).getFullYear()}.
            Data Product: {state.product.productCode}, {state.product.productName}.
            Battelle, Boulder, CO, USA NEON.
            {/* eslint-enable react/jsx-one-expression-per-line */}
          </Typography>
        </div>
      </div>
      <div className={classes.buttonsContainer}>
        <div>
          {downloadImageButton}
        </div>
        <div style={{ textAlign: 'right' }}>
          {toggleQualityFlagsVisibilityButton}
          {toggleSeriesVisibilityButton}
        </div>
      </div>
    </React.Fragment>
  );
}
