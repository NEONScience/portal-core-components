import { AjaxResponse } from 'rxjs/ajax';
import { AnyAction, Nullable, UnknownRecord } from '../../../types/core';
import { DataProductDoiStatus } from '../../../types/neonApi';
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

  FETCH_PRODUCT_RELEASE_DOI_STARTED = 'FETCH_PRODUCT_RELEASE_DOI_STARTED',
  FETCH_PRODUCT_RELEASE_DOI_FAILED = 'FETCH_PRODUCT_RELEASE_DOI_FAILED',
  FETCH_PRODUCT_RELEASE_DOI_SUCCEEDED = 'FETCH_PRODUCT_RELEASE_DOI_SUCCEEDED',

  FETCH_BUNDLE_PARENT_STARTED = 'FETCH_BUNDLE_PARENT_STARTED',
  FETCH_BUNDLE_PARENT_FAILED = 'FETCH_BUNDLE_PARENT_FAILED',
  FETCH_BUNDLE_PARENT_SUCCEEDED = 'FETCH_BUNDLE_PARENT_SUCCEEDED',

  FETCH_BUNDLE_PARENT_RELEASE_STARTED = 'FETCH_BUNDLE_PARENT_RELEASE_STARTED',
  FETCH_BUNDLE_PARENT_RELEASE_FAILED = 'FETCH_BUNDLE_PARENT_RELEASE_FAILED',
  FETCH_BUNDLE_PARENT_RELEASE_SUCCEEDED = 'FETCH_BUNDLE_PARENT_RELEASE_SUCCEEDED',

  FETCH_CITATION_DOWNLOAD_STARTED = 'FETCH_CITATION_DOWNLOAD_STARTED',
  FETCH_CITATION_DOWNLOAD_FAILED = 'FETCH_CITATION_DOWNLOAD_FAILED',
  FETCH_CITATION_DOWNLOAD_SUCCEEDED = 'FETCH_CITATION_DOWNLOAD_SUCCEEDED',
  FETCH_CITATION_DOWNLOAD_RESET = 'FETCH_CITATION_DOWNLOAD_RESET',
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
  error: Nullable<AjaxResponse<unknown>|string>;
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
  error: Nullable<AjaxResponse<unknown>|string>;
}
export interface FetchProductReleaseSucceededAction extends AnyAction {
  type: typeof ActionTypes.FETCH_PRODUCT_RELEASE_SUCCEEDED;
  release: string;
  data: ContextDataProduct;
}
export interface FetchProductReleaseDoiStartedAction extends AnyAction {
  type: typeof ActionTypes.FETCH_PRODUCT_RELEASE_DOI_STARTED;
  release: string;
}
export interface FetchProductReleaseDoiFailedAction extends AnyAction {
  type: typeof ActionTypes.FETCH_PRODUCT_RELEASE_DOI_FAILED;
  release: string;
  error: Nullable<AjaxResponse<unknown>|string>;
}
export interface FetchProductReleaseDoiSucceededAction extends AnyAction {
  type: typeof ActionTypes.FETCH_PRODUCT_RELEASE_DOI_SUCCEEDED;
  release: string;
  data: DataProductDoiStatus;
}
export interface FetchBundleParentStartedAction extends AnyAction {
  type: typeof ActionTypes.FETCH_BUNDLE_PARENT_STARTED;
  bundleParent: string;
}
export interface FetchBundleParentFailedAction extends AnyAction {
  type: typeof ActionTypes.FETCH_BUNDLE_PARENT_FAILED;
  bundleParent: string;
  error: Nullable<AjaxResponse<unknown>|string>;
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
  error: Nullable<AjaxResponse<unknown>|string>;
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
  | FetchProductReleaseDoiStartedAction
  | FetchProductReleaseDoiFailedAction
  | FetchProductReleaseDoiSucceededAction
  | FetchBundleParentStartedAction
  | FetchBundleParentFailedAction
  | FetchBundleParentSucceededAction
  | FetchBundleParentReleaseStartedAction
  | FetchBundleParentReleaseFailedAction
  | FetchBundleParentReleaseSucceededAction
  | FetchCitationDownloadStartedAction
  | FetchCitationDownloadFailedAction
  | FetchCitationDownloadSucceededAction
  | FetchCitationDownloadResetAction
  | AnyAction
);

export type ErrorActionTypes = (
  ErrorAction
  | FetchProductFailedAction
  | FetchProductReleaseFailedAction
  | FetchProductReleaseDoiFailedAction
  | FetchBundleParentFailedAction
  | FetchBundleParentReleaseFailedAction
  | FetchCitationDownloadFailedAction
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
  fetchProductFailed: (
    error: Nullable<AjaxResponse<unknown>|string>,
  ): FetchProductFailedAction => ({
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
    error: Nullable<AjaxResponse<unknown>|string>,
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
  fetchProductReleaseDoiStarted: (release: string): FetchProductReleaseDoiStartedAction => ({
    type: ActionTypes.FETCH_PRODUCT_RELEASE_DOI_STARTED,
    release,
  }),
  fetchProductReleaseDoiFailed: (
    release: string,
    error: Nullable<AjaxResponse<unknown>|string>,
  ): FetchProductReleaseDoiFailedAction => ({
    type: ActionTypes.FETCH_PRODUCT_RELEASE_DOI_FAILED,
    release,
    error,
  }),
  fetchProductReleaseDoiSucceeded: (
    release: string,
    data: DataProductDoiStatus,
  ): FetchProductReleaseDoiSucceededAction => ({
    type: ActionTypes.FETCH_PRODUCT_RELEASE_DOI_SUCCEEDED,
    release,
    data,
  }),
  fetchBundleParentStarted: (bundleParent: string): FetchBundleParentStartedAction => ({
    type: ActionTypes.FETCH_BUNDLE_PARENT_STARTED,
    bundleParent,
  }),
  fetchBundleParentFailed: (
    bundleParent: string,
    error: Nullable<AjaxResponse<unknown>|string>,
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
    error: Nullable<AjaxResponse<unknown>|string>,
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
  fetchCitationDownloadStarted: (key: string): FetchCitationDownloadStartedAction => ({
    type: ActionTypes.FETCH_CITATION_DOWNLOAD_STARTED,
    key,
  }),
  fetchCitationDownloadFailed: (
    key: string,
    error: Nullable<string>,
  ): FetchCitationDownloadFailedAction => ({
    type: ActionTypes.FETCH_CITATION_DOWNLOAD_FAILED,
    key,
    error,
  }),
  fetchCitationDownloadSucceeded: (key: string): FetchCitationDownloadSucceededAction => ({
    type: ActionTypes.FETCH_CITATION_DOWNLOAD_SUCCEEDED,
    key,
  }),
  fetchCitationDownloadReset: (key: string): FetchCitationDownloadResetAction => ({
    type: ActionTypes.FETCH_CITATION_DOWNLOAD_RESET,
    key,
  }),
};

export default ActionCreator;
