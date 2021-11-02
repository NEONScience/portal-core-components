import { AjaxResponse } from 'rxjs/ajax';
import { ReleaseDataProductBundles } from '../types/neonApi';
import { DataProductBundleContext } from '../types/neonContext';
export interface IDataProductBundleParser {
    /**
     * Parse the NEON API response to typed internal interface.
     * @param response The AJAX response to parse from.
     * @return The types internal representation of the API response shape.
     */
    parseBundlesResponse: (response: AjaxResponse) => ReleaseDataProductBundles[];
    /**
     * Parse the NEON API response shape to the context specific shape
     * with helper lookups.
     * @param bundles The NEON API bundle response shape.
     * @return The context shape for storing bundle information.
     */
    parseContext: (bundles: ReleaseDataProductBundles[]) => DataProductBundleContext;
}
declare const DataProductBundleParser: IDataProductBundleParser;
export default DataProductBundleParser;
