"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forkJoinWithProgress = exports.default = exports.getJson = void 0;

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
/**
  Convert an array of obbservables into a single observable block that reports progress
  (the number of completed observables out of the total) as a percentage from 0 to 100
 */

exports.default = _default;

var forkJoinWithProgress = function forkJoinWithProgress(arrayOfObservables) {
  return (0, _rxjs.defer)(function () {
    var counter = 0;
    var percent$ = new _rxjs.Subject();
    var modifiedObservablesList = arrayOfObservables.map(function (item) {
      return item.pipe((0, _operators.finalize)(function () {
        counter += 1;
        var percentValue = counter * 100 / arrayOfObservables.length;
        percent$.next(percentValue);
      }));
    });
    var finalResult$ = (0, _rxjs.forkJoin)(modifiedObservablesList).pipe((0, _operators.tap)(function () {
      percent$.next(100);
      percent$.complete();
    }));
    return (0, _rxjs.of)([finalResult$, percent$.asObservable()]);
  });
};

exports.forkJoinWithProgress = forkJoinWithProgress;