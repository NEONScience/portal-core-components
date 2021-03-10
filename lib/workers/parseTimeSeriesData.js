"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseTimeSeriesData;

var _paralleljs = _interopRequireDefault(require("paralleljs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
   Worker - Parse Time Series Data

   This function workerizes the process of building an object containing series of data, indexed
   by fieldName, from a data fetch response. The goal is to produce series columns like so:
     { varX: [1, 10, ...], varY: [2. 20, ...], varZ: [3, 30,...] }
   ...that can be stitched together to create continuous series.

   @param {Object} payload
     @param {string} csv - unparsed CSV string from a data fetch response
     @param {Object} variables - variables object from TimeSeriesViewerContext state
   @return {Object} series object to be applied to state (product/site/position/month/downloadPkg)
*/
function parseTimeSeriesData() {
  var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var worker = new _paralleljs.default(payload);
  return worker.spawn(function (inData) {

    // Babel polyfills for worker logic
    function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

    // Validate payload
    var csv = inData.csv,
        variables = inData.variables;

    if (typeof csv !== 'string' || !csv.length) {
      return {};
    }

    if (!variables || _typeof(variables) !== 'object' || !Object.keys(variables).length) {
      return {};
    }

    var rows = csv.split('\n'); // Functions to convert a value to the proper JS data type given a NEON variable dataType

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
    }; // Function copied from TimeSeriesViewerContext
    // Expands a nullable high/low value range based on a single new value

    var getUpdatedValueRange = function getUpdatedValueRange(existingRange, newValue) {
      var arrayVal = Array.isArray(newValue) ? newValue : [newValue];

      if (arrayVal.some(function (v) {
        return typeof v !== 'number';
      })) {
        return existingRange;
      }

      var newRange = [existingRange[0], existingRange[1]];
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

    var series = {};
    var fields = []; // Ignore any series that don't map to a known variable.

    var skipIndexes = [];
    rows[0].split(',').forEach(function (fieldName, idx) {
      if (!variables[fieldName]) {
        skipIndexes.push(idx);
        return;
      }

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
    }); // Visit each row and column to transpose values into columnar format in series

    rows.slice(1).forEach(function (row) {
      if (!row.length) {
        return;
      }

      var values = row.split(',');
      values.filter(function (value, idx) {
        return !skipIndexes.includes(idx);
      }).forEach(function (value, idx) {
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

      if (Number.isFinite(series[fieldName].range[0]) && series[fieldName].range[0] === series[fieldName].range[1]) {
        series[fieldName].variance = 0;
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
    }); // Done!

    return series;
  });
}