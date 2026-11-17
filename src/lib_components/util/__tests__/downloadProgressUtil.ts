import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import {
  DownloadProgressPhase,
  DownloadProgressTracking,
} from '../../types/downloadProgress';
import {
  LATEST_RELEASE_LABEL,
  buildDownloadSummary,
  computePercent,
  createThroughputEstimator,
  formatDuration,
  formatRate,
  formatYearMonth,
  generateDownloadId,
  getPhaseForStatus,
  isActivePhase,
  isDismissible,
  isTerminalPhase,
} from '../downloadProgressUtil';
import { createInitialDownloadProgressState } from '../../service/DownloadProgressService';

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const PHASES_BY_STATUS: [string | null, DownloadProgressPhase | null][] = [
  ['PREPARING', DownloadProgressPhase.PREPARING],
  ['STREAMING', DownloadProgressPhase.STREAMING],
  ['FINALIZING', DownloadProgressPhase.FINALIZING],
  ['COMPLETED', DownloadProgressPhase.COMPLETED],
  ['FAILED', DownloadProgressPhase.FAILED],
  ['CANCELED', DownloadProgressPhase.CANCELED],
  ['READY', null],
  ['unknown', null],
  [null, null],
];

const DURATIONS: [number | null, string | null][] = [
  [null, null],
  [-1, null],
  [Number.NaN, null],
  [3, 'a few seconds'],
  [32, 'about 35 seconds'],
  [58, 'about 55 seconds'],
  [61, 'about 1 minute'],
  [190, 'about 3 minutes'],
  [3600, 'about 1 hour'],
  [4800, 'about 1 hour 20 minutes'],
  [7260, 'about 2 hours 1 minute'],
  [100000, 'more than a day'],
];

