'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _rxjs = require('rxjs');

var _ajax = require('rxjs/ajax');

var _operators = require('rxjs/operators');

var _ExternalHost = require('../ExternalHost/ExternalHost');

var _ExternalHost2 = _interopRequireDefault(_ExternalHost);

var _manifestUtil = require('../../util/manifestUtil');

var _sites = require('../../static/sites/sites.json');

var _sites2 = _interopRequireDefault(_sites);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint-disable max-len, no-unused-vars */

var ALL_POSSIBLE_VALID_SITES = Object.keys(_sites2.default);

var ALL_POSSIBLE_VALID_DATE_RANGE = ['2010-01', (0, _moment2.default)().format('YYYY-MM')];

var ALL_POSSIBLE_VALID_DOCUMENTATION = ['include', 'exclude'];
var ALL_POSSIBLE_VALID_PACKAGE_TYPE = ['basic', 'expanded'];

var AVAILABILITY_VIEW_MODES = ['summary', 'sites', 'states', 'domains'];

var ALL_STEPS = {
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
var DEFAULT_REQUIRED_STEPS = [{ key: 'sitesAndDateRange', isComplete: false }, { key: 'documentation', isComplete: true }, { key: 'packageType', isComplete: false }, { key: 'policies', isComplete: false }, { key: 'summary', isComplete: null }];

var DEFAULT_STATE = {
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
  availabilityView: 'summary',
  availabilitySelectionExpanded: false,
  s3FileFetches: {}, // Where we keep individual fetch status for each site+yearMonth
  s3FileFetchProgress: 0, // Number to track progress of batch fetches for s3 files
  s3Files: {
    value: [],
    cachedValues: [], // Where all fetched file records are cached
    validValues: [], // Subset of cached values in scope of current sites and date range values
    isValid: false,
    bytesById: {}, // A mapping of id to file size for fast summing of total download size
    urlsById: {}, // A mapping of id to url for building the final file list download request
    totalSize: 0,
    estimatedPostSize: 0, // For disabling download button above a threshold per POST API limitation
    filteredFileCount: 0, // A cached count of files present when current filters are applied
    filters: { // Where we cache material table filter state for reinjection on full rerender
      site: [],
      type: [],
      visit: [],
      yearMonth: []
    },
    valueLookups: { // Where we cache unique values in validValues for table filters
      site: {},
      type: {},
      visit: {},
      yearMonth: {}
    },
    visibleColumns: ['site', 'visit', 'date', 'name', 'type']
  },
  sites: {
    value: [],
    validValues: [].concat(_toConsumableArray(ALL_POSSIBLE_VALID_SITES)),
    isValid: false
  },
  dateRange: {
    value: [].concat(ALL_POSSIBLE_VALID_DATE_RANGE),
    validValues: [].concat(ALL_POSSIBLE_VALID_DATE_RANGE),
    isValid: false
  },
  documentation: {
    value: 'include',
    validValues: [].concat(ALL_POSSIBLE_VALID_DOCUMENTATION),
    isValid: true
  },
  packageType: {
    value: null,
    validValues: [].concat(ALL_POSSIBLE_VALID_PACKAGE_TYPE),
    isValid: false
  },
  policies: {
    value: false,
    validValues: null,
    isValid: false
  }
};

// State keys that have a common { value, validValues, isValid } shape and can be validated
var VALIDATABLE_STATE_KEYS = ['sites', 'dateRange', 'documentation', 'packageType', 's3Files', 'policies'];

// State keys that can be transfered between contexts through higher order state
// (must be a subset of VALIDATABLE_STATE_KEYS)
var HIGHER_ORDER_TRANSFERABLE_STATE_KEYS = ['sites', 'dateRange'];

// State keys that should trigger a new manifest (file size estimate) request when updated
// (must be a subset of VALIDATABLE_STATE_KEYS)
var MANIFEST_TRIGGERING_STATE_KEYS = ['sites', 'dateRange', 'documentation', 'packageType'];

// Regexes and associated capture group names for parse s3 file names and URLs
var S3_PATTERN = {
  name: {
    regex: /^([\w\\(\\)._-]+)\.(\w+)$/,
    groups: ['name', 'type']
  },
  url: {
    regex: /^.*\/(\w+)\/\w+_(\d+)\/(\w+)\/\w+\/\w+(?:\/\w+)*\/[\w\\(\\)._-]+\.\w+$/,
    groups: ['domain', 'visit', 'level']
  }
};

/**
   VALIDATOR FUNCTIONS
*/
// Naive check, replace with a more robust JSON schema check
var productDataIsValid = function productDataIsValid(productData) {
  return (typeof productData === 'undefined' ? 'undefined' : _typeof(productData)) === 'object' && productData !== null && typeof productData.productName === 'string' && Array.isArray(productData.siteCodes);
};

var yearMonthIsValid = function yearMonthIsValid() {
  var yearMonth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var match = yearMonth.match(/^([\d]{4})-([\d]{2})$/);
  if (!match) {
    return false;
  }
  var year = parseInt(match[1], 10);
  var month = parseInt(match[2], 10);
  var maxYear = new Date().getFullYear() + 1;
  return year >= 2010 && year <= maxYear && month >= 1 && month <= 12;
};

// Check whether a new state value is "allowable" - as in it may not be *valid*
// to build a manifest, but it can be applied to state as components that use
// this state to render a form will render it correctly.
var newStateIsAllowable = function newStateIsAllowable(key, value) {
  switch (key) {
    case 'sites':
      return Array.isArray(value) && value.every(function (site) {
        return ALL_POSSIBLE_VALID_SITES.includes(site);
      });
    case 'dateRange':
      return Array.isArray(value) && value.length === 2 && yearMonthIsValid(value[0]) && yearMonthIsValid(value[1]) && value[0] >= ALL_POSSIBLE_VALID_DATE_RANGE[0] && value[1] <= ALL_POSSIBLE_VALID_DATE_RANGE[1];
    case 'documentation':
      return ALL_POSSIBLE_VALID_DOCUMENTATION.includes(value) || value === null;
    case 'packageType':
      return ALL_POSSIBLE_VALID_PACKAGE_TYPE.includes(value) || value === null;
    case 's3Files':
      return Array.isArray(value) && value.every(function (id) {
        return typeof id === 'string';
      });
    case 'policies':
      return value === true;
    default:
      return false;
  }
};

// Check whether a new state value is "valid" - as in it is within the requirements
// to be used in building a download manifest.
var newStateIsValid = function newStateIsValid(key, value) {
  var validValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (!VALIDATABLE_STATE_KEYS.includes(key)) {
    return false;
  }
  var idList = [];
  switch (key) {
    case 'sites':
      return Array.isArray(value) && Array.isArray(validValues) && value.length > 0 && value.every(function (site) {
        return validValues.includes(site);
      });
    case 'dateRange':
      return Array.isArray(value) && value.length === 2 && Array.isArray(validValues) && validValues.length === 2 && yearMonthIsValid(value[0]) && yearMonthIsValid(value[1]) && yearMonthIsValid(validValues[0]) && yearMonthIsValid(validValues[1]) && value[0] >= validValues[0] && value[1] <= validValues[1];
    case 's3Files':
      idList = validValues.map(function (fileObj) {
        return fileObj.id;
      });
      return Array.isArray(value) && value.length > 0 && value.every(function (id) {
        return idList.includes(id);
      });
    case 'policies':
      return value === true;
    default:
      return validValues.includes(value);
  }
};

var mutateNewStateIntoRange = function mutateNewStateIntoRange(key, value) {
  var validValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (newStateIsValid(key, value, validValues)) {
    return value;
  }
  var valueIsAllowable = newStateIsAllowable(key, value);
  var valueIsDefault = false;
  switch (key) {
    case 'sites':
      return valueIsAllowable ? value.filter(function (site) {
        return validValues.includes(site);
      }) : [];
    case 'dateRange':
      valueIsDefault = valueIsAllowable && value[0] === ALL_POSSIBLE_VALID_DATE_RANGE[0] && value[1] === ALL_POSSIBLE_VALID_DATE_RANGE[1];
      return valueIsAllowable || valueIsDefault ? [value[0] < validValues[0] ? validValues[0] : value[0], value[1] > validValues[0] ? validValues[1] : value[1]] : validValues;
    default:
      return valueIsAllowable ? value : DEFAULT_STATE[key].value;
  }
};

/**
   Estimate a POST body size from a sile list and sites list for s3Files-based
   downloads. Numbers here are based on the current POST API and what it requires
   for form data keys, which is excessively verbose.
*/
var estimatePostSize = function estimatePostSize(s3FilesState, sitesState) {
  var baseLength = 300;
  var sitesLength = sitesState.value.length * 62;
  var filesLength = s3FilesState.value.map(function (id) {
    return s3FilesState.urlsById[id];
  }).reduce(function (a, b) {
    return a + encodeURIComponent(b).length + 58;
  }, 0);
  return baseLength + sitesLength + filesLength;
};

/**
   GETTER FUNCTIONS
*/
var getValidValuesFromProductData = function getValidValuesFromProductData(productData, key) {
  switch (key) {
    case 'sites':
      return productData.siteCodes.map(function (s) {
        return s.siteCode;
      }) || [];
    case 'dateRange':
      return (productData.siteCodes || []).reduce(function (acc, site) {
        if (!Array.isArray(site.availableMonths) || !site.availableMonths.length) {
          return acc;
        }
        var start = site.availableMonths[0];
        var end = site.availableMonths[site.availableMonths.length - 1];
        return [acc[0] === null || acc[0] > start ? start : acc[0], acc[1] === null || acc[1] < end ? end : acc[1]];
      }, [null, null]);
    case 'documentation':
      return [].concat(ALL_POSSIBLE_VALID_DOCUMENTATION);
    case 'packageType':
      return [].concat(ALL_POSSIBLE_VALID_PACKAGE_TYPE);
    case 'policies':
      return null;
    default:
      return [];
  }
};

// Build initial state from props by first deriving valid values from
// product data (where appropriate) and then mutating prop values into
// range of valid values where appropriate.
var getInitialStateFromProps = function getInitialStateFromProps(props) {
  // Handle base product data
  var productData = props.productData,
      availabilityView = props.availabilityView,
      availabilitySelectionExpanded = props.availabilitySelectionExpanded;

  if (!productDataIsValid(productData)) {
    return _extends({}, DEFAULT_STATE, {
      availabilityView: availabilityView,
      availabilitySelectionExpanded: availabilitySelectionExpanded,
      requiredSteps: []
    });
  }
  var initialState = _extends({}, DEFAULT_STATE, {
    availabilityView: availabilityView,
    availabilitySelectionExpanded: availabilitySelectionExpanded,
    productData: productData
  });

  var isAOPPipeline = ['productScienceTeam', 'productScienceTeamAbbr'].some(function (key) {
    return typeof productData[key] === 'string' && productData[key].includes('AOP');
  }) && (productData.productPublicationFormatType || '').includes('AOP');

  // Set required steps and data download origin booleans
  // Note that a data product can come from the NEON manifest AND an external host
  var requiredSteps = [].concat(DEFAULT_REQUIRED_STEPS);
  var fromManifest = true;
  var fromAOPManifest = false;
  var fromExternalHost = false;
  var externalHost = _ExternalHost2.default.getByProductCode(productData.productCode);
  if (externalHost) {
    switch (externalHost.hostType) {
      case 'EXCLUSIVE_DATA':
        fromManifest = false;
        fromExternalHost = true;
        requiredSteps = [{ key: 'externalExclusive', isComplete: null }];
        break;
      default:
        fromExternalHost = true;
        break;
    }
  } else if (isAOPPipeline) {
    fromManifest = false;
    fromAOPManifest = true;
    requiredSteps = [{ key: 'sitesAndDateRange', isComplete: false }, { key: 's3Files', isComplete: false }, { key: 'documentation', isComplete: true }, { key: 'policies', isComplete: false }, { key: 'summary', isComplete: null }];
  }
  // Remove package type step if product does not offer expanded data
  if (productData.productHasExpanded === false && requiredSteps.some(function (step) {
    return step.key === 'packageType';
  })) {
    requiredSteps.splice(requiredSteps.findIndex(function (step) {
      return step.key === 'packageType';
    }), 1);
  }
  initialState.requiredSteps = requiredSteps;
  initialState.fromManifest = fromManifest;
  initialState.fromAOPManifest = fromAOPManifest;
  initialState.fromExternalHost = fromExternalHost;

  // Set all validatable state keys
  VALIDATABLE_STATE_KEYS.forEach(function (key) {
    var validValues = getValidValuesFromProductData(productData, key);
    var unmutatedValue = props[key] || DEFAULT_STATE[key].value;
    var value = mutateNewStateIntoRange(key, unmutatedValue, validValues);
    var isValid = newStateIsValid(key, value, validValues);
    initialState[key] = _extends({}, DEFAULT_STATE[key], {
      value: value,
      validValues: validValues,
      isValid: isValid
    });
  });

  // If AOP then initialize all s3FileFetches from props
  // ('notRequested' by default, 'awaitingFetchCall' if site + date is already in selection)
  if (isAOPPipeline) {
    initialState.s3FileFetches = productData.siteCodes.reduce(function (acc, site) {
      site.availableMonths.forEach(function (month) {
        acc[site.siteCode + '.' + month] = initialState.sites.value.includes(site.siteCode) && initialState.dateRange.value[0] <= month && initialState.dateRange.value[1] >= month ? 'awaitingFetchCall' : 'notRequested';
      });
      return acc;
    }, {});
  }

  // Mark completed steps from initial values
  initialState.requiredSteps.forEach(function (step, idx) {
    if (initialState.requiredSteps[idx].isComplete === null) {
      return;
    }
    initialState.requiredSteps[idx].isComplete = ALL_STEPS[step.key] && ALL_STEPS[step.key].requiredStateKeys.every(function (key) {
      return initialState[key].isValid;
    });
  });

  // Set allStepsComplete boolean. Ignore steps where isComplete is null
  // as that signifies "n/a" (the step is informational, completion doesn't apply).
  initialState.allStepsComplete = initialState.requiredSteps.every(function (step) {
    return step.isComplete || step.isComplete === null;
  });

  // Done!
  return initialState;
};

// Build an object from state suitable for manifestUtil.buildManifestRequestUrl()
var getManifestURLConfig = function getManifestURLConfig(state) {
  var manifestConfigError = null;
  var manifestURLConfig = {};
  if (!state.productData || !state.productData.productCode) {
    manifestConfigError = 'Invalid data product';
  }
  if (!state.sites.isValid) {
    manifestConfigError = 'No sites selected';
  }
  if (!state.dateRange.isValid) {
    manifestConfigError = 'Invalid date range';
  }
  if (manifestConfigError) {
    return [manifestURLConfig, manifestConfigError];
  }
  manifestURLConfig.productCode = state.productData.productCode;
  manifestURLConfig.sites = state.sites.value;
  manifestURLConfig.dateRange = state.dateRange.value;
  manifestURLConfig.documentation = state.documentation.value === 'include';
  manifestURLConfig.packageType = state.packageType.value || ALL_POSSIBLE_VALID_PACKAGE_TYPE[0];
  return [manifestURLConfig, manifestConfigError];
};

var getS3FilesFilteredFileCount = function getS3FilesFilteredFileCount(state) {
  return state.s3Files.validValues.filter(function (row) {
    return Object.keys(state.s3Files.filters).every(function (col) {
      return !state.s3Files.filters[col].length || state.s3Files.filters[col].includes(row[col]);
    });
  }).length;
};

// Generate a new full state object with a new value and isValid boolean for the
// s3Files key. This is separate from other keys supported by getAndValidateNewState
// because of the few discrete ways to update s3Files state and the common side
// effects / validation all of those ways require.
var getAndValidateNewS3FilesState = function getAndValidateNewS3FilesState(previousState, action) {
  var broadcast = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var s3FilesIdx = previousState.requiredSteps.findIndex(function (step) {
    return step.key === 's3Files';
  });
  if (s3FilesIdx === -1) {
    return previousState;
  }
  var newState = _extends({}, previousState, { broadcast: broadcast });
  var fileIdx = 0;

  // Set value and reflect back onto validValues as "checked" for material table if necessary.
  switch (action.type) {
    case 'setValueFromUpdatedValidValues':
      if (!newStateIsAllowable(action.key, action.value)) {
        return newState;
      }
      newState.s3Files.value = action.value;
      break;

    case 'setValidatableValue':
      if (!newStateIsAllowable(action.key, action.value)) {
        return newState;
      }
      newState.s3Files.value = action.value;
      newState.s3Files.validValues.forEach(function (file, idx) {
        newState.s3Files.validValues[idx].tableData.checked = newState.s3Files.value.includes(file.id);
      });
      break;

    case 'setS3FilesValueSelectAll':
      newState.s3Files.value = newState.s3Files.validValues.map(function (file) {
        return file.id;
      });
      newState.s3Files.validValues.forEach(function (file, idx) {
        newState.s3Files.validValues[idx].tableData.checked = true;
      });
      break;

    case 'setS3FilesValueSelectNone':
      newState.s3Files.value = [];
      newState.s3Files.validValues.forEach(function (file, idx) {
        newState.s3Files.validValues[idx].tableData.checked = false;
      });
      break;

    case 'setS3FilesValueSelectFiltered':
      newState.s3Files.value = newState.s3Files.validValues.filter(function (row) {
        return Object.keys(newState.s3Files.filters).every(function (col) {
          return !newState.s3Files.filters[col].length || newState.s3Files.filters[col].includes(row[col]);
        });
      }).map(function (file) {
        return file.id;
      });
      newState.s3Files.validValues.forEach(function (file, idx) {
        newState.s3Files.validValues[idx].tableData.checked = newState.s3Files.value.includes(file.id); // eslint-disable-line max-len
      });
      break;

    case 'setIndividualS3FileSelected':
      fileIdx = newState.s3Files.validValues.findIndex(function (file) {
        return file.id === action.id;
      });
      if (fileIdx === -1) {
        return newState;
      }
      newState.s3Files.validValues[fileIdx].tableData.checked = action.selected;
      // When doing one file at a time we don't have to recalculate the total size,
      // just add/subtract the size of the file specified
      if (action.selected) {
        newState.s3Files.value.push(action.id);
        newState.s3Files.totalSize += newState.s3Files.bytesById[action.id];
      } else {
        if (newState.s3Files.value.indexOf(action.id) === -1) {
          return newState;
        }
        newState.s3Files.value.splice(newState.s3Files.value.indexOf(action.id), 1);
        newState.s3Files.totalSize -= newState.s3Files.bytesById[action.id];
      }
      break;

    default:
      return newState;
  }

  // If we didn't already update the total size then recalculate it
  if (action.type !== 'setIndividualS3FileSelected') {
    newState.s3Files.totalSize = newState.s3Files.value.map(function (id) {
      return newState.s3Files.bytesById[id];
    }).reduce(function (a, b) {
      return a + b;
    }, 0);
  }

  // Step is only complete when there's a selection that's not too big
  newState.s3Files.estimatedPostSize = estimatePostSize(newState.s3Files, newState.sites);
  newState.s3Files.isValid = newState.s3Files.value.length > 0 && newState.s3Files.estimatedPostSize < _manifestUtil.AOP_THRESHOLD_POST_BODY_SIZE;
  if (s3FilesIdx !== -1) {
    newState.requiredSteps[s3FilesIdx].isComplete = newState.s3Files.isValid;
  }

  return newState;
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
var regenerateS3FilesFiltersAndValidValues = function regenerateS3FilesFiltersAndValidValues(state) {
  if (!state.requiredSteps.some(function (step) {
    return step.key === 's3Files';
  })) {
    return state;
  }
  var updated = _extends({}, state);
  updated.s3Files.validValues = [];
  if (!updated.sites.isValid || !updated.dateRange.isValid) {
    var _action = {
      key: 's3Files',
      type: 'setValueFromUpdatedValidValues',
      value: []
    };
    return getAndValidateNewS3FilesState(updated, _action, updated.broadcast);
  }
  // Generate new validValues as a subset of cachedValues in scope of sites and dateRange.
  // Use the current selections in s3Files.value to add tableData to each validValue record.
  // This is what Material Table looks for to render a checked box for the row.
  updated.s3Files.cachedValues = updated.s3Files.cachedValues.map(function (file) {
    return _extends({}, file, {
      tableData: { checked: false }
    });
  });
  updated.s3Files.validValues = updated.s3Files.cachedValues.filter(function (file) {
    return updated.sites.value.includes(file.site) && updated.dateRange.value[0] <= file.yearMonth && file.yearMonth <= updated.dateRange.value[1];
  }).map(function (file) {
    return _extends({}, file, {
      tableData: { checked: updated.s3Files.value.includes(file.id) }
    });
  });
  // If cachedValues and validValues differ in size then rebuild valueLookups for
  // filters, adjust filter selections to suit, and regenerate filtered file count.
  var filterKeys = Object.keys(updated.s3Files.valueLookups || {});
  if (updated.s3Files.validValues.length < updated.s3Files.cachedValues.length) {
    filterKeys.forEach(function (key) {
      updated.s3Files.valueLookups[key] = {};
    });
    updated.s3Files.validValues.forEach(function (file) {
      filterKeys.forEach(function (lookup) {
        if (typeof file[lookup] === 'undefined') {
          return;
        }
        updated.s3Files.valueLookups[lookup][file[lookup]] = file[lookup] || '(none)';
      });
    });
    filterKeys.forEach(function (key) {
      updated.s3Files.filters[key] = updated.s3Files.filters[key].filter(function (filterVal) {
        return Object.keys(updated.s3Files.valueLookups[key]).includes(filterVal);
      });
    });
  }
  updated.s3Files.filteredFileCount = getS3FilesFilteredFileCount(updated);
  // Create an action to send to the reducer helper to set an updated value and revalidate.
  var action = {
    key: 's3Files',
    type: 'setValueFromUpdatedValidValues',
    value: updated.s3Files.validValues.filter(function (file) {
      return file.tableData.checked;
    }).map(function (file) {
      return file.id;
    })
  };
  return getAndValidateNewS3FilesState(updated, action, updated.broadcast);
};

// Generate a new full state object with a new value and isValid boolean for a
// specific key. Only intended for a specific white list of state values with
// a common { value, validValues, isValid } structure. If new value is not
// "allowable" (see newStateIsAllowable and newStateIsValid definitions) then
// no action is taken.
var getAndValidateNewState = function getAndValidateNewState(previousState, action) {
  var broadcast = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

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
  var newState = _extends({}, previousState, { broadcast: broadcast });
  var valueIsValid = newStateIsValid(action.key, action.value, previousState[action.key].validValues);
  newState[action.key] = _extends({}, previousState[action.key], {
    value: action.value,
    isValid: valueIsValid
  });
  newState.requiredSteps = previousState.requiredSteps.map(function (step) {
    var requiredStateKeys = ALL_STEPS[step.key] ? ALL_STEPS[step.key].requiredStateKeys : [];
    return step.isComplete === null ? _extends({}, step) : _extends({}, step, {
      isComplete: requiredStateKeys.every(function (key) {
        return newState[key].isValid;
      })
    });
  });
  newState.allStepsComplete = newState.requiredSteps.every(function (step) {
    return step.isComplete || step.isComplete === null;
  });
  // Trigger a new manifest request for file size estimate if this update warrants it
  if (previousState.fromManifest && MANIFEST_TRIGGERING_STATE_KEYS.includes(action.key) && broadcast) {
    newState.manifest.status = 'awaitingFetchCall';
  }
  // Step Dependency - if setting sites and date range and s3Files is a required
  // step then:
  // 1. Trigger new s3 file fetches as needed
  // 2. Regenerate s3Files.validValues
  if (['sites', 'dateRange'].includes(action.key) && previousState.fromAOPManifest) {
    Object.keys(previousState.s3FileFetches).filter(function (key) {
      return ['notRequested', 'error'].includes(previousState.s3FileFetches[key]);
    }).filter(function (key) {
      var site = key.substr(0, 4);
      var yearMonth = key.substr(5, 7);
      return newState.sites.value.includes(site) && newState.dateRange.value[0] <= yearMonth && yearMonth <= newState.dateRange.value[1];
    }).forEach(function (key) {
      newState.s3FileFetches[key] = 'awaitingFetchCall';
    });
    return regenerateS3FilesFiltersAndValidValues(newState);
  }
  return newState;
};

/**
   REDUCER
*/
var reducer = function reducer(state, action) {
  var newState = {};
  var getStateFromHigherOrderState = function getStateFromHigherOrderState(newHigherOrderState) {
    return HIGHER_ORDER_TRANSFERABLE_STATE_KEYS.reduce(function (higherOrderState, stateKey) {
      var newValue = mutateNewStateIntoRange(stateKey, newHigherOrderState[stateKey].value, state[stateKey].validValues);
      var newAction = {
        key: stateKey,
        value: newValue
      };
      return getAndValidateNewState(higherOrderState, newAction);
    }, state);
  };

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
      return _extends({}, state, { dialogOpen: action.open });

    case 'setBroadcastDone':
      return _extends({}, state, { broadcast: false });

    // Action for setting productData. Applies new valid values to all selection keys.
    case 'setProductData':
      return getInitialStateFromProps({ productData: action.productData });

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
            status: 'error',
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
      return newState;

    // Action for clearing all filter values for the presentation of s3 files
    case 'clearS3FilesFilterValues':
      newState = _extends({}, state);
      Object.keys(newState.s3Files.filters).forEach(function (filter) {
        newState.s3Files.filters[filter] = [];
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
    // 2. Regenerate validValues from cachedValues and sites / date range values
    // 3. Regenerate fil
    case 'setS3FileFetchesCompleted':
      newState = _extends({}, state, { s3FileFetchProgress: 0 });
      action.value.forEach(function (response) {
        newState.s3FileFetches[response.site + '.' + response.yearMonth] = 'fetched';
        var files = response.files.map(function (fileObj) {
          var file = {
            id: fileObj.crc32,
            name: fileObj.name,
            size: parseInt(fileObj.size, 10),
            url: fileObj.url,
            site: response.site,
            yearMonth: response.yearMonth,
            tableData: { checked: false }
          };
          // Set additional file attributes from S3 regex capture groups
          Object.keys(S3_PATTERN).forEach(function (key) {
            var capture = fileObj[key].match(S3_PATTERN[key].regex);
            if (capture) {
              S3_PATTERN[key].groups.forEach(function (group, groupIdx) {
                file[group] = capture[groupIdx + 1] || null;
              });
            }
          });
          // Cache file attributes by id:
          // file size fast summing, url for building final download request
          newState.s3Files.bytesById[file.id] = file.size;
          newState.s3Files.urlsById[file.id] = file.url;
          // If new unique values are present add them to the s3File value lookups
          Object.keys(newState.s3Files.valueLookups).forEach(function (lookup) {
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
      newState = _extends({}, state, { s3FileFetchProgress: 0 });
      action.keys.forEach(function (key) {
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

    case 'setAvailabilitySelectionExpanded':
      newState = _extends({}, state);
      newState.availabilitySelectionExpanded = !!action.value;
      return newState;

    // Fallback
    default:
      return state;
  }
};

/**
   CONTEXT
*/
var Context = (0, _react.createContext)(DEFAULT_STATE);

/**
   HOOK
*/
var useDownloadDataState = function useDownloadDataState() {
  var hookResponse = (0, _react.useContext)(Context);
  if (hookResponse.length !== 2) {
    return [_extends({}, DEFAULT_STATE, {
      requiredSteps: [],
      downloadContextIsActive: false
    }), function () {}];
  }
  return hookResponse;
};

/**
  OBSERVABLES
*/
// Observable and getter for sharing whole state through a higher order component
var stateSubject$ = new _rxjs.Subject();
var getStateObservable = function getStateObservable() {
  return stateSubject$.asObservable();
};

// Observables and getters for making and canceling manifest requests
var manifestCancelation$ = new _rxjs.Subject();
var getManifestAjaxObservable = function getManifestAjaxObservable(url) {
  return _ajax.ajax.getJSON(url);
};

/**
  <DownloadDataContext.Provider />
*/
var Provider = function Provider(props) {
  var stateObservable = props.stateObservable,
      children = props.children;


  var initialState = getInitialStateFromProps(props);

  var _useReducer = (0, _react.useReducer)(reducer, initialState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  // Create an observable for manifests requests and subscribe to it to execute
  // the manifest fetch and dispatch results when updated.


  var manifestRequest$ = new _rxjs.Subject();
  manifestRequest$.subscribe(function (url) {
    return getManifestAjaxObservable(url).pipe((0, _operators.switchMap)(function (resp) {
      return (0, _rxjs.of)(resp);
    }), (0, _operators.takeUntil)(manifestCancelation$)).subscribe(function (resp) {
      return dispatch({
        type: 'setFetchManifestSucceeded',
        body: resp,
        sizeEstimate: (0, _manifestUtil.getSizeEstimateFromManifestResponse)(resp)
      });
    }, function (err) {
      return dispatch({
        type: 'setFetchManifestFailed',
        error: err
      });
    });
  });

  var handleFetchS3Files = function handleFetchS3Files(currentState) {
    var forkJoinWithProgress = function forkJoinWithProgress(arrayOfObservables) {
      return (0, _rxjs.defer)(function () {
        var counter = 0;
        var percent$ = new _rxjs.Subject();
        var modilefiedObservablesList = arrayOfObservables.map(function (item) {
          return item.pipe((0, _operators.finalize)(function () {
            counter += 1;
            var percentValue = counter * 100 / arrayOfObservables.length;
            percent$.next(percentValue);
          }));
        });
        var finalResult$ = (0, _rxjs.forkJoin)(modilefiedObservablesList).pipe((0, _operators.tap)(function () {
          percent$.next(100);
          percent$.complete();
        }));
        return (0, _rxjs.of)([finalResult$, percent$.asObservable()]);
      });
    };
    var productCode = currentState.productData.productCode;

    var keys = Object.keys(currentState.s3FileFetches).filter(function (key) {
      return currentState.s3FileFetches[key] === 'awaitingFetchCall';
    });
    if (!keys.length) {
      return;
    }
    dispatch({ type: 'setS3FileFetchesCalled', keys: keys });
    var observable = forkJoinWithProgress(keys.map(function (key) {
      var site = key.substr(0, 4);
      var yearMonth = key.substr(5, 7);
      return _ajax.ajax.getJSON((0, _manifestUtil.buildS3FilesRequestUrl)(productCode, site, yearMonth)).pipe((0, _operators.map)(function (response) {
        return {
          status: 'fetched',
          files: response.data.files,
          site: site,
          yearMonth: yearMonth
        };
      }), (0, _operators.catchError)(function () {
        return {
          status: 'error',
          files: [],
          site: site,
          yearMonth: yearMonth
        };
      }));
    }));
    observable.pipe((0, _operators.mergeMap)(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          finalResult = _ref2[0],
          progress = _ref2[1];

      return (0, _rxjs.merge)(progress.pipe((0, _operators.tap)(function (value) {
        return dispatch({
          type: 'setS3FileFetchesProgress',
          value: value
        });
      }), (0, _operators.ignoreElements)()), finalResult);
    })).subscribe(function (value) {
      return dispatch({
        type: 'setS3FileFetchesCompleted',
        value: value
      });
    });
  };

  // If the state was instantiated with a higher-order context observable passed
  // in through props: subscribe to that observable ONLY ONE TIME.
  (0, _react.useEffect)(function () {
    if (typeof stateObservable !== 'function') {
      return;
    }
    stateObservable().subscribe(function (newHigherOrderState) {
      dispatch({
        type: 'setFromHigherOrderState',
        newHigherOrderState: newHigherOrderState
      });
    });
  }, [stateObservable]);

  // When the state has changed such that it needs to broadcast itself to anything
  // listening: do the broadcast.
  (0, _react.useEffect)(function () {
    if (state.broadcast) {
      stateSubject$.next(state);
      dispatch({ type: 'setBroadcastDone' });
    }
  }, [state]);

  // When state has changed such that a new manifest should be fetched:
  // Process state into a new manifest request and fetch it, canceling any other
  // fetches that may be in progress for this context.
  (0, _react.useEffect)(function () {
    if (!state.fromManifest || state.manifest.status !== 'awaitingFetchCall') {
      return;
    }
    // Cancel any in-progress manifest fetch
    manifestCancelation$.next(true);

    var _getManifestURLConfig = getManifestURLConfig(state),
        _getManifestURLConfig2 = _slicedToArray(_getManifestURLConfig, 2),
        manifestURLConfig = _getManifestURLConfig2[0],
        manifestConfigError = _getManifestURLConfig2[1];

    if (manifestConfigError) {
      dispatch({
        type: 'setFetchManifestFailed',
        error: manifestConfigError
      });
    } else {
      dispatch({ type: 'setFetchManifestCalled' });
      var manifestURL = (0, _manifestUtil.buildManifestRequestUrl)(manifestURLConfig);
      manifestRequest$.next(manifestURL);
    }
  }, [state, manifestRequest$]);

  // If the state has changed such that new fetches for s3 files are expected:
  // generate those fetches.
  (0, _react.useEffect)(function () {
    if (Object.values(state.s3FileFetches).some(function (status) {
      return status === 'awaitingFetchCall';
    })) {
      handleFetchS3Files(state);
    }
  }, [state]);

  return _react2.default.createElement(
    Context.Provider,
    { value: [state, dispatch] },
    children
  );
};

Provider.propTypes = {
  stateObservable: _propTypes2.default.func,
  productData: _propTypes2.default.shape({
    productCode: _propTypes2.default.string.isRequired,
    productName: _propTypes2.default.string.isRequired,
    siteCodes: _propTypes2.default.arrayOf(_propTypes2.default.shape({
      siteCode: _propTypes2.default.string.isRequired,
      availableMonths: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired
    }))
  }),
  /* eslint-disable react/no-unused-prop-types */
  availabilityView: _propTypes2.default.oneOf(AVAILABILITY_VIEW_MODES),
  availabilitySelectionExpanded: _propTypes2.default.bool,
  sites: _propTypes2.default.arrayOf(_propTypes2.default.oneOf(ALL_POSSIBLE_VALID_SITES)),
  dateRange: _propTypes2.default.arrayOf(_propTypes2.default.string),
  documentation: _propTypes2.default.oneOf(ALL_POSSIBLE_VALID_DOCUMENTATION),
  packageType: _propTypes2.default.oneOf(ALL_POSSIBLE_VALID_PACKAGE_TYPE),
  /* eslint-enable react/no-unused-prop-types */
  children: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.string])), _propTypes2.default.node, _propTypes2.default.string]).isRequired
};

Provider.defaultProps = {
  stateObservable: null,
  productData: {},
  availabilityView: DEFAULT_STATE.availabilityView,
  availabilitySelectionExpanded: DEFAULT_STATE.availabilitySelectionExpanded,
  sites: DEFAULT_STATE.sites.value,
  dateRange: DEFAULT_STATE.dateRange.value,
  documentation: DEFAULT_STATE.documentation.value,
  packageType: DEFAULT_STATE.packageType.value
};

var DownloadDataContext = {
  Provider: Provider,
  useDownloadDataState: useDownloadDataState,
  reducer: reducer,
  DEFAULT_STATE: DEFAULT_STATE,
  ALL_STEPS: ALL_STEPS,
  getStateObservable: getStateObservable
};

exports.default = DownloadDataContext;