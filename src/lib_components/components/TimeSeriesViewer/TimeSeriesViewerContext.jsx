import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import { parse } from 'papaparse';

import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';

import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';

const FETCH_STATUS = {
  AWAITING_CALL: 'AWAITING_CALL',
  FETCHING: 'FETCHING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
};
const COMP_STATUS = {
  INIT_PRODUCT: 'INIT_PRODUCT', // Handling props; fetching product data if needed
  LOADING: 'LOADING', // Actively loading site and/or series data
  ERROR: 'ERROR', // Stop everything because problem
  READY: 'READY', // Ready for user input
};
const DATA_FILE_PARTS = {
  POSITION_H: 6,
  POSITION_V: 7,
  TIME_SCALE: 8,
  MONTH: 10,
  PACKAGE_TYPE: 11,
};

/*
DATA_TYPES: {
  DATE_TIME: "dateTime",
  REAL: "real",
  SIGNED_INTEGER: "signed integer",
  UNSIGNED_INTEGER: "unsigned integer",
}
*/

/**
   Context and Hook Setup
*/
const DEFAULT_STATE = {
  status: COMP_STATUS.INIT_PRODUCT,
  fetchProduct: { status: FETCH_STATUS.AWAITING_CALL, error: null },
  fetches: {},
  variables: {},
  product: {
    productCode: null,
    productName: null,
    productDescription: null,
    productSensor: null,
    dateRange: [null, null],
    continuousDateRange: [],
    variables: {},
    sites: {},
  },
  selection: { dateRange: [null, null], variables: [], sites: [] },
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

// const siteMonthCancelation$ = new Subject();
const getCSV = url => ajax({
  method: 'GET',
  crossDomain: true,
  responseType: 'text',
  url,
});

const TIME_SCALES = {
  '1min': { id: '1min', seconds: 60 },
  '2min': { id: '2min', seconds: 120 },
  '5min': { id: '5min', seconds: 300 },
  '30min': { id: '30min', seconds: 1800 },
};
const getTimeScale = (input) => {
  let cleaned = input;
  if (input.includes('_')) {
    cleaned = input.split('_').slice(1).join('');
  }
  if (TIME_SCALES[cleaned]) { return cleaned; }
  const mapping = {
    '001': '1min',
    '002': '2min',
    '005': '5min',
    '030': '30min',
  };
  if (mapping[cleaned]) { return mapping[cleaned]; }
  return input;
};

const getSeriesVariables = (variables, forDefault = false) => (
  Object.keys(variables).filter((v) => {
    if (
      ['startDateTime', 'endDateTime'].includes(v)
        || variables[v].units === 'NA'
        || /QF$/.test(v)
    ) { return false; }
    if (forDefault && (
      variables[v].downloadPkg === 'expanded' || /QM$/.test(v)
    )) { return false; }
    return true;
  })
);

/**
 * Generate a continuous list of "YYYY-MM" strings given an input date range
 * Will extend beginning and end of date range to encompass whole years
 * (e.g. ['2012-06', '2017-08'] => ['2012-01', '2012-02', ..., '2017-12', '2018-01']
 * @param {array} dateRange - array of exactly two "YYYY-MM" strings
 * @param {boolean} roundToYears - if true then extend each side of the range to whole years
 */
const getContinuousDatesArray = (dateRange, roundToYears = false) => {
  const dateRegex = /^\d{4}-\d{2}$/;
  if (!Array.isArray(dateRange) || dateRange.length !== 2 || dateRange[1] < dateRange[0]
      || !dateRegex.test(dateRange[0]) || !dateRegex.test(dateRange[1])) {
    return [];
  }
  if (dateRange[0] === dateRange[1]) { return dateRange; }
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
    const timeScale = getTimeScale(parts[DATA_FILE_PARTS.TIME_SCALE]);
    if (!newSite.positions[position]) { newSite.positions[position] = { data: {} }; }
    if (!newSite.positions[position].data[month]) { newSite.positions[position].data[month] = {}; }
    if (!newSite.positions[position].data[month][packageType]) {
      newSite.positions[position].data[month][packageType] = {};
    }
    newSite.positions[position].data[month][packageType][timeScale] = url;
  });
  return newSite;
};

const CSV_CONFIG = { header: true, skipEmptyLines: 'greedy' };

