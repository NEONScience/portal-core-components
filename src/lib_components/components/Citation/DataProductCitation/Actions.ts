import { AjaxResponse } from 'rxjs/ajax';
import { AnyAction, Nullable, UnknownRecord } from '../../../types/core';
import { ContextDataProduct } from './State';

export enum ActionTypes {
  REINITIALIZE = 'REINITIALIZE',
  ERROR = 'ERROR',
  SET_PRODUCT_CODE = 'SET_PRODUCT_CODE',
  SET_RELEASE = 'SET_RELEASE',
  SET_PARAMS = 'SET_PARAMS',
  STORE_FINALIZED_NEON_CONTEXT_STATE = 'STORE_FINALIZED_NEON_CONTEXT_STATE',

  FETCH_PRODUCT_STARTED = 'FETCH_PRODUCT_STARTED',
  FETCH_PRODUCT_FAILED = 'FETCH_PRODUCT_FAILED',
  FETCH_PRODUCT_SUCCEEDED = 'FETCH_PRODUCT_SUCCEEDED',

  FETCH_PRODUCT_RELEASE_STARTED = 'FETCH_PRODUCT_RELEASE_STARTED',
  FETCH_PRODUCT_RELEASE_FAILED = 'FETCH_PRODUCT_RELEASE_FAILED',
  FETCH_PRODUCT_RELEASE_SUCCEEDED = 'FETCH_PRODUCT_RELEASE_SUCCEEDED',

  FETCH_BUNDLE_PARENT_STARTED = 'FETCH_BUNDLE_PARENT_STARTED',
  FETCH_BUNDLE_PARENT_FAILED = 'FETCH_BUNDLE_PARENT_FAILED',
  FETCH_BUNDLE_PARENT_SUCCEEDED = 'FETCH_BUNDLE_PARENT_SUCCEEDED',

  FETCH_BUNDLE_PARENT_RELEASE_STARTED = 'FETCH_BUNDLE_PARENT_RELEASE_STARTED',
  FETCH_BUNDLE_PARENT_RELEASE_FAILED = 'FETCH_BUNDLE_PARENT_RELEASE_FAILED',
  FETCH_BUNDLE_PARENT_RELEASE_SUCCEEDED = 'FETCH_BUNDLE_PARENT_RELEASE_SUCCEEDED',
}

export interface ReinitializeAction extends AnyAction {
  type: typeof ActionTypes.REINITIALIZE;
  productCode: string;
  release?: Nullable<string>;
}
export interface ErrorAction extends AnyAction {
  type: typeof ActionTypes.ERROR;
  error: Nullable<UnknownRecord|string>;
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
  error: Nullable<AjaxResponse|string>;
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
  error: Nullable<AjaxResponse|string>;
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
  error: Nullable<AjaxResponse|string>;
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
  error: Nullable<AjaxResponse|string>;
}
export interface FetchBundleParentReleaseSucceededAction extends AnyAction {
  type: typeof ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_SUCCEEDED;
  bundleParent: string;
  release: string;
  data: ContextDataProduct;
}

export type DataProducCitationActionTypes = (
  ReinitializeAction
  | ErrorAction
  | SetProductCodeAction
  | SetReleaseAction
  | SetParamsAction
  | StoreFinalizedNeonContextStateAction
  | FetchProductStartedAction
  | FetchProductFailedAction
  | FetchProductSucceededAction
  | FetchProductReleaseStartedAction
  | FetchProductReleaseFailedAction
  | FetchProductReleaseSucceededAction
  | FetchBundleParentStartedAction
  | FetchBundleParentFailedAction
  | FetchBundleParentSucceededAction
  | FetchBundleParentReleaseStartedAction
  | FetchBundleParentReleaseFailedAction
  | FetchBundleParentReleaseSucceededAction
  | AnyAction
);

export type ErrorActionTypes = (
  ErrorAction
  | FetchProductFailedAction
  | FetchProductReleaseFailedAction
  | FetchBundleParentFailedAction
  | FetchBundleParentReleaseFailedAction
);

