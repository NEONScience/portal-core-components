"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getHistory = exports.cleanPath = void 0;

var _history = require("history");

var _routes = require("./routes");

var _polyfillUtil = require("../util/polyfillUtil");

/* eslint-disable no-shadow */
var history = (0, _history.createBrowserHistory)({
  basename: _routes.ROUTES.BASE // forceRefresh: true

});
/**
 * Cleans the current browser path
 * @param {*} history
 */

var cleanPath = function cleanPath(history) {
  var path = history.location.pathname;

  if ((0, _polyfillUtil.endsWithPolyfill)(path, '/')) {
    while ((0, _polyfillUtil.endsWithPolyfill)(path, '/')) {
      path = path.slice(0, path.length - 1);
    }

    history.replace(path);
  }
};
/**
 * Gets the history
 */


exports.cleanPath = cleanPath;

var getHistory = function getHistory() {
  return history;
};

exports.getHistory = getHistory;
var _default = getHistory;
exports.default = _default;