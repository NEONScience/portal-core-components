"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tryFindActiveFiles = exports.parseDataFiles = exports.getSiteOptions = exports.getMonthOptions = exports.getLikeMatchers = exports.getDataApiRequest = exports.getApiDataQueryParams = exports.getActiveDataFilesInfo = exports.extractDataFileNameInfo = exports.convertDateToUTC = exports.containsPosition = exports.SPATIAL_INDEX_DEFAULT = exports.PACKAGE_TYPE = void 0;
var _some = _interopRequireDefault(require("lodash/some"));
var _reduce = _interopRequireDefault(require("lodash/reduce"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _typeUtil = require("../../util/typeUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Defines indexes for parsing data file names
 * Index when file name is split by '.'
 */
const DATA_FILE_NOMENCLATURE = {
  HORIZONTAL_SI_FILE_NAME_INDEX: 6,
  VERTICAL_SI_FILE_NAME_INDEX: 7,
  TEMPORAL_INDEX_FILE_NAME_INDEX: 8,
  TABLE_FILE_NAME_INDEX: 9,
  PACKAGE_TYPE_FILE_NAME_INDEX: 11
};

/**
 * File type definitions
 */
const FILE_TYPES = {
  CSV: 'csv',
  VARIABLES: 'variables'
};

/**
 * Package type definitions
 */
const PACKAGE_TYPE = exports.PACKAGE_TYPE = {
  BASIC: 'basic',
  EXPANDED: 'expanded'
};

/**
 * The default spatial index value
 */
const SPATIAL_INDEX_DEFAULT = exports.SPATIAL_INDEX_DEFAULT = '000';

/**
 * Gets the set of like matchers
 * @param {*} matchers
 * @param {*} activeMatcher
 */
const getLikeMatchers = (matchers, activeMatcher) => {
  if (!matchers || !activeMatcher) {
    return [];
  }
  return matchers.filter(matcher => matcher.tmi === activeMatcher.tmi);
};

/**
 * Gets the data API request for the data endpoint
 * @param {*} productCode
 * @param {*} release
 * @param {*} site
 * @param {*} month
 */
exports.getLikeMatchers = getLikeMatchers;
const getDataApiRequest = (productCode, release, site, month) => {
  const root = _NeonEnvironment.default.getFullApiPath('data');
  const hasRelease = (0, _typeUtil.isStringNonEmpty)(release);
  const releaseParam = hasRelease ? `?release=${release}` : '';
  return `${root}/${productCode}/${site}/${month}${releaseParam}`;
};

/**
 * Gets the data endpoint API query params to query based
 * on the existing application state query object for time series.
 * @param {*} query The application state, time series, query object
 */
exports.getDataApiRequest = getDataApiRequest;
const getApiDataQueryParams = action => {
  const {
    product,
    release,
    query
  } = action;
  const hasRelease = (0, _typeUtil.isStringNonEmpty)(release);
  const queryParams = {
    productCode: product.productCode,
    release: hasRelease ? release : undefined,
    site: null,
    month: null
  };
  let availableMonths = null;
  if (query.sites.length <= 0 && query.months.length <= 0) {
    // Default to first available site, latest available month on initial load
    // Sites will be sorted alphabetically by siteCode
    // Months will be chronologically sorted ascending
    availableMonths = product.siteCodes[0].availableMonths;
    queryParams.site = product.siteCodes[0].siteCode;
    queryParams.month = availableMonths[availableMonths.length - 1];
    // Add back to the query if defaulting
    query.sites.push(queryParams.site);
    query.months.push(queryParams.month);
  } else if (query.sites.length <= 0) {
    queryParams.site = product.siteCodes[0].siteCode;
    // eslint-disable-next-line prefer-destructuring
    queryParams.month = query.months[0];
    // Reset the month if the site doesn't have it
    (0, _some.default)(product.siteCodes, value => {
      if (value.siteCode === queryParams.site) {
        availableMonths = value.availableMonths;
        return true;
      }
      return false;
    });
    if (availableMonths.indexOf(queryParams.month) < 0) {
      queryParams.month = availableMonths[availableMonths.length - 1];
      // eslint-disable-next-line no-param-reassign
      query.months[0] = queryParams.month;
    }
    // Add back to the query if defaulting
    query.sites.push(queryParams.site);
  } else if (query.months.length <= 0) {
    // eslint-disable-next-line prefer-destructuring
    queryParams.site = query.sites[0];
    (0, _some.default)(product.siteCodes, value => {
      if (value.siteCode === queryParams.site) {
        queryParams.month = value.availableMonths[value.availableMonths.length - 1];
        return true;
      }
      return false;
    });
    // Add back to the query if defaulting
    query.months.push(queryParams.month);
  } else {
    // Identify query parameters as specified by selections
    // eslint-disable-next-line prefer-destructuring
    queryParams.site = query.sites[0];
    // eslint-disable-next-line prefer-destructuring
    queryParams.month = query.months[0];
    (0, _some.default)(product.siteCodes, value => {
      if (value.siteCode === queryParams.site) {
        availableMonths = value.availableMonths;
        return true;
      }
      return false;
    });
    if (availableMonths.indexOf(queryParams.month) < 0) {
      queryParams.month = availableMonths[availableMonths.length - 1];
      // eslint-disable-next-line no-param-reassign
      query.months[0] = queryParams.month;
    }
  }
  return queryParams;
};

/**
 * Gets the site options for time series selection
 * @param {*} product
 * @param {*} siteLookup
 */
exports.getApiDataQueryParams = getApiDataQueryParams;
const getSiteOptions = (product, siteLookup) => {
  if (!product.siteCodes) {
    return [];
  }
  return product.siteCodes.map(value => {
    if (siteLookup[value.siteCode]) {
      return {
        value: value.siteCode,
        label: `${value.siteCode} (${siteLookup[value.siteCode].description})`
      };
    }
    return {
      value: value.siteCode,
      label: value.siteCode
    };
  });
};

/**
 * Gets the available months options for selection
 * @param {*} product
 * @param {*} siteCodes
 */
exports.getSiteOptions = getSiteOptions;
const getMonthOptions = (product, siteCodes) => {
  if (!product || !product.siteCodes || product.siteCodes.length <= 0) {
    return [];
  }
  if (!siteCodes || siteCodes.length <= 0) {
    return [];
  }
  // Handle single site only
  const siteCode = siteCodes[0];
  let site = null;
  (0, _some.default)(product.siteCodes, value => {
    if (value.siteCode === siteCode) {
      site = value;
      return true;
    }
    return false;
  });
  let months = [];
  if (site !== null) {
    months = (0, _reduce.default)(site.availableMonths, (acc, month) => {
      if (acc.indexOf(month) < 0) {
        acc.push({
          value: month,
          label: month
        });
      }
      return acc;
    }, []);
  }
  if (months === null || months.length <= 0) {
    return months;
  }
  months.sort((a, b) => -1 * a.value.toLowerCase().localeCompare(b.value.toLowerCase()));
  return months;
};

/**
 * Extracts the relevant data file name information from the specified file name
 * @param {*} fileName
 */
exports.getMonthOptions = getMonthOptions;
const extractDataFileNameInfo = fileName => {
  let info = null;
  if (!fileName || fileName.length <= 0) {
    return info;
  }
  const split = fileName.split('.');
  // Ensure digestable file name nomenclature for expected information extraction
  if (split.length > DATA_FILE_NOMENCLATURE.PACKAGE_TYPE_FILE_NAME_INDEX) {
    info = {
      horizontalSI: null,
      verticalSI: null,
      temporalIndex: null,
      tableName: null,
      packageType: null,
      fileExtension: null
    };
    info.horizontalSI = split[DATA_FILE_NOMENCLATURE.HORIZONTAL_SI_FILE_NAME_INDEX];
    info.verticalSI = split[DATA_FILE_NOMENCLATURE.VERTICAL_SI_FILE_NAME_INDEX];
    info.temporalIndex = split[DATA_FILE_NOMENCLATURE.TEMPORAL_INDEX_FILE_NAME_INDEX];
    info.tableName = split[DATA_FILE_NOMENCLATURE.TABLE_FILE_NAME_INDEX];
    info.packageType = split[DATA_FILE_NOMENCLATURE.PACKAGE_TYPE_FILE_NAME_INDEX];
    info.fileExtension = split[split.length - 1];
  }
  return info;
};

/**
 * Checks if the positions array contains the specified position
 * @param {*} positions
 * @param {*} horizontal
 * @param {*} vertical
 */
exports.extractDataFileNameInfo = extractDataFileNameInfo;
const containsPosition = (positions, horizontal, vertical) => {
  if (positions === null || positions.length <= 0) {
    return false;
  }
  return (0, _some.default)(positions, position => {
    if (position.horizontal === horizontal && position.vertical === vertical) {
      return true;
    }
    return false;
  });
};

/**
 * Attempts to find the active files based on the desired query information
 * @param {*} files
 * @param {*} query
 * @param {*} fileResolutionMatchers
 */
exports.containsPosition = containsPosition;
const tryFindActiveFiles = (files, query, fileResolutionMatchers) => {
  let info = null;
  if (!files || files.length <= 0) {
    return info;
  }
  if (!query) {
    return info;
  }
  info = {
    dataFileUrls: [],
    dataFileMatcher: null,
    positions: []
  };
  // Identify based on desired temporal index matchers
  // The order of file resolution matchers determines which to look for first
  (0, _some.default)(fileResolutionMatchers, matcher => {
    (0, _reduce.default)(files, (infoAcc, file) => {
      const fileNameInfo = extractDataFileNameInfo(file.name);
      let addFile = false;
      if (fileNameInfo !== null) {
        // Identify the first csv, basic package, based on order of resolution to identify
        // that matches the requested spatial index
        if (fileNameInfo.fileExtension === FILE_TYPES.CSV && fileNameInfo.packageType === PACKAGE_TYPE.BASIC && (fileNameInfo.temporalIndex === matcher.tmi || fileNameInfo.tableName.indexOf(matcher.fileName) > -1) && (query.positions === null || query.positions.length <= 0 || containsPosition(query.positions, fileNameInfo.horizontalSI, fileNameInfo.verticalSI))) {
          // If no SI were specified, only work from first identified
          if (query.positions === null || query.positions.length <= 0) {
            if (infoAcc.dataFileUrls.length <= 0) {
              addFile = true;
            }
          } else {
            addFile = true;
          }
          if (addFile) {
            infoAcc.positions.push({
              horizontal: fileNameInfo.horizontalSI,
              vertical: fileNameInfo.verticalSI
            });
            // eslint-disable-next-line no-param-reassign
            infoAcc.dataFileMatcher = matcher;
            infoAcc.dataFileUrls.push(file.url);
          }
        }
      }
      return infoAcc;
    }, info);
    if (info.dataFileUrls !== null && info.dataFileUrls.length > 0) {
      return true;
    }
    return false;
  });
  return info;
};

/**
 * Determines the active data file to utilize for displaying data
 * and deriving selection information
 * @param {*} files
 * @param {*} query
 * @param {*} fileResolutionMatchers
 */
exports.tryFindActiveFiles = tryFindActiveFiles;
const getActiveDataFilesInfo = (files, query, fileResolutionMatchers) => {
  const info = {
    dataFileUrls: [],
    dataFileMatcher: null,
    positions: []
  };
  let activeFilesInfo = null;
  const maxTries = 2;
  // Site change refreshes spatial index options
  // if ((query.changeType === null)
  //    || (query.changeType === CHANGE_TYPE.SITE)
  //    || (query.changeType === CHANGE_TYPE.MONTH)) {
  //   maxTries = 1;
  //   query.positions = [];
  // }
  let i = 0;
  while ((info.dataFileUrls === null || info.dataFileUrls.length <= 0) && i < maxTries) {
    // Ignore spatial indexes if the site selection doesn't have them
    // The spatial index values are always derived from the selected site
    // If switching to a site that doesn't have the current SI query definition
    // we want still return data for the site, based on what the site has available
    // Resetting the query SI selections to default here will ensure it works back through
    // based on the default state and works from what the site has
    if (i === 1) {
      // if (query.changeType === CHANGE_TYPE.POSITIONS) {
      // eslint-disable-next-line no-param-reassign
      query.positions = [];
      // }
    }
    activeFilesInfo = tryFindActiveFiles(files, query, fileResolutionMatchers);
    if (activeFilesInfo !== null && activeFilesInfo.dataFileUrls !== null && activeFilesInfo.dataFileUrls.length > 0) {
      info.dataFileUrls = activeFilesInfo.dataFileUrls;
      info.dataFileMatcher = activeFilesInfo.dataFileMatcher;
      info.positions = activeFilesInfo.positions;
    }
    // eslint-disable-next-line no-plusplus
    i++;
  }
  return info;
};

/**
 * Parses the file names and determines which should be utilized for
 * time series data and variables, as well as generating sets of
 * available horizontal and vertical spatial index selection options
 * @param {*} data
 * @param {*} query
 * @param {*} fileResolutionMatchers
 */
exports.getActiveDataFilesInfo = getActiveDataFilesInfo;
const parseDataFiles = (data, query, fileResolutionMatchers) => {
  const dataFilesInfo = {
    dataFileUrls: [],
    dataFileMatcher: null,
    variablesFileUrl: null,
    positions: [],
    positionOptions: []
  };
  const addPositionLookup = {};
  let currentPositionKey;
  if (!data || !data.files || data.files.length <= 0) {
    return dataFilesInfo;
  }
  data.files.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  // Identify the active data file to work form
  const activeDataFilesInfo = getActiveDataFilesInfo(data.files, query, fileResolutionMatchers);
  let fileNameInfo = null;
  // Apply active file info to returned data file info
  if (activeDataFilesInfo !== null && activeDataFilesInfo.dataFileUrls !== null && activeDataFilesInfo.dataFileUrls.length > 0) {
    dataFilesInfo.dataFileUrls = activeDataFilesInfo.dataFileUrls;
    dataFilesInfo.positions = activeDataFilesInfo.positions;
    dataFilesInfo.dataFileMatcher = activeDataFilesInfo.dataFileMatcher;
  }
  // Extract information from set of files based on active
  (0, _reduce.default)(data.files, (acc, file) => {
    fileNameInfo = extractDataFileNameInfo(file.name);
    // Identify variables file
    if (acc.variablesFileUrl === null && file.name.indexOf(FILE_TYPES.CSV) > -1 && file.name.indexOf(FILE_TYPES.VARIABLES) > -1) {
      acc.variablesFileUrl = file.url;
    }
    // Match against CSV, package type, and active file temporal resolution matcher
    if (fileNameInfo !== null && dataFilesInfo.dataFileMatcher !== null && fileNameInfo.fileExtension === FILE_TYPES.CSV && typeof fileNameInfo.packageType !== 'undefined' && fileNameInfo.packageType !== null && fileNameInfo.packageType.toLowerCase() === PACKAGE_TYPE.BASIC && (fileNameInfo.temporalIndex === dataFilesInfo.dataFileMatcher.tmi || fileNameInfo.tableName.indexOf(dataFilesInfo.dataFileMatcher.fileName) > -1)) {
      currentPositionKey = `${fileNameInfo.horizontalSI}-${fileNameInfo.verticalSI}`;
      if (addPositionLookup[currentPositionKey] === undefined) {
        addPositionLookup[currentPositionKey] = currentPositionKey;
        acc.positionOptions.push({
          horizontal: fileNameInfo.horizontalSI,
          vertical: fileNameInfo.verticalSI
        });
      }
    }
    return acc;
  }, dataFilesInfo);
  // Build spatial index selection options
  dataFilesInfo.positionOptions.sort((a, b) => {
    const aValue = `${a.horizontal}-${a.vertical}`.toLowerCase();
    const bValue = `${b.horizontal}-${b.vertical}`.toLowerCase();
    return aValue.localeCompare(bValue);
  });
  dataFilesInfo.positionOptions = dataFilesInfo.positionOptions.map(value => ({
    value: `(${value.horizontal}, ${value.vertical})`,
    label: `(horizontal: ${value.horizontal}, vertical: ${value.vertical})`,
    position: value
  }));
  return dataFilesInfo;
};

/**
 * Converts the supplied date string to the UTC date representation
 * @param {*} dateString
 */
exports.parseDataFiles = parseDataFiles;
const convertDateToUTC = dateString => {
  if (!dateString) {
    return null;
  }
  let utc = null;
  try {
    const d = new Date(dateString);
    utc = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
  } catch (error) {
    utc = null;
  }
  return utc;
};
exports.convertDateToUTC = convertDateToUTC;