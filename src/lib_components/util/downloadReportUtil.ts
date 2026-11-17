import { Nullable } from '../types/core';
import {
  DownloadProgressFailedFile,
  DownloadProgressFailureReason,
  DownloadProgressState,
} from '../types/downloadProgress';
import {
  getPublicApiRoot,
  sanitizeFailedFile,
  sanitizeFileName,
} from './downloadSanitizeUtil';
import { isStringNonEmpty } from './typeUtil';

export const FAILED_FILES_REPORT_VERSION = 1;
export const FAILED_FILES_REPORT_TITLE = 'Files not included in a NEON data download';
export const NEON_CONTACT_URL = 'https://www.neonscience.org/about/contact-us';

// Time to keep a saved file's object URL, the browser starts saving the file on click
const OBJECT_URL_REVOKE_DELAY_MS = 30_000;

/**
 * Descriptions of the reasons a file could not be included in a download.
 * Reasons are categories, they never carry details of the failure.
 */
export const FAILURE_REASON_DESCRIPTIONS: Record<DownloadProgressFailureReason, string> = {
  [DownloadProgressFailureReason.SIGNING_FAILED]:
    'A download link couldn\'t be created for the file.',
  [DownloadProgressFailureReason.NOT_FOUND]: 'The file wasn\'t found in storage.',
  [DownloadProgressFailureReason.READ_FAILED]: 'The file couldn\'t be read from storage.',
  [DownloadProgressFailureReason.INVALID_LOCATION]:
    'The storage location of the file isn\'t valid.',
  [DownloadProgressFailureReason.UNKNOWN]: 'The file couldn\'t be included.',
};

/**
 * A file that could not be included, as described in the report. Unknown values are omitted.
 */
export interface FailedFilesReportFile {
  fileName?: string;
  type?: string;
  description?: string;
  productCode?: string;
  siteCode?: string;
  month?: string;
  release?: string;
  packageType?: string;
  sizeBytes?: number;
  checksum?: string;
  checksumAlgorithm?: string;
  url?: string;
  reason?: string;
  reasonDescription?: string;
}

/**
 * Report of the files that could not be included in a download, with the request
 * the download was made for, so the files can be retrieved again
 */
export interface FailedFilesReport {
  title: string;
  reportVersion: number;
  generatedAt: string;
  download: {
    fileName: Nullable<string>;
    status: string;
    startedAt: Nullable<string>;
    finishedAt: Nullable<string>;
    elapsedMs: number;
  };
  requestManifest: {
    productCode: Nullable<string>;
    productName: Nullable<string>;
    release: Nullable<string>;
    sites: string[];
    startMonth: Nullable<string>;
    endMonth: Nullable<string>;
    packageType: Nullable<string>;
    includeDocumentation: Nullable<boolean>;
    includeProvisionalData: Nullable<boolean>;
  };
  summary: {
    totalFiles: Nullable<number>;
    filesIncluded: number;
    filesNotIncluded: number;
    filesListed: number;
    listComplete: boolean;
    uncompressedBytesIncluded: number;
    uncompressedBytesNotIncluded: number;
  };
  filesNotIncluded: FailedFilesReportFile[];
  nextSteps: string[];
}

const toIsoString = (epochMillis: Nullable<number>): Nullable<string> => (
  ((typeof epochMillis === 'number') && Number.isFinite(epochMillis))
    ? new Date(epochMillis).toISOString()
    : null
);

const isFailedFile = (
  failedFile: Nullable<DownloadProgressFailedFile>,
): failedFile is DownloadProgressFailedFile => failedFile !== null;

/**
 * Describes a failed file for the report, omitting unknown values
 * @param failedFile The sanitized failed file
 * @return The report file
 */
const toReportFile = (failedFile: DownloadProgressFailedFile): FailedFilesReportFile => {
  const reportFile: FailedFilesReportFile = {};
  const values: [keyof FailedFilesReportFile, unknown][] = [
    ['fileName', failedFile.fileName],
    ['type', failedFile.type],
    ['description', failedFile.description],
    ['productCode', failedFile.productCode],
    ['siteCode', failedFile.siteCode],
    ['month', failedFile.month],
    ['release', failedFile.release],
    ['packageType', failedFile.packageType],
    ['sizeBytes', failedFile.sizeBytes],
    ['checksum', failedFile.checksum],
    ['checksumAlgorithm', failedFile.checksumAlgorithm],
    ['url', failedFile.url],
    ['reason', failedFile.reason],
    ['reasonDescription', FAILURE_REASON_DESCRIPTIONS[failedFile.reason]],
  ];
  values.forEach(([key, value]: [keyof FailedFilesReportFile, unknown]): void => {
    if ((value !== null) && (typeof value !== 'undefined')) {
      (reportFile as Record<string, unknown>)[key] = value;
    }
  });
  return reportFile;
};

/**
 * Builds the report of the files that could not be included in a download.
 * The files are described in detail when reported by the download API,
 * otherwise only their names are known. Reported values are only included when
 * they match their expected public form.
 * @param state The download state
 * @param generatedAt The epoch millisecond time the report is generated
 * @param publicApiRoot The root of the public API the portal uses, which file URLs must be within
 * @return The report
 */
