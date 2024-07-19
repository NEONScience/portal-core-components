"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTestableItems = exports.fetchSingleLocationREST = exports.fetchManyLocationsGraphQL = exports.fetchDomainHierarchy = void 0;
var _rxjs = require("rxjs");
var _NeonApi = _interopRequireDefault(require("../NeonApi/NeonApi"));
var _NeonGraphQL = _interopRequireDefault(require("../NeonGraphQL/NeonGraphQL"));
var _parseDomainHierarchy = _interopRequireDefault(require("../../workers/parseDomainHierarchy"));
var _parseLocationsArray = _interopRequireDefault(require("../../workers/parseLocationsArray"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const domainIsValid = domainString => {
  if (typeof domainString !== 'string') {
    return false;
  }
  const domainTest = /^D([0-9]{2})$/.exec(domainString);
  if (!domainTest) {
    return false;
  }
  const domainNumber = Number.parseInt(domainTest[1], 10);
  if (Number.isNaN(domainNumber) || domainNumber < 1 || domainNumber > 20) {
    return false;
  }
  return true;
};
const fetchDomainHierarchy = function () {
  let domain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  if (!domainIsValid(domain)) {
    return Promise.reject(new Error('Domain is not valid'));
  }
  // Execute Locations REST API hierarchy fetch
  return new Promise((resolve, reject) => {
    _NeonApi.default.getSiteLocationHierarchyObservable(domain).pipe((0, _rxjs.map)(response => {
      if (response && response.data) {
        resolve(response.data);
        return (0, _rxjs.of)(true);
      }
      reject(new Error('Malformed response'));
      return (0, _rxjs.of)(false);
    }), (0, _rxjs.catchError)(error => {
      reject(new Error(error.message));
      return (0, _rxjs.of)(false);
    })).subscribe();
  }).then(data => (0, _parseDomainHierarchy.default)(data));
};
exports.fetchDomainHierarchy = fetchDomainHierarchy;
const fetchSingleLocationREST = location => {
  if (typeof location !== 'string' || !location.length) {
    return Promise.reject(new Error('Location is not valid; must be non-empty string'));
  }
  // Execute REST query and pipe results to processing function
  return new Promise((resolve, reject) => {
    _NeonApi.default.getLocationObservable(location).pipe((0, _rxjs.map)(response => {
      if (response && response.data) {
        resolve([response.data]);
        return (0, _rxjs.of)(true);
      }
      reject(new Error('Malformed response'));
      return (0, _rxjs.of)(false);
    }), (0, _rxjs.catchError)(error => {
      reject(new Error(error.message));
      return (0, _rxjs.of)(false);
    })).subscribe();
  }).then(data => (0, _parseLocationsArray.default)(data)).then(locationMap => (locationMap || {})[location]);
};
exports.fetchSingleLocationREST = fetchSingleLocationREST;
const fetchManyLocationsGraphQL = locations => {
  // Extract locations list and validate
  if (!Array.isArray(locations) || !locations.length || !locations.every(loc => typeof loc === 'string')) {
    return Promise.reject(new Error('Locations list is not valid; must be non-empty array of only strings'));
  }
  // Execute GraphQL query and pipe results to processing function
  return new Promise((resolve, reject) => {
    _NeonGraphQL.default.getManyLocationsByName(locations).pipe(
    // Success
    (0, _rxjs.map)(result => {
      if (!result.response || !result.response.data || !Array.isArray(result.response.data.locations)) {
        reject(new Error('Malformed response'));
        return (0, _rxjs.of)(false);
      }
      resolve(result.response.data.locations);
      return (0, _rxjs.of)(true);
    }),
    // Error
    (0, _rxjs.catchError)(error => {
      reject(new Error(error.message));
      return (0, _rxjs.of)(false);
    })).subscribe();
  }).then(data => (0, _parseLocationsArray.default)(data));
};

// Additional items exported for unit testing
exports.fetchManyLocationsGraphQL = fetchManyLocationsGraphQL;
const getTestableItems = () => process.env.NODE_ENV !== 'test' ? {} : {
  domainIsValid
};
exports.getTestableItems = getTestableItems;