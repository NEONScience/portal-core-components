"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TimeSeriesViewerContainer;

var _react = _interopRequireWildcard(require("react"));

var _moment = _interopRequireDefault(require("moment"));

var _styles = require("@material-ui/core/styles");

var _ExpansionPanel = _interopRequireDefault(require("@material-ui/core/ExpansionPanel"));

var _ExpansionPanelSummary = _interopRequireDefault(require("@material-ui/core/ExpansionPanelSummary"));

var _ExpansionPanelDetails = _interopRequireDefault(require("@material-ui/core/ExpansionPanelDetails"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Place = _interopRequireDefault(require("@material-ui/icons/Place"));

var _DateRange = _interopRequireDefault(require("@material-ui/icons/DateRange"));

var _ShowChart = _interopRequireDefault(require("@material-ui/icons/ShowChart"));

var _Settings = _interopRequireDefault(require("@material-ui/icons/Settings"));

var _TimeSeriesViewerContext = _interopRequireDefault(require("./TimeSeriesViewerContext"));

var _TimeSeriesViewerSites = _interopRequireDefault(require("./TimeSeriesViewerSites"));

var _TimeSeriesViewerDateRange = _interopRequireDefault(require("./TimeSeriesViewerDateRange"));

var _TimeSeriesViewerVariables = _interopRequireDefault(require("./TimeSeriesViewerVariables"));

var _TimeSeriesViewerOptions = _interopRequireDefault(require("./TimeSeriesViewerOptions"));

var _TimeSeriesViewerGraph = _interopRequireDefault(require("./TimeSeriesViewerGraph"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/*
const preStyle = {
  whiteSpace: 'pre-wrap',
  border: '1px solid black',
  padding: '2px',
  overflowY: 'scroll',
};
*/
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    panelSummary: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-arround'
    },
    panelSummaryTitleContainer: {
      flexGrow: 0,
      display: 'flex',
      alignItems: 'center',
      paddingRight: theme.spacing(1)
    },
    panelSummarySummaryContainer: {
      flexGrow: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      color: _Theme.default.palette.grey[400]
    }
  };
});
/**
   Expansion Panel styled components
*/

var ExpansionPanel = (0, _styles.withStyles)({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0
    },
    '&:before': {
      display: 'none'
    },
    '&$expanded': {
      margin: 'auto'
    }
  },
  expanded: {}
})(_ExpansionPanel.default);
var ExpansionPanelSummary = (0, _styles.withStyles)({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    '&$expanded': {
      minHeight: 56
    }
  },
  content: {
    '&$expanded': {
      margin: _Theme.default.spacing(1.5, 0)
    }
  },
  expanded: {}
})(_ExpansionPanelSummary.default);
var ExpansionPanelDetails = (0, _styles.withStyles)({
  root: {
    padding: _Theme.default.spacing(2)
  }
})(_ExpansionPanelDetails.default);
/**
   Define Panels
*/

var PANELS = {
  SITES: {
    title: 'Sites',
    Icon: _Place.default,
    Component: _TimeSeriesViewerSites.default
  },
  DATE_RANGE: {
    title: 'Date Range',
    Icon: _DateRange.default,
    Component: _TimeSeriesViewerDateRange.default
  },
  VARIABLES: {
    title: 'Variables',
    Icon: _ShowChart.default,
    Component: _TimeSeriesViewerVariables.default
  },
  OPTIONS: {
    title: 'Options',
    Icon: _Settings.default,
    Component: _TimeSeriesViewerOptions.default
  }
};

