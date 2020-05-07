import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import get from 'lodash/get';
import uniqueId from 'lodash/uniqueId';
import cloneDeep from 'lodash/cloneDeep';

import { parse } from 'papaparse';

import { of, merge } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  map,
  tap,
  mergeMap,
  catchError,
  ignoreElements,
} from 'rxjs/operators';

import NeonApi from '../NeonApi/NeonApi';
import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import { forkJoinWithProgress } from '../../util/rxUtil';

// 'get' is a reserved word so can't be imported with import
const lodashGet = require('lodash/get.js');

// Every possible status a single fetch request can have
const FETCH_STATUS = {
  AWAITING_CALL: 'AWAITING_CALL',
  FETCHING: 'FETCHING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
};

// Every possible top-level status the TimeSeriesViewer component can have
export const TIME_SERIES_VIEWER_STATUS = {
  INIT_PRODUCT: 'INIT_PRODUCT', // Handling props; fetching product data if needed
  LOADING_META: 'LOADING_META', // Actively loading meta data (sites, variables, and positions)
  READY_FOR_DATA: 'READY_FOR_DATA', // Ready to trigger fetches for data
  LOADING_DATA: 'LOADING_DATA', // Actively loading plottable series data
  ERROR: 'ERROR', // Stop everything because problem
  READY: 'READY', // Ready for user input
};

export const TIME_SERIES_VIEWER_STATUS_TITLES = {
  INIT_PRODUCT: 'Loading data product…',
  LOADING_META: 'Loading site positions, variables, and data paths…',
  READY_FOR_DATA: 'Loading series data…',
  LOADING_DATA: 'Loading series data…',
  ERROR: null,
  READY: null,
};

// Keys, details, and supporting functions for all possible Y-axis range modes
export const Y_AXIS_RANGE_MODES = {
  FROM_ZERO: 'FROM_ZERO',
  CENTERED: 'CENTERED',
  CUSTOM: 'CUSTOM',
};
export const Y_AXIS_RANGE_MODE_DETAILS = {
  FROM_ZERO: {
    name: 'From Zero',
    description: 'Range from zero to one standard deviation above data',
  },
  CENTERED: {
    name: 'Centered',
    description: 'Center data by one standard deviation above and below',
  },
  CUSTOM: {
    name: 'Custom',
    description: 'Manually define a minimum and maximum axis range',
  },
};
const generateYAxisRange = (axis = {}) => {
  const {
    rangeMode,
    dataRange = [0, 0],
    standardDeviation = 0,
    precision = 0,
    axisRange,
  } = axis;
  if (
    !Object.keys(Y_AXIS_RANGE_MODES).includes(rangeMode)
      || !Number.isFinite(standardDeviation)
      || !Number.isFinite(precision)) { return axisRange; }
  const low = Math.max((dataRange[0] || 0) - standardDeviation, 0);
  const high = (dataRange[1] || 0) + standardDeviation;
  if (rangeMode === Y_AXIS_RANGE_MODES.FROM_ZERO) { return [0, high]; }
  if (rangeMode === Y_AXIS_RANGE_MODES.CENTERED) { return [low, high]; }
  return axisRange;
};

