import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import PropTypes, { number } from 'prop-types';

import moment from 'moment';
import get from 'lodash/get';
import uniqueId from 'lodash/uniqueId';
import cloneDeep from 'lodash/cloneDeep';

import { parse } from 'papaparse';

import {
  of,
  merge,
  map,
  tap,
  mergeMap,
  switchMap,
  catchError,
  ignoreElements,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';

import NeonApi from '../NeonApi/NeonApi';
import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import { forkJoinWithProgress } from '../../util/rxUtil';
import { exists, existsNonEmpty } from '../../util/typeUtil';

import parseTimeSeriesData from '../../workers/parseTimeSeriesData';

import DataPackageParser from '../../parser/DataPackageParser';
import NeonSignInButtonState from '../NeonSignInButton/NeonSignInButtonState';
import makeStateStorage from '../../service/StateStorageService';
import { convertStateForStorage, convertStateFromStorage } from './StateStorageConverter';
import { getUserAgentHeader } from '../../util/requestUtil';
import { TIME_SERIES_VIEWER_STATUS } from './constants';

// 'get' is a reserved word so can't be imported with import
// eslint-disable-next-line import/extensions
const lodashGet = require('lodash/get.js');

const VIEWER_MODE = {
  DEFAULT: 'DEFAULT',
  STATIC: 'STATIC',
};

// Every possible status a single fetch request can have
const FETCH_STATUS = {
  AWAITING_CALL: 'AWAITING_CALL',
  FETCHING: 'FETCHING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
};

export const TIME_SERIES_VIEWER_STATUS_TITLES = {
  INIT_PRODUCT: 'Loading data product…',
  LOADING_META: 'Loading site positions, variables, and data paths…',
  READY_FOR_DATA: 'Loading series data…',
  LOADING_DATA: 'Loading series data…',
  READY_FOR_SERIES: 'Parsing series data…',
  ERROR: null,
  READY: null,
};

// List of common date-time variable names to verify against
// The variables file ultimately controls the datetime variable that will
// be utilized, this allows us to check for informational purposes
const PREFERRED_DATETIME_VARIABLES = [
  'startDateTime',
  'endDateTime',
  'startDate',
  'endDate',
  'date',
];

// Keys, details, and supporting functions for all possible Y-axis range modes
export const Y_AXIS_RANGE_MODES = {
  CENTERED: 'CENTERED',
  FROM_ZERO: 'FROM_ZERO',
  CUSTOM: 'CUSTOM',
};
export const Y_AXIS_RANGE_MODE_DETAILS = {
  CENTERED: {
    name: 'Centered',
    description: 'Center data by one standard deviation above and below',
  },
  FROM_ZERO: {
    name: 'From Zero',
    description: 'Range from zero to one standard deviation above data',
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
  // Most of the time the margin for our auto-generated axis range is one standard deviation above
  // and below our high and low values of our data range. Edge cases for when stddev is zero:
  // * Data range is flat at zero: margin of 1
  // * Data range is flat at another value: margin of half the absolute value above and below
  let margin = 1;
  if (standardDeviation !== 0) {
    margin = standardDeviation;
  } else if (dataRange[0] !== 0) {
    margin = Math.abs(dataRange[0] / 2);
  }
  let low = (dataRange[0] || 0) - margin;
  let high = (dataRange[1] || 0) + margin;
  low = parseFloat(low.toFixed(precision), 10);
  high = parseFloat(high.toFixed(precision), 10);
  if (rangeMode === Y_AXIS_RANGE_MODES.FROM_ZERO) { return [0, high]; }
  if (rangeMode === Y_AXIS_RANGE_MODES.CENTERED) { return [low, high]; }
  return axisRange;
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
  rangeMode: Y_AXIS_RANGE_MODES.CENTERED,
  axisRange: [0, 0],
};
export const DEFAULT_STATE = {
  mode: VIEWER_MODE.DEFAULT,
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
  fetchReleases: { status: FETCH_STATUS.AWAITING_CALL, error: null },
  release: null,
  releases: [],
  graphData: {
    data: [],
    qualityData: [],
    monthOffsets: {},
    timestampMap: {},
    series: [],
    labels: ['x'],
    qualityLabels: ['start', 'end'],
  },
  selection: {
    dateRange: [null, null],
    continuousDateRange: [],
    variables: [],
    derivedVariableTable: {},
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
    isDefault: true,
  },
  availableQualityFlags: new Set(),
  timeStep: {
    availableTimeSteps: new Set(['auto']),
    // Lookup of time step to variables as specified by the variables file
    // { 'timeStep': { variables: Set<string>, dateTimeVariables: Set<string> } }
    variables: {},
  },
};
const Context = createContext(cloneDeep(DEFAULT_STATE));
const useTimeSeriesViewerState = () => {
  const hookResponse = useContext(Context);
  if (hookResponse.length !== 2) {
    return [cloneDeep(DEFAULT_STATE), () => {}];
  }
  return hookResponse;
};

const DEFAULT_FALLBACK_TMI = 'default';

/**
   Time Step Definitions and Functions
*/
export const TIME_STEPS = {
  '1min': {
    key: '1min',
    matchFileTableSuffix: ['1min', '1_min', '1minute', '1_minute'],
    tmi: '001',
    seconds: 60,
  },
  '2min': {
    key: '2min',
    matchFileTableSuffix: ['2min', '2_min', '2minute', '2_minute', '2minutes', '2_minutes'],
    tmi: '002',
    seconds: 120,
  },
  '5min': {
    key: '5min',
    matchFileTableSuffix: ['5min', '5_min', '5minute', '5_minute', '5minutes', '5_minutes'],
    tmi: '005',
    seconds: 300,
  },
  '15min': {
    key: '15min',
    matchFileTableSuffix: ['15min', '15_min', '15minute', '15_minute', '15minutes', '15_minutes'],
    tmi: '015',
    seconds: 900,
  },
  '30min': {
    key: '30min',
    matchFileTableSuffix: ['30min', '30_min', '30minute', '30_minute', '30minutes', '30_minutes'],
    tmi: '030',
    seconds: 1800,
  },
  '60min': {
    key: '60min',
    matchFileTableSuffix: ['60min', '60_min', '60minute', '60_minute', '60minutes', '60_minutes'],
    tmi: '060',
    seconds: 3600,
  },
  '0AQ': {
    key: '0AQ',
    matchFileTableSuffix: ['0AQ', '0_AQ'],
    tmi: '100',
    seconds: 60,
  },
  '1day': {
    key: '1day',
    matchFileTableSuffix: ['1day', '1_day', 'daily'],
    // DP4.00001.001 includes table names where the tmi is not the suffix:
    // ex: wss_daily_humid, wss_daily_pres, etc
    matchFileTableIncludes: ['_daily_'],
    tmi: '01D',
    seconds: 86400,
  },
};
const getTimeStep = (input = '') => (
  Object.keys(TIME_STEPS).find((key) => TIME_STEPS[key].tmi === input) || null
);
const matchTimeStepForTableName = (key, tableName = '', allowDefaultFallthrough = false) => (
  tableName.endsWith(`_${key}`)
    || TIME_STEPS[key].matchFileTableSuffix.some((suffix) => tableName.endsWith(`_${suffix}`))
    || (existsNonEmpty(TIME_STEPS[key].matchFileTableIncludes)
      && (TIME_STEPS[key].matchFileTableIncludes.some((testStr) => tableName.includes(testStr))))
    || allowDefaultFallthrough
);
const getTimeStepForTableName = (tableName = '', useDefault = false) => (
  Object.keys(TIME_STEPS)
    .find((key) => matchTimeStepForTableName(key, tableName))
      || (useDefault ? DEFAULT_FALLBACK_TMI : null)
);
export const summarizeTimeSteps = (steps, timeStep = null, pluralize = true) => {
  if (steps === 1) { return 'none'; }
  const timeStepSeconds = timeStep && TIME_STEPS[timeStep] ? TIME_STEPS[timeStep].seconds : 1800;
  const seconds = steps * timeStepSeconds;
  const breaks = [60, 3600, 86400, 2592000, 31536000];
  const intervals = ['minute', 'hour', 'day', 'month', 'year'];
  const breakIdx = breaks.reduce((acc, cur, idx) => ((seconds > cur) ? idx : acc), 0);
  let value = (seconds / breaks[breakIdx]).toFixed(1);
  if (value.slice(value.length - 1) === '0') { value = value.slice(0, value.length - 2); }
  const plural = pluralize ? 's' : '';
  return `${value} ${intervals[breakIdx]}${plural}`;
};

// Array offsets and validators for use when splitting a data file URL
const DATA_FILE_PARTS = {
  POSITION_H: {
    offset: 6,
    isValid: (p) => /^[\d]{3}$/.test(p),
  },
  POSITION_V: {
    offset: 7,
    isValid: (p) => /^[\d]{3}$/.test(p),
  },
  TIME_STEP: {
    offset: 8,
    isValid: (p) => Object.keys(TIME_STEPS).some((t) => TIME_STEPS[t].tmi === p),
  },
  TABLE: {
    offset: 9,
    isValid: (p) => (
      /^[\w]+$/.test(p)
        && Object.keys(TIME_STEPS).some((key) => matchTimeStepForTableName(key, p, true))
    ),
  },
  MONTH: {
    offset: 10,
    isValid: (p) => /^[\d]{4}-[\d]{2}$/.test(p),
  },
  PACKAGE_TYPE: {
    offset: 11,
    isValid: (p) => ['basic', 'expanded'].includes(p),
  },
  EXTENSION: {
    offset: 13,
    isValid: (p) => p === 'csv',
  },
};

/**
   CSV Fetch/Parse Functions
*/
// const siteMonthCancelation$ = new Subject();
const fetchCSV = (url) => ajax({
  method: 'GET',
  crossDomain: true,
  responseType: 'text',
  headers: {
    'User-Agent': getUserAgentHeader('Time Series Viewer'),
  },
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
  if (arrayVal.some((v) => typeof v !== 'number')) { return existingRange; }
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
 * Note that in order for the range to actuall appear showing the whole year the following
 * January must also be added.
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
 * Checks the date time variable against known preferred variables
 * @param {string} dateTimeVariable
 */
const checkDateTimeVariable = (dateTimeVariable) => {
  if (!PREFERRED_DATETIME_VARIABLES.includes(dateTimeVariable)) {
    // eslint-disable-next-line no-console
    console.debug(`Determined datetime variable does not match known preferred: ${dateTimeVariable}`);
  }
};

/**
 * Sorts the datetime variables by order specified in the variables file
 * @param {Object} variables
 * @param {Object} a
 * @param {Object} b
 * @returns
 */
const sortDateTimeVariables = (variables, a, b) => {
  const aIdx = variables[a].order;
  const bIdx = variables[b].order;
  if (aIdx === bIdx) {
    return 0;
  }
  return aIdx < bIdx ? -1 : 1;
};

/**
 * Determine the datetime variable for the specified time step
 * @param {Object} variables
 * @param {string} timeStep
 * @returns
 */
const determineDateTimeVariable = (variables, timeStep) => {
  // Find the datetime variables for the specified time step
  let dateTimeVars = Object.keys(variables)
    .filter((v) => variables[v].isDateTime && variables[v].timeSteps.has(timeStep));
  if (dateTimeVars.length <= 0) {
    // If we could not find by defined time step, check for default
    // in case we could not parse the variables file tables
    dateTimeVars = Object.keys(variables)
      .filter((v) => variables[v].isDateTime && variables[v].timeSteps.has(DEFAULT_FALLBACK_TMI));
  }
  if (dateTimeVars.length > 0) {
    dateTimeVars.sort((a, b) => sortDateTimeVariables(variables, a, b));
    const determinedDateTimeVar = dateTimeVars[0]; // eslint-disable-line prefer-destructuring
    checkDateTimeVariable(determinedDateTimeVar);
    return determinedDateTimeVar;
  }
  return null;
};

/**
 * Determine the auto time step for the detected available time steps
 * based on data files, the variables and the order of defined datetime
 * variables in the file, and the set of variables available for each
 * derived time step from the variables file.
 * Finds the first available datetime variable in the variables file
 * and find the lowest resolution time step that applies to the
 * identified datetime variable.
 * @param {Object} availableTimeSteps
 * @param {Object} timeStepVariables
 * @param {Object} variables
 * @returns
 */
const determineAutoTimeStep = (
  availableTimeSteps,
  timeStepVariables,
  variables,
) => {
  const dateTimeVars = Object.keys(variables).filter((v) => variables[v].isDateTime);
  if (dateTimeVars.length <= 0) {
    return null;
  }
  dateTimeVars.sort((a, b) => sortDateTimeVariables(variables, a, b));
  const dateTimeVariable = dateTimeVars[0];
  checkDateTimeVariable(dateTimeVariable);
  // Of the derived available time steps based on data files,
  // find the set of time steps that include the first datetime
  // variable found in the variables file
  let dateTimeVariableTimeSteps = Array.from(availableTimeSteps)
    .filter((timeStep) => (
      exists(timeStepVariables[timeStep])
        && timeStepVariables[timeStep].dateTimeVariables.has(dateTimeVariable)
    ));
  if (dateTimeVariableTimeSteps.length <= 0) {
    // If we could not find by defined time step and datetime variable
    // check for default in case we could not parse the variables file
    // tables
    const hasDefault = exists(timeStepVariables[DEFAULT_FALLBACK_TMI])
      && timeStepVariables[DEFAULT_FALLBACK_TMI].dateTimeVariables.has(dateTimeVariable);
    if (hasDefault) {
      dateTimeVariableTimeSteps = Array.from(availableTimeSteps);
    }
  }
  // Find the time step that has the lowest resolution for the
  // current datetime variable
  return Array.from(dateTimeVariableTimeSteps)
    .reduce((acc, cur) => {
      if (cur === 'auto') {
        return acc;
      }
      if (acc === null) {
        return cur;
      }
      return (TIME_STEPS[cur].seconds > TIME_STEPS[acc].seconds) ? cur : acc;
    }, null);
};

/**
 * Build an object for state.product from a product data fetch response
 * @param {Object} productData - JSON parse response from product data endpoint
 * @return {Object} new product object to be applied at state.product
 */
const parseProductData = (productData = {}) => {
  const product = {
    productCode: productData.productCode,
    productName: productData.productName,
    productDescription: productData.productDescription,
    productSensor: productData.productSensor || null,
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
      availableReleases: site.availableReleases,
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
    if (name.includes('variables')) {
      if (!newSite.fetches.variables.url) { newSite.fetches.variables.url = url; }
      return;
    }
    if (name.includes('sensor_positions')) {
      if (!newSite.fetches.positions.url) { newSite.fetches.positions.url = url; }
      return;
    }
    if (name.includes('science_review_flags')) {
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
    const tableName = parts[DATA_FILE_PARTS.TABLE.offset];
    // Timestep must be valid
    if (timeStep === null) { return; }
    // All is good, add the timestep and add file information to the site object
    availableTimeSteps.add(timeStep);
    if (!newSite.positions[position]) { newSite.positions[position] = { data: {}, history: [] }; }
    if (!newSite.positions[position].data[month]) { newSite.positions[position].data[month] = {}; }
    if (!newSite.positions[position].data[month][packageType]) {
      newSite.positions[position].data[month][packageType] = {};
    }
    if (!newSite.positions[position].data[month][packageType][timeStep]) {
      newSite.positions[position].data[month][packageType][timeStep] = {};
    }
    newSite.positions[position].data[month][packageType][timeStep][tableName] = {
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
  // Build a list of tables we care about. Some products include maintenance tables that should
  // be ignored altogether. Presently our best mechanism to differentiate is that maintenance
  // tables will all have a 'uid' field.
  const tablesWithUid = {};
  variables.data.forEach((variable) => {
    const { table, fieldName } = variable;
    tablesWithUid[table] = tablesWithUid[table] || fieldName === 'uid';
  });
  const validTables = new Set(Object.keys(tablesWithUid).filter((k) => !tablesWithUid[k]));
  const ignoreTables = new Set(['sensor_positions', 'science_review_flags']);
  // Build the set of variables using only the valid tables
  const variablesSet = new Set();
  const timeStepVariables = {};
  variables.data
    .filter((variable) => validTables.has(variable.table) && !ignoreTables.has(variable.table))
    .forEach((variable, idx) => {
      const {
        table,
        fieldName,
        description,
        dataType,
        units,
        downloadPkg,
      } = variable;
      const timeStep = getTimeStepForTableName(table, true);
      const isSelectable = variable.dataType !== 'dateTime'
        && variable.units !== 'NA'
        && !/QF$/.test(fieldName);
      const canBeDefault = isSelectable
        && variable.downloadPkg !== 'expanded'
        && !/QM$/.test(fieldName);
      variablesSet.add(fieldName);
      const isDateTime = (variable.dataType === 'dateTime');
      if (!newStateVariables[fieldName]) {
        newStateVariables[fieldName] = {
          dataType,
          description,
          downloadPkg,
          units,
          tables: new Set(),
          timeSteps: new Set(),
          sites: new Set(),
          isSelectable,
          canBeDefault,
          isDateTime,
          order: idx,
        };
      }
      if (!timeStepVariables[timeStep]) {
        timeStepVariables[timeStep] = {
          variables: new Set(),
          dateTimeVariables: new Set(),
        };
      }
      timeStepVariables[timeStep].variables.add(fieldName);
      if (isDateTime) {
        timeStepVariables[timeStep].dateTimeVariables.add(fieldName);
      }
      newStateVariables[fieldName].tables.add(table);
      newStateVariables[fieldName].timeSteps.add(timeStep);
      newStateVariables[fieldName].sites.add(siteCode);
    });
  return {
    variablesSet,
    variablesObject: newStateVariables,
    timeStepVariables,
  };
};

const parsePosition = (position) => {
  if (!exists(position)) return position;
  return DataPackageParser.parseSensorPosition(position);
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
    const parsedPosition = parsePosition(position);
    if (exists(parsedPosition)) {
      const posId = parsedPosition.horVer;
      if (!newSite.positions[posId]) { newSite.positions[posId] = { data: {}, history: [] }; }
      newSite.positions[posId].history.push(parsedPosition);
    }
  });
  // Sort position history by start/end time descending
  Object.keys(newSite.positions).forEach((posId) => {
    newSite.positions[posId].history.sort((a, b) => {
      if (!a.sensorEndDateTime) { return 1; }
      return (a.sensorEndDateTime < b.sensorStartDateTime) ? -1 : 1;
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
const applyDefaultsToSelection = (state, invalidDefaultVariables = new Set()) => {
  const {
    status,
    product,
    variables,
    selection,
    timeStep: stateTimeStep,
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
  // Determine the auto time step for initial selection
  const { timeStep } = selection;
  const isAutoTimeStep = (timeStep === 'auto');
  if (isAutoTimeStep && (selection.autoTimeStep === null)) {
    selection.autoTimeStep = determineAutoTimeStep(
      stateTimeStep.availableTimeSteps,
      stateTimeStep.variables,
      variables,
    );
  }
  const dataTimeStep = isAutoTimeStep ? selection.autoTimeStep : timeStep;
  // Variables
  selection.derivedVariableTable = {};
  let foundVarWithData = false;
  const hasVariablesSelected = Array.isArray(selection.variables)
    && (selection.variables.length > 0);
  if (Object.keys(variables).length) {
    // Ensure the selection has at least one variable
    if (!hasVariablesSelected) {
      const defaultVar = Object.keys(variables)
        .find((v) => (variables[v].canBeDefault && !invalidDefaultVariables.has(v)));
      if (defaultVar) {
        selection.variables.push(defaultVar);
        selection.yAxes.y1.units = variables[defaultVar].units;
      }
    }
    // Ensure the selection has at least one dateTime variable
    selection.dateTimeVariable = determineDateTimeVariable(variables, dataTimeStep);
  }
  // Generate a new continuous date range from the dateRange (which only contains bounds)
  selection.continuousDateRange = getContinuousDatesArray(selection.dateRange);
  // Generate new cumulative data ranges and standard deviations for all applicable y axes.
  Object.keys(selection.yAxes).forEach((yAxis) => {
    if (selection.yAxes[yAxis].units === null) { return; }
    let combinedSum = 0;
    let combinedCount = 0;
    const monthCounts = [];
    const monthMeans = [];
    const monthVariances = [];
    selection.yAxes[yAxis].dataRange = [null, null];
    selection.yAxes[yAxis].standardDeviation = 0;
    selection.variables.filter((variable) => (
      variables[variable].units === selection.yAxes[yAxis].units
    )).forEach((variable) => {
      const { downloadPkg: pkg } = variables[variable];
      selection.sites.forEach((site) => {
        const { siteCode, positions } = site;
        positions.forEach((position) => {
          selection.continuousDateRange.forEach((month) => {
            if (!variables[variable].tables) {
              return;
            }
            const timeStepTables = lodashGet(
              product.sites[siteCode].positions[position],
              `data['${month}']['${pkg}']['${dataTimeStep}']`,
              {},
            );
            // Attempt to find a table with data for the specified
            // variable (associated tables) and time step
            const tableWithSeries = Array.from(variables[variable].tables).find((table) => {
              const timeStepTable = timeStepTables[table];
              const variableTableTimeStep = getTimeStepForTableName(table, true);
              if (timeStepTable && timeStepTable.series) {
                if (variableTableTimeStep
                    && (variableTableTimeStep.localeCompare(dataTimeStep) === 0)) {
                  const checkSeries = timeStepTable.series[variable];
                  return checkSeries && checkSeries.count;
                }
                if (variableTableTimeStep === DEFAULT_FALLBACK_TMI) {
                  return true;
                }
              }
              return false;
            });
            const series = tableWithSeries
              ? timeStepTables[tableWithSeries].series[variable]
              : null;
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
            selection.yAxes[yAxis].dataRange = getUpdatedValueRange(
              selection.yAxes[yAxis].dataRange,
              series.range,
            );
          });
        });
      });
    });
    if (combinedCount > 0) {
      const dataRangeMax = selection.yAxes[yAxis].dataRange[1];
      const precision = dataRangeMax === null || dataRangeMax <= 0 ? 0 : (
        Math.abs(Math.floor(Math.min(Math.log10(dataRangeMax), 0)))
          + (Math.log10(dataRangeMax) >= 2 ? 0 : 2)
      );
      const combinedMean = combinedSum / combinedCount;
      const deviations = monthMeans.map((mean) => mean - combinedMean);
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
  // Edge case: if the default site/month/position/variable produces a series with no data then
  // it wasn't a good default, but we had no way of knowing until the data series was fully parsed.
  // Here we check for this scenario and if we're in it then add the variable to the
  // invalidDefaultVariables set, remove the variable from the selection, and run again.
  // We'll recurse through the variables available for the site/month/position until we find one
  // that works or show a meaningful error instructing the user to select a different site,
  // month, or position.
  if (
    status === TIME_SERIES_VIEWER_STATUS.READY_FOR_SERIES
      && (!hasVariablesSelected || (!foundVarWithData && selection.isDefault))
      && selection.variables.length
      && selection.yAxes.y1.dataRange.every((x) => x === null)
  ) {
    const allowedDefaultVars = Object.keys(variables).filter((v) => (variables[v].canBeDefault));
    if (allowedDefaultVars.length > invalidDefaultVariables.size) {
      invalidDefaultVariables.add(selection.variables[0]);
      selection.variables = [];
      return applyDefaultsToSelection({ ...state, selection }, invalidDefaultVariables);
    }
  }
  // Generate a new digest for effect comparison
  selection.digest = JSON.stringify({
    sites: selection.sites,
    dateRange: selection.dateRange,
    variables: selection.variables,
    qualityFlags: selection.qualityFlags,
    timeStep: selection.timeStep,
  });
  return selection;
};

const limitVariablesToTwoUnits = (state, variables) => {
  let selectedUnits = variables.reduce((units, variable) => {
    units.add(state.variables[variable].units);
    return units;
  }, new Set());
  if (selectedUnits.size <= 2) {
    return { selectedUnits: Array.from(selectedUnits), variables };
  }
  selectedUnits = new Set(Array.from(selectedUnits).slice(0, 2));
  return {
    selectedUnits: Array.from(selectedUnits),
    variables: variables.filter((variable) => selectedUnits.has(state.variables[variable].units)),
  };
};

const setDataFileFetchStatuses = (state, fetches) => {
  const newState = { ...state };
  fetches.forEach((fetch) => {
    const {
      siteCode,
      position,
      month,
      downloadPkg,
      timeStep,
      table,
    } = fetch;
    if (
      !newState.product || !newState.product.sites || !newState.product.sites[siteCode]
        || !newState.product.sites[siteCode].positions
        || !newState.product.sites[siteCode].positions[position]
        || !newState.product.sites[siteCode].positions[position].data
        || !newState.product.sites[siteCode].positions[position].data[month]
        || !newState.product.sites[siteCode].positions[position].data[month][downloadPkg]
        || !newState.product.sites[siteCode].positions[position].data[month][downloadPkg][timeStep]
        // eslint-disable-next-line max-len
        || !newState.product.sites[siteCode].positions[position].data[month][downloadPkg][timeStep][table]
    ) { return; }
    newState.product
      .sites[siteCode]
      .positions[position]
      .data[month][downloadPkg][timeStep][table]
      .status = FETCH_STATUS.FETCHING;
  });
  return newState;
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
  const softFail = (error) => {
    newState.status = TIME_SERIES_VIEWER_STATUS.WARNING;
    newState.displayError = error;
    return newState;
  };
  const fail = (error) => {
    newState.status = TIME_SERIES_VIEWER_STATUS.ERROR;
    newState.displayError = error;
    return newState;
  };
  let parsedContent = null;
  let selectedSiteIdx = null;
  switch (action.type) {
    // Reinitialize
    case 'reinitialize':
      newState = cloneDeep(DEFAULT_STATE);
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
      newState.status = TIME_SERIES_VIEWER_STATUS.ERROR;
      newState.displayError = `Unable to load product: ${action.error}`;
      return newState;
    case 'initFetchProductSucceeded':
      newState.fetchProduct.status = FETCH_STATUS.SUCCESS;
      newState.product = parseProductData(action.productData);
      calcSelection();
      newState.status = TIME_SERIES_VIEWER_STATUS.LOADING_META;
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
      newState.metaFetches[`fetchSiteMonth.${action.siteCode}.${action.month}`] = true;
      newState.product.sites[action.siteCode].fetches.siteMonths[action.month] = {
        status: FETCH_STATUS.FETCHING, error: null,
      };
      newState.status = TIME_SERIES_VIEWER_STATUS.LOADING_META;
      return newState;
    case 'fetchSiteMonthFailed':
      if (
        !action.siteCode || !action.month
          || !state.metaFetches[`fetchSiteMonth.${action.siteCode}.${action.month}`]
      ) { return state; }
      delete newState.metaFetches[`fetchSiteMonth.${action.siteCode}.${action.month}`];
      newState.product.sites[action.siteCode]
        .fetches.siteMonths[action.month].status = FETCH_STATUS.ERROR;
      newState.product.sites[action.siteCode]
        .fetches.siteMonths[action.month].error = action.error;
      calcStatus();
      return newState;
    case 'fetchSiteMonthSucceeded':
      if (
        !action.siteCode || !action.month
          || !state.metaFetches[`fetchSiteMonth.${action.siteCode}.${action.month}`]
      ) { return state; }
      delete newState.metaFetches[`fetchSiteMonth.${action.siteCode}.${action.month}`];
      newState.product.sites[action.siteCode]
        .fetches.siteMonths[action.month].status = FETCH_STATUS.SUCCESS;
      parsedContent = parseSiteMonthData(
        newState.product.sites[action.siteCode],
        action.files,
      );
      newState.product.sites[action.siteCode] = parsedContent.siteObject;
      newState.timeStep.availableTimeSteps = new Set([
        ...state.timeStep.availableTimeSteps,
        ...parsedContent.availableTimeSteps,
      ]);
      if (newState.timeStep.availableTimeSteps.size === 1) { // Need more than just 'auto'
        return fail('This data product is not compatible with the Time Series Viewer (no valid time step found)');
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
      if (!state.product.sites[action.siteCode]) { return state; }
      newState.metaFetches[`fetchSiteVariables.${action.siteCode}`] = true;
      newState.product.sites[action.siteCode].fetches.variables.status = FETCH_STATUS.FETCHING;
      calcStatus();
      return newState;
    case 'fetchSiteVariablesFailed':
      if (!state.product.sites[action.siteCode]) { return state; }
      delete newState.metaFetches[`fetchSiteVariables.${action.siteCode}`];
      newState.product.sites[action.siteCode].fetches.variables.status = FETCH_STATUS.ERROR;
      newState.product.sites[action.siteCode].fetches.variables.error = action.error;
      calcStatus();
      return newState;
    case 'fetchSiteVariablesSucceeded':
      if (!state.product.sites[action.siteCode]) { return state; }
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
      newState.timeStep = {
        ...state.timeStep,
        variables: {
          ...state.timeStep.variables,
          ...parsedContent.timeStepVariables,
        },
      };
      newState.availableQualityFlags = new Set([
        ...state.availableQualityFlags,
        ...Object.keys(newState.variables).filter((v) => /QF$/.test(v) || /QFSciRvw$/.test(v)),
      ]);
      // A valid dateTime variable must be present otherwise we have no x-axis
      if (Object.keys(newState.variables).every((v) => !newState.variables[v].isDateTime)) {
        return fail('This data product is not compatible with the Time Series Viewer (no dateTime data found)');
      }
      calcSelection();
      calcStatus();
      return newState;

    // Regenerate Graph Data Actions
    case 'regenerateGraphData':
      if (
        !action.graphData.series.length
          || Object.keys(state.selection.yAxes).every((y) => (
            state.selection.yAxes[y].dataRange.every((x) => x === null)
          ))
      ) {
        return softFail('Current selection of dates/sites/positions/variables does not have any valid numeric data.');
      }
      newState.graphData = action.graphData;
      newState.status = TIME_SERIES_VIEWER_STATUS.READY;
      return newState;

    // Fetch Site Positions Actions
    case 'fetchSitePositions':
      if (!state.product.sites[action.siteCode]) { return state; }
      newState.metaFetches[`fetchSitePositions.${action.siteCode}`] = true;
      newState.product.sites[action.siteCode].fetches.positions.status = FETCH_STATUS.FETCHING;
      calcStatus();
      return newState;
    case 'fetchSitePositionsFailed':
      if (!state.product.sites[action.siteCode]) { return state; }
      delete newState.metaFetches[`fetchSitePositions.${action.siteCode}`];
      newState.product.sites[action.siteCode].fetches.positions.status = FETCH_STATUS.ERROR;
      newState.product.sites[action.siteCode].fetches.positions.error = action.error;
      calcStatus();
      return newState;
    case 'fetchSitePositionsSucceeded':
      if (!state.product.sites[action.siteCode]) { return state; }
      delete newState.metaFetches[`fetchSitePositions.${action.siteCode}`];
      newState.product.sites[action.siteCode].fetches.positions.status = FETCH_STATUS.SUCCESS;
      newState.product.sites[action.siteCode] = parseSitePositions(
        newState.product.sites[action.siteCode],
        action.csv,
      );
      calcSelection();
      calcStatus();
      return newState;

    // Fetch Data Actions (Many Files)
    case 'fetchDataFiles':
      newState.dataFetches[action.token] = true;
      newState = setDataFileFetchStatuses(newState, action.fetches);
      newState.dataFetchProgress = 0;
      newState.status = TIME_SERIES_VIEWER_STATUS.LOADING_DATA;
      return newState;
    case 'fetchDataFilesProgress':
      newState.dataFetchProgress = action.value;
      return newState;
    case 'fetchDataFilesCompleted':
      if (!state.dataFetches[action.token]) { return state; }
      delete newState.dataFetches[action.token];
      newState.status = TIME_SERIES_VIEWER_STATUS.READY_FOR_SERIES;
      calcSelection();
      if (!newState.selection.variables.length) {
        return softFail('None of the variables for this product\'s default site/month/position have data. Please select a different site, month, or position.');
      }
      return newState;
    case 'noDataFilesFetchNecessary':
      newState.status = TIME_SERIES_VIEWER_STATUS.READY_FOR_SERIES;
      return newState;

    // Static data injection action, ignore fetches
    case 'staticFetchDataFilesCompleted':
      newState.status = TIME_SERIES_VIEWER_STATUS.READY_FOR_SERIES;
      calcSelection();
      if (!newState.selection.variables.length) {
        return softFail('None of the variables for this product\'s default site/month/position have data. Please select a different site, month, or position.');
      }
      return newState;

    // Fetch Data Actions (Single File)
    case 'fetchDataFileFailed':
      newState.product
        .sites[action.siteCode]
        .positions[action.position]
        .data[action.month][action.downloadPkg][action.timeStep][action.table]
        .status = FETCH_STATUS.ERROR;
      newState.product
        .sites[action.siteCode]
        .positions[action.position]
        .data[action.month][action.downloadPkg][action.timeStep][action.table]
        .error = action.error;
      return newState;
    case 'fetchDataFileSucceeded':
      newState.product
        .sites[action.siteCode]
        .positions[action.position]
        .data[action.month][action.downloadPkg][action.timeStep][action.table]
        .status = FETCH_STATUS.SUCCESS;
      newState.product
        .sites[action.siteCode]
        .positions[action.position]
        .data[action.month][action.downloadPkg][action.timeStep][action.table]
        .series = action.series;
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
        newState.selection.yAxes.y2 = cloneDeep(DEFAULT_AXIS_STATE);
      } else {
        if (!newState.selection.yAxes.y1.units) {
          newState.selection.yAxes.y1 = cloneDeep(DEFAULT_AXIS_STATE);
        }
        if (!newState.selection.yAxes.y2.units) {
          newState.selection.yAxes.y2 = cloneDeep(DEFAULT_AXIS_STATE);
        }
        newState.selection.yAxes.y1.units = parsedContent.selectedUnits[0];
        newState.selection.yAxes.y2.units = parsedContent.selectedUnits[1];
      }
      /* eslint-enable prefer-destructuring */
      calcSelection();
      calcStatus();
      return newState;

    case 'selectYAxisRangeMode':
      if (
        !state.selection.yAxes[action.axis]
          || !Object.keys(Y_AXIS_RANGE_MODES).includes(action.mode)
      ) { return state; }
      newState.selection.isDefault = false;
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
          && action.range.every((v) => typeof v === 'number')
          && action.range[0] < action.range[1]
      )) { return state; }
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
      if (state.selection.yAxes.y2.units === null) { return state; }
      parsedContent = {
        y1: cloneDeep(state.selection.yAxes.y2),
        y2: cloneDeep(state.selection.yAxes.y1),
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
        newState.selection.qualityFlags = [...state.selection.qualityFlags]
          .filter((qf) => qf !== action.qualityFlag);
      }
      calcSelection();
      calcStatus();
      return newState;
    case 'selectTimeStep':
      newState.selection.isDefault = false;
      if (!state.timeStep.availableTimeSteps.has(action.timeStep)) { return state; }
      newState.selection.timeStep = action.timeStep;
      calcSelection();
      calcStatus();
      return newState;
    case 'selectAddSite':
      newState.selection.isDefault = false;
      if (!state.product.sites[action.siteCode]) { return state; }
      if (state.selection.sites.some((site) => site.siteCode === action.siteCode)) { return state; }
      newState.selection.sites.push({ siteCode: action.siteCode, positions: [] });
      calcSelection();
      calcStatus();
      return newState;
    case 'updateSelectedSites':
      if (
        !action.siteCodes || !action.siteCodes.constructor
          || action.siteCodes.constructor.name !== 'Set' || !action.siteCodes.size
      ) { return state; }
      newState.selection.isDefault = false;
      // Remove any sites that are no longer in the selected set
      newState.selection.sites = newState.selection.sites
        .filter((site) => action.siteCodes.has(site.siteCode));
      // Add any new sites from the action
      action.siteCodes.forEach((siteCode) => {
        if (!state.product.sites[siteCode]) { return; }
        if (newState.selection.sites.some((site) => site.siteCode === siteCode)) { return; }
        newState.selection.sites.push({ siteCode, positions: [] });
      });
      calcSelection();
      calcStatus();
      return newState;
    case 'selectRemoveSite':
      if (state.selection.sites.length < 2) { return state; }
      if (!state.selection.sites.some((site) => site.siteCode === action.siteCode)) {
        return state;
      }
      newState.selection.isDefault = false;
      newState.selection.sites = newState.selection.sites
        .filter((site) => site.siteCode !== action.siteCode);
      calcSelection();
      calcStatus();
      return newState;
    case 'selectSitePositions':
      selectedSiteIdx = state.selection.sites.findIndex(
        (site) => (site.siteCode === action.siteCode),
      );
      if (selectedSiteIdx === -1) { return state; }
      if (!state.product.sites[action.siteCode] || !action.positions.length) { return state; }
      if (!action.positions.every((p) => (
        Object.keys(state.product.sites[action.siteCode].positions).includes(p)
      ))) { return state; }
      newState.selection.isDefault = false;
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
 * Defines a lookup of state key to a boolean
 * designating whether or not that instance of the context
 * should pull the state from the session storage and restore.
 * Keeping this lookup outside of the context provider function
 * as to not incur lifecycle interference by storing with useState.
 */
const restoreStateLookup = {};

/**
   Context Provider
*/
const Provider = (props) => {
  const {
    timeSeriesUniqueId,
    mode: modeProp,
    productCode: productCodeProp,
    productData: productDataProp,
    release: releaseProp,
    children,
  } = props;

  /**
     Initial State and Reducer Setup
  */
  let initialState = cloneDeep(DEFAULT_STATE);
  if ((typeof modeProp === 'string') && (modeProp !== VIEWER_MODE.DEFAULT)) {
    initialState.mode = modeProp;
  }
  initialState.status = productDataProp
    ? TIME_SERIES_VIEWER_STATUS.LOADING_META
    : TIME_SERIES_VIEWER_STATUS.INIT_PRODUCT;
  if (productDataProp) {
    initialState.fetchProduct.status = FETCH_STATUS.SUCCESS;
    initialState.product = parseProductData(productDataProp);
  } else {
    initialState.product.productCode = productCodeProp;
  }
  initialState.release = releaseProp;
  initialState.selection = applyDefaultsToSelection(initialState);

  // get the state from storage if present
  const { productCode } = initialState.product;
  const stateKey = `timeSeriesContextState-${productCode}-${timeSeriesUniqueId}`;
  if (typeof restoreStateLookup[stateKey] === 'undefined') {
    restoreStateLookup[stateKey] = true;
  }
  const shouldRestoreState = restoreStateLookup[stateKey];
  const stateStorage = makeStateStorage(stateKey);
  const savedState = stateStorage.readState();
  if (savedState && shouldRestoreState) {
    restoreStateLookup[stateKey] = false;
    const convertedState = convertStateFromStorage(savedState);
    stateStorage.removeState();
    initialState = convertedState;
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const { viewerStatus } = state;

  // The current sign in process uses a separate domain. This function
  // persists the current state in storage when the button is clicked
  // so the state may be reloaded when the page is reloaded after sign
  // in.
  useEffect(() => {
    const subscription = NeonSignInButtonState.getObservable().subscribe({
      next: () => {
        if (!NeonEnvironment.enableGlobalSignInState) return;
        if (viewerStatus !== TIME_SERIES_VIEWER_STATUS.READY) return;
        restoreStateLookup[stateKey] = false;
        const convertedState = convertStateForStorage(state);
        stateStorage.saveState(convertedState);
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [viewerStatus, state, stateStorage, stateKey]);

  /**
     Effect - Reinitialize state if the product code prop changed
  */
  useEffect(() => {
    // Ignore initialization when in static mode
    if (state.mode === VIEWER_MODE.STATIC) { return; }
    if (productCodeProp !== state.product.productCode) {
      dispatch({
        type: 'reinitialize',
        productCode: productCodeProp,
        release: state.release,
      });
    }
    if (releaseProp !== state.release) {
      dispatch({
        type: 'reinitialize',
        productCode: state.product.productCode,
        release: releaseProp,
      });
    }
  }, [
    state.mode,
    productCodeProp,
    releaseProp,
    state.product.productCode,
    state.release,
    dispatch,
  ]);

  /**
     Effect - Fetch product data if only a product code was provided in props
  */
  useEffect(() => {
    // Ignore fetching product data when in static mode
    if (state.mode === VIEWER_MODE.STATIC) { return; }
    if (state.status !== TIME_SERIES_VIEWER_STATUS.INIT_PRODUCT) { return; }
    if (state.fetchProduct.status !== FETCH_STATUS.AWAITING_CALL) { return; }
    dispatch({ type: 'initFetchProductCalled' });
    NeonGraphQL.getDataProductByCode(state.product.productCode, state.release, true).pipe(
      map((response) => {
        if (response?.response?.data?.product) {
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
  }, [
    state.mode,
    state.status,
    state.fetchProduct.status,
    state.product.productCode,
    state.release,
  ]);

  /**
     Effect - Fetch releases
  */
  useEffect(() => {
    // Ignore fetching releases data when in static mode
    if (state.mode === VIEWER_MODE.STATIC) { return; }
    if (state.status !== TIME_SERIES_VIEWER_STATUS.INIT_PRODUCT) { return; }
    if (state.fetchReleases.status !== FETCH_STATUS.AWAITING_CALL) { return; }
    dispatch({ type: 'initFetchReleasesCalled' });
    NeonApi.getReleasesObservable().pipe(
      map((response) => {
        if (response && response.data) {
          dispatch({
            type: 'initFetchReleasesSucceeded',
            releases: response.data,
          });
          return of(true);
        }
        dispatch({ type: 'initFetchReleasesFailed', error: 'malformed response' });
        return of(false);
      }),
      catchError((error) => {
        dispatch({ type: 'initFetchReleasesFailed', error: error.message });
        return of(false);
      }),
    ).subscribe();
  }, [
    state.mode,
    state.status,
    state.fetchReleases.status,
  ]);

  /**
     Effect - Handle changes to selection
     Triggers all necessary fetches for meta data and series data
  */
  useEffect(() => {
    const getSiteMonthDataURL = (siteCode, month) => {
      const root = NeonEnvironment.getFullApiPath('data');
      const hasRelease = state.release
        && (typeof state.release === 'string')
        && (state.release.length > 0);
      const releaseParam = hasRelease
        ? `?release=${state.release}`
        : '';
      return `${root}/${state.product.productCode}/${siteCode}/${month}${releaseParam}`;
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
      continuousDateRange.filter((month) => !fetches.siteMonths[month]).forEach((month) => {
        // Don't attempt to fetch any months that are known to be unavailable for a given site
        if (!state.product.sites[siteCode].availableMonths.includes(month)) { return; }
        metaFetchTriggered = true;
        dispatch({ type: 'fetchSiteMonth', siteCode, month });
        NeonApi.getJsonObservable(getSiteMonthDataURL(siteCode, month), NeonApi.getApiTokenHeader())
          .pipe(
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
            // eslint-disable-next-line max-len
            const path = `sites['${siteCode}'].positions['${position}'].data['${month}']['${downloadPkg}']['${timeStep}']`;
            const timeStepTables = get(state.product, path, {});
            Object.keys(timeStepTables).forEach((tableName) => {
              const timeStepTable = timeStepTables[tableName];
              const { url, status } = timeStepTable;
              // If the file isn't awaiting a fetch call then don't fetch it
              if (!url || status !== FETCH_STATUS.AWAITING_CALL) { return; }
              // Use the dataFetchTokens set to make sure we don't somehow add the same fetch twice
              const previousSize = dataFetchTokens.size;
              const token = `${siteCode};${position};${month};${downloadPkg};${timeStep};${tableName}`;
              dataFetchTokens.add(token);
              if (dataFetchTokens.size === previousSize) { return; }
              // Save the action props to pass to the fetchDataFiles
              // action to set all fetch statuses
              const actionProps = {
                siteCode,
                position,
                month,
                downloadPkg,
                timeStep,
                table: tableName,
              };
              dataActions.push(actionProps);
              // Add a file fetch observable to the main list
              dataFetches.push(
                fetchCSV(url).pipe(
                  map((response) => response.response),
                  switchMap((csv) => (
                    parseTimeSeriesData({ csv, variables: state.variables }).then((series) => {
                      dispatch({
                        type: 'fetchDataFileSucceeded',
                        series,
                        ...actionProps,
                      });
                    })
                  )),
                  catchError((error) => {
                    dispatch({ type: 'fetchDataFileFailed', error: error.message, ...actionProps });
                    return of(false);
                  }),
                ),
              );
            });
          });
        });
      });
    };

    // MAIN LOOP - Trigger fetches as needed for all selected sites
    state.selection.sites.forEach((site) => {
      const { siteCode } = site;
      if (!state.product.sites[siteCode]) { return; }
      const { fetches } = state.product.sites[siteCode];

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
          if (state.status === TIME_SERIES_VIEWER_STATUS.READY_FOR_DATA && !metaFetchTriggered) {
            prepareDataFetches(site);
          }
          break;
      }
    });

    // Ignore data fetches when in static mode
    if (state.mode === VIEWER_MODE.STATIC) { return; }

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
              tap((value) => dispatch({
                type: 'fetchDataFilesProgress',
                token: masterFetchToken,
                value,
              })),
              ignoreElements(),
            ),
            finalResult,
          )),
        ).subscribe((value) => dispatch({
          type: 'fetchDataFilesCompleted',
          token: masterFetchToken,
          value,
        }));
      }
    }
  }, [
    state.mode,
    state.status,
    state.selection,
    state.selection.digest,
    state.variables,
    state.product,
    state.release,
  ]);

  /**
     Render
  */
  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  );
};

/**
   Prop Types
*/
const TimeSeriesViewerPropTypes = {
  productCode: (props, propName, componentName) => {
    const { productCode, productData } = props;
    if (!productCode && !productData) {
      return new Error(`One of props 'productCode' or 'productData' was not specified in '${componentName}'.`);
    }
    if (productData && !productCode) { return null; }
    if (productCode && typeof productCode === 'string' && productCode.length > 0) {
      return null;
    }
    return new Error(`Props 'productCode' must be a non-empty string in '${componentName}'.`);
  },
  productData: (props, propName, componentName) => {
    const { productCode, productData } = props;
    if (!productCode && !productData) {
      return new Error(`One of props 'productCode' or 'productData' was not specified in '${componentName}'.`);
    }
    if (productCode && !productData) { return null; }
    if (
      (typeof productData.productCode !== 'string' || !productData.productCode.length)
        || (typeof productData.productName !== 'string' || !productData.productName.length)
        || (Array.isArray(productData.siteCodes) && !productData.siteCodes.every((siteObj) => (
          typeof siteObj.siteCode === 'string' && siteObj.siteCode.length
            && Array.isArray(siteObj.availableMonths)
            && siteObj.availableMonths.every((month) => (typeof month === 'string' && month.length))
        )))
    ) {
      return new Error(`Prop 'productData' is malformed in '${componentName}'.`);
    }
    return null;
  },
};

Provider.propTypes = {
  timeSeriesUniqueId: number,
  mode: PropTypes.string,
  productCode: TimeSeriesViewerPropTypes.productCode,
  productData: TimeSeriesViewerPropTypes.productData,
  release: PropTypes.string,
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
  timeSeriesUniqueId: 0,
  mode: VIEWER_MODE.DEFAULT,
  productCode: null,
  productData: null,
  release: null,
};

/**
   Export
*/
const TimeSeriesViewerContext = {
  Provider,
  useTimeSeriesViewerState,
  TimeSeriesViewerPropTypes,
};

export default TimeSeriesViewerContext;

// Additional items exported for unit testing
export const getTestableItems = () => (
  process.env.NODE_ENV !== 'test' ? {} : {
    DEFAULT_STATE,
    FETCH_STATUS,
    applyDefaultsToSelection,
    generateYAxisRange,
    getTimeStep,
    getUpdatedValueRange,
    getContinuousDatesArray,
    limitVariablesToTwoUnits,
    parseProductData,
    parseSiteMonthData,
    parseSiteVariables,
    parseSitePositions,
    reducer,
    setDataFileFetchStatuses,
    TimeSeriesViewerPropTypes,
  }
);
