import {
  afterEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { createInitialDownloadProgressState } from '../../service/DownloadProgressService';
import {
  DownloadProgressFailedFile,
  DownloadProgressFailureReason,
  DownloadProgressPhase,
  DownloadProgressState,
  DownloadProgressTracking,
  DownloadSummary,
} from '../../types/downloadProgress';
import {
  FAILED_FILES_REPORT_TITLE,
  FAILED_FILES_REPORT_VERSION,
  FAILURE_REASON_DESCRIPTIONS,
  NEON_CONTACT_URL,
  buildFailedFilesReport,
  getFailedFilesReportFileName,
  saveFailedFilesReport,
  saveJsonFile,
} from '../downloadReportUtil';

const PUBLIC_API_ROOT = 'https://data.neonscience.org/api/v0';
const GENERATED_AT = Date.UTC(2026, 10, 14, 20, 0, 0);
const STARTED_AT = Date.UTC(2026, 10, 14, 19, 50, 0);
const FINISHED_AT = Date.UTC(2026, 10, 14, 19, 55, 0);

const SUMMARY: DownloadSummary = {
  productCode: 'DP1.00001.001',
  productName: '2D wind speed and direction',
  release: 'RELEASE-2026',
  releaseLabel: 'RELEASE-2026',
  sites: ['HARV', 'BART'],
  dateRange: ['2020-01', '2020-12'],
  dateRangeLabel: 'Jan 2020 - Dec 2020',
  packageType: 'basic',
  includeDocumentation: true,
  includeProvisionalData: false,
  fileCount: null,
  estimatedBytes: 1000,
  isEstimateUncompressed: false,
};

const emptyFailedFile = (): DownloadProgressFailedFile => ({
  fileName: null,
  type: null,
  description: null,
  productCode: null,
  siteCode: null,
  month: null,
  release: null,
  packageType: null,
  sizeBytes: null,
  checksum: null,
  checksumAlgorithm: null,
  url: null,
  reason: DownloadProgressFailureReason.UNKNOWN,
});

const DATA_FILE: DownloadProgressFailedFile = {
  ...emptyFailedFile(),
  fileName: 'NEON.D01.HARV.DP1.00001.001.2020-01.basic.csv',
  type: 'DATA',
  productCode: 'DP1.00001.001',
  siteCode: 'HARV',
  month: '2020-01',
  release: 'RELEASE-2026',
  packageType: 'basic',
  sizeBytes: 2000,
  checksum: 'yZRlqg==',
  checksumAlgorithm: 'CRC32C',
  url: `${PUBLIC_API_ROOT}/releases/RELEASE-2026/data/DP1.00001.001/HARV/2020-01/`
    + 'NEON.D01.HARV.DP1.00001.001.2020-01.basic.csv',
  reason: DownloadProgressFailureReason.SIGNING_FAILED,
};

const DOCUMENT_FILE: DownloadProgressFailedFile = {
  ...emptyFailedFile(),
  fileName: 'NEON.DOC.000001.pdf',
  type: 'DOCUMENT',
  description: 'Algorithm theoretical basis document',
  sizeBytes: 300,
  url: `${PUBLIC_API_ROOT}/documents/NEON.DOC.000001`,
  reason: DownloadProgressFailureReason.NOT_FOUND,
};

const completedState = (overrides: Partial<DownloadProgressState> = {}): DownloadProgressState => ({
  ...createInitialDownloadProgressState(),
  downloadId: '0d9f0e4a-5b6c-4d7e-8f90-a1b2c3d4e5f6',
  phase: DownloadProgressPhase.COMPLETED,
  tracking: DownloadProgressTracking.CLOSED,
  summary: SUMMARY,
  zipFileName: 'NEON_wind-2d.zip',
  totalFiles: 10,
  filesCompleted: 8,
  filesFailed: 2,
  bytesSent: 8000,
  bytesSkipped: 2300,
  elapsedMs: 300000,
  failedFiles: [DATA_FILE.fileName as string, DOCUMENT_FILE.fileName as string],
  failedFileDetails: [DATA_FILE, DOCUMENT_FILE],
  startedAt: STARTED_AT,
  finishedAt: FINISHED_AT,
  ...overrides,
});

const readBlob = (blob: Blob): Promise<string> => blob.text();

describe('downloadReportUtil', () => {
  describe('buildFailedFilesReport()', () => {
    test('describes the download, its request, and each file that wasn\'t included', () => {
      const report = buildFailedFilesReport(completedState(), GENERATED_AT, PUBLIC_API_ROOT);
      expect(report.title).toBe(FAILED_FILES_REPORT_TITLE);
      expect(report.reportVersion).toBe(FAILED_FILES_REPORT_VERSION);
      expect(report.generatedAt).toBe('2026-11-14T20:00:00.000Z');
      expect(report.download).toEqual({
        fileName: 'NEON_wind-2d.zip',
        status: 'COMPLETED',
        startedAt: '2026-11-14T19:50:00.000Z',
        finishedAt: '2026-11-14T19:55:00.000Z',
        elapsedMs: 300000,
      });
      expect(report.requestManifest).toEqual({
        productCode: 'DP1.00001.001',
        productName: '2D wind speed and direction',
        release: 'RELEASE-2026',
        sites: ['HARV', 'BART'],
        startMonth: '2020-01',
        endMonth: '2020-12',
        packageType: 'basic',
        includeDocumentation: true,
        includeProvisionalData: false,
      });
      expect(report.summary).toEqual({
        totalFiles: 10,
        filesIncluded: 8,
        filesNotIncluded: 2,
        filesListed: 2,
        listComplete: true,
        uncompressedBytesIncluded: 8000,
        uncompressedBytesNotIncluded: 2300,
      });
      expect(report.filesNotIncluded).toEqual([
        {
          fileName: DATA_FILE.fileName,
          type: 'DATA',
          productCode: 'DP1.00001.001',
          siteCode: 'HARV',
          month: '2020-01',
          release: 'RELEASE-2026',
          packageType: 'basic',
          sizeBytes: 2000,
          checksum: 'yZRlqg==',
          checksumAlgorithm: 'CRC32C',
          url: DATA_FILE.url,
          reason: 'SIGNING_FAILED',
          reasonDescription: FAILURE_REASON_DESCRIPTIONS.SIGNING_FAILED,
        },
        {
          fileName: DOCUMENT_FILE.fileName,
          type: 'DOCUMENT',
          description: 'Algorithm theoretical basis document',
          sizeBytes: 300,
          url: DOCUMENT_FILE.url,
          reason: 'NOT_FOUND',
          reasonDescription: FAILURE_REASON_DESCRIPTIONS.NOT_FOUND,
        },
      ]);
      expect(report.nextSteps[0]).toMatch(/^Download each file individually from its url/);
      expect(report.nextSteps[report.nextSteps.length - 1]).toContain(NEON_CONTACT_URL);
    });

    test('never includes the download identifier or the release label', () => {
      const json = JSON.stringify(buildFailedFilesReport(completedState(), GENERATED_AT, PUBLIC_API_ROOT));
      expect(json).not.toContain('downloadId');
      expect(json).not.toContain('0d9f0e4a-5b6c-4d7e-8f90-a1b2c3d4e5f6');
      expect(json).not.toContain('releaseLabel');
    });

    test('only includes values in their expected public form', () => {
      const unsafeFile = {
        fileName: 'private/path/file.csv',
        type: 'SECRET',
        description: 'See https://internal.example/runbook',
        productCode: 'DP1 00001',
        siteCode: 'HARV?token=secret',
        month: '2020-13',
        release: 'RELEASE/../2026',
        packageType: 'basic expanded',
        sizeBytes: -1,
        checksum: 'not a checksum',
        checksumAlgorithm: 'CRC32C;DROP',
        url: `${PUBLIC_API_ROOT}/data/file.csv?X-Goog-Signature=secret`,
        reason: 'java.io.IOException: connection to 10.0.0.12 refused',
      } as unknown as DownloadProgressFailedFile;
      const report = buildFailedFilesReport(completedState({
        zipFileName: '/var/tmp/NEON.zip',
        failedFileDetails: [
          unsafeFile,
          { ...DATA_FILE, url: 'https://internal-api.example/api/v0/data/file.csv' },
          { ...DATA_FILE, url: 'https://user:password@data.neonscience.org/api/v0/data/file.csv' },
          { ...DATA_FILE, url: 'https://data.neonscience.org/internal/file.csv' },
        ],
      }), GENERATED_AT, PUBLIC_API_ROOT);
      expect(report.download.fileName).toBeNull();
      expect(report.filesNotIncluded[0]).toEqual({
        reason: 'UNKNOWN',
        reasonDescription: FAILURE_REASON_DESCRIPTIONS.UNKNOWN,
      });
      report.filesNotIncluded.slice(1).forEach((file) => {
        expect(file.url).toBeUndefined();
        expect(file.fileName).toBe(DATA_FILE.fileName);
      });
      const json = JSON.stringify(report);
      ['private', 'internal', 'secret', 'password', '10.0.0.12', 'IOException', '/var/tmp']
        .forEach((value: string) => expect(json).not.toContain(value));
    });

    test('lists the file names when no details were reported, noting an incomplete list', () => {
      const report = buildFailedFilesReport(completedState({
        filesFailed: 25,
        failedFiles: ['a.csv', 'b.csv', 'a.csv', 'https://storage.example/c.csv?signature=secret'],
        failedFileDetails: [],
      }), GENERATED_AT, PUBLIC_API_ROOT);
      expect(report.filesNotIncluded).toEqual([{ fileName: 'a.csv' }, { fileName: 'b.csv' }]);
      expect(report.summary.filesListed).toBe(2);
      expect(report.summary.listComplete).toBe(false);
      expect(report.nextSteps.some((step: string) => step.includes('2 of the 25 files'))).toBe(true);
      expect(report.nextSteps.some((step: string) => step.includes('from its url'))).toBe(false);
    });

    test('omits an unknown request', () => {
      const report = buildFailedFilesReport(completedState({
        summary: null,
        failedFileDetails: [{ ...emptyFailedFile(), fileName: 'c.csv' }],
        filesFailed: 1,
        startedAt: null,
      }), GENERATED_AT, PUBLIC_API_ROOT);
      expect(report.filesNotIncluded).toEqual([{
        fileName: 'c.csv',
        reason: 'UNKNOWN',
        reasonDescription: FAILURE_REASON_DESCRIPTIONS.UNKNOWN,
      }]);
      expect(report.requestManifest.productCode).toBeNull();
      expect(report.requestManifest.sites).toEqual([]);
      expect(report.download.startedAt).toBeNull();
    });
  });

  describe('getFailedFilesReportFileName()', () => {
    test('names the report after the download package', () => {
      expect(getFailedFilesReportFileName(completedState()))
        .toBe('NEON_wind-2d_files_not_included.json');
      expect(getFailedFilesReportFileName(completedState({ zipFileName: null })))
        .toBe('NEON_DP1.00001.001_files_not_included.json');
      expect(getFailedFilesReportFileName(completedState({ zipFileName: null, summary: null })))
        .toBe('NEON_data_files_not_included.json');
      expect(getFailedFilesReportFileName(completedState({ zipFileName: 'NEON data 2d.zip' })))
        .toBe('NEON_data_2d_files_not_included.json');
      expect(getFailedFilesReportFileName(completedState({ zipFileName: '/private/NEON.zip' })))
        .toBe('NEON_DP1.00001.001_files_not_included.json');
    });
  });

  describe('saveJsonFile()', () => {
    const originalCreateObjectURL = URL.createObjectURL;
    const originalRevokeObjectURL = URL.revokeObjectURL;
    afterEach(() => {
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
      jest.restoreAllMocks();
      jest.useRealTimers();
    });

    test('saves the formatted JSON through a temporary link', async () => {
      jest.useFakeTimers();
      const createObjectURL = jest.fn<(blob: Blob) => string>(() => 'blob:report');
      const revokeObjectURL = jest.fn<(url: string) => void>();
      URL.createObjectURL = createObjectURL as unknown as typeof URL.createObjectURL;
      URL.revokeObjectURL = revokeObjectURL;
      const clicked: HTMLAnchorElement[] = [];
      jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function click(
        this: HTMLAnchorElement,
      ) {
        clicked.push(this);
      });
      expect(saveJsonFile('report.json', { files: ['a.csv'] })).toBe(true);
      expect(clicked).toHaveLength(1);
      expect(clicked[0].download).toBe('report.json');
      expect(clicked[0].getAttribute('href')).toBe('blob:report');
      expect(document.body.contains(clicked[0])).toBe(false);
      const blob = createObjectURL.mock.calls[0][0];
      expect(blob.type).toBe('application/json');
      expect(JSON.parse(await readBlob(blob))).toEqual({ files: ['a.csv'] });
      expect(revokeObjectURL).not.toHaveBeenCalled();
      jest.runAllTimers();
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:report');
    });

    test('saves the report of a download', async () => {
      const createObjectURL = jest.fn<(blob: Blob) => string>(() => 'blob:report');
      URL.createObjectURL = createObjectURL as unknown as typeof URL.createObjectURL;
      URL.revokeObjectURL = jest.fn<(url: string) => void>();
      const clicked: HTMLAnchorElement[] = [];
      jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function click(
        this: HTMLAnchorElement,
      ) {
        clicked.push(this);
      });
      expect(saveFailedFilesReport(completedState())).toBe(true);
      expect(clicked[0].download).toBe('NEON_wind-2d_files_not_included.json');
      const report = JSON.parse(await readBlob(createObjectURL.mock.calls[0][0]));
      expect(report.requestManifest.productCode).toBe('DP1.00001.001');
      expect(report.filesNotIncluded).toHaveLength(2);
      expect(report.download.downloadId).toBeUndefined();
    });

    test('does not save without object URL support', () => {
      URL.createObjectURL = undefined as unknown as typeof URL.createObjectURL;
      expect(saveJsonFile('report.json', {})).toBe(false);
    });
  });
});
