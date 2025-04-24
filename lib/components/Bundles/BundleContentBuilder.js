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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const BundleContentBuilder = {
  getParentProductLink: (dataProduct, release) => {
    const isRelease = (0, _typeUtil.isStringNonEmpty)(release) && release !== _ReleaseService.LATEST_AND_PROVISIONAL;
    const href = _RouteService.default.getProductDetailPath(dataProduct.productCode, isRelease ? release : undefined);
    return /*#__PURE__*/_react.default.createElement(_Link.default, {
      href: href,
      target: "_blank"
    }, "".concat(dataProduct.productName, " (").concat(dataProduct.productCode, ")"));
  },
  getBundledLink: () => {
    const href = _RouteService.default.getDataProductBundlesPath();
    return /*#__PURE__*/_react.default.createElement(_Link.default, {
      href: href,
      target: "_blank"
    }, "bundled");
  },
  buildManyParentsMainContent: (dataProducts, release) => /*#__PURE__*/_react.default.createElement("ul", {
    style: {
      margin: _Theme.default.spacing(1, 0)
    }
  }, dataProducts.map(dataProduct => /*#__PURE__*/_react.default.createElement("li", {
    key: dataProduct.productCode
  }, BundleContentBuilder.getParentProductLink(dataProduct, release)))),
  buildDefaultTitleContent: (dataProduct, release) => {
    const isRelease = (0, _typeUtil.isStringNonEmpty)(release) && release !== _ReleaseService.LATEST_AND_PROVISIONAL;
    const bundleParentLink = BundleContentBuilder.getParentProductLink(dataProduct, isRelease ? release : undefined);
    const bundledLink = BundleContentBuilder.getBundledLink();
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "This data product ", isRelease ? 'release ' : '', "is ", bundledLink, " into ", bundleParentLink);
  },
  buildDefaultSplitTitleContent: (isRelease, terminalChar) => {
    const bundledLink = BundleContentBuilder.getBundledLink();
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "This data product ", isRelease ? 'release ' : '', "is ", bundledLink, " into the following data product", isRelease ? ' releases' : 's', "".concat(terminalChar));
  },
  buildDefaultSubTitleContent: (forwardAvailability, hasManyParents) =>
  /*#__PURE__*/
  // eslint-disable-next-line react/jsx-no-useless-fragment
  _react.default.createElement(_react.default.Fragment, null, forwardAvailability ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "It is not available as a standalone download. Data availability shown below reflects availability of the entire bundle.") : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "It is not available as a standalone download. Data availability information and data product download is only available through the bundle data ", hasManyParents ? 'products' : 'product', "."))
};
Object.freeze(BundleContentBuilder);
var _default = exports.default = BundleContentBuilder;