"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.summarizeTimeSteps = exports.TIME_STEPS = exports.TabComponentPropTypes = exports.TIME_SERIES_VIEWER_STATUS_TITLES = exports.TIME_SERIES_VIEWER_STATUS = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _moment = _interopRequireDefault(require("moment"));

var _get2 = _interopRequireDefault(require("lodash/get"));

var _uniqueId = _interopRequireDefault(require("lodash/uniqueId"));

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _papaparse = require("papaparse");

var _rxjs = require("rxjs");

var _ajax = require("rxjs/ajax");

var _operators = require("rxjs/operators");

var _NeonApi = _interopRequireDefault(require("../NeonApi/NeonApi"));

var _NeonGraphQL = _interopRequireDefault(require("../NeonGraphQL/NeonGraphQL"));

var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));

var _rxUtil = require("../../util/rxUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// 'get' is a reserved word so can't be imported with import
var lodashGet = require('lodash/get.js'); // Every possible status a single fetch request can have


var FETCH_STATUS = {
  AWAITING_CALL: 'AWAITING_CALL',
  FETCHING: 'FETCHING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS'
}; // Every possible top-level status the TimeSeriesViewer component can have

var TIME_SERIES_VIEWER_STATUS = {
  INIT_PRODUCT: 'INIT_PRODUCT',
  // Handling props; fetching product data if needed
  LOADING_META: 'LOADING_META',
  // Actively loading meta data (sites, variables, and positions)
  READY_FOR_DATA: 'READY_FOR_DATA',
  // Ready to trigger fetches for data
  LOADING_DATA: 'LOADING_DATA',
  // Actively loading plottable series data
  ERROR: 'ERROR',
  // Stop everything because problem
  READY: 'READY' // Ready for user input

};
exports.TIME_SERIES_VIEWER_STATUS = TIME_SERIES_VIEWER_STATUS;
var TIME_SERIES_VIEWER_STATUS_TITLES = {
  INIT_PRODUCT: 'Loading data product…',
  LOADING_META: 'Loading site positions, variables, and data paths…',
  READY_FOR_DATA: 'Loading series data…',
  LOADING_DATA: 'Loading series data…',
  ERROR: null,
  READY: null
}; // Array offsets and validators for use when splitting a data file URL

exports.TIME_SERIES_VIEWER_STATUS_TITLES = TIME_SERIES_VIEWER_STATUS_TITLES;
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
      return /^[\d]{3}$/.test(p);
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
}; // Functions to convert a value to the proper JS data type given a NEON variable dataType

var castFloat = function castFloat(v) {
  var cast = parseFloat(v, 10);
  return Number.isNaN(cast) ? null : cast;
};

var castInt = function castInt(v) {
  var cast = parseInt(v, 10);
  return Number.isNaN(cast) ? null : cast;
};

var DATA_TYPE_SETTERS = {
  dateTime: function dateTime(v) {
    return typeof v === 'string' ? v.replace(/"/g, '') : v;
  },
  real: castFloat,
  'signed integer': castInt,
  'unsigned integer': castInt
}; // PropTypes for any Tab Component (or component within a tab) for gettingsetSelectedTab
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
  standardDeviation: 0,
  selectedRange: 'auto'
};
var DEFAULT_STATE = {
  status: TIME_SERIES_VIEWER_STATUS.INIT_PRODUCT,
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
  selection: {
    dateRange: [null, null],
    continuousDateRange: [],
    variables: [],
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
    }
  },
  availableQualityFlags: new Set(),
  availableTimeSteps: new Set(['auto'])
};
var Context = (0, _react.createContext)(DEFAULT_STATE);

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
    tmi: '001',
    seconds: 60
  },
  '2min': {
    key: '2min',
    tmi: '002',
    seconds: 120
  },
  '5min': {
    key: '5min',
    tmi: '005',
    seconds: 300
  },
  '15min': {
    key: '15min',
    tmi: '015',
    seconds: 900
  },
  '30min': {
    key: '30min',
    tmi: '030',
    seconds: 1800
  },
  '60min': {
    key: '1hr',
    tmi: '060',
    seconds: 1800
  }
};
exports.TIME_STEPS = TIME_STEPS;

var getTimeStep = function getTimeStep(input) {
  return Object.keys(TIME_STEPS).find(function (key) {
    return TIME_STEPS[key].tmi === input;
  }) || null;
};

