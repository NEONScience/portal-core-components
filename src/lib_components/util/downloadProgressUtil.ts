import moment from 'moment';

import { Nullable } from '../types/core';
import {
  DownloadProgressPhase,
  DownloadProgressState,
  DownloadProgressStatus,
  DownloadProgressTracking,
  DownloadSummary,
} from '../types/downloadProgress';
import { formatBytes } from './manifestUtil';
import { isStringNonEmpty } from './typeUtil';

export const LATEST_RELEASE_LABEL = 'Latest released and provisional data';

const ACTIVE_PHASES: DownloadProgressPhase[] = [
  DownloadProgressPhase.CONNECTING,
  DownloadProgressPhase.STARTED,
  DownloadProgressPhase.PREPARING,
  DownloadProgressPhase.STREAMING,
  DownloadProgressPhase.FINALIZING,
];

const TERMINAL_PHASES: DownloadProgressPhase[] = [
  DownloadProgressPhase.COMPLETED,
  DownloadProgressPhase.FAILED,
  DownloadProgressPhase.CANCELED,
];

const PHASES_BY_STATUS: Record<string, DownloadProgressPhase> = {
  [DownloadProgressStatus.PREPARING]: DownloadProgressPhase.PREPARING,
  [DownloadProgressStatus.STREAMING]: DownloadProgressPhase.STREAMING,
  [DownloadProgressStatus.FINALIZING]: DownloadProgressPhase.FINALIZING,
  [DownloadProgressStatus.COMPLETED]: DownloadProgressPhase.COMPLETED,
  [DownloadProgressStatus.FAILED]: DownloadProgressPhase.FAILED,
  [DownloadProgressStatus.CANCELED]: DownloadProgressPhase.CANCELED,
};

/**
 * Whether the phase is for a download that is in progress, or may still be in progress
 * @param phase The phase to check
 */
export const isActivePhase = (phase: DownloadProgressPhase): boolean => (
  ACTIVE_PHASES.includes(phase)
);

/**
 * Whether the phase is for a download that has finished
 * @param phase The phase to check
 */
export const isTerminalPhase = (phase: DownloadProgressPhase): boolean => (
  TERMINAL_PHASES.includes(phase)
);

/**
 * Gets the phase corresponding to a download API status
 * @param status The download API status
 * @return The phase, null when the status is unknown
 */
export const getPhaseForStatus = (status: Nullable<string>): Nullable<DownloadProgressPhase> => {
  if (!isStringNonEmpty(status)) return null;
  return PHASES_BY_STATUS[status as string] || null;
};

/**
 * Whether the download can be dismissed. A download that is still tracked
 * cannot be dismissed, it can only be minimized.
 * @param state The download state
 */
export const isDismissible = (state: DownloadProgressState): boolean => (
  isTerminalPhase(state.phase)
  || (isActivePhase(state.phase) && (state.tracking === DownloadProgressTracking.UNAVAILABLE))
);

/**
 * Generates a random (version 4) UUID to identify a download
 * @param cryptoImpl The crypto implementation to apply
 * @return The UUID
 */
