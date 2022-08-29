import { UnknownRecord } from './core';
import { IReleaseLike } from './internal';
export interface NeonApiResponse<T> {
    data: T;
}
export interface BundledDataProduct {
    productCode: string;
    isPrimaryBundle?: boolean;
}
export interface DataProductBundle {
    productCode: string;
    forwardAvailability: boolean;
    bundledProducts: BundledDataProduct[];
}
export interface ReleaseDataProductBundles {
    release: string;
    dataProductBundles: DataProductBundle[];
}
export interface Release extends IReleaseLike {
    dataProducts: UnknownRecord[];
}
export interface DataProductSpec {
    specId: string;
    specNumber: string;
    specType: string;
    specSize: number;
    specDescription: string;
}
export interface NeonDocument {
    name: string;
    type: string;
    size: number;
    description: string;
}
export interface DataProductReleaseDoi {
    url: string;
    generationDate: string;
}
export interface DataProductRelease extends IReleaseLike {
    url: string;
    productDoi: DataProductReleaseDoi;
}
export interface QuickStartGuideDocument {
    name: string;
    description: string;
    type: string;
    size: number;
    md5: string;
    generationDate: string;
    url: string;
}
export interface QuickStartGuideVersion {
    name: string;
    version: number;
    publishedDate: string;
    documents: QuickStartGuideDocument[];
}
