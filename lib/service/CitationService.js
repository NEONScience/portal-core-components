"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _dateformat = _interopRequireDefault(require("dateformat"));
var _RouteService = _interopRequireDefault(require("./RouteService"));
var _typeUtil = require("../util/typeUtil");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var NEON = 'NEON (National Ecological Observatory Network)';
var CitationService = {
  getDateFormatted: function getDateFormatted() {
    var now = new Date();
    return (0, _dateformat.default)(now, 'mmmm d, yyyy');
  },
  buildDataProductCitationText: function buildDataProductCitationText(product, productReleaseObject) {
    if (!(0, _typeUtil.exists)(product)) {
      return '';
    }
    var hasRelease = (0, _typeUtil.exists)(productReleaseObject) && (0, _typeUtil.isStringNonEmpty)(productReleaseObject.release);
    var hasDoi = hasRelease && (0, _typeUtil.exists)(productReleaseObject.productDoi) && (0, _typeUtil.isStringNonEmpty)(productReleaseObject.productDoi.url);
    var citationDoi = hasDoi ? productReleaseObject.productDoi.url : null;
    var today = CitationService.getDateFormatted();
    var productName = !hasRelease ? "".concat(product.productName, " (").concat(product.productCode, ")") : "".concat(product.productName, " (").concat(product.productCode, "), ") + "".concat(productReleaseObject.release);
    var doiText = citationDoi ? ". ".concat(citationDoi) : '';
    var url = _RouteService.default.getDataProductCitationDownloadUrl();
    var accessed = !hasRelease ? "".concat(url, " (accessed ").concat(today, ")") : "Dataset accessed from ".concat(url, " on ").concat(today);
    return "".concat(NEON, ". ").concat(productName).concat(doiText, ". ").concat(accessed);
  },
  buildPrototypeDatasetCitationText: function buildPrototypeDatasetCitationText(dataset) {
    if (!dataset) {
      return '';
    }
    var doi = dataset.doi,
      projectTitle = dataset.projectTitle,
      uuid = dataset.uuid,
      version = dataset.version;
    var hasDoi = doi && doi.url;
    var today = CitationService.getDateFormatted();
    var doiId = hasDoi ? doi.url.split('/').slice(-2).join('/') : uuid;
    var url = hasDoi ? "".concat(doi.url, ".") : "".concat(_RouteService.default.getPrototypeDatasetDetailPath(uuid));
    var accessed = hasDoi ? "Dataset accessed from ".concat(_RouteService.default.getDataProductCitationDownloadUrl(), " on ").concat(today) : "(accessed ".concat(today, ")");
    var title = version ? "".concat(projectTitle, ", ").concat(version) : projectTitle;
    return "".concat(NEON, ". ").concat(title, " (").concat(doiId, "). ").concat(url, " ").concat(accessed);
  }
};
var _default = CitationService;
exports.default = _default;