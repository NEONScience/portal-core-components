import cloneDeep from 'lodash/cloneDeep';

import NeonContext from '../../NeonContext/NeonContext';

import { Nullable, UnknownRecord } from '../../../types/core';
import { DataProductRelease } from '../../../types/neonApi';
import { CitationBundleState, Release } from '../../../types/internal';

export const PROVISIONAL_RELEASE = 'provisional';

export enum FetchStatus {
  AWAITING_CALL = 'AWAITING_CALL',
  FETCHING = 'FETCHING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export enum ContextStatus {
  INITIALIZING = 'INITIALIZING',
  HAS_FETCHES_TO_TRIGGER = 'HAS_FETCHES_TO_TRIGGER',
  FETCHING = 'FETCHING',
  READY = 'READY',
  ERROR = 'ERROR',
}

export interface ContextStatusState {
  status: ContextStatus,
  error?: Nullable<UnknownRecord|string>,
}

export interface FetchStatusState {
  status: FetchStatus,
  error?: Nullable<UnknownRecord|string>,
}

export interface ContextFetchStatusState {
  product: Nullable<FetchStatusState>;
  productReleases: Record<string, FetchStatusState>;
  bundleParents: Record<string, FetchStatusState>;
  bundleParentReleases: Record<string, Record<string, FetchStatusState>>;
}

export type CitationRelease = DataProductRelease & Release;

// TODO: once product is moved to a proper interface,
// make this a "Pick" of that type.
export interface ContextDataProduct {
  productCode: string;
  productName: string;
  productDescription: string;
  releases: DataProductRelease[];
}

export interface DataState {
  product: Nullable<ContextDataProduct>;
  productReleases: Record<string, Nullable<ContextDataProduct>>;
  bundleParents: Record<string, ContextDataProduct>;
  bundleParentReleases: Record<string, Record<string, ContextDataProduct>>;
  releases: CitationRelease[];
}

export interface DataProductCitationState {
  productCode: Nullable<string>;
  release: Nullable<string>;
  component: ContextStatusState
  fetches: ContextFetchStatusState;
  bundle: CitationBundleState;
  data: DataState;
  neonContextState: UnknownRecord;
}

const DEFAULT_STATE: DataProductCitationState = {
  productCode: null,
  release: null,
  component: {
    status: ContextStatus.INITIALIZING,
    error: null,
  },
  fetches: {
    product: null,
    productReleases: {},
    bundleParents: {},
    bundleParentReleases: {},
  },
  bundle: {
    parentCodes: [],
    doiProductCode: null,
  },
  data: {
    // Latest and provisional product metadata
    product: null,
    // Product metadata on a per-release basis
    productReleases: {},
    // Latest and provisional bundle parent product metadata
    bundleParents: {},
    // Bundle parent product metadata on a per-release basis
    bundleParentReleases: {},
    // List of release objects; fed from base product or bundle inheritance
    releases: [],
  },

  neonContextState: cloneDeep(NeonContext.DEFAULT_STATE),
};

export const getDefaultState = (): DataProductCitationState => cloneDeep(DEFAULT_STATE);
