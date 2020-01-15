import NeonEnvironment from '../components/NeonEnvironment/NeonEnvironment';

const buildSiteCodesParams = (sites = [], camelCase = false) => {
  const param = camelCase ? 'siteCode' : 'sitecode';
  return sites.reduce((sitesString, siteCode, index) => (
    `${sitesString}${index === 0 ? '' : '&'}${param}=${siteCode}`
  ), '');
};

export const buildManifestRequestUrl = (config) => {
  const {
    productCode,
    sites,
    dateRange,
    packageType,
    documentation,
  } = config;
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
  return `${NeonEnvironment.getFullApiPath('manifest')}/datasetDownload?${params.join('&')}`;
};

export const buildS3FilesRequestUrl = (productCode, site, yearMonth) => {
  const productCodeDir = productCode.startsWith('NEON.DOM.SITE')
    ? productCode
    : `NEON.DOM.SITE.${productCode}`;
  return `${NeonEnvironment.getFullApiPath('data')}/${productCodeDir}/${site}/${yearMonth}?presign=false`;
};

export const downloadManifest = (manifest = {}) => {
  const form = document.createElement('form');
  form.style.display = 'none';
  form.action = `${NeonEnvironment.getFullApiPath('download')}/dpDownload`;
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

export const downloadAopManifest = (productData, s3Files, documentation = 'include') => {
  const { productCode, productName } = productData;
  const zipFileName = (productName || '').toLowerCase().replace(/\W/g, '-')
    || productCode.replace(/\W/g, '-');

  const manifestS3Files = s3Files.value.map(id => ({
    path: s3Files.urlsById[id],
    fileName: s3Files.urlsById[id].split('/').pop() || '',
    presign: true,
  }));

  const manifestDocumentationFiles = documentation === 'include'
    ? (productData.specs || []).map(spec => ({
      fileName: `${spec.specNumber}.pdf`,
      path: `${NeonEnvironment.getFullApiPath('documents')}/${spec.specNumber}`,
      presign: false,
    })) : [];

  const manifest = {
    mimeType: 'application/zip',
    zipFileName: `NEON_${zipFileName}`,
    manifestEntries: [...manifestS3Files, ...manifestDocumentationFiles],
  };

  return downloadManifest(manifest);
};

export const MAX_POST_BODY_SIZE = 2097152; // 2MB
export const DOWNLOAD_SIZE_WARN = 42949672960; // 40GB

export const formatBytes = (bytes) => {
  if (!Number.isInteger(bytes) || bytes < 0) {
    return '0.000 B';
  }
  const scales = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const log = Math.log(bytes) / Math.log(1024);
  const scale = Math.floor(log);
  const precision = Math.floor(3 - ((log - scale) * 3));
  return `${(bytes / (1024 ** scale)).toFixed(precision)} ${scales[scale]}`;
};

export const getSizeEstimateFromManifestResponse = (response) => {
  if (typeof response !== 'object' || response === null
      || !Array.isArray(response.manifestEntries)
      || !response.manifestEntries.length) {
    return 0;
  }
  return response.manifestEntries.reduce((total, entry) => (
    total + (parseInt(entry.fileSizeBytes, 10) || 0)
  ), 0);
};

export default buildManifestRequestUrl;
