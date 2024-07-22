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
import './dygraphs-overrides.css';

import moment from 'moment';

import cloneDeep from 'lodash/cloneDeep';

import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

import ImageIcon from '@material-ui/icons/Image';
import ShowIcon from '@material-ui/icons/Visibility';
import HideIcon from '@material-ui/icons/VisibilityOff';

import generateTimeSeriesGraphData from '../../workers/generateTimeSeriesGraphData';

import DataProductCitation from '../Citation/DataProductCitation';
import TimeSeriesViewerContext from './TimeSeriesViewerContext';
import Theme, { COLORS } from '../Theme/Theme';
import { TIME_SERIES_VIEWER_STATUS } from './constants';
import { isStringNonEmpty } from '../../util/typeUtil';

import NeonLogo from '../../images/NSF-NEON-logo.png';

// Load Dygraph plugins. These are not built as modules and require a global Dygraph instance. =(
if (!window.Dygraph) { window.Dygraph = Dygraph; }
// eslint-disable-next-line import/extensions
require('dygraphs/src/extras/shapes.js');
// eslint-disable-next-line import/extensions
require('dygraphs/src/extras/crosshair.js');

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
  rangeSelectorPlotFillColor: Theme.palette.secondary.light,
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

const useStyles = makeStyles((theme) => ({
  graphOuterContainer: {
    backgroundColor: '#ffffff',
    padding: theme.spacing(2),
  },
  graphInnerContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
    },
  },
  graphDiv: {
    minHeight: '320px',
    flexGrow: 1,
    width: '50%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  buttonsOuterContainer: {
    margin: theme.spacing(0, -0.5, 0, -0.5),
    borderTop: `1.5px solid ${COLORS.GREY[200]}`,
    backgroundColor: theme.palette.grey[50],
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(1.5),
    },
  },
  buttonsInnerContainer: {
    display: 'flex',
    marginTop: theme.spacing(-1.5),
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
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginTop: theme.spacing(2),
    },
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
      borderColor: theme.palette.primary.main,
    },
  },
  legendSeriesActive: {
    backgroundColor: '#fff',
    borderColor: theme.palette.primary.main,
  },
  legendSeriesX: {
    whiteSpace: 'nowrap',
    textAlign: 'center',
    fontWeight: 600,
    padding: theme.spacing(1),
    backgroundColor: '#fff',
    borderColor: theme.palette.primary.main,
  },
  legendSeriesColor: {
    width: theme.spacing(3),
    height: '4px',
    pointerEvents: 'none',
  },
  legendSeriesLabel: {
    whiteSpace: 'nowrap',
    lineHeight: '1rem',
    fontSize: '0.7rem',
    marginLeft: theme.spacing(1),
    pointerEvents: 'none',
  },
  legendQualityColor: {
    width: '4px',
    height: theme.spacing(3),
    margin: theme.spacing(0, 1.25, 0, 1.25),
    pointerEvents: 'none',
  },
}));

const INITIAL_GRAPH_STATE = {
  hiddenSeries: new Set(),
  hiddenQualityFlags: new Set(),
  pngDimensions: [0, 0],
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
    case 'setPngDimensions':
      if (!(
        Array.isArray(action.dimensions) && action.dimensions.length === 2
          && action.dimensions.every((v) => typeof v === 'number' && v >= 0)
      )) { return state; }
      newState.pngDimensions = action.dimensions;
      return newState;
    default:
      return state;
  }
};

