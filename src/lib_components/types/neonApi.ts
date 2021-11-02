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
