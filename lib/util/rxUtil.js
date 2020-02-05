"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getJson = void 0;

var _rxjs = require("rxjs");

var _ajax = require("rxjs/ajax");

var _operators = require("rxjs/operators");

/**
 * Convenience method for utiliizing RxJS ajax.getJSON
 * @param {string} url
 * @param {any} callback
 * @param {any} errorCallback
 * @param {any} cancellationSubject$
 * @param {Object|undefined} headers
 * @return RxJS subscription
 */
var getJson = function getJson(url, callback, errorCallback, cancellationSubject$) {
  var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

  var rxObs$ = _ajax.ajax.getJSON(url, headers).pipe((0, _operators.map)(function (response) {
    if (typeof callback === 'function') {
      return (0, _rxjs.of)(callback(response));
    }

    return (0, _rxjs.of)(response);
  }), (0, _operators.catchError)(function (error) {
    console.error(error); // eslint-disable-line no-console

    if (typeof errorCallback === 'function') {
      return (0, _rxjs.of)(errorCallback(error));
    }

    return (0, _rxjs.of)(error);
  }), (0, _operators.takeUntil)(cancellationSubject$)); // Placeholders for subscriber events, handled upstream in observable


  return rxObs$.subscribe(function (response) {
    return response;
  }, function (error) {
    return error;
  }, function (complete) {
    return complete;
  });
};

exports.getJson = getJson;
var _default = getJson;
exports.default = _default;