"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _rxjs = require("rxjs");

var _ajax = require("rxjs/ajax");

var _operators = require("rxjs/operators");

var _dateformat = _interopRequireDefault(require("dateformat"));

var _styles = require("@material-ui/core/styles");

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _Link = _interopRequireDefault(require("@material-ui/core/Link"));

var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));

var _OutlinedInput = _interopRequireDefault(require("@material-ui/core/OutlinedInput"));

var _Select = _interopRequireDefault(require("@material-ui/core/Select"));

var _Slider = _interopRequireDefault(require("@material-ui/core/Slider"));

var _SnackbarContent = _interopRequireDefault(require("@material-ui/core/SnackbarContent"));

var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _KeyboardArrowLeft = _interopRequireDefault(require("@material-ui/icons/KeyboardArrowLeft"));

var _KeyboardArrowRight = _interopRequireDefault(require("@material-ui/icons/KeyboardArrowRight"));

var _InfoOutlined = _interopRequireDefault(require("@material-ui/icons/InfoOutlined"));

var _OpenInNew = _interopRequireDefault(require("@material-ui/icons/OpenInNew"));

var _Warning = _interopRequireDefault(require("@material-ui/icons/Warning"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));

var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));

var _FullWidthVisualization = _interopRequireDefault(require("../FullWidthVisualization/FullWidthVisualization"));

var _MapSelectionButton = _interopRequireDefault(require("../MapSelectionButton/MapSelectionButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var MIN_IFRAME_WIDTH = 240;
/**
   Setup: CSS classes
*/

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    selectionForm: {
      width: '100%',
      marginBottom: theme.spacing(2)
    },
    iframe: {
      minWidth: "".concat(MIN_IFRAME_WIDTH, "px"),
      minHeight: "".concat(MIN_IFRAME_WIDTH, "px"),
      border: "1px solid ".concat(theme.palette.grey[700])
    },
    divider: {
      margin: theme.spacing(2, 0)
    },
    label: {
      color: theme.palette.grey[500],
      fontSize: '0.9rem',
      marginBottom: theme.spacing(0.5)
    },
    optgroup: {
      fontWeight: _Theme.default.typography.fontWeightMedium
    },
    tooltipIconButton: {
      marginTop: theme.spacing(-0.5),
      marginLeft: theme.spacing(0.5)
    },
    openInNewLink: {
      display: 'block',
      width: '100%',
      textAlign: 'right',
      marginTop: theme.spacing(0.5),
      fontSize: '0.8rem'
    },
    openInNewIcon: {
      fontSize: '0.95rem',
      margin: theme.spacing(0, 0.5, -0.25, 0)
    }
  };
});
/**
   Function: Parse the response from the Visus API from its original shape
   into an object keyed by sites each containing an object keyed by years
   each containing an array of flights. Each flight contains the month and URL.
*/

/* eslint-disable no-param-reassign, function-paren-newline */

var parseFetchResponse = function parseFetchResponse(response) {
  return response.data.siteCodes.reduce(function (obj, site) {
    obj[site.siteCode] = site.availableMonths.reduce(function (siteObj, yearMonth, idx) {
      var year = parseInt(yearMonth.substr(0, 4), 10);
      var month = yearMonth.substr(5, 2);

      if (!siteObj[year]) {
        siteObj[year] = [];
      }

      siteObj[year].push({
        month: month,
        url: site.availableDataUrls[idx]
      });
      return siteObj;
    }, {});
    return obj;
  }, {});
};
/* eslint-enable no-param-reassign, function-paren-newline */

/**
   Functions to get slider marks and bounds
   Limit slider marks to one per year where the year is the slider value
*/


var getCurrentSliderMarks = function getCurrentSliderMarks(currentYears) {
  return Array.from(new Set(Object.keys(currentYears || {}).sort().map(function (year) {
    return {
      label: year,
      value: year
    };
  })));
};

