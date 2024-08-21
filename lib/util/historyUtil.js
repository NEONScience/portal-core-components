"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _polyfillUtil = require("./polyfillUtil");
/**
 * Cleans the current browser path
 */
const cleanPath = () => {
  let path = window.location.pathname;
  if ((0, _polyfillUtil.endsWithPolyfill)(path, '/')) {
    while ((0, _polyfillUtil.endsWithPolyfill)(path, '/')) {
      path = path.slice(0, path.length - 1);
    }
    window.history.replaceState(window.history.state, '', path);
  }
};
const HistoryService = {
  cleanPath
};
var _default = exports.default = HistoryService;