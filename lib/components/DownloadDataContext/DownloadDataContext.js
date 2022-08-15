"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTestableItems = exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _moment = _interopRequireDefault(require("moment"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _NeonApi = _interopRequireDefault(require("../NeonApi/NeonApi"));

var _ExternalHost = _interopRequireDefault(require("../ExternalHost/ExternalHost"));

var _manifestUtil = require("../../util/manifestUtil");

var _rxUtil = require("../../util/rxUtil");

var _StateStorageService = _interopRequireDefault(require("../../service/StateStorageService"));

var _NeonSignInButtonState = _interopRequireDefault(require("../NeonSignInButton/NeonSignInButtonState"));

var _StateStorageConverter = require("./StateStorageConverter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var ALL_POSSIBLE_VALID_DATE_RANGE = ['2010-01', (0, _moment.default)().format('YYYY-MM')];
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
}; // For required steps isComplete can be a boolean or null.
// If boolean will be interpreted as requiring validated user interaction.
// If null will be interpreted as purely informational and completion does not apply.

var DEFAULT_REQUIRED_STEPS = [{
  key: 'sitesAndDateRange',
  isComplete: false
}, {
  key: 'documentation',
  isComplete: true
}, {
  key: 'packageType',
  isComplete: false
}, {
  key: 'policies',
  isComplete: false
}, {
  key: 'summary',
  isComplete: null
}];
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
  availabilityView: null,
  s3FileFetches: {},
  // Where we keep individual fetch status for each site+yearMonth
  s3FileFetchProgress: 0,
  // Number to track progress of batch fetches for s3 files
  s3Files: {
    value: [],
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
}; // State keys that have a common { value, validValues, isValid } shape and can be validated

var VALIDATABLE_STATE_KEYS = ['release', 'sites', 'dateRange', 'documentation', 'packageType', 's3Files', 'policies']; // State keys that can be transfered between contexts through higher order state
// (must be a subset of VALIDATABLE_STATE_KEYS)

var HIGHER_ORDER_TRANSFERABLE_STATE_KEYS = ['release', 'sites', 'dateRange']; // State keys that should trigger a new manifest (file size estimate) request when updated
// (must be a subset of VALIDATABLE_STATE_KEYS)

var MANIFEST_TRIGGERING_STATE_KEYS = ['release', 'sites', 'dateRange', 'documentation', 'packageType']; // Regexes and associated capture group names for parse s3 file names and URLs

var S3_PATTERN = {
  name: {
    regex: /^([\w\\(\\)._-]+)\.(\w+)$/,
    groups: ['name', 'type']
  },
  url: {
    regex: /^.*\/(\w+)\/\w+_(\d+)\/(\w+)\/\w+\/\w+(?:\/\w+)*\/[\w\\(\\)._-]+\.\w+$/,
    groups: ['domain', 'visit', 'level']
  }
}; // VALIDATOR FUNCTIONS
// Naive check, replace with a more robust JSON schema check

var productDataIsValid = function productDataIsValid(productData) {
  return _typeof(productData) === 'object' && productData !== null && typeof productData.productName === 'string' && Array.isArray(productData.siteCodes);
};

var yearMonthIsValid = function yearMonthIsValid() {
  var yearMonth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  if (typeof yearMonth !== 'string') {
    return false;
  }

  var match = yearMonth.match(/^([\d]{4})-([\d]{2})$/);

  if (!match) {
    return false;
  }

  var year = parseInt(match[1], 10);
  var month = parseInt(match[2], 10);
  var maxYear = new Date().getFullYear() + 1;
  return year >= 2010 && year <= maxYear && month >= 1 && month <= 12;
}; // Check whether a new state value is "allowable" - as in it may not be *valid*
// to build a manifest, but it can be applied to state as components that use
// this state to render a form will render it correctly.


