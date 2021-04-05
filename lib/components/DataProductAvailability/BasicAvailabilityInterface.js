"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = require("lodash");

var _styles = require("@material-ui/core/styles");

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _Card = _interopRequireDefault(require("@material-ui/core/Card"));

var _CardContent = _interopRequireDefault(require("@material-ui/core/CardContent"));

var _FormControl = _interopRequireDefault(require("@material-ui/core/FormControl"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _Hidden = _interopRequireDefault(require("@material-ui/core/Hidden"));

var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));

var _OutlinedInput = _interopRequireDefault(require("@material-ui/core/OutlinedInput"));

var _Select = _interopRequireDefault(require("@material-ui/core/Select"));

var _ToggleButton = _interopRequireDefault(require("@material-ui/lab/ToggleButton"));

var _ToggleButtonGroup = _interopRequireDefault(require("@material-ui/lab/ToggleButtonGroup"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _KeyboardArrowDown = _interopRequireDefault(require("@material-ui/icons/KeyboardArrowDown"));

var _KeyboardArrowUp = _interopRequireDefault(require("@material-ui/icons/KeyboardArrowUp"));

var _TouchApp = _interopRequireDefault(require("@material-ui/icons/TouchApp"));

var _VerticalAlignCenter = _interopRequireDefault(require("@material-ui/icons/VerticalAlignCenter"));

var _PanTool = _interopRequireDefault(require("@material-ui/icons/PanTool"));

var _pickers = require("@material-ui/pickers");

var _moment = _interopRequireDefault(require("@date-io/moment"));

var _FullWidthVisualization = _interopRequireDefault(require("../FullWidthVisualization/FullWidthVisualization"));

var _DownloadDataContext = _interopRequireDefault(require("../DownloadDataContext/DownloadDataContext"));

var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));

var _MapSelectionButton = _interopRequireDefault(require("../MapSelectionButton/MapSelectionButton"));

