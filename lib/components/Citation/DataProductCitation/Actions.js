"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ActionTypes = void 0;
var ActionTypes;
exports.ActionTypes = ActionTypes;

(function (ActionTypes) {
  ActionTypes["REINITIALIZE"] = "REINITIALIZE";
  ActionTypes["ERROR"] = "ERROR";
  ActionTypes["SET_PRODUCT_CODE"] = "SET_PRODUCT_CODE";
  ActionTypes["SET_RELEASE"] = "SET_RELEASE";
  ActionTypes["SET_PARAMS"] = "SET_PARAMS";
  ActionTypes["STORE_FINALIZED_NEON_CONTEXT_STATE"] = "STORE_FINALIZED_NEON_CONTEXT_STATE";
  ActionTypes["FETCH_PRODUCT_STARTED"] = "FETCH_PRODUCT_STARTED";
  ActionTypes["FETCH_PRODUCT_FAILED"] = "FETCH_PRODUCT_FAILED";
  ActionTypes["FETCH_PRODUCT_SUCCEEDED"] = "FETCH_PRODUCT_SUCCEEDED";
  ActionTypes["FETCH_PRODUCT_RELEASE_STARTED"] = "FETCH_PRODUCT_RELEASE_STARTED";
  ActionTypes["FETCH_PRODUCT_RELEASE_FAILED"] = "FETCH_PRODUCT_RELEASE_FAILED";
  ActionTypes["FETCH_PRODUCT_RELEASE_SUCCEEDED"] = "FETCH_PRODUCT_RELEASE_SUCCEEDED";
  ActionTypes["FETCH_BUNDLE_PARENT_STARTED"] = "FETCH_BUNDLE_PARENT_STARTED";
  ActionTypes["FETCH_BUNDLE_PARENT_FAILED"] = "FETCH_BUNDLE_PARENT_FAILED";
  ActionTypes["FETCH_BUNDLE_PARENT_SUCCEEDED"] = "FETCH_BUNDLE_PARENT_SUCCEEDED";
  ActionTypes["FETCH_BUNDLE_PARENT_RELEASE_STARTED"] = "FETCH_BUNDLE_PARENT_RELEASE_STARTED";
  ActionTypes["FETCH_BUNDLE_PARENT_RELEASE_FAILED"] = "FETCH_BUNDLE_PARENT_RELEASE_FAILED";
  ActionTypes["FETCH_BUNDLE_PARENT_RELEASE_SUCCEEDED"] = "FETCH_BUNDLE_PARENT_RELEASE_SUCCEEDED";
  ActionTypes["FETCH_CITATION_DOWNLOAD_STARTED"] = "FETCH_CITATION_DOWNLOAD_STARTED";
  ActionTypes["FETCH_CITATION_DOWNLOAD_FAILED"] = "FETCH_CITATION_DOWNLOAD_FAILED";
  ActionTypes["FETCH_CITATION_DOWNLOAD_SUCCEEDED"] = "FETCH_CITATION_DOWNLOAD_SUCCEEDED";
  ActionTypes["FETCH_CITATION_DOWNLOAD_RESET"] = "FETCH_CITATION_DOWNLOAD_RESET";
})(ActionTypes || (exports.ActionTypes = ActionTypes = {}));

