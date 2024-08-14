"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _RouteService = _interopRequireDefault(require("./RouteService"));
var _typeUtil = require("../util/typeUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const NEON = 'NEON (National Ecological Observatory Network)';
const CitationService = {
  getDateFormatted: () => {
    const now = new Date();
    return (0, _moment.default)(now).format('MMMM D, YYYY');
  },
  buildDataProductCitationText: (product, productReleaseObject) => {
    if (!(0, _typeUtil.exists)(product)) {
      return '';
    }
    const hasRelease = (0, _typeUtil.exists)(productReleaseObject) && (0, _typeUtil.isStringNonEmpty)(productReleaseObject.release);
    const hasDoi = hasRelease && (0, _typeUtil.exists)(productReleaseObject.productDoi) && (0, _typeUtil.isStringNonEmpty)(productReleaseObject.productDoi.url);
    const citationDoi = hasDoi ? productReleaseObject.productDoi.url : null;
    const today = CitationService.getDateFormatted();
    const productName = !hasRelease ? `${product.productName} (${product.productCode}), provisional data` : `${product.productName} (${product.productCode}), ` + `${productReleaseObject.release}`;
    const doiText = citationDoi ? `. ${citationDoi}` : '';
    const url = _RouteService.default.getProductDetailPath(product.productCode, hasRelease ? productReleaseObject.release : undefined);
    const accessed = !hasRelease ? `Dataset accessed from ${url} on ${today}. Data archived at [your DOI].` : `Dataset accessed from ${url} on ${today}.`;
    return `${NEON}. ${productName}${doiText}. ${accessed}`;
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
    const url = hasDoi ? `${doi.url}.` : `${_RouteService.default.getPrototypeDatasetDetailPath(uuid)}`;
    const accessed = 'Dataset accessed from ' + `${_RouteService.default.getPrototypeDatasetDetailPath(uuid)} on ${today}.`;
    const title = version ? `${projectTitle}, ${version}` : projectTitle;
    return `${NEON}. ${title} (${doiId}). ${url} ${accessed}`;
  }
};
var _default = exports.default = CitationService;