"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSizeEstimateFromManifestRollupResponse = exports.getSizeEstimateFromManifestResponse = exports.formatBytes = exports.downloadManifest = exports.downloadAopManifest = exports.default = exports.buildSiteCodesParams = exports.buildS3FilesRequestUrl = exports.buildManifestRequestUrl = exports.buildManifestRequestBody = exports.buildManifestConfig = exports.MAX_POST_BODY_SIZE = exports.DOWNLOAD_SIZE_WARN = void 0;
var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment/NeonEnvironment"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Build an object from state suitable for manifestUtil.buildManifestRequestUrl()
const buildManifestConfig = function (selection) {
  let defaultPackageType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'basic';
  let isAop = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  const config = {
    productCode: '',
    release: '',
    sites: [],
    dateRange: [],
    documentation: false,
    packageType: '',
    provisionalData: false,
    isError: true
  };
  let manifestConfigError = null;
  if (!isAop) {
    if (!selection.productData || !selection.productData.productCode) {
      manifestConfigError = 'Invalid data product';
    } else if (!selection.sites.isValid) {
      manifestConfigError = 'Invalid site selection';
    } else if (!selection.dateRange.isValid) {
      manifestConfigError = 'Invalid date range';
    }
  }
  if (manifestConfigError) {
    config.errorMessage = manifestConfigError;
    return config;
  }
  config.isError = false;
  config.productCode = selection.productData.productCode;
  config.release = selection.release.value;
  config.sites = selection.sites.value;
  config.dateRange = selection.dateRange.value;
  config.documentation = selection.documentation.value === 'include';
  config.packageType = selection.packageType.value || defaultPackageType;
  config.provisionalData = selection.provisionalData.value === 'include';
  return config;
};