export const generateDownloadId = (
  cryptoImpl: Nullable<Crypto> = (typeof crypto !== 'undefined') ? crypto : null,
): string => {
  // Only available in secure contexts
  if (cryptoImpl && (typeof cryptoImpl.randomUUID === 'function')) {
    return cryptoImpl.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (cryptoImpl && (typeof cryptoImpl.getRandomValues === 'function')) {
    cryptoImpl.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  // Apply the version and variant bits (RFC 9562)
  /* eslint-disable no-bitwise */
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  /* eslint-enable no-bitwise */
  const hex: string[] = Array.from(bytes, (b: number): string => b.toString(16).padStart(2, '0'));
  return [
    hex.slice(0, 4).join(''),
    hex.slice(4, 6).join(''),
    hex.slice(6, 8).join(''),
    hex.slice(8, 10).join(''),
    hex.slice(10, 16).join(''),
  ].join('-');
};

export interface DownloadPercentInputs {
  phase: DownloadProgressPhase;
  totalBytes: Nullable<number>;
  bytesSent: number;
  bytesSkipped: number;
  totalFiles: Nullable<number>;
  filesCompleted: number;
  filesFailed: number;
}

/**
 * Computes the percent complete of a download. As the byte totals are based on
 * the declared file sizes, the percent is capped at 99 until the download completes.
 * Falls back to the share of files processed when the total bytes are unknown.
 * @param inputs The download progress
 * @return The percent complete, null when indeterminate
 */
export const computePercent = (inputs: DownloadPercentInputs): Nullable<number> => {
  const {
    phase,
    totalBytes,
    bytesSent,
    bytesSkipped,
    totalFiles,
    filesCompleted,
    filesFailed,
  }: DownloadPercentInputs = inputs;
  if (phase === DownloadProgressPhase.COMPLETED) return 100;
  const determinatePhases: DownloadProgressPhase[] = [
    DownloadProgressPhase.STREAMING,
    DownloadProgressPhase.FINALIZING,
    DownloadProgressPhase.FAILED,
    DownloadProgressPhase.CANCELED,
  ];
  if (!determinatePhases.includes(phase)) return null;
  let fraction: Nullable<number> = null;
  if ((typeof totalBytes === 'number') && (totalBytes > 0)) {
    fraction = (bytesSent + bytesSkipped) / totalBytes;
  } else if ((typeof totalFiles === 'number') && (totalFiles > 0)) {
    fraction = (filesCompleted + filesFailed) / totalFiles;
  }
  if (fraction === null) {
    return (phase === DownloadProgressPhase.FINALIZING) ? 99 : null;
  }
  return Math.max(0, Math.min(99, Math.floor(fraction * 100)));
};

export interface ThroughputEstimator {
  // Adds a sample of the bytes processed after the elapsed time
  addSample: (bytes: number, elapsedMs: number) => void;
  // Gets the estimated bytes per second, null when not yet known
  getRate: () => Nullable<number>;
  // Gets the estimated seconds to process the remaining bytes, null when not yet known
  getEtaSeconds: (remainingBytes: number) => Nullable<number>;
  reset: () => void;
}

/**
 * Creates an estimator of the throughput of a download based on an exponentially
 * weighted moving average of the rate between samples. The estimate is only
 * reported once enough samples over enough time have been added.
 * @param alpha The weight of the latest rate
 * @param minElapsedMs The elapsed time required before reporting
 * @param minSamples The samples required before reporting
 */
export const createThroughputEstimator = (
  alpha = 0.3,
  minElapsedMs = 3000,
  minSamples = 2,
): ThroughputEstimator => {
  let lastBytes: number | null = null;
  let lastElapsedMs: number | null = null;
  let rate: number | null = null;
  let samples = 0;
  const reset = (): void => {
    lastBytes = null;
    lastElapsedMs = null;
    rate = null;
    samples = 0;
  };
  const addSample = (bytes: number, elapsedMs: number): void => {
    if (!Number.isFinite(bytes) || !Number.isFinite(elapsedMs) || (bytes < 0) || (elapsedMs < 0)) {
      return;
    }
    if ((lastBytes !== null) && (lastElapsedMs !== null)) {
      // Duplicate sample
      if (elapsedMs === lastElapsedMs) return;
      // Out of order or a different run
      if ((elapsedMs < lastElapsedMs) || (bytes < lastBytes)) {
        reset();
      }
    }
    if ((lastBytes !== null) && (lastElapsedMs !== null)) {
      const instantRate = ((bytes - lastBytes) * 1000) / (elapsedMs - lastElapsedMs);
      rate = (rate === null)
        ? instantRate
        : ((alpha * instantRate) + ((1 - alpha) * rate));
    } else if (elapsedMs > 0) {
      // Seed with the average rate since the start
      rate = (bytes * 1000) / elapsedMs;
    }
    lastBytes = bytes;
    lastElapsedMs = elapsedMs;
    samples += 1;
  };
  const getRate = (): number | null => {
    if ((samples < minSamples) || (lastElapsedMs === null) || (lastElapsedMs < minElapsedMs)) {
      return null;
    }
    return ((rate !== null) && (rate > 0)) ? rate : null;
  };
  const getEtaSeconds = (remainingBytes: number): Nullable<number> => {
    const currentRate = getRate();
    if ((currentRate === null) || !Number.isFinite(remainingBytes)) return null;
    return Math.max(0, remainingBytes) / currentRate;
  };
  return {
    addSample,
    getRate,
    getEtaSeconds,
    reset,
  };
};

const pluralize = (value: number, unit: string): string => (
  `${value} ${unit}${value === 1 ? '' : 's'}`
);

/**
 * Formats an estimated duration for display, e.g. "about 3 minutes"
 * @param seconds The duration in seconds
 * @return The formatted duration, null when unknown
 */
export const formatDuration = (seconds: Nullable<number>): Nullable<string> => {
  if ((typeof seconds !== 'number') || !Number.isFinite(seconds) || (seconds < 0)) {
    return null;
  }
  const roundedSeconds = Math.round(seconds);
  if (roundedSeconds < 10) return 'a few seconds';
  if (roundedSeconds < 60) {
    return `about ${pluralize(Math.min(55, Math.ceil(roundedSeconds / 5) * 5), 'second')}`;
  }
  const minutes = Math.round(roundedSeconds / 60);
  if (minutes < 60) return `about ${pluralize(minutes, 'minute')}`;
  const hours = Math.floor(minutes / 60);
  if (hours >= 24) return 'more than a day';
  const remainingMinutes = minutes % 60;
  return (remainingMinutes === 0)
    ? `about ${pluralize(hours, 'hour')}`
    : `about ${pluralize(hours, 'hour')} ${pluralize(remainingMinutes, 'minute')}`;
};

/**
 * Formats a rate in bytes per second for display, e.g. "12.3 MB/s"
 * @param bytesPerSecond The rate
 * @return The formatted rate, null when unknown
 */
export const formatRate = (bytesPerSecond: Nullable<number>): Nullable<string> => {
  if ((typeof bytesPerSecond !== 'number') || !Number.isFinite(bytesPerSecond)) {
    return null;
  }
  const appliedBytes = Math.round(bytesPerSecond);
  if (appliedBytes <= 0) return '0 B/s';
  return `${formatBytes(appliedBytes)}/s`;
};

/**
 * Formats a year month (YYYY-MM) for display, e.g. "Jan 2020"
 * @param yearMonth The year month
 */
export const formatYearMonth = (yearMonth: string): string => {
  const parsed = moment(`${yearMonth}-01`, 'YYYY-MM-DD', true);
  return parsed.isValid() ? parsed.format('MMM YYYY') : yearMonth;
};

interface SelectionStateSource<T> {
  value?: T;
}

/**
 * The subset of the download data context state the summary is built from
 */
export interface DownloadSummarySource {
  productData?: Record<string, unknown>;
  release?: SelectionStateSource<Nullable<string>>;
  latestRelease?: Nullable<string>;
  sites?: SelectionStateSource<string[]>;
  dateRange?: SelectionStateSource<string[]>;
  documentation?: SelectionStateSource<Nullable<string>>;
  packageType?: SelectionStateSource<Nullable<string>>;
  provisionalData?: SelectionStateSource<Nullable<string>>;
  requiredSteps?: { key: string }[];
  fromAOPManifest?: boolean;
  s3Files?: { value?: unknown[]; totalSize?: number };
  manifest?: { sizeEstimate?: Nullable<number> };
}

/**
 * Builds a summary of what is being downloaded from the download data context state
 * @param source The download data context state
 * @return The summary
 */
export const buildDownloadSummary = (source: DownloadSummarySource): DownloadSummary => {
  const productData: Record<string, unknown> = source.productData || {};
  const stepKeys: string[] = (source.requiredSteps || []).map((step) => step.key);
  const hasStep = (key: string): boolean => stepKeys.includes(key);
  const isAop = source.fromAOPManifest === true;
  const release: Nullable<string> = isStringNonEmpty(source.release?.value)
    ? source.release?.value as string
    : null;
  const productCode = isStringNonEmpty(productData.productCode)
    ? productData.productCode as string
    : '';
  const productName = isStringNonEmpty(productData.productName)
    ? productData.productName as string
    : productCode;
  let sites: string[] = [];
  let dateRange: Nullable<string[]> = null;
  let dateRangeLabel: Nullable<string> = null;
  if (hasStep('sitesAndDateRange')) {
    sites = Array.isArray(source.sites?.value) ? [...(source.sites?.value as string[])] : [];
    const dateRangeValue: Nullable<string[]> = source.dateRange?.value;
    if (Array.isArray(dateRangeValue) && (dateRangeValue.length === 2)) {
      dateRange = [...dateRangeValue];
      dateRangeLabel = `${formatYearMonth(dateRange[0])} - ${formatYearMonth(dateRange[1])}`;
    }
  }
  let packageType: Nullable<string> = null;
  if (hasStep('packageType')) {
    packageType = isStringNonEmpty(source.packageType?.value)
      ? source.packageType?.value as string
      : 'basic';
  }
  const includeDocumentation: Nullable<boolean> = hasStep('documentation')
    ? (source.documentation?.value === 'include')
    : null;
  const includeProvisionalData: Nullable<boolean> = hasStep('provisionalData')
    ? (source.provisionalData?.value === 'include')
    : null;
  const fileCount: Nullable<number> = (isAop && Array.isArray(source.s3Files?.value))
    ? (source.s3Files?.value as unknown[]).length
    : null;
  const estimatedBytes: number = isAop
    ? (source.s3Files?.totalSize || 0)
    : (source.manifest?.sizeEstimate || 0);
  return {
    productCode,
    productName,
    release,
    releaseLabel: release || LATEST_RELEASE_LABEL,
    sites,
    dateRange,
    dateRangeLabel,
    packageType,
    includeDocumentation,
    includeProvisionalData,
    fileCount,
    estimatedBytes,
    isEstimateUncompressed: isAop,
  };
};
