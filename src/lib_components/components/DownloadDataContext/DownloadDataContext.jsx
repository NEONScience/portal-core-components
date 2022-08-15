/* eslint-disable max-len, no-unused-vars */

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import { of, merge, Subject } from 'rxjs';
import {
  map,
  mergeMap,
  switchMap,
  catchError,
  tap,
  ignoreElements,
  takeUntil,
} from 'rxjs/operators';

import NeonApi from '../NeonApi/NeonApi';
import ExternalHost from '../ExternalHost/ExternalHost';
import {
  buildManifestConfig,
  buildS3FilesRequestUrl,
  buildManifestRequestUrl,
  buildManifestRequestBody,
  getSizeEstimateFromManifestRollupResponse,
  MAX_POST_BODY_SIZE,
} from '../../util/manifestUtil';

import { forkJoinWithProgress } from '../../util/rxUtil';
import makeStateStorage from '../../service/StateStorageService';
import NeonSignInButtonState from '../NeonSignInButton/NeonSignInButtonState';
// eslint-disable-next-line import/no-cycle
import { convertStateForStorage, convertAOPInitialState } from './StateStorageConverter';

const ALL_POSSIBLE_VALID_DATE_RANGE = ['2010-01', moment().format('YYYY-MM')];
const ALL_POSSIBLE_VALID_DOCUMENTATION = ['include', 'exclude'];
const ALL_POSSIBLE_VALID_PACKAGE_TYPE = ['basic', 'expanded'];
const AVAILABILITY_VIEW_MODES = ['summary', 'sites', 'states', 'domains'];

const ALL_STEPS = {
  documentation: {
    requiredStateKeys: ['documentation'],
    label: 'Documentation',
    title: 'Do you want to include documentation?',
  },
  externalExclusive: {
    requiredStateKeys: [],
    label: 'External Links',
  },
  s3Files: {
    requiredStateKeys: ['s3Files'],
    label: 'Files',
    title: 'Select Files to Include in Download',
  },
  packageType: {
    requiredStateKeys: ['packageType'],
    label: 'Package Type',
    title: 'Which package type do you want?',
  },
  sitesAndDateRange: {
    requiredStateKeys: ['sites', 'dateRange'],
    label: 'Sites and Date Range',
    title: 'What sites and dates do you want?',
  },
  policies: {
    requiredStateKeys: ['policies'],
    label: 'Policies',
    title: 'Agree to Policies',
  },
  summary: {
    requiredStateKeys: [],
    label: 'Summary',
    title: 'Summary of Data Download Configuration',
  },
};

// For required steps isComplete can be a boolean or null.
// If boolean will be interpreted as requiring validated user interaction.
// If null will be interpreted as purely informational and completion does not apply.
const DEFAULT_REQUIRED_STEPS = [
  { key: 'sitesAndDateRange', isComplete: false },
  { key: 'documentation', isComplete: true },
  { key: 'packageType', isComplete: false },
  { key: 'policies', isComplete: false },
  { key: 'summary', isComplete: null },
];

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
    error: null,
  },
  availabilityView: null,
  s3FileFetches: {}, // Where we keep individual fetch status for each site+yearMonth
  s3FileFetchProgress: 0, // Number to track progress of batch fetches for s3 files
  s3Files: {
    value: [],
    cachedValues: [], // Where all fetched file records are cached
    validValues: [], // Subset of cached values in scope of current sites and date range values
    isValid: false,
    bytesByUrl: {}, // A mapping of id to file size for fast summing of total download size
    totalSize: 0,
    estimatedPostSize: 0, // For disabling download button above a threshold per POST API limitation
    filteredFileCount: 0, // A cached count of files present when current filters are applied
    lastFilterChanged: null, // Used to refocus on field after state update if needed (file name)
    filters: { // Where we cache material table filter state for reinjection on full rerender
      site: [],
      type: [],
      visit: [],
      yearMonth: [],
    },
    valueLookups: { // Where we cache unique values in validValues for table filters
      site: {},
      type: {},
      visit: {},
      yearMonth: {},
    },
    visibleColumns: ['site', 'visit', 'date', 'name', 'type'],
  },
  latestRelease: null,
  release: {
    value: null,
    validValues: [],
    isValid: false,
  },
  sites: {
    value: [],
    validValues: [],
    isValid: false,
  },
  dateRange: {
    value: [...ALL_POSSIBLE_VALID_DATE_RANGE],
    validValues: [...ALL_POSSIBLE_VALID_DATE_RANGE],
    isValid: false,
  },
  documentation: {
    value: 'include',
    validValues: [...ALL_POSSIBLE_VALID_DOCUMENTATION],
    isValid: true,
  },
  packageType: {
    value: null,
    validValues: [...ALL_POSSIBLE_VALID_PACKAGE_TYPE],
    isValid: false,
  },
  policies: {
    value: false,
    validValues: null,
    isValid: false,
  },
};

