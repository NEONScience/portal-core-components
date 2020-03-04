/* eslint-disable no-underscore-dangle */
import React, { useRef, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import Dygraph from 'dygraphs';
import 'dygraphs/dist/dygraph.min.css';

import { makeStyles } from '@material-ui/core/styles';

import TimeSeriesViewerContext, { TIME_SERIES_VIEWER_STATUS } from './TimeSeriesViewerContext';
import Theme from '../Theme/Theme';

const COLORS = [
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

const BASE_GRAPH_OPTIONS = {
  includeZero: true,
  labelsUTC: true,
  labelsKMB: false,
  showRangeSelector: true,
  interactionModel: Dygraph.defaultInteractionModel,
  connectSeparatedPoints: false,
  rangeSelectorPlotFillColor: Theme.palette.primary.light,
  animatedZooms: true,
  colors: COLORS,
  highlightSeriesOpts: {
    strokeWidth: 1.5,
  },
};

const boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
const useStyles = makeStyles(theme => ({
  graphContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'flex-start',
  },
  graphDiv: {
    height: '320px',
    flexGrow: 1,
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
}));

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
    continuousDateRange,
    variables,
    sites,
    timeStep: selectedTimeStep,
    autoTimeStep,
    rollPeriod,
    logscale,
    yAxes,
  } = state.selection;
  const timeStep = selectedTimeStep === 'auto' ? autoTimeStep : selectedTimeStep;

  const data = [];
  const monthOffsets = [];
  const labels = ['x'];
  const series = [];
  let graphOptions = BASE_GRAPH_OPTIONS;

  // Build the first column (dateTime) and keep track of where the month breaks are
  const buildTimeData = () => {
    const downloadPkg = 'basic';
    const source = state.product.sites[sites[0].siteCode].positions[sites[0].positions[0]];
    continuousDateRange.forEach((month, idx) => {
      monthOffsets[idx] = data.length;
      if (
        !source.data[month]
          || !source.data[month][downloadPkg]
          || !source.data[month][downloadPkg][timeStep]
      ) { return; }
      source.data[month][downloadPkg][timeStep].series.startDateTime.forEach((d) => {
        data.push([d]);
      });
    });
  };

  // Build the rest of the data structure and labels using selection values
  const buildSeriesData = () => {
    sites.forEach((site) => {
      const { siteCode, positions } = site;
      positions.forEach((position) => {
        continuousDateRange.forEach((month, monthIdx) => {
          variables.forEach((variable) => {
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
            const { downloadPkg } = state.variables[variable];
            const source = state.product.sites[siteCode].positions[position];
            if (
              !source.data[month]
                || !source.data[month][downloadPkg]
                || !source.data[month][downloadPkg][timeStep]
            ) { return; }
            source.data[month][downloadPkg][timeStep].series[variable].forEach((d, datumIdx) => {
              data[datumIdx + monthOffsets[monthIdx]][columnIdx] = d;
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

  const legendFormatter = graphData => ReactDOMServer.renderToString(
    <React.Fragment>
      {graphData.series.map((s, idx) => {
        const { units } = series[idx];
        let yUnits = units;
        if (typeof s.y !== 'undefined') {
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
      })}
      {graphData.x ? (
        <div className={classes.legendSeriesX}>
          {graphData.xHTML}
        </div>
      ) : null}
    </React.Fragment>,
  );

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
    };
    // Apply axis labels to graphOptions
    axes.forEach((axis) => {
      graphOptions[`${axis.axis}label`] = axis.units;
    });
  }

  useEffect(() => {
    if (state.status !== TIME_SERIES_VIEWER_STATUS.READY) { return; }
    const redrawWidth = () => {
      dygraphRef.current.graphDiv.style.width = null;
      dygraphRef.current.resizeHandler_();
    };
    if (dygraphRef.current === null) {
      dygraphRef.current = new Dygraph(dygraphDomRef.current, data, graphOptions);
      redrawWidth();
    } else {
      dygraphRef.current.updateOptions({ file: data, ...graphOptions });
      // Dygraphs has a bug where the canvas isn't cleared properly when dynamically changing
      // the y-axis count. We can force a canvas refresh by cycling the range selector. This
      // is not clean, but it is at least minimally invasive.
      if (axisCountChangedRef.current) {
        dygraphRef.current.updateOptions({ showRangeSelector: false });
        dygraphRef.current.updateOptions({ showRangeSelector: true });
      }
      redrawWidth();
    }
  }, [selectionDigest, state.status, data, graphOptions, dygraphRef, axisCountChangedRef]);

  /**
     RENDER
  */
  return (
    <div className={classes.graphContainer}>
      <div ref={dygraphDomRef} className={classes.graphDiv} style={{ width: '50% !important' }} />
      <div ref={legendRef} className={classes.legendDiv} />
    </div>
  );
}
