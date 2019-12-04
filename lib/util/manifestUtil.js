'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSizeEstimateFromManifestResponse = exports.formatBytes = exports.AOP_THRESHOLD_HARD_DRIVE_WARN = exports.AOP_THRESHOLD_POST_BODY_SIZE = exports.downloadAopManifest = exports.downloadManifest = exports.buildS3FilesRequestUrl = exports.buildManifestRequestUrl = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _NeonEnvironment = require('../components/NeonEnvironment/NeonEnvironment');

var _NeonEnvironment2 = _interopRequireDefault(_NeonEnvironment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var buildSiteCodesParams = function buildSiteCodesParams() {
  var sites = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var camelCase = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var param = camelCase ? 'siteCode' : 'sitecode';
  return sites.reduce(function (sitesString, siteCode, index) {
    return '' + sitesString + (index === 0 ? '' : '&') + param + '=' + siteCode;
  }, '');
};

var buildManifestRequestUrl = exports.buildManifestRequestUrl = function buildManifestRequestUrl(config) {
  var productCode = config.productCode,
      sites = config.sites,
      dateRange = config.dateRange,
      packageType = config.packageType,
      documentation = config.documentation;

  var siteCodesParam = buildSiteCodesParams(sites);
  var productCodeParam = productCode.startsWith('NEON.DOM.SITE') ? productCode : 'NEON.DOM.SITE.' + productCode;
  var params = ['dpcode=' + productCodeParam, 'startdate=' + dateRange[0], 'enddate=' + dateRange[1], 'pkgtype=' + packageType, 'includedocs=' + (documentation ? 'true' : 'false'), siteCodesParam];
  return _NeonEnvironment2.default.getFullApiPath('manifest') + '/datasetDownload?' + params.join('&');
};

var buildS3FilesRequestUrl = exports.buildS3FilesRequestUrl = function buildS3FilesRequestUrl(productCode, site, yearMonth) {
  var productCodeDir = productCode.startsWith('NEON.DOM.SITE') ? productCode : 'NEON.DOM.SITE.' + productCode;
  return _NeonEnvironment2.default.getFullApiPath('data') + '/' + productCodeDir + '/' + site + '/' + yearMonth + '?presign=false';
};

var downloadManifest = exports.downloadManifest = function downloadManifest() {
  var manifest = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var form = document.createElement("form");
  form.style.display = "none";
  form.action = _NeonEnvironment2.default.getFullApiPath('download') + '/dpDownload';
  form.method = "POST";

  var input = document.createElement("input");
  input.name = "manifest";
  input.value = JSON.stringify(manifest);
  form.appendChild(input);

  document.body.appendChild(form);
  var submit = form.submit();
  document.body.removeChild(form);

  return submit;
};

var downloadAopManifest = exports.downloadAopManifest = function downloadAopManifest(productData, s3Files) {
  var documentation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'include';
  var productCode = productData.productCode,
      productName = productData.productName;

  var zipFileName = (productName || '').toLowerCase().replace(/\W/g, '-') || productCode.replace(/\W/g, '-');

  var manifestS3Files = s3Files.value.map(function (id) {
    return {
      path: s3Files.urlsById[id],
      fileName: s3Files.urlsById[id].split('/').pop() || '',
      presign: true
    };
  });

  var manifestDocumentationFiles = documentation === 'include' ? (productData.specs || []).map(function (spec) {
    return {
      fileName: spec.specNumber + '.pdf',
      path: _NeonEnvironment2.default.getFullApiPath('documents') + '/' + spec.specNumber,
      presign: false
    };
  }) : [];

  var manifest = {
    mimeType: 'application/zip',
    zipFileName: 'NEON_' + zipFileName,
    manifestEntries: [].concat(_toConsumableArray(manifestS3Files), _toConsumableArray(manifestDocumentationFiles))
  };

  return downloadManifest(manifest);
};

var AOP_THRESHOLD_POST_BODY_SIZE = exports.AOP_THRESHOLD_POST_BODY_SIZE = 2097152; // 2MB
var AOP_THRESHOLD_HARD_DRIVE_WARN = exports.AOP_THRESHOLD_HARD_DRIVE_WARN = 42949672960; // 40GB

var formatBytes = exports.formatBytes = function formatBytes(bytes) {
  if (!Number.isInteger(bytes) || bytes < 0) {
    return '0.000 B';
  }
  var scales = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  var log = Math.log(bytes) / Math.log(1024);
  var scale = Math.floor(log);
  var precision = Math.floor(3 - (log - scale) * 3);
  return (bytes / Math.pow(1024, scale)).toFixed(precision) + ' ' + scales[scale];
};

var getSizeEstimateFromManifestResponse = exports.getSizeEstimateFromManifestResponse = function getSizeEstimateFromManifestResponse(response) {
  if ((typeof response === 'undefined' ? 'undefined' : _typeof(response)) !== 'object' || response === null || !Array.isArray(response.manifestEntries) || !response.manifestEntries.length) {
    return 0;
  }
  return response.manifestEntries.reduce(function (total, entry) {
    return total + (parseInt(entry.fileSizeBytes, 10) || 0);
  }, 0);
};

exports.default = buildManifestRequestUrl;