import { Dispatch } from 'react';
import BundleService from '../../../service/BundleService';
import ReleaseService, { PROVISIONAL_RELEASE } from '../../../service/ReleaseService';
import {
  AnyAction,
  Nullable,
  Undef,
  UnknownRecord,
} from '../../../types/core';
import { CitationBundleState, IReleaseLike } from '../../../types/internal';
import { DataProductDoiStatus, DataProductRelease, DoiStatusType } from '../../../types/neonApi';
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
  DataProductCitationItem,
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
  || Object.keys(state.fetches.productReleaseDois).some(
    (f: string): boolean => fetchIsInStatus(state.fetches.productReleaseDois[f], status),
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
  // Fetch the release specific doi state
  if (fetchRelease && !state.fetches.productReleaseDois[fetchRelease]) {
    newState.fetches.productReleaseDois[fetchRelease] = {
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
  updatedState.data.releases = ReleaseService.sortReleases(updatedState.data.releases);
  return updatedState;
};

const applyDoiStatusReleaseGlobally = (
  state: DataProductCitationState,
  productCode: string,
  release: string,
  doiStatus: Nullable<DataProductDoiStatus|DataProductDoiStatus[]>,
): DataProductCitationState => {
  if (!exists(doiStatus)) {
    return state;
  }
  const updatedState: DataProductCitationState = { ...state };
  // eslint-disable-next-line max-len
  const appliedDoiStatus: Nullable<DataProductDoiStatus> = BundleService.determineAppliedBundleRelease(
    ((updatedState.neonContextState?.data as UnknownRecord || {})).bundles as BundleContext,
    release,
    productCode,
    doiStatus,
  );
  const transformedRelease: Nullable<IReleaseLike> = ReleaseService.transformDoiStatusRelease(
    appliedDoiStatus,
  );
  if (!exists(transformedRelease)) {
    return updatedState;
  }
  const citationRelease: CitationRelease = transformedRelease as CitationRelease;
  const hasRelease: boolean = updatedState.data.releases.some((value: IReleaseLike): boolean => (
    exists(value)
    && isStringNonEmpty(value.release)
    && isStringNonEmpty(citationRelease.release)
    && (value.release.localeCompare(citationRelease.release) === 0)
  ));
  if (!hasRelease) {
    updatedState.data.releases.push(citationRelease);
  }
  updatedState.data.releases = ReleaseService.sortReleases(updatedState.data.releases);
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
  productCode: string,
  statusCb: FetchStatus,
): boolean => (
  Object.keys(citationDownloadsFetchStatus).some((k: string): boolean => {
    if (citationDownloadsFetchStatus[k]) {
      let shouldConsider = true;
      if (!k.includes(productCode)
          || (!provisionalCb && k.includes(PROVISIONAL_RELEASE))
          || (provisionalCb && !k.includes(PROVISIONAL_RELEASE))
      ) {
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
  productCode: string,
  dispatch: Undef<Dispatch<AnyAction>>,
): void => {
  Object.keys(citationDownloadsFetchStatus).forEach((k: string): void => {
    if (citationDownloadsFetchStatus[k]) {
      let shouldReset = true;
      if (!k.includes(productCode)
          || (!provisionalCb && k.includes(PROVISIONAL_RELEASE))
          || (provisionalCb && !k.includes(PROVISIONAL_RELEASE))
      ) {
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
      productReleaseDois,
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
  // Determine tombstoned state for entire citation
  const hasProductReleaseDois: boolean = exists(productReleaseDois)
    && isStringNonEmpty(appliedRenderedReleaseTag)
    && exists(productReleaseDois[appliedRenderedReleaseTag as string]);
  let dataProductDoiStatus: Nullable<DataProductDoiStatus|DataProductDoiStatus[]> = null;
  let isTombstoned: boolean = false;
  const determineDoiStatusTombstone = (
    dpds: DataProductDoiStatus|DataProductDoiStatus[],
  ): boolean => {
    let tsResult = false;
    if (!Array.isArray(dpds)) {
      // eslint-disable-next-line max-len
      const doiStatusType: Nullable<DoiStatusType> = (dpds as Nullable<DataProductDoiStatus>)?.status;
      tsResult = (exists(doiStatusType) && (doiStatusType === DoiStatusType.TOMBSTONED));
    } else {
      tsResult = dpds.every((ds: DataProductDoiStatus): boolean => {
        if (!exists(ds)) return false;
        return (ds.status === DoiStatusType.TOMBSTONED);
      });
    }
    return tsResult;
  };
  if (hasProductReleaseDois) {
    dataProductDoiStatus = productReleaseDois[appliedRenderedReleaseTag as string];
    isTombstoned = determineDoiStatusTombstone(
      dataProductDoiStatus as DataProductDoiStatus|DataProductDoiStatus[],
    );
  }
  // Identify whether or not viewing a bundled product with applicable DOI.
  const hasBundleCode: boolean = existsNonEmpty(bundle.parentCodes)
    && (isStringNonEmpty(bundle.doiProductCode)
      || (Array.isArray(bundle.doiProductCode) && existsNonEmpty(bundle.doiProductCode)));
  // Builds a citation item based on current state
  // of release, specified bundle code when applicable.
  const buildCitationItem = (
    bundleParentCode?: string,
    bundleDpds?: DataProductDoiStatus,
  ): DataProductCitationItem => {
    const item: DataProductCitationItem = {
      releaseObject: null,
      doiUrl: null,
      citableBaseProduct: null,
      citableReleaseProduct: null,
      bundleParentCode: null,
      isTombstoned: false,
    };
    let bundleProduct: Nullable<ContextDataProduct> = null;
    if (hasBundleCode
        && isStringNonEmpty(bundleParentCode)
        && exists(bundleParents[bundleParentCode as string])) {
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
    // Determine if the bundle product has data for the specified release.
    let isBundleProductInRelease: boolean = true;
    if (hasBundleProduct && hasSpecifiedRelease && !isAppliedReleaseLatestNonProv) {
      const bundleHasRelease: Undef<DataProductRelease> = bundleProduct?.releases.find(
        (r: DataProductRelease): boolean => r.release === appliedRenderedReleaseTag,
      );
      isBundleProductInRelease = exists(bundleHasRelease);
    }
    let itemReleaseObject: Nullable<CitationRelease> = appliedReleaseObject;
    let itemDoiUrl: Nullable<string> = appliedReleaseDoi;
    let itemIsTombstoned: boolean = false;
    // Determine if the citable product should be the bundle container product
    // or the currently specified product.
    // eslint-disable-next-line max-len
    const citableBaseProduct: Nullable<ContextDataProduct> = hasBundleProduct && isBundleProductInRelease
      ? bundleProduct
      : baseProduct;
    // Determine the product to use for citing within the applicable release
    // and within the context of bundles.
    let citableReleaseProduct: Nullable<ContextDataProduct> = null;
    if (hasAppliedReleaseDoi && !hideAppliedReleaseCitation) {
      // If we're referencing latest release and provisional, and there isn't a bundle
      // defined for the latest release, use base product for release citation.
      if (!hasSpecifiedRelease && !hasLatestReleaseBundle) {
        citableReleaseProduct = baseProduct;
      } else {
        // Has a specified release, or if not, has latest release bundle.
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
    // Determine release property states from current bundle.
    if (hasBundleCode
        && isStringNonEmpty(bundleParentCode)
        && exists(bundleDpds)) {
      const bundleCitationRelease: CitationRelease = ReleaseService.transformDoiStatusRelease(
        bundleDpds,
      ) as CitationRelease;
      itemReleaseObject = bundleCitationRelease;
      itemDoiUrl = bundleCitationRelease.productDoi.url;
      itemIsTombstoned = determineDoiStatusTombstone(bundleDpds as DataProductDoiStatus);
    }
    item.releaseObject = itemReleaseObject;
    item.doiUrl = itemDoiUrl;
    item.isTombstoned = itemIsTombstoned;
    item.citableBaseProduct = citableBaseProduct;
    item.citableReleaseProduct = citableReleaseProduct;
    item.bundleParentCode = bundleParentCode;
    return item;
  };
  // Build set of applicable citation items for product, bundle
  const items: DataProductCitationItem[] = [];
  if (!hasBundleCode) {
    const nonBundleItem: DataProductCitationItem = buildCitationItem();
    items.push(nonBundleItem);
  } else if (isStringNonEmpty(bundle.doiProductCode)) {
    const bundleParentCode: string = bundle.doiProductCode as string;
    const singleBundleItem: DataProductCitationItem = buildCitationItem(bundleParentCode);
    items.push(singleBundleItem);
  } else if (Array.isArray(bundle.doiProductCode) && existsNonEmpty(bundle.doiProductCode)) {
    const bundleParentCodes: string[] = bundle.doiProductCode;
    if (hasProductReleaseDois && !Array.isArray(dataProductDoiStatus)) {
      const bundleParentCode: string = bundle.doiProductCode[0];
      const singleBundleItem: DataProductCitationItem = buildCitationItem(bundleParentCode);
      items.push(singleBundleItem);
    } else {
      bundleParentCodes.forEach((bundleParentCode: string): void => {
        let bundleDpds: Undef<DataProductDoiStatus>;
        if (hasProductReleaseDois && Array.isArray(dataProductDoiStatus)) {
          bundleDpds = dataProductDoiStatus.find((ds: DataProductDoiStatus): boolean => {
            if (!exists(ds)) return false;
            return ds.productCode.localeCompare(bundleParentCode) === 0;
          });
        }
        // If we could not identify a matching DOI record for the bundle parent
        // code, it is an invalid state, do not capture.
        // This should not occur if bundles and DOIs are properly
        // configured and data come across properly in API calls.
        if (exists(bundleDpds)) {
          const bundleItem: DataProductCitationItem = buildCitationItem(
            bundleParentCode,
            bundleDpds,
          );
          items.push(bundleItem);
        }
      });
    }
  }
  // Determine if there's a valid product to generate the citation with.
  const hasValidProduct: boolean = items.some(
    (item: DataProductCitationItem): boolean => exists(item.citableBaseProduct),
  );
  const hasValidReleaseProduct: boolean = items.some(
    (item: DataProductCitationItem): boolean => exists(item.citableReleaseProduct),
  );
  // Verify identified release product is in the applied release.
  let isCitableReleaseProductInRelease: boolean = false;
  // If looking at latest release non provisional, consider in release.
  if (isAppliedReleaseLatestNonProv) {
    isCitableReleaseProductInRelease = true;
  } else if (hasValidReleaseProduct) {
    const productHasRelease: boolean = items.some((item: DataProductCitationItem): boolean => {
      const dpr: Undef<DataProductRelease> = item.citableReleaseProduct?.releases.find(
        (r: DataProductRelease): boolean => r.release === appliedRenderedReleaseTag,
      );
      return exists(dpr) || item.isTombstoned;
    });
    isCitableReleaseProductInRelease = productHasRelease || isTombstoned;
  }
  // Determine the overall citation display status.
  let appliedStatus: ContextStatus = status;
  let displayType: DisplayType = DisplayType.CONDITIONAL;
  const isReady: boolean = (status === ContextStatus.READY);
  const isError: boolean = (status === ContextStatus.ERROR);
  const setErrorNotAvailable = (): void => {
    appliedStatus = ContextStatus.ERROR;
    displayType = DisplayType.NOT_AVAILABLE;
  };
  if (isReady) {
    if (!hasValidProduct) {
      // If the context is ready and no product is identified, error state.
      setErrorNotAvailable();
    } else if (hasSpecifiedRelease) {
      // A release has been specified, determine validity.
      if (hideAppliedReleaseCitation && !isAppliedReleaseLatestNonProv) {
        // If a release was specified but that release is configured to
        // not show a release citation, show not available display state.
        displayType = DisplayType.NOT_AVAILABLE;
      } else if (hasAppliedReleaseDoi) {
        if (hasValidReleaseProduct) {
          // If the identified release product doesn't have data in the
          // release and we're viewing a specific release, report
          // as not available for that release.
          if (!isCitableReleaseProductInRelease) {
            displayType = DisplayType.NOT_AVAILABLE;
          } else {
            displayType = DisplayType.RELEASE;
          }
        } else {
          // If the component is ready and a release was specified but
          // failed to resolve the appropriate citable release product,
          // error state.
          setErrorNotAvailable();
        }
      } else if (isAppliedReleaseLatestNonProv) {
        displayType = DisplayType.PROVISIONAL;
      } else {
        // If no valid DOI has been identified and it's not
        // a special case, render as not available.
        displayType = DisplayType.NOT_AVAILABLE;
      }
    } else if (!isCitableReleaseProductInRelease) {
      // If the detected citable release product is not in the applied
      // release, then consider the display as provisional.
      displayType = DisplayType.PROVISIONAL;
    } else if (!hasLatestRelease || hideLatestReleaseCitation || disableConditional) {
      // If display is determined to be conditional, but we haven't identified
      // a valid latest release or it's set to hide the citation for that
      // release, then display as provisional.
      // If an override has been presented by the component, also
      // display as provisional.
      displayType = DisplayType.PROVISIONAL;
    } else if (!hasValidProduct || !hasValidReleaseProduct) {
      // If the component is ready and the display state is conditional
      // and a valid product and release product were not found, error state.
      setErrorNotAvailable();
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
    citationItems: items,
    releases,
    displayType,
    isTombstoned,
    citationDownloadsFetchStatus,
  };
};

const Service = {
  fetchIsAwaitingCall,
  stateHasFetchesInStatus,
  calculateFetches,
  calculateAppStatus,
  applyReleasesGlobally,
  applyDoiStatusReleaseGlobally,
  calculateContextState,
  useViewState,
  getReleaseObject,
  getReleaseDoi,
  buildCitationDownloadKey,
  hasCitationDownloadStatus,
  handleResetCitationDownloads,
};

export default Service;
