import { Dispatch } from 'react';
import BundleService from '../../../service/BundleService';
import ReleaseService, { PROVISIONAL_RELEASE } from '../../../service/ReleaseService';
import {
  AnyAction,
  Nullable,
  Undef,
  UnknownRecord,
} from '../../../types/core';
import { CitationBundleState } from '../../../types/internal';
import { DataProductRelease } from '../../../types/neonApi';
import { BundleContext } from '../../../types/neonContext';
import { exists, existsNonEmpty, isStringNonEmpty } from '../../../util/typeUtil';
import ActionCreator from './Actions';

import {
  FetchStatus,
  ContextStatus,
  FetchStatusState,
  DataProductCitationState,
  DataState,
  CitationRelease,
  ContextDataProduct,
} from './State';
import {
  DataProductCitationViewProps,
  DataProductCitationViewState,
  DisplayType,
} from './ViewState';

const fetchIsInStatus = (fetchObject: Nullable<FetchStatusState>, status: string): boolean => (
  typeof fetchObject === 'object' && fetchObject !== null && fetchObject.status === status
);

const fetchIsAwaitingCall = (fetchObject: Nullable<FetchStatusState>): boolean => (
  fetchIsInStatus(fetchObject, FetchStatus.AWAITING_CALL)
);

const stateHasFetchesInStatus = (state: DataProductCitationState, status: string): boolean => (
  fetchIsInStatus(state.fetches.product, status)
  || Object.keys(state.fetches.productReleases).some(
    (f: string): boolean => fetchIsInStatus(state.fetches.productReleases[f], status),
  )
  || Object.keys(state.fetches.bundleParents).some(
    (f: string): boolean => fetchIsInStatus(state.fetches.bundleParents[f], status),
  )
  || Object.keys(state.fetches.bundleParentReleases).some(
    (bundleParent: string): boolean => (
      Object.keys(state.fetches.bundleParentReleases[bundleParent]).some(
        (f: string): boolean => (
          fetchIsInStatus(state.fetches.bundleParentReleases[bundleParent][f], status)
        ),
      )
    ),
  )
);

const calculateFetches = (state: DataProductCitationState): DataProductCitationState => {
  const newState: DataProductCitationState = { ...state };
  const {
    productCode,
    release,
    bundle: { parentCodes },
  }: DataProductCitationState = state;
  const { releases }: DataState = state.data;
  if (!productCode) { return state; }
  // Find the latest non-prov release definition
  const latestRelease: Nullable<CitationRelease> = existsNonEmpty(releases)
    ? releases.find((r: CitationRelease) => !ReleaseService.isLatestNonProv(r.release))
    : null;
  const fetchRelease = release || (latestRelease || {}).release;
  // Fetch the base product
  if (!state.fetches.product) {
    newState.fetches.product = {
      status: FetchStatus.AWAITING_CALL,
    };
  }
  // Fetch the release-specific product
  if (fetchRelease && !state.fetches.productReleases[fetchRelease]) {
    newState.fetches.productReleases[fetchRelease] = {
      status: FetchStatus.AWAITING_CALL,
    };
  }
  // Fetch all base bundle parent products
  (parentCodes || []).forEach((bundleParentCode: string) => {
    if (!newState.fetches.bundleParents[bundleParentCode]) {
      newState.fetches.bundleParents[bundleParentCode] = {
        status: FetchStatus.AWAITING_CALL,
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
          status: FetchStatus.AWAITING_CALL,
        };
      }
    });
  }
  return newState;
};

const calculateAppStatus = (state: DataProductCitationState): DataProductCitationState => {
  const updatedState: DataProductCitationState = { ...state };
  if (stateHasFetchesInStatus(state, FetchStatus.ERROR) || state.neonContextState.hasError) {
    updatedState.component.status = ContextStatus.ERROR;
    return updatedState;
  }
  if (stateHasFetchesInStatus(state, FetchStatus.AWAITING_CALL)) {
    updatedState.component.status = ContextStatus.HAS_FETCHES_TO_TRIGGER;
    return updatedState;
  }
  if (stateHasFetchesInStatus(state, FetchStatus.FETCHING) || !state.neonContextState.isFinal) {
    updatedState.component.status = ContextStatus.FETCHING;
    return updatedState;
  }
  updatedState.component.status = ContextStatus.READY;
  return updatedState;
};

