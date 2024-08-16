"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _Link = _interopRequireDefault(require("@mui/material/Link"));
var _RouteService = _interopRequireDefault(require("../../service/RouteService"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _typeUtil = require("../../util/typeUtil");
var _ReleaseService = require("../../service/ReleaseService");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const BundleContentBuilder = {
  getParentProductLink: (dataProduct, release) => {
    const isRelease = (0, _typeUtil.isStringNonEmpty)(release) && release !== _ReleaseService.LATEST_AND_PROVISIONAL;
    const href = _RouteService.default.getProductDetailPath(dataProduct.productCode, isRelease ? release : undefined);
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Link.default, {
      href: href,
      target: "_blank",
      children: `${dataProduct.productName} (${dataProduct.productCode})`
    });
  },
  getBundledLink: () => {
    const href = _RouteService.default.getDataProductBundlesPath();
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Link.default, {
      href: href,
      target: "_blank",
      children: "bundled"
    });
  },
  buildManyParentsMainContent: (dataProducts, release) => /*#__PURE__*/(0, _jsxRuntime.jsx)("ul", {
    style: {
      margin: _Theme.default.spacing(1, 0)
    },
    children: dataProducts.map(dataProduct => /*#__PURE__*/(0, _jsxRuntime.jsx)("li", {
      children: BundleContentBuilder.getParentProductLink(dataProduct, release)
    }, dataProduct.productCode))
  }),
  buildDefaultTitleContent: (dataProduct, release) => {
    const isRelease = (0, _typeUtil.isStringNonEmpty)(release) && release !== _ReleaseService.LATEST_AND_PROVISIONAL;
    const bundleParentLink = BundleContentBuilder.getParentProductLink(dataProduct, isRelease ? release : undefined);
    const bundledLink = BundleContentBuilder.getBundledLink();
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: ["This data product ", isRelease ? 'release ' : '', "is ", bundledLink, " into ", bundleParentLink]
    });
  },
  buildDefaultSplitTitleContent: (isRelease, terminalChar) => {
    const bundledLink = BundleContentBuilder.getBundledLink();
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: ["This data product ", isRelease ? 'release ' : '', "is ", bundledLink, " into the following data product", isRelease ? ' releases' : 's', `${terminalChar}`]
    });
  },
  buildDefaultSubTitleContent: (forwardAvailability, hasManyParents) =>
  /*#__PURE__*/
  // eslint-disable-next-line react/jsx-no-useless-fragment
  (0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
    children: forwardAvailability ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
      children: "It is not available as a standalone download. Data availability shown below reflects availability of the entire bundle."
    }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: ["It is not available as a standalone download. Data availability information and data product download is only available through the bundle data ", hasManyParents ? 'products' : 'product', "."]
    })
  })
};
Object.freeze(BundleContentBuilder);
var _default = exports.default = BundleContentBuilder;