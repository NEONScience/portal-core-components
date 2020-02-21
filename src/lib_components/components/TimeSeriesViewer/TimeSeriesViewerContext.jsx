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

import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';
import { forkJoinWithProgress } from '../../util/rxUtil';

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
// Array offsets for use when splitting a data file URL
const DATA_FILE_PARTS = {
  POSITION_H: 6,
  POSITION_V: 7,
  TIME_STEP: 8,
  MONTH: 10,
  PACKAGE_TYPE: 11,
};
// Functions to convert a value to the proper JS data type given a NEON variable dataType
const DATA_TYPE_SETTERS = {
  dateTime: v => new Date(v.replace(/"/g, '')),
  real: v => parseFloat(v, 10),
  'signed integer': v => parseInt(v, 10),
  'unsigned integer': v => parseInt(v, 10),
};

/**
   Context and Hook Setup
*/
const DEFAULT_STATE = {
  status: TIME_SERIES_VIEWER_STATUS.INIT_PRODUCT,
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
    sites: [],
    options: {
      timeStep: null,
      qualityFlags: [],
      logScale: { y1: false, y2: false },
      rollPeriod: 1,
    },
  },
};
const Context = createContext(DEFAULT_STATE);
const useTimeSeriesViewerState = () => {
  const hookResponse = useContext(Context);
  if (hookResponse.length !== 2) {
    return [
      { ...DEFAULT_STATE },
      () => {},
    ];
  }
  return hookResponse;
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
const parseCSV = csv => parse(csv, {
  header: true,
  skipEmptyLines: 'greedy',
  // dynamicTyping: true,
});

/**
   Time Step Definitions and Functions
*/
export const TIME_STEPS = {
  '1min': { key: '1min', seconds: 60 },
  '2min': { key: '2min', seconds: 120 },
  '5min': { key: '5min', seconds: 300 },
  '30min': { key: '30min', seconds: 1800 },
};
const getTimeStep = (input) => {
  let cleaned = input;
  if (input.includes('_')) {
    cleaned = input.split('_').slice(1).join('');
  }
  if (TIME_STEPS[cleaned]) { return cleaned; }
  const mapping = {
    '001': '1min',
    '002': '2min',
    '005': '5min',
    '030': '30min',
  };
  if (mapping[cleaned]) { return mapping[cleaned]; }
  return input;
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
        variables: { status: FETCH_STATUS.AWAITING_CALL, error: null, url: null },
        positions: { status: FETCH_STATUS.AWAITING_CALL, error: null, url: null },
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
 * @return {Object} updated site object to be applied at state.product.sites[{site}]
 */
const parseSiteMonthData = (site, files) => {
  const newSite = { ...site };
  files.forEach((file) => {
    const { name, url } = file;
    if (!/\.csv$/.test(name)) { return; }
    if (name.includes('variables')) { newSite.fetches.variables.url = url; return; }
    if (name.includes('sensor_positions')) { newSite.fetches.positions.url = url; return; }
    const parts = name.split('.');
    const position = `${parts[DATA_FILE_PARTS.POSITION_H]}.${parts[DATA_FILE_PARTS.POSITION_V]}`;
    const month = parts[DATA_FILE_PARTS.MONTH];
    const packageType = parts[DATA_FILE_PARTS.PACKAGE_TYPE];
    const timeStep = getTimeStep(parts[DATA_FILE_PARTS.TIME_STEP]);
    if (!newSite.positions[position]) { newSite.positions[position] = { data: {} }; }
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
      && !/QF/.test(fieldName);
    const canBeDefault = isSelectable
      && variable.downloadPkg !== 'expanded'
      && !/QM/.test(fieldName);
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
  const positions = parseCSV(csv);
  positions.data.forEach((position) => {
    const posId = position['HOR.VER'];
    if (!newSite.positions[posId]) { newSite.positions[posId] = { data: {} }; }
    newSite.positions[posId] = { ...position, data: newSite.positions[posId].data };
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
  rows[0].split(',').forEach((fieldName) => {
    const { dataType } = variables[fieldName];
    const field = {
      fieldName,
      setType: DATA_TYPE_SETTERS[dataType] ? DATA_TYPE_SETTERS[dataType] : v => v,
    };
    fields.push(field);
    series[fieldName] = [];
  });
  rows.slice(1).forEach((row) => {
    if (!row.length) { return; }
    const values = row.split(',');
    values.forEach((value, idx) => {
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
const applyDefaultsToSelection = (state) => {
  const { product, variables } = state;
  const selection = state.selection || { dateRange: [null, null], variables: [], sites: [] };
  if (!Object.keys(product.sites).length) { return selection; }
  // Ensure the selection has at least one site (default to first in list)
  if (!selection.sites.length) {
    const siteCodes = Object.keys(product.sites);
    siteCodes.sort();
    selection.sites.push({ siteCode: siteCodes[0], positions: [] });
  }
  // Ensure the selection has a date range (default to latest month)
  if (selection.dateRange[0] === null || selection.dateRange[1] === null) {
    const { availableMonths } = product.sites[selection.sites[0].siteCode];
    const initialMonth = availableMonths[availableMonths.length - 1];
    selection.dateRange = [initialMonth, initialMonth];
  }
  // Ensure every selected site has at least one selected position
  selection.sites.forEach((site, idx) => {
    if (site.positions.length > 0) { return; }
    const { siteCode } = site;
    const positions = Object.keys(state.product.sites[siteCode].positions);
    if (!positions.length) { return; }
    positions.sort();
    selection.sites[idx].positions.push(positions[0]);
  });
  // Ensure the selection has at least one variable
  if (!selection.variables.length && Object.keys(variables).length) {
    const defaultVar = Object.keys(variables).find(variable => variables[variable].canBeDefault);
    if (defaultVar) { selection.variables.push(defaultVar); }
  }
  // Ensure the selection has a time step
  if (!selection.options.timeStep && selection.variables.length) {
    selection.options.timeStep = '30min';
    // TODO: get from available
    // state.variables[selection.variables[0]].timeSteps[0]
  }
  // Generate a new continuous date range from the dateRange (which only contains bounds)
  selection.continuousDateRange = getContinuousDatesArray(selection.dateRange);
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
  const newState = { ...state };
  const calcSelection = () => {
    newState.selection = applyDefaultsToSelection(newState);
  };
  const calcStatus = () => {
    if (Object.keys(newState.metaFetches).length) {
      newState.status = TIME_SERIES_VIEWER_STATUS.LOADING_META;
    } else if (Object.keys(newState.dataFetches).length) {
      newState.status = TIME_SERIES_VIEWER_STATUS.LOADING_DATA;
    } else {
      newState.status = TIME_SERIES_VIEWER_STATUS.READY_FOR_DATA;
    }
  };
  const limitVariablesToTwoUnits = (variables) => {
    const selectedUnits = state.selection.variables.reduce((units, variable) => {
      units.add(state.variables[variable].units);
      return units;
    }, new Set());
    if (selectedUnits.size < 2) {
      return variables;
    }
    return variables.filter(variable => selectedUnits.has(state.variables[variable].units));
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
  switch (action.type) {
    // Fetch Product Actions
    case 'initFetchProductCalled':
      newState.fetchProduct.status = FETCH_STATUS.FETCHING;
      return newState;
    case 'initFetchProductFailed':
      newState.fetchProduct.status = FETCH_STATUS.ERROR;
      newState.fetchProduct.error = action.error;
      newState.status = TIME_SERIES_VIEWER_STATUS.ERROR;
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
      newState.product.sites[action.siteCode].fetches[action.month] = {
        status: FETCH_STATUS.FETCHING, error: null,
      };
      newState.status = TIME_SERIES_VIEWER_STATUS.LOADING_META;
      return newState;
    case 'fetchSiteMonthFailed':
      delete newState.metaFetches[`fetchSiteMonth.${action.siteCode}.${action.month}`];
      newState.product.sites[action.siteCode].fetches[action.month].status = FETCH_STATUS.ERROR;
      newState.product.sites[action.siteCode].fetches[action.month].error = action.error;
      calcStatus();
      return newState;
    case 'fetchSiteMonthSucceeded':
      delete newState.metaFetches[`fetchSiteMonth.${action.siteCode}.${action.month}`];
      newState.product.sites[action.siteCode].fetches[action.month].status = FETCH_STATUS.SUCCESS;
      newState.product.sites[action.siteCode] = parseSiteMonthData(
        newState.product.sites[action.siteCode], action.files,
      );
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
      newState.status = TIME_SERIES_VIEWER_STATUS.LOADING_META;
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
      newState.variables = parsedContent.variablesObject;
      newState.product.sites[action.siteCode].variables = parsedContent.variablesSet;
      calcSelection();
      calcStatus();
      return newState;

    // Fetch Site Positions Actions
    case 'fetchSitePositions':
      newState.metaFetches[`fetchSitePositions.${action.siteCode}`] = true;
      newState.product.sites[action.siteCode].fetches.positions.status = FETCH_STATUS.FETCHING;
      newState.status = TIME_SERIES_VIEWER_STATUS.LOADING_META;
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
      console.log('READY', newState);
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
      calcSelection();
      calcStatus();
      return newState;
    case 'selectVariables':
      newState.selection.variables = limitVariablesToTwoUnits(action.variables);
      calcSelection();
      calcStatus();
      return newState;

    // Option Actions
    case 'setRollPeriod':
      newState.selection.options.rollPeriod = action.rollPeriod;
      console.log('setRollPeriod', newState);
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
  const initialState = {
    ...DEFAULT_STATE,
    status: productDataProp
      ? TIME_SERIES_VIEWER_STATUS.LOADING_META
      : TIME_SERIES_VIEWER_STATUS.INIT_PRODUCT,
  };
  if (productDataProp) {
    initialState.fetchProduct.status = FETCH_STATUS.SUCCESS;
    initialState.product = parseProductData(productDataProp);
  } else {
    initialState.product.productCode = productCodeProp;
  }
  initialState.selection = applyDefaultsToSelection(initialState);
  const [state, dispatch] = useReducer(reducer, initialState);

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
      return `${root}/${state.product.productCode}/${siteCode}/${month}?presign=false`;
    };
    const { timeStep } = state.selection.options;
    const continuousDateRange = getContinuousDatesArray(state.selection.dateRange);
    const dataFetchTokens = new Set();
    const dataFetches = [];
    const dataActions = [];

    // Track in local scope if we're going to be fetching metadata so we can hold off on
    // declaring there was no series data to fetch (not because we already loaded it but because
    // we haven't even initialized the loading of it).
    let metaFetchTriggered = false;

    const fetchSiteVariables = (siteCode, fetches) => {
      dispatch({ type: 'fetchSiteVariables', siteCode });
      fetchCSV(fetches.variables.url).pipe(
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

    const fetchSitePositions = (siteCode, fetches) => {
      dispatch({ type: 'fetchSitePositions', siteCode });
      fetchCSV(fetches.positions.url).pipe(
        map((response) => {
          dispatch({ type: 'fetchSitePositionsSucceeded', csv: response.response, siteCode });
          return of(true);
        }),
        catchError((error) => {
          dispatch({ type: 'fetchSitePositionsFailed', error: error.message, siteCode });
          return of(false);
        }),
      ).subscribe();
    };

    const fetchNeededSiteMonths = (siteCode, fetches) => {
      continuousDateRange.filter(month => !fetches[month]).forEach((month) => {
        metaFetchTriggered = true;
        dispatch({ type: 'fetchSiteMonth', siteCode, month });
        ajax.getJSON(getSiteMonthDataURL(siteCode, month)).pipe(
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
      state.selection.variables.forEach((variable) => {
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
      const { fetches } = state.product.sites[siteCode];

      // Fetch variables for any sites in seleciton that haven't had variables fetched
      if (fetches.variables.status === FETCH_STATUS.AWAITING_CALL && fetches.variables.url) {
        fetchSiteVariables(siteCode, fetches);
        metaFetchTriggered = true;
      }

      // Fetch positions for any sites in seleciton that haven't had positions fetched
      if (fetches.positions.status === FETCH_STATUS.AWAITING_CALL && fetches.positions.url) {
        fetchSitePositions(siteCode, fetches);
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
};

export default TimeSeriesViewerContext;