// Functions to convert a value to the proper JS data type given a NEON variable dataType
const castFloat = (v) => {
  const cast = parseFloat(v, 10);
  return Number.isNaN(cast) ? null : cast;
};
const castInt = (v) => {
  const cast = parseInt(v, 10);
  return Number.isNaN(cast) ? null : cast;
};
const DATA_TYPE_SETTERS = {
  dateTime: v => ((typeof v === 'string') ? v.replace(/"/g, '') : v),
  real: castFloat,
  'signed integer': castInt,
  'unsigned integer': castInt,
};

// PropTypes for any Tab Component (or component within a tab) for gettingsetSelectedTab
// and TAB_IDS as props. This is used by anything in a tab wanting to afford the ability to
// route the user to another tab.
export const TabComponentPropTypes = {
  setSelectedTab: PropTypes.func.isRequired,
  TAB_IDS: PropTypes.objectOf(PropTypes.string).isRequired,
};

/**
   Context and Hook Setup
*/
const DEFAULT_AXIS_STATE = {
  units: null,
  logscale: false,
  dataRange: [null, null],
  precision: 0,
  standardDeviation: 0,
  rangeMode: Y_AXIS_RANGE_MODES.FROM_ZERO,
  axisRange: [0, 0],
};
const DEFAULT_STATE = {
  status: TIME_SERIES_VIEWER_STATUS.INIT_PRODUCT,
  displayError: null,
  fetchProduct: { status: FETCH_STATUS.AWAITING_CALL, error: null },
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
    sites: {},
  },
  selection: {
    dateRange: [null, null],
    continuousDateRange: [],
    variables: [],
    dateTimeVariable: null,
    sites: [],
    timeStep: 'auto', // The visible selected timeStep, as per what's available, or 'auto'
    autoTimeStep: null, // The functional timeStep if the selection is 'auto'
    qualityFlags: [],
    rollPeriod: 1,
    logscale: false, // Per-axis logscale is not supported in dygraphs. It's stubbed here in state.
    yAxes: {
      y1: cloneDeep(DEFAULT_AXIS_STATE),
      y2: cloneDeep(DEFAULT_AXIS_STATE),
    },
  },
  availableQualityFlags: new Set(),
  availableTimeSteps: new Set(['auto']),
};
const Context = createContext(DEFAULT_STATE);
const useTimeSeriesViewerState = () => {
  const hookResponse = useContext(Context);
  if (hookResponse.length !== 2) {
    return [cloneDeep(DEFAULT_STATE), () => {}];
  }
  return hookResponse;
};


/**
   Time Step Definitions and Functions
*/
export const TIME_STEPS = {
  '1min': { key: '1min', tmi: '001', seconds: 60 },
  '2min': { key: '2min', tmi: '002', seconds: 120 },
  '5min': { key: '5min', tmi: '005', seconds: 300 },
  '15min': { key: '15min', tmi: '015', seconds: 900 },
  '30min': { key: '30min', tmi: '030', seconds: 1800 },
  '60min': { key: '1hr', tmi: '060', seconds: 1800 },
  '0AQ': { key: '0AQ', tmi: '100', seconds: 60 },
  '1day': { key: '1day', tmi: '01D', seconds: 86400 },
};
const getTimeStep = input => (
  Object.keys(TIME_STEPS).find(key => TIME_STEPS[key].tmi === input) || null
);
export const summarizeTimeSteps = (steps, timeStep = null, pluralize = true) => {
  if (steps === 1) { return 'none'; }
  const timeStepSeconds = timeStep && TIME_STEPS[timeStep] ? TIME_STEPS[timeStep].seconds : 1800;
  const seconds = steps * timeStepSeconds;
  const breaks = [3600, 86400, 2592000, 31536000];
  const intervals = ['hour', 'day', 'month', 'year'];
  const breakIdx = breaks.reduce((acc, cur, idx) => ((seconds > cur) ? idx : acc), 0);
  let value = (seconds / breaks[breakIdx]).toFixed(1);
  if (value.slice(value.length - 1) === '0') { value = value.slice(0, value.length - 2); }
  let plural = '';
  if (pluralize) { plural = value === '1' ? '' : 's'; }
  return `${value} ${intervals[breakIdx]}${plural}`;
};

// Array offsets and validators for use when splitting a data file URL
const DATA_FILE_PARTS = {
  POSITION_H: {
    offset: 6,
    isValid: p => /^[\d]{3}$/.test(p),
  },
  POSITION_V: {
    offset: 7,
    isValid: p => /^[\d]{3}$/.test(p),
  },
  TIME_STEP: {
    offset: 8,
    isValid: p => Object.keys(TIME_STEPS).some(t => TIME_STEPS[t].tmi === p),
  },
  MONTH: {
    offset: 10,
    isValid: p => /^[\d]{4}-[\d]{2}$/.test(p),
  },
  PACKAGE_TYPE: {
    offset: 11,
    isValid: p => ['basic', 'expanded'].includes(p),
  },
  EXTENSION: {
    offset: 13,
    isValid: p => p === 'csv',
  },
};

/**
   CSV Fetch/Parse Functions
*/
// const siteMonthCancelation$ = new Subject();
const fetchCSV = url => ajax({
  method: 'GET',
  crossDomain: true,
  responseType: 'text',
  url,
});
const parseCSV = (rawCsv, dedupeLines = false) => {
  const csv = !dedupeLines ? rawCsv : [...new Set(rawCsv.split('\n'))].join('\n');
  return parse(csv, {
    header: true,
    skipEmptyLines: 'greedy',
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
const getUpdatedValueRange = (existingRange, newValue) => {
  const arrayVal = Array.isArray(newValue) ? newValue : [newValue];
  if (arrayVal.some(v => typeof v !== 'number')) { return existingRange; }
  const newRange = [...existingRange];
  arrayVal.forEach((v) => {
    if (newRange[0] === null || newRange[0] > v) { newRange[0] = v; }
    if (newRange[1] === null || newRange[1] < v) { newRange[1] = v; }
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
const getContinuousDatesArray = (dateRange, roundToYears = false) => {
  const dateRegex = /^\d{4}-\d{2}$/;
  if (!Array.isArray(dateRange) || dateRange.length !== 2 || dateRange[1] < dateRange[0]
      || !dateRegex.test(dateRange[0]) || !dateRegex.test(dateRange[1])) {
    return [];
  }
  if (dateRange.length === 2 && dateRange[0] === dateRange[1]) { return [dateRange[0]]; }
  let startMoment = moment(`${dateRange[0]}-20`);
  let endMoment = moment(`${dateRange[1]}-10`).add(1, 'months');
  if (roundToYears) {
    startMoment = moment(`${dateRange[0]}-20`).startOf('year');
    endMoment = moment(`${dateRange[1]}-10`).endOf('year').add(1, 'months');
  }
  const continuousRange = [];
  let months = 0;
  const MAX_MONTHS = 960; // If we're going more than 80 years then maybe something is wrong?
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
const parseProductData = (productData = {}) => {
  const product = {
    productCode: productData.productCode,
    productName: productData.productName,
    productDescription: productData.productDescription,
    productSensor: productData.productSensor,
    dateRange: [null, null],
    variables: {},
    sites: {},
  };
  product.dateRange = (productData.siteCodes || []).reduce((acc, site) => {
    if (!Array.isArray(site.availableMonths) || !site.availableMonths.length) { return acc; }
    product.sites[site.siteCode] = {
      fetches: {
        siteMonths: {},
        positions: { status: FETCH_STATUS.AWAITING_CALL, error: null, url: null },
        variables: { status: FETCH_STATUS.AWAITING_CALL, error: null, url: null },
      },
      availableMonths: site.availableMonths,
      variables: new Set(),
      positions: {},
    };
    const start = site.availableMonths[0];
    const end = site.availableMonths[site.availableMonths.length - 1];
    return [
      acc[0] === null || acc[0] > start ? start : acc[0],
      acc[1] === null || acc[1] < end ? end : acc[1],
    ];
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
const parseSiteMonthData = (site, files) => {
  const newSite = { ...site };
  const availableTimeSteps = new Set();
  files.forEach((file) => {
    const { name, url } = file;
    // Must be a CSV file
    if (!/\.csv$/.test(name)) { return; }
    // Must not be a variables or positions file
    if (name.includes('variables') && !newSite.fetches.variables.url) {
      newSite.fetches.variables.url = url;
      return;
    }
    if (name.includes('sensor_positions') && !newSite.fetches.positions.url) {
      newSite.fetches.positions.url = url;
      return;
    }
    // Split file name by (.); all DATA_FILE_PARTS validators must point to a valid part
    const parts = name.split('.');
    if (Object.keys(DATA_FILE_PARTS).some((part) => {
      const { offset, isValid } = DATA_FILE_PARTS[part];
      return !isValid(parts[offset]);
    })) { return; }
    // Extract parts
    const position = `${parts[DATA_FILE_PARTS.POSITION_H.offset]}.${parts[DATA_FILE_PARTS.POSITION_V.offset]}`;
    const month = parts[DATA_FILE_PARTS.MONTH.offset];
    const packageType = parts[DATA_FILE_PARTS.PACKAGE_TYPE.offset];
    const timeStep = getTimeStep(parts[DATA_FILE_PARTS.TIME_STEP.offset]);
    // Timestep must be valid
    if (timeStep === null) { return; }
    // All is good, add the timestep and add file information to the site object
    availableTimeSteps.add(timeStep);
    if (!newSite.positions[position]) { newSite.positions[position] = { data: {}, history: [] }; }
    if (!newSite.positions[position].data[month]) { newSite.positions[position].data[month] = {}; }
    if (!newSite.positions[position].data[month][packageType]) {
      newSite.positions[position].data[month][packageType] = {};
    }
    newSite.positions[position].data[month][packageType][timeStep] = {
      url,
      status: FETCH_STATUS.AWAITING_CALL,
      error: null,
      series: {},
    };
  });
  return { siteObject: newSite, availableTimeSteps };
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
const parseSiteVariables = (previousVariables, siteCode, csv) => {
  const newStateVariables = { ...previousVariables };
  const variables = parseCSV(csv);
  const variablesSet = new Set();
  variables.data.forEach((variable) => {
    const {
      dataType,
      description,
      downloadPkg,
      fieldName,
      table,
      units,
    } = variable;
    const timeStep = getTimeStep(table);
    const isSelectable = variable.dataType !== 'dateTime'
      && variable.units !== 'NA'
      && !/QF$/.test(fieldName);
    const canBeDefault = isSelectable
      && variable.downloadPkg !== 'expanded'
      && !/QM$/.test(fieldName);
    variablesSet.add(fieldName);
    if (!newStateVariables[fieldName]) {
      newStateVariables[fieldName] = {
        dataType,
        description,
        downloadPkg,
        units,
        timeSteps: new Set(),
        sites: new Set(),
        isSelectable,
        canBeDefault,
        isDateTime: variable.dataType === 'dateTime',
      };
    }
    newStateVariables[fieldName].timeSteps.add(timeStep);
    newStateVariables[fieldName].sites.add(siteCode);
  });
  return { variablesSet, variablesObject: newStateVariables };
};

/**
 * Build an object for state.product.sites[{site}] from a product/site positions fetch response
 * The site object should already have site position ids from the product/site/month fetch, so the
 * main goal here is to fill in all the other position metadata that comes from the positions fetch
 * @param {Object} site - single site object from previous state.product.sites
 * @param {string} csv - unparsed CSV string from a product/site positions fetch response
 * @return {Object} updated site object to be applied at state.product.sites[{site}]
 */
const parseSitePositions = (site, csv) => {
  const newSite = { ...site };
  const positions = parseCSV(csv, true); // Duplicated lines have been unintentionally seen here!
  positions.data.forEach((position) => {
    const posId = position['HOR.VER'];
    if (!newSite.positions[posId]) { newSite.positions[posId] = { data: {}, history: [] }; }
    newSite.positions[posId].history.push(position);
  });
  // Sort position history by start/end time descending
  Object.keys(newSite.positions).forEach((posId) => {
    newSite.positions[posId].history.sort((a, b) => {
      if (!a.end) { return 1; }
      return (a.end < b.start) ? -1 : 1;
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
const parseSeriesData = (csv, variables) => {
  const series = {};
  const fields = [];
  const rows = csv.split('\n');
  if (!rows.length) { return series; }
  // Our variables list is from the most recent month. Sometimes older months have variables that
  // are no longer around. Ultimately it would be best to proactively pull and display these, but
  // for now we ignore any series that we don't already have variable info on.
  const skipIndexes = [];
  rows[0].split(',').forEach((fieldName, idx) => {
    if (!variables[fieldName]) {
      skipIndexes.push(idx);
      return;
    }
    const { dataType } = variables[fieldName];
    const field = {
      fieldName,
      setType: DATA_TYPE_SETTERS[dataType] ? DATA_TYPE_SETTERS[dataType] : v => v,
    };
    fields.push(field);
    series[fieldName] = {
      data: [],
      range: [null, null],
      sum: 0,
      count: 0,
      variance: 0,
    };
  });
  rows.slice(1).forEach((row) => {
    if (!row.length) { return; }
    const values = row.split(',');
    values
      .filter((value, idx) => !skipIndexes.includes(idx))
      .forEach((value, idx) => {
        const typedValue = fields[idx].setType(value);
        series[fields[idx].fieldName].data.push(typedValue);
        // Don't bother updating the range for non-numerical series and quality flags
        if (typeof typedValue === 'number' && !/QF$/.test(fields[idx].fieldName)) {
          series[fields[idx].fieldName].range = getUpdatedValueRange(
            series[fields[idx].fieldName].range,
            typedValue,
          );
          series[fields[idx].fieldName].sum += typedValue;
          series[fields[idx].fieldName].count += 1;
        }
      });
  });
  // Loop across all numeric non-quality-flag series again to calculate series variance
  Object.keys(series)
    .filter(fieldName => !/QF$/.test(fieldName) && series[fieldName].count > 0)
    .forEach((fieldName) => {
      const { dataType } = variables[fieldName];
      const setType = DATA_TYPE_SETTERS[dataType] ? DATA_TYPE_SETTERS[dataType] : v => v;
      if (!['real', 'signed integer', 'unsigned integer'].includes(dataType)) { return; }
      const mean = series[fieldName].sum / series[fieldName].count;
      let sumOfSquares = 0;
      series[fieldName].data.forEach((value) => {
        if (value === null) { return; }
        const typedValue = setType(value);
        sumOfSquares += (typedValue - mean) ** 2;
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
const applyDefaultsToSelection = (state) => {
  const {
    product,
    variables,
    selection,
  } = state;
  if (!Object.keys(product.sites).length) { return selection; }
  // Sites - Ensure the selection has at least one site (default to first in list)
  if (!selection.sites.length) {
    const siteCodes = Object.keys(product.sites);
    siteCodes.sort();
    selection.sites.push({ siteCode: siteCodes[0], positions: [] });
  }
  // Date Range - Ensure the selection has a date range (default to latest month)
  if (selection.dateRange[0] === null || selection.dateRange[1] === null) {
    const { availableMonths } = product.sites[selection.sites[0].siteCode];
    const initialMonth = availableMonths[availableMonths.length - 1];
    selection.dateRange = [initialMonth, initialMonth];
  }
  // Positions - Ensure every selected site has at least one selected position
  selection.sites.forEach((site, idx) => {
    if (site.positions.length > 0) { return; }
    const { siteCode } = site;
    const positions = Object.keys(state.product.sites[siteCode].positions);
    if (!positions.length) { return; }
    positions.sort();
    selection.sites[idx].positions.push(positions[0]);
  });
  // Variables
  if (Object.keys(variables).length) {
    // Ensure the selection has at least one variable
    if (!selection.variables.length) {
      const defaultVar = Object.keys(variables).find(v => variables[v].canBeDefault);
      if (defaultVar) {
        selection.variables.push(defaultVar);
        selection.yAxes.y1.units = variables[defaultVar].units;
      }
    }
    // Ensure the selection has at least one dateTime variable
    if (!selection.dateTimeVariable) {
      const defaultDateTimeVar = Object.keys(variables).find(v => variables[v].isDateTime);
      if (defaultDateTimeVar) {
        selection.dateTimeVariable = defaultDateTimeVar;
      }
    }
  }
  // Generate a new continuous date range from the dateRange (which only contains bounds)
  selection.continuousDateRange = getContinuousDatesArray(selection.dateRange);
  // Generate new cumulative data ranges and standard deviations for all applicable y axes.
  const { timeStep, autoTimeStep } = selection;
  const dataTimeStep = timeStep === 'auto' ? autoTimeStep : timeStep;
  Object.keys(selection.yAxes).forEach((yAxis) => {
    if (selection.yAxes[yAxis].units === null) { return; }
    let combinedSum = 0;
    let combinedCount = 0;
    const monthCounts = [];
    const monthMeans = [];
    const monthVariances = [];
    selection.yAxes[yAxis].dataRange = [null, null];
    selection.yAxes[yAxis].standardDeviation = 0;
    selection.variables.filter(variable => (
      variables[variable].units === selection.yAxes[yAxis].units
    )).forEach((variable) => {
      const { downloadPkg: pkg } = variables[variable];
      selection.sites.forEach((site) => {
        const { siteCode, positions } = site;
        positions.forEach((position) => {
          selection.continuousDateRange.forEach((month) => {
            const series = lodashGet(
              product.sites[siteCode].positions[position],
              `data['${month}']['${pkg}']['${dataTimeStep}'].series['${variable}']`,
            );
            if (!series || !series.count) { return; }
            combinedSum += series.sum;
            combinedCount += series.count;
            monthCounts.push(series.count);
            monthMeans.push(series.sum / series.count);
            monthVariances.push(series.variance);
            selection.yAxes[yAxis].dataRange = getUpdatedValueRange(
              selection.yAxes[yAxis].dataRange, series.range,
            );
          });
        });
      });
    });
    if (combinedCount > 0) {
      const dataRangeMax = selection.yAxes[yAxis].dataRange[1];
      const precision = Math.abs(Math.floor(Math.min(Math.log10(dataRangeMax), 0)))
        + (Math.log10(dataRangeMax) >= 2 ? 0 : 2);
      const combinedMean = combinedSum / combinedCount;
      const deviations = monthMeans.map(mean => mean - combinedMean);
      const standardDeviation = (
        monthVariances.reduce((sum, variance, idx) => (
          monthCounts[idx] * (variance + (deviations[idx] ** 2))
        ), 0) / combinedCount
      ) ** 0.5;
      const fixedStandardDeviation = parseFloat(standardDeviation.toFixed(precision), 10);
      selection.yAxes[yAxis].precision = precision;
      selection.yAxes[yAxis].standardDeviation = fixedStandardDeviation;
      selection.yAxes[yAxis].axisRange = generateYAxisRange(selection.yAxes[yAxis]);
    }
  });
  // Generate a new digest for effect comparison
  selection.digest = JSON.stringify({
    sites: selection.sites,
    dateRange: selection.dateRange,
    variables: selection.variables,
  });
  return selection;
};

/**
   Reducer
*/
const reducer = (state, action) => {
  let newState = { ...state };
  const calcSelection = () => {
    newState.selection = applyDefaultsToSelection(newState);
  };
  const calcStatus = () => {
    if (newState.status === TIME_SERIES_VIEWER_STATUS.ERROR) { return; }
    if (Object.keys(newState.metaFetches).length) {
      newState.status = TIME_SERIES_VIEWER_STATUS.LOADING_META;
    } else if (Object.keys(newState.dataFetches).length) {
      newState.status = TIME_SERIES_VIEWER_STATUS.LOADING_DATA;
    } else {
      newState.status = TIME_SERIES_VIEWER_STATUS.READY_FOR_DATA;
    }
  };
  const fail = (error) => {
    newState.status = TIME_SERIES_VIEWER_STATUS.ERROR;
    newState.displayError = error;
    return newState;
  };
  const limitVariablesToTwoUnits = (variables) => {
    const selectedUnits = variables.reduce((units, variable) => {
      units.add(state.variables[variable].units);
      return units;
    }, new Set());
    if (selectedUnits.size < 2) {
      return { selectedUnits: Array.from(selectedUnits), variables };
    }
    return {
      selectedUnits: Array.from(selectedUnits),
      variables: variables.filter(variable => selectedUnits.has(state.variables[variable].units)),
    };
  };
  const setDataFileFetchStatuses = (fetches) => {
    fetches.forEach((fetch) => {
      const {
        siteCode,
        position,
        month,
        downloadPkg,
        timeStep,
      } = fetch;
      newState.product
        .sites[siteCode]
        .positions[position]
        .data[month][downloadPkg][timeStep]
        .status = FETCH_STATUS.FETCHING;
    });
  };
  let parsedContent = null;
  let selectedSiteIdx = null;
  switch (action.type) {
    // Reinitialize
    case 'reinitialize':
      newState = cloneDeep(DEFAULT_STATE);
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
      newState.displayError = `Unable to load product: ${action.error}`;
      return newState;
    case 'initFetchProductSucceeded':
      newState.fetchProduct.status = FETCH_STATUS.SUCCESS;
      newState.product = parseProductData(action.productData);
      calcSelection();
      newState.status = TIME_SERIES_VIEWER_STATUS.LOADING_META;
      return newState;

    // Fetch Site Month Actions
    case 'fetchSiteMonth':
      newState.metaFetches[`fetchSiteMonth.${action.siteCode}.${action.month}`] = true;
      newState.product.sites[action.siteCode].fetches.siteMonths[action.month] = {
        status: FETCH_STATUS.FETCHING, error: null,
      };
      newState.status = TIME_SERIES_VIEWER_STATUS.LOADING_META;
      return newState;
    case 'fetchSiteMonthFailed':
      delete newState.metaFetches[`fetchSiteMonth.${action.siteCode}.${action.month}`];
      newState.product.sites[action.siteCode]
        .fetches.siteMonths[action.month].status = FETCH_STATUS.ERROR;
      newState.product.sites[action.siteCode]
        .fetches.siteMonths[action.month].error = action.error;
      calcStatus();
      return newState;
    case 'fetchSiteMonthSucceeded':
      delete newState.metaFetches[`fetchSiteMonth.${action.siteCode}.${action.month}`];
      newState.product.sites[action.siteCode]
        .fetches.siteMonths[action.month].status = FETCH_STATUS.SUCCESS;
      parsedContent = parseSiteMonthData(
        newState.product.sites[action.siteCode],
        action.files,
      );
      newState.product.sites[action.siteCode] = parsedContent.siteObject;
      newState.availableTimeSteps = new Set([
        ...state.availableTimeSteps,
        ...parsedContent.availableTimeSteps,
      ]);
      if (newState.availableTimeSteps.size === 1) { // Need more than just 'auto'
        return fail('This data product is not compatible with the Time Series Viewer (no valid time step found)');
      }
      if (state.selection.autoTimeStep === null) {
        newState.selection.autoTimeStep = Array.from(newState.availableTimeSteps)
          .reduce((acc, cur) => {
            if (cur === 'auto') { return acc; }
            return (acc === null || TIME_STEPS[cur].seconds > TIME_STEPS[acc].seconds) ? cur : acc;
          }, null);
      }
      calcSelection();
      if (
        newState.product.sites[action.siteCode].fetches.variables.status !== FETCH_STATUS.SUCCESS
          || newState.product.sites[action.siteCode].fetches.positions.status !== FETCH_STATUS.SUCCESS // eslint-disable-line max-len
      ) {
        newState.status = TIME_SERIES_VIEWER_STATUS.LOADING_META;
      } else { calcStatus(); }
      return newState;

    // Fetch Site Variables Actions
    case 'fetchSiteVariables':
      newState.metaFetches[`fetchSiteVariables.${action.siteCode}`] = true;
      newState.product.sites[action.siteCode].fetches.variables.status = FETCH_STATUS.FETCHING;
      calcStatus();
      return newState;
    case 'fetchSiteVariablesFailed':
      delete newState.metaFetches[`fetchSiteVariables.${action.siteCode}`];
      newState.product.sites[action.siteCode].fetches.variables.status = FETCH_STATUS.ERROR;
      newState.product.sites[action.siteCode].fetches.variables.error = action.error;
      calcStatus();
      return newState;
    case 'fetchSiteVariablesSucceeded':
      delete newState.metaFetches[`fetchSiteVariables.${action.siteCode}`];
      newState.product.sites[action.siteCode].fetches.variables.status = FETCH_STATUS.SUCCESS;
      parsedContent = parseSiteVariables(newState.variables, action.siteCode, action.csv);
      newState.variables = {
        ...state.variables,
        ...parsedContent.variablesObject,
      };
      newState.product.sites[action.siteCode].variables = new Set([
        ...state.product.sites[action.siteCode].variables,
        ...parsedContent.variablesSet,
      ]);
      newState.availableQualityFlags = new Set([
        ...state.availableQualityFlags,
        ...Object.keys(newState.variables).filter(v => /QF$/.test(v)),
      ]);
      // A valid dateTime variable must be present otherwise we have no x-axis
      if (Object.keys(newState.variables).every(v => !newState.variables[v].isDateTime)) {
        return fail('This data product is not compatible with the Time Series Viewer (no dateTime data found)');
      }
      calcSelection();
      calcStatus();
      return newState;

    // Fetch Site Positions Actions
    case 'fetchSitePositions':
      newState.metaFetches[`fetchSitePositions.${action.siteCode}`] = true;
      newState.product.sites[action.siteCode].fetches.positions.status = FETCH_STATUS.FETCHING;
      calcStatus();
      return newState;
    case 'fetchSitePositionsFailed':
      delete newState.metaFetches[`fetchSitePositions.${action.siteCode}`];
      newState.product.sites[action.siteCode].fetches.positions.status = FETCH_STATUS.ERROR;
      newState.product.sites[action.siteCode].fetches.positions.error = action.error;
      calcStatus();
      return newState;
    case 'fetchSitePositionsSucceeded':
      delete newState.metaFetches[`fetchSitePositions.${action.siteCode}`];
      newState.product.sites[action.siteCode].fetches.positions.status = FETCH_STATUS.SUCCESS;
      newState.product.sites[action.siteCode] = parseSitePositions(
        newState.product.sites[action.siteCode], action.csv,
      );
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
      newState.product
        .sites[action.siteCode]
        .positions[action.position]
        .data[action.month][action.downloadPkg][action.timeStep]
        .status = FETCH_STATUS.ERROR;
      newState.product
        .sites[action.siteCode]
        .positions[action.position]
        .data[action.month][action.downloadPkg][action.timeStep]
        .error = action.error;
      return newState;
    case 'fetchDataFileSucceeded':
      newState.product
        .sites[action.siteCode]
        .positions[action.position]
        .data[action.month][action.downloadPkg][action.timeStep]
        .status = FETCH_STATUS.SUCCESS;
      newState.product
        .sites[action.siteCode]
        .positions[action.position]
        .data[action.month][action.downloadPkg][action.timeStep]
        .series = parseSeriesData(action.csv, newState.variables);
      return newState;

    // Core Selection Actions
    case 'selectDateRange':
      newState.selection.dateRange = action.dateRange;
      newState.selection.activelySelectingDateRange = action.dateRange;
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
        newState.selection.yAxes.y2 = cloneDeep(DEFAULT_AXIS_STATE);
      } else {
        if (!newState.selection.yAxes.y1.units) {
          newState.selection.yAxes.y1 = cloneDeep(DEFAULT_AXIS_STATE);
          // eslint-disable-next-line prefer-destructuring
          newState.selection.yAxes.y1.units = parsedContent.selectedUnits[0];
        }
        if (!newState.selection.yAxes.y2.units) {
          newState.selection.yAxes.y2 = cloneDeep(DEFAULT_AXIS_STATE);
          // eslint-disable-next-line prefer-destructuring
          newState.selection.yAxes.y2.units = parsedContent.selectedUnits[1];
        }
      }
      calcSelection();
      calcStatus();
      return newState;

    case 'selectYAxisRangeMode':
      if (
        !state.selection.yAxes[action.axis]
          || !Object.keys(Y_AXIS_RANGE_MODES).includes(action.mode)
      ) { return state; }
      newState.selection.yAxes[action.axis].rangeMode = action.mode;
      if (action.mode !== Y_AXIS_RANGE_MODES.CUSTOM) {
        newState.selection.yAxes[action.axis].axisRange = generateYAxisRange(
          newState.selection.yAxes[action.axis],
        );
      }
      return newState;
    case 'selectYAxisCustomRange':
      if (!state.selection.yAxes[action.axis]) { return state; }
      if (!(
        Array.isArray(action.range) && action.range.length === 2
          && action.range.every(v => typeof v === 'number')
          && action.range[0] < action.range[1]
      )) { return state; }
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
      newState.selection.logscale = !!action.logscale;
      return newState;
    case 'selectSwapYAxes':
      if (state.selection.yAxes.y2.units === null) { return state; }
      parsedContent = {
        y1: cloneDeep(state.selection.yAxes.y2),
        y2: cloneDeep(state.selection.yAxes.y1),
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
        newState.selection.qualityFlags = newState.selection.qualityFlags
          .filter(v => v !== action.qualityFlag);
      }
      calcStatus();
      return newState;
    case 'selectTimeStep':
      if (!state.availableTimeSteps.has(action.timeStep)) { return state; }
      newState.selection.timeStep = action.timeStep;
      calcStatus();
      return newState;
    case 'selectAddSite':
      if (!state.product.sites[action.siteCode]) { return state; }
      if (state.selection.sites.some(site => site.siteCode === action.siteCode)) { return state; }
      newState.selection.sites.push({ siteCode: action.siteCode, positions: [] });
      calcSelection();
      calcStatus();
      return newState;
    case 'selectRemoveSite':
      if (state.selection.sites.length < 2) { return state; }
      if (!state.selection.sites.some(site => site.siteCode === action.siteCode)) { return state; }
      newState.selection.sites = newState.selection.sites
        .filter(site => site.siteCode !== action.siteCode);
      calcSelection();
      calcStatus();
      return newState;
    case 'selectSitePositions':
      selectedSiteIdx = state.selection.sites.findIndex(site => site.siteCode === action.siteCode);
      if (selectedSiteIdx === -1) { return state; }
      if (!state.product.sites[action.siteCode] || !action.positions.length) { return state; }
      if (!action.positions.every(p => (
        Object.keys(state.product.sites[action.siteCode].positions).includes(p)
      ))) { return state; }
      newState.selection.sites[selectedSiteIdx].positions = [...action.positions];
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
const Provider = (props) => {
  const {
    productCode: productCodeProp,
    productData: productDataProp,
    children,
  } = props;

  /**
     Initial State and Reducer Setup
  */
  const initialState = cloneDeep(DEFAULT_STATE);
  initialState.status = productDataProp
    ? TIME_SERIES_VIEWER_STATUS.LOADING_META
    : TIME_SERIES_VIEWER_STATUS.INIT_PRODUCT;
  if (productDataProp) {
    initialState.fetchProduct.status = FETCH_STATUS.SUCCESS;
    initialState.product = parseProductData(productDataProp);
  } else {
    initialState.product.productCode = productCodeProp;
  }
  initialState.selection = applyDefaultsToSelection(initialState);
  const [state, dispatch] = useReducer(reducer, initialState);

  /**
     Effect - Reinitialize state if the product code prop changed
  */
  useEffect(() => {
    if (productCodeProp !== state.product.productCode) {
      dispatch({ type: 'reinitialize', productCode: productCodeProp });
    }
  }, [productCodeProp, state.product.productCode, dispatch]);

  /**
     Effect - Fetch product data if only a product code was provided in props
  */
  useEffect(() => {
    if (state.status !== TIME_SERIES_VIEWER_STATUS.INIT_PRODUCT) { return; }
    if (state.fetchProduct.status !== FETCH_STATUS.AWAITING_CALL) { return; }
    dispatch({ type: 'initFetchProductCalled' });
    NeonGraphQL.getDataProductByCode(state.product.productCode).pipe(
      map((response) => {
        if (response.response && response.response.data && response.response.data.product) {
          dispatch({
            type: 'initFetchProductSucceeded',
            productData: response.response.data.product,
          });
          return of(true);
        }
        dispatch({ type: 'initFetchProductFailed', error: 'malformed response' });
        return of(false);
      }),
      catchError((error) => {
        dispatch({ type: 'initFetchProductFailed', error: error.message });
        return of(false);
      }),
    ).subscribe();
  }, [state.status, state.fetchProduct.status, state.product.productCode]);

  /**
     Effect - Handle changes to selection
     Triggers all necessary fetches for meta data and series data
  */
  useEffect(() => {
    const getSiteMonthDataURL = (siteCode, month) => {
      const root = NeonEnvironment.getFullApiPath('data');
      return `${root}/${state.product.productCode}/${siteCode}/${month}`;
    };
    const { timeStep: selectedTimeStep, autoTimeStep } = state.selection;
    const timeStep = selectedTimeStep === 'auto' ? autoTimeStep : selectedTimeStep;
    const continuousDateRange = getContinuousDatesArray(state.selection.dateRange);
    const dataFetchTokens = new Set();
    const dataFetches = [];
    const dataActions = [];

    // Track in local scope if we're going to be fetching metadata so we can hold off on
    // declaring there was no series data to fetch (not because we already loaded it but because
    // we haven't even initialized the loading of it).
    let metaFetchTriggered = false;

    const fetchSiteVariables = (siteCode, url) => {
      dispatch({ type: 'fetchSiteVariables', siteCode });
      fetchCSV(url).pipe(
        map((response) => {
          dispatch({ type: 'fetchSiteVariablesSucceeded', csv: response.response, siteCode });
          return of(true);
        }),
        catchError((error) => {
          dispatch({ type: 'fetchSiteVariablesFailed', error: error.message, siteCode });
          return of(false);
        }),
      ).subscribe();
    };

    const fetchSitePositions = (siteCode, url) => {
      dispatch({ type: 'fetchSitePositions', siteCode });
      fetchCSV(url).pipe(
        map((response) => {
          dispatch({
            type: 'fetchSitePositionsSucceeded',
            csv: response.response,
            siteCode,
          });
          return of(true);
        }),
        catchError((error) => {
          dispatch({
            type: 'fetchSitePositionsFailed',
            error: error.message,
            siteCode,
          });
          return of(false);
        }),
      ).subscribe();
    };

    const fetchNeededSiteMonths = (siteCode, fetches) => {
      continuousDateRange.filter(month => !fetches.siteMonths[month]).forEach((month) => {
        // Don't attempt to fetch any months that are known to be unavailable for a given site
        if (!state.product.sites[siteCode].availableMonths.includes(month)) { return; }
        metaFetchTriggered = true;
        dispatch({ type: 'fetchSiteMonth', siteCode, month });
        ajax.getJSON(getSiteMonthDataURL(siteCode, month), NeonApi.getApiTokenHeader()).pipe(
          map((response) => {
            if (response && response.data && response.data.files) {
              dispatch({
                type: 'fetchSiteMonthSucceeded',
                files: response.data.files,
                siteCode,
                month,
              });
              return of(true);
            }
            dispatch({
              type: 'fetchSiteMonthFailed',
              error: 'malformed response',
              siteCode,
              month,
            });
            return of(false);
          }),
          catchError((error) => {
            dispatch({
              type: 'fetchSiteMonthFailed',
              error: error.message,
              siteCode,
              month,
            });
            return of(false);
          }),
        ).subscribe();
      });
    };

    const prepareDataFetches = (site) => {
      const { siteCode, positions } = site;
      const fetchVariables = state.selection.variables.concat(state.selection.qualityFlags);
      fetchVariables.forEach((variable) => {
        const { downloadPkg } = state.variables[variable];
        positions.forEach((position) => {
          continuousDateRange.forEach((month) => {
            const actionProps = {
              siteCode,
              position,
              month,
              downloadPkg,
              timeStep,
            };
            // eslint-disable-next-line max-len
            const path = `sites['${siteCode}'].positions['${position}'].data['${month}']['${downloadPkg}']['${timeStep}']`;
            const { url, status } = get(state.product, path, {});
            // If the file isn't awaiting a fetch call then don't fetch it
            if (!url || status !== FETCH_STATUS.AWAITING_CALL) { return; }
            // Use the dataFetchTokens set to make sure we don't somehow add the same fetch twice
            const previousSize = dataFetchTokens.size;
            const token = `${siteCode};${position};${month};${downloadPkg};${timeStep}`;
            dataFetchTokens.add(token);
            if (dataFetchTokens.size === previousSize) { return; }
            // Save the action props to pass to the fetchDataFiles action to set all fetch statuses
            dataActions.push(actionProps);
            // Add a file fetch observable to the main list
            dataFetches.push(
              fetchCSV(url).pipe(
                map((response) => {
                  dispatch({
                    type: 'fetchDataFileSucceeded',
                    csv: response.response,
                    ...actionProps,
                  });
                  return of(true);
                }),
                catchError((error) => {
                  dispatch({ type: 'fetchDataFileFailed', error: error.message, ...actionProps });
                  return of(false);
                }),
              ),
            );
          });
        });
      });
    };

    // MAIN LOOP - Trigger fetches as needed for all selected sites
    state.selection.sites.forEach((site) => {
      const { siteCode } = site;
      if (!state.product.sites[siteCode]) { return; }
      const { fetches } = state.product.sites[siteCode];

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
      if (state.status === TIME_SERIES_VIEWER_STATUS.READY_FOR_DATA && !metaFetchTriggered) {
        prepareDataFetches(site);
      }
    });

    // Trigger all data fetches
    if (state.status === TIME_SERIES_VIEWER_STATUS.READY_FOR_DATA && !metaFetchTriggered) {
      if (!dataFetches.length) {
        dispatch({ type: 'noDataFilesFetchNecessary' });
      } else {
        const masterFetchToken = `fetchDataFiles.${uniqueId()}`;
        dispatch({ type: 'fetchDataFiles', token: masterFetchToken, fetches: dataActions });
        forkJoinWithProgress(dataFetches).pipe(
          mergeMap(([finalResult, progress]) => merge(
            progress.pipe(
              tap(value => dispatch({
                type: 'fetchDataFilesProgress',
                token: masterFetchToken,
                value,
              })),
              ignoreElements(),
            ),
            finalResult,
          )),
        ).subscribe(value => dispatch({
          type: 'fetchDataFilesCompleted',
          token: masterFetchToken,
          value,
        }));
      }
    }
  }, [
    state.status,
    state.selection,
    state.selection.digest,
    state.variables,
    state.product,
  ]);

  /**
     Render
  */
  return (
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  );
};

/**
   Prop Types
*/
const productDataShape = PropTypes.shape({
  productCode: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  siteCodes: PropTypes.arrayOf(
    PropTypes.shape({
      siteCode: PropTypes.string.isRequired,
      availableMonths: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  ),
});

const TimeSeriesViewerPropTypes = {
  productCode: (props, propName, componentName) => {
    const { productCode, productData } = props;
    if (!productCode && !productData) {
      return new Error(`One of props 'productCode' or 'productData' was not specified in '${componentName}'.`);
    }
    if (productCode) {
      PropTypes.checkPropTypes(
        { productCode: PropTypes.string },
        { productCode },
        propName,
        componentName,
      );
    }
    return null;
  },
  productData: (props, propName, componentName) => {
    const { productCode, productData } = props;
    if (!productCode && !productData) {
      return new Error(`One of props 'productCode' or 'productData' was not specified in '${componentName}'.`);
    }
    if (productData) {
      PropTypes.checkPropTypes(
        { productData: productDataShape },
        { productData },
        propName,
        componentName,
      );
    }
    return null;
  },
};

Provider.propTypes = {
  productCode: TimeSeriesViewerPropTypes.productCode,
  productData: TimeSeriesViewerPropTypes.productData,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string,
    ])),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
};

Provider.defaultProps = {
  productCode: null,
  productData: null,
};

/**
   Export
*/
const TimeSeriesViewerContext = {
  Provider,
  useTimeSeriesViewerState,
  TimeSeriesViewerPropTypes,
  getUpdatedValueRange,
};

export default TimeSeriesViewerContext;