const parseSiteVariables = (stateVariables, siteCode, csv) => {
  const newStateVariables = { ...stateVariables };
  const variables = parse(csv, CSV_CONFIG);
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
    const timeScale = getTimeScale(table);
    variablesSet.add(fieldName);
    if (!newStateVariables[fieldName]) {
      newStateVariables[fieldName] = {
        dataType,
        description,
        downloadPkg,
        units,
        timeScales: new Set(),
        sites: new Set(),
      };
    }
    newStateVariables[fieldName].timeScales.add(timeScale);
    newStateVariables[fieldName].sites.add(siteCode);
  });
  return { variablesObject: newStateVariables, variablesSet };
};

const parseSitePositions = (site, csv) => {
  const newSite = { ...site };
  const positions = parse(csv, CSV_CONFIG);
  positions.data.forEach((position) => {
    const posId = position['HOR.VER'];
    if (!newSite.positions[posId]) { newSite.positions[posId] = { data: {} }; }
    newSite.positions[posId] = { ...position, data: newSite.positions[posId].data };
  });
  return newSite;
};

const applyDefaultsToSelection = (state) => {
  const { product, variables } = state;
  const selection = state.selection || { dateRange: [null, null], variables: [], sites: [] };
  if (!Object.keys(product.sites).length) { return selection; }
  // Selection must have at least one site (default to first in list)
  if (!selection.sites.length) {
    const siteCodes = Object.keys(product.sites);
    siteCodes.sort();
    selection.sites.push({ siteCode: siteCodes[0], positions: [] });
  }
  // Selection must have a date range (default to latest month)
  if (selection.dateRange[0] === null || selection.dateRange[1] === null) {
    const { availableMonths } = product.sites[selection.sites[0].siteCode];
    const initialMonth = availableMonths[availableMonths.length - 1];
    selection.dateRange = [initialMonth, initialMonth];
  }
  // If any selected sites don't have selected positions attempt to add one
  selection.sites.forEach((site, idx) => {
    if (site.positions.length > 0) { return; }
    const { siteCode } = site;
    const positions = Object.keys(state.product.sites[siteCode].positions);
    if (!positions.length) { return; }
    positions.sort();
    selection.sites[idx].positions.push(positions[0]);
  });
  // If the selection has no variables attempt to add one
  if (!selection.variables.length && Object.keys(variables).length) {
    const seriesVars = getSeriesVariables(variables, true);
    if (seriesVars.length) { selection.variables.push(seriesVars[0]); }
  }
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
  const calcStatus = fetches => (
    Object.keys(fetches).length ? COMP_STATUS.LOADING : COMP_STATUS.READY
  );
  let parsedContent = null;
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
      newState.selection = applyDefaultsToSelection(newState);
      newState.status = COMP_STATUS.LOADING;
      return newState;

    // Fetch Site Month Actions
    case 'fetchSiteMonth':
      newState.fetches[`fetchSiteMonth.${action.siteCode}.${action.month}`] = true;
      newState.product.sites[action.siteCode].fetches[action.month] = {
        status: FETCH_STATUS.FETCHING, error: null,
      };
      return newState;
    case 'fetchSiteMonthFailed':
      delete newState.fetches[`fetchSiteMonth.${action.siteCode}.${action.month}`];
      newState.product.sites[action.siteCode].fetches[action.month].status = FETCH_STATUS.ERROR;
      newState.product.sites[action.siteCode].fetches[action.month].error = action.error;
      newState.status = calcStatus(newState.fetches);
      return newState;
    case 'fetchSiteMonthSucceeded':
      delete newState.fetches[`fetchSiteMonth.${action.siteCode}.${action.month}`];
      newState.product.sites[action.siteCode].fetches[action.month].status = FETCH_STATUS.SUCCESS;
      newState.product.sites[action.siteCode] = parseSiteMonthData(
        newState.product.sites[action.siteCode], action.files,
      );
      newState.selection = applyDefaultsToSelection(newState);
      newState.status = calcStatus(newState.fetches);
      return newState;

    // Fetch Site Variables Actions
    case 'fetchSiteVariables':
      newState.fetches[`fetchSiteVariables.${action.siteCode}`] = true;
      newState.product.sites[action.siteCode].fetches.variables.status = FETCH_STATUS.FETCHING;
      return newState;
    case 'fetchSiteVariablesFailed':
      delete newState.fetches[`fetchSiteVariables.${action.siteCode}`];
      newState.product.sites[action.siteCode].fetches.variables.status = FETCH_STATUS.ERROR;
      newState.product.sites[action.siteCode].fetches.variables.error = action.error;
      newState.status = calcStatus(newState.fetches);
      return newState;
    case 'fetchSiteVariablesSucceeded':
      delete newState.fetches[`fetchSiteVariables.${action.siteCode}`];
      newState.product.sites[action.siteCode].fetches.variables.status = FETCH_STATUS.SUCCESS;
      parsedContent = parseSiteVariables(newState.variables, action.siteCode, action.csv);
      newState.variables = parsedContent.variablesObject;
      newState.product.sites[action.siteCode].variables = parsedContent.variablesSet;
      newState.selection = applyDefaultsToSelection(newState);
      newState.status = calcStatus(newState.fetches);
      return newState;

    // Fetch Site Positions Actions
    case 'fetchSitePositions':
      newState.fetches[`fetchSitePositions.${action.siteCode}`] = true;
      newState.product.sites[action.siteCode].fetches.positions.status = FETCH_STATUS.FETCHING;
      return newState;
    case 'fetchSitePositionsFailed':
      delete newState.fetches[`fetchSitePositions.${action.siteCode}`];
      newState.product.sites[action.siteCode].fetches.positions.status = FETCH_STATUS.ERROR;
      newState.product.sites[action.siteCode].fetches.positions.error = action.error;
      newState.status = calcStatus(newState.fetches);
      return newState;
    case 'fetchSitePositionsSucceeded':
      delete newState.fetches[`fetchSitePositions.${action.siteCode}`];
      newState.product.sites[action.siteCode].fetches.positions.status = FETCH_STATUS.SUCCESS;
      newState.product.sites[action.siteCode] = parseSitePositions(
        newState.product.sites[action.siteCode], action.csv,
      );
      newState.selection = applyDefaultsToSelection(newState);
      newState.status = calcStatus(newState.fetches);
      return newState;

    // Selection Actions
    case 'selectDateRange':
      newState.selection.dateRange = action.dateRange;
      newState.selection = applyDefaultsToSelection(newState);
      newState.status = calcStatus(newState.fetches);
      return newState;

    // Default
    default:
      return state;
  }
};

