"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _history = require("history");
var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment"));
var _polyfillUtil = require("./polyfillUtil");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var history = (0, _history.createBrowserHistory)({
  basename: _NeonEnvironment.default.getRouterBasePath()
});

/**
 * Cleans the current browser path
 */
var cleanPath = function cleanPath() {
  var path = history.location.pathname;
  if ((0, _polyfillUtil.endsWithPolyfill)(path, '/')) {
    while ((0, _polyfillUtil.endsWithPolyfill)(path, '/')) {
      path = path.slice(0, path.length - 1);
    }
    history.replace(path);
  }
};
var HistoryService = {
  history: history,
  cleanPath: cleanPath
};
var _default = HistoryService;
exports.default = _default;