export const buildFailedFilesReport = (
  state: DownloadProgressState,
  generatedAt: number,
  publicApiRoot: string = getPublicApiRoot(),
): FailedFilesReport => {
  const { summary } = state;
  let filesNotIncluded: FailedFilesReportFile[];
  if (state.failedFileDetails.length > 0) {
    filesNotIncluded = state.failedFileDetails
      .map((failedFile: DownloadProgressFailedFile): Nullable<DownloadProgressFailedFile> => (
        sanitizeFailedFile(failedFile, publicApiRoot)
      ))
      .filter(isFailedFile)
      .map(toReportFile);
  } else {
    const fileNames = state.failedFiles
      .map((fileName: string): Nullable<string> => sanitizeFileName(fileName))
      .filter((fileName: Nullable<string>): fileName is string => fileName !== null);
    filesNotIncluded = Array.from(new Set(fileNames)).map((fileName: string) => ({ fileName }));
  }
  const listComplete = filesNotIncluded.length >= state.filesFailed;
  const hasUrls = filesNotIncluded.some((file: FailedFilesReportFile): boolean => (
    isStringNonEmpty(file.url)
  ));
  const nextSteps: string[] = [];
  if (hasUrls) {
    nextSteps.push(
      'Download each file individually from its url, '
        + 'the location of the file in the NEON Data API.',
    );
  }
  nextSteps.push(
    'Try downloading the data again later, as files are often only temporarily unavailable.',
  );
  if (!listComplete) {
    nextSteps.push(
      `This list includes ${filesNotIncluded.length} of the ${state.filesFailed} files `
        + 'that couldn\'t be included. Download the data again to retrieve the remaining files.',
    );
  }
  nextSteps.push(
    `If files remain unavailable, contact NEON at ${NEON_CONTACT_URL} and include this report.`,
  );
  const dateRange: Nullable<string[]> = summary ? summary.dateRange : null;
  const hasDateRange = Array.isArray(dateRange) && (dateRange.length === 2);
  return {
    title: FAILED_FILES_REPORT_TITLE,
    reportVersion: FAILED_FILES_REPORT_VERSION,
    generatedAt: toIsoString(generatedAt) as string,
    download: {
      fileName: sanitizeFileName(state.zipFileName),
      status: state.phase,
      startedAt: toIsoString(state.startedAt),
      finishedAt: toIsoString(state.finishedAt),
      elapsedMs: state.elapsedMs,
    },
    requestManifest: {
      productCode: summary ? summary.productCode : null,
      productName: summary ? summary.productName : null,
      release: summary ? summary.release : null,
      sites: summary ? [...summary.sites] : [],
      startMonth: hasDateRange ? (dateRange as string[])[0] : null,
      endMonth: hasDateRange ? (dateRange as string[])[1] : null,
      packageType: summary ? summary.packageType : null,
      includeDocumentation: summary ? summary.includeDocumentation : null,
      includeProvisionalData: summary ? summary.includeProvisionalData : null,
    },
    summary: {
      totalFiles: state.totalFiles,
      filesIncluded: state.filesCompleted,
      filesNotIncluded: state.filesFailed,
      filesListed: filesNotIncluded.length,
      listComplete,
      uncompressedBytesIncluded: state.bytesSent,
      uncompressedBytesNotIncluded: state.bytesSkipped,
    },
    filesNotIncluded,
    nextSteps,
  };
};

/**
 * Gets the name of the report file, based on the name of the download package
 * @param state The download state
 * @return The file name
 */
export const getFailedFilesReportFileName = (state: DownloadProgressState): string => {
  const zipFileName: Nullable<string> = sanitizeFileName(state.zipFileName);
  const productCode: Nullable<string> = state.summary ? state.summary.productCode : null;
  let baseName: string;
  if (isStringNonEmpty(zipFileName)) {
    baseName = (zipFileName as string).replace(/\.zip$/i, '');
  } else {
    baseName = isStringNonEmpty(productCode) ? `NEON_${productCode}` : 'NEON_data';
  }
  return `${baseName.replace(/[^A-Za-z0-9._-]/g, '_')}_files_not_included.json`;
};

/**
 * Saves data as a JSON file through the browser
 * @param fileName The name to save the file as
 * @param data The data to save
 * @return Whether saving the file was started
 */
export const saveJsonFile = (fileName: string, data: unknown): boolean => {
  const canSave = (typeof document !== 'undefined')
    && (typeof URL !== 'undefined')
    && (typeof URL.createObjectURL === 'function');
  if (!canSave) return false;
  const objectUrl = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
  );
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(objectUrl), OBJECT_URL_REVOKE_DELAY_MS);
  return true;
};

/**
 * Saves the report of the files that could not be included in a download as a JSON file
 * @param state The download state
 * @return Whether saving the file was started
 */
export const saveFailedFilesReport = (state: DownloadProgressState): boolean => (
  saveJsonFile(getFailedFilesReportFileName(state), buildFailedFilesReport(state, Date.now()))
);
