'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHistory = exports.cleanPath = undefined;

var _history = require('history');

var _routes = require('./routes');

var _polyfillUtil = require('../util/polyfillUtil');

var history = (0, _history.createBrowserHistory)({
  basename: _routes.ROUTES.BASE
  // forceRefresh: true
});

/**
 * Cleans the current browser path
 * @param {*} history
 */
/* eslint-disable no-shadow */
var cleanPath = exports.cleanPath = function cleanPath(history) {
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
var getHistory = exports.getHistory = function getHistory() {
  return history;
};

exports.default = getHistory;