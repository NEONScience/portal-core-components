import { UnknownRecord } from './core';
import { IReleaseLike } from './internal';

export interface NeonApiResponse {
  data: unknown;
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
