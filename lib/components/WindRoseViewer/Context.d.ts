import React, { Dispatch } from 'react';
import { AjaxResponse } from 'rxjs/ajax';
import { AnyAction, Undef, Nullable, UnknownRecord } from '../../types/core';
import { AsyncStateType } from '../../types/asyncFlow';
interface Position {
    horizontal: string;
    vertical: string;
}
interface WindRoseViewerQueryState {
    changeType: Nullable<string>;
    sites: Array<string>;
    months: Array<string>;
    positions: Array<Position>;
}
interface WindRoseViewerDataState {
    dailyBins: Record<number, unknown>;
    current: Nullable<[]>;
}
interface SelectionOption {
    value: string;
    label: string;
}
interface PositionDisplayOption extends SelectionOption {
    position: Position;
}
export interface FetchStatusState {
    status: AsyncStateType;
    error?: Nullable<UnknownRecord | string>;
}
interface WindRoseViewerFetchState {
    product: Nullable<FetchStatusState>;
    data: Nullable<FetchStatusState>;
}
export interface WindRoseViewerState {
    productCode: Nullable<string>;
    release: Undef<string>;
    product: Nullable<Record<string, unknown>>;
    fetchState: WindRoseViewerFetchState;
    dataStateMessage: Nullable<string>;
    siteOptions: Array<SelectionOption>;
    monthOptions: Array<SelectionOption>;
    positionOptions: Array<PositionDisplayOption>;
    query: WindRoseViewerQueryState;
    data: WindRoseViewerDataState;
    neonContextState: UnknownRecord;
}
export declare const useStateContext: () => WindRoseViewerState;
export declare const useDispatchContext: () => Dispatch<AnyAction>;
export declare enum ActionTypes {
    STORE_FINALIZED_NEON_CONTEXT_STATE = "STORE_FINALIZED_NEON_CONTEXT_STATE",
    FETCH_PRODUCT = "FETCH_PRODUCT",
    FETCH_PRODUCT_STARTED = "FETCH_PRODUCT_STARTED",
    FETCH_PRODUCT_FAILED = "FETCH_PRODUCT_FAILED",
    FETCH_PRODUCT_SUCCEEDED = "FETCH_PRODUCT_SUCCEEDED",
    RESET_FETCH_PRODUCT = "RESET_FETCH_PRODUCT",
    FETCH_WIND_ROSE = "FETCH_WIND_ROSE",
    FETCH_WIND_ROSE_WORKING = "FETCH_WIND_ROSE_WORKING",
    FETCH_WIND_ROSE_FULLFILLED = "FETCH_WIND_ROSE_FULLFILLED",
    FETCH_WIND_ROSE_FAILED = "FETCH_WIND_ROSE_FAILED",
    RESET_WIND_ROSE = "RESET_WIND_ROSE",
    REINITIALIZE = "REINITIALIZE"
}
export interface StoreFinalizedNeonContextStateAction extends AnyAction {
    type: typeof ActionTypes.STORE_FINALIZED_NEON_CONTEXT_STATE;
    neonContextState: UnknownRecord;
}
export interface FetchProductAction extends AnyAction {
    type: typeof ActionTypes.FETCH_PRODUCT;
    productCode: string;
    release: Undef<string>;
}
export interface FetchProductStartedAction extends AnyAction {
    type: typeof ActionTypes.FETCH_PRODUCT_STARTED;
}
export interface FetchProductFailedAction extends AnyAction {
    type: typeof ActionTypes.FETCH_PRODUCT_FAILED;
    error: Nullable<AjaxResponse<unknown> | string>;
}
export interface FetchProductSucceededAction extends AnyAction {
    type: typeof ActionTypes.FETCH_PRODUCT_SUCCEEDED;
    data: UnknownRecord;
}
interface ResetFetchProductAction extends AnyAction {
    type: typeof ActionTypes.RESET_FETCH_PRODUCT;
}
interface FetchWindRoseAction extends AnyAction {
    type: typeof ActionTypes.FETCH_WIND_ROSE;
    product: UnknownRecord;
    release: Undef<string>;
    query: WindRoseViewerQueryState;
}
interface FetchWindRoseWorkingAction extends AnyAction {
    type: typeof ActionTypes.FETCH_WIND_ROSE_WORKING;
}
interface FetchWindRoseFullfilledAction extends AnyAction {
    type: typeof ActionTypes.FETCH_WIND_ROSE_FULLFILLED;
    response: unknown;
    query: WindRoseViewerQueryState;
}
interface FetchWindRoseFailedAction extends AnyAction {
    type: typeof ActionTypes.FETCH_WIND_ROSE_FAILED;
    error: unknown;
    response: unknown;
    initAction: FetchWindRoseAction;
}
interface ResetWindRoseAction extends AnyAction {
    type: typeof ActionTypes.RESET_WIND_ROSE;
}
interface ReinitializeAction extends AnyAction {
    type: typeof ActionTypes.REINITIALIZE;
    productCode: string;
    release: Undef<string>;
}
export declare const ActionCreator: {
    storeFinalizedNeonContextState: (neonContextState: UnknownRecord) => StoreFinalizedNeonContextStateAction;
    fetchProduct: (productCode: string, release?: string) => FetchProductAction;
    fetchProductStarted: () => FetchProductStartedAction;
    fetchProductFailed: (error: Nullable<AjaxResponse<unknown> | string>) => FetchProductFailedAction;
    fetchProductSucceeded: (data: UnknownRecord) => FetchProductSucceededAction;
    resetFetchProduct: () => ResetFetchProductAction;
    fetchWindRose: (product: UnknownRecord, release: Undef<string>, query: WindRoseViewerQueryState) => FetchWindRoseAction;
    fetchWindRoseWorking: () => FetchWindRoseWorkingAction;
    fetchWindRoseFullfilled: (response: unknown, query: WindRoseViewerQueryState) => FetchWindRoseFullfilledAction;
    fetchWindRoseFailed: (error: unknown, response: unknown, initAction: FetchWindRoseAction) => FetchWindRoseFailedAction;
    resetWindRose: () => ResetWindRoseAction;
    reinitialize: (productCode: string, release?: string) => ReinitializeAction;
};
interface ProviderProps {
    productCode: Nullable<string>;
    release: Undef<string>;
    children?: React.ReactNode | React.ReactNode[];
}
declare const Provider: React.FC<ProviderProps>;
export default Provider;
