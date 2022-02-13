import Service from './Service';
import ActionCreator, {
  ActionTypes,
  DataProducCitationActionTypes,
  ErrorActionTypes,
  ReinitializeAction,
  SetParamsAction,
  FetchProductSucceededAction,
  FetchProductFailedAction,
  FetchProductReleaseFailedAction,
  SetProductCodeAction,
  SetReleaseAction,
  StoreFinalizedNeonContextStateAction,
  FetchProductReleaseStartedAction,
  FetchProductReleaseSucceededAction,
  FetchBundleParentStartedAction,
  FetchBundleParentFailedAction,
  FetchBundleParentSucceededAction,
  FetchBundleParentReleaseStartedAction,
  FetchBundleParentReleaseFailedAction,
  FetchBundleParentReleaseSucceededAction,
} from './Actions';
import {
  CitationRelease,
  ContextDataProduct,
  ContextStatus,
  DataProductCitationState,
  FetchStatus,
  FetchStatusState,
  getDefaultState,
} from './State';
import ReleaseService from '../../../service/ReleaseService';
import { Nullable, UnknownRecord } from '../../../types/core';
import { exists, isStringNonEmpty } from '../../../util/typeUtil';

const reinitialize = (
  state: DataProductCitationState,
  action: ReinitializeAction|SetParamsAction,
) => (
  Service.calculateContextState(
    {
      ...getDefaultState(),
      productCode: action.productCode,
      release: action.release,
      neonContextState: state.neonContextState,
    },
    state.neonContextState,
    action.release,
    action.productCode,
  )
);

const isErrorTypeAction = (action: DataProducCitationActionTypes): boolean => (
  ('type' in action) && ('error' in action)
);
const resolveError = (
  action: ErrorActionTypes,
  state: DataProductCitationState,
): Nullable<UnknownRecord|string> => {
  if (!isErrorTypeAction(action)) {
    return null;
  }
  let result: Nullable<UnknownRecord|string> = null;
  if (exists(action.error)) {
    if (isStringNonEmpty(action.error)) {
      result = action.error as string;
    } else {
      const resolved: UnknownRecord = action.error as UnknownRecord;
      if (exists(resolved.response)) {
        const resolvedResponse: UnknownRecord = resolved.response as UnknownRecord;
        if (exists(resolvedResponse.error)) {
          const resolvedErrorResponse: UnknownRecord = resolvedResponse.error as UnknownRecord;
          if (exists(resolvedErrorResponse.detail)) {
            result = resolvedErrorResponse.detail as string;
          }
        }
      } else if (isStringNonEmpty(resolved.message)) {
        result = resolved.message as string;
      } else {
        result = action.error as UnknownRecord;
      }
    }
  }
  let fetchProductFailedAction: FetchProductFailedAction;
  let fetchProductReleaseFailedAction: FetchProductReleaseFailedAction;
  let fetchBundleParentFailedAction: FetchBundleParentFailedAction;
  let fetchBundleParentReleaseFailedAction: FetchBundleParentReleaseFailedAction;
  switch (action.type) {
    case ActionTypes.FETCH_PRODUCT_FAILED:
      fetchProductFailedAction = (action as FetchProductFailedAction);
      result = `${result}: product code ${fetchProductFailedAction.productCode}`;
      break;
    case ActionTypes.FETCH_PRODUCT_RELEASE_FAILED:
      fetchProductReleaseFailedAction = (action as FetchProductReleaseFailedAction);
      result = `${result}: ${fetchProductReleaseFailedAction.release}`;
      break;
    case ActionTypes.FETCH_BUNDLE_PARENT_FAILED:
      fetchBundleParentFailedAction = (action as FetchBundleParentFailedAction);
      result = `${result}: bundle parent product code `
        + `${fetchBundleParentFailedAction.bundleParent}`;
      break;
    case ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_FAILED:
      fetchBundleParentReleaseFailedAction = (action as FetchBundleParentReleaseFailedAction);
      result = `${result}: bundle parent product code `
        + `${fetchBundleParentReleaseFailedAction.bundleParent}; `
        + `release ${fetchBundleParentReleaseFailedAction.release}`;
      break;
    case ActionTypes.ERROR:
    default:
      break;
  }
  return result;
};

