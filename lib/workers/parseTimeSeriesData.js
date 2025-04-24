"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseTimeSeriesData;
var _paralleljs = _interopRequireDefault(require("../vendor/paralleljs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
  let payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const worker = new _paralleljs.default(payload);
  return worker.spawn(inData => {
    // Validate payload
    const {
      csv,
      variables
    } = inData;
    if (typeof csv !== 'string' || !csv.length) {
      return {};
    }
    if (!variables || typeof variables !== 'object' || !Object.keys(variables).length) {
      return {};
    }
    const rows = csv.split('\n');

    // Functions to convert a value to the proper JS data type given a NEON variable dataType
    const castFloat = v => {
      const cast = parseFloat(v, 10);
      return Number.isNaN(cast) ? null : cast;
    };
    const castInt = v => {
      const cast = parseInt(v, 10);
      return Number.isNaN(cast) ? null : cast;
    };
    const DATA_TYPE_SETTERS = {
      dateTime: v => typeof v === 'string' ? v.replace(/"/g, '') : v,
      real: castFloat,
      'signed integer': castInt,
      'unsigned integer': castInt
    };

    // Function copied from TimeSeriesViewerContext
    // Expands a nullable high/low value range based on a single new value
    const getUpdatedValueRange = (existingRange, newValue) => {
      const arrayVal = Array.isArray(newValue) ? newValue : [newValue];
      if (arrayVal.some(v => typeof v !== 'number')) {
        return existingRange;
      }
      const newRange = [existingRange[0], existingRange[1]];
      arrayVal.forEach(v => {
        if (newRange[0] === null || newRange[0] > v) {
          newRange[0] = v;
        }
        if (newRange[1] === null || newRange[1] < v) {
          newRange[1] = v;
        }
      });
      return newRange;
    };
    const series = {};
    const fields = [];

    // Ignore any series that don't map to a known variable.
    const skipIndexes = [];
    rows[0].split(',').forEach((fieldName, idx) => {
      if (!variables[fieldName]) {
        skipIndexes.push(idx);
        return;
      }
      const {
        dataType
      } = variables[fieldName];
      const field = {
        fieldName,
        setType: DATA_TYPE_SETTERS[dataType] ? DATA_TYPE_SETTERS[dataType] : v => v
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

    // Visit each row and column to transpose values into columnar format in series
    rows.slice(1).forEach(row => {
      if (!row.length) {
        return;
      }
      const values = row.split(',');
      values.filter((value, idx) => !skipIndexes.includes(idx)).forEach((value, idx) => {
        const typedValue = fields[idx].setType(value);
        series[fields[idx].fieldName].data.push(typedValue);
        // Don't bother updating the range for non-numerical series and quality flags
        if (typeof typedValue === 'number' && !/QF$/.test(fields[idx].fieldName)) {
          series[fields[idx].fieldName].range = getUpdatedValueRange(series[fields[idx].fieldName].range, typedValue);
          series[fields[idx].fieldName].sum += typedValue;
          series[fields[idx].fieldName].count += 1;
        }
      });
    });

    // Loop across all numeric non-quality-flag series again to calculate series variance
    Object.keys(series).filter(fieldName => !/QF$/.test(fieldName) && series[fieldName].count > 0).forEach(fieldName => {
      const {
        dataType
      } = variables[fieldName];
      const setType = DATA_TYPE_SETTERS[dataType] ? DATA_TYPE_SETTERS[dataType] : v => v;
      if (!['real', 'signed integer', 'unsigned integer'].includes(dataType)) {
        return;
      }
      if (Number.isFinite(series[fieldName].range[0]) && series[fieldName].range[0] === series[fieldName].range[1]) {
        series[fieldName].variance = 0;
        return;
      }
      const mean = series[fieldName].sum / series[fieldName].count;
      let sumOfSquares = 0;
      series[fieldName].data.forEach(value => {
        if (value === null) {
          return;
        }
        const typedValue = setType(value);
        sumOfSquares += (typedValue - mean) ** 2;
      });
      series[fieldName].variance = sumOfSquares / series[fieldName].count;
    });

    // Done!
    return series;
  });
}