// State keys that have a common { value, validValues, isValid } shape and can be validated
const VALIDATABLE_STATE_KEYS = ['release', 'sites', 'dateRange', 'documentation', 'packageType', 's3Files', 'policies'];

// State keys that can be transfered between contexts through higher order state
// (must be a subset of VALIDATABLE_STATE_KEYS)
const HIGHER_ORDER_TRANSFERABLE_STATE_KEYS = ['release', 'sites', 'dateRange'];

// State keys that should trigger a new manifest (file size estimate) request when updated
// (must be a subset of VALIDATABLE_STATE_KEYS)
const MANIFEST_TRIGGERING_STATE_KEYS = ['release', 'sites', 'dateRange', 'documentation', 'packageType'];

// Regexes and associated capture group names for parse s3 file names and URLs
const S3_PATTERN = {
  name: {
    regex: /^([\w\\(\\)._-]+)\.(\w+)$/,
    groups: ['name', 'type'],
  },
  url: {
    regex: /^.*\/(\w+)\/\w+_(\d+)\/(\w+)\/\w+\/\w+(?:\/\w+)*\/[\w\\(\\)._-]+\.\w+$/,
    groups: ['domain', 'visit', 'level'],
  },
};

// VALIDATOR FUNCTIONS
// Naive check, replace with a more robust JSON schema check
const productDataIsValid = (productData) => (
  typeof productData === 'object' && productData !== null
  && typeof productData.productName === 'string'
  && Array.isArray(productData.siteCodes)
);

const yearMonthIsValid = (yearMonth = '') => {
  if (typeof yearMonth !== 'string') { return false; }
  const match = yearMonth.match(/^([\d]{4})-([\d]{2})$/);
  if (!match) { return false; }
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const maxYear = (new Date().getFullYear()) + 1;
  return (year >= 2010 && year <= maxYear && month >= 1 && month <= 12);
};

// Check whether a new state value is "allowable" - as in it may not be *valid*
// to build a manifest, but it can be applied to state as components that use
// this state to render a form will render it correctly.
const newStateIsAllowable = (key, value) => {
  switch (key) {
    case 'release':
      return (value === null || (typeof value === 'string' && value.length > 0));
    case 'sites':
      return (
        Array.isArray(value)
        && value.every((site) => (typeof site === 'string' && /^[A-Z]{4}$/.test(site)))
      );
    case 'dateRange':
      return (
        Array.isArray(value)
        && value.length === 2
        && yearMonthIsValid(value[0]) && yearMonthIsValid(value[1])
        && value[0] >= ALL_POSSIBLE_VALID_DATE_RANGE[0]
        && value[1] <= ALL_POSSIBLE_VALID_DATE_RANGE[1]
        && value[0] <= value[1]
      );
    case 'documentation':
      return (
        ALL_POSSIBLE_VALID_DOCUMENTATION.includes(value)
        || value === null
      );
    case 'packageType':
      return (
        ALL_POSSIBLE_VALID_PACKAGE_TYPE.includes(value)
        || value === null
      );
    case 's3Files':
      return (
        Array.isArray(value) && value.every((id) => typeof id === 'string')
      );
    case 'policies':
      return value === true;
    default:
      return false;
  }
};

// Check whether a new state value is "valid" - as in it is within the requirements
// to be used in building a download manifest.
const newStateIsValid = (key, value, validValues = []) => {
  if (!VALIDATABLE_STATE_KEYS.includes(key)) { return false; }
  let idList = [];
  switch (key) {
    case 'sites':
      return (
        newStateIsAllowable(key, value)
        && Array.isArray(validValues)
        && value.length > 0
        && value.every((site) => validValues.includes(site))
      );
    case 'dateRange':
      return (
        newStateIsAllowable(key, value)
        && newStateIsAllowable(key, validValues)
        && value[0] >= validValues[0] && value[1] <= validValues[1]
      );
    case 's3Files':
      if (
        !Array.isArray(validValues)
        || !validValues.length
        || !validValues.every((f) => (
          typeof f === 'object' && f !== null && typeof f.url === 'string' && f.url.length
        ))
      ) { return false; }
      idList = validValues.map((fileObj) => fileObj.url);
      return (
        newStateIsAllowable(key, value)
        && value.length > 0
        && value.every((id) => idList.includes(id))
      );
    default:
      return (
        newStateIsAllowable(key, value)
        && (!Array.isArray(validValues) || validValues.includes(value))
      );
  }
};

