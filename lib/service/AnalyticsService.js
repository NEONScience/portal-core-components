"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _debounce = _interopRequireDefault(require("lodash/debounce"));
var _typeUtil = require("../util/typeUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const debouncedGaExploreSearchEvent = (0, _debounce.default)(searchTerm => {
  // @ts-ignore
  window.gtmDataLayer.push({
    event: 'explore_data_products_search',
    search_term: searchTerm
  });
}, 1000);
const debouncedGaPrototypeDataSearchEvent = (0, _debounce.default)(searchTerm => {
  // @ts-ignore
  window.gtmDataLayer.push({
    event: 'prototype_data_search',
    search_term: searchTerm
  });
}, 1000);
const gaPortalHomeSearchEvent = searchTerm => {
  // @ts-ignore
  window.gtmDataLayer.push({
    event: 'portal_home_search',
    search_term: searchTerm
  });
};
const checkValid = searchTerm => {
  // @ts-ignore
  if (!(0, _typeUtil.exists)(window.gtmDataLayer)) {
    return false;
  }
  if (!(0, _typeUtil.isStringNonEmpty)(searchTerm)) {
    return false;
  }
  return true;
};
const AnalyticsService = {
  gaExploreSearchEvent: searchTerm => {
    if (!checkValid(searchTerm)) return;
    debouncedGaExploreSearchEvent(searchTerm);
  },
  gaPrototypeDataSearchEvent: searchTerm => {
    if (!checkValid(searchTerm)) return;
    debouncedGaPrototypeDataSearchEvent(searchTerm);
  },
  gaPortalHomeSearchEvent: searchTerm => {
    if (!checkValid(searchTerm)) return;
    gaPortalHomeSearchEvent(searchTerm);
  }
};
var _default = exports.default = AnalyticsService;