var summarizeTimeSteps = function summarizeTimeSteps(steps) {
  var timeStep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var pluralize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (steps === 1) {
    return 'none';
  }

  var timeStepSeconds = timeStep && TIME_STEPS[timeStep] ? TIME_STEPS[timeStep].seconds : 1800;
  var seconds = steps * timeStepSeconds;
  var breaks = [3600, 86400, 2592000, 31536000];
  var intervals = ['hour', 'day', 'month', 'year'];
  var breakIdx = breaks.reduce(function (acc, cur, idx) {
    return seconds > cur ? idx : acc;
  }, 0);
  var value = (seconds / breaks[breakIdx]).toFixed(1);

  if (value.slice(value.length - 1) === '0') {
    value = value.slice(0, value.length - 2);
  }

  var plural = '';

  if (pluralize) {
    plural = value === '1' ? '' : 's';
  }

  return "".concat(value, " ").concat(intervals[breakIdx]).concat(plural);
};
/**
   CSV Fetch/Parse Functions
*/
// const siteMonthCancelation$ = new Subject();


exports.summarizeTimeSteps = summarizeTimeSteps;

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
    skipEmptyLines: 'greedy' // dynamicTyping: true,

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
 * @param {Object} productDate - JSON parse response from product data endpoint
 * @return {Object} new product object to be applied at state.product
 */


var parseProductData = function parseProductData() {
  var productData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var product = {
    productCode: productData.productCode,
    productName: productData.productName,
    productDescription: productData.productDescription,
    productSensor: productData.productSensor,
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
        url = file.url; // Must be a CSV file

    if (!/\.csv$/.test(name)) {
      return;
    } // Must not be a variables or positions file


    if (name.includes('variables') && !newSite.fetches.variables.url) {
      newSite.fetches.variables.url = url;
      return;
    }

    if (name.includes('sensor_positions') && !newSite.fetches.positions.url) {
      newSite.fetches.positions.url = url;
      return;
    } // Split file name by (.); all DATA_FILE_PARTS validators must point to a valid part


    var parts = name.split('.');

    if (Object.keys(DATA_FILE_PARTS).some(function (part) {
      var _DATA_FILE_PARTS$part = DATA_FILE_PARTS[part],
          offset = _DATA_FILE_PARTS$part.offset,
          isValid = _DATA_FILE_PARTS$part.isValid;
      return !isValid(parts[offset]);
    })) {
      return;
    } // Extract parts


    var position = "".concat(parts[DATA_FILE_PARTS.POSITION_H.offset], ".").concat(parts[DATA_FILE_PARTS.POSITION_V.offset]);
    var month = parts[DATA_FILE_PARTS.MONTH.offset];
    var packageType = parts[DATA_FILE_PARTS.PACKAGE_TYPE.offset];
    var timeStep = getTimeStep(parts[DATA_FILE_PARTS.TIME_STEP.offset]); // Timestep must be valid

    if (timeStep === null) {
      return;
    } // All is good, add the timestep and add file information to the site object


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

    newSite.positions[position].data[month][packageType][timeStep] = {
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
  var variablesSet = new Set();
  variables.data.forEach(function (variable) {
    var dataType = variable.dataType,
        description = variable.description,
        downloadPkg = variable.downloadPkg,
        fieldName = variable.fieldName,
        table = variable.table,
        units = variable.units;
    var timeStep = getTimeStep(table);
    var isSelectable = variable.dataType !== 'dateTime' && variable.units !== 'NA' && !/QF$/.test(fieldName);
    var canBeDefault = isSelectable && variable.downloadPkg !== 'expanded' && !/QM$/.test(fieldName);
    variablesSet.add(fieldName);

    if (!newStateVariables[fieldName]) {
      newStateVariables[fieldName] = {
        dataType: dataType,
        description: description,
        downloadPkg: downloadPkg,
        units: units,
        timeSteps: new Set(),
        sites: new Set(),
        isSelectable: isSelectable,
        canBeDefault: canBeDefault,
        isDateTime: variable.dataType === 'dateTime'
      };
    }

    newStateVariables[fieldName].timeSteps.add(timeStep);
    newStateVariables[fieldName].sites.add(siteCode);
  });
  return {
    variablesSet: variablesSet,
    variablesObject: newStateVariables
  };
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
    var posId = position['HOR.VER'];

    if (!newSite.positions[posId]) {
      newSite.positions[posId] = {
        data: {},
        history: []
      };
    }

    newSite.positions[posId].history.push(position);
  }); // Sort position history by start/end time descending

  Object.keys(newSite.positions).forEach(function (posId) {
    newSite.positions[posId].history.sort(function (a, b) {
      if (!a.end) {
        return 1;
      }

      return a.end < b.start ? -1 : 1;
    });
  });
  return newSite;
};
/**
 * Build an object containing series of data, indexed by fieldName, from a data fetch response
 * We don't use the same CSV parse method as with variables/positions because we don't want rows:
 *   [ { varX: 1, varY: 2, varZ: 3 }, { varX: 10, varY: 20, varZ: 30 }, ... ]
 * ...we want columns to individually stitch together with other months into continuous series:
 *   { varX: [1, 10, ...], varY: [2. 20, ...], varZ: [3, 30,...] }
 * @param {string} csv - unparsed CSV string from a data fetch response
 * @param {Object} variables - current state.variables object
 * @return {Object} series object to be applied to state (product/site/position/month/downloadPkg)
 */