function TimeSeriesViewerContainer() {
  var classes = useStyles(_Theme.default);

  var _TimeSeriesViewerCont = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont2 = _slicedToArray(_TimeSeriesViewerCont, 1),
      state = _TimeSeriesViewerCont2[0];

  var initialPanel = 'OPTIONS';

  var _useState = (0, _react.useState)(initialPanel),
      _useState2 = _slicedToArray(_useState, 2),
      expandedPanel = _useState2[0],
      setExpandedPanel = _useState2[1]; // Slider position is not controlled in state because doing so kills mouse drag performance.
  // Use a ref to deterministically set slider position for all slider-based features.


  var dateRangeSliderRef = (0, _react.useRef)(null);

  var renderPanelComponent = function renderPanelComponent(panelId) {
    if (!Object.keys(PANELS).includes(panelId)) {
      return null;
    }

    var PanelComponent = PANELS[panelId].Component;
    var panelComponentProps = {};

    if (panelId === 'DATE_RANGE') {
      panelComponentProps = {
        dateRangeSliderRef: dateRangeSliderRef
      };
    }

    return _react.default.createElement(PanelComponent, panelComponentProps);
  };

  var getSitesSummary = function getSitesSummary() {
    var sites = state.selection.sites;
    return sites.map(function (site) {
      var siteCode = site.siteCode,
          positions = site.positions;
      return _react.default.createElement("div", {
        key: siteCode
      }, "".concat(siteCode, " - ").concat(positions.join(', ')));
    });
  };

  var getDateRangeSummary = function getDateRangeSummary() {
    var pluralize = function pluralize(val, unit) {
      return val === 1 ? "".concat(val, " ").concat(unit) : "".concat(val, " ").concat(unit, "s");
    };

    var startMoment = (0, _moment.default)("".concat(state.selection.dateRange[0], "-15"));
    var endMoment = (0, _moment.default)("".concat(state.selection.dateRange[1], "-15"));
    var months = Math.ceil(endMoment.diff(startMoment, 'months', true)) + 1;
    var years = Math.floor(months / 12);
    var diff = "".concat(pluralize(months, 'month'));

    if (years > 0) {
      diff = !(months % 12) ? "".concat(pluralize(years, 'year')) : "".concat(pluralize(years, 'year'), ", ").concat(pluralize(months % 12, 'month'));
    }

    return "".concat(startMoment.format('MMM YYYY'), " - ").concat(endMoment.format('MMM YYYY'), " (").concat(diff, ")");
  };

  var getVariablesSummary = function getVariablesSummary() {
    return state.selection.variables.join(', ');
  };

  var getOptionsSummary = function getOptionsSummary() {
    return null;
  };

  var renderPanelContentSummary = function renderPanelContentSummary(panelId) {
    switch (panelId) {
      case 'SITES':
        return getSitesSummary();

      case 'DATE_RANGE':
        return getDateRangeSummary();

      case 'VARIABLES':
        return getVariablesSummary();

      case 'OPTIONS':
        return getOptionsSummary();

      default:
        return _react.default.createElement("i", null, "...");
    }
  };

  return _react.default.createElement("div", {
    style: {
      width: '100%'
    }
  }, _react.default.createElement("b", null, state.status), _react.default.createElement(_TimeSeriesViewerGraph.default, null), _react.default.createElement("br", null), Object.keys(PANELS).map(function (panelId) {
    var panel = PANELS[panelId];
    var isExpanded = expandedPanel === panelId;
    var PanelIcon = PANELS[panelId].Icon;
    return _react.default.createElement(ExpansionPanel, {
      square: true,
      key: panelId,
      expanded: isExpanded,
      onChange: function onChange() {
        setExpandedPanel(isExpanded ? null : panelId);
      }
    }, _react.default.createElement(ExpansionPanelSummary, {
      id: "".concat(panelId, "-header"),
      "aria-controls": "".concat(panelId, "-content"),
      className: classes.panelSummary
    }, _react.default.createElement("div", {
      className: classes.panelSummaryTitleContainer
    }, _react.default.createElement(PanelIcon, {
      style: {
        marginRight: _Theme.default.spacing(1)
      },
      color: isExpanded ? 'primary' : 'action'
    }), _react.default.createElement(_Typography.default, {
      style: {
        fontWeight: 700,
        color: isExpanded ? _Theme.default.palette.primary.main : _Theme.default.palette.grey[400]
      }
    }, panel.title)), _react.default.createElement("div", {
      className: classes.panelSummarySummaryContainer
    }, renderPanelContentSummary(panelId))), _react.default.createElement(ExpansionPanelDetails, null, renderPanelComponent(panelId)));
  }));
}