const mutateNewStateIntoRange = (key, value, validValues = []) => {
  if (newStateIsValid(key, value, validValues)) { return value; }
  const valueIsAllowable = newStateIsAllowable(key, value);
  let valueIsDefault = false;
  switch (key) {
    case 'sites':
      return valueIsAllowable ? value.filter((site) => validValues.includes(site)) : [];
    case 'dateRange':
      valueIsDefault = valueIsAllowable
        && value[0] === ALL_POSSIBLE_VALID_DATE_RANGE[0]
        && value[1] === ALL_POSSIBLE_VALID_DATE_RANGE[1];
      return valueIsAllowable || valueIsDefault ? [
        (value[0] < validValues[0] ? validValues[0] : value[0]),
        (value[1] > validValues[1] ? validValues[1] : value[1]),
      ] : validValues;
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
  const filesLength = s3FilesState.value
    .reduce((a, b) => a + encodeURIComponent(b).length + 58, 0);
  return baseLength + sitesLength + filesLength;
};

// GETTER FUNCTIONS
const getValidValuesFromProductData = (productData, key) => {
  switch (key) {
    case 'release':
      return (productData.releases || []).map((r) => r.release) || [];
    case 'sites':
      return (productData.siteCodes || []).map((s) => s.siteCode) || [];
    case 'dateRange':
      return (productData.siteCodes || [])
        .reduce((acc, site) => {
          if (!Array.isArray(site.availableMonths) || !site.availableMonths.length) {
            return acc;
          }
          const start = site.availableMonths[0];
          const end = site.availableMonths[site.availableMonths.length - 1];
          return [
            acc[0] === null || acc[0] > start ? start : acc[0],
            acc[1] === null || acc[1] < end ? end : acc[1],
          ];
        }, [null, null]);
    case 'documentation':
      return [...ALL_POSSIBLE_VALID_DOCUMENTATION];
    case 'packageType':
      return [...ALL_POSSIBLE_VALID_PACKAGE_TYPE];
    case 'policies':
      return null;
    default:
      return [];
  }
};

// Build initial state from props by first deriving valid values from
// product data (where appropriate) and then mutating prop values into
// range of valid values where appropriate.
const getInitialStateFromProps = (props) => {
  // Handle base product data
  const {
    productData,
    availabilityView,
  } = props;
  if (!productDataIsValid(productData)) {
    return {
      ...DEFAULT_STATE,
      availabilityView,
      requiredSteps: [],
    };
  }
  const initialState = {
    ...DEFAULT_STATE,
    availabilityView,
    productData,
  };

  const isAOPPipeline = (
    ['productScienceTeam', 'productScienceTeamAbbr']
      .some((key) => (typeof productData[key] === 'string' && productData[key].includes('AOP')))
    && (productData.productPublicationFormatType || '').includes('AOP')
  );

  // Pull the latest release from productData
  if (productData.releases && productData.releases.length) {
    const sortedReleases = [...productData.releases].sort(
      (a, b) => (a.generationDate > b.generationDate ? -1 : 1),
    );
    initialState.latestRelease = sortedReleases[0].release;
  }

  // Set required steps and data download origin booleans
  // Note that a data product can come from the NEON manifest AND an external host
  let requiredSteps = [...DEFAULT_REQUIRED_STEPS];
  let fromManifest = true;
  let fromAOPManifest = false;
  let fromExternalHost = false;
  const externalHost = ExternalHost.getByProductCode(productData.productCode);
  if (externalHost) {
    switch (externalHost.hostType) {
      case 'EXCLUSIVE_DATA':
        fromManifest = false;
        fromExternalHost = true;
        requiredSteps = [
          { key: 'externalExclusive', isComplete: null },
        ];
        break;
      default:
        fromExternalHost = true;
        break;
    }
  } else if (isAOPPipeline) {
    fromManifest = false;
    fromAOPManifest = true;
    requiredSteps = [
      { key: 'sitesAndDateRange', isComplete: false },
      { key: 's3Files', isComplete: false },
      { key: 'documentation', isComplete: true },
      { key: 'policies', isComplete: false },
      { key: 'summary', isComplete: null },
    ];
  }
  // Remove package type step if product does not offer expanded data
  if (productData.productHasExpanded === false && requiredSteps.some((step) => step.key === 'packageType')) {
    requiredSteps.splice(requiredSteps.findIndex((step) => step.key === 'packageType'), 1);
  }
  initialState.requiredSteps = requiredSteps;
  initialState.fromManifest = fromManifest;
  initialState.fromAOPManifest = fromAOPManifest;
  initialState.fromExternalHost = fromExternalHost;

  // Set all validatable state keys
  VALIDATABLE_STATE_KEYS.forEach((key) => {
    const validValues = getValidValuesFromProductData(productData, key);
    const unmutatedValue = props[key] || DEFAULT_STATE[key].value;
    const value = mutateNewStateIntoRange(key, unmutatedValue, validValues);
    const isValid = newStateIsValid(key, value, validValues);
    initialState[key] = {
      ...DEFAULT_STATE[key],
      value,
      validValues,
      isValid,
    };
  });

  // If AOP then initialize all s3FileFetches from props
  // ('notRequested' by default, 'awaitingFetchCall' if site + date is already in selection)
  if (isAOPPipeline) {
    initialState.s3FileFetches = productData.siteCodes.reduce((acc, site) => {
      site.availableMonths.forEach((month) => {
        acc[`${site.siteCode}.${month}`] = (
          initialState.sites.value.includes(site.siteCode)
          && initialState.dateRange.value[0] <= month
          && initialState.dateRange.value[1] >= month
        ) ? 'awaitingFetchCall' : 'notRequested';
      });
      return acc;
    }, {});
  }

  // Mark completed steps from initial values
  initialState.requiredSteps.forEach((step, idx) => {
    if (initialState.requiredSteps[idx].isComplete === null) { return; }
    initialState.requiredSteps[idx].isComplete = ALL_STEPS[step.key]
      && ALL_STEPS[step.key].requiredStateKeys.every((key) => initialState[key].isValid);
  });

  // Set allStepsComplete boolean. Ignore steps where isComplete is null
  // as that signifies "n/a" (the step is informational, completion doesn't apply).
  initialState.allStepsComplete = initialState
    .requiredSteps
    .every((step) => step.isComplete || step.isComplete === null);

  // Done!
  return initialState;
};

const getS3FilesFilteredFileCount = (state) => state.s3Files.validValues.filter((row) => (
  Object.keys(state.s3Files.filters).every((col) => {
    if (col === 'name') {
      return (!state.s3Files.filters.name.length || row.name.includes(state.s3Files.filters.name));
    }
    return (!state.s3Files.filters[col].length || state.s3Files.filters[col].includes(row[col]));
  })
)).length;

// Generate a new full state object with a new value and isValid boolean for the
// s3Files key. This is separate from other keys supported by getAndValidateNewState
// because of the few discrete ways to update s3Files state and the common side
// effects / validation all of those ways require.
const getAndValidateNewS3FilesState = (previousState, action, broadcast = false) => {
  const s3FilesIdx = previousState.requiredSteps.findIndex((step) => step.key === 's3Files');
  if (s3FilesIdx === -1) { return previousState; }
  const newState = { ...previousState, broadcast };
  let fileIdx = 0;

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
      newState.s3Files.validValues.forEach((file, idx) => {
        newState.s3Files.validValues[idx].tableData.checked = newState.s3Files.value.includes(file.url);
      });
      break;

    case 'setS3FilesValueSelectAll':
      newState.s3Files.value = newState.s3Files.validValues.map((file) => file.url);
      newState.s3Files.validValues.forEach((file, idx) => {
        newState.s3Files.validValues[idx].tableData.checked = true;
      });
      break;

    case 'setS3FilesValueSelectNone':
      newState.s3Files.value = [];
      newState.s3Files.validValues.forEach((file, idx) => {
        newState.s3Files.validValues[idx].tableData.checked = false;
      });
      break;

    case 'setS3FilesValueSelectFiltered':
      newState.s3Files.value = newState.s3Files.validValues
        .filter((row) => Object.keys(newState.s3Files.filters).every((col) => {
          if (col === 'name') {
            return (!newState.s3Files.filters.name.length || row.name.includes(newState.s3Files.filters.name)); // eslint-disable-line max-len
          }
          return (!newState.s3Files.filters[col].length || newState.s3Files.filters[col].includes(row[col])); // eslint-disable-line max-len
        }))
        .map((file) => file.url);
      newState.s3Files.validValues.forEach((file, idx) => {
        newState.s3Files.validValues[idx].tableData.checked = newState.s3Files.value.includes(file.url); // eslint-disable-line max-len
      });
      break;

    case 'setIndividualS3FileSelected':
      fileIdx = newState.s3Files.validValues.findIndex((file) => file.url === action.url);
      if (fileIdx === -1) { return newState; }
      newState.s3Files.validValues[fileIdx].tableData.checked = action.selected;
      // When doing one file at a time we don't have to recalculate the total size,
      // just add/subtract the size of the file specified
      if (action.selected) {
        newState.s3Files.value.push(action.url);
        newState.s3Files.totalSize += newState.s3Files.bytesByUrl[action.url];
      } else {
        if (newState.s3Files.value.indexOf(action.url) === -1) { return newState; }
        newState.s3Files.value.splice(newState.s3Files.value.indexOf(action.url), 1);
        newState.s3Files.totalSize -= newState.s3Files.bytesByUrl[action.url];
      }
      break;

    default:
      return newState;
  }

  // If we didn't already update the total size then recalculate it
  if (action.type !== 'setIndividualS3FileSelected') {
    newState.s3Files.totalSize = newState.s3Files.value
      .map((id) => newState.s3Files.bytesByUrl[id])
      .reduce((a, b) => a + b, 0);
  }

  // Step is only complete when there's a selection that's not too big
  newState.s3Files.estimatedPostSize = estimatePostSize(newState.s3Files, newState.sites);
  newState.s3Files.isValid = (
    newState.s3Files.value.length > 0
    && newState.s3Files.estimatedPostSize < MAX_POST_BODY_SIZE
  );
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
const regenerateS3FilesFiltersAndValidValues = (state) => {
  if (!state.requiredSteps.some((step) => step.key === 's3Files')) { return state; }
  const updated = { ...state };
  updated.s3Files.validValues = [];
  if (!updated.sites.isValid || !updated.dateRange.isValid) {
    const action = {
      key: 's3Files',
      type: 'setValueFromUpdatedValidValues',
      value: [],
    };
    return getAndValidateNewS3FilesState(updated, action, updated.broadcast);
  }
  // Generate new validValues as a subset of cachedValues in scope of sites and dateRange.
  // Use the current selections in s3Files.value to add tableData to each validValue record.
  // This is what Material Table looks for to render a checked box for the row.
  updated.s3Files.cachedValues = updated.s3Files.cachedValues.map((file) => ({
    ...file,
    tableData: { checked: false },
  }));
  updated.s3Files.validValues = updated.s3Files.cachedValues
    .filter((file) => (
      updated.sites.value.includes(file.site)
      && updated.dateRange.value[0] <= file.yearMonth
      && file.yearMonth <= updated.dateRange.value[1]
    ))
    .map((file) => ({
      ...file,
      tableData: { checked: updated.s3Files.value.includes(file.url) },
    }));
  // If cachedValues and validValues differ in size then rebuild valueLookups for
  // filters, adjust filter selections to suit, and regenerate filtered file count.
  const filterKeys = Object.keys(updated.s3Files.valueLookups || {});
  if (updated.s3Files.validValues.length < updated.s3Files.cachedValues.length) {
    filterKeys.forEach((key) => {
      updated.s3Files.valueLookups[key] = {};
    });
    updated.s3Files.validValues.forEach((file) => {
      filterKeys.forEach((lookup) => {
        if (typeof file[lookup] === 'undefined') { return; }
        updated.s3Files.valueLookups[lookup][file[lookup]] = file[lookup] || '(none)';
      });
    });
    filterKeys.forEach((key) => {
      updated.s3Files.filters[key] = updated.s3Files.filters[key]
        .filter((filterVal) => Object.keys(updated.s3Files.valueLookups[key]).includes(filterVal));
    });
  }
  updated.s3Files.filteredFileCount = getS3FilesFilteredFileCount(updated);
  // Create an action to send to the reducer helper to set an updated value and revalidate.
  const action = {
    key: 's3Files',
    type: 'setValueFromUpdatedValidValues',
    value: updated.s3Files.validValues
      .filter((file) => file.tableData.checked)
      .map((file) => file.url),
  };
  return getAndValidateNewS3FilesState(updated, action, updated.broadcast);
};

// Generate a new full state object with a new value and isValid boolean for a
// specific key. Only intended for a specific white list of state values with
// a common { value, validValues, isValid } structure. If new value is not
// "allowable" (see newStateIsAllowable and newStateIsValid definitions) then
// no action is taken.
const getAndValidateNewState = (previousState, action, broadcast = false) => {
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
  const newState = { ...previousState, broadcast };
  const valueIsValid = newStateIsValid(
    action.key,
    action.value,
    previousState[action.key].validValues,
  );
  newState[action.key] = {
    ...previousState[action.key],
    value: action.value,
    isValid: valueIsValid,
  };
  newState.requiredSteps = previousState.requiredSteps.map((step) => {
    const requiredStateKeys = ALL_STEPS[step.key] ? ALL_STEPS[step.key].requiredStateKeys : [];
    return step.isComplete === null
      ? { ...step }
      : {
        ...step,
        isComplete: requiredStateKeys.every((key) => newState[key].isValid),
      };
  });
  newState.allStepsComplete = newState.requiredSteps
    .every((step) => step.isComplete || step.isComplete === null);
  // Trigger a new manifest request for file size estimate if this update warrants it
  if (
    previousState.fromManifest
    && MANIFEST_TRIGGERING_STATE_KEYS.includes(action.key)
    && broadcast
  ) {
    newState.manifest.status = 'awaitingFetchCall';
  }
  // Step Dependency - if setting sites and date range and s3Files is a required
  // step then:
  // 1. Trigger new s3 file fetches as needed
  // 2. Regenerate s3Files.validValues
  if (['sites', 'dateRange'].includes(action.key) && previousState.fromAOPManifest) {
    Object.keys(previousState.s3FileFetches)
      .filter((key) => ['notRequested', 'error'].includes(previousState.s3FileFetches[key]))
      .filter((key) => {
        const site = key.substr(0, 4);
        const yearMonth = key.substr(5, 7);
        return (
          newState.sites.value.includes(site)
          && newState.dateRange.value[0] <= yearMonth
          && yearMonth <= newState.dateRange.value[1]
        );
      })
      .forEach((key) => {
        newState.s3FileFetches[key] = 'awaitingFetchCall';
      });
    return regenerateS3FilesFiltersAndValidValues(newState);
  }
  return newState;
};

// REDUCER
const reducer = (state, action) => {
  let newState = {};
  const getStateFromHigherOrderState = (newHigherOrderState) => HIGHER_ORDER_TRANSFERABLE_STATE_KEYS
    .reduce((higherOrderState, stateKey) => {
      const newValue = mutateNewStateIntoRange(
        stateKey,
        newHigherOrderState[stateKey].value,
        state[stateKey].validValues,
      );
      const newAction = {
        key: stateKey,
        value: newValue,
      };
      return getAndValidateNewState(higherOrderState, newAction);
    }, state);

  switch (action.type) {
    // Action for setting state from higher order state
    case 'setFromHigherOrderState':
      if (!state.dialogOpen) {
        return {
          ...state,
          cachedHigherOrderState: action.newHigherOrderState,
          awaitingHigherOrderUpdateWhenDialogOpens: true,
        };
      }
      return getStateFromHigherOrderState(action.newHigherOrderState);

    // Action for toggling the download dialog's visibility
    case 'setDialogOpen':
      if (action.open && state.awaitingHigherOrderUpdateWhenDialogOpens) {
        return {
          ...getStateFromHigherOrderState(state.cachedHigherOrderState),
          awaitingHigherOrderUpdateWhenDialogOpens: false,
          cachedHigherOrderState: {},
          dialogOpen: action.open,
        };
      }
      return { ...state, dialogOpen: action.open };

    case 'setBroadcastDone':
      return { ...state, broadcast: false };

    // Action for setting productData. Applies new valid values to all selection keys.
    case 'setProductData':
      return getInitialStateFromProps({ productData: action.productData });

    // Actions for dealing with size estimate fetching
    case 'setFetchManifestCalled':
      return {
        ...state,
        manifest: {
          status: 'fetching',
          body: null,
          sizeEstimate: null,
          error: null,
        },
      };
    case 'setFetchManifestSucceeded':
      if (!Number.isInteger(action.sizeEstimate) || action.sizeEstimate < 0) {
        return {
          ...state,
          manifest: {
            status: 'error',
            body: null,
            sizeEstimate: null,
            error: 'NaN',
          },
        };
      }
      return {
        ...state,
        manifest: {
          status: 'fetched',
          body: action.body,
          sizeEstimate: action.sizeEstimate,
          error: null,
        },
      };
    case 'setFetchManifestFailed':
      return {
        ...state,
        manifest: {
          status: 'error',
          body: null,
          sizeEstimate: null,
          error: action.error,
        },
      };

    // Action for setting state keys that are dynamically validated (sites, dateRange, etc.)
    case 'setValidatableValue':
      return getAndValidateNewState(state, action, true);

    // Action for setting an individual filter value for the presentation of s3 files
    case 'setS3FilesFilterValue':
      newState = { ...state };
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
      newState = { ...state };
      Object.keys(newState.s3Files.filters).forEach((filter) => {
        newState.s3Files.filters[filter] = (filter === 'name' ? '' : []);
      });
      newState.s3Files.filteredFileCount = 0;
      return newState;

    // Action for setting visible columns for the presentation of s3 files
    case 'setS3FilesVisibleColumns':
      newState = { ...state };
      newState.s3Files.visibleColumns = action.visibleColumns;
      return newState;

    // Action for updating progress value for an ongoing batch of s3 file fetches
    case 'setS3FileFetchesProgress':
      return {
        ...state,
        s3FileFetchProgress: action.value,
      };

    // Action for handling the response from an s3 files fetch:
    // 1. Append to cachedValues
    // 2. Regenerate filter and validValues from cachedValues and sites / date range values
    case 'setS3FileFetchesCompleted':
      newState = { ...state, s3FileFetchProgress: 0 };
      action.value.forEach((response) => {
        newState.s3FileFetches[`${response.site}.${response.yearMonth}`] = 'fetched';
        const files = response.files.map((fileObj) => {
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
            tableData: { checked: false },
          };
          // Set additional file attributes from S3 regex capture groups
          Object.keys(S3_PATTERN).forEach((key) => {
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
          Object.keys(newState.s3Files.valueLookups).forEach((lookup) => {
            if (typeof file[lookup] === 'undefined') { return; }
            newState.s3Files.valueLookups[lookup][file[lookup]] = file[lookup] || '(none)';
          });
          return file;
        });
        newState.s3Files.cachedValues = newState.s3Files.cachedValues.concat(files);
      });
      return regenerateS3FilesFiltersAndValidValues(newState);

    // Action for setting all fetch statuses to 'fetching' for a list of fetch keys
    case 'setS3FileFetchesCalled':
      newState = { ...state, s3FileFetchProgress: 0 };
      action.keys.forEach((key) => {
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
      newState = { ...state };
      if (!AVAILABILITY_VIEW_MODES.includes(action.value)) { return newState; }
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
const Context = createContext(DEFAULT_STATE);

// HOOK
const useDownloadDataState = () => {
  const hookResponse = useContext(Context);
  if (hookResponse.length !== 2) {
    return [
      {
        ...DEFAULT_STATE,
        requiredSteps: [],
        downloadContextIsActive: false,
      },
      () => {},
    ];
  }
  return hookResponse;
};

// OBSERVABLES
// Observable and getter for sharing whole state through a higher order component
const stateSubject$ = new Subject();
const getStateObservable = () => stateSubject$.asObservable();
// Observables and getters for making and canceling manifest requests
const manifestCancelation$ = new Subject();
const getManifestAjaxObservable = (request) => (
  NeonApi.postJsonObservable(request.url, request.body, null, false)
);

/**
 * Defines a lookup of state key to a boolean
 * designating whether or not that instance of the context
 * should pull the state from the session storage and restore.
 * Keeping this lookup outside of the context provider function
 * as to not incur lifecycle interference by storing with useState.
 */
const restoreStateLookup = {};

// Provider
const Provider = (props) => {
  const {
    downloadDataContextUniqueId,
    stateObservable,
    children,
  } = props;

  // get the initial state from storage if present, else get from props.
  let initialState = getInitialStateFromProps(props);
  const { productCode: product } = initialState.productData;
  const stateKey = `downloadDataContextState-${product}-${downloadDataContextUniqueId}`;
  if (typeof restoreStateLookup[stateKey] === 'undefined') {
    restoreStateLookup[stateKey] = true;
  }
  const shouldRestoreState = restoreStateLookup[stateKey];
  const stateStorage = makeStateStorage(stateKey);
  const savedState = stateStorage.readState();
  if (savedState && shouldRestoreState) {
    restoreStateLookup[stateKey] = false;
    stateStorage.removeState();
    initialState = convertAOPInitialState(savedState, initialState);
  }
  const [state, dispatch] = useReducer(wrappedReducer, initialState);

  const { downloadContextIsActive, dialogOpen } = state;

  // The current sign in process uses a separate domain. This function
  // persists the current state in storage when the button is clicked
  // so the state may be reloaded when the page is reloaded after sign
  // in.
  useEffect(() => {
    const subscription = NeonSignInButtonState.getObservable().subscribe({
      next: () => {
        if (!downloadContextIsActive || !dialogOpen) return;
        restoreStateLookup[stateKey] = false;
        stateStorage.saveState(convertStateForStorage(state));
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [downloadContextIsActive, dialogOpen, state, stateKey, stateStorage]);

  // Create an observable for manifests requests and subscribe to it to execute
  // the manifest fetch and dispatch results when updated.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const manifestRequest$ = new Subject();
  manifestRequest$.subscribe((request) => (
    getManifestAjaxObservable(request)
      .pipe(
        switchMap((resp) => of(request.body ? resp.response : resp)),
        takeUntil(manifestCancelation$),
      )
      .subscribe(
        (resp) => dispatch({
          type: 'setFetchManifestSucceeded',
          body: resp,
          sizeEstimate: getSizeEstimateFromManifestRollupResponse(resp),
        }),
        (err) => dispatch({
          type: 'setFetchManifestFailed',
          error: err,
        }),
      )
  ));

  const handleFetchS3Files = (currentState) => {
    const { productCode } = currentState.productData;
    const keys = Object.keys(currentState.s3FileFetches)
      .filter((key) => currentState.s3FileFetches[key] === 'awaitingFetchCall');
    if (!keys.length) { return; }
    dispatch({ type: 'setS3FileFetchesCalled', keys });
    const observable = forkJoinWithProgress(
      keys.map((key) => {
        const site = key.substr(0, 4);
        const yearMonth = key.substr(5, 7);
        const release = currentState.release && currentState.release.value
          ? currentState.release.value
          : null;
        return NeonApi
          .getJsonObservable(buildS3FilesRequestUrl(productCode, site, yearMonth, release))
          .pipe(
            map((response) => ({
              status: 'fetched',
              files: response.data.files,
              release: response.data.release,
              site,
              yearMonth,
              productCode,
            })),
            catchError(() => ({
              status: 'error',
              files: [],
              site,
              yearMonth,
              productCode,
            })),
          );
      }),
    );
    observable.pipe(
      mergeMap(([finalResult, progress]) => merge(
        progress.pipe(
          tap((value) => dispatch({
            type: 'setS3FileFetchesProgress',
            value,
          })),
          ignoreElements(),
        ),
        finalResult,
      )),
    ).subscribe((value) => dispatch({
      type: 'setS3FileFetchesCompleted',
      value,
    }));
  };

  // If the state was instantiated with a higher-order context observable passed
  // in through props: subscribe to that observable ONLY ONE TIME.
  useEffect(() => {
    if (typeof stateObservable !== 'function') { return; }
    stateObservable().subscribe((newHigherOrderState) => {
      dispatch({
        type: 'setFromHigherOrderState',
        newHigherOrderState,
      });
    });
  }, [stateObservable]);

  // When the state has changed such that it needs to broadcast itself to anything
  // listening: do the broadcast.
  useEffect(() => {
    if (state.broadcast) {
      stateSubject$.next(state);
      dispatch({ type: 'setBroadcastDone' });
    }
  }, [state]);

  // When state has changed such that a new manifest should be fetched:
  // Process state into a new manifest request and fetch it, canceling any other
  // fetches that may be in progress for this context.
  useEffect(() => {
    if (!state.fromManifest || state.manifest.status !== 'awaitingFetchCall') { return; }
    // Cancel any in-progress manifest fetch
    manifestCancelation$.next(true);
    const config = buildManifestConfig(
      state,
      ALL_POSSIBLE_VALID_PACKAGE_TYPE[0],
    );
    if (config.isError && config.errorMessage) {
      dispatch({
        type: 'setFetchManifestFailed',
        error: config.errorMessage,
      });
    } else {
      dispatch({ type: 'setFetchManifestCalled' });
      const manifestURL = buildManifestRequestUrl(config, true);
      const manifestBody = buildManifestRequestBody(config);
      manifestRequest$.next({ url: manifestURL, body: manifestBody });
    }
  }, [state, manifestRequest$]);

  // If the state has changed such that new fetches for s3 files are expected:
  // generate those fetches.
  useEffect(() => {
    if (Object.values(state.s3FileFetches).some((status) => status === 'awaitingFetchCall')) {
      handleFetchS3Files(state);
    }
  }, [state]);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  );
};

Provider.propTypes = {
  downloadDataContextUniqueId: PropTypes.number,
  stateObservable: PropTypes.func,
  productData: PropTypes.shape({
    productCode: PropTypes.string.isRequired,
    productName: PropTypes.string.isRequired,
    siteCodes: PropTypes.arrayOf(
      PropTypes.shape({
        siteCode: PropTypes.string.isRequired,
        availableMonths: PropTypes.arrayOf(PropTypes.string).isRequired,
      }),
    ),
  }),
  /* eslint-disable react/no-unused-prop-types */
  availabilityView: PropTypes.oneOf(AVAILABILITY_VIEW_MODES),
  release: PropTypes.string,
  sites: PropTypes.arrayOf(PropTypes.string),
  dateRange: PropTypes.arrayOf(PropTypes.string),
  documentation: PropTypes.oneOf(ALL_POSSIBLE_VALID_DOCUMENTATION),
  packageType: PropTypes.oneOf(ALL_POSSIBLE_VALID_PACKAGE_TYPE),
  /* eslint-enable react/no-unused-prop-types */
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
  downloadDataContextUniqueId: 0,
  stateObservable: null,
  productData: {},
  availabilityView: DEFAULT_STATE.availabilityView,
  release: DEFAULT_STATE.release.value,
  sites: DEFAULT_STATE.sites.value,
  dateRange: DEFAULT_STATE.dateRange.value,
  documentation: DEFAULT_STATE.documentation.value,
  packageType: DEFAULT_STATE.packageType.value,
};

const DownloadDataContext = {
  Provider,
  useDownloadDataState,
  reducer,
  DEFAULT_STATE,
  ALL_STEPS,
  getStateObservable,
};

export default DownloadDataContext;

// Additional items exported for unit testing
export const getTestableItems = () => (
  process.env.NODE_ENV !== 'test' ? {} : {
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
  }
);
