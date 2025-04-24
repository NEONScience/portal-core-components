"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _dateformat = _interopRequireDefault(require("dateformat"));
var _RouteService = _interopRequireDefault(require("./RouteService"));
var _typeUtil = require("../util/typeUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const NEON = 'NEON (National Ecological Observatory Network)';
const CitationService = {
  getDateFormatted: () => {
    const now = new Date();
    return (0, _dateformat.default)(now, 'mmmm d, yyyy');
  },
  buildDataProductCitationText: (product, productReleaseObject) => {
    if (!(0, _typeUtil.exists)(product)) {
      return '';
    }
    const hasRelease = (0, _typeUtil.exists)(productReleaseObject) && (0, _typeUtil.isStringNonEmpty)(productReleaseObject.release);
    const hasDoi = hasRelease && (0, _typeUtil.exists)(productReleaseObject.productDoi) && (0, _typeUtil.isStringNonEmpty)(productReleaseObject.productDoi.url);
    const citationDoi = hasDoi ? productReleaseObject.productDoi.url : null;
    const today = CitationService.getDateFormatted();
    const productName = !hasRelease ? "".concat(product.productName, " (").concat(product.productCode, "), provisional data") : "".concat(product.productName, " (").concat(product.productCode, "), ") + "".concat(productReleaseObject.release);
    const doiText = citationDoi ? ". ".concat(citationDoi) : '';
    const url = _RouteService.default.getProductDetailPath(product.productCode, hasRelease ? productReleaseObject.release : undefined);
    const accessed = !hasRelease ? "Dataset accessed from ".concat(url, " on ").concat(today, ". Data archived at [your DOI].") : "Dataset accessed from ".concat(url, " on ").concat(today, ".");
    return "".concat(NEON, ". ").concat(productName).concat(doiText, ". ").concat(accessed);
  },
  buildPrototypeDatasetCitationText: dataset => {
    if (!dataset) {
      return '';
    }
    const {
      doi,
      projectTitle,
      uuid,
      version
    } = dataset;
    const hasDoi = doi && doi.url;
    const today = CitationService.getDateFormatted();
    const doiId = hasDoi ? doi.url.split('/').slice(-2).join('/') : uuid;
    const url = hasDoi ? "".concat(doi.url, ".") : "".concat(_RouteService.default.getPrototypeDatasetDetailPath(uuid));
    const accessed = 'Dataset accessed from ' + "".concat(_RouteService.default.getPrototypeDatasetDetailPath(uuid), " on ").concat(today, ".");
    const title = version ? "".concat(projectTitle, ", ").concat(version) : projectTitle;
    return "".concat(NEON, ". ").concat(title, " (").concat(doiId, "). ").concat(url, " ").concat(accessed);
  }
};
var _default = exports.default = CitationService;