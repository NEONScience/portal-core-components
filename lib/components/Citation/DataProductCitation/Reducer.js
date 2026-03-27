import ReleaseService from '../../../service/ReleaseService';
import { exists, existsNonEmpty, isStringNonEmpty } from '../../../util/typeUtil';
import Service from './Service';
import ActionCreator, { ActionTypes } from './Actions';
import { ContextStatus, FetchStatus, getDefaultState } from './State';
const reinitialize = (state, action)=>{
    const defaultState = getDefaultState();
    // Calculate new initialized state, keep relevant
    // computed values from context.
    return Service.calculateContextState({
        ...defaultState,
        productCode: action.productCode,
        release: action.release,
        neonContextState: state.neonContextState,
        data: {
            ...defaultState.data,
            releases: ReleaseService.applyUserReleases(state.neonContextState, defaultState.data.releases)
        }
    }, state.neonContextState, action.release, action.productCode);
};
const isErrorTypeAction = (action)=>'type' in action && 'error' in action;
const resolveError = (action, state)=>{
    if (!isErrorTypeAction(action)) {
        return null;
    }
    let result = null;
    if (exists(action.error)) {
        if (isStringNonEmpty(action.error)) {
            result = action.error;
        } else {
            const resolved = action.error;
            if (exists(resolved.response)) {
                const resolvedResponse = resolved.response;
                if (exists(resolvedResponse.error)) {
                    const resolvedErrorResponse = resolvedResponse.error;
                    if (exists(resolvedErrorResponse.detail)) {
                        result = resolvedErrorResponse.detail;
                    }
                }
            } else if (isStringNonEmpty(resolved.message)) {
                result = resolved.message;
            } else {
                result = action.error;
            }
        }
    }
    let fetchProductFailedAction;
    let fetchProductReleaseFailedAction;
    let fetchProductReleaseDoiFailedAction;
    let fetchBundleParentFailedAction;
    let fetchBundleParentReleaseFailedAction;
    let fetchCitationDownloadFailedAction;
    switch(action.type){
        case ActionTypes.FETCH_PRODUCT_FAILED:
            fetchProductFailedAction = action;
            result = `${result}: product code ${fetchProductFailedAction.productCode}`;
            break;
        case ActionTypes.FETCH_PRODUCT_RELEASE_FAILED:
            fetchProductReleaseFailedAction = action;
            result = `${result}: ${fetchProductReleaseFailedAction.release}`;
            break;
        case ActionTypes.FETCH_PRODUCT_RELEASE_DOI_FAILED:
            fetchProductReleaseDoiFailedAction = action;
            result = `${result}: ${fetchProductReleaseDoiFailedAction.release}`;
            break;
        case ActionTypes.FETCH_BUNDLE_PARENT_FAILED:
            fetchBundleParentFailedAction = action;
            result = `${result}: bundle parent product code ` + `${fetchBundleParentFailedAction.bundleParent}`;
            break;
        case ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_FAILED:
            fetchBundleParentReleaseFailedAction = action;
            result = `${result}: bundle parent product code ` + `${fetchBundleParentReleaseFailedAction.bundleParent}; ` + `release ${fetchBundleParentReleaseFailedAction.release}`;
            break;
        case ActionTypes.FETCH_CITATION_DOWNLOAD_FAILED:
            fetchCitationDownloadFailedAction = action;
            result = `${result}: citation download key: ${fetchCitationDownloadFailedAction.key}`;
            break;
        case ActionTypes.ERROR:
        default:
            break;
    }
    return result;
};
const Reducer = (state, action)=>{
    const newState = {
        ...state
    };
    let errorResult = null;
    if (isErrorTypeAction(action)) {
        errorResult = resolveError(action, newState);
    }
    let product;
    let productReleaseDoiStatus;
    let release;
    let bundleParent;
    let fetchStatusState;
    let setProductCodeAction;
    let setReleaseAction;
    let fpSucceededAction;
    let fprStartedAction;
    let fprFailedAction;
    let fprSucceededAction;
    let fprdStartedAction;
    let fprdFailedAction;
    let fprdSucceededAction;
    let fbpStartedAction;
    let fbpFailedAction;
    let fbpSucceededAction;
    let fbprStartedAction;
    let fbprFailedAction;
    let fbprSucceededAction;
    let fcdStartedAction;
    let fcdFailedAction;
    let fcdSucceededAction;
    let fcdResetAction;
    switch(action.type){
        case ActionTypes.REINITIALIZE:
            // Reset the context state to default state, but keep the
            // finalized NeonContext state.
            return reinitialize(state, action);
        case ActionTypes.ERROR:
            newState.component.status = ContextStatus.ERROR;
            newState.component.error = errorResult;
            return newState;
        case ActionTypes.SET_PRODUCT_CODE:
            setProductCodeAction = action;
            return reinitialize(state, ActionCreator.setParams(setProductCodeAction.productCode, state.release));
        case ActionTypes.SET_RELEASE:
            setReleaseAction = action;
            return reinitialize(state, ActionCreator.setParams(state.productCode, setReleaseAction.release));
        case ActionTypes.SET_PARAMS:
            return reinitialize(state, action);
        case ActionTypes.STORE_FINALIZED_NEON_CONTEXT_STATE:
            newState.data.releases = ReleaseService.applyUserReleases(action.neonContextState, newState.data.releases);
            return Service.calculateContextState(newState, action.neonContextState, newState.release, newState.productCode);
        case ActionTypes.FETCH_PRODUCT_STARTED:
            if (exists(newState.fetches.product)) {
                newState.fetches.product.status = FetchStatus.FETCHING;
            }
            return Service.calculateAppStatus(newState);
        case ActionTypes.FETCH_PRODUCT_FAILED:
            if (!exists(newState.fetches.product)) {
                newState.fetches.product = {
                    status: FetchStatus.AWAITING_CALL
                };
            }
            fetchStatusState = newState.fetches.product;
            fetchStatusState.status = FetchStatus.ERROR;
            fetchStatusState.error = errorResult;
            newState.component.error = errorResult;
            return Service.calculateAppStatus(newState);
        case ActionTypes.FETCH_PRODUCT_SUCCEEDED:
            if (!exists(newState.fetches.product)) {
                newState.fetches.product = {
                    status: FetchStatus.AWAITING_CALL
                };
            }
            fetchStatusState = newState.fetches.product;
            fetchStatusState.status = FetchStatus.SUCCESS;
            fpSucceededAction = action;
            newState.data.product = fpSucceededAction.data;
            newState.data.product.releases = ReleaseService.sortReleases(newState.data.product.releases);
            return Service.calculateAppStatus(Service.calculateFetches(Service.applyReleasesGlobally(newState, newState.data.product.releases)));
        case ActionTypes.FETCH_PRODUCT_RELEASE_STARTED:
            fprStartedAction = action;
            release = fprStartedAction.release;
            newState.fetches.productReleases[release].status = FetchStatus.FETCHING;
            return Service.calculateAppStatus(newState);
        case ActionTypes.FETCH_PRODUCT_RELEASE_FAILED:
            fprFailedAction = action;
            release = fprFailedAction.release;
            newState.fetches.productReleases[release].status = FetchStatus.ERROR;
            newState.fetches.productReleases[release].error = errorResult;
            newState.component.error = errorResult;
            return Service.calculateAppStatus(newState);
        case ActionTypes.FETCH_PRODUCT_RELEASE_SUCCEEDED:
            fprSucceededAction = action;
            release = fprSucceededAction.release;
            product = fprSucceededAction.data;
            newState.fetches.productReleases[release].status = FetchStatus.SUCCESS;
            newState.data.productReleases[release] = product;
            return Service.calculateAppStatus(newState);
        case ActionTypes.FETCH_PRODUCT_RELEASE_DOI_STARTED:
            fprdStartedAction = action;
            release = fprdStartedAction.release;
            newState.fetches.productReleaseDois[release].status = FetchStatus.FETCHING;
            return Service.calculateAppStatus(newState);
        case ActionTypes.FETCH_PRODUCT_RELEASE_DOI_FAILED:
            fprdFailedAction = action;
            release = fprdFailedAction.release;
            newState.fetches.productReleaseDois[release].status = FetchStatus.ERROR;
            newState.fetches.productReleaseDois[release].error = errorResult;
            newState.component.error = errorResult;
            return Service.calculateAppStatus(newState);
        case ActionTypes.FETCH_PRODUCT_RELEASE_DOI_SUCCEEDED:
            fprdSucceededAction = action;
            release = fprdSucceededAction.release;
            productReleaseDoiStatus = fprdSucceededAction.data;
            newState.fetches.productReleaseDois[release].status = FetchStatus.SUCCESS;
            if (!exists(productReleaseDoiStatus)) {
                newState.data.productReleaseDois[release] = null;
            } else if (Array.isArray(productReleaseDoiStatus)) {
                if (existsNonEmpty(productReleaseDoiStatus)) {
                    // eslint-disable-next-line max-len
                    newState.data.productReleaseDois[release] = productReleaseDoiStatus.filter((dpds)=>exists(dpds) && exists(dpds.status));
                } else {
                    newState.data.productReleaseDois[release] = null;
                }
            } else if (exists(productReleaseDoiStatus.status)) {
                newState.data.productReleaseDois[release] = productReleaseDoiStatus;
            } else {
                newState.data.productReleaseDois[release] = null;
            }
            return Service.calculateAppStatus(Service.applyDoiStatusReleaseGlobally(newState, fprdSucceededAction.productCode, release, newState.data.productReleaseDois[release]));
        case ActionTypes.FETCH_BUNDLE_PARENT_STARTED:
            fbpStartedAction = action;
            bundleParent = fbpStartedAction.bundleParent;
            newState.fetches.bundleParents[bundleParent].status = FetchStatus.FETCHING;
            return Service.calculateAppStatus(newState);
        case ActionTypes.FETCH_BUNDLE_PARENT_FAILED:
            fbpFailedAction = action;
            bundleParent = fbpFailedAction.bundleParent;
            newState.fetches.bundleParents[bundleParent].status = FetchStatus.ERROR;
            newState.fetches.bundleParents[bundleParent].error = errorResult;
            newState.component.error = errorResult;
            return Service.calculateAppStatus(newState);
        case ActionTypes.FETCH_BUNDLE_PARENT_SUCCEEDED:
            fbpSucceededAction = action;
            bundleParent = fbpSucceededAction.bundleParent;
            product = fbpSucceededAction.data;
            newState.fetches.bundleParents[bundleParent].status = FetchStatus.SUCCESS;
            newState.data.bundleParents[bundleParent] = product;
            newState.data.bundleParents[bundleParent].releases = ReleaseService.sortReleases(product.releases);
            return Service.calculateAppStatus(Service.calculateFetches(Service.applyReleasesGlobally(newState, newState.data.bundleParents[bundleParent].releases)));
        case ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_STARTED:
            fbprStartedAction = action;
            bundleParent = fbprStartedAction.bundleParent;
            release = fbprStartedAction.release;
            newState.fetches.bundleParentReleases[bundleParent][release].status = FetchStatus.FETCHING;
            return Service.calculateAppStatus(newState);
        case ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_FAILED:
            fbprFailedAction = action;
            bundleParent = fbprFailedAction.bundleParent;
            release = fbprFailedAction.release;
            newState.fetches.bundleParentReleases[bundleParent][release].status = FetchStatus.ERROR;
            newState.fetches.bundleParentReleases[bundleParent][release].error = errorResult;
            newState.component.error = errorResult;
            return Service.calculateAppStatus(newState);
        case ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_SUCCEEDED:
            fbprSucceededAction = action;
            bundleParent = fbprSucceededAction.bundleParent;
            release = fbprSucceededAction.release;
            product = fbprSucceededAction.data;
            newState.fetches.bundleParentReleases[bundleParent][release].status = FetchStatus.SUCCESS;
            if (!exists(newState.data.bundleParentReleases[bundleParent])) {
                newState.data.bundleParentReleases[bundleParent] = {};
            }
            newState.data.bundleParentReleases[bundleParent][release] = product;
            return Service.calculateAppStatus(newState);
        case ActionTypes.FETCH_CITATION_DOWNLOAD_STARTED:
            fcdStartedAction = action;
            newState.fetches.citationDownloads[fcdStartedAction.key] = {
                status: FetchStatus.FETCHING
            };
            return newState;
        case ActionTypes.FETCH_CITATION_DOWNLOAD_FAILED:
            fcdFailedAction = action;
            newState.fetches.citationDownloads[fcdFailedAction.key] = {
                status: FetchStatus.ERROR,
                error: errorResult
            };
            return newState;
        case ActionTypes.FETCH_CITATION_DOWNLOAD_SUCCEEDED:
            fcdSucceededAction = action;
            newState.fetches.citationDownloads[fcdSucceededAction.key] = {
                status: FetchStatus.SUCCESS
            };
            return newState;
        case ActionTypes.FETCH_CITATION_DOWNLOAD_RESET:
            fcdResetAction = action;
            newState.fetches.citationDownloads[fcdResetAction.key] = {
                status: FetchStatus.IDLE
            };
            return newState;
        default:
            return state;
    }
};
export default Reducer;