const Reducer = (
  state: DataProductCitationState,
  action: DataProducCitationActionTypes,
): DataProductCitationState => {
  const newState: DataProductCitationState = { ...state };
  let errorResult: Nullable<UnknownRecord|string> = null;
  if (isErrorTypeAction(action)) {
    errorResult = resolveError(action as ErrorActionTypes, newState);
  }
  let product: ContextDataProduct;
  let release: string;
  let bundleParent: string;
  let fetchStatusState: FetchStatusState;
  let setProductCodeAction: SetProductCodeAction;
  let setReleaseAction: SetReleaseAction;
  let fpSucceededAction: FetchProductSucceededAction;
  let fprStartedAction: FetchProductReleaseStartedAction;
  let fprFailedAction: FetchProductReleaseFailedAction;
  let fprSucceededAction: FetchProductReleaseSucceededAction;
  let fbpStartedAction: FetchBundleParentStartedAction;
  let fbpFailedAction: FetchBundleParentFailedAction;
  let fbpSucceededAction: FetchBundleParentSucceededAction;
  let fbprStartedAction: FetchBundleParentReleaseStartedAction;
  let fbprFailedAction: FetchBundleParentReleaseFailedAction;
  let fbprSucceededAction: FetchBundleParentReleaseSucceededAction;
  switch (action.type) {
    case ActionTypes.REINITIALIZE:
      // Reset the context state to default state, but keep the
      // finalized NeonContext state.
      return reinitialize(state, action as ReinitializeAction);
    case ActionTypes.ERROR:
      newState.component.status = ContextStatus.ERROR;
      newState.component.error = errorResult;
      return newState;

    case ActionTypes.SET_PRODUCT_CODE:
      setProductCodeAction = (action as SetProductCodeAction);
      return reinitialize(
        state,
        ActionCreator.setParams(setProductCodeAction.productCode, state.release),
      );
    case ActionTypes.SET_RELEASE:
      setReleaseAction = (action as SetReleaseAction);
      return reinitialize(
        state,
        ActionCreator.setParams(state.productCode, setReleaseAction.release),
      );
    case ActionTypes.SET_PARAMS:
      return reinitialize(state, action as SetParamsAction);

    case ActionTypes.STORE_FINALIZED_NEON_CONTEXT_STATE:
      newState.data.releases = ReleaseService.applyUserReleases<CitationRelease>(
        action.neonContextState,
        newState.data.releases,
      );
      return Service.calculateContextState(
        newState,
        (action as StoreFinalizedNeonContextStateAction).neonContextState,
        newState.release,
        newState.productCode,
      );

    case ActionTypes.FETCH_PRODUCT_STARTED:
      if (exists(newState.fetches.product)) {
        (newState.fetches.product as FetchStatusState).status = FetchStatus.FETCHING;
      }
      return Service.calculateAppStatus(newState);
    case ActionTypes.FETCH_PRODUCT_FAILED:
      if (!exists(newState.fetches.product)) {
        newState.fetches.product = {
          status: FetchStatus.AWAITING_CALL,
        };
      }
      fetchStatusState = (newState.fetches.product as FetchStatusState);
      fetchStatusState.status = FetchStatus.ERROR;
      fetchStatusState.error = errorResult;
      newState.component.error = errorResult;
      return Service.calculateAppStatus(newState);
    case ActionTypes.FETCH_PRODUCT_SUCCEEDED:
      if (!exists(newState.fetches.product)) {
        newState.fetches.product = {
          status: FetchStatus.AWAITING_CALL,
        };
      }
      fetchStatusState = (newState.fetches.product as FetchStatusState);
      fetchStatusState.status = FetchStatus.SUCCESS;
      fpSucceededAction = (action as FetchProductSucceededAction);
      newState.data.product = fpSucceededAction.data;
      (newState.data.product as ContextDataProduct).releases = ReleaseService.sortReleases(
        newState.data.product.releases,
      );
      return Service.calculateAppStatus(
        Service.calculateFetches(
          Service.applyReleasesGlobally(newState, newState.data.product.releases),
        ),
      );

    case ActionTypes.FETCH_PRODUCT_RELEASE_STARTED:
      fprStartedAction = (action as FetchProductReleaseStartedAction);
      release = fprStartedAction.release;
      newState.fetches.productReleases[release].status = FetchStatus.FETCHING;
      return Service.calculateAppStatus(newState);
    case ActionTypes.FETCH_PRODUCT_RELEASE_FAILED:
      fprFailedAction = (action as FetchProductReleaseFailedAction);
      release = fprFailedAction.release;
      newState.fetches.productReleases[release].status = FetchStatus.ERROR;
      newState.fetches.productReleases[release].error = errorResult;
      newState.component.error = errorResult;
      return Service.calculateAppStatus(newState);
    case ActionTypes.FETCH_PRODUCT_RELEASE_SUCCEEDED:
      fprSucceededAction = (action as FetchProductReleaseSucceededAction);
      release = fprSucceededAction.release;
      product = fprSucceededAction.data;
      newState.fetches.productReleases[release].status = FetchStatus.SUCCESS;
      newState.data.productReleases[release] = product;
      return Service.calculateAppStatus(newState);

    case ActionTypes.FETCH_BUNDLE_PARENT_STARTED:
      fbpStartedAction = (action as FetchBundleParentStartedAction);
      bundleParent = fbpStartedAction.bundleParent;
      newState.fetches.bundleParents[bundleParent].status = FetchStatus.FETCHING;
      return Service.calculateAppStatus(newState);
    case ActionTypes.FETCH_BUNDLE_PARENT_FAILED:
      fbpFailedAction = (action as FetchBundleParentFailedAction);
      bundleParent = fbpFailedAction.bundleParent;
      newState.fetches.bundleParents[bundleParent].status = FetchStatus.ERROR;
      newState.fetches.bundleParents[bundleParent].error = errorResult;
      newState.component.error = errorResult;
      return Service.calculateAppStatus(newState);
    case ActionTypes.FETCH_BUNDLE_PARENT_SUCCEEDED:
      fbpSucceededAction = (action as FetchBundleParentSucceededAction);
      bundleParent = fbpSucceededAction.bundleParent;
      product = fbpSucceededAction.data;
      newState.fetches.bundleParents[bundleParent].status = FetchStatus.SUCCESS;
      newState.data.bundleParents[bundleParent] = product;
      newState.data.bundleParents[bundleParent].releases = ReleaseService.sortReleases(
        product.releases,
      );
      return Service.calculateAppStatus(
        Service.calculateFetches(
          Service.applyReleasesGlobally(
            newState,
            newState.data.bundleParents[bundleParent].releases,
          ),
        ),
      );

    case ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_STARTED:
      fbprStartedAction = (action as FetchBundleParentReleaseStartedAction);
      bundleParent = fbprStartedAction.bundleParent;
      release = fbprStartedAction.release;
      newState.fetches.bundleParentReleases[bundleParent][release].status = FetchStatus.FETCHING;
      return Service.calculateAppStatus(newState);
    case ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_FAILED:
      fbprFailedAction = (action as FetchBundleParentReleaseFailedAction);
      bundleParent = fbprFailedAction.bundleParent;
      release = fbprFailedAction.release;
      newState.fetches.bundleParentReleases[bundleParent][release].status = FetchStatus.ERROR;
      newState.fetches.bundleParentReleases[bundleParent][release].error = errorResult;
      newState.component.error = errorResult;
      return Service.calculateAppStatus(newState);
    case ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_SUCCEEDED:
      fbprSucceededAction = (action as FetchBundleParentReleaseSucceededAction);
      bundleParent = fbprSucceededAction.bundleParent;
      release = fbprSucceededAction.release;
      product = fbprSucceededAction.data;
      newState.fetches.bundleParentReleases[bundleParent][release].status = FetchStatus.SUCCESS;
      if (!exists(newState.data.bundleParentReleases[bundleParent])) {
        newState.data.bundleParentReleases[bundleParent] = {};
      }
      newState.data.bundleParentReleases[bundleParent][release] = product;
      return Service.calculateAppStatus(newState);

    default:
      return state;
  }
};

export default Reducer;
