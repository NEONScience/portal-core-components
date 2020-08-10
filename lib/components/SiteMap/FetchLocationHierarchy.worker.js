"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseLocationHierarchy = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _NeonApi = _interopRequireDefault(require("../NeonApi/NeonApi"));

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

  if (isNaN(domainNumber) || domainNumber < 1 || domainNumber > 20) {
    return false;
  }

  return true;
};

var fetchHierarchy = function fetchHierarchy() {
  var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var domain = (event || {}).data || null; // Extract locations list and validate

  if (!domainIsValid(domain)) {
    postMessage({
      status: 'error',
      error: 'Domain is not valid. This worker only fetches domain hierarchies.'
    });
    return;
  } // Execute Locations REST API hierarchy fetch and pipe results to processing function


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
      postMessage({
        status: 'success',
        data: data
      });
      return (0, _rxjs.of)(true);
    }

    postMessage({
      status: 'error',
      error: 'Malformed response'
    });
    return (0, _rxjs.of)(false);
  }), (0, _operators.catchError)(function (error) {
    postMessage({
      status: 'error',
      error: error.message
    });
    return (0, _rxjs.of)(false);
  })).subscribe();
}; // Listen for the locations list


self.addEventListener('message', fetchHierarchy);