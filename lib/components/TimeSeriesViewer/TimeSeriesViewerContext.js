"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _moment = _interopRequireDefault(require("moment"));

var _get2 = _interopRequireDefault(require("lodash/get"));

var _uniqueId = _interopRequireDefault(require("lodash/uniqueId"));

var _papaparse = require("papaparse");

var _rxjs = require("rxjs");

var _ajax = require("rxjs/ajax");

var _operators = require("rxjs/operators");

var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));

var _NeonGraphQL = _interopRequireDefault(require("../NeonGraphQL/NeonGraphQL"));

var _rxUtil = require("../../util/rxUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// Every possible status a single fetch request can have
var FETCH_STATUS = {
  AWAITING_CALL: 'AWAITING_CALL',
  FETCHING: 'FETCHING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS'
}; // Every possible top-level status the TimeSeriesViewer component can have

var COMP_STATUS = {
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

}; // Array offsets for use when splitting a data file URL

var DATA_FILE_PARTS = {
  POSITION_H: 6,
  POSITION_V: 7,
  TIME_SCALE: 8,
  MONTH: 10,
  PACKAGE_TYPE: 11
}; // Functions to convert a value to the proper JS data type given a NEON variable dataType

var DATA_TYPE_SETTERS = {
  dateTime: function dateTime(v) {
    return v.replace(/"/g, '');
  },
  real: function real(v) {
    return parseFloat(v, 10);
  },
  'signed integer': function signedInteger(v) {
    return parseInt(v, 10);
  },
  'unsigned integer': function unsignedInteger(v) {
    return parseInt(v, 10);
  }
};
/**
   Context and Hook Setup
*/

var DEFAULT_STATE = {
  status: COMP_STATUS.INIT_PRODUCT,
  fetchProduct: {
    status: FETCH_STATUS.AWAITING_CALL,
    error: null
  },
  metaFetches: {},
  dataFetches: {},
  dataFetchProgress: 0,
  variables: {},
  selectableVariables: [],
  product: {
    productCode: null,
    productName: null,
    productDescription: null,
    productSensor: null,
    dateRange: [null, null],
    continuousDateRange: [],
    variables: {},
    sites: {}
  },
  selection: {
    dateRange: [null, null],
    variables: [],
    sites: []
  },
  options: {
    timeScale: '30min'
  }
};
var Context = (0, _react.createContext)(DEFAULT_STATE);

var useTimeSeriesViewerState = function useTimeSeriesViewerState() {
  var hookResponse = (0, _react.useContext)(Context);

  if (hookResponse.length !== 2) {
    return [_extends({}, DEFAULT_STATE), function () {}];
  }

  return hookResponse;
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

var parseCSV = function parseCSV(csv) {
  return (0, _papaparse.parse)(csv, {
    header: true,
    skipEmptyLines: 'greedy' // dynamicTyping: true,

  });
};
/**
   Time Scale Definitions and Functions
*/


var TIME_SCALES = {
  '1min': {
    id: '1min',
    seconds: 60
  },
  '2min': {
    id: '2min',
    seconds: 120
  },
  '5min': {
    id: '5min',
    seconds: 300
  },
  '30min': {
    id: '30min',
    seconds: 1800
  }
};

var getTimeScale = function getTimeScale(input) {
  var cleaned = input;

  if (input.includes('_')) {
    cleaned = input.split('_').slice(1).join('');
  }

  if (TIME_SCALES[cleaned]) {
    return cleaned;
  }

  var mapping = {
    '001': '1min',
    '002': '2min',
    '005': '5min',
    '030': '30min'
  };

  if (mapping[cleaned]) {
    return mapping[cleaned];
  }

  return input;
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

  if (dateRange[0] === dateRange[1]) {
    return dateRange;
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

  if (continuousRange.length === 2 && continuousRange[0] === continuousRange[1]) {
    return [continuousRange[0]];
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
        variables: {
          status: FETCH_STATUS.AWAITING_CALL,
          error: null,
          url: null
        },
        positions: {
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
 * @return {Object} updated site object to be applied at state.product.sites[{site}]
 */


var parseSiteMonthData = function parseSiteMonthData(site, files) {
  var newSite = _extends({}, site);

  files.forEach(function (file) {
    var name = file.name,
        url = file.url;

    if (!/\.csv$/.test(name)) {
      return;
    }

    if (name.includes('variables')) {
      newSite.fetches.variables.url = url;
      return;
    }

    if (name.includes('sensor_positions')) {
      newSite.fetches.positions.url = url;
      return;
    }

    var parts = name.split('.');
    var position = "".concat(parts[DATA_FILE_PARTS.POSITION_H], ".").concat(parts[DATA_FILE_PARTS.POSITION_V]);
    var month = parts[DATA_FILE_PARTS.MONTH];
    var packageType = parts[DATA_FILE_PARTS.PACKAGE_TYPE];
    var timeScale = getTimeScale(parts[DATA_FILE_PARTS.TIME_SCALE]);

    if (!newSite.positions[position]) {
      newSite.positions[position] = {
        data: {}
      };
    }

    if (!newSite.positions[position].data[month]) {
      newSite.positions[position].data[month] = {};
    }

    if (!newSite.positions[position].data[month][packageType]) {
      newSite.positions[position].data[month][packageType] = {};
    }

    newSite.positions[position].data[month][packageType][timeScale] = {
      url: url,
      status: FETCH_STATUS.AWAITING_CALL,
      error: null,
      series: {}
    };
  });
  return newSite;
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
    var timeScale = getTimeScale(table);
    var isSelectable = variable.dataType !== 'dateTime' && variable.units !== 'NA' && !/QF/.test(fieldName);
    var canBeDefault = isSelectable && variable.downloadPkg !== 'expanded' && !/QM/.test(fieldName);
    variablesSet.add(fieldName);

    if (!newStateVariables[fieldName]) {
      newStateVariables[fieldName] = {
        dataType: dataType,
        description: description,
        downloadPkg: downloadPkg,
        units: units,
        timeScales: new Set(),
        sites: new Set(),
        isSelectable: isSelectable,
        canBeDefault: canBeDefault
      };
    }

    newStateVariables[fieldName].timeScales.add(timeScale);
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

  var positions = parseCSV(csv);
  positions.data.forEach(function (position) {
    var posId = position['HOR.VER'];

    if (!newSite.positions[posId]) {
      newSite.positions[posId] = {
        data: {}
      };
    }

    newSite.positions[posId] = _extends({}, position, {
      data: newSite.positions[posId].data
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
    series[fieldName] = [];
  });
  rows.slice(1).forEach(function (row) {
    var values = row.split(',');
    values.forEach(function (value, idx) {
      series[fields[idx].fieldName].push(fields[idx].setType(value));
    });
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
      variables = state.variables;
  var selection = state.selection || {
    dateRange: [null, null],
    variables: [],
    sites: []
  };

  if (!Object.keys(product.sites).length) {
    return selection;
  } // Selection must have at least one site (default to first in list)


  if (!selection.sites.length) {
    var siteCodes = Object.keys(product.sites);
    siteCodes.sort();
    selection.sites.push({
      siteCode: siteCodes[0],
      positions: []
    });
  } // Selection must have a date range (default to latest month)


  if (selection.dateRange[0] === null || selection.dateRange[1] === null) {
    var availableMonths = product.sites[selection.sites[0].siteCode].availableMonths;
    var initialMonth = availableMonths[availableMonths.length - 1];
    selection.dateRange = [initialMonth, initialMonth];
  } // If any selected sites don't have selected positions attempt to add one


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
  }); // If the selection has no variables attempt to add one

  if (!selection.variables.length && Object.keys(variables).length) {
    var defaultVar = Object.keys(variables).find(function (variable) {
      return variables[variable].canBeDefault;
    });

    if (defaultVar) {
      selection.variables.push(defaultVar);
    }
  } // Generate a new digest for effect comparison


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
    if (Object.keys(newState.metaFetches).length) {
      newState.status = COMP_STATUS.LOADING_META;
    } else if (Object.keys(newState.dataFetches).length) {
      newState.status = COMP_STATUS.LOADING_DATA;
    } else {
      newState.status = COMP_STATUS.READY_FOR_DATA;
    }
  };

  var limitVariablesToTwoUnits = function limitVariablesToTwoUnits(variables) {
    var selectedUnits = state.selection.variables.reduce(function (units, variable) {
      units.add(state.variables[variable].units);
      return units;
    }, new Set());

    if (selectedUnits.size < 2) {
      return variables;
    }

    return variables.filter(function (variable) {
      return selectedUnits.has(state.variables[variable].units);
    });
  };

  var setDataFileFetchStatuses = function setDataFileFetchStatuses(fetches) {
    fetches.forEach(function (fetch) {
      var siteCode = fetch.siteCode,
          position = fetch.position,
          month = fetch.month,
          downloadPkg = fetch.downloadPkg,
          timeScale = fetch.timeScale;
      newState.product.sites[siteCode].positions[position].data[month][downloadPkg][timeScale].status = FETCH_STATUS.FETCHING;
    });
  };

  var parsedContent = null;

  switch (action.type) {
    // Fetch Product Actions
    case 'initFetchProductCalled':
      newState.fetchProduct.status = FETCH_STATUS.FETCHING;
      return newState;

    case 'initFetchProductFailed':
      newState.fetchProduct.status = FETCH_STATUS.ERROR;
      newState.fetchProduct.error = action.error;
      newState.status = COMP_STATUS.ERROR;
      return newState;

    case 'initFetchProductSucceeded':
      newState.fetchProduct.status = FETCH_STATUS.SUCCESS;
      newState.product = parseProductData(action.productData);
      calcSelection();
      newState.status = COMP_STATUS.LOADING_META;
      return newState;
    // Fetch Site Month Actions

    case 'fetchSiteMonth':
      newState.metaFetches["fetchSiteMonth.".concat(action.siteCode, ".").concat(action.month)] = true;
      newState.product.sites[action.siteCode].fetches[action.month] = {
        status: FETCH_STATUS.FETCHING,
        error: null
      };
      newState.status = COMP_STATUS.LOADING_META;
      return newState;

    case 'fetchSiteMonthFailed':
      delete newState.metaFetches["fetchSiteMonth.".concat(action.siteCode, ".").concat(action.month)];
      newState.product.sites[action.siteCode].fetches[action.month].status = FETCH_STATUS.ERROR;
      newState.product.sites[action.siteCode].fetches[action.month].error = action.error;
      calcStatus();
      return newState;

    case 'fetchSiteMonthSucceeded':
      delete newState.metaFetches["fetchSiteMonth.".concat(action.siteCode, ".").concat(action.month)];
      newState.product.sites[action.siteCode].fetches[action.month].status = FETCH_STATUS.SUCCESS;
      newState.product.sites[action.siteCode] = parseSiteMonthData(newState.product.sites[action.siteCode], action.files);
      calcSelection();
      calcStatus();
      return newState;
    // Fetch Site Variables Actions

    case 'fetchSiteVariables':
      newState.metaFetches["fetchSiteVariables.".concat(action.siteCode)] = true;
      newState.product.sites[action.siteCode].fetches.variables.status = FETCH_STATUS.FETCHING;
      newState.status = COMP_STATUS.LOADING_META;
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
      newState.variables = parsedContent.variablesObject;
      newState.product.sites[action.siteCode].variables = parsedContent.variablesSet;
      calcSelection();
      calcStatus();
      return newState;
    // Fetch Site Positions Actions

    case 'fetchSitePositions':
      newState.metaFetches["fetchSitePositions.".concat(action.siteCode)] = true;
      newState.product.sites[action.siteCode].fetches.positions.status = FETCH_STATUS.FETCHING;
      newState.status = COMP_STATUS.LOADING_META;
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
      newState.status = COMP_STATUS.LOADING_DATA;
      return newState;

    case 'fetchDataFilesProgress':
      newState.dataFetchProgress = action.value;
      return newState;

    case 'fetchDataFilesCompleted':
      delete newState.dataFetches[action.token];
      newState.status = COMP_STATUS.READY;
      return newState;

    case 'noDataFilesFetchNecessary':
      newState.status = COMP_STATUS.READY;
      return newState;
    // Fetch Data Actions (Single File)

    case 'fetchDataFileFailed':
      newState.product.sites[action.siteCode].positions[action.position].data[action.month][action.downloadPkg][action.timeScale].status = FETCH_STATUS.ERROR;
      newState.product.sites[action.siteCode].positions[action.position].data[action.month][action.downloadPkg][action.timeScale].error = action.error;
      return newState;

    case 'fetchDataFileSucceeded':
      newState.product.sites[action.siteCode].positions[action.position].data[action.month][action.downloadPkg][action.timeScale].status = FETCH_STATUS.SUCCESS;
      newState.product.sites[action.siteCode].positions[action.position].data[action.month][action.downloadPkg][action.timeScale].series = parseSeriesData(action.csv, newState.variables);
      return newState;
    // Selection Actions

    case 'selectDateRange':
      newState.selection.dateRange = action.dateRange;
      calcSelection();
      calcStatus();
      return newState;

    case 'selectVariables':
      newState.selection.variables = limitVariablesToTwoUnits(action.variables);
      calcSelection();
      calcStatus();
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

  var initialState = _extends({}, DEFAULT_STATE, {
    status: productDataProp ? COMP_STATUS.LOADING_META : COMP_STATUS.INIT_PRODUCT
  });

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
     Effect - Fetch product data if only a product code was provided in props
  */


  (0, _react.useEffect)(function () {
    if (state.status !== COMP_STATUS.INIT_PRODUCT) {
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

      return "".concat(root, "/").concat(state.product.productCode, "/").concat(siteCode, "/").concat(month, "?presign=false");
    };

    var timeScale = state.options.timeScale;
    var continuousDateRange = getContinuousDatesArray(state.selection.dateRange);
    var dataFetchTokens = new Set();
    var dataFetches = [];
    var dataActions = [];

    var fetchSiteVariables = function fetchSiteVariables(siteCode, fetches) {
      dispatch({
        type: 'fetchSiteVariables',
        siteCode: siteCode
      });
      fetchCSV(fetches.variables.url).pipe((0, _operators.map)(function (response) {
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

    var fetchSitePositions = function fetchSitePositions(siteCode, fetches) {
      dispatch({
        type: 'fetchSitePositions',
        siteCode: siteCode
      });
      fetchCSV(fetches.positions.url).pipe((0, _operators.map)(function (response) {
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
        return !fetches[month];
      }).forEach(function (month) {
        dispatch({
          type: 'fetchSiteMonth',
          siteCode: siteCode,
          month: month
        });

        _ajax.ajax.getJSON(getSiteMonthDataURL(siteCode, month)).pipe((0, _operators.map)(function (response) {
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
      state.selection.variables.forEach(function (variable) {
        var downloadPkg = state.variables[variable].downloadPkg;
        positions.forEach(function (position) {
          continuousDateRange.forEach(function (month) {
            var actionProps = {
              siteCode: siteCode,
              position: position,
              month: month,
              downloadPkg: downloadPkg,
              timeScale: timeScale
            }; // eslint-disable-next-line max-len

            var path = "sites['".concat(siteCode, "'].positions['").concat(position, "'].data['").concat(month, "']['").concat(downloadPkg, "']['").concat(timeScale, "']");

            var _get = (0, _get2.default)(state.product, path, {}),
                url = _get.url,
                status = _get.status; // If the file isn't awaiting a fetch call then don't fetch it


            if (!url || status !== FETCH_STATUS.AWAITING_CALL) {
              return;
            } // Use the dataFetchTokens set to make sure we don't somehow add the same fetch twice


            var previousSize = dataFetchTokens.size;
            var token = "".concat(siteCode, ";").concat(position, ";").concat(month, ";").concat(downloadPkg, ";").concat(timeScale);
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
      var fetches = state.product.sites[siteCode].fetches; // Fetch variables for any sites in seleciton that haven't had variables fetched

      if (fetches.variables.status === FETCH_STATUS.AWAITING_CALL && fetches.variables.url) {
        fetchSiteVariables(siteCode, fetches);
      } // Fetch positions for any sites in seleciton that haven't had positions fetched


      if (fetches.positions.status === FETCH_STATUS.AWAITING_CALL && fetches.positions.url) {
        fetchSitePositions(siteCode, fetches);
      } // Fetch any site months in selection that have not been fetched


      fetchNeededSiteMonths(siteCode, fetches); // Add any fetch observables for needed data to dataFetches and dataFetchTokens

      if (state.status === COMP_STATUS.READY_FOR_DATA) {
        prepareDataFetches(site);
      }
    }); // Trigger all data fetches

    if (state.status === COMP_STATUS.READY_FOR_DATA) {
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
  }, [state.status, state.selection, state.selection.digest, state.variables, state.product, state.options]);
  /**
     Render
  */

  return _react.default.createElement(Context.Provider, {
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
  TimeSeriesViewerPropTypes: TimeSeriesViewerPropTypes
};
var _default = TimeSeriesViewerContext;
exports.default = _default;