var parseSeriesData = function parseSeriesData(csv, variables) {
  var series = {};
  var fields = [];
  var rows = csv.split('\n');

  if (!rows.length) {
    return series;
  }

  rows[0].split(',').forEach(function (fieldName) {
    var dataType = variables[fieldName].dataType;
    var field = {
      fieldName: fieldName,
      setType: DATA_TYPE_SETTERS[dataType] ? DATA_TYPE_SETTERS[dataType] : function (v) {
        return v;
      }
    };
    fields.push(field);
    series[fieldName] = {
      data: [],
      range: [null, null],
      sum: 0,
      count: 0,
      variance: 0
    };
  });
  rows.slice(1).forEach(function (row) {
    if (!row.length) {
      return;
    }

    var values = row.split(',');
    values.forEach(function (value, idx) {
      var typedValue = fields[idx].setType(value);
      series[fields[idx].fieldName].data.push(typedValue); // Don't bother updating the range for non-numerical series and quality flags

      if (typeof typedValue === 'number' && !/QF$/.test(fields[idx].fieldName)) {
        series[fields[idx].fieldName].range = getUpdatedValueRange(series[fields[idx].fieldName].range, typedValue);
        series[fields[idx].fieldName].sum += typedValue;
        series[fields[idx].fieldName].count += 1;
      }
    });
  }); // Loop across all numeric non-quality-flag series again to calculate series variance

  Object.keys(series).filter(function (fieldName) {
    return !/QF$/.test(fieldName) && series[fieldName].count > 0;
  }).forEach(function (fieldName) {
    var dataType = variables[fieldName].dataType;
    var setType = DATA_TYPE_SETTERS[dataType] ? DATA_TYPE_SETTERS[dataType] : function (v) {
      return v;
    };

    if (!['real', 'signed integer', 'unsigned integer'].includes(dataType)) {
      return;
    }

    var mean = series[fieldName].sum / series[fieldName].count;
    var sumOfSquares = 0;
    series[fieldName].data.forEach(function (value) {
      if (value === null) {
        return;
      }

      var typedValue = setType(value);
      sumOfSquares += Math.pow(typedValue - mean, 2);
    });
    series[fieldName].variance = sumOfSquares / series[fieldName].count;
  });
  return series;
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
 * @return {Object} updated object to apply to state.selection
 */


var applyDefaultsToSelection = function applyDefaultsToSelection(state) {
  var product = state.product,
      variables = state.variables,
      selection = state.selection;

  if (!Object.keys(product.sites).length) {
    return selection;
  } // Sites - Ensure the selection has at least one site (default to first in list)


  if (!selection.sites.length) {
    var siteCodes = Object.keys(product.sites);
    siteCodes.sort();
    selection.sites.push({
      siteCode: siteCodes[0],
      positions: []
    });
  } // Date Range - Ensure the selection has a date range (default to latest month)


  if (selection.dateRange[0] === null || selection.dateRange[1] === null) {
    var availableMonths = product.sites[selection.sites[0].siteCode].availableMonths;
    var initialMonth = availableMonths[availableMonths.length - 1];
    selection.dateRange = [initialMonth, initialMonth];
  } // Positions - Ensure every selected site has at least one selected position


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
  }); // Variables

  if (Object.keys(variables).length) {
    // Ensure the selection has at least one variable
    if (!selection.variables.length) {
      var defaultVar = Object.keys(variables).find(function (v) {
        return variables[v].canBeDefault;
      });

      if (defaultVar) {
        selection.variables.push(defaultVar);
        selection.yAxes.y1.units = variables[defaultVar].units;
      }
    } // Ensure the selection has at least one dateTime variable


    if (!selection.dateTimeVariable) {
      var defaultDateTimeVar = Object.keys(variables).find(function (v) {
        return variables[v].isDateTime;
      });

      if (defaultDateTimeVar) {
        selection.dateTimeVariable = defaultDateTimeVar;
      }
    }
  } // Generate a new continuous date range from the dateRange (which only contains bounds)


  selection.continuousDateRange = getContinuousDatesArray(selection.dateRange); // Generate new cumulative data ranges and standard deviations for all applicable y axes.

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
            var series = lodashGet(product.sites[siteCode].positions[position], "data['".concat(month, "']['").concat(pkg, "']['").concat(dataTimeStep, "'].series['").concat(variable, "']"));

            if (!series || !series.count) {
              return;
            }

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
      var combinedMean = combinedSum / combinedCount;
      var deviations = monthMeans.map(function (mean) {
        return mean - combinedMean;
      });
      selection.yAxes[yAxis].standardDeviation = Math.pow(monthVariances.reduce(function (sum, variance, idx) {
        return monthCounts[idx] * (variance + Math.pow(deviations[idx], 2));
      }, 0) / combinedCount, 0.5);
    }
  }); // Generate a new digest for effect comparison

  selection.digest = JSON.stringify({
    sites: selection.sites,
    dateRange: selection.dateRange,
    variables: selection.variables
  });
  return selection;
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
    if (newState.status === TIME_SERIES_VIEWER_STATUS.ERROR) {
      return;
    }

    if (Object.keys(newState.metaFetches).length) {
      newState.status = TIME_SERIES_VIEWER_STATUS.LOADING_META;
    } else if (Object.keys(newState.dataFetches).length) {
      newState.status = TIME_SERIES_VIEWER_STATUS.LOADING_DATA;
    } else {
      newState.status = TIME_SERIES_VIEWER_STATUS.READY_FOR_DATA;
    }
  };

  var fail = function fail(error) {
    newState.status = TIME_SERIES_VIEWER_STATUS.ERROR;
    newState.displayError = error;
    return newState;
  };

  var limitVariablesToTwoUnits = function limitVariablesToTwoUnits(variables) {
    var selectedUnits = variables.reduce(function (units, variable) {
      units.add(state.variables[variable].units);
      return units;
    }, new Set());

    if (selectedUnits.size < 2) {
      return {
        selectedUnits: Array.from(selectedUnits),
        variables: variables
      };
    }

    return {
      selectedUnits: Array.from(selectedUnits),
      variables: variables.filter(function (variable) {
        return selectedUnits.has(state.variables[variable].units);
      })
    };
  };

  var setDataFileFetchStatuses = function setDataFileFetchStatuses(fetches) {
    fetches.forEach(function (fetch) {
      var siteCode = fetch.siteCode,
          position = fetch.position,
          month = fetch.month,
          downloadPkg = fetch.downloadPkg,
          timeStep = fetch.timeStep;
      newState.product.sites[siteCode].positions[position].data[month][downloadPkg][timeStep].status = FETCH_STATUS.FETCHING;
    });
  };

  var parsedContent = null;
  var selectedSiteIdx = null;

  switch (action.type) {
    // Reinitialize
    case 'reinitialize':
      newState = (0, _cloneDeep.default)(DEFAULT_STATE);
      newState.product.productCode = action.productCode;
      return newState;
    // Fetch Product Actions

    case 'initFetchProductCalled':
      newState.fetchProduct.status = FETCH_STATUS.FETCHING;
      return newState;

    case 'initFetchProductFailed':
      newState.fetchProduct.status = FETCH_STATUS.ERROR;
      newState.fetchProduct.error = action.error;
      newState.status = TIME_SERIES_VIEWER_STATUS.ERROR;
      newState.displayError = "Unable to load product: ".concat(action.error);
      return newState;

    case 'initFetchProductSucceeded':
      newState.fetchProduct.status = FETCH_STATUS.SUCCESS;
      newState.product = parseProductData(action.productData);
      calcSelection();
      newState.status = TIME_SERIES_VIEWER_STATUS.LOADING_META;
      return newState;
    // Fetch Site Month Actions

    case 'fetchSiteMonth':
      newState.metaFetches["fetchSiteMonth.".concat(action.siteCode, ".").concat(action.month)] = true;
      newState.product.sites[action.siteCode].fetches.siteMonths[action.month] = {
        status: FETCH_STATUS.FETCHING,
        error: null
      };
      newState.status = TIME_SERIES_VIEWER_STATUS.LOADING_META;
      return newState;

    case 'fetchSiteMonthFailed':
      delete newState.metaFetches["fetchSiteMonth.".concat(action.siteCode, ".").concat(action.month)];
      newState.product.sites[action.siteCode].fetches.siteMonths[action.month].status = FETCH_STATUS.ERROR;
      newState.product.sites[action.siteCode].fetches.siteMonths[action.month].error = action.error;
      calcStatus();
      return newState;

    case 'fetchSiteMonthSucceeded':
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
          newState.status = TIME_SERIES_VIEWER_STATUS.LOADING_META;
        } else {
        calcStatus();
      }

      return newState;
    // Fetch Site Variables Actions

    case 'fetchSiteVariables':
      newState.metaFetches["fetchSiteVariables.".concat(action.siteCode)] = true;
      newState.product.sites[action.siteCode].fetches.variables.status = FETCH_STATUS.FETCHING;
      calcStatus();
      return newState;

    case 'fetchSiteVariablesFailed':
      delete newState.metaFetches["fetchSiteVariables.".concat(action.siteCode)];
      newState.product.sites[action.siteCode].fetches.variables.status = FETCH_STATUS.ERROR;
      newState.product.sites[action.siteCode].fetches.variables.error = action.error;
      calcStatus();
      return newState;

    case 'fetchSiteVariablesSucceeded':
      delete newState.metaFetches["fetchSiteVariables.".concat(action.siteCode)];
      newState.product.sites[action.siteCode].fetches.variables.status = FETCH_STATUS.SUCCESS;
      parsedContent = parseSiteVariables(newState.variables, action.siteCode, action.csv);
      newState.variables = _extends({}, state.variables, {}, parsedContent.variablesObject);
      newState.product.sites[action.siteCode].variables = new Set([].concat(_toConsumableArray(state.product.sites[action.siteCode].variables), _toConsumableArray(parsedContent.variablesSet)));
      newState.availableQualityFlags = new Set([].concat(_toConsumableArray(state.availableQualityFlags), _toConsumableArray(Object.keys(newState.variables).filter(function (v) {
        return /QF$/.test(v);
      })))); // A valid dateTime variable must be present otherwise we have no x-axis

      if (Object.keys(newState.variables).every(function (v) {
        return !newState.variables[v].isDateTime;
      })) {
        return fail('This data product is not compatible with the Time Series Viewer (no dateTime data found)');
      }

      calcSelection();
      calcStatus();
      return newState;
    // Fetch Site Positions Actions

    case 'fetchSitePositions':
      newState.metaFetches["fetchSitePositions.".concat(action.siteCode)] = true;
      newState.product.sites[action.siteCode].fetches.positions.status = FETCH_STATUS.FETCHING;
      calcStatus();
      return newState;

    case 'fetchSitePositionsFailed':
      delete newState.metaFetches["fetchSitePositions.".concat(action.siteCode)];
      newState.product.sites[action.siteCode].fetches.positions.status = FETCH_STATUS.ERROR;
      newState.product.sites[action.siteCode].fetches.positions.error = action.error;
      calcStatus();
      return newState;

    case 'fetchSitePositionsSucceeded':
      delete newState.metaFetches["fetchSitePositions.".concat(action.siteCode)];
      newState.product.sites[action.siteCode].fetches.positions.status = FETCH_STATUS.SUCCESS;
      newState.product.sites[action.siteCode] = parseSitePositions(newState.product.sites[action.siteCode], action.csv);
      calcSelection();
      calcStatus();
      return newState;
    // Fetch Data Actions (Many Files)

    case 'fetchDataFiles':
      newState.dataFetches[action.token] = true;
      setDataFileFetchStatuses(action.fetches);
      newState.dataFetchProgress = 0;
      newState.status = TIME_SERIES_VIEWER_STATUS.LOADING_DATA;
      return newState;

    case 'fetchDataFilesProgress':
      newState.dataFetchProgress = action.value;
      return newState;

    case 'fetchDataFilesCompleted':
      delete newState.dataFetches[action.token];
      newState.status = TIME_SERIES_VIEWER_STATUS.READY;
      calcSelection();
      return newState;

    case 'noDataFilesFetchNecessary':
      newState.status = TIME_SERIES_VIEWER_STATUS.READY;
      return newState;
    // Fetch Data Actions (Single File)

    case 'fetchDataFileFailed':
      newState.product.sites[action.siteCode].positions[action.position].data[action.month][action.downloadPkg][action.timeStep].status = FETCH_STATUS.ERROR;
      newState.product.sites[action.siteCode].positions[action.position].data[action.month][action.downloadPkg][action.timeStep].error = action.error;
      return newState;

    case 'fetchDataFileSucceeded':
      newState.product.sites[action.siteCode].positions[action.position].data[action.month][action.downloadPkg][action.timeStep].status = FETCH_STATUS.SUCCESS;
      newState.product.sites[action.siteCode].positions[action.position].data[action.month][action.downloadPkg][action.timeStep].series = parseSeriesData(action.csv, newState.variables);
      return newState;
    // Core Selection Actions

    case 'selectDateRange':
      newState.selection.dateRange = action.dateRange;
      calcSelection();
      calcStatus();
      return newState;

    case 'selectVariables':
      parsedContent = limitVariablesToTwoUnits(action.variables);
      newState.selection.variables = parsedContent.variables;

      if (parsedContent.selectedUnits.length === 1) {
        // eslint-disable-next-line prefer-destructuring
        newState.selection.yAxes.y1.units = parsedContent.selectedUnits[0];

        if (newState.selection.yAxes.y2.units === parsedContent.selectedUnits[0]) {
          newState.selection.yAxes.y1.logscale = newState.selection.yAxes.y2.logscale;
        }

        newState.selection.yAxes.y2 = (0, _cloneDeep.default)(DEFAULT_AXIS_STATE);
      } else {
        if (!newState.selection.yAxes.y1.units) {
          newState.selection.yAxes.y1 = (0, _cloneDeep.default)(DEFAULT_AXIS_STATE); // eslint-disable-next-line prefer-destructuring

          newState.selection.yAxes.y1.units = parsedContent.selectedUnits[0];
        }

        if (!newState.selection.yAxes.y2.units) {
          newState.selection.yAxes.y2 = (0, _cloneDeep.default)(DEFAULT_AXIS_STATE); // eslint-disable-next-line prefer-destructuring

          newState.selection.yAxes.y2.units = parsedContent.selectedUnits[1];
        }
      }

      calcSelection();
      calcStatus();
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
      newState.selection.logscale = !!action.logscale;
      return newState;

    case 'selectSwapYAxes':
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
      newState.selection.rollPeriod = action.rollPeriod;
      return newState;

    case 'selectAllQualityFlags':
      newState.selection.qualityFlags = Array.from(state.availableQualityFlags);
      calcStatus();
      return newState;

    case 'selectNoneQualityFlags':
      newState.selection.qualityFlags = [];
      return newState;

    case 'selectToggleQualityFlag':
      if (action.selected && !state.selection.qualityFlags.includes(action.qualityFlag)) {
        newState.selection.qualityFlags.push(action.qualityFlag);
      } else if (!action.selected) {
        newState.selection.qualityFlags = newState.selection.qualityFlags.filter(function (v) {
          return v !== action.qualityFlag;
        });
      }

      calcStatus();
      return newState;

    case 'selectTimeStep':
      if (!state.availableTimeSteps.has(action.timeStep)) {
        return state;
      }

      newState.selection.timeStep = action.timeStep;
      calcStatus();
      return newState;

    case 'selectAddSite':
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

    case 'selectRemoveSite':
      if (state.selection.sites.length < 2) {
        return state;
      }

      if (!state.selection.sites.some(function (site) {
        return site.siteCode === action.siteCode;
      })) {
        return state;
      }

      newState.selection.sites = newState.selection.sites.filter(function (site) {
        return site.siteCode !== action.siteCode;
      });
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

      newState.selection.sites[selectedSiteIdx].positions = _toConsumableArray(action.positions);
      calcStatus();
      return newState;

    case 'selectYAxisRange':
      if (!state.selection.yAxes[action.axis]) {
        return state;
      }

      if (action.range !== 'auto' && !(Array.isArray(action.range) && action.range.length === 2 && action.range.every(function (v) {
        return typeof v === 'number';
      }))) {
        return state;
      }

      newState.selection.yAxes[action.axis].selectedRange = action.range;
      return newState;
    // Default

    default:
      return state;
  }
};
/**
   Context Provider
*/


