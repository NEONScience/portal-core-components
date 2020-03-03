import React, { useRef, useEffect } from 'react';
import Dygraph from 'dygraphs';
import 'dygraphs/dist/dygraph.min.css';

import { makeStyles } from '@material-ui/core/styles';

import TimeSeriesViewerContext, { TIME_SERIES_VIEWER_STATUS } from './TimeSeriesViewerContext';
import Theme from '../Theme/Theme';

const BASE_GRAPH_OPTIONS = {
  includeZero: true,
  labelsUTC: true,
  labelsKMB: false,
  showRangeSelector: true,
  interactionModel: Dygraph.defaultInteractionModel,
  connectSeparatedPoints: false,
  rangeSelectorPlotFillColor: Theme.palette.primary.light,
  animatedZooms: true,
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

const useStyles = makeStyles(theme => ({
  graphContainer: {
    padding: theme.spacing(2),
  },
  graphDiv: {
    width: '100%',
    height: '320px',
  },
}));

export default function TimeSeriesViewerGraph() {
  const classes = useStyles(Theme);
  const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  const dygraphRef = useRef(null);
  const dygraphDomRef = useRef(null);
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
    continuousDateRange.forEach((month, idx) => {
      monthOffsets[idx] = data.length;
      state.product.sites[sites[0].siteCode].positions[sites[0].positions[0]]
        .data[month].basic[timeStep].series.startDateTime.forEach((d) => {
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
            const label = `${siteCode} ${position} - ${variable}`;
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
            state.product.sites[siteCode].positions[position]
              .data[month][downloadPkg][timeStep].series[variable].forEach((d, datumIdx) => {
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
        valueFormatter: Dygraph.dateString_, // eslint-disable-line no-underscore-dangle
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
    series.forEach((serie) => {
      const axis = axes.find(a => a.units === serie.units);
      if (!axis) { return; }
      seriesOption[serie.label] = {
        axis: axis.axis,
      };
    });
    return seriesOption;
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
  return (
    <div className={classes.graphContainer}>
      <div ref={dygraphDomRef} className={classes.graphDiv} />
    </div>
  );
}
