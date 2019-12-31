'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJson = undefined;

var _rxjs = require('rxjs');

var _ajax = require('rxjs/ajax');

var _operators = require('rxjs/operators');

/**
 * Convenience method for utiliizing RxJS ajax.getJSON
 * @param {url} url
 * @param {callback} callback
 * @param {errorCallback} errorCallback
 * @param {cancellationSubject} cancellationSubject$
 * @return RxJS subscription
 */
var getJson = exports.getJson = function getJson(url, callback, errorCallback, cancellationSubject$) {
  var rxObs$ = _ajax.ajax.getJSON(url).pipe((0, _operators.map)(function (response) {
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
  }), (0, _operators.takeUntil)(cancellationSubject$));

  // Placeholders for subscriber events, handled upstream in observable
  return rxObs$.subscribe(function (response) {
    return response;
  }, function (error) {
    return error;
  }, function (complete) {
    return complete;
  });
};

exports.default = getJson;