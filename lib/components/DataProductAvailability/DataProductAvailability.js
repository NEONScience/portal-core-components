"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DataProductAvailability;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = require("lodash");

var _styles = require("@material-ui/core/styles");

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _FormControl = _interopRequireDefault(require("@material-ui/core/FormControl"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _Hidden = _interopRequireDefault(require("@material-ui/core/Hidden"));

var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));

var _OutlinedInput = _interopRequireDefault(require("@material-ui/core/OutlinedInput"));

var _Select = _interopRequireDefault(require("@material-ui/core/Select"));

var _ToggleButton = _interopRequireDefault(require("@material-ui/lab/ToggleButton"));

var _ToggleButtonGroup = _interopRequireDefault(require("@material-ui/lab/ToggleButtonGroup"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _ExpandMore = _interopRequireDefault(require("@material-ui/icons/ExpandMore"));

var _ExpandLess = _interopRequireDefault(require("@material-ui/icons/ExpandLess"));

var _ArrowDownward = _interopRequireDefault(require("@material-ui/icons/ArrowDownward"));

var _ArrowUpward = _interopRequireDefault(require("@material-ui/icons/ArrowUpward"));

var _pickers = require("@material-ui/pickers");

var _moment = _interopRequireDefault(require("@date-io/moment"));

var _moment2 = _interopRequireDefault(require("moment"));

var _AvailabilityGrid = require("./AvailabilityGrid");

var _AvailabilityLegend = _interopRequireDefault(require("./AvailabilityLegend"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _SiteChip = _interopRequireDefault(require("../SiteChip/SiteChip"));

var _FullWidthVisualization = _interopRequireDefault(require("../FullWidthVisualization/FullWidthVisualization"));

var _DownloadDataContext = _interopRequireDefault(require("../DownloadDataContext/DownloadDataContext"));

var _sites = _interopRequireDefault(require("../../static/sites/sites.json"));

var _states = _interopRequireDefault(require("../../static/states/states.json"));

var _domains = _interopRequireDefault(require("../../static/domains/domains.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var getYearMonthMoment = function getYearMonthMoment(yearMonth) {
  return (0, _moment2.default)("".concat(yearMonth, "-01"));
};
/**
   Setup: CSS classes
*/


var svgMinWidth = (_AvailabilityGrid.SVG.CELL_WIDTH + _AvailabilityGrid.SVG.CELL_PADDING) * _AvailabilityGrid.SVG.MIN_CELLS + Math.floor(_AvailabilityGrid.SVG.MIN_CELLS / 12) * _AvailabilityGrid.SVG.YEAR_PADDING;

var svgMinHeight = (_AvailabilityGrid.SVG.CELL_HEIGHT + _AvailabilityGrid.SVG.CELL_PADDING) * (_AvailabilityGrid.SVG.MIN_ROWS + 1);
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    viewButtonGroup: {
      height: theme.spacing(4)
    },
    viewButtonGroupXsmall: {
      height: theme.spacing(3)
    },
    viewButton: {
      height: theme.spacing(4),
      fontWeight: 700,
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
      padding: theme.spacing(0, 2),
      whiteSpace: 'nowrap'
    },
    viewButtonXsmall: {
      height: theme.spacing(3),
      fontWeight: 600,
      padding: theme.spacing(0, 1.5)
    },
    // Use !important here to override the Mui-selected class with higher priority
    viewButtonSelected: {
      color: '#fff !important',
      backgroundColor: "".concat(theme.palette.primary.main, " !important")
    },
    svg: {
      minWidth: "".concat(svgMinWidth, "px"),
      minHeight: "".concat(svgMinHeight, "px")
    },
    topFormHeader: {
      display: 'flex',
      alignItems: 'center'
    },
    h5Small: {
      fontSize: '1.075rem'
    },
    h6Small: {
      fontSize: '0.95rem'
    },
    xsSelect: {
      '& div': {
        padding: _Theme.default.spacing(1, 3, 1, 1.5)
      }
    },
    sortSelect: {
      height: theme.spacing(6),
      '& div': {
        paddingRight: _Theme.default.spacing(4.5)
      }
    },
    sortToggleButtonGroup: {
      marginLeft: theme.spacing(2)
    }
  };
});
var useSiteChipStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    deleteIcon: {
      marginLeft: theme.spacing(-0.25)
    }
  };
});
var SORT_METHODS = {
  states: {
    label: 'by State',
    getSortFunction: function getSortFunction(ret) {
      return function (a, b) {
        var aState = _states.default[_sites.default[a].stateCode].name;
        var bState = _states.default[_sites.default[b].stateCode].name;

        if (aState === bState) {
          return a < b ? ret[0] : ret[1];
        }

        return aState < bState ? ret[0] : ret[1];
      };
    }
  },
  domains: {
    label: 'by Domain',
    getSortFunction: function getSortFunction(ret) {
      return function (a, b) {
        var aDomain = _sites.default[a].domainCode;
        var bDomain = _sites.default[b].domainCode;

        if (aDomain === bDomain) {
          return a < b ? ret[0] : ret[1];
        }

        return aDomain < bDomain ? ret[0] : ret[1];
      };
    }
  },
  sites: {
    label: 'by Site',
    getSortFunction: function getSortFunction(ret) {
      return function (a, b) {
        return a < b ? ret[0] : ret[1];
      };
    }
  }
};
var SORT_DIRECTIONS = ['ASC', 'DESC'];
/**
   Main Function
*/

