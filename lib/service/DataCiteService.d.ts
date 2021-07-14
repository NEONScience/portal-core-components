export declare enum CitationDownloadType {
    DATA_PRODUCT = "DATA_PRODUCT",
    PROTOTYPE_DATASET = "PROTOTYPE_DATASET"
}
export interface CitationFormat {
    shortName: string;
    longName: string;
    mime: string;
    extension: string;
    applicableDownloadtypes: CitationDownloadType[];
    generateProvisionalCitation: (product: Record<string, unknown>) => string;
    generateProtoDatasetProvisionalCitation: (dataset: Record<string, unknown>) => string;
}
/**
 * Service for working with DataCite
 */
export interface IDataCiteService {
    getDoiUrl: (doi: string, format: CitationFormat) => string;
    getCitationFormats: () => CitationFormat[];
    getDataProductFormats: () => CitationFormat[];
    getPrototypeDatasetFormats: () => CitationFormat[];
    downloadCitation: (formatShortName: string, type: CitationDownloadType, target: Record<string, unknown>, doi: string, release?: string) => void;
    executeDownload: (fileName: string, mimeType: string, payload: string) => void;
}
declare const DataCiteService: IDataCiteService;
export default DataCiteService;
