"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var DataProductBundleService = {
  isProductDefined: function isProductDefined(context, productCode) {
    return context.allBundleProducts[productCode] === true;
  }
};
Object.freeze(DataProductBundleService);
var _default = DataProductBundleService;
exports.default = _default;