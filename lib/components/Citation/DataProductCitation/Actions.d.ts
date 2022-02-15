import { AjaxResponse } from 'rxjs/ajax';
import { AnyAction, Nullable, UnknownRecord } from '../../../types/core';
import { ContextDataProduct } from './State';
export declare enum ActionTypes {
    REINITIALIZE = "REINITIALIZE",
    ERROR = "ERROR",
    SET_PRODUCT_CODE = "SET_PRODUCT_CODE",
    SET_RELEASE = "SET_RELEASE",
    SET_PARAMS = "SET_PARAMS",
    STORE_FINALIZED_NEON_CONTEXT_STATE = "STORE_FINALIZED_NEON_CONTEXT_STATE",
    FETCH_PRODUCT_STARTED = "FETCH_PRODUCT_STARTED",
    FETCH_PRODUCT_FAILED = "FETCH_PRODUCT_FAILED",
    FETCH_PRODUCT_SUCCEEDED = "FETCH_PRODUCT_SUCCEEDED",
    FETCH_PRODUCT_RELEASE_STARTED = "FETCH_PRODUCT_RELEASE_STARTED",
    FETCH_PRODUCT_RELEASE_FAILED = "FETCH_PRODUCT_RELEASE_FAILED",
    FETCH_PRODUCT_RELEASE_SUCCEEDED = "FETCH_PRODUCT_RELEASE_SUCCEEDED",
    FETCH_BUNDLE_PARENT_STARTED = "FETCH_BUNDLE_PARENT_STARTED",
    FETCH_BUNDLE_PARENT_FAILED = "FETCH_BUNDLE_PARENT_FAILED",
    FETCH_BUNDLE_PARENT_SUCCEEDED = "FETCH_BUNDLE_PARENT_SUCCEEDED",
    FETCH_BUNDLE_PARENT_RELEASE_STARTED = "FETCH_BUNDLE_PARENT_RELEASE_STARTED",
    FETCH_BUNDLE_PARENT_RELEASE_FAILED = "FETCH_BUNDLE_PARENT_RELEASE_FAILED",
    FETCH_BUNDLE_PARENT_RELEASE_SUCCEEDED = "FETCH_BUNDLE_PARENT_RELEASE_SUCCEEDED",
    FETCH_CITATION_DOWNLOAD_STARTED = "FETCH_CITATION_DOWNLOAD_STARTED",
    FETCH_CITATION_DOWNLOAD_FAILED = "FETCH_CITATION_DOWNLOAD_FAILED",
    FETCH_CITATION_DOWNLOAD_SUCCEEDED = "FETCH_CITATION_DOWNLOAD_SUCCEEDED",
    FETCH_CITATION_DOWNLOAD_RESET = "FETCH_CITATION_DOWNLOAD_RESET"
}
export interface ReinitializeAction extends AnyAction {
    type: typeof ActionTypes.REINITIALIZE;
    productCode: string;
    release?: Nullable<string>;
}
export interface ErrorAction extends AnyAction {
    type: typeof ActionTypes.ERROR;
    error: Nullable<UnknownRecord | string>;
}
export interface SetProductCodeAction extends AnyAction {
    type: typeof ActionTypes.SET_PRODUCT_CODE;
    productCode: Nullable<string>;
}
export interface SetReleaseAction extends AnyAction {
    type: typeof ActionTypes.SET_RELEASE;
    release: Nullable<string>;
}
export interface SetParamsAction extends AnyAction {
    type: typeof ActionTypes.SET_PARAMS;
    productCode: Nullable<string>;
    release: Nullable<string>;
}
export interface StoreFinalizedNeonContextStateAction extends AnyAction {
    type: typeof ActionTypes.STORE_FINALIZED_NEON_CONTEXT_STATE;
    neonContextState: UnknownRecord;
}
export interface FetchProductStartedAction extends AnyAction {
    type: typeof ActionTypes.FETCH_PRODUCT_STARTED;
}
export interface FetchProductFailedAction extends AnyAction {
    type: typeof ActionTypes.FETCH_PRODUCT_FAILED;
    error: Nullable<AjaxResponse | string>;
}
export interface FetchProductSucceededAction extends AnyAction {
    type: typeof ActionTypes.FETCH_PRODUCT_SUCCEEDED;
    data: ContextDataProduct;
}
export interface FetchProductReleaseStartedAction extends AnyAction {
    type: typeof ActionTypes.FETCH_PRODUCT_RELEASE_STARTED;
    release: string;
}
export interface FetchProductReleaseFailedAction extends AnyAction {
    type: typeof ActionTypes.FETCH_PRODUCT_RELEASE_FAILED;
    release: string;
    error: Nullable<AjaxResponse | string>;
}
export interface FetchProductReleaseSucceededAction extends AnyAction {
    type: typeof ActionTypes.FETCH_PRODUCT_RELEASE_SUCCEEDED;
    release: string;
    data: ContextDataProduct;
}
export interface FetchBundleParentStartedAction extends AnyAction {
    type: typeof ActionTypes.FETCH_BUNDLE_PARENT_STARTED;
    bundleParent: string;
}
export interface FetchBundleParentFailedAction extends AnyAction {
    type: typeof ActionTypes.FETCH_BUNDLE_PARENT_FAILED;
    bundleParent: string;
    error: Nullable<AjaxResponse | string>;
}
export interface FetchBundleParentSucceededAction extends AnyAction {
    type: typeof ActionTypes.FETCH_BUNDLE_PARENT_SUCCEEDED;
    bundleParent: string;
    data: ContextDataProduct;
}
export interface FetchBundleParentReleaseStartedAction extends AnyAction {
    type: typeof ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_STARTED;
    bundleParent: string;
    release: string;
}
export interface FetchBundleParentReleaseFailedAction extends AnyAction {
    type: typeof ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_FAILED;
    bundleParent: string;
    release: string;
    error: Nullable<AjaxResponse | string>;
}
export interface FetchBundleParentReleaseSucceededAction extends AnyAction {
    type: typeof ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_SUCCEEDED;
    bundleParent: string;
    release: string;
    data: ContextDataProduct;
}
export interface FetchCitationDownloadStartedAction extends AnyAction {
    type: typeof ActionTypes.FETCH_CITATION_DOWNLOAD_STARTED;
    key: string;
}
export interface FetchCitationDownloadFailedAction extends AnyAction {
    type: typeof ActionTypes.FETCH_CITATION_DOWNLOAD_FAILED;
    key: string;
    error: Nullable<string>;
}
export interface FetchCitationDownloadSucceededAction extends AnyAction {
    type: typeof ActionTypes.FETCH_CITATION_DOWNLOAD_SUCCEEDED;
    key: string;
}
export interface FetchCitationDownloadResetAction extends AnyAction {
    type: typeof ActionTypes.FETCH_CITATION_DOWNLOAD_RESET;
    key: string;
}
export declare type DataProducCitationActionTypes = (ReinitializeAction | ErrorAction | SetProductCodeAction | SetReleaseAction | SetParamsAction | StoreFinalizedNeonContextStateAction | FetchProductStartedAction | FetchProductFailedAction | FetchProductSucceededAction | FetchProductReleaseStartedAction | FetchProductReleaseFailedAction | FetchProductReleaseSucceededAction | FetchBundleParentStartedAction | FetchBundleParentFailedAction | FetchBundleParentSucceededAction | FetchBundleParentReleaseStartedAction | FetchBundleParentReleaseFailedAction | FetchBundleParentReleaseSucceededAction | FetchCitationDownloadStartedAction | FetchCitationDownloadFailedAction | FetchCitationDownloadSucceededAction | FetchCitationDownloadResetAction | AnyAction);
export declare type ErrorActionTypes = (ErrorAction | FetchProductFailedAction | FetchProductReleaseFailedAction | FetchBundleParentFailedAction | FetchBundleParentReleaseFailedAction | FetchCitationDownloadFailedAction);
declare const ActionCreator: {
    reinitialize: (productCode: string, release?: Nullable<string>) => ReinitializeAction;
    error: (error: Nullable<UnknownRecord | string>) => ErrorAction;
    setProductCode: (productCode: Nullable<string>) => SetProductCodeAction;
    setRelease: (release: Nullable<string>) => SetReleaseAction;
    setParams: (productCode: Nullable<string>, release: Nullable<string>) => SetParamsAction;
    storeFinalizedNeonContextState: (neonContextState: UnknownRecord) => StoreFinalizedNeonContextStateAction;
    fetchProductStarted: () => FetchProductStartedAction;
    fetchProductFailed: (error: Nullable<AjaxResponse | string>) => FetchProductFailedAction;
    fetchProductSucceeded: (data: ContextDataProduct) => FetchProductSucceededAction;
    fetchProductReleaseStarted: (release: string) => FetchProductReleaseStartedAction;
    fetchProductReleaseFailed: (release: string, error: Nullable<AjaxResponse | string>) => FetchProductReleaseFailedAction;
    fetchProductReleaseSucceeded: (release: string, data: ContextDataProduct) => FetchProductReleaseSucceededAction;
    fetchBundleParentStarted: (bundleParent: string) => FetchBundleParentStartedAction;
    fetchBundleParentFailed: (bundleParent: string, error: Nullable<AjaxResponse | string>) => FetchBundleParentFailedAction;
    fetchBundleParentSucceeded: (bundleParent: string, data: ContextDataProduct) => FetchBundleParentSucceededAction;
    fetchBundleParentReleaseStarted: (bundleParent: string, release: string) => FetchBundleParentReleaseStartedAction;
    fetchBundleParentReleaseFailed: (bundleParent: string, release: string, error: Nullable<AjaxResponse | string>) => FetchBundleParentReleaseFailedAction;
    fetchBundleParentReleaseSucceeded: (bundleParent: string, release: string, data: ContextDataProduct) => FetchBundleParentReleaseSucceededAction;
    fetchCitationDownloadStarted: (key: string) => FetchCitationDownloadStartedAction;
    fetchCitationDownloadFailed: (key: string, error: Nullable<string>) => FetchCitationDownloadFailedAction;
    fetchCitationDownloadSucceeded: (key: string) => FetchCitationDownloadSucceededAction;
    fetchCitationDownloadReset: (key: string) => FetchCitationDownloadResetAction;
};
export default ActionCreator;
