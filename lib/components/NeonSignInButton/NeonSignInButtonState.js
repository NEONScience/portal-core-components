"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _rxjs = require("rxjs");
// Instantiate the subject and observable.
var subject = new _rxjs.Subject();
var observable = subject.asObservable();

/**
 * Interface for sharing sign in button state.
 */

var NeonSignInButtonState = {
  getSubject: function getSubject() {
    return subject;
  },
  sendNotification: function sendNotification() {
    return subject.next();
  },
  getObservable: function getObservable() {
    return observable;
  }
};
Object.freeze(NeonSignInButtonState);
var _default = NeonSignInButtonState;
exports.default = _default;