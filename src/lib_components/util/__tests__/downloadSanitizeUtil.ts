import {
  describe,
  expect,
  test,
} from '@jest/globals';

import { DownloadProgressFailureReason } from '../../types/downloadProgress';
import {
  sanitizeByteCount,
  sanitizeChecksum,
  sanitizeDescription,
  sanitizeFailedFile,
  sanitizeFailureReason,
  sanitizeFileName,
  sanitizeIdentifier,
  sanitizeMonth,
  sanitizePublicApiUrl,
} from '../downloadSanitizeUtil';

const PUBLIC_API_ROOT = 'https://data.neonscience.org/api/v0';

describe('downloadSanitizeUtil', () => {
  test('keeps only base file names', () => {
    expect(sanitizeFileName('NEON.D01.HARV.DP1.00001.001.2020-01.basic.csv'))
      .toBe('NEON.D01.HARV.DP1.00001.001.2020-01.basic.csv');
    expect(sanitizeFileName(' readme (v2).txt ')).toBe('readme (v2).txt');
    [
      'private/path/file.csv',
      'C:\\private\\file.csv',
      'https://storage.example/file.csv',
      'file.csv?X-Goog-Signature=secret',
      'file.csv#fragment',
      'file\u0000.csv',
      'a'.repeat(256),
      '',
      null,
      42,
    ].forEach((value: unknown) => expect(sanitizeFileName(value)).toBeNull());
  });

  test('keeps only identifiers, months, checksums, and byte counts', () => {
    expect(sanitizeIdentifier('DP1.00001.001')).toBe('DP1.00001.001');
    expect(sanitizeIdentifier('RELEASE-2026')).toBe('RELEASE-2026');
    ['DP1 00001', 'HARV?token=secret', 'RELEASE/../2026', 'a;b', 'a'.repeat(65)]
      .forEach((value: string) => expect(sanitizeIdentifier(value)).toBeNull());
    expect(sanitizeMonth('2020-01')).toBe('2020-01');
    ['2020-13', '2020-1', '2020-01-01', 'January'].forEach((value: string) => (
      expect(sanitizeMonth(value)).toBeNull()
    ));
    expect(sanitizeChecksum('5d41402abc4b2a76b9719d911017c592')).toBe('5d41402abc4b2a76b9719d911017c592');
    expect(sanitizeChecksum('yZRlqg==')).toBe('yZRlqg==');
    ['not a checksum', 'abc:def', 'a'.repeat(129)].forEach((value: string) => (
      expect(sanitizeChecksum(value)).toBeNull()
    ));
    expect(sanitizeByteCount(0)).toBe(0);
    expect(sanitizeByteCount(2000)).toBe(2000);
    [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, '2000', null].forEach((value: unknown) => (
      expect(sanitizeByteCount(value)).toBeNull()
    ));
  });

  test('keeps only plain text descriptions', () => {
    expect(sanitizeDescription('  Algorithm\ntheoretical   basis document ')).toBe(
      'Algorithm theoretical basis document',
    );
    ['See https://internal.example/runbook', 'a'.repeat(501), 'bell\u0007', '   ']
      .forEach((value: string) => expect(sanitizeDescription(value)).toBeNull());
  });

  test('keeps only known reasons', () => {
    Object.values(DownloadProgressFailureReason).forEach((reason: DownloadProgressFailureReason) => (
      expect(sanitizeFailureReason(reason)).toBe(reason)
    ));
    ['java.io.IOException: connection to 10.0.0.12 refused', 'not_found', null, 1]
      .forEach((value: unknown) => (
        expect(sanitizeFailureReason(value)).toBe(DownloadProgressFailureReason.UNKNOWN)
      ));
  });

  test('keeps only URLs of the public API the portal uses', () => {
    const dataUrl = `${PUBLIC_API_ROOT}/releases/RELEASE-2026/data/DP1.00001.001/HARV/2020-01/a.csv`;
    expect(sanitizePublicApiUrl(dataUrl, PUBLIC_API_ROOT)).toBe(dataUrl);
    expect(sanitizePublicApiUrl(`${PUBLIC_API_ROOT}/documents/NEON.DOC.000001`, `${PUBLIC_API_ROOT}/`))
      .toBe(`${PUBLIC_API_ROOT}/documents/NEON.DOC.000001`);
    [
      `${PUBLIC_API_ROOT}/data/a.csv?X-Goog-Signature=secret`,
      `${PUBLIC_API_ROOT}/data/a.csv#fragment`,
      'https://user:password@data.neonscience.org/api/v0/data/a.csv',
      'https://internal-api.example/api/v0/data/a.csv',
      'http://data.neonscience.org/api/v0/data/a.csv',
      'https://data.neonscience.org:8443/api/v0/data/a.csv',
      'https://data.neonscience.org/internal/a.csv',
      'https://data.neonscience.org/api/v0/../internal/a.csv',
      'https://data.neonscience.org/api/v0/%2e%2e/internal/a.csv',
      'https://data.neonscience.org/api/v01/a.csv',
      'https://storage.googleapis.com/bucket/a.csv',
      'javascript:alert(1)',
      '/api/v0/data/a.csv',
      'not a url',
      null,
    ].forEach((value: unknown) => expect(sanitizePublicApiUrl(value, PUBLIC_API_ROOT)).toBeNull());
    expect(sanitizePublicApiUrl(dataUrl, 'not a url')).toBeNull();
  });

  test('keeps the details of a failed file in their expected public form', () => {
    expect(sanitizeFailedFile('not a file', PUBLIC_API_ROOT)).toBeNull();
    expect(sanitizeFailedFile(null, PUBLIC_API_ROOT)).toBeNull();
    expect(sanitizeFailedFile([], PUBLIC_API_ROOT)).toBeNull();
    expect(sanitizeFailedFile({
      fileName: 'a.csv',
      type: 'DATA',
      description: 'A description',
      productCode: 'DP1.00001.001',
      siteCode: 'HARV',
      month: '2020-01',
      release: 'RELEASE-2026',
      packageType: 'basic',
      sizeBytes: 2000,
      checksum: 'yZRlqg==',
      checksumAlgorithm: 'CRC32C',
      url: `${PUBLIC_API_ROOT}/data/DP1.00001.001/HARV/2020-01/a.csv`,
      reason: 'NOT_FOUND',
      message: 'Ignored',
    }, PUBLIC_API_ROOT)).toEqual({
      fileName: 'a.csv',
      type: 'DATA',
      description: 'A description',
      productCode: 'DP1.00001.001',
      siteCode: 'HARV',
      month: '2020-01',
      release: 'RELEASE-2026',
      packageType: 'basic',
      sizeBytes: 2000,
      checksum: 'yZRlqg==',
      checksumAlgorithm: 'CRC32C',
      url: `${PUBLIC_API_ROOT}/data/DP1.00001.001/HARV/2020-01/a.csv`,
      reason: 'NOT_FOUND',
    });
    expect(sanitizeFailedFile({ type: 'SECRET' }, PUBLIC_API_ROOT)).toEqual({
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
      reason: 'UNKNOWN',
    });
  });
});