/**
   Provider
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
    status: productDataProp ? COMP_STATUS.LOADING : COMP_STATUS.INIT_PRODUCT,
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
     COMP_STATUS: INIT_PRODUCT
  */
  useEffect(() => {
    if (state.status !== COMP_STATUS.INIT_PRODUCT) { return; }
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
  */
  useEffect(() => {
    const getSiteMonthDataURL = (siteCode, month) => {
      const root = NeonEnvironment.getFullApiPath('data');
      return `${root}/${state.product.productCode}/${siteCode}/${month}?presign=false`;
    };
    const continuousDateRange = getContinuousDatesArray(state.selection.dateRange);
    state.selection.sites.forEach((site) => {
      const { siteCode } = site;
      const { fetches } = state.product.sites[siteCode];
      // Fetch variables for any sites in seleciton that haven't had variables fetched
      if (fetches.variables.status === FETCH_STATUS.AWAITING_CALL && fetches.variables.url) {
        dispatch({ type: 'fetchSiteVariables', siteCode });
        getCSV(fetches.variables.url).pipe(
          map((response) => {
            dispatch({ type: 'fetchSiteVariablesSucceeded', csv: response.response, siteCode });
            return of(true);
          }),
          catchError((error) => {
            dispatch({ type: 'fetchSiteVariablesFailed', error: error.message, siteCode });
            return of(false);
          }),
        ).subscribe();
      }
      // Fetch positions for any sites in seleciton that haven't had positions fetched
      if (fetches.positions.status === FETCH_STATUS.AWAITING_CALL && fetches.positions.url) {
        dispatch({ type: 'fetchSitePositions', siteCode });
        getCSV(fetches.positions.url).pipe(
          map((response) => {
            dispatch({ type: 'fetchSitePositionsSucceeded', csv: response.response, siteCode });
            return of(true);
          }),
          catchError((error) => {
            dispatch({ type: 'fetchSitePositionsFailed', error: error.message, siteCode });
            return of(false);
          }),
        ).subscribe();
      }
      // Fetch any site months in selection that have not been fetched
      continuousDateRange.filter(month => !fetches[month]).forEach((month) => {
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
    });
  }, [state.selection, state.selection.digest, state.product.sites, state.product.productCode]);

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
