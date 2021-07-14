"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment/NeonEnvironment"));

var _typeUtil = require("../util/typeUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RouteService = {
  getWebHomePath: function getWebHomePath() {
    return _NeonEnvironment.default.getWebHost();
  },
  getUserAccountsPath: function getUserAccountsPath() {
    return "".concat(_NeonEnvironment.default.getWebHost(), "/about/user-accounts");
  },
  getDataPoliciesPath: function getDataPoliciesPath() {
    return "".concat(_NeonEnvironment.default.getWebHost(), "/data/about-data/data-policies");
  },
  getDataPoliciesCitationPath: function getDataPoliciesCitationPath() {
    return "".concat(_NeonEnvironment.default.getWebHost(), "/data-samples/data-policies-citation");
  },
  getDataQualityPath: function getDataQualityPath() {
    return "".concat(_NeonEnvironment.default.getWebHost(), "/data-samples/data-management/data-quality-program");
  },
  getNewsPath: function getNewsPath() {
    return "".concat(_NeonEnvironment.default.getWebHost(), "/impact/newsroom/neon-news");
  },
  getDataNotificationsPath: function getDataNotificationsPath() {
    return "".concat(_NeonEnvironment.default.getWebHost(), "/data-samples/data-notifications");
  },
  getFaqPath: function getFaqPath() {
    return "".concat(_NeonEnvironment.default.getWebHost(), "/about/faq");
  },
  getDownloadExplorePath: function getDownloadExplorePath() {
    return "".concat(_NeonEnvironment.default.getWebHost(), "/download-explore-neon-data");
  },
  getFileNamingConventionsPath: function getFileNamingConventionsPath() {
    return "".concat(_NeonEnvironment.default.getWebHost(), "/data-samples/data-management/data-formats-conventions");
  },
  getDataRevisionsReleasePath: function getDataRevisionsReleasePath() {
    return "".concat(_NeonEnvironment.default.getWebHost(), "/data-samples/data-management/data-revisions-releases");
  },
  getDataSamplesPath: function getDataSamplesPath() {
    return "".concat(_NeonEnvironment.default.getWebHost(), "/data-samples");
  },
  getSamplesPath: function getSamplesPath() {
    return "".concat(_NeonEnvironment.default.getWebHost(), "/samples");
  },
  getDataSamplesDataPath: function getDataSamplesDataPath() {
    return "".concat(_NeonEnvironment.default.getWebHost(), "/data-samples/data");
  },
  getDataAvailabilityPath: function getDataAvailabilityPath() {
    return "".concat(_NeonEnvironment.default.getWebHost(), "/data-samples/data-management/data-availability");
  },
  getNeonUtilitiesDataStackRPath: function getNeonUtilitiesDataStackRPath() {
    return "".concat(_NeonEnvironment.default.getWebHost(), "/resources/learning-hub/tutorials/neondatastackr");
  },
  getThemeDetailPath: function getThemeDetailPath(theme) {
    return "".concat(_NeonEnvironment.default.getWebHost(), "/data/data-themes/").concat(theme);
  },
  getFieldSiteDetailPath: function getFieldSiteDetailPath(siteCode) {
    return "".concat(_NeonEnvironment.default.getWebHost(), "/field-sites/").concat(siteCode);
  },
  getDomainDetailPath: function getDomainDetailPath(domainCode) {
    return "".concat(_NeonEnvironment.default.getWebHost(), "/domains/").concat(domainCode);
  },
  getReleaseDetailPath: function getReleaseDetailPath(release) {
    return "".concat(_NeonEnvironment.default.getWebHost(), "/data-samples/data-management/data-revisions-releases/").concat(release);
  },
  getDataProductCitationDownloadUrl: function getDataProductCitationDownloadUrl() {
    return (// TODO: replace with web host once switch over happens
      _NeonEnvironment.default.getApiHost()
    );
  },
  getDataApiPath: function getDataApiPath() {
    return "".concat(_NeonEnvironment.default.getApiHost(), "/data-api");
  },
  getDataProductExploreSearchPath: function getDataProductExploreSearchPath(query) {
    return (// TODO: replace with web host once switch over happens
      "".concat(RouteService.getDataProductExplorePath(), "?search=").concat(encodeURIComponent(query))
    );
  },
  getDataProductExplorePath: function getDataProductExplorePath() {
    return (// TODO: replace with web host once switch over happens
      "".concat(_NeonEnvironment.default.getApiHost(), "/data-products/explore")
    );
  },
  getProductDetailPath: function getProductDetailPath(productCode, release) {
    var releasePath = (0, _typeUtil.isStringNonEmpty)(release) ? "/".concat(release) : ''; // TODO: replace with web host once switch over happens

    return "".concat(_NeonEnvironment.default.getApiHost(), "/data-products/").concat(productCode).concat(releasePath);
  },
  getPrototypeDatasetsPath: function getPrototypeDatasetsPath() {
    return "".concat(_NeonEnvironment.default.getApiHost(), "/prototype-datasets");
  },
  getPrototypeDatasetDetailPath: function getPrototypeDatasetDetailPath(uuid) {
    return (// TODO: replace with web host once switch over happens
      "".concat(_NeonEnvironment.default.getApiHost(), "/prototype-datasets/").concat(uuid)
    );
  }
};
Object.freeze(RouteService);
var _default = RouteService;
exports.default = _default;