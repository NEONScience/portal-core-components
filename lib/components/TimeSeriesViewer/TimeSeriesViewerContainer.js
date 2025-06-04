"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeSeriesViewerSummary = TimeSeriesViewerSummary;
exports.default = TimeSeriesViewerContainer;
var _react = _interopRequireWildcard(require("react"));
var _moment = _interopRequireDefault(require("moment"));
var _styles = require("@material-ui/core/styles");
var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));
var _Card = _interopRequireDefault(require("@material-ui/core/Card"));
var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));
var _Link = _interopRequireDefault(require("@material-ui/core/Link"));
var _Tab = _interopRequireDefault(require("@material-ui/core/Tab"));
var _Tabs = _interopRequireDefault(require("@material-ui/core/Tabs"));
var _Table = _interopRequireDefault(require("@material-ui/core/Table"));
var _TableBody = _interopRequireDefault(require("@material-ui/core/TableBody"));
var _TableCell = _interopRequireDefault(require("@material-ui/core/TableCell"));
var _TableRow = _interopRequireDefault(require("@material-ui/core/TableRow"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _Skeleton = _interopRequireDefault(require("@material-ui/lab/Skeleton"));
var _Error = _interopRequireDefault(require("@material-ui/icons/Error"));
var _Toc = _interopRequireDefault(require("@material-ui/icons/Toc"));
var _Place = _interopRequireDefault(require("@material-ui/icons/Place"));
var _DateRange = _interopRequireDefault(require("@material-ui/icons/DateRange"));
var _Timeline = _interopRequireDefault(require("@material-ui/icons/Timeline"));
var _BorderInner = _interopRequireDefault(require("@material-ui/icons/BorderInner"));
var _Warning = _interopRequireDefault(require("@material-ui/icons/Warning"));
var _Computer = _interopRequireDefault(require("@material-ui/icons/Computer"));
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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// We can't rely on flex-sizing to work during resize events as some components within tabs
// won't be able to shrink correctly on resize (notably: Data Product Availability charts).
const VERTICAL_TABS_WIDTH = 150;
const useStyles = (0, _styles.makeStyles)(theme => ({
  tabsContainer: {
    display: 'flex',
    margin: theme.spacing(0, -0.5, -0.5, -0.5),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  tabsVertical: {
    width: "".concat(VERTICAL_TABS_WIDTH, "px")
  },
  tabsHorizontal: {
    flexShrink: 0
  },
  tabPanels: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: "calc(100% - ".concat(VERTICAL_TABS_WIDTH, "px)"),
      borderTop: "1.5px solid ".concat(_Theme.COLORS.GREY[200])
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
    border: "1px solid ".concat(_Theme.default.colors.LIGHT_BLUE[600]),
    backgroundColor: _Theme.default.colors.LIGHT_BLUE[50],
    fontWeight: 600,
    cursor: 'help',
    marginTop: _Theme.default.spacing(0.5)
  },
  startFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  statusBar: {
    marginLeft: '-4px',
    marginRight: '-4px',
    backgroundColor: _Theme.default.palette.grey[200],
    padding: '4px 4px 4px 12px',
    '& svg': {
      verticalAlign: 'bottom',
      marginRight: '4px'
    },
    '& .warningMessage': {
      marginLeft: '20px',
      '& svg': {
        color: _Theme.default.colors.BROWN[300]
      }
    }
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
    [theme.breakpoints.down('sm')]: {
      paddingRight: theme.spacing(2.5),
      '&:not(:first-child)': {
        marginLeft: '-1.5px'
      }
    },
    textTransform: 'none',
    opacity: 1
  },
  labelIcon: {
    minHeight: theme.spacing(8),
    minWidth: theme.spacing(15),
    [theme.breakpoints.down('sm')]: {
      minHeight: theme.spacing(6),
      minWidth: theme.spacing(17)
    }
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
      margin: "".concat(theme.spacing(0, 1, 0, 0), " !important")
    }
  },
  selected: {
    [theme.breakpoints.down('sm')]: {
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
  let productSummaryTitle = /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6"
  }, "Data Product"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2"
  }, state.product.productCode));
  let productSummaryDescription = /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Skeleton.default, _extends({}, skeletonProps, {
    width: 200
  })), /*#__PURE__*/_react.default.createElement(_Skeleton.default, _extends({}, skeletonProps, {
    width: "100%"
  })), /*#__PURE__*/_react.default.createElement(_Skeleton.default, _extends({}, skeletonProps, {
    width: "100%"
  })), /*#__PURE__*/_react.default.createElement(_Skeleton.default, _extends({}, skeletonProps, {
    width: 125
  })));
  if (state.product.productName) {
    productSummaryTitle = /*#__PURE__*/_react.default.createElement("div", {
      style: {
        marginRight: _Theme.default.spacing(1)
      }
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, "Data Product"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2"
    }, /*#__PURE__*/_react.default.createElement(_Link.default, {
      href: productHref,
      target: "_blank",
      style: {
        fontWeight: 600
      }
    }, "".concat(state.product.productName, " - (").concat(state.product.productCode, ")"))));
    productSummaryDescription = /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2"
    }, state.product.productDescription), state.product.productSensor ? /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2"
    }, /*#__PURE__*/_react.default.createElement("b", null, "Sensor:"), /*#__PURE__*/_react.default.createElement("span", {
      style: {
        marginLeft: _Theme.default.spacing(0.5)
      }
    }, state.product.productSensor)) : null);
  }

  // Release
  const useReleaseChip = state.release !== null;
  let latestRelease = null;
  if (state.releases && state.releases.length) {
    const sortedReleases = [...state.releases].sort((a, b) => a.generationDate > b.generationDate ? -1 : 1);
    latestRelease = sortedReleases[0].release;
  }
  const latestReleaseClause = useReleaseChip ? '' : " (release: ".concat(latestRelease || 'unknown', ")");
  const releaseTooltip = state.release === null ? "You are viewing only the latest released and provisional data (release: ".concat(latestRelease || 'unknown', ").") : "You are viewing product data only from the ".concat(state.release, " release (no provisional data will be included).");
  const releaseChipLabel = state.release === null ? "Latest released and provisional data".concat(latestReleaseClause) : "".concat(state.release);
  const releaseSummary = !useReleaseChip ? /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2",
    key: releaseChipLabel
  }, releaseChipLabel) : /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_ReleaseChip.default, {
    chipLabel: releaseChipLabel,
    classes: {
      chip: classes.releaseChip
    },
    tooltipTitle: releaseTooltip,
    tooltipProps: {
      placement: 'bottom-start'
    }
  }));

  // Sites
  const sitesSummary = !sites.length ? /*#__PURE__*/_react.default.createElement(_Skeleton.default, _extends({}, skeletonProps, {
    width: 175
  })) : sites.map(site => {
    const {
      siteCode,
      positions
    } = site;
    return /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2",
      key: siteCode
    }, "".concat(siteCode, " - ").concat(positions.join(', ')));
  });

  // Date Range
  let dateRangeSummary = /*#__PURE__*/_react.default.createElement(_Skeleton.default, _extends({}, skeletonProps, {
    width: 300
  }));
  if (dateRange.length === 2 && dateRange[0] && dateRange[1]) {
    const pluralize = (val, unit) => val === 1 ? "".concat(val, " ").concat(unit) : "".concat(val, " ").concat(unit, "s");
    const startMoment = (0, _moment.default)("".concat(dateRange[0], "-15"));
    const endMoment = (0, _moment.default)("".concat(dateRange[1], "-15"));
    const months = Math.ceil(endMoment.diff(startMoment, 'months', true)) + 1;
    const years = Math.floor(months / 12);
    let diff = "".concat(pluralize(months, 'month'));
    if (years > 0) {
      diff = !(months % 12) ? "".concat(pluralize(years, 'year')) : "".concat(pluralize(years, 'year'), ", ").concat(pluralize(months % 12, 'month'));
    }
    dateRangeSummary = /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2"
    }, "".concat(startMoment.format('MMM YYYY'), " - ").concat(endMoment.format('MMM YYYY'), " (").concat(diff, ")"));
  }

  // Variables
  const variablesSummary = !variables.length ? /*#__PURE__*/_react.default.createElement(_Skeleton.default, _extends({}, skeletonProps, {
    width: 250
  })) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2"
  }, variables.join(', ')), qualityFlags.length > 0 ? /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2"
  }, "Quality flags: ".concat(qualityFlags.join(', '))) : null);

  // Axes
  const axes = {
    x: [],
    y1: [],
    y2: []
  };
  const currentTimeStep = timeStep === 'auto' ? "Auto (".concat(autoTimeStep, ")") : timeStep;
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
      const range = "".concat(rangeMode, " (").concat(yAxes[yAxis].axisRange[0].toString(), " - ").concat(yAxes[yAxis].axisRange[1].toString(), " ").concat(yAxes[yAxis].units, ")");
      axes[yAxis].push({
        title: 'Range',
        value: range
      });
    }
  });
  const renderAxisSetting = setting => /*#__PURE__*/_react.default.createElement("div", {
    key: setting.title,
    style: {
      marginRight: _Theme.default.spacing(2),
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: classes.axisSettingTitle
  }, "".concat(setting.title, ":")), setting.value);
  const axesSummary = /*#__PURE__*/_react.default.createElement(_Table.default, {
    size: "small"
  }, /*#__PURE__*/_react.default.createElement(_TableBody.default, null, /*#__PURE__*/_react.default.createElement(_TableRow.default, null, /*#__PURE__*/_react.default.createElement(_TableCell.default, {
    className: classes.axisTitle
  }, "x"), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
    className: classes.axisSettings
  }, axes.x.map(renderAxisSetting))), !axes.y1.length ? null : /*#__PURE__*/_react.default.createElement(_TableRow.default, null, /*#__PURE__*/_react.default.createElement(_TableCell.default, {
    className: classes.axisTitle
  }, "y1"), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
    className: classes.axisSettings
  }, axes.y1.map(renderAxisSetting))), !axes.y2.length ? null : /*#__PURE__*/_react.default.createElement(_TableRow.default, null, /*#__PURE__*/_react.default.createElement(_TableCell.default, {
    className: classes.axisTitle
  }, "y2"), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
    className: classes.axisSettings
  }, axes.y2.map(renderAxisSetting)))));
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.summaryDiv
  }, productSummaryTitle, productSummaryDescription), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.summaryDiv
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "subtitle2"
  }, "Release"), releaseSummary), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.summaryDiv
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "subtitle2"
  }, "Sites & Positions"), sitesSummary), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.summaryDiv
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "subtitle2"
  }, "Date Range"), dateRangeSummary), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.summaryDiv
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "subtitle2"
  }, "Variables"), variablesSummary), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.summaryDiv
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "subtitle2"
  }, "x/y Axes"), axesSummary));
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
    label: /*#__PURE__*/_react.default.createElement("span", null, "SITES &", /*#__PURE__*/_react.default.createElement("br", null), "POSITIONS"),
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
  const belowMd = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('sm'));

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
  const renderTabs = () => /*#__PURE__*/_react.default.createElement(_Tabs.default, {
    orientation: belowMd ? 'horizontal' : 'vertical',
    scrollButtons: belowMd ? 'on' : 'auto',
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
    }
  }, Object.keys(TABS).map(tabId => {
    const {
      label,
      ariaLabel,
      Icon: TabIcon
    } = TABS[tabId];
    return /*#__PURE__*/_react.default.createElement(_Tab.default, {
      key: tabId,
      value: tabId,
      label: label,
      "aria-label": ariaLabel || label,
      icon: /*#__PURE__*/_react.default.createElement(TabIcon, null),
      classes: tabClasses,
      id: "time-series-viewer-tab-".concat(tabId),
      "aria-controls": "time-series-viewer-tabpanel-".concat(tabId)
    });
  }));
  const renderTabPanels = () => /*#__PURE__*/_react.default.createElement("div", {
    className: classes.tabPanels
  }, Object.keys(TABS).map(tabId => {
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
    return /*#__PURE__*/_react.default.createElement("div", {
      key: tabId,
      role: "tabpanel",
      id: "time-series-viewer-tabpanel-".concat(tabId),
      "aria-labelledby": "time-series-viewer-tab-".concat(tabId),
      style: {
        display: selectedTab === tabId ? 'block' : 'none'
      },
      className: classes.tabPanelContainer
    }, /*#__PURE__*/_react.default.createElement(TabComponent, tabComponentProps));
  }));
  const renderGraphOverlay = () => {
    const isError = state.status === _constants.TIME_SERIES_VIEWER_STATUS.ERROR;
    const isWarning = state.status === _constants.TIME_SERIES_VIEWER_STATUS.WARNING;
    const isLoading = !isError && state.status !== _constants.TIME_SERIES_VIEWER_STATUS.READY;
    if (isError || isWarning) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: classes.graphOverlay
      }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle2",
        style: {
          marginBottom: _Theme.default.spacing(4)
        }
      }, state.displayError || 'An unknown error occurred; unable to visualize data product'), /*#__PURE__*/_react.default.createElement(_Error.default, {
        fontSize: "large",
        className: classes[isError ? 'errorIcon' : 'warningIcon']
      }));
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
        title = "".concat(title, " (").concat(progress, "%)");
      }
      return /*#__PURE__*/_react.default.createElement("div", {
        className: classes.graphOverlay
      }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle2",
        style: {
          marginBottom: _Theme.default.spacing(4)
        }
      }, title), /*#__PURE__*/_react.default.createElement(_CircularProgress.default, progressProps));
    }
    return null;
  };

  // function complements of Battelle ANNI
  // move to 'helper' file if one exists
  const addThousandsSeparator = numStr => {
    /* eslint-disable */
    if (!numStr) {
      return '0';
    }
    const numStrString = numStr.toString();
    let [integer, decimal] = numStrString.split('.');
    let result = '';
    let count = 0;

    // Process integer part from right to left
    for (let i = integer.length - 1; i >= 0; i--) {
      result = integer[i] + result;
      count += 1;
      // Add comma after every 3 digits, except at the start
      if (count % 3 === 0 && i !== 0) {
        result = ',' + result;
      }
    }

    // Reattach decimal part if present
    return decimal ? "".concat(result, ".").concat(decimal) : result;
  };
  const renderStatusBar = () => {
    let showWarning = false;
    const pointTotal = state.status !== _constants.TIME_SERIES_VIEWER_STATUS.READY ? '--' : addThousandsSeparator(state.pointTotal);
    if (_TimeSeriesViewerContext.default.calcPredictedPointsForNewPosition(state) > _TimeSeriesViewerContext.POINTS_PERFORMANCE_LIMIT || _TimeSeriesViewerContext.default.calcPredictedPointsForNewVariable(state) > _TimeSeriesViewerContext.POINTS_PERFORMANCE_LIMIT) {
      showWarning = true;
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.statusBar
    }, /*#__PURE__*/_react.default.createElement(_Computer.default, {
      fontSize: "medium"
    }), /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement("b", null, "Data Points"), ":\xA0"), pointTotal, /*#__PURE__*/_react.default.createElement("span", null, " of "), addThousandsSeparator(_TimeSeriesViewerContext.POINTS_PERFORMANCE_LIMIT), /*#__PURE__*/_react.default.createElement("span", {
      className: "warningMessage",
      style: {
        visibility: showWarning ? 'visible' : 'hidden'
      }
    }, /*#__PURE__*/_react.default.createElement(_Warning.default, {
      fontSize: "medium"
    }), "Data point total approaching limit; some options are disabled."));
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/_react.default.createElement(_Card.default, {
    className: classes.graphContainer
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      position: 'relative'
    }
  }, state.product.productCode === loadedProductCode ? /*#__PURE__*/_react.default.createElement(_TimeSeriesViewerGraph.default, null) : null, renderGraphOverlay()), renderStatusBar(), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.tabsContainer
  }, renderTabs(), renderTabPanels())));
}