var newStateIsAllowable = function newStateIsAllowable(key, value) {
  switch (key) {
    case 'release':
      return value === null || typeof value === 'string' && value.length > 0;

    case 'sites':
      return Array.isArray(value) && value.every(function (site) {
        return typeof site === 'string' && /^[A-Z]{4}$/.test(site);
      });

    case 'dateRange':
      return Array.isArray(value) && value.length === 2 && yearMonthIsValid(value[0]) && yearMonthIsValid(value[1]) && value[0] >= ALL_POSSIBLE_VALID_DATE_RANGE[0] && value[1] <= ALL_POSSIBLE_VALID_DATE_RANGE[1] && value[0] <= value[1];

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
}; // Check whether a new state value is "valid" - as in it is within the requirements
// to be used in building a download manifest.


var newStateIsValid = function newStateIsValid(key, value) {
  var validValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (!VALIDATABLE_STATE_KEYS.includes(key)) {
    return false;
  }

  var idList = [];

  switch (key) {
    case 'sites':
      return newStateIsAllowable(key, value) && Array.isArray(validValues) && value.length > 0 && value.every(function (site) {
        return validValues.includes(site);
      });

    case 'dateRange':
      return newStateIsAllowable(key, value) && newStateIsAllowable(key, validValues) && value[0] >= validValues[0] && value[1] <= validValues[1];

    case 's3Files':
      if (!Array.isArray(validValues) || !validValues.length || !validValues.every(function (f) {
        return _typeof(f) === 'object' && f !== null && typeof f.url === 'string' && f.url.length;
      })) {
        return false;
      }

      idList = validValues.map(function (fileObj) {
        return fileObj.url;
      });
      return newStateIsAllowable(key, value) && value.length > 0 && value.every(function (id) {
        return idList.includes(id);
      });

    default:
      return newStateIsAllowable(key, value) && (!Array.isArray(validValues) || validValues.includes(value));
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
      return valueIsAllowable || valueIsDefault ? [value[0] < validValues[0] ? validValues[0] : value[0], value[1] > validValues[1] ? validValues[1] : value[1]] : validValues;

    default:
      return valueIsAllowable ? value : DEFAULT_STATE[key].value;
  }
}; // Estimate a POST body size from a sile list and sites list for s3Files-based
// downloads. Numbers here are based on the current POST API and what it requires
// for form data keys, which is excessively verbose.


var estimatePostSize = function estimatePostSize(s3FilesState, sitesState) {
  var baseLength = 300;
  var sitesLength = sitesState.value.length * 62;
  var filesLength = s3FilesState.value.reduce(function (a, b) {
    return a + encodeURIComponent(b).length + 58;
  }, 0);
  return baseLength + sitesLength + filesLength;
}; // GETTER FUNCTIONS


var getValidValuesFromProductData = function getValidValuesFromProductData(productData, key) {
  switch (key) {
    case 'release':
      return (productData.releases || []).map(function (r) {
        return r.release;
      }) || [];

    case 'sites':
      return (productData.siteCodes || []).map(function (s) {
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
}; // Build initial state from props by first deriving valid values from
// product data (where appropriate) and then mutating prop values into
// range of valid values where appropriate.


var getInitialStateFromProps = function getInitialStateFromProps(props) {
  // Handle base product data
  var productData = props.productData,
      availabilityView = props.availabilityView;

  if (!productDataIsValid(productData)) {
    return _extends({}, DEFAULT_STATE, {
      availabilityView: availabilityView,
      requiredSteps: []
    });
  }

  var initialState = _extends({}, DEFAULT_STATE, {
    availabilityView: availabilityView,
    productData: productData
  });

  var isAOPPipeline = ['productScienceTeam', 'productScienceTeamAbbr'].some(function (key) {
    return typeof productData[key] === 'string' && productData[key].includes('AOP');
  }) && (productData.productPublicationFormatType || '').includes('AOP'); // Pull the latest release from productData

  if (productData.releases && productData.releases.length) {
    var sortedReleases = _toConsumableArray(productData.releases).sort(function (a, b) {
      return a.generationDate > b.generationDate ? -1 : 1;
    });

    initialState.latestRelease = sortedReleases[0].release;
  } // Set required steps and data download origin booleans
  // Note that a data product can come from the NEON manifest AND an external host


  var requiredSteps = [].concat(DEFAULT_REQUIRED_STEPS);
  var fromManifest = true;
  var fromAOPManifest = false;
  var fromExternalHost = false;

  var externalHost = _ExternalHost.default.getByProductCode(productData.productCode);

  if (externalHost) {
    switch (externalHost.hostType) {
      case 'EXCLUSIVE_DATA':
        fromManifest = false;
        fromExternalHost = true;
        requiredSteps = [{
          key: 'externalExclusive',
          isComplete: null
        }];
        break;

      default:
        fromExternalHost = true;
        break;
    }
  } else if (isAOPPipeline) {
    fromManifest = false;
    fromAOPManifest = true;
    requiredSteps = [{
      key: 'sitesAndDateRange',
      isComplete: false
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
  } // Remove package type step if product does not offer expanded data


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
  initialState.fromExternalHost = fromExternalHost; // Set all validatable state keys

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
  }); // If AOP then initialize all s3FileFetches from props
  // ('notRequested' by default, 'awaitingFetchCall' if site + date is already in selection)

  if (isAOPPipeline) {
    initialState.s3FileFetches = productData.siteCodes.reduce(function (acc, site) {
      site.availableMonths.forEach(function (month) {
        acc["".concat(site.siteCode, ".").concat(month)] = initialState.sites.value.includes(site.siteCode) && initialState.dateRange.value[0] <= month && initialState.dateRange.value[1] >= month ? 'awaitingFetchCall' : 'notRequested';
      });
      return acc;
    }, {});
  } // Mark completed steps from initial values


  initialState.requiredSteps.forEach(function (step, idx) {
    if (initialState.requiredSteps[idx].isComplete === null) {
      return;
    }

    initialState.requiredSteps[idx].isComplete = ALL_STEPS[step.key] && ALL_STEPS[step.key].requiredStateKeys.every(function (key) {
      return initialState[key].isValid;
    });
  }); // Set allStepsComplete boolean. Ignore steps where isComplete is null
  // as that signifies "n/a" (the step is informational, completion doesn't apply).

  initialState.allStepsComplete = initialState.requiredSteps.every(function (step) {
    return step.isComplete || step.isComplete === null;
  }); // Done!

  return initialState;
};

var getS3FilesFilteredFileCount = function getS3FilesFilteredFileCount(state) {
  return state.s3Files.validValues.filter(function (row) {
    return Object.keys(state.s3Files.filters).every(function (col) {
      if (col === 'name') {
        return !state.s3Files.filters.name.length || row.name.includes(state.s3Files.filters.name);
      }

      return !state.s3Files.filters[col].length || state.s3Files.filters[col].includes(row[col]);
    });
  }).length;
}; // Generate a new full state object with a new value and isValid boolean for the
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

  var newState = _extends({}, previousState, {
    broadcast: broadcast
  });

  var fileIdx = 0; // Set value and reflect back onto validValues as "checked" for material table if necessary.

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
        newState.s3Files.validValues[idx].tableData.checked = newState.s3Files.value.includes(file.url);
      });
      break;

    case 'setS3FilesValueSelectAll':
      newState.s3Files.value = newState.s3Files.validValues.map(function (file) {
        return file.url;
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
          if (col === 'name') {
            return !newState.s3Files.filters.name.length || row.name.includes(newState.s3Files.filters.name); // eslint-disable-line max-len
          }

          return !newState.s3Files.filters[col].length || newState.s3Files.filters[col].includes(row[col]); // eslint-disable-line max-len
        });
      }).map(function (file) {
        return file.url;
      });
      newState.s3Files.validValues.forEach(function (file, idx) {
        newState.s3Files.validValues[idx].tableData.checked = newState.s3Files.value.includes(file.url); // eslint-disable-line max-len
      });
      break;

    case 'setIndividualS3FileSelected':
      fileIdx = newState.s3Files.validValues.findIndex(function (file) {
        return file.url === action.url;
      });

      if (fileIdx === -1) {
        return newState;
      }

      newState.s3Files.validValues[fileIdx].tableData.checked = action.selected; // When doing one file at a time we don't have to recalculate the total size,
      // just add/subtract the size of the file specified

      if (action.selected) {
        newState.s3Files.value.push(action.url);
        newState.s3Files.totalSize += newState.s3Files.bytesByUrl[action.url];
      } else {
        if (newState.s3Files.value.indexOf(action.url) === -1) {
          return newState;
        }

        newState.s3Files.value.splice(newState.s3Files.value.indexOf(action.url), 1);
        newState.s3Files.totalSize -= newState.s3Files.bytesByUrl[action.url];
      }

      break;

    default:
      return newState;
  } // If we didn't already update the total size then recalculate it


  if (action.type !== 'setIndividualS3FileSelected') {
    newState.s3Files.totalSize = newState.s3Files.value.map(function (id) {
      return newState.s3Files.bytesByUrl[id];
    }).reduce(function (a, b) {
      return a + b;
    }, 0);
  } // Step is only complete when there's a selection that's not too big


  newState.s3Files.estimatedPostSize = estimatePostSize(newState.s3Files, newState.sites);
  newState.s3Files.isValid = newState.s3Files.value.length > 0 && newState.s3Files.estimatedPostSize < _manifestUtil.MAX_POST_BODY_SIZE;

  if (s3FilesIdx !== -1) {
    newState.requiredSteps[s3FilesIdx].isComplete = newState.s3Files.isValid;
  }

  return newState;
}; // Generate new s3Files.validValues and s3Files filter values in state.
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
  } // Generate new validValues as a subset of cachedValues in scope of sites and dateRange.
  // Use the current selections in s3Files.value to add tableData to each validValue record.
  // This is what Material Table looks for to render a checked box for the row.


  updated.s3Files.cachedValues = updated.s3Files.cachedValues.map(function (file) {
    return _extends({}, file, {
      tableData: {
        checked: false
      }
    });
  });
  updated.s3Files.validValues = updated.s3Files.cachedValues.filter(function (file) {
    return updated.sites.value.includes(file.site) && updated.dateRange.value[0] <= file.yearMonth && file.yearMonth <= updated.dateRange.value[1];
  }).map(function (file) {
    return _extends({}, file, {
      tableData: {
        checked: updated.s3Files.value.includes(file.url)
      }
    });
  }); // If cachedValues and validValues differ in size then rebuild valueLookups for
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

  updated.s3Files.filteredFileCount = getS3FilesFilteredFileCount(updated); // Create an action to send to the reducer helper to set an updated value and revalidate.

  var action = {
    key: 's3Files',
    type: 'setValueFromUpdatedValidValues',
    value: updated.s3Files.validValues.filter(function (file) {
      return file.tableData.checked;
    }).map(function (file) {
      return file.url;
    })
  };
  return getAndValidateNewS3FilesState(updated, action, updated.broadcast);
}; // Generate a new full state object with a new value and isValid boolean for a
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
  } // s3Files is validatable state but special enough to get its own state generator


  if (action.key === 's3Files') {
    return getAndValidateNewS3FilesState(previousState, action, broadcast);
  }

  var newState = _extends({}, previousState, {
    broadcast: broadcast
  });

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
  }); // Trigger a new manifest request for file size estimate if this update warrants it

  if (previousState.fromManifest && MANIFEST_TRIGGERING_STATE_KEYS.includes(action.key) && broadcast) {
    newState.manifest.status = 'awaitingFetchCall';
  } // Step Dependency - if setting sites and date range and s3Files is a required
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
}; // REDUCER


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
      newState.s3Files.lastFilterChanged = action.filter;
      return newState;
    // Action for clearing all filter values for the presentation of s3 files

    case 'clearS3FilesFilterValues':
      newState = _extends({}, state);
      Object.keys(newState.s3Files.filters).forEach(function (filter) {
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
      action.value.forEach(function (response) {
        newState.s3FileFetches["".concat(response.site, ".").concat(response.yearMonth)] = 'fetched';
        var files = response.files.map(function (fileObj) {
          var file = {
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
          }; // Set additional file attributes from S3 regex capture groups

          Object.keys(S3_PATTERN).forEach(function (key) {
            var capture = fileObj[key].match(S3_PATTERN[key].regex);

            if (capture) {
              S3_PATTERN[key].groups.forEach(function (group, groupIdx) {
                file[group] = capture[groupIdx + 1] || null;
              });
            }
          }); // Cache file attributes by url:
          // file size fast summing, url for building final download request

          newState.s3Files.bytesByUrl[file.url] = file.size; // If new unique values are present add them to the s3File value lookups

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
      newState = _extends({}, state, {
        s3FileFetchProgress: 0
      });
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


var wrappedReducer = function wrappedReducer(state, action) {
  return reducer(state, action);
}; // CONTEXT


var Context = /*#__PURE__*/(0, _react.createContext)(DEFAULT_STATE); // HOOK

var useDownloadDataState = function useDownloadDataState() {
  var hookResponse = (0, _react.useContext)(Context);

  if (hookResponse.length !== 2) {
    return [_extends({}, DEFAULT_STATE, {
      requiredSteps: [],
      downloadContextIsActive: false
    }), function () {}];
  }

  return hookResponse;
}; // OBSERVABLES
// Observable and getter for sharing whole state through a higher order component


var stateSubject$ = new _rxjs.Subject();

var getStateObservable = function getStateObservable() {
  return stateSubject$.asObservable();
}; // Observables and getters for making and canceling manifest requests


var manifestCancelation$ = new _rxjs.Subject();

var getManifestAjaxObservable = function getManifestAjaxObservable(request) {
  return _NeonApi.default.postJsonObservable(request.url, request.body, null, false);
};
/**
 * Defines a lookup of state key to a boolean
 * designating whether or not that instance of the context
 * should pull the state from the session storage and restore.
 * Keeping this lookup outside of the context provider function
 * as to not incur lifecycle interference by storing with useState.
 */


var restoreStateLookup = {}; // Provider

var Provider = function Provider(props) {
  var downloadDataContextUniqueId = props.downloadDataContextUniqueId,
      stateObservable = props.stateObservable,
      children = props.children; // get the initial state from storage if present, else get from props.

  var initialState = getInitialStateFromProps(props);
  var product = initialState.productData.productCode;
  var stateKey = "downloadDataContextState-".concat(product, "-").concat(downloadDataContextUniqueId);

  if (typeof restoreStateLookup[stateKey] === 'undefined') {
    restoreStateLookup[stateKey] = true;
  }

  var shouldRestoreState = restoreStateLookup[stateKey];
  var stateStorage = (0, _StateStorageService.default)(stateKey);
  var savedState = stateStorage.readState();

  if (savedState && shouldRestoreState) {
    restoreStateLookup[stateKey] = false;
    stateStorage.removeState();
    initialState = (0, _StateStorageConverter.convertAOPInitialState)(savedState, initialState);
  }

  var _useReducer = (0, _react.useReducer)(wrappedReducer, initialState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var downloadContextIsActive = state.downloadContextIsActive,
      dialogOpen = state.dialogOpen; // The current sign in process uses a separate domain. This function
  // persists the current state in storage when the button is clicked
  // so the state may be reloaded when the page is reloaded after sign
  // in.

  (0, _react.useEffect)(function () {
    var subscription = _NeonSignInButtonState.default.getObservable().subscribe({
      next: function next() {
        if (!downloadContextIsActive || !dialogOpen) return;
        restoreStateLookup[stateKey] = false;
        stateStorage.saveState((0, _StateStorageConverter.convertStateForStorage)(state));
      }
    });

    return function () {
      subscription.unsubscribe();
    };
  }, [downloadContextIsActive, dialogOpen, state, stateKey, stateStorage]); // Create an observable for manifests requests and subscribe to it to execute
  // the manifest fetch and dispatch results when updated.
  // eslint-disable-next-line react-hooks/exhaustive-deps

  var manifestRequest$ = new _rxjs.Subject();
  manifestRequest$.subscribe(function (request) {
    return getManifestAjaxObservable(request).pipe((0, _operators.switchMap)(function (resp) {
      return (0, _rxjs.of)(request.body ? resp.response : resp);
    }), (0, _operators.takeUntil)(manifestCancelation$)).subscribe(function (resp) {
      return dispatch({
        type: 'setFetchManifestSucceeded',
        body: resp,
        sizeEstimate: (0, _manifestUtil.getSizeEstimateFromManifestRollupResponse)(resp)
      });
    }, function (err) {
      return dispatch({
        type: 'setFetchManifestFailed',
        error: err
      });
    });
  });

  var handleFetchS3Files = function handleFetchS3Files(currentState) {
    var productCode = currentState.productData.productCode;
    var keys = Object.keys(currentState.s3FileFetches).filter(function (key) {
      return currentState.s3FileFetches[key] === 'awaitingFetchCall';
    });

    if (!keys.length) {
      return;
    }

    dispatch({
      type: 'setS3FileFetchesCalled',
      keys: keys
    });
    var observable = (0, _rxUtil.forkJoinWithProgress)(keys.map(function (key) {
      var site = key.substr(0, 4);
      var yearMonth = key.substr(5, 7);
      var release = currentState.release && currentState.release.value ? currentState.release.value : null;
      return _NeonApi.default.getJsonObservable((0, _manifestUtil.buildS3FilesRequestUrl)(productCode, site, yearMonth, release)).pipe((0, _operators.map)(function (response) {
        return {
          status: 'fetched',
          files: response.data.files,
          release: response.data.release,
          site: site,
          yearMonth: yearMonth,
          productCode: productCode
        };
      }), (0, _operators.catchError)(function () {
        return {
          status: 'error',
          files: [],
          site: site,
          yearMonth: yearMonth,
          productCode: productCode
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
  }; // If the state was instantiated with a higher-order context observable passed
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
  }, [stateObservable]); // When the state has changed such that it needs to broadcast itself to anything
  // listening: do the broadcast.

  (0, _react.useEffect)(function () {
    if (state.broadcast) {
      stateSubject$.next(state);
      dispatch({
        type: 'setBroadcastDone'
      });
    }
  }, [state]); // When state has changed such that a new manifest should be fetched:
  // Process state into a new manifest request and fetch it, canceling any other
  // fetches that may be in progress for this context.

  (0, _react.useEffect)(function () {
    if (!state.fromManifest || state.manifest.status !== 'awaitingFetchCall') {
      return;
    } // Cancel any in-progress manifest fetch


    manifestCancelation$.next(true);
    var config = (0, _manifestUtil.buildManifestConfig)(state, ALL_POSSIBLE_VALID_PACKAGE_TYPE[0]);

    if (config.isError && config.errorMessage) {
      dispatch({
        type: 'setFetchManifestFailed',
        error: config.errorMessage
      });
    } else {
      dispatch({
        type: 'setFetchManifestCalled'
      });
      var manifestURL = (0, _manifestUtil.buildManifestRequestUrl)(config, true);
      var manifestBody = (0, _manifestUtil.buildManifestRequestBody)(config);
      manifestRequest$.next({
        url: manifestURL,
        body: manifestBody
      });
    }
  }, [state, manifestRequest$]); // If the state has changed such that new fetches for s3 files are expected:
  // generate those fetches.

  (0, _react.useEffect)(function () {
    if (Object.values(state.s3FileFetches).some(function (status) {
      return status === 'awaitingFetchCall';
    })) {
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
      availableMonths: _propTypes.default.arrayOf(_propTypes.default.string).isRequired
    }))
  }),

  /* eslint-disable react/no-unused-prop-types */
  availabilityView: _propTypes.default.oneOf(AVAILABILITY_VIEW_MODES),
  release: _propTypes.default.string,
  sites: _propTypes.default.arrayOf(_propTypes.default.string),
  dateRange: _propTypes.default.arrayOf(_propTypes.default.string),
  documentation: _propTypes.default.oneOf(ALL_POSSIBLE_VALID_DOCUMENTATION),
  packageType: _propTypes.default.oneOf(ALL_POSSIBLE_VALID_PACKAGE_TYPE),

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
var _default = DownloadDataContext; // Additional items exported for unit testing

exports.default = _default;

var getTestableItems = function getTestableItems() {
  return process.env.NODE_ENV !== 'test' ? {} : {
    productDataIsValid: productDataIsValid,
    yearMonthIsValid: yearMonthIsValid,
    newStateIsAllowable: newStateIsAllowable,
    newStateIsValid: newStateIsValid,
    mutateNewStateIntoRange: mutateNewStateIntoRange,
    estimatePostSize: estimatePostSize,
    getValidValuesFromProductData: getValidValuesFromProductData,
    getInitialStateFromProps: getInitialStateFromProps,
    getS3FilesFilteredFileCount: getS3FilesFilteredFileCount,
    getAndValidateNewS3FilesState: getAndValidateNewS3FilesState,
    regenerateS3FilesFiltersAndValidValues: regenerateS3FilesFiltersAndValidValues,
    getAndValidateNewState: getAndValidateNewState,
    ALL_POSSIBLE_VALID_DATE_RANGE: ALL_POSSIBLE_VALID_DATE_RANGE,
    ALL_POSSIBLE_VALID_DOCUMENTATION: ALL_POSSIBLE_VALID_DOCUMENTATION,
    ALL_POSSIBLE_VALID_PACKAGE_TYPE: ALL_POSSIBLE_VALID_PACKAGE_TYPE
  };
};

exports.getTestableItems = getTestableItems;