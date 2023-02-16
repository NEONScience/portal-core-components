import { Nullable, UnknownRecord } from '../../../types/core';
import { DataProductDoiStatus, DataProductRelease } from '../../../types/neonApi';
import { CitationBundleState, Release } from '../../../types/internal';
export declare enum FetchStatus {
    AWAITING_CALL = "AWAITING_CALL",
    FETCHING = "FETCHING",
    ERROR = "ERROR",
    SUCCESS = "SUCCESS",
    IDLE = "IDLE"
}
export declare enum ContextStatus {
    INITIALIZING = "INITIALIZING",
    HAS_FETCHES_TO_TRIGGER = "HAS_FETCHES_TO_TRIGGER",
    FETCHING = "FETCHING",
    READY = "READY",
    ERROR = "ERROR"
}
export interface ContextStatusState {
    status: ContextStatus;
    error?: Nullable<UnknownRecord | string>;
}
export interface FetchStatusState {
    status: FetchStatus;
    error?: Nullable<UnknownRecord | string>;
}
export interface ContextFetchStatusState {
    product: Nullable<FetchStatusState>;
    productReleases: Record<string, FetchStatusState>;
    productReleaseDois: Record<string, FetchStatusState>;
    bundleParents: Record<string, FetchStatusState>;
    bundleParentReleases: Record<string, Record<string, FetchStatusState>>;
    citationDownloads: Record<string, FetchStatusState>;
}
export type CitationRelease = DataProductRelease & Release;
export interface ContextDataProduct {
    productCode: string;
    productName: string;
    productDescription: string;
    releases: DataProductRelease[];
}
export interface DataState {
    product: Nullable<ContextDataProduct>;
    productReleases: Record<string, Nullable<ContextDataProduct>>;
    productReleaseDois: Record<string, Nullable<DataProductDoiStatus | DataProductDoiStatus[]>>;
    bundleParents: Record<string, ContextDataProduct>;
    bundleParentReleases: Record<string, Record<string, ContextDataProduct>>;
    releases: CitationRelease[];
}
export interface DataProductCitationState {
    productCode: Nullable<string>;
    release: Nullable<string>;
    component: ContextStatusState;
    fetches: ContextFetchStatusState;
    bundle: CitationBundleState;
    data: DataState;
    neonContextState: UnknownRecord;
}
export declare const getDefaultState: () => DataProductCitationState;
