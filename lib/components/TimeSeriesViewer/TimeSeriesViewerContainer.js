"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));

var _Theme = _interopRequireWildcard(require("../Theme/Theme"));

var _TimeSeriesViewerContext = _interopRequireWildcard(require("./TimeSeriesViewerContext"));

var _TimeSeriesViewerSites = _interopRequireDefault(require("./TimeSeriesViewerSites"));

var _TimeSeriesViewerDateRange = _interopRequireDefault(require("./TimeSeriesViewerDateRange"));

var _TimeSeriesViewerVariables = _interopRequireDefault(require("./TimeSeriesViewerVariables"));

var _TimeSeriesViewerAxes = _interopRequireDefault(require("./TimeSeriesViewerAxes"));

var _TimeSeriesViewerGraph = _interopRequireDefault(require("./TimeSeriesViewerGraph"));

var _TABS;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// We can't rely on flex-sizing to work during resize events as some components within tabs
// won't be able to shrink correctly on resize (notably: Data Product Availability charts).
var VERTICAL_TABS_WIDTH = 150;
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    tabsContainer: _defineProperty({
      display: 'flex',
      margin: theme.spacing(0, -0.5, -0.5, -0.5)
    }, theme.breakpoints.down('sm'), {
      flexDirection: 'column'
    }),
    tabsVertical: {
      width: "".concat(VERTICAL_TABS_WIDTH, "px")
    },
    tabsHorizontal: {
      flexShrink: 0
    },
    tabPanels: _defineProperty({
      width: '100%'
    }, theme.breakpoints.up('md'), {
      width: "calc(100% - ".concat(VERTICAL_TABS_WIDTH, "px)"),
      borderTop: "1.5px solid ".concat(_Theme.COLORS.GREY[200])
    }),
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
      backgroundColor: 'rgba(255, 255, 255, 0.75)'
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
    }
  };
});
var useTabsStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    scroller: _defineProperty({}, theme.breakpoints.up('md'), {
      backgroundColor: theme.palette.grey[200]
    })
  };
});
var useTabStyles = (0, _styles.makeStyles)(function (theme) {
  var _root, _selected;

  return {
    root: (_root = {}, _defineProperty(_root, theme.breakpoints.up('md'), {
      marginLeft: '-1.5px',
      '&:first-child': {
        marginBottom: '-0.5px'
      },
      '&:not(:first-child)': {
        marginTop: '-1.5px'
      }
    }), _defineProperty(_root, theme.breakpoints.down('sm'), {
      paddingRight: theme.spacing(2.5),
      '&:not(:first-child)': {
        marginLeft: '-1.5px'
      }
    }), _defineProperty(_root, "textTransform", 'none'), _defineProperty(_root, "opacity", 1), _root),
    labelIcon: _defineProperty({
      minHeight: theme.spacing(8),
      minWidth: theme.spacing(15)
    }, theme.breakpoints.down('sm'), {
      minHeight: theme.spacing(6),
      minWidth: theme.spacing(17)
    }),
    wrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      '& svg': {
        margin: "".concat(theme.spacing(0, 1, 0, 0), " !important")
      }
    },
    selected: (_selected = {}, _defineProperty(_selected, theme.breakpoints.down('sm'), {
      borderBottom: 'none'
    }), _defineProperty(_selected, theme.breakpoints.up('md'), {
      borderRight: 'none',
      marginLeft: '0px'
    }), _selected)
  };
});
/**
   Summary Component
*/