// Idempotent function to apply releases to state.data.releases. This is the global lookup for
// all releases applicable to this product. It's separate, and must be populated in this way,
// because the backend currently has no concept of bundles or metadata inheritance. As such a bundle
// child may not show as being in any release though the parent is (if the bundle is one that
// forwards availability). In such a case this will be called when the bundle parent is fetched
// and will thus populate the global releases object (and so the ReleaseFilter).
const applyReleasesGlobally = (
  state: DataProductCitationState,
  releases: DataProductRelease[],
): DataProductCitationState => {
  const updatedState: DataProductCitationState = { ...state };
  releases
    .filter((r: DataProductRelease): boolean => (
      !Object.prototype.hasOwnProperty.call(updatedState.data.productReleases, r.release)
    ))
    .forEach((r: DataProductRelease): void => {
      updatedState.data.productReleases[r.release] = null;
    });
  releases
    .filter((r: DataProductRelease): boolean => (
      updatedState.data.releases.every((existingR: CitationRelease): boolean => (
        r.release !== existingR.release
      ))
    ))
    .forEach((r: DataProductRelease): void => {
      updatedState.data.releases.push({
        ...r,
        description: r.release,
        showCitation: true,
        showDoi: true,
        showViz: true,
      });
    });
  return updatedState;
};

/**
 * Calculates the current context state based on the NeonContext state,
 * derivation of bundles, and the resulting fetch and app status.
 * @param newState The DataProductCitationState state to build on.
 * @param neonContextState The new NeonContext state to integrate.
 * @param release The release to work from.
 * @param productCode The product code to work from.
 * @return The next DataProductCitationState state.
 */
const calculateContextState = (
  newState: DataProductCitationState,
  neonContextState: UnknownRecord,
  release: Nullable<string>,
  productCode: Nullable<string>,
): DataProductCitationState => {
  const isErrorState = (newState.component.status === ContextStatus.ERROR);
  let bundles: CitationBundleState = {
    parentCodes: [],
    doiProductCode: null,
  };
  if (isStringNonEmpty(productCode)) {
    bundles = BundleService.determineCitationBundle(
      (neonContextState.data as UnknownRecord).bundles as BundleContext,
      release,
      productCode as string,
    );
  }
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
    newAppStatusState.component.status = ContextStatus.ERROR;
  }
  return newAppStatusState;
};

const getReleaseObject = (
  releases: CitationRelease[],
  release: Nullable<string>,
): Nullable<CitationRelease> => (
  !isStringNonEmpty(release) || (release === PROVISIONAL_RELEASE)
    ? null
    : releases.find((r: CitationRelease): boolean => r.release === release)
);
const getReleaseDoi = (
  releases: CitationRelease[],
  release: Nullable<string>,
): Nullable<string> => {
  const releaseObject: Nullable<CitationRelease> = getReleaseObject(releases, release);
  if (!exists(releaseObject)
      || !exists((releaseObject as CitationRelease).productDoi)
      || !isStringNonEmpty((releaseObject as CitationRelease).productDoi.url)) {
    return null;
  }
  return (releaseObject as CitationRelease).productDoi.url;
};

const buildCitationDownloadKey = (
  citationProduct: ContextDataProduct,
  releaseCb: string,
  formatCb: string,
  provisionalCb = true,
): string => {
  let key = `citation-download-${citationProduct.productCode}`;
  if (isStringNonEmpty(releaseCb)) {
    key = `${key}-${releaseCb}`;
  } else if (provisionalCb) {
    key = `${key}-${PROVISIONAL_RELEASE}`;
  } else {
    key = `${key}-RELEASE`;
  }
  if (isStringNonEmpty(formatCb)) {
    key = `${key}-${formatCb}`;
  } else {
    key = `${key}-FORMAT`;
  }
  return key;
};
const hasCitationDownloadStatus = (
  citationDownloadsFetchStatus: Record<string, FetchStatusState>,
  provisionalCb: boolean,
  statusCb: FetchStatus,
): boolean => (
  Object.keys(citationDownloadsFetchStatus).some((k: string): boolean => {
    if (citationDownloadsFetchStatus[k]) {
      let shouldConsider = true;
      if (!provisionalCb && k.includes(PROVISIONAL_RELEASE)) {
        shouldConsider = false;
      } else if (provisionalCb && !k.includes(PROVISIONAL_RELEASE)) {
        shouldConsider = false;
      }
      if (shouldConsider && (citationDownloadsFetchStatus[k].status === statusCb)) {
        return true;
      }
    }
    return false;
  })
);
const handleResetCitationDownloads = (
  citationDownloadsFetchStatus: Record<string, FetchStatusState>,
  provisionalCb: boolean,
  dispatch: Undef<Dispatch<AnyAction>>,
): void => {
  Object.keys(citationDownloadsFetchStatus).forEach((k: string): void => {
    if (citationDownloadsFetchStatus[k]) {
      let shouldReset = true;
      if (!provisionalCb && k.includes(PROVISIONAL_RELEASE)) {
        shouldReset = false;
      } else if (provisionalCb && !k.includes(PROVISIONAL_RELEASE)) {
        shouldReset = false;
      }
      if (shouldReset) {
        if (citationDownloadsFetchStatus[k].status !== FetchStatus.IDLE) {
          if (dispatch) {
            dispatch(ActionCreator.fetchCitationDownloadReset(k));
          }
        }
      }
    }
  });
};

