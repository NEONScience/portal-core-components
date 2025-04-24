"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJson = exports.forkJoinWithProgress = exports.default = void 0;
var _rxjs = require("rxjs");
var _ajax = require("rxjs/ajax");
var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment/NeonEnvironment"));
var _typeUtil = require("./typeUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
const getJson = function (url, callback, errorCallback, cancellationSubject$) {
  let headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  let cors = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
  const request = {
    method: 'GET',
    url,
    responseType: 'json',
    headers: _extends({
      Accept: 'application/json'
    }, headers)
  };
  if (cors && _NeonEnvironment.default.requireCors()) {
    request.crossDomain = true;
    request.withCredentials = true;
  }
  const rxObs$ = (0, _ajax.ajax)(request).pipe((0, _rxjs.map)(response => {
    const appliedResponse = (0, _typeUtil.exists)(response) && (0, _typeUtil.exists)(response.response) ? response.response : response;
    if (typeof callback === 'function') {
      return (0, _rxjs.of)(callback(appliedResponse));
    }
    return (0, _rxjs.of)(appliedResponse);
  }), (0, _rxjs.catchError)(error => {
    console.error(error); // eslint-disable-line no-console
    if (typeof errorCallback === 'function') {
      return (0, _rxjs.of)(errorCallback(error));
    }
    return (0, _rxjs.of)(error);
  }), (0, _rxjs.takeUntil)(cancellationSubject$));

  // Placeholders for subscriber events, handled upstream in observable
  return rxObs$.subscribe({
    next: response => response,
    error: error => error,
    complete: complete => complete
  });
};
exports.getJson = getJson;
var _default = exports.default = getJson;
/**
  Convert an array of obbservables into a single observable block that reports progress
  (the number of completed observables out of the total) as a percentage from 0 to 100
 */
const forkJoinWithProgress = arrayOfObservables => (0, _rxjs.defer)(() => {
  let counter = 0;
  const percent$ = new _rxjs.Subject();
  const modifiedObservablesList = arrayOfObservables.map(item => item.pipe((0, _rxjs.finalize)(() => {
    counter += 1;
    const percentValue = counter * 100 / arrayOfObservables.length;
    percent$.next(percentValue);
  })));
  const finalResult$ = (0, _rxjs.forkJoin)(modifiedObservablesList).pipe((0, _rxjs.tap)(() => {
    percent$.next(100);
    percent$.complete();
  }));
  return (0, _rxjs.of)([finalResult$, percent$.asObservable()]);
});
exports.forkJoinWithProgress = forkJoinWithProgress;