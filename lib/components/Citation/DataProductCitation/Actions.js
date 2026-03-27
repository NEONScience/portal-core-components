export var ActionTypes = /*#__PURE__*/ function(ActionTypes) {
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
    ActionTypes["FETCH_PRODUCT_RELEASE_DOI_STARTED"] = "FETCH_PRODUCT_RELEASE_DOI_STARTED";
    ActionTypes["FETCH_PRODUCT_RELEASE_DOI_FAILED"] = "FETCH_PRODUCT_RELEASE_DOI_FAILED";
    ActionTypes["FETCH_PRODUCT_RELEASE_DOI_SUCCEEDED"] = "FETCH_PRODUCT_RELEASE_DOI_SUCCEEDED";
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
    return ActionTypes;
}({});
const ActionCreator = {
    reinitialize: (productCode, release)=>({
            type: "REINITIALIZE",
            productCode,
            release
        }),
    error: (error)=>({
            type: "ERROR",
            error
        }),
    setProductCode: (productCode)=>({
            type: "SET_PRODUCT_CODE",
            productCode
        }),
    setRelease: (release)=>({
            type: "SET_RELEASE",
            release
        }),
    setParams: (productCode, release)=>({
            type: "SET_PARAMS",
            productCode,
            release
        }),
    storeFinalizedNeonContextState: (neonContextState)=>({
            type: "STORE_FINALIZED_NEON_CONTEXT_STATE",
            neonContextState
        }),
    fetchProductStarted: ()=>({
            type: "FETCH_PRODUCT_STARTED"
        }),
    fetchProductFailed: (error)=>({
            type: "FETCH_PRODUCT_FAILED",
            error
        }),
    fetchProductSucceeded: (data)=>({
            type: "FETCH_PRODUCT_SUCCEEDED",
            data
        }),
    fetchProductReleaseStarted: (release)=>({
            type: "FETCH_PRODUCT_RELEASE_STARTED",
            release
        }),
    fetchProductReleaseFailed: (release, error)=>({
            type: "FETCH_PRODUCT_RELEASE_FAILED",
            release,
            error
        }),
    fetchProductReleaseSucceeded: (release, data)=>({
            type: "FETCH_PRODUCT_RELEASE_SUCCEEDED",
            release,
            data
        }),
    fetchProductReleaseDoiStarted: (release)=>({
            type: "FETCH_PRODUCT_RELEASE_DOI_STARTED",
            release
        }),
    fetchProductReleaseDoiFailed: (release, error)=>({
            type: "FETCH_PRODUCT_RELEASE_DOI_FAILED",
            release,
            error
        }),
    fetchProductReleaseDoiSucceeded: (productCode, release, data)=>({
            type: "FETCH_PRODUCT_RELEASE_DOI_SUCCEEDED",
            productCode,
            release,
            data
        }),
    fetchBundleParentStarted: (bundleParent)=>({
            type: "FETCH_BUNDLE_PARENT_STARTED",
            bundleParent
        }),
    fetchBundleParentFailed: (bundleParent, error)=>({
            type: "FETCH_BUNDLE_PARENT_FAILED",
            bundleParent,
            error
        }),
    fetchBundleParentSucceeded: (bundleParent, data)=>({
            type: "FETCH_BUNDLE_PARENT_SUCCEEDED",
            bundleParent,
            data
        }),
    fetchBundleParentReleaseStarted: (bundleParent, release)=>({
            type: "FETCH_BUNDLE_PARENT_RELEASE_STARTED",
            bundleParent,
            release
        }),
    fetchBundleParentReleaseFailed: (bundleParent, release, error)=>({
            type: "FETCH_BUNDLE_PARENT_RELEASE_FAILED",
            bundleParent,
            release,
            error
        }),
    fetchBundleParentReleaseSucceeded: (bundleParent, release, data)=>({
            type: "FETCH_BUNDLE_PARENT_RELEASE_SUCCEEDED",
            bundleParent,
            release,
            data
        }),
    fetchCitationDownloadStarted: (key)=>({
            type: "FETCH_CITATION_DOWNLOAD_STARTED",
            key
        }),
    fetchCitationDownloadFailed: (key, error)=>({
            type: "FETCH_CITATION_DOWNLOAD_FAILED",
            key,
            error
        }),
    fetchCitationDownloadSucceeded: (key)=>({
            type: "FETCH_CITATION_DOWNLOAD_SUCCEEDED",
            key
        }),
    fetchCitationDownloadReset: (key)=>({
            type: "FETCH_CITATION_DOWNLOAD_RESET",
            key
        })
};
export default ActionCreator;
