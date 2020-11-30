import NeonEnvironment from '../components/NeonEnvironment/NeonEnvironment';
import {
  ManifestConfig,
  ManifestFile,
  ManifestRequest,
  ManifestSelection,
} from '../types/manifest';

// Build an object from state suitable for manifestUtil.buildManifestRequestUrl()
export const buildManifestConfig = (
  selection: ManifestSelection,
  defaultPackageType = 'basic',
  isAop = false,
): ManifestConfig => {
  const config: ManifestConfig = {
    productCode: '',
    sites: [],
    dateRange: [],
    documentation: false,
    packageType: '',
    isError: true,
  };
  let manifestConfigError = null;
  if (!isAop && (!selection.productData || !selection.productData.productCode)) {
    manifestConfigError = 'Invalid data product';
  }
  if (!isAop && !selection.sites.isValid) {
    manifestConfigError = 'No sites selected';
  }
  if (!isAop && !selection.dateRange.isValid) {
    manifestConfigError = 'Invalid date range';
  }
  if (manifestConfigError) {
    config.errorMessage = manifestConfigError;
    return config;
  }
  config.isError = false;
  config.productCode = selection.productData.productCode as string;
  config.sites = selection.sites.value;
  config.dateRange = selection.dateRange.value;
  config.documentation = (selection.documentation.value === 'include');
  config.packageType = selection.packageType.value || defaultPackageType;
  return config;
};

// eslint-disable-next-line no-array-constructor
const buildSiteCodesParams = (sites = new Array<string>(), camelCase = false): string => {
  const param = camelCase ? 'siteCode' : 'sitecode';
  return sites.reduce((sitesString, siteCode, index) => (
    `${sitesString}${index === 0 ? '' : '&'}${param}=${siteCode}`
  ), '');
};

export const buildManifestRequestUrl = (config: ManifestConfig, useBody = true): string => {
  const {
    productCode,
    sites,
    dateRange,
    packageType,
    documentation,
  } = config;
  let url = `${NeonEnvironment.getFullApiPath('manifest')}/manifest/rollup`;
  if (!useBody) {
    const siteCodesParam = buildSiteCodesParams(sites);
    const productCodeParam = productCode.startsWith('NEON.DOM.SITE')
      ? productCode
      : `NEON.DOM.SITE.${productCode}`;
    const params = [
      `dpcode=${productCodeParam}`,
      `startdate=${dateRange[0]}`,
      `enddate=${dateRange[1]}`,
      `pkgtype=${packageType}`,
      `includedocs=${documentation ? 'true' : 'false'}`,
      siteCodesParam,
    ];
    url = `${url}?${params.join('&')}`;
  }
  return url;
};

export const buildManifestRequestBody = (config: ManifestConfig): ManifestRequest => {
  const {
    productCode,
    sites,
    dateRange,
    packageType,
    documentation,
  } = config;
  const productCodeParam = productCode.startsWith('NEON.DOM.SITE')
    ? productCode
    : `NEON.DOM.SITE.${productCode}`;
  return {
    dpCode: productCodeParam,
    siteCodes: sites,
    startDateMonth: dateRange[0],
    endDateMonth: dateRange[1],
    release: '',
    pkgType: packageType,
    includeDocs: documentation,
    presign: true,
  };
};

export const buildS3FilesRequestUrl = (
  productCode: string,
  site: string,
  yearMonth: string,
): string => {
  const productCodeDir = productCode.startsWith('NEON.DOM.SITE')
    ? productCode
    : `NEON.DOM.SITE.${productCode}`;
  return `${NeonEnvironment.getFullApiPath('data')}/${productCodeDir}/${site}/${yearMonth}?presign=false`;
};

export const downloadManifest = (manifest: ManifestRequest) => {
  const form = document.createElement('form');
  form.style.display = 'none';
  form.action = `${NeonEnvironment.getFullApiPath('download')}/stream`;
  form.method = 'POST';

  const input = document.createElement('input');
  input.name = 'manifest';
  input.value = JSON.stringify(manifest);
  form.appendChild(input);

  document.body.appendChild(form);
  const submit = form.submit();
  document.body.removeChild(form);

  return submit;
};

export const downloadAopManifest = (
  config: ManifestConfig,
  s3Files: Record<string, unknown>,
  documentation = 'include',
) => {
  const siteCodes: string[] = [];
  const s3FileValues: Record<string, unknown>[] = s3Files.cachedValues as Record<string, unknown>[];
  const manifestS3Files: ManifestFile[] = s3FileValues
    .map((file: Record<string, unknown>): ManifestFile => ({
      release: file.release as string,
      productCode: file.productCode as string,
      siteCode: file.site as string,
      month: file.yearMonth as string,
      fileName: (file.url as string).split('/').pop() || '',
      fileSizeBytes: file.size as number,
      checksum: file.checksum as string,
      checksumAlgorithm: file.checksumAlgorithm as string,
      uri: file.url as string,
    }));

  const includeDocs = documentation === 'include';
  const productCodeParam: string = config.productCode.startsWith('NEON.DOM.SITE')
    ? config.productCode
    : `NEON.DOM.SITE.${config.productCode}`;
  const manifestRequest: ManifestRequest = {
    dpCode: productCodeParam,
    startDateMonth: null,
    endDateMonth: null,
    release: null,
    pkgType: null,
    presign: true,
    manifestFiles: manifestS3Files,
    siteCodes,
    includeDocs,
  };

  return downloadManifest(manifestRequest);
};

export const MAX_POST_BODY_SIZE = 20 * (1024 * 1024); // 20MiB
export const DOWNLOAD_SIZE_WARN = 42949672960; // 40GB

export const formatBytes = (bytes: number) => {
  if (!Number.isInteger(bytes) || bytes < 0) {
    return '0.000 B';
  }
  const scales = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const log = Math.log(bytes) / Math.log(1024);
  const scale = Math.floor(log);
  const precision = Math.floor(3 - ((log - scale) * 3));
  return `${(bytes / (1024 ** scale)).toFixed(precision)} ${scales[scale]}`;
};

export const getSizeEstimateFromManifestResponse = (response: any) => {
  if (typeof response !== 'object' || response === null
      || typeof response.data !== 'object' || response.data === null
      || !Array.isArray(response.data.manifestEntries)
      || !response.data.manifestEntries.length) {
    return 0;
  }
  return response.data.manifestEntries.reduce((total: number, entry: any) => (
    total + (parseInt(entry.fileSizeBytes, 10) || 0)
  ), 0);
};

export const getSizeEstimateFromManifestRollupResponse = (response: any) => {
  if (typeof response !== 'object' || response === null
      || typeof response.data !== 'object' || response.data === null
      || typeof response.data.totalBytes !== 'number'
      || response.data.totalBytes === null) {
    return 0;
  }
  return response.data.totalBytes;
};

export default buildManifestRequestUrl;