import cloneDeep from 'lodash/cloneDeep';

// Mock some NeonEnvironment functions
import NeonEnvironment from '../../components/NeonEnvironment/NeonEnvironment';

import {
  formatBytes,
  buildManifestConfig,
  buildSiteCodesParams,
  buildManifestRequestUrl,
  buildManifestRequestBody,
  buildS3FilesRequestUrl,
  getSizeEstimateFromManifestResponse,
  getSizeEstimateFromManifestRollupResponse,
  downloadAopManifest,
} from '../manifestUtil';

jest.mock('../../components/NeonEnvironment/NeonEnvironment', () => ({
  __esModule: true,
  default: {
    getFullApiPath: jest.fn(),
    getFullDownloadApiPath: jest.fn(),
  },
}));

describe('Utils - manifestUtil', () => {
  beforeAll(() => {
    window.HTMLFormElement.prototype.submit = jest.fn();
    JSON.stringify = jest.fn();
  });
  afterAll(() => {
    window.HTMLFormElement.prototype.submit.mockRestore();
    JSON.stringify.mockRestore();
  });
  beforeEach(() => {
    JSON.stringify.mockReset();
    NeonEnvironment.getFullApiPath.mockReset();
    NeonEnvironment.getFullDownloadApiPath.mockReset();
  });

  describe.each([
    ['(int) 1', 1, '1.000 B'],
    ['(int) 234234', 234234, '229 KB'],
    ['(int) -6', -6, '0.000 B'],
    ['(int) 42949672960', 42949672960, '40.0 GB'],
    ['null', null, '0.000 B'],
    ['(float) 5.6', 5.6, '0.000 B'],
    ['(string) "1"', '1', '0.000 B'],
  ])('formatBytes()', (inputLabel, inputValue, expected) => {
    test(`${inputLabel} resolves to ${expected}`, () => {
      expect(formatBytes(inputValue)).toBe(expected);
    });
  });

  describe('buildManifestConfig()', () => {
    const baseSelection = {
      productData: { productCode: 'DPx.xxxxx.xxx' },
      release: { value: 'release-foo', isValid: true },
      sites: { value: ['JERC', 'COMO'], isValid: true },
      dateRange: { value: ['2020-01', '2020-06'], isValid: true },
      provisionalData: { value: 'exclude', isValid: true },
      documentation: { value: 'exclude', isValid: true },
      packageType: { value: 'basic', isValid: true },
    };
    test('returns a config with error if productData is invalid', () => {
      const selection = cloneDeep(baseSelection);
      delete selection.productData.productCode;
      const config1 = buildManifestConfig(selection);
      expect(config1.isError).toBe(true);
      expect(config1.errorMessage).toBe('Invalid data product');
      delete selection.productData;
      const config2 = buildManifestConfig(selection);
      expect(config2.isError).toBe(true);
      expect(config2.errorMessage).toBe('Invalid data product');
    });
    test('returns a config with error if sites selection is invalid', () => {
      const selection = cloneDeep(baseSelection);
      selection.sites.isValid = false;
      const config = buildManifestConfig(selection);
      expect(config.isError).toBe(true);
      expect(config.errorMessage).toBe('Invalid site selection');
    });
    test('returns a config with error if date range is invalid', () => {
      const selection = cloneDeep(baseSelection);
      selection.dateRange.isValid = false;
      const config = buildManifestConfig(selection);
      expect(config.isError).toBe(true);
      expect(config.errorMessage).toBe('Invalid date range');
    });
    test('does not return a config with error if isAop is true', () => {
      const selection = cloneDeep(baseSelection);
      delete selection.productData.productCode;
      const config = buildManifestConfig(selection, 'basic', true);
      expect(config.isError).toBe(false);
      expect(config.errorMessage).toBeUndefined();
    });
    test('maps values to returned config; filling in default packageType if necessary', () => {
      const selection = cloneDeep(baseSelection);
      selection.packageType = { value: null, isValid: false };
      const config = buildManifestConfig(selection);
      expect(config).toStrictEqual({
        productCode: 'DPx.xxxxx.xxx',
        release: 'release-foo',
        sites: ['JERC', 'COMO'],
        dateRange: ['2020-01', '2020-06'],
        provisionalData: false,
        documentation: false,
        packageType: 'basic',
        isError: false,
      });
    });
  });

  describe('buildSiteCodesParams()', () => {
    test('returns an empty string for no/empty input', () => {
      expect(buildSiteCodesParams()).toBe('');
      expect(buildSiteCodesParams([])).toBe('');
    });
    test('returns a non-camelCased param string by default', () => {
      expect(buildSiteCodesParams(['JERC'])).toBe('sitecode=JERC');
      expect(buildSiteCodesParams(['JERC', 'BONA'])).toBe('sitecode=JERC&sitecode=BONA');
    });
    test('returns a camelCased param string if requested', () => {
      expect(buildSiteCodesParams(['JERC'], true)).toBe('siteCode=JERC');
      expect(buildSiteCodesParams(['JERC', 'BONA'], true)).toBe('siteCode=JERC&siteCode=BONA');
    });
  });

  describe('buildManifestRequestUrl()', () => {
    const config = {
      productCode: 'DPx.xxxxx.xxx',
      release: 'release-foo',
      sites: ['JERC', 'COMO'],
      dateRange: ['2020-01', '2020-06'],
      documentation: true,
      provisionalData: false,
      packageType: 'expanded',
      isError: false,
    };
    beforeEach(() => {
      NeonEnvironment.getFullDownloadApiPath.mockReturnValue('MANIFEST_REQUEST_URL');
    });
    test('returns the rollup path if useBody is true (by default)', () => {
      const url = buildManifestRequestUrl(config);
      expect(url).toBe('MANIFEST_REQUEST_URL');
    });
    test('returns the built url if useBody is false', () => {
      const url = buildManifestRequestUrl(config, false);
      const expectedUrl = 'MANIFEST_REQUEST_URL?dpcode=NEON.DOM.SITE.DPx.xxxxx.xxx&startdate=2020-01&enddate=2020-06&pkgtype=expanded&includedocs=true&includeProvisional=false&sitecode=JERC&sitecode=COMO';
      expect(url).toBe(expectedUrl);
    });
    test('handles NEON.DOM.SITE already being in config', () => {
      const configA = cloneDeep(config);
      configA.documentation = false;
      configA.productCode = 'NEON.DOM.SITE.DP0.00000.000';

      const url = buildManifestRequestUrl(configA, false);
      const expectedUrl = 'MANIFEST_REQUEST_URL?dpcode=NEON.DOM.SITE.DP0.00000.000&startdate=2020-01&enddate=2020-06&pkgtype=expanded&includedocs=false&includeProvisional=false&sitecode=JERC&sitecode=COMO';
      expect(url).toBe(expectedUrl);
    });
  });

  describe('buildManifestRequestBody()', () => {
    const config = {
      productCode: 'DPx.xxxxx.xxx',
      release: 'release-foo',
      sites: ['JERC', 'COMO'],
      dateRange: ['2020-01', '2020-06'],
      documentation: true,
      provisionalData: false,
      packageType: 'expanded',
      isError: false,
    };
    test('builds the proper request body', () => {
      expect(buildManifestRequestBody(config)).toStrictEqual({
        dpCode: 'NEON.DOM.SITE.DPx.xxxxx.xxx',
        siteCodes: ['JERC', 'COMO'],
        startDateMonth: '2020-01',
        endDateMonth: '2020-06',
        release: 'release-foo',
        pkgType: 'expanded',
        includeDocs: true,
        includeProvisional: false,
        presign: true,
      });
    });
    test('handles NEON.DOM.SITE already being in config', () => {
      const configA = cloneDeep(config);
      configA.productCode = 'NEON.DOM.SITE.DP0.00000.000';
      expect(buildManifestRequestBody(configA)).toStrictEqual({
        dpCode: 'NEON.DOM.SITE.DP0.00000.000',
        siteCodes: ['JERC', 'COMO'],
        startDateMonth: '2020-01',
        endDateMonth: '2020-06',
        release: 'release-foo',
        pkgType: 'expanded',
        includeDocs: true,
        includeProvisional: false,
        presign: true,
      });
    });
  });

  describe('buildS3FilesRequestUrl()', () => {
    beforeEach(() => {
      NeonEnvironment.getFullApiPath.mockReturnValue('DATA_URL');
    });
    test('accepts a null release', () => {
      expect(
        buildS3FilesRequestUrl(
          'DP1.12345.001',
          'BONA',
          '2020-04',
          null,
        ),
      ).toBe('DATA_URL/NEON.DOM.SITE.DP1.12345.001/BONA/2020-04?presign=false');
    });
    test('handles NEON.DOM.SITE already being in product code', () => {
      expect(
        buildS3FilesRequestUrl(
          'NEON.DOM.SITE.DP1.12345.001',
          'BONA',
          '2020-04',
          '',
        ),
      ).toBe('DATA_URL/NEON.DOM.SITE.DP1.12345.001/BONA/2020-04?presign=false');
    });
    test('handles a defined release', () => {
      expect(
        buildS3FilesRequestUrl(
          'DP1.12345.001',
          'BONA',
          '2020-04',
          'foo',
        ),
      ).toBe('DATA_URL/NEON.DOM.SITE.DP1.12345.001/BONA/2020-04?presign=false&release=foo');
    });
  });

  describe('getSizeEstimateFromManifestResponse()', () => {
    test('returns 0 for anything but a well-formed manifest response', () => {
      expect(getSizeEstimateFromManifestResponse()).toBe(0);
      expect(getSizeEstimateFromManifestResponse(null)).toBe(0);
      expect(getSizeEstimateFromManifestResponse({})).toBe(0);
      expect(getSizeEstimateFromManifestResponse({ data: null })).toBe(0);
      expect(getSizeEstimateFromManifestResponse({ data: {} })).toBe(0);
      expect(getSizeEstimateFromManifestResponse({ data: { manifestEntries: null } })).toBe(0);
      expect(getSizeEstimateFromManifestResponse({ data: { manifestEntries: [] } })).toBe(0);
    });
    test('returns aggregated value from well-formed manifest response', () => {
      const response = {
        data: {
          manifestEntries: [
            { fileSizeBytes: 20 },
            { fileSizeBytes: '55' },
            { foo: 90 },
          ],
        },
      };
      expect(getSizeEstimateFromManifestResponse(response)).toBe(75);
    });
  });

  describe('getSizeEstimateFromManifestRollupResponse()', () => {
    test('returns 0 for anything but a well-formed manifest rollup response', () => {
      expect(getSizeEstimateFromManifestRollupResponse()).toBe(0);
      expect(getSizeEstimateFromManifestRollupResponse(null)).toBe(0);
      expect(getSizeEstimateFromManifestRollupResponse({})).toBe(0);
      expect(getSizeEstimateFromManifestRollupResponse({ data: null })).toBe(0);
      expect(getSizeEstimateFromManifestRollupResponse({ data: {} })).toBe(0);
      expect(getSizeEstimateFromManifestRollupResponse({ data: { totalBytes: null } })).toBe(0);
      expect(getSizeEstimateFromManifestRollupResponse({ data: { totalBytes: '40' } })).toBe(0);
    });
    test('returns value from well-formed manifest rollup response', () => {
      expect(getSizeEstimateFromManifestRollupResponse({ data: { totalBytes: 40 } })).toBe(40);
    });
  });

  describe('downloadAopManifest()', () => {
    test('correctly builds s3 manifest for download form injection', () => {
      const config = {
        productCode: 'DP123',
        release: 'foo',
        sites: ['JERC', 'COMO'],
        dateRange: ['2020-01', '2020-06'],
        documentation: true,
        provisionalData: false,
        packageType: 'expanded',
        isError: false,
      };
      const s3Files = {
        isValid: true,
        value: ['root/f1', 'root/f3', 'f4'],
        validValues: [
          {
            url: 'root/f1',
            site: 'JERC',
            productCode: 'DP123',
            release: 'foo',
            yearMonth: '2020-01',
            size: 101,
            checksum: 'abc',
            checksumAlgorithm: 'MD5',
          },
          {
            url: 'root/f2',
            site: 'JERC',
            productCode: 'DP123',
            release: 'foo',
            yearMonth: '2020-10',
            size: 202,
            checksum: 'def',
            checksumAlgorithm: 'MD5',
          },
          {
            url: 'root/f3',
            site: 'BONA',
            productCode: 'DP123',
            release: 'foo',
            yearMonth: '2020-04',
            size: 303,
            checksum: 'ghi',
            checksumAlgorithm: 'MD5',
          },
          {
            url: 'f4',
            site: 'BONA',
            productCode: 'DP123',
            release: null,
            yearMonth: '2020-05',
            size: 404,
            checksum: 'jkl',
            checksumAlgorithm: 'MD5',
          },
        ],
      };
      downloadAopManifest(config, s3Files);
      expect(JSON.stringify).toHaveBeenCalledTimes(1);
      expect(JSON.stringify).toHaveBeenCalledWith({
        dpCode: 'NEON.DOM.SITE.DP123',
        startDateMonth: null,
        endDateMonth: null,
        release: 'foo',
        pkgType: null,
        presign: true,
        manifestFiles: [
          {
            release: 'foo',
            productCode: 'DP123',
            siteCode: 'JERC',
            month: '2020-01',
            packageType: 'basic',
            fileName: 'f1',
            fileSizeBytes: 101,
            checksum: 'abc',
            checksumAlgorithm: 'MD5',
            uri: 'root/f1',
          },
          {
            release: 'foo',
            productCode: 'DP123',
            siteCode: 'BONA',
            month: '2020-04',
            packageType: 'basic',
            fileName: 'f3',
            fileSizeBytes: 303,
            checksum: 'ghi',
            checksumAlgorithm: 'MD5',
            uri: 'root/f3',
          },
          {
            release: null,
            productCode: 'DP123',
            siteCode: 'BONA',
            month: '2020-05',
            packageType: 'basic',
            fileName: 'f4',
            fileSizeBytes: 404,
            checksum: 'jkl',
            checksumAlgorithm: 'MD5',
            uri: 'f4',
          },
        ],
        siteCodes: ['JERC', 'BONA'],
        includeDocs: true,
        includeProvisional: false,
      });
    });
  });
});
