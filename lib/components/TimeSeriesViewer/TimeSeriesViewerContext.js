"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.summarizeTimeSteps = exports.getTestableItems = exports.default = exports.Y_AXIS_RANGE_MODE_DETAILS = exports.Y_AXIS_RANGE_MODES = exports.TabComponentPropTypes = exports.TIME_STEPS = exports.TIME_SERIES_VIEWER_STATUS_TITLES = exports.DEFAULT_STATE = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireWildcard(require("prop-types"));
var _moment = _interopRequireDefault(require("moment"));
var _get = _interopRequireDefault(require("lodash/get"));
var _uniqueId = _interopRequireDefault(require("lodash/uniqueId"));
var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));
var _papaparse = require("papaparse");
var _rxjs = require("rxjs");
var _ajax = require("rxjs/ajax");
var _NeonApi = _interopRequireDefault(require("../NeonApi/NeonApi"));
var _NeonGraphQL = _interopRequireDefault(require("../NeonGraphQL/NeonGraphQL"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _rxUtil = require("../../util/rxUtil");
var _typeUtil = require("../../util/typeUtil");
var _parseTimeSeriesData = _interopRequireDefault(require("../../workers/parseTimeSeriesData"));
var _DataPackageParser = _interopRequireDefault(require("../../parser/DataPackageParser"));
var _NeonSignInButtonState = _interopRequireDefault(require("../NeonSignInButton/NeonSignInButtonState"));
var _StateStorageService = _interopRequireDefault(require("../../service/StateStorageService"));
var _StateStorageConverter = require("./StateStorageConverter");
var _constants = require("./constants");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
// 'get' is a reserved word so can't be imported with import
// eslint-disable-next-line import/extensions
var lodashGet = require('lodash/get.js');
var VIEWER_MODE = {
  DEFAULT: 'DEFAULT',
  STATIC: 'STATIC'
};

// Every possible status a single fetch request can have
var FETCH_STATUS = {
  AWAITING_CALL: 'AWAITING_CALL',
  FETCHING: 'FETCHING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS'
};
var TIME_SERIES_VIEWER_STATUS_TITLES = {
  INIT_PRODUCT: 'Loading data product…',
  LOADING_META: 'Loading site positions, variables, and data paths…',
  READY_FOR_DATA: 'Loading series data…',
  LOADING_DATA: 'Loading series data…',
  READY_FOR_SERIES: 'Parsing series data…',
  ERROR: null,
  READY: null
};

// List of common date-time variable names to use for the x axis ordered by preference
exports.TIME_SERIES_VIEWER_STATUS_TITLES = TIME_SERIES_VIEWER_STATUS_TITLES;
var PREFERRED_DATETIME_VARIABLES = ['startDateTime', 'endDateTime', 'startDate', 'endDate'];

// Keys, details, and supporting functions for all possible Y-axis range modes
var Y_AXIS_RANGE_MODES = {
  CENTERED: 'CENTERED',
  FROM_ZERO: 'FROM_ZERO',
  CUSTOM: 'CUSTOM'
};
exports.Y_AXIS_RANGE_MODES = Y_AXIS_RANGE_MODES;
var Y_AXIS_RANGE_MODE_DETAILS = {
  CENTERED: {
    name: 'Centered',
    description: 'Center data by one standard deviation above and below'
  },
  FROM_ZERO: {
    name: 'From Zero',
    description: 'Range from zero to one standard deviation above data'
  },
  CUSTOM: {
    name: 'Custom',
    description: 'Manually define a minimum and maximum axis range'
  }
};
exports.Y_AXIS_RANGE_MODE_DETAILS = Y_AXIS_RANGE_MODE_DETAILS;
var generateYAxisRange = function generateYAxisRange() {
  var axis = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var rangeMode = axis.rangeMode,
    _axis$dataRange = axis.dataRange,
    dataRange = _axis$dataRange === void 0 ? [0, 0] : _axis$dataRange,
    _axis$standardDeviati = axis.standardDeviation,
    standardDeviation = _axis$standardDeviati === void 0 ? 0 : _axis$standardDeviati,
    _axis$precision = axis.precision,
    precision = _axis$precision === void 0 ? 0 : _axis$precision,
    axisRange = axis.axisRange;
  if (!Object.keys(Y_AXIS_RANGE_MODES).includes(rangeMode) || !Number.isFinite(standardDeviation) || !Number.isFinite(precision)) {
    return axisRange;
  }
  // Most of the time the margin for our auto-generated axis range is one standard deviation above
  // and below our high and low values of our data range. Edge cases for when stddev is zero:
  // * Data range is flat at zero: margin of 1
  // * Data range is flat at another value: margin of half the absolute value above and below
  var margin = 1;
  if (standardDeviation !== 0) {
    margin = standardDeviation;
  } else if (dataRange[0] !== 0) {
    margin = Math.abs(dataRange[0] / 2);
  }
  var low = (dataRange[0] || 0) - margin;
  var high = (dataRange[1] || 0) + margin;
  low = parseFloat(low.toFixed(precision), 10);
  high = parseFloat(high.toFixed(precision), 10);
  if (rangeMode === Y_AXIS_RANGE_MODES.FROM_ZERO) {
    return [0, high];
  }
  if (rangeMode === Y_AXIS_RANGE_MODES.CENTERED) {
    return [low, high];
  }
  return axisRange;
};

// PropTypes for any Tab Component (or component within a tab) for gettingsetSelectedTab
// and TAB_IDS as props. This is used by anything in a tab wanting to afford the ability to
// route the user to another tab.
var TabComponentPropTypes = {
  setSelectedTab: _propTypes.default.func.isRequired,
  TAB_IDS: _propTypes.default.objectOf(_propTypes.default.string).isRequired
};

/**
   Context and Hook Setup
*/
exports.TabComponentPropTypes = TabComponentPropTypes;
var DEFAULT_AXIS_STATE = {
  units: null,
  logscale: false,
  dataRange: [null, null],
  precision: 0,
  standardDeviation: 0,
  rangeMode: Y_AXIS_RANGE_MODES.CENTERED,
  axisRange: [0, 0]
};
var DEFAULT_STATE = {
  mode: VIEWER_MODE.DEFAULT,
  status: _constants.TIME_SERIES_VIEWER_STATUS.INIT_PRODUCT,
  displayError: null,
  fetchProduct: {
    status: FETCH_STATUS.AWAITING_CALL,
    error: null
  },
  metaFetches: {},
  dataFetches: {},
  dataFetchProgress: 0,
  variables: {},
  product: {
    productCode: null,
    productName: null,
    productDescription: null,
    productSensor: null,
    dateRange: [null, null],
    continuousDateRange: [],
    sites: {}
  },
  fetchReleases: {
    status: FETCH_STATUS.AWAITING_CALL,
    error: null
  },
  release: null,
  releases: [],
  graphData: {
    data: [],
    qualityData: [],
    monthOffsets: {},
    timestampMap: {},
    series: [],
    labels: ['x'],
    qualityLabels: ['start', 'end']
  },
  selection: {
    dateRange: [null, null],
    continuousDateRange: [],
    variables: [],
    derivedVariableTable: {},
    dateTimeVariable: null,
    sites: [],
    timeStep: 'auto',
    // The visible selected timeStep, as per what's available, or 'auto'
    autoTimeStep: null,
    // The functional timeStep if the selection is 'auto'
    qualityFlags: [],
    rollPeriod: 1,
    logscale: false,
    // Per-axis logscale is not supported in dygraphs. It's stubbed here in state.
    yAxes: {
      y1: (0, _cloneDeep.default)(DEFAULT_AXIS_STATE),
      y2: (0, _cloneDeep.default)(DEFAULT_AXIS_STATE)
    },
    isDefault: true
  },
  availableQualityFlags: new Set(),
  availableTimeSteps: new Set(['auto'])
};
exports.DEFAULT_STATE = DEFAULT_STATE;
var Context = /*#__PURE__*/(0, _react.createContext)((0, _cloneDeep.default)(DEFAULT_STATE));
var useTimeSeriesViewerState = function useTimeSeriesViewerState() {
  var hookResponse = (0, _react.useContext)(Context);
  if (hookResponse.length !== 2) {
    return [(0, _cloneDeep.default)(DEFAULT_STATE), function () {}];
  }
  return hookResponse;
};

/**
   Time Step Definitions and Functions
*/
var TIME_STEPS = {
  '1min': {
    key: '1min',
    matchFileTableSuffix: ['1min', '1_min', '1minute', '1_minute'],
    tmi: '001',
    seconds: 60
  },
  '2min': {
    key: '2min',
    matchFileTableSuffix: ['2min', '2_min', '2minute', '2_minute', '2minutes', '2_minutes'],
    tmi: '002',
    seconds: 120
  },
  '5min': {
    key: '5min',
    matchFileTableSuffix: ['5min', '5_min', '5minute', '5_minute', '5minutes', '5_minutes'],
    tmi: '005',
    seconds: 300
  },
  '15min': {
    key: '15min',
    matchFileTableSuffix: ['15min', '15_min', '15minute', '15_minute', '15minutes', '15_minutes'],
    tmi: '015',
    seconds: 900
  },
  '30min': {
    key: '30min',
    matchFileTableSuffix: ['30min', '30_min', '30minute', '30_minute', '30minutes', '30_minutes'],
    tmi: '030',
    seconds: 1800
  },
  '60min': {
    key: '60min',
    matchFileTableSuffix: ['60min', '60_min', '60minute', '60_minute', '60minutes', '60_minutes'],
    tmi: '060',
    seconds: 3600
  },
  '0AQ': {
    key: '0AQ',
    matchFileTableSuffix: ['0AQ', '0_AQ'],
    tmi: '100',
    seconds: 60
  },
  '1day': {
    key: '1day',
    matchFileTableSuffix: ['1day', '1_day'],
    tmi: '01D',
    seconds: 86400
  }
};
exports.TIME_STEPS = TIME_STEPS;
var getTimeStep = function getTimeStep() {
  var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return Object.keys(TIME_STEPS).find(function (key) {
    return TIME_STEPS[key].tmi === input;
  }) || null;
};
var matchTimeStepForTableName = function matchTimeStepForTableName(key) {
  var tableName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var allowDefaultFallthrough = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return tableName.endsWith("_".concat(key)) || TIME_STEPS[key].matchFileTableSuffix.some(function (suffix) {
    return tableName.endsWith("_".concat(suffix));
  }) || allowDefaultFallthrough;
};
var getTimeStepForTableName = function getTimeStepForTableName() {
  var tableName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var useDefault = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return Object.keys(TIME_STEPS).find(function (key) {
    return matchTimeStepForTableName(key, tableName);
  }) || (useDefault ? 'default' : null);
};
var summarizeTimeSteps = function summarizeTimeSteps(steps) {
  var timeStep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var pluralize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  if (steps === 1) {
    return 'none';
  }
  var timeStepSeconds = timeStep && TIME_STEPS[timeStep] ? TIME_STEPS[timeStep].seconds : 1800;
  var seconds = steps * timeStepSeconds;
  var breaks = [60, 3600, 86400, 2592000, 31536000];
  var intervals = ['minute', 'hour', 'day', 'month', 'year'];
  var breakIdx = breaks.reduce(function (acc, cur, idx) {
    return seconds > cur ? idx : acc;
  }, 0);
  var value = (seconds / breaks[breakIdx]).toFixed(1);
  if (value.slice(value.length - 1) === '0') {
    value = value.slice(0, value.length - 2);
  }
  var plural = pluralize ? 's' : '';
  return "".concat(value, " ").concat(intervals[breakIdx]).concat(plural);
};

// Array offsets and validators for use when splitting a data file URL
exports.summarizeTimeSteps = summarizeTimeSteps;
var DATA_FILE_PARTS = {
  POSITION_H: {
    offset: 6,
    isValid: function isValid(p) {
      return /^[\d]{3}$/.test(p);
    }
  },
  POSITION_V: {
    offset: 7,
    isValid: function isValid(p) {
      return /^[\d]{3}$/.test(p);
    }
  },
  TIME_STEP: {
    offset: 8,
    isValid: function isValid(p) {
      return Object.keys(TIME_STEPS).some(function (t) {
        return TIME_STEPS[t].tmi === p;
      });
    }
  },
  TABLE: {
    offset: 9,
    isValid: function isValid(p) {
      return /^[\w]+$/.test(p) && Object.keys(TIME_STEPS).some(function (key) {
        return matchTimeStepForTableName(key, p, true);
      });
    }
  },
  MONTH: {
    offset: 10,
    isValid: function isValid(p) {
      return /^[\d]{4}-[\d]{2}$/.test(p);
    }
  },
  PACKAGE_TYPE: {
    offset: 11,
    isValid: function isValid(p) {
      return ['basic', 'expanded'].includes(p);
    }
  },
  EXTENSION: {
    offset: 13,
    isValid: function isValid(p) {
      return p === 'csv';
    }
  }
};

/**
   CSV Fetch/Parse Functions
*/
// const siteMonthCancelation$ = new Subject();
var fetchCSV = function fetchCSV(url) {
  return (0, _ajax.ajax)({
    method: 'GET',
    crossDomain: true,
    responseType: 'text',
    url: url
  });
};
var parseCSV = function parseCSV(rawCsv) {
  var dedupeLines = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var csv = !dedupeLines ? rawCsv : _toConsumableArray(new Set(rawCsv.split('\n'))).join('\n');
  return (0, _papaparse.parse)(csv, {
    header: true,
    skipEmptyLines: 'greedy'
    // dynamicTyping: true,
  });
};

/**
  Value Range Function
  This function takes an existing value range (array of exactly two numbers or nulls) and a new
  value. If the value is a number or an array of numbers (e.g. another value range) it'll be
  compared against the low and high ends of the existing range so as to expand the range to
  accomodate it.
*/
var getUpdatedValueRange = function getUpdatedValueRange(existingRange, newValue) {
  var arrayVal = Array.isArray(newValue) ? newValue : [newValue];
  if (arrayVal.some(function (v) {
    return typeof v !== 'number';
  })) {
    return existingRange;
  }
  var newRange = _toConsumableArray(existingRange);
  arrayVal.forEach(function (v) {
    if (newRange[0] === null || newRange[0] > v) {
      newRange[0] = v;
    }
    if (newRange[1] === null || newRange[1] < v) {
      newRange[1] = v;
    }
  });
  return newRange;
};

/**
 * Generate a continuous list of "YYYY-MM" strings given an input date range
 * Will extend beginning and end of date range to encompass whole years
 * (e.g. ['2012-06', '2017-08'] => ['2012-01', '2012-02', ..., '2017-12', '2018-01']
 * Note that in order for the range to actuall appear showing the whole year the following
 * January must also be added.
 * @param {Array} dateRange - array of exactly two "YYYY-MM" strings
 * @param {boolean} roundToYears - if true then extend each side of the range to whole years
 */
var getContinuousDatesArray = function getContinuousDatesArray(dateRange) {
  var roundToYears = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var dateRegex = /^\d{4}-\d{2}$/;
  if (!Array.isArray(dateRange) || dateRange.length !== 2 || dateRange[1] < dateRange[0] || !dateRegex.test(dateRange[0]) || !dateRegex.test(dateRange[1])) {
    return [];
  }
  if (dateRange.length === 2 && dateRange[0] === dateRange[1]) {
    return [dateRange[0]];
  }
  var startMoment = (0, _moment.default)("".concat(dateRange[0], "-20"));
  var endMoment = (0, _moment.default)("".concat(dateRange[1], "-10")).add(1, 'months');
  if (roundToYears) {
    startMoment = (0, _moment.default)("".concat(dateRange[0], "-20")).startOf('year');
    endMoment = (0, _moment.default)("".concat(dateRange[1], "-10")).endOf('year').add(1, 'months');
  }
  var continuousRange = [];
  var months = 0;
  var MAX_MONTHS = 960; // If we're going more than 80 years then maybe something is wrong?
  while (startMoment.isBefore(endMoment) && months < MAX_MONTHS) {
    continuousRange.push(startMoment.format('YYYY-MM'));
    startMoment.add(1, 'months');
    months += 1;
  }
  return continuousRange;
};

/**
 * Build an object for state.product from a product data fetch response
 * @param {Object} productData - JSON parse response from product data endpoint
 * @return {Object} new product object to be applied at state.product
 */
var parseProductData = function parseProductData() {
  var productData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var product = {
    productCode: productData.productCode,
    productName: productData.productName,
    productDescription: productData.productDescription,
    productSensor: productData.productSensor || null,
    dateRange: [null, null],
    variables: {},
    sites: {}
  };
  product.dateRange = (productData.siteCodes || []).reduce(function (acc, site) {
    if (!Array.isArray(site.availableMonths) || !site.availableMonths.length) {
      return acc;
    }
    product.sites[site.siteCode] = {
      fetches: {
        siteMonths: {},
        positions: {
          status: FETCH_STATUS.AWAITING_CALL,
          error: null,
          url: null
        },
        variables: {
          status: FETCH_STATUS.AWAITING_CALL,
          error: null,
          url: null
        }
      },
      availableMonths: site.availableMonths,
      availableReleases: site.availableReleases,
      variables: new Set(),
      positions: {}
    };
    var start = site.availableMonths[0];
    var end = site.availableMonths[site.availableMonths.length - 1];
    return [acc[0] === null || acc[0] > start ? start : acc[0], acc[1] === null || acc[1] < end ? end : acc[1]];
  }, [null, null]);
  product.continuousDateRange = getContinuousDatesArray(product.dateRange, true);
  return product;
};

/**
 * Build an object for state.product.sites[{site}] from a product/site/month fetch response
 * @param {Object} site - single site object from previous state.product.sites
 * @param {Array} files - list of file objects parsed from product/site/month fetch response
 * @return {Object}
 * @return {Object} siteObject - updated site object to be applied at state.product.sites[{site}]
 * @return {Set} availableTimeSteps - set containing time steps available for this site month
 * @return {Boolean} metaFetchQueued - whether any meta fetches (variables or positions) were queued
 */
var parseSiteMonthData = function parseSiteMonthData(site, files) {
  var newSite = _extends({}, site);
  var availableTimeSteps = new Set();
  files.forEach(function (file) {
    var name = file.name,
      url = file.url;
    // Must be a CSV file
    if (!/\.csv$/.test(name)) {
      return;
    }
    // Must not be a variables or positions file
    if (name.includes('variables')) {
      if (!newSite.fetches.variables.url) {
        newSite.fetches.variables.url = url;
      }
      return;
    }
    if (name.includes('sensor_positions')) {
      if (!newSite.fetches.positions.url) {
        newSite.fetches.positions.url = url;
      }
      return;
    }
    if (name.includes('science_review_flags')) {
      return;
    }
    // Split file name by (.); all DATA_FILE_PARTS validators must point to a valid part
    var parts = name.split('.');
    if (Object.keys(DATA_FILE_PARTS).some(function (part) {
      var _DATA_FILE_PARTS$part = DATA_FILE_PARTS[part],
        offset = _DATA_FILE_PARTS$part.offset,
        isValid = _DATA_FILE_PARTS$part.isValid;
      return !isValid(parts[offset]);
    })) {
      return;
    }
    // Extract parts
    var position = "".concat(parts[DATA_FILE_PARTS.POSITION_H.offset], ".").concat(parts[DATA_FILE_PARTS.POSITION_V.offset]);
    var month = parts[DATA_FILE_PARTS.MONTH.offset];
    var packageType = parts[DATA_FILE_PARTS.PACKAGE_TYPE.offset];
    var timeStep = getTimeStep(parts[DATA_FILE_PARTS.TIME_STEP.offset]);
    var tableName = parts[DATA_FILE_PARTS.TABLE.offset];
    // Timestep must be valid
    if (timeStep === null) {
      return;
    }
    // All is good, add the timestep and add file information to the site object
    availableTimeSteps.add(timeStep);
    if (!newSite.positions[position]) {
      newSite.positions[position] = {
        data: {},
        history: []
      };
    }
    if (!newSite.positions[position].data[month]) {
      newSite.positions[position].data[month] = {};
    }
    if (!newSite.positions[position].data[month][packageType]) {
      newSite.positions[position].data[month][packageType] = {};
    }
    if (!newSite.positions[position].data[month][packageType][timeStep]) {
      newSite.positions[position].data[month][packageType][timeStep] = {};
    }
    newSite.positions[position].data[month][packageType][timeStep][tableName] = {
      url: url,
      status: FETCH_STATUS.AWAITING_CALL,
      error: null,
      series: {}
    };
  });
  return {
    siteObject: newSite,
    availableTimeSteps: availableTimeSteps
  };
};

/**
 * Build a set of data to update various parts of state from a product/site variables fetch response
 * Goal 1: Expand state.variables to include anything new from this variables fetch
 * Goal 2: Store a list of these variable names on the site in state (differentiate global/local)
 * @param {Object} previousVariables - previous state.variables object
 * @param {string} siteCode - 4-letter site code identifying the response (e.g. 'ABBY')
 * @param {string} csv - unparsed CSV string from a product/site variables fetch response
 *
 * @typedef {Object} ParseSiteVariablesReturn
 * @property {Set} variablesSet - set of all variable names to be stored in state at the site level
 * @property {Object} variablesObject - updated object to be applied at state.variables
 *
 * @return {ParseSiteVariablesReturn}
 */
var parseSiteVariables = function parseSiteVariables(previousVariables, siteCode, csv) {
  var newStateVariables = _extends({}, previousVariables);
  var variables = parseCSV(csv);
  // Build a list of tables we care about. Some products include maintenance tables that should
  // be ignored altogether. Presently our best mechanism to differentiate is that maintenance
  // tables will all have a 'uid' field.
  var tablesWithUid = {};
  variables.data.forEach(function (variable) {
    var table = variable.table,
      fieldName = variable.fieldName;
    tablesWithUid[table] = tablesWithUid[table] || fieldName === 'uid';
  });
  var validTables = new Set(Object.keys(tablesWithUid).filter(function (k) {
    return !tablesWithUid[k];
  }));
  var ignoreTables = new Set(['sensor_positions', 'science_review_flags']);
  // Build the set of variables using only the valid tables
  var variablesSet = new Set();
  variables.data.filter(function (variable) {
    return validTables.has(variable.table) && !ignoreTables.has(variable.table);
  }).forEach(function (variable) {
    var table = variable.table,
      fieldName = variable.fieldName,
      description = variable.description,
      dataType = variable.dataType,
      units = variable.units,
      downloadPkg = variable.downloadPkg;
    var timeStep = getTimeStepForTableName(table, true);
    var isSelectable = variable.dataType !== 'dateTime' && variable.units !== 'NA' && !/QF$/.test(fieldName);
    var canBeDefault = isSelectable && variable.downloadPkg !== 'expanded' && !/QM$/.test(fieldName);
    variablesSet.add(fieldName);
    if (!newStateVariables[fieldName]) {
      newStateVariables[fieldName] = {
        dataType: dataType,
        description: description,
        downloadPkg: downloadPkg,
        units: units,
        tables: new Set(),
        timeSteps: new Set(),
        sites: new Set(),
        isSelectable: isSelectable,
        canBeDefault: canBeDefault,
        isDateTime: variable.dataType === 'dateTime'
      };
    }
    newStateVariables[fieldName].tables.add(table);
    newStateVariables[fieldName].timeSteps.add(timeStep);
    newStateVariables[fieldName].sites.add(siteCode);
  });
  return {
    variablesSet: variablesSet,
    variablesObject: newStateVariables
  };
};
var parsePosition = function parsePosition(position) {
  if (!(0, _typeUtil.exists)(position)) return position;
  return _DataPackageParser.default.parseSensorPosition(position);
};

/**
 * Build an object for state.product.sites[{site}] from a product/site positions fetch response
 * The site object should already have site position ids from the product/site/month fetch, so the
 * main goal here is to fill in all the other position metadata that comes from the positions fetch
 * @param {Object} site - single site object from previous state.product.sites
 * @param {string} csv - unparsed CSV string from a product/site positions fetch response
 * @return {Object} updated site object to be applied at state.product.sites[{site}]
 */
var parseSitePositions = function parseSitePositions(site, csv) {
  var newSite = _extends({}, site);
  var positions = parseCSV(csv, true); // Duplicated lines have been unintentionally seen here!
  positions.data.forEach(function (position) {
    var parsedPosition = parsePosition(position);
    if ((0, _typeUtil.exists)(parsedPosition)) {
      var posId = parsedPosition.horVer;
      if (!newSite.positions[posId]) {
        newSite.positions[posId] = {
          data: {},
          history: []
        };
      }
      newSite.positions[posId].history.push(parsedPosition);
    }
  });
  // Sort position history by start/end time descending
  Object.keys(newSite.positions).forEach(function (posId) {
    newSite.positions[posId].history.sort(function (a, b) {
      if (!a.sensorEndDateTime) {
        return 1;
      }
      return a.sensorEndDateTime < b.sensorStartDateTime ? -1 : 1;
    });
  });
  return newSite;
};

/**
 * Build an updated state.selection object to fill in sane defaults from current state.
 * The goal is to have the selection always be valid and as complete as possible. For example,
 * as soon as the first variables request has completed and been parsed into state, select a
 * basic package variable if no variables have been selected (i.e. on first load).
 * This function should only ever fill in gaps in selection from what's currently available in
 * state, and therefore should be idempotent. It also generates a new digest (stringified portion
 * of selection) to ensure the selection change effect is triggered on every meainingful change.
 * @param {Object} state - current state object
 * @param {Set} invalidDefaultVariables - set of invalid default variables (null data)
 * @return {Object} updated object to apply to state.selection
 */
var applyDefaultsToSelection = function applyDefaultsToSelection(state) {
  var invalidDefaultVariables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Set();
  var status = state.status,
    product = state.product,
    variables = state.variables,
    selection = state.selection;
  if (!Object.keys(product.sites).length) {
    return selection;
  }
  // Sites - Ensure the selection has at least one site (default to first in list)
  if (!selection.sites.length) {
    var siteCodes = Object.keys(product.sites);
    siteCodes.sort();
    selection.sites.push({
      siteCode: siteCodes[0],
      positions: []
    });
  }
  // Date Range - Ensure the selection has a date range (default to latest month)
  if (selection.dateRange[0] === null || selection.dateRange[1] === null) {
    var availableMonths = product.sites[selection.sites[0].siteCode].availableMonths;
    var initialMonth = availableMonths[availableMonths.length - 1];
    selection.dateRange = [initialMonth, initialMonth];
  }
  // Positions - Ensure every selected site has at least one selected position
  selection.sites.forEach(function (site, idx) {
    if (site.positions.length > 0) {
      return;
    }
    var siteCode = site.siteCode;
    var positions = Object.keys(state.product.sites[siteCode].positions);
    if (!positions.length) {
      return;
    }
    positions.sort();
    selection.sites[idx].positions.push(positions[0]);
  });
  // Variables
  selection.derivedVariableTable = {};
  var foundVarWithData = false;
  var hasVariablesSelected = Array.isArray(selection.variables) && selection.variables.length > 0;
  if (Object.keys(variables).length) {
    // Ensure the selection has at least one variable
    if (!hasVariablesSelected) {
      var defaultVar = Object.keys(variables).find(function (v) {
        return variables[v].canBeDefault && !invalidDefaultVariables.has(v);
      });
      if (defaultVar) {
        selection.variables.push(defaultVar);
        selection.yAxes.y1.units = variables[defaultVar].units;
      }
    }
    // Ensure the selection has at least one dateTime variable. Use the PREFERRED_DATETIME_VARIABLES
    // list to sort the existing date time variables in order of preference and take the first one.
    if (!selection.dateTimeVariable) {
      var dateTimeVars = Object.keys(variables).filter(function (v) {
        return variables[v].isDateTime;
      });
      if (dateTimeVars.length) {
        dateTimeVars.sort(function (a, b) {
          var aIdx = PREFERRED_DATETIME_VARIABLES.indexOf(a);
          var bIdx = PREFERRED_DATETIME_VARIABLES.indexOf(b);
          if (aIdx === bIdx) {
            return 0;
          }
          if (aIdx === -1 && bIdx !== -1) {
            return 1;
          }
          if (aIdx !== -1 && bIdx === -1) {
            return -1;
          }
          return aIdx < bIdx ? -1 : 1;
        });
        selection.dateTimeVariable = dateTimeVars[0]; // eslint-disable-line prefer-destructuring
      }
    }
  }
  // Generate a new continuous date range from the dateRange (which only contains bounds)
  selection.continuousDateRange = getContinuousDatesArray(selection.dateRange);
  // Generate new cumulative data ranges and standard deviations for all applicable y axes.
  var timeStep = selection.timeStep,
    autoTimeStep = selection.autoTimeStep;
  var dataTimeStep = timeStep === 'auto' ? autoTimeStep : timeStep;
  Object.keys(selection.yAxes).forEach(function (yAxis) {
    if (selection.yAxes[yAxis].units === null) {
      return;
    }
    var combinedSum = 0;
    var combinedCount = 0;
    var monthCounts = [];
    var monthMeans = [];
    var monthVariances = [];
    selection.yAxes[yAxis].dataRange = [null, null];
    selection.yAxes[yAxis].standardDeviation = 0;
    selection.variables.filter(function (variable) {
      return variables[variable].units === selection.yAxes[yAxis].units;
    }).forEach(function (variable) {
      var pkg = variables[variable].downloadPkg;
      selection.sites.forEach(function (site) {
        var siteCode = site.siteCode,
          positions = site.positions;
        positions.forEach(function (position) {
          selection.continuousDateRange.forEach(function (month) {
            if (!variables[variable].tables) {
              return;
            }
            var timeStepTables = lodashGet(product.sites[siteCode].positions[position], "data['".concat(month, "']['").concat(pkg, "']['").concat(dataTimeStep, "']"), {});
            // Attempt to find a table with data for the specified
            // variable (associated tables) and time step
            var tableWithSeries = Array.from(variables[variable].tables).find(function (table) {
              var timeStepTable = timeStepTables[table];
              var variableTableTimeStep = getTimeStepForTableName(table, true);
              if (timeStepTable && timeStepTable.series) {
                if (variableTableTimeStep && variableTableTimeStep.localeCompare(dataTimeStep) === 0) {
                  var checkSeries = timeStepTable.series[variable];
                  return checkSeries && checkSeries.count;
                }
                if (variableTableTimeStep === 'default') {
                  return true;
                }
              }
              return false;
            });
            var series = tableWithSeries ? timeStepTables[tableWithSeries].series[variable] : null;
            if (!series || !series.count) {
              return;
            }
            foundVarWithData = true;
            selection.derivedVariableTable[variable] = tableWithSeries;
            combinedSum += series.sum;
            combinedCount += series.count;
            monthCounts.push(series.count);
            monthMeans.push(series.sum / series.count);
            monthVariances.push(series.variance);
            selection.yAxes[yAxis].dataRange = getUpdatedValueRange(selection.yAxes[yAxis].dataRange, series.range);
          });
        });
      });
    });
    if (combinedCount > 0) {
      var dataRangeMax = selection.yAxes[yAxis].dataRange[1];
      var precision = dataRangeMax === null || dataRangeMax <= 0 ? 0 : Math.abs(Math.floor(Math.min(Math.log10(dataRangeMax), 0))) + (Math.log10(dataRangeMax) >= 2 ? 0 : 2);
      var combinedMean = combinedSum / combinedCount;
      var deviations = monthMeans.map(function (mean) {
        return mean - combinedMean;
      });
      var standardDeviation = Math.pow(monthVariances.reduce(function (sum, variance, idx) {
        return monthCounts[idx] * (variance + Math.pow(deviations[idx], 2));
      }, 0) / combinedCount, 0.5);
      var fixedStandardDeviation = parseFloat(standardDeviation.toFixed(precision), 10);
      selection.yAxes[yAxis].precision = precision;
      selection.yAxes[yAxis].standardDeviation = fixedStandardDeviation;
      selection.yAxes[yAxis].axisRange = generateYAxisRange(selection.yAxes[yAxis]);
    }
  });
  // Edge case: if the default site/month/position/variable produces a series with no data then
  // it wasn't a good default, but we had no way of knowing until the data series was fully parsed.
  // Here we check for this scenario and if we're in it then add the variable to the
  // invalidDefaultVariables set, remove the variable from the selection, and run again.
  // We'll recurse through the variables available for the site/month/position until we find one
  // that works or show a meaningful error instructing the user to select a different site,
  // month, or position.
  if (status === _constants.TIME_SERIES_VIEWER_STATUS.READY_FOR_SERIES && (!hasVariablesSelected || !foundVarWithData && selection.isDefault) && selection.variables.length && selection.yAxes.y1.dataRange.every(function (x) {
    return x === null;
  })) {
    var allowedDefaultVars = Object.keys(variables).filter(function (v) {
      return variables[v].canBeDefault;
    });
    if (allowedDefaultVars.length > invalidDefaultVariables.size) {
      invalidDefaultVariables.add(selection.variables[0]);
      selection.variables = [];
      return applyDefaultsToSelection(_extends({}, state, {
        selection: selection
      }), invalidDefaultVariables);
    }
  }
  // Generate a new digest for effect comparison
  selection.digest = JSON.stringify({
    sites: selection.sites,
    dateRange: selection.dateRange,
    variables: selection.variables,
    qualityFlags: selection.qualityFlags,
    timeStep: selection.timeStep
  });
  return selection;
};
var limitVariablesToTwoUnits = function limitVariablesToTwoUnits(state, variables) {
  var selectedUnits = variables.reduce(function (units, variable) {
    units.add(state.variables[variable].units);
    return units;
  }, new Set());
  if (selectedUnits.size <= 2) {
    return {
      selectedUnits: Array.from(selectedUnits),
      variables: variables
    };
  }
  selectedUnits = new Set(Array.from(selectedUnits).slice(0, 2));
  return {
    selectedUnits: Array.from(selectedUnits),
    variables: variables.filter(function (variable) {
      return selectedUnits.has(state.variables[variable].units);
    })
  };
};
var setDataFileFetchStatuses = function setDataFileFetchStatuses(state, fetches) {
  var newState = _extends({}, state);
  fetches.forEach(function (fetch) {
    var siteCode = fetch.siteCode,
      position = fetch.position,
      month = fetch.month,
      downloadPkg = fetch.downloadPkg,
      timeStep = fetch.timeStep,
      table = fetch.table;
    if (!newState.product || !newState.product.sites || !newState.product.sites[siteCode] || !newState.product.sites[siteCode].positions || !newState.product.sites[siteCode].positions[position] || !newState.product.sites[siteCode].positions[position].data || !newState.product.sites[siteCode].positions[position].data[month] || !newState.product.sites[siteCode].positions[position].data[month][downloadPkg] || !newState.product.sites[siteCode].positions[position].data[month][downloadPkg][timeStep]
    // eslint-disable-next-line max-len
    || !newState.product.sites[siteCode].positions[position].data[month][downloadPkg][timeStep][table]) {
      return;
    }
    newState.product.sites[siteCode].positions[position].data[month][downloadPkg][timeStep][table].status = FETCH_STATUS.FETCHING;
  });
  return newState;
};

/**
   Reducer
*/
var reducer = function reducer(state, action) {
  var newState = _extends({}, state);
  var calcSelection = function calcSelection() {
    newState.selection = applyDefaultsToSelection(newState);
  };
  var calcStatus = function calcStatus() {
    if (newState.status === _constants.TIME_SERIES_VIEWER_STATUS.ERROR) {
      return;
    }
    if (Object.keys(newState.metaFetches).length) {
      newState.status = _constants.TIME_SERIES_VIEWER_STATUS.LOADING_META;
    } else if (Object.keys(newState.dataFetches).length) {
      newState.status = _constants.TIME_SERIES_VIEWER_STATUS.LOADING_DATA;
    } else {
      newState.status = _constants.TIME_SERIES_VIEWER_STATUS.READY_FOR_DATA;
    }
  };
  var softFail = function softFail(error) {
    newState.status = _constants.TIME_SERIES_VIEWER_STATUS.WARNING;
    newState.displayError = error;
    return newState;
  };
  var fail = function fail(error) {
    newState.status = _constants.TIME_SERIES_VIEWER_STATUS.ERROR;
    newState.displayError = error;
    return newState;
  };
  var parsedContent = null;
  var selectedSiteIdx = null;
  switch (action.type) {
    // Reinitialize
    case 'reinitialize':
      newState = (0, _cloneDeep.default)(DEFAULT_STATE);
      newState.product.productCode = action.productCode;
      newState.release = action.release;
      return newState;
    // Fetch Product Actions
    case 'initFetchProductCalled':
      newState.fetchProduct.status = FETCH_STATUS.FETCHING;
      return newState;
    case 'initFetchProductFailed':
      newState.fetchProduct.status = FETCH_STATUS.ERROR;
      newState.fetchProduct.error = action.error;
      newState.status = _constants.TIME_SERIES_VIEWER_STATUS.ERROR;
      newState.displayError = "Unable to load product: ".concat(action.error);
      return newState;
    case 'initFetchProductSucceeded':
      newState.fetchProduct.status = FETCH_STATUS.SUCCESS;
      newState.product = parseProductData(action.productData);
      calcSelection();
      newState.status = _constants.TIME_SERIES_VIEWER_STATUS.LOADING_META;
      return newState;

    // Fetch Releases Actions
    case 'initFetchReleasesCalled':
      newState.fetchReleases.status = FETCH_STATUS.FETCHING;
      return newState;
    case 'initFetchReleasesFailed':
      newState.fetchReleases.status = FETCH_STATUS.ERROR;
      newState.fetchReleases.error = action.error;
      return newState;
    case 'initFetchReleasesSucceeded':
      newState.fetchReleases.status = FETCH_STATUS.SUCCESS;
      newState.releases = action.releases;
      return newState;

    // Fetch Site Month Actions
    case 'fetchSiteMonth':
      if (!action.siteCode || !action.month || !newState.product.sites[action.siteCode]) {
        return state;
      }
      newState.metaFetches["fetchSiteMonth.".concat(action.siteCode, ".").concat(action.month)] = true;
      newState.product.sites[action.siteCode].fetches.siteMonths[action.month] = {
        status: FETCH_STATUS.FETCHING,
        error: null
      };
      newState.status = _constants.TIME_SERIES_VIEWER_STATUS.LOADING_META;
      return newState;
    case 'fetchSiteMonthFailed':
      if (!action.siteCode || !action.month || !state.metaFetches["fetchSiteMonth.".concat(action.siteCode, ".").concat(action.month)]) {
        return state;
      }
      delete newState.metaFetches["fetchSiteMonth.".concat(action.siteCode, ".").concat(action.month)];
      newState.product.sites[action.siteCode].fetches.siteMonths[action.month].status = FETCH_STATUS.ERROR;
      newState.product.sites[action.siteCode].fetches.siteMonths[action.month].error = action.error;
      calcStatus();
      return newState;
    case 'fetchSiteMonthSucceeded':
      if (!action.siteCode || !action.month || !state.metaFetches["fetchSiteMonth.".concat(action.siteCode, ".").concat(action.month)]) {
        return state;
      }
      delete newState.metaFetches["fetchSiteMonth.".concat(action.siteCode, ".").concat(action.month)];
      newState.product.sites[action.siteCode].fetches.siteMonths[action.month].status = FETCH_STATUS.SUCCESS;
      parsedContent = parseSiteMonthData(newState.product.sites[action.siteCode], action.files);
      newState.product.sites[action.siteCode] = parsedContent.siteObject;
      newState.availableTimeSteps = new Set([].concat(_toConsumableArray(state.availableTimeSteps), _toConsumableArray(parsedContent.availableTimeSteps)));
      if (newState.availableTimeSteps.size === 1) {
        // Need more than just 'auto'
        return fail('This data product is not compatible with the Time Series Viewer (no valid time step found)');
      }
      if (state.selection.autoTimeStep === null) {
        newState.selection.autoTimeStep = Array.from(newState.availableTimeSteps).reduce(function (acc, cur) {
          if (cur === 'auto') {
            return acc;
          }
          return acc === null || TIME_STEPS[cur].seconds > TIME_STEPS[acc].seconds ? cur : acc;
        }, null);
      }
      calcSelection();
      if (newState.product.sites[action.siteCode].fetches.variables.status !== FETCH_STATUS.SUCCESS || newState.product.sites[action.siteCode].fetches.positions.status !== FETCH_STATUS.SUCCESS // eslint-disable-line max-len
      ) {
        newState.status = _constants.TIME_SERIES_VIEWER_STATUS.LOADING_META;
      } else {
        calcStatus();
      }
      return newState;

    // Fetch Site Variables Actions
    case 'fetchSiteVariables':
      if (!state.product.sites[action.siteCode]) {
        return state;
      }
      newState.metaFetches["fetchSiteVariables.".concat(action.siteCode)] = true;
      newState.product.sites[action.siteCode].fetches.variables.status = FETCH_STATUS.FETCHING;
      calcStatus();
      return newState;
    case 'fetchSiteVariablesFailed':
      if (!state.product.sites[action.siteCode]) {
        return state;
      }
      delete newState.metaFetches["fetchSiteVariables.".concat(action.siteCode)];
      newState.product.sites[action.siteCode].fetches.variables.status = FETCH_STATUS.ERROR;
      newState.product.sites[action.siteCode].fetches.variables.error = action.error;
      calcStatus();
      return newState;
    case 'fetchSiteVariablesSucceeded':
      if (!state.product.sites[action.siteCode]) {
        return state;
      }
      delete newState.metaFetches["fetchSiteVariables.".concat(action.siteCode)];
      newState.product.sites[action.siteCode].fetches.variables.status = FETCH_STATUS.SUCCESS;
      parsedContent = parseSiteVariables(newState.variables, action.siteCode, action.csv);
      newState.variables = _extends({}, state.variables, parsedContent.variablesObject);
      newState.product.sites[action.siteCode].variables = new Set([].concat(_toConsumableArray(state.product.sites[action.siteCode].variables), _toConsumableArray(parsedContent.variablesSet)));
      newState.availableQualityFlags = new Set([].concat(_toConsumableArray(state.availableQualityFlags), _toConsumableArray(Object.keys(newState.variables).filter(function (v) {
        return /QF$/.test(v);
      }))));
      // A valid dateTime variable must be present otherwise we have no x-axis
      if (Object.keys(newState.variables).every(function (v) {
        return !newState.variables[v].isDateTime;
      })) {
        return fail('This data product is not compatible with the Time Series Viewer (no dateTime data found)');
      }
      calcSelection();
      calcStatus();
      return newState;

    // Regenerate Graph Data Actions
    case 'regenerateGraphData':
      if (!action.graphData.series.length || Object.keys(state.selection.yAxes).every(function (y) {
        return state.selection.yAxes[y].dataRange.every(function (x) {
          return x === null;
        });
      })) {
        return softFail('Current selection of dates/sites/positions/variables does not have any valid numeric data.');
      }
      newState.graphData = action.graphData;
      newState.status = _constants.TIME_SERIES_VIEWER_STATUS.READY;
      return newState;

    // Fetch Site Positions Actions
    case 'fetchSitePositions':
      if (!state.product.sites[action.siteCode]) {
        return state;
      }
      newState.metaFetches["fetchSitePositions.".concat(action.siteCode)] = true;
      newState.product.sites[action.siteCode].fetches.positions.status = FETCH_STATUS.FETCHING;
      calcStatus();
      return newState;
    case 'fetchSitePositionsFailed':
      if (!state.product.sites[action.siteCode]) {
        return state;
      }
      delete newState.metaFetches["fetchSitePositions.".concat(action.siteCode)];
      newState.product.sites[action.siteCode].fetches.positions.status = FETCH_STATUS.ERROR;
      newState.product.sites[action.siteCode].fetches.positions.error = action.error;
      calcStatus();
      return newState;
    case 'fetchSitePositionsSucceeded':
      if (!state.product.sites[action.siteCode]) {
        return state;
      }
      delete newState.metaFetches["fetchSitePositions.".concat(action.siteCode)];
      newState.product.sites[action.siteCode].fetches.positions.status = FETCH_STATUS.SUCCESS;
      newState.product.sites[action.siteCode] = parseSitePositions(newState.product.sites[action.siteCode], action.csv);
      calcSelection();
      calcStatus();
      return newState;

    // Fetch Data Actions (Many Files)
    case 'fetchDataFiles':
      newState.dataFetches[action.token] = true;
      newState = setDataFileFetchStatuses(newState, action.fetches);
      newState.dataFetchProgress = 0;
      newState.status = _constants.TIME_SERIES_VIEWER_STATUS.LOADING_DATA;
      return newState;
    case 'fetchDataFilesProgress':
      newState.dataFetchProgress = action.value;
      return newState;
    case 'fetchDataFilesCompleted':
      if (!state.dataFetches[action.token]) {
        return state;
      }
      delete newState.dataFetches[action.token];
      newState.status = _constants.TIME_SERIES_VIEWER_STATUS.READY_FOR_SERIES;
      calcSelection();
      if (!newState.selection.variables.length) {
        return softFail('None of the variables for this product\'s default site/month/position have data. Please select a different site, month, or position.');
      }
      return newState;
    case 'noDataFilesFetchNecessary':
      newState.status = _constants.TIME_SERIES_VIEWER_STATUS.READY_FOR_SERIES;
      return newState;

    // Static data injection action, ignore fetches
    case 'staticFetchDataFilesCompleted':
      newState.status = _constants.TIME_SERIES_VIEWER_STATUS.READY_FOR_SERIES;
      calcSelection();
      if (!newState.selection.variables.length) {
        return softFail('None of the variables for this product\'s default site/month/position have data. Please select a different site, month, or position.');
      }
      return newState;

    // Fetch Data Actions (Single File)
    case 'fetchDataFileFailed':
      newState.product.sites[action.siteCode].positions[action.position].data[action.month][action.downloadPkg][action.timeStep][action.table].status = FETCH_STATUS.ERROR;
      newState.product.sites[action.siteCode].positions[action.position].data[action.month][action.downloadPkg][action.timeStep][action.table].error = action.error;
      return newState;
    case 'fetchDataFileSucceeded':
      newState.product.sites[action.siteCode].positions[action.position].data[action.month][action.downloadPkg][action.timeStep][action.table].status = FETCH_STATUS.SUCCESS;
      newState.product.sites[action.siteCode].positions[action.position].data[action.month][action.downloadPkg][action.timeStep][action.table].series = action.series;
      return newState;

    // Core Selection Actions
    case 'selectDateRange':
      newState.selection.isDefault = false;
      newState.selection.dateRange = action.dateRange;
      newState.selection.activelySelectingDateRange = action.dateRange;
      calcSelection();
      calcStatus();
      return newState;
    case 'selectVariables':
      newState.selection.isDefault = false;
      parsedContent = limitVariablesToTwoUnits(state, action.variables);
      newState.selection.variables = parsedContent.variables;
      /* eslint-disable prefer-destructuring */
      if (parsedContent.selectedUnits.length === 1) {
        newState.selection.yAxes.y1.units = parsedContent.selectedUnits[0];
        if (newState.selection.yAxes.y2.units === parsedContent.selectedUnits[0]) {
          newState.selection.yAxes.y1.logscale = newState.selection.yAxes.y2.logscale;
        }
        newState.selection.yAxes.y2 = (0, _cloneDeep.default)(DEFAULT_AXIS_STATE);
      } else {
        if (!newState.selection.yAxes.y1.units) {
          newState.selection.yAxes.y1 = (0, _cloneDeep.default)(DEFAULT_AXIS_STATE);
        }
        if (!newState.selection.yAxes.y2.units) {
          newState.selection.yAxes.y2 = (0, _cloneDeep.default)(DEFAULT_AXIS_STATE);
        }
        newState.selection.yAxes.y1.units = parsedContent.selectedUnits[0];
        newState.selection.yAxes.y2.units = parsedContent.selectedUnits[1];
      }
      /* eslint-enable prefer-destructuring */
      calcSelection();
      calcStatus();
      return newState;
    case 'selectYAxisRangeMode':
      if (!state.selection.yAxes[action.axis] || !Object.keys(Y_AXIS_RANGE_MODES).includes(action.mode)) {
        return state;
      }
      newState.selection.isDefault = false;
      newState.selection.yAxes[action.axis].rangeMode = action.mode;
      if (action.mode !== Y_AXIS_RANGE_MODES.CUSTOM) {
        newState.selection.yAxes[action.axis].axisRange = generateYAxisRange(newState.selection.yAxes[action.axis]);
      }
      return newState;
    case 'selectYAxisCustomRange':
      if (!state.selection.yAxes[action.axis]) {
        return state;
      }
      if (!(Array.isArray(action.range) && action.range.length === 2 && action.range.every(function (v) {
        return typeof v === 'number';
      }) && action.range[0] < action.range[1])) {
        return state;
      }
      newState.selection.isDefault = false;
      newState.selection.yAxes[action.axis].axisRange = action.range;
      return newState;
    /*
    // This action works in state but dygraphs does not currently support per-axis logscale. =(
    case 'selectYAxisScale':
      if (!['y1', 'y2'].includes(action.axis)) { return state; }
      newState.selection.yAxes[action.axis].logscale = !!action.logscale;
      console.log(action, newState);
      return newState;
    */
    // Option Selection Actions
    case 'selectLogScale':
      newState.selection.isDefault = false;
      newState.selection.logscale = !!action.logscale;
      return newState;
    case 'selectSwapYAxes':
      newState.selection.isDefault = false;
      if (state.selection.yAxes.y2.units === null) {
        return state;
      }
      parsedContent = {
        y1: (0, _cloneDeep.default)(state.selection.yAxes.y2),
        y2: (0, _cloneDeep.default)(state.selection.yAxes.y1)
      };
      newState.selection.yAxes = parsedContent;
      return newState;
    case 'setRollPeriod':
      newState.selection.isDefault = false;
      newState.selection.rollPeriod = action.rollPeriod;
      return newState;
    case 'selectAllQualityFlags':
      newState.selection.isDefault = false;
      newState.selection.qualityFlags = Array.from(state.availableQualityFlags);
      calcSelection();
      calcStatus();
      return newState;
    case 'selectNoneQualityFlags':
      newState.selection.isDefault = false;
      newState.selection.qualityFlags = [];
      calcSelection();
      calcStatus();
      return newState;
    case 'selectToggleQualityFlag':
      newState.selection.isDefault = false;
      if (action.selected && !state.selection.qualityFlags.includes(action.qualityFlag)) {
        newState.selection.qualityFlags.push(action.qualityFlag);
      } else if (!action.selected) {
        newState.selection.qualityFlags = _toConsumableArray(state.selection.qualityFlags).filter(function (qf) {
          return qf !== action.qualityFlag;
        });
      }
      calcSelection();
      calcStatus();
      return newState;
    case 'selectTimeStep':
      newState.selection.isDefault = false;
      if (!state.availableTimeSteps.has(action.timeStep)) {
        return state;
      }
      newState.selection.timeStep = action.timeStep;
      calcSelection();
      calcStatus();
      return newState;
    case 'selectAddSite':
      newState.selection.isDefault = false;
      if (!state.product.sites[action.siteCode]) {
        return state;
      }
      if (state.selection.sites.some(function (site) {
        return site.siteCode === action.siteCode;
      })) {
        return state;
      }
      newState.selection.sites.push({
        siteCode: action.siteCode,
        positions: []
      });
      calcSelection();
      calcStatus();
      return newState;
    case 'updateSelectedSites':
      if (!action.siteCodes || !action.siteCodes.constructor || action.siteCodes.constructor.name !== 'Set' || !action.siteCodes.size) {
        return state;
      }
      newState.selection.isDefault = false;
      // Remove any sites that are no longer in the selected set
      newState.selection.sites = newState.selection.sites.filter(function (site) {
        return action.siteCodes.has(site.siteCode);
      });
      // Add any new sites from the action
      action.siteCodes.forEach(function (siteCode) {
        if (!state.product.sites[siteCode]) {
          return;
        }
        if (newState.selection.sites.some(function (site) {
          return site.siteCode === siteCode;
        })) {
          return;
        }
        newState.selection.sites.push({
          siteCode: siteCode,
          positions: []
        });
      });
      calcSelection();
      calcStatus();
      return newState;
    case 'selectRemoveSite':
      if (state.selection.sites.length < 2) {
        return state;
      }
      if (!state.selection.sites.some(function (site) {
        return site.siteCode === action.siteCode;
      })) {
        return state;
      }
      newState.selection.isDefault = false;
      newState.selection.sites = newState.selection.sites.filter(function (site) {
        return site.siteCode !== action.siteCode;
      });
      calcSelection();
      calcStatus();
      return newState;
    case 'selectSitePositions':
      selectedSiteIdx = state.selection.sites.findIndex(function (site) {
        return site.siteCode === action.siteCode;
      });
      if (selectedSiteIdx === -1) {
        return state;
      }
      if (!state.product.sites[action.siteCode] || !action.positions.length) {
        return state;
      }
      if (!action.positions.every(function (p) {
        return Object.keys(state.product.sites[action.siteCode].positions).includes(p);
      })) {
        return state;
      }
      newState.selection.isDefault = false;
      newState.selection.sites[selectedSiteIdx].positions = _toConsumableArray(action.positions);
      calcSelection();
      calcStatus();
      return newState;

    // Default
    default:
      return state;
  }
};

/**
 * Defines a lookup of state key to a boolean
 * designating whether or not that instance of the context
 * should pull the state from the session storage and restore.
 * Keeping this lookup outside of the context provider function
 * as to not incur lifecycle interference by storing with useState.
 */
var restoreStateLookup = {};

/**
   Context Provider
*/
var Provider = function Provider(props) {
  var timeSeriesUniqueId = props.timeSeriesUniqueId,
    modeProp = props.mode,
    productCodeProp = props.productCode,
    productDataProp = props.productData,
    releaseProp = props.release,
    children = props.children;

  /**
     Initial State and Reducer Setup
  */
  var initialState = (0, _cloneDeep.default)(DEFAULT_STATE);
  if (typeof modeProp === 'string' && modeProp !== VIEWER_MODE.DEFAULT) {
    initialState.mode = modeProp;
  }
  initialState.status = productDataProp ? _constants.TIME_SERIES_VIEWER_STATUS.LOADING_META : _constants.TIME_SERIES_VIEWER_STATUS.INIT_PRODUCT;
  if (productDataProp) {
    initialState.fetchProduct.status = FETCH_STATUS.SUCCESS;
    initialState.product = parseProductData(productDataProp);
  } else {
    initialState.product.productCode = productCodeProp;
  }
  initialState.release = releaseProp;
  initialState.selection = applyDefaultsToSelection(initialState);

  // get the state from storage if present
  var productCode = initialState.product.productCode;
  var stateKey = "timeSeriesContextState-".concat(productCode, "-").concat(timeSeriesUniqueId);
  if (typeof restoreStateLookup[stateKey] === 'undefined') {
    restoreStateLookup[stateKey] = true;
  }
  var shouldRestoreState = restoreStateLookup[stateKey];
  var stateStorage = (0, _StateStorageService.default)(stateKey);
  var savedState = stateStorage.readState();
  if (savedState && shouldRestoreState) {
    restoreStateLookup[stateKey] = false;
    var convertedState = (0, _StateStorageConverter.convertStateFromStorage)(savedState);
    stateStorage.removeState();
    initialState = convertedState;
  }
  var _useReducer = (0, _react.useReducer)(reducer, initialState),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    state = _useReducer2[0],
    dispatch = _useReducer2[1];
  var viewerStatus = state.viewerStatus;

  // The current sign in process uses a separate domain. This function
  // persists the current state in storage when the button is clicked
  // so the state may be reloaded when the page is reloaded after sign
  // in.
  (0, _react.useEffect)(function () {
    var subscription = _NeonSignInButtonState.default.getObservable().subscribe({
      next: function next() {
        if (!_NeonEnvironment.default.enableGlobalSignInState) return;
        if (viewerStatus !== _constants.TIME_SERIES_VIEWER_STATUS.READY) return;
        restoreStateLookup[stateKey] = false;
        var convertedState = (0, _StateStorageConverter.convertStateForStorage)(state);
        stateStorage.saveState(convertedState);
      }
    });
    return function () {
      subscription.unsubscribe();
    };
  }, [viewerStatus, state, stateStorage, stateKey]);

  /**
     Effect - Reinitialize state if the product code prop changed
  */
  (0, _react.useEffect)(function () {
    // Ignore initialization when in static mode
    if (state.mode === VIEWER_MODE.STATIC) {
      return;
    }
    if (productCodeProp !== state.product.productCode) {
      dispatch({
        type: 'reinitialize',
        productCode: productCodeProp,
        release: state.release
      });
    }
    if (releaseProp !== state.release) {
      dispatch({
        type: 'reinitialize',
        productCode: state.product.productCode,
        release: releaseProp
      });
    }
  }, [state.mode, productCodeProp, releaseProp, state.product.productCode, state.release, dispatch]);

  /**
     Effect - Fetch product data if only a product code was provided in props
  */
  (0, _react.useEffect)(function () {
    // Ignore fetching product data when in static mode
    if (state.mode === VIEWER_MODE.STATIC) {
      return;
    }
    if (state.status !== _constants.TIME_SERIES_VIEWER_STATUS.INIT_PRODUCT) {
      return;
    }
    if (state.fetchProduct.status !== FETCH_STATUS.AWAITING_CALL) {
      return;
    }
    dispatch({
      type: 'initFetchProductCalled'
    });
    _NeonGraphQL.default.getDataProductByCode(state.product.productCode, state.release, true).pipe((0, _rxjs.map)(function (response) {
      var _response$response, _response$response$da;
      if (response !== null && response !== void 0 && (_response$response = response.response) !== null && _response$response !== void 0 && (_response$response$da = _response$response.data) !== null && _response$response$da !== void 0 && _response$response$da.product) {
        dispatch({
          type: 'initFetchProductSucceeded',
          productData: response.response.data.product
        });
        return (0, _rxjs.of)(true);
      }
      dispatch({
        type: 'initFetchProductFailed',
        error: 'malformed response'
      });
      return (0, _rxjs.of)(false);
    }), (0, _rxjs.catchError)(function (error) {
      dispatch({
        type: 'initFetchProductFailed',
        error: error.message
      });
      return (0, _rxjs.of)(false);
    })).subscribe();
  }, [state.mode, state.status, state.fetchProduct.status, state.product.productCode, state.release]);

  /**
     Effect - Fetch releases
  */
  (0, _react.useEffect)(function () {
    // Ignore fetching releases data when in static mode
    if (state.mode === VIEWER_MODE.STATIC) {
      return;
    }
    if (state.status !== _constants.TIME_SERIES_VIEWER_STATUS.INIT_PRODUCT) {
      return;
    }
    if (state.fetchReleases.status !== FETCH_STATUS.AWAITING_CALL) {
      return;
    }
    dispatch({
      type: 'initFetchReleasesCalled'
    });
    _NeonApi.default.getReleasesObservable().pipe((0, _rxjs.map)(function (response) {
      if (response && response.data) {
        dispatch({
          type: 'initFetchReleasesSucceeded',
          releases: response.data
        });
        return (0, _rxjs.of)(true);
      }
      dispatch({
        type: 'initFetchReleasesFailed',
        error: 'malformed response'
      });
      return (0, _rxjs.of)(false);
    }), (0, _rxjs.catchError)(function (error) {
      dispatch({
        type: 'initFetchReleasesFailed',
        error: error.message
      });
      return (0, _rxjs.of)(false);
    })).subscribe();
  }, [state.mode, state.status, state.fetchReleases.status]);

  /**
     Effect - Handle changes to selection
     Triggers all necessary fetches for meta data and series data
  */
  (0, _react.useEffect)(function () {
    var getSiteMonthDataURL = function getSiteMonthDataURL(siteCode, month) {
      var root = _NeonEnvironment.default.getFullApiPath('data');
      var hasRelease = state.release && typeof state.release === 'string' && state.release.length > 0;
      var releaseParam = hasRelease ? "?release=".concat(state.release) : '';
      return "".concat(root, "/").concat(state.product.productCode, "/").concat(siteCode, "/").concat(month).concat(releaseParam);
    };
    var _state$selection = state.selection,
      selectedTimeStep = _state$selection.timeStep,
      autoTimeStep = _state$selection.autoTimeStep;
    var timeStep = selectedTimeStep === 'auto' ? autoTimeStep : selectedTimeStep;
    var continuousDateRange = getContinuousDatesArray(state.selection.dateRange);
    var dataFetchTokens = new Set();
    var dataFetches = [];
    var dataActions = [];

    // Track in local scope if we're going to be fetching metadata so we can hold off on
    // declaring there was no series data to fetch (not because we already loaded it but because
    // we haven't even initialized the loading of it).
    var metaFetchTriggered = false;
    var fetchSiteVariables = function fetchSiteVariables(siteCode, url) {
      dispatch({
        type: 'fetchSiteVariables',
        siteCode: siteCode
      });
      fetchCSV(url).pipe((0, _rxjs.map)(function (response) {
        dispatch({
          type: 'fetchSiteVariablesSucceeded',
          csv: response.response,
          siteCode: siteCode
        });
        return (0, _rxjs.of)(true);
      }), (0, _rxjs.catchError)(function (error) {
        dispatch({
          type: 'fetchSiteVariablesFailed',
          error: error.message,
          siteCode: siteCode
        });
        return (0, _rxjs.of)(false);
      })).subscribe();
    };
    var fetchSitePositions = function fetchSitePositions(siteCode, url) {
      dispatch({
        type: 'fetchSitePositions',
        siteCode: siteCode
      });
      fetchCSV(url).pipe((0, _rxjs.map)(function (response) {
        dispatch({
          type: 'fetchSitePositionsSucceeded',
          csv: response.response,
          siteCode: siteCode
        });
        return (0, _rxjs.of)(true);
      }), (0, _rxjs.catchError)(function (error) {
        dispatch({
          type: 'fetchSitePositionsFailed',
          error: error.message,
          siteCode: siteCode
        });
        return (0, _rxjs.of)(false);
      })).subscribe();
    };
    var fetchNeededSiteMonths = function fetchNeededSiteMonths(siteCode, fetches) {
      continuousDateRange.filter(function (month) {
        return !fetches.siteMonths[month];
      }).forEach(function (month) {
        // Don't attempt to fetch any months that are known to be unavailable for a given site
        if (!state.product.sites[siteCode].availableMonths.includes(month)) {
          return;
        }
        metaFetchTriggered = true;
        dispatch({
          type: 'fetchSiteMonth',
          siteCode: siteCode,
          month: month
        });
        _NeonApi.default.getJsonObservable(getSiteMonthDataURL(siteCode, month), _NeonApi.default.getApiTokenHeader()).pipe((0, _rxjs.map)(function (response) {
          if (response && response.data && response.data.files) {
            dispatch({
              type: 'fetchSiteMonthSucceeded',
              files: response.data.files,
              siteCode: siteCode,
              month: month
            });
            return (0, _rxjs.of)(true);
          }
          dispatch({
            type: 'fetchSiteMonthFailed',
            error: 'malformed response',
            siteCode: siteCode,
            month: month
          });
          return (0, _rxjs.of)(false);
        }), (0, _rxjs.catchError)(function (error) {
          dispatch({
            type: 'fetchSiteMonthFailed',
            error: error.message,
            siteCode: siteCode,
            month: month
          });
          return (0, _rxjs.of)(false);
        })).subscribe();
      });
    };
    var prepareDataFetches = function prepareDataFetches(site) {
      var siteCode = site.siteCode,
        positions = site.positions;
      var fetchVariables = state.selection.variables.concat(state.selection.qualityFlags);
      fetchVariables.forEach(function (variable) {
        var downloadPkg = state.variables[variable].downloadPkg;
        positions.forEach(function (position) {
          continuousDateRange.forEach(function (month) {
            // eslint-disable-next-line max-len
            var path = "sites['".concat(siteCode, "'].positions['").concat(position, "'].data['").concat(month, "']['").concat(downloadPkg, "']['").concat(timeStep, "']");
            var timeStepTables = (0, _get.default)(state.product, path, {});
            Object.keys(timeStepTables).forEach(function (tableName) {
              var timeStepTable = timeStepTables[tableName];
              var url = timeStepTable.url,
                status = timeStepTable.status;
              // If the file isn't awaiting a fetch call then don't fetch it
              if (!url || status !== FETCH_STATUS.AWAITING_CALL) {
                return;
              }
              // Use the dataFetchTokens set to make sure we don't somehow add the same fetch twice
              var previousSize = dataFetchTokens.size;
              var token = "".concat(siteCode, ";").concat(position, ";").concat(month, ";").concat(downloadPkg, ";").concat(timeStep, ";").concat(tableName);
              dataFetchTokens.add(token);
              if (dataFetchTokens.size === previousSize) {
                return;
              }
              // Save the action props to pass to the fetchDataFiles
              // action to set all fetch statuses
              var actionProps = {
                siteCode: siteCode,
                position: position,
                month: month,
                downloadPkg: downloadPkg,
                timeStep: timeStep,
                table: tableName
              };
              dataActions.push(actionProps);
              // Add a file fetch observable to the main list
              dataFetches.push(fetchCSV(url).pipe((0, _rxjs.map)(function (response) {
                return response.response;
              }), (0, _rxjs.switchMap)(function (csv) {
                return (0, _parseTimeSeriesData.default)({
                  csv: csv,
                  variables: state.variables
                }).then(function (series) {
                  dispatch(_extends({
                    type: 'fetchDataFileSucceeded',
                    series: series
                  }, actionProps));
                });
              }), (0, _rxjs.catchError)(function (error) {
                dispatch(_extends({
                  type: 'fetchDataFileFailed',
                  error: error.message
                }, actionProps));
                return (0, _rxjs.of)(false);
              })));
            });
          });
        });
      });
    };

    // MAIN LOOP - Trigger fetches as needed for all selected sites
    state.selection.sites.forEach(function (site) {
      var siteCode = site.siteCode;
      if (!state.product.sites[siteCode]) {
        return;
      }
      var fetches = state.product.sites[siteCode].fetches;
      switch (state.mode) {
        case VIEWER_MODE.STATIC:
          // Fetch any site months in selection that have not been fetched
          fetchNeededSiteMonths(siteCode, fetches);
          break;
        case VIEWER_MODE.DEFAULT:
        default:
          // Fetch variables for any sites in seleciton that haven't had variables fetched
          if (fetches.variables.status === FETCH_STATUS.AWAITING_CALL && fetches.variables.url) {
            fetchSiteVariables(siteCode, fetches.variables.url);
            metaFetchTriggered = true;
          }

          // Fetch positions for any site months in seleciton that haven't had positions fetched
          if (fetches.positions.status === FETCH_STATUS.AWAITING_CALL && fetches.positions.url) {
            fetchSitePositions(siteCode, fetches.positions.url);
            metaFetchTriggered = true;
          }

          // Fetch any site months in selection that have not been fetched
          fetchNeededSiteMonths(siteCode, fetches);

          // Add any fetch observables for needed data to dataFetches and dataFetchTokens
          if (state.status === _constants.TIME_SERIES_VIEWER_STATUS.READY_FOR_DATA && !metaFetchTriggered) {
            prepareDataFetches(site);
          }
          break;
      }
    });

    // Ignore data fetches when in static mode
    if (state.mode === VIEWER_MODE.STATIC) {
      return;
    }

    // Trigger all data fetches
    if (state.status === _constants.TIME_SERIES_VIEWER_STATUS.READY_FOR_DATA && !metaFetchTriggered) {
      if (!dataFetches.length) {
        dispatch({
          type: 'noDataFilesFetchNecessary'
        });
      } else {
        var masterFetchToken = "fetchDataFiles.".concat((0, _uniqueId.default)());
        dispatch({
          type: 'fetchDataFiles',
          token: masterFetchToken,
          fetches: dataActions
        });
        (0, _rxUtil.forkJoinWithProgress)(dataFetches).pipe((0, _rxjs.mergeMap)(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            finalResult = _ref2[0],
            progress = _ref2[1];
          return (0, _rxjs.merge)(progress.pipe((0, _rxjs.tap)(function (value) {
            return dispatch({
              type: 'fetchDataFilesProgress',
              token: masterFetchToken,
              value: value
            });
          }), (0, _rxjs.ignoreElements)()), finalResult);
        })).subscribe(function (value) {
          return dispatch({
            type: 'fetchDataFilesCompleted',
            token: masterFetchToken,
            value: value
          });
        });
      }
    }
  }, [state.mode, state.status, state.selection, state.selection.digest, state.variables, state.product, state.release]);

  /**
     Render
  */
  return (
    /*#__PURE__*/
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    _react.default.createElement(Context.Provider, {
      value: [state, dispatch]
    }, children)
  );
};

/**
   Prop Types
*/
var TimeSeriesViewerPropTypes = {
  productCode: function productCode(props, propName, componentName) {
    var productCode = props.productCode,
      productData = props.productData;
    if (!productCode && !productData) {
      return new Error("One of props 'productCode' or 'productData' was not specified in '".concat(componentName, "'."));
    }
    if (productData && !productCode) {
      return null;
    }
    if (productCode && typeof productCode === 'string' && productCode.length > 0) {
      return null;
    }
    return new Error("Props 'productCode' must be a non-empty string in '".concat(componentName, "'."));
  },
  productData: function productData(props, propName, componentName) {
    var productCode = props.productCode,
      productData = props.productData;
    if (!productCode && !productData) {
      return new Error("One of props 'productCode' or 'productData' was not specified in '".concat(componentName, "'."));
    }
    if (productCode && !productData) {
      return null;
    }
    if (typeof productData.productCode !== 'string' || !productData.productCode.length || typeof productData.productName !== 'string' || !productData.productName.length || Array.isArray(productData.siteCodes) && !productData.siteCodes.every(function (siteObj) {
      return typeof siteObj.siteCode === 'string' && siteObj.siteCode.length && Array.isArray(siteObj.availableMonths) && siteObj.availableMonths.every(function (month) {
        return typeof month === 'string' && month.length;
      });
    })) {
      return new Error("Prop 'productData' is malformed in '".concat(componentName, "'."));
    }
    return null;
  }
};
Provider.propTypes = {
  timeSeriesUniqueId: _propTypes.number,
  mode: _propTypes.default.string,
  productCode: TimeSeriesViewerPropTypes.productCode,
  productData: TimeSeriesViewerPropTypes.productData,
  release: _propTypes.default.string,
  children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string])), _propTypes.default.node, _propTypes.default.string]).isRequired
};
Provider.defaultProps = {
  timeSeriesUniqueId: 0,
  mode: VIEWER_MODE.DEFAULT,
  productCode: null,
  productData: null,
  release: null
};

