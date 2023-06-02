"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _debounce = _interopRequireDefault(require("lodash/debounce"));
var _typeUtil = require("../util/typeUtil");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var debouncedGaExploreSearchEvent = (0, _debounce.default)(function (searchTerm) {
  // @ts-ignore
  window.gtag('event', 'explore_data_products_search', {
    search_term: searchTerm
  });
}, 1000);
var debouncedGaPrototypeDataSearchEvent = (0, _debounce.default)(function (searchTerm) {
  // @ts-ignore
  window.gtag('event', 'prototype_data_search', {
    search_term: searchTerm
  });
}, 1000);
var _gaPortalHomeSearchEvent = function gaPortalHomeSearchEvent(searchTerm) {
  // @ts-ignore
  window.gtag('event', 'portal_home_search', {
    search_term: searchTerm
  });
};
var checkValid = function checkValid(searchTerm) {
  // @ts-ignore
  if (!(0, _typeUtil.exists)(window.gtmDataLayerGA4) || !(0, _typeUtil.exists)(window.gtag)) {
    return false;
  }
  if (!(0, _typeUtil.isStringNonEmpty)(searchTerm)) {
    return false;
  }
  return true;
};
var AnalyticsService = {
  gaExploreSearchEvent: function gaExploreSearchEvent(searchTerm) {
    if (!checkValid(searchTerm)) return;
    debouncedGaExploreSearchEvent(searchTerm);
  },
  gaPrototypeDataSearchEvent: function gaPrototypeDataSearchEvent(searchTerm) {
    if (!checkValid(searchTerm)) return;
    debouncedGaPrototypeDataSearchEvent(searchTerm);
  },
  gaPortalHomeSearchEvent: function gaPortalHomeSearchEvent(searchTerm) {
    if (!checkValid(searchTerm)) return;
    _gaPortalHomeSearchEvent(searchTerm);
  }
};
var _default = AnalyticsService;
exports.default = _default;