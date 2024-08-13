"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment/NeonEnvironment"));
var _typeUtil = require("../util/typeUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Service for building routes and paths
 */

const RouteService = {
  getWebHomePath: () => _NeonEnvironment.default.getWebHost(),
  getUserAccountsPath: () => `${_NeonEnvironment.default.getWebHost()}/about/user-accounts`,
  getDataPoliciesPath: () => `${_NeonEnvironment.default.getWebHost()}/data/about-data/data-policies`,
  getDataPoliciesCitationPath: () => `${_NeonEnvironment.default.getWebHost()}/data-samples/data-policies-citation`,
  getDataQualityPath: () => `${_NeonEnvironment.default.getWebHost()}/data-samples/data-management/data-quality-program`,
  getNewsPath: () => `${_NeonEnvironment.default.getWebHost()}/impact/newsroom/neon-news`,
  getDataNotificationsPath: () => `${_NeonEnvironment.default.getWebHost()}/data-samples/data-notifications`,
  getFaqPath: () => `${_NeonEnvironment.default.getWebHost()}/about/faq`,
  getContactUsPath: () => `${_NeonEnvironment.default.getWebHost()}/about/contact-us`,
  getDownloadExplorePath: () => `${_NeonEnvironment.default.getWebHost()}/resources/learning-hub/tutorials/download-explore-neon-data`,
  getFileNamingConventionsPath: () => `${_NeonEnvironment.default.getWebHost()}/data-samples/data-management/data-formats-conventions`,
  getDataRevisionsReleasePath: () => `${_NeonEnvironment.default.getWebHost()}/data-samples/data-management/data-revisions-releases`,
  getDataSamplesPath: () => `${_NeonEnvironment.default.getWebHost()}/data-samples`,
  getSamplesPath: () => `${_NeonEnvironment.default.getWebHost()}/samples`,
  getDataSamplesDataPath: () => `${_NeonEnvironment.default.getWebHost()}/data-samples/data`,
  getDataAvailabilityPath: () => `${_NeonEnvironment.default.getWebHost()}/data-samples/data-management/data-availability`,
  getDataProductBundlesPath: () => `${_NeonEnvironment.default.getWebHost()}/data-samples/data-management/data-product-bundles`,
  getNeonUtilitiesDataStackRPath: () => `${_NeonEnvironment.default.getWebHost()}/resources/learning-hub/tutorials/neondatastackr`,
  getObservatoryStatusPath: () => `${_NeonEnvironment.default.getWebHost()}/impact/observatory-blog/observatory-status`,
  getThemeDetailPath: theme => `${_NeonEnvironment.default.getWebHost()}/data/data-themes/${theme}`,
  getFieldSiteDetailPath: siteCode => `${_NeonEnvironment.default.getWebHost()}/field-sites/${siteCode}`,
  getDomainDetailPath: domainCode => `${_NeonEnvironment.default.getWebHost()}/domains/${domainCode}`,
  getReleaseDetailPath: release => `${_NeonEnvironment.default.getWebHost()}/data-samples/data-management/data-revisions-releases/${release}`,
  getDataApiPath: () => `${_NeonEnvironment.default.getApiHost()}/data-api`,
  getTaxonomicListsPath: () =>
  // TODO: replace with web host once switch over happens
  `${_NeonEnvironment.default.getApiHost()}/taxonomic-lists`,
  getDataProductCitationDownloadUrl: () =>
  // TODO: replace with web host once switch over happens
  _NeonEnvironment.default.getApiHost(),
  getDataProductExploreSearchPath: query => `${RouteService.getDataProductExplorePath()}?search=${encodeURIComponent(query)}`,
  getDataProductExplorePath: () =>
  // TODO: replace with web host once switch over happens
  `${_NeonEnvironment.default.getApiHost()}/data-products/explore`,
  getProductDetailPath: (productCode, release) => {
    const releasePath = (0, _typeUtil.isStringNonEmpty)(release) ? `/${release}` : '';
    // TODO: replace with web host once switch over happens
    return `${_NeonEnvironment.default.getApiHost()}/data-products/${productCode}${releasePath}`;
  },
  getPrototypeDatasetsPath: () =>
  // TODO: replace with web host once switch over happens
  `${_NeonEnvironment.default.getApiHost()}/prototype-datasets`,
  getPrototypeDatasetDetailPath: uuid =>
  // TODO: replace with web host once switch over happens
  `${_NeonEnvironment.default.getApiHost()}/prototype-datasets/${uuid}`
};
Object.freeze(RouteService);
var _default = exports.default = RouteService;