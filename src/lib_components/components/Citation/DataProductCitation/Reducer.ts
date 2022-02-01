import cloneDeep from 'lodash/cloneDeep';

import Service from './Service';
import ActionCreator, { ActionTypes } from './Actions';
import {
  CONTEXT_STATUS,
  DEFAULT_STATE,
  FETCH_STATUS,
} from './State';

const reinitialize = (state: any, action: any) => (
  Service.calculateContextState(
    {
      ...cloneDeep(DEFAULT_STATE),
      productCode: action.productCode,
      release: action.release,
      neonContextState: state.neonContextState,
    },
    state.neonContextState,
    action.release,
    action.productCode,
  )
);

const Reducer = (state: any, action: any) => {
  const newState = { ...state };
  const errorDetail = (
    !action.error ? null
      : ((action.error.response || {}).error || {}).detail || action.error.message || null
  );
  switch (action.type) {
    case ActionTypes.REINITIALIZE:
      // Reset the context state to default state, but keep the
      // finalized NeonContext state.
      return reinitialize(state, action);
    case ActionTypes.ERROR:
      newState.component.status = CONTEXT_STATUS.ERROR;
      newState.component.error = action.error;
      return newState;

    case ActionTypes.SET_PRODUCT_CODE:
      return reinitialize(state, ActionCreator.setParams(action.productCode, state.release));
    case ActionTypes.SET_RELEASE:
      return reinitialize(state, ActionCreator.setParams(state.productCode, action.release));
    case ActionTypes.SET_PARAMS:
      return reinitialize(state, action);

    case ActionTypes.STORE_FINALIZED_NEON_CONTEXT_STATE:
      Service.applyUserRelease(
        newState.data.releases,
        Service.withContextReleases(action.neonContextState),
      );
      return Service.calculateContextState(
        newState,
        action.neonContextState,
        newState.release,
        newState.productCode,
      );

    case ActionTypes.FETCH_PRODUCT_STARTED:
      newState.fetches.product.status = FETCH_STATUS.FETCHING;
      return Service.calculateAppStatus(newState);
    case ActionTypes.FETCH_PRODUCT_FAILED:
      newState.fetches.product.status = FETCH_STATUS.ERROR;
      newState.fetches.product.error = action.error;
      newState.component.error = `${errorDetail}: product code ${state.productCode}`;
      return Service.calculateAppStatus(newState);
    case ActionTypes.FETCH_PRODUCT_SUCCEEDED:
      newState.fetches.product.status = FETCH_STATUS.SUCCESS;
      newState.data.product = action.data;
      newState.data.product.releases = Service.sortReleases(newState.data.product.releases);
      return Service.calculateAppStatus(
        Service.calculateFetches(
          Service.applyReleasesGlobally(newState, newState.data.product.releases),
        ),
      );

    case ActionTypes.FETCH_PRODUCT_RELEASE_STARTED:
      newState.fetches.productReleases[action.release].status = FETCH_STATUS.FETCHING;
      return Service.calculateAppStatus(newState);
    case ActionTypes.FETCH_PRODUCT_RELEASE_FAILED:
      newState.fetches.productReleases[action.release].status = FETCH_STATUS.ERROR;
      newState.fetches.productReleases[action.release].error = action.error;
      // eslint-disable-next-line max-len
      newState.component.error = `${errorDetail}: ${action.release}`;
      return Service.calculateAppStatus(newState);
    case ActionTypes.FETCH_PRODUCT_RELEASE_SUCCEEDED:
      newState.fetches.productReleases[action.release].status = FETCH_STATUS.SUCCESS;
      newState.data.productReleases[action.release] = action.data;
      return Service.calculateAppStatus(newState);

    case ActionTypes.FETCH_BUNDLE_PARENT_STARTED:
      newState.fetches.bundleParents[action.bundleParent].status = FETCH_STATUS.FETCHING;
      return Service.calculateAppStatus(newState);
    case ActionTypes.FETCH_BUNDLE_PARENT_FAILED:
      newState.fetches.bundleParents[action.bundleParent].status = FETCH_STATUS.ERROR;
      newState.fetches.bundleParents[action.bundleParent].error = action.error;
      newState.component.error = `${errorDetail}: bundle parent product code ${action.bundleParent}`;
      return Service.calculateAppStatus(newState);
    case ActionTypes.FETCH_BUNDLE_PARENT_SUCCEEDED:
      newState.fetches.bundleParents[action.bundleParent].status = FETCH_STATUS.SUCCESS;
      newState.data.bundleParents[action.bundleParent] = action.data;
      // eslint-disable-next-line max-len
      newState.data.bundleParents[action.bundleParent].releases = Service.sortReleases(action.data.releases);
      return Service.calculateAppStatus(
        Service.calculateFetches(
          // eslint-disable-next-line max-len
          Service.applyReleasesGlobally(newState, newState.data.bundleParents[action.bundleParent].releases),
        ),
      );

    case ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_STARTED:
      /* eslint-disable max-len */
      newState.fetches.bundleParentReleases[action.bundleParent][action.release].status = FETCH_STATUS.FETCHING;
      /* eslint-enable max-len */
      return Service.calculateAppStatus(newState);
    case ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_FAILED:
      /* eslint-disable max-len */
      newState.fetches.bundleParentReleases[action.bundleParent][action.release].status = FETCH_STATUS.ERROR;
      newState.fetches.bundleParentReleases[action.bundleParent][action.release].error = action.error;
      newState.component.error = errorDetail;
      newState.component.error = `${errorDetail}: bundle parent product code ${action.bundleParent}; release ${action.release}`;
      /* eslint-enable max-len */
      return Service.calculateAppStatus(newState);
    case ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_SUCCEEDED:
      // eslint-disable-next-line max-len
      newState.fetches.bundleParentReleases[action.bundleParent][action.release].status = FETCH_STATUS.SUCCESS;
      if (!newState.data.bundleParentReleases[action.bundleParent]) {
        newState.data.bundleParentReleases[action.bundleParent] = {};
      }
      newState.data.bundleParentReleases[action.bundleParent][action.release] = action.data;
      return Service.calculateAppStatus(newState);

    default:
      return state;
  }
};

export default Reducer;
