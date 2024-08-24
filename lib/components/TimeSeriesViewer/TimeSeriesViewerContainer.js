"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeSeriesViewerSummary = TimeSeriesViewerSummary;
exports.default = TimeSeriesViewerContainer;
var _react = _interopRequireWildcard(require("react"));
var _moment = _interopRequireDefault(require("moment"));
var _styles = require("@mui/styles");
var _useMediaQuery = _interopRequireDefault(require("@mui/material/useMediaQuery"));
var _Card = _interopRequireDefault(require("@mui/material/Card"));
var _CircularProgress = _interopRequireDefault(require("@mui/material/CircularProgress"));
var _Link = _interopRequireDefault(require("@mui/material/Link"));
var _Tab = _interopRequireDefault(require("@mui/material/Tab"));
var _Tabs = _interopRequireDefault(require("@mui/material/Tabs"));
var _Table = _interopRequireDefault(require("@mui/material/Table"));
var _TableBody = _interopRequireDefault(require("@mui/material/TableBody"));
var _TableCell = _interopRequireDefault(require("@mui/material/TableCell"));
var _TableRow = _interopRequireDefault(require("@mui/material/TableRow"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _Skeleton = _interopRequireDefault(require("@mui/material/Skeleton"));
var _Error = _interopRequireDefault(require("@mui/icons-material/Error"));
var _Toc = _interopRequireDefault(require("@mui/icons-material/Toc"));
var _Place = _interopRequireDefault(require("@mui/icons-material/Place"));
var _DateRange = _interopRequireDefault(require("@mui/icons-material/DateRange"));
var _Timeline = _interopRequireDefault(require("@mui/icons-material/Timeline"));
var _BorderInner = _interopRequireDefault(require("@mui/icons-material/BorderInner"));
var _ReleaseChip = _interopRequireDefault(require("../Chip/ReleaseChip"));
var _Theme = _interopRequireWildcard(require("../Theme/Theme"));
var _RouteService = _interopRequireDefault(require("../../service/RouteService"));
var _TimeSeriesViewerContext = _interopRequireWildcard(require("./TimeSeriesViewerContext"));
var _constants = require("./constants");
var _TimeSeriesViewerSites = _interopRequireDefault(require("./TimeSeriesViewerSites"));
var _TimeSeriesViewerDateRange = _interopRequireDefault(require("./TimeSeriesViewerDateRange"));
var _TimeSeriesViewerVariables = _interopRequireDefault(require("./TimeSeriesViewerVariables"));
var _TimeSeriesViewerAxes = _interopRequireDefault(require("./TimeSeriesViewerAxes"));
var _TimeSeriesViewerGraph = _interopRequireDefault(require("./TimeSeriesViewerGraph"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// We can't rely on flex-sizing to work during resize events as some components within tabs
// won't be able to shrink correctly on resize (notably: Data Product Availability charts).
const VERTICAL_TABS_WIDTH = 150;
const useStyles = (0, _styles.makeStyles)(theme => ({
  tabsContainer: {
    display: 'flex',
    margin: theme.spacing(0, -0.5, -0.5, -0.5),
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column'
    }
  },
  tabsVertical: {
    width: `${VERTICAL_TABS_WIDTH}px`
  },
  tabsHorizontal: {
    flexShrink: 0
  },
  tabPanels: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${VERTICAL_TABS_WIDTH}px)`,
      borderTop: `1.5px solid ${_Theme.COLORS.GREY[200]}`
    }
  },
  tabPanelContainer: {
    padding: theme.spacing(2.5),
    width: '100%'
  },
  graphContainer: {
    zIndex: 0,
    position: 'relative',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(0.5),
    borderWidth: '1.5px'
  },
  graphOverlay: {
    display: 'block',
    position: 'absolute',
    width: 'calc(100% + 8px)',
    height: 'calc(100% + 2px)',
    textAlign: 'center',
    top: 0,
    left: 0,
    zIndex: 10,
    margin: theme.spacing(-0.5, -0.5, 0, -0.5),
    padding: theme.spacing(20, 4, 4, 4),
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    '& .MuiTypography-root': {
      boxShadow: '0px 0px 20px 25px #fff',
      backgroundColor: '#fff'
    }
  },
  titleContainer: {
    marginBottom: theme.spacing(2)
  },
  summaryDiv: {
    marginBottom: theme.spacing(1)
  },
  axisTitle: {
    fontWeight: 600,
    paddingLeft: '0px',
    paddingRight: theme.spacing(1)
  },
  axisSettings: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  axisSettingTitle: {
    textTransform: 'uppercase',
    color: theme.palette.grey[300],
    fontWeight: 700,
    fontSize: '85%',
    marginRight: _Theme.default.spacing(1)
  },
  errorIcon: {
    color: _Theme.default.colors.RED[400]
  },
  warningIcon: {
    color: _Theme.default.colors.GOLD[500]
  },
  releaseChip: {
    color: _Theme.default.colors.LIGHT_BLUE[600],
    border: `1px solid ${_Theme.default.colors.LIGHT_BLUE[600]}`,
    backgroundColor: _Theme.default.colors.LIGHT_BLUE[50],
    fontWeight: 600,
    cursor: 'help',
    marginTop: _Theme.default.spacing(0.5)
  },
  startFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
}));
const useTabsStyles = (0, _styles.makeStyles)(theme => ({
  scroller: {
    [theme.breakpoints.up('md')]: {
      backgroundColor: theme.palette.grey[200]
    }
  }
}));
const useTabStyles = (0, _styles.makeStyles)(theme => ({
  root: {
    [theme.breakpoints.up('md')]: {
      marginLeft: '-1.5px',
      '&:first-child': {
        marginBottom: '-0.5px'
      },
      '&:not(:first-child)': {
        marginTop: '-1.5px'
      }
    },
    [theme.breakpoints.down('md')]: {
      paddingRight: theme.spacing(2.5),
      '&:not(:first-child)': {
        marginLeft: '-1.5px'
      }
    },
    textTransform: 'none',
    opacity: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
      margin: `${theme.spacing(0, 1, 0, 0)} !important`
    }
  },
  labelIcon: {
    minHeight: theme.spacing(8),
    minWidth: theme.spacing(15),
    [theme.breakpoints.down('md')]: {
      minHeight: theme.spacing(6),
      minWidth: theme.spacing(17)
    }
  },
  selected: {
    [theme.breakpoints.down('md')]: {
      borderBottom: 'none'
    },
    [theme.breakpoints.up('md')]: {
      borderRight: 'none',
      marginLeft: '0px'
    }
  }
}));

/**
   Summary Component
*/
function TimeSeriesViewerSummary() {
  const classes = useStyles(_Theme.default);
  const [state] = _TimeSeriesViewerContext.default.useTimeSeriesViewerState();
  const {
    sites,
    dateRange,
    variables,
    timeStep,
    autoTimeStep,
    logscale,
    qualityFlags,
    rollPeriod,
    yAxes
  } = state.selection;
  const skeletonProps = {
    variant: 'rect',
    height: 10,
    style: {
      marginTop: '4px',
      marginBottom: '12px'
    }
  };

  // Product
  const productHref = _RouteService.default.getProductDetailPath(state.product.productCode);
  let productSummaryTitle = /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "h6",
      children: "Data Product"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "body2",
      children: state.product.productCode
    })]
  });
  let productSummaryDescription = /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Skeleton.default, {
      ...skeletonProps,
      width: 200
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Skeleton.default, {
      ...skeletonProps,
      width: "100%"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Skeleton.default, {
      ...skeletonProps,
      width: "100%"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Skeleton.default, {
      ...skeletonProps,
      width: 125
    })]
  });
  if (state.product.productName) {
    productSummaryTitle = /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      style: {
        marginRight: _Theme.default.spacing(1)
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "subtitle2",
        children: "Data Product"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "body2",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Link.default, {
          href: productHref,
          target: "_blank",
          style: {
            fontWeight: 600
          },
          children: `${state.product.productName} - (${state.product.productCode})`
        })
      })]
    });
    productSummaryDescription = /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "body2",
        children: state.product.productDescription
      }), state.product.productSensor ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Typography.default, {
        variant: "body2",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("b", {
          children: "Sensor:"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          style: {
            marginLeft: _Theme.default.spacing(0.5)
          },
          children: state.product.productSensor
        })]
      }) : null]
    });
  }

  // Release
  const useReleaseChip = state.release !== null;
  let latestRelease = null;
  if (state.releases && state.releases.length) {
    const sortedReleases = [...state.releases].sort((a, b) => a.generationDate > b.generationDate ? -1 : 1);
    latestRelease = sortedReleases[0].release;
  }
  const latestReleaseClause = useReleaseChip ? '' : ` (release: ${latestRelease || 'unknown'})`;
  const releaseTooltip = state.release === null ? `You are viewing only the latest released and provisional data (release: ${latestRelease || 'unknown'}).` : `You are viewing product data only from the ${state.release} release (no provisional data will be included).`;
  const releaseChipLabel = state.release === null ? `Latest released and provisional data${latestReleaseClause}` : `${state.release}`;
  const releaseSummary = !useReleaseChip ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
    variant: "body2",
    children: releaseChipLabel
  }, releaseChipLabel) : /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ReleaseChip.default, {
      chipLabel: releaseChipLabel,
      classes: {
        chip: classes.releaseChip
      },
      tooltipTitle: releaseTooltip,
      tooltipProps: {
        placement: 'bottom-start'
      }
    })
  });

  // Sites
  const sitesSummary = !sites.length ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Skeleton.default, {
    ...skeletonProps,
    width: 175
  }) : sites.map(site => {
    const {
      siteCode,
      positions
    } = site;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "body2",
      children: `${siteCode} - ${positions.join(', ')}`
    }, siteCode);
  });

  // Date Range
  let dateRangeSummary = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Skeleton.default, {
    ...skeletonProps,
    width: 300
  });
  if (dateRange.length === 2 && dateRange[0] && dateRange[1]) {
    const pluralize = (val, unit) => val === 1 ? `${val} ${unit}` : `${val} ${unit}s`;
    const startMoment = (0, _moment.default)(`${dateRange[0]}-15`);
    const endMoment = (0, _moment.default)(`${dateRange[1]}-15`);
    const months = Math.ceil(endMoment.diff(startMoment, 'months', true)) + 1;
    const years = Math.floor(months / 12);
    let diff = `${pluralize(months, 'month')}`;
    if (years > 0) {
      diff = !(months % 12) ? `${pluralize(years, 'year')}` : `${pluralize(years, 'year')}, ${pluralize(months % 12, 'month')}`;
    }
    dateRangeSummary = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "body2",
      children: `${startMoment.format('MMM YYYY')} - ${endMoment.format('MMM YYYY')} (${diff})`
    });
  }

  // Variables
  const variablesSummary = !variables.length ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Skeleton.default, {
    ...skeletonProps,
    width: 250
  }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "body2",
      children: variables.join(', ')
    }), qualityFlags.length > 0 ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "body2",
      children: `Quality flags: ${qualityFlags.join(', ')}`
    }) : null]
  });

  // Axes
  const axes = {
    x: [],
    y1: [],
    y2: []
  };
  const currentTimeStep = timeStep === 'auto' ? `Auto (${autoTimeStep})` : timeStep;
  axes.x.push({
    title: 'Time step',
    value: currentTimeStep
  });
  if (rollPeriod > 1 && currentTimeStep !== null) {
    axes.x.push({
      title: 'Roll period',
      value: (0, _TimeSeriesViewerContext.summarizeTimeSteps)(rollPeriod, currentTimeStep, false)
    });
  }
  Object.keys(yAxes).forEach(yAxis => {
    if (yAxes[yAxis].units !== null) {
      axes[yAxis].push({
        title: 'Scale',
        value: logscale ? 'Logarithmic' : 'Linear'
      });
      axes[yAxis].push({
        title: 'Units',
        value: yAxes[yAxis].units
      });
      const rangeMode = _TimeSeriesViewerContext.Y_AXIS_RANGE_MODE_DETAILS[yAxes[yAxis].rangeMode].name;
      const range = `${rangeMode} (${yAxes[yAxis].axisRange[0].toString()} - ${yAxes[yAxis].axisRange[1].toString()} ${yAxes[yAxis].units})`;
      axes[yAxis].push({
        title: 'Range',
        value: range
      });
    }
  });
  const renderAxisSetting = setting => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    style: {
      marginRight: _Theme.default.spacing(2),
      whiteSpace: 'nowrap'
    },
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      className: classes.axisSettingTitle,
      children: `${setting.title}:`
    }), setting.value]
  }, setting.title);
  const axesSummary = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Table.default, {
    size: "small",
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_TableBody.default, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_TableRow.default, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_TableCell.default, {
          className: classes.axisTitle,
          children: "x"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_TableCell.default, {
          className: classes.axisSettings,
          children: axes.x.map(renderAxisSetting)
        })]
      }), !axes.y1.length ? null : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_TableRow.default, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_TableCell.default, {
          className: classes.axisTitle,
          children: "y1"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_TableCell.default, {
          className: classes.axisSettings,
          children: axes.y1.map(renderAxisSetting)
        })]
      }), !axes.y2.length ? null : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_TableRow.default, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_TableCell.default, {
          className: classes.axisTitle,
          children: "y2"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_TableCell.default, {
          className: classes.axisSettings,
          children: axes.y2.map(renderAxisSetting)
        })]
      })]
    })
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.summaryDiv,
      children: [productSummaryTitle, productSummaryDescription]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.summaryDiv,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "subtitle2",
        children: "Release"
      }), releaseSummary]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.summaryDiv,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "subtitle2",
        children: "Sites & Positions"
      }), sitesSummary]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.summaryDiv,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "subtitle2",
        children: "Date Range"
      }), dateRangeSummary]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.summaryDiv,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "subtitle2",
        children: "Variables"
      }), variablesSummary]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.summaryDiv,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "subtitle2",
        children: "x/y Axes"
      }), axesSummary]
    })]
  });
}

/**
   Define Tabs
*/
const TAB_IDS = {
  SUMMARY: 'SUMMARY',
  SITES: 'SITES',
  DATE_RANGE: 'DATE_RANGE',
  VARIABLES: 'VARIABLES',
  AXES: 'AXES'
};
const TABS = {
  [TAB_IDS.SUMMARY]: {
    label: 'SUMMARY',
    ariaLabel: 'Summary',
    Icon: _Toc.default,
    Component: TimeSeriesViewerSummary
  },
  [TAB_IDS.SITES]: {
    // eslint-disable-next-line react/jsx-one-expression-per-line
    label: /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
      children: ["SITES &", /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {}), "POSITIONS"]
    }),
    ariaLabel: 'Sites and Positions',
    Icon: _Place.default,
    Component: _TimeSeriesViewerSites.default
  },
  [TAB_IDS.DATE_RANGE]: {
    label: 'DATE RANGE',
    ariaLabel: 'Date Range',
    Icon: _DateRange.default,
    Component: _TimeSeriesViewerDateRange.default
  },
  [TAB_IDS.VARIABLES]: {
    label: 'VARIABLES',
    ariaLabel: 'Variables',
    Icon: _Timeline.default,
    Component: _TimeSeriesViewerVariables.default
  },
  [TAB_IDS.AXES]: {
    label: 'x/y AXES',
    ariaLabel: 'x/y Axes',
    Icon: _BorderInner.default,
    Component: _TimeSeriesViewerAxes.default
  }
};
const DEFAULT_TAB = 'SUMMARY';
function TimeSeriesViewerContainer() {
  const classes = useStyles(_Theme.default);
  const tabClasses = useTabStyles(_Theme.default);
  const tabsClasses = useTabsStyles(_Theme.default);
  const [state] = _TimeSeriesViewerContext.default.useTimeSeriesViewerState();
  const belowMd = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('md'));

  // console.log('TIME SERIES VIEWER STATE:', state);

  const initialTab = DEFAULT_TAB;
  const [selectedTab, setSelectedTab] = (0, _react.useState)(initialTab);
  const [loadedProductCode, setLoadedProductCode] = (0, _react.useState)(state.product.productCode);

  // Effect to handle a reinitialize event from the context. We track the loaded product code
  // separate from the context product code so when the latter changes we know to reset the
  // tab to SUMMARY and completely unmount and remount the TimeSeriesGraph.
  (0, _react.useEffect)(() => {
    if (state.product.productCode === loadedProductCode) {
      return;
    }
    setLoadedProductCode(state.product.productCode);
    setSelectedTab(DEFAULT_TAB);
  }, [state.product.productCode, loadedProductCode, setSelectedTab]);

  // Slider position is not controlled in state because doing so kills mouse drag performance.
  // Use a ref to deterministically set slider position for all slider-based features.
  const dateRangeSliderRef = (0, _react.useRef)(null);
  const renderTabs = () => /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tabs.default, {
    orientation: belowMd ? 'horizontal' : 'vertical',
    scrollButtons: belowMd ? true : 'auto',
    variant: "scrollable",
    value: selectedTab,
    className: belowMd ? classes.tabsHorizontal : classes.tabsVertical,
    classes: tabsClasses,
    "aria-label": "Time Series Viewer Controls",
    onChange: (event, newTab) => {
      setSelectedTab(newTab);
    },
    TabIndicatorProps: {
      style: {
        display: 'none'
      }
    },
    children: Object.keys(TABS).map(tabId => {
      const {
        label,
        ariaLabel,
        Icon: TabIcon
      } = TABS[tabId];
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tab.default, {
        value: tabId,
        label: label,
        "aria-label": ariaLabel || label,
        icon: /*#__PURE__*/(0, _jsxRuntime.jsx)(TabIcon, {}),
        classes: tabClasses,
        id: `time-series-viewer-tab-${tabId}`,
        "aria-controls": `time-series-viewer-tabpanel-${tabId}`
      }, tabId);
    })
  });
  const renderTabPanels = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: classes.tabPanels,
    children: Object.keys(TABS).map(tabId => {
      const {
        Component: TabComponent
      } = TABS[tabId];
      let tabComponentProps = {
        setSelectedTab,
        TAB_IDS
      };
      if (tabId === TAB_IDS.DATE_RANGE) {
        tabComponentProps = {
          dateRangeSliderRef
        };
      }
      return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        role: "tabpanel",
        id: `time-series-viewer-tabpanel-${tabId}`,
        "aria-labelledby": `time-series-viewer-tab-${tabId}`,
        style: {
          display: selectedTab === tabId ? 'block' : 'none'
        },
        className: classes.tabPanelContainer,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(TabComponent, {
          ...tabComponentProps
        })
      }, tabId);
    })
  });
  const renderGraphOverlay = () => {
    const isError = state.status === _constants.TIME_SERIES_VIEWER_STATUS.ERROR;
    const isWarning = state.status === _constants.TIME_SERIES_VIEWER_STATUS.WARNING;
    const isLoading = !isError && state.status !== _constants.TIME_SERIES_VIEWER_STATUS.READY;
    if (isError || isWarning) {
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: classes.graphOverlay,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "subtitle2",
          style: {
            marginBottom: _Theme.default.spacing(4)
          },
          children: state.displayError || 'An unknown error occurred; unable to visualize data product'
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Error.default, {
          fontSize: "large",
          className: classes[isError ? 'errorIcon' : 'warningIcon']
        })]
      });
    }
    const isLoadingData = isLoading && state.status === _constants.TIME_SERIES_VIEWER_STATUS.LOADING_DATA;
    if (isLoading) {
      let title = _TimeSeriesViewerContext.TIME_SERIES_VIEWER_STATUS_TITLES[state.status] || 'Loading…';
      const progressProps = {
        variant: 'indeterminate'
      };
      if (isLoadingData) {
        const progress = Math.floor(state.dataFetchProgress || 0);
        progressProps.variant = 'determinate';
        progressProps.value = progress;
        title = `${title} (${progress}%)`;
      }
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: classes.graphOverlay,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "subtitle2",
          style: {
            marginBottom: _Theme.default.spacing(4)
          },
          children: title
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_CircularProgress.default, {
          ...progressProps
        })]
      });
    }
    return null;
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    style: {
      width: '100%'
    },
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Card.default, {
      className: classes.graphContainer,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        style: {
          position: 'relative'
        },
        children: [state.product.productCode === loadedProductCode ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_TimeSeriesViewerGraph.default, {}) : null, renderGraphOverlay()]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: classes.tabsContainer,
        children: [renderTabs(), renderTabPanels()]
      })]
    })
  });
}