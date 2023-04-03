"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _Link = _interopRequireDefault(require("@material-ui/core/Link"));
var _RouteService = _interopRequireDefault(require("../../service/RouteService"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _typeUtil = require("../../util/typeUtil");
var _ReleaseService = require("../../service/ReleaseService");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var BundleContentBuilder = {
  getParentProductLink: function getParentProductLink(dataProduct, release) {
    var isRelease = (0, _typeUtil.isStringNonEmpty)(release) && release !== _ReleaseService.LATEST_AND_PROVISIONAL;
    var href = _RouteService.default.getProductDetailPath(dataProduct.productCode, isRelease ? release : undefined);
    return /*#__PURE__*/_react.default.createElement(_Link.default, {
      href: href,
      target: "_blank"
    }, "".concat(dataProduct.productName, " (").concat(dataProduct.productCode, ")"));
  },
  getBundledLink: function getBundledLink() {
    var href = _RouteService.default.getDataProductBundlesPath();
    return /*#__PURE__*/_react.default.createElement(_Link.default, {
      href: href,
      target: "_blank"
    }, "bundled");
  },
  buildManyParentsMainContent: function buildManyParentsMainContent(dataProducts, release) {
    return /*#__PURE__*/_react.default.createElement("ul", {
      style: {
        margin: _Theme.default.spacing(1, 0)
      }
    }, dataProducts.map(function (dataProduct) {
      return /*#__PURE__*/_react.default.createElement("li", {
        key: dataProduct.productCode
      }, BundleContentBuilder.getParentProductLink(dataProduct, release));
    }));
  },
  buildDefaultTitleContent: function buildDefaultTitleContent(dataProduct, release) {
    var isRelease = (0, _typeUtil.isStringNonEmpty)(release) && release !== _ReleaseService.LATEST_AND_PROVISIONAL;
    var bundleParentLink = BundleContentBuilder.getParentProductLink(dataProduct, isRelease ? release : undefined);
    var bundledLink = BundleContentBuilder.getBundledLink();
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "This data product ", isRelease ? 'release ' : '', "is ", bundledLink, " into ", bundleParentLink);
  },
  buildDefaultSplitTitleContent: function buildDefaultSplitTitleContent(isRelease, terminalChar) {
    var bundledLink = BundleContentBuilder.getBundledLink();
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "This data product ", isRelease ? 'release ' : '', "is ", bundledLink, " into the following data product", isRelease ? ' releases' : 's', "".concat(terminalChar));
  },
  buildDefaultSubTitleContent: function buildDefaultSubTitleContent(forwardAvailability, hasManyParents) {
    return (
      /*#__PURE__*/
      // eslint-disable-next-line react/jsx-no-useless-fragment
      _react.default.createElement(_react.default.Fragment, null, forwardAvailability ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "It is not available as a standalone download. Data availability shown below reflects availability of the entire bundle.") : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "It is not available as a standalone download. Data availability information and data product download is only available through the parent ", hasManyParents ? 'products' : 'product', "."))
    );
  }
};
Object.freeze(BundleContentBuilder);
var _default = BundleContentBuilder;
exports.default = _default;