describe('Utils - downloadProgressUtil', () => {
  describe('generateDownloadId()', () => {
    test('applies randomUUID when available', () => {
      const randomUUID = jest.fn(() => '11111111-1111-4111-8111-111111111111');
      const cryptoImpl = { randomUUID } as unknown as Crypto;
      expect(generateDownloadId(cryptoImpl)).toBe('11111111-1111-4111-8111-111111111111');
      expect(randomUUID).toHaveBeenCalledTimes(1);
    });
    test('falls back to getRandomValues', () => {
      const getRandomValues = jest.fn((array: Uint8Array) => {
        array.fill(255);
        return array;
      });
      const cryptoImpl = { getRandomValues } as unknown as Crypto;
      const id = generateDownloadId(cryptoImpl);
      expect(id).toMatch(UUID_V4_REGEX);
      expect(id).toBe('ffffffff-ffff-4fff-bfff-ffffffffffff');
    });
    test('falls back to Math.random without crypto', () => {
      expect(generateDownloadId(null)).toMatch(UUID_V4_REGEX);
    });
  });

  describe('phases', () => {
    test('active and terminal phases', () => {
      expect(isActivePhase(DownloadProgressPhase.IDLE)).toBe(false);
      expect(isActivePhase(DownloadProgressPhase.CONNECTING)).toBe(true);
      expect(isActivePhase(DownloadProgressPhase.STREAMING)).toBe(true);
      expect(isActivePhase(DownloadProgressPhase.COMPLETED)).toBe(false);
      expect(isTerminalPhase(DownloadProgressPhase.COMPLETED)).toBe(true);
      expect(isTerminalPhase(DownloadProgressPhase.FAILED)).toBe(true);
      expect(isTerminalPhase(DownloadProgressPhase.CANCELED)).toBe(true);
      expect(isTerminalPhase(DownloadProgressPhase.FINALIZING)).toBe(false);
    });
    test.each(PHASES_BY_STATUS)('getPhaseForStatus(%p)', (status, expected) => {
      expect(getPhaseForStatus(status)).toBe(expected);
    });
    test('isDismissible()', () => {
      const state = createInitialDownloadProgressState();
      expect(isDismissible({ ...state, phase: DownloadProgressPhase.COMPLETED })).toBe(true);
      expect(isDismissible({
        ...state,
        phase: DownloadProgressPhase.STREAMING,
        tracking: DownloadProgressTracking.LIVE,
      })).toBe(false);
      expect(isDismissible({
        ...state,
        phase: DownloadProgressPhase.STARTED,
        tracking: DownloadProgressTracking.UNAVAILABLE,
      })).toBe(true);
    });
  });

  describe('computePercent()', () => {
    const base = {
      phase: DownloadProgressPhase.STREAMING,
      totalBytes: 1000,
      bytesSent: 0,
      bytesSkipped: 0,
      totalFiles: 10,
      filesCompleted: 0,
      filesFailed: 0,
    };
    test('is indeterminate before streaming', () => {
      expect(computePercent({ ...base, phase: DownloadProgressPhase.PREPARING })).toBeNull();
      expect(computePercent({ ...base, phase: DownloadProgressPhase.STARTED })).toBeNull();
    });
    test('is based on the bytes processed, including skipped bytes', () => {
      expect(computePercent({ ...base, bytesSent: 255 })).toBe(25);
      expect(computePercent({ ...base, bytesSent: 400, bytesSkipped: 100 })).toBe(50);
    });
    test('is capped at 99 until completed', () => {
      expect(computePercent({ ...base, bytesSent: 1200 })).toBe(99);
      expect(computePercent({ ...base, phase: DownloadProgressPhase.COMPLETED })).toBe(100);
    });
    test('falls back to the share of files processed', () => {
      expect(computePercent({
        ...base,
        totalBytes: 0,
        filesCompleted: 2,
        filesFailed: 1,
      })).toBe(30);
      expect(computePercent({ ...base, totalBytes: null, totalFiles: null })).toBeNull();
      expect(computePercent({
        ...base,
        phase: DownloadProgressPhase.FINALIZING,
        totalBytes: null,
        totalFiles: null,
      })).toBe(99);
    });
  });

  describe('createThroughputEstimator()', () => {
    test('reports a rate once there are enough samples over enough time', () => {
      const estimator = createThroughputEstimator(0.5, 3000, 2);
      estimator.addSample(0, 0);
      expect(estimator.getRate()).toBeNull();
      estimator.addSample(1000, 1000);
      // Not enough time has elapsed
      expect(estimator.getRate()).toBeNull();
      estimator.addSample(3000, 3000);
      expect(estimator.getRate()).toBe(1000);
      // Weighted toward the latest rate between samples
      estimator.addSample(7000, 4000);
      expect(estimator.getRate()).toBe(2500);
      expect(estimator.getEtaSeconds(5000)).toBe(2);
      expect(estimator.getEtaSeconds(-10)).toBe(0);
    });
    test('ignores duplicate samples and resets for a new run', () => {
      const estimator = createThroughputEstimator(0.5, 0, 2);
      estimator.addSample(1000, 1000);
      estimator.addSample(1000, 1000);
      expect(estimator.getRate()).toBeNull();
      estimator.addSample(3000, 2000);
      expect(estimator.getRate()).toBe(1500);
      estimator.addSample(10, 10);
      expect(estimator.getRate()).toBeNull();
      estimator.reset();
      expect(estimator.getEtaSeconds(100)).toBeNull();
    });
  });

  describe.each(DURATIONS)('formatDuration()', (seconds, expected) => {
    test(`${seconds} formats as ${expected}`, () => {
      expect(formatDuration(seconds)).toBe(expected);
    });
  });

  test('formatRate()', () => {
    expect(formatRate(null)).toBeNull();
    expect(formatRate(0)).toBe('0 B/s');
    expect(formatRate(1500000)).toBe('1.43 MiB/s');
  });

  test('formatYearMonth()', () => {
    expect(formatYearMonth('2020-01')).toBe('Jan 2020');
    expect(formatYearMonth('invalid')).toBe('invalid');
  });

  describe('buildDownloadSummary()', () => {
    test('summarizes a manifest download', () => {
      expect(buildDownloadSummary({
        productData: { productCode: 'DP1.00001.001', productName: 'Wind speed' },
        release: { value: 'RELEASE-2025' },
        sites: { value: ['ABBY', 'BART'] },
        dateRange: { value: ['2020-01', '2020-06'] },
        documentation: { value: 'include' },
        packageType: { value: 'expanded' },
        provisionalData: { value: 'exclude' },
        requiredSteps: [
          { key: 'sitesAndDateRange' },
          { key: 'documentation' },
          { key: 'packageType' },
          { key: 'policies' },
          { key: 'summary' },
        ],
        fromAOPManifest: false,
        manifest: { sizeEstimate: 12345 },
      })).toEqual({
        productCode: 'DP1.00001.001',
        productName: 'Wind speed',
        release: 'RELEASE-2025',
        releaseLabel: 'RELEASE-2025',
        sites: ['ABBY', 'BART'],
        dateRange: ['2020-01', '2020-06'],
        dateRangeLabel: 'Jan 2020 - Jun 2020',
        packageType: 'expanded',
        includeDocumentation: true,
        includeProvisionalData: null,
        fileCount: null,
        estimatedBytes: 12345,
        isEstimateUncompressed: false,
      });
    });
    test('summarizes an AOP download with the latest release', () => {
      const summary = buildDownloadSummary({
        productData: { productCode: 'DP3.30010.001' },
        release: { value: null },
        sites: { value: ['ABBY'] },
        dateRange: { value: ['2021-07', '2021-07'] },
        documentation: { value: 'exclude' },
        provisionalData: { value: 'include' },
        requiredSteps: [
          { key: 'sitesAndDateRange' },
          { key: 'provisionalData' },
          { key: 's3Files' },
          { key: 'documentation' },
        ],
        fromAOPManifest: true,
        s3Files: { value: ['a', 'b', 'c'], totalSize: 999 },
      });
      expect(summary.productName).toBe('DP3.30010.001');
      expect(summary.release).toBeNull();
      expect(summary.releaseLabel).toBe(LATEST_RELEASE_LABEL);
      expect(summary.packageType).toBeNull();
      expect(summary.includeDocumentation).toBe(false);
      expect(summary.includeProvisionalData).toBe(true);
      expect(summary.fileCount).toBe(3);
      expect(summary.estimatedBytes).toBe(999);
      expect(summary.isEstimateUncompressed).toBe(true);
    });
  });
});
