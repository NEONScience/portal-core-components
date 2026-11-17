import NeonEnvironment from '../components/NeonEnvironment/NeonEnvironment';
import { Nullable } from '../types/core';
import {
  DownloadProgressFailedFile,
  DownloadProgressFailureReason,
} from '../types/downloadProgress';
import { isStringNonEmpty } from './typeUtil';

/*
 * Values reported by the download API about a download are only kept when they match the public
 * formats expected for them, so nothing else is ever presented or saved: no paths, storage or
 * presigned locations, credentials, query strings, or free form messages.
 */
const FILE_NAME_PATTERN = /^[^\\/?#:*"<>|]{1,255}$/;
const IDENTIFIER_PATTERN = /^[A-Za-z0-9._-]{1,64}$/;
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
const CHECKSUM_PATTERN = /^[A-Za-z0-9+/=]{1,128}$/;
const MAX_DESCRIPTION_LENGTH = 500;
const FILE_TYPES: string[] = ['DATA', 'DOCUMENT'];
const FAILURE_REASONS: string[] = Object.values(DownloadProgressFailureReason);

const hasControlCharacters = (value: string): boolean => (
  Array.from(value).some((character: string): boolean => {
    const code = character.charCodeAt(0);
    return (code < 32) || (code === 127);
  })
);

const matchPattern = (value: unknown, pattern: RegExp): Nullable<string> => {
  if (!isStringNonEmpty(value)) return null;
  const trimmed = (value as string).trim();
  return (pattern.test(trimmed) && !hasControlCharacters(trimmed)) ? trimmed : null;
};

/**
 * Gets the root of the public API the portal uses, for example https://data.neonscience.org/api/v0
 * @return The public API root
 */
export const getPublicApiRoot = (): string => (
  `${NeonEnvironment.getApiHost()}${NeonEnvironment.getRootApiPath()}`
);

/**
 * Keeps a file name, a base name without any path, location, or query
 * @param value The value
 * @return The file name, null when not a valid file name
 */
export const sanitizeFileName = (value: unknown): Nullable<string> => (
  matchPattern(value, FILE_NAME_PATTERN)
);

/**
 * Keeps an identifier, such as a product code, site code, release tag, or package type
 * @param value The value
 * @return The identifier, null when not a valid identifier
 */
export const sanitizeIdentifier = (value: unknown): Nullable<string> => (
  matchPattern(value, IDENTIFIER_PATTERN)
);

/**
 * Keeps a year and month in the YYYY-MM form
 * @param value The value
 * @return The year and month, null when not valid
 */
export const sanitizeMonth = (value: unknown): Nullable<string> => (
  matchPattern(value, MONTH_PATTERN)
);

/**
 * Keeps a hex or base64 encoded checksum
 * @param value The value
 * @return The checksum, null when not valid
 */
export const sanitizeChecksum = (value: unknown): Nullable<string> => (
  matchPattern(value, CHECKSUM_PATTERN)
);

/**
 * Keeps a short, plain text description without any locations
 * @param value The value
 * @return The description with its whitespace collapsed, null when not valid
 */
export const sanitizeDescription = (value: unknown): Nullable<string> => {
  if (!isStringNonEmpty(value)) return null;
  const description = (value as string).replace(/\s+/g, ' ').trim();
  const isPlainText = (description.length > 0)
    && (description.length <= MAX_DESCRIPTION_LENGTH)
    && !hasControlCharacters(description)
    && !description.includes('://');
  return isPlainText ? description : null;
};

/**
 * Keeps a count of bytes
 * @param value The value
 * @return The count, null when not a non-negative integer
 */
export const sanitizeByteCount = (value: unknown): Nullable<number> => (
  ((typeof value === 'number') && Number.isSafeInteger(value) && (value >= 0)) ? value : null
);

/**
 * Keeps a known reason a file could not be included, any other value is reported as unknown
 * @param value The value
 * @return The reason
 */
export const sanitizeFailureReason = (value: unknown): DownloadProgressFailureReason => (
  ((typeof value === 'string') && FAILURE_REASONS.includes(value))
    ? value as DownloadProgressFailureReason
    : DownloadProgressFailureReason.UNKNOWN
);

/**
 * Keeps a URL of the public API the portal uses: the same origin and API root path,
 * without credentials, a query, or a fragment
 * @param value The value
 * @param publicApiRoot The root of the public API, see getPublicApiRoot
 * @return The URL, null when not a public API URL
 */
export const sanitizePublicApiUrl = (value: unknown, publicApiRoot: string): Nullable<string> => {
  if (!isStringNonEmpty(value)) return null;
  let url: URL;
  let rootUrl: URL;
  try {
    url = new URL((value as string).trim());
    rootUrl = new URL(publicApiRoot);
  } catch (e) {
    return null;
  }
  const rootPath = rootUrl.pathname.endsWith('/') ? rootUrl.pathname : `${rootUrl.pathname}/`;
  const isPublicApiUrl = ['https:', 'http:'].includes(url.protocol)
    && (url.origin === rootUrl.origin)
    && (url.username === '')
    && (url.password === '')
    && (url.search === '')
    && (url.hash === '')
    && url.pathname.startsWith(rootPath);
  return isPublicApiUrl ? url.href : null;
};

/**
 * Keeps the details of a file that could not be included in a download,
 * keeping each value only when it matches its expected public form
 * @param value The reported details
 * @param publicApiRoot The root of the public API, see getPublicApiRoot
 * @return The failed file, null when the details are not an object
 */
export const sanitizeFailedFile = (
  value: unknown,
  publicApiRoot: string,
): Nullable<DownloadProgressFailedFile> => {
  if ((typeof value !== 'object') || (value === null) || Array.isArray(value)) return null;
  const details = value as Record<string, unknown>;
  return {
    fileName: sanitizeFileName(details.fileName),
    type: FILE_TYPES.includes(details.type as string) ? details.type as string : null,
    description: sanitizeDescription(details.description),
    productCode: sanitizeIdentifier(details.productCode),
    siteCode: sanitizeIdentifier(details.siteCode),
    month: sanitizeMonth(details.month),
    release: sanitizeIdentifier(details.release),
    packageType: sanitizeIdentifier(details.packageType),
    sizeBytes: sanitizeByteCount(details.sizeBytes),
    checksum: sanitizeChecksum(details.checksum),
    checksumAlgorithm: sanitizeIdentifier(details.checksumAlgorithm),
    url: sanitizePublicApiUrl(details.url, publicApiRoot),
    reason: sanitizeFailureReason(details.reason),
  };
};
