import { DataProductRelease } from '../types/neonApi';
import { Nullable } from '../types/core';
export interface ICitationService {
    getDateFormatted: () => string;
    buildDataProductCitationText: (product: any, productReleaseObject: Nullable<DataProductRelease>) => string;
    buildPrototypeDatasetCitationText: (dataset: any) => string;
}
declare const CitationService: ICitationService;
export default CitationService;
