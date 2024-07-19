"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TYPES = exports.DIMENSIONALITIES = void 0;
var _rxjs = require("rxjs");
var _ajax = require("rxjs/ajax");
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _NeonApi = _interopRequireDefault(require("../NeonApi/NeonApi"));
var _typeUtil = require("../../util/typeUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TYPES = exports.TYPES = {
  DATA_PRODUCTS: 'DATA_PRODUCTS',
  SITES: 'SITES',
  LOCATIONS: 'LOCATIONS'
};
const DIMENSIONALITIES = exports.DIMENSIONALITIES = {
  ONE: 'ONE',
  MANY: 'MANY'
};
const transformQuery = query => JSON.stringify({
  query
});
const getAvailableReleaseClause = args => {
  if (!args) return '';
  const hasRelease = (0, _typeUtil.isStringNonEmpty)(args.release);
  let availableReleases = '';
  if (args.includeAvailableReleases === true && !hasRelease) {
    availableReleases = "availableReleases {\n      release\n      availableMonths\n    }";
  }
  return availableReleases;
};
const getQueryBody = function () {
  let type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let dimensionality = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  let args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let query = '';
  switch (type) {
    case TYPES.DATA_PRODUCTS:
      if (dimensionality === DIMENSIONALITIES.ONE) {
        // TODO: Add support for deeper product data when querying for one
        const releaseArgument = !args.release ? '' : ", release: \"".concat(args.release, "\"");
        const availableReleases = getAvailableReleaseClause(args);
        query = "query Products {\n          product (productCode: \"".concat(args.productCode, "\"").concat(releaseArgument, ") {\n            productCode\n            productName\n            productDescription\n            productScienceTeam\n            productHasExpanded\n            productBasicDescription\n            productExpandedDescription\n            productPublicationFormatType\n            keywords\n            themes\n            siteCodes {\n              siteCode\n              availableMonths\n              ").concat(availableReleases, "\n            }\n            releases {\n              release\n              generationDate\n              url\n            }\n          }\n        }");
      } else {
        const releaseArgument = !args.release ? '' : "(release: \"".concat(args.release, "\")");
        const availableReleases = getAvailableReleaseClause(args);
        query = "query Products {\n          products ".concat(releaseArgument, "{\n            productCode\n            productName\n            productDescription\n            productScienceTeam\n            productHasExpanded\n            productBasicDescription\n            productExpandedDescription\n            productPublicationFormatType\n            keywords\n            themes\n            siteCodes {\n              siteCode\n              availableMonths\n              ").concat(availableReleases, "\n            }\n            releases {\n              release\n              generationDate\n              url\n            }\n          }\n        }");
      }
      break;
    case TYPES.SITES:
      if (dimensionality === DIMENSIONALITIES.ONE) {
        // TODO: Add support for deeper site data when querying for one
        query = "query Sites {\n          site (siteCode: \"".concat(args.siteCode, "\") {\n            siteCode\n            siteDescription\n            siteType\n            siteLatitude\n            siteLongitude\n            domainCode\n            stateCode\n          }\n        }");
      } else {
        query = "query Sites {\n          sites {\n            siteCode\n            siteDescription\n            siteType\n            siteLatitude\n            siteLongitude\n            domainCode\n            stateCode\n          }\n        }";
      }
      break;
    case TYPES.LOCATIONS:
      if (dimensionality === DIMENSIONALITIES.ONE) {
        query = "query Location {\n          location(name: \"".concat(args.locationName, "\") {\n            locationName\n            locationDescription\n            locationType\n            domainCode\n            siteCode\n            locationDecimalLatitude\n            locationDecimalLongitude\n            locationElevation\n            locationPolygon {\n              coordinates {\n                latitude\n                longitude\n                elevation\n              }\n            }\n            locationProperties {\n              locationPropertyName\n              locationPropertyValue\n            }\n          }\n        }");
      } else {
        query = "query findLocations {\n          locations: findLocations(\n            query: {\n              locationNames: ".concat(JSON.stringify(args.locationNames), "\n            }\n          ) {\n            locationName\n            locationDescription\n            locationParent\n            locationType\n            domainCode\n            siteCode\n            locationDecimalLatitude\n            locationDecimalLongitude\n            locationElevation\n            locationPolygon {\n              coordinates {\n                latitude\n                longitude\n                elevation\n              }\n            }\n            locationProperties {\n              locationPropertyName\n              locationPropertyValue\n            }\n          }\n        }");
      }
      break;
    default:
      break;
  }
  return transformQuery(query);
};
const getAjaxRequest = function (body) {
  let includeToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  let withCredentials = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  let appliedWithCredentials = false;
  if (!(0, _typeUtil.exists)(withCredentials) || typeof withCredentials !== 'boolean') {
    appliedWithCredentials = _NeonEnvironment.default.requireCors();
  } else {
    appliedWithCredentials = withCredentials;
  }
  const request = {
    method: 'POST',
    crossDomain: true,
    withCredentials: appliedWithCredentials,
    url: _NeonEnvironment.default.getFullGraphqlPath(),
    headers: {
      'Content-Type': 'application/json'
    },
    responseType: 'json',
    body
  };
  if (includeToken) {
    request.headers = _extends({}, request.headers, _NeonApi.default.getApiTokenHeader(request.headers));
  }
  return request;
};
const getObservable = query => {
  if (!query.length) {
    return (0, _rxjs.of)(null);
  }
  return (0, _ajax.ajax)(getAjaxRequest(query));
};
const getObservableWith = function () {
  let type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  let dimensionality = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  let args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  const argsHaveAtLeastOneDefinedKey = args !== null && typeof args === 'object' && Object.keys(args).length > 0 && Object.keys(args).some(key => typeof args[key] !== 'undefined');
  // Type and Dimensionality must exist
  if (!TYPES[type] || !DIMENSIONALITIES[dimensionality]) {
    return (0, _rxjs.of)(null);
  }
  // Dimensionality of ONE always requires some argument (looking up one thing)
  if (dimensionality === DIMENSIONALITIES.ONE && !argsHaveAtLeastOneDefinedKey) {
    return (0, _rxjs.of)(null);
  }
  const query = getQueryBody(type, dimensionality, args);
  return getObservable(query);
};
const NeonGraphQL = {
  getDataProductByCode: function (productCode, release) {
    let includeAvailableReleases = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    return getObservableWith(TYPES.DATA_PRODUCTS, DIMENSIONALITIES.ONE, {
      productCode,
      release,
      includeAvailableReleases
    });
  },
  getAllDataProducts: function (release) {
    let includeAvailableReleases = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return getObservableWith(TYPES.DATA_PRODUCTS, DIMENSIONALITIES.MANY, {
      release,
      includeAvailableReleases
    });
  },
  getSiteByCode: siteCode => getObservableWith(TYPES.SITES, DIMENSIONALITIES.ONE, {
    siteCode
  }),
  getAllSites: () => getObservableWith(TYPES.SITES, DIMENSIONALITIES.MANY),
  getLocationByName: locationName => getObservableWith(TYPES.LOCATIONS, DIMENSIONALITIES.ONE, {
    locationName
  }),
  getManyLocationsByName: function () {
    let locationNames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    if (!Array.isArray(locationNames) || !locationNames.length || !locationNames.every(name => typeof name === 'string')) {
      return (0, _rxjs.of)(null);
    }
    return getObservableWith(TYPES.LOCATIONS, DIMENSIONALITIES.MANY, {
      locationNames
    });
  },
  /**
   * Builds a custom GraphQL query
   * @param {string} query - The raw GraphQL query
   * @return The resulting RxJS Observable from the specified query
   */
  getGraphqlQuery: query => getObservable(transformQuery(query)),
  /**
   * Builds a custom GraphQL AjaxRequest
   * @param {string} query - The raw GraphQL query
   * @return The resulting RxJS AjaxRequest
   */
  getGraphqlAjaxRequest: query => getAjaxRequest(transformQuery(query))
};
Object.freeze(NeonGraphQL);
var _default = exports.default = NeonGraphQL;