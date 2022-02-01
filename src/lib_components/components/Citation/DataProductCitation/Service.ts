import BundleService from '../../../service/BundleService';

import { FETCH_STATUS, CONTEXT_STATUS } from './State';

import { exists } from '../../../util/typeUtil';
import { Nullable } from '../../../types/core';

const getProvReleaseRegex = () => new RegExp(/^[A-Z]+$/);

const fetchIsInStatus = (fetchObject: Record<string, unknown>, status: string) => (
  typeof fetchObject === 'object' && fetchObject !== null && fetchObject.status === status
);

const fetchIsAwaitingCall = (fetchObject: Record<string, unknown>) => (
  fetchIsInStatus(fetchObject, FETCH_STATUS.AWAITING_CALL)
);

const stateHasFetchesInStatus = (state: any, status: string) => (
  fetchIsInStatus(state.fetches.product, status)
  || Object.keys(state.fetches.productReleases).some(
    (f) => fetchIsInStatus(state.fetches.productReleases[f], status),
  )
  || Object.keys(state.fetches.bundleParents).some(
    (f) => fetchIsInStatus(state.fetches.bundleParents[f], status),
  )
  || Object.keys(state.fetches.bundleParentReleases).some(
    (bundleParent) => Object.keys(state.fetches.bundleParentReleases[bundleParent]).some(
      (f) => fetchIsInStatus(state.fetches.bundleParentReleases[bundleParent][f], status),
    ),
  )
);

const calculateFetches = (state: any) => {
  const newState = { ...state };
  const {
    productCode,
    release,
    bundle: { parentCodes },
  } = state;
  const { releases } = state.data;
  if (!productCode) { return state; }
  // Find the latest non-prov release definition
  const latestRelease = (releases && releases.length)
    ? releases.find((r: any) => {
      const matches = getProvReleaseRegex().exec(r.release);
      const isLatestProv = exists(matches)
        && ((matches as RegExpExecArray).length > 0);
      return !isLatestProv;
    })
    : null;
  const fetchRelease = release || (latestRelease || {}).release;
  // Fetch the base product
  if (!state.fetches.product) {
    newState.fetches.product = {
      status: FETCH_STATUS.AWAITING_CALL,
    };
  }
  // Fetch the release-specific product
  if (fetchRelease && !state.fetches.productReleases[fetchRelease]) {
    newState.fetches.productReleases[fetchRelease] = {
      status: FETCH_STATUS.AWAITING_CALL,
    };
  }
  // Fetch all base bundle parent products
  (parentCodes || []).forEach((bundleParentCode: string) => {
    if (!newState.fetches.bundleParents[bundleParentCode]) {
      newState.fetches.bundleParents[bundleParentCode] = {
        status: FETCH_STATUS.AWAITING_CALL,
      };
    }
  });
  // Fetch all release-specific bundle parent products
  if (fetchRelease) {
    (parentCodes || []).forEach((parentCode: string) => {
      if (!newState.fetches.bundleParentReleases[parentCode]) {
        newState.fetches.bundleParentReleases[parentCode] = {};
      }
      if (!newState.fetches.bundleParentReleases[parentCode][fetchRelease]) {
        newState.fetches.bundleParentReleases[parentCode][fetchRelease] = {
          status: FETCH_STATUS.AWAITING_CALL,
        };
      }
    });
  }
  return newState;
};

const calculateAppStatus = (state: any) => {
  const updatedState = { ...state };
  if (stateHasFetchesInStatus(state, FETCH_STATUS.AWAITING_CALL)) {
    updatedState.component.status = CONTEXT_STATUS.HAS_FETCHES_TO_TRIGGER;
    return updatedState;
  }
  if (stateHasFetchesInStatus(state, FETCH_STATUS.ERROR)) {
    updatedState.component.status = CONTEXT_STATUS.ERROR;
    return updatedState;
  }
  if (stateHasFetchesInStatus(state, FETCH_STATUS.FETCHING) || !state.neonContextState.isFinal) {
    updatedState.component.status = CONTEXT_STATUS.FETCHING;
    return updatedState;
  }
  updatedState.component.status = CONTEXT_STATUS.READY;
  return updatedState;
};

const sortReleases = (unsortedReleases: any) => {
  const releases = [...unsortedReleases];
  if (releases && releases.length > 1) {
    releases.sort((a, b) => (a.generationDate < b.generationDate ? 1 : -1));
  }
  return releases;
};

const withContextReleases = (neonContextState: any) => (
  neonContextState?.auth?.userData?.data?.releases || []
);

