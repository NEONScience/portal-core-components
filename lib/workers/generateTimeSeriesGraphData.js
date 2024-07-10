"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateTimeSeriesGraphData;
exports.getTestableItems = void 0;
exports.getTimeSteps = getTimeSteps;
var _paralleljs = _interopRequireDefault(require("../vendor/paralleljs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
  const split = month.split('-');
  return {
    y: parseInt(split[0], 10),
    m: parseInt(split[1], 10)
  };
}
function monthIsValid(month) {
  if (!monthIsValidFormat(month)) {
    return false;
  }
  const {
    y,
    m
  } = monthToNumbers(month);
  return y !== null && m !== null && y >= 2000 && m >= 1 && m <= 12;
}
function monthToTicker(month) {
  if (!monthIsValid(month)) {
    return 0;
  }
  const {
    y,
    m
  } = monthToNumbers(month);
  return Date.UTC(y, m - 1, 1, 0, 0, 0);
}
function tickerIsValid(ticker) {
  return typeof ticker === 'number' && !Number.isNaN(ticker) && ticker > 0;
}
function tickerToMonth(ticker) {
  if (!tickerIsValid(ticker)) {
    return null;
  }
  const d = new Date(ticker);
  const YYYY = d.getUTCFullYear().toString();
  const MM = (d.getUTCMonth() + 1).toString().padStart(2, '0');
  return "".concat(YYYY, "-").concat(MM);
}
function tickerToIso(ticker) {
  let includeSeconds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  if (!tickerIsValid(ticker)) {
    return null;
  }
  const d = new Date(ticker);
  const YYYY = d.getUTCFullYear().toString();
  const MM = (d.getUTCMonth() + 1).toString().padStart(2, '0');
  const DD = d.getUTCDate().toString().padStart(2, '0');
  const hh = d.getUTCHours().toString().padStart(2, '0');
  const mm = d.getUTCMinutes().toString().padStart(2, '0');
  const ss = d.getUTCSeconds().toString().padStart(2, '0');
  return includeSeconds ? "".concat(YYYY, "-").concat(MM, "-").concat(DD, "T").concat(hh, ":").concat(mm, ":").concat(ss, "Z") : "".concat(YYYY, "-").concat(MM, "-").concat(DD, "T").concat(hh, ":").concat(mm, "Z");
}
function dateTimeToFloorSeconds(dt) {
  if (typeof dt === 'undefined' || dt === null) {
    return null;
  }
  const d = new Date(dt);
  const YYYY = d.getUTCFullYear().toString();
  const MM = (d.getUTCMonth() + 1).toString().padStart(2, '0');
  const DD = d.getUTCDate().toString().padStart(2, '0');
  const hh = d.getUTCHours().toString().padStart(2, '0');
  const mm = d.getUTCMinutes().toString().padStart(2, '0');
  return "".concat(YYYY, "-").concat(MM, "-").concat(DD, "T").concat(hh, ":").concat(mm, ":00Z");
}
function getNextMonth(month) {
  if (!monthIsValid(month)) {
    return null;
  }
  let {
    y,
    m
  } = monthToNumbers(month);
  m += 1;
  if (m === 13) {
    m = 1;
    y += 1;
  }
  return "".concat(y.toString(), "-").concat(m.toString().padStart(2, '0'));
}

// Additional items exported for unit testing
const getTestableItems = () => process.env.NODE_ENV !== 'test' ? {} : {
  monthIsValidFormat,
  monthToNumbers,
  monthIsValid,
  monthToTicker,
  tickerIsValid,
  tickerToMonth,
  tickerToIso,
  getNextMonth
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
  let payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const worker = new _paralleljs.default(payload).require(getTimeSteps).require(monthIsValidFormat).require(monthToNumbers).require(monthIsValid).require(monthToTicker).require(tickerIsValid).require(tickerToMonth).require(tickerToIso).require(dateTimeToFloorSeconds).require(getNextMonth);
  return worker.spawn(inData => {
    /**
       Deconstruct necessary values from state
    */
    const {
      product,
      variables: stateVariables,
      selection: {
        autoTimeStep,
        continuousDateRange,
        dateRange,
        dateTimeVariable,
        qualityFlags,
        sites,
        derivedVariableTable,
        timeStep: selectedTimeStep,
        variables: selectedVariables
      }
    } = inData;
    // Optionally toggle to allow a purely positional mapping
    // of generated, contiguous timestamp values based on the
    // aggregation level, and the actual timestamps coming back in the
    // data. Setting this to true makes some inherent assumptions
    // about the data that are likely OK in most cases and will be
    // more efficient, but can produce incorrect results given irregular
    // timestamps in the data.
    // Turning this off will resolve to mapping the timestamps from the
    // data to the matching timestamp in the generated,
    // contiguous timestamp values.
    const ALLOW_POSITIONAL_TS_MAPPING = false;
    // Optionally toggle to allow truncating series values
    // in the case where there are more timestamp values than expected
    // based on the generated, contiguous timestamp values for the aggregation
    // level.
    const ALLOW_POSITIONAL_TS_TRUNCATION = false;
    const timeStep = selectedTimeStep === 'auto' ? autoTimeStep : selectedTimeStep;
    const getQFNullFill = () => (qualityFlags || []).map(() => null);
    const TIME_STEPS = getTimeSteps();

    // Function to match the searchTime in milliseconds since epoch,
    // against a timestamp in the dataset
    const findTimestampIdx = (data, searchTime, startIdx) => {
      const isodateS = tickerToIso(searchTime, true);
      const isodateM = tickerToIso(searchTime, false);
      let dateIdx = -1;
      for (let i = startIdx; i < data.length; i += 1) {
        const dateTimeVal = data[i];
        const dateTimeValZeroS = dateTimeToFloorSeconds(dateTimeVal);
        const matched = dateTimeVal === isodateS || dateTimeValZeroS === isodateS || dateTimeVal === isodateM;
        if (matched) {
          dateIdx = i;
          break;
        }
      }
      return dateIdx;
    };

    /**
       Validate input (return unmodified state.graphData if anything fails)
    */
    const outSanityCheckData = {
      data: [[0, 0]],
      qualityData: [[0, 0]],
      monthOffsets: {},
      timestampMap: {},
      series: [],
      labels: ['x'],
      qualityLabels: ['start', 'end']
    };
    // Must have valid time step
    if (!TIME_STEPS[timeStep]) {
      return outSanityCheckData;
    }
    // Must have valid date range
    if (!Array.isArray(dateRange) || dateRange.length !== 2 || dateRange.some(month => !monthIsValid(month)) || dateRange[0] > dateRange[1]) {
      return outSanityCheckData;
    }
    // Must have valid continuous date range with same bounds as date range
    if (!Array.isArray(continuousDateRange) || continuousDateRange.length < 1 || continuousDateRange.some(month => !monthIsValid(month)) || dateRange[0] !== continuousDateRange[0] || dateRange[1] !== continuousDateRange[continuousDateRange.length - 1]) {
      return outSanityCheckData;
    }
    // Must have qualityFlags that's an array (can be empty) where all entries are valid variables
    if (!Array.isArray(qualityFlags) || qualityFlags.length && qualityFlags.some(qf => !stateVariables[qf])) {
      return outSanityCheckData;
    }
    // Must have a valid dateTimeVariable that's represented in stateVariables
    if (!dateTimeVariable || !stateVariables[dateTimeVariable]) {
      return outSanityCheckData;
    }
    // Must have at least one selected variable and all must be in stateVariables
    if (!Array.isArray(selectedVariables) || selectedVariables.some(v => !stateVariables[v])) {
      return outSanityCheckData;
    }
    // Must have a non-empty selected sites array with at least one with proper structure
    if (!Array.isArray(sites) || !sites.length || sites.every(site => !site.siteCode || !Array.isArray(site.positions) || !site.positions.length)) {
      return outSanityCheckData;
    }
    // Requires product must be an object with a sites object
    if (typeof product !== 'object' || product === null || typeof product.sites !== 'object' || product.sites === null) {
      return outSanityCheckData;
    }
    // At least one selected site must have positions, and at least one site/position
    // combinations must be represented in the product with some data
    let productSitesAreValid = false;
    sites.forEach(site => {
      const {
        siteCode,
        positions
      } = site;
      if (typeof product.sites[siteCode] === 'object' && product.sites[siteCode] !== null && typeof product.sites[siteCode].positions === 'object' && product.sites[siteCode].positions !== null) {
        // Ensure at least one selected position has data to display
        let foundValidPositionData = false;
        positions.forEach(position => {
          const invalidPositionData = typeof product.sites[siteCode].positions[position] !== 'object' || product.sites[siteCode].positions[position] === null || typeof product.sites[siteCode].positions[position].data !== 'object' || product.sites[siteCode].positions[position].data === null || Object.keys(product.sites[siteCode].positions[position].data).length < 1;
          if (!invalidPositionData) {
            foundValidPositionData = true;
          }
        });
        if (foundValidPositionData) {
          productSitesAreValid = true;
        }
      }
    });
    if (!productSitesAreValid) {
      return outSanityCheckData;
    }

    /**
       Initialize data set with timestep-based times and monthOffsets for registering actual data
    */
    // Reinitialize
    const newData = [];
    const newQualityData = [];
    const newMonthOffsets = {};
    const newTimestampMap = {};

    // Tick through date range one time step at a time to build data / qualityData / timeStampMap
    const {
      seconds
    } = TIME_STEPS[timeStep];
    let ticker = monthToTicker(dateRange[0]);
    const endMonth = getNextMonth(dateRange[1]);
    let currentMonth = tickerToMonth(ticker);
    let previousMonth = null;
    let offset = null;
    let endStep = null;
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
    const derivedVariableTables = [];
    Object.keys(derivedVariableTable).forEach(k => {
      const v = derivedVariableTable[k];
      if (!derivedVariableTables.includes(v)) {
        derivedVariableTables.push(v);
      }
    });

    /**
       Build the rest of the data structure and labels using selection values
    */
    // Reinitialize
    const newSeries = [];
    const newLabels = ['x'];
    const newQualityLabels = ['start', 'end'];
    // Loop through each site
    sites.forEach(site => {
      const {
        siteCode,
        positions
      } = site;
      // Loop through each site position
      positions.forEach(position => {
        // Generate quality flag label and add to the list of quality labels
        const qualityLabel = "".concat(siteCode, " - ").concat(position);
        if (qualityFlags.length && !newQualityLabels.includes(qualityLabel)) {
          newQualityLabels.push(qualityLabel);
        }

        // For each site position loop through every month in the continuous date range (no gaps)
        continuousDateRange.forEach(month => {
          // Use monthOffsets to determine where in the entire data set this month belongs
          if (!Object.keys(newMonthOffsets).includes(month)) {
            return;
          }
          const monthIdx = newMonthOffsets[month];
          const nextMonth = getNextMonth(month);
          const monthStepCount = Object.keys(newMonthOffsets).includes(nextMonth) ? newMonthOffsets[nextMonth] - monthIdx : newData.length - monthIdx;

          // For each site/position/month loop through all selected variables
          selectedVariables.forEach(variable => {
            // Generate series label and add to the list of labels if this is the first we see it
            const label = "".concat(siteCode, " - ").concat(position, " - ").concat(variable);
            if (!newLabels.includes(label)) {
              newLabels.push(label);
              newSeries.push({
                siteCode,
                position,
                variable,
                label,
                units: stateVariables[variable].units
              });
            }
            const columnIdx = newLabels.indexOf(label);
            if (!columnIdx) {
              return;
            } // 0 is x, so this should always be 1 or greater
            const {
              downloadPkg: pkg
            } = stateVariables[variable];
            const derivedTableName = derivedVariableTable[variable];
            const posData = product.sites[siteCode].positions[position].data;
            // Null-fill if this site/position/month/variable has
            // neither series data nor dateTime data
            if (!posData[month] || !posData[month][pkg] || !posData[month][pkg][timeStep] || !posData[month][pkg][timeStep][derivedTableName] || !posData[month][pkg][timeStep][derivedTableName].series[variable] || !posData[month][pkg][timeStep][derivedTableName].series[dateTimeVariable]) {
              for (let t = monthIdx; t < monthIdx + monthStepCount; t += 1) {
                newData[t][columnIdx] = null;
              }
              return;
            }
            // This site/position/month/variable series exists, so add it into the data set
            // eslint-disable-next-line max-len
            const seriesStepCount = posData[month][pkg][timeStep][derivedTableName].series[variable].data.length;
            // Series and month data lengths are identical (as expected):
            // Stream values directly in without matching timestamps
            if (ALLOW_POSITIONAL_TS_MAPPING) {
              if (seriesStepCount === monthStepCount) {
                posData[month][pkg][timeStep][derivedTableName].series[variable].data.forEach((d, datumIdx) => {
                  newData[datumIdx + monthIdx][columnIdx] = d;
                });
                return;
              }
            }
            // More series data than month data:
            // Stream values directly in without matching timestamps, truncate data so as not to
            // exceed month step count
            if (ALLOW_POSITIONAL_TS_TRUNCATION) {
              if (seriesStepCount >= monthStepCount) {
                posData[month][pkg][timeStep][derivedTableName].series[variable].data.forEach((d, datumIdx) => {
                  if (datumIdx >= monthStepCount) {
                    return;
                  }
                  newData[datumIdx + monthIdx][columnIdx] = d;
                });
                return;
              }
            }
            // The series data length does not match the expected month length so
            // loop through by month steps pulling in series values through timestamp matching
            // Add what data we have by going through each time step in the month and comparing to
            // start dates in the data set, null-filling any steps without a corresponding datum
            // Note that sometimes dates come back with seconds and sometimes without, so for
            // matching we look for either.
            // This assumes a chronological ordering of timestamps in both
            // the input series data and generated month ticker timestamps.
            // Therefore, if we find a matching timestamp value, we can assume
            // that the next value won't be found before the last found index in the series data,
            // allowing us to optimize the search in this scenario.
            let lastIdx = 0;
            // eslint-disable-next-line max-len
            const dtVarData = posData[month][pkg][timeStep][derivedTableName].series[dateTimeVariable].data;
            for (let t = monthIdx; t < monthIdx + monthStepCount; t += 1) {
              const dataIdx = findTimestampIdx(dtVarData, newData[t][0].getTime(), lastIdx);
              if (dataIdx === -1) {
                newData[t][columnIdx] = null;
              } else {
                lastIdx = dataIdx + 1;
                newData[t][columnIdx] = posData[month][pkg][timeStep][derivedTableName].series[variable].data[dataIdx];
              }
            }
          });

          // Also for each site/position/month loop through all selected quality flags
          qualityFlags.forEach((qf, qfIdx) => {
            const columnIdx = newQualityLabels.indexOf(qualityLabel);
            if (columnIdx < 2) {
              return;
            } // 0 is start and 1 is end
            const {
              downloadPkg: pkg,
              tables: qfTables
            } = stateVariables[qf];
            const derivedTableName = !qfTables ? null : Array.from(qfTables).find(qfTable => derivedVariableTables.includes(qfTable));
            const posData = product.sites[siteCode].positions[position].data;
            // If this site/position/month/variable has no series data then fill with nulls
            if (!posData[month] || !posData[month][pkg] || !posData[month][pkg][timeStep] || !posData[month][pkg][timeStep][derivedTableName] || !posData[month][pkg][timeStep][derivedTableName].series[qf]) {
              for (let t = monthIdx; t < monthIdx + monthStepCount; t += 1) {
                newQualityData[t][columnIdx] = getQFNullFill();
              }
              return;
            }
            // This site/position/month/qf series exists, so add it into the quality data set
            // eslint-disable-next-line max-len
            const seriesStepCount = posData[month][pkg][timeStep][derivedTableName].series[qf].data.length;
            // Series and month data lengths are identical as expected so we can stream
            // values directly in without matching timestamps
            if (ALLOW_POSITIONAL_TS_MAPPING) {
              if (seriesStepCount === monthStepCount) {
                posData[month][pkg][timeStep][derivedTableName].series[qf].data.forEach((d, datumIdx) => {
                  const t = datumIdx + monthIdx;
                  if (!Array.isArray(newQualityData[t][columnIdx])) {
                    newQualityData[t][columnIdx] = [];
                  }
                  newQualityData[t][columnIdx][qfIdx] = d;
                });
                return;
              }
            }
            // More series data than month data:
            // Stream values directly in without matching timestamps, truncate data so as not to
            // exceed month step count
            if (ALLOW_POSITIONAL_TS_TRUNCATION) {
              if (seriesStepCount > monthStepCount) {
                posData[month][pkg][timeStep][derivedTableName].series[qf].data.forEach((d, datumIdx) => {
                  if (datumIdx >= monthStepCount) {
                    return;
                  }
                  const t = datumIdx + monthIdx;
                  if (!Array.isArray(newQualityData[t][columnIdx])) {
                    newQualityData[t][columnIdx] = [];
                  }
                  newQualityData[t][columnIdx][qfIdx] = d;
                });
                return;
              }
            }
            // The series data length does not match the expected month length so
            // loop through by month steps pulling in series values through timestamp matching
            // This assumes a chronological ordering of timestamps in both
            // the input series data and generated month ticker timestamps.
            // Therefore, if we find a matching timestamp value, we can assume
            // that the next value won't be found before the last found index in the series data,
            // allowing us to optimize the search in this scenario.
            let lastIdx = 0;
            // eslint-disable-next-line max-len
            const dtVarData = posData[month][pkg][timeStep][derivedTableName].series[dateTimeVariable].data;
            for (let t = monthIdx; t < monthIdx + monthStepCount; t += 1) {
              const dataIdx = findTimestampIdx(dtVarData, newQualityData[t][0].getTime(), lastIdx);
              if (dataIdx === -1) {
                newQualityData[t][columnIdx] = getQFNullFill();
              } else {
                lastIdx = dataIdx + 1;
                const d = typeof posData[month][pkg][timeStep][derivedTableName].series[qf].data[dataIdx] !== 'undefined' ? posData[month][pkg][timeStep][derivedTableName].series[qf].data[dataIdx] : null;
                if (!Array.isArray(newQualityData[t][columnIdx])) {
                  newQualityData[t][columnIdx] = [];
                }
                newQualityData[t][columnIdx][qfIdx] = d;
              }
            }
          });
        });
      });
    });

    /**
       Apply generated values and return the result
    */
    const outData = {
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