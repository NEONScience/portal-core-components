"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DIMENSIONALITIES = exports.TYPES = void 0;

var _rxjs = require("rxjs");

var _ajax = require("rxjs/ajax");

var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  return JSON.stringify({
    query: query
  });
};

var getObservable = function getObservable() {
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

  if (!query.length) {
    return (0, _rxjs.of)(null);
  }

  return (0, _ajax.ajax)({
    method: 'POST',
    crossDomain: true,
    url: _NeonEnvironment.default.getFullGraphqlPath(),
    headers: {
      'Content-Type': 'application/json'
    },
    body: query,
    responseType: 'json'
  });
};

var NeonGraphQL = {};

NeonGraphQL.getDataProductByCode = function (code) {
  return getObservable(TYPES.DATA_PRODUCTS, DIMENSIONALITIES.ONE, code);
};

NeonGraphQL.getAllDataProducts = function () {
  return getObservable(TYPES.DATA_PRODUCTS, DIMENSIONALITIES.MANY);
};

NeonGraphQL.getSiteByCode = function (code) {
  return getObservable(TYPES.SITES, DIMENSIONALITIES.ONE, code);
};

NeonGraphQL.getAllSites = function () {
  return getObservable(TYPES.SITES, DIMENSIONALITIES.MANY);
};

Object.freeze(_NeonEnvironment.default);
var _default = NeonGraphQL;
exports.default = _default;