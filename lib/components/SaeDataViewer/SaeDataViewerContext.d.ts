import React, { Dispatch } from 'react';
import { AnyAction, Nullable, Undef } from '../../types/core';
export declare enum FetchStatus {
    AWAITING_CALL = "AWAITING_CALL",
    FETCHING = "FETCHING",
    ERROR = "ERROR",
    SUCCESS = "SUCCESS",
    IDLE = "IDLE"
}
export declare enum ControlStatus {
    VALID = "VALID",
    INVALID = "INVALID"
}
export declare enum BokehPlotStatus {
    RENDERING_DATA = "RENDERING_DATA",
    COMPLETED = "COMPLETED",
    IDLE = "IDLE"
}
export declare enum BokehDataStatus {
    DATA_AVAILABLE = "DATA_AVAILABLE",
    NO_DATA = "NO_DATA"
}
export interface SaeDataProductVariable {
    name: string;
    units: string;
}
export interface SaeDataProductData {
    productCode: string;
    productName: string;
    productDescription: string;
}
export interface SaeDataProduct {
    name: string;
    productShortCodes: string[];
    productCodes: string[];
    variables: SaeDataProductVariable[];
    productData?: Record<string, SaeDataProductData>;
}
export declare const SAE_BUNDLE_PRODUCT_CODE = "DP4.00200.001";
export interface BokehPlotFetch {
    fetchStatus: FetchStatus;
}
export interface BokehPlot {
    plotStatus: BokehPlotStatus;
    data: Nullable<Record<string, unknown>>;
    dataStatus: BokehDataStatus;
    message: Nullable<string>;
}
export interface ProductsFetch {
    fetchStatus: FetchStatus;
}
export interface SaeDataViewerInitProps {
    productCode: Undef<string>;
}
export interface SaeDataViewerControlsState {
    status: ControlStatus;
    statusMessage: Nullable<string>;
    saeDataProducts: Array<SaeDataProduct>;
    sites: Array<string>;
    h2oSites: Array<string>;
    minDate: Date;
    maxDate: Date;
}
export interface SaeDataViewerContextState {
    isViewerLimitedMode: boolean;
    saeProduct: SaeDataProduct;
    site: string;
    startDate: Date;
    endDate: Date;
    initProps: SaeDataViewerInitProps;
    productsFetch: ProductsFetch;
    bokehPlotFetch: BokehPlotFetch;
    bokehPlot: BokehPlot;
    controlsState: SaeDataViewerControlsState;
}
export interface SaeDataViewerProps {
    productCode?: Undef<string>;
}
declare const SaeDataViewerContext: {
    Provider: React.FC<React.PropsWithChildren<SaeDataViewerProps>>;
    useSaeDataViewerContextState: () => SaeDataViewerContextState;
    useSaeDataViewerContextDispatch: () => Undef<Dispatch<AnyAction>>;
};
export default SaeDataViewerContext;
