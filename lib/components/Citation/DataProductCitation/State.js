"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_STATE = exports.CONTEXT_STATUS = exports.FETCH_STATUS = void 0;

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _NeonContext = _interopRequireDefault(require("../../NeonContext/NeonContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FETCH_STATUS = {
  AWAITING_CALL: 'AWAITING_CALL',
  FETCHING: 'FETCHING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS'
};
exports.FETCH_STATUS = FETCH_STATUS;
var CONTEXT_STATUS = {
  INITIALIZING: 'INITIALIZING',
  HAS_FETCHES_TO_TRIGGER: 'HAS_FETCHES_TO_TRIGGER',
  FETCHING: 'FETCHING',
  READY: 'READY',
  ERROR: 'ERROR'
};
exports.CONTEXT_STATUS = CONTEXT_STATUS;
var DEFAULT_STATE = {
  productCode: null,
  release: null,
  component: {
    status: CONTEXT_STATUS.INITIALIZING,
    error: null
  },
  fetches: {
    product: null,
    productReleases: {},
    bundleParents: {},
    bundleParentReleases: {}
  },
  bundle: {
    parentCodes: [],
    doiProductCode: null
  },
  data: {
    product: null,
    // Latest and provisional product metadata
    productReleases: {},
    // Product metadata on a per-release basis
    bundleParents: {},
    // Latest and provisional bundle parent product metadata
    bundleParentReleases: {},
    // Bundle parent product metadata on a per-release basis
    releases: [] // List of release objects; fed from base product or bundle inheritance

  },
  neonContextState: (0, _cloneDeep.default)(_NeonContext.default.DEFAULT_STATE)
};
exports.DEFAULT_STATE = DEFAULT_STATE;