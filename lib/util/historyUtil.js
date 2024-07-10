"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _history = require("history");
var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment"));
var _polyfillUtil = require("./polyfillUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const history = (0, _history.createBrowserHistory)({
  basename: _NeonEnvironment.default.getRouterBasePath()
});

/**
 * Cleans the current browser path
 */
const cleanPath = () => {
  let path = history.location.pathname;
  if ((0, _polyfillUtil.endsWithPolyfill)(path, '/')) {
    while ((0, _polyfillUtil.endsWithPolyfill)(path, '/')) {
      path = path.slice(0, path.length - 1);
    }
    history.replace(path);
  }
};
const HistoryService = {
  history,
  cleanPath
};
var _default = exports.default = HistoryService;