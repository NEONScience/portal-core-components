"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJson = exports.forkJoinWithProgress = exports.default = void 0;

var _rxjs = require("rxjs");

var _ajax = require("rxjs/ajax");

var _operators = require("rxjs/operators");

var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment/NeonEnvironment"));

var _typeUtil = require("./typeUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * Convenience method for utiliizing RxJS ajax.getJSON
 * @param {string} url
 * @param {any} callback
 * @param {any} errorCallback
 * @param {any} cancellationSubject$
 * @param {Object|undefined} headers
 * @param {boolean} cors
 * @return RxJS subscription
 */
var getJson = function getJson(url, callback, errorCallback, cancellationSubject$) {
  var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  var cors = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
  var request = {
    method: 'GET',
    url: url,
    responseType: 'json',
    headers: _extends({
      Accept: 'application/json'
    }, headers)
  };

  if (cors && _NeonEnvironment.default.requireCors()) {
    request.crossDomain = true;
    request.withCredentials = true;
  }

  var rxObs$ = (0, _ajax.ajax)(request).pipe((0, _operators.map)(function (response) {
    var appliedResponse = (0, _typeUtil.exists)(response) && (0, _typeUtil.exists)(response.response) ? response.response : response;

    if (typeof callback === 'function') {
      return (0, _rxjs.of)(callback(appliedResponse));
    }

    return (0, _rxjs.of)(appliedResponse);
  }), (0, _operators.catchError)(function (error) {
    console.error(error); // eslint-disable-line no-console

    if (typeof errorCallback === 'function') {
      return (0, _rxjs.of)(errorCallback(error));
    }

    return (0, _rxjs.of)(error);
  }), (0, _operators.takeUntil)(cancellationSubject$)); // Placeholders for subscriber events, handled upstream in observable

  return rxObs$.subscribe({
    next: function next(response) {
      return response;
    },
    error: function error(_error) {
      return _error;
    },
    complete: function complete(_complete) {
      return _complete;
    }
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