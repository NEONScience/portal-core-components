import cloneDeep from 'lodash/cloneDeep';
import NeonContext from '../../NeonContext/NeonContext';
export var FetchStatus = /*#__PURE__*/ function(FetchStatus) {
    FetchStatus["AWAITING_CALL"] = "AWAITING_CALL";
    FetchStatus["FETCHING"] = "FETCHING";
    FetchStatus["ERROR"] = "ERROR";
    FetchStatus["SUCCESS"] = "SUCCESS";
    FetchStatus["IDLE"] = "IDLE";
    return FetchStatus;
}({});
export var ContextStatus = /*#__PURE__*/ function(ContextStatus) {
    ContextStatus["INITIALIZING"] = "INITIALIZING";
    ContextStatus["HAS_FETCHES_TO_TRIGGER"] = "HAS_FETCHES_TO_TRIGGER";
    ContextStatus["FETCHING"] = "FETCHING";
    ContextStatus["READY"] = "READY";
    ContextStatus["ERROR"] = "ERROR";
    return ContextStatus;
}({});
const DEFAULT_STATE = {
    productCode: null,
    release: null,
    component: {
        status: "INITIALIZING",
        error: null
    },
    fetches: {
        product: null,
        productReleases: {},
        productReleaseDois: {},
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
        // Product / release DOI status
        productReleaseDois: {},
        // Latest and provisional bundle parent product metadata
        bundleParents: {},
        // Bundle parent product metadata on a per-release basis
        bundleParentReleases: {},
        // List of release objects; fed from base product or bundle inheritance
        releases: []
    },
    neonContextState: cloneDeep(NeonContext.DEFAULT_STATE)
};
export const getDefaultState = ()=>cloneDeep(DEFAULT_STATE);