const applyUserRelease = (current: any, userReleases: any) => {
  if (!Array.isArray(current) || !Array.isArray(userReleases)) {
    return;
  }
  userReleases.forEach((userRelease) => {
    const hasRelease = current.some((value) => (
      (value?.release?.localeCompare(userRelease.releaseTag) === 0) || false
    ));
    if (!hasRelease) {
      current.push({
        ...userRelease,
        showCitation: true,
        showDoi: false,
        showViz: true,
        release: userRelease.releaseTag,
        description: userRelease.description,
        generationDate: userRelease.generationDate
          ? new Date(userRelease.generationDate).toISOString()
          : new Date().toISOString(),
      });
    }
  });
};

// Idempotent function to apply releases to state.data.releases. This is the global lookup for
// all releases applicable to this product. It's separate, and must be populated in this way,
// because the backend currently has no concept of bundles or metadata inheritance. As such a bundle
// child may not show as being in any release though the parent is (if the bundle is one that
// forwards availability). In such a case this will be called when the bundle parent is fetched
// and will thus populate the global releases object (and so the ReleaseFilter).
const applyReleasesGlobally = (state: any, releases: any) => {
  const updatedState = { ...state };
  releases
    .filter((r: any) => (
      !Object.prototype.hasOwnProperty.call(updatedState.data.productReleases, r.release)
    ))
    .forEach((r: any) => { updatedState.data.productReleases[r.release] = null; });
  releases
    .filter((r: any) => (
      updatedState.data.releases.every((existingR: any) => r.release !== existingR.release)
    ))
    .forEach((r: any) => {
      updatedState.data.releases.push({
        ...r,
        showCitation: true,
        showDoi: true,
        showViz: true,
      });
    });
  return updatedState;
};

/**
 * Calculates the bundle state for DataProductContext based on the bundle context
 * state stored in NeonContext.
 * @param bundlesCtx The NeonContext bundle state.
 * @param release The release derive bundles for.
 * @param productCode The product code to derive bundles for.
 * @return The new DataProductContext bundle state.
 */
const calculateBundles = (bundlesCtx: any, release: string, productCode: string) => {
  let bundleParentCode: Nullable<string> = null;
  let bundleParentCodes: string[] = [];
  let bundleForwardAvailabilityFromParent = null;
  const bundleRelease = BundleService.determineBundleRelease(release);
  const isBundleChild = BundleService.isProductInBundle(
    bundlesCtx,
    bundleRelease,
    productCode,
  );
  if (isBundleChild) {
    bundleParentCode = BundleService.getBundleProductCode(
      bundlesCtx,
      bundleRelease,
      productCode,
    );
    bundleForwardAvailabilityFromParent = BundleService.shouldForwardAvailability(
      bundlesCtx,
      bundleRelease,
      productCode,
      bundleParentCode as string,
    );
    const hasManyParents = isBundleChild
      && BundleService.isSplitProduct(bundlesCtx, bundleRelease, productCode);
    if (hasManyParents) {
      bundleParentCodes = BundleService.getSplitProductBundles(
        bundlesCtx,
        bundleRelease,
        productCode,
      );
    } else {
      const bundleCode = BundleService.getBundleProductCode(
        bundlesCtx,
        bundleRelease,
        productCode,
      );
      if (exists(bundleCode)) {
        bundleParentCodes = [bundleCode as string];
      }
    }
  }
  return {
    parentCodes: bundleParentCodes,
    doiProductCode: bundleParentCode,
    forwardAvailabilityFromParent: bundleForwardAvailabilityFromParent,
  };
};

/**
 * Calculates the current context state based on the NeonContext state,
 * derivation of bundles, and the resulting fetch and app status.
 * @param newState The DataProductContext state to build on.
 * @param neonContextState The new NeonContext state to integrate.
 * @param release The release to work from.
 * @param productCode The product code to work from.
 * @return The next DataProductContext state.
 */
const calculateContextState = (
  newState: any,
  neonContextState: any,
  release: string,
  productCode: string,
) => {
  const isErrorState = (newState.component.status === CONTEXT_STATUS.ERROR);
  const bundles = calculateBundles(
    neonContextState.data.bundles,
    release,
    productCode,
  );
  const newFetchState = calculateFetches({
    ...newState,
    bundle: bundles,
  });
  const newAppStatusState = calculateAppStatus({
    ...newFetchState,
    neonContextState,
  });
  // If the existing app state was errored due to initialization,
  // keep the current error state.
  if (isErrorState) {
    newAppStatusState.component.status = CONTEXT_STATUS.ERROR;
  }
  return newAppStatusState;
};

const Service = {
  getProvReleaseRegex,
  fetchIsAwaitingCall,
  stateHasFetchesInStatus,
  calculateFetches,
  calculateAppStatus,
  sortReleases,
  withContextReleases,
  applyUserRelease,
  applyReleasesGlobally,
  calculateBundles,
  calculateContextState,
};

export default Service;
