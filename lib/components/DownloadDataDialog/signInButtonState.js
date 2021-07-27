"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSignInButtonObservable = exports.getSignInButtonSubject = void 0;

var _rxjs = require("rxjs");

// observable for sharing button state with other components
var buttonSubject = new _rxjs.Subject();

var getSignInButtonSubject = function getSignInButtonSubject() {
  return buttonSubject;
};

exports.getSignInButtonSubject = getSignInButtonSubject;

var getSignInButtonObservable = function getSignInButtonObservable() {
  return buttonSubject.asObservable();
};

exports.getSignInButtonObservable = getSignInButtonObservable;