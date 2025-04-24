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
  getUserAccountsPath: () => "".concat(_NeonEnvironment.default.getWebHost(), "/about/user-accounts"),
  getDataPoliciesPath: () => "".concat(_NeonEnvironment.default.getWebHost(), "/data/about-data/data-policies"),
  getDataPoliciesCitationPath: () => "".concat(_NeonEnvironment.default.getWebHost(), "/data-samples/data-policies-citation"),
  getDataQualityPath: () => "".concat(_NeonEnvironment.default.getWebHost(), "/data-samples/data-management/data-quality-program"),
  getNewsPath: () => "".concat(_NeonEnvironment.default.getWebHost(), "/impact/newsroom/neon-news"),
  getDataNotificationsPath: () => "".concat(_NeonEnvironment.default.getWebHost(), "/data-samples/data-notifications"),
  getFaqPath: () => "".concat(_NeonEnvironment.default.getWebHost(), "/about/faq"),
  getContactUsPath: () => "".concat(_NeonEnvironment.default.getWebHost(), "/about/contact-us"),
  getDownloadExplorePath: () => "".concat(_NeonEnvironment.default.getWebHost(), "/resources/learning-hub/tutorials/download-explore-neon-data"),
  getFileNamingConventionsPath: () => "".concat(_NeonEnvironment.default.getWebHost(), "/data-samples/data-management/data-formats-conventions"),
  getDataRevisionsReleasePath: () => "".concat(_NeonEnvironment.default.getWebHost(), "/data-samples/data-management/data-revisions-releases"),
  getDataSamplesPath: () => "".concat(_NeonEnvironment.default.getWebHost(), "/data-samples"),
  getSamplesPath: () => "".concat(_NeonEnvironment.default.getWebHost(), "/samples"),
  getDataSamplesDataPath: () => "".concat(_NeonEnvironment.default.getWebHost(), "/data-samples/data"),
  getDataAvailabilityPath: () => "".concat(_NeonEnvironment.default.getWebHost(), "/data-samples/data-management/data-availability"),
  getDataProductBundlesPath: () => "".concat(_NeonEnvironment.default.getWebHost(), "/data-samples/data-management/data-product-bundles"),
  getNeonUtilitiesDataStackRPath: () => "".concat(_NeonEnvironment.default.getWebHost(), "/resources/learning-hub/tutorials/neondatastackr"),
  getObservatoryStatusPath: () => "".concat(_NeonEnvironment.default.getWebHost(), "/impact/observatory-blog/observatory-status"),
  getThemeDetailPath: theme => "".concat(_NeonEnvironment.default.getWebHost(), "/data/data-themes/").concat(theme),
  getFieldSiteDetailPath: siteCode => "".concat(_NeonEnvironment.default.getWebHost(), "/field-sites/").concat(siteCode),
  getDomainDetailPath: domainCode => "".concat(_NeonEnvironment.default.getWebHost(), "/domains/").concat(domainCode),
  getReleaseDetailPath: release => "".concat(_NeonEnvironment.default.getWebHost(), "/data-samples/data-management/data-revisions-releases/").concat(release),
  getDataApiPath: () => "".concat(_NeonEnvironment.default.getApiHost(), "/data-api"),
  getTaxonomicListsPath: () => // TODO: replace with web host once switch over happens
  "".concat(_NeonEnvironment.default.getApiHost(), "/taxonomic-lists"),
  getDataProductCitationDownloadUrl: () =>
  // TODO: replace with web host once switch over happens
  _NeonEnvironment.default.getApiHost(),
  getDataProductExploreSearchPath: query => "".concat(RouteService.getDataProductExplorePath(), "?search=").concat(encodeURIComponent(query)),
  getDataProductExplorePath: () => // TODO: replace with web host once switch over happens
  "".concat(_NeonEnvironment.default.getApiHost(), "/data-products/explore"),
  getProductDetailPath: (productCode, release) => {
    const releasePath = (0, _typeUtil.isStringNonEmpty)(release) ? "/".concat(release) : '';
    // TODO: replace with web host once switch over happens
    return "".concat(_NeonEnvironment.default.getApiHost(), "/data-products/").concat(productCode).concat(releasePath);
  },
  getPrototypeDatasetsPath: () => // TODO: replace with web host once switch over happens
  "".concat(_NeonEnvironment.default.getApiHost(), "/prototype-datasets"),
  getPrototypeDatasetDetailPath: uuid => // TODO: replace with web host once switch over happens
  "".concat(_NeonEnvironment.default.getApiHost(), "/prototype-datasets/").concat(uuid)
};
Object.freeze(RouteService);
var _default = exports.default = RouteService;