const useViewState = (
  state: DataProductCitationState,
  props: DataProductCitationViewProps,
): DataProductCitationViewState => {
  const {
    release: specifiedReleaseTag,
    bundle,
    component: {
      status,
    },
    fetches: {
      citationDownloads: citationDownloadsFetchStatus,
    },
    data: {
      product: baseProduct,
      productReleases,
      bundleParents,
      bundleParentReleases,
      releases,
    },
    neonContextState: {
      data: neonContextStateData,
    },
  }: DataProductCitationState = state;
  const bundlesContext = (neonContextStateData as UnknownRecord).bundles as BundleContext;
  const { disableConditional }: DataProductCitationViewProps = props;
  const hasReleases: boolean = existsNonEmpty(releases);
  // Identify the latest release state.
  const latestReleaseObject: Nullable<CitationRelease> = hasReleases
    ? releases.find((r: CitationRelease) => r.showCitation === true)
    : null;
  const hasLatestRelease: boolean = exists(latestReleaseObject)
    && isStringNonEmpty((latestReleaseObject as CitationRelease).release);
  const hideLatestReleaseCitation: boolean = hasLatestRelease
    ? ((latestReleaseObject as CitationRelease).showCitation === false)
    : false;
  // Identify state of specified release.
  const hasSpecifiedRelease: boolean = isStringNonEmpty(specifiedReleaseTag);
  const specifiedReleaseObject: Nullable<CitationRelease> = hasSpecifiedRelease && hasReleases
    ? getReleaseObject(releases, specifiedReleaseTag)
    : null;
  const isSpecifiedReleaseValid: boolean = exists(specifiedReleaseObject)
    && isStringNonEmpty((specifiedReleaseObject as CitationRelease).release);
  const isSpecifiedReleaseLatestNonProv: boolean = hasSpecifiedRelease
    ? ReleaseService.isLatestNonProv(specifiedReleaseTag as string)
    : false;
  // Determine the release tag to render for the citation, either for the
  // currently specified release or the latest release.
  let appliedReleaseObject: Nullable<CitationRelease> = null;
  let appliedRenderedReleaseTag: Nullable<string> = null;
  if (hasSpecifiedRelease) {
    if (isSpecifiedReleaseValid) {
      appliedReleaseObject = specifiedReleaseObject;
      appliedRenderedReleaseTag = (specifiedReleaseObject as CitationRelease).release;
    }
  } else if (hasLatestRelease) {
    appliedReleaseObject = latestReleaseObject;
    appliedRenderedReleaseTag = (latestReleaseObject as CitationRelease).release;
  }
  const hasAppliedRelease: boolean = exists(appliedReleaseObject);
  const isAppliedReleaseLatestNonProv: boolean = isStringNonEmpty(appliedRenderedReleaseTag)
    ? ReleaseService.isLatestNonProv(appliedRenderedReleaseTag as string)
    : false;
  let appliedReleaseDoi: Nullable<string> = null;
  if (hasAppliedRelease && !isAppliedReleaseLatestNonProv) {
    const aro: CitationRelease = (appliedReleaseObject as CitationRelease);
    if (exists(aro.productDoi) && isStringNonEmpty(aro.productDoi.url)) {
      appliedReleaseDoi = aro.productDoi.url;
    }
  }
  const hasAppliedReleaseDoi: boolean = isStringNonEmpty(appliedReleaseDoi);
  const hideAppliedReleaseCitation: boolean = exists(appliedReleaseObject)
    && ((appliedReleaseObject as CitationRelease).showCitation === false);
  // Identify whether or not viewing a bundled product with applicable DOI
  // and capture the bundle DOI product code.
  const hasBundleCode: boolean = existsNonEmpty(bundle.parentCodes)
    && isStringNonEmpty(bundle.doiProductCode);
  const bundleParentCode: Nullable<string> = hasBundleCode
    ? bundle.doiProductCode
    : null;
  let bundleProduct: Nullable<ContextDataProduct> = null;
  if (hasBundleCode && exists(bundleParents[bundleParentCode as string])) {
    bundleProduct = bundleParents[bundleParentCode as string];
  }
  const hasBundleProduct: boolean = exists(bundleProduct);
  // Determines if the latest release has a bundle defined for this product.
  let hasLatestReleaseBundle: boolean = false;
  if (hasLatestRelease && exists(baseProduct)) {
    hasLatestReleaseBundle = BundleService.isProductInBundle(
      bundlesContext,
      (latestReleaseObject as CitationRelease).release,
      (baseProduct as ContextDataProduct).productCode,
    );
  }
  // Determine if the citable product should be the bundle container product
  // or the currently specified product.
  const citableBaseProduct: Nullable<ContextDataProduct> = hasBundleProduct
    ? bundleProduct
    : baseProduct;
  // Determine the product to use for citing within the applicable release
  // and within the context of bundles.
  let citableReleaseProduct: Nullable<ContextDataProduct> = null;
  if (hasAppliedReleaseDoi && !hideAppliedReleaseCitation) {
    // If we're referencing latest release and provisional, and there isn't a bundle
    // defined for the latest release, use base product for release citation
    if (!hasSpecifiedRelease && !hasLatestReleaseBundle) {
      citableReleaseProduct = baseProduct;
    } else {
      // When a bundled product code is available for the given release,
      // get the product for the parent code and release.
      // Otherwise, the citable product is the current product for the specified
      // release when available.
      // eslint-disable-next-line no-lonely-if
      if (hasBundleCode) {
        const bpr: Record<string, Nullable<ContextDataProduct>> = bundleParentReleases[
          bundleParentCode as string
        ];
        if (exists(bpr)) {
          const product: Nullable<ContextDataProduct> = bpr[appliedRenderedReleaseTag as string];
          if (exists(product)) {
            citableReleaseProduct = product;
          }
        }
      } else {
        const product: Nullable<ContextDataProduct> = productReleases[
          appliedRenderedReleaseTag as string
        ];
        if (exists(product)) {
          citableReleaseProduct = product;
        }
      }
    }
  }
  // Determine if there's a valid product to generate the citation with.
  const hasValidProduct: boolean = exists(citableBaseProduct);
  // Determine the overall citation display status.
  let appliedStatus: ContextStatus = status;
  let displayType: DisplayType = DisplayType.CONDITIONAL;
  const isReady: boolean = (status === ContextStatus.READY);
  const isError: boolean = (status === ContextStatus.ERROR);
  if (isReady) {
    if (!hasValidProduct) {
      // If the context is ready and no product is identified, error state.
      appliedStatus = ContextStatus.ERROR;
      displayType = DisplayType.NOT_AVAILABLE;
    } else if (hasSpecifiedRelease) {
      // A release has been specified, determine validity.
      if (hideAppliedReleaseCitation && !isAppliedReleaseLatestNonProv) {
        // If a release was specified but that release is configured to
        // not show a release citation, show not available display state.
        displayType = DisplayType.NOT_AVAILABLE;
      } else if (hasAppliedReleaseDoi) {
        if (exists(citableReleaseProduct)) {
          displayType = DisplayType.RELEASE;
        } else {
          // If the component is ready and a release was specified but
          // failed to resolve the appropriate citable release product,
          // error state.
          appliedStatus = ContextStatus.ERROR;
          displayType = DisplayType.NOT_AVAILABLE;
        }
      } else if (isAppliedReleaseLatestNonProv) {
        displayType = DisplayType.PROVISIONAL;
      } else {
        // If no valid DOI has been identified and it's not
        // a special case, render as not available.
        displayType = DisplayType.NOT_AVAILABLE;
      }
    } else if (!hasLatestRelease || hideLatestReleaseCitation || disableConditional) {
      // If display is determined to be conditional, but we haven't identified
      // a valid latest release or it's set to hide the citation for that
      // release, then display as provisional.
      // If an override has been presented by the component, also
      // display as provisional.
      displayType = DisplayType.PROVISIONAL;
    } else if (!hasValidProduct || !exists(citableReleaseProduct)) {
      // If the component is ready and the display state is conditional
      // and a valid product and release product were not found, error state.
      appliedStatus = ContextStatus.ERROR;
      displayType = DisplayType.NOT_AVAILABLE;
    }
  } else if (isError) {
    if (hasSpecifiedRelease && isSpecifiedReleaseLatestNonProv) {
      // If the component is in error state due to a special case release,
      // convey the state of the component as not available instead of error.
      appliedStatus = ContextStatus.READY;
      displayType = DisplayType.NOT_AVAILABLE;
    }
  }
  return {
    status: appliedStatus,
    releaseObject: appliedReleaseObject,
    doiUrl: appliedReleaseDoi,
    releases,
    citableBaseProduct,
    citableReleaseProduct,
    displayType,
    bundleParentCode,
    citationDownloadsFetchStatus,
  };
};

const Service = {
  fetchIsAwaitingCall,
  stateHasFetchesInStatus,
  calculateFetches,
  calculateAppStatus,
  applyReleasesGlobally,
  calculateContextState,
  useViewState,
  getReleaseObject,
  getReleaseDoi,
  buildCitationDownloadKey,
  hasCitationDownloadStatus,
  handleResetCitationDownloads,
};

export default Service;