const ActionCreator = {
  reinitialize: (productCode: string, release?: Nullable<string>): ReinitializeAction => ({
    type: ActionTypes.REINITIALIZE,
    productCode,
    release,
  }),
  error: (error: Nullable<UnknownRecord|string>): ErrorAction => ({
    type: ActionTypes.ERROR,
    error,
  }),
  setProductCode: (productCode: Nullable<string>): SetProductCodeAction => ({
    type: ActionTypes.SET_PRODUCT_CODE,
    productCode,
  }),
  setRelease: (release: Nullable<string>): SetReleaseAction => ({
    type: ActionTypes.SET_RELEASE,
    release,
  }),
  setParams: (productCode: Nullable<string>, release: Nullable<string>): SetParamsAction => ({
    type: ActionTypes.SET_PARAMS,
    productCode,
    release,
  }),
  storeFinalizedNeonContextState: (
    neonContextState: UnknownRecord,
  ): StoreFinalizedNeonContextStateAction => ({
    type: ActionTypes.STORE_FINALIZED_NEON_CONTEXT_STATE,
    neonContextState,
  }),
  fetchProductStarted: (): FetchProductStartedAction => ({
    type: ActionTypes.FETCH_PRODUCT_STARTED,
  }),
  fetchProductFailed: (error: Nullable<AjaxResponse|string>): FetchProductFailedAction => ({
    type: ActionTypes.FETCH_PRODUCT_FAILED,
    error,
  }),
  fetchProductSucceeded: (data: ContextDataProduct): FetchProductSucceededAction => ({
    type: ActionTypes.FETCH_PRODUCT_SUCCEEDED,
    data,
  }),
  fetchProductReleaseStarted: (release: string): FetchProductReleaseStartedAction => ({
    type: ActionTypes.FETCH_PRODUCT_RELEASE_STARTED,
    release,
  }),
  fetchProductReleaseFailed: (
    release: string,
    error: Nullable<AjaxResponse|string>,
  ): FetchProductReleaseFailedAction => ({
    type: ActionTypes.FETCH_PRODUCT_RELEASE_FAILED,
    release,
    error,
  }),
  fetchProductReleaseSucceeded: (
    release: string,
    data: ContextDataProduct,
  ): FetchProductReleaseSucceededAction => ({
    type: ActionTypes.FETCH_PRODUCT_RELEASE_SUCCEEDED,
    release,
    data,
  }),
  fetchBundleParentStarted: (bundleParent: string): FetchBundleParentStartedAction => ({
    type: ActionTypes.FETCH_BUNDLE_PARENT_STARTED,
    bundleParent,
  }),
  fetchBundleParentFailed: (
    bundleParent: string,
    error: Nullable<AjaxResponse|string>,
  ): FetchBundleParentFailedAction => ({
    type: ActionTypes.FETCH_BUNDLE_PARENT_FAILED,
    bundleParent,
    error,
  }),
  fetchBundleParentSucceeded: (
    bundleParent: string,
    data: ContextDataProduct,
  ): FetchBundleParentSucceededAction => ({
    type: ActionTypes.FETCH_BUNDLE_PARENT_SUCCEEDED,
    bundleParent,
    data,
  }),
  fetchBundleParentReleaseStarted: (
    bundleParent: string,
    release: string,
  ): FetchBundleParentReleaseStartedAction => ({
    type: ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_STARTED,
    bundleParent,
    release,
  }),
  fetchBundleParentReleaseFailed: (
    bundleParent: string,
    release: string,
    error: Nullable<AjaxResponse|string>,
  ): FetchBundleParentReleaseFailedAction => ({
    type: ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_FAILED,
    bundleParent,
    release,
    error,
  }),
  fetchBundleParentReleaseSucceeded: (
    bundleParent: string,
    release: string,
    data: ContextDataProduct,
  ): FetchBundleParentReleaseSucceededAction => ({
    type: ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_SUCCEEDED,
    bundleParent,
    release,
    data,
  }),
};

export default ActionCreator;