var _SiteChip = _interopRequireDefault(require("../SiteChip/SiteChip"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _AvailabilityPending = _interopRequireDefault(require("./AvailabilityPending"));

var _BasicAvailabilityGrid = _interopRequireDefault(require("./BasicAvailabilityGrid"));

var _BasicAvailabilityKey = _interopRequireDefault(require("./BasicAvailabilityKey"));

var _AvailabilityUtils = require("./AvailabilityUtils");

var _AvailabilitySvgComponents = require("./AvailabilitySvgComponents");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
   Setup: CSS classes
*/
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    svg: {
      minWidth: "".concat(_AvailabilityUtils.SVG.MIN_WIDTH, "px"),
      minHeight: "".concat(_AvailabilityUtils.SVG.MIN_HEIGHT, "px")
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
      height: theme.spacing(4),
      '& div': {
        padding: _Theme.default.spacing(1, 3, 1, 1.5)
      }
    },
    sortSelect: {
      height: theme.spacing(4),
      '& div': {
        paddingRight: _Theme.default.spacing(4.5)
      },
      marginRight: theme.spacing(2)
    },
    helpIcon: {
      color: theme.palette.grey[300],
      marginRight: theme.spacing(1)
    },
    helpGridContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      padding: '16px 16px 8px 16px !important'
    },
    helpGrid: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginBottom: theme.spacing(1),
      marginRight: theme.spacing(1)
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
/**
   Main Function
*/

var BasicAvailabilityInterface = function BasicAvailabilityInterface(props) {
  var classes = useStyles(_Theme.default);
  var atXs = (0, _useMediaQuery.default)(_Theme.default.breakpoints.only('xs'));
  var atSm = (0, _useMediaQuery.default)(_Theme.default.breakpoints.only('sm'));
  var siteChipClasses = useSiteChipStyles(_Theme.default);

  var other = _extends({}, props);

  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
      _NeonContext$useNeonC3 = _NeonContext$useNeonC2[0],
      neonContextData = _NeonContext$useNeonC3.data,
      neonContextIsFinal = _NeonContext$useNeonC3.isFinal,
      neonContextHasError = _NeonContext$useNeonC3.hasError;

  var allSites = neonContextData.sites,
      allStates = neonContextData.states,
      allDomains = neonContextData.domains;
  /**
     Sort methods and directions
  */

  var SORT_METHODS = {
    states: {
      label: 'by State',
      getSortFunction: function getSortFunction(ret) {
        return function (a, b) {
          var aState = allStates[allSites[a].stateCode].name;
          var bState = allStates[allSites[b].stateCode].name;

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
          var aDomain = allSites[a].domainCode;
          var bDomain = allSites[b].domainCode;

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
          return allSites[key].description;
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
          return allStates[key].name;
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
          return allDomains[key].name;
        }
      }
    },
    ungrouped: {
      view: 'ungrouped',
      name: 'Ungrouped',
      selectable: false,
      getLabel: {
        text: function text(key) {
          return "".concat(allSites[key].stateCode, "-").concat(allSites[key].domainCode, "-").concat(key);
        },
        title: function title(key) {
          var siteTitle = allSites[key].description;
          var domainTitle = allDomains[allSites[key].domainCode].name;
          var stateTitle = allStates[allSites[key].stateCode].name;
          return "".concat(stateTitle, " - ").concat(domainTitle, " - ").concat(siteTitle);
        }
      }
    },
    products: {
      view: 'products',
      name: 'Product',
      selectable: false,
      rows: {},
      getLabel: {
        text: function text(key) {
          return key;
        },
        title: function title(key) {
          return key;
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
      dispatchSelection = _DownloadDataContext$2[1];

  var disableSelection = props.disableSelection,
      delineateRelease = props.delineateRelease;
  var selectionEnabled = !disableSelection && requiredSteps.some(function (step) {
    return step.key === 'sitesAndDateRange';
  });
  /**
     State: Current View
     View mode can be set from the view prop or pulled from a download context.
     Prop overrides context. If neither are set then default to 'sites' if selection
     is currently enabled and 'summary' if not.
  */

  var propsView = props.view;
  var initialView = propsView;

  if (!initialView) {
    initialView = contextView;
  }

  if (!initialView) {
    initialView = selectionEnabled ? 'sites' : 'summary';
  }

  var _useState = (0, _react.useState)(initialView),
      _useState2 = _slicedToArray(_useState, 2),
      currentView = _useState2[0],
      setCurrentView = _useState2[1];
  /**
     State: Current Sort Method and Sort Direction
     Only applies for "ungrouped" view mode.
  */


  var propsSortMethod = props.sortMethod,
      propsSortDirection = props.sortDirection;
  var initialSortMethod = propsSortMethod;

  if (!initialSortMethod) {
    initialSortMethod = contextSortMethod;
  }

  if (!initialSortMethod) {
    initialSortMethod = 'states';
  }

  var initialSortDirection = propsSortDirection;

  if (!initialSortDirection) {
    initialSortDirection = contextSortDirection;
  }

  if (!initialSortDirection) {
    initialSortDirection = 'ASC';
  }

  var _useState3 = (0, _react.useState)(initialSortMethod),
      _useState4 = _slicedToArray(_useState3, 2),
      currentSortMethod = _useState4[0],
      setCurrentSortMethod = _useState4[1];

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
  /**
     Handlers
  */

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
    var start = _AvailabilityUtils.TIME.getYearMonthMoment(dateRange.validValues[1]).subtract(11, 'months').format('YYYY-MM');

    setDateRangeValue([start < dateRange.validValues[0] ? dateRange.validValues[0] : start, dateRange.validValues[1]]);
  };

  var handleChangeStartDate = function handleChangeStartDate(newStartDate) {
    setDateRangeValue([newStartDate.format('YYYY-MM'), dateRange.value[1]]);
  };

  var handleChangeEndDate = function handleChangeEndDate(newEndDate) {
    setDateRangeValue([dateRange.value[0], newEndDate.format('YYYY-MM')]);
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
    } // NOTE - these returns are backwards because the rendering in the chart is bottom-up
    // (though of course a user will read it top-down).


    var sortReturns = [currentSortDirection === 'ASC' ? 1 : -1, currentSortDirection === 'ASC' ? -1 : 1];
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
     Statically loaded in via props or pulled from context. If both, props wins.
     Should not change in render lifecycle.
     Create mappings of the shape row => year-month => status for
     all aggregation views.
     TODO: Add other statuses. Currently the only status is "available".
  */


  var siteCodes = [];
  var propsSiteCodes = props.siteCodes;
  var contextSiteCodes = productData.siteCodes;

  if (propsSiteCodes && propsSiteCodes.length) {
    siteCodes = propsSiteCodes;
  } else if (contextSiteCodes && contextSiteCodes.length) {
    siteCodes = contextSiteCodes;
  }

  siteCodes.forEach(function (site) {
    var siteCode = site.siteCode,
        availableMonths = site.availableMonths,
        availableReleases = site.availableReleases;

    if (!allSites[siteCode]) {
      return;
    }

    var _allSites$siteCode = allSites[siteCode],
        stateCode = _allSites$siteCode.stateCode,
        domainCode = _allSites$siteCode.domainCode;

    if (!downloadContextIsActive) {
      sites.validValues.push(siteCode);
    }

    var provAvailableMonths = [];

    if (delineateRelease && Array.isArray(availableReleases)) {
      var provRelease = availableReleases.find(function (value) {
        return value.release === 'PROVISIONAL';
      });

      if (provRelease) {
        provAvailableMonths = provRelease.availableMonths;
      }
    }

    views.sites.rows[siteCode] = {};
    views.states.rows[stateCode] = views.states.rows[stateCode] || {};
    views.domains.rows[domainCode] = views.domains.rows[domainCode] || {};
    availableMonths.forEach(function (month) {
      var status = 'available';

      if (delineateRelease && provAvailableMonths && provAvailableMonths.length > 0) {
        if (provAvailableMonths.includes(month)) {
          status = 'available-provisional';
        }
      }

      views.summary.rows.summary[month] = status;
      views.sites.rows[siteCode][month] = status;
      views.states.rows[stateCode][month] = status;
      views.domains.rows[domainCode][month] = status;
    });
  });
  var dataProducts = props.dataProducts;
  dataProducts.forEach(function (product) {
    var dataProductCode = product.dataProductCode,
        availableMonths = product.availableMonths,
        availableReleases = product.availableReleases;
    var provAvailableMonths = [];

    if (delineateRelease && Array.isArray(availableReleases)) {
      var provRelease = availableReleases.find(function (value) {
        return value.release === 'PROVISIONAL';
      });

      if (provRelease) {
        provAvailableMonths = provRelease.availableMonths;
      }
    }

    views.products.rows[dataProductCode] = {};
    availableMonths.forEach(function (month) {
      var status = 'available';

      if (delineateRelease && provAvailableMonths && provAvailableMonths.length > 0) {
        if (provAvailableMonths.includes(month)) {
          status = 'available-provisional';
        }
      }

      views.products.rows[dataProductCode][month] = status;
    });
  });

  if (!downloadContextIsActive) {
    var summaryMonths = Object.keys(views.summary.rows.summary).sort();
    dateRange.validValues[0] = summaryMonths[0]; // eslint-disable-line prefer-destructuring

    dateRange.validValues[1] = summaryMonths.pop();
  }
  /**
     Redraw setup
  */


  var svgRef = (0, _react.useRef)(null);
  var handleSvgRedraw = (0, _react.useCallback)(function () {
    (0, _BasicAvailabilityGrid.default)({
      data: views[currentView],
      svgRef: svgRef,
      allSites: allSites,
      sites: sites,
      sortedSites: sortedSites,
      setSitesValue: setSitesValue,
      dateRange: dateRange,
      setDateRangeValue: setDateRangeValue,
      selectionEnabled: selectionEnabled
    });
  }, [svgRef, views, currentView, allSites, sites, sortedSites, setSitesValue, dateRange, setDateRangeValue, selectionEnabled]);
  (0, _react.useEffect)(function () {
    applySort();
    handleSvgRedraw();
  });
  var justify = 'end';

  if (currentView === 'ungrouped') {
    justify = atXs || atSm ? 'start' : 'end';
  } else {
    justify = atXs ? 'start' : 'end';
  }

  var optionDivStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: "flex-".concat(justify)
  };
  /**
     Render: NeonContext-related Loading and Error States
  */

  if (!neonContextIsFinal || neonContextHasError) {
    var message = currentView === 'products' ? 'Loading Products...' : 'Loading Sites...';
    return /*#__PURE__*/_react.default.createElement(_AvailabilityPending.default, {
      message: message
    });
  }
  /**
     Render: View Options
  */


  var renderViewOptions = function renderViewOptions() {
    return /*#__PURE__*/_react.default.createElement("div", {
      style: optionDivStyle,
      "data-selenium": "data-product-availability.view-options"
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
      className: classes.h6Small,
      style: {
        marginRight: _Theme.default.spacing(1.5),
        whiteSpace: 'nowrap'
      }
    }, "View By:"), /*#__PURE__*/_react.default.createElement(_Hidden.default, {
      smDown: true,
      key: "viewMdUp"
    }, /*#__PURE__*/_react.default.createElement(_ToggleButtonGroup.default, {
      exclusive: true,
      color: "primary",
      variant: "outlined",
      size: "small",
      value: currentView,
      onChange: handleChangeView
    }, selectableViewKeys.map(function (key) {
      return /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
        key: key,
        value: key,
        size: "small"
      }, views[key].name);
    }))), /*#__PURE__*/_react.default.createElement(_Hidden.default, {
      mdUp: true,
      key: "viewSmDown"
    }, /*#__PURE__*/_react.default.createElement(_FormControl.default, {
      variant: "filled"
    }, /*#__PURE__*/_react.default.createElement(_Select.default, {
      value: currentView,
      onChange: function onChange(event) {
        return handleChangeView(event, event.target.value);
      },
      input: /*#__PURE__*/_react.default.createElement(_OutlinedInput.default, {
        margin: "dense",
        className: selectionEnabled ? null : classes.xsSelect
      }),
      variant: "filled"
    }, selectableViewKeys.map(function (key) {
      return /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
        key: key,
        value: key
      }, views[key].name);
    })))));
  };
  /**
     Render: Sort Options
  */


  var renderSortOptions = function renderSortOptions() {
    return /*#__PURE__*/_react.default.createElement("div", {
      style: optionDivStyle,
      "data-selenium": "data-product-availability.sort-options"
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
      className: classes.h6Small,
      style: {
        marginRight: _Theme.default.spacing(1.5),
        whiteSpace: 'nowrap'
      }
    }, "Sort By:"), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'flex-end'
      }
    }, /*#__PURE__*/_react.default.createElement(_FormControl.default, {
      variant: "outlined"
    }, /*#__PURE__*/_react.default.createElement(_Select.default, {
      value: currentSortMethod,
      "aria-label": "Sort Method",
      className: classes.sortSelect,
      onChange: handleChangeSortMethod,
      "data-selenium": "data-product-availability.sort-options.method"
    }, Object.keys(SORT_METHODS).map(function (method) {
      return /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
        key: method,
        value: method
      }, SORT_METHODS[method].label);
    }))), /*#__PURE__*/_react.default.createElement(_ToggleButtonGroup.default, {
      exclusive: true,
      size: "small",
      value: currentSortDirection,
      onChange: handleChangeSortDirection,
      "data-selenium": "data-product-availability.sort-options.direction"
    }, /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
      key: SORT_DIRECTIONS[0],
      value: SORT_DIRECTIONS[0],
      title: "Sort Ascending (A-Z)",
      "aria-label": "Sort Ascending (A-Z)"
    }, /*#__PURE__*/_react.default.createElement(_KeyboardArrowDown.default, {
      fontSize: "small"
    })), /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
      key: SORT_DIRECTIONS[1],
      value: SORT_DIRECTIONS[1],
      title: "Sort Descending (Z-A)",
      "aria-label": "Sort Descending (Z-A)"
    }, /*#__PURE__*/_react.default.createElement(_KeyboardArrowUp.default, {
      fontSize: "small"
    })))));
  };
  /**
     Render: View Controls
  */


  var renderViewControls = function renderViewControls() {
    if (currentView === 'products') {
      return /*#__PURE__*/_react.default.createElement(_Grid.default, {
        item: true,
        xs: 12
      });
    }

    return /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 12,
      sm: currentView === 'ungrouped' ? 12 : 5,
      md: 6
    }, currentView === 'ungrouped' ? renderSortOptions() : renderViewOptions());
  };
  /**
     Render: Key
  */


  var renderKey = function renderKey() {
    var smWidth = currentView === 'ungrouped' ? 12 : 7;
    var mdWidth = 6;

    if (currentView === 'products') {
      smWidth = 12;
      mdWidth = 12;
    }

    return /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 12,
      sm: smWidth,
      md: mdWidth,
      style: {
        display: 'flex',
        alignItems: 'center'
      }
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
      className: classes.h6Small,
      style: {
        marginRight: _Theme.default.spacing(1.5)
      }
    }, "Key:"), /*#__PURE__*/_react.default.createElement(_BasicAvailabilityKey.default, {
      orientation: currentView === 'products' ? 'horizontal' : '',
      selectionEnabled: selectionEnabled,
      delineateRelease: delineateRelease,
      style: {
        flexGrow: 1
      }
    }));
  };
  /**
     Render: Selection
  */


  var renderSelection = function renderSelection() {
    var sitesPlural = sites.value.length > 1 ? 's' : '';
    var siteChipLabel = "".concat(sites.value.length, " site").concat(sitesPlural);
    var siteChipProps = {
      size: 'large',
      color: 'primary',
      classes: siteChipClasses,
      label: sites.value.length ? siteChipLabel : 'no sites selected',
      variant: sites.value.length ? 'default' : 'outlined',
      onDelete: sites.value.length ? handleSelectNoneSites : null
    };
    var selectionButtonProps = {
      size: 'small',
      color: 'primary',
      variant: 'outlined'
    };
    var datePickerProps = {
      inputVariant: 'outlined',
      margin: 'dense',
      views: ['month', 'year'],
      openTo: 'month'
    };
    return /*#__PURE__*/_react.default.createElement(_Grid.default, {
      container: true,
      spacing: 3
    }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 12,
      sm: 5,
      md: 6
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.topFormHeader
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
      className: classes.h6Small
    }, "Sites")), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        marginTop: _Theme.default.spacing(1),
        marginBottom: _Theme.default.spacing(1.5)
      }
    }, /*#__PURE__*/_react.default.createElement(_SiteChip.default, siteChipProps)), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex'
      }
    }, /*#__PURE__*/_react.default.createElement(_Button.default, _extends({}, selectionButtonProps, {
      "data-selenium": "data-product-availability.select-all-sites-button",
      onClick: handleSelectAllSites
    }), "Select All Sites"), /*#__PURE__*/_react.default.createElement(_MapSelectionButton.default, {
      selection: "SITES",
      selectedItems: sites.value,
      validItems: sites.validValues,
      buttonProps: _extends({}, selectionButtonProps, {
        style: {
          marginLeft: _Theme.default.spacing(1)
        }
      }),
      "data-selenium": "data-product-availability.map-button",
      onSave: function onSave(newSites) {
        setSitesValue(Array.from(newSites));
      }
    }))), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 12,
      sm: 7,
      md: 6
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
      className: classes.h6Small
    }, "Date Range"), /*#__PURE__*/_react.default.createElement(_pickers.MuiPickersUtilsProvider, {
      utils: _moment.default
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'nowrap'
      }
    }, /*#__PURE__*/_react.default.createElement(_pickers.DatePicker, _extends({}, datePickerProps, {
      label: "Start",
      "data-selenium": "data-product-availability.date-range-start",
      value: _AvailabilityUtils.TIME.getYearMonthMoment(dateRange.value[0]),
      onChange: function onChange(newDate) {
        return handleChangeStartDate(newDate);
      },
      minDate: _AvailabilityUtils.TIME.getYearMonthMoment(dateRange.validValues[0]),
      maxDate: _AvailabilityUtils.TIME.getYearMonthMoment(dateRange.value[1]),
      style: {
        marginRight: _Theme.default.spacing(1.5)
      }
    })), /*#__PURE__*/_react.default.createElement(_pickers.DatePicker, _extends({}, datePickerProps, {
      label: "End",
      "data-selenium": "data-product-availability.date-range-end",
      value: _AvailabilityUtils.TIME.getYearMonthMoment(dateRange.value[1]),
      onChange: function onChange(newDate) {
        return handleChangeEndDate(newDate);
      },
      minDate: _AvailabilityUtils.TIME.getYearMonthMoment(dateRange.value[0]),
      maxDate: _AvailabilityUtils.TIME.getYearMonthMoment(dateRange.validValues[1])
    })))), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        marginTop: _Theme.default.spacing(1)
      }
    }, /*#__PURE__*/_react.default.createElement(_Button.default, _extends({}, selectionButtonProps, {
      "data-selenium": "data-product-availability.all-years-button",
      onClick: handleSelectAllDateRange
    }), "Select All Years"), /*#__PURE__*/_react.default.createElement(_Button.default, _extends({}, selectionButtonProps, {
      "data-selenium": "data-product-availability.latest-year-button",
      onClick: handleSelectLatestYearDateRange,
      style: {
        marginLeft: _Theme.default.spacing(1)
      }
    }), "Select Latest Year"))), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 12,
      style: {
        marginBottom: _Theme.default.spacing(1)
      }
    }, /*#__PURE__*/_react.default.createElement(_Card.default, null, /*#__PURE__*/_react.default.createElement(_CardContent.default, {
      className: classes.helpGridContainer
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.helpGrid
    }, /*#__PURE__*/_react.default.createElement(_PanTool.default, {
      className: classes.helpIcon
    }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body1",
      component: "div",
      style: {
        flexGrow: 1
      }
    }, "Drag the grid to pan across time")), /*#__PURE__*/_react.default.createElement("div", {
      className: classes.helpGrid
    }, /*#__PURE__*/_react.default.createElement(_TouchApp.default, {
      className: classes.helpIcon
    }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body1",
      component: "div",
      style: {
        flexGrow: 1
      }
    }, "Click rows to select sites")), /*#__PURE__*/_react.default.createElement("div", {
      className: classes.helpGrid
    }, /*#__PURE__*/_react.default.createElement(_VerticalAlignCenter.default, {
      className: classes.helpIcon,
      style: {
        transform: 'rotate(90deg)'
      }
    }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body1",
      component: "div",
      style: {
        flexGrow: 1
      }
    }, "Drag selection edges to adjust dates"))))));
  };
  /**
     Render: Final Component
  */


  var currentRows = views[currentView].rows;
  var currentRowCount = Object.keys(currentRows).length;
  var svgHeight = _AvailabilityUtils.SVG.CELL_PADDING + (_AvailabilityUtils.SVG.CELL_HEIGHT + _AvailabilityUtils.SVG.CELL_PADDING) * (currentRowCount + 1);
  return /*#__PURE__*/_react.default.createElement(_FullWidthVisualization.default, _extends({
    vizRef: svgRef,
    minWidth: _AvailabilityUtils.SVG.MIN_WIDTH,
    handleRedraw: handleSvgRedraw,
    "data-selenium": "data-product-availability"
  }, other), /*#__PURE__*/_react.default.createElement(_AvailabilitySvgComponents.SvgDefs, null), /*#__PURE__*/_react.default.createElement(_Grid.default, {
    container: true,
    spacing: 2,
    direction: "row-reverse",
    style: {
      marginBottom: _Theme.default.spacing(1)
    }
  }, selectionEnabled ? /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    sm: 12
  }, renderSelection()) : null, renderViewControls(), renderKey()), /*#__PURE__*/_react.default.createElement("svg", {
    id: (0, _lodash.uniqueId)('dpa-'),
    ref: svgRef,
    height: svgHeight,
    className: classes.svg
  }));
};

BasicAvailabilityInterface.propTypes = {
  // eslint-disable-line react/no-unused-prop-types
  siteCodes: _AvailabilityUtils.AvailabilityPropTypes.basicSiteCodes,
  dataProducts: _AvailabilityUtils.AvailabilityPropTypes.dataProducts,
  view: _propTypes.default.oneOf(['summary', 'sites', 'states', 'domains', 'ungrouped', 'products']),
  sortMethod: _propTypes.default.oneOf(['sites', 'states', 'domains']),
  sortDirection: _propTypes.default.oneOf(['ASC', 'DESC']),
  disableSelection: _propTypes.default.bool,
  delineateRelease: _propTypes.default.bool
};
BasicAvailabilityInterface.defaultProps = {
  siteCodes: [],
  dataProducts: [],
  view: null,
  sortMethod: null,
  sortDirection: 'ASC',
  disableSelection: false,
  delineateRelease: false
};
var _default = BasicAvailabilityInterface;
exports.default = _default;