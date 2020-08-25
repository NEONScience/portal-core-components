export function buildManifestRequestUrl(config: any, useBody?: boolean): string;
export function buildManifestRequestBody(config: any): {
    dpCode: any;
    siteCodes: any;
    startDateMonth: any;
    endDateMonth: any;
    pkgType: any;
    includeDocs: any;
};
export function buildS3FilesRequestUrl(productCode: any, site: any, yearMonth: any): string;
export function downloadManifest(manifest?: {}): void;
export function downloadAopManifest(productData: any, s3Files: any, documentation?: string): void;
export const MAX_POST_BODY_SIZE: 2097152;
export const DOWNLOAD_SIZE_WARN: 42949672960;
export function formatBytes(bytes: any): string;
export function getSizeEstimateFromManifestResponse(response: any): any;
export default buildManifestRequestUrl;