function TimeSeriesViewerSummary() {
  var classes = useStyles(_Theme.default);

  var _TimeSeriesViewerCont = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont2 = _slicedToArray(_TimeSeriesViewerCont, 1),
      state = _TimeSeriesViewerCont2[0];

  var _state$selection = state.selection,
      sites = _state$selection.sites,
      dateRange = _state$selection.dateRange,
      variables = _state$selection.variables,
      timeStep = _state$selection.timeStep,
      autoTimeStep = _state$selection.autoTimeStep,
      logscale = _state$selection.logscale,
      qualityFlags = _state$selection.qualityFlags,
      rollPeriod = _state$selection.rollPeriod,
      yAxes = _state$selection.yAxes;
  var skeletonProps = {
    variant: 'rect',
    height: 10,
    style: {
      marginTop: '4px',
      marginBottom: '12px'
    }
  }; // Product

  var productHref = "".concat(_NeonEnvironment.default.getHost(), "/data-products/").concat(state.product.productCode);

  var productSummaryTitle = /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6"
  }, "Data Product"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2"
  }, state.product.productCode));

  var productSummaryDescription = /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Skeleton.default, _extends({}, skeletonProps, {
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
  } // Sites


  var sitesSummary = !sites.length ? /*#__PURE__*/_react.default.createElement(_Skeleton.default, _extends({}, skeletonProps, {
    width: 175
  })) : sites.map(function (site) {
    var siteCode = site.siteCode,
        positions = site.positions;
    return /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2",
      key: siteCode
    }, "".concat(siteCode, " - ").concat(positions.join(', ')));
  }); // Date Range

  var dateRangeSummary = /*#__PURE__*/_react.default.createElement(_Skeleton.default, _extends({}, skeletonProps, {
    width: 300
  }));

  if (dateRange.length === 2 && dateRange[0] && dateRange[1]) {
    var pluralize = function pluralize(val, unit) {
      return val === 1 ? "".concat(val, " ").concat(unit) : "".concat(val, " ").concat(unit, "s");
    };

    var startMoment = (0, _moment.default)("".concat(dateRange[0], "-15"));
    var endMoment = (0, _moment.default)("".concat(dateRange[1], "-15"));
    var months = Math.ceil(endMoment.diff(startMoment, 'months', true)) + 1;
    var years = Math.floor(months / 12);
    var diff = "".concat(pluralize(months, 'month'));

    if (years > 0) {
      diff = !(months % 12) ? "".concat(pluralize(years, 'year')) : "".concat(pluralize(years, 'year'), ", ").concat(pluralize(months % 12, 'month'));
    }

    dateRangeSummary = /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2"
    }, "".concat(startMoment.format('MMM YYYY'), " - ").concat(endMoment.format('MMM YYYY'), " (").concat(diff, ")"));
  } // Variables


  var variablesSummary = !variables.length ? /*#__PURE__*/_react.default.createElement(_Skeleton.default, _extends({}, skeletonProps, {
    width: 250
  })) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2"
  }, variables.join(', ')), qualityFlags.length > 0 ? /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2"
  }, "Quality flags: ".concat(qualityFlags.join(', '))) : null); // Axes

  var axes = {
    x: [],
    y1: [],
    y2: []
  };
  var currentTimeStep = timeStep === 'auto' ? "Auto (".concat(autoTimeStep, ")") : timeStep;
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

  Object.keys(yAxes).forEach(function (yAxis) {
    if (yAxes[yAxis].units !== null) {
      axes[yAxis].push({
        title: 'Scale',
        value: logscale ? 'Logarithmic' : 'Linear'
      });
      axes[yAxis].push({
        title: 'Units',
        value: yAxes[yAxis].units
      });
      var rangeMode = _TimeSeriesViewerContext.Y_AXIS_RANGE_MODE_DETAILS[yAxes[yAxis].rangeMode].name;
      var range = "".concat(rangeMode, " (").concat(yAxes[yAxis].axisRange[0].toString(), " \u2013 ").concat(yAxes[yAxis].axisRange[1].toString(), " ").concat(yAxes[yAxis].units, ")");
      axes[yAxis].push({
        title: 'Range',
        value: range
      });
    }
  });

  var renderAxisSetting = function renderAxisSetting(setting) {
    return /*#__PURE__*/_react.default.createElement("div", {
      key: setting.title,
      style: {
        marginRight: _Theme.default.spacing(2),
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: classes.axisSettingTitle
    }, "".concat(setting.title, ":")), setting.value);
  };

  var axesSummary = /*#__PURE__*/_react.default.createElement(_Table.default, {
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


var TAB_IDS = {
  SUMMARY: 'SUMMARY',
  SITES: 'SITES',
  DATE_RANGE: 'DATE_RANGE',
  VARIABLES: 'VARIABLES',
  AXES: 'AXES'
};
var TABS = (_TABS = {}, _defineProperty(_TABS, TAB_IDS.SUMMARY, {
  label: 'SUMMARY',
  ariaLabel: 'Summary',
  Icon: _Toc.default,
  Component: TimeSeriesViewerSummary
}), _defineProperty(_TABS, TAB_IDS.SITES, {
  // eslint-disable-next-line react/jsx-one-expression-per-line
  label: /*#__PURE__*/_react.default.createElement("span", null, "SITES &", /*#__PURE__*/_react.default.createElement("br", null), "POSITIONS"),
  ariaLabel: 'Sites and Positions',
  Icon: _Place.default,
  Component: _TimeSeriesViewerSites.default
}), _defineProperty(_TABS, TAB_IDS.DATE_RANGE, {
  label: 'DATE RANGE',
  ariaLabel: 'Date Range',
  Icon: _DateRange.default,
  Component: _TimeSeriesViewerDateRange.default
}), _defineProperty(_TABS, TAB_IDS.VARIABLES, {
  label: 'VARIABLES',
  ariaLabel: 'Variables',
  Icon: _Timeline.default,
  Component: _TimeSeriesViewerVariables.default
}), _defineProperty(_TABS, TAB_IDS.AXES, {
  label: 'x/y AXES',
  ariaLabel: 'x/y Axes',
  Icon: _BorderInner.default,
  Component: _TimeSeriesViewerAxes.default
}), _TABS);
var DEFAULT_TAB = 'SUMMARY';

function TimeSeriesViewerContainer() {
  var classes = useStyles(_Theme.default);
  var tabClasses = useTabStyles(_Theme.default);
  var tabsClasses = useTabsStyles(_Theme.default);

  var _TimeSeriesViewerCont3 = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont4 = _slicedToArray(_TimeSeriesViewerCont3, 1),
      state = _TimeSeriesViewerCont4[0];

  var belowMd = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('sm')); // console.log('TIME SERIES VIEWER STATE:', state);

  var initialTab = DEFAULT_TAB;

  var _useState = (0, _react.useState)(initialTab),
      _useState2 = _slicedToArray(_useState, 2),
      selectedTab = _useState2[0],
      setSelectedTab = _useState2[1];

  var _useState3 = (0, _react.useState)(state.product.productCode),
      _useState4 = _slicedToArray(_useState3, 2),
      loadedProductCode = _useState4[0],
      setLoadedProductCode = _useState4[1]; // Effect to handle a reinitialize event from the context. We track the loaded product code
  // separate from the context product code so when the latter changes we know to reset the
  // tab to SUMMARY and completely unmount and remount the TimeSeriesGraph.


  (0, _react.useEffect)(function () {
    if (state.product.productCode === loadedProductCode) {
      return;
    }

    setLoadedProductCode(state.product.productCode);
    setSelectedTab(DEFAULT_TAB);
  }, [state.product.productCode, loadedProductCode, setSelectedTab]); // Slider position is not controlled in state because doing so kills mouse drag performance.
  // Use a ref to deterministically set slider position for all slider-based features.

  var dateRangeSliderRef = (0, _react.useRef)(null);

  var renderTabs = function renderTabs() {
    return /*#__PURE__*/_react.default.createElement(_Tabs.default, {
      orientation: belowMd ? 'horizontal' : 'vertical',
      scrollButtons: belowMd ? 'on' : 'auto',
      variant: "scrollable",
      value: selectedTab,
      className: belowMd ? classes.tabsHorizontal : classes.tabsVertical,
      classes: tabsClasses,
      "aria-label": "Time Series Viewer Controls",
      onChange: function onChange(event, newTab) {
        setSelectedTab(newTab);
      },
      TabIndicatorProps: {
        style: {
          display: 'none'
        }
      }
    }, Object.keys(TABS).map(function (tabId) {
      var _TABS$tabId = TABS[tabId],
          label = _TABS$tabId.label,
          ariaLabel = _TABS$tabId.ariaLabel,
          TabIcon = _TABS$tabId.Icon;
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
  };

  var renderTabPanels = function renderTabPanels() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.tabPanels
    }, Object.keys(TABS).map(function (tabId) {
      var TabComponent = TABS[tabId].Component;
      var tabComponentProps = {
        setSelectedTab: setSelectedTab,
        TAB_IDS: TAB_IDS
      };

      if (tabId === TAB_IDS.DATE_RANGE) {
        tabComponentProps = {
          dateRangeSliderRef: dateRangeSliderRef
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
  };

  var renderGraphOverlay = function renderGraphOverlay() {
    var isError = state.status === _TimeSeriesViewerContext.TIME_SERIES_VIEWER_STATUS.ERROR;
    var isLoading = !isError && state.status !== _TimeSeriesViewerContext.TIME_SERIES_VIEWER_STATUS.READY;

    if (isError) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: classes.graphOverlay
      }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle2",
        style: {
          marginBottom: _Theme.default.spacing(4)
        }
      }, state.displayError || 'An unknown error occurred; unable to visualize data product'), /*#__PURE__*/_react.default.createElement(_Error.default, {
        fontSize: "large",
        color: "error"
      }));
    }

    var isLoadingData = isLoading && state.status === _TimeSeriesViewerContext.TIME_SERIES_VIEWER_STATUS.LOADING_DATA;

    if (isLoading) {
      var title = _TimeSeriesViewerContext.TIME_SERIES_VIEWER_STATUS_TITLES[state.status] || 'Loading…';
      var progressProps = {
        variant: 'indeterminate'
      };

      if (isLoadingData) {
        var progress = Math.floor(state.dataFetchProgress || 0);
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
  }, state.product.productCode === loadedProductCode ? /*#__PURE__*/_react.default.createElement(_TimeSeriesViewerGraph.default, null) : null, renderGraphOverlay()), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.tabsContainer
  }, renderTabs(), renderTabPanels())));
}