// eslint-disable-next-line no-array-constructor
exports.buildManifestConfig = buildManifestConfig;
const buildSiteCodesParams = function () {
  let sites = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Array();
  let camelCase = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  const param = camelCase ? 'siteCode' : 'sitecode';
  return sites.reduce((sitesString, siteCode, index) => "".concat(sitesString).concat(index === 0 ? '' : '&').concat(param, "=").concat(siteCode), '');
};
exports.buildSiteCodesParams = buildSiteCodesParams;
const buildManifestRequestUrl = function (config) {
  let useBody = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  const {
    productCode,
    sites,
    dateRange,
    packageType,
    documentation,
    provisionalData
  } = config;
  let url = _NeonEnvironment.default.getFullDownloadApiPath('manifestRollup');
  if (!useBody) {
    const siteCodesParam = buildSiteCodesParams(sites);
    const productCodeParam = productCode.startsWith('NEON.DOM.SITE') ? productCode : "NEON.DOM.SITE.".concat(productCode);
    const params = ["dpcode=".concat(productCodeParam), "startdate=".concat(dateRange[0]), "enddate=".concat(dateRange[1]), "pkgtype=".concat(packageType), "includedocs=".concat(documentation ? 'true' : 'false'), "includeProvisional=".concat(provisionalData ? 'true' : 'false'), siteCodesParam];
    url = "".concat(url, "?").concat(params.join('&'));
  }
  return url;
};
exports.buildManifestRequestUrl = buildManifestRequestUrl;
const buildManifestRequestBody = config => {
  const {
    productCode,
    release,
    sites,
    dateRange,
    packageType,
    documentation,
    provisionalData
  } = config;
  const productCodeParam = productCode.startsWith('NEON.DOM.SITE') ? productCode : "NEON.DOM.SITE.".concat(productCode);
  return {
    dpCode: productCodeParam,
    siteCodes: sites,
    startDateMonth: dateRange[0],
    endDateMonth: dateRange[1],
    release,
    pkgType: packageType,
    includeDocs: documentation,
    includeProvisional: provisionalData,
    presign: true
  };
};
exports.buildManifestRequestBody = buildManifestRequestBody;
const buildS3FilesRequestUrl = (productCode, site, yearMonth, release) => {
  const productCodeDir = productCode.startsWith('NEON.DOM.SITE') ? productCode : "NEON.DOM.SITE.".concat(productCode);
  const releaseParam = typeof release === 'string' && release.length > 0 ? "&release=".concat(release) : '';
  const root = "".concat(_NeonEnvironment.default.getFullApiPath('data'), "/").concat(productCodeDir, "/").concat(site, "/").concat(yearMonth);
  return "".concat(root, "?presign=false").concat(releaseParam);
};
exports.buildS3FilesRequestUrl = buildS3FilesRequestUrl;
const downloadManifest = manifest => {
  const form = document.createElement('form');
  form.style.display = 'none';
  form.action = _NeonEnvironment.default.getFullDownloadApiPath('downloadStream');
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
exports.downloadManifest = downloadManifest;
const downloadAopManifest = function (config, s3Files) {
  let documentation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'include';
  let provisionalData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'exclude';
  const siteCodes = [];
  const s3FileValues = s3Files.validValues;
  const manifestS3Files = s3FileValues.filter(file => s3Files.value.includes(file.url)).map(file => {
    if (!siteCodes.includes(file.site)) {
      siteCodes.push(file.site);
    }
    return {
      release: file.release,
      productCode: file.productCode,
      siteCode: file.site,
      month: file.yearMonth,
      packageType: 'basic',
      fileName: file.url.split('/').pop() || '',
      fileSizeBytes: file.size,
      checksum: file.checksum,
      checksumAlgorithm: file.checksumAlgorithm,
      uri: file.url
    };
  });
  const includeDocs = documentation === 'include';
  const includeProvisional = provisionalData === 'include';
  const productCodeParam = config.productCode.startsWith('NEON.DOM.SITE') ? config.productCode : "NEON.DOM.SITE.".concat(config.productCode);
  const manifestRequest = {
    dpCode: productCodeParam,
    startDateMonth: null,
    endDateMonth: null,
    release: config.release,
    pkgType: null,
    presign: true,
    manifestFiles: manifestS3Files,
    siteCodes,
    includeDocs,
    includeProvisional
  };
  return downloadManifest(manifestRequest);
};
exports.downloadAopManifest = downloadAopManifest;
const MAX_POST_BODY_SIZE = exports.MAX_POST_BODY_SIZE = 20 * (1024 * 1024); // 20MiB
const DOWNLOAD_SIZE_WARN = exports.DOWNLOAD_SIZE_WARN = 42949672960; // 40GB

const formatBytes = bytes => {
  if (!Number.isInteger(bytes) || bytes < 0) {
    return '0.000 B';
  }
  const scales = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const log = Math.log(bytes) / Math.log(1024);
  const scale = Math.floor(log);
  const precision = Math.floor(3 - (log - scale) * 3);
  return "".concat((bytes / 1024 ** scale).toFixed(precision), " ").concat(scales[scale]);
};
exports.formatBytes = formatBytes;
const getSizeEstimateFromManifestResponse = response => {
  if (typeof response !== 'object' || response === null || typeof response.data !== 'object' || response.data === null || !Array.isArray(response.data.manifestEntries) || !response.data.manifestEntries.length) {
    return 0;
  }
  return response.data.manifestEntries.reduce((total, entry) => total + (parseInt(entry.fileSizeBytes, 10) || 0), 0);
};
exports.getSizeEstimateFromManifestResponse = getSizeEstimateFromManifestResponse;
const getSizeEstimateFromManifestRollupResponse = response => {
  if (typeof response !== 'object' || response === null || typeof response.data !== 'object' || response.data === null || typeof response.data.totalBytes !== 'number' || response.data.totalBytes === null) {
    return 0;
  }
  return response.data.totalBytes;
};
exports.getSizeEstimateFromManifestRollupResponse = getSizeEstimateFromManifestRollupResponse;
var _default = exports.default = buildManifestRequestUrl;