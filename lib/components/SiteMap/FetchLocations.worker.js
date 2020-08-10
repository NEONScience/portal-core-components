"use strict";

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _NeonGraphQL = _interopRequireDefault(require("../NeonGraphQL/NeonGraphQL"));

var _SiteMapWorkerSafeUtils = require("./SiteMapWorkerSafeUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetchLocations = function fetchLocations(event) {
  var locations = event.data || {}; // Extract locations list and validate

  if (!Array.isArray(locations) || !locations.length || !locations.every(function (loc) {
    return typeof loc === 'string';
  })) {
    postMessage({
      status: 'error',
      error: 'Locations list is not valid; must be non-empty array of only strings'
    });
    return;
  } // Execute GraphQL query and pipe results to processing function


  var obs = _NeonGraphQL.default.getManyLocationsByName(locations).pipe( // Success
  (0, _operators.map)(function (result) {
    if (!result.response || !result.response.data || !Array.isArray(result.response.data.locations)) {
      postMessage({
        status: 'error',
        error: 'Malformed response'
      });
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
    postMessage({
      status: 'success',
      data: data
    });
    return (0, _rxjs.of)(true);
  }), // Error
  (0, _operators.catchError)(function (error) {
    postMessage({
      status: 'error',
      error: error
    });
    return (0, _rxjs.of)(false);
  }));

  obs.subscribe();
}; // Listen for the locations list


self.addEventListener("message", fetchLocations);