"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTestableItems = exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _moment = _interopRequireDefault(require("moment"));
var _rxjs = require("rxjs");
var _NeonApi = _interopRequireDefault(require("../NeonApi/NeonApi"));
var _ExternalHost = _interopRequireDefault(require("../ExternalHost/ExternalHost"));
var _manifestUtil = require("../../util/manifestUtil");
var _rxUtil = require("../../util/rxUtil");
var _StateStorageService = _interopRequireDefault(require("../../service/StateStorageService"));
var _NeonSignInButtonState = _interopRequireDefault(require("../NeonSignInButton/NeonSignInButtonState"));
var _ReleaseService = _interopRequireDefault(require("../../service/ReleaseService"));
var _StateStorageConverter = require("./StateStorageConverter");
var _typeUtil = require("../../util/typeUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } /* eslint-disable max-len, no-unused-vars */ // eslint-disable-next-line import/no-cycle
const ALL_POSSIBLE_VALID_DATE_RANGE = ['2010-01', (0, _moment.default)().format('YYYY-MM')];
const ALL_POSSIBLE_VALID_DOCUMENTATION = ['include', 'exclude'];
const ALL_POSSIBLE_VALID_PACKAGE_TYPE = ['basic', 'expanded'];
const ALL_POSSIBLE_VALID_PROVISIONAL_DATA = ['include', 'exclude'];
const AVAILABILITY_VIEW_MODES = ['summary', 'sites', 'states', 'domains'];
const ALL_STEPS = {
  documentation: {
    requiredStateKeys: ['documentation'],
    label: 'Documentation',
    title: 'Do you want to include documentation?'
  },
  externalExclusive: {
    requiredStateKeys: [],
    label: 'External Links'
  },
  s3Files: {
    requiredStateKeys: ['s3Files'],
    label: 'Files',
    title: 'Select Files to Include in Download'
  },
  packageType: {
    requiredStateKeys: ['packageType'],
    label: 'Package Type',
    title: 'Which package type do you want?'
  },
  provisionalData: {
    requiredStateKeys: ['provisionalData'],
    label: 'Provisional Data',
    title: 'Do you want to include provisional data?'
  },
  sitesAndDateRange: {
    requiredStateKeys: ['sites', 'dateRange'],
    label: 'Sites and Date Range',
    title: 'What sites and dates do you want?'
  },
  policies: {
    requiredStateKeys: ['policies'],
    label: 'Policies',
    title: 'Agree to Policies'
  },
  summary: {
    requiredStateKeys: [],
    label: 'Summary',
    title: 'Summary of Data Download Configuration'
  }
};

// For required steps isComplete can be a boolean or null.
// If boolean will be interpreted as requiring validated user interaction.
// If null will be interpreted as purely informational and completion does not apply.
const DEFAULT_REQUIRED_STEPS = [{
  key: 'sitesAndDateRange',
  isComplete: false
}, {
  key: 'provisionalData',
  isComplete: true
}, {
  key: 'packageType',
  isComplete: false
}, {
  key: 'documentation',
  isComplete: true
}, {
  key: 'policies',
  isComplete: false
}, {
  key: 'summary',
  isComplete: null
}];
const DEFAULT_STATE = {
  downloadContextIsActive: true,
  broadcast: false,
  dialogOpen: false,
  awaitingHigherOrderUpdateWhenDialogOpens: false,
  cachedHigherOrderState: {},
  productData: {},
  requiredSteps: [],
  allStepsComplete: false,
  fromManifest: false,
  fromAOPManifest: false,
  fromExternalHost: false,
  manifest: {
    status: 'awaitingFetchCall',
    value: null,
    error: null
  },
  availabilityView: null,
  s3FileFetches: {},
  // Where we keep individual fetch status for each site+yearMonth
  s3FileFetchProgress: 0,
  // Number to track progress of batch fetches for s3 files
  s3Files: {
    maxNumFilesSelected: 60000,
    value: [],
    valueMap: {},
    cachedValues: [],
    // Where all fetched file records are cached
    validValues: [],
    // Subset of cached values in scope of current sites and date range values
    isValid: false,
    bytesByUrl: {},
    // A mapping of id to file size for fast summing of total download size
    totalSize: 0,
    estimatedPostSize: 0,
    // For disabling download button above a threshold per POST API limitation
    filteredFileCount: 0,
    // A cached count of files present when current filters are applied
    lastFilterChanged: null,
    // Used to refocus on field after state update if needed (file name)
    filters: {
      // Where we cache material table filter state for reinjection on full rerender
      site: [],
      type: [],
      visit: [],
      yearMonth: []
    },
    valueLookups: {
      // Where we cache unique values in validValues for table filters
      site: {},
      type: {},
      visit: {},
      yearMonth: {}
    },
    visibleColumns: ['site', 'visit', 'date', 'name', 'type']
  },
  latestRelease: null,
  release: {
    value: null,
    validValues: [],
    isValid: false
  },
  sites: {
    value: [],
    validValues: [],
    isValid: false
  },
  dateRange: {
    value: [...ALL_POSSIBLE_VALID_DATE_RANGE],
    validValues: [...ALL_POSSIBLE_VALID_DATE_RANGE],
    isValid: false
  },
  documentation: {
    value: 'include',
    validValues: [...ALL_POSSIBLE_VALID_DOCUMENTATION],
    isValid: true
  },
  packageType: {
    value: null,
    validValues: [...ALL_POSSIBLE_VALID_PACKAGE_TYPE],
    isValid: false
  },
  provisionalData: {
    value: 'exclude',
    validValues: [...ALL_POSSIBLE_VALID_PROVISIONAL_DATA],
    isValid: true
  },
  policies: {
    value: false,
    validValues: null,
    isValid: false
  }
};

// State keys that have a common { value, validValues, isValid } shape and can be validated
const VALIDATABLE_STATE_KEYS = ['release', 'sites', 'dateRange', 'documentation', 'packageType', 'provisionalData', 's3Files', 'policies'];

// State keys that can be transfered between contexts through higher order state
// (must be a subset of VALIDATABLE_STATE_KEYS)
const HIGHER_ORDER_TRANSFERABLE_STATE_KEYS = ['release', 'sites', 'dateRange'];

// State keys that should trigger a new manifest (file size estimate) request when updated
// (must be a subset of VALIDATABLE_STATE_KEYS)
const MANIFEST_TRIGGERING_STATE_KEYS = ['release', 'sites', 'dateRange', 'documentation', 'packageType', 'provisionalData'];

// Regexes and associated capture group names for parse s3 file names and URLs
const S3_PATTERN = {
  name: {
    regex: /^([\w\\(\\)._-]+)\.(\w+)$/,
    groups: ['name', 'type']
  },
  url: {
    regex: /^.*\/(\w+)\/\w+_(\d+)\/(\w+)\/\w+\/\w+(?:\/\w+)*\/[\w\\(\\)._-]+\.\w+$/,
    groups: ['domain', 'visit', 'level']
  }
};

// VALIDATOR FUNCTIONS
// Naive check, replace with a more robust JSON schema check
const productDataIsValid = productData => {
  if (typeof productData !== 'object' || productData === null || typeof productData.productName !== 'string') {
    return false;
  }
  const hasSiteCodes = Array.isArray(productData.siteCodes);
  if (!hasSiteCodes) {
    const externalHost = _ExternalHost.default.getByProductCode(productData.productCode);
    if ((0, _typeUtil.exists)(externalHost)) {
      const externalHostProduct = _ExternalHost.default.getProductSpecificInfo(productData.productCode);
      return (0, _typeUtil.exists)(externalHostProduct) && externalHostProduct.allowNoAvailability === true;
    }
  }
  return hasSiteCodes;
};
const yearMonthIsValid = function () {
  let yearMonth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  if (typeof yearMonth !== 'string') {
    return false;
  }
  const match = yearMonth.match(/^([\d]{4})-([\d]{2})$/);
  if (!match) {
    return false;
  }
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const maxYear = new Date().getFullYear() + 1;
  return year >= 2010 && year <= maxYear && month >= 1 && month <= 12;
};

// Check whether a new state value is "allowable" - as in it may not be *valid*
// to build a manifest, but it can be applied to state as components that use
// this state to render a form will render it correctly.
const newStateIsAllowable = (key, value) => {
  switch (key) {
    case 'release':
      return value === null || typeof value === 'string' && value.length > 0;
    case 'sites':
      return Array.isArray(value) && value.every(site => typeof site === 'string' && /^[A-Z]{4}$/.test(site));
    case 'dateRange':
      return Array.isArray(value) && value.length === 2 && yearMonthIsValid(value[0]) && yearMonthIsValid(value[1]) && value[0] >= ALL_POSSIBLE_VALID_DATE_RANGE[0] && value[1] <= ALL_POSSIBLE_VALID_DATE_RANGE[1] && value[0] <= value[1];
    case 'documentation':
      return ALL_POSSIBLE_VALID_DOCUMENTATION.includes(value) || value === null;
    case 'packageType':
      return ALL_POSSIBLE_VALID_PACKAGE_TYPE.includes(value) || value === null;
    case 'provisionalData':
      return ALL_POSSIBLE_VALID_PROVISIONAL_DATA.includes(value) || value === null;
    case 's3Files':
      return Array.isArray(value) && value.every(id => typeof id === 'string');
    case 'policies':
      return value === true;
    default:
      return false;
  }
};

// Check whether a new state value is "valid" - as in it is within the requirements
// to be used in building a download manifest.
const newStateIsValid = function (key, value) {
  let validValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  if (!VALIDATABLE_STATE_KEYS.includes(key)) {
    return false;
  }
  const idList = {};
  switch (key) {
    case 'sites':
      return newStateIsAllowable(key, value) && Array.isArray(validValues) && value.length > 0 && value.every(site => validValues.includes(site));
    case 'dateRange':
      return newStateIsAllowable(key, value) && newStateIsAllowable(key, validValues) && value[0] >= validValues[0] && value[1] <= validValues[1];
    case 's3Files':
      if (!Array.isArray(validValues) || !validValues.length || !validValues.every(f => typeof f === 'object' && f !== null && typeof f.url === 'string' && f.url.length)) {
        return false;
      }
      validValues.forEach(fileObj => {
        idList[fileObj.url] = true;
      });
      return newStateIsAllowable(key, value) && value.length > 0 && value.every(id => idList[id] || false);
    default:
      return newStateIsAllowable(key, value) && (!Array.isArray(validValues) || validValues.includes(value));
  }
};
const mutateNewStateIntoRange = function (key, value) {
  let validValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  if (newStateIsValid(key, value, validValues)) {
    return value;
  }
  const valueIsAllowable = newStateIsAllowable(key, value);
  let valueIsDefault = false;
  switch (key) {
    case 'sites':
      return valueIsAllowable ? value.filter(site => validValues.includes(site)) : [];
    case 'dateRange':
      valueIsDefault = valueIsAllowable && value[0] === ALL_POSSIBLE_VALID_DATE_RANGE[0] && value[1] === ALL_POSSIBLE_VALID_DATE_RANGE[1];
      return valueIsAllowable || valueIsDefault ? [value[0] < validValues[0] ? validValues[0] : value[0], value[1] > validValues[1] ? validValues[1] : value[1]] : validValues;
    default:
      return valueIsAllowable ? value : DEFAULT_STATE[key].value;
  }
};

// Estimate a POST body size from a sile list and sites list for s3Files-based
// downloads. Numbers here are based on the current POST API and what it requires
// for form data keys, which is excessively verbose.
const estimatePostSize = (s3FilesState, sitesState) => {
  const baseLength = 300;
  const sitesLength = sitesState.value.length * 62;
  const filesLength = s3FilesState.value.reduce((a, b) => a + encodeURIComponent(b).length + 58, 0);
  return baseLength + sitesLength + filesLength;
};

// GETTER FUNCTIONS
const getValidValuesFromProductData = (productData, key) => {
  switch (key) {
    case 'release':
      return (productData.releases || []).map(r => r.release) || [];
    case 'sites':
      return (productData.siteCodes || []).map(s => s.siteCode) || [];
    case 'dateRange':
      return (productData.siteCodes || []).reduce((acc, site) => {
        if (!Array.isArray(site.availableMonths) || !site.availableMonths.length) {
          return acc;
        }
        const start = site.availableMonths[0];
        const end = site.availableMonths[site.availableMonths.length - 1];
        return [acc[0] === null || acc[0] > start ? start : acc[0], acc[1] === null || acc[1] < end ? end : acc[1]];
      }, [null, null]);
    case 'documentation':
      return [...ALL_POSSIBLE_VALID_DOCUMENTATION];
    case 'packageType':
      return [...ALL_POSSIBLE_VALID_PACKAGE_TYPE];
    case 'provisionalData':
      return [...ALL_POSSIBLE_VALID_PROVISIONAL_DATA];
    case 'policies':
      return null;
    default:
      return [];
  }
};

// Build initial state from props by first deriving valid values from
// product data (where appropriate) and then mutating prop values into
// range of valid values where appropriate.
const getInitialStateFromProps = props => {
  // Handle base product data
  const {
    productData,
    availabilityView,
    release
  } = props;
  if (!productDataIsValid(productData)) {
    return _extends({}, DEFAULT_STATE, {
      availabilityView,
      requiredSteps: []
    });
  }
  const initialState = _extends({}, DEFAULT_STATE, {
    availabilityView,
    productData
  });
  const isAOPPipeline = ['productScienceTeam', 'productScienceTeamAbbr'].some(key => typeof productData[key] === 'string' && productData[key].includes('AOP')) && (productData.productPublicationFormatType || '').includes('AOP');

  // Pull the latest release from productData
  if (productData.releases && productData.releases.length) {
    const sortedReleases = [...productData.releases].sort((a, b) => a.generationDate > b.generationDate ? -1 : 1);
    initialState.latestRelease = sortedReleases[0].release;
  }

  // Set required steps and data download origin booleans
  // Note that a data product can come from the NEON manifest AND an external host
  let requiredSteps = [...DEFAULT_REQUIRED_STEPS];
  let fromManifest = true;
  let fromAOPManifest = false;
  let fromExternalHost = false;
  const externalHost = _ExternalHost.default.getByProductCode(productData.productCode);
  const externalHostProduct = _ExternalHost.default.getProductSpecificInfo(productData.productCode);
  if (externalHost) {
    fromExternalHost = true;
    const allowNoAvailability = externalHostProduct.allowNoAvailability === true;
    const useExternalExclusiveData = externalHost.hostType === _ExternalHost.default.HOST_TYPES.EXCLUSIVE_DATA || allowNoAvailability && !(0, _typeUtil.existsNonEmpty)(productData.siteCodes);
    if (useExternalExclusiveData) {
      fromManifest = false;
      requiredSteps = [{
        key: 'externalExclusive',
        isComplete: null
      }];
    }
  } else if (isAOPPipeline) {
    fromManifest = false;
    fromAOPManifest = true;
    requiredSteps = [{
      key: 'sitesAndDateRange',
      isComplete: false
    }, {
      key: 'provisionalData',
      isComplete: true
    }, {
      key: 's3Files',
      isComplete: false
    }, {
      key: 'documentation',
      isComplete: true
    }, {
      key: 'policies',
      isComplete: false
    }, {
      key: 'summary',
      isComplete: null
    }];
  }
  // Remove package type step if product does not offer expanded data
  if (productData.productHasExpanded === false && requiredSteps.some(step => step.key === 'packageType')) {
    requiredSteps.splice(requiredSteps.findIndex(step => step.key === 'packageType'), 1);
  }
  // Remove provisional data step if release specified and is not a non-release
  const hasRelease = (0, _typeUtil.isStringNonEmpty)(release);
  const excludeProvisionalStep = hasRelease && !_ReleaseService.default.isNonRelease(release);
  const hasProvisionalDataStep = requiredSteps.some(step => step.key === 'provisionalData');
  let hasProvisionalData = false;
  if ((0, _typeUtil.exists)(productData) && (0, _typeUtil.existsNonEmpty)(productData.siteCodes)) {
    hasProvisionalData = productData.siteCodes.some(siteCode => {
      if (!(0, _typeUtil.existsNonEmpty)(siteCode.availableReleases)) {
        return false;
      }
      return siteCode.availableReleases.some(availableRelease => _ReleaseService.default.isProv(availableRelease.release) && (0, _typeUtil.existsNonEmpty)(availableRelease.availableMonths));
    });
  }
  if (hasProvisionalDataStep && excludeProvisionalStep || hasProvisionalDataStep && !hasProvisionalData) {
    requiredSteps.splice(requiredSteps.findIndex(step => step.key === 'provisionalData'), 1);
  }
  initialState.requiredSteps = requiredSteps;
  initialState.fromManifest = fromManifest;
  initialState.fromAOPManifest = fromAOPManifest;
  initialState.fromExternalHost = fromExternalHost;

  // Set all validatable state keys
  VALIDATABLE_STATE_KEYS.forEach(key => {
    const validValues = getValidValuesFromProductData(productData, key);
    const unmutatedValue = props[key] || DEFAULT_STATE[key].value;
    const value = mutateNewStateIntoRange(key, unmutatedValue, validValues);
    const isValid = newStateIsValid(key, value, validValues);
    initialState[key] = _extends({}, DEFAULT_STATE[key], {
      value,
      validValues,
      isValid
    });
  });

  // If AOP then initialize all s3FileFetches from props
  // ('notRequested' by default, 'awaitingFetchCall' if site + date is already in selection)
  if (isAOPPipeline) {
    initialState.s3FileFetches = productData.siteCodes.reduce((acc, site) => {
      site.availableMonths.forEach(month => {
        acc["".concat(site.siteCode, ".").concat(month)] = initialState.sites.value.includes(site.siteCode) && initialState.dateRange.value[0] <= month && initialState.dateRange.value[1] >= month ? 'awaitingFetchCall' : 'notRequested';
      });
      return acc;
    }, {});
  }

  // Mark completed steps from initial values
  initialState.requiredSteps.forEach((step, idx) => {
    if (initialState.requiredSteps[idx].isComplete === null) {
      return;
    }
    initialState.requiredSteps[idx].isComplete = ALL_STEPS[step.key] && ALL_STEPS[step.key].requiredStateKeys.every(key => initialState[key].isValid);
  });

  // Set allStepsComplete boolean. Ignore steps where isComplete is null
  // as that signifies "n/a" (the step is informational, completion doesn't apply).
  initialState.allStepsComplete = initialState.requiredSteps.every(step => step.isComplete || step.isComplete === null);

  // Done!
  return initialState;
};
const getS3FilesFilterFunction = state => row => {
  let allowValue = true;
  const hasProvisionalDataStep = state.requiredSteps.some(step => step.key === 'provisionalData');
  const excludeProvisionalData = hasProvisionalDataStep && state.provisionalData.value === 'exclude';
  if (excludeProvisionalData) {
    allowValue = (0, _typeUtil.isStringNonEmpty)(row.release) && !_ReleaseService.default.isNonRelease(row.release);
  }
  const matchesFilters = Object.keys(state.s3Files.filters).every(col => {
    if (col === 'name') {
      return !state.s3Files.filters.name.length || row.name.includes(state.s3Files.filters.name);
    }
    return !state.s3Files.filters[col].length || state.s3Files.filters[col].includes(row[col]);
  });
  return matchesFilters && allowValue;
};
const getS3FilesFilteredFileCount = state => {
  const filtered = state.s3Files.validValues.filter(getS3FilesFilterFunction(state));
  return filtered.length;
};
const calcS3FilesSummaryState = (previousState, action) => {
  const newState = _extends({}, previousState);
  const s3FilesIdx = newState.requiredSteps.findIndex(step => step.key === 's3Files');
  // If we didn't already update the total size then recalculate it
  if (action.type !== 'setIndividualS3FileSelected') {
    newState.s3Files.totalSize = newState.s3Files.value.map(id => newState.s3Files.bytesByUrl[id]).reduce((a, b) => a + b, 0);
  }
  // Step is only complete when there's a selection that's not too big
  newState.s3Files.estimatedPostSize = estimatePostSize(newState.s3Files, newState.sites);
  newState.s3Files.isValid = newState.s3Files.value.length > 0 && newState.s3Files.estimatedPostSize < _manifestUtil.MAX_POST_BODY_SIZE;
  newState.requiredSteps[s3FilesIdx].isComplete = newState.s3Files.isValid;
  newState.allStepsComplete = newState.requiredSteps.every(step => step.isComplete || step.isComplete === null);
  return newState;
};

// Generate a new full state object with a new value and isValid boolean for the
// s3Files key. This is separate from other keys supported by getAndValidateNewState
// because of the few discrete ways to update s3Files state and the common side
// effects / validation all of those ways require.
const getAndValidateNewS3FilesState = function (previousState, action) {
  let broadcast = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  const s3FilesIdx = previousState.requiredSteps.findIndex(step => step.key === 's3Files');
  if (s3FilesIdx === -1) {
    return previousState;
  }
  const newState = _extends({}, previousState, {
    broadcast
  });
  let fileIdx = 0;

  // Set value and reflect back onto validValues as "checked" for material table if necessary.
  switch (action.type) {
    case 'setValueFromUpdatedValidValues':
      if (!newStateIsAllowable(action.key, action.value)) {
        return newState;
      }
      newState.s3Files.value = action.value;
      newState.s3Files.valueMap = {};
      if ((0, _typeUtil.existsNonEmpty)(newState.s3Files.value)) {
        newState.s3Files.value.forEach(value => {
          newState.s3Files.valueMap[value] = true;
        });
      }
      break;
    case 'setValidatableValue':
      if (!newStateIsAllowable(action.key, action.value)) {
        return newState;
      }
      newState.s3Files.value = action.value;
      newState.s3Files.valueMap = {};
      if ((0, _typeUtil.existsNonEmpty)(newState.s3Files.value)) {
        newState.s3Files.value.forEach(value => {
          newState.s3Files.valueMap[value] = true;
        });
      }
      newState.s3Files.validValues.forEach((file, idx) => {
        newState.s3Files.validValues[idx].tableData.checked = newState.s3Files.valueMap[file.url] || false;
      });
      break;
    case 'setS3FilesValueSelectAll':
      newState.s3Files.value = newState.s3Files.validValues.map(file => file.url);
      newState.s3Files.valueMap = {};
      if ((0, _typeUtil.existsNonEmpty)(newState.s3Files.value)) {
        newState.s3Files.value.forEach(value => {
          newState.s3Files.valueMap[value] = true;
        });
      }
      newState.s3Files.validValues.forEach((file, idx) => {
        newState.s3Files.validValues[idx].tableData.checked = true;
      });
      break;
    case 'setS3FilesValueSelectNone':
      newState.s3Files.value = [];
      newState.s3Files.valueMap = {};
      newState.s3Files.validValues.forEach((file, idx) => {
        newState.s3Files.validValues[idx].tableData.checked = false;
      });
      break;
    case 'setS3FilesValueSelectFiltered':
      newState.s3Files.value = newState.s3Files.validValues.filter(getS3FilesFilterFunction(newState)).map(file => file.url);
      newState.s3Files.valueMap = {};
      if ((0, _typeUtil.existsNonEmpty)(newState.s3Files.value)) {
        newState.s3Files.value.forEach(value => {
          newState.s3Files.valueMap[value] = true;
        });
      }
      newState.s3Files.validValues.forEach((file, idx) => {
        newState.s3Files.validValues[idx].tableData.checked = newState.s3Files.valueMap[file.url] || false; // eslint-disable-line max-len
      });
      break;
    case 'setIndividualS3FileSelected':
      fileIdx = newState.s3Files.validValues.findIndex(file => file.url === action.url);
      if (fileIdx === -1) {
        return newState;
      }
      newState.s3Files.validValues[fileIdx].tableData.checked = action.selected;
      // When doing one file at a time we don't have to recalculate the total size,
      // just add/subtract the size of the file specified
      if (action.selected) {
        newState.s3Files.value.push(action.url);
        newState.s3Files.valueMap[action.url] = true;
        newState.s3Files.totalSize += newState.s3Files.bytesByUrl[action.url];
      } else {
        if (newState.s3Files.value.indexOf(action.url) === -1) {
          return newState;
        }
        newState.s3Files.value.splice(newState.s3Files.value.indexOf(action.url), 1);
        delete newState.s3Files.valueMap[action.url];
        newState.s3Files.totalSize -= newState.s3Files.bytesByUrl[action.url];
      }
      break;
    default:
      return newState;
  }
  return calcS3FilesSummaryState(newState, action);
};

// Generate new s3Files.validValues and s3Files filter values in state.
//
// s3Files.validValues is the list of files we actually show in the s3Files table, as opposed to
// the list of all files fetched ever (s3Files.cachedValues). We can only show what has been
// fetched, but also only want to show what is in bounds for the site and date range selections.
// This distinction becomes important, say, if a user selects a broad range of sites/dates and
// then narrows it back down prior to file selection. Once the full range is fetched and cached
// the table should still only show what's in scope for the current sites and date range.
//
// There are also keys in s3Files relating to filter state on the table. Regenerate all of that
// for the same site/dateRange scope consistency reasons. This may mean some filter selections
// are changed (e.g. by removing selections for values that are no longer present in the table).
//
// This function may also cascade into adjusting s3Files.value by removing files no longer in
// scope, but does that through getAndValidateNewS3FilesState().
const regenerateS3FilesFiltersAndValidValues = state => {
  if (!state.requiredSteps.some(step => step.key === 's3Files')) {
    return state;
  }
  const updated = _extends({}, state);
  updated.s3Files.validValues = [];
  if (!updated.sites.isValid || !updated.dateRange.isValid) {
    const action = {
      key: 's3Files',
      type: 'setValueFromUpdatedValidValues',
      value: []
    };
    return getAndValidateNewS3FilesState(updated, action, updated.broadcast);
  }
  // Generate new validValues as a subset of cachedValues in scope of sites and dateRange.
  // Use the current selections in s3Files.value to add tableData to each validValue record.
  // This is what Material Table looks for to render a checked box for the row.
  updated.s3Files.cachedValues = updated.s3Files.cachedValues.map(file => _extends({}, file, {
    tableData: {
      checked: false
    }
  }));
  updated.s3Files.validValues = updated.s3Files.cachedValues.filter(file => updated.sites.value.includes(file.site) && updated.dateRange.value[0] <= file.yearMonth && file.yearMonth <= updated.dateRange.value[1]).map(file => _extends({}, file, {
    tableData: {
      checked: updated.s3Files.valueMap[file.url] || false
    }
  }));
  const filterKeys = Object.keys(updated.s3Files.valueLookups || {});
  filterKeys.forEach(key => {
    updated.s3Files.valueLookups[key] = {};
  });
  updated.s3Files.validValues.forEach(file => {
    filterKeys.forEach(lookup => {
      if (typeof file[lookup] === 'undefined') {
        return;
      }
      updated.s3Files.valueLookups[lookup][file[lookup]] = file[lookup] || '(none)';
    });
  });
  filterKeys.forEach(key => {
    updated.s3Files.filters[key] = updated.s3Files.filters[key].filter(filterVal => Object.keys(updated.s3Files.valueLookups[key]).includes(filterVal));
  });
  updated.s3Files.filteredFileCount = getS3FilesFilteredFileCount(updated);
  // Create an action to send to the reducer helper to set an updated value and revalidate.
  const action = {
    key: 's3Files',
    type: 'setValueFromUpdatedValidValues',
    value: updated.s3Files.validValues.filter(file => file.tableData.checked).map(file => file.url)
  };
  return getAndValidateNewS3FilesState(updated, action, updated.broadcast);
};

// Generate a new full state object with a new value and isValid boolean for a
// specific key. Only intended for a specific white list of state values with
// a common { value, validValues, isValid } structure. If new value is not
// "allowable" (see newStateIsAllowable and newStateIsValid definitions) then
// no action is taken.
const getAndValidateNewState = function (previousState, action) {
  let broadcast = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (!VALIDATABLE_STATE_KEYS.includes(action.key)) {
    return previousState;
  }
  if (!newStateIsAllowable(action.key, action.value)) {
    return previousState;
  }
  // s3Files is validatable state but special enough to get its own state generator
  if (action.key === 's3Files') {
    return getAndValidateNewS3FilesState(previousState, action, broadcast);
  }
  let newState = _extends({}, previousState, {
    broadcast
  });
  const valueIsValid = newStateIsValid(action.key, action.value, previousState[action.key].validValues);
  newState[action.key] = _extends({}, previousState[action.key], {
    value: action.value,
    isValid: valueIsValid
  });
  const hasProvDataStep = newState.requiredSteps.some(step => step.key === 'provisionalData');
  const hasS3FilesStep = newState.requiredSteps.some(step => step.key === 's3Files');
  if (hasProvDataStep && hasS3FilesStep && action.key === 'provisionalData') {
    if (action.value === 'exclude') {
      // Go through validValues, uncheck any provisional when set to exclude
      if ((0, _typeUtil.existsNonEmpty)(newState.s3Files.validValues)) {
        newState.s3Files.value = [];
        newState.s3Files.valueMap = {};
        newState.s3Files.validValues = newState.s3Files.validValues.map(value => {
          const isProv = _ReleaseService.default.isProv(value.release);
          if (isProv) {
            return _extends({}, value, {
              tableData: _extends({}, value.tableData, {
                checked: false
              })
            });
          }
          if (value.tableData.checked) {
            newState.s3Files.value.push(value.url);
            newState.s3Files.valueMap[value.url] = true;
          }
          return value;
        });
        newState = calcS3FilesSummaryState(newState, action);
      }
    }
    newState.s3Files.filteredFileCount = getS3FilesFilteredFileCount(newState);
  }
  newState.requiredSteps = previousState.requiredSteps.map(step => {
    const requiredStateKeys = ALL_STEPS[step.key] ? ALL_STEPS[step.key].requiredStateKeys : [];
    return step.isComplete === null ? _extends({}, step) : _extends({}, step, {
      isComplete: requiredStateKeys.every(key => newState[key].isValid)
    });
  });
  newState.allStepsComplete = newState.requiredSteps.every(step => step.isComplete || step.isComplete === null);
  // Trigger a new manifest request for file size estimate if this update warrants it
  if (previousState.fromManifest && MANIFEST_TRIGGERING_STATE_KEYS.includes(action.key) && broadcast) {
    newState.manifest.status = 'awaitingFetchCall';
  }
  // Step Dependency - if setting sites and date range and s3Files is a required
  // step then:
  // 1. Trigger new s3 file fetches as needed
  // 2. Regenerate s3Files.validValues
  if (['sites', 'dateRange'].includes(action.key) && previousState.fromAOPManifest) {
    Object.keys(previousState.s3FileFetches).filter(key => ['notRequested', 'error'].includes(previousState.s3FileFetches[key])).filter(key => {
      const site = key.substr(0, 4);
      const yearMonth = key.substr(5, 7);
      return newState.sites.value.includes(site) && newState.dateRange.value[0] <= yearMonth && yearMonth <= newState.dateRange.value[1];
    }).forEach(key => {
      newState.s3FileFetches[key] = 'awaitingFetchCall';
    });
    return regenerateS3FilesFiltersAndValidValues(newState);
  }
  return newState;
};

// REDUCER
const reducer = (state, action) => {
  let newState = {};
  const getStateFromHigherOrderState = newHigherOrderState => HIGHER_ORDER_TRANSFERABLE_STATE_KEYS.reduce((higherOrderState, stateKey) => {
    const newValue = mutateNewStateIntoRange(stateKey, newHigherOrderState[stateKey].value, state[stateKey].validValues);
    const newAction = {
      key: stateKey,
      value: newValue
    };
    return getAndValidateNewState(higherOrderState, newAction);
  }, state);
  switch (action.type) {
    // Action for setting state from higher order state
    case 'setFromHigherOrderState':
      if (!state.dialogOpen) {
        return _extends({}, state, {
          cachedHigherOrderState: action.newHigherOrderState,
          awaitingHigherOrderUpdateWhenDialogOpens: true
        });
      }
      return getStateFromHigherOrderState(action.newHigherOrderState);

    // Action for toggling the download dialog's visibility
    case 'setDialogOpen':
      if (action.open && state.awaitingHigherOrderUpdateWhenDialogOpens) {
        return _extends({}, getStateFromHigherOrderState(state.cachedHigherOrderState), {
          awaitingHigherOrderUpdateWhenDialogOpens: false,
          cachedHigherOrderState: {},
          dialogOpen: action.open
        });
      }
      return _extends({}, state, {
        dialogOpen: action.open
      });
    case 'setBroadcastDone':
      return _extends({}, state, {
        broadcast: false
      });

    // Action for setting productData. Applies new valid values to all selection keys.
    case 'setProductData':
      return getInitialStateFromProps({
        productData: action.productData
      });

    // Actions for dealing with size estimate fetching
    case 'setFetchManifestCalled':
      return _extends({}, state, {
        manifest: {
          status: 'fetching',
          body: null,
          sizeEstimate: null,
          error: null
        }
      });
    case 'setFetchManifestSucceeded':
      if (!Number.isInteger(action.sizeEstimate) || action.sizeEstimate < 0) {
        return _extends({}, state, {
          manifest: {
            status: 'no-data',
            body: null,
            sizeEstimate: null,
            error: 'NaN'
          }
        });
      }
      return _extends({}, state, {
        manifest: {
          status: 'fetched',
          body: action.body,
          sizeEstimate: action.sizeEstimate,
          error: null
        }
      });
    case 'setFetchManifestFailed':
      return _extends({}, state, {
        manifest: {
          status: 'error',
          body: null,
          sizeEstimate: null,
          error: action.error
        }
      });
    case 'setManifestStatus':
      return _extends({}, state, {
        manifest: {
          status: action.status,
          body: null,
          sizeEstimate: null,
          error: action.error
        }
      });

    // Action for setting state keys that are dynamically validated (sites, dateRange, etc.)
    case 'setValidatableValue':
      return getAndValidateNewState(state, action, true);

    // Action for setting an individual filter value for the presentation of s3 files
    case 'setS3FilesFilterValue':
      newState = _extends({}, state);
      if (!action.value && newState.s3Files.filters[action.filter]) {
        delete newState.s3Files.filters[action.filter];
      } else {
        newState.s3Files.filters[action.filter] = action.value;
      }
      newState.s3Files.filteredFileCount = getS3FilesFilteredFileCount(newState);
      newState.s3Files.lastFilterChanged = action.filter;
      return newState;

    // Action for clearing all filter values for the presentation of s3 files
    case 'clearS3FilesFilterValues':
      newState = _extends({}, state);
      Object.keys(newState.s3Files.filters).forEach(filter => {
        newState.s3Files.filters[filter] = filter === 'name' ? '' : [];
      });
      newState.s3Files.filteredFileCount = 0;
      return newState;

    // Action for setting visible columns for the presentation of s3 files
    case 'setS3FilesVisibleColumns':
      newState = _extends({}, state);
      newState.s3Files.visibleColumns = action.visibleColumns;
      return newState;

    // Action for updating progress value for an ongoing batch of s3 file fetches
    case 'setS3FileFetchesProgress':
      return _extends({}, state, {
        s3FileFetchProgress: action.value
      });

    // Action for handling the response from an s3 files fetch:
    // 1. Append to cachedValues
    // 2. Regenerate filter and validValues from cachedValues and sites / date range values
    case 'setS3FileFetchesCompleted':
      newState = _extends({}, state, {
        s3FileFetchProgress: 0
      });
      action.value.forEach(response => {
        newState.s3FileFetches["".concat(response.site, ".").concat(response.yearMonth)] = 'fetched';
        const files = response.files.map(fileObj => {
          const file = {
            release: response.release || '',
            productCode: response.productCode,
            name: fileObj.name,
            size: parseInt(fileObj.size, 10),
            url: fileObj.url,
            checksum: fileObj.md5 ? fileObj.md5 : fileObj.crc32c,
            checksumAlgorithm: fileObj.md5 ? 'MD5' : 'CRC32C',
            site: response.site,
            yearMonth: response.yearMonth,
            tableData: {
              checked: false
            }
          };
          // Set additional file attributes from S3 regex capture groups
          Object.keys(S3_PATTERN).forEach(key => {
            const capture = fileObj[key].match(S3_PATTERN[key].regex);
            if (capture) {
              S3_PATTERN[key].groups.forEach((group, groupIdx) => {
                file[group] = capture[groupIdx + 1] || null;
              });
            }
          });
          // Cache file attributes by url:
          // file size fast summing, url for building final download request
          newState.s3Files.bytesByUrl[file.url] = file.size;
          // If new unique values are present add them to the s3File value lookups
          Object.keys(newState.s3Files.valueLookups).forEach(lookup => {
            if (typeof file[lookup] === 'undefined') {
              return;
            }
            newState.s3Files.valueLookups[lookup][file[lookup]] = file[lookup] || '(none)';
          });
          return file;
        });
        newState.s3Files.cachedValues = newState.s3Files.cachedValues.concat(files);
      });
      return regenerateS3FilesFiltersAndValidValues(newState);

    // Action for setting all fetch statuses to 'fetching' for a list of fetch keys
    case 'setS3FileFetchesCalled':
      newState = _extends({}, state, {
        s3FileFetchProgress: 0
      });
      action.keys.forEach(key => {
        newState.s3FileFetches[key] = 'fetching';
      });
      return newState;

    // S3 Files update actions
    case 'setS3FilesValueSelectAll':
    case 'setS3FilesValueSelectNone':
    case 'setS3FilesValueSelectFiltered':
    case 'setIndividualS3FileSelected':
      return getAndValidateNewS3FilesState(state, action, true);

    // Actions for setting state on the availability chart
    case 'setAvailabilityView':
      newState = _extends({}, state);
      if (!AVAILABILITY_VIEW_MODES.includes(action.value)) {
        return newState;
      }
      newState.availabilityView = action.value;
      return newState;

    // Fallback
    default:
      return state;
  }
};

/**
 * Wrapped reducer function
 * @param {*} state The state.
 * @param {*} action An action.
 * @returns the new state.
 */
const wrappedReducer = (state, action) => reducer(state, action);

// CONTEXT
const Context = /*#__PURE__*/(0, _react.createContext)(DEFAULT_STATE);

// HOOK
const useDownloadDataState = () => {
  const hookResponse = (0, _react.useContext)(Context);
  if (hookResponse.length !== 2) {
    return [_extends({}, DEFAULT_STATE, {
      requiredSteps: [],
      downloadContextIsActive: false
    }), () => {}];
  }
  return hookResponse;
};

// OBSERVABLES
// Observable and getter for sharing whole state through a higher order component
const stateSubject$ = new _rxjs.Subject();
const getStateObservable = () => stateSubject$.asObservable();
// Observables and getters for making and canceling manifest requests
const manifestCancelation$ = new _rxjs.Subject();
const getManifestAjaxObservable = request => _NeonApi.default.postJsonObservable(request.url, request.body, null, false);

/**
 * Defines a lookup of state key to a boolean
 * designating whether or not that instance of the context
 * should pull the state from the session storage and restore.
 * Keeping this lookup outside of the context provider function
 * as to not incur lifecycle interference by storing with useState.
 */
const restoreStateLookup = {};

// Provider
const Provider = props => {
  const {
    downloadDataContextUniqueId,
    stateObservable,
    children
  } = props;

  // get the initial state from storage if present, else get from props.
  let initialState = getInitialStateFromProps(props);
  const {
    productCode: product
  } = initialState.productData;
  const stateKey = "downloadDataContextState-".concat(product, "-").concat(downloadDataContextUniqueId);
  if (typeof restoreStateLookup[stateKey] === 'undefined') {
    restoreStateLookup[stateKey] = true;
  }
  const shouldRestoreState = restoreStateLookup[stateKey];
  const stateStorage = (0, _StateStorageService.default)(stateKey);
  const savedState = stateStorage.readState();
  if (savedState && shouldRestoreState) {
    restoreStateLookup[stateKey] = false;
    stateStorage.removeState();
    initialState = (0, _StateStorageConverter.convertAOPInitialState)(savedState, initialState);
  }
  const [state, dispatch] = (0, _react.useReducer)(wrappedReducer, initialState);
  const {
    downloadContextIsActive,
    dialogOpen
  } = state;

  // The current sign in process uses a separate domain. This function
  // persists the current state in storage when the button is clicked
  // so the state may be reloaded when the page is reloaded after sign
  // in.
  (0, _react.useEffect)(() => {
    const subscription = _NeonSignInButtonState.default.getObservable().subscribe({
      next: () => {
        if (!downloadContextIsActive || !dialogOpen) return;
        restoreStateLookup[stateKey] = false;
        stateStorage.saveState((0, _StateStorageConverter.convertStateForStorage)(state));
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [downloadContextIsActive, dialogOpen, state, stateKey, stateStorage]);

  // Create an observable for manifests requests and subscribe to it to execute
  // the manifest fetch and dispatch results when updated.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const manifestRequest$ = new _rxjs.Subject();
  manifestRequest$.subscribe(request => getManifestAjaxObservable(request).pipe((0, _rxjs.switchMap)(resp => (0, _rxjs.of)(request.body ? resp.response : resp)), (0, _rxjs.takeUntil)(manifestCancelation$)).subscribe({
    next: resp => dispatch({
      type: 'setFetchManifestSucceeded',
      body: resp,
      sizeEstimate: (0, _manifestUtil.getSizeEstimateFromManifestRollupResponse)(resp)
    }),
    error: err => dispatch({
      type: 'setFetchManifestFailed',
      error: err
    })
  }));
  const handleFetchS3Files = currentState => {
    const {
      productCode
    } = currentState.productData;
    const keys = Object.keys(currentState.s3FileFetches).filter(key => currentState.s3FileFetches[key] === 'awaitingFetchCall');
    if (!keys.length) {
      return;
    }
    dispatch({
      type: 'setS3FileFetchesCalled',
      keys
    });
    const observable = (0, _rxUtil.forkJoinWithProgress)(keys.map(key => {
      const site = key.substr(0, 4);
      const yearMonth = key.substr(5, 7);
      const release = currentState.release && currentState.release.value ? currentState.release.value : null;
      return _NeonApi.default.getJsonObservable((0, _manifestUtil.buildS3FilesRequestUrl)(productCode, site, yearMonth, release)).pipe((0, _rxjs.map)(response => ({
        status: 'fetched',
        files: response.data.files,
        release: response.data.release,
        site,
        yearMonth,
        productCode
      })), (0, _rxjs.catchError)(() => ({
        status: 'error',
        files: [],
        site,
        yearMonth,
        productCode
      })));
    }));
    observable.pipe((0, _rxjs.mergeMap)(_ref => {
      let [finalResult, progress] = _ref;
      return (0, _rxjs.merge)(progress.pipe((0, _rxjs.tap)(value => dispatch({
        type: 'setS3FileFetchesProgress',
        value
      })), (0, _rxjs.ignoreElements)()), finalResult);
    })).subscribe(value => dispatch({
      type: 'setS3FileFetchesCompleted',
      value
    }));
  };

  // If the state was instantiated with a higher-order context observable passed
  // in through props: subscribe to that observable ONLY ONE TIME.
  (0, _react.useEffect)(() => {
    if (typeof stateObservable !== 'function') {
      return;
    }
    stateObservable().subscribe(newHigherOrderState => {
      dispatch({
        type: 'setFromHigherOrderState',
        newHigherOrderState
      });
    });
  }, [stateObservable]);

  // When the state has changed such that it needs to broadcast itself to anything
  // listening: do the broadcast.
  (0, _react.useEffect)(() => {
    if (state.broadcast) {
      stateSubject$.next(state);
      dispatch({
        type: 'setBroadcastDone'
      });
    }
  }, [state]);

  // When state has changed such that a new manifest should be fetched:
  // Process state into a new manifest request and fetch it, canceling any other
  // fetches that may be in progress for this context.
  (0, _react.useEffect)(() => {
    if (!state.fromManifest || state.manifest.status !== 'awaitingFetchCall') {
      return;
    }
    // Cancel any in-progress manifest fetch
    manifestCancelation$.next(true);
    const config = (0, _manifestUtil.buildManifestConfig)(state, ALL_POSSIBLE_VALID_PACKAGE_TYPE[0]);
    if (config.isError && config.errorMessage) {
      dispatch({
        type: 'setManifestStatus',
        status: 'invalid-config',
        error: config.errorMessage
      });
    } else {
      dispatch({
        type: 'setFetchManifestCalled'
      });
      const manifestURL = (0, _manifestUtil.buildManifestRequestUrl)(config, true);
      const manifestBody = (0, _manifestUtil.buildManifestRequestBody)(config);
      manifestRequest$.next({
        url: manifestURL,
        body: manifestBody
      });
    }
  }, [state, manifestRequest$]);

  // If the state has changed such that new fetches for s3 files are expected:
  // generate those fetches.
  (0, _react.useEffect)(() => {
    if (Object.values(state.s3FileFetches).some(status => status === 'awaitingFetchCall')) {
      handleFetchS3Files(state);
    }
  }, [state]);
  return (
    /*#__PURE__*/
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    _react.default.createElement(Context.Provider, {
      value: [state, dispatch]
    }, children)
  );
};
Provider.propTypes = {
  downloadDataContextUniqueId: _propTypes.default.number,
  stateObservable: _propTypes.default.func,
  productData: _propTypes.default.shape({
    productCode: _propTypes.default.string.isRequired,
    productName: _propTypes.default.string.isRequired,
    siteCodes: _propTypes.default.arrayOf(_propTypes.default.shape({
      siteCode: _propTypes.default.string.isRequired,
      availableMonths: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
      availableReleases: _propTypes.default.arrayOf(_propTypes.default.shape({
        release: _propTypes.default.string.isRequired,
        availableMonths: _propTypes.default.arrayOf(_propTypes.default.string).isRequired
      }))
    }))
  }),
  /* eslint-disable react/no-unused-prop-types */
  availabilityView: _propTypes.default.oneOf(AVAILABILITY_VIEW_MODES),
  release: _propTypes.default.string,
  sites: _propTypes.default.arrayOf(_propTypes.default.string),
  dateRange: _propTypes.default.arrayOf(_propTypes.default.string),
  documentation: _propTypes.default.oneOf(ALL_POSSIBLE_VALID_DOCUMENTATION),
  packageType: _propTypes.default.oneOf(ALL_POSSIBLE_VALID_PACKAGE_TYPE),
  provisionalData: _propTypes.default.oneOf(ALL_POSSIBLE_VALID_PROVISIONAL_DATA),
  /* eslint-enable react/no-unused-prop-types */
  children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string])), _propTypes.default.node, _propTypes.default.string]).isRequired
};
Provider.defaultProps = {
  downloadDataContextUniqueId: 0,
  stateObservable: null,
  productData: {},
  availabilityView: DEFAULT_STATE.availabilityView,
  release: DEFAULT_STATE.release.value,
  sites: DEFAULT_STATE.sites.value,
  dateRange: DEFAULT_STATE.dateRange.value,
  documentation: DEFAULT_STATE.documentation.value,
  packageType: DEFAULT_STATE.packageType.value,
  provisionalData: DEFAULT_STATE.provisionalData.value
};
const DownloadDataContext = {
  Provider,
  useDownloadDataState,
  reducer,
  DEFAULT_STATE,
  ALL_STEPS,
  getStateObservable
};
var _default = exports.default = DownloadDataContext; // Additional items exported for unit testing
const getTestableItems = () => process.env.NODE_ENV !== 'test' ? {} : {
  productDataIsValid,
  yearMonthIsValid,
  newStateIsAllowable,
  newStateIsValid,
  mutateNewStateIntoRange,
  estimatePostSize,
  getValidValuesFromProductData,
  getInitialStateFromProps,
  getS3FilesFilteredFileCount,
  getAndValidateNewS3FilesState,
  regenerateS3FilesFiltersAndValidValues,
  getAndValidateNewState,
  ALL_POSSIBLE_VALID_DATE_RANGE,
  ALL_POSSIBLE_VALID_DOCUMENTATION,
  ALL_POSSIBLE_VALID_PACKAGE_TYPE,
  ALL_POSSIBLE_VALID_PROVISIONAL_DATA
};
exports.getTestableItems = getTestableItems;