"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _Link = _interopRequireDefault(require("@material-ui/core/Link"));
var _RouteService = _interopRequireDefault(require("../../service/RouteService"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var BundleContentBuilder = {
  getParentProductLink: function getParentProductLink(dataProduct, release) {
    return /*#__PURE__*/_react.default.createElement(_Link.default, {
      href: _RouteService.default.getProductDetailPath(dataProduct.productCode, release),
      target: "_blank"
    }, "".concat(dataProduct.productName, " (").concat(dataProduct.productCode, ")"));
  },
  buildManyParentsMainContent: function buildManyParentsMainContent(dataProducts) {
    return /*#__PURE__*/_react.default.createElement("ul", {
      style: {
        margin: _Theme.default.spacing(1, 0)
      }
    }, dataProducts.map(function (dataProduct) {
      return /*#__PURE__*/_react.default.createElement("li", {
        key: dataProduct.productCode
      }, BundleContentBuilder.getParentProductLink(dataProduct));
    }));
  },
  buildDefaultTitleContent: function buildDefaultTitleContent(dataProduct, release) {
    var bundleParentLink = BundleContentBuilder.getParentProductLink(dataProduct, release);
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "This data product is bundled into ", bundleParentLink);
  },
  buildDefaultSplitTitleContent: function buildDefaultSplitTitleContent(terminalChar) {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "This data product has been split and bundled into more than one parent data product", "".concat(terminalChar));
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