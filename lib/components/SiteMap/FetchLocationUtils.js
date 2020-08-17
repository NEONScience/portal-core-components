"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchLocations = exports.fetchDomainHierarchy = exports.parseLocationHierarchy = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _NeonApi = _interopRequireDefault(require("../NeonApi/NeonApi"));

var _NeonGraphQL = _interopRequireDefault(require("../NeonGraphQL/NeonGraphQL"));

var _SiteMapWorkerSafeUtils = require("./SiteMapWorkerSafeUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 Recursive function to parse a deeply nest hierarchy object into a flat key/value object
 where keys are location names and values are objects containing only those location attributes
 the hierarchy affords us (type, description, and parent)
*/
var parseLocationHierarchy = function parseLocationHierarchy(inHierarchy) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var outHierarchy = {};
  var name = inHierarchy.locationParentHierarchy ? null : inHierarchy.locationName;
  var description = inHierarchy.locationDescription || null;
  var type = inHierarchy.locationType || null;

  if (description.includes('Not Used')) {
    return outHierarchy;
  }

  if (name !== null) {
    outHierarchy[name] = {
      type: type,
      description: description,
      parent: parent
    };
  }

  inHierarchy.locationChildHierarchy.forEach(function (subLocation) {
    outHierarchy = _extends(_extends({}, outHierarchy), parseLocationHierarchy(subLocation, name));
  });
  return outHierarchy;
};

exports.parseLocationHierarchy = parseLocationHierarchy;

var domainIsValid = function domainIsValid(domainString) {
  if (typeof domainString !== 'string') {
    return false;
  }

  var domainTest = /^D([0-9]{2})$/.exec(domainString);

  if (!domainTest) {
    return false;
  }

  var domainNumber = Number.parseInt(domainTest[1], 10);

  if (Number.isNaN(domainNumber) || domainNumber < 1 || domainNumber > 20) {
    return false;
  }

  return true;
};

var fetchDomainHierarchy = function fetchDomainHierarchy(domain) {
  if (!domainIsValid) {
    return Promise.reject(new Error('Domain is not valid'));
  } // Execute Locations REST API hierarchy fetch and pipe results to processing function


  return new Promise(function (resolve, reject) {
    _NeonApi.default.getSiteLocationHierarchyObservable(domain).pipe((0, _operators.map)(function (response) {
      if (response && response.data) {
        var data = {};
        response.data.locationChildHierarchy.forEach(function (child) {
          // At the top level we only care about sites and don't want the HQ test site
          if (child.locationType !== 'SITE' || child.locationName === 'HQTW') {
            return;
          }

          data[child.locationName] = parseLocationHierarchy(child);
        });
        resolve(data);
        return (0, _rxjs.of)(true);
      }

      reject(new Error('Malformed response'));
      return (0, _rxjs.of)(false);
    }), (0, _operators.catchError)(function (error) {
      reject(new Error(error.message));
      return (0, _rxjs.of)(false);
    })).subscribe();
  });
};

exports.fetchDomainHierarchy = fetchDomainHierarchy;

var fetchLocations = function fetchLocations(locations) {
  // Extract locations list and validate
  if (!Array.isArray(locations) || !locations.length || !locations.every(function (loc) {
    return typeof loc === 'string';
  })) {
    return Promise.reject(new Error('Locations list is not valid; must be non-empty array of only strings'));
  } // Execute GraphQL query and pipe results to processing function


  return new Promise(function (resolve, reject) {
    _NeonGraphQL.default.getManyLocationsByName(locations).pipe( // Success
    (0, _operators.map)(function (result) {
      if (!result.response || !result.response.data || !Array.isArray(result.response.data.locations)) {
        reject(new Error('Malformed response'));
        return (0, _rxjs.of)(false);
      }

      var data = {};
      result.response.data.locations.forEach(function (rawLocationData) {
        var locationName = rawLocationData.locationName;

        if (!locationName) {
          return;
        }

        data[locationName] = (0, _SiteMapWorkerSafeUtils.parseLocationData)(rawLocationData);
      });
      resolve(data);
      return (0, _rxjs.of)(true);
    }), // Error
    (0, _operators.catchError)(function (error) {
      reject(new Error(error.message));
      return (0, _rxjs.of)(false);
    })).subscribe();
  });
};

exports.fetchLocations = fetchLocations;