var getCurrentSliderBounds = function getCurrentSliderBounds(currentYears) {
  var years = Object.keys(currentYears).sort();

  if (years < 2) {
    return null;
  }

  return {
    min: parseInt(years[0], 10) - 1,
    max: parseInt(years[years.length - 1], 10) + 1
  };
};
/**
   Main Function
*/


var AopDataViewer = function AopDataViewer(props) {
  var classes = useStyles(_Theme.default);
  var productCode = props.productCode,
      showTitle = props.showTitle,
      fillContainer = props.fillContainer,
      showOpenInNewWindow = props.showOpenInNewWindow;

  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
      neonContextData = _NeonContext$useNeonC2[0].data;

  var sites = neonContextData.sites,
      states = neonContextData.states;
  var belowSm = (0, _useMediaQuery.default)(_Theme.default.breakpoints.only('xs'));
  var atSm = (0, _useMediaQuery.default)(_Theme.default.breakpoints.only('sm'));
  /**
     Getters for site description and data set title
  */

  var getSiteDescription = function getSiteDescription(site) {
    var includeState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (sites[site]) {
      var state = includeState ? ", ".concat(sites[site].stateCode) : '';
      return "".concat(sites[site].description).concat(state);
    }

    return null;
  };

  var getDataSetTitle = function getDataSetTitle(selection, data) {
    if (!selection || !data) {
      return '';
    }

    var site = selection.site,
        year = selection.year,
        flight = selection.flight;

    if (!site || !year || !flight) {
      return '';
    }

    var flightIdx = flight - 1;

    if (!data[site] || !data[site][year] || !data[site][year][flightIdx]) {
      return '';
    }

    var parts = {
      site: getSiteDescription(site),
      date: (0, _dateformat.default)(new Date("".concat(year, "-").concat(data[site][year][flightIdx].month, "-02")), 'mmmm yyyy'),
      flight: "Flight ".concat(flight, "/").concat(data[site][year].length)
    };
    return "".concat(parts.site, " -- ").concat(parts.date, " -- ").concat(parts.flight);
  };
  /**
     State: data
     Object, keyed by site code and then year, with each year containing an array of flight objects.
  */


  var _useState = (0, _react.useState)({}),
      _useState2 = _slicedToArray(_useState, 2),
      data = _useState2[0],
      setData = _useState2[1];
  /**
     State: iFrame Width
     Keep iFrame width in state to trigger re-renders as necessary on resize, including
     keeping the component at its maximum width at all times and with an appropriate
     aspect ratio given the width.
  */


  var iframeRef = (0, _react.useRef)(null);
  /**
     State: currentSelection
     Object containing current site, year, and flight to show in the iframe
  */

  var initialSite = props.initialSite,
      initialYear = props.initialYear,
      initialFlight = props.initialFlight;
  var initialCurrentSelection = {
    site: initialSite || null,
    year: initialYear || null,
    flight: initialFlight || null,
    sliderMarks: [],
    sliderBounds: {
      min: 2010,
      max: 2050
    }
  };

  var _useState3 = (0, _react.useState)(initialCurrentSelection),
      _useState4 = _slicedToArray(_useState3, 2),
      currentSelection = _useState4[0],
      setCurrentSelection = _useState4[1];

  var handleSiteChange = (0, _react.useCallback)(function () {
    var site = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    if (!data || !Object.keys(data).length) {
      return;
    }

    var newSite = site;

    if (site === null) {
      newSite = initialSite || Object.keys(data)[0];
    }

    if (!data[newSite] || !Object.keys(data[newSite]).length) {
      return;
    }

    var newYear = parseInt(Object.keys(data[newSite]).sort().reverse()[0], 10);

    if (site === null && initialYear && data[newSite][initialYear]) {
      newYear = initialYear;
    }

    if (!data[newSite][newYear].length) {
      return;
    }

    var newFlight = data[newSite][newYear].length;

    if (site === null && initialFlight && data[newSite][newYear][initialFlight - 1]) {
      newFlight = initialFlight;
    }

    setCurrentSelection({
      site: newSite,
      year: newYear,
      flight: newFlight,
      sliderMarks: getCurrentSliderMarks(data[newSite]),
      sliderBounds: getCurrentSliderBounds(data[newSite])
    });
  }, [initialSite, initialYear, initialFlight, data]);

  var handleSliderChange = function handleSliderChange(year) {
    var validYears = Object.keys(data[currentSelection.site]).map(function (y) {
      return parseInt(y, 10);
    });

    if (!year || !validYears.includes(year) || year === currentSelection.year) {
      return;
    }

    var flight = data[currentSelection.site][year].length;
    setCurrentSelection(function (previousCurrentSelection) {
      return _extends({}, previousCurrentSelection, {
        year: year,
        flight: flight
      });
    });
  };

  var handleSliderButtonClick = function handleSliderButtonClick(direction) {
    if (!['next', 'previous'].includes(direction)) {
      return;
    }

    var validYears = Object.keys(data[currentSelection.site]).map(function (y) {
      return parseInt(y, 10);
    });
    var currentYearIdx = validYears.indexOf(currentSelection.year);
    var nudge = direction === 'next' ? 1 : -1;
    var newYear = validYears[currentYearIdx + nudge];

    if (!newYear) {
      return;
    }

    handleSliderChange(newYear);
  };

  var handleFlightChange = function handleFlightChange(flight) {
    if (Number.isNaN(flight) || !data[currentSelection.site][currentSelection.year][flight - 1]) {
      return;
    }

    setCurrentSelection(function (previousCurrentSelection) {
      return _extends({}, previousCurrentSelection, {
        flight: flight
      });
    });
  };

  var getCurrentIframeSrc = function getCurrentIframeSrc() {
    var site = currentSelection.site,
        year = currentSelection.year,
        flight = currentSelection.flight;

    if (!site || !year || !flight) {
      return '';
    }

    var flightIdx = flight - 1;

    if (!data[site] || !data[site][year] || !data[site][year][flightIdx]) {
      return '';
    }

    var yearData = data[site][year];

    if (!yearData[flightIdx].month) {
      return '';
    }

    var yearFlightMonth = yearData[flightIdx].month;
    var currentDataUrl = data[site][year][flightIdx].url;
    var queryParams = "&dataproduct=".concat(productCode, "&site=").concat(site, "&month=").concat(year, "-").concat(yearFlightMonth);
    var appliedDataUrl = "".concat(currentDataUrl).concat(queryParams);
    var title = encodeURIComponent(getDataSetTitle(currentSelection, data));
    return "".concat(_NeonEnvironment.default.getVisusIframeBaseUrl(), "?").concat(appliedDataUrl, "&title=").concat(title);
  };
  /**
     State: fetchCalled, fetchSucceeded, and fetchFailed
     Booleans for whether the initial data availability fetch has been called,
     whether it has completed (resolved OK or with an error), and whether it failed.
  */


  var _useState5 = (0, _react.useState)(false),
      _useState6 = _slicedToArray(_useState5, 2),
      fetchCalled = _useState6[0],
      setFetchCalled = _useState6[1];

  var _useState7 = (0, _react.useState)(false),
      _useState8 = _slicedToArray(_useState7, 2),
      fetchSucceeded = _useState8[0],
      setFetchSucceeded = _useState8[1];

  var _useState9 = (0, _react.useState)(false),
      _useState10 = _slicedToArray(_useState9, 2),
      fetchFailed = _useState10[0],
      setFetchFailed = _useState10[1];
  /**
     Effect: fetch and parse available data
  */


  var handleFetchProductByCode = (0, _react.useCallback)(function () {
    return (0, _ajax.ajax)({
      method: 'GET',
      url: "".concat(_NeonEnvironment.default.getVisusProductsBaseUrl(), "/").concat(productCode),
      crossDomain: true
    }).pipe((0, _operators.map)(function (response) {
      if (!response || !response.response || !response.response.data || !response.response.data.siteCodes || response.response.data.siteCodes.length <= 0) {
        throw Error('Product response contained no data');
      }

      setData(parseFetchResponse(response.response));
      setFetchSucceeded(true);
    }), (0, _operators.catchError)(function () {
      setFetchFailed(true);
      return (0, _rxjs.of)('Product not found');
    })).subscribe();
  }, [productCode]);
  (0, _react.useEffect)(function () {
    if (!fetchCalled) {
      handleFetchProductByCode();
      setFetchCalled(true);
    }

    if (fetchSucceeded && (!currentSelection.site || !currentSelection.sliderMarks.length)) {
      handleSiteChange();
    }
  }, [fetchCalled, fetchSucceeded, currentSelection, handleFetchProductByCode, handleSiteChange]);

  var renderSiteSelect = function renderSiteSelect() {
    var sitesByStateName = {};
    Object.keys(data).forEach(function (site) {
      if (!sites[site]) {
        return;
      }

      var stateName = states[sites[site].stateCode].name;

      if (!sitesByStateName[stateName]) {
        sitesByStateName[stateName] = [];
      }

      sitesByStateName[stateName].push(site);
    });
    var menuItems = Object.keys(sitesByStateName).sort().flatMap(function (stateName) {
      return [/*#__PURE__*/_react.default.createElement(_MenuItem.default, {
        key: stateName,
        value: stateName,
        className: classes.optgroup,
        style: {
          opacity: 1
        },
        disabled: true
      }, stateName)].concat(sitesByStateName[stateName].map(function (site) {
        return /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
          key: site,
          value: site
        }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
          display: "block"
        }, site), /*#__PURE__*/_react.default.createElement(_Typography.default, {
          display: "block",
          variant: "caption"
        }, getSiteDescription(site, false))));
      }));
    });
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'nowrap'
      }
    }, /*#__PURE__*/_react.default.createElement(_MapSelectionButton.default, {
      selection: "SITES",
      selectionLimit: 1,
      selectedItems: currentSelection.site ? [currentSelection.site] : [],
      validItems: Object.keys(data),
      buttonProps: {
        style: {
          marginRight: _Theme.default.spacing(1)
        }
      },
      onSave: function onSave(newSites) {
        handleSiteChange(_toConsumableArray(newSites)[0]);
      },
      icon: !atSm
    }), /*#__PURE__*/_react.default.createElement(_Select.default, {
      "data-selenium": "aop-data-viewer.site-select",
      value: currentSelection.site || '',
      onChange: function onChange(event) {
        return handleSiteChange(event.target.value);
      },
      input: /*#__PURE__*/_react.default.createElement(_OutlinedInput.default, {
        name: "site",
        id: "site",
        margin: "dense"
      }),
      "aria-labelledby": "site-label",
      renderValue: function renderValue(value) {
        return value;
      }
    }, menuItems));
  };

  var renderYearSlider = function renderYearSlider() {
    if (!currentSelection.year) {
      return null;
    }

    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        width: '100%',
        display: 'flex'
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        flexGrow: 0
      }
    }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
      "data-selenium": "aop-data-viewer.previous-year-button",
      size: "small",
      color: "primary",
      "aria-label": "previous year",
      style: {
        marginRight: _Theme.default.spacing(0.5)
      },
      onClick: function onClick() {
        return handleSliderButtonClick('previous');
      },
      disabled: currentSelection.year === currentSelection.sliderBounds.min + 1
    }, /*#__PURE__*/_react.default.createElement(_KeyboardArrowLeft.default, null))), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        flexGrow: 1
      }
    }, /*#__PURE__*/_react.default.createElement(_Slider.default, {
      "data-selenium": "aop-data-viewer.year-slider",
      value: currentSelection.year,
      step: null,
      marks: currentSelection.sliderMarks,
      min: currentSelection.sliderBounds.min,
      max: currentSelection.sliderBounds.max,
      "aria-labelledby": "year-label",
      valueLabelDisplay: "auto",
      valueLabelFormat: function valueLabelFormat(value) {
        return value;
      },
      onChange: function onChange(event, newYear) {
        return handleSliderChange(parseInt(newYear, 10));
      }
    })), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        flexGrow: 0
      }
    }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
      "data-selenium": "aop-data-viewer.next-year-button",
      size: "small",
      color: "primary",
      "aria-label": "next year",
      style: {
        marginLeft: _Theme.default.spacing(0.5)
      },
      onClick: function onClick() {
        return handleSliderButtonClick('next');
      },
      disabled: currentSelection.year === currentSelection.sliderBounds.max - 1
    }, /*#__PURE__*/_react.default.createElement(_KeyboardArrowRight.default, null))));
  };

  var renderFlightSelect = function renderFlightSelect() {
    var site = currentSelection.site,
        year = currentSelection.year,
        flight = currentSelection.flight;

    if (!flight || !data[site] || !data[site][year] || !data[site][year].length) {
      return null;
    }

    var total = data[site][year].length;

    var getFlightLabel = function getFlightLabel(flightNumber, month) {
      return "".concat(flightNumber, "/").concat(total, " (").concat((0, _dateformat.default)(new Date("2000-".concat(month, "-02")), 'mmmm'), ")");
    };

    return /*#__PURE__*/_react.default.createElement(_Select.default, {
      "data-selenium": "aop-data-viewer.flight-select",
      value: flight,
      onChange: function onChange(event) {
        return handleFlightChange(parseInt(event.target.value, 10));
      },
      input: /*#__PURE__*/_react.default.createElement(_OutlinedInput.default, {
        name: "flight",
        id: "flight",
        margin: "dense"
      }),
      "aria-labelledby": "flight-label",
      renderValue: function renderValue(value) {
        return getFlightLabel(value, data[site][year][value - 1].month);
      },
      disabled: total === 1
    }, data[site][year].map(function (f, idx) {
      return /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
        key: "".concat(f.url),
        value: idx + 1
      }, getFlightLabel(idx + 1, f.month));
    }));
  };

  var renderInputLabel = function renderInputLabel(input) {
    var tooltip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    return /*#__PURE__*/_react.default.createElement(_Typography.default, {
      className: classes.label,
      id: "".concat(input, "-label")
    }, "".concat(input.substr(0, 1).toUpperCase()).concat(input.substr(1)), tooltip ? /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      placement: "right",
      title: tooltip,
      interactive: true
    }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
      size: "small",
      className: classes.tooltipIconButton,
      "aria-label": tooltip
    }, /*#__PURE__*/_react.default.createElement(_InfoOutlined.default, {
      fontSize: "inherit"
    }))) : null);
  };

  var tooltips = {
    site: 'Use the map or the menu below to select a site to display. Only one site can be viewed at a time.',
    year: 'This slider can be used to move back and forth through time for a given site.',
    flight: 'Most sites are visited once per year, but sometimes subsequent flights are necessary to get complete data for that year. If more than one flight is available for a given site/year then this field can be used to select particular flights of interest.'
  };

  var visusLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
    href: "https://visus.org/",
    target: "_blank",
    "data-external": "VISUS",
    rel: "noopener noreferrer"
  }, "Visus Project at the Univeristy of Utah");

  var renderSelectionForm = function renderSelectionForm() {
    return /*#__PURE__*/_react.default.createElement("form", {
      className: classes.selectionForm,
      autoComplete: "off"
    }, showTitle ? /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h5",
      gutterBottom: true
    }, "AOP Data Viewer") : null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption",
      gutterBottom: true
    }, "This viewer allows for interactive exploration of remotely sensed data from the Airborne Observation Platform (AOP). Change the field site and flight for this data product using the tools below to stream different data into view. Pan and zoom in the view to stream higher resolution imagery. This pilot data viewer is provided through a collaboration with the ", visusLink, " and more updates are planned for the future."), /*#__PURE__*/_react.default.createElement(_Divider.default, {
      className: classes.divider
    }), belowSm ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Grid.default, {
      container: true,
      spacing: 2,
      justifyContent: "center",
      style: {
        marginBottom: _Theme.default.spacing(1)
      }
    }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 2
    }, renderInputLabel('site', tooltips.site)), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 10
    }, renderSiteSelect())), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      container: true,
      spacing: 2,
      justifyContent: "center",
      style: {
        marginBottom: _Theme.default.spacing(1)
      }
    }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 2
    }, renderInputLabel('year', tooltips.year)), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 10
    }, renderYearSlider())), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      container: true,
      spacing: 2,
      justifyContent: "center",
      style: {
        marginBottom: _Theme.default.spacing(1)
      }
    }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 2
    }, renderInputLabel('flight', tooltips.flight)), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 10
    }, renderFlightSelect()))) : /*#__PURE__*/_react.default.createElement("div", {
      style: {
        width: '100%',
        display: 'flex'
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        flexGrow: 0
      }
    }, renderInputLabel('site', tooltips.site), renderSiteSelect()), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        flexGrow: 1,
        margin: _Theme.default.spacing(0, 2)
      }
    }, renderInputLabel('year', tooltips.year), renderYearSlider()), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        flexGrow: 0
      }
    }, renderInputLabel('flight', tooltips.flight), renderFlightSelect())));
  };

  if (fetchFailed) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.iframeContainer
    }, /*#__PURE__*/_react.default.createElement(_SnackbarContent.default, {
      style: {
        backgroundColor: _Theme.default.palette.error.main
      },
      message: /*#__PURE__*/_react.default.createElement("span", {
        style: {
          display: 'flex',
          alignItems: 'center'
        }
      }, /*#__PURE__*/_react.default.createElement(_Warning.default, {
        style: {
          marginRight: _Theme.default.spacing(1)
        }
      }), "AOP Data Viewer is not available for this data product.")
    }));
  }

  var srcUrl = getCurrentIframeSrc();
  return /*#__PURE__*/_react.default.createElement(_FullWidthVisualization.default, {
    vizRef: iframeRef,
    minWidth: MIN_IFRAME_WIDTH,
    allowHeightResize: fillContainer,
    deriveHeightFromWidth: !fillContainer ? 'auto' : function (width, container, viz) {
      return container.clientHeight - viz.offsetTop - 10;
    },
    containerStyle: !fillContainer ? null : {
      minWidth: "".concat(MIN_IFRAME_WIDTH, "px"),
      position: 'absolute',
      top: _Theme.default.spacing(3),
      left: _Theme.default.spacing(3),
      right: _Theme.default.spacing(3),
      bottom: _Theme.default.spacing(3),
      overflowX: 'hidden',
      overflowY: 'auto'
    },
    "data-selenium": "aop-data-viewer"
  }, renderSelectionForm(), /*#__PURE__*/_react.default.createElement("iframe", {
    src: srcUrl,
    title: getDataSetTitle(currentSelection),
    ref: iframeRef,
    scrolling: "no",
    className: classes.iframe
  }), !showOpenInNewWindow ? null : /*#__PURE__*/_react.default.createElement(_Link.default, {
    href: srcUrl,
    target: "_blank",
    rel: "noopener noreferrer",
    className: classes.openInNewLink
  }, /*#__PURE__*/_react.default.createElement(_OpenInNew.default, {
    className: classes.openInNewIcon
  }), "Open in New Window"));
};

AopDataViewer.propTypes = {
  productCode: _propTypes.default.string.isRequired,
  showTitle: _propTypes.default.bool,
  initialSite: _propTypes.default.string,
  initialYear: _propTypes.default.number,
  initialFlight: _propTypes.default.number,
  fillContainer: _propTypes.default.bool,
  showOpenInNewWindow: _propTypes.default.bool
};
AopDataViewer.defaultProps = {
  showTitle: true,
  initialSite: null,
  initialYear: null,
  initialFlight: null,
  fillContainer: false,
  showOpenInNewWindow: false
};

var WrappedAopDataViewer = _Theme.default.getWrappedComponent(_NeonContext.default.getWrappedComponent(AopDataViewer));

var _default = WrappedAopDataViewer;
exports.default = _default;