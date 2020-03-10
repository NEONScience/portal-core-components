/* eslint-disable no-underscore-dangle */
import React, { useRef, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import Dygraph from 'dygraphs';
import 'dygraphs/dist/dygraph.min.css';

import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import TimeSeriesViewerContext, {
  TIME_SERIES_VIEWER_STATUS,
  TIME_STEPS,
} from './TimeSeriesViewerContext';
import Theme from '../Theme/Theme';

import NeonLogo from '../../images/NSF-NEON-logo.png';

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
  animatedZooms: true,
  colors: SERIES_COLORS,
  highlightCircleSize: 6,
  highlightSeriesBackgroundAlpha: 1,
  highlightSeriesOpts: {
    strokeWidth: 1.5,
  },
};

const boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
const useStyles = makeStyles(theme => ({
  graphOuterContainer: {
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
    boxShadow,
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
  },
  legendSeriesLabel: {
    whiteSpace: 'nowrap',
    lineHeight: '1rem',
    fontSize: '0.8rem',
    marginLeft: theme.spacing(1),
  },
  legendQualityColor: {
    width: '4px',
    height: theme.spacing(3),
    margin: theme.spacing(0, 1.25, 0, 1.25),
  },
}));

// Get the next year/month string after a given year/month string
// Example: getNextMonth('2012-12') => '2013-01'
const getNextMonth = month => moment.utc(`${month}-15T00:00:00Z`).add(1, 'month').format('YYYY-MM');

export default function TimeSeriesViewerGraph() {
  const classes = useStyles(Theme);
  const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  const dygraphRef = useRef(null);
  const dygraphDomRef = useRef(null);
  const legendRef = useRef(null);
  const axisCountRef = useRef(1);
  const axisCountChangedRef = useRef(false);
  const {
    selectionDigest,
    dateRange,
    continuousDateRange,
    variables,
    sites,
    timeStep: selectedTimeStep,
    autoTimeStep,
    rollPeriod,
    logscale,
    yAxes,
    qualityFlags,
  } = state.selection;
  const timeStep = selectedTimeStep === 'auto' ? autoTimeStep : selectedTimeStep;

  const data = [];
  const labels = ['x'];
  const qualityData = [];
  const qualityLabels = ['start', 'end'];
  const monthOffsets = {};
  const timestampMap = {};
  const series = [];
  const qfNullFill = qualityFlags.map(() => null);
  let graphOptions = BASE_GRAPH_OPTIONS;

  // Initialize data set with timestep-based times and monthOffsets for registering actual data
  const buildTimeData = () => {
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
  };

  // Build the rest of the data structure and labels using selection values
  const buildSeriesData = () => {
    // Loop through each site...
    sites.forEach((site) => {
      const { siteCode, positions } = site;
      // Loop through each site position...
      positions.forEach((position) => {
        // Generate quality flag label and add to the list of quality labels
        const qualityLabel = `${siteCode} - ${position}`;
        if (!qualityLabels.includes(qualityLabel)) {
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
            // If this site/position/month/variable has no series data then fill with nulls
            if (!posData[month] || !posData[month][pkg] || !posData[month][pkg][timeStep]) {
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
                const timestamp = moment.utc(qualityData[t][0]).format('YYYY-MM-DD[T]HH:mm:ss[Z]');
                const dataIdx = posData[month][pkg][timeStep].series.startDateTime
                  .findIndex(startDateTime => startDateTime === timestamp);
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
            if (!posData[month] || !posData[month][pkg] || !posData[month][pkg][timeStep]) {
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
                const timestamp = moment.utc(qualityData[t][0]).format('YYYY-MM-DD[T]HH:mm:ss[Z]');
                const dataIdx = posData[month][pkg][timeStep].series.startDateTime
                  .findIndex(startDateTime => startDateTime === timestamp);
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
      const colorStyle = { backgroundColor: s.color };
      if (s.isHighlighted) { colorStyle.height = '6px'; }
      return (
        <div key={s.label} className={classes.legendSeries} style={seriesStyle}>
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
        const isHighlighted = graphData.series.some(s => (
          s.isHighlighted && s.label.includes(qualityLabel)
        ));
        const qualityStyle = isHighlighted ? { backgroundColor: Theme.palette.grey[100] } : {};
        const colorStyle = { backgroundColor: QUALITY_COLORS[qlIdx % 12] };
        return (
          <div key={qualityLabel} className={classes.legendSeries} style={qualityStyle}>
            <div className={classes.legendQualityColor} style={colorStyle} />
            <div className={classes.legendSeriesLabel}>
              {`${qualityLabel} - Quality Flags`}
              <br />
              {qualityFlags.map((qf, qfIdx) => (
                qfData === null ? (
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

  const renderQualityFlags = (canvas, area, g) => {
    if (!qualityFlags.length) { return; }
    const qualitySeriesCount = qualityLabels.length - 2;
    qualityData.forEach((row) => {
      const startX = g.toDomXCoord(row[0]);
      const endX = g.toDomXCoord(row[1]);
      let { y, h } = area;
      h /= qualitySeriesCount;
      for (let c = 2; c < row.length; c += 1) {
        if (row[c] && row[c].some(v => v !== 0)) {
          canvas.fillStyle = QUALITY_COLORS[(c - 2) % 12]; // eslint-disable-line no-param-reassign, max-len
          canvas.fillRect(startX, y, endX - startX, h);
        }
        y += h;
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
      ...BASE_GRAPH_OPTIONS,
      labels,
      axes: buildAxesOption(axes),
      series: buildSeriesOption(axes),
      rollPeriod,
      logscale,
      labelsDiv: legendRef.current,
      legend: 'always',
      legendFormatter,
      underlayCallback: getUnderlayCallback(),
    };
    // Apply axis labels to graphOptions
    axes.forEach((axis) => {
      graphOptions[`${axis.axis}label`] = axis.units;
    });
  }

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
    // Refresh graph dimensions
    const MIN_GRAPH_HEIGHT = 320;
    const MAX_GRAPH_HEIGHT = 560;
    const legendHeight = legendRef.current ? legendRef.current.clientHeight + 40 : 0;
    const graphHeight = Math.min(Math.max(legendHeight, MIN_GRAPH_HEIGHT), MAX_GRAPH_HEIGHT);
    dygraphRef.current.graphDiv.style.width = null;
    dygraphRef.current.graphDiv.style.height = `${graphHeight}px`;
    dygraphRef.current.resizeHandler_();
    dygraphRef.current.canvas_.style.cursor = 'crosshair';
    console.log(Dygraph, dygraphRef.current);
  }, [
    selectionDigest,
    state.status,
    data,
    graphOptions,
    dygraphRef,
    legendRef,
    axisCountChangedRef,
  ]);

  /**
     RENDER
  */
  return (
    <div className={classes.graphOuterContainer}>
      <Typography variant="h6" className={classes.title}>
        {state.product.productName
          ? `${state.product.productName} (${state.product.productCode})`
          : state.product.productCode}
      </Typography>
      <div className={classes.graphInnerContainer}>
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
  );
}
