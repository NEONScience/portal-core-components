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
  SITES: 'SITES'
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
  var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var query = '';

  switch (type) {
    case TYPES.DATA_PRODUCTS:
      if (dimensionality === DIMENSIONALITIES.ONE) {
        // TODO: Add support for deeper product data when querying for one
        query = "query Products {\n          product (productCode: \"".concat(id, "\") {\n            productCode\n            productName\n            productDescription\n            productScienceTeam\n            productHasExpanded\n            productBasicDescription\n            productExpandedDescription\n            productPublicationFormatType\n            keywords\n            themes\n            siteCodes {\n              siteCode\n              availableMonths\n            }\n          }\n        }");
      } else {
        query = "query Products {\n          products {\n            productCode\n            productName\n            productDescription\n            productScienceTeam\n            productHasExpanded\n            productBasicDescription\n            productExpandedDescription\n            productPublicationFormatType\n            keywords\n            themes\n            siteCodes {\n              siteCode\n              availableMonths\n            }\n          }\n        }";
      }

      break;

    case TYPES.SITES:
      if (dimensionality === DIMENSIONALITIES.ONE) {
        // TODO: Add support for deeper site data when querying for one
        query = "query Sites {\n          site (siteCode: \"".concat(id, "\") {\n            siteCode\n            siteDescription\n            siteType\n            siteLatitude\n            siteLongitude\n            domainCode\n            stateCode\n          }\n        }");
      } else {
        query = "query Sites {\n          sites {\n            siteCode\n            siteDescription\n            siteType\n            siteLatitude\n            siteLongitude\n            domainCode\n            stateCode\n          }\n        }";
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
    request.headers = _extends({}, request.headers, {}, _NeonApi.default.getApiTokenHeader(request.headers));
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
  var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (!TYPES[type] || !DIMENSIONALITIES[dimensionality]) {
    return null;
  }

  if (dimensionality === DIMENSIONALITIES.ONE && !id) {
    return null;
  }

  var query = getQueryBody(type, dimensionality, id);
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