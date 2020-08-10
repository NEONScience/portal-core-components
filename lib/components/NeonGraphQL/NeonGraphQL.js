"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DIMENSIONALITIES = exports.TYPES = void 0;

var _rxjs = require("rxjs");

var _ajax = require("rxjs/ajax");

var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));

var _NeonApi = _interopRequireDefault(require("../NeonApi/NeonApi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var TYPES = {
  DATA_PRODUCTS: 'DATA_PRODUCTS',
  SITES: 'SITES',
  LOCATIONS: 'LOCATIONS'
};
exports.TYPES = TYPES;
var DIMENSIONALITIES = {
  ONE: 'ONE',
  MANY: 'MANY'
};
exports.DIMENSIONALITIES = DIMENSIONALITIES;

var transformQuery = function transformQuery(query) {
  return JSON.stringify({
    query: query
  });
};

var getQueryBody = function getQueryBody() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var dimensionality = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var arg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var query = '';

  switch (type) {
    case TYPES.DATA_PRODUCTS:
      if (dimensionality === DIMENSIONALITIES.ONE) {
        // TODO: Add support for deeper product data when querying for one
        query = "query Products {\n          product (productCode: \"".concat(arg, "\") {\n            productCode\n            productName\n            productDescription\n            productScienceTeam\n            productHasExpanded\n            productBasicDescription\n            productExpandedDescription\n            productPublicationFormatType\n            keywords\n            themes\n            siteCodes {\n              siteCode\n              availableMonths\n            }\n          }\n        }");
      } else {
        query = "query Products {\n          products {\n            productCode\n            productName\n            productDescription\n            productScienceTeam\n            productHasExpanded\n            productBasicDescription\n            productExpandedDescription\n            productPublicationFormatType\n            keywords\n            themes\n            siteCodes {\n              siteCode\n              availableMonths\n            }\n          }\n        }";
      }

      break;

    case TYPES.SITES:
      if (dimensionality === DIMENSIONALITIES.ONE) {
        // TODO: Add support for deeper site data when querying for one
        query = "query Sites {\n          site (siteCode: \"".concat(arg, "\") {\n            siteCode\n            siteDescription\n            siteType\n            siteLatitude\n            siteLongitude\n            domainCode\n            stateCode\n          }\n        }");
      } else {
        query = "query Sites {\n          sites {\n            siteCode\n            siteDescription\n            siteType\n            siteLatitude\n            siteLongitude\n            domainCode\n            stateCode\n          }\n        }";
      }

      break;

    case TYPES.LOCATIONS:
      if (dimensionality === DIMENSIONALITIES.ONE) {
        query = "query Location {\n          location(name: \"".concat(arg, "\") {\n            locationName\n            locationDescription\n            locationType\n            domainCode\n            siteCode\n            locationDecimalLatitude\n            locationDecimalLongitude\n            locationElevation\n            locationPolygon {\n              coordinates {\n                latitude\n                longitude\n                elevation\n              }\n            }\n            locationProperties {\n              locationPropertyName\n              locationPropertyValue\n            }\n          }\n        }");
      } else {
        query = "query findLocations {\n          locations: findLocations(\n            query: { \n              locationNames: ".concat(JSON.stringify(arg), "\n            }\n          ) {\n            locationName\n            locationDescription\n            locationParent\n            locationType\n            domainCode\n            siteCode\n            locationDecimalLatitude\n            locationDecimalLongitude\n            locationElevation\n            locationPolygon {\n              coordinates {\n                latitude\n                longitude\n                elevation\n              }\n            }\n            locationProperties {\n              locationPropertyName\n              locationPropertyValue\n            }\n          }\n        }");
      }

      break;

    default:
      break;
  }

  return transformQuery(query);
};

var getAjaxRequest = function getAjaxRequest(body) {
  var includeToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var request = {
    method: 'POST',
    crossDomain: true,
    url: _NeonEnvironment.default.getFullGraphqlPath(),
    headers: {
      'Content-Type': 'application/json'
    },
    responseType: 'json',
    body: body
  };

  if (includeToken) {
    request.headers = _extends(_extends({}, request.headers), _NeonApi.default.getApiTokenHeader(request.headers));
  }

  return request;
};

var getObservable = function getObservable(query) {
  if (!query.length) {
    return (0, _rxjs.of)(null);
  }

  return (0, _ajax.ajax)(getAjaxRequest(query));
};

var getObservableWith = function getObservableWith() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var dimensionality = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var arg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  // Type and Dimensionality must exist
  if (!TYPES[type] || !DIMENSIONALITIES[dimensionality]) {
    return (0, _rxjs.of)(null);
  } // Dimensionality of ONE always requires some argument (looking up one thing)


  if (dimensionality === DIMENSIONALITIES.ONE && !arg) {
    return (0, _rxjs.of)(null);
  }

  var query = getQueryBody(type, dimensionality, arg);
  return getObservable(query);
};

var NeonGraphQL = {
  getDataProductByCode: function getDataProductByCode(code) {
    return getObservableWith(TYPES.DATA_PRODUCTS, DIMENSIONALITIES.ONE, code);
  },
  getAllDataProducts: function getAllDataProducts() {
    return getObservableWith(TYPES.DATA_PRODUCTS, DIMENSIONALITIES.MANY);
  },
  getSiteByCode: function getSiteByCode(code) {
    return getObservableWith(TYPES.SITES, DIMENSIONALITIES.ONE, code);
  },
  getAllSites: function getAllSites() {
    return getObservableWith(TYPES.SITES, DIMENSIONALITIES.MANY);
  },
  getLocationByName: function getLocationByName(name) {
    return getObservableWith(TYPES.LOCATIONS, DIMENSIONALITIES.ONE, name);
  },
  getManyLocationsByName: function getManyLocationsByName() {
    var names = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    if (!Array.isArray(names) || !names.length || !names.every(function (name) {
      return typeof name === 'string';
    })) {
      return (0, _rxjs.of)(null);
    }

    return getObservableWith(TYPES.LOCATIONS, DIMENSIONALITIES.MANY, names);
  },

  /**
   * Builds a custom GraphQL query
   * @param {string} query - The raw GraphQL query
   * @return The resulting RxJS Observable from the specified query
   */
  getGraphqlQuery: function getGraphqlQuery(query) {
    return getObservable(transformQuery(query));
  },

  /**
   * Builds a custom GraphQL AjaxRequest
   * @param {string} query - The raw GraphQL query
   * @return The resulting RxJS AjaxRequest
   */
  getGraphqlAjaxRequest: function getGraphqlAjaxRequest(query) {
    return getAjaxRequest(transformQuery(query));
  }
};
Object.freeze(NeonGraphQL);
var _default = NeonGraphQL;
exports.default = _default;