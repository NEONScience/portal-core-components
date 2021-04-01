"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTimeSteps = getTimeSteps;
exports.default = generateTimeSeriesGraphData;
exports.getTestableItems = void 0;

var _paralleljs = _interopRequireDefault(require("paralleljs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getTimeSteps() {
  return {
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
      key: '60min',
      tmi: '060',
      seconds: 3600
    },
    '0AQ': {
      key: '0AQ',
      tmi: '100',
      seconds: 60
    },
    '1day': {
      key: '1day',
      tmi: '01D',
      seconds: 86400
    }
  };
}

function monthIsValidFormat(month) {
  return typeof month === 'string' && /^\d{4}-\d{2}$/.test(month);
}

function monthToNumbers(month) {
  if (!monthIsValidFormat(month)) {
    return {
      y: null,
      m: null
    };
  }

  var split = month.split('-');
  return {
    y: parseInt(split[0], 10),
    m: parseInt(split[1], 10)
  };
}

function monthIsValid(month) {
  if (!monthIsValidFormat(month)) {
    return false;
  }

  var _monthToNumbers = monthToNumbers(month),
      y = _monthToNumbers.y,
      m = _monthToNumbers.m;

  return y !== null && m !== null && y >= 2000 && m >= 1 && m <= 12;
}

function monthToTicker(month) {
  if (!monthIsValid(month)) {
    return 0;
  }

  var _monthToNumbers2 = monthToNumbers(month),
      y = _monthToNumbers2.y,
      m = _monthToNumbers2.m;

  return Date.UTC(y, m - 1, 1, 0, 0, 0);
}

function tickerIsValid(ticker) {
  return typeof ticker === 'number' && !Number.isNaN(ticker) && ticker > 0;
}

function tickerToMonth(ticker) {
  if (!tickerIsValid(ticker)) {
    return null;
  }

  var d = new Date(ticker);
  var YYYY = d.getUTCFullYear().toString();
  var MM = (d.getUTCMonth() + 1).toString().padStart(2, '0');
  return "".concat(YYYY, "-").concat(MM);
}

function tickerToIso(ticker) {
  var includeSeconds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (!tickerIsValid(ticker)) {
    return null;
  }

  var d = new Date(ticker);
  var YYYY = d.getUTCFullYear().toString();
  var MM = (d.getUTCMonth() + 1).toString().padStart(2, '0');
  var DD = d.getUTCDate().toString().padStart(2, '0');
  var hh = d.getUTCHours().toString().padStart(2, '0');
  var mm = d.getUTCMinutes().toString().padStart(2, '0');
  var ss = d.getUTCSeconds().toString().padStart(2, '0');
  return includeSeconds ? "".concat(YYYY, "-").concat(MM, "-").concat(DD, "T").concat(hh, ":").concat(mm, ":").concat(ss, "Z") : "".concat(YYYY, "-").concat(MM, "-").concat(DD, "T").concat(hh, ":").concat(mm, "Z");
}

function getNextMonth(month) {
  if (!monthIsValid(month)) {
    return null;
  }

  var _monthToNumbers3 = monthToNumbers(month),
      y = _monthToNumbers3.y,
      m = _monthToNumbers3.m;

  m += 1;

  if (m === 13) {
    m = 1;
    y += 1;
  }

  return "".concat(y.toString(), "-").concat(m.toString().padStart(2, '0'));
} // Additional items exported for unit testing

var getTestableItems = function getTestableItems() {
  return process.env.NODE_ENV !== 'test' ? {} : {
    monthIsValidFormat: monthIsValidFormat,
    monthToNumbers: monthToNumbers,
    monthIsValid: monthIsValid,
    monthToTicker: monthToTicker,
    tickerIsValid: tickerIsValid,
    tickerToMonth: tickerToMonth,
    tickerToIso: tickerToIso,
    getNextMonth: getNextMonth
  };
};
/**
   Worker - Generate Time Series Graph Data

   This function workerizes the process of building the graphData object for TimeSeriesViewer state.
   This object is built using parsed series data from elsewhere in state by combining individual
   site/month/variable series into single site/variable series registered to the generated time
   series.

   @param {Object} state - complete TimeSeriesViewer state
   @return {Object} graphData object to be applied to state
*/

