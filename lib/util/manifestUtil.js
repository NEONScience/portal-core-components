"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getSizeEstimateFromManifestResponse = exports.formatBytes = exports.DOWNLOAD_SIZE_WARN = exports.MAX_POST_BODY_SIZE = exports.downloadAopManifest = exports.downloadManifest = exports.buildS3FilesRequestUrl = exports.buildManifestRequestUrl = void 0;

var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment/NeonEnvironment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var buildSiteCodesParams = function buildSiteCodesParams() {
  var sites = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var camelCase = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var param = camelCase ? 'siteCode' : 'sitecode';
  return sites.reduce(function (sitesString, siteCode, index) {
    return "".concat(sitesString).concat(index === 0 ? '' : '&').concat(param, "=").concat(siteCode);
  }, '');
};

var buildManifestRequestUrl = function buildManifestRequestUrl(config) {
  var productCode = config.productCode,
      sites = config.sites,
      dateRange = config.dateRange,
      packageType = config.packageType,
      documentation = config.documentation;
  var siteCodesParam = buildSiteCodesParams(sites);
  var productCodeParam = productCode.startsWith('NEON.DOM.SITE') ? productCode : "NEON.DOM.SITE.".concat(productCode);
  var params = ["dpcode=".concat(productCodeParam), "startdate=".concat(dateRange[0]), "enddate=".concat(dateRange[1]), "pkgtype=".concat(packageType), "includedocs=".concat(documentation ? 'true' : 'false'), siteCodesParam];
  return "".concat(_NeonEnvironment.default.getFullApiPath('manifest'), "/datasetDownload?").concat(params.join('&'));
};

exports.buildManifestRequestUrl = buildManifestRequestUrl;

var buildS3FilesRequestUrl = function buildS3FilesRequestUrl(productCode, site, yearMonth) {
  var productCodeDir = productCode.startsWith('NEON.DOM.SITE') ? productCode : "NEON.DOM.SITE.".concat(productCode);
  return "".concat(_NeonEnvironment.default.getFullApiPath('data'), "/").concat(productCodeDir, "/").concat(site, "/").concat(yearMonth, "?presign=false");
};

exports.buildS3FilesRequestUrl = buildS3FilesRequestUrl;

var downloadManifest = function downloadManifest() {
  var manifest = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var form = document.createElement('form');
  form.style.display = 'none';
  form.action = "".concat(_NeonEnvironment.default.getFullApiPath('download'), "/dpDownload");
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

var downloadAopManifest = function downloadAopManifest(productData, s3Files) {
  var documentation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'include';
  var productCode = productData.productCode,
      productName = productData.productName;
  var zipFileName = (productName || '').toLowerCase().replace(/\W/g, '-') || productCode.replace(/\W/g, '-');
  var manifestS3Files = s3Files.value.map(function (url) {
    return {
      path: url,
      fileName: url.split('/').pop() || '',
      presign: true
    };
  });
  var manifestDocumentationFiles = documentation === 'include' ? (productData.specs || []).map(function (spec) {
    return {
      fileName: "".concat(spec.specNumber, ".pdf"),
      path: "".concat(_NeonEnvironment.default.getFullApiPath('documents'), "/").concat(spec.specNumber),
      presign: false
    };
  }) : [];
  var manifest = {
    mimeType: 'application/zip',
    zipFileName: "NEON_".concat(zipFileName),
    manifestEntries: [].concat(_toConsumableArray(manifestS3Files), _toConsumableArray(manifestDocumentationFiles))
  };
  return downloadManifest(manifest);
};

exports.downloadAopManifest = downloadAopManifest;
var MAX_POST_BODY_SIZE = 2097152; // 2MB

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
  if (_typeof(response) !== 'object' || response === null || !Array.isArray(response.manifestEntries) || !response.manifestEntries.length) {
    return 0;
  }

  return response.manifestEntries.reduce(function (total, entry) {
    return total + (parseInt(entry.fileSizeBytes, 10) || 0);
  }, 0);
};

exports.getSizeEstimateFromManifestResponse = getSizeEstimateFromManifestResponse;
var _default = buildManifestRequestUrl;
exports.default = _default;