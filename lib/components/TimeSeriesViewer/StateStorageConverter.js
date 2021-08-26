"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertStateFromStorage = exports.convertStateForStorage = void 0;

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Alter the current state for valid JSON serialization.
 * @param currentState The current state
 */
var convertStateForStorage = function convertStateForStorage(state) {
  var newState = (0, _cloneDeep.default)(state);

  switch (newState.status) {
    case _constants.TIME_SERIES_VIEWER_STATUS.INIT_PRODUCT:
    case _constants.TIME_SERIES_VIEWER_STATUS.LOADING_META:
    case _constants.TIME_SERIES_VIEWER_STATUS.READY_FOR_DATA:
    case _constants.TIME_SERIES_VIEWER_STATUS.LOADING_DATA:
    case _constants.TIME_SERIES_VIEWER_STATUS.WARNING:
    case _constants.TIME_SERIES_VIEWER_STATUS.ERROR:
      newState.status = _constants.TIME_SERIES_VIEWER_STATUS.INIT_PRODUCT;
      break;

    case _constants.TIME_SERIES_VIEWER_STATUS.READY:
      newState.status = _constants.TIME_SERIES_VIEWER_STATUS.READY_FOR_SERIES;
      break;

    default:
      break;
  } // variables


  var stateVariables = state.variables;
  Object.keys(stateVariables).forEach(function (variableKey, index) {
    var _stateVariables$varia = stateVariables[variableKey],
        sites = _stateVariables$varia.sites,
        tables = _stateVariables$varia.tables,
        timeSteps = _stateVariables$varia.timeSteps;

    if (sites instanceof Set && sites.size > 0) {
      newState.variables[variableKey].sites = Array.from(sites);
    } else {
      newState.variables[variableKey].sites = [];
    }

    if (tables instanceof Set && sites.size > 0) {
      newState.variables[variableKey].tables = Array.from(tables);
    } else {
      newState.variables[variableKey].tables = [];
    }

    if (timeSteps instanceof Set && sites.size > 0) {
      newState.variables[variableKey].timeSteps = Array.from(timeSteps);
    } else {
      newState.variables[variableKey].timeSteps = [];
    }
  }); // product site variables

  var productSites = state.product.sites;
  Object.keys(productSites).forEach(function (siteKey, index) {
    var siteVariables = productSites[siteKey].variables;

    if (siteVariables instanceof Set && siteVariables.size > 0) {
      newState.product.sites[siteKey].variables = Array.from(siteVariables);
    } else {
      newState.product.sites[siteKey].variables = [];
    }
  }); // available quality flags

  var availableQualityFlags = state.availableQualityFlags;

  if (availableQualityFlags instanceof Set) {
    newState.availableQualityFlags = Array.from(availableQualityFlags);
  } else {
    newState.availableQualityFlags = [];
  } // available time steps


  var availableTimeSteps = state.availableTimeSteps;

  if (availableTimeSteps instanceof Set) {
    newState.availableTimeSteps = Array.from(availableTimeSteps);
  } else {
    newState.availableTimeSteps = [];
  }

  return newState;
};
/**
 * Restore the state from JSON serialization.
 * @param storedState The state read from storage.
 */


exports.convertStateForStorage = convertStateForStorage;

var convertStateFromStorage = function convertStateFromStorage(state) {
  var newState = (0, _cloneDeep.default)(state); // graphData data

  var data = state.graphData.data.map(function (entry) {
    return [new Date(entry[0]), entry[1]];
  });
  newState.graphData.data = data; // state variables

  var variables = state.variables;
  Object.keys(variables).forEach(function (key, index) {
    var _variables$key = variables[key],
        sites = _variables$key.sites,
        tables = _variables$key.tables,
        timeSteps = _variables$key.timeSteps;

    if (Array.isArray(sites)) {
      newState.variables[key].sites = new Set(sites);
    } else {
      newState.variables[key].sites = new Set();
    }

    if (Array.isArray(tables)) {
      newState.variables[key].tables = new Set(tables);
    } else {
      newState.variables[key].tables = new Set();
    }

    if (Array.isArray(timeSteps)) {
      newState.variables[key].timeSteps = new Set(timeSteps);
    } else {
      newState.variables[key].timeSteps = new Set();
    }
  }); // product site variables

  var productSites = state.product.sites; // get the variables for each site

  Object.keys(productSites).forEach(function (siteKey, index) {
    var siteVariables = productSites[siteKey].variables;

    if (Array.isArray(siteVariables) && siteVariables.length > 0) {
      newState.product.sites[siteKey].variables = new Set(siteVariables);
    } else {
      newState.product.sites[siteKey].variables = new Set();
    }
  }); // available quality flags

  var availableQualityFlags = state.availableQualityFlags;

  if (Array.isArray(availableQualityFlags)) {
    newState.availableQualityFlags = new Set(availableQualityFlags);
  } else {
    newState.availableQualityFlags = new Set();
  } // available quality flags


  var availableTimeSteps = state.availableTimeSteps;

  if (Array.isArray(availableTimeSteps)) {
    newState.availableTimeSteps = new Set(availableTimeSteps);
  } else {
    newState.availableTimeSteps = new Set();
  }

  return newState;
};

exports.convertStateFromStorage = convertStateFromStorage;