export default function TimeSeriesViewerGraph() {
  const classes = useStyles(Theme);
  const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  const [graphState, graphDispatch] = useReducer(graphReducer, cloneDeep(INITIAL_GRAPH_STATE));
  const downloadRef = useRef(null);
  const dygraphRef = useRef(null);
  const dygraphDomRef = useRef(null);
  const graphInnerContainerRef = useRef(null);
  const legendRef = useRef(null);
  const axisCountRef = useRef(1);
  const axisCountChangedRef = useRef(false);
  const belowSm = useMediaQuery(Theme.breakpoints.down('sm'));
  const {
    selectionDigest,
    logscale,
    qualityFlags,
    rollPeriod,
    yAxes,
  } = state.selection;

  // let data = cloneDeep(NULL_DATA);
  let graphOptions = cloneDeep(BASE_GRAPH_OPTIONS);

  // Build the axes option
  const buildAxesOption = (axes = []) => {
    const axesOption = {
      x: {
        valueFormatter: Dygraph.dateString_,
        ticker: Dygraph.dateTicker,
        axisLabelFormatter: Dygraph.dateAxisLabelFormatter,
        axisLineWidth: 1.5,
      },
    };
    axes.forEach((axis) => {
      const stateAxis = axis.axis === 'y' ? 'y1' : 'y2';
      const { axisRange, precision } = state.selection.yAxes[stateAxis];
      const axisLabelWidth = precision > 3 ? 75 : 50;
      const nonZeroFloor = parseFloat((10 ** (-1 * (precision + 1))).toFixed(precision + 1), 10);
      const valueRange = state.selection.logscale
        ? [axisRange[0] <= 0 ? nonZeroFloor : axisRange[0], axisRange[1]]
        : [...axisRange];
      axesOption[axis.axis] = {
        independentTicks: true,
        axisLineWidth: 1.5,
        axisLabelWidth,
        valueRange,
      };
    });
    return axesOption;
  };

  // Build the series option
  const buildSeriesOption = (axes = []) => {
    const { series } = state.graphData;
    const seriesOption = {};
    series.forEach((s) => {
      const axis = axes.find((a) => a.units === s.units);
      if (!axis) { return; }
      seriesOption[s.label] = {
        axis: axis.axis,
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
      const { series, qualityLabels } = state.graphData;
      let appliedQualityLabels = [];
      if (qualityFlags.length) {
        appliedQualityLabels = qualityLabels.slice(2);
      }
      // Account for single legend item containing multiple labels
      const hasQualityLabels = appliedQualityLabels.length > 0;
      const qualityLabelsHeightPadding = hasQualityLabels && qualityFlags.length > 1
        ? (qualityFlags.length - 1) * 16
        : 0;
      const numLegendItems = (series ? series.length : 0);
      const qualityLabelHeight = ((hasQualityLabels ? 50 : 0) + qualityLabelsHeightPadding);
      if (numLegendItems > 0) {
        const appliedHeight = (numLegendItems * 50)
          + (numLegendItems * 10)
          + qualityLabelHeight
          + 15;
        // Sanity check
        if (appliedHeight <= 0) {
          return 'auto';
        }
        return `${appliedHeight}px`;
      }
    }
    return 'auto';
  };

  const legendFormatter = (graphData) => {
    const {
      series,
      qualityData,
      timestampMap,
      qualityLabels,
    } = state.graphData;
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
      const className = s.isHighlighted
        ? `${classes.legendSeries} ${classes.legendSeriesActive}`
        : classes.legendSeries;
      const seriesStyle = {};
      if (isHidden) { seriesStyle.opacity = 0.5; }
      const colorStyle = { backgroundColor: s.color || Theme.palette.grey[200] };
      if (s.isHighlighted) { colorStyle.height = '6px'; }
      return (
        <Card
          variant="outlined"
          className={className}
          key={s.label}
          style={seriesStyle}
          data-label={s.label}
          data-kind="series"
          title={`Click to ${isHidden ? 'show' : 'hide'} this series`}
        >
          <div className={classes.legendSeriesColor} style={colorStyle} />
          <div className={classes.legendSeriesLabel}>
            {s.label}
            <br />
            {yUnits}
            {!belowSm || !s.isHighlighted ? null : (
              <>
                <br />
                {moment.utc(graphData.x).format('YYYY-MM-DD HH:mm:ss')}
              </>
            )}
          </div>
        </Card>
      );
    });
    // Quality Flags
    let qualityFlagsLegend = null;
    if (qualityFlags.length) {
      const qfOffset = timestampMap[graphData.x];
      const qfData = qualityData[qfOffset] ? qualityData[qfOffset].slice(2) : null;
      qualityFlagsLegend = qualityLabels.slice(2).map((qualityLabel, qlIdx) => {
        const isHidden = graphState.hiddenQualityFlags.has(qualityLabel);
        const isHighlighted = graphData.series.some((s) => (
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
            title={`Click to ${isHidden ? 'show' : 'hide'} this quality flag series`}
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
    if (graphData.x && !belowSm) {
      dateLegend = (
        <Card variant="outlined" className={classes.legendSeriesX}>
          {moment.utc(graphData.x).format('YYYY-MM-DD HH:mm:ss')}
        </Card>
      );
    }
    // Render
    return ReactDOMServer.renderToString(
      <>
        {seriesLegend}
        {qualityFlagsLegend}
        {dateLegend}
      </>,
    );
  };

  // Function to draw quality flags on the graph
  const renderQualityFlags = (canvas, area, g) => {
    const { qualityData, qualityLabels } = state.graphData;
    const qualitySeriesCount = qualityLabels.length - 2 - graphState.hiddenQualityFlags.size;
    if (qualitySeriesCount < 1) { return; }
    qualityData.forEach((row) => {
      const startX = g.toDomXCoord(row[0]);
      const endX = g.toDomXCoord(row[1]);
      let { y, h } = area;
      h /= qualitySeriesCount;
      for (let c = 2; c < row.length; c += 1) {
        if (!graphState.hiddenQualityFlags.has(qualityLabels[c])) {
          if (row[c] && row[c].some((v) => v !== 0 && v !== null)) {
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
  useEffect(() => {
    if (state.status !== TIME_SERIES_VIEWER_STATUS.READY_FOR_SERIES) { return; }
    generateTimeSeriesGraphData(state).then((graphData) => {
      // With new series and qualityLabels purge any hidden labels that are no longer present
      const { series: newSeries, qualityLabels: newQualityLabels } = graphData;
      const seriesLabels = newSeries.map((s) => s.label);
      if (
        Array.from(graphState.hiddenQualityFlags).some((label) => !newQualityLabels.includes(label))
          || Array.from(graphState.hiddenSeries).some((label) => !seriesLabels.includes(label))
      ) {
        graphDispatch({
          type: 'purgeRemovedHiddenLabels',
          qualityLabels: newQualityLabels.slice(2),
          seriesLabels,
        });
      }
      // Store newly generate graphData in primary context state
      dispatch({ type: 'regenerateGraphData', graphData });
    });
  });

  if (state.status === TIME_SERIES_VIEWER_STATUS.READY) {
    // Determine the set of axes and their units
    const previousAxisCount = axisCountRef.current;
    const axes = Object.keys(yAxes).map((axis) => ({
      axis: axis === 'y1' ? 'y' : 'y2',
      units: yAxes[axis].units,
      // logscale: yAxes[axis].logscale,
    })).slice(0, yAxes.y2.units === null ? 1 : 2);
    axisCountChangedRef.current = axes.length !== previousAxisCount;
    axisCountRef.current = axes.length;

    // Build graphOptions
    const { series, labels } = state.graphData;
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
      visibility: series.map((s) => !graphState.hiddenSeries.has(s.label)),
    };

    // Apply axis labels to graphOptions
    axes.forEach((axis) => {
      graphOptions[`${axis.axis}label`] = axis.units;
    });
  }

  // Callback to refresh graph dimensions for current DOM
  const handleResize = useCallback(() => {
    if (state.status !== TIME_SERIES_VIEWER_STATUS.READY) { return; }
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
    // Store the updated download PNG dimensions in state so we can display them for the user
    if (downloadRef.current !== null) {
      const dimensions = [
        Math.ceil(downloadRef.current.clientWidth || 0),
        Math.ceil(downloadRef.current.clientHeight || 0),
      ];
      if (!(
        dimensions[0] === graphState.pngDimensions[0]
          && dimensions[1] === graphState.pngDimensions[1]
      )) {
        graphDispatch({ type: 'setPngDimensions', dimensions });
      }
    }
  }, [
    state.status,
    dygraphRef,
    legendRef,
    graphInnerContainerRef,
    downloadRef,
    graphState.pngDimensions,
    graphDispatch,
  ]);

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
      dygraphRef.current = new Dygraph(dygraphDomRef.current, state.graphData.data, graphOptions);
    } else {
      dygraphRef.current.updateOptions({ file: state.graphData.data, ...graphOptions });
      // Detecting an out of bounds date window requires the data
      // to have been updated prior to getting the current axes
      // xAxisRange is the current date window selected by the range selector
      // xAxisExtremes is the date window bounds of the current data
      // If the range selector window no long applies to the viewable data,
      // reset the range selector bounds to the current data
      const xAxisRange = dygraphRef.current.xAxisRange();
      const xAxisExtremes = dygraphRef.current.xAxisExtremes();
      const isLeftBoundValid = (xAxisRange[0] >= xAxisExtremes[0])
        && (xAxisRange[0] <= xAxisExtremes[1]);
      const isRightBoundValid = (xAxisRange[1] >= xAxisExtremes[0])
        && (xAxisRange[1] <= xAxisExtremes[1]);
      if (!isLeftBoundValid || !isRightBoundValid) {
        let updatedDateWindow;
        if (!isLeftBoundValid && !isRightBoundValid) {
          updatedDateWindow = [...xAxisExtremes];
        } else if (!isLeftBoundValid) {
          updatedDateWindow = [xAxisExtremes[0], xAxisRange[1]];
        } else if (!isRightBoundValid) {
          updatedDateWindow = [xAxisRange[0], xAxisExtremes[1]];
        }
        dygraphRef.current.updateOptions({ dateWindow: updatedDateWindow });
      }
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
    state.graphData.data,
    graphOptions,
    dygraphRef,
    handleResize,
    axisCountChangedRef,
  ]);

  // Effect to register a click handler to the legend for series visibility toggling
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

  const buildGraphTitle = () => {
    const releaseTitle = isStringNonEmpty(state.release)
      ? `, ${state.release} `
      : '';
    return state.product.productName
      ? `${state.product.productName} (${state.product.productCode})${releaseTitle}`
      : `${state.product.productCode}${releaseTitle}`;
  };

  const renderCitation = () => {
    if (!state.product || !state.product.productCode) {
      return null;
    }
    return (
      <DataProductCitation
        productCode={state.product.productCode}
        release={state.release}
        textOnly={{ variant: 'caption', cssClass: classes.citation }}
        showTextOnly
        disableConditional
      />
    );
  };

  // Download Image Button
  const exportGraphImage = () => {
    if (downloadRef.current === null) { return; }
    domtoimage.toBlob(downloadRef.current)
      .then((blob) => {
        const siteCodes = state.selection.sites.map((site) => site.siteCode).join(' ');
        const fileName = `NEON Time Series - ${state.product.productCode} - ${state.product.productName} - ${siteCodes}.png`;
        saveAs(blob, fileName);
      })
      .catch((error) => {
        console.error('Unable to export graph image', error); // eslint-disable-line no-console
      });
  };
  const getPngDimensions = () => (
    `${graphState.pngDimensions[0] || '?'}px x ${graphState.pngDimensions[1] || '?'}px`
  );
  const downloadImageButton = (
    <Button
      size="small"
      color="primary"
      variant="outlined"
      onClick={exportGraphImage}
      disabled={downloadRef.current === null}
      title={`Download current graph as a PNG (${getPngDimensions()})`}
      style={{ whiteSpace: 'nowrap', marginRight: Theme.spacing(1.5) }}
      startIcon={<ImageIcon />}
    >
      Download Image (png)
    </Button>
  );

  // Toggle Series Visibility Button
  const { series } = state.graphData;
  const toggleSeriesVisibility = () => {
    const allSeries = series.map((s) => s.label);
    graphDispatch({ type: 'toggleSeriesVisibility', series: allSeries });
  };
  const toggleSeriesVisibilityButton = (
    <Button
      size="small"
      color="primary"
      variant="outlined"
      title="Toggle Visibility for All Series"
      onClick={toggleSeriesVisibility}
      disabled={series.length === 0}
      style={{ whiteSpace: 'nowrap', marginLeft: Theme.spacing(1.5) }}
      startIcon={graphState.hiddenSeries.size ? <ShowIcon /> : <HideIcon />}
    >
      {graphState.hiddenSeries.size ? (
        `${belowSm ? '' : 'Show All'} Series`
      ) : (
        `${belowSm ? '' : 'Hide All'} Series`
      )}
    </Button>
  );

  // Toggle Quality Flag Visibility Button
  const { qualityLabels } = state.graphData;
  const toggleQualityFlagsVisibility = () => {
    graphDispatch({ type: 'toggleQualityFlagsVisibility', qualityFlags: qualityLabels.slice(2) });
  };
  const toggleQualityFlagsVisibilityButton = (
    <Button
      size="small"
      color="primary"
      variant="outlined"
      title="Toggle Visibility for All Quality Flags"
      onClick={toggleQualityFlagsVisibility}
      disabled={qualityFlags.length === 0}
      style={{ whiteSpace: 'nowrap' }}
      startIcon={graphState.hiddenQualityFlags.size ? <ShowIcon /> : <HideIcon />}
    >
      {graphState.hiddenQualityFlags.size ? (
        `${belowSm ? '' : 'Show All'} Quality Flags`
      ) : (
        `${belowSm ? '' : 'Hide All'} Quality Flags`
      )}
    </Button>
  );

  /**
     RENDER
  */
  return (
    <>
      <div ref={downloadRef} className={classes.graphOuterContainer}>
        <Typography variant="h6" className={classes.title}>
          {buildGraphTitle()}
        </Typography>
        <div className={classes.graphInnerContainer} ref={graphInnerContainerRef}>
          <div ref={dygraphDomRef} className={classes.graphDiv} />
          <div
            ref={legendRef}
            className={classes.legendDiv}
            style={{ height: calcLegendHeight() }}
          />
        </div>
        <div className={classes.citationContainer}>
          <img
            title="NEON"
            alt="NEON Logo"
            className={classes.neonLogo}
            src={NeonLogo}
          />
          {renderCitation()}
        </div>
      </div>
      <div className={classes.buttonsOuterContainer}>
        <div className={classes.buttonsInnerContainer}>
          <div style={{ marginTop: Theme.spacing(1.5) }}>
            {downloadImageButton}
          </div>
          <div style={{ marginTop: Theme.spacing(1.5), textAlign: 'right' }}>
            {toggleQualityFlagsVisibilityButton}
            {toggleSeriesVisibilityButton}
          </div>
        </div>
      </div>
    </>
  );
}