var ActionCreator = {
  reinitialize: function reinitialize(productCode, release) {
    return {
      type: ActionTypes.REINITIALIZE,
      productCode: productCode,
      release: release
    };
  },
  error: function error(_error) {
    return {
      type: ActionTypes.ERROR,
      error: _error
    };
  },
  setProductCode: function setProductCode(productCode) {
    return {
      type: ActionTypes.SET_PRODUCT_CODE,
      productCode: productCode
    };
  },
  setRelease: function setRelease(release) {
    return {
      type: ActionTypes.SET_RELEASE,
      release: release
    };
  },
  setParams: function setParams(productCode, release) {
    return {
      type: ActionTypes.SET_PARAMS,
      productCode: productCode,
      release: release
    };
  },
  storeFinalizedNeonContextState: function storeFinalizedNeonContextState(neonContextState) {
    return {
      type: ActionTypes.STORE_FINALIZED_NEON_CONTEXT_STATE,
      neonContextState: neonContextState
    };
  },
  fetchProductStarted: function fetchProductStarted() {
    return {
      type: ActionTypes.FETCH_PRODUCT_STARTED
    };
  },
  fetchProductFailed: function fetchProductFailed(error) {
    return {
      type: ActionTypes.FETCH_PRODUCT_FAILED,
      error: error
    };
  },
  fetchProductSucceeded: function fetchProductSucceeded(data) {
    return {
      type: ActionTypes.FETCH_PRODUCT_SUCCEEDED,
      data: data
    };
  },
  fetchProductReleaseStarted: function fetchProductReleaseStarted(release) {
    return {
      type: ActionTypes.FETCH_PRODUCT_RELEASE_STARTED,
      release: release
    };
  },
  fetchProductReleaseFailed: function fetchProductReleaseFailed(release, error) {
    return {
      type: ActionTypes.FETCH_PRODUCT_RELEASE_FAILED,
      release: release,
      error: error
    };
  },
  fetchProductReleaseSucceeded: function fetchProductReleaseSucceeded(release, data) {
    return {
      type: ActionTypes.FETCH_PRODUCT_RELEASE_SUCCEEDED,
      release: release,
      data: data
    };
  },
  fetchBundleParentStarted: function fetchBundleParentStarted(bundleParent) {
    return {
      type: ActionTypes.FETCH_BUNDLE_PARENT_STARTED,
      bundleParent: bundleParent
    };
  },
  fetchBundleParentFailed: function fetchBundleParentFailed(bundleParent, error) {
    return {
      type: ActionTypes.FETCH_BUNDLE_PARENT_FAILED,
      bundleParent: bundleParent,
      error: error
    };
  },
  fetchBundleParentSucceeded: function fetchBundleParentSucceeded(bundleParent, data) {
    return {
      type: ActionTypes.FETCH_BUNDLE_PARENT_SUCCEEDED,
      bundleParent: bundleParent,
      data: data
    };
  },
  fetchBundleParentReleaseStarted: function fetchBundleParentReleaseStarted(bundleParent, release) {
    return {
      type: ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_STARTED,
      bundleParent: bundleParent,
      release: release
    };
  },
  fetchBundleParentReleaseFailed: function fetchBundleParentReleaseFailed(bundleParent, release, error) {
    return {
      type: ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_FAILED,
      bundleParent: bundleParent,
      release: release,
      error: error
    };
  },
  fetchBundleParentReleaseSucceeded: function fetchBundleParentReleaseSucceeded(bundleParent, release, data) {
    return {
      type: ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_SUCCEEDED,
      bundleParent: bundleParent,
      release: release,
      data: data
    };
  },
  fetchCitationDownloadStarted: function fetchCitationDownloadStarted(key) {
    return {
      type: ActionTypes.FETCH_CITATION_DOWNLOAD_STARTED,
      key: key
    };
  },
  fetchCitationDownloadFailed: function fetchCitationDownloadFailed(key, error) {
    return {
      type: ActionTypes.FETCH_CITATION_DOWNLOAD_FAILED,
      key: key,
      error: error
    };
  },
  fetchCitationDownloadSucceeded: function fetchCitationDownloadSucceeded(key) {
    return {
      type: ActionTypes.FETCH_CITATION_DOWNLOAD_SUCCEEDED,
      key: key
    };
  },
  fetchCitationDownloadReset: function fetchCitationDownloadReset(key) {
    return {
      type: ActionTypes.FETCH_CITATION_DOWNLOAD_RESET,
      key: key
    };
  }
};
var _default = ActionCreator;
exports.default = _default;