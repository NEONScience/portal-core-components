import { AnyAction, Nullable } from '../../../types/core';
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
    FETCH_BUNDLE_PARENT_RELEASE_SUCCEEDED = "FETCH_BUNDLE_PARENT_RELEASE_SUCCEEDED"
}
export interface ReinitializeAction extends AnyAction {
    type: typeof ActionTypes.REINITIALIZE;
    productCode: string;
    release?: string;
}
export interface ErrorAction extends AnyAction {
    type: typeof ActionTypes.ERROR;
    error: Record<string, unknown> | string;
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
    neonContextState: any;
}
export interface FetchProductStartedAction extends AnyAction {
    type: typeof ActionTypes.FETCH_PRODUCT_STARTED;
}
export interface FetchProductFailedAction extends AnyAction {
    type: typeof ActionTypes.FETCH_PRODUCT_FAILED;
    error: any;
}
export interface FetchProductSucceededAction extends AnyAction {
    type: typeof ActionTypes.FETCH_PRODUCT_SUCCEEDED;
    data: any;
}
export interface FetchProductReleaseStartedAction extends AnyAction {
    type: typeof ActionTypes.FETCH_PRODUCT_RELEASE_STARTED;
    release: string;
}
export interface FetchProductReleaseFailedAction extends AnyAction {
    type: typeof ActionTypes.FETCH_PRODUCT_RELEASE_FAILED;
    release: string;
    error: any;
}
export interface FetchProductReleaseSucceededAction extends AnyAction {
    type: typeof ActionTypes.FETCH_PRODUCT_RELEASE_SUCCEEDED;
    release: string;
    data: any;
}
export interface FetchBundleParentStartedAction extends AnyAction {
    type: typeof ActionTypes.FETCH_BUNDLE_PARENT_STARTED;
    bundleParent: string;
}
export interface FetchBundleParentFailedAction extends AnyAction {
    type: typeof ActionTypes.FETCH_BUNDLE_PARENT_FAILED;
    bundleParent: string;
    error: any;
}
export interface FetchBundleParentSucceededAction extends AnyAction {
    type: typeof ActionTypes.FETCH_BUNDLE_PARENT_SUCCEEDED;
    bundleParent: string;
    data: any;
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
    error: any;
}
export interface FetchBundleParentReleaseSucceededAction extends AnyAction {
    type: typeof ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_SUCCEEDED;
    bundleParent: string;
    release: string;
    data: any;
}
export declare type DataProducCitationActionTypes = (ReinitializeAction | ErrorAction | SetProductCodeAction | SetReleaseAction | SetParamsAction | StoreFinalizedNeonContextStateAction | FetchProductStartedAction | FetchProductFailedAction | FetchProductSucceededAction | FetchProductReleaseStartedAction | FetchProductReleaseFailedAction | FetchProductReleaseSucceededAction | FetchBundleParentStartedAction | FetchBundleParentFailedAction | FetchBundleParentSucceededAction | FetchBundleParentReleaseStartedAction | FetchBundleParentReleaseFailedAction | FetchBundleParentReleaseSucceededAction | AnyAction);
declare const ActionCreator: {
    reinitialize: (productCode: string, release?: string | undefined) => ReinitializeAction;
    error: (error: Record<string, unknown> | string) => ErrorAction;
    setProductCode: (productCode: Nullable<string>) => SetProductCodeAction;
    setRelease: (release: Nullable<string>) => SetReleaseAction;
    setParams: (productCode: Nullable<string>, release: Nullable<string>) => SetParamsAction;
    storeFinalizedNeonContextState: (neonContextState: any) => StoreFinalizedNeonContextStateAction;
    fetchProductStarted: () => FetchProductStartedAction;
    fetchProductFailed: (error: any) => FetchProductFailedAction;
    fetchProductSucceeded: (data: any) => FetchProductSucceededAction;
    fetchProductReleaseStarted: (release: string) => FetchProductReleaseStartedAction;
    fetchProductReleaseFailed: (release: string, error: any) => FetchProductReleaseFailedAction;
    fetchProductReleaseSucceeded: (release: string, data: any) => FetchProductReleaseSucceededAction;
    fetchBundleParentStarted: (bundleParent: string) => FetchBundleParentStartedAction;
    fetchBundleParentFailed: (bundleParent: string, error: any) => FetchBundleParentFailedAction;
    fetchBundleParentSucceeded: (bundleParent: string, data: any) => FetchBundleParentSucceededAction;
    fetchBundleParentReleaseStarted: (bundleParent: string, release: string) => FetchBundleParentReleaseStartedAction;
    fetchBundleParentReleaseFailed: (bundleParent: string, release: string, error: any) => FetchBundleParentReleaseFailedAction;
    fetchBundleParentReleaseSucceeded: (bundleParent: string, release: string, data: any) => FetchBundleParentReleaseSucceededAction;
};
export default ActionCreator;
