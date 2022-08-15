"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSizeEstimateFromManifestRollupResponse = exports.getSizeEstimateFromManifestResponse = exports.formatBytes = exports.downloadManifest = exports.downloadAopManifest = exports.default = exports.buildSiteCodesParams = exports.buildS3FilesRequestUrl = exports.buildManifestRequestUrl = exports.buildManifestRequestBody = exports.buildManifestConfig = exports.MAX_POST_BODY_SIZE = exports.DOWNLOAD_SIZE_WARN = void 0;

var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment/NeonEnvironment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

// Build an object from state suitable for manifestUtil.buildManifestRequestUrl()
var buildManifestConfig = function buildManifestConfig(selection) {
  var defaultPackageType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'basic';
  var isAop = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var config = {
    productCode: '',
    release: '',
    sites: [],
    dateRange: [],
    documentation: false,
    packageType: '',
    isError: true
  };
  var manifestConfigError = null;

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
  return config;
}; // eslint-disable-next-line no-array-constructor


exports.buildManifestConfig = buildManifestConfig;

var buildSiteCodesParams = function buildSiteCodesParams() {
  var sites = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Array();
  var camelCase = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var param = camelCase ? 'siteCode' : 'sitecode';
  return sites.reduce(function (sitesString, siteCode, index) {
    return "".concat(sitesString).concat(index === 0 ? '' : '&').concat(param, "=").concat(siteCode);
  }, '');
};

exports.buildSiteCodesParams = buildSiteCodesParams;

var buildManifestRequestUrl = function buildManifestRequestUrl(config) {
  var useBody = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var productCode = config.productCode,
      sites = config.sites,
      dateRange = config.dateRange,
      packageType = config.packageType,
      documentation = config.documentation;

  var url = _NeonEnvironment.default.getFullDownloadApiPath('manifestRollup');

  if (!useBody) {
    var siteCodesParam = buildSiteCodesParams(sites);
    var productCodeParam = productCode.startsWith('NEON.DOM.SITE') ? productCode : "NEON.DOM.SITE.".concat(productCode);
    var params = ["dpcode=".concat(productCodeParam), "startdate=".concat(dateRange[0]), "enddate=".concat(dateRange[1]), "pkgtype=".concat(packageType), "includedocs=".concat(documentation ? 'true' : 'false'), siteCodesParam];
    url = "".concat(url, "?").concat(params.join('&'));
  }

  return url;
};

exports.buildManifestRequestUrl = buildManifestRequestUrl;

var buildManifestRequestBody = function buildManifestRequestBody(config) {
  var productCode = config.productCode,
      release = config.release,
      sites = config.sites,
      dateRange = config.dateRange,
      packageType = config.packageType,
      documentation = config.documentation;
  var productCodeParam = productCode.startsWith('NEON.DOM.SITE') ? productCode : "NEON.DOM.SITE.".concat(productCode);
  return {
    dpCode: productCodeParam,
    siteCodes: sites,
    startDateMonth: dateRange[0],
    endDateMonth: dateRange[1],
    release: release,
    pkgType: packageType,
    includeDocs: documentation,
    presign: true
  };
};

exports.buildManifestRequestBody = buildManifestRequestBody;

var buildS3FilesRequestUrl = function buildS3FilesRequestUrl(productCode, site, yearMonth, release) {
  var productCodeDir = productCode.startsWith('NEON.DOM.SITE') ? productCode : "NEON.DOM.SITE.".concat(productCode);
  var releaseParam = typeof release === 'string' && release.length > 0 ? "&release=".concat(release) : '';
  var root = "".concat(_NeonEnvironment.default.getFullApiPath('data'), "/").concat(productCodeDir, "/").concat(site, "/").concat(yearMonth);
  return "".concat(root, "?presign=false").concat(releaseParam);
};

exports.buildS3FilesRequestUrl = buildS3FilesRequestUrl;

var downloadManifest = function downloadManifest(manifest) {
  var form = document.createElement('form');
  form.style.display = 'none';
  form.action = _NeonEnvironment.default.getFullDownloadApiPath('downloadStream');
  form.method = 'POST';
  var input = document.createElement('input');
  input.name = 'manifest';
  input.value = JSON.stringify(manifest);
  form.appendChild(input);
  document.body.appendChild(form);
  var submit = form.submit();
  document.body.removeChild(form);
  return submit;
};

exports.downloadManifest = downloadManifest;

var downloadAopManifest = function downloadAopManifest(config, s3Files) {
  var documentation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'include';
  var siteCodes = [];
  var s3FileValues = s3Files.validValues;
  var manifestS3Files = s3FileValues.filter(function (file) {
    return s3Files.value.includes(file.url);
  }).map(function (file) {
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
  var includeDocs = documentation === 'include';
  var productCodeParam = config.productCode.startsWith('NEON.DOM.SITE') ? config.productCode : "NEON.DOM.SITE.".concat(config.productCode);
  var manifestRequest = {
    dpCode: productCodeParam,
    startDateMonth: null,
    endDateMonth: null,
    release: config.release,
    pkgType: null,
    presign: true,
    manifestFiles: manifestS3Files,
    siteCodes: siteCodes,
    includeDocs: includeDocs
  };
  return downloadManifest(manifestRequest);
};

exports.downloadAopManifest = downloadAopManifest;
var MAX_POST_BODY_SIZE = 20 * (1024 * 1024); // 20MiB

exports.MAX_POST_BODY_SIZE = MAX_POST_BODY_SIZE;
var DOWNLOAD_SIZE_WARN = 42949672960; // 40GB

exports.DOWNLOAD_SIZE_WARN = DOWNLOAD_SIZE_WARN;

var formatBytes = function formatBytes(bytes) {
  if (!Number.isInteger(bytes) || bytes < 0) {
    return '0.000 B';
  }

  var scales = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  var log = Math.log(bytes) / Math.log(1024);
  var scale = Math.floor(log);
  var precision = Math.floor(3 - (log - scale) * 3);
  return "".concat((bytes / Math.pow(1024, scale)).toFixed(precision), " ").concat(scales[scale]);
};

exports.formatBytes = formatBytes;

var getSizeEstimateFromManifestResponse = function getSizeEstimateFromManifestResponse(response) {
  if (_typeof(response) !== 'object' || response === null || _typeof(response.data) !== 'object' || response.data === null || !Array.isArray(response.data.manifestEntries) || !response.data.manifestEntries.length) {
    return 0;
  }

  return response.data.manifestEntries.reduce(function (total, entry) {
    return total + (parseInt(entry.fileSizeBytes, 10) || 0);
  }, 0);
};

exports.getSizeEstimateFromManifestResponse = getSizeEstimateFromManifestResponse;

var getSizeEstimateFromManifestRollupResponse = function getSizeEstimateFromManifestRollupResponse(response) {
  if (_typeof(response) !== 'object' || response === null || _typeof(response.data) !== 'object' || response.data === null || typeof response.data.totalBytes !== 'number' || response.data.totalBytes === null) {
    return 0;
  }

  return response.data.totalBytes;
};

exports.getSizeEstimateFromManifestRollupResponse = getSizeEstimateFromManifestRollupResponse;
var _default = buildManifestRequestUrl;
exports.default = _default;