var Provider = function Provider(props) {
  var productCodeProp = props.productCode,
      productDataProp = props.productData,
      children = props.children;
  /**
     Initial State and Reducer Setup
  */

  var initialState = (0, _cloneDeep.default)(DEFAULT_STATE);
  initialState.status = productDataProp ? TIME_SERIES_VIEWER_STATUS.LOADING_META : TIME_SERIES_VIEWER_STATUS.INIT_PRODUCT;

  if (productDataProp) {
    initialState.fetchProduct.status = FETCH_STATUS.SUCCESS;
    initialState.product = parseProductData(productDataProp);
  } else {
    initialState.product.productCode = productCodeProp;
  }

  initialState.selection = applyDefaultsToSelection(initialState);

  var _useReducer = (0, _react.useReducer)(reducer, initialState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];
  /**
     Effect - Reinitialize state if the product code prop changed
  */


  (0, _react.useEffect)(function () {
    if (productCodeProp !== state.product.productCode) {
      dispatch({
        type: 'reinitialize',
        productCode: productCodeProp
      });
    }
  }, [productCodeProp, state.product.productCode, dispatch]);
  /**
     Effect - Fetch product data if only a product code was provided in props
  */

  (0, _react.useEffect)(function () {
    if (state.status !== TIME_SERIES_VIEWER_STATUS.INIT_PRODUCT) {
      return;
    }

    if (state.fetchProduct.status !== FETCH_STATUS.AWAITING_CALL) {
      return;
    }

    dispatch({
      type: 'initFetchProductCalled'
    });

    _NeonGraphQL.default.getDataProductByCode(state.product.productCode).pipe((0, _operators.map)(function (response) {
      if (response.response && response.response.data && response.response.data.product) {
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
    }), (0, _operators.catchError)(function (error) {
      dispatch({
        type: 'initFetchProductFailed',
        error: error.message
      });
      return (0, _rxjs.of)(false);
    })).subscribe();
  }, [state.status, state.fetchProduct.status, state.product.productCode]);
  /**
     Effect - Handle changes to selection
     Triggers all necessary fetches for meta data and series data
  */

  (0, _react.useEffect)(function () {
    var getSiteMonthDataURL = function getSiteMonthDataURL(siteCode, month) {
      var root = _NeonEnvironment.default.getFullApiPath('data');

      return "".concat(root, "/").concat(state.product.productCode, "/").concat(siteCode, "/").concat(month);
    };

    var _state$selection = state.selection,
        selectedTimeStep = _state$selection.timeStep,
        autoTimeStep = _state$selection.autoTimeStep;
    var timeStep = selectedTimeStep === 'auto' ? autoTimeStep : selectedTimeStep;
    var continuousDateRange = getContinuousDatesArray(state.selection.dateRange);
    var dataFetchTokens = new Set();
    var dataFetches = [];
    var dataActions = []; // Track in local scope if we're going to be fetching metadata so we can hold off on
    // declaring there was no series data to fetch (not because we already loaded it but because
    // we haven't even initialized the loading of it).

    var metaFetchTriggered = false;

    var fetchSiteVariables = function fetchSiteVariables(siteCode, url) {
      dispatch({
        type: 'fetchSiteVariables',
        siteCode: siteCode
      });
      fetchCSV(url).pipe((0, _operators.map)(function (response) {
        dispatch({
          type: 'fetchSiteVariablesSucceeded',
          csv: response.response,
          siteCode: siteCode
        });
        return (0, _rxjs.of)(true);
      }), (0, _operators.catchError)(function (error) {
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
      fetchCSV(url).pipe((0, _operators.map)(function (response) {
        dispatch({
          type: 'fetchSitePositionsSucceeded',
          csv: response.response,
          siteCode: siteCode
        });
        return (0, _rxjs.of)(true);
      }), (0, _operators.catchError)(function (error) {
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

        _ajax.ajax.getJSON(getSiteMonthDataURL(siteCode, month), _NeonApi.default.getApiTokenHeader()).pipe((0, _operators.map)(function (response) {
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
        }), (0, _operators.catchError)(function (error) {
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
            var actionProps = {
              siteCode: siteCode,
              position: position,
              month: month,
              downloadPkg: downloadPkg,
              timeStep: timeStep
            }; // eslint-disable-next-line max-len

            var path = "sites['".concat(siteCode, "'].positions['").concat(position, "'].data['").concat(month, "']['").concat(downloadPkg, "']['").concat(timeStep, "']");

            var _get = (0, _get2.default)(state.product, path, {}),
                url = _get.url,
                status = _get.status; // If the file isn't awaiting a fetch call then don't fetch it


            if (!url || status !== FETCH_STATUS.AWAITING_CALL) {
              return;
            } // Use the dataFetchTokens set to make sure we don't somehow add the same fetch twice


            var previousSize = dataFetchTokens.size;
            var token = "".concat(siteCode, ";").concat(position, ";").concat(month, ";").concat(downloadPkg, ";").concat(timeStep);
            dataFetchTokens.add(token);

            if (dataFetchTokens.size === previousSize) {
              return;
            } // Save the action props to pass to the fetchDataFiles action to set all fetch statuses


            dataActions.push(actionProps); // Add a file fetch observable to the main list

            dataFetches.push(fetchCSV(url).pipe((0, _operators.map)(function (response) {
              dispatch(_extends({
                type: 'fetchDataFileSucceeded',
                csv: response.response
              }, actionProps));
              return (0, _rxjs.of)(true);
            }), (0, _operators.catchError)(function (error) {
              dispatch(_extends({
                type: 'fetchDataFileFailed',
                error: error.message
              }, actionProps));
              return (0, _rxjs.of)(false);
            })));
          });
        });
      });
    }; // MAIN LOOP - Trigger fetches as needed for all selected sites


    state.selection.sites.forEach(function (site) {
      var siteCode = site.siteCode;

      if (!state.product.sites[siteCode]) {
        return;
      }

      var fetches = state.product.sites[siteCode].fetches; // Fetch variables for any sites in seleciton that haven't had variables fetched

      if (fetches.variables.status === FETCH_STATUS.AWAITING_CALL && fetches.variables.url) {
        fetchSiteVariables(siteCode, fetches.variables.url);
        metaFetchTriggered = true;
      } // Fetch positions for any site months in seleciton that haven't had positions fetched


      if (fetches.positions.status === FETCH_STATUS.AWAITING_CALL && fetches.positions.url) {
        fetchSitePositions(siteCode, fetches.positions.url);
        metaFetchTriggered = true;
      } // Fetch any site months in selection that have not been fetched


      fetchNeededSiteMonths(siteCode, fetches); // Add any fetch observables for needed data to dataFetches and dataFetchTokens

      if (state.status === TIME_SERIES_VIEWER_STATUS.READY_FOR_DATA && !metaFetchTriggered) {
        prepareDataFetches(site);
      }
    }); // Trigger all data fetches

    if (state.status === TIME_SERIES_VIEWER_STATUS.READY_FOR_DATA && !metaFetchTriggered) {
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
        (0, _rxUtil.forkJoinWithProgress)(dataFetches).pipe((0, _operators.mergeMap)(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              finalResult = _ref2[0],
              progress = _ref2[1];

          return (0, _rxjs.merge)(progress.pipe((0, _operators.tap)(function (value) {
            return dispatch({
              type: 'fetchDataFilesProgress',
              token: masterFetchToken,
              value: value
            });
          }), (0, _operators.ignoreElements)()), finalResult);
        })).subscribe(function (value) {
          return dispatch({
            type: 'fetchDataFilesCompleted',
            token: masterFetchToken,
            value: value
          });
        });
      }
    }
  }, [state.status, state.selection, state.selection.digest, state.variables, state.product]);
  /**
     Render
  */

  return /*#__PURE__*/_react.default.createElement(Context.Provider, {
    value: [state, dispatch]
  }, children);
};
/**
   Prop Types
*/


var productDataShape = _propTypes.default.shape({
  productCode: _propTypes.default.string.isRequired,
  productName: _propTypes.default.string.isRequired,
  siteCodes: _propTypes.default.arrayOf(_propTypes.default.shape({
    siteCode: _propTypes.default.string.isRequired,
    availableMonths: _propTypes.default.arrayOf(_propTypes.default.string).isRequired
  }))
});

var TimeSeriesViewerPropTypes = {
  productCode: function productCode(props, propName, componentName) {
    var productCode = props.productCode,
        productData = props.productData;

    if (!productCode && !productData) {
      return new Error("One of props 'productCode' or 'productData' was not specified in '".concat(componentName, "'."));
    }

    if (productCode) {
      _propTypes.default.checkPropTypes({
        productCode: _propTypes.default.string
      }, {
        productCode: productCode
      }, propName, componentName);
    }

    return null;
  },
  productData: function productData(props, propName, componentName) {
    var productCode = props.productCode,
        productData = props.productData;

    if (!productCode && !productData) {
      return new Error("One of props 'productCode' or 'productData' was not specified in '".concat(componentName, "'."));
    }

    if (productData) {
      _propTypes.default.checkPropTypes({
        productData: productDataShape
      }, {
        productData: productData
      }, propName, componentName);
    }

    return null;
  }
};
Provider.propTypes = {
  productCode: TimeSeriesViewerPropTypes.productCode,
  productData: TimeSeriesViewerPropTypes.productData,
  children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string])), _propTypes.default.node, _propTypes.default.string]).isRequired
};
Provider.defaultProps = {
  productCode: null,
  productData: null
};
/**
   Export
*/

var TimeSeriesViewerContext = {
  Provider: Provider,
  useTimeSeriesViewerState: useTimeSeriesViewerState,
  TimeSeriesViewerPropTypes: TimeSeriesViewerPropTypes,
  getUpdatedValueRange: getUpdatedValueRange
};
var _default = TimeSeriesViewerContext;
exports.default = _default;