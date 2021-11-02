import { DataProductBundleContext } from '../types/neonContext';
export interface IDataProductBundleService {
    /**
     * Determines if the product is defined as a container or child within a bundle.
     * @param context The context to derive lookups from.
     * @param productCode The product code to search for.
     * @return True if the product is defined within bundles.
     */
    isProductDefined: (context: DataProductBundleContext, productCode: string) => boolean;
}
declare const DataProductBundleService: IDataProductBundleService;
export default DataProductBundleService;