/**
   Export
*/
var TimeSeriesViewerContext = {
  Provider: Provider,
  useTimeSeriesViewerState: useTimeSeriesViewerState,
  TimeSeriesViewerPropTypes: TimeSeriesViewerPropTypes
};
var _default = TimeSeriesViewerContext; // Additional items exported for unit testing
exports.default = _default;
var getTestableItems = function getTestableItems() {
  return process.env.NODE_ENV !== 'test' ? {} : {
    DEFAULT_STATE: DEFAULT_STATE,
    FETCH_STATUS: FETCH_STATUS,
    applyDefaultsToSelection: applyDefaultsToSelection,
    generateYAxisRange: generateYAxisRange,
    getTimeStep: getTimeStep,
    getUpdatedValueRange: getUpdatedValueRange,
    getContinuousDatesArray: getContinuousDatesArray,
    limitVariablesToTwoUnits: limitVariablesToTwoUnits,
    parseProductData: parseProductData,
    parseSiteMonthData: parseSiteMonthData,
    parseSiteVariables: parseSiteVariables,
    parseSitePositions: parseSitePositions,
    reducer: reducer,
    setDataFileFetchStatuses: setDataFileFetchStatuses,
    TimeSeriesViewerPropTypes: TimeSeriesViewerPropTypes
  };
};
exports.getTestableItems = getTestableItems;