exports.getTestableItems = getTestableItems;

function generateTimeSeriesGraphData() {
  var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var worker = new _paralleljs.default(payload).require(getTimeSteps).require(monthIsValidFormat).require(monthToNumbers).require(monthIsValid).require(monthToTicker).require(tickerIsValid).require(tickerToMonth).require(tickerToIso).require(getNextMonth);

  return worker.spawn(function (inData) {

    // Babel polyfills for worker logic
    function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

    /**
       Deconstruct necessary values from state
    */
    var product = inData.product,
        stateVariables = inData.variables,
        _inData$selection = inData.selection,
        autoTimeStep = _inData$selection.autoTimeStep,
        continuousDateRange = _inData$selection.continuousDateRange,
        dateRange = _inData$selection.dateRange,
        dateTimeVariable = _inData$selection.dateTimeVariable,
        qualityFlags = _inData$selection.qualityFlags,
        sites = _inData$selection.sites,
        selectedTimeStep = _inData$selection.timeStep,
        selectedVariables = _inData$selection.variables;
    var timeStep = selectedTimeStep === 'auto' ? autoTimeStep : selectedTimeStep;

    var getQFNullFill = function getQFNullFill() {
      return (qualityFlags || []).map(function () {
        return null;
      });
    };

    var TIME_STEPS = getTimeSteps();
    /**
       Validate input (return unmodified state.graphData if anything fails)
    */

    var outSanityCheckData = {
      data: [[0, 0]],
      qualityData: [[0, 0]],
      monthOffsets: {},
      timestampMap: {},
      series: [],
      labels: ['x'],
      qualityLabels: ['start', 'end']
    }; // Must have valid time step

    if (!TIME_STEPS[timeStep]) {
      return outSanityCheckData;
    } // Must have valid date range

    if (!Array.isArray(dateRange) || dateRange.length !== 2 || dateRange.some(function (month) {
      return !monthIsValid(month);
    }) || dateRange[0] > dateRange[1]) {
      return outSanityCheckData;
    } // Must have valid continuous date range with same bounds as date range

    if (!Array.isArray(continuousDateRange) || continuousDateRange.length < 1 || continuousDateRange.some(function (month) {
      return !monthIsValid(month);
    }) || dateRange[0] !== continuousDateRange[0] || dateRange[1] !== continuousDateRange[continuousDateRange.length - 1]) {
      return outSanityCheckData;
    } // Must have qualityFlags that's an array (can be empty) where all entries are valid variables

    if (!Array.isArray(qualityFlags) || qualityFlags.length && qualityFlags.some(function (qf) {
      return !stateVariables[qf];
    })) {
      return outSanityCheckData;
    } // Must have a valid dateTimeVariable that's represented in stateVariables

    if (!dateTimeVariable || !stateVariables[dateTimeVariable]) {
      return outSanityCheckData;
    } // Must have at least one selected variable and all must be in stateVariables

    if (!Array.isArray(selectedVariables) || selectedVariables.some(function (v) {
      return !stateVariables[v];
    })) {
      return outSanityCheckData;
    } // Must have a non-empty selected sites array with all proper structure

    if (!Array.isArray(sites) || !sites.length || sites.some(function (site) {
      return !site.siteCode || !Array.isArray(site.positions) || !site.positions.length;
    })) {
      return outSanityCheckData;
    } // Requires product must be an object with a sites object

    if (_typeof(product) !== 'object' || product === null || _typeof(product.sites) !== 'object' || product.sites === null) {
      return outSanityCheckData;
    } // All selected sites must have positions, and all site/position combinations must be
    // represented in the product with some data

    var productSitesAreValid = true;
    sites.forEach(function (site) {
      var siteCode = site.siteCode,
          positions = site.positions;

      if (_typeof(product.sites[siteCode]) !== 'object' || product.sites[siteCode] === null || _typeof(product.sites[siteCode].positions) !== 'object' || product.sites[siteCode].positions === null) {
        productSitesAreValid = false;
        return;
      }

      positions.forEach(function (position) {
        if (_typeof(product.sites[siteCode].positions[position]) !== 'object' || product.sites[siteCode].positions[position] === null || _typeof(product.sites[siteCode].positions[position].data) !== 'object' || product.sites[siteCode].positions[position].data === null || Object.keys(product.sites[siteCode].positions[position].data).length < 1) {
          productSitesAreValid = false;
        }
      });
    });

    if (!productSitesAreValid) {
      return outSanityCheckData;
    }
    /**
       Initialize data set with timestep-based times and monthOffsets for registering actual data
    */
    // Reinitialize

    var newData = [];
    var newQualityData = [];
    var newMonthOffsets = {};
    var newTimestampMap = {}; // Tick through date range one time step at a time to build data / qualityData / timeStampMap

    var seconds = TIME_STEPS[timeStep].seconds;
    var ticker = monthToTicker(dateRange[0]);
    var endMonth = getNextMonth(dateRange[1]);
    var currentMonth = tickerToMonth(ticker);
    var previousMonth = null;
    var offset = null;
    var endStep = null;

    while (currentMonth < endMonth) {
      newData.push([new Date(ticker)]);
      endStep = ticker + seconds * 1000;
      newQualityData.push([new Date(ticker), new Date(endStep)]);
      offset = newData.length - 1;
      newTimestampMap[ticker] = offset;

      if (currentMonth !== previousMonth) {
        newMonthOffsets[currentMonth] = offset;
        previousMonth = currentMonth;
      }

      ticker += seconds * 1000;
      currentMonth = tickerToMonth(ticker);
    }
    /**
       Build the rest of the data structure and labels using selection values
    */
    // Reinitialize

    var newSeries = [];
    var newLabels = ['x'];
    var newQualityLabels = ['start', 'end']; // Loop through each site

    sites.forEach(function (site) {
      var siteCode = site.siteCode,
          positions = site.positions; // Loop through each site position

      positions.forEach(function (position) {
        // Generate quality flag label and add to the list of quality labels
        var qualityLabel = "".concat(siteCode, " - ").concat(position);

        if (qualityFlags.length && !newQualityLabels.includes(qualityLabel)) {
          newQualityLabels.push(qualityLabel);
        } // For each site position loop through every month in the continuous date range (no gaps)

        continuousDateRange.forEach(function (month) {
          // Use monthOffsets to determine where in the entire data set this month belongs
          if (!Object.keys(newMonthOffsets).includes(month)) {
            return;
          }

          var monthIdx = newMonthOffsets[month];
          var nextMonth = getNextMonth(month);
          var monthStepCount = Object.keys(newMonthOffsets).includes(nextMonth) ? newMonthOffsets[nextMonth] - monthIdx : newData.length - monthIdx; // For each site/position/month loop through all selected variables

          selectedVariables.forEach(function (variable) {
            // Generate series label and add to the list of labels if this is the first we see it
            var label = "".concat(siteCode, " - ").concat(position, " - ").concat(variable);

            if (!newLabels.includes(label)) {
              newLabels.push(label);
              newSeries.push({
                siteCode: siteCode,
                position: position,
                variable: variable,
                label: label,
                units: stateVariables[variable].units
              });
            }

            var columnIdx = newLabels.indexOf(label);

            if (!columnIdx) {
              return;
            } // 0 is x, so this should always be 1 or greater

            var pkg = stateVariables[variable].downloadPkg;
            var posData = product.sites[siteCode].positions[position].data; // Null-fill if this site/position/month/variable has
            // neither series data nor dateTime data

            if (!posData[month] || !posData[month][pkg] || !posData[month][pkg][timeStep] || !posData[month][pkg][timeStep].series[variable] || !posData[month][pkg][timeStep].series[dateTimeVariable]) {
              for (var t = monthIdx; t < monthIdx + monthStepCount; t += 1) {
                newData[t][columnIdx] = null;
              }

              return;
            } // This site/position/month/variable series exists, so add it into the data set

            var seriesStepCount = posData[month][pkg][timeStep].series[variable].data.length; // Series and month data lengths are identical (as expected):
            // Stream values directly in without matching timestamps

            if (seriesStepCount === monthStepCount) {
              posData[month][pkg][timeStep].series[variable].data.forEach(function (d, datumIdx) {
                newData[datumIdx + monthIdx][columnIdx] = d;
              });
              return;
            } // More series data than month data:
            // Stream values directly in without matching timestamps, truncate data so as not to
            // exceed month step count

            if (seriesStepCount >= monthStepCount) {
              posData[month][pkg][timeStep].series[variable].data.forEach(function (d, datumIdx) {
                if (datumIdx >= monthStepCount) {
                  return;
                }

                newData[datumIdx + monthIdx][columnIdx] = d;
              });
              return;
            } // Series data length is shorter than expected month length:
            // Add what data we have by going through each time step in the month and comparing to
            // start dates in the data set, null-filling any steps without a corresponding datum
            // Note that sometimes dates come back with seconds and sometimes without, so for
            // matching we look for either.

            var setSeriesValueByTimestamp = function setSeriesValueByTimestamp(t) {
              var isodateS = tickerToIso(newData[t][0].getTime(), true);
              var isodateM = tickerToIso(newData[t][0].getTime(), false);
              var dataIdx = posData[month][pkg][timeStep].series[dateTimeVariable].data.findIndex(function (dateTimeVal) {
                return dateTimeVal === isodateS || dateTimeVal === isodateM;
              });
              newData[t][columnIdx] = dataIdx !== -1 ? posData[month][pkg][timeStep].series[variable].data[dataIdx] : null;
            };

            for (var _t = monthIdx; _t < monthIdx + monthStepCount; _t += 1) {
              setSeriesValueByTimestamp(_t);
            }
          }); // Also for each site/position/month loop through all selected quality flags

          qualityFlags.forEach(function (qf, qfIdx) {
            var columnIdx = newQualityLabels.indexOf(qualityLabel);

            if (columnIdx < 2) {
              return;
            } // 0 is start and 1 is end

            var pkg = stateVariables[qf].downloadPkg;
            var posData = product.sites[siteCode].positions[position].data; // If this site/position/month/variable has no series data then fill with nulls

            if (!posData[month] || !posData[month][pkg] || !posData[month][pkg][timeStep] || !posData[month][pkg][timeStep].series[qf]) {
              for (var t = monthIdx; t < monthIdx + monthStepCount; t += 1) {
                newQualityData[t][columnIdx] = getQFNullFill();
              }

              return;
            } // This site/position/month/qf series exists, so add it into the quality data set

            var seriesStepCount = posData[month][pkg][timeStep].series[qf].data.length;

            if (seriesStepCount !== monthStepCount) {
              // The series data length does not match the expected month length so
              // loop through by month steps pulling in series values through timestamp matching
              var setQualityValueByTimestamp = function setQualityValueByTimestamp(t) {
                var isodate = tickerToIso(newQualityData[t][0].getTime());
                var dataIdx = posData[month][pkg][timeStep].series[dateTimeVariable].data.findIndex(function (dateTimeVal) {
                  return dateTimeVal === isodate;
                });

                if (dataIdx === -1) {
                  newQualityData[t][columnIdx] = getQFNullFill();
                  return;
                }

                var d = typeof posData[month][pkg][timeStep].series[qf].data[dataIdx] !== 'undefined' ? posData[month][pkg][timeStep].series[qf].data[dataIdx] : null;

                if (!Array.isArray(newQualityData[t][columnIdx])) {
                  newQualityData[t][columnIdx] = [];
                }

                newQualityData[t][columnIdx][qfIdx] = d;
              };

              for (var _t2 = monthIdx; _t2 < monthIdx + monthStepCount; _t2 += 1) {
                setQualityValueByTimestamp(_t2);
              }

              return;
            } // Series and month data lengths are identical as expected so we can stream
            // values directly in without matching timestamps

            posData[month][pkg][timeStep].series[qf].data.forEach(function (d, datumIdx) {
              var t = datumIdx + monthIdx;

              if (!Array.isArray(newQualityData[t][columnIdx])) {
                newQualityData[t][columnIdx] = [];
              }

              newQualityData[t][columnIdx][qfIdx] = d;
            });
          });
        });
      });
    });
    /**
       Apply generated values and return the result
    */

    var outData = {
      data: newData,
      qualityData: newQualityData,
      monthOffsets: newMonthOffsets,
      timestampMap: newTimestampMap,
      series: newSeries,
      labels: newLabels,
      qualityLabels: newQualityLabels
    };
    return outData;
  });
}