function DataProductAvailability(props) {
  var classes = useStyles(_Theme.default);
  var siteChipClasses = useSiteChipStyles(_Theme.default);

  var other = _extends({}, props);

  var belowSm = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('sm'));
  /**
     State: Views
     Contain and sort the availability data.
     Afford different methods for presenting/grouping data along the y-axis (geospatial)
  */

  var views = {
    summary: {
      view: 'summary',
      name: 'Summary',
      selectable: true,
      rows: {
        summary: {}
      },
      getLabel: {
        text: function text() {
          return 'ALL ';
        },
        title: function title() {
          return 'All Sites';
        }
      }
    },
    sites: {
      view: 'sites',
      name: 'Site',
      selectable: true,
      rows: {},
      getLabel: {
        text: function text(key) {
          return key;
        },
        title: function title(key) {
          return _sites.default[key].description;
        }
      }
    },
    states: {
      view: 'states',
      name: 'State',
      selectable: true,
      rows: {},
      getLabel: {
        text: function text(key) {
          return " ".concat(key, " ");
        },
        title: function title(key) {
          return _states.default[key].name;
        }
      }
    },
    domains: {
      view: 'domains',
      name: 'Domain',
      selectable: true,
      rows: {},
      getLabel: {
        text: function text(key) {
          return "".concat(key, " ");
        },
        title: function title(key) {
          return _domains.default[key].name;
        }
      }
    },
    ungrouped: {
      view: 'ungrouped',
      name: 'Ungrouped',
      selectable: false,
      getLabel: {
        text: function text(key) {
          return "".concat(_sites.default[key].stateCode, "-").concat(_sites.default[key].domainCode, "-").concat(key);
        },
        title: function title(key) {
          var siteTitle = _sites.default[key].description;
          var domainTitle = _domains.default[_sites.default[key].domainCode].name;
          var stateTitle = _states.default[_sites.default[key].stateCode].name;
          return "".concat(stateTitle, " - ").concat(domainTitle, " - ").concat(siteTitle);
        }
      }
    }
  };
  views.ungrouped.rows = views.sites.rows;
  var selectableViewKeys = Object.keys(views).filter(function (key) {
    return views[key].selectable;
  });
  /**
     State: Context-Derived Stuff
  */

  var _DownloadDataContext$ = _DownloadDataContext.default.useDownloadDataState(),
      _DownloadDataContext$2 = _slicedToArray(_DownloadDataContext$, 2),
      _DownloadDataContext$3 = _DownloadDataContext$2[0],
      downloadContextIsActive = _DownloadDataContext$3.downloadContextIsActive,
      requiredSteps = _DownloadDataContext$3.requiredSteps,
      productData = _DownloadDataContext$3.productData,
      sites = _DownloadDataContext$3.sites,
      dateRange = _DownloadDataContext$3.dateRange,
      contextView = _DownloadDataContext$3.availabilityView,
      contextSortMethod = _DownloadDataContext$3.availabilitySortMethod,
      contextSortDirection = _DownloadDataContext$3.availabilitySortDirection,
      selectionExpanded = _DownloadDataContext$3.availabilitySelectionExpanded,
      dispatchSelection = _DownloadDataContext$2[1];

  var selectionEnabled = requiredSteps.some(function (step) {
    return step.key === 'sitesAndDateRange';
  });
  /**
     State: Current View
     Track the current view as local state and feed its initial value from the
     initialView prop. This covers the use case when the availability chart does
     NOT appear inside a Download Data Context. When in a context, however, the
     context overrides the current view as it is keeping track of the broader
     download workflow state.
  */

  var propsView = props.view;
  var initialView = downloadContextIsActive ? contextView : propsView;

  var _useState = (0, _react.useState)(initialView),
      _useState2 = _slicedToArray(_useState, 2),
      currentView = _useState2[0],
      setCurrentView = _useState2[1];
  /**
     State: Current Sort Method and Sort Direction
     Only applies for "ungrouped" view mode.
  */


  var propsSortMethod = props.sortMethod;
  var initialSortMethod = (downloadContextIsActive ? contextSortMethod : propsSortMethod) || 'states';

  var _useState3 = (0, _react.useState)(initialSortMethod),
      _useState4 = _slicedToArray(_useState3, 2),
      currentSortMethod = _useState4[0],
      setCurrentSortMethod = _useState4[1];

  var propsSortDirection = props.sortDirection;
  var initialSortDirection = (downloadContextIsActive ? contextSortDirection : propsSortDirection) || 'ASC';

  var _useState5 = (0, _react.useState)(initialSortDirection),
      _useState6 = _slicedToArray(_useState5, 2),
      currentSortDirection = _useState6[0],
      setCurrentSortDirection = _useState6[1];

  var setSitesValue = (0, _react.useCallback)(function (sitesValue) {
    return dispatchSelection({
      type: 'setValidatableValue',
      key: 'sites',
      value: sitesValue
    });
  }, [dispatchSelection]);
  var setDateRangeValue = (0, _react.useCallback)(function (dateRangeValue) {
    return dispatchSelection({
      type: 'setValidatableValue',
      key: 'dateRange',
      value: dateRangeValue
    });
  }, [dispatchSelection]);

  var handleSelectAllSites = function handleSelectAllSites() {
    setSitesValue(sites.validValues);
  };

  var handleSelectNoneSites = function handleSelectNoneSites() {
    setSitesValue([]);
  };

  var handleSelectAllDateRange = function handleSelectAllDateRange() {
    setDateRangeValue(dateRange.validValues);
  };

  var handleSelectLatestYearDateRange = function handleSelectLatestYearDateRange() {
    var start = getYearMonthMoment(dateRange.validValues[1]).subtract(11, 'months').format('YYYY-MM');
    setDateRangeValue([start < dateRange.validValues[0] ? dateRange.validValues[0] : start, dateRange.validValues[1]]);
  };

  var handleChangeStartDate = function handleChangeStartDate(newStartDate) {
    setDateRangeValue([newStartDate.format('YYYY-MM'), dateRange.value[1]]);
  };

  var handleChangeEndDate = function handleChangeEndDate(newEndDate) {
    setDateRangeValue([dateRange.value[0], newEndDate.format('YYYY-MM')]);
  };

  var handleToggleSelectionExpanded = function handleToggleSelectionExpanded(currentSelectionExpanded) {
    return dispatchSelection({
      type: 'setAvailabilitySelectionExpanded',
      value: !currentSelectionExpanded
    });
  };

  var handleChangeView = function handleChangeView(event, newView) {
    if (!selectableViewKeys.includes(newView) || currentView === newView) {
      return;
    }

    if (downloadContextIsActive) {
      dispatchSelection({
        type: 'setAvailabilityView',
        value: newView
      });
    }

    setCurrentView(newView);
  };

  var sortedSites = [];

  var applySort = function applySort() {
    if (currentView !== 'ungrouped') {
      return;
    }

    var sortReturns = [currentSortDirection === 'ASC' ? -1 : 1, currentSortDirection === 'ASC' ? 1 : -1];
    sortedSites = Object.keys(views.ungrouped.rows);
    sortedSites.sort(SORT_METHODS[currentSortMethod].getSortFunction(sortReturns));
  };

  var handleChangeSortMethod = function handleChangeSortMethod(event) {
    var newSortMethod = event.target.value;

    if (!Object.keys(SORT_METHODS).includes(newSortMethod) || currentSortMethod === newSortMethod) {
      return;
    }

    if (downloadContextIsActive) {
      dispatchSelection({
        type: 'setAvailabilitySortMethod',
        value: newSortMethod
      });
    }

    setCurrentSortMethod(newSortMethod);
    applySort();
  };

  var handleChangeSortDirection = function handleChangeSortDirection(event, newSortDirection) {
    if (!SORT_DIRECTIONS.includes(newSortDirection) || currentSortDirection === newSortDirection) {
      return;
    }

    if (downloadContextIsActive) {
      dispatchSelection({
        type: 'setAvailabilitySortDirection',
        value: newSortDirection
      });
    }

    setCurrentSortDirection(newSortDirection);
    applySort();
  };
  /**
     Product Data: Map to Views
     Statically loaded in via props or pulled from context.
     Should not change in render lifecycle.
     Create mappings of the shape row => year-month => status for
     all aggregation views.
     TODO: Add other statuses. Currently the only status is "available".
  */


  var siteCodes;

  if (selectionEnabled) {
    siteCodes = productData.siteCodes;
  } else {
    siteCodes = props.siteCodes;
  }

  siteCodes.forEach(function (site) {
    var siteCode = site.siteCode,
        availableMonths = site.availableMonths;
    var _allSites$siteCode = _sites.default[siteCode],
        stateCode = _allSites$siteCode.stateCode,
        domainCode = _allSites$siteCode.domainCode;

    if (!selectionEnabled) {
      sites.validValues.push(siteCode);
    }

    views.sites.rows[siteCode] = {};
    views.states.rows[stateCode] = views.states.rows[stateCode] || {};
    views.domains.rows[domainCode] = views.domains.rows[domainCode] || {};
    availableMonths.forEach(function (month) {
      views.summary.rows.summary[month] = 'available';
      views.sites.rows[siteCode][month] = 'available';
      views.states.rows[stateCode][month] = 'available';
      views.domains.rows[domainCode][month] = 'available';
    });
  });

  if (!selectionEnabled) {
    var summaryMonths = Object.keys(views.summary.rows.summary).sort();
    dateRange.validValues[0] = summaryMonths[0]; // eslint-disable-line prefer-destructuring

    dateRange.validValues[1] = summaryMonths.pop();
  }
  /**
     Selection Collapse
  */


  var disableSelectionCollapse = props.disableSelectionCollapse;
  var absoluteSelectionExpanded = selectionExpanded || disableSelectionCollapse;
  /**
     Redraw setup
  */

  var svgRef = (0, _react.useRef)(null);
  var handleSvgRedraw = (0, _react.useCallback)(function () {
    (0, _AvailabilityGrid.AvailabilityGrid)({
      data: views[currentView],
      svgRef: svgRef,
      sites: sites,
      sortedSites: sortedSites,
      setSitesValue: setSitesValue,
      dateRange: dateRange,
      setDateRangeValue: setDateRangeValue,
      selectionEnabled: selectionEnabled
    });
  }, [svgRef, views, currentView, sites, sortedSites, setSitesValue, dateRange, setDateRangeValue, selectionEnabled]);
  (0, _react.useEffect)(function () {
    applySort();
    handleSvgRedraw();
  });

  var getOptionsContainerStyle = function getOptionsContainerStyle() {
    return selectionEnabled ? {
      textAlign: !absoluteSelectionExpanded && !belowSm ? 'right' : 'left'
    } : {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end'
    };
  };

  var getOptionsTitle = function getOptionsTitle() {
    var variant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'View';

    if (!['View', 'Sort'].includes(variant)) {
      return null;
    }

    return selectionEnabled ? _react.default.createElement("div", {
      style: {
        height: '30px'
      }
    }, _react.default.createElement(_Typography.default, {
      variant: "h5",
      className: classes.h5Small
    }, "".concat(variant, " Availability By"))) : _react.default.createElement(_Typography.default, {
      variant: "subtitle1",
      style: {
        marginRight: _Theme.default.spacing(1.5)
      }
    }, "".concat(variant, " Availability By:"));
  };
  /**
     Render: View Input
  */


  var renderViewOptions = function renderViewOptions() {
    var renderToggleButton = function renderToggleButton(key) {
      var className = classes.viewButton;

      if (!selectionEnabled) {
        className = "".concat(className, " ").concat(classes.viewButtonXsmall);
      }

      if (key === currentView) {
        className = "".concat(className, " ").concat(classes.viewButtonSelected);
      }

      return _react.default.createElement(_ToggleButton.default, {
        key: key,
        value: key,
        size: "small",
        className: className
      }, views[key].name);
    };

    return _react.default.createElement("div", {
      style: getOptionsContainerStyle(),
      "data-selenium": "data-product-availability.view-options"
    }, getOptionsTitle('View'), _react.default.createElement(_Hidden.default, {
      xsDown: true,
      key: "viewSmUp"
    }, _react.default.createElement(_ToggleButtonGroup.default, {
      exclusive: true,
      color: "primary",
      variant: "outlined",
      size: "small",
      className: selectionEnabled ? classes.viewButtonGroup : classes.viewButtonGroupXsmall,
      value: currentView,
      onChange: handleChangeView
    }, selectableViewKeys.map(function (key) {
      return renderToggleButton(key);
    }))), _react.default.createElement(_Hidden.default, {
      smUp: true,
      key: "viewXs"
    }, _react.default.createElement(_FormControl.default, {
      variant: "filled"
    }, _react.default.createElement(_Select.default, {
      value: currentView,
      onChange: function onChange(event) {
        return handleChangeView(event, event.target.value);
      },
      input: _react.default.createElement(_OutlinedInput.default, {
        margin: "dense",
        className: selectionEnabled ? null : classes.xsSelect
      }),
      variant: "filled"
    }, selectableViewKeys.map(function (key) {
      return _react.default.createElement(_MenuItem.default, {
        key: key,
        value: key
      }, views[key].name);
    })))));
  };
  /**
     Render: Sort Options
  */


  var renderSortOptions = function renderSortOptions() {
    return _react.default.createElement("div", {
      style: getOptionsContainerStyle(),
      "data-selenium": "data-product-availability.sort-options"
    }, getOptionsTitle('Sort'), _react.default.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'flex-end'
      }
    }, _react.default.createElement(_FormControl.default, {
      variant: "outlined"
    }, _react.default.createElement(_Select.default, {
      value: currentSortMethod,
      "aria-label": "Sort Method",
      className: classes.sortSelect,
      onChange: handleChangeSortMethod,
      "data-selenium": "data-product-availability.sort-options.method"
    }, Object.keys(SORT_METHODS).map(function (method) {
      return _react.default.createElement(_MenuItem.default, {
        key: method,
        value: method
      }, SORT_METHODS[method].label);
    }))), _react.default.createElement(_ToggleButtonGroup.default, {
      exclusive: true,
      value: currentSortDirection,
      className: classes.sortToggleButtonGroup,
      onChange: handleChangeSortDirection,
      "data-selenium": "data-product-availability.sort-options.direction"
    }, _react.default.createElement(_ToggleButton.default, {
      value: SORT_DIRECTIONS[0],
      "aria-label": "Sort Ascending"
    }, _react.default.createElement(_ArrowDownward.default, null)), _react.default.createElement(_ToggleButton.default, {
      value: SORT_DIRECTIONS[1],
      "aria-label": "Sort Descending"
    }, _react.default.createElement(_ArrowUpward.default, null)))));
  };
  /**
     Render: Selection
  */


  var renderSelection = function renderSelection() {
    if (!selectionEnabled) {
      return null;
    }

    var selectionButtonLabel = absoluteSelectionExpanded ? 'hide selection details' : 'show seleciton details';
    var sitesPlural = sites.value.length > 1 ? 's' : '';
    var humanDateRange = "".concat(getYearMonthMoment(dateRange.value[0]).format('MMM YYYY'), " - ").concat(getYearMonthMoment(dateRange.value[1]).format('MMM YYYY'));
    var siteChipLabel = absoluteSelectionExpanded ? "".concat(sites.value.length, " site").concat(sitesPlural) : "".concat(sites.value.length, " site").concat(sitesPlural, " \u2014 ").concat(humanDateRange);
    var divCollapsedStyle = {
      marginBottom: _Theme.default.spacing(1)
    };
    var divExpandedStyle = {
      marginTop: _Theme.default.spacing(1),
      marginBottom: _Theme.default.spacing(1.5)
    };
    var clickProps = disableSelectionCollapse ? {} : {
      onClick: function onClick() {
        return handleToggleSelectionExpanded(selectionExpanded);
      }
    };

    var siteChip = _react.default.createElement("div", {
      style: absoluteSelectionExpanded ? divExpandedStyle : divCollapsedStyle
    }, _react.default.createElement(_SiteChip.default, _extends({
      size: absoluteSelectionExpanded ? 'large' : 'medium',
      classes: siteChipClasses,
      label: sites.value.length ? siteChipLabel : 'no sites selected',
      variant: sites.value.length ? 'default' : 'outlined',
      onDelete: sites.value.length ? handleSelectNoneSites : null
    }, clickProps)));

    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("div", {
      className: classes.topFormHeader,
      style: {
        display: absoluteSelectionExpanded ? 'none' : 'flex'
      },
      "data-selenium": "data-product-availability.selection-options"
    }, _react.default.createElement(_Typography.default, {
      variant: "h5",
      className: classes.h5Small
    }, "Selection"), _react.default.createElement(_IconButton.default, {
      size: "small",
      style: {
        marginLeft: _Theme.default.spacing(1)
      },
      title: selectionButtonLabel,
      "aria-label": selectionButtonLabel,
      onClick: function onClick() {
        return handleToggleSelectionExpanded(selectionExpanded);
      }
    }, _react.default.createElement(_ExpandMore.default, null))), !absoluteSelectionExpanded ? siteChip : _react.default.createElement(_Grid.default, {
      container: true,
      spacing: 3
    }, _react.default.createElement(_Grid.default, {
      item: true,
      xs: 12,
      sm: 6,
      style: {
        marginBottom: _Theme.default.spacing(1)
      }
    }, _react.default.createElement("div", {
      className: classes.topFormHeader
    }, _react.default.createElement(_Typography.default, {
      variant: "h6",
      className: classes.h6Small
    }, "Sites"), disableSelectionCollapse ? null : _react.default.createElement(_IconButton.default, {
      size: "small",
      style: {
        marginLeft: _Theme.default.spacing(1),
        paddingBottom: 0
      },
      title: selectionButtonLabel,
      "aria-label": selectionButtonLabel,
      onClick: function onClick() {
        return handleToggleSelectionExpanded(selectionExpanded);
      }
    }, _react.default.createElement(_ExpandLess.default, null))), siteChip, _react.default.createElement("div", {
      style: {
        display: 'flex'
      }
    }, _react.default.createElement(_Button.default, {
      "data-selenium": "data-product-availability.select-all-sites-button",
      size: "small",
      color: "primary",
      variant: "outlined",
      onClick: handleSelectAllSites
    }, "Select All Sites"), _react.default.createElement(_Button.default, {
      "data-selenium": "data-product-availability.browse-sites-button",
      size: "small",
      color: "primary",
      variant: "outlined",
      style: {
        marginLeft: _Theme.default.spacing(1),
        display: 'none'
      },
      disabled: true
    }, "Browse Sites\u2026"))), _react.default.createElement(_Grid.default, {
      item: true,
      xs: 12,
      sm: 6,
      style: {
        marginBottom: _Theme.default.spacing(1)
      }
    }, _react.default.createElement(_Typography.default, {
      variant: "h6",
      className: classes.h6Small
    }, "Date Range"), _react.default.createElement(_pickers.MuiPickersUtilsProvider, {
      utils: _moment.default
    }, _react.default.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'nowrap'
      }
    }, _react.default.createElement(_pickers.DatePicker, {
      "data-selenium": "data-product-availability.date-range-start",
      inputVariant: "outlined",
      margin: "dense",
      value: getYearMonthMoment(dateRange.value[0]),
      onChange: function onChange(newDate) {
        return handleChangeStartDate(newDate);
      },
      views: ['month', 'year'],
      label: "Start",
      openTo: "month",
      minDate: getYearMonthMoment(dateRange.validValues[0]),
      maxDate: getYearMonthMoment(dateRange.value[1]),
      style: {
        marginRight: _Theme.default.spacing(1.5)
      }
    }), _react.default.createElement(_pickers.DatePicker, {
      "data-selenium": "data-product-availability.date-range-end",
      inputVariant: "outlined",
      margin: "dense",
      value: getYearMonthMoment(dateRange.value[1]),
      onChange: function onChange(newDate) {
        return handleChangeEndDate(newDate);
      },
      views: ['month', 'year'],
      label: "End",
      openTo: "month",
      minDate: getYearMonthMoment(dateRange.value[0]),
      maxDate: getYearMonthMoment(dateRange.validValues[1])
    }))), _react.default.createElement("div", {
      style: {
        display: 'flex',
        marginTop: _Theme.default.spacing(1)
      }
    }, _react.default.createElement(_Button.default, {
      "data-selenium": "data-product-availability.all-years-button",
      size: "small",
      color: "primary",
      variant: "outlined",
      onClick: handleSelectAllDateRange
    }, "Select All Years"), _react.default.createElement(_Button.default, {
      "data-selenium": "data-product-availability.latest-year-button",
      size: "small",
      color: "primary",
      variant: "outlined",
      onClick: handleSelectLatestYearDateRange,
      style: {
        marginLeft: _Theme.default.spacing(1)
      }
    }, "Select Latest Year")))));
  };
  /**
     Render: Final Component
  */


  var currentRows = views[currentView].rows;
  var currentRowCount = Object.keys(currentRows).length;
  var svgHeight = _AvailabilityGrid.SVG.CELL_PADDING + (_AvailabilityGrid.SVG.CELL_HEIGHT + _AvailabilityGrid.SVG.CELL_PADDING) * (currentRowCount + 1);
  var selectionSm = absoluteSelectionExpanded ? 12 : 6;
  return _react.default.createElement(_FullWidthVisualization.default, _extends({
    vizRef: svgRef,
    minWidth: svgMinWidth,
    handleRedraw: handleSvgRedraw,
    "data-selenium": "data-product-availability"
  }, other), _react.default.createElement(_Grid.default, {
    container: true,
    spacing: 2,
    style: {
      marginBottom: _Theme.default.spacing(1)
    }
  }, selectionEnabled ? _react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    sm: selectionSm
  }, renderSelection()) : null, _react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    sm: selectionEnabled ? selectionSm : 12
  }, currentView === 'ungrouped' ? renderSortOptions() : renderViewOptions())), _react.default.createElement("svg", {
    id: (0, _lodash.uniqueId)('dpa-'),
    ref: svgRef,
    height: svgHeight,
    className: classes.svg
  }), _react.default.createElement(_AvailabilityLegend.default, {
    selectionEnabled: selectionEnabled
  }));
}

DataProductAvailability.propTypes = {
  siteCodes: _propTypes.default.arrayOf( // eslint-disable-line react/no-unused-prop-types
  _propTypes.default.shape({
    siteCode: _propTypes.default.string.isRequired,
    availableMonths: _propTypes.default.arrayOf(_propTypes.default.string).isRequired
  })),
  view: _propTypes.default.oneOf(['summary', 'sites', 'states', 'domains', 'ungrouped']),
  sortMethod: _propTypes.default.oneOf(['sites', 'states', 'domains']),
  sortDirection: _propTypes.default.oneOf(['ASC', 'DESC']),
  disableSelectionCollapse: _propTypes.default.bool
};
DataProductAvailability.defaultProps = {
  siteCodes: [],
  view: 'summary',
  sortMethod: null,
  sortDirection: 'ASC',
  disableSelectionCollapse: false
};