import { Nullable } from './core';
export interface ManifestRequest {
    dpCode: string;
    siteCodes: string[];
    startDateMonth: Nullable<string>;
    endDateMonth: Nullable<string>;
    release: Nullable<string>;
    includeDocs: boolean;
    pkgType: Nullable<string>;
    presign: boolean;
    manifestFiles?: ManifestFile[];
}
export declare enum ChecksumAlgorithmType {
    MD5 = "MD5",
    CRC32 = "CRC32"
}
export interface ManifestFile {
    release: string;
    productCode: string;
    siteCode: string;
    month: string;
    fileName: string;
    fileSizeBytes: number;
    checksum: string;
    checksumAlgorithm: string;
    uri: string;
    packageType?: string;
}
export interface ManifestRollup {
    zipFileName: string;
    mimeType: string;
    totalBytes: number;
    manifestResult: ManifestResult;
}
export interface ManifestResult {
    successful: boolean;
    message: string;
    fileErrors: string[];
}
export interface ManifestConfig {
    productCode: string;
    sites: string[];
    dateRange: string[];
    documentation: boolean;
    packageType: string;
    isError: boolean;
    errorMessage?: string;
}
export interface ManifestSelection {
    productData: Record<string, unknown>;
    sites: SiteSelectionState;
    dateRange: DateRangeSelectionState;
    documentation: DocumentationSelectionState;
    packageType: PackageTypeSelectionState;
}
export interface ISelectionState {
    isValid: boolean;
}
export interface SiteSelectionState extends ISelectionState {
    value: string[];
}
export interface DateRangeSelectionState extends ISelectionState {
    value: string[];
}
export interface DocumentationSelectionState extends ISelectionState {
    value: string;
}
export interface PackageTypeSelectionState extends ISelectionState {
    value: string;
}
