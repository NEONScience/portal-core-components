"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultState = exports.FetchStatus = exports.ContextStatus = void 0;

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _NeonContext = _interopRequireDefault(require("../../NeonContext/NeonContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FetchStatus;
exports.FetchStatus = FetchStatus;

(function (FetchStatus) {
  FetchStatus["AWAITING_CALL"] = "AWAITING_CALL";
  FetchStatus["FETCHING"] = "FETCHING";
  FetchStatus["ERROR"] = "ERROR";
  FetchStatus["SUCCESS"] = "SUCCESS";
  FetchStatus["IDLE"] = "IDLE";
})(FetchStatus || (exports.FetchStatus = FetchStatus = {}));

var ContextStatus;
exports.ContextStatus = ContextStatus;

(function (ContextStatus) {
  ContextStatus["INITIALIZING"] = "INITIALIZING";
  ContextStatus["HAS_FETCHES_TO_TRIGGER"] = "HAS_FETCHES_TO_TRIGGER";
  ContextStatus["FETCHING"] = "FETCHING";
  ContextStatus["READY"] = "READY";
  ContextStatus["ERROR"] = "ERROR";
})(ContextStatus || (exports.ContextStatus = ContextStatus = {}));

var DEFAULT_STATE = {
  productCode: null,
  release: null,
  component: {
    status: ContextStatus.INITIALIZING,
    error: null
  },
  fetches: {
    product: null,
    productReleases: {},
    bundleParents: {},
    bundleParentReleases: {},
    citationDownloads: {}
  },
  bundle: {
    parentCodes: [],
    doiProductCode: null
  },
  data: {
    // Latest and provisional product metadata
    product: null,
    // Product metadata on a per-release basis
    productReleases: {},
    // Latest and provisional bundle parent product metadata
    bundleParents: {},
    // Bundle parent product metadata on a per-release basis
    bundleParentReleases: {},
    // List of release objects; fed from base product or bundle inheritance
    releases: []
  },
  neonContextState: (0, _cloneDeep.default)(_NeonContext.default.DEFAULT_STATE)
};

var getDefaultState = function getDefaultState() {
  return (0, _cloneDeep.default)(DEFAULT_STATE);
};

exports.getDefaultState = getDefaultState;