export namespace PACKAGE_TYPE {
    let BASIC: string;
    let EXPANDED: string;
}
/**
 * The default spatial index value
 */
export const SPATIAL_INDEX_DEFAULT: "000";
export function getLikeMatchers(matchers: any, activeMatcher: any): any;
export function getDataApiRequest(productCode: any, release: any, site: any, month: any): string;
export function getApiDataQueryParams(action: any): {
    productCode: any;
    release: any;
    site: null;
    month: null;
};
export function getSiteOptions(product: any, siteLookup: any): any;
export function getMonthOptions(product: any, siteCodes: any): any[];
export function extractDataFileNameInfo(fileName: any): {
    horizontalSI: null;
    verticalSI: null;
    temporalIndex: null;
    tableName: null;
    packageType: null;
    fileExtension: null;
} | null;
export function containsPosition(positions: any, horizontal: any, vertical: any): boolean;
export function tryFindActiveFiles(files: any, query: any, fileResolutionMatchers: any): {
    dataFileUrls: never[];
    dataFileMatcher: null;
    positions: never[];
} | null;
export function getActiveDataFilesInfo(files: any, query: any, fileResolutionMatchers: any): {
    dataFileUrls: never[];
    dataFileMatcher: null;
    positions: never[];
};
export function parseDataFiles(data: any, query: any, fileResolutionMatchers: any): {
    dataFileUrls: never[];
    dataFileMatcher: null;
    variablesFileUrl: null;
    positions: never[];
    positionOptions: never[];
};
export function convertDateToUTC(dateString: any): number | null;
